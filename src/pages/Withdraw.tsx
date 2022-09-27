import React, {FC} from "react"
import { Card } from "react-bootstrap"
import { BridgeForm, BridgeAction } from "../components/BridgeForm"


export const Withdraw: FC<{}> = () => {

    const handleWithdraw = (amount: string, isNative: boolean, tokenAddress: string) => {
        console.log("Submitted bridge");
        console.log(amount, isNative, tokenAddress);
    }


    return (
        <Card>
            <Card.Header>
                Withdraw your tokens from Rollux
            </Card.Header>
            <Card.Body>
                <BridgeForm direction={BridgeAction.Withdraw} onSubmit={handleWithdraw}/>
            </Card.Body>
        </Card>
    )
}