// let clg_id = getUrlVars()['id'];
let clg_id = window.sessionStorage.idPage;

$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let clg_id = window.sessionStorage.idPage;

    // select programme
    programList(clg_id, function(){
        $('#fac_id').append('<option value="">- Choose -</option>');
        $.each(obj_programme.data, function (i, item) {
            $('#fac_id').append('<option value="'+item.pk_id+'">'+item.fac_name+'</option>');
        });
    });

    // select course type
    courseType(function(){
        $('#crs_type').append('<option value="">- Choose -</option>');
        $.each(obj_crsType.data, function (i, item) {
            $('#crs_type').append('<option value="'+item.crs_type_name+'">'+item.crs_type_name+'</option>');
        });
    });

    // select status
    crsStatus(function(){
        $('#crs_status').append('<option value="">- Choose -</option>');
        $.each(obj_crsStatus.data, function (i, item) {
            $('#crs_status').append('<option value="'+item.status_name+'">'+item.status_name+'</option>');
        });
    });
});
var confirmed = false;

var viewCourse = function (){
    var colums = [
        { "name": "bil", "title": "No." },
        { "name": "crs_code", "title": "Course Code" },
        { "name": "crs_name", "title": "Course Name" },
        { "name": "crs_type", "title": "Course Classification", "breakpoints": "md sm xs" },
        { "name": "fac_id", "title": "Faculty", "breakpoints": "md sm xs" },
        { "name": "crs_status", "title": "Status", "breakpoints": "md sm xs" },
        { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
    ];
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmCourse/listByCampus/"+clg_id,
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
                bil: bil++, pgm_id: field.pgm_id, crs_code: field.crs_code, crs_name: field.crs_name, crs_type: field.crs_type, crs_credit: field.crs_credit, crs_price: field.crs_price, crs_status: field.crs_status, fac_id: field.fac_name,
                upt_btn: '<button class="btn btn-icon accent" title="Details" onclick="detail(\'' +field.pk_id+ '\')" id="btnPerincian"><i class="ion-ios-list-outline"></i></button>'
            });
        });

        $("#courseList").footable({
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
const courseList = document.querySelector("#tableCourse");
ko.applyBindings(viewCourse, courseList);


//-------------------------------------------------- add course --------------------------------------------------//
var RegisterModel = function (){
    var self = this;
    self.fac_id = ko.observable("").extend({
        required: true
    });

    self.crs_code = ko.observable("").extend({
        required: true
    });

    self.crs_name = ko.observable("").extend({
        required: true
    });

    self.crs_type = ko.observable("").extend({
        required: true
    });

    self.crs_credit = ko.observable("");

    self.crs_price = ko.observable("");

    self.crs_status = ko.observable("").extend({
        required: true
    });

    self.Register = function (){
        var error = ko.validation.group(self);

        if (error().length > 0){
            error.showAllMessages();
            return;
        }
        let crs_code = self.crs_code();

        swal({
            title: "Add Course",
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
            form.append("fac_id", self.fac_id());
            form.append("crs_code", crs_code.split(' ').join(''));
            form.append("crs_name", self.crs_name());
            form.append("crs_type", self.crs_type());
            form.append("crs_credit", self.crs_credit());
            form.append("crs_price", self.crs_price());
            form.append("crs_status", self.crs_status());
            form.append("recordstatus",'ADD');

            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmCourse/register",
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
const DdReg = document.querySelector("#reg-kursus");
ko.applyBindings(new RegisterModel(), DdReg);
//-------------------------------------------------- end add course --------------------------------------------------//


// detail Course
function detail(id){
    window.sessionStorage.course_id = id;
    window.location.replace('course_details.html');
}


function courseCodeChecking(self){
    let input = self.value;

    var form = new FormData();
    form.append("input", input);

    var settings = {
    "url": host+"api_tetapan_picoms/public/courseChecking",
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
            $('#submit-course').prop('disabled', true);
        }else{
            $('#check').html('');
            $('#submit-course').prop('disabled', false);
        }
    });
}

function programList(id, returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmFaculty/listByCampus/"+id,
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_programme = response;
        returnValue();
    });
}

function courseType(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/coursetypeList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_crsType = response;
        returnValue();
    });
}

function crsStatus(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/statusList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_crsStatus = response;
        returnValue();
    });
}