import type { DashboardData } from "../types/Dashboard";

/** Pad van de loginpagina sttat de login op "/login"? pas hier aan */
export const LOGIN_PAD = "/";
const API_URL = import.meta.env.VITE_API_URL ?? "";

export interface Gebruiker {
  id: number;
  name: string;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function getJson<T>(pad: string): Promise<T> {
  const response = await fetch(`${API_URL}${pad}`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new ApiError(response.status, "Laden mislukt.");
  return response.json();
}

export const getDashboard = () => getJson<DashboardData>("/api/dashboard");
export const getGebruiker = () => getJson<Gebruiker>("/api/user");

export async function logout(): Promise<void> {
  try {
    await fetch(`${API_URL}/api/logout`, { method: "POST", credentials: "include" });
  } catch {
    /* geen backend: toch doorsturen naar de login */
  }
}