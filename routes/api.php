<?php

use Illuminate\Support\Facades\Route;

Route::prefix("auth")->group(function () {
    Route::post("login", \App\Actions\Auth\LoginController::class);
});