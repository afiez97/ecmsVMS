var lectId = getUrlVars()['id'];
var lectCrsid = getUrlVars()['crs_id'];

$(function(){
    $.ajaxSetup ({
        cache: false
    });
    $("#loading_modal").modal('show');
    
    var id = getUrlVars()['crs_id'];

    detailLectCrs(id,function(){
        // Dropdown Session List
        sessionList(function(){
            $.each(obj_session.data, function (i, item) {
                $('#upt_cur_year').append('<option value="'+item.cur_year+'">'+item.cur_year+'</option>');
            });
            $('#upt_cur_year').val(data.cur_year);
        });
    
        // Dropdown Fakulti List
        facultyList(function(){
            $.each(obj_faculty.data, function (i, item){
                $('#upt_fac_id').append('<option value="'+item.fac_id+'">'+item.fac_name+'</option>');
            });     
            $('#upt_fac_id').val(data.fac_id);      

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
                   
        $('#pk_id').val(id);      
        $('#upt_emp_id').val(data.emp_id);      
        $('#upt_cur_semester').val(data.cur_semester);    

        $('#fac_id').html(data.fac_name);
        $('#emp_id').html(data.emp_name);
        $('#pgm_id').html(data.pgm_name);
        $('#crs_code').html(data.crs_name);
        $('#cur_year').html(data.cur_year);
        $('#cur_semester').html(data.cur_semester);
    });

    crsTestMarkList();
    crsPracMarkList();
    markList();

    $('#btnBack').click(function(){
        window.location.replace('lecturer_details.html?id='+lectId);
    });
});

function courseList(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/courseList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_course = response;
        returnValue();        
    });
}

function programList(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/programmeList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
       obj_programme = response;
       returnValue();
    });
}

function facultyList(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/facultyList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        //LIST OPTION
        obj_faculty = response;
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

function detailLectCrs(id,returnValue){
    var form = new FormData();
    form.append("pk_id", id);
    
    var settings = {
      "url": host+"api_lecturer_picoms/public/lectCrs",
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

var confirmed = false;

//-------------------------------------------------- update lecturer course --------------------------------------------------//
$("#formUptLectCrs").on('submit',function(e){
    let $this = $(this);

    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Lecturer Course",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let emp_id = $('#upt_emp_id').val();
            let pk_id = $('#pk_id').val();
            let fac_id = $('#upt_fac_id').val();
            let pgm_id = $('#upt_pgm_id').val();
            let crs_code = $('#upt_crs_code').val();
            let cur_semester = $('#upt_cur_semester').val();
            let cur_year = $('#upt_cur_year').val();

            var form = new FormData();
            form.append("emp_id", emp_id);
            form.append("pk_id", pk_id);
            form.append("fac_id", fac_id);
            form.append("pgm_id", pgm_id);
            form.append("crs_code", crs_code);
            form.append("cur_semester", cur_semester);
            form.append("cur_year", cur_year);
            form.append("recordstatus", "EDT");

            var settings = {
                "url": host+"api_lecturer_picoms/public/uptLectCourse",
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
                else{ swal("Failed", response.message, "error"); }
            });
        });
    }
});
//-------------------------------------------------- end update lecturer course --------------------------------------------------//


//-------------------------------------------------- delete lecturer course --------------------------------------------------//
$('#btnDelLectCrs').on('click', function(e){
    let statusrekod = 'DEL';
    let pk_id = $('#pk_id').val();
    let emp_id = $('#upt_emp_id').val();

    var form = new FormData();
    form.append("recordstatus", statusrekod);
    form.append("pk_id", pk_id);
    

    swal({
        title: "Remove Lecturer Course",
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
            "url": host+"api_lecturer_picoms/public/misLectCrsPrm/delete",
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
            window.location.replace("lecturer_details.html?id="+emp_id);
        });
    });
});
//-------------------------------------------------- end delete lecturer course --------------------------------------------------//


