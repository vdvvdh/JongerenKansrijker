<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Jongere extends Model
{
    protected $table = 'jongeren';

    protected $fillable = [
        'voornaam',
        'achternaam',
        'geboortedatum',
        'email',
        'telefoonnummer',
        'adres',
    ];
}
