import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { App } from './App';
import reportWebVitals from './reportWebVitals';
import { Config, DAppProvider } from '@usedapp/core';
import { SysTestnet } from './networks/SYSTestnet';
import { Rollux } from './networks/Rollux';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


const config: Config = {
  readOnlyChainId: SysTestnet.chainId,
  readOnlyUrls: {
    [SysTestnet.chainId]: SysTestnet.rpcUrl as string,
    [Rollux.chainId]: Rollux.rpcUrl as string
  },
  networks: [SysTestnet, Rollux],
}

root.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <App />
    </DAppProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
