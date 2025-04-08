var logout = 0, temp = 0, SuperAdmin = 0, wardenAccess = 0;

$(function () {
    $.ajaxSetup({
        cache: false
    });

    checkCapaian(window.sessionStorage.usrId);



});



// Start capaian first
function checkCapaian(FK_users) {
    var settings = {
        "url": host + "api_hep/public/capaianUsr/checkingCapaian/" + window.sessionStorage.usrId,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        var obj_capaian = response.data;

        $.each(obj_capaian, function (i, item) {
            let hepaUnique = item.uniqueCapaian;

            if (hepaUnique == 'superadmin') {
                $('#assignSU').removeClass('none');
                $("#capaiProg").removeClass('none');
                $("#capaiDisc").removeClass('none');
                $("#capaiHostel").removeClass('none');
                $("#capaiCounse").removeClass('none');
                $("#capaiWarden").removeClass('none');
                $("#counselor").removeClass('none');
                $("#capaiRolesHepa").removeClass('none');
                $("#capaiReportingHepa").removeClass('none');

                $(".AdmPgmReporting, .AdmDiscReporting, .AdmHostelReporting, .AdmCounReporting").removeClass('none');

                logout += 1;
                temp += 1;
                SuperAdmin += 1;
                window.sessionStorage.SU = 'Y';
                wardenAccess += 3;
            }

            if (hepaUnique == 'adminProgram') {
                $("#capaiProg").removeClass('none');
                $(".AdmPgmReporting").removeClass('none');
                logout += 1;
            }

            if (hepaUnique == 'adminDiscipline') {
                $("#capaiDisc").removeClass('none');
                $(".AdmDiscReporting").removeClass('none');
                logout += 1;
            }

            if (hepaUnique == 'adminHostel') {
                $("#capaiHostel").removeClass('none');
                $(".AdmHostelReporting").removeClass('none');
                wardenAccess += 2;
                logout += 1;
            }

            if (hepaUnique == 'adminCounseling') {
                $("#capaiCounse").removeClass('none');
                $(".AdmCounReporting").removeClass('none');
                window.sessionStorage.AdminCoun = 'Y';
                logout += 1;
                temp += 3;
            }

            if (hepaUnique == 'warden') {
                $("#capaiCounse").removeClass('none');
                $(".AdmCounseling").removeClass('none');
                $(".AdmHostelReporting").removeClass('none');
                logout += 1;
            }

            if (hepaUnique == 'counselor') {
                $("#capaiCounse").removeClass('none');
                $("#counselor").removeClass('none');
                $(".AdmCounReporting").removeClass('none');
                logout += 1;
            }
        });

        if (FK_users) {
            // For warden
            let obj = new get(host + 'api_hep/public/hepWarden/findStaf/' + FK_users, 'picoms ' + window.sessionStorage.token).execute();
            if (obj.success) {
                $("#capaiWarden").removeClass('none');
                $("#capaiHostel").removeClass('none');
                $('.AdminHostel').addClass('none');
                checkWarden = obj.data;
                logout += 1;
                temp += 2;
                wardenAccess += 1;
            }
        }

        if (FK_users) {
            // For counselor
            let obj = new get(host + 'api_hep/public/hepcaunkaunselor/findKaun/' + FK_users, 'picoms ' + window.sessionStorage.token).execute();
            if (obj.success) {
                window.sessionStorage.KaunID = obj.data[0].pk_id;
                $("#capaiCounse").removeClass('none');
                $(".AdminCounseling").removeClass('none');
                temp += 3;
                logout += 1;
                counselor = obj.data;
            }
        }

        if (logout <= 0) {
            window.sessionStorage.setItem('NewUser', 'SSO');
        }

        if (SuperAdmin > 0 && temp != 4) {
            sessionStorage.removeItem("KaunID");
        }

        if (temp == 1 || temp == 3) {
            window.sessionStorage.setItem('tempPosition', 'SU');
            $('.AdminHostel').removeClass('none');
        } else if (temp == 2) {
            window.sessionStorage.setItem('tempPosition', 'W');
        } else if (temp == 4 || temp == 6) {
            window.sessionStorage.setItem('tempPosition', 'Counselor');
            $("#capaiCounse").removeClass('none');
            $(".AdminCounseling").removeClass('none');
        }

        if (wardenAccess == 1) {
            $('.warden').attr('hidden', true);
            $('.AdmHostelReporting').show();
            $('.warden').hide();
            // $('.AdmHostelReporting').hide();
            $('.hideObj').hide();
            $('.hideWarden').hide();

        }

        console.log(wardenAccess);
    });
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


//-------------------------------------------------- mis_std_info --------------------------------------------------//
// check if student exist
function chkStdExist(input, returnValue) {
    var form = new FormData();
    form.append("input", input);

    var settings = {
        "url": host + "api_pengurusan_pelajar/public/studentIdChecking",
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
        result = JSON.parse(response);
        returnValue();
    });
}

// show data student
function showStd(id, returnValue) {
    var settings = {
        "url": host + "api_pengurusan_pelajar/public/misStdInfo/show/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_std = response;
        returnValue();
    });
}
//-------------------------------------------------- end mis_std_info --------------------------------------------------//


//-------------------------------------------------- hrm_emp_info --------------------------------------------------//
// list staff
function lecturerList(returnValue) {
    var settings = {
        "url": host + "api_tetapan_picoms/public/hrmEmpInfo/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_lecturer = response;
        returnValue();
    });
}
//-------------------------------------------------- hrm_emp_info --------------------------------------------------//
// list staff
function listWarden(returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepWarden/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_warden = response;
        returnValue();
    });
}

// show data staff
function empShow(id, returnValue) {
    var settings = {
        "url": host + "api_tetapan_picoms/public/hrmEmpInfo/show/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_emp = response;
        returnValue();
    });
}


// list emp division!=PP
function stafList(returnValue) {
    var settings = {
        "url": host + "api_tetapan_picoms/public/hrmEmpInfo/counListAll",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "pic5oms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_emp = response;
        returnValue();
    });
}
//-------------------------------------------------- end hrm_emp_info --------------------------------------------------//


//-------------------------------------------------- list all counselor----------------------by afiez 23ogos------------------------//
function Listallstaf(returnValue) {
    var settings = {
        "url": host + "api_tetapan_picoms/public/hrmEmpInfo/counListAll",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_emp = response;
        returnValue();
    });
}
//-------------------------------------------------- end list all counselor --------------------------------------------------//
//-------------------------------------------------- list all typekaunseling ----------------------by afiez 23ogos------------------------//
function listingTypecaun(returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepCaunType/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_type_caun = response;
        returnValue();
    });
}
//-------------------------------------------------- end list all type kaunseling --------------------------------------------------//


//-------------------------------------------------- hep_hostel_bed --------------------------------------------------//
// update bed_occupied status
function uptHstlBed(id, status) {
    var form = new FormData();
    form.append("bed_id", id);
    form.append("bed_occupied", status);
    form.append("recordstatus", "EDT");

    var settings = {
        "url": host + "api_hep/public/hepHostelBed/uptSttsBooked",
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
        result = JSON.parse(response);
        if (!result.success) {
            Swal(result.message, result.data, "error");
            return;
        }
    });
}

// list bed by room status==Active, occupied==No
function bedList(id, returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepHostelBed/listByRmActNo/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_bedList = response;
        returnValue();
    });
}
//-------------------------------------------------- end hep_hostel_bed --------------------------------------------------//


//-------------------------------------------------- hep_hostel_change --------------------------------------------------//
function alertChange(returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepHostelChange/alertChgNew",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_alertChange = response;
        returnValue();
    });
}

function alertChngVerify(returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepHostelChange/alertChngVerify",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_alrtChngVerify = response;
        returnValue();
    });
}
//-------------------------------------------------- end hep_hostel_change --------------------------------------------------//


function counselorList(returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepcaunkaunselor/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_counselor = response;
        returnValue();
    });
}


// list timetable by Kaunselor
function listCounTimetbl(id, returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepcauntimetable/listByKaunselor/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_counTimetbl = response;
        returnValue();
    });
}


