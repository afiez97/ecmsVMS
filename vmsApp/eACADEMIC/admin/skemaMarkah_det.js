$(function(){
    $.ajaxSetup ({
        cache: false
    });

    $.fn.select2.defaults.set( "theme", "bootstrap" );

    let gs_id = window.sessionStorage.gs_id;

    // capaianSM = load_capaian();
    load_capaian();
    capaianSM = window.capaianData;
    // console.log(capaianCot);
    let addSMarkah = capaianSM[0];
    let uptSMarkah = capaianSM[1];
    let delSMarkah = capaianSM[2];

    console.log(addSMarkah);
    console.log(uptSMarkah);
    console.log(delSMarkah);

   


    gradeSchemeDet(gs_id, function(){
        $('#gsc_id').val(data.gsc_id);
        $('#crs_id').val(data.fk_course);
        $('#crs_name').html(data.crs_name);
        $('#fac_name').html(data.fac_name);
    });

    // select exam type
    examType(function(){
        $('#gsd_exam_type').append('<option value="">- Choose -</option>');
        $('#upt_gsd_exam_type').append('<option value="">- Choose -</option>');
        $.each(obj_examType.data, function (i, item) {
            $('#gsd_exam_type').append('<option value="'+item.id+'">'+item.gsd_exam_type+'</option>');
            $('#upt_gsd_exam_type').append('<option value="'+item.id+'">'+item.gsd_exam_type+'</option>');
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:',
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

        if (addSMarkah == 0){
            SMAddHidden = 'disabled';
        }
        else{
            SMAddHidden = ''; 
        }
    
        if (uptSMarkah == 0){
            SMUpdateHidden = 'disabled';
        }
        else{
            SMUpdateHidden = ''; 
        }
    
        if (delSMarkah == 0){
            SMDelHidden = 'disabled';
        }
        else{
            SMDelHidden = ''; 
        }

        

        var list = [];
        let bil = 1;
        let convertDetList = JSON.stringify(obj_detList.data);
        $("#dataDetailList").val(convertDetList);

        $.each(obj_detList.data, function (i, field){
            list.push({
                bil: bil++, gsd_exam_type: '<span class="text-uppercase">'+field.examTypeName+'</span>', gsd_component: '<span class="text-uppercase">'+field.gsd_component+'</span>', gsd_percentage: field.gsd_percentage,
                "upt_btn": '<button class="btn btn-icon success" '+SMUpdateHidden+' title="Update" onclick="loadDataDetail(\'' + i + '\')"><i class="ion-android-create"></i></button> ' +
                            '<button class="btn btn-icon danger" '+SMDelHidden+' title="Remove" onclick="del_rekod(\''+field.gsd_id+'\')"><i class="ion-trash-b"></i></button>'
            });
        });
        
        $("#listSkemaDet").html('');
        $("#listSkemaDet").footable({
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
});
var confirmed = false;


// btn Back to admin page
$('#btnBack').click(function(){
    window.location.replace('adminPage.html');
    window.sessionStorage.removeItem('gs_id');
});


//-------------------------------------------------- delete grading scheme --------------------------------------------------//
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
            window.location.replace('adminPage.html');
        });
    });
});
//-------------------------------------------------- end delete grading scheme --------------------------------------------------//


//-------------------------------------------------- add details --------------------------------------------------//
$('#formAddItems').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Items",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let gsc_id = $('#gsc_id').val();
            let fk_course = $('#crs_id').val();
            let gsd_exam_type = $('#gsd_exam_type').val();
            let gsd_component = $('#gsd_component').val();
            let gsd_percentage = $('#gsd_percentage').val();

            var form = new FormData();
            form.append("gsc_id", gsc_id);
            form.append("fk_course", fk_course);
            form.append("gsd_exam_type", gsd_exam_type);
            form.append("gsd_component", gsd_component);
            form.append("gsd_percentage", gsd_percentage);
            form.append("recordstatus", 'ADD');
    
            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmDetGredScheme/register",
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
//-------------------------------------------------- end add details --------------------------------------------------//


// data details
function loadDataDetail(indexs){
    let data = JSON.parse($("#dataDetailList").val());
    
    $('#gsd_id').val(data[indexs].gsd_id);
    $('#upt_gsd_exam_type').val(data[indexs].examTypeId);
    $('#upt_gsd_component').val(data[indexs].gsd_component);
    $('#upt_gsd_percentage').val(data[indexs].gsd_percentage);

    $("#update-perincian").modal("show");
}


//-------------------------------------------------- update details --------------------------------------------------//
$("#formUptDetGredScheme").on('submit', function(e){
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
//-------------------------------------------------- end update details --------------------------------------------------//


//-------------------------------------------------- delete --------------------------------------------------//
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
//-------------------------------------------------- end delete --------------------------------------------------//


function gradeSchemeDet(id, returnValue){
    var settings = {
        "url": host + "api_tetapan_picoms/public/misPrmGredScheme/show/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        data = response.data;
        returnValue();
    });
}

function examType(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/gsdExamType/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_examType = response;
        returnValue();
    });
}

function limitNo(input){
    if(input.value < 0){
        input.value = 0;
        alert('Enter number 0-100 only');
    }
    if(input.value > 100){
        input.value = 100;
        alert('Enter number 0-100 only');
    }
}