$(function(){
    $.ajaxSetup ({
        cache: false
    });
    
    // campus list
    var settings = {
        "url": host+"api_tetapan_picoms/public/collegeList",
        "method": "GET",
        "timeout": 0,
    };
      
    $.ajax(settings).done(function (response) {
        // console.log(response);
        $('#clg_id').append($('<option>', { 
            value: "",
            text : "-Choose-"
        }));

        $.each(response.data, function (i, item) {
            $('#clg_id').append($('<option>', { 
                value: item.clg_id,
                text : item.clg_name 
            }));
        });

        $('#clg_id_upt').append($('<option>', { 
            value: "",
            text : "-Choose-"
        }));

        $.each(response.data, function (i, item) {
            $('#clg_id_upt').append($('<option>', { 
                value: item.clg_id,
                text : item.clg_name 
            }));
        });
    });

    // faculty list
    var settings = {
        "url": host+"api_tetapan_picoms/public/facultyList",
        "method": "GET",
        "timeout": 0,
    };
      
    $.ajax(settings).done(function (response) {
        // console.log(response);
        $('#fac_id').append($('<option>', { 
            value: "",
            text : "-Choose-"
        }));

        $.each(response.data, function (i, item) {
            $('#fac_id').append($('<option>', { 
                value: item.fac_id,
                text : item.fac_name 
            }));
        });

        $('#fac_id_upt').append($('<option>', { 
            value: "",
            text : "-Choose-"
        }));

        $.each(response.data, function (i, item) {
            $('#fac_id_upt').append($('<option>', { 
                value: item.fac_id,
                text : item.fac_name 
            }));
        });
    });

    // programme list
    var settings = {
        "url": host+"api_tetapan_picoms/public/programmeList",
        "method": "GET",
        "timeout": 0,
    };
      
    $.ajax(settings).done(function (response) {
        // console.log(response);
        $('#pgm_id').append($('<option>', { 
            value: "",
            text : "-Choose-"
        }));

        $.each(response.data, function (i, item) {
            $('#pgm_id').append($('<option>', { 
                value: item.pgm_id,
                text : item.pgm_name 
            }));
        });

        $('#pgm_id_upt').append($('<option>', { 
            value: "",
            text : "-Choose-"
        }));

        $.each(response.data, function (i, item) {
            $('#pgm_id_upt').append($('<option>', { 
                value: item.pgm_id,
                text : item.pgm_name 
            }));
        });
    });

    // course list
    var settings = {
        "url": host+"api_tetapan_picoms/public/courseList",
        "method": "GET",
        "timeout": 0,
    };
      
    $.ajax(settings).done(function (response) {
        // console.log(response);
        $('#crs_code').append($('<option>', { 
            value: "",
            text : "-Choose-"
        }));

        $.each(response.data, function (i, item) {
            $('#crs_code').append($('<option>', { 
                value: item.crs_code,
                text : item.crs_name 
            }));
        });

        $('#crs_code_upt').append($('<option>', { 
            value: "",
            text : "-Choose-"
        }));

        $.each(response.data, function (i, item) {
            $('#crs_code_upt').append($('<option>', { 
                value: item.crs_code,
                text : item.crs_name 
            }));
        });
    });

    //---------- select session ----------//
    var settings = {
        "url": host+"api_tetapan_picoms/public/curyear/selectCurYear",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        // console.log(response);
        //LIST OPTION
        $('#cur_year').append($('<option>', { 
            value: "",
            text : "-Choose-" 
        }));
        $.each(response.data, function (i, item) {
            $('#cur_year').append($('<option>', { 
                value: item.cur_year,
                text : item.cur_year 
            }));
        });

        // LIST OPTION UPDATE
         $('#cur_year_upt').append($('<option>', { 
            value: "",
            text : "-Choose-" 
        }));
        $.each(response.data, function (i, item) {
            $('#cur_year_upt').append($('<option>', { 
                value: item.cur_year,
                text : item.cur_year 
            }));
        });
    });
    //---------- end select session ----------//

    //---------- select location ----------//
    var settings = {
        "url": host+"api_tetapan_picoms/public/locationsList",
        "method": "POST",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        //LIST OPTION 
        $('#loc_name').append($('<option>', { 
            value: "",
            text : "-Choose-" 
        }));
        $.each(response.data, function (i, item) {
            $('#loc_name').append($('<option>', { 
                value: item.loc_id,
                text : item.loc_name 
            }));
        });

        // LIST OPTION UPDATE 
         $('#loc_name_upt').append($('<option>', { 
            value: "",
            text : "-Choose-" 
        }));
        $.each(response.data, function (i, item) {
            $('#loc_name_upt').append($('<option>', { 
                value: item.loc_id,
                text : item.loc_name 
            }));
        });
    });
    //---------- end select location ----------//

    //---------- select lecturer ----------//
    var settings = {
        "url": host+"api_tetapan_picoms/public/lecturerList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        //LIST OPTION 
        $('#emp_id').append($('<option>', { 
            value: "",
            text : "-Choose-" 
        }));
        $.each(response.data, function (i, item) {
            $('#emp_id').append($('<option>', { 
                value: item.emp_id,
                text : item.emp_name 
            }));
        });

        // LIST OPTION UPDATE 
         $('#emp_id_upt').append($('<option>', { 
            value: "",
            text : "-Choose-" 
        }));
        $.each(response.data, function (i, item) {
            $('#emp_id_upt').append($('<option>', { 
                value: item.emp_id,
                text : item.emp_name 
            }));
        });
    });
    //---------- end select lecturer ----------//
});

