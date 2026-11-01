import api from '../api';
import type { Medewerker } from '../types/Medewerker';

export async function login(email: string, password: string): Promise<Medewerker> {
  await api.get('/sanctum/csrf-cookie'); // altijd eerst
  const { data } = await api.post<Medewerker>('/login', { email, password });
  return data;
}

export async function logout(): Promise<void> {
  await api.post('/logout');
}

export async function getCurrentUser(): Promise<Medewerker> {
  const { data } = await api.get<Medewerker>('/api/user');
  return data;
}