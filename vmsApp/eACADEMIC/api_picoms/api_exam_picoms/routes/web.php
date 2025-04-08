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

$router->get('/', function () use ($router){
    return $router->app->version();
});

$router->get('key', function () {
    return MD5('PICOMS-PROTIGAT');
});

//mis_exam_timetable
$router->post('/misExamTimetbl/register', 'mis_exam_timetableController@register');
$router->get('/misExamTimetbl/list', 'mis_exam_timetableController@list');
$router->get('/misExamTimetbl/show/{id}', 'mis_exam_timetableController@show');
$router->post('/misExamTimetbl/update', 'mis_exam_timetableController@update');
$router->post('/misExamTimetbl/delete', 'mis_exam_timetableController@delete');
$router->post('/misExamTimetbl/showByCalCrs', 'mis_exam_timetableController@showByCalCrs');
$router->post('/misExamTimetbl/showByCalCrs2', 'mis_exam_timetableController@showByCalCrs2');
$router->get('/misExamTimetbl/groupBySem/{id}', 'mis_exam_timetableController@groupBySem');
$router->post('/misExamTimetbl/listByPgmSem', 'mis_exam_timetableController@listByPgmSem');
$router->get('/misExamTimetbl/showByCotDet/{id}', 'mis_exam_timetableController@showByCotDet');

// mis_exam_grading
$router->post('/misExamGrading/register', 'mis_exam_gradingController@register');
$router->post('/misExamGrading/getGrade', 'mis_exam_gradingController@getGrade');
$router->get('/misExamGrading/listUndergrad/{id}', 'mis_exam_gradingController@listUndergrad');
$router->get('/misExamGrading/show/{id}', 'mis_exam_gradingController@show');
$router->post('/misExamGrading/update', 'mis_exam_gradingController@update');
$router->post('/misExamGrading/delete', 'mis_exam_gradingController@delete');

// mis_exam_center
$router->post('/misExamCenter/register', 'mis_exam_centerController@register');
$router->get('/misExamCenter/list', 'mis_exam_centerController@list');
$router->post('/misExamCenter/update', 'mis_exam_centerController@update');
$router->post('/misExamCenter/delete', 'mis_exam_centerController@delete');
$router->get('/misExamCenter/listByCampus/{id}', 'mis_exam_centerController@listByCampus');
$router->get('/misExamCenter/listByCamAct/{id}', 'mis_exam_centerController@listByCamAct');

// mis_exam_type
$router->post('/addExmType', 'mis_exam_typeController@register');
$router->get('/misExamType/list', 'mis_exam_typeController@list');
$router->post('/misExamType/update', 'mis_exam_typeController@update');
$router->post('/misExamType/delete', 'mis_exam_typeController@delete');

// student
$router->get('/listStudent', 'mis_std_infoController@list');

// mis_quality_point
$router->get('/misQualityPoint/list', 'mis_quality_pointController@list');

// grd_category
$router->get('/grdCategory/list', 'grd_categoryController@list');

//mis_exam_student
$router->post('/misExamStd/register', 'mis_exam_studentController@register');
$router->get('/misExamStd/listByExam/{id}', 'mis_exam_studentController@listByExam');
$router->get('/misExamStd/listByExam_resit/{id}', 'mis_exam_studentController@listByExam_resit');

$router->post('/misExamStd/uptStatus', 'mis_exam_studentController@uptStatus');
$router->post('/misExamStd/uptAttndnc', 'mis_exam_studentController@uptAttndnc');
$router->get('/misExamStd/chkStdExist/{id}', 'mis_exam_studentController@chkStdExist');
$router->post('/misExamStd/uptTblNo', 'mis_exam_studentController@uptTblNo');
$router->post('/misExamStd/chkExist', 'mis_exam_studentController@chkExist');
$router->post('/misExamStd/resetTblNo', 'mis_exam_studentController@resetTblNo');
$router->post('/misExamStd/listByExamVenue', 'mis_exam_studentController@listByExamVenue');
$router->post('/misExamStd/listAttendance', 'mis_exam_studentController@attendanceListCrs');
$router->post('/misExamStd/stdAttendance', 'mis_exam_studentController@attendanceStdCrs');
$router->post('/misExamStd/stdAttendanceByCrsReg', 'mis_exam_studentController@stdAttendanceByCrsReg');
$router->get('/misExamStd/chkStdAttExam/{rsb}', 'mis_exam_studentController@chkStdAttExam');

// mis_exam_application
$router->post('/misExamApp/register', 'mis_exam_applicationController@register');
$router->post('/misExamApp/registerRecheckResit', 'mis_exam_applicationController@registerRecheckResit');
$router->get('/misExamApp/list', 'mis_exam_applicationController@list');
$router->get('/misExamApp/show/{id}', 'mis_exam_applicationController@show');
$router->post('/misExamApp/update', 'mis_exam_applicationController@update');
$router->post('/misExamApp/uptSttsSchool', 'mis_exam_applicationController@uptSttsSchool');
$router->post('/misExamApp/uptSttsFnncDep', 'mis_exam_applicationController@uptSttsFnncDep');
$router->post('/misExamApp/uptSttsExmUnit', 'mis_exam_applicationController@uptSttsExmUnit');
$router->post('/misExamApp/delete', 'mis_exam_applicationController@delete');
$router->post('/misExamApp/updCompleted', 'mis_exam_applicationController@updCompleted');
$router->post('/misExamApp/updReset', 'mis_exam_applicationController@updReset');


// mis_exam_papertype
$router->get('/misExamPprType/list', 'mis_exam_papertypeController@list');

// mis_exam_invigilator
$router->post('/misExamInvgltr/register', 'mis_exam_invigilatorController@register');
$router->get('/misExamInvgltr/listByExmVenue/{id}', 'mis_exam_invigilatorController@listByExmVenue');
$router->post('/misExamInvgltr/chkExmInvgltr', 'mis_exam_invigilatorController@chkExmInvgltr');
$router->post('/misExamInvgltr/update', 'mis_exam_invigilatorController@update');
$router->post('/misExamInvgltr/delete', 'mis_exam_invigilatorController@delete');
$router->post('/misExamInvgltr/listByCalLect', 'mis_exam_invigilatorController@listByCalLect');
$router->get('/misExamInvgltr/show/{id}', 'mis_exam_invigilatorController@show');
$router->get('/misExamInvgltr/CheckInvigilator/{fk_exmTimetbl}/{fk_venue}', 'mis_exam_invigilatorController@CheckInvigilator');

// mis_exam_venue
$router->post('/misExamVenue/register', 'mis_exam_venueController@register');
$router->get('/misExamVenue/listByExam/{id}', 'mis_exam_venueController@listByExam');
$router->post('/misExamVenue/update', 'mis_exam_venueController@update');
$router->post('/misExamVenue/delete', 'mis_exam_venueController@delete');