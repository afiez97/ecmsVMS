$(function () {
    $.ajaxSetup({
        cache: false
    });

    let studId = window.sessionStorage.std_studentid;
    $('#studentId').val(studId);

    // select Branch
    campusList(function () {

        $('#branch_id').append('<option value="">- Choose -</option>');
        $('#upt_branch_id').append('<option value="">- Choose -</option>');
        $.each(obj_college.data, function (i, item) {
            $('#branch_id').append('<option value="' + item.pk_id + '">' + item.clg_name + '</option>');
            $('#upt_branch_id').append('<option value="' + item.pk_id + '">' + item.clg_name + '</option>');
        });
    });

    // Booking List
    listBooking(studId, function () {
        var colums = [
            { "name": "bil", "title": "No." },
            { "name": "applied", "title": "Applied Hostel" },
            { "name": "acceptedHostel", "title": "Accepted Hostel" },
            // { "name": "branch_id", "title": "Campus" },
            // { "name": "hostel_id", "title": "Hostel" },
            // { "name": "block_id", "title": "Block", "breakpoints": "md sm xs" },
            // { "name": "room_id", "title": "Room", "breakpoints": "md sm xs" },
            { "name": "expected_chkInDate", "title": "Check In Date", "breakpoints": "md sm xs" },
            { "name": "booking_status", "title": "Status", "breakpoints": "md sm xs" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];

        let bil = 1;
        let convertList = JSON.stringify(obj_booking.data);
        $("#dataList").val(convertList);
        var list = [];

        $.each(obj_booking.data, function (i, field) {
            let bookingStatus = field.booking_status;
            let btnDsply = '';
            let approved_hostel= '';
            let obj = new get(host + "api_hep/public/hepHostelChkinout/bookingSite/checkBookinngList/" + field.booking_id, 'picoms ' + window.sessionStorage.token).execute();

            if(obj.success){
             result = obj.data;

             approved_hostel = result.clg_name+`<br>`+result.hostel_name+`<br>`+result.block_name+`<br>`+result.room_no ;
            }
            // else{
            //     approved_hostel = '';
            //  return;

            // }

            if (bookingStatus == 'New') {
                bookingStatus = '<span class="label warning">' + bookingStatus + '</span>';
                btnDsply = '<button class="btn btn-icon success" title="Update" onclick="loadData(\'' + i + '\')" ><i class="ion-android-create"></i></button> ' +
                    '<button class="btn btn-icon danger" title="Delete" onclick="delData(\'' + field.booking_id + '\')"><i class="ion-trash-a"></i></button>';
            }
            else if (bookingStatus == 'Accept') {
                bookingStatus = '<span class="label success">' + bookingStatus + '</span>';
                btnDsply = '<i class="ion-checkmark-circled"></i>';
            }
            else if (bookingStatus == 'Reject') {
                bookingStatus = '<span class="label danger">' + bookingStatus + '</span>';

                if (field.notify_std == 'Yes') {
                    console.log('yes');
                    btnDsply = '<button class="btn btn-icon success" title="View" onclick="sttsReject(\'' + field.booking_id + '\')"><i class="ion-checkmark"></i></button>';
                }
                else { console.log('no'); btnDsply = '<i class="ion-checkmark-circled"></i>'; }

            }
            // console.log(approved_hostel);
            list.push({
                bil: bil++,

                
                // branch_id: '<span class="text-uppercase">' + field.clg_name + '</span>', 
                // hostel_id: '<span class="text-uppercase">' + field.hostel_name + '</span>',
                // block_id: '<span class="text-uppercase">' + field.block_name + '</span>',
                // room_id: '<span class="text-uppercase">' + field.room_no + '</span>',
                
                
                applied: '<span class="text-uppercase">' + field.clg_name + '</span><br>'
                + '<span class="text-uppercase">' + field.hostel_name + '</span><br>'
                +'<span class="text-uppercase">' + field.block_name + '</span><br>'
                +'<span class="text-uppercase">' + field.room_no + '</span>',
                acceptedHostel: approved_hostel,
                expected_chkInDate: formatDate(field.expected_chkInDate),
                booking_status: bookingStatus, upt_btn: btnDsply
            });
        });

        $("#bookingList").html('');
        $("#bookingList").footable({
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
    });

    // student info
    student_info(studId, function () {
        $('#stdIcNo').val(obj_stdInfo.data.sti_icno);
    });
});
var confirmed = false;


//-------------------------------------------------- add Booking --------------------------------------------------//
$('#formAddBooking').on('submit', function (e) {
    if (!confirmed) {
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
        }).then(function () {
            let branch_id = $('#branch_id').val();
            let hostel_id = $('#hostel_id').val();
            let block_id = $('#block_id').val();
            let room_id = $('#room_id').val();
            let bed_id = $('#bed_id').val();
            // let expected_chkInDate = $('#expected_chkInDate').val();
            let originalDate = $('#expected_chkInDate').val();
            let stud_id = $('#studentId').val();
            // // alert(expected_chkInDate);

            //   // Convert the original date string to a Date object
            //   let parts = originalDate.split('/');
            //   let dateObject = new Date(parts[2], parts[1] - 1, parts[0]);

            //   // Format the date object to 'YYYY-MM-DD' format
            //   let expected_chkInDate = dateObject.toISOString().split('T')[0];

            let expected_chkInDate = convertDateFormat(originalDate);



            // var form = new FormData();
            // form.append("branch_id", branch_id);
            // form.append("hostel_id", hostel_id);
            // form.append("block_id", block_id);
            // form.append("room_id", room_id);
            // form.append("bed_id", bed_id);
            // form.append("expected_chkInDate", expected_chkInDate);
            // form.append("stud_id", stud_id);
            // form.append("booking_status", "New");
            // form.append("recordstatus",'ADD');

            // var settings = {
            //     "url": host+"api_hep/public/hepHostelBooking/register",
            //     "method": "POST",
            //     "timeout": 0,
            //     "headers": {
            //         "Authorization": "picoms " + window.sessionStorage.token
            //     },
            //     "processData": false,
            //     "mimeType": "multipart/form-data",
            //     "contentType": false,
            //     "data": form
            // };

            // $.ajax(settings).done(function (response){
            //     result = JSON.parse(response);
            //     if (!result.success) {
            //         Swal(result.message, result.data, "error");
            //         return;
            //     }
            //     window.location.reload();
            // });

            let obj = new get(host + "api_hep/public/hepHostelChkinout/checking/chkSttsInAndNEw/" + stud_id, 'picoms ' + window.sessionStorage.token).execute();
            if (obj.success) {

                swal('Fail To Booking',
                    'Student Already Checkin',
                    'error'
                ); return;
            }
            else {



                let obj_checkBooking = new get(host + "api_hep/public/hepHostelBooking/show/" + stud_id, 'picoms ' + window.sessionStorage.token).execute();
                if (obj_checkBooking.success) {

                    swal('Fail To Booking',
                        'Already Booking',
                        'error'
                    ); return;
                } else {

                    var form = new FormData();
                    form.append("branch_id", branch_id);
                    form.append("hostel_id", hostel_id);
                    form.append("block_id", block_id);
                    form.append("room_id", room_id);
                    // form.append("bed_id", bed_id);
                    form.append("expected_chkInDate", expected_chkInDate);
                    form.append("stud_id", stud_id);
                    form.append("booking_status", "New");
                    form.append("recordstatus", 'ADD');

                    let obj_RegBooking = new post(host + "api_hep/public/hepHostelBooking/register" ,form , 'picoms ' + window.sessionStorage.token).execute();

                    // var settings = {
                    //     "url": host + "api_hep/public/hepHostelBooking/register",
                    //     "method": "POST",
                    //     "timeout": 0,
                    //     "headers": {
                    //         "Authorization": "picoms " + window.sessionStorage.token
                    //     },
                    //     "processData": false,
                    //     "mimeType": "multipart/form-data",
                    //     "contentType": false,
                    //     "data": form
                    // };

                    // $.ajax(settings).done(function (response) {
                    //     result = JSON.parse(response);
                    //     if (!result.success) {
                    //         Swal(result.message, result.data, "error");
                    //         return;
                    //     }
                    //     window.location.reload();
                    // });

                    if (obj_RegBooking.success) {
                         window.location.reload();

                    } else {
                        Swal(result.message, result.data, "error");
                        return;                   
                     }
                }





            }

            // var settings = {
            //     "url": host+"api_hep/public/hepHostelChkinout/alertStdNew/"+stud_id,
            //     "method": "GET",
            //     "timeout": 0,
            //     "headers": {
            //         "Authorization": "picoms " + window.sessionStorage.token
            //     },
            // };













        });
    }
});
//-------------------------------------------------- end add Booking --------------------------------------------------//


//-------------------------------------------------- loadData Booking --------------------------------------------------//
function loadData(index) {
    let data = JSON.parse($("#dataList").val());
    let branchId = data[index].branch_id;
    let hostelId = data[index].hostelId;
    let blockId = data[index].blockId;
    let roomId = data[index].roomId;
    let stdIcNo = $('#stdIcNo').val();
    let getVal = stdIcNo.slice(-1);


    let obj = new get(host + "api_pengurusan_pelajar/public/pelajar/show/det/sti_icno/" + stdIcNo, 'picoms ' + window.sessionStorage.token).execute();

    if (obj.success) {
        gender = obj.data.sti_gender_name;
    } else {
        if (getVal % 2 == 0) { gender = 'Female' }
        else { gender = 'Male' }
    }

    $('#pk_id').val(data[index].booking_id);
    $('#upt_branch_id').val(branchId);
    $('#upt_expected_chkInDate').val(data[index].expected_chkInDate);

    // select hostel
    hstlClgList(branchId, function () {
        $('#upt_hostel_id').html('');
        $('#upt_hostel_id').append('<option value="">- Choose -</option>');
        $.each(obj_hstlList.data, function (i, item) {
            $('#upt_hostel_id').append('<option value="' + item.hostel_id + '">' + item.hostel_name.toUpperCase() + '</option>');
        });
        $('#upt_hostel_id').val(hostelId);
    });

    // select block
    listBlckHstlGndr(hostelId, gender, function () {
        $('#upt_block_id').html('');
        $('#upt_block_id').append('<option value="">- Choose -</option>');
        $.each(obj_block.data, function (i, item) {
            $('#upt_block_id').append('<option value="' + item.block_id + '">' + item.block_name.toUpperCase() + '</option>');
        });
        $('#upt_block_id').val(blockId);
    });

    // select room
    roomList2(blockId, function () {
        $('#upt_room_id').html('');
        $('#upt_room_id').append('<option value="">- Choose -</option>');
        $.each(obj_roomList.data, function (i, item) {
            // $('#room_id').append('<option value="' + item.room_id + '" totalBed="' + item.total_bed + '">' + item.room_no.toUpperCase() + '</option>');
            totalBedAvailable = 0;
            // console.log(parseInt(item.total_bed));
            let obj = new get(host + "api_hep/public/hepHostelBooking/checkingRoomBooked/" + item.room_id, 'picoms ' + window.sessionStorage.token).execute();

            if (obj.success) {
                totalBedAvailable = parseInt(item.total_bed) -parseInt(item.total_occupied) - (obj.count);
            }

            if (totalBedAvailable<=0) {
                disableActive = 'disabled';
                disableActiveText = '(Room Full)';
            }else{  disableActive = '';
            // disableActiveText = '';
            disableActiveText = '( '+totalBedAvailable +' Kosong )';
        }
            // $("#upt_room_id").append(
            //     '<option value="' +
            //     item.room_id +
            //     '" totalBed="' +
            //     item.total_bed +
            //     '">' +
            //     item.room_no.toUpperCase() + `</option>`
            // );
             $("#upt_room_id").append(
                '<option value="' +
                item.room_id +
                '" totalBed="' +
                item.total_bed +
                '" ' +
                disableActive +
                '>' +
                item.room_no.toUpperCase() + ` ${disableActiveText}</option>`
            );
        });
        $('#upt_room_id').val(roomId);
    });

    $('#updateBooking').modal('show');
}

// view data
function viewData(index) {
    let data = JSON.parse($("#dataList").val());
    data = data[index];
    let bookStatus = data.booking_status;

    if (bookStatus == 'New') {
        bookStatus = '<span class="label warning text-uppercase">' + bookStatus + '</span>';
    }
    else if (bookStatus == 'Accept') {
        bookStatus = '<span class="label success text-uppercase">' + bookStatus + '</span>';
    }
    else if (bookStatus == 'Reject') {
        bookStatus = '<span class="label danger text-uppercase">' + bookStatus + '</span>';
    }

    $('#booking_id').val(data.booking_id);
    $('#chkIn_bed').val(data.bedId);
    $('#view_branch_id').html(data.clg_name);
    $('#view_hostel_id').html(data.hostel_name);
    $('#view_block_id').html(data.block_name);
    $('#view_room_id').html(data.room_no);
    $('#view_expected_chkInDate').html(formatDate(data.expected_chkInDate));
    $('#view_booking_status').html(bookStatus);

    $('#mdlViewBooking').modal('show');
}
//-------------------------------------------------- end loadData Booking --------------------------------------------------//


//-------------------------------------------------- update Booking --------------------------------------------------//
$('#formUptBooking').on('submit', function (e) {
    if (!confirmed) {
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
        }).then(function () {
            let booking_id = $('#pk_id').val();
            let branch_id = $('#upt_branch_id').val();
            let hostel_id = $('#upt_hostel_id').val();
            let block_id = $('#upt_block_id').val();
            let room_id = $('#upt_room_id').val();
            let expected_chkInDate = $('#upt_expected_chkInDate').val();

            var form = new FormData();
            form.append("booking_id", booking_id);
            form.append("branch_id", branch_id);
            form.append("hostel_id", hostel_id);
            form.append("block_id", block_id);
            form.append("room_id", room_id);
            // form.append("bed_id", bed_id);
            form.append("expected_chkInDate", expected_chkInDate);
            form.append("recordstatus", 'EDT');

            var settings = {
                "url": host + "api_hep/public/hepHostelBooking/uptByStd",
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
                if (!result.success) {
                    Swal(result.message, result.data, "error");
                    return;
                }
                window.location.reload();
            });
        });
    }
});
//-------------------------------------------------- end update Booking --------------------------------------------------//


