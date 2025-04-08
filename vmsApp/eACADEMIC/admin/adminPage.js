$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let content = window.sessionStorage.content;
    let token = window.sessionStorage.token;
    let clg_id = window.sessionStorage.idPage;
    let usrName = window.sessionStorage.usrName;
    let usrId = window.sessionStorage.usrId;
    let catAdmin = window.sessionStorage.usrCatEadmin;
    let catCMS = window.sessionStorage.usrCatEcmis;
    let usrRole = window.sessionStorage.usrRole;

    if(content != null){
        $('#content').load(content+'.html');
    }
    else{ $('#content').load('dashboard.html'); }

    if(token == null){
        window.location.replace("admin_login.html");
    }

    $('.menuHide').hide();
    if( catAdmin == 1 ){
        $('.menuAdmin').show();
    }

    if( catAdmin == 2 ){
        $('.menuSpecial').show();
    }
    else if( catCMS == 1 ){
        if( usrRole == 'pensyarah' ){ $('.menuCMS').show(); }
        else if( usrRole == 'instrutor' ){ $('.menuClncl').show(); }
        else if( usrRole == 'ketuaPJ' ){ $('.menuHODHOP').show(); }
        else if( usrRole == 'dekan' ){ $('.menuDean').show(); }
        else if( usrRole == 'anr' ){ $('.menuAnr').show(); }
    }
    

    dataCampus(clg_id, function(){
        let data = obj_campus.data;
        $('#campus_name').html(`<i class="fa fa-arrow-left text-right"></i> `+data.clg_name);
        $('.campus_name').html(data.clg_name);

    });

    // display name user login
    let dsplyUsr = usrName.split(' ').map( item => item.toUpperCase().substring(0, 1)).join('').substring(0, 2);
    $('#dsplyUsr').html(dsplyUsr);
    $('#dsplyName').html(usrName);
    $('#dsplyId').html(usrId);
});


//-------------------------------------------------- btn menu --------------------------------------------------//
// home
$('#home').click(function(){
    window.sessionStorage.removeItem("content");
    window.location.reload();
});

// dashboard
$('#dashboard').click(function(){
    window.sessionStorage.content = "dashboard";
    window.location.reload();
    
    // $('#content').load('dashboard.html');
});

// announcement
$('#ttpn_takwim').click(function(){
    window.sessionStorage.content = "ttpn_takwim";
    $('#content').load('ttpn_takwim.html');
});

// Settings Faculty
$('#fakulti').click(function(){
    window.sessionStorage.content = "fakulti";
    $('#content').load('fakulti.html');
});

// Settings Programme
$('#program').click(function(){
    window.sessionStorage.content = "program";
    $('#content').load('program.html');
});

// settings Course Offer
$('#cot').click(function(){
    window.sessionStorage.content = "cot";
    $('#content').load('cot.html');
});

// settings course Grading Scheme
$('#skemaMarkah').click(function(){
    window.sessionStorage.content = "skemaMarkah";
    $('#content').load('skemaMarkah.html');
});

// settings Mix/Max Credit
$('#minMaxKredit').click(function(){
    window.sessionStorage.content = "minMaxKredit";
    $('#content').load('minMaxKredit.html');
});

// settings classroom
$('#lokasi').click(function(){
    window.sessionStorage.content = "lokasi";
    $('#content').load('lokasi.html');
});

// settings Academic Staff
$('#fakultiPensyarah').click(function(){
    window.sessionStorage.content = "fakultiPensyarah";
    $('#content').load('fakultiPensyarah.html');
});

// student
$('#adm_pljrInfo').click(function(){
    window.sessionStorage.content = "adm_pljrInfo";
    $('#content').load('adm_pljrInfo.html');
});

// policy Attendance
$('#pol_kehadiran').click(function(){
    window.sessionStorage.content = "pol_kehadiran";
    $('#content').load('pol_kehadiran.html');
});

// polisi timetable
$('#pol_jadWaktu').click(function(){
    window.sessionStorage.content = "pol_jadWaktu";
    $('#content').load('pol_jadWaktu.html');
});

// policy academic
$('#pol_Akademik').click(function(){
    window.sessionStorage.content = "pol_Akademik";
    $('#content').load('pol_Akademik.html');
});

// policy add/drop course
$('#pol_kursus').click(function(){
    window.sessionStorage.content = "pol_kursus";
    $('#content').load('pol_kursus.html');
});

// Examination Policy
$('#pol_peperiksaan').click(function(){
    window.sessionStorage.content = "pol_peperiksaan";
    $('#content').load('pol_peperiksaan.html');
});

// CE/CT
$('#adm_cect').click(function(){
    window.sessionStorage.content = "adm_cect";
    $('#content').load('adm_cect.html');
});

// Programme Change
$('#adm_pgmChange').click(function(){
    window.sessionStorage.content = "adm_pgmChange";
    $('#content').load('adm_pgmChange.html');
});

// Student Withdraw
$('#adm_stdWithdraw').click(function(){
    window.sessionStorage.content = "adm_stdWithdraw";
    $('#content').load('adm_stdWithdraw.html');
});

