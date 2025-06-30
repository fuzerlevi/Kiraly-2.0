import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Container, Form, Button } from 'react-bootstrap';

import AccordionMenu from './subcomponent/AccordionMenu';
import socket from '../socket.js';
import { useGameContext } from '../components/GameContext';

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

  const GameTitle = () => (
    <motion.div
      className="create-game-form-title pixel-font"
      initial={{ scale: 0 }}
      animate={{ rotate: 360, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 17 }}
    >
      Király <br /><span className="joker-edition-text">Joker Edition</span>
    </motion.div>
  );


  const handleHostSubmit = (event) => {
    event.preventDefault();
    if (name.trim() === '' || gender.trim() === '') {
      setErrorMessage('Please enter a valid name and select a gender.');
      setShowErrorMessage(true);
      setTimeout(() => { setShowErrorMessage(false); }, 2500);
      return;
    }

    // ✅ Inject playerName into socket auth before connect
    socket.auth = { playerName: name };
    if (!socket.connected) socket.connect();

    const user = { name, isHost: true, gender };

    socket.emit('createGameRoom', user, (response) => {
      if (response.success) {
        const roomID = response.gameID;
        navigate(`/waiting/${roomID}`, { state: { name, gender, isHost: true } });
      } else {
        setErrorMessage('Failed to create a game room.');
        console.error(response.error);
      }
    });
  };


  const handleJoinSubmit = (event) => {
    socket.auth = { playerName: name };
    if (!socket.connected) socket.connect();
    event.preventDefault();
    if (name.trim() === '' || gameID.trim() === '' || gender.trim() === '') {
      setErrorMessage('Please enter a valid name, game code, and select a gender.');
      setShowErrorMessage(true);
      setTimeout(() => { setShowErrorMessage(false); }, 2500);
      return;
    }

    socket.emit('checkGameStatus', { gameID }, (response) => {
      if (!response || response.error) {
        setErrorMessage('Game not found.');
        setShowErrorMessage(true);
        return;
      }

      if (response.hasStarted) {
        socket.emit('joinGameRoom', { gameID, playerName: name, playerGender: gender }, (res) => {
          if (res.success) {
            navigate(`/game/${gameID}`);
          } else {
            setErrorMessage('Failed to rejoin game.');
            setShowErrorMessage(true);
            console.error(res.error);
          }
        });
      } else {
        const user = { name, isHost: false, gender };
        socket.emit('joinGameRoom', { gameID, user }, (res) => {
          if (res.success) {
            navigate(`/waiting/${gameID}`, { state: { name, gender, isHost: false } });
          } else {
            setErrorMessage('Game code does not exist.');
            setShowErrorMessage(true);
            console.error(res.error);
          }
        });
      }
    });
  };

  return (
    <Container className="create-game-form-container vh-100 d-flex align-items-center justify-content-center pixel-font">
      {GameTitle()}

      <motion.div
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {showForm === null && (
          <>
            <Button
              className="mb-3 btn create-game-form-button pixel-font"
              onClick={() => setShowForm('host')}
            >
              HOST GAME
            </Button>
            <Button
              className="mb-3 btn join-game-form-button pixel-font"
              onClick={() => setShowForm('join')}
            >
              JOIN GAME
            </Button>
            <AccordionMenu />
          </>
        )}

        {showForm === 'host' && (
          <Form onSubmit={handleHostSubmit} style={{ maxWidth: '300px', minHeight: '200px' }}>
            <Form.Group className="mb-2 text-left pixel-font">
              <Form.Label className="create-game-form-label float-start pixel-font">Name:</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="create-game-form-input pixel-font"
                id="name"
                placeholder="Pl: Kasi"
              />
            </Form.Group>

            <Form.Group className="mb-2 mb-sm-4 text-left create-game-form-input-container pixel-font">
              <Form.Label className="create-game-form-label pixel-font">Team:</Form.Label>
              <Form.Control
                as="select"
                value={gender}
                onChange={(event) => setGender(event.target.value)}
                className="create-game-form-select pixel-font"
              >
                <option value="" disabled>-Choose-</option>
                <option value="boy">Boys</option>
                <option value="girl">Girls</option>
              </Form.Control>
            </Form.Group>

            <Button className="mb-3 create-game-form-button pixel-font" type="submit">HOST</Button>
            <Button className="mb-3 back-game-form-button pixel-font" onClick={() => setShowForm(null)}>Back</Button>
          </Form>
        )}

        {showForm === 'join' && (
          <Form onSubmit={handleJoinSubmit} style={{ maxWidth: '300px' }}>
            <Form.Group className="mb-2 mb-sm-4 text-left pixel-font">
              <Form.Label className="create-game-form-label float-start pixel-font">Név:</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="create-game-form-input pixel-font"
                id="name"
                placeholder="Enter your name"
              />
            </Form.Group>

            <Form.Group className="mb-2 mb-sm-5 text-left pixel-font">
              <Form.Label className="create-game-form-label float-start pixel-font">Kód:</Form.Label>
              <Form.Control
                type="text"
                value={gameID}
                onChange={(event) => setGameID(event.target.value)}
                className="create-game-form-input"
                id="gameID"
                placeholder="Pl: zdh3fj"
              />
            </Form.Group>

            <Form.Group className="mb-2 mb-sm-4 text-left create-game-form-input-container pixel-font">
              <Form.Label className="create-game-form-label pixel-font">Csapat:</Form.Label>
              <Form.Control
                as="select"
                value={gender}
                onChange={(event) => setGender(event.target.value)}
                className="create-game-form-select pixel-font"
              >
                <option value="" disabled>-Choose-</option>
                <option value="boy">Boys</option>
                <option value="girl">Girls</option>
              </Form.Control>
            </Form.Group>

            <Button className="mb-3 btn join-game-form-button pixel-font" type="submit">JOIN VIA CODE</Button>
            <Button className="mb-3 back-game-form-button pixel-font" onClick={() => setShowForm(null)}>Back</Button>
          </Form>
        )}

        {showErrorMessage && (
          <div className="notification-alert notification-alert--error">{errorMessage}</div>
        )}
      </motion.div>
    </Container>
  );
};

export default CreateGameForm;