//-------------------------------------------------- delete Hostel --------------------------------------------------//
function delData(id) {
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
    }).then(function () {
        var settings = {
            "url": host + "api_hep/public/hepHostelBooking/delete",
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
            if (!result.success) {
                Swal(result.message, result.data, "error");
                return;
            }
            window.location.reload();
        });
    });
}
//-------------------------------------------------- end delete Hostel --------------------------------------------------//


//-------------------------------------------------- change select Branch --------------------------------------------------//
$('#branch_id').change(function () {
    let branchId = $('#branch_id').val();

    hstlClgListActive(branchId, function () {
        $('#hostel_id').html('');
        $('#block_id').html('');
        $('#room_id').html('');
        $('#hostel_id').append('<option value="">- Choose -</option>');


        // checkHostel(obj_hstlListActive.data)


        // $.each(obj_hstlListActive.data, function (i, item) {
        //     $('#hostel_id').append('<option value="' + item.hostel_id + '">' + item.hostel_name.toUpperCase() + '</option>');
        // });


        // coding asal atas
        checkHostel(obj_hstlListActive.data, function (filteredHostels) {
            // Populate hostel select dropdown with available hostels
            $.each(filteredHostels, function (i, item) {
                $('#hostel_id').append('<option value="' + item.hostel_id + '">' + item.hostel_name.toUpperCase() + '</option>');
            });
        });
        //end coding asal atas

    });
});