// Graduation Audit
$('#adm_gradAudit').click(function(){
    window.sessionStorage.content = "adm_gradAudit";
    $('#content').load('adm_gradAudit.html');
});

// Lecturer
$('#adm_lecturer').click(function(){
    window.sessionStorage.content = "adm_lecturer";
    $('#content').load('adm_lecturer.html');
});

// Examination Type
$('#exam_jenis').click(function(){
    window.sessionStorage.content = "exam_jenis";
    $('#content').load('exam_jenis.html');
});

// Examination Timetable
$('#exam_jadualWaktu').click(function(){
    window.sessionStorage.content = "exam_jadualWaktu";
    $('#content').load('exam_jadualWaktu.html');
});

$('#Admpljr_auditTmtPengajian').click(function(){
    window.sessionStorage.content = "Admpljr_auditTmtPengajian";
    $('#content').load('Admpljr_auditTmtPengajian.html');
});

$('#Admpljr_auditTmtPengajian').click(function(){
    window.sessionStorage.content = "Admpljr_auditTmtPengajian";
    $('#content').load('Admpljr_auditTmtPengajian.html');
});

// Examination Timetable
// $('#course_Exam').click(function(){
//     window.sessionStorage.content = "course_Exam";
//     $('#content').load('course_Exam.html');
// });

// Examination Center
$('#exam_pusatPeperiksaan').click(function(){
    window.sessionStorage.content = "exam_pusatPeperiksaan";
    $('#content').load('exam_pusatPeperiksaan.html');
});

// Examination Application
$('#exam_borang').click(function(){
    window.sessionStorage.content = "exam_borang";
    $('#content').load('exam_borang.html');
});

// Generate GPA/CGPA
$('#exam_gpa').click(function(){
    window.sessionStorage.content = "exam_gpa";
    $('#content').load('exam_gpa.html');
});

// Release GPA/CGPA
$('#release_gpa').click(function(){
    window.sessionStorage.content = "exam_releaseResult";
    $('#content').load('exam_releaseResult.html');
});

// Timetable Policy
$('#timetbl_policy').click(function(){
    window.sessionStorage.content = "timetbl_policy";
    $('#content').load('timetbl_policy.html');
});

// Timetable
$('#adm_timetable').click(function(){
    window.sessionStorage.content = "adm_timetable";
    $('#content').load('adm_timetable.html');
});

// Reporting Exam Timetable
$('#reportExamTimetable').click(function(){
    window.sessionStorage.content = "adm_reportExamTimetable";
    $('#content').load('adm_reportExamTimetable.html');
});
// Reporting Exam Timetable
$('#reportListStudent').click(function(){
    window.sessionStorage.content = "adm_reportListStudent";
    $('#content').load('adm_reportListStudent.html');
});

// Reporting Exam Timetable
$('#reportExamGPACGPA').click(function(){
    window.sessionStorage.content = "adm_reportExamGPACGPA";
    $('#content').load('adm_reportExamGPACGPA.html');
});

// Reporting Exam Timetable
$('#reportGAudit').click(function(){
    window.sessionStorage.content = "adm_reportGAudit";
    $('#content').load('adm_reportGAudit.html');
});

// Reporting Exam Timetable
$('#reportGAudit').click(function(){
    window.sessionStorage.content = "adm_reportGAudit";
    $('#content').load('adm_reportGAudit.html');
});

// Reporting Exam Timetable
$('#adm_reportStdInfo').click(function(){
    window.sessionStorage.content = "adm_reportStdInfo";
    $('#content').load('adm_reportStdInfo.html');
});


$('#adm_userManual').click(function(){
    // window.sessionStorage.content = "RolesAccess";
    // $('#content').load('admAccessRoles.html');
    url = '../../api_picoms/api_lecturer_picoms/public/User Manual eAcademic (Lecturer) v1.pdf';
    window.open(url, '_blank');
});

$('#adm_HodHopManual').click(function(){
    // window.sessionStorage.content = "RolesAccess";
    // $('#content').load('admAccessRoles.html');
    url = '../../api_picoms/api_lecturer_picoms/public/User Manual eAcademic (HODHOP) v1.pdf';
    window.open(url, '_blank');
});


// Reporting Exam Timetable
$('#courseTeachingEva').click(function(){
    window.sessionStorage.content = "courseTeachingEva";
    $('#content').load('courseTeachingEva.html');
});

// attendance QR Code
// $('#adm_atdQR').click(function(){
//     window.sessionStorage.content = "adm_atdQR";
//     $('#content').load('adm_atdQR.html');
// });

// attendance student
// $('#adm_atdStudent').click(function(){
//     window.sessionStorage.content = "adm_atdStudent";
//     $('#content').load('adm_atdStudent.html');
// });
// logout
$('#logKeluar').click(function(){


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
    }

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
//-------------------------------------------------- end btn menu --------------------------------------------------//


function dataCampus(id, returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmCollege/show/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_campus = response;
        returnValue();
    });
}

$('#campus_name').click(function(){
    window.location.replace('campusPage.html');
    window.sessionStorage.removeItem('idPage');
});