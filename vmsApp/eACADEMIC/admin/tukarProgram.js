$(function(){
    $.ajaxSetup ({
        cache: false
    });
    $("#loading_modal").modal('show');
    programme(function(){
        if(obj_programme.success){
            $.each(obj_programme.data,function(i,field){
                $("#std_pre_programme").append('<option value="'+field.pgm_id+'">'+field.pgm_name+'</option>');
                $("#std_new_programme").append('<option value="'+field.pgm_id+'">'+field.pgm_name+'</option>');
            });

            chg_program(window.sessionStorage.student_id,function(){
                if(obj_chgProgram.success){
                    $("#button_save").prop('disabled',true);
                    $.each(obj_chgProgram.data,function(item,row){
                        $("#student_id").val(row.studentid);
                        $("#stud_name").val(row.std_name);
                        $("#std_pre_programme").val(row.std_pre_programme);
                        $("#std_new_programme").val(row.std_new_programme);
                        
                        recordstatus = '<span class="label blue-500">Apply</span>';
                        recordstatus_dekan = '<span class="label orange-500">On Progress</span>';
                        recordstatus_fac = '<span class="label orange-500">On Progress</span>';

                        if(row.recordstatus == "EDT"){
                            recordstatus = '<span class="label orange-500">On Progress</span>';
                        }
                        else if(row.recordstatus == "COM"){
                            recordstatus = '<span class="label green-500">Completed</span>';
                        }
                        else if(row.recordstatus == "REJ"){
                            recordstatus = '<span class="label red-500">Rejected</span>';
                        }

                        if(row.std_dekanStatus == "EDT"){
                            recordstatus_dekan = '<span class="label orange-500">On Progress</span>';
                        }
                        else if(row.std_dekanStatus == "APR"){
                            recordstatus_dekan = '<span class="label green-500">Approved</span>';
                        }
                        else if(row.std_dekanStatus == "REJ"){
                            recordstatus_dekan = '<span class="label red-500">Rejected</span>';
                        }

                        if(row.std_new_fac == "EDT"){
                            recordstatus_fac = '<span class="label orange-500">On Progress</span>';
                        }
                        else if(row.std_new_fac == "APR"){
                            recordstatus_fac = '<span class="label green-500">Approved</span>';
                        }
                        else if(row.std_new_fac == "REJ"){
                            recordstatus_fac = '<span class="label red-500">Rejected</span>';
                        }

                        $("#statusrekod").append('<p>Record Status : '+recordstatus+'</p>');
                        $("#statusrekod").append('<p>New Fee Amount : RM '+row.std_new_fee+'</p>');
                        $("#response_adm").append('<p>Status Dekan : '+recordstatus_dekan+'</p>');
                        $("#response_adm").append('<p>Status Faculty : '+recordstatus_fac+'</p>');                 

                    });
                    $("#loading_modal").modal('hide');
                }
                else{
                    student_info(window.sessionStorage.noic,function(){
                        if(obj_student.success){
                            $("#student_id").val(obj_student.data.std_studentid);
                            $("#stud_name").val(obj_student.data.sti_name);
                            $("#std_pre_programme").val(obj_student.data.pgm_id);
                        }
        
                        $("#loading_modal").modal('hide');
        
                    });
                }
            });            
        }
    });
});

function chg_program(id,returnValue){
    var form = new FormData();
    var settings = {
    "url": host+"api_pengurusan_pelajar/public/chg_program/show/"+id,
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
        
        obj_student = JSON.parse(response);
        returnValue();

    });
}

function programme(returnValue){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/programme/list",
        "method": "GET",
        "timeout": 0,
      };
      
      $.ajax(settings).done(function (response) {  
          obj_programme = response;      
          returnValue();
      });
}

var confirmed = false;

//CECT
$("#add_changeProgram").on('submit',function(e){
    let $this = $(this);
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
            studentid = $("#student_id").val();
            std_name = $("#stud_name").val();
            noic = window.sessionStorage.noic;
            std_pre_programme = $("#std_pre_programme").val();
            std_new_programme = $("#std_new_programme").val();
            lastupdateby = window.sessionStorage.usr_id;
            var form = new FormData();
            form.append("studentid", studentid);
            form.append("std_name", std_name);
            form.append("noic", noic);
            form.append("std_pre_programme", std_pre_programme);
            form.append("std_new_programme", std_new_programme);
            form.append("lastupdateby", lastupdateby);
            form.append("std_lampiran", null);
            
            var settings = {
              "url": host+"api_pengurusan_pelajar/public/chg_program/create",
              "method": "POST",
              "timeout": 0,
              "processData": false,
              "mimeType": "multipart/form-data",
              "contentType": false,
              "data": form
            };
            
            $.ajax(settings).done(function (response) {
              result = JSON.parse(response);
              if(result.success){
                window.location.reload();
              }
              else{
                swal(result.message,"error","error");
              }
            });
        });

    }
});