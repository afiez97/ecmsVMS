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

// hep_aduan
$router->post('/hepaduan/register', 'hep_aduanController@register');
$router->post('/hepaduan/show/{id}', 'hep_aduanController@show');
$router->get('/hepaduan/list', 'hep_aduanController@list');
$router->post('/hepaduan/update', 'hep_aduanController@update');
$router->post('/hepaduan/delete', 'hep_aduanController@delete');
$router->get('/hepaduan/countAlert', 'hep_aduanController@countAlert');
$router->get('/hepaduan/listByStd/{id}', 'hep_aduanController@listByStd');
$router->post('/hepaduan/uptStd', 'hep_aduanController@uptStd');
$router->get('/hepaduan/listByStaf/{id}', 'hep_aduanController@listByStaf');
$router->get('/hepaduan/listAduUmum', 'hep_aduanController@listAduUmum');
$router->get('/hepaduan/listAduUmumCmplt', 'hep_aduanController@listAduUmumCmplt');
$router->get('/hepaduan/listKerosakan', 'hep_aduanController@listKerosakan');
$router->get('/hepaduan/listRosakCmplt', 'hep_aduanController@listRosakCmplt');
$router->get('/hepaduan/alertStdReport/{id}', 'hep_aduanController@alertStdReport');
$router->post('/hepaduan/uptComplete', 'hep_aduanController@uptComplete');
$router->post('/hepaduan/uptAlert', 'hep_aduanController@uptAlert');
$router->get('/hepaduan/view/aduanKerosakan/{idStudent}', 'hep_aduanController@viewKerosakan');
$router->get('/hepjenisaduan/listRosak', 'hep_aduanController@listRosak');


// hep_counselling
$router->post('/hepCounselling/register', 'hep_counsellingController@register');
$router->post('/hepCounselling/show/{id}', 'hep_counsellingController@show');
$router->get('/hepCounselling/list', 'hep_counsellingController@list');
$router->post('/hepCounselling/update', 'hep_counsellingController@update');
$router->post('/hepCounselling/delete', 'hep_counsellingController@delete');
$router->get('/hepCounselling/listByStd/{id}', 'hep_counsellingController@listByStd');
$router->post('/hepCounselling/stdRegister', 'hep_counsellingController@stdRegister');
$router->post('/hepCounselling/uptStd', 'hep_counsellingController@uptStd');
$router->post('/hepCounselling/uptStatus', 'hep_counsellingController@uptStatus');
$router->get('/hepCounselling/findByTime/{id}', 'hep_counsellingController@findByTime');
$router->get('/hepCounselling/alertByKaun/{id}', 'hep_counsellingController@alertByKaun');
$router->get('/hepCounselling/alertStdAccpt/{id}', 'hep_counsellingController@alertStdAccpt');
$router->get('/hepCounselling/listByStaf/{id}', 'hep_counsellingController@listByStaf');
$router->get('/hepCounselling/alertCounNew', 'hep_counsellingController@alertCounNew');
$router->post('/hepCounselling/uptAlert', 'hep_counsellingController@uptAlert'); 
$router->post('/hepCounselling/generatePDF', 'hep_counsellingController@generatePDF'); //afiez utk generate PDF
// $router->get('/hepCounselling/generatePDF', 'hep_counsellingController@generatePDF');
$router->get('/hepCounselling/listByTimeTable/{FK_timetable}', 'hep_counsellingController@listByTimeTable'); //afiez utk generate det by Timetable 2nov2023

//afiez

// hep_caun_permohonan
$router->post('/hepcaunpermohonan/register', 'hep_caun_permohonanController@register');
$router->post('/hepcaunpermohonan/show/{id}', 'hep_caun_permohonanController@show');
$router->get('/hepcaunpermohonan/list', 'hep_caun_permohonanController@list');
$router->post('/hepcaunpermohonan/update', 'hep_caun_permohonanController@update');
$router->post('/hepcaunpermohonan/delete', 'hep_caun_permohonanController@delete');

