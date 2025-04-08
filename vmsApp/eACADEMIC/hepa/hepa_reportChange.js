
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
    let chgDate = $('#chgDate').val();
    console.log(chgDate);

    button = `<label for="" class="col-form-label" style="display: block; height: 35px;"></label>
    <button type="button" onclick="generateTable()" class="btn btn-info">
        <i class="fa fa-fw fa-filter"></i>Filter
    </button>
    <button id="" onclick="generatePDFChange('Change', 'tableReportListStudent', '`+chgDate+`')" class="btn md-raised green">
        <i class="fa fa-fw fa-pencil-square-o"></i>
        <strong>Download PDF</strong>
    </button>`;

    $('#btnPDF').html(button);

    var form = new FormData();
    form.append("chgDate", chgDate);

    var obj = new post(host + 'api_hep/public/hepHostelChange/reportingChangehstl', form, 'picoms ' + window.sessionStorage.token).execute();

    if (obj.success) {
        // Replace empty strings with "Lain-lain" in the JSON string
        var jsonString = JSON.stringify(obj);
        jsonString = jsonString.replace(/"":/g, '"Lain-lain":');
        obj_chkInOut = JSON.parse(jsonString);

        // Extract unique column names from the data object
        var columnNames = [];
        for (var key in obj_chkInOut.data) {
            for (var subKey in obj_chkInOut.data[key]) {
                if (subKey == "") {
                    subKey = "Lain-lain";
                }
                if (columnNames.indexOf(subKey) === -1) {
                    columnNames.push(subKey);
                }
            }
        }

        // Initialize the Footable with modified data
        let bil = 1;
        $("#tableReportListStudent").footable({
            
            columns: [
                { name: "bil", title: "Bil.", "style": "text-align:center;" },
                { name: "firstColumn", title: "Issue/Reason", "style": "text-align:center;" },
                // Add other columns based on data
                // This section is updated to ensure consistent column names
                ...columnNames.map(function (columnName) {
                    return { name: columnName, title: columnName, "style": "text-align:center;"};
                }),
            ],
            rows: Object.keys(obj_chkInOut.data).map(function (key) {
                
                var rowData = obj_chkInOut.data[key];

                // Replace empty strings with "Lain-lain" within the rowData object
                for (var propName in rowData) {
                    if (rowData.hasOwnProperty(propName) && rowData[propName] === "") {
                        rowData[propName] = "Lain-lain";
                    }
                }

                var row = { 
                    bil: bil++,
                    firstColumn: key 
                };

                // Populate row data with values from the rowData object
                columnNames.forEach(function (columnName) {
                    row[columnName] = rowData[columnName] || "-";
                });

                return row;
            }),

            paging: {
                enabled: false,
                size: 10,
                countFormat: "Showing {PF} to {PL} of {TR} data",
            },
        });
            } else {
                alert('This Month No Check-In');
            }
}