//-------------------------------------------------- add mark --------------------------------------------------//
$('#formAddMarks').on('submit', function(e){
    let $this = $(this);

    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Mark",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let fk_lect_crs = lectCrsid;
            let non_obe_type = $('#non_obe_type').val();
            let intake_month = $('#cot_intake_month').val();
            let intake_year = $('#cot_intake_year').val();
            let cot_intake = intake_month+'-'+intake_year;
            let non_obe_percentage = $('#non_obe_percentage').val();

            var form = new FormData();
            form.append("fk_lect_crs", fk_lect_crs);
            form.append("non_obe_type", non_obe_type);
            form.append("cot_intake", cot_intake);
            form.append("non_obe_percentage", non_obe_percentage);
            form.append("recordstatus", "ADD");

            var settings = {
                "url": host+"api_lecturer_picoms/public/misLectCrsDet/register",
                "method": "POST",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form
            };

            $.ajax(settings).done(function (response) {
                // console.log(response);
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
//-------------------------------------------------- end add mark --------------------------------------------------//


function updateMarks(data){
    var form = new FormData();
    form.append("fk_lect_crs", data.fk_lect_crs);
    form.append("pk_id", data.pk_id);
    form.append("non_obe_type", data.non_obe_type);
    form.append("cot_intake", data.cot_intake);
    form.append("non_obe_percentage", data.non_obe_percentage);
    form.append("recordstatus", "EDT");

    var settings = {
        "url": host+"api_lecturer_picoms/public/misLectCrsDet/update",
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
    };

    $.ajax(settings).done(function (response) {
        // console.log(response);
        let result = JSON.parse(response);
        if(result.success){
            window.location.reload();
        }
        else{ swal("Failed", response.message, "error"); }
    });
}


//-------------------------------------------------- update assignment mark --------------------------------------------------//
$('#formUptAssignment').on('submit', function(e){
    let $this = $(this);

    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Assignmet Mark",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let intake_month = $('#cot_intake_month_upt').val();
            let intake_year = $('#cot_intake_year_upt').val();
            let data = {};
            data.fk_lect_crs = lectCrsid;
            data.pk_id = $('#pk_id_assignment').val();
            data.non_obe_type = $('#non_obe_type_upt').val();
            data.cot_intake = intake_month+'-'+intake_year;
            data.non_obe_percentage = $('#non_obe_percentage_upt').val();

            updateMarks(data);
        });
    }
});
//-------------------------------------------------- end update assignment mark --------------------------------------------------//


//-------------------------------------------------- display assignment mark list --------------------------------------------------//
function markList(){
    var settings = {
        "url": host+"api_lecturer_picoms/public/misLectCrsDet/listAss/"+lectCrsid,
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
                { "name": "cot_intake", "title": "Intake" },
                { "name": "non_obe_percentage", "title": "Marks" },
                { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" }
            ];
        
            $.each(response.data, function(i, field){
                list_data.push({
                    "bil": bil++, "cot_intake": field.cot_intake, "non_obe_percentage": field.non_obe_percentage,
                    "upt_btn": '<button class="btn success btn-icon" title="Update" onclick="loadDataAss(\'' + i + '\')"><i class="ion-android-create"></i></button> ' +
                    '<button class="btn danger btn-icon" title="Delete" onclick="del_rekod(\''+field.pk_id+'\')"><i class="ion-trash-b"></i>'
                });
            });
            $('#tblAssMark').html('');
            $('#tblAssMark').footable({
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
}

// load data to update
function loadDataAss(indexs){
    let data = JSON.parse($("#dataList").val());

    $('#pk_id_assignment').val(data[indexs].pk_id);
    $('#non_obe_type_upt').val(data[indexs].non_obe_type);
    let cotIntake = data[indexs].cot_intake;
    let cot_intake_month_upt = cotIntake.substring(0,3);
    $('#cot_intake_month_upt').val(cot_intake_month_upt);
    let cot_intake_year_upt = cotIntake.substring(4,8);
    $('#cot_intake_year_upt').val(cot_intake_year_upt);
    $('#non_obe_percentage_upt').val(data[indexs].non_obe_percentage);

    $('#divUptAssignment').removeClass('collapse');
}

// button close form update assignment
$('#btnCloseUptAss').click(function(){
    $('#divUptAssignment').addClass('collapse');
});
//-------------------------------------------------- end display assignment mark list --------------------------------------------------//


//-------------------------------------------------- update Practical mark --------------------------------------------------//
$('#formUptPractical').on('submit', function(e){
    let $this = $(this);

    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Practical Mark",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let intake_month = $('#cot_intake_month_prac').val();
            let intake_year = $('#cot_intake_year_prac').val();
            let data = {};
            data.fk_lect_crs = lectCrsid;
            data.pk_id = $('#pk_id_practical').val();
            data.non_obe_type = $('#non_obe_type_prac').val();
            data.cot_intake = intake_month+'-'+intake_year;
            data.non_obe_percentage = $('#non_obe_percentage_prac').val();

            updateMarks(data);
        });
    }
});
//-------------------------------------------------- end update Practical mark --------------------------------------------------//


//-------------------------------------------------- display Practical mark list --------------------------------------------------//
function crsPracMarkList(){
    var settings = {
        "url": host+"api_lecturer_picoms/public/misLectCrsDet/listPrac/"+lectCrsid,
        "method": "GET",
        "timeout": 0,
    };
    
    $.ajax(settings).done(function (response){
        let bil = 1;
        let convertList = JSON.stringify(response.data);
        $("#dataListPrac").val(convertList);
        let list_data = [];
        let columns = [
            { "name": "bil", "title": "No." },
            { "name": "cot_intake", "title": "Intake" },
            { "name": "non_obe_percentage", "title": "Marks" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" }
        ];
    
        $.each(response.data, function(i, field){
            list_data.push({
                "bil": bil++, "cot_intake": field.cot_intake, "non_obe_percentage": field.non_obe_percentage,
                "upt_btn": '<button class="btn btn-icon success" title="Update" onclick="loadDataPrac(\'' + i + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button> ' +
                '<button class="btn danger btn-icon" title="Delete" onclick="del_rekod(\''+field.pk_id+'\')"><i class="ion-trash-b"></i>'
            });
        });
        $('#tblPracMark').html('');
        $('#tblPracMark').footable({
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
}

// load data to update
function loadDataPrac(indexs){
    let data = JSON.parse($("#dataListPrac").val());

    $('#pk_id_practical').val(data[indexs].pk_id);
    $('#non_obe_type_prac').val(data[indexs].non_obe_type);
    let cotIntake = data[indexs].cot_intake;
    let cot_intake_month_upt = cotIntake.substring(0,3);
    $('#cot_intake_month_prac').val(cot_intake_month_upt);
    let cot_intake_year_upt = cotIntake.substring(4,8);
    $('#cot_intake_year_prac').val(cot_intake_year_upt);
    $('#non_obe_percentage_prac').val(data[indexs].non_obe_percentage);

    $('#divUptPractical').removeClass('collapse');
}

// button close form update assignment
$('#btnClosePrac').click(function(){
    $('#divUptPractical').addClass('collapse');
});
//-------------------------------------------------- end display Practical mark list --------------------------------------------------//


//-------------------------------------------------- update Test mark --------------------------------------------------//
$('#formUptTest').on('submit', function(e){
    let $this = $(this);

    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Test Mark",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let intake_month = $('#cot_intake_month_test').val();
            let intake_year = $('#cot_intake_year_test').val();
            let data = {};
            data.fk_lect_crs = lectCrsid;
            data.pk_id = $('#pk_id_test').val();
            data.non_obe_type = $('#non_obe_type_test').val();
            data.cot_intake = intake_month+'-'+intake_year;
            data.non_obe_percentage = $('#non_obe_percentage_test').val();

            updateMarks(data);
        });
    }
});
//-------------------------------------------------- end update Test mark --------------------------------------------------//

//-------------------------------------------------- display Test mark list --------------------------------------------------//
function crsTestMarkList(){
    var settings = {
        "url": host+"api_lecturer_picoms/public/misLectCrsDet/listTest/"+lectCrsid,
        "method": "GET",
        "timeout": 0,
    };
    
    $.ajax(settings).done(function (response) {
    //   console.log(response);
        let bil = 1;
        let convertList = JSON.stringify(response.data);
        $("#dataListTest").val(convertList);
        let list_data = [];
        let columns = [
            { "name": "bil", "title": "No." },
            { "name": "cot_intake", "title": "Intake" },
            { "name": "non_obe_percentage", "title": "Marks" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" }
        ];
    
        $.each(response.data, function(i, field){
            list_data.push({
                "bil": bil++, "cot_intake": field.cot_intake, "non_obe_percentage": field.non_obe_percentage,
                "upt_btn": '<button class="btn success btn-icon" title="Update" onclick="loadDataTest(\'' + i + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button> ' +
                '<button class="btn danger btn-icon" title="Delete" onclick="del_rekod(\''+field.pk_id+'\')"><i class="ion-trash-b"></i>'
            });
        });
        $('#tblTestMark').html('');
        $('#tblTestMark').footable({
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
}

// load data to update
function loadDataTest(indexs){
    let data = JSON.parse($("#dataListTest").val());

    $('#pk_id_test').val(data[indexs].pk_id);
    $('#non_obe_type_test').val(data[indexs].non_obe_type);
    let cotIntake = data[indexs].cot_intake;
    let cot_intake_month_upt = cotIntake.substring(0,3);
    $('#cot_intake_month_test').val(cot_intake_month_upt);
    let cot_intake_year_upt = cotIntake.substring(4,8);
    $('#cot_intake_year_test').val(cot_intake_year_upt);
    $('#non_obe_percentage_test').val(data[indexs].non_obe_percentage);

    $('#divUptTest').removeClass('collapse');
}

// button close form update assignment
$('#btnCloseTest').click(function(){
    $('#divUptTest').addClass('collapse');
});
//-------------------------------------------------- end display Test mark list --------------------------------------------------//


//-------------------------------------------------- delete marks --------------------------------------------------//
function del_rekod(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("pk_id", id);
    

    swal({
        title: "Remove Marks",
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
            "url": host+"api_lecturer_picoms/public/misLectCrsDet/delete",
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
            window.location.reload();
        });
    });
}
//-------------------------------------------------- end delete marks --------------------------------------------------//