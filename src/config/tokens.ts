interface TokensDict {
    [key: string]: {
        name: string,
        L1Address: string,
        L2Address: string,
    }
}

export const tokens: TokensDict = {
    ERC20: {
        name: "ERC20-USDT",
        L1Address: '',
        L2Address: '',
    }
}