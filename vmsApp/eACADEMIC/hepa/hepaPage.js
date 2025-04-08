// const { default: Swal } = require("sweetalert2");
let token = window.sessionStorage.token;
let usrId = window.sessionStorage.usrId;

$(function () {
    $.ajaxSetup({
        cache: false
    });
    

    // checkCapaian(usrId, function () {});
    let content = window.sessionStorage.content;
    let usrName = window.sessionStorage.usrName;
    let catAdmin = window.sessionStorage.usrCatEadmin;
    let catHepa = window.sessionStorage.usrCatEhep;
    let userRole = window.sessionStorage.userRole;


    if (token == null && catHepa != 1) { window.location.replace("hepa_login.html"); }



    if (content != null) {
        $('#content').load(content + '.html');
    }
    else { $('#content').load('dashboard.html'); }

    let dsplyUsr = usrName.split(' ').map(item => item.toUpperCase().substring(0, 1)).join('').substring(0, 2);
    $('#dsplyUsr').html(dsplyUsr);
    $('#dsplyName').html(usrName);
    $('#dsplyId').html(usrId);

    let objCounter = new get(host + 'api_auth/public/getCounts/MenuSide/getCountsHepa', window.sessionStorage.token).execute();

    $('#alertProgram').html(objCounter.appliedProgrammeT);
    $('#alertApp').html(objCounter.counsellingTotalNew);
    $('#alertCompound').html(objCounter.disciplineTNew);
    $('#alertComplaint').html(objCounter.complaintTotalNew);
    $('#alertMenuDis').html((objCounter.complaintTotalNew + objCounter.disciplineTNew ));
    $('#alertMenuCoun').html(objCounter.counsellingTotalNew);


    $('#alertBooking').html(objCounter.bookingTotalNew);
    $('#alertChkInOut').html(objCounter.chkOutTotalNew);
    $('#alertChange').html(objCounter.changeTotalNew);
    $('#alerthostDmgCompl').html(objCounter.aduanTotalNew);
    $('#alertMenuHstl').html((objCounter.bookingTotalNew+objCounter.chkOutTotalNew+objCounter.changeTotalNew+objCounter.aduanTotalNew));

    
});



//-------------------------------------------------- btn Menu --------------------------------------------------//
$('#btnDashboard').click(function () {
    window.sessionStorage.content = "dashboard";
    $('#content').load('dashboard.html');
});

$('#prog_activity').click(function () {
    window.sessionStorage.content = "prog_activity";
    $('#content').load('prog_activity.html');
});

$('#discipline').click(function () {
    window.sessionStorage.content = "discipline";
    $('#content').load('discipline.html');
});

$('#compound').click(function () {
    window.sessionStorage.content = "compound";
    $('#content').load('compound.html');
});

$('#complaint').click(function () {
    window.sessionStorage.content = "complaint";
    $('#content').load('complaint.html');
});

$('#report').click(function () {
    window.sessionStorage.content = "report";
    $('#content').load('report.html');
});

$('#hostel_info').click(function () {
    window.sessionStorage.content = "hostel_info";
    $('#content').load('hostel_info.html');
});

$('#hostel_newStd').click(function () {
    window.sessionStorage.content = "hostel_newStd";
    $('#content').load('hostel_newStd.html');
});

$('#hostel_booking').click(function () {
    window.sessionStorage.content = "hostel_booking";
    $('#content').load('hostel_booking.html');
});

$('#hostel_change').click(function () {
    window.sessionStorage.content = "hostel_change";
    $('#content').load('hostel_change.html');
});

$('#hostel_chkInOut').click(function () {
    window.sessionStorage.content = "hostel_chkInOut";
    $('#content').load('hostel_chkInOut.html');
});

$('#application_type').click(function () {
    window.sessionStorage.content = "application_type";
    $('#content').load('application_type.html');
});

$('#counselor').click(function () {
    window.sessionStorage.content = "counselor";
    $('#content').load('counselor.html');
});

$('#apply_counselling').click(function () {
    window.sessionStorage.content = "apply_counselling";
    $('#content').load('apply_counselling.html');
});

$('#counselling_timetable').click(function () {
    window.sessionStorage.content = "counselling_timetable";
    $('#content').load('counselling_timetable.html');
});

$('#hepa_warden').click(function () {
    window.sessionStorage.content = "hepa_warden";
    $('#content').load('hepa_warden.html');
});


$('#hostel_complaint_type').click(function () {
    window.sessionStorage.content = "hostel_complaint_type";
    $('#content').load('hostel_complaint_type.html');
});
$('#hostel_dmg_complaint').click(function () {
    window.sessionStorage.content = "hostel_dmg_complaint";
    $('#content').load('hostel_dmg_complaint.html');
});

