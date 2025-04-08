
// utk list std
var crsId = window.sessionStorage.pk_crs;
var fk_cotDet = window.sessionStorage.fk_cotDet;
var fk_aca_cal = window.sessionStorage.fk_aca_cal;


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

    let crsCode = "";
    var fixtimeDate = (new Date().toLocaleString()).split(', ');
    var fixTD = fixtimeDate[1] + ', ' + fixtimeDate[0]; let token = window.sessionStorage.token;

    //KLUARKAN DATA DET
    var formshowDet = new FormData();
    formshowDet.append("year", yearTaken);
    formshowDet.append("cal_cohort", cal_cohort);
    formshowDet.append("category", window.sessionStorage.category);
    formshowDet.append("pgm_id", getUrlVars()['pgmCode']);
    formshowDet.append("fk_course", crsId);
    objshowDet = new post(host + "api_tetapan_picoms/public/misPrmCalendar/detCourse", formshowDet, 'picoms ' + token).execute();
    if (objshowDet.success) {
        results = objshowDet.data;
        results = Array.isArray(results) ? results : [results];
        console.log(objshowDet.data);

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

        $('#courseCode').html(Array.from(courseCodes).join("<br>"));
        $('#fk_nameCourse').html(Array.from(courseNames).join("<br>"));
        $('#fk_crsSem').html(Array.from(programSemesters).join("<br>"));
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

            findId2(crsId, fk_cotDet, fk_aca_cal, crsId, function () {
                $("#loading_mode").modal('show');

                list_markStd = [];
                groupedData = [];
                let pgmCode = getUrlVars()['pgmCode'];

                $.each(obj_grdSchm.data, function (j, itemJ) {


                    formshowAnalysis.append("FK_course", crsId);
                    objshowAnalysis = new post(host + "api_tetapan_picoms/public/obe/clo_ByCourse/showCourseDet2", formshowAnalysis, 'picoms ' + token).execute();

                    if (objshowAnalysis.success) {
                        datashowAnalysis = objshowAnalysis.data;
                        var formshowgredScheme = new FormData();
                        formshowgredScheme.append("FK_course", crsId);
                        formshowgredScheme.append("pgm_code", pgmCode);
                        objshowWeightage = new post(host + "api_tetapan_picoms/public/generateObe/findByCode", formshowgredScheme, 'picoms ' + token).execute();

                        if (objshowWeightage.success) {

                            // Parse the JSON string into an object
                            // const data_object = JSON.parse(objshowWeightage.data);
                            // Parse the FK_clo values
                            FK_clo_values = JSON.parse(objshowWeightage.data.FK_clo);

                            // Initialize array to store result
                            result = [];

                            // Loop through FK_clo values
                            FK_clo_values.forEach(value => {
                                // Split the value by underscore
                                [clo, PLO] = value.split('_');

                                // Push the split values into result array
                                result.push({
                                    fk_PLO: PLO,
                                    fk_clo: clo
                                });
                            });

                            $.each(result, function (index, item) {
                                var fk_clo = item["fk_clo"];
                                $.each(datashowAnalysis, function (index, analysis_item) {
                                    if (analysis_item["fk_clo"] === fk_clo) {
                                        item["sum_total_weightage"] = analysis_item["sum_total_weightage"];
                                        return false; // Break out of the loop
                                    }
                                });
                            });
                            var groupedResult = {};

                            result.forEach(function (item) {
                                var fk_PLO = item.fk_PLO;
                                var sum_total_weightage = parseInt(item.sum_total_weightage);

                                if (!groupedResult[fk_PLO]) {
                                    groupedResult[fk_PLO] = {
                                        fk_PLO: fk_PLO,
                                        sum_total_weightage: 0
                                    };
                                }

                                groupedResult[fk_PLO].sum_total_weightage += sum_total_weightage;
                            });

                            var finalResult = Object.values(groupedResult);
                            // console.log(finalResult);



                        }

                    }


                    var columnsDetODet = [
                        { "name": "plo_level", "title": "PLO", "breakpoints": "md sm xs", "style": "text-align:center;" },
                        { "name": "plo_state", "title": "PLO Statement", "style": "text-align:center;" },
                        { "name": "percentXStd", "title": "Percentage Of Student (Attained 50% of CLO)", "style": "text-align:center;" },
                        { "name": "stsPLO", "title": "Status of PLO Achievement", "style": "text-align:center;" },
                    ];
                    var columnsPLO = [
                        { "name": "plo_level", "title": "PLO", "breakpoints": "md sm xs", "style": "text-align:center;" },
                        { "name": "t_weightage", "title": "Assessment Weightage (%)", "style": "text-align:center;" },
                        { "name": "valOfAttainment", "title": "Value of " + attainmentProg + "% PLO attainment", "style": "text-align:center;" },
                    ];
                    listDetODet = [];
                    let listPLO = [];
                    Total_sumPLO = 0
                    valOfAttainmentPLO = 0
                    Total_valOfAttainmentPLO = 0


                    //PLO table bawah
                    let objGradeCmpnntPLO = new get(host + "api_tetapan_picoms/public/misprmobe/showByFKCodePgm/" + pgmCode, 'picoms ' + window.sessionStorage.token).execute();

                    dataStatement = objGradeCmpnntPLO.data;
                    if (objGradeCmpnntPLO.success) {

                        // // Combine arrays based on fk_PLO = obe_plo_id
                        // combinedArray = dataStatement.map(item2 => ({
                        //     ...item2,
                        //     sum_total_weightage: finalResult.find(item1 => item1.fk_PLO === item2.obe_plo_id.toString()).sum_total_weightage
                        // }));



                        combinedArray = dataStatement.map(item2 => {
                            const matchingItem = finalResult.find(item1 => item1.fk_PLO === item2.obe_plo_id.toString());
                            if (!matchingItem) {
                                console.warn(`No matching item found for obe_plo_id: ${item2.obe_plo_id}`);
                            }
                            return {
                                ...item2,
                                sum_total_weightage: matchingItem ? matchingItem.sum_total_weightage : null // or 0, or any default value you prefer
                            };
                        });

                        
                        totalPercent = 0;
                        totalPercentAttain = 0;
                        $.each(combinedArray, function (j, itemPLO) {

                            ValOfAttainPLO = (itemPLO.sum_total_weightage / 100) * attainmentProg;

                            totalPercent += itemPLO.sum_total_weightage;
                            totalPercentAttain += ValOfAttainPLO;
                            listDetODet.push({
                                plo_level: `<p style="width: max-content;margin: 3px;">` + itemPLO.obe_plo_name + `</p>`,
                                plo_state: itemPLO.obe_plo_statement,
                                percentXStd: `<p class="text-center">100%</p>`,
                                stsPLO: 'CLO Achievement',
                            })

                            listPLO.push({
                                plo_level: `<p style="width: max-content;margin: 3px;">` + itemPLO.obe_plo_name + `</p>`,
                                t_weightage: itemPLO.sum_total_weightage,
                                valOfAttainment: ValOfAttainPLO,
                            })
                        })

                    }
                    //end PLO table bawah

                    listPLO.push({
                        plo_level: 'Total',
                        t_weightage: totalPercent,
                        valOfAttainment: totalPercentAttain,
                    })
                    $("#tableAchieveAnalysisPLO").footable({
                        "columns": columnsPLO,
                        "rows": listPLO,
                        "paging": {
                            "enabled": true,
                            "size": 10,
                            "countFormat": "Showing {PF} to {PL} of {TR} data"
                        },
                        // "filtering": {
                        //     "enabled": true,
                        //     "placeholder": "Search...",
                        //     "dropdownTitle": "Search for:"
                        // }
                    });

                    $("#tablePLODet").footable({
                        "columns": columnsDetODet,
                        "rows": listDetODet,
                        "paging": {
                            "enabled": true,
                            "size": 10,
                            "countFormat": "Showing {PF} to {PL} of {TR} data"
                        },
                        // "filtering": {
                        //     "enabled": true,
                        //     "placeholder": "Search...",
                        //     "dropdownTitle": "Search for:"
                        // }
                    });
                }); // each mark

                $("#loading_mode").modal('hide');
            });



            let obj = new get(host + "api_lecturer_picoms/public/misLectCrsPrm/show/" + id, 'picoms ' + token).execute();
            if (obj.success) {
                let data = obj.data;
                crsCode = data.crsCode, pk_program = data.fk_prm_prog;

          
                // 1) nie utk dptkan attainment
                let objProgramDet = new get(host + "api_tetapan_picoms/public/misPrmProg/show/" + pk_program, 'picoms ' + token).execute();

                if (objProgramDet.success) {
                    var attainmentProg = (objProgramDet.data.pgm_attainment) * 1;

                    //  2) start sini utk table PLO achieved
                    $("#obeTable").html('');
                    // alert();
                    obeList(pk_program, function () {
                        // var columns = [
                        //     { "name": "bil", "title": "No." },
                        //     { "name": "plo", "title": "PLO" },
                        //     { "name": "statement", "title": "Statement" },
                        //     // { "name": "percentage", "title": "Percentage" },
                        //     // { "name": "status", "title": "Status" }
                        //     // ,
                        //     { "name": "upt_btn", "title": "Action",'class':"text-center", "breakpoints": "md sm xs" }
                        // ];

                        // var list2 = [];
                        // let bil = 1;
                        // let convertDetList2 = JSON.stringify(obj_obeList);
                        // $("#dataDetailList2").val(convertDetList2);
                        // console.log(obj_obeList);

                        // $.each(obj_obeList, function(i, objObe){

                        //     // let aca_calyear = field.acaCal;
                        //     // if( aca_calyear != null ){ aca_calyear = aca_calyear.replace('/','') }
                        //     // let acaCal = aca_calyear+ '/' +field.cal_cohort;
                        //     // let acaIntake = field.intake_month+ '-' +field.intake_year;

                        //     list2.push({
                        //         bil: bil++, 
                        //         plo: objObe.obe_plo_name, 
                        //         statement: objObe.obe_plo_statement,
                        //         // percentage: objObe.obe_plo_percentage,
                        //         // status: objObe.obe_plo_status,
                        //         // ses_intake: field.dtp_year+'<br>'+field.dtp_intake,
                        //         upt_btn:  '  <button class="btn btn-icon success" title="Update" onclick="uptObe_plo(\'' +i+ '\')"><i class="ion-android-create"></i></button> '+
                        //                     '<button class="btn btn-icon danger" title="Remove" onclick="del_rekod_plo(\''+objObe.obe_plo_id+'\')"><i class="ion-trash-b" ></i></button>'
                        //     });
                        // });

                        // $("#obeTable").footable({
                        //     "columns": columns,
                        //     "rows": list2,
                        //     "paging": {
                        //         "enabled": true,
                        //         "size": 10,
                        //         "countFormat": "Showing {PF} to {PL} of {TR} data"
                        //     },
                        //     "filtering": {
                        //         "enabled": true,
                        //         "placeholder": "Search...",
                        //         "dropdownTitle": "Search for:"
                        //     }
                        // });

                    })
                    // 2) end start sini utk table PLO achieved


                }
                // 1) end nie utk dptkan attainment



                // 3) nie utk dptkan utk table CLO and analysis reference 
                var formshowAnalysis = new FormData();
                formshowAnalysis.append("FK_course", data.fk_crs);
                objshowAnalysis = new post(host + "api_tetapan_picoms/public/obe/clo_ByCourse/showCourseDet2", formshowAnalysis, 'picoms ' + token).execute();

                if (objshowAnalysis.success) {

                    cloAchieve = objshowAnalysis.data;
                    let convertList = JSON.stringify(cloAchieve);
                    $("#DTAchieveAnalysis").val(convertList);

                    Total_weightage = 0;
                    Total_valOfAttainment = 0;
                    let list = [];
                    let listCLODet = [];
                    var columns = [
                        { "name": "clo_level", "title": "CLO", "breakpoints": "md sm xs", "style": "text-align:center;" },
                        { "name": "t_weightage", "title": "Assessment Weightage (%)", "style": "text-align:center;" },
                        { "name": "valOfAttainment", "title": "Value of " + attainmentProg + "% attainment", "style": "text-align:center;" },
                    ];

                    var columnsCLODet = [
                        { "name": "clo_level", "title": "CLO", "breakpoints": "md sm xs", "style": "text-align:center;" },
                        { "name": "clo_state", "title": "CLO Statement", "style": "text-align:center;" },
                        { "name": "percentXStd", "title": "Percentage Of Student (Attained " + attainmentProg + "% of CLO)", "style": "text-align:center;" },
                        { "name": "stsCLO", "title": "Status of CLO Achievement", "style": "text-align:center;" },
                    ];
                    $.each(cloAchieve, function (i, field) {
                        Total_weightage += field.sum_total_weightage;
                        valOfAttainmentField = (field.sum_total_weightage / 100) * attainmentProg;
                        Total_valOfAttainment += valOfAttainmentField;

                        list.push({
                            clo_level: `<p style="width: max-content;margin: 3px; ">` + field.clo_level + `</p>`,

                            // clo_level: field.clo_level,
                            t_weightage: field.sum_total_weightage,
                            valOfAttainment: valOfAttainmentField,
                        })

                        listCLODet.push({
                            clo_level: `<p style="width: max-content;margin: 3px;">` + field.clo_level + `</p>`,
                            clo_state: field.clo_statement,
                            percentXStd: `<p class="text-center">100%</p>`,
                            stsCLO: 'CLO Achievement',
                        })

                    });



                    list.push({
                        clo_level: 'Total',
                        t_weightage: Total_weightage,
                        valOfAttainment: Total_valOfAttainment,
                    })

                    $("#tableAchieveAnalysis").footable({
                        "columns": columns,
                        "rows": list,
                        "paging": {
                            "enabled": false,
                            "size": 50,
                            "expandAll": false,
                            "countFormat": "Showing {PF} to {PL} of {TR} data"
                        },
                    });
                    $("#tableCloDet").footable({
                        "columns": columnsCLODet,
                        "rows": listCLODet,
                        "paging": {
                            "enabled": false,
                            "size": 50,
                            "expandAll": false,
                            "countFormat": "Showing {PF} to {PL} of {TR} data"
                        },
                    });

                }
                // 3) end nie utk dptkan utk table CLO and analysis reference 

                $("#loading_mode").modal('hide');


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



        const text = 'CLO vs PLO Analysis';
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
        $('#courseCode').html();
        $('#fk_nameCourse').html();

        crsCode = data.crsCode;

        detReport = ` 
1  Course Name   : `+ data.crs_name + `
2  Course Code   : `+ data.crsCode + `
3  Semester      :`
        doc.setFontSize(10);
        doc.text("Result Analysis Report.", 20, 23);

        doc.setFontSize(8);
        doc.setFont("courier", "normal");
        doc.text(detReport, 20, 25);


        // Retrieve data for each table
        let tableAchieveAnalysisData = getDataForTable('#tableAchieveAnalysis');
        let tableAchieveAnalysisPLOData = getDataForTable('#tableAchieveAnalysisPLO');
        let tableCloDetData = getDataForTable('#tableCloDet');
        let tablePLODetData = getDataForTable('#tablePLODet');
        // Remove rows with no data from table data
        tableAchieveAnalysisData.rows = tableAchieveAnalysisData.rows.filter(row => row.length > 0);
        tableAchieveAnalysisPLOData.rows = tableAchieveAnalysisPLOData.rows.filter(row => row.length > 0);
        tableCloDetData.rows = tableCloDetData.rows.filter(row => row.length > 0);
        tablePLODetData.rows = tablePLODetData.rows.filter(row => row.length > 0);


        // Calculate the total available width
        const totalWidth = doc.internal.pageSize.getWidth() - 40; // Subtracting 40 for margins

        // Calculate the width for each table as 40% of the total available width
        const tableWidth = totalWidth * 0.5;

        // Add tableAchieveAnalysisData
        doc.autoTable(tableAchieveAnalysisData.columns, tableAchieveAnalysisData.rows, {
            startY: 45,
            margin: { left: 20 },
            tableWidth: tableWidth,
            headStyles: { fillColor: [124, 95, 240] },
            styles: { fontSize: 8 } // Set the font size directly here

        });
        finalYgap = doc.autoTable.previous.finalY;

        // Add tableAchieveAnalysisPLOData
        doc.autoTable(tableAchieveAnalysisPLOData.columns, tableAchieveAnalysisPLOData.rows, {
            startY: 45,
            margin: { left: 150 },
            tableWidth: tableWidth,
            headStyles: { fillColor: [124, 95, 240] },
            styles: { fontSize: 8 } // Set the font size directly here

        });

        // Add tableCloDetData
        doc.autoTable(tableCloDetData.columns, tableCloDetData.rows, {
            startY: finalYgap + 10,
            margin: { left: 20 },
            tableWidth: tableWidth,
            headStyles: { fillColor: [124, 95, 240] },
            styles: { fontSize: 8 } // Set the font size directly here

        });

        // Add tablePLODetData
        doc.autoTable(tablePLODetData.columns, tablePLODetData.rows, {
            startY: finalYgap + 10,
            margin: { left: 150 },
            tableWidth: tableWidth,
            headStyles: { fillColor: [124, 95, 240] },
            styles: { fontSize: 8 } // Set the font size directly here

        });

        // Function to retrieve data for a table
        function getDataForTable(selector) {
            let table = $(selector);
            let columns = [];
            let rows = [];

            // Retrieve column headers
            table.find('th').each(function () {
                columns.push({ header: $(this).text() });
            });

            // Retrieve table rows
            table.find('tr').each(function (index, row) {
                let rowData = [];
                $(row).find('td').each(function () {
                    rowData.push($(this).text());
                });
                rows.push(rowData);
            });

            return { columns: columns, rows: rows };
        }














        YCoordinateSign = 150;
        positionX = 20;
        positionY = 140;
        doc.text("Notes.", positionX, positionY);

        // Empty square
        doc.rect(positionX, positionY + 2, 120, 10);
        // Empty square
        doc.rect(positionX, positionY + 14, 120, 17);


        // Empty square
        doc.rect(positionX + 125, positionY + 2, 120, 10);
        doc.rect(positionX + 125, positionY + 14, 120, 17);
        doc.text('Suggestion for improvement  of CLO achievement', positionX + 130, positionY + 17); // Adjust the position as needed
        doc.text('Suggestion for improvement  of CLO achievement', positionX + 4, positionY + 17); // Adjust the position as needed




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
        textSignDean.Rect = [160, YCoordinateSign + 40, 30, 15];
        textSignDean.multiline = true;
        textSignDean.value = ""; //
        textSignDean.fieldName = "DeanSign";
        doc.addField(textSignDean);












        doc.save('table_as_image.pdf');

    }
    else {
        window.close();
    }
}





function findIDDet(crs, fk_cotDet, fk_aca_cal, crsId, returnValue) {
    var form = new FormData();
    form.append("crs", crs);
    form.append("fk_cotDet", fk_cotDet);
    form.append("aca_session", fk_aca_cal);
    form.append("crs_code", crsId);

    var settings = {
        url: host + "api_tetapan_picoms/public/misPrmGredScheme/checkName2",
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
        obj_grdSchm = JSON.parse(response);
        returnValue();
    });
}






function obeList(pgm_id, returnValue) {
    var settings = {
        "url": host + "api_tetapan_picoms/public/misprmobe/show/" + pgm_id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_obeList = response.data;
        returnValue();
    });
}
