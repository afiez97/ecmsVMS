$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let clg_id = window.sessionStorage.idPage;
    let usrRole = window.sessionStorage.usrRole;

    let listCrsData = JSON.parse(window.sessionStorage.crsData);
  
    let session = listCrsData[0].session;
    let category = listCrsData[0].category;
    let crsCode = listCrsData[0].crsCode;
    let crsName = listCrsData[0].crsName;
    let idSession = listCrsData[0].idSession;
    let fk_course = listCrsData[0].fk_course;
    $('#crs_session').html(session);
    $('#crs_category').html(category);
    $('#crs_course').html('<strong>' + crsCode + '</strong> - ' + crsName);

    $('#crsCode').val(fk_course);
    $('#acaCal').val(idSession);


    $('#clgId').val(clg_id);

    var form = new FormData();
    form.append("aca_session", idSession);
    form.append("crs_code", fk_course);

    let return_total =  new post(host+'api_pengurusan_pelajar/public/misStdRegsub/sumStdByAcaCalCrs',form,"picoms " + window.sessionStorage.token).execute();
    
    let total = 0;

    if(return_total.success){
        dataAca = return_total.data;
        total = dataAca[0].total;

        
        $('#crs_tstudent').html(total);
        // console.log(total);
    }





    if( usrRole == 'dekan' || usrRole == 'ketuaPJ' || usrRole == 'pensyarah' ){ $('#btnNew').hide(); }

    $.fn.select2.defaults.set( "theme", "bootstrap" );


        
    fk_exam_type(function(){
        $('#fk_exam_type').append('<option value="">- Choose -</option>');
        $.each(obj_exam_type.data, function(i, item){
            $('#fk_exam_type').append('<option value="'+item.pk_id+'">'+item.exam_type.toUpperCase()+'</option>');
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:'
        });
    });

    // select course
    courseList(function(){
        $('#gsc_name').append('<option value="">- Choose -</option>');
        $.each(obj_course.data, function(i, item){
            $('#gsc_name').append('<option value="'+item.crsId+'">'+item.crs_code.toUpperCase()+' '+item.crs_name.toUpperCase()+'</option>');
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:'
        });
    });

    paperType(function(){
        // $('#tbl_paper_type').html('');
        $('#tbl_paper_type').append('<option value="">- Choose -</option>');
        $.each(obj_pprType.data, function(i, item){
            $('#tbl_paper_type').append('<option value="'+item.pk_id+'">'+item.paper_type.toUpperCase()+'</option>');
        });
    });

    showTimetbl(idSession, fk_course, function(){

        var columns = [
            { "name": "bil", "title": "No." },
            { "name": "exam_type", "title": "Exam Type" },
            { "name": "paper_type", "title": "Paper Type" },
            { "name": "date", "title": "Date" },
            { "name": "stime", "title": "Course" },
            { "name": "etime", "title": "End Time" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];

        // console.log(obj_examTmt.data);

        let bil = 1;
        var list = [];

        $.each(obj_examTmt.data, function (i, field){

            // console.log(field);

            if (field.exam_type === 'RE-SIT EXAMINATION') {
                dsplyBtn = '<button class="btn btn-icon accent" title="re_sit" onclick="re_sit(\'' + field.pk_id + '\', \'' + idSession + '\', \'' + fk_course +'\')"><i class="ion-ios-list-outline"></i></button>'; 

            }else{
                dsplyBtn = '<button class="btn btn-icon accent" title="Details" onclick="detail(\'' + field.pk_id + '\', \'' + idSession + '\', \'' + fk_course +'\', \'' + field.exam_type +'\')"><i class="ion-ios-list-outline"></i></button>'; 

            }

            list.push({
                bil: bil++, 
                exam_type: field.exam_type, 
                // exam_type: field.exam_type.toUpperCase(), 
                paper_type: field.paper_type.toUpperCase(), 
                date: formatDate1(field.tbl_date_start), 
                stime: formatTime(field.tbl_time_start), 
                etime: formatTime(field.tbl_time_end), 
                upt_btn: dsplyBtn
            });
        });

        $("#crsExam").html('');
        $("#crsExam").footable({
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
                "dropdownTitle": "Search for:"
            }
        });
    });

}   );
var confirmed = false;

