let usrRole = window.sessionStorage.usrRole;
let catAdmin = window.sessionStorage.usrCatEadmin;
let catCMS = window.sessionStorage.usrCatEcmis;



$(function(){
    $.ajaxSetup ({
        cache: false
    });

    $.fn.select2.defaults.set("theme", "bootstrap");

    let pgmDet_id = window.sessionStorage.pgmDet_id;
    let clg_id = window.sessionStorage.idPage;
    let usrRole = window.sessionStorage.usrRole;
    let empPosition = window.sessionStorage.empPosition;

    // if( usrRole == 'pensyarah' ){ $('.divSem').hide(); }

    if (usrRole == 'pensyarah') {
        if (empPosition !== 'COOR' && empPosition !== 'HOP') {
            $('.divSem').hide();
        }
    }

    $("#tblCourse").html('');
    // data program
    cotDetails(pgmDet_id, function () {
        $('#dtp_year').html(data.cal_year.replace('/', '') + '/' + data.cal_cohort);
        $('#dtp_intake').html(data.intake_month + '-' + data.intake_year);
        $('#programme').html(data.pgm_code + ' - ' + data.pgm_name)
        $('#crsName').html(data.pgm_name);
        $('#pgm_acaCal').html(data.category);
        $('#pk_id').val(data.dtp_id);

        // select Academic Calendar
        calByCategory(data.pgm_area, function () {
            $('#aca_calendar').append('<option value="">- Choose -</option>');
            let names = "";
            $.each(obj_kalendar.data, function (i, item) {
                let year = item.cur_year.replace('/', '');
                if (names != year + '/' + item.cal_cohort) {
                    $('#aca_calendar').append('<option value="' + item.cal_id + '">' + year + '/' + item.cal_cohort + '</option>');
                    names = year + '/' + item.cal_cohort;
                }
            });

            $('.slct2').select2({
                width: null,
                containerCssClass: ':all:',
            });
        });
    });

    // select faculty
    facCamList(clg_id, function () {
        $('#fac_id').append('<option value="">- Choose -</option>');
        $('#upt_fac_id').append('<option value="">- Choose -</option>');
        $.each(obj_facCampus.data, function (i, item) {
            $('#fac_id').append('<option value="' + item.facCamId + '">' + item.facCode + '</option>');
            $('#upt_fac_id').append('<option value="' + item.facCamId + '">' + item.facCode + '</option>');
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:',
        });
    });

    // select course type
    courseType(function () {
        $('#crs_type').append('<option value="">- Choose -</option>');
        $.each(obj_crsType.data, function (i, item) {
            $('#crs_type').append('<option value="' + item.crs_type_name + '">' + item.crs_type_name + '</option>');
        });

        $('#upt_crs_type').append('<option value="">- Choose -</option>');
        $.each(obj_crsType.data, function (i, item) {
            $('#upt_crs_type').append('<option value="' + item.crs_type_name + '">' + item.crs_type_name + '</option>');
        });
    });

    // select semester type
    viewCredit(function () {
        $('#sem_type').append('<option value="">- Choose -</option>');
        $.each(obj_minMaxCredit.data, function (i, item) {
            $('#sem_type').append('<option value="' + item.crd_id + '" class="text-uppercase">' + item.sem_type_name + ' - ' + item.mode_name + '</option>');
        });
    });

    // select lecturer
    lecturerList(function () {
        $('#cot_det_lect').append('<option value="">- Choose -</option>');
        $.each(obj_lecturer.data, function (i, item) {
            $('#cot_det_lect').append('<option value="' + item.emp_id + '">' + item.emp_name.toUpperCase() + '</option>');
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:',
        });
    });

    // semester list for tab
    getSemester(pgmDet_id, function () {
        $('#cot_semester').append('<option value="">- Choose -</option>');
        $('#cot_semester_upt').append('<option value="">- Choose -</option>');

        $('#navTabs').html('');
        $('#tabContent').html('');

        $.each(obj_semList.data, function (i, item) {
            $('#cot_semester').append('<option value="' + item.pk_id + '">' + item.pgm_semester + '</option>');
            $('#cot_semester_upt').append('<option value="' + item.pk_id + '">' + item.pgm_semester + '</option>');

            let semester = item.pgm_semester;
            let pk_sem = item.pk_id;
            let activeTab = '';
            let dataSem = JSON.stringify(obj_semList.data);
            $("#dataSem").val(dataSem);

            if (i == 0) { activeTab = 'active' }
            let tab = '<li class="nav-item">' +
                '<a class="nav-link ' + activeTab + '" href="#" data-toggle="tab" data-target="#tabsem' + semester + '" onclick="loadSem(\'' + i + '\',\'' + usrRole + '\')">Semester ' + semester + '</a>' +
                '</li>';
            $('#navTabs').append(tab);

            let tabContent = '<div class="tab-pane animated fadeIn text-muted ' + activeTab + '" id="tabsem' + semester + '">' +
                '<textarea class="hidden" id="dataList' + pk_sem + '"></textarea>' +
                '<table class="table m-b-0 table-striped" id="tblCourse' + pk_sem + '"></table>' +
                '</div>';
            $('#tabContent').append(tabContent);

            $("#tblCourse" + semester).html('');

            // Course list
            cotDetList(pgmDet_id, pk_sem, function () {
                createTblCrs(obj_cotDetList, pk_sem);
            });
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:',
        });
    });
});
var confirmed = false;


