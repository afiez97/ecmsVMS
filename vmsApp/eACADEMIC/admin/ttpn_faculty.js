$(function(){
    $.ajaxSetup ({
        cache: false
    });

    facList(function(){


        // capaianSetting = load_capaian();
        load_capaian();
        capaianSetting = window.capaianData;
        // console.log(capaianSetting);
        let addSetting = capaianSetting[0];
        let uptSetting = capaianSetting[1];
        let delSetting = capaianSetting[2];

        
    
        if (uptSetting == 0){
            SettingUpdateDisabled = 'disabled';
        }
        else{
            SettingUpdateDisabled = ''; 
        }
    


        var columns = [
            { "name": "bil", "title": "No." },
            { "name": "fac_id", "title": "Code" },
            { "name": "fac_name", "title": "Faculty" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];

        let bil = 1;
        let convertList = JSON.stringify(obj_faculty.data);
        $("#dataList").val(convertList);
        var list = [];

        $.each(obj_faculty.data, function (i, field) {
            list.push({
                bil: bil++, fac_id: field.fac_id, fac_name: field.fac_name, clg_name: field.clg_name,
                upt_btn: '<button class="btn btn-icon success" '+SettingUpdateDisabled+' title="Update" onclick="loadData(\'' + i + '\')"><i class="ion-android-create"></i></button>'
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


// btn Back to campus page
$('#btnBack').click(function(){
    window.location.replace('campusPage.html');
});


function loadData(indexs){

    // capaianSetting = load_capaian();
        load_capaian();
        capaianSetting = window.capaianData;
        // console.log(capaianSetting);
        // let addSetting = capaianSetting[0];
        let uptSetting = capaianSetting[1];
        let delSetting = capaianSetting[2];

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

    let data = JSON.parse($("#dataList").val());
    $('#fac_pk_id').val(data[indexs].pk_id);
    $('#upt_fac_id').val(data[indexs].fac_id);
    $('#upt_fac_name').val(data[indexs].fac_name);
    $('#upt_fac_phoneno').val(data[indexs].fac_phoneno);
    $('#upt_fac_faxno').val(data[indexs].fac_faxno);
    $('#upt_fac_email').val(data[indexs].fac_email);

    $('#upt_fac_id').attr('disabled',true);
    $('#divButton').html('<button type="submit" '+SettingUpdateDisabled+' class="btn btn-success p-x-md">Update</button> '+
                        '<button type="button" '+SettingDelDisabled+' class="btn btn-danger p-x-md" onclick="del_rekod(\''+data[indexs].pk_id+'\')">Delete</button>');
    $('#divHeader').html('UPDATE FACULTY');
    
    let divBtnTop = '<li class="nav-item inline">'+
                        '<a class="nav-link" title="Cancel"  id="btnCancel"><i class="ion-close-circled"></i></a>'+
                    '</li>';

    $('#divBtnTop').html(divBtnTop);
}


// button cancel edit clear form
$('#divBtnTop').on('click', '#btnCancel', function(){
    $('#fac_pk_id').val('');
    $('#formFaculty')[0].reset();
    $('#divButton').html('<button type="submit" class="btn info p-x-md" id="submit-program">Save</button>');
    $('#divHeader').html('ADD FACULTY');
    $('#divBtnTop').html('');
    $('#upt_fac_id').attr('disabled', false);
});


//-------------------------------------------------- save/update faculty --------------------------------------------------//
$("#formFaculty").on('submit', function(e){
    let pk_id = $("#fac_pk_id").val();
    let titleVal = '';
    let confirmBtn = '';
    let btnColor = '';
    let urlVal = '';
    let statusrekod = "";

    if(pk_id == null || pk_id == ''){
        titleVal = 'Add Faculty';
        confirmBtn = 'Save';
        btnColor = '#2196f3';
        urlVal = 'register';
        statusrekod = "ADD";
    }
    else{
        titleVal = 'Update Faculty';
        confirmBtn = 'Update';
        btnColor = '#22b66e';
        urlVal = 'update';
        statusrekod = "EDT";
    }

    if(!confirmed){
        e.preventDefault();
        swal({
            title: titleVal,
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: confirmBtn,
            confirmButtonColor: btnColor,
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let upt_fac_name = $("#upt_fac_name").val();
            let upt_fac_id = $("#upt_fac_id").val();
            let upt_fac_phoneno = $("#upt_fac_phoneno").val();
            let upt_fac_faxno = $("#upt_fac_faxno").val();
            let upt_fac_email = $("#upt_fac_email").val();

            var form = new FormData();
            if(pk_id == null || pk_id == ''){
                form.append("fac_id", upt_fac_id);
            }
            else{ form.append("pk_id", pk_id); }

            form.append("fac_name", upt_fac_name);
            form.append("fac_phoneno", upt_fac_phoneno);
            form.append("fac_faxno", upt_fac_faxno);
            form.append("fac_email", upt_fac_email);
            form.append("recordstatus", statusrekod);

            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmFaculty/"+urlVal,
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
//-------------------------------------------------- end save/update faculty --------------------------------------------------//


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
            "url": host+"api_tetapan_picoms/public/misPrmFaculty/delete",
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


function facultyCodeChecking(self){
    let input = self.value;

    var form = new FormData();
    form.append("input", input);

    var settings = {
        "url": host+"api_tetapan_picoms/public/facultyChecking",
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
            $('#submit-program').prop('disabled', true);
        }
        else{
            $('#check').html('');
            $('#submit-program').prop('disabled', false);
        }
    });
}

function facList(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmFaculty/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_faculty = response;
        returnValue();        
    });
}