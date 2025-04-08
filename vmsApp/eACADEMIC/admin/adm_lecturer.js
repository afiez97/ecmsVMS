$(function(){
    $.ajaxSetup ({
        cache: false
    });

    load_capaian();


    $.fn.select2.defaults.set( "theme", "bootstrap" );

    let usrId = window.sessionStorage.usrId;
    let catEcms = window.sessionStorage.usrCatEcmis;
    let catAdmin = window.sessionStorage.usrCatEadmin;
    let yearTaken = window.sessionStorage.yearTaken;
    let cal_cohort = window.sessionStorage.cal_cohort;
    let yearTmt = window.sessionStorage.yearTmt;
    let semTmt = window.sessionStorage.semTmt;
    let yearExmTmt = window.sessionStorage.yearExmTmt;
    let semExmTmt = window.sessionStorage.semExmTmt;
    
    let lectId=  window.sessionStorage.lectId;
    $('#add_empId').val(usrId);
    typeAccess();

    // $('#divLectList').show();
    // $('#divLectDetails').hide();
    if(dataPK == 1){
        $('#divLectList').show();
        $('#divLectDetails').hide();


    // list faculty lecturer

    lecturerList(function(){
        var columns = [
            { "name": "emp_id", "title": "Staff No." },
            { "name": "emp_name", "title": "Staff Name" },
            { "name": "fac_id", "title": "Faculty" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];

        let convertList = JSON.stringify(obj_lecturer.data);
        $("#dataLectList").val(convertList);
        var list = [];

        $.each(obj_lecturer.data, function (i, field){

             if (!field.facOri_short && !field.facOri){
                    dataFac = '';
                }
                else{
                    dataFac = field.facOri_short+' - '+field.facOri;
                }

            list.push({
                emp_id: field.emp_id, 
                fac_id: '<span class="text_uppercase">'+dataFac+'</span>', 
                emp_name: field.emp_name,
                upt_btn: '<button class="btn btn-icon accent" title="Details" onclick="detLecturer(\'' + field.emp_id + '\')"><i class="ion-ios-list-outline"></i></button>'
            });
        });

        $("#pensyarahList").footable({
            "columns": columns,
            "rows": list,
            "paging": {
                "enabled": true,
                "size": 10,
                "countFormat": "Showing {PF} to {PL} of {TR} data"
            },
            "filtering": {
                "enabled": true,
                "placeholder": "Search...",
                "dropdownTitle": "Search For:"
            }
        });
    });
    }
   else if(dataPK == 2){

        $('#divLectList').show();
        $('#divLectDetails').hide();

        lecturerList(function(){
            var columns = [
                { "name": "emp_id", "title": "Staff No." },
                { "name": "emp_name", "title": "Staff Name" },
                { "name": "fac_id", "title": "Faculty" },
                { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
            ];
    
            let convertList = JSON.stringify(obj_lecturer.data);
            $("#dataLectList").val(convertList);
            var list = [];
    
            let objFindFac = new get(host+`api_tetapan_picoms/public/hrmEmpInfo/show/`+ window.sessionStorage.usrId , 'picoms ' + window.sessionStorage.token).execute();
            dataFac = objFindFac.data;

            // console.log(dataFac.emp_division);
           let filteredNames = $(obj_lecturer.data).filter(function( idx ) {
            // console.log(dataFac.emp_division);
            // console.log((obj_lecturer.data)[idx].emp_division);

    
                return (obj_lecturer.data)[idx].emp_division === dataFac.emp_division;
            }); 

            $.each(filteredNames, function (i, field){
                // console.log(field);
                

                if (!field.facOri_short && !field.facOri){
                    dataFac = '';
                }
                else{
                    dataFac = field.facOri_short+' - '+field.facOri;
                }

                
                list.push({
                    emp_id: field.emp_id, 
                    fac_id: '<span class="text_uppercase">'+dataFac+'</span>', 
                    emp_name: field.emp_name,
                    upt_btn: '<button class="btn btn-icon accent" title="Details" onclick="detLecturer(\'' + field.emp_id + '\')"><i class="ion-ios-list-outline"></i></button>'
                });
            });
    
            $("#pensyarahList").footable({
                "columns": columns,
                "rows": list,
                "paging": {
                    "enabled": true,
                    "size": 10,
                    "countFormat": "Showing {PF} to {PL} of {TR} data"
                },
                "filtering": {
                    "enabled": true,
                    "placeholder": "Search...",
                    "dropdownTitle": "Search For:"
                }
            });
        });

    }  
    // else if(dataPK == 4){
    else{
        lectDetails(usrId, function(){
            $('#emp_name').html(obj_lectDet.emp_name);
            $('#emp_id').html(obj_lectDet.empId);
            $('#emp_icno').html(obj_lectDet.emp_icno);
            $('#emp_department').html(obj_lectDet.dep_description);
            $('#emp_mobileno').html(obj_lectDet.emp_mobileno);
            $('#emp_gender').html(obj_lectDet.emp_gender);
            $('#emp_race').html(obj_lectDet.emp_race);
            $('#emp_religion').html(obj_lectDet.emp_religion);
            $('#emp_status').html(obj_lectDet.emp_status+' ('+obj_lectDet.emp_substatus+')');
            $('#emp_email').html(obj_lectDet.emp_email);

            window.sessionStorage.lectId = obj_lectDet.empId;
            $('#divLectList').hide();
            $('#divLectDetails').show();
        });

        // select Academic Session lect_crs_setting
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
                    $('#year_regCrs').append('<option value="'+item.cur_year+'" calSem="'+item.cal_cohort+'" '+select+'>'+curyear+'/'+item.cal_cohort+'</option>');                
                    $('#year_regCrsCTE').append('<option value="'+item.cur_year+'" calSem="'+item.cal_cohort+'" '+select+'>'+curyear+'/'+item.cal_cohort+'</option>');                
                }            
            });            

            $('.slct2').select2({
                width: null,
                containerCssClass: ':all:'
            });
        });

        if(!(yearTaken == null && cal_cohort == null)){
            listAcaCalLect(yearTaken, cal_cohort, lectId, function(){
                createTblLectCrs(obj_lectCrs.data, 'viewLect');
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
        });

        if(!(yearTmt == null && semTmt == null)){
            createTmt(lectId, yearTmt, semTmt, 'viewLect');
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
                createTblExmTmt(obj_exmInvgltr.data, 'viewLect');
            });
            window.sessionStorage.removeItem('yearExmTmt');
            window.sessionStorage.removeItem('semExmTmt');
        }

        // detail lecturer teach time
        detLectTeachTime(usrId);
    }
});


