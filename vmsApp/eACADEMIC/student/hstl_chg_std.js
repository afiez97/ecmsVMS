$(function () {
    $.ajaxSetup({
        cache: false
    });

    let studId = window.sessionStorage.std_studentid;
    $('#studentId').val(studId);
    loadDataOldToChange()

    // select Branch
    campusList(function () {
        $('#branch_id').append('<option value="">- Choose -</option>');
        $('#upt_branch_id').append('<option value="">- Choose -</option>');
        $.each(obj_college.data, function (i, item) {
            $('#branch_id').append('<option value="' + item.pk_id + '">' + item.clg_name + '</option>');
            $('#upt_branch_id').append('<option value="' + item.pk_id + '">' + item.clg_name + '</option>');
        });
    });

    // Change List
    listChange(studId, function () {
        var colums = [
            { "name": "bil", "title": "No." },
            { "name": "clg_name", "title": "Branch" },
            { "name": "currentHost", "title": "Current Hostel" },
            { "name": "hostel_id", "title": "Applied Hostel" },
            { "name": "change_reason", "title": "Reason" },
            { "name": "change_status", "title": "Status" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];

        let bil = 1;
        let convertList = JSON.stringify(obj_change.data);
        $("#dataList").val(convertList);
        var list = [];

        $.each(obj_change.data, function (i, field) {
            let changeStatus = field.change_status;
            let btnDsply = '';
            let rebook = 'rebook';

            let obj = new get(host + 'api_hep/public/hepHostelChkinout/checking/chkLatestRoom/' + field.stud_id, 'picoms ' + window.sessionStorage.token).execute();

            if (changeStatus == 'New') {
                changeStatus = '<span class="label warning">' + changeStatus + '</span>';
                btnDsply = '<button class="btn btn-icon success" title="Update" onclick="loadData(\'' + i + '\',\'update\'\)" ><i class="ion-android-create"></i></button> ' +
                    '<button class="btn btn-icon danger" title="Delete" onclick="delData(\'' + field.change_id + '\')"><i class="ion-trash-a"></i></button>';
            }
            else if (changeStatus == 'Accept') {
                changeStatus = '<span class="label success">' + changeStatus + '</span>';
                btnDsply = '<button class="btn btn-icon accent" title="View" onclick="viewData(\'' + i + '\')"><i class="ion-eye"></i></button>';
            }
            else if (changeStatus == 'Reject') {
                changeStatus = '<span class="label danger">' + changeStatus + '</span>';
                btnDsply = '<button class="btn btn-icon accent" title="View" onclick="viewData(\'' + i + '\')"><i class="ion-eye"></i></button>';
            }
            else if (changeStatus == 'Verify') {
                changeStatus = '<span class="label info">' + changeStatus + '</span>';
                btnDsply = '<i class="fa fa-spin fa-spinner"></i>';
            }

            list.push({
                bil: bil++, clg_name: '<span class="text-uppercase">' + field.clg_name + '</span>',
                change_reason: '<span class="text-uppercase">' + field.change_reason + '</span>',
                change_status: changeStatus,
                currentHost: '<span class="text-uppercase">' + obj.data.hostel_name + '<br>' + obj.data.block_name + '<br>' + obj.data.room_no + '</span>',
                hostel_id: '<span class="text-uppercase">' + field.hostel_name + '<br>' + field.block_name + '<br>' + field.room_no + '</span>',
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

    // student info
    student_info(studId, function () {
        $('#stdIcNo').val(obj_stdInfo.data.sti_icno);
    });


    // Hostel status List
    checkLateststatus(studId, function () {

        let convertList = JSON.stringify(obj_checkIn.data);
        // console.log(obj_checkIn.data);

        $.each(obj_checkIn.data, function (i, field) {
            let chkOutStts = field.checkIn_status;
            // let chkOutStts = field.checkIn_status !== null ? field.checkIn_status : '';


            if (chkOutStts == 'New' || chkOutStts == 'Check Out') {

                $('#hostelchangedisabled')
                    .prop('disabled', true)
                    .attr('title', 'This button is disabled. If you have not checked in or have already checked out, kindly note that you are not eligible to request a change in hostels.');

            }

        });

    });


});
var confirmed = false;


//-------------------------------------------------- add Change --------------------------------------------------//
$('#formAddChange').on('submit', function (e) {

    // Prevent student gila yg ubah value
    let changeReasonVal = $('#change_reason').val();
    let words = changeReasonVal.split(' ');
    let validReasons = ['Programme', 'Practical', 'Conflict', 'Order', 'Facilities'];
    let change_reason = (validReasons.includes(changeReasonVal) && words.length === 1) ? changeReasonVal : '';
    // end Prevent student gila yg ubah value

    if (validReasons.includes(changeReasonVal) && words.length === 1) {
        if (!confirmed) {
            e.preventDefault();
            swal({
                title: "Add Change Hostel",
                text: "Are You Sure?",
                type: "question",
                showCancelButton: true,
                confirmButtonText: "Save",
                confirmButtonColor: "#2196f3",
                closeOnConfirm: true,
                allowOutsideClick: false,
                html: false
            }).then(function () {

                let stud_id = $('#studentId').val();


                let obj_checkChange = new get(host + "api_hep/public/hepHostelChange/show/" + stud_id, 'picoms ' + window.sessionStorage.token).execute();
                // if (!(obj_checkChange.data.recordstatus === 'DEL' && obj_checkChange.data.change_status === 'New')) {
                //  if (!  (obj_checkChange.data.recordstatus === 'DEL' || obj_checkChange.data.change_status === 'New' || obj_checkChange.data.change_status === 'Reject')) {
                if (obj_checkChange.data.recordstatus !== 'DEL') {


                    if (obj_checkChange.data.change_status === 'New') {

                        swal('Fail To Change Already Change',
                            'Already Change',
                            'error'
                        ); return;

                    } else {


                        let obj_checkBooking = new get(host + "api_hep/public/hepHostelBooking/show/" + stud_id, 'picoms ' + window.sessionStorage.token).execute();
                        if (obj_checkBooking.success) {
                            // alert('SNI');
                            swal('Fail To Change',
                                'Already Booking',
                                'error'
                            ); return;
                        } else {


                            let fk_booking = $('#pk_booking').val();
                            let fk_chkInOut = $('#pk_chkInOut').val();
                            let campus_id = $('#branch_id').val();
                            let hostel_id = $('#hostel_id').val();
                            let block_id = $('#block_id').val();
                            let room_id = $('#room_id').val();
                            let chgStd_remark = $('#remark_std').val();

                            // let change_reason = $('#change_reason').val();
                            let date_apply = $('#date_apply').val();

                            var form = new FormData();
                            form.append("fk_booking", fk_booking);
                            form.append("fk_chkInOut", fk_chkInOut);
                            form.append("stud_id", stud_id);
                            form.append("campus_id", campus_id);
                            form.append("hostel_id", hostel_id);
                            form.append("block_id", block_id);
                            form.append("room_id", room_id);
                            form.append("date_apply", date_apply);
                            form.append("change_reason", change_reason);
                            form.append("chgStd_remark", chgStd_remark);
                            form.append("change_status", "New");
                            form.append("recordstatus", 'ADD');

                            var settings = {
                                "url": host + "api_hep/public/hepHostelChange/register",
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

                        }


                    }

                } else {

                    let obj_checkBooking = new get(host + "api_hep/public/hepHostelBooking/show/" + stud_id, 'picoms ' + window.sessionStorage.token).execute();
                    if (obj_checkBooking.success) {

                        swal('Fail To Change',
                            'Already Booking',
                            'error'
                        ); return;
                    } else {

                        let fk_booking = $('#pk_booking').val();
                        let fk_chkInOut = $('#pk_chkInOut').val();
                        let campus_id = $('#branch_id').val();
                        let hostel_id = $('#hostel_id').val();
                        let block_id = $('#block_id').val();
                        let room_id = $('#room_id').val();
                        // let change_reason = $('#change_reason').val();
                        let date_apply = $('#date_apply').val();
                        let chgStd_remark = $('#remark_std').val();

                        var form = new FormData();
                        form.append("fk_booking", fk_booking);
                        form.append("fk_chkInOut", fk_chkInOut);
                        form.append("stud_id", stud_id);
                        form.append("campus_id", campus_id);
                        form.append("hostel_id", hostel_id);
                        form.append("block_id", block_id);
                        form.append("room_id", room_id);
                        form.append("date_apply", date_apply);
                        form.append("change_reason", change_reason);
                        form.append("chgStd_remark", chgStd_remark);
                        form.append("change_status", "New");
                        form.append("recordstatus", 'ADD');

                        var settings = {
                            "url": host + "api_hep/public/hepHostelChange/register",
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



                    }


                }




                // let fk_booking = $('#pk_booking').val();
                // let fk_chkInOut = $('#pk_chkInOut').val();
                // let stud_id = $('#studentId').val();
                // let campus_id = $('#branch_id').val();
                // let hostel_id = $('#hostel_id').val();
                // let block_id = $('#block_id').val();
                // let room_id = $('#room_id').val();
                // let change_reason = $('#change_reason').val();
                // let date_apply = $('#date_apply').val();

                // var form = new FormData();
                // form.append("fk_booking", fk_booking);
                // form.append("fk_chkInOut", fk_chkInOut);
                // form.append("stud_id", stud_id);
                // form.append("campus_id", campus_id);
                // form.append("hostel_id", hostel_id);
                // form.append("block_id", block_id);
                // form.append("room_id", room_id);
                // form.append("date_apply", date_apply);
                // form.append("change_reason", change_reason);
                // form.append("change_status", "New");
                // form.append("recordstatus",'ADD');

                // var settings = {
                //     "url": host+"api_hep/public/hepHostelChange/register",
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
            });
        }
    } else {
        e.preventDefault();

        swal("Failed", "Please dont change anything value on Developer tools", "error");
    }

});
//-------------------------------------------------- end add Change --------------------------------------------------//


//-------------------------------------------------- Details --------------------------------------------------//
function loadData(index, action) {
    let data = JSON.parse($("#dataList").val());
    let branchId = data[index].hostel_branch;
    let hostelId = data[index].hostel_id;
    let blockId = data[index].block_id;
    let roomId = data[index].room_id;
    let chgStatus = data[index].change_status;
    let stdIcNo = $('#stdIcNo').val();
    let getVal = stdIcNo.slice(-1);
    let gender = '';

    if (getVal % 2 == 0) { gender = 'Female' }
    else { gender = 'Male' }

    $('#pk_id').val(data[index].change_id);
    $('#upt_change_reason').val(data[index].change_reason);
    $('#upt_change_status').val(chgStatus);
    $('#upt_branch_id').val(branchId);

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

    // // select room
    // roomList(blockId, function(){
    //     $('#upt_room_id').html('');
    //     $('#upt_room_id').append('<option value="">- Choose -</option>');
    //     $.each(obj_roomList.data, function(i, item){
    //         $('#upt_room_id').append('<option value="'+item.room_id+'" totalBed="'+item.total_bed+'">'+item.room_no.toUpperCase()+'</option>');
    //     });
    //     $('#upt_room_id').val(roomId);
    // });
    roomList2(blockId, function () {
        // console.log(obj_roomList);

        $('#upt_room_id').html('');
        $('#upt_room_id').append('<option value="">- Choose -</option>');
        $.each(obj_roomList.data, function (i, item) {
            // $('#room_id').append('<option value="' + item.room_id + '" totalBed="' + item.total_bed + '">' + item.room_no.toUpperCase() + '</option>');
            // console.log(parseInt(item.total_bed));
            // $("#upt_room_id").append(
            //     '<option value="' +
            //     item.room_id +
            //     '" totalBed="' +
            //     item.total_bed +
            //     '">' +
            //     item.room_no.toUpperCase() + ` (` + totalBedAvailable +
            //     " Kosong) </option>"
            // );
            totalBedAvailable = 0;

            let obj = new get(host + "api_hep/public/hepHostelBooking/checkingRoomBooked/" + item.room_id, 'picoms ' + window.sessionStorage.token).execute();

            if (obj.success) {
                totalBedAvailable = parseInt(item.total_bed) - parseInt(item.total_occupied) - (obj.count);
            }

            if (totalBedAvailable <= 0) {
                disableActive = 'disabled';
                disableActiveText = '(Room Full)';
            } else {
                disableActive = '';
                // disableActiveText = '';
                disableActiveText = '( ' + totalBedAvailable + ' Kosong )';
            }
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
    if (action == 'rebook') {
        // select bed
        bedByRoom(roomId, function () {
            $('#upt_bed_id').html('');
            $('#upt_bed_id').append('<option value="">- Choose -</option>');
            $.each(obj_bedList.data, function (i, item) {
                $('#upt_bed_id').append('<option value="' + item.bed_id + '">' + item.bed_no.toUpperCase() + '</option>');
            });
            $('#upt_bed_id').val(data[index].bed_id);
        });

        $('.divView').attr('disabled', true);
        $('#expctd_chkin_date').attr('required', true);
        $('#divDate').show();
        // $('.formUpdate').attr('id','formUptRebook');
    }
    else {
        // select bed
        // bedList(roomId, function(){
        //     $('#upt_bed_id').html('');
        //     $('#upt_bed_id').append('<option value="">- Choose -</option>');
        //     $.each(obj_bedList.data, function(i, item){
        //         $('#upt_bed_id').append('<option value="'+item.bed_id+'">'+item.bed_no.toUpperCase()+'</option>');
        //     });
        //     $('#upt_bed_id').val(data[index].bed_id);
        // });

        $('.divView').attr('disabled', false);
        $('#expctd_chkin_date').attr('required', false);
        $('#divDate').hide();
        // $('.formUpdate').attr('id','formUptChange');
    }

    $('#updateChange').modal('show');
}
//-------------------------------------------------- end Details --------------------------------------------------//


//-------------------------------------------------- view data --------------------------------------------------//
function viewData(index) {
    let data = JSON.parse($("#dataList").val());
    data = data[index];
    let chgStatus = data.change_status;

    if (chgStatus == 'Accept') { chgStatus = '<span class="label success">' + chgStatus + '</span>' }
    else if (chgStatus == 'Reject') {
        chgStatus = '<span class="label danger">' + chgStatus + '</span>';
        uptNotifyStd(data.change_id);
    }

    $('#view_hostel_id').html(data.clg_name + '<br>' + data.hostel_name + '<br>' + data.block_name + ' ( ' + data.room_no + ' )');
    $('#view_chg_reason').html(data.change_reason);
    $('#view_chg_status').html(chgStatus);
    $('#view_chg_remark').html(data.chg_remark);

    $('#mdlViewChg').modal('show');
}
//-------------------------------------------------- end view data --------------------------------------------------//


//-------------------------------------------------- update Change --------------------------------------------------//
$('#formUpdate').on('submit', function (e) {
    if (!confirmed) {
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
        }).then(function () {
            let change_id = $('#pk_id').val();
            let campus_id = $('#upt_branch_id').val();
            let hostel_id = $('#upt_hostel_id').val();
            let block_id = $('#upt_block_id').val();
            let room_id = $('#upt_room_id').val();
            let change_reason = $('#upt_change_reason').val();

            var form = new FormData();
            form.append("change_id", change_id);
            form.append("campus_id", campus_id);
            form.append("hostel_id", hostel_id);
            form.append("block_id", block_id);
            form.append("room_id", room_id);
            form.append("change_reason", change_reason);
            form.append("recordstatus", 'EDT');

            var settings = {
                "url": host + "api_hep/public/hepHostelChange/uptByStd",
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
//-------------------------------------------------- end update Change --------------------------------------------------//


//-------------------------------------------------- update Rebook --------------------------------------------------//
$('#updateChange').on('submit', '#formUptRebook', function (e) {
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Update Re-book Hostel",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let chg_id = $('#pk_id').val();
            let branch_id = $('#upt_branch_id').val();
            let hostel_id = $('#upt_hostel_id').val();
            let block_id = $('#upt_block_id').val();
            let room_id = $('#upt_room_id').val();
            let bed_id = $('#upt_bed_id').val();
            let stud_id = $('#studentId').val();
            let expected_chkInDate = $('#expctd_chkin_date').val();

            var form = new FormData();
            form.append("branch_id", branch_id);
            form.append("hostel_id", hostel_id);
            form.append("block_id", block_id);
            form.append("room_id", room_id);
            form.append("bed_id", bed_id);
            form.append("stud_id", stud_id);
            form.append("expected_chkInDate", expected_chkInDate);
            form.append("booking_status", 'Accepted');
            form.append("recordstatus", 'ADD');

            var settings = {
                "url": host + "api_hep/public/hepHostelBooking/register",
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
                else { uptChgStatus(chg_id) }
                window.location.reload();
            });
        });
    }
});
//-------------------------------------------------- end update Rebook --------------------------------------------------//


//-------------------------------------------------- delete change --------------------------------------------------//
function delData(id) {
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
    }).then(function () {
        var settings = {
            "url": host + "api_hep/public/hepHostelChange/delete",
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
//-------------------------------------------------- end delete change --------------------------------------------------//


//-------------------------------------------------- change select Branch --------------------------------------------------//
$('#branch_id').change(function () {
    let branchId = $('#branch_id').val();

    hstlClgListActive(branchId, function () {
        $('#hostel_id').html('');
        $('#block_id').html('');
        $('#room_id').html('');
        $('#hostel_id').append('<option value="">- Choose -</option>');
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
        $('#upt_bed_id').html('');
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

    if (getVal % 2 == 0) { gender = 'Female' }
    else { gender = 'Male' }

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

    // roomList(blockId, function(){
    //     $('#room_id').html('');
    //     $('#room_id').append('<option value="">- Choose -</option>');
    //     $.each(obj_roomList.data, function(i, item){
    //         $('#room_id').append('<option value="'+item.room_id+'" totalBed="'+item.total_bed+'">'+item.room_no.toUpperCase()+'</option>');
    //     });
    // });


    roomList2(blockId, function () {
        // console.log(obj_roomList);

        $('#room_id').html('');
        $('#room_id').append('<option value="">- Choose -</option>');
        $.each(obj_roomList.data, function (i, item) {
            // $('#room_id').append('<option value="' + item.room_id + '" totalBed="' + item.total_bed + '">' + item.room_no.toUpperCase() + '</option>');
            // totalBedAvailable = parseInt(item.total_bed) - item.total_occupied;
            // console.log(parseInt(item.total_bed));

            totalBedAvailable = 0;
            // // console.log(parseInt(item.total_bed));
            // let objcountOccupied = new get(host + "api_hep/public/hepHostelChkinout/countChkIn/" + item.room_id, 'picoms ' + window.sessionStorage.token).execute();
            // if (objcountOccupied.success) {
            //     // console.log(objcountOccupied);
            //     occupied = objcountOccupied.count;

            //     totalBedAvailable = parseInt(item.total_bed) - occupied;

            // }

            let obj = new get(host + "api_hep/public/hepHostelBooking/checkingRoomBooked/" + item.room_id, 'picoms ' + window.sessionStorage.token).execute();

            if (obj.success) {
                totalBedAvailable = parseInt(item.total_bed) - parseInt(item.total_occupied) - (obj.count);
            }

            if (totalBedAvailable <= 0) {
                disableActive = 'disabled';
                disableActiveText = '(Room Full)';
            } else {
                disableActive = '';
                // disableActiveText = '';
                disableActiveText = '( ' + totalBedAvailable + ' Kosong )';
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
            //     '<option value="' +
            //     item.room_id +
            //     '" totalBed="' +
            //     item.total_bed +
            //     '">' +
            //     item.room_no.toUpperCase() + `</option>`
            // );
        });
    });
});

$('#upt_block_id').change(function () {
    let blockId = $('#upt_block_id').val();

    // roomList(blockId, function(){
    //     $('#upt_room_id').html('');
    //     $('#upt_bed_id').html('');
    //     $('#upt_room_id').append('<option value="">- Choose -</option>');
    //     $.each(obj_roomList.data, function(i, item){
    //         $('#upt_room_id').append('<option value="'+item.room_id+'" totalBed="'+item.total_bed+'">'+item.room_no.toUpperCase()+'</option>');
    //     });
    // });
    roomList2(blockId, function () {
        // console.log(obj_roomList);

        $('#upt_room_id').html('');
        $('#upt_bed_id').html('');
        $('#upt_room_id').append('<option value="">- Choose -</option>');
        $.each(obj_roomList.data, function (i, item) {
            // // $('#room_id').append('<option value="' + item.room_id + '" totalBed="' + item.total_bed + '">' + item.room_no.toUpperCase() + '</option>');
            // totalBedAvailable = parseInt(item.total_bed) - item.total_occupied;
            // // console.log(parseInt(item.total_bed));
            totalBedAvailable = 0;

            let obj = new get(host + "api_hep/public/hepHostelBooking/checkingRoomBooked/" + item.room_id, 'picoms ' + window.sessionStorage.token).execute();

            if (obj.success) {
                totalBedAvailable = parseInt(item.total_bed) - parseInt(item.total_occupied) - (obj.count);
            }

            if (totalBedAvailable <= 0) {
                disableActive = 'disabled';
                disableActiveText = '(Room Full)';
            } else {
                disableActive = '';
                // disableActiveText = '';
                disableActiveText = '( ' + totalBedAvailable + ' Kosong )';
            }
            // $("#upt_room_id").append(
            //     '<option value="' +
            //     item.room_id +
            //     '" totalBed="' +
            //     item.total_bed +
            //     '">' +
            //     item.room_no.toUpperCase() + ` (` + totalBedAvailable +
            //     " Kosong) </option>"
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


// update status change hostel
function uptChgStatus(id) {
    // if(!confirmed){
    //     swal({
    //         title: "Verify Change Hostel",
    //         text: "Are You Sure?",
    //         type: "question",
    //         showCancelButton: true,
    //         confirmButtonText: "Verify",
    //         confirmButtonColor: "#22b66e",
    //         closeOnConfirm: true,
    //         allowOutsideClick: false,
    //         html: false
    //     }).then(function (){
    var form = new FormData();
    form.append("change_id", id);
    form.append("change_status", 'Complete');
    form.append("recordstatus", 'EDT');

    var settings = {
        "url": host + "api_hep/public/hepHostelChange/uptStatus",
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
        // window.location.reload();
    });
    //     });
    // }
}


function uptNotifyStd(id) {
    // var form = new FormData();
    // form.append("change_id", change_id);
    // form.append("notify_std", notify_std);
    // form.append("recordstatus",'EDT');

    var settings = {
        "url": host + "api_hep/public/hepHostelChange/uptNotifyStd/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
        // "processData": false,
        // "mimeType": "multipart/form-data",
        // "contentType": false,
        // "data": form
    };

    $.ajax(settings).done(function (response) {
        result = response;
        if (!result.success) {
            Swal(result.message, result.data, "error");
            return;
        }
        // else{
        //     if(change_status == 'Accept'){
        //         uptHstlBed(bed_id, 'Booked');
        //     }
        //     // else if(change_status == 'Reject'){ uptNotifyStd(change_id); }
        // }
        // window.location.reload();
    });
}


function listChange(id, returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepHostelChange/listByStd/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_change = response;
        returnValue();
    });
}


//-------------------------------------------------- load data Change Hostel --------------------------------------------------//
function loadDataOldToChange() {
    // let data = JSON.parse($("#dataList").val());
    let objCheckingRoom = new get(host + 'api_hep/public/hepHostelChkinout/checking/chkLatestRoom/' + $('#studentId').val(), 'picoms ' + window.sessionStorage.token).execute();
    if (objCheckingRoom.success) {
        data = objCheckingRoom.data;
        // $('#pk_id').val(data.change_id);
        // $('#std_id').val(data.stud_id);
        $('#pk_id_chkINout').val(data.chkInOut_id);
        $('#std_id').val(data.stud_id);
        $('#campus_id').val(data.branch_id);
        $('#hstl_id').val(data.hostel_id);
        $('#blok_id').val(data.block_id);
        $('#room_id').val(data.room_id);

        $('#viewChg_stud_name').html(data.sti_name);
        $('#viewChg_stud_id').html(data.stud_id);
        $('#viewChg_stud_gender').html(data.sti_gender);
        $('#viewChg_detail_room').html(data.clg_name + `<br>` + data.hostel_name + `<br>` + data.block_name + `<br>` + data.room_no);
    }



    // $('#upt_hostel_id').html(data[index].clg_name+'<br>'+data[index].hostel_name+'<br>'+data[index].block_name+'<br>'+data[index].room_no);
    // $('#upt_stud_name').html(data[index].sti_name);


    // $('#upt_change_reason').html(data[index].change_reason);
    // // $('#chg_status').val(data[index].change_status);
    // $('#change_remark').val(data[index].chg_remark);
    // $('#upt_change_status').html(changeStatus);
    // $('#viewChg_stud_id').html(data[index].chg_remark);

}
//-------------------------------------------------- end load data Change Hostel --------------------------------------------------//


//-------------------------------------------------- add Change --------------------------------------------------//
$('#formAddChangeSiteChange').on('submit', function (e) {


    
    // Prevent student gila yg ubah value
    let changeReasonVal = $('#change_reason').val();
    let words = changeReasonVal.split(' ');
    let validReasons = ['Programme', 'Practical', 'Conflict', 'Order', 'Facilities'];
    let change_reason = (validReasons.includes(changeReasonVal) && words.length === 1) ? changeReasonVal : '';
    // end Prevent student gila yg ubah value

    if (validReasons.includes(changeReasonVal) && words.length === 1) {
        
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Add Change Hostel",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {

            let stud_id = $('#std_id').val();

            let chgStd_remark = $('#remark_std').val();

            let obj_checkChange = new get(host + "api_hep/public/hepHostelChange/show/" + stud_id, 'picoms ' + window.sessionStorage.token).execute();
            // if (!(obj_checkChange.data.recordstatus === 'DEL' && obj_checkChange.data.change_status === 'New')) {
            //  if (!  (obj_checkChange.data.recordstatus === 'DEL' || obj_checkChange.data.change_status === 'New' || obj_checkChange.data.change_status === 'Reject')) {
            if (obj_checkChange.data.recordstatus !== 'DEL') {


                if (obj_checkChange.data.change_status === 'New') {

                    swal('Fail To Change Already Change',
                        'Already Change',
                        'error'
                    ); return;

                } else {


                    let obj_checkBooking = new get(host + "api_hep/public/hepHostelBooking/show/" + stud_id, 'picoms ' + window.sessionStorage.token).execute();
                    if (obj_checkBooking.success) {

                        swal('Fail To Change',
                            'Already Booking',
                            'error'
                        ); return;
                    } else {
                        let fk_chkInOut = $('#pk_id_chkINout').val();

                        let obj_checkCheckIn = new get(host + "api_hep/public/hepHostelChkinout/checking/" + fk_chkInOut, 'picoms ' + window.sessionStorage.token).execute();
                        if (obj_checkCheckIn.success) {
                            // let fk_booking = $('#pk_booking').val();
                            let campus_id = $('#branch_id').val();
                            let hostel_id = $('#hostel_id').val();
                            let block_id = $('#block_id').val();
                            let room_id = $('#room_id').val();
                            let change_reason = $('#change_reason').val();
                            let date_apply = $('#date_apply').val();

                            var form = new FormData();
                            // form.append("fk_booking", fk_booking);
                            form.append("fk_chkInOut", fk_chkInOut);

                            form.append("stud_id", stud_id);
                            form.append("campus_id", campus_id);
                            form.append("hostel_id", hostel_id);
                            form.append("block_id", block_id);
                            form.append("room_id", room_id);
                            // form.append("date_apply", date_apply);
                            form.append("date_apply", getCurrentDateTime());
                            form.append("change_reason", change_reason);
                            form.append("chgStd_remark", chgStd_remark);
                            form.append("change_status", "New");
                            form.append("recordstatus", 'ADD');
                            var settings = {
                                "url": host + "api_hep/public/hepHostelChange/register",
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
                        } else {
                            swal('Fail To Change',
                                'Already Check Out or New',
                                'error'
                            ); return;
                        }


                    }


                }

            } else {

                let obj_checkBooking = new get(host + "api_hep/public/hepHostelBooking/show/" + stud_id, 'picoms ' + window.sessionStorage.token).execute();
                if (obj_checkBooking.success) {

                    swal('Fail To Change',
                        'Already Booking',
                        'error'
                    ); return;
                } else {

                    let fk_chkInOut = $('#pk_chkInOut').val();

                    let obj_checkCheckIn = new get(host + "api_hep/public/hepHostelChkinout/checking/" + fk_chkInOut, 'picoms ' + window.sessionStorage.token).execute();
                    if (obj_checkCheckIn.success) {

                        let fk_booking = $('#pk_booking').val();
                        let campus_id = $('#branch_id').val();
                        let hostel_id = $('#hostel_id').val();
                        let block_id = $('#block_id').val();
                        let room_id = $('#room_id').val();
                        let change_reason = $('#change_reason').val();
                        // let date_apply = $('#date_apply').val();
                        var form = new FormData();
                        form.append("fk_booking", fk_booking);
                        form.append("fk_chkInOut", fk_chkInOut);
                        form.append("stud_id", stud_id);
                        form.append("campus_id", campus_id);
                        form.append("hostel_id", hostel_id);
                        form.append("block_id", block_id);
                        form.append("room_id", room_id);
                        form.append("date_apply", getCurrentDateTime());
                        form.append("chgStd_remark", chgStd_remark);

                        form.append("change_reason", change_reason);
                        form.append("change_status", "New");
                        form.append("recordstatus", 'ADD');

                        var settings = {
                            "url": host + "api_hep/public/hepHostelChange/register",
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
                    } else {
                        swal('Fail To Change',
                            'Already Check Out or New',
                            'error'
                        ); return;
                    }





                }


            }


        });
    }
    } else {
        e.preventDefault();

        swal("Failed", "Please dont change anything value on Developer tools", "error");
 
    }



});
//-------------------------------------------------- end add Change --------------------------------------------------//


function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


function listCheckIn(id, returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepHostelChkinout/listByStd/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_checkIn = response;
        returnValue();
    });
}

function checkLateststatus(id, returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepHostelChkinout/checkLateststatus/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_checkIn = response;
        returnValue();
    });
}