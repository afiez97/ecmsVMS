<?php

$app = new Illuminate\Foundation\Application(
    realpath(__DIR__ . '/../')
);

$app->bind('path.public', function ()
{
    return base_path() . '/public_html';
});

?>