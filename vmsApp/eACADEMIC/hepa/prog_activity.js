var kateProg1 = '01', kateProg2 = '02', kateProg3 = '03', kateProg4 = '04', datekat_01 = '', datekat_02 = '', datekat_03 = '', datekat_04 = '';




$(function () {
    $.ajaxSetup({
        cache: false
    });

    let userId = window.sessionStorage.usrId;
    let catAdmin = window.sessionStorage.usrCatEadmin;
    let userRole = window.sessionStorage.userRole;

    $('#userId').val(userId);
    
    // select Campus List
    campusList(function () {
        $('#clg_id').append('<option value="">- Choose -</option>');
        $('#upt_clg_id').append('<option value="">- Choose -</option>');
        $.each(obj_college.data, function (i, item) {
            $('#clg_id').append('<option value="' + item.pk_id + '">' + item.clg_name + '</option>');
            $('#upt_clg_id').append('<option value="' + item.pk_id + '">' + item.clg_name + '</option>');
        });
    });

    listProgActivity(function () {
        let dataList = obj_progAct.data;
        createTbl(dataList, userRole);
    });
    // countKatProgram(kateProg1);
    // countKatProgram(kateProg2);
    // countKatProgram(kateProg3);
    // countKatProgram(kateProg4);
    // // listProgramAll();
    // setIntervalDateKat();
    reportingProgram();
});
$('#formFilterPDF').submit(function (e) {

    e.preventDefault(); // Prevent the default form submission
    reportingProgram();

})

// function setIntervalDateKat(){
//     var countDownDate = new Date().getTime();
//     var x = setInterval(function () {
//         if(datekat_01 != $("#datekat_01").val()){
//             datekat_01 = $("#datekat_01").val();
//             if(datekat_01 != ""){
//                 dateBudget(kateProg1,$("#datekat_01").val());
//             }
//         }
//     }, 1000);

// }



// Usage

// function setIntervalDateKat(){
//     var countDownDate = new Date().getTime();
//     var x = setInterval(function () {
//         if(datekat_01 != $("#datekat_01").val()){
//                         datekat_01 = $("#datekat_01").val();
//                         if(datekat_01 != ""){
//                             dateBudget(kateProg1,$("#datekat_01").val());
//                         }
//                     }

//         else if(datekat_02 != $("#datekat_02").val()){
//             datekat_02 = $("#datekat_02").val();
//             if(datekat_02 != ""){
//                 dateBudget(kateProg2,$("#datekat_02").val());
//             }

//         }
//         else if(datekat_03 != $("#datekat_03").val()){
//             datekat_03 = $("#datekat_03").val();
//             if(datekat_03 != ""){
//                 dateBudget(kateProg3,$("#datekat_03").val());
//             }

//         }
//         else if(datekat_04 != $("#datekat_04").val()){
//             datekat_04 = $("#datekat_04").val();
//             if(datekat_04 != ""){
//                 dateBudget(kateProg4,$("#datekat_04").val());
//             }

//         }
//     }, 1000);

// }



var confirmed = false;


// check format file before upload
$(".chkProposal").on("change", function () {
    // check size
    if (this.files[0].size > 5000000) {
        alert("Please upload file less than 5MB. Thanks!!");
        $(this).val('');
    }

    // check type
    var extension = $($(this)).val().split('.').pop().toLowerCase();
    // if ($.inArray(extension, ['pdf']) == -1) {
        if (extension !== 'pdf') {
        
        alert('Please upload PDF file only.');
        $(this).val('');
    }
});


