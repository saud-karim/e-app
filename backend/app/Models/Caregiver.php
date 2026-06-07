<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Caregiver extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'relation'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
