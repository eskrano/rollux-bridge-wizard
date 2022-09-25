import React, { FC, useEffect, useState } from 'react'
import { Card, Row, Col, Button } from 'react-bootstrap';
import { ERC20DeploymentForm } from './ERC20DeploymentForm';
import { useEthers, useContractFunction } from '@usedapp/core';
import { Contract, utils } from 'ethers';
import FactoryABI from './../../../abi/DiamondContext.json'

export interface FirstStepPageProps {
    onERC20Deployed: () => void,
    onERC20Initialized: (facetAddress: string, index: number) => void
}

export const FirstStep: FC<FirstStepPageProps> = (props) => {

    


    const [firstErc20Name, setFirstErc20Name] = useState<string>('');
    const [firstErc20Symbol, setFirstErc20Symbol] = useState<string>('');
    const [firstErc20FacetAddress, setFirstErc20FacetAddress] = useState<string>('');

    const [secondErc20Name, setSecondErc20Name] = useState<string>('');
    const [secondErc20Symbol, setSecondErc20Symbol] = useState<string>('');
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
    const ERC20Facet1 = new Contract('0x1411121972e34093a0b190be37ea8d3310b094b4', new utils.Interface(FactoryABI));
    const ERC20Facet2 = new Contract('0x1411121972e34093a0b190be37ea8d3310b094b4', new utils.Interface(FactoryABI));


    const {send , state} = useContractFunction(factoryContract, 'deployDiamond');


    const {send: sendFirstInit , state:stateFirstInit } = useContractFunction(ERC20Facet1, 'initERC20BasicFacet');
    const {send: sendSecondInit, state: stateSecondInit } = useContractFunction(ERC20Facet2, 'initERC20BasicFacet');

    const executeDeployment = async () => {
        await send(['ERC20BasicFacet']);
        

        setTimeout(() => {
            setFirstErc20FacetAddress('0x1411121972e34093a0b190be37ea8d3310b094b4')
        }, 1000)
        setTimeout(() => {
            setSecondErc20FacetAddress('0x1411121972e34093a0b190be37ea8d3310b094b4')
        }, 3000)

        setTimeout(() => {
            setIsFirstConfigured(true);
        }, 6000);

        setTimeout(() => {
            setIsSecondConfigured(true)
        }, 9000);



        
    }


    return (
        <Card className='mt-3'>
            <Card.Header>
                Initialize ERC20 tokens
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col sm={6}>
                        <ERC20DeploymentForm setName={setFirstErc20Name} setSymbol={setFirstErc20Symbol} />
                    </Col>
                    <Col sm={6}>
                        <ERC20DeploymentForm setName={setSecondErc20Name} setSymbol={setSecondErc20Symbol} />
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