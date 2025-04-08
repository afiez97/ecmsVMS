$(function(){
    $.ajaxSetup ({
        cache: false
    });
});
var confirmed = false;


//-------------------------------------------------- add Room --------------------------------------------------//
$('#formAddRoom').on('submit', function (e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Room",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let hostel_id = $('#room_hostel').val();
            let block_id = $('#room_blok').val();
            let room_no = $('#room_no').val();
            let total_bed = $('#total_bed').val();
            let occupied_status = $('#occupied_status').val();
            let room_status = $('#room_status').val();
            let room_remark = $('#room_remark').val();

            var form = new FormData();
            form.append("hostel_id", hostel_id);
            form.append("block_id", block_id);
            form.append("room_no", room_no);
            form.append("total_bed", total_bed);
            form.append("occupied_status", occupied_status);
            form.append("room_status", room_status);
            form.append("room_remark", room_remark);
            form.append("recordstatus", 'ADD');

            var settings = {
                "url": host+"api_hep/public/hepHostelRoom/register",
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
//-------------------------------------------------- end add Room --------------------------------------------------//


//-------------------------------------------------- update Room --------------------------------------------------//
$("#formUptRoom").on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Room",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let room_id = $("#room_id").val();
            let room_no = $("#upt_room_no").val();
            let total_bed = $("#upt_total_bed").val();
            let occupied_status = $("#upt_occupied_status").val();
            let room_status = $("#upt_room_status").val();
            let room_remark = $("#upt_room_remark").val();

            var form = new FormData();
            form.append("room_id", room_id);
            form.append("room_no", room_no);
            form.append("total_bed", total_bed);
            form.append("occupied_status", occupied_status);
            form.append("room_status", room_status);
            form.append("room_remark", room_remark);
            form.append("recordstatus", "EDT");

            var settings = {
                "url": host+"api_hep/public/hepHostelRoom/update",
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
                let blokId = $('#srchBlok').val();
                roomByBlock(blokId, function(){
                    createTable(obj_room.data);
                });
                $("#modalUptRoom").modal("hide");
            });
        });
    }
});
//-------------------------------------------------- end update Room --------------------------------------------------//


// onchange add room branch
$('#room_branch').change(function(){
    let blokBranch = $('#room_branch').val();

    hostelBranch(blokBranch, function(){
        $('#room_hostel').html('');
        $('#room_hostel').append('<option value="">- Choose -</option>');
        $.each(obj_hstlBranch.data, function(i, item){
            $('#room_hostel').append('<option value="'+item.hostel_id+'">'+item.hostel_name.toUpperCase()+'</option>');
        });
    });
});


// onchange room hostel
$('#room_hostel').change(function(){
    let roomHostel = $('#room_hostel').val();

    optRoom(roomHostel, function(){
        $('#room_blok').html('');
        $('#room_blok').append('<option value="">- Choose -</option>');
        $.each(obj_blokHostel.data, function(i, item){
            $('#room_blok').append('<option value="'+item.block_id+'">'+item.block_name.toUpperCase()+'</option>');
        });
    });
});


// onchange search room
$('#srchClgRoom').change(function(){
    let roomBranch = $('#srchClgRoom').val();

    hostelBranch(roomBranch, function(){
        $('#srchHstlRoom').html('');
        $('#srchHstlRoom').append('<option value="">- Choose -</option>');
        $.each(obj_hstlBranch.data, function(i, item){
            $('#srchHstlRoom').append('<option value="'+item.hostel_id+'">'+item.hostel_name.toUpperCase()+'</option>');
        });
    });
});


// onchange hostel search room
$('#srchHstlRoom').change(function(){
    let roomHstl = $('#srchHstlRoom').val();

    blockList(roomHstl, function(){
        $('#srchBlok').html('');
        $('#srchBlok').append('<option value="">- Choose -</option>');
        $.each(obj_block.data, function(i, item){
            $('#srchBlok').append('<option value="'+item.block_id+'">'+item.block_name.toUpperCase()+'</option>');
        });
    });
});


// button search
$('#btnSrchRoom').click(function(){
    let blockId = $('#srchBlok').val();
    roomByBlock(blockId, function(){
        createTable(obj_room.data);
    });
});


