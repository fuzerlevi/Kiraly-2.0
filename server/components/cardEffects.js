const cardEffects = {
  9: ({ player, roomID }) => ({ action: "chooseBrother", playerName: player.name }),
  22: ({ player, roomID }) => ({ action: "chooseBrother", playerName: player.name }),
  35: ({ player, roomID }) => ({ action: "chooseBrother", playerName: player.name }),
  48: ({ player, roomID }) => ({ action: "chooseBrother", playerName: player.name }),
};

module.exports = cardEffects;
