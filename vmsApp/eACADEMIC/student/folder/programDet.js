let prog_id = window.sessionStorage.prog_id;

$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let prog_id = window.sessionStorage.prog_id;
    let clg_id = window.sessionStorage.idPage;

    $("#listProgramdet").html('');

    dataProgram(prog_id, function(){
        // select faculty
        facList(clg_id, function(){
            $('#upt_fac_id').append('<option value="">- Choose -</option>');
            $.each(obj_faculty.data, function (i, item) {
                $('#upt_fac_id').append('<option value="'+item.pk_id+'">'+item.fac_name+'</option>');
            });
            $('#upt_fac_id').val(data.fac_id);
        });

        // select level of study
        levelStudy(function(){
            $('#upt_pgm_category').append('<option value="">- Choose -</option>');
            $.each(obj_levelStudy.data, function (i, item) {
                $('#upt_pgm_category').append('<option value="'+item.category_name+'">'+item.category_name+'</option>');
            });
            $('#upt_pgm_category').val(data.pgm_category);
        });

        // select field of study
        fieldStudy(function(){
            $('#upt_pgm_area').append('<option value="">- Choose -</option>');
            $.each(obj_fieldStudy.data, function (i, item) {
                $('#upt_pgm_area').append('<option value="'+item.aca_area_name+'">'+item.aca_area_name+'</option>');
            });
            $('#upt_pgm_area').val(data.pgm_area);
        });

        // select mode of study
        modeStudy(function(){
            $('#upt_pgm_mode').append('<option value="">- Choose -</option>');
            $.each(obj_modeStudy.data, function (i, item) {
                $('#upt_pgm_mode').append('<option value="'+item.mode_name+'">'+item.mode_name+'</option>');
            });
            $('#upt_pgm_mode').val(data.pgm_mode);
        });

        // select mqf level
        mqfLevel(function(){
            $('#upt_pgm_mqflevel').append('<option value="">-Choose-</option>');
            $.each(obj_mqfLevel.data, function (i, item) {
                $('#upt_pgm_mqflevel').append('<option value="'+item.mqflevel_name+'">'+item.mqflevel_name+'</option>');
            });
            $('#upt_pgm_mqflevel').val(data.pgm_mqflevel);
        });

        // select status
        sttsPgm(function(){
            $('#upt_pgm_status').append('<option value="">-Choose-</option>');
            $.each(obj_status.data, function (i, item) {
                $('#upt_pgm_status').append('<option value="'+item.status_name+'">'+item.status_name+'</option>');
            });
            $('#upt_pgm_status').val(data.pgm_status);
        });

        $("#pk_id").val(data.pk_id);
        $("#fac_name").html(data.fac_name.toUpperCase());
        $("#pgm_categoryt").html(data.pgm_category.toUpperCase());
        $("#pgm_areat").html(data.pgm_area.toUpperCase());
        $("#pgm_idt").html(data.pgm_id.toUpperCase());
        $("#pgm_namet").html(data.pgm_name.toUpperCase());
        $("#pgm_modet").html(data.pgm_mode.toUpperCase());
        $("#pgm_mqflevelt").html(data.pgm_mqflevel.toUpperCase());
        $("#pgm_durationt").html(data.pgm_duration.toUpperCase());
        $("#pgm_statust").html(data.pgm_status.toUpperCase());
        $("#pgm_fee").html(data.pgm_fee);
        
        $('#upt_pgm_id').val(data.pgm_id);
        $('#upt_pgm_name').val(data.pgm_name);
        $('#upt_pgm_duration').val(data.pgm_duration);
        $('#upt_tuition_fee').val(data.pgm_fee);
    });

    // Dropdown Academic Session
    listAcaSession(function(){
        $('#dtp_year').append('<option value="">- Choose -</option>');
        $('#upt_dtp_year').append('<option value="">- Choose -</option>');
        $.each(obj_session.data, function (i, item) {
            $('#dtp_year').append('<option value="'+item.cur_year.replace('/','-')+'">'+item.cur_year+'</option>');
            $('#upt_dtp_year').append('<option value="'+item.cur_year.replace('/','-')+'">'+item.cur_year+'</option>');
        });
    });

    // details list
    detailsList(prog_id, function(){
        var columns = [
            { "name": "bil", "title": "No." },
            { "name": "dtp_year", "title": "Academic Session" },
            { "name": "dtp_intake", "title": "Intake" },
            // { "name": "dtp_sem", "title": "Semester" },
            { "name": "upt_btn", "title": "Action",'class':"text-center", "breakpoints": "md sm xs" }
        ];
        
        var list = [];
        // let data = result.data;
        let bil = 1;
        let convertDetList = JSON.stringify(obj_detList);
        $("#dataDetailList").val(convertDetList);

        $.each(obj_detList,function(i,field){
            list.push({
                "bil":bil++, "dtp_year":field.dtp_year, "dtp_intake":field.dtp_intake,
                // "dtp_sem":field.dtp_sem,
                "upt_btn":  '<button class="btn btn-icon success" title="Update" onclick="loadDataDetail(\'' + i + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button> '+
                            '<button class="btn btn-icon danger" title="Remove" onclick="del_rekod(\''+field.dtp_id+'\')"><i class="ion-trash-b" ></i></button>'
            });
        });

        $("#listProgramdet").footable({
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
    })
});
var confirmed = false;

