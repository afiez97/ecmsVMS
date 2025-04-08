$(function () {
    $.ajaxSetup({
        cache: false
    });
    $.fn.select2.defaults.set("theme", "bootstrap");

    let userRole = window.sessionStorage.userRole;
    let usrId = window.sessionStorage.usrId;
    $('#usrId').val(usrId);

    // if( userRole == 'kaunselor' ){
    // $('#btnNewRecord').hide();
    listCounseling(function () {
        tblCounByCounselor(obj_counseling.data, usrId);
    });
    

    // select Campus List
    campusList(function () {
        $('#clg_id').append('<option value="">- Choose -</option>');
        $('#upt_clg_id').append('<option value="">- Choose -</option>');
        $.each(obj_college.data, function (i, item) {
            $('#clg_id').append('<option value="' + item.pk_id + '">' + item.clg_name + '</option>');
            $('#upt_clg_id').append('<option value="' + item.pk_id + '">' + item.clg_name + '</option>');
        });
    });

    listingTypecaun(function () {
        $('#counselling_reason').append('<option value="">- Choose -</option>');
        $('#upt_counselling_reason').append('<option value="">- Choose -</option>');
        $.each(obj_type_caun.data, function (i, item) {
            $('#counselling_reason').append('<option value="' + item.pk_id + '">' + item.description + '</option>');
            $('#upt_counselling_reason').append('<option value="' + item.pk_id + '">' + item.description + '</option>');
        });
    });
});
var confirmed = false;


// check student exist
$('.coun_name').on('input', function () {
    let input = $(this).val();
    if (input != '') {
        chkStdExist(input, function () {
            if (result.data != '') {
                $('.check').html('');
                $('.btnSaveStd').prop('disabled', false);
            }
            else {
                $('.check').html('Not Found');
                $('.btnSaveStd').prop('disabled', true);
            }
        });
    }
    else { $('.check').html(''); $('.btnSaveStd').prop('disabled', false); }
});


