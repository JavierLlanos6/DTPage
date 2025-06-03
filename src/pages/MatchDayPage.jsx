import React, { useEffect, useState } from "react";
import { getPlayers } from "../services/firebase";
import "../css/MatchDayPage.css";

function MatchDayPage() {
  const [players, setPlayers] = useState([]);
  const [onField, setOnField] = useState([]);
  const [positions, setPositions] = useState({});

  useEffect(() => {
    getPlayers().then(setPlayers);
  }, []);

  const handleDragStart = (e, player) => {
    e.dataTransfer.setData("playerId", player.id);
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
