<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'PingPanther') }}</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">

    @routes
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
    
    <!-- Umami Analytics -->
<script defer src="https://cloud.umami.is/script.js" data-website-id="53f58a7e-ec66-4997-afa8-a5564a047be8"></script>
</head>

<body>
    @inertia
</body>

</html>
