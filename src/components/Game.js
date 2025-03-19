import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGameContext } from "../components/GameContext";
import socket from "../socket.js"; // Import the shared instance
import "../assets/Game.css";

const TurnOrderPanel = ({ players = [], whosTurnIsIt }) => (
  <div className="turn-order-panel">
    <h3 className="turn-order-title">Ki jön?</h3>
    <ul className="turn-order-list">
      {players.map((player, index) => (
        <li
          key={index}
          className={`turn-order-item ${whosTurnIsIt === index ? "current-turn" : ""}`}
        >
          {player.name}
        </li>
      ))}
    </ul>
  </div>
);

const Game = () => {
  const { players, deck, whosTurnIsIt, setDeck, setPlayers, setWhosTurnIsIt } =
    useGameContext();
  const { roomID } = useParams();
  const [cardDrawn, setCardDrawn] = useState(null);
  const [isTurnEnded, setIsTurnEnded] = useState(false);
  const [mySocketID, setMySocketID] = useState(socket.id || null);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("joinGamePage", { roomID });

    socket.on("updateGameState", (data) => {
      console.log("Game State Updated:", data);
      setPlayers(Object.values(data.players) || []);
      setDeck(data.deck || []);
      setWhosTurnIsIt(data.currentPlayerIndex || 0);
      setCardDrawn(null);
      setIsTurnEnded(false);
    });

    socket.on("cardDrawn", ({ drawnCard, newDeck, updatedPlayers }) => {
      console.log("🃏 Card drawn:", drawnCard);
      setCardDrawn(drawnCard);
      setDeck(newDeck || []);
      setPlayers(Object.values(updatedPlayers) || []);
      setIsTurnEnded(false);
    });

    return () => {
      socket.off("updateGameState");
      socket.off("cardDrawn");
    };
  }, [roomID, setDeck, setPlayers, setWhosTurnIsIt]);

  if (!mySocketID) {
    return <div>Loading game...</div>;
  }

  const drawACard = () => {
    if (cardDrawn || deck.length === 0 || players[whosTurnIsIt]?.socketID !== mySocketID) return;
    socket.emit("drawCard", { roomID });
  };

  const endTurn = () => {
    if (players[whosTurnIsIt]?.socketID !== mySocketID) return;
    setCardDrawn(null);
    setIsTurnEnded(true);
    socket.emit("endTurn", { roomID });
  };

  // Get current player's drawn cards
  const myPlayer = players.find((player) => player.socketID === mySocketID);
  const myCards = myPlayer?.cardsDrawn || [];

  // **DYNAMIC SPACING FOR CARDS (OVERLAPPING BEHAVIOR)**
  const containerWidth = 600; // Width of the hand box
  const cardWidth = 100; // Individual card width
  const totalCards = myCards.length;

  // Calculate spacing to ensure even distribution
  let spacing = cardWidth;
  if (totalCards > 1) {
    spacing = Math.min((containerWidth - cardWidth) / (totalCards - 1), cardWidth - 20);
  }

  return (
    <div className="game-container">
      {/* Game Title */}
      <h1 className="game-title">KIRÁLY 2.0</h1>

      {/* Card Image - Shows drawn card or cardback */}
      <div className="card-container">
        {cardDrawn ? (
          <>
            <p className="card-text">
              {players[whosTurnIsIt]?.name} drew {cardDrawn.name}!
            </p>
            <img src={cardDrawn.src} className="drawn-card" alt={cardDrawn.name} />
            <p className="effect-text">Effect: {cardDrawn.effect || "No effect for now"}</p>
          </>
        ) : (
          <img
            src="/CardImages/cardbacks/BlackBack.png"
            className="drawn-card cardback"
            alt="Card Back"
          />
        )}
      </div>

      {/* Floating Buttons - Only Visible for Current Player */}
      {deck.length > 0 && players.length > 0 && whosTurnIsIt !== null &&
        players[whosTurnIsIt]?.socketID === mySocketID && (
          cardDrawn === null ? (
            <button className="floating-button" onClick={drawACard}>
              Draw Card
            </button>
          ) : (
            <button className="floating-button" onClick={endTurn}>
              End Turn
            </button>
          )
        )}

      {/* Turn Order Panel (Top-Right) */}
      <div className="turn-order-container">
        <TurnOrderPanel players={players} whosTurnIsIt={whosTurnIsIt} />
      </div>

      {/* My Cards Section (Bottom) */}
      <div className="my-cards-container">
        {myCards.map((card, index) => {
          const totalCards = myCards.length;
          const containerWidth = 500; // Match max-width in CSS
          const cardWidth = 80; // Width of each card
          const baseSpacing = cardWidth; // Default spacing
          const overlapThreshold = totalCards > Math.floor(containerWidth / cardWidth); 

          // Dynamically calculate spacing
          const spacing = overlapThreshold 
            ? Math.min(baseSpacing, (containerWidth - cardWidth) / (totalCards - 1)) 
            : baseSpacing;

          return (
            <img
              key={index}
              src={card.src}
              alt={card.name}
              className="my-card"
              style={{
                position: "absolute",
                left: `${index * spacing}px`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Game;
