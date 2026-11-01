<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Activiteit extends Model
{
    protected $table = 'activiteiten';
    
    protected $fillable = ['naam', 'omschrijving', 'adres', 'duur'];

    public function jongeren(): BelongsToMany
    {
        return $this->belongsToMany(Jongere::class, 'jongere_activiteit')
            ->withPivot('inschrijf_datum', 'resultaat')
            ->withTimestamps();
    }
}
