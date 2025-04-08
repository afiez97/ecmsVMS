$(function () {
  $.ajaxSetup({
    cache: false
  });
  // $("#loading_modal").modal('show');

  let getSession = window.sessionStorage.pgmSession;
  let calSem = window.sessionStorage.calSem;

  $.fn.select2.defaults.set("theme", "bootstrap");

  $('#fac_id').append('<option value="">- Choose -</option>');


  // generateTable();
});


// select session
acaCalActive(function () {
  $('#acaCal_std').append('<option calSem="" value="">- Choose Academic Session -</option>');
  // $('#cur_year').append($('<option value: "">- Choose -</option>'));
  // $('#select_year').append($('<option value: "">- Choose Academic Calendar -</option>'));
  let names = "";

  const groupedData = Object.groupBy(obj_kalendar.data, item => `${item.cur_year}-${item.cal_cohort}`);

  const simplifiedData = Object.entries(groupedData).map(([key, group]) => {
    return {
      cur_year: group[0].cur_year,
      cal_cohort: group[0].cal_cohort,
    };
  });
  $.each(simplifiedData, function (i, item) {
    // console.log(item);
    let curyear = item.cur_year.replace('/', '');
    names = curyear + '/' + item.cal_cohort;
    $('#acaCal_std').append('<option value="' + item.cur_year + '" calSem="' + item.cal_cohort + '">' + curyear + '/' + item.cal_cohort + '</option>');
    // $('#cur_year').append('<option value="" calYear="'+item.cur_year+'" calSem="'+item.cal_cohort+'">'+curyear+'/'+item.cal_cohort+'</option>');

  });

  $('.slct2').select2({
    width: null,
    containerCssClass: ':all:'
  });
});
calCatList(function () {
  $('#cal_category').append('<option value="">- Choose Academic Category -</option>');
  $.each(obj_acaField.data, function (i, item) {
    $('#cal_category').append('<option value="' + item.pk_id + '">' + item.category + '</option>');
  });

  $('.slct2').select2({
    width: null,
    containerCssClass: ':all:'
  });
});

campusList(function () {
  $('#fk_camp').append('<option value="">- Choose -</option>');
  $.each(obj_college.data, function (i, item) {
    $('#fk_camp').append('<option value="' + item.pk_id + '">' + item.clg_name + '</option>');
  });

  $('.slct2').select2({
    width: null,
    containerCssClass: ':all:',
  });

});

$("#fk_camp").change(function () {


  if ($('#fk_camp').val() !== '') {
    $('#fac_id').prop('disabled', false);

    facCamList($(this).val(), function () {

      $.each(obj_facCampus.data, function (i, item) {
        $('#fac_id').append('<option value="' + item.facCamId + '">' + item.facCode + ' - ' + item.fac_name + '</option>');
      });

      $('.slct2').select2({
        width: null,
        containerCssClass: ':all:',
      });
    });

  } else { $('#fac_id').prop('disabled', true); }



});

statusListAcademic(function () {
  $('#sts_student').append('<option value="">- Choose -</option>');
  $.each(obj_statusAcademic.data, function (i, item) {
    $('#sts_student').append('<option value="' + item.sts_status_id + '">' + (item.sts_status_name_en).toUpperCase() + '</option>');
    // $('#sts_student').append('<option value="' + item.sts_status_id + '">' + item.sts_status_name_en + ' (' + item.sts_status_code + ')</option>');
  });

  $('.slct2').select2({
    width: null,
    containerCssClass: ':all:',
  });
});




var confirmed = false;


