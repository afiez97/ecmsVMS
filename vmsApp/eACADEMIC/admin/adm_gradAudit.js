var listCummulativeBySem = [];


$(function(){
    $.ajaxSetup ({
        cache: false
    });
    $("#loading_modal_audit").modal('show');

    let getSession = window.sessionStorage.pgmSession;
    let calSem = window.sessionStorage.calSem;
    // let clg_id = window.sessionStorage.idPage;

    $.fn.select2.defaults.set( "theme", "bootstrap" );

   

      generateTable();
});

// acaCalActive(function(){
//   $('#aca_session').append('<option value="">- Choose Academic Session -</option>');
//   let names = "";
//   $.each(obj_kalendar.data, function (i, item){
//     let curyear = item.cur_year.replace('/','');
//     select = "";
//     // if(yearTaken == item.cur_year && cal_cohort == item.cal_cohort){
//     //     select = "selected";
//     // }

//     if(names != curyear+'/'+item.cal_cohort){
//         names = curyear+'/'+item.cal_cohort;
//         $('#aca_session').append('<option value="'+item.cur_year+'" calCohort="'+item.cal_cohort+'" '+select+'>'+curyear+'/'+item.cal_cohort+'</option>');                
//     }      
//   });

//   $('.slct2').select2({
//       width: null,
//       containerCssClass: ':all:'
//   });
// });

  // select intake
  slctIntake(function () {
    $("#intake_filter").append('<option data-idIntake="" value="">- Choose Intake -</option>');
    $("#sti_intake").append('<option value="">- Choose -</option>');
    $("#sti_intake_upt").append('<option value="">- Choose -</option>');
    $.each(obj_intake.data, function (i, item) {
      let intake = item.intake_month + "-" + item.intake_year;
      $("#intake_filter").append(
        '<option data-idIntake="'+(item.id)+'" value="' + intake + '">' + intake + "</option>"
      );
      $("#sti_intake").append(
        '<option value="' + intake + '">' + intake + "</option>"
      );
      $("#sti_intake_upt").append(
        '<option value="' + intake + '">' + intake + "</option>"
      );
    });

    $("#intake_filter").select2({
      width: null,
      containerCssClass: ":all:",
    });
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

getFaculty(function(){
  $('#fac_id').append('<option value="">- Choose Faculty -</option>');
  $.each(obj_getFaculty.data, function(i, item){
      $('#fac_id').append('<option value="'+item.pk_id+'">'+item.fac_id+' - '+item.fac_name+'</option>');
  });

  $('.slct2').select2({
      width: "100%",
      containerCssClass: ':all:',
  });
})


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

  let clg_id = window.sessionStorage.idPage;
  $("#loading_modal_audit").modal('show');

  // let year = $('#aca_session').val();
  // // let aca_session = $('#aca_session').val();
  // let cohort = null;
  // if(year){
  //    cohort = $("#aca_session option:selected").attr("calCohort");

  // }


  
  let cal_category = $('#cal_category').val();
  let fac_id = $('#fac_id').val();
  let pgm_id = $('#pgm_id').val();

  let intake_id = $('#intake_filter :selected').attr('data-idIntake');

  var form = new FormData();
  // // form.append("chkInOutMonth", chkInOutMonth);
  // form.append("year", year);
  // form.append("cohort", cohort);
  form.append("cal_category", cal_category);
  form.append("fac_id", fac_id);
  form.append("pgm_id", pgm_id);
  form.append("intake_id", intake_id);

  var settings = {
    url: host + "api_pengurusan_pelajar/public/auditBergraduat",
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
    // console.log(obj_stdtGraduationAudit);

    var colums = [
      { name: "bil", title: "No.", "style": "text-align:center;" },
      { name: "stud_fac", title: "Faculty", breakpoints: "md sm xs", "style": "text-align:center;" },

      // { name: "stud_id", title: "Student" },
      { name: "nameStudent", title: "Name" },
      // { name: "nameStudent", title: "Name", "style": "text-align:center;" },
      { name: "stud_id", title: "Matric Number", breakpoints: "md sm xs", "style": "text-align:center;" },
      { name: "stud_icNum", title: "IC/Passport No.", breakpoints: "md sm xs", "style": "text-align:center;" },
      { name: "sessIntake", title: "Intake", breakpoints: "md sm xs", "style": "text-align:center;" },
      { name: "sessionStud", title: "Session", breakpoints: "md sm xs", "style": "text-align:center;" },
      { name: "calCat", title: "Category", breakpoints: "md sm xs", "style": "text-align:center;" },
      { name: "viewTranskrip", title: "Transcript", breakpoints: "md sm xs", "style": "text-align:center;" },
      { name: "checkingAdm", title: "Check By", breakpoints: "md sm xs", style: "text-align:center;width:auto;white-space:nowrap;"},
      { name: "upt_btn", title: "Action", breakpoints: "md sm xs", "style": "text-align:center;" },

    ];

    let bil = 1;
    let convertList = JSON.stringify(obj_stdtGraduationAudit.data);
    $("#dataStdAssigned").val(convertList);
    var list = [];

    $.each(obj_stdtGraduationAudit.data, function (i, field) {
      if (field.checkIn_status == 'New') { statusCheckIn = 'Assigned' } else { statusCheckIn = field.checkIn_status; }
      // disableCheck = '';
      disableCheck = (field.perms_facGrad === 'Checked') ? '' : 'disabled';
      disableCheckTrue = (field.perms_facGrad === 'Checked') ? 'Checked' : '';
      let stdId = field.std_id;
      // let blokGndr = field.sti_gender_name;

      if(field.cur_year){
        curYear = field.cur_year.replace("/", "") + '/' + field.cal_cohort;
      }
      else{
        curYear = '';

      }
      list.push({
        id: stdId,
        bil: (bil++) 
        +'<span id="pgm_name_'+field.std_studentid+'" hidden>' + field.pgm_id +'-'+ field.pgm_name + "</span>"
        +'<span id="sti_nationality_'+field.std_studentid+'" hidden>' + field.sti_nationality+ "</span>"
        +'<span id="sti_gender_'+field.std_studentid+'" hidden>' + field.sti_gender+ "</span>"
        ,
        // roomDet: '<span class="text-uppercase">' + field.clg_name + "</span>",
        nameStudent: '<span id="name_'+field.std_studentid+'" class="text-uppercase">' + field.sti_name + "</span>",
        stud_id: '<span class="text-uppercase">' + field.std_studentid + "</span>",
        stud_icNum: '<span id="icno_'+field.std_studentid+'"  class="text-uppercase">' + field.sti_icno + "</span>",
        sessIntake: '<span id="cur_intake_'+field.std_studentid+'" class="text-uppercase">' + field.cur_intake + "</span>",
        sessionStud: '<span class="text-uppercase">' + curYear+"</span>",
        calCat: '<span class="text-uppercase">' + field.category+"</span>",
        // sessionStud: '<span class="text-uppercase">' + field.sti_icno + "</span>",
        stud_fac: '<span class="text-uppercase">' + field.fac_name + "</span>",
        viewTranskrip: '<button class="btn btn-icon deep-orange-100" title="Details" onclick="viewTranscript(\'' + field.std_studentid + '\')"><i class="fa fa-file-pdf-o"></i></button>',
        upt_btn: '<button  '+disableCheck+'  class="btn btn-icon brown-400" title="Details" onclick="detStud(\'' + field.std_studentid + '\')"><i class="ion-ios-list-outline"></i></button>',
        // checkingAdm: `<div class="col-sm-10">
        //                 <div class="checkbox">
        //                   <label id="tool${field.std_studentid}" tooltip="${(field.perms_facGrad_verifier|| '')} ${format_dateReturn(field.perms_facGrad_verifyDate)}">
        //                     <input type="checkbox" onchange="checkingFacAdm('`+field.std_studentid+`')" id="checkingFacAdm_`+field.std_studentid+`" value="" ${disableCheckTrue} class="has-value">
        //                     Faculty Admin
        //                   </label>
        //                 </div>
        //               </div>`

        checkingAdm: `<div class="col-sm-10">
                        <div class="checkbox">
                          <label id="tool${field.std_studentid}" tooltip="${(field.perms_facGrad_verifier|| '')} ${format_dateReturn(field.perms_facGrad_verifyDate)}">
                            <input type="checkbox" onchange="checkingFacAdm('`+field.std_studentid+`')" id="checkingFacAdm_`+field.std_studentid+`" value="" ${disableCheckTrue} class="has-value">
                          </label>
                        </div>
                      </div>`
        
      });

      

    });

    $("#tableGraduationAudit").html("");
    $("#tableGraduationAudit").footable({
      columns: colums,
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
      sorting: {
        enabled: true
    }
  
  });

    $("#loading_modal_audit").modal('hide');


  });
      button = `<label for="" class="col-form-label" style="display: block; height: 35px;"></label>
      <button type="button" onclick="generateTable()" class="btn btn-info">
          <i class="fa fa-fw fa-filter"></i>Filter
      </button>
      <button id="" onclick="generateGradPDF('Graduation Audit', 'tableGraduationAudit')" class="btn md-raised green">
          <i class="fa fa-fw fa-pencil-square-o"></i>
          <strong>Download PDF</strong>
      </button>

      <button id="reloadButton" class="btn grey-200 text-info " onclick="location.reload()">
        <i class="fa fa-fw fa-refresh"></i>
        <strong>Clear</strong>
      </button>
      
      `;


    $('#btnPDF').html(button);
 


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

function detStud(studId){
  window.sessionStorage.std_studentid = studId;
  // window.location.replace("Admpljr_auditTmtPengajian.html");

  // $('#Admpljr_auditTmtPengajian').click(function(){
    // window.sessionStorage.content = "Admpljr_auditTmtPengajian";
    $('#content').load('Admpljr_auditTmtPengajian.html');
// });
}


function acaCalActive(returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmCalendar/listActive",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
    async:false
  };

  request = $.ajax(settings);
  request.done(function (response) {
    obj_kalendar = response;
    returnValue();
  });

  request.error(function (response) {
    logOut();
  });
}


