$(function(){
    $.ajaxSetup ({
        cache: false
    });

    // select academic field
    acaField(function(){
        $('#cal_category').append('<option value="">- Choose -</option>');
        $.each(obj_acaField.data, function (i, item) {
            $('#cal_category').append('<option value="'+item.aca_area_name+'">'+item.aca_area_name+'</option>');
        });
    });

    // select semester type
    semType(function(){
        $('#cal_type_sem').append('<option value="">- Choose -</option>');
        $.each(obj_semType.data, function (i, item){
            $('#cal_type_sem').append('<option value="'+item.sem_type_name+'">'+item.sem_type_name+'</option>');
        });
    });

    cur_year(function(){
        $("#cur_year").append('<option value="">- Choose -</option>');
        $.each(obj_curYear.data,function(i,field){
            currentYear = field.cur_year;
            $("#cur_year").append('<option value="'+currentYear.replace('/','-')+'" >'+field.cur_year+'</option>');
        });
    });
});
var confirmed = false;

// onchange select Academic Session
$("#cur_year").change(function(){
    $("#cal_intake").html('<option value="">- Choose -</option>');
    currentYear = $("#cur_year").val();
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmCuryear/opt_intake/"+currentYear,
        "method": "GET",
        "timeout": 0,
    };
      
    $.ajax(settings).done(function (response) {
        obj_cohort = response;

        $.each(obj_cohort.data,function(i,field){
            $("#cal_intake").append('<option value="'+field.cur_intake+'" data-semester="'+field.cur_semester+'">'+field.cur_intake+'</option>');
        });
    });    
});

// onchange select Intake
$("#cal_intake").change(function(){
    let intake = $(this).find(':selected').data('semester');
    $('#cal_cohort').val(intake);
});

var viewKalAkademik = function (){
    var colums = [
        { "name": "bil", "title": "No." },
        { "name": "cur_year", "title": "Academic Session" },
        { "name": "cal_intake", "title": "Intake",  },
        { "name": "cal_cohort", "title": "Semester", "breakpoints": "md sm xs" },
        { "name": "cal_category", "title": "Academic Field" },
        // { "name": "cal_semno", "title": "Study Scheme", "breakpoints": "md sm xs" },
        { "name": "cal_type_sem", "title": "Semester Type", "breakpoints": "md sm xs" },
        { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
    ];
    var settings = {
        "url": host+"api_tetapan_picoms/public/calendarList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        let bil = 1;
        var list = [];

        $.each(response.data, function (i, field) {
            list.push({
                bil: bil++, cal_id: field.cal_id, cur_year: field.cur_year, cal_intake: field.cal_intake, cal_cohort: field.cal_cohort, cal_category: field.cal_category, 
                // cal_semno: field.cal_semno, 
                cal_type_sem: field.cal_type_sem,
                upt_btn: '<button class="btn btn-icon accent" title="Details" onclick="detail(\'' +field.cal_id+ '\')" id="btnPerincian"><i class="ion-ios-list-outline"></i></button>'
            });
        });

        $("#kalAkademikList").footable({
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
const kalAkademikList = document.querySelector("#tableKalAkademik");
ko.applyBindings(viewKalAkademik, kalAkademikList);


//-------------------------------------------------- add academic calendar --------------------------------------------------//
$("#formAddAcaCal").on('submit', function (e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Academic Calendar",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let cur_year = $('#cur_year').val().replace('-','/');
            let cal_cohort = $('#cal_cohort').val();
            let cal_intake = $('#cal_intake').val();
            let cal_category = $('#cal_category').val();
            let cal_type_sem = $('#cal_type_sem').val();

            var form = new FormData();
            form.append("cur_year", cur_year);
            form.append("cal_intake", cal_intake);
            form.append("cal_cohort", cal_cohort);
            form.append("cal_category", cal_category);
            // form.append("cal_semno", self.cal_semno());
            form.append("cal_type_sem", cal_type_sem);
            form.append("recordstatus", 'ADD');
            

            var settings = {
                "url": host+"api_tetapan_picoms/public/addCalendar",
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
    }
});
//-------------------------------------------------- end add academic calendar --------------------------------------------------//


// details academic calendar
function detail(id){
    window.sessionStorage.cal_id = id;
    window.location.replace('ttpn_kalAkademik_det.html');
}

function cur_year(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmCuryear/opt_curYear",
        "method": "GET",
        "timeout": 0,
      };
      
      $.ajax(settings).done(function (response) {
        obj_curYear = response;
        returnValue();
      });    
}

function acaField(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/acaareaList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_acaField = response;
        returnValue();
    });
}

function semType(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/semtypeList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_semType = response;
        returnValue();
    });
}


