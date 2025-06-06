import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import "../css/MatchDataPage.css";

const initialStats = {
  shots: 0,
  shotsOnTarget: 0,
  goals: [],
  assists: [],
  goalsConceded: 0,
  possession: "",
  totalPasses: 0,
  passAccuracy: "",
  aerialDuelsWon: 0,
  foulsCommitted: 0,
  foulsSuffered: 0,
  yellowCards: [],
  redCards: [],
  offsides: 0,
  corners: 0,
  freeKicksFor: 0,
  freeKicksAgainst: 0,
  saves: 0,
  interceptions: 0,
  shotMap: [],
};

export default function MatchDataPage() {
  const [stats, setStats] = useState(initialStats);
  const [matchId, setMatchId] = useState("");
  const [errors, setErrors] = useState({});
  const [tempInputs, setTempInputs] = useState({
    goal: "",
    assist: "",
    yellow: "",
    red: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStats((prev) => ({ ...prev, [name]: value }));
  };

  const handleFieldClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const type = prompt("Tipo de evento (goal, shot, conceded):");
    if (!["goal", "shot", "conceded"].includes(type)) return;
    setStats((prev) => ({
      ...prev,
      shotMap: [...prev.shotMap, { x, y, type }],
    }));
  };

  const handleAddEvent = (type) => {
    const value = tempInputs[type.slice(0, -1)].trim(); // goal → goals, assist → assists
    if (!value) return;
    setStats((prev) => ({
      ...prev,
      [type]: [...prev[type], value],
    }));
    setTempInputs((prev) => ({ ...prev, [type.slice(0, -1)]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!matchId.trim()) {
      newErrors.matchId = "Ingresa un ID para el partido.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await setDoc(doc(db, "matches", matchId), stats);
      alert("Datos guardados con éxito");
      setStats(initialStats);
      setMatchId("");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar los datos");
    }
  };

  return (
    <div className="match-data-container">
      <h1 className="title">Registro de Datos del Partido</h1>

      <input
        type="text"
        placeholder="ID del partido"
        value={matchId}
        onChange={(e) => {
          setMatchId(e.target.value);
          setErrors((prev) => ({ ...prev, matchId: "" }));
        }}
        className={`input-full ${errors.matchId ? "input-error" : ""}`}
      />
      {errors.matchId && <p className="error-text">{errors.matchId}</p>}

      <form onSubmit={handleSubmit} className="form">
        <div className="grid">
          {[
            { name: "shots", label: "Disparos" },
            { name: "shotsOnTarget", label: "Disparos al arco" },
            { name: "goalsConceded", label: "Goles recibidos" },
            { name: "possession", label: "% Posesión", type: "text" },
            { name: "totalPasses", label: "Total de pases" },
            {
              name: "passAccuracy",
              label: "% Precisión en pases",
              type: "text",
            },
            { name: "aerialDuelsWon", label: "Duelos aéreos ganados" },
            { name: "foulsCommitted", label: "Faltas cometidas" },
            { name: "foulsSuffered", label: "Faltas recibidas" },
            { name: "freeKicksFor", label: "Tiros libres a favor" },
            { name: "freeKicksAgainst", label: "Tiros libres en contra" },
            { name: "corners", label: "Tiros de esquina" },
            { name: "offsides", label: "Fueras de juego" },
            { name: "saves", label: "Salvadas" },
            { name: "interceptions", label: "Intercepciones" },
          ].map(({ name, label, type = "number" }) => (
            <input
              key={name}
              type={type}
              name={name}
              value={stats[name]}
              onChange={handleChange}
              placeholder={label}
              className="input"
            />
          ))}
        </div>

        <div className="input-pairs">
          {[
            { key: "goal", label: "Jugador que hizo gol", target: "goals" },
            { key: "assist", label: "Jugador que asistió", target: "assists" },
            {
              key: "yellow",
              label: "Jugador con amarilla",
              target: "yellowCards",
            },
            { key: "red", label: "Jugador con roja", target: "redCards" },
          ].map(({ key, label, target }) => (
            <input
              key={key}
              type="text"
              placeholder={label}
              value={tempInputs[key]}
              onChange={(e) =>
                setTempInputs((prev) => ({ ...prev, [key]: e.target.value }))
              }
              onKeyDown={(e) => e.key === "Enter" && handleAddEvent(target)}
              className="input-full"
            />
          ))}
        </div>

        <h2 className="subtitle">
          Haz clic en el campo para agregar eventos (gol, disparo, recibido)
        </h2>
        <div className="field" onClick={handleFieldClick}>
          {stats.shotMap.map((point, index) => (
            <div
              key={index}
              className={`dot ${point.type}`}
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
              }}
              title={point.type}
            />
          ))}
        </div>

        <button type="submit" className="submit-button">
          Guardar datos
        </button>
      </form>
    </div>
  );
}
