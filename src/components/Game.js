import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGameContext } from "../components/GameContext";
import socket from "../socket.js";
import "../assets/Game.css";

const TurnOrderPanel = ({ players = [], currentPlayerName }) => (
  <div className="turn-order-panel">
    <h3 className="turn-order-title">Ki jön?</h3>
    <ul className="turn-order-list">
      {players.map((player, index) => (
        <li
          key={index}
          className={`turn-order-item ${player.name === currentPlayerName ? "current-turn" : ""}`}
        >
          {player.name}
        </li>
      ))}
    </ul>
  </div>
);

const Game = () => {
  const {
    players,
    deck,
    currentPlayerName,
    setDeck,
    setPlayers,
    setCurrentPlayerName
  } = useGameContext();

  const { roomID } = useParams();
  const [cardDrawn, setCardDrawn] = useState(null);
  const [isTurnEnded, setIsTurnEnded] = useState(false);
  const [mySocketID, setMySocketID] = useState(null);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    setMySocketID(socket.id);

    socket.emit("joinGamePage", { roomID });

    socket.on("updateGameState", (data) => {
      console.log("Game State Updated:", data);
      const playerList = Object.values(data.players); // No sorting
      setPlayers(playerList || []);
      setDeck(data.deck || []);
      setCurrentPlayerName(data.currentPlayerName || null);
      setCardDrawn(null);
      setIsTurnEnded(false);
    });

    socket.on("cardDrawn", ({ drawnCard, newDeck, updatedPlayers }) => {
      console.log("🃏 Card drawn:", drawnCard);
      setCardDrawn(drawnCard);
      setDeck(newDeck || []);
      setPlayers(updatedPlayers || []);
      setIsTurnEnded(false);
    });

    socket.on("playerDisconnected", ({ playerName }) => {
      alert(`${playerName} disconnected. Waiting for reconnection...`);
    });

    socket.on("playerReconnected", ({ playerName }) => {
      console.log(`${playerName} has reconnected.`);
    });

    socket.on("gameStarted", (data) => {
      console.log("Game started for this socket:", data);
      setPlayers(data.players || []);
      setDeck(data.deck || []);
      setCurrentPlayerName(data.currentPlayerName || null);
      setCardDrawn(null);
      setIsTurnEnded(false);
    });

    return () => {
      socket.off("updateGameState");
      socket.off("cardDrawn");
      socket.off("playerDisconnected");
      socket.off("playerReconnected");
      socket.off("gameStarted");
    };
  }, [roomID, setDeck, setPlayers, setCurrentPlayerName]);

  if (!mySocketID) {
    return <div>Loading game...</div>;
  }

  const myPlayer = players.find((player) => player.socketID === mySocketID);
  const myCards = myPlayer?.cardsDrawn || [];

  const drawACard = () => {
    if (
      cardDrawn ||
      deck.length === 0 ||
      myPlayer?.name !== currentPlayerName
    )
      return;
    socket.emit("drawCard", { roomID });
  };

  const endTurn = () => {
    if (myPlayer?.name !== currentPlayerName) return;
    setCardDrawn(null);
    setIsTurnEnded(true);
    socket.emit("endTurn", { roomID });
  };

  const containerWidth = 600;
  const cardWidth = 100;
  const totalCards = myCards.length;
  let spacing = cardWidth;

  if (totalCards > 1) {
    spacing = Math.min(
      (containerWidth - cardWidth) / (totalCards - 1),
      cardWidth - 20
    );
  }

  return (
    <div className="game-container">
      <h1 className="game-title">KIRÁLY 2.0</h1>

      <div className="card-container">
        {cardDrawn ? (
          <>
            <p className="card-text">
              {currentPlayerName} drew {cardDrawn.name}!
            </p>
            <img
              src={cardDrawn.src}
              className="drawn-card"
              alt={cardDrawn.name}
            />
            <p className="effect-text">
              Effect: {cardDrawn.effect || "No effect for now"}
            </p>
          </>
        ) : (
          <img
            src="/CardImages/cardbacks/BlackBack.png"
            className="drawn-card cardback"
            alt="Card Back"
          />
        )}
      </div>

      {deck.length > 0 &&
        players.length > 0 &&
        currentPlayerName &&
        myPlayer?.name === currentPlayerName &&
        (cardDrawn === null ? (
          <button className="floating-button" onClick={drawACard}>
            Draw Card
          </button>
        ) : (
          <button className="floating-button" onClick={endTurn}>
            End Turn
          </button>
        ))}

      <div className="turn-order-container">
        <TurnOrderPanel
          players={players}
          currentPlayerName={currentPlayerName}
        />
      </div>

      <div className="my-cards-container">
        {myCards.map((card, index) => {
          const containerWidth = 500;
          const cardWidth = 80;
          const baseSpacing = cardWidth;
          const overlapThreshold =
            totalCards > Math.floor(containerWidth / cardWidth);

          const spacing = overlapThreshold
            ? Math.min(
                baseSpacing,
                (containerWidth - cardWidth) / (totalCards - 1)
              )
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
