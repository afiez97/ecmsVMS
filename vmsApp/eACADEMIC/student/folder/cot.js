$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let getSession = window.sessionStorage.pgmSession;

    // select academic session
    acaSession(function(){
        $('#aca_session').append('<option value="">- Choose Academic Session -</option>');
        $.each(obj_acaSession.data, function (i, item){
            select = "";
            if(getSession == item.cur_year.replace('/','-')){
                select = "selected";
            }
            $('#aca_session').append('<option '+select+' value="'+item.cur_year.replace('/','-')+'">'+item.cur_year+'</option>');
        });
    });

    if(getSession != null){
        progDet(getSession, function(){
            var columns = [
                { "name": "bil", "title": "No." },
                { "name": "dtp_year", "title": "Academic Session", "breakpoints": "md sm xs" },
                { "name": "dtp_intake", "title": "Intake" },
                { "name": "pgm_id", "title": "Programme" },
                { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
            ];
            
            let bil = 1;
            let convertList = JSON.stringify(obj_program.data);
            $("#dataList").val(convertList);
            var list = [];
        
            $.each(obj_program.data, function (i, item){
                let pgm_id = item.pgm_id.toUpperCase();
                let pgm_name = item.pgm_name.toUpperCase();

                list.push({
                    bil: bil++, dtp_year: item.dtp_year, dtp_intake: item.dtp_intake, pgm_id: pgm_id+' - '+pgm_name,
                    upt_btn: '<button class="btn btn-icon accent" title="Details" onclick="detail(\'' + i + '\')" id="btnPerincian"><i class="ion-ios-list-outline"></i></button>'
                });
            });
        
            $("#cotList").footable({
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

        window.sessionStorage.removeItem('pgmSession');
    }
});


// detail Course Offer
function detail(indexs){
    let d = JSON.parse($("#dataList").val());
    let data = d[indexs];
    let dtp_year = data.dtp_year.replace('/','-');

    window.sessionStorage.pgmDet_id = data.dtp_id;
    window.sessionStorage.pgmSession = dtp_year;
    window.location.replace('cot_details.html');
}


function acaSession(returnValue){
    var settings = {
        "url": host + "api_tetapan_picoms/public/misPrmCuryear/opt_curYear",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        obj_acaSession = response;
        returnValue();
    });
}


// onchange select academic session
$('#aca_session').change(function(){
    let selectSession = $('#aca_session').val();
    
    progDet(selectSession, function(){
        var columns = [
            { "name": "bil", "title": "No." },
            { "name": "dtp_year", "title": "Academic Session", "breakpoints": "md sm xs" },
            { "name": "dtp_intake", "title": "Intake" },
            { "name": "pgm_id", "title": "Programme" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];
        
        let bil = 1;
        let convertList = JSON.stringify(obj_program.data);
        $("#dataList").val(convertList);
        var list = [];
    
        $.each(obj_program.data, function (i, item){
            let pgm_id = item.pgm_id.toUpperCase();
            let pgm_name = item.pgm_name.toUpperCase();

            list.push({
                bil: bil++, dtp_year: item.dtp_year, dtp_intake: item.dtp_intake, pgm_id: pgm_id+' - '+pgm_name,
                upt_btn: '<button class="btn btn-icon accent" title="Details" onclick="detail(\'' + i + '\')" id="btnPerincian"><i class="ion-ios-list-outline"></i></button>'
            });
        });
    
        $("#cotList").footable({
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

function progDet(id, returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmProgDet/listByYear/"+id,
        "method": "GET",
        "timeout": 0,
    };
      
    $.ajax(settings).done(function (response) {
        obj_program = response;
        returnValue();
    });
}