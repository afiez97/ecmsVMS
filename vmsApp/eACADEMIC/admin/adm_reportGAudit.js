$(function(){
    $.ajaxSetup ({
        cache: false
    });
    // $("#loading_modal").modal('show');

    let getSession = window.sessionStorage.pgmSession;
    let calSem = window.sessionStorage.calSem;

    $.fn.select2.defaults.set( "theme", "bootstrap" );

   

      // generateTable();
});

// campusList(function(){
//   $('#fac_id').append('<option value="">- Choose -</option>');
//   $.each(obj_college.data, function (i, item){
//       $('#fac_id').append('<option value="'+item.pk_id+'">'+item.clg_name+'</option>');
//   });

//   $('.slct2').select2({
//       width: null,
//       containerCssClass: ':all:',
//   });
// });

facList(function(){
  $('#fac_id').append('<option value="">- Choose -</option>');
  $.each(obj_faculty.data, function (i, item){
      $('#fac_id').append('<option value="'+item.pk_id+'">'+item.fac_name+'</option>');
  });

  $('.slct2').select2({
      width: null,
      containerCssClass: ':all:',
  });
});

ProgramList(function(){
  $('#pgm_id').append('<option value="">- Choose -</option>');
  $.each(obj_program.data, function (i, item){
      $('#pgm_id').append('<option value="'+item.pk_id+'">'+item.pgm_name+ ' ('+item.pgm_id+ ')</option>');
  });

  $('.slct2').select2({
      width: null,
      containerCssClass: ':all:',
  });
});

calCatList(function(){
  $('#cal_category').append('<option value="">- Choose Academic Category -</option>');
  $.each(obj_acaField.data, function (i, item){
      $('#cal_category').append('<option value="'+item.pk_id+'">'+item.category+'</option>');
  });

  $('.slct2').select2({
      width: null,
      containerCssClass: ':all:'
  });
});

