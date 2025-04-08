$(function(){
    $.ajaxSetup ({
        cache: false
    });

    $.fn.select2.defaults.set( "theme", "bootstrap" );

    // select faculty
    getFaculty(function(){
        $('#fac_id').append('<option value="">- Choose -</option>');
        $.each(obj_getFaculty.data, function (i, item) {
            $('#fac_id').append('<option value="'+item.pk_id+'">'+item.fac_id+'</option>');
        });

        $('.slct2').select2({
            width: "100%",
            containerCssClass: ':all:',
        });
    });

    // select status
    statusList(function(){
        $('#crs_status').append('<option value="">- Choose -</option>');
        $.each(obj_status.data, function (i, item) {
            $('#crs_status').append('<option value="'+item.status_name+'">'+item.status_name+'</option>');
        });
    });

    // Course List
    courseList(function(){
        var colums = [
            { "name": "bil", "title": "No." },
            { "name": "crs_code", "title": "Course Code" },
            { "name": "crs_name", "title": "Course Name" },
            { "name": "fac_id", "title": "Faculty", "breakpoints": "md sm xs" },
            { "name": "crs_status", "title": "Status", "breakpoints": "md sm xs" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];

        let bil = 1;
        let convertList = JSON.stringify(obj_course.data);
        $("#dataList").val(convertList);
        var list = [];

        $.each(obj_course.data, function (i, field) {
            list.push({
                bil: bil++, crs_code: '<span class="text-uppercase">'+field.crs_code+'</span>', crs_name: '<span class="text-uppercase">'+field.crs_name+'</span>', 
                crs_status: '<span class="text-uppercase">'+field.crs_status+'</span>', fac_id: '<span class="text-uppercase">'+field.fac_name+'</span>',
                upt_btn: '<button class="btn btn-icon accent" title="Details" onclick="detail(\'' +field.crsId+ '\')" id="btnPerincian"><i class="ion-ios-list-outline"></i></button>'
            });
        });

        $("#courseList").footable({
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


//-------------------------------------------------- add course --------------------------------------------------//
$('#formAddCourse').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
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
        }).then(function (){
            let fac_id = $('#fac_id').val();
            let crs_code = $('#crs_code').val();
            let crs_name = $('#crs_name').val();
            let crs_credit = $('#crs_credit').val();
            let crs_price = $('#crs_price').val();
            let crs_price_usd = $('#crs_price_usd').val();
            let crs_status = $('#crs_status').val();
            let counted_cgpa = '';
            if($('#chkCGPA').prop('checked') == true){ counted_cgpa = 'Yes'; }
            else{ counted_cgpa = 'No' }

            var form = new FormData();
            form.append("fac_id", fac_id);
            form.append("crs_code", crs_code.split(' ').join(''));
            form.append("crs_name", crs_name);
            form.append("crs_credit", crs_credit);
            form.append("crs_price", crs_price);
            form.append("crs_price_usd", crs_price_usd);
            form.append("crs_status", crs_status);
            form.append("counted_cgpa", counted_cgpa);
            form.append("recordstatus",'ADD');

            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmCourse/register",
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
//-------------------------------------------------- end add course --------------------------------------------------//


// detail Course
function detail(id){
    window.sessionStorage.course_id = id;
    window.location.replace('ttpn_kursusDet.html');
}


function courseCodeChecking(self){
    let input = self.value;

    var form = new FormData();
    form.append("input", input);

    var settings = {
        "url": host+"api_tetapan_picoms/public/courseChecking",
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
        if(result.data != ''){
            $('#check').html('Data Already Exists');
            $('#submit-course').prop('disabled', true);
        }
        else{
            $('#check').html('');
            $('#submit-course').prop('disabled', false);
        }
    });
}