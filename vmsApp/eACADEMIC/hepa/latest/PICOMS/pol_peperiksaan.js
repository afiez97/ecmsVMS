var viewExamPolicy = function () {
    // let list = [];
    var colums = [
        { "name": "bil", "title": "No." },
        { "name": "cur_year", "title": "Session", "breakpoints": "md sm xs" },
        { "name": "reg_semester", "title": "Semester", "breakpoints": "md sm xs" },
        { "name": "cur_intake", "title": "Intake", "breakpoints": "md sm xs" },
        { "name": "pgm_name", "title": "Programme", "breakpoints": "md sm xs" },
        { "name": "pol_exm_type", "title": "Examination Types" },
        { "name": "pol_marks_open", "title": "Open Date" },
        { "name": "pol_marks_close", "title": "End Date" },
        { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        // {"name":"status","title":"Status","breakpoints":"sm xs"}
    ];
    var settings = {
        "url": host+"api_polisi/public/policyExamList",
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
                "bil": bil++, "cur_year": field.cur_year, "reg_semester": field.reg_semester, "cur_intake": field.cur_intake, pgm_name: field.pgm_name, pol_exm_type: field.pol_exm_type, pol_marks_open: field.pol_marks_open, pol_marks_close: field.pol_marks_close,
                "upt_btn":  '<button class="btn success" title="Update" onclick="loadData(\'' + i + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button> ' +
                            '<button class="btn danger" title="Delete" onclick="del_rekod(\''+field.Pk_exam_policy+'\')"><i class="ion-trash-b"></i>'
            });
        });

        $("#polisiExamList").footable({
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
const polisiExamList = document.querySelector("#polisiExamList");
ko.applyBindings(viewExamPolicy, polisiExamList);

// register exam policy
var RegisterModel = function () {
    //Dropdown Semester List
    var settings = {
        "url": host+"api_tetapan_picoms/public/cohortList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };

        $.ajax(settings).done(function (response) {
            //LIST OPTION
            $('#semList').append($('<option>', { 
                value: "",
                text : "Choose Semester" 
            }));
            $.each(response.data, function (i, item) {
                $('#semList').append($('<option>', { 
                    value: item.cohort_name,
                    text : item.cohort_name 
                }));
            });

            //LIST OPTION
            $('#uptSemList').append($('<option>', { 
                value: "",
                text : "Choose Semester" 
            }));
            $.each(response.data, function (i, item) {
                $('#uptSemList').append($('<option>', { 
                    value: item.cohort_name,
                    text : item.cohort_name 
                }));
            });
            
        });
    // END Dropdown Semester List

    //Dropdown Ambilan List
    var settings = {
        "url": host+"api_tetapan_picoms/public/intakeList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };

        $.ajax(settings).done(function (response) {
            //LIST OPTION
            $('#ambilan').append($('<option>', { 
                value: "",
                text : "Choose Intake" 
            }));
            $.each(response.data, function (i, item) {
                $('#ambilan').append($('<option>', { 
                    value: item.intake_name,
                    text : item.intake_name 
                }));
            });

            //LIST OPTION
            $('#updAmbilan').append($('<option>', { 
                value: "",
                text : "Choose Intake" 
            }));
            $.each(response.data, function (i, item) {
                $('#updAmbilan').append($('<option>', { 
                    value: item.intake_name,
                    text : item.intake_name 
                }));
            });
            
        });
    // END Dropdown Ambilan List

    //Dropdown Program List
    var settings = {
        "url": host+"api_tetapan_picoms/public/programmeList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };

        $.ajax(settings).done(function (response) {
            //LIST OPTION
            $('#pgm_id').append($('<option>', { 
                value: "",
                text : "Choose Programme" 
            }));
            $.each(response.data, function (i, item) {
                $('#pgm_id').append($('<option>', { 
                    value: item.pgm_id,
                    text : item.pgm_name 
                }));
            });

            //LIST OPTION EDIT
            $('#upt_pgm_id').append($('<option>', { 
                value: "",
                text : "Choose Programme" 
            }));
            $.each(response.data, function (i, item) {
                $('#upt_pgm_id').append($('<option>', { 
                    value: item.pgm_id,
                    text : item.pgm_name 
                }));
            });
            
        });
    // END Dropdown Program List

    //Dropdown Bidang Akademik List
    var settings = {
        "url": host+"api_tetapan_picoms/public/acaareaList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };

        $.ajax(settings).done(function (response) {
            //LIST OPTION
            $('#cal_category').append($('<option>', { 
                value: "",
                text : "Choose Category"
            }));
            $.each(response.data, function (i, item) {
                $('#cal_category').append($('<option>', { 
                    value: item.aca_area_name,
                    text : item.aca_area_name 
                }));
            });

            //LIST OPTION
            $('#upt_cal_category').append($('<option>', { 
                value: "",
                text : "Choose Category"
            }));
            $.each(response.data, function (i, item) {
                $('#upt_cal_category').append($('<option>', { 
                    value: item.aca_area_name,
                    text : item.aca_area_name 
                }));
            });
            
        });
    // END Dropdown Bidang Akademik List

    var self = this;
    self.cur_year = ko.observable("").extend({
        required: true
    });

    self.reg_semester = ko.observable("").extend({
        required: true
    });

    self.cur_intake = ko.observable("").extend({
        required: true
    });

    self.pgm_id = ko.observable("").extend({
        required: true
    });

    self.pol_category = ko.observable("").extend({
        required: true
    });

    self.pol_exm_type = ko.observable("").extend({
        required: true
    });

    self.pol_marks_open = ko.observable("").extend({
        required: true
    });

    self.pol_marks_close = ko.observable("").extend({
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
            curYear: self.cur_year(),
            regSemester: self.reg_semester(),
            curIntake: self.cur_intake(),
            pgmId: self.pgm_id(),
            polCategory: self.pol_category(),
            polExmType: self.pol_exm_type(),
            polMarksOpen: self.pol_marks_open(),
            polMarksClose: self.pol_marks_close(),
            recordStatus: self.recordstatus(),
        }

        swal({
            title: "Register Examination Policy",
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

            form.append("cur_year", self.cur_year());
            form.append("reg_semester", self.reg_semester());
            form.append("cur_intake", self.cur_intake());
            form.append("pgm_id", self.pgm_id());
            form.append("pol_category", self.pol_category());
            form.append("pol_exm_type", self.pol_exm_type());
            form.append("pol_marks_open", self.pol_marks_open());
            form.append("pol_marks_close", self.pol_marks_close());
            form.append("recordstatus",'ADD');

            var settings = {
                "url": host+"api_polisi/public/addPolicyExam",
                "method": "POST",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form
            };

            $.ajax(settings).done(function (response) {
                // console.log(response);
                result = JSON.parse(response);
                if (!result.success) {
                    Swal(result.message, result.data, "error");
                    return;
                }
                window.location.replace("adminPage.html");
            });
        });
    };
}
const RegisterExamPolicy = document.querySelector("#reg-peperiksaan");
ko.applyBindings(new RegisterModel(), RegisterExamPolicy);

// view data to edit
function loadData(indexs){
    let data = JSON.parse($("#dataList").val());
    $('#exam_policy_id').val(data[indexs].Pk_exam_policy);
    $('#upt_cur_year').val(data[indexs].cur_year);
    $('#uptSemList').val(data[indexs].reg_semester);
    $('#updAmbilan').val(data[indexs].cur_intake);
    $('#upt_pgm_id').val(data[indexs].pgm_id);
    $('#upt_cal_category').val(data[indexs].pol_category);
    $('#jenisPeperiksaan').val(data[indexs].pol_exm_type);
    $('#upt_open_date').val(data[indexs].pol_marks_open);
    $('#upt_end_date').val(data[indexs].pol_marks_close);

    $("#update-peperiksaan").modal("show");
}

// update exam policy
$("#upt_examPolicy").click(function () {
    let Pk_exam_policy = $('#exam_policy_id').val();
    let upt_cur_year = $("#upt_cur_year").val();
    let uptSemList = $("#uptSemList").val();
    let updAmbilan = $("#updAmbilan").val();
    let upt_pgm_id = $("#upt_pgm_id").val();
    let upt_cal_category = $("#upt_cal_category").val();
    let jenisPeperiksaan = $("#upt_jenisPeperiksaan").val();
    let upt_open_date = $("#upt_open_date").val();
    let upt_end_date = $("#upt_end_date").val();
    let statusrekod = "EDT";
    // alert(jenisPeperiksaan);

    var form = new FormData();
        form.append('Pk_exam_policy', Pk_exam_policy);
        form.append("cur_year", upt_cur_year);
        form.append("reg_semester", uptSemList);
        form.append("cur_intake", updAmbilan);
        form.append("pgm_id", upt_pgm_id);
        form.append("pol_category", upt_cal_category);
        form.append("pol_exm_type", jenisPeperiksaan);
        form.append("pol_marks_open", upt_open_date);
        form.append("pol_marks_close", upt_end_date);
        form.append("recordstatus", statusrekod);

    swal({
            title: "Update Examination Policy",
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
                "url": host+"api_polisi/public/policyExamUpdate",
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
    let Pk_exam_policy = id;

    var form = new FormData();
    form.append("recordstatus", statusrekod);
    form.append("Pk_exam_policy", Pk_exam_policy);
    

    swal({
        title: "Remove Examination Policy",
        text: "Are You Sure?",
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Remove",
        confirmButtonColor: "#ef193c",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false
    }).then(function(){

        var settings = {
            "url": host+"api_polisi/public/policyExamDelete",
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
            if (!result.success){
                Swal(result.message, result.data, "error");
                return;
            }
            window.location.replace("adminPage.html");
        });
    });

}