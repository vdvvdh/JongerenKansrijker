<?php

namespace App\Http\Controllers;

use App\Models\Activiteit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActiviteitController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            Activiteit::withCount('jongeren')->orderBy('naam')->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'naam' => ['required', 'string', 'max:255'],
            'omschrijving' => ['nullable', 'string'],
            'adres' => ['nullable', 'string', 'max:255'],
            'duur' => ['nullable', 'string', 'max:255'],
        ]);

        return response()->json(Activiteit::create($data), 201);
    }

    public function show(Activiteit $activiteit): JsonResponse
    {
        return response()->json($activiteit->load('jongeren'));
    }

    public function update(Request $request, Activiteit $activiteit): JsonResponse
    {
        $data = $request->validate([
            'naam' => ['sometimes', 'required', 'string', 'max:255'],
            'omschrijving' => ['sometimes', 'nullable', 'string'],
            'adres' => ['sometimes', 'nullable', 'string', 'max:255'],
            'duur' => ['sometimes', 'nullable', 'string', 'max:255'],
        ]);

        $activiteit->update($data);

        return response()->json($activiteit);
    }

    public function destroy(Activiteit $activiteit): JsonResponse
    {
        $activiteit->delete();

        return response()->json(['message' => 'Activiteit verwijderd.']);
    }

    public function syncJongeren(Request $request, Activiteit $activiteit): JsonResponse
    {
        $data = $request->validate([
            'jongere_ids' => ['present', 'array'],
            'jongere_ids.*' => ['integer', 'distinct', 'exists:jongeren,id'],
        ]);

        $activiteit->jongeren()->sync($data['jongere_ids']);

        return response()->json($activiteit->load('jongeren'));
    }
}
