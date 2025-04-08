$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let cal_id = window.sessionStorage.cal_id;

    // select academic field
    acaField(function(){
        $('#upt_cal_category').append('<option value="">- Choose -</option>');
        $.each(obj_acaField.data, function (i, item) {
            $('#upt_cal_category').append('<option value="'+item.pk_id+'">'+item.category+'</option>');
        });
    });

    // select Status
    statusSem(function(){
        $('#upt_cal_status').append('<option value="">- Choose -</option>');
        $.each(obj_sttSem.data, function (i, item){
            $('#upt_cal_status').append('<option value="'+item.status_sem_name+'">'+item.status_sem_name+'</option>');
        });
    });

    acaCalDetails(cal_id, function(){
        $('#cal_id').val(data.cal_id);
        $('#curYear').html(data.cur_year);
        $('#cal_status').html(data.cal_status);
        $('#calCohort').html(data.cal_cohort);
        $('#calCategory').html(data.category);

        $('#upt_cal_id').val(data.cal_id);
        $('#upt_cur_year').val(data.cur_year);
        $('#upt_cal_status').val(data.cal_status).trigger('change');
        $('#upt_cal_cohort').val(data.cal_cohort);
        $('#upt_cal_category').val(data.cal_category);
    });

    // Details list
    detailsList(cal_id, function(){

        // capaianSetting = load_capaian();
        load_capaian();
        capaianSetting = window.capaianData;
        // console.log(capaianSetting);
        let addSetting = capaianSetting[0];
        let uptSetting = capaianSetting[1];
        let delSetting = capaianSetting[2];

        if (addSetting == 0){
            SettingAddDisabled = 'disabled';
        }
        else{
            SettingAddDisabled = ''; 
        }
    
        if (uptSetting == 0){
            SettingUpdateDisabled = 'disabled';
        }
        else{
            SettingUpdateDisabled = ''; 
        }
    
    
        if (delSetting == 0){
            SettingDelDisabled = 'disabled';
        }
        else{
            SettingDelDisabled = ''; 
        }
    
        var columns = [
            { "name": "bil", "title": "No." },
            { "name": "cld_activity", "title": "Items" },
            { "name": "cld_startdate", "title": "Start Date" },
            { "name": "cld_enddate", "title": "End Date" },
            { "name": "cld_totdow", "title": "Duration", "breakpoints": "md sm xs"  },
            { "name": "cld_status", "title": "Status", "breakpoints": "md sm xs"  },
            { "name": "upt_btn", "title": "Action",'class':"text-center", "breakpoints": "md sm xs" }
        ];
        
        var list = [];
        let bil = 1;
        let convertDetList = JSON.stringify(obj_details);
        $("#dataDetailList").val(convertDetList);

        $.each(obj_details, function(i,item){
            list.push({
                "bil":bil++, "cld_activity": '<span class="text-uppercase">'+item.cld_activity+'</span>', "cld_startdate": formatDate(item.cld_startdate), 
                "cld_enddate": formatDate(item.cld_enddate), "cld_totdow": item.cld_totdow, "cld_status": '<span class="text-uppercase">'+item.cld_status+'</span>',
                "upt_btn":'<button class="btn btn-icon success" '+SettingUpdateDisabled+' title="Update" data-backdrop="static" data-keyboard="false" onclick="loadDataDetail(\'' + i + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button> '+
                            '<button class="btn btn-icon danger" '+SettingDelDisabled+' title="Remove" onclick="del_rekod(\''+item.cld_id+'\')"><i class="ion-trash-b"></i></button>'
            });
        });

        $("#calAcaDetList").html('');
        $("#calAcaDetList").footable({
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
    });

    // select status
    statusList(function(){
        $('#cld_status').append('<option value="">- Choose -</option>');
        $('#upt_cld_status').append('<option value="">- Choose -</option>');
        $.each(obj_status.data, function (i, item){
            $('#cld_status').append('<option value="'+item.status_name+'">'+item.status_name+'</option>');
            $('#upt_cld_status').append('<option value="'+item.status_name+'">'+item.status_name+'</option>');
        });
    });
});
var confirmed = false;


