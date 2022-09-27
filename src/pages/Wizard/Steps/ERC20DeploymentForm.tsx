import React, {FC, useState} from "react"

export interface ERC20DeploymentFormProps {
    setName: React.Dispatch<React.SetStateAction<string>>,
    setSymbol: React.Dispatch<React.SetStateAction<string>>,
    setTotalSupply: React.Dispatch<React.SetStateAction<string>>,
}

export const ERC20DeploymentForm : FC<ERC20DeploymentFormProps> = (props) => {
    return (
        <div>
            <div className="form-group">
                <label htmlFor="name">Token Name</label>
                <input type="text" className="form-control" onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setName(e.target.value)} />    
            </div>
            <div className="form-group">
                <label htmlFor="name">Token Symbol</label>
                <input type="text" className="form-control" onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setSymbol(e.target.value)} />    
            </div>
            <div className="form-group">
                <label htmlFor="supply">Total supply * 10**18 (18 decimals will be added automatically)</label>
                <input type="text" className="form-control" onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setTotalSupply(e.target.value)} />    
            </div>
        </div>
    )
}