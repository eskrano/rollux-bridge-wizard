import React, {FC} from  "react";
import { BridgeForm, BridgeAction } from "../components/BridgeForm";
import { Card } from "react-bootstrap";

export const Deposit: FC<{}> = () => {

    const handleDeposit = (amount: string, isNative: boolean, tokenAddress: string) => {
        console.log("Submitted bridge");
        console.log(amount, isNative, tokenAddress);
    }

    return (
        <Card>
            <Card.Header>
                Deposit your tokens to Rollux
            </Card.Header>
            <Card.Body>
                <BridgeForm direction={BridgeAction.Deposit} onSubmit={handleDeposit}/>
            </Card.Body>
        </Card>
    )
}