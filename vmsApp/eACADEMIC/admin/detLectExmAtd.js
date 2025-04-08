$(function(){
    $.ajaxSetup ({
        cache: false
    });

    $.fn.select2.defaults.set( "theme", "bootstrap" );

    let exmInvgltr_id = window.sessionStorage.exmInvgltr_id;
    let fk_exmTimetbl = window.sessionStorage.fk_exmTimetbl;

    $('#exmInvgltr_id').val(exmInvgltr_id);
    $('#fk_exmTimetbl').val(fk_exmTimetbl);

    // show Exam Invigilator
    showExmInv(exmInvgltr_id, function(){

        // capaianLecturer = load_capaian();
        load_capaian();
        capaianLecturer = window.capaianData;
        // console.log(capaianLecturer);
        let uptLecturer = capaianLecturer[1];

        

        $.each(obj_exmInv.data, function(i, item){
            $('#emp_id').html(item.emp_name);
            $('#cur_year').html(item.cal_year.replace('/','')+'/'+item.cal_cohort);
            $('#acaCal_type').html(item.category);
            $('#paperType').html(item.paper_type);
            $('#crs_code').html(item.crs_code+' - '+item.crs_name);
            $('#exmDate').html(formatDate(item.tbl_date_start));
            $('#exmTime').html(formatTime(item.tbl_time_start)+' - '+formatTime(item.tbl_time_end));
            $('#exmVenue').html(item.clg_name+' - '+item.cen_id);

            // list student registered
            stdByExmVenue(fk_exmTimetbl, item.fk_venue, function(){

                if (uptLecturer == 0){
                    var columns = [
                        { "name": "bil", "title": "No." },
                        { "name": "student_id", "title": "Student" },
                        { "name": "pgm_code", "title": "Programme" },
                        // { "name": "chkbox", "title": "Attendance", "breakpoints": "md sm xs" },
                    ];
                }
                else{
                    var columns = [
                        { "name": "bil", "title": "No." },
                        { "name": "student_id", "title": "Student" },
                        { "name": "pgm_code", "title": "Programme" },
                        { "name": "chkbox", "title": "Attendance", "breakpoints": "md sm xs" },
                    ];
                }

                

                let convertList = JSON.stringify(obj_exmStd.data);
                $("#dataList").val(convertList);
                var list = [];
                let bil = 1;
            
                $.each(obj_exmStd.data, function (j, itemJ){
                    let attStts = itemJ.attendance;
                    let chk = '';
                    if(attStts == 'Attend'){ chk = 'checked' }
                    else{ chk = '' }

                    list.push({
                        bil: bil++, student_id: '<span class="text-uppercase"><b>'+itemJ.std_id+'</b><br>'+itemJ.sti_name+'</span>', pgm_code: '<span class="text-uppercase">'+itemJ.pgmCode+'</span>',
                        chkbox: '<label  class="ui-switch primary m-t-xs m-r" ><input  type="checkbox" id="chkbox_'+itemJ.tblNo_id+'" onclick="chkBox(\'' +j+ '\',\'' +itemJ.tblNo_id+ '\')" '+chk+'><i></i></label>'
                    });
                });
            
                $("#tblStudent").footable({
                    "columns": columns,
                    "rows": list,
                    "paging": {
                        "enabled": true,
                        "size": 50,
                        "countFormat": "Showing {PF} to {PL} of {TR} data"
                    },
                    "filtering": {
                        "enabled": true,
                        "placeholder": "Search...",
                        "dropdownTitle": "Search for:"
                    }
                });
            });
        });
    });
});
var confirmed = false;


// btn Back to admin page
$('#btnBack').click(function(){
    let prevPage = window.sessionStorage.prevPage;
    let page = '';
    if( prevPage == 'viewLect' ){ page = 'adminPage.html' }
    else{ page = 'lecturer_details.html' }

    window.location.replace(page);
    window.sessionStorage.removeItem('exmInvgltr_id');
    window.sessionStorage.removeItem('prevPage');
    window.sessionStorage.removeItem('fk_exmTimetbl');
});


//-------------------------------------------------- change status --------------------------------------------------//
function postStatus(status, stdExmId){
    swal({
        title: "Change status",
        text: "Are You Sure?",
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Update",
        confirmButtonColor: "#22b66e",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false
    }).then(function (){
        var form = new FormData();
        form.append("pk_id", stdExmId);
        form.append("attendance", status);
        form.append("recordstatus", 'EDT');

        var settings = {
            "url": host+"api_exam_picoms/public/misExamStd/uptAttndnc",
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

function chkBox(indexs, stdExmId){
    if( $('#chkbox_'+stdExmId).prop("checked") ){
        $('#chkbox_'+stdExmId).prop("checked", false);
        postStatus('Attend', stdExmId);
    }
    else{
        $('#chkbox_'+stdExmId).prop("checked", true);
        postStatus('', stdExmId);
    }
}
//-------------------------------------------------- end change status --------------------------------------------------//


//-------------------------------------------------- save All student attend --------------------------------------------------//
async function fullAttend(stdExmId){
    return new Promise(resolve => {
        setTimeout(() => {
            var form = new FormData();
            form.append("pk_id", stdExmId);
            form.append("attendance", 'Attend');
            form.append("recordstatus", 'EDT');
        
            var settings = {
                "url": host+"api_exam_picoms/public/misExamStd/uptAttndnc",
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
                else{
                    swal({
                        text: stdExmId,
                        type: "info"
                    });
                }
            });
            resolve();            
        }, Math.random() * 1000)
    })
}

$('#chkbox_all').click(function(){
    let data = JSON.parse($("#dataList").val());

    async function main(){
        await Promise.all(
            data.map(async (item, i) =>{
                let stdExmId = item.tblNo_id;
                await fullAttend(stdExmId);                
            })
        )
        window.location.reload();
    }

    if( $('#chkbox_all').prop("checked") ){
        swal({
            title: "All Student Attend",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            showLoaderOnConfirm: true,
            html: false
        }).then(function (){
            main()
        });
    }
});
//-------------------------------------------------- end save All student attend --------------------------------------------------//


$('#btnPrint').click(function(){
    window.open('print_exmStd.html');
});


function stdByExmVenue(exmTmt, venue, returnValue){
    var form = new FormData();
    form.append("fk_exam", exmTmt);
    form.append("fk_venue", venue);

    var settings = {
        "url": host+"api_exam_picoms/public/misExamStd/listByExamVenue",
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
        obj_exmStd = JSON.parse(response);
        returnValue();        
    });
}