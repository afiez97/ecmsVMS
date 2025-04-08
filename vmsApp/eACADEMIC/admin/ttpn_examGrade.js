$(function(){
    $.ajaxSetup ({
        cache: false
    });

    // select status
    statusList(function(){
        $('#grd_status').append('<option value="">- Choose -</option>');
        $('#upt_grd_status').append('<option value="">- Choose -</option>');
        $.each(obj_status.data, function (i, item) {
            $('#grd_status').append('<option value="'+item.status_name+'">'+item.status_name+'</option>');
            $('#upt_grd_status').append('<option value="'+item.status_name+'">'+item.status_name+'</option>');
        });
    });

    // select Code Grade
    grdCode(function(){
        $('#grd_id').append($('<option value="">- Choose -</option>'));
        $('#upt_grd_id').append($('<option value="">- Choose -</option>'));
        $.each(obj_grdCode.data, function (i, item) {
            $('#grd_id').append($('<option value="'+item.grade_name+'">'+item.grade_name+'</option>'));
            $('#upt_grd_id').append($('<option value="'+item.grade_name+'">'+item.grade_name+'</option>'));
        });
    });

    // select Quality Point (x sure dia nk open text ke select)
    // qualityPoint(function(){
    //     $('#quality_point').append($('<option value="">- Choose -</option>'));
    //     $.each(obj_quaPoint.data, function (i, item) {
    //         $('#quality_point').append($('<option value="'+item.point+'">'+item.point+'</option>'));
    //     });
    // });

    // select Category
    grdCategory(function(){
        $('#grd_category').append($('<option value="">- Choose -</option>'));
        $.each(obj_grdCategory.data, function (i, item){
            $('#grd_category').append($('<option value="'+item.grd_code+'">'+item.category+'</option>'));
        });
    });

    // list Undergraduate
    listUndergraduate('001', function(){

        // capaianSetting = load_capaian();
        load_capaian();
        capaianSetting = window.capaianData;
        // console.log(capaianSetting);
        let uptSetting = capaianSetting[1];
    
        if (uptSetting == 0){
            SettingUpdateDisabled = 'disabled';
        }
        else{
            SettingUpdateDisabled = ''; 
        }
    
    
        let columns = [
            { "name": "grd_id", "title": "Grade" },
            { "name": "grd_score", "title": "Marks From", "breakpoints": "md sm xs" },
            { "name": "grd_score_to", "title": "Marks To", "breakpoints": "md sm xs" },
            { "name": "quality_point", "title": "Grade Point" },
            { "name": "grd_remarks", "title": "Remark" },
            { "name": "grd_status", "title": "Status", "breakpoints": "md sm xs" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" }
        ];

        let bil = 1;
        let convertList = JSON.stringify(obj_listUndergraduate.data);
        $("#dataList").val(convertList);
        let list_data = [];
        
        $.each(obj_listUndergraduate.data, function(i, field){
            list_data.push({
                "grd_id": field.grd_id, "grd_score": field.grd_score, "grd_score_to": field.grd_score_to, "quality_point": field.quality_point, 
                "grd_remarks": '<span class="text-uppercase">'+field.grd_remarks+'</span>', "grd_status": '<span class="text-uppercase">'+field.grd_status+'</span>',
                "upt_btn": '<button class="btn btn-icon success" '+SettingUpdateDisabled+' title="Update" onclick="loadData(\'' + field.exmGrade_id + '\')"><i class="ion-android-create"></i></button>'
            });
        });
        $('#tblUndergraduate').html('');
        $('#tblUndergraduate').footable({
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

    // list Postgraduate (Coursework)
    listUndergraduate('002', function(){

        // capaianSetting = load_capaian();
        load_capaian();
        capaianSetting = window.capaianData;
        // console.log(capaianSetting);
        let uptSetting = capaianSetting[1];
    
        if (uptSetting == 0){
            SettingUpdateDisabled = 'disabled';
        }
        else{
            SettingUpdateDisabled = ''; 
        }

        let columns = [
            { "name": "grd_id", "title": "Code Grade" },
            { "name": "grd_score", "title": "Marks From", "breakpoints": "md sm xs" },
            { "name": "grd_score_to", "title": "Marks To", "breakpoints": "md sm xs" },
            { "name": "quality_point", "title": "Grade Point" },
            { "name": "grd_remarks", "title": "Remark" },
            { "name": "grd_status", "title": "Status", "breakpoints": "md sm xs" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" }
        ];

        let bil = 1;
        let convertList = JSON.stringify(obj_listUndergraduate.data);
        $("#dataListCrswrk").val(convertList);
        let list_data = [];
        
        $.each(obj_listUndergraduate.data, function(i, field){
            list_data.push({
                "bil": bil++, "grd_id": field.grd_id, "grd_score": field.grd_score, "grd_score_to": field.grd_score_to, "quality_point": field.quality_point, 
                "grd_remarks": '<span class="text-uppercase">'+field.grd_remarks+'</span>', "grd_status": '<span class="text-uppercase">'+field.grd_status+'</span>',
                "upt_btn": '<button class="btn btn-icon success" '+SettingUpdateDisabled+' title="Update" onclick="loadData(\'' + field.exmGrade_id + '\')"><i class="ion-android-create"></i></button>'
            });
        });
        $('#tblCoursework').html('');
        $('#tblCoursework').footable({
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

    // list Postgraduate (Research)
    listUndergraduate('003', function(){

        // capaianSetting = load_capaian();
        load_capaian();
        capaianSetting = window.capaianData;
        // console.log(capaianSetting);
        let uptSetting = capaianSetting[1];
    
        if (uptSetting == 0){
            SettingUpdateDisabled = 'disabled';
        }
        else{
            SettingUpdateDisabled = ''; 
        }
 
        let columns = [
            { "name": "grd_id", "title": "Code Grade" },
            { "name": "grd_score", "title": "Marks From", "breakpoints": "md sm xs" },
            { "name": "grd_score_to", "title": "Marks To", "breakpoints": "md sm xs" },
            { "name": "quality_point", "title": "Grade Point" },
            { "name": "grd_remarks", "title": "Remark" },
            { "name": "grd_status", "title": "Status", "breakpoints": "md sm xs" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" }
        ];

        let bil = 1;
        let convertList = JSON.stringify(obj_listUndergraduate.data);
        $("#dataListRsrch").val(convertList);
        let list_data = [];
        
        $.each(obj_listUndergraduate.data, function(i, field){
            list_data.push({
                "bil": bil++, "grd_id": field.grd_id, "grd_score": field.grd_score, "grd_score_to": field.grd_score_to, "quality_point": field.quality_point, 
                "grd_remarks": '<span class="text-uppercase">'+field.grd_remarks+'</span>', "grd_status": '<span class="text-uppercase">'+field.grd_status+'</span>',
                "upt_btn": '<button class="btn btn-icon success" '+SettingUpdateDisabled+' title="Update" onclick="loadData(\'' + field.exmGrade_id + '\')"><i class="ion-android-create"></i></button>'
            });
        });
        $('#tblResearch').html('');
        $('#tblResearch').footable({
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
});
var confirmed = false;


$('#btnBack').click(function(){
    window.location.replace('campusPage.html');
});


function listUndergraduate(id, returnValue){
    var settings = {
        "url": host+"api_exam_picoms/public/misExamGrading/listUndergrad/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_listUndergraduate = response;
        returnValue();
    });
}


//-------------------------------------------------- add Grade --------------------------------------------------//
$('#formGredUndergrad').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Grade",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let grd_id = $('#grd_id').val();
            let grd_category = $('#grd_category').val();
            let grd_status = $('#grd_status').val();
            let grd_score = $('#grd_score').val();
            let grd_score_to = $('#grd_score_to').val();
            let grd_remarks = $('#grd_remarks').val();
            let quality_point = $('#quality_point').val();

            var form = new FormData();
            form.append("grd_id", grd_id);
            form.append("grd_category", grd_category);
            form.append("grd_score", grd_score);
            form.append("grd_score_to", grd_score_to);
            form.append("grd_status", grd_status);
            form.append("grd_remarks", grd_remarks);
            form.append('quality_point', quality_point);
            form.append("recordstatus", "ADD");

            var settings = {
                "url": host+"api_exam_picoms/public/misExamGrading/register",
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
//-------------------------------------------------- end add Grade --------------------------------------------------//


// display data Grade
function loadData(indexs){
    var settings = {
        "url": host+"api_exam_picoms/public/misExamGrading/show/"+indexs,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_data = response.data;
        $('#pk_id').val(obj_data.pk_id);
        $('#upt_grd_category').val(obj_data.category);
        $('#upt_grd_id').val(obj_data.grd_id);
        $('#upt_grd_status').val(obj_data.grd_status);
        $('#upt_grd_score').val(obj_data.grd_score);
        $('#upt_grd_score_to').val(obj_data.grd_score_to);
        $('#upt_quality_point').val(obj_data.quality_point);
        $('#upt_grd_remarks').val(obj_data.grd_remarks);
    });

    $('#divAdd').addClass('collapse');
    $('#divUpdate').removeClass('collapse');
}


$('#btnCancel').click(function(){
    $('#divAdd').removeClass('collapse');
    $('#divUpdate').addClass('collapse');
})


//-------------------------------------------------- update Grading --------------------------------------------------//
$('#formUptUndergrad').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Grade",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            pk_id = $('#pk_id').val();
            grd_id = $('#upt_grd_id').val();
            quality_point = $('#upt_quality_point').val();
            grd_status = $('#upt_grd_status').val();
            grd_score = $('#upt_grd_score').val();
            grd_score_to = $('#upt_grd_score_to').val();
            grd_remarks = $('#upt_grd_remarks').val();

            var form = new FormData();
            form.append("pk_id", pk_id);
            form.append("grd_id", grd_id);
            form.append("quality_point", quality_point);
            form.append("grd_score", grd_score);
            form.append("grd_score_to", grd_score_to);
            form.append("grd_status", grd_status);
            form.append("grd_remarks", grd_remarks);
            form.append("recordstatus", "EDT");

            var settings = {
                "url": host+"api_exam_picoms/public/misExamGrading/update",
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
                let result = JSON.parse(response);
                if(result.success){
                    window.location.reload();
                }
                else{ swal("Failed", response.message, "error"); }
            });
        });
    }
});
//-------------------------------------------------- end update Grading --------------------------------------------------//

// function del_rekod(id){
$('#btnDelete').click(function(){
    let id = $('#pk_id').val();

    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("pk_id", id);

    swal({
        title: "Remove Grading",
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
            "url": host+"api_exam_picoms/public/misExamGrading/delete",
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
})


// function qualityPoint(returnValue){
//     var settings = {
//         "url": host+"api_exam_picoms/public/misQualityPoint/list",
//         "method": "GET",
//         "timeout": 0,
//     };

//     $.ajax(settings).done(function (response){
//         obj_quaPoint = response;
//         returnValue();
//     });
// }

function grdCategory(returnValue){
    var settings = {
        "url": host+"api_exam_picoms/public/grdCategory/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_grdCategory = response;
        returnValue();
    });
}

function grdCode(returnValue){
    var settings = {
        "url": host+"api_public_access/public/gradeList",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_grdCode = response;
        returnValue();
    });
}
