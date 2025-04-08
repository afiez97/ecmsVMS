let clg_id = window.sessionStorage.idPage;
$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let clg_id = window.sessionStorage.idPage;

    // select course
    courseList(clg_id, function(){
        $('#gsc_name').append('<option value="">- Choose -</option>');
        $.each(obj_course.data, function(i, item){
            $('#gsc_name').append('<option value="'+item.pk_id+'">'+item.crs_code.toUpperCase()+' '+item.crs_name.toUpperCase()+'</option>');
        });
    });

    // list grading scheme
    gredSchemeList(function(){
        var columns = [
            { "name": "bil", "title": "No." },
            { "name": "crs_code", "title": "Course Code" },
            { "name": "crs_name", "title": "Course" },
            { "name": "fac_name", "title": "Faculty" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];

        let bil = 1;
        var list = [];

        $.each(obj_gredScheme.data, function (i, field) {
            list.push({
                bil: bil++, crs_code: field.crs_code.toUpperCase(), crs_name: field.crs_name.toUpperCase(), fac_name: field.fac_name.toUpperCase(),
                upt_btn: '<button class="btn btn-icon accent" title="Details" onclick="detail(\'' + field.gsc_id + '\')" id="btnPerincian"><i class="ion-ios-list-outline"></i></button>'
            });
        });

        $("#skemaList").html('');
        $("#skemaList").footable({
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
});
var confirmed = false;


//-------------------------------------------------- add grading scheme --------------------------------------------------//
var RegisterModel = function (){
    var self = this;
    self.gsc_name = ko.observable("").extend({
        required: true,
    });

    self.Register = function (){
        var error = ko.validation.group(self);

        if (error().length > 0){
            error.showAllMessages();
            return;
        }

        swal({
            title: "Add Grading Scheme",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            var form = new FormData();
            form.append("cam_id", clg_id);
            form.append("gsc_name", self.gsc_name());
            form.append("recordstatus",'ADD');

            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmGredScheme/register",
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
const RegisterSkema = document.querySelector("#reg-skema");
ko.applyBindings(new RegisterModel(), RegisterSkema);
//-------------------------------------------------- end add grading scheme --------------------------------------------------//


// btn details grading scheme
function detail(id){
    window.sessionStorage.gs_id = id;
    window.location.replace('skemaMarkah_det.html');
}


function courseList(id, returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmCourse/selectCrs/"+id,
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_course = response;
        returnValue();
    });
}


function checkId(id){
    let input = id.value;

    var form = new FormData();
    form.append("input", input);

    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmGredScheme/checkName",
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
            $('#check').html('Data Already Exists In The System');
            $('#btnSubmit').prop('disabled', true);
        }
        else{
            $('#check').html('');
            $('#btnSubmit').prop('disabled', false);
        }
    });
}


function gredSchemeList(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmGredScheme/list",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_gredScheme = response;
        returnValue();
    });
}




