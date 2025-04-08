$(function(){
    $.ajaxSetup ({
        cache: false
    });

    $('#btnBack').click(function(){
        location.href = 'adminPage.html';
    });

    //---------- select gred ----------//
    var settings = {
        "url": host+"api_public_access/public/gradeList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        //LIST OPTION undergraduate
        $('#grd_id').append($('<option>', { 
            value: "",
            text : "-Choose-" 
        }));
        $.each(response.data, function (i, item) {
            $('#grd_id').append($('<option>', { 
                value: item.grade_name,
                text : item.grade_name 
            }));
        });

        // LIST OPTION UPDATE undergraduate
         $('#upt_grd_id').append($('<option>', { 
            value: "",
            text : "-Choose-" 
        }));
        $.each(response.data, function (i, item) {
            $('#upt_grd_id').append($('<option>', { 
                value: item.grade_name,
                text : item.grade_name 
            }));
        });

        //LIST OPTION coursework
        $('#grd_id_crswrk').append($('<option>', { 
            value: "",
            text : "-Choose-" 
        }));
        $.each(response.data, function (i, item) {
            $('#grd_id_crswrk').append($('<option>', { 
                value: item.grade_name,
                text : item.grade_name 
            }));
        });

        // LIST OPTION UPDATE coursework
        $('#upt_grd_id_crswrk').append($('<option>', { 
            value: "",
            text : "-Choose-" 
        }));
        $.each(response.data, function (i, item) {
            $('#upt_grd_id_crswrk').append($('<option>', { 
                value: item.grade_name,
                text : item.grade_name 
            }));
        });

        //LIST OPTION research
        $('#grd_id_rsrch').append($('<option>', { 
            value: "",
            text : "-Choose-" 
        }));
        $.each(response.data, function (i, item) {
            $('#grd_id_rsrch').append($('<option>', { 
                value: item.grade_name,
                text : item.grade_name 
            }));
        });

        // LIST OPTION UPDATE research
        $('#upt_grd_id_rsrch').append($('<option>', { 
            value: "",
            text : "-Choose-" 
        }));
        $.each(response.data, function (i, item) {
            $('#upt_grd_id_rsrch').append($('<option>', { 
                value: item.grade_name,
                text : item.grade_name 
            }));
        });
    });
    //---------- end select gred ----------//

    //---------- select course ----------//
    var settings = {
        "url": host+"api_tetapan_picoms/public/courseList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        //LIST OPTION undergraduate
        $('#course_code').append($('<option>', { 
            value: "",
            text : "-Choose-" 
        }));
        $.each(response.data, function (i, item) {
            $('#course_code').append($('<option>', { 
                value: item.crs_code,
                text : item.crs_name 
            }));
        });

        // LIST OPTION UPDATE undergraduate
         $('#upt_course_code').append($('<option>', { 
            value: "",
            text : "-Choose-" 
        }));
        $.each(response.data, function (i, item) {
            $('#upt_course_code').append($('<option>', { 
                value: item.crs_code,
                text : item.crs_name 
            }));
        });

        //LIST OPTION coursework
        $('#course_code_crswrk').append($('<option>', { 
            value: "",
            text : "-Choose-" 
        }));
        $.each(response.data, function (i, item) {
            $('#course_code_crswrk').append($('<option>', { 
                value: item.crs_code,
                text : item.crs_name 
            }));
        });

        // LIST OPTION UPDATE coursework
        $('#upt_course_code_crswrk').append($('<option>', { 
            value: "",
            text : "-Choose-" 
        }));
        $.each(response.data, function (i, item) {
            $('#upt_course_code_crswrk').append($('<option>', { 
                value: item.crs_code,
                text : item.crs_name 
            }));
        });

        //LIST OPTION research
        $('#course_code_rsrch').append($('<option>', { 
            value: "",
            text : "-Choose-" 
        }));
        $.each(response.data, function (i, item) {
            $('#course_code_rsrch').append($('<option>', { 
                value: item.crs_code,
                text : item.crs_name 
            }));
        });

        // LIST OPTION UPDATE research
        $('#upt_course_code_rsrch').append($('<option>', { 
            value: "",
            text : "-Choose-" 
        }));
        $.each(response.data, function (i, item) {
            $('#upt_course_code_rsrch').append($('<option>', { 
                value: item.crs_code,
                text : item.crs_name 
            }));
        });
    });
    //---------- end select course ----------//
});


