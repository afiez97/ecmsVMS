$(function(){
    $.ajaxSetup ({
        cache: false
    });
    $.fn.select2.defaults.set( "theme", "bootstrap" );

    let clg_id = window.sessionStorage.idPage;
    $('#clgId').val(clg_id);

    // select staff
    lecturerList(function(){
        $('#emp_id').append('<option value="">- Choose -</option>');
        $.each(obj_lecturer.data, function (i, item){
            $('#emp_id').append('<option value="'+item.emp_id+'">'+item.emp_name+'</option>');
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:',
        });
    });

    // select Faculty
    facCamList(clg_id, function(){
        $('#fac_id').append('<option value="">- Choose -</option>');
        $.each(obj_facCampus.data, function (i, item){
            $('#fac_id').append('<option value="'+item.facCamId+'">'+item.facCode+'</option>');
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:',
        });
    });

    facLecturerList(clg_id, function(){
        var columns = [
            { "name": "emp_id", "title": "Staff No.", "breakpoints": "md sm xs" },
            { "name": "emp_name", "title": "Academic Staff" },
            { "name": "fac_id", "title": "Faculty" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];

        let convertList = JSON.stringify(obj_facLect.data);
        $("#dataList").val(convertList);
        var list = [];

        $.each(obj_facLect.data, function (i, field) {
            list.push({
                emp_id: field.fk_emp, emp_name: '<span class="text-uppercase">'+field.emp_name+'</span>', fac_id: '<span class="text-uppercase">'+field.fac_name+'</span>', 
                upt_btn:    '<button class="btn btn-icon success" title="Update" onclick="loadData(\'' + i + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button>' +
                            ' <button class="btn btn-icon danger" title="Remove" onclick="del_rekod(\''+field.id+'\')"><i class="ion-trash-b"></i>'
            });
        });

        $("#facpensyarahList").footable({
            "columns": columns,
            "rows": list,
            "paging": {
                "enabled": true,
                "size": 10
            },
            "filtering": {
                "enabled": true,
                "placeholder": "Search...",
                "dropdownTitle": "Search For:"
            }
        });
    })
});
var confirmed = false;


//-------------------------------------------------- add faculty lecturer --------------------------------------------------//
$('#formAddLect').on('submit', function (e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Academic Staff",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let cam_id = $('#clgId').val();
            let fac_id = $('#fac_id').val();
            let emp_id = $('#emp_id').val();

            var form = new FormData();
            form.append("cam_id", cam_id);
            form.append("fac_id", fac_id);
            form.append("emp_id", emp_id);
            form.append("recordstatus", 'ADD');
    
            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmFacLect/register",
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
//-------------------------------------------------- end add faculty lecturer --------------------------------------------------//


//-------------------------------------------------- view data --------------------------------------------------//
function loadData(indexs){
    let data = JSON.parse($("#dataList").val());
    let value = data[indexs];
    let clgId = $('#clgId').val();

    $('#upt_id').val(value.id);

    // select staff
    lecturerList(function(){
        $('#upt_emp_id').append('<option value="">- Choose -</option>');
        $.each(obj_lecturer.data, function (i, item){
            $('#upt_emp_id').append('<option value="'+item.emp_id+'">'+item.emp_name+'</option>');
        });
        $('#upt_emp_id').val(value.fk_emp);

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:',
        });
    });

    // select Faculty
    facCamList(clgId, function(){
        $('#upt_fac_id').append('<option value="">- Choose -</option>');
        $.each(obj_facCampus.data, function (i, item){
            $('#upt_fac_id').append('<option value="'+item.facCamId+'">'+item.facCode+'</option>');
        });
        $('#upt_fac_id').val(value.fk_fac);

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:',
        });
    });

    $("#update-fakPensyarah").modal("show");
}
//-------------------------------------------------- end view data --------------------------------------------------//


//-------------------------------------------------- update faculty lecturer --------------------------------------------------//
$("#formUptFacLecturer").on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Academic Staff",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let upt_fac_id = $("#upt_fac_id").val();
            let upt_emp_id = $("#upt_emp_id").val();
            let upt_id = $("#upt_id").val();
            let statusrekod = "EDT";

            var form = new FormData();
            form.append("id", upt_id);
            form.append("fac_id", upt_fac_id);
            form.append("emp_id", upt_emp_id);
            form.append("recordstatus", statusrekod);
    
            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmFacLect/update",
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
//-------------------------------------------------- end update faculty lecturer --------------------------------------------------//


// delete faculty lecturer
function del_rekod(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("id", id);

    swal({
        title: "Remove Academic Staff",
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
            "url": host+"api_tetapan_picoms/public/faclecturerDelete",
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