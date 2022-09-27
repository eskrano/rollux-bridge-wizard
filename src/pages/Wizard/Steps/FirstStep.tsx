import React, { FC, useEffect, useState } from 'react'
import { Card, Row, Col, Button } from 'react-bootstrap';
import { ERC20DeploymentForm } from './ERC20DeploymentForm';
import { useEthers, useContractFunction, useNetwork } from '@usedapp/core';
import { Contract, utils } from 'ethers';
import FactoryABI from './../../../abi/DiamondContext.json'
import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { Rollux } from '../../../networks/Rollux';

export interface FirstStepPageProps {
    onERC20Deployed: () => void,
    onERC20Initialized: (facetAddress: string, index: number) => void
}

export const FirstStep: FC<FirstStepPageProps> = (props) => {

    const { library } = useEthers();
    const { network } = useNetwork();


    const [firstErc20Name, setFirstErc20Name] = useState<string>('');
    const [firstErc20Symbol, setFirstErc20Symbol] = useState<string>('');
    const [firstErc20Supply, setFirstErc20Supply] = useState<string>('');
    const [firstErc20FacetAddress, setFirstErc20FacetAddress] = useState<string>('');
    const [firstErc20DiamondAddress, setFirstErc20DiamondAddress] = useState<string>('');

    const [secondErc20Name, setSecondErc20Name] = useState<string>('');
    const [secondErc20Symbol, setSecondErc20Symbol] = useState<string>('');
    const [secondErc20Supply, setSecondErc20Supply] = useState<string>('');
    const [secondErc20FacetAddress, setSecondErc20FacetAddress] = useState<string>('');

    // flags

    const [isFirstConfigured, setIsFirstConfigured] = useState<boolean>(false);
    const [isSecondConfigured, setIsSecondConfigured] = useState<boolean>(false);


    // effects

    useEffect(() => {
        if (isFirstConfigured && isSecondConfigured) {
            props.onERC20Initialized(firstErc20FacetAddress, 1);
            props.onERC20Initialized(secondErc20FacetAddress, 2);
        }
    }, [isFirstConfigured, isSecondConfigured]);

    // contracts

    const factoryContract = new Contract(process.env.REACT_APP_FACTORY_ADDRESS || '0x276A649285Cc2e1fF99437Fa93FDba3AA1EdE0B4', new utils.Interface(FactoryABI));
    const ERC20Facet1 = new Contract(firstErc20FacetAddress || Rollux.multicallAddress, new utils.Interface(FactoryABI));
    const ERC20Facet2 = new Contract(secondErc20FacetAddress || Rollux.multicallAddress, new utils.Interface(FactoryABI));


    const { send, state } = useContractFunction(factoryContract, 'deployDiamond');
    const { send: sendSecondFacet, state: stateSecondFacet } = useContractFunction(factoryContract, 'deployDiamond');


    const { send: sendFirstInit, state: stateFirstInit } = useContractFunction(ERC20Facet1, 'initERC20BasicFacet');
    const { send: sendSecondInit, state: stateSecondInit } = useContractFunction(ERC20Facet2, 'initERC20BasicFacet');


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

    /**
     * First facet & diamind
     */
    useEffect(() => {
        if (state.receipt) {
            const event = getDeployedEvent(state.receipt);

            if (event !== undefined) {
                //@ts-ignore
                setFirstErc20FacetAddress(event.args.facets[0])
                //@ts-ignore
                setFirstErc20DiamondAddress(event.args.newDiamond);
            }
        }
    }, [state])

    const configureFacet = async (symbol: string,
        name: string,
        totalSupply: string,
        flagConfigured: React.Dispatch<React.SetStateAction<boolean>>,
        facetAddress: string,

    ) => {

    }

    const executeDeployment = async () => {

      
        await sendSecondFacet(['ERC20BasicFacet']);


        // setTimeout(() => {
        //     setFirstErc20FacetAddress('0x1411121972e34093a0b190be37ea8d3310b094b4')
        // }, 1000)
        // setTimeout(() => {
        //     setSecondErc20FacetAddress('0x1411121972e34093a0b190be37ea8d3310b094b4')
        // }, 3000)

        // setTimeout(() => {
        //     setIsFirstConfigured(true);
        // }, 6000);

        // setTimeout(() => {
        //     setIsSecondConfigured(true)
        // }, 9000);




    }


    return (
        <Card className='mt-3'>
            <Card.Header>
                Initialize ERC20 tokens
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col sm={6}>
                        <ERC20DeploymentForm setTotalSupply={setFirstErc20Supply} setName={setFirstErc20Name} setSymbol={setFirstErc20Symbol} />
                    </Col>
                    <Col sm={6}>
                        <ERC20DeploymentForm setTotalSupply={setSecondErc20Supply} setName={setSecondErc20Name} setSymbol={setSecondErc20Symbol} />
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        <div className='d-flex mt-3 align-content-center flex-wrap'>
                            <Button onClick={() => executeDeployment()} className='d-flex align-content-center' variant="primary">
                                Start deployment
                            </Button>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col sm={12}>
                        {firstErc20FacetAddress !== '' && <p>First facet ERC20 token deployed.</p>}
                        {secondErc20FacetAddress !== '' && <p>Second facet ERC20 token deployed.</p>}
                        {isFirstConfigured && <p>First ERC20 facet configured. ({firstErc20Name} / {firstErc20Symbol} )</p>}
                        {isSecondConfigured && <p>Second ERC20 facet configured. ({secondErc20Name} / {secondErc20Symbol} )</p>}

                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}