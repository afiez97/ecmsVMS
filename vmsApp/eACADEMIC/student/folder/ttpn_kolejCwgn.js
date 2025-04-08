var viewKolej = function () {
    // let list = [];
    var colums = [
        { "name": "bil", "title": "No." },
        { "name": "clg_id", "title": "Code" },
        { "name": "clg_name", "title": "Name", "breakpoints": "md sm xs" },
        { "name": "clg_address", "title": "Address", "breakpoints": "md sm xs" },
        { "name": "upt_btn", "title": "Action" },
        // {"name":"status","title":"Status","breakpoints":"sm xs"}
    ];
    var settings = {
        "url": host+"api_tetapan_picoms/public/collegeList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        let bil = 1;
        let convertList = JSON.stringify(response.data);
        $("#dataList").val(convertList);
        var list = [];

        $.each(response.data, function (i, field) {
            list.push({
                "bil": bil++, "clg_id": field.clg_id, "clg_name": field.clg_name, "clg_address": field.clg_address1 + "</br>" + field.clg_address2 + "</br>" + field.clg_address3, clg_phoneno: field.clg_phoneno,
                "upt_btn":  '<button class="btn success" title="Update" onclick="loadData(\'' + i + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button> ' +
                            '<button class="btn danger" title="Delete" onclick="del_rekod(\''+field.pk_id+'\',\''+field.clg_id+'\')"><i class="ion-trash-b"></i>'
            });
        });

        $("#kolejList").footable({
            "columns": colums,
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
};

const kolejList = document.querySelector("#kolejList");
ko.applyBindings(viewKolej, kolejList);

var viewModel = function () {

    var self = this;
    self.clg_id = ko.observable("").extend({
        required: true
    });

    self.clg_name = ko.observable("").extend({
        required: true
    });

    self.clg_address1 = ko.observable("").extend({
        required: true
    });

    self.clg_address2 = ko.observable("").extend({
        required: true
    });

    self.clg_address3 = ko.observable("").extend({
        required: true
    });

    self.clg_phoneno = ko.observable("").extend({
        required: true
    });

    self.clg_faxno = ko.observable("").extend({
        required: true
    });

    self.clg_email = ko.observable("").extend({
        required: true
    });


    self.updateCollege = function () {

        var error = ko.validation.group(self);

        if (error.length > 0) {
            error.showAllMessages();
            return;
        }

        var param = {
            clgId: self.clg_id(),
            clgName: self.clg_name(),
            clgAddress1: self.clg_address1(),
            clgAddress2: self.clg_address2(),
            clgAddress3: self.clg_address3(),
            clgPhoneno: self.clg_phoneno(),
            clgFaxno: self.clg_faxno(),
            clgEmail: self.clg_email(),
        }
        console.log(param);

        var form = new FormData();
        form.append("clg_id", self.clg_id());
        form.append("clg_name", self.clg_name());
        form.append("clg_address1", self.clg_address1());
        form.append("clg_address2", self.clg_address2());
        form.append("clg_address3", self.clg_address3());
        form.append("clg_phoneno", self.clg_phoneno());
        form.append("clg_faxno", self.clg_faxno());
        form.append("clg_email", self.clg_email());
        swal({
            title: "Update College",
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
                "url": host+"api_tetapan_picoms/public/updateCollege",
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

                sessionStorage.token = result.token;
                window.location.replace("adminPage.html");

            });
        });
    };
};

const submitCollege = document.querySelector("#update-kolej");
ko.applyBindings(new viewModel, submitCollege);

function loadData(indexs){   

    let data = JSON.parse($("#dataList").val());
    $('#upt_clg_id').val(data[indexs].clg_id);
    $('#upt_clg_name').val(data[indexs].clg_name);
    $('#upt_clg_address1').val(data[indexs].clg_address1);
    $('#upt_clg_address2').val(data[indexs].clg_address2);
    $('#upt_clg_address3').val(data[indexs].clg_address3);
    $('#upt_clg_phoneno').val(data[indexs].clg_phoneno);
    $('#upt_clg_faxno').val(data[indexs].clg_faxno);
    $('#upt_clg_email').val(data[indexs].clg_email);    

    $("#update-kolej").modal("show");
    
}

// function loadData2(id) {
//     $("#update-kolej").modal("show");
//     var form = new FormData();
//     form.append("clg_id", id);

//     var settings = {
//         "url": host+"api_tetapan_picoms/public/college/" + id,
//         "method": "POST",
//         "timeout": 0,
//         "processData": false,
//         "mimeType": "multipart/form-data",
//         "contentType": false,
//         "data": form
//     };

//     $.ajax(settings).done(function (response) {

//         $("#update-college").modal("show");
//         result = JSON.parse(response);
//         if (result.success) {
//             self.clg_name = result.data.clg_name;
//         }
//     });

// }

var RegisterModel = function () {
    var self = this;
    self.clg_id = ko.observable("").extend({
        required: true
    });

    self.clg_name = ko.observable("").extend({
        required: true
    });

    self.clg_address1 = ko.observable("").extend({
        required: true
    });

    self.clg_address2 = ko.observable("").extend({
        required: true
    });

    self.clg_address3 = ko.observable("").extend({
        required: true
    });

    self.clg_phoneno = ko.observable("").extend({
        required: true
    });

    self.clg_faxno = ko.observable("").extend({
        required: true
    });

    self.clg_email = ko.observable("").extend({
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

        // var param = {
        //     clgId: self.clg_id(),
        //     clgName: self.clg_name(),
        //     clgAddress1: self.clg_address1(),
        //     clgAddress2: self.clg_address2(),
        //     clgAddress3: self.clg_address3(),
        //     clgPhoneno: self.clg_phoneno(),
        //     clgFaxno: self.clg_faxno(),
        //     clgEmail: self.clg_email(),
        //    recordStatus: self.recordstatus(),
        // }

       

        swal({
            title: "Add Campus",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            var form = new FormData();

            form.append("clg_id", self.clg_id());
            form.append("clg_name", self.clg_name());
            form.append("clg_address1", self.clg_address1());
            form.append("clg_address2", self.clg_address2());
            form.append("clg_address3", self.clg_address3());
            form.append("clg_phoneno", self.clg_phoneno());
            form.append("clg_faxno", self.clg_faxno());
            form.append("clg_email", self.clg_email());
            form.append("recordstatus",'ADD');

            var settings = {
                "url": host+"api_tetapan_picoms/public/addCollege",
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

const RegisterCollege = document.querySelector("#reg-kolej");
ko.applyBindings(new RegisterModel(), RegisterCollege);

$("#upt_kolej").click(function () {
    
    let upt_clg_id = $("#upt_clg_id").val();
    let upt_clg_name = $("#upt_clg_name").val();
    let upt_clg_address1 = $("#upt_clg_address1").val();
    let upt_clg_address2 = $("#upt_clg_address2").val();
    let upt_clg_address3 = $("#upt_clg_address3").val();
    let upt_clg_phoneno = $("#upt_clg_phoneno").val();
    let upt_clg_faxno = $("#upt_clg_faxno").val();
    let upt_clg_email = $("#upt_clg_email").val();
    let statusrekod = "EDT";

    var form = new FormData();
        form.append("clg_id", upt_clg_id);
        form.append("clg_name", upt_clg_name);
        form.append("clg_address2", upt_clg_address2);
        form.append("clg_address1", upt_clg_address1);
        form.append("clg_address3", upt_clg_address3);
        form.append("clg_phoneno", upt_clg_phoneno);
        form.append("clg_faxno", upt_clg_faxno);
        form.append("clg_email", upt_clg_email);
        form.append("recordstatus", statusrekod);

    swal({
            title: "Update Campus",
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
                "url": host+"api_tetapan_picoms/public/collegeUpdate",
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

function del_rekod(id, clg_id){

    let statusrekod = 'DEL';
    let crs_code = clg_id+'_del';
    let pk_id = id;

    var form = new FormData();
    form.append("recordstatus", statusrekod);
    form.append("clg_id", crs_code);
    form.append("pk_id", pk_id);
    

    swal({
            title: "Remove Campus",
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
                "url": host+"api_tetapan_picoms/public/collegeDelete",
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

function collegeCodeChecking(self){

    let input = self.value;

    var form = new FormData();
    form.append("input", input);

    var settings = {
    "url": host+"api_tetapan_picoms/public/collegeChecking",
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
            $('#check').html('Code Already Exists In The System');
            $("#check").prop('class','text-danger');
            $('#btnSubmit').prop('disabled', true);
        }else{
            $('#check').html('');
            $('#btnSubmit').prop('disabled', false);
        }
        
    });

}