// date format
function formatDate(date) {
    let newDate = '';
    if (date) {
        let arrayDate = date.split("-");
        newDate = arrayDate[2] + '/' + arrayDate[1] + '/' + arrayDate[0];
    }
    else { newDate = ''; }

    return newDate;
}
// date format
function formatDate1(date) {
    let newDate = '';
    if (date) {
        let arrayDate = date.split("-");
        newDate = arrayDate[1] + '/' + arrayDate[2] + '/' + arrayDate[0];
    }
    else { newDate = ''; }

    return newDate;
}

function formatMonth(date) {
    let newDate = '';
    if (date) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const [year, month] = date.split('-');
        newDate = `${monthNames[parseInt(month) - 1]} ${year}`;
    } else {
        newDate = '';
    }

    return newDate;
}



//-------------------------------------------------- hep_hostel_chkinout --------------------------------------------------//
// check student exist for status check in==new
function chkStdChkIn(id, returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepHostelChkinout/chkStdChkIn/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_chkInOut = response;
        returnValue();
    });
}

// count student check in
function countOccupied(id, returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepHostelChkinout/countChkIn/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_chkInOut = response;
        returnValue();
    });
}

// check alert statusCheckout==New / notifyWarden==Yes
function alertCheckOut(returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepHostelChkinout/alertChkOutNew",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_alertChkOut = response;
        returnValue();
    });
}
//-------------------------------------------------- hep_hostel_chkinout --------------------------------------------------//


//-------------------------------------------------- hep_hostel --------------------------------------------------//
function hstlClgList(id, returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepHostel/listByBranch/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_hstlList = response;
        returnValue();
    });
}
//-------------------------------------------------- end hep_hostel --------------------------------------------------//


//-------------------------------------------------- hep_hostel_block --------------------------------------------------//
// list block by Hostel & Gender
function listBlckHstlGndr(id, gender, returnValue) {
    var form = new FormData();
    form.append("hostel_id", id);
    form.append("block_gender", gender);

    var settings = {
        "url": host + "api_hep/public/hepHostelBlok/listByHstlGndr",
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
        obj_block = JSON.parse(response);
        returnValue();
    });
}

// list Block by Hostel
function blockList(id, returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepHostelBlok/list/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_block = response;
        returnValue();
    });
}


// list Block by Hostel
function verifyroom(block_id, room_id, returnValue) {
    obj_verify = new get(host + "api_hep/public/hepHostelChange/verifyroom/" + block_id + "/" + room_id, "picoms " + window.sessionStorage.token).execute();
    returnValue();

    // var settings = {
    //     "url": host+"api_hep/public/hepHostelChange/verifyroom/"+block_id+"/"+room_id,
    //     "method": "GET",
    //     "timeout": 0,
    //     "headers": {
    //         "Authorization": "picoms " + window.sessionStorage.token
    //     },
    // };

    // var request = $.ajax(settings); 

    // request.done(function (response){
    //     obj_verify = response;
    //     returnValue();
    // });

    // request.fail(function (e){
    //     obj_verify = {success:false,data:""};
    // });
}
//-------------------------------------------------- end hep_hostel_block --------------------------------------------------//


//-------------------------------------------------- hep_hostel_room --------------------------------------------------//
// list room by Block & status==Active
function roomList(id, returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepHostelRoom/listByBlok/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_roomList = response;
        returnValue();
    });
}

function roomList2(id, returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepHostelRoom/listByBlok2/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_roomList = response;
        returnValue();
    });
}




function roomData(id, returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepHostelRoom/show/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_roomData = response;
        returnValue();
    });
}

// list room by block
function roomByBlock(id, returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepHostelRoom/list/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_room = response;
        returnValue();
    });
}
//-------------------------------------------------- end hep_hostel_room --------------------------------------------------//


//-------------------------------------------------- hep_counselling --------------------------------------------------//
function alertByStaf(id, returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepCounselling/alertByKaun/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_coun = response;
        returnValue();
    });
}
//-------------------------------------------------- end hep_counselling --------------------------------------------------//

//-------------------------------------------------- start utk generate excel --------------------------------------------------//

/* ############ export table footable to excel ############ */
/* bind the button "excel Export" to load the rows */
// $("#andagila").on("click", function (e) {
//     var filename = "filename.csv";
//     var csv = FooTable.get('#disiplinList').toCSV();
//     var blob = new Blob([ csv ], {
//         type : "application/csv;charset=utf-8;"
//     });
//     if (window.navigator.msSaveBlob) {
//         // FOR IE BROWSER
//         navigator.msSaveBlob(blob, filename);
//     } else {
//         // FOR OTHER BROWSERS
//         var link = document.createElement("a");
//         var csvUrl = URL.createObjectURL(blob);
//         link.href = csvUrl;
//         link.style = "visibility:hidden";
//         link.download = filename;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     }
// }); 
function excelGen(namaTable) {

    let tableID = namaTable;

    var filename = tableID + ".csv";
    var csv = "";

    // Get the table element
    var table = document.getElementById(tableID);

    // Iterate through rows and cells to build the CSV content
    for (var i = 1; i < table.rows.length; i++) {
        var row = table.rows[i];
        for (var j = 0; j < row.cells.length - 1; j++) { // Exclude the last column
            csv += '"' + row.cells[j].textContent.replace(/"/g, '""') + '",';
        }
        csv = csv.slice(0, -1); // Remove the trailing comma
        csv += '\n';
    }

    // Create a Blob with the CSV data
    var blob = new Blob([csv], {
        type: "application/csv;charset=utf-8;"
    });

    // Check if it's Internet Explorer
    if (window.navigator.msSaveBlob) {
        // FOR IE BROWSER
        navigator.msSaveBlob(blob, filename);
    } else {
        // FOR OTHER BROWSERS
        var link = document.createElement("a");
        var csvUrl = URL.createObjectURL(blob);
        link.href = csvUrl;
        link.style = "visibility:hidden";
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    display.push
    //   $(".generateExcel").on("click", function (e) {
    //   });
}
//-------------------------------------------------- end utk generate excel --------------------------------------------------//

// HOSTEL
function generatePDF(name, idTable) {
    window.jsPDF = window.jspdf.jsPDF; //nie pnting utk call jspdf pnya library
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
    timeStampPdf(doc);


    // Image dimensions
    var originalWidth = 275.59; // Replace with the actual width of your image
    var originalHeight = 67.818; // Replace with the actual height of your image

    // Calculate the new width and height (60% of A4 width while maintaining aspect ratio)
    var newWidth = 0.6 * a4Width;
    var newHeight = (newWidth / originalWidth) * originalHeight;

    // Calculate the X-coordinate to center the image on the A4 page
    var xCoordinate = (a4Width - newWidth) / 2;

    // Add the image to the document with the calculated width, height, and centered position
    doc.addImage("images/logo_reporting.png", "JPEG", xCoordinate, 10, newWidth, newHeight);

    doc.setFont("helvetica", "bold");
    var textCenterX = doc.internal.pageSize.width / 2;
    doc.setFontSize(14); // Set the font size to 10
    doc.text('BAHAGIAN HAL EHWAL PELAJAR DAN ALUMNI', textCenterX, 50, { align: "center" });

    

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13); // Set the font size to 8
    var textCenterX = doc.internal.pageSize.width / 2;
    doc.text('UNIT PENGURUSAN HOSTEL', textCenterX, 58, { align: "center" });


    const text ="Reporting " + name + " Hostel";
    doc.setFontSize(15);
    // Set the font type for the text
    doc.setFont("helvetica", "bold");
    const textWidth = doc.getTextWidth(text);
    // Set the position for the text
    const textX = 15; // X position
    const textY = 80; // Y position



    doc.text(text, textX, textY);

    // Set the underline color
    doc.setDrawColor(0, 0, 0); // RGB color for the underline

    // Draw the original-size underline
    const underlineLength1 = textWidth + 20; // Length of the underline
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

    // Define the source element (your HTML table)
    var source = $('#' + idTable)[0];

    // Generate the PDF from the table, starting below the text
    doc.autoTable({
        html: source,
        startY: 90, // Adjusted start position below the text
        margin: { top: 20 },
        theme: 'grid',
        styles: { fillColor: false, textColor: 0 },
        headerStyles: { fillColor: '#9c4298', textColor: 255 },
    });
    doc.addImage("images/footer_reporting.png", "JPEG", 6, 276, 200, 20);

    // Save or download the PDF
    doc.save('Reporting_' + name + '.pdf');
    // doc.save('Reporting_change_hostel.pdf');
}

// HOSTEL Unrside
function generatePDFUnreside(name, idTable, monthYear) {
    window.jsPDF = window.jspdf.jsPDF; //nie pnting utk call jspdf pnya library
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
    timeStampPdf(doc);


    // Image dimensions
    var originalWidth = 275.59; // Replace with the actual width of your image
    var originalHeight = 67.818; // Replace with the actual height of your image

    // Calculate the new width and height (60% of A4 width while maintaining aspect ratio)
    var newWidth = 0.6 * a4Width;
    var newHeight = (newWidth / originalWidth) * originalHeight;

    // Calculate the X-coordinate to center the image on the A4 page
    var xCoordinate = (a4Width - newWidth) / 2;

    // Add the image to the document with the calculated width, height, and centered position
    doc.addImage("images/logo_reporting.png", "JPEG", xCoordinate, 10, newWidth, newHeight);

    doc.setFont("helvetica", "bold");
    var textCenterX = doc.internal.pageSize.width / 2;
    doc.setFontSize(14); // Set the font size to 10
    doc.text('BAHAGIAN HAL EHWAL PELAJAR DAN ALUMNI', textCenterX, 50, { align: "center" });

    

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13); // Set the font size to 8
    var textCenterX = doc.internal.pageSize.width / 2;
    doc.text('UNIT PENGURUSAN HOSTEL', textCenterX, 58, { align: "center" });


    const text ="Reporting " + name + " Hostel";
    doc.setFontSize(15);
    // Set the font type for the text
    doc.setFont("helvetica", "bold");
    const textWidth = doc.getTextWidth(text);
    // Set the position for the text
    const textX = 15; // X position
    const textY = 80; // Y position



    doc.text(text, textX, textY);



    // Set the underline color
    doc.setDrawColor(0, 0, 0); // RGB color for the underline

    // Draw the original-size underline
    const underlineLength1 = textWidth + 20; // Length of the underline
    const underlineWidth1 = 1.5; // Width of the underline
    doc.setLineWidth(underlineWidth1);
    doc.line(textX, textY + 2, textX + underlineLength1, textY + 2);

    // Set the color for the second underline (purple)
    doc.setDrawColor(128, 0, 128); // RGB color for purple

    doc.setFont("helvetica", "normal");
    doc.text('Month : '+monthYear, 15, 90);


    // Draw the second underline with double the width
    const underlineLength2 = textWidth * (30 / 100); // Same length as the first underline
    const underlineWidth2 = underlineWidth1 * 2; // Double the width
    doc.setLineWidth(underlineWidth2);
    doc.line(textX, textY + 2, textX + underlineLength2, textY + 2);

    // Define the source element (your HTML table)
    var source = $('#' + idTable)[0];

    // Generate the PDF from the table, starting below the text
    doc.autoTable({
        html: source,
        startY: 95, // Adjusted start position below the text
        margin: { top: 20 },
        theme: 'grid',
        styles: { fillColor: false, textColor: 0 },
        headerStyles: { fillColor: '#9c4298', textColor: 255 },
    });
    doc.addImage("images/footer_reporting.png", "JPEG", 6, 276, 200, 20);

    // Save or download the PDF
    doc.save('Reporting_' + name + '.pdf');
    // doc.save('Reporting_change_hostel.pdf');
}

