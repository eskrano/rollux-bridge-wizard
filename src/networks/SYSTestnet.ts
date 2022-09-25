import { Chain } from '@usedapp/core'

export const SysTestnet: Chain = {
    chainId: 5700,
    chainName: 'tSysNEVM',
    isTestChain: false,
    isLocalChain: false,
    multicallAddress: '0xF081BAe857be7F582601Cf75d52cfd0136E49528',
    getExplorerAddressLink: (address: string) => `https://tanenbaum.io/address/${address}`,
    getExplorerTransactionLink: (transactionHash: string) => `https://tanenbaum.io/tx/${transactionHash}`,
    // Optional parameters:
    rpcUrl: 'https://rpc.tanenbaum.io/',
    blockExplorerUrl: 'https://tanenbaum.io',
    nativeCurrency: {
        name: 'tSYS',
        symbol: 'tSYS',
        decimals: 18,
    }
};