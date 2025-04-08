let clg_id = window.sessionStorage.idPage;

$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let clg_id = window.sessionStorage.idPage;

    // select Location Name
    listLocByCam(clg_id, function(){
        $('#cen_name').append($('<option value="">- Choose -</option>'));
        $('#upt_cen_name').append($('<option value="">- Choose -</option>'));
        $.each(obj_location.data, function (i, item){
            $('#cen_name').append($('<option value="'+item.loc_id+'">'+item.loc_name+'</option>'));
            $('#upt_cen_name').append($('<option value="'+item.loc_id+'">'+item.loc_name+'</option>'));
        });
    });

    // exam center list
    listExamCenter(clg_id, function(){

        // capaianExam = load_capaian();
        load_capaian();
        capaianExam = window.capaianData;
        // console.log(capaianExam);
        let addExam = capaianExam[0];
        let uptExam = capaianExam[1];
        let delExam = capaianExam[2];
    
        console.log(addExam);
        console.log(uptExam);
        console.log(delExam);
    
        if (addExam == 0){
            ExamAddDisabled = 'disabled';
        }
        else{
            ExamAddDisabled = ''; 
        }
    
        if (uptExam == 0){
            ExamUpdateDisabled = 'disabled';
        }
        else{
            ExamUpdateDisabled = ''; 
        }
    
    
        if (delExam == 0){
            ExamDelDisabled = 'disabled';
        }
        else{
            ExamDelDisabled = ''; 
        }

        let columns = [
            { "name": "bil", "title": "No." },
            { "name": "cen_id", "title": "Code" },
            { "name": "cen_name", "title": "Location Name" },
            { "name": "cen_max_capacity", "title": "Maximum Capacity" },
            { "name": "clg_id", "title": "Campus", "breakpoints": "md sm xs" },
            { "name": "cen_status", "title": "Status", "breakpoints": "md sm xs" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" }
        ];

        let bil = 1;
        let convertList = JSON.stringify(obj_listExamCenter.data);
        $("#dataList").val(convertList);
        let list_data = [];
        
        $.each(obj_listExamCenter.data, function(i, field){
            list_data.push({
                "bil": bil++, "cen_id": field.cen_id.toUpperCase(), "cen_name": field.loc_name.toUpperCase(), "cen_max_capacity": field.cen_max_capacity, "clg_id": field.clg_name.toUpperCase(), "cen_status": field.cen_status.toUpperCase(),
                "upt_btn": '<button class="btn btn-icon success" title="Update" '+ExamUpdateDisabled+' onclick="loadData(\'' + i + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button> ' +
                            '<button class="btn btn-icon danger" title="Delete" '+ExamDelDisabled+' onclick="del_rekod(\''+field.pk_id+'\')"><i class="ion-trash-b"></i>'
            });
        });

        $('#tblExamCenter').html('');
        $('#tblExamCenter').footable({
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


//-------------------------------------------------- add exam center --------------------------------------------------//
$('#formAddExamCenter').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Examination Center",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let clgId = clg_id;
            let cen_id = $('#cen_id').val();
            let cen_name = $('#cen_name').val();
            let cen_type = $('#cen_type').val();
            let cen_max_capacity = $('#cen_max_capacity').val();
            let cen_status = $('#cen_status').val();

            var form = new FormData();
            form.append("clg_id", clgId);
            form.append("cen_id", cen_id);
            form.append("cen_name", cen_name);
            form.append("cen_type", cen_type);
            form.append("cen_max_capacity", cen_max_capacity);
            form.append("cen_status", cen_status);
            form.append("recordstatus", "ADD");
            
            var settings = {
                "url": host+"api_exam_picoms/public/misExamCenter/register",
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
//-------------------------------------------------- end add exam center --------------------------------------------------//


// display data exam center
function loadData(indexs){
    let data = JSON.parse($("#dataList").val());
    $('#pk_id').val(data[indexs].pk_id);
    $('#cen_id_upt').val(data[indexs].cen_id);
    $('#upt_pgm_id').val(data[indexs].pgm_id);
    $('#upt_cen_name').val(data[indexs].cen_name);
    $('#cen_type_upt').val(data[indexs].cen_type);
    $('#cen_max_capacity_upt').val(data[indexs].cen_max_capacity);
    $('#cen_status_upt').val(data[indexs].cen_status);

    $("#update-pusatPeperiksaan").modal("show");
}


//-------------------------------------------------- update exam center --------------------------------------------------//
$('#formUptExamCenter').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Examination Center",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let pk_id = $('#pk_id').val();
            let cen_id = $('#cen_id_upt').val();
            let pgm_id = $('#upt_pgm_id').val();
            let cen_name = $('#upt_cen_name').val();
            let cen_type = $('#cen_type_upt').val();
            let cen_max_capacity = $('#cen_max_capacity_upt').val();
            let cen_status = $('#cen_status_upt').val();

            var form = new FormData();
            form.append("pk_id", pk_id);
            form.append("cen_id", cen_id);
            form.append("pgm_id", pgm_id);
            form.append("cen_name", cen_name);
            form.append("cen_type", cen_type);
            form.append("cen_max_capacity", cen_max_capacity);
            form.append("cen_status", cen_status);
            form.append("recordstatus", "EDT");
            
            var settings = {
                "url": host+"api_exam_picoms/public/misExamCenter/update",
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
//-------------------------------------------------- end update exam center --------------------------------------------------//


// select location change max capacity
// $('#cen_name').on('change', function(){
//     let loc_id = this.value;

//     dataLoc(loc_id, function(){
//         $('#cen_max_capacity').val(obj_dataLoc.loc_capacity);
//     });
// });

// $('#upt_cen_name').on('change', function(){
//     let loc_id = this.value;

//     dataLoc(loc_id, function(){
//         $('#cen_max_capacity_upt').val(obj_dataLoc.loc_capacity);
//     });
// });


function del_rekod(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("pk_id", id);

    swal({
        title: "Remove Examination Center",
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
            "url": host+"api_exam_picoms/public/misExamCenter/delete",
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

function listLocByCam(clgId, returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmLoc/listByCampus/"+clgId,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_location = response;
        returnValue();
    });
}

function dataLoc(id, returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmLoc/show/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_dataLoc = response.data;
        returnValue();
    });
}

function listExamCenter(id, returnValue){
    var settings = {
        "url": host+"api_exam_picoms/public/misExamCenter/listByCampus/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };
    
    $.ajax(settings).done(function (response){
        obj_listExamCenter = response;
        returnValue();
    });
}


