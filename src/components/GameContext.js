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
  const [isChoosingLover, setIsChoosingLover] = useState(false);
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
  const [glowingPlanetName, setGlowingPlanetName] = useState(null);
  const [planetGlowKeys, setPlanetGlowKeys] = useState({});
  const [isEndOfRound, setIsEndOfRound] = useState(false);
  const [planetXActive, setPlanetXActive] = useState(false);

  const [incantationDrawsRemaining, setIncantationDrawsRemaining] = useState(0);

  const [isEarthDrawPending, setIsEarthDrawPending] = useState(0);
  const [earthClonePending, setEarthClonePending] = useState(false);

  const [activeTarots, setActiveTarots] = useState([]);
  const [tarotPopupOpen, setTarotPopupOpen] = useState(false);

  const [selectedTarot, setSelectedTarot] = useState(null); // clicked for tooltip
  const [seeAllTarotsOpen, setSeeAllTarotsOpen] = useState(false);
  const [tarotGlowKeys, setTarotGlowKeys] = useState({});

  const [loversGraph, setLoversGraph] = useState({});

  const [isJokerRound, setIsJokerRound] = useState(true);
  const [roundNumber, setRoundNumber] = useState(0);

  const [playerOrder, setPlayerOrder] = useState([]);

  const [jokerGlowKeys, setJokerGlowKeys] = useState({});

  












  return (
    <GameContext.Provider value={{
      players, setPlayers,
      deck, setDeck,
      currentPlayerName, setCurrentPlayerName,
      brothersGraph, setBrothersGraph,
      drinkEquation, setDrinkEquation,

      isChoosingBrother, setIsChoosingBrother,
      isChoosingLover, setIsChoosingLover,
      isChoosingMediumCard, setIsChoosingMediumCard,
      isTranceActive, setIsTranceActive,
      hasActiveDejaVu, setHasActiveDejaVu,

      cardDrawn, setCardDrawn,
      readyToEndTurn, setReadyToEndTurn,
      isTurnEnded, setIsTurnEnded,

      isChoosingOuijaCard, setIsChoosingOuijaCard,
      sigilDrawsRemaining, setSigilDrawsRemaining,
      talismanDrawsRemaining, setTalismanDrawsRemaining,

      activePlanets, setActivePlanets,
      glowingPlanetName, setGlowingPlanetName,
      planetGlowKeys, setPlanetGlowKeys,

      isEndOfRound, setIsEndOfRound,
      planetXActive, setPlanetXActive,

      incantationDrawsRemaining, setIncantationDrawsRemaining,

      isEarthDrawPending, setIsEarthDrawPending,
      earthClonePending, setEarthClonePending,

      activeTarots, setActiveTarots,
      tarotPopupOpen, setTarotPopupOpen,

      selectedTarot, setSelectedTarot,
      seeAllTarotsOpen, setSeeAllTarotsOpen,
      tarotGlowKeys, setTarotGlowKeys,

      loversGraph, setLoversGraph,

      isJokerRound, setIsJokerRound,
      roundNumber, setRoundNumber,

      playerOrder, setPlayerOrder,

      jokerGlowKeys, setJokerGlowKeys,


    }}>
      {children}
    </GameContext.Provider>
  );
};
