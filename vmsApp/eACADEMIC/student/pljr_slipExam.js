$(function () {
  $.ajaxSetup({
    cache: false,
  });

  $.fn.select2.defaults.set("theme", "bootstrap");

  $("#loading_modal").modal("show");

  let student_id = window.sessionStorage.std_studentid;

  let obj_std = new get(
    host + "api_pengurusan_pelajar/public/misStdInfo/show/" + student_id,
    "picoms " + window.sessionStorage.token
  ).execute();

  let dataStd = obj_std.data;
  let stud_name = dataStd.sti_name;
  let stud_icno = dataStd.sti_icno;
  let stud_cur_intake = dataStd.cur_intake;
  let stud_pgm_name = dataStd.pgm_name;

  // check current semester student
  chkStdCurSem(student_id, stud_name, function () {
    $.each(obj_stdCurSem.data, function (i, item) {

      stud_name1 = stud_name.replace("'", "");


      let boxList =
        '<li class="nav-item " id="navLectData">' +
        '<a href="#" class="nav-link auto info">' +
        '<span class="pull-right text-muted m-r-xs">' +
        '<i class="fa fa-plus inline"></i>' +
        '<i class="fa fa-minus none"></i>' +
        "</span>" +
        "" +
        item.cur_year.replace("/", "") + "/" + item.cal_cohort + "</a>" + '<ul class="nav nav-sub text-sm" style="overflow: scroll; overflow-x: hidden;">'

        +
        '<div class="row m-a-2">' +
        '<textarea class="hidden" id="dataList_' +
        item.fk_acaCal +
        '"></textarea>'
        +
        // '<button class="btn green-200 m-a btn_summary m-t" onclick="viewExamSlip(\'' + student_id + "','" + stud_name1 + "','" + item.fk_acaCal + "','" + item.cur_year + "','" + item.cal_cohort + "','" + stud_icno + "','" + stud_cur_intake + "','" + stud_pgm_name + '\',)"' + '><i class="fa fa-calendar"></i> Final Examination Slip</button>'
     '<button class="btn green-200 m-a btn_summary m-t" onclick="viewExamSlip(\'' 
    + student_id 
    + '\', \'' 
    + stud_name1.replace(/'/g, "\\'") 
    + '\', \'' 
    + item.fk_acaCal 
    + '\', \'' 
    + item.cur_year 
    + '\', \'' 
    + item.cal_cohort 
    + '\', \'' 
    + stud_icno 
    + '\', \'' 
    + stud_cur_intake 
    + '\', \'' 
    + stud_pgm_name.replace(/'/g, "\\'") 
    + '\')">' 
+ '<i class="fa fa-calendar"></i> Final Examination Slip</button>'
        +
        '<table id="crList_' +
        item.fk_acaCal +
        '" class="table table-striped"></table>' +
        "</div>" +
        "</ul>" +
        "</li>";
      $("#divListSem").append(boxList);

      // list Course register
      listByActPolicy(student_id, item.fk_acaCal, function () {
        var columns = [
          { name: "bil", title: "No." },
          { name: "cur_year", title: "Academic Session" },
          { name: "crs_code", title: "Course Code" },
          { name: "app_type", title: "Exam Type" },
          { name: "paper_type", title: "Paper Type" },
          { name: "date", title: "Date" },
          { name: "time", title: "Time" },
          { name: "venue", title: "Venue" },
          { name: "seatnum", title: "Seat Number" },
          { name: "status", title: "Status" },

        ];

        let bil = 1;
        var list = [];
        let convertList = JSON.stringify(obj_regCrs.data);
        $("#dataList_" + item.fk_acaCal).val(convertList);

        $.each(obj_regCrs.data, function (j, itemJ) {
          let acaSession = itemJ.cur_year;
          let acaCal = acaSession.replace("/", "") + "/" + itemJ.cal_cohort;
          let Duduk = '';


          if (itemJ.barr_status != null && itemJ.barr_status != "") {
            statusexam = '<span style="color: red; font-weight: bold;">' + itemJ.barr_status + '</span>';
            Duduk = '';

          } else {
            statusexam = '<span style="color: green; font-weight: bold;">' + itemJ.rsb_status + '</span>';
            Duduk = itemJ.est_tableno;

          }

          //   if (itemJ.exam_type != null && itemJ.exam_type != "") {
          //     exam_type = '<span style="color: red; font-weight: bold;">' + itemJ.exam_type + '</span>';
          //  } else {
          //   exam_type = '';
          //  }
          // alert(item.fk_course);
          list.push({
            bil: bil++,
            cur_year: acaCal,
            crs_code:
              '<span class="text-uppercase">' +
              itemJ.crs_code +
              " - " +
              itemJ.crs_name +
              "</span>",
            app_type: itemJ.exam_type,
            paper_type: itemJ.paper_type,
            date: formatDate1(itemJ.tbl_date_start),
            time:
              '<span >' +
              formatTime(itemJ.tbl_time_start) +
              " - " +
              formatTime(itemJ.tbl_time_end) +
              "</span>",
            venue: itemJ.cen_id,
            seatnum: Duduk,
            status: statusexam,

          });
        });
        $("#crList_" + item.fk_acaCal).html('');
        $("#crList_" + item.fk_acaCal).footable({
          columns: columns,
          rows: list,
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
    });
  });
});
var confirmed = false;


$("#printTimeTableExam").on("click", function (e) {
  window.open("print_timetblExam.html");
});


function student_info(id, returnValue) {
  var settings = {
    url:
      host +
      "api_pengurusan_pelajar/public/misStdInfo/show/" +
      window.sessionStorage.std_studentid,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_std = response;
    returnValue();
  });
}


function chkStdCurSem(id, stud_name, returnValue) {
  var settings = {
    url: host + "api_pengurusan_pelajar/public/curAcademic/chkStdCurSem/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_stdCurSem = response;
    returnValue();
  });
}

function listByActPolicy(std, acaCal, returnValue) {


  var form = new FormData();
  form.append("std_studentid", std);
  form.append("fk_acaCal", acaCal);

  var settings = {
    url: host + "api_pengurusan_pelajar/public/misStdSlipExam/listBySession",
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
    obj_regCrs = JSON.parse(response);
    returnValue();
  });
}


function StudentTimetable(studID, aca_session, returnValue) {

  var form = new FormData();
  form.append("studID", studID);
  form.append("aca_session", aca_session);

  var settings = {
    url: host + "api_timetbl_picoms/public/misTimetblDet/StudTimetable2",
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



function viewExamSlip(studID, studname, acaCal, cur_year, cal_cohort, stud_icno, stud_cur_intake, stud_pgm_name) {

  studentdet = studID + ' - ' + studname;
  sessiondet = cur_year + ' - ' + cal_cohort
  // $("#studID").html(studentdet);
  $("#studname").html(studname);
  $("#studid").html(studID);
  $("#cmsession").html(sessiondet);
  $("#studic").html(stud_icno);
  $("#studprog").html(stud_pgm_name);
  $("#studintake").html(stud_cur_intake);

  ////
  listPrintExam = [];

  listPrintExam.push({

    studname: studname,
    studId: studID,
    acaCal: acaCal,
    cal_cohort: cal_cohort,
    cur_year: cur_year,
    stud_icno: stud_icno,
    stud_pgm_name: stud_pgm_name,
    stud_cur_intake: stud_cur_intake,

  });

  checkingCTENull = 0;
  checkingCTE = 0;
  window.sessionStorage.listExamSlip = JSON.stringify(listPrintExam);
  listCTEBySession(studID, acaCal, function () {



    $.each(objDataCECT, function (i, field) {
console.log(field);

if (field.rsb_status != 'Drop' && field.rsb_type != 'CT' && field.rsb_type != 'CE') {
  checkingCTENull = (field.pk_cte_feedback == null) ? (checkingCTENull + 1) : checkingCTENull;
  // checkingCTE = (field.pk_cte_feedback !=null) ? (checkingCTE+1) : checkingCTE;

}





    });


    if (checkingCTENull > 0) {

      swal({
        type: 'warning',
        title: "Course Teaching Evaluation (CTE) Is Not Completed!",
        text: "Click 'Continue' to complete CTE",

        showCancelButton: true,
        confirmButtonText: 'Continue',
        cancelButtonText: 'Back',
        showDenyButton: true,
        // denyButtonText: 'Cancel',
        confirmButtonClass: 'order-2',
        cancelButtonClass: 'order-1 right-gap',
        denyButtonClass: 'order-3',
        buttonsStyling: true
      }).then(function (result) {
        if (result) {
          // Handle the Yes button action here
          // alert('User clicked Yes');
          console.log("User clicked Yes.");

          window.sessionStorage.prevPage = "navLectData" + acaCal;

          window.sessionStorage.content = "pljr_courseList";
          $('#content').load('pljr_courseList.html');
        } else if (result.dismiss === 'cancel') {
          // Handle the No button action here
          alert('User clicked No');
          console.log("User clicked No.");
        } else if (result.dismiss === 'deny') {
          // Handle the Cancel button action here
          alert('User clicked Cancel');
          console.log("User clicked Cancel.");
        }
      }).catch(function (error) {
        // Handle dismissals and errors
        console.log('Dialog dismissed: ' + error);
      });

    } else {


      listByActPolicy(studID, acaCal, function () {

        var columns = [
          { name: "bil", title: "No." },
          { name: "cur_year", title: "Academic Session" },
          { name: "crs_code", title: "Course Code" },
          { name: "examType", title: "Exam Type" },
          { name: "paper_type", title: "Paper Type" },
          { name: "date", title: "Date" },
          { name: "time", title: "Time" },
          { name: "venue", title: "Venue" },
          { name: "seatnum", title: "Seat Number" },
          { name: "status", title: "Status" },

        ];

        let bil = 1;
        var list = [];
        let convertList = JSON.stringify(obj_regCrs.data);
        $("#dataList_" + acaCal).val(convertList);



        $.each(obj_regCrs.data, function (j, itemJ) {

          let acaSession = itemJ.cur_year;
          let acaCal = acaSession.replace("/", "") + "/" + itemJ.cal_cohort;
          let tempatDuduk = '';


          // if (itemJ.barr_status != null || itemJ.barr_status == ""){
          if (itemJ.barr_status === 'Barred') {
            // statusexam = itemJ.rsb_status;
            statusexam = '<span style="color: red; font-weight: bold;">' + itemJ.barr_status + '</span>'
            tempatDuduk = '';

          }
          else {
            statusexam = '<span style="color: green; font-weight: bold;">' + itemJ.rsb_status + '</span>'
            tempatDuduk = itemJ.est_tableno;

          }

          list.push({
            bil: bil++,
            cur_year: acaCal,
            crs_code:
              '<span class="text-uppercase">' +
              itemJ.crs_code +
              " - " +
              itemJ.crs_name +
              "</span>",
            paper_type: itemJ.paper_type,
            date: formatDate1(itemJ.tbl_date_start),
            time:
              '<span >' +
              formatTime(itemJ.tbl_time_start) + " - " + formatTime(itemJ.tbl_time_end) +
              "</span>",
            venue: itemJ.cen_id,
            seatnum: tempatDuduk,
            status: statusexam,
            examType: itemJ.exam_type,

          });
        });

        $("#tblCMark").html('');
        $("#tblCMark").footable({
          columns: columns,
          rows: list,
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
        $("#StudTviewExamSlip").modal("show");
      });
    }

  })

}




function listCTEBySession(stdID, acaSession, returnValue) {

  let form_listCTEBySession = new FormData();
  form_listCTEBySession.append("std_studentid", stdID);
  form_listCTEBySession.append("aca_session", acaSession);

  obj_listCTEBySession = new post(host + 'api_pengurusan_pelajar/public/misStdRegsub/cteListByCourseAcacal', form_listCTEBySession, 'picoms ' + window.sessionStorage.token).execute();
  if (obj_listCTEBySession.success) {

    objDataCECT = obj_listCTEBySession.data;

    returnValue();



  } else {

  }

}