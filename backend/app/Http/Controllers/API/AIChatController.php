<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AIChatController extends Controller
{
    public function chat(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:1000'
        ]);

        $userMessage = strtolower($validated['message']);
        
        // Mock AI Responses based on keywords
        $aiResponse = "I'm here for you. Tell me more about how you're feeling today.";

        if (str_contains($userMessage, 'anxious') || str_contains($userMessage, 'stress')) {
            $aiResponse = "It's completely normal to feel stressed. Have you tried taking a few deep breaths? I can guide you through a quick breathing exercise if you'd like.";
        } elseif (str_contains($userMessage, 'sad') || str_contains($userMessage, 'depress')) {
            $aiResponse = "I'm so sorry you're feeling this way. Remember that it's okay to have tough days. Is there anything specific on your mind?";
        } elseif (str_contains($userMessage, 'happy') || str_contains($userMessage, 'good')) {
            $aiResponse = "That's wonderful to hear! Hold onto that positive feeling. What made today a good day?";
        } elseif (str_contains($userMessage, 'sleep') || str_contains($userMessage, 'tired')) {
            $aiResponse = "Rest is incredibly important for your mental health. Try to create a calming bedtime routine tonight. Unplugging from screens 30 minutes before bed helps.";
        } elseif (str_contains($userMessage, 'help')) {
            $aiResponse = "I'm here to listen and support you. Please remember I'm an AI assistant. If you are in immediate danger or experiencing a crisis, please reach out to emergency services or a trusted loved one.";
        }

        return response()->json([
            'success' => true,
            'data' => [
                'role' => 'assistant',
                'content' => $aiResponse
            ]
        ]);
    }
}
