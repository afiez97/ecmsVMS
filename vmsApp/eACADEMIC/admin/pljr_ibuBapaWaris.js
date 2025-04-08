$(function(){
    $.ajaxSetup ({
        cache: false
    });
    $("#loading_modal").modal('show');

    let noic = window.sessionStorage.noic;
    student_info(noic,function(){
        student_parent(student_id);
    });    
});

function student_parent(student_id){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/parent/show/"+student_id,
        "method": "GET",
        "timeout": 0,
      };
      
      $.ajax(settings).done(function (response) {
        if(response.success){
            $("#par_family_income").html(response.data.par_family_income);
            $("#par_father_address").html(response.data.par_father_address);
            $("#par_father_contactno").html(response.data.par_father_contactno);
            $("#par_father_name").html(response.data.par_father_name);
            $("#par_father_occupation").html(response.data.par_father_occupation);
            $("#par_kin_address").html(response.data.par_kin_address);
            $("#par_kin_contactno").html(response.data.par_kin_contactno);
            $("#par_living_with").html(response.data.par_living_with);
            $("#par_mother_address").html(response.data.par_mother_address);
            $("#par_mother_contactno").html(response.data.par_mother_contactno);
            $("#par_mother_name").html(response.data.par_mother_name);
            $("#par_mother_occupation").html(response.data.par_mother_occupation);
            $("#par_nextofkin").html(response.data.par_nextofkin);
            $("#par_parent_relation").html(response.data.par_parent_relation);
            
            $("#loading_modal").modal('hide');

        }
        else{
            $("#loading_modal").modal('hide');
            swal(result.message,"Tiada Data",'warning');
        }
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
        console.log(JSON.parse(response));
        let result = JSON.parse(response);
        if(result.success){
            student_id = result.data.std_studentid;   
            
            returnValue();

        }
        else{
            swal(result.message,"Tiada Data",'warning');
        }
    });
}