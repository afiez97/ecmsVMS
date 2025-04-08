var soalanAnalysis = '';

// display detail teaching time
function detLectTeachTime(lectId) {
  showTeachTime(lectId, function () {
    if (obj_teachTime.success) {
      let data = obj_teachTime.data;
      $("#lecTeachTimeId").val(data.pk_id);
      $("#tme_min").val(data.tme_min);
      $("#tme_max").val(data.tme_max);

      if (data.tme_mon == "Y") {
        $("#tme_mon").prop("checked", true);
      } else {
        $("#tme_mon").prop("checked", false);
      }

      if (data.tme_tue == "Y") {
        $("#tme_tue").prop("checked", true);
      } else {
        $("#tme_tue").prop("checked", false);
      }

      if (data.tme_wed == "Y") {
        $("#tme_wed").prop("checked", true);
      } else {
        $("#tme_wed").prop("checked", false);
      }

      if (data.tme_thu == "Y") {
        $("#tme_thu").prop("checked", true);
      } else {
        $("#tme_thu").prop("checked", false);
      }

      if (data.tme_fri == "Y") {
        $("#tme_fri").prop("checked", true);
      } else {
        $("#tme_fri").prop("checked", false);
      }
    }
  });
}

var confirmed = false;
//-------------------------------------------------- btn save lecturer teaching time --------------------------------------------------//
$("#formTeachTime").on("submit", function (e) {
  if (!confirmed) {
    e.preventDefault();
    swal({
      title: "Save Teaching Time",
      text: "Are You Sure?",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Save",
      confirmButtonColor: "#2196f3",
      closeOnConfirm: true,
      allowOutsideClick: false,
      html: false,
    }).then(function () {
      let pk_id = $("#lecTeachTimeId").val();
      let empId = $("#add_empId").val();
      let recordstatus = "";
      let type = "";

      if (pk_id == "") {
        recordstatus = "ADD";
        type = "register";
      } else {
        recordstatus = "EDT";
        type = "update";
      }

      let tme_min = $("#tme_min").val();
      let tme_max = $("#tme_max").val();
      let tme_mon = null;
      if ($("#tme_mon").prop("checked")) {
        tme_mon = "Y";
      } else {
        tme_mon = "N";
      }

      let tme_tue = null;
      if ($("#tme_tue").prop("checked")) {
        tme_tue = "Y";
      } else {
        tme_tue = "N";
      }

      let tme_wed = null;
      if ($("#tme_wed").prop("checked")) {
        tme_wed = "Y";
      } else {
        tme_wed = "N";
      }

      let tme_thu = null;
      if ($("#tme_thu").prop("checked")) {
        tme_thu = "Y";
      } else {
        tme_thu = "N";
      }

      let tme_fri = null;
      if ($("#tme_fri").prop("checked")) {
        tme_fri = "Y";
      } else {
        tme_fri = "N";
      }

      var form = new FormData();
      if (pk_id == "") {
        form.append("emp_id", empId);
      } else {
        form.append("pk_id", pk_id);
      }

      form.append("tme_min", tme_min);
      form.append("tme_max", tme_max);
      form.append("tme_mon", tme_mon);
      form.append("tme_tue", tme_tue);
      form.append("tme_wed", tme_wed);
      form.append("tme_thu", tme_thu);
      form.append("tme_fri", tme_fri);
      form.append("recordstatus", recordstatus);

      var settings = {
        url: host + "api_lecturer_picoms/public/misLectTeachTime/" + type,
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
        if (result.success) {
          window.location.reload();
        } else {
          swal("Failed", response.message, "error");
        }
      });
    });
  }
});
//-------------------------------------------------- end btn save lecturer teaching time --------------------------------------------------//

function detail(index, prevPage) {
  let data = JSON.parse($("#dataList").val());
  data = data[index];

  window.sessionStorage.lectCrsId = data.lectCrsId;
  window.sessionStorage.pk_crs = data.fk_course;
  window.sessionStorage.prevPage = prevPage;
  window.sessionStorage.fk_cotDet = data.fk_cotDet;
  window.sessionStorage.yearTaken = data.cal_year;
  window.sessionStorage.cal_cohort = data.cal_cohort;
  window.sessionStorage.category = data.category;
  window.sessionStorage.lect_coor = data.coordinator;
  window.sessionStorage.fk_aca_cal = data.aca_session;

  window.location.replace("detLectCourse.html");
}

function studentList(index, prevPage, stsBtn) {
  let data = JSON.parse($("#dataList").val());
  data = data[index];

  window.sessionStorage.lectCrsId = data.lectCrsId;
  window.sessionStorage.pk_crs = data.fk_course;
  window.sessionStorage.fk_cotDet = data.fk_cotDet;
  window.sessionStorage.prevPage = prevPage;
  window.sessionStorage.yearTaken = data.cal_year;
  window.sessionStorage.cal_cohort = data.cal_cohort;
  window.sessionStorage.category = data.category;
  window.sessionStorage.lect_coor = data.coordinator;
  window.sessionStorage.fk_aca_cal = data.aca_session;
  window.sessionStorage.BtnDisabled = stsBtn;
  window.location.replace("detLectCrsStudent.html");
}

function studentListResit(index, prevPage, stsBtn) {
  let data = JSON.parse($("#dataList").val());
  data = data[index];

  window.sessionStorage.lectCrsId = data.lectCrsId;
  window.sessionStorage.pk_crs = data.fk_course;
  window.sessionStorage.fk_cotDet = data.fk_cotDet;
  window.sessionStorage.prevPage = prevPage;
  window.sessionStorage.yearTaken = data.cal_year;
  window.sessionStorage.cal_cohort = data.cal_cohort;
  window.sessionStorage.category = data.category;
  window.sessionStorage.lect_coor = data.coordinator;
  window.sessionStorage.fk_aca_cal = data.aca_session;
  window.sessionStorage.BtnDisabled = stsBtn;
  window.location.replace("detLectCrsStudentResit.html");
}

