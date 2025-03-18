const express = require('express');
const cors = require('cors');
const http = require('http');
const crypto = require("crypto");
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = http.createServer(app);
const io = require('socket.io')(server, { cors: { origin: "*" } });

app.use(express.static(path.join(__dirname, '../build')));

const Cards = require('./Cards'); // <-- Or import your cards array from a file

const games = {};
const socketToGameMap = {};

const shuffleDeck = (deck) => [...deck].sort(() => Math.random() - 0.5);

const createGameState = (gameID) => {
  const deck = shuffleDeck([...Cards]);
  return {
    gameID,
    hasStarted: false,
    players: {},
    deck: deck,
    currentPlayerIndex: 0
  };
};

const createPlayerState = (socketID) => ({
  socketID,
  name: null,
  team: null,
  isHost: false,
  cardsDrawn: []
});

io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected.`);

  socket.on("createGameRoom", () => {
    const gameID = crypto.randomBytes(3).toString('hex');
    const gameState = createGameState(gameID);

    gameState.players[socket.id] = createPlayerState(socket.id);
    socketToGameMap[socket.id] = gameID;
    games[gameID] = gameState;
    socket.join(gameID);
    
    socket.emit("createRoomResponse", { gameID: gameID, success: true });
  });

  socket.on("joinGameRoom", (data) => {
    const { gameID, playerName, playerGender } = data;
    const gameState = games[gameID];
  
    if (!gameID || !gameState) {
      socket.emit("joinRoomResponse", { error: "Game does not exist." });
      return;
    }
  
    const isHost = Object.keys(gameState.players).length === 0;
    
    gameState.players[socket.id] = {
      ...createPlayerState(socket.id),
      name: playerName,
      team: playerGender,
      isHost,
      socketID: socket.id, // Ensure this is stored and sent
    };
  
    io.to(gameID).emit("updatePlayers", Object.values(gameState.players));
    socketToGameMap[socket.id] = gameID;
    socket.join(gameID);
  
    socket.emit("joinRoomResponse", { gameID, success: true });
  });
  

  socket.on("startGame", ({ roomID }) => {
    const gameState = games[roomID];
    if (!gameState) return;
  
    gameState.hasStarted = true;
    
    io.to(roomID).emit("gameStarted", {
      roomID,
      players: Object.values(gameState.players).map(player => ({
        ...player,
        socketID: player.socketID || null, // Make sure socketID is always included
      })),
      deck: gameState.deck,
      whosTurnIsIt: gameState.currentPlayerIndex
    });
  });
  

  socket.on('joinGamePage', ({ roomID }) => {
    const gameState = games[roomID];
    if (gameState) {
      io.to(roomID).emit('updateGameState', {
        deck: gameState.deck,
        players: gameState.players,
        currentPlayerIndex: gameState.currentPlayerIndex
      });
    }
  });

  socket.on('drawCard', ({ roomID }) => {
    const gameState = games[roomID];
    if (!gameState || gameState.deck.length === 0) return;
  
    const drawnCard = gameState.deck.shift();
    const currentSocketID = Object.keys(gameState.players)[gameState.currentPlayerIndex];
    
    if (!gameState.players[currentSocketID]) return;
  
    gameState.players[currentSocketID].cardsDrawn.push(drawnCard);
  
    console.log(`Player ${gameState.players[currentSocketID].name} drew ${drawnCard.name}`);
  
    io.to(roomID).emit('cardDrawn', { 
      drawnCard, 
      newDeck: gameState.deck, 
      updatedPlayers: Object.values(gameState.players) 
    });
  });

  socket.on('endTurn', ({ roomID }) => {
    const gameState = games[roomID];
    if (!gameState) return;
  
    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % Object.keys(gameState.players).length;
  
    console.log(`Turn ended. Next turn: ${gameState.currentPlayerIndex}`);
  
    io.to(roomID).emit('updateGameState', {
      deck: gameState.deck,
      players: Object.values(gameState.players),
      currentPlayerIndex: gameState.currentPlayerIndex
    });
  });

  socket.on('disconnect', () => {
    const gameID = socketToGameMap[socket.id];
    const gameState = games[gameID];
    if (gameID && gameState) {
      delete gameState.players[socket.id];
      if (Object.keys(gameState.players).length === 0) {
        delete games[gameID];
      }
      delete socketToGameMap[socket.id];
    }
    console.log(`Socket ${socket.id} disconnected.`);
  });
});

const port = process.env.PORT || 8000;
server.listen(port, '0.0.0.0', () => {
  console.log(`Server is listening on port ${port}`);
});
