<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Medication extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'dosage',
        'dosage_unit',
        'frequency_type',
        'duration_days',
        'start_date',
        'end_date',
        'reminder_times',
        'total_pills',
        'refill_reminder_threshold',
        'notes',
        'status',
    ];

    protected $casts = [
        'reminder_times' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function intakes()
    {
        return $this->hasMany(MedicationIntake::class);
    }
}
