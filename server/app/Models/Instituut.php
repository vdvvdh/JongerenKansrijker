<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Instituut extends Model
{
    protected $table = 'instituten';
    
    protected $fillable = ['naam', 'omschrijving', 'adres', 'contactpersoon'];

    public function jongeren(): HasMany
    {
        return $this->hasMany(Jongere::class);
    }
}
