$(function () {
  $.ajaxSetup({
    cache: false
  });

  let usrId = window.sessionStorage.usrId;
  let idKaunselor = window.sessionStorage.KaunID;
  // var admin = window.sessionStorage.usrCatEadmin;


  //   // Get the button element by its ID
  //   var btnNew = document.getElementById("btnNew");

  // if (admin === "1" || admin === 1) {
  //   btnNew.disabled = false;
  // } 
  // else {
  //     btnNew.disabled = true;
  // }

// if(idKaunselor){

// }
  if (idKaunselor && window.sessionStorage.tempPosition != 'Counselor') {
    $('#KaunselorList').addClass('none');
    listCounTimetbl(idKaunselor, function () {
      // Clear the table content
      $('#tableTimetbl').html('');

      $('#tableTimetbl').append(`
          <div class="row">
            <div class="col-md-1 p-a-0"></div>
            <div class="col-md-2 p-a-0">
              <div class="box">
                <div class="box-header">
                  <h3 class="text-center font-weight-bold">MONDAY</h3>
                </div>
                <div class="box-body light lt">
                  <div class="list-group m-b" id="boxMon"></div>
                </div>
              </div>
            </div>
            <div class="col-md-2 p-a-0">
              <div class="box">
                <div class="box-header">
                  <h3 class="text-center font-weight-bold">TUESDAY</h3>
                </div>
                <div class="box-body light lt">
                  <div class="list-group m-b" id="boxTue"></div>
                </div>
              </div>
            </div>
            <div class="col-md-2 p-a-0">
              <div class="box">
                <div class="box-header">
                  <h3 class="text-center font-weight-bold">WEDNESDAY</h3>
                </div>
                <div class="box-body light lt">
                  <div class="list-group m-b" id="boxWed"></div>
                </div>
              </div>
            </div>
            <div class="col-md-2 p-a-0">
              <div class="box">
                <div class="box-header">
                  <h3 class="text-center font-weight-bold">THURSDAY</h3>
                </div>
                <div class="box-body light lt">
                  <div class="list-group m-b" id="boxThu"></div>
                </div>
              </div>
            </div>
            <div class="col-md-2 p-a-0">
              <div class="box">
                <div class="box-header">
                  <h3 class="text-center font-weight-bold">FRIDAY</h3>
                </div>
                <div class="box-body light lt">
                  <div class="list-group m-b" id="boxFri"></div>
                </div>
              </div>
            </div>
            <div class="col-md-1 p-a-0"></div>
          </div>
        `);

      let data = obj_counTimetbl.data;

      $.each(data, function (i, field) {
        let day = field.counseling_day;
        let id = field.id_timetable;
        let boxBody = '';

        if (day == 'Monday') {
          boxBody = 'boxMon';
        } else if (day == 'Tuesday') {
          boxBody = 'boxTue';
        } else if (day == 'Wednesday') {
          boxBody = 'boxWed';
        } else if (day == 'Thursday') {
          boxBody = 'boxThu';
        } else if (day == 'Friday') {
          boxBody = 'boxFri';
        }

        $('#' + boxBody).append('<a href="#" class="list-group-item" ><span class="pull-right">' +
          '<span id="timetbl' + id + '"></span>' +
          '<i class="ion-ios-grid-view" style="margin-right: 10px;" onclick="loadData(\'' + field.id_timetable + '\')"></i>' +
          '<i class="ion-trash-a" style="color: #ef193c" onclick="delData(\'' + id + '\')"></i>' +
          '</span>' + field.coun_timeslot + '</a>');




        getAppKaun(id, function () {
          let count = obj_coun.data.length;
          if (count != 0) {
            $('#timetbl' + id).html('<b class="label rounded success m-r-1">' + count + '</b>');
          } else {
            $('#timetbl' + id).html('');
          }
        });
      });

    });
  }else if(window.sessionStorage.tempPosition == 'Counselor'){
    listCounTimetbl(idKaunselor, function () {
      // Clear the table content
      $('#tableTimetbl').html('');

      $('#tableTimetbl').append(`
          <div class="row">
            <div class="col-md-1 p-a-0"></div>
            <div class="col-md-2 p-a-0">
              <div class="box">
                <div class="box-header">
                  <h3 class="text-center font-weight-bold">MONDAY</h3>
                </div>
                <div class="box-body light lt">
                  <div class="list-group m-b" id="boxMon"></div>
                </div>
              </div>
            </div>
            <div class="col-md-2 p-a-0">
              <div class="box">
                <div class="box-header">
                  <h3 class="text-center font-weight-bold">TUESDAY</h3>
                </div>
                <div class="box-body light lt">
                  <div class="list-group m-b" id="boxTue"></div>
                </div>
              </div>
            </div>
            <div class="col-md-2 p-a-0">
              <div class="box">
                <div class="box-header">
                  <h3 class="text-center font-weight-bold">WEDNESDAY</h3>
                </div>
                <div class="box-body light lt">
                  <div class="list-group m-b" id="boxWed"></div>
                </div>
              </div>
            </div>
            <div class="col-md-2 p-a-0">
              <div class="box">
                <div class="box-header">
                  <h3 class="text-center font-weight-bold">THURSDAY</h3>
                </div>
                <div class="box-body light lt">
                  <div class="list-group m-b" id="boxThu"></div>
                </div>
              </div>
            </div>
            <div class="col-md-2 p-a-0">
              <div class="box">
                <div class="box-header">
                  <h3 class="text-center font-weight-bold">FRIDAY</h3>
                </div>
                <div class="box-body light lt">
                  <div class="list-group m-b" id="boxFri"></div>
                </div>
              </div>
            </div>
            <div class="col-md-1 p-a-0"></div>
          </div>
        `);

      let data = obj_counTimetbl.data;

      $.each(data, function (i, field) {
        let day = field.counseling_day;
        let id = field.id_timetable;
        let boxBody = '';

        if (day == 'Monday') {
          boxBody = 'boxMon';
        } else if (day == 'Tuesday') {
          boxBody = 'boxTue';
        } else if (day == 'Wednesday') {
          boxBody = 'boxWed';
        } else if (day == 'Thursday') {
          boxBody = 'boxThu';
        } else if (day == 'Friday') {
          boxBody = 'boxFri';
        }

        $('#' + boxBody).append('<a href="#" class="list-group-item" ><span class="pull-right">' +
          '<span id="timetbl' + id + '"></span>' +
          '<i class="ion-ios-grid-view" style="margin-right: 10px;" onclick="loadData(\'' + field.id_timetable + '\')"></i>' +
          '<i class="ion-trash-a" style="color: #ef193c" onclick="delData(\'' + id + '\')"></i>' +
          '</span>' + field.coun_timeslot + '</a>');




        getAppKaun(id, function () {
          let count = obj_coun.data.length;
          if (count != 0) {
            $('#timetbl' + id).html('<b class="label rounded success m-r-1">' + count + '</b>');
          } else {
            $('#timetbl' + id).html('');
          }
        });
      });

    });
  }
  else if(window.sessionStorage.SU == 'Y' || window.sessionStorage.AdminCoun == 'Y'){
    $('#addTimeTable').remove();

  }

  // let id= 10;
  // // Counselor Timetable List
  // listCounTimetbl(id, function(){

  //     let data = obj_counTimetbl.data;
  //     console.log(obj_counTimetbl);
  //     $.each(data, function (i, field){
  //         let day = field.counseling_day;
  //         let id = field.id_timetable;
  //         let boxBody = '';

  //         if( day == 'Monday' ){ boxBody = 'boxMon' }
  //         if( day == 'Tuesday' ){ boxBody = 'boxTue' }
  //         if( day == 'Wednesday' ){ boxBody = 'boxWed' }
  //         if( day == 'Thursday' ){ boxBody = 'boxThu' }
  //         if( day == 'Friday' ){ boxBody = 'boxFri' }

  //         $('#'+boxBody).append('<a href="#" class="list-group-item" onclick="loadData(\'' + field.id_timetable + '\')"><span class="pull-right">'+
  //                                 '<span id="timetbl'+id+'"></span>'+
  //                                 '<i class="ion-trash-a" style="color: #ef193c" onclick="delData(\''+id+'\')"></i>'+
  //                                 '</span>'+field.coun_timeslot+'</a>');

  //         getAppKaun(id, function(){
  //             let count = obj_coun.data.length;
  //             if(count != 0){ $('#timetbl'+id).html('<b class="label rounded success m-r-1">'+count+'</b>') }
  //             else{ $('#timetbl'+id).html('') }
  //         });
  //     });
  // });



  // // check user login == caunselor
  // counselorList(function(){

  //     $.each(obj_counselor.data, function(i, item){
  //         let kaunselor = item.staff_name;
  //         let id = item.kaunselorId
  //         if(kaunselor == usrId){
  //             $('#fk_caunselor').val(id);

  //             // Counselor Timetable List
  //             listCounTimetbl(id, function(){
  //                 let data = obj_counTimetbl.data;

  //                 $.each(data, function (i, field){
  //                     let day = field.counseling_day;
  //                     let id = field.id_timetable;
  //                     let boxBody = '';

  //                     if( day == 'Monday' ){ boxBody = 'boxMon' }
  //                     if( day == 'Tuesday' ){ boxBody = 'boxTue' }
  //                     if( day == 'Wednesday' ){ boxBody = 'boxWed' }
  //                     if( day == 'Thursday' ){ boxBody = 'boxThu' }
  //                     if( day == 'Friday' ){ boxBody = 'boxFri' }

  //                     $('#'+boxBody).append('<a href="#" class="list-group-item" onclick="loadData(\'' + field.id_timetable + '\')"><span class="pull-right">'+
  //                                             '<span id="timetbl'+id+'"></span>'+
  //                                             '<i class="ion-trash-a" style="color: #ef193c" onclick="delData(\''+id+'\')"></i>'+
  //                                             '</span>'+field.coun_timeslot+'</a>');

  //                     getAppKaun(id, function(){
  //                         let count = obj_coun.data.length;
  //                         if(count != 0){ $('#timetbl'+id).html('<b class="label rounded success m-r-1">'+count+'</b>') }
  //                         else{ $('#timetbl'+id).html('') }
  //                     });
  //                 });
  //             });
  //             return false;
  //         }
  //     });
  // });
});
var confirmed = false;


