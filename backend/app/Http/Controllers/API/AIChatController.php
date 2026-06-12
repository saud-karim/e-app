<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIChatController extends Controller
{
    public function chat(Request $request)
    {
        // Increase maximum execution time to allow long AI responses
        set_time_limit(120);

        $validated = $request->validate([
            'message' => 'required|string|max:1000'
        ]);

        $userMessage = $validated['message'];
        $apiKey = env('GEMINI_API_KEY');

        if (!$apiKey) {
            return response()->json([
                'success' => false,
                'message' => 'API Key is missing.'
            ], 500);
        }

        $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=' . $apiKey;

        $systemPrompt = "You are a friendly, compassionate, and professional medical and mental health AI assistant for the 'Remind Me' application. Your goal is to support users, provide comforting advice, and answer health-related questions accurately. Always remind users to consult a real doctor for serious conditions. Reply in the same language the user speaks. Keep responses concise, warm, and helpful.\n\nUser Message: ";

        $payload = [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $systemPrompt . $userMessage]
                    ]
                ]
            ],
            'generationConfig' => [
                'temperature' => 0.7,
                'maxOutputTokens' => 4000,
            ]
        ];

        try {
            $response = Http::timeout(60)
                ->withoutVerifying()
                ->withHeaders(['x-goog-api-key' => $apiKey])
                ->post($url, $payload);

            if ($response->successful()) {
                $data = $response->json();
                
                if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
                    $aiText = $data['candidates'][0]['content']['parts'][0]['text'];
                    
                    return response()->json([
                        'success' => true,
                        'data' => [
                            'role' => 'assistant',
                            'content' => trim($aiText)
                        ]
                    ]);
                }
            }
            
            $errorBody = $response->json();
            $errorMessageAr = 'فشل الاتصال بالذكاء الاصطناعي حالياً.';
            $errorMessageEn = 'Failed to get response from AI.';

            if (isset($errorBody['error']['code']) && $errorBody['error']['code'] == 503) {
                 $errorMessageAr = 'خوادم الذكاء الاصطناعي عليها ضغط عالٍ حالياً. يرجى المحاولة بعد قليل.';
                 $errorMessageEn = 'AI servers are currently experiencing high demand. Please try again shortly.';
            }

            Log::error('Gemini API Error: ' . $response->body());
            
            return response()->json([
                'success' => false,
                'message_ar' => $errorMessageAr,
                'message_en' => $errorMessageEn,
                'message' => $errorMessageAr
            ], 503);

        } catch (\Exception $e) {
            Log::error('Gemini Exception: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message_ar' => 'حدث خطأ أثناء الاتصال بالخادم.',
                'message_en' => 'An error occurred while connecting to AI.',
                'message' => 'حدث خطأ أثناء الاتصال بالخادم.'
            ], 500);
        }
    }
}
