import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGameContext } from "../components/GameContext";
import socket from "../socket.js";
import "../assets/Game.css";
import "../assets/Coinflip.css";
import "../assets/D20.css";
import D20 from "../D20.js";

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
    setCurrentPlayerName,
  } = useGameContext();

  const { roomID } = useParams();
  const [cardDrawn, setCardDrawn] = useState(null);
  const [isTurnEnded, setIsTurnEnded] = useState(false);
  const [mySocketID, setMySocketID] = useState(null);

  // Coinflip
  const [coinflipOpen, setCoinflipOpen] = useState(false);
  const [flipResult, setFlipResult] = useState(null);

  // D20 Roller
  const [d20Open, setD20Open] = useState(false);
  const [rollResult, setRollResult] = useState(null);
  const d20Effect = rollResult ? D20.find(entry => entry.id === rollResult)?.effect : null;

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    setMySocketID(socket.id);
    socket.emit("joinGamePage", { roomID });

    socket.on("updateGameState", (data) => {
      const playerList = Object.values(data.players);
      setPlayers(playerList || []);
      setDeck(data.deck || []);
      setCurrentPlayerName(data.currentPlayerName || null);
      setCardDrawn(null);
      setIsTurnEnded(false);
    });

    socket.on("cardDrawn", ({ drawnCard, newDeck, updatedPlayers }) => {
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

  if (!mySocketID) return <div>Loading game...</div>;

  const myPlayer = players.find((player) => player.socketID === mySocketID);
  const myCards = myPlayer?.cardsDrawn || [];

  const drawACard = () => {
    if (cardDrawn || deck.length === 0 || myPlayer?.name !== currentPlayerName)
      return;
    socket.emit("drawCard", { roomID });
  };

  const endTurn = () => {
    if (myPlayer?.name !== currentPlayerName) return;
    setCardDrawn(null);
    setIsTurnEnded(true);
    socket.emit("endTurn", { roomID });
  };

  // Coinflip handlers
  const openCoinflip = () => {
    setFlipResult(null);
    setCoinflipOpen(true);
  };
  const closeCoinflip = () => setCoinflipOpen(false);
  const flipCoin = () => setFlipResult(Math.floor(Math.random() * 2));

  // D20 handlers
  const openD20 = () => {
    setRollResult(null);
    setD20Open(true);
  };
  const closeD20 = () => setD20Open(false);
  const rollD20 = () => setRollResult(Math.floor(Math.random() * 20) + 1);

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
      <h1 className="game-title">KIRALY 2.0</h1>

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

      {/* Coinflip Button */}
      <button className="coinflip-button" onClick={openCoinflip} title="Coinflip">
        <img src="/Icons/cflip.png" alt="Coinflip" className="coinflip-icon" />
      </button>

      {/* D20 Button (below Coinflip) */}
      <button className="d20-button" onClick={openD20} title="Roll D20">
        <img src="/Icons/d20.png" alt="Roll D20" className="d20-icon" />
      </button>

      {/* Coinflip Modal */}
      {coinflipOpen && (
        <div className="coinflip-modal-overlay">
          <div className="coinflip-modal">
            <button className="coinflip-close-button" onClick={closeCoinflip}>
              ×
            </button>
            {flipResult === null ? (
              <button className="coinflip-flip-button pixel-font" onClick={flipCoin}>
                Flip
              </button>
            ) : (
              <div className="coinflip-gif-container">
                <img
                  src={flipResult === 0 ? "/Coinflip/heads.gif" : "/Coinflip/tails.gif"}
                  alt={flipResult === 0 ? "Heads" : "Tails"}
                  className="coinflip-gif"
                />
                <div className="coinflip-result-overlay">
                  {flipResult === 0 ? "Fej" : "Írás"}
                </div>
              </div>
            )}
          </div>
        </div>
      )}


      {/* D20 Modal */}
      {d20Open && (
        <div className="d20-modal-overlay">
          <div className="d20-modal">
            <button className="d20-close-button" onClick={closeD20}>
              ×
            </button>
            {rollResult === null ? (
              <button className="d20-roll-button pixel-font" onClick={rollD20}>
                Roll
              </button>
            ) : (
              <>
                <div className="d20-gif-container">
                  <img src="/Coinflip/d20.gif" alt="Rolling D20" className="d20-gif" />
                  <div className="d20-result-overlay">{rollResult}</div>
                </div>
                {d20Effect && (
                  <p className="d20-effect-text pixel-font">Effect: {d20Effect}</p>
                )}
              </>
            )}
          </div>
        </div>
      )}


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
