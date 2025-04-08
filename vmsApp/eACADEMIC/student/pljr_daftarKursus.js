$(function(){
    $.ajaxSetup ({
        cache: false
    });

    $.fn.select2.defaults.set( "theme", "bootstrap" );

    $("#loading_modal").modal('show');

    let student_id = window.sessionStorage.std_studentid;
    $('#stdId').val(student_id);

    student_info(student_id, function(){
        let data = obj_stdInfo.data;

        let pgm_id = data.pgm_fk;
        let intake_month = data.cur_intake;
        let int_month = intake_month.substring(0,3);
        let intake_year = data.cur_intake;
        let sti_session = data.sti_session_id;

        let int_year = intake_year.slice(4);

        $('#pgm_id').val(pgm_id);
        $('#stts_academic').val(data.status_academic);

        idPgmDetStd(pgm_id, int_month, int_year, function(){
            let total = Object.keys(obj_cotDet.data).length;

            if( total = 1 ){
                $('#std_pgmDet').val(obj_cotDet.data.dtp_id);
            }
        });

        // idPgmDetStd(pgm_id, intake_month, sti_session, function(){
        //     let total = Object.keys(obj_cotDet.data).length;
        //     console.log(obj_cotDet.data.dtp_id);


        //     if( total = 1 ){
        //         $('#std_pgmDet').val(obj_cotDet.data.dtp_id);
        //     }
        // });

        // select Academic Session

        polByCalCatAct(data.pgm_area, function(){
            
            let count = 0;
            // let count = obj_polAddDropCrs.data.length;

            
            $('#btnSave').hide();
            $('#btnSaveblock').hide();
            $('#aca_calendar').append('<option value="">- Choose -</option>');
            $.each(obj_polAddDropCrs.data, function (i, item){
            // console.log(count);

            let sDate = item.start_date;
            let eDate = item.end_date;

            var currentDate = new Date().toJSON().slice(0,10);

            var from = new Date(sDate);
            var to   = new Date(eDate);
            var check = new Date(currentDate);
            if(check >= from && check <= to){ 

                count++
                if(count == 1){
                    
                    console.log(item);
         
    
                    if(check >= from && check <= to){ 
                        
                        $('#submit-course').remove();
                        $('#btnSave').show(); 
                        $('#btnSave').append(`<input type="submit" class="btn info p-x-md " value="Save" id="submit-course">`); 
                        $('#btnSaveblock').hide();
                        
                    }
                    else{ 
                        $('#btnSave').remove(); 

                        $('#btnSave').hide(); 
                        $('#btnSaveblock').show();
                        // $('.policyLabel').removeClass('hide');
                        
                        // $('#btnSaveblock').append(`<input type="submit" class="btn info p-x-md " value="Save" title="Course Registration Ended" id="submit-course" disabled>`);

                    }

                    $('#aca_calendar').append('<option value="'+item.cal_id+'" calYear="'+item.cal_year+'">'+item.cal_year.replace('/','')+'/'+item.cal_cohort+'</option>');

                    // list course by active Add/Drop Policy
                    listByActPolicy2(student_id, item.cal_id, function(){
                        let data = obj_regCrs.data;
                        createTblRegCrs(data);
                    });
                }
                
            }
            // else{ 
            //     $('#btnSave').remove(); 

            //     $('#btnSave').hide(); 
            //     $('#btnSaveblock').show();
            //     $('.policyLabel').removeClass('hide');
                
            //     // $('#btnSaveblock').append(`<input type="submit" class="btn info p-x-md " value="Save" title="Course Registration Ended" id="submit-course" disabled>`);

            // }

            });
    
            $('.slct2').select2({
                width: null,
                containerCssClass: ':all:'
            });
        });
    });

    // check current semester student
    chkStdCurSem(student_id, function(){
        let count = obj_stdCurSem.data.length;
        $('#cur_semester').val(count);
    });
});
var confirmed = false;


