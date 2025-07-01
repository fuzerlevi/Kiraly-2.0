import React, { useState } from "react";
import { useGameContext } from "../components/GameContext";
import socket from "../socket";
import "../assets/Brothers.css";

const radius = 200;

const Brothers = () => {
  const { players, brothersGraph, loversGraph } = useGameContext();
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

  const shortenLine = (x1, y1, x2, y2, offset) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / length;
    const uy = dy / length;
    return {
      x1: x1 + ux * offset,
      y1: y1 + uy * offset,
      x2: x2 - ux * offset,
      y2: y2 - uy * offset,
    };
  };

  const handleAddBrother = () => {
    if (fromPlayer && toPlayer && fromPlayer !== toPlayer) {
      const roomID = window.location.pathname.split("/").pop();
      socket.emit("addBrotherConnection", {
        roomID,
        sourceName: fromPlayer,
        targetName: toPlayer,
      });
      setFromPlayer("");
      setToPlayer("");
    }
  };

  const handleRemoveBrother = () => {
    if (fromPlayer && toPlayer && fromPlayer !== toPlayer) {
      const roomID = window.location.pathname.split("/").pop();
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
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto" markerUnits="strokeWidth">
              <polygon points="0 0, 10 3.5, 0 7" fill="#000" />
            </marker>
            <marker id="yellow-arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto" markerUnits="strokeWidth">
              <polygon points="0 0, 10 3.5, 0 7" fill="#f1c232" />
            </marker>
          </defs>

          {/* Rects and player names below */}
          {players.map((player, index) => {
            const { x, y } = playerPositions[index];
            return (
              <g key={player.name}>
                <rect
                  x={x - 60}
                  y={y - 50}
                  width={120}
                  height={25}
                  rx={5}
                  ry={5}
                  fill={player.team === "boy" ? "#0000ff" : "#ff00ff"}
                />
                <text
                  x={x}
                  y={y - 35}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fill="white"
                  fontSize="12px"
                  className="brothers-player-name"
                >
                  {player.name}
                </text>
              </g>
            );
          })}

          {/* Arrows drawn above */}
          {players.map((player, i) => {
            const from = playerPositions[i];
            const brothers = brothersGraph?.[player.name] || [];
            return brothers.map((brotherName) => {
              const toIndex = players.findIndex((x) => x.name === brotherName);
              if (toIndex === -1) return null;
              const to = playerPositions[toIndex];
              const { x1, y1, x2, y2 } = shortenLine(from.x, from.y - 35, to.x, to.y - 35, 65);
              return (
                <line
                  key={`${i}-${toIndex}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
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

              const { x1, y1, x2, y2 } = shortenLine(from.x, from.y - 35, to.x, to.y - 35, 65);
              const loverArrow = (
                <line
                  key={`lover-${i}-${toIndex}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#f1c232"
                  strokeWidth="3"
                  markerEnd="url(#yellow-arrowhead)"
                />
              );

              const back = shortenLine(to.x, to.y - 35, from.x, from.y - 35, 45);
              const brotherBackArrow = hasBrotherBack ? (
                <line
                  key={`brotherBack-${toIndex}-${i}`}
                  x1={back.x1}
                  y1={back.y1}
                  x2={back.x2}
                  y2={back.y2}
                  stroke="black"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              ) : null;

              return [loverArrow, brotherBackArrow];
            });
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
