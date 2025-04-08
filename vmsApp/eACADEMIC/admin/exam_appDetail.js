$(function(){
    $.ajaxSetup ({
        cache: false
    });

    $.fn.select2.defaults.set( "theme", "bootstrap" );

    let app_id = window.sessionStorage.app_id;

    // application data
    showApp(app_id, function(){
        let data = obj_showApp.data;
        console.log(data);

        let paymentProof = data.app_upload;
        if(!(paymentProof == '' || paymentProof == null)){
            let docpaymentProof = paymentProof.slice(10);
            paymentProof = '<a target="_blank" style="color:cornflowerblue" href="'+host+'api_exam_picoms/public/upload_application/'+paymentProof+'"><span class="label info">'+docpaymentProof+'</span></a>';
        }

        $('#pkId').val(app_id);
        $('#school_status').val(data.school_status);
        $('#fnnceDep_status').val(data.fnnceDep_status);
        $('#exmUnit_status').val(data.exmUnit_status);
        $('#school_name').val(data.school_name);
        $('#school_date').val(data.school_date);
        $('#finance_name').val(data.fnnceDep_name);
        $('#finance_date').val(data.fnnceDep_date);
        $('#finance_receipt').val(data.fnnceDep_receipt);
        $('#examunit_name').val(data.exmUnit_name);
        $('#examunit_date').val(data.exmUnit_date);
        $('#student_id').html(data.student_id);
        $('#sti_name').html(data.sti_name);
        $('#sti_icno').html(data.sti_icno);
        $('#sti_phone').html(data.sti_contactno_mobile);
        $('#app_status').html(data.app_status);
        $('#cur_intake').html(data.cur_intake);
        $('#pgm_name').html(data.pgm_code+' - '+data.pgm_name);
        $('#app_type').html(data.app_type);
        $('#app_course').html(data.crs_code+' - '+data.crs_name);
        $('#app_reason').html(data.app_reason);
        $('#upt_app_status').val(data.app_status).trigger('change');
        $('#upt_app_type').val(data.app_type);
        $('#date_update').val(data.date_update).trigger('change');
        $('#view_payment').html(paymentProof);

        // select lecturer
        lecturerList(function(){
           $('#FK_hod').append('<option value="">- Choose -</option>');
           $.each(obj_lecturer.data, function(i, item){
               $('#FK_hod').append('<option value="'+item.emp_id+'">'+item.emp_name.toUpperCase()+'</option>');
           });
       
           $('.slct2').select2({
               width: null,
               containerCssClass: ':all:',
           });
            $('#FK_hod').val(data.FK_hod).trigger('change');
        });
    });
});
var confirmed = false;
// btn Back to admin page
$('#btnBack').click(function(){
    window.location.replace('adminPage.html');
    window.sessionStorage.removeItem('app_id');
});


// btn modal update
$('#btnMdlUpdate').click(function(){
    let app_id = $('#pkId').val();
    showApp(app_id, function(){
        let data = obj_showApp.data;
        $('#student_id_upt').val(data.student_id);
        $('#app_type_upt').val(data.app_type);
        $('#app_reason_upt').val(data.app_reason);

        // select course
        listCrsAct(function(){
            $('#fk_course_upt').append($('<option value="">- Choose -</option>'));
            $.each(obj_crsActive.data, function (i, item){
                $('#fk_course_upt').append($('<option value="'+item.crsId+'">'+item.crs_code.toUpperCase()+' - '+item.crs_name.toUpperCase()+'</option>'));
            });
            $('#fk_course_upt').val(data.fk_course);

            $('.slct2').select2({
                width: null,
                containerCssClass: ':all:',
            });
        });
    });
});


//-------------------------------------------------- update details --------------------------------------------------//
$("#formUpdate").on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Application",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let pk_id = $('#pkId').val();
            let student_id = $('#student_id_upt').val();
            let fk_course = $('#fk_course_upt').val();
            let app_type = $('#app_type_upt').val();
            let app_reason = $('#app_reason_upt').val();

            var form = new FormData();
            form.append("pk_id", pk_id);
            form.append("student_id", student_id);
            form.append("fk_course", fk_course);
            form.append("app_type", app_type);
            form.append("app_reason", app_reason);
            form.append("recordstatus", 'EDT');

            var settings = {
                "url": host+"api_exam_picoms/public/misExamApp/update",
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
                    Swal(result.message, result.data, "error");
                    return;
                }
                window.location.reload();
            });
        });
    }
});
//-------------------------------------------------- end update details --------------------------------------------------//


