
if( window.sessionStorage.token == null ){ window.location.replace("admin_login.html"); }

//-------------------------------------------------- mis_prm_curyear --------------------------------------------------//
// select Intake active
function intakeAct(returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmCuryear/listIntakeAct",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_intake = response;
    returnValue();
  });
}

// Groupby cur_year active
function curYearAct(returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmCuryear/listYearAct",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_curYearAct = response;

    returnValue();
  });
}

// Groupby cur_year active
function curYearActUpt(id, returnValue) {
  var form = new FormData();
  form.append("exam_policy_id", id);
  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmCuryear/listYearActUpt",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  $.ajax(settings).done(function (response) {
    obj_curYearAct = JSON.parse(response);

    returnValue();
  });
}

// list Intake Active by Year
function listIntakeActByYear(id, returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmCuryear/opt_intake/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_cohort = response;
    returnValue();
  });
}
//-------------------------------------------------- end mis_prm_curyear --------------------------------------------------//

//-------------------------------------------------- mis_prm_programme_det --------------------------------------------------//
// list Programme by Intake
function progDet(id, returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmProgDet/listByIntake/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_pgmIntake = response;
    returnValue();
  });
}

// groupBy Programme by Year
function progDetYear(id, returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmProgDet/listByYear/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_pgmYear = response;
    returnValue();
  });
}

// show Programme Details
function cotDetails(id, returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmProgDet/show/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    data = response.data;
    returnValue();
  });
}

// list Programme by Year
function progYear(id, returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmProgDet/progYear/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_progYear = response;
    returnValue();
  });
}

// list by Academic Calendar & Sem
function pgmDetByCalSem(year, semester, returnValue) {
  var form = new FormData();
  form.append("aca_cal", year);
  form.append("cal_cohort", semester);

  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmProgDet/progByAcaCal",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  $.ajax(settings).done(function (response) {
    obj_progYear = JSON.parse(response);
    returnValue();
  });
}
//-------------------------------------------------- end mis_prm_programme_det --------------------------------------------------//

//-------------------------------------------------- mis_exam_type --------------------------------------------------//
// Examination Type list
function exmTypeList(returnValue) {
  var settings = {
    url: host + "api_exam_picoms/public/misExamType/list",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_exmType = response;
    returnValue();
  });
}
//-------------------------------------------------- end mis_exam_type --------------------------------------------------//

//-------------------------------------------------- status --------------------------------------------------//
// status list
function statusList(returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/status/list",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_status = response;
    returnValue();
  });
}
//-------------------------------------------------- end status --------------------------------------------------//
//-------------------------------------------------- status academic --------------------------------------------------//
// status list
function statusListAcademic(returnValue) {
  var settings = {
    url: host + "api_public_access/public/statusList",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_statusAcademic = response;
    returnValue();
  });
}
//-------------------------------------------------- end status --------------------------------------------------//

//-------------------------------------------------- mis_prm_faccampus --------------------------------------------------//
// list Faculty for Campus
function facCamList(clgId, returnValue) {
  var settings = {
    url:
      host + "api_tetapan_picoms/public/misPrmFacCampus/listByCampus/" + clgId,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_facCampus = response;
    returnValue();
  });
}
//-------------------------------------------------- end mis_prm_faccampus --------------------------------------------------//

//-------------------------------------------------- mis_prm_programme --------------------------------------------------//
// show Program data
function dataProgram(id, returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmProg/show/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    data = response.data;
    returnValue();
  });
}
//-------------------------------------------------- end mis_prm_programme --------------------------------------------------//

//-------------------------------------------------- mis_prm_course --------------------------------------------------//
// list Course
function courseList(returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmCourse/list",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_course = response;
    returnValue();
  });
}

// show course
function courseShow(id, returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmCourse/show/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_crsShow = response;
    returnValue();
  });
}

// list course active
function listCrsAct(returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmCourse/listAct",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_crsActive = response;
    returnValue();
  });
}
//-------------------------------------------------- end mis_prm_course --------------------------------------------------//

