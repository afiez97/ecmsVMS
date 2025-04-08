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

    // select level of study
    levelStudy(function(){
        $('#pgm_category').append('<option value="">- Choose -</option>');
        $.each(obj_levelStudy.data, function (i, item) {
            $('#pgm_category').append('<option value="'+item.id+'">'+item.category_name+'</option>');
        });

        $('.slct2').select2({
            width: "100%",
            containerCssClass: ':all:',
        });
    });

    // select academic calendar
    calCatList(function(){
        $('#pgm_area').append('<option value="">- Choose -</option>');
        $.each(obj_acaField.data, function (i, item) {
            $('#pgm_area').append('<option value="'+item.pk_id+'">'+item.category+'</option>');
        });

        $('.slct2').select2({
            width: "100%",
            containerCssClass: ':all:',
        });
    });

    // select mode of study
    modeStudy(function(){
        $('#pgm_mode').append('<option value="">- Choose -</option>');
        $.each(obj_modeStudy.data, function (i, item) {
            $('#pgm_mode').append('<option value="'+item.id+'">'+item.mode_name+'</option>');
        });

        $('.slct2').select2({
            width: "100%",
            containerCssClass: ':all:',
        });
    });

    // select mqf level
    mqfLevel(function(){
        $('#pgm_mqflevel').append('<option value="">-Choose-</option>');
        $.each(obj_mqfLevel.data, function (i, item) {
            $('#pgm_mqflevel').append('<option value="'+item.id+'">'+item.mqflevel_name+'</option>');
        });

        $('.slct2').select2({
            width: "100%",
            containerCssClass: ':all:',
        });
    });

    // select status
    statusList(function(){
        $('#pgm_status').append('<option value="">- Choose -</option>');
        $.each(obj_status.data, function (i, item) {
            $('#pgm_status').append('<option value="'+item.status_name+'">'+item.status_name+'</option>');
        });
    });

    // list Programme
    pgmList(function(){
        var columns = [
            { "name": "bil", "title": "No." },
            { "name": "pgm_id", "title": "Code" },
            { "name": "pgm_name", "title": "Programme" },
            { "name": "aca_calendar", "title": "Academic Calendar", "breakpoints": "md sm xs"},
            { "name": "pgm_category", "title": "Level of Study", "breakpoints": "md sm xs"},
            { "name": "fac_name", "title": "Faculty", "breakpoints": "md sm xs" },
            { "name": "pgm_status", "title": "Status", "breakpoints": "md sm xs" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];

        let bil = 1;
        let list = [];

        $.each(obj_pgmList.data, function (i, field){
            list.push({
                bil: bil++, pgm_category: '<span class="text-uppercase">'+field.category_name+'</span>', pgm_id: '<span class="text-uppercase">'+field.pgm_id+'</span>', aca_calendar: '<span class="text-uppercase">'+field.category+'</span>',
                fac_name: '<span class="text-uppercase">'+field.facCode+'</span>', pgm_name: '<span class="text-uppercase">'+field.pgm_name+'</span>', pgm_status: '<span class="text-uppercase">'+field.pgm_status+'</span>',
                "upt_btn": '<button class="btn btn-icon accent" title="Details" onclick="detail(\'' + field.progId + '\')" id="btnPerincian"><i class="ion-ios-list-outline"></i></button>'
            });
        });

        $("#programList").footable({
            "columns": columns,
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


//-------------------------------------------------- add programme --------------------------------------------------//
$('#formAddPgm').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
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
            let fac_id = $('#fac_id').val();
            let pgm_category = $('#pgm_category').val();
            let pgm_area = $('#pgm_area').val();
            let pgm_id = $('#pgm_id').val();
            let pgm_name = $('#pgm_name').val();
            let pgm_mode = $('#pgm_mode').val();
            let pgm_mqflevel = $('#pgm_mqflevel').val();
            let pgm_duration = $('#pgm_duration').val();
            let pgm_status = $('#pgm_status').val();
            let pgm_fee = $('#tuition_fee').val();
            let pgm_fee_usd = $('#tuition_fee_usd').val();
            let pgm_tcrdpass = $('#pgm_tcrdpass').val();

            var form = new FormData();
            form.append("fac_id", fac_id);
            form.append("pgm_category", pgm_category);
            form.append("pgm_area", pgm_area);
            form.append("pgm_id", pgm_id);
            form.append("pgm_name", pgm_name);
            form.append("pgm_mode", pgm_mode);
            form.append("pgm_mqflevel", pgm_mqflevel);
            form.append("pgm_duration", pgm_duration);
            form.append("pgm_status", pgm_status);
            form.append("pgm_fee", pgm_fee);
            form.append("pgm_fee_usd", pgm_fee_usd);
            form.append("pgm_tcrdpass", pgm_tcrdpass);
            form.append("recordstatus", 'ADD');
    
            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmProg/register",
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
                if (!result.success){
                    Swal(result.message, result.data, "error");
                    return;
                }
                window.location.reload();
            });
        });
    }
});
//-------------------------------------------------- end add programme --------------------------------------------------//


// btn detail programme
function detail(id){
    window.sessionStorage.prog_id = id;
    window.location.replace('ttpn_program_det.html');
}


// check programme code
function codeChecking(code){
    let input = code.value;

    var form = new FormData();
    form.append("input", input);

    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmProg/progCodeChecking",
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
            $('#submit-program').prop('disabled', true);
        }
        else{
            $('#check').html('');
            $('#submit-program').prop('disabled', false);
        }
    });
}

function pgmList(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmProg/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_pgmList = response;
        returnValue();
    });
}