// function Timetable
function createTmt(lect, year, sem, prevPage) {
  tmtDetByLectYear(lect, year, sem, function () {
    let columns = [
      { name: "bil", title: "No." },
      { name: "cur_year", title: "Academic Session" },
      { name: "day_time", title: "Day/Time" },
      { name: "course", title: "Course", breakpoints: "md sm xs" },
      { name: "tmt_slot", title: "Slot", breakpoints: "md sm xs" },
      { name: "loc_name", title: "Venue", breakpoints: "md sm xs" },
      { name: "upt_btn", title: "Action", breakpoints: "md sm xs" },
    ];
    let bil = 1;
    let list_data = [];
    let convertList = JSON.stringify(obj_tmtDet.data);
    $("#dataTmtList").val(convertList);

    if (obj_tmtDet.data.length > 0) {
      $("#printTimetbl").prop("disabled", "");
      $.each(obj_tmtDet.data, function (i, field) {
        let calYear = field.cal_year;
        let session = calYear.replace("/", "") + "/" + field.cal_cohort;
        let dayVal = "";
        if (field.tmt_day == "1") {
          dayVal = "MONDAY";
        } else if (field.tmt_day == "2") {
          dayVal = "TUESDAY";
        } else if (field.tmt_day == "3") {
          dayVal = "WEDNESDAY";
        } else if (field.tmt_day == "4") {
          dayVal = "THURSDAY";
        } else if (field.tmt_day == "5") {
          dayVal = "FRIDAY";
        }
        else if (field.tmt_day == "6") {
          dayVal = "SATURDAY";
        }
        else if (field.tmt_day == "7") {
          dayVal = "SUNDAY";
        }
        

        list_data.push({
          bil: bil++,
          cur_year: session,
          day_time:
            "<b>" +
            dayVal +
            "</b><br>" +
            formatTime(field.tmt_starttime) +
            " - " +
            formatTime(field.tmt_endtime),
          course:
            '<span class="text-uppercase"><b>' +
            field.crs_code +
            "</b><br>" +
            field.crs_name +
            "</span>",
          tmt_slot: field.tmt_slot,
          loc_name: field.loc_name,
          upt_btn:
            '<button class="btn btn-icon accent" title="Attendance" onclick="detTmt(\'' +
            i +
            "','" +
            prevPage +
            '\')" id="btnPerincian"><i class="ion-ios-list-outline"></i></button>',
        });
      });
    } else {
      swal("Timetable", "No Data Found!", "warning");
      $("#printTimetbl").prop("disabled", "disabled");
    }

    $("#tblTmtDet").html("");
    $("#tblTmtDet").footable({
      columns: columns,
      rows: list_data,
      paging: {
        enabled: true,
        size: 10,
        countFormat: "Showing {PF} to {PL} of {TR} data",
      },
      filtering: {
        enabled: true,
        placeholder: "Search...",
        dropdownTitle: "Search for:",
      },
    });
  });
}

function detTmt(index, prevPage) {
  let data = JSON.parse($("#dataTmtList").val());
  data = data[index];

  window.sessionStorage.tmtDet_id = data.tmtDet_id;
  window.sessionStorage.prevPage = prevPage;
  window.sessionStorage.yearTmt = data.cal_year;
  window.sessionStorage.semTmt = data.cal_cohort;
  window.location.replace("detLectTimetbl.html");
}

// button print timetable
$("#printTimetbl").click(function () {
  if ($("#tmttbl_year").val() != "" && $("#tmttbl_sem").val() != "") {
    let tmttbl_year = $("#tmttbl_year").val();
    let tmttbl_sem = $("#tmttbl_sem").val();
    window.sessionStorage.tmttbl_year = tmttbl_year;
    window.sessionStorage.tmttbl_sem = tmttbl_sem;
    window.open("print_timetbl.html");
  } else {
    swal("Timetable", "Choose Academic Session", "info");
  }
});

//-------------------------------------------------- table Lect Crs Settings --------------------------------------------------//
function createTblLectCrs(data, prevPage) {
  let columns = [
    { name: "bil", title: "No." },
    { name: "cur_year", title: "Academic Session" },
    { name: "cal_type", title: "Academic Category" },
    { name: "crs_code", title: "Course" },
    { name: "total_std", title: "No. of Student", breakpoints: "md sm xs" },
    { name: "sts_session", title: "Status Session" },
    { name: "upt_btn", title: "Action", breakpoints: "md sm xs" },
  ];
  let bil = 1;
  let list_data = [];
  let convertList = JSON.stringify(data);
  console.log(data);
  $("#dataList").val(convertList);
  btnDisabled = '656e61626c65';
  let cource_code = "";
  
  $.each(data, function (i, field) {
    let calYear = field.cal_year;
    let return_year = (function () {
      var form = new FormData();
      form.append("aca_session", field.aca_session);
      form.append("crs_code", field.fk_course);

      let tmp = {};
      $.ajax({
        url:
          host + "api_pengurusan_pelajar/public/misStdRegsub/sumByAcaCalCrs",
        method: "POST",
        timeout: 0,
        headers: {
          Authorization: "picoms " + window.sessionStorage.token,
        },
        async: false,
        global: false,
        processData: false,
        mimeType: "multipart/form-data",
        contentType: false,
        data: form,
        success: function (data) {
          let getdata = JSON.parse(data);
          tmp = getdata.data;
        },
      });
      return tmp;
    })();
    
    if (return_year.total > 0) {
      // list_data.push({
      //     bil: bil++, cur_year: calYear.replace('/','')+'/'+field.cal_cohort, cal_type: field.category, total_std: return_year.total, crs_code: '<span class="text-uppercase"><b>'+field.crsCode+'</b><br>'+field.crs_name+'</span>',
      //     upt_btn:    '<button class="btn btn-icon accent" title="Details" onclick="detail(\'' +i+ '\',\'' +prevPage+ '\')" id="btnPerincian"><i class="ion-ios-list-outline"></i></button> ' +
      //                 '<button class="btn btn-icon warn" title="Student List" onclick="studentList(\'' +i+ '\',\'' +prevPage+ '\')" id="btnStdList"><i class="ion-ios-people"></i></button> '
      // });
      if (cource_code != field.crsCode+'_'+field.category) {
        if( field.cal_status != "Active" ){ btnDisabled = '64697361626c65' }

        list_data.push({
          bil: bil++,
          cur_year: calYear.replace("/", "") + "/" + field.cal_cohort +" ("+field.cal_status+")",
          cal_type: field.category,
          total_std: return_year.total,
          crs_code:
            '<span class="text-uppercase"><b>' +
            field.crsCode +
            "</b><br>" +
            field.crs_name +
            "</span>",
            sts_session: (field.cal_status).toUpperCase(),
          upt_btn:
            `<button class="btn btn-icon accent" title="Details" onclick="detail('${i}', '${prevPage}' )" id="btnPerincian"><i class="ion-ios-list-outline"></i></button> ` +
            `<button class="btn btn-icon warn" title="Student List" onclick="studentList( '${i}', '${prevPage}', '${btnDisabled}')" id="btnStdList"><i class="ion-ios-people"></i></button> ` +
            `<button class="btn btn-icon warning" title="Re-sit / Recheck" onclick="studentListResit( '${i}', '${prevPage}', '${btnDisabled}')" id="btnStdList"><i class="ion-android-create"></i></button> `
            
            ,
        });

        cource_code = field.crsCode+'_'+field.category;
      }
    }
  });

  $("#crList").html("");
  $("#crList").footable({
    columns: columns,
    rows: list_data,
    paging: {
      enabled: true,
      size: 10,
      countFormat: "Showing {PF} to {PL} of {TR} data",
    },
    filtering: {
      enabled: true,
      placeholder: "Search...",
      dropdownTitle: "Search for:",
    },
  });
}

