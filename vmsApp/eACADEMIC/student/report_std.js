$(function(){
    $.ajaxSetup ({
        cache: false
    });

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

    // select Type
    aduanType(function(){
        $('#aduan_type').html('');
        $('#upt_aduan_type').html('');
        $('#aduan_type').append('<option value="">- Choose -</option>');
        $('#upt_aduan_type').append('<option value="">- Choose -</option>');
        $.each(obj_aduanType.data, function(i, item){
            $('#aduan_type').append('<option value="'+item.pk_id+'">'+item.description+'</option>');
            $('#upt_aduan_type').append('<option value="'+item.pk_id+'">'+item.description+'</option>');
        });
    });

    // Discipline List
    listAduan(studId, function(){
        createTbl(obj_report.data);
    });
});
var confirmed = false;


// check format file & size before upload
$(".chkFormat").on("change", function(){
    // check size
    if(this.files[0].size > 3000000){
      alert("Please upload file less than 3MB. Thanks!!");
      $(this).val('');
    }

    // check type
    var extension = $(this).val().split('.').pop().toLowerCase();
    if($.inArray(extension, ['pdf','jpg','jpeg','png']) == -1) {
        alert('Please upload PDF file or Image only.');
        $(this).val('');
    }
});


//-------------------------------------------------- add Report --------------------------------------------------//
$('#formAddReport').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Complaint",
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
            let stud_icno = $('#studentId').val();
            let aduan_type = $('#aduan_type').val();
            let aduan_venue = $('#aduan_venue').val();
            let aduan_remark = $('#aduan_remark').val();
            let aduan_date = $('#aduan_date').val();
            let aduan_upload = $('#aduan_upload')[0].files[0];

            var form = new FormData();
            form.append("clg_id", clg_id);
            form.append("stud_icno", stud_icno);
            form.append("aduan_type", aduan_type);
            form.append("aduan_venue", aduan_venue);
            form.append("aduan_remark", aduan_remark);
            form.append("aduan_date", aduan_date);
            form.append("aduan_status", 'New');
            form.append("aduan_upload", aduan_upload);
            form.append("recordstatus",'ADD');

            var settings = {
                "url": host+"api_hep/public/hepaduan/register",
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
//-------------------------------------------------- end add Report --------------------------------------------------//


//-------------------------------------------------- details Report --------------------------------------------------//
// edit data
function loadData(index){
    let data = JSON.parse($("#dataList").val());
    let aduanType = data[index].aduan_type;

    $('#pk_id').val(data[index].id_aduan);
    $('#upt_clg_id').val(data[index].cam_id);
    $('#upt_aduan_type').val(aduanType);
    $('#upt_aduan_venue').val(data[index].aduan_venue);
    $('#upt_aduan_remark').val(data[index].aduan_remark);
    $('#upt_aduan_date').val(data[index].aduan_date);

    if(!(data[index].aduan_upload == '' || data[index].aduan_upload == null)){
        $('#view_aduan_upload').html('<a target="_blank" class="btn btn-icon primary" href="'+host+'api_hep/public/aduan/'+data[index].aduan_upload+'" title="'+data[index].aduan_upload+'"><i class="fa fa-file-pdf-o"></i></a>');
        $('#exist_aduan_upload').val(data[index].aduan_upload);
    }
    else{
        $('#view_aduan_upload').html('<button type="button" class="btn btn-icon"><i class="fa fa-file-pdf-o"></i></button>');
        $('#exist_aduan_upload').val('');
    }

    $('#modalUpdate').modal('show');
}

// view data
function loadViewData(index){
    let data = JSON.parse($("#dataList").val());
    let aduanId = data[index].id_aduan;
    let aduanType = data[index].aduan_type;
    let aduanStts = data[index].aduan_status;
    let aduanUpload = data[index].aduan_upload;
    let stdId = data[index].stud_icno;
    let viewUpload = '';

    if(!(aduanUpload == '' || aduanUpload == null)){
        viewUpload = '<a target="_blank" style="color:cornflowerblue" href="'+host+'api_hep/public/aduan/'+aduanUpload+'"><span class="label info">Document</span></a>';
    }
    
    $('#aduanId').val(aduanId);
    $('#view_clg_id').html(data[index].clg_name);
    $('#view_aduan_type').html(data[index].description);
    $('#view_aduan_venue').html(data[index].aduan_venue);
    $('#view_upload').html(viewUpload);
    $('#view_aduan_remark').html(data[index].aduan_remark);
    $('#view_aduan_date').html(formatDate(data[index].aduan_date));
    
    $('#view_aduan_warden_assigned').html(data[index].emp_name);
    $('#view_aduan_warden_remark').html(data[index].aduan_warden_remark);

    if( aduanType == 2 ){ $('.sttsKerosakan').removeClass('collapse'); }
    else{ $('.sttsKerosakan').addClass('collapse'); }

    if( aduanStts == 'New' ){ $('#view_aduan_status').html('<span class="label warning">'+aduanStts+'</span>'); }
    else if( aduanStts == 'Accept' ){ $('#view_aduan_status').html('<span class="label success">'+aduanStts+'</span>'); }
    else if( aduanStts == 'Complete' ){ $('#view_aduan_status').html('<span class="label grey">'+aduanStts+'</span>'); }

    // update alert
    var form = new FormData();
    form.append("id_aduan", aduanId);
    form.append("aduan_alert", 0);
    form.append("recordstatus",'EDT');

    var settings = {
        "url": host+"api_hep/public/hepaduan/uptAlert",
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
            // count alert==1
            $('#alertMenuDis').hide();
            $('#alertReport').hide();
            alertReport(stdId, function(){
                let count = obj_aduan.data.length;
                if(count != 0){
                    $('#alertMenuDis').show();
                    $('#alertReport').html(count);
                    $('#alertReport').show();
                }
            });

            listAduan(stdId, function(){
                createTbl(obj_report.data);
            });
        }
    });

    $('#modalView').modal('show');
}
//-------------------------------------------------- end details Report --------------------------------------------------//


