$(function(){
    $.ajaxSetup ({
        cache: false
    });

    $("#loading_modal").modal('show');

    let student_id = window.sessionStorage.std_studentid;
    $("#student_id").val(student_id);

    // data student
    student_info(student_id,function(){
        $("#stud_name").val(obj_stdInfo.data.sti_name);
        $("#pgm_id").val(obj_stdInfo.data.pgm_fk);
        $('#sti_icno').val(obj_stdInfo.data.sti_icno);
        $("#std_pre_programme").val(obj_stdInfo.data.pgm_name);
    });

    // select New Programme
    progActListNew(function(){
        $('#std_new_programme').append('<option value="">- Choose -</option>');
        $.each(obj_progAct.data, function(i,item){
            console.log(item);
            $('#std_new_programme').append('<option value="'+item.pk_id+'">'+item.pgm_name+'</option>');
        });

        // data program change
        chg_program(student_id, function(){
            if(obj_chgProgram.success){
                $("#button_save").prop('disabled',true);
                $.each(obj_chgProgram.data,function(item, row){
                    
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

                    $("#statusrekod").append('<p><b>Record Status : </b>'+recordstatus+'</p>');
                    $("#statusrekod").append('<p><b>New Fee Amount : </b>RM '+row.std_new_fee+'</p>');
                    $("#response_adm").append('<p><b>Status Dekan : </b>'+recordstatus_dekan+'</p>');
                    $("#response_adm").append('<p><b>Status Faculty </b>: '+recordstatus_fac+'</p>');                 
                    $("#std_new_programme").val(row.std_new_programme);

                });
                $("#loading_modal").modal('hide');
            }
            else{ $("#loading_modal").modal('hide'); }
        });        
    });
    
});
var confirmed = false;


//-------------------------------------------------- save programme change --------------------------------------------------//
$("#add_changeProgram").on('submit',function(e){
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
            studentid = $("#student_id").val();
            std_name = $("#stud_name").val();
            noic = $('#sti_icno').val();
            std_pre_programme = $("#pgm_id").val();
            std_new_programme = $("#std_new_programme").val();
            lastupdateby = window.sessionStorage.usr_id;

            var form = new FormData();
            form.append("studentid", studentid);
            form.append("std_name", std_name);
            form.append('noic', noic);
            form.append("std_pre_programme", std_pre_programme);
            form.append("std_new_programme", std_new_programme);
            form.append("lastupdateby", lastupdateby);
            form.append("std_lampiran", null);
            
            var settings = {
                "url": host+"api_pengurusan_pelajar/public/chg_program/create",
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
              if(result.success){
                window.location.reload();
              }
              else{ swal(result.message,"error","error"); }
            });
        });
    }
});
//-------------------------------------------------- end save programme change --------------------------------------------------//


// onchange new program
$('#std_new_programme').on('change', function(){
    let pgmId = $('#pgm_id').val();
    let newPgm = $(this).val();

    if(newPgm == pgmId){
        swal({
            title: "Error",
            text: "This is your current programme. Select another programme.",
            type: "error",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function(){
            $('#std_new_programme').val('');
        });
    }
});


function chg_program(id, returnValue){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/chg_program/show/"+id,
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

function progActList(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmProgcampus/grpByPgmAct",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };
      
    $.ajax(settings).done(function (response){
        obj_progAct = response;
        returnValue();
    });
}

function progActListNew(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmProgcampus/grpByPgmActNew",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };
      
    $.ajax(settings).done(function (response){
        obj_progAct = response;
        returnValue();
    });
}