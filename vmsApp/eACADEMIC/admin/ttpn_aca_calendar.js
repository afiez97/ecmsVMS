$(function(){
    $.ajaxSetup ({
        cache: false
    });

    // select academic field
    acaField(function(){
        $('#cal_category').append('<option value="">- Choose -</option>');
        $.each(obj_acaField.data, function (i, item) {
            $('#cal_category').append('<option value="'+item.category+'">'+item.category+'</option>');
        });
    });

    // select Status
    statusSem(function(){
        $('#cal_status').append('<option value="">- Choose -</option>');
        $.each(obj_sttSem.data, function (i, item){
            $('#cal_status').append('<option value="'+item.status_sem_name+'">'+item.status_sem_name+'</option>');
        });
    });

    // calendar list
    kalendarList(function(){
        var colums = [
            { "name": "bil", "title": "No." },
            { "name": "cur_year", "title": "Academic Session" },
            { "name": "cal_cohort", "title": "Semester" },
            { "name": "cal_category", "title": "Academic Calendar", "breakpoints": "md sm xs" },
            { "name": "cal_status", "title": "Status", "breakpoints": "md sm xs" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];

        let bil = 1;
        var list = [];

        $.each(obj_kalendarList.data, function (i, field){
            list.push({
                bil: bil++, cal_id: field.cal_id, cur_year: field.cur_year, cal_status: '<span class="text-uppercase">'+field.cal_status+'</span>', cal_cohort: field.cal_cohort, cal_category: '<span class="text-uppercase">'+field.category+'</span>',
                upt_btn: '<button class="btn btn-icon accent" title="Details" onclick="detail(\'' +field.cal_id+ '\')" id="btnPerincian"><i class="ion-ios-list-outline"></i></button>'
            });
        });

        $("#kalAkademikList").footable({
            "columns": colums,
            "rows": list,
            "paging": {
                "enabled": true,
                "size": 10,
                "countFormat": "Showing {PF} to {PL} of {TR} data"
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


// btn Back to Campus Page
$('#btnBack').click(function(){
    window.location.replace('campusPage.html');
});


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
            let cur_year = $('#cur_year').val();
            let cal_cohort = $('#cal_cohort').val();
            let cal_status = $('#cal_status').val();
            let cal_category = $('#cal_category').val();
            let cal_type_sem = $('#cal_type_sem').val();

            var form = new FormData();
            form.append("cur_year", cur_year);
            form.append("cal_status", cal_status);
            form.append("cal_cohort", cal_cohort);
            form.append("cal_category", cal_category);
            form.append("cal_type_sem", cal_type_sem);
            form.append("recordstatus", 'ADD');
            
            var settings = {
                "url": host+"api_tetapan_picoms/public/addCalendar",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Authorization": "picoms " + window.sessionStorage.token
                },
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
    }
});
//-------------------------------------------------- end add academic calendar --------------------------------------------------//


// details academic calendar
function detail(id){
    window.sessionStorage.cal_id = id;
    window.location.replace('ttpn_kalAkademik_det.html');
}

function acaField(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/acaCalCategory/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_acaField = response;
        returnValue();
    });
}