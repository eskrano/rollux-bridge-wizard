import React, { FC, useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import { FirstStepConfiguredCallbackProps } from "./FirstStep";
import FactoryABI from './../../../abi/DiamondContext.json'
import { useContractFunction } from "@usedapp/core";
import { Contract, utils } from "ethers";

export interface ThirdStepProps {
    firstStepProps: FirstStepConfiguredCallbackProps,
    lPAddress: string
}

export const ThirdStep: FC<ThirdStepProps> = (props) => {


    const factoryContract = new Contract('0xcF7d5c20b1f60b2326305A0BB256359EDC714c1A', new utils.Interface(FactoryABI));


    const { send: deployDiamond, state: deployDiamondState, events: diamondDeployEvents } = useContractFunction(factoryContract, 'deployDiamond');

    useEffect(() => {
        if (deployDiamondState.receipt) {
            console.log(diamondDeployEvents);
        }
    }, [deployDiamondState, diamondDeployEvents])

    const execute = async () => {
        deployDiamond(['UniV2IndexingVaultFacet'], { gasLimit: 15000000 });
    }


    return (
        <Card className="mt-3">

            <Card.Header>
                Setting up vault
            </Card.Header>

            <Card.Body>
                <p>
                    Wizard will setup a vault for you.

                    Just click button above to run process.
                </p>

                <Button onClick={() => execute()} className="mt-3">
                    Run setup
                </Button>
            </Card.Body>
        </Card>
    );
}