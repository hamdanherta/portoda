<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PortfolioItem;
use Illuminate\Support\Facades\File;

class PesonaPortfolioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonPath = base_path('karya_pesona_group.json');
        if (!File::exists($jsonPath)) {
            $this->command->error("File karya_pesona_group.json tidak ditemukan!");
            return;
        }

        $items = json_decode(File::get($jsonPath), true);
        $sourceDir = base_path('images_pesona');
        $targetDir = public_path('storage/portfolio');

        // Pastikan direktori tujuan tersedia
        if (!File::isDirectory($targetDir)) {
            File::makeDirectory($targetDir, 0755, true);
        }

        $this->command->info("Memulai import " . count($items) . " karya Pesona Group...");

        $copiedCount = 0;
        foreach ($items as $item) {
            $filename = $item['source_file'] ?? null;
            if ($filename) {
                $sourceFile = $sourceDir . DIRECTORY_SEPARATOR . $filename;
                $targetFile = $targetDir . DIRECTORY_SEPARATOR . $filename;

                if (File::exists($sourceFile) && !File::exists($targetFile)) {
                    File::copy($sourceFile, $targetFile);
                    $copiedCount++;
                }
            }

            unset($item['source_file']);

            PortfolioItem::updateOrCreate(
                ['id' => $item['id']],
                $item
            );
        }

        $this->command->info("Berhasil! {$copiedCount} file gambar disalin ke {$targetDir}.");
        $this->command->info("Berhasil menyimpan " . count($items) . " data karya Pesona Group ke tabel portfolio_items.");
    }
}
