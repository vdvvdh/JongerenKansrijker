import { Router } from "express";

const router = Router();
const MAANDEN = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

/** Laatste 6 maanden, oudste eerst. TODO: aantallen uit de database halen. */
function instroomPerMaand() {
  const voorbeeld = [3, 5, 2, 6, 4, 7];
  const nu = new Date();
  return voorbeeld.map((aantal, i) => {
    const d = new Date(nu.getFullYear(), nu.getMonth() - (voorbeeld.length - 1 - i), 1);
    const maand = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return { maand, label: `${MAANDEN[d.getMonth()]} ${d.getFullYear()}`, aantal };
  });
}

// TODO: vervang de voorbeeldwaarden door queries op de tabel jongeren (TO hoofdstuk 6).
router.get("/", (_req, res) => {
  const actief = 18;
  const uitgeplaatst = 7;
  res.json({
    actief,
    uitgeplaatst,
    totaal: actief + uitgeplaatst,
    zonder_recente_activiteit: 4,
    activiteiten: 6,
    instituten: 5,
    instroom: instroomPerMaand(),
    recent: [
      { id: 1, voornaam: "Sam", achternaam: "de Vries", status: "actief", inschrijfdatum: "2026-09-25" },
      { id: 2, voornaam: "Noor", achternaam: "Bakker", status: "actief", inschrijfdatum: "2026-09-18" },
      { id: 3, voornaam: "Yassin", achternaam: "El Amrani", status: "uitgeplaatst", inschrijfdatum: "2026-09-02" },
    ],
  });
});

export default router;