$('#accessRolesHepa').click(function () {
    window.sessionStorage.content = "accessRolesHepa";
    $('#content').load('accessRolesHepa.html');
});

$('#hepa_reportBaitulmal').click(function () {
    window.sessionStorage.content = "hepa_reportBaitulmal";
    $('#content').load('hepa_reportBaitulmal.html');
});

$('#hepa_reportUnreside').click(function () {
    window.sessionStorage.content = "hepa_reportUnreside";
    $('#content').load('hepa_reportUnreside.html');
});

$('#hepa_reportComplaint').click(function () {
    window.sessionStorage.content = "hepa_reportComplaint";
    $('#content').load('hepa_reportComplaint.html');
});
$('#hepa_listStd_reporting').click(function () {
    window.sessionStorage.content = "hepa_hostel_reportingListStd";
    $('#content').load('hepa_hostel_reportingListStd.html');
});

$('#hepa_hostel_summary').click(function () {
    window.sessionStorage.content = "hepa_hostel_summary";
    $('#content').load('hepa_hostel_summary.html');
});

$('#hepa_reportProgramme').click(function () {
    window.sessionStorage.content = "hepa_reportProgramme";
    $('#content').load('hepa_reportProgramme.html');
});

$('#hepa_reportDiscipline').click(function () {
    window.sessionStorage.content = "hepa_reportDiscipline";
    $('#content').load('hepa_reportDiscipline.html');
});

$('#hepa_reportKaunselor').click(function () {
    window.sessionStorage.content = "hepa_reportKaunselor";
    $('#content').load('hepa_reportKaunselor.html');
});

$('#hepa_reportCheckOut').click(function () {
    window.sessionStorage.content = "hepa_reportCheckOut";
    $('#content').load('hepa_reportCheckOut.html');
});

$('#hepa_reportCheckIn').click(function () {
    window.sessionStorage.content = "hepa_reportCheckIn";
    $('#content').load('hepa_reportCheckIn.html');
});

$('#hepa_reportDetails').click(function () {
    window.sessionStorage.content = "hepa_reportDetails";
    $('#content').load('hepa_reportDetails.html');
});

$('#hepa_reportChange').click(function () {
    window.sessionStorage.content = "hepa_reportChange";
    $('#content').load('hepa_reportChange.html');
});

$('#hepa_reportAssigned').click(function () {
    window.sessionStorage.content = "hepa_reportAssigned";
    $('#content').load('hepa_reportAssigned.html');
});






//-------------------------------------------------- end btn Menu --------------------------------------------------//


//-------------------------------------------------- Logout Button --------------------------------------------------//
$('#logKeluar').click(function () {
    var logoutAction = function () {
        // window.sessionStorage.clear();
        if (window.sessionStorage.from === 'SSO') {
            window.sessionStorage.clear();
            var redirectUrl = "https://cms.ucmi.edu.my/sso/";
            window.location.replace(redirectUrl);
        
        } else {
            
            window.sessionStorage.clear();
            window.location.reload();
        }
    };

    swal({
        title: "Logout",
        text: "Are you sure?",
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false
    }).then(logoutAction);
});


$('#btnWarden').click(function () {
    window.sessionStorage.userRole = "warden";
    window.location.reload();
});

$('#btnAdmin').click(function () {
    window.sessionStorage.userRole = "hepa";
    window.sessionStorage.content = "dashboard";
    window.location.reload();
});

$('#btnLectrurer').click(function () {
    window.sessionStorage.userRole = "staf";
    window.sessionStorage.content = "dashboard";
    window.location.reload();
});

$('#btnKaunselor').click(function () {
    window.sessionStorage.userRole = "kaunselor";
    window.sessionStorage.content = "apply_counselling";
    window.location.reload();
});

$('#btnFinancial').click(function () {
    window.sessionStorage.userRole = "financial";
    window.sessionStorage.content = "dashboard";
    window.location.reload();
});
//-------------------------------------------------- end btn Role --------------------------------------------------//


function alertBooking(returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepHostelBooking/countAlert",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_alertBook = response;
        returnValue();
    });
}

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

function alertProgram(returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepProgram/countAlert",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_alertProgram = response;
        returnValue();
    });
}

function alertProgAccByUsr(id, returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepProgram/countAccProg/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_alertProgAcc = response;
        returnValue();
    });
}

function alertCompound(returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepDiscipline/countAlrtAdmin",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_compound = response;
        returnValue();
    });
}

function alertCounNew(returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepCounselling/alertCounNew",
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

function notifyChkIn(returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepHostelChkinout/notifyChkIn",
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

function notifyAdminChkOut(returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepHostelChkinout/notifyAdminChkOut",
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

