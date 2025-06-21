import React, { createContext, useState, useContext } from 'react';

const GameContext = createContext();
export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [deck, setDeck] = useState([]);
  const [currentPlayerName, setCurrentPlayerName] = useState(null);
  const [brothersGraph, setBrothersGraph] = useState({});
  const [drinkEquation, setDrinkEquation] = useState({});

  // Card effect states (global)
  const [isChoosingBrother, setIsChoosingBrother] = useState(false);
  const [isChoosingMediumCard, setIsChoosingMediumCard] = useState(false);
  const [isTranceActive, setIsTranceActive] = useState(false);
  const [hasActiveDejaVu, setHasActiveDejaVu] = useState(false); // 🆕

  const [cardDrawn, setCardDrawn] = useState(null);
  const [readyToEndTurn, setReadyToEndTurn] = useState(false);
  const [isTurnEnded, setIsTurnEnded] = useState(false);

  const [isChoosingOuijaCard, setIsChoosingOuijaCard] = useState(false);

  const [sigilDrawsRemaining, setSigilDrawsRemaining] = useState(0);
  const [talismanDrawsRemaining, setTalismanDrawsRemaining] = useState(0);

  const [activePlanets, setActivePlanets] = useState([]);





  return (
    <GameContext.Provider value={{
      players, setPlayers,
      deck, setDeck,
      currentPlayerName, setCurrentPlayerName,
      brothersGraph, setBrothersGraph,
      drinkEquation, setDrinkEquation,

      isChoosingBrother, setIsChoosingBrother,
      isChoosingMediumCard, setIsChoosingMediumCard,
      isTranceActive, setIsTranceActive,
      hasActiveDejaVu, setHasActiveDejaVu, // 🆕

      cardDrawn, setCardDrawn,
      readyToEndTurn, setReadyToEndTurn,
      isTurnEnded, setIsTurnEnded,

      isChoosingOuijaCard, setIsChoosingOuijaCard,
      sigilDrawsRemaining, setSigilDrawsRemaining,
      talismanDrawsRemaining, setTalismanDrawsRemaining,

      activePlanets, setActivePlanets,
    }}>
      {children}
    </GameContext.Provider>
  );
};