var confirmed=false;
function generateTable(){

  let cal_category = $('#cal_category').val();
  let fac_id = $('#fac_id').val();
  let pgm_id = $('#pgm_id').val();
  // console.log(cal_category);
  // console.log(fac_id);
  // console.log(pgm_id);


  var form = new FormData();
  // form.append("chkInOutMonth", chkInOutMonth);
  form.append("cal_category", cal_category);
  form.append("fac_id", fac_id);
  form.append("pgm_id", pgm_id);

  var settings = {
    url: host + "api_pengurusan_pelajar/public/reportingAuditBergraduat",
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
    obj_stdtGraduationAudit = JSON.parse(response);

    var colums = [
      { name: "bil", title: "No.", "style": "text-align:center;" },
      // { name: "stud_id", title: "Student" },
      { name: "nameStudent", title: "Name" },
      // { name: "nameStudent", title: "Name", "style": "text-align:center;" },
      { name: "stud_id", title: "Matric Number", breakpoints: "md sm xs", "style": "text-align:center;" },
      { name: "stud_icNum", title: "IC/Passport No.", breakpoints: "md sm xs", "style": "text-align:center;" },
      { name: "sessIntake", title: "Session Intake", breakpoints: "md sm xs", "style": "text-align:center;" },
      { name: "sessEnd", title: "Session End", breakpoints: "md sm xs", "style": "text-align:center;" },
      { name: "stud_CGPA", title: "CGPA", breakpoints: "md sm xs", "style": "text-align:center;" },
      { name: "stud_HClass", title: "Honors Class", breakpoints: "md sm xs", "style": "text-align:center;" },
      { name: "stud_cect", title: "Total CE/CT", breakpoints: "md sm xs", "style": "text-align:center;" },
      { name: "stud_CHours", title: "Register Credit Hours", breakpoints: "md sm xs", "style": "text-align:center;" },
      { name: "stud_TGCH", title: "Total Graduate Credit Hours", breakpoints: "md sm xs", "style": "text-align:center;" },
      // { name: "stud_PercentCreditCECT", title: "Transfer Credit Percentage & Credit Exemption", breakpoints: "md sm xs", "style": "text-align:center;" },
      { name: "stud_CECTAttach", title: "CECT Attachment", breakpoints: "md sm xs", "style": "text-align:center;" },
      { name: "stud_muet", title: "Muet", breakpoints: "md sm xs", "style": "text-align:center;" },
      { name: "stud_spmBM", title: "BM (SPM)", breakpoints: "md sm xs", "style": "text-align:center;" },
      // { name: "sti_icno", title: "IC No.", breakpoints: "md sm xs" },
    ];

    let bil = 1;
    let convertList = JSON.stringify(obj_stdtGraduationAudit.data);
    $("#dataStdAssigned").val(convertList);
    $("#dataListStd").val(convertList);
    
    var list = [];

    $.each(obj_stdtGraduationAudit.data, function (i, field) {

      if (field.checkIn_status == 'New') { statusCheckIn = 'Assigned' } else { statusCheckIn = field.checkIn_status; }

      // if (field.std_studentid === 'BHR04210007') {
      // console.log(field);
        
      // }
      let stdId = field.std_id;
      // let blokGndr = field.sti_gender_name;
      let icnum = field.sti_icno;
      let HClass = '-';


      if (field.pgm_category != 2){
        if (field.std_cgpa >= 3.60){
          HClass = 'Graduated With Honors (Excellent)';
        }
        else if(field.std_cgpa < 3.60 ){
          HClass = 'Graduated With Honors (-)';
        }
      }
      else{
        HClass = '-';
      }
      
      transkrip = `<button class="btn btn-icon accent" title="Details" onclick="mdlStdListCECT(${i})" id="btnStdListCECT"><i class="ion-ios-list-outline"></i></button>`;

      if( field.std_transkrip != null){

        // transkrip = field.std_transkrip
        // transkrip = 'View CE/CT Letter'
        transkrip = `<button class="btn btn-icon accent" title="Details" onclick="mdlStdListCECT(${i})" id="btnStdListCECT"><i class="ion-ios-list-outline"></i></button>`;

      }
      else{
        transkrip = '-';
        // transkrip = `<button class="btn btn-icon accent" title="Details" onclick="mdlStdListCECT(${i})" id="btnStdListCECT"><i class="ion-ios-list-outline"></i></button>`;

      }

      if(field.sta_muet_name != null){

        // transkrip = field.std_transkrip
        muet_name = field.sta_muet_name
      }
      else{
        muet_name = '-'
      }

      ///


      if(field.sta_bm_spm != null){

        // transkrip = field.std_transkrip
        stud_bm = field.sta_bm_spm
      }
      else{
        stud_bm = '-'
      }
      //

      if(field.std_credit_hour_pre != null){

        // transkrip = field.std_transkrip
        std_credit_hour_pre = field.std_credit_hour_pre;
        PercentCreditCECT1 = ((field.std_credit_hour_pre/field.tc_sum)*100).toFixed(2);
        PercentCreditCECT = PercentCreditCECT1 + '%';

      }
      else{
        std_credit_hour_pre = '-';
        PercentCreditCECT = '-';
      }

      if(field.std_cgpa != null){

        // transkrip = field.std_transkrip
        stud_CGPA = field.std_cgpa
      }
      else{
        stud_CGPA = '-'
      }

      // if (field.std_studentid === 'BHR04210003') {
      // console.log(field);
        
      // }
      // let objGet = new get(host + "api_pengurusan_pelajar/public/curAcademic/lastSem/"+ field.std_studentid, 'picoms '+window.sessionStorage.token).execute();

      lastSem = field.last_std_semester;
      PgmCredit = (field.pgm_tcrdpass) ? `(${field.pgm_tcrdpass})` : '';
      PgmCreditTaken = (field.tc_real) ? (field.tc_real*1) : '';
      PgmCreditCE = (field.TC_CE) ? (field.TC_CE*1) : '';
      PgmTakenTotal = PgmCreditTaken + PgmCreditCE;
      muetLatest = (field.muetLatest) ? field.muetLatest : '';
      lastcurYear = '';
      // console.log(lastSem);
      if(field.last_cur_year){
        lastcurYear = field.last_cur_year.replace("/", "") + '/' + field.last_cal_cohort;
      }
      list.push({
        id: stdId,
        bil: bil++,
        // roomDet: '<span class="text-uppercase">' + field.clg_name + "</span>",
        nameStudent: '<span class="text-uppercase">' + field.sti_name + "</span>",
        stud_id: '<span class="text-uppercase">' + field.std_studentid + "</span>",
        stud_icNum: '<span class="text-uppercase">' + field.sti_icno + "</span>",
        sessIntake: '<span class="text-uppercase">' + field.student_intake + "</span>",
        sessEnd: lastcurYear,
        // sessEnd: '<span class="text-uppercase">' + field.sti_icno + "</span>",
        stud_CGPA: '<span class="text-uppercase">' + stud_CGPA + "</span>",
        stud_HClass: '<span class="text-uppercase">' + HClass + "</span>",
        stud_cect: '<span class="text-uppercase">' + std_credit_hour_pre + "</span>",
        stud_CHours: '<span class="text-uppercase">' + parseFloat(field.tc_real).toFixed(2) + "</span>",
        stud_TGCH: `<span class="text-uppercase"> ${PgmTakenTotal} ${PgmCredit}</span>`,
        // stud_PercentCreditCECT: '<span class="text-uppercase">' + PercentCreditCECT + " </span>",
        stud_CECTAttach: '<span class="text-uppercase">' + transkrip + "</span>",
        stud_muet: '<span class="text-uppercase">' + muetLatest + "</span>",
        stud_spmBM: '<span class="text-uppercase">' + stud_bm + "</span>",
        // nameStudent:
        //   '<span class="text-uppercase"><b>' +
        //   field.std_id +
        //   "</b><br>" +
        //   field.sti_name +
        //   "</span>",
        // sti_icno: field.sti_icno,
        // checkIn_status: statusCheckIn,
        // sts_status_name_en: field.sts_status_name_en,
        // statusChkInOut: label_status,
        // reason: field.reason,

      });



    });

    $("#tableReportGraduationAudit").html("");
    $("#tableReportGraduationAudit").footable({
      columns: colums,
      rows: list,
      paging: {
        enabled: false,
        size: 10,
        // countFormat: "Showing {PF} to {PL} of {TR} data",
      },
      filtering: {
        enabled: false,
        placeholder: "Search...",
        dropdownTitle: "Search for:",
      },
    });

    $("#loading_modal").modal('hide');


  });
    //   button = `<label for="" class="col-form-label" style="display: block; height: 35px;"></label>
    //   <button type="button" onclick="generateTable()" class="btn btn-info">
    //       <i class="fa fa-fw fa-filter"></i>Filter
    //   </button>
    //   <button id="" onclick="generateGradPDF('Graduation Audit', 'tableReportGraduationAudit')" class="btn md-raised green">
    //       <i class="fa fa-fw fa-pencil-square-o"></i>
    //       <strong>Download PDF</strong>
    //   </button>

    //   <button id="reloadButton" class="btn grey-200 text-info " onclick="location.reload()">
    //     <i class="fa fa-fw fa-refresh"></i>
    //     <strong>Clear</strong>
    //   </button>
      
    //   `;


    // $('#btnPDF').html(button);
 


}

