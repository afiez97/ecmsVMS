var mergedArray = [];
var dataStdDet = [];
$(function () {
    $.ajaxSetup({
        cache: false
    });

    // $("#loading_modal").modal('show');

    let student_id = window.sessionStorage.std_studentid;
    $("#stu_id").html(student_id);

    


    
    student_info(student_id, function () {

        let dataStd = obj_stdInfo.data;
        // console.log(dataStd);
        let session = dataStd.sti_session_id.replace('-', '/');
        $('#sti_icno').html(dataStd.sti_icno);
        $("#stdName").html(dataStd.sti_name);
        $("#progName").html(dataStd.pgm_name);
        $('#sti_session_id').html(session);
        $('#pgm_status').html(dataStd.pgm_status);
        $('#statusAcademic').val(dataStd.status_academic);

        let isActive = true;

        // $('#GStatus').val(dataStd.status_academic);
        if (dataStd.status_academic === 8) {
            $('#GStatus').prop('checked', true);
        } else {
            $('#GStatus').prop('checked', false);
        }
        

        

        latestCGPAuditAdm(student_id)
        progShow(dataStd.pgm_fk, function () {
            $('#fac_name').html(obj_progShow.data.fac_name);

            // var StudFac = {
            //     'fac_name': obj_progShow.data.fac_name,
            // };
            // dataStdDet.push(StudFac);
    
        });
        
        // get pgm_det_id
        getPgmDet(dataStd.pgm_fk, session, dataStd.cur_intake, function () {
            // list course for programme
            auditCourse(obj_getId.dtp_id, student_id, function () {
                let columns = [
                    { "name": "bil", "title": "No." },
                    { "name": "code_subject", "title": "Code" },
                    { "name": "crs_name", "title": "Course" },
                    { "name": "cot_semester", "title": "Expected Sem", "style": "text-align: center" },
                    { "name": "taken_semester", "title": "Taken Sem", "style": "text-align: center" },
                    { "name": "crs_credit", "title": "Credit Hour", "style": "text-align: center" },
                    { "name": "cur_year", "title": "Academic Session" },
                    { "name": "status", "title": "Status / Grade" }
                ];

                let bil = 1;
                let list_data = [];
                var totalCreditAutit = 0;

                // console.log(obj_cotDetList.data);

                $.each(mergedData, function (i, item) {
                    let rs_curYear = '';
                    let rs_status = '';

                    rs_curYear = item.cur_year;

                    chkStatusRegCrs(student_id, item.fk_course, function () {
                        let count = obj_regCrs.data.length;
                        if (count != 0) {
                            $.each(obj_regCrs.data, function (j, itemJ) {
                                rs_status = itemJ.rsb_status;
                                // rs_curYear = itemJ.cur_year;
                                // console.log(itemJ);
                            });
                        }
                    });

                    // console.log(item.cal_cohort);


                    if (item.grade !== null && item.grade !== '') {
                        label = `<span class="">`+item.grade+`</span>`;
                        // label = `<span class="">N/A</span>`;
                        // label = `<span class="">` + item.grade + `</span>`;
                        let b = parseInt(item.crs_credit);
                        totalCreditAutit += b;

                    } else {
                        label = '<span class="label primary text-uppercase">Register</span>';
                    }

                    
                    list_data.push({
                        bil: bil++,
                        code_subject: '<span class="text-uppercase">' + (item.codecrs||'') + '</span>',
                        crs_name: '<span class="text-uppercase">' + (item.crs_name||'') + '</span>',
                        cot_semester: item.expected_sem,
                        taken_semester : item.taken_semester,
                        crs_credit: item.crs_credit,
                        cur_year: rs_curYear.replace('/', '') + `/` + item.cal_cohort,
                        status: label
                    });

                });

                $('#totalCreditAutit').html(totalCreditAutit);

                

                
                // setTimeout(() => {
                //     var StudtotalCreditAutit = {
                //         'totalCreditAutit': totalCreditAutit,
                //     };
                //     dataStdDet.push(StudtotalCreditAutit);
                // }, Math.random() * 1000);


                $("#tblCourse").footable({
                    "columns": columns,
                    "rows": list_data,
                    "paging": {
                        "enabled": false,
                        "size": 10
                    }
                });

                $("#loading_modal").modal('hide');
            });
        });
    });
});

function progShow(id, returnValue) {
    var settings = {
        "url": host + "api_tetapan_picoms/public/misPrmProg/show/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_progShow = response;
        returnValue();
    });
}