// hep_caun_kaunselor
$router->post('/hepcaunkaunselor/register', 'hep_caun_kaunselorController@register');
$router->get('/hepcaunkaunselor/show/{id}', 'hep_caun_kaunselorController@show');
$router->get('/hepcaunkaunselor/list', 'hep_caun_kaunselorController@list');
$router->post('/hepcaunkaunselor/update', 'hep_caun_kaunselorController@update');
$router->post('/hepcaunkaunselor/delete', 'hep_caun_kaunselorController@delete');
$router->get('/hepcaunkaunselor/findKaun/{id}', 'hep_caun_kaunselorController@findKaun');
$router->get('/hepcaunkaunselor/listByCam/{id}', 'hep_caun_kaunselorController@listByCam');

// hep_caun_timetable
$router->post('/hepcauntimetable/register', 'hep_caun_timetableController@register');
$router->post('/hepcauntimetable/show/{id}', 'hep_caun_timetableController@show');
$router->get('/hepcauntimetable/list', 'hep_caun_timetableController@list');
$router->post('/hepcauntimetable/update', 'hep_caun_timetableController@update');
$router->post('/hepcauntimetable/delete', 'hep_caun_timetableController@delete');
$router->get('/hepcauntimetable/listByKaunselor/{id}', 'hep_caun_timetableController@listByKaunselor');
$router->post('/hepcauntimetable/listByKaunDay', 'hep_caun_timetableController@listByKaunDay');

// hep_dis_kesalahan
$router->post('/hepdiskesalahan/register', 'hep_dis_kesalahanController@register');
$router->post('/hepdiskesalahan/show/{id}', 'hep_dis_kesalahanController@show');
$router->get('/hepdiskesalahan/list', 'hep_dis_kesalahanController@list');
$router->post('/hepdiskesalahan/update', 'hep_dis_kesalahanController@update');
$router->post('/hepdiskesalahan/delete', 'hep_dis_kesalahanController@delete');

// hep_dis_kompaun
$router->post('/hepdiskompaun/register', 'hep_dis_kompaunController@register');
$router->post('/hepdiskompaun/show/{id}', 'hep_dis_kompaunController@show');
$router->get('/hepdiskompaun/list', 'hep_dis_kompaunController@list');
$router->post('/hepdiskompaun/update', 'hep_dis_kompaunController@update');
$router->post('/hepdiskompaun/delete', 'hep_dis_kompaunController@delete');

// hep_dis_salahlaku
$router->post('/hepdissalahlaku/register', 'hep_dis_salahlakuController@register');
$router->post('/hepdissalahlaku/show/{id}', 'hep_dis_salahlakuController@show');
$router->get('/hepdissalahlaku/list', 'hep_dis_salahlakuController@list');
$router->post('/hepdissalahlaku/update', 'hep_dis_salahlakuController@update');
$router->post('/hepdissalahlaku/delete', 'hep_dis_salahlakuController@delete');

// hep_jenisaduan
$router->post('/hepjenisaduan/register', 'hep_jenisaduanController@register');
$router->post('/hepjenisaduan/show/{id}', 'hep_jenisaduanController@show');
$router->get('/hepjenisaduan/list', 'hep_jenisaduanController@list');
$router->post('/hepjenisaduan/update', 'hep_jenisaduanController@update');
$router->post('/hepjenisaduan/delete', 'hep_jenisaduanController@delete');

// hep_jenisaduanHostel
$router->post('/hep_jenisaduanHostel/register', 'hep_jenisaduanHostelController@register');
$router->post('/hep_jenisaduanHostel/show', 'hep_jenisaduanHostelController@show');
$router->get('/hep_jenisaduanHostel/list', 'hep_jenisaduanHostelController@list');
$router->post('/hep_jenisaduanHostel/update', 'hep_jenisaduanHostelController@update');
$router->post('/hep_jenisaduanHostel/delete', 'hep_jenisaduanHostelController@delete');

