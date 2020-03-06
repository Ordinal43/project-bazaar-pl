<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <meta name="theme-color" content="#512DA8"/>

        <title>Bazaar PL</title>
        <link rel="stylesheet" sizes="192x192" href="{{ mix('/css/app.css') }}">
    </head>
    <body>
        <div id="app">
            <app-root></app-root>
        </div>
    </body>
    <script src="{{ mix('/js/app.js') }}"></script>
</html>
