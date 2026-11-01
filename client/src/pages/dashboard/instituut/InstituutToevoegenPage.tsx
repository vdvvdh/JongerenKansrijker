import axios from "../../../axios";
import { isAxiosError } from "axios";
import { useState } from "react";
import type { SubmitEvent } from "react";
import "../../jongeren/JongereToevoegenPage.css";

export default function InstituutToevoegenPage() {
  const [naam, setNaam] = useState("");
  const [contactpersoon, setContactpersoon] = useState("");
  const [adres, setAdres] = useState("");
  const [omschrijving, setOmschrijving] = useState("");
  const [melding, setMelding] = useState("");
  const [opslaan, setOpslaan] = useState(false);

  function leegFormulier() {
    setNaam("");
    setContactpersoon("");
    setAdres("");
    setOmschrijving("");
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setMelding("");
    setOpslaan(true);

    try {
      await axios.post(
        "http://localhost:8000/api/instituten",
        { naam, contactpersoon, adres, omschrijving },
        {
          withCredentials: true,
          withXSRFToken: true,
          headers: { Accept: "application/json" },
        },
      );

      setMelding("Instituut succesvol toegevoegd!");
      leegFormulier();
    } catch (error) {
      console.error("Fout bij opslaan:", error);

      if (isAxiosError(error)) {
        const apiError = error.response?.data;

        if (apiError?.errors) {
          setMelding(Object.values(apiError.errors).flat().join(" "));
        } else {
          setMelding(
            apiError?.message ??
              `Opslaan mislukt. Status: ${
                error.response?.status ?? "geen antwoord van de server"
              }.`,
          );
        }
      } else {
        setMelding("Er ging iets mis. Controleer de console.");
      }
    } finally {
      setOpslaan(false);
    }
  }

  function handleCancel() {
    leegFormulier();
    setMelding("");
  }

  return (
    <div className="jk-card-wrapper">
      <div className="jk-green-shadow" />

      <section className="jk-card">
        <h1>Instituut toevoegen</h1>

        <form onSubmit={handleSubmit}>
          <div className="jk-form-grid">
            <label>
              Naam
              <input
                type="text"
                placeholder="Naam van het instituut"
                value={naam}
                onChange={(e) => setNaam(e.target.value)}
                required
              />
            </label>

            <label>
              Contactpersoon
              <input
                type="text"
                placeholder="Contactpersoon"
                value={contactpersoon}
                onChange={(e) => setContactpersoon(e.target.value)}
              />
            </label>

            <label className="jk-full-width">
              Adres
              <input
                type="text"
                placeholder="Straatnaam, huisnummer en plaats"
                value={adres}
                onChange={(e) => setAdres(e.target.value)}
              />
            </label>

            <label className="jk-full-width">
              Omschrijving
              <input
                type="text"
                placeholder="Korte omschrijving"
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
              className="jk-button jk-button-cancel"
              type="button"
              onClick={handleCancel}
            >
              Annuleren
            </button>

            <button
              className="jk-button jk-button-save"
              type="submit"
              disabled={opslaan}
            >
              {opslaan ? "Opslaan..." : "Opslaan"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}