import { Falsy } from "@usedapp/core";
import React, { FC, useState } from "react";
import { Container, Card } from "react-bootstrap";
import { FirstStep, FirstStepConfiguredCallbackProps } from "./Steps/FirstStep";
import { SecondStep } from "./Steps/SecondStep";


export const Index: FC<{}> = () => {
    const [step, setStep] = useState<number>(1);

    const [firstStepResults, setFirstStepResults] = useState<FirstStepConfiguredCallbackProps | Falsy>(null)

    const handleFirstStepDone = (results: FirstStepConfiguredCallbackProps) => {
        setFirstStepResults(results);
        setStep(2);
    }

    return (
        <Container fluid>
            <h1>Welcome to Rollux wizard</h1>
            <Card>
                <Card.Body>
                    <p>Hello , I am Rollux Wizard , I will help you with deployments :)</p>
                </Card.Body>
                <Card.Footer>
                    {firstStepResults && <>
                        {Object.keys(firstStepResults).map((value: string, index: number) => {
                            return <p key={index}><b>{value}</b>: {firstStepResults[value as keyof FirstStepConfiguredCallbackProps]} </p>
                        })}
                    </>}
                </Card.Footer>
            </Card>

            {(step >= 2 && firstStepResults !== null) && <SecondStep firstStepResults={firstStepResults as FirstStepConfiguredCallbackProps} />}
            {step == 1 && <FirstStep onDone={handleFirstStepDone} />}



        </Container>
    );
}