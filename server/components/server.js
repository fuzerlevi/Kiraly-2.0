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
    currentPlayerName: null,
    brothersGraph: {},
    drinkEquation: {}
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

    socket.on("createGameRoom", (user, callback) => {
    const gameID = crypto.randomBytes(3).toString('hex');
    const gameState = createGameState(gameID);

    gameState.players[socket.id] = {
      ...createPlayerState(socket.id),
      name: user.name,
      team: user.gender,
      isHost: user.isHost,
    };

    gameState.drinkEquation[user.name] = {
      flats: 0,
      multipliers: 1
    };


    socketToGameMap[socket.id] = gameID;
    games[gameID] = gameState;
    socket.join(gameID);

    callback?.({ gameID: gameID, success: true });
  });


  socket.on("joinGameRoom", (data) => {
  const gameID = data.roomID || data.gameID;
  const gameState = games[gameID];

  if (!gameID || !gameState) {
    socket.emit("joinRoomResponse", { error: "Game does not exist." });
    return;
  }

  let playerName, playerGender, isHost;
  if (data.user) {
    playerName = data.user.name;
    playerGender = data.user.gender;
    isHost = data.user.isHost;
  } else {
    // Fallback for reconnecting players
    playerName = data.playerName;
    playerGender = data.playerGender;
    isHost = Object.keys(gameState.players).length === 0;
  }

  // Check if this player already existed (reconnection case)
  const existingSocketID = Object.keys(gameState.players).find(
    sid =>
      gameState.players[sid].name === playerName &&
      gameState.players[sid].team === playerGender
  );

  if (existingSocketID) {
    // Reconnect logic
    const oldPlayer = gameState.players[existingSocketID];
    oldPlayer.socketID = socket.id;

    // Reassign under new socket ID (preserve player object in memory)
    gameState.players[socket.id] = oldPlayer;

    // Remove only after reassignment (to prevent mutation issues)
    if (existingSocketID !== socket.id) {
      delete gameState.players[existingSocketID];
    }

    socketToGameMap[socket.id] = gameID;
    delete socketToGameMap[existingSocketID];
    console.log(`Player ${playerName} reconnected with new socket ${socket.id}`);
  } else {
    // Fresh join
    gameState.players[socket.id] = {
      ...createPlayerState(socket.id),
      name: playerName,
      team: playerGender,
      isHost,
      socketID: socket.id,
    };

    if (!gameState.drinkEquation[playerName]) {
      gameState.drinkEquation[playerName] = {
        flats: 0,
        multipliers: 1
      };
    }

    socketToGameMap[socket.id] = gameID;
  }

  socket.join(gameID);

  // Notify everyone with updated player list
  io.to(gameID).emit("updatePlayers", Object.values(gameState.players));

  // Refresh full game state for everyone (safety)
  io.to(gameID).emit("updateGameState", {
    deck: gameState.deck,
    players: gameState.players,
    currentPlayerName: gameState.currentPlayerName,
    brothersGraph: gameState.brothersGraph,
    drinkEquation: gameState.drinkEquation
  });


  // If game already started, emit gameStarted only to this reconnecting socket
  if (gameState.hasStarted) {
    io.to(gameID).emit("playerReconnected", { playerName });
    socket.emit("gameStarted", {
      roomID: gameID,
      players: Object.values(gameState.players),
      deck: gameState.deck,
      whosTurnIsIt: gameState.currentPlayerName,
    });
  }

  // Response back to the reconnected player
  socket.emit("joinRoomResponse", { gameID, success: true });
});

  
  

  socket.on("startGame", ({ roomID }) => {
    const gameState = games[roomID];
    if (!gameState) return;
  
    gameState.hasStarted = true;
  
    const playerList = Object.values(gameState.players); // keep join order
    gameState.currentPlayerName = playerList[0]?.name || null;
  
    io.to(roomID).emit("gameStarted", {
      roomID,
      players: playerList.map(player => ({
        ...player,
        socketID: player.socketID || null,
      })),
      deck: gameState.deck,
      whosTurnIsIt: gameState.currentPlayerName
    });
  });
  
  

  socket.on('joinGamePage', ({ roomID }) => {
    const gameState = games[roomID];
    if (gameState) {
      io.to(roomID).emit('updateGameState', {
        deck: gameState.deck,
        players: gameState.players,
        currentPlayerName: gameState.currentPlayerName,
        brothersGraph: gameState.brothersGraph,
        drinkEquation: gameState.drinkEquation
      });
    }
  });

  socket.on('drawCard', ({ roomID }) => {
    const gameState = games[roomID];
    if (!gameState || gameState.deck.length === 0) return;
  
    const currentPlayer = Object.values(gameState.players).find(p => p.name === gameState.currentPlayerName);
    if (!currentPlayer) return;
  
    const drawnCard = gameState.deck.shift();
    currentPlayer.cardsDrawn.push(drawnCard);
  
    console.log(`Player ${currentPlayer.name} drew ${drawnCard.name}`);
  
    io.to(roomID).emit('cardDrawn', { 
      drawnCard, 
      newDeck: gameState.deck, 
      updatedPlayers: Object.values(gameState.players) 
    });
  });

  socket.on('endTurn', ({ roomID }) => {
    const gameState = games[roomID];
    if (!gameState) return;
  
    const playerList = Object.values(gameState.players); // keep join order
  
    const currentIndex = playerList.findIndex(p => p.name === gameState.currentPlayerName);
    const nextIndex = (currentIndex + 1) % playerList.length;
  
    gameState.currentPlayerName = playerList[nextIndex]?.name || null;
  
    console.log(`Turn ended. Next: ${gameState.currentPlayerName}`);
  
    io.to(roomID).emit('updateGameState', {
      deck: gameState.deck,
      players: playerList,
      currentPlayerName: gameState.currentPlayerName
    });
  });
  

  socket.on('disconnect', () => {
    const gameID = socketToGameMap[socket.id];
    const gameState = games[gameID];
  
    if (!gameID || !gameState) return;
  
    const player = gameState.players[socket.id];
    if (player) {
      console.log(`Player ${player.name} disconnected (socket ${socket.id}).`);
    } else {
      console.log(`Unknown socket ${socket.id} disconnected.`);
    }
  
    // Note: do NOT delete the player or game
    // We keep the player data intact for reconnection
  
    delete socketToGameMap[socket.id];
  });
  

  socket.on("checkGameStatus", ({ gameID }, callback) => {
    const game = games[gameID];
    if (!game) {
      return callback({ error: "Game not found" });
    }
  
    return callback({ hasStarted: game.hasStarted });
  });

  socket.on('addBrotherConnection', ({ roomID, sourceName, targetName }) => {
    const gameState = games[roomID];
    if (!gameState) return;

    if (!gameState.brothersGraph[sourceName]) {
      gameState.brothersGraph[sourceName] = [];
    }

    if (!gameState.brothersGraph[sourceName].includes(targetName)) {
      gameState.brothersGraph[sourceName].push(targetName);
    }

    console.log(`[BROTHERS] Updated brothersGraph for ${roomID}:`);
    console.log(gameState.brothersGraph);

    io.to(roomID).emit("updateBrothersGraph", gameState.brothersGraph);
  });

  socket.on('removeBrotherConnection', ({ roomID, sourceName, targetName }) => {
    const gameState = games[roomID];
    if (!gameState) return;

    if (gameState.brothersGraph[sourceName]) {
      gameState.brothersGraph[sourceName] = gameState.brothersGraph[sourceName].filter(
        (name) => name !== targetName
      );
    }

    console.log(`[removeBrotherConnection] ${sourceName} ❌→ ${targetName}`);
    console.log("[Updated brothersGraph]", gameState.brothersGraph);

    io.to(roomID).emit("updateBrothersGraph", gameState.brothersGraph);
  });

  socket.on("updateDrinkValue", ({ roomID, playerName, field, delta }) => {
    const gameState = games[roomID];
    if (!gameState || !gameState.drinkEquation[playerName]) return;

    const entry = gameState.drinkEquation[playerName];

    if (field === "flats") {
      entry.flats = Math.max(0, entry.flats + delta);
    } else if (field === "multipliers") {
      entry.multipliers = Math.max(1, entry.multipliers + delta);
    }

    io.to(roomID).emit("updateDrinkEquation", gameState.drinkEquation);
  });




});

const port = process.env.PORT || 8000;
server.listen(port, '0.0.0.0', () => {
  console.log(`Server is listening on port ${port}`);
});
