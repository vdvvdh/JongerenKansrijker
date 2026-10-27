import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import "./Sidebar.css";
import { logout } from "../services/authService";

import logo from "../assets/logo.svg";
import jongerenIcon from "../assets/jongeren-icon.svg";
import activiteitenIcon from "../assets/activiteiten-icon.svg";
import instituutIcon from "../assets/instituut-icon.svg";
import medewerkersIcon from "../assets/medewerkers-icon.svg";
import logoutIcon from "../assets/logout-icon.svg";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [jongerenOpen, setJongerenOpen] = useState(
    location.pathname.startsWith("/jongeren")
  );
  const [logoutError, setLogoutError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  const isJongerenPage = location.pathname.startsWith("/jongeren");

  async function handleLogout() {
    setLogoutError("");
    setLoggingOut(true);

    try {
      await logout();
      navigate("/", { replace: true });
    } catch {
      setLogoutError("Uitloggen is mislukt. Probeer het opnieuw.");
    } finally {
      setLoggingOut(false);
    }
  }

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
        onClick={() => void handleLogout()}
        disabled={loggingOut}
      >
        <img src={logoutIcon} alt="" className="jk-logout-icon" />
      </button>
      {logoutError && <p role="alert">{logoutError}</p>}
    </aside>
  );
}