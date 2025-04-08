let usrCatEadmin = window.sessionStorage.usrCatEadmin;
let usrCatEcmis = window.sessionStorage.usrCatEcmis;

$(function(){
    $.ajaxSetup ({
        cache: false
    });

    $.fn.select2.defaults.set( "theme", "bootstrap" );

    let id = window.sessionStorage.tmtDet_id;
    let yearTmt = window.sessionStorage.yearTmt;
    let lectId = window.sessionStorage.lectId;
    $('#yearTmt').val(yearTmt);

    // show course lecturer
    detailTmt(id, function(){
        let data = obj_tmtDet.data;
        let dayVal = '';
        if( data.tmt_day == '1' ){ dayVal = 'MONDAY' }
        else if( data.tmt_day == '2' ){ dayVal = 'TUESDAY' }
        else if( data.tmt_day == '3' ){ dayVal = 'WEDNESDAY' }
        else if( data.tmt_day == '4' ){ dayVal = 'THURSDAY' }
        else if( data.tmt_day == '5' ){ dayVal = 'FRIDAY' }
        else if( data.tmt_day == '6' ){ dayVal = 'SATURDAY' }
        else if( data.tmt_day == '7' ){ dayVal = 'SUNDAY' }

        $('#tmtDet_id').val(data.tmtDet_id);
        $('#fk_course').val(data.fk_course);
        $('#fk_acaCal').val(data.fk_acaCal);
        $('#tmt_year').html(data.cal_year.replace('/','')+'/'+data.cal_cohort);
        $('#tmt_category').html(data.category);
        $('#tmt_course').html(data.crs_code+' - '+data.crs_name);
        $('#tmt_day').html(dayVal);
        $('#tmt_time').html(formatTime(data.tmt_starttime)+' - '+formatTime(data.tmt_endtime));
        $('#tmt_slot').html(data.tmt_slot);
        $('#tmt_location').html(data.loc_name);

        var startTimeStr = '2023-08-01 ' + data.tmt_starttime;
        var endTimeStr = '2023-08-01 ' + data.tmt_endtime;
    
        // Create Date objects
        var startTime = new Date(startTimeStr);
        var endTime = new Date(endTimeStr);
    
        // Get the difference in hours between the start time and end time
        var diffInHours = (endTime - startTime) / (1000 * 60 * 60);
    
        window.sessionStorage.hour = diffInHours;

        // student list
        let data_summary = {};
        data_summary['fk_week'] = data.tmtDet_id;
        data_summary['aca_session'] = data.fk_acaCal;
        data_summary['crs_code'] = data.fk_course;
        data_summary['fk_lecturer'] = lectId;
        data_summary['tmt_yearReport'] = $('#tmt_year').html();
        data_summary['tmt_courseReport'] = $('#tmt_course').html();
        // console.log(data_summary)
        window.sessionStorage.form = JSON.stringify(data_summary);

        // Attendance Week
        weekList(id, function(){
            let data = obj_atdWeek.data;
            createTblWeek(data);
        });
    });
});
var confirmed = false;

$(".btn_summary").click(() =>{
    window.open('print_summary_tmtdet.html');
});


$('#btnBack').click(function(){
    let prevPage = window.sessionStorage.prevPage;
    let page = '';
    if( prevPage == 'viewLect' ){ page = 'adminPage.html' }
    else{ page = 'lecturer_details.html' }

    window.location.replace(page);
    window.sessionStorage.removeItem('tmtDet_id');
    window.sessionStorage.removeItem('prevPage');
});


//-------------------------------------------------- add Week Attendance --------------------------------------------------//
$('#formAddWeek').on('submit', function(e){
    let pk_id = $('#pk_week').val();
    let title = ''; let btn = ''; btnColor = ''; actUrl = ''; let recStatus = '';

    if(pk_id != ''){
        title = 'Update';
        btn = 'Update';
        btnColor = '#22b66e';
        actUrl = 'update';
        recStatus = 'EDT';
    }
    else{
        title = 'Add';
        btn = 'Save';
        btnColor = '#2196f3';
        actUrl = 'register';
        recStatus = 'ADD';
    }

    if(!confirmed){
        e.preventDefault();
        swal({
            title: title+" Week",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: btn,
            confirmButtonColor: btnColor,
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let fk_timetbl = $('#tmtDet_id').val();
            let att_date = $('#att_date').val();
            let att_week = $('#att_week').val();
            let att_hour = window.sessionStorage.hour;

            var form = new FormData();
            if(pk_id != ''){ form.append("pk_id", pk_id); }
            form.append("fk_timetbl", fk_timetbl);
            form.append("att_date", att_date);
            form.append("att_week", att_week);
            form.append("att_hour", att_hour);
            form.append("recordstatus", recStatus);

            var settings = {
                "url": host+"api_timetbl_picoms/public/misAtdWeek/"+actUrl,
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
                let result = JSON.parse(response);
                if(result.success){
                    window.location.reload();
                }
                else{ swal("Failed", response.message, "error"); }
            });
        });
    }
});
//-------------------------------------------------- end add Week Attendance --------------------------------------------------//


