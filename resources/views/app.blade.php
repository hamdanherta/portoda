<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Portoda - Aplikasi Portofolio Karya Hamdani') }}</title>

    <!-- Meta Tags untuk WhatsApp & Sosmed -->
    <meta name="description" content="Portofolio Resmi Hamdani - Desain Grafis, Multimedia & Pengembang Aplikasi.">
    <meta property="og:title" content="Portoda - Aplikasi Portofolio Karya Hamdani">
    <meta property="og:description"
        content="Portofolio Resmi Hamdani - Desain Grafis, Multimedia & Pengembang Aplikasi.">
    <meta property="og:image" content="https://www.portoda.my.id/og-image.png">
    <meta property="og:image:secure_url" content="https://www.portoda.my.id/og-image.png">
    <meta property="og:image:type" content="image/png">
    <meta property="og:image:width" content="600">
    <meta property="og:image:height" content="600">
    <meta property="og:url" content="https://www.portoda.my.id">
    <meta property="og:type" content="website">
    <link rel="image_src" href="https://www.portoda.my.id/og-image.png">

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