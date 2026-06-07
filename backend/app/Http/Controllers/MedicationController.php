<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MedicationController extends Controller
{
    public function index(Request $request)
    {
        $medications = $request->user()->medications()->orderBy('created_at', 'desc')->get();
        return response()->json($medications);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'dosage' => 'nullable|string|max:255',
            'dosage_unit' => 'nullable|string|max:255',
            'frequency_type' => 'required|string|max:255',
            'duration_days' => 'nullable|integer|min:1',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'reminder_times' => 'nullable|array',
            'reminder_times.*' => 'date_format:H:i',
            'total_pills' => 'nullable|integer|min:1',
            'refill_reminder_threshold' => 'nullable|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        $medication = $request->user()->medications()->create($validated);

        return response()->json(['message' => 'Medication added successfully', 'medication' => $medication], 201);
    }

    public function show(Request $request, $id)
    {
        $medication = $request->user()->medications()->findOrFail($id);
        return response()->json($medication);
    }

    public function update(Request $request, $id)
    {
        $medication = $request->user()->medications()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'dosage' => 'nullable|string|max:255',
            'dosage_unit' => 'nullable|string|max:255',
            'frequency_type' => 'sometimes|string|max:255',
            'duration_days' => 'nullable|integer|min:1',
            'start_date' => 'sometimes|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'reminder_times' => 'nullable|array',
            'reminder_times.*' => 'date_format:H:i',
            'total_pills' => 'nullable|integer|min:0',
            'refill_reminder_threshold' => 'nullable|integer|min:1',
            'notes' => 'nullable|string',
            'status' => 'sometimes|in:active,completed,paused',
        ]);

        $medication->update($validated);

        return response()->json(['message' => 'Medication updated successfully', 'medication' => $medication]);
    }

    public function destroy(Request $request, $id)
    {
        $medication = $request->user()->medications()->findOrFail($id);
        $medication->delete();

        return response()->json(['message' => 'Medication deleted successfully']);
    }

    public function dashboard(Request $request)
    {
        $user = $request->user();
        $today = now()->format('Y-m-d');
        
        // Auto-generate today's intakes for active medications
        $activeMeds = $user->medications()->where('status', 'active')->get();
        foreach ($activeMeds as $med) {
            $times = $med->reminder_times ?? [];
            if (is_string($times)) {
                $times = json_decode($times, true) ?? [];
            }
            foreach ($times as $time) {
                // Ensure time is formatted correctly (H:i:s)
                if (strlen($time) == 5) $time .= ':00';
                $scheduledTime = $today . ' ' . $time;
                
                \App\Models\MedicationIntake::firstOrCreate([
                    'user_id' => $user->id,
                    'medication_id' => $med->id,
                    'scheduled_time' => $scheduledTime,
                ], [
                    'status' => 'pending'
                ]);
            }
        }

        $activeMedicationsCount = $activeMeds->count();
        
        $upcomingIntakes = \App\Models\MedicationIntake::with('medication')
            ->where('user_id', $user->id)
            ->whereDate('scheduled_time', $today)
            ->where('status', 'pending')
            ->orderBy('scheduled_time')
            ->get();
            
        $missedIntakes = \App\Models\MedicationIntake::with('medication')
            ->where('user_id', $user->id)
            ->whereDate('scheduled_time', $today)
            ->where('status', 'missed')
            ->get();

        $pastWeek = now()->subDays(7)->format('Y-m-d');
        
        $weeklyMissedCount = \App\Models\MedicationIntake::where('user_id', $user->id)
            ->whereDate('scheduled_time', '>=', $pastWeek)
            ->where('status', 'missed')
            ->count();

        $weeklyTakenCount = \App\Models\MedicationIntake::where('user_id', $user->id)
            ->whereDate('scheduled_time', '>=', $pastWeek)
            ->where('status', 'taken')
            ->count();
            
        $totalWeekly = $weeklyMissedCount + $weeklyTakenCount;
        
        // Calculate risk score: higher missed percentage = higher risk
        $riskScore = 10; // Baseline minimal risk
        if ($totalWeekly > 0) {
            $riskScore += round(($weeklyMissedCount / $totalWeekly) * 90); // Scale up to 100
        }

        return response()->json([
            'riskScore' => min(100, $riskScore),
            'weeklyMissedCount' => $weeklyMissedCount,
            'activeMedicationsCount' => $activeMedicationsCount,
            'upcomingIntakes' => $upcomingIntakes,
            'missedIntakes' => $missedIntakes,
            'todayProgress' => 50, // Mock progress
        ]);
    }
}