//-------------------------------------------------- add activity --------------------------------------------------//
$('#formAddActivity').on('submit', function (e) {
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Add Program & Activity",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let clg_id = $('#clg_id').val();
            let prog_title = $('#prog_title').val();
            let prog_org = $('#prog_org').val();
            let prog_kat = $('#prog_kat').val();
            let prog_vent = $('#prog_vent').val();
            let prog_advisor = $('#prog_advisor').val();
            let prog_venue = $('#prog_venue').val();
            // let prog_startdate = $('#prog_startdate').val();
            let prog_startdate = convertDateFormat($('#prog_startdate').val());
            let prog_enddate = convertDateFormat($('#prog_enddate').val());
// alert(prog_enddate);
            // convertDateFormat($('#checkOut').val()
            // let prog_enddate = $('#prog_enddate').val();
            let prog_proposal = $('#prog_proposal')[0].files[0];
            let user_id = $('#userId').val();
            let prog_cost = $('#prog_cost').val();
            let prog_peruntukan = $('#prog_peruntukan').val();
            let prog_participate = $('#total_particapate').val();

            var form = new FormData();
            form.append("clg_id", clg_id);
            form.append("prog_title", prog_title);
            form.append("prog_org", prog_org);
            form.append("prog_category_id", prog_kat);
            form.append("prog_vent", prog_vent);
            form.append("prog_advisor", prog_advisor);
            form.append("prog_venue", prog_venue);
            form.append("prog_startdate", prog_startdate);
            form.append("prog_enddate", prog_enddate);
            form.append("prog_proposal", prog_proposal);
            form.append("user_id", user_id);
            form.append("prog_cost", prog_cost);
            form.append("prog_peruntukan", prog_peruntukan);
            form.append("prog_participate", prog_participate);
            form.append("user_type", 'Staf');
            form.append("prog_status", 'New');
            form.append("recordstatus", 'ADD');


            var settings = {
                "url": host + "api_hep/public/hepProgram/register",
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
                window.location.reload();
            });
        });
    }
});
//-------------------------------------------------- end add activity --------------------------------------------------//


//-------------------------------------------------- loadData --------------------------------------------------//
function loadData(indexs) {
    let data = JSON.parse($("#dataList").val());
    console.log(data[indexs].prog_status);
    $('#id_program').val(data[indexs].id_program);
    $('#upt_clg_id').val(data[indexs].clgId);
    $('#upt_prog_title').val(data[indexs].prog_title);
    $('#upt_prog_org').val(data[indexs].prog_org);
    $('#upt_prog_kat').val(data[indexs].prog_category_id);
    $('#upt_prog_vent').val(data[indexs].prog_vent);
    $('#upt_prog_advisor').val(data[indexs].prog_advisor);
    $('#upt_prog_venue').val(data[indexs].prog_venue);
    $('#upt_prog_startdate').val(data[indexs].prog_startdate);
    $('#upt_prog_enddate').val(data[indexs].prog_enddate);
    $('#prog_status').val(data[indexs].prog_status);
    $('#prog_statusremark').val(data[indexs].prog_statusremark);
    $('#upt_prog_alloc_approve').val(data[indexs].prog_alloc_approve);
    $('#upt_prog_status').val(data[indexs].prog_status);

    $('#upt_prog_cost').val(data[indexs].prog_cost);
    $('#upt_prog_peruntukan').val(data[indexs].prog_peruntukan);
    $('#upt_total_particapate').val(data[indexs].prog_participate);
    if (!(data[indexs].prog_proposal == '' || data[indexs].prog_proposal == null)) {
        $('#view_prog_proposal').html('<a target="_blank" class="btn btn-icon primary" href="' + host + 'api_hep/public/proposal/' + data[indexs].prog_proposal + '" title="' + data[indexs].prog_proposal + '"><i class="fa fa-file-pdf-o"></i></a>');
        $('#exist_prog_proposal').val(data[indexs].prog_proposal);
    }
    else {
        $('#view_prog_proposal').html('<button type="button" class="btn btn-icon"><i class="fa fa-file-pdf-o"></i></button>');
        $('#exist_prog_proposal').val('');
    }

    $("#update-program").modal("show");
}

function viewData(indexs) {
    let data = JSON.parse($("#dataList").val());
    console.log(data);
    let progStatus = data[indexs].prog_status;
    let progProposal = data[indexs].prog_proposal;
    let startDate = data[indexs].prog_startdate;
    let endDate = data[indexs].prog_enddate;
    let docUpl = data[indexs].prog_proposal.slice(10);
    let viewProposal = '';

    if (progStatus == 'New') {
        progStatus = '<span class="label warning text-uppercase">' + progStatus + '</span>';
    }
    else if (progStatus == 'Accept') {
        progStatus = '<span class="label success text-uppercase">' + progStatus + '</span>';
    }
    else if (progStatus == 'Reject') {
        progStatus = '<span class="label danger text-uppercase">' + progStatus + '</span>';
    }

    if (!(progProposal == '' || progProposal == null)) {
        viewProposal = '<a target="_blank" style="color:cornflowerblue" href="' + host + 'api_hep/public/proposal/' + data[indexs].prog_proposal + '"><span class="label info">' + docUpl + '</span></a>';
    }
    $('#view_clg_id').html(data[indexs].clg_name);
    $('#view_prog_title').html(data[indexs].prog_title);
    $('#view_prog_org').html(data[indexs].prog_org);
    $('#view_prog_kat').html(data[indexs].prog_category_id);
    $('#view_prog_vent').html(data[indexs].prog_vent);
    $('#view_prog_advisor').html(data[indexs].prog_advisor);
    $('#view_prog_venue').html(data[indexs].prog_venue);
    $('#view_prog_date').html(formatDate(startDate) + ' - ' + formatDate(endDate));
    $('#view_prog_cost').html('RM ' + data[indexs].prog_cost);
    $('#view_prog_peruntukan').html('RM ' + data[indexs].prog_peruntukan);
    $('#view_prog_status').html(progStatus);
    $('#view_prog_statusremark').html(data[indexs].prog_statusremark);
    $('#view_progProposal').html(viewProposal);
    // $('#prog_alloc_approve').html(prog_alloc_approve);

    $("#view-program").modal("show");
}
//-------------------------------------------------- end loadData --------------------------------------------------//

