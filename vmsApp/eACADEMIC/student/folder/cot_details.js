

$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let pgmDet_id = window.sessionStorage.pgmDet_id;
    let clg_id = window.sessionStorage.idPage;

    $("#tblCourse").html('');

    // data program
    cotDetails(pgmDet_id, function(){
        $('#pk_id').val(data.dtp_id);
        $('#pgmName').html(data.pgm_name.toUpperCase());
        $('#cotYearno').html(data.dtp_year);
        $('#cotIntake').html(data.dtp_intake);
        $('#cotCategory').html(data.pgm_mode.toUpperCase());
    });

    // select course
    courseList(clg_id, function(){
        $('#crs_code').append('<option value="">- Choose -</option>');
        $('#crs_code_upt').append('<option value="">- Choose -</option>');
        $.each(obj_course.data, function(i, item){
            $('#crs_code').append('<option value="'+item.pk_id+'">'+item.crs_code+' - '+item.crs_name+'</option>');
            $('#crs_code_upt').append('<option value="'+item.pk_id+'">'+item.crs_code+' - '+item.crs_name+'</option>');
        });
    });

    // select decision
    prereqDecision(function(){
        $('#ccd_prerequisite').append('<option value="">- Choose -</option>');
        $('#ccd_prerequisite_upt').append('<option value="">- Choose -</option>');
        $.each(obj_decision.data, function (i, item){
            $('#ccd_prerequisite').append('<option value="'+item.decision_name+'">'+item.decision_name+'</option>');
            $('#ccd_prerequisite_upt').append('<option value="'+item.decision_name+'">'+item.decision_name+'</option>');
        });
    });

    // semester list for tab
    semesterTab(pgmDet_id, function(){
        $('#navTabs').html('');
        $('#tabContent').html('');

        $.each(obj_semList, function(i, item){

            let semester = item.cot_semester;
            let activeTab = '';
            if(i == 0){ activeTab = 'active' }
            let tab = '<li class="nav-item">'+
                            '<a class="nav-link '+activeTab+'" href="#" data-toggle="tab" data-target="#tabsem'+semester+'">Semester '+semester+'</a>'+
                        '</li>';
            $('#navTabs').append(tab);

            let tabContent = '<div class="tab-pane animated fadeIn text-muted '+activeTab+'" id="tabsem'+semester+'">'+
                                '<textarea class="hidden" id="dataList'+semester+'"></textarea>'+
                                '<table class="table m-b-none" id="tblCourse'+semester+'"></table>'+
                            '</div>';
            $('#tabContent').append(tabContent);

            $("#tblCourse"+semester).html('');

            // Course list
            cotDetList(pgmDet_id, semester, function(){
                var columns = [
                    { "name": "bil", "title": "No." },
                    { "name": "crs_code", "title": "Course" },
                    { "name": "ccd_prerequisite", "title": "Pre-requisite" },
                    { "name": "ccd_prerequisite_crs", "title": "Pre-requisite Course" },
                    { "name": "cot_semester", "title": "Semester" },
                    { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
                ];

                let bil = 1;
                let convertList = JSON.stringify(obj_cotDetList);
                $("#dataList"+semester).val(convertList);
                var list = [];
            
                $.each(obj_cotDetList, function (j, itemJ){
                    let ccd_prerequisite_crs = itemJ.ccd_prerequisite_crs;
                    let ccdPrerequisiteCrs = itemJ.preCrsCode+' - '+itemJ.preCrsName;
                    let crsCode = itemJ.crsCode.toUpperCase()+' - '+itemJ.crsName.toUpperCase();

                    if(ccd_prerequisite_crs == null || ccd_prerequisite_crs == ''){
                        ccdPrerequisiteCrs = '';
                    }

                    list.push({
                        bil: bil++, crs_code: crsCode, ccd_prerequisite: itemJ.ccd_prerequisite.toUpperCase(), cot_semester: itemJ.cot_semester, ccd_prerequisite_crs: ccdPrerequisiteCrs.toUpperCase(),
                        upt_btn: '<button class="btn btn-icon success" title="Update" onclick="loadData(\'' + semester + '\',\'' + j + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button>'+
                                ' <button class="btn btn-icon danger" title="Remove" onclick="del(\'' + itemJ.ccd_id + '\')"><i class="ion-trash-b"></i>'
                    });
                });
            
                $("#tblCourse"+semester).footable({
                    "columns": columns,
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
    });

    

});
var confirmed = false;

// btn Back to admin page
$('#btnBack').click(function(){
    window.location.replace('adminPage.html');
    window.sessionStorage.removeItem('pgmDet_id');
});


//-------------------------------------------------- add details --------------------------------------------------//
$("#formAddDetails").on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Course",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let pgm_id = $("#pk_id").val();
            let crs_code = $("#crs_code").val();
            let ccd_prerequisite = $("#ccd_prerequisite").val();
            let ccd_prerequisite_crs = $("#ccd_prerequisite_crs").val();
            let cot_semester = $("#cot_semester").val();

            var form = new FormData();
            form.append("pgm_id", pgm_id);
            form.append("crs_code", crs_code);
            form.append("ccd_prerequisite", ccd_prerequisite);
            form.append("ccd_prerequisite_crs", ccd_prerequisite_crs);
            form.append("cot_semester", cot_semester);
            form.append("recordstatus", "ADD");

            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmCrsCOTDet/register",
                "method": "POST",
                "timeout": 0,
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
//-------------------------------------------------- end add details --------------------------------------------------//


function loadData(sem, indexs){
    let data = JSON.parse($("#dataList"+sem).val());
    let value = data[indexs];

    $('#ccd_id').val(value.ccd_id);
    $('#crs_code_upt').val(value.crs_code);
    $('#ccd_prerequisite_upt').val(value.ccd_prerequisite);
    $('#cot_semester_upt').val(value.cot_semester);

    getData(value.crs_code, function(){
        if(obj_getData.length > 0){
            $('#ccd_prerequisite_crs_upt').append('<option value="">- Choose -</option>');
            $.each(obj_getData, function (i, item){
                $('#ccd_prerequisite_crs_upt').append('<option value="'+item.pk_id+'">'+item.crs_code+' - '+item.crs_name+'</option>');
            });
            $('#ccd_prerequisite_crs_upt').val(value.ccd_prerequisite_crs);
            $('#ccd_prerequisite_crs_upt').attr('disabled',false);
            $('#ccd_prerequisite_upt').attr('disabled',false);
            $('#ccd_prerequisite_upt').val('Yes').trigger('change');
        }
        else{
            $('#ccd_prerequisite_crs_upt').attr('disabled',true);
            $('#ccd_prerequisite_crs_upt').append('<option value="">- No data -</option>');
            $('#ccd_prerequisite_upt').attr('disabled',true);
            $('#ccd_prerequisite_upt').val('No').trigger('change');
        }
    });
    $("#updatePerincian").modal("show");
}


//-------------------------------------------------- update details --------------------------------------------------//
$("#formUpdateDetails").on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Course",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let ccd_id = $("#ccd_id").val();
            let crs_code = $("#crs_code_upt").val();
            let ccd_prerequisite = $("#ccd_prerequisite_upt").val();
            let ccd_prerequisite_crs = $("#ccd_prerequisite_crs_upt").val();
            let cot_semester = $("#cot_semester_upt").val();

            var form = new FormData();
            form.append("ccd_id", ccd_id);
            form.append("crs_code", crs_code);
            form.append("ccd_prerequisite", ccd_prerequisite);
            form.append("ccd_prerequisite_crs", ccd_prerequisite_crs);
            form.append("cot_semester", cot_semester);
            form.append("recordstatus", "EDT");

            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmCrsCOTDet/update",
                "method": "POST",
                "timeout": 0,
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
//-------------------------------------------------- end update details --------------------------------------------------//


// delete detail
function del(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("ccd_id", id);

    swal({
        title: "Remove Course",
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
            "url": host+"api_tetapan_picoms/public/misPrmCrsCOTDet/delete",
            "method": "POST",
            "timeout": 0,
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


function cotDetails(id, returnValue){
    var settings = {
        "url": host + "api_tetapan_picoms/public/misPrmProgDet/show/"+id,
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        data = response.data;
        returnValue();
    });
}

function semesterTab(id, returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmCrsCOTDet/groupBySem/"+id,
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_semList = response.data;
        returnValue();
    });
}

function cotDetList(id, semester, returnValue){
    var form = new FormData();
    form.append("pgm_id", id);
    form.append("cot_semester", semester);

    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmCrsCOTDet/listByPgm",
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
    };

    $.ajax(settings).done(function (response){
        let result = JSON.parse(response);
        obj_cotDetList = result.data;
        returnValue();
    });
}

// onchange update academic session
function selAcaSessionUpt(data){
    let opt = data.options[data.selectedIndex];
    let intake = opt.dataset.intake
    let sem = opt.dataset.sem

    $('#upt_intake_name').val(intake);
    $('#upt_semester_name').val(sem);
}

function acaSession(returnValue){
    var settings = {
        "url": host + "api_tetapan_picoms/public/misPrmCuryear/selectCurYear",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        obj_acaSession = response;
        returnValue();
    });
}

function studyScheme(returnValue){
    var settings = {
       "url": host + "api_tetapan_picoms/public/modeList",
       "method": "GET",
       "timeout": 0,
   };

   $.ajax(settings).done(function (response) {
       obj_studScheme = response;
       returnValue();
   });
}

function semTypeList(returnValue){
   var settings = {
       "url": host + "api_tetapan_picoms/public/semtypeList",
       "method": "GET",
       "timeout": 0,
   };

   $.ajax(settings).done(function (response) {
       obj_semType = response;
       returnValue();
   });
}

function courseList(id, returnValue){
    var settings = {
        "url": host + "api_tetapan_picoms/public/misPrmCourse/selectCrs/"+id,
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_course = response;
        returnValue();
    });
}

function prereqDecision(returnValue){
    var settings = {
        "url": host + "api_tetapan_picoms/public/decisionList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        obj_decision = response;
        returnValue();
    });
}

//-------------------------------------------------- onchange select course --------------------------------------------------//
function getprerequisite(data){
    $('#ccd_prerequisite_crs').html('');
    let id = data.value;

    getData(id, function(){
        if(obj_getData.length > 0){
            $('#ccd_prerequisite_crs').append('<option value="">- Choose -</option>');
            $.each(obj_getData, function (i, item){
                $('#ccd_prerequisite_crs').append('<option value="'+item.pk_id+'">'+item.crs_code+' - '+item.crs_name+'</option>');
            });
            $('#ccd_prerequisite_crs').attr('disabled',false);
            $('#ccd_prerequisite').attr('disabled',false);
            $('#ccd_prerequisite').val('Yes').trigger('change');
        }
        else{
            $('#ccd_prerequisite_crs').attr('disabled',true);
            $('#ccd_prerequisite_crs').append('<option value="">- No data -</option>');
            $('#ccd_prerequisite').attr('disabled',true);
            $('#ccd_prerequisite').val('No').trigger('change');
        }
    });
}

function getprerequisiteUpt(data){
    $('#ccd_prerequisite_crs_upt').html('');
    let id = data.value;

    getData(id, function(){
        if(obj_getData.length > 0){
            $('#ccd_prerequisite_crs_upt').append('<option value="">- Choose -</option>');
            $.each(obj_getData, function (i, item){
                $('#ccd_prerequisite_crs_upt').append('<option value="'+item.pk_id+'">'+item.crs_code+' - '+item.crs_name+'</option>');
            });
            $('#ccd_prerequisite_crs_upt').attr('disabled',false);
            $('#ccd_prerequisite_upt').attr('disabled',false);
            $('#ccd_prerequisite_upt').val('Yes').trigger('change');
        }
        else{
            $('#ccd_prerequisite_crs_upt').attr('disabled',true);
            $('#ccd_prerequisite_crs_upt').append('<option value="">- No data -</option>');
            $('#ccd_prerequisite_upt').attr('disabled',true);
            $('#ccd_prerequisite_upt').val('No').trigger('change');
        }
    });
}

function getData(idGet, returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmCourseDet/list/"+idGet,
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_getData = response.data;
        returnValue();
    });
}
//-------------------------------------------------- end onchange select course --------------------------------------------------//


//-------------------------------------------------- onchange select decision --------------------------------------------------//
function decision(data){
    let decision = data.value;

    if(decision == 'Yes'){
        $('#ccd_prerequisite_crs').attr('required',true);
    }
    else{
        $('#ccd_prerequisite_crs').attr('required',false);
        $('#ccd_prerequisite_crs').val('').trigger('change');
    }
}

function decisionUpt(data){
    let decision = data.value;

    if(decision == 'Yes'){
        $('#ccd_prerequisite_crs_upt').attr('required',true);
    }
    else{
        $('#ccd_prerequisite_crs_upt').attr('required',false);
        $('#ccd_prerequisite_crs_upt').val('').trigger('change');
    }
}
//-------------------------------------------------- end onchange select decision --------------------------------------------------//