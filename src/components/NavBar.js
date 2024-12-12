import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function NavBar() {
  const { token, logout } = useAuth();
  const [wallets, setWallets] = useState([]);
  const [selectedWalletId, setSelectedWalletId] = useState(localStorage.getItem('selectedWalletId') || '');

  useEffect(() => {
    const fetchWallets = async() => {
      if(!token) return;
      const res = await api.get('/wallet/list', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWallets(res.data);
      if(!selectedWalletId && res.data.length > 0) {
        const defaultId = res.data[0].id.toString();
        setSelectedWalletId(defaultId);
        localStorage.setItem('selectedWalletId', defaultId);
      }
    };
    fetchWallets();
  }, [token, selectedWalletId]);

  const handleWalletChange = (e) => {
    setSelectedWalletId(e.target.value);
    localStorage.setItem('selectedWalletId', e.target.value);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/mi-logo.png" alt="Mi Logo" className="logo" />
        <div className="navbar-menu">
          {token && (
            <>
              <a href="/dashboard">Dashboard</a>
              <a href="/deposit">Deposit</a>
              <a href="/withdraw">Withdraw</a>
              <a href="/history">History</a>
              <a href="/card">Card</a>
              <a href="/manage-wallets">Manage Wallets</a>
            </>
          )}
        </div>
      </div>
      {token && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {wallets.length > 0 && (
            <select value={selectedWalletId} onChange={handleWalletChange}>
              {wallets.map(w => (
                <option key={w.id} value={w.id.toString()}>{w.name}</option>
              ))}
            </select>
          )}
          <button className="main-wallet-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
