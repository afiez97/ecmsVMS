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
    let chkIndate = $('#chkOutdate').val();

    var form = new FormData();
    form.append("chkInOutDate", chkIndate);

    var obj = new post(host + 'api_hep/public/hepHostelChkinout/reporting/reportChckOut', form, 'picoms ' + window.sessionStorage.token).execute();

    if (obj.success) {
        var obj_chkOut = obj.data;
        var tableData = {};

        var columns = [{ name: 'reason', title: 'Reason' }];

        var rows = [];

        $.each(obj_chkOut, function (index, item) {
            var reason = item.reason || "Others Reason";
            var gender = item.sti_gender_name || "Lain Lain";

            if (!tableData[reason]) {
                tableData[reason] = {};
            }

            tableData[reason][gender] = (tableData[reason][gender] || 0) + 1;
        });

        var availableGenders = {};

        $.each(obj_chkOut, function (index, item) {
            if (item.sti_gender_name) {
                availableGenders[item.sti_gender_name] = true;
            }
        });

        $.each(availableGenders, function (gender) {
            columns.push({ name: gender, title: gender, style: "text-align:center;" });
        });

        $.each(tableData, function (reason, genders) {
            var row = { reason: reason, Gender: '' };

            $.each(availableGenders, function (gender) {
                row[gender] = genders[gender] || '0';
            });

            rows.push(row);
        });

        // Initialize Footable with your data
        $("#tableReportListStudent").html('');
        $("#tableReportListStudent").footable({
            'columns': columns,
            'rows': rows,
            'paging': {
                'enabled': true,
                'size': 10,
                'countFormat': 'Showing {PF} to {PL} of {TR} data'
            }
        });
    } else {
        alert('This Month No Check-In');
    }
}
