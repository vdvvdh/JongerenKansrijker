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
            headers: {
              Accept: "application/json",
            },
          }
        );

        // Supports an API response containing either an array
        // or an object with a "data" array.
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

  return (
    <section className="jk-overzicht">
      <div className="jk-overzicht-header">
        <div>
          <h1>Jongeren</h1>
          <p>Bekijk het overzicht van alle jongeren.</p>
        </div>

        <button
          type="button"
          className="jk-button jk-button-save"
          onClick={() => navigate("/jongeren/toevoegen")}
        >
          + Jongere toevoegen
        </button>
      </div>

      {melding && (
        <p className="jk-message" role="alert">
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
          <table className="jk-table">
            <thead>
              <tr>
                <th>Voornaam</th>
                <th>Achternaam</th>
                <th>Geboortedatum</th>
                <th>E-mail</th>
                <th>Telefoon</th>
              </tr>
            </thead>

            <tbody>
              {jongeren.map((jongere) => (
                <tr key={jongere.id}>
                  <td>{jongere.voornaam}</td>
                  <td>{jongere.achternaam}</td>
                  <td>{jongere.geboortedatum}</td>
                  <td>{jongere.email}</td>
                  <td>{jongere.telefoonnummer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
