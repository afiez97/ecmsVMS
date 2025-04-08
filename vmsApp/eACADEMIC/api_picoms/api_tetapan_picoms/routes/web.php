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

$router->post('/login','authController@login');

// mis_prm_calendar_det
$router->post('/misPrmCalDet/register', 'mis_prm_calendar_detController@register');
$router->post('/calendardet', 'mis_prm_calendar_detController@show');
$router->post('/calendardetList', 'mis_prm_calendar_detController@list');
$router->post('/misPrmCalDet/update', 'mis_prm_calendar_detController@update');
$router->post('/calendardetDelete', 'mis_prm_calendar_detController@delete');

// mis_prm_calendar
$router->post('/addCalendar', 'mis_prm_calendarController@register');
$router->get('/misPrmCalendar/show/{id}', 'mis_prm_calendarController@show');
$router->get('/misPrmCalendar/list', 'mis_prm_calendarController@list');
$router->post('/misPrmCalendar/update', 'mis_prm_calendarController@update');
$router->post('/misPrmCalendar/delete', 'mis_prm_calendarController@delete');
$router->get('/misPrmCalendar/listByCat/{id}', 'mis_prm_calendarController@listByCat');
$router->get('/misPrmCalendar/listActive', 'mis_prm_calendarController@listActive');
$router->get('/misPrmCalendar/listActive2', 'mis_prm_calendarController@listActive2');
$router->get('/misPrmCalendar/listCal', 'mis_prm_curyearController@listCal');
$router->post('/misPrmCalendar/catByYearSem', 'mis_prm_calendarController@catByYearSem');
$router->get('/misPrmCalendar/listByCatSttsActive/{id}', 'mis_prm_calendarController@listByCatSttsActive');
$router->get('/misPrmCalendar/grpByYear', 'mis_prm_calendarController@grpByYear');
$router->post('/misPrmCalendar/student/intake', 'mis_prm_calendarController@stdIntake');
$router->post('/misPrmCalendar/getid', 'mis_prm_calendarController@getid');
$router->post('/misPrmCalendar/detCourse', 'mis_prm_calendarController@detCourse');

// mis_prm_cect
$router->post('/addCect', 'mis_prm_cectController@register');
$router->post('/cect/{id}', 'mis_prm_cectController@show');
$router->get('/cectList', 'mis_prm_cectController@list');
$router->post('/cectUpdate', 'mis_prm_cectController@update');
$router->post('/cectDelete', 'mis_prm_cectController@delete');

// mis_prm_college
$router->post('/misPrmCollege/register', 'mis_prm_collegeController@register');
$router->get('/misPrmCollege/show/{id}', 'mis_prm_collegeController@show');
$router->get('/misPrmCollege/list', 'mis_prm_collegeController@list');
$router->post('/misPrmCollege/update', 'mis_prm_collegeController@update');
$router->post('/misPrmCollege/delete', 'mis_prm_collegeController@delete');
$router->post('/collegeChecking','mis_prm_collegeController@collegeCodeChecking');

// mis_prm_course_cot
$router->post('/misPrmCrsCOT/register', 'mis_prm_course_cotController@register');
$router->get('/misPrmCrsCOT/show/{id}', 'mis_prm_course_cotController@show');
$router->get('/misPrmCrsCOT/list', 'mis_prm_course_cotController@list');
$router->post('/misPrmCrsCOT/update', 'mis_prm_course_cotController@update');
$router->post('/misPrmCrsCOT/delete', 'mis_prm_course_cotController@delete');
$router->get('/misPrmCrsCOT/listByCampus/{id}', 'mis_prm_course_cotController@listByCampus');

