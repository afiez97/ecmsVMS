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

function generateTable(returnValue) {
  let tarikh_mula = $('#tarikh_mula').val();
  let tarikh_tamat = $('#tarikh_tamat').val();
  let prog_category_id = $('#prog_category_id').val();

  if(tarikh_mula){
    formattedTarikh_mula = formatDate(tarikh_mula);
  }
  else{
    formattedTarikh_mula = '';
  }

  if(tarikh_tamat){
    formattedTarikh_tamat = formatDate(tarikh_tamat);
  }
  else{
    formattedTarikh_tamat = '';
  }
  
  console.log(formattedTarikh_mula);
          

          var form = new FormData();
          form.append("tarikh_mula", tarikh_mula);
          form.append("tarikh_tamat", tarikh_tamat);
          form.append("prog_category_id", prog_category_id);
          
          var settings = {
              "url": host + "api_hep/public/hepProgram/reporting/reportProg",
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
      // obj_ProgPDF = response;
      obj_ProgPDF = JSON.parse(response);
      console.log(obj_ProgPDF);

      var colums = [
          { "name": "bil", "title": "Bil.", "style": "text-align:center;" },
          { "name": "prog_title", "title": "Programme Name", "style": "text-align:center;" },
          { "name": "prog_startdate", "title": "Date", "breakpoints": "md sm xs", "style": "text-align:center;" },
          { "name": "prog_venue", "title": "Venue", "style": "text-align:center;" },
          { "name": "prog_org", "title": "Organizer", "style": "text-align:center;" },
          { "name": "prog_cost", "title": "Allocation Approved", "breakpoints": "md sm xs", "style": "text-align:center;" },
          { "name": "prog_kat", "title": "Programme Category", "style": "text-align:center;" },
          { "name": "prog_status", "title": "Status", "style": "text-align:center;" },


      ];

      let bil = 1;
      // let convertList = JSON.stringify(listData);
      // $("#dataList").val(convertList);
      var list = [];

      $.each(obj_ProgPDF.data, function (i, field) {
          let prog_kat = field.prog_category_id;
          let date_s = field.prog_startdate;
          let date_e = field.prog_enddate;


          if (prog_kat !== null) { prog_kat = field.prog_category_id; } else { prog_kat = '-'; }
          if (date_s !== null) { date_s = date_s; } else { date_s = '-'; }
          if (date_e !== null) { date_e = date_e; } else { date_e = '-'; }
          if (field.prog_alloc_approve !== null) { field.prog_alloc_approve = field.prog_alloc_approve; } else { field.prog_alloc_approve = '0'; }


          list.push({
              bil: bil++,
              prog_title: field.prog_title,
              prog_startdate: formatDate(date_s) + ' - ' + formatDate(date_e),
              prog_venue: '<span class="text-uppercase">' + field.prog_venue + '</span>',
              prog_org: '<span class="text-uppercase">' + field.prog_org + '</span>',
              prog_cost: 'RM ' + field.prog_alloc_approve + '',
              prog_kat: prog_kat,
              prog_status: field.prog_status,


          });

      });

      $("#tableReportListStudent").html('');
      $("#tableReportListStudent").footable({
          "columns": colums,
          "rows": list,
          // "paging": {
          //     "enabled": true,
          //     "size": 10,
          //     "countFormat": "Showing {PF} to {PL} of {TR} data"
          // },
          // "filtering": {
          //     "enabled": true,
          //     "placeholder": "Search...",
          //     "dropdownTitle": "Search for:"
          // }
      });

      returnValue();
  });

  button = `<label for="" class="col-form-label" style="display: block; height: 35px;"></label>
            <button type="button" onclick="generateTable()" class="btn btn-info">
                <i class="fa fa-fw fa-filter"></i>Filter
            </button>
            <button id="" onclick="generatePDFProgram('Programme', 'tableReportListStudent', '` + formattedTarikh_mula + `', '` + formattedTarikh_tamat + `', '` + prog_category_id + `')" class="btn md-raised green ml-2">
                <i class="fa fa-fw fa-pencil-square-o"></i> <strong>Download PDF</strong>
            </button>
  `
  
  ;


$('#btnPDF').html(button);

  // button = '  <label for="" class="col-form-label " style="display: block; height: 35px; "></label> '+
  //   '<button id="" onclick="generatePDF(\'Programme\', \'tableReportListStudent\')" class="btn md-raised green"> <i class="fa fa-fw fa-pencil-square-o"></i> <strong>Download PDF</strong></button>';
  //       $('#btnPDF').html(button);
}
