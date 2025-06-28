const cardEffects = {
  9: ({ player }) => ({ action: "chooseBrother", playerName: player.name }),
  22: ({ player }) => ({ action: "chooseBrother", playerName: player.name }),
  35: ({ player }) => ({ action: "chooseBrother", playerName: player.name }),
  48: ({ player }) => ({ action: "chooseBrother", playerName: player.name }),

  
  64: ({ player }) => ({ action: "mediumChooseCard", playerName: player.name }),

  69: ({ player, roomID, games, Cards }) => {
    const gameState = games[roomID];
    const forbiddenSpawnIDs = [57, 65, 69];

    if (player.joker?.id === 118) {
      return; // prevent effect
    }

    if (!player.cardsDrawn.length) {
      const spectralCards = Cards.filter(
        c => c.id >= 53 && c.id <= 70 && !forbiddenSpawnIDs.includes(c.id)
      );

      const randomCard = spectralCards[Math.floor(Math.random() * spectralCards.length)];
      if (randomCard) {
        gameState.deck.unshift({
          ...randomCard,
          source: `${player.name} - TRANCE (RANDOM)`
        });

        console.log(`[TRANCE] No cards to shuffle. Inserting safe spectral: ${randomCard.name}`);
      }

      player.effectState = {
        ...player.effectState,
        isTranceActive: true
      };

      return { action: "trance" };
    }

    player.effectState = {
      ...player.effectState,
      isTranceActive: true
    };

    return { action: "trance" };
  },

  57: ({ player, roomID, games, Cards }) => {
    const gameState = games[roomID];
    const cardsDrawn = player.cardsDrawn;

    if (player.joker?.id === 118) {
      return; // prevent effect
    }

    const lastCard = cardsDrawn
      .slice(0, -1)
      .reverse()
      .find(card => card?.id !== 57 && card?.source !== `${player.name} - DEJA VU`);

    let replayCard;

    const forbiddenSpawnIDs = [57, 65, 69];

    if (lastCard) {
      replayCard = { ...lastCard, source: `${player.name} - DEJA VU` };
      gameState.deck.unshift(replayCard);
      console.log(`[DEJA VU] Replaying card ${lastCard.name} for ${player.name}`);
    } else {
      const spectralCards = Cards.filter(
        c => c.id >= 53 && c.id <= 70 && !forbiddenSpawnIDs.includes(c.id)
      );

      const randomSpectral = spectralCards[Math.floor(Math.random() * spectralCards.length)];
      replayCard = { ...randomSpectral, source: `${player.name} - DEJA VU (Random)` };
      gameState.deck.unshift(replayCard);
      console.log(`[DEJA VU] No card to replay, using spectral: ${randomSpectral.name}`);
    }

    player.effectState = {
      ...player.effectState,
      hasActiveDejaVu: true
    };

    return { action: "dejaVu" };
  },

  53: ({ player, roomID, games }) => {
    const gameState = games[roomID];
    if (!gameState || !player?.name) return;

    if (player.joker?.id === 118) {
      return; // prevent effect
    }

    const equation = gameState.drinkEquation[player.name];
    if (equation) {
      equation.multipliers = 1;
      if (equation.flats >= 0) {
        equation.flats = 0;
      }
      console.log(`[ANKH] Reset drink equation for ${player.name}`, equation);
    }

    return { updatedDrinkEquation: true };
  },

  66: ({ player, roomID, games, Cards }) => {
    const gameState = games[roomID];
    if (!gameState || !player?.name) return;

    if (player.joker?.id === 118) {
      return; // prevent effect
    }

    const frenchCards = Cards.filter(c => c.cardType === "French");
    const drawCount = 2;

    // Pick ONE random French card
    const baseCard = frenchCards[Math.floor(Math.random() * frenchCards.length)];
    if (!baseCard) return;

    const clone = { ...baseCard, source: `${player.name} - SIGIL` };

    // Insert two copies at top of deck (last inserted will be drawn first)
    gameState.deck.unshift({ ...clone });
    gameState.deck.unshift({ ...clone });

    player.effectState = {
      ...player.effectState,
      sigilDrawsRemaining: drawCount
    };

    return {
      action: "sigilDraw",
      sigilDrawsRemaining: drawCount
    };
  },



  65: ({ player }) => {
    return { action: "ouijaChooseCard", playerName: player.name };
  },

  54: ({ player, roomID, games }) => {
    const gameState = games[roomID];
    if (!gameState || !player?.name) return;

    if (player.joker?.id === 118) {
      return; // prevent effect
    }

    const playerName = player.name;
    const oldGraph = gameState.brothersGraph;

    // Clone the old graph deeply
    const flippedGraph = {};
    for (const [source, targets] of Object.entries(oldGraph)) {
      flippedGraph[source] = [...targets];
    }

    // Find all sources that point to this player
    const incomingConnections = Object.entries(oldGraph)
      .filter(([_, targets]) => targets.includes(playerName))
      .map(([source]) => source);

    // For each source → playerName, remove that arrow
    for (const source of incomingConnections) {
      flippedGraph[source] = flippedGraph[source].filter(name => name !== playerName);
    }

    // Then make playerName → source connections
    if (!flippedGraph[playerName]) {
      flippedGraph[playerName] = [];
    }

    for (const source of incomingConnections) {
      if (!flippedGraph[playerName].includes(source)) {
        flippedGraph[playerName].push(source);
      }
    }

    gameState.brothersGraph = flippedGraph;

    console.log(`[AURA] Flipped arrows *pointed at* ${playerName}`, flippedGraph);

    return { updatedBrothersGraph: true };
  },


  68: ({ player, roomID, games, Cards }) => {
    const gameState = games[roomID];
    const forbiddenSpawnIDs = [57, 65, 66, 69, 63, 64];

    if (player.joker?.id === 118) {
      return; // prevent effect
    }

    const spectralCards = Cards.filter(
      c => c.id >= 53 && c.id <= 70 && !forbiddenSpawnIDs.includes(c.id)
    );

    const drawCount = 2;
    const chosen = [];

    for (let i = 0; i < drawCount; i++) {
      const random = spectralCards[Math.floor(Math.random() * spectralCards.length)];
      chosen.push({ ...random, source: `${player.name} - TALISMAN` });
    }

    for (let i = chosen.length - 1; i >= 0; i--) {
      gameState.deck.unshift(chosen[i]);
    }

    player.effectState = {
      ...player.effectState,
      talismanDrawsRemaining: drawCount
    };

    return { action: "talismanDraw", talismanDrawsRemaining: drawCount };
  },

  63: ({ player }) => {
    if (player.joker?.id === 118) {
      return; // prevent effect
    }

    player.effectState.incantationDrawsRemaining = 5;
    return {
      action: "incantationDraw",
      incantationDrawsRemaining: 5
    };
  },

  96: ({ player, roomID, games }) => {
    const gameState = games[roomID];
    if (!gameState || !player?.name) return;

    if (player.joker?.id === 119) {
      console.log(`[BLACKBOARD] ${player.name} is immune to Death (ID 96)`);
      return;
    }

    const equation = gameState.drinkEquation[player.name];
    if (equation) {
      equation.multipliers = 2;
      console.log(`[DEATH] Doubled multiplier for ${player.name}`, equation);
    }

    return { updatedDrinkEquation: true };
  },


  94: ({ player, roomID, games }) => {
    const gameState = games[roomID];
    if (!gameState || !player?.name) return;

    if (player.joker?.id === 119) {
      console.log(`[BLACKBOARD] ${player.name} is immune to Strength (ID 94)`);
      return;
    }

    const equation = gameState.drinkEquation[player.name];
    if (equation) {
      equation.flats -= 2;
      console.log(`[STRENGTH] Subtracted 2 from flats for ${player.name}`, equation);
    }

    return { updatedDrinkEquation: true };
  },


  86: ({ player, roomID, games }) => {
    const gameState = games[roomID];
    if (!gameState || !player?.name) return;

    if (player.joker?.id === 119) {
      console.log(`[BLACKBOARD] ${player.name} is immune to Empress (ID 86)`);
      return;
    }

    const equation = gameState.drinkEquation[player.name];
    if (equation) {
      const girls = Object.values(gameState.players).filter(p => p.team === "girl").length;
      equation.flats -= girls;
      console.log(`[EMPRESS] ${player.name} loses ${girls} from flats (girls count). Result:`, equation);
    }

    return { updatedDrinkEquation: true };
  },



  87: ({ player, roomID, games }) => {
    const gameState = games[roomID];
    if (!gameState || !player?.name) return;

    if (player.joker?.id === 119) {
      console.log(`[BLACKBOARD] ${player.name} is immune to Emperor (ID 87)`);
      return;
    }

    const equation = gameState.drinkEquation[player.name];
    if (equation) {
      const boys = Object.values(gameState.players).filter(p => p.team === "boy").length;
      equation.flats -= boys;
      console.log(`[EMPEROR] ${player.name} loses ${boys} from flats (boys count). Result:`, equation);
    }

    return { updatedDrinkEquation: true };
  },


  113: ({ player, roomID, games }) => {
    const gameState = games[roomID];
    if (!gameState || !player?.name) return;

    const equation = gameState.drinkEquation[player.name];
    if (equation) {
      equation.multipliers = 0.5;
      console.log(`[HALF JOKER] Multiplier set to 0.5 for ${player.name}`, equation);
    }

    return { updatedDrinkEquation: true };
  },

  129: ({ player, roomID, games }) => {
    const gameState = games[roomID];
    if (!gameState || !player?.name) return;

    const equation = gameState.drinkEquation[player.name];
    if (equation) {
      equation.flats -= 2;
      console.log(`[THE BARD] Subtracted 2 from flats for ${player.name}`, equation);
    }

    return { updatedDrinkEquation: true };
  },

  108: ({ player, roomID, games }) => {
    const gameState = games[roomID];
    if (!gameState || !player?.name) return;

    const equation = gameState.drinkEquation[player.name];
    if (equation) {
      equation.flats = -8;
      console.log(`[GLUTTONOUS] Set flats to -8 for ${player.name}`, equation);
    }

    return { updatedDrinkEquation: true };
  },

  141: ({ player, roomID, games }) => {
    const gameState = games[roomID];
    if (!gameState || !player?.name) return;

    const equation = gameState.drinkEquation[player.name];
    if (equation) {
      equation.flats += 7;
      console.log(`[MR. BONES] Added 7 to flats for ${player.name}`, equation);
    }

    return { updatedDrinkEquation: true };
  },








};

module.exports = cardEffects;
