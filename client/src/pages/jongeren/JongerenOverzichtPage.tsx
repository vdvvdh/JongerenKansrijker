
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./JongerenOverzichtPage.css";

type Jongere = {
  id: number;
  voornaam: string;
  achternaam: string;
  geboortedatum: string;
  email: string;
  telefoonnummer: string;
  adres?: string;
};

export default function JongerenOverzichtPage() {
  const [jongeren, setJongeren] = useState<Jongere[]>([]);
  const [laden, setLaden] = useState(true);
  const [melding, setMelding] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function haalJongerenOp() {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/jongeren",
          {
            withCredentials: true,
            headers: { Accept: "application/json" },
          }
        );

        const gegevens = response.data;
        const lijst = Array.isArray(gegevens)
          ? gegevens
          : gegevens.data;

        setJongeren(Array.isArray(lijst) ? lijst : []);
      } catch (error) {
        console.error("Fout bij ophalen van jongeren:", error);
        setMelding("De jongeren konden niet worden opgehaald.");
      } finally {
        setLaden(false);
      }
    }

    haalJongerenOp();
  }, []);

  function formatDatum(datum: string) {
    if (!datum) return "—";

    const delen = datum.slice(0, 10).split("-");
    if (delen.length !== 3) return datum;

    return `${delen[2]}/${delen[1]}/${delen[0]}`;
  }

  return (
    <section className="jk-overzicht">
      <header className="jk-overzicht-header">
        <div>
          <h1>Jongeren</h1>
          <p>Totaal {jongeren.length} ingeschreven jongeren</p>
        </div>

        <button
          type="button"
          className="jk-overzicht-add"
          onClick={() => navigate("/jongeren/toevoegen")}
        >
          Jongere toevoegen
        </button>
      </header>

      <div className="jk-overzicht-tabs">
        <button type="button" className="active">
          Ingeschreven
        </button>
        <button type="button" disabled title="Wordt later toegevoegd">
          Uitgeplaatst
        </button>
      </div>

      {melding && (
        <p className="jk-overzicht-error" role="alert">
          {melding}
        </p>
      )}

      <div className="jk-table-card">
        {laden ? (
          <p className="jk-empty">Jongeren laden...</p>
        ) : jongeren.length === 0 ? (
          <p className="jk-empty">
            Er zijn nog geen jongeren toegevoegd.
          </p>
        ) : (
          <div className="jk-table-scroll">
            <table className="jk-table">
              <thead>
                <tr>
                  <th>Naam</th>
                  <th>Achternaam</th>
                  <th>Geboortedatum</th>
                  <th>Adres</th>
                  <th>Telefoonnummer</th>
                  <th>E-mail</th>
                  <th>Activiteit</th>
                  <th>Acties</th>
                </tr>
              </thead>

              <tbody>
                {jongeren.map((jongere) => (
                  <tr key={jongere.id}>
                    <td>{jongere.voornaam}</td>
                    <td>{jongere.achternaam}</td>
                    <td>{formatDatum(jongere.geboortedatum)}</td>
                    <td>{jongere.adres || "—"}</td>
                    <td>{jongere.telefoonnummer || "—"}</td>
                    <td>{jongere.email || "—"}</td>
                    <td>
                      <span className="jk-activity-placeholder">—</span>
                    </td>
                    <td>
                      <div className="jk-row-actions">
                        <button
                          type="button"
                          title="Jongere wijzigen"
                          aria-label={`Wijzig ${jongere.voornaam}`}
                          onClick={() =>
                            navigate(`/jongeren/wijzigen?id=${jongere.id}`)
                          }
                        >
                          Bewerken
                        </button>
                        <button
                          type="button"
                          title="Jongere verwijderen"
                          aria-label={`Verwijder ${jongere.voornaam}`}
                          onClick={() => navigate("/jongeren/verwijderen")}
                        >
                          Verwijderen
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
