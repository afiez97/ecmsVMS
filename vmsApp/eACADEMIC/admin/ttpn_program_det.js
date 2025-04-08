$(function(){
    $.ajaxSetup ({
        cache: false
    });

    $.fn.select2.defaults.set( "theme", "bootstrap" );

    let prog_id = window.sessionStorage.prog_id;

    $("#listProgramdet").html('');

    obeTableDisplay();
    // alert(obeTableDisplay);

    dataProgram(prog_id, function(){
        // select faculty
        getFaculty(function(){
            $('#upt_fac_id').append('<option value="">- Choose -</option>');
            $.each(obj_getFaculty.data, function (i, item){
                $('#upt_fac_id').append('<option value="'+item.pk_id+'">'+item.fac_id+'</option>');
            });
            $('#upt_fac_id').val(data.fk_fac);

            $('.slct2').select2({
                width: "100%",
                containerCssClass: ':all:',
            });
        });

        // select level of study
        levelStudy(function(){
            $('#upt_pgm_category').append('<option value="">- Choose -</option>');
            $.each(obj_levelStudy.data, function (i, item) {
                $('#upt_pgm_category').append('<option value="'+item.id+'">'+item.category_name+'</option>');
            });
            $('#upt_pgm_category').val(data.pgm_category);

            $('.slct2').select2({
                width: "100%",
                containerCssClass: ':all:',
            });
        });

        // select academic calendar
        calCatList(function(){
            $('#upt_pgm_area').append('<option value="">- Choose -</option>');
            $.each(obj_acaField.data, function (i, item) {
                $('#upt_pgm_area').append('<option value="'+item.pk_id+'">'+item.category+'</option>');
            });
            $('#upt_pgm_area').val(data.pgm_area);

            $('.slct2').select2({
                width: "100%",
                containerCssClass: ':all:',
            });
        });

        // select mode of study
        modeStudy(function(){
            $('#upt_pgm_mode').append('<option value="">- Choose -</option>');
            $.each(obj_modeStudy.data, function (i, item) {
                $('#upt_pgm_mode').append('<option value="'+item.id+'">'+item.mode_name+'</option>');
            });
            $('#upt_pgm_mode').val(data.pgm_mode);

            $('.slct2').select2({
                width: "100%",
                containerCssClass: ':all:',
            });
        });

        // select mqf level
        mqfLevel(function(){
            $('#upt_pgm_mqflevel').append('<option value="">- Choose -</option>');
            $.each(obj_mqfLevel.data, function (i, item) {
                $('#upt_pgm_mqflevel').append('<option value="'+item.id+'">'+item.mqflevel_name+'</option>');
            });
            $('#upt_pgm_mqflevel').val(data.pgm_mqflevel);

            $('.slct2').select2({
                width: "100%",
                containerCssClass: ':all:',
            });
        });

        // select status
        statusList(function(){
            $('#upt_pgm_status').append('<option value="">- Choose -</option>');
            $.each(obj_status.data, function (i, item) {
                $('#upt_pgm_status').append('<option value="'+item.status_name+'">'+item.status_name+'</option>');
            });
            $('#upt_pgm_status').val(data.pgm_status);
        });

        // select Academic Calendar

        //pgm_area = 29
        calByCategory(data.pgm_area, function(){
            $('#aca_calendar').append('<option value="">- Choose Academic Calendar -</option>');
            $.each(obj_kalendar.data, function (i, item){
                let year = item.cur_year.replace('/','');
                $('#aca_calendar').append('<option value="'+item.cal_id+'" data-calendar="'+item.cur_year+'">'+year+'/'+item.cal_cohort+'</option>');
            });
        });

        $("#pk_id").val(data.pgmId);
        $("#fac_name").html(data.fac_name);
        $("#pgm_categoryt").html(data.category_name);
        $("#pgm_areat").html(data.category);
        $("#pgm_idt").html(data.pgm_id);
        $("#pgm_namet").html(data.pgm_name);
        $("#pgm_modet").html(data.mode_name);
        $("#pgm_mqflevelt").html(data.mqflevel_name);
        $("#pgm_durationt").html(data.pgm_duration);
        $("#pgm_statust").html(data.pgm_status);
        $("#pgm_tcrdpass").html(data.pgm_tcrdpass);
        $("#pgm_fee").html(data.pgm_fee);
        $("#pgm_fee_usd").html(data.pgm_fee_usd);
        $("#pgm_attainment").html(data.pgm_attainment+'%');

        // $("#pgm_tcrdpass").html(data.pgm_tcrdpass);
        $('#topName').html(data.pgm_name);
        
        $('#upt_pgm_id').val(data.pgm_id);
        $('#upt_pgm_name').val(data.pgm_name);
        $('#upt_pgm_duration').val(data.pgm_duration);
        $('#upt_tuition_fee').val(data.pgm_fee);
        $('#upt_tuition_fee_usd').val(data.pgm_fee_usd);
        $('#upt_pgm_tcrdpass').val(data.pgm_tcrdpass);
        $('#upt_pgm_attainment').val(data.pgm_attainment);
        console
    });

    // details list
    detailsList(prog_id, function(){

        // capaianSetting = load_capaian();
        load_capaian();
        capaianSetting = window.capaianData;
        // console.log(capaianSetting);
        // let addSetting = capaianSetting[0];
        let uptSetting = capaianSetting[1];
        let delSetting = capaianSetting[2];

    
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
            { "name": "aca_cal", "title": "Academic Session" },
            { "name": "dtp_intake", "title": "Intake" },
            { "name": "ses_intake", "title": "Session/Intake" },
            { "name": "upt_btn", "title": "Action",'class':"text-center", "breakpoints": "md sm xs" }
        ];
        
        var list = [];
        let bil = 1;
        let convertDetList = JSON.stringify(obj_detList);
        $("#dataDetailList").val(convertDetList);

        $.each(obj_detList, function(i, field){
            let aca_calyear = field.acaCal;
            if( aca_calyear != null ){ aca_calyear = aca_calyear.replace('/','') }
            let acaCal = aca_calyear+ '/' +field.cal_cohort;
            let acaIntake = field.intake_month+ '-' +field.intake_year;

            list.push({
                bil: bil++, dtp_intake: acaIntake, aca_cal: acaCal, ses_intake: field.dtp_year+'<br>'+field.dtp_intake,
                upt_btn:  '  <button class="btn btn-icon success" '+SettingUpdateDisabled+' title="Update" onclick="uptSession(\'' +i+ '\')"><i class="ion-android-create"></i></button> '+
                            '<button class="btn btn-icon danger" '+SettingDelDisabled+' title="Remove" onclick="del_rekod(\''+field.dtp_id+'\')"><i class="ion-trash-b" ></i></button>'
            });
        });

        $("#listProgramdet").footable({
            "columns": columns,
            "rows": list,
            "paging": {
                "enabled": true,
                "size": 3
                // ,
                // "countFormat": "Showing {PF} to {PL} of {TR} data"
            },
            "filtering": {
                "enabled": false,
                "placeholder": "Search...",
                "dropdownTitle": "Search for:"
            }
        });
    })

   
});