//-------------------------------------------------- hrm_emp_info --------------------------------------------------//
// list lecturer
function lecturerList(returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/hrmEmpInfo/list",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_lecturer = response;
    returnValue();
  });
}

// show lecturer
function lectDetails(id, returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/hrmEmpInfo/show/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  let request = $.ajax(settings);
  request.done(function (response) {
    obj_lectDet = response.data;
    returnValue();
  });

  request.fail(function () {
    obj_lectDet = { success: false };
    returnValue();
  });
}
//-------------------------------------------------- end hrm_emp_info --------------------------------------------------//

//-------------------------------------------------- hrm_emp_position --------------------------------------------------//
// list position by employer
function listEmpPosition(id, returnValue) {
  var settings = {
    url: host + "api_lecturer_picoms/public/hrmEmpPosition/list/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_empPosition = response;
    returnValue();
  });
}
//-------------------------------------------------- end hrm_emp_position --------------------------------------------------//

//-------------------------------------------------- sad_groupuser --------------------------------------------------//
function grpUser(returnValue) {
  var settings = {
    url: host + "api_polisi/public/sadGroupuser/list",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_grpUser = response;
    returnValue();
  });
}
//-------------------------------------------------- end sad_groupuser --------------------------------------------------//

//-------------------------------------------------- mis_prm_faclecturer --------------------------------------------------//
// list lecturer for campus
function facLecturerList(id, returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmFacLect/listByCampus/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_facLect = response;
    returnValue();
  });
}
//-------------------------------------------------- end mis_prm_faclecturer --------------------------------------------------//

//-------------------------------------------------- mis_prm_course_cot_det --------------------------------------------------//
// groupby sem list
function grpBySemester(id, returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmCrsCOTDet/groupBySem/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_semList = response.data;
    returnValue();
  });
}

// list course by pgm_det & sem
function cotDetList(id, semester, returnValue) {
  var form = new FormData();
  form.append("fk_pgm_det", id);
  form.append("fk_semester", semester);

  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmCrsCOTDet/listByPgm",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  $.ajax(settings).done(function (response) {
    let result = JSON.parse(response);
    obj_cotDetList = result.data;
    returnValue();
  });
}

// list course by Programme Detail
function listCourse(id, returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmCrsCOTDet/listCourse/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_listCourse = response;
    returnValue();
  });
}

// groupBy Course by Academic Calendar
function grpByCrsByCal(id, returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmCrsCOTDet/grpByCrsByCal/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_cotDet = response;
    returnValue();
  });
}
//-------------------------------------------------- end mis_prm_course_cot_det --------------------------------------------------//

//-------------------------------------------------- mis_lecturer_course_prm --------------------------------------------------//
// show lecturer course
function detailLectCrs(id, returnValue) {
  var settings = {
    url: host + "api_lecturer_picoms/public/misLectCrsPrm/show/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  let request = $.ajax(settings);

  request.done(function (response) {
    obj_detCourse = response;
    returnValue();
  });

  request.fail(function () {
    obj_detCourse = { success: false };
    returnValue();
  });
}

// list lect course
function lectCourse(id, returnValue) {
  var settings = {
    url: host + "api_lecturer_picoms/public/misLectCrsPrm/list/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_lectCrs = response;
    returnValue();
  });
}

// list by Course & Academic Calendar
function listAcaCalLect(cur_year, cal_cohort, emp_id, returnValue) {
  var form = new FormData();
  form.append("cur_year", cur_year);
  form.append("cal_cohort", cal_cohort);
  form.append("emp_id", emp_id);

  var settings = {
    url: host + "api_lecturer_picoms/public/misLectCrsPrm/listAcaCalLect",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  $.ajax(settings).done(function (response) {
    obj_lectCrs = JSON.parse(response);
    returnValue();
  });
}
//-------------------------------------------------- end mis_lecturer_course_prm --------------------------------------------------//

//-------------------------------------------------- status_sem --------------------------------------------------//
function statusSem(returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/statussemList",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_sttSem = response;
    returnValue();
  });
}
//-------------------------------------------------- end status_sem --------------------------------------------------//

