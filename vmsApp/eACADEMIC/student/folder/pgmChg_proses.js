
//FIRST LOAD PAGE --------------------------------------------------------------------
$(function(){
    $.ajaxSetup ({
        cache: false
    });

    $('#btnBack').click(function(){
        window.location.replace('adminPage.html');
    });
    $("#loading_modal").modal("show");
    var id = getUrlVars()['id'];
    loadDropListStatus(function(){
        $("#app_admin").html('<option value="">- Choose Status -</option>');
        $("#app_curr_fac_dean").html('<option value="">- Choose Status -</option>');
        $("#app_new_fac_dean").html('<option value="">- Choose Status -</option>');

        $.each(obj_accepted.data,function(i,field){
            $("#app_admin").append('<option value="'+field.sts_accepted_code+'">'+field.sts_accepted_en+'</option>');
            $("#app_curr_fac_dean").append('<option value="'+field.sts_accepted_code+'">'+field.sts_accepted_en+'</option>');
            $("#app_new_fac_dean").append('<option value="'+field.sts_accepted_code+'">'+field.sts_accepted_en+'</option>');

        });
    });

    chg_program(id,function(){
        if(obj_chgProgram.success){
            
            $("#app_admin").val(obj_chgProgram.data.recordstatus);
            $("#app_curr_fac_dean").val(obj_chgProgram.data.std_dekanStatus);
            $("#app_new_fac_dean").val(obj_chgProgram.data.std_new_fac);

            $("#std_studentid1").html(obj_chgProgram.data.studentid);
            $("#sti_name1").html(obj_chgProgram.data.std_name);
            programme(obj_chgProgram.data.std_pre_programme,function(){
                $("#cgp_old_pgm1").html(obj_programme.data.pgm_name);
            });
            programme(obj_chgProgram.data.std_new_programme,function(){
                $("#cgp_new_pgm1").html(obj_programme.data.pgm_name);
            });
            $("#new_student_fees").val(obj_chgProgram.data.std_new_fee);
            $("#loading_modal").modal("hide");

        }
        else{
            window.location.replace('adminPage.html');
        }
    });


});

function chg_program(id,returnValue){
    var form = new FormData();
    var settings = {
    "url": host+"api_pengurusan_pelajar/public/chg_program/getdata/"+id,
    "method": "GET",
    "timeout": 0,
    "processData": false,
    "mimeType": "multipart/form-data",
    "contentType": false,
    "data": form
    };

    $.ajax(settings).done(function (response) {
        
        obj_chgProgram = JSON.parse(response);
        returnValue();

    });
}

function programme(pgm_id,returnValue){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/programme/show/"+pgm_id,
        "method": "GET",
        "timeout": 0,
      };
      
      $.ajax(settings).done(function (response) {  
          obj_programme = response;      
          returnValue();
      });
}



//LOAD STATUS APPROVAL DROPDOWN LIST OPTION-----------------------------------------
function loadDropListStatus(returnValue){

    var settingStatus = {
        "url": host+"api_public_access/public/acceptedList",
        "method": "GET",
        "timeout": 0,
      };
      
      $.ajax(settingStatus).done(function (response) {
          obj_accepted = response;
          returnValue();
      });

}

// SUBMIT APPROVAL INFO ---------------------------------------------------------
var confirmed = false;

$("#formUpdate1").on('submit',function(e){
    //alert('hai');
    let $this = $(this);
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Programme Change",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function(){
            $("#loading_modal").modal("show");
            let id = getUrlVars()['id'];
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
                    "processData": false,
                    "mimeType": "multipart/form-data",
                    "contentType": false,
                    "data": form
                    };
    
                $.ajax(settings).done(function (response) {
                    
                    result = JSON.parse(response);
                    if (!result.success) {
                        $("#loading_modal").modal("hide");
                        swal(result.message, result.data, "error");
                        return;
                    }
    
                    $("#loading_modal").modal("hide");
                    sessionStorage.token = result.token;
                    window.location.replace("pgmChg_proses.html?id="+id);
                });
        
        });
    }
});

