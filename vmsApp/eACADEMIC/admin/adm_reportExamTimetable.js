$(function () {
    $.ajaxSetup({
        cache: false
    });


    let getSession = window.sessionStorage.cal_year;
    let cal_cohort = window.sessionStorage.cal_cohort;


    $.fn.select2.defaults.set("theme", "bootstrap");

    // select session
    acaCalActive(function () {
        $('#aca_session').append('<option value="">- Choose Academic Session -</option>');
        let names = "";
        $.each(obj_kalendar.data, function (i, item) {
            let curyear = item.cur_year.replace('/', '');
            select = "";
            if (getSession == item.cur_year && cal_cohort == item.cal_cohort) {
                select = "selected";
            }
            if (names != curyear + '/' + item.cal_cohort) {
                names = curyear + '/' + item.cal_cohort;
                $('#aca_session').append('<option ' + select + ' value="' + item.cur_year + '" calSem="' + item.cal_cohort + '">' + curyear + '/' + item.cal_cohort + '</option>');
            }
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:'
        });
    });

    getFaculty(function () {
        $('#FK_faculty').append('<option value="">- Choose Faculty -</option>');
        $.each(obj_getFaculty.data, function (i, item) {
            $('#FK_faculty').append('<option value="' + item.pk_id + '">' + item.fac_name + `(` + item.fac_id + ')</option>');
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:'
        });
    })


    $('#generatePDF4').click(function() {
        // Your PDF generation logic goes here
        // For example, you can call a function to generate the PDF
        // generatePDF();
        // onclick="generatePDF4('List Student Exam Timetable', 'report_ExamTimeTableTabpdf')"
        
        let facName = $('#fac_name').val();
        let SessionAca = $('#academicSession').val();
        
        generatePDF4('Final Examination', 'cotListPDF', 'facName', 'SessionAca')
    });

});

var confirmed = false;

