$(function(){
    $.ajaxSetup ({
        cache: false
    });

    // Discipline List
    listAduanHostel(function(){
        var colums = [
            { "name": "bil", "title": "No." },
            { "name": "aduan_code", "title": "Code" },
            { "name": "aduan_nama", "title": "Complaint" },
            // { "name": "aduan_remarks", "title": "Remarks" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];

        let bil = 1;
        let convertList = JSON.stringify(obj_aduan.data);
        $("#dataList").val(convertList);
        var list = [];

        $.each(obj_aduan.data, function (i, field){
        // console.log(field);

            list.push({
                bil: bil++, 
                aduan_code: field.aduan_code, 
                aduan_nama: field.aduan_nama.toUpperCase(),
                // aduan_remarks: field.aduan_remarks,
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
$('#formAddAduanHostel').on('submit', function(e){
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
            let aduan_code = $('#aduan_code').val();
            let aduan_nama = $('#aduan_nama').val();
            // let aduan_remarks = $('#aduan_remarks').val();

            var form = new FormData();
            form.append("aduan_code", aduan_code);
            form.append("aduan_nama", aduan_nama);
            // form.append("aduan_remarks", aduan_remarks);
            form.append("lastapproveby", window.sessionStorage.usrId);
            
            var settings = {
                "url": host+"api_hep/public/hep_jenisaduanHostel/register",
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
    $('#upt_aduan_code').val(data[index].aduan_code);
    $('#upt_aduan_nama').val(data[index].aduan_nama);
    // $('#upt_aduan_remarks').val(data[index].aduan_remarks);

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
            let aduan_code = $('#upt_aduan_code').val();
            let aduan_nama = $('#upt_aduan_nama').val();
            // let aduan_remarks = $('#upt_aduan_remarks').val();

            var form = new FormData();
            form.append("pk_id", pk_id);
            form.append("aduan_code", aduan_code);
            form.append("aduan_nama", aduan_nama);
            // form.append("aduan_remarks", aduan_remarks);
            form.append("lastupdateby", window.sessionStorage.usrId);

            var settings = {
                "url": host+"api_hep/public/hep_jenisaduanHostel/update",
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
            "url": host+"api_hep/public/hep_jenisaduanHostel/delete",
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


function listAduanHostel(returnValue){
    var settings = {
        "url": host+"api_hep/public/hep_jenisaduanHostel/list",
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