import api from "../api";
import type { Medewerker, MedewerkerPayload } from "../types/Medewerker";

export async function getMedewerkers(): Promise<Medewerker[]> {
  const { data } = await api.get<Medewerker[]>("/api/medewerkers");
  return data;
}

export async function createMedewerker(
  payload: MedewerkerPayload,
): Promise<Medewerker> {
  const { data } = await api.post<Medewerker>("/api/medewerkers", payload);
  return data;
}

export async function updateMedewerker(
  id: number,
  payload: Partial<MedewerkerPayload>,
): Promise<Medewerker> {
  const { data } = await api.patch<Medewerker>(`/api/medewerkers/${id}`, payload);
  return data;
}

export async function deleteMedewerker(id: number): Promise<void> {
  await api.delete(`/api/medewerkers/${id}`);
}