//-------------------------------------------------- delete Attendance Week --------------------------------------------------//
function delData(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("pk_id", id);

    swal({
        title: "Remove Week",
        text: "Are You Sure?",
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Remove",
        confirmButtonColor: "#ef193c",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false
    }).then(function (){
        var settings = {
            "url": host+"api_timetbl_picoms/public/misAtdWeek/delete",
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
//-------------------------------------------------- end delete Attendance Week --------------------------------------------------//


function createTblWeek(data){

    // capaianLecturer = load_capaian();
    load_capaian();
    capaianLecturer = window.capaianData;
    // console.log(capaianLecturer);
    // let addLecturer = capaianLecturer[0];
    let uptLecturer = capaianLecturer[1];
    let delLecturer = capaianLecturer[2];

    // if (addLecturer == 0){
    //     LecturerAddDisabled = 'disabled';
    // }
    // else{
    //     LecturerAddDisabled = ''; 
    // }

    if (uptLecturer == 0){
        LecturerUpdateDisabled = 'hidden';
    }
    else{
        LecturerUpdateDisabled = ''; 
    }


    if (delLecturer == 0){
        LecturerDelDisabled = 'hidden';
    }
    else{
        LecturerDelDisabled = ''; 
    }

    var columns = [
        { "name": "att_week", "title": "Week" },
        { "name": "att_date", "title": "Date" },
        { "name": "btnAction", "title": "Action", "breakpoints": "md sm xs" },
    ];

    let bil = 1;
    let convertList = JSON.stringify(data);
    $("#dataAtdWeek").val(convertList);
    var list = [];

    $.each(data, function (j, itemJ){
        list.push({
            att_week: '<a class="" title="View" onclick="stdData(\''+itemJ.fk_tmtDet+'\',\'' +itemJ.pk_id+ '\',\''+'<b>Week '+itemJ.att_week+'</b> - '+formatDate(itemJ.att_date)+'\')"><i class="fa fa-users text-primary"></i></a>  '
            +'<b>Week '+itemJ.att_week+'</b>', att_date: formatDate(itemJ.att_date),
            btnAction: ' <a class="m-r-1 " title="Update"  '+LecturerUpdateDisabled+' onclick="loadData(\'' +j+ '\')"><i class="ion-android-create" style="color: #22b66e;"></i></a>' +
                        '<a class="m-r-1" title="QR Code" onclick="qrCode(\'' +j+ '\',\'' +itemJ.pk_id+ '\',\'' +itemJ.fk_tmtDet+ '\')"><i class="fa fa-qrcode"></i></a>' +
                        '<a class="" title="Remove" '+LecturerDelDisabled+' onclick="delData(\'' +itemJ.pk_id+ '\')"><i class="ion-trash-b" style="color: #ef193c"></i></a>'                         
        });
    });

    $("#tblAtdWeek").footable({
        "showHeader": false,
        "columns": columns,
        "rows": list,
        "paging": {
            "enabled": true,
            "size": 5,
            "countFormat": "Showing {PF} to {PL} of {TR} data"
        },
    });
}


function loadData(index){
    let data = JSON.parse($("#dataAtdWeek").val());
    data = data[index];

    $('#pk_week').val(data.pk_id);
    $('#att_date').val(data.att_date);
    $('#att_week').val(data.att_week);

    $('#mdlHeader').html('UPDATE WEEK');
    $('#btnAction').val('Update');
    $('#btnAction').removeClass('info');
    $('#btnAction').addClass('success');
    $('#mdlWeek').modal('show');
}


$('#btnNewRecord').click(function(){
    $('#formAddWeek')[0].reset();
    $('#pk_week').val('');
    $('#mdlHeader').html('ADD WEEK');
    $('#btnAction').val('Save');
    $('#btnAction').removeClass('success');
    $('#btnAction').addClass('info');
});


// function qrCode(index){
//     let data = JSON.parse($("#dataAtdWeek").val());
//     data = data[index];

//     $('#titleStd').html('WEEK '+data.att_week);
//     let fk_course = $('#fk_course').val();
//     let fk_acaCal = $('#fk_acaCal').val();

//     // student list
//     stdByAcaCalCrs(fk_acaCal, fk_course, function(){
//         createTblStdAttd(obj_stdRegCrs.data, dtWeek.pk_id);
//     });
// }

function qrCode(index,pk_id,fk_tmtDet){
    let data = JSON.parse($("#dataAtdWeek").val());
    data = data[index];

    $('#title_att').html('WEEK '+data.att_week);
    let url_qrcode = url + 'admin/attendance.html?tmt=' + fk_tmtDet + '&id=' + pk_id + '&code_received=' + window.sessionStorage.token + '&year=' + window.sessionStorage.yearTmt;
    $("#url_qrcode").html(url_qrcode);

    var qrcode = new QRious({
        element: document.getElementById("qrcode"),
        background: '#ffffff',
        backgroundAlpha: 1,
        foreground: '#5868bf',
        foregroundAlpha: 1,
        level: 'H',
        padding: 0,
        size: 256,
        value: url_qrcode
    });    
    $("#modal_qr").modal('show');
}


//-------------------------------------------------- attendance status --------------------------------------------------//
// add attendance
function postStatus(week, std){
    let tmtDet_id = $('#tmtDet_id').val();
    let fk_course = $('#fk_course').val();
    let fk_acaCal = $('#fk_acaCal').val();

    swal({
        title: "Add Student",
        text: "Are You Sure?",
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Add",
        confirmButtonColor: "#2196f3",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false
    }).then(function (){
        var form = new FormData();
        form.append("fk_tmtDet", tmtDet_id);
        form.append("fk_week", week);
        form.append("std_studentid", std);
        form.append("recordstatus", 'ADD');

        var settings = {
            "url": host+"api_timetbl_picoms/public/misAtdAttendance/register",
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
                stdByAcaCalCrs(fk_acaCal, fk_course, function(){
                    createTblStdAttd(obj_stdRegCrs.data, week);
                });
            }
        });
    });
}


// delete attendance
function delStdAttd(id, week){
    let fk_course = $('#fk_course').val();
    let fk_acaCal = $('#fk_acaCal').val();

    swal({
        title: "Remove Student",
        text: "Are You Sure?",
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Remove",
        confirmButtonColor: "#ef193c",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false
    }).then(function (){
        var form = new FormData();
        form.append("atd_id", id);
        form.append("recordstatus", 'DEL');

        var settings = {
            "url": host+"api_timetbl_picoms/public/misAtdAttendance/delete",
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
                stdByAcaCalCrs(fk_acaCal, fk_course, function(){
                    createTblStdAttd(obj_stdRegCrs.data, week);
                });
            }
        });
    });
}


