// frontend/src/components/CardList.js
import React from 'react';
import './cardlist.css';

function CardList({ cards, onAddMore, activeIndex, setActiveIndex }) {

  const handleCardClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="card-list-container">
      <div className="add-card-container">
        <div className="add-card-button" onClick={onAddMore}>
          <span>+</span>
        </div>
        <div className="add-card-text">Add more</div>
      </div>
      <div className="card-scroller">
        {cards.map((card, index) => {
          const isActive = index === activeIndex;
          const formattedNumber = card.cardNumber ? card.cardNumber.replace(/(.{4})/g, '$1 ') : '**** **** **** ****';

          return (
            <div 
              key={index} 
              className={`card-display ${isActive ? 'active' : 'inactive'}`}
              onClick={() => handleCardClick(index)}
              style={{cursor:'pointer'}}
            >
              <div className="card-logo">
                <img src="/mi-logo.png" alt="Logo" style={{width:'50px'}} />
              </div>
              <div className="card-number">
                {formattedNumber}
              </div>
              <div className="card-info">
                <div>
                  <span className="label">EXPIRY DATE</span><br />
                  <span className="value">{card.cardExp || '**/**'}</span>
                </div>
                <div>
                  <span className="label">CVV</span><br />
                  <span className="value">{card.cardCVV || '***'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CardList;
