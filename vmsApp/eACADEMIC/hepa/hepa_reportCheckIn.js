$(function(){
    $.ajaxSetup({
        cache: false
    });

    let getSession = window.sessionStorage.pgmSession;
    let calSem = window.sessionStorage.calSem;

    $.fn.select2.defaults.set("theme", "bootstrap");

    generateTable(); // Assuming you want to call the function here
});

function generateTable() {
    let chkIndate = $('#chkIndate').val();

    var form = new FormData();
    form.append("chkInOutDate", chkIndate);

    var obj = new post(host + 'api_hep/public/hepHostelChkinout/reporting/reportChkIn', form, 'picoms ' + window.sessionStorage.token).execute();

    if (obj.success) {
        var obj_chkIn = obj.data;

        var column = [
            { "name": "", "title": "Gender", "style": "text-align:center;" },
            { "name": "Check In", "title": "Check In", "style": "text-align:center;" },
            { "name": "New", "title": "New", "style": "text-align:center;" }
        ];

        var rows = [];
        $.each(obj_chkIn, function (i, field) {
            rows.push({
                "": i,
                "Check In": field["Check In"],
                "New": field["New"]
            });
        });

        $("#tableReportListStudent").html('');

        // Initialize Footable with your data
        $("#tableReportListStudent").footable({
            "columns": column,
            "rows": rows,
            "paging": {
                "enabled": true,
                "size": 10,
                "countFormat": "Showing {PF} to {PL} of {TR} data"
            },
        });
    } else {
        alert('This Month No Check-In');
    }
}
