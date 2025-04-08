$(function(){
    $.ajaxSetup ({
        cache: false
    });

    $('#btnBack').click(function(){
        location.href = 'adminPage.html';
    });

    //---------- select Faculty ----------//
    var settings = {
        "url": host+"api_tetapan_picoms/public/facultyList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        //LIST OPTION
        $('#fac_id').append($('<option>', { 
            value: "",
            text : "-Choose-" 
        }));
        $.each(response.data, function (i, item) {
            $('#fac_id').append($('<option>', { 
                value: item.fac_id,
                text : item.fac_name 
            }));
        });
        
        //LIST OPTION update
        $('#fac_id_upt').append($('<option>', { 
            value: "",
            text : "-Choose-" 
        }));
        $.each(response.data, function (i, item) {
            $('#fac_id_upt').append($('<option>', { 
                value: item.fac_id,
                text : item.fac_name 
            }));
        });
    });
    //---------- end select Faculty ----------//

    //---------- select location ----------//
    var settings = {
        "url": host+"api_tetapan_picoms/public/locationsList",
        "method": "POST",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        //LIST OPTION 
        $('#cen_name').append($('<option>', { 
            value: "",
            text : "-Choose-" 
        }));
        $.each(response.data, function (i, item) {
            $('#cen_name').append($('<option>', { 
                value: item.loc_id,
                text : item.loc_name 
            }));
        });

        // LIST OPTION UPDATE 
         $('#upt_cen_name').append($('<option>', { 
            value: "",
            text : "-Choose-" 
        }));
        $.each(response.data, function (i, item) {
            $('#upt_cen_name').append($('<option>', { 
                value: item.loc_id,
                text : item.loc_name 
            }));
        });
    });

    $('#cen_name').on('change', function(){
        let loc_id = this.value;

        var form = new FormData();
        form.append("loc_id", loc_id);

        var settings = {
            "url": host+"api_tetapan_picoms/public/locations",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };

        $.ajax(settings).done(function (response) {
            // console.log(response);
            let result = JSON.parse(response);
            if(result.success){
                $('#cen_max_capacity').val(result.data.loc_capacity);
            }
            else{ swal("Failed", response.message, "error"); }
        });
    });

    $('#upt_cen_name').on('change', function(){
        let loc_id = this.value;

        var form = new FormData();
        form.append("loc_id", loc_id);

        var settings = {
            "url": host+"api_tetapan_picoms/public/locations",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };

        $.ajax(settings).done(function (response) {
            // console.log(response);
            let result = JSON.parse(response);
            if(result.success){
                $('#cen_max_capacity_upt').val(result.data.loc_capacity);
            }
            else{ swal("Failed", response.message, "error"); }
        });
    });
    //---------- end select location ----------//

    //---------- select Programme ----------//
    var settings = {
        "url": host+"api_tetapan_picoms/public/programmeList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        //LIST OPTION 
        $('#pgm_id').append($('<option>', { 
            value: "",
            text : "-Choose-" 
        }));
        $.each(response.data, function (i, item) {
            $('#pgm_id').append($('<option>', { 
                value: item.pgm_id,
                text : item.pgm_name 
            }));
        });

        // LIST OPTION UPDATE 
         $('#upt_pgm_id').append($('<option>', { 
            value: "",
            text : "-Choose-" 
        }));
        $.each(response.data, function (i, item) {
            $('#upt_pgm_id').append($('<option>', { 
                value: item.pgm_id,
                text : item.pgm_name 
            }));
        });
    });
    //---------- end select Programme ----------//
});


//---------- display exam center list ----------//
var settings = {
    "url": host+"api_exam_picoms/public/listExmCenter",
    "method": "GET",
    "timeout": 0,
};

$.ajax(settings).done(function (response) {
    // console.log(response);
    let bil = 1;
    let convertList = JSON.stringify(response.data);
    $("#dataList").val(convertList);
    let list_data = [];
    let columns = [
        { "name": "bil", "title": "No." },
        { "name": "cen_id", "title": "Code" },
        { "name": "cen_name", "title": "Location Name" },
        { "name": "cen_max_capacity", "title": "Maximum Capacity" },
        { "name": "pgm_id", "title": "Faculty / Programme", "breakpoints": "md sm xs" },
        { "name": "cen_status", "title": "Status", "breakpoints": "md sm xs" },
        { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" }
    ];
    
    $.each(response.data, function(i, field){
        list_data.push({
            "bil": bil++, "cen_id": field.cen_id, "cen_name": field.loc_name, "cen_max_capacity": field.cen_max_capacity,
            "pgm_id":field.fac_name +"<br>"+ field.pgm_name, "cen_status": field.cen_status,
            "upt_btn": '<button class="btn btn-icon success" title="Update" onclick="loadData(\'' + i + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button> ' +
                        '<button class="btn btn-icon danger" title="Delete" onclick="del_rekod(\''+field.pk_id+'\')"><i class="ion-trash-b"></i>'
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
//---------- end display exam center list ----------//


var confirmed = false;
//-------------------------------------------------- add exam center --------------------------------------------------//
$('#formAddExamCenter').on('submit', function(e){
    let $this = $(this);
    
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
            let cen_id = $('#cen_id').val();
            let fac_id = $('#fac_id').val();
            let pgm_id = $('#pgm_id').val();
            let cen_name = $('#cen_name').val();
            let cen_type = $('#cen_type').val();
            let cen_max_capacity = $('#cen_max_capacity').val();
            let cen_status = $('#cen_status').val();

            var form = new FormData();
            form.append("cen_id", cen_id);
            form.append("fac_id", fac_id);
            form.append("pgm_id", pgm_id);
            form.append("cen_name", cen_name);
            form.append("cen_type", cen_type);
            form.append("cen_max_capacity", cen_max_capacity);
            form.append("cen_status", cen_status);
            form.append("recordstatus", "ADD");
            
            var settings = {
              "url": host+"api_exam_picoms/public/addExmCenter",
              "method": "POST",
              "timeout": 0,
              "processData": false,
              "mimeType": "multipart/form-data",
              "contentType": false,
              "data": form
            };

            $.ajax(settings).done(function (response) {
                // console.log(response);
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
    $('#fac_id_upt').val(data[indexs].fac_id);
    $('#upt_pgm_id').val(data[indexs].pgm_id);
    $('#upt_cen_name').val(data[indexs].cen_name);
    $('#cen_type_upt').val(data[indexs].cen_type);
    $('#cen_max_capacity_upt').val(data[indexs].cen_max_capacity);
    $('#cen_status_upt').val(data[indexs].cen_status);

    $("#update-pusatPeperiksaan").modal("show");
}


//-------------------------------------------------- update exam center --------------------------------------------------//
$('#formUptExamCenter').on('submit', function(e){
    let $this = $(this);
    
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
            let fac_id = $('#fac_id_upt').val();
            let pgm_id = $('#upt_pgm_id').val();
            let cen_name = $('#upt_cen_name').val();
            let cen_type = $('#cen_type_upt').val();
            let cen_max_capacity = $('#cen_max_capacity_upt').val();
            let cen_status = $('#cen_status_upt').val();

            var form = new FormData();
            form.append("pk_id", pk_id);
            form.append("cen_id", cen_id);
            form.append("fac_id", fac_id);
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
    }).then(function () {

        var settings = {
            "url": host+"api_exam_picoms/public/misExamCenter/delete",
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
            window.location.replace("adminPage.html");
        });
    });

}