//-------------------------------------------------- update new data --------------------------------------------------//
$('#formUptProgramme').on('submit', function (e) {
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Update Program & Activity",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let id_program = $('#id_program').val();
            let clg_id = $('#upt_clg_id').val();
            let prog_title = $('#upt_prog_title').val();
            let prog_org = $('#upt_prog_org').val();
            let upt_prog_kat = $('#upt_prog_kat').val();
            let prog_vent = $('#upt_prog_vent').val();
            let prog_advisor = $('#upt_prog_advisor').val();
            let prog_venue = $('#upt_prog_venue').val();
            let prog_startdate = $('#upt_prog_startdate').val();
            let prog_enddate = $('#upt_prog_enddate').val();
            let prog_proposal = $('#upt_prog_proposal')[0].files[0];
            let exist_prog_proposal = $('#exist_prog_proposal').val();
            let prog_status = $('#upt_prog_status').val();
            let prog_statusremark = $('#prog_statusremark').val();
            let prog_cost = $('#upt_prog_cost').val();
            let prog_peruntukan = $('#upt_prog_peruntukan').val();
            let prog_participate = $('#upt_total_particapate').val();
            let prog_alloc_approve = $('#upt_prog_alloc_approve').val();
            

            var form = new FormData();
            form.append("id_program", id_program);
            form.append("clg_id", clg_id);
            form.append("prog_title", prog_title);
            form.append("prog_org", prog_org);
            form.append("prog_category_id", upt_prog_kat);
            form.append("prog_vent", prog_vent);
            form.append("prog_advisor", prog_advisor);
            form.append("prog_venue", prog_venue);
            form.append("prog_startdate", prog_startdate);
            form.append("prog_enddate", prog_enddate);
            form.append("prog_proposal", prog_proposal);
            form.append("exist_prog_proposal", exist_prog_proposal);
            form.append("prog_status", prog_status);
            form.append("prog_statusremark", prog_statusremark);
            form.append("prog_cost", prog_cost);
            form.append("prog_peruntukan", prog_peruntukan);
            form.append("prog_participate", prog_participate);
            form.append("prog_alloc_approve", prog_alloc_approve);
            form.append("notify_user", 'Yes');
            form.append("recordstatus", 'EDT');

            var settings = {
                "url": host + "api_hep/public/hepProgram/update",
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
                window.location.reload();
            });
        });
    }
});
//-------------------------------------------------- end update new data --------------------------------------------------//






function countKatProgram(kat_program) {
    // console.log(kat_program);
    kat_program_id = kat_program;


    if (kat_program == '01') {
        prog_category_id = 'External Invitation';

    } else if (kat_program == '02') {
        prog_category_id = 'Creditable Activities';

    } else if (kat_program == '03') {
        prog_category_id = 'Non-Credit Activities';

    } else if (kat_program == '04') {
        prog_category_id = 'Lain-lain';


    }
    // console.log(prog_category_id);


    var form = new FormData();
    form.append("prog_category_id", prog_category_id);

    // 


    var settings = {
        "url": host + "api_hep/public/hepProgram/countbyKat",
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

        count = JSON.parse(response);
        countTotal = count;
        $("#kat_" + (kat_program)).html(count.data.total);

        // returnValue();
    });
}

// function setIntervalDateKat() {
//     // Define an array to store date and program IDs
//     var dateAndPrograms = [
//         { dateId: "datekat_01", programId: kateProg1 },
//         { dateId: "datekat_02", programId: kateProg2 },
//         { dateId: "datekat_03", programId: kateProg3 },
//         { dateId: "datekat_04", programId: kateProg4 }
//     ];

//     var previousValues = {};

//     var x = setInterval(function () {
//         dateAndPrograms.forEach(function (item) {
//             var dateId = item.dateId;
//             // console.log(dateId);

