import React, { useEffect, useState } from "react";
import { getPlayers } from "../services/firebase";

function PlayerListPage() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    async function fetchPlayers() {
      const data = await getPlayers();
      setPlayers(data);
    }
    fetchPlayers();
  }, []);

  // Función para filtrar por tipo
  const renderPlayersByType = (type, label) => {
    const filtered = players.filter((p) => p.playerType === type);

    return (
      <div style={{ marginBottom: "2rem" }}>
        <h2>{label}</h2>
        {filtered.length === 0 ? (
          <p>No hay jugadores registrados.</p>
        ) : (
          filtered.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "5px 0",
              }}
            >
              <p>
                <strong>{p.name}</strong>
              </p>
              <p>
                Altura: {p.height} cm | Peso: {p.weight} kg
              </p>
              <p>Pierna hábil: {p.foot}</p>
              <p>Posiciones: {p.position?.join(", ")}</p>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div>
      <h1>Jugadores por tipo</h1>
      {renderPlayersByType("portero", "Porteros")}
      {renderPlayersByType("defensa", "Defensas")}
      {renderPlayersByType("mediocampista", "Mediocampistas")}
      {renderPlayersByType("delantero", "Delanteros")}
    </div>
  );
}

export default PlayerListPage;
