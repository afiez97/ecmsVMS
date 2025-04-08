$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let usrRole = window.sessionStorage.usrRole;
    if( usrRole == 'dekan' || usrRole == 'ketuaPJ' || usrRole == 'pensyarah' || usrRole == 'instrutor' ){ $('.btnHide').hide(); }

    announcementList(function(){
        $("#takwimList").html('');

        var columns = [
            { "name": "bil", "title": "No." },
            { "name": "twm_title", "title": "Title" },
            { "name": "twm_sdate", "title": "Start Date" },
            { "name": "twm_edate", "title": "End Date", "breakpoints": "md sm xs" },
            { "name": "twm_status", "title": "Status", "breakpoints": "md sm xs" },
            { "name": "upt_btn", "title": "Action" },
        ];

        let bil = 1;
        let convertList = JSON.stringify(obj_announcement.data);
        $("#dataList").val(convertList);
        var list = [];

        $.each(obj_announcement.data, function (i, field){
            let display = '';
            if( usrRole == 'dekan' || usrRole == 'ketuaPJ' || usrRole == 'pensyarah' || usrRole == 'instrutor' ){ display = 'disabled' }

            list.push({
                bil: bil++, twm_title: '<span class="text-uppercase">'+field.twm_title+'</span>', twm_sdate: formatDate(field.twm_sdate), twm_edate: formatDate(field.twm_edate), twm_status: '<span class="text-uppercase">'+field.twm_status+'</span>',
                upt_btn: '<button class="btn btn-icon success" title="Update" onclick="loadData(\'' + i + '\')"><i class="ion-android-create"></i></button> ' +
                        '<button class="btn btn-icon danger" title="Delete" onclick="del_rekod(\''+field.twm_id+'\')" '+display+'><i class="ion-trash-b"></i>'
            });
        });

        $("#takwimList").footable({
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

    statusList(function(){
        $('#status').append('<option value="">- Choose -</option>');
        $('#upt_twm_status').append('<option value="">- Choose -</option>');
        $.each(obj_status.data, function (i, item){
            $('#status').append('<option value="'+item.status_name+'">'+item.status_name+'</option>');
            $('#upt_twm_status').append('<option value="'+item.status_name+'">'+item.status_name+'</option>');
        });
    });
    
});
var confirmed = false;


function announcementList(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmTakwim/list",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_announcement = response;
        returnValue();
    });
}


//-------------------------------------------------- add announcement --------------------------------------------------//
$('#formAddAnnouncement').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Announcement",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            // let attachment = $('#attachment').val();
            let attachment = $("#attachment")[0].files[0];
            let twm_title = $('#twm_title').val();
            let twm_description = $('#twm_description').val();
            let twm_sdate = $('#twm_sdate').val();
            let twm_edate = $('#twm_edate').val();
            let status = $('#status').val();

            var form = new FormData();
            form.append("twm_title", twm_title);
            form.append("twm_description", twm_description);
            form.append("twm_sdate", twm_sdate);
            form.append("twm_edate", twm_edate);
            form.append("attachment", attachment);
            form.append("twm_status", status);
            form.append("recordstatus", 'ADD');

            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmTakwim/register",
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
//-------------------------------------------------- end add announcement --------------------------------------------------//


// load data announcement
function loadData(indexs){
    let data = JSON.parse($("#dataList").val());
    $('#upt_twm_id').val(data[indexs].twm_id);
    $('#upt_twm_title').val(data[indexs].twm_title);
    $('#upt_twm_description').val(data[indexs].twm_description);
    $('#upt_twm_sdate').val(data[indexs].twm_sdate);
    $('#upt_twm_edate').val(data[indexs].twm_edate);
    // $('#attachment_upt').val(data[indexs].attachment);
    if (data[indexs].attachment != null && data[indexs].attachment != '')
    {
        $("#attachment_old").html('<a target="_blank" href="'+host+'api_tetapan_picoms/public/upload_annoucement/'+data[indexs].attachment+'" title="'+data[indexs].attachment+'"><span class="label success">Document</span></a>');

    }
    else{
        $("#attachment_old").html('<a ><span class="label warning" disabled>No Document</span></a>');

    }

    $('#upt_twm_status').val(data[indexs].twm_status);    

    $("#update-takwim").modal("show");
}


//-------------------------------------------------- update announcement --------------------------------------------------//
$("#formUptAnnouncement").on('submit', function (e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Calendar",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let upt_twm_id = $("#upt_twm_id").val();
            let upt_twm_title = $("#upt_twm_title").val();
            let upt_twm_description = $("#upt_twm_description").val();
            let upt_twm_sdate = $("#upt_twm_sdate").val();
            let upt_twm_edate = $("#upt_twm_edate").val();
            let attachment_upt = $("#attachment_upt")[0].files[0];
            let upt_twm_status = $("#upt_twm_status").val();
            let statusrekod = "EDT";
            // let upt_year = upt_twm_sdate.substring(0,4);

            var form = new FormData();
            form.append("twm_id", upt_twm_id);
            form.append("twm_title", upt_twm_title);
            form.append("twm_description", upt_twm_description);
            form.append("twm_sdate", upt_twm_sdate);
            form.append("twm_edate", upt_twm_edate);
            form.append("attachment", attachment_upt);
            form.append("twm_status", upt_twm_status);
            form.append("recordstatus", statusrekod);
    
            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmTakwim/update",
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
//-------------------------------------------------- end update announcement --------------------------------------------------//


// delete announcement
function del_rekod(id){
    let statusrekod = 'DEL';
    let twm_id = id;

    var form = new FormData();
    form.append("recordstatus", statusrekod);
    form.append("twm_id", twm_id);

    swal({
        title: "Remove Calendar",
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
            "url": host+"api_tetapan_picoms/public/misPrmTakwim/delete",
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


//-------------------------------------------------- end date & start date validation --------------------------------------------------//
$("#upt_twm_edate").change(function(){
    let upt_twm_sdate = new Date($("#upt_twm_sdate").val());
    let upt_twm_edate = new Date($("#upt_twm_edate").val());
    
    if ((upt_twm_edate - upt_twm_sdate) < 0){
        alert('Invalid Date Range');
        $("#upt_twm_edate").val('');
    }
});

$("#upt_twm_sdate").change(function(){
    let upt_twm_sdate = new Date($("#upt_twm_sdate").val());
    let upt_twm_edate = new Date($("#upt_twm_edate").val());
    
    if ((upt_twm_sdate - upt_twm_edate ) > 0){
        alert('Invalid Date Range');
        $("#upt_twm_sdate").val('');
    }
});

$("#twm_edate").change(function(){
    let twm_sdate = new Date($("#twm_sdate").val());
    let twm_edate = new Date($("#twm_edate").val());
    
    if ((twm_edate - twm_sdate) < 0){
        alert('Invalid Date Range');
        $("#twm_edate").val('');
    }
});

$("#twm_sdate").change(function(){
    let twm_sdate = new Date($("#twm_sdate").val());
    let twm_edate = new Date($("#twm_edate").val());
    
    if ((twm_sdate - twm_edate ) > 0){
        alert('Invalid Date Range');
        $("#twm_sdate").val('');
    }
});
//-------------------------------------------------- end date & start date validation --------------------------------------------------//