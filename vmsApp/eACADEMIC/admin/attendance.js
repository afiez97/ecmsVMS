$(function(){
    $.ajaxSetup ({
        cache: false
    });
    
    let token = getUrlVars()['code_received'];
    let fk_tmtDet = getUrlVars()['tmt'];
    let pk_id = getUrlVars()['id'];

    detailTmt(fk_tmtDet,token, function(){
        let data = obj_tmtDet.data;
        let dayVal = '';
        if( data.tmt_day == '1' ){ dayVal = 'MONDAY' }
        else if( data.tmt_day == '2' ){ dayVal = 'TUESDAY' }
        else if( data.tmt_day == '3' ){ dayVal = 'WEDNESDAY' }
        else if( data.tmt_day == '4' ){ dayVal = 'THURSDAY' }
        else if( data.tmt_day == '5' ){ dayVal = 'FRIDAY' }
        

        $('#tmtDet_id').val(data.tmtDet_id);
        $('#fk_course').val(data.fk_course);
        $('#fk_acaCal').val(data.fk_acaCal);
        $('#tmt_year').html(data.cal_year.replace('/','')+'/'+data.cal_cohort);
        $('#tmt_year_det').html(data.cal_year.replace('/','')+'/'+data.cal_cohort);
        $('#tmt_course').html(data.crs_code+' - '+data.crs_name);
        $('#tmt_course_det').html(data.crs_code+' - '+data.crs_name);
        $('#tmt_day').html(dayVal);
        $('#tmt_day_det').html(dayVal);
        $('#tmt_time').html(formatTime(data.tmt_starttime)+' - '+formatTime(data.tmt_endtime));
        $('#tmt_slot').html(data.tmt_slot);
        $('#tmt_slot_det').html(data.tmt_slot);
        $('#tmt_location').html(data.loc_name); 
        $('#tmt_location_det').html(data.loc_name); 

        let obj = new get(host+"api_timetbl_picoms/public/misAtdWeek/show/"+pk_id,'PICOMS ' + token).execute(); 
        if(obj.success){
            $("#date_attendance").html(formatDate(obj.data.att_date));
            $("#att_week").html(obj.data.att_week);
        }   
        else{
            swal('not valid','error access1','error');
            alert('rina');
            setTimeout(() => {
                window.location.replace(url + "/student");
            }, 2000);            
        }   
    }); 

    var confirmed = false;

    $('#form_attendance').on('submit', function(e){
        if(!confirmed){
            e.preventDefault();
            let studentid = $("#studentid").val();
            let obj = new get(host + "api_pengurusan_pelajar/public/pelajar/show/"+studentid,'picoms '+token).execute();
            if(obj.success){
                let data = obj.data;
                $("#sti_name").html(data.sti_name);
                $("#sti_name_det").html(data.sti_name);
                // $("#sti_icno").html(data.sti_icno);
                $("#std_studentid").html(data.std_studentid);
                $("#std_studentid_det").html(data.std_studentid);
                $("#modal_save").modal("show");
            }
            else{
                swal("Student ID","No Matric Not Found",'warning');
            }
        }
    });
    
    $('#form_showByPassword').on('submit', function(e){
        if(!confirmed){
            e.preventDefault();
            let studentid = $("#std_studentid").html();
            let password = $("#passwords").val();
            let form = new FormData();
            form.append('std_studentid',studentid);
            form.append('usr_passwd',password);
            let obj = new post(host + "api_pengurusan_pelajar/public/pelajar/show/password",form,'picoms '+token).execute();
            if(obj.success){
                $("#text_info").html("Access Granted!");
                $("#text_info").prop('class','text-success');
                $("#save_btn").prop('disabled',false);
            }
            else{
                $("#text_info").html("Access Denied!");
                $("#text_info").prop('class','text-danger');
                $("#save_btn").prop('disabled',true);
            }
        }
    });

    $("#ok_btn").click(function(){     
            setTimeout(() => {
                $("#modal_details").modal("hide");
                window.location.replace(url + "/student");
            }, 2000);
    });
    
    $("#save_btn").click(function(){
        let studentid = $("#studentid").val();
        let form = new FormData();
        form.append('fk_tmtDet',fk_tmtDet);
        form.append('fk_week',pk_id);
        form.append('std_studentid',studentid);
        form.append('status_attend','Attend');
        form.append('recordstatus','ADD');
        let obj = new post(host + "api_timetbl_picoms/public/misAtdAttendance/register",form,'picoms ' + token).execute();
        if(obj.success){
            swal("attend",studentid,'success');
            setTimeout(() => {
                $("#modal_save").modal("hide");
                $("#modal_details").modal("show");
                // window.location.replace(url + "/student");
            }, 2000);
        }
        else{
            $("#modal_save").modal("hide");
            swal("Already Recorded",studentid,'error');
        }
    });
    
});

function detailTmt(id,token, returnValue){
    var settings = {
        "url": host+"api_timetbl_picoms/public/misTimetblDet/show/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + token
        },
    };
    let request = $.ajax(settings);

    request.done(function (response){
        obj_tmtDet = response;
        returnValue();
    });

    request.fail(function (response){
        swal('not valid','error access2','error');
        alert('nana');
        setTimeout(() => {
            window.location.replace(url + "/student");
        }, 2000);
    });
}