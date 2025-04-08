let course_id = window.sessionStorage.course_id;

$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let course_id = window.sessionStorage.course_id;
    let clg_id = window.sessionStorage.idPage;

    $("#tblPrerequisite").html('');

    courseDetails(course_id, function(){
        // select faculty
        facultyList(clg_id, function(){
            $('#upt_fac_id').append('<option value="">- Choose -</option>');
            $.each(obj_programme.data, function (i, item) {
                $('#upt_fac_id').append('<option value="'+item.pk_id+'">'+item.fac_name+'</option>');
            });
            $('#upt_fac_id').val(data.fac_id);
        });

        // select course type
        courseType(function(){
            $('#upt_crs_type').append('<option value="">- Choose -</option>');
            $.each(obj_crsType.data, function (i, item) {
                $('#upt_crs_type').append('<option value="'+item.crs_type_name+'">'+item.crs_type_name+'</option>');
            });
            $('#upt_crs_type').val(data.crs_type);
        });

        // select status
        crsStatus(function(){
            $('#upt_crs_status').append('<option value="">- Choose -</option>');
            $.each(obj_crsStatus.data, function (i, item) {
                $('#upt_crs_status').append('<option value="'+item.status_name+'">'+item.status_name+'</option>');
            });
            $('#upt_crs_status').val(data.crs_status);
        });
        
        let pk_id = data.pk_id;
        $('#pk_id').val(pk_id);
        $('#fac_id').html(data.fac_name.toUpperCase());
        $('#crs_code').html(data.crs_code.toUpperCase());
        $('#crs_name').html(data.crs_name.toUpperCase());
        $('#crs_type').html(data.crs_type.toUpperCase());
        $('#crs_credit').html(data.crs_credit);
        $('#crs_price').html(data.crs_price);
        $('#crs_status').html(data.crs_status.toUpperCase());

        $('#upt_pk_id').val(pk_id);
        $('#upt_crs_code').val(data.crs_code);
        $('#upt_crs_name').val(data.crs_name);
        $('#upt_crs_credit').val(data.crs_credit);
        $('#upt_crs_price').val(data.crs_price);

        // if(data.crs_type == 'Pre-requisite'){
        //     $('#divDetails').removeClass('collapse');
        // }
        // else{ $('#divDetails').addClass('collapse'); }

        // select pre-requisite
        prerequisiteCrs(clg_id, pk_id, function(){
            $('#ccd_prerequisite_crs').append('<option value="">- Choose -</option>');
            $.each(obj_prerequisite.data, function (i, item){
                $('#ccd_prerequisite_crs').append('<option value="'+item.pk_id+'">'+item.crs_code.toUpperCase()+' - '+item.crs_name.toUpperCase()+'</option>');
            });
        });
    });

    // Pre-requisite course list
    prereqList(course_id, function(){
        var columns = [
            { "name": "bil", "title": "No." },
            { "name": "crs_code", "title": "Course Code" },
            { "name": "crs_name", "title": "Course Name" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];

        let bil = 1;
        var list = [];
    
        $.each(obj_preReqList, function (i, item){
            list.push({
                bil: bil++, crs_code: item.crs_code, crs_name: item.crs_name,
                upt_btn: ' <button class="btn btn-icon danger" title="Remove" onclick="del(\'' + item.pk_id + '\')"><i class="ion-trash-b"></i>'
            });
        });
    
        $("#tblPrerequisite").footable({
            "columns": columns,
            "rows": list,
            "paging": {
                "enabled": true,
                "size": 10
            },
            "filtering": {
                "enabled": true,
                "placeholder": "Search...",
                "dropdownTitle": "Search for:"
            }
        });
    })
});
var confirmed = false;

// btn Back to Programme List
$('#btnBack').click(function(){
    window.location.replace('adminPage.html');
});


