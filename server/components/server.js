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

const Cards = require('./Cards');
const cardEffects = require('./cardEffects');

const games = {};
const socketToGameMap = {};

const forbiddenSpawnIDs = [57, 65, 69]; // Déjà Vu, Ouija, Trance
const kingIDs = [13, 26, 39, 52];
const aceIDs = [1, 14, 27, 40];



const buildShuffledDeck = () => {
  const allCards = require("./Cards"); // or wherever your Cards array is

  const frenchAndSpectral = allCards.filter(
    (card) => card.cardType === "French" || card.cardType === "SPECTRAL"
  );

  const planetCards = allCards.filter(card => card.cardType === "PLANET");
  const selectedPlanets = shuffleArray(planetCards).slice(0, 2); // Pick 2 random PLANET cards

  const fullDeck = [...frenchAndSpectral, ...selectedPlanets];
  return shuffleArray(fullDeck); // Shuffle the final deck
};

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

const recalculateKingsRemaining = (gameState) => {
  const kingsInDeck = gameState.deck.filter(card => kingIDs.includes(card.id)).length;
  gameState.kingsRemaining = kingsInDeck;
};



//Toggle between shuffled and preassembled decks
const createGameState = (gameID) => {
  
  // SHUFFLED DECK
  // const deck = buildShuffledDeck();


  // TEST DECK
  const deck = [
    Cards.find(card => card.id === 13), // king
    Cards.find(card => card.id === 13), // king
    Cards.find(card => card.id === 69), // trance
    Cards.find(card => card.id === 13), // king
    Cards.find(card => card.id === 13), // king
    Cards.find(card => card.id === 13), // king
    Cards.find(card => card.id === 73), // planetx
    Cards.find(card => card.id === 13), // king
    
    

    

    // Cards.find(card => card.id === 9), // blood brother
    // Cards.find(card => card.id === 65), // ouija
    // Cards.find(card => card.id === 69), // trance
    // Cards.find(card => card.id === 57), // deja vu
    // Cards.find(card => card.id === 64), // medium
    // Cards.find(card => card.id === 66), // sigil
    // Cards.find(card => card.id === 54), // aura
    // Cards.find(card => card.id === 68), // talisman
    // Cards.find(card => card.id === 63), // Incantation
  ];

  const kingsInDeck = deck.filter(card => kingIDs.includes(card.id)).length;

  return {
    gameID,
    hasStarted: false,
    players: {},
    deck: deck,
    currentPlayerName: null,
    brothersGraph: {},
    drinkEquation: {},
    rulesText: "",
    kingsRemaining: kingsInDeck,
    lastDrawnCard: null,
    activePlanets: [],
    glowingPlanets: [],
    isEndOfRound: false,
  };
};


