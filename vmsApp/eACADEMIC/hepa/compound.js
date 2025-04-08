$(function(){
    $.ajaxSetup ({
        cache: false
    });
    $.fn.select2.defaults.set( "theme", "bootstrap" );

    let userRole = window.sessionStorage.userRole;

    if( userRole == 'warden' ){$('#upt_dis_pay_status').attr('disabled', true) }
    else if( userRole == 'admin' ){ $('#upt_dis_pay_status').attr('disabled', false) }

    // select Campus List
    campusList(function(){
        $('#clg_id').append('<option value="">- Choose -</option>');
        $('#upt_clg_id').append('<option value="">- Choose -</option>');
        $.each(obj_college.data, function (i, item){
            $('#clg_id').append('<option value="'+item.pk_id+'">'+item.clg_name+'</option>');
            $('#upt_clg_id').append('<option value="'+item.pk_id+'">'+item.clg_name+'</option>');
        });
    });

    // type List
    typeList(function(){
        $('#dis_type').append('<option value="">- Choose -</option>');
        $('#upt_dis_type').append('<option value="">- Choose -</option>');
        $.each(obj_typeDis.data, function (i, item){
            $('#dis_type').append('<option value="'+item.pk_id+'">'+item.description.toUpperCase()+'</option>');
            $('#upt_dis_type').append('<option value="'+item.pk_id+'">'+item.description.toUpperCase()+'</option>');
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:',
        });
    });

    // Discipline List
    listCompound(function(){
        var colums = [
            { "name": "bil", "title": "No." },
            { "name": "clg_id", "title": "Campus" },
            { "name": "dis_refNo", "title": "Reference No." },
            { "name": "stud_icno", "title": "Det. Student" },
            { "name": "dis_type", "title": "Discipline Type", "breakpoints": "md sm xs" },
            { "name": "dis_pay_status", "title": "Status", "breakpoints": "md sm xs" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];

        let bil = 1;
        let convertList = JSON.stringify(obj_compound.data);
        $("#dataList").val(convertList);
        var list = [];
        $.each(obj_compound.data, function (i, field){
            let status = field.dis_pay_status;
            let label = ''; let dsplyBtn = '';
            if( status == 'New' ){ label = '<span class="label warning">'+status+'</span>' }
            else if( status == 'Paid' ){ label = '<span class="label success">'+status+'</span>' }

            if( userRole == 'financial' ){
                dsplyBtn = '<button class="btn btn-icon success" title="View" onclick="viewData(\'' + i + '\')" ><i class="ion-android-create"></i></button>';
            }
            else{
                dsplyBtn = '<button class="btn btn-icon success" title="Update" onclick="loadData(\'' + i + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button> ' +
                            '<button class="btn btn-icon danger" title="Delete" onclick="delData(\''+field.dis_id+'\')"><i class="ion-trash-a"></i>'
            }

            list.push({
                bil: bil++, clg_id: '<span class="text-uppercase">'+field.clg_name+'</span>', 
                dis_refNo: '<span class="text-uppercase">'+field.dis_refNo+'</span>',
                dis_pay_status: label,
                stud_icno: '<span class="text-uppercase"><b>'+field.stud_icno+'</b></span><br>'+ field.sti_name+'<br>'+field.sti_icno, 
                dis_type: '<span class="text-uppercase">'+field.description+'</span>', 
                upt_btn: dsplyBtn
            });
        });

        list.push({
            // dis_type: '<h4><strong>Total Compound : ' + list.length + '</strong></h4>',
        });
        $('#totalcompound').html((list.length)-1);

        $("#compoundList").html('');
        $("#compoundList").footable({
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


    
    // UTK detect nama by ic afiez 19sep2023
    $("#stud_icno").on('change', function(){
        let token = window.localStorage.token;
        chkStdExist($("#stud_icno").val(), function(){
            if(result.success){
                let data = result.data[0];
                // console.log(data);

                $("#compound_sti_name").val(data.sti_name);
                // $("#no_kad_pengenalan").val(data.no_kad_pengenalan);
            }
        });
    });
    //end UTK detect nama by ic
    listCompound(function(){
        var colums = [
            { "name": "bil", "title": "No.","style": "text-align:center;"  },
            { "name": "dis_date", "title": "Date" ,"style": "text-align:center;" },
            { "name": "dis_venue", "title": "Venue" ,"style": "text-align:center;" },
            { "name": "Det_student", "title": "Det. Student" ,"style": "text-align:center;" },
            { "name": "dis_type", "title": "Discipline Type", "breakpoints": "md sm xs" ,"style": "text-align:center;" },
            { "name": "dis_amount", "title": "Amount", "breakpoints": "md sm xs" ,"style": "text-align:center;" },
            { "name": "status", "title": "Status", "breakpoints": "md sm xs" ,"style": "text-align:center;" },
        ];

        let bil = 1;
        let convertList = JSON.stringify(obj_compound.data);
        $("#dataList").val(convertList);
        var list = [];
        // console.log(obj_compound.data);
        $.each(obj_compound.data, function (i, field){
            // let status = field.dis_pay_status;
            let label = ''; let dsplyBtn = '';
        

            list.push({
                bil: bil++,
                dis_date: formatDate(field.dis_date), 
                dis_venue: '<span class="text-uppercase">'+field.dis_venue+'</span>',
                Det_student: '<span class="text-uppercase"><b>'+field.stud_icno+'</b></span><br>'+ field.sti_name+'<br>'+field.sti_icno, 
                dis_type: '<span class="text-uppercase">'+field.description+'</span>', 
                dis_amount: 'RM '+field.dis_amount,
                status: field.dis_pay_status,
            });
        });

        list.push({
            dis_type: '<h4><strong>Total Compound : ' + list.length + '</strong></h4>',
        });
        // $('#').html((list.length)-1);

        $("#reportTableDisc").html('');
        $("#reportTableDisc").footable({
            "columns": colums,
            "rows": list,

        });
    });
});
var confirmed = false;


// button New Record
$('#modalNew').click(function(){
    $('.check').html('');
    $('.btnSave').prop('disabled', false);
});


// check student exist
$('.chkStd').on('input', function(){
    let input = $(this).val();
    chkStdExist(input, function(){
        if(result.data != ''){
            $('.check').html('');
            $('.btnSave').prop('disabled', false);
        }
        else{
            $('.check').html('Not Found');
            $('.btnSave').prop('disabled', true);
        }
    });
});


//-------------------------------------------------- add Compound --------------------------------------------------//
$('#formAddCompound').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Discipline",
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
            let stud_icno = $('#stud_icno').val();
            let dis_date = $('#dis_date').val();
            let dis_time = $('#dis_time').val();
            let dis_venue = $('#dis_venue').val();
            let dis_action = $('#dis_action').val();
            let dis_refNo = $('#dis_refNo').val();
            let dis_type = $('#dis_type').val();
            let dis_issue = $('#dis_issue').val();
            let dis_remark = $('#dis_remark').val();
            let dis_amount = $('#dis_amount').val();

            var form = new FormData();
            form.append("clg_id", clg_id);
            form.append("stud_icno", stud_icno);
            form.append("dis_date", dis_date);
            form.append("dis_time", dis_time);
            form.append("dis_venue", dis_venue);
            form.append("dis_action", dis_action);
            form.append("dis_pay_status", 'New');
            form.append("dis_refNo", dis_refNo);
            form.append("dis_type", dis_type);
            form.append("dis_issue", dis_issue);
            form.append("dis_remark", dis_remark);
            form.append("dis_amount", dis_amount);
            form.append("recordstatus",'ADD');

            var settings = {
                "url": host+"api_hep/public/hepDiscipline/register",
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
//-------------------------------------------------- end add Compound --------------------------------------------------//


function loadData(index){
    let data = JSON.parse($("#dataList").val());
    $('#pk_id').val(data[index].dis_id);
    $('#upt_clg_id').val(data[index].cam_id);
    $('#upt_stud_icno').val(data[index].stud_icno);
    $('#upt_dis_date').val(data[index].dis_date);
    $('#upt_dis_time').val(data[index].dis_time);
    $('#upt_dis_venue').val(data[index].dis_venue);
    $('#upt_dis_action').val(data[index].dis_action);
    $('#upt_dis_pay_status').val(data[index].dis_pay_status);
    $('#upt_dis_refNo').val(data[index].dis_refNo);
    $('#upt_dis_issue').val(data[index].dis_issue);
    $('#upt_dis_remark').val(data[index].dis_remark);
    $('#upt_dis_type').val(data[index].dis_type).trigger('change');
    $('#upt_dis_amount').val(data[index].dis_amount);

    $('.check').html('');
    $('.btnSave').prop('disabled', false);

    $('#update-compound').modal('show');
}


//-------------------------------------------------- update Compound --------------------------------------------------//
$('#formUptCompound').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Discipline",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let dis_id = $('#pk_id').val();
            let clg_id = $('#upt_clg_id').val();
            let stud_icno = $('#upt_stud_icno').val();
            let dis_date = $('#upt_dis_date').val();
            let dis_time = $('#upt_dis_time').val();
            let dis_venue = $('#upt_dis_venue').val();
            let dis_action = $('#upt_dis_action').val();
            let dis_pay_status = $('#upt_dis_pay_status').val();
            let dis_type = $('#upt_dis_type').val();
            let dis_issue = $('#upt_dis_issue').val();
            let dis_remark = $('#upt_dis_remark').val();

            var form = new FormData();
            form.append("dis_id", dis_id);
            form.append('clg_id', clg_id);
            form.append("stud_icno", stud_icno);
            form.append("dis_date", dis_date);
            form.append("dis_time", dis_time);
            form.append("dis_venue", dis_venue);
            form.append("dis_action", dis_action);
            form.append("dis_pay_status", dis_pay_status);
            form.append("dis_type", dis_type);
            form.append("dis_issue", dis_issue);
            form.append("dis_remark", dis_remark);
            form.append("recordstatus",'EDT');

            var settings = {
                "url": host+"api_hep/public/hepDiscipline/update",
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
//-------------------------------------------------- end update Compound --------------------------------------------------//


function viewData(index){
    let data = JSON.parse($("#dataList").val());
    let status = data[index].dis_pay_status
    $('#view_pk_id').val(data[index].dis_id);
    $('#view_clg_id').html(data[index].clg_name);
    $('#view_stud_icno').html(data[index].stud_icno);
    $('#view_dis_date').html(data[index].dis_date);
    $('#view_dis_time').html(data[index].dis_time);
    $('#view_dis_venue').html(data[index].dis_venue);
    $('#view_dis_action').html(data[index].dis_action);
    $('#view_dis_refNo').html(data[index].dis_refNo);
    $('#view_dis_type').html(data[index].id_salahlaku+' - '+data[index].description);
    $('#view_dis_issue').html(data[index].dis_issue);
    $('#view_dis_remark').html(data[index].dis_remark);
    $('#view_dis_amount').html('RM '+data[index].dis_amount);

    if( status == 'New' ){
        $('#view_dis_pay_status').html('<span class="label warning">'+status+'</span>');
        $('#btnPaid').show();
    }
    else if( status == 'Paid' ){
        $('#view_dis_pay_status').html('<span class="label success">'+status+'</span>');
        $('#btnPaid').hide();
    }

    $('#viewCompound').modal('show');
}


// delete Discipline
function delData(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("dis_id", id);

    swal({
        title: "Remove Discipline",
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
            "url": host+"api_hep/public/hepDiscipline/delete",
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


//-------------------------------------------------- update Paid --------------------------------------------------//
$('#formPaid').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "UPDATE DISCIPLINE",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let dis_id = $('#view_pk_id').val();

            var form = new FormData();
            form.append("dis_id", dis_id);
            form.append("dis_pay_status", 'Paid');
            form.append("recordstatus",'EDT');

            var settings = {
                "url": host+"api_hep/public/hepDiscipline/uptPaid",
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
//-------------------------------------------------- end update Paid --------------------------------------------------//


function listCompound(returnValue){
    var settings = {
        "url": host+"api_hep/public/hepDiscipline/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_compound = response;
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

function typeList(returnValue){
    var settings = {
        "url": host+"api_hep/public/hepdissalahlaku/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
       obj_typeDis = response;
       returnValue();
    });
}