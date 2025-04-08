let cal_id = window.sessionStorage.cal_id;

$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let cal_id = window.sessionStorage.cal_id;

    $("#calAcaDetList").html('');

    acaCalDetails(cal_id, function(){
        // select Academic Session
        cur_year(function(){
            $("#upt_cur_year").append('<option value="">- Choose -</option>');
            $.each(obj_curYear.data,function(i,field){
                let curYear = field.cur_year;
                $("#upt_cur_year").append('<option value="'+curYear.replace('/','-')+'" >'+field.cur_year+'</option>');
            });
            $('#upt_cur_year').val(data.cur_year.replace('/','-'));

            let currYear = data.cur_year.replace('/','-');
            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmCuryear/opt_intake/"+currYear,
                "method": "GET",
                "timeout": 0,
            };
              
            $.ajax(settings).done(function (response) {
                obj_cohort = response;
        
                $.each(obj_cohort.data,function(i,field){
                    $("#cal_intake_upt").append('<option value="'+field.cur_intake+'" data-semester="'+field.cur_semester+'">'+field.cur_intake+'</option>');
                });
                $('#cal_intake_upt').val(data.cal_intake);
            });
        });

        // select academic field
        acaField(function(){
            $('#upt_cal_category').append('<option value="">- Choose -</option>');
            $.each(obj_acaField.data, function (i, item) {
                $('#upt_cal_category').append('<option value="'+item.aca_area_name+'">'+item.aca_area_name+'</option>');
            });
            $('#upt_cal_category').val(data.cal_category);
        });

        // select semester type
        semType(function(){
            $('#upt_cal_type_sem').append('<option value="">- Choose -</option>');
            $.each(obj_semType.data, function (i, item){
                $('#upt_cal_type_sem').append('<option value="'+item.sem_type_name+'">'+item.sem_type_name+'</option>');
            });
            $('#upt_cal_type_sem').val(data.cal_type_sem);
        });

        $('#cal_id').val(data.cal_id);
        $('#curYear').html(data.cur_year);
        $('#calIntake').html(data.cal_intake);
        $('#calCohort').html(data.cal_cohort);
        $('#calCategory').html(data.cal_category.toUpperCase());
        $('#calTypeSem').html(data.cal_type_sem.toUpperCase());

        $('#upt_cal_id').val(data.cal_id);
        $('#upt_cal_cohort').val(data.cal_cohort);
    });

    // Details list
    detailsList(cal_id, function(){
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
                "bil":bil++,"cld_activity":item.cld_activity,"cld_startdate":formatDate(item.cld_startdate),"cld_enddate":formatDate(item.cld_enddate),"cld_totdow":item.cld_totdow,"cld_status":item.cld_status,
                "upt_btn":'<button class="btn btn-icon success" title="Update" data-backdrop="static" data-keyboard="false" onclick="loadDataDetail(\'' + i + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button> '+
                            '<button class="btn btn-icon danger" title="Remove" onclick="del_rekod(\''+item.cld_id+'\')"><i class="ion-trash-b"></i></button>'
            });
        });

        $("#calAcaDetList").footable({
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

    // select status
    statusDet(function(){
        $('#cld_status').append('<option value="">- Choose -</option>');
        $('#upt_cld_status').append('<option value="">- Choose -</option>');
        $.each(obj_status.data, function (i, item){
            $('#cld_status').append('<option value="'+item.status_name+'">'+item.status_name+'</option>');
            $('#upt_cld_status').append('<option value="'+item.status_name+'">'+item.status_name+'</option>');
        });
    });
});
var confirmed = false;

function formatDate(date){
    let newDate = '';

    if(date){
        let arrayDate = date.split("-");
        newDate = arrayDate[2]+'/'+arrayDate[1]+'/'+arrayDate[0];
    }
    else{ newDate = ''; }
    return newDate;
}

// btn Back to admin page
$('#btnBack').click(function(){
    window.location.replace('adminPage.html');
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
            let upt_cal_id = $("#upt_cal_id").val();
            let upt_cur_year = $("#upt_cur_year").val().replace('/','-');
            let cal_intake = $('#cal_intake_upt').val();
            let upt_cal_cohort = $("#upt_cal_cohort").val();
            let upt_cal_category = $("#upt_cal_category").val();
            let upt_cal_semno = $("#upt_cal_semno").val();
            let upt_cal_type_sem = $("#upt_cal_type_sem").val();

            var form = new FormData();
            form.append("cal_id", upt_cal_id);
            form.append("cur_year", upt_cur_year);
            form.append("cal_intake", cal_intake);
            form.append("cal_cohort", upt_cal_cohort);
            form.append("cal_category", upt_cal_category);
            form.append("cal_semno", upt_cal_semno);
            form.append("cal_type_sem", upt_cal_type_sem);
            form.append("recordstatus", "EDT");
    
            var settings = {
                "url": host+"api_tetapan_picoms/public/calendarUpdate",
                "method": "POST",
                "timeout": 0,
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
});
//-------------------------------------------------- end update academic calendar --------------------------------------------------//


// delete academic calendar
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
            "url": host+"api_tetapan_picoms/public/calendarDelete",
            "method": "POST",
            "timeout": 0,
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
            window.location.replace('adminPage.html');
        });
    });
});