const createPlayerState = (socketID) => ({
  socketID,
  name: null,
  team: null,
  isHost: false,
  cardsDrawn: [],
  effectState: {
  isChoosingBrother: false,
  isChoosingMediumCard: false,
  isTranceActive: false,
  hasActiveDejaVu: false,
  isPlanetXActive: false,
  incantationDrawsRemaining: 0,
}

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

  socket.on("getAllCardMetadata", (callback) => {
    const metadata = Cards.map(({ id, name, effect, color, src, source }) => ({
      id, name, effect, color, src, source
    }));
    callback(metadata);
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

    const player = Object.values(gameState.players).find(p => p.socketID === socket.id);

    // Notify everyone with updated player list
    io.to(gameID).emit("updatePlayers", Object.values(gameState.players));


    const currentPlayer = Object.values(gameState.players).find(p => p.name === gameState.currentPlayerName);
    const lastDrawnCard = currentPlayer?.cardsDrawn?.slice(-1)[0] || null;

    // Refresh full game state for everyone (safety)
    io.to(gameID).emit("updateGameState", {
      deck: gameState.deck,
      players: Object.fromEntries(
        Object.entries(gameState.players).map(([sid, player]) => [
          sid,
          {
            ...player,
            effectState: { ...player.effectState },
          },
        ])
      ),
      currentPlayerName: gameState.currentPlayerName,
      brothersGraph: gameState.brothersGraph,
      drinkEquation: gameState.drinkEquation,
      rulesText: gameState.rulesText,
      lastDrawnCard,
      activePlanets: gameState.activePlanets,
    });
    
    if (player?.effectState?.isChoosingMediumCard) {
      socket.emit("triggerMediumChooseCard", { roomID: gameID, playerName: player.name });
    }
    if (player?.effectState?.isTranceActive) {
      socket.emit("triggerTrance", { roomID: gameID, playerName: player.name });
    }
    if (player?.effectState?.isChoosingBrother) {
      socket.emit("chooseBrotherPopup", { roomID: gameID, playerName: player.name });
    }
    if (player?.effectState?.hasActiveDejaVu) {
      socket.emit("triggerDejaVu", { roomID: gameID, playerName: player.name });
    }
    if (player?.effectState?.isChoosingOuijaCard) {
      socket.emit("triggerOuijaChooseCard", {
        roomID: gameID,
        playerName: player.name,
        cardsDrawn: player.cardsDrawn || [],
      });
    }
    
    if (player?.effectState?.sigilDrawsRemaining > 0) {
      socket.emit("triggerSigilDraw", {
        roomID: gameID,
        playerName: player.name,
        sigilDrawsRemaining: player.effectState.sigilDrawsRemaining
      });
    }

    if (player?.effectState?.incantationDrawsRemaining > 0) {
      socket.emit("triggerIncantationDraw", {
        roomID: gameID,
        playerName: player.name,
        incantationDrawsRemaining: player.effectState.incantationDrawsRemaining
      });
    }
    const roomID = gameID; // define roomID from the already existing gameID variable

    if (player?.effectState?.isPlanetXActive) {
      socket.emit("triggerPlanetXShuffle", { roomID });
    }


    // If game already started, emit gameStarted only to this reconnecting socket
    if (gameState.hasStarted) {
      io.to(gameID).emit("playerReconnected", { playerName });
      socket.emit("gameStarted", {
        roomID: gameID,
        players: Object.values(gameState.players),
        deck: gameState.deck,
        whosTurnIsIt: gameState.currentPlayerName,
        kingsRemaining: gameState.kingsRemaining,
      });
    }

    // Also restore rules text and drink equation for the reconnecting client
    socket.emit("updateRulesText", gameState.rulesText);
    socket.emit("updateDrinkEquation", gameState.drinkEquation);


    // Response back to the reconnected player
    socket.emit("joinRoomResponse", { gameID, success: true });
    socket.emit("updateEndOfRound", gameState.isEndOfRound);

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
        drinkEquation: gameState.drinkEquation,
        rulesText: gameState.rulesText,
        kingsRemaining: gameState.kingsRemaining,
        lastDrawnCard: gameState.lastDrawnCard,
        activePlanets: gameState.activePlanets,
      });

      const player = Object.values(gameState.players).find(p => p.socketID === socket.id);

      if (player?.effectState?.isChoosingBrother) {
        socket.emit("chooseBrotherPopup", { roomID, playerName: player.name });
      }

      if (player?.effectState?.isChoosingMediumCard) {
        socket.emit("triggerMediumChooseCard", { roomID, playerName: player.name });
      }

      if (player?.effectState?.isTranceActive) {
        socket.emit("triggerTrance", { roomID, playerName: player.name });
      }

      if (player?.effectState?.isPlanetXActive) {
        socket.emit("triggerPlanetXShuffle", { roomID, playerName: player.name });
      }


      // 🔁 Re-trigger glow for all currently glowing planets
      for (const planetName of gameState.glowingPlanets) {
        socket.emit("planetGlow", { planetName });
      }


      socket.emit("updateRulesText", gameState.rulesText);
      socket.emit("updateDrinkEquation", gameState.drinkEquation);
      socket.emit("updateEndOfRound", gameState.isEndOfRound);

    }
  });


  socket.on('drawCard', ({ roomID }) => {
    const gameState = games[roomID];
    if (!gameState) return;

    if (gameState.deck.length === 0) {
      console.log("[DRAW] No cards left — game over.");
      io.to(roomID).emit("gameOver");
      return;
    }

    if (gameState.isEndOfRound) {
      gameState.isEndOfRound = false;
      io.to(roomID).emit("updateEndOfRound", false);
    }


    const currentPlayer = Object.values(gameState.players).find(
      (p) => p.name === gameState.currentPlayerName
    );
    if (!currentPlayer) return;

    const drawnCard = gameState.deck.shift();
    
    gameState.lastDrawnCard = drawnCard;

    // only push non planet cards into hand
    if (drawnCard.cardType !== "PLANET") {
      currentPlayer.cardsDrawn.push(drawnCard);
    }

    // Decrement incantationDrawsRemaining if the drawn card is a PLANET and incantation is active
    if (drawnCard.cardType === "PLANET" && currentPlayer.effectState.incantationDrawsRemaining > 0) {
      currentPlayer.effectState.incantationDrawsRemaining--;
      console.log(`[INCANTATION] Decremented due to PLANET card. Remaining: ${currentPlayer.effectState.incantationDrawsRemaining}`);
    }


    if (drawnCard.id === 73) {
      gameState.activePlanets.push(drawnCard);

      currentPlayer.effectState.isPlanetXActive = true;

      const currentPlayerSocket = currentPlayer.socketID;
      if (currentPlayerSocket) {
        io.to(currentPlayerSocket).emit("triggerPlanetXShuffle", { roomID });
      }

      // Still emit cardDrawn so the UI updates
      const upcomingCard = gameState.deck[0];

      io.to(roomID).emit("cardDrawn", {
        drawnCard,
        newDeck: gameState.deck,
        updatedPlayers: Object.values(gameState.players),
        kingsRemaining: gameState.kingsRemaining,
        nextCard: upcomingCard || null,
        activePlanets: gameState.activePlanets,
      });

      return;
    }



    // ☿️ MERCURY: Add +X to drinkEquation based on turn order distance
    if (drawnCard.name === "Mercury") {
      const playerList = Object.values(gameState.players); // keep join order
      const currentIndex = playerList.findIndex(p => p.name === currentPlayer.name);

      playerList.forEach((player, i) => {
        const distance = (i - currentIndex + playerList.length) % playerList.length;
        if (!gameState.drinkEquation[player.name]) {
          gameState.drinkEquation[player.name] = { flats: 0, multipliers: 1 };
        }
        gameState.drinkEquation[player.name].flats += distance;
      });

      io.to(roomID).emit("updateDrinkEquation", gameState.drinkEquation);
    }


    // 🌌 If this is a PLANET card, activate it
    if (drawnCard.cardType === "PLANET") {
      gameState.activePlanets.push(drawnCard);
    }

    if (kingIDs.includes(drawnCard.id)) {
      const plutoIsActive = gameState.activePlanets?.some(card => card.name === "Pluto");
      if (plutoIsActive) {
        if (!gameState.glowingPlanets.includes("Pluto")) {
          gameState.glowingPlanets.push("Pluto"); // ✅ Track glow
        }
        io.to(roomID).emit("planetGlow", { planetName: "Pluto" });
      }
    }

    if (aceIDs.includes(drawnCard.id)) {
      const neptuneIsActive = gameState.activePlanets?.some(card => card.name === "Neptune");
      if (neptuneIsActive) {
        if (!gameState.glowingPlanets.includes("Neptune")) {
          gameState.glowingPlanets.push("Neptune"); // ✅ Track glow
        }
        io.to(roomID).emit("planetGlow", { planetName: "Neptune" });
      }
    }

    // 🔴 Check if a red French card is drawn AND Mars is active
    if (drawnCard.id >= 14 && drawnCard.id <= 39) {
      const marsIsActive = gameState.activePlanets?.some(card => card.name === "Mars");
      if (marsIsActive) {
        if (!gameState.glowingPlanets.includes("Mars")) {
          gameState.glowingPlanets.push("Mars"); // ✅ track it
        }
        io.to(roomID).emit("planetGlow", { planetName: "Mars" });
      }
    }

    // 🔟 Check if a 10 is drawn AND Eris is active
    const tenIDs = [10, 23, 36, 49];
    if (tenIDs.includes(drawnCard.id)) {
      const erisIsActive = gameState.activePlanets?.some(card => card.name === "Eris");
      if (erisIsActive) {
        if (!gameState.glowingPlanets.includes("Eris")) {
          gameState.glowingPlanets.push("Eris");
        }
        io.to(roomID).emit("planetGlow", { planetName: "Eris" });
      }
    }

    // 🌾 CERES glows on any card draw
    const ceresIsActive = gameState.activePlanets?.some(card => card.name === "Ceres");
    if (ceresIsActive) {
      if (!gameState.glowingPlanets.includes("Ceres")) {
        gameState.glowingPlanets.push("Ceres");
      }
      io.to(roomID).emit("planetGlow", { planetName: "Ceres" });
    }

    // 🌀 URANUS glows when specific card IDs are drawn
    const uranusTriggerIDs = [8, 21, 34, 47, 56, 60];
    if (uranusTriggerIDs.includes(drawnCard.id)) {
      const uranusIsActive = gameState.activePlanets?.some(card => card.name === "Uranus");
      if (uranusIsActive) {
        if (!gameState.glowingPlanets.includes("Uranus")) {
          gameState.glowingPlanets.push("Uranus"); // ✅ Track glow
        }
        io.to(roomID).emit("planetGlow", { planetName: "Uranus" });
      }
    }

    const queenIDs = [12, 25, 38, 51];
    if (queenIDs.includes(drawnCard.id)) {
      const venusIsActive = gameState.activePlanets?.some(card => card.name === "Venus");
      if (venusIsActive) {
        if (!gameState.glowingPlanets.includes("Venus")) {
          gameState.glowingPlanets.push("Venus");
        }
        io.to(roomID).emit("planetGlow", { planetName: "Venus" });

        // 💃 Boost flats for girls
        for (const player of Object.values(gameState.players)) {
          if (player.team === "girl") {
            const name = player.name;
            if (gameState.drinkEquation[name]) {
              gameState.drinkEquation[name].flats += 1;
            }
          }
        }

        io.to(roomID).emit("updateDrinkEquation", gameState.drinkEquation);
      }
    }


    const jackIDs = [11, 24, 37, 50];
    if (jackIDs.includes(drawnCard.id)) {
      const jupiterIsActive = gameState.activePlanets?.some(card => card.name === "Jupiter");
      if (jupiterIsActive) {
        if (!gameState.glowingPlanets.includes("Jupiter")) {
          gameState.glowingPlanets.push("Jupiter");
        }
        io.to(roomID).emit("planetGlow", { planetName: "Jupiter" });

        // 💪 Boost flats for boys
        for (const player of Object.values(gameState.players)) {
          if (player.team === "boy") {
            const name = player.name;
            if (gameState.drinkEquation[name]) {
              gameState.drinkEquation[name].flats += 1;
            }
          }
        }

        io.to(roomID).emit("updateDrinkEquation", gameState.drinkEquation);
      }
    }












    // ✅ Deactivate Deja Vu only after drawing the DEJA VU or OUIJA clone
    const isCloneFromDejaVu = drawnCard?.source?.includes("DEJA VU");
    const isCloneFromOuija = drawnCard?.source?.includes("OUIJA");

    if (currentPlayer.effectState?.hasActiveDejaVu && (isCloneFromDejaVu || isCloneFromOuija)) {
      console.log(`[EFFECT] Deactivating hasActiveDejaVu after clone: ${drawnCard.name}`);
      currentPlayer.effectState.hasActiveDejaVu = false;
    }





    // Decrement SIGIL draw count if active
    if (currentPlayer.effectState?.sigilDrawsRemaining > 0) {
      currentPlayer.effectState.sigilDrawsRemaining--;
      console.log(`[SIGIL] ${currentPlayer.name} has ${currentPlayer.effectState.sigilDrawsRemaining} draw(s) remaining.`);
    }

    if (currentPlayer.effectState?.talismanDrawsRemaining > 0) {
      currentPlayer.effectState.talismanDrawsRemaining--;
      console.log(`[TALISMAN] ${currentPlayer.name} has ${currentPlayer.effectState.talismanDrawsRemaining} draw(s) remaining.`);
    }

    const shouldDecrementIncantation =
      currentPlayer.effectState?.incantationDrawsRemaining > 0 &&
      (
        !drawnCard?.source ||
        (
          !drawnCard.source.includes("TALISMAN") &&
          !drawnCard.source.includes("SIGIL") &&
          !drawnCard.source.includes("DEJA VU") &&
          !drawnCard.source.includes("OUIJA")

        )
      );

    if (shouldDecrementIncantation) {
      console.log(`[INCANTATION] ${currentPlayer.name} has ${currentPlayer.effectState.incantationDrawsRemaining} draw(s) remaining.`);
      currentPlayer.effectState.incantationDrawsRemaining--;
      console.log(`[INCANTATION] ${currentPlayer.name} has ${currentPlayer.effectState.incantationDrawsRemaining} draw(s) remaining.`);
    }




    

    // Decrease kingsRemaining if a king is drawn
    if (kingIDs.includes(drawnCard.id)) {
      gameState.kingsRemaining = Math.max(0, gameState.kingsRemaining - 1);
      console.log(`[KING] Drew a King! Kings remaining: ${gameState.kingsRemaining}`);
    }


    console.log(`Player ${currentPlayer.name} drew ${drawnCard.name}`);


    // Run any registered card effect
    const effectFn = cardEffects[drawnCard.id];
    if (effectFn) {
      console.log("Triggering card effect for:", drawnCard.name);
      const result = effectFn({
        player: currentPlayer,
        roomID,
        games,
        Cards,
      });

      if (result?.updatedDrinkEquation) {
        io.to(roomID).emit("updateDrinkEquation", gameState.drinkEquation);
      }

      if (result?.updatedBrothersGraph) {
        io.to(roomID).emit("updateBrothersGraph", cloneGraph(gameState.brothersGraph));
      }



      if (result?.action === "chooseBrother") {
        currentPlayer.effectState = {
          ...currentPlayer.effectState,
          isChoosingBrother: true
        };
        io.to(currentPlayer.socketID).emit("triggerChooseBrother", {
          roomID,
          playerName: currentPlayer.name,
          cause: drawnCard.name,
        });

      } else if (result?.action === "mediumChooseCard") {
        currentPlayer.effectState = {
          ...currentPlayer.effectState,
          isChoosingMediumCard: true
        };
        io.to(currentPlayer.socketID).emit("triggerMediumChooseCard", {
          roomID,
          playerName: currentPlayer.name,
          cause: drawnCard.name,
        });

      } else if (result?.action === "trance") {
        currentPlayer.effectState = {
          ...currentPlayer.effectState,
          isTranceActive: true
        };
        io.to(currentPlayer.socketID).emit("triggerTrance", {
          roomID,
          playerName: currentPlayer.name,
          cause: drawnCard.name,
        });

      }
      else if (result?.action === "ouijaChooseCard") {
        const player = Object.values(gameState.players).find(p => p.name === currentPlayer.name);
        if (!player) return;

        // Exclude the Ouija card itself
        const nonOuija = player.cardsDrawn.filter(c => c.id !== 65 && c.id !== 57); // 65 = Ouija, 57 = Deja Vu


        if (nonOuija.length === 0) {
          // Fallback: spawn a random spectral
          const spectralCards = Cards.filter(
            c => c.id >= 53 && c.id <= 70 && !forbiddenSpawnIDs.includes(c.id)
          );

          const randomCard = {
            ...spectralCards[Math.floor(Math.random() * spectralCards.length)],
            source: `${player.name} - OUIJA (RANDOM)`
          };
          gameState.deck.unshift(randomCard);

          player.effectState.isChoosingOuijaCard = false;
          player.effectState.hasActiveDejaVu = true;

          const sid = Object.keys(gameState.players).find(sid => gameState.players[sid].name === player.name);
          io.to(sid).emit("triggerDejaVu", {
            roomID,
            playerName: player.name,
            cause: drawnCard.name
          });


        } else {
          player.effectState.isChoosingOuijaCard = true;
          const sid = player.socketID;
          io.to(sid).emit("triggerOuijaChooseCard", {
            roomID,
            playerName: player.name,
            cardsDrawn: nonOuija,  // send only non-Ouija cards
            cause: drawnCard.name
          });
        }
      }
      else if (result?.action === "sigilDraw") {
        const socketID = currentPlayer.socketID;
        if (socketID) {
          io.to(socketID).emit("triggerSigilDraw", {
            roomID,
            playerName: currentPlayer.name,
            sigilDrawsRemaining: result.sigilDrawsRemaining,
            cause: drawnCard.name,
          });
        }
      }

      else if (result?.action === "talismanDraw") {
        const socketID = currentPlayer.socketID;
        if (socketID) {
          io.to(socketID).emit("triggerTalismanDraw", {
            roomID,
            playerName: currentPlayer.name,
            talismanDrawsRemaining: result.talismanDrawsRemaining,
            cause: drawnCard.name,
          });
        }
      }
      else if (result?.action === "incantationDraw") {
        currentPlayer.effectState.incantationDrawsRemaining = result.incantationDrawsRemaining;

        const socketID = currentPlayer.socketID;
        if (socketID) {
          io.to(socketID).emit("triggerIncantationDraw", {
            roomID,
            playerName: currentPlayer.name,
            incantationDrawsRemaining: result.incantationDrawsRemaining,
            cause: drawnCard.name,
          });
        }
      }




    }

    const upcomingCard = gameState.deck[0];

    // Normalize card source field
    if (drawnCard.Source && !drawnCard.source) {
      drawnCard.source = drawnCard.Source;
      delete drawnCard.Source;
    }


    io.to(roomID).emit("cardDrawn", {
      drawnCard,
      newDeck: gameState.deck,
      updatedPlayers: Object.values(gameState.players),
      kingsRemaining: gameState.kingsRemaining,
      nextCard: upcomingCard || null,
      activePlanets: gameState.activePlanets
    });
  });



  socket.on('endTurn', ({ roomID }) => {
    const gameState = games[roomID];
    if (!gameState) return;

    const currentPlayer = Object.values(gameState.players).find(
      p => p.name === gameState.currentPlayerName
    );
    if (!currentPlayer) return;

    // 🚫 Prevent turn end if SIGIL draws are not finished
    if (currentPlayer.effectState?.sigilDrawsRemaining > 0) {
      console.log(`[SIGIL] ${currentPlayer.name} still has ${currentPlayer.effectState.sigilDrawsRemaining} draw(s) remaining.`);
      return;
    }

    if (currentPlayer.effectState?.talismanDrawsRemaining > 0) {
      console.log(`[TALISMAN] ${currentPlayer.name} still has ${currentPlayer.effectState.talismanDrawsRemaining} draw(s) remaining.`);
      return;
    }

    if (currentPlayer.effectState?.incantationDrawsRemaining > 0) {
      console.log(`[INCANTATION] Cannot end turn — ${currentPlayer.effectState.incantationDrawsRemaining} draws remaining.`);
      return;
    }






    const playerList = Object.values(gameState.players); // keep join order
    const currentIndex = playerList.findIndex(p => p.name === gameState.currentPlayerName);
    const nextIndex = (currentIndex + 1) % playerList.length;

    const isLastPlayer = nextIndex === 0;
    gameState.isEndOfRound = isLastPlayer;
    io.to(roomID).emit("updateEndOfRound", gameState.isEndOfRound);


    gameState.currentPlayerName = playerList[nextIndex]?.name || null;
    gameState.lastDrawnCard = null;

    for (const player of Object.values(gameState.players)) {
      player.effectState = {
        isChoosingBrother: false,
        isChoosingMediumCard: false,
        isTranceActive: false,
        hasActiveDejaVu: false,
        isChoosingOuijaCard: false,
        sigilDrawsRemaining: 0,
      };
    }

    console.log(`Turn ended. Next: ${gameState.currentPlayerName}`);

    io.to(roomID).emit('updateGameState', {
      deck: gameState.deck,
      players: Object.fromEntries(
        Object.entries(gameState.players).map(([sid, player]) => [
          sid,
          {
            ...player,
            effectState: { ...player.effectState },
          },
        ])
      ),

      currentPlayerName: gameState.currentPlayerName,
      brothersGraph: cloneGraph(gameState.brothersGraph),
      drinkEquation: gameState.drinkEquation,
      rulesText: gameState.rulesText,
      kingsRemaining: gameState.kingsRemaining,
      lastDrawnCard: gameState.lastDrawnCard,
      activePlanets: gameState.activePlanets,
    });

    gameState.glowingPlanets = []; // ✅ Clear tracked glows
    io.to(roomID).emit("clearPlanetGlow");

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

  const cloneGraph = (graph) => {
    const newGraph = {};
    for (const key in graph) {
      newGraph[key] = [...graph[key]];
    }
    return newGraph;
  };

  socket.on('addBrotherConnection', ({ roomID, sourceName, targetName }) => {
    const gameState = games[roomID];
    if (!gameState) return;

    if (!gameState.brothersGraph[sourceName]) {
      gameState.brothersGraph[sourceName] = [];
    }

    if (!gameState.brothersGraph[sourceName].includes(targetName)) {
      gameState.brothersGraph[sourceName].push(targetName);
      console.log(`[BROTHERS] Added ${sourceName} → ${targetName}`);
    } else {
      console.log(`[BROTHERS] Duplicate ${sourceName} → ${targetName}, skipping add.`);
    }

    // Always emit a fresh clone
    io.to(roomID).emit("updateBrothersGraph", cloneGraph(gameState.brothersGraph));


    console.log(`[BROTHERS] Re-added ${sourceName} → ${targetName}`);
    console.log("[Updated brothersGraph]", gameState.brothersGraph);

    // Deep clone without JSON
    const clonedGraph = cloneGraph(gameState.brothersGraph);
    io.to(roomID).emit("updateBrothersGraph", clonedGraph);

    const sourcePlayer = Object.values(gameState.players).find(p => p.name === sourceName);
    if (sourcePlayer) {
      sourcePlayer.effectState.isChoosingBrother = false;
    }


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
      entry.flats += delta;
    } else if (field === "multipliers") {
      entry.multipliers = Math.max(0.5, entry.multipliers + delta);
    }


    io.to(roomID).emit("updateDrinkEquation", gameState.drinkEquation);
  });

  socket.on("triggerChooseBrother", ({ roomID, playerName }) => {
    const gameState = games[roomID];
    if (!gameState) return;

    const playerSocketID = Object.keys(gameState.players).find(
      sid => gameState.players[sid].name === playerName
    );

    if (playerSocketID) {
      io.to(playerSocketID).emit("chooseBrotherPopup");
    }
  });

  socket.on("updateRulesText", ({ roomID, text }) => {
    const gameState = games[roomID];
    if (!gameState) return;

    gameState.rulesText = text;
    io.to(roomID).emit("updateRulesText", text);
  });

  socket.on("addCardCopiesToDeck", ({ roomID, cardID, count, sourcePlayer }) => {
    const gameState = games[roomID];
    if (!gameState) return;

    const card = Cards.find(c => c.id === cardID);
    if (!card) {
      console.log(`[MEDIUM] Invalid card ID ${cardID}`);
      return;
    }

    // 👁️ Look ahead at the next card in the deck
    const nextCard = gameState.deck[0];
    const isTalismanSpawn =
      nextCard &&
      nextCard.id >= 53 && nextCard.id <= 70 &&
      nextCard.source?.includes("TALISMAN");

    // 🎯 Decide insert position
    const insertAfterIndex = isTalismanSpawn ? 1 : 0;

    for (let i = 0; i < count; i++) {
      const newCard = { ...card, source: `${sourcePlayer} - MEDIUM` };
      gameState.deck.splice(
        insertAfterIndex + Math.floor(Math.random() * (gameState.deck.length - insertAfterIndex + 1)),
        0,
        newCard
      );
    }

    console.log(`[MEDIUM] Added ${count} copies of ${card.name} (ID ${cardID})`);
    console.log("[MEDIUM] Updated deck:", gameState.deck.map(c => c.id));

    const player = Object.values(gameState.players).find(p => p.name === sourcePlayer);
    if (player?.effectState) {
      player.effectState.isChoosingMediumCard = false;
    }
  });



  socket.on("tranceShuffleCards", ({ roomID, playerName }) => {
    const gameState = games[roomID];
    if (!gameState) return;

    const player = Object.values(gameState.players).find(p => p.name === playerName);
    if (!player) return;

    const socketID = Object.keys(gameState.players).find(sid => gameState.players[sid].name === playerName);

    const nonTranceCards = player.cardsDrawn.filter(card => card.id !== 69);

    // 👻 Fallback: hand is empty *except* Trance
    if (nonTranceCards.length === 0) {
      const spectralCards = Cards.filter(
        c => c.id >= 53 && c.id <= 70 && !forbiddenSpawnIDs.includes(c.id)
      );

      const randomCard = {
        ...spectralCards[Math.floor(Math.random() * spectralCards.length)],
        source: `${player.name} - TRANCE (RANDOM)`
      };

      gameState.deck.unshift(randomCard);

      player.effectState.isTranceActive = false;
      player.effectState.hasActiveDejaVu = true;

      if (socketID) {
        io.to(socketID).emit("triggerDejaVu", { roomID, playerName });
      }

      return;
    }

    // 🌀 Shuffle back all non-Trance cards
    const shuffledBack = nonTranceCards.map(card => ({
      ...card,
      source: `${player.name} - TRANCE`,
    }));

    player.cardsDrawn = [];

    for (const card of shuffledBack) {
      const randomIndex = Math.floor(Math.random() * (gameState.deck.length + 1));
      gameState.deck.splice(randomIndex, 0, card);
    }

    recalculateKingsRemaining(gameState);

    console.log(`[TRANCE] Shuffled ${shuffledBack.length} cards from ${playerName} back into the deck`);

    io.to(roomID).emit("updateGameState", {
      deck: gameState.deck,
      players: Object.fromEntries(
        Object.entries(gameState.players).map(([sid, player]) => [
          sid,
          {
            ...player,
            effectState: { ...player.effectState },
          },
        ])
      ),
      currentPlayerName: gameState.currentPlayerName,
      brothersGraph: cloneGraph(gameState.brothersGraph),
      drinkEquation: gameState.drinkEquation,
      rulesText: gameState.rulesText,
      kingsRemaining: gameState.kingsRemaining,
    });

    if (socketID) {
      io.to(socketID).emit("tranceShuffleComplete");
    }

    player.effectState.isTranceActive = false;
  });

  socket.on("confirmOuijaChoice", ({ roomID, playerName, cardID }) => {
    const gameState = games[roomID];
    if (!gameState) return;

    const player = Object.values(gameState.players).find(p => p.name === playerName);
    if (!player) return;

    const chosenCard = player.cardsDrawn.find(c => c.id === cardID);
    if (!chosenCard) return;

    const clonedCard = { ...chosenCard, source: `${playerName} - OUIJA` };
    gameState.deck.unshift(clonedCard);

    player.effectState.isChoosingOuijaCard = false;
    player.effectState.hasActiveDejaVu = true;

    const socketID = Object.keys(gameState.players).find(sid => gameState.players[sid].name === playerName);
    if (socketID) {
      io.to(socketID).emit("triggerDejaVu", { roomID, playerName });
    }
  });

  socket.on("resolveSigilDraw", ({ roomID, playerName }) => {
    const gameState = games[roomID];
    if (!gameState) return;

    const player = Object.values(gameState.players).find(p => p.name === playerName);
    if (!player) return;

    // Mark that we are in Sigil resolution phase
    player.effectState.isResolvingSigil = false;

    // Just trigger drawCard twice (same as normal draw)
    for (let i = 0; i < 2; i++) {
      io.to(player.socketID).emit("forceDrawCard", { roomID });
    }
  });

  socket.on("planetXShuffle", ({ roomID, playerName }) => {
  const gameState = games[roomID];
  if (!gameState) return;

  const allCards = [];

  for (const player of Object.values(gameState.players)) {
    const nonPlanetCards = player.cardsDrawn.filter(c => c.cardType !== "PLANET");
    const toShuffle = nonPlanetCards.map(card => ({
      ...card,
      source: `${player.name} - PLANET X`
    }));

    allCards.push(...toShuffle);
    player.cardsDrawn = [];
  }

  for (const card of allCards) {
    const index = Math.floor(Math.random() * (gameState.deck.length + 1));
    gameState.deck.splice(index, 0, card);
  }

  recalculateKingsRemaining(gameState);

  console.log(`[PLANET X] Shuffled ${allCards.length} cards from all players into the deck`);

  // Broadcast updated game state to all clients
  io.to(roomID).emit("updateGameState", {
    deck: gameState.deck,
    players: Object.fromEntries(
      Object.entries(gameState.players).map(([sid, player]) => [
        sid,
        {
          ...player,
          effectState: { ...player.effectState },
        },
      ])
    ),
    currentPlayerName: gameState.currentPlayerName,
    brothersGraph: cloneGraph(gameState.brothersGraph),
    drinkEquation: gameState.drinkEquation,
    rulesText: gameState.rulesText,
    kingsRemaining: gameState.kingsRemaining,
    lastDrawnCard: null,
    activePlanets: gameState.activePlanets,
  });

  // 🔧 Find the player who triggered it
  const triggeringPlayer = Object.values(gameState.players).find(p => p.name === playerName);
  if (triggeringPlayer) {
    io.to(triggeringPlayer.socketID).emit("planetXShuffleComplete");
  }

  // Reset planetXActive flag for everyone
  for (const player of Object.values(gameState.players)) {
    player.effectState.isPlanetXActive = false;
  }

  gameState.glowingPlanets = [];
  io.to(roomID).emit("clearPlanetGlow");
});











});

const port = process.env.PORT || 8000;
server.listen(port, '0.0.0.0', () => {
  console.log(`Server is listening on port ${port}`);
});
