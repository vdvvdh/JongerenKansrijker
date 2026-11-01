<?php

use App\Http\Controllers\ActiviteitController;
use App\Http\Controllers\InstituutController;
use App\Http\Controllers\JongereController;
use App\Http\Controllers\MedewerkerController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::apiResource('jongeren', JongereController::class);

    Route::apiResource('instituten', InstituutController::class);

    Route::apiResource('medewerkers', MedewerkerController::class)
        ->except(['show']);

    Route::apiResource('activiteiten', ActiviteitController::class)
        ->parameters(['activiteiten' => 'activiteit']);

    Route::put(
        'activiteiten/{activiteit}/jongeren',
        [ActiviteitController::class, 'syncJongeren']
    );
});