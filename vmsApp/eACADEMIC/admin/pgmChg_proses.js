$(function(){
    $.ajaxSetup ({
        cache: false
    });

    // $.fn.select2.defaults.set( "theme", "bootstrap" );    

    let id = window.sessionStorage.pgmChgId;
    $('#pgmChgId').val(id);
    
    // $("#loading_modal").modal("show");
    typeAccess();
    // formAdminAR


    if (dataPK == 1) {
        $(".admin_facCurr").prop("disabled", false);
        $(".admin_facNew").prop("disabled", false);
        $(".admin_AR").prop("disabled", false);
    
        // $("#app_admin").prop("disabled", true);
        // $("#quit_validation_note").prop("disabled", true);
        // $("#formClearance :input").prop("disabled", true);
        
    }
    // else if(dataPK == 2){

    //     if (data.emp_division == obj_chgProgram.facPre_Code) {
    //     $("#app_curr_fac_dean").prop("disabled", true);
            
    //     }else if(data.emp_division == obj_chgProgram.facNew_Code){
    //         $("#app_new_fac_dean").prop("disabled", true);
    //     }
    // } 
     if(dataPK == 8){
        $(".admin_AR").prop("disabled", false);
        
        // $("#app_admin").prop("disabled", true);

        // $("#session_id").prop("disabled", true);

    }

    loadDropListStatus(function(){
        $("#app_admin").append('<option value="">- Choose -</option>');
        $("#app_curr_fac_dean").html('<option value="">- Choose Status -</option>');
        $("#app_new_fac_dean").html('<option value="">- Choose Status -</option>');

        $.each(obj_accepted.data,function(i,field){
            $("#app_admin").append('<option value="'+field.sts_accepted_code+'">'+field.sts_accepted_en+'</option>');
            $("#app_curr_fac_dean").append('<option value="'+field.sts_accepted_code+'">'+field.sts_accepted_en+'</option>');
            $("#app_new_fac_dean").append('<option value="'+field.sts_accepted_code+'">'+field.sts_accepted_en+'</option>');

        });

        chg_program(id,function(){
            // if(obj_chgProgram.success){
    typeAccess();
                    console.log(obj_chgProgram.data.facNew_Code+' = '+data.emp_division);

                if(dataPK == 2){

                    $(".admin_AR").prop("disabled", true);

                    console.log(obj_chgProgram);


                    // console.log(obj_chgProgram.data.facNew_Code+' = '+data.emp_division);
                    // console.log(data.emp_division +' = '+obj_chgProgram.data.facPre_Code);
                    
                    if (data.emp_division == obj_chgProgram.data.facPre_Code) {
                        $(".admin_facCurr").prop("disabled", false);
                    console.log(data.emp_division +' = '+obj_chgProgram.data.facPre_Code);

                    }
                     if(data.emp_division == obj_chgProgram.data.facNew_Code){
                        $(".admin_facNew").prop("disabled", false);
                        console.log(obj_chgProgram.data.facNew_Code+' = '+data.emp_division);

                    }
                }
                
                $("#app_admin").val(obj_chgProgram.data.recordstatus);
                $("#app_curr_fac_dean").val(obj_chgProgram.data.std_dekanStatus);
                $("#app_new_fac_dean").val(obj_chgProgram.data.std_new_fac);
    
                $("#std_studentid1").html(obj_chgProgram.data.studentid);
                $("#sti_name1").html(obj_chgProgram.data.std_name);
                $("#cgp_old_pgm1").html(obj_chgProgram.data.prePgm);
                $("#cgp_new_pgm1").html(obj_chgProgram.data.newPgm);
    
                $("#new_student_fees").val(obj_chgProgram.data.std_new_fee);
                
                $("#pgm_id").val(obj_chgProgram.data.pgm_id);
                $("#pgm_fk").val(obj_chgProgram.data.std_new_programme);
                $("#cam_id").val(obj_chgProgram.data.cam_id);
                // $("#loading_modal").modal("hide");
            // }
            // else{ window.location.replace('adminPage.html'); }
        });
    });

    acaSession(function(){
        $('#session_id').append('<option value="">- Choose Session -</option>');
        $.each(obj_acaSession.data, function (i, item){
            $('#session_id').append('<option value="'+item.cur_year.replace('/','-')+'">'+item.cur_year+'</option>');
        });
    });

    slctIntake(function(){
        $('#cur_intake').append('<option value="">- Choose Intake -</option>');
        $.each(obj_intake.data, function(i, item){
            $('#cur_intake').append('<option value="'+item.intake_month + '-' + item.intake_year +'">'+item.intake_month + '-' + item.intake_year +'</option>');
        });

        // $("#intake_filter").select2({
        //     width: null,
        //     containerCssClass: ':all:'
        // });
    });
});
var confirmed = false;


$('#btnBack').click(function(){
    window.location.replace('adminPage.html');
});


function chg_program(id,returnValue){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/chg_program/getdata/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_chgProgram = response;
        returnValue();
    });
}



//LOAD STATUS APPROVAL DROPDOWN LIST OPTION-----------------------------------------
function loadDropListStatus(returnValue){
    var settingStatus = {
        "url": host+"api_public_access/public/acceptedList",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };
    
    $.ajax(settingStatus).done(function (response) {
        obj_accepted = response;
        returnValue();
    });
}


