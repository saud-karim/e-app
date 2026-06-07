<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MoodLog extends Model
{
    protected $fillable = [
        'user_id',
        'mood_level',
        'anxiety_level',
        'sleep_hours',
        'journal_notes',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
