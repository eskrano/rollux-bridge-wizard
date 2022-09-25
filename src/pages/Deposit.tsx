import React, {FC} from  "react";
import { BridgeForm, BridgeAction } from "../components/BridgeForm";
import { Card } from "react-bootstrap";

export const Deposit: FC<{}> = () => {
    return (
        <Card>
            <Card.Header>
                Deposit your tokens to Rollux
            </Card.Header>
            <Card.Body>
                <BridgeForm direction={BridgeAction.Deposit} />
            </Card.Body>
        </Card>
    )
}