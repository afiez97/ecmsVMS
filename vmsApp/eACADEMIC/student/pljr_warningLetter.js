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

  // check current semester student
  chkStdCurSem(student_id, stud_name, function () {
    $.each(obj_stdCurSem.data, function (i, item) {
      
      let boxList =
        '<li class="nav-item " id="navLectData">' +
        '<a href="#" class="nav-link auto info">' +
        '<span class="pull-right text-muted m-r-xs">' +
        '<i class="fa fa-plus inline"></i>' +
        '<i class="fa fa-minus none"></i>' +
        "</span>" +
        "" +
        item.cur_year.replace("/", "") + "/" + item.cal_cohort +"</a>" +'<ul class="nav nav-sub text-sm" style="overflow: scroll; overflow-x: hidden;">' 
        
        +
        '<div class="row m-a-2">' +
        '<textarea class="hidden" id="dataList_' +
        item.fk_acaCal +
        '"></textarea>' 
        +
        '<table id="crList_' +
        item.fk_acaCal +
        // '" class="table table-striped table-responsive"></table>' +
        '" class="table table-striped table-center"></table>' +
        "</div>" +
        "</ul>" +
        "</li>";
      $("#divListSem").append(boxList);

      SOWL(student_id, item.fk_acaCal,  function () {
        let acaCal = item.fk_acaCal;
        // $("#loading_modal").modal("hide");
        // console.log(obj_studList.success)
        console.log(obj_studSOWL);
        if (obj_studSOWL.success) {
          var columns = [
            { name: "bil", title: "No." },
            { name: "crs_name", title: "Course Code" },
            { name: "fWLetter", title: "1st Warning Letter" },
            { name: "sWLetter", title: "2nd Warning Letter", breakpoints: " sm xs" },
            { name: "tWLetter", title: "3rd Warning Letter", breakpoints: " sm xs" },
          ];
    
          let bil = 1;
          let convertList = JSON.stringify(obj_studSOWL.data);
          var list = [];
          // console.log(obj_studList.data);
          $.each(obj_studSOWL.data, function (i, field) {

            if (field.warningLetter_1 != null && field.warningLetter_1 != '' )
            {
            //  disabledButton1 = '';
             button1 = '<button class="btn danger" onclick="window.open(\'../../api_picoms/api_pengurusan_pelajar/public/warningLetter/' + field.warningLetter_1 + '\', \'_blank\');"><i class="fa fa-file-pdf-o"></i> Warning Letter</button>';
            }
            else{
              button1 = '- None -';
            }

            if (field.warningLetter_2 != null && field.warningLetter_2 != '' )
            {
             button2 = '<button class="btn danger" onclick="window.open(\'../../api_picoms/api_pengurusan_pelajar/public/warningLetter/' + field.warningLetter_2 + '\', \'_blank\');"><i class="fa fa-file-pdf-o"></i> Warning Letter</button>';
            }
            else{
              button2 = '- None -';
            }

            if (field.warningLetter_3 != null && field.warningLetter_3 != '' )
            {
             button3 = '<button class="btn danger" onclick="window.open(\'../../api_picoms/api_pengurusan_pelajar/public/warningLetter/' + field.warningLetter_3 + '\', \'_blank\');"><i class="fa fa-file-pdf-o"></i> Warning Letter</button> ';
            }
            else{
              button3 = '- None -';
            }

            list.push({
              bil: bil++,
              crs_name: "<b>" + field.crs_code + "</b><br>" + field.crs_name,
              fWLetter: "<div style='text-align: center;'>" + button1 + "</div>",
              sWLetter: "<div style='text-align: center;'>" + button2 + "</div>",
              tWLetter: "<div style='text-align: center;'>" + button3 + "</div>",
              
            });
          });
          // $("#SOWL_"+acaCal+"").html("");
          // $("#SOWL_"+acaCal+"").footable({

          $("#crList_" + acaCal).html('');
          $("#crList_" + acaCal).footable({
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
          
          //append sini
          // $("#crList_" + acaCal).find('th:eq(2)').addClass('text-center');
          // $("#crList_" + acaCal).find('th:not(:eq(2)):not(:eq(3))').addClass('custom-class');
          $("#crList_" + acaCal).find('th:not(:first-child)').addClass('text-center');

          $("#loading_modal").modal("hide");
        }
      });
    });
  });
});
var confirmed = false;




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


function SOWL(std_id, acaCal,  returnValue) {
  var form = new FormData();
  form.append("std_id", std_id);
  form.append("acaCal", acaCal);
  let token = window.sessionStorage.token;

  var settings = {
    url: host + "api_pengurusan_pelajar/public/misStdRegsub/warningLetter",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  let request = $.ajax(settings);
  request.done(function (response) {
    obj_studSOWL = JSON.parse(response);
    returnValue();
  });
  request.fail(function () {
    // swal("eror", "", "error");
    // logOut();
    // obj_studSOWL = { succes: false, message: "load data error", data: "" };
  });
}