$("#formAddExam").on('submit', function(e){
    // let pkId = $('#pkId').val();
    let status = '';
    let swalBtn = '';
    let swalBtnCOlor = '';
    let formUrl = '';
    let recordstatus = '';

    status = 'Add';
    swalBtn = 'Save';
    swalBtnCOlor = '#2196f3';
    formUrl = 'register';
    recordstatus = 'ADD';


    if(!confirmed){
        e.preventDefault();
        swal({
            title: status+"Course Examination",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: swalBtn,
            confirmButtonColor: swalBtnCOlor,
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let fk_acaCal = $('#acaCal').val();
            let fk_course = $('#crsCode').val();
            let tbl_paper_type = $('#tbl_paper_type').val();
            let tbl_date_start = $('#tbl_date_start').val();
            let tbl_time_start = $('#tbl_time_start').val();
            let tbl_time_end = $('#tbl_time_end').val();

            let fk_exam_type = $('#fk_exam_type').val();

            var form = new FormData();
            // if( pkId != '' ){
            //     form.append("pk_id", pkId);
            // }
            // else{
            form.append("fk_acaCal", fk_acaCal);
            form.append("fk_course", fk_course);
            // }
            form.append("tbl_paper_type", tbl_paper_type);
            form.append("tbl_date_start", tbl_date_start);
            form.append("tbl_time_start", tbl_time_start);
            form.append("tbl_time_end", tbl_time_end);
            form.append("fk_exam_type", fk_exam_type);
            form.append("recordstatus", recordstatus);

            var settings = {
                "url": host+"api_exam_picoms/public/misExamTimetbl/"+formUrl,
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
    
            $.ajax(settings).done(function (response){
                result = JSON.parse(response);
                if (!result.success) {
                    Swal(result.message, result.data, "error");
                    return;
                }
                window.location.reload();
            });
        });
    }
});
//-------------------------------------------------- end add grading scheme --------------------------------------------------//

function showTimetbl(acaCal, course, returnValue){
    var form = new FormData();
    form.append("fk_acaCal", acaCal);
    form.append("fk_course", course);

    var settings = {
        "url": host+"api_exam_picoms/public/misExamTimetbl/showByCalCrs",
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

    $.ajax(settings).done(function (response){
        obj_examTmt = JSON.parse(response);
        returnValue();        
    });
}

function paperType(returnValue){
    var settings = {
        "url": host+"api_exam_picoms/public/misExamPprType/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_pprType = response;
        returnValue();        
    });
}



function fk_exam_type(returnValue){
    var settings = {
        "url": host+"api_exam_picoms/public/misExamType/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_exam_type = response;
        returnValue();        
    });
}


function detail(pkId, idSession, fk_course, typeExam){
    window.sessionStorage.aca_cal = idSession;
    window.sessionStorage.fk_course = fk_course;
    window.sessionStorage.typeExam = typeExam;
    window.location.replace('exam_jadDetail.html');
    window.sessionStorage.pkId = pkId;

    $('#content').load('exam_jadDetail.html');

   

}

function re_sit(pkId, idSession, fk_course){
    window.sessionStorage.aca_cal = idSession;
    window.sessionStorage.fk_course = fk_course;
    window.location.replace('exam_jadDetail_special.html');
    window.sessionStorage.pkId = pkId;

    $('#content').load('exam_jadDetail_special.html');

   

}

// btn Back to admin page
$('#btnBack').click(function(){
    // // window.sessionStorage.content('exam_jadualWaktu');

    // // window.location.replace('adminPage.html');
    // // // window.sessionStorage.removeItem('timetbl_id');
    // // // window.sessionStorage.removeItem('fk_course');
    // // // exam_jadualWaktu
    // // // window.location.replace('exam_jadualWaktu.html');

    // // $('#content').load('exam_jadualWaktu.html');
    // window.location.replace('exam_jadualWaktu.html');
    // // window.sessionStorage.pkId = pkId;

    // $('#content').load('exam_jadualWaktu.html');
    window.sessionStorage.content = "exam_jadualWaktu";
    $('#content').load('exam_jadualWaktu.html');

});