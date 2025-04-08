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

$router->post('/login','authController@login');
$router->post('/infoReg','std_infoController@create');
$router->get('/infoList','std_infoController@list');
$router->post('/infoView/{id}','std_infoController@show');

$router->get('/tawaranList','stdTawaranController@list');
$router->post('/tawaranView/{std_tawaran_id}','stdTawaranController@show');
$router->post('/tawaranUpdate','stdTawaranController@update');
$router->post('/tawaranDelete','stdTawaranController@delete');
$router->post('/tawaranApprove','std_registerController@approve');
$router->post('/tawaranReg','stdTawaranController@create');

$router->post('/pelajarReg','std_registerController@update');
$router->post('/pelajarList','std_registerController@list');
$router->get('/pelajarShow/{id}','std_registerController@show');

// mis_std_info
$router->get('/studentInfoList','mis_std_infoController@list');
$router->post('/studentInfoReg','mis_std_infoController@create');
$router->post('/studentInfoView','mis_std_infoController@show');
$router->get('/studentInfoView2/{id}','mis_std_infoController@show2');
$router->post('/studentInfoUpdate','mis_std_infoController@update');
$router->post('/studentInfoDelete','mis_std_infoController@delete');
$router->post('/studentIdChecking','mis_std_infoController@studentIdChecking');
$router->post('/student/update','mis_std_infoController@pljr_alamat');
$router->get('/misStdInfo/show/{id}','mis_std_infoController@infoShow');
$router->post('/misStdInfo/uptSttsAca','mis_std_infoController@uptSttsAca');
$router->get('/misStdInfo/countNewStd','mis_std_infoController@countNewStd');
$router->get('/misStdInfo/countActStd','mis_std_infoController@countActStd');
$router->get('/misStdInfo/countIntStd','mis_std_infoController@countIntStd');
$router->get('/misStdInfo/listStdReg','mis_std_infoController@listStdReg');
$router->post('/misStdInfo/listStdUnreside','mis_std_infoController@listStdUnreside');
$router->post('/misStdInfo/studentSem','mis_std_infoController@studentSem');
$router->post('/misStdInfo/updateStatus','mis_std_infoController@updateStatus');
$router->post('/misStdInfo/listStdReporting','mis_std_infoController@listStdReporting');

//Pelajar by AzizZ
$router->post('/pelajar/create','mis_std_infoController_new@create');
$router->post('/pelajar/create/register','mis_std_infoController_new@createRegister');
$router->post('/pelajar/update','mis_std_infoController_new@update');
$router->post('/pelajar/update/basic','mis_std_infoController_new@update_basic');
$router->post('/pelajar/list/programme','mis_std_infoController_new@listByCam');
$router->post('/pelajar/list/new','mis_std_infoController_new@listNew');
$router->get('/pelajar/show/{id}','mis_std_infoController_new@show');
$router->get('/pelajar/show/det/{id}','mis_std_infoController_new@showDet');
$router->get('/pelajar/show/det/sti_icno/{sti_icno}','mis_std_infoController_new@showGender');
$router->post('/pelajar/change/program','mis_std_infoController_new@changeProgram');
$router->post('/pelajar/change/statusAcademic','mis_std_infoController_new@setStatus_academic');
$router->post('/pelajar/list/StudentProgrammeIntake','mis_std_infoController_new@listStdActiveByPgmIntake');
$router->post('/pelajar/reset/password','mis_std_infoController_new@resetPassword');
$router->post('/pelajar/show/password','mis_std_infoController_new@showByPassword');
$router->post('/auditBergraduatChecked','mis_std_infoController_new@auditBergraduatChecked');

//mis_std_tawaran -- AzizZ 20220808
$router->post('/tawaran/create','mis_std_tawaranController@create');
$router->get('/tawaran/list','mis_std_tawaranController@list');
$router->post('/tawaran/update','mis_std_tawaranController@updateStatus');

$router->get('/studentStatusList','mis_std_statusController@list');
$router->post('studentStatusReg','mis_std_statusController@register');
$router->get('studentStatusView','mis_std_statusController@show');
$router->post('studentStatusUpdate','mis_std_statusController@update');

//mis_std_status
$router->get('std_status/list','mis_std_statusController@list');
$router->post('std_status/create','mis_std_statusController@create');
$router->get('std_status/show/{id}','mis_std_statusController@show');
$router->post('std_status/update','mis_std_statusController@update');

//mis_std_academic
$router->get('/academic/list','mis_std_academicController@list');
$router->post('academic/create','mis_std_academicController@create');
$router->get('academic/show/{id}','mis_std_academicController@show');
$router->post('academic/update','mis_std_academicController@update');

