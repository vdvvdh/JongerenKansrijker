import axios from "../../axios";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router";
import "./JongereToevoegenPage.css";

type Jongere = {
  id: number;
  voornaam: string;
  achternaam: string;
  geboortedatum: string;
  email: string | null;
  telefoon: string | null;
  adres?: string | null;
  instituut_id: number | null;
  uitgeplaatst_op: string | null;
};

type JongerenOverzicht = {
  ingeschreven: Jongere[];
  uitgeschreven: Jongere[];
};

export default function JongereWijzigenPage() {
  const [jongeren, setJongeren] = useState<Jongere[]>([]);
  const [geselecteerdId, setGeselecteerdId] = useState("");
  const [voornaam, setVoornaam] = useState("");
  const [achternaam, setAchternaam] = useState("");
  const [geboortedatum, setGeboortedatum] = useState("");
  const [email, setEmail] = useState("");
  const [telefoon, setTelefoon] = useState("");
  const [adres, setAdres] = useState("");
  const [melding, setMelding] = useState("");
  const [laden, setLaden] = useState(true);
  const [opslaan, setOpslaan] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  function kiesJongere(jongere: Jongere | undefined) {
    setMelding("");

    if (!jongere) {
      setGeselecteerdId("");
      setVoornaam("");
      setAchternaam("");
      setGeboortedatum("");
      setEmail("");
      setTelefoon("");
      setAdres("");
      return;
    }

    setGeselecteerdId(String(jongere.id));
    setVoornaam(jongere.voornaam ?? "");
    setAchternaam(jongere.achternaam ?? "");
    setGeboortedatum(jongere.geboortedatum?.slice(0, 10) ?? "");
    setEmail(jongere.email ?? "");
    setTelefoon(jongere.telefoon ?? "");
    setAdres(jongere.adres ?? "");
  }

  useEffect(() => {
    async function haalJongerenOp() {
      try {
        const response = await axios.get<JongerenOverzicht>(
          "http://localhost:8000/api/jongeren",
          {
            headers: { Accept: "application/json" },
          },
        );

        const lijst = [
          ...(response.data.ingeschreven ?? []),
          ...(response.data.uitgeschreven ?? []),
        ];

        setJongeren(lijst);

        const idUitUrl = searchParams.get("id");
        if (idUitUrl) {
          const gekozen = lijst.find(
            (jongere) => jongere.id === Number(idUitUrl),
          );
          if (gekozen) {
            kiesJongere(gekozen);
          }
        }
      } catch (error) {
        console.error("Fout bij ophalen van jongeren:", error);
        setMelding("De jongeren konden niet worden opgehaald.");
      } finally {
        setLaden(false);
      }
    }

    haalJongerenOp();
  }, [searchParams]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMelding("");

    if (!geselecteerdId) {
      setMelding("Selecteer eerst een jongere.");
      return;
    }

    setOpslaan(true);

    try {
      const response = await axios.put<Jongere>(
        `http://localhost:8000/api/jongeren/${geselecteerdId}`,
        {
          voornaam,
          achternaam,
          geboortedatum,
          email: email || null,
          telefoon: telefoon || null,
          adres: adres || null,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );

      setJongeren((huidigeJongeren) =>
        huidigeJongeren.map((jongere) =>
          jongere.id === Number(geselecteerdId)
            ? { ...jongere, ...response.data }
            : jongere,
        ),
      );

      setMelding("De gegevens zijn succesvol opgeslagen.");
    } catch (error) {
      console.error("Fout bij wijzigen:", error);

      if (axios.isAxiosError(error)) {
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
        <h1 className="jk-wijzigen-title">Jongere wijzigen</h1>

        {laden ? (
          <p>Jongeren laden...</p>
        ) : jongeren.length === 0 ? (
          <p>Er zijn geen jongeren om te wijzigen.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="jk-wijzigen-select">
              Selecteer een jongere
              <select
                value={geselecteerdId}
                onChange={(e) => {
                  const gekozen = jongeren.find(
                    (jongere) => jongere.id === Number(e.target.value),
                  );
                  kiesJongere(gekozen);
                }}
                required
              >
                <option value="">Kies een jongere</option>
                {jongeren.map((jongere) => (
                  <option key={jongere.id} value={jongere.id}>
                    {jongere.voornaam} {jongere.achternaam}
                  </option>
                ))}
              </select>
            </label>

            <div className="jk-form-grid">
              <label>
                Voornaam
                <input
                  value={voornaam}
                  onChange={(e) => setVoornaam(e.target.value)}
                  required
                />
              </label>

              <label>
                Achternaam
                <input
                  value={achternaam}
                  onChange={(e) => setAchternaam(e.target.value)}
                  required
                />
              </label>

              <label>
                Geboortedatum
                <input
                  type="date"
                  value={geboortedatum}
                  onChange={(e) => setGeboortedatum(e.target.value)}
                  required
                />
              </label>

              <label>
                Telefoon
                <input
                  type="tel"
                  value={telefoon}
                  onChange={(e) => setTelefoon(e.target.value)}
                />
              </label>

              <label className="jk-full-width">
                E-mail
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <label className="jk-full-width">
                Adres
                <input
                  value={adres}
                  onChange={(e) => setAdres(e.target.value)}
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
                onClick={() => navigate("/jongeren")}
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
