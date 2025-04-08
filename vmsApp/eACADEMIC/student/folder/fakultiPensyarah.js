let clg_id = window.sessionStorage.idPage;

$(function(){
    $.ajaxSetup ({
        cache: false
    });

    lecturerList(function(){
        $('#emp_id').append('<option value="">- Choose -</option>');
        $('#upt_emp_id').append('<option value="">- Choose -</option>');
        $.each(obj_lecturer.data, function (i, item){
            $('#emp_id').append('<option value="'+item.emp_id+'">'+item.emp_name+'</option>');
            $('#upt_emp_id').append('<option value="'+item.emp_id+'">'+item.emp_name+'</option>');
        });
    });

    facultyList(function(){
        $('#fac_id').append('<option value="">- Choose -</option>');
        $('#upt_fac_id').append('<option value="">- Choose -</option>');
        $.each(obj_faculty.data, function (i, item) {
            $('#fac_id').append('<option value="'+item.pk_id+'">'+item.fac_name+'</option>');
            $('#upt_fac_id').append('<option value="'+item.pk_id+'">'+item.fac_name+'</option>');
        });
    });
});
var confirmed = false;


// faculty lecturer list
var viewFacPensyarah = function (){
    var columns = [
        // { "name": "bil", "title": "No." },
        { "name": "emp_id", "title": "Staff No.", "breakpoints": "md sm xs" },
        { "name": "emp_name", "title": "Academic Staff Name" },
        { "name": "fac_id", "title": "Faculty Name" },
        { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
    ];
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmFacLect/listByCampus/"+clg_id,
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        // let bil = 1;
        let convertList = JSON.stringify(response.data);
        $("#dataList").val(convertList);
        var list = [];

        $.each(response.data, function (i, field) {
            list.push({
                // bil: bil++, 
                fac_id: field.fac_name, emp_id: field.emp_id, emp_name: field.emp_name,
                upt_btn:    '<button class="btn btn-icon success" title="Update" onclick="loadData(\'' + i + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button>' +
                            ' <button class="btn btn-icon danger" title="Remove" onclick="del_rekod(\''+field.id+'\')"><i class="ion-trash-b"></i>'
            });
        });

        $("#facpensyarahList").footable({
            "columns": columns,
            "rows": list,
            "paging": {
                "enabled": true,
                "size": 10
            },
            "filtering": {
                "enabled": true,
                "placeholder": "Search...",
                "dropdownTitle": "Search For:"
            }
        });
    });
};
const facpensyarahList = document.querySelector("#tableFacPensyarah");
ko.applyBindings(viewFacPensyarah, facpensyarahList);


//-------------------------------------------------- add faculty lecturer --------------------------------------------------//
var RegisterModel = function (){
    var self = this;
    self.fac_id = ko.observable("").extend({
        required: true,
    });

    self.emp_id = ko.observable("").extend({
        required: true
    });

    self.recordstatus = ko.observable("ADD").extend({
        required: true
    });

    self.Register = function (){
        var error = ko.validation.group(self);

        if (error().length > 0) {
            error.showAllMessages();
            return;
        }

        var form = new FormData();
        form.append("fac_id", self.fac_id());
        form.append("emp_id", self.emp_id());
        form.append("recordstatus", self.recordstatus());

        swal({
            title: "Add Academic Staff",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmFacLect/register",
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
const RegisterFacLecturer = document.querySelector("#reg-fakPensyarah");
ko.applyBindings(new RegisterModel(), RegisterFacLecturer);
//-------------------------------------------------- end add faculty lecturer --------------------------------------------------//


function loadData(indexs){
    let data = JSON.parse($("#dataList").val());
    $('#upt_fac_id').val(data[indexs].fac_id);
    $('#upt_emp_id').val(data[indexs].emp_id);
    $('#upt_id').val(data[indexs].id);

    $("#update-fakPensyarah").modal("show");
}


//-------------------------------------------------- update faculty lecturer --------------------------------------------------//
$("#formUptFacLecturer").on('submit', function (e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Academic Staff",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let upt_fac_id = $("#upt_fac_id").val();
            let upt_emp_id = $("#upt_emp_id").val();
            let upt_id = $("#upt_id").val();
            let statusrekod = "EDT";

            var form = new FormData();
            form.append("id", upt_id);
            form.append("fac_id", upt_fac_id);
            form.append("emp_id", upt_emp_id);
            form.append("recordstatus", statusrekod);
    
            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmFacLect/update",
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
});
//-------------------------------------------------- end update faculty lecturer --------------------------------------------------//


//-------------------------------------------------- delete faculty lecturer --------------------------------------------------//
function del_rekod(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("id", id);

    swal({
        title: "Remove Academic Staff",
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
            "url": host+"api_tetapan_picoms/public/faclecturerDelete",
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
//-------------------------------------------------- end delete faculty lecturer --------------------------------------------------//

function lecturerList(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/employeeList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_lecturer = response;
        returnValue();
    });
}

function facultyList(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmFaculty/listByCampus/"+clg_id,
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_faculty = response;
        returnValue();
    });
}