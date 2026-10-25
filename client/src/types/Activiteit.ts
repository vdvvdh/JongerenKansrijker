export interface Activiteit {
  id: number;
  naam: string;
  omschrijving: string | null;
  duur: string | null;
  locatie: string | null;
  pivot: {
    inschrijf_datum: string | null;
    resultaat: string;
  };
}