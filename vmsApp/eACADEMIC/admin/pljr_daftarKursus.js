$(function(){
    $.ajaxSetup ({
        cache: false
    });

    $.fn.select2.defaults.set( "theme", "bootstrap" );

    $("#loading_modal").modal('show');

    let student_id = window.sessionStorage.std_studentid;
    $('#stdId').val(student_id);

    student_info(student_id, function(){
        let pgm_id = obj_stdInfo.data.pgm_fk;
        let session = obj_stdInfo.data.sti_session_id.replace('-','/');
        let intake = obj_stdInfo.data.cur_intake;
        $('#pgm_id').val(pgm_id);
        $('#stts_academic').val(obj_stdInfo.data.status_academic);

        getPgmDet(pgm_id, session, intake, function(){
            let pgmDetId = obj_pgmDet.data.dtp_id;
            $('#pgmDet_id').val(pgmDetId);
            
            listSemByPgmDet(pgmDetId, function(){
                $('#reg_semester').append('<option value="">- Choose -</option>');
                $.each(obj_cotSem.data, function(i, item){
                    $('#reg_semester').append('<option value="'+item.pgm_semester+'">'+item.pgm_semester+'</option>');
                });
            });
        });
    });

    // check current semester student
    chkStdCurSem(student_id, function(){
        let count = obj_stdCurSem.data.length;
        if(count > 0){
            $.each(obj_stdCurSem.data.slice(0,1), function(i, item){
                $('#pk_semester').val(item.pk_cur_academic);
                $('#cur_semester').val(item.std_semester);

                // subject register
                subjectList(student_id, item.std_semester, function(){
                    let data = obj_subjectList.data;
                    createTblRegCrs(data);
                });
            });
        }
    });

    // select academic session
    curYearAct(function(){
        $('#cur_year').append('<option value="">- Choose -</option>');
        $.each(obj_curYearAct.data, function (i, item){
            $('#cur_year').append('<option value="'+item.cur_year.replace('/','-')+'">'+item.cur_year+'</option>');
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:'
        });
    });

    $('#btnSave').hide();
    addDropPolAct(function(){
        $.each(obj_addDropPol.data, function(i, item){
            let sDate = item.start_date;
            let eDate = item.end_date;

            var currentDate = new Date().toJSON().slice(0,10);
            var from = new Date(sDate);
            var to   = new Date(eDate);
            var check = new Date(currentDate);

            if(check >= from && check <= to){ $('#btnSave').show(); }
            else{ $('#btnSave').hide(); }
        });
    });
});
var confirmed = false;


$('#reg_semester').change(function(){
    let sem = $(this).val();
    let pgmDet_id = $('#pgmDet_id').val();
    let stdId = $('#stdId').val();
    $('#findSemId').val('');

    listCrsByPgmDetSem(sem, pgmDet_id, function(){
        $('#course_code').html('');
        $('#course_code').append('<option value="">- Choose -</option>');
        $.each(obj_cotDet.data, function(i, item){
            $('#course_code').append('<option ccd_id="'+item.ccd_id+'" value="'+item.fk_course+'">'+item.crs_code.toUpperCase()+' - '+item.crs_name.toUpperCase()+'</option>');
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:',
        });
    });
    $('#notice').html('');

    // cek if sem exist
    findSem(stdId, sem, function(){
        $.each(obj_curSem.data, function(i, item){
            $('#findSemId').val(item.pk_cur_academic);
        });
    });
});


