import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import JongerenOverzichtPage from "../pages/jongeren/JongerenOverzichtPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/jongeren" element={<JongerenOverzichtPage />} />
      </Routes>
    </BrowserRouter>
  );
}