$(function () {
    $.ajaxSetup({
        cache: false
    });

    $.fn.select2.defaults.set("theme", "bootstrap");

    let aca_cal = window.sessionStorage.aca_cal;
    // let fk_course = window.sessionStorage.fk_course;
    let listCrsData = JSON.parse(window.sessionStorage.crsData);
    let pkId = window.sessionStorage.pkId;
    // let idSession = listCrsData[0].idSession;
    let fk_course = listCrsData[0].fk_course;
    let session = listCrsData[0].session;
    let category = listCrsData[0].category;
    let cCode = listCrsData[0].crsCode;
    let cName = listCrsData[0].crsName;





    $('#fk_acaCal').val(aca_cal);
    $('#fk_course').val(fk_course);

    // show Academic Calendar
    showAcaCal(aca_cal, function () {
        let data = obj_kalendar.data;
        $('#cur_year').html(data.cur_year.replace('/', '') + '/' + data.cal_cohort);
        $('#cal_category').html(data.category)

    });

    $('#btnGeneratePdf').attr({
        'onclick': 'generatePDF2(\'STUDENT LIST\', \'tblStudentpdf\', \'' + session + '\', \'' + category + '\', \'' + cCode + '\', \'' + cName + '\')',
        'class': 'btn btn-sm danger',
        'id': 'btnGeneratePdf'
    }).html('<i class="fa fa-fw fa-file-pdf-o"></i> PDF');

    $('#btnResetPdf').attr({
        'onclick': 'generatePDF2(\'STUDENT LIST\', \'tblExamNopdf\', \'' + session + '\', \'' + category + '\', \'' + cCode + '\', \'' + cName + '\')',
        'class': 'btn btn-sm danger',
        'id': 'btnResetPdf'
    }).html('<i class="fa fa-fw fa-file-pdf-o"></i> PDF');



    // show Course
    courseShow(fk_course, function () {
        let data = obj_crsShow.data
        $('#crs_name').html(data.crs_code + ' - ' + data.crs_name);
    });

    // select Campus List
    campusList(function () {
        $('#cam_id').append('<option value="">- Choose -</option>');
        $.each(obj_college.data, function (i, item) {
            $('#cam_id').append('<option value="' + item.pk_id + '">' + item.clg_name + '</option>');
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:',
        });
    });

    // select chief invigilator/invigilator
    lecturerList(function () {
        $('#tbl_invigilator').append('<option value="">- Choose Invigilator -</option>');
        $.each(obj_lecturer.data, function (i, item) {
            $('#tbl_invigilator').append('<option value="' + item.emp_id + '">' + item.emp_name.toUpperCase() + '</option>');
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:',
        });
    });

    // timetable data
    showTimetbl(aca_cal, fk_course, pkId, function () {
        let timetblData = obj_examTmt.data;

        if (timetblData.length == 1) {
            $.each(timetblData, function (i, item) {
                let timetblId = item.pk_id;
                $('#pkId').val(timetblId);
                $('#tbl_date_start').val(item.tbl_date_start);
                $('#tbl_time_start').val(item.tbl_time_start);
                $('#tbl_time_end').val(item.tbl_time_end);

                // select Paper Type
                paperType(function () {
                    $('#tbl_paper_type').html('');
                    $('#tbl_paper_type').append('<option value="">- Choose -</option>');
                    $.each(obj_pprType.data, function (i, item) {
                        $('#tbl_paper_type').append('<option value="' + item.pk_id + '">' + item.paper_type.toUpperCase() + '</option>');
                    });
                    $('#tbl_paper_type').val(item.tbl_paper_type);
                });

                // list table no.
                listTblNo(timetblId, function () {
                    let dataLength = obj_tblNoList.data.length;
                    if (dataLength != 0) {
                        let hide = '';
                        $.each(obj_tblNoList.data, function (j, itemJ) {
                            let tblNo = itemJ.est_tableno;
                            if (!(tblNo == '' || tblNo == null)) {
                                hide = 'yes';
                                $('.hideDiv').hide();
                                $('#btnResetTblNo').show();
                            }
                            else {
                                $('.hideDiv').show();
                                $('#btnResetTblNo').hide();
                                return false;
                            }
                        });
                        createTblNo(obj_tblNoList.data);
                        createTblVenue(timetblId, hide);
                        $('#divStdList').addClass('collapse');
                        $('#divTblNo').removeClass('collapse');
                        // $('#btnSaveTimetbl').attr('disabled', true);
                        // $('#btnDelTimetbl').attr('disabled', true);
                    }
                    else {
                        $('#divTblNo').addClass('collapse');
                        $('#divStdList').removeClass('collapse');
                        $('#btnSave').attr('disabled', true);
                        $("#divTableVenue").hide();
                        // $('#btnSaveTimetbl').attr('disabled', false);
                        // $('#btnDelTimetbl').attr('disabled', false);
                    }
                });
            });
        }
        else {
            // select Paper Type
            paperType(function () {
                $('#tbl_paper_type').html('');
                $('#tbl_paper_type').append('<option value="">- Choose -</option>');
                $.each(obj_pprType.data, function (i, item) {
                    $('#tbl_paper_type').append('<option value="' + item.pk_id + '">' + item.paper_type.toUpperCase() + '</option>');
                });
            });

            $('#btnSave').attr('disabled', true);
            $("#divTableVenue").hide();
            $("#btnDelTimetbl").hide();
        }
    });

    // list student registered
    stdByAcaCalCrsFixExam(aca_cal, fk_course, function () {
        var columns = [
            { "name": "chkbox", "title": "#" },
            { "name": "student_id", "title": "Student" },
            { "name": "pgm_code", "title": "Programme" },
            { "name": "special_case", "title": "Re-Sit" },
            { "name": "rsb_status", "title": "Status", "breakpoints": "md sm xs" }
        ];

        var columns2 = [
            { "name": "student_id", "title": "Student" },
            { "name": "pgm_code", "title": "Programme" },
            { "name": "rsb_status", "title": "Status", "breakpoints": "md sm xs" }
        ];
        var filteredData = obj_stdRegCrs.data.filter(function (course) {
            return course.app_type === "RE-SIT";
        });
        let convertList = JSON.stringify(filteredData);
        // let convertList = JSON.stringify(obj_stdRegCrs.data);
        $("#dataList").val(convertList);
        var list = [];
        var list2 = [];
        $.each(obj_stdRegCrs.data, function (j, itemJ) {
            let status = itemJ.rsb_status;
            let barrStts = itemJ.barr_status;
            let chk = ''; let std_stts = '';
            if (barrStts == 'Barred') { chk = ''; std_stts = '<span class="label danger">' + barrStts + '</span>' }
            else { chk = 'checked'; std_stts = '<span class="label success">' + status + '</span>' }


            // list.push({
            //     student_id: '<span class="text-uppercase"><b>'+itemJ.std_id+'</b><br>'+itemJ.sti_name+'</span>', pgm_code: '<span class="text-uppercase">'+itemJ.pgmCode+'</span>', rsb_status: std_stts,
            //     chkbox: '<label class="ui-switch primary m-t-xs m-r" ><input type="checkbox" id="chkbox-'+j+'" onclick="chkBox(\'' + j + '\',\'' + itemJ.std_id + '\')" '+chk+'><i></i></label>'
            // });

            // list2.push({
            //     student_id: '<span class="text-uppercase"><b>'+itemJ.std_id+'</b><br>'+itemJ.sti_name+'</span>', pgm_code: '<span class="text-uppercase">'+itemJ.pgmCode+'</span>', rsb_status: std_stts,
            //     chkbox: '<label class="ui-switch primary m-t-xs m-r" ><input type="checkbox" id="chkbox-'+j+'" onclick="chkBox(\'' + j + '\',\'' + itemJ.std_id + '\')" '+chk+'><i></i></label>'
            // });
            if (itemJ.app_type === "RE-SIT" && (itemJ.app_status !== "In Progress")) {

                list.push({
                    chkbox: '<label class="ui-switch primary m-t-xs m-r" ><input type="checkbox" id="chkbox-' + j + '" onclick="chkBox(\'' + j + '\',\'' + itemJ.std_id + '\',\'' + itemJ.rsb_id + '\')" ' + chk + '><i></i></label>',
                    student_id: '<span class="text-uppercase"><b>' + itemJ.std_id + '</b><br>' + itemJ.sti_name + '</span>',
                    pgm_code: '<span class="text-uppercase">' + itemJ.pgmCode + '</span>',
                    rsb_status: std_stts,
                    special_case: itemJ.app_type + '<br>' + itemJ.app_status,
                });

                list2.push({
                    student_id: '<span class="text-uppercase"><b>' + itemJ.std_id + '</b><br>' + itemJ.sti_name + '</span>',
                    pgm_code: '<span class="text-uppercase">' + itemJ.pgmCode + '</span>',
                    rsb_status: std_stts,
                    chkbox: '<label class="ui-switch primary m-t-xs m-r" ><input type="checkbox" id="chkbox-' + j + '" onclick="chkBox(\'' + j + '\',\'' + itemJ.std_id + '\',\'' + itemJ.rsb_id + '\')" ' + chk + '><i></i></label>'
                    , special_case: itemJ.app_type + '<br>' + itemJ.app_status,
                });
            }
        });

        $("#tblStudent").footable({
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



        $("#tblStudentpdf").footable({
            "columns": columns2,
            "rows": list2,
            "paging": {
                "enabled": false,
                "size": 10,
                "countFormat": "Showing {PF} to {PL} of {TR} data"
            },

        });


        $("#tblStudentpdf").css("display", "none");



    });
});
var confirmed = false;


// btn Back to admin page
$('#btnBack').click(function () {
    window.location.replace('adminPage.html');
    window.sessionStorage.removeItem('crs_code');
    window.sessionStorage.removeItem('crs_id');
    window.sessionStorage.removeItem('crs_name');
    window.sessionStorage.removeItem('cotDet_id');
});


//-------------------------------------------------- update details --------------------------------------------------//
$("#formExamTimetbl").on('submit', function (e) {
    let pkId = $('#pkId').val();
    let status = '';
    let swalBtn = '';
    let swalBtnCOlor = '';
    let formUrl = '';
    let recordstatus = '';

    if (pkId != '') {
        status = 'Update';
        swalBtn = 'Update';
        swalBtnCOlor = '#22b66e';
        formUrl = 'update';
        recordstatus = 'EDT';
    }
    else {
        status = 'Add';
        swalBtn = 'Save';
        swalBtnCOlor = '#2196f3';
        formUrl = 'register';
        recordstatus = 'ADD';
    }

    if (!confirmed) {
        e.preventDefault();
        swal({
            title: status + " Examination Timetable",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: swalBtn,
            confirmButtonColor: swalBtnCOlor,
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let fk_acaCal = $('#fk_acaCal').val();
            let fk_course = $('#fk_course').val();
            let tbl_paper_type = $('#tbl_paper_type').val();
            let tbl_date_start = $('#tbl_date_start').val();
            let tbl_time_start = $('#tbl_time_start').val();
            let tbl_time_end = $('#tbl_time_end').val();

            var form = new FormData();
            if (pkId != '') {
                form.append("pk_id", pkId);
            }
            else {
                form.append("fk_acaCal", fk_acaCal);
                form.append("fk_course", fk_course);
            }
            form.append("tbl_paper_type", tbl_paper_type);
            form.append("tbl_date_start", tbl_date_start);
            form.append("tbl_time_start", tbl_time_start);
            form.append("tbl_time_end", tbl_time_end);
            form.append("recordstatus", recordstatus);

            var settings = {
                "url": host + "api_exam_picoms/public/misExamTimetbl/" + formUrl,
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


//-------------------------------------------------- delete Timetable --------------------------------------------------//
$('#btnDelTimetbl').click(function () {
    let id = $('#pkId').val();
    if (!confirmed) {
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
        }).then(function () {
            var form = new FormData();
            form.append("pk_id", id);
            form.append("recordstatus", "DEL");

            var settings = {
                "url": host + "api_exam_picoms/public/misExamTimetbl/delete",
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
//-------------------------------------------------- end delete Timetable --------------------------------------------------//


//-------------------------------------------------- change status --------------------------------------------------//
function postStatus(status, rsbId) {
    // alert(rsbId);

    swal({
        title: "Change status : " + status,
        text: "Are You Sure?",
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Update",
        confirmButtonColor: "#22b66e",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false
    }).then(function () {
        let barrStatus = '';
        if (status == 'Barred') { barrStatus = 'Barred' }

        var form = new FormData();
        form.append("rsb_id", rsbId);
        form.append("barr_status", barrStatus);
        form.append("recordstatus", 'EDT');

        var settings = {
            "url": host + "api_pengurusan_pelajar/public/misStdRegsub/uptStatus",
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

function chkBox(indexs, stdId, rsbId) {
    let d = JSON.parse($("#dataList").val());
    let data = d[indexs];

    if ($('#chkbox-' + indexs).prop("checked")) {
        postStatus('Register', rsbId);
        // postStatus('Register', data.rsb_id);
    }
    else {
        postStatus('Barred', rsbId);
        // postStatus('Barred', data.rsb_id); 
    }
}
//-------------------------------------------------- end change status --------------------------------------------------//


//-------------------------------------------------- generate table no. --------------------------------------------------//
function saveStdTblNo(getData) {
    var form = new FormData();
    form.append("fk_exam", getData.fk_exam);
    form.append("fk_stdRegCrs", getData.fk_stdRegCrs);
    form.append("std_studentid", getData.std_studentid);
    form.append("fk_exam_application", getData.fk_examApplication);
    form.append("cur_year", getData.cur_year);
    form.append("crs_code", getData.crs_code);
    form.append("attendance", '');
    form.append("recordstatus", 'ADD');

    var settings = {
        "url": host + "api_exam_picoms/public/misExamStd/register",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form,
        'async': false,
    };

    $.ajax(settings).done(function (response) {
        result = JSON.parse(response);
        if (!result.success) {
            Swal(result.message, result.data, "error");
            return;
        }
        else {
            swal({
                text: "Finished",
                type: "info"
            });
        }
    });
}

$('#btnGenerate').click(function () {
    let pkId = $('#pkId').val();
    if (pkId != '') {
        let data = JSON.parse($("#dataList").val());
        data = jQuery.grep(data, function (a) {
            // return a.rsb_status !== 'Barred';
            return a.barr_status !== 'Barred';
        });
        console.log(data);

        swal({
            title: "Generate Student",
            text: "Are You Sure?",
            type: "question",
            confirmButtonText: "Generate",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            showLoaderOnConfirm: true,
            preConfirm: (login) => {
                return fetch(`//api.github.com/users/${login}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(response.statusText)
                        }
                        return response.json()
                    })
                    .catch(error => {
                        Swal.showValidationMessage(
                            `Request failed: ${error}`
                        )
                    })
            },
            html: false
        }).then(function () {
            $.when(
                $.each(data, function (i, item) {
                    let dt = {};
                    dt.fk_exam = pkId;
                    dt.fk_stdRegCrs = item.rsb_id;
                    dt.std_studentid = item.std_id;
                    dt.fk_examApplication = item.FK_exam_application;
                    dt.cur_year = $('#dtp_year').val();
                    dt.crs_code = $('#pk_crs').val();
                    saveStdTblNo(dt);

                    
                    // let pk_id = item.FK_exam_application;

                    // var form = new FormData();
                    // form.append("pk_id", pk_id);

                    // var settings = {
                    //     "url": host + "api_exam_picoms/public/misExamApp/updCompleted",
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

                    // $.ajax(settings).done(function (response) {
                    //     result = JSON.parse(response);
                    //     if (!result.success) {
                    //         Swal(result.message, result.data, "error");
                    //         return;
                    //     }
                    // });
                })
            ).then(function () {

                window.location.reload();
            });
        })
    }
    else {
        swal({
            title: "Timetable is Empty",
            type: "info",
            showCancelButton: true
        });
    }
});
//-------------------------------------------------- end generate table no. --------------------------------------------------//


//-------------------------------------------------- reset table no. --------------------------------------------------//
$('#btnReset').click(function () {
    let data = JSON.parse($("#tblNoList").val());
    swal({
        title: "Reset Student",
        text: "Are You Sure?",
        type: "question",
        confirmButtonText: "Reset",
        confirmButtonColor: "#ef193c",
        closeOnConfirm: true,
        showLoaderOnConfirm: true,
        preConfirm: (login) => {
            return fetch(`//api.github.com/users/${login}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(response.statusText)
                    }
                    return response.json()
                })
                .catch(error => {
                    Swal.showValidationMessage(
                        `Request failed: ${error}`
                    )
                })
        },
        html: false
    }).then(function () {
        $.when(
            $.each(data, function (i, item) {
                var form = new FormData();
                form.append("pk_id", item.tblNo_id);
                form.append("recordstatus", 'DEL');

                // var settings = {
                //     "url": host + "api_exam_picoms/public/misExamStd/uptStatus",
                //     "method": "POST",
                //     "timeout": 0,   
                //     "headers": {
                //         "Authorization": "picoms " + window.sessionStorage.token
                //     },
                //     "processData": false,
                //     "mimeType": "multipart/form-data",
                //     "contentType": false,
                //     "data": form,
                //     'async': false,
                // };

                obj = new post(host + 'api_exam_picoms/public/misExamStd/uptStatus', form, 'picoms ' + window.sessionStorage.token).execute();
                if (obj.success) {


                    var formUpdReset = new FormData();
                    formUpdReset.append("pk_id", item.fk_applicationExam);

                    obj = new post(host + 'api_exam_picoms/public/misExamApp/updReset', formUpdReset, 'picoms ' + window.sessionStorage.token).execute();
                    if (!obj.success) {
                        Swal(result.message, result.data, "error");
                        return;
                    } else {
                        swal({
                            text: "Finished",
                            type: "info"
                        });
                    }
                    //afiez buat end sni


                } else {
                    Swal(obj.message, obj.data, "error");
                    return;
                }
                // $.ajax(settings).done(function (response) {
                //     result = JSON.parse(response);
                //     if (!result.success) {
                //         Swal(result.message, result.data, "error");
                //         return;
                //     }
                //     else {
                //         swal({
                //             text: "Finished",
                //             type: "info"
                //         });
                //     }
                // });
            })
        ).then(function () {
            window.location.reload();
        });
    });
});
//-------------------------------------------------- end reset table no. --------------------------------------------------//


function invgltrVenueList(id) {
    $('#exmVenueId').val(id);

    invgltrList(id, function () {
        createTblInvgltr(obj_invgltr.data, id);
    });

    $('#mdlLecturer').modal('show');
}


//-------------------------------------------------- add Invigilator --------------------------------------------------//
$("#formExmInvigilator").on('submit', function (e) {
    let venueId = $('#exmVenueId').val();
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Save Invigilator",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let fk_exmTimetbl = $("#pkId").val();
            let fk_venue = venueId;
            let fk_lect = $("#tbl_invigilator").val();
            let chief = '';
            if ($('#chiefInvgltr').prop('checked') == true) { chief = 'Yes'; }
            else { chief = 'No' }

            var form = new FormData();
            form.append("fk_exmTimetbl", fk_exmTimetbl);
            form.append("fk_venue", fk_venue);
            form.append("fk_lect", fk_lect);
            form.append("chief", chief);
            form.append("recordstatus", "ADD");

            var settings = {
                "url": host + "api_exam_picoms/public/misExamInvgltr/register",
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
                $("#formExmInvigilator")[0].reset();
                $("#tbl_invigilator").val('').trigger('change');
                invgltrList(venueId, function () {
                    createTblInvgltr(obj_invgltr.data, venueId);
                });
            });
        });
    }
});
//-------------------------------------------------- end add Invigilator --------------------------------------------------//


//-------------------------------------------------- create table Invigilator --------------------------------------------------//
function createTblInvgltr(data, id) {
    var columns = [
        { "name": "bil", "title": "No." },
        { "name": "emp_id", "title": "Lecturer" },
        { "name": "chief", "title": "Chief" },
        { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" }
    ];

    let bil = 1;
    var list = [];

    $.each(data, function (i, item) {
        let chief = item.chief;
        let icon = ''
        if (chief == 'Yes') { icon = 'checked' }

        list.push({
            bil: bil++, emp_id: '<span class="text-uppercase">' + item.emp_name + '</span>',
            chief: '<label class="ui-switch data-ui-switch-md success m-t-xs">' +
                '<input type="checkbox" id="chief_' + item.pk_id + '" onclick="chiefInvgltr(' + item.pk_id + ',\'' + id + '\')" ' + icon + '>' +
                '<i></i>' +
                '</label>',
            upt_btn: '<button type="button" class="btn btn-sm md-flat" title="Remove" onclick="delInvgltr(\'' + item.pk_id + '\',\'' + id + '\')"><i class="ion-trash-b" style="color: #ef193c"></i></button>'
        });
    });

    $("#tblLecturer").html('');
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
//-------------------------------------------------- end create table Invigilator --------------------------------------------------//


// onchange Invigilator
$('#tbl_invigilator').change(function () {
    let staff = $(this).val();
    let venue = $("#exmVenueId").val();

    chkExmInvgltr(venue, staff, function () {
        let count = obj_invgltr.data.length;
        if (count != 0) {
            $('#tbl_invigilator').val('').trigger('change');
            swal({
                text: "Invigilator have been added.",
                type: "info"
            });
        }
    });
});


//-------------------------------------------------- edit chief Invigilator --------------------------------------------------//
function chiefInvgltr(id, venueId) {
    if (!confirmed) {
        swal({
            title: "Update Invigilator",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let chief = '';
            if ($('#chief_' + id).prop('checked') == true) { chief = 'Yes'; }
            else { chief = 'No' }

            var form = new FormData();
            form.append("pk_id", id);
            form.append("chief", chief);
            form.append("recordstatus", "EDT");

            var settings = {
                "url": host + "api_exam_picoms/public/misExamInvgltr/update",
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
                invgltrList(venueId, function () {
                    createTblInvgltr(obj_invgltr.data, venueId);
                });
            });
        });
    }
}
//-------------------------------------------------- end edit chief Invigilator --------------------------------------------------//


//-------------------------------------------------- delete Invigilator --------------------------------------------------//
function delInvgltr(id, venueId) {
    if (!confirmed) {
        swal({
            title: "Remove Invigilator",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Remove",
            confirmButtonColor: "#ef193c",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            var form = new FormData();
            form.append("pk_id", id);
            form.append("recordstatus", "DEL");

            var settings = {
                "url": host + "api_exam_picoms/public/misExamInvgltr/delete",
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
                invgltrList(venueId, function () {
                    createTblInvgltr(obj_invgltr.data, venueId);
                });
            });
        });
    }
}
//-------------------------------------------------- end delete Invigilator --------------------------------------------------//


//-------------------------------------------------- create table Number --------------------------------------------------//
function createTblNo(data) {
    var columns = [
        { "name": "bil", "title": "No." },
        { "name": "student_id", "title": "Student Id" },
        { "name": "pgm_code", "title": "Programme" },
        { "name": "exm_venue", "title": "Venue", "breakpoints": "md sm xs" },
        { "name": "est_tableno", "title": "Table No.", "breakpoints": "md sm xs" },
        // { "name": "attendance", "title": "Attendance", "breakpoints": "md sm xs" }
    ];

    let bil = 1;
    let convertList = JSON.stringify(data);
    $("#tblNoList").val(convertList);
    var list = [];

    $.each(data, function (k, itemK) {
        let attndnc = itemK.attendance;
        let icon = ''
        if (attndnc == 'Attend') { icon = 'checked' }
        list.push({
            bil: bil++, est_tableno: itemK.est_tableno, student_id: '<span class="text-uppercase"><b>' + itemK.std_id + '</b><br>' + itemK.sti_name + '</span>',
            pgm_code: '<span class="text-uppercase">' + itemK.pgmCode + '</span>', exm_venue: '<span class="text-uppercase">' + itemK.cen_id + '</span>',
            // attendance: '<label class="ui-switch data-ui-switch-md success m-t-xs">'+
            //                 '<input type="checkbox" class="attdncStd" id="att_'+itemK.tblNo_id+'" onclick="attendance('+itemK.tblNo_id+')" '+icon+'>'+
            //                 '<i></i>'+
            //             '</label>',
        });

    });

    $("#tblExamNo").footable({
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

    $("#tblExamNopdf").footable({
        "columns": columns,
        "rows": list,
        "paging": {
            "enabled": false,
            // "size": 10,
            // "countFormat": "Showing {PF} to {PL} of {TR} data"
        },

    });
    $("#tblExamNopdf").css("display", "none");
}
//-------------------------------------------------- create table Number --------------------------------------------------//


//-------------------------------------------------- edit student Attendance --------------------------------------------------//
function attendance(id) {
    if (!confirmed) {
        swal({
            title: "Update Attendance",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let stdAttendance = '';
            if ($('#att_' + id).prop('checked') == true) { stdAttendance = 'Attend'; }
            else { stdAttendance = 'Absent' }

            var form = new FormData();
            form.append("pk_id", id);
            form.append("attendance", stdAttendance);
            form.append("recordstatus", "EDT");

            var settings = {
                "url": host + "api_exam_picoms/public/misExamStd/uptAttndnc",
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
}
//-------------------------------------------------- end edit student Attendance --------------------------------------------------//


//-------------------------------------------------- add/update Venue --------------------------------------------------//
$("#formVenue").on('submit', function (e) {
    let timeTblId = $('#pkId').val();
    let pkId = $('#exmVenue_id').val();
    let status = '';
    let swalBtn = '';
    let swalBtnCOlor = '';
    let formUrl = '';
    let recordstatus = '';

    if (pkId != '') {
        status = 'Update';
        swalBtn = 'Update';
        swalBtnCOlor = '#22b66e';
        formUrl = 'update';
        recordstatus = 'EDT';
    }
    else {
        status = 'Add';
        swalBtn = 'Save';
        swalBtnCOlor = '#2196f3';
        formUrl = 'register';
        recordstatus = 'ADD';
    }

    if (!confirmed) {
        e.preventDefault();
        swal({
            title: status + " Venue",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: swalBtn,
            confirmButtonColor: swalBtnCOlor,
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let fk_exam = $("#pkId").val();
            let fk_course = $('#pk_crs').val();
            let fk_campus = $('#cam_id').val();
            let fk_venue = $("#tbl_venue").val();
            let capacity = $('#capacity').val();
            let start_no = $('#startNo').val();

            var form = new FormData();
            if (pkId != '') {
                form.append("pk_id", pkId);
            }
            else {
                form.append("fk_exam", fk_exam);
                form.append("fk_course", fk_course);
            }
            form.append("fk_campus", fk_campus);
            form.append("fk_venue", fk_venue);
            form.append("capacity", capacity);
            form.append("start_no", start_no);
            form.append("recordstatus", recordstatus);

            var settings = {
                "url": host + "api_exam_picoms/public/misExamVenue/" + formUrl,
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
                    $('#exmVenue_id').val('');
                    $('.slctVenue').val('').trigger('change');
                    $('#formVenue')[0].reset();
                    createTblVenue(timeTblId);
                }
            });
        });
    }
});
//-------------------------------------------------- end add/update Venue --------------------------------------------------//


// onchange select Campus
$('#cam_id').change(function () {
    let campus = $(this).val();
    $('#tbl_venue').html('');

    if (campus != '') {
        listCenter(campus, function () {
            $('#tbl_venue').append('<option value="">- Choose -</option>');
            $.each(obj_exmCenter.data, function (i, item) {
                $('#tbl_venue').append('<option value="' + item.center_id + '" capacity="' + item.cen_max_capacity + '">' + item.cen_id.toUpperCase() + '</option>');
            });

            $('.slct2').select2({
                width: null,
                containerCssClass: ':all:',
            });
        });
    }
});


// onchange select Venue
$('#tbl_venue').change(function () {
    let value = $(this).val();
    let capacity = $("#tbl_venue option:selected").attr('capacity');
    $('#capacity').val(capacity);

    let dt = {};
    dt.fk_venue = value;
    dt.fk_exam = $('#pkId').val();
    dt.exam_date = $('#tbl_date_start').val();
    dt.exam_startTime = $('#tbl_time_start').val();
    dt.exam_endTime = $('#tbl_time_end').val();

    chkVenueExist(dt, function () {
        let count = obj_exmStd.data.length;
        if (count >= capacity) {
            $('#cam_id').trigger('change');
            $('#startNo').val('');
            swal({
                text: "Venue is Full.",
                type: "info"
            });
        }
        else {
            // let startNo = count + 1;
            // $('#startNo').val(startNo);
            // console.log(obj_exmStd.data);


            // Find the first missing est_tableno value
            firstMissing = findMissingEstTableno(obj_exmStd.data);
            if (firstMissing !== null) {
                console.log("First missing est_tableno value:", firstMissing);
                $('#startNo').val(firstMissing);

            } else {
                let startNo = count + 1;
                console.log(startNo)
                $('#startNo').val(startNo);

            }



            // let startNo = count + 1;
            // $('#startNo').val(startNo);
        }
    });
});


//-------------------------------------------------- table Venue --------------------------------------------------//
function createTblVenue(id, hideDiv) {
    let display = '';
    if (hideDiv == 'yes') { display = 'disabled'; }

    listExmVenue(id, function () {
        let columns = [
            { "name": "bil", "title": "No." },
            { "name": "fk_venue", "title": "Exam Center" },
            { "name": "capacity", "title": "Capacity" },
            { "name": "btn_action", "title": "Action", "breakpoints": "md sm xs" },
        ];

        let convertList = JSON.stringify(obj_exmVenue.data);
        $("#dataVenueList").val(convertList);
        let list = [];
        let bil = 1;

        $.each(obj_exmVenue.data, function (i, item) {
            list.push({
                bil: bil++, fk_venue: '<span class="text-uppercase">' + item.cen_id + '</span>', loc_name: '<span class="text-uppercase">' + item.loc_name + '</span>', capacity: item.cen_max_capacity,
                btn_action: '<button type="button" class="btn btn-sm md-flat" title="Update" onclick="uptVenue(\'' + i + '\')" ' + display + '><i class="ion-android-create" style="color: #22b66e;"></i></button>' +
                    '<button type="button" class="btn btn-sm md-flat" title="Invigilator" onclick="invgltrVenueList(\'' + item.exmVanue_id + '\')"><i class="ion-ios-people" style="color: #00d2ff"></i></button>' +
                    '<button type="button" class="btn btn-sm md-flat" title="Remove" onclick="delVenue(\'' + item.exmVanue_id + '\',\'' + id + '\')" ' + display + '><i class="ion-trash-b" style="color: #ef193c"></i></button>',
            });
        });

        $("#tblVenue").html('');
        $("#tblVenue").footable({
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
}
//-------------------------------------------------- end table Venue --------------------------------------------------//


// loadData Venue
function uptVenue(index) {
    let data = JSON.parse($('#dataVenueList').val());
    data = data[index];
    let campus = data.fk_campus;
    let exmCenter = data.fk_center;

    $('#exmVenue_id').val(data.exmVanue_id);
    $('#cam_id').val(campus);
    $('#capacity').val(data.cen_max_capacity);

    listCenter(campus, function () {
        $('#tbl_venue').html('');
        $('#tbl_venue').append('<option value="">- Choose -</option>');
        $.each(obj_exmCenter.data, function (i, item) {
            $('#tbl_venue').append('<option value="' + item.center_id + '" capacity="' + item.cen_max_capacity + '">' + item.cen_id.toUpperCase() + '</option>');
        });
        $('#tbl_venue').val(data.fk_venue);

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:',
        });
    });

    // check if venue exist for other exam
    let dt = {};
    dt.fk_venue = exmCenter;
    dt.fk_exam = $('#pkId').val();
    dt.exam_date = $('#tbl_date_start').val();
    dt.exam_startTime = $('#tbl_time_start').val();
    dt.exam_endTime = $('#tbl_time_end').val();

    chkVenueExist(dt, function () {
        let count = obj_exmStd.data.length;
        if (count >= capacity) {
            $('#cam_id').trigger('change');
            $('#startNo').val('');
            swal({
                text: "Venue is Full.",
                type: "info"
            });
        }
        else {
            // let startNo = count + 1;
            // $('#startNo').val(startNo);
            // console.log(obj_exmStd.data);


            // Find the first missing est_tableno value
            firstMissing = findMissingEstTableno(obj_exmStd.data);
            if (firstMissing !== null) {
                console.log("First missing est_tableno value:", firstMissing);
                $('#startNo').val(firstMissing);

            } else {
                let startNo = count + 1;
                console.log(startNo)
                $('#startNo').val(startNo);

            }



            // let startNo = count + 1;
            // $('#startNo').val(startNo);
        }
    });

    $('#btnActnVenue').html('<button type="button" class="btn white p-x-md" id="btnCancel">Cancel</button> ' +
        '<button type="submit" class="btn success p-x-md">Update</button>');
}


// button cancel reset form Venue
$('#btnActnVenue').on('click', '#btnCancel', function () {
    $('.formActnVenue')[0].reset();
    $('#exmVenue_id').val('');
    $('#cam_id').val('').trigger('change');
    $('#tbl_venue').val('').trigger('change');
    $('#tbl_venue').html('');
    $('#btnActnVenue').html('<button type="submit" class="btn info p-x-md" id="btnSave">Save</button>');
});

function findMissingEstTableno(data) {
    // Extract est_tableno values
    estTablenos = data.map(item => item.est_tableno);

    // Find the minimum and maximum est_tableno values
    minEstTableno = Math.min(...estTablenos);
    maxEstTableno = Math.max(...estTablenos);

    // Check for missing numbers between min and max
    for (let i = minEstTableno + 1; i < maxEstTableno; i++) {
        if (!estTablenos.includes(i)) {
            return i; // Return the first missing number
        }
    }

    return null; // If no missing numbers are found, return null
}

//-------------------------------------------------- delete Venue --------------------------------------------------//
function delVenue(id, timeTblId) {
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("pk_id", id);

    swal({
        title: "Remove Venue",
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
            "url": host + "api_exam_picoms/public/misExamVenue/delete",
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
            createTblVenue(timeTblId);
        });
    });
}
//-------------------------------------------------- end delete Venue --------------------------------------------------//


//-------------------------------------------------- generate table no. --------------------------------------------------//
function uptExmStd(index) {
    let dtStd = JSON.parse($('#tblNoList').val());
    let panjang = dtStd.length;
    let processedItems = 0;

    $.when(
        $.each(dtStd, function (i, item) {
            processedItems++;

            if (index.no == i) {
                console.log(index.no);
                var form = new FormData();
                form.append("pk_id", item.tblNo_id);
                form.append("fk_venue", index.venue);
                form.append("fk_center", index.center);
                form.append("est_tableno", index.tblNo);
                form.append("recordstatus", 'EDT');

                var settings = {
                    "url": host + "api_exam_picoms/public/misExamStd/uptTblNo",
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



                        //start afiez tmbah sni


                        // alert(item.fk_applicationExam);


                        let pk_id = item.fk_applicationExam;

                        var form = new FormData();
                        form.append("pk_id", pk_id);

                        var settings = {
                            "url": host + "api_exam_picoms/public/misExamApp/updCompleted",
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
                            } else {
                                swal({
                                    text: "Finished",
                                    type: "info"
                                });
                            }
                        });
                        //end afiez tmbah sni

                        // console.log(index.no+' afiez '+panjang);
                        for (let i = 1; i < panjang; i++) {
                            // const element = array[index];
                            console.log('Only ' +i+ ' Get No. Table. Please generate Again');

                            window.location.reload();
                            
                        }
                        // if (panjang === (index.no + 1)) {
                        //     // window.location.reload();
                        //     // alert(processedItems);
                        // } else {
                        //     console.log('Only ' + processedItems + ' Get No. Table. Please generate Again');
                        //     // window.location.reload();

                        // }

                    }
                });
            }
        })
    ).then(function () {
        // window.location.reload();
    });
}

$('#btnGnrtTblNo').click(function () {
    let data = JSON.parse($('#dataVenueList').val());
    let noIndex = 0;

    swal({
        title: "Generate Table No.",
        text: "Are You Sure?",
        type: "question",
        confirmButtonText: "Generate",
        confirmButtonColor: "#2196f3",
        closeOnConfirm: true,
        showLoaderOnConfirm: true,
        preConfirm: (login) => {
            return fetch(`//api.github.com/users/${login}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(response.statusText)
                    }
                    return response.json()
                })
                .catch(error => {
                    Swal.showValidationMessage(
                        `Request failed: ${error}`
                    )
                })
        },
        html: false
    }).then(function () {
        $.each(data, function (i, item) {
            let capacity = item.cen_max_capacity;
            let chkVenue = {};
            chkVenue.fk_venue = item.fk_center;
            chkVenue.fk_exam = $('#pkId').val();
            chkVenue.exam_date = $('#tbl_date_start').val();
            chkVenue.exam_startTime = $('#tbl_time_start').val();
            chkVenue.exam_endTime = $('#tbl_time_end').val();

            chkVenueExist(chkVenue, function () {
                let count = obj_exmStd.data.length;
                let tblNo = 0;
                // let startNo = count + 1;

                AvailaibleCapacity = capacity - count;

                //coding baru start sni

                const max = Math.max(...obj_exmStd.data.map(item => item.est_tableno));
                const min = Math.min(...obj_exmStd.data.map(item => item.est_tableno));
                const allNumbers = new Set(obj_exmStd.data.map(item => item.est_tableno));

                let missingFound = false;
                for (let i = 1; i <= max; i++) {
                    if (!allNumbers.has(i)) {
                        // newAvailable = AvailaibleCapacity - 1;

                        console.log("Missing est_tableno value:", i);
                        let lengthNo = i.toString().length;
                        let tblNo = '';
                        if (lengthNo == 1) {
                            tblNo = '00' + i;
                        } else if (lengthNo == 2) {
                            tblNo = '0' + i;
                        } else {
                            tblNo = '' + i;
                        }

                        let dt = {};
                        dt.venue = item.exmVanue_id;
                        dt.center = item.fk_center;
                        dt.no = noIndex;
                        dt.tblNo = tblNo;
                        //  console.log(dt);
                        uptExmStd(dt);

                        noIndex++;
                        startNo++;
                        AvailaibleCapacity--;

                        // for (bil = 1; bil <= AvailaibleCapacity; bil++) {

                        // }



                        missingFound = true;
                    }
                }

                if (missingFound = true) {
                    //  let startNo = count + 1;
                    let newCount = count + 1;

                    for (bil = 1; bil <= AvailaibleCapacity; bil++) {
                        let lengthNo = newCount.toString().length;
                        let tblNo = '';
                        if (lengthNo == 1) {
                            tblNo = '00' + newCount;
                        } else if (lengthNo == 2) {
                            tblNo = '0' + newCount;
                        } else {
                            tblNo = '' + newCount;
                        }

                        let dt = {};
                        dt.venue = item.exmVanue_id;
                        dt.center = item.fk_center;
                        dt.no = noIndex;
                        dt.tblNo = tblNo;
                        uptExmStd(dt);
                        //  console.log(dt);

                        noIndex++;
                        newCount++;

                    }
                }
                //  window.location.reload(); 


                //coding baru end sni
                // for (bil = 1; bil <= AvailaibleCapacity; bil++) {
                //     let lengthNo = startNo.toString().length;
                //     if (lengthNo == 1) { tblNo = '00' + startNo }
                //     else if (lengthNo == 2) { tblNo = '0' + startNo }
                //     else { tblNo = '' + startNo }

                //     let dt = {};
                //     dt.venue = item.exmVanue_id;
                //     dt.center = item.fk_center;
                //     dt.no = noIndex;
                //     dt.tblNo = tblNo;
                //     uptExmStd(dt);

                //     noIndex++;
                //     startNo++;
                // }
            });
        });
    });
});
//-------------------------------------------------- end generate table no. --------------------------------------------------//


//-------------------------------------------------- reset table no. --------------------------------------------------//
$('#btnResetTblNo').click(function () {
    let dtStd = JSON.parse($('#tblNoList').val());
    let totalItems = dtStd.length;
    let processedItems = 0;

    swal({
        title: "Reset Table No.",
        text: "Are You Sure?",
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Reset",
        confirmButtonColor: "#ef193c",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false
    }).then(function () {
        $.when(
            $.each(dtStd, function (i, item) {
                var form = new FormData();
                form.append("pk_id", item.tblNo_id);
                form.append("fk_venue", '');
                form.append("fk_center", '');
                form.append("est_tableno", '');
                form.append("recordstatus", 'EDT');

                console.log(item);
                var settings = {
                    "url": host + "api_exam_picoms/public/misExamStd/resetTblNo",
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
                    } else {


                        //afiez buat start sni

                        let pk_id = item.fk_applicationExam;

                        var formUpdReset = new FormData();
                        formUpdReset.append("pk_id", pk_id);

                        obj = new post(host + 'api_exam_picoms/public/misExamApp/updReset', formUpdReset, 'picoms ' + window.sessionStorage.token).execute();
                        if (!obj.success) {
                            Swal(obj.message, obj.data, "error");
                            return;
                        } else {
                            // alert('alerr');
                        }
                        //afiez buat end sni


                        processedItems++;
                        if (processedItems === totalItems) {
                            window.location.reload();
                        }
                    }
                });
            })
        ).then(function () {
            // window.location.reload();
        });
    });
});
//-------------------------------------------------- end reset table no. --------------------------------------------------//


function showTimetbl(acaCal, course, pkId, returnValue) {
    var form = new FormData();
    form.append("fk_acaCal", acaCal);
    form.append("fk_course", course);
    form.append("pkId", pkId);

    var settings = {
        "url": host + "api_exam_picoms/public/misExamTimetbl/showByCalCrs2",
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
        obj_examTmt = JSON.parse(response);
        returnValue();
    });
}

function listTblNo(id, returnValue) {
    var settings = {
        "url": host + "api_exam_picoms/public/misExamStd/listByExam_resit/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_tblNoList = response;
        returnValue();
    });
}

function paperType(returnValue) {
    var settings = {
        "url": host + "api_exam_picoms/public/misExamPprType/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_pprType = response;
        returnValue();
    });
}

function invgltrList(id, returnValue) {
    var settings = {
        "url": host + "api_exam_picoms/public/misExamInvgltr/listByExmVenue/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_invgltr = response;
        returnValue();
    });
}

function chkExmInvgltr(venue, staff, returnValue) {
    var form = new FormData();
    form.append('fk_venue', venue);
    form.append('fk_lect', staff);

    var settings = {
        "url": host + "api_exam_picoms/public/misExamInvgltr/chkExmInvgltr",
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
        obj_invgltr = JSON.parse(response);
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

function listCenter(clg, returnValue) {
    var settings = {
        "url": host + "api_exam_picoms/public/misExamCenter/listByCamAct/" + clg,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_exmCenter = response;
        returnValue();
    });
}

function listExmVenue(id, returnValue) {
    var settings = {
        "url": host + "api_exam_picoms/public/misExamVenue/listByExam/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_exmVenue = response;
        returnValue();
    });
}

function chkStdExist(id, returnValue) {
    var settings = {
        "url": host + "api_exam_picoms/public/misExamStd/chkStdExist/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_exmStudent = response;
        returnValue();
    });
}

function chkVenueExist(data, returnValue) {
    var form = new FormData();
    form.append('fk_venue', data.fk_venue);
    form.append('fk_exam', data.fk_exam);
    form.append('exam_date', data.exam_date);
    form.append('exam_startTime', data.exam_startTime);
    form.append('exam_endTime', data.exam_endTime);

    var settings = {
        "url": host + "api_exam_picoms/public/misExamStd/chkExist",
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
        obj_exmStd = JSON.parse(response);
        returnValue();
    });
}