function generateTable() {
  $("#tableListStd").html("");

  // Perform form validation
  if (!validateForm()) {
    return; // Stop execution if validation fails
  }


  $("#loading_modal").modal('show');

  let cur_year = $('#acaCal_std').val();
  let cal_cohort = $('#acaCal_std :selected').attr('calsem');
  let cal_category = $('#cal_category').val();
  let campus_id = $('#fk_camp').val();
  let fac_id = $('#fac_id').val();
  let sts_student = $('#sts_student').val();
  var formStdList = new FormData();
  formStdList.append("cal_category", cal_category);
  formStdList.append("cur_year", cur_year);
  formStdList.append("cal_cohort", cal_cohort);
  formStdList.append("campus_id", campus_id);
  formStdList.append("fac_id", fac_id);
  formStdList.append("sts_student", sts_student);


  let objStdList = new post(host + "api_pengurusan_pelajar/public/misStdInfo/listStdReporting", formStdList, "picoms " + window.sessionStorage.token).execute();

  if (objStdList.success) {


    var colums = [
      { name: "bil", title: "No.", "style": "text-align:center;" },
      { name: "aca_session", title: "ACADEMIC SESSION", breakpoints: "md sm xs", "style": "text-align:center;" },
      { name: "nameStudent", title: "STUDENT NAME", "style": "text-align:center;" },
      { name: "stud_icNum", title: "NRIC/ PASSPORT NO.", breakpoints: "md sm xs", "style": "text-align:center;" },
      { name: "stud_id", title: "MATRIC NO.", breakpoints: "md sm xs", "style": "text-align:center;" },
      { name: "campusName", title: "CAMPUS", breakpoints: "md sm xs", "style": "text-align:center;" },
      { name: "fac_name", title: "FACULTY", breakpoints: "md sm xs", "style": "text-align:center;" },
      { name: "pgm_name", title: "PROGRAMME", breakpoints: "md sm xs", "style": "text-align:center;" },
      { name: "act_btn", title: "ACTION", breakpoints: "md sm xs", "style": "text-align:center;" },

    ];

    var columsReporting = [
      { name: "bil", title: "No.", "style": "text-align:center;" },
      { name: "aca_session", title: "ACADEMIC SESSION", breakpoints: "md sm xs", "style": "text-align:center;" },
      { name: "nameStudent", title: "STUDENT NAME", "style": "text-align:center;" },
      { name: "stud_icNum", title: "NRIC/ PASSPORT NO.", breakpoints: "md sm xs", "style": "text-align:center;" },
      { name: "stud_id", title: "MATRIC NO.", breakpoints: "md sm xs", "style": "text-align:center;" },
      { name: "campusName", title: "CAMPUS", breakpoints: "md sm xs", "style": "text-align:center;" },
      { name: "fac_name", title: "FACULTY", breakpoints: "md sm xs", "style": "text-align:center;" },
      { name: "pgm_name", title: "PROGRAMME", breakpoints: "md sm xs", "style": "text-align:center;" },
      { name: "status", title: "STATUS", breakpoints: "md sm xs", "style": "text-align:center;" },

    ];
    
    let bil = 1;
    let convertList = JSON.stringify(objStdList.data);
    $("#dataList_tableListStd").val(convertList);
    var list = [];
    var listReporting = [];

    


    $.each(objStdList.data, function (i, field) {
      acaSession = (field.cur_year) ? (field.cur_year).replace('/', '') : '';
      // console.log(field);

      // console.log(field);
      bildata = bil++;
      

      list.push({
        id: field.std_studentid,
        bil: bildata,
        nameStudent: '<span class="text-uppercase">' + field.sti_name + "</span>",
        stud_id: '<span class="text-uppercase">' + field.std_studentid + "</span>",
        stud_icNum: '<span class="text-uppercase">' + field.sti_icno + "</span>",
        aca_session: acaSession + '/' + field.cal_cohort,
        campusName: '<span class="text-uppercase">' + field.clg_name + "</span>",
        fac_name: '<span class="text-uppercase">' + field.fac_name + "</span>",
        pgm_name: '<span class="text-uppercase">' + field.pgm_id + ' - ' + field.pgm_name + "</span>",
        act_btn: `<span class="text-uppercase">
        <button class="btn btn-icon success" title="Update" onclick="loadData('${i}')" data-ui-toggle-class="zoom" data-ui-target="#animate">
        <i class="ion-ios-list-outline"></i></button>
        </span>`,
      });

      listReporting.push({
        id: field.std_studentid,
        bil: bildata,
        nameStudent: '<span class="text-uppercase">' + field.sti_name + "</span>",
        stud_id: '<span class="text-uppercase">' + field.std_studentid + "</span>",
        stud_icNum: '<span class="text-uppercase">' + field.sti_icno + "</span>",
        aca_session: acaSession + '/' + field.cal_cohort,
        campusName: '<span class="text-uppercase">' + field.clg_name + "</span>",
        fac_name: '<span class="text-uppercase">' + field.fac_name + "</span>",
        pgm_name: '<span class="text-uppercase">' + field.pgm_id + ' - ' + field.pgm_name + "</span>",
        status:  '<span class="text-uppercase">' + field.sts_status_name_en + "</span>",
      });
      
      

    });




    $("#tableListStd").html("");
    $("#tableListStd").footable({
      columns: colums,
      rows: list,
      paging: {
        enabled: true,
        size: 20,
        // countFormat: "Showing {PF} to {PL} of {TR} data",
      },
      filtering: {
        enabled: true,
        placeholder: "Search...",
        dropdownTitle: "Search for:",
      },
      sorting: {
        enabled: true
      }
    });


    $("#tableListStdReporting").html("");
    $("#tableListStdReporting").addClass('hidden-table').footable({
      columns: columsReporting,
      rows: listReporting,
      paging: {
          enabled: false,
      },
      filtering: {
          enabled: false,
      },
      sorting: {
          enabled: true
      }
  });
  


    // $("#tableListStdReporting").modal('hide');
    $("#loading_modal").modal('hide');


  } else {

    $("#loading_modal").modal('hide');

    swal('No Data', '', "error");

  }


  $("#loading_modal").modal('hide');


}

