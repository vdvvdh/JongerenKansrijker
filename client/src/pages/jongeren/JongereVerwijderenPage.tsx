
import axios from "axios";
import { useEffect, useState } from "react";
import "./JongereVerwijderenPage.css";

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
          { headers: { Accept: "application/json" } }
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
    if (!geselecteerdId || !geselecteerdeJongere || bezig) return;

    setBezig(true);
    setMelding("");

    try {
      await axios.get(
        "http://localhost:8000/sanctum/csrf-cookie",
        {
          withCredentials: true,
          withXSRFToken: true,
        }
      );

      await axios.delete(
        `http://localhost:8000/api/jongeren/${geselecteerdId}`,
        {
          withCredentials: true,
          withXSRFToken: true,
          headers: { Accept: "application/json" },
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
    if (bezig) return;
    setBevestigen(false);
  }

  return (
    <div className="jk-verwijderen-page">
      <section className="jk-verwijderen-card">
        <h1>Jongere verwijderen</h1>
        <p className="jk-verwijderen-intro">
          Selecteer de jongere die je wilt verwijderen.
        </p>

        {laden ? (
          <p>Jongeren laden...</p>
        ) : jongeren.length === 0 ? (
          <p>Er zijn geen jongeren om te verwijderen.</p>
        ) : (
          <>
            <div className="jk-select-section">
              <label htmlFor="jongere-select">
                Kies een jongere
              </label>

              <select
                id="jongere-select"
                value={geselecteerdId}
                onChange={(e) => {
                  setGeselecteerdId(e.target.value);
                  setBevestigen(false);
                  setMelding("");
                }}
              >
                <option value="">Selecteer een jongere...</option>

                {jongeren.map((jongere) => (
                  <option key={jongere.id} value={jongere.id}>
                    {jongere.voornaam} {jongere.achternaam}
                  </option>
                ))}
              </select>

              <p className="jk-select-hint">
                Kies de persoon die je wilt verwijderen.
              </p>
            </div>

            {geselecteerdeJongere && (
              <div className="jk-selected-person">
                <h3>Geselecteerde jongere</h3>
                <p>
                  <strong>Naam:</strong>{" "}
                  {geselecteerdeJongere.voornaam}{" "}
                  {geselecteerdeJongere.achternaam}
                </p>
                <p>
                  <strong>E-mail:</strong>{" "}
                  {geselecteerdeJongere.email || "Niet ingevuld"}
                </p>
                <p>
                  <strong>Telefoon:</strong>{" "}
                  {geselecteerdeJongere.telefoonnummer || "Niet ingevuld"}
                </p>
              </div>
            )}

            <div className="jk-delete-actions">
              <button
                type="button"
                className="jk-delete-button jk-delete-button-secondary"
                onClick={handleAnnuleren}
                disabled={!geselecteerdId || bezig}
              >
                Annuleren
              </button>

              <button
                type="button"
                className="jk-delete-button jk-delete-button-danger"
                disabled={!geselecteerdId}
                onClick={() => setBevestigen(true)}
              >
                Verwijderen
              </button>
            </div>
          </>
        )}

        {melding && (
          <p className="jk-delete-message" role="status">
            {melding}
          </p>
        )}
      </section>

      {bevestigen && geselecteerdeJongere && (
        <div
          className="jk-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) handleAnnuleren();
          }}
        >
          <section
            className="jk-delete-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="jk-delete-title"
            aria-describedby="jk-delete-description"
          >
            <div className="jk-modal-icon">!</div>

            <h2 id="jk-delete-title">
              {geselecteerdeJongere.voornaam}{" "}
              {geselecteerdeJongere.achternaam} verwijderen?
            </h2>

            <p id="jk-delete-description">
              Weet je zeker dat je deze jongere wilt verwijderen?
              Deze actie kan niet ongedaan worden gemaakt.
            </p>

            <div className="jk-modal-actions">
              <button
                type="button"
                className="jk-delete-button jk-delete-button-secondary"
                onClick={handleAnnuleren}
                disabled={bezig}
              >
                Nee, terug
              </button>

              <button
                type="button"
                className="jk-delete-button jk-delete-button-danger"
                onClick={handleVerwijderen}
                disabled={bezig}
              >
                {bezig ? "Bezig..." : "Ja, verwijderen"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
