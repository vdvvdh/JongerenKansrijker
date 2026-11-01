import axios from "../../../axios";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate, useSearchParams } from "react-router";
import "../../jongeren/JongereToevoegenPage.css";

type Instituut = {
  id: number;
  naam: string;
  omschrijving: string | null;
  adres: string | null;
  contactpersoon: string | null;
};

export default function InstituutWijzigenPage() {
  const [instituten, setInstituten] = useState<Instituut[]>([]);
  const [geselecteerdId, setGeselecteerdId] = useState("");
  const [naam, setNaam] = useState("");
  const [contactpersoon, setContactpersoon] = useState("");
  const [adres, setAdres] = useState("");
  const [omschrijving, setOmschrijving] = useState("");
  const [melding, setMelding] = useState("");
  const [laden, setLaden] = useState(true);
  const [opslaan, setOpslaan] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  function kiesInstituut(instituut: Instituut | undefined) {
    setMelding("");

    if (!instituut) {
      setGeselecteerdId("");
      setNaam("");
      setContactpersoon("");
      setAdres("");
      setOmschrijving("");
      return;
    }

    setGeselecteerdId(String(instituut.id));
    setNaam(instituut.naam ?? "");
    setContactpersoon(instituut.contactpersoon ?? "");
    setAdres(instituut.adres ?? "");
    setOmschrijving(instituut.omschrijving ?? "");
  }

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
        if (idUitUrl) {
          const gekozen = lijst.find(
            (instituut) => instituut.id === Number(idUitUrl),
          );
          if (gekozen) {
            kiesInstituut(gekozen);
          }
        }
      } catch (error) {
        console.error("Fout bij ophalen van instituten:", error);
        setMelding("De instituten konden niet worden opgehaald.");
      } finally {
        setLaden(false);
      }
    }

    haalInstitutenOp();
  }, [searchParams]);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setMelding("");

    if (!geselecteerdId) {
      setMelding("Selecteer eerst een instituut.");
      return;
    }

    setOpslaan(true);

    try {
      const response = await axios.put<Instituut>(
        `http://localhost:8000/api/instituten/${geselecteerdId}`,
        {
          naam,
          contactpersoon: contactpersoon || null,
          adres: adres || null,
          omschrijving: omschrijving || null,
        },
        {
          withCredentials: true,
          withXSRFToken: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );

      setInstituten((huidigeInstituten) =>
        huidigeInstituten.map((instituut) =>
          instituut.id === Number(geselecteerdId)
            ? { ...instituut, ...response.data }
            : instituut,
        ),
      );

      setMelding("De gegevens zijn succesvol opgeslagen.");
    } catch (error) {
      console.error("Fout bij wijzigen:", error);

      if (isAxiosError(error)) {
        const apiError = error.response?.data;

        if (apiError?.errors) {
          setMelding(Object.values(apiError.errors).flat().join(" "));
        } else {
          setMelding(
            apiError?.message ??
              "Wijzigen mislukt. Controleer de Laravel-server.",
          );
        }
      } else {
        setMelding("Er ging iets mis bij het wijzigen.");
      }
    } finally {
      setOpslaan(false);
    }
  }

  return (
    <div className="jk-card-wrapper">
      <div className="jk-green-shadow" />

      <section className="jk-card">
        <h1 className="jk-wijzigen-title">Instituut wijzigen</h1>

        {laden ? (
          <p>Instituten laden...</p>
        ) : instituten.length === 0 ? (
          <p>Er zijn geen instituten om te wijzigen.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="jk-wijzigen-select">
              Selecteer een instituut
              <select
                value={geselecteerdId}
                onChange={(e) => {
                  const gekozen = instituten.find(
                    (instituut) => instituut.id === Number(e.target.value),
                  );
                  kiesInstituut(gekozen);
                }}
                required
              >
                <option value="">Kies een instituut</option>
                {instituten.map((instituut) => (
                  <option key={instituut.id} value={instituut.id}>
                    {instituut.naam}
                  </option>
                ))}
              </select>
            </label>

            <div className="jk-form-grid">
              <label>
                Naam
                <input
                  value={naam}
                  onChange={(e) => setNaam(e.target.value)}
                  required
                />
              </label>

              <label>
                Contactpersoon
                <input
                  value={contactpersoon}
                  onChange={(e) => setContactpersoon(e.target.value)}
                />
              </label>

              <label className="jk-full-width">
                Adres
                <input
                  value={adres}
                  onChange={(e) => setAdres(e.target.value)}
                />
              </label>

              <label className="jk-full-width">
                Omschrijving
                <input
                  value={omschrijving}
                  onChange={(e) => setOmschrijving(e.target.value)}
                />
              </label>
            </div>

            {melding && (
              <p className="jk-message" role="status">
                {melding}
              </p>
            )}

            <div className="jk-form-actions">
              <button
                type="button"
                className="jk-button jk-button-cancel"
                onClick={() => navigate("/instituut")}
              >
                Terug naar overzicht
              </button>

              <button
                type="submit"
                className="jk-button jk-button-save"
                disabled={opslaan}
              >
                {opslaan ? "Opslaan..." : "Wijzigingen opslaan"}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
