<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicalReport extends Model
{
    protected $fillable = [
        'user_id', 'file_path', 'original_name'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