// mis_prm_course_cot_det
$router->post('/misPrmCrsCOTDet/register', 'mis_prm_course_cot_detController@register');
$router->post('/coursecotdet', 'mis_prm_course_cot_detController@show');
$router->get('/coursecotdetList', 'mis_prm_course_cot_detController@list');
$router->post('/misPrmCrsCOTDet/update', 'mis_prm_course_cot_detController@update');
$router->post('/misPrmCrsCOTDet/delete', 'mis_prm_course_cot_detController@delete');
$router->get('/misPrmCrsCOTDet/auditCourse/{id}/{stdID}', 'mis_prm_course_cot_detController@auditCourse');//afiez 28julai2023 utk update table courselist tu
$router->get('/misPrmCrsCOTDet/auditCourseStdSite/{id}/{stdID}', 'mis_prm_course_cot_detController@auditCourseStdSite');//afiez 08ogos2024 utk update table courselist tu
$router->get('/misPrmCrsCOTDet/listCourse/{id}', 'mis_prm_course_cot_detController@listCourse');
$router->post('/misPrmCrsCOTDet/listByPgm', 'mis_prm_course_cot_detController@listByPgm');
$router->get('/misPrmCrsCOTDet/groupBySem/{id}', 'mis_prm_course_cot_detController@groupBySem');
$router->post('/misPrmCrsCOTDet/selectExamCrs', 'mis_prm_course_cot_detController@selectExamCrs');
$router->get('/misPrmCrsCOTDet/groupByCrs', 'mis_prm_course_cot_detController@groupByCrs');
$router->post('/misPrmCrsCOTDet/findId', 'mis_prm_course_cot_detController@findId');
$router->post('/misPrmCrsCOTDet/crsByPgmdetAcaCal', 'mis_prm_course_cot_detController@crsByPgmdetAcaCal');
$router->get('/misPrmCrsCOTDet/grpByCrsByCal/{id}', 'mis_prm_course_cot_detController@grpByCrsByCal');
$router->post('/misPrmCrsCOTDet/list/acaCalender', 'mis_prm_course_cot_detController@searchByAcaCalendar');
$router->post('/misPrmCrsCOTDet/list/acaCalenderStudent', 'mis_prm_course_cot_detController@searchByAcaCalendarStudent');

// mis_prm_cot_sem
$router->post('/misPrmCOTSem/register', 'mis_prm_cot_semController@register');
$router->get('/misPrmCOTSem/listByPgmdet/{id}', 'mis_prm_cot_semController@listByPgmdet');
$router->post('/misPrmCOTSem/update', 'mis_prm_cot_semController@update');
$router->post('/misPrmCOTSem/delete', 'mis_prm_cot_semController@delete');
$router->post('/misPrmCOTSem/chkExist', 'mis_prm_cot_semController@chkExist');
$router->post('/misPrmCOTSem/pgmDetSession', 'mis_prm_cot_semController@pgmDetSession');

// mis_prm_course
$router->post('/misPrmCourse/register', 'mis_prm_courseController@register');
$router->get('/misPrmCourse/show/{id}', 'mis_prm_courseController@show');
$router->get('/misPrmCourse/list', 'mis_prm_courseController@list');
$router->post('/misPrmCourse/update', 'mis_prm_courseController@update');
$router->post('/misPrmCourse/delete', 'mis_prm_courseController@delete');
$router->post('/courseChecking', 'mis_prm_courseController@courseCodeChecking');
$router->get('/misPrmCourse/listByCampus/{id}', 'mis_prm_courseController@listByCampus');
$router->get('/misPrmCourse/selectCrs/{id}', 'mis_prm_courseController@selectCrs');
$router->get('/misPrmCourse/selectCrsCounted/{id}', 'mis_prm_courseController@selectCrsCounted');
$router->post('/misPrmCourse/selectPrereqCrs', 'mis_prm_courseController@selectPrereqCrs');
$router->get('/misPrmCourse/listAct', 'mis_prm_courseController@listAct');

// mis_prm_course_det
$router->post('/misPrmCourseDet/register', 'mis_prm_course_detController@register');
$router->get('/misPrmCourseDet/list/{id}', 'mis_prm_course_detController@list');
$router->post('/misPrmCourseDet/checkId', 'mis_prm_course_detController@checkId');
$router->post('/misPrmCourseDet/delete', 'mis_prm_course_detController@delete');

// mis_prm_credit
$router->post('/misPrmCredit/register', 'mis_prm_creditController@register');
$router->post('/credit/{id}', 'mis_prm_creditController@show');
$router->get('/misPrmCredit/list', 'mis_prm_creditController@list');
$router->post('/misPrmCredit/update', 'mis_prm_creditController@update');
$router->post('/misPrmCredit/delete', 'mis_prm_creditController@delete');