// check course condition before register
$('#course_code').change(function(){
    $('#notice').html('');
    let crs_id = $(this).val();
    let fk_cotDet = $("#course_code").find('option:selected').attr('ccd_id');
    let std_id = $('#stdId').val();
    let reg_semester = $("#reg_semester").val();

    // check if exist
    chkExistReg(std_id, reg_semester, fk_cotDet, function(){
        let count = obj_regCrs.data.length;
        if(count != 0){
            $.each(obj_regCrs.data, function(i, item){
                let status = item.rsb_status;
                if(status == 'Register'){
                    $('#course_code').val('').trigger('change');
                    swal({
                        text: "Course registered.",
                        type: "info"
                    });
                }
                else if(status == 'Drop'){ $('#btnSave').html('<button type="button" class="btn info p-x-md" onclick="uptCrsDrop(\''+item.rsb_id+'\')">Save</button>') }
            });
        }
        else{ $('#btnSave').html('<input type="submit" class="btn info p-x-md " value="Save" id="submit-course">') }
    });

    // check pre-requisite
    if(!(crs_id == '' || crs_id == null)){
        crsPrereq(crs_id, function(){
            let ttlPre = obj_crsDet.data.length;
            if(ttlPre != 0){
                $.each(obj_crsDet.data, function(i, item){
                    let preReq = item.prerequisite;
                    chkStatusRegCrs(std_id, preReq, function(){
                        let count = obj_regCrs.data.length;
                        if(count != 0){
                            $.each(obj_regCrs.data, function(i, item){
                                let status = item.rsb_status;
                                if(status != 'Complete'){
                                    $('#notice').html('Pre-requisite Course not Complete.');
                                    $('#course_code').val('');
                                }
                            });
                        }
                        else{
                            $('#notice').html('Pre-requisite Course not Complete.');
                            $('#course_code').val('');
                        }
                    });
                    return false;
                });
            }
        });
    }
});


//-------------------------------------------------- add new --------------------------------------------------//
$("#formAddNew").on('submit',function(e){
    if (!confirmed){
        e.preventDefault();
        swal({
            title: "Add Course",
            text: "Are you sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function(){
            let student_id = $('#stdId').val();
            let std_sttsAca = $('#stts_academic').val();
            let pk_curSem = $('#findSemId').val();
            let pgm_id = $("#pgm_id").val();
            let cur_year = $("#cur_year").val().replace('-','/');
            let reg_semester = $("#reg_semester").val();
            let crs_code = $("#course_code").val();
            let fk_cotDet = $("#course_code").find('option:selected').attr('ccd_id');

            var form = new FormData();
            form.append("std_studentid", student_id);
            form.append("pgm_id", pgm_id);
            form.append("cur_year", cur_year);
            form.append("reg_semester", reg_semester);
            form.append("crs_code", crs_code);
            form.append("rsb_status", 'Register');
            form.append("fk_cotDet", fk_cotDet);
            form.append("recordstatus", 'ADD');
            
            var settings = {
                "url": host+"api_pengurusan_pelajar/public/misStdRegsub/register",
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
                let result = JSON.parse(response);
                if(result.success){
                    if(std_sttsAca != 1){ chgSttsAcdmc(student_id); }
                    if( pk_curSem == '' ){ chgStdSem(student_id, reg_semester, pk_curSem) }
                    window.location.reload();
                }
                else{ swal("Failed",response.message,"error"); }
            });
        });
    }
});
//-------------------------------------------------- add new --------------------------------------------------//


//-------------------------------------------------- drop course --------------------------------------------------//
function dropCrs(id){
    var d = new Date();
    var strDate = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();

    var form = new FormData();
    form.append("rsb_id", id);
    form.append("rsb_status", 'Drop');
    form.append("drop_date", strDate);
    form.append("recordstatus", 'EDT');

    swal({
        title: "Drop Course",
        text: "Are You Sure?",
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Drop",
        confirmButtonColor: "#ef193c",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false
    }).then(function(){
        var settings = {
            "url": host+"api_pengurusan_pelajar/public/misStdRegsub/addDrop",
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
            if (!result.success){
                Swal(result.message, result.data, "error");
                return;
            }
            window.location.reload();
        });
    });
}
//-------------------------------------------------- end drop course --------------------------------------------------//


//-------------------------------------------------- change status drop --------------------------------------------------//
function uptCrsDrop(id){
    var form = new FormData();
    form.append("rsb_id", id);
    form.append("rsb_status", 'Register');
    form.append("drop_date", '');
    form.append("recordstatus", 'EDT');

    swal({
        title: "Add Course",
        text: "Are You Sure?",
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Add",
        confirmButtonColor: "#2196f3",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false
    }).then(function(){
        var settings = {
            "url": host+"api_pengurusan_pelajar/public/misStdRegsub/addDrop",
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
            if (!result.success){
                Swal(result.message, result.data, "error");
                return;
            }
            window.location.reload();
        });
    });
}
//-------------------------------------------------- end change status drop course --------------------------------------------------//


