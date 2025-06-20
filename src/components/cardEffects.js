const cardEffects = {
  9: ({ setIsChoosingBrother }) => setIsChoosingBrother(true),
  22: ({ setIsChoosingBrother }) => setIsChoosingBrother(true),
  35: ({ setIsChoosingBrother }) => setIsChoosingBrother(true),
  48: ({ setIsChoosingBrother }) => setIsChoosingBrother(true),

  64: ({ player, setIsChoosingMediumCard }) => {
    console.log("[Medium] Card effect triggered");
    if (setIsChoosingMediumCard) {
      setIsChoosingMediumCard(true);
    }
    return { action: "mediumChooseCard" };
  },

  69: ({ player, setIsTranceActive }) => {
    console.log("[Trance] Card effect triggered by", player.name);
    if (setIsTranceActive) {
      setIsTranceActive(true);
    }
    return { action: "trance" };
  },

  // 🆕 Déjà Vu
  57: ({ player, setHasActiveDejaVu }) => {
    console.log("[Déjà Vu] Card effect triggered by", player.name);
    if (setHasActiveDejaVu) {
      setHasActiveDejaVu(true);
    }
    return { action: "dejaVu", playerName: player.name };
  }
};

export default cardEffects;
