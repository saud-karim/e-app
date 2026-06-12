<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class InteractionController extends Controller
{
    public function check(Request $request)
    {
        set_time_limit(120);

        $validated = $request->validate([
            'medications' => 'required|array|min:2',
            'medications.*' => 'string'
        ]);

        $drugs = implode(', ', $validated['medications']);
        $profile = $request->user()->profile;
        $chronicDiseases = $profile && !empty($profile->chronic_diseases) ? implode(', ', $profile->chronic_diseases) : 'None';
        $allergies = $profile && !empty($profile->allergies) ? implode(', ', $profile->allergies) : 'None';

        $apiKey = env('GEMINI_API_KEY');
        if (!$apiKey) {
            return response()->json([
                'risk_level' => 'Error',
                'title' => 'خطأ',
                'description' => 'API Key is missing.',
                'action_required' => 'None',
                'alternatives' => []
            ], 500);
        }

        $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' . $apiKey;

        $prompt = "You are an expert clinical pharmacist AI. Analyze the following patient data for any major or moderate drug-drug, drug-disease, or drug-allergy interactions.\n";
        $prompt .= "Medications: $drugs\n";
        $prompt .= "Patient Chronic Diseases: $chronicDiseases\n";
        $prompt .= "Patient Allergies: $allergies\n\n";
        $prompt .= "You MUST return the result in STRICTLY valid JSON format with exactly these keys:\n";
        $prompt .= "{\n";
        $prompt .= '  "risk_level": "Safe" or "Moderate" or "High",' . "\n";
        $prompt .= '  "title": "A short Arabic title summarizing the interaction (e.g. تفاعل خطير, آمن, تفاعل معتاد)",' . "\n";
        $prompt .= '  "description": "A detailed explanation in Arabic of why there is an interaction and what it does",' . "\n";
        $prompt .= '  "action_required": "Short action required in Arabic, e.g. استشر طبيبك فوراً, مراقبة الضغط",' . "\n";
        $prompt .= '  "alternatives": ["Array of string alternative drugs in Arabic if applicable, or empty array"]' . "\n";
        $prompt .= "}\n";
        $prompt .= "Do not include any markdown syntax like ```json, just output the raw JSON text.";

        $payload = [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ]
            ],
            'generationConfig' => [
                'temperature' => 0.2,
                'maxOutputTokens' => 2048,
            ]
        ];

        try {
            $response = \Illuminate\Support\Facades\Http::timeout(120)
                ->withoutVerifying()
                ->withHeaders(['x-goog-api-key' => $apiKey])
                ->post($url, $payload);

            if ($response->successful()) {
                $data = $response->json();
                
                if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
                    $aiText = $data['candidates'][0]['content']['parts'][0]['text'];
                    $aiText = trim($aiText);
                    
                    // Remove markdown JSON formatting if the model still includes it
                    if (str_starts_with($aiText, '```json')) {
                        $aiText = substr($aiText, 7);
                    }
                    if (str_starts_with($aiText, '```')) {
                        $aiText = substr($aiText, 3);
                    }
                    if (str_ends_with($aiText, '```')) {
                        $aiText = substr($aiText, 0, -3);
                    }
                    $aiText = trim($aiText);

                    $decoded = json_decode($aiText, true);

                    if (json_last_error() === JSON_ERROR_NONE) {
                        return response()->json($decoded);
                    }
                }
            }

            \Illuminate\Support\Facades\Log::error('Gemini Interaction API Error: ' . $response->body());
            return response()->json([
                'risk_level' => 'Error',
                'title' => 'تعذر الفحص حالياً',
                'description' => 'خوادم الذكاء الاصطناعي عليها ضغط عالٍ حالياً. يرجى المحاولة بعد قليل.',
                'action_required' => 'حاول لاحقاً',
                'alternatives' => []
            ]);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Gemini Exception: ' . $e->getMessage());
            return response()->json([
                'risk_level' => 'Error',
                'title' => 'حدث خطأ',
                'description' => 'لم نتمكن من فحص التفاعلات بسبب خطأ في الاتصال.',
                'action_required' => 'حاول لاحقاً',
                'alternatives' => []
            ]);
        }
    }
}
