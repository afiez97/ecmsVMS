$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let getSession = window.sessionStorage.pgmSession;
    let calSem = window.sessionStorage.calSem;

    $.fn.select2.defaults.set( "theme", "bootstrap" );

    console.log(getSession);
    // select academic calendar
    acaCalActive(function(){
        $('#aca_session').append('<option value="">- Choose Academic Session -</option>');
        let names = "";
        $.each(obj_kalendar.data, function (i, item){
            select = "";
            if(getSession == item.cur_year.replace('/','-')){
                select = "selected";
            }

            if(names != item.cur_year.replace('/','')+'/'+item.cal_cohort){
                names = item.cur_year.replace('/','')+'/'+item.cal_cohort;
                $('#aca_session').append('<option '+select+' value="'+item.cal_id+'" calYear="'+item.cur_year+'" calSem="'+item.cal_cohort+'">'+item.cur_year.replace('/','')+'/'+item.cal_cohort+'</option>');
            }
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:'
        });
    });

    if(!(getSession == null && calSem == null)){
        createTbl(getSession, calSem);
        window.sessionStorage.removeItem('pgmSession');
        window.sessionStorage.removeItem('calSem');
    }
});


// detail Course Offer
function detail(indexs){
    let d = JSON.parse($("#dataList").val());
    let data = d[indexs];
    let dtp_year = data.acaYear.replace('/','-');

    window.sessionStorage.pgmDet_id = data.dtp_id;
    window.sessionStorage.pgmSession = dtp_year;
    window.sessionStorage.calSem = data.cal_cohort;
    window.location.replace('cot_details.html');
}


// onchange select academic session
$('#aca_session').change(function(){
    let selectSession = $("#aca_session option:selected").attr("calYear");
    let sem = $("#aca_session option:selected").attr("calSem");
    createTbl(selectSession, sem);
});


function createTbl(getSession, sem){
    getSessiopgmDetByCalSemn = getSession.replace('/','-');
    pgmDetByCalSem(getSession, sem, function(){
        $("#cotList").html('');
        var columns = [
            { "name": "bil", "title": "No." },
            { "name": "dtp_year", "title": "Academic Session", "breakpoints": "md sm xs" },
            { "name": "dtp_intake", "title": "Intake" },
            { "name": "aca_cal", "title": "Category" },
            { "name": "pgm_id", "title": "Programme" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];
        
        let bil = 1;
        let convertList = JSON.stringify(obj_progYear.data);
        $("#dataList").val(convertList);
        var list = [];
    
        $.each(obj_progYear.data, function (i, item){
            let acaCal = item.acaYear.replace('/','')+'/'+item.cal_cohort;
            let intake = item.intake_month+'-'+item.intake_year;

            list.push({
                bil: bil++, 
                dtp_year: acaCal,
                dtp_intake: intake, 
                pgm_id: '<span class="text-uppercase">'+item.pgmCode+' - '+item.pgm_name+'</span>', 
                aca_cal: item.category,
                upt_btn: '<button class="btn btn-icon accent" title="Details" onclick="detail(\'' + i + '\')" id="btnPerincian"><i class="ion-ios-list-outline"></i></button>'
            });
        });
    
        $("#cotList").footable({
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
}