//mis_std_curAcademic
$router->get('/curAcademic/list','mis_std_curAcademicController@list');
$router->post('curAcademic/create','mis_std_curAcademicController@create');
$router->get('curAcademic/show/{id}/{semester}','mis_std_curAcademicController@show');
$router->get('curAcademic/curr_show/{id}','mis_std_curAcademicController@curShow');
$router->get('curAcademic/showAcaCal/{id}/{fk_acaCal}','mis_std_curAcademicController@showAcaCal');
$router->post('curAcademic/update','mis_std_curAcademicController@update');
$router->post('curAcademic/stdUptSem','mis_std_curAcademicController@uptSem');
$router->post('curAcademic/stdAddSem','mis_std_curAcademicController@addSem');
$router->get('curAcademic/chkStdCurSem/{id}','mis_std_curAcademicController@chkStdCurSem');
$router->get('curAcademic/chkStdCurSemTranscipt/{id}','mis_std_curAcademicController@chkStdCurSemTranscipt');
$router->get('curAcademic/chkStdCurSem2/{id}','mis_std_curAcademicController@chkStdCurSem2');
$router->post('curAcademic/findSem','mis_std_curAcademicController@findSem');
$router->post('curAcademic/chkStdSem','mis_std_curAcademicController@chkStdSem');
$router->post('curAcademic/updateGPA','mis_std_curAcademicController@updateGPA');
$router->get('curAcademic/cgpa/{std_studentid}/{pk}/{std_semester}','mis_std_curAcademicController@getCGPA');
$router->post('curAcademic/acSummary','mis_std_curAcademicController@acSummary');
$router->post('curAcademic/student/faculty','mis_std_curAcademicController@stdByFaculty');
$router->post('curAcademic/student/senat','mis_std_curAcademicController@stdSession');
$router->post('curAcademic/student/contResult','mis_std_curAcademicController@contResult');
$router->post('curAcademic/student/contFac','mis_std_curAcademicController@contFac');
$router->post('curAcademic/student/contPgm','mis_std_curAcademicController@contPgm');
$router->get('curAcademic/student/release/result/{id}','mis_std_curAcademicController@releaseResult');
$router->get('curAcademic/student/latestCGPAudit/{std_studentid}','mis_std_curAcademicController@latestCGPAudit'); //afiez 28julai2023 utk ambik cgpa latest
$router->post('curAcademic/student/standing/good','mis_std_curAcademicController@good_standingByIntake_sem'); //AzizZ 11092023 standing 1BY1
$router->post('curAcademic/student/standing/cont','mis_std_curAcademicController@cont_standingByIntake_sem'); //AzizZ 11092023 standing 1BY1
$router->post('curAcademic/student/standing/failed','mis_std_curAcademicController@failed_standingByIntake_sem'); //AzizZ 11092023 standing 1BY1
$router->post('curAcademic/student/session/Deferred','mis_std_curAcademicController@update_curAcademicType');
$router->post('curAcademic/student/type','mis_std_curAcademicController@upt_curAcademicType');
$router->get('curAcademic/student/session/latest/{std_studentid}','mis_std_curAcademicController@latestSem');
$router->post('curAcademic/adminSite/reporting/listStudent','mis_std_curAcademicController@reportListStudent'); //afiez  08112023 api utk reporting
$router->post('curAcademic/adminSite/reporting/listStudentLoc','mis_std_curAcademicController@reportListStudentLoc'); //adlina  141123 api utk reporting inc location
$router->post('curAcademic/release/check','mis_std_curAcademicController@uptRelease');
$router->get('curAcademic/student/session/checkingSts/{std_studentid}/{curAcademic_type}','mis_std_curAcademicController@checkingSts');
$router->get('curAcademic/student/session/checkingSts/{std_studentid}/Deferred/{fk_acaCal}','mis_std_curAcademicController@checkingStsDeferred');
$router->post('/reportingAuditBergraduat','mis_std_curAcademicController@reportingAuditBergraduat');
$router->post('/auditBergraduat','mis_std_curAcademicController@auditBergraduat');
$router->post('/curAcademic/session','mis_std_curAcademicController@curAcademicSession');
// $router->post('/reportingAuditBergraduat2','mis_std_curAcademicController@reportingAuditBergraduat2');
$router->get('curAcademic/lastSem/{matrices}','mis_std_curAcademicController@lastSem');