// function generateGradPDF(name, idTable) {
  
//   $("#loading_modal_audit").modal('show');

//   setTimeout(() => {
//     // function generateGradPDF(name, idTable,  location, yearExam) {
//       window.jsPDF = window.jspdf.jsPDF; //nie pnting utk call jspdf pnya library
//       // Initialize jsPDF
//       var doc = new jsPDF('landscape');
//       var pageWidth = doc.internal.pageSize.width;
    
//       // Start adding content to the PDF
    
//       let fixtimeDate = (new Date().toLocaleString()).split(', ');
//       let fixTD = fixtimeDate[1] + ', ' + fixtimeDate[0];
      
//       // landscape
//       doc.setFontSize(7);
//       // doc.setFont("helvetica", "normal");
//       doc.setFont('helvetica');
    
//       doc.text(fixTD, 268, 3);
      
//       // Set the font for the entire document to Arial
//       // doc.setFont('Arial');
//       doc.setFont('helvetica');
    
//       var imgData = "../admin/images/LOGO-UCMI(Landscape).png";
    
//       // Add the image to the PDF
//       doc.addImage(imgData, 'JPEG', 110, 10, 69 , 25);
    
//       doc.setFontSize(10);
//       var text = "GRADUATION AUDIT";
//       var textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
//       var textX = (pageWidth - textWidth) / 2;
//       doc.text(text, textX, 40);
    
//       // Define the source element (your HTML table)
//       var source = $('#' + idTable)[0];
    
//       // Define the gap (adjust the value as needed)
//       var gap = 45; // Adjust this value to set the desired gap
    
//       // Generate the PDF from the table, starting with a gap
//       // Add styles option to set the font size for the table content
//       doc.autoTable({
//         html: source,
//         startY: gap,
//         styles: {
//           fontSize: 10, 
//           font: 'helvetica',// Set the desired font size for the table content
//         },
//       });
      
    
//       // Save or download the PDF
//       doc.save('Reporting_' + name + '.pdf');
//       // $("#loading_modal").modal('hide');
//       // console.log('Hiding modal...');
//     $("#loading_modal_audit").modal('hide');
//   }, 1);
  
// }


function slctIntake(returnValue) {
  let token = window.sessionStorage.token;
  var settings = {
    url: host + "api_tetapan_picoms/public/intake/list",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_intake = response;
    returnValue();
  });
}



