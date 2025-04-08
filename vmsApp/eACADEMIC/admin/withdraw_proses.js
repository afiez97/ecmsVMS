
//FIRST LOAD PAGE --------------------------------------------------------------------
$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let wdrawId = window.sessionStorage.wdrawId;
    $('#withdrawId').val(wdrawId);
    
    $("#loading_modal").modal("show");
    typeAccess();
    // formAdminAR


    if (dataPK == 1) {
        $(".admDeanFac").prop("disabled", false);
        $(".admAR").prop("disabled", false);
    
        // $("#quit_validation_status").prop("disabled", true);
        // $("#quit_validation_note").prop("disabled", true);
        // $("#formClearance :input").prop("disabled", true);
        
    }else if(dataPK == 2){
        $(".admDeanFac").prop("disabled", false);
    }else if(dataPK == 8){
        $(".admAR").prop("disabled", false);
        // $("#formAdminAR :input").prop("disabled", true);
    }

    wthdrwData(wdrawId, function(){
        if(obj_withdraw.success){
            let data = obj_withdraw.data;
            
            $("#stu_id").html(data.stu_id);
            $("#stu_name").html(data.stu_name);
            $("#pgm_id").html(data.pgm_name);
            $("#cur_semester").html(data.cur_semester);
            $("#quit_code").html(data.quit_code);
            $("#quit_attachment").html(data.quit_attachment);

            // tab admin faculty
            $('#quit_validation_status').val(data.quit_validation_status);
            $('#quit_validation_note').val(data.quit_validation_note);

            // tab Clearance
            if( data.quit_clearance_hepa == 'Yes'){ $('#quit_clearance_hepa').prop('checked', true) }
            else if( data.quit_clearance_hepa == 'No'){ $('#quit_clearance_hepa').prop('checked', false) }

            if( data.quit_clearance_library == 'Yes'){ $('#quit_clearance_library').prop('checked', true) }
            else if( data.quit_clearance_library == 'No'){ $('#quit_clearance_library').prop('checked', false) }

            if( data.quit_clearance_financing == 'Yes'){ $('#quit_clearance_financing').prop('checked', true) }
            else if( data.quit_clearance_financing == 'No'){ $('#quit_clearance_financing').prop('checked', false) }

            if( data.quit_clearance_finance == 'Yes'){ $('#quit_clearance_finance').prop('checked', true) }
            else if( data.quit_clearance_finance == 'No'){ $('#quit_clearance_finance').prop('checked', false) }

            // tab Admin A&R
            $('#quit_approval_status').val(data.quit_approval_status);
            $('#quit_approval_note').val(data.quit_approval_note);

            $("#loading_modal").modal("hide");
        }
    });
});
var confirmed = false;


$('#btnBack').click(function(){
    window.location.replace('adminPage.html');
});


function wthdrwData(id, returnValue){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/misStdWithdraw/showById/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_withdraw = response;
        returnValue();
    });
}


//-------------------------------------------------- save Faculty Admin --------------------------------------------------//
$("#formFaculty").on('submit',function(e){
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
            $("#loading_modal").modal("show");

            let pk_id = $('#withdrawId').val();
            let quit_validation_status = $("#quit_validation_status").val();
            let quit_validation_note = $('#quit_validation_note').val();
                
            var form = new FormData();
            form.append("pk_id", pk_id);
            form.append("quit_validation_status", quit_validation_status);
            form.append("quit_validation_note", quit_validation_note);
            form.append("withdraw_status", 'In Progress');
            
            var settings = {
                "url": host+"api_pengurusan_pelajar/public/misStdWithdraw/uptFacAdmin",
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
                    $("#loading_modal").modal("hide");
                    swal(result.message, result.data, "error");
                    return;
                }

                $("#loading_modal").modal("hide");
                window.location.reload();
            });
        });
    }
});//-------------------------------------------------- end save Faculty Admin --------------------------------------------------//


//-------------------------------------------------- save Clearance --------------------------------------------------//
$("#formClearance").on('submit',function(e){
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
            $("#loading_modal").modal("show");

            let pk_id = $('#withdrawId').val();
            let quit_clearance_hepa = '';
            if($('#quit_clearance_hepa').prop('checked') == true){ quit_clearance_hepa = 'Yes'; }
            else{ quit_clearance_hepa = 'No' }

            let quit_clearance_library = '';
            if($('#quit_clearance_library').prop('checked') == true){ quit_clearance_library = 'Yes'; }
            else{ quit_clearance_library = 'No' }

            let quit_clearance_financing = '';
            if($('#quit_clearance_financing').prop('checked') == true){ quit_clearance_financing = 'Yes'; }
            else{ quit_clearance_financing = 'No' }

            let quit_clearance_finance = '';
            if($('#quit_clearance_finance').prop('checked') == true){ quit_clearance_finance = 'Yes'; }
            else{ quit_clearance_finance = 'No' }
                
            var form = new FormData();
            form.append("pk_id", pk_id);
            form.append("quit_clearance_hepa", quit_clearance_hepa);
            form.append('quit_clearance_library', quit_clearance_library);
            form.append('quit_clearance_financing', quit_clearance_financing);
            form.append('quit_clearance_finance', quit_clearance_finance);
            
            var settings = {
                "url": host+"api_pengurusan_pelajar/public/misStdWithdraw/uptClearance",
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
                    $("#loading_modal").modal("hide");
                    swal(result.message, result.data, "error");
                    return;
                }

                $("#loading_modal").modal("hide");
                window.location.reload();
            });
        });
    }
});//-------------------------------------------------- end save Clearance --------------------------------------------------//


//-------------------------------------------------- save Admin A&R --------------------------------------------------//
$("#formAdminAR").on('submit',function(e){
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
            $("#loading_modal").modal("show");

            let pk_id = $('#withdrawId').val();
            let quit_approval_status = $("#quit_approval_status").val();
            let quit_approval_note = $('#quit_approval_note').val();
                
            var form = new FormData();
            form.append("pk_id", pk_id);
            form.append("quit_approval_status", quit_approval_status);
            form.append('quit_approval_note', quit_approval_note);
            form.append('withdraw_status', 'Complete');
            
            var settings = {
                "url": host+"api_pengurusan_pelajar/public/misStdWithdraw/uptARAdmin",
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
                    $("#loading_modal").modal("hide");
                    swal(result.message, result.data, "error");
                    return;
                }

                if(quit_approval_status == "Passed"){
                    let std_studentid = $("#stu_id").html();

                    let forms = new FormData();
                    forms.append('std_studentid',std_studentid);                    
                    forms.append('status_academic','7');
                    let obj = new post(host+'api_pengurusan_pelajar/public/pelajar/change/statusAcademic',forms,'picoms ' + window.sessionStorage.token).execute();

                    if(obj.success){
                        $("#loading_modal").modal("hide");
                        window.location.reload();
                    }
                    else{
                        swal('error','change status academic fail','warning');
                    }                    
                }
            });
        });
    }
});//-------------------------------------------------- end save Admin A&R --------------------------------------------------//


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
            $("#loading_modal").modal("show");
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
                    $("#loading_modal").modal("hide");
                    swal(result.message, result.data, "error");
                    return;
                }
            });
        });
    }
});//-------------------------------------------------- end upt Student Financial --------------------------------------------------//