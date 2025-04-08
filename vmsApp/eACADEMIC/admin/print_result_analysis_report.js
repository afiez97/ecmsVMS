$(function () {
    $.ajaxSetup({
        cache: false
    });

    let id = window.sessionStorage.lectCrsId;
    let usrId = window.sessionStorage.usrId;
    usrId = usrId.toUpperCase();
    let lectId = window.sessionStorage.lectId;
    lectId = lectId.toUpperCase();
    let yearTaken = window.sessionStorage.yearTaken;
    let cal_cohort = window.sessionStorage.cal_cohort;
    let fk_aca_cal = window.sessionStorage.fk_aca_cal;

    let crsCode = "";
    var fixtimeDate = (new Date().toLocaleString()).split(', ');
    var fixTD = fixtimeDate[1] + ', ' + fixtimeDate[0]; let token = window.sessionStorage.token;


    //KLUARKAN DATA DET
    var formshowDet = new FormData();
    formshowDet.append("year", yearTaken);
    formshowDet.append("cal_cohort", cal_cohort);
    formshowDet.append("category", window.sessionStorage.category);
    formshowDet.append("pgm_id", getUrlVars()['pgmCode']);
    formshowDet.append("fk_course", window.sessionStorage.pk_crs);
    objshowDet = new post(host + "api_tetapan_picoms/public/misPrmCalendar/detCourse", formshowDet, 'picoms ' + token).execute();
    if (objshowDet.success) {
        results = objshowDet.data;
        results = Array.isArray(results) ? results : [results];

        var courseNames = new Set();
        var courseCodes = new Set();
        var programSemesters = new Set();
        var programCodes = new Set();
        var programNames = new Set();

        results.forEach(function (result) {
            courseNames.add(result.crs_name);
            courseCodes.add(result.crs_code);
            programSemesters.add(result.pgm_semester);
            programCodes.add(result.pgm_code);
            programNames.add(result.pgm_name);
        });

        // $('#courseCode').html(Array.from(courseCodes).join("<br>"));
        // $('#fk_nameCourse').html(Array.from(courseNames).join("<br>"));
        $('#semCurrent').html(Array.from(programSemesters).join("<br>"));
        $('#fk_nameProg').html(Array.from(programNames).join("<br>"));
    }
    // else {

    // }
    //END KLUARKAN DATA DET

    var doc = new jsPDF();

    if (token == null) {
        window.close();
    }
    else {
        $("#loading_mode").modal('show');

        setTimeout(() => {
            let obj = new get(host + "api_lecturer_picoms/public/misLectCrsPrm/show/" + id, 'picoms ' + token).execute();
            if (obj.success) {
                
                let data = obj.data;

                $('#fk_fac').html(data.fac_name);
                // $('#fk_nameProg').html(data.pgm_name);
                $('#intakeGroup').html(data.dtp_intake);
                $('#crsName').html(data.crs_name);
                $('#crc_code').html(data.crsCode);
                // $('#semCurrent').html(data.fac_name);
                $('#fk_chiefExam').html(data.emp_name);
                // $('#dateTimeExam').html(data.fac_name);
                // $('#TimeOE').html(data.fac_name);
                // $('#examVenue').html(data.fac_name);
                // $('#dateMarksKeyed').html(data.fac_name);
                // $('#totalStd').html(data.fac_name);
                // $('#noOfstdAtt').html(data.fac_name);
                // $('#noAbsent').html(data.fac_name);
                crsCode = data.crsCode;

                // detExam = [];
                finaltextOE ='', finaltextDate ='', finalvenueExam ='';
                $.each(data.timetable, function (i, fieldCrsCode) {
             
                    console.log(data);


                    textTimeOE = `Paper `+fieldCrsCode.tbl_paper_type+`: `+fieldCrsCode.tbl_time_start+` - `+fieldCrsCode.tbl_time_end+`  </br>`;
                    textTimeDate = `Paper `+fieldCrsCode.tbl_paper_type+`: `+ GetDay(fieldCrsCode.tbl_date_start) +` </br>`;
                    // text = `Paper `+fieldCrsCode.tbl_paper_type+`: `+fieldCrsCode.tbl_time_start+` - `+fieldCrsCode.tbl_time_end+` (`+fieldCrsCode.tbl_date_start+`) </br>`;
                    
                    venueExam = `Paper `+fieldCrsCode.tbl_paper_type+`: `+ fieldCrsCode.cen_id+` </br> `;

                    // tnya safi fk venue
// console.log(fieldCrsCode);
                    finaltextOE+=textTimeOE;
                    finaltextDate+=textTimeDate;
                    finalvenueExam+=venueExam;
    
                });
                
                nameCourseSemantara =  (data.crsCode )+` - `+ (data.crs_name).replaceAll('&','AND');
                $('#courseTitle').html(nameCourseSemantara);
                $('#examVenue').html(finalvenueExam);
                $('#TimeOE').html(finaltextOE);
                $('#dateDayExam').html(finaltextDate);

                let afiaaez = 'PDML 4513 IMMUNOLOGY  AND SEROLOGY.',
                    detReport = `
1  Faculty       : Faculty of Health Sciences 
2  Program       : DIPLOMA IN MEDICAL LABORATORY TECHNOLOGY
3  Group         : Sep-22 
4  Course Name   : IMMUNOLOGY AND SEROLOGY
5  Course Code   : PDML 4513
6  Semester      : 3
7  Chief Examiner: NUR SA'ADAH ABD RAHMAN
8  Date & Time   :`;

                detReport2 = ` 
9  Time of Exam  :
10 Exam Venue               :
11 Date marks keyed in AMS  :
12 No of Total Students     :
13 No of student barred     :
14 No of students attended  :
15 No absent from exam      :`;



                doc.setFontSize(12);
                doc.setFont("helvetica", "bold");
                doc.text(afiaaez, 20, 10, { maxWidth: 70 });


                doc.setFontSize(10);
                doc.text("Result Analysis Report.", 20, 23);

                doc.setFontSize(8);
                doc.setFont("courier", "normal");
                doc.text(detReport, 20, 25);


                doc.setFontSize(8);
                doc.setFont("courier", "normal");
                doc.text(detReport2, 125, 25);

                var form = new FormData();
                form.append("aca_session", fk_aca_cal);
                form.append("crs_code", data.fk_course);
                obj = new post(host + "api_pengurusan_pelajar/public/misStdRegsub/listByAcaCalCrs", form, 'picoms ' + token).execute();

                let pgmCode = getUrlVars()['pgmCode'];

                let rows = [];
                if (obj.success) {
                    dataStd = obj.data;
                    let bil = 1;
                    let dataChart = [];
                    let labelsCharts = [];
                    let list = [];


                    // mark_generate
                    $.each(dataStd, function (i, val) {
                        console.log(val.pgmCode);

                        if (pgmCode == val.pgmCode) {
                               // if (val.barr_status != 'Barred') {
                        if (val.barr_status === 'Barred') {
                            dataChart.push('Y');

                        } else {

                            let obj = new get(host + "api_exam_picoms/public/misExamStd/chkStdAttExam/" + val.rsb_id, 'picoms ' + window.sessionStorage.token).execute();


                            if (obj.success) {
                                console.log(val);

                                
                                if (obj.data.attendance === 'Attend') {
                                    let mark_generate = JSON.parse(val.mark_generate);
    
                                mark_generate = Object.values(mark_generate || 0);
                                let sliceGenerate = mark_generate.slice(-2, -1)[0];

                                dataChart.push(val.grade);
                                } else {
                                dataChart.push('Z');
                                    
                                }

                            } else {
                                let mark_generate = JSON.parse(val.mark_generate);
                                console.log(mark_generate);

                            mark_generate = Object.values(mark_generate || 0);
                            let sliceGenerate = mark_generate.slice(-2, -1)[0];
                            dataChart.push(sliceGenerate);
                            }


                            // let mark_generate = JSON.parse(val.mark_generate);
                            // mark_generate = Object.values(mark_generate);
                            // let sliceGenerate = mark_generate.slice(-2, -1)[0];
                            // dataChart.push(sliceGenerate);

                        }




                        }
                     

                    });
                    let labelGred = new get(host + 'api_exam_picoms/public/misExamGrading/listUndergrad/001', 'picoms ' + token).execute();
                    if (labelGred.success) {

                        $.each(labelGred.data, function (j, field) {
                            labelsCharts.push(field.grd_id);

                            // markGred.push(['gred' +':'+ field.grd_id,'mark' +':'+ field.grd_score ,'points' +':'+ field.quality_point ])
                            list.push(
                                {
                                    gred: field.grd_id,
                                    mark: field.grd_score,
                                    points: field.quality_point,
                                    resultRemarks: field.grd_remarks
                                })


                        })


                        list.push(
                            {
                                gred: 'Y',
                                mark: -1,
                                points: 0,
                                resultRemarks: 'Fail'
                            })

                        list.push(
                            {
                                gred: 'Z',
                                mark: -2,
                                points: 0,
                                resultRemarks: 'Fail'
                            })
                        labelsCharts.push('Y', 'Z')
                    }



                    // Count occurrences of each grade
                    var gradeCounts = {};
                    dataChart.forEach(function (grade) {
                        gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;

                        if (gradeCounts['Y'] == true) {
                            gradeCounts['Y'] = 1;
                        } else if (gradeCounts['Z'] == true) {
                            gradeCounts['Z'] = 1;
                        }

                    });

                    // // Prepare data for Chart.js
                    // var chartData = [];
                    // labelsCharts.forEach(function(label) {
                    //     chartData.push(gradeCounts[label] || 0);
                    // });

                    // Calculate total number of grades
                    var totalGrades = dataChart.length;
                    countFailed = 0;
                    countFailedPercent = 0;
                    countPass = 0;
                    countPassPercent = 0;

                    totalPercentage = 0;
                    totalQuality = 0;

                    // Prepare data for Chart.js as percentages
                    var chartData = [];
                    labelsCharts.forEach(function (label) {
                        var percentage = (gradeCounts[label] || 0) / totalGrades * 100;
                        // chartData.push(parseInt(percentage.toFixed(2))); // Round to 2 decimal places
                        chartData.push(percentage.toFixed(2)); // Round to 2 decimal places
                    });
                    // Loop through each object in the list array
                    list.forEach(function (item) {
                        // Check if the grade exists in gradeCounts
                        if (gradeCounts.hasOwnProperty(item.gred)) {
                            // Update the count of the grade in the list array
                            item.qty = gradeCounts[item.gred];
                            item.percentage = ((gradeCounts[item.gred] || 0) / totalGrades * 100).toFixed(2);

                            $('#noOfStdBarr').html(gradeCounts['Y']);


                        } else { item.qty = 0, item.percentage = 0 }




                    });


                    $.each(list, function (i, field) {


                        if (field.resultRemarks === 'Fail') {
                            countFailed = countFailed + field.qty;
                            countFailedPercent = countFailedPercent + parseFloat(field.percentage);
                        } else {
                            countPass = countPass + field.qty;
                            countPassPercent = countPassPercent + parseFloat(field.percentage);

                        }

                        totalPercentage = totalPercentage + parseFloat(field.percentage);
                        totalQuality = totalQuality + parseInt(field.qty);


                    })
                    $('#totalStd').html(totalQuality);
                    // console.log(totalQuality)
                    //push utk Total dlm table
                    list.push({
                        gred: 'Total',
                        mark: '',
                        points: '',
                        qty: totalQuality,
                        percentage: totalPercentage
                    })
                    //push utk student pass dlm table
                    list.push({
                        gred: 'Pass',
                        mark: '',
                        points: '',
                        qty: countPass,
                        percentage: countPassPercent
                    })

                    //push utk student failed dlm table
                    list.push({
                        gred: 'Failed',
                        mark: '',
                        points: '',
                        qty: countFailed,
                        percentage: countFailedPercent
                    })
                    var columns = [
                        { "name": "gred", "title": "Gred", "breakpoints": "md sm xs" },
                        { "name": "mark", "title": "Mark" },
                        { "name": "points", "title": "Pnts" },
                        { "name": "qty", "title": "Qty" },
                        { "name": "percentage", "title": "%" },
                    ];
                    // Iterate through the list array
for (var i = 0; i < list.length; i++) {
    // Replace 'Y' with 'Y (Barred)'
    if (list[i].gred === 'Y') {
        list[i].gred = 'Y (Barred)';
    }
    // Replace 'Z' with 'Z (Absent)'
    else if (list[i].gred === 'Z') {
        list[i].gred = 'Z (Absent)';
    }
}

                    $("#tableAnalysis").wrap("<div class='table-container'></div>");

                    $("#tableAnalysis").footable({
                        "columns": columns,
                        "rows": list,
                        "paging": {
                            "enabled": false,
                            "size": 50,
                            "countFormat": "Showing {PF} to {PL} of {TR} data"
                        },
                    });

                    $("#tableAnalysis").css("width", "100%"); // Change "100%" to your desired width




                    // // Chart.js
                    var ctx = document.getElementById("gradeChart").getContext("2d");

                    // var myChart = new Chart(ctx, {
                    //     type: 'bar',
                    //     data: {
                    //         labels: labelsCharts,
                    //         datasets: [{
                    //             label: 'Percentage (%)',
                    //             data: chartData,
                    //             backgroundColor: 'rgba'bar(54, 162, 235, 0.5)', // Blue color for bars
                    //             borderColor: 'rgba(54, 162, 235, 1)',
                    //             borderWidth: 1
                    //         }]
                    //     },
                    //     options: {
                    //         scales: {
                    //             yAxes: [{
                    //                 ticks: {
                    //                     beginAtZero: true,
                    //                     max: 50 // Set maximum value of y-axis to 50%

                    //                 }
                    //             }]
                    //         }
                    //     }
                    // });
                    var myChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: labelsCharts,
                            datasets: [{
                                label: '(%)',
                                data: chartData,
                                backgroundColor: 'rgba(54, 162, 235, 0.5)', // Blue color for bars
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                yAxes: [{
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'Percentage' // Label for y-axis with Percentage
                                    },
                                    ticks: {
                                        beginAtZero: true,
                                        max: 50, // Set maximum value of y-axis to 50%
                                        callback: function(value) {
                                            return value + '%'; // Append '%' to the tick values
                                        }
                                    }
                                }],
                                xAxes: [{ // For positioning y-axis labels on the left side
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'Grade' // Label for y-axis with Percentage
                                    },
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }]
                            }
                        }
                    });

                    var leftHeight = $('#left-column').outerHeight();
                    var rightHeight = $('#right-column').outerHeight();
                    // var rightHeight = $('#right-column').innerHeight();
                    var maxHeight = Math.max(leftHeight, rightHeight);
                    var minHeight = Math.min(leftHeight, rightHeight);
                    $('#left-column, #right-column').css('height', minHeight + 'px');
                    // $('#left-column, #right-column').css('height', maxHeight + 'px');

// Set the container's max height
// $(".table-container").css("max-height", minHeight+"px"); // Change "300px" to your desired max height

                var afiez = $('#left-column').width();
                // $('#afiezcomel').css('width', afiez + 'px');

                    $("#loading_mode").modal('hide');

                    PDFObject.embed(doc.output("datauristring"), "#preview-pdf");

           
}

            }
            else {
                window.close();
            }
        }, Math.random() * 1000);
    }

});