function generatePDFBaitulMal(name, idTable, month, year, baitulmal, asnaf) {
    window.jsPDF = window.jspdf.jsPDF; //nie pnting utk call jspdf pnya library
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
    timeStampPdf(doc);


    // Image dimensions
    var originalWidth = 275.59; // Replace with the actual width of your image
    var originalHeight = 67.818; // Replace with the actual height of your image

    // Calculate the new width and height (60% of A4 width while maintaining aspect ratio)
    var newWidth = 0.6 * a4Width;
    var newHeight = (newWidth / originalWidth) * originalHeight;

    // Calculate the X-coordinate to center the image on the A4 page
    var xCoordinate = (a4Width - newWidth) / 2;

    // Add the image to the document with the calculated width, height, and centered position
    doc.addImage("images/logo_reporting.png", "JPEG", xCoordinate, 10, newWidth, newHeight);

    doc.setFont("helvetica", "bold");
    var textCenterX = doc.internal.pageSize.width / 2;
    doc.setFontSize(14); // Set the font size to 10
    doc.text('BAHAGIAN HAL EHWAL PELAJAR DAN ALUMNI', textCenterX, 50, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13); // Set the font size to 8
    var textCenterX = doc.internal.pageSize.width / 2;
    doc.text('UNIT PENGURUSAN HOSTEL', textCenterX, 58, { align: "center" });

    const text ="Reporting " + name + " Student Hostel";
    doc.setFontSize(15);
    // Set the font type for the text
    const textWidth = doc.getTextWidth(text);
    // Set the position for the text
    const textX = 15; // X position
    const textY = 75; // Y position
    doc.text(text, textX, textY);

    const text4 ="Month : " +month;
    doc.setFontSize(15);
    doc.setFont("helvetica", "normal");
    const textWidth4 = doc.getTextWidth(text4);
    const textX4 = 15; // X position
    const textY4 = 85; // Y position
    doc.text(text4, textX4, textY4);

    const text2 ="Baitulmal : " + baitulmal ;
    doc.setFontSize(15);
    doc.setFont("helvetica", "normal");
    const textWidth2 = doc.getTextWidth(text2);
    const textX2 = 15; // X position
    const textY2 = 90; // Y position
    doc.text(text2, textX2, textY2);

    const text3 ="Asnaf : " +asnaf;
    doc.setFontSize(15);
    doc.setFont("helvetica", "normal");
    const textWidth3 = doc.getTextWidth(text3);
    const textX3 = 15; // X position
    const textY3 = 95; // Y position
    doc.text(text3, textX3, textY3);

    // Set the underline color
    doc.setDrawColor(0, 0, 0); // RGB color for the underline

    // Draw the original-size underline
    const underlineLength1 = textWidth + 20; // Length of the underline
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

    // Define the source element (your HTML table)
    var source = $('#' + idTable)[0];

    // Generate the PDF from the table, starting below the text
    doc.autoTable({
        html: source,
        startY: 100, // Adjusted start position below the text
        margin: { top: 20 },
        theme: 'grid',
        styles: { fillColor: false, textColor: 0, fontSize: 8.5 },
        headerStyles: { fillColor: '#9c4298', textColor: 255, halign: 'center' },
        bodyStyles: { valign: 'middle', halign: 'center' }

    });
    doc.addImage("images/footer_reporting.png", "JPEG", 6, 276, 200, 20);

    // Save or download the PDF
    doc.save('Reporting_' + name + '.pdf');
    // doc.save('Reporting_change_hostel.pdf');
}

