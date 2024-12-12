// frontend/src/pages/Deposit.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Deposit() {
  const { token } = useAuth();
  const [crypto, setCrypto] = useState('BTC'); 
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [selectedWalletId, setSelectedWalletId] = useState(localStorage.getItem('selectedWalletId') || '');

  const handleDeposit = async (e) => {
    e.preventDefault();
    setMessage('');

    if(!token) {
      setMessage('You must be logged in to deposit.');
      return;
    }
    if(!selectedWalletId) {
      setMessage('No wallet selected.');
      return;
    }
    if(!amount || parseFloat(amount) <= 0) {
      setMessage('Invalid amount.');
      return;
    }

    console.log("Attempting deposit:", {walletId: selectedWalletId, crypto, amount});

    try {
      const res = await api.post('/wallet/deposit', {
        walletId: selectedWalletId,
        crypto,
        amount
      });
      console.log("Deposit response:", res.data);
      setMessage('Deposit completed successfully.');
      // Forzar que se actualice el dashboard al volver
      window.location.href = '/dashboard';
    } catch (error) {
      console.error("Error depositing:", error);
      if (error.response) {
        console.error("Backend error response:", error.response.data);
      }
      setMessage('Error depositing funds.');
    }
  };

  return (
    <div style={{padding:'20px'}}>
      <h2>Simulate Deposit</h2>
      <form onSubmit={handleDeposit}>
        <div>
          <label>Crypto: </label>
          <select value={crypto} onChange={e=>setCrypto(e.target.value)}>
            <option value="BTC">BTC</option>
            <option value="USDT">USDT</option>
          </select>
        </div>
        <div style={{marginTop:'10px'}}>
          <label>Amount: </label>
          <input 
            type="number" 
            step="0.00000001" 
            value={amount} 
            onChange={e=>setAmount(e.target.value)} 
          />
        </div>
        <div style={{marginTop:'10px'}}>
          <button type="submit">Deposit</button>
        </div>
      </form>
      {message && <p style={{marginTop:'10px', color: message.includes('Error') ? 'red' : 'green'}}>{message}</p>}
    </div>
  );
}

export default Deposit;
