$(function(){
    $.ajaxSetup ({
        cache: false
    });
});
var confirmed = false;

// btn Back to campus page
$('#btnBack').click(function(){
    window.location.replace('campusPage.html');
});

var viewKolej = function (){
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

    $.ajax(settings).done(function (response){
        let bil = 1;
        let convertList = JSON.stringify(response.data);
        $("#dataList").val(convertList);
        var list = [];

        $.each(response.data, function (i, field) {
            list.push({
                "bil": bil++, "clg_id": field.clg_id, "clg_name": field.clg_name, "clg_address": field.clg_address1 + "</br>" + field.clg_address2 + "</br>" + field.clg_address3, clg_phoneno: field.clg_phoneno,
                "upt_btn":  '<button class="btn btn-icon accent" title="Details" onclick="loadData(\'' + i + '\')"><i class="ion-ios-list-outline"></i></button> ' +
                            '<button class="btn btn-icon danger" title="Delete" onclick="del_rekod(\''+field.pk_id+'\')"><i class="ion-trash-b"></i>'
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

// load campus data
function loadData(indexs){
    let data = JSON.parse($("#dataList").val());
    $('#pk_id').val(data[indexs].pk_id);
    $('#upt_clg_id').val(data[indexs].clg_id);
    $('#upt_clg_name').val(data[indexs].clg_name);
    $('#upt_clg_address1').val(data[indexs].clg_address1);
    $('#upt_clg_address2').val(data[indexs].clg_address2);
    $('#upt_clg_address3').val(data[indexs].clg_address3);
    $('#upt_clg_phoneno').val(data[indexs].clg_phoneno);
    $('#upt_clg_faxno').val(data[indexs].clg_faxno);
    $('#upt_clg_email').val(data[indexs].clg_email);

    $('#divButton').html('<input type="submit" class="btn btn-success p-x-md" value="Update">   <input type="button" class="btn btn-white p-x-md" value="Cancel" id="btnCancel">');
    $('#divHeader').html('<h3>Update Campus</h3>');
}

$('#divButton').on('click', '#btnCancel', function(){
    $('#pk_id').val('');
    $('#formCampus')[0].reset();
    $('#divButton').html('<input type="submit" class="btn info p-x-md" id="btnSubmit" value="Save">');
    $('#divHeader').html('<h3>Add Campus</h3>');
});


//-------------------------------------------------- add campus --------------------------------------------------//
var RegisterModel = function (){
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

    self.Register = function (){
        var error = ko.validation.group(self);

        if (error().length > 0) {
            error.showAllMessages();
            return;
        }

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

            $.ajax(settings).done(function (response){
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
const RegisterCollege = document.querySelector("#reg-kolej");
ko.applyBindings(new RegisterModel(), RegisterCollege);
//-------------------------------------------------- end add campus --------------------------------------------------//


//-------------------------------------------------- update campus --------------------------------------------------//
$("#formCampus").on('submit', function (e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Campus xxx",
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
            let upt_clg_id = $("#upt_clg_id").val();
            let upt_clg_name = $("#upt_clg_name").val();
            let upt_clg_address1 = $("#upt_clg_address1").val();
            let upt_clg_address2 = $("#upt_clg_address2").val();
            let upt_clg_address3 = $("#upt_clg_address3").val();
            let upt_clg_phoneno = $("#upt_clg_phoneno").val();
            let upt_clg_faxno = $("#upt_clg_faxno").val();
            let upt_clg_email = $("#upt_clg_email").val();

            var form = new FormData();
            form.append("pk_id", pk_id);
            form.append("clg_id", upt_clg_id);
            form.append("clg_name", upt_clg_name);
            form.append("clg_address2", upt_clg_address2);
            form.append("clg_address1", upt_clg_address1);
            form.append("clg_address3", upt_clg_address3);
            form.append("clg_phoneno", upt_clg_phoneno);
            form.append("clg_faxno", upt_clg_faxno);
            form.append("clg_email", upt_clg_email);
            form.append("recordstatus", "EDT");

            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmCollege/update",
                "method": "POST",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form
            };
    
            $.ajax(settings).done(function (response){
                result = JSON.parse(response);
                if (!result.success){
                    Swal(result.message, result.data, "error");
                    return;
                }
                window.location.reload();
            });
        });
    }
});
//-------------------------------------------------- end update campus --------------------------------------------------//

// delete campus
function del_rekod(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("pk_id", id);

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
    }).then(function (){

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
            window.location.reload();
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

    $.ajax(settings).done(function (response){
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