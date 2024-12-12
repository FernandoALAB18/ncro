import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function ManageWallets() {
  const { token } = useAuth();
  const [wallets, setWallets] = useState([]);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    const fetchWallets = async() => {
      if(!token) return;
      const res = await api.get('/wallet/list', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWallets(res.data);
    };
    fetchWallets();
  }, [token]);

  const handleCreate = async() => {
    await api.post('/wallet/create', { name: newName }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setNewName('');
    const res = await api.get('/wallet/list', { headers: { Authorization: `Bearer ${token}` }});
    setWallets(res.data);
  };

  const handleDelete = async(walletId) => {
    await api.delete(`/wallet/${walletId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const res = await api.get('/wallet/list', { headers: { Authorization: `Bearer ${token}` }});
    setWallets(res.data);
  };

  return (
    <div style={{padding:'20px'}}>
      <h2>Manage Wallets</h2>
      <div>
        <input placeholder="New Wallet Name" value={newName} onChange={e=>setNewName(e.target.value)} />
        <button onClick={handleCreate}>Create Wallet</button>
      </div>
      <div style={{marginTop:'20px'}}>
        <h3>Your Wallets:</h3>
        {wallets.map(w => (
          <div key={w.id} style={{border:'1px solid #ccc', padding:'10px', margin:'10px 0'}}>
            <p>Name: {w.name}</p>
            <p>BTC Balance: {w.btcBalance}</p>
            <p>USDT Balance: {w.usdtBalance}</p>
            {w.name !== 'Main Wallet' && (
              <button onClick={() => handleDelete(w.id)}>Delete</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageWallets;
