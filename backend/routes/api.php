<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;

Route::prefix('v1')->group(function () {
    // Auth
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
    
    // Test Auth Route
    Route::post('/test-login', function () {
        $user = \App\Models\User::firstOrCreate(
            ['email' => 'test@test.com'],
            ['name' => 'Test User', 'password' => \Illuminate\Support\Facades\Hash::make('password'), 'status' => 'active']
        );
        return response()->json(['token' => $user->createToken('auth_token')->plainTextToken]);
    });
    
    // Protected
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        
        // Profile
        Route::get('/profile', [ProfileController::class, 'show']);
        Route::post('/profile', [ProfileController::class, 'update']);
        Route::post('/profile/reports', [ProfileController::class, 'uploadReport']);

        // Medications
        Route::apiResource('medications', \App\Http\Controllers\MedicationController::class);
        
        // Dashboard
        Route::get('/dashboard', [\App\Http\Controllers\MedicationController::class, 'dashboard']);
        
        // Medication Logs
        Route::post('/medication-logs', [\App\Http\Controllers\MedicationIntakeController::class, 'store']);
        
        // Drug Interactions
        Route::post('/interactions/check', [\App\Http\Controllers\API\InteractionController::class, 'check']);
        
        // Mental Health & Mood
        Route::get('/mood-logs', [\App\Http\Controllers\API\MoodController::class, 'index']);
        Route::post('/mood-logs', [\App\Http\Controllers\API\MoodController::class, 'store']);
        
        // AI Chat
        Route::post('/ai-chat', [\App\Http\Controllers\API\AIChatController::class, 'chat']);
        
        // Reports
        Route::get('/reports/adherence', [\App\Http\Controllers\API\ReportController::class, 'adherence']);
        
        // Caregivers
        Route::get('/caregivers', [\App\Http\Controllers\API\CaregiverController::class, 'index']);
        Route::post('/caregivers', [\App\Http\Controllers\API\CaregiverController::class, 'store']);
        Route::delete('/caregivers/{id}', [\App\Http\Controllers\API\CaregiverController::class, 'destroy']);
        
        // Self-Assessment
        Route::post('/assessment/submit', [\App\Http\Controllers\API\AssessmentController::class, 'submit']);
    });
});