function createTblLectCrsCTE(data, prevPage, LectID) {
  let columns = [
    { name: "bil", title: "No." },
    { name: "cur_year", title: "Academic Session" },
    { name: "cal_type", title: "Academic Category" },
    { name: "crs_code", title: "Course" },
    { name: "total_OAss", title: "Total Overall Assessment", breakpoints: "md sm xs" },
    { name: "statusGrd", title: "Status", breakpoints: "md sm xs" },
    { name: "sts_session", title: "Status Session" },
    { name: "upt_btn", title: "Action", breakpoints: "md sm xs" },
  ];
  let bil = 1;
  let list_data = [];
  let convertList = JSON.stringify(data);
  $("#dataList").val(convertList);
  let EmpId = $("#emp_id").html();
  let EmpName = $("#emp_name").html();
  // console.log(EmpId);
  btnDisabled = '656e61626c65';
  let cource_code = "";
  
  $.each(data, function (i, field) {
    let calYear = field.cal_year;
    let return_year = (function () {
      var form = new FormData();
      form.append("aca_session", field.aca_session);
      form.append("crs_code", field.fk_course);
      form.append("emp_id", LectID);

      let tmp = {};
      $.ajax({
        url:
          host + "api_pengurusan_pelajar/public/cte/stdFeedbackLec/totalStudent",
        method: "POST",
        timeout: 0,
        headers: {
          Authorization: "picoms " + window.sessionStorage.token,
        },
        async: false,
        global: false,
        processData: false,
        mimeType: "multipart/form-data",
        contentType: false,
        data: form,
        success: function (data) {
          let getdata = JSON.parse(data);
          tmp = getdata.data;
        },
      });
      return tmp;
    })();
    
    // console.log(return_year.total);
     let overalAverage = '';
     let statusG = '';
     

    if (return_year.total > 0) {

      totalStudent = return_year.total;
      cteDisabled = '';

      let obj = new get(host + "api_pengurusan_pelajar/public/cte/stdFeedbackLec/studentRate/" + LectID +"/" +field.fk_course+"/" +field.aca_session ,'picoms '+window.sessionStorage.token).execute();
      datafeedBackStd = obj.data;
      const groupedFeedback = processFeedback(datafeedBackStd);
      // const averageCal = calculateAverages(groupedFeedback);
      const averageCat = calculateAveragesCat(groupedFeedback);

      const averageOverall = calculateAveragesCatOverall(groupedFeedback);

      overalAverage = averageOverall.toFixed(2);
      // console.log(overalAverage);

      if (overalAverage){
        if (overalAverage > 3.00 && overalAverage <= 4.00) {
          statusG = 'Excellent';
        } else if (overalAverage > 2.00 && overalAverage <= 3.00) {
            statusG = 'Good';
        } else if (overalAverage > 1.00 && overalAverage <= 2.00) {
            statusG = 'Satisfactory';
        } else if (overalAverage >= 0.00 && overalAverage <= 1.00) {
            statusG = 'Less than Satisfactory';
        }
      }
      else{
        statusG = '';
      }



    }
    else{
      totalStudent = 0;
      cteDisabled = 'disabled';


    }
    // if (return_year.total > 0) {
      // console.log(field);
      // list_data.push({
      //     bil: bil++, cur_year: calYear.replace('/','')+'/'+field.cal_cohort, cal_type: field.category, total_std: return_year.total, crs_code: '<span class="text-uppercase"><b>'+field.crsCode+'</b><br>'+field.crs_name+'</span>',
      //     upt_btn:    '<button class="btn btn-icon accent" title="Details" onclick="detail(\'' +i+ '\',\'' +prevPage+ '\')" id="btnPerincian"><i class="ion-ios-list-outline"></i></button> ' +
      //                 '<button class="btn btn-icon warn" title="Student List" onclick="studentList(\'' +i+ '\',\'' +prevPage+ '\')" id="btnStdList"><i class="ion-ios-people"></i></button> '
      // });
      if (cource_code != field.crsCode+'_'+field.category) {
        if( field.cal_status != "Active" ){ btnDisabled = '64697361626c65' }

        sessionData = calYear.replace("/", "") + "/" + field.cal_cohort;
        list_data.push({
          bil: bil++,
          cur_year: calYear.replace("/", "") + "/" + field.cal_cohort +" ("+field.cal_status+")",
          cal_type: field.category,
          total_OAss: overalAverage,
          statusGrd: statusG,
          crs_code:
            '<span class="text-uppercase"><b>' +
            field.crsCode +
            "</b><br>" +
            field.crs_name +
            "</span>",
            sts_session: (field.cal_status).toUpperCase(),
          upt_btn:
            `<button class="btn btn-icon accent" title="CTE" `+cteDisabled+ ` onclick="generatePDFCTE('${EmpId}', '${EmpName}' , '${field.crsCode}' ,'${field.crs_name}' , '${field.fk_cotDet}' , '${sessionData}', '${totalStudent}' )" id="btnPerincian"><i class="ion-ios-list-outline"></i></button> ` 
            // +
            // `<button class="btn btn-icon warn" title="Student List" onclick="studentList( '${i}', '${prevPage}', '${btnDisabled}')" id="btnStdList"><i class="ion-ios-people"></i></button> ` +
            // `<button class="btn btn-icon warning" title="Re-sit / Recheck" onclick="studentListResit( '${i}', '${prevPage}', '${btnDisabled}')" id="btnStdList"><i class="ion-android-create"></i></button> `
            
            ,
        });

        cource_code = field.crsCode+'_'+field.category;
      }
    // }
  });

  $("#crListCTE").html("");
  $("#crListCTE").footable({
    columns: columns,
    rows: list_data,
    paging: {
      enabled: true,
      size: 10,
      countFormat: "Showing {PF} to {PL} of {TR} data",
    },
    filtering: {
      enabled: true,
      placeholder: "Search...",
      dropdownTitle: "Search for:",
    },
  });
}
//-------------------------------------------------- end table Lect Crs Settings --------------------------------------------------//