$("p").click(function () {
  $('#optionCoun').val();
});

function clickGenerateTableCoun() {




}
//-------------------------------------------------- add Timetable --------------------------------------------------//
$('#formAddTimetbl').on('submit', function (e) {
  if (!confirmed) {
    e.preventDefault();
    swal({
      title: "Add Timetable",
      text: "Are You Sure?",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Save",
      confirmButtonColor: "#2196f3",
      closeOnConfirm: true,
      allowOutsideClick: false,
      html: false
    }).then(function () {
      let fk_kaunselor = $('#fk_caunselor').val();;
      let counseling_day = $('#counseling_day').val();
      let coun_timeslot = $('#coun_timeslot').val();

      var form = new FormData();
      form.append("fk_kaunselor", window.sessionStorage.KaunID);
      form.append("counseling_day", counseling_day);
      form.append("coun_timeslot", coun_timeslot);
      form.append("recordstatus", 'ADD');

      var settings = {
        "url": host + "api_hep/public/hepcauntimetable/register",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Authorization": "picoms " + window.sessionStorage.token
        },
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
      };

      $.ajax(settings).done(function (response) {
        result = JSON.parse(response);
        if (!result.success) {
          Swal(result.message, result.data, "error");
          return;
        }
        window.location.reload();
      });
    });
  }
});
//-------------------------------------------------- end add Timetable --------------------------------------------------//


