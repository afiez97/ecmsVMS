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


//-------------------------------------------------- add Bed --------------------------------------------------//
$('#formAddBed').on('submit', function (e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Bed",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let hostel_id = $('#bed_hostel').val();
            let block_id = $('#bed_blok').val();
            let room_id = $('#bed_room').val();
            let bed_no = $('#bed_no').val();
            let bed_status = $('#bed_status').val();
            let bed_occupied = $('#bed_occupied').val();
            let bed_remark = $('#bed_remark').val();

            var form = new FormData();
            form.append("hostel_id", hostel_id);
            form.append("block_id", block_id);
            form.append("room_id", room_id);
            form.append("bed_no", bed_no);
            form.append("bed_occupied", bed_occupied);
            form.append("bed_status", bed_status);
            form.append("bed_remark", bed_remark);
            form.append("recordstatus", 'ADD');

            var settings = {
                "url": host+"api_hep/public/hepHostelBed/register",
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
//-------------------------------------------------- end add Bed --------------------------------------------------//


//-------------------------------------------------- update Bed --------------------------------------------------//
$("#formUpdate").on('submit', function (e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Bed",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let bed_id = $("#bed_id").val();
            let bed_no = $("#upt_bed_no").val();
            let bed_status = $("#upt_bed_status").val();
            let bed_remark = $("#upt_bed_remark").val();
            let bed_occupied = $('#upt_bed_occupied').val();

            var form = new FormData();
            form.append("bed_id", bed_id);
            form.append("bed_no", bed_no);
            form.append("bed_status", bed_status);
            form.append("bed_remark", bed_remark);
            form.append("bed_occupied", bed_occupied);
            form.append("recordstatus", "EDT");

            var settings = {
                "url": host+"api_hep/public/hepHostelBed/update",
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
                let clgId = $('#srchClgBed').val();
                let hostelId = $('#srchHstlBed').val();
                let blokId = $('#srchBlokBed').val();
                let roomId = $('#srchRoom').val();

                // select college
                collegeList(function(){
                    $('#srchClgBed').html('');
                    $.each(obj_college.data, function(i, item){
                        $('#srchClgBed').append('<option value="'+item.pk_id+'">'+item.clg_name+'</option>');
                    });
                    $('#srchClgBed').val(clgId);
                });

                // select hostel
                hostelBranch(clgId, function(){
                    $('#srchHstlBed').html('');
                    $('#srchHstlBed').append('<option value="">- Choose -</option>');
                    $.each(obj_hstlBranch.data, function(i, item){
                        $('#srchHstlBed').append('<option value="'+item.hostel_id+'">'+item.hostel_name+'</option>');
                    });
                    $('#srchHstlBed').val(hostelId);
                });

                // select blok
                blockList(hostelId, function(){
                    $('#srchBlokBed').html('');
                    $('#srchBlokBed').append('<option value="">- Choose -</option>');
                    $.each(obj_blokList, function(i, item){
                        $('#srchBlokBed').append('<option value="'+item.block_id+'">'+item.block_name+'</option>');
                    });
                    $('#srchBlokBed').val(blokId);
                });

                // select Room
                dataList(blokId, function(){
                    $('#srchRoom').html('');
                    $('#srchRoom').append('<option value="">- Choose -</option>');
                    $.each(obj_dataList, function(i, item){
                        $('#srchRoom').append('<option value="'+item.room_id+'">'+item.room_no+'</option>');
                    });
                    $('#srchRoom').val(roomId);
                });

                // bed list
                bedList(roomId, function(){
                    var columns = [
                        { "name": "bil", "title": "No." },
                        { "name": "bed_no", "title": "Bed No." },
                        { "name": "bed_occupied", "title": "Occupied" },
                        { "name": "bed_status", "title": "Status" },
                        { "name": "bed_remark", "title": "Remark" },
                        { "name": "upt_btn", "title": "Action",'class':"text-center", "breakpoints": "md sm xs" }
                    ];
                    
                    var list = [];
                    let bil = 1;
                    let convertDetList = JSON.stringify(obj_bedList);
                    $("#dataListBed").val(convertDetList);
            
                    $.each(obj_bedList,function(i, field){
                        list.push({
                            "bil":bil++, "bed_no": '<span class="text-uppercase">'+field.bed_no+'</span>', "bed_occupied": '<span class="text-uppercase">'+field.bed_occupied+'</span>', "bed_status": '<span class="text-uppercase">'+field.bed_status+'</span>', 'bed_remark': '<span class="text-uppercase">'+field.bed_remark+'</span>',
                            "upt_btn":  '<button class="btn btn-icon success" title="Update" onclick="loadData(\'' +i+ '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button> '+
                                        '<button class="btn btn-icon danger" title="Remove" onclick="del_rekod(\''+field.bed_id+'\')"><i class="ion-trash-b" ></i></button>'
                        });
                    });
            
                    $('#tblListBed').html('');
                    $("#tblListBed").footable({
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
                $("#modalUptBed").modal("hide");
            });
        });
    }
});
//-------------------------------------------------- end update Bed --------------------------------------------------//


// onchange bed branch
$('#bed_branch').change(function(){
    let blokBranch = $('#bed_branch').val();

    hostelBranch(blokBranch, function(){
        $('#bed_hostel').html('');
        $('#bed_hostel').append('<option value="">- Choose -</option>');
        $.each(obj_hstlBranch.data, function(i, item){
            $('#bed_hostel').append('<option value="'+item.hostel_id+'">'+item.hostel_name+'</option>');
        });
    });
});


// onchange bed hostel
$('#bed_hostel').change(function(){
    let bedHostel = $('#bed_hostel').val();

    optRoom(bedHostel, function(){
        $('#bed_blok').html('');
        $('#bed_blok').append('<option value="">- Choose -</option>');
        $.each(obj_blokHostel.data, function(i, item){
            $('#bed_blok').append('<option value="'+item.block_id+'">'+item.block_name+'</option>');
        });
    });
});


// onchange bed block
$('#bed_blok').change(function(){
    let bedBlok = $('#bed_blok').val();

    roomByBlock(bedBlok, function(){
        $('#bed_room').html('');
        $('#bed_room').append('<option value="">- Choose -</option>');
        $.each(obj_roomList.data, function(i, item){
            $('#bed_room').append('<option value="'+item.room_id+'">'+item.room_no+'</option>');
        });
    });
});


// onchange college search bed
$('#srchClgBed').change(function(){
    let bedBranch = $('#srchClgBed').val();

    hostelBranch(bedBranch, function(){
        $('#srchHstlBed').html('');
        $('#srchHstlBed').append('<option value="">- Choose -</option>');
        $.each(obj_hstlBranch.data, function(i, item){
            $('#srchHstlBed').append('<option value="'+item.hostel_id+'">'+item.hostel_name+'</option>');
        });
    });
});


// onchange hostel search bed
$('#srchHstlBed').change(function(){
    let bedHstl = $('#srchHstlBed').val();

    blockList(bedHstl, function(){
        $('#srchBlokBed').html('');
        $('#srchBlokBed').append('<option value="">- Choose -</option>');
        $.each(obj_blokList, function(i, item){
            $('#srchBlokBed').append('<option value="'+item.block_id+'">'+item.block_name+'</option>');
        });
    });
});


// onchange block search bed
$('#srchBlokBed').change(function(){
    let bedBlock = $('#srchBlokBed').val();

    dataList(bedBlock, function(){
        $('#srchRoom').html('');
        $('#srchRoom').append('<option value="">- Choose -</option>');
        $.each(obj_dataList, function(i, item){
            $('#srchRoom').append('<option value="'+item.room_id+'">'+item.room_no+'</option>');
        });
    });
});


//-------------------------------------------------- button search bed --------------------------------------------------//
$('#btnSrchBed').click(function(){
    let roomId = $('#srchRoom').val();

    bedList(roomId, function(){
        var columns = [
            { "name": "bil", "title": "No." },
            { "name": "bed_no", "title": "Bed No." },
            { "name": "bed_occupied", "title": "Occupied" },
            { "name": "bed_status", "title": "Status" },
            { "name": "bed_remark", "title": "Remark" },
            { "name": "upt_btn", "title": "Action",'class':"text-center", "breakpoints": "md sm xs" }
        ];
        
        var list = [];
        let bil = 1;
        let convertDetList = JSON.stringify(obj_bedList);
        $("#dataListBed").val(convertDetList);

        $.each(obj_bedList,function(i, field){
            list.push({
                "bil":bil++, "bed_no": '<span class="text-uppercase">'+field.bed_no+'</span>', "bed_occupied": '<span class="text-uppercase">'+field.bed_occupied+'</span>', 
                "bed_status": '<span class="text-uppercase">'+field.bed_status+'</span>', 'bed_remark': '<span class="text-uppercase">'+field.bed_remark+'</span>',
                "upt_btn":  '<button class="btn btn-icon success" title="Update" onclick="loadData(\'' +i+ '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button> '+
                            '<button class="btn btn-icon danger" title="Remove" onclick="del_rekod(\''+field.bed_id+'\')"><i class="ion-trash-b" ></i></button>'
            });
        });

        $('#tblListBed').html('');
        $("#tblListBed").footable({
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
//-------------------------------------------------- end button search bed --------------------------------------------------//


// data bed
function loadData(index){
    let data = JSON.parse($("#dataListBed").val());
    data = data[index];
    
    $('#bed_id').val(data.bed_id);
    $('#upt_bed_no').val(data.bed_no);
    $('#upt_bed_occupied').val(data.bed_occupied)
    $('#upt_bed_status').val(data.bed_status);
    $('#upt_bed_remark').val(data.bed_remark);

    $("#modalUptBed").modal("show");
}


//-------------------------------------------------- delete Bed --------------------------------------------------//
function del_rekod(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("bed_id", id);

    swal({
        title: "Remove Bed",
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
            "url": host+"api_hep/public/hepHostelBed/delete",
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
            console.log(response)
            result = JSON.parse(response);
            if (!result.success) {
                Swal(result.message, result.data, "error");
                return;
            }
            // window.location.reload();
        }).then(function(){
            let clgId = $('#srchClgBed').val();
            let hostelId = $('#srchHstlBed').val();
            let blokId = $('#srchBlokBed').val();
            let roomId = $('#srchRoom').val();

            // select college
            collegeList(function(){
                $('#srchClgBed').html('');
                $.each(obj_college.data, function(i, item){
                    $('#srchClgBed').append('<option value="'+item.pk_id+'">'+item.clg_name+'</option>');
                });
                $('#srchClgBed').val(clgId);
            });

            // select hostel
            hostelBranch(clgId, function(){
                $('#srchHstlBed').html('');
                $('#srchHstlBed').append('<option value="">- Choose -</option>');
                $.each(obj_hstlBranch.data, function(i, item){
                    $('#srchHstlBed').append('<option value="'+item.hostel_id+'">'+item.hostel_name+'</option>');
                });
                $('#srchHstlBed').val(hostelId);
            });

            // select blok
            blockList(hostelId, function(){
                $('#srchBlokBed').html('');
                $('#srchBlokBed').append('<option value="">- Choose -</option>');
                $.each(obj_blokList, function(i, item){
                    $('#srchBlokBed').append('<option value="'+item.block_id+'">'+item.block_name+'</option>');
                });
                $('#srchBlokBed').val(blokId);
            });

            // select Room
            dataList(blokId, function(){
                $('#srchRoom').html('');
                $('#srchRoom').append('<option value="">- Choose -</option>');
                $.each(obj_dataList, function(i, item){
                    $('#srchRoom').append('<option value="'+item.room_id+'">'+item.room_no+'</option>');
                });
                $('#srchRoom').val(roomId);
            });

            // bed list
            bedList(roomId, function(){
                var columns = [
                    { "name": "bil", "title": "No." },
                    { "name": "bed_no", "title": "Bed No." },
                    { "name": "bed_occupied", "title": "Occupied" },
                    { "name": "bed_status", "title": "Status" },
                    { "name": "bed_remark", "title": "Remark" },
                    { "name": "upt_btn", "title": "Action",'class':"text-center", "breakpoints": "md sm xs" }
                ];
                
                var list = [];
                let bil = 1;
                let convertDetList = JSON.stringify(obj_bedList);
                $("#dataListBed").val(convertDetList);
        
                $.each(obj_bedList,function(i, field){
                    list.push({
                        "bil":bil++, "bed_no": '<span class="text-uppercase">'+field.bed_no+'</span>', "bed_occupied": '<span class="text-uppercase">'+field.bed_occupied+'</span>', "bed_status": '<span class="text-uppercase">'+field.bed_status+'</span>', 'bed_remark': '<span class="text-uppercase">'+field.bed_remark+'</span>',
                        "upt_btn":  '<button class="btn btn-icon success" title="Update" onclick="loadData(\'' +i+ '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button> '+
                                    '<button class="btn btn-icon danger" title="Remove" onclick="del_rekod(\''+field.bed_id+'\')"><i class="ion-trash-b" ></i></button>'
                    });
                });
        
                $('#tblListBed').html('');
                $("#tblListBed").footable({
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
            $("#modalUptBed").modal("hide");
        });
    });
}
//-------------------------------------------------- end delete Bed --------------------------------------------------//


function bedList(id, returnValue){
    var settings = {
        "url": host+"api_hep/public/hepHostelBed/list/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_bedList = response.data;
        returnValue();
    });
}

function roomByBlock(id, returnValue){
    var settings = {
        "url": host+"api_hep/public/hepHostelRoom/listByBlok/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_roomList = response;
        returnValue();
    });
}