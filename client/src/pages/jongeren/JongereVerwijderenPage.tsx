
import axios from "axios";
import { useEffect, useState } from "react";
import "./JongereToevoegenPage.css";

type Jongere = {
  id: number;
  voornaam: string;
  achternaam: string;
  email: string;
  telefoonnummer: string;
};

export default function JongereVerwijderenPage() {
  const [jongeren, setJongeren] = useState<Jongere[]>([]);
  const [geselecteerdId, setGeselecteerdId] = useState("");
  const [melding, setMelding] = useState("");
  const [laden, setLaden] = useState(true);
  const [bevestigen, setBevestigen] = useState(false);
  const [bezig, setBezig] = useState(false);

  useEffect(() => {
    async function haalJongerenOp() {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/jongeren",
          {
            headers: { Accept: "application/json" },
          }
        );

        const gegevens = response.data;
        const lijst = Array.isArray(gegevens)
          ? gegevens
          : gegevens.data;

        setJongeren(Array.isArray(lijst) ? lijst : []);
      } catch (error) {
        console.error("Fout bij ophalen:", error);
        setMelding("De jongeren konden niet worden opgehaald.");
      } finally {
        setLaden(false);
      }
    }

    haalJongerenOp();
  }, []);

  const geselecteerdeJongere = jongeren.find(
    (jongere) => jongere.id === Number(geselecteerdId)
  );

  async function handleVerwijderen() {
    if (!geselecteerdId || !geselecteerdeJongere) return;

    setBezig(true);
    setMelding("");

    try {
      
        await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
        withCredentials: true,
        withXSRFToken: true,
        });

        await axios.delete(
        `http://localhost:8000/api/jongeren/${geselecteerdId}`,
        {
            withCredentials: true,
            withXSRFToken: true,
            headers: {
            Accept: "application/json",
            },
        }
        );


      setJongeren((huidigeJongeren) =>
        huidigeJongeren.filter(
          (jongere) => jongere.id !== Number(geselecteerdId)
        )
      );

      setGeselecteerdId("");
      setBevestigen(false);
      setMelding("Jongere succesvol verwijderd!");
    } catch (error) {
      console.error("Fout bij verwijderen:", error);

      if (axios.isAxiosError(error)) {
        setMelding(
          error.response?.data?.message ??
            "Verwijderen mislukt. Controleer de server."
        );
      } else {
        setMelding("Er ging iets mis bij het verwijderen.");
      }
    } finally {
      setBezig(false);
    }
  }

  function handleAnnuleren() {
    setGeselecteerdId("");
    setBevestigen(false);
    setMelding("");
  }

  return (
    <div className="jk-card-wrapper">
      <div className="jk-green-shadow" />

      <section className="jk-card">
        <h1>Jongere verwijderen</h1>
        <p>Selecteer de jongere die je wilt verwijderen.</p>

        {laden ? (
          <p>Jongeren laden...</p>
        ) : jongeren.length === 0 ? (
          <p>Er zijn geen jongeren om te verwijderen.</p>
        ) : (
          <>
            <label>
              Jongere
              <select
                value={geselecteerdId}
                onChange={(e) => {
                  setGeselecteerdId(e.target.value);
                  setBevestigen(false);
                  setMelding("");
                }}
              >
                <option value="">Kies een jongere</option>

                {jongeren.map((jongere) => (
                  <option key={jongere.id} value={jongere.id}>
                    {jongere.voornaam} {jongere.achternaam}
                  </option>
                ))}
              </select>
            </label>

            {geselecteerdeJongere && (
              <div>
                <h3>Geselecteerde jongere</h3>
                <p>
                  <strong>Naam:</strong>{" "}
                  {geselecteerdeJongere.voornaam}{" "}
                  {geselecteerdeJongere.achternaam}
                </p>
                <p>
                  <strong>E-mail:</strong> {geselecteerdeJongere.email}
                </p>
                <p>
                  <strong>Telefoon:</strong>{" "}
                  {geselecteerdeJongere.telefoonnummer}
                </p>
              </div>
            )}

            {bevestigen && geselecteerdeJongere && (
              <div>
                <p role="alert">
                  Weet je zeker dat je{" "}
                  <strong>
                    {geselecteerdeJongere.voornaam}{" "}
                    {geselecteerdeJongere.achternaam}
                  </strong>{" "}
                  wilt verwijderen? Dit kan niet ongedaan worden gemaakt.
                </p>

                <div className="jk-form-actions">
                  <button
                    type="button"
                    className="jk-button jk-button-cancel"
                    onClick={() => setBevestigen(false)}
                    disabled={bezig}
                  >
                    Terug
                  </button>

                  <button
                    type="button"
                    className="jk-button"
                    onClick={handleVerwijderen}
                    disabled={bezig}
                  >
                    {bezig ? "Bezig..." : "Ja, verwijderen"}
                  </button>
                </div>
              </div>
            )}

            {!bevestigen && (
              <div className="jk-form-actions">
                <button
                  type="button"
                  className="jk-button jk-button-cancel"
                  onClick={handleAnnuleren}
                >
                  Annuleren
                </button>

                <button
                  type="button"
                  className="jk-button"
                  disabled={!geselecteerdId}
                  onClick={() => setBevestigen(true)}
                >
                  Verwijderen
                </button>
              </div>
            )}
          </>
        )}

        {melding && (
          <p className="jk-message" role="status">
            {melding}
          </p>
        )}
      </section>
    </div>
  );
}
