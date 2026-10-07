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
        'tagline_mgd',
        'tagline_mgd_en',
        'tagline_dpd',
        'tagline_dpd_en',
        'tagline_ms',
        'tagline_ms_en',
        'bio',
        'bio_en',
        'bio_mgd',
        'bio_mgd_en',
        'bio_dpd',
        'bio_dpd_en',
        'bio_ms',
        'bio_ms_en',
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
        'content_notice_title',
        'content_notice_message',
    ];

    protected $casts = [
        'skills' => 'array',
        'watermark_enabled' => 'boolean',
        'maintenance_mode' => 'boolean',
        'content_notice_enabled' => 'boolean',
    ];
}
