<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    protected $fillable = [
        'user_id', 'age', 'gender', 'chronic_diseases', 
        'allergies', 'emergency_contact_name', 'emergency_contact_phone'
    ];

    protected function casts(): array
    {
        return [
            'chronic_diseases' => 'array',
            'allergies' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
