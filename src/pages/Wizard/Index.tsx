import { Falsy } from "@usedapp/core";
import React, { FC, useState } from "react";
import { Container, Card } from "react-bootstrap";
import { FirstStep, FirstStepConfiguredCallbackProps } from "./Steps/FirstStep";
import { SecondStep } from "./Steps/SecondStep";
import { ThirdStep } from "./Steps/ThirdStep";


export const Index: FC<{}> = () => {
    const [step, setStep] = useState<number>(1);

    const [firstStepResults, setFirstStepResults] = useState<FirstStepConfiguredCallbackProps | Falsy>(null)
    const [secondStepResults, setSecondStepResults] = useState<string>('');

    const handleSecondStepDone = (pairAddress: string) => {
        setSecondStepResults(pairAddress);
        setStep(3);
    }


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
                    {secondStepResults !== '' && <>
                        <hr />
                        <p>
                            <b>Pair address</b>: {secondStepResults}
                        </p>
                    </>}
                </Card.Footer>
            </Card>

            {(step === 3 && firstStepResults !== null) && <ThirdStep firstStepProps={firstStepResults as FirstStepConfiguredCallbackProps} lPAddress={secondStepResults} />}
            {(step === 2 && firstStepResults !== null) && <SecondStep onPairInitialized={handleSecondStepDone} firstStepResults={firstStepResults as FirstStepConfiguredCallbackProps} />}
            {step === 1 && <FirstStep onDone={handleFirstStepDone} />}



        </Container>
    );
}