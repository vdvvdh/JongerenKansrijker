export interface RecenteJongere {
  id: number;
  voornaam: string;
  achternaam: string;
  status: "actief" | "uitgeplaatst";
  inschrijfdatum: string;
}
export interface InstroomPerMaand {
  maand: string;
  label: string;
  aantal: number;
}
export interface DashboardData {
  actief: number;
  uitgeplaatst: number;
  totaal: number;
  zonder_recente_activiteit: number;
  activiteiten: number;
  instituten: number;
  instroom: InstroomPerMaand[];
  recent: RecenteJongere[];
}