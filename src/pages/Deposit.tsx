import React, {FC, useEffect, useState} from  "react";
import { BridgeForm, BridgeAction } from "../components/BridgeForm";
import { Alert, Card } from "react-bootstrap";
import { Contract, utils } from "ethers";
import BridgeABI from "../abi/BridgeContract.json"
import { useContractFunction } from "@usedapp/core";
import { Variant } from "react-bootstrap/esm/types";
import { stat } from "fs";


export const Deposit: FC<{}> = () => {

    const NON_NULL_BYTES32 = '0x1111111111111111111111111111111111111111111111111111111111111111'
    const contractAddress = "0x35141FB96fbC6A8F9D5D239b5a6256F056634672";
    const bridgeContractEthers = new Contract(
        contractAddress,
        new utils.Interface(BridgeABI)
    )

    const [message, setMessage] = useState<string>('');
    const [messageVariant, setMessageVariant] = useState<Variant>('primary');

    const { send: sendDepositCall , state: stateDepositCall} = useContractFunction(
        bridgeContractEthers,
        "depositETH"
    )

    useEffect(() => {
        setMessage(`TX Status  = ${stateDepositCall.status}`)
    }, [stateDepositCall]) 

    const handleDeposit = async (amount: string, isNative: boolean, tokenAddress: string) => {
        console.log("Submitted bridge");
        console.log(amount, isNative, tokenAddress);

        await sendDepositCall(
            1_200_000,
            NON_NULL_BYTES32,
            { value: utils.parseEther(amount) }
        )

        setMessage('Deposit tx was sent.');
    }

    return (
        <Card>
            <Card.Header>
                Deposit your tokens to Rollux
            </Card.Header>
            <Card.Body>
                {message.length > 0 && <Alert variant={messageVariant}>
                        {message}
                    </Alert>} 
                <BridgeForm direction={BridgeAction.Deposit} onSubmit={handleDeposit}/>
            </Card.Body>
        </Card>
    )
}