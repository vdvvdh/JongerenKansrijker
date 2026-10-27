<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ActiviteitController;
use App\Http\Controllers\JongereController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('jongeren', JongereController::class);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('activiteiten', ActiviteitController::class)
        ->parameters(['activiteiten' => 'activiteit']);
    Route::put(
        'activiteiten/{activiteit}/jongeren',
        [ActiviteitController::class, 'syncJongeren']
    );
});
