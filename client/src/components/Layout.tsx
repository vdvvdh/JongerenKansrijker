import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ApiError, getGebruiker, LOGIN_PAD, logout, type Gebruiker } from "../api/dashboardApi";
import Sidebar from "./Sidebar";

const TITELS: [string, string][] = [
  ["/jongeren", "Jongerenbeheer"],
  ["/activiteiten", "Activiteiten"],
  ["/instituten", "Instituten"],
  ["/medewerkers", "Medewerkers"],
  ["/overzichten", "Overzichten en rapportages"],
];

function titelVoorPad(pad: string): string {
  return TITELS.find(([prefix]) => pad.startsWith(prefix))?.[1] ?? "Dashboard";
}

export default function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [gebruiker, setGebruiker] = useState<Gebruiker | null>(null);

    useEffect(() => {
    getGebruiker()
      .then(setGebruiker)
      .catch((err: unknown) => {
        const loginOvergeslagen = import.meta.env.VITE_SKIP_LOGIN === "true";
        if (err instanceof ApiError && err.status === 401 && !loginOvergeslagen) navigate(LOGIN_PAD);
      });
  }, [navigate]);

  async function handleLogout() {
    await logout();
    navigate(LOGIN_PAD);
  }

  return (
    <div className="layout">
      <Link to="/dashboard" className="layout__logo">Jongeren Kansrijker</Link>
      <header className="layout__header">
        <h1 className="layout__title">{titelVoorPad(pathname)}</h1>
        <div className="layout__user">
          <span>{gebruiker?.name}</span>
          <button type="button" className="btn btn--secondary" onClick={handleLogout}>Uitloggen</button>
        </div>
      </header>
      <Sidebar />
      <main className="layout__content"><Outlet /></main>
    </div>
  );
}