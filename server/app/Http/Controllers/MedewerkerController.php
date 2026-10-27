<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MedewerkerController extends Controller
{
    private const PUBLIC_FIELDS = ['id', 'voornaam', 'achternaam', 'functie', 'email'];

    public function index(): JsonResponse
    {
        $medewerkers = User::query()
            ->orderBy('achternaam')
            ->orderBy('voornaam')
            ->get(self::PUBLIC_FIELDS);

        return response()->json($medewerkers);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'voornaam' => ['required', 'string', 'max:255'],
            'achternaam' => ['required', 'string', 'max:255'],
            'functie' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $medewerker = User::create($data);

        return response()->json($medewerker->only(self::PUBLIC_FIELDS), 201);
    }

    public function update(Request $request, User $medewerker): JsonResponse
    {
        $data = $request->validate([
            'voornaam' => ['sometimes', 'required', 'string', 'max:255'],
            'achternaam' => ['sometimes', 'required', 'string', 'max:255'],
            'functie' => ['sometimes', 'nullable', 'string', 'max:255'],
            'email' => [
                'sometimes',
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($medewerker->id),
            ],
            'password' => ['sometimes', 'required', 'string', 'min:8', 'confirmed'],
        ]);

        $medewerker->update($data);

        return response()->json($medewerker->only(self::PUBLIC_FIELDS));
    }

    public function destroy(User $medewerker): JsonResponse
    {
        $medewerker->delete();

        return response()->json(['message' => 'Medewerker verwijderd']);
    }
}