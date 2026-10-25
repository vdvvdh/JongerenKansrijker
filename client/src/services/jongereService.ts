import api from '../api';
import type { JongerenOverzicht } from '../types/Jongere';

export async function getJongerenOverzicht(): Promise<JongerenOverzicht> {
  const { data } = await api.get<JongerenOverzicht>('/api/jongeren');
  return data;
}