function generatePDFFilter(name, idTable, month) {
    window.jsPDF = window.jspdf.jsPDF; //nie pnting utk call jspdf pnya library
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
    timeStampPdf(doc);


    // Image dimensions
    var originalWidth = 275.59; // Replace with the actual width of your image
    var originalHeight = 67.818; // Replace with the actual height of your image

    // Calculate the new width and height (60% of A4 width while maintaining aspect ratio)
    var newWidth = 0.6 * a4Width;
    var newHeight = (newWidth / originalWidth) * originalHeight;

    // Calculate the X-coordinate to center the image on the A4 page
    var xCoordinate = (a4Width - newWidth) / 2;

    // Add the image to the document with the calculated width, height, and centered position
    doc.addImage("images/logo_reporting.png", "JPEG", xCoordinate, 10, newWidth, newHeight);

    doc.setFont("helvetica", "bold");
    var textCenterX = doc.internal.pageSize.width / 2;
    doc.setFontSize(14); // Set the font size to 10
    doc.text('BAHAGIAN HAL EHWAL PELAJAR DAN ALUMNI', textCenterX, 50, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13); // Set the font size to 8
    var textCenterX = doc.internal.pageSize.width / 2;
    doc.text('UNIT PENGURUSAN HOSTEL', textCenterX, 58, { align: "center" });

    const text ="Reporting " + name + " Student Hostel";
    doc.setFontSize(15);
    // Set the font type for the text
    const textWidth = doc.getTextWidth(text);
    // Set the position for the text
    const textX = 15; // X position
    const textY = 75; // Y position
    doc.text(text, textX, textY);

    const text4 ="Month : " +month;
    doc.setFontSize(15);
    doc.setFont("helvetica", "normal");
    const textWidth4 = doc.getTextWidth(text4);
    const textX4 = 15; // X position
    const textY4 = 85; // Y position
    doc.text(text4, textX4, textY4);


    // Set the underline color
    doc.setDrawColor(0, 0, 0); // RGB color for the underline

    // Draw the original-size underline
    const underlineLength1 = textWidth + 20; // Length of the underline
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

    // Define the source element (your HTML table)
    var source = $('#' + idTable)[0];

    // Generate the PDF from the table, starting below the text
    doc.autoTable({
        html: source,
        startY: 90, // Adjusted start position below the text
        margin: { top: 40 },
        theme: 'grid',
        styles: { fillColor: false, textColor: 0, fontSize: 8.5 },
        headerStyles: { fillColor: '#9c4298', textColor: 255 },
    });
    doc.addImage("images/footer_reporting.png", "JPEG", 6, 276, 200, 20);

    // Save or download the PDF
    doc.save('Reporting_' + name + '.pdf');
    // doc.save('Reporting_change_hostel.pdf');
}

// HOSTEL
function generatePDFDamage(name, idTable, monthYear) {
    window.jsPDF = window.jspdf.jsPDF; //nie pnting utk call jspdf pnya library
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
    timeStampPdf(doc);

    // Image dimensions
    var originalWidth = 275.59; // Replace with the actual width of your image
    var originalHeight = 67.818; // Replace with the actual height of your image

    // Calculate the new width and height (60% of A4 width while maintaining aspect ratio)
    var newWidth = 0.6 * a4Width;
    var newHeight = (newWidth / originalWidth) * originalHeight;

    // Calculate the X-coordinate to center the image on the A4 page
    var xCoordinate = (a4Width - newWidth) / 2;

    // Add the image to the document with the calculated width, height, and centered position
    doc.addImage("images/logo_reporting.png", "JPEG", xCoordinate, 10, newWidth, newHeight);

    doc.setFont("helvetica", "bold");
    var textCenterX = doc.internal.pageSize.width / 2;
    doc.setFontSize(14); // Set the font size to 10
    doc.text('BAHAGIAN HAL EHWAL PELAJAR DAN ALUMNI', textCenterX, 50, { align: "center" });

    

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13); // Set the font size to 8
    var textCenterX = doc.internal.pageSize.width / 2;
    doc.text('UNIT PENGURUSAN HOSTEL', textCenterX, 58, { align: "center" });


    const text ="Reporting " + name + " Hostel";
    doc.setFontSize(15);
    // Set the font type for the text
    doc.setFont("helvetica", "bold");
    const textWidth = doc.getTextWidth(text);
    // Set the position for the text
    const textX = 15; // X position
    const textY = 80; // Y position



    doc.text(text, textX, textY);

    // Set the underline color
    doc.setDrawColor(0, 0, 0); // RGB color for the underline

    // Draw the original-size underline
    const underlineLength1 = textWidth + 20; // Length of the underline
    const underlineWidth1 = 1.5; // Width of the underline
    doc.setLineWidth(underlineWidth1);
    doc.line(textX, textY + 2, textX + underlineLength1, textY + 2);

    // Set the color for the second underline (purple)
    doc.setDrawColor(128, 0, 128); // RGB color for purple

    doc.setFont("helvetica", "normal");
    doc.text('Month : '+monthYear, 15, 90);

    // Draw the second underline with double the width
    const underlineLength2 = textWidth * (30 / 100); // Same length as the first underline
    const underlineWidth2 = underlineWidth1 * 2; // Double the width
    doc.setLineWidth(underlineWidth2);
    doc.line(textX, textY + 2, textX + underlineLength2, textY + 2);

    // Define the source element (your HTML table)
    var source = $('#' + idTable)[0];

    // Generate the PDF from the table, starting below the text
    doc.autoTable({
        html: source,
        startY: 95, // Adjusted start position below the text
        margin: { top: 20 },
        theme: 'grid',
        styles: { fillColor: false, textColor: 0 },
        headerStyles: { fillColor: '#9c4298', textColor: 255 },
    });
    doc.addImage("images/footer_reporting.png", "JPEG", 6, 276, 200, 20);

    // Save or download the PDF
    doc.save('Reporting_' + name + '.pdf');
    // doc.save('Reporting_change_hostel.pdf');
}

function generatePDFChange(name, idTable, monthYear) {
    window.jsPDF = window.jspdf.jsPDF; //nie pnting utk call jspdf pnya library
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
    timeStampPdf(doc);

    // Image dimensions
    var originalWidth = 275.59; // Replace with the actual width of your image
    var originalHeight = 67.818; // Replace with the actual height of your image

    // Calculate the new width and height (60% of A4 width while maintaining aspect ratio)
    var newWidth = 0.6 * a4Width;
    var newHeight = (newWidth / originalWidth) * originalHeight;

    // Calculate the X-coordinate to center the image on the A4 page
    var xCoordinate = (a4Width - newWidth) / 2;

    // Add the image to the document with the calculated width, height, and centered position
    doc.addImage("images/logo_reporting.png", "JPEG", xCoordinate, 10, newWidth, newHeight);

    doc.setFont("helvetica", "bold");
    var textCenterX = doc.internal.pageSize.width / 2;
    doc.setFontSize(14); // Set the font size to 10
    doc.text('BAHAGIAN HAL EHWAL PELAJAR DAN ALUMNI', textCenterX, 50, { align: "center" });

    

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13); // Set the font size to 8
    var textCenterX = doc.internal.pageSize.width / 2;
    doc.text('UNIT PENGURUSAN HOSTEL', textCenterX, 58, { align: "center" });


    const text ="Reporting " + name + " Hostel";
    doc.setFontSize(15);
    // Set the font type for the text
    doc.setFont("helvetica", "bold");
    const textWidth = doc.getTextWidth(text);
    // Set the position for the text
    const textX = 15; // X position
    const textY = 80; // Y position



    doc.text(text, textX, textY);

    // Set the underline color
    doc.setDrawColor(0, 0, 0); // RGB color for the underline

    // Draw the original-size underline
    const underlineLength1 = textWidth + 20; // Length of the underline
    const underlineWidth1 = 1.5; // Width of the underline
    doc.setLineWidth(underlineWidth1);
    doc.line(textX, textY + 2, textX + underlineLength1, textY + 2);

    // Set the color for the second underline (purple)
    doc.setDrawColor(128, 0, 128); // RGB color for purple

    doc.setFont("helvetica", "normal");
    doc.text('Month : '+monthYear, 15, 90);

    // Draw the second underline with double the width
    const underlineLength2 = textWidth * (30 / 100); // Same length as the first underline
    const underlineWidth2 = underlineWidth1 * 2; // Double the width
    doc.setLineWidth(underlineWidth2);
    doc.line(textX, textY + 2, textX + underlineLength2, textY + 2);

    // Define the source element (your HTML table)
    var source = $('#' + idTable)[0];

    // Generate the PDF from the table, starting below the text
    doc.autoTable({
        html: source,
        startY: 95, // Adjusted start position below the text
        margin: { top: 20 },
        theme: 'grid',
        styles: { fillColor: false, textColor: 0 },
        headerStyles: { fillColor: '#9c4298', textColor: 255 },
    });
    doc.addImage("images/footer_reporting.png", "JPEG", 6, 276, 200, 20);

    // Save or download the PDF
    doc.save('Reporting_' + name + '.pdf');
    // doc.save('Reporting_change_hostel.pdf');
}


// function GeneratePDFUnit(name, idTable, nameUnit) {
//     window.jsPDF = window.jspdf.jsPDF; // Ensure to call the jsPDF library

//     var doc = new jsPDF({
//         orientation: "portrait",
//         unit: "mm",
//         format: "a4",
//     });

