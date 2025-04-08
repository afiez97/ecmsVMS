$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let getSession = window.sessionStorage.pgmSession;
    let calSem = window.sessionStorage.calSem;

    $.fn.select2.defaults.set( "theme", "bootstrap" );

    // console.log(getSession);
    // select academic calendar
    // acaCalActive(function(){
    //     $('#aca_session').append('<option value="">- Choose Academic Session -</option>');
    //     let names = "";
    //     $.each(obj_kalendar.data, function (i, item){
    //         select = "";
    //         if(getSession == item.cur_year.replace('/','-')){
    //             select = "selected";
    //         }

    //         if(names != item.cur_year.replace('/','')+'/'+item.cal_cohort){
    //             names = item.cur_year.replace('/','')+'/'+item.cal_cohort;
    //             $('#aca_session').append('<option '+select+' value="'+item.cal_id+'" calYear="'+item.cur_year+'" calSem="'+item.cal_cohort+'">'+item.cur_year.replace('/','')+'/'+item.cal_cohort+'</option>');
    //         }
    //     });

    //     $('.slct2').select2({
    //         width: null,
    //         containerCssClass: ':all:'
    //     });
    // });

    acaCalActive(function(){
        $('#aca_session').append('<option value="">- Choose Academic Session -</option>');
        let names = "";
        $.each(obj_kalendar.data, function (i, item){
            let curyear = item.cur_year.replace('/','');
            select = "";
            if(getSession == item.cur_year && cal_cohort == item.cal_cohort){
                select = "selected";
            }
            if(names != curyear+'/'+item.cal_cohort){
                names = curyear+'/'+item.cal_cohort;
                $('#aca_session').append('<option '+select+' value="'+item.cur_year+'" calSem="'+item.cal_cohort+'">'+curyear+'/'+item.cal_cohort+'</option>');
            }
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:'
        });
    });
    calCatList(function(){
        $('#aca_cal_category').append('<option value="">- Choose Academic Category -</option>');
        $.each(obj_acaField.data, function (i, item){
        // console.log(item);

            $('#aca_cal_category').append('<option value="'+item.pk_id+'">'+item.category+'</option>');


        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:'
        });
    });
    if(getSession != null && cal_cohort != null){
        listCrsReg(getSession, cal_cohort, function(){
            $("#loading_modal").modal('show');
            createTbl(obj_regCrs.data);
        });
        window.sessionStorage.removeItem('cal_year');
        window.sessionStorage.removeItem('cal_cohort');
        window.sessionStorage.removeItem('aca_cal');
        window.sessionStorage.removeItem('fk_course');
    }

    // select Campus List
    campusList(function(){
        $('#cam_id').append('<option value="">- Choose -</option>');
        $.each(obj_college.data, function (i, item){
            $('#cam_id').append('<option value="'+item.pk_id+'">'+item.clg_name+'</option>');
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:',
        });
    });



});

// onchange select Campus
$('#cam_id').change(function(){
    let campus = $(this).val();
    $('#tbl_venue').html('');

    if(campus != ''){
        listCenter(campus, function(){
            $('#tbl_venue').append('<option value="">- Choose -</option>');
            $.each(obj_exmCenter.data, function(i, item){
                $('#tbl_venue').append('<option value="'+item.center_id+'" capacity="'+item.cen_max_capacity+'"  name="'+item.cen_id+'">'+item.cen_id.toUpperCase()+'</option>');
            });
    
            $('.slct2').select2({
                width: null,
                containerCssClass: ':all:',
            });
        });
    }
});