//-------------------------------------------------- add Counseling --------------------------------------------------//
$('#formApplyCoun').on('submit', function (e) {
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Add Counseling",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let clg_id = $('#clg_id').val();
            let staff_id = $('#usrId').val();
            let counseling_type_ori = $('#counseling_type_ori').val();
            let counseling_type = $('#counseling_type').val();
            let counselling_reason = $('#counselling_reason').val();
            let remark_coun = $('#remark_coun').val();
            let stud_id = $('#stud_id').val();

            var form = new FormData();
            form.append("clg_id", clg_id);
            form.append("staff_id", staff_id);
            form.append("counseling_type_ori", counseling_type_ori);
            form.append("counseling_type", counseling_type);
            form.append("counselling_reason", counselling_reason);
            form.append("stud_id", stud_id);
            form.append("remark_coun", remark_coun);
            form.append("counselling_status", 'New');
            form.append("requester", 'Staf');
            form.append("recordstatus", 'ADD');

            var settings = {
                "url": host + "api_hep/public/hepCounselling/register",
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
//-------------------------------------------------- end add Counseling --------------------------------------------------//


//-------------------------------------------------- loadData Lecturer --------------------------------------------------//
// edit
function loadData(index) {
    let data = JSON.parse($("#dataList").val());
    let value = data[index].counseling_type;

    $('#pk_id').val(data[index].counselling_id);
    $('#upt_clg_id').val(data[index].camId);
    $('#upt_counselling_reason').val(data[index].counselling_reason).trigger('change');
    $('#upt_stud_id').val(data[index].stud_id);
    $('#upt_counseling_type').val(value);

    if (value == 'On Behalf') { $('.coun_matric').show(); }
    else { $('.coun_matric').hide(); $('.coun_name').val('') }

    $('#update-apply-counselling').modal('show');
}

// view
function loadViewData(index, usrId) {
    let data = JSON.parse($("#dataList").val());
    data = data[index];
    let counId = data.counselling_id;
    let reqUsr = data.staff_id;
    let reqType = data.requester;
    let counStts = data.counselling_status;
    let coun_date = data.counselling_date;
    let counselor = data.emp_name;
    let value = data.counseling_type;
    let dateTime = '';

    // if(reqType == 'Staf'){
    //     empShow(reqUsr, function(){
    //         let dtUser = obj_emp.data;
    //         $('#view_requester').html(dtUser.emp_name);
    //     });
    // }

    let label = '';
    if (counStts == 'New') { label = '<span class="label warning">' + counStts + '</span>'; }
    else if (counStts == 'Accept') { label = '<span class="label success">' + counStts + '</span>'; }
    else if (counStts == 'Reject') { label = '<span class="label danger">' + counStts + '</span>'; }
    else if (counStts == 'Complete') { label = '<span class="label info">' + counStts + '</span>'; }

    if (!(coun_date == '' || coun_date == null)) {
        let today = new Date(coun_date);
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        if (dd < 10) { dd = '0' + dd; }
        if (mm < 10) { mm = '0' + mm; }
        today = dd + '-' + mm + '-' + yyyy;
        dateTime = today + ' / ' + data.timeSlot;
    }
    else { dateTime = '-' }

    if (!(counselor == '' || counselor == null)) { counselor = counselor; }
    else { counselor = '-' }

    if (value == 'On Behalf') {
        $('#view_stud_id').html(data.stud_id);
        $('#view_stud_name').html(data.sti_name);
    }
    else {
        $('#view_stud_id').html('-');
        $('#view_stud_name').html('-');
    }

    $('#view_clg_id').html(data.clg_name);
    $('#view_counselling_reason').html(data.counselling_reason);

    $('#view_type').html(value);
    $('#view_status').html(label);
    $('#view_counselor').html(counselor);
    $('#view_date').html(dateTime);

    // update alert
    if (reqUsr == usrId) {
        var form = new FormData();
        form.append("counselling_id", counId);
        form.append("alert", 0);
        form.append("recordstatus", 'EDT');

        var settings = {
            "url": host + "api_hep/public/hepCounselling/uptAlert",
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
            else {
                // count counseling alert==1
                $('#alertMenuCoun').hide();
                $('#alertApp').hide();
                alertByStaf(usrId, function () {
                    let count = obj_coun.data.length;
                    if (count != 0) {
                        $('#alertMenuCoun').show();
                        $('#alertApp').html(count);
                        $('#alertApp').show();
                    }
                });

                
            }
        });
    }


    $('#mdlView').modal('show');
}
//-------------------------------------------------- end loadData --------------------------------------------------//


//-------------------------------------------------- loadData status --------------------------------------------------//
function loadStatus(index) {
    let data = JSON.parse($("#dataList").val());
    data = data[index];
    // console.log(data);
    let clgId = data.clgId;
    let reqType = data.requester;
    let value = data.counselling_date;
    let id = data.counselling_kaunselor;
    let counStatus = data.counselling_status;
    let counType = data.counseling_type;

    // get name user apply application
    let reqName = '';
    if (reqType == 'Staf') { reqName = data.staff_id + ' - ' + data.applicant; }
    else if (reqType == 'Student') { reqName = data.stud_id + ' - ' + data.sti_name }

    // get day based on date
    let day = '';
    if (value != '') {
        let dateVal = new Date(value);
        let weekday = dateVal.getDay();
        let options = { weekday: 'long' };
        day = new Intl.DateTimeFormat('en-US', options).format(dateVal);
    }

    // get timeslot list based on Counselor & Day
    if (id != '' && day != '') {
        // select timeslot
        $('#coun_timeslot').html('');
        timeByKaunDay(id, day, function () {
            $('#coun_timeslot').append('<option value="">- Choose -</span>')
            $.each(obj_time.data, function (i, item) {
                $('#coun_timeslot').append('<option value="' + item.id_timetable + '">' + item.coun_timeslot + '</span>')
            });
            $('#coun_timeslot').val(data.fk_timeslot);
        });
    }

    // get Counselor list
    listKaunByCam(clgId, function () {
        $('#counselling_kaunselor').html('');
        $('#counselling_kaunselor').append('<option value="">- Choose -</>');
        $.each(obj_kaun.data, function (i, item) {
            $('#counselling_kaunselor').append('<option value="' + item.pk_id + '">' + item.emp_name.toUpperCase() + '</>');
        });
        $('#counselling_kaunselor').val(id);

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:'
        });
    });

    // check status counseling
    if (counStatus == 'Reject') { $('.formUptStts').attr('disabled', true); }
    else { $('.formUptStts').attr('disabled', false); }

    let label = '';
    if (counType == 'Individual') { label = '<span class="label deep-purple">' + counType + '</span>'; $('.sttsHide').hide() }
    if (counType == 'On Behalf') { label = '<span class="label deep-orange">' + counType + '</span>'; $('.sttsHide').show() }
    if (counType == 'Programme') { label = '<span class="label grey">' + counType + '</span>'; $('.sttsHide').hide() }
    $('#stts_clg_id').html(data.clg_name);
    $('#stts_counseling_type_ori').html(data.det_FK_type);
    $('#stts_stud_id').html(data.stud_id);
    $('#stts_stud_name').html(data.sti_name);
    $('#stts_stud_contact').html(data.sti_contactno_mobile);
    $('#stts_type').html(label);
    $('#stts_requester').html(reqName);
    $('#coun_id').val(data.counselling_id);
    $('#counselling_status').val(counStatus);
    $('#counselling_date').val(data.counselling_date);

    $('#updateStatus').modal('show');
}
//-------------------------------------------------- end loadData status --------------------------------------------------//