function campusList(returnValue) {
  var settings = {
    "url": host + "api_tetapan_picoms/public/misPrmCollege/list",
    "method": "GET",
    "timeout": 0,
    "headers": {
      "Authorization": "picoms " + window.sessionStorage.token
    },
  };

  $.ajax(settings).done(function (response) {
    obj_college = response;
    returnValue();
  });
}


//-------------------------------------------------- loadData --------------------------------------------------//
function loadData(indexs) {
  let data = JSON.parse($("#dataList_tableListStd").val());
  data = data[indexs];
// console.log(data);

  let objGetPreviousStudy = new get(host + 'api_pengurusan_pelajar/public/academicHistory/list/' + data.std_studentid, 'picoms ' + window.sessionStorage.token).execute();

  previousData = objGetPreviousStudy.data;
  LastpreviousData = previousData[previousData.length - 1];
// console.log(previousData);
  let fullAddress = data.sti_address_2 ? '<br>' + data.sti_address_2 + 'br' + data.sti_address_3 : '';

  let formattedDate = '';
  if (data.sti_gender === 'P') {
    gender = 'Girl';
  } else if (data.sti_gender === 'L') {
    gender = 'Men';
  } else { gender = ''; }

  // if else sni utk generate tarikh lahir
  if ((data.sti_icno).length = 12) {
    year = (data.sti_icno).slice(0, 2);
    month = (data.sti_icno).slice(2, 4);
    day = (data.sti_icno).slice(4, 6);

    if (year.slice(0, 1) == 9) {
      yearFinal = `19` + year;
    } else {
      yearFinal = `20` + year;

    }
    let dateObj = new Date(`${yearFinal}-${month}-${day}`); // yyyy-mm-dd
    // var today = new Date('2021-10-06'); // yyyy-mm-dd


    let dayFinal = dateObj.getDate();
    let monthFinal = dateObj.toLocaleString('default', { month: 'long' }).toUpperCase(); // Convert month to full name and uppercase
    let yearFinalFinal = dateObj.getFullYear();

    // formattedDate = dayFinal + ' ' + monthFinal + ' ' + yearFinalFinal;
    formattedDate = day + '/' + month + '/' + yearFinal;

  }
  // end if else sni utk generate tarikh lahir

  stsAcademic = (data.std_cgpa > 3.61) ? 'Good Standing' : 'Not Good Standing';

  $("#idStd").val(data.std_studentid);




  // $('#aca_session').html((data.cur_year).replace('/','')+'/'+data.cal_cohort);
  // $('#stdName').html(data.sti_name);
  // $('#stu_id').html(data.std_studentid);
  // $('#sti_icno').html(data.sti_icno);
  // $('#mdl_clg').html(data.clg_name);
  // $('#mdl_fac_name').html(data.fac_id+' - '+data.fac_name);
  // $('#mdl_progName').html(data.pgm_id +' - '+ data.pgm_name);
  // $('#mdl_intakeStd').html(data.cur_intake);
  // $('#mdl_semester').html(data.std_semester);
  // $('#mdl_week').html(data.cur_year);
  // $('#mdl_stdEmail').html(data.std_studentid+'@studentmail.unimap.edu.my');
  // $('#mdl_personalEmail').html(data.sti_email);
  // $('#mdl_phoneNo').html(data.cur_year);
  // $('#mdl_national').html(data.sti_nationality_name);
  // $('#mdl_dob').html(data.cur_year);
  // $('#mdl_gender').html(gender);

  // // Clear values for all the fields with generic ids.
  // $('#mdl_okuStatus').html(data.sti_status_oku);
  // $('#mdl_race').html(data.sti_race_name);
  // $('#mdl_religion').html(data.sti_religion_name);
  // $('#mdl_maritalStatus').html(data.marital_status);
  // $('#mdl_homeAddress').html(data.sti_address_1+fullAddress);
  // $('#mdl_postcode').html(data.sti_postcode);
  // $('#mdl_state').html(data.name_state);
  // $('#mdl_academicQualifications').html(LastpreviousData?.level || '');
  // $('#mdl_previousInstitutions').html(LastpreviousData?.std_preUniversity || '');
  // $('#mdl_yearOfGraduation').html(LastpreviousData?.std_year || '');
  // $('#mdl_asnafCategory').html(data.asnaf_name);
  // $('#mdl_sponsorshipName').html(data.sponsorship_name);
  // $('#mdl_academicStatus').html(stsAcademic);
  // $('#mdl_cgpa').html(data.std_cgpa);
  // $('#mdl_status').html(data.sts_status_name_en);

  $('#aca_session').html(((data.cur_year || '').replace('/', '') + '/' + (data.cal_cohort || '')).toUpperCase());
  $('#stdName').html((data.sti_name || '').toUpperCase());
  $('#stu_id').html((data.std_studentid || '').toUpperCase());
  $('#sti_icno').html(data.sti_icno || '');
  $('#mdl_clg').html((data.clg_name || '').toUpperCase());
  $('#mdl_fac_name').html(((data.fac_id || '') + ' - ' + (data.fac_name || '')).toUpperCase());
  $('#mdl_progName').html(((data.pgm_id || '') + ' - ' + (data.pgm_name || '')).toUpperCase());
  $('#mdl_intakeStd').html((data.cur_intake || '').toUpperCase());
  $('#mdl_semester').html(data.std_semester || '');
  $('#mdl_stdEmail').html(((data.std_studentid || '') + '@student.ucmi.edu.my'));
  $('#mdl_personalEmail').html(data.sti_email || '');
  $('#mdl_phoneNo').html(data.sti_contactno_mobile || '');
  $('#mdl_national').html((data.sti_nationality_name || '').toUpperCase());
  $('#mdl_dob').html(formattedDate || '');
  $('#mdl_gender').html((gender || '').toUpperCase());

  // Clear values for all the fields with generic ids.
  $('#mdl_okuStatus').html((data.sti_status_oku || '').toUpperCase());
  $('#mdl_race').html((data.sti_race_name || '').toUpperCase());
  $('#mdl_religion').html((data.sti_religion_name || '').toUpperCase());
  $('#mdl_maritalStatus').html((data.marital_status || '').toUpperCase());
  $('#mdl_homeAddress').html(((data.sti_address_1 || '') + (fullAddress || '')).toUpperCase());
  $('#mdl_postcode').html(data.sti_postcode || '');
  $('#mdl_state').html((data.name_state || '').toUpperCase());
  $('#mdl_academicQualifications').html((LastpreviousData?.level || '').toUpperCase());
  $('#mdl_previousInstitutions').html((LastpreviousData?.std_preUniversity || '').toUpperCase());
  $('#mdl_yearOfGraduation').html(LastpreviousData?.std_year || '');
  $('#mdl_asnafCategory').html((data.asnaf_name || '').toUpperCase());
  $('#mdl_sponsorshipName').html((data.sponsorship_name || '').toUpperCase());
  $('#mdl_academicStatus').html((stsAcademic || '').toUpperCase());
  $('#mdl_cgpa').html(data.std_cgpa || '');
  $('#mdl_status').html((data.sts_status_name_en || '').toUpperCase());


  if (data.sts_status_name_en === 'Active') {
    $(".mdl_week").hide();
  }else{
    
  $('#mdl_week').html(data.acaCal_weeks || '');

  }
  $("#mdlStdDetail").modal("show");
}
//-------------------------------------------------- end loadData --------------------------------------------------//