// mis_prm_curyear
$router->post('/misPrmCuryear/register', 'mis_prm_curyearController@register');
$router->post('/curyear/{id}', 'mis_prm_curyearController@show');
$router->get('/misPrmCuryear/list', 'mis_prm_curyearController@list');
$router->post('/misPrmCuryear/update', 'mis_prm_curyearController@update');
$router->post('/curyearDelete', 'mis_prm_curyearController@delete');
$router->post('/curyear/selected/{id}', 'mis_prm_curyearController@show_by_program');
$router->get('/misPrmCuryear/opt_curYear', 'mis_prm_curyearController@opt_curYear_progDet');
$router->get('/misPrmCuryear/opt_intake/{id}', 'mis_prm_curyearController@opt_intake_progDet');
$router->get('/curyear/selectSemester/{id}', 'mis_prm_curyearController@opt_semester');
$router->get('/curyear/selectPgm/{id}', 'mis_prm_curyearController@opt_programme');
$router->get('/misPrmCuryear/selectCurYear', 'mis_prm_curyearController@selectCurYear');
$router->get('/misPrmCuryear/listIntakeAct', 'mis_prm_curyearController@listIntakeAct');
$router->get('/misPrmCuryear/listYearAct', 'mis_prm_curyearController@listYearAct');
$router->POST('/misPrmCuryear/listYearActUpt', 'mis_prm_curyearController@listYearActUpt');
$router->post('/misPrmCuryear/chkIntake', 'mis_prm_curyearController@chkIntake');
$router->post('/misPrmCuryear/chkUptIntake', 'mis_prm_curyearController@chkUptIntake');
$router->get('/misPrmCuryear/listByAcaCal/{id}', 'mis_prm_curyearController@listByAcaCal');
$router->post('/intake/list', 'mis_prm_curyearController@curYearActive');

// mis_prm_faclecturer
$router->post('/misPrmFacLect/register', 'mis_prm_faclecturerController@register');
$router->post('/faclecturer/{id}', 'mis_prm_faclecturerController@show');
$router->get('/faclecturerList', 'mis_prm_faclecturerController@list');
$router->post('/misPrmFacLect/update', 'mis_prm_faclecturerController@update');
$router->post('/faclecturerDelete', 'mis_prm_faclecturerController@delete');
$router->get('/misPrmFacLect/listByCampus/{id}', 'mis_prm_faclecturerController@listByCampus');

// mis_prm_faccampus
$router->post('/misPrmFacCampus/register', 'mis_prm_faccampusController@register');
$router->get('/misPrmFacCampus/show/{id}', 'mis_prm_faccampusController@show');
$router->get('/misPrmFacCampus/list', 'mis_prm_faccampusController@list');
$router->post('/misPrmFacCampus/delete', 'mis_prm_faccampusController@delete');
$router->get('/misPrmFacCampus/listByCampus/{id}', 'mis_prm_faccampusController@listByCampus');
$router->post('/misPrmFacCampus/checkId','mis_prm_faccampusController@checkId');

// mis_prm_faculty
$router->post('/misPrmFaculty/register', 'mis_prm_facultyController@register');
$router->post('/faculty/{id}', 'mis_prm_facultyController@show');
$router->get('/misPrmFaculty/list', 'mis_prm_facultyController@list');
$router->post('/misPrmFaculty/update', 'mis_prm_facultyController@update');
$router->post('/misPrmFaculty/delete', 'mis_prm_facultyController@delete');
$router->post('/facultyChecking','mis_prm_facultyController@facultyCodeChecking');
$router->get('/misPrmFaculty/listByCampus/{id}', 'mis_prm_facultyController@listByCampus');

// mis_prm_gredscheme_det
$router->post('/misPrmDetGredScheme/register', 'mis_prm_gredscheme_detController@register');
$router->post('/misPrmDetGredScheme/show', 'mis_prm_gredscheme_detController@show');
$router->post('/misPrmDetGredScheme/list', 'mis_prm_gredscheme_detController@list');
$router->post('/misPrmDetGredScheme/update', 'mis_prm_gredscheme_detController@update');
$router->post('/misPrmDetGredScheme/delete', 'mis_prm_gredscheme_detController@delete');
$router->get('/misPrmDetGredScheme/listByGS/{id}', 'mis_prm_gredscheme_detController@listByGS');
$router->get('/misPrmDetGredScheme/listByGS2/{id}', 'mis_prm_gredscheme_detController@listByGS2');
$router->get('/misPrmDetGredScheme/listByCLO/{id}', 'mis_prm_gredscheme_detController@listByCLO');
$router->get('/misPrmDetGredScheme/listByPLO/{id}', 'mis_prm_gredscheme_detController@listByPLO');
$router->get('/misPrmDetGredScheme/listByAll/{id}', 'mis_prm_gredscheme_detController@listByAll');

