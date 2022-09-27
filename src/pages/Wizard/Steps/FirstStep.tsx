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
    const [secondErc20DiamondAddress, setSecondErc20DiamondAddress] = useState<string>('');

    // flags

    const [isFirstConfigured, setIsFirstConfigured] = useState<boolean>(false);
    const [isSecondConfigured, setIsSecondConfigured] = useState<boolean>(false);

    // contracts 

    const [ERC20Facet1, setERC20Facet1] = useState<Contract | Falsy>(null);
    const [ERC20Facet2, setERC20Facet2] = useState<Contract | Falsy>(null);

    // effects

    useEffect(() => {
        if (utils.isAddress(firstErc20FacetAddress)) {
            setERC20Facet1(
                new Contract(firstErc20FacetAddress, new utils.Interface(ERC20BasicFacet))
            )
        }
    }, [firstErc20FacetAddress])


    useEffect(() => {
        if (utils.isAddress(secondErc20FacetAddress)) {
            setERC20Facet2(
                new Contract(secondErc20FacetAddress, new utils.Interface(ERC20BasicFacet))
            )
        }
    }, [secondErc20FacetAddress])

    useEffect(() => {
        if (isFirstConfigured && isSecondConfigured) {
            props.onERC20Initialized(firstErc20FacetAddress, 1);
            props.onERC20Initialized(secondErc20FacetAddress, 2);
        }
    }, [isFirstConfigured, isSecondConfigured]);

    // contracts

    const factoryContract = new Contract('0x49533069283be8DD3B59ca0A3bbAd044B2f9f0B6', new utils.Interface(FactoryABI));
    // const ERC20Facet1 = new Contract(firstErc20FacetAddress || Rollux.multicallAddress, new utils.Interface(ERC20BasicFacet));
    // const ERC20Facet2 = new Contract(secondErc20FacetAddress || Rollux.multicallAddress, new utils.Interface(ERC20BasicFacet));


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

    const configureFacets = async () => {

        if (ERC20Facet1) {
            console.log(
                firstErc20Name,
                firstErc20Symbol,
                utils.parseEther(firstErc20Supply),
                ERC20Facet1?.address
            )
        }

        await sendFirstInit(
            firstErc20Name,
            firstErc20Symbol,
            utils.parseEther(firstErc20Supply)
        )



        await sendSecondInit(
            secondErc20Name,
            secondErc20Symbol,
            utils.parseEther(secondErc20Supply)
        )
    }


    /**
     * First facet & diamond
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

    useEffect(() => {
        if (stateSecondFacet.receipt) {
            const event = getDeployedEvent(stateSecondFacet.receipt);

            if (event !== undefined) {
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
                    <Col sm={4}>
                        <div className='d-flex mt-3 align-content-center flex-wrap'>
                            <Button onClick={() => executeDeployment()} className='d-flex align-content-center' variant="primary">
                                Deploy facets
                            </Button>
                        </div>
                    </Col>
                    {(firstErc20FacetAddress.length > 0 && secondErc20FacetAddress.length > 0) && <>
                        <Col sm={4}>
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