//-------------------------------------------------- mis_prm_faculty --------------------------------------------------//
// list faculty
function getFaculty(returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmFaculty/list",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_getFaculty = response;
    returnValue();
  });
}
//-------------------------------------------------- end mis_prm_faculty --------------------------------------------------//

//-------------------------------------------------- category --------------------------------------------------//
// list Level of Study
function levelStudy(returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/category/list",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_levelStudy = response;
    returnValue();
  });
}
//-------------------------------------------------- end category --------------------------------------------------//

//-------------------------------------------------- aca_area --------------------------------------------------//
// list Field of Study
function fieldStudy(returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/acaArea/list",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_fieldStudy = response;
    returnValue();
  });
}
//-------------------------------------------------- end aca_area --------------------------------------------------//

//-------------------------------------------------- end aca_area --------------------------------------------------//
// list Mode of Study
function modeStudy(returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/mode/list",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_modeStudy = response;
    returnValue();
  });
}
//-------------------------------------------------- end aca_area --------------------------------------------------//

//-------------------------------------------------- mqflevel --------------------------------------------------//
function mqfLevel(returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/mqflevel/list",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_mqfLevel = response;
    returnValue();
  });
}
//-------------------------------------------------- end mqflevel --------------------------------------------------//

//-------------------------------------------------- mis_std_regsubject --------------------------------------------------//
// list student by year & course
function listStudent(year, crs, returnValue) {
  var form = new FormData();
  form.append("cur_year", year);
  form.append("fk_course", crs);

  var settings = {
    url: host + "api_pengurusan_pelajar/public/misStdRegsub/listByYearCrs",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  $.ajax(settings).done(function (response) {
    obj_stdList = JSON.parse(response);
    returnValue();
  });
}

// list student registered subject by cotDet
function listByCotDetReg(id, returnValue) {
  var settings = {
    url:
      host + "api_pengurusan_pelajar/public/misStdRegsub/listByCotDetReg/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_stdRegCrs = response;
    returnValue();
  });
}

// list student by Academic Calendar & course
function stdByAcaCalCrs(acaCal, crs, returnValue) {
  var form = new FormData();
  form.append("aca_session", acaCal);
  form.append("crs_code", crs);

  var settings = {
    url: host + "api_pengurusan_pelajar/public/misStdRegsub/listByAcaCalCrs",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  $.ajax(settings).done(function (response) {
    obj_stdRegCrs = JSON.parse(response);
    returnValue();
  });
}

// list student by Academic Calendar & course
function stdByAcaCalCrsFixExam(acaCal, crs, returnValue) {
  var form = new FormData();
  form.append("aca_session", acaCal);
  form.append("crs_code", crs);

  var settings = {
    url: host + "api_pengurusan_pelajar/public/misStdRegsub/listByAcaCalCrsFixExam",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  $.ajax(settings).done(function (response) {
    obj_stdRegCrs = JSON.parse(response);
    returnValue();
  });
}

// function stdByAcaCalCrs2(acaCal, crs, returnValue) {
//   var form = new FormData();
//   form.append("aca_session", acaCal);
//   form.append("crs_code", crs);

//   var settings = {
//     url: host + "api_pengurusan_pelajar/public/misStdRegsub/listByAcaCalCrs2",
//     method: "POST",
//     timeout: 0,
//     headers: {
//       Authorization: "picoms " + window.sessionStorage.token,
//     },
//     processData: false,
//     mimeType: "multipart/form-data",
//     contentType: false,
//     data: form,
//   };

//   $.ajax(settings).done(function (response) {
//     obj_stdRegCrs = JSON.parse(response);
//     returnValue();
//   });
// }
//-------------------------------------------------- end mis_std_regsubject --------------------------------------------------//

//-------------------------------------------------- mis_prm_gredscheme --------------------------------------------------//
// get course by campus
function gradeScheme(clg, crs, returnValue) {
  var form = new FormData();
  form.append("cam_id", clg);
  form.append("gsc_name", crs);

  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmGredScheme/listByCamCrs",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  $.ajax(settings).done(function (response) {
    obj_grdScheme = JSON.parse(response);
    returnValue();
  });
}

