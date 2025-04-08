$(function(){
    $.ajaxSetup ({
        cache: false
    });

    // select Type
    aduanType(function(){
        $('#aduan_type').html('');
        $('#upt_aduan_type').html('');
        $('#aduan_type').append('<option value="">- Choose -</option>');
        $('#upt_aduan_type').append('<option value="">- Choose -</option>');
        $.each(obj_aduanType.data, function(i, item){
            $('#aduan_type').append('<option value="'+item.pk_id+'">'+item.description+'</option>');
            $('#upt_aduan_type').append('<option value="'+item.pk_id+'">'+item.description+'</option>');
        });
    });

    // Discipline List
    listCounType(function(){
        var colums = [
            { "name": "bil", "title": "No." },
            { "name": "id_jeniskaunseling", "title": "Code" },
            { "name": "description", "title": "Description" },
            // { "name": "bil_sesi", "title": "Bilangan Sesi" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];
        //        var colums = [
        //     { "name": "bil", "title": "No." },
        //     { "name": "description", "title": "Isu/Perkara" },
        //     { "name": "bil_sesi", "title": "Bilangan Sesi" },
        //     { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        // ];

        let bil = 1;
        let convertList = JSON.stringify(obj_counType.data);
        $("#dataList").val(convertList);
        var list = [];

        $.each(obj_counType.data, function (i, field){
            let descType = field.description;
            if( descType != null ){ descType = descType.toUpperCase(); }
            else{ descType = '' }
            list.push({
                bil: bil++, 
                id_jeniskaunseling: field.id_jeniskaunseling,
                description: descType,
                // bil_sesi: field.bil_sesi,
                
                upt_btn: '<button class="btn btn-icon success" title="Update" onclick="loadData(\'' + i + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button> ' +
                        '<button class="btn btn-icon danger" title="Delete" onclick="delData(\''+field.pk_id+'\')"><i class="ion-trash-a"></i>'
            });
        });

        $("#counTypeList").html('');
        $("#counTypeList").footable({
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


//-------------------------------------------------- add Report --------------------------------------------------//
$('#formAddApplication').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Counseling Issue",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let id_jeniskaunseling = $('#id_jeniskaunseling').val();
            let description = $('#description').val();

            var form = new FormData();
            form.append("id_jeniskaunseling", id_jeniskaunseling);
            form.append("description", description);
            form.append("recordstatus",'ADD');

            var settings = {
                "url": host+"api_hep/public/hepCaunType/register",
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
//-------------------------------------------------- end add Report --------------------------------------------------//


//-------------------------------------------------- update Compound --------------------------------------------------//
function loadData(index){
    let data = JSON.parse($("#dataList").val());

    $('#pk_id').val(data[index].pk_id);
    $('#upt_id_jeniskaunseling').val(data[index].id_jeniskaunseling);
    $('#upt_description').val(data[index].description);

    $('#update-application-type').modal('show');
}

$('#formUptCounType').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Counseling Issue",
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
            let id_jeniskaunseling = $('#upt_id_jeniskaunseling').val();
            let description = $('#upt_description').val();

            var form = new FormData();
            form.append("pk_id", pk_id);
            form.append("id_jeniskaunseling", id_jeniskaunseling);
            form.append("description", description);
            form.append("recordstatus",'EDT');

            var settings = {
                "url": host+"api_hep/public/hepCaunType/update",
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
//-------------------------------------------------- end update Compound --------------------------------------------------//


// delete Discipline
function delData(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("pk_id", id);

    swal({
        title: "Remove Counseling Issue",
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
            "url": host+"api_hep/public/hepCaunType/delete",
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


function listCounType(returnValue){
    var settings = {
        "url": host+"api_hep/public/hepCaunType/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_counType = response;
        returnValue();
    });
}

function aduanType(returnValue){
    var settings = {
        "url": host+"api_hep/public/hepjenisaduan/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_aduanType = response;
        returnValue();
    });
}