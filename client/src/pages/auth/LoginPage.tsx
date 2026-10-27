import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { login } from "../../services/authService";
import logo from "../../assets/logo.svg";

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
    <>
      <header className="navbar">
        <img src={logo} alt="" className="navbar-logo" />
      </header>
      <div className="login-page">
        <div className="login-wrapper">
          <div className="green-background"></div>

          <div className="login-container">
            <div className="header">
              <h2>Welkom terug</h2>
              <p>Vul uw gegevens in</p>
            </div>

            <div className="form">
              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  name="email"
                  autoComplete="username"
                  value={email}
                  onChange={handleChangeEmail}
                  placeholder="Email"
                />

                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={handleChangePassword}
                  placeholder="Wachtwoord"
                />

                {error && <p>{error}</p>}
                <button type="submit">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