function generateTable() {
    let selectSession = $('#aca_session').val();
    let sem = $("#aca_session option:selected").attr("calSem");
    let aca_cal_category = $("#aca_cal_category").val();
    let FK_faculty = $("#FK_faculty").val();
    let calenderSem = $("#aca_session option:selected").text();
    let facName = $("#FK_faculty option:selected").text();
    // console.log($("#aca_session").text());
    $("#loading_mode").modal('show');

    if (facName=== '- Choose Faculty -') {
        facName= '';
    }else{facName= facName}

        listCrsReg(selectSession, sem, aca_cal_category, FK_faculty,   function () {
                    createTbl(obj_regCrs.data, calenderSem, facName);
                });



}
async function createTbl(data, calenderSem, FK_faculty) {


    var columns = [
        { "name": "bil", "title": "No." },
        { "name": "dateExam", "title": "DATE" },
        { "name": "fac_name", "title": "FACULTY" },
        { "name": "dateExamTime", "title": "TIME" },
        { "name": "crsCode", "title": "COURSE CODE" },
        { "name": "crsName", "title": "COURSE NAME", "width": "auto"},
        { "name": "crsTYpe", "title": "TYPE PAPER", "width": "auto"},
        { "name": "prog", "title": "PROGRAMME" },
        { "name": "inTake", "title": "INTAKE" },
        { "name": "sem", "title": "SEMESTER" },
        { "name": "LIC", "title": "LECTURER IN CHARGE" },
        { "name": "chiefInv", "title": "CHIEF INVIGILATOR", "breakpoints": "md sm xs" },
        { "name": "Inv", "title": "INVIGILATOR", "breakpoints": "md sm xs" },
        { "name": "totalStudent", "title": "TOTAL OF STUDENT", "breakpoints": "md sm xs" },
        { "name": "venue", "title": "VENUE", "breakpoints": "md sm xs" },
    ];

    let bil = 1;
    let convertList = JSON.stringify(data);
    $("#dataList").val(convertList);
    var list = [];

    await Promise.all(data.map(async (item) => {


        if (item.rsts_stdExam!== 'DEL' ) {

            
            let Session = item.cal_year != null && item.cal_year != '' ? item.cal_year.replace('/', '') + '/' + item.cal_cohort : '';
            // dateApplication_dummy = item.tbl_time_start !== null ? item.tbl_time_start : '-';
            // dateApplication_dummy = item.tbl_time_end !== null ? item.tbl_time_end : '-';
            dateExamTime = (item.tbl_time_start !== null ? item.tbl_time_start : '-') + ' - ' + (item.tbl_time_end !== null ? item.tbl_time_end : '-');

            let dateExam = formatDate(item.tbl_date_start);
            let fac_name = '<span class="text-uppercase"><b>' + item.fac_name + '</span>';
            // let dateExamTime = item.tbl_time_start + '-' + item.tbl_time_end;
            let crsCode = item.crs_code;
            let crsName = item.crs_name;
            let prog = item.pgm_name;
            let inTake = item.cur_intake.replace('-', '/');
            let LIC = item.personInCharge;
            let totalStudent = item.totalStudent;
            let venue = item.cen_id;
    
            let dataLect = item.invigilatorData;
            let dataPersonInCharge = item.personInCharge;
    
            let DataCInv; // Variable for chief: "Yes"
            let DataInv = [];  // Array for chief: "No"
            let DataPiC = [];  // Array for chief: "No"
    
            dataLect.forEach((item) => {
                if (item.chief === "Yes") {
                    DataCInv = item.emp_name;
                } else if (item.chief === "No") {
                    DataInv.push(item.emp_name);
                }
            });
          

            dataPersonInCharge.forEach((item) => {
                DataPiC.push(item.emp_name);

            });
            // if (item.tbl_date_start == (NULL || '') || item.tbl_time_start == (NULL || '') || item.paper_type == (NULL || '') ) {
                
            // }
            list.push({
                bil: bil++,
                dateExam: dateExam,
                fac_name: fac_name,
                dateExamTime: dateExamTime,
                crsCode:crsCode ,
                crsName:crsName ,
                crsTYpe: item.paper_type,
                prog:prog ,
                inTake:inTake ,
                sem: Session,
                LIC: DataPiC,
                chiefInv: DataCInv,
                Inv: DataInv,
                totalStudent: totalStudent,
                venue: venue,
            });
        }
        
       
    }));

    
    $("#cotListPDF").html('');
    $("#cotListPDF").footable({
        "columns": columns,
        "rows": list,
        "paging": {
            "enabled": false,
            "size": 10,
            "countFormat": "Showing {PF} to {PL} of {TR} data"
        },
        "width": 1000 // Set the desired width for the entire table
    });
    $("#loading_mode").modal('hide');

    $("#cotListPDF").css("display", "none");
    await generatePDF4('Final Examination', 'cotListPDF', FK_faculty, calenderSem);
}

// async function generatePDF4(name, idTable, facName, SessionAca) {
//     window.jsPDF = window.jspdf.jsPDF;

//     // Initialize jsPDF with landscape orientation and custom page size
//     var doc = new jsPDF({
//         orientation: 'landscape',
//         unit: 'in',
//         format: [16.53, 11.69]
//     });

//     // Start adding content to the PDF
//     doc.setFont('Arial');

//     var imgData = "../admin/images/LOGO-UCMI(Landscape).png";

//     // Add the image to the PDF
//     doc.addImage(imgData, 'JPEG', 5, 0.5, 5, 2); // Adjust position and size

//     doc.setFontSize(15);

//     var text = "VARIABLE MOVE SOLUTIONS";
//     doc.text(text, 5.3, 2.8); // Adjust position

//     text = "FINAL EXAMINATION ACADEMIC SESSION " + SessionAca;
//     doc.text(text, 5, 3.1); // Adjust position

//     text = facName;
//     doc.text(text, 6, 3.4); // Adjust position

//     // Define the source element (your HTML table)
//     var source = $('#' + idTable)[0];

//     // Define the gap (adjust the value as needed)
//     var gap = 4; // Adjust this value to set the desired gap