//             var programId = item.programId;

//             var currentValue = $("#" + dateId).val();
//             var previousValue = previousValues[dateId];
//             if (currentValue !== previousValue) {
//                 previousValues[dateId] = currentValue;

//                 if (currentValue !== "") {
//                     dateBudget(programId, currentValue);
//                 } else {
//                     dateBudget(programId, '0');

//                 }
//             }
//         });
//     }, 1000);
// }

// function dateBudget(kat_program, date) {


//     if (kat_program == '01') {
//         prog_category_id = 'External Invitation';

//     } else if (kat_program == '02') {
//         prog_category_id = 'Creditable Activities';

//     } else if (kat_program == '03') {
//         prog_category_id = 'Non-Credit Activities';

//     } else if (kat_program == '04') {
//         prog_category_id = 'Lain-lain';


//     }

//     date = date.split(`/`);
//     month = date[0];
//     year = date[1];

//     // console.log(month + " X " + year+ " id =  "+ prog_category_id);
//     var form = new FormData();
//     form.append("prog_category_id", prog_category_id);
//     form.append("month", month);
//     form.append("year", year);

//     var settings = {
//         "url": host + "api_hep/public/hepProgram/TotalBudget",
//         "method": "POST",
//         "timeout": 0,
//         "headers": {
//             "Authorization": "picoms " + window.sessionStorage.token
//         },
//         "processData": false,
//         "mimeType": "multipart/form-data",
//         "contentType": false,
//         "data": form
//     };

//     $.ajax(settings).done(function (response) {
//         objCount = JSON.parse(response);
//         $("#budget_" + kat_program).html("RM " + objCount.Count);

//         // returnValue();
//     });
// }

function createTbl(listData, catAdmin) {

    var colums = [
        { "name": "bil", "title": "Bil." },
        { "name": "prog_title", "title": "Programme Name" },
        { "name": "prog_venue", "title": "Venue" },
        { "name": "prog_org", "title": "Organizer" },
        { "name": "prog_startdate", "title": "Date", "breakpoints": "md sm xs" },
        { "name": "prog_kat", "title": "Programme Category" },
        { "name": "date_apply", "title": "Date Application" },
        { "name": "prog_status", "title": "Status" },
        { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },

    ];

    let bil = 1;
    let convertList = JSON.stringify(listData);
    $("#dataList").val(convertList);
    var list = [];

    $.each(listData, function (i, field) {
        // console.log(field);
        let progStatus = field.prog_status;
        let prog_kat = field.prog_category_id;
        let btnDsply = '';
        if (progStatus == 'New') {
            progStatus = '<span class="label warning">' + progStatus + '</span>';
            btnDsply = '<button class="btn btn-icon success" title="Update" onclick="loadData(\'' + i + '\')"><i class="ion-android-create"></i></button> ' +
                '<button class="btn btn-icon danger" title="Delete" onclick="delData(\'' + field.id_program + '\')"><i class="ion-trash-a"></i></button>';
        }
        else if (progStatus == 'Accept') {
            progStatus = '<span class="label success">' + progStatus + '</span>';
            btnDsply = '<button class="btn btn-icon accent" title="Details" onclick="detail(\'' + field.id_program + '\', \'accept\')"><i class="ion-ios-list-outline"></i></button>';
        }
        else if (progStatus == 'Reject') {
            progStatus = '<span class="label danger">' + progStatus + '</span>';
            if (catAdmin == 1) {
                btnDsply = '<button class="btn btn-icon success" title="Update" onclick="loadData(\'' + i + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button> '
            }
            else { btnDsply = '<button class="btn btn-icon accent" title="View" onclick="viewData(\'' + i + '\')"><i class="ion-eye"></i></button>'; }
        }
        else if (progStatus == 'Approved') {
            progStatus = '<span class="label accent">' + progStatus + '</span>';
            btnDsply = '<button class="btn btn-icon accent" title="Details" onclick="detail(\'' + field.id_program + '\', \'approved\')"><i class="ion-ios-list-outline"></i></button>';
        }

        const newListCount = list.reduce((count, item) => item.prog_status.includes('New') ? count + 1 : count, 0);
        // console.log('Total New items: ' + newListCount);

        $('#totalNewApplied').html(`Total New Application: ` + newListCount)

        if (prog_kat !== null) {

            prog_kat = field.prog_category_id;

        } else {
            prog_kat = '-';

        }
        date = field.dateApplication !== null ? formatDate(field.dateApplication.split(" ")[0]) : ' - ';


        //    dateApplication_dummy = field.dateApplication !== null ? field.dateApplication : '-';


        list.push({
            bil: bil++,
            prog_title: field.prog_title,
            prog_venue: '<span class="text-uppercase">' + field.prog_venue + '</span>',
            prog_org: '<span class="text-uppercase">' + field.prog_org + '</span>',
            prog_startdate: formatDate(field.prog_startdate) + ' - ' + formatDate(field.prog_enddate),
            prog_kat: prog_kat,
            date_apply: date,
            prog_status: progStatus,
            upt_btn: btnDsply

        });

    });

    $("#tblProgActivity").footable({
        "columns": colums,
        "rows": list,
        "paging": {
            "enabled": true,
            "size": 10,
            "countFormat": "Showing {PF} to {PL} of {TR} data"
        },
        "filtering": {
            "enabled": true,
            "placeholder": "Search...",
            "dropdownTitle": "Search for:"
        }
    });

}


