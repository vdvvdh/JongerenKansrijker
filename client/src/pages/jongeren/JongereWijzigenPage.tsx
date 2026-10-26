import axios from "axios";
import { useEffect, useState, type FormEvent } from "react";
import "./JongereToevoegenPage.css";

type Jongere = {
  id: number;
  voornaam: string;
  achternaam: string;
  geboortedatum: string;
  email: string;
  telefoonnummer: string;
  adres: string;
};

export default function JongereWijzigenPage() {
  const [jongeren, setJongeren] = useState<Jongere[]>([]);
  const [geselecteerdId, setGeselecteerdId] = useState("");
  const [voornaam, setVoornaam] = useState("");
  const [achternaam, setAchternaam] = useState("");
  const [geboortedatum, setGeboortedatum] = useState("");
  const [email, setEmail] = useState("");
  const [telefoonnummer, setTelefoonnummer] = useState("");
  const [adres, setAdres] = useState("");
  const [melding, setMelding] = useState("");
  const [laden, setLaden] = useState(true);

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
        console.error(error);
        setMelding("De jongeren konden niet worden opgehaald.");
      } finally {
        setLaden(false);
      }
    }

    haalJongerenOp();
  }, []);

  function kiesJongere(id: string) {
    setGeselecteerdId(id);
    setMelding("");

    const jongere = jongeren.find(
      (item) => item.id === Number(id)
    );

    if (!jongere) {
      setVoornaam("");
      setAchternaam("");
      setGeboortedatum("");
      setEmail("");
      setTelefoonnummer("");
      setAdres("");
      return;
    }

    setVoornaam(jongere.voornaam);
    setAchternaam(jongere.achternaam);
    setGeboortedatum(jongere.geboortedatum?.slice(0, 10) ?? "");
    setEmail(jongere.email);
    setTelefoonnummer(jongere.telefoonnummer);
    setAdres(jongere.adres ?? "");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMelding("");

    if (!geselecteerdId) {
      setMelding("Selecteer eerst een jongere.");
      return;
    }

    try {
      
        await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
        withCredentials: true,
        withXSRFToken: true,
        });

        await axios.put(
        `http://localhost:8000/api/jongeren/${geselecteerdId}`,
        {
            voornaam,
            achternaam,
            geboortedatum,
            email,
            telefoonnummer,
            adres,
        },
        {
            withCredentials: true,
            withXSRFToken: true,
            headers: {
            Accept: "application/json",
            },
        }
        );

      setMelding("De gegevens zijn succesvol gewijzigd!");
    } catch (error) {
      console.error("Fout bij wijzigen:", error);

      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data;

        if (apiError?.errors) {
          setMelding(
            Object.values(apiError.errors).flat().join(" ")
          );
        } else if (apiError?.message) {
          setMelding(apiError.message);
        } else {
          setMelding("Wijzigen mislukt. Controleer de server.");
        }
      } else {
        setMelding("Er ging iets mis.");
      }
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
          <p>Er zijn nog geen jongeren om te wijzigen.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="jk-wijzigen-select">
              Selecteer een jongere
              <select
                value={geselecteerdId}
                onChange={(e) => kiesJongere(e.target.value)}
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
                  value={telefoonnummer}
                  onChange={(e) => setTelefoonnummer(e.target.value)}
                  required
                />
              </label>

              <label className="jk-full-width">
                E-mail
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label className="jk-full-width">
                Adres
                <input
                  value={adres}
                  onChange={(e) => setAdres(e.target.value)}
                  required
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
                onClick={() => kiesJongere("")}
              >
                Annuleren
              </button>

              <button
                type="submit"
                className="jk-button jk-button-save"
              >
                Wijzigingen opslaan
              </button>
            </div>
          </form>
        )}

        {melding && laden === false && jongeren.length === 0 && (
          <p className="jk-message" role="alert">{melding}</p>
        )}
      </section>
    </div>
  );
}