//-------------------------------------------------- delete Timetable --------------------------------------------------//
function delData(id) {
  var form = new FormData();
  form.append("recordstatus", 'DEL');
  form.append("id_timetable", id);

  swal({
    title: "Remove Timetable",
    text: "Are You Sure?",
    type: "question",
    showCancelButton: true,
    confirmButtonText: "Remove",
    confirmButtonColor: "#ef193c",
    closeOnConfirm: true,
    allowOutsideClick: false,
    html: false
  }).then(function () {
    var settings = {
      "url": host + "api_hep/public/hepcauntimetable/delete",
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Authorization": "picoms " + window.sessionStorage.token
      },
      "processData": false,
      "mimeType": "multipart/form-data",
      "contentType": false,
      "data": form
    };

    $.ajax(settings).done(function (response) {
      result = JSON.parse(response);
      if (!result.success) {
        Swal(result.message, result.data, "error");
        return;
      }
      window.location.reload();
    });
  });
}
//-------------------------------------------------- delete Timetable --------------------------------------------------//


function loadData(id) {
  // let data = JSON.parse($("#dataList").val());
  // data = data[index];
  // console.log(data);
  let obj = new get(host + "api_hep/public/hepCounselling/listByTimeTable/" + id, 'picoms ' + window.sessionStorage.token).execute();
  if (obj.success) {
    //   Campus
    // Requester
    // Counseling Type
    // Matric No.
    // Student
    // Issue
    // Status
    // Counselor
    // Date/Time
    var colums = [
      { "name": "bil", "title": "Bil." },
      { "name": "counseling_type", "title": "Counseling Type" },
      { "name": "counselling_reason", "title": "Counseling Issue" },
      { "name": "studendDet", "title": "Requester" },
      { "name": "kaunselor", "title": "Counselor" },
      { "name": "counselling_date", "title": "Date", "breakpoints": "md sm xs" },
      // { "name": "counselling_reason", "title": "Counseling Reason" },
      { "name": "counselling_status", "title": "Status" },
      // { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
    ];
    let bil = 1;
    var list = [];
    $.each(obj.data, function (i, field) {
      console.log(field);


      list.push({
        bil: bil++,
        counseling_type: field.counseling_type,
        counseling_type_ori: field.counseling_type_ori,
        studendDet: '<span class="text-uppercase"><b>' + field.sti_name + '</b><br>' + field.stud_id + '</span>',
        kaunselor: field.kaunName,
        counselling_date: formatDate(field.counselling_date),
        counselling_reason: field.det_FK_type,
        counselling_status: field.counselling_status,
      });



    });
    $("#detTimetable").html('');
    $("#detTimetable").footable({
      "columns": colums,
      "rows": list,
      "paging": {
        "enabled": true,
        "size": 10
      },
      "filtering": {
        "enabled": true,
        "placeholder": "Search...",
        "dropdownTitle": "Search for:"
      }
    });





    $('#mdlView').modal('show');

  }
}


