// const { default: Swal } = require("sweetalert2");

$(function(){
    $.ajaxSetup ({
        cache: false
    });
    $("#loading_modal").modal('show');
    var studentid = getUrlVars()['std_id'];
    var id = getUrlVars()['id'];

    // student_info(studentid,function(){
    //     console.log(result);


    // });

    cect(id,function(){
        if(obj_cect.success){
            $("#std_studentid").html(obj_cect.data.studentid);
            $("#sti_name").html(obj_cect.data.std_name);
            programme(obj_cect.data.pgm_id,function(){
                $("#programme").html(obj_programme.data.pgm_name);
            });
            $("#semester").html(obj_cect.data.std_semester);
            $("#fee").html(obj_cect.data.std_fee);
            $("#std_edu").html(obj_cect.data.std_edu);
            $("#std_universiti").html(obj_cect.data.std_pre_universiti);
            $("#std_pre_programme").html(obj_cect.data.std_pre_program);
            $("#std_transkrip").html(obj_cect.data.std_transkrip);

            cect_det(obj_cect.data.id,function(){
                let columns = [
                    {"name":"bil","title":"No."},
                    {"name":"std_course","title":"PICOM Course Code."},
                    {"name":"std_course_name","title":"PICOM Course Name."},
                    {"name":"std_course_hour","title":"PICOM Course Hours."},
                    {"name":"std_course_pre","title":"Previous Course Code.","breakpoints":"sm xs"},
                    {"name":"std_course_name_pre","title":"Previous Course Name.","breakpoints":"sm xs"},
                    {"name":"std_course_hour_pre","title":"Previous Course Hours.","breakpoints":"sm xs"},
                ];
                let list = [];
                let bil = 1;
                //list_cect_det
                $.each(obj_cect_det.data,function(i,field){
                    list.push({
                        "bil":bil++,
                        "std_course":field.std_course,
                        "std_course_name":field.std_course_name,
                        "std_course_hour":field.std_credit_hour,
                        "std_course_pre":field.std_course_pre,
                        "std_course_name_pre":field.std_course_name_pre,
                        "std_course_hour_pre":field.std_credit_hour_pre
                    });
                });
                $("#tblCourseTransfer").footable({
                    "columns": columns,
                    "rows": list,
                    "paging": {
                        "enabled": true,
                        "size": 10
                    },
                    "filtering": {
                        "enabled": true,
                        "placeholder": "Search...",
                        "dropdownTitle": "Search for:"
                    }
        
                });
            });
            $("#loading_modal").modal('hide');
        }
        else{
            swal("error","no data found","warning");
        }
    });

    $('#btnBack').click(function(){
        window.location.replace('adminPage.html');
    });

});

function student_info(id,returnValue){
    var form = new FormData();
    var settings = {
    "url": host+"api_pengurusan_pelajar/public/studentInfoView2/"+id,
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

function cect(id,returnValue){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/cect/getdata/"+id,
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