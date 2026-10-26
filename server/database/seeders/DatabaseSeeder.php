<?php

namespace Database\Seeders;

use App\Models\Activiteit;
use App\Models\Instituut;
use App\Models\Jongere;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
       User::updateOrCreate(
        ['email' => 'n.mulder@jongerenkansrijker.nl'],
        [
            'voornaam' => 'Nienke',
            'achternaam' => 'Mulder',
            'functie' => 'Administratief medewerker',
            'password' => Hash::make('Welkom123!'),
        ]
        );

         // Instituten
        $bakkerij = Instituut::create([
            'naam' => 'Bakkerij De Korenaar',
            'omschrijving' => 'Ambachtelijke bakkerij in het centrum van Almere',
            'adres' => 'Marktstraat 12, Almere',
            'contactpersoon' => 'R. Jonker',
        ]);

        $bouwbedrijf = Instituut::create([
            'naam' => 'Bouwbedrijf Visser',
            'omschrijving' => 'Bouwbedrijf gericht op woningrenovatie',
            'adres' => 'Havenweg 4, Almere',
            'contactpersoon' => 'T. Visser',
        ]);

        $roc = Instituut::create([
            'naam' => 'ROC Flevoland',
            'omschrijving' => 'MBO-opleidingen in de regio Flevoland',
            'adres' => 'Schoolplein 1, Almere',
            'contactpersoon' => 'M. Post',
        ]);

        Instituut::create([
            'naam' => 'Zorgcentrum De Meerpaal',
            'omschrijving' => 'Zorginstelling voor ouderenzorg',
            'adres' => 'Zorglaan 8, Almere',
            'contactpersoon' => 'S. Hendriks',
        ]);

        Instituut::create([
            'naam' => 'Kappersalon Style',
            'omschrijving' => 'Kapperszaak met leerwerkplekken',
            'adres' => 'Winkelcentrum 22, Almere',
            'contactpersoon' => 'A. Öztürk',
        ]);

        // Activiteiten
        $sollicitatietraining = Activiteit::create([
            'naam' => 'Sollicitatietraining',
            'omschrijving' => 'Leren solliciteren en cv maken',
            'duur' => '4 weken',
            'adres' => 'Almere Centrum',
        ]);

        $timmerworkshop = Activiteit::create([
            'naam' => 'Timmerworkshop',
            'omschrijving' => 'Basisvaardigheden hout bewerken',
            'duur' => '6 weken',
            'adres' => 'Werkplaats Almere Buiten',
        ]);

        $kookworkshop = Activiteit::create([
            'naam' => 'Kookworkshop',
            'omschrijving' => 'Basis koken en hygiëne in de keuken',
            'duur' => '4 weken',
            'adres' => 'Almere Buiten',
        ]);

        Activiteit::create([
            'naam' => 'Bijles rekenen',
            'omschrijving' => 'Extra hulp voor het mbo-examen',
            'duur' => '8 weken',
            'adres' => 'Almere Haven',
        ]);

        Activiteit::create([
            'naam' => 'Weerbaarheidstraining',
            'omschrijving' => 'Zelfvertrouwen en communicatie',
            'duur' => '5 weken',
            'adres' => 'Almere Stad',
        ]);

        // Jongeren die nog een activiteit volgen (ingeschreven-tab)
        $sara = Jongere::create([
            'voornaam' => 'Sara',
            'achternaam' => 'Bakker',
            'geboortedatum' => '2007-05-14',
            'telefoon' => '06 12345678',
            'email' => 'sara.bakker@voorbeeld.nl',
        ]);
        $sara->activiteiten()->attach($kookworkshop->id, [
            'inschrijf_datum' => '2026-01-12',
            'resultaat' => 'nog bezig',
        ]);

        $lynn = Jongere::create([
            'voornaam' => 'Lynn',
            'achternaam' => 'de Vries',
            'geboortedatum' => '2007-11-30',
            'telefoon' => '06 34567890',
            'email' => 'lynn.devries@voorbeeld.nl',
        ]);
        $lynn->activiteiten()->attach($sollicitatietraining->id, [
            'inschrijf_datum' => '2026-02-20',
            'resultaat' => 'nog bezig',
        ]);

         // Jongeren die zijn uitgeplaatst (uitgeschreven-tab)
        $mohammed = Jongere::create([
            'voornaam' => 'Mohammed',
            'achternaam' => 'El Idrissi',
            'geboortedatum' => '2006-09-02',
            'telefoon' => '06 23456789',
            'email' => 'hu.elidrissi@voorbeeld.nl',
            'instituut_id' => $bouwbedrijf->id,
            'uitgeplaatst_op' => '2026-03-15',
        ]);
        // Mo had eerder de timmerworkshop afgerond, voordat hij werd uitgeplaatst
        $mohammed->activiteiten()->attach($timmerworkshop->id, [
            'inschrijf_datum' => '2026-02-03',
            'resultaat' => 'afgerond',
        ]);

        $fatima = Jongere::create([
            'voornaam' => 'Fatima',
            'achternaam' => 'Yilmaz',
            'geboortedatum' => '2007-07-08',
            'telefoon' => '06 56789012',
            'email' => 'fatima.yilmaz@voorbeeld.nl',
            'instituut_id' => $roc->id,
            'uitgeplaatst_op' => '2026-02-01',
        ]);

        $kevin = Jongere::create([
            'voornaam' => 'Kevin',
            'achternaam' => 'Jansen',
            'geboortedatum' => '2006-03-21',
            'telefoon' => '06 45678901',
            'email' => 'kevin.jansen@voorbeeld.nl',
            'instituut_id' => $bakkerij->id,
            'uitgeplaatst_op' => '2026-03-01',
        ]);

    }
}