//     // Create a gradient effect with three colors (purple, maroon, red) on the left side
//     var gradientColors = ['#743d89', '#973d78', '#ac3869'];
//     var gradientWidth = 1.4; // Width of each color segment
//     var gradientHeight = doc.internal.pageSize.height;

//     for (var i = 0; i < gradientColors.length; i++) {
//         doc.setFillColor(gradientColors[i]);
//         doc.rect(i * gradientWidth, 0, gradientWidth, gradientHeight, 'F');
//     }

//     var logoImage = new Image();
//     logoImage.src = "images/logo_reporting.png"; // Replace with the actual path to your image

//     var a4Width = 210; // A4 width in mm
//     var targetImageWidthPercentage = 60; // Desired image width percentage

//     var targetImageWidth = (a4Width * targetImageWidthPercentage) / 100;
//     var aspectRatio = logoImage.width / logoImage.height;
//     var targetImageHeight = targetImageWidth / aspectRatio;

//     var centerX = (doc.internal.pageSize.width - targetImageWidth) / 2;
//     doc.addImage(logoImage, "PNG", centerX, 10, targetImageWidth, targetImageHeight);

//     doc.setFont("helvetica", "bold");
//     var textCenterX = doc.internal.pageSize.width / 2;
//     doc.setFontSize(14); // Set the font size to 10
//     doc.text('BAHAGIAN HAL EHWAL PELAJAR DAN ALUMNI', textCenterX, 50, { align: "center" });

//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(13); // Set the font size to 8
//     var textCenterX = doc.internal.pageSize.width / 2;
//     doc.text(nameUnit, textCenterX, 58, { align: "center" });

//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(16); // Set the font size to 8
//     doc.text("Reporting " + name + " Hostel", textCenterX, 70, { align: "center" });

//     var source = $('#' + idTable)[0];

//     doc.autoTable({
//         html: source,
//         startY: 80,
//         margin: { top: 40 },
//         theme: 'grid',
//         styles: { fillColor: false, textColor: 0 },
//         headerStyles: { fillColor: '#9c4298', textColor: 255 },
//     });

//     doc.save('Reporting_' + name + '.pdf');


// }


// function GeneratePDFUnit(name, idTable, nameUnit) {
//     window.jsPDF = window.jspdf.jsPDF; // Ensure to call the jsPDF library

//     var doc = new jsPDF({
//         orientation: "portrait",
//         unit: "mm",
//         format: "a4",
//     });

//     // Create a gradient effect with three colors (purple, maroon, red) on the left side
//     var gradientColors = ['#743d89', '#973d78', '#ac3869'];
//     var gradientWidth = 1.4; // Width of each color segment
//     var gradientHeight = doc.internal.pageSize.height;

//     for (var i = 0; i < gradientColors.length; i++) {
//         doc.setFillColor(gradientColors[i]);
//         doc.rect(i * gradientWidth, 0, gradientWidth, gradientHeight, 'F');
//     }

//     var logoImage = new Image();
//     logoImage.src = "images/logo_reporting.png"; // Replace with the actual path to your image

//     var a4Width = 210; // A4 width in mm
//     var targetImageWidthPercentage = 60; // Desired image width percentage

//     var targetImageWidth = (a4Width * targetImageWidthPercentage) / 100;
//     var aspectRatio = logoImage.width / logoImage.height;
//     var targetImageHeight = targetImageWidth / aspectRatio;

//     var centerX = (doc.internal.pageSize.width - targetImageWidth) / 2;
//     doc.addImage(logoImage, "PNG", centerX, 10, targetImageWidth, targetImageHeight);

//     doc.setFont("helvetica", "bold");
//     var textCenterX = doc.internal.pageSize.width / 2;
//     doc.setFontSize(14); // Set the font size to 10
//     doc.text('BAHAGIAN HAL EHWAL PELAJAR DAN ALUMNI', textCenterX, 50, { align: "center" });

//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(13); // Set the font size to 8
//     var textCenterX = doc.internal.pageSize.width / 2;
//     doc.text(nameUnit, textCenterX, 58, { align: "center" });

//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(16); // Set the font size to 8
//     doc.text("Reporting " + name + " Hostel", textCenterX, 70, { align: "center" });

//     var source = $('#' + idTable)[0];

//     doc.autoTable({
//         html: source,
//         startY: 80,
//         margin: { top: 40 },
//         theme: 'grid',
//         styles: { fillColor: false, textColor: 0 },
//         headerStyles: { fillColor: '#9c4298', textColor: 255 },
//     });

//     doc.save('Reporting_' + name + '.pdf');


// }
function GeneratePDFUnit(name, idTable, nameUnit, dateStart, dateEnd) {



if (dateStart === 'undefined' || $('#' + dateStart + '').val() === '') {
    dateStartPDf = "Old";
}
else {
    dateStartPDf =   $('#' + dateStart + '').val();
}

if (dateEnd === 'undefined' || $('#' + dateEnd + '').val() === '') {
    dateEndPDf = "Until Now";
}
  else {
    dateEndPDf =  $('#' + dateEnd + '').val();
  }
  finalDate = `(`+dateStartPDf+` - `+ dateEndPDf+`)`;

    window.jsPDF = window.jspdf.jsPDF; // Ensure to call the jsPDF library

    var doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    timeStampPdf(doc);


    // Set the margin.bottom property to add space between the table and the footer image
    var tableMargin = { top: 40, bottom: 40 }; // You can adjust these values as needed

    // Variable to track the starting Y position on subsequent pages
    var subsequentPageStartY = 100;

    // Function to add the header content to each page
    function addHeader() {
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
        doc.addImage("images/logo_reporting.png", "JPEG", xCoordinate, 10, newWidth, newHeight);

        doc.setFont("helvetica", "bold");
        var textCenterX = doc.internal.pageSize.width / 2;
        doc.setFontSize(14); // Set the font size to 10
        doc.text('BAHAGIAN HAL EHWAL PELAJAR DAN ALUMNI', textCenterX, 50, { align: "center" });

        doc.setFont("helvetica", "bold");
        doc.setFontSize(13); // Set the font size to 8
        doc.text(nameUnit, textCenterX, 58, { align: "center" });

        const text = "REPORTING " + name + finalDate;
        doc.setFontSize(15);
        // Set the font type for the text
        doc.setFont("helvetica", "bold");
        const textWidth = doc.getTextWidth(text);
        // Set the position for the text
        const textX = 20; // X position
        const textY = 80; // Y position

        doc.text(text, textX, textY);

        // Set the underline color
        doc.setDrawColor(0, 0, 0); // RGB color for the underline

        // Draw the original-size underline
        const underlineLength1 = textWidth + 20; // Length of the underline
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
    }

  
    // Function to add the footer to each page
    function addFooter() {
        doc.addImage("images/footer_reporting.png", "JPEG", 6, 276, 200, 20);
    }

    // Function to add the content (table) to each page
    function addContent() {
        
    //nie utk buang filter tu
    $('#' + idTable + ' thead .footable-filtering').empty();

    // Check if the last header column is labeled as 'Action'
    var removeLastColumn = ($('#' + idTable + ' thead th:last-child').text().trim() === 'Action');

    // Hide the last header column if it's labeled as 'Action'
    if (removeLastColumn) {
        $('#' + idTable + ' thead th:last-child').hide();
    }

    // Hide the last column from each row if the last header column is labeled as 'Action'
    if (removeLastColumn) {
        $('#' + idTable + ' tbody tr').each(function () {
            $(this).find('td:last-child').hide();
        });
    }
        var source = $('#' + idTable)[0];

        var pageHeight = doc.internal.pageSize.height;

        if (doc.y + tableMargin.bottom + tableMargin.top + tableMargin.top > pageHeight) {
            // Not enough space for the content on the current page
            addPage();
        }

        doc.autoTable({
            html: source,
            startY: subsequentPageStartY, // Fixed startY for all pages
            margin: tableMargin,
            theme: 'grid',
            styles: { fillColor: false, textColor: 0 },
            headStyles: { fillColor: '#9c4298', textColor: 255 },
        });
    }

    // Function to add a new page with header and footer
    function addPage() {
        doc.addPage();
        addHeader();
        addFooter();
        subsequentPageStartY = 80; // Reset startY for the new page
    }

    // Add the first page with header and footer
    addHeader();
    addContent(); // Adding the table content
    addFooter();

    // Save the document
    doc.save('Reporting_' + name + '.pdf');
}   


