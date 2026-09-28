## Opstarten

Backend (Laravel):
  cd server
  composer install
  copy .env.example .env
  php artisan key:generate
  (maak een lege MySQL-database en vul DB_DATABASE, DB_USERNAME en DB_PASSWORD in server\.env)
  php artisan migrate --seed
  php artisan serve

Frontend (React):
  cd client
  npm install
  npm run dev

Open daarna http://localhost:5173 (niet 127.0.0.1).
Testlogin: n.mulder@jongerenkansrijker.nl (wachtwoord: zie server/database/seeders/DatabaseSeeder.php)