function campusList(returnValue){
  var settings = {
      "url": host+"api_tetapan_picoms/public/misPrmCollege/list",
      "method": "GET",
      "timeout": 0,
      "headers": {
          "Authorization": "picoms " + window.sessionStorage.token
      },
  };

  $.ajax(settings).done(function (response){
     obj_college = response;
     returnValue();
  });
}

function facList(returnValue){
  var settings = {
      "url": host+"api_tetapan_picoms/public/misPrmFaculty/list",
      "method": "GET",
      "timeout": 0,
  };

  $.ajax(settings).done(function (response){
      obj_faculty = response;
      returnValue();        
  });
}

function ProgramList(returnValue){
  var settings = {
      "url": host+"api_pengurusan_pelajar/public/programme/list",
      "method": "GET",
      "timeout": 0,
      "headers": {
          "Authorization": "picoms " + window.sessionStorage.token
      },
  };

  $.ajax(settings).done(function (response){
     obj_program = response;
     returnValue();
  });
}



function mdlStdListCECT(indexs) { 
  
  let data = JSON.parse($("#dataListStd").val());
  data = data[indexs];
// console.log(data);
$("#studname").html(data.sti_name);

$("#studic").html(data.sti_icno);
$("#studid").html(data.std_studentid);
$("#studprog").html(data.pgm_id);
$("#studintake").html(data.student_intake);


let objCECT = new get( host + 'api_pengurusan_pelajar/public/misStdRegsub/cectListed/'+data.std_studentid , 'picoms '+ window.sessionStorage.token).execute();

if (objCECT.success) {
  
  dataCECT = objCECT.data;

  var columns = [
    { name: "bil", title: "No." },
    { name: "crs_code", title: "Course Code" },
    { name: "std_semester", title: "Semester" },
    { name: "sessionTaken", title: "Academic Session" },
    { name: "typecect", title: "CE/CT" },

  ];

  let bil = 1;
  var list = [];
  let convertList = JSON.stringify(dataCECT);
  $("#dataListCECT" ).val(convertList);



  $.each(dataCECT, function (j, itemJ) {

    let acaSession = itemJ.cur_year;
    let acaCal = acaSession.replace("/", "") + "/" + itemJ.cal_cohort;
    let tempatDuduk = '';



    list.push({
      bil: bil++,
      crs_code:
        '<span class="text-uppercase">' +
        itemJ.crsCode +
        " - " +
        itemJ.crs_name +
        "</span>",
        std_semester: itemJ.std_semester,
        sessionTaken:acaCal,
      
      typecect: itemJ.rsb_type,

    });
  });

  $("#tableCECTListed").html('');
  $("#tableCECTListed").footable({
    columns: columns,
    rows: list,
    paging: {
      enabled: false,
      size: 10,
      countFormat: "Showing {PF} to {PL} of {TR} data",
    },
    // filtering: {
    //   enabled: true,
    //   placeholder: "Search...",
    //   dropdownTitle: "Search for:",
    // },
  });
  
  $("#mdlStdListCECT").modal("show");

} else {
  
}


 }