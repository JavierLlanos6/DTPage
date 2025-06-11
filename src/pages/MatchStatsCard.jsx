import React from "react";

export default function MatchStatsCard({ match }) {
  const sections = [
    { title: "Disparos", key: "shots" },
    { title: "Pases", key: "passes" },
    { title: "Defensivo", key: "cleared" }, // especiales
    { title: "Duelo", key: "duels" },
    { title: "Disciplina", key: "discipline" },
  ];

  const {
    teamStats = {},
    opponentStats = {},
    opponent: rivalName = "Rival",
    id: matchDate = "",
  } = match;

  const statGroups = {
    shots: [
      "shots",
      "shotsOnTarget",
      "shotsInsideBox",
      "shotsOutsideBox",
      "shotsOffPost",
      "goalsConceded",
    ],
    passes: [
      "totalPasses",
      "passesOwnHalf",
      "passesOpponentHalf",
      "finalThirdPasses",
      "longPasses",
      "crosses",
      "goalKicks",
      "passAccuracy",
    ],
    cleared: ["clearances", "interceptions", "saves"],
    duels: [
      "totalDuelsWon",
      "aerialDuelsWon",
      "groundDuelsWon",
      "dribblesAttempted",
      "dribblesCompleted",
      "foulsCommitted",
      "foulsSuffered",
    ],
    discipline: [
      "corners",
      "freeKicksFor",
      "freeKicksAgainst",
      "offsides",
      "yellowCards",
      "redCards",
    ],
  };

  const capitalize = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).replace(/([A-Z])/g, " $1");

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-xl font-semibold mb-2">
        {matchDate} – vs {rivalName}
      </h2>

      {sections.map(({ title, key }) => {
        const groupKeys = statGroups[key] || [];
        return (
          <div key={key} className="mb-4">
            <h3 className="font-bold mb-1">{title}</h3>
            <div className="grid grid-cols-3 text-center">
              <div className="font-semibold">Mi Equipo</div>
              <div></div>
              <div className="font-semibold">{rivalName}</div>

              {groupKeys.map((statKey) => (
                <React.Fragment key={statKey}>
                  <div>{teamStats[statKey] ?? "-"}</div>
                  <div className="text-gray-500 text-sm">
                    {capitalize(statKey)}
                  </div>
                  <div>{opponentStats[statKey] ?? "-"}</div>
                </React.Fragment>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
