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

// mis_timetable
$router->post('/misTimetable/register', 'mis_timetableController@register');
$router->post('/misTimetable/register2', 'mis_timetableController@register2');
$router->get('/misTimetable/show/{id}', 'mis_timetableController@show');
$router->get('/misTimetable/list', 'mis_timetableController@list');
$router->post('/misTimetable/update', 'mis_timetableController@update');
$router->get('/misTimetable/listByType/{id}', 'mis_timetableController@listByType');
$router->post('/misTimetable/delete', 'mis_timetableController@delete');
$router->get('/misTimetable/tblByYear/{id}', 'mis_timetableController@tblByYear');
$router->post('/misTimetable/timetblByYearSem', 'mis_timetableController@timetblByYearSem');
$router->post('/misTimetable/listTimeTableByLecturerCalendarId', 'mis_timetableController@listTimeTableByLecturerCalendarId');
$router->post('/misTimetable/listData', 'mis_timetableController@listData');


// mis_timetbl_det
$router->post('/misTimetblDet/register', 'mis_timetbl_detController@register');
$router->get('/misTimetblDet/show/{id}', 'mis_timetbl_detController@show');
$router->get('/misTimetblDet/list/{id}', 'mis_timetbl_detController@list');
$router->post('/misTimetblDet/update', 'mis_timetbl_detController@update');
$router->post('/misTimetblDet/delete', 'mis_timetbl_detController@delete');
$router->post('/misTimetblDet/listByLectYear', 'mis_timetbl_detController@listByLectYear');
$router->post('/misTimetblDet/listByLectCalCrs', 'mis_timetbl_detController@listByLectCalCrs');
////
$router->post('/misTimetblDet/StudTimetable', 'mis_timetbl_detController@StudTimetable');
$router->post('/misTimetblDet/StudTimetable2', 'mis_timetbl_detController@StudTimetable2');
$router->post('/misTimetblDet/agreementStd', 'mis_timetbl_detController@agreementStd');


// mis_atd_week
$router->post('/misAtdWeek/register', 'mis_atd_weekController@register');
$router->get('/misAtdWeek/show/{id}', 'mis_atd_weekController@show');
$router->get('/misAtdWeek/list/{id}', 'mis_atd_weekController@list');
$router->post('/misAtdWeek/update', 'mis_atd_weekController@update');
$router->post('/misAtdWeek/delete', 'mis_atd_weekController@delete');


// mis_atd_attendance
$router->post('/misAtdAttendance/register', 'mis_atd_attendanceController@register');
$router->post('/misAtdAttendance/update', 'mis_atd_attendanceController@update');
$router->post('/misAtdAttendance/findId', 'mis_atd_attendanceController@findId');
$router->get('/misAtdAttendance/listByWeek/{id}', 'mis_atd_attendanceController@listByWeek');
$router->post('/misAtdAttendance/delete', 'mis_atd_attendanceController@delete');