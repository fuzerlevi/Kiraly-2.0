const cardEffects = {
  9: ({ player, roomID }) => ({ action: "chooseBrother", playerName: player.name }),
  22: ({ player, roomID }) => ({ action: "chooseBrother", playerName: player.name }),
  35: ({ player, roomID }) => ({ action: "chooseBrother", playerName: player.name }),
  48: ({ player, roomID }) => ({ action: "chooseBrother", playerName: player.name }),

  64: ({ player, roomID }) => ({ action: "mediumChooseCard", playerName: player.name }),

  69: ({ player, roomID, games, Cards }) => {
    const gameState = games[roomID];

    if (!player.cardsDrawn.length) {
      // No cards to shuffle — insert a random spectral on top
      const spectralIDs = Array.from({ length: 18 }, (_, i) => 53 + i); // IDs 53–70
      const randomID = spectralIDs[Math.floor(Math.random() * spectralIDs.length)];
      const spectralCard = Cards.find(c => c.id === randomID);

      if (spectralCard) {
        gameState.deck.unshift({
          ...spectralCard,
          Source: `${player.name} - TRANCE`
        });

        console.log(`[TRANCE] No cards to shuffle. Inserting random spectral: ${spectralCard.name}`);
      }

      return { action: "trance" };
    }

    // Else, proceed as usual
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
      const spectralCards = Cards.filter(c => c.id >= 53 && c.id <= 70 && c.id !== 69);
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




};

module.exports = cardEffects;
