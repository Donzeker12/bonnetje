<?php

use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\FolderActionController;
use App\Http\Controllers\Api\MobileAuthController;
use App\Http\Controllers\PriceController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReceiptController;
use App\Http\Controllers\StoreRequestController;
use App\Http\Controllers\ShoppingListController;
use App\Http\Controllers\StoreController;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/products/search', [ProductController::class, 'search']);
Route::get('/products/barcode/{barcode}', [ProductController::class, 'findByBarcode']);
Route::get('/products/{product}/compare', [ProductController::class, 'comparePrices']);
Route::get('/products/categories', [ProductController::class, 'categories']);

Route::get('/stores', [StoreController::class, 'index']);
Route::get('/stores/nearby', [StoreController::class, 'nearby']);
Route::get('/stores/cities', [StoreController::class, 'cities']);
Route::get('/stores/chains', [StoreController::class, 'chains']);
Route::get('/stores/{store}', [StoreController::class, 'show']);
Route::get('/stores/{store}/statistics', [StoreController::class, 'statistics']);

Route::get('/prices/city', [PriceController::class, 'cityPrices']);
Route::get('/prices/statistics', [PriceController::class, 'statistics']);

Route::get('/leaderboard', [LeaderboardController::class, 'index']);
Route::get('/badges', [LeaderboardController::class, 'allBadges']);
Route::post('/mobile/login', [MobileAuthController::class, 'login'])
    ->withoutMiddleware([ValidateCsrfToken::class]);

// Protected routes (require authentication)
Route::middleware('auth')->group(function () {
    Route::get('/mobile/me', [MobileAuthController::class, 'me']);
    Route::post('/mobile/logout', [MobileAuthController::class, 'logout'])
        ->withoutMiddleware([ValidateCsrfToken::class]);

    // Products
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::get('/products/{product}/price-history', [ProductController::class, 'priceHistory']);

    // Prices & Scanning
    Route::post('/prices', [PriceController::class, 'store']);
    Route::post('/prices/proof-upload', [PriceController::class, 'uploadProof']);
    Route::put('/prices/{price}', [PriceController::class, 'update']);
    Route::post('/prices/{price}/verify', [PriceController::class, 'verify']);

    // Receipts (Sprint 2 bootstrap)
    Route::get('/receipts', [ReceiptController::class, 'index']);
    Route::post('/receipts', [ReceiptController::class, 'store']);
    Route::get('/receipts/{receipt}', [ReceiptController::class, 'show']);
    Route::post('/receipts/{receipt}/process', [ReceiptController::class, 'process']);

    // Folder actions (supermarket promotions via photos)
    Route::get('/folder-actions/mine', [FolderActionController::class, 'mine']);
    Route::get('/folder-actions/{folderAction}', [FolderActionController::class, 'show']);
    Route::post('/folder-actions', [FolderActionController::class, 'store']);
    Route::post('/folder-actions/{folderAction}/items', [FolderActionController::class, 'addItem']);

    // Shopping Lists
    Route::get('/shopping-lists', [ShoppingListController::class, 'index']);
    Route::post('/shopping-lists', [ShoppingListController::class, 'store']);
    Route::get('/shopping-lists/{shoppingList}', [ShoppingListController::class, 'show']);
    Route::put('/shopping-lists/{shoppingList}', [ShoppingListController::class, 'update']);
    Route::delete('/shopping-lists/{shoppingList}', [ShoppingListController::class, 'destroy']);
    
    // Shopping List Items
    Route::post('/shopping-lists/{shoppingList}/items', [ShoppingListController::class, 'addItem']);
    Route::put('/shopping-lists/{shoppingList}/items/{item}', [ShoppingListController::class, 'updateItem']);
    Route::delete('/shopping-lists/{shoppingList}/items/{item}', [ShoppingListController::class, 'removeItem']);
    
    // Shopping List Analysis
    Route::get('/shopping-lists/{shoppingList}/compare', [ShoppingListController::class, 'compare']);
    Route::get('/shopping-lists/{shoppingList}/optimize', [ShoppingListController::class, 'optimize']);

    // Store requests (all authenticated users)
    Route::post('/store-requests', [StoreRequestController::class, 'store']);

    // Admin only
    Route::middleware('admin')->group(function () {
        Route::post('/stores', [StoreController::class, 'store']);
        Route::get('/admin/store-requests', [StoreRequestController::class, 'index']);
        Route::post('/admin/store-requests/{storeRequest}/approve', [StoreRequestController::class, 'approve']);
        Route::post('/admin/store-requests/{storeRequest}/reject', [StoreRequestController::class, 'reject']);

        Route::get('/admin/folder-actions', [FolderActionController::class, 'adminIndex']);
        Route::post('/admin/folder-actions/{folderAction}/approve', [FolderActionController::class, 'approve']);
        Route::post('/admin/folder-actions/{folderAction}/reject', [FolderActionController::class, 'reject']);
    });

    // Gamification
    Route::get('/profile', [LeaderboardController::class, 'profile']);
    Route::get('/profile/badges', [LeaderboardController::class, 'badges']);
    Route::post('/badges', [LeaderboardController::class, 'createBadge']);
});