var confirmed = false;
//-------------------------------------------------- add timetable --------------------------------------------------//
$('#formAddTimetable').on('submit', function(e){
    let $this = $(this);
    
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Timetable",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let tmt_type = $('#tmt_type').val();
            let clg_id = $('#clg_id').val();
            let fac_id = $('#fac_id').val();
            let pgm_id = $('#pgm_id').val();
            let crs_code = $('#crs_code').val();
            let cur_year = $('#cur_year').val();
            let cot_intake_month = $('#cot_intake_month').val();
            let cot_intake_year = $('#cot_intake_year').val();
            let cot_intake = cot_intake_month+'-'+cot_intake_year;
            let cur_semester = $('#cur_semester').val();
            let loc_id = $('#loc_name').val();
            let tmt_stime = $('#tmt_stime').val();
            let tmt_etime = $('#tmt_etime').val();
            let tmt_hours = $('#tmt_hours').val();
            let tmt_day = $('#tmt_day').val();
            let emp_id = $('#emp_id').val();
            let tmt_group = $('#tmt_group').val();
            let tmt_slot = $('#tmt_slot').val();
            let tmt_est_student = $('#tmt_est_student').val();

            var form = new FormData();
            form.append("tmt_type", tmt_type);
            form.append("clg_id", clg_id);
            form.append("fac_id", fac_id);
            form.append("pgm_id", pgm_id);
            form.append("crs_code", crs_code);
            form.append("cur_year", cur_year);
            form.append("cot_intake", cot_intake);
            form.append("cur_semester", cur_semester);
            form.append("loc_id", loc_id);
            form.append("tmt_stime", tmt_stime);
            form.append("tmt_etime", tmt_etime);
            form.append("tmt_hours", tmt_hours);
            form.append("tmt_day", tmt_day);
            form.append("emp_id", emp_id);
            form.append("tmt_group", tmt_group);
            form.append("tmt_slot", tmt_slot);
            form.append("tmt_est_student", tmt_est_student);
            form.append("recordstatus", "ADD");

            var settings = {
                "url": host+"api_timetbl_picoms/public/misTimetbl/register",
                "method": "POST",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form
            };

            $.ajax(settings).done(function (response) {
                console.log(response);
                let result = JSON.parse(response);
                if(result.success){
                    window.location.reload();
                }
                else{
                    swal("Failed", response.message, "error");
                }
            });
        });
    }
});
//-------------------------------------------------- end add timetable --------------------------------------------------//


//-------------------------------------------------- timetable list --------------------------------------------------//
var settings = {
    "url": host+"api_timetbl_picoms/public/misTimetbl/list",
    "method": "GET",
    "timeout": 0,
};

