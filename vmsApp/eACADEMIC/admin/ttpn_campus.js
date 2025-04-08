$(function(){
    $.ajaxSetup ({
        cache: false
    });

    // list campus
    campusList(function(){

        // capaianSetting = load_capaian();
        load_capaian();
        capaianSetting = window.capaianData;
        // console.log(capaianSetting);
        let addSetting = capaianSetting[0];
        let uptSetting = capaianSetting[1];
        let delSetting = capaianSetting[2];

        if (addSetting == 0){
            SettingAddDisabled = 'disabled';
        }
        else{
            SettingAddDisabled = ''; 
        }
    
        if (uptSetting == 0){
            SettingUpdateDisabled = 'disabled';
        }
        else{
            SettingUpdateDisabled = ''; 
        }
    
    
        if (delSetting == 0){
            SettingDelDisabled = 'disabled';
        }
        else{
            SettingDelDisabled = ''; 
        }

        var colums = [
            { "name": "bil", "title": "No." },
            { "name": "clg_id", "title": "Code" },
            { "name": "clg_name", "title": "Name", "breakpoints": "md sm xs" },
            { "name": "clg_address", "title": "Address", "breakpoints": "md sm xs" },
            { "name": "upt_btn", "title": "Action" }
        ];

        let bil = 1;
        let convertList = JSON.stringify(obj_campusList.data);
        $("#dataList").val(convertList);
        var list = [];

        $.each(obj_campusList.data, function (i, field) {
            list.push({
                "bil": bil++, "clg_id": '<span class="text-uppercase">'+field.clg_id+'</span>', "clg_name": '<span class="text-uppercase">'+field.clg_name+'</span>', 
                "clg_address": '<span class="text-uppercase">'+field.clg_address1 + '</br>' + field.clg_address2 + '</br>' + field.clg_address3+'</span>', 
                "upt_btn":  '<button class="btn btn-icon success" '+SettingUpdateDisabled+' title="Update" onclick="loadData(\'' + i + '\')"><i class="ion-android-create"></i></button> '
            });
        });

        $("#kolejList").footable({
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


// btn Back to campus page
$('#btnBack').click(function(){
    window.location.replace('campusPage.html');
});


// load campus data
function loadData(indexs){
    let data = JSON.parse($("#dataList").val());
    $('#pk_id').val(data[indexs].pk_id);
    $('#upt_clg_id').val(data[indexs].clg_id);
    $('#upt_clg_name').val(data[indexs].clg_name);
    $('#upt_clg_address1').val(data[indexs].clg_address1);
    $('#upt_clg_address2').val(data[indexs].clg_address2);
    $('#upt_clg_address3').val(data[indexs].clg_address3);
    $('#upt_clg_phoneno').val(data[indexs].clg_phoneno);
    $('#upt_clg_faxno').val(data[indexs].clg_faxno);
    $('#upt_clg_email').val(data[indexs].clg_email);

    $('#divUpdate').removeClass('collapse');
    $('#divAdd').addClass('collapse');
}

$('#btnCancel').click(function(){
    $('#divUpdate').addClass('collapse');
    $('#divAdd').removeClass('collapse');
});


//-------------------------------------------------- add campus --------------------------------------------------//
$('#formAddCampus').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Campus",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let clg_id = $('#clg_id').val();
            let clg_name = $('#clg_name').val();
            let clg_address1 = $('#clg_address1').val();
            let clg_address2 = $('#clg_address2').val();
            let clg_address3 = $('#clg_address3').val();
            let clg_phoneno = $('#clg_phoneno').val();
            let clg_faxno = $('#clg_faxno').val();
            let clg_email = $('#clg_email').val();

            var form = new FormData();
            form.append("clg_id", clg_id);
            form.append("clg_name", clg_name);
            form.append("clg_address1", clg_address1);
            form.append("clg_address2", clg_address2);
            form.append("clg_address3", clg_address3);
            form.append("clg_phoneno", clg_phoneno);
            form.append("clg_faxno", clg_faxno);
            form.append("clg_email", clg_email);
            form.append("recordstatus",'ADD');
    
            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmCollege/register",
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
//-------------------------------------------------- end add campus --------------------------------------------------//


//-------------------------------------------------- update campus --------------------------------------------------//
$("#formCampus").on('submit', function (e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Campus",
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
            let upt_clg_id = $("#upt_clg_id").val();
            let upt_clg_name = $("#upt_clg_name").val();
            let upt_clg_address1 = $("#upt_clg_address1").val();
            let upt_clg_address2 = $("#upt_clg_address2").val();
            let upt_clg_address3 = $("#upt_clg_address3").val();
            let upt_clg_phoneno = $("#upt_clg_phoneno").val();
            let upt_clg_faxno = $("#upt_clg_faxno").val();
            let upt_clg_email = $("#upt_clg_email").val();

            var form = new FormData();
            form.append("pk_id", pk_id);
            form.append("clg_id", upt_clg_id);
            form.append("clg_name", upt_clg_name);
            form.append("clg_address2", upt_clg_address2);
            form.append("clg_address1", upt_clg_address1);
            form.append("clg_address3", upt_clg_address3);
            form.append("clg_phoneno", upt_clg_phoneno);
            form.append("clg_faxno", upt_clg_faxno);
            form.append("clg_email", upt_clg_email);
            form.append("recordstatus", "EDT");

            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmCollege/update",
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
                if (!result.success){
                    Swal(result.message, result.data, "error");
                    return;
                }
                window.location.reload();
            });
        });
    }
});
//-------------------------------------------------- end update campus --------------------------------------------------//


//-------------------------------------------------- delete campus --------------------------------------------------//
$('#btnDelete').click(function(){
    let id = $("#pk_id").val();

    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("pk_id", id);

    swal({
        title: "Remove Campus",
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
            "url": host+"api_tetapan_picoms/public/misPrmCollege/delete",
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
})
//-------------------------------------------------- end delete campus --------------------------------------------------//


function collegeCodeChecking(self){
    let input = self.value;

    var form = new FormData();
    form.append("input", input);

    var settings = {
        "url": host+"api_tetapan_picoms/public/collegeChecking",
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
        if(result.data != ''){
            $('#check').html('Code Already Exists In The System');
            $("#check").prop('class','text-danger');
            $('#btnSubmit').prop('disabled', true);
        }else{
            $('#check').html('');
            $('#btnSubmit').prop('disabled', false);
        }
    });
}

function campusList(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmCollege/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_campusList = response;
        returnValue();
    });
}