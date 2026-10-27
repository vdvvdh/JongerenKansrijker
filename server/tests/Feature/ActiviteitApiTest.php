<?php

namespace Tests\Feature;

use App\Models\Activiteit;
use App\Models\Instituut;
use App\Models\Jongere;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ActiviteitApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_activity_api_requires_authentication(): void
    {
        $this->getJson('/api/activiteiten')->assertUnauthorized();
    }

    public function test_authenticated_user_can_manage_activities(): void
    {
        $this->actingAs($this->makeUser());

        $activityId = $this->postJson('/api/activiteiten', [
            'naam' => 'Sollicitatietraining',
            'omschrijving' => 'Oefenen met solliciteren',
            'duur' => '4 weken',
        ])->assertCreated()->json('id');

        $this->getJson('/api/activiteiten')
            ->assertOk()
            ->assertJsonPath('0.naam', 'Sollicitatietraining')
            ->assertJsonPath('0.jongeren_count', 0);

        $this->putJson("/api/activiteiten/{$activityId}", [
            'naam' => 'Training bijgewerkt',
        ])->assertOk()->assertJsonPath('naam', 'Training bijgewerkt');

        $this->deleteJson("/api/activiteiten/{$activityId}")
            ->assertOk()
            ->assertJsonPath('message', 'Activiteit verwijderd.');

        $this->assertDatabaseMissing('activiteiten', ['id' => $activityId]);
    }

    public function test_authenticated_user_can_assign_young_people_to_an_activity(): void
    {
        $this->actingAs($this->makeUser());
        $activity = Activiteit::create(['naam' => 'Kookworkshop']);
        $youngPerson = Jongere::create([
            'voornaam' => 'Sara',
            'achternaam' => 'Bakker',
            'geboortedatum' => '2007-05-14',
        ]);

        $this->putJson("/api/activiteiten/{$activity->id}/jongeren", [
            'jongere_ids' => [$youngPerson->id],
        ])->assertOk()->assertJsonPath('jongeren.0.id', $youngPerson->id);

        $this->assertDatabaseHas('jongere_activiteit', [
            'activiteit_id' => $activity->id,
            'jongere_id' => $youngPerson->id,
        ]);
    }

    public function test_youth_overview_includes_activities_for_placed_young_people(): void
    {
        $institute = Instituut::create(['naam' => 'Leerwerkbedrijf']);
        $activity = Activiteit::create(['naam' => 'Timmerworkshop']);
        $youngPerson = Jongere::create([
            'voornaam' => 'Sam',
            'achternaam' => 'Jansen',
            'geboortedatum' => '2007-04-12',
            'instituut_id' => $institute->id,
            'uitgeplaatst_op' => '2026-10-20',
        ]);
        $youngPerson->activiteiten()->attach($activity->id);

        $this->getJson('/api/jongeren')
            ->assertOk()
            ->assertJsonPath('uitgeschreven.0.activiteiten.0.id', $activity->id);
    }

    private function makeUser(): User
    {
        return User::create([
            'voornaam' => 'Test',
            'achternaam' => 'Medewerker',
            'email' => 'test@example.test',
            'password' => 'password123',
        ]);
    }
}
