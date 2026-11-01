<?php

namespace App\Http\Controllers;

use App\Models\Instituut;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InstituutController extends Controller
{
    public function index(): JsonResponse
    {
        // withCount geeft per instituut "jongeren_count" terug
        $instituten = Instituut::withCount('jongeren')
            ->orderBy('naam')
            ->get();

        return response()->json($instituten);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'naam' => 'required|string|max:255',
            'omschrijving' => 'nullable|string',
            'adres' => 'nullable|string|max:255',
            'contactpersoon' => 'nullable|string|max:255',
        ]);

        return response()->json(Instituut::create($data), 201);
    }

    public function show(string $id): JsonResponse
    {
        return response()->json(Instituut::findOrFail($id));
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $instituut = Instituut::findOrFail($id);

        $data = $request->validate([
            'naam' => 'sometimes|required|string|max:255',
            'omschrijving' => 'sometimes|nullable|string',
            'adres' => 'sometimes|nullable|string|max:255',
            'contactpersoon' => 'sometimes|nullable|string|max:255',
        ]);

        $instituut->update($data);

        return response()->json($instituut);
    }

    public function destroy(string $id): JsonResponse
    {
        $instituut = Instituut::withCount('jongeren')->findOrFail($id);

        // Blokkeer verwijderen zolang er jongeren geplaatst zijn
        if ($instituut->jongeren_count > 0) {
            return response()->json([
                'message' => 'Dit instituut kan niet worden verwijderd zolang er jongeren geplaatst zijn.',
            ], 422);
        }

        $instituut->delete();

        return response()->json([
            'message' => 'Instituut verwijderd',
        ]);
    }
}