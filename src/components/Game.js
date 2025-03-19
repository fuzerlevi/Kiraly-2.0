import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGameContext } from "../components/GameContext";
import socket from "../socket.js"; // Import the shared instance
import "../assets/Game.css";

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
      setCardDrawn(null); // 🔥 Reset card for the new player
      setIsTurnEnded(false); // 🔥 Reset turn flag
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
    if (players[whosTurnIsIt]?.socketID !== mySocketID) return; // 🔥 Prevent others from pressing it
    setCardDrawn(null);
    setIsTurnEnded(true);
    socket.emit("endTurn", { roomID });
  };

  return (
    <div className="game-container">
      {/* Game Title */}
      <h1 className="game-title">Game Page</h1>

      {/* Current Turn Display */}
      {players.length > 0 && (
        <p className="turn-message">{players[whosTurnIsIt]?.name}'s turn!</p>
      )}

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
            className="drawn-card"
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
    </div>
  );
};

export default Game;
