import React, { FC } from "react"
import { Alert, AlertProps } from "react-bootstrap"


export interface AlertMessageProps {
    message: string,
    messageProps: AlertProps
}

export const AlertMessage: FC<AlertMessageProps> = (props) => {
    return (
        <Alert {...props.messageProps}>
            {props.message}
        </Alert>
    )
}