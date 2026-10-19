import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import JongerenOverzichtPage from "../pages/jongeren/JongerenOverzichtPage";
import JongereToevoegenPage from "../pages/jongeren/JongereToevoegenPage";
import AppLayout from "../layout/AppLayout";
import JongereWijzigenPage from "../pages/jongeren/JongereWijzigenPage";
import JongereVerwijderenPage from "../pages/jongeren/JongereVerwijderenPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login has no sidebar */}
        <Route path="/" element={<LoginPage />} />

        {/* All pages inside this layout share one sidebar */}
        <Route element={<AppLayout />}>
          <Route
            path="/jongeren"
            element={<JongerenOverzichtPage />}
          />

          <Route
            path="/jongeren/toevoegen"
            element={<JongereToevoegenPage />}
          />
          <Route
            path="/jongeren/wijzigen"
            element={<JongereWijzigenPage />}
          />
          <Route
            path="/jongeren/verwijderen"
            element={<JongereVerwijderenPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
