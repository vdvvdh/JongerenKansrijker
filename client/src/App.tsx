import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";

import LoginPage from "./pages/auth/LoginPage";
import AppLayout from "./layout/AppLayout";
import Dashboard from "./pages/dashboard/Dashboard";

import JongerenOverzichtPage from "./pages/jongeren/JongerenOverzichtPage";
import JongereToevoegenPage from "./pages/jongeren/JongereToevoegenPage";
import JongereWijzigenPage from "./pages/jongeren/JongereWijzigenPage";
import JongereVerwijderenPage from "./pages/jongeren/JongereVerwijderenPage";

import ActiviteitenOverzichtPage from "./pages/dashboard/activiteiten/ActiviteitenOverzichtPage";
import InstituutOverzichtPage from "./pages/dashboard/instituut/InstituutOverzichtPage";
import MedewerkersOverzichtPage from "./pages/dashboard/medewerkers/MedewerkersOverzichtPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route element={<AppLayout />}>
          <Route path="/jongeren" element={<JongerenOverzichtPage />} />
          <Route path="/jongeren/toevoegen" element={<JongereToevoegenPage />} />
          <Route path="/jongeren/wijzigen" element={<JongereWijzigenPage />} />
          <Route path="/jongeren/verwijderen" element={<JongereVerwijderenPage />} />

          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="jongeren-overzicht" element={<JongerenOverzichtPage />} />
            <Route path="activiteiten" element={<ActiviteitenOverzichtPage />} />
            <Route path="instituut" element={<InstituutOverzichtPage />} />
            <Route path="medewerkers" element={<MedewerkersOverzichtPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
