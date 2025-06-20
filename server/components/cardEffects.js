const cardEffects = {
  9: ({ player, roomID }) => ({ action: "chooseBrother", playerName: player.name }),
  22: ({ player, roomID }) => ({ action: "chooseBrother", playerName: player.name }),
  35: ({ player, roomID }) => ({ action: "chooseBrother", playerName: player.name }),
  48: ({ player, roomID }) => ({ action: "chooseBrother", playerName: player.name }),

  64: ({ player, roomID }) => ({ action: "mediumChooseCard", playerName: player.name }),

  69: ({ player, roomID, games, Cards }) => {
    const gameState = games[roomID];

    const forbiddenSpawnIDs = [57, 65, 69]; // Prevent infinite loops

    if (!player.cardsDrawn.length) {
      // No cards to shuffle — insert a safe random spectral
      const spectralCards = Cards.filter(
        c => c.id >= 53 && c.id <= 70 && !forbiddenSpawnIDs.includes(c.id)
      );

      const randomCard = spectralCards[Math.floor(Math.random() * spectralCards.length)];

      if (randomCard) {
        gameState.deck.unshift({
          ...randomCard,
          Source: `${player.name} - TRANCE (RANDOM)`
        });

        console.log(`[TRANCE] No cards to shuffle. Inserting safe spectral: ${randomCard.name}`);
      }

      return { action: "trance" };
    }

    player.effectState.isTranceActive = true;
    return { action: "trance" };
  },


  // 🆕 Déjà Vu
  57: ({ player, roomID, games, Cards }) => {
    const gameState = games[roomID];
    const cardsDrawn = player.cardsDrawn;

    const lastCard = cardsDrawn
      .slice(0, -1)
      .reverse()
      .find(card => card?.id !== 57 && card?.Source !== `${player.name} - DEJA VU`);

    let replayCard;

    if (lastCard) {
      replayCard = { ...lastCard, Source: `${player.name} - DEJA VU` };
      gameState.deck.unshift(replayCard);
      console.log(`[DEJA VU] Replaying card ${lastCard.name} for ${player.name}`);
    } else {
      const spectralCards = Cards.filter(
        c => c.id >= 53 && c.id <= 70 && !forbiddenSpawnIDs.includes(c.id)
      );

      const randomSpectral = spectralCards[Math.floor(Math.random() * spectralCards.length)];
      replayCard = { ...randomSpectral, Source: `${player.name} - DEJA VU (Random)` };
      gameState.deck.unshift(replayCard);
      console.log(`[DEJA VU] No card to replay, using spectral: ${randomSpectral.name}`);
    }

    player.effectState.hasActiveDejaVu = true; // <-- set flag
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

    const clone = { ...topCard, Source: `${player.name} - SIGIL` };
    gameState.deck.splice(1, 0, clone);

    player.effectState.sigilDrawsRemaining = 2;

    return { action: "sigilDrawTwice", sigilDrawsRemaining: 2 };
  },





  65: ({ player, roomID }) => {
    return { action: "ouijaChooseCard", playerName: player.name };
  }





};

module.exports = cardEffects;
