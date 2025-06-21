const cardEffects = {
  9: ({ player }) => ({ action: "chooseBrother", playerName: player.name }),
  22: ({ player }) => ({ action: "chooseBrother", playerName: player.name }),
  35: ({ player }) => ({ action: "chooseBrother", playerName: player.name }),
  48: ({ player }) => ({ action: "chooseBrother", playerName: player.name }),

  64: ({ player }) => ({ action: "mediumChooseCard", playerName: player.name }),

  69: ({ player, roomID, games, Cards }) => {
    const gameState = games[roomID];
    const forbiddenSpawnIDs = [57, 65, 69];

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

  66: ({ player, roomID, games }) => {
    const gameState = games[roomID];
    if (!gameState || gameState.deck.length === 0) return;

    const topCard = gameState.deck[0];
    if (!topCard) return;

    const clone = { ...topCard, source: `${player.name} - SIGIL` };
    gameState.deck.splice(1, 0, clone);

    player.effectState = {
      ...player.effectState,
      sigilDrawsRemaining: 2
    };

    return { action: "sigilDrawTwice", sigilDrawsRemaining: 2 };
  },

  65: ({ player }) => {
    return { action: "ouijaChooseCard", playerName: player.name };
  },

  54: ({ player, roomID, games }) => {
    const gameState = games[roomID];
    if (!gameState || !player?.name) return;

    const playerName = player.name;
    const oldGraph = gameState.brothersGraph;

    const flippedGraph = {};
    for (const [source, targets] of Object.entries(oldGraph)) {
      flippedGraph[source] = targets.filter(name => name !== playerName);
    }

    const newBrothers = Object.entries(oldGraph)
      .filter(([_, targets]) => targets.includes(playerName))
      .map(([source, _]) => source);

    flippedGraph[playerName] = newBrothers;
    gameState.brothersGraph = flippedGraph;

    console.log(`[AURA] Flipped brother connections for ${playerName}`, flippedGraph);

    return { updatedBrothersGraph: true };
  },

  68: ({ player, roomID, games, Cards }) => {
    const gameState = games[roomID];
    const forbiddenSpawnIDs = [57, 65, 66, 69, 63];

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
    player.effectState.incantationDrawsRemaining = 5;
    return {
      action: "incantationDraw",
      incantationDrawsRemaining: 5
    };
  },

};

module.exports = cardEffects;