//-------------------------------------------------- update Counseling --------------------------------------------------//
$('#formUptCounseling').on('submit', function (e) {
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Update Counseling",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let counselling_id = $('#pk_id').val();
            let clg_id = $('#upt_clg_id').val();
            let counseling_type = $('#upt_counseling_type').val();
            let counselling_reason = $('#upt_counselling_reason').val();
            let stud_id = $('#upt_stud_id').val();

            var form = new FormData();
            form.append("counselling_id", counselling_id);
            form.append("clg_id", clg_id);
            form.append("counseling_type", counseling_type);
            form.append("counselling_reason", counselling_reason);
            form.append("stud_id", stud_id);
            form.append("recordstatus", 'EDT');

            var settings = {
                "url": host + "api_hep/public/hepCounselling/update",
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
//-------------------------------------------------- end update Counseling --------------------------------------------------//


//-------------------------------------------------- delete Counseling --------------------------------------------------//
function delData(id) {
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("counselling_id", id);

    swal({
        title: "Remove Counseling",
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
            "url": host + "api_hep/public/hepCounselling/delete",
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
//-------------------------------------------------- end delete Counseling --------------------------------------------------//


//-------------------------------------------------- update Status by Counselor --------------------------------------------------//
$('#formUptStatus').on('submit', function (e) {
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Update Status",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let counselling_id = $('#coun_id').val();
            let counselling_status = $('#counselling_status').val();
            let counselling_kaunselor = $('#counselling_kaunselor').val();
            let counselling_date = $('#counselling_date').val();
            let coun_timeslot = $('#coun_timeslot').val();

            if (counselling_status == 'Reject') { coun_timeslot = '' }

            var form = new FormData();
            form.append("counselling_id", counselling_id);
            form.append("counselling_status", counselling_status);
            form.append("counselling_kaunselor", counselling_kaunselor);
            form.append("counselling_date", counselling_date);
            form.append("coun_timeslot", coun_timeslot);
            form.append("alert", 1);
            form.append("recordstatus", 'EDT');

            var settings = {
                "url": host + "api_hep/public/hepCounselling/uptStatus",
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
//-------------------------------------------------- end update Status Counselor --------------------------------------------------//


//-------------------------------------------------- function change --------------------------------------------------//
// Date
$('#counselling_date').change(function () {
    let id = $('#counselling_kaunselor').val();
    let value = $(this).val();
    let dateVal = new Date(value);
    let weekday = dateVal.getDay();
    let options = { weekday: 'long' };
    let day = new Intl.DateTimeFormat('en-US', options).format(dateVal);

    if (id != '') {
        // select timeslot
        $('#coun_timeslot').html('');
        timeByKaunDay(id, day, function () {

            // console.log(obj_time.data.length);
            $('#coun_timeslot').append('<option value="">- Choose -</span>')
            $('#noTimeAdded').show();

            $.each(obj_time.data, function (i, item) {
                // console.log(item.length);
                $('#noTimeAdded').hide();

                $('#coun_timeslot').append('<option value="' + item.id_timetable + '">' + item.coun_timeslot + '</span>')
                // $( `  <small id="noTimeAdded">No Timetable Added</small>` ).insertAfter( "#coun_timeslot" );

            });
        });
    }
    else { $('#counselling_date').val(''); alert('Choose Counselor') }
});

// Status
$('#counselling_status').change(function () {
    let value = $(this).val();

    if (value == 'Reject' || value == 'Complete') { $('.formUptStts').attr('disabled', true); }
    else { $('.formUptStts').attr('disabled', false); }
});

// Type
$('.coun_type').change(function () {
    let value = $(this).val();

    if (value == 'On Behalf') { $('.coun_matric').show(); }
    else { $('.coun_matric').hide(); $('.coun_name').val('') }
});
//-------------------------------------------------- end function change --------------------------------------------------//


//-------------------------------------------------- create table for staf --------------------------------------------------//
function tblStaff(data, usrId) {
    var colums = [
        { "name": "bil", "title": "No." },
        { "name": "clg_id", "title": "Campus" },
        { "name": "counseling_type", "title": "Session" },
        { "name": "coun_counselor", "title": "Counselor", "breakpoints": "md sm xs" },
        { "name": "coun_dateTime", "title": "Date/Time", "breakpoints": "md sm xs" },
        { "name": "counselling_reason", "title": "Issue", "breakpoints": "md sm xs" },
        { "name": "counselling_status", "title": "Status", "breakpoints": "md sm xs" },
        { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
    ];

    let bil = 1;
    let convertList = JSON.stringify(data);
    $("#dataList").val(convertList);
    var list = [];

    $.each(data, function (i, field) {
        let caunStts = field.counselling_status;
        let counselor = field.emp_name;
        let coun_date = field.counselling_date;
        let counType = field.counseling_type;
        let viewBtn = ''; let viewStts = ''; let label = ''; let alert = '';

        if (!(counselor == '' || counselor == null)) { counselor = counselor; }
        else { counselor = '' }

        if (caunStts == 'New') {
            viewStts = '<span class="label warning">' + caunStts + '</span>';
            viewBtn = '<button class="btn btn-icon success" title="Update" onclick="loadData(\'' + i + '\')"><i class="ion-android-create"></i></button> ' +
                '<button class="btn btn-icon danger" title="Delete" onclick="delData(\'' + field.counselling_id + '\')"><i class="ion-trash-a"></i>'
        }
        else if (caunStts == 'Accept') {
            viewStts = '<span class="label success">' + caunStts + '</span>';
            viewBtn = '<button class="btn btn-icon accent" title="View" onclick="loadViewData(\'' + i + '\',\'' + usrId + '\')" ><i class="ion-eye"></i></button>'
        }
        else if (caunStts == 'Reject') {
            viewStts = '<span class="label danger">' + caunStts + '</span>';
            viewBtn = '<button class="btn btn-icon accent" title="View" onclick="loadViewData(\'' + i + '\',\'' + usrId + '\')" ><i class="ion-eye"></i></button>'
        }
        else if (caunStts == 'Complete') {
            viewStts = '<span class="label info">' + caunStts + '</span>';
            viewBtn = '<button class="btn btn-icon accent" title="View" onclick="loadViewData(\'' + i + '\',\'' + usrId + '\')" ><i class="ion-eye"></i></button>'
        }

        if (counType == 'Individual') { label = 'deep-purple' }
        else if (counType == 'On Behalf') { label = 'deep-orange' }
        else if (counType == 'Programme') { label = 'grey' }

        if (field.alert != 1) { alert = 'hidden' }
        else { alert = '' }

        list.push({
            bil: bil++ + ' <span class="label label-xs danger" ' + alert + '></span>', clg_id: '<span class="text-uppercase">' + field.clg_name + '</span>', counseling_type: '<span class="label ' + label + '">' + field.counseling_type + '</span>',
            counselling_reason: '<span class="text-uppercase">' + field.counselling_reason + '</span>', coun_counselor: '<span class="text-uppercase">' + counselor + '</span>',
            coun_dateTime: formatDate(coun_date) + ' - ' + field.timeSlot, counselling_status: viewStts, upt_btn: viewBtn
        });
    });

    $("#counselingList").html('');
    $("#counselingList").footable({
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
//-------------------------------------------------- end create table for staf --------------------------------------------------//


//-------------------------------------------------- create table for kaunselor --------------------------------------------------//
function tblCounByCounselor(data, usrId) {


    setTimeout(() => {
        var colums = [
            { "name": "bil", "title": "No." },
            { "name": "clg_id", "title": "Campus" },
            { "name": "applicant", "title": "Applicant" },
            { "name": "counseling_type", "title": "Session", "breakpoints": "md sm xs" },
            { "name": "coun_counselor", "title": "Counselor", "breakpoints": "md sm xs" },
            { "name": "coun_dateTime", "title": "Date/Time", "breakpoints": "md sm xs" },
            { "name": "counselling_reason", "title": "Issue", "breakpoints": "md sm xs" },
            { "name": "remark_coun", "title": "Remarks", "breakpoints": "md sm xs" },
            { "name": "counselling_status", "title": "Status", "breakpoints": "md sm xs" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];

        let bil = 1;
        let convertList = JSON.stringify(data);
        $("#dataList").val(convertList);
        var list = [];

        $.each(data, function (i, field) {
            // det_FK_type
            let caunStts = field.counselling_status;
            let counselor = field.kaunName;
            let coun_date = field.counselling_date;
            let requester = field.requester;
            let counType = field.counseling_type;
            let viewBtn = ''; let viewStts = ''; let counKaun = ''; let applicant = ''; label = '';

            if (!(field.det_FK_type == '' || field.det_FK_type == null)) { field.det_FK_type = field.det_FK_type }
            else { field.det_FK_type = '' }

            if (!(field.remark_coun == '' || field.remark_coun == null)) { field.remark_coun = field.remark_coun }
            else { field.remark_coun = '' }

            if (!(field.timeSlot == '' || field.timeSlot == null)) { field.timeSlot = field.timeSlot }
            else { field.timeSlot = '' }

            if (!(counselor == '' || counselor == null)) { counKaun = counselor }
            else { counKaun = '' }

            if (caunStts == 'New' || caunStts == 'Accept') {
                viewBtn = '<button class="btn btn-icon success" title="Update" onclick="loadStatus(\'' + i + '\')"><i class="ion-android-create"></i></button> '
            }
            else { viewBtn = '<button class="btn btn-icon accent" title="View" onclick="loadViewData(\'' + i + '\',\'' + usrId + '\')" ><i class="ion-eye"></i></button>' }

            if (caunStts == 'New') { viewStts = '<span class="label warning">' + caunStts + '</span>'; }
            else if (caunStts == 'Accept') { viewStts = '<span class="label success">' + caunStts + '</span>'; }
            else if (caunStts == 'Reject') { viewStts = '<span class="label danger">' + caunStts + '</span>'; }
            else if (caunStts == 'Complete') { viewStts = '<span class="label info">' + caunStts + '</span>'; }

            if (requester == 'Staf') { applicant = field.applicant; }
            else if (requester == 'Student') { applicant = field.sti_name }

            if (counType == 'Individual') { label = 'deep-purple' }
            if (counType == 'On Behalf') { label = 'deep-orange' }
            if (counType == 'Programme') { label = 'grey' }

            list.push({
                bil: bil++,
                clg_id: '<span class="text-uppercase">' + field.clg_name + '</span>',
                applicant: '<span class="text-uppercase">' + applicant + '</span>',
                counseling_type: '<span class="label ' + label + '">' + counType + '</span>',
                counselling_reason: '<span class="text-uppercase">' + field.det_FK_type + '</span>',
                remark_coun: '<span class="text-uppercase">' + field.remark_coun + '</span>',

                coun_counselor: '<span class="text-uppercase">' + counKaun + '</span>',
                coun_dateTime: formatDate(coun_date) + ' - ' + field.timeSlot,
                counselling_status: viewStts, upt_btn: viewBtn
            });
        });

        $("#counselingList").html('');
        $("#counselingList").footable({
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
    }, Math.random() * 1000);

}
//-------------------------------------------------- create table for kaunselor --------------------------------------------------//



function listCounseling(returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepCounselling/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_counseling = response;
        returnValue();
    });
}

function showKaun(id, returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepcaunkaunselor/findKaun/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_kaun = response;
        returnValue();
    });
}

function slctGender(returnValue) {
    var settings = {
        "url": host + "api_public_access/public/genderList",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_gender = response;
        returnValue();
    });
}

function slctRace(returnValue) {
    var settings = {
        "url": host + "api_public_access/public/raceList",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_race = response;
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

    $.ajax(settings).done(function (response) {
        obj_college = response;
        returnValue();
    });
}

function listKaunByCam(id, returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepcaunkaunselor/listByCam/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_kaun = response;
        returnValue();
    });
}

function timeByKaunDay(id, day, returnValue) {
    var form = new FormData();
    form.append("fk_kaunselor", id);
    form.append("counseling_day", day);

    var settings = {
        "url": host + "api_hep/public/hepcauntimetable/listByKaunDay",
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
        obj_time = JSON.parse(response);
        returnValue();
    });
}

function listByStaf(id, returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepCounselling/listByStaf/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_coun = response;
        returnValue();
    });
}


function reportingDisiplin(returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepCounselling/generatePDF",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_coun = response;
        returnValue();
    });
}

reportingDisiplin(function () {

    var colums = [
        { name: "bil", title: "No.", "style": "text-align:center;" },
        { name: "reason", title: "Issue", "style": "text-align:center;" },
        { name: "total_reason", title: "Total Session", "style": "text-align:center;" },

    ];

    let bil = 1;
    let convertList = JSON.stringify(obj_coun);
    $("#dataList").val(convertList);
    var list = [];
    //   console.log(obj_coun.data);

    $.each(obj_coun.data, function (i, field) {

        if (i == '' || i == null) {

            i = 'Lain-lain';

        }
        else { i = i }


        list.push({
            bil: bil++,
            reason: i,
            total_reason: field,

        });


    });

    $("#report_disipline").html('');
    $("#report_disipline").footable({
        "columns": colums,
        "rows": list,
        "paging": {
            "enabled": true,
            "size": 10,
            "countFormat": "Showing {PF} to {PL} of {TR} data"
        },
        //   "filtering": {
        //       "enabled": true,
        //       "placeholder": "Search...",
        //       "dropdownTitle": "Search for:"
        //   }
    });
});