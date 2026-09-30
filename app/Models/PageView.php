<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PageView extends Model
{
    use HasFactory;

    protected $fillable = [
        'ip_address',
        'url',
        'path',
        'karya_id',
        'session_id',
        'device_type',
        'country',
        'city',
        'view_date',
    ];

    protected $casts = [
        'view_date' => 'date',
    ];
}