// hep_aduanResponden
$router->post('/hep_aduanResponden/register', 'hep_aduanRespondenController@register');
$router->post('/hep_aduanResponden/show', 'hep_aduanRespondenController@show');
$router->get('/hep_aduanResponden/list', 'hep_aduanRespondenController@list');
$router->get('/hep_aduanResponden/complaintNewAlert', 'hep_aduanRespondenController@complaintNewAlert');
$router->post('/hep_aduanResponden/update', 'hep_aduanRespondenController@update');
$router->post('/hep_aduanResponden/update/updateByStudent', 'hep_aduanRespondenController@updateByStudent');
$router->post('/hep_aduanResponden/delete', 'hep_aduanRespondenController@delete');
$router->get('/hep_aduanResponden/{FK_student}', 'hep_aduanRespondenController@listByIDstudent');
// $router->get('/hep_aduanResponden/{FK_student}', 'hep_aduanRespondenController@listByIDstudent');
$router->post('/hep_aduanResponden/reporting/reportComplaint', 'hep_aduanRespondenController@reportComplaint'); 

// $router->get('/hep_aduanResponden/complaintNewAlert', 'hep_aduanRespondenController@complaintNewAlert');

// hep_peserta
$router->post('/heppeserta/register', 'hep_pesertaController@register');
$router->get('/heppeserta/show/{id}', 'hep_pesertaController@show');
$router->get('/heppeserta/list/{id}', 'hep_pesertaController@list');
$router->post('/heppeserta/update', 'hep_pesertaController@update');
$router->post('/heppeserta/delete', 'hep_pesertaController@delete');
$router->post('/heppeserta/chkAttendance', 'hep_pesertaController@chkAttendance');
$router->get('/heppeserta/listByStd/{id}', 'hep_pesertaController@listByStd');

// hep_program
$router->post('/hepProgram/register', 'hep_programController@register');
$router->get('/hepProgram/show/{id}', 'hep_programController@show');
$router->get('/hepProgram/list', 'hep_programController@list');
$router->post('/hepProgram/update', 'hep_programController@update');
$router->post('/hepProgram/delete', 'hep_programController@delete');
$router->get('/hepProgram/countAlert', 'hep_programController@countAlert');
$router->get('/hepProgram/listStud', 'hep_programController@listStud');
$router->get('/hepProgram/listByUser/{id}', 'hep_programController@listByUser');
$router->get('/hepProgram/countAccProg/{id}', 'hep_programController@countAccProg');
$router->post('/hepProgram/uptReport', 'hep_programController@uptReport');
$router->post('/hepProgram/uptNewByStd', 'hep_programController@uptNewByStd');
$router->post('/hepProgram/uptRprtByStd', 'hep_programController@uptRprtByStd');
$router->post('/hepProgram/uptNotifyUser', 'hep_programController@uptNotifyUser');
$router->post('/hepProgram/countbyKat', 'hep_programController@countbyKat'); //afiez 22sep2023
$router->post('/hepProgram/TotalBudget', 'hep_programController@TotalBudget'); //afiez 22sep2023
$router->post('/hepProgram/reporting/reportProg', 'hep_programController@reportProg'); //afiez 29sep2023



// hep_discipline
$router->post('/hepDiscipline/register', 'hep_disciplineController@register');
$router->post('/hepDiscipline/show/{id}', 'hep_disciplineController@show');
$router->get('/hepDiscipline/list', 'hep_disciplineController@list');
$router->post('/hepDiscipline/listReport', 'hep_disciplineController@list');
$router->post('/hepDiscipline/update', 'hep_disciplineController@update');
$router->post('/hepDiscipline/delete', 'hep_disciplineController@delete');
$router->get('/hepDiscipline/listByStud/{id}', 'hep_disciplineController@listByStud');
$router->get('/hepDiscipline/countAlert/{id}', 'hep_disciplineController@countAlert');
$router->get('/hepDiscipline/countAlrtAdmin', 'hep_disciplineController@countAlrtAdmin');
$router->post('/hepDiscipline/uptPaid', 'hep_disciplineController@uptPaid');