$('#upt_branch_id').change(function () {
    let branchId = $('#upt_branch_id').val();

    hstlClgListActive(branchId, function () {
        $('#upt_hostel_id').html('');
        $('#upt_block_id').html('');
        $('#upt_room_id').html('');
        $('#upt_hostel_id').append('<option value="">- Choose -</option>');
        // $.each(obj_hstlListActive.data, function (i, item) {
        //     $('#upt_hostel_id').append('<option value="' + item.hostel_id + '">' + item.hostel_name.toUpperCase() + '</option>');
        // });

        // coding asal atas
        checkHostel(obj_hstlListActive.data, function (filteredHostels) {
            // Populate hostel select dropdown with available hostels
            $.each(filteredHostels, function (i, item) {
                $('#upt_hostel_id').append('<option value="' + item.hostel_id + '">' + item.hostel_name.toUpperCase() + '</option>');
            });
        });
        //end coding asal atas

    });
});
//-------------------------------------------------- end change select Branch --------------------------------------------------//


//-------------------------------------------------- change select Hostel --------------------------------------------------//
$('#hostel_id').change(function () {
    let hostelId = $('#hostel_id').val();
    let stdIcNo = $('#stdIcNo').val();
    let getVal = stdIcNo.slice(-1);
    let gender = '';


    let obj = new get(host + "api_pengurusan_pelajar/public/pelajar/show/det/sti_icno/" + stdIcNo, 'picoms ' + window.sessionStorage.token).execute();

    if (obj.success) {
        gender = obj.data.sti_gender_name;
    } else {
        if (getVal % 2 == 0) { gender = 'Female' }
        else { gender = 'Male' }
    }

    $('#block_id').html('');
    $('#room_id').html('');

    listBlckHstlGndr(hostelId, gender, function () {
        $('#block_id').append('<option value="">- Choose -</option>');
        $.each(obj_block.data, function (i, item) {
            $('#block_id').append('<option value="' + item.block_id + '">' + item.block_name.toUpperCase() + '</option>');
        });
    });
});

