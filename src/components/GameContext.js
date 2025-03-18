import React, { createContext, useState, useContext } from 'react';

const GameContext = createContext();

export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [deck, setDeck] = useState([]);
  const [whosTurnIsIt, setWhosTurnIsIt] = useState(0); // Default to first player

  return (
    <GameContext.Provider value={{ 
      players, setPlayers, 
      deck, setDeck, 
      whosTurnIsIt, setWhosTurnIsIt 
    }}>
      {children}
    </GameContext.Provider>
  );
};
