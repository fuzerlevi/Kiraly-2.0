import React, { useState, useEffect } from "react";
import { useGameContext } from "../components/GameContext";
import socket from "../socket";
import "../assets/DrinkEquation.css";

const DrinkEquation = () => {
  const { players, drinkEquation, setDrinkEquation } = useGameContext();
  const [baseSips, setBaseSips] = useState(1);
  const [computedSips, setComputedSips] = useState({});

  const mySocketID = socket.id;
  const myPlayer = players.find((p) => p.socketID === mySocketID);
  const isHost = myPlayer?.isHost;

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
                    {isHost && (
                        <button onClick={() => adjustValue(player.name, "multipliers", -0.5)}>-</button>
                    )}
                    <span style={{ display: "inline-block", width: "70px", textAlign: "center" }}>
                        {entry.multipliers}
                    </span>
                    {isHost && (
                        <button onClick={() => adjustValue(player.name, "multipliers", 0.5)}>+</button>
                )}
                </td>


                <td>
                    {isHost && (
                        <button onClick={() => adjustValue(player.name, "flats", -1)}>-</button>
                    )}
                    <span style={{ display: "inline-block", width: "70px", textAlign: "center" }}>
                        {entry.flats}
                    </span>
                    {isHost && (
                        <button onClick={() => adjustValue(player.name, "flats", 1)}>+</button>
                    )}
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
            value={baseSips}
            onChange={(e) => setBaseSips(Number(e.target.value))}
            style={{ width: "80px" }}
        />
        <button onClick={calculateSips}>Calculate</button>
        </div>
    </div>
  );
};

export default DrinkEquation;
