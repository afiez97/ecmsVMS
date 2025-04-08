// const { default: Swal } = require("sweetalert2");

var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
let lectId = getUrlVars()['id'];

$(function(){
    $.ajaxSetup ({
        cache: false
    });

    //---------- display detail lecturer ----------//
    var form = new FormData();
    form.append("emp_id", lectId);

    var settings = {
        "url": host+"api_tetapan_picoms/public/employee",
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
    };

    $.ajax(settings).done(function (response) {
        let result = JSON.parse(response);
        let data = result.data;
        // console.log(result)

        $('#emp_photo').attr("src", 'data:image/jpg;base64,'+data.emp_photo);
        $('#emp_name').html(data.emp_name);
        $('#emp_id').html(data.emp_id);
        $('#fac_name').html(data.fac_name);
        $('#emp_mobileno').html(data.emp_mobileno);
        $('#emp_email').html(data.emp_email);
        $('#emp_status').html(data.emp_status);
        $('#emp_substatus').html(data.emp_substatus);
        $('#emp_icno').html(data.emp_icno);
        $('#emp_gender').html(data.emp_gender);
        $('#emp_race').html(data.emp_race);
        $('#emp_religion').html(data.emp_religion);
        $('#emp_issuedate').html(data.emp_issuedate);
        $('#emp_issueexp').html(data.emp_issueexp);
    });

    $('.divBox').addClass(window.sessionStorage.divBox);
    $('#'+window.sessionStorage.contents).removeClass('collapse');

    window.sessionStorage.removeItem('divBox');
    window.sessionStorage.removeItem('contents');
    //---------- end display detail lecturer ----------//


    //---------- display lecturer course list ----------//
    var form = new FormData();
    var settings = {
        "url": host+"api_lecturer_picoms/public/lectCrsList/"+lectId,
        "method": "GET",
        "timeout": 0
    };

    $.ajax(settings).done(function (response) {
        let bil = 1;
        let list_data = [];
        let columns = [
            { "name": "bil", "title": "No." },
            { "name": "fac_id", "title": "Faculty" },
            { "name": "pgm_id", "title": "Programme" },
            { "name": "crs_code", "title": "Course" },
            { "name": "cur_year", "title": "Session" },
            { "name": "cur_semester", "title": "Semester" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" }
        ];
        // let result = JSON.parse(response);
        
        $.each(response.data, function(i, field){
            list_data.push({
                "bil": bil++, "fac_id": field.fac_name, "pgm_id": field.pgm_name, 
                "crs_code": field.crs_name, "cur_year": field.cur_year, 
                "cur_semester": field.cur_semester,
                "upt_btn": '<button class="btn accent" title="Details" onclick="detail(\'' + field.pk_id + '\')" id="btnPerincian"><i class="ion-ios-list-outline"></i></button>'
            });
        });
        $('#crList').html('');
        $('#crList').footable({
            "columns": columns,
            "rows": list_data,
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
    //---------- end display lecturer course list ----------//


    //---------- display detail teaching time ----------//
    var form = new FormData();
    form.append("emp_id", lectId);

    var settings = {
        "url": host+"api_lecturer_picoms/public/misLectTeachTime/show",
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
    };

    $.ajax(settings).done(function (response) {
        let result = JSON.parse(response);
        // console.log(result)
        if(result.success){
            let data = result.data;
            // console.log(data);
            $('#empId_Teach').val(data.emp_id);
            $('#tme_min').val(data.tme_min);
            $('#tme_max').val(data.tme_max);
    
            if(data.tme_mon == 'Y'){
                $('#tme_mon').prop('checked',true);
            }
            else{ $('#tme_mon').prop('checked',false); }
    
            if(data.tme_tue == 'Y'){
                $('#tme_tue').prop('checked',true);
            }
            else{ $('#tme_tue').prop('checked',false); }
    
            if(data.tme_wed == 'Y'){
                $('#tme_wed').prop('checked',true);
            }
            else{ $('#tme_wed').prop('checked',false); }
    
            if(data.tme_thu == 'Y'){
                $('#tme_thu').prop('checked',true);
            }
            else{ $('#tme_thu').prop('checked',false); }
    
            if(data.tme_fri == 'Y'){
                $('#tme_fri').prop('checked',true);
            }
            else{ $('#tme_fri').prop('checked',false); }
        }
        else{
            $("#empId_Teach").val('');
        }
        
    });
    //---------- end display detail teaching time ----------//


    $('#lect_id').html(lectId);


    $('#btnBack').click(function(){
        location.href = 'adminPage.html';
    });

    $('#btnLectCourseSett').click(function(){
        $('.divBox').addClass('collapse');
        $('#boxSetting').removeClass('collapse');
        $('#navLectData').removeClass('active');
        window.sessionStorage.divBox = 'collapse';
        window.sessionStorage.contents = 'boxSetting';
    });

    $('#btnTeachSett').click(function(){
        $('.divBox').addClass('collapse');
        $('#boxTeachingSett').removeClass('collapse');
        $('#navLectData').removeClass('active');
        window.sessionStorage.divBox = 'collapse';
        window.sessionStorage.contents = 'boxTeachingSett';
    });

    // $('#btnCanRepClass').click(function(){
    //     $('.divBox').addClass('collapse');
    //     $('#boxSetting').removeClass('collapse');
    //      $('#navLectData').removeClass('active');
    // });

    $('#btnPrintTimetbl').click(function(){
        $('.divBox').addClass('collapse');
        $('#boxTimetable').removeClass('collapse');
        $('#navLectData').removeClass('active');
        window.sessionStorage.divBox = 'collapse';
        window.sessionStorage.contents = 'boxTimetable';
    });

    // $('#btnExamMarkSett').click(function(){
    //     $('.divBox').addClass('collapse');
    //     $('#boxSetting').removeClass('collapse');
        // $('#navLectData').removeClass('active');
    // });

    $('#btnAddNewRecord').click(function(){
        $('#add_empId').val(lectId);
    });


    // Dropdown Session List
    sessionList(function(){
        $.each(obj_session.data, function (i, item) {
            $('#cur_year').append('<option value="'+item.cur_year+'">'+item.cur_year+'</option>');
            $('#cur_year_timetbl').append('<option value="'+item.cur_year+'">'+item.cur_year+'</option>');
        });
    });
});

function sessionList(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/curyear/selectCurYear",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        // LIST OPTION UPDATE
        obj_session = response;
        returnValue();
    });
}

// Dropdown Fakulti List
var settings = {
    "url": host+"api_tetapan_picoms/public/facultyList",
    "method": "GET",
    "timeout": 0,
};

$.ajax(settings).done(function (response) {
    //LIST OPTION
    $('#fac_id').append($('<option>', { 
        value: "",
        text : "Choose" 
    }));
    $.each(response.data, function (i, item){
        $('#fac_id').append($('<option>', { 
            value: item.fac_id,
            text : item.fac_name 
        }));
    });
    
});

//Dropdown Program List
var settings = {
    "url": host+"api_tetapan_picoms/public/programmeList",
    "method": "GET",
    "timeout": 0,
};

$.ajax(settings).done(function (response) {
    //LIST OPTION
    $('#pgm_id').append($('<option>', { 
        value: "",
        text : "Choose" 
    }));
    $.each(response.data, function (i, item){
        $('#pgm_id').append($('<option>', { 
            value: item.pgm_id,
            text : item.pgm_name 
        }));
    });
    
});// END Dropdown Program List

//Dropdown Course List
var settings = {
    "url": host+"api_tetapan_picoms/public/courseList",
    "method": "GET",
    "timeout": 0,
};

$.ajax(settings).done(function (response) {
    //LIST OPTION
    $('#crs_code').append($('<option>', { 
        value: "",
        text : "Choose" 
    }));
    $.each(response.data, function (i, item){
        $('#crs_code').append($('<option>', { 
            value: item.crs_code,
            text : item.crs_name 
        }));
    });
    
});// END Dropdown Course List

var confirmed = false;
//---------- add new lecturer course ----------//
$("#formAddLectCourse").on('submit',function(e){
    let $this = $(this);

    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Lecturer Course",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let emp_id = $('#formAddLectCourse').find('#add_empId').val();
            let fac_id = $('#fac_id').val();
            let pgm_id = $('#pgm_id').val();
            let crs_code = $('#crs_code').val();
            let cur_semester = $('#cur_semester').val();
            let cur_year = $('#cur_year').val();
            // console.log(emp_id);

            var form = new FormData();
            form.append("emp_id", emp_id);
            form.append("fac_id", fac_id);
            form.append("pgm_id", pgm_id);
            form.append("crs_code", crs_code);
            form.append("cur_semester", cur_semester);
            form.append("cur_year", cur_year);
            form.append("recordstatus", "ADD");

            var settings = {
                "url": host+"api_lecturer_picoms/public/addLectCourse",
                "method": "POST",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form
            };

            $.ajax(settings).done(function (response) {
                // console.log(response);
                let result = JSON.parse(response);
                if(result.success){
                    window.location.reload();
                }
                else{
                    swal("Failed", response.message, "error");
                }
            });
        });
    }
});
//---------- end add new lecturer course ----------//