// btn Back to admin page
$('#btnBack').click(function(){
    window.sessionStorage.removeItem('cal_id');
    window.location.replace('ttpn_aca_calendar.html');
});


//-------------------------------------------------- update academic calendar --------------------------------------------------//
$("#formUptAcaCalendar").on('submit', function (e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Academic Calendar",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let ca_intake_month = $('#ca_intake_month').val();
            let ca_intake_year = $('#ca_intake_year').val();

            let upt_cal_id = $("#upt_cal_id").val();
            let upt_cur_year = $("#upt_cur_year").val();
            let cal_status = $("#upt_cal_status").val();
            let upt_cal_cohort = $("#upt_cal_cohort").val();
            let upt_cal_category = $("#upt_cal_category").val();

            var form = new FormData();
            form.append("cal_id", upt_cal_id);
            form.append("cur_year", upt_cur_year);
            form.append("cal_status", cal_status);
            form.append("cal_cohort", upt_cal_cohort);
            form.append("cal_category", upt_cal_category);
            form.append("recordstatus", "EDT");
    
            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmCalendar/update",
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
//-------------------------------------------------- end update academic calendar --------------------------------------------------//


//-------------------------------------------------- delete academic calendar --------------------------------------------------//
$('#btnDelete').click(function(){
    let id = $('#cal_id').val();
    
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("cal_id", id);

    swal({
        title: "Remove Academic Calendar",
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
            "url": host+"api_tetapan_picoms/public/misPrmCalendar/delete",
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
            window.location.replace('ttpn_aca_calendar.html');
        });
    });
});
//-------------------------------------------------- delete academic calendar --------------------------------------------------//


