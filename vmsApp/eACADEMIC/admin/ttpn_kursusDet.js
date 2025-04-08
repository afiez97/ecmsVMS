$(function(){
    $.ajaxSetup ({
        cache: false
    });

    $.fn.select2.defaults.set( "theme", "bootstrap" );

    let course_id = window.sessionStorage.course_id;
    $('#pk_id').val(course_id);

    displayAllCloByCourse();
    CLODetail();
    mappingPloClo()
    $("#tblPrerequisite").html('');

    courseDetails(course_id, function(){
        let data = obj_crsShow.data;

        // select faculty
        getFaculty(function(){
            $('#upt_fac_id').append('<option value="">- Choose -</option>');
            $.each(obj_getFaculty.data, function (i, item){
                $('#upt_fac_id').append('<option value="'+item.pk_id+'">'+item.fac_id+'</option>');
            });
            $('#upt_fac_id').val(data.fk_faculty);

            $('.slct2').select2({
                width: "100%",
                containerCssClass: ':all:',
            });
        });

        // select status
        statusList(function(){
            $('#upt_crs_status').append('<option value="">- Choose -</option>');
            $.each(obj_status.data, function (i, item) {
                $('#upt_crs_status').append('<option value="'+item.status_name+'">'+item.status_name+'</option>');
            });
            $('#upt_crs_status').val(data.crs_status);
        });
        
        $('#title').html(data.crs_name);
        $('#fac_id').html(data.fac_name);
        $('#crs_code').html(data.crs_code);
        $('#crs_name').html(data.crs_name);
        $('.courseNameClo').html(' for course - '+data.crs_name);
        $('#crs_credit').html(data.crs_credit);
        $('#crs_price').html(data.crs_price);
        $('#crs_price_usd').html(data.crs_price_usd);
        $('#crs_status').html(data.crs_status);
        if(data.counted_cgpa == 'Yes'){
            $('#counted_cgpa').html('***COUNTED CGPA');
            $('#upt_chkCGPA').prop('checked',true);
        }
        else{ $('#upt_chkCGPA').prop('checked',false); }

        $('#upt_crs_code').val(data.crs_code);
        $('#upt_crs_name').val(data.crs_name);
        $('#upt_crs_credit').val(data.crs_credit);
        $('#upt_crs_price').val(data.crs_price);
        $('#upt_crs_price_usd').val(data.crs_price_usd);
    });

    // select pre-requisite
    courseList(function(){
        $('#ccd_prerequisite_crs').append('<option value="">- Choose -</option>');
        $.each(obj_course.data, function (i, item){
            if(item.crsId != course_id){
                $('#ccd_prerequisite_crs').append('<option value="'+item.crsId+'">'+item.crs_code.toUpperCase()+'</option>');
            }
        });

        $('.slct2').select2({
            width: "100%",
            containerCssClass: ':all:',
        });
    });

    // Pre-requisite course list
    prereqList(course_id, function(){

        // capaianSetting = load_capaian();
        load_capaian();
        capaianSetting = window.capaianData;
        // console.log(capaianSetting);
        let delSetting = capaianSetting[2];

        if (delSetting == 0){
            SettingDelDisabled = 'disabled';
        }
        else{
            SettingDelDisabled = ''; 
        }

        var columns = [
            { "name": "bil", "title": "No." },
            { "name": "crs_code", "title": "Course Code" },
            { "name": "crs_name", "title": "Course Name" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];

        let bil = 1;
        var list = [];

        $.each(obj_preReqList, function (i, item){
            list.push({
                bil: bil++, crs_code: '<span class="text-uppercase">'+item.crs_code+'</span>', crs_name: '<span class="text-uppercase">'+item.crs_name+'</span>',
                upt_btn: ' <button class="btn btn-icon danger" '+SettingDelDisabled+' title="Remove" onclick="del(\'' + item.crsDet_id + '\')"><i class="ion-trash-b"></i>'
            });
        });
    
        $("#tblPrerequisite").footable({
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
    })
});
var confirmed = false;

// btn Back to Course List
$('#btnBack').click(function(){
    window.location.replace('ttpn_kursus.html');
});


// open add new
$('#btnNewRecord').click(function(){
    $('#formAddPrerequisite')[0].reset();
    $('#divAddNew').removeClass('collapse');
});
$('#btnClose').click(function(){
    $('#divAddNew').addClass('collapse');
});


//-------------------------------------------------- update course --------------------------------------------------//
$("#formUptCourse").on('submit', function(e){
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
            let pk_id = $("#pk_id").val();
            let upt_fac_id = $("#upt_fac_id").val();
            let upt_crs_name = $("#upt_crs_name").val();
            let upt_crs_credit = $("#upt_crs_credit").val();
            let upt_crs_price = $("#upt_crs_price").val();
            let upt_crs_price_usd = $("#upt_crs_price_usd").val();
            let upt_crs_status = $("#upt_crs_status").val();
            let counted_cgpa = '';
            if($('#upt_chkCGPA').prop('checked') == true){ counted_cgpa = 'Yes'; }
            else{ counted_cgpa = 'No' }

            var form = new FormData();
            form.append("pk_id", pk_id);
            form.append("fac_id", upt_fac_id);
            form.append("crs_name", upt_crs_name);
            form.append("crs_credit", upt_crs_credit);
            form.append("crs_price", upt_crs_price);
            form.append("crs_price_usd", upt_crs_price_usd);
            form.append("crs_status", upt_crs_status);
            form.append("counted_cgpa", counted_cgpa);
            form.append("recordstatus", "EDT");

            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmCourse/update",
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
//-------------------------------------------------- end update course --------------------------------------------------//


// delete Course
$('#btnDelete').click(function(){
    let id = $('#pk_id').val();
    
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("pk_id", id);

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
            "url": host+"api_tetapan_picoms/public/misPrmCourse/delete",
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
            window.location.replace('ttpn_kursus.html');
        });
    });
});


//-------------------------------------------------- add Pre-requisite Course --------------------------------------------------//
$("#formAddPrerequisite").on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Pre-requisite Course",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let crs_id = $("#pk_id").val();
            let prerequisite = $("#ccd_prerequisite_crs").val();

            var form = new FormData();
            form.append("crs_id", crs_id);
            form.append("prerequisite", prerequisite);
            form.append("recordstatus", "ADD");

            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmCourseDet/register",
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
//-------------------------------------------------- end add Pre-requisite Course --------------------------------------------------//


// delete Pre-requisite Course
function del(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("pk_id", id);

    swal({
        title: "Remove Pre-requisite Course",
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
            "url": host+"api_tetapan_picoms/public/misPrmCourseDet/delete",
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


function courseDetails(id, returnValue){
    var settings = {
        "url": host + "api_tetapan_picoms/public/misPrmCourse/show/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_crsShow = response;
        returnValue();
    });
}

function prereqList(id, returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmCourseDet/list/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_preReqList = response.data;
        returnValue();
    });
}

function checkId(data){
    let prereq = data.value;
    let crsId = $('#pk_id').val();

    var form = new FormData();
    form.append("crs_id", crsId);
    form.append("prereq", prereq);

    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmCourseDet/checkId",
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

        if(result.data != ''){
            $('#check').html('Data Already Exists');
            $('#btnSubmit').prop('disabled', true);
        }
        else{
            $('#check').html('');
            $('#btnSubmit').prop('disabled', false);
        }
    });
}

