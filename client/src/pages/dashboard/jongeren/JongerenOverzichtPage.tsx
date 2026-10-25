import { useEffect, useState } from 'react';
import { getJongerenOverzicht } from '../../../services/jongereService';
import type { JongerenOverzicht } from '../../../types/Jongere';

export default function JongerenOverzichtPage() {
  const [overzicht, setOverzicht] = useState<JongerenOverzicht | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getJongerenOverzicht()
      .then(setOverzicht)
      .catch(() => setError('Kon jongeren niet ophalen.'));
  }, []);

  if (error) return <p>{error}</p>;
  if (!overzicht) return <p>Laden...</p>;

  return (
    <div>
      <h1>Jongeren</h1>

      <section>
        <h2>Ingeschreven</h2>
        <table>
          <thead>
            <tr>
              <th>Naam</th>
              <th>Activiteit</th>
              <th>Inschrijfdatum</th>
            </tr>
          </thead>
          <tbody>
            {overzicht.ingeschreven.map((jongere) => (
              <tr key={jongere.id}>
                <td>{jongere.voornaam} {jongere.achternaam}</td>
                <td>{jongere.activiteiten?.[0]?.naam ?? '-'}</td>
                <td>{jongere.activiteiten?.[0]?.pivot.inschrijf_datum ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Uitgeschreven</h2>
        <table>
          <thead>
            <tr>
              <th>Naam</th>
              <th>Instituut</th>
              <th>Uitgeplaatst op</th>
            </tr>
          </thead>
          <tbody>
            {overzicht.uitgeschreven.map((jongere) => (
              <tr key={jongere.id}>
                <td>{jongere.voornaam} {jongere.achternaam}</td>
                <td>{jongere.instituut?.naam ?? '-'}</td>
                <td>{jongere.uitgeplaatst_op ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}