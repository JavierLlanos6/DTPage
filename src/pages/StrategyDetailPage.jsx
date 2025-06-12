// src/pages/StrategyDetailPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import "../css/StrategyDetailPage.css";

export default function StrategyDetailPage() {
  const { matchId } = useParams();
  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    const fetchMatch = async () => {
      const docSnap = await getDoc(doc(db, "matches", matchId));
      if (docSnap.exists()) {
        setMatchData(docSnap.data());
      }
    };
    fetchMatch();
  }, [matchId]);

  if (!matchData) return <div className="loading">Cargando...</div>;

  const renderRow = (label, teamValue, opponentValue) => (
    <div className="row">
      <div className="team-value">{teamValue}</div>
      <div className="label">{label}</div>
      <div className="opponent-value">{opponentValue}</div>
    </div>
  );

  const { teamStats, opponentStats, opponent, events, shotMap } = matchData;

  // 🎯 COMPONENTE SIMPLE PARA RENDERIZAR EL MAPA DE DISPAROS
  const renderShotMap = () => (
    <div className="shot-map">
      <h3 className="section-title">Mapa de Acciones</h3>
      <div className="field">
        {shotMap?.map((shot, index) => {
          const colorMap = {
            goal: "green",
            shot: "blue",
            conceded: "red",
            shotconceded: "orange",
          };

          // Normaliza los valores si vienen fuera del 0-100
          const left = `${Math.min(shot.x, 100)}%`;
          const top = `${Math.min(shot.y, 100)}%`;

          return (
            <div
              key={index}
              className="dot"
              style={{
                left,
                top,
                backgroundColor: colorMap[shot.type] || "gray",
              }}
              title={shot.type}
            ></div>
          );
        })}
      </div>
    </div>
  );

  // 🎟️ COMPONENTE PARA RENDERIZAR LOS EVENTOS DEL PARTIDO
  const renderEvents = () => (
    <section className="section">
      <h3 className="section-title">EVENTOS DEL PARTIDO</h3>
      <div className="event-table">
        <div className="event-header">
          <span>Jugador</span>
          <span>Evento</span>
          <span>Minuto</span>
        </div>
        {events?.map((event, index) => (
          <div key={index} className="event-row">
            <span>{event.playerName}</span>
            <span>{event.eventType}</span>
            <span>{event.minute}'</span>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="strategy-container">
      <h2 className="title">
        Boca Juniors <span className="goalteam">{teamStats.goals}</span> -{" "}
        <span className="goalopponent">{opponentStats.goals}</span> {opponent}
      </h2>

      {/* ✅ Mapa de acciones */}
      {renderShotMap()}

      {[
        {
          title: "DISPAROS",
          rows: [
            ["Goles", teamStats.goals, opponentStats.goals],
            ["Disparos", teamStats.shots, opponentStats.shots],
            [
              "Disparos al arco",
              teamStats.shotsOnTarget,
              opponentStats.shotsOnTarget,
            ],
            [
              "Disparos fuera del área",
              teamStats.shotsOutsideBox,
              opponentStats.shotsOutsideBox,
            ],
            [
              "Disparos dentro del área",
              teamStats.shotsInsideBox,
              opponentStats.shotsInsideBox,
            ],
            [
              "Tiros al poste",
              teamStats.shotsOffPost,
              opponentStats.shotsOffPost,
            ],
          ],
        },
        {
          title: "PASES",
          rows: [
            [
              "Total de pases",
              teamStats.totalPasses,
              opponentStats.totalPasses,
            ],
            [
              "Precisión de pase",
              teamStats.passAccuracy,
              opponentStats.passAccuracy,
            ],
            [
              "Pases campo propio",
              teamStats.passesOwnHalf,
              opponentStats.passesOwnHalf,
            ],
            [
              "Pases campo rival",
              teamStats.passesOpponentHalf,
              opponentStats.passesOpponentHalf,
            ],
            [
              "Pases en el último tercio",
              teamStats.finalThirdPasses,
              opponentStats.finalThirdPasses,
            ],
            ["Centros", teamStats.crosses, opponentStats.crosses],
            ["Pases largos", teamStats.longPasses, opponentStats.longPasses],
          ],
        },
        {
          title: "DEFENSIVO",
          rows: [
            [
              "Intercepciones",
              teamStats.interceptions,
              opponentStats.interceptions,
            ],
            ["Despejes", teamStats.clearances, opponentStats.clearances],
            ["Atajadas", teamStats.saves, opponentStats.saves],
            ["Fuera de juego", teamStats.offsides, opponentStats.offsides],
            [
              "Tiros libres a favor",
              teamStats.freeKicksFor,
              opponentStats.freeKicksFor,
            ],
            [
              "Tiros libres en contra",
              teamStats.freeKicksAgainst,
              opponentStats.freeKicksAgainst,
            ],
          ],
        },
        {
          title: "DUELOS",
          rows: [
            [
              "Duelos ganados (totales)",
              teamStats.totalDuelsWon,
              opponentStats.totalDuelsWon,
            ],
            [
              "Duelos aéreos ganados",
              teamStats.aerialDuelsWon,
              opponentStats.aerialDuelsWon,
            ],
            [
              "Duelos en el suelo ganados",
              teamStats.groundDuelsWon,
              opponentStats.groundDuelsWon,
            ],
            [
              "Faltas cometidas",
              teamStats.foulsCommitted,
              opponentStats.foulsCommitted,
            ],
            [
              "Faltas recibidas",
              teamStats.foulsSuffered,
              opponentStats.foulsSuffered,
            ],
          ],
        },
        {
          title: "DISCIPLINA",
          rows: [
            ["Amarillas", teamStats.yellowCards, opponentStats.yellowCards],
            ["Rojas", teamStats.redCards, opponentStats.redCards],
          ],
        },
      ].map(({ title, rows }) => (
        <section key={title} className="section">
          <h3 className="section-title">{title}</h3>
          {rows.map(([label, teamValue, opponentValue]) =>
            renderRow(label, teamValue, opponentValue)
          )}
        </section>
      ))}

      {/* ✅ Eventos del partido */}
      {renderEvents()}
    </div>
  );
}
