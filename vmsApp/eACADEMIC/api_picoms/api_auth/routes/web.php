<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});

$router->get('key', function () {
    return MD5('PICOMS-PROTIGAT');
});

// sad_users
$router->post('/login','authController@login');
$router->post('/sadUsers/chkUser','authController@chkUser');
$router->post('/sadUsers/checKingPassword','authController@checKingPassword');
$router->post('/sadUsers/updatePassword','authController@updatePassword');



// realtime counter
$router->get('/getCounts/MenuSide', 'authController@getCounts');
$router->get('/getCounts/MenuSide/getCountsHepa', 'authController@getCountsHepa');

// mis_std_info
// $router->post('/misStdInfo/login','mis_std_infoController@login');
// $router->get('/misStdInfo/show/{id}','mis_std_infoController@show');