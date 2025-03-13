import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Container, Form, Button } from 'react-bootstrap';

import AccordionMenu from './subcomponent/AccordionMenu';
import socket from '../socket.js';
import { useGameContext } from '../components/GameContext'; // Import the useGameContext hook

import '../assets/CreateGameForm.css';

const CreateGameForm = () => {
  const navigate = useNavigate();
  const { setPlayers } = useGameContext(); // Get the setPlayers function from context

  const [name, setName] = useState('');
  const [gameID, setGameID] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForm, setShowForm] = useState(null); // State to control form visibility

  // Handle receiving the response for create room and join room
  useEffect(() => {
    socket.on('createRoomResponse', (response) => {
      if (response.success) {
        const roomID = response.gameID;
        // Set the players context with the current player (host) information
        setPlayers([{ name, isHost: true }]); // Store the current player as the host
        navigate(`/waiting/${roomID}`, { state: name });
      } else {
        console.error(response.error);
      }
    });

    socket.on('joinRoomResponse', (response) => {
      if (response.success) {
        const roomID = response.gameID;
        // Set the players context with the current player (not the host) information
        setPlayers([{ name, isHost: false }]); // Store the current player as a non-host
        navigate(`/waiting/${roomID}`, { state: name });
      } else {
        setErrorMessage('Game room does not exist.');
        setShowErrorMessage(true);
        setTimeout(() => { setShowErrorMessage(false); }, 2500);
        console.error(response.error);
      }
    });

    return () => {
      socket.off('createRoomResponse');
      socket.off('joinRoomResponse');
    };
  }, [name, navigate, setPlayers]);

  const GameTitle = () => {
    return (
      <motion.div
        className="create-game-form-title"
        initial={{ scale: 0 }}
        animate={{ rotate: 360, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 17 }}
      >
        Király 2.0
      </motion.div>
    );
  };

  // Handle the response for creating a room (for HOST button)
  const handleHostSubmit = (event) => {
    event.preventDefault();
    if (name.trim() === '') {
      setErrorMessage('Please enter a valid name.');
      setShowErrorMessage(true);
      setTimeout(() => { setShowErrorMessage(false); }, 2500);
      return;
    }

    // Send user data to create the room (with host flag)
    const user = { name, isHost: true };
    socket.emit('createGameRoom', user, (response) => {
      if (response.success) {
        const roomID = response.gameID;
        // Set the players context with the current player (host) information
        setPlayers([{ name, isHost: true }]); // Store the current player as the host
        navigate(`/waiting/${roomID}`, { state: name });
      } else {
        setErrorMessage('Failed to create a game room.');
        console.error(response.error);
      }
    });
  };

  // Handle the response for joining a room
  const handleJoinSubmit = (event) => {
    event.preventDefault();
    if (name.trim() === '' || gameID.trim() === '') {
      setErrorMessage('Please enter a valid name and game code.');
      setShowErrorMessage(true);
      setTimeout(() => { setShowErrorMessage(false); }, 2500);
      return;
    }

    // Send user data to join the room (with host flag set to false)
    const user = { name, isHost: false };
    socket.emit('joinGameRoom', { gameID, user }, (response) => {
      if (response.success) {
        // Set the players context with the current player (not the host) information
        setPlayers([{ name, isHost: false }]); // Store the current player as a non-host
        navigate(`/waiting/${gameID}`, { state: name });
      } else {
        setErrorMessage('Game code does not exist.');
        setShowErrorMessage(true);
        setTimeout(() => { setShowErrorMessage(false); }, 2500);
        console.error(response.error);
      }
    });
  };

  return (
    <Container className="create-game-form-container vh-100 d-flex align-items-center justify-content-center">
      {GameTitle()}
      <motion.div
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Button Section */}
        {showForm === null && (
          <>
            <Button 
              className="mb-3 btn create-game-form-button" 
              onClick={() => setShowForm('host')}
            >
              HOST GAME
            </Button>
            <Button 
              className="mb-3 btn join-game-form-button" 
              onClick={() => setShowForm('join')}
            >
              JOIN GAME
            </Button>
          </>
        )}

        {/* Create Room Form (HOST) */}
        {showForm === 'host' && (
          <Form onSubmit={handleHostSubmit} style={{ maxWidth: '200px', minHeight: '200px' }}>
            <Form.Group className="mb-2 text-left">
              <Form.Label className="create-game-form-label float-start">
                Név (host):
              </Form.Label>
              <Form.Control 
                type="text" 
                value={name} 
                onChange={(event) => setName(event.target.value)} 
                className="create-game-form-input" 
                id="name" 
                placeholder="Pl: Kasi" 
              />
            </Form.Group>
            <Button className="mb-9 mb-sm-6 create-game-form-button" type="submit">
              HOST
            </Button>
          </Form>
        )}

        {/* Join Room Form */}
        {showForm === 'join' && (
          <Form onSubmit={handleJoinSubmit} style={{ maxWidth: '200px' }}>
            <Form.Group className="mb-2 mb-sm-4 text-left">
              <Form.Label className="create-game-form-label float-start">
                Név (Mindenki más):
              </Form.Label>
              <Form.Control 
                type="text" 
                value={name} 
                onChange={(event) => setName(event.target.value)} 
                className="create-game-form-input" 
                id="name" 
                placeholder="Enter your name" 
              />
            </Form.Group>
            <Form.Group className="mb-2 mb-sm-5 text-left">
              <Form.Label className="create-game-form-label float-start">
                Kód:
              </Form.Label>
              <Form.Control 
                type="text" 
                value={gameID} 
                onChange={(event) => setGameID(event.target.value)} 
                className="create-game-form-input" 
                id="gameID" 
                placeholder="Pl: zdh3fj" 
              />
            </Form.Group>
            <Button className="mb-3 btn join-game-form-button" type="submit">
              JOIN VIA CODE
            </Button>
          </Form>
        )}

        <AccordionMenu></AccordionMenu>
        {showErrorMessage && (<div className="notification-alert notification-alert--error">{errorMessage}</div>)}
      </motion.div>
    </Container>
  );
};

export default CreateGameForm;
