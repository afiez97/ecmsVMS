$(function(){
    $.ajaxSetup ({
        cache: false
    });

    $("#loading_modal").modal('show');

    let student_id = window.sessionStorage.std_studentid;

    $("#stu_id").val(student_id);

    // data student
    student_info(student_id,function(){
        $("#stu_name").val(obj_stdInfo.data.sti_name);
        $("#pgm_id").val(obj_stdInfo.data.pgm_fk);
        $("#progName").val(obj_stdInfo.data.pgm_name);
    });

    // select New Programme
    progActList(function(){
        $('#std_new_programme').append('<option value="">- Choose -</option>');
        $.each(obj_progAct.data, function(i,item){
            $('#std_new_programme').append('<option value="'+item.pgm_id+'">'+item.pgm_name+'</option>');
        });
    });

    // data program change
    withdrawData(student_id, function(){
        if(obj_withdraw.success){
            $("#button_save").prop('disabled',true);
            $.each(obj_withdraw.data,function(item, row){
                $("#cur_semester").val(row.cur_semester);
                $("#quit_code").val(row.quit_code);
                
                let statusWD = '';
                if(row.withdraw_status == "Apply"){
                    statusWD = '<span class="label blue-500">'+row.withdraw_status+'</span>';
                }
                
                let facStatus = '';
                if(row.fac_status == "In Progress"){
                    facStatus = '<span class="label orange-500">'+row.fac_status+'</span>';
                }

                let counStatus = '';
                if(row.coun_status == "No"){
                    counStatus = '<span class="label red-500">'+row.coun_status+'</span>';
                }
                else if(row.coun_status == "Yes"){
                    counStatus = '<span class="label green-500">'+row.coun_status+'</span>';
                }

                $("#statusrekod").append('<p><b>Status : </b>'+statusWD+'</p>');
                $("#statusrekod").append('<p><b>Status Faculty : </b>'+facStatus+'</p>');
                $("#statusrekod").append('<p><b>Counseling : </b>'+counStatus+'</p>');             

            });
            $("#loading_modal").modal('hide');
        }
        else{ $("#loading_modal").modal('hide'); }
    });
});
var confirmed = false;


//-------------------------------------------------- save withdraw --------------------------------------------------//
$("#formSave").on('submit',function(e){
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
            let stu_id = $("#stu_id").val();
            let stu_name = $("#stu_name").val();
            let pgm_id = $("#pgm_id").val();
            let cur_semester = $("#cur_semester").val();
            let quit_code = $("#quit_code").val();
            let quit_attachment = $('#quit_attachment').val();

            var form = new FormData();
            form.append("stu_id", stu_id);
            form.append("stu_name", stu_name);
            form.append("pgm_id", pgm_id);
            form.append("cur_semester", cur_semester);
            form.append("quit_code", quit_code);
            form.append("quit_attachment", quit_attachment);
            form.append("withdraw_status", 'Apply');
            form.append('fac_status', 'In Progress');
            form.append('coun_status', 'No');
            
            var settings = {
              "url": host+"api_pengurusan_pelajar/public/misStdWithdraw/register",
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
              if(result.success){
                window.location.reload();
              }
              else{ swal(result.message,"error","error"); }
            });
        });
    }
});
//-------------------------------------------------- end save withdraw --------------------------------------------------//


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


function withdrawData(id, returnValue){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/misStdWithdraw/show/"+id,
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