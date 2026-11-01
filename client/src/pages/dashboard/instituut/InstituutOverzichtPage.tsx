import axios from "../../../axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "../../jongeren/JongerenOverzichtPage.css";

type Instituut = {
  id: number;
  naam: string;
  omschrijving: string | null;
  adres: string | null;
  contactpersoon: string | null;
  jongeren_count: number;
};

export default function InstituutOverzichtPage() {
  const [instituten, setInstituten] = useState<Instituut[]>([]);
  const [laden, setLaden] = useState(true);
  const [melding, setMelding] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function haalInstitutenOp() {
      try {
        const response = await axios.get<Instituut[]>(
          "http://localhost:8000/api/instituten",
          {
            headers: { Accept: "application/json" },
          },
        );

        setInstituten(response.data ?? []);
      } catch (error) {
        console.error("Fout bij ophalen van instituten:", error);
        setMelding("De instituten konden niet worden opgehaald.");
      } finally {
        setLaden(false);
      }
    }

    haalInstitutenOp();
  }, []);

  return (
    <section className="jk-overzicht">
      <header className="jk-overzicht-header">
        <div>
          <h1>Instituten</h1>
          <p>Totaal {instituten.length} instituten</p>
        </div>

        <button
          type="button"
          className="jk-overzicht-add"
          onClick={() => navigate("/instituut/toevoegen")}
        >
          Instituut toevoegen
        </button>
      </header>

      {melding && (
        <p className="jk-overzicht-error" role="alert">
          {melding}
        </p>
      )}

      <div className="jk-table-card">
        {laden ? (
          <p className="jk-empty">Instituten laden...</p>
        ) : instituten.length === 0 ? (
          <p className="jk-empty">Er zijn nog geen instituten.</p>
        ) : (
          <div className="jk-table-scroll">
            <table className="jk-table">
              <thead>
                <tr>
                  <th>Naam</th>
                  <th>Omschrijving</th>
                  <th>Adres</th>
                  <th>Contactpersoon</th>
                  <th>Geplaatste jongeren</th>
                  <th>Acties</th>
                </tr>
              </thead>

              <tbody>
                {instituten.map((instituut) => (
                  <tr key={instituut.id}>
                    <td>{instituut.naam}</td>
                    <td>{instituut.omschrijving || "—"}</td>
                    <td>{instituut.adres || "—"}</td>
                    <td>{instituut.contactpersoon || "—"}</td>
                    <td>{instituut.jongeren_count}</td>

                    <td>
                      <div className="jk-row-actions">
                        <button
                          type="button"
                          title="Instituut wijzigen"
                          aria-label={`Wijzig ${instituut.naam}`}
                          onClick={() =>
                            navigate(`/instituut/wijzigen?id=${instituut.id}`)
                          }
                        >
                          Bewerken
                        </button>

                        <button
                          type="button"
                          title="Instituut verwijderen"
                          aria-label={`Verwijder ${instituut.naam}`}
                          onClick={() =>
                            navigate(`/instituut/verwijderen?id=${instituut.id}`)
                          }
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