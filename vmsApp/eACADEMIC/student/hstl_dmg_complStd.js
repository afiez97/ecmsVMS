$(function () {
    $.ajaxSetup({
        cache: false,
    });

    let studId = window.sessionStorage.std_studentid;
    $("#studentId").val(studId);

    // select Campus List
    campusList(function () {
        $("#FK_clg").append('<option value="">- Choose -</option>');
        $("#upt_FK_clg").append('<option value="">- Choose -</option>');
        $.each(obj_college.data, function (i, item) {
            $("#FK_clg").append(
                '<option value="' + item.pk_id + '">' + item.clg_name + "</option>"
            );
            $("#upt_FK_clg").append(
                '<option value="' + item.pk_id + '">' + item.clg_name + "</option>"
            );
        });
    });

    // select Type
    aduanType(function () {
        // $("#aduan_type").html("");
        $("#upt_FK_jenisaduanHostel").html("");
        // $("#aduan_type").append('<option value="">- Choose -</option>');
        $("#upt_FK_jenisaduanHostel").append('<option value="">- Choose -</option>');
        $.each(obj_aduanType.data, function (i, item) {
            // console.log(item);
            $("#FK_jenisaduanHostel").append(
                '<option value="' + item.pk_id + '">' + item.aduan_nama + "</option>"
            );
            $("#upt_FK_jenisaduanHostel").append(
                '<option value="' + item.pk_id + '">' + item.aduan_nama + "</option>"
            );
        });
    });
    // student info
    student_info(studId, function () {
        $('#stdIcNo').val(obj_stdInfo.data.sti_icno);
    });
    // // Discipline List
    // listAduan(studId, function () {
    //     createTbl(obj_report.data);
    // });
});
var confirmed = false;

// check format file & size before upload
$(".chkFormat").on("change", function(){
    // check size
    if(this.files[0].size > 3000000){
      alert("Please upload file less than 3MB. Thanks!!");
      $(this).val('');
    }

    // check type
    var extension = $(this).val().split('.').pop().toLowerCase();
    if($.inArray(extension, ['pdf','jpg','jpeg','png']) == -1) {
        alert('Please upload PDF file or Image only.');
        $(this).val('');
    }
});

