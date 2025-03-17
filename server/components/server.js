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

const io = require('socket.io')(server, { 
  cors: { origin: "*" }
});

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../build')));

const games = {};
const socketToGameMap = {};

// Simple game state creator
const createGameState = (gameID) => ({
  gameID,
  hasStarted: false,
  players: {}
});

// Simple player state creator
const createPlayerState = (socketID) => ({
  socketID,
  name: null,
  team: null,
  isHost: false,
//  cardsDrawn: [],   // Initialize as empty array
//  brothers: []      // Initialize as empty array
});

io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected.`);

  // Create a new game room
  socket.on("createGameRoom", () => {
    const gameID = crypto.randomBytes(3).toString('hex');
    const gameState = createGameState(gameID);

    gameState.players[socket.id] = createPlayerState(socket.id);
    socketToGameMap[socket.id] = gameID;
    games[gameID] = gameState;
    socket.join(gameID);
    
    socket.emit("createRoomResponse", { gameID: gameID, success: true });
  });

  // Join an existing game room
  socket.on("joinGameRoom", (data) => {
    const { gameID, playerName, playerGender } = data; // added playerGender to the data
    const gameState = games[gameID];

    if (!gameID || !gameState) {
      socket.emit("joinRoomResponse", { error: "Game does not exist." });
      return;
    }

    const isHost = Object.keys(gameState.players).length === 0; // First player is host
    gameState.players[socket.id] = { name: playerName, gender: playerGender, isHost }; // added gender to the player object

    io.to(gameID).emit("updatePlayers", Object.values(gameState.players));

    socketToGameMap[socket.id] = gameID;
    socket.join(gameID);

    socket.emit("joinRoomResponse", { gameID, success: true });
  });

  // Start the game (only host can start)
  socket.on("startGame", ({ roomID }) => {
    console.log(`Received startGame event for room: ${roomID}`);
    const gameState = games[roomID];
    if (!gameState) return;
    
    console.log(`Game ${roomID} started.`);

    const playersArray = Object.values(gameState.players);

    // Send roomID + latest players array
    io.to(roomID).emit("gameStarted", { roomID, players: playersArray });
  });

  // Handle player disconnection
  socket.on('disconnect', () => {
    const gameID = socketToGameMap[socket.id];
    const gameState = games[gameID];
    if (gameID) {
      delete games[gameID].players[socket.id];
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
