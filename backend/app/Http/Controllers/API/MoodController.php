<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MoodLog;

class MoodController extends Controller
{
    public function index(Request $request)
    {
        $logs = MoodLog::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json([
            'success' => true,
            'data' => $logs
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'mood_level' => 'required|integer|min:1|max:5',
            'anxiety_level' => 'required|integer|min:1|max:5',
            'sleep_hours' => 'nullable|numeric|min:0|max:24',
            'journal_notes' => 'nullable|string'
        ]);

        $log = MoodLog::create([
            'user_id' => $request->user()->id,
            'mood_level' => $validated['mood_level'],
            'anxiety_level' => $validated['anxiety_level'],
            'sleep_hours' => $validated['sleep_hours'] ?? null,
            'journal_notes' => $validated['journal_notes'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Daily check-in saved successfully.',
            'data' => $log
        ]);
    }
}
