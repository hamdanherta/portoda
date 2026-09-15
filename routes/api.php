<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PortfolioController;
use App\Http\Controllers\Api\InfoController;
use App\Http\Controllers\Api\UploadController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::post('/upload', [UploadController::class, 'upload']);

// Portfolio Routes
Route::get('/portfolio-items', [PortfolioController::class, 'index']);
Route::post('/portfolio-items', [PortfolioController::class, 'store']);
Route::put('/portfolio-items/{id}', [PortfolioController::class, 'update']);
Route::delete('/portfolio-items/{id}', [PortfolioController::class, 'destroy']);
Route::post('/portfolio-items/reset', [PortfolioController::class, 'reset']);

// Info Routes
Route::get('/experiences', [InfoController::class, 'getExperiences']);
Route::post('/experiences', [InfoController::class, 'saveExperience']);
Route::delete('/experiences/{id}', [InfoController::class, 'deleteExperience']);

Route::get('/documents', [InfoController::class, 'getDocuments']);
Route::post('/documents', [InfoController::class, 'saveDocument']);
Route::delete('/documents/{id}', [InfoController::class, 'deleteDocument']);

Route::get('/contacts', [InfoController::class, 'getContacts']);
Route::post('/contacts', [InfoController::class, 'saveContact']);
Route::delete('/contacts/{id}', [InfoController::class, 'deleteContact']);

Route::get('/certificates', [InfoController::class, 'getCertificates']);
Route::post('/certificates', [InfoController::class, 'saveCertificate']);
Route::delete('/certificates/{id}', [InfoController::class, 'deleteCertificate']);

Route::get('/profile', [InfoController::class, 'getProfile']);
Route::post('/profile', [InfoController::class, 'saveProfile']);

Route::post('/info/reset', [InfoController::class, 'resetAllInfo']);
