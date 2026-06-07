<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MedicationIntake;

class ReportController extends Controller
{
    public function adherence(Request $request)
    {
        $userId = $request->user()->id;

        // Mock Weekly Adherence Data for MVP Visualization
        // In a real scenario, this would query MedicationIntake group by day
        $weeklyData = [
            'labels' => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            'taken' => [3, 4, 3, 5, 2, 4, 4],
            'missed' => [1, 0, 1, 0, 2, 0, 0]
        ];

        // Overall compliance %
        $totalTaken = array_sum($weeklyData['taken']);
        $totalMissed = array_sum($weeklyData['missed']);
        $totalDoses = $totalTaken + $totalMissed;
        $compliance = $totalDoses > 0 ? round(($totalTaken / $totalDoses) * 100) : 0;

        return response()->json([
            'success' => true,
            'data' => [
                'weekly_chart' => $weeklyData,
                'overall_compliance' => $compliance,
                'total_doses' => $totalDoses
            ]
        ]);
    }
}
