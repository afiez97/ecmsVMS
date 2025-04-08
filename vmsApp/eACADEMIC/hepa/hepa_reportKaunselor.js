$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let getSession = window.sessionStorage.pgmSession;
    let calSem = window.sessionStorage.calSem;

    $.fn.select2.defaults.set( "theme", "bootstrap" );
    reportingKaunselor();
});

// $('#divCOT').submit(function (e) {

//   e.preventDefault(); // Prevent the default form submission
//   generateTable();

// })

var confirmed=false;

// reportingKaunselor(function () {
// function reportingKaunselor() {

//     let date = $('#dateKaunselor').val();
//     var form = new FormData();
//     form.append("dateKaunselor", date);

//     if(date){
//         monthOnly = formatMonth(date);
//         console.log(monthOnly);
//       }
//       else{
//         monthOnly = '';
//       }

//     var settings = {
//         url: host + "api_hep/public/hepCounselling/generatePDF",
//         method: "POST",
//         timeout: 0,
//         headers: {
//             Authorization: "picoms " + window.sessionStorage.token,
//         },
//         processData: false,
//         mimeType: "multipart/form-data",
//         contentType: false,
//         data: form
//     };

//     let bil = 1;
//     let convertList = JSON.stringify(settings);
//     $("#dataList").val(convertList);
//     var list = [];

//     $.ajax(settings).done(function(response) {
//         obj_kaunselor = JSON.parse(response);

       
//         var colums = [
//             { name: "bil", title: "No.", "style": "text-align:center;" },
//             { name: "reason", title: "Issue", "style": "text-align:center;" },
//             { name: "total_reason", title: "Total Session", "style": "text-align:center;" },

//         ];

//         // let bil = 1;
//         // let convertList = JSON.stringify(obj_kaunselor.data);
//         // $("#dataStdList2").val(convertList);
//         // var list = [];

//         $.each(obj_kaunselor.data, function(i, field) {
//             // list.push({
//             //     bil: bil++,
//             //     dis_date: formatDate(field.dis_date),
//             //     dis_venue: '<span class="text-uppercase">' + field.dis_venue + '</span>',
//             //     Det_student: '<span class="text-uppercase"><b>' + field.stud_icno + '</b></span><br>' + field.sti_name + '<br>' + field.sti_icno,
//             //     dis_type: '<span class="text-uppercase">' + field.description + '</span>',
//             //     dis_amount: 'RM ' + field.dis_amount,
//             //     status: field.dis_pay_status,

//             if (i == '' || i == null) {

//                 i = 'LAIN-LAIN';
    
//             }
//             else { i = i }
    
    
//             list.push({
//                 bil: bil++,
//                 reason: i.toUpperCase(),
//                 total_reason: field,
    
//             });
//             // });
//         });

//         list.push({
//             dis_amount: '<h4><strong>Total Compound : </strong></h4>',
//             status: '<h4><strong>' + (list.length) + '</strong></h4>',
//         });

//         $("#report_disipline").html('');
//         $("#report_disipline").footable({
//             "columns": colums,
//             "rows": list,
//         });

//         // button = `<label for="" class="col-form-label" style="display: block; height: 35px;"></label>
//         //       <button type="button" onclick="generateTable()" class="btn btn-info">
//         //           <i class="fa fa-fw fa-filter"></i>Filter
//         //       </button>
//         //       <button id="" onclick="generatePDFDiscipline('Discipline', 'reportTableDisc', '` + monthOnly + `')" class="btn md-raised green">
//         //           <i class="fa fa-fw fa-pencil-square-o"></i>
//         //           <strong>Download PDF</strong>
//         //       </button>`;

//         // $('#btnPDF').html(button);
//     });



//     // var colums = [
//     //     { name: "bil", title: "No.", "style": "text-align:center;" },
//     //     { name: "reason", title: "Issue", "style": "text-align:center;" },
//     //     { name: "total_reason", title: "Total Session", "style": "text-align:center;" },

//     // ];

//     // let bil = 1;
//     // let convertList = JSON.stringify(obj_coun);
//     // $("#dataList").val(convertList);
//     // var list = [];
//     //   console.log(obj_coun.data);

//     // $.each(obj_coun.data, function (i, field) {

//         // if (i == '' || i == null) {

//         //     i = 'LAIN-LAIN';

//         // }
//         // else { i = i }


//         // list.push({
//         //     bil: bil++,
//         //     reason: i.toUpperCase(),
//         //     total_reason: field,

//         // });


//     // });

//     // $("#report_disipline").html('');
//     // $("#report_disipline").footable({
//     //     "columns": colums,
//     //     "rows": list,
//     //     "paging": {
//     //         "enabled": true,
//     //         "size": 10,
//     //         "countFormat": "Showing {PF} to {PL} of {TR} data"
//     //     },
//     //     //   "filtering": {
//     //     //       "enabled": true,
//     //     //       "placeholder": "Search...",
//     //     //       "dropdownTitle": "Search for:"
//     //     //   }
//     // });
// }

function reportingKaunselor() {
    let date = $('#dateKaunselor').val();
    var form = new FormData();
    form.append("dateKaunselor", date);

    let monthOnly = date ? formatMonth(date) : '';

    var settings = {
        url: host + "api_hep/public/hepCounselling/generatePDF",
        method: "POST",
        timeout: 0,
        headers: {
            Authorization: "picoms " + window.sessionStorage.token,
        },
        processData: false,
        mimeType: "multipart/form-data",
        contentType: false,
        data: form
    };

    let bil = 1;
    let convertList = JSON.stringify(settings);
    $("#dataList").val(convertList);
    var list = [];

    $.ajax(settings).done(function(response) {
        let obj_kaunselor = JSON.parse(response);

        var columns = [
            { name: "bil", title: "No.", "style": "text-align:center;" },
            { name: "reason", title: "Issue", "style": "text-align:center;" },
            { name: "total_reason", title: "Total Session", "style": "text-align:center;" }
        ];

        $.each(obj_kaunselor.data, function(i, field) {
            let reason = i || 'LAIN-LAIN';
            list.push({
                bil: bil++,
                reason: reason.toUpperCase(),
                total_reason: field
            });
        });

        $("#report_disipline").html('');
        $("#report_disipline").footable({
            "columns": columns,
            "rows": list,
        });
    });
}


// function reportingDisiplin(returnValue) {
//     var settings = {
//         "url": host + "api_hep/public/hepCounselling/generatePDF",
//         "method": "GET",
//         "timeout": 0,
//         "headers": {
//             "Authorization": "picoms " + window.sessionStorage.token
//         },
//     };

//     $.ajax(settings).done(function (response) {
//         obj_coun = response;
//         returnValue();
//     });
// }
