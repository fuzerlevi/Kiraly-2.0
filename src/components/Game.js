import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Cards from './Cards';
import "../assets/Game.css";

const shuffleDeck = (deck) => {
  return [...deck].sort(() => Math.random() - 0.5);
};

const DeckPanel = ({ deck }) => {
  return (
    <div className="deck-panel">
      <h3>Deck</h3>
      <ul>
        {deck.map((card, index) => (
          <li key={index}>{card.name}</li>
        ))}
      </ul>
    </div>
  );
};

const Game = () => {
  const location = useLocation();
  const { players } = location.state || {};  // Safely access players from location state

  const [deck, setDeck] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [cardDrawn, setCardDrawn] = useState(null);
  const [waitingMessage, setWaitingMessage] = useState('');
  const [isTurnEnded, setIsTurnEnded] = useState(false);

  useEffect(() => {
    setDeck(shuffleDeck(Cards));
  }, []);

  const drawCard = () => {
    if (cardDrawn || deck.length === 0) return;

    const newDeck = [...deck];
    const drawnCard = newDeck.shift(); // Remove the first card from the deck
    setDeck(newDeck);
    setCardDrawn(drawnCard);
  };

  const endTurn = () => {
    if (deck.length === 0) {
      setWaitingMessage('Game Over - No more cards left!');
      return;
    }
    setCardDrawn(null);
    setIsTurnEnded(true); // Mark the turn as ended
    setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
  };

  useEffect(() => {
    if (players.length > 0 && deck.length > 0) {
      setWaitingMessage(`${players[currentPlayerIndex].name}'s turn!`);
      setIsTurnEnded(false); // Reset turn end status when it's a new player's turn
    }
  }, [currentPlayerIndex, players, deck]);

  return (
    <div className="game-container">
      <DeckPanel deck={deck} />
      <div className="game-content">
        <h1>Game Page</h1>
        {players && players.length > 0 && (
          <div>
            <p>{waitingMessage}</p>

            {deck.length > 0 && cardDrawn === null && (
              <button className= "game-button"onClick={drawCard}>Draw Card</button>
            )}

            {cardDrawn && !isTurnEnded && (
              <div className='cardContainer'>
                <p>{players[currentPlayerIndex].name} drew {cardDrawn.name}!</p>
                <img src={cardDrawn.src} className="drawn-card" alt={cardDrawn.name} />
                <p>Effect: {cardDrawn.effect || 'No effect for now'}</p>
                <button className= "game-button" onClick={endTurn}>End Turn</button>
              </div>
            )}

            {isTurnEnded && (
              <div>
                <img 
                  src="/CardImages/cardbacks/BlackBack.png" 
                  className="cardback" 
                  alt="Card Back" 
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