//---------- update lecturer course ----------//
$("#formUptLectCrs").on('submit',function(e){
    let $this = $(this);

    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Lecturer Course",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let emp_id = $('#formAddLectCourse').find('#add_empId').val();
            let fac_id = $('#fac_id').val();
            let pgm_id = $('#pgm_id').val();
            let crs_code = $('#crs_code').val();
            let cur_semester = $('#cur_semester').val();
            let cur_year = $('#cur_year').val();
            // console.log(emp_id);

            var form = new FormData();
            form.append("emp_id", emp_id);
            form.append("fac_id", fac_id);
            form.append("pgm_id", pgm_id);
            form.append("crs_code", crs_code);
            form.append("cur_semester", cur_semester);
            form.append("cur_year", cur_year);
            form.append("recordstatus", "ADD");

            var settings = {
                "url": host+"api_lecturer_picoms/public/addLectCourse",
                "method": "POST",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form
            };

            $.ajax(settings).done(function (response) {
                // console.log(response);
                let result = JSON.parse(response);
                if(result.success){
                    window.location.reload();
                }
                else{
                    swal("Failed", response.message, "error");
                }
            });
        });
    }
});
//---------- end update lecturer course ----------//

function detail(pk_id){
    // alert(index);
    window.location.replace("detLectCourse.html?id="+lectId+"&crs_id="+pk_id);
    // $('#lect_id').html(empId);
}

