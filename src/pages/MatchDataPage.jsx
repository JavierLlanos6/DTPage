import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import "../css/MatchDataPage.css";

const initialStats = {
  shots: 0,
  shotsOnTarget: 0,
  goals: 0,
  assists: [],
  goalsConceded: 0,
  possession: "",
  totalPasses: 0,
  passAccuracy: "",
  passesOwnHalf: 0,
  passesOpponentHalf: 0,
  crosses: 0,
  goalKicks: 0,
  finalThirdPasses: 0,
  longPasses: 0,
  shotsOffPost: 0,
  shotsInsideBox: 0,
  shotsOutsideBox: 0,
  aerialDuelsWon: 0,
  groundDuelsWon: 0,
  totalDuelsWon: 0,
  dribblesAttempted: 0,
  dribblesCompleted: 0,
  foulsCommitted: 0,
  foulsSuffered: 0,
  yellowCards: 0,
  redCards: 0,
  offsides: 0,
  corners: 0,
  freeKicksFor: 0,
  freeKicksAgainst: 0,
  saves: 0,
  clearances: 0,
  interceptions: 0,
  shotMap: [],
};

export default function MatchDataPage() {
  const [matchDate, setMatchDate] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [teamStats, setTeamStats] = useState(initialStats);
  const [opponentStats, setOpponentStats] = useState(initialStats);
  const [errors, setErrors] = useState({});
  // const [tempInputs, setTempInputs] = useState({
  //   goal: "",
  //   assist: "",
  //   yellow: "",
  //   red: "",
  //   goalOpp: "",
  //   assistOpp: "",
  //   yellowOpp: "",
  //   redOpp: "",
  // });

  // Función para actualizar stats (local o rival)
  const handleChange = (e, isOpponent = false) => {
    const { name, value } = e.target;
    if (isOpponent) {
      setOpponentStats((prev) => ({ ...prev, [name]: value }));
    } else {
      setTeamStats((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Manejo de eventos en campo (solo para local)
  const handleFieldClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const type = prompt("Tipo de evento (goal, shot, conceded, shotconceded):");
    if (!["goal", "shot", "conceded", "shotconceded"].includes(type)) return;
    setTeamStats((prev) => ({
      ...prev,
      shotMap: [...prev.shotMap, { x, y, type }],
    }));
  };

  // Agregar eventos como goles, asistencias y tarjetas
  // const handleAddEvent = (type, isOpponent = false) => {
  //   const key = isOpponent ? type + "Opp" : type;
  //   const target = {
  //     goal: "goals",
  //     assist: "assists",
  //     yellow: "yellowCards",
  //     red: "redCards",
  //   }[type];
  //   const value = tempInputs[key].trim();
  //   if (!value) return;

  //   if (isOpponent) {
  //     setOpponentStats((prev) => ({
  //       ...prev,
  //       [target]: [...prev[target], value],
  //     }));
  //   } else {
  //     setTeamStats((prev) => ({
  //       ...prev,
  //       [target]: [...prev[target], value],
  //     }));
  //   }

  //   setTempInputs((prev) => ({ ...prev, [key]: "" }));
  // };

  const renderInput = ({ name, label, type = "number" }, stats, isOpponent) => (
    <div key={name} className="input-group">
      <label
        htmlFor={`${isOpponent ? "opp-" : ""}${name}`}
        className="input-label"
      >
        {label}
      </label>
      <input
        id={`${isOpponent ? "opp-" : ""}${name}`}
        type={type}
        name={name}
        value={stats[name]}
        onChange={(e) => handleChange(e, isOpponent)}
        className="input"
      />
    </div>
  );

  // Reutilizamos para secciones
  const renderFormSection = (title, fields, stats, isOpponent = false) => (
    <>
      <h2 className="subtitle">
        {title} {isOpponent ? "(Equipo contrario)" : "(Nuestro equipo)"}
      </h2>
      <div className="grid">
        {fields.map((field) => renderInput(field, stats, isOpponent))}
      </div>
    </>
  );

  // Campos para las secciones
  const shotsFields = [
    { name: "shots", label: "Disparos totales" },
    { name: "shotsOnTarget", label: "Disparos al arco" },
    { name: "shotsOffPost", label: "Tiros al poste" },
    { name: "shotsInsideBox", label: "Tiros dentro del área" },
    { name: "shotsOutsideBox", label: "Tiros fuera del área" },
    { name: "goals", label: "Goles anotados" },
  ];

  const passesFields = [
    { name: "totalPasses", label: "Pases realizados" },
    { name: "passAccuracy", label: "% Precisión en pases", type: "text" },
    { name: "passesOwnHalf", label: "Pases en campo propio" },
    { name: "passesOpponentHalf", label: "Pases en campo contrario" },
    { name: "finalThirdPasses", label: "Pases en último tercio" },
    { name: "longPasses", label: "Pases largos" },
    { name: "crosses", label: "Centros" },
    { name: "goalKicks", label: "Saques de puerta" },
  ];

  const defensiveFields = [
    { name: "clearances", label: "Despejes" },
    { name: "interceptions", label: "Intercepciones" },
    { name: "saves", label: "Salvadas del portero" },
  ];

  const duelFields = [
    { name: "totalDuelsWon", label: "Duelos ganados" },
    { name: "aerialDuelsWon", label: "Duelos aéreos ganados" },
    { name: "groundDuelsWon", label: "Duelos en el suelo ganados" },
    { name: "foulsSuffered", label: "Faltas recibidas" },
    { name: "dribblesAttempted", label: "Regates intentados" },
    { name: "dribblesCompleted", label: "Regates exitosos" },
  ];

  const disciplinaryFields = [
    { name: "foulsCommitted", label: "Faltas cometidas" },
    { name: "offsides", label: "Fueras de juego" },
    { name: "corners", label: "Tiros de esquina" },
    { name: "freeKicksFor", label: "Tiros libres a favor" },
    { name: "freeKicksAgainst", label: "Tiros libres en contra" },
    { name: "yellowCards", label: "Tarjetas amarillas en contra" },
    { name: "redCards", label: "Tarjetas rojas en contra" },
  ];

  // Validaciones básicas
  const validate = () => {
    const newErrors = {};
    if (!matchDate) newErrors.matchDate = "Ingresa la fecha del partido.";
    if (!opponentName.trim())
      newErrors.opponentName = "Ingresa el nombre del equipo rival.";
    return newErrors;
  };

  // Guardar datos
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await setDoc(doc(db, "matches", matchDate), {
        opponent: opponentName,
        teamStats,
        opponentStats,
      });
      alert("Datos guardados con éxito");
      setTeamStats(initialStats);
      setOpponentStats(initialStats);
      setMatchDate("");
      setOpponentName("");
      setErrors({});
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar los datos");
    }
  };

  // Inputs para eventos (goles, asistencias, tarjetas) con duplicado para equipo contrario
  // const eventInputs = [
  //   { key: "goal", label: "Jugador que hizo gol", target: "goals" },
  //   { key: "assist", label: "Jugador que asistió", target: "assists" },
  //   { key: "yellow", label: "Jugador con amarilla", target: "yellowCards" },
  //   { key: "red", label: "Jugador con roja", target: "redCards" },
  // ];

  const renderFootballField = () => (
    <div className="football-field" onClick={handleFieldClick}>
      {/* Líneas del campo */}
      <div className="field-line center-line" />
      <div className="field-line center-circle" />
      <div className="field-line penalty-box left-box" />
      <div className="field-line penalty-box right-box" />
      <div className="field-line small-box left-box" />
      <div className="field-line small-box right-box" />

      {/* Eventos en el campo */}
      {teamStats.shotMap.map((event, index) => (
        <div
          key={index}
          title={event.type}
          className="goal-dot"
          style={{
            left: `calc(${event.x}% - 3px)`,
            top: `calc(${event.y}% - 3px)`,
            backgroundColor:
              event.type === "goal"
                ? "blue"
                : event.type === "shot"
                ? "white"
                : event.type === "conceded"
                ? "red"
                : event.type === "shotConceded"
                ? "yellow"
                : "yellow",
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="match-data-container">
      <h1 className="title">Registro de Datos del Partido</h1>

      <label className="input-label" htmlFor="match-date">
        Fecha del partido:
      </label>
      <input
        id="match-date"
        type="date"
        value={matchDate}
        onChange={(e) => {
          setMatchDate(e.target.value);
          setErrors((prev) => ({ ...prev, matchDate: "" }));
        }}
        className={`input-full ${errors.matchDate ? "input-error" : ""}`}
      />
      {errors.matchDate && <p className="error-text">{errors.matchDate}</p>}

      <label className="input-label" htmlFor="opponent-name">
        Nombre del equipo rival:
      </label>
      <input
        id="opponent-name"
        type="text"
        placeholder="Ejemplo: Atlético"
        value={opponentName}
        onChange={(e) => {
          setOpponentName(e.target.value);
          setErrors((prev) => ({ ...prev, opponentName: "" }));
        }}
        className={`input-full ${errors.opponentName ? "input-error" : ""}`}
      />
      {errors.opponentName && (
        <p className="error-text">{errors.opponentName}</p>
      )}
      {renderFootballField()}
      <form onSubmit={handleSubmit}>
        {/* Formulario equipo local */}
        {renderFormSection("Disparos y Goles", shotsFields, teamStats, false)}
        {renderFormSection("Pases", passesFields, teamStats, false)}
        {renderFormSection("Defensivo", defensiveFields, teamStats, false)}
        {renderFormSection("Duelo", duelFields, teamStats, false)}
        {renderFormSection(
          "Disciplinaria",
          disciplinaryFields,
          teamStats,
          false
        )}

        {/* <h2 className="subtitle">(Eventos - Nuestro equipo)</h2>
        {eventInputs.map(({ key, label }) => (
          <div key={key} className="input-group event-input">
            <input
              type="text"
              placeholder={label}
              value={tempInputs[key]}
              onChange={(e) =>
                setTempInputs((prev) => ({ ...prev, [key]: e.target.value }))
              }
              className="input-full"
            />
            <button
              type="button"
              onClick={() => handleAddEvent(key, false)}
              className="btn-add"
            >
              Añadir
            </button>
          </div>
        ))} */}

        <hr />

        {/* Formulario equipo rival */}
        {renderFormSection(
          "Disparos y Goles",
          shotsFields,
          opponentStats,
          true
        )}
        {renderFormSection("Pases", passesFields, opponentStats, true)}
        {renderFormSection("Defensivo", defensiveFields, opponentStats, true)}
        {renderFormSection("Duelo", duelFields, opponentStats, true)}
        {renderFormSection(
          "Disciplinaria",
          disciplinaryFields,
          opponentStats,
          true
        )}

        {/* <h2 className="subtitle">(Eventos - Equipo contrario)</h2>
        {eventInputs.map(({ key, label }) => (
          <div key={key + "Opp"} className="input-group event-input">
            <input
              type="text"
              placeholder={label}
              value={tempInputs[key + "Opp"]}
              onChange={(e) =>
                setTempInputs((prev) => ({
                  ...prev,
                  [key + "Opp"]: e.target.value,
                }))
              }
              className="input-full"
            />
            <button
              type="button"
              onClick={() => handleAddEvent(key, true)}
              className="btn-add"
            >
              Añadir
            </button>
          </div>
        ))} */}

        <button type="submit" className="btn-submit">
          Guardar Datos del Partido
        </button>
      </form>
    </div>
  );
}