// check id by course
function findId(crs, returnValue) {
  var form = new FormData();
  form.append("input", crs);

  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmGredScheme/checkName",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  $.ajax(settings).done(function (response) {
    obj_grdSchm = JSON.parse(response);
    returnValue();
  });
}

function findId2(crs, fk_cotDet, fk_aca_cal, crsId, returnValue) {
  var form = new FormData();
  form.append("crs", crs);
  form.append("fk_cotDet", fk_cotDet);
  form.append("aca_session", fk_aca_cal);
  form.append("crs_code", crsId);
  
  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmGredScheme/checkName2",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  // $.ajax(settings)
  let request = $.ajax(settings);

  request.done(function (response) {
    obj_grdSchm = JSON.parse(response);
    returnValue();
  });
  request.fail(function () {
    // obj_lectDet = { success: false };
    swal("Failed to Load", 'Grading scheme has not been updated.', "error");
    $('#loading_mode').modal('hide');
    returnValue();
  });
  
}


function findCloCourse(crsId, returnValue) {
  var form = new FormData();
  form.append("FK_course", crsId);

  var settings = {
    url: host + "api_tetapan_picoms/public/obe/clo_ByCourse/showCourseDet",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  $.ajax(settings).done(function (response) {
    obj_cloCourse = JSON.parse(response);
    returnValue();
  });
}



//-------------------------------------------------- end mis_prm_gredscheme --------------------------------------------------//

//-------------------------------------------------- mis_prm_gredscheme_det --------------------------------------------------//
// list grade scheme item for course
function gradeCmpnnt(id, returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmDetGredScheme/listByGS/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_grdSchmDet = response;
    returnValue();
  });
}

function gradeCmpnntCLO(id, returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmDetGredScheme/listByCLO/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_grdCLO = response;
    returnValue();
  });
}

function gradeCmpnntAll(id, returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmDetGredScheme/listByAll/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_allMarks = response;
    returnValue();
  });
}

function gradeCmpnntPLO(id, returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmDetGredScheme/listByPLO/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_grdPLO = response;
    returnValue();
  });
}



function gradeCmpnnt2(id, returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmDetGredScheme/listByGS2/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_grdSchmDet = response;
    returnValue();
  });
}

function detailsList(id, returnValue) {
  var form = new FormData();
  form.append("gsc_id", id);

  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmDetGredScheme/show",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  $.ajax(settings).done(function (response) {
    let result = JSON.parse(response);
    obj_detList = result;
    returnValue();
  });
}
//-------------------------------------------------- end mis_prm_gredscheme_det --------------------------------------------------//

// list sub-item for item grade scheme
function markList(id, type, returnValue) {
  var form = new FormData();
  form.append("fk_cotDet", id);
  form.append("fk_gsDet", type);

  var settings = {
    url: host + "api_lecturer_picoms/public/misLectCrsDet/listAss",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
    // data2: form,
  };

  $.ajax(settings).done(function (response) {
    obj_mark = JSON.parse(response);
    returnValue();
  });
}

// mis_prm_credit
function viewCredit(returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmCredit/list",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_minMaxCredit = response;
    returnValue();
  });
}

// date format
function formatDate(date) {
  let newDate = "";
  if (date) {
    let arrayDate = date.split("-");
    newDate = arrayDate[2] + "/" + arrayDate[1] + "/" + arrayDate[0];
  } else {
    newDate = "";
  }

  return newDate;
}

// time format
function formatTime(timeString) {
  const [hourString, minute] = timeString.split(":");
  const hour = +hourString % 24;
  return (hour % 12 || 12) + ":" + minute + (hour < 12 ? " AM" : " PM");
}

