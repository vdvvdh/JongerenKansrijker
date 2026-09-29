import { NavLink } from "react-router-dom";

const MENU = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/jongeren", label: "Jongeren" },
  { to: "/activiteiten", label: "Activiteiten" },
  { to: "/instituten", label: "Instituten" },
  { to: "/medewerkers", label: "Medewerkers" },
  { to: "/overzichten", label: "Overzichten" },
];

export default function Sidebar() {
  return (
    <nav className="sidebar" aria-label="Hoofdmenu">
      <ul className="sidebar__list">
        {MENU.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) => "sidebar__link" + (isActive ? " sidebar__link--active" : "")}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}