//mis_std_acaHistoryController
$router->get('/academicHistory/list/{id}','mis_std_acaHistoryController@list');
$router->post('academicHistory/create','mis_std_acaHistoryController@create');
$router->get('academicHistory/show/{id}','mis_std_acaHistoryController@show');
$router->post('academicHistory/update','mis_std_acaHistoryController@update');

//mis_std_financialController
$router->get('/financial/list/{id}','mis_std_financialController@list');
$router->post('financial/create','mis_std_financialController@create');
$router->get('financial/show/{id}','mis_std_financialController@show');
$router->post('financial/update','mis_std_financialController@update');

//mis_std_HostelController
$router->get('/hostel/list/{std_studentid}','mis_std_hostelController@list');
$router->post('hostel/create','mis_std_hostelController@create');
$router->get('hostel/show/{id}','mis_std_hostelController@show');
$router->post('hostel/update','mis_std_hostelController@update');

//mis_std_parent
$router->get('/parent/list','mis_std_parentController@list');
$router->post('parent/create','mis_std_parentController@create');
$router->get('parent/show/{id}/{pgm_id}','mis_std_parentController@show');
$router->post('parent/update','mis_std_parentController@update');

//mis_std_parent -- AzizZ
$router->get('registration/list','mis_std_registrationController@list');
$router->post('registration/create','mis_std_registrationController@create');
$router->get('registration/show/{id}','mis_std_registrationController@show');
$router->post('registration/update','mis_std_registrationController@update');

//mis_prm_programme
$router->get('/programme/list','mis_prm_programmeController@list');
$router->post('programme/create','mis_prm_programmeController@create');
$router->get('programme/show/{id}','mis_prm_programmeController@show');
$router->post('programme/update','mis_prm_programmeController@update');

//mis_std_cect
$router->get('cect/list','mis_std_cectController@list');
$router->post('cect/create','mis_std_cectController@create');
$router->get('cect/show/{id}','mis_std_cectController@show');
$router->get('cect/getdata/{id}','mis_std_cectController@get_data');
$router->get('cect/get_databyStd/{studentid}','mis_std_cectController@get_databyStd');
$router->get('cect/listCourse/{studentid}','mis_std_cectController@listCourse');
$router->get('cect/listCourse/transkrip/{studentid}','mis_std_cectController@listCourseTranskrip');
$router->post('cect/update','mis_std_cectController@update');
$router->post('/misStdCect/uptByAdmnFac','mis_std_cectController@uptByAdmnFac');
$router->post('/misStdCect/uptSenat','mis_std_cectController@uptSenat');
$router->post('/misStdCect/uptFees','mis_std_cectController@uptFees');
$router->post('/misStdCect/uptByDean','mis_std_cectController@uptByDean');
$router->post('/misStdCect/CheckForCreate','mis_std_cectController@CheckForCreate');
$router->get('misStdCect/delete/{idCect}','mis_std_cectController@delete');

//mis_std_cect_det
$router->get('cect_det/list/{id}','mis_std_cect_detController@list');
$router->get('cect_det/listCE/{id}','mis_std_cect_detController@listCE');
$router->get('cect_det/listStudent/{id}','mis_std_cect_detController@listStudent');
$router->post('cect_det/create','mis_std_cect_detController@create');
$router->get('cect_det/show/{id}','mis_std_cect_detController@show');
$router->post('misStdCectDet/update','mis_std_cect_detController@update');
$router->post('misStdCectDet/update/updateCECT','mis_std_cect_detController@updateCECT');
$router->post('misStdCectDet/update/delCECTBycourse','mis_std_cect_detController@delCECTBycourse');
$router->post('misStdCectDet/list/CheckCECTByCourse','mis_std_cect_detController@CheckCECTByCourse');
$router->post('misStdCectDet/delete','mis_std_cect_detController@delete');
$router->get('misStdCectDet/deleteGet/{idcectDet}','mis_std_cect_detController@deleteGet');
$router->get('cect_det/list/byCourse/{FK_cect}','mis_std_cect_detController@listByCourse');
$router->get('cect_det/list/byCourse/{FK_cect}/{std_course}','mis_std_cect_detController@listByCourseDet');


//mis_std_chg_program
$router->get('chg_program/list','mis_std_chg_programController@list');
$router->post('chg_program/create','mis_std_chg_programController@create');
$router->get('chg_program/show/{id}','mis_std_chg_programController@show');
$router->get('chg_program/getdata/{id}','mis_std_chg_programController@get_data');
$router->post('chg_program/update','mis_std_chg_programController@update');