$.ajax(settings).done(function (response){
    let bil = 1;
    let convertList = JSON.stringify(response.data);
    $("#dataList").val(convertList);
    let list_data = [];
    let columns = [
        { "name": "bil", "title": "No." },
        { "name": "fac_id", "title": "Faculty" },
        { "name": "pgm_id", "title": "Programme" },
        { "name": "crs_code", "title": "Course Code" },
        { "name": "emp_id", "title": "Course Lecturer" },
        { "name": "tmt_group", "title": "Group", "breakpoints": "md sm xs" },
        { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" }
    ];
    
    $.each(response.data, function(i, field){
        list_data.push({
            "bil": bil++, "fac_id": field.fac_name, "pgm_id": field.pgm_name, "crs_code": field.crs_code, "emp_id": field.emp_name, "tmt_group": field.tmt_group,
            "upt_btn": '<button class="btn btn-icon success" title="Update" onclick="loadData(\'' + i + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button> ' +
                        '<button class="btn btn-icon danger" title="Delete" onclick="del_rekod(\''+field.pk_id+'\')"><i class="ion-trash-b"></i>'
        });
    });
    $('#tblTimetable').html('');
    $('#tblTimetable').footable({
        "columns": columns,
        "rows": list_data,
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
//-------------------------------------------------- end timetable list --------------------------------------------------//


function loadData(indexs){
    let data = JSON.parse($("#dataList").val());
    let cotIntake = data[indexs].cot_intake;
    let cot_intake_month_upt = cotIntake.substr(0,3);
    let cot_intake_year_upt = cotIntake.substr(4,8);
    
    $('#pk_id').val(data[indexs].pk_id);
    $('#tmt_type_upt').val(data[indexs].tmt_type);
    $('#clg_id_upt').val(data[indexs].clg_id);
    $('#fac_id_upt').val(data[indexs].fac_id);
    $('#pgm_id_upt').val(data[indexs].pgm_id);
    $('#crs_code_upt').val(data[indexs].crs_code);
    $('#cur_year_upt').val(data[indexs].cur_year);
    $('#cot_intake_month_upt').val(cot_intake_month_upt);
    $('#cot_intake_year_upt').val(cot_intake_year_upt);
    $('#cur_semester_upt').val(data[indexs].cur_semester);
    $('#loc_name_upt').val(data[indexs].loc_id);
    $('#tmt_stime_upt').val(data[indexs].tmt_stime);
    $('#tmt_etime_upt').val(data[indexs].tmt_etime);
    $('#tmt_hours_upt').val(data[indexs].tmt_hours);
    $('#tmt_day_upt').val(data[indexs].tmt_day);
    $('#emp_id_upt').val(data[indexs].emp_id);
    $('#tmt_group_upt').val(data[indexs].tmt_group);
    $('#tmt_slot_upt').val(data[indexs].tmt_slot);
    $('#tmt_est_student_upt').val(data[indexs].tmt_est_student);

    $("#update-Timetbl").modal("show");
}


//-------------------------------------------------- update timetable --------------------------------------------------//
$('#formUptTimetbl').on('submit', function(e){
    let $this = $(this);
    
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Timetable",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let pk_id = $('#pk_id').val();
            let tmt_type = $('#tmt_type_upt').val();
            let clg_id = $('#clg_id_upt').val();
            let fac_id = $('#fac_id_upt').val();
            let pgm_id = $('#pgm_id_upt').val();
            let crs_code = $('#crs_code_upt').val();
            let cur_year = $('#cur_year_upt').val();
            let cot_intake_month = $('#cot_intake_month_upt').val();
            let cot_intake_year = $('#cot_intake_year_upt').val();
            let cot_intake = cot_intake_month+'-'+cot_intake_year;
            let cur_semester = $('#cur_semester_upt').val();
            let loc_id = $('#loc_name_upt').val();
            let tmt_stime = $('#tmt_stime_upt').val();
            let tmt_etime = $('#tmt_etime_upt').val();
            let tmt_hours = $('#tmt_hours_upt').val();
            let tmt_day = $('#tmt_day_upt').val();
            let emp_id = $('#emp_id_upt').val();
            let tmt_group = $('#tmt_group_upt').val();
            let tmt_slot = $('#tmt_slot_upt').val();
            let tmt_est_student = $('#tmt_est_student_upt').val();

            var form = new FormData();
            form.append("pk_id", pk_id);
            form.append("tmt_type", tmt_type);
            form.append("clg_id", clg_id);
            form.append("fac_id", fac_id);
            form.append("pgm_id", pgm_id);
            form.append("crs_code", crs_code);
            form.append("cur_year", cur_year);
            form.append("cot_intake", cot_intake);
            form.append("cur_semester", cur_semester);
            form.append("loc_id", loc_id);
            form.append("tmt_stime", tmt_stime);
            form.append("tmt_etime", tmt_etime);
            form.append("tmt_hours", tmt_hours);
            form.append("tmt_day", tmt_day);
            form.append("emp_id", emp_id);
            form.append("tmt_group", tmt_group);
            form.append("tmt_slot", tmt_slot);
            form.append("tmt_est_student", tmt_est_student);
            form.append("recordstatus", "EDT");

            var settings = {
                "url": host+"api_timetbl_picoms/public/misTimetbl/update",
                "method": "POST",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form
            };

            $.ajax(settings).done(function (response){
                let result = JSON.parse(response);
                if(result.success){
                    window.location.reload();
                }
                else{ swal("Failed", response.message, "error"); }
            });
        });
    }
});
//-------------------------------------------------- end update timetable --------------------------------------------------//


function del_rekod(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("pk_id", id);

    swal({
        title: "Remove Timetable",
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
            "url": host+"api_timetbl_picoms/public/misTimetbl/delete",
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
            window.location.replace("adminPage.html");
        });
    });

}


