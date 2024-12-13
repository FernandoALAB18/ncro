// frontend/src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './styles.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import History from './pages/History';
import CardPage from './pages/Card';
import ManageWallets from './pages/ManageWallets';
import NavBar from './components/NavBar';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/history" element={<History />} />
          <Route path="/card" element={<CardPage />} />
          <Route path="/manage-wallets" element={<ManageWallets />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
