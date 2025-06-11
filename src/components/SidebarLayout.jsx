import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaPlus,
  FaList,
  FaClipboard,
  FaChartBar,
  FaFutbol,
} from "react-icons/fa";
import "../css/SidebarLayout.css";

function SidebarLayout({ children }) {
  const { pathname } = useLocation();

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="club-logo">
          <img src="/src/assets/BocaEscudo.svg" alt="Escudo Boca Juniors" />
          <p>
            Club Atlético <br /> <span>Boca Juniors Bolivia</span>
          </p>
        </div>
        <Link to="/" className={pathname === "/" ? "active" : ""}>
          <FaHome /> <span>Inicio</span>
        </Link>
        <Link
          to="/anadir-jugador"
          className={pathname === "/anadir-jugador" ? "active" : ""}
        >
          <FaPlus /> <span>Añadir jugador</span>
        </Link>
        <Link
          to="/lista-jugador"
          className={pathname === "/lista-jugador" ? "active" : ""}
        >
          <FaList /> <span>Lista de jugadores</span>
        </Link>
        <Link
          to="/estrategias"
          className={pathname === "/estrategias" ? "active" : ""}
        >
          <FaClipboard /> <span>Historial de partidos</span>
        </Link>
        <Link
          to="/datos-partido"
          className={pathname === "/datos-partido" ? "active" : ""}
        >
          <FaChartBar /> <span>Datos del partido</span>
        </Link>
        <Link
          to="/dia-partido"
          className={pathname === "/dia-partido" ? "active" : ""}
        >
          <FaFutbol /> <span>Día de partido</span>
        </Link>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}

export default SidebarLayout;
