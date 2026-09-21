<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'title',
        'description',
        'category',
        'year',
        'institution',
        'cover',
        'gallery',
        'sort_order',
    ];

    protected $casts = [
        'gallery' => 'array',
    ];
}
