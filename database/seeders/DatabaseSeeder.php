<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\PortfolioItem;
use App\Models\Profile;
use App\Models\Experience;
use App\Models\Document;
use App\Models\Contact;
use App\Models\Certificate;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (!User::where('email', 'test@example.com')->exists()) {
            User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);
        }

        $this->seedPortfolioItems();
        $this->seedInfo();
    }

    public function seedPortfolioItems(): void
    {
        $items = [
            [
                'id' => 'grafis-1',
                'title' => 'Aetheria Tech Rebranding & Visual Identity',
                'title_en' => 'Aetheria Tech Rebranding & Visual Identity',
                'category' => 'desain-grafis',
                'subcategory' => 'Desain Logo',
                'subcategory_en' => 'Logo Design',
                'description' => 'Konsep identitas visual modern dan sistem desain logo untuk perusahaan teknologi kecerdasan buatan (AI) Aetheria.',
                'description_en' => 'Modern visual identity concept and logo design system for AI technology firm Aetheria.',
                'image_url' => 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
                'cover_image' => 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
                'gallery_images' => ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'],
                'images' => [
                    'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
                ],
                'video_url' => '',
                'prototype_url' => '',
                'client' => 'Aetheria Labs Inc.',
                'year' => '2024',
                'project_type' => 'Freelance',
                'tools_used' => 'Adobe Illustrator, Photoshop, Figma',
                'tags' => ['Brand Identity', 'Logo Design', 'Vector', 'Adobe Illustrator'],
                'featured' => true,
            ],
            [
                'id' => 'grafis-2',
                'title' => 'Cyberpunk Neo Nusantara Concert Poster',
                'title_en' => 'Cyberpunk Neo Nusantara Concert Poster',
                'category' => 'desain-grafis',
                'subcategory' => 'Desain Poster',
                'subcategory_en' => 'Poster',
                'description' => 'Desain poster festival musik futuristik dengan kombinasi elemen budaya Indonesia dan estetika cyberpunk modern.',
                'description_en' => 'Futuristic music festival poster design blending Indonesian cultural motifs with modern cyberpunk aesthetics.',
                'image_url' => 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
                'cover_image' => 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
                'gallery_images' => [],
                'images' => ['https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80'],
                'video_url' => '',
                'prototype_url' => '',
                'client' => 'Soundwave Festival',
                'year' => '2024',
                'project_type' => 'Pekerjaan',
                'tools_used' => 'Adobe Photoshop, Lightroom, CorelDRAW',
                'tags' => ['Poster Art', 'Typography', 'Photoshop', 'Digital Collage'],
                'featured' => true,
            ],
            [
                'id' => 'grafis-3',
                'title' => 'Kopi Nusantara Premium Coffee Packaging Design',
                'title_en' => 'Kopi Nusantara Premium Coffee Packaging Design',
                'category' => 'desain-grafis',
                'subcategory' => 'Desain Kemasan',
                'subcategory_en' => 'Packaging',
                'description' => 'Desain kemasan boks & pouch kopi artisan ramah lingkungan dengan aksen emas ukiran batik modern.',
                'description_en' => 'Eco-friendly artisan coffee box & pouch packaging design featuring modern batik gold accents.',
                'image_url' => 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=1200&q=80',
                'cover_image' => 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=1200&q=80',
                'gallery_images' => [],
                'images' => ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=1200&q=80'],
                'video_url' => '',
                'prototype_url' => '',
                'client' => 'Kopi Nusantara Roastery',
                'year' => '2023',
                'project_type' => 'Freelance',
                'tools_used' => 'Adobe Illustrator, Cinema 4D 3D Packaging',
                'tags' => ['Packaging', 'Dieline', 'Print Design'],
                'featured' => false,
            ],
            [
                'id' => 'multimedia-1',
                'title' => 'Cinematic Bromo Sunset & Milky Way Exploration',
                'title_en' => 'Cinematic Bromo Sunset & Milky Way Exploration',
                'category' => 'multimedia',
                'subcategory' => 'Videografi',
                'subcategory_en' => 'Videography',
                'description' => 'Video dokumenter pendek cinematic 4K yang merekam keindahan sunrise dan pemandangan langit malam di Gunung Bromo.',
                'description_en' => 'Short cinematic 4K documentary film capturing the sunrise beauty and night sky of Mount Bromo.',
                'image_url' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
                'cover_image' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
                'gallery_images' => [],
                'images' => ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'],
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'prototype_url' => '',
                'client' => 'Wonderland Travel Series',
                'year' => '2024',
                'project_type' => 'Pekerjaan',
                'tools_used' => 'Adobe Premiere Pro, After Effects, DaVinci Resolve',
                'tags' => ['Color Grading', 'Drone 4K', 'Premiere Pro', 'Cinematography'],
                'featured' => true,
            ],
            [
                'id' => 'multimedia-2',
                'title' => 'Minimalist Urban Architecture Photography',
                'title_en' => 'Minimalist Urban Architecture Photography',
                'category' => 'multimedia',
                'subcategory' => 'Fotografi',
                'subcategory_en' => 'Photography',
                'description' => 'Seri foto arsitektur gedung perkotaan modern yang menonjolkan geometri, simetri, serta bayangan dramatis.',
                'description_en' => 'Architecture photo series of modern urban structures showcasing geometry, symmetry, and dramatic shadows.',
                'image_url' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
                'cover_image' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
                'gallery_images' => ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'],
                'images' => [
                    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
                ],
                'video_url' => '',
                'prototype_url' => '',
                'client' => 'Personal Exhibition',
                'year' => '2023',
                'project_type' => 'Iseng',
                'tools_used' => 'Adobe Lightroom Classic, Canon EOS R5',
                'tags' => ['Photography', 'Lightroom', 'Architecture', 'Monochrome'],
                'featured' => true,
            ],
            [
                'id' => 'aplikasi-1',
                'title' => 'Portoda — Portfolio Manager & Showcase Web App',
                'title_en' => 'Portoda — Portfolio Manager & Showcase Web App',
                'category' => 'aplikasi',
                'subcategory' => 'Web App',
                'subcategory_en' => 'Web App',
                'description' => 'Aplikasi web portofolio modern dengan performa tinggi, mendukung filter instan dan Dashboard Admin.',
                'description_en' => 'High-performance modern web application portfolio supporting instant filtering and Admin Dashboard.',
                'image_url' => 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
                'cover_image' => 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
                'gallery_images' => ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'],
                'images' => [
                    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'
                ],
                'video_url' => '',
                'prototype_url' => 'https://github.com',
                'client' => 'Portoda Project',
                'year' => '2024',
                'project_type' => 'Iseng',
                'development_method' => 'Vibe Coding',
                'framework' => 'React / Inertia.js',
                'tags' => ['Web Design', 'UI/UX', 'Showcase System'],
                'featured' => true,
            ],
            [
                'id' => 'aplikasi-2',
                'title' => 'HealthPulse — Smart Fitness Tracker App',
                'title_en' => 'HealthPulse — Smart Fitness Tracker App',
                'category' => 'aplikasi',
                'subcategory' => 'Mobile App',
                'subcategory_en' => 'Mobile App',
                'description' => 'Desain dan pengembangan aplikasi mobile pelacak kebugaran dengan visualisasi data statistik real-time.',
                'description_en' => 'Design and development of a smart mobile fitness tracker app featuring real-time statistical data visualization.',
                'image_url' => 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
                'cover_image' => 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
                'gallery_images' => [],
                'images' => ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80'],
                'video_url' => '',
                'prototype_url' => 'https://figma.com',
                'client' => 'PulseFit Tech',
                'year' => '2024',
                'project_type' => 'Pekerjaan',
                'development_method' => 'Manual Coding (Full Stack)',
                'framework' => 'Flutter / Dart',
                'tags' => ['Flutter', 'Mobile Design', 'Dark UI', 'iOS/Android'],
                'featured' => true,
            ],
            [
                'id' => 'aplikasi-3',
                'title' => 'Nusantara Pay — Digital Wallet UI/UX Design System',
                'title_en' => 'Nusantara Pay — Digital Wallet UI/UX Design System',
                'category' => 'aplikasi',
                'subcategory' => 'UI/UX',
                'subcategory_en' => 'UI/UX',
                'description' => 'Riset pengguna dan perancangan desain antarmuka (UI/UX) dompet digital modern dengan sistem pembayaran QRIS instan.',
                'description_en' => 'User research and UI/UX design system for a modern digital wallet app with instant QRIS payment integration.',
                'image_url' => 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
                'cover_image' => 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
                'gallery_images' => [],
                'images' => ['https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80'],
                'video_url' => '',
                'prototype_url' => 'https://figma.com',
                'client' => 'Nusantara Financial',
                'year' => '2024',
                'project_type' => 'Freelance',
                'tools_used' => 'Figma, FigJam, Maze, Adobe Illustrator',
                'platform' => 'Mobile & Website',
                'tags' => ['UI/UX', 'Figma Prototype', 'Fintech', 'Design System'],
                'featured' => true,
            ]
        ];

        foreach ($items as $item) {
            PortfolioItem::updateOrCreate(['id' => $item['id']], $item);
        }
    }

    public function seedInfo(): void
    {
        $this->seedProfile();

        $experiences = [
            [
                'id' => 'exp-1',
                'title' => 'Senior Graphic & UI/UX Designer',
                'company' => 'Rajasa Creative Project & Client Projects',
                'period' => '2022 — Present',
                'period_id' => '2022 — Sekarang',
                'period_en' => '2022 — Present',
                'duration_months' => 10,
                'description' => "• Merancang sistem identitas visual brand, rebranding logo perusahaan, dan desain kemasan produk.\n• Meriset dan merancang prototipe antarmuka UI/UX untuk aplikasi seluler dan platform web digital.",
                'description_en' => "• Designing visual brand identity systems, corporate logo rebranding, and product packaging.\n• Researching & designing UI/UX interface prototypes for mobile apps and web platforms.",
                'media' => [
                    'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
                ]
            ],
            [
                'id' => 'exp-2',
                'title' => 'Multimedia Specialist & Videographer',
                'company' => 'Soundwave & Cinematic Production',
                'period' => '2020 — 2022',
                'period_id' => '2020 — 2022',
                'period_en' => '2020 — 2022',
                'duration_months' => 8,
                'description' => "• Memproduksi video dokumenter sinematik 4K, video iklan komersial, dan animasi motion graphic 3D.\n• Melakukan sesi fotografi arsitektur, lanskap, dan liputan event berskala besar.",
                'description_en' => "• Producing 4K cinematic documentary videos, commercial ads, and 3D motion graphics animation.\n• Architectural and landscape photography sessions, plus large-scale event coverage.",
                'media' => [
                    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80'
                ]
            ],
            [
                'id' => 'exp-3',
                'title' => 'Web Application Developer',
                'company' => 'Portoda & Independent Digital Studio',
                'period' => '2021 — Present',
                'period_id' => '2021 — Sekarang',
                'period_en' => '2021 — Present',
                'duration_months' => 4,
                'description' => "• Mengembangkan aplikasi web sistem manajemen portofolio interaktif.\n• Membangun solusi web custom yang cepat, terstruktur, dan responsif di seluruh perangkat.",
                'description_en' => "• Developing interactive web portfolio showcase and management systems.\n• Building fast, structured, and responsive custom web solutions across all devices.",
                'media' => [
                    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80'
                ]
            ]
        ];

        foreach ($experiences as $exp) {
            Experience::updateOrCreate(['id' => $exp['id']], $exp);
        }

        $documents = [
            [
                'id' => 'doc-1',
                'title' => 'CV ATS Hamdani',
                'title_en' => 'Hamdani ATS Resume',
                'type' => 'Curriculum Vitae (ATS Friendly)',
                'type_en' => 'Curriculum Vitae (ATS Friendly)',
                'description' => 'Format standar resmi berstandar Sistem ATS yang mudah dibaca oleh HRD perusahaan.',
                'description_en' => 'Official ATS-standard resume format optimized for corporate HR scanners.',
                'file_url' => '/documents/CV_ATS_Hamdani.pdf',
                'file_name' => 'CV_ATS_Hamdani.pdf'
            ],
            [
                'id' => 'doc-2',
                'title' => 'CV Kreatif Hamdani',
                'title_en' => 'Hamdani Creative CV',
                'type' => 'Visual Creative CV',
                'type_en' => 'Visual Creative CV',
                'description' => 'Desain kurikulum vitae visual modern yang menonjolkan estetika dan keahlian desain.',
                'description_en' => 'Modern visual creative CV highlighting design aesthetics and portfolio skills.',
                'file_url' => '/documents/CV_Kreatif_Hamdani.pdf',
                'file_name' => 'CV_Kreatif_Hamdani.pdf'
            ],
            [
                'id' => 'doc-3',
                'title' => 'Portofolio PDF Hamdani',
                'title_en' => 'Hamdani PDF Portfolio',
                'type' => 'Dokumen Showcase Karya PDF',
                'type_en' => 'PDF Work Showcase Document',
                'description' => 'Kumpulan dokumentasi karya pilihan Desain Grafis, Multimedia, dan Aplikasi dalam format PDF.',
                'description_en' => 'Selected portfolio documentation covering Graphic Design, Multimedia, and Apps in PDF.',
                'file_url' => '/documents/Portofolio_Hamdani.pdf',
                'file_name' => 'Portofolio_Hamdani.pdf'
            ],
            [
                'id' => 'doc-4',
                'title' => 'Transkrip Nilai & Sertifikasi',
                'title_en' => 'Academic Transcripts & Certificates',
                'type' => 'Berkas Akademik & Sertifikat',
                'type_en' => 'Academic Records & Credentials',
                'description' => 'Salinan resmi transkrip nilai akademik beserta sertifikat kompetensi keahlian.',
                'description_en' => 'Official copy of academic transcripts and professional skill competency certificates.',
                'file_url' => '/documents/Transkrip_Nilai_Hamdani.pdf',
                'file_name' => 'Transkrip_Nilai_Hamdani.pdf'
            ]
        ];

        foreach ($documents as $doc) {
            Document::updateOrCreate(['id' => $doc['id']], $doc);
        }

        $contacts = [
            [
                'id' => 'contact-1',
                'title' => 'WhatsApp Direct',
                'title_en' => 'Direct WhatsApp',
                'value' => '+62 812-3456-7890',
                'url' => 'https://wa.me/6281234567890',
                'type' => 'whatsapp',
                'subtext' => 'Chat via WhatsApp',
                'subtext_en' => 'Chat via WhatsApp'
            ],
            [
                'id' => 'contact-2',
                'title' => 'Email Resmi',
                'title_en' => 'Official Email',
                'value' => 'hamdani@example.com',
                'url' => 'mailto:hamdani@example.com',
                'type' => 'email',
                'subtext' => 'Kirim Email',
                'subtext_en' => 'Send Email'
            ],
            [
                'id' => 'contact-3',
                'title' => 'Instagram Portfolio',
                'title_en' => 'Instagram Portfolio',
                'value' => '@hamdanicreative',
                'url' => 'https://instagram.com',
                'type' => 'social',
                'subtext' => 'Kunjungi Instagram',
                'subtext_en' => 'Visit Instagram'
            ]
        ];

        foreach ($contacts as $c) {
            Contact::updateOrCreate(['id' => $c['id']], $c);
        }

        $certificates = [
            [
                'id' => 'cert-1',
                'title' => 'Sertifikasi International UI/UX Design Masterclass',
                'description' => 'Sertifikasi keahlian tingkat lanjut dalam riset pengguna, wireframing, prototyping interaktif, serta pengujian kebolehgunaan aplikasi.',
                'category' => 'Sertifikasi',
                'year' => '2024',
                'institution' => 'Google & Coursera Creative Academy',
                'cover' => 'https://images.unsplash.com/photo-1589330694653-aded6fac0244?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1589330694653-aded6fac0244?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80'
                ]
            ],
            [
                'id' => 'cert-2',
                'title' => 'Penghargaan Desainer Visual Terbaik 2023',
                'description' => 'Penghargaan atas keunggulan perancangan identitas visual brand dan inovasi kampanye media kreatif digital.',
                'category' => 'Penghargaan',
                'year' => '2023',
                'institution' => 'Indonesia Creative Design Association',
                'cover' => 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=1200&q=80'
                ]
            ],
            [
                'id' => 'cert-3',
                'title' => 'Pelatihan Intensif Full-Stack Web Development',
                'description' => 'Pelatihan pembuatan aplikasi web modern menggunakan React, Node.js, REST API, dan manajemen database.',
                'category' => 'Pelatihan',
                'year' => '2022',
                'institution' => 'Digital Skill Bootcamp Indonesia',
                'cover' => 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80'
                ]
            ]
        ];

        foreach ($certificates as $cert) {
            Certificate::updateOrCreate(['id' => $cert['id']], $cert);
        }
    }

    public function seedProfile(): void
    {
        Profile::updateOrCreate(
            ['id' => 1],
            [
                'name' => 'Hamdani',
                'tagline' => 'Graphic Designer',
                'tagline_en' => 'Graphic Designer',
                'bio' => 'Seorang desainer kreatif dan pengembang aplikasi berpengalaman yang berdedikasi menciptakan karya berkualitas tinggi. Berfokus pada perancangan identitas visual brand, sinematografi, animasi motion graphic, serta pengembangan aplikasi web dan seluler modern.',
                'bio_en' => 'A creative designer and experienced application developer dedicated to crafting high-quality works. Focused on visual brand identity, cinematography, 3D motion graphics, and modern web & mobile applications.',
                'domisili' => 'Kota Jambi, Indonesia',
                'domisili_en' => 'Jambi City, Indonesia',
                'tempat_tinggal' => 'Kota Jambi, Indonesia',
                'tempat_tinggal_en' => 'Jambi City, Indonesia',
                'ttl' => 'Jambi, 14 Mei 1998',
                'ttl_en' => 'Jambi, May 14, 1998',
                'skills' => [
                    ['id' => 'skill-1', 'title' => 'Desain Grafis', 'title_en' => 'Graphic Design', 'desc' => 'Desain Logo, Poster, Banner, Kemasan, Lainnya.', 'desc_en' => 'Logo, Poster, Banner, Packaging & Visual Branding Design.'],
                    ['id' => 'skill-2', 'title' => 'Multimedia', 'title_en' => 'Multimedia', 'desc' => 'Fotografi, Videografi, Motion Graphic, Film', 'desc_en' => 'Photography, 4K Videography, 3D Motion Graphics, Documentary Film.'],
                    ['id' => 'skill-3', 'title' => 'Pengembangan Aplikasi', 'title_en' => 'App Development', 'desc' => 'Mobile UI/UX, Mobile App, Web App.', 'desc_en' => 'UI/UX Research, Design System, Mobile & Web App.']
                ]
            ]
        );
    }
}