function progCourse(id, returnValue) {
    var settings = {
        "url": host + "api_tetapan_picoms/public/misPrmCrsCOTDet/listCourse/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_cotDetList = response;
        returnValue();
    });
}
function auditCourse(id, student_id, returnValue) {
    var settings = {
        "url": host + "api_tetapan_picoms/public/misPrmCrsCOTDet/auditCourse/" + id + '/' + student_id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_cotDetList = response;
         mergedData = mergeData(obj_cotDetList);

        returnValue();
    });
}
function latestCGPAuditAdm(student_id) {

    let obj = new get(host +  "api_pengurusan_pelajar/public/curAcademic/student/latestCGPAudit/" + student_id,'picoms '+window.sessionStorage.token).execute();
    if (obj.success) {
        // console.log(obj)
        obj_latestCGPAudit = obj.data;
        console.log(obj_latestCGPAudit.pgm_duration);
        $('#yrsOfstudy').html(obj_latestCGPAudit.pgm_duration);
        // $('#yrsOfstudy').html(obj_latestCGPAudit.duration_std);
        $('#gpaStudent').html(obj_latestCGPAudit.std_gpa);
        $('#CGPAStudent').html(obj_latestCGPAudit.std_cgpa);
    }
    else{
        $("#loading_modal").modal('hide');
        let bil = '';
        let list_data = [];

        let columns = [
            { "name": "bil", "title": "No." },
            { "name": "code_subject", "title": "Code" },
            { "name": "crs_name", "title": "Course" },
            { "name": "cot_semester", "title": "Expected Sem", "style": "text-align: center" },
            { "name": "taken_semester", "title": "Taken Sem", "style": "text-align: center" },
            { "name": "crs_credit", "title": "Credit Hour", "style": "text-align: center" },
            { "name": "cur_year", "title": "Academic Session" },
            { "name": "status", "title": "Status / Grade" }
        ];

       
        
        $("#tblCourse").footable({
            "columns": columns,
            "rows": list_data,
            "paging": {
                "enabled": false,
                "size": 10
            },
            "empty": "No data available" // Custom message to display when there are no rows
        });
    }
}
function getPgmDet(id, year, intake, returnValue) {
    var form = new FormData();
    form.append("pgm_id", id);
    form.append("dtp_year", year);
    form.append("dtp_intake", intake);

    var settings = {
        "url": host + "api_tetapan_picoms/public/misPrmProgDet/findPkId",
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
        let result = JSON.parse(response);
        obj_getId = result.data;
        returnValue();
    });
}


setTimeout(() => {

    

    btnGrad = `<button class="btn green-200 m-a m-t" onclick="generatePDFGrad('tblCourse')" style="position: absolute; right: 0;">
                <i class="fa fa-print"></i> Print
            </button>`;


    // btnGrad = '<button class="btn green-200 m-a m-t" onclick="generatePDFGrad(\'tblCourse\', \'' + dataStdDetS + '\')" style="position: absolute; right: 0;">' +
    //         '<i class="fa fa-print"></i> Print' +
    //     '</button>';

    $("#btnPrintGrad").html(btnGrad);

    // resolve();
}, Math.random() * 1000);


