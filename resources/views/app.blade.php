<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    @php
        $og = $page['props']['ogData'] ?? null;
        $ogTitle = $og['title'] ?? 'Portoda - Aplikasi Portofolio Karya Hamdani';
        $ogDesc = $og['description'] ?? 'Portofolio Resmi Hamdani - Desain Grafis, Multimedia & Pengembang Aplikasi.';
        $ogImage = $og['image'] ?? 'https://www.portoda.my.id/displaypaste.webp';
        $ogUrl = $og['url'] ?? 'https://www.portoda.my.id';
    @endphp

    <title inertia>{{ $ogTitle }}</title>

    <!-- Meta Tags untuk WhatsApp & Sosmed -->
    <meta name="description" content="{{ $ogDesc }}">
    <meta property="og:site_name" content="Portoda">
    <meta property="og:title" content="{{ $ogTitle }}">
    <meta property="og:description" content="{{ $ogDesc }}">
    <meta property="og:image" content="{{ $ogImage }}">
    <meta property="og:image:secure_url" content="{{ $ogImage }}">
    <meta property="og:image:type" content="image/webp">
    <meta property="og:url" content="{{ $ogUrl }}">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $ogTitle }}">
    <meta name="twitter:description" content="{{ $ogDesc }}">
    <meta name="twitter:image" content="{{ $ogImage }}">
    <link rel="image_src" href="{{ $ogImage }}">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>