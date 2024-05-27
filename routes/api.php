<?php

use Def\API\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::prefix("auth")->group(function () {
    Route::post("login", [AuthController::class, "login"]);
});
Route::get("sanctum/csrf-cookie",function(){
    return response()->json(['csrf_token' => csrf_token()]);
});