$('#upt_hostel_id').change(function () {
    let hostelId = $('#upt_hostel_id').val();
    let stdIcNo = $('#stdIcNo').val();
    let getVal = stdIcNo.slice(-1);
    let gender = '';

    let obj = new get(host + "api_pengurusan_pelajar/public/pelajar/show/det/sti_icno/" + stdIcNo, 'picoms ' + window.sessionStorage.token).execute();

    if (obj.success) {
        gender = obj.data.sti_gender_name;
    } else {
        if (getVal % 2 == 0) { gender = 'Female' }
        else { gender = 'Male' }
    }

    $('#upt_block_id').html('');
    $('#upt_room_id').html('');

    listBlckHstlGndr(hostelId, gender, function () {
        $('#upt_block_id').append('<option value="">- Choose -</option>');
        $.each(obj_block.data, function (i, item) {
            $('#upt_block_id').append('<option value="' + item.block_id + '">' + item.block_name.toUpperCase() + '</option>');
        });
    });
});
//-------------------------------------------------- end change select Hostel --------------------------------------------------//


//-------------------------------------------------- change select Block --------------------------------------------------//
$('#block_id').change(function () {
    let blockId = $('#block_id').val();

    roomList2(blockId, function () {
        // console.log(obj_roomList);

        $('#room_id').html('');
        $('#room_id').append('<option value="">- Choose -</option>');
        $.each(obj_roomList.data, function (i, item) {
            // $('#room_id').append('<option value="' + item.room_id + '" totalBed="' + item.total_bed + '">' + item.room_no.toUpperCase() + '</option>');
            // totalBedAvailable = parseInt(item.total_bed) - item.total_occupied;
            console.log(item);
            totalBedAvailable = 0;
            // console.log(parseInt(item.total_bed));
            // let objcountOccupied = new get(host + "api_hep/public/hepHostelChkinout/countChkIn/" + item.room_id, 'picoms ' + window.sessionStorage.token).execute();
            // if (objcountOccupied.success) {
            //     // console.log(objcountOccupied);
            //     occupied = objcountOccupied.count;

            //     totalBedAvailable = parseInt(item.total_bed) - occupied;

            // }

            let obj = new get(host + "api_hep/public/hepHostelBooking/checkingRoomBooked/" + item.room_id, 'picoms ' + window.sessionStorage.token).execute();

            if (obj.success) {
                totalBedAvailable = parseInt(item.total_bed) -parseInt(item.total_occupied) - (obj.count);
            }

            if (totalBedAvailable<=0) {
                disableActive = 'disabled';
                disableActiveText = '(Room Full)';
            }else{  disableActive = '';
            // disableActiveText = '';
            disableActiveText = '( '+totalBedAvailable +' Kosong )';
        }

            $("#room_id").append(
                '<option value="' +
                item.room_id +
                '" totalBed="' +
                item.total_bed +
                '" ' +
                disableActive +
                '>' +
                item.room_no.toUpperCase() + ` ${disableActiveText}</option>`
            );
            // $("#room_id").append(
            // '<option value="' +
            //     item.room_id +
            //     '" totalBed="' +
            //     item.total_bed +
            //     '">' +
            //     item.room_no.toUpperCase() +` (`+totalBedAvailable+
            //     " Kosong) </option>"
            // );
        });
    });
});

