var now = new Date();
// Create an Intl.DateTimeFormat instance for Asia/Kuala_Lumpur time zone
var options = { timeZone: 'Asia/Kuala_Lumpur', month: 'numeric' };
var formatter = new Intl.DateTimeFormat('en-US', options);
var malaysiaMonth = formatter.format(now);
// malaysiaMonth = parseInt(malaysiaMonth, 10);

 $("#loading_modal").modal('show');

$(function () {
  $.ajaxSetup({
    cache: false
  });

  let getSession = window.sessionStorage.pgmSession;
  let calSem = window.sessionStorage.calSem;

  $.fn.select2.defaults.set("theme", "bootstrap");



  slctAsnaf(function () {
    $("#sti_asnaf").append($('<option value="">- Choose -</option>'));
    $.each(obj_asnafType.data, function (i, item) {
      $("#sti_asnaf").append(
        $(
          '<option value="' + item.asnaf_id + '" name="' + item.asnaf_name + '"  >' + item.asnaf_name + "</option>"
        )
      );

    });
  });

  generateTable();
});



var confirmed = false;
function generateTable() {
  let checkInDate = $('#chkIndate').val();
  if (checkInDate != null && checkInDate != '') {
    var monthOnly = checkInDate.split('-')[1];
    var yearOnly = checkInDate.split('-')[0];
  }
  else {
    var monthOnly = '';
    var yearOnly = '';
  }


  // console.log(checkInDate);
  let baitulMalCategory = $('#sti_baitulmal').val();
  let asnafCategory = $('#sti_asnaf').val();
  if (asnafCategory != null && asnafCategory != '') {
    asnafCategory = asnafCategory;
    var selectedAsnafName = $('#sti_asnaf option:selected').attr('name');
  }
  else {
    asnafCategory = '';
    var selectedAsnafName = '';
  }


  var form = new FormData();
  form.append("month", monthOnly);
  form.append("year", yearOnly);
  form.append("asnaf", asnafCategory);
  form.append("baitulMal", baitulMalCategory);

  var settings = {
    "url": host + "api_hep/public/hepHostelChkinout/reporting/reportBaitulMal",
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
    obj_Baitulmal = JSON.parse(response);
    // console.log(obj_Baitulmal);

    var colums = [
      { "name": "bil", "title": "Bil.", "style": "text-align:center;" },
      { "name": "campus", "title": "Campus", "style": "text-align:center;" },
      { "name": "studDet", "title": "Student", "breakpoints": "md sm xs", "style": "text-align:center;" },
      { "name": "studIc", "title": "IC / Passport Number", "style": "text-align:center;" },
      { "name": "hostel", "title": "Hostel", "style": "text-align:center;" },
      // { "name": "block", "title": "Block", "breakpoints": "md sm xs", "style": "text-align:center;" },
      // { "name": "room", "title": "Room", "style": "text-align:center;" },
      { "name": "date", "title": "Date", "style": "text-align:center;" },
      { "name": "status", "title": "Status", "style": "text-align:center;" },


    ];

    let bil = 1;
    // let convertList = JSON.stringify(listData);
    // $("#dataList").val(convertList);
    var list = [];
    dateC = new Date();
    datePicker = $("#chkIndate").val();
    datePickers = (datePicker == '') ? '' : (datePicker).split("-");



    if (datePickers!='') {
      // console.log(datePickers);
      
      obj_Baitulmal.data = obj_Baitulmal.data.filter(function(field) {
        // Convert checkOut date string to a Date object
        checkOutDate = new Date(field.checkOut);


        dateCheckOut_time =(field.checkOut ==null || field.checkOut =='')? '': new Date(field.checkOut);
        dateCheckIn_time = (field.checkIn ==null || field.checkIn =='')? '': new Date(field.checkIn);

        GetDatesPicker = getStartAndEndDate(datePicker);
        dateCheckSelected_startDate =new Date(GetDatesPicker.start);
        dateCheckSelected_endDate =new Date(GetDatesPicker.end);

        // Return true to keep the element if the check-in and check-out dates are within the selected date range
        if (dateCheckIn_time && dateCheckOut_time) {

        // if (field.stud_id === 'BPT12220002') {
        //   console.log(dateCheckOut_time);
          
        // }
          // Both check-in and check-out dates are present
          return (dateCheckIn_time <= dateCheckSelected_endDate && dateCheckOut_time >= dateCheckSelected_startDate);
        } else if (dateCheckIn_time) {
          // Only check-in date is present
          return (dateCheckIn_time <= dateCheckSelected_endDate);
        } else if (dateCheckOut_time) {
          // Only check-out date is present
          return (dateCheckOut_time >= dateCheckSelected_startDate);
        } else {
          // Both dates are absent
          return false;
        }
      });
    }

    $.each(obj_Baitulmal.data, function (i, field) {

      dateCheckOut = (field.checkOut == '' || field.checkOut == null) ? '' : (field.checkOut).split("-");
      dateCheckIn = (field.checkIn == '' || field.checkIn == null) ? '' : (field.checkIn).split("-");


      dateCheckOut_time =(field.checkOut ==null || field.checkOut =='')? '': new Date(field.checkOut);
      dateCheckIn_time = (field.checkIn ==null || field.checkIn =='')? '': new Date(field.checkIn);

      GetDatesPicker = getStartAndEndDate(datePicker);
      dateCheckSelected_startDate =new Date(GetDatesPicker.start);
      dateCheckSelected_endDate =new Date(GetDatesPicker.end);

      // if(new Date(dateCheckOut) <= new Date(fit_end_time))


      // console.log(datePickers[1]);
      if (datePickers != '') {

        if (field.stud_id ==='DHR09220085') {
        console.log(dateCheckIn_time + ' aa ' + datePickers);
          
        }
        if (field.checkOut != null || field.checkOut != '') {

          if ((dateCheckOut[1] == datePickers[1]) && (dateCheckOut[0] == datePickers[0])) {
            // console.log(dateCheckOut + ' aa ' + datePickers);
            labelStatus = field.checkIn_status;
          }
          else {
            labelStatus = 'Check In';
          }


        }

        // if (dateCheckOut_time) {
        //   $(field).remove(); // Removes the current element in the loop

        // }

      }else{
      labelStatus = field.checkIn_status;

      }

      if (field.checkIn_status === 'New') {
        if (field.type != null) {
          textDate = field.type;
        } else { textDate = ''; }
      } else {
        // splitdate = ;

        // splitdate = (field.checkIn == '' || field.checkIn == null) ? '' : (field.checkIn).split("-");
        splitdateIn = (field.checkIn && field.checkIn !== '') ? field.checkIn.split("-") : '';
        splitdateOut = (field.checkOut && field.checkOut !== '') ? field.checkOut.split("-") : '';

        // textDate = splitdate[2] + `/` + splitdate[1] + `/` + splitdate[0];
        textDateIn =(splitdateIn != '')? (splitdateIn[2] + `/` + splitdateIn[1] + `/` + splitdateIn[0]): '';
        textDateOut =(splitdateOut != '')? (splitdateOut[2] + `/` + splitdateOut[1] + `/` + splitdateOut[0]): '';
   
      }

      textDate=  (labelStatus !== 'Check Out')? textDateIn :textDateOut;

      if (labelStatus === 'Check Out') {
        textDate = textDateOut;
        
      }else if(labelStatus === 'New'){
        textDate = '';
      }else{
        textDate = textDateIn;
      }

      list.push({
        bil: bil++,
        campus: field.clg_name,
        studDet: '<span style="font-weight: bold;">' + field.stud_id + '</span>  <br> ' + field.sti_name,
        studIc: '<span class="text-uppercase" >' + field.sti_icno + '</span>',
        hostel: '<span style="font-weight: bold;">' + field.hostel_name + '</span>  <br> ' + field.block_name + '<br> ' + field.room_no,
        // block: field.block_name,
        // room: field.room_no,
        date: '<span class="text-uppercase">' + textDate + '</span>',
        status: '<span class="text-uppercase">' +labelStatus + '</span>',


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
      "filtering": {
          "enabled": true,
          "placeholder": "Search...",
          "dropdownTitle": "Search for:"
      }
    });

    $("#tableReportListStudent2").html('');
    $("#tableReportListStudent2").footable({
      "columns": colums,
      "rows": list,
      
      "filtering": {
          "enabled": false,
          "placeholder": "Search...",
          "dropdownTitle": "Search for:"
      }
    });

    $("#loading_modal").modal('hide');



  });


  button = `<label for="" class="col-form-label" style="display: block; height: 35px;"></label>
              <button type="button" onclick="generateTable()" class="btn btn-info">
                  <i class="fa fa-fw fa-filter"></i>Filter
              </button>
              <button id="" onclick="generatePDFBaitulMal('Baitulmal', 'tableReportListStudent2', '` + monthOnly + `', '` + yearOnly + `', '` + baitulMalCategory + `', '` + selectedAsnafName + `')" class="btn md-raised danger">
                  <i class="fa fa-fw fa-pencil-square-o"></i>
                  <strong>Download PDF</strong>
              </button>`
              +`
              <button type="button" onclick="btnExportExcel()" id="btnExport" class="btn md-raised green"><i class="fa fa-fw fa-file-excel-o"></i><strong>Download Excel</strong>
          </button>
              `
              
              ;


  $('#btnPDF').html(button);



}



function btnExportExcel() {
  alert('Excel export');

  // let table = document.getElementsById("tableReportListStudent2");
  let table = document.getElementById("tableReportListStudent2");
  autoFitTableColumns(table);
  TableToExcel.convert(table, {
      name: `Reporting_Baitulmal.xlsx`,
      sheet: {
          name: 'Reporting_Baitulmal'
      }
  });
}


function slctAsnaf(returnValue) {
  var settings = {
    url: host + "api_public_access/public/AsnafList",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    obj_asnafType = response;
    returnValue();
  });
}

function getStartAndEndDate(monthYear) {

  splitDetail = (monthYear).split('-');

  var startDate = new Date(splitDetail[0], splitDetail[1] - 1, 1);
  var endDate = new Date(splitDetail[0], splitDetail[1], 0);
  return {
      start: startDate,
      end: endDate
  };
}