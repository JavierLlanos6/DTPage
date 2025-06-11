import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PlayerPage from "./pages/PlayerPage";
import StrategyPage from "./pages/StrategyPage";
import MatchDataPage from "./pages/MatchDataPage";
import MatchDayPage from "./pages/MatchDayPage";
import PlayerListPage from "./pages/PlayerListaPage";
import HomePage from "./pages/HomePage";
import SidebarLayout from "./components/SidebarLayout";
import StrategyDetailPage from "./pages/StrategyDetailPage";

function App() {
  return (
    <Router>
      <SidebarLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/anadir-jugador" element={<PlayerPage />} />
          <Route path="/lista-jugador" element={<PlayerListPage />} />
          <Route path="/estrategias" element={<StrategyPage />} />
          <Route
            path="/estrategias/:matchId"
            element={<StrategyDetailPage />}
          />
          <Route path="/datos-partido" element={<MatchDataPage />} />
          <Route path="/dia-partido" element={<MatchDayPage />} />
        </Routes>
      </SidebarLayout>
    </Router>
  );
}

export default App;
