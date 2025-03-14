import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Cards from './Cards';  // Import the Cards array

const Game = () => {
  const location = useLocation();
  const { players } = location.state || {};  // Safely access players from location state

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [cardDrawn, setCardDrawn] = useState(null);
  const [waitingMessage, setWaitingMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);

  // Draw a random card from the deck
  const drawCard = () => {
    const randomCard = Cards[Math.floor(Math.random() * Cards.length)];
    setCardDrawn(randomCard);

    // Update the turn to the next player
    setCurrentPlayerIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % players.length;
      return nextIndex;
    });
  };

  useEffect(() => {
    if (players.length > 0) {
      setWaitingMessage(`${players[currentPlayerIndex].name}'s turn!`);
    }
  }, [currentPlayerIndex, players]);

  return (
    <div>
      <h1>Game Page</h1>
      
      {/* Player Turn Logic */}
      {players && players.length > 0 && (
        <div>
          {currentPlayerIndex === players.findIndex(player => player.isHost) && cardDrawn === null ? (
            <div>
              <p>{waitingMessage}</p>
              <button onClick={drawCard}>Draw Card</button>
            </div>
          ) : (
            <p>{players[currentPlayerIndex].name} is drawing...</p>
          )}
        </div>
      )}

      {/* Show drawn card */}
      {cardDrawn && (
        <div>
          <p>{cardDrawn.name} drawn!</p>
          <p>Effect: {cardDrawn.effect || 'No effect for now'}</p>
          <p>{players[currentPlayerIndex].name} drew the card!</p>
        </div>
      )}

      {/* Show waiting message for other players */}
      {cardDrawn === null && players && players.length > 0 && (
        <div>
          <p>Waiting for {players[currentPlayerIndex].name}'s turn...</p>
        </div>
      )}

      {/* End game */}
      {gameOver && <p>The game is over!</p>}
    </div>
  );
};

export default Game;