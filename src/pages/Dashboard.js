// frontend/src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';

function Dashboard() {
  // Balances fijos:
  const btcBalance = '10';
  const usdtBalance = '675123.02';

  const [btcPrice, setBtcPrice] = useState(100000); // Un valor base por si falla la API
  const [usdtPrice, setUsdtPrice] = useState(1);    // USDT usualmente ~1 USD

  const [cardNumber, setCardNumber] = useState('4111 1111 1111 1002');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCVV, setCardCVV] = useState('123');
  const [cardBalance, setCardBalance] = useState('0');
  const [physicalRequested, setPhysicalRequested] = useState(true);

  const [showCardInfo, setShowCardInfo] = useState(false);

  const numberFormat = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 });
  const currencyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  // Obtener precios en tiempo real de BTC y USDT
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tether&vs_currencies=usd');
        const data = await res.json();
        if(data.bitcoin && data.tether) {
          setBtcPrice(data.bitcoin.usd);
          setUsdtPrice(data.tether.usd);
        } else {
          console.warn("Failed to get prices from Coingecko, using default values.");
        }
      } catch (error) {
        console.error("Failed to fetch prices, using default values.", error);
      }
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  const btcValueUSD = parseFloat(btcBalance) * btcPrice;
  const usdtValueUSD = parseFloat(usdtBalance) * usdtPrice;

  const maskCardNumber = (num) => {
    if(!num) return '**** **** **** ****';
    const last4 = num.slice(-4);
    return `**** **** **** ${last4}`;
  };

  const displayedNumber = showCardInfo ? 
    (cardNumber ? cardNumber.replace(/(.{4})/g, '$1 ') : '**** **** **** ****') : 
    maskCardNumber(cardNumber);

  return (
    <div className="main-content">
      <div className="left-panel">
        {/* Tarjeta de Bitcoin */}
        <div className="card-balance">
          <h3>
            <img src="/bitcoin-icon.png" alt="Bitcoin" className="coin-icon" />
            Bitcoin
          </h3>
          <div className="balance-label">Your balance</div>
          <div className="balance-amount">
            {numberFormat.format(parseFloat(btcBalance))} BTC
          </div>
          <div style={{marginTop:'5px'}}>
            (~{currencyFormat.format(btcValueUSD)})
          </div>
        </div>

        {/* Tarjeta de USDT */}
        <div className="card-balance" style={{background: 'linear-gradient(45deg, #00ace6, #1dd1a1)'}}>
          <h3>
            <img src="/usdt-icon.png" alt="USDT" className="coin-icon" />
            USDT Tether
          </h3>
          <div className="balance-label">Your balance</div>
          <div className="balance-amount">
            {numberFormat.format(parseFloat(usdtBalance))} USDT
          </div>
          <div style={{marginTop:'5px'}}>
            (~{currencyFormat.format(usdtValueUSD)})
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={()=>window.location.href='/deposit'}>Deposit</button>
          <button onClick={()=>window.location.href='/withdraw'}>Withdraw</button>
          <button onClick={()=>window.location.href='/card'}>Card</button>
        </div>

        {/* Tarjeta (Card) fija */}
        <div className="user-card-container" style={{marginTop:'40px'}}>
          <div className="user-card-display">
            <div className="user-card-logo">
              <img src="/mi-logo.png" alt="Logo" style={{width:'50px'}} />
            </div>
            <div className="user-card-number">
              {displayedNumber}
            </div>
            <div className="user-card-info">
              <div>
                <span className="label">EXPIRY DATE</span><br />
                <span className="value">{cardExp || '**/**'}</span>
              </div>
              <div>
                <span className="label">CVV</span><br />
                <span className="value">{showCardInfo ? cardCVV || '***' : '***'}</span>
              </div>
            </div>
            <button className="user-card-toggle" onClick={() => setShowCardInfo(!showCardInfo)}>
              {showCardInfo ? 'Hide Info' : 'Show Info'}
            </button>
          </div>
        </div>
      </div>

      {/* Donde antes iban las transacciones, ahora mensaje de error fijo */}
      <div className="transactions-panel" style={{ display:'flex', justifyContent:'center', alignItems:'center', marginTop:'40px' }}>
        <h4 style={{textAlign:'center'}}>Error loading data at this time.</h4>
      </div>
    </div>
  );
}

export default Dashboard;
