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

// $router->get('/programDropdownList','pub_programController@list');
$router->get('/paymentTypeList','pub_payment_typeController@list');
$router->get('/genderList','mis_genderController@list');
$router->get('/nationalityList','mis_nationalityController@list');
$router->get('/raceList','mis_raceController@list');
$router->get('/nativeList','mis_nativeController@list');
$router->get('/religionList','mis_religionController@list');
$router->get('/okuList','mis_status_okuController@list');
$router->get('/bloodTypeList','mis_blood_typeController@list');
$router->get('/stateList','mis_stateController@list');
$router->get('/paymentViaList','srg_payment_viaController@list');
$router->get('/muetList','mis_muetController@list');
$router->get('/gradeList','gradeController@list');
$router->get('/statusList','mis_statusController@list');
$router->get('/livingList','mis_std_living_withController@list');
$router->get('/parentList','mis_status_parentsController@list');
$router->get('/negeriList','sys_negeriController@list');