// list calendar category
function calCatList(returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/acaCalCategory/list",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_acaField = response;
    returnValue();
  });
}

//-------------------------------------------------- mis_prm_calendar --------------------------------------------------//
function kalendarList(returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmCalendar/list",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_kalendarList = response;
    returnValue();
  });
}

// list by Academic Calendar Category
function calByCategory(id, returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmCalendar/listByCat/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_kalendar = response;
    returnValue();
  });
}

// list by Academic Calendar Category
function acaCalActive(returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmCalendar/listActive",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
    async:false
  };

  request = $.ajax(settings);
  request.done(function (response) {
    obj_kalendar = response;
    returnValue();
  });

  request.error(function (response) {
    logOut();
  });
}

function examLocation(returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmCalendar/listActive",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_kalendar = response;
    returnValue();
  });
}

function acaCalActive2(returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmCalendar/listActive2",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_kalendar = response;
    returnValue();
  });
}

// list Category by year & sem
function catByYearSem(year, sem, returnValue) {
  var form = new FormData();
  form.append("cur_year", year);
  form.append("cal_cohort", sem);

  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmCalendar/catByYearSem",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  $.ajax(settings).done(function (response) {
    obj_kalendar = JSON.parse(response);
    returnValue();
  });
}

// show Academic Calendar
function showAcaCal(id, returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmCalendar/show/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_kalendar = response;
    returnValue();
  });
}
//-------------------------------------------------- end mis_prm_calendar --------------------------------------------------//

//-------------------------------------------------- mis_exam_invigilator --------------------------------------------------//
// list Exam Timetable by Academic Calendar & Lecturer
function listByCalLect(year, sem, lect, returnValue) {
  var form = new FormData();
  form.append("cur_year", year);
  form.append("cal_cohort", sem);
  form.append("fk_lect", lect);

  var settings = {
    url: host + "api_exam_picoms/public/misExamInvgltr/listByCalLect",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  $.ajax(settings).done(function (response) {
    obj_exmInvgltr = JSON.parse(response);
    returnValue();
  });
}

// show exam invigilator detail
function showExmInv(id, returnValue) {
  var settings = {
    url: host + "api_exam_picoms/public/misExamInvgltr/show/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_exmInv = response;
    returnValue();
  });
}
//-------------------------------------------------- end mis_exam_invigilator --------------------------------------------------//

//-------------------------------------------------- mis_exam_student --------------------------------------------------//
function listExmStd(id, returnValue) {
  var settings = {
    url: host + "api_exam_picoms/public/misExamStd/listByExam/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_exmStd = response;
    returnValue();
  });
}

