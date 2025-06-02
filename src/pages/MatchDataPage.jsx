import React, { useState } from "react";

function MatchDataPage() {
  const [stats, setStats] = useState({ posesion: "", pases: "", tiros: "" });

  const handleChange = (e) => {
    setStats({ ...stats, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Datos del Partido</h1>
      <input
        name="posesion"
        onChange={handleChange}
        placeholder="Posesión (%)"
        className="border p-1"
      />
      <input
        name="pases"
        onChange={handleChange}
        placeholder="Pases"
        className="border p-1"
      />
      <input
        name="tiros"
        onChange={handleChange}
        placeholder="Tiros"
        className="border p-1"
      />
    </div>
  );
}

export default MatchDataPage;