//-------------------------------------------------- btn save lecturer teaching time --------------------------------------------------//
$('#formTeachTime').on('submit', function(e){
    let $this = $(this);

    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Save Teaching Time",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let empId = $('#empId_Teach').val();
            let recordstatus = '';
            let type = '';

            if(empId == ''){
                empId = lectId;
                recordstatus = 'ADD';
                type = 'register';
            }
            else{
                empId = $('#empId_Teach').val();
                recordstatus = 'EDT';
                type = 'update';
            }
            
            let tme_min = $('#tme_min').val();
            let tme_max = $('#tme_max').val();
            let tme_mon = null;
            if($('#tme_mon').prop('checked')){
                tme_mon = 'Y';
            }
            else{ tme_mon = 'N'; }

            let tme_tue = null;
            if($('#tme_tue').prop('checked')){
                tme_tue = 'Y';
            }
            else{ tme_tue = 'N'; }

            let tme_wed = null;
            if($('#tme_wed').prop('checked')){
                tme_wed = 'Y';
            }
            else{ tme_wed = 'N'; }

            let tme_thu = null;
            if($('#tme_thu').prop('checked')){
                tme_thu = 'Y';
            }
            else{ tme_thu = 'N'; }

            let tme_fri = null;
            if($('#tme_fri').prop('checked')){
                tme_fri = 'Y';
            }
            else{ tme_fri = 'N'; }

            var form = new FormData();
            form.append("emp_id", empId);
            form.append("tme_min", tme_min);
            form.append("tme_max", tme_max);
            form.append("tme_mon", tme_mon);
            form.append("tme_tue", tme_tue);
            form.append("tme_wed", tme_wed);
            form.append("tme_thu", tme_thu);
            form.append("tme_fri", tme_fri);
            form.append("recordstatus", recordstatus);

            var settings = {
                "url": host+"api_lecturer_picoms/public/misLectTeachTime/"+type,
                "method": "POST",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form
            };

            $.ajax(settings).done(function (response) {
                // console.log(response);
                let result = JSON.parse(response);
                if(result.success){
                    window.location.reload();
                }
                else{ swal("Failed", response.message, "error"); }
            });
        });
    }
});
//-------------------------------------------------- end btn save lecturer teaching time --------------------------------------------------//