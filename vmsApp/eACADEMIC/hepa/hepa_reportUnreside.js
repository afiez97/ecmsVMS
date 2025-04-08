$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let getSession = window.sessionStorage.pgmSession;
    let calSem = window.sessionStorage.calSem;

    $.fn.select2.defaults.set( "theme", "bootstrap" );

   

      generateTable();
});



var confirmed=false;
function generateTable(){

    let date = $('#chkInOutdateUnreside').val();
  var form = new FormData();
  // form.append("chkInOutMonth", chkInOutMonth);
  form.append("lastupdateon", date);

  var settings = {
    url: host + "api_pengurusan_pelajar/public/misStdInfo/listStdUnreside",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
    "processData": false,
    "mimeType": "multipart/form-data",
    "contentType": false,
    "data": form
  };
  $.ajax(settings).done(function (response) {
    // obj_stdUnreside = response;
    obj_stdUnreside = JSON.parse(response);


    var colums = [
      { name: "bil", title: "No.", "style": "text-align:center;" },
      { name: "campus_id", title: "Campus", "style": "text-align:center;" },
      { name: "stud_id", title: "Student", "style": "text-align:center;" },
      { name: "sti_icno", title: "IC No.", breakpoints: "md sm xs", "style": "text-align:center;" },
      { name: "sti_gender", title: "Gender", breakpoints: "md sm xs", "style": "text-align:center;" },
      { name: "last_update", title: "Date", breakpoints: "md sm xs", "style": "text-align:center;" },
      { name: "reason", title: "Reason", breakpoints: "md sm xs", "style": "text-align:center;" },
    ];

    let bil = 1;
    let convertList = JSON.stringify(obj_stdUnreside.data);
    $("#dataStdList2").val(convertList);
    var list = [];
    // console.log(obj_stdUnreside.data);
    $.each(obj_stdUnreside.data, function (i, field) {

    console.log(date);


      //checking bgi status check out check in xmasuk dlm
      if (field.checkIn_status != "Check Out" && field.checkIn_status != "Check In") {
        let stdId = field.std_studentid;
        // let blokGndr = field.sti_gender_name;
        let icnum = field.sti_icno;
        let getValic = icnum.slice(-1);

        // if (getValic % 2 == 0) {
        //   blokGndr = "Female";
        // } else {
        //   blokGndr = "Male";
        // }


        if (field.sti_gender_name != null) {

          blokGndr = field.sti_gender_name;
        }
        else {

          if (getValic % 2 == 0) {
            blokGndr = "Female";
          } else {
            blokGndr = "Male";
          }

        }
        var myDate = new Date(field.lastupdateon);

        let label = "";
        if (blokGndr == "Male") {
          label = '<span class="label blue">' + blokGndr + "</span>";
        } else if (blokGndr == "Female") {
          label = '<span class="label pink">' + blokGndr + "</span>";
        }

        label_status = '<span class="label warning">Unreside</span>';

        list.push({
          id: stdId,
          bil: bil++,
          campus_id: '<span class="text-uppercase">' + field.clg_name + "</span>",
          stud_id:
            '<span class="text-uppercase"><b>' +
            stdId +
            "</b><br>" +
            field.sti_name +
            "</span>",
          sti_icno: field.sti_icno,
          sti_gender: label,
          last_update: myDate.getDate() + '/' + (myDate.getMonth() + 1) + '/' + myDate.getFullYear(),
          // statusChkInOut: label_status,
          reason: field.reason,
        });
      }




    });

    $("#tableReportListStudent").html("");
    $("#tableReportListStudent").footable({
      columns: colums,
      rows: list,
      paging: {
        enabled: false,
        countFormat: "Showing {PF} to {PL} of {TR} data",
      },
      filtering: {
        enabled: true,
        placeholder: "Search...",
        dropdownTitle: "Search for:",
      },
    });

    $("#tableReportListStudent2").html("");
    $("#tableReportListStudent2").footable({
      columns: colums,
      rows: list,
      paging: {
        enabled: false,
        countFormat: "Showing {PF} to {PL} of {TR} data",
      },
      filtering: {
        enabled: false,
        placeholder: "Search...",
        dropdownTitle: "Search for:",
      },
    });

    returnValue();

  });

  let dateUnreside = $('#chkInOutdateUnreside').val();
  console.log(dateUnreside);


   button = `<label for="" class="col-form-label" style="display: block; height: 35px;"></label>
              <button type="button" onclick="generateTable()" class="btn btn-info">
                  <i class="fa fa-fw fa-filter"></i>Filter
              </button>
              <button id="" onclick="generatePDFUnreside('Unreside', 'tableReportListStudent2', '`+dateUnreside+`')" class="btn md-raised green">
                  <i class="fa fa-fw fa-pencil-square-o"></i>
                  <strong>Download PDF</strong>
              </button>`;


    $('#btnPDF').html(button);
 
}

