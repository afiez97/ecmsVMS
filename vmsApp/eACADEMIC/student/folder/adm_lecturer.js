$(function(){
    $('#btnBack').click(function(){
        location.href = 'adminPage.html';
    });

    // list faculty lecturer
    var columns = [
        { "name": "emp_id", "title": "Staff No." },
        { "name": "emp_name", "title": "Staff Name" },
        { "name": "fac_id", "title": "Faculty", "breakpoints": "md sm xs" },
        { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        // {"name":"status","title":"Status", "breakpoints":"sm xs"}
    ];
    var settings = {
        "url": host+"api_tetapan_picoms/public/lecturerList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        let bil = 1;
        let convertList = JSON.stringify(response.data);
        $("#dataList").val(convertList);
        console.log(response)
        var list = [];

        $.each(response.data, function (i, field) {
            list.push({
                fac_id: field.fac_name, emp_id: field.emp_id, emp_name: field.emp_name,
                upt_btn: '<button class="btn accent" title="Details" onclick="detail(\'' + field.emp_id + '\',\'' + i + '\')" id="btnPerincian"><i class="ion-ios-list-outline"></i></button>'
            });
        });

        $("#pensyarahList").footable({
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
});

// var viewPensyarah = function () {
    // let list = [];
    
// };
// const pensyarahList = document.querySelector("#tablePensyarah");
// ko.applyBindings(viewPensyarah, pensyarahList);


function detail(empId){
    // alert(empId);
    window.location.replace("lecturer_details.html?id="+empId);
    // $('#lect_id').html(empId);
}


var RegisterModel = function () {
    //Dropdown Fakulti List
    var settings = {
        "url": host+"api_tetapan_picoms/public/facultyList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };

        $.ajax(settings).done(function (response) {
            //LIST OPTION
            $('#fac_id').append($('<option>', { 
                value: "",
                text : "Choose Faculty" 
            }));
            $.each(response.data, function (i, item) {
                $('#fac_id').append($('<option>', { 
                    value: item.fac_id,
                    text : item.fac_name 
                }));
            });

             //LIST OPTION UPDATE
             $('#upt_fac_id').append($('<option>', { 
                value: "",
                text : "Choose Faculty" 
            }));
            $.each(response.data, function (i, item) {
                $('#upt_fac_id').append($('<option>', { 
                    value: item.fac_id,
                    text : item.fac_name 
                }));
            });
            
        });
    // END Dropdown Fakulti List
    
    //Dropdown Pensyarah List
    var settings = {
        "url": host+"api_tetapan_picoms/public/employeeList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };

        $.ajax(settings).done(function (response) {
            //LIST OPTION
            $('#emp_id').append($('<option>', { 
                value: "",
                text : "Choose Academic Staff Name" 
            }));
            $.each(response.data, function (i, item) {
                $('#emp_id').append($('<option>', { 
                    value: item.emp_id,
                    text : item.emp_name 
                }));
            });

            //LIST OPTION UPDATE
            $('#upt_emp_id').append($('<option>', { 
                value: "",
                text : "Choose Academic Staff Name" 
            }));
            $.each(response.data, function (i, item) {
                $('#upt_emp_id').append($('<option>', { 
                    value: item.emp_id,
                    text : item.emp_name 
                }));
            });
            
        });
    // END Dropdown Pensyarah List
    
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

    self.Register = function () {

        var error = ko.validation.group(self);

        if (error().length > 0) {
            error.showAllMessages();
            return;
        }

        var param = {
            twmTitle: self.fac_id(),
            twmDescription: self.emp_id(),
        }
        console.log(param)

        var form = new FormData();

        form.append("fac_id", self.fac_id());
        form.append("emp_id", self.emp_id());
        form.append("recordstatus", self.recordstatus());

        swal({
            title: "Register Academic Staff",
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
                "url": host+"api_tetapan_picoms/public/addFaclecturer",
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

                sessionStorage.token = result.token;
                window.location.replace("adminPage.html");
            });
        });

    };
}

const RegisterFacLecturer = document.querySelector("#reg-fakPensyarah");
ko.applyBindings(new RegisterModel(), RegisterFacLecturer);


function loadData(indexs) {   

    let data = JSON.parse($("#dataList").val());
    $('#upt_fac_id').val(data[indexs].fac_id);
    $('#upt_emp_id').val(data[indexs].emp_id);
    $('#upt_id').val(data[indexs].id);

    $("#update-fakPensyarah").modal("show");
}

$("#upt_facPensyarah").click(function () {
    
    let upt_fac_id = $("#upt_fac_id").val();
    let upt_emp_id = $("#upt_emp_id").val();
    let upt_id = $("#upt_id").val();
    
    let statusrekod = "EDT";

    var form = new FormData();
        form.append("id", upt_id);
        form.append("fac_id", upt_fac_id);
        form.append("emp_id", upt_emp_id);
        form.append("recordstatus", statusrekod);

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
        }).then(function () {

            var settings = {
                "url": host+"api_tetapan_picoms/public/faclecturerUpdate",
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

                // sessionStorage.token = result.token;
                window.location.replace("adminPage.html");

            });
        });

});

function del_rekod(id){

    let statusrekod = 'DEL';
    let upt_id = id;

    var form = new FormData();
    form.append("recordstatus", statusrekod);
    form.append("id", upt_id);
    

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
        }).then(function () {

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

                // sessionStorage.token = result.token;
                window.location.replace("adminPage.html");

            });
        });

    }