import React, { useEffect, useState } from "react";
import { getPlayers } from "../services/firebase";
import "../css/MatchDayPage.css";

const positionZones = {
  DC: { top: 0.1, left: 31, width: 38, height: 20 },
  EXI: { top: 0.1, left: 0.1, width: 31, height: 30 },
  EXD: { top: 0.1, left: 69, width: 30, height: 30 },
  MC: { top: 35, left: 25, width: 49, height: 30 },
  MDI: { top: 30, left: 0.4, width: 30, height: 35 },
  MDD: { top: 30, left: 69, width: 30, height: 35 },
  MCO: { top: 20, left: 31, width: 38, height: 20 },
  MCD: { top: 60, left: 25, width: 49, height: 20 },
  DFI: { top: 75, left: 24, width: 26, height: 15 },
  DFD: { top: 75, left: 50, width: 26, height: 15 },
  CARI: { top: 60, left: 0.4, width: 25, height: 17 },
  CARD: { top: 60, left: 74, width: 25, height: 17 },
  LI: { top: 70, left: 0.4, width: 25, height: 17 },
  LD: { top: 70, left: 74, width: 25, height: 17 },
  POR: { top: 87, left: 39, width: 22, height: 12 },
};

function MatchDayPage() {
  const [players, setPlayers] = useState([]);
  const [onField, setOnField] = useState([]);
  const [positions, setPositions] = useState({});
  const [draggingPlayerPositions, setDraggingPlayerPositions] = useState([]);

  useEffect(() => {
    getPlayers().then(setPlayers);
  }, []);

  const handleDragStart = (e, player) => {
    e.dataTransfer.setData("playerId", player.id);
    setDraggingPlayerPositions(player.position || []);
  };

  const handleDrop = (e) => {
    const fieldRect = e.currentTarget.getBoundingClientRect();
    const playerId = e.dataTransfer.getData("playerId");

    const x = ((e.clientX - fieldRect.left) / fieldRect.width) * 100;
    const y = ((e.clientY - fieldRect.top) / fieldRect.height) * 100;

    const alreadyInField = onField.find((p) => p.id === playerId);
    if (alreadyInField) {
      setPositions((prev) => ({
        ...prev,
        [playerId]: { top: `${y}%`, left: `${x}%` },
      }));
    } else {
      const player = players.find((p) => p.id === playerId);
      if (!player || onField.length >= 11) return;

      setOnField([...onField, player]);
      setPlayers(players.filter((p) => p.id !== playerId));
      setPositions((prev) => ({
        ...prev,
        [playerId]: { top: `${y}%`, left: `${x}%` },
      }));
    }

    setDraggingPlayerPositions([]);
  };

  const removeFromField = (id) => {
    const player = onField.find((p) => p.id === id);
    if (!player) return;
    setPlayers((prev) => [...prev, player]);
    setOnField((prev) => prev.filter((p) => p.id !== id));
    setPositions((prev) => {
      const newPos = { ...prev };
      delete newPos[id];
      return newPos;
    });
  };

  return (
    <div className="matchday-wrapper">
      <div className="matchday-title">
        <h1>Día de Partido</h1>
      </div>

      <div className="matchday-container">
        <div
          className="field-container"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="field-lines">
            <div className="penalty-area penalty-top"></div>
            <div className="penalty-area penalty-bottom"></div>

            <div className="center-circle"></div>
            <div className="center-line"></div>
            <div className="goal-area goal-top"></div>
            <div className="goal-area goal-bottom"></div>
          </div>

          {/* Zonas resaltadas por posición mientras se arrastra */}
          {draggingPlayerPositions.map((posKey) => {
            const zone = positionZones[posKey];
            return (
              <div
                key={posKey}
                className="highlight-zone"
                style={{
                  top: `${zone.top}%`,
                  left: `${zone.left}%`,
                  width: `${zone.width}%`,
                  height: `${zone.height}%`,
                }}
              />
            );
          })}

          {onField.map((player) => (
            <div
              key={player.id}
              className="player-on-field"
              style={positions[player.id]}
              draggable
              onDragStart={(e) => handleDragStart(e, player)}
              onDoubleClick={() => removeFromField(player.id)}
            >
              <img src={player.photo} alt={player.name} />
              <span>{player.name}</span>
            </div>
          ))}
        </div>

        <div className="substitutes">
          <h2>Suplentes</h2>
          <div className="substitutes-list">
            {players.map((player) => (
              <div
                key={player.id}
                className="substitute-player"
                draggable
                onDragStart={(e) => handleDragStart(e, player)}
              >
                <img src={player.photo} alt={player.name} />
                <span>{player.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatchDayPage;
