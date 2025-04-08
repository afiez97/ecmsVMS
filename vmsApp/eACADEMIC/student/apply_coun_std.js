$(function(){
    $.ajaxSetup ({
        cache: false
    });
    $.fn.select2.defaults.set( "theme", "bootstrap" );

    let studId = window.sessionStorage.std_studentid;
    $('#studentId').val(studId);

    // select Campus List
    campusList(function(){
        $('#clg_id').append('<option value="">- Choose -</option>');
        $('#upt_clg_id').append('<option value="">- Choose -</option>');
        $.each(obj_college.data, function (i, item){
            $('#clg_id').append('<option value="'+item.pk_id+'">'+item.clg_name+'</option>');
            $('#upt_clg_id').append('<option value="'+item.pk_id+'">'+item.clg_name+'</option>');
        });
    });

    // Counseling List
    listCounseling(studId, function(){
        var colums = [
            { "name": "bil", "title": "No." },
            { "name": "clg_id", "title": "Campus" },
            { "name": "counselling_kaunselor", "title": "Counselor" },
            { "name": "coun_datetime", "title": "Date/Time", "breakpoints": "md sm xs" },
            { "name": "counselling_reason", "title": "Reason", "breakpoints": "md sm xs" },
            { "name": "remark", "title": "Remark", "breakpoints": "md sm xs" },
            { "name": "counselling_status", "title": "Status", "breakpoints": "md sm xs" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];

        let bil = 1;
        let convertList = JSON.stringify(obj_counseling.data);
        $("#dataList").val(convertList);
        var list = [];

        $.each(obj_counseling.data, function (i, field){
            let coun_date = field.counselling_date;
            let caunStts = field.counselling_status;
            let requester = field.requester;
            let viewStts = ''; let viewBtn = '';


            console.log(obj_counseling);
            var today = new Date(coun_date);
            var dd = today.getDate();
            var mm = today.getMonth()+1; 
            var yyyy = today.getFullYear();
            if( dd < 10 ){ dd='0'+dd; }
            if( mm < 10 ){ mm='0'+mm; }
            today = dd+'-'+mm+'-'+yyyy;

            if( !(field.FK_type_caun_det == '' || field.FK_type_caun_det == null) ){ field.FK_type_caun_det = field.FK_type_caun_det }
            else{ field.det_FK_type = '' }
            
            if( !(field.remark_coun == '' || field.remark_coun == null) ){ field.remark_coun = field.remark_coun }
            else{ field.remark_coun = '' }

            

            if( caunStts == 'New' ){
                viewStts = '<span class="label warning">'+caunStts+'</span>';
                if(requester == 'Student'){
                    viewBtn = '<button class="btn btn-icon success" title="Update" onclick="loadData(\'' + i + '\')"><i class="ion-android-create"></i></button> ' +
                                '<button class="btn btn-icon danger" title="Delete" onclick="delData(\''+field.counselling_id+'\')"><i class="ion-trash-a"></i>'
                }
                else{ viewBtn = '<button class="btn btn-icon accent" title="View" onclick="viewData(\'' + i + '\')"><i class="ion-eye"></i></button>' }
            }
            else if( caunStts == 'Accept' ){
                viewStts = '<span class="label success">'+caunStts+'</span>';
                viewBtn = '<button class="btn btn-icon accent" title="View" onclick="viewData(\'' + i + '\')"><i class="ion-eye"></i></button>'
            }
            else if( caunStts == 'Reject' ){
                viewStts = '<span class="label danger">'+caunStts+'</span>';
                viewBtn = '<button class="btn btn-icon accent" title="View" onclick="viewData(\'' + i + '\')"><i class="ion-eye"></i></button>'
            }
            else if( caunStts == 'Complete' ){
                viewStts = '<span class="label info">'+caunStts+'</span>';
                viewBtn = '<button class="btn btn-icon accent" title="View" onclick="viewData(\'' + i + '\')"><i class="ion-eye"></i></button>'
            }

            list.push({
                bil: bil++, 
                clg_id: '<span class="text-uppercase">'+field.clg_name+'</span>',
                coun_datetime: formatDate(field.counselling_date)+' ( '+field.timeSlot+' )', 
                counselling_kaunselor: '<span class="text-uppercase">'+field.emp_name+'</span>', 
                counselling_reason: '<span class="text-uppercase">'+field.FK_type_caun_det+'</span>', 
                remark: field.remark_coun, 
                counselling_status: viewStts, upt_btn: viewBtn
            });
        });

        $("#counselingList").html('');
        $("#counselingList").footable({
            "columns": colums,
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




    listingTypecaun (function(){
        console.log(obj_type_caun);
        $('#counselling_reason_student').append('<option value="">- Choose -</option>');
        $('#upt_counselling_reason_student').append('<option value="">- Choose -</option>');
        $.each(obj_type_caun.data, function (i, item){
            $('#counselling_reason_student').append('<option value="'+item.pk_id+'">'+item.description+'</option>');
            $('#upt_counselling_reason_student').append('<option value="'+item.pk_id+'">'+item.description+'</option>');
        });
    });
});
var confirmed = false;


//-------------------------------------------------- function change --------------------------------------------------//
// Campus
$('#clg_id').change(function(){
    let clgId = $('#clg_id').val();
    // select kaunselor
    listKaunByCam(clgId, function(){
        $('#counselling_kaunselor').html('');
        $('#counselling_kaunselor').append('<option value="">- Choose -</>');
        $.each(obj_kaun.data, function(i, item){
            $('#counselling_kaunselor').append('<option value="'+item.pk_id+'">'+item.emp_name.toUpperCase()+'</>');
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:'
        });
    });
});

// update Campus
$('#upt_clg_id').change(function(){
    let clgId = $('#upt_clg_id').val();
    // select kaunselor
    listKaunByCam(clgId, function(){
        $('#upt_counselling_kaunselor').html('');
        $('#upt_counselling_kaunselor').append('<option value="">- Choose -</>');
        $.each(obj_kaun.data, function(i, item){
            $('#upt_counselling_kaunselor').append('<option value="'+item.pk_id+'">'+item.emp_name.toUpperCase()+'</>');
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:'
        });
    });
});

// Kaunselor
$('#counselling_kaunselor').change(function(){
    $('#counselling_date').val('');
    $('#coun_timeslot').html('');
});

// Kaunselor update
$('#upt_counselling_kaunselor').change(function(){
    $('#upt_counselling_date').val('');
    $('#upt_coun_timeslot').html('');
});

// Date
$('#counselling_date').change(function(){
    let id = $('#counselling_kaunselor').val();
    let value = $(this).val();
    let dateVal = new Date(value);
    let weekday = dateVal.getDay();
    let options = { weekday: 'long'};
    let day = new Intl.DateTimeFormat('en-US', options).format(dateVal);

    if(!(id == '' || id == null)){
        // select timeslot
        $('#coun_timeslot').html('');
        timeByKaunDay(id, day, function(){
            $('#coun_timeslot').append('<option value="">- Choose -</span>')
            $.each(obj_time.data, function(i, item){
                let time_id = item.id_timetable;
                getAppKaun(time_id, function(){
                    let count = obj_coun.data.length;
                    if( count != 1 ){ $('#coun_timeslot').append('<option value="'+item.id_timetable+'">'+item.coun_timeslot+'</span>') }
                });
            });
        });
    }
    else{ $('#counselling_date').val(''); alert('Choose Counselor') }
});

// Date update
$('#upt_counselling_date').change(function(){
    let id = $('#upt_counselling_kaunselor').val();
    let value = $(this).val();
    let dateVal = new Date(value);
    let weekday = dateVal.getDay();
    let options = { weekday: 'long'};
    let day = new Intl.DateTimeFormat('en-US', options).format(dateVal);

    if(!(id == '' || id == null)){
        // select timeslot
        $('#upt_coun_timeslot').html('');
        timeByKaunDay(id, day, function(){
            $('#upt_coun_timeslot').append('<option value="">- Choose -</span>')
            $.each(obj_time.data, function(i, item){
                let time_id = item.id_timetable;
                getAppKaun(time_id, function(){
                    let count = obj_coun.data.length;
                    if( count != 1 ){ $('#upt_coun_timeslot').append('<option value="'+item.id_timetable+'">'+item.coun_timeslot+'</span>') }
                });
            });
        });
    }
    else{ $('#upt_counselling_date').val(''); alert('Choose Counselor') }
});
//-------------------------------------------------- end function change --------------------------------------------------//


//-------------------------------------------------- add Counseling --------------------------------------------------//
$('#formApplyCoun').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Counseling",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let clg_id = $('#clg_id').val();
            let stud_id = $('#studentId').val();
            let counselling_kaunselor = $('#counselling_kaunselor').val();
            let counselling_date = $('#counselling_date').val();
            let coun_timeslot = $('#coun_timeslot').val();
            let counselling_reason = $('#counselling_reason_student').val();
            let remark_coun_student = $('#remark_coun_student').val();
            
            var form = new FormData();
            form.append("clg_id", clg_id);
            form.append("stud_id", stud_id);
            form.append("requester", "Student");
            form.append("counselling_kaunselor", counselling_kaunselor);
            form.append("counselling_date", counselling_date);
            form.append("coun_timeslot", coun_timeslot);
            form.append("counselling_reason", counselling_reason);
            form.append("remark_coun", remark_coun_student);
            form.append("counseling_type", 'Individual');
            form.append("counselling_status", "New");
            form.append("recordstatus",'ADD');

            var settings = {
                "url": host+"api_hep/public/hepCounselling/stdRegister",
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
//-------------------------------------------------- end add Counseling --------------------------------------------------//


//-------------------------------------------------- load data --------------------------------------------------//
function loadData(index){
    let data = JSON.parse($("#dataList").val());
    let clgId = data[index].camId;
    let counDate = data[index].counselling_date;
    let counKaun = data[index].counselling_kaunselor;
    let fk_time = data[index].fk_timeslot;
    
    
    $('#pk_id').val(data[index].counselling_id);
    $('#upt_clg_id').val(clgId);
    $('#upt_counselling_date').val(counDate);
    $('#upt_counselling_reason_student').val(data[index].counselling_reason).trigger('change');
    $('#upt_remark_coun_student').val(data[index].remark_coun);

    // select kaunselor
    listKaunByCam(clgId, function(){
        $('#upt_counselling_kaunselor').html('');
        $('#upt_counselling_kaunselor').append('<option value="">- Choose -</>');
        $.each(obj_kaun.data, function(i, item){
            $('#upt_counselling_kaunselor').append('<option value="'+item.pk_id+'">'+item.emp_name.toUpperCase()+'</>');
        });
        $('#upt_counselling_kaunselor').val(counKaun);

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:'
        });
    });

    // select time
    let dateVal = new Date(counDate);
    let weekday = dateVal.getDay();
    let options = { weekday: 'long'};
    let day = new Intl.DateTimeFormat('en-US', options).format(dateVal);

    if(!(counKaun == '' || counKaun == null)){
        $('#upt_coun_timeslot').html('');
        timeByKaunDay(counKaun, day, function(){
            $('#upt_coun_timeslot').append('<option value="">- Choose -</span>')
            $.each(obj_time.data, function(i, item){
                let time_id = item.id_timetable;
                getAppKaun(time_id, function(){
                    let count = obj_coun.data.length;
                    let selected = '';
                    if( count != 1 ){
                        if( fk_time == time_id ){ selected = 'selected' }
                        else{ selected = '' }
                        $('#upt_coun_timeslot').append('<option value="'+time_id+'" '+selected+'>'+item.coun_timeslot+'</span>')
                    }
                });
            });
        });
    }
    else{ $('#counselling_date').val(''); alert('Choose Counselor') }

    $('#modalUpdate').modal('show');
}
//-------------------------------------------------- end load data --------------------------------------------------//


//-------------------------------------------------- view data --------------------------------------------------//
function viewData(index){
    let data = JSON.parse($("#dataList").val());
    data = data[index];
    let reqUsr = data.staff_id;
    let reqType = data.requester;
    let counStts = data.counselling_status;
    let coun_date = data.counselling_date;
    let coun_type = data.counseling_type;

    if(reqType == 'Staf'){
        empShow(reqUsr, function(){
            let dtUser = obj_emp.data;
            $('#view_requester').html(dtUser.emp_name);
        });
    }
    else{ $('#view_requester').html('-') }

    if( !(coun_type == '' || coun_type == null) ){ $('#view_type').html(coun_type); }
    else{ $('#view_type').html('-'); }

    let label = '';
    if( counStts == 'New' ){ label = '<span class="label warning text-uppercase">'+counStts+'</span>'; }
    else if( counStts == 'Accept' ){ label = '<span class="label success text-uppercase">'+counStts+'</span>'; }
    else if( counStts == 'Reject' ){ label = '<span class="label danger text-uppercase">'+counStts+'</span>'; }
    else if( counStts == 'Complete' ){ label = '<span class="label info text-uppercase">'+counStts+'</span>'; }
    
    $('#view_clg_id').html(data.clg_name);
    $('#view_counselling_reason').html(data.counselling_reason);
    $('#view_stud_id').html(data.stud_id);
    $('#view_stud_name').html(data.sti_name);
    
    $('#view_status').html(label);
    $('#view_counselor').html(data.emp_name);
    $('#view_date').html(formatDate(coun_date));
    $('#view_time').html(data.timeSlot);

    $('#modalView').modal('show');
}
//-------------------------------------------------- view data --------------------------------------------------//


//-------------------------------------------------- update Counseling --------------------------------------------------//
$('#formUptCounseling').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Counseling",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let counselling_id = $('#pk_id').val();
            let clg_id = $('#upt_clg_id').val();
            let counselling_reason = $('#upt_counselling_reason_student').val();
            let counselling_kaunselor = $('#upt_counselling_kaunselor').val();
            let counselling_date = $('#upt_counselling_date').val();
            let coun_timeslot = $('#upt_coun_timeslot').val();
            let remark_coun = $('#upt_remark_coun_student').val();

            var form = new FormData();
            form.append("counselling_id", counselling_id);
            form.append("clg_id", clg_id);
            form.append("counselling_reason", counselling_reason);
            form.append("counselling_kaunselor", counselling_kaunselor);
            form.append("counselling_date", counselling_date);
            form.append("coun_timeslot", coun_timeslot);
            form.append("remark_coun", remark_coun);
            form.append("recordstatus",'EDT');

            var settings = {
                "url": host+"api_hep/public/hepCounselling/uptStd",
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
//-------------------------------------------------- end update Counseling --------------------------------------------------//


//-------------------------------------------------- delete Counseling --------------------------------------------------//
function delData(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("counselling_id", id);

    swal({
        title: "Remove Counseling",
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
            "url": host+"api_hep/public/hepCounselling/delete",
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
//-------------------------------------------------- end delete Counseling --------------------------------------------------//


function listCounseling(id, returnValue){
    var settings = {
        "url": host+"api_hep/public/hepCounselling/listByStd/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_counseling = response;
        returnValue();
    });
}

function slctGender(returnValue){
    var settings = {
        "url": host+"api_public_access/public/genderList",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_gender = response;
        returnValue();
    });
}

function slctRace(returnValue){
    var settings = {
        "url": host+"api_public_access/public/raceList",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_race = response;
        returnValue();
    });
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

function listKaunByCam(id, returnValue){
    var settings = {
        "url": host+"api_hep/public/hepcaunkaunselor/listByCam/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
       obj_kaun = response;
       returnValue();
    });
}

function timeByKaunDay(id, day, returnValue){
    var form = new FormData();
    form.append("fk_kaunselor", id);
    form.append("counseling_day", day);

    var settings = {
        "url": host+"api_hep/public/hepcauntimetable/listByKaunDay",
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
       obj_time = JSON.parse(response);
       returnValue();
    });
}

function getAppKaun(id, returnValue){
    var settings = {
        "url": host+"api_hep/public/hepCounselling/findByTime/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_coun = response;
        returnValue();
    });
}

function empShow(id, returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/hrmEmpInfo/show/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_emp = response;
        returnValue();
    });
}

//-------------------------------------------------- list all typekaunseling ----------------------by afiez 23ogos------------------------//
function listingTypecaun(returnValue){
    var settings = {
        "url": host+"api_hep/public/hepCaunType/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_type_caun = response;
        returnValue();
    });
}
//-------------------------------------------------- end list all type kaunseling --------------------------------------------------//
