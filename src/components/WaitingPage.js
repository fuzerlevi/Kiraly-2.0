import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Container, Button } from 'react-bootstrap';

import '../assets/WaitingPage.scss';

import socket from '../socket.js';
import { useGameContext } from '../components/GameContext'; // Import the custom hook

const WaitingPage = () => {
  const navigate = useNavigate();
  const { roomID } = useParams();
  const location = useLocation();
  const name = location.state;

  const { players, setPlayers } = useGameContext();

  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Let the backend know this player is ready
    socket.emit('onPlayerReady', { name });

    // Listen for updated player list and host name (from backend)
    socket.on('updatePlayers', (updatedPlayers) => {
      setPlayers(updatedPlayers); // Directly update the players list
    });

    // Listen for start game session
    socket.on('startGameSession', () => {
      if (players.length > 1) {
        navigate(`/game/${roomID}`);
      }
    });

    return () => {
      socket.off('startGameSession');
      socket.off('updatePlayers'); // Clean up the listener
    };
  }, [name, roomID, players.length, setPlayers, navigate]);

  const handleCopy = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    setShowCopyMessage(true);
    setTimeout(() => {
      setShowCopyMessage(false);
    }, 2500);
  };

  // Start the game (only accessible by host)
  const startGame = () => {
    console.log('Start Game clicked');
    // Emit event to start the game
    socket.emit('startGame', { roomID });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Container className="waiting-page-container vh-100 vw-100 d-flex align-items-center justify-content-center">
        <h2 className="mt-md-3 ms-2 me-2 mb-2">WAITING FOR OTHER PLAYERS...</h2>

        <div className="flickity-container mt-2 mt-md-4 mb-2 mb-md-4">
          <div className="hand">
            <div className="card card-1"><span></span></div>
            <div className="card card-2"><span></span></div>
            <div className="card card-3"><span></span></div>
          </div>
        </div>

        <div className="copy-text">
          <div className="text">Code: {roomID}</div>
          <CopyToClipboard text={`${roomID}`} onCopy={handleCopy}>
            <button><i className="fa fa-clone"></i></button>
          </CopyToClipboard>
        </div>

        {showCopyMessage && (
          <div className="notification-alert notification-alert--success">
            Code copied!
          </div>
        )}

        {/* Current Players Section */}
        <div className="current-players mt-4">
          <h5>Current Players:</h5>
          <ul>
          {players.map((player, index) => (
            <li key={index}>
              {player.name === name ? `${player.name}` : player.name}
            </li>
          ))}
          </ul>
        </div>

        {/* Start Game Button (Only for Host) */}
        {players[0] === name && (
          <Button onClick={startGame} className="mt-3" variant="primary">
            Start Game
          </Button>
        )}
      </Container>
    </motion.div>
  );
};

export default WaitingPage;