// mis_prm_gredscheme
$router->post('/misPrmGredScheme/register', 'mis_prm_gredschemeController@register');
$router->get('/misPrmGredScheme/show/{id}', 'mis_prm_gredschemeController@show');
$router->get('/misPrmGredScheme/list', 'mis_prm_gredschemeController@list');
$router->post('/misPrmGredScheme/update', 'mis_prm_gredschemeController@update');
$router->post('/misPrmGredScheme/delete', 'mis_prm_gredschemeController@delete');
$router->post('/misPrmGredScheme/checkName', 'mis_prm_gredschemeController@checkName');
$router->post('/misPrmGredScheme/checkName2', 'mis_prm_gredschemeController@checkName2');
$router->post('/misPrmGredScheme/listByCamCrs', 'mis_prm_gredschemeController@listByCamCrs');

//gsd_exam_type
$router->get('/gsdExamType/list', 'gsd_exam_typeController@list');

// mis_prm_locations
$router->post('/misPrmLoc/register', 'mis_prm_locationsController@register');
$router->get('/misPrmLoc/show/{id}', 'mis_prm_locationsController@show');
$router->get('/locationsList', 'mis_prm_locationsController@list');
$router->post('/misPrmLoc/update', 'mis_prm_locationsController@update');
$router->post('/misPrmLoc/delete', 'mis_prm_locationsController@delete');
$router->get('/misPrmLoc/listByCampus/{id}', 'mis_prm_locationsController@listByCampus');
$router->get('/misPrmLoc/listByCamAct/{id}', 'mis_prm_locationsController@listByCamAct');

// mis_prm_nonobe
$router->post('/addNonobe', 'mis_prm_nonobeController@register');
$router->post('/nonobe/{id}', 'mis_prm_nonobeController@show');
$router->post('/nonobeList', 'mis_prm_nonobeController@list');
$router->post('/nonobeUpdate', 'mis_prm_nonobeController@update');

// mis_prm_programme_det
$router->post('/misPrmProgDet/register', 'mis_prm_programme_detController@register');
$router->get('/misPrmProgDet/show/{id}', 'mis_prm_programme_detController@show');
$router->get('/misPrmProgDet/list/{id}', 'mis_prm_programme_detController@list');
$router->post('/misPrmProgDet/update', 'mis_prm_programme_detController@update');
$router->post('/misPrmProgDet/delete', 'mis_prm_programme_detController@delete');
$router->get('/misPrmProgDet/listByYear/{id}', 'mis_prm_programme_detController@listByYear');
$router->post('/misPrmProgDet/listByYearIntake', 'mis_prm_programme_detController@listByYearIntake');
$router->get('/misPrmProgDet/listByIntake/{id}', 'mis_prm_programme_detController@listByIntake');
$router->post('/misPrmProgDet/chkIntake', 'mis_prm_programme_detController@chkIntake');
$router->post('/misPrmProgDet/findPkId', 'mis_prm_programme_detController@findPkId');
$router->post('/misPrmProgDet/findPGMid', 'mis_prm_programme_detController@findPGMid');
$router->get('/misPrmProgDet/progYear/{id}', 'mis_prm_programme_detController@progYear');
$router->post('/misPrmProgDet/progByAcaCal', 'mis_prm_programme_detController@progByAcaCal');
$router->post('/misPrmProgDet/progByAcaCal/show', 'mis_prm_programme_detController@progDetShow');
$router->post('/misPrmProgDet/findPgmDetStd', 'mis_prm_programme_detController@findPgmDetStd');
$router->post('/misPrmProgDet/findPgmDetStd2', 'mis_prm_programme_detController@findPgmDetStd2');

