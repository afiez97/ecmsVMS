$(function(){
    $.ajaxSetup ({
        cache: false
    });

    $.fn.select2.defaults.set( "theme", "bootstrap" );

    let usrId = window.sessionStorage.usrId;
    let lectId = window.sessionStorage.lectId;
    let yearTaken = window.sessionStorage.yearTaken;
    let cal_cohort = window.sessionStorage.cal_cohort;
    let yearTmt = window.sessionStorage.yearTmt;
    let semTmt = window.sessionStorage.semTmt;
    let yearExmTmt = window.sessionStorage.yearExmTmt;
    let semExmTmt = window.sessionStorage.semExmTmt;
    
    $('#add_empId').val(lectId);

    if( lectId == usrId ){
        $('#btnSaveTeachTime').attr('disabled', false)
    }
    else{
        $('#btnSaveTeachTime').attr('disabled', true)
    }

    // detail lecturer
    lectDetails(lectId, function(){
        $('#empName').html(obj_lectDet.empId);
        // $('#emp_photo').attr("src", 'data:image/jpg;base64,'+obj_lectDet.emp_photo);
        $('#emp_name').html(obj_lectDet.emp_name);
        $('#emp_id').html(obj_lectDet.empId);
        $('#emp_department').html(obj_lectDet.dep_description);
        $('#emp_mobileno').html(obj_lectDet.emp_mobileno);
        $('#emp_email').html(obj_lectDet.emp_email);
        $('#emp_status').html(obj_lectDet.emp_status+' ('+obj_lectDet.emp_substatus+')');
        $('#emp_icno').html(obj_lectDet.emp_icno);
        $('#emp_gender').html(obj_lectDet.emp_gender);
        $('#emp_race').html(obj_lectDet.emp_race);
        $('#emp_religion').html(obj_lectDet.emp_religion);
        $('#emp_issuedate').html(obj_lectDet.emp_issuedate);
        $('#emp_issueexp').html(obj_lectDet.emp_issueexp);
    });

    // select session
    acaCalActive(function(){
        $('#year_regCrs').append('<option value="">- Choose Session -</option>');
        $('#year_regCrsCTE').append('<option value="">- Choose Session -</option>');

        let names = "";
        $.each(obj_kalendar.data, function (i, item){
            let curyear = item.cur_year.replace('/','');
            select = "";
            if(yearTaken == item.cur_year && cal_cohort == item.cal_cohort){
                select = "selected";
            }

            if(names != curyear+'/'+item.cal_cohort){
                names = curyear+'/'+item.cal_cohort;
                // (${item.cal_status})
                $('#year_regCrs').append(`<option value="`+item.cur_year+`" calSem="`+item.cal_cohort+`" `+select+`>`+curyear+`/`+item.cal_cohort+`</option>`);                
                $('#year_regCrsCTE').append('<option value="'+item.cur_year+'" calSem="'+item.cal_cohort+'" '+select+'>'+curyear+'/'+item.cal_cohort+'</option>');                

                // $('#year_regCrs').append('<option value="'+item.cur_year+'" calSem="'+item.cal_cohort+'" '+select+'>'+curyear+'/'+item.cal_cohort+'</option>');                
            }            
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:'
        });
    });

    if(!(yearTaken == null && cal_cohort == null)){
        listAcaCalLect(yearTaken, cal_cohort, lectId, function(){
            createTblLectCrs(obj_lectCrs.data);
        });
        window.sessionStorage.removeItem('yearTaken');
        window.sessionStorage.removeItem('cal_cohort');
    }

    // select Year Timetable
    acaCalActive(function(){
        $('#year_tmt').append('<option value="">- Choose Academic Session -</option>');
        let names = "";
        $.each(obj_kalendar.data, function (i, item){
            let curyear = item.cur_year.replace('/','');
            slctYear = "";
            if(yearTmt == item.cur_year && semTmt == item.cal_cohort){
                slctYear = "selected";
            }

            if(names != curyear+'/'+item.cal_cohort){
                names = curyear+'/'+item.cal_cohort;
                $('#year_tmt').append('<option value="'+item.cur_year+'" calSem="'+item.cal_cohort+'" '+slctYear+'>'+curyear+'/'+item.cal_cohort+'</option>');

                // $('#semester').append('<option '+select+' value="'+item.cal_id+'" calYear="'+item.cur_year+'" calSem="'+item.cal_cohort+'">'+item.cur_year.replace('/','')+'/'+item.cal_cohort+'</option>');
            }
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:'
        });
    });

    if(!(yearTmt == null && semTmt == null)){
        createTmt(lectId, yearTmt, semTmt);
        window.sessionStorage.removeItem('yearTmt');
        window.sessionStorage.removeItem('semTmt');
    }

    // select Year Examination Timetable
    acaCalActive(function(){
        $('#year_exmTmt').append('<option value="">- Choose Academic Session -</option>');
        let names = "";
        $.each(obj_kalendar.data, function (i, item){
            let curyear = item.cur_year.replace('/','');
            slctYear = "";
            if(yearExmTmt == item.cur_year && semExmTmt == item.cal_cohort){
                slctYear = "selected";
            }

            if(names != curyear+'/'+item.cal_cohort){
                names = curyear+'/'+item.cal_cohort;
                $('#year_exmTmt').append('<option value="'+item.cur_year+'" calSem="'+item.cal_cohort+'" '+slctYear+'>'+curyear+'/'+item.cal_cohort+'</option>');
            }
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:'
        });
    });

    if(!(yearExmTmt == null && semExmTmt == null)){
        listByCalLect(yearExmTmt, semExmTmt, lectId, function(){
            createTblExmTmt(obj_exmInvgltr.data);
        });
        window.sessionStorage.removeItem('yearExmTmt');
        window.sessionStorage.removeItem('semExmTmt');
    }

    // display detail teaching time
    detLectTeachTime(lectId);
});


$('#btnBack').click(function(){
    window.location.replace('adminPage.html');
    window.sessionStorage.removeItem('lectId');
});


//-------------------------------------------------- function onchange --------------------------------------------------//
// onchange select session for Timetable
$('#year_tmt').change(function(){
    let selectSession = $('#year_tmt').val();
    let lectId = $('#add_empId').val();
    let sem = $("#year_tmt option:selected").attr("calSem");

    $('#tmttbl_year').val(selectSession);
    $('#tmttbl_sem').val(sem);

    createTmt(lectId, selectSession, sem);
});


// onchange Academic Session lect_crs_setting
$('#year_regCrs').change(function(){
    let selectSession = $('#year_regCrs').val();
    let lectId = $('#add_empId').val();
    let sem = $("#year_regCrs option:selected").attr("calSem");

    listAcaCalLect(selectSession, sem, lectId, function(){
        createTblLectCrs(obj_lectCrs.data);
    });
});


// onchange Academic Session Exam Timetable
$('#year_exmTmt').change(function(){
    let selectSession = $('#year_exmTmt').val();
    let lectId = $('#add_empId').val();
    let sem = $("#year_exmTmt option:selected").attr("calSem");

    listByCalLect(selectSession, sem, lectId, function(){
        createTblExmTmt(obj_exmInvgltr.data);
    });
});
//-------------------------------------------------- end function onchange --------------------------------------------------//

$('#year_regCrsCTE').change(function(){
    let selectSession = $('#year_regCrsCTE').val();
    let lectId = $('#add_empId').val();
    let sem = $("#year_regCrsCTE option:selected").attr("calSem");

    listAcaCalLect(selectSession, sem, lectId, function(){
        createTblLectCrsCTE(obj_lectCrs.data, 'viewLect', lectId);
    });
});