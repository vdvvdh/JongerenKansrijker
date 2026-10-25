<?php

namespace App\Http\Controllers;

use App\Models\Jongere;
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
            ->with('instituut')
            ->orderBy('achternaam')
            ->get();

        return response()->json([
            'ingeschreven' => $ingeschreven,
            'uitgeschreven' => $uitgeschreven,
        ]);
    }
}