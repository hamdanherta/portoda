<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'tagline',
        'tagline_en',
        'bio',
        'bio_en',
        'domisili',
        'domisili_en',
        'tempat_tinggal',
        'tempat_tinggal_en',
        'ttl',
        'ttl_en',
        'skills',
        'watermark_enabled',
        'maintenance_mode',
        'content_notice_enabled',
    ];

    protected $casts = [
        'skills' => 'array',
        'watermark_enabled' => 'boolean',
        'maintenance_mode' => 'boolean',
        'content_notice_enabled' => 'boolean',
    ];
}
