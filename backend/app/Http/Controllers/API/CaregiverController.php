<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Caregiver;

class CaregiverController extends Controller
{
    public function index(Request $request)
    {
        $caregivers = Caregiver::where('user_id', $request->user()->id)->get();
        return response()->json(['success' => true, 'data' => $caregivers]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:20',
            'relation' => 'nullable|string|max:50'
        ]);

        // In a real app, this would send an email invite. 
        // For MVP, we just store it.
        $caregiver = Caregiver::create([
            'user_id' => $request->user()->id,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'relation' => $validated['relation']
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Caregiver added successfully',
            'data' => $caregiver
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $caregiver = Caregiver::where('user_id', $request->user()->id)->findOrFail($id);
        $caregiver->delete();

        return response()->json([
            'success' => true,
            'message' => 'Caregiver removed successfully'
        ]);
    }
}
