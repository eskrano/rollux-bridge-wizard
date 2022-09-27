import { useEtherBalance, useEthers } from "@usedapp/core";
import React, { FC } from "react";
import { Button, Card } from "react-bootstrap";
import { shortenAddress } from "@usedapp/core";
import { formatEther, formatUnits, parseEther, parseUnits } from "ethers/lib/utils";
import { Rollux } from "../networks/Rollux";
import { SysTestnet } from "../networks/SYSTestnet";


const NotConnectedWallet: FC<{ connect: () => void }> = ({ connect }) => {
    return (
        <Button variant="success" onClick={() => { connect() }}>
            Connect Wallet
        </Button>
    );
}

const ConnectedWalletInfo: FC<{ account: string, deactivate: () => void }> = ({ account, deactivate }) => {
    const balanceRollux = useEtherBalance(account, { chainId: Rollux.chainId });
    const balanceSysTestnet = useEtherBalance(account, { chainId: SysTestnet.chainId});

    return (
        <div>
            <Card>
                <Card.Header>
                    Connected <b>{shortenAddress(account)}</b>
                </Card.Header>
            </Card>

            {balanceRollux && <>
                <Card>
                    <Card.Header>
                        rSYS - {formatUnits(balanceRollux, 18)} (Rollux L2)
                    </Card.Header>
                </Card>
            </>}

            {balanceSysTestnet && <>
                <Card>
                    <Card.Header>
                        tSys - {formatUnits(balanceSysTestnet, 18)} (Syscoin testnet L1)
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