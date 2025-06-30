import React, { useState, useEffect } from "react";
import { useGameContext } from "../components/GameContext";
import socket from "../socket";
import "../assets/Brothers.css";

const radius = 200;

const Brothers = () => {
  const { players, setPlayers, brothersGraph, setBrothersGraph, loversGraph, setLoversGraph } = useGameContext();
  const [fromPlayer, setFromPlayer] = useState("");
  const [toPlayer, setToPlayer] = useState("");

  const mySocketID = socket.id;
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
      const roomID = window.location.pathname.split("/").pop(); // or however you're storing it
      socket.emit("addBrotherConnection", {
        roomID,
        sourceName: fromPlayer,
        targetName: toPlayer
      });
      setFromPlayer("");
      setToPlayer("");
    }
  };


  const handleRemoveBrother = () => {
    if (fromPlayer && toPlayer && fromPlayer !== toPlayer) {
      const roomID = window.location.pathname.split("/").pop(); // or however you're storing it
      socket.emit("removeBrotherConnection", {
        roomID,
        sourceName: fromPlayer,
        targetName: toPlayer,
      });
      setFromPlayer("");
      setToPlayer("");
    }
  };


  return (
    <div className="brothers-container">
      <div className="brothers-layout">
        <svg className="brothers-svg" width="600" height="600" viewBox="0 0 600 600">
          <defs>
            {/* Existing black arrowhead */}
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto" markerUnits="strokeWidth">
              <polygon points="0 0, 10 3.5, 0 7" fill="#000" />
            </marker>

            {/* Yellow arrowhead for Lovers */}
            <marker id="yellow-arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto" markerUnits="strokeWidth">
              <polygon points="0 0, 10 3.5, 0 7" fill="#f1c232" />
            </marker>
          </defs>

          {players.map((player, i) => {
            const from = playerPositions[i];
            const brothers = brothersGraph?.[player.name] || [];
            return brothers.map((brotherName) => {
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

          {players.map((player, i) => {
            const from = playerPositions[i];
            const lovers = loversGraph?.[player.name] || [];

            return lovers.flatMap((loverName) => {
              const toIndex = players.findIndex((x) => x.name === loverName);
              if (toIndex === -1) return [];

              const to = playerPositions[toIndex];
              const hasBrotherBack = brothersGraph?.[loverName]?.includes(player.name);

              const loverArrow = (
                <line
                  key={`lover-${i}-${toIndex}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="#f1c232"
                  strokeWidth="3"
                  markerEnd="url(#yellow-arrowhead)"
                />
              );

              const brotherBackArrow = hasBrotherBack ? (
                <line
                  key={`brotherBack-${toIndex}-${i}`}
                  x1={to.x}
                  y1={to.y}
                  x2={from.x}
                  y2={from.y}
                  stroke="black"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              ) : null;

              return [loverArrow, brotherBackArrow];
            });
          })}



          {players.map((player, index) => {
            const { x, y } = playerPositions[index];
            return (
              <text
                key={player.name}
                x={x}
                y={y - 35}
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