// function GeneratePDFUnit(name, idTable, nameUnit) {
//     window.jsPDF = window.jspdf.jsPDF; // Ensure to call the jsPDF library

//     var doc = new jsPDF({
//         orientation: "portrait",
//         unit: "mm",
//         format: "a4",
//     });

//     // Set the margin.bottom property to add space between the table and the footer image
//     var tableMargin = { top: 40, bottom: 40 }; // You can adjust these values as needed

//     // Variable to track the starting Y position on subsequent pages
//     var subsequentPageStartY = 100;

//     // Function to add the header content to each page
//     function addHeader() {
//         // Create a gradient effect with three colors (purple, maroon, red) on the left side
//         var gradientColors = ['#743d89', '#973d78', '#ac3869'];
//         var gradientWidth = 1.4; // Width of each color segment
//         var gradientHeight = doc.internal.pageSize.height;

//         for (var i = 0; i < gradientColors.length; i++) {
//             doc.setFillColor(gradientColors[i]);
//             doc.rect(i * gradientWidth, 0, gradientWidth, gradientHeight, 'F');
//         }

//         var a4Width = 210;

//         // Image dimensions
//         var originalWidth = 275.59; // Replace with the actual width of your image
//         var originalHeight = 67.818; // Replace with the actual height of your image

//         // Calculate the new width and height (60% of A4 width while maintaining aspect ratio)
//         var newWidth = 0.6 * a4Width;
//         var newHeight = (newWidth / originalWidth) * originalHeight;

//         // Calculate the X-coordinate to center the image on the A4 page
//         var xCoordinate = (a4Width - newWidth) / 2;

//         // Add the image to the document with the calculated width, height, and centered position
//         doc.addImage("images/logo_reporting.png", "JPEG", xCoordinate, 10, newWidth, newHeight);

//         doc.setFont("helvetica", "bold");
//         var textCenterX = doc.internal.pageSize.width / 2;
//         doc.setFontSize(14); // Set the font size to 10
//         doc.text('BAHAGIAN HAL EHWAL PELAJAR DAN ALUMNI', textCenterX, 50, { align: "center" });

//         doc.setFont("helvetica", "bold");
//         doc.setFontSize(13); // Set the font size to 8
//         doc.text(nameUnit, textCenterX, 58, { align: "center" });

//         const text = "REPORTING " + name;
//         doc.setFontSize(15);
//         // Set the font type for the text
//         doc.setFont("helvetica", "bold");
//         const textWidth = doc.getTextWidth(text);
//         // Set the position for the text
//         const textX = 20; // X position
//         const textY = 80; // Y position

//         doc.text(text, textX, textY);

//         // Set the underline color
//         doc.setDrawColor(0, 0, 0); // RGB color for the underline

//         // Draw the original-size underline
//         const underlineLength1 = textWidth + 20; // Length of the underline
//         const underlineWidth1 = 1.5; // Width of the underline
//         doc.setLineWidth(underlineWidth1);
//         doc.line(textX, textY + 2, textX + underlineLength1, textY + 2);

//         // Set the color for the second underline (purple)
//         doc.setDrawColor(128, 0, 128); // RGB color for purple

//         // Draw the second underline with double the width
//         const underlineLength2 = textWidth * (30 / 100); // Same length as the first underline
//         const underlineWidth2 = underlineWidth1 * 2; // Double the width
//         doc.setLineWidth(underlineWidth2);
//         doc.line(textX, textY + 2, textX + underlineLength2, textY + 2);
//     }

  
//     // Function to add the footer to each page
//     function addFooter() {
//         doc.addImage("images/footer_reporting.png", "JPEG", 6, 276, 200, 20);
//     }

//     // Continue with the rest of your code, including the autoTable function
//     var source = $('#' + idTable)[0];

//     // Add the first page with header and footer
//     addHeader();
//     addFooter();

//     // Configure autoTable with the didDrawPage hook
//     doc.autoTable({
//         html: source,
//         startY: subsequentPageStartY, // Fixed startY for the first page
//         margin: tableMargin,
//         theme: 'grid',
//         styles: { fillColor: false, textColor: 0 },
//         headStyles: { fillColor: '#9c4298', textColor: 255 },
//         didDrawPage: data => {
//             addHeader();
//             addFooter();

//             // Set the startY for the next page after adding the header
//             subsequentPageStartY = data.cursor.y + tableMargin.top;
//         },
//     });

//     doc.save('Reporting_' + name + '.pdf');
// }



// function GeneratePDFUnit(name, idTable, nameUnit) {
//     window.jsPDF = window.jspdf.jsPDF; // Ensure to call the jsPDF library

//     var doc = new jsPDF({
//         orientation: "portrait",
//         unit: "mm",
//         format: "a4",
//     });

//     // Create a gradient effect with three colors (purple, maroon, red) on the left side
//     var gradientColors = ['#743d89', '#973d78', '#ac3869'];
//     var gradientWidth = 1.4; // Width of each color segment
//     var gradientHeight = doc.internal.pageSize.height;

//     for (var i = 0; i < gradientColors.length; i++) {
//         doc.setFillColor(gradientColors[i]);
//         doc.rect(i * gradientWidth, 0, gradientWidth, gradientHeight, 'F');
//     }

//     var a4Width = 210;

//     // Image dimensions
//     var originalWidth = 275.59; // Replace with the actual width of your image
//     var originalHeight = 67.818; // Replace with the actual height of your image

//     // Calculate the new width and height (60% of A4 width while maintaining aspect ratio)
//     var newWidth = 0.6 * a4Width;
//     var newHeight = (newWidth / originalWidth) * originalHeight;

//     // Calculate the X-coordinate to center the image on the A4 page
//     var xCoordinate = (a4Width - newWidth) / 2;

//     // Add the image to the document with the calculated width, height, and centered position
//     doc.addImage("images/logo_reporting.png", "JPEG", xCoordinate, 10, newWidth, newHeight);

//     doc.setFont("helvetica", "bold");
//     var textCenterX = doc.internal.pageSize.width / 2;
//     doc.setFontSize(14); // Set the font size to 10
//     doc.text('BAHAGIAN HAL EHWAL PELAJAR DAN ALUMNI', textCenterX, 50, { align: "center" });

//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(13); // Set the font size to 8
//     var textCenterX = doc.internal.pageSize.width / 2;
//     doc.text(nameUnit, textCenterX, 58, { align: "center" });

//     const text = "REPORTING " + name;
//     doc.setFontSize(15);
//     // Set the font type for the text
//     doc.setFont("helvetica", "bold");
//     const textWidth = doc.getTextWidth(text);
//     // Set the position for the text
//     const textX = 20; // X position
//     const textY = 80; // Y position


//     doc.text(text, textX, textY);

//     // Set the underline color
//     doc.setDrawColor(0, 0, 0); // RGB color for the underline

//     // Draw the original-size underline
//     const underlineLength1 = textWidth + 20; // Length of the underline
//     const underlineWidth1 = 1.5; // Width of the underline
//     doc.setLineWidth(underlineWidth1);
//     doc.line(textX, textY + 2, textX + underlineLength1, textY + 2);

//     // Set the color for the second underline (purple)
//     doc.setDrawColor(128, 0, 128); // RGB color for purple

//     // Draw the second underline with double the width
//     const underlineLength2 = textWidth * (30 / 100); // Same length as the first underline
//     const underlineWidth2 = underlineWidth1 * 2; // Double the width
//     doc.setLineWidth(underlineWidth2);
//     doc.line(textX, textY + 2, textX + underlineLength2, textY + 2);

//     //nie utk buang filter tu
//     $('#' + idTable + ' thead .footable-filtering').empty();

//     // Check if the last header column is labeled as 'Action'
//     var removeLastColumn = ($('#' + idTable + ' thead th:last-child').text().trim() === 'Action');

//     // Hide the last header column if it's labeled as 'Action'
//     if (removeLastColumn) {
//         $('#' + idTable + ' thead th:last-child').hide();
//     }