//-------------------------------------------------- update Report --------------------------------------------------//
$('#formUptReport').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Complaint",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let id_aduan = $('#pk_id').val();
            let clg_id = $('#upt_clg_id').val();
            let aduan_type = $('#upt_aduan_type').val();
            let aduan_venue = $('#upt_aduan_venue').val();
            let aduan_remark = $('#upt_aduan_remark').val();
            let aduan_date = $('#upt_aduan_date').val();
            let aduan_upload = $('#upt_aduan_upload')[0].files[0];
            let exist_aduan_upload = $('#exist_aduan_upload').val();

            var form = new FormData();
            form.append("id_aduan", id_aduan);
            form.append("clg_id", clg_id);
            form.append("aduan_type", aduan_type);
            form.append("aduan_venue", aduan_venue);
            form.append("aduan_remark", aduan_remark);
            form.append("aduan_date", aduan_date);
            form.append("aduan_upload", aduan_upload);
            form.append("exist_aduan_upload", exist_aduan_upload);
            form.append("recordstatus",'EDT');

            var settings = {
                "url": host+"api_hep/public/hepaduan/uptStd",
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
//-------------------------------------------------- end update Report --------------------------------------------------//


//-------------------------------------------------- delete Report --------------------------------------------------//
function delData(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("id_aduan", id);

    swal({
        title: "Remove Complaint",
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
            "url": host+"api_hep/public/hepaduan/delete",
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
//-------------------------------------------------- delete Report --------------------------------------------------//


//-------------------------------------------------- create table --------------------------------------------------//
function createTbl(data){
    var colums = [
        { "name": "bil", "title": "No." },
        { "name": "clg_id", "title": "Campus" },
        { "name": "aduan_type", "title": "Type" },
        { "name": "aduan_date", "title": "Date", "breakpoints": "md sm xs" },
        { "name": "aduan_venue", "title": "Venue", "breakpoints": "md sm xs" },
        { "name": "aduan_status", "title": "Status", "breakpoints": "md sm xs" },
        { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
    ];

    let bil = 1;
    let convertList = JSON.stringify(data);
    $("#dataList").val(convertList);
    var list = [];

    $.each(data, function (i, field){
        let aduanStts = field.aduan_status;
        let viewBtn = ''; let label = ''; let alert = '';
        if(aduanStts == 'New'){
            viewBtn = '<button class="btn btn-icon success" title="Update" onclick="loadData(\'' + i + '\')"><i class="ion-android-create"></i></button> ' +
                        '<button class="btn btn-icon danger" title="Delete" onclick="delData(\''+field.id_aduan+'\')"><i class="ion-trash-a"></i></button>';

            label = '<span class="label warning">'+aduanStts+'</span>';
        }
        else if(aduanStts == 'Accept'){
            viewBtn = '<button class="btn btn-icon accent" title="View" onclick="loadViewData(\'' + i + '\')" ><i class="ion-eye"></i></button>';
            label = '<span class="label success">'+aduanStts+'</span>';
        }
        else if(aduanStts == 'Complete'){
            viewBtn = '<button class="btn btn-icon accent" title="View" onclick="loadViewData(\'' + i + '\')" ><i class="ion-eye"></i></button>';
            label = '<span class="label grey">'+aduanStts+'</span>';
        }

        if( field.aduan_alert != 1 ){ alert = 'hidden' }
        else{ alert = '' }

        list.push({
            bil: '<span class="label label-xs danger" '+alert+'></span> '+bil++, clg_id: '<span class="text-uppercase">'+field.clg_name+'</span>', aduan_type: '<span class="text-uppercase">'+field.description+'</span>', 
            aduan_date: formatDate(field.aduan_date), aduan_venue: '<span class="text-uppercase">'+field.aduan_venue+'</span>', aduan_status: label,
            upt_btn: viewBtn
        });
    });

    $("#aduanList").html('');
    $("#aduanList").footable({
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
}
//-------------------------------------------------- end create table --------------------------------------------------//


function listAduan(id, returnValue){
    var settings = {
        "url": host+"api_hep/public/hepaduan/listByStd/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_report = response;
        returnValue();
    });
}

function aduanType(returnValue){
    var settings = {
        "url": host+"api_hep/public/hepjenisaduan/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_aduanType = response;
        returnValue();
    });
}