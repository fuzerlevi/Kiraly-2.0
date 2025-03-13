import React, { createContext, useState, useContext } from 'react';

const GameContext = createContext();

export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);

  return (
    <GameContext.Provider value={{ players, setPlayers }}>
      {children}
    </GameContext.Provider>
  );
};
