import React, { useState } from "react";

function StrategyPage() {
  const [notes, setNotes] = useState("");
  const [link, setLink] = useState("");

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Estrategias</h1>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notas..."
        className="border w-full h-24 p-2"
      />
      <input
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Link a video/jugada"
        className="border w-full p-2 mt-2"
      />
    </div>
  );
}

export default StrategyPage;
