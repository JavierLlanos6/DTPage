import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Partidos guardados</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map((match) => (
          <div
            key={match.id}
            className="bg-white shadow-md rounded-xl p-4 cursor-pointer hover:scale-105 transition"
            onClick={() => navigate(`/estrategias/${match.id}`)}
          >
            <h3 className="text-xl font-semibold">{match.opponent}</h3>
            <p className="text-gray-500">{match.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