$('#upt_block_id').change(function () {
    let blockId = $('#upt_block_id').val();

    // roomList(blockId, function () {
    //     $('#upt_room_id').html('');
    //     $('#upt_room_id').append('<option value="">- Choose -</option>');
    //     $.each(obj_roomList.data, function (i, item) {
    //         $('#upt_room_id').append('<option value="' + item.room_id + '" totalBed="' + item.total_bed + '">' + item.room_no.toUpperCase() + '</option>');
    //     });
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
                '<option value="' +
                item.room_id +
                '" totalBed="' +
                item.total_bed +
                '">' +
                item.room_no.toUpperCase() + `</option>`
            );
            // $("#upt_room_id").append(
            // '<option value="' +
            //     item.room_id +
            //     '" totalBed="' +
            //     item.total_bed +
            //     '">' +
            //     item.room_no.toUpperCase() +` (`+totalBedAvailable+
            //     " Kosong) </option>"
            // );
        });
    });
});
//-------------------------------------------------- end change select Block --------------------------------------------------//


//-------------------------------------------------- change select Room --------------------------------------------------//
$('#room_id').change(function () {
    let roomId = $('#room_id').val();
    let totalBed = $(this).find('option:selected').attr('totalBed');

    countOccupied(roomId, function () {
        let occupied = obj_chkInOut.data.length;
        if (occupied >= totalBed) {
            swal({
                text: "The Room is Full.",
                type: "info"
            });
            $('#room_id').val('');
        }
    });
});

