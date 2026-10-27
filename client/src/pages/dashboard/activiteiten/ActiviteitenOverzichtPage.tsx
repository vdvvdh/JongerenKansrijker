import { useEffect, useState, type FormEvent } from 'react';
import {
  deleteActiviteit,
  getActiviteit,
  getActiviteiten,
  getJongeren,
  saveActiviteit,
  saveJongereKoppelingen,
  type ActiviteitInput,
  type ActiviteitRecord,
  type JongereRecord,
} from '../../../services/activiteitService';
import './ActiviteitenOverzichtPage.css';

const emptyActivity: ActiviteitInput = {
  naam: '',
  omschrijving: null,
  adres: null,
  duur: null,
};

export default function ActiviteitenOverzichtPage() {
  const [activiteiten, setActiviteiten] = useState<ActiviteitRecord[]>([]);
  const [jongeren, setJongeren] = useState<JongereRecord[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ActiviteitInput>(emptyActivity);
  const [assignmentActivity, setAssignmentActivity] = useState<ActiviteitRecord | null>(null);
  const [assignedYouthIds, setAssignedYouthIds] = useState<number[]>([]);
  const [selectedYouthId, setSelectedYouthId] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    Promise.all([getActiviteiten(), getJongeren()])
      .then(([activityData, youthData]) => {
        if (!active) return;
        setActiviteiten(activityData);
        setJongeren(youthData);
        setError('');
      })
      .catch(() => {
        if (active) setError('Activiteiten konden niet worden opgehaald. Controleer of je bent ingelogd.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [refreshKey]);

  const visibleActivities = activiteiten.filter((activity) => {
    const searchable = `${activity.naam} ${activity.omschrijving ?? ''} ${activity.adres ?? ''}`;
    return searchable.toLowerCase().includes(search.trim().toLowerCase());
  });
  const selectedYouth = jongeren.find((youth) => youth.id === Number(selectedYouthId));

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyActivity);
    setFormOpen(true);
    setError('');
  }

  function openEditForm(activity: ActiviteitRecord) {
    setEditingId(activity.id);
    setForm({
      naam: activity.naam,
      omschrijving: activity.omschrijving,
      adres: activity.adres,
      duur: activity.duur,
    });
    setFormOpen(true);
    setError('');
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      await saveActiviteit(form, editingId ?? undefined);
      setFormOpen(false);
      setRefreshKey((key) => key + 1);
      setMessage(editingId ? 'Activiteit bijgewerkt.' : 'Activiteit toegevoegd.');
    } catch {
      setError('Opslaan is mislukt. Controleer de ingevulde gegevens.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(activity: ActiviteitRecord) {
    if (!window.confirm(`Weet je zeker dat je ${activity.naam} wilt verwijderen?`)) return;

    setError('');
    try {
      await deleteActiviteit(activity.id);
      setRefreshKey((key) => key + 1);
      setMessage('Activiteit verwijderd.');
    } catch {
      setError('Verwijderen is mislukt. Probeer het opnieuw.');
    }
  }

  async function openAssignment(activity: ActiviteitRecord) {
    setAssignmentActivity(activity);
    setAssignedYouthIds([]);
    setError('');

    try {
      const details = await getActiviteit(activity.id);
      setAssignedYouthIds(details.jongeren?.map((youth) => youth.id) ?? []);
    } catch {
      setAssignmentActivity(null);
      setError('De huidige koppelingen konden niet worden opgehaald.');
    }
  }

  async function handleSaveAssignments(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!assignmentActivity) return;

    setSaving(true);
    setError('');
    try {
      await saveJongereKoppelingen(assignmentActivity.id, assignedYouthIds);
      setAssignmentActivity(null);
      setRefreshKey((key) => key + 1);
      setMessage('Jongerenkoppelingen opgeslagen.');
    } catch {
      setError('De jongerenkoppelingen konden niet worden opgeslagen.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="jk-activities">
      <header className="jk-activities-header">
        <div>
          <h1>Activiteiten</h1>
          <p>{activiteiten.length} activiteiten</p>
        </div>
        <button className="jk-activities-primary" type="button" onClick={openCreateForm}>
          Activiteit toevoegen
        </button>
      </header>

      <label className="jk-activities-search">
        Zoek activiteit
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Naam, omschrijving of adres"
        />
      </label>

      {message && <p className="jk-activities-message" role="status">{message}</p>}
      {error && <p className="jk-activities-error" role="alert">{error}</p>}

      <div className="jk-activities-table-wrap">
        {loading ? (
          <p className="jk-activities-empty" role="status">Activiteiten laden...</p>
        ) : visibleActivities.length === 0 ? (
          <p className="jk-activities-empty">
            {search ? 'Geen activiteiten gevonden.' : 'Er zijn nog geen activiteiten.'}
          </p>
        ) : (
          <div className="jk-activities-scroll">
            <table className="jk-activities-table">
              <thead>
                <tr>
                  <th>Naam</th>
                  <th>Omschrijving</th>
                  <th>Adres</th>
                  <th>Duur</th>
                  <th>Jongeren</th>
                  <th>Acties</th>
                </tr>
              </thead>
              <tbody>
                {visibleActivities.map((activity) => (
                  <tr key={activity.id}>
                    <td>{activity.naam}</td>
                    <td>{activity.omschrijving || '—'}</td>
                    <td>{activity.adres || '—'}</td>
                    <td>{activity.duur || '—'}</td>
                    <td>{activity.jongeren_count ?? 0}</td>
                    <td>
                      <div className="jk-activities-actions">
                        <button type="button" onClick={() => void openAssignment(activity)}>Jongeren koppelen</button>
                        <button type="button" onClick={() => openEditForm(activity)}>Wijzigen</button>
                        <button type="button" onClick={() => void handleDelete(activity)}>Verwijderen</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <section className="jk-youth-activity-overview" aria-labelledby="youth-activities-title">
        <h2 id="youth-activities-title">Activiteiten per jongere</h2>
        <label className="jk-activities-search">
          Selecteer jongere
          <select value={selectedYouthId} onChange={(event) => setSelectedYouthId(event.target.value)}>
            <option value="">Kies een jongere</option>
            {jongeren.map((youth) => (
              <option key={youth.id} value={youth.id}>
                {youth.voornaam} {youth.achternaam}
              </option>
            ))}
          </select>
        </label>

        {selectedYouth && (selectedYouth.activiteiten?.length ? (
          <div className="jk-activities-table-wrap">
            <div className="jk-activities-scroll">
              <table className="jk-activities-table">
                <thead>
                  <tr><th>Activiteit</th><th>Inschrijfdatum</th><th>Resultaat</th></tr>
                </thead>
                <tbody>
                  {selectedYouth.activiteiten.map((activity) => (
                    <tr key={activity.id}>
                      <td>{activity.naam}</td>
                      <td>{activity.pivot.inschrijf_datum ?? '—'}</td>
                      <td>{activity.pivot.resultaat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="jk-activities-empty">Deze jongere heeft nog geen activiteiten.</p>
        ))}
      </section>

      {formOpen && (
        <div className="jk-activities-overlay">
          <section className="jk-activities-dialog" role="dialog" aria-modal="true" aria-labelledby="activity-form-title">
            <h2 id="activity-form-title">{editingId ? 'Activiteit wijzigen' : 'Activiteit toevoegen'}</h2>
            <form onSubmit={handleSave}>
              <label>
                Naam
                <input required maxLength={255} value={form.naam} onChange={(event) => setForm({ ...form, naam: event.target.value })} />
              </label>
              <label>
                Omschrijving
                <textarea value={form.omschrijving ?? ''} onChange={(event) => setForm({ ...form, omschrijving: event.target.value || null })} />
              </label>
              <label>
                Adres
                <input maxLength={255} value={form.adres ?? ''} onChange={(event) => setForm({ ...form, adres: event.target.value || null })} />
              </label>
              <label>
                Duur
                <input maxLength={255} value={form.duur ?? ''} onChange={(event) => setForm({ ...form, duur: event.target.value || null })} />
              </label>
              <div className="jk-activities-dialog-actions">
                <button type="button" onClick={() => setFormOpen(false)} disabled={saving}>Annuleren</button>
                <button className="jk-activities-primary" type="submit" disabled={saving}>
                  {saving ? 'Opslaan...' : 'Opslaan'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {assignmentActivity && (
        <div className="jk-activities-overlay">
          <section className="jk-activities-dialog" role="dialog" aria-modal="true" aria-labelledby="activity-assignment-title">
            <h2 id="activity-assignment-title">Jongeren koppelen: {assignmentActivity.naam}</h2>
            <form onSubmit={handleSaveAssignments}>
              <fieldset className="jk-activities-youth-list">
                <legend>Selecteer jongeren</legend>
                {jongeren.length === 0 ? <p>Er zijn geen jongeren beschikbaar.</p> : jongeren.map((youth) => (
                  <label key={youth.id}>
                    <input
                      type="checkbox"
                      checked={assignedYouthIds.includes(youth.id)}
                      onChange={(event) => setAssignedYouthIds((current) => event.target.checked
                        ? [...current, youth.id]
                        : current.filter((id) => id !== youth.id))}
                    />
                    {youth.voornaam} {youth.achternaam}
                  </label>
                ))}
              </fieldset>
              <div className="jk-activities-dialog-actions">
                <button type="button" onClick={() => setAssignmentActivity(null)} disabled={saving}>Annuleren</button>
                <button className="jk-activities-primary" type="submit" disabled={saving || jongeren.length === 0}>
                  {saving ? 'Opslaan...' : 'Koppelingen opslaan'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}