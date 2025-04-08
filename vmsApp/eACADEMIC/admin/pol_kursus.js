$(function(){
    $.ajaxSetup ({
        cache: false
    });

    $.fn.select2.defaults.set( "theme", "bootstrap" );

    // select academic Session
    acaCalActive2(function(){
        $('#currYear').append('<option value="">- Choose -</option>');
        $.each(obj_kalendar.data, function (i, item){
            $('#currYear').append('<option value="'+item.cal_id+'" calYear="'+item.cur_year+'" calSem="'+item.cal_cohort+'">'+item.cur_year.replace('/','')+'/'+item.cal_cohort+'</option>');
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:'
        });
    });

    // show data
    addDropPolicy(function(){

        // capaianPolicy = load_capaian();
        load_capaian();
        capaianPolicy = window.capaianData;
        // console.log(capaianPolicy);
        let addPolicy = capaianPolicy[0];
        let uptPolicy = capaianPolicy[1];
        let delPolicy = capaianPolicy[2];
    
        console.log(addPolicy);
        console.log(uptPolicy);
        console.log(delPolicy);
    
        if (addPolicy == 0){
            PolicyAddDisabled = 'disabled';
        }
        else{
            PolicyAddDisabled = ''; 
        }
    
        if (uptPolicy == 0){
            PolicyUpdateDisabled = 'disabled';
        }
        else{
            PolicyUpdateDisabled = ''; 
        }
    
    
        if (delPolicy == 0){
            PolicyDelDisabled = 'disabled';
        }
        else{
            PolicyDelDisabled = ''; 
        }


        var colums = [
            { "name": "bil", "title": "No." },
            { "name": "cur_year", "title": "Academic Session" },
            { "name": "acaCalendar", "title": "Category" },
            { "name": "start_date", "title": "Start Date", "breakpoints": "md sm xs" },
            { "name": "end_date", "title": "End Date", "breakpoints": "md sm xs" },
            { "name": "status", "title": "Status", "breakpoints": "md sm xs" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" }
        ];

        let bil = 1;
        let convertList = JSON.stringify(obj_addDropPol.data);
        $("#dataList").val(convertList);
        var list = [];

        $.each(obj_addDropPol.data, function (i, field){
            list.push({
                bil: bil++, cur_year: field.cal_year.replace('/','')+'/'+field.cal_cohort, 
                acaCalendar: field.category, start_date: formatDate(field.start_date), 
                end_date: formatDate(field.end_date), status: '<span class="text-uppercase">'+field.status+'</span>',
                upt_btn: '<button class="btn btn-icon success" '+PolicyUpdateDisabled+' title="Update" onclick="loadData(\'' + i + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button> ' +
                        '<button class="btn btn-icon danger" '+PolicyDelDisabled+' title="Delete" onclick="del_rekod(\''+field.addDrop_id+'\')"><i class="ion-trash-b"></i>'
            });

            $("#polisiList").footable({
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
});
var confirmed = false;


//-------------------------------------------------- add policy --------------------------------------------------//
$("#addPolicy").on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Add/Drop Course Policy",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function(){
            let aca_calendar = $("#aca_calendar").val();
            let start_date = $('#tarikhMula').val();
            let end_date = $("#tarikhAkhir").val();
            let status = $("#status").val();

            var form = new FormData();
            form.append("aca_calendar", aca_calendar);
            form.append('start_date', start_date);
            form.append("end_date", end_date);
            form.append("status", status);
            form.append("recordstatus", 'ADD');

            var settings = {
                "url": host+"api_polisi/public/misAdddropPol/register",
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
//-------------------------------------------------- end add policy --------------------------------------------------//


//-------------------------------------------------- loadData --------------------------------------------------//
function loadData(indexs){
    let data = JSON.parse($("#dataList").val());
    data = data[indexs];
    let selectSession = data.cal_year;
    let sem = data.cal_cohort;

    $('#addDrop_id').val(data.addDrop_id);
    $('#tarikhMula_upt').val(data.start_date);
    $('#tarikhAkhir_upt').val(data.end_date);
    $('#upt_status').val(data.status);
    $('#currYear_upt').val(selectSession.replace('/','')+'/'+data.cal_cohort);

    // select Category
    catByYearSem(selectSession, sem, function(){
        $('#upt_aca_calendar').html('');
        $('#upt_aca_calendar').append('<option value="">- Choose -</option>');
        $.each(obj_kalendar.data, function(i, item){
            $('#upt_aca_calendar').append('<option value="'+item.cal_id+'">'+item.category+'</option>');
        });
        $('#upt_aca_calendar').val(data.aca_calendar);
    });
    
    $("#mdlUptForm").modal("show");
}
//-------------------------------------------------- end loadData --------------------------------------------------//
    

//-------------------------------------------------- update policy --------------------------------------------------//
$("#updatePolicy").on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Add/Drop Course Policy",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function(){
            let addDrop_id = $('#addDrop_id').val();
            let aca_calendar = $("#upt_aca_calendar").val();
            let start_date = $('#tarikhMula_upt').val();
            let end_date = $("#tarikhAkhir_upt").val();
            let status = $("#upt_status").val();

            var form = new FormData();
            form.append('addDrop_id', addDrop_id);
            form.append("aca_calendar", aca_calendar);
            form.append('start_date', start_date);
            form.append("end_date", end_date);
            form.append("status", status);
            form.append("recordstatus", "EDT");

            var settings = {
                "url": host+"api_polisi/public/misAdddropPol/update",
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
//-------------------------------------------------- end update policy --------------------------------------------------//


function del_rekod(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("addDrop_id", id);

    swal({
        title: "Remove Add/Drop Course Policy",
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
            "url": host+"api_polisi/public/misAdddropPol/delete",
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


//-------------------------------------------------- end function change --------------------------------------------------//
$('#currYear').change(function(){
    let selectSession = $("#currYear option:selected").attr("calYear");
    let sem = $("#currYear option:selected").attr("calSem");

    catByYearSem(selectSession, sem, function(){
        $('#aca_calendar').html('');
        $('#aca_calendar').append('<option value="">- Choose -</option>');
        $.each(obj_kalendar.data, function(i, item){
            $('#aca_calendar').append('<option value="'+item.cal_id+'">'+item.category+'</option>');
        });
    });
});
//-------------------------------------------------- end function change --------------------------------------------------//


function addDropPolicy(returnValue){
    var settings = {
        "url": host+"api_polisi/public/misAdddropPol/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_addDropPol = response;
        returnValue();
    });
}