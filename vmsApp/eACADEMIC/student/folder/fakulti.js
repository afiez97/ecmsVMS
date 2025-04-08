let clg_id = window.sessionStorage.idPage;

$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let clg_id = window.sessionStorage.idPage;

    getFaculty(function(){
        $.each(obj_getFaculty.data, function(i, item){
            $('#fac_id').append('<option value="'+item.pk_id+'">'+item.fac_id+' - '+item.fac_name+'</option>');
        });
    })

    facList(clg_id, function(){
        var columns = [
            { "name": "bil", "title": "No." },
            { "name": "fac_id", "title": "Faculty Code" },
            { "name": "fac_name", "title": "Faculty Name" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];

        let bil = 1;
        var list = [];

        $.each(obj_faculty.data, function (i, field) {
            list.push({
                bil: bil++, fac_id: field.fac_id, fac_name: field.fac_name, clg_name: field.clg_name,
                upt_btn:    '<button class="btn btn-icon primary" title="View" onclick="loadData(\'' + field.pk_id + '\')"><i class="ion-eye"></i></button>' +
                            ' <button class="btn btn-icon danger" title="Delete" onclick="del_rekod(\''+field.pk_id+'\')"><i class="ion-trash-b"></i>'
            });
        });

        $("#facultyList").footable({
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
    });

});
var confirmed = false;

function facList(clgId, returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmFacCampus/listByCampus/"+clgId,
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_faculty = response;
        returnValue();        
    });
}


//-------------------------------------------------- add faculty --------------------------------------------------//
$('#formAddFaculty').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Faculty",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let fac_id = $('#fac_id').val();

            var form = new FormData();
            form.append("fac_id", fac_id);
            form.append("cam_id", clg_id);
            form.append("recordstatus",'ADD');
            
            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmFacCampus/register",
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
//-------------------------------------------------- end add faculty --------------------------------------------------//


// view details
function loadData(id){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmFacCampus/show/"+id,
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        let data = response.data;
        $('#fac_code').html(data.fac_id);
        $('#fac_name').html(data.fac_name);
        $('#fac_phoneno').html(data.fac_phoneno);
        $('#fac_faxno').html(data.fac_faxno);
        $('#fac_email').html(data.fac_email);
    });
    $("#update-fakulti").modal("show");
}


// delete faculty
function del_rekod(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("pk_id", id);

    swal({
        title: "Remove Faculty",
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
            "url": host+"api_tetapan_picoms/public/misPrmFacCampus/delete",
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


// check if add same data
$('#fac_id').change(function(){
    let input = $(this).val();
    let cam_id = clg_id;

    var form = new FormData();
    form.append("input", input);
    form.append("cam_id", cam_id);

    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmFacCampus/checkId",
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
            $('#submit-program').prop('disabled', true);
        }else{
            $('#check').html('');
            $('#submit-program').prop('disabled', false);
        }
    });
});


function getFaculty(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmFaculty/list",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_getFaculty = response;
        returnValue();
    });
}