//-------------------------------------------------- table Exam Timetable --------------------------------------------------//
function createTblExmTmt(data, prevPage) {
  // console.log(data);
  let columns = [
    { name: "bil", title: "No." },
    { name: "cur_year", title: "Academic Session" },
    { name: "cal_type", title: "Type" },
    { name: "crs_code", title: "Course" },
    { name: "exam_status", title: "Exam Type" },
    { name: "position", title: "Position" },
    { name: "dateTime", title: "Date/Time", breakpoints: "md sm xs" },
    { name: "exmVenue", title: "Venue", breakpoints: "md sm xs" },
    { name: "total_std", title: "No. of Student", breakpoints: "md sm xs" },
    { name: "upt_btn", title: "Action", breakpoints: "md sm xs" },
  ];
  let bil = 1;
  let list_data = [];
  let convertList = JSON.stringify(data);
  $("#dataExmTmtList").val(convertList);

  $.each(data, function (i, field) {

    let chiefStatus = field.chief;
    if(chiefStatus == 'No'){
      chiefPosition = 'INVIGILATOR';
    }
    else{
      chiefPosition = 'CHIEF INVIGILATOR';
    }
    let calYear = field.cal_year;
    let return_total = (function () {
      var form = new FormData();
      form.append("fk_exam", field.fk_exmTimetbl);
      form.append("fk_venue", field.fk_venue);

      let tmp = {};
      $.ajax({
        url: host + "api_exam_picoms/public/misExamStd/listByExamVenue",
        method: "POST",
        timeout: 0,
        headers: {
          Authorization: "picoms " + window.sessionStorage.token,
        },
        async: false,
        global: false,
        processData: false,
        mimeType: "multipart/form-data",
        contentType: false,
        data: form,
        success: function (dtStd) {
          let getdata = JSON.parse(dtStd);
          tmp.total = getdata.data.length;
        },
      });
      return tmp;
    })();

    if (return_total.total >= 0) {

      if (return_total.total > 0) {
         btnStudent = '<button class="btn btn-icon warn" title="Student List" onclick="stdExam(\'' + i + "','" +   prevPage +  '\')" id="btnStdList"><i class="ion-ios-people"></i></button>';
      }
      else {
         btnStudent = '<button class="btn btn-icon warn" title="Student Table Number Is Not Generated" onclick="stdExam(\'' + i + "','" +   prevPage +  '\')" id="btnStdList" disabled><i class="ion-ios-people"></i></button>';
      }

      list_data.push({
        bil: bil++,
        cur_year: calYear.replace("/", "") + "/" + field.cal_cohort,
        cal_type: field.category,
        total_std: return_total.total,
        crs_code:
          '<span class="text-uppercase"><b>' +
          field.crs_code +
          "</b><br>" +
          field.crs_name +
          "</span>",
        dateTime:
          '<span class="font-weight-bold">' +
          formatDate(field.tbl_date_start) +
          "</span><br>" +
          formatTime(field.tbl_time_start) +
          " - " +
          formatTime(field.tbl_time_end),
        exmVenue:
          '<span class="font-weight-bold">' +
          field.clg_name +
          "</span><br>" +
          field.cen_id,
        upt_btn:  btnStudent,
        exam_status:  field.exam_type,
        position:  chiefPosition,
      });
    }
  });

  $("#tblExmTmt").html("");
  $("#tblExmTmt").footable({
    columns: columns,
    rows: list_data,
    paging: {
      enabled: true,
      size: 10,
      countFormat: "Showing {PF} to {PL} of {TR} data",
    },
    filtering: {
      enabled: true,
      placeholder: "Search...",
      dropdownTitle: "Search for:",
    },
  });
}
//-------------------------------------------------- end table Exam Timetable --------------------------------------------------//

function stdExam(index, prevPage) {
  let data = JSON.parse($("#dataExmTmtList").val());
  data = data[index];

  window.sessionStorage.exmInvgltr_id = data.exmInvgltr_id;
  window.sessionStorage.fk_exmTimetbl = data.fk_exmTimetbl;
  window.sessionStorage.prevPage = prevPage;
  window.sessionStorage.yearExmTmt = data.cal_year;
  window.sessionStorage.semExmTmt = data.cal_cohort;
  window.location.replace("detLectExmAtd.html");
}

function showTeachTime(id, returnValue) {
  var settings = {
    url: host + "api_lecturer_picoms/public/misLectTeachTime/show/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_teachTime = response;
    returnValue();
  });
}

function listYear(returnValue) {
  var settings = {
    url: host + "api_pengurusan_pelajar/public/misStdRegsub/listYear",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_regCrs = response;
    returnValue();
  });
}

