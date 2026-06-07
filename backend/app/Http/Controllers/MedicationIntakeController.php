<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MedicationIntakeController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'medication_id' => 'required|exists:medications,id',
            'scheduled_time' => 'required|date',
            'status' => 'required|in:taken,missed,skipped',
            'taken_time' => 'nullable|date',
        ]);

        $medication = $request->user()->medications()->findOrFail($validated['medication_id']);

        $intake = $medication->intakes()->create([
            'user_id' => $request->user()->id,
            'scheduled_time' => $validated['scheduled_time'],
            'taken_time' => $validated['status'] === 'taken' ? ($validated['taken_time'] ?? now()) : null,
            'status' => $validated['status'],
        ]);

        // If taken, decrement total_pills if applicable
        if ($intake->status === 'taken' && $medication->total_pills > 0) {
            $medication->decrement('total_pills');
        }

        return response()->json(['message' => 'Intake logged successfully', 'intake' => $intake], 201);
    }
}
