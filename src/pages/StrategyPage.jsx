import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../css/StrategyPage.css";

export default function StrategyPage() {
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      const querySnapshot = await getDocs(collection(db, "matches"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMatches(data);
    };
    fetchMatches();
  }, []);

  return (
    <div className="strategy-container">
      <h2 className="strategy-title">Partidos guardados</h2>
      <div className="strategy-grid">
        {matches.map((match) => (
          <div
            key={match.id}
            className="strategy-card"
            onClick={() => navigate(`/estrategias/${match.id}`)}
          >
            <h3>{match.opponent}</h3>
            <p>{match.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
