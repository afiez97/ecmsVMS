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

//mis_atd_policy
$router->get('/policyAtdShow', 'mis_atd_policyController@show');
$router->post('/policyAtdUpdate', 'mis_atd_policyController@register');

//sad_groupuser
$router->get('/userGroupList', 'sad_groupuserController@list');

// mis_exam_policy_date
$router->post('/addPolicyExam', 'mis_exam_policy_dateController@register');
$router->post('/policyExam/(id)', 'mis_exam_policy_dateController@show');
$router->get('/policyExamList', 'mis_exam_policy_dateController@list');
$router->post('/policyExamUpdate', 'mis_exam_policy_dateController@update');
$router->post('/policyExamDelete', 'mis_exam_policy_dateController@delete');

// mis_tbl_policy
$router->get('/tblPolicy', 'mis_tbl_policyController@show');
$router->post('/tblPolicyUpdate', 'mis_tbl_policyController@update');

// mis_aca_class_policy
$router->get('/acaClassPolicy', 'mis_aca_class_policyController@show');
$router->post('/acaClassPolicyUpdate', 'mis_aca_class_policyController@update');

// mis_addDrop_policy
$router->get('/addDropPolicy', 'mis_addDrop_policyController@show');
$router->post('/addDropPolicyUpdate', 'mis_addDrop_policyController@update');