import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";
import MatchStatsCard from "./MatchStatsCard";

export default function StrategyPage() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      const snapshot = await getDocs(collection(db, "matches"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMatches(data);
    };
    fetchMatches();
  }, []);

  return (
    <div className="strategy-page p-6">
      <h1 className="text-2xl font-bold mb-4">Estadísticas de Partidos</h1>
      <div className="space-y-4">
        {matches.map((match) => (
          <MatchStatsCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}
