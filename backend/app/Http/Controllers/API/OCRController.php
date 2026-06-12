<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OCRController extends Controller
{
    public function scanPrescription(Request $request)
    {
        set_time_limit(120);

        $request->validate([
            'image' => 'required|string', // base64 encoded image
        ]);

        $apiKey = env('GEMINI_API_KEY');
        if (!$apiKey) {
            return response()->json([
                'success' => false,
                'message' => 'API Key is missing.'
            ], 500);
        }

        $base64Image = $request->input('image');
        
        // Remove data URI scheme if present (e.g. data:image/jpeg;base64,)
        if (strpos($base64Image, 'base64,') !== false) {
            $base64Image = explode('base64,', $base64Image)[1];
        }

        $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=' . $apiKey;

        $prompt = "You are an expert clinical pharmacist and optical character recognition (OCR) AI. I am providing you an image of a medical prescription or a medication box. Extract all medications listed.\n";
        $prompt .= "You MUST return the result in STRICTLY valid JSON format as a LIST of objects. Each object must have these exactly keys:\n";
        $prompt .= "[\n";
        $prompt .= "  {\n";
        $prompt .= '    "id": 1,' . "\n";
        $prompt .= '    "name": "Medication name (e.g. Amoxicillin)",' . "\n";
        $prompt .= '    "dosage": "Numerical dosage (e.g. 500)",' . "\n";
        $prompt .= '    "unit": "Unit (e.g. mg, ml)",' . "\n";
        $prompt .= '    "frequency": "How often to take it, in English (e.g. Twice a day)"' . "\n";
        $prompt .= "  }\n";
        $prompt .= "]\n";
        $prompt .= "If no medications are found, return an empty array []. Do not include any markdown syntax like ```json, just output the raw JSON text.";

        $payload = [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt],
                        [
                            'inline_data' => [
                                'mime_type' => 'image/jpeg',
                                'data' => $base64Image
                            ]
                        ]
                    ]
                ]
            ],
            'generationConfig' => [
                'temperature' => 0.1,
                'maxOutputTokens' => 1024,
            ]
        ];

        try {
            $response = Http::timeout(120)
                ->withoutVerifying()
                ->withHeaders(['x-goog-api-key' => $apiKey])
                ->post($url, $payload);

            if ($response->successful()) {
                $data = $response->json();
                
                if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
                    $aiText = $data['candidates'][0]['content']['parts'][0]['text'];
                    $aiText = trim($aiText);
                    
                    // Remove markdown JSON formatting
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

                    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                        return response()->json([
                            'success' => true,
                            'data' => $decoded
                        ]);
                    }
                }
            }

            Log::error('Gemini OCR API Error: ' . $response->body());
            return response()->json([
                'success' => false,
                'message' => 'تعذر فحص الروشتة حالياً بسبب ضغط السيرفرات.'
            ], 503);

        } catch (\Exception $e) {
            Log::error('Gemini OCR Exception: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في الاتصال بخادم الذكاء الاصطناعي.'
            ], 500);
        }
    }
}