// All Function CLO start here
$('#formAddCLO').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add CLO",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let clo_level = $('#clo_level').val().toUpperCase();
            let course_id = window.sessionStorage.course_id;
            let clo_statement = $('#clo_statement').val();
            let clo_SLTCI = $('#clo_SLTCI').val();

            var form = new FormData();
            form.append("clo_level", clo_level);
            form.append("clo_statement", clo_statement);
            form.append("FK_course", course_id);
            form.append("SLT_CI", clo_SLTCI);

            var settings = {
                "url": host+"api_tetapan_picoms/public/obe/clo/create",
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

function CLObyCourse(returnValue){
    
    var settings = {
        "url": host+"api_tetapan_picoms/public/obe/clo_ByCourse/show/"+window.sessionStorage.course_id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_CLObyCourse = response.data;
        returnValue();
    });
}


function displayAllCloByCourse(){

    let prog_id = window.sessionStorage.prog_id;


    $("#obeTable").html('');
// alert();
CLObyCourse( function(){

    // capaianSetting = load_capaian();
    load_capaian();
    capaianSetting = window.capaianData;
    // console.log(capaianSetting);
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
            { "name": "clo_level", "title": "CLO Level" },
            { "name": "clo_statement", "title": "Statement" },
            { "name": "SLT_CI", "title": "SLT CI" },
            // ,
            { "name": "upt_btn", "title": "Action",'class':"text-center", "breakpoints": "md sm xs" }
        ];
        var list2 = [];
        let bil = 1;
        let convertCLOcourse = JSON.stringify(obj_CLObyCourse);
        $("#ListCLOKurus").val(convertCLOcourse);
        $.each(obj_CLObyCourse, function(i, item){
            
            list2.push({
                bil: bil++, 
                clo_level: item.clo_level, 
                clo_statement: item.clo_statement,
                SLT_CI: item.SLT_CI,
                upt_btn:  '  <button class="btn btn-icon success" '+SettingUpdateDisabled+' title="Update" onclick="upd_clo(\'' +i+ '\')"><i class="ion-android-create"></i></button> '+
                            '<button class="btn btn-icon danger" '+SettingDelDisabled+' title="Remove" onclick="delCLO(\''+item.id_clo+'\')"><i class="ion-trash-b" ></i></button>'
            });
        });

        $("#CLOTablebyCourse").footable({
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

//-------------------------------------------------- delete session --------------------------------------------------//
function delCLO(id_clo){
    var form = new FormData();
    form.append("id_clo", id_clo);

    swal({
        title: "Remove CLO Details",
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
            "url": host+"api_tetapan_picoms/public/obe/clo/delete",
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



function upd_clo(indexs){

    let data = JSON.parse($("#ListCLOKurus").val());
    data = data[indexs];

    $('#id_clo').val(data.id_clo);
    $('#upd_clo_level').val(data.clo_level);
    $('#upd_clo_statement').val(data.clo_statement);
    $('#upt_clo_SLTCI').val(data.SLT_CI);
    
    $("#mdlUptObe_clo").modal("show");
}



$("#mdlUptObe_clo").on('submit', function(e){
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
            let id_clo = $("#id_clo").val();
            let upd_clo_level = $("#upd_clo_level").val();
            let upd_clo_statement = $("#upd_clo_statement").val();
            let upt_clo_SLTCI = $("#upt_clo_SLTCI").val();
 
            var form = new FormData();
            form.append("id_clo", id_clo);
            form.append("clo_level", upd_clo_level);
            form.append("clo_statement", upd_clo_statement);
            form.append("SLT_CI", upt_clo_SLTCI);
            form.append("recordstatus", 'EDT');
            console.log(form);
            var settings = {
                "url": host+"api_tetapan_picoms/public/obe/clo/update",
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

function CLODetail(returnValue) {

    var form = new FormData();
    form.append("FK_course", window.sessionStorage.course_id);

    var settings = {
        "url": host + "api_tetapan_picoms/public/obe/clo_ByCourse/showCourseDet2",
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
        result = JSON.parse(response);
        console.log(result.data);

        if (result.data != '') {
            var columns = [
                { "name": "CLO", "title": "CLO" },
                { "name": "SLT_CI", "title": "SLT CI" },
                { "name": "A_contact_perHour", "title": "% (A)" },
                { "name": "assesment_weightage", "title": "Weightage" ,'class':"text-center", "breakpoints": "md sm xs"},
                { "name": "SLT_Assessment", "title": "SLT Assessment",'class':"text-center", "breakpoints": "md sm xs" },
                { "name": "B_totalHourSLT", "title": "% (B)" ,'class':"text-center", "breakpoints": "md sm xs"},
                { "name": "ab", "title": "A-B %" ,'class':"text-center", "breakpoints": "md sm xs"},
            ];

            var list2 = [];
            let bil = 1;
            let convertCLOcourse = JSON.stringify(result.data);
            let totalSLTCI = JSON.stringify(result.data2);
            let total_assSLT = JSON.stringify(result.data3);
            console.log(total_assSLT);
            $("#ListCLODetail").val(convertCLOcourse);
            var Tassesment_weightage = 0;
            var TSLT_Assessment = 0;
            var TassSLT_Assessment = 0;
            var TSLT_CI = 0;
            var TotalPercentAVal = 0;
            var TotalSLT = 0;
            var TotalPercentWeight =0;

            //Total SLT CI from Controller
            var TotalSLT_CI = parseFloat(result.data2);
            
            $.each(result.data, function (j, value) {
                
                //Total weightage & Percentage of B 
                var totalWeightageVal = parseFloat(value.total_weightage);
                Tassesment_weightage += totalWeightageVal;

                //Total Assasement
                var totalSLT_AssessmentVal = parseFloat(value.total_SLT);
                var totalAssSLT_AssessmentVal = parseFloat(value.total_assSLT);
                TSLT_Assessment += totalSLT_AssessmentVal;
                TassSLT_Assessment += totalAssSLT_AssessmentVal;

                //Total SLT CI
                var totalSLT_CIVal = parseFloat(value.SLT_CI);
                TSLT_CI += totalSLT_CIVal;
                

                var PercentAVal = ((totalSLT_CIVal/ TotalSLT_CI) * 100);
                PercentAVal = PercentAVal.toFixed(1);
                TotalPercentAVal += parseFloat(PercentAVal);

                // var PercentAVal2 = ((value.total_assSLT/ total_assSLT) * 100);
                total_weightage = value.sum_total_weightage.toFixed(1);
                TotalPercentWeight += parseFloat(value.sum_total_weightage);

                //Total A-B %
                AVal = PercentAVal - parseFloat(total_weightage);

                list2.push({
                    CLO: value.clo_level,
                    SLT_CI: `<p class="text-center">`+value.SLT_CI+`</p>`,
                    A_contact_perHour: `<p class="text-center">`+PercentAVal+`</p>`,
                    assesment_weightage: `<p class="text-center">`+total_weightage+`</p>`,
                    // SLT_Assessment:  `<p class="text-center">`+Math.round(value.total_SLT)+`</p>`,
                    SLT_Assessment:  `<p class="text-center">`+value.total_assSLT+`</p>`,
                    B_totalHourSLT: `<p class="text-center">`+total_weightage+`</p>`,
                    ab: `<p class="text-center">`+AVal.toFixed(1)+`</p>`,
                    // Math.round(
                });

                   // Add the total row
                if(result.data.length == (j+1)){
                    list2.push({
                    CLO: `<strong>TOTAL</strong>`,
                    SLT_CI: `<p class="text-center"><b>`+TSLT_CI+`</b></p>`,
                    A_contact_perHour: `<p class="text-center"><b>`+TotalPercentAVal.toFixed(0)+`</b></p>`,
                    assesment_weightage: `<p class="text-center"><b>`+Math.round(TotalPercentWeight)+`</b></p>`,
                    // SLT_Assessment:`<p class="text-center"><b>`+Math.round(TSLT_Assessment)+`</b></p>`,
                    SLT_Assessment:`<p class="text-center"><b>`+TassSLT_Assessment+`</b></p>`,
                    B_totalHourSLT: `<p class="text-center"><b>`+Math.round(TotalPercentWeight)+`</b></p>`,
                    ab: ``,
                    // CLO: `<p class="text-center">`+AVal.toFixed(1)+`</p>`,
                    point:`<p class="text-center"><b>`+TotalSLT_CI+`</b></p>`,
                    });
                }

                //Last row to display TOTAL SLT CI
                if(result.data.length == (j+1)){

                    TotalSLT_CI = TSLT_CI + TassSLT_Assessment;
                    list2.push({
                    CLO: `<strong>TOTAL SLT CI</strong>`,
                    SLT_CI: ``,
                    A_contact_perHour: ``,
                    assesment_weightage: `<p class="text-center"><b>`+TotalSLT_CI+`</b></p>`,
                    SLT_Assessment: ``,
                    B_totalHourSLT: ``,
                    ab: ``,
                    
                    });
                }
            });


            $("#detailCLO").footable({
                "columns": columns,
                "rows": list2,
                "paging": {
                    "enabled": true,
                    "size": 10,
                    "countFormat": "Showing {PF} to {PL} of {TR} data"
                },

            });

        }
        else {

        }

        returnValue();
    });
}

// start Mapping

function mappingPloClo(){


    CLODetail( function(){

        var listCLO = [];
        let bilClo = 1;
        let convertCLOlist = JSON.stringify(result.data);
        $("#CLOlist").val(convertCLOlist);
        $.each(result.data, function( index, value ) {
            listCLO.push({
                name: 'clo_level_'+bilClo++, 
                title: value.clo_level, 
                          });
          });
    
          var list2 = [];
          let bil = 1;
          let convertCLOcourse = JSON.stringify(result.data);
          $("#ListCLODetail").val(convertCLOcourse);

          $.each(result.data, function (index, value) {
              list2.push({
                  CLO: value.clo_level,
                  SLT_CI: '',
                  A_contact_perHour: '',
                  assesment_weightage: '',
                  SLT_Assessment: '',
                  B_totalHourSLT: '',
                  ab: '',
              });
          });
  
        $("#mappingList").footable({
            "columns": listCLO,
            "rows": list2,
            "paging": {
                "enabled": true,
                "size": 10,
                "countFormat": "Showing {PF} to {PL} of {TR} data"
            },
           
        });
    })


}
// end mapping Mapping
// All Function CLO end here