//FINANCIAL STUDENT 14032022
$router->post('financialStudentView','mis_std_financialController@show');

// mis_edu_level
$router->get('/misEduLevel/list','mis_edu_levelController@list');

// mis_std_regsubject
$router->post('/misStdRegsub/register','mis_std_regsubjectController@register');
$router->get('/misStdRegsub/listByStd/{id}','mis_std_regsubjectController@listByStd');
$router->post('/misStdRegsub/delete','mis_std_regsubjectController@delete');
$router->post('/misStdRegsub/listByYearCrs','mis_std_regsubjectController@listByYearCrs');
$router->post('/misStdRegsub/uptStatus','mis_std_regsubjectController@uptStatus');
$router->get('/misStdRegsub/listByStdReg/{id}/{sem}','mis_std_regsubjectController@listByStdReg');
$router->get('/misStdRegsub/listByStdNotReg/{id}','mis_std_regsubjectController@listByStdNotReg');
$router->post('/misStdRegsub/chkStatus','mis_std_regsubjectController@chkStatus');
$router->get('/misStdRegsub/listByYear/{id}','mis_std_regsubjectController@listByYear');
$router->post('/misStdRegsub/listByCrs','mis_std_regsubjectController@listByCrs');
$router->get('/misStdRegsub/listByCotDet/{id}','mis_std_regsubjectController@listByCotDet');
$router->post('/misStdRegsub/addDrop','mis_std_regsubjectController@addDrop');
$router->post('/misStdRegsub/chkReg','mis_std_regsubjectController@chkReg');
$router->get('/misStdRegsub/listByCotDetReg/{id}','mis_std_regsubjectController@listByCotDetReg');
$router->get('/misStdRegsub/countStdReg/{id}','mis_std_regsubjectController@countStdReg');
$router->post('/misStdRegsub/listByFacYear','mis_std_regsubjectController@listByFacYear');
$router->get('/misStdRegsub/listYear','mis_std_regsubjectController@listYear');
$router->post('/misStdRegsub/listByActPolicy','mis_std_regsubjectController@listByActPolicy');
$router->post('/misStdRegsub/listByActPolicy2','mis_std_regsubjectController@listByActPolicy2');
$router->post('/misStdRegsub/listByActPolicy3','mis_std_regsubjectController@listByActPolicy3');
$router->post('/misStdRegsub/listByActPolicy4','mis_std_regsubjectController@listByActPolicy4');
$router->post('/misStdRegsub/listByActPolicy4/CE_display','mis_std_regsubjectController@listByActPolicyCE');
// $router->post('/misStdRegsub/listByActPolicy/CECT_undisplay','mis_std_regsubjectController@listByActPolicyNoCECT');
// $router->post('/misStdRegsub/listByActPolicy5','mis_std_regsubjectController@listByActPolicy5');
$router->post('/misStdRegsub/listByActStd','mis_std_regsubjectController@listByActStd');
$router->post('/misStdRegsub/generateMark','mis_std_regsubjectController@generateMark');
$router->post('/misStdRegsub/listByAcaCalCrs','mis_std_regsubjectController@listByAcaCalCrs');
$router->post('/misStdRegsub/listByAcaCalCrsFixExam','mis_std_regsubjectController@listByAcaCalCrsFixExam');
$router->post('/misStdRegsub/sumByAcaCalCrs','mis_std_regsubjectController@sumByAcaCalCrs');
$router->post('/misStdRegsub/listByAcaCalCrs2','mis_std_regsubjectController@listByAcaCalCrs2');
$router->post('/misStdRegsub/listByAcaCalCrs3','mis_std_regsubjectController@listByAcaCalCrs3');
$router->post('/misStdRegsub/sumStdByAcaCalCrs','mis_std_regsubjectController@sumStdByAcaCalCrs');
$router->post('/misStdRegsub/listByAcaCalCrsStudent','mis_std_regsubjectController@listByAcaCalCrsStudent');
$router->post('/misStdRegsub/listCalYearSem','mis_std_regsubjectController@listCalYearSem');
$router->post('/misStdRegsub/listAttendance/week','mis_std_regsubjectController@stdListAtend');
$router->post('/misStdRegsub/summary/week', 'mis_std_regsubjectController@summary_tmtDet');
$router->post('/misStdRegsub/summary/week2', 'mis_std_regsubjectController@summary_tmtDet2');
$router->post('/misStdRegsub/summary/student', 'mis_std_regsubjectController@summary_tmtDet3');
$router->post('/misStdRegsub/summary/attendance', 'mis_std_regsubjectController@attendance');
$router->post('/misStdRegsub/priceCourse', 'mis_std_regsubjectController@priceCourse');
$router->post('/misStdRegsub/ip/update', 'mis_std_regsubjectController@update_ip');
$router->post('/misStdRegsub/mrf/update', 'mis_std_regsubjectController@update_mrf');
$router->post('/misStdRegsub/update/session', 'mis_std_regsubjectController@updateAcaCal');
$router->post('/misStdRegsub/list/listStdByTimetableExam', 'mis_std_regsubjectController@listStdByTimetableExam'); // afiez 09nov2023
$router->post('/misStdRegsub/reporting/listCalYearSem','mis_std_regsubjectController@reportinglistCalYearSem');
$router->post('/misStdRegsub/reporting/gpaCgpa','mis_std_regsubjectController@reportingGpaCgpa');
$router->post('/misStdRegsub/ip/session','mis_std_regsubjectController@curAcaIP');
$router->get('/misStdRegsub/listcourseByID/{std_studentid}','mis_std_regsubjectController@listcourseByID');
$router->post('/misStdRegsub/attendanceStudent','mis_std_regsubjectController@attendanceStudent');
$router->post('/misStdRegsub/warningLetter','mis_std_regsubjectController@warningLetter');
$router->post('/misStdRegsub/warningLetterUpload','mis_std_regsubjectController@warningLetterUpload');
$router->post('/misStdRegsub/cteListByCourseAcacal','mis_std_regsubjectController@cteListByCourseAcacal');
$router->get('/misStdRegsub/cectListed/{matrices}','mis_std_regsubjectController@cectListed');