//     // Generate the PDF from the table, starting with a gap
//     await doc.autoTable({
//         html: source,
//         startY: gap,
//         styles: {
//             fontSize: 10,
//             font: 'Arial',
//         },
//         headStyles: {
//             fontSize: 12, // Set the desired font size for the table header
//             font: 'Arial',
//             fillColor: [211, 211, 211], // Light grey background color
//             textColor: [0, 0, 0], // Black text color
//             lineColor: [0, 0, 0], // Black outline color
//         },
//         bodyStyles: {
//             fontSize: 10, // Set the desired font size for the table content
//             font: 'Arial',
//         },
//     });

//     // Save or download the PDF
//     doc.save('Reporting_' + name + '.pdf');
// }
async function generatePDF4(name, idTable, facName, SessionAca) {
    // Load jsPDF library only if not already loaded
    if (!window.jsPDF) {
        window.jsPDF = window.jspdf.jsPDF;
    }

    // Initialize jsPDF with landscape orientation and custom page size
    var doc = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: [16.53, 11.69]
    });

    let fixtimeDate = (new Date().toLocaleString()).split(', ');
     let fixTD = fixtimeDate[1]+ ', '+fixtimeDate[0];

            // landscape
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");  
            doc.text(fixTD, 15.2, 0.2); 


    // Start adding content to the PDF
    // doc.setFont('Arial');

    // Add the image to the PDF (assuming image loading time is negligible)
    var imgData = "../admin/images/LOGO-UCMI(Landscape).png";
    doc.addImage(imgData, 'JPEG', 5, 0.5, 5, 2); // Adjust position and size

    doc.setFontSize(15);

    // Add text content to the PDF
    var text = "VARIABLE MOVE SOLUTIONS";
    doc.text(text, 5.3, 2.8); // Adjust position

    text = "FINAL EXAMINATION ACADEMIC SESSION " + SessionAca;
    doc.text(text, 5, 3.1); // Adjust position

    doc.text(facName, 6, 3.4); // Adjust position

    // Define the source element (your HTML table)
    var source = $('#' + idTable)[0];

    // Define the gap (adjust the value as needed)
    var gap = 4;

    // Generate the PDF from the table, starting with a gap
    await doc.autoTable({
        html: source,
        startY: gap,
        styles: {
            fontSize: 8,
            // font: 'Arial',
        },
        headStyles: {
            fontSize: 10,
            // font: 'Arial',
            fillColor: [211, 211, 211],
            textColor: [0, 0, 0],
            lineColor: [0, 0, 0],
        },
        bodyStyles: {
            fontSize: 8 ,
            // font: 'Arial',
        },
    });

    // Save or download the PDF
    doc.save('Reporting_' + name + '.pdf');
}
// function createTbl(data,calenderSem,FK_faculty) {
//     // console.log(data);
    
//     var columns = [
//         { "name": "bil", "title": "No." },
//         { "name": "dateExam", "title": "DATE" },
//         { "name": "fac_name", "title": "FACULTY" },
//         { "name": "dateExamTime", "title": "TIME" },
//         { "name": "crsCode", "title": "COURSE CODE" },
//         { "name": "crsName", "title": "COURSE NAME", "width": "auto"},
//         { "name": "crsTYpe", "title": "TYPE PAPER", "width": "auto"},
//         { "name": "prog", "title": "PROGRAMME" },
//         { "name": "inTake", "title": "INTAKE" },
//         { "name": "sem", "title": "SEMESTER" },
//         { "name": "LIC", "title": "LECTURER IN CHARGE" },
//         { "name": "chiefInv", "title": "CHIEF INVIGILATOR", "breakpoints": "md sm xs" },
//         { "name": "Inv", "title": "INVIGILATOR", "breakpoints": "md sm xs" },
//         { "name": "totalStudent", "title": "TOTAL OF STUDENT", "breakpoints": "md sm xs" },
//         { "name": "venue", "title": "VENUE", "breakpoints": "md sm xs" },
//     ];
//     let bil = 1;
//     let convertList = JSON.stringify(data);
//     $("#dataList").val(convertList);
//     var list = [];