$("#formUpdate2").on('submit',function(e){
    let $this = $(this);
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Programme Change",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function(){
            $("#loading_modal").modal("show");
            let id = getUrlVars()['id'];
            let std_dekanStatus = $("#app_curr_fac_dean").val();
                
                var form = new FormData();
                form.append("id", id);
                form.append("std_dekanStatus", std_dekanStatus);
                form.append("std_new_fac", "EDT");
                
                var settings = {
                    "url": host+"api_pengurusan_pelajar/public/chg_program/update",
                    "method": "POST",
                    "timeout": 0,
                    "processData": false,
                    "mimeType": "multipart/form-data",
                    "contentType": false,
                    "data": form
                    };
    
                $.ajax(settings).done(function (response) {
                    
                    result = JSON.parse(response);
                    if (!result.success) {
                        $("#loading_modal").modal("hide");
                        swal(result.message, result.data, "error");
                        return;
                    }
    
                    $("#loading_modal").modal("hide");
                    sessionStorage.token = result.token;
                    window.location.replace("pgmChg_proses.html?id="+id);
                });
        
        });
    }
});

$("#formUpdate3").on('submit',function(e){
    let $this = $(this);
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Programme Change",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function(){
            $("#loading_modal").modal("show");
            let id = getUrlVars()['id'];
            let app_new_fac_dean = $("#app_new_fac_dean").val();
                
                var form = new FormData();
                form.append("id", id);
                form.append("std_new_fac", app_new_fac_dean);
                
                var settings = {
                    "url": host+"api_pengurusan_pelajar/public/chg_program/update",
                    "method": "POST",
                    "timeout": 0,
                    "processData": false,
                    "mimeType": "multipart/form-data",
                    "contentType": false,
                    "data": form
                    };
    
                $.ajax(settings).done(function (response) {
                    
                    result = JSON.parse(response);
                    if (!result.success) {
                        $("#loading_modal").modal("hide");
                        swal(result.message, result.data, "error");
                        return;
                    }
    
                    $("#loading_modal").modal("hide");
                    sessionStorage.token = result.token;
                    window.location.replace("pgmChg_proses.html?id="+id);
                });
        
        });
    }
});

$("#formUpdate4").on('submit',function(e){
    let $this = $(this);
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Programme Change",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function(){
            $("#loading_modal").modal("show");
            let id = getUrlVars()['id'];
            let new_student_fees = $("#new_student_fees").val();
                
                var form = new FormData();
                form.append("id", id);
                form.append("std_new_fee", new_student_fees);
                form.append("recordstatus", "COM");
                
                var settings = {
                    "url": host+"api_pengurusan_pelajar/public/chg_program/update",
                    "method": "POST",
                    "timeout": 0,
                    "processData": false,
                    "mimeType": "multipart/form-data",
                    "contentType": false,
                    "data": form
                    };
    
                $.ajax(settings).done(function (response) {
                    
                    result = JSON.parse(response);
                    if (!result.success) {
                        $("#loading_modal").modal("hide");
                        swal(result.message, result.data, "error");
                        return;
                    }
    
                    $("#loading_modal").modal("hide");
                    sessionStorage.token = result.token;
                    window.location.replace("pgmChg_proses.html?id="+id);
                });
        
        });
    }
});

// function getStudentFees(returnValue,student_id){

//     var form = new FormData();
//     form.append("std_studentid", student_id);

//     var settingStdFees = {
//     "url": host+"api_pengurusan_pelajar/public/financialStudentView",
//     "method": "POST",
//     "timeout": 0,
//     "processData": false,
//     "mimeType": "multipart/form-data",
//     "contentType": false,
//     "data": form
//     };

//     $.ajax(settingStdFees).done(function (responseStdFees) {
        
//         let result = JSON.parse(responseStdFees)
//         let new_student_fees = result.data.fin_fees;
//         form.append("curr_student_fees", new_student_fees);
//         returnValue();
//     });

//     // console.log();
// }