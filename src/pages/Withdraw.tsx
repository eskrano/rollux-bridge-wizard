import React, {FC} from "react"
import { Card } from "react-bootstrap"
import { BridgeForm, BridgeAction } from "../components/BridgeForm"


export const Withdraw: FC<{}> = () => {
    return (
        <Card>
            <Card.Header>
                Withdraw your tokens from Rollux
            </Card.Header>
            <Card.Body>
                <BridgeForm direction={BridgeAction.Withdraw} />
            </Card.Body>
        </Card>
    )
}