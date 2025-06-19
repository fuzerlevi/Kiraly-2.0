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

  const [cardDrawn, setCardDrawn] = useState(null);
  const [readyToEndTurn, setReadyToEndTurn] = useState(false);
  const [isTurnEnded, setIsTurnEnded] = useState(false);


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

      cardDrawn, setCardDrawn,
      readyToEndTurn, setReadyToEndTurn,
      isTurnEnded, setIsTurnEnded

    }}>
      {children}
    </GameContext.Provider>
  );
};
