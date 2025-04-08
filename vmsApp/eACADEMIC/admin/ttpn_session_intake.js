$(function(){
    $.ajaxSetup ({
        cache: false
    });

    $.fn.select2.defaults.set( "theme", "bootstrap" );

    selectmonth();
    selectYear();

    listNewIntake(function(){
        // select option
        $('#cur_intake').append('<option value="">- Choose Intake -</option>');
        $.each(obj_intake.data, function (i, item){
            $('#cur_intake').append('<option value="'+item.id+'">'+item.intake_month+'-'+item.intake_year+'</option>');
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:',
        });

        // table list Intake
        createTblIntake(obj_intake.data);
    });

    // calendar list
    kalendarList(function(){
        var colums = [
            { "name": "bil", "title": "No." },
            { "name": "cur_year", "title": "Academic Session" },
            { "name": "cal_cohort", "title": "Semester" },
            { "name": "cal_category", "title": "Academic Calendar", "breakpoints": "md sm xs" },
            { "name": "cal_status", "title": "Status", "breakpoints": "md sm xs" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];

        let bil = 1;
        var list = [];
        let convertList = JSON.stringify(obj_kalendarList.data);
        $("#dataList").val(convertList);

        $.each(obj_kalendarList.data, function (i, field){
            list.push({
                bil: bil++, cal_id: field.cal_id, cur_year: field.cur_year, cal_status: '<span class="text-uppercase">'+field.cal_status+'</span>', cal_cohort: field.cal_cohort, cal_category: '<span class="text-uppercase">'+field.category+'</span>',
                upt_btn: '<button class="btn btn-icon accent" title="Add Intake" onclick="addIntake(\'' +i+ '\')"><i class="ion-ios-list-outline"></i></button>'
            });
        });

        $("#curYearList").footable({
            "columns": colums,
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
});
var confirmed = false;


// btn Back to Campus Page
$('#btnBack').click(function(){
    window.location.replace('campusPage.html');
});


//-------------------------------------------------- function onchange --------------------------------------------------//
// change month
$('#new_intake_month').change(function(){
    let monthVal = $(this).val();
    let yearVal = $('#new_intake_year').val();

    chkNewIntake(monthVal, yearVal, function(){
        let exist = obj_intake.data.length;

        if(exist != 0){
            $('#check').append('Data Already Exist');
            $('#new_intake_month').val('');
            $('#new_intake_year').val('');
        }
        else{ $('#check').html(''); }
    });
});

// change year
$('#new_intake_year').change(function(){
    let yearVal = $(this).val();
    let monthVal = $('#new_intake_month').val();

    chkNewIntake(monthVal, yearVal, function(){
        let exist = obj_intake.data.length;

        if(exist != 0){
            console.log('existing');
            $('#check').append('Data Already Exist');
            $('#new_intake_year').val('');
            $('#new_intake_month').val('');
        }
        else{ $('#check').html(''); }
    });
});

// change intake
$('#cur_intake').change(function(){
    let id_intake = $(this).val();
    let fk_cal = $('#aca_calendar_id').val();

    if(id_intake != ''){
        chkIntake(fk_cal, id_intake, function(){
            let exist = obj_chkIntake.data.length;

            if(exist != 0){
                $('#chkSesInt').html('Data Already Exist');
                $('#cur_intake').val('').trigger('change');
            }
            else{ $('#chkSesInt').html(''); }
        });
    }
});
//-------------------------------------------------- end function onchange --------------------------------------------------//


//-------------------------------------------------- add Academic Session/Intake --------------------------------------------------//
$('#formSesInt').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Academic Session/Intake",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let fk_acaCal = $('#aca_calendar_id').val();
            let cur_intake = $('#cur_intake').val();
    
            var form = new FormData();
            form.append("fk_acaCal", fk_acaCal);
            form.append("cur_intake", cur_intake);
            form.append("recordstatus", 'ADD');
    
            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmCuryear/register",
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
                    sesIntList(fk_acaCal, function(){
                        createTblSesInt(obj_curYear.data);
                        
                    });
                    $('#cur_intake').val('').trigger('change');
                }
            });
        });
    }
});
//-------------------------------------------------- end add Academic Session/Intake --------------------------------------------------//


function selectmonth(){
    $('#new_intake_month').append('<option value="">- Choose Month -</option>');
    for(i=1;i<13;i++){
        date = new Date('2022-'+i+'-01');  // 2009-11-10
        month = date.toLocaleString('default', { month: 'short' });
        $('#new_intake_month').append('<option value="'+month.toUpperCase()+'">'+month.toUpperCase()+'</option>');
    }
}

function selectYear(){
    $("#new_intake_year").append('<option>- Choose Year -</option>');
    date = new Date();  // 2009-11-10
    year = date.getFullYear();
    for(i = (year+5);i>2015;i--){
        select = "";
        if(i == year){
            select = "selected";
        }
        $("#new_intake_year").append('<option '+select+' value="'+i+'" >'+i+'</option>');
    }
}


//-------------------------------------------------- function delete Session/Intake --------------------------------------------------//
function del_rekod(id, fk_acaCal){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("id", id);

    swal({
        title: "Remove Academic Session/Intake",
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
            "url": host+"api_tetapan_picoms/public/curyearDelete",
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
            console.log(response)
            result = JSON.parse(response);
            if (!result.success) {
                Swal(result.message, result.data, "error");
                return;
            }
            else{
                sesIntList(fk_acaCal, function(){
                    createTblSesInt(obj_curYear.data);
                });
                $('#cur_intake').val('').trigger('change');
            }
        });
    });
}
//-------------------------------------------------- function delete Session/Intake --------------------------------------------------//