// btn Back to Programme List
$('#btnBack').click(function(){
    window.location.replace('adminPage.html');
    window.sessionStorage.removeItem('prog_id');
});


//-------------------------------------------------- update programme --------------------------------------------------//
$("#formUptProgramme").on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Programme",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let pk_id = $("#pk_id").val();
            let upt_fac_id = $("#upt_fac_id").val();
            let upt_pgm_category = $("#upt_pgm_category").val();
            let upt_pgm_area = $("#upt_pgm_area").val();
            let upt_pgm_name = $("#upt_pgm_name").val();
            let upt_pgm_mode = $("#upt_pgm_mode").val();
            let upt_pgm_mqflevel = $("#upt_pgm_mqflevel").val();
            let upt_pgm_duration = $("#upt_pgm_duration").val();
            let upt_tuition_fee = $("#upt_tuition_fee").val();
            let upt_pgm_status = $("#upt_pgm_status").val();

            var form = new FormData();
            form.append("pk_id", pk_id);
            form.append("fac_id", upt_fac_id);
            form.append("pgm_category", upt_pgm_category);
            form.append("pgm_area", upt_pgm_area);
            form.append("pgm_name", upt_pgm_name);
            form.append("pgm_mode", upt_pgm_mode);
            form.append("pgm_mqflevel", upt_pgm_mqflevel);
            form.append("pgm_duration", upt_pgm_duration);
            form.append("pgm_fee", upt_tuition_fee);
            form.append("pgm_status", upt_pgm_status);
            form.append("recordstatus", 'EDT');

            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmProg/update",
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
//-------------------------------------------------- end update programme --------------------------------------------------//


// delete programme
$('#btnDelete').click(function (){
    let id = $('#pk_id').val();

    var form = new FormData();
    form.append("pk_id", id);
    form.append("recordstatus", "DEL");

    swal({
        title: "Remove Programme",
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
            "url": host+"api_tetapan_picoms/public/misPrmProg/delete",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };

        $.ajax(settings).done(function (response){
            result = JSON.parse(response);
            if (response.success == false) {
                swal(result.message, result.data, "error");
                return;
            }
            window.location.replace('adminPage.html');
        });
    });    
});