// hep_caun_type
$router->post('/hepCaunType/register', 'hep_caun_typeController@register');
$router->post('/hepCaunType/show/{id}', 'hep_caun_typeController@show');
$router->get('/hepCaunType/list', 'hep_caun_typeController@list');
$router->post('/hepCaunType/update', 'hep_caun_typeController@update');
$router->post('/hepCaunType/delete', 'hep_caun_typeController@delete');


// hep_hostel
$router->post('/hepHostel/register', 'hep_hostelController@register');
$router->get('/hepHostel/show/{id}', 'hep_hostelController@show');
$router->get('/hepHostel/list', 'hep_hostelController@list');
$router->post('/hepHostel/update', 'hep_hostelController@update');
$router->post('/hepHostel/delete', 'hep_hostelController@delete');
$router->get('/hepHostel/listByBranch/{id}', 'hep_hostelController@listByBranch');
$router->get('/hepHostel/listByBranch/Active/{id}', 'hep_hostelController@listByBranchActive');
$router->get('/hepHostel/listByClgAll/{id}', 'hep_hostelController@listByClgAll');
$router->get('/hepHostel/listActive', 'hep_hostelController@listActive');

// hep_hostel_blok
$router->post('/hepHostelBlok/register', 'hep_hostel_blokController@register');
$router->get('/hepHostelBlok/show/{id}', 'hep_hostel_blokController@show');
$router->get('/hepHostelBlok/list/{id}', 'hep_hostel_blokController@list');
$router->post('/hepHostelBlok/update', 'hep_hostel_blokController@update');
$router->post('/hepHostelBlok/delete', 'hep_hostel_blokController@delete');
$router->get('/hepHostelBlok/listByHostel/{id}', 'hep_hostel_blokController@listByHostel');
$router->post('/hepHostelBlok/listByHstlGndr', 'hep_hostel_blokController@listByHstlGndr');

// hep_hostel_room
$router->post('/hepHostelRoom/register', 'hep_hostel_roomController@register');
$router->get('/hepHostelRoom/show/{id}', 'hep_hostel_roomController@show');
$router->get('/hepHostelRoom/list/{id}', 'hep_hostel_roomController@list');
$router->post('/hepHostelRoom/update', 'hep_hostel_roomController@update');
$router->post('/hepHostelRoom/delete', 'hep_hostel_roomController@delete');
$router->get('/hepHostelRoom/listByBlok/{id}', 'hep_hostel_roomController@listByBlok');
$router->get('/hepHostelRoom/listByBlok2/{id}', 'hep_hostel_roomController@listByBlok2');
// $router->get('/hepHostelRoom/listAll/', 'hep_hostel_roomController@listAll'); //29sep2023
$router->get('/hepHostelRoom/listAll/{genZ}', 'hep_hostel_roomController@listAll'); //29sep2023


// hep_hostel_bed
$router->post('/hepHostelBed/register', 'hep_hostel_bedController@register');
$router->get('/hepHostelBed/show/{id}', 'hep_hostel_bedController@show');
$router->get('/hepHostelBed/list/{id}', 'hep_hostel_bedController@list');
$router->post('/hepHostelBed/update', 'hep_hostel_bedController@update');
$router->post('/hepHostelBed/delete', 'hep_hostel_bedController@delete');
$router->get('/hepHostelBed/listByRoom/{id}', 'hep_hostel_bedController@listByRoom');
$router->get('/hepHostelBed/listByRmActNo/{id}', 'hep_hostel_bedController@listByRmActNo');
$router->post('/hepHostelBed/uptSttsBooked', 'hep_hostel_bedController@uptSttsBooked');

