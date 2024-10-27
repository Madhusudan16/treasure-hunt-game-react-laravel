<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\GameController;

Route::get('/', [GameController::class, 'initGame'])->name("init-game");

Route::prefix('game')->controller(GameController::class)->name('game.')->group(function() {
    Route::get('/', 'initGame')->name('init');
    Route::post('/start', 'startGame')->name('start');
    Route::post('/is-treasure-found', 'isTreasureFound')->name('verify');
    Route::get('/result', 'displayResult')->name('result');
    
});
