const cardEffects = {
  9: ({ player, roomID }) => ({ action: "chooseBrother", playerName: player.name }),
  22: ({ player, roomID }) => ({ action: "chooseBrother", playerName: player.name }),
  35: ({ player, roomID }) => ({ action: "chooseBrother", playerName: player.name }),
  48: ({ player, roomID }) => ({ action: "chooseBrother", playerName: player.name }),
  // ✅ Medium card triggers a chooseCard popup
  64: ({ player, roomID }) => ({ action: "mediumChooseCard", playerName: player.name }),

  // ✅ Trance card triggers a shuffle button
  69: ({ player, roomID }) => ({ action: "trance", playerName: player.name }),
};

module.exports = cardEffects;
