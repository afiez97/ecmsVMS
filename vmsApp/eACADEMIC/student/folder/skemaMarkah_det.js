let gs_id = window.sessionStorage.gs_id;

$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let gs_id = window.sessionStorage.gs_id;

    $("#listSkemaDet").html('');

    gradeSchemeDet(gs_id, function(){
        // select course
        // courseList(clg_id, function(){
        //     $('#upt_gsc_name').append('<option value="">- Choose -</option>');
        //     $.each(obj_course.data, function(i, item){
        //         $('#upt_gsc_name').append('<option value="'+item.pk_id+'">'+item.crs_code.toUpperCase()+' '+item.crs_name.toUpperCase()+'</option>');
        //     });
        //     $('#upt_gsc_name').val(data.gsc_name);
        // });

        $('#gsc_id').val(data.gsc_id);
        $('#crs_code_view').html(data.crs_code.toUpperCase());
        $('#crs_name').html(data.crs_name.toUpperCase());
        $('#fac_name').html(data.fac_name.toUpperCase());
    });

    // select exam type
    examType(function(){
        $('#gsd_exam_type').append('<option value="">- Choose -</option>');
        $('#upt_gsd_exam_type').append('<option value="">- Choose -</option>');
        $.each(obj_examType.data, function (i, item) {
            $('#gsd_exam_type').append('<option value="'+item.gsd_exam_type+'">'+item.gsd_exam_type+'</option>');
            $('#upt_gsd_exam_type').append('<option value="'+item.gsd_exam_type+'">'+item.gsd_exam_type+'</option>');
        });
    })

    // details list
    detailsList(gs_id, function(){
        var columns = [
            { "name": "bil", "title": "No." },
            { "name": "gsd_exam_type", "title": "Items" },
            { "name": "gsd_component", "title": "Component" },
            { "name": "gsd_percentage", "title": "Percentage (%)" },
            { "name": "upt_btn", "title": "Action", 'class': "text-center", "breakpoints": "md sm xs" }
        ];

        var list = [];
        let bil = 1;
        let convertDetList = JSON.stringify(obj_detList);
        $("#dataDetailList").val(convertDetList);

        $.each(obj_detList, function (i, field) {
            list.push({
                "bil": bil++, "gsd_exam_type": field.gsd_exam_type, "gsd_component": field.gsd_component, "gsd_percentage": field.gsd_percentage,
                "upt_btn": '<button class="btn btn-icon success" title="Update" onclick="loadDataDetail(\'' + i + '\')"data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button> ' +
                            '<button class="btn btn-icon danger" title="Remove" onclick="del_rekod(\''+field.gsd_id+'\')"><i class="ion-trash-b"></i></button>'
            });
        });
        
        $("#listSkemaDet").footable({
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
var confirmed = false;

// btn Back to admin page
$('#btnBack').click(function(){
    window.location.replace('adminPage.html');
    window.sessionStorage.removeItem('gs_id');
});


// update grading scheme
// $("#formUptGredScheme").on('submit', function (e){
//     if(!confirmed){
//         e.preventDefault();
//         swal({
//             title: "Update Grading Scheme",
//             text: "Are You Sure?",
//             type: "question",
//             showCancelButton: true,
//             confirmButtonText: "Update",
//             confirmButtonColor: "#22b66e",
//             closeOnConfirm: true,
//             allowOutsideClick: false,
//             html: false
//         }).then(function (){
//             let upt_gsc_name = $("#upt_gsc_name").val();
//             let upt_gsc_id = $("#upt_gsc_id").val();

//             var form = new FormData();
//             form.append("gsc_name", upt_gsc_name);
//             form.append("gsc_id", upt_gsc_id);
//             form.append("recordstatus", "EDT");

//             var settings = {
//                 "url": host+"api_tetapan_picoms/public/misPrmGredScheme/update",
//                 "method": "POST",
//                 "timeout": 0,
//                 "processData": false,
//                 "mimeType": "multipart/form-data",
//                 "contentType": false,
//                 "data": form
//             };
    
//             $.ajax(settings).done(function (response){
//                 result = JSON.parse(response);
//                 if (!result.success) {
//                     Swal(result.message, result.data, "error");
//                     return;
//                 }
//                 window.location.reload();
//             });
//         });
//     }
// });


//  delete grading scheme
$('#btnDelete').click(function (){
    let id = $('#gsc_id').val();

    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("gsc_id", id);

    swal({
        title: "Remove Grading Scheme",
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
            "url": host+"api_tetapan_picoms/public/misPrmGredScheme/delete",
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
            window.location.replace('adminPage.html');
        });
    });
});


//-------------------------------------------------- add details --------------------------------------------------//
var RegisterModelDetail = function (){
    var self = this;

    self.gsd_exam_type = ko.observable("").extend({
        required: true,
    });

    self.gsd_component = ko.observable("").extend({
        required: true
    });

    self.gsd_percentage = ko.observable("").extend({
        required: true
    });

    self.regDetProgramme = function (){
        let gsc_id = $('#gsc_id').val();
        var error = ko.validation.group(self);

        if (error().length > 0) {
            error.showAllMessages();
            return;
        }

        var form = new FormData();
        form.append("gsc_id", gsc_id);
        form.append("gsd_exam_type", self.gsd_exam_type());
        form.append("gsd_component", self.gsd_component());
        form.append("gsd_percentage", self.gsd_percentage());
        form.append("recordstatus", 'ADD');

        swal({
            title: "Add Grading Scheme Details",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmDetGredScheme/register",
                "method": "POST",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form
            };

            $.ajax(settings).done(function (response) {
                console.log(response);
                result = JSON.parse(response);
                if (!result.success) {
                    Swal(result.message, result.data, "error");
                    return;
                }
                window.location.reload();
            });
        });
    };
}
const RegisterdetProgram = document.querySelector("#details");
ko.applyBindings(new RegisterModelDetail(), RegisterdetProgram);
//-------------------------------------------------- end add details --------------------------------------------------//


// data details
function loadDataDetail(indexs){
    let data = JSON.parse($("#dataDetailList").val());
    
    $('#gsd_id').val(data[indexs].gsd_id);
    $('#upt_gsd_exam_type').val(data[indexs].gsd_exam_type);
    $('#upt_gsd_component').val(data[indexs].gsd_component);
    $('#upt_gsd_percentage').val(data[indexs].gsd_percentage);

    $("#update-perincian").modal("show");
}


//-------------------------------------------------- update details --------------------------------------------------//
$("#formUptDetGredScheme").on('submit', function (e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Grading Scheme Details",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let gsd_id = $("#gsd_id").val();
            let upt_gsd_exam_type = $("#upt_gsd_exam_type").val();
            let upt_gsd_component = $("#upt_gsd_component").val();
            let upt_gsd_percentage = $("#upt_gsd_percentage").val();

            var form = new FormData();
            form.append("gsd_id", gsd_id);
            form.append("gsd_exam_type", upt_gsd_exam_type);
            form.append("gsd_component", upt_gsd_component);
            form.append("gsd_percentage", upt_gsd_percentage);
            form.append("recordstatus", "EDT");

            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmDetGredScheme/update",
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


// delete details
function del_rekod(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("gsd_id", id);

    swal({
        title: "Remove Grading Scheme Details",
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
            "url": host+"api_tetapan_picoms/public/misPrmDetGredScheme/delete",
            "method": "POST",
            "timeout": 0,
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


function gradeSchemeDet(id, returnValue){
    var settings = {
        "url": host + "api_tetapan_picoms/public/misPrmGredScheme/show/"+id,
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        data = response.data;
        returnValue();
    });
}

function detailsList(id, returnValue){
    var form = new FormData();
    form.append("gsc_id", id);

    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmDetGredScheme/show",
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
    };

    $.ajax(settings).done(function (response) {
        let result = JSON.parse(response);
        obj_detList = result.data;
        returnValue();
    });
}

function courseList(id, returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmCourse/selectCrs/"+id,
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_course = response;
        returnValue();
    });
}

function checkId(id){
    let input = id.value;

    var form = new FormData();
    form.append("input", input);

    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmGredScheme/checkName",
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
    };

    $.ajax(settings).done(function (response) {
        result = JSON.parse(response);
        if(result.data != ''){
            $('#check').html('Data Already Exists In The System');
            $('#btnSubmit').prop('disabled', true);
        }
        else{
            $('#check').html('');
            $('#btnSubmit').prop('disabled', false);
        }
    });
}

function examType(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/examTypeList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_examType = response;
        returnValue();
    });
}