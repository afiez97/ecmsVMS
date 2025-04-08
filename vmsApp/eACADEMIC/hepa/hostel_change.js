$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let catAdmin = window.sessionStorage.usrCatEadmin;
    let userRole = window.sessionStorage.tempPosition;

    // select Branch
    collegeList(function(){
        $('#branch_id').append('<option value="">- Choose -</option>');
        $('#upt_branch_id').append('<option value="">- Choose -</option>');
        $.each(obj_college.data, function(i, item){
            $('#branch_id').append('<option value="'+item.pk_id+'">'+item.clg_name+'</option>');
            $('#upt_branch_id').append('<option value="'+item.pk_id+'">'+item.clg_name+'</option>');
        });
    });

    // Change List
    listChange(function(){
        var colums = [
            { "name": "bil", "title": "No." },
            { "name": "stud_name", "title": "Student" },
            { "name": "hostel_Old", "title": "Previous Hostel" },
            { "name": "hostel_id", "title": "Applied Hostel" },
            { "name": "change_reason", "title": "Reason", "breakpoints": "md sm xs" },
            { "name": "remark_std", "title": "Remark student", "breakpoints": "md sm xs" },
            { "name": "date_apply", "title": "Date Apply", "breakpoints": "md sm xs" },
            { "name": "change_status", "title": "Status", "breakpoints": "md sm xs" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];
        
        let bil = 1;
        let convertList = JSON.stringify(obj_change.data);
        $("#dataList").val(convertList);
        var list = [];

        $.each(obj_change.data, function (i, field){
            let changeStatus = field.change_status;
           
            fk_oldHostel = parseInt(field.fk_chkInOut);
   
            if (field.date_apply != null){
                var dateStr = field.date_apply ;
                var date = new Date(dateStr);
                var formattedDate = (date.getDate() < 10 ? '0' : '') + date.getDate() + '/' + (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1) + '/' + date.getFullYear();

            }
            else {
                formattedDate = '';
            }

            

            let btnDsply = '';
            if(changeStatus == 'New'){
                changeStatus = '<span class="label warning">'+changeStatus+'</span>';
                if( userRole == 'SU' )
                { 
                    btnDsply = '<button class="btn btn-icon success" title="Update" onclick="loadData(\'' + i + '\')" ><i class="ion-android-create"></i></button>';
                }
                else if( userRole == 'W' )
                { 
                    btnDsply = '<button class="btn btn-sm success" onclick="verifyData(\'' + field.change_id + '\')">Verify</button>'; 
                }
            }
            else if(changeStatus == 'Accept'){
                changeStatus = '<span class="label success">'+changeStatus+'</span>';
                btnDsply = '<button class="btn btn-icon accent" title="Update" onclick="loadData(\'' + i + '\')" ><i class="ion-eye"></i></button>';
            }
            else if(changeStatus == 'Reject'){
                changeStatus = '<span class="label danger">'+changeStatus+'</span>';
                btnDsply = '<button class="btn btn-icon accent" title="Update" onclick="loadData(\'' + i + '\')" ><i class="ion-eye"></i></button>';
            }
            else if(changeStatus == 'Verify'){
                changeStatus = '<span class="label info">'+changeStatus+'</span>';
                if( userRole == 'SU' )
                { btnDsply = '<button class="btn btn-icon success" title="Update" onclick="loadData(\'' + i + '\')" ><i class="ion-android-create"></i></button>'; }
                else if( userRole == 'W' )
                { btnDsply = '<i class="fa fa-spin fa-spinner"></i>'; }
            }
            remarkStd = (field.chgStd_remark != null)? field.chgStd_remark : '';
            list.push({
                bil: bil++, 
                stud_name: '<span class="text-uppercase"><b>'+field.stud_id+'</b><br>'+field.sti_name+'</span>', 
                hostel_Old: field.oldHostel, 
                hostel_id: '<span class="text-uppercase">'+field.hostel_name+'<br>'+field.block_name+'<br>'+field.room_no+'</span>', 
                change_reason: '<span class="text-uppercase">'+field.change_reason+'</span>', 
                remark_std: '<span class="text-uppercase">'+remarkStd+'</span>', 
                date_apply: formattedDate, 
                change_status: changeStatus, 
                upt_btn: btnDsply
            });
        });

        $("#changeList").html('');
        $("#changeList").footable({
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



reportChgHostel(function () {
    // Replace empty strings with "Lain-lain" in the JSON string
    var jsonString = JSON.stringify(obj_chkInOut);
    jsonString = jsonString.replace(/"":/g, '"Lain-lain":');
    obj_chkInOut = JSON.parse(jsonString);

    // Extract unique column names from the data object
    var columnNames = [];
    for (var key in obj_chkInOut.data) {
        for (var subKey in obj_chkInOut.data[key]) {
            if (subKey == "") {
                subKey = "Lain-lain";
            }
            if (columnNames.indexOf(subKey) === -1) {
                columnNames.push(subKey);
            }
        }
    }

    // Initialize the Footable with modified data
    $("#report_chgHostel").footable({
        columns: [
            { name: "firstColumn", title: "Issue/Reason", "style": "text-align:center;" },
            // Add other columns based on data
            // This section is updated to ensure consistent column names
            ...columnNames.map(function (columnName) {
                return { name: columnName, title: columnName, "style": "text-align:center;"};
            }),
        ],
        rows: Object.keys(obj_chkInOut.data).map(function (key) {
            var rowData = obj_chkInOut.data[key];

            // Replace empty strings with "Lain-lain" within the rowData object
            for (var propName in rowData) {
                if (rowData.hasOwnProperty(propName) && rowData[propName] === "") {
                    rowData[propName] = "Lain-lain";
                }
            }

            var row = { firstColumn: key };

            // Populate row data with values from the rowData object
            columnNames.forEach(function (columnName) {
                row[columnName] = rowData[columnName] || "-";
            });

            return row;
        }),

        paging: {
            enabled: true,
            size: 10,
            countFormat: "Showing {PF} to {PL} of {TR} data",
        },
    });
});

function reportChgHostel(returnValue){
    var settings = {
        "url": host+"api_hep/public/hepHostelChange/reportingChangehstl",
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
function verifyData(id){
    if(!confirmed){
        swal({
            title: "Verify Change Hostel",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Verify",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            var form = new FormData();
            form.append("change_id", id);
            form.append("change_status", 'Verify');
            form.append("recordstatus",'EDT');

            var settings = {
                "url": host+"api_hep/public/hepHostelChange/uptStatus",
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
}


//-------------------------------------------------- add Booking --------------------------------------------------//
// $('#formAddChange').on('submit', function(e){
//     if(!confirmed){
//         e.preventDefault();
//         swal({
//             title: "Add Change Hostel",
//             text: "Are You Sure?",
//             type: "question",
//             showCancelButton: true,
//             confirmButtonText: "Save",
//             confirmButtonColor: "#2196f3",
//             closeOnConfirm: true,
//             allowOutsideClick: false,
//             html: false
//         }).then(function (){
//             let stud_name = $('#stud_name').val();
//             let stud_id = $('#stud_id').val();
//             let hostel_id = $('#hostel_id').val();
//             let block_id = $('#block_id').val();
//             let room_id = $('#room_id').val();
//             let bed_id = $('#bed_id').val();
//             let change_reason = $('#change_reason').val();
//             let change_status = $('#change_status').val();

//             var form = new FormData();
//             form.append("stud_name", stud_name);
//             form.append("stud_id", stud_id);
//             form.append("hostel_id", hostel_id);
//             form.append("block_id", block_id);
//             form.append("room_id", room_id);
//             form.append("bed_id", bed_id);
//             form.append("change_reason", change_reason);
//             form.append("change_status", change_status);
//             form.append("recordstatus",'ADD');

//             var settings = {
//                 "url": host+"api_hep/public/hepHostelChange/register",
//                 "method": "POST",
//                 "timeout": 0,
//                 "headers": {
//                     "Authorization": "picoms " + window.sessionStorage.token
//                 },
//                 "processData": false,
//                 "mimeType": "multipart/form-data",
//                 "contentType": false,
//                 "data": form
//             };
            
//             $.ajax(settings).done(function (response){
//                 result = JSON.parse(response);
//                 if (!result.success) {
//                     Swal(result.message, result.data, "error");
//                     return;
//                 }
//                 window.location.reload();
//             });
//         });
//     }
// });
//-------------------------------------------------- end add Booking --------------------------------------------------//


//-------------------------------------------------- load data Change Hostel --------------------------------------------------//
function loadData(index){
    let data = JSON.parse($("#dataList").val());
    
    blok_idVerification = data[index].blokId;
    room_idVerification = data[index].roomId;

    verifyroom(blok_idVerification, room_idVerification, function(){

        if(obj_verify.success){
            $("#label_status").prop("class","hidden");
            // $('.label_status').hide();
            $("editStatus").prop('disabled',false);
        }
        else{
            $("#label_status").prop("class","label bg-warning");
            
            $("editStatus").prop('disabled',true);
        }
        
    });


    let changeStatus = data[index].change_status;

    if( changeStatus == 'Verify' ){
        $('.viewData').hide();
        $('.editStatus').show();
    }
    else if(changeStatus == 'Accept'){
        changeStatus = '<span class="label success">'+changeStatus+'</span>';
        $('.viewData').show();
        $('.editStatus').hide();
    }
    else if(changeStatus == 'Reject'){
        changeStatus = '<span class="label danger">'+changeStatus+'</span>';
        $('.viewData').show();
        $('.editStatus').hide();
    }

    $('#pk_id').val(data[index].change_id);
    $('#std_id').val(data[index].stud_id);
    $('#campus_id').val(data[index].campus_id);
    $('#hstl_id').val(data[index].hstlId);
    $('#blok_id').val(data[index].blokId);
    $('#room_id').val(data[index].roomId);

    $('#campus_id').attr('nameCam', data[index].clg_name);         
    $('#hstl_id').attr('nameHstl',data[index].hostel_name);         
    $('#blok_id').attr('nameBlk', data[index].block_name);         
    $('#room_id').attr('nameRoom', data[index].room_no);         


    $('#upt_hostel_id').html(data[index].clg_name+'<br>'+data[index].hostel_name+'<br>'+data[index].block_name+'<br>'+data[index].room_no);
    $('#upt_stud_name').html(data[index].sti_name);
    $('#upt_stud_id').html(data[index].stud_id);
    $('#upt_stud_gender').html(data[index].sti_gender_name);
    $('#upt_change_reason').html(data[index].change_reason);
    // $('#chg_status').val(data[index].change_status);
    $('#change_remark').val(data[index].chg_remark);
    $('#upt_change_status').html(changeStatus);
    $('#view_remark').html(data[index].chg_remark);

    $('#updateChange').modal('show');
}
//-------------------------------------------------- end load data Change Hostel --------------------------------------------------//


// onchange select session
$('#chg_status').change(function(){
    // $("#label_status").html("");
    let chg_status = $("#chg_status").val();
    let block_idcheck = $('#blok_id').val();
    let room_idcheck = $('#room_id').val();

   

    if(chg_status == "Accept"){
        verifyroom(block_idcheck, room_idcheck, function(){

            if(obj_verify.success){
                // $("#label_status").prop("class","hidden");
                $(".editStatus").prop('disabled',false);
            }
            else{
                // $("#label_status").prop("class","label bg-warning");
                $(".editStatus").prop('disabled',true);
            }
            
        });
    }
    else{
        
        $(".editStatus").prop('disabled',false);
    }
});

//-------------------------------------------------- update Change Hostel --------------------------------------------------//
$('#formUptChange').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Change Hostel",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let dataHstl = {};
            dataHstl.std_id = $('#std_id').val();
            dataHstl.campus_id = $('#campus_id').val();
            dataHstl.hstl_id = $('#hstl_id').val();
            dataHstl.blok_id = $('#blok_id').val();
            dataHstl.room_id = $('#room_id').val();
            dataHstl.checkinDate = convertDateFormat($('#checkIn').val());

            
            dataHstl.std_name = $('#upt_stud_name').html();
            // $('#campus_id').html();
            // $('#hstl_id').html();
            // $('#blok_id').html();
            // $('#room_id').html();

            dataHstl.campus_name =   $('#campus_id').attr('nameCam');         
            dataHstl.hstl_name =     $('#hstl_id').attr('nameHstl');         
            dataHstl.blok_name =     $('#blok_id').attr('nameBlk' );         
            dataHstl.room_name =     $('#room_id').attr('nameRoom');   


            let change_id = $('#pk_id').val();
            let change_status = $('#chg_status').val();
            let chg_remark = $('#change_remark').val();
            let notify_std = '';
            if( change_status == 'Reject' ){ notify_std = 'Yes' }
            var form = new FormData();
            // alert('before, '+ change_status + change_id);

            form.append("change_id", change_id);
            form.append("change_status", change_status);
            form.append("chg_remark", chg_remark);
            form.append("notify_std", notify_std);
            form.append("dataHstl", JSON.stringify(dataHstl));
            form.append("recordstatus",'EDT');
            var settings = {
                "url": host+"api_hep/public/hepHostelChange/update",
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
                else{
                    if(change_status == 'Accept'){
                        // alert('accept'+ change_status);

                        addChkIn(change_id, dataHstl);
                    }
                    window.location.reload();
                }
               
            });
        });
    }
});
//-------------------------------------------------- end update Change Hostel --------------------------------------------------//

// delete Hostel
function delData(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("change_id", id);

    swal({
        title: "Remove Change Hostel",
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
            "url": host+"api_hep/public/hepHostelChange/delete",
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


//-------------------------------------------------- change select Branch --------------------------------------------------//
$('#branch_id').change(function(){
    let branchId = $('#branch_id').val();

    hstlClgList(branchId, function(){
        $('#hostel_id').html('');
        $('#hostel_id').append('<option value="">- Choose -</option>');
        $.each(obj_hstlList.data, function(i, item){
            $('#hostel_id').append('<option value="'+item.hostel_id+'">'+item.hostel_name.toUpperCase()+'</option>');
        });
    });
});

$('#upt_branch_id').change(function(){
    let branchId = $('#upt_branch_id').val();

    hstlClgList(branchId, function(){
        $('#upt_hostel_id').html('');
        $('#upt_block_id').html('');
        $('#upt_room_id').html('');
        $('#upt_bed_id').html('');
        $('#upt_hostel_id').append('<option value="">- Choose -</option>');
        $.each(obj_hstlList.data, function(i, item){
            $('#upt_hostel_id').append('<option value="'+item.hostel_id+'">'+item.hostel_name.toUpperCase()+'</option>');
        });
    });
});
//-------------------------------------------------- end change select Branch --------------------------------------------------//


//-------------------------------------------------- change select Hostel --------------------------------------------------//
$('#hostel_id').change(function(){
    let hostelId = $('#hostel_id').val();

    blockList(hostelId, function(){
        $('#block_id').html('');
        $('#block_id').append('<option value="">- Choose -</option>');
        $.each(obj_blockList.data, function(i, item){
            $('#block_id').append('<option value="'+item.block_id+'">'+item.block_name.toUpperCase()+'</option>');
        });
    });
});

$('#upt_hostel_id').change(function(){
    let hostelId = $('#upt_hostel_id').val();

    blockList(hostelId, function(){
        $('#upt_block_id').html('');
        $('#upt_room_id').html('');
        $('#upt_bed_id').html('');
        $('#upt_block_id').append('<option value="">- Choose -</option>');
        $.each(obj_blockList.data, function(i, item){
            $('#upt_block_id').append('<option value="'+item.block_id+'">'+item.block_name.toUpperCase()+'</option>');
        });
    });
});
//-------------------------------------------------- end change select Hostel --------------------------------------------------//


//-------------------------------------------------- change select Block --------------------------------------------------//
$('#block_id').change(function(){
    let blockId = $('#block_id').val();

    roomList(blockId, function(){
        $('#room_id').html('');
        $('#room_id').append('<option value="">- Choose -</option>');
        $.each(obj_roomList.data, function(i, item){
            $('#room_id').append('<option value="'+item.room_id+'">'+item.room_no.toUpperCase()+'</option>');
        });
    });
});

$('#upt_block_id').change(function(){
    let blockId = $('#upt_block_id').val();

    roomList(blockId, function(){
        $('#upt_room_id').html('');
        $('#upt_bed_id').html('');
        $('#upt_room_id').append('<option value="">- Choose -</option>');
        $.each(obj_roomList.data, function(i, item){
            $('#upt_room_id').append('<option value="'+item.room_id+'">'+item.room_no.toUpperCase()+'</option>');
        });
    });
});
//-------------------------------------------------- end change select Block --------------------------------------------------//


//-------------------------------------------------- add Check in when Change status==Accept --------------------------------------------------//
function addChkIn(chgId, data){
    let stdId = data.std_id;
    let campus_id = data.campus_id;
    let hstl_id = data.hstl_id;
    let blok_id = data.blok_id;
    let room_id = data.room_id;
    let checkIn = data.checkinDate;
    var form = new FormData();
    form.append("fk_hstlChg", chgId);
    form.append("type", 'Change');
    form.append("stud_id", stdId);
    form.append("branch_id", campus_id);
    form.append("hostel_id", hstl_id);
    form.append("block_id", blok_id);
    form.append("room_id", room_id);
    form.append("checkIn", checkIn);
    form.append("checkIn_status", 'Check In');
    form.append("recordstatus",'ADD');

    var settings = {
        "url": host+"api_hep/public/hepHostelChkinout/register",
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
    });
}
//-------------------------------------------------- end add Check in when Change status==Accept --------------------------------------------------//


function listChange(returnValue){
    var settings = {
        "url": host+"api_hep/public/hepHostelChange/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_change = response;
        returnValue();
    });
}

function collegeList(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmCollege/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_college = response;
        returnValue();
    });
}

function hstlClgList(id, returnValue){
    var settings = {
        "url": host+"api_hep/public/hepHostel/listByBranch/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_hstlList = response;
        returnValue();
    });
}

function blockList(id, returnValue){
    var settings = {
        "url": host+"api_hep/public/hepHostelBlok/listByHostel/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_blockList = response;
        returnValue();
    });
}

function roomList(id, returnValue){
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