//-------------------------------------------------- change status School --------------------------------------------------//
$('#formSchool').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Save Changes",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let pk_id = $('#pkId').val();
            // let school_name = $('#school_name').val();
            // let school_date = $('#school_date').val();
            // let fnnceDep_status = $('#fnnceDep_status').val();
            // let exmUnit_status = $('#exmUnit_status').val();
            // let app_status = '';
            let upt_app_status = $('#upt_app_status').val();
            let upt_app_type = $('#upt_app_type').val();
            let FK_hod = $('#FK_hod').val();
            let date_update = $('#date_update').val();

            // if(fnnceDep_status == 'Yes' && exmUnit_status == 'Yes'){
            //     app_status = 'Approved';
            // }
            // else{ app_status = 'In Progress' }

            var form = new FormData();
            form.append("pk_id", pk_id);
            // form.append("school_name", school_name);
            // form.append("school_date", school_date);
            form.append("school_status", 'Yes');
            form.append("app_status", upt_app_status);
            form.append("FK_hod", FK_hod);
            form.append("date_update", date_update);
            form.append("recordstatus", 'EDT');
            form.append("app_type", upt_app_type);

            var settings = {
                "url": host+"api_exam_picoms/public/misExamApp/uptSttsSchool",
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
                    Swal(result.message, result.data, "error");
                    return;
                }
                // window.location.reload();
                document.getElementById('btnBack').click()

            });
        });
    }
});
//-------------------------------------------------- end change status School --------------------------------------------------//


//-------------------------------------------------- change status Finance Department --------------------------------------------------//
$('#formFnncDep').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Save Changes",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let pk_id = $('#pkId').val();
            let fnnceDep_name = $('#finance_name').val();
            let fnnceDep_date = $('#finance_date').val();
            let fnnceDep_receipt = $('#finance_receipt').val();
            let school_status = $('#school_status').val();
            let exmUnit_status = $('#exmUnit_status').val();
            let app_status = '';

            if(school_status == 'Yes' && exmUnit_status == 'Yes'){
                app_status = 'Completed';
            }
            else{ app_status = 'In Progress' }

            var form = new FormData();
            form.append("pk_id", pk_id);
            form.append("fnnceDep_name", fnnceDep_name);
            form.append("fnnceDep_date", fnnceDep_date);
            form.append("fnnceDep_receipt", fnnceDep_receipt);
            form.append("fnnceDep_status", 'Yes');
            form.append("app_status", app_status);
            form.append("recordstatus", 'EDT');

            var settings = {
                "url": host+"api_exam_picoms/public/misExamApp/uptSttsFnncDep",
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
                    Swal(result.message, result.data, "error");
                    return;
                }
                window.location.reload();
            });
        });
    }
});
//-------------------------------------------------- end change status Finance Department --------------------------------------------------//


//-------------------------------------------------- change status Exam Unit --------------------------------------------------//
$('#formUptExmUnit').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Save Changes",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let pk_id = $('#pkId').val();
            let exmUnit_name = $('#examunit_name').val();
            let exmUnit_date = $('#examunit_date').val();
            let school_status = $('#school_status').val();
            let fnnceDep_status = $('#fnnceDep_status').val();
            let app_status = '';

            if(school_status == 'Yes' && fnnceDep_status == 'Yes'){
                app_status = 'Completed';
            }
            else{ app_status = 'In Progress' }

            var form = new FormData();
            form.append("pk_id", pk_id);
            form.append("exmUnit_name", exmUnit_name);
            form.append("exmUnit_date", exmUnit_date);
            form.append("exmUnit_status", 'Yes');
            form.append("app_status", app_status);
            form.append("recordstatus", 'EDT');

            var settings = {
                "url": host+"api_exam_picoms/public/misExamApp/uptSttsExmUnit",
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
                    Swal(result.message, result.data, "error");
                    return;
                }
                window.location.reload();
            });
        });
    }
});
//-------------------------------------------------- end change status Exam Unit --------------------------------------------------//


//-------------------------------------------------- delete application --------------------------------------------------//
$('#btnDelete').click(function(){
    let id = $('#pkId').val();
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("pk_id", id);

    swal({
        title: "Remove Application",
        text: "Are You Sure?",
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Remove",
        confirmButtonColor: "#ef193c",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false
    }).then(function (){
        var settings = {
            "url": host+"api_exam_picoms/public/misExamApp/delete",
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
                Swal(result.message, result.data, "error");
                return;
            }
            window.location.replace('adminPage.html');
        });
    });
});
//-------------------------------------------------- end delete application --------------------------------------------------//




function showApp(id, returnValue){
    var settings = {
        "url": host+"api_exam_picoms/public/misExamApp/show/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_showApp = response;
        returnValue();        
    });
}

