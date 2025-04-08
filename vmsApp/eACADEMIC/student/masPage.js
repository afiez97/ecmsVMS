var listPrint = [];

$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let content = window.sessionStorage.content;
    let token = window.sessionStorage.token;
    let studId = window.sessionStorage.std_studentid;
    $('#studId').html(studId);

    if( content != null ){ $('#content').load(content+'.html'); }
    else{ $('#content').load('stud_dashboard.html'); }
    
    if( token == null ){ window.location.replace("picoms_login.html"); }

    student_info(studId, function(){
        let data = obj_stdInfo.data;

        $('#studName').html(data.sti_name);


// Check if the sti_image is a base64 string or a URL
if (data.sti_image && data.sti_image.startsWith('data:image')) {
    avatarOr = data.sti_image;
} else if (data.sti_image) {
    avatarOr = host + data.sti_image;
} else {

    // console.log(data);
    menOrGirl = data.sti_gender_name === 'Female' ? 'api_pengurusan_pelajar/public/student_girl_avatar.png' : 'api_pengurusan_pelajar/public/student_boy_avatar.png';

    avatarOr = host + menOrGirl;
}

// Set the src attribute of the image
$("#menu_image").prop('src', avatarOr);

// Remove the hide class to make sure the image is visible
$("#menu_image").removeClass('hide');
    });

    $('.alertBadge').hide();

    alertCompound(studId, function(){
        let count = obj_compound.data.length;
        if(count != 0){
            $('#alertCompound').show();
            $('#alertCompound').html(count);
            $('#alertMenuDis').show();
        }
    });

    // alert booking status==accepted
    alertBookStd(studId, function(){
        let count = obj_alertBook.data.length;
        if(count != 0){
            $('#alertBooking').show();
            $('#alertBooking').html(count);
            $('#alertMenuHstl').show();
        }
    });

    // alert change hostel status==Reject && notify_std==Yes
    notifyStdReject(studId, function(){
        let count = obj_hstlChg.data.length;
        if(count != 0){
            $('#alertChg').show();
            $('#alertChg').html(count);
            $('#alertMenuHstl').show();
        }
    });

    // alert counseling status==Accept
    alertAppCounselor(studId, function(){
        let count = obj_coun.data.length;
        if(count != 0){
            $('#alertMenuCoun').html(count);
            $('#alertMenuCoun').show();
        }
        else{ $('#alertMenuCoun').hide() }
        
    });

    // alert check in out checkin!=Check In
    alertStdNew(studId, function(){
        let count = obj_chkInOut.data.length;
        if(count != 0){
            $('#alertChkInOut').show();
            $('#alertChkInOut').html(count);
            $('#alertMenuHstl').show();
        }
    });

    // alert report notify
    alertReport(studId, function(){
        let count = obj_aduan.data.length;
        if(count != 0){
            $('#alertReport').show();
            $('#alertReport').html(count);
            $('#alertMenuDis').show();
        }
    });

    // alertNotifyProg(studId, function(){
    //     let count = obj_alertProgAcc.data.length;
    //     if(count != 0 ){
    //         $('#alertMenuProg').html(count);
    //         $('#alertMenuProg').show();
    //     }
    // });
});


//-------------------------------------------------- btn menu --------------------------------------------------//
$('#btnDashboard').click(function(){
    window.sessionStorage.removeItem("content");
    window.location.reload();
});

$('#pljr_info').click(function(){
    window.sessionStorage.content = "pljr_info";
    $('#content').load('pljr_info.html');
});

$('#pljr_ibuBapaWaris').click(function(){
    window.sessionStorage.content = "pljr_ibuBapaWaris";
    $('#content').load('pljr_ibuBapaWaris.html');
});

$('#pljr_alamatNoTel').click(function(){
    window.sessionStorage.content = "pljr_alamatNoTel";
    $('#content').load('pljr_alamatNoTel.html');
});

// Course Registration
$('#pljr_daftarKursus').click(function(){
    window.sessionStorage.content = "pljr_daftarKursus";
    $('#content').load('pljr_daftarKursus.html');
});

// Course Registration
$('#pljr_daftarInfo').click(function(){
    window.sessionStorage.content = "pljr_daftarInfo";
    $('#content').load('pljr_daftarInfo.html');
});

// Credit Exemption
$('#pljr_mohonCE').click(function(){
    window.sessionStorage.content = "pljr_mohonCE";
    $('#content').load('pljr_mohonCE.html');
});

// Programme Change
$('#tukarProgram').click(function(){
    window.sessionStorage.content = "tukarProgram";
    $('#content').load('tukarProgram.html');
});

// Withdraw
$('#borangBerhenti').click(function(){
    window.sessionStorage.content = "borangBerhenti";
    $('#content').load('borangBerhenti.html');
});

$('#pljr_crsAchievement').click(function(){
    window.sessionStorage.content = "pljr_crsAchievement";
    $('#content').load('pljr_crsAchievement.html');
});