//-------------------------------------------------- add details academic calendar --------------------------------------------------//
var RegisterModelDetail = function (){
    var self = this;
    self.cld_activity = ko.observable("").extend({
        required: true,
    });

    self.cld_startdate = ko.observable("").extend({
        required: true
    });

    self.cld_enddate = ko.observable("").extend({
        required: true
    });

    self.cld_status = ko.observable("").extend({
        required: true
    });

    self.regDetCalendar = function (){
        let jumlah = $('#jumlah').val();

        let cal_id = $('#cal_id').val();
        var error = ko.validation.group(self);

        if (error().length > 0) {
            error.showAllMessages();
            return;
        }

        var form = new FormData();
        form.append("cal_id", cal_id);
        form.append("cld_activity", self.cld_activity());
        form.append("cld_startdate", self.cld_startdate());
        form.append("cld_enddate", self.cld_enddate());
        form.append("cld_status", self.cld_status());
        form.append("cld_totdow", jumlah);
        form.append("recordstatus", 'ADD');

        swal({
            title: "Add Academic Calendar Details",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            var settings = {
                "url": host+"api_tetapan_picoms/public/addCalendardet",
                "method": "POST",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form
            };

            $.ajax(settings).done(function (response) {
                console.log(response);
                result = JSON.parse(response);
                if (!result.success) {
                    Swal(result.message, result.data, "error");
                    return;
                }
                window.location.reload();
            });
        });
    };
}
const RegisterdetProgram = document.querySelector("#details");
ko.applyBindings(new RegisterModelDetail(), RegisterdetProgram);
//-------------------------------------------------- end add details academic calendar --------------------------------------------------//


// detail data
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


//-------------------------------------------------- update details academic calendar --------------------------------------------------//
$("#formUptDetAcaCalendar").on('submit', function (e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Academic Calendar Details",
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
                "url": host+"api_tetapan_picoms/public/calendardetUpdate",
                "method": "POST",
                "timeout": 0,
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
});
//-------------------------------------------------- end update details academic calendar --------------------------------------------------//


// delete details academic calendar
function del_rekod(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("cld_id", id);

    swal({
        title: "Remove Academic Calendar Details",
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


function acaCalDetails(id, returnValue){
    var settings = {
        "url": host + "api_tetapan_picoms/public/misPrmCalendar/show/"+id,
        "method": "GET",
        "timeout": 0,
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


function selectmonth(){
    $('#upt_cal_intake_month').append('<option value="">- Choose Month -</option>');
    for(i=1;i<13;i++){
        date = new Date('2022-'+i+'-01');  // 2009-11-10
        month = date.toLocaleString('default', { month: 'short' });
        $('#upt_cal_intake_month').append('<option value="'+month.toUpperCase()+'">'+month.toUpperCase()+'</option>');
    }
}

function cur_year(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmCuryear/opt_curYear",
        "method": "GET",
        "timeout": 0,
      };
      
      $.ajax(settings).done(function (response) {
        obj_curYear = response;
        returnValue();
      });    
}

function acaField(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/acaareaList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_acaField = response;
        returnValue();
    });
}

function semType(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/semtypeList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_semType = response;
        returnValue();
    });
}


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

function statusDet(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/statusList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_status = response;
        returnValue();
    });
}

// onchange select Academic Session
$("#upt_cur_year").change(function(){
    $("#cal_intake_upt").html('<option value="">- Choose -</option>');
    currentYear = $("#upt_cur_year").val();
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmCuryear/opt_intake/"+currentYear,
        "method": "GET",
        "timeout": 0,
      };
      
      $.ajax(settings).done(function (response) {
        obj_cohort = response;

        $.each(obj_cohort.data,function(i,field){
            $("#cal_intake_upt").append('<option value="'+field.cur_intake+'" data-semester="'+field.cur_semester+'">'+field.cur_intake+'</option>');
        });
      });    
});

// onchange select Intake
$("#cal_intake_upt").change(function(){
    let intake = $(this).find(':selected').data('semester');
    $('#upt_cal_cohort').val(intake);
});