//-------------------------------------------------- function onchange --------------------------------------------------//
// academic session
$('#aca_calendar').change(function(){
    let acaCal_id = $(this).val();
    let pgmDet = $('#std_pgmDet').val();
    let stdId = $('#stdId').val();
    $('#pk_semester').val('');

    listCrsStd(acaCal_id, pgmDet, function(){
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

    // check student sem
    chkStdSem(acaCal_id, stdId, function(){

        let count = obj_curAcademic.data.length;
        if(count == 1){
            $.each(obj_curAcademic.data, function(i, item){
                $('#pk_semester').val(item.pk_cur_academic);
            });
        }
    });
});


// check course condition before register
$('#course_code').change(function(){
    $('#notice').html('');
    let crs_id = $(this).val();
    let fk_cotDet = $("#course_code").find('option:selected').attr('ccd_id');
    let std_id = $('#stdId').val();
    let reg_semester = '';

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
                else if(status == 'Drop'){ 
                    $('#btnSave').html('<button type="button" class="btn info p-x-md" onclick="uptCrsDrop(\''+item.rsb_id+'\')">Save</button>') }
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
//-------------------------------------------------- end function onchange --------------------------------------------------//


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
            let pk_curSem = $('#pk_semester').val();
            let pgm_id = $("#pgm_id").val();
            let cur_year = $("#aca_calendar option:selected").attr("calYear");
            let crs_code = $("#course_code").val();
            let fk_cotDet = $("#course_code").find('option:selected').attr('ccd_id');
            let aca_session = $("#aca_calendar").val();
            let totalSem = $('#cur_semester').val();

            var form = new FormData();
            form.append("std_studentid", student_id);
            form.append("pgm_id", pgm_id);
            form.append("cur_year", cur_year);
            form.append("crs_code", crs_code);
            form.append("rsb_status", 'Register');
            form.append("fk_cotDet", fk_cotDet);
            form.append("aca_session", aca_session);
            form.append("recordstatus", 'ADD');
            
            // var settings = {
            //     "url": host+"api_pengurusan_pelajar/public/misStdRegsub/register",
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


            result = new post(host + "api_pengurusan_pelajar/public/misStdRegsub/register", form, 'picoms ' + window.sessionStorage.token).execute();

            if (result.success) {
                if( std_sttsAca != 1 ){ chgSttsAcdmc(student_id); }
                if( pk_curSem == '' ){ chgStdSem(student_id, totalSem, aca_session) }
                window.location.reload();
            } else {
                swal("Failed",result.message,"error");

            }

            // $.ajax(settings).done(function (response){
            //     let result = JSON.parse(response);
            //     if(result.success){
            //         if( std_sttsAca != 1 ){ chgSttsAcdmc(student_id); }
            //         if( pk_curSem == '' ){ chgStdSem(student_id, totalSem, aca_session) }
            //         window.location.reload();
            //     }
            //     else{ swal("Failed",response.message,"error"); }
            // });
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
function chgStdSem(id, totalSem, acaCal){
    var form = new FormData();
    form.append("std_studentid", id);
    form.append("std_semester", ++totalSem);
    form.append("fk_acaCal", acaCal);
    form.append("recordstatus", 'ADD');
    
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/curAcademic/stdAddSem",
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
        { "name": "cur_year", "title": "Academic Session" },
        { "name": "crs_code", "title": "Course Code" },
        { "name": "credit", "title": "Credit", "breakpoints": "md sm xs" },
        { "name": "stts_crs", "title": "Status", "breakpoints": "md sm xs" },
        { "name": "btn_lect", "title": "Lecturer", "breakpoints": "md sm xs" },
        // { "name": "crs_status", "title": "Course Status", "breakpoints": "md sm xs" },
        { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },

    ];

    let bil = 1;
    let convertList = JSON.stringify(data);
    $("#dataList2").val(convertList);
    var list = [];

    $.each(data, function (i, field){
        let cotDet_id = field.fk_cotDet;
        let acaSession = field.acaYear;
        let acaCal = acaSession.replace('/','')+'/'+field.cal_cohort;

        let btnDrop = '';
        if( field.rsb_status != 'Drop' ){ 

                    let sDate = field.start_date;
                    let eDate = field.end_date;
                    var currentDate = new Date().toJSON().slice(0,10);
                    var from = new Date(sDate);
                    var to   = new Date(eDate);
                    var check = new Date(currentDate);
    
                    if(check >= from && check <= to){ 
                        btnDrop = '<button class="md-btn md-raised red" onclick="dropCrs(\''+field.rsb_id+'\')" >Drop</button >' 
                    }
                    else{ 
                        btnDrop = '<button class="md-btn md-raised red" onclick="dropCrs(\''+field.rsb_id+'\')" disabled>Drop</button >' 
                    }

                }

            
        list.push({
            bil: bil++, cur_year: acaCal, 
            crs_code: '<span class="text-uppercase">'+field.crsCode+' - '+field.crs_name+'</span>', 
            credit: field.crs_credit,
            stts_crs: '<span class="text-uppercase">'+field.rsb_status+'</span>', 
            btn_lect: '<span id="lectList-'+field.fk_cotDet+'"></span>', 
            // crs_status: '<span class="text-uppercase">'+field.start_date+'</span>', 
            upt_btn: btnDrop
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

function polByCalCatAct(id, returnValue){
    var settings = {
        "url": host + "api_polisi/public/misAdddropPol/listByCalCatActive/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_polAddDropCrs = response;
        returnValue();
    });
}

function listCrsStd(acaCal, pgmDet, returnValue){
    var form = new FormData();
    form.append("acaCal", acaCal);
    form.append("pgmId", pgmDet);

    var settings = {
        "url": host + "api_tetapan_picoms/public/misPrmCrsCOTDet/crsByPgmdetAcaCal",
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

function idPgmDetStd(pgm, month, year, returnValue){
    var form = new FormData();
    form.append("pgm_id", pgm);
    form.append("intake_month", month);
    form.append("intake_year", year);

    var settings = {
        "url": host + "api_tetapan_picoms/public/misPrmProgDet/findPgmDetStd",
        // "url": host + "api_tetapan_picoms/public/misPrmProgDet/findPgmDetStd2",
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

function listByActPolicy(std, acaCal, returnValue){
    var form = new FormData();
    form.append("std_studentid", std);
    form.append("aca_session", acaCal);

    var settings = {
        "url": host + "api_pengurusan_pelajar/public/misStdRegsub/listByActPolicy",
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


function listByActPolicy2(std, acaCal, returnValue){
    var form = new FormData();
    form.append("std_studentid", std);
    form.append("aca_session", acaCal);

    var settings = {
        "url": host + "api_pengurusan_pelajar/public/misStdRegsub/listByActPolicy2",
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

function chkStdSem(acaCal, std, returnValue){
    var form = new FormData();
    form.append("std_studentid", std);
    form.append("fk_acaCal", acaCal);

    var settings = {
        "url": host + "api_pengurusan_pelajar/public/curAcademic/chkStdSem",
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
        obj_curAcademic = JSON.parse(response);
        returnValue();
    });
}