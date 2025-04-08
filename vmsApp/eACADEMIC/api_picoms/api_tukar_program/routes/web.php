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
    return MD5('PICOMS');
});

$router->post('/tukarProgramView','mis_std_chg_programController@show');
$router->get('/tukarProgramList','mis_std_chg_programController@list');
// $router->post('/tukarProgramStudentView','mis_std_chg_programController@showDetails');
$router->post('/tukarProgramReg','mis_std_chg_programController@create');
$router->post('/tukarProgramApp','mis_std_chg_programController@update_approval');