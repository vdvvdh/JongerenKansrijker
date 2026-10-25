import { BrowserRouter, Route, Routes } from "react-router";
import LoginPage from "./pages/auth/LoginPage";
import JongerenOverzichtPage from "./pages/dashboard/jongeren/JongerenOverzichtPage";
import Dashboard from "./pages/dashboard/Dashboard";
import ActiviteitenOverzichtPage from "./pages/dashboard/activiteiten/ActiviteitenOverzichtPage";
import InstituutOverzichtPage from "./pages/dashboard/instituut/InstituutOverzichtPage";
import MedewerkersOverzichtPage from "./pages/dashboard/medewerkers/MedewerkersOverzichtPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LoginPage />} />

        <Route path="dashboard" element={<Dashboard />}>
          <Route path="jongeren-overzicht" element={<JongerenOverzichtPage />} />
          <Route path="activiteiten" element={<ActiviteitenOverzichtPage/>} />
          <Route path="instituut" element={<InstituutOverzichtPage/>}/>
          <Route path="medewerkers" element={<MedewerkersOverzichtPage/>}/>
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
