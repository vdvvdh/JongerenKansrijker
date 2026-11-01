import axios from "../../../axios";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import "../../jongeren/JongereVerwijderenPage.css";

type Instituut = {
  id: number;
  naam: string;
  adres: string | null;
  contactpersoon: string | null;
  jongeren_count: number;
};

export default function InstituutVerwijderenPage() {
  const [instituten, setInstituten] = useState<Instituut[]>([]);
  const [geselecteerdId, setGeselecteerdId] = useState("");
  const [melding, setMelding] = useState("");
  const [laden, setLaden] = useState(true);
  const [bevestigen, setBevestigen] = useState(false);
  const [bezig, setBezig] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    async function haalInstitutenOp() {
      try {
        const response = await axios.get<Instituut[]>(
          "http://localhost:8000/api/instituten",
          {
            headers: { Accept: "application/json" },
          },
        );

        const lijst = response.data ?? [];
        setInstituten(lijst);

        const idUitUrl = searchParams.get("id");
        if (
          idUitUrl &&
          lijst.some((instituut) => instituut.id === Number(idUitUrl))
        ) {
          setGeselecteerdId(idUitUrl);
        }
      } catch (error) {
        console.error("Fout bij ophalen:", error);
        setMelding("De instituten konden niet worden opgehaald.");
      } finally {
        setLaden(false);
      }
    }

    haalInstitutenOp();
  }, [searchParams]);

  const geselecteerdInstituut = instituten.find(
    (instituut) => instituut.id === Number(geselecteerdId),
  );

  // Een instituut met geplaatste jongeren mag niet verwijderd worden
  const heeftJongeren = (geselecteerdInstituut?.jongeren_count ?? 0) > 0;

  async function handleVerwijderen() {
    if (!geselecteerdId || !geselecteerdInstituut || bezig) return;

    setBezig(true);
    setMelding("");

    try {
      await axios.delete(
        `http://localhost:8000/api/instituten/${geselecteerdId}`,
        {
          withCredentials: true,
          withXSRFToken: true,
          headers: { Accept: "application/json" },
        },
      );

      setInstituten((huidigeInstituten) =>
        huidigeInstituten.filter(
          (instituut) => instituut.id !== Number(geselecteerdId),
        ),
      );

      setBevestigen(false);
      navigate("/instituut");
    } catch (error) {
      console.error("Fout bij verwijderen:", error);

      if (isAxiosError(error)) {
        setMelding(
          error.response?.data?.message ??
            "Verwijderen mislukt. Controleer de Laravel-server.",
        );
      } else {
        setMelding("Er ging iets mis bij het verwijderen.");
      }

      setBevestigen(false);
    } finally {
      setBezig(false);
    }
  }

  return (
    <div className="jk-verwijderen-page">
      <section className="jk-verwijderen-card">
        <h1>Instituut verwijderen</h1>
        <p className="jk-verwijderen-intro">
          Selecteer het instituut dat je wilt verwijderen.
        </p>

        {laden ? (
          <p>Instituten laden...</p>
        ) : instituten.length === 0 ? (
          <p>Er zijn geen instituten om te verwijderen.</p>
        ) : (
          <>
            <div className="jk-select-section">
              <label htmlFor="instituut-select">Kies een instituut</label>

              <select
                id="instituut-select"
                value={geselecteerdId}
                onChange={(e) => {
                  setGeselecteerdId(e.target.value);
                  setBevestigen(false);
                  setMelding("");
                }}
              >
                <option value="">Selecteer een instituut...</option>
                {instituten.map((instituut) => (
                  <option key={instituut.id} value={instituut.id}>
                    {instituut.naam}
                  </option>
                ))}
              </select>
            </div>

            {geselecteerdInstituut && (
              <div className="jk-selected-person">
                <h3>Geselecteerd instituut</h3>
                <p>
                  <strong>Naam:</strong> {geselecteerdInstituut.naam}
                </p>
                <p>
                  <strong>Adres:</strong>{" "}
                  {geselecteerdInstituut.adres || "Niet ingevuld"}
                </p>
                <p>
                  <strong>Contactpersoon:</strong>{" "}
                  {geselecteerdInstituut.contactpersoon || "Niet ingevuld"}
                </p>
                <p>
                  <strong>Geplaatste jongeren:</strong>{" "}
                  {geselecteerdInstituut.jongeren_count}
                </p>

                {heeftJongeren && (
                  <p role="alert">
                    Dit instituut kan niet worden verwijderd zolang er jongeren
                    geplaatst zijn.
                  </p>
                )}
              </div>
            )}

            <div className="jk-delete-actions">
              <button
                type="button"
                className="jk-delete-button jk-delete-button-secondary"
                onClick={() => navigate("/instituut")}
              >
                Terug naar overzicht
              </button>

              <button
                type="button"
                className="jk-delete-button jk-delete-button-danger"
                disabled={!geselecteerdId || bezig || heeftJongeren}
                onClick={() => setBevestigen(true)}
              >
                Verwijderen
              </button>
            </div>
          </>
        )}

        {melding && (
          <p className="jk-delete-message" role="alert">
            {melding}
          </p>
        )}
      </section>

      {bevestigen && geselecteerdInstituut && (
        <div className="jk-modal-overlay">
          <section
            className="jk-delete-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="jk-delete-title"
            aria-describedby="jk-delete-description"
          >
            <div className="jk-modal-icon">!</div>

            <h2 id="jk-delete-title">
              {geselecteerdInstituut.naam} verwijderen?
            </h2>

            <p id="jk-delete-description">
              Weet je zeker dat je dit instituut wilt verwijderen? Deze actie
              kan niet ongedaan worden gemaakt.
            </p>

            <div className="jk-modal-actions">
              <button
                type="button"
                className="jk-delete-button jk-delete-button-secondary"
                onClick={() => setBevestigen(false)}
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