// data room
function loadDataRoom(index){
    let data = JSON.parse($("#dataListRoom").val());
    data = data[index];
    let roomId = data.room_id;
    
    $('#upt_room_branch').val(data.clg_name);
    $('#upt_room_hostel').val(data.hostel_name);
    $('#upt_room_blok').val(data.block_name);
    $('#room_id').val(roomId);
    $('#upt_room_no').val(data.room_no);
    $('#upt_total_bed').val(data.total_bed);
    $('#upt_occupied_status').val(data.occupied_status);
    $('#upt_room_status').val(data.room_status);
    $('#upt_room_remark').val(data.room_remark);

    countOccupied(roomId, function(){
        $('#upt_occupied_status').val(obj_chkInOut.data.length);
    });

    $("#modalUptRoom").modal("show");
}


//-------------------------------------------------- delete Room --------------------------------------------------//
function delRoom(id){
    countOccupied(id, function(){
        let count = obj_chkInOut.data.length;
        if( count == 0 ){
            var form = new FormData();
            form.append("recordstatus", 'DEL');
            form.append("room_id", id);

            swal({
                title: "Remove Room",
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
                    "url": host+"api_hep/public/hepHostelRoom/delete",
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
                }).then(function(){
                    let blokId = $('#srchBlok').val();
                    roomByBlock(blokId, function(){
                        createTable(obj_room.data);
                    });
                });
            });
        }
        else{
            swal({
                text: "Room is Occupied.",
                type: "info"
            });
        }
    });
}
//-------------------------------------------------- end delete Room --------------------------------------------------//


//-------------------------------------------------- table Room List --------------------------------------------------//
function createTable(data){
    var columns = [
        { "name": "bil", "title": "No." },
        { "name": "room_no", "title": "Room No." },
        { "name": "total_bed", "title": "Total of Bed" },
        { "name": "occupied_status", "title": "Occupied Status" },
        { "name": "room_status", "title": "Status" },
        { "name": "room_remark", "title": "Remark" },
        { "name": "upt_btn", "title": "Action",'class':"text-center", "breakpoints": "md sm xs" }
    ];
    
    var list = [];
    let bil = 1;
    let convertDetList = JSON.stringify(data);
    // console.log(convertDetList);

    $("#dataListRoom").val(convertDetList);

    $.each(data, function(i, field){
        let roomId = field.room_id;
    // console.log(roomId);

        count = 0;

        let obj_chkInOut = new get(host+"api_hep/public/hepHostelChkinout/countChkIn/"+roomId,'PICOMS ' + window.sessionStorage.token).execute(); 

        if(obj_chkInOut.success){
      
      count = obj_chkInOut.data.length;
        
        list.push({
            "bil": bil++, 
            "room_no": '<span class="text-uppercase">'+field.room_no+'</span>', 
            "total_bed": field.total_bed, 
            'occupied_status': '<span id="occStts_'+roomId+'">'+count+'</span>', 
            'room_status': '<span class="text-uppercase">'+field.room_status+'</span>', 
            'room_remark': '<span class="text-uppercase">'+field.room_remark+'</span>',
            "upt_btn":  '<button class="btn btn-icon success" title="Update" onclick="loadDataRoom(\'' +i+ '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button> '+
                        '<button class="btn btn-icon danger" title="Remove" onclick="delRoom(\''+roomId+'\')"><i class="ion-trash-b" ></i></button>'
                        
        });
    }


        // countOccupied(roomId, function(){
        //     let count = obj_chkInOut.data.length;
        //     $('#occStts_'+roomId).html(count);
        // });
    });
    

    $('#tblListData').html('');
    $("#tblListData").footable({
        "columns": columns,
        "rows": list,
        "paging": {
            "enabled": true,
            "size": 10,
            countFormat: "Showing {PF} to {PL} of {TR} data",
        },
        "filtering": {
            "enabled": true,
            "placeholder": "Search...",
            "dropdownTitle": "Search for:"
        }
    });
}
//-------------------------------------------------- end table Room List --------------------------------------------------//


function optRoom(id, returnValue){
    var settings = {
        "url": host+"api_hep/public/hepHostelBlok/listByHostel/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_blokHostel = response;
        returnValue();
    });
}

function countOccupied(id, returnValue){
    var settings = {
        "url": host+"api_hep/public/hepHostelChkinout/countChkIn/"+id,
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