function filterData(data, conditions) {
    return data.filter(item => {
        for (const key in conditions) {
            if (item[key] != conditions[key]) {
                return false; // If any condition doesn't match, exclude the item
            }
        }
        return true; // All conditions matched, include the item
    });
}


// function listUndergraduate(returnValue){
//     var settings = {
//         "url": host+"api_exam_picoms/public/misExamGrading/listUndergrad/001",
//         "method": "GET",
//         "timeout": 0,
//     };

//     $.ajax(settings).done(function (response){
//         obj_listUndergraduate = response;
//         returnValue();
//     });
// }


document.getElementById('download-pdf2').addEventListener("click", downloadPDF2);


//download pdf form hidden canvas
function downloadPDF2() {

    var doc = new jsPDF('landscape');


    let lectIDCourse = window.sessionStorage.lectCrsId;

    let obj = new get(host + "api_lecturer_picoms/public/misLectCrsPrm/show/" + lectIDCourse, 'picoms ' + window.sessionStorage.token).execute();
    if (obj.success) {


    // Create a gradient effect with three colors (purple, maroon, red) on the left side
    var gradientColors = ['#743d89', '#973d78', '#ac3869'];
    var gradientWidth = 1.4; // Width of each color segment
    var gradientHeight = doc.internal.pageSize.height;

    for (var i = 0; i < gradientColors.length; i++) {
        doc.setFillColor(gradientColors[i]);
        doc.rect(i * gradientWidth, 0, gradientWidth, gradientHeight, 'F');
    }

    var a4Width = 297;

    // Image dimensions
    var originalWidth = 275.59; // Replace with the actual width of your image
    var originalHeight = 67.818; // Replace with the actual height of your image

    // Calculate the new width and height (60% of A4 width while maintaining aspect ratio)
    var newWidth = 0.45 * a4Width;
    var newHeight = (newWidth / originalWidth) * originalHeight;

    // Calculate the X-coordinate to center the image on the A4 page
    var xCoordinate = (a4Width - newWidth) / 2;

    // Add the image to the document with the calculated width, height, and centered position
    // doc.addImage("images/logo_reporting.png", "JPEG", xCoordinate, 10, newWidth, newHeight);

    // doc.setFont("helvetica", "bold");
    // var textCenterX = doc.internal.pageSize.width / 2;
    // doc.setFontSize(14); // Set the font size to 10
    // doc.text('BAHAGIAN HAL EHWAL PELAJAR DAN ALUMNI', textCenterX, 50, { align: "center" });

    // doc.setFont("helvetica", "bold");
    // doc.setFontSize(13); // Set the font size to 8
    // var textCenterX = doc.internal.pageSize.width / 2;
    // doc.text('UNIT PENGURUSAN HOSTEL', textCenterX, 58, { align: "center" });


    
    const text = $('#courseTitle').text();
    // const text ="PDML 4513 IMMUNOLOGY  AND SEROLOGY" ;
    doc.setFontSize(15);
    // Set the font type for the text
    doc.setFont("helvetica", "bold");
    const textWidth = doc.getTextWidth(text);
    // Set the position for the text
    const textX = 20; // X position
    const textY = 10; // Y position

    doc.text(text, textX, textY);

    // Set the underline color
    doc.setDrawColor(0, 0, 0); // RGB color for the underline

    // Draw the original-size underline
    const underlineLength1 = textWidth + 5; // Length of the underline
    const underlineWidth1 = 1.5; // Width of the underline
    doc.setLineWidth(underlineWidth1);
    doc.line(textX, textY + 2, textX + underlineLength1, textY + 2);

    // Set the color for the second underline (purple)
    doc.setDrawColor(128, 0, 128); // RGB color for purple

    // Draw the second underline with double the width
    const underlineLength2 = textWidth * (30 / 100); // Same length as the first underline
    const underlineWidth2 = underlineWidth1 * 2; // Double the width
    doc.setLineWidth(underlineWidth2);
    doc.line(textX, textY + 2, textX + underlineLength2, textY + 2);


        let data = obj.data;
        $('#fk_nameProg').html();
        $('#intakeGroup').html();
        $('#crsName').html();
        $('#crc_code').html();
        // $('#semCurrent').html(data.fac_name);
        $('#fk_chiefExam').html();
        // $('#dateTimeExam').html(data.fac_name);
        TimeOE =  ($('#TimeOE').html()).replaceAll('<br>', '\n ');
        dateDayExam =  ($('#dateDayExam').html()).replaceAll('<br>', '\n ');

        // $('#examVenue').html(data.fac_name);
        // $('#dateMarksKeyed').html(data.fac_name);
        // $('#noOfstdAtt').html(data.fac_name);
// alert(TimeOE);
        // $('#noAbsent').html(data.fac_name);
        crsCode = data.crsCode;
        
        let afiaaez = 'PDML 4513 IMMUNOLOGY  AND SEROLOGY.',
            detReport = `
1  Faculty       : `+ data.fac_name + ` 
2  Program       : `+ data.pgm_name + `
3  Group         : `+ data.dtp_intake + ` 
4  Course Name   : `+ data.crs_name + `
5  Course Code   : `+ data.crsCode + `
6  Semester      : 
7  Chief Examiner: `+ data.emp_name + `
8  Date & Day of Exam   : `+dateDayExam;

        detReport2 = ` 
9  Time of Exam  :`+TimeOE+`
10 Exam Venue               :
11 Date marks keyed in AMS  :
12 No of Total Students     : `+ $('#totalStd').html()+`
13 No of student barred     :`+ $('#noOfStdBarr').html()+`
14 No of students attended  :
15 No absent from exam      :`;



        // doc.setFontSize(12);
        // doc.setFont("helvetica", "bold");
        // doc.text(afiaaez, 20, 10, { maxWidth: 70 });


        doc.setFontSize(10);
        doc.text("Result Analysis Report.", 20, 23);

        doc.setFontSize(8);
        doc.setFont("courier", "normal");
        doc.text(detReport, 20, 25);


        doc.setFontSize(8);
        doc.setFont("courier", "normal");
        doc.text(detReport2, 125, 25);




        var newCanvas = document.querySelector('#gradeChart');

        //create image from dummy canvas
        var newCanvasImg = newCanvas.toDataURL("image/png", 1.0);

        doc.addImage(newCanvasImg, 'PNG', 20, 60, 112.5, 75);


        let canvasTable = document.createElement('canvas');
        let ctx = canvasTable.getContext('2d');

        // Render the HTML table onto the canvas
        html2canvas(document.getElementById('tableAnalysis')).then(function (canvasTable) {
            // Convert the canvas to a data URL
            var imgData = canvasTable.toDataURL('image/PNG');

            // Calculate the width and height of the image based on the canvas
            var imgWidth = canvasTable.width * 0.20; // adjust scale as needed
            var imgHeight = canvasTable.height * 0.20; // adjust scale as needed

            // Add the image to the PDF
            doc.addImage(imgData, 'PNG', 150, 60, imgWidth, imgHeight); // adjust coordinates as needed





            YCoordinateSign= 150;
            doc.text("Remarks:", 10, YCoordinateSign + 5);
            var textField = new TextField();
            textField.Rect = [30, YCoordinateSign, 160, 20];
            textField.multiline = true;
            textField.value = ""; //
            textField.fieldName = "TestTextBox";
            doc.addField(textField);



            doc.text("Lecturer Name:", 10, 180);
            var textLectName = new TextField();
            textLectName.Rect = [35, YCoordinateSign + 25, 30, 10];
            textLectName.multiline = true;
            textLectName.value = ""; //
            textLectName.fieldName = "LecturerName";
            doc.addField(textLectName);



            doc.text("Head of Programme:", 70, 180);
            var textHOD = new TextField();
            textHOD.Rect = [105, YCoordinateSign + 25, 30, 10];
            textHOD.multiline = true;
            textHOD.value = ""; //
            textHOD.fieldName = "HoD";
            doc.addField(textHOD);

            doc.text("Dean:", 140, 180);
            var textDean = new TextField();
            textDean.Rect = [160, YCoordinateSign + 25, 30, 10];
            textDean.multiline = true;
            textDean.value = ""; //
            textDean.fieldName = "dean";
            doc.addField(textDean);


            doc.text("Signature:", 10, YCoordinateSign + 45);
            doc.text("Name:", 10, YCoordinateSign + 50);
            doc.text("Date:", 10, YCoordinateSign + 55);
            var textSignLec = new TextField();
            textSignLec.Rect = [35, YCoordinateSign + 40, 30, 15];
            textSignLec.multiline = true;
            textSignLec.value = ""; //
            textSignLec.fieldName = "Sign";
            doc.addField(textSignLec);




            
            doc.text("Signature:", 70, YCoordinateSign + 45);
            doc.text("Name:", 70, YCoordinateSign + 50);
            doc.text("Date:", 70, YCoordinateSign + 55);
            var textsignHod = new TextField();
            textsignHod.Rect = [105, YCoordinateSign + 40, 30, 15];
            textsignHod.multiline = true;
            textsignHod.value = ""; //
            textsignHod.fieldName = "SignHoD";
            doc.addField(textsignHod);

            doc.text("Signature:", 140, YCoordinateSign + 45);
            doc.text("Name:", 140, YCoordinateSign + 50);
            doc.text("Date:", 140, YCoordinateSign + 55);



            var textSignDean = new TextField();
            textSignDean.Rect = [160, YCoordinateSign + 40  , 30, 15];
            textSignDean.multiline = true;
            textSignDean.value = ""; //
            textSignDean.fieldName = "DeanSign";
            doc.addField(textSignDean);






            // Save the PDF
            doc.save('table_as_image.pdf');
        });

    }
    else {
        window.close();
    }
}





function GetDay(dateString, returnValue) {
    

    // var dateString = "2024-03-26";
    var date = new Date(dateString);
    var day = date.getDay();

//    splitdate = $(date).split('-');

    // Convert numerical representation of day to name
    var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    // var dayName = daysOfWeek[day];
    var formatComplete =  date.getDate() + '/' +(date.getMonth() + 1) + '/' + date.getFullYear() + ' ('+daysOfWeek[day]+ ')';

    return formatComplete;
    // $('#dateOutput').text(dayName);
}