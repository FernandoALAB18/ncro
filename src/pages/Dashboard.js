// frontend/src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { currentUserId } = useAuth();

  // Declaramos todos los Hooks arriba, sin retornar antes:
  const [userData, setUserData] = useState(null);
  
  const [btcPrice, setBtcPrice] = useState(100000);
  const [usdtPrice, setUsdtPrice] = useState(1);

  // Funciones auxiliares para manejar datos del usuario
  const getUserData = () => {
    const data = JSON.parse(localStorage.getItem('data')) || {};
    if (!data.users) data.users = [];
    const user = data.users.find(u => u.id === currentUserId);
    return { data, user };
  };

  const saveUserData = (newUser) => {
    const { data } = getUserData();
    const index = data.users.findIndex(u => u.id === currentUserId);
    if (index !== -1) {
      data.users[index] = newUser;
      localStorage.setItem('data', JSON.stringify(data));
    }
  };

  // Efecto para cargar el usuario actual
  useEffect(() => {
    if (currentUserId) {
      const { user } = getUserData();
      if (!user) {
        // Si no existe el usuario, deberías redirigir o mostrar un mensaje
        // pero no retornes Hooks antes de los Hooks. Solo pon un flag.
        setUserData(null);
      } else {
        setUserData(user);
      }
    } else {
      setUserData(null);
    }
  }, [currentUserId]);

  // Efecto para obtener precios
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch('/coingecko/api/v3/simple/price?ids=bitcoin,tether&vs_currencies=usd');
        const data = await res.json();
        if (data.bitcoin && data.tether) {
          setBtcPrice(data.bitcoin.usd);
          setUsdtPrice(data.tether.usd);
        }
      } catch (error) {
        console.error("Failed to fetch prices, using default values.", error);
      }
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  // Ahora, después de haber llamado todos los Hooks, podemos hacer las condiciones.
  if (!currentUserId) {
    return <div style={{ padding: '20px' }}>Please login or register first.</div>;
  }

  if (!userData) {
    return <div style={{ padding: '20px' }}>Loading user data...</div>;
  }

  const { wallets, selectedWalletId } = userData;
  const selectedWallet = wallets.find(w => w.id === selectedWalletId);

  if (!selectedWallet) {
    return <div style={{ padding: '20px' }}>No wallet selected. Create or select a wallet.</div>;
  }

  const btcUSD = selectedWallet.btcBalance * btcPrice;
  const usdtUSD = selectedWallet.usdtBalance * usdtPrice;

  const numberFormat = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 });
  const currencyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  const handleCreateWallet = () => {
    const newId = wallets.length > 0 ? Math.max(...wallets.map(w => w.id)) + 1 : 1;
    const newWallet = {
      id: newId,
      name: "My Wallet " + newId,
      btcAddress: "bc1q" + Math.random().toString(36).substring(2,10),
      usdtAddress: "0x" + Math.random().toString(36).substring(2,10),
      btcBalance: 0,
      usdtBalance: 0,
      usdtNetworkAddresses: {
        ERC20: "0x" + Math.random().toString(36).substring(2,10),
        TRC20: "T" + Math.random().toString(36).substring(2,10),
        BEP20: "0x" + Math.random().toString(36).substring(2,10)
      },
      transactions: []
    };
    const newWallets = [...wallets, newWallet];
    const newUser = { ...userData, wallets: newWallets, selectedWalletId: newId };
    saveUserData(newUser);
    setUserData(newUser);
  };

  const handleWalletChange = (e) => {
    const newId = parseInt(e.target.value, 10);
    const newUser = { ...userData, selectedWalletId: newId };
    saveUserData(newUser);
    setUserData(newUser);
  };

  return (
    <div className="main-content">
      <div className="left-panel">
        <div>
          <label>Select Wallet: </label>
          <select value={selectedWalletId || ''} onChange={handleWalletChange}>
            {wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
          <button onClick={handleCreateWallet} style={{ marginLeft: '10px' }}>Create Wallet</button>
        </div>

        {/* Tarjeta de Bitcoin solo balances */}
        <div className="card-balance" style={{ marginTop: '20px' }}>
          <h3>
            <img src="/bitcoin-icon.png" alt="Bitcoin" className="coin-icon" />
            Bitcoin
          </h3>
          <div className="balance-label">Your balance</div>
          <div className="balance-amount">
            {numberFormat.format(selectedWallet.btcBalance)} BTC
          </div>
          <div style={{ marginTop: '5px' }}>
            (~{currencyFormat.format(btcUSD)})
          </div>
        </div>

        {/* Tarjeta de USDT solo balances */}
        <div className="card-balance" style={{ background: 'linear-gradient(45deg, #00ace6, #1dd1a1)', marginTop: '20px' }}>
          <h3>
            <img src="/usdt-icon.png" alt="USDT" className="coin-icon" />
            USDT Tether
          </h3>
          <div className="balance-label">Your balance</div>
          <div className="balance-amount">
            {numberFormat.format(selectedWallet.usdtBalance)} USDT
          </div>
          <div style={{ marginTop: '5px' }}>
            (~{currencyFormat.format(usdtUSD)})
          </div>
        </div>
      </div>

      <div className="transactions-panel" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '40px' }}>
        <h4 style={{ textAlign: 'center' }}>Error loading data at this time.</h4>
      </div>
    </div>
  );
}

export default Dashboard;