// mis_prm_programme
$router->post('/misPrmProg/register', 'mis_prm_programmeController@register');
$router->get('/misPrmProg/show/{id}', 'mis_prm_programmeController@show');
$router->get('/misPrmProg/list', 'mis_prm_programmeController@list');
$router->post('/misPrmProg/update', 'mis_prm_programmeController@update');
$router->post('/misPrmProg/updateObe', 'mis_prm_programmeController@updateObe');
$router->post('/misPrmProg/delete', 'mis_prm_programmeController@delete');
$router->post('/misPrmProg/progCodeChecking','mis_prm_programmeController@progCodeChecking');
$router->get('/misPrmProg/listByCampus/{id}', 'mis_prm_programmeController@listByCampus');
$router->get('/misPrmProg/selectProg/{id}', 'mis_prm_programmeController@selectProg');
$router->get('/misPrmProg/listByFaculty/{id}', 'mis_prm_programmeController@listByFaculty');

// mis_prm_progcampus
$router->post('/misPrmProgcampus/register', 'mis_prm_progcampusController@register');
$router->post('/misPrmProgcampus/show', 'mis_prm_progcampusController@show');
$router->post('/misPrmProgcampus/list', 'mis_prm_progcampusController@list');
$router->post('/misPrmProgcampus/update', 'mis_prm_progcampusController@update');
$router->post('/misPrmProgcampus/dataChecking', 'mis_prm_progcampusController@dataChecking');
$router->get('/misPrmProgcampus/listByFac/{id}/{cam_id}', 'mis_prm_progcampusController@listByFac');
$router->get('/misPrmProgcampus/listByCamAct/{id}', 'mis_prm_progcampusController@listByCamAct');
$router->get('/misPrmProgcampus/listByAcaSession/{id}', 'mis_prm_progcampusController@listByAcaSession');
$router->get('/misPrmProgcampus/grpByPgmAct', 'mis_prm_progcampusController@grpByPgmAct');
$router->get('/misPrmProgcampus/grpByPgmActNew', 'mis_prm_progcampusController@grpByPgmActNew'); //MIMI
$router->post('/misPrmProgcampus/listCamFacAct', 'mis_prm_progcampusController@listCamFacAct');

// mis_prm_takwim
$router->post('/misPrmTakwim/register', 'mis_prm_takwimController@register');
$router->post('/takwim/{id}', 'mis_prm_takwimController@show');
$router->post('/misPrmTakwim/list', 'mis_prm_takwimController@list');
$router->post('/misPrmTakwim/update', 'mis_prm_takwimController@update');
$router->post('/misPrmTakwim/delete', 'mis_prm_takwimController@delete');
$router->post('/misPrmTakwim/listByStd', 'mis_prm_takwimController@listByStd');

// mis_prm_timetable_det
$router->post('/addTimetabledet', 'mis_prm_timetable_detController@register');
$router->post('/timetabledet/{id}', 'mis_prm_timetable_detController@show');
$router->post('/timetabledetList', 'mis_prm_timetable_detController@list');
$router->post('/timetabledetUpdate', 'mis_prm_timetable_detController@update');

// mis_prm_timetable
$router->post('/addTimetable', 'mis_prm_timetableController@register');
$router->post('/timetable/{id}', 'mis_prm_timetableController@show');
$router->post('/timetableList', 'mis_prm_timetableController@list');
$router->post('/timetableUpdate', 'mis_prm_timetableController@update');

// status
$router->post('/addStatus', 'statusController@register');
$router->post('/status/{id}', 'statusController@show');
$router->get('/status/list', 'statusController@list');
$router->post('/statusUpdate', 'statusController@update');

// category
$router->post('/addCategory', 'categoryController@register');
$router->post('/category/{id}', 'categoryController@show');
$router->get('/category/list', 'categoryController@list');
$router->post('/categoryUpdate', 'categoryController@update');

// aca_area
$router->post('/addAcaarea', 'aca_areaController@register');
$router->post('/acaarea/{id}', 'aca_areaController@show');
$router->get('/acaArea/list', 'aca_areaController@list');
$router->post('/acaareaUpdate', 'aca_areaController@update');