// hep_hostel_booking
$router->post('/hepHostelBooking/register', 'hep_hostel_bookingController@register');
$router->get('/hepHostelBooking/show/{id}', 'hep_hostel_bookingController@show');
$router->get('/hepHostelBooking/list', 'hep_hostel_bookingController@list');
$router->post('/hepHostelBooking/update', 'hep_hostel_bookingController@update');
$router->post('/hepHostelBooking/delete', 'hep_hostel_bookingController@delete');
$router->get('/hepHostelBooking/countAlert', 'hep_hostel_bookingController@countAlert');
$router->get('/hepHostelBooking/listByStud/{id}', 'hep_hostel_bookingController@listByStud');
$router->post('/hepHostelBooking/uptByStd', 'hep_hostel_bookingController@uptByStd');
$router->get('/hepHostelBooking/alertBookStd/{id}', 'hep_hostel_bookingController@alertBookStd');
$router->post('/hepHostelBooking/uptStatus', 'hep_hostel_bookingController@uptStatus');
$router->get('/hepHostelBooking/uptNotifyStd/{id}', 'hep_hostel_bookingController@uptNotifyStd');
$router->get('/hepHostelBooking/checkingRoomBooked/{room_id}', 'hep_hostel_bookingController@checkingRoomBooked');


// hep_hostel_change
$router->post('/hepHostelChange/register', 'hep_hostel_changeController@register');
$router->get('/hepHostelChange/show/{id}', 'hep_hostel_changeController@show');
$router->get('/hepHostelChange/list', 'hep_hostel_changeController@list');
$router->post('/hepHostelChange/update', 'hep_hostel_changeController@update');
$router->post('/hepHostelChange/delete', 'hep_hostel_changeController@delete');
$router->get('/hepHostelChange/alertChgNew', 'hep_hostel_changeController@alertChgNew');
$router->get('/hepHostelChange/alertChngVerify', 'hep_hostel_changeController@alertChngVerify');
// $router->get('/hepHostelChange/alertChgAccStd/{id}', 'hep_hostel_changeController@alertChgAccStd');
$router->get('/hepHostelChange/alertChngAccept', 'hep_hostel_changeController@alertChngAccept');
$router->get('/hepHostelChange/alertChngRjct', 'hep_hostel_changeController@alertChngRjct');
$router->get('/hepHostelChange/alertChgVrfy', 'hep_hostel_changeController@alertChgVrfy');
$router->get('/hepHostelChange/alertChgCmplt', 'hep_hostel_changeController@alertChgCmplt');
$router->get('/hepHostelChange/listByStd/{id}', 'hep_hostel_changeController@listByStd');
$router->post('/hepHostelChange/uptByStd', 'hep_hostel_changeController@uptByStd');
$router->post('/hepHostelChange/uptStatus', 'hep_hostel_changeController@uptStatus');
$router->post('/hepHostelChange/chkChgStd', 'hep_hostel_changeController@chkChgStd');
$router->get('/hepHostelChange/notifyStdReject/{id}', 'hep_hostel_changeController@notifyStdReject');
$router->get('/hepHostelChange/uptNotifyStd/{id}', 'hep_hostel_changeController@uptNotifyStd');
$router->post('/hepHostelChange/reportingChangehstl', 'hep_hostel_changeController@reportingChangehstl'); //29sep2023 afiez
$router->get('/hepHostelChange/verifyroom/{block_id}/{room_id}', 'hep_hostel_changeController@verifyroom');
// hep_hostel_chkinout
$router->post('/hepHostelChkinout/register', 'hep_hostel_checkInOutController@register');
$router->post('/hepHostelChkinout/unreside', 'hep_hostel_checkInOutController@unreside');
$router->get('/hepHostelChkinout/show/{id}', 'hep_hostel_checkInOutController@show');
$router->get('/hepHostelChkinout/list', 'hep_hostel_checkInOutController@list');
$router->post('/hepHostelChkinout/update', 'hep_hostel_checkInOutController@update');
$router->post('/hepHostelChkinout/uptChkIn', 'hep_hostel_checkInOutController@uptChkIn');
$router->post('/hepHostelChkinout/delete', 'hep_hostel_checkInOutController@delete');
$router->get('/hepHostelChkinout/alertChkOutNew', 'hep_hostel_checkInOutController@alertChkOutNew');
$router->get('/hepHostelChkinout/alertChkOutNewOnly', 'hep_hostel_checkInOutController@alertChkOutNewOnly');
$router->post('/hepHostelChkinout/chkOut', 'hep_hostel_checkInOutController@chkOut');
$router->get('/hepHostelChkinout/listByStd/{id}', 'hep_hostel_checkInOutController@listByStd');
$router->get('/hepHostelChkinout/checkLateststatus/{id}', 'hep_hostel_checkInOutController@checkLateststatus');
$router->get('/hepHostelChkinout/countChkIn/{id}', 'hep_hostel_checkInOutController@countChkIn');
$router->get('/hepHostelChkinout/chkStdChkIn/{id}', 'hep_hostel_checkInOutController@chkStdChkIn');
$router->get('/hepHostelChkinout/alertStdNew/{id}', 'hep_hostel_checkInOutController@alertStdNew');
$router->get('/hepHostelChkinout/chkStdSttsChkIn/{id}', 'hep_hostel_checkInOutController@chkStdSttsChkIn');
$router->get('/hepHostelChkinout/notifyAdminChkOut', 'hep_hostel_checkInOutController@notifyAdminChkOut');
$router->get('/hepHostelChkinout/uptNotifyAdmin/{id}', 'hep_hostel_checkInOutController@uptNotifyAdmin');
$router->get('/hepHostelChkinout/uptNotifyStd/{id}', 'hep_hostel_checkInOutController@uptNotifyStd');
$router->get('/hepHostelChkinout/uptNotifyWarden/{id}', 'hep_hostel_checkInOutController@uptNotifyWarden');
$router->get('/hepHostelChkinout/chkStdNotChkOut/{id}', 'hep_hostel_checkInOutController@chkStdNotChkOut');
$router->get('/hepHostelChkinout/chkHstlOccupied/{id}', 'hep_hostel_checkInOutController@chkHstlOccupied');
$router->get('/hepHostelChkinout/chkBlckOccupied/{id}', 'hep_hostel_checkInOutController@chkBlckOccupied');
$router->post('/hepHostelChkinout/chkBlckOccupied/hostelInfo', 'hep_hostel_checkInOutController@det_student_info'); // afiez utk searching 18sep2023
$router->post('/hepHostelChkinout/reporting/reportChckOut', 'hep_hostel_checkInOutController@reportChckOut'); // afiez utk report 27nov2023
$router->post('/hepHostelChkinout/reporting/reportChkIn', 'hep_hostel_checkInOutController@reportChkIn'); // afiez utk report 29sep2023
$router->get('/hepHostelChkinout/dashboardMainCity', 'hep_hostel_checkInOutController@dashboardMainCity'); //afiez utk report 30sep2023
$router->post('/hepHostelChkinout/dashboard/Occupied', 'hep_hostel_checkInOutController@dashboardOccupied'); //afiez utk report 30sep2023
$router->get('/hepHostelChkinout/list/listExcludeNewcheckin', 'hep_hostel_checkInOutController@listExcludeNewcheckin');
$router->post('/hepHostelChkinout/list/AssignedAkaNewCheckIN', 'hep_hostel_checkInOutController@ListAssignedAKANewCheckIN');
$router->post('/hepHostelChkinout/StudentGrad', 'hep_hostel_checkInOutController@StudentGrad');
$router->post('/hepHostelChkinout/Reporting/reportingChkInOut', 'hep_hostel_checkInOutController@reportingChkInOut');
$router->get('/hepHostelChkinout/checking/chkSttsInAndNEw/{id}', 'hep_hostel_checkInOutController@chkSttsInAndNEw');
$router->get('/hepHostelChkinout/checking/chkLatestRoom/{id}', 'hep_hostel_checkInOutController@chkLatestRoom');
$router->post('/hepHostelChkinout/reporting/reportBaitulMal', 'hep_hostel_checkInOutController@reportBaitulMal2');  // afiez tukar utk display
$router->post('/hepHostelChkinout/reporting/reportUnreside', 'hep_hostel_checkInOutController@reportUnreside'); 
$router->post('/hepHostelChkinout/reporting/reportCheckIn', 'hep_hostel_checkInOutController@reportCheckIn'); 
$router->post('/hepHostelChkinout/reporting/reportCheckOut', 'hep_hostel_checkInOutController@reportCheckOut'); 
$router->get('/hepHostelChkinout/reporting/reportSummary', 'hep_hostel_checkInOutController@reportSummary'); 
$router->get('/hepHostelChkinout/bookingSite/checkBookinngList/{fk_booking}', 'hep_hostel_checkInOutController@checkBookinngList'); 
$router->get('/hepHostelChkinout/checking/chkLatestRoombyID/{chkInOut_id}', 'hep_hostel_checkInOutController@chkLatestRoombyID');
$router->get('/hepHostelChkinout/checking/{chkInOut_id}', 'hep_hostel_checkInOutController@checkByFKCHkInOut');
$router->get('/hepHostelChkinout/reporting/reportingListStd', 'hep_hostel_checkInOutController@reportingListStd'); 






