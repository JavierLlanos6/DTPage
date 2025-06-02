import React, { useEffect, useState } from "react";
import { getPlayers } from "../services/firebase";
import "../css/PlayerListPage.css";

function PlayerListPage() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    async function fetchPlayers() {
      const data = await getPlayers();
      setPlayers(data);
    }
    fetchPlayers();
  }, []);

  const renderPlayersByType = (type, label) => {
    const filtered = players.filter((p) => p.playerType === type);

    return (
      <div className="player-group">
        <h2 className="group-title">{label}</h2>
        <div className="card-container">
          {filtered.length === 0 ? (
            <p>No hay jugadores registrados.</p>
          ) : (
            filtered.map((p) => (
              <div className="player-card" key={p.id}>
                <div className="card-image">
                  <img src={p.photo} alt={p.name} />
                  <div className="card-overlay">
                    <p>Altura: {p.height} cm</p>
                    <p>Peso: {p.weight} kg</p>
                    <p>Pierna hábil: {p.foot}</p>
                    <p>Posiciones: {p.position?.join(", ")}</p>
                  </div>
                </div>
                <div className="card-footer">
                  <h3>{p.name}</h3>
                  <span>{p.playerType}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="player-list-page">
      {/* <h1>Jugadores por tipo</h1> */}
      {renderPlayersByType("portero", "Porteros")}
      {renderPlayersByType("defensa", "Defensas")}
      {renderPlayersByType("mediocampista", "Mediocampistas")}
      {renderPlayersByType("delantero", "Delanteros")}
    </div>
  );
}

export default PlayerListPage;