//-------------------------------------------------- save Check Eligibility --------------------------------------------------//
$("#formUpdate1").on('submit',function(e){
    if (!confirmed){
        e.preventDefault();
        swal({
            title: "Save",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function(){
            // $("#loading_modal").modal("show");
            let id = $('#pgmChgId').val();
            let recordstatus = $("#app_admin").val();
            let std_dekanStatus = "EDT";
                
            var form = new FormData();
            form.append("id", id);
            form.append("recordstatus", recordstatus);
            form.append("std_dekanStatus", std_dekanStatus);
            
            var settings = {
                "url": host+"api_pengurusan_pelajar/public/chg_program/update",
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
                if (!result.success) {
                    // $("#loading_modal").modal("hide");
                    swal(result.message, result.data, "error");
                    return;
                }

                // $("#loading_modal").modal("hide");
                window.location.reload();
            });
        });
    }
});//-------------------------------------------------- end save Check Eligibility --------------------------------------------------//


//-------------------------------------------------- save Current Faculty Dean --------------------------------------------------//
$("#formUpdate2").on('submit',function(e){
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Save",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function(){
            // $("#loading_modal").modal("show");

            let id = $('#pgmChgId').val();
            let std_dekanStatus = $("#app_curr_fac_dean").val();
                
            var form = new FormData();
            form.append("id", id);
            form.append("std_dekanStatus", std_dekanStatus);
            form.append("std_new_fac", "EDT");
            
            var settings = {
                "url": host+"api_pengurusan_pelajar/public/chg_program/update",
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
                if (!result.success) {
                    // $("#loading_modal").modal("hide");
                    swal(result.message, result.data, "error");
                    return;
                }

                // $("#loading_modal").modal("hide");
                window.location.reload();
            });
        });
    }
});//-------------------------------------------------- end save Current Faculty Dean --------------------------------------------------//


//-------------------------------------------------- save New Faculty Dean --------------------------------------------------//
$("#formUpdate3").on('submit',function(e){
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Save",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function(){
            // $("#loading_modal").modal("show");

            let id = $('#pgmChgId').val();
            let app_new_fac_dean = $("#app_new_fac_dean").val();
                
            var form = new FormData();
            form.append("id", id);
            form.append("std_new_fac", app_new_fac_dean);
            
            var settings = {
                "url": host+"api_pengurusan_pelajar/public/chg_program/update",
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
                if (!result.success) {
                    // $("#loading_modal").modal("hide");
                    swal(result.message, result.data, "error");
                    return;
                }

                // $("#loading_modal").modal("hide");
                window.location.reload();
            });
        });
    }
});//-------------------------------------------------- end save New Faculty Dean --------------------------------------------------//


//-------------------------------------------------- upt Student Financial --------------------------------------------------//
$("#formUpdate4").on('submit',function(e){
    if (!confirmed) { 
        e.preventDefault();
        swal({
            title: "Save",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function(){ 
            // $("#loading_modal").modal("show");
            let id = $('#pgmChgId').val();
            let new_student_fees = $("#new_student_fees").val();
                
            var form = new FormData();
            form.append("id", id);
            form.append("std_new_fee", new_student_fees);
            form.append("recordstatus", "COM");
            
            var settings = {
                "url": host+"api_pengurusan_pelajar/public/chg_program/update",
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
                if (!result.success) {
                    // $("#loading_modal").modal("hide");
                    swal(result.message, result.data, "error");
                    return;
                }

                // $("#loading_modal").modal("hide");
                window.location.reload();
            });
        });
    }
});//-------------------------------------------------- end upt Student Financial --------------------------------------------------//

$("#form_generate").on('submit',function(e){
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Save",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function(){
            let std_studentid = $("#std_studentid1").html();
            let cam_id = $("#cam_id").val();
            let session_id = $("#session_id").val();
            let cur_intake = $("#cur_intake").val();
            let pgm_id = $("#pgm_id").val();
            let pgm_fk = $("#pgm_fk").val();
            let sti_nationality = "2";
            
            let form = new FormData();
            form.append('std_studentid',std_studentid);
            form.append('cam_id',cam_id);
            form.append('session_id',session_id);
            form.append('cur_intake',cur_intake);
            form.append('pgm_id',pgm_id);
            form.append('pgm_fk',pgm_fk);
            form.append('sti_nationality',sti_nationality);

            let token = window.sessionStorage.token;

            chgProgGenerate(form,token,function(){
                if(obj_chgPgm.success){
                    swal("Generate Success",obj_chgPgm.message,'success');
                }
                else{
                    swal("Generate Fail",obj_chgPgm.message,'error');
                }
            });
        });
    }
});

function slctIntake(returnValue){
    let token = window.sessionStorage.token;
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmIntake/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "PICOMS "+token
          },
    };

    $.ajax(settings).done(function (response){
        obj_intake = response;
        returnValue();
    });
}

function acaSession(returnValue){
    let token = window.sessionStorage.token;
    var settings = {
        "url": host + "api_tetapan_picoms/public/misPrmCuryear/opt_curYear",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "PICOMS "+token
          },
    };

    $.ajax(settings).done(function (response) {
        obj_acaSession = response;
        returnValue();
    });
}


//cahnge programme submit

function chgProgGenerate(form,token,returnValue){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/pelajar/change/program",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Authorization": "PICOMS "+token
        },
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
    };

    let request = $.ajax(settings);
    request.done(function (response) {
        // let obj = JSON.parse(response);
        obj_chgPgm = JSON.parse(response);

        returnValue();
        
    });
    request.fail(function(){
        response = {"success":false,"message":"Change Programme Error","data":""};
        obj_chgPgm = response;

        returnValue();
    }); 
}