//     // Hide the last column from each row if the last header column is labeled as 'Action'
//     if (removeLastColumn) {
//         $('#' + idTable + ' tbody tr').each(function () {
//             $(this).find('td:last-child').hide();
//         });
//     }
//     // Continue with the rest of your code, including the autoTable function
//     var source = $('#' + idTable)[0];
//     doc.autoTable({
//         html: source,
//         startY: 100,
//         margin: { top: 40 },
//         theme: 'grid',
//         styles: { fillColor: false, textColor: 0 },
//         headStyles: { fillColor: '#9c4298', textColor: 255 }, // Use headStyles instead of headerStyles
//     });


//     doc.addImage("images/footer_reporting.png", "JPEG", 6, 276, 200, 20);

//     doc.save('Reporting_' + name + '.pdf');
// }


function convertDateFormat(originalDateString) {
    // Split the original date string
    let parts = originalDateString.split('/');
    // Create a Date object
    let dateObject = new Date(parts[2],  parts[1] - 1, parts[0]);
 // Format the date object to 'YYYY-MM-DD' format
   // Format the date object to 'YYYY/MM/DD' format
   let year = dateObject.getFullYear();
   let month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
   let day = dateObject.getDate().toString().padStart(2, '0');

   let formattedDateString = `${year}/${month}/${day}`;
5
//  let formattedDateString = dateObject.toLocaleDateString('en-GB'); // Use 'en-GB' for 'DD/MM/YYYY' format
// alert(formattedDateString);

    return formattedDateString;
  }

  function generatePDFSummary(name, idTable) {
    window.jsPDF = window.jspdf.jsPDF; //nie pnting utk call jspdf pnya library
    var doc = new jsPDF('landscape');

    // Create a gradient effect with three colors (purple, maroon, red) on the left side
    var gradientColors = ['#743d89', '#973d78', '#ac3869'];
    var gradientWidth = 1.4; // Width of each color segment
    var gradientHeight = doc.internal.pageSize.height;

    for (var i = 0; i < gradientColors.length; i++) {
        doc.setFillColor(gradientColors[i]);
        doc.rect(i * gradientWidth, 0, gradientWidth, gradientHeight, 'F');
    }

    var a4Width = 297;
    timeStampPdf(doc);


    // Image dimensions
    var originalWidth = 275.59; // Replace with the actual width of your image
    var originalHeight = 67.818; // Replace with the actual height of your image

    // Calculate the new width and height (60% of A4 width while maintaining aspect ratio)
    var newWidth = 0.45 * a4Width;
    var newHeight = (newWidth / originalWidth) * originalHeight;

    // Calculate the X-coordinate to center the image on the A4 page
    var xCoordinate = (a4Width - newWidth) / 2;

    // Add the image to the document with the calculated width, height, and centered position
    doc.addImage("images/logo_reporting.png", "JPEG", xCoordinate, 10, newWidth, newHeight);

    doc.setFont("helvetica", "bold");
    var textCenterX = doc.internal.pageSize.width / 2;
    doc.setFontSize(14); // Set the font size to 10
    doc.text('BAHAGIAN HAL EHWAL PELAJAR DAN ALUMNI', textCenterX, 50, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13); // Set the font size to 8
    var textCenterX = doc.internal.pageSize.width / 2;
    doc.text('UNIT PENGURUSAN HOSTEL', textCenterX, 58, { align: "center" });


    const text ="Reporting " + name ;
    doc.setFontSize(15);
    // Set the font type for the text
    doc.setFont("helvetica", "bold");
    const textWidth = doc.getTextWidth(text);
    // Set the position for the text
    const textX = 15; // X position
    const textY = 70; // Y position

    doc.text(text, textX, textY);

    // Set the underline color
    doc.setDrawColor(0, 0, 0); // RGB color for the underline

    // Draw the original-size underline
    const underlineLength1 = textWidth + 20; // Length of the underline
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

    // Define the source element (your HTML table)
    var source = $('#' + idTable)[0];

    // Generate the PDF from the table, starting below the text
    doc.autoTable({
        html: source,
        startY: 80, // Adjusted start position below the text
        margin: { top: 20 },
        theme: 'grid',
        styles: { fillColor: false, textColor: 0 ,            halign: 'center', // Center align the text in each column
            valign: 'middle',  // Vertical alignment to middle
            fontSize: 7    
        },
        headerStyles: { fillColor: '#9c4298', textColor: 255, fontSize: 7 },
    });
    doc.addImage("images/footer_reporting.png", "JPEG", 6, 276, 200, 20);

    // Save or download the PDF
    doc.save('Reporting_' + name + '.pdf');
    // doc.save('Reporting_change_hostel.pdf');
}


function generatePDFBasicDisciplineProgram(name, idTable) {
    window.jsPDF = window.jspdf.jsPDF; //nie pnting utk call jspdf pnya library
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
    timeStampPdf(doc);


    // Image dimensions
    var originalWidth = 275.59; // Replace with the actual width of your image
    var originalHeight = 67.818; // Replace with the actual height of your image

    // Calculate the new width and height (60% of A4 width while maintaining aspect ratio)
    var newWidth = 0.6 * a4Width;
    var newHeight = (newWidth / originalWidth) * originalHeight;

    // Calculate the X-coordinate to center the image on the A4 page
    var xCoordinate = (a4Width - newWidth) / 2;

    // Add the image to the document with the calculated width, height, and centered position
    doc.addImage("images/logo_reporting.png", "JPEG", xCoordinate, 10, newWidth, newHeight);

    doc.setFont("helvetica", "bold");
    var textCenterX = doc.internal.pageSize.width / 2;
    doc.setFontSize(14); // Set the font size to 10
    doc.text('BAHAGIAN HAL EHWAL PELAJAR DAN ALUMNI', textCenterX, 50, { align: "center" });

    

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13); // Set the font size to 8
    var textCenterX = doc.internal.pageSize.width / 2;
    doc.text('UNIT PEMBANGUNAN HOLISTIK MAHASISWA', textCenterX, 58, { align: "center" });


    const text ="Reporting " + name ;
    doc.setFontSize(15);
    // Set the font type for the text
    doc.setFont("helvetica", "bold");
    const textWidth = doc.getTextWidth(text);
    // Set the position for the text
    const textX = 15; // X position
    const textY = 80; // Y position



    doc.text(text, textX, textY);

    // Set the underline color
    doc.setDrawColor(0, 0, 0); // RGB color for the underline

    // Draw the original-size underline
    const underlineLength1 = textWidth + 20; // Length of the underline
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

    // Define the source element (your HTML table)
    var source = $('#' + idTable)[0];

    // Generate the PDF from the table, starting below the text
    doc.autoTable({
        html: source,
        startY: 90, // Adjusted start position below the text
        margin: { top: 20 },
        theme: 'grid',
        styles: { fillColor: false, textColor: 0 },
        headerStyles: { fillColor: '#9c4298', textColor: 255 },
    });
    doc.addImage("images/footer_reporting.png", "JPEG", 6, 276, 200, 20);

    // Save or download the PDF
    doc.save('Reporting_' + name + '.pdf');
    // doc.save('Reporting_change_hostel.pdf');
}
function generatePDFProgram(name, idTable, tMula, tAkhir, JProgram) {
    window.jsPDF = window.jspdf.jsPDF; //nie pnting utk call jspdf pnya library
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
    timeStampPdf(doc);


    // Image dimensions
    var originalWidth = 275.59; // Replace with the actual width of your image
    var originalHeight = 67.818; // Replace with the actual height of your image

    // Calculate the new width and height (60% of A4 width while maintaining aspect ratio)
    var newWidth = 0.6 * a4Width;
    var newHeight = (newWidth / originalWidth) * originalHeight;

    // Calculate the X-coordinate to center the image on the A4 page
    var xCoordinate = (a4Width - newWidth) / 2;

    // Add the image to the document with the calculated width, height, and centered position
    doc.addImage("images/logo_reporting.png", "JPEG", xCoordinate, 10, newWidth, newHeight);

    doc.setFont("helvetica", "bold");
    var textCenterX = doc.internal.pageSize.width / 2;
    doc.setFontSize(14); // Set the font size to 10
    doc.text('BAHAGIAN HAL EHWAL PELAJAR DAN ALUMNI', textCenterX, 50, { align: "center" });

    

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13); // Set the font size to 8
    var textCenterX = doc.internal.pageSize.width / 2;
    doc.text('UNIT PEMBANGUNAN HOLISTIK MAHASISWA', textCenterX, 58, { align: "center" });


    const text ="Reporting " + name ;
    doc.setFontSize(15);
    // Set the font type for the text
    doc.setFont("helvetica", "bold");
    const textWidth = doc.getTextWidth(text);
    // Set the position for the text
    const textX = 15; // X position
    const textY = 80; // Y position

    doc.text(text, textX, textY);

    /////////////////

    const text4 ="Start Date : " +tMula;
    doc.setFontSize(15);
    doc.setFont("helvetica", "normal");
    const textWidth4 = doc.getTextWidth(text4);
    const textX4 = 15; // X position
    const textY4 = 90; // Y position
    doc.text(text4, textX4, textY4);

    const text2 ="End Date : " + tAkhir ;
    doc.setFontSize(15);
    doc.setFont("helvetica", "normal");
    const textWidth2 = doc.getTextWidth(text2);
    const textX2 = 15; // X position
    const textY2 = 95; // Y position
    doc.text(text2, textX2, textY2);

    const text3 ="Category Program : " +JProgram;
    doc.setFontSize(15);
    doc.setFont("helvetica", "normal");
    const textWidth3 = doc.getTextWidth(text3);
    const textX3 = 15; // X position
    const textY3 = 100; // Y position
    doc.text(text3, textX3, textY3);

    //////////////////



    // Set the underline color
    doc.setDrawColor(0, 0, 0); // RGB color for the underline

    // Draw the original-size underline
    const underlineLength1 = textWidth + 20; // Length of the underline
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

    // Define the source element (your HTML table)
    var source = $('#' + idTable)[0];

    // Generate the PDF from the table, starting below the text
    doc.autoTable({
        html: source,
        startY: 105, // Adjusted start position below the text
        margin: { top: 20 },
        theme: 'grid',
        styles: { fillColor: false, textColor: 0 },
        headerStyles: { fillColor: '#9c4298', textColor: 255 },
    });
    doc.addImage("images/footer_reporting.png", "JPEG", 6, 276, 200, 20);

    // Save or download the PDF
    doc.save('Reporting_' + name + '.pdf');
    // doc.save('Reporting_change_hostel.pdf');
}