function getAppKaun(id, returnValue) {
  var settings = {
    "url": host + "api_hep/public/hepCounselling/findByTime/" + id,
    "method": "GET",
    "timeout": 0,
    "headers": {
      "Authorization": "picoms " + window.sessionStorage.token
    },
  };

  $.ajax(settings).done(function (response) {
    obj_coun = response;
    returnValue();
  });
}

counselorList(function () {
  $('#optionCoun').append('<option value="">- Choose -</option>');
  $.each(obj_counselor.data, function (i, item) {
    // console.log(item.emp_name);
    $('#optionCoun').append('<option value="' + item.kaunselorId + '" > ' + item.emp_name + '</option>');
  });

  $('.slct2').select2({
    width: null,
    containerCssClass: ':all:'
  });
});



function SelectCoun(selectElement) {
  // Get the selected value from the select element
  var selectedValue = selectElement.value;

  listCounTimetbl(selectedValue, function () {
    // Clear the table content
    $('#tableTimetbl').html('');

    $('#tableTimetbl').append(`
        <div class="row">
          <div class="col-md-1 p-a-0"></div>
          <div class="col-md-2 p-a-0">
            <div class="box">
              <div class="box-header">
                <h3 class="text-center font-weight-bold">MONDAY</h3>
              </div>
              <div class="box-body light lt">
                <div class="list-group m-b" id="boxMon"></div>
              </div>
            </div>
          </div>
          <div class="col-md-2 p-a-0">
            <div class="box">
              <div class="box-header">
                <h3 class="text-center font-weight-bold">TUESDAY</h3>
              </div>
              <div class="box-body light lt">
                <div class="list-group m-b" id="boxTue"></div>
              </div>
            </div>
          </div>
          <div class="col-md-2 p-a-0">
            <div class="box">
              <div class="box-header">
                <h3 class="text-center font-weight-bold">WEDNESDAY</h3>
              </div>
              <div class="box-body light lt">
                <div class="list-group m-b" id="boxWed"></div>
              </div>
            </div>
          </div>
          <div class="col-md-2 p-a-0">
            <div class="box">
              <div class="box-header">
                <h3 class="text-center font-weight-bold">THURSDAY</h3>
              </div>
              <div class="box-body light lt">
                <div class="list-group m-b" id="boxThu"></div>
              </div>
            </div>
          </div>
          <div class="col-md-2 p-a-0">
            <div class="box">
              <div class="box-header">
                <h3 class="text-center font-weight-bold">FRIDAY</h3>
              </div>
              <div class="box-body light lt">
                <div class="list-group m-b" id="boxFri"></div>
              </div>
            </div>
          </div>
          <div class="col-md-1 p-a-0"></div>
        </div>
      `);

    let data = obj_counTimetbl.data;

    $.each(data, function (i, field) {
      let day = field.counseling_day;
      let id = field.id_timetable;
      let boxBody = '';

      if (day == 'Monday') {
        boxBody = 'boxMon';
      } else if (day == 'Tuesday') {
        boxBody = 'boxTue';
      } else if (day == 'Wednesday') {
        boxBody = 'boxWed';
      } else if (day == 'Thursday') {
        boxBody = 'boxThu';
      } else if (day == 'Friday') {
        boxBody = 'boxFri';
      }

      $('#' + boxBody).append('<a href="#" class="list-group-item" ><span class="pull-right">' +
        '<span id="timetbl' + id + '"></span>' +
        '<i   class="ion-ios-grid-view" style="margin-right: 10px;" onclick="loadData(\'' + field.id_timetable + '\')"></i>' +
        '</span>' + field.coun_timeslot + '</a>');
      // $('#'+boxBody).append('<a href="#" class="list-group-item" onclick="loadData(\'' + field.id_timetable + '\')"><span class="pull-right">'+
      // '<span id="timetbl'+id+'"></span></span>'+field.coun_timeslot+'</a>'); 


      getAppKaun(id, function () {
        let count = obj_coun.data.length;
        if (count != 0) {
          $('#timetbl' + id).html('<b class="label rounded success m-r-1">' + count + '</b>');
        } else {
          $('#timetbl' + id).html('');
        }
      });
    });

  });
}