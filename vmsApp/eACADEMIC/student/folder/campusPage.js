$(function(){
    $.ajaxSetup ({
        cache: false
    });

    // Campus List
    campusList(function(){
        $.each(obj_college.data, function (i, item){
            $('#div_dashboard').append('<p><div class="text-center"><button class="btn btn-block btn-lg purple" onclick="loadPage(\'' + item.pk_id + '\')">'+item.clg_name+'</option></div></p>');
        });
    });
});

function campusList(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/collegeList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        //LIST OPTION
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
    }).then(function () {
        window.sessionStorage.clear();
        window.location.replace('admin_login.html');
        // window.location.reload();
    });
});


function loadPage(id){
    window.sessionStorage.idPage = id;
    window.location.replace('adminPage.html?id='+id);
}

$('#btnCampus').click(function(){
    window.location.replace('ttpn_campus.html');
});

$('#btnFaculty').click(function(){
    window.location.replace('ttpn_faculty.html');
})