$(function() {
    $.ajaxSetup({
        cache: false
    });

    let token = window.sessionStorage.token;
    var doc = new jsPDF("landscape");

    if (token == null) {
        window.close();
    } else {
        $("#loading_mode").modal('show');
        let jsonform = window.sessionStorage.form;
        let data = JSON.parse(jsonform);

        let form = new FormData();
        form.append('aca_session', data.aca_session);
        form.append('crs_code', data.crs_code);
        form.append('fk_lecturer', data.fk_lecturer);
        console.log(data.tmt_yearReport);

        doc.setFontSize(16);
        doc.text("SUMMARY OF ATTENDANCE", 15, 15);
        doc.setFontSize(12);
        doc.text("Course: " + data.tmt_courseReport, 15, 22);
        doc.text("Session: " + data.tmt_yearReport, 15, 28);

        let obj = new post(host + 'api_pengurusan_pelajar/public/misStdRegsub/summary/week2', form, 'picoms ' + window.sessionStorage.token).execute();
        if (obj.success) {
            let data = obj.data;
            let thour = obj.thour;
            let att_hour_subject = thour.att_hour_subject;

            let rows = [];
            let arr = [];

            let columns = ['No.', 'Student ID', 'Name', 'Code Programme', 'Percentage Attendance'];

            let dataColumns = [];
            columns.forEach(async (item) => {
                dataColumns.push({ "text": item });
            });

            arr.push(dataColumns);

            $.each(data, function(i, item) {
                let final_percentage;

                if (item.sum_att_hour_absent !== "0") {
                    let actual_attend = att_hour_subject - item.sum_att_hour_absent;
                    let final_percentage1 = (actual_attend / att_hour_subject) * 100;
                    final_percentage = Math.round(parseFloat(final_percentage1));
                } else {
                    final_percentage = 100;
                }

                rows.push([(i + 1), item.std_studentid,
                    item.sti_name,
                    item.pgm_id,
                    final_percentage
                ]);

                let data_stdCrs = [(i + 1), item.std_studentid,
                    item.sti_name,
                    item.pgm_id,
                    final_percentage
                ];

                let datarows = [];
                data_stdCrs.forEach(async (item) => {
                    datarows.push({ "text": item });
                });
                arr.push(datarows);

            });

            setTimeout(() => {
                $("#btnExcel").click(function() {
                    var tableData = [{
                        "sheetName": "Sheet1",
                        "data": arr
                    }];
                    var options = {
                        fileName: "Summary_timeTable"
                    };
                    Jhxlsx.export(tableData, options);
                });

                // Add header to the PDF
                // doc.setFontSize(16);
                // doc.text("Summary of Attendance", 15, 15);
                // doc.setFontSize(12);
                // doc.text("Course: " + data.tmt_courseReport, 15, 22);
                // doc.text("Session: " + data.tmt_yearReport, 14, 28);
                
                doc.autoTable({
                    startY: 35,
                    head: [columns],
                    body: rows,
                    styles: { fontSize: 9 }
                });
                PDFObject.embed(doc.output("datauristring"), "#preview-pdf");

                $("#loading_mode").modal('hide');
            }, Math.random() * 1000);
        }
    }

});