//-------------------------------------------------- update course --------------------------------------------------//
$("#formUptCourse").on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Course",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let pk_id = $("#pk_id").val();
            let upt_fac_id = $("#upt_fac_id").val();
            let upt_crs_name = $("#upt_crs_name").val();
            let upt_crs_type = $("#upt_crs_type").val();
            let upt_crs_credit = $("#upt_crs_credit").val();
            let upt_crs_price = $("#upt_crs_price").val();
            let upt_crs_status = $("#upt_crs_status").val();

            var form = new FormData();
            form.append("pk_id", pk_id);
            form.append("fac_id", upt_fac_id);
            form.append("crs_name", upt_crs_name);
            form.append("crs_type", upt_crs_type);
            form.append("crs_credit", upt_crs_credit);
            form.append("crs_price", upt_crs_price);
            form.append("crs_status", upt_crs_status);
            form.append("recordstatus", "EDT");

            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmCourse/update",
                "method": "POST",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form
            };
    
            $.ajax(settings).done(function (response){
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
//-------------------------------------------------- end update course --------------------------------------------------//


//-------------------------------------------------- delete Course --------------------------------------------------//
$('#btnDelete').click(function(){
    let id = $('#pk_id').val();
    
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("pk_id", id);

    swal({
        title: "Remove Course",
        text: "Are You Sure?",
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Remove",
        confirmButtonColor: "#ef193c",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false
    }).then(function (){
        var settings = {
            "url": host+"api_tetapan_picoms/public/misPrmCourse/delete",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };

        $.ajax(settings).done(function (response){
            result = JSON.parse(response);
            if (!result.success) {
                Swal(result.message, result.data, "error");
                return;
            }
            window.location.replace('adminPage.html');
        });
    });
});
//-------------------------------------------------- end delete Course --------------------------------------------------//


//-------------------------------------------------- add Pre-requisite Course --------------------------------------------------//
$("#formAddPrerequisite").on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Pre-requisite Course",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let crs_id = $("#pk_id").val();
            let prerequisite = $("#ccd_prerequisite_crs").val();

            var form = new FormData();
            form.append("crs_id", crs_id);
            form.append("prerequisite", prerequisite);
            form.append("recordstatus", "ADD");

            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmCourseDet/register",
                "method": "POST",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form
            };
    
            $.ajax(settings).done(function (response){
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
//-------------------------------------------------- end add Pre-requisite Course --------------------------------------------------//


// delete Pre-requisite Course
function del(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("pk_id", id);

    swal({
        title: "Remove Pre-requisite Course",
        text: "Are You Sure?",
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Remove",
        confirmButtonColor: "#ef193c",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false
    }).then(function (){
        var settings = {
            "url": host+"api_tetapan_picoms/public/misPrmCourseDet/delete",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };

        $.ajax(settings).done(function (response){
            result = JSON.parse(response);
            if (!result.success) {
                Swal(result.message, result.data, "error");
                return;
            }
            window.location.reload();
        });
    });
}


function courseDetails(id, returnValue){
    var settings = {
        "url": host + "api_tetapan_picoms/public/misPrmCourse/show/"+id,
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        data = response.data;
        returnValue();
    });
}

function prerequisiteCrs(clgId, pkId, returnValue){
    var form = new FormData();
    form.append("clg_id", clgId);
    form.append("course_id", pkId);

    var settings = {
        "url": host + "api_tetapan_picoms/public/misPrmCourse/selectPrereqCrs",
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
    };

    $.ajax(settings).done(function (response){
        let result = JSON.parse(response);
        obj_prerequisite = result;
        returnValue();
    });
}

function facultyList(id, returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmFaculty/listByCampus/"+id,
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_programme = response;
        returnValue();
    });
}

function courseType(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/coursetypeList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_crsType = response;
        returnValue();
    });
}

function crsStatus(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/statusList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_crsStatus = response;
        returnValue();
    });
}

function prereqList(id, returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmCourseDet/list/"+id,
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_preReqList = response.data;
        returnValue();
    });
}

function checkId(data){
    let prereq = data.value;

    var form = new FormData();
    form.append("crs_id", course_id);
    form.append("prereq", prereq);

    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmCourseDet/checkId",
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
    };

    $.ajax(settings).done(function (response) {
        result = JSON.parse(response);
        if(result.data != ''){
            $('#check').html('Data Already Exists');
            $('#btnSubmit').prop('disabled', true);
        }
        else{
            $('#check').html('');
            $('#btnSubmit').prop('disabled', false);
        }
    });
}