function chkAttd(indexs, weekId, atdId){
    let d = JSON.parse($("#dataStdList").val());
    let data = d[indexs];

    if( $('#chkbox-'+indexs).prop("checked") ){
        $('#chkbox-'+indexs).prop("checked", false);
        postStatus(weekId, data.std_id);
    }
    else{
        $('#chkbox-'+indexs).prop("checked", true);
        delStdAttd(atdId, weekId);
    }
}
//-------------------------------------------------- end attendance status --------------------------------------------------//


//-------------------------------------------------- create table Attendace --------------------------------------------------//
function createTblStdAttd(data, weekId){
    var columns = [
        { "name": "bil", "title": "No.", "breakpoints": "md sm xs"  },
        { "name": "student_id", "title": "Student Id" },
        { "name": "std_name", "title": "Name" },
        { "name": "pgm_code", "title": "Programme", "breakpoints": "md sm xs" },
        { "name": "std_attend", "title": "Attend" },
    ];

    let bil = 1;
    var list = [];
    let convertList = JSON.stringify(data);
    $("#dataStdList").val(convertList);

    $.each(data, function (j, itemJ){
        let return_attd = function (){
            var form = new FormData();
            form.append("fk_week", weekId);
            form.append("std_studentid", itemJ.std_id);

            let tmp = {};
            $.ajax({
                "url": host+"api_timetbl_picoms/public/misAtdAttendance/findId",
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
                    tmp.atdId = getdata.data.atd_id;
                    $.each(getdata.data, function(i, item){
                        tmp.atdId = item.atd_id;
                    });
                }
            });
            return tmp;
        }();

        let chk = '';
        if(return_attd.total == 1){ chk = 'checked' }

        list.push({
            bil: bil++, student_id: '<span class="text-uppercase">'+itemJ.std_id+'</span>', std_name: '<span class="text-uppercase">'+itemJ.sti_name+'</span>', pgm_code: '<span class="text-uppercase">'+itemJ.pgmCode+'</span>',
            std_attend: '<label class="ui-switch info m-t-xs m-r"><input type="checkbox" id="chkbox-'+j+'" onclick="chkAttd(\'' +j+ '\',\'' +weekId+ '\',\'' +return_attd.atdId+ '\')" '+chk+'><i></i></label>'
        });
    });

    $("#tblStudent").html('');
    $("#tblStudent").footable({
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
}
//-------------------------------------------------- end create table Attendace --------------------------------------------------//

function stdData(fk_tmtDet,fk_week,title){

    // capaianLecturer = load_capaian();
    load_capaian();
    capaianLecturer = window.capaianData;
    // console.log(capaianLecturer);
    let uptLecturer = capaianLecturer[1];

    if (uptLecturer == 0){
        LecturerUpdateDisabled = 'disabled';
    }
    else{
        LecturerUpdateDisabled = ''; 
    }


    $("#tmtDet").val(fk_tmtDet);
    $("#fk_week").val(fk_week);

    let fk_course = $('#fk_course').val();
    let fk_acaCal = $('#fk_acaCal').val();
    let token = window.sessionStorage.token;

    var columns = [
        { "name": "bil", "title": "No.", "breakpoints": "md sm xs"  },
        { "name": "student_id", "title": "Student Id" },
        { "name": "std_name", "title": "Name", "breakpoints": "md sm xs"  },
        { "name": "pgm_code", "title": "Programme", "breakpoints": "md sm xs" },
        { "name": "statusrecord", "title": "Status/Remark" },
        { "name": "btn_action", "title": "Action" },
    ];

    $("#tblStudent").html('');
    $(".title_week").html(title);

    let sum_attend = 0;
    let sum_notAttend = 0;
    let sum_notRecorded = 0;

    let form = new FormData();
    form.append('crs_code',fk_course);
    form.append('fk_week',fk_week);
    form.append('aca_session',fk_acaCal);

    $("#loading_modal").modal('show');
    
    let obj = new post(host+'api_pengurusan_pelajar/public/misStdRegsub/listAttendance/week',form,'picoms '+token).execute();
    if(obj.success){
        let bil = 1;
        var list = [];
    
        $.each(obj.data, function (j, itemJ){
            let attend = '<label class="label danger">Absent</label>';
            let remark = "";
            let atd_id = itemJ.atd_id;

            if(itemJ.atd_id == null){
                atd_id = "";
            }

            if(itemJ.remark != null){
                remark = itemJ.remark;
            }

            if(itemJ.status_attend == "Attend"){
                attend = '<label class="label success">Attend</label>';
                sum_attend++;
            }
            else if(itemJ.status_attend == "Excuse"){
                // attend = '<label class="label warning">'+itemJ.status_attend +'</label>';
                attend = '<label class="label warning">Excused</label>';
                sum_attend++;
            }

            else if(itemJ.status_attend == null){
                attend = '<label class="label info">Not Recorded</label>';
                // attend = '<label class="label ">Not Recorded</label>';
                // sum_attend++;
                sum_notRecorded++;

            }

            else{
                sum_notAttend++;
            }
            stdName = itemJ.sti_name;
            stdName1 = stdName.replace(/'/g, '');

            list.push({
                bil: bil++, student_id: '<span class="text-uppercase">'+itemJ.std_studentid+'</span>',
                std_name: '<span class="text-uppercase">'+itemJ.sti_name+'</span>',
                pgm_code: '<span class="text-uppercase">'+itemJ.pgm_id+'</span>',
                statusrecord: attend + '<br><i>' + remark + '</i>',
                btn_action: `<button item_index="`+j+`" `+LecturerUpdateDisabled+` onclick="modal_attend('`+itemJ.std_studentid+`','`+stdName1+`','`+itemJ.pgm_id+`','`+atd_id+`','`+itemJ.status_attend+`')" class="btn btn-icon rounded atd_edit"><i class="fa fa-inbox"></i></button>`
            });
        });

        let percent = (sum_attend / list.length) * 100;
        $("#percent").html(percent.toFixed(0)+'%');
    
        $("#tblStudent").footable({
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

        let buttons = document.querySelectorAll(".atd_edit"); // quaryselectorall will return and nodelist of button with classname
            buttons.forEach((btn, index) => {// index will be current button index
            btn.addEventListener("click", function(e) {
                let data = obj.data[index];
                $(".std_studentid").html(data.std_studentid);
                $("#atd_id").val(data.atd_id);
                if(data.status_attend != null){
                    $("#status_attend").val(data.status_attend);
                    $("#remark").val(data.remark);
                }
                else{
                    $("#remark").val('');
                    $("#status_attend").val("Absent");
                }
                $(".sti_name").html(data.sti_name);
                $(".pgm_id").html(data.pgm_id + ' - ' + $("#tmt_course").html());
                $("#modal_attend").modal('show');                
            });
        })

        let dom = document.getElementById('statAttd');
        let myChart = echarts.init(dom);
            var option = {
                tooltip : {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                  },
                  legend: {
                      orient : 'vertical',
                      x : 'left',
                      data:['Attend and Excused','Absent', 'Not Recorded']
                  },
                  calculable : true,
                  series : [
                      {
                          name:'Source',
                          type:'pie',
                          radius : ['50%', '70%'],
                          data:[
                              {value:sum_attend, name:'Attend and Excused'},
                              {value:sum_notAttend, name:'Absent'},
                              {value:sum_notRecorded, name:'Not Recorded'},
                          ]
                          
                      }
                  ],
                  color: [
                    '#22b66e', // success colour   
                    '#ef193c', // danger
                    '#2196f3', //info colour
                    
                  ],
                  
              };
            myChart.setOption(option);

        $("#loading_modal").modal('hide');
    }
    else{
        $("#loading_modal").modal('hide');
        swal("error","api not found data",'error');
    }    
    
}

$("#form_attend").on('submit',function(e){
    let title = $("#titleStd").html();
    if(!confirmed){
        e.preventDefault();
        swal({
            title: title+" Attendance",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Attend",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let atd_id = $("#atd_id").val();
            let fk_tmtDet = $("#tmtDet").val();
            let pk_id = $("#fk_week").val();
            let studentid = $(".std_studentid").html();
            let status_attend = $("#status_attend").val();
            let remark = $("#remark").val();
            title = $("#titleStd").html();
            let form = new FormData();

            let urlApi = 'register';
            let statusrecord = 'ADD';

            if(atd_id != ""){
                urlApi = 'update';
                statusrecord = 'EDT';
                form.append('atd_id',atd_id);
            }
            form.append('fk_tmtDet',fk_tmtDet);
            form.append('fk_week',pk_id);
            form.append('std_studentid',studentid);
            form.append('status_attend',status_attend);
            form.append('remark',remark);
            form.append('recordstatus',statusrecord);
            let obj = new post(host + "api_timetbl_picoms/public/misAtdAttendance/"+urlApi,form,'picoms ' + window.sessionStorage.token).execute();
            if(obj.success){
                swal("attend",studentid,'success');
                setTimeout(() => {
                    $("#modal_attend").modal("hide");                    
                    stdData(fk_tmtDet,pk_id,title);
                }, 2000);
            }
            else{
                $("#modal_save").modal("hide");
                swal("attend failed!",studentid,'error');
            }            
        });
    }
});

function modal_attend(std_studentid,sti_name,pgm_id,atd_id,status_attend){
    $(".std_studentid").html(std_studentid);
    $("#atd_id").val(atd_id);
    if(status_attend != "null"){
        $("#status_attend").val(status_attend);
    }
    else{
        $("#status_attend").val("Absent");
    }
    $(".sti_name").html(sti_name);
    $(".pgm_id").html(pgm_id + ' - ' + $("#tmt_course").html());
    $("#modal_attend").modal('show');
}

function detailTmt(id, returnValue){
    var settings = {
        "url": host+"api_timetbl_picoms/public/misTimetblDet/show/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };
    
    $.ajax(settings).done(function (response){
        obj_tmtDet = response;
        returnValue();
    });
}

function weekList(id, returnValue){
    var settings = {
        "url": host+"api_timetbl_picoms/public/misAtdWeek/list/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };
    
    $.ajax(settings).done(function (response){
        obj_atdWeek = response;
        returnValue();
    });
}