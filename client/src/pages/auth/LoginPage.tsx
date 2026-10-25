import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { login } from "../../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate("/dashboard/jongeren-overzicht");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 422) {
        setError(err.response.data.message ?? "Inloggen mislukt");
      } else {
        setError("Er ging iets mis. Probeer het later opnieuw.");
      }
    }
  };

  return (
    <div>
      <h1>Inloggen</h1>
      <form onSubmit={handleSubmit}>
        <label>
          E-mailadres
          <input
            type="email"
            name="email"
            autoComplete="username"
            value={email}
            onChange={handleChangeEmail}
          />
        </label>
        <label>
          Wachtwoord
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={handleChangePassword}
          />
        </label>
        {error && <p>{error}</p>}
        <button type="submit">Inloggen</button>
      </form>
    </div>
  );
}
