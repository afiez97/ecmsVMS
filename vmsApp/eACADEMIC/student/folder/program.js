let clg_id = window.sessionStorage.idPage;

$(function(){
    $.ajaxSetup ({
        cache: false
    });

    // select faculty
    facList(clg_id, function(){
        $('#fac_id').append('<option value="">- Choose -</option>');
        $.each(obj_faculty.data, function (i, item) {
            $('#fac_id').append('<option value="'+item.pk_id+'">'+item.fac_name+'</option>');
        });
    });

    // select level of study
    levelStudy(function(){
        $('#pgm_category').append('<option value="">- Choose -</option>');
        $.each(obj_levelStudy.data, function (i, item) {
            $('#pgm_category').append('<option value="'+item.category_name+'">'+item.category_name+'</option>');
        });
    });

    // select field of study
    fieldStudy(function(){
        $('#pgm_area').append('<option value="">- Choose -</option>');
        $.each(obj_fieldStudy.data, function (i, item) {
            $('#pgm_area').append('<option value="'+item.aca_area_name+'">'+item.aca_area_name+'</option>');
        });
    });

    // select mode of study
    modeStudy(function(){
        $('#pgm_mode').append('<option value="">- Choose -</option>');
        $.each(obj_modeStudy.data, function (i, item) {
            $('#pgm_mode').append('<option value="'+item.mode_name+'">'+item.mode_name+'</option>');
        });
    });

    // select mqf level
    mqfLevel(function(){
        $('#pgm_mqflevel').append('<option value="">-Choose-</option>');
        $.each(obj_mqfLevel.data, function (i, item) {
            $('#pgm_mqflevel').append('<option value="'+item.mqflevel_name+'">'+item.mqflevel_name+'</option>');
        });
    });

    // select status
    sttsPgm(function(){
        $('#pgm_status').append('<option value="">-Choose-</option>');
        $.each(obj_status.data, function (i, item) {
            $('#pgm_status').append('<option value="'+item.status_name+'">'+item.status_name+'</option>');
        });
    });
});
var confirmed = false;

var viewProgram = function (){
    let list = [];
    var columns = [
        { "name": "bil", "title": "No." },
        { "name": "pgm_category", "title": "Level of Study", "breakpoints": "md sm xs"},
        { "name": "pgm_id", "title": "Programme Code" },
        { "name": "pgm_name", "title": "Programme Name" },
        { "name": "fac_name", "title": "Faculty", "breakpoints": "md sm xs" },
        { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
    ];
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmProg/listByCampus/"+clg_id,
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        let bil = 1;

        $.each(response.data, function (i, field){
            list.push({
                bil: bil++, pgm_category: field.pgm_category, pgm_id: field.pgm_id, fac_name: field.fac_name,
                pgm_name: field.pgm_name, fac_id: field.fac_id, pgm_area: field.pgm_area, pgm_mqflevel: field.pgm_mqflevel, 
                pgm_duration: field.pgm_duration, pgm_status: field.pgm_status,
                "upt_btn": '<button class="btn btn-icon accent" title="Details" onclick="detail(\'' + field.pk_id + '\')" id="btnPerincian"><i class="ion-ios-list-outline"></i></button>'
            });
        });

        $("#programList").footable({
            "columns": columns,
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
const programList = document.querySelector("#tableProgram");
ko.applyBindings(viewProgram, programList);


//-------------------------------------------------- add programme --------------------------------------------------//
var RegisterModel = function (){
    var self = this;
    self.fac_id = ko.observable("").extend({
        required: true,
    });

    self.pgm_category = ko.observable("").extend({
        required: true
    });

    self.pgm_area = ko.observable("").extend({
        required: true
    });

    self.pgm_id = ko.observable("").extend({
        required: true
    });

    self.pgm_name = ko.observable("").extend({
        required: true
    });

    self.pgm_mode = ko.observable("").extend({
        required: true
    });

    self.pgm_mqflevel = ko.observable("").extend({
        required: true
    });

    self.pgm_duration = ko.observable("").extend({
        required: true
    });

    self.pgm_status = ko.observable("").extend({
        required: true
    });

    self.tuition_fee = ko.observable("");

    self.Register = function (){
        var error = ko.validation.group(self);

        if (error().length > 0){
            error.showAllMessages();
            return;
        }

        var form = new FormData();
        form.append("fac_id", self.fac_id());
        form.append("pgm_category", self.pgm_category());
        form.append("pgm_area", self.pgm_area());
        form.append("pgm_id", self.pgm_id());
        form.append("pgm_name", self.pgm_name());
        form.append("pgm_mode", self.pgm_mode());
        form.append("pgm_mqflevel", self.pgm_mqflevel());
        form.append("pgm_duration", self.pgm_duration());
        form.append("pgm_status", self.pgm_status());
        form.append("pgm_fee", self.tuition_fee());
        form.append("recordstatus", 'ADD');

        swal({
            title: "Add Programme",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmProg/register",
                "method": "POST",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form
            };

            $.ajax(settings).done(function (response){
                console.log(response);
                result = JSON.parse(response);
                if (!result.success){
                    Swal(result.message, result.data, "error");
                    return;
                }
                window.location.reload();
            });
        });
    };
}
const RegisterDetModel = document.querySelector("#reg-program");
ko.applyBindings(new RegisterModel(), RegisterDetModel);
//-------------------------------------------------- end add programme --------------------------------------------------//


// btn detail programme
function detail(id){
    window.sessionStorage.prog_id = id;
    window.location.replace('programDet.html');
}


function facList(id, returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmFaculty/listByCampus/"+id,
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_faculty = response;
        returnValue();
    });
}

function levelStudy(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/categoryList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_levelStudy = response;
        returnValue();
    });
}

function fieldStudy(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/acaareaList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_fieldStudy = response;
        returnValue();
    });
}

function modeStudy(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/modeList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_modeStudy = response;
        returnValue();
    });
}

function mqfLevel(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/mqflevelList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_mqfLevel = response;
        returnValue();
    });
}

function sttsPgm(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/statusList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_status = response;
        returnValue();
    });
}
