import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Sidebar.css";

import logo from "../assets/logo.svg";
import jongerenIcon from "../assets/jongeren-icon.svg";
import activiteitenIcon from "../assets/activiteiten-icon.svg";
import instituutIcon from "../assets/instituut-icon.svg";
import medewerkersIcon from "../assets/medewerkers-icon.svg";
import logoutIcon from "../assets/logout-icon.svg";

export default function Sidebar() {
  const location = useLocation();

  const [jongerenOpen, setJongerenOpen] = useState(
    location.pathname.startsWith("/jongeren")
  );

  const isJongerenPage = location.pathname.startsWith("/jongeren");

  return (
    <aside className="jk-sidebar">
      <div className="jk-logo">
        <img
          src={logo}
          alt="Jongeren Kansrijker"
          className="jk-logo-image"
        />
      </div>

      <nav className="jk-navigation">
        <button
          type="button"
          className={`jk-nav-item jk-nav-toggle ${
            isJongerenPage ? "active" : ""
          }`}
          onClick={() => setJongerenOpen((open) => !open)}
          aria-expanded={jongerenOpen}
        >
          <img src={jongerenIcon} alt="" className="jk-nav-icon" />
          <span>Jongeren</span>
          <span className="jk-nav-arrow">{jongerenOpen ? "⌄" : "›"}</span>
        </button>

        {jongerenOpen && (
          <div className="jk-submenu">
            <NavLink to="/jongeren">Overzicht</NavLink>
            <NavLink to="/jongeren/toevoegen">Toevoegen</NavLink>
            <NavLink to="/jongeren/wijzigen">Wijzigen</NavLink>
            <NavLink to="/jongeren/verwijderen">Verwijderen</NavLink>
          </div>
        )}

        <NavLink
          className={({ isActive }) =>
            `jk-nav-item ${isActive ? "active" : ""}`
          }
          to="/activiteiten"
        >
          <img src={activiteitenIcon} alt="" className="jk-nav-icon" />
          <span>Activiteiten</span>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `jk-nav-item ${isActive ? "active" : ""}`
          }
          to="/instituten"
        >
          <img src={instituutIcon} alt="" className="jk-nav-icon" />
          <span>Instituut</span>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `jk-nav-item ${isActive ? "active" : ""}`
          }
          to="/medewerkers"
        >
          <img src={medewerkersIcon} alt="" className="jk-nav-icon" />
          <span>Medewerkers</span>
        </NavLink>
      </nav>

      <button
        className="jk-logout"
        type="button"
        aria-label="Uitloggen"
        title="Uitloggen"
      >
        <img src={logoutIcon} alt="" className="jk-logout-icon" />
      </button>
    </aside>
  );
}