import React, { FC } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { BridgeForm } from './components/BridgeForm';
import { WalletManagement } from './components/WalletManagement';
import { Deposit } from './pages/Deposit';
import { Withdraw } from './pages/Withdraw';
import { Index as WizardIndex } from './pages/Wizard/Index';
import './App.css'
import { NotConnectedOverlay } from './components/NotConnectedOverlay';

export const App: FC<{}> = () => {
  return (
    <BrowserRouter>
      <Container>

        <Row>
          <Col sm={4}>
            <h1>Rollux</h1>
          </Col>
          <Col sm={8} md={8}>
            <Link className='btn btn-primary mt-3 mb-3' style={{
              marginRight: '15px'
            }} to={'/deposit'}>
              Deposit
            </Link>
            <Link className='btn btn-primary mt-3 mb-3 me-3' to={'/withdraw'}>
              Withdraw
            </Link>
            <Link className='btn btn-primary mt-3 mb-3' to={'/wizard'}>
              Wizard
            </Link>
          </Col>
        </Row>

        <Row>
          <Col sm={8} md={8}>
            <NotConnectedOverlay>
              <Routes>
                <Route path="/" element={<Deposit />} />
                <Route path="/deposit" element={<Deposit />} />
                <Route path="/withdraw" element={<Withdraw />} />
                <Route path="/wizard" element={<WizardIndex />} />
              </Routes>
            </NotConnectedOverlay>
          </Col>
          <Col sm={4} md={4}>
            <WalletManagement />
          </Col>
        </Row>
      </Container>
    </BrowserRouter >
  );
}