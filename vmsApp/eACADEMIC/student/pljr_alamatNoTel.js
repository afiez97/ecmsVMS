$(function(){
    $.ajaxSetup ({
        cache: false
    });

    $.fn.select2.defaults.set( "theme", "bootstrap" );

    let student_id = window.sessionStorage.std_studentid;
    $('#stdId').val(student_id);

    student_info(student_id,function(){
        let dataStd = obj_stdInfo.data;
        $("#sti_address_1").val(dataStd.sti_address_1);
        // $("#sti_address_2").val(dataStd.sti_address_2);
        // $("#sti_address_3").val(dataStd.sti_address_3);
        $("#sti_postcode").val(dataStd.sti_postcode);
        $("#sti_contactno_home").val(dataStd.sti_contactno_home);
        $("#sti_contactno_mobile").val(dataStd.sti_contactno_mobile);        
        $("#sti_email").val(dataStd.sti_email);        

        stateList(function(){
            $("#negeriList").append('<option value="">- Choose -</option>');
            $.each(negeri.data, function(i, field){
                $("#negeriList").append('<option value="'+field.kod+'">'+field.ringkasan+'</option>');
            });
            $("#negeriList").val(dataStd.sti_state);

            $('.slct2').select2({
                width: null,
                containerCssClass: ':all:',
            });
        }); 
    });
});
var confirmed = false;


//-------------------------------------------------- update --------------------------------------------------//
$("#formUpdate").on('submit',function(e){
    if (!confirmed){
        e.preventDefault();
        swal({
            title: "Update Info",
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
            let sti_address_1 = $("#sti_address_1").val();
            let sti_address_2 = $("#sti_address_2").val();
            let sti_address_3 = $("#sti_address_3").val();
            let sti_postcode = $("#sti_postcode").val();
            let negeriList = $("#negeriList").val();
            let sti_contactno_home = $("#sti_contactno_home").val();
            let sti_contactno_mobile = $("#sti_contactno_mobile").val();
            let sti_email = $("#sti_email").val();

            var form = new FormData();
            form.append("std_studentid", student_id);
            form.append("sti_address_1", sti_address_1);
            form.append("sti_address_2", sti_address_2);
            form.append("sti_address_3", sti_address_3);
            form.append("sti_postcode", sti_postcode);
            form.append("negeriList", negeriList);
            form.append("sti_contactno_home", sti_contactno_home);
            form.append("sti_contactno_mobile", sti_contactno_mobile);
            form.append("sti_email", sti_email);
            
            var settings = {
                "url": host+"api_pengurusan_pelajar/public/student/update",
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
                let result = JSON.parse(response);
              if(result.success){
                  window.location.reload();
              }
              else{ swal("Failed",response.message,"error"); }
            });            
        });
    }
});
//-------------------------------------------------- update --------------------------------------------------//

function stateList(returnValue){
    var settings = {
        "url": host+"api_public_access/public/negeriList",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };
      
    $.ajax(settings).done(function (response){
        negeri = response;
        returnValue();
    });
}