function viewTranscript(studID) {
  studentIDCect = $('#matric_no').val(studID);

  $("#divListSemAT").html('');

  studentID = studID;
  listRowAT = [];

  let columns = [
    { "name": "ccode", "title": "CODE" },
    { "name": "cname", "title": "COURSE" },
    { "name": "attemp", "title": "ATTEMPT", "breakpoints": " sm xs" },
    { "name": "credit", "title": "CREDIT", "breakpoints": " sm xs" },
    { "name": "grade", "title": "GRADE", "breakpoints": " sm xs" },
    { "name": "gpa", "title": "GPA", "breakpoints": " sm xs" },
  ];

  let listCECT = [];

  let objTranscript = new get(host + 'api_pengurusan_pelajar/public/cect/listCourse/' + studentID, "picoms " + window.sessionStorage.token).execute();

  let sumCect = objTranscript.sumcect;
  if (sumCect) {
    $("#ATtct").html(sumCect);
  }
  else {
    $("#ATtct").html(0);
  }

  if (objTranscript.success) {

    $("#tableCect").html('<table class="table table-bordered table-striped m-b-none " data-sorting="true" id="list_cect"></table>');
    document.getElementById('printAcademicTranscript').classList.replace('buttonNoCect', 'hidden');

    $.each(objTranscript.data, function (i, field) {

      listCECT.push({
        ccode: '<span class="text-uppercase">' + field.crs_code + '</span>',
        cname: '<span class="text-uppercase">' + field.crs_name + '</span>',
        attemp: '<span class="text-uppercase">' + field.cect_type + '</span>',
        credit: field.crs_credit,
        grade: 'PASS',
        gpa: 'PASS',

        // grade: field.grade_pre,
        // gpa: field.grade_pre,
      });

      if (objTranscript.data.length == (i + 1)) {
        listCECT.push({
          ccode: '<b> CREDIT EARNED</b>',
          cname: '',
          attemp: '',
          credit: '<b>' + sumCect + '</b>',
          sts_cect: '-',
          gpa: '-',
        });
      }
    });

  }
  else {
    document.getElementById('printAcademicTranscriptCECT').classList.replace('buttonCect', 'hidden');

    listCECT = [];
    columns = [];
  }

  $("#list_cect").footable({
    "columns": columns,
    "rows": listCECT,
    "paging": {
      "enabled": false,
      "size": 10
    },
    "filtering": {
      "enabled": false,
      "placeholder": "Search...",
      "dropdownTitle": "Search for:"
    }

  });


  chkStdCurSemTranscipt(studentID, function () {

console.log($('#sti_gender_'+studentID).html());

  if ( $('#sti_gender_'+studentID).html() == 'P') {
    $('#ATgender').html('FEMALE');
  }
  else if ($('#sti_gender_'+studentID).html() == 'L') {
    $('#ATgender').html('MALE');
  }
  else {
    $('#ATgender').html('');
  }



  if ($('#sti_nationality_'+studentID).html() == 2) {
    $('#ATnationality').html('MALAYSIAN');
  }
  else {
    $('#ATnationality').html('NON-MALAYSIAN');
  }
  $('#ATic').html($('#icno_'+studentID).html());

  $('#ATstudID').html(studentID);
  let studIntake = $('#cur_intake_'+studentID).html();
  let yearStart = studIntake.split("-")[1];
  $('#ATyearStart').html(yearStart);
  // $("#ATstatusAcademic").html(data[indexs].status_academic);

  $('#ATProgram').html($('#pgm_name_'+studentID).html());
  $('#ATstudname').html($('#name_'+studentID).html());
  



    // $("#divListSemAT").html("");
    let rsb_typeList = ['CT', 'CE'];
    let formAttend = new FormData();
    formAttend.append('std_studentid', studentID);


    let tTc = 0;
    let totalTTC = 0;

    let sumtc = obj_stdCurSem.sumtc;
    let maxcGpa = obj_stdCurSem.maxcGpa;
    let maxSenate = obj_stdCurSem.maxSenate;

    $("#ATcgpa").html(maxcGpa);

    ATstatusAcademic = $("#ATstatusAcademic").html();
    // console.log(ATstatusAcademic);
    if (ATstatusAcademic == 8) {
      if (maxSenate != null || maxSenate != undefined) {
        $("#ATyearEnd").html(maxSenate.split('-')[0]);
      }
      $("#ATSenate").html(maxSenate);

    }
    else {
      $("#ATyearEnd").html('NOT GRADUATED YET');
      $("#ATSenate").html('-');
    }

    sumCect = $("#ATtct").html();


    $.each(obj_stdCurSem.data, function (i, item) {//
      totalTTC = totalTTC + (item.tc * 1);
      $("#ATgtc").html(totalTTC + (sumCect * 1));



      let gpa = item.std_gpa;
      let cgpa = item.std_cgpa;

      if (gpa == null) {
        gpa = "";
      }

      if (cgpa == null) {
        cgpa = "";
      }

      let boxList =
        '<li class="nav-item active" id="navLectDataAT'+item.fk_acaCal+'">' +
        '<a href="#" class="nav-link auto info">' +
        '<span class="pull-right text-muted m-r-xs">' +
        '<i class="fa fa-plus inline"></i>' +
        '<i class="fa fa-minus none"></i>' +
        "</span> Semester : " + item.std_semester + "</a>" +
        '<ul class="nav nav-sub text-sm">' +
        '<div class="row m-a-2">' +
        '<textarea class="hidden" id="dataListAT_' +
        item.fk_acaCal +
        '"></textarea><p>' +
        '<table id="crListAT_' + item.fk_acaCal + '" class="table table-striped"></table>' +
        "</div>" +
        "</ul>" +
        "</li>";

      $("#divListSemAT").append(boxList);

      listByActPolicy(studentID, item.fk_acaCal, item.cur_year, item.cal_cohort, function () {


        var columns = [
          // { name: "btn", title: "" },
          { name: "crs_code", title: "CODE" },
          { name: "crs_name", title: "COURSE" },
          { name: "rsb_type", title: "ATTEMPT", breakpoints: "md sm xs" },
          { name: "credit", title: "CREDIT", breakpoints: "md sm xs" },
          { name: "grade", title: "GRADE" },
          { name: "point", title: "GPA" },
        ];

        var list = [];
        totalCreditCount = 0;
        let convertList = JSON.stringify(obj_regCrs.data);
        $("#dataListAT_" + item.fk_acaCal).val(convertList);

        listRowAT.push({ fk_acaCal: item.fk_acaCal, studentID: studentID, data: obj_regCrs.data });
        var admin = window.sessionStorage.usrCatEadmin;

        obj_regCrs.data.forEach(async (itemJ, j) => {

          let btnDis = "";
          let attend = "";
          let info = "";
          if (itemJ.ip == "checked") {
            info = ` <span class="label warning">In Progress</span>`;
          }
          else if (itemJ.mrf == "checked") {
            info = ` <span class="label warning">MRAF</span>`;
          }

          if (itemJ.grade == "" && info == "") {

            if (admin === "1" || admin === 1) {
              btnDis = `<button onclick="drop('` + itemJ.rsb_id + `')" class="btn btn-icon btn-link text-danger"><i class="fa fa-minus-circle"></i></button>`;
            } else {
              btnDis = `<button onclick="drop('` + itemJ.rsb_id + `')" class="btn btn-icon btn-link text-danger" disabled><i class="fa fa-minus-circle"></i></button>`;
            }

          }
          else {
            let yearTaken = item.cur_year;
            let cal_cohort = item.cal_cohort;
            if (yearTaken.replace('/', '') >= "20222023") {
              if (cal_cohort < "3" && yearTaken.replace('/', '') == "20222023") {

              }
              else {
                attend = `<br><span class="label red">Not Attend</span>`;

                let objLectChecked = new get(host + 'api_lecturer_picoms/public/misLectCrsPrm/chkFinalExam/' + itemJ.fk_cotDet, 'picoms ' + window.sessionStorage.token).execute();

                if (objLectChecked.success) {
                  data_objLectChecked = objLectChecked.data;
                  final_examDisplay = data_objLectChecked.final_exam;

                }
                if (final_examDisplay != 'checked') {
                  attend = `<br><span class="label blue">No Final Exam</span>`;
                }


              }
            }
          }

          tMark = (itemJ.tMark)* 1;
          gradeStdFinalCheck = (itemJ.counted_cgpa === "Yes" ) ? itemJ.grade : (((tMark.toFixed(0)) >= 50) ? 'PASS' : 'Fail');
          pointStdFinalCheck = (itemJ.counted_cgpa === "Yes" ) ? itemJ.point : '';

          // console.log(itemJ);
          list.push({
            crs_code: '<span class="text-uppercase">' + itemJ.crsCode + "</span>",
            crs_name: '<span class="text-uppercase">' + itemJ.crs_name + "</span>",
            rsb_type: itemJ.rsb_type,
            credit: itemJ.crs_credit,
            grade: gradeStdFinalCheck + info,
            // grade: itemJ.grade + info,
            point: pointStdFinalCheck,
            // point: itemJ.point,
          });

          totalCreditCount += itemJ.crs_credit;


          // console.log(itemJ);
          if (obj_regCrs.data.length == (j + 1)) {


            list.push({
              crs_code: '<b>CREDIT EARNED<br>CUMULATIVE CREDIT</b>',
              crs_name: '',
              rsb_type: '',
              credit: totalCreditCount + '<br>' + '<p id="CummulativeCal_' + item.std_semester + '"></p>',
              grade: '<b>GPA<br>CGPA</b',
              point: '<b>' + gpa + '</b><br><b>' + cgpa + '</b>',
            });
          }

        });
        listCummulativeBySem.push({
          semStd: item.std_semester,
          acaCalStd: item.fk_acaCal,
          creditEachSem: totalCreditCount,
        })
        listCummulativeBySem.sort((a, b) => a.semStd - b.semStd);
        var tCummulative = 0;

        // Calculate the cumulative credits
        listCummulativeBySem.forEach(item => {
          tCummulative += item.creditEachSem;
          item.creditCummative = tCummulative;



        });

        // console.log(listCummulativeBySem[listCummulativeBySem.length - 1].creditCummative);
        $("#ATtce").html(listCummulativeBySem[listCummulativeBySem.length - 1].creditCummative);
        $("#crListAT_" + item.fk_acaCal).footable({
          columns: columns,
          rows: list,
          paging: {
            enabled: true,
            size: 10,
            countFormat: "Showing {PF} to {PL} of {TR} data",
          },
          filtering: {
            enabled: false,
            placeholder: "Search...",
            dropdownTitle: "Search for:",
          },
        });
        
        if (list<1) {
        $("#navLectDataAT"+item.fk_acaCal).addClass('hide');
          
        }

        listCummulativeBySem.forEach(item => {
          $('#CummulativeCal_' + item.semStd).html(item.creditCummative);
        });

      });

      listByActPolicyCE(studentID, function () {
        var columns = [
          { name: "crs_code", title: "Course Code" },
          { name: "rsb_type", title: "Type", breakpoints: "md sm xs" },
          { name: "creditSbject", title: "Credit", breakpoints: "md sm xs" },
          { name: "grade", title: "Grade" },
        ];

        let bil = 1;
        var list = [];
        let convertList = JSON.stringify(obj_regCrsCE.data);
        $("#dataListAT_" + item.fk_acaCal).val(convertList);

        listRowAT.push({ fk_acaCal: item.fk_acaCal, studentID: studentID, data: obj_regCrsCE.data });
        var admin = window.sessionStorage.usrCatEadmin;
        tCreditCE = 0;

        $.each(obj_regCrsCE.data, function (j, itemJ) {

          let btnDis = "";

          if (itemJ.grade == "") {

            if (admin === "1" || admin === 1) {
              btnDis = `<button onclick="drop('` + itemJ.rsb_id + `')" class="btn btn-icon btn-link text-danger"><i class="fa fa-minus-circle"></i></button>`;
            } else {
              btnDis = `<button onclick="drop('` + itemJ.rsb_id + `')" class="btn btn-icon btn-link text-danger" disabled><i class="fa fa-minus-circle"></i></button>`;
            }

          }

          tCreditCE += (itemJ.crs_credit * 1);
          list.push({
            crs_code:
              '<span class="text-uppercase">' +
              itemJ.crsCode +
              " - " +
              itemJ.crs_name +
              "</span>",
            rsb_type: itemJ.rsb_type,
            creditSbject: itemJ.crs_credit,
            grade: itemJ.grade,
          });
        });

        $("#listCEAT").html('');
        $("#listCEAT").footable({
          columns: columns,
          rows: list,
          paging: {
            enabled: true,
            size: 10,
            countFormat: "Showing {PF} to {PL} of {TR} data",
          },
          filtering: {
            enabled: false,
            placeholder: "Search...",
            dropdownTitle: "Search for:",
          },
        });
        $('#tCreditCEAT').html(`Total Credit: ` + tCreditCE);

      });

    });

  });
  $("#modalTranscriptMain").modal("show");
  // });
}



