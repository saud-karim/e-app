<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicationIntake extends Model
{
    protected $fillable = [
        'user_id',
        'medication_id',
        'scheduled_time',
        'taken_time',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function medication()
    {
        return $this->belongsTo(Medication::class);
    }
}
