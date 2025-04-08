$(function(){
    $.ajaxSetup ({
        cache: false
    });
    $("#loading_modal").modal("show");

    let usrId = window.sessionStorage.usrId;
    let usrName = window.sessionStorage.usrName;
    let catAdmin = window.sessionStorage.usrCatEadmin;
    let catCMS = window.sessionStorage.usrCatEcmis;

    $('#usrName').html(usrName);

    // if( catAdmin == 1 ){
    //     $('.btnSttng').show();
    // }
    // else if( catCMS == 1 ){
    //     $('.btnSttng').hide();
    //     // get employer position
    //     listEmpPosition(usrId, function(){
    //         console.log(obj_empPosition.data);
    //         let count = obj_empPosition.data.length;
    //         if(count > 0){
    //             $.each(obj_empPosition.data.slice(0,1), function(i, item){
    //                 let position = item.Pos_Id;
    //                 window.sessionStorage.empPosition = position;

    //                 if( position == 'DD' || position == 'DD_HOP' || position == 'DEAN' || position == 'DEAN_MGR' ){ window.sessionStorage.usrRole = 'dekan' }
    //                 else if( position == 'DD_HOP' || position == 'HOD_HOP' || position == 'HOP' || position == 'HOD' ){ window.sessionStorage.usrRole = 'ketuaPJ' }
    //                 else if( position == 'DS41' || position == 'DS45' || position == 'DS51' || position == 'DS52' ){ window.sessionStorage.usrRole = 'pensyarah' }
    //                 else if( position == 'DS53' || position == 'DS54' || position == 'P.K' || position == 'VK7' || position == 'COOR' ){ window.sessionStorage.usrRole = 'pensyarah' }
    //                 else if( position == 'U32' || position == 'COOR_CLIN' ){ window.sessionStorage.usrRole = 'instrutor' }
    //                 else if( position == 'N51' ){ window.sessionStorage.usrRole = 'pensyarah' }
    //             });
    //         }
    //     });
    // }

    // Campus List
    campusList(function(){
        $.each(obj_college.data, function (i, item){
            $('#div_dashboard').append('<div class="col-sm-4">'+
                                            '<a onclick="loadPage(\'' + item.pk_id + '\')">'+
                                                '<div class="box">'+
                                                    '<div class="box-body text-center p-b-md">'+
                                                        '<img src="images/college1.png" width="20%"><br><br><h3><b>'+item.clg_name+'</b></h3>'+
                                                    '</div>'+
                                                '</div>'+
                                            '</a>'+
                                        '</div>');
        });
        $("#loading_modal").modal("hide");
    });
});


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
        window.location.replace('admin_login.html');
    });
});


function loadPage(id){
    window.sessionStorage.idPage = id;
    window.location.replace('adminPage.html');
}

$('#btnCalendar').click(function(){
    window.location.replace('ttpn_aca_calendar.html');
});

$('#btnSessionIntake').click(function(){
    window.location.replace('ttpn_session_intake.html');
});

$('#btnCampus').click(function(){
    window.location.replace('ttpn_campus.html');
});

$('#btnFaculty').click(function(){
    window.location.replace('ttpn_faculty.html');
});

$('#btnProgramme').click(function(){
    window.location.replace('ttpn_program.html');
});

$('#btnCourse').click(function(){
    window.location.replace('ttpn_kursus.html');
});

$('#btnExamGrade').click(function(){
    window.location.replace('ttpn_examGrade.html');
});