$(function () {
    $.ajaxSetup({
        cache: false
    });

    let getSession = window.sessionStorage.pgmSession;
    let calSem = window.sessionStorage.calSem;

    $.fn.select2.defaults.set("theme", "bootstrap");

    generateTable(); // Assuming you want to call the function here
});

function generateTable() {
    let chkInOutDate = $('#chkInOutdate').val();
    let FK_status_Student = $('#FK_status_Student').val();
    let ChkInOutSelect = $('#ChkInOutSelect').val();

    var form = new FormData();
    form.append("chkInOutDate", chkInOutDate);
    form.append("FK_status_Student", FK_status_Student);
    form.append("ChkInOutSelect", ChkInOutSelect);

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": host + 'api_hep/public/hepHostelChkinout/Reporting/reportingChkInOut',
        "method": "POST",
        "headers": {
            "Authorization": 'picoms ' + window.sessionStorage.token,
        },
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": form
    };

    $.ajax(settings).done(function (response) {
        var obj_ChkInOutPDF = JSON.parse(response);

        var columns = [
            { "name": "bil", "title": "Bil.", "style": "text-align:center;" },
            { "name": "det_student", "title": "Detail Student", "style": "text-align:center;" },
            { "name": "det_hostel", "title": "Detail Residence", "style": "text-align:center;" },
            { "name": "sts_status_name_en", "title": "Status Academic", "breakpoints": "md sm xs", "style": "text-align:center;" },
            { "name": "checkIn_status", "title": "Check In Status", "style": "text-align:center;" },
            { "name": "checkOut_status", "title": "Check Out Status", "style": "text-align:center;" }
        ];

        var list = [];

        $.each(obj_ChkInOutPDF.data, function (i, field) {
            var checkOutStatus = field.checkOut_status !== null ? field.checkOut_status : '-';
            var checkOut = field.checkOut !== null ? field.checkOut : '-';

            list.push({
                bil: i + 1,
                det_student: '<span class="text-uppercase">' + field.sti_name +
                    '<br>' + field.stud_id +
                    '<br>' + field.sti_icno + '</span>',
                det_hostel: '<span class="text-uppercase">' + field.clg_name +
                    '<br>' + field.hostel_name +
                    '<br>' + field.block_name +
                    '<br>' + field.room_no + '</span>',
                sts_status_name_en: '<span class="text-uppercase">' + field.sts_status_name_en + '</span>',
                checkIn_status: '<span class="text-uppercase">' + field.checkIn_status +
                    '<br>' + field.checkIn + '</span>',
                checkOut_status: '<span class="text-uppercase">' + checkOutStatus +
                    '<br>' + checkOut + '</span>',
            });
        });

        $("#tableReportListStudent").html('');
        $("#tableReportListStudent").footable({
            "columns": columns,
            "rows": list,
        });
    });
}
