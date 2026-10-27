<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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
        'instituut_id',
        'uitgeplaatst_op',
    ];

    public function activiteiten(): BelongsToMany
    {
        return $this->belongsToMany(Activiteit::class, 'jongere_activiteit')
            ->withPivot('inschrijf_datum', 'resultaat')
            ->withTimestamps();
    }

    public function instituut(): BelongsTo
    {
        return $this->belongsTo(Instituut::class);
    }
}