$('#upt_room_id').change(function () {
    let roomId = $('#upt_room_id').val();
    let totalBed = $(this).find('option:selected').attr('totalBed');

    countOccupied(roomId, function () {
        let occupied = obj_chkInOut.data.length;
        if (occupied >= totalBed) {
            swal({
                text: "The Room is Full.",
                type: "info"
            });
            $('#room_id').val('');
        }
    });
});
//-------------------------------------------------- end change select Room --------------------------------------------------//


//-------------------------------------------------- update notify if status==Reject --------------------------------------------------//
function sttsReject(id) {
    swal({
        text: "Booking Rejected.",
        type: "info"
    }).then(function () {
        var settings = {
            "url": host + "api_hep/public/hepHostelBooking/uptNotifyStd/" + id,
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Authorization": "picoms " + window.sessionStorage.token
            },
        };

        $.ajax(settings).done(function (response) {
            result = response;
            if (!result.success) {
                Swal(result.message, result.data, "error");
                return;
            }
            window.location.reload();
        });
    });
}
//-------------------------------------------------- end update notify if status==Reject --------------------------------------------------//
function roomList2(id, returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepHostelRoom/listByBlok2/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_roomList = response;
        returnValue();
    });
}

function listBooking(id, returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepHostelBooking/listByStud/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_booking = response;
        returnValue();
    });
}