// mis_std_withdraw
$router->post('/misStdWithdraw/register','mis_std_withdrawController@register');
$router->get('/misStdWithdraw/list', 'mis_std_withdrawController@list');
$router->get('/misStdWithdraw/show/{id}', 'mis_std_withdrawController@show');
$router->get('/misStdWithdraw/showById/{id}', 'mis_std_withdrawController@showById');
$router->post('/misStdWithdraw/uptFacAdmin','mis_std_withdrawController@uptFacAdmin');
$router->post('/misStdWithdraw/uptClearance','mis_std_withdrawController@uptClearance');
$router->post('/misStdWithdraw/uptARAdmin','mis_std_withdrawController@uptARAdmin');

//mis_prm_subject
$router->post('/misSubject/create','mis_prm_subjectController@create');
$router->get('/misSubject/list', 'mis_prm_subjectController@list');
$router->post('/misSubject/show', 'mis_prm_subjectController@view');
$router->post('/misSubject/update', 'mis_prm_subjectController@update');

//mis_std_infoController_finance
$router->get('/studentdetails/list', 'mis_std_infoController_finance@list');
$router->get('/studentdetails/showByIC/{ic}', 'mis_std_infoController_finance@showByIC');

//mis_std_slipExamController
//final exam
$router->post('/misStdSlipExam/listBySession','mis_std_slipExamController@listBySession');
$router->post('/misStdRegsub/listByActPolicy5','mis_std_regsubjectController@listByActPolicy5');
$router->post('/misStdRegsub/listByActPolicy5NoCE','mis_std_regsubjectController@listByActPolicy5NoCE');

//finalexam Others
$router->post('/misStdSlipExam/listBySessionSExam','mis_std_slipExamController@listBySessionSExam');


//mis_std_evaluationController
$router->post('/misStdEvaluate/register','mis_std_evaluationController@register');



//picoms_cte_questionsController
$router->post('/cte/register','picoms_cte_questionsController@create');
$router->get('/cte/viewActiveQuestion','picoms_cte_questionsController@viewActiveQuestion');




//picoms_cte_questionsController
$router->post('/cte/stdFeedback/create','picoms_cte_stdFeedbackController@create');
$router->get('/cte/stdFeedback/view/{std_id}/{cotDet}/{emp_id}','picoms_cte_stdFeedbackController@view_stdID_cotdet');
$router->get('/cte/stdFeedbackLec/view/{emp_id}/{cotDet}','picoms_cte_stdFeedbackController@view_empID_cotdet');
$router->get('/cte/stdFeedbackLec/studentRate/{emp_id}/{cCode}/{acaSession}','picoms_cte_stdFeedbackController@studentRate');


// $router->get('/cte/stdFeedbackLec/view/{emp_id}/{cotDet}','picoms_cte_stdFeedbackController@view_empID_cotdet');
$router->post('/cte/stdFeedbackLec/totalStudent','picoms_cte_stdFeedbackController@totalStudent');


