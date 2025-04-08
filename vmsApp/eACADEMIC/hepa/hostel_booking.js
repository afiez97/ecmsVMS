$(function(){
    $.ajaxSetup ({
        cache: false
    });

    // select Branch
    campusList(function(){
        $('#branch_id').append('<option value="">- Choose -</option>');
        $('#upt_branch_id').append('<option value="">- Choose -</option>');
        $.each(obj_college.data, function(i, item){
            $('#branch_id').append('<option value="'+item.pk_id+'">'+item.clg_name+'</option>');
            $('#upt_branch_id').append('<option value="'+item.pk_id+'">'+item.clg_name+'</option>');
        });
    });



    
    // Add change event listeners to booking status and room selects
    $("#upt_booking_status, #upt_room_id").change(function() {
        toggleUpdateButton();
    });

// Call the function initially to check the default selected option
checkOptionValue();

// Attach change event handler to the select element
$('#upt_room_id').on('change', function() {
    // Call the function whenever the selected option changes
    checkOptionValue();
});
    // Booking List
    listBooking(function(){
        var colums = [
            { "name": "bil", "title": "No." },
            { "name": "branch_id", "title": "Campus" },
            { "name": "stud_id", "title": "Student" },
            { "name": "hostel_id", "title": "Applied Hostel" },
            { "name": "expected_chkInDate", "title": "Expected Check In" },
            { "name": "booking_status", "title": "Status" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];

        let bil = 1;
        let convertList = JSON.stringify(obj_booking.data);
        $("#dataList").val(convertList);
        var list = [];

        $.each(obj_booking.data, function (i, field){
            let bookingStatus = field.booking_status;
            let btnAction = '';
            if(bookingStatus == 'New'){
                bookingStatus = '<span class="label warning">'+bookingStatus+'</span>';
                btnAction = '<button class="btn btn-icon success" title="Update" onclick="loadData(\'' + i + '\')" ><i class="ion-android-create"></i></button> ' +
                            '<button class="btn btn-icon danger" title="Delete" onclick="delData(\''+field.booking_id+'\')"><i class="ion-trash-a"></i></button>';
            }
            else if(bookingStatus == 'Accept'){
                bookingStatus = '<span class="label success">'+bookingStatus+'</span>';
                btnAction = '<i class="ion-checkmark-circled"></i>';
            }
            else if(bookingStatus == 'Reject'){
                bookingStatus = '<span class="label danger">'+bookingStatus+'</span>';
                btnAction = '<i class="ion-checkmark-circled"></i>';
            }
            // else if(bookingStatus == 'Complete'){
            //     bookingStatus = '<span class="label info text-uppercase">'+bookingStatus+'</span>';
            // }

            list.push({
                bil: bil++, branch_id: '<span class="text-uppercase">'+field.clg_name+'</span>', 
                stud_id: '<span class="text-uppercase"><b>'+field.stud_id+'</b><br>'+field.sti_name+'</span>', 
                expected_chkInDate: formatDate(field.expected_chkInDate), 
                booking_status: bookingStatus, 
                hostel_id: '<span class="text-uppercase">'+field.hostel_name+'<br>'+field.block_name+'<br>'+field.room_no+'</span>', 
                upt_btn: btnAction
            });
        });

        $("#bookingList").html('');
        $("#bookingList").footable({
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


// check student exist
$('#stud_id').on('input', function(){
    let input = $(this).val();
    chkStdExist(input, function(){
        if(result.data != ''){
            $.each(result.data, function(i, item){
                $('#check').html('');
                $('#btnSaveStd').prop('disabled', false);
                $('#stud_name').val(item.sti_name);
                $('.fieldHstl').attr('disabled', false);
            });
        }
        else{
            $('#check').html('Not Found');
            $("#check").prop('class','text-danger');
            $('#btnSaveStd').prop('disabled', true);
            $('#stud_name').val('');
            $('.fieldHstl').attr('disabled', true);
        }
    });
});


//-------------------------------------------------- add Booking --------------------------------------------------//
$('#formAddBooking').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Booking",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let branch_id = $('#branch_id').val();
            let hostel_id = $('#hostel_id').val();
            let block_id = $('#block_id').val();
            let room_id = $('#room_id').val();
            let bed_id = $('#bed_id').val();
            let expected_chkInDate = $('#expected_chkInDate').val();
            let stud_id = $('#stud_id').val();
            let booking_status = $('#booking_status').val();

            var form = new FormData();
            form.append("branch_id", branch_id);
            form.append("hostel_id", hostel_id);
            form.append("block_id", block_id);
            form.append("room_id", room_id);
            form.append("bed_id", bed_id);
            form.append("expected_chkInDate", expected_chkInDate);
            form.append("stud_id", stud_id);
            form.append("booking_status", booking_status);
            form.append("recordstatus",'ADD');

            var settings = {
                "url": host+"api_hep/public/hepHostelBooking/register",
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
                // else{
                //     if(booking_status == 'Accepted'){
                //         addChkIn(bed_id, 'Booked');
                //     }
                //     else{ addChkIn(bed_id, 'No'); }
                // }
                window.location.reload();
            });
        });
    }
});
//-------------------------------------------------- end add Booking --------------------------------------------------//


//-------------------------------------------------- loadData Booking --------------------------------------------------//
function loadData(index){
    let data = JSON.parse($("#dataList").val());
    let branchId = data[index].branch_id;
    let hostelId = data[index].hostelId;
    let blockId = data[index].blockId;
    let roomId = data[index].roomId;

    $('#pk_id').val(data[index].booking_id);
    $('#upt_branch_id').val(branchId);
    $('#upt_expected_chkInDate').val(data[index].expected_chkInDate);
    $('#upt_stud_id').val(data[index].stud_id);
    $('#upt_booking_status').val(data[index].booking_status);
    $('#upt_stud_name').val(data[index].sti_name);

    // select hostel
    hstlClgList(branchId, function(){
        $('#upt_hostel_id').html('');
        $('#upt_hostel_id').append('<option value="">- Choose -</option>');
        $.each(obj_hstlList.data, function(i, item){
            $('#upt_hostel_id').append('<option value="'+item.hostel_id+'">'+item.hostel_name.toUpperCase()+'</option>');
        });
        $('#upt_hostel_id').val(hostelId);
    });

    // select block
    blockList(hostelId, function(){
        $('#upt_block_id').html('');
        $('#upt_block_id').append('<option value="">- Choose -</option>');
        $.each(obj_blockList.data, function(i, item){
            $('#upt_block_id').append('<option value="'+item.block_id+'">'+item.block_name.toUpperCase()+'</option>');
        });
        $('#upt_block_id').val(blockId);
    });

    // select room
    // roomList2(blockId, function(){
    //     // console.log(blockId);
    //     $('#upt_room_id').html('');
    //     $('#upt_room_id').append('<option value="">- Choose -</option>');
    //     $.each(obj_roomList.data, function(i, item){
    //         $('#upt_room_id').append('<option value="'+item.room_id+'">'+item.room_no.toUpperCase()+'</option>');
    //     });
    //     $('#upt_room_id').val(roomId);
    // });
    roomList2(blockId, function () {
        // console.log(obj_roomList);

        $('#upt_room_id').html('');
        $('#upt_room_id').append('<option value="">- Choose -</option>');
        $.each(obj_roomList.data, function (i, item) {
            // $('#room_id').append('<option value="' + item.room_id + '" totalBed="' + item.total_bed + '">' + item.room_no.toUpperCase() + '</option>');
            totalBedAvailable = parseInt(item.total_bed) - item.total_occupied;
            // console.log(parseInt(item.total_bed));
            $("#upt_room_id").append(
            '<option roomName="'+item.room_no+'" tBed="'+totalBedAvailable+'" value="' +
                item.room_id +
                '" totalBed="' +
                item.total_bed +
                '">' +
                item.room_no.toUpperCase() +` (`+totalBedAvailable+
                " Kosong) </option>"
            );
        });
        
                $('#upt_room_id').val(roomId);
                

    // Call toggleUpdateButton initially to set the button state
    toggleUpdateButton();

    });

    // select bed
    bedList(roomId, function(){
        $('#upt_bed_id').html('');
        $('#upt_bed_id').append('<option value="">- Choose -</option>');
        $.each(obj_bedList.data, function(i, item){
            $('#upt_bed_id').append('<option value="'+item.bed_id+'">'+item.bed_no.toUpperCase()+'</option>');
        });
        $('#upt_bed_id').val(data[index].bedId);
    });

    $('#updateBooking').modal('show');
}
//-------------------------------------------------- end loadData Booking --------------------------------------------------//


// $('#upt_room_id').on('change', function() {
//     // Get the selected room's totalBed attribute
//     var totalBedAvailable = parseInt($(this).find('option:selected').attr('tBed'));
//     var selectedValue = $("#upt_booking_status").val();
    
//     // Check if there are available beds in the selected room
//     if (totalBedAvailable > 0) {
//         // Enable the update button if there are available beds
//         // $(".btnUpdate").prop('disabled', false);
//         $("#label_status").addClass('hidden');
        
//     } else {
//         // Disable the update button if there are no available beds
//         $(".btnUpdate").prop('disabled', true);
//         $("#label_status").removeClass('hidden');

//     }
// });

// Function to check the selected option's value
function checkOptionValue() {
    var totalBedAvailable = parseInt($("#upt_room_id option:selected").attr('tBed'));
    var selectedValue = $("#upt_booking_status").val();
    
    // Check if there are available beds in the selected room
    if (totalBedAvailable > 0) {
        // Hide the label if there are available beds
        $("#label_status").addClass('hidden');
    } else {
        // Show the label if there are no available beds
        $("#label_status").removeClass('hidden');
    }
}

//-------------------------------------------------- update Booking --------------------------------------------------//
$('#formUptBooking').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Booking",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let booking_id = $('#pk_id').val();
            let branch_id = $('#upt_branch_id').val();
            let hostel_id = $('#upt_hostel_id').val();
            let block_id = $('#upt_block_id').val();
            let room_id = $('#upt_room_id').val();
            // let bed_id = $('#upt_bed_id').val();
            let expected_chkInDate = $('#upt_expected_chkInDate').val();
            let stud_id = $('#upt_stud_id').val();
            let booking_status = $('#upt_booking_status').val();

            let notify_std = '';
            if( booking_status == 'Reject' ){ notify_std = 'Yes' }

            let dataHstl = {};
            dataHstl.std_id = stud_id;
            dataHstl.campus_id = branch_id;
            dataHstl.hstl_id = hostel_id;
            dataHstl.blok_id = block_id;
            dataHstl.room_id = room_id;
            dataHstl.checkIn = expected_chkInDate;

              
            dataHstl.std_name = $('#upt_stud_name').val();
            // $('#campus_id').html();
            // $('#hstl_id').html();
            // $('#blok_id').html();
            // $('#room_id').html();

            dataHstl.campus_name =   $('#upt_branch_id').find(":selected").text();         
            dataHstl.hstl_name =     $('#upt_hostel_id ').find(":selected").text();         
            dataHstl.blok_name =     $('#upt_block_id').find(":selected").text();        
            dataHstl.room_name =     $('#upt_room_id').find(":selected").attr('roomname');  


            var form = new FormData();
            form.append("booking_id", booking_id);
            form.append("branch_id", branch_id);
            form.append("hostel_id", hostel_id);
            form.append("block_id", block_id);
            form.append("room_id", room_id);
            form.append("notify_std", notify_std);
            form.append("expected_chkInDate", expected_chkInDate);
            form.append("stud_id", stud_id);
            form.append("booking_status", booking_status);
            form.append("dataHstl", JSON.stringify(dataHstl));
            form.append("recordstatus",'EDT');

            var settings = {
                "url": host+"api_hep/public/hepHostelBooking/update",
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
                    if(booking_status == 'Accept'){
                        addChkIn(booking_id, dataHstl);
                    }
                }
                window.location.reload();
            });
        });
    }
});
//-------------------------------------------------- end update Booking --------------------------------------------------//

