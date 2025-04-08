$(function(){
    $.ajaxSetup ({
        cache: false
    });
});

var confirmed = false;
//-------------------------------------------------- add exam type --------------------------------------------------//
$('#formAddExamType').on('submit', function(e){
    let $this = $(this);
    
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Examination Type",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let exam_type = $('#exam_type').val();
            let exam_remarks = $('#exam_remarks').val();

            var form = new FormData();
            form.append("exam_type", exam_type);
            form.append("exam_remarks", exam_remarks);
            form.append("recordstatus", "ADD");
            
            var settings = {
              "url": host+"api_exam_picoms/public/addExmType",
              "method": "POST",
              "timeout": 0,
              "processData": false,
              "mimeType": "multipart/form-data",
              "contentType": false,
              "data": form
            };

            $.ajax(settings).done(function (response) {
                console.log(response);
                let result = JSON.parse(response);
                if(result.success){
                    window.location.reload();
                }
                else{
                    swal("Failed", response.message, "error");
                }
            });
        });
    }
});
//-------------------------------------------------- end add exam type --------------------------------------------------//


//-------------------------------------------------- display exam type list --------------------------------------------------//
var settings = {
    "url": host+"api_exam_picoms/public/listExmType",
    "method": "GET",
    "timeout": 0,
};

$.ajax(settings).done(function (response){
    let bil = 1;
    let convertList = JSON.stringify(response.data);
    $("#dataList").val(convertList);
    let list_data = [];
    let columns = [
        { "name": "bil", "title": "No." },
        { "name": "exam_type", "title": "Examination Type" },
        { "name": "exam_remarks", "title": "Remarks" },
        { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" }
    ];
    
    $.each(response.data, function(i, field){
        list_data.push({
            "bil": bil++, "exam_type": field.exam_type, "exam_remarks": field.exam_remarks,
            "upt_btn": '<button class="btn btn-icon success" title="Update" onclick="loadData(\'' + i + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button> ' +
                        '<button class="btn btn-icon danger" title="Delete" onclick="del_rekod(\''+field.pk_id+'\')"><i class="ion-trash-b"></i>'
        });
    });
    $('#tblExamType').html('');
    $('#tblExamType').footable({
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
//-------------------------------------------------- end display exam type list --------------------------------------------------//


function loadData(indexs){
    let data = JSON.parse($("#dataList").val());
    $('#pk_id').val(data[indexs].pk_id);
    $('#exam_type_upt').val(data[indexs].exam_type);
    $('#exam_remarks_upt').val(data[indexs].exam_remarks);

    $("#update-examType").modal("show");
}


//-------------------------------------------------- update exam type --------------------------------------------------//
$("#btnUpdate").on('click', function (e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Examination Type",
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
            let exam_type = $('#exam_type_upt').val();
            let exam_remarks = $('#exam_remarks_upt').val();

            var form = new FormData();
            form.append("pk_id", pk_id);
            form.append("exam_type", exam_type);
            form.append("exam_remarks", exam_remarks);
            form.append("recordstatus", "EDT");
            
            var settings = {
              "url": host+"api_exam_picoms/public/misExamType/update",
              "method": "POST",
              "timeout": 0,
              "processData": false,
              "mimeType": "multipart/form-data",
              "contentType": false,
              "data": form
            };

            $.ajax(settings).done(function (response) {
                console.log(response);
                let result = JSON.parse(response);
                if(result.success){
                    window.location.reload();
                }
                else{ swal("Failed", response.message, "error"); }
            });
        });
    }

});
//-------------------------------------------------- end update exam type --------------------------------------------------//


//-------------------------------------------------- delete exam type --------------------------------------------------//
function del_rekod(id){
    let statusrekod = 'DEL';
    let upt_id = id;

    var form = new FormData();
    form.append("recordstatus", statusrekod);
    form.append("pk_id", upt_id);
    

    swal({
            title: "Remove Examination Type",
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
                "url": host+"api_exam_picoms/public/misExamType/delete",
                "method": "POST",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form
              };

            $.ajax(settings).done(function (response){
                console.log(response)
                result = JSON.parse(response);
                if (!result.success) {
                    Swal(result.message, result.data, "error");
                    return;
                }

                window.location.replace("adminPage.html");
            });
        });

}
//-------------------------------------------------- end delete exam type --------------------------------------------------//


