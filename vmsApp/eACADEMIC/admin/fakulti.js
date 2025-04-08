$(function(){
    $.ajaxSetup ({
        cache: false
    });

    $.fn.select2.defaults.set( "theme", "bootstrap" );

    let clg_id = window.sessionStorage.idPage;
    $('#clgId').val(clg_id);

    getFaculty(function(){
        $('#fac_id').append('<option value="">- Choose Faculty -</option>');
        $.each(obj_getFaculty.data, function(i, item){
            $('#fac_id').append('<option value="'+item.pk_id+'">'+item.fac_id+' - '+item.fac_name+'</option>');
        });

        $('.slct2').select2({
            width: "100%",
            containerCssClass: ':all:',
        });
    })

    facCamList(clg_id, function(){
        var columns = [
            { "name": "bil", "title": "No." },
            { "name": "fac_id", "title": "Faculty Code" },
            { "name": "fac_name", "title": "Faculty Name" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];

        let bil = 1;
        let convertList = JSON.stringify(obj_facCampus.data);
        $("#dataList").val(convertList);
        var list = [];

        $.each(obj_facCampus.data, function (i, field) {
            list.push({
                bil: bil++, fac_id: field.facCode, fac_name: field.fac_name, clg_name: field.clg_name,
                upt_btn:    '<button class="btn btn-icon primary btn_update_sc_faculty" title="View" onclick="loadData(\'' + i + '\')"><i class="ion-eye"></i></button>' +
                            ' <button class="btn btn-icon danger btn_delete_sc_faculty" title="Delete" onclick="del_rekod(\''+field.pk_id+'\')"><i class="ion-trash-b"></i>'
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


//-------------------------------------------------- add faculty --------------------------------------------------//
$('#formAddFaculty').on('submit', function(e){
    let clgId = $('#clgId').val();
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
            form.append("cam_id", clgId);
            form.append("recordstatus",'ADD');
            
            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmFacCampus/register",
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
//-------------------------------------------------- end add faculty --------------------------------------------------//


// view details
function loadData(indexs){
    let d = JSON.parse($("#dataList").val());
    let data = d[indexs];

    $('#fac_code').html(data.facCode);
    $('#fac_name').html(data.fac_name);
    $('#fac_phoneno').html(data.fac_phoneno);
    $('#fac_faxno').html(data.fac_faxno);
    $('#fac_email').html(data.fac_email);

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


// check if add same data
$('#fac_id').change(function(){
    let input = $(this).val();
    let clgId = $('#clgId').val();

    var form = new FormData();
    form.append("input", input);
    form.append("cam_id", clgId);

    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmFacCampus/checkId",
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