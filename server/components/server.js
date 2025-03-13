const {  createGameState, createPlayerState } = require('./api.js');
const express = require('express');
const cors = require('cors');
const http = require('http');
const crypto = require("crypto");
const path = require('path');
const bodyParser = require('body-parser');

const app = express()

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = http.createServer(app);

const io = require('socket.io')(server, { 
  cors: { origin: "*" }
});

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../build')));

app.use(express.static('build', { 
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Define a route that serves static JS files
app.use('/static/js', express.static(path.join(__dirname, '../build/static/js'), {
  setHeaders: function (res, path) {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Define a route that serves mp3 file
app.get('/background-music.mp3', (req, res) => {
  const filePath = path.resolve(__dirname, '../audio/background-music.mp3');
  res.setHeader('Content-Type', 'audio/mpeg');
  res.sendFile(filePath);
});

// Define a route that serves mp3 file
app.get('/placeholder.png', (req, res) => {
  const filePath = path.resolve(__dirname, '../audio/placeholder.png');
  res.setHeader('Content-Type', 'image/png');
  res.sendFile(filePath);
});

// Define a route that serves the index.html file
//__dirname : It will resolve to your project folder
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});

// Catch-all route that serves the index.html file for any other routes
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});

// Delays code by a specificed amount (in miliseconds)
const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};



const games = {};
const socketToGameMap = {};

// IO handler for new socket connection
io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected.`);

  // Event handler for creating a game room
  socket.on("createGameRoom", () => {
    const gameID = crypto.randomBytes(3).toString('hex');
    const gameState = createGameState(gameID);

    gameState.players[socket.id] = createPlayerState(socket.id);
    socketToGameMap[socket.id] = gameID;
    games[gameID] = gameState;
    socket.join(gameID);
    
    socket.emit("createRoomResponse", { gameID: gameID, success: true });
  });

  // Event handler for joining a game room
  socket.on("joinGameRoom", (data) => {
    const gameID = data.gameID;
    const gameState = games[gameID];

    if (!gameID || !gameState) {
      socket.emit("joinRoomResponse", { error: "Game does not exist." });
      return;
    }

    gameState.players[socket.id] = createPlayerState(socket.id);
    socketToGameMap[socket.id] = gameID;
    
    if (!socket.rooms.has(gameID)) {
      socket.join(gameID);
    }

    socket.emit("joinRoomResponse", { gameID: gameID, success: true });
  });

  // Event handler for when a socket disconnects
  socket.on('disconnect', () => {
    const gameID = socketToGameMap[socket.id];
    const gameState = games[gameID];
    if (gameID) {
      delete games[gameID].players[socket.id]
      if (Object.keys(gameState.players).length == 0) {
        delete games[gameID]
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