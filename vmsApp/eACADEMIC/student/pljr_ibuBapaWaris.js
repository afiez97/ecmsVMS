var pgmId;
$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let student_id = window.sessionStorage.std_studentid;

    // select Title
    slctTitle(function(){
        $('#par_father_title').append('<option value="">- Choose -</option>');
        $('#par_mother_title').append('<option value="">- Choose -</option>');
        $.each(obj_title.data, function (i, item){
            $('#par_father_title').append('<option value="'+item.pk_id+'">'+item.title+'</option>');
            $('#par_mother_title').append('<option value="'+item.pk_id+'">'+item.title+'</option>');
        });
    });

    // select Relationship
    slctRelationship(function(){
        $('#par_father_relationship').append('<option value="">- Choose -</option>');
        $('#par_mother_relationship').append('<option value="">- Choose -</option>');
        $.each(obj_relationship.data, function (i, item){
            $('#par_father_relationship').append('<option value="'+item.pk_id+'">'+item.relationship+'</option>');
            $('#par_mother_relationship').append('<option value="'+item.pk_id+'">'+item.relationship+'</option>');
        });
    }); 
    
        // select Nationality
    slctNationality(function(){
        $('#par_father_nationality').append($('<option value="">- Choose -</option>'));
        $('#par_mother_nationality').append($('<option value="">- Choose -</option>'));
        $.each(obj_nationality.data, function (i, item) {
            $('#par_father_nationality').append($('<option value="'+item.pk_id+'">'+item.sti_nationality_name+'</option>'));
            $('#par_mother_nationality').append($('<option value="'+item.pk_id+'">'+item.sti_nationality_name+'</option>'));
        });
    });

    student_info(student_id, function(){
        pgmId = obj_stdInfo.data.pgm_fk;

        student_parent(student_id, pgmId, function(){
            let dataParent = obj_parent.data;
            $("#dis_father_icno").html(dataParent.par_father_icno);
            $("#dis_father_name").html(dataParent.par_father_name);
            $("#dis_father_contactno").html(dataParent.par_father_contactno);
            $("#dis_father_relationship").html(dataParent.par_father_relationship);
            $("#dis_father_nationality").html(dataParent.par_father_nationality);
            $("#dis_father_address").html(dataParent.par_father_address);
            
            $("#dis_mother_icno").html(dataParent.par_mother_icno);
            $("#dis_mother_name").html(dataParent.par_mother_name);
            $("#dis_mother_contactno").html(dataParent.par_mother_contactno);
            $("#dis_mother_relationship").html(dataParent.par_mother_relationship);
            $("#dis_mother_nationality").html(dataParent.par_mother_nationality);
            $("#dis_mother_address").html(dataParent.par_mother_address);

            $("#par_father_ic").val(dataParent.par_father_icno);
            $("#par_father_title").val(dataParent.par_father_title);
            $("#par_father_name").val(dataParent.par_father_name);
            $("#par_father_contactno").val(dataParent.par_father_contactno);
            $("#par_father_relationship").val(dataParent.par_father_relationship);
            $("#par_father_nationality").val(dataParent.par_father_nationality);
            $("#par_father_address").val(dataParent.par_father_address);
            
            $("#par_mother_ic").val(dataParent.par_mother_icno);
            $("#par_mother_title").val(dataParent.par_mother_title);
            $("#par_mother_name").val(dataParent.par_mother_name);
            $("#par_mother_contactno").val(dataParent.par_mother_contactno);
            $("#par_mother_relationship").val(dataParent.par_mother_relationship);
            $("#par_mother_nationality").val(dataParent.par_mother_nationality);
            $("#par_mother_address").val(dataParent.par_mother_address);
        });
    });

    $("#btn_update").click(function(){
        $("#modal_update").modal('show');
    });

    var confirmed = false;

    $("#form_std_parent").on('submit',function(e){
        if(!confirmed){
            e.preventDefault();
            swal({
                title: "Update Student Info",
                text: "Sure?",
                type: "question",
                showCancelButton: true,
                confirmButtonText: "Save",
                cancelButtonText: "Cancel",
                confirmButtonColor: "#2196f3",
                closeOnConfirm: true,
                allowOutsideClick: false,
                html: false  
            }).then(function(){
                var form = new FormData();
                $("form#form_std_parent :input").each(function(){
                    names = $(this).attr('name');
                    values = $(this).val();
                    form.append(names,values);
                });
    
                let token = window.sessionStorage.token;
                
                let std_studentid = window.sessionStorage.std_studentid;
                form.append('std_studentid',std_studentid);
                
                let pgm_fk = pgmId;
                form.append('pgm_id',pgm_fk);
    
                std_parent(std_studentid,pgm_fk,token,function(){
                    console.log(obj_parent.success);
                    if(obj_parent.success){
                        update_parent(form,token,function(){
                            if(obj_parent.success){
                                window.location.reload();
                            }
                            else{
                                swal("Updated Fail","Create Family Data","error");
                            }
                        });
                        
                    }
                    else{
                        create_parent(form,token,function(){
                            if(obj_parent.success){
                                swal("Updated Success","Update Family Data","success");
                            }
                            else{
                                swal("Updated Fail","Update Family Data","error");
                            }
                        });
                    }
                });
                
            });
        }
    });    
});

function student_parent(student_id, pgmId, returnValue){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/parent/show/"+student_id+"/"+pgmId,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };
    
    $.ajax(settings).done(function (response){
        obj_parent = response;
        returnValue();
    });
}

function std_parent(std_sudentid,pgm_id,token,returnValue){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/parent/show/"+std_sudentid+"/"+pgm_id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "PICOMS "+token
          },
    };

    $.ajax(settings).done(function (response){
        obj_parent = response;
        returnValue();
    });
}

function update_parent(form,token,returnValue){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/parent/update",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Authorization": "PICOMS "+token
        },
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
    };

    let request = $.ajax(settings);
    request.done(function (response) {
        // let obj = JSON.parse(response);
        obj_parent = JSON.parse(response);

        returnValue();
        
    });
    request.error(function(){
        response = {"success":false,"message":"Register Error","data":""};
        obj_parent = response;

        returnValue();
    }); 
}

function create_parent(form,token,returnValue){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/parent/create",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Authorization": "PICOMS "+token
        },
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
    };

    let request = $.ajax(settings);
    request.done(function (response) {
        // let obj = JSON.parse(response);
        obj_parent = JSON.parse(response);

        returnValue();
        
    });
    request.error(function(){
        response = {"success":false,"message":"Register Error","data":""};
        obj_parent = response;

        returnValue();
    }); 
}

function slctTitle(returnValue){
    var settings = {
        "url": host + "api_public_access/public/misTitle/list",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        obj_title = response;
        returnValue();
    });
}

function slctRelationship(returnValue){
    var settings = {
        "url": host + "api_public_access/public/misRelationship/list",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        obj_relationship = response;
        returnValue();
    });
}

function slctNationality(returnValue){
    let token = window.sessionStorage.token;
    var settings = {
        "url": host+"api_public_access/public/nationalityList",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "PICOMS "+token
          },
    };

    $.ajax(settings).done(function (response){
        obj_nationality = response;
        returnValue();
    });
}