//     $.each(data, function (i, item) {
//     // console.log(item);
//     if (item.cal_year != null && item.cal_year != '')
//     {
//         Session  = item.cal_year.replace('/', '') + '/' + item.cal_cohort;
//     }
//     else{
//         Session = '';
//     }

//     dateExam = formatDate(item.tbl_date_start);
//     fac_name = '<span class="text-uppercase"><b>' + item.fac_name + '</span>';
//     dateExamTime = item.tbl_time_start +`-`+item.tbl_time_end;
//     crsCode = item.crs_code;
//     crsName= item.crs_name;
//     prog = item.pgm_name;
//     inTake = item.cur_intake.replace('-','/');
//     LIC =  item.personInCharge;
//     totalStudent = item.totalStudent;
//     venue = item.fk_venue;

//     dataLect = item.invigilatorData;

//     var DataCInv; // Variable for chief: "Yes"
//     var DataInv = [];  // Array for chief: "No"
  
// //     let objInvi = new get(host+'api_exam_picoms/public/misExamInvgltr/CheckInvigilator/'+item.fk_exam+`/`+item.pk_venue,'picoms '+window.sessionStorage.token).execute()
// // if (objInvi.success) {

// //     let listinvi = objInvi.data;
// //     for (var i = 0; i < listinvi.length; i++) {
// //         var item_invi = listinvi[i];
// //         if (item_invi.chief === "Yes") {
// //     // console.log(item_invi);

// //             DataCInv =  item_invi.emp_name;
// //           // You can perform additional actions here for items where chief is "Yes"
// //         }
// //         if (item.chief === "No") {
// //             DataInv.push(item_invi.emp_name);
// //             // Additional actions for items where chief is "No"
// //           }
// //       }
    
// // } else {
    
// // }
//     for (var i = 0; i < dataLect.length; i++) {
//         var item = dataLect[i];
//         if (item.chief === "Yes") {
//             DataCInv =  item.emp_name;
//           // You can perform additional actions here for items where chief is "Yes"
//         }
//         if (item.chief === "No") {
//             DataInv.push(item.emp_name);
//             // Additional actions for items where chief is "No"
//           }
//       }
//             list.push({
//                 bil: bil++,
//                 dateExam: dateExam,
//                 fac_name: fac_name,
//                 dateExamTime: dateExamTime,
//                 crsCode: crsCode,
//                 crsName: crsName,
//                 crsTYpe: item.paper_type,
//                 prog: prog,
//                 inTake: inTake,
//                 sem: Session,
//                 LIC: LIC,
//                 // chiefInv: item.fk_exam+`/`+item.cam_id,
//                 // Inv: item.fk_exam+`/`+item.cam_id,
//                 chiefInv: DataCInv,
//                 Inv: DataInv,
//                 totalStudent: totalStudent,
//                 venue: item.cen_id,
            
//             });
      

//     });
       
//         $("#cotListPDF").html('');
//         $("#cotListPDF").footable({
//             "columns": columns,
//             "rows": list,
//             "paging": {
//                 "enabled": false,
//                 "size": 10,
//                 "countFormat": "Showing {PF} to {PL} of {TR} data"
//             },
//             "width": 1000 // Set the desired width for the entire table

         
//         });
//         $("#cotListPDF").css("display", "none");
//         generatePDF4('Final Examination', 'cotListPDF', FK_faculty, calenderSem)


// }