function addIntake(index){
    let data = JSON.parse($("#dataList").val());
    data = data[index];

    $('#aca_calendar_id').val(data.cal_id);
    $('#aca_year').html(data.cur_year);
    $('#aca_sem').html(data.cal_cohort);
    $('#aca_calendar').html(data.category);
    $('#aca_status').html(data.cal_status);

    sesIntList(data.cal_id, function(){
        createTblSesInt(obj_curYear.data);
    });

    $('#addSessionIntake').modal('show');
}



//-------------------------------------------------- table Session/Intake List --------------------------------------------------//
function createTblSesInt(data){

    // capaianSetting = load_capaian();
    load_capaian();
    capaianSetting = window.capaianData;
    // console.log(capaianSetting);
    let addSetting = capaianSetting[0];
    let uptSetting = capaianSetting[1];
    let delSetting = capaianSetting[2];

    console.log(delSetting);

    if (addSetting == 0){
        SettingAddDisabled = 'disabled';
    }
    else{
        SettingAddDisabled = ''; 
    }

    if (uptSetting == 0){
        SettingUpdateDisabled = 'disabled';
    }
    else{
        SettingUpdateDisabled = ''; 
    }


    if (delSetting == 0){
        SettingDelDisabled = 'disabled';
    }
    else{
        SettingDelDisabled = ''; 
    }

    var columns = [
        { "name": "bil", "title": "No." },
        { "name": "ses_intake", "title": "Intake" },
        { "name": "upt_btn", "title": "Action",'class':"text-center", "breakpoints": "md sm xs" }
    ];
    var list = [];
    let bil = 1;
    let convertDetList = JSON.stringify(data);
    $("#dataSesIntList").val(convertDetList);

    $.each(data, function(i, item){
        list.push({
            bil:bil++, ses_intake: '<span class="text-uppercase">'+item.intake_name+'-'+item.intake_year+'</span>',
            // upt_btn: '<button   disabled title="Remove"   onclick="del_rekod(\''+item.id_curYear+'\',\''+item.fk_acaCal+'\')"><i class="ion-trash-b" style="color: #ef193c"></i></button>',

            upt_btn: '<button type="button" class="btn btn-icon danger" '+SettingDelDisabled+' title="Delete" onclick="del_rekod(\''+item.id_curYear+'\',\''+item.fk_acaCal+'\')"><i class="ion-trash-a"></i></button>'
        });
    });

    $("#tblSesIntake").html('');
    $("#tblSesIntake").footable({
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
//-------------------------------------------------- end table Session/Intake List --------------------------------------------------//


//-------------------------------------------------- add New Intake --------------------------------------------------//
$('#formNewIntake').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Intake",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let intake_name = $('#new_intake_month').val();
            let intake_year = $('#new_intake_year').val();
    
            var form = new FormData();
            form.append("intake_name", intake_name);
            form.append("intake_year", intake_year);
            form.append("recordstatus", 'ADD');
    
            var settings = {
                "url": host+"api_tetapan_picoms/public/intake/register",
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
                if(!result.success) {
                    Swal(result.message, result.data, "error");
                    return;
                }
                else{
                    listNewIntake(function(){
                        createTblIntake(obj_intake.data);
                    });
                    $('#formNewIntake')[0].reset();
                }
            });
        });
    }
});
//-------------------------------------------------- end add New Intake --------------------------------------------------//


//-------------------------------------------------- table New Intake List --------------------------------------------------//
function createTblIntake(data){
    var columns = [
        { "name": "bil", "title": "No." },
        { "name": "month_intake", "title": "Month" },
        { "name": "year_intake", "title": "Year" },
        { "name": "upt_btn", "title": "Action",'class':"text-center", "breakpoints": "md sm xs" }
    ];
    
    var list = [];
    let bil = 1;
    let convertDetList = JSON.stringify(data);
    $("#dataIntakeList").val(convertDetList);

    $.each(data, function(i, item){
        list.push({
            bil:bil++, month_intake: '<span class="text-uppercase">'+item.intake_month+'</span>', year_intake: item.intake_year,
            upt_btn: '<a class="nav-link" title="Remove" onclick="delNewIntake(\''+item.pk_id+'\')"><i class="ion-trash-b" style="color: #ef193c"></i></a>'
        });
    });

    $("#tblIntake").html('');
    $("#tblIntake").footable({
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
//-------------------------------------------------- end table New Intake List --------------------------------------------------//


//-------------------------------------------------- function delete New Intake --------------------------------------------------//
function delNewIntake(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("id", id);

    swal({
        title: "Remove Intake",
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
            "url": host+"api_tetapan_picoms/public/intake/delete",
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
                listNewIntake(function(){
                    createTblIntake(obj_intake.data);
                });
                $('#formNewIntake')[0].reset();
            }
        });
    });
}
//-------------------------------------------------- end function delete New Intake --------------------------------------------------//


function chkIntake(id, intake, returnValue){
    var form = new FormData();
    form.append("fk_acaCal", id);
    form.append("cur_intake", intake);

    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmCuryear/chkIntake",
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
        obj_chkIntake = JSON.parse(response);
        returnValue();
    });
}

function listNewIntake(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/intake/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_intake = response;
        returnValue();
    });
}

function sesIntList(id, returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmCuryear/listByAcaCal/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_curYear = response;
        returnValue();
    });
}

function chkNewIntake(month, year, returnValue){
    var form = new FormData();
    form.append("intake_name", month);
    form.append("intake_year", year);

    var settings = {
        "url": host+"api_tetapan_picoms/public/intake/chkData",
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
        obj_intake = JSON.parse(response);
        returnValue();
    });
}