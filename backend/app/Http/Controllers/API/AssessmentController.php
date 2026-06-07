<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AssessmentController extends Controller
{
    public function submit(Request $request)
    {
        $validated = $request->validate([
            'score' => 'required|integer|min:0|max:15' // Assuming 5 questions, max 3 points each
        ]);

        $score = $validated['score'];
        $riskLevel = 'Mild';
        $guidance = 'You are doing great. Keep taking care of yourself!';

        if ($score >= 10) {
            $riskLevel = 'High';
            $guidance = 'Your results indicate high levels of distress. Please consider talking to a healthcare professional or reaching out to a trusted loved one.';
        } elseif ($score >= 5) {
            $riskLevel = 'Moderate';
            $guidance = 'You might be feeling a bit overwhelmed. Consider taking some time to rest or talk to our AI assistant to clear your mind.';
        }

        return response()->json([
            'success' => true,
            'data' => [
                'score' => $score,
                'risk_level' => $riskLevel,
                'guidance' => $guidance
            ]
        ]);
    }
}
