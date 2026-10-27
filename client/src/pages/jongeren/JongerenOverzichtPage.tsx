import axios from "../../axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./JongerenOverzichtPage.css";

type Activiteit = {
  id: number;
  naam: string;
  pivot?: {
    resultaat?: string;
    inschrijf_datum?: string;
  };
};

type Instituut = {
  id: number;
  naam: string;
};

type Jongere = {
  id: number;
  voornaam: string;
  achternaam: string;
  geboortedatum: string;
  email: string | null;
  telefoonnummer: string | null;
  instituut_id: number | null;
  uitgeplaatst_op: string | null;
  activiteiten?: Activiteit[];
  instituut?: Instituut | null;
};

type JongerenOverzicht = {
  ingeschreven: Jongere[];
  uitgeschreven: Jongere[];
};

export default function JongerenOverzichtPage() {
  const [ingeschreven, setIngeschreven] = useState<Jongere[]>([]);
  const [uitgeschreven, setUitgeschreven] = useState<Jongere[]>([]);
  const [actieveTab, setActieveTab] = useState<
    "ingeschreven" | "uitgeschreven"
  >("ingeschreven");
  const [laden, setLaden] = useState(true);
  const [melding, setMelding] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function haalJongerenOp() {
      try {
        const response = await axios.get<JongerenOverzicht>(
          "http://localhost:8000/api/jongeren",
          {
            headers: { Accept: "application/json" },
          },
        );

        setIngeschreven(response.data.ingeschreven ?? []);
        setUitgeschreven(response.data.uitgeschreven ?? []);
      } catch (error) {
        console.error("Fout bij ophalen van jongeren:", error);
        setMelding("De jongeren konden niet worden opgehaald.");
      } finally {
        setLaden(false);
      }
    }

    haalJongerenOp();
  }, []);

  const jongeren = actieveTab === "ingeschreven" ? ingeschreven : uitgeschreven;

  function formatDatum(datum: string | null | undefined) {
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
          <p>
            Totaal {jongeren.length}{" "}
            {actieveTab === "ingeschreven"
              ? "ingeschreven jongeren"
              : "uitgeplaatste jongeren"}
          </p>
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
        <button
          type="button"
          className={actieveTab === "ingeschreven" ? "active" : ""}
          onClick={() => setActieveTab("ingeschreven")}
        >
          Ingeschreven ({ingeschreven.length})
        </button>

        <button
          type="button"
          className={actieveTab === "uitgeschreven" ? "active" : ""}
          onClick={() => setActieveTab("uitgeschreven")}
        >
          Uitgeplaatst ({uitgeschreven.length})
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
          <p className="jk-empty">Er zijn geen jongeren in deze lijst.</p>
        ) : (
          <div className="jk-table-scroll">
            <table className="jk-table">
              <thead>
                <tr>
                  <th>Voornaam</th>
                  <th>Achternaam</th>
                  <th>Geboortedatum</th>
                  <th>Telefoonnummer</th>
                  <th>E-mail</th>
                  {actieveTab === "ingeschreven" ? (
                    <th>Activiteiten</th>
                  ) : (
                    <>
                      <th>Instituut</th>
                      <th>Uitgeplaatst op</th>
                    </>
                  )}
                  <th>Acties</th>
                </tr>
              </thead>

              <tbody>
                {jongeren.map((jongere) => (
                  <tr key={jongere.id}>
                    <td>{jongere.voornaam}</td>
                    <td>{jongere.achternaam}</td>
                    <td>{formatDatum(jongere.geboortedatum)}</td>
                    <td>{jongere.telefoonnummer || "—"}</td>
                    <td>{jongere.email || "—"}</td>

                    {actieveTab === "ingeschreven" ? (
                      <td>
                        {jongere.activiteiten?.length
                          ? jongere.activiteiten
                              .map((activiteit) => activiteit.naam)
                              .join(", ")
                          : "—"}
                      </td>
                    ) : (
                      <>
                        <td>{jongere.instituut?.naam || "—"}</td>
                        <td>{formatDatum(jongere.uitgeplaatst_op)}</td>
                      </>
                    )}

                    <td>
                      <div className="jk-row-actions">
                        <button
                          type="button"
                          title="Jongere wijzigen"
                          aria-label={`Wijzig ${jongere.voornaam} ${jongere.achternaam}`}
                          onClick={() =>
                            navigate(`/jongeren/wijzigen?id=${jongere.id}`)
                          }
                        >
                          Bewerken
                        </button>

                        <button
                          type="button"
                          title="Jongere verwijderen"
                          aria-label={`Verwijder ${jongere.voornaam} ${jongere.achternaam}`}
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