function generatePDFGrad(idTable) {
    window.jsPDF = window.jspdf.jsPDF; //nie pnting utk call jspdf pnya library

    // var stiName = data[0].sti_name;
    var stiName = $("#stdName").html();
    var sti_id = $("#stu_id").html();
    var sti_icno = $("#sti_icno").html();
    var progName = $("#progName").html();
    var reg_stat = $("#pgm_status").html();
    var reg_sess = $("#sti_session_id").html();

    var yrsOfstudy = $('#yrsOfstudy').html();
    var gpaStudent = $('#gpaStudent').html();
    var CGPAStudent = $('#CGPAStudent').html();

    var fac_name = $('#fac_name').html();
    
    var totalCreditAutit = $('#totalCreditAutit').html();

    // var totalCreditAutit = data[3].totalCreditAutit;

    
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
    var originalWidth = 690; // Replace with the actual width of your image
    var originalHeight = 252.7; // Replace with the actual height of your image

    // Define the new width and height you desire
    var desiredWidth = 100 * 0.7; // Replace with your desired width
    var desiredHeight = 50 * 0.7 ; // Replace with your desired height

    // Calculate the new width and height while maintaining aspect ratio
    var aspectRatio = originalWidth / originalHeight;
    var newWidth, newHeight;

    if (desiredWidth / desiredHeight > aspectRatio) {
        newWidth = desiredHeight * aspectRatio;
        newHeight = desiredHeight;
    } else {
        newWidth = desiredWidth;
        newHeight = desiredWidth / aspectRatio;
    }

    // Calculate the X-coordinate to center the image on the A4 page
    var xCoordinate = (a4Width - newWidth) / 2;

    // Add the image to the document with the calculated width, height, and centered position
    doc.addImage("images/LOGO-UCMI(Landscape).png", "JPEG", xCoordinate, 10, newWidth, newHeight);


    doc.setFont("helvetica", "bold");
    var textCenterX = doc.internal.pageSize.width / 2;
    doc.setFontSize(14); // Set the font size to 10
    doc.text('VARIABLE MOVE SOLUTIONS ', textCenterX, 40, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13); // Set the font size to 8
    var textCenterX = doc.internal.pageSize.width / 2;
    doc.text('GRADUATION AUDIT', textCenterX, 48, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.text('Name', 14, 60);
    doc.text(':', 55, 60);
    doc.text(stiName.toUpperCase(), 65, 60);

    doc.text('Student ID', 14, 65);
    doc.text(':', 55, 65);
    doc.text(sti_id.toUpperCase(), 65, 65);

    doc.text('MyKad/Passport', 14, 70);
    doc.text(':', 55, 70);
    doc.text(sti_icno.toUpperCase(), 65, 70);

    doc.text('Programme', 14, 75);
    doc.text(':', 55, 75);
    doc.text(progName.toUpperCase(), 65, 75);

    doc.text('Faculty', 14, 80);
    doc.text(':', 55, 80);
    doc.text(fac_name.toUpperCase(), 65, 80);

    doc.text('Registration Status', 14, 85);
    doc.text(':', 55, 85);
    doc.text(reg_stat.toUpperCase(), 65, 85);

    doc.text('Registration Session', 14, 90);
    doc.text(':', 55, 90);
    doc.text(reg_sess.toUpperCase(), 65, 90);

    doc.text('Years of Study', 14, 95);
    doc.text(':', 55, 95);
    doc.text(yrsOfstudy, 65, 95);

    doc.text('Current GPA', 14, 100);
    doc.text(':', 55, 95);
    doc.text(gpaStudent, 65, 100);

    doc.text('Current CGPA', 14, 105);
    doc.text(':', 55, 105);
    doc.text(CGPAStudent, 65, 105);

    doc.text('Total Credit', 14, 110);
    doc.text(':', 55, 110);
    doc.text(totalCreditAutit, 65, 110);



    var source = $('#' + idTable)[0];

    // Generate the PDF from the table, starting below the text
    doc.autoTable({
        html: source,
        startY: 120, // Adjusted start position below the text
        margin: { top: 20 },
        theme: 'grid',
        styles: { fillColor: false, textColor: 0 },
        headerStyles: { fillColor: '#9c4298', textColor: 255 },
    });
    doc.addImage("images/footer_reporting.png", "JPEG", 6, 276, 200, 20);

    // Save or download the PDF
    doc.save('Graduation_Audit_' + sti_id + '.pdf');
    // doc.save('Reporting_change_hostel.pdf');
}

$('#btnBack').click(function(){
    window.location.replace('adminPage.html');
});


// Attach click event listener to the checkbox
$('#GStatus').on('change', function() {
    let isChecked = $(this).prop('checked'); // Check if the checkbox is checked
    let std_studentid = $("#stu_id").html();// Get the student ID from data attribute
    let status_academic = $('#statusAcademic').val; // Get the status ID from data attribute
    

    if (status_academic = 1)
    {
        statusChange = 8;
    }    
    else if (status_academic = 8){
        statusChange = 1
    }

    let form = new FormData();
    form.append('std_studentid',std_studentid);
    form.append('status_academic',statusChange);
    let obj = new post(host + "api_pengurusan_pelajar/public/misStdInfo/updateStatus",form,'picoms '+window.sessionStorage.token).execute();
    if(obj.success){
        swal("Update Student Academic Status Success", "Student Academic Status", "success");
    }
    else{
        
    }
});


function mergeData(data) {

    dataExpectedCrs = data.dataExpectedCrs;
    dataStdCurr = data.dataStdCurr;


    dataExpectedCrs.forEach(function(expectedCrs) {
        var match = dataStdCurr.find(function(stdCurr) {
            return expectedCrs.crs_code == stdCurr.codecrs;
            // (expectedCrs.ccd_id).toString() === stdCurr.fk_cotDet && 
            
        });

        if (match) {

            var mergedEntry = {
                ccd_id: expectedCrs.ccd_id,
                fk_course: expectedCrs.fk_course,
                pk_id: expectedCrs.pk_id,
                crs_code: expectedCrs.crs_code,
                expected_sem: expectedCrs.expected_sem,
                rsb_id: match.rsb_id,
                std_studentid: match.std_studentid,
                rsb_type: match.rsb_type,
                rsb_status: match.rsb_status,
                barr_status: match.barr_status,
                fk_cotDet: match.fk_cotDet,
                grade: match.grade,
                codecrs: match.codecrs,
                fac_id: match.fac_id,
                crs_name: match.crs_name,
                crs_status: match.crs_status,
                crs_credit: match.crs_credit,
                counted_cgpa: match.counted_cgpa,
                cam_id: match.cam_id,
                fac_name: match.fac_name,
                cal_id: match.cal_id,
                cur_year: match.cur_year,
                cal_cohort: match.cal_cohort,
                cal_category: match.cal_category,
                cal_status: match.cal_status,
                taken_semester: match.taken_semester,
                fk_acaCal: match.fk_acaCal
            };
            mergedArray.push(mergedEntry);
        }
    });

    return mergedArray;
}