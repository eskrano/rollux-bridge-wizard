import React, { FC, useEffect, useState } from "react"
import { Card, Row, Col, Button } from "react-bootstrap";
import { tokens } from "../config/tokens";


export enum BridgeAction {
    Deposit = "Deposit",
    Withdraw = "Withdraw",
}

interface IBridgeFormProps {
    direction: BridgeAction,
    onSubmit: (amount: string, isNative: boolean, tokenAddress: string) => void
}

export const BridgeForm: FC<IBridgeFormProps> = (props) => {
    const [amount, setAmount] = useState<string>('0.00');
    const [isNative, setIsNative] = useState<boolean>(true);
    const [token, setToken] = useState<string>('main');

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [infoMessage, setInfoMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    useEffect(() => {
        if (token === 'main') {
            setIsNative(true);
        } else {
            setIsNative(false);
        }
    }, [token]);

    const direction: BridgeAction = props.direction;

    const handleSubmit = async () => {
        if (parseFloat(amount) <= 0) {
            setErrorMessage("Amount should be greater than 0.");

            return;
        }

        props.onSubmit(
            amount,
            isNative,
            token
        )
    }


    return (
        <Card>
            <Card.Body>
                <Row className="mt-3">
                    <Col sm={12} md={12}>
                        <div className="form-group">
                            <label htmlFor="amount">
                                Amount of tokens
                            </label>
                            <input type="number" className="form-control" id="amount" value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col sm={12} md={12}>
                        <div className="form-group">
                            <label htmlFor="Token">
                                Select Token
                            </label>
                            <select className="form-control" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                setToken(e.target.value)
                            }}>
                                <option value="main">tSYS</option>
                                {Object.keys(tokens).map((value, index) => {
                                    return (
                                        <option key={value} value={value}>{tokens[value].name}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col sm={12} md={12}>
                        <div className="d-flex d-block">
                            {isNative && <Button onClick={handleSubmit} variant="success">{direction}</Button>}
                            {!isNative && <Button variant="primary">Approve {direction} </Button>}
                        </div>
                    </Col>
                </Row>

            </Card.Body>
        </Card >
    );
}