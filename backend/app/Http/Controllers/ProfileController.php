<?php

namespace App\Http\Controllers;

use App\Models\MedicalReport;
use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user()->load(['profile', 'medicalReports']);

        return response()->json([
            'success' => true,
            'data' => $user,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'age' => 'nullable|integer',
            'gender' => 'nullable|in:male,female,other',
            'chronic_diseases' => 'nullable|array',
            'allergies' => 'nullable|array',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:255',
            'height' => 'nullable|numeric',
            'weight' => 'nullable|numeric',
            'blood_type' => 'nullable|string|max:5',
        ]);

        $profile = UserProfile::updateOrCreate(
            ['user_id' => $request->user()->id],
            $validated
        );

        return response()->json([
            'success' => true,
            'data' => $profile,
            'message_ar' => 'تم تحديث الملف الشخصي بنجاح',
            'message_en' => 'Profile updated successfully',
        ]);
    }

    public function uploadReport(Request $request)
    {
        $request->validate([
            'report' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120', // Max 5MB
        ]);

        $file = $request->file('report');
        $path = $file->store('medical_reports', 'local');

        $report = MedicalReport::create([
            'user_id' => $request->user()->id,
            'file_path' => $path,
            'original_name' => $file->getClientOriginalName(),
        ]);

        return response()->json([
            'success' => true,
            'data' => $report,
            'message_ar' => 'تم رفع التقرير الطبي بنجاح',
            'message_en' => 'Medical report uploaded successfully',
        ]);
    }
}