//-------------------------------------------------- delete program & activity --------------------------------------------------//
function delData(id) {
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("id_program", id);

    swal({
        title: "Remove Programme & Activity",
        text: "Are You Sure?",
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Remove",
        confirmButtonColor: "#ef193c",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false
    }).then(function () {
        var settings = {
            "url": host + "api_hep/public/hepProgram/delete",
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
            window.location.reload();
        });
    });
}
//-------------------------------------------------- end delete program & activity --------------------------------------------------//


// student list
function detail(id, statusRekod) {
    var form = new FormData();
    form.append("id_program", id);
    form.append("notify_user", 'No');

    var settings = {
        "url": host + "api_hep/public/hepProgram/uptNotifyUser",
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
    
    window.sessionStorage.idProgram = id;
    window.sessionStorage.statusRekod = statusRekod;
    window.location.replace('prog_student.html');
}

function listProgActivity(returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepProgram/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_progAct = response;
        returnValue();
    });
}

function reportingProgram(returnValue) {
    let tarikh_mula = $('#tarikh_mula').val();
    let tarikh_tamat = $('#tarikh_tamat').val();
    let prog_category_id = $('#prog_category_id').val();
            

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


    // var settings = {
    //     "url": host + "api_hep/public/hepProgram/reporting/reportProg",
    //     "method": "POST",
    //     "timeout": 0,
    //     "headers": {
    //         "Authorization": "picoms " + window.sessionStorage.token
    //     },
    // };

    $.ajax(settings).done(function (response) {
        // obj_ProgPDF = response;
        obj_ProgPDF = JSON.parse(response);



        var colums = [
            { "name": "bil", "title": "Bil.", "style": "text-align:center;" },
            { "name": "prog_title", "title": "Programme Name", "style": "text-align:center;" },
            { "name": "prog_startdate", "title": "Date", "breakpoints": "md sm xs", "style": "text-align:center;" },
            { "name": "prog_venue", "title": "Venue", "style": "text-align:center;" },
            { "name": "prog_org", "title": "Organizer", "style": "text-align:center;" },
            { "name": "prog_cost", "title": "Allocation Approved", "breakpoints": "md sm xs", "style": "text-align:center;" },
            { "name": "prog_kat", "title": "Programme Category", "style": "text-align:center;" },


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


            });

        });

        $("#report_ProgrammeTab").html('');
        $("#report_ProgrammeTab").footable({
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
}


// afiez utk generate excel file
function exportTableToXLSX() {
    var filename = 'report_ProgrammeTab';

    var data = [];
    var rows = document.querySelectorAll("#report_ProgrammeTab tbody tr");

    // Iterate through each row and extract the data
    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td");
        
        // Iterate through each cell in the row
        for (var j = 0; j < cols.length; j++) {
            var cellValue = cols[j].innerText;
            row.push(cellValue);
        }

        data.push(row);
    }

    // Create a workbook and worksheet
    var workbook = XLSX.utils.book_new();
    var wsName = "Sheet1";
    var wsData = XLSX.utils.aoa_to_sheet(data);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, wsData, wsName);

    // Generate the XLSX file
    var xlsxFile = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
    var xlsxBlob = new Blob([s2ab(xlsxFile)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Create a download link
    var downloadLink = document.createElement("a");
    downloadLink.download = filename + ".xlsx";
    downloadLink.href = URL.createObjectURL(xlsxBlob);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);

    // Click the download link
    downloadLink.click();
}

// Helper function to convert string to ArrayBuffer
function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

function tryParseJSON(jsonString) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      return null; // Return null if parsing fails
    }
  }