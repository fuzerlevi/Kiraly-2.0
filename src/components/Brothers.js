import React, { useState, useEffect } from "react";
import { useGameContext } from "../components/GameContext";
import socket from "../socket";
import "../assets/Brothers.css";

const radius = 200;

const Brothers = () => {
  const { players, setPlayers } = useGameContext();
  const [fromPlayer, setFromPlayer] = useState("");
  const [toPlayer, setToPlayer] = useState("");
  const [mySocketID, setMySocketID] = useState(null);

  useEffect(() => {
    setMySocketID(socket.id);

    const handleUpdateBrothers = (updatedPlayers) => {
      setPlayers(updatedPlayers);
    };

    socket.on("updateBrothers", handleUpdateBrothers);

    return () => {
      socket.off("updateBrothers", handleUpdateBrothers);
    };
  }, [setPlayers]);


  const myPlayer = players.find((p) => p.socketID === mySocketID);

  const centerX = 300;
  const centerY = 300;

  const playerPositions = players.map((_, index) => {
    const angle = (2 * Math.PI * index) / players.length - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y };
  });

  const handleAddBrother = () => {
  if (fromPlayer && toPlayer && fromPlayer !== toPlayer) {
    socket.emit("addBrother", { fromPlayer, toPlayer });
    setFromPlayer("");
    setToPlayer("");
  }
  };

  const handleRemoveBrother = () => {
  if (fromPlayer && toPlayer && fromPlayer !== toPlayer) {
    socket.emit("removeBrother", { fromPlayer, toPlayer });
    setFromPlayer("");
    setToPlayer("");
  }
  };


  return (
    <div className="brothers-container">
      <div className="brothers-layout">
        <svg
          className="brothers-svg"
          width="600"
          height="600"
          viewBox="0 0 600 600"
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="10"
              refY="3.5"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#000" />
            </marker>
          </defs>

          {players.map((p, i) => {
            const from = playerPositions[i];
            return p.brothers.map((brotherName) => {
              const toIndex = players.findIndex((x) => x.name === brotherName);
              if (toIndex === -1) return null;
              const to = playerPositions[toIndex];
              return (
                <line
                  key={`${i}-${toIndex}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="black"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              );
            });
          })}

          {players.map((player, index) => {
            const { x, y } = playerPositions[index];
            return (
              <text
                key={player.name}
                x={x}
                y={y}
                className="brothers-player-name"
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {player.name}
              </text>
            );
          })}
        </svg>
      </div>

      {myPlayer?.isHost && (
        <div className="brothers-controls-container">
          <div className="brothers-adder">
            <select value={fromPlayer} onChange={(e) => setFromPlayer(e.target.value)}>
              <option value="">From</option>
              {players.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
            <select value={toPlayer} onChange={(e) => setToPlayer(e.target.value)}>
              <option value="">To</option>
              {players.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
            <button onClick={handleAddBrother}>Add Brother</button>
          </div>

          <div className="brothers-remover">
            <select value={fromPlayer} onChange={(e) => setFromPlayer(e.target.value)}>
              <option value="">From</option>
              {players.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
            <select value={toPlayer} onChange={(e) => setToPlayer(e.target.value)}>
              <option value="">To</option>
              {players.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
            <button onClick={handleRemoveBrother}>Remove Brother</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brothers;