const { jsPDF } = window.jspdf;

async function printHtmlToPdf(elementId) {


  const element = document.getElementById(elementId);

  // Use html2canvas to capture the element as a canvas
  const canvas = await html2canvas(element, {
    scale: 2, // Increase the scale for better resolution
    useCORS: true // Use CORS to allow cross-origin images
  });

  // Get the canvas as an image
  const imgData = canvas.toDataURL('image/png');

  // Determine the width and height of the image
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;

  // Initialize jsPDF with the appropriate dimensions
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [imgWidth, imgHeight]
  });

  // Add the image to the PDF
  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

  // Save the PDF
  pdf.save('GraduationAudit.pdf');


}


function btnExport(nameTable) { 
  let table = document.getElementsByClassName(nameTable)[0];
  
  // Only auto-fit columns if the table is visible
  if (window.getComputedStyle(table).display !== "none") {
      autoFitTableColumns(table);
  }
  
  TableToExcel.convert(table, {
      name: `Student_List.xlsx`,
      sheet: {
          name: 'Reporting_Baitulmal'
      }
  });
}


 function autoFitTableColumns(table) {
  let cols = table.getElementsByTagName('col');
  if (cols.length === 0) {
      let colgroup = document.createElement('colgroup');
      for (let i = 0; i < table.rows[0].cells.length; i++) {
          let col = document.createElement('col');
          colgroup.appendChild(col);
      }
      table.insertBefore(colgroup, table.firstChild);
      cols = table.getElementsByTagName('col');
  }

  for (let i = 0; i < table.rows[0].cells.length; i++) {
      let maxWidth = 0;
      for (let j = 0; j < table.rows.length; j++) {
          let cell = table.rows[j].cells[i];
          let cellWidth = cell.scrollWidth;
          if (cellWidth > maxWidth) {
              maxWidth = cellWidth;
          }
      }
      cols[i].style.width = maxWidth + 'px';
  }
}