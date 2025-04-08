$(function(){
    $.ajaxSetup ({
        cache: false
    });
    $.fn.select2.defaults.set( "theme", "bootstrap" );

    // select Campus List
    campusList(function(){
        $('#clg_id').append('<option value="">- Choose -</option>');
        $('#upt_clg_id').append('<option value="">- Choose -</option>');
        $.each(obj_college.data, function (i, item){
            $('#clg_id').append('<option value="'+item.pk_id+'">'+item.clg_name+'</option>');
            $('#upt_clg_id').append('<option value="'+item.pk_id+'">'+item.clg_name+'</option>');
        });
    });

    // // select staff
    // Listallstaf(function(){
    //     $('#staff_name').append('<option value="">- Choose -</option>');
    //     $('#upt_staff_name').append('<option value="">- Choose -</option>');
    //     $.each(obj_emp.data, function(i, item){
    //         $('#staff_name').append('<option value="'+item.emp_id+'">'+item.emp_name.toUpperCase()+'</option>');
    //         $('#upt_staff_name').append('<option value="'+item.emp_id+'">'+item.emp_name.toUpperCase()+'</option>');
    //     });

    //     $('.slct2').select2({
    //         width: null,
    //         containerCssClass: ':all:',
    //     });
    // });
    // select staf
    stafList(function(){
        $('#staff_name').append('<option value="">- Choose -</option>');
        $('#upt_staff_name').append('<option value="">- Choose -</option>');
        $.each(obj_emp.data, function (i, item){
            $('#staff_name').append('<option value="'+item.emp_id+'">'+item.emp_name+'</option>');
            $('#upt_staff_name').append('<option value="'+item.emp_id+'">'+item.emp_name+'</option>');
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:'
        });
    });
    
    // Discipline List
    listCounselor(function(){
        var colums = [
            { "name": "bil", "title": "No." },
            { "name": "clg_id", "title": "Campus" },
            { "name": "id_kaunselor", "title": "Code" },
            { "name": "staff_name", "title": "Name" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];

        let bil = 1;
        let convertList = JSON.stringify(obj_counselor.data);
        $("#dataList").val(convertList);
        var list = [];

        $.each(obj_counselor.data, function (i, field){
            console.log(field);
            list.push({
                bil: bil++, clg_id: '<span class="text-uppercase">'+field.clg_name+'</span>', id_kaunselor: '<span class="text-uppercase">'+field.id_kaunselor+'</span>', staff_name: '<span class="text-uppercase">'+field.emp_name+'</span>',
                upt_btn: '<button class="btn btn-icon success" title="Update" onclick="loadData(\'' + i + '\')"><i class="ion-android-create"></i></button> ' +
                        // '<button class="btn btn-icon accent" title="Timetable" onclick="createTimetable(\'' +field.kaunselorId + '\')"><i class="ion-ios-grid-view"></i></button> ' +
                        '<button class="btn btn-icon danger" title="Delete" onclick="delData(\''+field.kaunselorId+'\')"><i class="ion-trash-a"></i>'
            });
        });

        $("#kaunselorList").html('');
        $("#kaunselorList").footable({
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
});
var confirmed = false;


//-------------------------------------------------- add Counselor --------------------------------------------------//
$('#formAddCounselor').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Counselor",
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
            let id_kaunselor = $('#id_kaunselor').val();
            let staff_name = $('#staff_name').val();

            var form = new FormData();
            form.append("clg_id", clg_id);
            form.append("id_kaunselor", id_kaunselor);
            form.append("staff_name", staff_name);
            form.append("recordstatus",'ADD');

            var settings = {
                "url": host+"api_hep/public/hepcaunkaunselor/register",
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
//-------------------------------------------------- end add Counselor --------------------------------------------------//


function loadData(index){
    let data = JSON.parse($("#dataList").val());
    $('#pk_id').val(data[index].kaunselorId);
    $('#upt_clg_id').val(data[index].camId);
    $('#upt_id_kaunselor').val(data[index].id_kaunselor);
    $('#upt_staff_name').val(data[index].staff_name).trigger('change');

    $('#updateCounselor').modal('show');
}


//-------------------------------------------------- update Counselor --------------------------------------------------//
$('#formUptCounselor').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Counselor",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let pk_id = $('#pk_id').val();
            let clg_id = $('#upt_clg_id').val();
            let id_kaunselor = $('#upt_id_kaunselor').val();
            let staff_name = $('#upt_staff_name').val();

            var form = new FormData();
            form.append("pk_id", pk_id);
            form.append("clg_id", clg_id);
            form.append("id_kaunselor", id_kaunselor);
            form.append("staff_name", staff_name);
            form.append("recordstatus",'EDT');

            var settings = {
                "url": host+"api_hep/public/hepcaunkaunselor/update",
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
//-------------------------------------------------- end update Counselor --------------------------------------------------//

//-------------------------------------------------- add Timetable --------------------------------------------------//
$('#formAddTimetbl').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Timetable",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let fk_kaunselor = $('#fk_caunselor').val();
            let counseling_day = $('#counseling_day').val();
            let coun_timeslot = $('#coun_timeslot').val();
            var form = new FormData();
            form.append("fk_kaunselor", sessionStorage.idCoun);
            form.append("counseling_day", counseling_day);
            form.append("coun_timeslot", coun_timeslot);
            form.append("recordstatus",'ADD');

            var settings = {
                "url": host+"api_hep/public/hepcauntimetable/register",
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
                sessionStorage.removeItem('idCoun');
                window.location.reload();
            });
        });
    }
});
//-------------------------------------------------- end add Timetable --------------------------------------------------//

// delete Discipline
function delData(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("pk_id", id);

    swal({
        title: "Remove Counselor",
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
            "url": host+"api_hep/public/hepcaunkaunselor/delete",
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


// view Timetable
function getTimetbl(index){
    let dtKaun = JSON.parse($("#dataList").val());
    dtKaun = dtKaun[index];
    let id = dtKaun.kaunselorId;

    listCounTimetbl(id, function(){
        let data = obj_counTimetbl.data;
        $('.boxDay').html('');
        
        $.each(data, function (i, field){
            let day = field.counseling_day;
            let boxBody = '';
    
            if( day == 'Monday' ){ boxBody = 'boxMon' }
            if( day == 'Tuesday' ){ boxBody = 'boxTue' }
            if( day == 'Wednesday' ){ boxBody = 'boxWed' }
            if( day == 'Thursday' ){ boxBody = 'boxThu' }
            if( day == 'Friday' ){ boxBody = 'boxFri' }
    
            $('#'+boxBody).append('<a href="#" class="list-group-item">'+field.coun_timeslot+'</a>');
        });
    });
    $('#divTitle').html(dtKaun.emp_name);
    $('#viewTimetbl').modal('show');
}


// view Timetable
function createTimetable(FKCounselor){
    // let dtKaun = JSON.parse($("#dataList").val());
    // dtKaun = dtKaun[index];
    sessionStorage.idCoun = FKCounselor;

    $('#fk_caunselor').html(FKCounselor);
   
    // $('#divTitle').html(FKCounselor);
    $('#counselling-timetable').modal('show');
}


function listCounselor(returnValue){
    var settings = {
        "url": host+"api_hep/public/hepcaunkaunselor/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_counselor = response;
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