<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Jongere;

class JongereController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Jongere::all();
    }

    /**
     * Store a newly created resource in storage.
     */
   public function store(Request $request)
    {
    $jongere = Jongere::create([
        'voornaam' => $request->voornaam,
        'achternaam' => $request->achternaam,
        'geboortedatum' => $request->geboortedatum,
        'email' => $request->email,
        'telefoonnummer' => $request->telefoonnummer,
        'adres' => $request->adres,
    ]);

    return response()->json($jongere);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
    $jongere = Jongere::findOrFail($id);

    $jongere->update([
        'voornaam' => $request->voornaam,
        'achternaam' => $request->achternaam,
        'geboortedatum' => $request->geboortedatum,
        'email' => $request->email,
        'telefoonnummer' => $request->telefoonnummer,
        'adres' => $request->adres,
    ]);

    return response()->json($jongere);
    }

    /**
     * Remove the specified resource from storage.
     */
   public function destroy(string $id)
    {
    $jongere = Jongere::findOrFail($id);

    $jongere->delete();

    return response()->json([
        'message' => 'Jongere verwijderd'
    ]);
    }
}