//-------------------------------------------------- save programme details --------------------------------------------------//
var RegisterModelDetail = function (){
    var self = this;
    // self.pgm_idt2 = ko.observable("");

    self.dtp_intake = ko.observable("");

    // self.dtp_sem = ko.observable("").extend({
    //     required: true
    // });

    self.dtp_year = ko.observable("").extend({
        required: true
    });

    self.regDetProgramme = function () {

        let pgm_id = $('#pk_id').val();
        var error = ko.validation.group(self);

        if (error().length > 0) {
            error.showAllMessages();
            return;
        }

        var form = new FormData();
        form.append("pgm_id", pgm_id);
        form.append("dtp_year", self.dtp_year().replace('-','/'));
        form.append("dtp_intake", self.dtp_intake());
        // form.append("dtp_sem", self.dtp_sem());
        form.append("recordstatus", 'ADD');

        swal({
            title: "Add Programme Details",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            var settings = {
                "url": host+"api_tetapan_picoms/public/addProgrammedet",
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
const RegisterdetProgram = document.querySelector("#reg-perProgram");
ko.applyBindings(new RegisterModelDetail(), RegisterdetProgram);
//-------------------------------------------------- end save programme details --------------------------------------------------//


function loadDataDetail(indexs){
    let data = JSON.parse($("#dataDetailList").val());
    let curYear = data[indexs].dtp_year.replace('/','-');
    
    $('#pgmDet_id').val(data[indexs].dtp_id);
    $('#upt_dtp_year').val(curYear);

    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmCuryear/opt_intake/"+curYear,
        "method": "GET",
        "timeout": 0,
    };
      
    $.ajax(settings).done(function (response) {
        obj_cohort = response;

        $.each(obj_cohort.data,function(i,field){
            $("#upt_dtp_intake").append('<option value="'+field.cur_intake+'" >'+field.cur_intake+'</option>');
        });
        $('#upt_dtp_intake').val(data[indexs].dtp_intake);
    });

    $("#update-per-program").modal("show");
}


//-------------------------------------------------- update programme details --------------------------------------------------//
$("#formUptDetail").on('submit', function (e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Programme Details",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let pk_id = $("#pgmDet_id").val();
            let upt_dtp_year = $("#upt_dtp_year").val();
            let upt_dtp_intake = $("#upt_dtp_intake").val();
            // let upt_dtp_sem = $("#upt_dtp_sem").val();

            var form = new FormData();
            form.append("dtp_id", pk_id);
            form.append("dtp_year", upt_dtp_year.replace('-','/'));
            form.append("dtp_intake", upt_dtp_intake);
            // form.append("dtp_sem", upt_dtp_sem);
            form.append("recordstatus", "EDT");

            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmProgDet/update",
                "method": "POST",
                "timeout": 0,
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
//-------------------------------------------------- end update programme details --------------------------------------------------//


// delete details
function del_rekod(id){
    let statusrekod = 'DEL';
    let dtp_id = id;

    var form = new FormData();
    form.append("recordstatus", statusrekod);
    form.append("dtp_id", dtp_id);

    swal({
        title: "Remove Programme Details",
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
            "url": host+"api_tetapan_picoms/public/misPrmProgDet/delete",
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


function dataProgram(id, returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmProg/show/"+id,
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        data = response.data;
        returnValue();
    });
}

function facList(id, returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmFaculty/listByCampus/"+id,
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_faculty = response;
        returnValue();
    });
}

function levelStudy(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/categoryList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_levelStudy = response;
        returnValue();
    });
}

function fieldStudy(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/acaareaList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_fieldStudy = response;
        returnValue();
    });
}

function modeStudy(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/modeList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_modeStudy = response;
        returnValue();
    });
}

function mqfLevel(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/mqflevelList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_mqfLevel = response;
        returnValue();
    });
}

function sttsPgm(returnValue){
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

function detailsList(id, returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmProgDet/list/"+id,
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        // let result = JSON.parse(response);
        obj_detList = response.data;
        returnValue();
    });
}

function listAcaSession(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmCuryear/opt_curYear",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        // LIST OPTION UPDATE
        obj_session = response;
        returnValue();
    });
}

// function acaSession(selObj){
//     let obj = selObj.value;

//     var settings = {
//         "url": host+"api_tetapan_picoms/public/misPrmCuryear/opt_intake/"+obj,
//         "method": "GET",
//         "timeout": 0,
//     };

//     $.ajax(settings).done(function (response) {
//         $('#dtp_intake').append('<option value="">- Choose -</option>');
//         $.each(response.data, function (i, item) {
//             $('#dtp_intake').append('<option value="'+item.cur_intake+'">'+item.cur_intake+'</option>');
//         });
//     });
// }

// function acaSessionUpt(selObj){
//     let obj = selObj.value;

//     var settings = {
//         "url": host+"api_tetapan_picoms/public/misPrmCuryear/opt_intake/"+obj,
//         "method": "GET",
//         "timeout": 0,
//     };

//     $.ajax(settings).done(function (response) {
//         $('#upt_dtp_intake').append('<option value="">- Choose -</option>');
//         $.each(response.data, function (i, item) {
//             $('#upt_dtp_intake').append('<option value="'+item.cur_intake+'">'+item.cur_intake+'</option>');
//         });
//     });
// }

// onchange select Academic Session
$("#dtp_year").change(function(){
    $("#dtp_intake").html('<option value="">- Choose -</option>');
    currentYear = $("#dtp_year").val();
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmCuryear/opt_intake/"+currentYear,
        "method": "GET",
        "timeout": 0,
    };
      
    $.ajax(settings).done(function (response) {
        obj_cohort = response;

        $.each(obj_cohort.data,function(i,field){
            $("#dtp_intake").append('<option value="'+field.cur_intake+'" >'+field.cur_intake+'</option>');
        });
    });    
});


// onchange select Academic Session update
$("#upt_dtp_year").change(function(){
    $("#dtp_intake").html('<option value="">- Choose -</option>');
    currentYear = $("#upt_dtp_year").val();
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmCuryear/opt_intake/"+currentYear,
        "method": "GET",
        "timeout": 0,
    };
      
    $.ajax(settings).done(function (response) {
        obj_cohort = response;

        $.each(obj_cohort.data,function(i,field){
            $("#upt_dtp_intake").append('<option value="'+field.cur_intake+'" >'+field.cur_intake+'</option>');
        });
    });    
});