function mdlReport(FK_aka_acaSession, FKcrs, fac_name , academicSession) {



    // <input type="hidden" id="fac_name">
    // <input type="hidden" id="academicSession">

    $('#academicSession').val(academicSession);
    $('#fac_name').val(fac_name);

    let aca_session = FK_aka_acaSession;
    let crs_code = FKcrs;

    let formListStd = new FormData();

    formListStd.append('crs_code', crs_code);
    formListStd.append('aca_session', aca_session);

    let objListStudent = new post(host + 'api_pengurusan_pelajar/public/misStdRegsub/list/listStdByTimetableExam', formListStd, "picoms " + window.sessionStorage.token).execute();
    if (objListStudent.success) {

        // console.log(objListStudent);
        var columns = [
            { "name": "bil", "title": "Bil.", },
            { "name": "stdDet", "title": "Details Student", "style": "text-align:center;" },
            // { "name": "gender", "title": "Gender", "style": "text-align:center;" },
            { "name": "pgm_name", "title": "Programme Name", "style": "text-align:center;" },
            { "name": "cur_intake", "title": "Intake", "style": "text-align:center;", "breakpoints": "md sm xs" },
            // { "name": "prog_kat", "title": "Programme Category" },
            // { "name": "date_apply", "title": "Date Application" },
            // { "name": "prog_status", "title": "Status" },
            // { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },

        ];

        let bil = 1;
        let convertList = JSON.stringify(objListStudent.data);
        $("#dataList").val(convertList);
        var list = [];
        //    gender = field.sti_gender !== null ? field.dateApplication : '-';


        $.each(objListStudent.data, function (i, field) {
            console.log(field);
            if (field.sti_gender == 'P') {
                gender = 'Female'
            } else if (field.sti_gender == 'L') {
                gender = 'Male'

            } else {
                gender = '-'

            }

            list.push({
                bil: bil++,
                stdDet: field.sti_name,
                // gender: gender,
                pgm_name: field.pgm_name,
                cur_intake: field.cur_intake,
                // std_year: field.std_year,
                // std_cgpa: field.std_cgpa,
                // std_transcript:
                //   '<a class="label success" href="' +
                //   host +
                //   "api_pengurusan_pelajar/public/academic_cur/" +
                //   field.std_transcript +
                //   '" m-b" target="_blank">Document</a>',
                // upt_btn:
                //   "<a onclick=\"load_acaHistory('" +
                //   field.pk_id +
                //   '\')" class="btn btn-icon btn-info"><i class="fa fa-bars"></i></a>',
            });
        });

        $("#report_ExamTimeTableTab").footable({
            columns: columns,
            rows: list,
            paging: {
                enabled: true,
                size: 10,
            },
            filtering: {
                enabled: true,
                placeholder: "Search...",
                dropdownTitle: "Search for:",
            },
        });

        $("#report_ExamTimeTableTabpdf").footable({
            columns: columns,
            rows: list,
            paging: {
                enabled: false,
                //   size: 10,
            },

        });

        $("#report_ExamTimeTableTabpdf").css("display", "none");

    }
    else { }





    // Show the modal
    $('#mdl_reportExamTimeTable').modal('show');

}
function listCrsReg(year, sem, aca_cal_category, FK_fac, returnValue) {
    var form = new FormData();
    form.append('cur_year', year);
    form.append('cal_cohort', sem);

    form.append('aca_cal_category', aca_cal_category);
    form.append('FK_fac', FK_fac);

    obj = new post(host + 'api_pengurusan_pelajar/public/misStdRegsub/reporting/listCalYearSem',form,'picoms ' + window.sessionStorage.token).execute();

    if (obj.success) {
        obj_regCrs = obj;
        console.log(obj_regCrs);

        returnValue();
    }else{
        alert('Fail Generated PDF');
    $("#loading_mode").modal('hide');

    }
    // var settings = {
    //     "url": host + "api_pengurusan_pelajar/public/misStdRegsub/reporting/listCalYearSem",
    //     "method": "POST",
    //     "timeout": 0,
    //     "headers": {
    //         "Authorization": "picoms " + window.sessionStorage.token
    //     },
    //     "processData": false,
    //     "mimeType": "multipart/form-data",
    //     "contentType": false,
    //     "data": form,
    // };

    // $.ajax(settings).done(function (response) {
    //     obj_regCrs = JSON.parse(response);
    //     // console.log(obj_regCrs);
    //     returnValue();
    // });
}