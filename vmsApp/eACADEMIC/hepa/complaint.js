$(function(){
    $.ajaxSetup ({
        cache: false
    });

    // Discipline List
    listAduan(function(){
        var colums = [
            { "name": "bil", "title": "No." },
            { "name": "id_jenisaduan", "title": "Code" },
            { "name": "description", "title": "Complaint" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];

        let bil = 1;
        let convertList = JSON.stringify(obj_aduan.data);
        $("#dataList").val(convertList);
        var list = [];

        $.each(obj_aduan.data, function (i, field){
            list.push({
                bil: bil++, id_jenisaduan: field.id_jenisaduan, description: field.description.toUpperCase(),
                upt_btn: '<button class="btn btn-icon success" title="Update" onclick="loadData(\'' + i + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button> ' +
                        '<button class="btn btn-icon danger" title="Delete" onclick="delData(\''+field.pk_id+'\')"><i class="ion-trash-a"></i>'
            });
        });

        $("#aduanList").html('');
        $("#aduanList").footable({
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


//-------------------------------------------------- add Complaint --------------------------------------------------//
$('#formAddAduan').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Complaint Type",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let id_jenisaduan = $('#id_jenisaduan').val();
            let description = $('#description').val();

            var form = new FormData();
            form.append("id_jenisaduan", id_jenisaduan);
            form.append("description", description);
            form.append("recordstatus",'ADD');

            var settings = {
                "url": host+"api_hep/public/hepjenisaduan/register",
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
//-------------------------------------------------- end add Complaint --------------------------------------------------//


//-------------------------------------------------- update Complaint --------------------------------------------------//
function loadData(index){
    let data = JSON.parse($("#dataList").val());
    $('#pk_id').val(data[index].pk_id);
    $('#upt_id_jenisaduan').val(data[index].id_jenisaduan);
    $('#upt_description').val(data[index].description);

    $('#uptComplaint').modal('show');
}

$('#formUptAduan').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Complaint Type",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let pk_id = $('#pk_id').val();
            let id_jenisaduan = $('#upt_id_jenisaduan').val();
            let description = $('#upt_description').val();

            var form = new FormData();
            form.append("pk_id", pk_id);
            form.append("id_jenisaduan", id_jenisaduan);
            form.append("description", description);
            form.append("recordstatus",'EDT');

            var settings = {
                "url": host+"api_hep/public/hepjenisaduan/update",
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
//-------------------------------------------------- end update Complaint --------------------------------------------------//


// delete Aduan
function delData(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("pk_id", id);

    swal({
        title: "Remove Complaint Type",
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
            "url": host+"api_hep/public/hepjenisaduan/delete",
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


function listAduan(returnValue){
    var settings = {
        "url": host+"api_hep/public/hepjenisaduan/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_aduan = response;
        returnValue();
    });
}