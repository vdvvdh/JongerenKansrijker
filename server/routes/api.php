<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MedewerkerController;
use App\Http\Controllers\JongereController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('jongeren', JongereController::class);

Route::middleware('auth:sanctum')->apiResource('medewerkers', MedewerkerController::class)
    ->except(['show']);
