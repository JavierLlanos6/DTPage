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
          <FaHome /> Inicio
        </Link>
        <Link
          to="/anadir-jugador"
          className={pathname === "/anadir-jugador" ? "active" : ""}
        >
          <FaPlus /> Añadir jugador
        </Link>
        <Link
          to="/lista-jugador"
          className={pathname === "/lista-jugador" ? "active" : ""}
        >
          <FaList /> Lista de jugadores
        </Link>
        <Link
          to="/estrategias"
          className={pathname === "/estrategias" ? "active" : ""}
        >
          <FaClipboard /> Tácticas
        </Link>
        <Link
          to="/datos-partido"
          className={pathname === "/datos-partido" ? "active" : ""}
        >
          <FaChartBar /> Datos del partido
        </Link>
        <Link
          to="/dia-partido"
          className={pathname === "/dia-partido" ? "active" : ""}
        >
          <FaFutbol /> Día de partido
        </Link>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}

export default SidebarLayout;
