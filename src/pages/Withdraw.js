import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Withdraw() {
  const { token } = useAuth();
  const [crypto, setCrypto] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [btcBalance, setBtcBalance] = useState('0');
  const [usdtBalance, setUsdtBalance] = useState('0');
  const [wallets, setWallets] = useState([]);
  const [selectedWalletId, setSelectedWalletId] = useState('');

  // Redes para USDT
  const [usdtNetwork, setUsdtNetwork] = useState('TRC20');
  const usdtNetworks = ['TRC20', 'ERC20', 'BEP20', 'POLYGON', 'SOLANA', 'AVALANCHE', 'FANTOM', 'ARBITRUM', 'OPTIMISM', 'CRONOS'];

  useEffect(() => {
    const fetchWallets = async() => {
      const res = await api.get('/wallet/list', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWallets(res.data);
      if(res.data.length > 0) {
        setSelectedWalletId(res.data[0].id.toString());
      }
    };
    if(token) fetchWallets();
  }, [token]);

  useEffect(() => {
    const fetchBalances = async () => {
      if(!selectedWalletId) return;
      const res = await api.get(`/wallet/balances/${selectedWalletId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBtcBalance(res.data.btcBalance);
      setUsdtBalance(res.data.usdtBalance);
    };
    if(token && selectedWalletId) fetchBalances();
  }, [token, selectedWalletId]);

  const handleWithdraw = async(e) => {
    e.preventDefault();
    try {
      const walletIdNumber = parseInt(selectedWalletId, 10);
      await api.post('/wallet/withdraw', { walletId: walletIdNumber, crypto, amount, address: toAddress }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Withdraw completed successfully.\nRecuerda que se cobrará una tarifa fija de 2 USD.');
      setAmount('');
      setToAddress('');
    } catch(err) {
      console.error(err);
      alert('Withdraw failed');
    }
  };

  const availableBalance = crypto === 'BTC' ? btcBalance : usdtBalance;

  return (
    <div style={{padding:'20px'}}>
      <h2>Withdraw</h2>
      <div>
        <label>Select Wallet: </label>
        <select value={selectedWalletId} onChange={e=>setSelectedWalletId(e.target.value)}>
          {wallets.map(w => (
            <option key={w.id} value={w.id.toString()}>{w.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Crypto: </label>
        <select value={crypto} onChange={e=>setCrypto(e.target.value)}>
          <option value="BTC">BTC</option>
          <option value="USDT">USDT</option>
        </select>
      </div>
      <p>Available Balance: {availableBalance} {crypto}</p>

      {crypto === 'USDT' && (
        <div style={{margin: '10px 0'}}>
          <label>Seleccionar Red de Envío: </label>
          <select value={usdtNetwork} onChange={e=>setUsdtNetwork(e.target.value)}>
            {usdtNetworks.map(net => (
              <option key={net} value={net}>{net}</option>
            ))}
          </select>
          <p style={{fontSize:'0.9rem', color:'#ccc'}}>
            Se cobrará una tarifa fija de 2 USD por transacción.<br/>
            La rapidez del envío dependerá de la congestión de la red seleccionada.
          </p>
        </div>
      )}

      <form onSubmit={handleWithdraw}>
        <input 
          placeholder="Amount"
          value={amount}
          onChange={e=>setAmount(e.target.value)} 
          style={{display:'block', margin:'10px 0'}}
        />
        <input 
          placeholder="Destination Address" 
          value={toAddress}
          onChange={e=>setToAddress(e.target.value)}
          style={{display:'block', margin:'10px 0'}}
        />
        <button type="submit">Withdraw</button>
      </form>
    </div>
  );
}

export default Withdraw;
