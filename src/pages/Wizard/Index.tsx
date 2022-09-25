import React, {FC, useState} from "react";
import { Container, Card } from "react-bootstrap";
import { FirstStep } from "./Steps/FirstStep";


export const Index: FC<{}> = () => {
    const [step, setStep] = useState<number>(1);

    return (
        <Container fluid>
            <h1>Welcome to Rollux wizard</h1>
            <Card>
                <Card.Body>
                    <p>Hello , I am Rollux Wizard , I will help you with deployments :)</p>
                </Card.Body>
            </Card>

            {step === 1 && <FirstStep onERC20Deployed={() => {}} onERC20Initialized={(facetAddress: string, index: number)=>{ console.log(facetAddress, index) }}/> }

            
            
        </Container>
    );
}