// btn Back to admin page
$('#btnBack').click(function () {
    window.location.replace('adminPage.html');
    window.sessionStorage.removeItem('pgmDet_id');
});


//-------------------------------------------------- add semester --------------------------------------------------//
$("#formAddSem").on('submit', function (e) {
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Add Semester",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let pgm_id = $("#pk_id").val();
            let pgm_semester = $("#pgm_semester").val();
            let sem_type = $('#sem_type').val();
            let aca_session = $('#aca_calendar').val();

            var form = new FormData();
            form.append("fk_pgm_det", pgm_id);
            form.append("pgm_semester", pgm_semester);
            form.append("sem_type", sem_type);
            form.append("aca_session", aca_session);
            form.append("recordstatus", "ADD");

            var settings = {
                "url": host + "api_tetapan_picoms/public/misPrmCOTSem/register",
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
//-------------------------------------------------- end add semester --------------------------------------------------//


//-------------------------------------------------- update semester --------------------------------------------------//
$("#divSemester").on('submit', '#formUptSem', function (e) {
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Update Semester",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let pk_id = $("#pk_sem").val();
            let pgm_semester = $("#pgm_semester").val();
            let sem_type = $('#sem_type').val();
            let aca_session = $('#aca_calendar').val();

            var form = new FormData();
            form.append("pk_id", pk_id);
            form.append("pgm_semester", pgm_semester);
            form.append("sem_type", sem_type);
            form.append("aca_session", aca_session);
            form.append("recordstatus", "EDT");

            var settings = {
                "url": host + "api_tetapan_picoms/public/misPrmCOTSem/update",
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
//-------------------------------------------------- end update semester --------------------------------------------------//


//-------------------------------------------------- add details --------------------------------------------------//
$("#formAddDetails").on('submit', function (e) {
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Add Course",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let pgm_id = $("#pk_id").val();
            let fk_course = $("#crs_code").val();
            let fk_semester = $("#cot_semester").val();
            let crs_type = $('#crs_type').val();
            // if($('#in_progress').prop('checked') == true)
            // {
            //     in_progress = 'No'; 
            // }
            // else{
            //     in_progress = 'Yes'; 
            // }

            var form = new FormData();
            form.append("fk_pgm_det", pgm_id);
            form.append("fk_course", fk_course);
            form.append("fk_semester", fk_semester);
            form.append("crs_type", crs_type);
            // form.append("in_progress", in_progress);
            form.append("recordstatus", "ADD");

            var settings = {
                "url": host + "api_tetapan_picoms/public/misPrmCrsCOTDet/register",
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
//-------------------------------------------------- end add details --------------------------------------------------//


//-------------------------------------------------- load update data --------------------------------------------------//
function loadData(sem, indexs) {
    let data = JSON.parse($("#dataList" + sem).val());
    let value = data[indexs];
    load_capaian();

    $('#ccd_id').val(value.ccd_id);
    $('#cot_semester_upt').val(value.fk_semester);
    $('#upt_crs_type').val(value.crs_type);
    // $('#upt_in_progress').val(value.upt_in_progress);

    getCourseCountedStatus(value.fk_course, function () {

            // console.log(obj_courseCounted.data);

        item = obj_courseCounted.data;

        counted_cgpa = item.counted_cgpa;
        // console.log(counted_cgpa);

        // $('#in_progress').html('');
        // $('#crs_code').append('<option value="">- Choose -</option>');
        if (counted_cgpa == 'Yes') {
            $('#upt_in_progress').html('');
            $('#upt_in_progress').prop('checked', false);
            // $('#in_progress').prop('checked') == true;
        }
        else {
            $('#upt_in_progress').html('');
            $('#upt_in_progress').prop('checked', true);
        }

    });


    courseShow(value.fk_course, function () {
        let fk_fac = obj_crsShow.data.fk_fac;
        courseList(fk_fac, function () {
            $('#crs_code_upt').html('');
            $('#crs_code_upt').append('<option value="">- Choose -</option>');
            $.each(obj_course.data, function (i, item) {
                $('#crs_code_upt').append('<option value="' + item.pk_crs + '">' + item.crs_code.toUpperCase() + ' - ' + item.crs_name.toUpperCase() + '</option>');
            });
            $('#crs_code_upt').val(value.fk_course);

            $('.slct2').select2({
                width: null,
                containerCssClass: ':all:',
            });
        });
    })

    // list pre-requisite course
    preReqList(value.fk_course, function () {
        let dataLength = obj_preReqList.data.length;
        $('#divPreReqCrsList').addClass('collapse');

        if (dataLength > 0) {
            var columns = [
                { "name": "bil", "title": "No." },
                { "name": "crs_code", "title": "Course" },
                { "name": "crs_credit", "title": "Credit" }
            ];

            let bil = 1;
            var list = [];

            $.each(obj_preReqList.data, function (i, item) {
                list.push({
                    bil: bil++, crs_code: '<span class="text-uppercase"><b>' + item.crs_code + '</b><br>' + item.crs_name + '</span>', crs_credit: item.crs_credit
                });
            });

            $("#tblPreReqCrs").footable({
                "columns": columns,
                "rows": list,
                "paging": {
                    "enabled": true,
                    "size": 5,
                    "countFormat": "Showing {PF} to {PL} of {TR} data"
                },
                "filtering": {
                    "enabled": true,
                    "placeholder": "Search...",
                    "dropdownTitle": "Search for:"
                }
            });

            $('#divPreReqCrsList').removeClass('collapse');
        }
    });

    $('#crs_code_upt').addClass('collapse');
    $("#updatePerincian").modal("show");
}
//-------------------------------------------------- end load update data --------------------------------------------------//


//-------------------------------------------------- update details --------------------------------------------------//
$("#formUpdateDetails").on('submit', function (e) {
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Update Course",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let ccd_id = $("#ccd_id").val();
            let crs_code = $("#crs_code_upt").val(); console.log('update');
            let fk_semester = $("#cot_semester_upt").val();
            let crs_type = $("#upt_crs_type").val();

            // if($('#upt_in_progress').prop('checked') == true)
            // {
            //     in_progress = 'No'; 
            // }
            // else{
            //     in_progress = 'Yes'; 
            // }

            var form = new FormData();
            form.append("ccd_id", ccd_id);
            form.append("fk_course", crs_code);
            form.append("fk_semester", fk_semester);
            form.append("crs_type", crs_type);
            form.append("recordstatus", "EDT");
            // form.append("in_progress", in_progress);

            var settings = {
                "url": host + "api_tetapan_picoms/public/misPrmCrsCOTDet/update",
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
//-------------------------------------------------- end update details --------------------------------------------------//


//-------------------------------------------------- delete Course --------------------------------------------------//
function del(id) {
    chkCotDetReg(id, function () {
        let count = obj_regCrs.data.length;
        if (count == 0) {
            var form = new FormData();
            form.append("recordstatus", 'DEL');
            form.append("ccd_id", id);

            swal({
                title: "Remove Course",
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
                    "url": host + "api_tetapan_picoms/public/misPrmCrsCOTDet/delete",
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
        else {
            swal({
                text: "Students have registered for the course.",
                type: "info"
            });
        }
    });
}
//-------------------------------------------------- end delete Course --------------------------------------------------//


//-------------------------------------------------- delete Sem --------------------------------------------------//
function delSem(id) {
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("pk_id", id);

    swal({
        title: "Remove Sem",
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
            "url": host + "api_tetapan_picoms/public/misPrmCOTSem/delete",
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
//-------------------------------------------------- end delete Sem --------------------------------------------------//


//-------------------------------------------------- onchange select faculty --------------------------------------------------//
function getCourse(data) {
    let facId = data.value;
    // console.log(facId);

    $('#ccd_prerequisite_crs').html('');
    $('#ccd_prerequisite_crs').attr('disabled', true);
    $('#ccd_prerequisite_crs').append('<option value="">- No data -</option>');
    $('#ccd_prerequisite').attr('disabled', true);
    $('#ccd_prerequisite').val('No').trigger('change');

    // select course
    courseList(facId, function () {
        $('#crs_code').html('');
        $('#crs_code').append('<option value="">- Choose -</option>');
        $.each(obj_course.data, function (i, item) {
            $('#crs_code').append('<option value="' + item.pk_crs + '">' + item.crs_code.toUpperCase() + ' - ' + item.crs_name.toUpperCase() + '</option>');
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:',
        });
    });
}

function getCourseUpt(data) {
    let facId = data.value;
    $('#crs_code').html('');
    $('#ccd_prerequisite_crs').html('');
    $('#ccd_prerequisite_crs').attr('disabled', true);
    $('#ccd_prerequisite_crs').append('<option value="">- No data -</option>');
    $('#ccd_prerequisite').attr('disabled', true);
    $('#ccd_prerequisite').val('No').trigger('change');

    // select course
    courseList(facId, function () {
        $('#crs_code_upt').html('');
        $('#crs_code_upt').append('<option value="">- Choose -</option>');
        $.each(obj_course.data, function (i, item) {
            $('#crs_code_upt').append('<option value="' + item.pk_crs + '">' + item.crs_code.toUpperCase() + ' - ' + item.crs_name.toUpperCase() + '</option>');
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:',
        });
    });
}


//-------------------------------------------------- onchange select faculty --------------------------------------------------//


//-------------------------------------------------- onchange select Course --------------------------------------------------//

function getCourseCounted(data) {
    let pk_crs = data.value;


    // $('#ccd_prerequisite_crs').html('');
    // $('#ccd_prerequisite_crs').attr('disabled',true);
    // $('#ccd_prerequisite_crs').append('<option value="">- No data -</option>');
    // $('#ccd_prerequisite').attr('disabled',true);
    // $('#ccd_prerequisite').val('No').trigger('change');

    // select course
    getCourseCountedStatus(pk_crs, function () {


        item = obj_courseCounted.data;

        counted_cgpa = item.counted_cgpa;

        // $('#in_progress').html('');
        // $('#crs_code').append('<option value="">- Choose -</option>');
        if (counted_cgpa == 'Yes') {
            $('#in_progress').html('');
            $('#in_progress').prop('checked', false);
            // $('#in_progress').prop('checked') == true;
        }
        else {
            $('#in_progress').html('');
            $('#in_progress').prop('checked', true);
        }

    });

}




//-------------------------------------------------- onchange select Course --------------------------------------------------//

//-------------------------------------------------- form Semester --------------------------------------------------//
// form update
function loadSem(indexs, role) {
    let data = JSON.parse($("#dataSem").val());
    let value = data[indexs];
    let id = value.pk_id;

    // capaianCot = load_capaian();

    load_capaian();
    capaianCot = window.capaianData;
    // console.log(capaianCot);
    let addCot = capaianCot[0];
    let uptCot = capaianCot[1];
    let delCot = capaianCot[2];

    // console.log(addCot);
    // console.log(uptCot);
    // console.log(delCot);

    if (addCot == 0){
        cotAddDisabled = 'disabled';
    }
    else{
        cotAddDisabled = ''; 
    }

    if (uptCot == 0){
        cotUpdateDisabled = 'disabled';
    }
    else{
        cotUpdateDisabled = ''; 
    }


    if (delCot == 0){
        cotDelDisabled = 'disabled';
    }
    else{
        cotDelDisabled = ''; 
    }

    // if( catAdmin == 1 ){
        $('#divBtn').html('  <button type="button" class="btn danger p-x-md " '+cotDelDisabled+' onclick="delSem(\'' + id + '\')">Delete</button> '+
                            '<button type="submit" class="btn success p-x-md " '+cotUpdateDisabled+'>Update</button>');
    // }
    // else if( catCMS == 1 ){
    //     if( role == 'dekan' || role == 'ketuaPJ' ){
    //         $('#divBtn').html('<button type="submit" class="btn success p-x-md btn_update_sc_courseOffer" >Update</button>');
    //     }
    // }

    $('#pk_sem').val(id);
    $('#pgm_semester').val(value.pgm_semester);
    $('#sem_type').val(value.sem_type);
    $('#aca_calendar').val(value.aca_session).trigger('change');
    $('.formSem').attr('id', 'formUptSem');
}

// form new
$('#newSemester').click(function () {
    $('.formSem').attr('id', 'formAddSem');
    $('#pk_sem').val('');
    $('#aca_calendar').val('').trigger('change');
    $('.formSem')[0].reset();
    $('#divBtn').html('<button type="submit" class="btn info p-x-md btn_create_sc_courseOffer">Save</button>');
});
//-------------------------------------------------- end form Semester --------------------------------------------------//


// modal lecturer list
function lectList(id, crs) {
    $('#cotDet_id').val(id);
    $('#crsId').val(crs);
    getLect(id, function () {
        let dataLect = obj_lect.data;
        tblLect(dataLect);
    });

    $('#mdlLecturer').modal('show');
}


//-------------------------------------------------- add Lecturer --------------------------------------------------//
$("#formAddLect").on('submit', function (e) {
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Save Lecturer",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let fk_cotDet = $("#cotDet_id").val();
            let crs_code = $("#crsId").val();
            let emp_id = $("#cot_det_lect").val();
            let coordinator = '';
            if ($('#coordinator').prop('checked') == true) { coordinator = 'Yes'; }
            else { coordinator = 'No' }

            var form = new FormData();
            form.append("fk_cotDet", fk_cotDet);
            form.append("crs_code", crs_code);
            form.append("emp_id", emp_id);
            form.append("coordinator", coordinator);
            form.append("recordstatus", "ADD");

            var settings = {
                "url": host + "api_lecturer_picoms/public/misLectCrsPrm/register",
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
                    getLect(fk_cotDet, function () {
                        let dataLect = obj_lect.data;
                        tblLect(dataLect);
                    });
                    // $('.formLect')[0].reset();
                    $('#cot_det_lect').val('').trigger('change');
                }
            });
        });
    }
});
//-------------------------------------------------- end add Lecturer --------------------------------------------------//


//-------------------------------------------------- update Lecturer --------------------------------------------------//
function lectCoor(id) {
    if (!confirmed) {
        swal({
            title: "Update Lecturer",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let fk_cotDet = $("#cotDet_id").val();
            let coordinator = '';
            if ($('#lect_' + id).prop('checked')) { coordinator = 'Yes'; }
            else { coordinator = 'No' }
            var form = new FormData();
            form.append("pk_id", id);
            form.append("coordinator", coordinator);
            form.append("recordstatus", "EDT");

            // var settings = {
            //     "url": host+"api_lecturer_picoms/public/misLectCrsPrm/update",
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


            let objUpdateLectPrm = new post(host + 'api_lecturer_picoms/public/misLectCrsPrm/update', form, 'picoms ' + window.sessionStorage.token).execute();
            if (objUpdateLectPrm.success) {
                getLect(fk_cotDet, function () {
                    let dataLect = obj_lect.data;
                    tblLect(dataLect);
                });
                resetLect();

            
            } else {
                Swal(result.message, result.data, "error");
                return;
            }

            // $.ajax(settings).done(function (response){
            //     result = JSON.parse(response);
            //     if (!result.success) {
            //         Swal(result.message, result.data, "error");
            //         return;
            //     }
            //     else{
            //         getLect(fk_cotDet, function(){
            //             let dataLect = obj_lect.data;
            //             tblLect(dataLect);
            //         });
            //         resetLect();
            //     }
            // });
        });
    }
}
//-------------------------------------------------- end update Lecturer --------------------------------------------------//


//-------------------------------------------------- delete Lecturer --------------------------------------------------//
function delLect(id) {
    let fk_cotDet = $("#cotDet_id").val();
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("pk_id", id);
    swal({
        title: "Remove Lecturer",
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
            "url": host + "api_lecturer_picoms/public/misLectCrsPrm/delete",
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
                getLect(fk_cotDet, function () {
                    let dataLect = obj_lect.data;
                    tblLect(dataLect);
                });
            }
        });
    });
}
//-------------------------------------------------- end delete Lecturer --------------------------------------------------//


//-------------------------------------------------- create table Lecturer --------------------------------------------------//
function tblLect(data) {
    var columns = [
        { "name": "bil", "title": "No." },
        { "name": "emp_id", "title": "Lecturer" },
        { "name": "coordinator", "title": "Coordinator" },
        { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
    ];

    let bil = 1;
    var list = [];
    let convertList = JSON.stringify(data);
    $("#dataLect").val(convertList);

    $.each(data, function (i, item) {
        let coor = item.coordinator;
        let icon = ''
        let display = ''; let dsplyHODP = '';

        if (coor == 'Yes') { icon = 'checked' }

        if (usrRole == 'pensyarah') { display = 'disabled' }
        else if (usrRole == 'dekan' || usrRole == 'ketuaPJ') { dsplyHODP = 'disabled' }



        list.push({
            bil: bil++, emp_id: '<span class="text-uppercase">' + item.emp_name + '</span>',
            coordinator: '<label class="ui-switch data-ui-switch-md success m-t-xs">' +
                '<input type="checkbox" id="lect_' + item.lectCrsId + '" onclick="lectCoor(' + item.lectCrsId + ')" ' + icon + ' ' + display + '>' +
                '<i></i>' +
                '</label>',
            upt_btn: '<button type="button" class="btn btn-sm md-flat" title="Remove" onclick="delLect(\'' + item.lectCrsId + '\')" ' + display + ' ' + dsplyHODP + '><i class="ion-trash-b" style="color: #ef193c"></i></button>'
        });
    });

    $("#tblLecturer").html('')
    $("#tblLecturer").footable({
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
}
//-------------------------------------------------- end create table Lecturer --------------------------------------------------//


function resetLect() {
    $('#lectCrsId').val('');
    // $('.formLect')[0].reset();
    $('#cot_det_lect').val('').trigger('change');
    $('#slctLect').show();
    $('#view_lecturer').hide();
}

// reset form lecturer
$('#btnReset').click(function () { resetLect(); });


//-------------------------------------------------- onchange --------------------------------------------------//
$('#cot_det_lect').change(function () {
    let lect = $(this).val();
    let fk_cotDet = $("#cotDet_id").val();

    chkLectCot(lect, fk_cotDet, function () {
        let count = obj_lectCrs.data.length;
        if (count != 0) {
            $('#cot_det_lect').val('').trigger('change');
            swal({
                text: "Lecturer have been added.",
                type: "info"
            });
        }
    });
});


// check if sem exist
$('#pgm_semester').on('change', function () {
    let sem = $(this).val();
    let pgmDet = $('#pk_id').val();

    chkSemCot(pgmDet, sem, function () {
        let total = obj_cotSem.data.length;
        if (total > 0) {
            $('#pgm_semester').val('');
            swal({
                text: "Data Already Exist.",
                type: "info"
            });
        }
    });
});
//-------------------------------------------------- end onchange --------------------------------------------------//


//-------------------------------------------------- create table course --------------------------------------------------//
function createTblCrs(data, semester){

    // capaianCot = load_capaian();

    load_capaian();
    capaianCot = window.capaianData;
    // let addCot = capaianCot[0];
    let uptCot = capaianCot[1];
    let delCot = capaianCot[2];
    // console.log()

    if (uptCot == 0){
        cotUpdateDisabled = 'disabled';
    }
    else{
        cotUpdateDisabled = ''; 
    }

    if (delCot == 0){
        cotDelDisabled = 'disabled';
    }
    else{
        cotDelDisabled = ''; 
    }


    var columns = [
        { "name": "bil", "title": "No." },
        { "name": "fk_course", "title": "Course" },
        { "name": "crs_credit", "title": "Credit" },
        { "name": "cot_semester", "title": "Semester" },
        { "name": "crs_type", "title": "Course Classification", "breakpoints": "md sm xs" },
        { "name": "status", "title": "Status", "breakpoints": "md sm xs" },
        { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
    ];

    let bil = 1;
    let convertList = JSON.stringify(data);
    // console.log(convertList);
    $("#dataList" + semester).val(convertList);
    var list = [];

    
    $.each(data, function (j, itemJ){
        let status = itemJ.sttsCotDet;
        let lblStts = '';
        let display = '';

        if (status == 'ADD') { lblStts = '<span class="label info">New</span>' }
        else if (status == 'EDT') { lblStts = '<span class="label success">Updated</span>' }

        if (usrRole == 'dekan' || usrRole == 'pensyarah') { display = 'disabled' }

        list.push({
            bil: bil++,
            fk_course: '<span onclick="modalMapping(' + itemJ.fk_course + ')" class="text-uppercase" style="color: #009688;">' + itemJ.crs_code + ' - ' + itemJ.crs_name + '</span>',
            crs_credit: itemJ.crs_credit,
            cot_semester: itemJ.pgm_semester,
            crs_type: '<span class="text-uppercase">' + itemJ.crs_type + '</span>',
            status: lblStts,
            upt_btn: '<button class="btn btn-icon success " '+cotUpdateDisabled+' title="Update" onclick="loadData(\'' + semester + '\',\'' + j + '\')"><i class="ion-android-create"></i></button>'+
                    ' <button class="btn btn-icon accent" title="Lecturer"  onclick="lectList(\'' + itemJ.ccd_id + '\',\'' + itemJ.fk_course + '\')"><i class="ion-ios-people"></i></button>'+
                    ' <button class="btn btn-icon danger "  '+cotDelDisabled+' title="Remove" onclick="del(\'' + itemJ.ccd_id + '\')" '+display+'><i class="ion-trash-b"></i></button>'
        });
    });

    $("#tblCourse" + semester).html('');
    $("#tblCourse" + semester).footable({
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
}
//-------------------------------------------------- end create table course --------------------------------------------------//


function courseType(returnValue) {
    var settings = {
        "url": host + "api_tetapan_picoms/public/coursetypeList",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_crsType = response;
        returnValue();
    });
}

function preReqList(id, returnValue) {
    var settings = {
        "url": host + "api_tetapan_picoms/public/misPrmCourseDet/list/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_preReqList = response;
        returnValue();
    });
}

function courseList(id, returnValue) {
    var settings = {
        "url": host + "api_tetapan_picoms/public/misPrmCourse/selectCrs/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_course = response;
        returnValue();
    });
}

function getCourseCountedStatus(id, returnValue) {
    var settings = {
        "url": host + "api_tetapan_picoms/public/misPrmCourse/selectCrsCounted/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_courseCounted = response;
        returnValue();
    });
}

function getSemester(id, returnValue) {
    var settings = {
        "url": host + "api_tetapan_picoms/public/misPrmCOTSem/listByPgmdet/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_semList = response;
        returnValue();
    });
}

function getLect(id, returnValue) {
    var settings = {
        "url": host + "api_lecturer_picoms/public/misLectCrsPrm/listByCotDet/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_lect = response;
        returnValue();
    });
}

function chkCotDetReg(id, returnValue) {
    var settings = {
        "url": host + "api_pengurusan_pelajar/public/misStdRegsub/listByCotDet/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_regCrs = response;
        returnValue();
    });
}

function chkLectCot(lect, cotDet, returnValue) {
    var form = new FormData();
    form.append("emp_id", lect);
    form.append("fk_cotDet", cotDet);

    var settings = {
        "url": host + "api_lecturer_picoms/public/misLectCrsPrm/findId",
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
        obj_lectCrs = JSON.parse(response);
        returnValue();
    });
}

function chkSemCot(pgmDet, sem, returnValue) {
    var form = new FormData();
    form.append("fk_pgm_det", pgmDet);
    form.append("pgm_semester", sem);

    var settings = {
        "url": host + "api_tetapan_picoms/public/misPrmCOTSem/chkExist",
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
        obj_cotSem = JSON.parse(response);
        returnValue();
    });
}

function CLODetail(fk_course, returnValue) {

    var form = new FormData();
    form.append("FK_course", fk_course);
    var settings = {
        "url": host + "api_tetapan_picoms/public/obe/clo_ByCourse/showCourseDet",
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
    //
    $.ajax(settings).done(function (response) {
        result = JSON.parse(response);
        if (result.data != '') {
            var columns = [
                { "name": "CLO", "title": "CLO" },
                { "name": "SLT_CI", "title": "SLT CI" },
                { "name": "A_contact_perHour", "title": "% (A)" },
                { "name": "assesment_weightage", "title": "Weightage" },
                { "name": "SLT_Assessment", "title": "SLT Assessment" },
                { "name": "B_totalHourSLT", "title": "% (B)" },
                { "name": "ab", "title": "A-B %" },
            ];

            var list2 = [];
            let bil = 1;
            let convertCLOcourse = JSON.stringify(result.data);
            $("#ListCLODetail").val(convertCLOcourse);

            $.each(result.data, function (index, value) {
                list2.push({
                    CLO: value.clo_level,
                    SLT_CI: '',
                    A_contact_perHour: '',
                    assesment_weightage: '',
                    SLT_Assessment: '',
                    B_totalHourSLT: '',
                    ab: '',
                });
            });


            $("#detailCLO").footable({
                "columns": columns,
                "rows": list2,
                "paging": {
                    "enabled": true,
                    "size": 10,
                    "countFormat": "Showing {PF} to {PL} of {TR} data"
                },

            });

        }
        else {

        }

        returnValue();
    });
}
function obeList(returnValue) {
    let form = new FormData();
    form.append('pgmDet_id', window.sessionStorage.pgmDet_id);
    var settings = {
        "url": host + "api_tetapan_picoms/public/misprmobe/showByPgmDet",
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
        obj_obeList = JSON.parse(response).data;
        returnValue();

    });
}

function findDataMapping(fk_course, returnValue) {
    let form1 = new FormData();
    form1.append('FK_course', fk_course);
    form1.append('pgmDet_id', window.sessionStorage.pgmDet_id);

    var settings = {
        "url": host + "api_tetapan_picoms/public/generateObe/find",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form1
    };

    $.ajax(settings).done(function (response) {
        obj_MapList = JSON.parse(response);

        returnValue();

    });
}

function modalMapping(fk_course) {

    $('#modalMapping').modal("show");
    // $('#modalMapping').html('');


    $('#fk_course').val(fk_course);
    $('#id_obe_plo_generate').val('');
    let list_checked = [];


    findDataMapping(fk_course, function () {
        if (obj_MapList.success) {
            // $.each(obj_MapList.data,function(v,vitem){
            $('#id_obe_plo_generate').val(obj_MapList.data.id_obe_plo_generate);

            // let FK_plo = obj_MapList.data.FK_plo;
            let FK_clo = JSON.parse(obj_MapList.data.FK_clo);

                if(FK_clo.length > 0){
                    $.each(FK_clo,function(c,citem){
                        list_checked.push(citem);
                        // console.log(citem);

                        if(FK_clo.length == (c+1)){
                            // console.log(FK_clo.length);
                        }
                    })
                }
                
            // })
        }

    });

    CLODetail(fk_course, function () {



        var listCLO = [{ "name": "PloClo", "title": "PLO/CLO" },];
        var list_temp = [];
        var list_running = [];
        let bilClo = 1;
        let convertCLOlist = JSON.stringify(result.data);
        $("#CLOlist").val(convertCLOlist);
        $.each(result.data, function (index, value) {
            listCLO.push({
                name: 'clo_level_' + [bilClo],
                title: value.clo_level
            });


            list_running.push({
                nama: 'clo_level_' + [bilClo++],
                id: value.id_clo
            })
            if(result.data.length == (index+1)){
                // console.log(list_running);
            }
        });



        var list2 = [];
        let bil = 1;

        obeList(function () {

            let convertCLOcourse = JSON.stringify(obj_obeList);
            $("#ListCLODetail").val(convertCLOcourse);
            // console.log(convertCLOcourse);

            $.each(obj_obeList, function (index, value) {
                var run = { PloClo: value.obe_plo_name };
                var cur = [];
                $.each(list_running, function (i, val) {
                    cur[val.nama] = ` <input type="checkbox" disabled name="generate_obe" value="` + val.id + `_` + value.obe_plo_id + `" aria-label="Checkbox for following text input">`;

                    if (list_running.length == (i + 1)) {
                        var mergedObject = $.extend(run, cur);
                        list2[index] = mergedObject;
                    }
                });


                if (obj_obeList.length == (index + 1)) {
                    $("#mappingList").html('');
                    $("#mappingList").footable({
                        "columns": listCLO,
                        "rows": list2,
                        "paging": {
                            "enabled": true,
                            "size": 10,
                            "countFormat": "Showing {PF} to {PL} of {TR} data"
                        },

                    });
                    // console.log(list_checked);

                    setTimeout(function () {
                        // var parts = '';
                        $("input[type='checkbox']").prop("disabled", '');
                        $.each(list_checked,function(r,ritem){
                            var checkbox = $("input[type='checkbox'][value='"+ritem+"']");
                            // console.log(ritem);

                            var parts = ritem.split('_');
                            // Now, $parts[0] contains "20" (idCLo) and $parts[1] contains "30" (idPlo)
                            idCLo = parts[0];
                            idPlo = parts[1];
                            // console.log('idCLo -' +  idCLo);
                            // console.log('idPlo -' + idPlo);

                            // Do something with the found checkbox (e.g., check it, uncheck it, etc.)
                            checkbox.prop("checked", true);
                        })
                    }, 2000);
                }
            });


        })

    })

}

$("#generateObe").on('submit', function (e) {
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Add Mapping",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {

            var selectedValues = $("input[name='generate_obe']:checked").map(function () {
                return this.value;
              }).get();
        
            //   console.log(selectedValues);
              var run_api = 'create';
              var form = new FormData();
              if($('#id_obe_plo_generate').val() != ''){
                form.append("id_obe_plo_generate", $('#id_obe_plo_generate').val());
                run_api = 'update';
            }

            let run = [];
            let FK_course = $('#fk_course').val();
            let FK_clo = [];
            let pgmDet_id = window.sessionStorage.pgmDet_id;

            $.each(selectedValues, function (i, val) {

                FK_clo.push(run[1]);

                if (selectedValues.length == (i + 1)) {

                    form.append("pgmDet_id", pgmDet_id);
                    // form.append("FK_plo", FK_plo);
                    form.append("FK_course", FK_course);
                    form.append("FK_clo", JSON.stringify(selectedValues));

                    var settings = {
                        "url": host + "api_tetapan_picoms/public/generateObe/" + run_api,
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
            });



            // let pgm_id = $("#pk_id").val();
            // let pgm_semester = $("#pgm_semester").val();
            // let sem_type = $('#sem_type').val();
            // let aca_session = $('#aca_calendar').val();

            // var form = new FormData();
            // form.append("fk_pgm_det", pgm_id);
            // form.append("pgm_semester", pgm_semester);
            // form.append("sem_type", sem_type);
            // form.append("aca_session", aca_session);
            // form.append("recordstatus", "ADD");

            // var settings = {
            //     "url": host+"api_tetapan_picoms/public/misPrmCOTSem/register",
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
});


