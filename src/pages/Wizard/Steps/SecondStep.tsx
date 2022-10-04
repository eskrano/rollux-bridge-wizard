import { Contract, ethers, utils } from "ethers";
import React, { FC, useEffect, useMemo, useState } from "react";
import { Card, Row, Col, Button, Alert } from "react-bootstrap";
import { FirstStepConfiguredCallbackProps } from "./FirstStep";
import RouterABI from "../../../abi/PegasysRouter.json"
import * as dayjs from 'dayjs'
import ERC20Abi from "../../../abi/ERC20BasicFacet.json"
import FactoryABI from "../../../abi/PegasysFactory.json"
import { Falsy, useContractFunction, useEthers, useTokenBalance } from "@usedapp/core";
import { shortenAddress } from "@usedapp/core";


export interface SecondStepProps {
    firstStepResults: FirstStepConfiguredCallbackProps,
    onPairInitialized: (pairAddress: string) => void
}

export const SecondStep: FC<SecondStepProps> = (props: SecondStepProps) => {

    const factoryAddress: string = '0x734D8ed3eF0a9F7474bE75252182a6e4ea3B1fEB';

    const { account, library } = useEthers();


    const [isPairInitialized, setIsPairInitialized] = useState<boolean>(false);
    const [pairAddress, setPairAddress] = useState<string>('');

    //

    const [token0Amount, setToken0Amount] = useState<string>('0.00');
    const [token1Amount, setToken1Amount] = useState<string>('0.00');

    // contracts

    const [token0Contract, setToken0Contract] = useState<Contract | Falsy>(null);
    const [token1Contract, setToken1Contract] = useState<Contract | Falsy>(null);


    useEffect(() => {
        if (isPairInitialized && ethers.constants.AddressZero !== pairAddress && pairAddress !== '') {
            props.onPairInitialized(pairAddress);
        }
    }, [isPairInitialized, pairAddress, props])

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


    const dexRouter = useMemo(() => {
        return new Contract(factoryAddress, new utils.Interface(RouterABI));
    }, [factoryAddress])


    // const dexRouter = new Contract(factoryAddress, new utils.Interface(RouterABI));

    const { send: sendCreatePair, state: stateCreatePair} = useContractFunction(dexRouter, 'addLiquidity', { transactionName: 'Create pair.' });
    const { send: sendApprove0 } = useContractFunction(token0Contract, 'approve', { transactionName: 'Approve 0' });
    const { send: sendApprove1 } = useContractFunction(token1Contract, 'approve', { transactionName: 'Approve 1' });

    const token0Balance = useTokenBalance(props.firstStepResults.erc1_diamondAddress, account);
    const token1Balance = useTokenBalance(props.firstStepResults.erc2_diamondAddress, account);

    useEffect(() => {

        // console.log(eventsCreatePair);
        // console.log(stateCreatePair)

        const findPair = async (token0: string, token1: string, _router: Contract): Promise<string> => {
            if (library) {
                const factory = (new Contract(await _router.connect(library.getSigner()).factory(), new utils.Interface(FactoryABI))).connect(library.getSigner());

                return await factory.getPair(token0, token1);
            }
            return ethers.constants.AddressZero;
        }

        if (stateCreatePair.receipt) {
            findPair(
                props.firstStepResults.erc1_diamondAddress,
                props.firstStepResults.erc2_diamondAddress,
                dexRouter
            ).then((pairAddress: string) => {
                if (pairAddress !== ethers.constants.AddressZero) {
                    setIsPairInitialized(true);
                    setPairAddress(pairAddress);
                }
            })

        }
    }, [stateCreatePair, props.firstStepResults.erc1_diamondAddress, props.firstStepResults.erc2_diamondAddress, dexRouter, library])

    const handleCreatePair = async () => {
        const approval0 = await sendApprove0(factoryAddress, ethers.utils.parseEther(token0Amount));
        const approval1 = await sendApprove1(factoryAddress, ethers.utils.parseEther(token1Amount));

        if (approval0 && approval1) {

            // console.log(
            //     props.firstStepResults.erc1_diamondAddress,
            //     props.firstStepResults.erc2_diamondAddress,
            //     ethers.utils.parseEther(token0Amount),
            //     ethers.utils.parseEther(token1Amount),
            //     ethers.utils.parseEther("0"),
            //     ethers.utils.parseEther("0"),
            //     account,
            //     dayjs.default().add(1, 'hour').unix()
            // )


            await sendCreatePair(
                props.firstStepResults.erc1_diamondAddress,
                props.firstStepResults.erc2_diamondAddress,
                ethers.utils.parseEther(token0Amount),
                ethers.utils.parseEther(token1Amount),
                ethers.utils.parseEther("0"),
                ethers.utils.parseEther("0"),
                account,
                dayjs.default().add(1, 'hour').unix()
            )
        }
    }

    return (
        <Card className="mt-3">
            <Card.Header>
                Initialize Pegasys pair and load liquidity

                {isPairInitialized && <Alert className="mt-3 mb-3">
                    Pair initialized. <b>{pairAddress}</b>
                </Alert>}
            </Card.Header>
            <Card.Body className={isPairInitialized === true ? 'not-active' : ''}>

                <Row >
                    <Col sm={6}>
                        <b>{shortenAddress(props.firstStepResults.erc1_diamondAddress)}</b>
                        <br />
                        {token0Balance && ethers.utils.formatEther(token0Balance)} available
                    </Col>
                    <Col sm={6}>
                        <b>{shortenAddress(props.firstStepResults.erc2_diamondAddress)}</b>
                        <br />
                        {token1Balance && ethers.utils.formatEther(token1Balance)} available
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <div className="form-group">
                            <label htmlFor="token0_amount">
                                Token 0 amount
                            </label>
                            <input type='text' className="form-control" onChange={(e) => setToken0Amount(e.target.value)} />
                        </div>
                    </Col>
                    <Col sm={6}>
                        <div className="form-group">
                            <label htmlFor="token1_amount">
                                Token 1 amount
                            </label>
                            <input type='text' className="form-control" onChange={(e) => setToken1Amount(e.target.value)} />
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