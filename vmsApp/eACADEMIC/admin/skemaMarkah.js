$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let clg_id = window.sessionStorage.idPage;
    let usrRole = window.sessionStorage.usrRole;

    $('#clgId').val(clg_id);
    if( usrRole == 'dekan' || usrRole == 'ketuaPJ' || usrRole == 'pensyarah' ){ $('#btnNew').hide(); }

    $.fn.select2.defaults.set( "theme", "bootstrap" );

    // select course
    courseList(function(){
        $('#gsc_name').append('<option value="">- Choose -</option>');
        $.each(obj_course.data, function(i, item){
            $('#gsc_name').append('<option value="'+item.crsId+'">'+item.crs_code.toUpperCase()+' '+item.crs_name.toUpperCase()+'</option>');
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:'
        });
    });

    // list grading scheme
    gredSchemeList(function(){
        var columns = [
            { "name": "bil", "title": "No." },
            { "name": "fac_name", "title": "Faculty" },
            { "name": "crs_code", "title": "Course Code" },
            { "name": "crs_name", "title": "Course" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];

        let bil = 1;
        var list = [];

        $.each(obj_gredScheme.data, function (i, field){
            let dsplyBtn = '';
            if( usrRole == 'dekan' || usrRole == 'ketuaPJ' || usrRole == 'pensyarah' ){
                dsplyBtn = '<button class="btn btn-icon success" title="List" onclick="itemList(\'' + field.gsc_id + '\')"><i class="ion-ios-list-outline"></i></button>';
            }
            else{ dsplyBtn = '<button class="btn btn-icon accent" title="Details" onclick="detail(\'' + field.gsc_id + '\')"><i class="ion-ios-list-outline"></i></button>'; }

            list.push({
                bil: bil++, crs_code: field.crs_code.toUpperCase(), crs_name: field.crs_name.toUpperCase(), fac_name: field.fac_name.toUpperCase(),
                upt_btn: dsplyBtn
            });
        });

        $("#skemaList").html('');
        $("#skemaList").footable({
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


//-------------------------------------------------- add grading scheme --------------------------------------------------//
$('#formAddGred').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
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
            let clgId = $('#clgId').val();
            let gsc_name = $('#gsc_name').val();

            var form = new FormData();
            form.append("cam_id", clgId);
            form.append("gsc_name", gsc_name);
            form.append("recordstatus",'ADD');
    
            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmGredScheme/register",
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
//-------------------------------------------------- end add grading scheme --------------------------------------------------//


// btn details grading scheme
function detail(id){
    window.sessionStorage.gs_id = id;
    window.location.replace('skemaMarkah_det.html');
}


function itemList(id){
    detailsList(id, function(){
        var columns = [
            { "name": "bil", "title": "No." },
            { "name": "gsd_exam_type", "title": "Items" },
            { "name": "gsd_component", "title": "Component" },
            { "name": "gsd_percentage", "title": "Percentage (%)" }
        ];

        var list = [];
        let bil = 1;

        $.each(obj_detList.data, function (i, field){
            list.push({
                bil: bil++, gsd_exam_type: '<span class="text-uppercase">'+field.examTypeName+'</span>', gsd_component: '<span class="text-uppercase">'+field.gsd_component+'</span>', gsd_percentage: field.gsd_percentage,
            });
        });
        
        $("#listSkemaDet").html('');
        $("#listSkemaDet").footable({
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

    $('#mdlItem').modal('show');
}


function checkId(id){
    let input = id.value;
    findId(input, function(){
        let count = obj_grdSchm.data.length;
        if(count != 0){
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
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_gredScheme = response;
        returnValue();
    });
}