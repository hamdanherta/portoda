<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'title',
        'experience_type',
        'employment_type',
        'company',
        'period',
        'period_id',
        'period_en',
        'duration_months',
        'description',
        'description_en',
        'media',
    ];

    protected $casts = [
        'media' => 'array',
        'duration_months' => 'integer',
    ];
}
