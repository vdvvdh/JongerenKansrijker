
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const location = useLocation();

  const [jongerenOpen, setJongerenOpen] = useState(
    location.pathname.startsWith("/jongeren")
  );

  const isJongerenPage = location.pathname.startsWith("/jongeren");

  return (
    <aside className="jk-sidebar">
      <div className="jk-logo">
        <div className="jk-logo-mark">✿</div>
        <div className="jk-logo-text">
          <strong>Jongeren</strong>
          <strong>
            Kansrijker <span>●</span>
          </strong>
        </div>
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
          <span>♙</span>
          Jongeren
          <span className="jk-nav-arrow">
            {jongerenOpen ? "⌄" : "›"}
          </span>
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
          <span>⌁</span> Activiteiten
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `jk-nav-item ${isActive ? "active" : ""}`
          }
          to="/instituten"
        >
          <span>▦</span> Instituut
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `jk-nav-item ${isActive ? "active" : ""}`
          }
          to="/medewerkers"
        >
          <span>♧</span> Medewerkers
        </NavLink>
      </nav>

      <button
        className="jk-logout"
        type="button"
        aria-label="Uitloggen"
        title="Uitloggen"
      >
        ⇥
      </button>
    </aside>
  );
}
