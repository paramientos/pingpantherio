<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
        <script>
            function loadAnalytics() {
                @production
                var nanolytica = document.createElement('script');
                nanolytica.src = 'https://nanolytica.org/nanolytica.js';
                nanolytica.defer = true;
                nanolytica.setAttribute('data-site-id', '62ae56b7-86d0-4b45-bdf2-ad0c72a72a85');
                document.head.appendChild(nanolytica);
                @endproduction
            }

            if (document.readyState === 'complete') {
                loadAnalytics();
            } else {
                window.addEventListener('load', function () {
                    if ('requestIdleCallback' in window) {
                        window.requestIdleCallback(loadAnalytics, { timeout: 2000 });
                    } else {
                        setTimeout(loadAnalytics, 0);
                    }
                });
            }
        </script>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'PingPanther') }}</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">

    @routes
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>

<body>
    @inertia
</body>

</html>
