$(function(){
    $.ajaxSetup ({
        cache: false
    });

    selectmonth();
    selectYear();

    // Dropdown Status
    var settings = {
        "url": host+"api_tetapan_picoms/public/statussemList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        $('#cur_status').append('<option value="">- Choose -</option>');
        $.each(response.data, function (i, item){
            $('#cur_status').append('<option value="'+item.status_sem_name+'">'+item.status_sem_name+'</option>');
        });

        $('#upt_cur_status').append('<option value="">- Choose -</option>');
        $.each(response.data, function (i, item){
            $('#upt_cur_status').append('<option value="'+item.status_sem_name+'">'+item.status_sem_name+'</option>');
        });
    }); // END Dropdown Status
});
var confirmed = false;

var viewCurYear = function (){
    var colums = [
        { "name": "bil", "title": "No." },
        { "name": "cur_year", "title": "Academic Session" },
        { "name": "cur_semester", "title": "Semester", },
        { "name": "cur_intake", "title": "Intake", },
        { "name": "cur_status", "title": "Status", "breakpoints": "md sm xs" },
        { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
    ];
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmCuryear/list",
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
                bil: bil++, cur_year: field.cur_year, cur_intake: field.cur_intake, cur_semester: field.cur_semester, cur_status: field.cur_status,
                upt_btn:  '<button class="btn btn-icon success" title="Update" onclick="loadData(\'' + i + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button> ' +
                            '<button class="btn btn-icon danger" title="Remove" onclick="del_rekod(\''+field.id+'\')"><i class="ion-trash-b"></i>'
            });
        });

        $("#curYearList").footable({
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
const curYearList = document.querySelector("#tableCurYear");
ko.applyBindings(viewCurYear, curYearList);


//-------------------------------------------------- add Academic Session/Intake --------------------------------------------------//
var RegisterModel = function (){
    var self = this;
    self.cur_year = ko.observable("").extend({
        required: true
    });

    self.cur_intake_month = ko.observable("").extend({
        required: true
    });

    self.cur_intake_year = ko.observable("").extend({
        required: true
    });

    self.cur_semester = ko.observable("").extend({
        required: true
    });

    self.cur_status = ko.observable("").extend({
        required: true
    });

    self.Register = function (){
        var error = ko.validation.group(self);
        
        if(error().length > 0){
            error.showAllMessages();
            return;
        }

        swal({
            title: "Add Academic Session/Intake",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let cur_intake_month = self.cur_intake_month();
            let cur_intake_year = self.cur_intake_year();
            let cur_intake = cur_intake_month+'-'+cur_intake_year;

            var form = new FormData();
            form.append("cur_year", self.cur_year());
            form.append("cur_intake", cur_intake);
            form.append("cur_semester", self.cur_semester());
            form.append("cur_status", self.cur_status());
            form.append("recordstatus", 'ADD');

            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmCuryear/register",
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
const DdReg = document.querySelector("#reg-semasa");
ko.applyBindings(new RegisterModel(), DdReg);
//-------------------------------------------------- end add Academic Session/Intake --------------------------------------------------//


function selectmonth(){
    $('#cur_intake_month').append('<option value="">- Choose Month -</option>');
    for(i=1;i<13;i++){
        date = new Date('2022-'+i+'-01');  // 2009-11-10
        month = date.toLocaleString('default', { month: 'short' });
        $('#cur_intake_month').append('<option value="'+month.toUpperCase()+'">'+month.toUpperCase()+'</option>');
        $('#upt_cur_intake_month').append('<option value="'+month.toUpperCase()+'">'+month.toUpperCase()+'</option>');
    }
}

function selectYear(){
    $("#cur_intake_year").append('<option>- Choose Year -</option>');
    date = new Date();  // 2009-11-10
    year = date.getFullYear();
    for(i = (year+5);i>2015;i--){
        select = "";
        if(i == year){
            select = "selected";
        }
        $("#cur_intake_year").append('<option '+select+' value="'+i+'" >'+i+'</option>');
        $("#upt_cur_intake_year").append('<option '+select+' value="'+i+'" >'+i+'</option>');
    }
}

function loadData(indexs){
    let data = JSON.parse($("#dataList").val());
    let cur_intake = data[indexs].cur_intake;
    let upt_cur_intake_month = cur_intake.substring(0,3);
    let upt_cur_intake_year = cur_intake.substring(4,8);
    // alert(upt_cur_intake_month);

    $('#pk_id').val(data[indexs].id);
    $('#upt_cur_year').val(data[indexs].cur_year);
    $('#upt_cur_intake_month').val(upt_cur_intake_month);
    $('#upt_cur_intake_year').val(upt_cur_intake_year);
    $('#upt_cur_semester').val(data[indexs].cur_semester);
    $('#upt_cur_status').val(data[indexs].cur_status);

    $("#update-semasa").modal("show");
}


//-------------------------------------------------- update Academic Session/Intake --------------------------------------------------//
$("#formUptSession").on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Academic Session/Intake",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let id = $("#pk_id").val();
            let upt_cur_year = $("#upt_cur_year").val();
            let upt_cur_intake_month = $("#upt_cur_intake_month").val();
            let upt_cur_intake_year = $("#upt_cur_intake_year").val();
            let cur_intake = upt_cur_intake_month+'-'+upt_cur_intake_year;
            let upt_cur_semester = $("#upt_cur_semester").val();
            let upt_cur_status = $("#upt_cur_status").val();
            let statusrekod = "EDT";

            var form = new FormData();
            form.append("id", id);
            form.append("cur_year", upt_cur_year);
            form.append("cur_intake", cur_intake);
            form.append("cur_semester", upt_cur_semester);
            form.append("cur_status", upt_cur_status);
            form.append("recordstatus", statusrekod);
    
            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmCuryear/update",
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
//-------------------------------------------------- end update Academic Session/Intake --------------------------------------------------//


function del_rekod(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("id", id);

    swal({
        title: "Remove Academic Session/Intake",
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
            "url": host+"api_tetapan_picoms/public/curyearDelete",
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
            window.location.reload();
        });
    });
}

