$(function(){
    $.ajaxSetup ({
        cache: false
    });

    // Discipline List
    listDisiplin(function(){
        var colums = [
            { "name": "bil", "title": "No." },
            { "name": "id_salahlaku", "title": "Code" },
            { "name": "description", "title": "Description" },
            // { "name": "action_taken", "title": "Action Taken" },
            { "name": "upt_btn", "title": "Modify", "breakpoints": "md sm xs" },
        ];

        let bil = 1;
        let convertList = JSON.stringify(obj_disiplin.data);
        $("#dataList").val(convertList);
        var list = [];

        $.each(obj_disiplin.data, function (i, field){
            console.log(field);
            list.push({
                bil: bil++, 
                id_salahlaku: field.id_salahlaku, 
                description: field.description.toUpperCase(),
                // action_taken: field.action_taken,
                upt_btn: '<button class="btn btn-icon success" title="Update" onclick="loadData(\'' + i + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button> ' +
                        '<button class="btn btn-icon danger" title="Delete" onclick="delData(\''+field.pk_id+'\')"><i class="ion-trash-a"></i>'
            });
        });
        list.push({
            action_taken: '<h4><strong>Total Discipline : ' + list.length + '</strong></h4>',
        });
        $('#totalDiscipline').html((list.length)-1);

        $("#disiplinList").html('');
        $("#disiplinList").footable({
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


//-------------------------------------------------- add Discipline --------------------------------------------------//
$('#formAddDisiplin').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "ADD DISCIPLINE",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let id_salahlaku = $('#id_salahlaku').val();
            let description = $('#description').val();
            // let action_taken = $('#action_taken').val();

            var form = new FormData();
            form.append("id_salahlaku", id_salahlaku);
            form.append("description", description);
            // form.append("action_taken", action_taken);
            form.append("recordstatus",'ADD');

            var settings = {
            "url": host+"api_hep/public/hepdissalahlaku/register",
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
//-------------------------------------------------- end add Discipline --------------------------------------------------//


//-------------------------------------------------- UPDATE DISCIPLINE --------------------------------------------------//
function loadData(index){
    let data = JSON.parse($("#dataList").val());
    $('#pk_id').val(data[index].pk_id);
    $('#upt_id_salahlaku').val(data[index].id_salahlaku);
    $('#upt_description').val(data[index].description);
    $('#upt_action_taken').val(data[index].action_taken);

    $('#update-dicipline').modal('show');
}

$('#formUptDisiplin').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "UPDATE DISCIPLINE TYPE",
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
            let id_salahlaku = $('#upt_id_salahlaku').val();
            let description = $('#upt_description').val();
            let action_taken = $('#upt_action_taken').val();

            var form = new FormData();
            form.append("pk_id", pk_id);
            form.append("id_salahlaku", id_salahlaku);
            form.append("description", description);
            form.append("action_taken", action_taken);
            form.append("recordstatus",'EDT');

            var settings = {
                "url": host+"api_hep/public/hepdissalahlaku/update",
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
//-------------------------------------------------- end UPDATE DISCIPLINE --------------------------------------------------//


// delete Discipline
function delData(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("pk_id", id);

    swal({
        title: "UPDATE DISCIPLINE TYPE",
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
            "url": host+"api_hep/public/hepdissalahlaku/delete",
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


function listDisiplin(returnValue){
    var settings = {
        "url": host+"api_hep/public/hepdissalahlaku/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_disiplin = response;
        console.log
        returnValue();
    });
}