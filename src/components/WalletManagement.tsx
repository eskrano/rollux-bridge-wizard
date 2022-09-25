import { useEtherBalance, useEthers } from "@usedapp/core";
import React, { FC } from "react";
import { Button, Card } from "react-bootstrap";
import { shortenAddress } from "@usedapp/core";
import { formatEther, formatUnits, parseEther, parseUnits } from "ethers/lib/utils";


const NotConnectedWallet: FC<{ connect: () => void }> = ({ connect }) => {
    return (
        <Button variant="success" onClick={() => { connect() }}>
            Connect Wallet
        </Button>
    );
}

const ConnectedWalletInfo: FC<{ account: string, deactivate: () => void }> = ({ account, deactivate }) => {
    const balance = useEtherBalance(account);

    return (
        <div>
            <Card>
                <Card.Header>
                    Connected <b>{shortenAddress(account)}</b>
                </Card.Header>
            </Card>

            {balance && <>
                <Card>
                    <Card.Header>
                        tSys - {formatUnits(balance, 18)}
                    </Card.Header>
                </Card>
            </>}


        </div>
    );
}

export const WalletManagement: FC<{}> = (props) => {
    const { activateBrowserWallet, account, deactivate } = useEthers();

    return (
        <Card>
            <Card.Body>
                {!account && <NotConnectedWallet connect={activateBrowserWallet} />}
                {account && <ConnectedWalletInfo account={account} deactivate={deactivate} />}
            </Card.Body>
        </Card>
    );
}