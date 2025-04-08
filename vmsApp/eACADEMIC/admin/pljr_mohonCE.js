// var columns = [
//     { "name": "bil", "title": "No." },
//     { "name": "std_course", "title": "PICOMS Course Code"},
//     { "name": "std_course_name", "title": "PICOMS Course Name" },
//     { "name": "std_credit_hour", "title": "PICOMS Credit Hours" },
//     { "name": "std_course_pre", "title": "Previous Course Code" },
//     { "name": "std_course_name_pre", "title": "Previous Course Name" },
//     { "name": "std_credit_hour_pre", "title": "Previous Credit Hours" },
//     { "name": "upt_btn", "title": "Action", "breakpoints": "sm xs"},
// ];

$(function(){
    $.ajaxSetup ({
        cache: false
    });

    $("#loading_modal").modal('show');
    let noic = window.sessionStorage.noic;

    student_info(noic,function(){
        $("#studentid").val(result.data.std_studentid);
        $("#std_name").val(result.data.sti_name);
        $("#pgm_id").val(result.data.pgm_id);

        programme(result.data.pgm_id,function(){
            $("#programme").val(obj_programme.data.pgm_name);
        });

        cect(result.data.std_studentid,function(){
            if(obj_cect.success){
                $.each(obj_cect.data,function(i,field){
                    // $("#cect_data").append('<li class="nav-item">'+
                    // '<a class="nav-link '+active+'" data-toggle="tab" onclick="onTab(\'#tab'+i+'\')" data-target="#tab'+i+'">Semester '+field.std_semester+'</a></li>');

                    cect_det(field.id,function(){
                        $("#cect_det").append(
                            '<div class="card">'+
                                '<div class="card-header bg-primary text-white"><b>Semester '+field.std_semester+'</b></div>'+
                                '<div class="card-body p-a">'+
                                    '<div class="row">'+
                                        '<div class="col-md-6">'+
                                            '<p>Previous Level of Education : '+field.std_edu+'</p>'+
                                            '<p>Previous IPTA/IPTS : '+field.std_pre_universiti+'</p>'+
                                        '</div><div class="col-md-6">'+
                                            '<p>Previous Programme : '+field.std_pre_program+'</p>'+
                                            '<p>Status : '+field.recordstatus+'</p>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="card-footer">'+
                                '<button type="button" class="btn btn-sm btn-outline-primary rounded" onclick="addCectDet(\''+field.id+'\')"><i class="fa fa-fw fa-plus"></i> Add</button>'
                                +'</div>'+
                            '</div>'
                        );
                        $("#cect_det").append('<div id="#tab'+i+'">'+
                        '<table class="table table-striped table-bordered" id="det_tab'+i+'">'+
                        '<thead class="blue-50"><th>PICOMS COURSE</th><th>PREVIOUS COURSE</th></thead><tbody class=" b-a b-primary">');
                        list = [];
                        bil = 1;
                        $.each(obj_cect_det.data,function(i_det,field_det){
                            
                            $("#det_tab"+i).append(
                                '<tr><td>'+field_det.std_course+'<br>'+field_det.std_course_name+'<br>'+field_det.std_credit_hour+'</td>'+
                                '<td>'+field_det.std_course_pre+'<br>'+field_det.std_course_name_pre+'<br>'+field_det.std_credit_hour_pre+'</td>'+
                                '</tr>'
                            );
                        });
                        $("#cect_det").append('</tbody></table></div><hr>');
                        
                        $("#loading_modal").modal('hide');


                    });
                });
            }
            else{
                $("#form_setup").prop('class','');
                $("#loading_modal").modal('hide');

            }
        });
    });
});

function addCectDet(id){
    $("#fk_cect").val(id);
    $("#mdlAddCourse").modal('show');
}


function student_info(noic,returnValue){
    var form = new FormData();
    var settings = {
    "url": host+"api_pengurusan_pelajar/public/student/show/"+noic,
    "method": "GET",
    "timeout": 0,
    "processData": false,
    "mimeType": "multipart/form-data",
    "contentType": false,
    "data": form
    };

    $.ajax(settings).done(function (response) {
        result = JSON.parse(response);
        if(result.success){
            student_id = result.data.std_studentid;  
            window.sessionStorage.student_id = student_id; 
            
            returnValue();

        }
        else{
            swal(result.message,"Tiada Data",'warning');
        }
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

function cect(studentid,returnValue){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/cect/show/"+studentid,
        "method": "GET",
        "timeout": 0,
      };
      
      $.ajax(settings).done(function (response) {
        obj_cect = response;
        returnValue();
      });
}

function cect_det(id,returnValue){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/cect_det/list/"+id,
        "method": "GET",
        "timeout": 0,
      };
      
      $.ajax(settings).done(function (response) {
        obj_cect_det = response;
        returnValue();
      });
}

var confirmed = false;

//CECT
$("#form_setup").on('submit',function(e){
    let $this = $(this);
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Simpan Permohonan",
            text: "Anda Pasti Untuk Simpan?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Simpan",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function(){
            //api_setup
            let studentid = $("#studentid").val();
            let std_name = $("#std_name").val();
            let pgm_id = $("#pgm_id").val();
            let std_edu = $("#std_edu").val();
            let std_semester = $("#std_semester").val();
            let std_pre_universiti = $("#std_pre_universiti").val();
            let std_pre_program = $("#std_pre_program").val();
            let std_transkrip = $("#std_transkrip").val();
            let std_fee = $("#std_fee").val();
            let lastupdateby = window.sessionStorage.usr_id;

            var form = new FormData();
            form.append("studentid", studentid);
            form.append("std_name", std_name);
            form.append("pgm_id", pgm_id);
            form.append("std_edu", std_edu);
            form.append("std_semester", std_semester);
            form.append("std_pre_universiti", std_pre_universiti);
            form.append("std_pre_program", std_pre_program);
            form.append("std_transkrip", std_transkrip);
            form.append("std_fee", std_fee);
            form.append("lastupdateby", lastupdateby);

            var settings = {
            "url": host+"api_pengurusan_pelajar/public/cect/create",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
            };

            $.ajax(settings).done(function (response) {
            let result = JSON.parse(response);
            if(result.success){
                window.location.reload();
            }
            else{
                swal(result.message,result.success,'error');
            }
            });
        });
    }
});

//CECT DETAIL
$("#form_register").on('submit',function(e){
    let $this = $(this);
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Save Course",
            text: "Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Simpan",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function(){
            //api_setup
            let fk_cect = $("#fk_cect").val();
            let std_course = $("#course_code").val();
            let std_course_name = $("#course_name").val();
            let std_credit_hour = $("#crt_hour").val();
            let std_course_pre = $("#pv_course_code").val();
            let std_course_name_pre = $("#pv_course_name").val();
            let std_credit_hour_pre = $("#pv_crt_hour").val();
            let lastupdateby = window.sessionStorage.usr_id;

            var form = new FormData();
            form.append("fk_cect", fk_cect);
            form.append("std_course", std_course);
            form.append("std_course_name", std_course_name);
            form.append("std_credit_hour", std_credit_hour);
            form.append("std_course_pre", std_course_pre);
            form.append("std_course_name_pre", std_course_name_pre);
            form.append("std_credit_hour_pre", std_credit_hour_pre);
            form.append("lastupdateby", lastupdateby);

            var settings = {
            "url": host+"api_pengurusan_pelajar/public/cect_det/create",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
            };

            $.ajax(settings).done(function (response) {
            let result = JSON.parse(response);
            if(result.success){
                window.location.reload();
            }
            else{
                swal(result.message,result.success,'error');
            }
            });
        });
    }
});