//-------------------------------------------------- change status academic --------------------------------------------------//
function chgSttsAcdmc(id){
    var form = new FormData();
    form.append("std_studentid", id);
    form.append("status_academic", 1);
    form.append("recordstatus", 'EDT');
    
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/misStdInfo/uptSttsAca",
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
        if (!result.success){
            Swal(result.message, result.data, "error");
            return;
        }
    });
}
//-------------------------------------------------- change status academic --------------------------------------------------//


//-------------------------------------------------- add student semester --------------------------------------------------//
function chgStdSem(id, sem){
    var form = new FormData();
    form.append("std_studentid", id);
    form.append("std_semester", sem);
    form.append("recordstatus", recordstatus);
    
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/curAcademic/"+formUrl,
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
        if (!result.success){
            Swal(result.message, result.data, "error");
            return;
        }
    });
}
//-------------------------------------------------- end add student semester --------------------------------------------------//


function createTblRegCrs(data){
    var columns = [
        { "name": "bil", "title": "No." },
        { "name": "cur_year", "title": "Session" },
        { "name": "reg_semester", "title": "Semester" },
        { "name": "crs_code", "title": "Course Code" },
        { "name": "credit", "title": "Credit", "breakpoints": "md sm xs" },
        { "name": "btn_lect", "title": "Lecturer", "breakpoints": "md sm xs" },
        { "name": "upt_btn", "title": "", "breakpoints": "md sm xs" },
    ];

    let bil = 1;
    let convertList = JSON.stringify(data);
    $("#dataList").val(convertList);
    var list = [];

    $.each(data, function (i, field){
        let cotDet_id = field.fk_cotDet;
        list.push({
            bil: bil++, cur_year: field.cur_year, reg_semester: field.reg_semester, crs_code: '<span class="text-uppercase">'+field.crsCode+' - '+field.crs_name+'</span>', credit: field.crs_credit,
            btn_lect: '<span id="lectList-'+field.fk_cotDet+'"></span>',
            upt_btn: '<button class="md-btn md-raised red" onclick="dropCrs(\''+field.rsb_id+'\')">Drop</button>'
        });

        // list lecturer by cotDet
        getLect(cotDet_id, function(){
            $.each(obj_lect.data, function(j, itemJ){
                j = j+1; 
                $('#lectList-'+cotDet_id).append(j+'. <span class="text-uppercase">'+itemJ.emp_name+'</span><br>');
            });
        });
    });

    $("#subjectList").footable({
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
}


function subjectList(id, sem, returnValue){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/misStdRegsub/listByStdReg/"+id+"/"+sem,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };
      
    $.ajax(settings).done(function (response){
        obj_subjectList = response;
        returnValue();
    });
}

function listSemByPgmDet(id, returnValue){
    var settings = {
        "url": host + "api_tetapan_picoms/public/misPrmCOTSem/listByPgmdet/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_cotSem = response;
        returnValue();
    });
}

function listCrsByPgmDetSem(sem, id, returnValue){
    var form = new FormData();
    form.append("cot_semester", sem);
    form.append("fk_pgm_det", id);

    var settings = {
        "url": host + "api_tetapan_picoms/public/misPrmCrsCOTDet/listByPgm",
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
        obj_cotDet = JSON.parse(response);
        returnValue();
    });
}

function crsPrereq(id, returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmCourseDet/list/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
        "async": false
    };
      
    $.ajax(settings).done(function (response){
        obj_crsDet = response;
        returnValue();
    });
}

function addDropPolAct(returnValue){
    var settings = {
        "url": host+"api_polisi/public/misAdddropPol/listActive",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_addDropPol = response;
        returnValue();
    });
}

function getLect(id, returnValue){
    var settings = {
        "url": host + "api_lecturer_picoms/public/misLectCrsPrm/listByCotDet/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_lect = response;
        returnValue();
    });
}

function chkExistReg(stdId, sem, cotDet, returnValue){
    var form = new FormData();
    form.append("std_studentid", stdId);
    form.append("reg_semester", sem);
    form.append("fk_cotDet", cotDet);

    var settings = {
        "url": host + "api_pengurusan_pelajar/public/misStdRegsub/chkReg",
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
        obj_regCrs = JSON.parse(response);
        returnValue();
    });
}

function chkStdCurSem(id, returnValue){
    var settings = {
        "url": host + "api_pengurusan_pelajar/public/curAcademic/chkStdCurSem/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_stdCurSem = response;
        returnValue();
    });
}