//-------------------------------------------------- display undergraduate list --------------------------------------------------//
var settings = {
    "url": host+"api_exam_picoms/public/listExmGrade/undergrad",
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
        { "name": "bil", "title": "No." },
        { "name": "grd_id", "title": "Code Grade" },
        { "name": "grd_score", "title": "Marks From", "breakpoints": "md sm xs" },
        { "name": "grd_score_to", "title": "Marks To", "breakpoints": "md sm xs" },
        { "name": "course_code", "title": "Course" },
        { "name": "grd_status", "title": "Status", "breakpoints": "md sm xs" },
        { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" }
    ];
    
    $.each(response.data, function(i, field){
        list_data.push({
            "bil": bil++, "grd_id": field.grd_id, "grd_score": field.grd_score, "grd_score_to": field.grd_score_to, "course_code": field.crs_name, "grd_status": field.grd_status,
            "upt_btn": '<button class="btn btn-icon success" title="Update" onclick="loadData(\'' + i + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button> ' +
                        '<button class="btn btn-icon danger" title="Delete" onclick="del_rekod(\''+field.pk_id+'\')"><i class="ion-trash-b"></i>'
        });
    });
    $('#tblUndergraduate').html('');
    $('#tblUndergraduate').footable({
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
//-------------------------------------------------- end display undergraduate list --------------------------------------------------//


//-------------------------------------------------- display coursework list --------------------------------------------------//
var settings = {
    "url": host+"api_exam_picoms/public/listExmGrade/coursework",
    "method": "GET",
    "timeout": 0,
};

$.ajax(settings).done(function (response) {
    // console.log(response);
    let bil = 1;
    let convertList = JSON.stringify(response.data);
    $("#dataListCrswrk").val(convertList);
    let list_data = [];
    let columns = [
        { "name": "bil", "title": "No." },
        { "name": "grd_id", "title": "Code Grade" },
        { "name": "grd_score", "title": "Marks From", "breakpoints": "md sm xs" },
        { "name": "grd_score_to", "title": "Marks To", "breakpoints": "md sm xs" },
        { "name": "course_code", "title": "Course" },
        { "name": "grd_status", "title": "Status", "breakpoints": "md sm xs" },
        { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" }
    ];
    
    $.each(response.data, function(i, field){
        list_data.push({
            "bil": bil++, "grd_id": field.grd_id, "grd_score": field.grd_score, "grd_score_to": field.grd_score_to, "course_code": field.crs_name, "grd_status": field.grd_status,
            "upt_btn": '<button class="btn btn-icon success" title="Update" onclick="loadDataCrswrk(\'' + i + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button> ' +
                        '<button class="btn btn-icon danger" title="Delete" onclick="del_rekod(\''+field.pk_id+'\')"><i class="ion-trash-b"></i>'
        });
    });
    $('#tblCoursework').html('');
    $('#tblCoursework').footable({
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
//-------------------------------------------------- end display coursework list --------------------------------------------------//


//-------------------------------------------------- display research list --------------------------------------------------//
var settings = {
    "url": host+"api_exam_picoms/public/listExmGrade/research",
    "method": "GET",
    "timeout": 0,
};

$.ajax(settings).done(function (response) {
    // console.log(response);
    let bil = 1;
    let convertList = JSON.stringify(response.data);
    $("#dataListRsrch").val(convertList);
    let list_data = [];
    let columns = [
        { "name": "bil", "title": "No." },
        { "name": "grd_id", "title": "Code Grade" },
        { "name": "grd_score", "title": "Marks From", "breakpoints": "md sm xs" },
        { "name": "grd_score_to", "title": "Marks To", "breakpoints": "md sm xs" },
        { "name": "course_code", "title": "Course" },
        { "name": "grd_status", "title": "Status", "breakpoints": "md sm xs" },
        { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" }
    ];
    
    $.each(response.data, function(i, field){
        list_data.push({
            "bil": bil++, "grd_id": field.grd_id, "grd_score": field.grd_score, "grd_score_to": field.grd_score_to, "course_code": field.crs_name, "grd_status": field.grd_status,
            "upt_btn": '<button class="btn btn-icon success" title="Update" onclick="loadDataRsrch(\'' + i + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button> ' +
                        '<button class="btn btn-icon danger" title="Delete" onclick="del_rekod(\''+field.pk_id+'\')"><i class="ion-trash-b"></i>'
        });
    });
    $('#tblResearch').html('');
    $('#tblResearch').footable({
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
//-------------------------------------------------- end display research list --------------------------------------------------//


var confirmed = false;
//-------------------------------------------------- add Gred Undergraduate --------------------------------------------------//
$('#formGredUndergrad').on('submit', function(e){
    let $this = $(this);
    
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Undergraduate Grade",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let grd_id = $('#grd_id').val();
            let grd_status = $('#grd_status').val();
            let grd_score = $('#grd_score').val();
            let grd_score_to = $('#grd_score_to').val();
            let course_code = $('#course_code').val();
            let grd_remarks = $('#grd_remarks').val();

            var form = new FormData();
            form.append("grd_id", grd_id);
            form.append("grd_category", "001");
            form.append("grd_score", grd_score);
            form.append("grd_score_to", grd_score_to);
            form.append("grd_status", grd_status);
            form.append("course_code", course_code);
            form.append("grd_remarks", grd_remarks);
            form.append("recordstatus", "ADD");

            var settings = {
                "url": host+"api_exam_picoms/public/addExmGrading/undergrad",
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
        });
    }
});
//-------------------------------------------------- end add Gred Undergraduate --------------------------------------------------//

//-------------------------------------------------- add Gred Coursework --------------------------------------------------//
$('#formGredCoursework').on('submit', function(e){
    let $this = $(this);
    
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Postgraduate(Coursework) Grade",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let grd_id = $('#grd_id_crswrk').val();
            let grd_status = $('#grd_status_crswrk').val();
            let grd_score = $('#grd_score_crswrk').val();
            let grd_score_to = $('#grd_score_to_crswrk').val();
            let course_code = $('#course_code_crswrk').val();
            let grd_remarks = $('#grd_remarks_crswrk').val();

            var form = new FormData();
            form.append("grd_id", grd_id);
            form.append("grd_category", "002");
            form.append("grd_score", grd_score);
            form.append("grd_score_to", grd_score_to);
            form.append("grd_status", grd_status);
            form.append("course_code", course_code);
            form.append("grd_remarks", grd_remarks);
            form.append("recordstatus", "ADD");

            var settings = {
                "url": host+"api_exam_picoms/public/addExmGrading/coursework",
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
        });
    }
});
//-------------------------------------------------- end add Gred Coursework --------------------------------------------------//

//-------------------------------------------------- add Gred Research --------------------------------------------------//
$('#formGredResearch').on('submit', function(e){
    let $this = $(this);
    
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Postgraduate(Research) Grade",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let grd_id = $('#grd_id_rsrch').val();
            let grd_status = $('#grd_status_rsrch').val();
            let grd_score = $('#grd_score_rsrch').val();
            let grd_score_to = $('#grd_score_to_rsrch').val();
            let course_code = $('#course_code_rsrch').val();
            let grd_remarks = $('#grd_remarks_rsrch').val();

            var form = new FormData();
            form.append("grd_id", grd_id);
            form.append("grd_category", "003");
            form.append("grd_score", grd_score);
            form.append("grd_score_to", grd_score_to);
            form.append("grd_status", grd_status);
            form.append("course_code", course_code);
            form.append("grd_remarks", grd_remarks);
            form.append("recordstatus", "ADD");

            var settings = {
                "url": host+"api_exam_picoms/public/addExmGrading/research",
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
        });
    }
});
//-------------------------------------------------- end add Gred Research --------------------------------------------------//


// display data Undergraduate
function loadData(indexs){
    let data = JSON.parse($("#dataList").val());
    $('#pk_id').val(data[indexs].pk_id);
    $('#upt_grd_id').val(data[indexs].grd_id);
    $('#upt_grd_status').val(data[indexs].grd_status);
    $('#upt_grd_score').val(data[indexs].grd_score);
    $('#upt_grd_score_to').val(data[indexs].grd_score_to);
    $('#upt_course_code').val(data[indexs].course_code);
    $('#upt_grd_remarks').val(data[indexs].grd_remarks);

    $("#update-undergraduate").modal("show");
}


// display data Coursework
function loadDataCrswrk(indexs){
    let data = JSON.parse($("#dataListCrswrk").val());
    $('#pk_id_crswrk').val(data[indexs].pk_id);
    $('#upt_grd_id_crswrk').val(data[indexs].grd_id);
    $('#upt_grd_status_crswrk').val(data[indexs].grd_status);
    $('#upt_grd_score_crswrk').val(data[indexs].grd_score);
    $('#upt_grd_score_to_crswrk').val(data[indexs].grd_score_to);
    $('#upt_course_code_crswrk').val(data[indexs].course_code);
    $('#upt_grd_remarks_crswrk').val(data[indexs].grd_remarks);

    $("#update-coursework").modal("show");
}


// display data Undergraduate
function loadDataRsrch(indexs){
    let data = JSON.parse($("#dataListRsrch").val());
    $('#pk_id_rsrch').val(data[indexs].pk_id);
    $('#upt_grd_id_rsrch').val(data[indexs].grd_id);
    $('#upt_grd_status_rsrch').val(data[indexs].grd_status);
    $('#upt_grd_score_rsrch').val(data[indexs].grd_score);
    $('#upt_grd_score_to_rsrch').val(data[indexs].grd_score_to);
    $('#upt_course_code_rsrch').val(data[indexs].course_code);
    $('#upt_grd_remarks_rsrch').val(data[indexs].grd_remarks);

    $("#update-research").modal("show");
}


//-------------------------------------------------- update Grading --------------------------------------------------//
function uptGrading(data){
    var form = new FormData();
    form.append("pk_id", data.pk_id);
    form.append("grd_id", data.grd_id);
    form.append("grd_category", data.grd_category);
    form.append("grd_score", data.grd_score);
    form.append("grd_score_to", data.grd_score_to);
    form.append("grd_status", data.grd_status);
    form.append("course_code", data.course_code);
    form.append("grd_remarks", data.grd_remarks);
    form.append("recordstatus", "EDT");

    var settings = {
        "url": host+"api_exam_picoms/public/misExamGrading/update",
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

// Undergraduate 
$('#formUptUndergrad').on('submit', function(e){
    let $this = $(this);
    
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Undergraduate Grade",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let data = {};
            data.pk_id = $('#pk_id').val();
            data.grd_id = $('#upt_grd_id').val();
            data.grd_category = '001';
            data.grd_status = $('#upt_grd_status').val();
            data.grd_score = $('#upt_grd_score').val();
            data.grd_score_to = $('#upt_grd_score_to').val();
            data.course_code = $('#upt_course_code').val();
            data.grd_remarks = $('#upt_grd_remarks').val();

            uptGrading(data);
        });
    }
});

//Postgraduate (Coursework)
$('#formUptCoursework').on('submit', function(e){
    let $this = $(this);
    
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Postgraduate(Coursework) Grade",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let data = {};
            data.pk_id = $('#pk_id_crswrk').val();
            data.grd_id = $('#upt_grd_id_crswrk').val();
            data.grd_category = '002';
            data.grd_status = $('#upt_grd_status_crswrk').val();
            data.grd_score = $('#upt_grd_score_crswrk').val();
            data.grd_score_to = $('#upt_grd_score_to_crswrk').val();
            data.course_code = $('#upt_course_code_crswrk').val();
            data.grd_remarks = $('#upt_grd_remarks_crswrk').val();

            uptGrading(data);
        });
    }
});

// Postgraduate (Research)
$('#formUptResearch').on('submit', function(e){
    let $this = $(this);
    
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Postgraduate(Research) Grade",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let data = {};
            data.pk_id = $('#pk_id_rsrch').val();
            data.grd_id = $('#upt_grd_id_rsrch').val();
            data.grd_category = '003';
            data.grd_status = $('#upt_grd_status_rsrch').val();
            data.grd_score = $('#upt_grd_score_rsrch').val();
            data.grd_score_to = $('#upt_grd_score_to_rsrch').val();
            data.course_code = $('#upt_course_code_rsrch').val();
            data.grd_remarks = $('#upt_grd_remarks_rsrch').val();

            uptGrading(data);
        });
    }
});
//-------------------------------------------------- end update Grading --------------------------------------------------//

function del_rekod(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("pk_id", id);

    swal({
        title: "Remove Grading",
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
            "url": host+"api_exam_picoms/public/misExamGrading/delete",
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


