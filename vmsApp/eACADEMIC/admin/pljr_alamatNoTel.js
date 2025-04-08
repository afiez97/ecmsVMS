$(function(){
    $.ajaxSetup ({
        cache: false
    });

    $("#loading_modal").modal('show');

    let noic = window.sessionStorage.noic;
    student_info(noic,function(){
        $("#sti_address_1").val(result.data.sti_address_1);
        $("#sti_address_2").val(result.data.sti_address_2);
        $("#sti_address_3").val(result.data.sti_address_3);
        $("#sti_postcode").val(result.data.sti_postcode);
        $("#sti_contactno_home").val(result.data.sti_contactno_home);
        $("#sti_contactno_mobile").val(result.data.sti_contactno_mobile);        

        let sti_state = result.data.sti_state;

        stateList(function(){
            state = negeri.data;
            // console.log(state)
            $.each(state,function(i,field){
                select = "";
                if(sti_state == field.kod){
                    select = "selected";
                }
                $("#negeriList").append('<option '+select+' value="'+field.kod+'">'+field.ringkasan+'</option>');
            });

            
        }); 
        $("#loading_modal").modal('hide');

    });

    
});

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

function stateList(returnValue){
    var settings = {
        "url": host+"api_public_access/public/negeriList",
        "method": "GET",
        "timeout": 0,
      };
      
      $.ajax(settings).done(function (response) {
        negeri = response;

        returnValue();
      });
}

var confirmed = false;

$("#formUpdate").on('submit',function(e){
    let $this = $(this);
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Kemaskini Maklumat",
            text: "Anda Pasti Untuk Simpan?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Simpan",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function(){
            let student_id = window.sessionStorage.student_id;
            let sti_address_1 = $("#sti_address_1").val();
            let sti_address_2 = $("#sti_address_2").val();
            let sti_address_3 = $("#sti_address_3").val();
            let sti_postcode = $("#sti_postcode").val();
            let negeriList = $("#negeriList").val();
            let sti_contactno_home = $("#sti_contactno_home").val();
            let sti_contactno_mobile = $("#sti_contactno_mobile").val();

            var form = new FormData();
            form.append("std_studentid", student_id);
            form.append("sti_address_1", sti_address_1);
            form.append("sti_address_2", sti_address_2);
            form.append("sti_address_3", sti_address_3);
            form.append("sti_postcode", sti_postcode);
            form.append("negeriList", negeriList);
            form.append("sti_contactno_home", sti_contactno_home);
            form.append("sti_contactno_mobile", sti_contactno_mobile);
            
            var settings = {
              "url": host+"api_pengurusan_pelajar/public/student/update",
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
                  swal("Failed",response.message,"error");
              }
            });            
        });
    }
});
