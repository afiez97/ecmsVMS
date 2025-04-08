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

// mis_lecturer_course_prm
$router->post('/misLectCrsPrm/register', 'mis_lecturer_course_prmController@register');
$router->get('/misLectCrsPrm/list/{id}', 'mis_lecturer_course_prmController@list');
$router->get('/misLectCrsPrm/show/{id}', 'mis_lecturer_course_prmController@show');
$router->post('/misLectCrsPrm/update', 'mis_lecturer_course_prmController@update');
$router->post('/misLectCrsPrm/delete', 'mis_lecturer_course_prmController@delete');
$router->get('/misLectCrsPrm/listByCotDet/{id}', 'mis_lecturer_course_prmController@listByCotDet');
$router->get('/misLectCrsPrm/listByCotDet/cte/{id}/{std_studentid}', 'mis_lecturer_course_prmController@listByCotDetForCTE');
$router->get('/misLectCrsPrm/chkFinalExam/{fk_cotDet}', 'mis_lecturer_course_prmController@chkFinalExam');
$router->post('/misLectCrsPrm/findId', 'mis_lecturer_course_prmController@findId');
$router->get('/misLectCrsPrm/listCourse/{id}', 'mis_lecturer_course_prmController@listCourse');
$router->get('/misLectCrsPrm/crsGrpbyLect/{id}', 'mis_lecturer_course_prmController@crsGrpbyLect');
$router->post('/misLectCrsPrm/listAcaCalLect', 'mis_lecturer_course_prmController@listAcaCalLect');
$router->post('/misLectCrsPrm/update/final', 'mis_lecturer_course_prmController@uptFinalExam');

// lecturer course detail
$router->post('/misLectCrsDet/register', 'mis_lecturer_course_detailController@register');
$router->post('/misLectCrsDet/listAss', 'mis_lecturer_course_detailController@listAss');
$router->get('/misLectCrsDet/listByLectCrs/{id}', 'mis_lecturer_course_detailController@listByLectCrs');
$router->post('/misLectCrsDet/update', 'mis_lecturer_course_detailController@update');
$router->post('/misLectCrsDet/delete', 'mis_lecturer_course_detailController@delete');
$router->post('/misLectCrsDet/listSubItem', 'mis_lecturer_course_detailController@listSubItem');

// lecturer course teaching time
$router->post('/misLectTeachTime/register', 'mis_lecturer_teach_timeController@register');
$router->get('/misLectTeachTime/show/{id}', 'mis_lecturer_teach_timeController@show');
$router->post('/misLectTeachTime/update', 'mis_lecturer_teach_timeController@update');

// mis_lecturer_stdmark
$router->post('/misLectStdMark/register', 'mis_lecturer_stdmarkController@register');
$router->post('/misLectStdMark/register2', 'mis_lecturer_stdmarkController@register2');
// $router->post('/misLectStdMark/register2', 'mis_lecturer_stdmarkController@register2');
$router->post('/misLectStdMark/chkStdMark', 'mis_lecturer_stdmarkController@chkStdMark');
$router->post('/misLectStdMark/chkStdMark2', 'mis_lecturer_stdmarkController@chkStdMark2');
$router->post('/misLectStdMark/chkStdMark3', 'mis_lecturer_stdmarkController@chkStdMark3');
// $router->post('/misLectStdMark/chkStdMark2', 'mis_lecturer_stdmarkController@chkStdMark2');
$router->post('/misLectStdMark/update', 'mis_lecturer_stdmarkController@update');
$router->post('/misLectStdMark/update2', 'mis_lecturer_stdmarkController@update2');
$router->post('/misLectStdMark/updateCLOMark', 'mis_lecturer_stdmarkController@updateCLOMark');
// $router->post('/misLectStdMark/update2', 'mis_lecturer_stdmarkController@update2');
$router->get('/misLectStdMark/findMark/{id}/{std}', 'mis_lecturer_stdmarkController@findMark');
$router->get('/misLectStdMark/findMark2/{id}/{std}/{idClo}', 'mis_lecturer_stdmarkController@findMark2');
// $router->get('/misLectStdMark/findMark2/{id}/{std}/{idClo}', 'mis_lecturer_stdmarkController@findMark2');

// hrm_emp_position
$router->get('/hrmEmpPosition/list/{id}', 'hrm_emp_positionController@list');

//sub_mis_lecturer_course_detail

$router->get('/subMisLecCourse/show/{id}', 'sub_mis_lecturer_course_detailController@show');
$router->post('/subMisLecCourse/register', 'sub_mis_lecturer_course_detailController@register');
$router->post('/subMisLecCourse/delete', 'sub_mis_lecturer_course_detailController@delete');
$router->post('/subMisLecCourse/update', 'sub_mis_lecturer_course_detailController@update');

// //sub_mis_lecturer_course_detail

// $router->get('/subMisLecCourse/show/{id}', 'sub_mis_lecturer_course_detailController@show');
// $router->post('/subMisLecCourse/register', 'sub_mis_lecturer_course_detailController@register');
// $router->post('/subMisLecCourse/delete', 'sub_mis_lecturer_course_detailController@delete');
// $router->post('/subMisLecCourse/update', 'sub_mis_lecturer_course_detailController@update');