function student_info(id, returnValue) {
    var settings = {
        "url": host + "api_pengurusan_pelajar/public/misStdInfo/show/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    let request = $.ajax(settings);

    request.done(function (response) {
        obj_stdInfo = response;
        returnValue();
    });

    request.fail(function (response) {
        window.sessionStorage.clear();
        window.localStorage.clear();
        window.location.reload();
        obj_stdInfo = response;
        returnValue();
    });
}
// function regDmgComplaint() { }

//-------------------------------------------------- add Report --------------------------------------------------//
$("#formAddReport").on("submit", function (e) {
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "ADD DAMAGE COMPLAINT",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false,
        }).then(function () {
            let FK_jenisaduanHostel = $('#FK_jenisaduanHostel').val();
            let FK_idStudent = $("#studentId").val();
            // let aduan_rujukan = $("#aduan_rujukan").val();
            let aduan_venue = $("#aduan_venue").val();
            // let aduan_status = $("#aduan_status").val();
            // let aduan_warden_assigned = $("#aduan_warden_assigned").val();
            let aduan_details = $("#aduan_details").val();
            // let aduan_warden_remark = $("#aduan_warden_remark").val();
            // let aduan_alert = $("#aduan_alert").val();
            let FK_clg = $("#FK_clg").val();
            let FK_block = $("#FK_block").val();
            let FK_hostel = $("#FK_hostel").val();
            let FK_room = $("#FK_room").val();

            let aduan_date = convertDateFormat($("#aduan_date").val());

            let aduan_upload = $("#aduan_upload")[0].files[0];

            var form = new FormData();
            form.append("FK_jenisaduanHostel", FK_jenisaduanHostel);
            form.append("FK_idStudent", FK_idStudent);
            // form.append("aduan_rujukan", aduan_rujukan);
            form.append("aduan_venue", aduan_venue);
            form.append("aduan_status", 'New');
            // form.append("aduan_warden_assigned", aduan_warden_assigned);
            form.append("aduan_details", aduan_details);
            form.append("aduan_date", aduan_date);
            // form.append("aduan_warden_remark", aduan_warden_remark);
            // form.append("aduan_alert", aduan_alert);
            form.append("FK_clg", FK_clg);
            form.append("FK_block", FK_block);
            form.append("FK_hostel", FK_hostel);
            form.append("FK_room", FK_room);
            form.append("aduan_upload", aduan_upload);
            form.append("recordstatus", "ADD");
            // let obj = new post(host + "api_hep/public/hepaduan/register", form, "picoms " + token).execute();
            // if (obj.success) {
            //     window.location.reload();
            // form.append("clg_id", clg_id);

            // }else{
            //     Swal(result.message, result.data, "error");
            //     return;
            // }
            var settings = {
                "url": host + "api_hep/public/hep_aduanResponden/register",
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
//-------------------------------------------------- end add Report --------------------------------------------------//

//-------------------------------------------------- create table --------------------------------------------------//

let objTable = new get(host + 'api_hep/public/hep_aduanResponden/' + window.sessionStorage.std_studentid, 'picoms ' + window.sessionStorage.token).execute();
if (objTable.success) {
    calendar_data = objTable.data;

    var colums = [
        { "name": "bil", "title": "No." },
        { "name": "kediaman", "title": "Location" },
        { "name": "aduan_type", "title": "Type" },
        { "name": "aduan_details", "title": "Details Complaint" },
        { "name": "aduan_date", "title": "Date", "breakpoints": "md sm xs" },
        // { "name": "aduan_venue", "title": "Venue", "breakpoints": "md sm xs" },
        { "name": "aduan_status", "title": "Status", "breakpoints": "md sm xs" },
        { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
    ];

    let bil = 1;
    let convertList = JSON.stringify(calendar_data);
    $("#dataList").val(convertList);
    var list = [];

    $.each(calendar_data, function (i, field) {
// console.log(field);
        let aduanStts = field.aduan_status;
        let viewBtn = ''; let label = ''; let alert = '';
        if (aduanStts == 'New') {
            viewBtn = '<button class="btn btn-icon success" title="Update" onclick="loadData(\'' + i + '\')"><i class="ion-android-create"></i></button> ' +
                '<button class="btn btn-icon danger" title="Delete" onclick="delData(\'' + field.pk_id + '\')"><i class="ion-trash-a"></i></button>';

            label = '<span class="label warning">' + aduanStts + '</span>';
        }
        else if (aduanStts == 'Accept') {
            viewBtn = '<button class="btn btn-icon accent" title="View" onclick="loadViewData(\'' + i + '\')" ><i class="ion-eye"></i></button>';
            label = '<span class="label success">' + aduanStts + '</span>';
        }
        else if (aduanStts == 'Complete') {
            viewBtn = '<button class="btn btn-icon accent" title="View" onclick="loadViewData(\'' + i + '\')" ><i class="ion-eye"></i></button>';
            label = '<span class="label grey">' + aduanStts + '</span>';
        }    
         else if( aduanStatus == 'Reject' ){
            viewBtn = '<button class="btn btn-icon danger" title="Delete" onclick="delData(\'' + field.pk_id + '\')"><i class="ion-trash-a"></i></button>';
            label = '<span class="label orange">'+aduanStatus+'</span>';
        }else{
            label = '<span class="label">'+aduanStatus+'</span>';
        }

        if (field.aduan_alert != 1) { alert = 'hidden' }
        else { alert = '' }

        list.push({
            bil: '<span class="label label-xs danger" ' + alert + '></span> ' + bil++,
            kediaman: 
            `<span>`+ field.clg_name + `</span><br>
            <span>`+ field.hostel_name + `</span><br>
            <span>`+ field.block_name + `</span><br>`
            +`<strong class="text-uppercase">` + field.FK_room + `</strong><br>`,
            aduan_type: '<span class="text-uppercase">' + field.aduan_nama + '</span>',
            aduan_details: '<span class="text-uppercase">' + field.aduan_details + '</span>',
            aduan_date: formatDate1(field.aduan_date),
            // aduan_venue: '<span class="text-uppercase">' + field.aduan_venue + '</span>',
            aduan_status: label,
            upt_btn: viewBtn
        });
    });

    $("#dmgComplaintList").html('');
    $("#dmgComplaintList").footable({
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

//-------------------------------------------------- end create table --------------------------------------------------//



//-------------------------------------------------- delete Report --------------------------------------------------//
function delData(id) {
    var form = new FormData();
    // form.append("recordstatus", 'DEL');
    form.append("pk_id", id);

    swal({
        title: "REMOVE DAMAGE COMPLAINT",
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
            "url": host + "api_hep/public/hep_aduanResponden/delete",
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
//-------------------------------------------------- delete Report --------------------------------------------------//


//-------------------------------------------------- update Report --------------------------------------------------//
$('#formUptReport').on('submit', function (e) {
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "UPDATE DAMAGE COMPLAINT",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let pk_id = $('#pk_id').val();
            let clg_id = $('#upt_FK_clg').val();
            let FK_jenisaduanHostel = $('#upt_FK_jenisaduanHostel').val();
            let aduan_date = $('#upt_aduan_date').val();
            let FK_hostel = $('#upt_FK_hostel').val();
            let FK_block = $('#upt_FK_block').val();
            let aduan_venue = $('#upt_aduan_venue').val();
            let aduan_details = $('#upt_aduan_details').val();
            let FK_room = $('#upt_FK_room').val();
            let exist_aduan_upload = $('#exist_aduan_upload').val();
            let aduan_upload = $('#upt_aduan_upload')[0].files[0];

            var form = new FormData();
            form.append("pk_id", pk_id);
            form.append("FK_jenisaduanHostel", FK_jenisaduanHostel);
            form.append("FK_clg", clg_id);
            // form.append("aduan_type", aduan_type);
            form.append("aduan_date", aduan_date);
            form.append("FK_hostel", FK_hostel);
            form.append("aduan_upload", aduan_upload);
            form.append("FK_block", FK_block);
            form.append("aduan_venue", aduan_venue);
            form.append("aduan_details", aduan_details);
            form.append("FK_room", FK_room);
            form.append("exist_aduan_upload", exist_aduan_upload);
            form.append("recordstatus", 'EDT');




            var settings = {
                "url": host + "api_hep/public/hep_aduanResponden/update/updateByStudent",
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
//-------------------------------------------------- end update Report --------------------------------------------------//
// //-------------------------------------------------- update Report --------------------------------------------------//
// $('#formUptReport').on('submit', function(e){
//     if(!confirmed){
//         e.preventDefault();
//         swal({
//             title: "UPDATE REPORT",
//             text: "Are You Sure?",
//             type: "question",
//             showCancelButton: true,
//             confirmButtonText: "Update",
//             confirmButtonColor: "#22b66e",
//             closeOnConfirm: true,
//             allowOutsideClick: false,
//             html: false
//         }).then(function (){
//             let id_aduan = $('#pk_id').val();
//             let clg_id = $('#upt_clg_id').val();
//             let aduan_type = $('#upt_aduan_type').val();
//             let aduan_venue = $('#upt_aduan_venue').val();
//             let aduan_remark = $('#upt_aduan_remark').val();
//             let aduan_date = $('#upt_aduan_date').val();
//             let aduan_upload = $('#upt_aduan_upload')[0].files[0];
//             let exist_aduan_upload = $('#exist_aduan_upload').val();

//             var form = new FormData();
//             form.append("id_aduan", id_aduan);
//             form.append("clg_id", clg_id);
//             form.append("aduan_type", aduan_type);
//             form.append("aduan_venue", aduan_venue);
//             form.append("aduan_remark", aduan_remark);
//             form.append("aduan_date", aduan_date);
//             form.append("aduan_upload", aduan_upload);
//             form.append("exist_aduan_upload", exist_aduan_upload);
//             form.append("recordstatus",'EDT');

//             var settings = {
//                 "url": host+"api_hep/public/hepaduan/uptStd",
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
// //-------------------------------------------------- end update Report --------------------------------------------------//



//-------------------------------------------------- details Report --------------------------------------------------//
// edit data
function loadData(index) {
    let data = JSON.parse($("#dataList").val());
    let aduanType = data[index].FK_jenisaduanHostel;
    let branchId = data[index].FK_clg;
    let hostelId = data[index].FK_hostel;
    let blockId = data[index].FK_block;
    let roomId = data[index].FK_room;
    // let aduan_date = data[index].aduan_date;

    console.log(data);
    $('#pk_id').val(data[index].pk_id);
    $('#upt_FK_jenisaduanHostel').val(aduanType);
    $('#upt_FK_clg').val(data[index].FK_clg);
    $('#upt_FK_hostel').val(data[index].FK_hostel).trigger('change');   
    // $('#upt_aduan_upload').val(data[index].aduan_upload);
    $('#upt_FK_block').val(data[index].FK_block);
    $('#upt_aduan_details').val(data[index].aduan_details);
    $('#upt_FK_room').val(data[index].FK_room);
    $('#upt_aduan_venue').val(data[index].aduan_venue);
    $('#upt_aduan_date').val(data[index].aduan_date);




    // select hostel
    hstlClgList(branchId, function () {
        $('#upt_FK_hostel').html('');
        $('#upt_FK_hostel').append('<option value="">- Choose -</option>');
        $.each(obj_hstlList.data, function (i, item) {
            $('#upt_FK_hostel').append('<option value="' + item.hostel_id + '">' + item.hostel_name.toUpperCase() + '</option>');
        });
        $('#upt_FK_hostel').val(hostelId);
    });

    // select block
    blockList(hostelId, function () {
        $('#upt_FK_block').html('');
        $('#upt_FK_block').append('<option value="">- Choose -</option>');
        $.each(obj_blockList.data, function (i, item) {
            $('#upt_FK_block').append('<option value="' + item.block_id + '">' + item.block_name.toUpperCase() + '</option>');
        });
        $('#upt_FK_block').val(blockId);
    });

    // // select room
    // roomList(blockId, function () {
    //     $('#upt_FK_room').html('');
    //     $('#upt_FK_room').append('<option value="">- Choose -</option>');
    //     $.each(obj_roomList.data, function (i, item) {
    //         $('#upt_FK_room').append('<option value="' + item.room_id + '">' + item.room_no.toUpperCase() + '</option>');
    //     });
    //     $('#upt_FK_room').val(roomId);
    // });  

    // // select bed
    // bedList(roomId, function () {
    //     $('#upt_FK_room').html('');
    //     $('#upt_FK_room').append('<option value="">- Choose -</option>');
    //     $.each(obj_bedList.data, function (i, item) {
    //         $('#upt_FK_room').append('<option value="' + item.bed_id + '">' + item.bed_no.toUpperCase() + '</option>');
    //     });
    //     $('#upt_FK_room').val(data[index].bedId);
    // });


    if (!(data[index].aduan_upload == '' || data[index].aduan_upload == null || data[index].aduan_upload == 'undefined')) {
        $('#view_aduan_upload').html('<a target="_blank" class="btn btn-icon primary" href="' + host + 'api_hep/public/aduanHostel/' + data[index].aduan_upload + '" title="' + data[index].aduan_upload + '"><i class="fa fa-file-pdf-o"></i></a>');
        $('#exist_aduan_upload').val(data[index].aduan_upload);
    }
    else {
        $('#view_aduan_upload').html('<button type="button" class="btn btn-icon"><i class="fa fa-file-pdf-o"></i></button>');
        $('#exist_aduan_upload').val('');
    }

    $('#modalUpdate').modal('show');
}

// view data
function loadViewData(index){
    let data = JSON.parse($("#dataList").val());
    let aduanId = data[index].id_aduan;
    let aduanType = data[index].aduan_type;
    let aduanStts = data[index].aduan_status;
    let aduanUpload = data[index].aduan_upload;
    let stdId = data[index].stud_icno;
    let viewUpload = '';
// console.log(data);
    if(!(aduanUpload == '' || aduanUpload == null)){
        viewUpload = '<a target="_blank" style="color:cornflowerblue" href="'+host+'api_hep/public/aduanHostel/'+aduanUpload+'"><span class="label info">Document</span></a>';
    }

    $('#aduanId').val(aduanId);
    $('#view_FK_clg').html(data[index].clg_name);
    $('#view_aduan_type').html(data[index].aduan_nama   );
    $('#view_aduan_venue').html(data[index].FK_room+`,<br>`+data[index].block_name+`,<br>`+data[index].hostel_name+`,<br>`+data[index].clg_name);
    // $('#view_aduan_venue').html(data[index].aduan_venue);
    $('#view_upload').html(viewUpload);
    $('#view_aduan_remark').html(data[index].aduan_warden_remark);
    $('#view_aduan_date').html(formatDate1(data[index].aduan_date));
    $('#view_aduan_warden_assigned').html(data[index].emp_name);
    $('#view_aduan_warden_remark').html(data[index].aduan_warden_remark);

    if( aduanType == 2 ){ $('.sttsKerosakan').removeClass('collapse'); }
    else{ $('.sttsKerosakan').addClass('collapse'); }

    if( aduanStts == 'New' ){ $('#view_aduan_status').html('<span class="label warning">'+aduanStts+'</span>'); }
    else if( aduanStts == 'Accept' ){ $('#view_aduan_status').html('<span class="label success">'+aduanStts+'</span>'); }
    else if( aduanStts == 'Complete' ){ $('#view_aduan_status').html('<span class="label grey">'+aduanStts+'</span>'); }

    // update alert
    var form = new FormData();
    form.append("id_aduan", aduanId);
    form.append("aduan_alert", 0);
    form.append("recordstatus",'EDT');

    var settings = {
        "url": host+"api_hep/public/hepaduan/uptAlert",
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
            // count alert==1
            $('#alertMenuDis').hide();
            $('#alertReport').hide();
            alertReport(stdId, function(){
                let count = obj_aduan.data.length;
                if(count != 0){
                    $('#alertMenuDis').show();
                    $('#alertReport').html(count);
                    $('#alertReport').show();
                }
            });

            listAduan(stdId, function(){
                createTbl(obj_report.data);
            });
        }
    });

    $('#modalView').modal('show');
}
//-------------------------------------------------- end details Report --------------------------------------------------//

//-------------------------------------------------- change select Branch --------------------------------------------------//
$('#FK_clg').change(function () {
    let branchId = $('#FK_clg').val();

    hstlClgList(branchId, function () {
        $('#FK_hostel').html('');
        $('#FK_block').html('');
        $('#FK_room').html('');
        $('#FK_hostel').append('<option value="">- Choose -</option>');
        $.each(obj_hstlList.data, function (i, item) {
            $('#FK_hostel').append('<option value="' + item.hostel_id + '">' + item.hostel_name.toUpperCase() + '</option>');
        });
    });
});

//-------------------------------------------------- end change select Branch --------------------------------------------------//


//-------------------------------------------------- change select Hostel --------------------------------------------------//
$('#FK_hostel').change(function () {
    let hostelId = $('#FK_hostel').val();
    let stdIcNo = $('#stdIcNo').val();
    let getVal = stdIcNo.slice(-1);
    let gender = '';

    if (getVal % 2 == 0) { gender = 'Female' }
    else { gender = 'Male' }

    $('#FK_block').html('');
    $('#FK_room').html('');

    listBlckHstlGndr(hostelId, gender, function () {
        $('#FK_block').append('<option value="">- Choose -</option>');
        $.each(obj_block.data, function (i, item) {
            $('#FK_block').append('<option value="' + item.block_id + '">' + item.block_name.toUpperCase() + '</option>');
        });
    });
});

//-------------------------------------------------- end change select Hostel --------------------------------------------------//


//-------------------------------------------------- change select Block --------------------------------------------------//
$('#FK_block').change(function () {
    let blockId = $('#FK_block').val();

    roomList(blockId, function () {
        $('#FK_room').html('');
        $('#FK_room').append('<option value="">- Choose -</option>');
        $.each(obj_roomList.data, function (i, item) {
            $('#FK_room').append('<option value="' + item.room_id + '" totalBed="' + item.total_bed + '">' + item.room_no.toUpperCase() + '</option>');
        });
    });
});

//-------------------------------------------------- end change select Block --------------------------------------------------//


//-------------------------------------------------- change select Room --------------------------------------------------//
$('#FK_room').change(function () {
    let roomId = $('#FK_room').val();
    let totalBed = $(this).find('option:selected').attr('totalBed');

    countOccupied(roomId, function () {
        let occupied = obj_chkInOut.data.length;
        if (occupied >= totalBed) {
            swal({
                text: "The Room is Full.",
                type: "info"
            });
            $('#FK_room').val('');
        }
    });
});

//-------------------------------------------------- end change select Room --------------------------------------------------//



function aduanType(returnValue) {
    var settings = {
        "url": host + "api_hep/public/hep_jenisaduanHostel/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_aduanType = response;
        returnValue();
    });
}







function campusList(returnValue) {
    var settings = {
        "url": host + "api_tetapan_picoms/public/misPrmCollege/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    // $.ajax(settings).done(function (response){
    //    obj_college = response;
    //    returnValue();
    // });

    let request = $.ajax(settings);

    request.done(function (response) {
        obj_college = response;
        returnValue();
    });

    request.fail(function (response) {
        window.sessionStorage.clear();
        window.localStorage.clear();
        window.location.reload();
        obj_college = response;
        returnValue();
    });
}


function hstlClgList(id, returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepHostel/listByBranch/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_hstlList = response;
        returnValue();
    });
}


//-------------------------------------------------- hep_hostel_blok --------------------------------------------------//
function blockList(id, returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepHostelBlok/listByHostel/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_blockList = response;
        returnValue();
    });
}

// list block by Hostel & Gender
function listBlckHstlGndr(id, gender, returnValue) {
    var form = new FormData();
    form.append("hostel_id", id);
    form.append("block_gender", gender);

    var settings = {
        "url": host + "api_hep/public/hepHostelBlok/listByHstlGndr",
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
        obj_block = JSON.parse(response);
        returnValue();
    });
}
//-------------------------------------------------- end hep_hostel_blok --------------------------------------------------//


function roomList(id, returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepHostelRoom/listByBlok/" + id,
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
