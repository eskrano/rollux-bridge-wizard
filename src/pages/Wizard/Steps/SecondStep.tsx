import { Contract, ethers, utils } from "ethers";
import React, { FC, useEffect, useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { FirstStepConfiguredCallbackProps } from "./FirstStep";
import FactoryAbi from "../../../abi/UniV2Factory.json"
import ERC20Abi from "../../../abi/ERC20BasicFacet.json"
import { Falsy, useContractFunction, useEthers, useTokenBalance } from "@usedapp/core";
import { LogDescription } from "ethers/lib/utils";
import { shortenAddress } from "@usedapp/core";


export interface SecondStepProps {
    firstStepResults: FirstStepConfiguredCallbackProps
}

export const SecondStep: FC<SecondStepProps> = (props: SecondStepProps) => {

    const factoryAddress: string = '0x734D8ed3eF0a9F7474bE75252182a6e4ea3B1fEB';

    const { account } = useEthers();


    const [isPairInitialized, setIsPairInitialized] = useState<boolean>(false);
    const [pairAddress, setPairAddress] = useState<string>('');

    //

    const [token0Amount, setToken0Amount] = useState<string>('0.00');
    const [token1Amount, setToken1Amount] = useState<string>('0.00');

    // contracts

    const [token0Contract, setToken0Contract] = useState<Contract | Falsy>(null);
    const [token1Contract, setToken1Contract] = useState<Contract | Falsy>(null);


    useEffect(() => {
        if (ethers.utils.isAddress(props.firstStepResults.erc1_diamondAddress)) {
            setToken0Contract(
                new Contract(props.firstStepResults.erc1_diamondAddress, new utils.Interface(ERC20Abi))
            );
        }

        if (ethers.utils.isAddress(props.firstStepResults.erc2_diamondAddress)) {
            setToken1Contract(
                new Contract(props.firstStepResults.erc2_diamondAddress, new utils.Interface(ERC20Abi))
            );
        }
    }, [props.firstStepResults.erc1_diamondAddress, props.firstStepResults.erc2_diamondAddress]);



    const dexRouter = new Contract(factoryAddress, new utils.Interface(FactoryAbi));

    const { send: sendCreatePair, state: stateCreatePair, events: eventsCreatePair } = useContractFunction(dexRouter, 'createPair', { transactionName: 'Create pair.' });
    const { send: sendApprove0, state: stateApprove0 } = useContractFunction(token0Contract, 'approve', { transactionName: 'Approve 0' });
    const { send: sendApprove1, state: stateApprove1 } = useContractFunction(token1Contract, 'approve', { transactionName: 'Approve 1' });

    const token0Balance = useTokenBalance(props.firstStepResults.erc1_diamondAddress, account);
    const token1Balance = useTokenBalance(props.firstStepResults.erc2_diamondAddress, account);

    // const { send : sendApprove0, state: stateApprove0 } = 

    useEffect(() => {
        if (stateCreatePair.receipt && eventsCreatePair) {
            let pairInitialized: boolean = false;

            eventsCreatePair.forEach((item: LogDescription, index: number) => {
                if (item.name === 'PairCreated') {
                    setIsPairInitialized(true);
                    setPairAddress(item.args[2]);
                }
            })
        }
    }, [stateCreatePair, eventsCreatePair])

    const handleCreatePair = async () => {
        const approval0 = await sendApprove0(factoryAddress, ethers.utils.parseEther(token0Amount));
        const approval1 = await sendApprove1(factoryAddress, ethers.utils.parseEther(token1Amount));

        if (approval0 && approval1) {
            console.log(props.firstStepResults.erc1_diamondAddress,
                props.firstStepResults.erc2_diamondAddress);

            await sendCreatePair(
                props.firstStepResults.erc1_diamondAddress,
                props.firstStepResults.erc2_diamondAddress,
                { gasLimit: 15000000 }
            )
        }
    }

    return (
        <Card className="mt-3">
            <Card.Header>
                Initialize Pegasys pair and load liquidity
            </Card.Header>
            <Card.Body>
                <Row className={isPairInitialized === true ? 'not-active' : ''}>
                    <Col sm={6}>
                        <b>{shortenAddress(props.firstStepResults.erc1_diamondAddress)}</b>
                        <br/>
                        {token0Balance && ethers.utils.formatEther(token0Balance)} available
                    </Col>
                    <Col sm={6}>
                        <b>{shortenAddress(props.firstStepResults.erc2_diamondAddress)}</b>
                        <br/>
                        {token1Balance && ethers.utils.formatEther(token1Balance)} available
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <div className="form-group">
                            <label htmlFor="token0_amount">
                                Token 0 amount
                            </label>
                            <input type='text' className="form-control" />
                        </div>
                    </Col>
                    <Col sm={6}>
                        <div className="form-group">
                            <label htmlFor="token1_amount">
                                Token 1 amount
                            </label>
                            <input type='text' className="form-control" />
                        </div>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col sm={12}>
                        <Button variant="primary" onClick={() => handleCreatePair()}>Initialize pair</Button>
                    </Col>
                </Row>
            </Card.Body>
        </Card >
    )
}