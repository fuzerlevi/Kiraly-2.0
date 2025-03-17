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
  const { name, gender } = location.state; // Destructure both correctly

  const { players, setPlayers } = useGameContext();

  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Emitting the join event with player name and room ID
    socket.emit('joinGameRoom', { gameID: roomID, playerName: name, playerGender: gender });

    // Listen for updated player list from the server
    socket.on('updatePlayers', (updatedPlayers) => {
      // Add empty arrays for cardsDrawn and brothers to each player
      const updatedPlayersWithArrays = updatedPlayers.map(player => ({
        ...player,
        cardsDrawn: [],  // Empty array for cards drawn
        brothers: []     // Empty array for brothers
      }));

      // Update the players state with the modified player objects
      setPlayers(updatedPlayersWithArrays);
    });

    // Listen for when the game starts
    socket.on('gameStarted', ({ roomID, players: updatedPlayers }) => {
      // Make sure to include the empty arrays for cardsDrawn and brothers
      const updatedPlayersWithArrays = updatedPlayers.map(player => ({
        ...player,
        cardsDrawn: [],
        brothers: []
      }));

      // Update the players state with the modified player objects
      setPlayers(updatedPlayersWithArrays);

      // Log and navigate to the game page
      console.log("Navigating to game page with players:", updatedPlayersWithArrays);
      navigate(`/game/${roomID}`, { state: { players: updatedPlayersWithArrays } });
    });

    return () => {
      socket.off('updatePlayers'); // Cleanup the listener
      socket.off('gameStarted');   // Cleanup the listener
    };
  }, [name, gender, roomID, setPlayers, navigate]); // Only rerun if dependencies change

  // Separate useEffect to log player updates
  useEffect(() => {
    console.log("Updated players state:", players);
  }, [players]);

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
    console.log('Start Game clicked, emitting event...');
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
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {players.map((player, index) => (
              <li key={index}>
                {player.name} - {player.gender === 'boy' ? 'Fiúk' : 'Lányok'}
              </li>
            ))}
          </ul>
        </div>

        {/* Start Game Button (Only for Host) */}
        {players[0]?.name === name && (
          <Button onClick={startGame} className="mt-3" variant="primary">
            Start Game
          </Button>
        )}
      </Container>
    </motion.div>
  );
};

export default WaitingPage;
