import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

import '../assets/WaitingPage.scss';

import socket from '../socket.js';
import { useGameContext } from '../components/GameContext';

const WaitingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomID } = useParams();

  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const timeoutRef = useRef(null);

  const [localName, setLocalName] = useState('');
  const [localGender, setLocalGender] = useState('');
  const [localIsHost, setLocalIsHost] = useState(false);

  const { players, setPlayers, setDeck, setCurrentPlayerName } = useGameContext();

  useEffect(() => {
    socket.on('updatePlayers', (updatedPlayers) => {
      const playersWithCards = updatedPlayers.map(player => ({
        ...player,
        cardsDrawn: []
      }));
      setPlayers(playersWithCards);
    });

    socket.on('gameStarted', ({ roomID, players: updatedPlayers, deck, whosTurnIsIt }) => {
      const playersWithCards = updatedPlayers.map(player => ({
        ...player,
        cardsDrawn: []
      }));

      setPlayers(playersWithCards);
      setCurrentPlayerName(whosTurnIsIt); // whosTurnIsIt is a name, not index
      setDeck(deck);

      console.log("Navigating to game page");
      navigate(`/game/${roomID}`);
    });

    return () => {
      socket.off('updatePlayers');
      socket.off('gameStarted');
    };
  }, [setPlayers, setDeck, setCurrentPlayerName, navigate]);

  useEffect(() => {
    const fallbackName = location.state?.name || localStorage.getItem("playerName");
    const fallbackGender = location.state?.gender || localStorage.getItem("playerGender");
    const fallbackIsHost =
      (location.state?.isHost === true || location.state?.isHost === "true") ||
      localStorage.getItem("isHost") === "true";

    setLocalName(fallbackName);
    setLocalGender(fallbackGender);
    setLocalIsHost(fallbackIsHost);

    if (fallbackName && roomID) {
      socket.auth = { playerName: fallbackName };
      if (!socket.connected) socket.connect();

      // Same pattern as Game.js
      socket.emit("joinGamePage", { roomID });
    }
  }, [location.state, roomID]);

  const handleCopyRoomID = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(roomID)
        .then(() => {
          setShowCopyMessage(true);
          clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => setShowCopyMessage(false), 2500);
        })
        .catch((err) => {
          console.error("Clipboard API failed:", err);
          fallbackCopy(roomID);
        });
    } else {
      fallbackCopy(roomID);
    }
  };

  const fallbackCopy = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";  // Prevent scrolling to bottom of page
    textarea.style.opacity = 0;
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      document.execCommand("copy");
      setShowCopyMessage(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setShowCopyMessage(false), 2500);
    } catch (err) {
      console.error("Fallback copy failed:", err);
    }

    document.body.removeChild(textarea);
  };


  const startGame = () => {
    socket.emit('startGame', { roomID });
  };

  console.log("Client's name:", localName);
  console.log("Players array:", players);
  console.log("Is host?", players.find(p => p.name === localName)?.isHost);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Container className="waiting-page-container vh-100 vw-100 d-flex align-items-center justify-content-center">
        <h2 className="waiting-text">WAITING FOR OTHER PLAYERS...</h2>

        <div className="flickity-container mt-2 mt-md-4 mb-2 mb-md-4">
          <div className="hand">
            <div className="card card-1"><span></span></div>
            <div className="card card-2"><span></span></div>
            <div className="card card-3"><span></span></div>
          </div>
        </div>

        <div className="copy-text">
          <div className="text">Code: {roomID}</div>
          <button onClick={handleCopyRoomID}><i className="fa fa-clone"></i></button>
        </div>

        {showCopyMessage && (
          <div className="notification-alert notification-alert--success">
            Code copied!
          </div>
        )}

        <div className="current-players mt-4">
          <h5>Current Players:</h5>
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {players.map((player, index) => (
              <li key={index}>
                {player.name} - {player.team === 'boy' ? 'Fiúk' : 'Lányok'}
              </li>
            ))}
          </ul>
        </div>

        {players.find(p => p.name === localName)?.isHost && (
          <Button onClick={startGame} className="mt-3 start-game-button" variant="primary">
            Start Game
          </Button>
        )}
      </Container>
    </motion.div>
  );
};

export default WaitingPage;
