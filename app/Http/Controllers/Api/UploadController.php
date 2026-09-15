<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    /**
     * Upload base64 image or multipart file to local public storage
     */
    public function upload(Request $request)
    {
        $folder = $request->input('folder', 'images');
        
        // Handle multipart file upload
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filename = time() . '-' . Str::random(8) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs("uploads/{$folder}", $filename, 'public');
            return response()->json([
                'url' => Storage::url($path)
            ]);
        }

        // Handle Base64 Data URL string
        $base64String = $request->input('image') ?? $request->input('file_data');
        if ($base64String && str_starts_with($base64String, 'data:')) {
            preg_match('/data:([^;]+);base64,(.*)/s', $base64String, $matches);
            if (count($matches) === 3) {
                $mimeType = strtolower(trim($matches[1]));
                $data = base64_decode(trim($matches[2]));
                
                $extension = match ($mimeType) {
                    'image/jpeg', 'image/jpg' => 'jpg',
                    'image/png' => 'png',
                    'image/gif' => 'gif',
                    'image/webp' => 'webp',
                    'image/svg+xml' => 'svg',
                    'image/avif' => 'avif',
                    'application/pdf' => 'pdf',
                    default => 'png'
                };

                $filename = time() . '-' . Str::random(8) . '.' . $extension;
                $path = "uploads/{$folder}/{$filename}";
                
                Storage::disk('public')->put($path, $data);

                return response()->json([
                    'url' => Storage::url($path)
                ]);
            }
        }

        // Return original if it's already a URL or path
        return response()->json([
            'url' => $base64String
        ]);
    }
}
