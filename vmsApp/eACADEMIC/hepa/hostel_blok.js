$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let token = window.sessionStorage.token;
    if(token == null){
        window.location.replace("hepa_login.html");
    }
});
var confirmed = false;


//-------------------------------------------------- add Block --------------------------------------------------//
$('#formAddBlock').on('submit', function (e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Block",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let hostel_id = $('#blok_hostel').val();
            let block_name = $('#block_name').val();
            let block_status = $('#block_status').val();
            let block_remark = $('#block_remark').val();
            let block_gender = $('#blok_gender').val();

            var form = new FormData();
            form.append("hostel_id", hostel_id);
            form.append("block_name", block_name);
            form.append("block_status", block_status);
            form.append("block_remark", block_remark);
            form.append("block_gender", block_gender);
            form.append("recordstatus", 'ADD');

            var settings = {
                "url": host+"api_hep/public/hepHostelBlok/register",
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
//-------------------------------------------------- end add Block --------------------------------------------------//


//-------------------------------------------------- update Block --------------------------------------------------//
$("#formUptBlok").on('submit', function (e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Block",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let block_id = $("#block_id").val();
            let block_name = $("#upt_block_name").val();
            let block_status = $("#upt_block_status").val();
            let block_remark = $("#upt_block_remark").val();
            let block_gender = $('#upt_blok_gender').val();

            var form = new FormData();
            form.append("block_id", block_id);
            form.append("block_name", block_name);
            form.append("block_status", block_status);
            form.append("block_remark", block_remark);
            form.append("block_gender", block_gender);
            form.append("recordstatus", "EDT");

            var settings = {
                "url": host+"api_hep/public/hepHostelBlok/update",
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
            }).then(function(){
                let hostelId = $('#srchHstl').val();
                blockList(hostelId, function(){
                    createTblBlock(obj_block.data);
                });
                $("#updateBlok").modal("hide");
            });
        });
    }
});
//-------------------------------------------------- end update Block --------------------------------------------------//


// onchange block branch
$('#blok_branch').change(function(){
    let blokBranch = $('#blok_branch').val();

    hostelBranch(blokBranch, function(){
        $('#blok_hostel').html('');
        $('#blok_hostel').append('<option value="">- Choose -</option>');
        $.each(obj_hstlBranch.data, function(i, item){
            $('#blok_hostel').append('<option value="'+item.hostel_id+'">'+item.hostel_name.toUpperCase()+'</option>');
        });
    });
});


// onchange search block
$('#srchClgBlock').change(function(){
    let blokBranch = $('#srchClgBlock').val();

    hostelBranch(blokBranch, function(){
        $('#srchHstl').html('');
        $('#srchHstl').append('<option value="">- Choose -</option>');
        $.each(obj_hstlBranch.data, function(i, item){
            $('#srchHstl').append('<option value="'+item.hostel_id+'">'+item.hostel_name.toUpperCase()+'</option>');
        });
    });
});


// button search
$('#btnSrchBlok').click(function(){
    let hostelId = $('#srchHstl').val();

    blockList(hostelId, function(){
        createTblBlock(obj_block.data);
    });
});


// data blok
function loadDataBlok(index){
    let data = JSON.parse($("#dataListBlock").val());
    data = data[index];
    console.log(data);
    
    $('#block_id').val(data.block_id);
    $('#upt_blok_branch').val(data.clg_name);
    $('#upt_blok_hostel').val(data.hostel_name);
    $('#upt_block_name').val(data.block_name);
    $('#upt_block_status').val(data.block_status);
    $('#upt_blok_gender').val(data.block_gender);
    $('#upt_block_remark').val(data.block_remark);

    $("#updateBlok").modal("show");
}


//-------------------------------------------------- delete block --------------------------------------------------//
function delBlok(id){
    chkBlckOccupied(id, function(){
        let count = obj_chkInOut.data.length;
        if( count == 0 ){
            var form = new FormData();
            form.append("recordstatus", 'DEL');
            form.append("block_id", id);

            swal({
                title: "Remove Block",
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
                    "url": host+"api_hep/public/hepHostelBlok/delete",
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
                }).then(function(){
                    let hostelId = $('#srchHstl').val();
                    blockList(hostelId, function(){
                        createTblBlock(obj_block.data);
                    });
                    $("#updateBlok").modal("hide");
                });
            });
        }
        else{
            swal({
                text: "Block is Occupied.",
                type: "info"
            });
        }
    });
}
//-------------------------------------------------- end delete block --------------------------------------------------//


//-------------------------------------------------- create table block --------------------------------------------------//
function createTblBlock(obj_blokList){
    var columns = [
        { "name": "bil", "title": "No." },
        { "name": "block_name", "title": "Name" },
        { "name": "block_gender", "title": "Gender" },
        { "name": "block_status", "title": "Status" },
        { "name": "block_remark", "title": "Remark" },
        { "name": "upt_btn", "title": "Action",'class':"text-center", "breakpoints": "md sm xs" }
    ];
    
    var list = [];
    let bil = 1;
    let convertDetList = JSON.stringify(obj_blokList);
    $("#dataListBlock").val(convertDetList);

    $.each(obj_blokList,function(i, field){
        let blckId = field.block_id;
        let blokGndr = field.block_gender;
        let label = '';
        if( blokGndr == 'Male' ){ label = '<span class="label blue">'+blokGndr+'</span>' }
        else if( blokGndr == 'Female' ){ label = '<span class="label pink">'+blokGndr+'</span>' }

        list.push({
            bil: bil++, block_name: '<span class="text-uppercase">'+field.block_name+'</span>', block_gender: label, block_status: '<span class="text-uppercase">'+field.block_status+'</span>', 
            block_remark: '<span class="text-uppercase">'+field.block_remark+'</span>',
            upt_btn:  '<button class="btn btn-icon success" title="Update" onclick="loadDataBlok(\'' +i+ '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button> '+
                        '<button class="btn btn-icon danger" title="Remove" onclick="delBlok(\''+blckId+'\')"><i class="ion-trash-b" ></i></button>'
        });
    });

    $('#listBlok').html('');
    $("#listBlok").footable({
        "columns": columns,
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
//-------------------------------------------------- end create table block --------------------------------------------------//


function hostelBranch(id, returnValue){
    var settings = {
        "url": host+"api_hep/public/hepHostel/listByBranch/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_hstlBranch = response;
        returnValue();
    });
}

function chkBlckOccupied(id, returnValue){
    var settings = {
        "url": host+"api_hep/public/hepHostelChkinout/chkBlckOccupied/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_chkInOut = response;
        returnValue();
    });
}