// hep_warden
$router->post('/hepWarden/register', 'hep_wardenController@register');
$router->get('/hepWarden/list', 'hep_wardenController@list');
$router->post('/hepWarden/update', 'hep_wardenController@update');
$router->post('/hepWarden/delete', 'hep_wardenController@delete');
$router->get('/hepWarden/findStaf/{id}', 'hep_wardenController@findStaf');
$router->get('/hepWarden/wardenActCam/{id}', 'hep_wardenController@wardenActCam');
$router->get('/hepWarden/wardenByCam/{id}', 'hep_wardenController@wardenByCam');

// hep_capaianjenis
$router->post('jenisCapaian/register','hep_capaianjenisController@register');
$router->post('jenisCapaian/update','hep_capaianjenisController@update');
$router->post('jenisCapaian/delete','hep_capaianjenisController@delete');
$router->get('jenisCapaian/view','hep_capaianjenisController@view');    
$router->post('jenisCapaian/list','hep_capaianjenisController@list');
$router->get('jenisCapaian/UtkGenerateIDTable/{inCharge}','hep_capaianjenisController@UtkGenerateIDTable');


// hep_capaianUsr
$router->post('capaianUsr/register','hep_capaianUsrController@register');
$router->post('capaianUsr/update','hep_capaianUsrController@update');
$router->post('capaianUsr/delete','hep_capaianUsrController@delete');
$router->get('capaianUsr/view','hep_capaianUsrController@view');
$router->post('capaianUsr/list','hep_capaianUsrController@list');
$router->get('capaianUsr/listByFKjeniscapaian/{uniqueCapaian}','hep_capaianUsrController@viewByFKjeniscapaian');
$router->get('capaianUsr/checkingCapaian/{FK_users}','hep_capaianUsrController@checkingCapaian');
$router->get('capaianUsr/ExistingUser/{FK_users}/{FK_capaianjenis}','hep_capaianUsrController@ExistingUser');

$router->get('capaianUsr/listUnderIncharge/{FK_users}','hep_capaianUsrController@listUnderIncharge');
