import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGameContext } from '../components/GameContext';
import io from 'socket.io-client';
import "../assets/Game.css";

const socket = io(); // Automatically connects to the backend

const DeckPanel = ({ deck }) => (
  <div className="deck-panel">
    <h3>Deck</h3>
    <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
      {deck.length > 0 ? (
        deck.map((card, index) => <li key={index}>{card.name}</li>)
      ) : (
        <li>Loading deck...</li>
      )}
    </ul>
  </div>
);

const TurnOrderPanel = ({ players, whosTurnIsIt }) => (
  <div className="turn-order-panel">
    <h3>Turn Order</h3>
    <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
      {players.map((player, index) => (
        <li
          key={index}
          style={{
            fontWeight: whosTurnIsIt === index ? 'bold' : 'normal',
            color: whosTurnIsIt === index ? 'blue' : 'black'
          }}
        >
          {player.name}
        </li>
      ))}
    </ul>
  </div>
);

const Game = () => {
  const { players, deck, whosTurnIsIt, setDeck, setPlayers, setWhosTurnIsIt } = useGameContext();
  const { roomID } = useParams();
  const [cardDrawn, setCardDrawn] = useState(null);
  const [isTurnEnded, setIsTurnEnded] = useState(false);

  useEffect(() => {
    console.log("whosTurnIsIt:", whosTurnIsIt);
    console.log("Players:", players);
    console.log("Current Player socketID:", players[whosTurnIsIt]?.socketID);
    console.log("My socketID:", socket.id);
    socket.emit('joinGamePage', { roomID });

    socket.on('updateGameState', (data) => {
      console.log("Game State Updated:", data);
      setDeck(data.deck);
      setPlayers(data.players);
      setWhosTurnIsIt(data.currentPlayerIndex);
    });

    socket.on('cardDrawn', ({ drawnCard, newDeck, updatedPlayers }) => {
      console.log("Card drawn:", drawnCard);
      setCardDrawn(drawnCard);
      setDeck(newDeck);
      setPlayers(updatedPlayers); 
    });

    return () => {
      socket.off('updateGameState');
      socket.off('cardDrawn');
    };
  }, [roomID, setDeck, setPlayers, setWhosTurnIsIt, whosTurnIsIt, players]);

  const drawACard = () => {
    if (cardDrawn || deck.length === 0 || players[whosTurnIsIt]?.socketID !== socket.id) return;
    socket.emit('drawCard', { roomID });
  };

  const endTurn = () => {
    setCardDrawn(null);
    setIsTurnEnded(true);
    socket.emit('endTurn', { roomID });
  };

  return (
    <div className="game-container">
      {/* Game Header */}
      <div className="game-header">
        <h1>Game Page</h1>
        {players.length > 0 && (
          <p className="turn-message">{players[whosTurnIsIt]?.name}'s turn!</p>
        )}
      </div>

      <div className="game-content">
        <div className="deck-turn-panel">
          <DeckPanel deck={deck} />
        </div>

        <div className="right-panel">
          <TurnOrderPanel players={players} whosTurnIsIt={whosTurnIsIt} />
        </div>

        {players.length > 0 && (
          <div className="game-controls">
            {deck.length > 0 && cardDrawn === null && 
              players.length > 0 && whosTurnIsIt !== null &&
              players[whosTurnIsIt]?.socketID === socket.id && (
              <button className="game-button" onClick={drawACard}>Draw Card</button>
            )}

            {cardDrawn && !isTurnEnded && (
              <div className="cardContainer">
                <p>{players[whosTurnIsIt]?.name} drew {cardDrawn.name}!</p>
                <img src={cardDrawn.src} className="drawn-card" alt={cardDrawn.name} />
                <p>Effect: {cardDrawn.effect || 'No effect for now'}</p>
                <button className="game-button" onClick={endTurn}>End Turn</button>
              </div>
            )}

            {isTurnEnded && (
              <div>
                <img src="/CardImages/cardbacks/BlackBack.png" className="cardback" alt="Card Back" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