var confirmed=false;
function generateTable(){
    let selectSession = $('#aca_session').val();
    let sem = $("#aca_session option:selected").attr("calSem");
    let aca_cal_category = $("#aca_cal_category").val();
    // let cam_id = $("#cam_id").val();
    let tbl_venue = $("#tbl_venue").val();

    let venueName = $("#tbl_venue option:selected").attr("name");

    // console.log(selectSession+`-`+sem+`-`+aca_cal_category + '-'+tbl_venue);
   // utk table student
   let formUpt = new FormData();

   formUpt.append('cur_year',selectSession);
   formUpt.append('cal_cohort',sem);
   formUpt.append('cal_category',aca_cal_category);
//    formUpt.append('cam_id',cam_id);
   formUpt.append('tbl_venue',tbl_venue);
   // console.log(window.sessionStorage.token)
   
   
   obj = new post(host + 'api_pengurusan_pelajar/public/curAcademic/adminSite/reporting/listStudentLoc',formUpt,'picoms ' + window.sessionStorage.token).execute();
   if (obj.success) {
       // console.log(obj);

       createTbl(obj);
       console.log(obj.data2);
       dataExam = obj.data2;
    //    let examdate = dataExam.tbl_date_start;
       let curyearExam = dataExam.cur_year.replace('/','')+'/'+dataExam.cal_cohort;
       
       buttonPDF = '<button onclick="generatePDF3(\'List Student By Category Academic\', \'tableReportListStudentpdf\', \''+venueName+'\', \''+curyearExam+'\')" class="btn btn-danger"> <i class="fa fa-fw fa-file-pdf-o"></i> PDF</button>';
    //    buttonPDF = '<button onclick="generatePDF3(\'List Student By Category Academic\', \'tableReportListStudentpdf\', \''+venueName+'\', \''+examdate+'\', \''+curyearExam+'\')" class="btn btn-danger"> <i class="fa fa-fw fa-file-pdf-o"></i> PDF</button>';

       $("#btnPDF").html(buttonPDF);

   }else{

    //    console.log('fail gila')

     }
   


}


function createTbl(dataReport){
    // getSessiopgmDetByCalSemn = getSession.replace('/','-');
    console.log(dataReport);

   
    $("#tableReportListStudent").html('');
    var columns = [
        { "name": "bil", "title": "NO." },
        { "name": "course", "title": "COURSE" },
        { "name": "date", "title": "DATE" },
        { "name": "time", "title": "TIME" },
        { "name": "tbl_no", "title": "TABLE NO" },
        { "name": "std_studentid", "title": "NAME"},
        { "name": "matric", "title": "MATRIC NO." },
        { "name": "pgmid", "title": "PROGRAMME"},
        { "name": "intake", "title": "INTAKE"},
        // { "name": "lectname", "title": "LECTURER" },


        // { "name": "Session", "title": "Session Academic"},
        // { "name": "category_aca_cal", "title": "Category Academic Calender" },
        // { "name": "signature", "title": "SIGNATURE" },
        // { "name": "new_pgm_id", "title": "New Programme", "breakpoints": "md sm xs" },
        // { "name": "sts_status", "title": "Status" },
        // { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
    ];
    let bil = 1;
    let convertList = JSON.stringify(dataReport.data);
    $("#dataList").val(convertList);
    var list = [];

    $.each(dataReport.data, function(i, field){
            
        let curyear = field.cur_year.replace('/','');

        sessionLabel = curyear +`/`+field.cal_cohort;
        couseCode = field.pk_course +` - `+field.crs_name;

        list.push({
            "bil":bil++, 
            "course":couseCode, 
            "lectname":field.emp_name, 
            "date":formatDate(field.tbl_date_start), 
            "time":formatTime(field.tbl_time_start), 
            "tbl_no":field.est_tableno, 
            "matric":field.std_studentid, 

            "std_studentid": '<span class="text-uppercase">'+field.sti_name+'</span>',
            "pgmid":field.pgm_id, 
            "intake":field.cur_intake, 
            // "Session": '<span class="text-uppercase">'+sessionLabel+'</span>', 
            // "category_aca_cal": '<span class="text-uppercase">'+field.category+'</span>', 
            "signature":'   ', 
            // "new_pgm_id": '<span class="text-uppercase">'+field.newPgm+'</span>',
            // "sts_status": recordstatus,
            // "upt_btn": '<button class="btn btn-outline-info" title="Update" onclick="loadData(\'' + field.id + '\')" ><i class="fa fa-cog"></i> View</button>'
        });            
    });

    $("#tableReportListStudent").footable({
        "columns": columns,
        "rows": list,
        "paging": {
            "enabled": true,
            "size": 30
        },
        "filtering": {
            "enabled": true,
            "placeholder": "Search...",
            "dropdownTitle": "Search for:"
        }
    });
    $("#tableReportListStudentpdf").footable({
        "columns": columns,
        "rows": list,
        "paging": {
            "enabled": false,
              }
    });
    $("#tableReportListStudentpdf").css("display", "none");

    
}

function campusList(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmCollege/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
       obj_college = response;
       returnValue();
    });
}

function listCenter(clg, returnValue){
    var settings = {
        "url": host+"api_exam_picoms/public/misExamCenter/listByCamAct/"+clg,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
       obj_exmCenter = response;
       returnValue();
    });
}