// $('#pljr_resultExam').click(function(){
//     window.sessionStorage.content = "pljr_resultExam";
//     $('#content').load('pljr_resultExam.html');
// });

$('#pljr_slipExam').click(function(){
    window.sessionStorage.content = "pljr_slipExam";
    $('#content').load('pljr_slipExam.html');
});

$('#pljr_slipOther').click(function(){
    window.sessionStorage.content = "pljr_slipOther";
    $('#content').load('pljr_slipOther.html');
});

$('#pljr_auditTmtPengajian').click(function(){
    window.sessionStorage.content = "pljr_auditTmtPengajian";
    $('#content').load('pljr_auditTmtPengajian.html');
});

$('#penyata_kewangan').click(function(){
    window.sessionStorage.content = "penyata_kewangan";
    $('#content').load('penyata_kewangan.html');
});

$('#prog_activity').click(function(){
    window.sessionStorage.content = "prog_activity";
    $('#content').load('prog_activity.html');
});

$('#comp_stud').click(function(){
    window.sessionStorage.content = "comp_stud";
    $('#content').load('comp_stud.html');
});

$('#report_std').click(function(){
    window.sessionStorage.content = "report_std";
    $('#content').load('report_std.html');
});

$('#hstl_book_stud').click(function(){
    window.sessionStorage.content = "hstl_book_stud";
    $('#content').load('hstl_book_stud.html');
});

$('#hstl_chkInOut_std').click(function(){
    window.sessionStorage.content = "hstl_chkInOut_std";
    $('#content').load('hstl_chkInOut_std.html');
});

$('#hstl_chg_std').click(function(){
    window.sessionStorage.content = "hstl_chg_std";
    $('#content').load('hstl_chg_std.html');
});

$('#apply_coun_std').click(function(){
    window.sessionStorage.content = "apply_coun_std";
    $('#content').load('apply_coun_std.html');
});

$('#downloadUsrManual_Std').click(function(){
    // window.sessionStorage.content = "downloadUsrManual_Std";
    // $('#content').load('apply_coun_std.html');
    // e.preventDefault();  //stop the browser from following
    valFileDownloadPath =host+"api_pengurusan_pelajar/public/User Manual Student Portal - CECT.pdf";
    // valFileDownloadPath =host+'api_pengurusan_pelajar/public/UsrManualStd.pdf';
    $.get(valFileDownloadPath)
    .done(function() { 
        window.open(valFileDownloadPath , '_blank');
    }).fail(function() { 
        // alert('User Manual Not Available Right Now');

     swal('Hey '+window.sessionStorage.std_studentid+'!', 'User Manual Not Available Right Now!', 'info');

    })
 

});


$('#pljr_courseList').click(function(){
    window.sessionStorage.content = "pljr_courseList";
    $('#content').load('pljr_courseList.html');
});

$('#hstl_dmg_complStd').click(function(){
    window.sessionStorage.content = "hstl_dmg_complStd";
    $('#content').load('hstl_dmg_complStd.html');
});

$('#pljr_warningLetter').click(function(){
    window.sessionStorage.content = "pljr_warningLetter";
    $('#content').load('pljr_warningLetter.html');
});

$('#btnLogout').click(function(){
    swal({
        title: "Logout",
        text: "Are you sure?",
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false
    }).then(function (){
        window.sessionStorage.clear();
        window.location.reload();
    });
});

$('#miniBtnUptPassword').on('click', function (e) {
    window.sessionStorage.content = "pljr_info";
    location.href = "?showmodalUpd=5";
    $('#content').load('pljr_info.html');
  });
//-------------------------------------------------- end btn menu --------------------------------------------------//


function alertCompound(id, returnValue){
    var settings = {
        "url": host+"api_hep/public/hepDiscipline/countAlert/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_compound = response;
        returnValue();
    });
}

function alertBookStd(id, returnValue){
    var settings = {
        "url": host+"api_hep/public/hepHostelBooking/alertBookStd/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_alertBook = response;
        returnValue();
    });
}

function alertAppCounselor(id, returnValue){
    var settings = {
        "url": host+"api_hep/public/hepCounselling/alertStdAccpt/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_coun = response;
        returnValue();
    });
}

function notifyStdReject(std, returnValue){
    var settings = {
        "url": host+"api_hep/public/hepHostelChange/notifyStdReject/"+std,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_hstlChg = response;
        returnValue();
    });
}

function alertStdNew(std, returnValue){
    var settings = {
        "url": host+"api_hep/public/hepHostelChkinout/alertStdNew/"+std,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_chkInOut = response;
        returnValue();
    });
}

function alertNotifyProg(id, returnValue){
    var settings = {
        "url": host+"api_hep/public/hepProgram/countAccProg/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_alertProgAcc = response;
        returnValue();
    });
}