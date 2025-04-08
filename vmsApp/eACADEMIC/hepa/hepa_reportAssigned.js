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

  let chkInOutDate = $('#chkInOutdate').val();

  let FK_status_Student = $('#FK_status_Student').val();
  let ChkInOutSelect = $('#ChkInOutSelect').val();

  var form = new FormData();
  // form.append("chkInOutMonth", chkInOutMonth);
  form.append("chkInOutDate", chkInOutDate);
  form.append("FK_status_Student", FK_status_Student);

  var settings = {
    url: host + "api_hep/public/hepHostelChkinout/list/AssignedAkaNewCheckIN",
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
    obj_stdAssigned = JSON.parse(response);




    var colums = [
      { name: "bil", title: "No.", "style": "text-align:center;" },
      // { name: "stud_id", title: "Student" },
      { name: "roomDet", title: "Hostel Details", "style": "text-align:center;" },
      { name: "nameStudent", title: "Name Student", breakpoints: "md sm xs", "style": "text-align:center;" },
      // { name: "sti_icno", title: "IC No.", breakpoints: "md sm xs" },
      { name: "checkIn_status", title: "Status", breakpoints: "md sm xs", "style": "text-align:center;" },
      { name: "sts_status_name_en", title: "Status Academic", breakpoints: "md sm xs", "style": "text-align:center;" },
    ];

    let bil = 1;
    let convertList = JSON.stringify(obj_stdAssigned.data);
    $("#dataStdAssigned").val(convertList);
    var list = [];

    $.each(obj_stdAssigned.data, function (i, field) {

      if (field.checkIn_status == 'New') { statusCheckIn = 'Assigned' } else { statusCheckIn = field.checkIn_status; }

      let stdId = field.std_id;
      // let blokGndr = field.sti_gender_name;
      let icnum = field.sti_icno;

      list.push({
        id: stdId,
        bil: bil++,
        roomDet: '<span class="text-uppercase">' + field.clg_name + "</span>",
        nameStudent:
          '<span class="text-uppercase"><b>' +
          field.std_id +
          "</b><br>" +
          field.sti_name +
          "</span>",
        // sti_icno: field.sti_icno,
        checkIn_status: statusCheckIn,
        sts_status_name_en: field.sts_status_name_en,
        // statusChkInOut: label_status,
        // reason: field.reason,

      });



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
        enabled: false,
        placeholder: "Search...",
        dropdownTitle: "Search for:",
      },
    });


  });
      button = `<label for="" class="col-form-label" style="display: block; height: 35px;"></label>
      <button type="button" onclick="generateTable()" class="btn btn-info">
          <i class="fa fa-fw fa-filter"></i>Filter
      </button>
      <button id="" onclick="generatePDF('Assigned', 'tableReportListStudent')" class="btn md-raised green">
          <i class="fa fa-fw fa-pencil-square-o"></i>
          <strong>Download PDF</strong>
      </button>`;


    $('#btnPDF').html(button);
 


}