function generatePDFDiscipline(name, idTable, month) {
    window.jsPDF = window.jspdf.jsPDF; //nie pnting utk call jspdf pnya library
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
    timeStampPdf(doc);


    // Image dimensions
    var originalWidth = 275.59; // Replace with the actual width of your image
    var originalHeight = 67.818; // Replace with the actual height of your image

    // Calculate the new width and height (60% of A4 width while maintaining aspect ratio)
    var newWidth = 0.6 * a4Width;
    var newHeight = (newWidth / originalWidth) * originalHeight;

    // Calculate the X-coordinate to center the image on the A4 page
    var xCoordinate = (a4Width - newWidth) / 2;

    // Add the image to the document with the calculated width, height, and centered position
    doc.addImage("images/logo_reporting.png", "JPEG", xCoordinate, 10, newWidth, newHeight);

    doc.setFont("helvetica", "bold");
    var textCenterX = doc.internal.pageSize.width / 2;
    doc.setFontSize(14); // Set the font size to 10
    doc.text('BAHAGIAN HAL EHWAL PELAJAR DAN ALUMNI', textCenterX, 50, { align: "center" });

    

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13); // Set the font size to 8
    var textCenterX = doc.internal.pageSize.width / 2;
    doc.text('UNIT PEMBANGUNAN HOLISTIK MAHASISWA', textCenterX, 58, { align: "center" });


    const text ="Reporting " + name ;
    doc.setFontSize(15);
    // Set the font type for the text
    doc.setFont("helvetica", "bold");
    const textWidth = doc.getTextWidth(text);
    // Set the position for the text
    const textX = 15; // X position
    const textY = 80; // Y position

    doc.text(text, textX, textY);

    const text4 ="Month : " +month;
    doc.setFontSize(15);
    doc.setFont("helvetica", "normal");
    const textWidth4 = doc.getTextWidth(text4);
    const textX4 = 15; // X position
    const textY4 = 90; // Y position
    doc.text(text4, textX4, textY4);


    // Set the underline color
    doc.setDrawColor(0, 0, 0); // RGB color for the underline

    // Draw the original-size underline
    const underlineLength1 = textWidth + 20; // Length of the underline
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

    // Define the source element (your HTML table)
    var source = $('#' + idTable)[0];

    // Generate the PDF from the table, starting below the text
    doc.autoTable({
        html: source,
        startY: 95, // Adjusted start position below the text
        margin: { top: 20 },
        theme: 'grid',
        styles: { fillColor: false, textColor: 0 },
        headerStyles: { fillColor: '#9c4298', textColor: 255 },
    });
    doc.addImage("images/footer_reporting.png", "JPEG", 6, 276, 200, 20);

    // Save or download the PDF
    doc.save('Reporting_' + name + '.pdf');
    // doc.save('Reporting_change_hostel.pdf');
}

function generatePDFBasicKaunseling(name, idTable) {
    window.jsPDF = window.jspdf.jsPDF; //nie pnting utk call jspdf pnya library
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

    timeStampPdf(doc);

    // Image dimensions
    var originalWidth = 275.59; // Replace with the actual width of your image
    var originalHeight = 67.818; // Replace with the actual height of your image

    // Calculate the new width and height (60% of A4 width while maintaining aspect ratio)
    var newWidth = 0.6 * a4Width;
    var newHeight = (newWidth / originalWidth) * originalHeight;

    // Calculate the X-coordinate to center the image on the A4 page
    var xCoordinate = (a4Width - newWidth) / 2;

    // Add the image to the document with the calculated width, height, and centered position
    doc.addImage("images/logo_reporting.png", "JPEG", xCoordinate, 10, newWidth, newHeight);

    doc.setFont("helvetica", "bold");
    var textCenterX = doc.internal.pageSize.width / 2;
    doc.setFontSize(14); // Set the font size to 10
    doc.text('BAHAGIAN HAL EHWAL PELAJAR DAN ALUMNI', textCenterX, 50, { align: "center" });

    

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13); // Set the font size to 8
    var textCenterX = doc.internal.pageSize.width / 2;
    doc.text('UNIT KAUNSELING DAN KEBAJIKAN', textCenterX, 58, { align: "center" });


    const text ="Reporting " + name ;
    doc.setFontSize(15);
    // Set the font type for the text
    doc.setFont("helvetica", "bold");
    const textWidth = doc.getTextWidth(text);
    // Set the position for the text
    const textX = 15; // X position
    const textY = 80; // Y position



    doc.text(text, textX, textY);

    // Set the underline color
    doc.setDrawColor(0, 0, 0); // RGB color for the underline

    // Draw the original-size underline
    const underlineLength1 = textWidth + 20; // Length of the underline
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

    // Define the source element (your HTML table)
    var source = $('#' + idTable)[0];

    // Generate the PDF from the table, starting below the text
    doc.autoTable({
        html: source,
        startY: 90, // Adjusted start position below the text
        margin: { top: 40 },
        theme: 'grid',
        styles: { fillColor: false, textColor: 0 },
        headerStyles: { fillColor: '#9c4298', textColor: 255 },
    });
    doc.addImage("images/footer_reporting.png", "JPEG", 6, 276, 200, 20);

    // Save or download the PDF
    doc.save('Reporting_' + name + '.pdf');
    // doc.save('Reporting_change_hostel.pdf');
}


function timeStampPdf(doc) {
    const now = new Date();
    const options = { timeZone: 'Asia/Kuala_Lumpur', year: 'numeric', month: '2-digit', day: '2-digit' };
    const formatter = new Intl.DateTimeFormat('en-GB', options);
    const [{ value: day },, { value: month },, { value: year }] = formatter.formatToParts(now);
    const formattedDate = `${day}/${month}/${year}`;

    const text = `Date Generated: ${formattedDate}`;
    var pageWidth = doc.internal.pageSize.getWidth();
    var textWidth = doc.getTextWidth(text);
    var xPosition = pageWidth - textWidth + 19; // Subtract 10 for some right padding
    var yPosition = 10;

    doc.setFontSize(10);
    doc.text(text, xPosition, yPosition);
}


  
