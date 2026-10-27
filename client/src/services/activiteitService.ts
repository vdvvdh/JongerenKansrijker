import api from '../api';

export interface ActiviteitRecord {
  id: number;
  naam: string;
  omschrijving: string | null;
  adres: string | null;
  duur: string | null;
  jongeren_count?: number;
  jongeren?: JongereRecord[];
}

export interface ActiviteitInput {
  naam: string;
  omschrijving: string | null;
  adres: string | null;
  duur: string | null;
}

export interface JongereRecord {
  id: number;
  voornaam: string;
  achternaam: string;
}

interface JongerenApiResponse {
  ingeschreven: JongereRecord[];
  uitgeschreven: JongereRecord[];
}

export async function getActiviteiten(): Promise<ActiviteitRecord[]> {
  const { data } = await api.get<ActiviteitRecord[]>('/api/activiteiten');
  return data;
}

export async function getActiviteit(id: number): Promise<ActiviteitRecord> {
  const { data } = await api.get<ActiviteitRecord>(`/api/activiteiten/${id}`);
  return data;
}

export async function saveActiviteit(
  input: ActiviteitInput,
  id?: number,
): Promise<ActiviteitRecord> {
  const { data } = id
    ? await api.put<ActiviteitRecord>(`/api/activiteiten/${id}`, input)
    : await api.post<ActiviteitRecord>('/api/activiteiten', input);
  return data;
}

export async function deleteActiviteit(id: number): Promise<void> {
  await api.delete(`/api/activiteiten/${id}`);
}

export async function getJongeren(): Promise<JongereRecord[]> {
  const { data } = await api.get<JongerenApiResponse>('/api/jongeren');
  return [...data.ingeschreven, ...data.uitgeschreven];
}

export async function saveJongereKoppelingen(
  activiteitId: number,
  jongereIds: number[],
): Promise<ActiviteitRecord> {
  const { data } = await api.put<ActiviteitRecord>(
    `/api/activiteiten/${activiteitId}/jongeren`,
    { jongere_ids: jongereIds },
  );
  return data;
}
