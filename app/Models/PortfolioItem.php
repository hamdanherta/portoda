<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PortfolioItem extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'title',
        'title_en',
        'category',
        'subcategory',
        'subcategory_en',
        'description',
        'description_en',
        'image_url',
        'cover_image',
        'gallery_images',
        'images',
        'video_url',
        'prototype_url',
        'client',
        'year',
        'project_type',
        'tools_used',
        'development_method',
        'framework',
        'platform',
        'role',
        'tags',
        'featured',
        'sort_order',
    ];

    protected $casts = [
        'gallery_images' => 'array',
        'images' => 'array',
        'tags' => 'array',
        'featured' => 'boolean',
    ];
}
