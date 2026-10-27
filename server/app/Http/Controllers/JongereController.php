<?php

namespace App\Http\Controllers;

use App\Models\Jongere;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class JongereController extends Controller
{
    public function index(): JsonResponse
    {
        $ingeschreven = Jongere::whereNull('instituut_id')
            ->with('activiteiten')
            ->orderBy('achternaam')
            ->get();

        $uitgeschreven = Jongere::whereNotNull('instituut_id')
            ->with(['instituut', 'activiteiten'])
            ->orderBy('achternaam')
            ->get();

        return response()->json([
            'ingeschreven' => $ingeschreven,
            'uitgeschreven' => $uitgeschreven,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'voornaam' => 'required|string|max:255',
            'achternaam' => 'required|string|max:255',
            'geboortedatum' => 'required|date',
            'email' => 'nullable|email',
            'telefoon' => 'nullable|string|max:255',
            'instituut_id' => 'nullable|exists:instituten,id',
            'uitgeplaatst_op' => 'nullable|date',
        ]);

        return response()->json(Jongere::create($data), 201);
    }

    public function show(string $id): JsonResponse
    {
        return response()->json(Jongere::findOrFail($id));
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $jongere = Jongere::findOrFail($id);

        $data = $request->validate([
            'voornaam' => 'sometimes|required|string|max:255',
            'achternaam' => 'sometimes|required|string|max:255',
            'geboortedatum' => 'sometimes|required|date',
            'email' => 'sometimes|nullable|email',
            'telefoon' => 'sometimes|nullable|string|max:255',
            'instituut_id' => 'sometimes|nullable|exists:instituten,id',
            'uitgeplaatst_op' => 'sometimes|nullable|date',
        ]);

        $jongere->update($data);

        return response()->json($jongere);
    }

    public function destroy(string $id): JsonResponse
    {
        $jongere = Jongere::findOrFail($id);
        $jongere->delete();

        return response()->json([
            'message' => 'Jongere verwijderd',
        ]);
    }
}