function chkStdCurSemTranscipt(id, returnValue) {
  var settings = {
    url: host + "api_pengurusan_pelajar/public/curAcademic/chkStdCurSemTranscipt/" + id,
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


function listByActPolicy(std, acaCal, curyear, cohort, returnValue) {
  var form = new FormData();
  form.append("std_studentid", std);
  form.append("aca_session", acaCal);
  form.append("cal_cohort", cohort);
  form.append("cur_year", curyear);

  var settings = {
    url: host + "api_pengurusan_pelajar/public/misStdRegsub/listByActPolicy4",
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



function listByActPolicyCE(std, returnValue) {
  var form = new FormData();
  form.append("std_studentid", std);

  var settings = {
    url: host + "api_pengurusan_pelajar/public/misStdRegsub/listByActPolicy4/CE_display",
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
    obj_regCrsCE = JSON.parse(response);
    returnValue();
  });
}





$("#printAcademicTranscriptCECT").on("click", function (e) {
  // window.open("../student/print_timetblExam.html");

  // $("#modalAcademicTranscript").modal("show");

  studentIDCect = $('#matric_no').val();
  // alert(studentIDCect);
  listRowAT = [];

  let columns = [
    { "name": "ccode", "title": "CODE" },
    // { "name": "bil_sem", "title": "SEM" },
    { "name": "cname", "title": "COURSE" },
    { "name": "attemp", "title": "ATTEMPT", "breakpoints": " sm xs" },
    { "name": "credit", "title": "CREDIT", "breakpoints": " sm xs" },
    { "name": "grade", "title": "GRADE", "breakpoints": " sm xs" },
    { "name": "gpa", "title": "GPA", "breakpoints": " sm xs" },
  ];

  let listCECT = [];

  let objTranscript = new get(host + 'api_pengurusan_pelajar/public/cect/listCourse/' + studentIDCect, "picoms " + window.sessionStorage.token).execute();

  let sumCect = objTranscript.sumcect;
  $("#ATtct").html(sumCect);

  if (objTranscript.success) {

    $("#tableCect").html('<table class="table table-bordered table-striped m-b-none " data-sorting="true" id="list_cect"></table>');
    document.getElementById('printAcademicTranscript').classList.replace('buttonNoCect', 'hidden');

    $.each(objTranscript.data, function (i, field) {
      if (i == 0) {
        listCECT.push({
          ccode: '<b>COURSE EXEMPTED</b>',
          cname: '',
          attemp: '',
          credit: '',
          grade: '',
          gpa: '',
        });
        listCECT.push({
          ccode: '<span class="text-uppercase">' + field.crs_code + '</span>',
          cname: '<span class="text-uppercase">' + field.crs_name + '</span>',
          attemp: '<span class="text-uppercase">' + field.cect_type + '</span>',
          credit: field.crs_credit,
          grade: 'PASS',
          gpa: 'PASS',
        });
      } else {
        listCECT.push({
          ccode: '<span class="text-uppercase">' + field.crs_code + '</span>',
          cname: '<span class="text-uppercase">' + field.crs_name + '</span>',
          attemp: '<span class="text-uppercase">' + field.cect_type + '</span>',
          credit: field.crs_credit,
          grade: 'PASS',
          gpa: 'PASS',
        });
      }

      if (objTranscript.data.length == (i + 1)) {
        listCECT.push({
          ccode: '',
          cname: '<b> CREDIT EARNED</b>',
          attemp: '',
          credit: '<b>' + sumCect + '</b>',
          sts_cect: '-',
          gpa: '-',
        });

        listCECT.push({
          ccode: '',
          cname: '',
          attemp: '',
          credit: '',
          sts_cect: '',
          gpa: '',
        });
      }
    });
  }
  else {
  }

  chkStdCurSemTranscipt(studentIDCect, function () {

    // $("#divListSemAT").html("");
    let rsb_typeList = ['CT', 'CE'];
    let formAttend = new FormData();
    formAttend.append('std_studentid', studentIDCect);


    let tTc = 0;
    let totalTTC = 0;

    let sumtc = obj_stdCurSem.sumtc;
    let maxcGpa = obj_stdCurSem.maxcGpa;

    $("#ATcgpa").html(maxcGpa);
    sumCect = $("#ATtct").html();


    $.each(obj_stdCurSem.data, function (i, item) {

      totalTTC = totalTTC + (item.tc * 1);
      $("#ATtce").html(totalTTC);
      $("#ATgtc").html(totalTTC + (sumCect * 1));

      let gpa = item.std_gpa;
      let cgpa = item.std_cgpa;

      if (gpa == null) {
        gpa = "";
      }

      if (cgpa == null) {
        cgpa = "";
      }

      listByActPolicy(studentID, item.fk_acaCal, item.cur_year, item.cal_cohort, function () {

        listRowAT.push({ fk_acaCal: item.fk_acaCal, studentID: studentID, data: obj_regCrs.data });
        var admin = window.sessionStorage.usrCatEadmin;

        let bil_sem = 0;
        // console.log(obj_regCrs.data);
        obj_regCrs.data.forEach(async (itemJ, j) => {
          // $.each(obj_regCrs.data,function(j,itemJ){
          let btnDis = "";
          let attend = "";
          let info = "";
          if (itemJ.ip == "checked") {
            info = ` <span class="label warning">In Progress</span>`;
          }
          else if (itemJ.mrf == "checked") {
            info = ` <span class="label warning">MRAF</span>`;
          }

          if (itemJ.grade == "" && info == "") {

            if (admin === "1" || admin === 1) {
              btnDis = `<button onclick="drop('` + itemJ.rsb_id + `')" class="btn btn-icon btn-link text-danger"><i class="fa fa-minus-circle"></i></button>`;
            } else {
              btnDis = `<button onclick="drop('` + itemJ.rsb_id + `')" class="btn btn-icon btn-link text-danger" disabled><i class="fa fa-minus-circle"></i></button>`;
            }

          }
          else {
            let yearTaken = item.cur_year;
            let cal_cohort = item.cal_cohort;
            if (yearTaken.replace('/', '') >= "20222023") {
              if (cal_cohort < "3" && yearTaken.replace('/', '') == "20222023") {

              }
              else {
                attend = `<br><span class="label red">Not Attend</span>`;

                let objLectChecked = new get(host + 'api_lecturer_picoms/public/misLectCrsPrm/chkFinalExam/' + itemJ.fk_cotDet, 'picoms ' + window.sessionStorage.token).execute();

                if (objLectChecked.success) {
                  data_objLectChecked = objLectChecked.data;
                  final_examDisplay = data_objLectChecked.final_exam;

                }
                if (final_examDisplay != 'checked') {
                  attend = `<br><span class="label blue">No Final Exam</span>`;
                }


              }
            }
          }
          tMark = (itemJ.tMark)* 1;
          gradeStdFinalCheck = (itemJ.counted_cgpa === "Yes" ) ? itemJ.grade : (((tMark.toFixed(0)) >= 50) ? 'PASS' : 'Fail');
          pointStdFinalCheck = (itemJ.counted_cgpa === "Yes" ) ? itemJ.point : '';

          if (j == 0) {
            bil_sem++;
            listCECT.push({
              bil_sem: item.std_semester + '' + bil_sem,
              ccode: '<b>SEMESTER </b>',
              cname: item.std_semester,
              attemp: '',
              credit: '',
              grade: '',
              gpa: '',
            });
            bil_sem++;
            listCECT.push({
              bil_sem: item.std_semester + '' + bil_sem,
              ccode: '<span class="text-uppercase">' + itemJ.crsCode + "</span>",
              cname: '<span class="text-uppercase">' + itemJ.crs_name + "</span>",
              attemp: itemJ.rsb_type,
              credit: itemJ.crs_credit,
              grade: gradeStdFinalCheck + info,
              gpa: pointStdFinalCheck,
            });
          } else {
            bil_sem++;
            listCECT.push({
              bil_sem: item.std_semester + '' + bil_sem,
              ccode: '<span class="text-uppercase">' + itemJ.crsCode + "</span>",
              cname: '<span class="text-uppercase">' + itemJ.crs_name + "</span>",
              attemp: itemJ.rsb_type,
              credit: itemJ.crs_credit,
              grade: gradeStdFinalCheck + info,
              gpa: pointStdFinalCheck,
            });
          }



          if (obj_regCrs.data.length == (j + 1)) {
            bil_sem++;
            listCECT.push({
              bil_sem: item.std_semester + '' + bil_sem,
              ccode: '',
              cname: '<b>CREDIT EARNED<br>CUMULATIVE CREDIT</b>',
              attemp: '',
              credit: item.tc + '<br>' + (tTc += (item.tc * 1)),
              grade: '<b>GPA<br>CGPA</b',
              gpa: '<b>' + gpa + '</b><br><b>' + cgpa + '</b>',
            });

            listCECT.push({
              bil_sem: item.std_semester + '' + bil_sem,
              ccode: '',
              cname: '',
              attemp: '',
              credit: '',
              grade: '',
              gpa: '',
            });
          }
        });


      });

    });

  });

  setTimeout(() => {

    listCECT.sort(compareBySemester);

    $("#testtable").on('footable_initialized', function () {
      generatePDFTranscript('Transcript', 'testtable');
    });

    $("#testtable").footable({
      "columns": columns,
      "rows": listCECT,
      "paging": {
        "enabled": false,
        "size": 10
      },
      "filtering": {
        "enabled": false,
        "placeholder": "Search...",
        "dropdownTitle": "Search for:"
      },
      "rowFormatter": function(row){
        $(row).addClass('dataPDF');
      }
    });
    generatePDFTranscript('Transcript', 'testtable');
  }, Math.random() * 2000);
});


function compareBySemester(a, b) {

  // nie utk check sma ada bil sem wujud atau x
  if (!a.bil_sem) return -1;
  if (!b.bil_sem) return 1;

  let [majorA, minorA] = a.bil_sem.split('.').map(Number);
  let [majorB, minorB] = b.bil_sem.split('.').map(Number);

  if (majorA !== majorB) {
    return majorA - majorB;
  }
  
  return minorA - minorB;
}



function generatePDFTranscript(name, idTable) {
  window.jsPDF = window.jspdf.jsPDF;
  var doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Create a gradient effect with three colors (purple, maroon, red) on the left side
  var gradientColors = ['#743d89', '#973d78', '#ac3869'];
  var gradientWidth = 1.4; // Width of each color segment
  var gradientHeight = doc.internal.pageSize.height;

  for (var i = 0; i < gradientColors.length; i++) {
    doc.setFillColor(gradientColors[i]);
    doc.rect(i * gradientWidth, 0, gradientWidth, gradientHeight, 'F');
  }

  var a4Width = 210;

  // Image dimensions
  var originalWidth = 275.59; // Replace with the actual width of your image
  var originalHeight = 67.818; // Replace with the actual height of your image

  // Calculate the new width and height (60% of A4 width while maintaining aspect ratio)
  var newWidth = 0.6 * a4Width;
  var newHeight = (newWidth / originalWidth) * originalHeight;

  // Calculate the X-coordinate to center the image on the A4 page
  var xCoordinate = (a4Width - newWidth) / 2;

  // Add the image to the document with the calculated width, height, and centered position
  doc.addImage("images/logo_reporting.png", "JPEG", xCoordinate, 5, newWidth, newHeight);

  doc.setFont("helvetica", "bold");
  var textCenterX = doc.internal.pageSize.width / 2;
  doc.setFontSize(10); // Set the font size to 14
  doc.text('ACADEMIC TRANSCRIPT', textCenterX, 40, { align: "center" });

  studName = $("#ATstudname").html();
  studID = $("#ATstudID").html();
  studGender = $("#ATgender").html();
  studProg = $("#ATProgram").html();

  studNationality = $("#ATnationality").html();
  studYearStart = $("#ATyearStart").html();
  // studYearEnd = $("#ATProgram").html();
  studIC = $("#ATic").html();
  // maxSenate = $("#ATyearEnd").html();
  // studSenate = $("#ATSenate").html();

  doc.setFontSize(6);

  doc.text('NAME', 10, 50);
  doc.text(':', 26, 50);
  doc.text(studName, 30, 50);

  doc.text('MATRIC NUMBER', 105, 50);
  doc.text(':', 127, 50);
  doc.text(studID, 131, 50);

  doc.text('GENDER', 10, 53);
  doc.text(':', 26, 53);
  doc.text(studGender, 30, 53);

  doc.text('PROGRAMME', 105, 53);
  doc.text(':', 127, 53);
  doc.text(studProg, 131, 53);

  doc.text('NATIONALITY', 10, 56);
  doc.text(':', 26, 56);
  doc.text(studNationality, 30, 56);

  doc.text('YEAR ENROLLED', 105, 56);
  doc.text(':', 127, 56);
  doc.text(studYearStart, 131, 56);

  doc.text('IC/PASSPORT', 10, 59);
  doc.text(':', 26, 59);
  doc.text(studIC, 30, 59);

  doc.text('YEAR COMPLETED', 105, 59);
  doc.text(':', 127, 59);
  doc.text('maxSenate', 131, 59);

  doc.setLineWidth(0.1);
  doc.line(10, 63, 200, 63); // horizontal line

  var source = $('#' + idTable)[0];

  console.log(source);
  
  // var rows = source.find('tr.dataPDF'); // Select all tr elements with the class 'dataPDF' within the table

  var rows = source.getElementsByTagName('tr');
  var rowCount = rows.length;
  // max line =33
  if (rowCount > 33) {
    var maxRowsPerColumn = Math.ceil(rowCount / 2); // Split rows into two columns
    ;

    var firstColumnHtml = extractTableData(0, maxRowsPerColumn);
    var secondColumnHtml = extractTableData(maxRowsPerColumn, rowCount);
    // console.log(firstColumnHtml)
    // console.log(secondColumnHtml)
    var startY = 65; // Starting Y position for the first table

    // console.log($(firstColumnHtml)[0]);
    doc.autoTable({
      html: $(firstColumnHtml)[0],
      startY: startY,
      margin: { left: 10, top: 15, right: 105 },
      theme: 'grid',
      styles: { fontSize: 5, fillColor: false, textColor: 0, lineWidth: 0, cellPadding: 1 }, // Add lineWidth for border
      headStyles: { fontStyle: 'bold' }, // Bold and border for header

      // head: [
      //   [{content: 'Perincian Jumlah Bayaran', colSpan: $(firstColumnHtml)[0].length, styles: {halign: 'center'}}] // Merge all cells in the head
      // ],
    });

    doc.autoTable({
      html: $(secondColumnHtml)[0],
      startY: startY,
      margin: { left: 110, top: 15, right: 10 },
      theme: 'grid',
      styles: { fontSize: 5, fillColor: false, textColor: 0, lineWidth: 0, cellPadding: 1 }, // Add lineWidth for border
      headStyles: { fontStyle: 'bold', fillColor: '#9c4298', textColor: 255, lineWidth: 0.1 }, // Bold and border for header
    });

  }

  else {

    var firstColumnHtml = extractTableData(0, rowCount);
    var startY = 65;

    doc.autoTable({
      html: $(firstColumnHtml)[0],
      startY: startY,
      margin: { left: 10, top: 15, right: 105 },
      theme: 'grid',
      styles: { fontSize: 5, fillColor: false, textColor: 0, lineWidth: 0 }, // Add lineWidth for border
      headStyles: { fontStyle: 'bold' }, // Bold and border for header

      // head: [
      //   [{content: 'Perincian Jumlah Bayaran', colSpan: $(firstColumnHtml)[0].length, styles: {halign: 'center'}}] // Merge all cells in the head
      // ],
    });
  }

  function extractTableData(startRow, endRow) {
    var tableHtml = '<table>';
    // tableHtml += rows[0].outerHTML; // Add header row
    for (var row = startRow; row < endRow; row++) {
      let rowStr = '';
      if (row == 0) {
        rowStr = rows[row].outerHTML.replace('table-cell;">', 'table-cell;"><b>').replace('</th>', '</b></th>');
        // rowStr = rows[row];
      } else {
        rowStr = rows[row].outerHTML;
      }

      tableHtml += rowStr;
      // tableHtml2 += rows[row].outerHTML;
    }
    tableHtml += '</table>';
    return tableHtml;
  }

  var text1 =
    ' \n' +
    'Total Credit Earned                    \n' +
    'Total Credit Transfer             \n' +
    // 'Grand Total Credit  \n' +
    'Cumulative Grade Point Average  \n' +
    ' \n';

  var doubledot =
    ' \n' +
    ': \n' +
    ': \n' +
    ': \n' +
    // ': \n' +
    ' \n';

  TotalCreditEarned = $("#ATtce").html();
  TotalCreditTransfer = $("#ATtct").html();
  // GrandTotalCredit = $("#ATgtc").html();
  CumulativeGradePointAverage = $("#ATcgpa").html();

  var studentCredit =
    ' \n' +
    TotalCreditEarned + ' \n' +
    TotalCreditTransfer + ' \n' +
    // GrandTotalCredit + ' \n' +
    CumulativeGradePointAverage + ' \n' +
    ' \n';

  var text2 = 'The above student has fulfilled all the requirements to be awarded\n' +
    'with ' + studProg + '\n' +
    ' \n' +
    'Endorsed by Senate on ' + 'studSenate' + '\n';
    // 'Endorsed by Senate on ' + studSenate + '\n';

  var registrar = '_________________________________________\n' +
    '                        REGISTRAR\n' +
    ' \n' +
    ' \n';

  var textYPosition = Math.max(doc.autoTable.previous.finalY, doc.autoTable.previous.finalY) + 5;

  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text(text1, 110, textYPosition);
  doc.text(doubledot, 160, textYPosition);
  doc.text(studentCredit, 170, textYPosition);

  doc.setFont("helvetica", "normal");
  doc.text(text2, 110, textYPosition + 15);
  doc.text(registrar, 20, textYPosition + 20);

  doc.save(studID + '_' + name + '.pdf');
}



function checkingFacAdm(std_id) { 


  dateCurrent = format_date();

  if ($('#checkingFacAdm_'+std_id).is(':checked')) {
    $('#checkingFacAdm_'+std_id).attr('value', 'true');

    let form = new FormData();
    form.append("std_studentid", std_id);
    form.append("perms_facGrad", 'Checked');
    form.append("perms_facGrad_verifier", window.sessionStorage.usrId);
    form.append("perms_facGrad_verifyDate", dateCurrent);
    
    obj = new post(host+ 'api_pengurusan_pelajar/public/auditBergraduatChecked', form,'picoms '+window.sessionStorage.token).execute();
    
    if (obj.success) {
      $('#tool'+std_id).attr('tooltip', window.sessionStorage.usrId + format_dateReturn(dateCurrent) );
   
      $('button[onclick="detStud(\'' + std_id + '\')"]').prop('disabled', false);

    } else {
      $('#tool'+std_id).attr('tooltip', '' );
      $('button[onclick="detStud(\'' + std_id + '\')"]').prop('disabled', true);
      
    }


    return;
  } else {
    $('#checkingFacAdm_'+std_id).attr('value', 'false');
    let form = new FormData();
    form.append("std_studentid", std_id);
    form.append("perms_facGrad", '');
    form.append("perms_facGrad_verifier", '');
    form.append("perms_facGrad_verifyDate", '');
    
    obj = new post(host+ 'api_pengurusan_pelajar/public/auditBergraduatChecked', form,'picoms '+window.sessionStorage.token).execute();
    if (obj.success) {
      $('#tool'+std_id).attr('tooltip', '' );

      $('button[onclick="detStud(\'' + std_id + '\')"]').prop('disabled', true);

    } else {
      $('button[onclick="detStud(\'' + std_id + '\')"]').prop('disabled', false);
      
    }

    return;

  }
  
 }


 function format_date()
{
  let date = new Date();
  if (typeof date == "string") {
    date = new Date(date);
  }

  // Extract date components
  const year = date.getFullYear();
  let month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  let day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;

  // Extract time components
  let hours = date.getHours().toString();
  hours = hours.length > 1 ? hours : '0' + hours;

  let minutes = date.getMinutes().toString();
  minutes = minutes.length > 1 ? minutes : '0' + minutes;

  let seconds = date.getSeconds().toString();
  seconds = seconds.length > 1 ? seconds : '0' + seconds;

  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;

}



function format_dateReturn(dateTimeString)
{
  if (dateTimeString == '' || null) {
    
  // Parse the input date string
  const date = new Date(dateTimeString);

  // Extract date components
  const year = date.getFullYear();
  const month = (1 + date.getMonth()).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  // Extract time components
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert hours to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const strHours = hours.toString().padStart(2, '0');

  // Format the date and time in the desired format
  const formattedDate = `${day}/${month}/${year}`;
  const formattedTime = `${strHours}:${minutes}:${seconds} ${ampm}`;

  return ` (${formattedDate} ${formattedTime})`;

  } else {
    return ``;

  }

}



$("#buttonHideTranscript").click(function () {
  // $(".modalTranscript").hide();
  $(".modalTranscript").modal('hide');
});



$("#printAcademicTranscript").on("click", function (e) {
  // window.open("../student/print_timetblExam.html");


  // $("#modalAcademicTranscript").modal("show");

  studentIDCect = $('#matric_no').val();
  // alert(studentIDCect);
  listRowAT = [];

  let columns = [
    { "name": "ccode", "title": "CODE" },
    // { "name": "bil_sem", "title": "SEM" },
    { "name": "cname", "title": "COURSE" },
    { "name": "attemp", "title": "ATTEMPT", "breakpoints": " sm xs" },
    { "name": "credit", "title": "CREDIT", "breakpoints": " sm xs" },
    { "name": "grade", "title": "GRADE", "breakpoints": " sm xs" },
    { "name": "gpa", "title": "GPA", "breakpoints": " sm xs" },
  ];

  let listCECT = [];

  let objTranscript = new get(host + 'api_pengurusan_pelajar/public/cect/listCourse/' + studentIDCect, "picoms " + window.sessionStorage.token).execute();

  let sumCect = objTranscript.sumcect;
  $("#ATtct").html(sumCect);


  chkStdCurSemTranscipt(studentIDCect, function () {

    // $("#divListSemAT").html("");
    let rsb_typeList = ['CT', 'CE'];
    let formAttend = new FormData();
    formAttend.append('std_studentid', studentIDCect);


    let tTc = 0;
    let totalTTC = 0;

    let sumtc = obj_stdCurSem.sumtc;
    let maxcGpa = obj_stdCurSem.maxcGpa;

    $("#ATcgpa").html(maxcGpa);
    sumCect = $("#ATtct").html();


    $.each(obj_stdCurSem.data, function (i, item) {

      totalTTC = totalTTC + (item.tc * 1);
      // $("#ATtce").html(totalTTC);
      $("#ATgtc").html(totalTTC + (sumCect * 1));

      let gpa = item.std_gpa;
      let cgpa = item.std_cgpa;

      if (gpa == null) {
        gpa = "";
      }

      if (cgpa == null) {
        cgpa = "";
      }

      listByActPolicy(studentID, item.fk_acaCal, item.cur_year, item.cal_cohort, function () {

        listRowAT.push({ fk_acaCal: item.fk_acaCal, studentID: studentID, data: obj_regCrs.data });
        var admin = window.sessionStorage.usrCatEadmin;

        let bil_sem = 0;
        obj_regCrs.data.forEach(async (itemJ, j) => {

          let btnDis = "";
          let attend = "";
          let info = "";
          if (itemJ.ip == "checked") {
            info = ` <span class="label warning">In Progress</span>`;
          }
          else if (itemJ.mrf == "checked") {
            info = ` <span class="label warning">MRAF</span>`;
          }

          if (itemJ.grade == "" && info == "") {

            if (admin === "1" || admin === 1) {
              btnDis = `<button onclick="drop('` + itemJ.rsb_id + `')" class="btn btn-icon btn-link text-danger"><i class="fa fa-minus-circle"></i></button>`;
            } else {
              btnDis = `<button onclick="drop('` + itemJ.rsb_id + `')" class="btn btn-icon btn-link text-danger" disabled><i class="fa fa-minus-circle"></i></button>`;
            }

          }
          else {
            let yearTaken = item.cur_year;
            let cal_cohort = item.cal_cohort;
            if (yearTaken.replace('/', '') >= "20222023") {
              if (cal_cohort < "3" && yearTaken.replace('/', '') == "20222023") {

              }
              else {
                attend = `<br><span class="label red">Not Attend</span>`;

                let objLectChecked = new get(host + 'api_lecturer_picoms/public/misLectCrsPrm/chkFinalExam/' + itemJ.fk_cotDet, 'picoms ' + window.sessionStorage.token).execute();

                if (objLectChecked.success) {
                  data_objLectChecked = objLectChecked.data;
                  final_examDisplay = data_objLectChecked.final_exam;

                }
                if (final_examDisplay != 'checked') {
                  attend = `<br><span class="label blue">No Final Exam</span>`;
                }
              }
            }
          }
          tMark = (itemJ.tMark)* 1;
          gradeStdFinalCheck = (itemJ.counted_cgpa === "Yes" ) ? itemJ.grade : (((tMark.toFixed(0)) >= 50) ? 'PASS' : 'Fail');
          pointStdFinalCheck = (itemJ.counted_cgpa === "Yes" ) ? itemJ.point : '';
          
          if (j == 0) {
            bil_sem++;
            listCECT.push({
              bil_sem: item.std_semester + '.' + bil_sem,
              ccode: '<b>SEMESTER </b>',
              cname: item.std_semester,
              attemp: '',
              credit: '',
              grade: '',
              gpa: '',
            });
            bil_sem++;
            listCECT.push({
              bil_sem: item.std_semester + '.' + bil_sem,
              ccode: '<span class="text-uppercase">' + itemJ.crsCode + "</span>",
              cname: '<span class="text-uppercase">' + itemJ.crs_name + "</span>",
              attemp: itemJ.rsb_type,
              credit: itemJ.crs_credit,
              grade: gradeStdFinalCheck + info,
              gpa: pointStdFinalCheck,
            });
    
          } else {
            bil_sem++;
            listCECT.push({
              bil_sem: item.std_semester + '.' + bil_sem,
              ccode: '<span class="text-uppercase">' + itemJ.crsCode + "</span>",
              cname: '<span class="text-uppercase">' + itemJ.crs_name + "</span>",
              attemp: itemJ.rsb_type,
              credit: itemJ.crs_credit,
              grade: gradeStdFinalCheck + info,
              gpa: pointStdFinalCheck,
            });
          }

          if (obj_regCrs.data.length == (j + 1)) {
            findStd = listCummulativeBySem.find(el => el.acaCalStd == item.fk_acaCal);

         
            if (findStd) {
              listCECT.push({
                bil_sem: item.std_semester + '.' + (bil_sem++),
                ccode: '',
                cname: '<b>CREDIT EARNED<br>CUMULATIVE CREDIT</b>',
                attemp: '',
                credit: findStd.creditEachSem + '<br>' + findStd.creditCummative,
                grade: '<b>GPA<br>CGPA</b>',
                gpa: '<b>' + gpa + '</b><br><b>' + cgpa + '</b>',
              });

              listCECT.push({
                bil_sem: item.std_semester + '.' + (bil_sem++),
                ccode: '',
                cname: '',
                attemp: '',
                credit: '',
                grade: '',
                gpa: '',
              });
            }


          }

        });


      });

    });

  });

  setTimeout(() => {
    listCECT.sort(compareBySemester);
    $("#testtable").on('footable_initialized', function () {
      generatePDFTranscript('Transcript', 'testtable');
    });


    $("#testtable").footable({
      "columns": columns,
      "rows": listCECT,
      "paging": {
        "enabled": false,
        "size": 10
      },
      "filtering": {
        "enabled": false,
        "placeholder": "Search...",
        "dropdownTitle": "Search for:"
      }

    });

    generatePDFTranscript('Transcript', 'testtable');

  }, Math.random() * 2000);

});