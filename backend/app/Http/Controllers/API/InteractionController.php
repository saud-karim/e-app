<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class InteractionController extends Controller
{
    public function check(Request $request)
    {
        $validated = $request->validate([
            'medications' => 'required|array|min:2',
            'medications.*' => 'string'
        ]);

        $drugs = array_map('strtolower', $validated['medications']);
        
        // Mock Interaction Logic
        // If they enter 'Aspirin' and 'Warfarin', simulate high risk
        if (in_array('aspirin', $drugs) && in_array('warfarin', $drugs)) {
            return response()->json([
                'risk_level' => 'High',
                'title' => 'Major Interaction Detected',
                'description' => 'Taking Aspirin with Warfarin can significantly increase the risk of bleeding. Please consult your doctor immediately.',
                'action_required' => 'Consult Doctor',
                'alternatives' => ['Acetaminophen (Tylenol) for pain relief']
            ]);
        }

        if (in_array('ibuprofen', $drugs) && in_array('lisinopril', $drugs)) {
            return response()->json([
                'risk_level' => 'Moderate',
                'title' => 'Moderate Interaction',
                'description' => 'Ibuprofen may decrease the effects of Lisinopril and could affect kidney function.',
                'action_required' => 'Monitor Blood Pressure',
                'alternatives' => ['Consult your doctor for a different pain reliever']
            ]);
        }

        // Default Safe
        return response()->json([
            'risk_level' => 'Safe',
            'title' => 'No known interactions',
            'description' => 'There are no major interactions detected between the selected medications.',
            'action_required' => 'None',
            'alternatives' => []
        ]);
    }
}
