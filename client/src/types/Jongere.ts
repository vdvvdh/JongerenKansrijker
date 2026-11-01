import type { Activiteit } from "./Activiteit";
import type { Instituut } from "./Instituut";

export interface Jongere {
  id?: number;
  voornaam: string;
  achternaam: string;
  geboortedatum: string;
  email: string | null;
  telefoon?: string | null;
  telefoonnummer?: string;
  adres?: string;
  instituut_id?: number | null;
  uitgeplaatst_op?: string | null;
  activiteiten?: Activiteit[];
  instituut?: Instituut;
}

export interface JongerenOverzicht {
  ingeschreven: Jongere[];
  uitgeschreven: Jongere[];
}