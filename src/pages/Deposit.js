// frontend/src/pages/Deposit.js
import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Deposit() {
  const { currentUserId } = useAuth();
  const [userData, setUserData] = useState(null);
  const [crypto, setCrypto] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const getUserData = () => {
    const data = JSON.parse(localStorage.getItem('data')) || {};
    if(!data.users) data.users = [];
    const user = data.users.find(u=>u.id===currentUserId);
    return { data, user };
  };

  const saveUserData = (newUser) => {
    const { data } = getUserData();
    const index = data.users.findIndex(u=>u.id===currentUserId);
    if(index !== -1) {
      data.users[index] = newUser;
      localStorage.setItem('data', JSON.stringify(data));
    }
  };

  useEffect(() => {
    if(currentUserId) {
      const {user} = getUserData();
      if(!user) {
        setUserData(null);
      } else {
        if(typeof user.processingDepositPaid === 'undefined') {
          user.processingDepositPaid = false;
        }
        setUserData(user);
      }
    } else {
      setUserData(null);
    }
  }, [currentUserId]);

  if(!currentUserId) {
    return <div style={{padding:'20px'}}>Please login first.</div>;
  }

  if(!userData) {
    return <div style={{padding:'20px'}}>Loading user data...</div>;
  }

  const { wallets, selectedWalletId } = userData;
  const selectedWallet = wallets.find(w => w.id === selectedWalletId);

  if(!selectedWallet) {
    return <div style={{padding:'20px'}}>No wallet selected. Go to dashboard and select a wallet.</div>;
  }

  const address = crypto === 'BTC' ? selectedWallet.btcAddress : selectedWallet.usdtAddress;

  const handleDeposit = (e) => {
    e.preventDefault();
    if(!amount || parseFloat(amount) <= 0) {
      setMessage('Invalid amount.');
      return;
    }

    const field = crypto.toLowerCase()+'Balance';
    const newBalance = selectedWallet[field] + parseFloat(amount);
    const newTx = {
      id: selectedWallet.transactions.length + 1,
      type: 'deposit',
      crypto,
      amount: parseFloat(amount),
      date: new Date().toISOString()
    };

    const newWallets = wallets.map(w=> {
      if(w.id===selectedWalletId) {
        return { ...w, [field]:newBalance, transactions:[...w.transactions, newTx] };
      }
      return w;
    });

    const newUser = { ...userData, wallets:newWallets };
    saveUserData(newUser);
    setUserData(newUser);
    setAmount('');
    setMessage('Deposit completed successfully.');
  };

  return (
    <div style={{padding:'20px'}}>
      <h2>Deposit</h2>
      <p>Current wallet: {selectedWallet.name}</p>
      <p>Deposit address for {crypto}: {address}</p>
      <QRCodeCanvas value={address} size={128} />
      <form onSubmit={handleDeposit} style={{marginTop:'20px'}}>
        <div style={{marginBottom:'10px'}}>
          <label>Crypto: </label>
          <select value={crypto} onChange={e=>setCrypto(e.target.value)}>
            <option value="BTC">BTC</option>
            <option value="USDT">USDT</option>
          </select>
        </div>
        <input 
          type="number"
          step="0.00000001"
          placeholder="Amount"
          value={amount}
          onChange={e=>setAmount(e.target.value)}
          style={{display:'block', margin:'10px 0'}}
        />
        <button type="submit">Deposit</button>
      </form>
      {message && <p style={{marginTop:'10px', color: message.includes('Error')?'red':'green'}}>{message}</p>}
    </div>
  );
}

export default Deposit;
