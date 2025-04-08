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

// hrm_emp_info
$router->post('/addEmployee', 'hrm_emp_infoController@register');
$router->get('/hrmEmpInfo/show/{id}', 'hrm_emp_infoController@show');
$router->get('/lecturerList', 'hrm_emp_infoController@lectList');
$router->get('/hrmEmpInfo/list', 'hrm_emp_infoController@list');
$router->post('/employeeUpdate', 'hrm_emp_infoController@update');

//sad_user -->sso
$router->get('/users/view/{id}', 'sad_userController_sso@view');
$router->get('/users/show/{id}', 'sad_userController@show');
$router->post('/users/create', 'sad_userController_sso@create');
$router->post('/users/login', 'sad_userController_sso@loginSSO');
//sad_user -->non sso
$router->get('/users/show/{id}', 'sad_userController@show');
$router->get('/users/listHepastaff', 'sad_userController@listHepastaff');

$router->get('/users/listUnRole', 'sad_userController@listUnRole');





//hrm_emp_position
$router->get('/employee/position/view/{id}', 'hrm_emp_positionController_sso@show');
$router->post('/employee/position/create', 'hrm_emp_positionController_sso@create');

//hrm_emp_info
$router->get('/employee/view/{id}', 'hrm_emp_infoController_sso@show');
$router->post('/employee/create', 'hrm_emp_infoController_sso@create');
$router->post('/employee/update/', 'hrm_emp_infoController_sso@update');