$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let getSession = window.sessionStorage.pgmSession;
    let calSem = window.sessionStorage.calSem;

    $.fn.select2.defaults.set( "theme", "bootstrap" );
    generateTable();

});



var confirmed=false;
function generateTable(){
    let checkInDate = $('#chkIndate').val();
    console.log(checkInDate);
   
    if (checkInDate != null && checkInDate != ''){
        var monthOnly = checkInDate.split('-')[1];
        var yearOnly = checkInDate.split('-')[0];
    }
    else{
        var monthOnly = '';
        var yearOnly = '';
    }

    button = `<label for="" class="col-form-label" style="display: block; height: 35px;"></label>
    <button type="button" onclick="generateTable()" class="btn btn-info">
        <i class="fa fa-fw fa-filter"></i>Filter
    </button>
    <button id="" onclick="generatePDFDamage('Damage Complaint', 'tableReportListStudent', '`+checkInDate+`')" class="btn md-raised green">
        <i class="fa fa-fw fa-pencil-square-o"></i>
        <strong>Download PDF</strong>
    </button>`;


    $('#btnPDF').html(button);
    
    
    console.log(checkInDate);

    var form = new FormData();
    form.append("month", monthOnly);
    form.append("year", yearOnly);
    // console.log(checkInDate);
    // console.log(yearOnly);


    var settings = {
        "url": host + "api_hep/public/hep_aduanResponden/reporting/reportComplaint",
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
   
   
    $.ajax(settings).done(function (response) {
        // console.log(response);
        obj_Unreside = JSON.parse(response);
               


        var colums = [
            { "name": "bil", "title": "Bil.", "style": "text-align:center;" },
            { "name": "studDet", "title": "Student", "breakpoints": "md sm xs", "style": "text-align:center;" },
            { "name": "studIc", "title": "IC / Passport Number", "style": "text-align:center;" },
            { "name": "hostel", "title": "Hostel", "style": "text-align:center;" },

            // { "name": "block", "title": "Block", "breakpoints": "md sm xs", "style": "text-align:center;" },
            { "name": "aduan", "title": "Complaint", "style": "text-align:center;" },
            { "name": "date", "title": "Date", "style": "text-align:center;" },

            { "name": "status", "title": "Status", "style": "text-align:center;" },


        ];

        let bil = 1;
        // let convertList = JSON.stringify(listData);
        // $("#dataList").val(convertList);
        var list = [];

        $.each(obj_Unreside.data, function (i, field) {

            list.push({
                bil: bil++,
                studDet: '<span style="font-weight: bold;">'+ field.std_studentid + '</span>  <br> ' +field.sti_name    ,
                studIc: '<span class="text-uppercase" >' + field.sti_icno + '</span>',
                hostel: '<span style="font-weight: bold;">'+ field.hostel_name + '</span>  <br> ' +field.block_name + '<br> ' +field.room_no,
                aduan: '<span style="font-weight: bold;">'+ field.aduan_nama + '</span>  <br> ' +field.aduan_details    ,
                date:formatDate(field.aduan_date),

                status: '<span class="text-uppercase">'+ field.aduan_status + '</span>',
            });

        });

        $("#tableReportListStudent").html('');
        $("#tableReportListStudent").footable({
            "columns": colums,
            "rows": list,
            // "paging": {
            //     "enabled": true,
            //     "size": 10,
            //     "countFormat": "Showing {PF} to {PL} of {TR} data"
            // },
            // "filtering": {
            //     "enabled": true,
            //     "placeholder": "Search...",
            //     "dropdownTitle": "Search for:"
            // }
        });

        returnValue();

    });


}




