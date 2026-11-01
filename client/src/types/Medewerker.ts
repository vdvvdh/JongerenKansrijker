export interface Medewerker {
  id: number;
  voornaam: string;
  achternaam: string;
  functie: string | null;
  email: string;
}

export interface MedewerkerPayload {
  voornaam: string;
  achternaam: string;
  functie: string | null;
  email: string;
  password?: string;
  password_confirmation?: string;
}