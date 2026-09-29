import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError, getDashboard, LOGIN_PAD } from "../api/dashboardApi";
import type { DashboardData } from "../types/Dashboard";

interface StatCardProps { label: string; waarde: number; to?: string; waarschuwing?: boolean; }

function StatCard({ label, waarde, to, waarschuwing }: StatCardProps) {
  const inhoud = (
    <>
      <span className="stat__value">{waarde}</span>
      <span className="stat__label">{label}</span>
    </>
  );
  const klasse = "stat" + (waarschuwing && waarde > 0 ? " stat--warning" : "");
  return to ? <Link to={to} className={klasse}>{inhoud}</Link> : <div className={klasse}>{inhoud}</div>;
}

function MeterRow({ label, waarde, max }: { label: string; waarde: number; max: number }) {
  return (
    <div className="meter-row">
      <span>{label}</span>
      <meter className="meter-row__bar" value={waarde} min={0} max={Math.max(max, 1)} />
      <span className="meter-row__value">{waarde}</span>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [fout, setFout] = useState<string | null>(null);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.status === 401) navigate(LOGIN_PAD);
        else if (err instanceof ApiError && err.status >= 500) setFout("Er is iets misgegaan, probeer het later opnieuw.");
        else setFout("Het dashboard kon niet worden geladen.");
      });
  }, [navigate]);

  if (fout) return <p className="message message--error" role="alert">{fout}</p>;
  if (!data) return <p className="loading">Laden…</p>;

  const maxStatus = Math.max(data.actief, data.uitgeplaatst);
  const maxInstroom = Math.max(...data.instroom.map((m) => m.aantal), 1);

  return (
    <>
      <p className="welcome">Welkom terug. Dit is de stand van zaken.</p>

      <section className="stats" aria-label="Kerncijfers">
        <StatCard label="Actieve jongeren" waarde={data.actief} to="/jongeren?status=actief" />
        <StatCard label="Uitgeplaatst" waarde={data.uitgeplaatst} to="/jongeren?status=uitgeplaatst" />
        <StatCard label="Activiteiten" waarde={data.activiteiten} to="/activiteiten" />
        <StatCard label="Instituten" waarde={data.instituten} to="/instituten" />
        <StatCard label="Actief, geen activiteit (90 dgn)" waarde={data.zonder_recente_activiteit} waarschuwing />
      </section>

      <section className="card">
        <h2 className="card__title">Snelle acties</h2>
        <div className="actions">
          <Link to="/jongeren/toevoegen" className="btn btn--primary">Jongere toevoegen</Link>
          <Link to="/jongeren" className="btn btn--secondary">Alle jongeren bekijken</Link>
        </div>
      </section>

      <div className="grid-2">
        <section className="card">
          <h2 className="card__title">Actief versus uitgeplaatst</h2>
          <MeterRow label="Actief" waarde={data.actief} max={maxStatus} />
          <MeterRow label="Uitgeplaatst" waarde={data.uitgeplaatst} max={maxStatus} />
        </section>
        <section className="card">
          <h2 className="card__title">Instroom per maand</h2>
          {data.instroom.map((m) => (
            <MeterRow key={m.maand} label={m.label} waarde={m.aantal} max={maxInstroom} />
          ))}
        </section>
      </div>

      <section className="card">
        <h2 className="card__title">Recent toegevoegd</h2>
        {data.recent.length === 0 ? (
          <p>Er zijn nog geen jongeren toegevoegd.</p>
        ) : (
          <table className="table">
            <thead>
              <tr><th>Naam</th><th>Status</th><th>Ingeschreven op</th></tr>
            </thead>
            <tbody>
              {data.recent.map((j) => (
                <tr key={j.id}>
                  <td><Link to={`/jongeren/${j.id}`}>{j.voornaam} {j.achternaam}</Link></td>
                  <td><span className={"badge badge--" + j.status}>{j.status}</span></td>
                  <td>{new Date(j.inschrijfdatum).toLocaleDateString("nl-NL")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}