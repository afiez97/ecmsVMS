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
$router->get('/sadGroupuser/list', 'sad_groupuserController@list');

// mis_exam_policy_date
$router->post('/misExamPolicyDate/register', 'mis_exam_policy_dateController@register');
$router->post('/policyExam/(id)', 'mis_exam_policy_dateController@show');
$router->get('/misExamPolicyDate/list', 'mis_exam_policy_dateController@list');
$router->post('/misExamPolicyDate/update', 'mis_exam_policy_dateController@update');
$router->post('/policyExamDelete', 'mis_exam_policy_dateController@delete');
// $router->get('/policyExamGet/{id}', 'mis_exam_policy_dateController@policyExamGet');

// mis_tbl_policy
$router->get('/tblPolicy', 'mis_tbl_policyController@show');
$router->post('/tblPolicyUpdate', 'mis_tbl_policyController@update');

// mis_aca_class_policy
$router->get('/acaClassPolicy', 'mis_aca_class_policyController@show');
$router->post('/acaClassPolicyUpdate', 'mis_aca_class_policyController@update');

// mis_adddrop_policy
$router->get('/misAdddropPol/show', 'mis_addDrop_policyController@show');
$router->post('/misAdddropPol/register', 'mis_addDrop_policyController@register');
$router->post('/misAdddropPol/update', 'mis_addDrop_policyController@update');
$router->post('/misAdddropPol/delete', 'mis_addDrop_policyController@delete');
$router->get('/misAdddropPol/list', 'mis_addDrop_policyController@list');
$router->get('/misAdddropPol/listActive', 'mis_addDrop_policyController@listActive');
$router->get('/misAdddropPol/listByCalCatActive/{id}', 'mis_addDrop_policyController@listByCalCatActive');