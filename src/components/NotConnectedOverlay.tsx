import React, {FC} from "react";
import { useEthers } from "@usedapp/core";


export const NotConnectedOverlay : FC<{children: JSX.Element}> = (props) => {
    const {account} = useEthers();

    return (
        <div className={typeof account === 'undefined' ? 'not-active' : ''}>
            {props.children}
        </div>
    )
}