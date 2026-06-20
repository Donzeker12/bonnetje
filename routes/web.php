<?php

use App\Http\Controllers\Auth\LoginController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::inertia('/', 'Welcome')->name('home');
Route::inertia('/login', 'Login')->name('login');
Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

// Protected routes
Route::middleware('auth')->group(function () {
    Route::inertia('/dashboard', 'Dashboard')->name('dashboard');
    Route::inertia('/admin', 'AdminPage')->middleware('admin')->name('admin');
    Route::inertia('/profile', 'ProfilePage')->name('profile');
    Route::inertia('/products', 'ProductsPage')->name('products');
    Route::inertia('/scan', 'ScanPage')->name('scan');
    Route::inertia('/folder-actions', 'FolderActionsPage')->name('folder-actions');
    Route::inertia('/shopping-list', 'ShoppingListPage')->name('shopping-list');
    Route::inertia('/leaderboard', 'LeaderboardPage')->name('leaderboard');
});
