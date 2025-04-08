$(function(){
    $.ajaxSetup ({
        cache: false
    });

    // capaianMMCredit = load_capaian();
    load_capaian();
    capaianMMCredit = window.capaianData;
    // console.log(capaianMMCredit);
    let addMMCredit = capaianMMCredit[0];
    let uptMMCredit = capaianMMCredit[1];
    let delMMCredit = capaianMMCredit[2];

    if (addMMCredit == 0){
        MMCreditAddHidden = 'disabled';
    }
    else{
        MMCreditAddHidden = ''; 
    }

    if (uptMMCredit == 0){
        MMCreditUpdateHidden = 'disabled';
    }
    else{
        MMCreditUpdateHidden = ''; 
    }

    if (delMMCredit == 0){
        MMCreditDelHidden = 'disabled';
    }
    else{
        MMCreditDelHidden = ''; 
    }

    // select sem type
    semTypeList(function(){
        $('#crd_session').append($('<option value="">- Choose -</option>'));
        $('#upt_crd_session').append($('<option value="">- Choose -</option>'));
        $.each(obj_semType.data, function (i, item){
            $('#crd_session').append($('<option value="'+item.id+'">'+item.sem_type_name+'</option>'));
            $('#upt_crd_session').append($('<option value="'+item.id+'">'+item.sem_type_name+'</option>'));
        });
    });

    // select study scheme
    modeList(function(){
        $('#crd_type').append($('<option value="">- Choose -</option>'));
        $('#upt_crd_type').append($('<option value="">- Choose -</option>'));
        $.each(obj_mode.data, function (i, item){
            $('#crd_type').append($('<option value="'+item.id+'">'+item.mode_name+'</option>'));
            $('#upt_crd_type').append($('<option value="'+item.id+'">'+item.mode_name+'</option>'));
        });
    });

    // list min/max credit
    viewCredit(function(){
        var columns = [
            { "name": "bil", "title": "No." },
            { "name": "crd_session", "title": "Semester Type" },
            { "name": "crd_type", "title": "Study Scheme", "breakpoints":"sm xs" },
            { "name": "crd_min", "title": "Minimum Credit" },
            { "name": "crd_max", "title": "Maximum Credit" },
            { "name": "upt_btn", "title": "Action", "breakpoints":"sm xs" }
        ];

        let bil = 1;
        let convertList = JSON.stringify(obj_minMaxCredit.data);
        $("#dataList").val(convertList);
        var list = [];

        $.each(obj_minMaxCredit.data, function (i, field){
            list.push({
                bil: bil++, crd_session: '<span class="text-uppercase">'+field.sem_type_name+'</span>', crd_type: '<span class="text-uppercase">'+field.mode_name+'</span>', crd_min: field.crd_min, crd_max: field.crd_max,
                upt_btn: '<button class="btn btn-icon success" '+MMCreditUpdateHidden+' title="Update" onclick="loadData(\'' + i + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button>' +
                        ' <button class="btn btn-icon danger" '+MMCreditDelHidden+' title="Remove" onclick="del_rekod(\''+field.crd_id+'\')"><i class="ion-trash-b"></i>'
            });
        });

        $("#creditList").footable({
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


//-------------------------------------------------- add min/max credit --------------------------------------------------//
$('#formAddMinMax').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Credit",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let crd_session = $('#crd_session').val();
            let crd_type = $('#crd_type').val();
            let crd_min = $('#crd_min').val();
            let crd_max = $('#crd_max').val();

            var form = new FormData();
            form.append("crd_session", crd_session);
            form.append("crd_type", crd_type);
            form.append("crd_min", crd_min);
            form.append("crd_max", crd_max);
            form.append("recordstatus", 'ADD');

            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmCredit/register",
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
//-------------------------------------------------- end add min/max credit --------------------------------------------------//


function loadData(indexs){
    let data = JSON.parse($("#dataList").val());
    $('#upt_crd_id').val(data[indexs].crd_id);
    $('#upt_crd_session').val(data[indexs].crd_session);
    $('#upt_crd_type').val(data[indexs].crd_type);
    $('#upt_crd_min').val(data[indexs].crd_min);
    $('#upt_crd_max').val(data[indexs].crd_max);

    $("#update-min-max").modal("show");
}


//-------------------------------------------------- update min/max credit --------------------------------------------------//
$("#updateCredit").on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Minimum/Maximum Credit Per Semester",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let upt_crd_id = $("#upt_crd_id").val();
            let upt_crd_session = $("#upt_crd_session").val();
            let upt_crd_type = $("#upt_crd_type").val();
            let upt_crd_min = $("#upt_crd_min").val();
            let upt_crd_max = $("#upt_crd_max").val();

            var form = new FormData();
            form.append("crd_id", upt_crd_id);
            form.append("crd_session", upt_crd_session);
            form.append("crd_type", upt_crd_type);
            form.append("crd_min", upt_crd_min);
            form.append("crd_max", upt_crd_max);
            form.append("recordstatus", "EDT");

            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmCredit/update",
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
//-------------------------------------------------- end update min/max credit --------------------------------------------------//


function del_rekod(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("crd_id", id);

    swal({
        title: "Remove Minimum/Maximum Credit Per Semester",
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
            "url": host+"api_tetapan_picoms/public/misPrmCredit/delete",
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


function semTypeList(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/semType/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_semType = response;
        returnValue();
    });
}

function modeList(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/mode/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_mode = response;
        returnValue();
    });
}