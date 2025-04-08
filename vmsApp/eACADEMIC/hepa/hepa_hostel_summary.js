$(function(){
    $.ajaxSetup ({
        cache: false
    });
    $.fn.select2.defaults.set( "theme", "bootstrap" );

    let userId = window.sessionStorage.usrId;
    let catAdmin = window.sessionStorage.usrCatEadmin;
    let userRole = window.sessionStorage.userRole;



    dataSummary(function(){
        let dataList = obj_report.data;
        console.log(dataList);
        createTbl(dataList);
    });
  
});
var confirmed = false;

//-------------------------------------------------- function create table --------------------------------------------------//
function createTbl(dataList){
    var colums = [
        { "name": "bil", "title": "No." },
        { "name": "hostel_name", "title": "HOSTEL NAME", "style": "text-align:center;" },
        { "name": "tbed", "title": "TOTAL BED", "style": "text-align:center;" },
        { "name": "tOBedL", "title": "OCCUPIED BED (L)" , "style": "text-align:center;"},
        { "name": "tOBedP", "title": "OCCUPIED BED (P)" , "style": "text-align:center;"},
        { "name": "tOBed", "title": "TOTAL OCCUPIED BED" , "style": "text-align:center;"},
        { "name": "tUnOccbedL", "title": "UNOCCUPIED BED (L)", "style": "text-align:center;" },
        { "name": "tUnOccbedP", "title": "UNOCCUPIED BED (P)", "style": "text-align:center;", "breakpoints": "md sm xs" },
        { "name": "tUnOccbed", "title": "TOTAL UNOCCUPIED BED", "style": "text-align:center;", "breakpoints": "md sm xs" },
    ];

    let bil = 1;
    let convertList = JSON.stringify(dataList);
    $("#dataList").val(convertList);
    var list = [];

    var Ttbed = 0;
    var TtOccbedL = 0;
    var TtOccbedP = 0;
    var TtOccbed = 0;
    var TtUnOccbedL = 0;
    var TtUnOccbedP = 0;
    var TtUnOccbed = 0;

    $.each(dataList, function (i, field){
        // console.log(field);
        Ttbed += field.tbed;
        if(field.tUnOccbedL != null && field.tUnOccbedL != ''){
            TtUnOccbedL += parseInt(field.tUnOccbedL);
        }
        if(field.tUnOccbedP != null && field.tUnOccbedP != ''){
            TtUnOccbedP += parseInt(field.tUnOccbedP);
        }
        
        TtOccbedL += parseInt(field.tOccbedL);
        TtOccbedP += parseInt(field.tOccbedP);
        TtOccbed += parseInt(field.tOccbed);
        
        TtUnOccbed += parseInt(field.tUnOccbed);

        list.push({
            bil: bil++, 
            hostel_name: '<span class="text-uppercase">'+field.hostel_name+'</span>', 
            tbed: field.tbed, 
            tOBedL: field.tOccbedL, 
            tOBedP: field.tOccbedP, 
            tOBed: field.tOccbed,
            tUnOccbedL: field.tUnOccbedL,
            tUnOccbedP: field.tUnOccbedP,
            tUnOccbed: field.tUnOccbed,
        });

        // Add the total row
        if(dataList.length == (i+1)){
            list.push({

            bil: ``, 
            hostel_name:`<strong>TOTAL</strong>`, 
            tbed:  `<strong>`+ Ttbed+`</strong>`, 
            tOBedL: `<strong>`+ TtOccbedL+`</strong>`, 
            tOBedP: `<strong>`+ TtOccbedP+`</strong>`, 
            tOBed:  `<strong>`+ TtOccbed+`</strong>`,
            tUnOccbedL: `<strong>`+ TtUnOccbedL+`</strong>`,
            tUnOccbedP: `<strong>`+ TtUnOccbedP+`</strong>`,
            tUnOccbed: `<strong>`+ TtUnOccbed+`</strong>`,
            });
        }

    });

    $("#hostelSummary").html('');
    $("#hostelSummary").footable({
        "columns": colums,
        "rows": list,
        "paging": {
            "enabled": false,
            "size": 10,
            "countFormat": "Showing {PF} to {PL} of {TR} data"
        },
        "filtering": {
            "enabled": false,
            "placeholder": "Search...",
            "dropdownTitle": "Search for:"
        }
    });
}
//-------------------------------------------------- end function create table --------------------------------------------------//


function dataSummary(returnValue){
    var settings = {
        "url": host+"api_hep/public/hepHostelChkinout/reporting/reportSummary",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_report = response;
        returnValue();
    });
}