// intake
$router->get('/intake/list', 'intakeController@list');
$router->post('/intake/register', 'intakeController@register');
$router->post('/intake/chkData', 'intakeController@chkData');
$router->post('/intake/delete', 'intakeController@delete');

// semester
$router->post('/addSemester', 'semesterController@register');
$router->post('/semester/{id}', 'semesterController@show');
$router->get('/semesterList', 'semesterController@list');
$router->post('/semesterUpdate', 'semesterController@update');

// status_sem
$router->post('/addStatussem', 'status_semController@register');
$router->post('/statussem/{id}', 'status_semController@show');
$router->get('/statussemList', 'status_semController@list');
$router->post('/statussemUpdate', 'status_semController@update');

// course_type
$router->post('/addCoursetype', 'course_typeController@register');
$router->post('/coursetype/{id}', 'course_typeController@show');
$router->get('/coursetypeList', 'course_typeController@list');
$router->post('/coursetypeUpdate', 'course_typeController@update');

// cohort
$router->post('/addCohort', 'cohortController@register');
$router->post('/cohort/{id}', 'cohortController@show');
$router->get('/cohortList', 'cohortController@list');
$router->post('/cohortUpdate', 'cohortController@update');

// sem_type
$router->post('/addSemtype', 'sem_typeController@register');
$router->post('/semtype/{id}', 'sem_typeController@show');
$router->get('/semType/list', 'sem_typeController@list');
$router->post('/semtypeUpdate', 'sem_typeController@update');

// mode
$router->post('/addMode', 'modeController@register');
$router->post('/mode/{id}', 'modeController@show');
$router->get('/mode/list', 'modeController@list');
$router->post('/modeUpdate', 'modeController@update');

// mqflevel
$router->post('/addMqflevel', 'mqflevelController@register');
$router->post('/mqflevel/{id}', 'mqflevelController@show');
$router->get('/mqflevel/list', 'mqflevelController@list');
$router->post('/mqflevelUpdate', 'mqflevelController@update');

// duration
$router->post('/addDuration', 'durationController@register');
$router->post('/duration/{id}', 'durationController@show');
$router->get('/durationList', 'durationController@list');
$router->post('/durationUpdate', 'durationController@update');

// hrm_emp_info
$router->post('/addEmployee', 'hrm_emp_infoController@register');
$router->get('/hrmEmpInfo/show/{id}', 'hrm_emp_infoController@show');
$router->get('/lecturerList', 'hrm_emp_infoController@lectList');
$router->get('/hrmEmpInfo/list', 'hrm_emp_infoController@list');
$router->post('/employeeUpdate', 'hrm_emp_infoController@update');
$router->get('/hrmEmpInfo/counList', 'hrm_emp_infoController@counList');
$router->get('/hrmEmpInfo/counListAll', 'hrm_emp_infoController@allCounList');

// decision
$router->post('/addDecision', 'decisionController@register');
$router->post('/decision/{id}', 'decisionController@show');
$router->get('/decisionList', 'decisionController@list');
$router->post('/decisionUpdate', 'decisionController@update');

// ctrcode
$router->post('/addCtrcode', 'ctrcodeController@register');
$router->post('/ctrcode/{id}', 'ctrcodeController@show');
$router->get('/ctrcodeList', 'ctrcodeController@list');
$router->post('/ctrcodeUpdate', 'ctrcodeController@update');

// grade
$router->post('/addGrade', 'gradeController@register');
$router->post('/grade/{id}', 'gradeController@show');
$router->get('/gradeList', 'gradeController@list');
$router->post('/gradeUpdate', 'gradeController@update');

// religion
$router->post('religion/create', 'mis_religionController@register');
$router->get('religion/show/{id}', 'mis_religionController@show');
$router->get('religion/list', 'mis_religionController@list');
$router->post('religion/update', 'mis_religionController@update');

// race
$router->post('race/create', 'mis_raceController@register');
$router->get('race/show/{id}', 'mis_raceController@show');
$router->get('race/list', 'mis_raceController@list');
$router->post('race/update', 'mis_raceController@update');

// blood
$router->post('blood/create', 'mis_blood_typeController@register');
$router->get('blood/show/{id}', 'mis_blood_typeController@show');
$router->get('blood/list', 'mis_blood_typeController@list');
$router->post('blood/update', 'mis_blood_typeController@update');

