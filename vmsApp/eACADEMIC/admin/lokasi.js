$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let clg_id = window.sessionStorage.idPage;
    $('#clgId').val(clg_id);

    // classroom type list
    classroomType(function(){
        $('#loc_type').append('<option value="">- Choose -</option>');
        $.each(obj_classroomType.data, function(i, item){
            $('#loc_type').append('<option value="'+item.loc_name+'">'+item.loc_name+'</option>');
        });

        $('#upt_loc_type').append('<option value="">- Choose -</option>');
        $.each(obj_classroomType.data, function(i, item){
            $('#upt_loc_type').append('<option value="'+item.loc_name+'">'+item.loc_name+'</option>');
        });
    });

    // status
    statusList(function(){
        $('#loc_status').append('<option value="">- Choose -</option>');
        $('#upt_loc_status').append('<option value="">- Choose -</option>');
        $.each(obj_status.data, function (i, item) {
            $('#loc_status').append('<option value="'+item.status_name+'">'+item.status_name+'</option>');
            $('#upt_loc_status').append('<option value="'+item.status_name+'">'+item.status_name+'</option>');
        });
    });

    // list classroom
    viewLokasi(clg_id, function(){

        // capaianClass = load_capaian();
        load_capaian();
        capaianClass = window.capaianData;
        // console.log(capaianClass);
        let addClass = capaianClass[0];
        let uptClass = capaianClass[1];
        let delClass = capaianClass[2];

        console.log(addClass);
        console.log(uptClass);
        console.log(delClass);

        if (addClass == 0){
            ClassAddDisabled = 'disabled';
        }
        else{
            ClassAddDisabled = ''; 
        }

        if (uptClass == 0){
            ClassUpdateDisabled = 'disabled';
        }
        else{
            ClassUpdateDisabled = ''; 
        }


        if (delClass == 0){
            ClassDelDisabled = 'disabled';
        }
        else{
            ClassDelDisabled = ''; 
        }

        var colums = [
            { "name": "bil", "title": "No." },
            { "name": "loc_name", "title": "Classroom Name" },
            { "name": "locType", "title": "Classroom Type" },
            { "name": "loc_capacity", "title": "Capacity", "breakpoints": "md sm xs" },
            { "name": "loc_status", "title": "Status", "breakpoints": "md sm xs" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];

        let bil = 1;
        let convertList = JSON.stringify(obj_classroom.data);
        $("#dataList").val(convertList);
        var list = [];

        $.each(obj_classroom.data, function (i, field){
            list.push({
                bil: bil++, loc_id: field.loc_id, loc_name: field.loc_name.toUpperCase(), locType: '<span class="text-uppercase">'+field.loc_type+'</span>', loc_capacity: field.loc_capacity, loc_status: field.loc_status.toUpperCase(),
                upt_btn:    '<button class="btn btn-icon success" '+ClassUpdateDisabled+' title="Update" onclick="loadData(\'' + i + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button> ' +
                            '<button class="btn btn-icon danger" '+ClassDelDisabled+' title="Remove" onclick="del_rekod(\''+field.loc_id+'\')"><i class="ion-trash-b"></i>'
            });
        });

        $("#lokasiList").footable({
            "columns": colums,
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
    });
});
var confirmed = false;


//-------------------------------------------------- add classroom --------------------------------------------------//
$('#formAddClass').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Classroom",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let clg_id = $('#clgId').val();
            let loc_name = $('#loc_name').val();
            let loc_description = $('#loc_description').val();
            let loc_capacity = $('#loc_capacity').val();
            let loc_status = $('#loc_status').val();
            let loc_type = $('#loc_type').val();

            var form = new FormData();
            form.append("clg_id", clg_id);
            form.append("loc_name", loc_name);
            form.append("loc_description", loc_description);
            form.append("loc_capacity", loc_capacity);
            form.append("loc_status", loc_status);
            form.append("loc_type", loc_type);
            form.append("recordstatus", "ADD");
    
            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmLoc/register",
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
//-------------------------------------------------- end add classroom --------------------------------------------------//


function loadData(indexs){
    let data = JSON.parse($("#dataList").val());

    $('#loc_id').val(data[indexs].loc_id);
    $('#upt_clg_id').val(data[indexs].clg_id);
    $('#upt_loc_name').val(data[indexs].loc_name);
    $('#upt_loc_description').val(data[indexs].loc_description);
    $('#upt_loc_type').val(data[indexs].loc_type);
    $('#upt_loc_capacity').val(data[indexs].loc_capacity);
    $('#upt_loc_status').val(data[indexs].loc_status);

    $("#update-lokasi").modal("show");
}


//-------------------------------------------------- update classroom --------------------------------------------------//
$("#formUptClassroom").on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Classroom",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let id = $("#loc_id").val();
            let upt_loc_name = $("#upt_loc_name").val();
            let upt_loc_description = $("#upt_loc_description").val();
            let upt_loc_type = $("#upt_loc_type").val();
            let upt_loc_capacity = $("#upt_loc_capacity").val();
            let upt_loc_status = $("#upt_loc_status").val();
            let statusrekod = "EDT";

            var form = new FormData();
            form.append("loc_id", id);
            form.append("loc_name", upt_loc_name);
            form.append("loc_description", upt_loc_description);
            form.append("loc_type", upt_loc_type);
            form.append("loc_capacity", upt_loc_capacity);
            form.append("loc_status", upt_loc_status);
            form.append("recordstatus", statusrekod);
    
            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmLoc/update",
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
//-------------------------------------------------- end update classroom --------------------------------------------------//


function del_rekod(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("loc_id", id);

    swal({
        title: "Remove Classroom",
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
            "url": host+"api_tetapan_picoms/public/misPrmLoc/delete",
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


function classroomType(returnValue){
    var settings = {
        "url": host+"api_public_access/public/classroomType/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_classroomType = response;
        returnValue();
    });
}

function viewLokasi(clg_id, returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmLoc/listByCampus/"+clg_id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_classroom = response;
        returnValue();
    });
}