import { Chain } from '@usedapp/core'

export const Rollux: Chain = {
    chainId: 2814,
    chainName: 'RolluxTestnet',
    isTestChain: false,
    isLocalChain: false,
    multicallAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    getExplorerAddressLink: (address: string) => `https://explorer.testnet.rollux.com/address/${address}`,
    getExplorerTransactionLink: (transactionHash: string) => `https://explorer.testnet.rollux.com/tx/${transactionHash}`,
    // Optional parameters:
    rpcUrl: 'https://testnet.rollux.com:2814',
    blockExplorerUrl: 'https://explorer.testnet.rollux.com',
    nativeCurrency: {
        name: 'rSYS',
        symbol: 'rSYS',
        decimals: 18,
    }
};