let val_id = getUrlVars()['id'];

$(function(){
    $.ajaxSetup ({
        cache: false
    });

    $('#btnBack').click(function(){
        location.href = 'adminPage.html';
    });


    //-------------------------------------------------- display detail timetable --------------------------------------------------//
    detailExamTimetbl(val_id,function(){
        // Dropdown Session List
        sessionList(function(){
            $.each(obj_session.data, function (i, item) {
                $('#upt_cur_year').append('<option value="'+item.cur_year+'">'+item.cur_year+'</option>');
            });
            $('#upt_cur_year').val(data.cur_year);
        });

        //Dropdown Program List
        programList(function(){
            $.each(obj_programme.data, function (i, item){
                $('#upt_pgm_id').append('<option value="'+item.pgm_id+'">'+item.pgm_name+'</option>');
            });
            $('#upt_pgm_id').val(data.pgm_id);      
        });

        //Dropdown Course List
        courseList(function(){
            $.each(obj_course.data, function (i, item){
                $('#upt_crs_code').append('<option value="'+item.crs_code+'">'+item.crs_name+'</option>');
            });
            $('#upt_crs_code').val(data.crs_code);
        });

        $('#pk_id').val(data.pk_id);
        $('#upt_reg_semester').val(data.reg_semester);
        $('#upt_tbl_paper_type').val(data.tbl_paper_type);
        $('#upt_tbl_date_start').val(data.tbl_date_start);
        $('#upt_tbl_time_start').val(data.tbl_time_start);
        $('#upt_tbl_time_end').val(data.tbl_time_end);
        $('#upt_tbl_status').val(data.tbl_status);
        $('#upt_tbl_remarks').val(data.tbl_remarks);

        // view details
        $('#cur_year').html(data.cur_year);
        $('#reg_semester').html(data.reg_semester);
        $('#pgm_id').html(data.pgm_name);
        $('#crs_code').html(data.crs_name);
        $('#tbl_paper_type').html(data.tbl_paper_type);
        $('#tbl_date_start').html(data.tbl_date_start);
        $('#tbl_time_start').html(data.tbl_time_start);
        $('#tbl_time_end').html(data.tbl_time_end);
        $('#tbl_status').html(data.tbl_status);
        $('#tbl_remarks').html(data.tbl_remarks);
    });
    //-------------------------------------------------- end display detail timetable --------------------------------------------------//


    //---------- list students ----------//
    var settings = {
        "url": host+"api_exam_picoms/public/listStudent",
        "method": "GET",
        "timeout": 0,
    };
    
    $.ajax(settings).done(function (response) {
        // console.log(response);
        let bil = 1;
        let convertList = JSON.stringify(response.data);
        $("#dataList").val(convertList);
        let list_data = [];
        let columns = [
            { "name": "std_studentid", "title": "Student ID" },
            { "name": "sti_name", "title": "Name" },
            { "name": "sti_icno", "title": "IC No.", "breakpoints": "md sm xs" },
            { "name": "pgm_id", "title": "Programme", "breakpoints": "md sm xs" },
        ];
        
        $.each(response.data, function(i, field){
            list_data.push({
                 "std_studentid": '<label class="md-check"><input type="checkbox" class="has-value" value="'+field.std_studentid+'" checked><i class="indigo"></i></label>' +field.std_studentid,
                  "sti_name": field.sti_name,
                   "sti_icno": field.sti_icno,
                    "pgm_id": field.pgm_name
                            // '<button class="btn success" title="Update" onclick="loadData(\'' + field.pk_id + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button> ' +
                            // '<button class="btn accent" title="Details" onclick="detail(\'' + field.pk_id + '\',\'' + i + '\')" id="btnPerincian"><i class="ion-ios-list-outline"></i></button> '
                            // '<button class="btn danger" title="Delete" onclick="del_rekod(\''+field.pk_id+'\')"><i class="ion-trash-b"></i>'
            });
        });
        $('#tblStudList').html('');
        $('#tblStudList').footable({
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
    //---------- end list students ----------//


    
});


function detailExamTimetbl(id,returnValue){
    var form = new FormData();
    form.append("pk_id", id);
    
    var settings = {
      "url": host+"api_exam_picoms/public/misExamTimetbl/show",
      "method": "POST",
      "timeout": 0,
      "processData": false,
      "mimeType": "multipart/form-data",
      "contentType": false,
      "data": form
    };
    
    $.ajax(settings).done(function (response){
        let result = JSON.parse(response);
        data = result.data;
        returnValue();
        
    });
}


function sessionList(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/curyear/selectCurYear",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        // LIST OPTION UPDATE
        obj_session = response;
        returnValue();
    });
}

function programList(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/programmeList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        //LIST OPTION
       obj_programme = response;
       returnValue();
    });
}

function courseList(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/courseList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        //LIST OPTION
        obj_course = response;
        returnValue();        
    });
}


var confirmed = false;
//-------------------------------------------------- update exam timetable --------------------------------------------------//
$('#formUptExamTimetbl').on('submit', function(e){
    let $this = $(this);
    
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Examination Timetable",
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
            let cur_year = $('#upt_cur_year').val();
            let pgm_id = $('#upt_pgm_id').val();
            let reg_semester = $('#upt_reg_semester').val();
            let crs_code = $('#upt_crs_code').val();
            let tbl_paper_type = $('#upt_tbl_paper_type').val();
            let tbl_date_start = $('#upt_tbl_date_start').val();
            let tbl_time_start = $('#upt_tbl_time_start').val();
            let tbl_time_end = $('#upt_tbl_time_end').val();
            let tbl_status = $('#upt_tbl_status').val();
            let tbl_remarks = $('#upt_tbl_remarks').val();

            var form = new FormData();
            form.append("pk_id", pk_id);
            form.append("cur_year", cur_year);
            form.append("pgm_id", pgm_id);
            form.append("reg_semester", reg_semester);
            form.append("tbl_paper_type", tbl_paper_type);
            form.append("tbl_date_start", tbl_date_start);
            form.append("crs_code", crs_code);
            form.append("tbl_time_start", tbl_time_start);
            form.append("tbl_time_end", tbl_time_end);
            form.append("tbl_status", tbl_status);
            form.append("tbl_remarks", tbl_remarks);
            form.append("recordstatus", "EDT");

            var settings = {
                "url": host+"api_exam_picoms/public/misExamTimetbl/update",
                "method": "POST",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form
            };

            $.ajax(settings).done(function (response){
                // console.log(response);
                let result = JSON.parse(response);
                if(result.success){
                    window.location.reload();
                }
                else{ swal("Failed", response.message, "error"); }
            });
        });
    }
});
//-------------------------------------------------- end update exam timetable --------------------------------------------------//


//-------------------------------------------------- delete exam timetable --------------------------------------------------//
$('#btnDelExamTimetbl').on('click', function(e){
    let pk_id = $('#pk_id').val();
    let emp_id = $('#upt_emp_id').val();

    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("pk_id", pk_id);
    

    swal({
        title: "Remove Examination Timetable",
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
            "url": host+"api_exam_picoms/public/misExamTimetbl/delete",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };

        $.ajax(settings).done(function (response) {
            // console.log(response)
            result = JSON.parse(response);
            if (!result.success) {
                Swal(result.message, result.data, "error");
                return;
            }
            window.location.replace('adminPage.html');
        });
    });
});
//-------------------------------------------------- end delete exam timetable --------------------------------------------------//