function detLecturer(empId){
    window.sessionStorage.lectId = empId;
    window.location.replace("lecturer_details.html");
}


function createTblCrs(lectId, year){
    lectGrpByCourse(lectId, function(){
        let columns = [
            { "name": "bil", "title": "No." },
            { "name": "cur_year", "title": "Session Taken" },
            { "name": "crs_code", "title": "Course" },
            { "name": "total_std", "title": "No. of Student", "breakpoints": "md sm xs" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" }
        ];
        let bil = 1;
        var list_data = [];
        let convertList = JSON.stringify(obj_lectCrs.data);
        $("#dataList").val(convertList);

        $.each(obj_lectCrs.data, function(i, field){
            let coor = field.coordinator;
            let display = '';
            if( coor != 'Yes' ){ display = 'disabled' }
            // console.log(field);

            let return_year = function (){
                var form = new FormData();
                form.append("cur_year", year);
                form.append("fk_course", field.fk_course);

                let tmp = {};
                $.ajax({
                    "url": host+"api_pengurusan_pelajar/public/misStdRegsub/listByYearCrs",
                    "method": "POST",
                    "timeout": 0,
                    "headers": {
                        "Authorization": "picoms " + window.sessionStorage.token
                    },
                    'async': false,
                    'global': false,
                    "processData": false,
                    "mimeType": "multipart/form-data",
                    "contentType": false,
                    "data": form,
                    'success': function (data){
                        let getdata = JSON.parse(data);
                        tmp.total = getdata.data.length;
                    }
                });
                return tmp;
            }();
            // console.log(return_year);

            if(return_year.total > 0){
                list_data.push({
                    bil: bil++, cur_year: year.replace('-','/'), crs_code: '<span class="text-uppercase"><b>'+field.crsCode+'</b><br>'+field.crs_name+'</span>', total_std: return_year.total,
                    "upt_btn": '<button class="btn btn-icon accent" title="Details" onclick="detail(\'' + i + '\',\'viewLect\',\'' +year+ '\')" '+display+'><i class="ion-ios-list-outline"></i></button> ' +
                                '<button class="btn btn-icon warn" title="Student List" onclick="studentList(\'' + i + '\',\'viewLect\',\'' +year+ '\')" id="btnStdList"><i class="ion-ios-people"></i></button>'
                });
            }
        });

        $('#crList').html('');
        $('#crList').footable({
            "columns": columns,
            "rows": list_data,
            "paging": {
                "enabled": true,
                "size": 10,
                "countFormat": "Showing {PF} to {PL} of {TR} data"
            },
            "filtering": {
                "enabled": true,
                "placeholder": "Search...",
                "dropdownTitle": "Search for:"
            }
        });
    });
}

function createTblCrsCTE(lectId, year){
    lectGrpByCourseCTE(lectId, function(){
        let columns = [
            { "name": "bil", "title": "No." },
            { "name": "cur_year", "title": "Session Taken" },
            { "name": "crs_code", "title": "Course" },
            { "name": "total_std", "title": "No. of Student", "breakpoints": "md sm xs" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" }
        ];
        let bil = 1;
        var list_data = [];
        let convertList = JSON.stringify(obj_lectCrs.data);
        $("#dataListCTE").val(convertList);

        $.each(obj_lectCrs.data, function(i, field){
            let coor = field.coordinator;
            let display = '';
            if( coor != 'Yes' ){ display = 'disabled' }
            // console.log(field);

            let return_year = function (){
                var form = new FormData();
                form.append("cur_year", year);
                form.append("fk_course", field.fk_course);

                let tmp = {};
                $.ajax({
                    "url": host+"api_pengurusan_pelajar/public/misStdRegsub/listByYearCrs",
                    "method": "POST",
                    "timeout": 0,
                    "headers": {
                        "Authorization": "picoms " + window.sessionStorage.token
                    },
                    'async': false,
                    'global': false,
                    "processData": false,
                    "mimeType": "multipart/form-data",
                    "contentType": false,
                    "data": form,
                    'success': function (data){
                        let getdata = JSON.parse(data);
                        tmp.total = getdata.data.length;
                    }
                });
                return tmp;
            }();
            // console.log(return_year);

            if(return_year.total > 0){
                list_data.push({
                    bil: bil++, cur_year: year.replace('-','/'), crs_code: '<span class="text-uppercase"><b>'+field.crsCode+'</b><br>'+field.crs_name+'</span>', total_std: return_year.total,
                    "upt_btn": '<button class="btn btn-icon accent" title="Details" onclick="detail(\'' + i + '\',\'viewLect\',\'' +year+ '\')" '+display+'><i class="ion-ios-list-outline"></i></button> ' +
                                '<button class="btn btn-icon warn" title="Student List" onclick="studentList(\'' + i + '\',\'viewLect\',\'' +year+ '\')" id="btnStdList"><i class="ion-ios-people"></i></button>'
                });
            }
        });

        $('#crListCTE').html('');
        $('#crListCTE').footable({
            "columns": columns,
            "rows": list_data,
            "paging": {
                "enabled": true,
                "size": 10,
                "countFormat": "Showing {PF} to {PL} of {TR} data"
            },
            "filtering": {
                "enabled": true,
                "placeholder": "Search...",
                "dropdownTitle": "Search for:"
            }
        });
    });
}


//-------------------------------------------------- function onchange --------------------------------------------------//
// onchange select session
$('#year_regCrs').change(function(){
    let selectSession = $('#year_regCrs').val();
    let lectId = $('#add_empId').val();
    let sem = $("#year_regCrs option:selected").attr("calSem");

    listAcaCalLect(selectSession, sem, lectId, function(){
        createTblLectCrs(obj_lectCrs.data, 'viewLect');
    });
});

$('#year_regCrsCTE').change(function(){
    let selectSession = $('#year_regCrsCTE').val();
    let lectId = $('#add_empId').val();
    let sem = $("#year_regCrsCTE option:selected").attr("calSem");

    listAcaCalLect(selectSession, sem, lectId, function(){
        createTblLectCrsCTE(obj_lectCrs.data, 'viewLect', lectId);
    });
});


// onchange select session for Timetable
$('#year_tmt').change(function(){
    let selectSession = $('#year_tmt').val();
    let lectId = $('#add_empId').val();
    let sem = $("#year_tmt option:selected").attr("calSem");

    $('#tmttbl_year').val(selectSession);
    $('#tmttbl_sem').val(sem);

    createTmt(lectId, selectSession, sem, 'viewLect');
});


// onchange Academic Session Exam Timetable
$('#year_exmTmt').change(function(){
    let selectSession = $('#year_exmTmt').val();
    let lectId = $('#add_empId').val();
    let sem = $("#year_exmTmt option:selected").attr("calSem");

    listByCalLect(selectSession, sem, lectId, function(){
        createTblExmTmt(obj_exmInvgltr.data, 'viewLect');
    });
});
//-------------------------------------------------- end function onchange --------------------------------------------------//