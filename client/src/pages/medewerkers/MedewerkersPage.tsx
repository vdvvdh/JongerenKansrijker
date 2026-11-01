import axios from "axios";
import { useEffect, useState, type FormEvent } from "react";
import {
  createMedewerker,
  deleteMedewerker,
  getMedewerkers,
  updateMedewerker,
} from "../../services/medewerkerService";
import type { Medewerker, MedewerkerPayload } from "../../types/Medewerker";
import "./MedewerkersPage.css";

type FormValues = {
  voornaam: string;
  achternaam: string;
  functie: string;
  email: string;
  password: string;
  password_confirmation: string;
};

type FormErrors = Record<string, string[]>;

const emptyForm = (): FormValues => ({
  voornaam: "",
  achternaam: "",
  functie: "",
  email: "",
  password: "",
  password_confirmation: "",
});

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    if (error.response?.status === 401) {
      return "Je sessie is verlopen. Log opnieuw in.";
    }

    return error.response?.data?.message ?? fallback;
  }

  return fallback;
}

function getValidationErrors(error: unknown): FormErrors {
  if (axios.isAxiosError<{ errors?: FormErrors }>(error)) {
    return error.response?.data?.errors ?? {};
  }

  return {};
}

export default function MedewerkersPage() {
  const [medewerkers, setMedewerkers] = useState<Medewerker[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [notice, setNotice] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Medewerker | null>(null);
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<Medewerker | null>(null);

  useEffect(() => {
    async function loadMedewerkers() {
      try {
        setMedewerkers(await getMedewerkers());
      } catch (error) {
        setPageError(
          getErrorMessage(error, "De medewerkers konden niet worden opgehaald."),
        );
      } finally {
        setLoading(false);
      }
    }

    void loadMedewerkers();
  }, []);

  const filteredMedewerkers = medewerkers.filter((medewerker) => {
    const searchText = search.trim().toLocaleLowerCase();
    const fullName = `${medewerker.voornaam} ${medewerker.achternaam}`;

    return `${fullName} ${medewerker.functie ?? ""} ${medewerker.email}`
      .toLocaleLowerCase()
      .includes(searchText);
  });

  function openCreateDialog() {
    setEditing(null);
    setForm(emptyForm());
    setFormErrors({});
    setPageError("");
    setNotice("");
    setDialogOpen(true);
  }

  function openEditDialog(medewerker: Medewerker) {
    setEditing(medewerker);
    setForm({
      voornaam: medewerker.voornaam,
      achternaam: medewerker.achternaam,
      functie: medewerker.functie ?? "",
      email: medewerker.email,
      password: "",
      password_confirmation: "",
    });
    setFormErrors({});
    setPageError("");
    setNotice("");
    setDialogOpen(true);
  }

  function updateForm(field: keyof FormValues, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => ({ ...current, [field]: [] }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setPageError("");
    setFormErrors({});

    const payload: MedewerkerPayload = {
      voornaam: form.voornaam.trim(),
      achternaam: form.achternaam.trim(),
      functie: form.functie.trim() || null,
      email: form.email.trim(),
    };

    if (!editing || form.password) {
      payload.password = form.password;
      payload.password_confirmation = form.password_confirmation;
    }

    try {
      if (editing) {
        await updateMedewerker(editing.id, payload);
        setNotice("Medewerker bijgewerkt.");
      } else {
        await createMedewerker(payload);
        setNotice("Medewerker toegevoegd.");
      }

      setMedewerkers(await getMedewerkers());
      setDialogOpen(false);
    } catch (error) {
      setFormErrors(getValidationErrors(error));
      setPageError(
        getErrorMessage(error, "Opslaan is niet gelukt. Controleer de gegevens."),
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteCandidate) return;

    setDeleting(true);
    setPageError("");
    setNotice("");

    try {
      await deleteMedewerker(deleteCandidate.id);
      setMedewerkers((current) =>
        current.filter((medewerker) => medewerker.id !== deleteCandidate.id),
      );
      setNotice("Medewerker verwijderd.");
      setDeleteCandidate(null);
    } catch (error) {
      setPageError(getErrorMessage(error, "Verwijderen is niet gelukt."));
      setDeleteCandidate(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="jk-medewerkers">
      <header className="jk-medewerkers-header">
        <div>
          <h1>Medewerkers</h1>
          <p>{medewerkers.length} medewerkers</p>
        </div>
        <button
          className="jk-medewerkers-primary"
          type="button"
          onClick={openCreateDialog}
        >
          Medewerker toevoegen
        </button>
      </header>

      {pageError && (
        <p className="jk-medewerkers-message is-error" role="alert">
          {pageError}
        </p>
      )}
      {notice && (
        <p className="jk-medewerkers-message is-success" role="status">
          {notice}
        </p>
      )}

      <div className="jk-medewerkers-toolbar">
        <label htmlFor="medewerkers-search">Zoeken</label>
        <input
          id="medewerkers-search"
          type="search"
          placeholder="Naam, functie of e-mailadres"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <span>{filteredMedewerkers.length} resultaten</span>
      </div>

      <div className="jk-medewerkers-table-wrap">
        {loading ? (
          <p className="jk-medewerkers-empty" role="status">
            Medewerkers laden...
          </p>
        ) : filteredMedewerkers.length === 0 ? (
          <p className="jk-medewerkers-empty">
            {search
              ? "Geen medewerkers gevonden voor deze zoekopdracht."
              : "Er zijn nog geen medewerkers toegevoegd."}
          </p>
        ) : (
          <table className="jk-medewerkers-table">
            <thead>
              <tr>
                <th scope="col">Naam</th>
                <th scope="col">Functie</th>
                <th scope="col">E-mailadres</th>
                <th scope="col">Acties</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedewerkers.map((medewerker) => (
                <tr key={medewerker.id}>
                  <td>
                    <strong>
                      {medewerker.voornaam} {medewerker.achternaam}
                    </strong>
                  </td>
                  <td>{medewerker.functie || "—"}</td>
                  <td>{medewerker.email}</td>
                  <td>
                    <div className="jk-medewerkers-actions">
                      <button
                        type="button"
                        onClick={() => openEditDialog(medewerker)}
                      >
                        Bewerken
                      </button>
                      <button
                        className="is-danger"
                        type="button"
                        onClick={() => {
                          setPageError("");
                          setNotice("");
                          setDeleteCandidate(medewerker);
                        }}
                      >
                        Verwijderen
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {dialogOpen && (
        <div className="jk-medewerkers-overlay">
          <section
            aria-labelledby="medewerkers-dialog-title"
            aria-modal="true"
            className="jk-medewerkers-dialog"
            role="dialog"
          >
            <header className="jk-medewerkers-dialog-header">
              <div>
                <h2 id="medewerkers-dialog-title">
                  {editing ? "Medewerker wijzigen" : "Medewerker toevoegen"}
                </h2>
                <p>Vul de gegevens van de medewerker in.</p>
              </div>
              <button
                aria-label="Sluiten"
                className="jk-medewerkers-dialog-close"
                type="button"
                onClick={() => setDialogOpen(false)}
              >
                ×
              </button>
            </header>

            <form className="jk-medewerkers-form" onSubmit={handleSubmit}>
              <label>
                Voornaam
                <input
                  autoComplete="given-name"
                  maxLength={255}
                  required
                  value={form.voornaam}
                  onChange={(event) => updateForm("voornaam", event.target.value)}
                />
                {formErrors.voornaam?.[0] && (
                  <span className="jk-medewerkers-field-error">
                    {formErrors.voornaam[0]}
                  </span>
                )}
              </label>
              <label>
                Achternaam
                <input
                  autoComplete="family-name"
                  maxLength={255}
                  required
                  value={form.achternaam}
                  onChange={(event) => updateForm("achternaam", event.target.value)}
                />
                {formErrors.achternaam?.[0] && (
                  <span className="jk-medewerkers-field-error">
                    {formErrors.achternaam[0]}
                  </span>
                )}
              </label>
              <label>
                Functie
                <input
                  maxLength={255}
                  value={form.functie}
                  onChange={(event) => updateForm("functie", event.target.value)}
                />
                {formErrors.functie?.[0] && (
                  <span className="jk-medewerkers-field-error">
                    {formErrors.functie[0]}
                  </span>
                )}
              </label>
              <label>
                E-mailadres
                <input
                  autoComplete="email"
                  maxLength={255}
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => updateForm("email", event.target.value)}
                />
                {formErrors.email?.[0] && (
                  <span className="jk-medewerkers-field-error">
                    {formErrors.email[0]}
                  </span>
                )}
              </label>
              <label>
                {editing ? "Nieuw wachtwoord (optioneel)" : "Wachtwoord"}
                <input
                  autoComplete="new-password"
                  minLength={8}
                  required={!editing}
                  type="password"
                  value={form.password}
                  onChange={(event) => updateForm("password", event.target.value)}
                />
                {formErrors.password?.[0] && (
                  <span className="jk-medewerkers-field-error">
                    {formErrors.password[0]}
                  </span>
                )}
              </label>
              <label>
                Wachtwoord bevestigen
                <input
                  autoComplete="new-password"
                  minLength={8}
                  required={!editing || Boolean(form.password)}
                  type="password"
                  value={form.password_confirmation}
                  onChange={(event) =>
                    updateForm("password_confirmation", event.target.value)
                  }
                />
                {formErrors.password_confirmation?.[0] && (
                  <span className="jk-medewerkers-field-error">
                    {formErrors.password_confirmation[0]}
                  </span>
                )}
              </label>

              {pageError && (
                <p className="jk-medewerkers-form-error" role="alert">
                  {pageError}
                </p>
              )}

              <footer className="jk-medewerkers-dialog-actions">
                <button
                  className="jk-medewerkers-secondary"
                  type="button"
                  onClick={() => setDialogOpen(false)}
                >
                  Annuleren
                </button>
                <button
                  className="jk-medewerkers-primary"
                  disabled={saving}
                  type="submit"
                >
                  {saving ? "Opslaan..." : "Opslaan"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {deleteCandidate && (
        <div className="jk-medewerkers-overlay">
          <section
            aria-labelledby="medewerkers-delete-title"
            aria-modal="true"
            className="jk-medewerkers-dialog jk-medewerkers-confirm"
            role="alertdialog"
          >
            <h2 id="medewerkers-delete-title">Medewerker verwijderen?</h2>
            <p>
              {deleteCandidate.voornaam} {deleteCandidate.achternaam} wordt
              verwijderd. Deze actie kan niet ongedaan worden gemaakt.
            </p>
            <footer className="jk-medewerkers-dialog-actions">
              <button
                className="jk-medewerkers-secondary"
                disabled={deleting}
                type="button"
                onClick={() => setDeleteCandidate(null)}
              >
                Annuleren
              </button>
              <button
                className="jk-medewerkers-danger"
                disabled={deleting}
                type="button"
                onClick={() => void handleDelete()}
              >
                {deleting ? "Verwijderen..." : "Verwijderen"}
              </button>
            </footer>
          </section>
        </div>
      )}
    </section>
  );
}