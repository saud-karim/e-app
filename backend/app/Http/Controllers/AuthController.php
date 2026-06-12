<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:users,email',
            'phone' => 'nullable|string|unique:users,phone',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if (empty($validated['email']) && empty($validated['phone'])) {
            return response()->json([
                'success' => false,
                'message_ar' => 'يجب إدخال البريد الإلكتروني أو رقم الهاتف',
                'message_en' => 'Email or phone number is required',
            ], 422);
        }

        // Set fixed OTP for testing purposes
        $otp = '1234';

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
            'otp_code' => $otp,
            'otp_expires_at' => now()->addMinutes(10),
            'status' => 'pending',
        ]);

        // Mocking OTP send
        Log::info("OTP for User {$user->id} is {$otp}");

        return response()->json([
            'success' => true,
            'data' => ['user_id' => $user->id],
            'message_ar' => 'تم إنشاء الحساب، يرجى التحقق من الرمز (OTP)',
            'message_en' => 'Account created, please verify your OTP',
        ]);
    }

    public function verifyOtp(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'otp_code' => 'required|string',
        ]);

        $user = User::findOrFail($validated['user_id']);

        if ($user->otp_code !== $validated['otp_code'] || $user->otp_expires_at < now()) {
            return response()->json([
                'success' => false,
                'message_ar' => 'الرمز غير صحيح أو منتهي الصلاحية',
                'message_en' => 'Invalid or expired OTP',
            ], 400);
        }

        $user->update([
            'otp_code' => null,
            'otp_expires_at' => null,
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
                'token' => $token,
            ],
            'message_ar' => 'تم التحقق من الحساب بنجاح',
            'message_en' => 'Account verified successfully',
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email_or_phone' => 'required|string',
            'password' => 'required|string',
        ]);

        $field = filter_var($request->email_or_phone, FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';

        $user = User::where($field, $request->email_or_phone)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message_ar' => 'بيانات الدخول غير صحيحة',
                'message_en' => 'Invalid credentials',
            ], 401);
        }

        if ($user->status !== 'active') {
            return response()->json([
                'success' => false,
                'message_ar' => 'الحساب غير مفعل، يرجى التحقق من الرمز (OTP)',
                'message_en' => 'Account not active, please verify OTP',
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user->load('profile'),
                'token' => $token,
            ],
            'message_ar' => 'تم تسجيل الدخول بنجاح',
            'message_en' => 'Login successful',
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message_ar' => 'تم تسجيل الخروج بنجاح',
            'message_en' => 'Logged out successfully',
        ]);
    }
}
