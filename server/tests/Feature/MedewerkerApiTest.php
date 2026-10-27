<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class MedewerkerApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_medewerker_management(): void
    {
        $this->getJson('/api/medewerkers')->assertUnauthorized();
    }

    public function test_authenticated_users_can_list_medewerkers_without_passwords(): void
    {
        $admin = $this->createMedewerker('admin@example.test');
        $this->createMedewerker('colleague@example.test', ['achternaam' => 'Bakker']);

        $this->actingAs($admin)
            ->getJson('/api/medewerkers')
            ->assertOk()
            ->assertJsonCount(2)
            ->assertJsonPath('0.email', 'colleague@example.test')
            ->assertJsonMissingPath('0.password');
    }

    public function test_authenticated_users_can_create_medewerkers(): void
    {
        $admin = $this->createMedewerker('admin@example.test');

        $this->actingAs($admin)
            ->postJson('/api/medewerkers', [
                'voornaam' => 'Sam',
                'achternaam' => 'Jansen',
                'functie' => 'Administratief medewerker',
                'email' => 'sam@example.test',
                'password' => 'SterkWachtwoord1',
                'password_confirmation' => 'SterkWachtwoord1',
            ])
            ->assertCreated()
            ->assertJsonPath('email', 'sam@example.test')
            ->assertJsonMissingPath('password');

        $created = User::where('email', 'sam@example.test')->firstOrFail();
        $this->assertTrue(Hash::check('SterkWachtwoord1', $created->password));
    }

    public function test_authenticated_users_can_update_medewerkers(): void
    {
        $admin = $this->createMedewerker('admin@example.test');
        $medewerker = $this->createMedewerker('old@example.test');

        $this->actingAs($admin)
            ->patchJson("/api/medewerkers/{$medewerker->id}", [
                'voornaam' => 'Noor',
                'email' => 'noor@example.test',
            ])
            ->assertOk()
            ->assertJsonPath('voornaam', 'Noor')
            ->assertJsonPath('email', 'noor@example.test');

        $this->assertDatabaseHas('users', [
            'id' => $medewerker->id,
            'email' => 'noor@example.test',
        ]);
    }

    public function test_authenticated_users_can_delete_medewerkers(): void
    {
        $admin = $this->createMedewerker('admin@example.test');
        $medewerker = $this->createMedewerker('remove@example.test');

        $this->actingAs($admin)
            ->deleteJson("/api/medewerkers/{$medewerker->id}")
            ->assertOk()
            ->assertJsonPath('message', 'Medewerker verwijderd');

        $this->assertDatabaseMissing('users', ['id' => $medewerker->id]);
    }

    private function createMedewerker(string $email, array $attributes = []): User
    {
        return User::create(array_merge([
            'voornaam' => 'Alex',
            'achternaam' => 'Medewerker',
            'functie' => 'Administratief medewerker',
            'email' => $email,
            'password' => 'Wachtwoord123!',
        ], $attributes));
    }
}