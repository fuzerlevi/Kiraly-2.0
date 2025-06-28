const cardEffects = {
  9: ({ setIsChoosingBrother }) => setIsChoosingBrother(true),
  22: ({ setIsChoosingBrother }) => setIsChoosingBrother(true),
  35: ({ setIsChoosingBrother }) => setIsChoosingBrother(true),
  48: ({ setIsChoosingBrother }) => setIsChoosingBrother(true),

  64: ({ player, setIsChoosingMediumCard }) => {
    if (player?.joker?.id === 118) return;
    console.log("[Medium] Card effect triggered");
    if (setIsChoosingMediumCard) {
      setIsChoosingMediumCard(true);
    }
    return { action: "mediumChooseCard" };
  },

  69: ({ player, setIsTranceActive }) => {
    if (player?.joker?.id === 118) return;
    console.log("[Trance] Card effect triggered by", player.name);
    if (setIsTranceActive) {
      setIsTranceActive(true);
    }
    return { action: "trance" };
  },

  57: ({ player, setHasActiveDejaVu }) => {
    if (player?.joker?.id === 118) return;
    console.log("[Déjà Vu] Card effect triggered by", player.name);
    if (setHasActiveDejaVu) {
      setHasActiveDejaVu(true);
    }
    return { action: "dejaVu", playerName: player.name };
  },

  // 🆕 Ouija (to enable hasActiveDejaVu for cloned draw)
  65: ({ player, setHasActiveDejaVu }) => {
    if (player?.joker?.id === 118) return;
    console.log("[Ouija] Card effect triggered by", player.name);
    if (setHasActiveDejaVu) {
      setHasActiveDejaVu(true);
    }
    return { action: "ouijaChooseCard", playerName: player.name };
  },
};

export default cardEffects;
