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
  const { setPlayers } = useGameContext();

  const [name, setName] = useState('');
  const [gameID, setGameID] = useState('');
  const [gender, setGender] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForm, setShowForm] = useState(null); 

  useEffect(() => {
    socket.on('createRoomResponse', (response) => {
      if (response.success) {
        const roomID = response.gameID;
        navigate(`/waiting/${roomID}`, { state: { name, gender } });
      } else {
        console.error(response.error);
      }
    });

    socket.on('joinRoomResponse', (response) => {
      if (response.success) {
        const roomID = response.gameID;
        navigate(`/waiting/${roomID}`, { state: { name, gender } });
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
  }, [name, gender, navigate, setPlayers]);

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

  const handleHostSubmit = (event) => {
    event.preventDefault();
    if (name.trim() === '' || gender.trim() === '') {
      setErrorMessage('Please enter a valid name and select a gender.');
      setShowErrorMessage(true);
      setTimeout(() => { setShowErrorMessage(false); }, 2500);
      return;
    }

    const user = { name, isHost: true, gender };
    socket.emit('createGameRoom', user, (response) => {
      if (response.success) {
        const roomID = response.gameID;
        navigate(`/waiting/${roomID}`, { state: { name, gender } });
      } else {
        setErrorMessage('Failed to create a game room.');
        console.error(response.error);
      }
    });
  };

  const handleJoinSubmit = (event) => {
    event.preventDefault();
    if (name.trim() === '' || gameID.trim() === '' || gender.trim() === '') {
      setErrorMessage('Please enter a valid name, game code, and select a gender.');
      setShowErrorMessage(true);
      setTimeout(() => { setShowErrorMessage(false); }, 2500);
      return;
    }

    const user = { name, isHost: false, gender };
    socket.emit('joinGameRoom', { gameID, user }, (response) => {
      if (response.success) {
        navigate(`/waiting/${gameID}`, { state: { name, gender } });
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
        {/* Show Main Menu */}
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

            {/* 🟢 Show Guide button only in main menu */}
            <AccordionMenu />
          </>
        )}

        {/* Host Game Form */}
        {showForm === 'host' && (
          <Form onSubmit={handleHostSubmit} style={{ maxWidth: '200px', minHeight: '200px' }}>
            <Form.Group className="mb-2 text-left">
              <Form.Label className="create-game-form-label float-start">
                Név:
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

            {/* Gender Selection */}
            <Form.Group className="mb-2 mb-sm-4 text-left create-game-form-input-container">
              <Form.Label className="create-game-form-label">
                Csapat:
              </Form.Label>
              <Form.Control 
                as="select"
                value={gender} 
                onChange={(event) => setGender(event.target.value)} 
                className="create-game-form-select"
              >
                <option value="" disabled>-Válassz csapatot-</option>
                <option value="boy">Fiúk</option>
                <option value="girl">Lányok</option>
              </Form.Control>
            </Form.Group>

            <Button className="mb-3 create-game-form-button" type="submit">
              HOST
            </Button>

            {/* 🔙 Back Button */}
            <Button 
              className="mb-3 back-game-form-button" 
              onClick={() => setShowForm(null)}
            >
              ← Back
            </Button>
          </Form>
        )}

        {/* Join Game Form */}
        {showForm === 'join' && (
          <Form onSubmit={handleJoinSubmit} style={{ maxWidth: '200px' }}>
            <Form.Group className="mb-2 mb-sm-4 text-left">
              <Form.Label className="create-game-form-label float-start">
                Név:
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

            {/* 🔙 Back Button */}
            <Button 
              className="mb-3 back-game-form-button" 
              onClick={() => setShowForm(null)}
            >
              ← Back
            </Button>
          </Form>
        )}

        {showErrorMessage && (<div className="notification-alert notification-alert--error">{errorMessage}</div>)}
      </motion.div>
    </Container>
  );
};

export default CreateGameForm;