// delete Hostel
function delData(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("booking_id", id);

    swal({
        title: "Remove Booking",
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
            "url": host+"api_hep/public/hepHostelBooking/delete",
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
        $('#block_id').html('');
        $('#room_id').html('');
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
    let stud_id =  $('#stud_id').val();
    console.log

    blockList(hostelId, function(){
        $('#block_id').html('');
        $('#room_id').html('');
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

    // roomList(blockId, function(){
    //     $('#room_id').html('');
    //     $('#room_id').append('<option value="">- Choose -</option>');
    //     $.each(obj_roomList.data, function(i, item){
    //         $('#room_id').append('<option value="'+item.room_id+'">'+item.room_no.toUpperCase()+'</option>');
    //     });
    // });
    roomList2(blockId, function () {
        // console.log(obj_roomList);

        $('#room_id').html('');
        $('#room_id').append('<option value="">- Choose -</option>');
        $.each(obj_roomList.data, function (i, item) {
            // $('#room_id').append('<option value="' + item.room_id + '" totalBed="' + item.total_bed + '">' + item.room_no.toUpperCase() + '</option>');
            totalBedAvailable = parseInt(item.total_bed) - item.total_occupied;
            // console.log(parseInt(item.total_bed));
            $("#room_id").append(
            '<option value="' +
                item.room_id +
                '" totalBed="' +
                item.total_bed +
                '">' +
                item.room_no.toUpperCase() +` (`+totalBedAvailable+
                " Kosong) </option>"
            );
        });
    });
});

$('#upt_block_id').change(function(){
    let blockId = $('#upt_block_id').val();
    console.log(blockId);

    // roomList(blockId, function(){
    //     $('#upt_room_id').html('');
    //     $('#upt_bed_id').html('');
    //     $('#upt_room_id').append('<option value="">- Choose -</option>');
    //     $.each(obj_roomList.data, function(i, item){
    //         $('#upt_room_id').append('<option value="'+item.room_id+'">'+item.room_no.toUpperCase()+'</option>');
    //     });
    // });
    roomList2(blockId, function () {
        // console.log(obj_roomList);

        $('#upt_room_id').html('');
        $('#upt_bed_id').html('');
        $('#upt_room_id').append('<option value="">- Choose -</option>');
        $.each(obj_roomList.data, function (i, item) {
            // $('#room_id').append('<option value="' + item.room_id + '" totalBed="' + item.total_bed + '">' + item.room_no.toUpperCase() + '</option>');
            totalBedAvailable = parseInt(item.total_bed) - item.total_occupied;
            // console.log(parseInt(item.total_bed));
            $("#upt_room_id").append(
            '<option tBed="'+totalBedAvailable+'" value="' +
                item.room_id +
                '" totalBed="' +
                item.total_bed +
                '">' +
                item.room_no.toUpperCase() +` (`+totalBedAvailable+
                " Kosong) </option>"
            );
        });
    });
});
//-------------------------------------------------- end change select Block --------------------------------------------------//


//-------------------------------------------------- change select Room --------------------------------------------------//
$('#room_id').change(function(){
    let roomId = $('#room_id').val();

    bedList(roomId, function(){
        $('#bed_id').html('');
        $('#bed_id').append('<option value="">- Choose -</option>');
        $.each(obj_bedList.data, function(i, item){
            $('#bed_id').append('<option value="'+item.bed_id+'">'+item.bed_no.toUpperCase()+'</option>');
        });
    });
});

$('#upt_room_id').change(function(){
    let roomId = $('#upt_room_id').val();

    bedList(roomId, function(){
        $('#upt_bed_id').html('');
        $('#upt_bed_id').append('<option value="">- Choose -</option>');
        $.each(obj_bedList.data, function(i, item){
            $('#upt_bed_id').append('<option value="'+item.bed_id+'">'+item.bed_no.toUpperCase()+'</option>');
        });
    });
});
//-------------------------------------------------- end change select Room --------------------------------------------------//


//-------------------------------------------------- change select Status --------------------------------------------------//
$('#upt_booking_status').change(function(){
    let stts = $(this).val();
    let stdId = $('#upt_stud_id').val();

    if( stts == 'Accept' ){
        chkStdChkIn(stdId, function(){
            let count = obj_chkInOut.data.length;
            if(count != 0){
                swal({
                    text: "Student had New Check In record.",
                    type: "info"
                });
                $('#upt_booking_status').val('');
            }
        });
    }
});
//-------------------------------------------------- end change select Status --------------------------------------------------//


//-------------------------------------------------- add Check in when booking status==Accept --------------------------------------------------//
function addChkIn(bookId, data){
    let stdId = data.std_id;
    let campus_id = data.campus_id;
    let hstl_id = data.hstl_id;
    let blok_id = data.blok_id;
    let room_id = data.room_id;
    let checkIn = data.checkIn;
    
    var form = new FormData();
    form.append("fk_booking", bookId);
    form.append("type", 'Book');
    form.append("stud_id", stdId);
    form.append("branch_id", campus_id);
    form.append("hostel_id", hstl_id);
    form.append("block_id", blok_id);
    form.append("room_id", room_id);
    form.append("checkIn", checkIn);
    form.append("checkIn_status", 'New');
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
//-------------------------------------------------- add Check in when booking status==Accept --------------------------------------------------//


function listBooking(returnValue){
    var settings = {
        "url": host+"api_hep/public/hepHostelBooking/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_booking = response;
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


    // Function to toggle the update button state
    function toggleUpdateButton() {
        // Get the selected value of booking status
        var bookingStatus = $("#upt_booking_status").val();
        // Get the selected room's tbed attribute value
        var roomTbed = $("#upt_room_id option:selected").attr("tbed");

        // Check if booking status is not 'Reject' and room's tbed is "0"
        if ((bookingStatus !== 'Reject' && roomTbed === "0")||(bookingStatus === 'New' && roomTbed === "0")) {
            // Disable the update button
            $(".btnUpdate").prop("disabled", true);
            $("#label_status").attr("hidden", false);

        } else {
            // Enable the update button
            $(".btnUpdate").prop("disabled", false);
            $("#label_status").attr("hidden", true);
            
        }
    }
