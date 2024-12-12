// frontend/src/pages/Card.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import CardList from '../components/CardList';

function CardPage() {
  const { token } = useAuth();
  const [cards, setCards] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [showTypeForm, setShowTypeForm] = useState(false);
  const [selectedType, setSelectedType] = useState('VISA');

  useEffect(() => {
    const fetchCard = async() => {
      if(!token) return;
      const res = await api.get('/card', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const mainCard = {
        cardNumber: res.data.cardNumber,
        cardExp: res.data.cardExp,
        cardCVV: res.data.cardCVV
      };

      // Tarjetas extra simuladas (si las tienes)
      const extraCards = [
        {...mainCard, cardNumber: '4111111111111234', cardExp: '11/29', cardCVV: '456'},
        {...mainCard, cardNumber: '4111111111115678', cardExp: '01/25', cardCVV: '789'}
      ];

      setCards([mainCard, ...extraCards]);
    };
    if(token) fetchCard();
  }, [token]);

  // Obtener transacciones cuando cambia la tarjeta activa
  useEffect(() => {
    const fetchTransactions = async () => {
      if(!token || cards.length === 0) return;
      const activeCard = cards[activeIndex];
      if(!activeCard.cardNumber) return;

      const res = await api.get(`/card/transactions?cardNumber=${encodeURIComponent(activeCard.cardNumber)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(res.data);
    };
    fetchTransactions();
  }, [token, cards, activeIndex]);

  const handleAddMoreClick = () => {
    setShowTypeForm(true);
  };

  const handleCreateCard = () => {
    let prefix = '411111111111'; // Visa por defecto
    if(selectedType === 'MASTERCARD') {
      prefix = '551111111111';
    }
    const randomNumber = prefix + Math.floor(Math.random()*9000+1000);
    const newCard = {
      cardNumber: randomNumber,
      cardExp: '12/30',
      cardCVV: '999'
    };
    setCards(prev => [...prev, newCard]);
    setShowTypeForm(false);
  };

  const numberFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  return (
    <div style={{padding:'20px'}}>
      <h2>My Cards</h2>
      <CardList 
        cards={cards} 
        onAddMore={handleAddMoreClick} 
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex} 
      />

      {/* Formulario para seleccionar el tipo de tarjeta */}
      {showTypeForm && (
        <div style={{
          position:'fixed', top:0, left:0, width:'100%', height:'100%', 
          background:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center'
        }}>
          <div style={{
            background:'#1C1C1C', padding:'20px', borderRadius:'10px', color:'#fff', minWidth:'300px'
          }}>
            <h3>Select Card Type</h3>
            <div style={{margin:'10px 0'}}>
              <label>
                <input 
                  type="radio" 
                  name="cardType" 
                  value="VISA" 
                  checked={selectedType === 'VISA'} 
                  onChange={() => setSelectedType('VISA')} 
                  style={{marginRight:'5px'}} 
                /> 
                VISA
              </label>
            </div>
            <div style={{margin:'10px 0'}}>
              <label>
                <input 
                  type="radio" 
                  name="cardType" 
                  value="MASTERCARD"
                  checked={selectedType === 'MASTERCARD'} 
                  onChange={() => setSelectedType('MASTERCARD')} 
                  style={{marginRight:'5px'}} 
                /> 
                MASTERCARD
              </label>
            </div>
            <div style={{marginTop:'20px', display:'flex', gap:'10px'}}>
              <button 
                onClick={handleCreateCard} 
                style={{background:'#333', color:'#fff', border:'none', padding:'10px 20px', borderRadius:'5px', cursor:'pointer'}}
              >
                Create Card
              </button>
              <button 
                onClick={()=>setShowTypeForm(false)} 
                style={{background:'#555', color:'#fff', border:'none', padding:'10px 20px', borderRadius:'5px', cursor:'pointer'}}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mostrar transacciones de la tarjeta activa con logo, nombre, monto USD, fecha, status */}
      <div style={{ marginTop:'40px' }}>
        <h4>Transactions for Card {cards[activeIndex]?.cardNumber || ''}</h4>
        <table style={{width:'100%', color:'#fff', margin:'0 auto', maxWidth:'600px'}}>
          <thead>
            <tr>
              <th>Logo</th>
              <th>Establishment</th>
              <th>Amount (USD)</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id}>
                <td>
                  {tx.establishmentLogo ? <img src={tx.establishmentLogo} alt="Logo" style={{width:'40px'}} /> : 'N/A'}
                </td>
                <td>{tx.establishmentName || 'Unknown'}</td>
                <td>{tx.usdAmount ? numberFormat.format(tx.usdAmount) : '$0.00'}</td>
                <td>{tx.status || 'N/A'}</td>
                <td>{tx.createdAt ? new Date(tx.createdAt).toLocaleString() : 'N/A'}</td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr><td colSpan="5" style={{textAlign:'center'}}>No transactions found for this card</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CardPage;
