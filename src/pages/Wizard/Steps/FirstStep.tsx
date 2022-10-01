import React, { FC, useEffect, useState } from 'react'
import { Card, Row, Col, Button } from 'react-bootstrap';
import { ERC20DeploymentForm } from './ERC20DeploymentForm';
import { useEthers, useContractFunction, useNetwork, Falsy } from '@usedapp/core';
import { Contract, utils } from 'ethers';
import FactoryABI from './../../../abi/DiamondContext.json'
import ERC20BasicFacet from './../../../abi/ERC20BasicFacet.json'
import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { Rollux } from '../../../networks/Rollux';

export interface FirstStepPageProps {
    onDone: (results: FirstStepConfiguredCallbackProps) => void,
}

export interface FirstStepConfiguredCallbackProps {
    erc1_name: string,
    erc1_symbol: string,
    erc1_ts: string,
    erc1_facetAddress: string,
    erc1_diamondAddress: string,
    erc2_name: string,
    erc2_symbol: string,
    erc2_ts: string,
    erc2_facetAddress: string,
    erc2_diamondAddress: string,
}

export const FirstStep: FC<FirstStepPageProps> = (props) => {

    const { library } = useEthers();


    const [firstErc20Name, setFirstErc20Name] = useState<string>('');
    const [firstErc20Symbol, setFirstErc20Symbol] = useState<string>('');
    const [firstErc20Supply, setFirstErc20Supply] = useState<string>('');
    const [firstErc20FacetAddress, setFirstErc20FacetAddress] = useState<string>('');
    const [firstErc20DiamondAddress, setFirstErc20DiamondAddress] = useState<string>('');

    const [secondErc20Name, setSecondErc20Name] = useState<string>('');
    const [secondErc20Symbol, setSecondErc20Symbol] = useState<string>('');
    const [secondErc20Supply, setSecondErc20Supply] = useState<string>('');
    const [secondErc20FacetAddress, setSecondErc20FacetAddress] = useState<string>('');
    const [secondErc20DiamondAddress, setSecondErc20DiamondAddress] = useState<string>('');

    // flags

    const [isFirstConfigured, setIsFirstConfigured] = useState<boolean>(false);
    const [isSecondConfigured, setIsSecondConfigured] = useState<boolean>(false);

    // contracts 

    const [ERC20Facet1, setERC20Facet1] = useState<Contract | Falsy>(null);
    const [ERC20Facet2, setERC20Facet2] = useState<Contract | Falsy>(null);

    // ui flags

    const [hideDeployButton, setHideDeployButton] = useState<boolean>(false);
    const [hideConfigureButton, setHideConfigureButton] = useState<boolean>(false);


    // effects





    useEffect(() => {
        if (utils.isAddress(firstErc20DiamondAddress)) {
            setERC20Facet1(
                new Contract(firstErc20DiamondAddress, new utils.Interface(ERC20BasicFacet))
            )
        }
    }, [firstErc20DiamondAddress])


    useEffect(() => {
        if (utils.isAddress(secondErc20DiamondAddress)) {
            setERC20Facet2(
                new Contract(secondErc20DiamondAddress, new utils.Interface(ERC20BasicFacet))
            )
        }
    }, [secondErc20DiamondAddress])


    // contracts

    const factoryContract = new Contract('0xcF7d5c20b1f60b2326305A0BB256359EDC714c1A', new utils.Interface(FactoryABI));


    const { send, state } = useContractFunction(factoryContract, 'deployDiamond');
    const { send: sendSecondFacet, state: stateSecondFacet } = useContractFunction(factoryContract, 'deployDiamond');


    const { send: sendFirstInit, state: stateFirstInit } = useContractFunction(ERC20Facet1, 'initERC20BasicFacet');
    const { send: sendSecondInit, state: stateSecondInit } = useContractFunction(ERC20Facet2, 'initERC20BasicFacet');



    useEffect(() => {
        if (isFirstConfigured && isSecondConfigured) {
            props.onDone({
                erc1_name: firstErc20Name,
                erc1_symbol: firstErc20Symbol,
                erc1_ts: firstErc20Supply,
                erc1_diamondAddress: firstErc20DiamondAddress,
                erc1_facetAddress: firstErc20FacetAddress,
                erc2_name: secondErc20Name,
                erc2_symbol: secondErc20Supply,
                erc2_ts: secondErc20Supply,
                erc2_diamondAddress: secondErc20DiamondAddress,
                erc2_facetAddress: secondErc20FacetAddress,
            })

            setHideConfigureButton(true);
        }
    }, [
        isFirstConfigured,
        isSecondConfigured,
        firstErc20DiamondAddress,
        firstErc20FacetAddress,
        firstErc20Name,
        firstErc20Supply,
        firstErc20Symbol,
        secondErc20Name,
        secondErc20Symbol,
        secondErc20Supply,
        secondErc20DiamondAddress,
        secondErc20FacetAddress
    ])

    useEffect(() => {
        if (stateFirstInit.receipt) {
            setIsFirstConfigured(true);
        }
    }, [stateFirstInit]);

    useEffect(() => {
        if (stateSecondInit.receipt) {
            setIsSecondConfigured(true);
        }
    }, [stateSecondInit]);

    const getDeployedEvent = (receipt: TransactionReceipt): Array<string> | undefined => {
        // @ts-ignore
        const _events = receipt.events;
        let deployEvent: {} | null = null;

        Array.from(_events).forEach((item: any) => {
            if (deployEvent === null && item.event === 'DiamondDeployed') {
                deployEvent = item;
            }
        })

        if (null === deployEvent) {
            console.warn("Deploy event not found.")

            return undefined;
        }

        return deployEvent;
    }

    const configureFacets = async () => {

        setHideDeployButton(true);


        await sendFirstInit(
            firstErc20Name,
            firstErc20Symbol,
            utils.parseEther(firstErc20Supply),
            { gasLimit: 10000000 }
        )


        await sendSecondInit(
            secondErc20Name,
            secondErc20Symbol,
            utils.parseEther(secondErc20Supply),
            { gasLimit: 10000000 }
        )

    }


    /**
     * First facet & diamond
     */
    useEffect(() => {
        if (state.receipt) {
            const event = getDeployedEvent(state.receipt);

            if (event !== undefined) {

                console.log("FACET---1")
                // @ts-ignore
                console.log(event.args);

                //@ts-ignore
                setFirstErc20FacetAddress(event.args.facets[0])
                //@ts-ignore
                setFirstErc20DiamondAddress(event.args.newDiamond);
            }
        }
    }, [state])

    useEffect(() => {
        if (stateSecondFacet.receipt) {
            const event = getDeployedEvent(stateSecondFacet.receipt);

            if (event !== undefined) {

                console.log("FACET---2")
                // @ts-ignore
                console.log(event.args);
                //@ts-ignore
                setSecondErc20FacetAddress(event.args.facets[0])
                //@ts-ignore
                setSecondErc20DiamondAddress(event.args.newDiamond);
            }
        }
    }, [stateSecondFacet])


    const executeDeployment = async () => {
        console.log(factoryContract.address);

        await send(['ERC20BasicFacet']);

        await sendSecondFacet(['ERC20BasicFacet']);


    }


    return (
        <Card className='mt-3'>
            <Card.Header>
                Initialize ERC20 tokens {(isFirstConfigured && isSecondConfigured) && <span className="text-bold text-success">Done!</span>}
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col sm={6} className={isFirstConfigured ? 'not-active' : ''}>
                        <ERC20DeploymentForm setTotalSupply={setFirstErc20Supply} setName={setFirstErc20Name} setSymbol={setFirstErc20Symbol} />
                    </Col>
                    <Col sm={6} className={isSecondConfigured ? 'not-active' : ''}>
                        <ERC20DeploymentForm setTotalSupply={setSecondErc20Supply} setName={setSecondErc20Name} setSymbol={setSecondErc20Symbol} />
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} className={hideDeployButton === true ? 'not-active': ''}>
                        <div className='d-flex mt-3 align-content-center flex-wrap'>
                            <Button onClick={() => executeDeployment()} className='d-flex align-content-center' variant="primary">
                                Deploy facets
                            </Button>
                        </div>
                    </Col>
                    {(firstErc20FacetAddress.length > 0 && secondErc20FacetAddress.length > 0) && <>
                        <Col sm={4} className={hideConfigureButton === true ? 'not-active': ''}>
                            <div className='d-flex mt-3 align-content-center flex-wrap'>
                                <Button onClick={() => configureFacets()} className='d-flex align-content-center' variant="warning">
                                    Configure facets
                                </Button>
                            </div>
                        </Col>
                    </>}

                </Row>
            </Card.Body>
        </Card>
    );
}