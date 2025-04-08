$(function(){
    $.ajaxSetup ({
        cache: false
    });

    $("#loading_modal").modal('show');

    let noic = window.sessionStorage.noic;
    student_info(noic);
    
});


function student_info(noic){
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
        
        let result = JSON.parse(response);
        if(result.success){
            $("#student_id").html(result.data.std_studentid);
            $("#student_name").html(result.data.sti_name);
            $("#programs").html(result.data.pgm_id);
            let gender = 'Male';
            if(result.data.sti_gender == "P"){
                gender = "Female";
            }
            $("#gender").html(gender);
            $("#national").html(result.data.sti_nationality);
            race(result.data.sti_race,function(){
                $("#race").html(obj_race.data.sti_race_name);
            });
            $("#local").html(result.data.sti_status_bumiputra);
            religion(result.data.sti_religion,function(){
                $("#religion").html(obj_religion.data.sti_religion_name);
            });
            let oku = "NO";
            if(result.data.sti_status_oku == "Y"){
                oku = "YES";
            }
            $("#handicap").html(oku);
            blood(result.data.sti_blood_type,function(){
                $("#blood").html(obj_blood.data.sti_blood_type_name);
            });
            $("#emails").html(result.data.sti_email);
            $("#bank").html(result.data.sti_bank_id);
            $("#acc_no").html(result.data.sti_bank_accountno);

            std_status(result.data.std_studentid,function(){
                if(obj_sessi.success){
                    $("#session").html(obj_sessi.data.sts_cur_year);
                }
            });  
            
            programme(result.data.pgm_id,function(){
                if(obj_programme.success){
                    $("#programs").html(obj_programme.data.pgm_area);
                }
            });

            $("#sti_image").prop('src','data:image/jpg;base64,'+result.data.sti_image);

            $("#loading_modal").modal('hide');

        }
        else{
            $("#loading_modal").modal('hide');
            swal(result.message,"Tiada Data",'warning');
        }
    });
}

function std_status(student_id,returnValue){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/std_status/show/"+student_id,
        "method": "GET",
        "timeout": 0,
      };
      
      $.ajax(settings).done(function (response) {  
          obj_sessi = response;      
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

function religion(id,returnValue){
    var form = new FormData();
    var settings = {
      "url": host+"api_tetapan_picoms/public/religion/show/"+id,
      "method": "GET",
      "timeout": 0,
      "processData": false,
      "mimeType": "multipart/form-data",
      "contentType": false,
      "data": form
    };
    
    $.ajax(settings).done(function (response) {
      obj_religion = JSON.parse(response);
      returnValue();
    });    
}

function race(id,returnValue){
    var form = new FormData();
    var settings = {
      "url": host+"api_tetapan_picoms/public/race/show/"+id,
      "method": "GET",
      "timeout": 0,
      "processData": false,
      "mimeType": "multipart/form-data",
      "contentType": false,
      "data": form
    };
    
    $.ajax(settings).done(function (response) {
      obj_race = JSON.parse(response);
      returnValue();
    });    
}

function blood(id,returnValue){
    var form = new FormData();
    var settings = {
      "url": host+"api_tetapan_picoms/public/blood/show/"+id,
      "method": "GET",
      "timeout": 0,
      "processData": false,
      "mimeType": "multipart/form-data",
      "contentType": false,
      "data": form
    };
    
    $.ajax(settings).done(function (response) {
      obj_blood = JSON.parse(response);
      returnValue();
    });    
}