//-------------------------------------------------- add item --------------------------------------------------//
$('#regDetCalendar').on('submit', function(e){
    let calId = $('#cal_id').val();
    let cld_activity = $('#cld_activity').val();
    let cld_startdate = $('#cld_startdate').val();
    let cld_enddate = $('#cld_enddate').val();
    let cld_status = $('#cld_status').val();
    let jumlah = $('#jumlah').val();

    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Item",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            var form = new FormData();
            form.append("cal_id", calId);
            form.append("cld_activity", cld_activity);
            form.append("cld_startdate", cld_startdate);
            form.append("cld_enddate", cld_enddate);
            form.append("cld_status", cld_status);
            form.append("cld_totdow", jumlah);
            form.append("recordstatus", 'ADD');

            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmCalDet/register",
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
//-------------------------------------------------- end add item --------------------------------------------------//


//-------------------------------------------------- update item --------------------------------------------------//
$("#formUptDetAcaCalendar").on('submit', function (e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Item",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let cld_id = $("#upt_cld_id").val();
            let cld_activity = $("#upt_cld_activity").val();
            let cld_startdate = $("#upt_cld_startdate").val();
            let cld_enddate = $("#upt_cld_enddate").val();
            let cld_totdow = $("#upt_jumlah").val();
            let cld_status = $("#upt_cld_status").val();

            var form = new FormData();
            form.append("cld_id", cld_id);
            form.append("cld_activity", cld_activity);
            form.append("cld_startdate", cld_startdate);
            form.append("cld_enddate", cld_enddate);
            form.append("cld_totdow", cld_totdow);
            form.append("cld_status", cld_status);
            form.append("recordstatus", "EDT");
    
            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmCalDet/update",
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
//-------------------------------------------------- end update item --------------------------------------------------//


//-------------------------------------------------- delete item --------------------------------------------------//
function del_rekod(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("cld_id", id);

    swal({
        title: "Remove Item",
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
            "url": host+"api_tetapan_picoms/public/calendardetDelete",
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
            console.log(response)
            result = JSON.parse(response);
            if (!result.success) {
                Swal(result.message, result.data, "error");
                return;
            }
            window.location.reload();
        });
    });
}
//-------------------------------------------------- delete item --------------------------------------------------//


//-------------------------------------------------- end date & start date validation --------------------------------------------------//
$("#cld_enddate").change(function(){
    let cld_startdate = new Date($("#cld_startdate").val());
    let cld_enddate = new Date($("#cld_enddate").val());
    
    if ((cld_enddate - cld_startdate) < 0){
        alert('Invalid Date Range');
        $("#cld_enddate").val('');
        $("#jumlah").val('');
    }
});

$("#cld_startdate").change(function(){
    let cld_startdate = new Date($("#cld_startdate").val());
    let cld_enddate = new Date($("#cld_enddate").val());
    
    if ((cld_startdate - cld_enddate ) > 0){
        alert('Invalid Date Range');
        $("#cld_startdate").val('');
        $("#jumlah").val('');
    }
});

$("#upt_cld_enddate").change(function(){
    let upt_cld_startdate = new Date($("#upt_cld_startdate").val());
    let upt_cld_enddate = new Date($("#upt_cld_enddate").val());
    
    if ((upt_cld_enddate - upt_cld_startdate) < 0){
        alert('Invalid Date Range');
        $("#upt_cld_enddate").val('');
        $("#upt_jumlah").val('');
    }
});

$("#upt_cld_startdate").change(function(){
    let upt_cld_startdate = new Date($("#upt_cld_startdate").val());
    let upt_cld_enddate = new Date($("#upt_cld_enddate").val());
    
    if ((upt_cld_startdate - upt_cld_enddate ) > 0){
        alert('Invalid Date Range');
        $("#upt_cld_startdate").val('');
        $("#upt_jumlah").val('');
    }
});
//-------------------------------------------------- end date & start date validation --------------------------------------------------//


// detail items
function loadDataDetail(indexs){
    let data = JSON.parse($("#dataDetailList").val());
    
    $('#upt_cld_id').val(data[indexs].cld_id);
    $('#upt_cld_activity').val(data[indexs].cld_activity);
    $('#upt_cld_startdate').val(data[indexs].cld_startdate);
    $('#upt_cld_enddate').val(data[indexs].cld_enddate);
    $('#upt_cld_status').val(data[indexs].cld_status);
    $('#upt_jumlah').val(data[indexs].cld_totdow);

    $("#updatePerincian").modal("show");
}

function acaCalDetails(id, returnValue){
    var settings = {
        "url": host + "api_tetapan_picoms/public/misPrmCalendar/show/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        data = response.data;
        returnValue();
    });
}

function detailsList(id, returnValue){
    var form = new FormData();
    form.append("cal_id", id);

    var settings = {
        "url": host+"api_tetapan_picoms/public/calendardet",
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
        let result = JSON.parse(response);
        obj_details = result.data;
        returnValue();
    });
}

function acaField(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/acaCalCategory/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_acaField = response;
        returnValue();
    });
}


// function kire jumlah hari
function edValueKeyPress(today,id_name,ext){
    let cur_sdate = $('#'+ext+'cld_startdate').val();
    let cur_edate = $('#'+ext+'cld_enddate').val();
    let value = today.value;
    let final_start = '';
    let final_end = '';
    let start = '';
    let end = '';
    
    if(id_name == 'cld_startdate'){
        start = $('#'+ext+'cld_startdate').val();
        end = value;
    }
    else{
        start = value;
        end = $('#'+ext+'cld_enddate').val();
    }

    if(start == ''){
        if(cur_sdate != ''){
            final_start = cur_sdate;
        }
        else{ final_start = ''; }
    }
    else{ final_start = start; }

    if(end == ''){
        if(cur_edate != ''){
            final_end = cur_edate;
        }
        else{ final_end = ''; }
    }
    else{ final_end = end; }

    const diffDays = (date, otherDate) => Math.ceil(Math.abs(date - otherDate) / (1000 * 60 * 60 * 24));
    count = (diffDays(new Date(final_start), new Date(final_end))) + 1;

    if(final_start != '' && final_end != ''){
        $('#'+ext+'jumlah').val(count);
    }
    else{ $('#'+ext+'jumlah').val(0); }
}