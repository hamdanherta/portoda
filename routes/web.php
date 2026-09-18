<?php

use App\Http\Controllers\ProfileController;
use App\Models\PortfolioItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Inertia\Inertia;

Route::get('/', function (Request $request) {
    $karyaId = $request->query('karya');
    $ogData = null;

    if ($karyaId) {
        $item = PortfolioItem::find($karyaId);
        if ($item) {
            $img = $item->image_url ?: $item->cover_image;
            if ($img && !str_starts_with($img, 'http')) {
                $img = url($img);
            }
            $ogData = [
                'title' => 'Portoda - ' . $item->title,
                'description' => Str::limit(strip_tags($item->description ?? ''), 150),
                'image' => $img ?: url('/logoblue.png'),
                'url' => url('/?karya=' . $item->id),
            ];
        }
    }

    return Inertia::render('App', [
        'ogData' => $ogData,
        'karyaId' => $karyaId
    ]);
});

Route::get('/karya/{id}', function ($id) {
    $item = PortfolioItem::find($id);
    $ogData = null;

    if ($item) {
        $img = $item->image_url ?: $item->cover_image;
        if ($img && !str_starts_with($img, 'http')) {
            $img = url($img);
        }
        $ogData = [
            'title' => 'Portoda - ' . $item->title,
            'description' => Str::limit(strip_tags($item->description ?? ''), 150),
            'image' => $img ?: url('/logoblue.png'),
            'url' => url('/karya/' . $item->id),
        ];
    }

    return Inertia::render('App', [
        'ogData' => $ogData,
        'karyaId' => $id
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
