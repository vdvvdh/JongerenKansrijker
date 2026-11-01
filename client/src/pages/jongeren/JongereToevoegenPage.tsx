import axios from "../../axios";
import { useState, type FormEvent } from "react";
import "./JongereToevoegenPage.css";

export default function JongereToevoegenPage() {
  const [voornaam, setVoornaam] = useState("");
  const [achternaam, setAchternaam] = useState("");
  const [geboortedatum, setGeboortedatum] = useState("");
  const [email, setEmail] = useState("");
  const [telefoonnummer, setTelefoonnummer] = useState("");
  const [adres, setAdres] = useState("");
  const [melding, setMelding] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMelding("");

    try {
      await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
        withCredentials: true,
        withXSRFToken: true,
      });

      await axios.post(
        "http://localhost:8000/api/jongeren",
        {
          voornaam,
          achternaam,
          geboortedatum,
          email,
          telefoon: telefoonnummer,
        },
        {
          withCredentials: true,
          withXSRFToken: true,
          headers: {
            Accept: "application/json",
          },
        },
      );

      setMelding("Jongere succesvol toegevoegd!");

      setVoornaam("");
      setAchternaam("");
      setGeboortedatum("");
      setEmail("");
      setTelefoonnummer("");
      setAdres("");
    } catch (error) {
      console.error("Fout bij opslaan:", error);

      if (axios.isAxiosError(error)) {
        console.error("API response:", error.response?.data);

        const apiError = error.response?.data;
        const validationErrors = apiError?.errors;

        if (validationErrors) {
          setMelding(Object.values(validationErrors).flat().join(" "));
        } else if (apiError?.message) {
          setMelding(apiError.message);
        } else {
          setMelding(
            `Opslaan mislukt. Status: ${
              error.response?.status ?? "geen antwoord van de server"
            }.`,
          );
        }
      } else {
        setMelding("Er ging iets mis. Controleer de console.");
      }
    }
  }

  function handleCancel() {
    setVoornaam("");
    setAchternaam("");
    setGeboortedatum("");
    setEmail("");
    setTelefoonnummer("");
    setAdres("");
    setMelding("");
  }

  return (
    <div className="jk-card-wrapper">
      <div className="jk-green-shadow" />

      <section className="jk-card">
        <h1>Jongere toevoegen</h1>

        <form onSubmit={handleSubmit}>
          <div className="jk-form-grid">
            <label>
              Voornaam
              <input
                type="text"
                placeholder="Voornaam"
                value={voornaam}
                onChange={(e) => setVoornaam(e.target.value)}
                required
              />
            </label>

            <label>
              Achternaam
              <input
                type="text"
                placeholder="Achternaam"
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
            <label className="jk-full-width">
              Adres
              <input
                type="text"
                placeholder="Straatnaam en huisnummer"
                value={adres}
                onChange={(e) => setAdres(e.target.value)}
                required
              />
            </label>
            <label>
              Telefoon
              <input
                type="tel"
                placeholder="Telefoonnummer"
                value={telefoonnummer}
                onChange={(e) => setTelefoonnummer(e.target.value)}
                required
              />
            </label>

            <label className="jk-full-width">
              E-mail
              <input
                type="email"
                placeholder="naam@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              className="jk-button jk-button-cancel"
              type="button"
              onClick={handleCancel}
            >
              Annuleren
            </button>

            <button className="jk-button jk-button-save" type="submit">
              Opslaan
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