// aca_cal_category
$router->get('/acaCalCategory/list', 'aca_cal_categoryController@list');

// mis_timetable
$router->post('/misTimetable/register', 'mis_timetableController@register');
$router->get('/misTimetable/list', 'mis_timetableController@list');
$router->post('/misTimetable/update', 'mis_timetableController@update');
$router->get('/misTimetable/listByType/{id}', 'mis_timetableController@listByType');
$router->post('/misTimetable/delete', 'mis_timetableController@delete');
$router->get('/misTimetable/tblByYear/{id}', 'mis_timetableController@tblByYear');

// mis_prm_intake
$router->get('/misPrmIntake/list', 'mis_prm_intakeController@list');

// OBE CLO 
$router->post('/obe/clo/create', 'obe_cloController@create');
$router->get('/obe/clo/show/{id}', 'obe_cloController@show');
$router->get('/obe/clo/list', 'obe_cloController@list');
$router->post('/obe/clo/update', 'obe_cloController@update');
$router->post('/obe/clo/delete', 'obe_cloController@delete');
$router->get('/obe/clo_ByCourse/show/{FK_course}', 'obe_cloController@showByCourse');
$router->post('/obe/clo_ByCourse/showCourseDet', 'obe_cloController@showByCoursedet'); //utk papar {CLO+SLT+weightage dll}
$router->post('/obe/clo_ByCourse/showCourseDet2', 'obe_cloController@showByCoursedet2'); //utk papar {CLO+SLT+weightage dll}


// OBE CLO STUDENT 
$router->post('/obe/clo_student/create', 'obe_clo_studentController@create');
$router->get('/obe/clo_student/show/{id}', 'obe_clo_studentController@show');
$router->get('/obe/clo_student/list', 'obe_clo_studentController@list');
$router->post('/obe/clo_student/update', 'obe_clo_studentController@update');
$router->post('/obe/clo_student/delete', 'obe_clo_studentController@delete');
$router->post('/obe/clo_student/viewAll', 'obe_clo_studentController@viewAllCLOStudent');



//mis_prm_obe
$router->post('/misprmobe/registerPlo', 'mis_prm_obe_ploController@registerPlo');
$router->get('misprmobe/show/{pgm_id}', 'mis_prm_obe_ploController@show');
$router->post('misprmobe/showByPgmDet', 'mis_prm_obe_ploController@showByPgmDet');
$router->get('/misprmobe/list', 'mis_prm_obe_ploController@list');
$router->post('/misprmobe/updatePlo', 'mis_prm_obe_ploController@updatePlo');
$router->post('/misprmobe/deletePlo', 'mis_prm_obe_ploController@deletePlo');

$router->post('/generateObe/create', 'mis_prm_obe_plo_generateController@create');
$router->post('/generateObe/find', 'mis_prm_obe_plo_generateController@find');
$router->post('/generateObe/findByCode', 'mis_prm_obe_plo_generateController@findByCode');
$router->post('/generateObe/update', 'mis_prm_obe_plo_generateController@update');
//t get the PLO 
$router->post('/generateObe/ploclo', 'mis_prm_obe_plo_generateController@ploclo');
$router->post('/generateObe/courseClo', 'mis_prm_obe_plo_generateController@courseClo');
$router->post('/generateObe/studentPloClo', 'mis_prm_obe_plo_generateController@studentPloClo');
$router->get('misprmobe/showByFKCodePgm/{code_pgm}', 'mis_prm_obe_ploController@showByFKCodePgm'); //afiez 22 april

//adm_access
$router->get('/admAccess/list', 'adm_accessController@list');
$router->get('/admAccess/show/{id}', 'adm_accessController@show');
$router->post('/admAccess/update', 'adm_accessController@update');
$router->get('/admAccess/roleList/{id}', 'adm_accessController@roleList');
$router->post('/admAccess/updateRole', 'adm_accessController@updateRole');
$router->post('/admAccess/delRole', 'adm_accessController@delRole');
$router->get('/admAccess/showUserAccess/{userId}', 'adm_accessController@showUserAccess');
$router->get('/admAccess/showUserAccessPK/{userId}', 'adm_accessController@showUserAccessPK');





