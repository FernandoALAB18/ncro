// frontend/src/pages/Card.js
import React, { useState } from 'react';

function CardPage() {
  const [cards] = useState([
    { cardNumber: '4111 1111 1111 1002', cardExp: '12/28', cardCVV:'123' },
    { cardNumber: '4111 1111 1111 1234', cardExp: '11/29', cardCVV:'456' },
  ]);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div style={{padding:'20px'}}>
      <h2>My Cards</h2>
      <div>
        {cards.map((c,i)=>(
          <div key={i} style={{border:'1px solid #ccc', margin:'10px', padding:'10px', background: i===activeIndex?'#333':'#1C1C1C', color:'#fff'}}>
            <p>Number: {c.cardNumber}</p>
            <p>Exp: {c.cardExp}</p>
            <p>CVV: {c.cardCVV}</p>
            <button onClick={()=>setActiveIndex(i)}>Select this card</button>
          </div>
        ))}
      </div>
      <p>Selected card: {cards[activeIndex].cardNumber}</p>
      <h4>Transactions:</h4>
      <p>Error loading data at this time.</p>
    </div>
  );
}

export default CardPage;
