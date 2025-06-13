import React, { useEffect, useState } from "react";
import { getPlayers } from "../services/firebase";
import { Dialog } from "@headlessui/react";
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

const eventIcons = {
  gol: "⚽",
  asistencia: "🎯",
  amarilla: "🟨",
  roja: "🟥",
};

function MatchDayPage() {
  const [players, setPlayers] = useState([]);
  const [onField, setOnField] = useState([]);
  const [positions, setPositions] = useState({});
  const [draggingPlayerPositions, setDraggingPlayerPositions] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerEvents, setPlayerEvents] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setPlayerEvents((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const isPositionValid = (x, y, positionsAllowed) => {
    return positionsAllowed.some((posKey) => {
      const zone = positionZones[posKey];
      return (
        x >= zone.left &&
        x <= zone.left + zone.width &&
        y >= zone.top &&
        y <= zone.top + zone.height
      );
    });
  };

  const openEventModal = (player) => {
    setSelectedPlayer(player);
    setIsModalOpen(true);
  };

  const modifyEvent = (type, change) => {
    if (!selectedPlayer) return;
    const id = selectedPlayer.id;

    setPlayerEvents((prev) => {
      const current = { ...(prev[id] || {}) };
      const currentValue = current[type] || 0;

      // 👉 Evitar aumentar si ya alcanzó el máximo
      if (change > 0) {
        if (type === "amarilla" && currentValue >= 2) return prev;
        if (type === "roja" && currentValue >= 1) return prev;
      }

      const newValue = currentValue + change;

      // 👉 Auto-asignar roja si hay 2 amarillas (solo si se está sumando una amarilla)
      if (type === "amarilla" && newValue === 2 && !(current["roja"] > 0)) {
        current["roja"] = 1;
      }

      // 👉 Eliminar eventos si bajan a 0
      if (newValue <= 0) delete current[type];
      else current[type] = newValue;

      // 👉 Si se bajó de 2 amarillas, eliminar la roja automática
      if (type === "amarilla" && newValue < 2) delete current["roja"];
      // 👉 Si se bajó la roja a 0, eliminarla
      if (type === "roja" && newValue <= 0) delete current["roja"];

      return { ...prev, [id]: current };
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

          {onField.map((player) => {
            const pos = positions[player.id];
            const top = parseFloat(pos?.top) || 0;
            const left = parseFloat(pos?.left) || 0;
            const valid = isPositionValid(left, top, player.position || []);
            const events = playerEvents[player.id] || {};

            return (
              <div
                key={player.id}
                className={`player-on-field ${valid ? "valid" : "invalid"}`}
                style={positions[player.id]}
                draggable
                onDragStart={(e) => handleDragStart(e, player)}
                // onDoubleClick={() => removeFromField(player.id)}
                onClick={() => openEventModal(player)}
              >
                <img src={player.photo} alt={player.name} />
                <span>{player.name}</span>
                <div className="event-icons">
                  {Object.entries(events).map(([type, count]) => (
                    <div key={type} className="event-icon">
                      {eventIcons[type]}
                      {count > 1 && (
                        <span className="event-count">{count}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
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

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="modal"
      >
        <div className="modal-backdrop" />
        <div className="modal-panel">
          <button className="close-btn" onClick={() => setIsModalOpen(false)}>
            ✖
          </button>

          <h2>Eventos: {selectedPlayer?.name}</h2>
          <div className="event-buttons">
            {Object.keys(eventIcons).map((type) => (
              <div key={type} className="event-control">
                <span className="event-label">
                  {eventIcons[type]} {type}
                </span>
                <div className="event-actions">
                  <button onClick={() => modifyEvent(type, -1)}>-</button>
                  <button onClick={() => modifyEvent(type, 1)}>+</button>
                </div>
              </div>
            ))}
          </div>
          <button
            className="sub-button"
            onClick={() => {
              removeFromField(selectedPlayer.id);
              setIsModalOpen(false);
            }}
          >
            Enviar al banquillo
          </button>
        </div>
      </Dialog>
    </div>
  );
}

export default MatchDayPage;