function lectGrpByCourse(id, returnValue) {
  var settings = {
    url: host + "api_lecturer_picoms/public/misLectCrsPrm/listCourse/" + id,
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

function lectGrpByCourseCTE(id, returnValue) {
  var settings = {
    url: host + "api_lecturer_picoms/public/misLectCrsPrm/listCourse/" + id,
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

function tmtDetByLectYear(lect, year, sem, returnValue) {
  var form = new FormData();
  form.append("fk_lecturer", lect);
  form.append("cur_year", year);
  form.append("cal_cohort", sem);

  var settings = {
    url: host + "api_timetbl_picoms/public/misTimetblDet/listByLectYear",
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
    obj_tmtDet = JSON.parse(response);
    returnValue();
  });
}

function generatePDFCTE(LecId, name, courseCode, courseName, cotDet, sessionData, tStudent) {

let obj = new get(host + "api_pengurusan_pelajar/public/cte/stdFeedbackLec/view/" + LecId +"/" +cotDet ,'picoms '+window.sessionStorage.token).execute();
  // let obj = new get(host + "api_pengurusan_pelajar/public/cte/stdFeedbackLec/view/AK0937/9244", 'picoms ' + window.sessionStorage.token).execute();

  if (obj.success) {


      var columns = [{
              "name": "bil",
              "title": "Bil.",
          },
          {
              "name": "question",
              "title": "Question",
              "style": "text-align:center;"
          },
          {
              "name": "average",
              "title": "Average",
              "style": "text-align:center;"
          },
      ];

      
      var columnsAnalysis = [
          {
            "name": "bil",
            "title": "Bil.",
          },
          {
              "name": "question",
              "title": "Question",
              "style": "text-align:center;"
          },
          {
              "name": "total1",
              "title": "1",
              "style": "text-align:center;"
          },
          {
            "name": "total2",
            "title": "2",
            "style": "text-align:center;"
        },
        {
              "name": "total3",
              "title": "3",
              "style": "text-align:center;"
          },
          {
            "name": "total4",
            "title": "4",
            "style": "text-align:center;"
        },
        {
          "name": "totaCount",
          "title": "No Of Students",
          "style": "text-align:center;"
      },
      ];

      var columnsStatus = [
          
          {
              "name": "status",
              "title": "Status",
          },
          {
              "name": "grade",
              "title": "Grade",
          }
      ];

      var listStatus = [
      {
          status: "Excellent",
          grade: "3.01 - 4.00"
      },
      {
          status: "Good",
          grade: "2.01 - 3.00"
      },
      {
          status: "Satisfactory",
          grade: "1.01 - 2.00"
      },
      {
          status: "Less than Satisfactory",
          grade: "0.00 - 1.00"
      }
      ];

      $("#tableStatus").footable({
        columns: columnsStatus,
        rows: listStatus,
        paging: {
            enabled: false,
            //   size: 10,
        },

      });


     

      let bil = 1;
      let tAvg = 0;
      let nombor = 1;
      let nomborAnalysis = 1;
      let totalNombor = 0;
      let convertList = JSON.stringify(obj.data);
      $("#dataList").val(convertList);
      var list = [];
      var listAnalysis = [];
      soalanAnalysis = JSON.parse(obj.dataSoalan.soalan);
      // console.log(soalanAnalysis);

      datafeedBackStd = obj.data;

      const groupedFeedback = processFeedback(datafeedBackStd);

      const averageCal = calculateAverages(groupedFeedback);

      //Data Bar Chart
      const averageCat = calculateAveragesCat(groupedFeedback);
      var dataChart = calculateAveragesCat(groupedFeedback);
      // console.log(averageCat);
      const aggregatedData = processDataGroup(groupedFeedback);

      // const averageOverall = calculateAveragesCatOverall(groupedFeedback);
      
      // console.log(aggregatedData);
      // console.log(averageCat);

      // console.log(averageCat[0].section);
      // console.log(averageCat[0].average);


      $.each(soalanAnalysis, function(i, field) {

        // console.log(i);
        // console.log(field.Senarai_soalan);

        const resultSection = averageCat.find(hehe => hehe.section === i);

        // console.log(resultSection);
        
        if (resultSection && resultSection.average) {
          dAverage = resultSection.average;
          dataAverage = dAverage.toFixed(2);
        } else {
          dataAverage = '';
        }
        
        // console.log(dataAverage);
          sectionUnder = i.replace(' ', '_');
          

          if (resultSection !== undefined && resultSection !== null){
              list.push({
                bil: i,
                question: field.sectionDetail.BI,
                average: '',
                // cur_intake: field.cur_intake,

              });

              listAnalysis.push({
                bil: i,
                // bil: bil + '.' + nomborAnalysis++,
                question: field.sectionDetail.BI,
                total1: '' ,
                total2: '',
                total3: '',
                total4: '',
                totaCount: '',
              });


          }
          

          

          nomborAnalysis++,

          $.each(field.Senarai_soalan, function(i2, field_2) {


              let averageQues = averageCal[field_2.number] * 1;
              let averageCategory = averageCat[field_2.number] * 1;

              // console.log(averageCategory);

              
              let analysis = aggregatedData[field_2.number] * 1;
              const result = aggregatedData.find(item => item.question_number === field_2.number);
              // console.log(result);
              stup = result ? result : '';
              // console.log(result);

              // tAvg = tAvg+averageQues;
              if (averageQues) {
                  tAvg += averageQues;
                  totalNombor++;
              }

              finalAve = averageQues ? averageQues.toFixed(2) : '';
              list.push({
                  bil: bil + '.' + nombor++,
                  question: field_2.BI,
                  average: finalAve,

              });

              listAnalysis.push({
                bil: bil + '.' + nomborAnalysis++,
                question: field_2.BI,
                total1: stup ? stup["1"] : '' ,
                total2: stup ? stup["2"] : '' ,
                total3: stup ? stup["3"] : '' ,
                total4: stup ? stup["4"] : '' ,
                totaCount: stup ? stup.total_count : '',

            });
          })



          if (resultSection !== undefined && resultSection !== null){

            list.push({
              bil: '',
              question: 'AVERAGE POINTS',
              average: dataAverage,
              // cur_intake: field.cur_intake,

          });
        }
          // console.log(listAnalysis);

          bil++;
      });


      list.push({
          bil: '',
          question: 'Total Average Points',
          average: (tAvg / totalNombor).toFixed(2),
          // cur_intake: field.cur_intake,

      });
      
      var statusData = (tAvg / totalNombor).toFixed(2);

      $("#reportCTE").footable({
          columns: columns,
          rows: list,
          paging: {
              enabled: false,
              //   size: 10,
          },

      });

      $("#reportCTEAnalysis").footable({
        columns: columnsAnalysis,
        rows: listAnalysis,
        paging: {
            enabled: false,
            //   size: 10,
        },

      });

  }

  window.jsPDF = window.jspdf.jsPDF; //nie pnting utk call jspdf pnya library
  var doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
  });

  var a4Width = 210;
  timeStampPdf(doc);


  // Image dimensions
  var originalWidth = 275.59; // Replace with the actual width of your image
  var originalHeight = 67.818; // Replace with the actual height of your image

  // Calculate the new width and height (60% of A4 width while maintaining aspect ratio)
  var newWidth = 0.6 * a4Width;
  var newHeight = (newWidth / originalWidth) * originalHeight;

  // Calculate the X-coordinate to center the image on the A4 page
  var xCoordinate = (a4Width - newWidth) / 2;

  // Add the image to the document with the calculated width, height, and centered position
  doc.addImage("images/logo_reporting.png", "JPEG", xCoordinate, 10, newWidth, newHeight);

  doc.setFont("helvetica", "bold");
  var textCenterX = doc.internal.pageSize.width / 2;
  doc.setFontSize(14); // Set the font size to 10
  doc.text('VARIABLE MOVE SOLUTION (VMS)', textCenterX, 50, {
      align: "center"
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14); // Set the font size to 8
  var textCenterX = doc.internal.pageSize.width / 2;
  doc.text('COURSE TEACHING EVALUATION REPORT ' +sessionData, textCenterX, 55, {
      align: "center"
  });

  doc.text('ACADEMIC SESSION '+sessionData, textCenterX, 60, {
    align: "center"
  });

  const text = "LECTURER: " + name;
  doc.setFontSize(11);
  // Set the font type for the text
  doc.setFont("helvetica", "bold");
  const textWidth = doc.getTextWidth(text);
  // Set the position for the text
  const textX = 15; // X position
  const textY = 68; // Y position

  doc.text(text, textX, textY);

  

  const text1 = "SUBJECT CODE: " + courseCode + ' ' + courseName;
  doc.setFontSize(11);
  // Set the font type for the text
  doc.setFont("helvetica", "bold");
  const textWidth1 = doc.getTextWidth(text1);
  // Set the position for the text
  const textX1 = 15; // X position
  const textY1 = 73; // Y position

  doc.text(text1, textX1, textY1);

  const textTotal = "TOTAL PARTICIPANT: " + tStudent;
  doc.setFontSize(11);
  // Set the font type for the text
  doc.setFont("helvetica", "bold");
  // Set the position for the text
  const textXT = 15; // X position
  const textYT = 78; // Y position

  doc.text(textTotal, textXT, textYT);

  // Define the source element (your HTML table)
  var source = $('#reportCTE')[0];

  // Generate the PDF from the table, starting below the text
  doc.autoTable({
    html: source,
    startY: 83, // Adjusted start position below the text
    margin: {
        top: 20
    },
    theme: 'grid',
    styles: {
        fillColor: false,
        textColor: 0,
        fontSize: 8
    },
    headerStyles: {
        fillColor: '#9c4298',
        textColor: 255,
        fontSize: 10
    },
    didDrawPage: function (data) {
        // Save the final y-coordinate after the first table is drawn
        finalY = data.cursor.y;
    }
});


  var source2 = $('#tableStatus')[0];

// Generate the PDF from the second table, starting right after the first table
  doc.autoTable({
    html: source2,
    startY: finalY + 10, // Adjusted start position to be below the first table
    margin: {
        top: 20
    },
    theme: 'grid',
    styles: {
        fillColor: false,
        textColor: 0,
        fontSize: 8
    },
    headerStyles: {
        fillColor: '#9c4298',
        textColor: 255,
        fontSize: 10
    },
    didDrawPage: function (data2) {
        // Save the final y-coordinate after the second table is drawn
        finalY2 = data2.cursor.y;
    }
  });
  
  DataStatus = statusData; 
  let statusGrade = '';

  if (DataStatus){
    if (DataStatus >= 3.00 && DataStatus <= 4.00) {
      statusGrade = 'Excellent';
    } else if (DataStatus >= 2.00 && DataStatus < 3.00) {
        statusGrade = 'Good';
    } else if (DataStatus >= 1.00 && DataStatus < 2.00) {
        statusGrade = 'Satisfactory';
    } else if (DataStatus >= 0.00 && DataStatus < 1.00) {
        statusGrade = 'Less than Satisfactory';
    }
    
  }
  else{
    statusGrade = '';
  }

  doc.text('AVERAGE OVERALL ASSESSMENT: '+DataStatus+' ('+statusGrade + ')', 15, finalY2 + 10);  
    
  //NEXT PAGE - STATISTIC BY ASSESSEMENT CATEGORY
  doc.addPage("a4", "p");
  // doc.text("CHART", 20, 20);

  // console.log(dataChart);

  // Add the image to the document with the calculated width, height, and centered position
  doc.addImage("images/logo_reporting.png", "JPEG", xCoordinate, 10, newWidth, newHeight);

  doc.setFont("helvetica", "bold");
  var textCenterX = doc.internal.pageSize.width / 2;
  doc.setFontSize(14); // Set the font size to 10
  doc.text('VARIABLE MOVE SOLUTION (VMS)', textCenterX, 50, {
      align: "center"
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14); // Set the font size to 8
  var textCenterX = doc.internal.pageSize.width / 2;
  doc.text('LECTURER ASSESSMENT REPORT SESSION '+sessionData, textCenterX, 58, {
      align: "center"
  });

  const textP23 = "LECTURER: " + name;
  doc.setFontSize(12);
  // Set the font type for the text
  doc.setFont("helvetica", "bold");
  const textP2Width3 = doc.getTextWidth(textP23);
  // Set the position for the text
  const textP2X3 = 15; // X position
  const textP2Y3 = 68; // Y position

  doc.text(textP23, textP2X3, textP2Y3);

  const textC = "STATISTIC BY ASSESSMENT CATEGORY";
  doc.setFontSize(12);
  // Set the font type for the text
  doc.setFont("helvetica", "bold");
  const textWidthC = doc.getTextWidth(textC);
  // Set the position for the text
  const textXC = 15; // X position
  const textYC = 78; // Y position

  doc.text(textC, textXC, textYC);

  const text1Sub = "SUBJECT CODE: " + courseCode + ' ' + courseName;
  doc.setFontSize(11);
  // Set the font type for the text
  doc.setFont("helvetica", "bold");
  const textWidthSub = doc.getTextWidth(text1Sub);
  // Set the position for the text
  const textXSub = 15; // X position
  const textYSub = 83; // Y position

  doc.text(text1Sub, textXSub, textYSub);


  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Chart dimensions and margins
  const chartMargin = 30;
  const chartMarginTop = 90; // Increase this to move the chart lower on the page

  const chartWidth = pageWidth - 2 * chartMargin;
  const chartHeight = (pageHeight / 2)-10;
  const barWidth = 20;
  const barSpacing = 10;
  const maxBarHeight = chartHeight - 40;

  // Calculate maximum value for scaling
  const maxAverage = Math.max(...dataChart.map(d => d.average));

  // Draw bars
  dataChart.forEach((item, index) => {
    const x = chartMargin + (index * (barWidth + barSpacing));
    const y = chartHeight - ((item.average / maxAverage) * maxBarHeight) + chartMarginTop;
    const height = (item.average / maxAverage) * maxBarHeight;

    // Draw bar
  // doc.setFillColor(0, 102, 204); // RGB color for the bars (Blue)
  doc.setFillColor(156, 66, 152);

    doc.rect(x, y, barWidth, height, 'F');

    // Draw section label
    doc.text(item.section, x + barWidth / 2, chartHeight + chartMarginTop + 10, { align: 'center' });

    // Draw average label
    doc.text(item.average.toFixed(2), x + barWidth / 2, y - 5, { align: 'center' });
  });

  // Draw X-axis label
  doc.text('Sections', pageWidth / 2, chartHeight + chartMarginTop + 20, { align: 'center' });

  // Draw Y-axis label
  doc.text('Average Point', 25, chartMarginTop + chartHeight / 2, {
      angle: 90,
      align: 'center'
  });

  // Draw X-axis line
  doc.line(chartMargin, chartHeight + chartMarginTop, chartWidth + chartMargin, chartHeight + chartMarginTop);

  // Draw Y-axis line
  doc.line(chartMargin, chartMarginTop, chartMargin, chartHeight + chartMarginTop);

  // Add X-axis measurement lines (tick marks)
  const tickSpacing = (chartWidth) / (dataChart.length - 1); // Adjust this based on the number of data points
  for (let i = 0; i < dataChart.length; i++) {
      const xTick = chartMargin + i * tickSpacing;
      doc.line(xTick, chartHeight + chartMarginTop - 5, xTick, chartHeight + chartMarginTop + 5); // Draw tick mark
  }

  //NEXT PAGE - DETAILED EVALUATION ANALYSIS
  doc.addPage("a4", "p");

    // Add the image to the document with the calculated width, height, and centered position
    doc.addImage("images/logo_reporting.png", "JPEG", xCoordinate, 10, newWidth, newHeight);

    doc.setFont("helvetica", "bold");
    var textCenterX = doc.internal.pageSize.width / 2;
    doc.setFontSize(14); // Set the font size to 10
    doc.text('VARIABLE MOVE SOLUTION (VMS)', textCenterX, 50, {
        align: "center"
    });
  
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14); // Set the font size to 8
    var textCenterX = doc.internal.pageSize.width / 2;
    doc.text('COURSE TEACHING EVALUATION REPORT', textCenterX, 55, {
        align: "center"
    });

    doc.text('ACADEMIC SESSION '+sessionData, textCenterX, 60, {
      align: "center"
    });

    const textP2 = "LECTURER: " + name;
    doc.setFontSize(12);
    // Set the font type for the text
    doc.setFont("helvetica", "bold");
    const textP2Width = doc.getTextWidth(textP2);
    // Set the position for the text
    const textP2X = 15; // X position
    const textP2Y = 68; // Y position

    doc.text(textP2, textP2X, textP2Y);

  

    doc.text("DETAILED EVALUATION ANALYSIS", 15, 78);


    const textP2_1 = "SUBJECT CODE: " + courseCode + ' ' + courseName;
    doc.setFontSize(12);
    // Set the font type for the text
    doc.setFont("helvetica", "bold");
    const textP2Width_1 = doc.getTextWidth(text1);
    // Set the position for the text
    const textP2X_1 = 15; // X position
    const textP2Y_1 = 83; // Y position

    doc.text(textP2_1, textP2X_1, textP2Y_1);

    var source2 = $('#reportCTEAnalysis')[0];

    // Generate the PDF from the table, starting below the text
    doc.autoTable({
        html: source2,
        startY: 88, // Adjusted start position below the text
        margin: {
            top: 20
        },
        theme: 'grid',
        styles: {
            fillColor: false,
            textColor: 0,
            fontSize: 8
        },
        headerStyles: {
            fillColor: '#9c4298',
            textColor: 255,
            fontSize: 10
        },
    });









  // Save or download the PDF
  // doc.autoPrint();
  // doc.autoPrint('Reporting_' + name + '.pdf');

  doc.save('Course_Teaching_Evaluation.pdf');
}



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


function processFeedback(feedbackList) {
  const groupedData = {};
  const answerMapping = {
    "strongly_disagree": 1,
    "disagree": 2,
    "agree": 3,
    "strongly_agree": 4
  };
  const resultArray = []; // Define the result array

  // Process feedbackList
  $.each(feedbackList, function(index, feedbackEntry) {
    const feedback = JSON.parse(feedbackEntry.feedback_std);
    $.each(feedback, function(section, questions) {
      if (!groupedData[section]) {
        groupedData[section] = {};
      }
      $.each(questions, function(i, question) {
        const qNumber = question.question_number;
        const answer = answerMapping[question.answer];

        if (!groupedData[section][qNumber]) {
          groupedData[section][qNumber] = {};
        }

        if (answer !== undefined) {  // Exclude 'undefined' answers
          if (!groupedData[section][qNumber][answer]) {
            groupedData[section][qNumber][answer] = 0;
          }
          groupedData[section][qNumber][answer]++;
        }
      });
    });
  });

  // Convert grouped data to result array
  $.each(groupedData, function(section, questions) {
    $.each(questions, function(qNumber, answers) {
      $.each(answers, function(answer, count) {
        resultArray.push({
          section: section,
          question_number: qNumber,
          answer: answer,
          count: count
        });
      });
    });
  });

  return resultArray;
}





// // sni part jwpan stiap student yg da group
// datafeedBackStd = obj.data;

// const groupedFeedback = processFeedback(datafeedBackStd);

//     // Convert groupedFeedback to an array format
//     const resultArray = [];

//     $.each(groupedFeedback, function(section, questions) {
//         $.each(questions, function(qNumber, answers) {
//             $.each(answers, function(answer, count) {
//                 resultArray.push({
//                     section: section,
//                     question_number: qNumber,
//                     answer: answer,
//                     count: count
//                 });
//             });
//         });
//     });

//     // console.log(resultArray);
// // end sni part jwpan stiap student yg da group



function calculateAverages(data) {
    const groupedData = data.reduce((acc, { question_number, answer, count }) => {
        if (!acc[question_number]) {
            acc[question_number] = { total: 0, count: 0 };
        }
        acc[question_number].total += parseInt(answer) * count;
        acc[question_number].count += count;
        return acc;
    }, {});

    const averages = Object.keys(groupedData).reduce((acc, question_number) => {
        const { total, count } = groupedData[question_number];
        acc[question_number] = total / count;
        return acc;
    }, {});

    return averages;
}

// function calculateAveragesCat(data) {
//   const groupedData = data.reduce((acc, { question_number, answer, count }) => {
//       if (!acc[question_number]) {
//           acc[question_number] = { total: 0, count: 0 };
//       }
//       acc[question_number].total += parseInt(answer) * count;
//       acc[question_number].count += count;
//       return acc;
//   }, {});

//   const averages = Object.keys(groupedData).reduce((acc, question_number) => {
//       const { total, count } = groupedData[question_number];
//       acc[question_number] = total / count;
//       return acc;
//   }, {});

//   return averages;
// }

//////////////////

// function calculateAveragesCat(data) {
  function calculateAveragesCat(data) {
    // Group data by section
    const groupedData = data.reduce((acc, { section, question_number, answer, count }) => {
        if (!acc[section]) {
            acc[section] = { total: 0, count: 0 };
        }
        acc[section].total += parseInt(answer) * count;
        acc[section].count += count;
        return acc;
    }, {});
  
    // Calculate averages for each section
    const averages = Object.keys(groupedData).map(section => {
        const { total, count } = groupedData[section];
        return {
            section: section,
            average: total / count
        };
    });
  
    return averages;
  }
  

  function calculateAveragesCatOverall(data) {
    // Initialize variables to track overall totals
    let overallTotal = 0;
    let overallCount = 0;
  
    // Group data by section
    const groupedData = data.reduce((acc, { section, question_number, answer, count }) => {
        if (!acc[section]) {
            acc[section] = { total: 0, count: 0 };
        }
        const numericAnswer = parseInt(answer, 10);
        acc[section].total += numericAnswer * count;
        acc[section].count += count;
      
        // Update overall totals
        overallTotal += numericAnswer * count;
        overallCount += count;
      
        return acc;
    }, {});
  
    // Calculate averages for each section
    const averages = Object.keys(groupedData).map(section => {
        const { total, count } = groupedData[section];
        return {
            section: section,
            average: total / count
        };
    });
  
    // Calculate the overall average
    const overallAverage = overallTotal / overallCount;
  
    // return {
    //     sectionAverages: averages,
    //     overallAverage: overallAverage
    // };
    return overallAverage;
}

// function load_chart_section(){



//       var bidangData = {};
//       var tahapLabels = [];

//       $.each(obj.data, function(i, item) {
//           if (item.det_tahap && item.det_latihan) {
//               if (!bidangData[item.det_latihan]) {
//                   bidangData[item.det_latihan] = {};
//               }
//               bidangData[item.det_latihan][item.det_tahap] = item.jumlah_kursus_hadir;

//               if (tahapLabels.indexOf(item.det_tahap) === -1) {
//                   tahapLabels.push(item.det_tahap);
//               }
//           }
//       });

//       var series = [];
//       var categories = Object.keys(bidangData);
//       var options = {
//           series: name: test,
//           data : data ,
//           chart: {
//               foreColor: '#9ba7b2',
//               type: 'bar',
//               height: 350,
//               stacked: true
//           },
//           colors: ["#673ab7", "#ffc107", "#0d6efd", "#32ab13"],
//           plotOptions: {
//               bar: {
//                   horizontal: true,
//                   columnWidth: '35%',
//                   endingShape: 'rounded'
//               }
//           },
//           dataLabels: {
//               enabled: false
//           },
//           xaxis: {
//               categories: categories
//           },
//           tooltip: {
//               y: {
//                   formatter: function(val) {
//                       return val + " Kursus";
//                   }
//               }
//           },
//           legend: {
//               position: 'top',
//               horizontalAlign: 'left'
//           }
//       };

//       var chart_digital1 = new ApexCharts(document.querySelector("#chart_digital1"), options);
//       chart_digital1.render();
//       return chart_digital1;

// }


// Example usage
// const averages = calculateAveragesBySection(data);
// console.log(averages);

//////////////////////


function processDataGroup(data) {
  // Flatten the data array
  const flattenedData = data.flat();

  // Initialize an object to store the grouped data
  const groupedData = {};

  // Loop through the flattened data array
  flattenedData.forEach(item => {
      const { section, question_number, answer, count } = item;
      
      // Initialize the question key if it doesn't exist
      if (!groupedData[question_number]) {
          groupedData[question_number] = {
              section: section,
              question_number: question_number,
              '1': 0,
              '2': 0,
              '3': 0,
              '4': 0,
              total_count: 0
          };
      }
      
      // Add the count to the appropriate answer column
      groupedData[question_number][answer] += count;
      // Add the count to the total_count
      groupedData[question_number].total_count += count;
  });

  // Convert the groupedData object to an array
  return Object.values(groupedData);
}