var confirmed = false;


// btn Back to Programme List
$('#btnBack').click(function(){
    window.location.replace('ttpn_program.html');
    window.sessionStorage.removeItem('prog_id');
});


//-------------------------------------------------- update programme --------------------------------------------------//
$("#formUptProgramme").on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Programme",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let pk_id = $("#pk_id").val();
            let upt_fac_id = $("#upt_fac_id").val();
            let upt_pgm_category = $("#upt_pgm_category").val();
            let upt_pgm_area = $("#upt_pgm_area").val();
            let upt_pgm_name = $("#upt_pgm_name").val();
            let upt_pgm_mode = $("#upt_pgm_mode").val();
            let upt_pgm_mqflevel = $("#upt_pgm_mqflevel").val();
            let upt_pgm_duration = $("#upt_pgm_duration").val();
            let upt_tuition_fee = $("#upt_tuition_fee").val();
            let upt_tuition_fee_usd = $("#upt_tuition_fee_usd").val();
            let upt_pgm_tcrdpass = $("#upt_pgm_tcrdpass").val();
            let upt_pgm_status = $("#upt_pgm_status").val();

            var form = new FormData();
            form.append("pk_id", pk_id);
            form.append("fac_id", upt_fac_id);
            form.append("pgm_category", upt_pgm_category);
            form.append("pgm_area", upt_pgm_area);
            form.append("pgm_name", upt_pgm_name);
            form.append("pgm_mode", upt_pgm_mode);
            form.append("pgm_mqflevel", upt_pgm_mqflevel);
            form.append("pgm_duration", upt_pgm_duration);
            form.append("pgm_fee", upt_tuition_fee);
            form.append("pgm_fee_usd", upt_tuition_fee_usd);
            form.append("pgm_tcrdpass", upt_pgm_tcrdpass);
            form.append("pgm_status", upt_pgm_status);
            form.append("recordstatus", 'EDT');

            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmProg/update",
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
    
            $.ajax(settings).done(function (response) {
                console.log(response)
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
//-------------------------------------------------- end update programme --------------------------------------------------//


//-------------------------------------------------- delete programme --------------------------------------------------//
$('#btnDelete').click(function (){
    let id = $('#pk_id').val();

    var form = new FormData();
    form.append("pk_id", id);
    form.append("recordstatus", "DEL");

    swal({
        title: "Remove Programme",
        text: "Are You Sure?",
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Remove",
        confirmButtonColor: "#ef193c",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false
    }).then(function () {
        var settings = {
            "url": host+"api_tetapan_picoms/public/misPrmProg/delete",
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
            if (response.success == false) {
                swal(result.message, result.data, "error");
                return;
            }
            window.location.replace('ttpn_program.html');
        });
    });    
});
//-------------------------------------------------- delete programme --------------------------------------------------//


$('#btnNewRecord').click(function(){
    $('#pgmDet_id').val('');
    $('#regDetProgramme')[0].reset();
    $('#divFormSession').show();
});




//-------------------------------------------------- save Programme Session --------------------------------------------------//
$('#regDetProgramme').on('submit', function(e){
    let pk_id = $('#pgmDet_id').val();
    let valTitle = ''; let btn = ''; let btnColor = ''; let apiUrl = '';

    if(pk_id == ''){
        valTitle = 'Add';
        btn = 'Save';
        btnColor = '#2196f3';
        apiUrl = 'register';
    }
    else{
        valTitle = 'Update';
        btn = 'Update';
        btnColor = '#22b66e';
        apiUrl = 'update';
    }

    if(!confirmed){
        e.preventDefault();
        swal({
            title: valTitle+" Programme Session",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: btn,
            confirmButtonColor: btnColor,
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let pgm_id = $('#pk_id').val();
            let fk_aca_calendar = $('#aca_calendar').val();
            let fk_sesIntake = $('#dtp_intake').val();
            let dtp_intake = $("#dtp_intake option:selected").attr("data-intake");
            let dpt_year = $("#aca_calendar option:selected").attr("data-calendar");


            var form = new FormData();
            if( pk_id != '' ){ form.append("dtp_id", pk_id); }
            form.append("pgm_id", pgm_id);
            form.append("fk_aca_calendar", fk_aca_calendar);
            form.append("fk_sesIntake", fk_sesIntake);
            form.append('dtp_intake',dtp_intake);
            form.append('dtp_year',dpt_year);

            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmProgDet/"+apiUrl,
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
//-------------------------------------------------- end save Programme Session --------------------------------------------------//


//-------------------------------------------------- delete session --------------------------------------------------//
function del_rekod(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("dtp_id", id);

    swal({
        title: "Remove Programme Details",
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
            "url": host+"api_tetapan_picoms/public/misPrmProgDet/delete",
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
//-------------------------------------------------- delete session --------------------------------------------------//


//-------------------------------------------------- delete session --------------------------------------------------//
function del_rekod_plo(id){
    var form = new FormData();
    // form.append("recordstatus", 'DEL');
    form.append("obe_plo_id", id);

    swal({
        title: "Remove PLO Details",
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
            "url": host+"api_tetapan_picoms/public/misprmobe/deletePlo",
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
//-------------------------------------------------- delete session --------------------------------------------------//


//-------------------------------------------------- function onchange --------------------------------------------------//
// onchange select Academic Session
$("#aca_calendar").change(function(){
    let currentYear = $("#aca_calendar").val();

    intakeByAcaCal(currentYear, function(){
        $("#dtp_intake").html('');
        $("#dtp_intake").append('<option value="">- Choose Intake -</option>')
        $.each(obj_curYear.data,function(i,field){
            $("#dtp_intake").append('<option value="'+field.curYear_id+'" data-intake="'+field.intake_name+'-'+field.intake_year+'" >'+field.intake_name+'-'+field.intake_year+'</option>');
        });
    });
});


// onchange select Intake
$("#dtp_intake").change(function(){
    let pgmId = $("#pk_id").val();
    let intake = $(this).val();

    var form = new FormData();
    form.append("pgm_id", pgmId);
    form.append("dtp_intake", intake);

    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmProgDet/chkIntake",
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
        let count = result.data.length;

        if(count != 0){
            $('#alertMssg').html('Data Already Exist.');
            $("#dtp_intake").val('');
            return;
        }
        else{ $('#alertMssg').html(''); }
    });    
});
//-------------------------------------------------- end function onchange --------------------------------------------------//



function obeTableDisplay(){

    let prog_id = window.sessionStorage.prog_id;


    $("#obeTable").html('');
// alert();
    obeList(prog_id, function(){

        // capaianSetting = load_capaian();
        load_capaian();
        capaianSetting = window.capaianData;
        // console.log(capaianSetting);
        // let addSetting = capaianSetting[0];
        let uptSetting = capaianSetting[1];
        let delSetting = capaianSetting[2];

    
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
            { "name": "plo", "title": "PLO" },
            { "name": "statement", "title": "Statement" },
            // { "name": "percentage", "title": "Percentage" },
            // { "name": "status", "title": "Status" }
            // ,
            { "name": "upt_btn", "title": "Action",'class':"text-center", "breakpoints": "md sm xs" }
        ];
        
        var list2 = [];
        let bil = 1;
        let convertDetList2 = JSON.stringify(obj_obeList);
        $("#dataDetailList2").val(convertDetList2);
        console.log(obj_obeList);
        $.each(obj_obeList, function(i, objObe){
            
            // let aca_calyear = field.acaCal;
            // if( aca_calyear != null ){ aca_calyear = aca_calyear.replace('/','') }
            // let acaCal = aca_calyear+ '/' +field.cal_cohort;
            // let acaIntake = field.intake_month+ '-' +field.intake_year;

            list2.push({
                bil: bil++, 
                plo: objObe.obe_plo_name, 
                statement: objObe.obe_plo_statement,
                // percentage: objObe.obe_plo_percentage,
                // status: objObe.obe_plo_status,
                // ses_intake: field.dtp_year+'<br>'+field.dtp_intake,
                upt_btn:  '  <button class="btn btn-icon success" '+SettingUpdateDisabled+' title="Update" onclick="uptObe_plo(\'' +i+ '\')"><i class="ion-android-create"></i></button> '+
                            '<button class="btn btn-icon danger" '+SettingDelDisabled+' title="Remove" onclick="del_rekod_plo(\''+objObe.obe_plo_id+'\')"><i class="ion-trash-b" ></i></button>'
            });
        });

        $("#obeTable").footable({
            "columns": columns,
            "rows": list2,
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
    })
}


function uptSession(index){
    let data = JSON.parse($("#dataDetailList").val());
    data = data[index];

    $('#pgmDet_id').val(data.dtp_id);
    $('#aca_calendar').val(data.fk_aca_calendar);

    // select Intake
    intakeByAcaCal(data.fk_aca_calendar, function(){
        $("#dtp_intake").html('');
        $("#dtp_intake").append('<option value="">- Choose Intake -</option>')
        $.each(obj_curYear.data,function(i, field){
            $("#dtp_intake").append('<option value="'+field.curYear_id+'" data-intake="'+field.intake_name+'-'+field.intake_year+'" >'+field.intake_name+'-'+field.intake_year+'</option>');
        });
        $('#dtp_intake').val(data.fk_sesIntake);
    });

    $('#divFormSession').show();
}


function detailsList(id, returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmProgDet/list/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_detList = response.data;
        returnValue();
    });
}

function obeList(pgm_id, returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misprmobe/show/"+pgm_id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_obeList = response.data;
        returnValue();
    });
}

function intakeByAcaCal(id, returnValue){
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

// function uptObe_plo(indexs){
//     // let data = JSON.parse($("#dataDetailList2").val());
//     // data = data[indexs];
//     // let selectSession = data.cal_year;
//     // let sem = data.cal_cohort;

//     // $('#addDrop_id').val(data.addDrop_id);
//     // $('#tarikhMula_upt').val(data.start_date);
//     // $('#tarikhAkhir_upt').val(data.end_date);
//     // $('#upt_status').val(data.status);
//     // $('#currYear_upt').val(selectSession.replace('/','')+'/'+data.cal_cohort);

//     // // select Category
//     // catByYearSem(selectSession, sem, function(){
//     //     $('#upt_aca_calendar').html('');
//     //     $('#upt_aca_calendar').append('<option value="">- Choose -</option>');
//     //     $.each(obj_kalendar.data, function(i, item){
//     //         $('#upt_aca_calendar').append('<option value="'+item.cal_id+'">'+item.category+'</option>');
//     //     });
//     //     $('#upt_aca_calendar').val(data.aca_calendar);
//     // });
    
//     $("#mdlUptObe_Plo").modal("show");
// }


function uptObe_plo(indexs){

    // $('#dataDetailList2').val(data.fk_aca_calendar);

    let data = JSON.parse($("#dataDetailList2").val());
    data = data[indexs];
    // let selectSession = data.cal_year;
    // let sem = data.cal_cohort;

    $('#obe_plo_id').val(data.obe_plo_id);
    $('#upt_obe_plo_name').val(data.obe_plo_name);
    $('#upt_obe_statement').val(data.obe_plo_statement);
    
    $("#mdlUptObe_Plo").modal("show");
}



$('#formAddObePLo').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add PLO",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let obe_plo_name = $('#obe_plo_name').val();
            let pgm_id = window.sessionStorage.prog_id;
            let obe_plo_statement = $('#obe_plo_statement').val();
            let recordstatus = 'ADD';

            var form = new FormData();
            form.append("obe_plo_name", obe_plo_name);
            form.append("pgm_id", pgm_id);
            // form.append("obe_plo_statement", crs_code.split(' ').join(''));
            form.append("obe_plo_statement", obe_plo_statement);
            form.append("recordstatus",recordstatus);                                                             

            var settings = {
                "url": host+"api_tetapan_picoms/public/misprmobe/registerPlo",
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

$("#mdlUptObe_Plo").on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update PLO",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let obe_plo_id = $("#obe_plo_id").val();
            let upt_obe_plo_name = $("#upt_obe_plo_name").val();
            let upt_obe_statement = $("#upt_obe_statement").val();
            // let upt_pgm_status = $("#upt_pgm_status").val();

            var form = new FormData();
            form.append("obe_plo_id", obe_plo_id);
            form.append("obe_plo_name", upt_obe_plo_name);
            form.append("obe_plo_statement", upt_obe_statement);
            form.append("recordstatus", 'EDT');

            var settings = {
                "url": host+"api_tetapan_picoms/public/misprmobe/updatePlo",
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
    
            $.ajax(settings).done(function (response) {
                console.log(response)
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


//-------------------------------------------------- update programme --------------------------------------------------//
$("#formUptObeSetting").on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update OBE Attainment Percent",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let pk_id = $("#pk_id").val();
            let upt_pgm_attainment = $("#upt_pgm_attainment").val();

            var form = new FormData();
            form.append("pk_id", pk_id);
            form.append("pgm_attainment", upt_pgm_attainment);
            form.append("recordstatus", 'EDT');

            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmProg/updateObe",
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
    
            $.ajax(settings).done(function (response) {
                console.log(response)
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
//-------------------------------------------------- end update programme --------------------------------------------------//
