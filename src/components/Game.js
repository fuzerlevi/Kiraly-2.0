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
      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
        {deck.map((card, index) => (
          <li key={index}>{card.name}</li>
        ))}
      </ul>
    </div>
  );
};

const TurnOrderPanel = ({ players, currentPlayerIndex }) => {
  return (
    <div className="turn-order-panel">
      <h3>Turn Order</h3>
      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
        {players.map((player, index) => (
          <li
            key={index}
            style={{
              fontWeight: currentPlayerIndex === index ? 'bold' : 'normal',
              color: currentPlayerIndex === index ? 'blue' : 'black'
            }}
          >
            {player.name}
          </li>
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

  const drawACard = () => {
    if (cardDrawn || deck.length === 0) return;
  
    const newDeck = [...deck];
    const drawnCard = newDeck.shift(); // Remove the first card from the deck
    setDeck(newDeck);
    setCardDrawn(drawnCard);
  
    // Add the drawn card to the player's drawn cards
    players[currentPlayerIndex].cardsDrawn.push(drawnCard);  // Assuming each player has a 'cardsDrawn' property
  
    // Log the players array to the console
    console.log(players);  // Logs players array whenever a card is drawn
  };

  const endTurn = () => {
    setCardDrawn(null);
    setIsTurnEnded(true); // Mark the turn as ended
    setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
  };

  useEffect(() => {
    setDeck(shuffleDeck(Cards));
  }, []);

  useEffect(() => {
    if (players.length > 0 && deck.length > 0) {
      setWaitingMessage(`${players[currentPlayerIndex].name}'s turn!`);
      setIsTurnEnded(false); // Reset turn end status when it's a new player's turn
    }
  }, [currentPlayerIndex, players, deck]);

  return (
    <div className="game-container">
      <div className="game-content">
        <div className="deck-turn-panel">
          {/* Deck Panel */}
          <DeckPanel deck={deck} />

          {/* Turn Order Panel */}
          <TurnOrderPanel players={players} currentPlayerIndex={currentPlayerIndex} />
        </div>

        <h1>Game Page</h1>
        {players && players.length > 0 && (
          <div>
            <p>{waitingMessage}</p>

            {/* Draw Card Button */}
            {deck.length > 0 && cardDrawn === null && (
              <button className="game-button" onClick={drawACard}>Draw Card</button>
            )}

            {/* Show drawn card */}
            {cardDrawn && !isTurnEnded && (
              <div className="cardContainer">
                <p>{players[currentPlayerIndex].name} drew {cardDrawn.name}!</p>
                <img src={cardDrawn.src} className="drawn-card" alt={cardDrawn.name} />
                <p>Effect: {cardDrawn.effect || 'No effect for now'}</p>
                <button className="game-button" onClick={endTurn}>End Turn</button>
              </div>
            )}

            {/* End of turn state */}
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
