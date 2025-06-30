import React, { useState, useEffect } from "react";
import { useGameContext } from "../components/GameContext";
import socket from "../socket";
import "../assets/DrinkEquation.css";

const DrinkEquation = () => {
  const { players, drinkEquation, setDrinkEquation } = useGameContext();

  const [baseSipsInput, setBaseSipsInput] = useState("1");
  const [computedSips, setComputedSips] = useState({});

  const mySocketID = socket.id;
  const myPlayer = players.find((p) => p.socketID === mySocketID);
  const isHost = myPlayer?.isHost;

  const baseSips = Number(baseSipsInput) || 1;

  const handleBaseSipsChange = (e) => {
    setBaseSipsInput(e.target.value);
  };

  const handleBaseSipsBlur = () => {
    if (baseSipsInput.trim() === "" || isNaN(Number(baseSipsInput))) {
      setBaseSipsInput("1");
    }
  };

  const adjustValue = (playerName, field, delta) => {
    const roomID = window.location.pathname.split("/").pop();
    socket.emit("updateDrinkValue", {
      roomID,
      playerName,
      field,
      delta,
    });
  };

  const calculateSips = () => {
    const newSips = {};
    players.forEach((player) => {
      const entry = drinkEquation[player.name] || { flats: 0, multipliers: 1 };
      const total = baseSips * entry.multipliers + entry.flats;
      newSips[player.name] = total;
    });
    setComputedSips(newSips);
  };

  return (
    <div className="drink-equation-container">
      <table className="drink-equation-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Multipliers</th>
            <th>Flats</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => {
            const entry = drinkEquation[player.name] || { flats: 0, multipliers: 1 };
            return (
              <tr key={player.name}>
                <td>{player.name}</td>

                <td>
                  <div className="equation-cell-wrapper">
                    {isHost && (
                      <button onClick={() => adjustValue(player.name, "multipliers", -0.5)}>-</button>
                    )}
                    <span className="equation-value">{entry.multipliers}</span>
                    {isHost && (
                      <button onClick={() => adjustValue(player.name, "multipliers", 0.5)}>+</button>
                    )}
                  </div>
                </td>


                <td>
                  <div className="equation-cell-wrapper">
                    {isHost && (
                      <button onClick={() => adjustValue(player.name, "flats", -1)}>-</button>
                    )}
                    <span className="equation-value">{entry.flats}</span>
                    {isHost && (
                      <button onClick={() => adjustValue(player.name, "flats", 1)}>+</button>
                    )}
                  </div>
                </td>


                <td>{computedSips[player.name] ?? "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "24px", marginLeft: "33px" }}>
        <label htmlFor="baseSips">Base sips:</label>
        <input
          id="baseSips"
          type="number"
          value={baseSipsInput}
          onChange={handleBaseSipsChange}
          onBlur={handleBaseSipsBlur}
          style={{ width: "80px" }}
        />
        <button onClick={calculateSips}>Calculate</button>
      </div>
    </div>
  );
};

export default DrinkEquation;
