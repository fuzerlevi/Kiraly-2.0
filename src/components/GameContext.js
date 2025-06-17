import React, { createContext, useState, useContext } from 'react';

const GameContext = createContext();

export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [deck, setDeck] = useState([]);
  const [currentPlayerName, setCurrentPlayerName] = useState(null);
  const [brothersGraph, setBrothersGraph] = useState({});
  const [drinkEquation, setDrinkEquation] = useState({});


  return (
    <GameContext.Provider value={{ 
      players, setPlayers, 
      deck, setDeck, 
      currentPlayerName, setCurrentPlayerName,
      brothersGraph, setBrothersGraph,
      drinkEquation, setDrinkEquation,
    }}>
      {children}
    </GameContext.Provider>
  );
};
