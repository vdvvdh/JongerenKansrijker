export default function LoginPage() {
  return (
    <div>
      <h1>Inloggen</h1>
      <form>
        <label>
          Gebruikersnaam
          <input type="text" name="username" />
        </label>
        <label>
          Wachtwoord
          <input type="password" name="password" />
        </label>
        <button type="submit">Inloggen</button>
      </form>
    </div>
  );
}