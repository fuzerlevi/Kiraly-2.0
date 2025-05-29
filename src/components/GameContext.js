import React, { createContext, useState, useContext } from 'react';

const GameContext = createContext();

export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [deck, setDeck] = useState([]);
  const [currentPlayerName, setCurrentPlayerName] = useState(null); // NEW

  return (
    <GameContext.Provider value={{ 
      players, setPlayers, 
      deck, setDeck, 
      currentPlayerName, setCurrentPlayerName // CHANGED
    }}>
      {children}
    </GameContext.Provider>
  );
};