// list student by exam timetable & venue
function stdByExmVenue(exmTmt, venue, returnValue) {
  var form = new FormData();
  form.append("fk_exam", exmTmt);
  form.append("fk_venue", venue);

  var settings = {
    url: host + "api_exam_picoms/public/misExamStd/listByExamVenue",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  $.ajax(settings).done(function (response) {
    obj_exmStd = JSON.parse(response);
    returnValue();
  });
}

function studentPloClo(fk_cotDet, std_id, returnValue) {
  var form = new FormData();
  form.append("fk_student", std_id);
  form.append("fk_cotDet", fk_cotDet);

  var settings = {
    url: host + "api_tetapan_picoms/public/generateObe/studentPloClo",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  $.ajax(settings).done(function (response) {
    obj_PloClo = JSON.parse(response);
    returnValue();
  });
}




function getMarkAlloc(id , returnValue) {
  var form = new FormData();
  form.append("fk_gsDet", id);

  var settings = {
    url: host + "api_tetapan_picoms/public/generateObe/studentPloClo",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  $.ajax(settings).done(function (response) {
    obj_PloClo = JSON.parse(response);
    returnValue();
  });
}
//-------------------------------------------------- end mis_exam_student --------------------------------------------------//


function generatePDF(name, idTable) {
  window.jsPDF = window.jspdf.jsPDF; //nie pnting utk call jspdf pnya library
  // Initialize jsPDF
  var doc = new jsPDF();
  doc.text("Reporting " + name + "", 10, 20);

  // Define the source element (your HTML table)
  var source = $('#' + idTable)[0];

  // Define the gap (adjust the value as needed)
  var gap = 30; // Adjust this value to set the desired gap

  // Generate the PDF from the table, starting with a gap
  doc.autoTable({
    html: source,
    startY: gap //nak tmbah gap between atas dia
  });

  // Save or download the PDF
  doc.save('Reporting_' + name + '.pdf');
  // doc.save('Reporting_change_hostel.pdf');
}

function generatePDF2(name, idTable, session, category, cCode, cName) {
  window.jsPDF = window.jspdf.jsPDF; //nie pnting utk call jspdf pnya library
  // Initialize jsPDF
  var doc = new jsPDF();

  let fixtimeDate = (new Date().toLocaleString()).split(', ');
  let fixTD = fixtimeDate[1] + ', ' + fixtimeDate[0];
  
  // horizontol
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");

  doc.text(fixTD, 182, 3); 
  

  doc.text("REPORTING " + name + "", 14, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text('Academic Session           : '+session.toUpperCase(), 14, 30);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text('Category                           : '+category.toUpperCase(), 14, 35);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text('Course                              : '+cCode+' - '+cName.toUpperCase(), 14, 40);

  // Define the source element (your HTML table)
  var source = $('#' + idTable)[0];

  // Define the gap (adjust the value as needed)
  var gap = 45; // Adjust this value to set the desired gap

  // Generate the PDF from the table, starting with a gap
  doc.autoTable({
    html: source,
    startY: gap //nak tmbah gap between atas dia
  });

  // Save or download the PDF
  doc.save('Reporting_' + name + '.pdf');
  // doc.save('Reporting_change_hostel.pdf');
}

function generatePDF3(name, idTable,  location, yearExam) {
  window.jsPDF = window.jspdf.jsPDF; //nie pnting utk call jspdf pnya library
  // Initialize jsPDF
  var doc = new jsPDF('landscape');
  var pageWidth = doc.internal.pageSize.width;

  // Start adding content to the PDF

  let fixtimeDate = (new Date().toLocaleString()).split(', ');
  let fixTD = fixtimeDate[1] + ', ' + fixtimeDate[0];
  
  // landscape
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(fixTD, 268, 3);
  
  
  // Set the font for the entire document to Arial
  doc.setFont('Arial');

  var imgData = "../admin/images/LOGO-UCMI(Landscape).png";

  // Add the image to the PDF
  doc.addImage(imgData, 'JPEG', 110, 10, 69 , 25);
  // doc.addImage(imgData, 'JPEG', 10, 20, 148.5 , 25);

  // doc.text("Reporting " + name + "", 10, 40);

  doc.setFontSize(10);
  // doc.text("ATTANDANCE/TABLE NO. LIST", 10, 40);
  // doc.text("FINAL EXAMINATION SEMESTER II 2022/2023 ACADEMIC SESSION", 10, 45);
  // doc.text("29.08.2023 (TUESDAY) (AM SESSION)", 10, 50);
  // doc.text("VENUE: HALL 8.01, LEVEL 8, CITY CAMPUS, JLN TANGSI", 10, 55);
  var text = "ATTANDANCE/TABLE NO. LIST";
  var textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  var textX = (pageWidth - textWidth) / 2;
  doc.text(text, textX, 40);

  // Repeat the process for other lines of text
  text = "FINAL EXAMINATION ACADEMIC SESSION "+yearExam;
  textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  textX = (pageWidth - textWidth) / 2;
  doc.text(text, textX, 45);

  // text = formatDate1(dateExam);
  // // text = "29.08.2023 (TUESDAY) (AM SESSION)";
  // textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  // textX = (pageWidth - textWidth) / 2;
  // doc.text(text, textX, 50);

  text = 'VENUE: ' + location;
  // text = "VENUE: HALL 8.01, LEVEL 8, CITY CAMPUS, JLN TANGSI";
  textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  textX = (pageWidth - textWidth) / 2;
  doc.text(text, textX, 50);

  // Define the source element (your HTML table)
  var source = $('#' + idTable)[0];

  // Define the gap (adjust the value as needed)
  var gap = 55; // Adjust this value to set the desired gap

  // Generate the PDF from the table, starting with a gap
  // Add styles option to set the font size for the table content
  doc.autoTable({
    html: source,
    startY: gap,
    styles: {
      fontSize: 10, 
      font: 'Arial',// Set the desired font size for the table content
    },
  });

  // Save or download the PDF
  doc.save('Reporting_' + name + '.pdf');
  // doc.save('Reporting_change_hostel.pdf');
}

function generateGradPDF2(name, idTable) {
  $("#loading_modal").modal('show');

  // function generateGradPDF(name, idTable,  location, yearExam) {
  window.jsPDF = window.jspdf.jsPDF; //nie pnting utk call jspdf pnya library
  // Initialize jsPDF
  var doc = new jsPDF('landscape');
  var pageWidth = doc.internal.pageSize.width;

  // Start adding content to the PDF

  let fixtimeDate = (new Date().toLocaleString()).split(', ');
  let fixTD = fixtimeDate[1] + ', ' + fixtimeDate[0];
  
  // landscape
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(fixTD, 268, 3);
  
  
  // Set the font for the entire document to Arial
  doc.setFont('Arial');

  var imgData = "../admin/images/LOGO-UCMI(Landscape).png";

  // Add the image to the PDF
  doc.addImage(imgData, 'JPEG', 110, 10, 69 , 25);
  // doc.addImage(imgData, 'JPEG', 10, 20, 148.5 , 25);

  // doc.text("Reporting " + name + "", 10, 40);

  doc.setFontSize(10);
  // doc.text("ATTANDANCE/TABLE NO. LIST", 10, 40);
  // doc.text("FINAL EXAMINATION SEMESTER II 2022/2023 ACADEMIC SESSION", 10, 45);
  // doc.text("29.08.2023 (TUESDAY) (AM SESSION)", 10, 50);
  // doc.text("VENUE: HALL 8.01, LEVEL 8, CITY CAMPUS, JLN TANGSI", 10, 55);
  var text = "GRADUATION AUDIT";
  var textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  var textX = (pageWidth - textWidth) / 2;
  doc.text(text, textX, 40);

  // Repeat the process for other lines of text
  // text = "FINAL EXAMINATION ACADEMIC SESSION "+yearExam;
  // textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  // textX = (pageWidth - textWidth) / 2;
  // doc.text(text, textX, 45);

  // text = formatDate1(dateExam);
  // // text = "29.08.2023 (TUESDAY) (AM SESSION)";
  // textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  // textX = (pageWidth - textWidth) / 2;
  // doc.text(text, textX, 50);

  // text = 'VENUE: ' + location;
  // // text = "VENUE: HALL 8.01, LEVEL 8, CITY CAMPUS, JLN TANGSI";
  // textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  // textX = (pageWidth - textWidth) / 2;
  // doc.text(text, textX, 50);

  // Define the source element (your HTML table)
  var source = $('#' + idTable)[0];

  // Define the gap (adjust the value as needed)
  var gap = 45; // Adjust this value to set the desired gap

  // Generate the PDF from the table, starting with a gap
  // Add styles option to set the font size for the table content
  doc.autoTable({
    html: source,
    startY: gap,
    styles: {
      fontSize: 10, 
      font: 'Arial',// Set the desired font size for the table content
    },
  });
  $("#loading_modal").modal('hide');

  // Save or download the PDF
  doc.save('Reporting_' + name + '.pdf');
  // doc.save('Reporting_change_hostel.pdf');
}


function formatDate1(date){
  let newDate = '';
  if(date){
      let arrayDate = date.split("-");
      newDate = arrayDate[2]+'/'+arrayDate[1]+'/'+arrayDate[0];
  }
  else{ newDate = ''; }

  return newDate;
}


// start get student_info get
function det_stdInfo(idstd, returnValue) {
  var settings = {
    "url": host + "api_pengurusan_pelajar/public/pelajar/show/det/" + idstd,
    "method": "GET",
    "timeout": 0,
    "headers": {
        "Authorization": "picoms " + window.sessionStorage.token
    },
};

  $.ajax(settings).done(function (response) {
    obj_getDatastd = response.data;
    returnValue();
  });
}


function slctProg($id, fk_pgm, returnValue) {
  var settings = {
    url:
      host + "api_tetapan_picoms/public/misPrmProgcampus/listByCamAct/" + $id,
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    obj_prog = response;


  $("#pgm_filter").append(
    $('<option value="">- Choose Programme -</option>')
  );
  $.each(obj_prog.data, function (i, item) {

    // console.log(item.pgm_id);
    $("#pgm_filter").append(`<option value="${item.pgm_id}">${item.pgmCode} - ${item.pgm_name} </option>`);
    $('#pgm_filter').val(fk_pgm).trigger('change');

  });

  $("#pgm_filter").select2({
    width: null,
    containerCssClass: ":all:",
  });

    returnValue();

  });
}

function generateGradPDF(name, idTable) {
  
  $("#loading_modal_audit").modal('show');

  setTimeout(() => {
    // function generateGradPDF(name, idTable,  location, yearExam) {
      window.jsPDF = window.jspdf.jsPDF; //nie pnting utk call jspdf pnya library
      // Initialize jsPDF
      var doc = new jsPDF('landscape');
      var pageWidth = doc.internal.pageSize.width;
    
      // Start adding content to the PDF
    
      let fixtimeDate = (new Date().toLocaleString()).split(', ');
      let fixTD = fixtimeDate[1] + ', ' + fixtimeDate[0];
      
      // landscape
      doc.setFontSize(7);
      // doc.setFont("helvetica", "normal");
      doc.setFont('helvetica');
    
      doc.text(fixTD, 268, 3);
      
      // Set the font for the entire document to Arial
      // doc.setFont('Arial');
      doc.setFont('helvetica');
    
      var imgData = "../admin/images/LOGO-UCMI(Landscape).png";
    
      // Add the image to the PDF
      doc.addImage(imgData, 'JPEG', 110, 10, 69 , 25);
    
      doc.setFontSize(10);
      var text = "GRADUATION AUDIT";
      var textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      var textX = (pageWidth - textWidth) / 2;
      doc.text(text, textX, 40);
    
      // Define the source element (your HTML table)
      var source = $('#' + idTable)[0];
    
      // Define the gap (adjust the value as needed)
      var gap = 45; // Adjust this value to set the desired gap
    
      // Generate the PDF from the table, starting with a gap
      // Add styles option to set the font size for the table content
      doc.autoTable({
        html: source,
        startY: gap,
        styles: {
          fontSize: 10, 
          font: 'helvetica',// Set the desired font size for the table content
        },
      });
      
    
      // Save or download the PDF
      doc.save('Reporting_' + name + '.pdf');
      // $("#loading_modal").modal('hide');
      // console.log('Hiding modal...');
    $("#loading_modal_audit").modal('hide');
  }, 1);
  
}


//-------------------------------------------------- end student_info get --------------------------------------------------//

function timeStampPdf(doc) {
  const now = new Date();
  const options = { timeZone: 'Asia/Kuala_Lumpur', year: 'numeric', month: '2-digit', day: '2-digit' };
  const formatter = new Intl.DateTimeFormat('en-GB', options);
  const [{ value: day },, { value: month },, { value: year }] = formatter.formatToParts(now);
  const formattedDate = `${day}/${month}/${year}`;

  const text = `Date Generated: ${formattedDate}`;
  var pageWidth = doc.internal.pageSize.getWidth();
  var textWidth = doc.getTextWidth(text);
  var xPosition = pageWidth - textWidth + 19; // Subtract 10 for some right padding
  var yPosition = 10;

  doc.setFontSize(10);
  doc.text(text, xPosition, yPosition);
}