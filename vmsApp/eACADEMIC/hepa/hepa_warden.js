$(function(){
    $.ajaxSetup ({
        cache: false
    });

    $.fn.select2.defaults.set( "theme", "bootstrap" );

    let userId = window.sessionStorage.usrId;
    let catAdmin = window.sessionStorage.usrCatEadmin;
    let userRole = window.sessionStorage.userRole;

    $('#userId').val(userId);

    // select Campus List
    campusList(function(){
        $('#clg_id').append('<option value="">- Choose -</option>');
        $('#upt_clg_id').append('<option value="">- Choose -</option>');
        $.each(obj_college.data, function (i, item){
            $('#clg_id').append('<option value="'+item.pk_id+'">'+item.clg_name+'</option>');
            $('#upt_clg_id').append('<option value="'+item.pk_id+'">'+item.clg_name+'</option>');
        });
    });

    // select staf
    stafList(function(){
        $('#staf_warden').append('<option value="">- Choose -</option>');
        $('#upt_staf_warden').append('<option value="">- Choose -</option>');
        $.each(obj_emp.data, function (i, item){
            $('#staf_warden').append('<option value="'+item.emp_id+'">'+item.emp_id+' - '+item.emp_name+'</option>');
            $('#upt_staf_warden').append('<option value="'+item.emp_id+'">'+item.emp_id+' - '+item.emp_name+'</option>');
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:'
        });
    });
    
    listHepaWarden(function(){
        let dataList = obj_warden.data;

        createTbl(dataList);
    });
});
var confirmed = false;


//-------------------------------------------------- form add --------------------------------------------------//
$('#formAdd').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Warden",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let fk_campus = $('#clg_id').val();
            let emp_warden = $('#staf_warden').val();

            var form = new FormData();
            form.append("fk_campus", fk_campus);
            form.append("emp_warden", emp_warden);
            form.append("warden_status", 'Active');
            form.append("recordstatus",'ADD');

            var settings = {
                "url": host+"api_hep/public/hepWarden/register",
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
//-------------------------------------------------- end form add --------------------------------------------------//


function loadData(indexs){ 
    let data = JSON.parse($("#dataList").val());
    $('#warden_id').val(data[indexs].warden_id);
    $('#upt_clg_id').val(data[indexs].fk_campus);
    $('#upt_staf_warden').val(data[indexs].emp_warden).trigger('change');
    $('#upt_status').val(data[indexs].warden_status);

    $("#updateWarden").modal("show");
}


//-------------------------------------------------- update new data --------------------------------------------------//
$('#updateWarden').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Warden",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let pk_id = $('#warden_id').val();
            let fk_campus = $('#upt_clg_id').val();
            let emp_warden = $('#upt_staf_warden').val();
            let warden_status = $('#upt_status').val();

            var form = new FormData();
            form.append("pk_id", pk_id);
            form.append("fk_campus", fk_campus);
            form.append("emp_warden", emp_warden);
            form.append("warden_status", warden_status);
            form.append("recordstatus",'EDT');

            var settings = {
                "url": host+"api_hep/public/hepWarden/update",
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
//-------------------------------------------------- end update new data --------------------------------------------------//


//-------------------------------------------------- delete data --------------------------------------------------//
function delData(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("pk_id", id);

    swal({
        title: "Remove Warden",
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
            "url": host+"api_hep/public/hepWarden/delete",
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
//-------------------------------------------------- end delete data --------------------------------------------------//


function createTbl(listData){
    btnHideWarden = (wardenAccess == 1) ? 'hidden' : '';
    var colums = [
        { "name": "bil", "title": "No." },
        { "name": "clg_id", "title": "Campus" },
        { "name": "idEMP", "title": "Staff ID" },
        { "name": "warden", "title": "Warden" },
        { "name": "status", "title": "Status", "breakpoints": "md sm xs" },
        { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
    ];
    
    let bil = 1;
    let convertList = JSON.stringify(listData);
    $("#dataList").val(convertList);
    var list = [];

    $.each(listData, function (i, field){
        list.push({
            bil: bil++, 
            clg_id: field.clg_name, 
            idEMP: field.emp_warden, 
            warden: '<span class="text-uppercase">'+field.emp_name+'</span>', 
            status: field.warden_status.toUpperCase(),
            upt_btn: '   <button '+btnHideWarden+' class="btn btn-icon success" title="Update" onclick="loadData(\'' + i + '\')"><i class="ion-android-create"></i></button> ' +
                        '<button '+btnHideWarden+' class="btn btn-icon danger" title="Delete" onclick="delData(\''+field.warden_id+'\')"><i class="ion-trash-a"></i></button>'
        });
    });

    $("#tblWarden").footable({
        "columns": colums,
        "rows": list,
        "paging": {
            "enabled": true,
            "size": 10,
            "countFormat": "Showing {PF} to {PL} of {TR} data"
        },
        "filtering": {
            "enabled": true,
            "placeholder": "Search...",
            "dropdownTitle": "Search for:"
        }
    });
}

function listHepaWarden(returnValue){
    var settings = {
        "url": host+"api_hep/public/hepWarden/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_warden = response;
        returnValue();
    });
}