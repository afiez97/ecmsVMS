$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let prog_id = window.sessionStorage.prog_id;

    $("#listProgramdet").html('');

    dataProgram(prog_id, function(){
        $("#pk_id").val(data.pk_id);
        $("#fac_name").html(data.fac_name);
        $("#pgm_categoryt").html(data.category_name);
        $("#pgm_areat").html(data.category);
        $("#pgm_idt").html(data.pgm_id);
        $("#pgm_namet").html(data.pgm_name);
        $("#pgm_modet").html(data.mode_name);
        $("#pgm_mqflevelt").html(data.mqflevel_name);
        $("#pgm_durationt").html(data.pgm_duration);
        $("#pgm_statust").html(data.pgm_status);
        $("#pgm_fee").html(data.pgm_fee);
        $("#pgm_fee_usd").html(data.pgm_fee_usd);
    });
    

    // details list
    detailsList(prog_id, function(){
        var columns = [
            { "name": "bil", "title": "No." },
            { "name": "dtp_year", "title": "Academic Session" },
            { "name": "dtp_intake", "title": "Intake" },
        ];
        
        var list = [];
        let bil = 1;

        $.each(obj_detList,function(i,field){
            let aca_calyear = field.acaCal;
            if( aca_calyear != null ){ aca_calyear = aca_calyear.replace('/','') }
            let acaCal = aca_calyear+ '/' +field.cal_cohort;
            let acaIntake = field.intake_month+ '-' +field.intake_year;

            list.push({
                bil: bil++, dtp_year: acaCal, dtp_intake: acaIntake,
            });
        });

        $("#listProgramdet").footable({
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
    })
});


// btn Back to Programme List
$('#btnBack').click(function(){
    window.location.replace('adminPage.html');
    window.sessionStorage.removeItem('prog_id');
});


function detailsList(id, returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmProgDet/list/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_detList = response.data;
        returnValue();
    });
}