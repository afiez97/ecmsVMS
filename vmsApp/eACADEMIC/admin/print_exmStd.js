$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let fk_exmTimetbl = window.sessionStorage.fk_exmTimetbl;
    let exmInvgltr_id = window.sessionStorage.exmInvgltr_id;
    let token = window.sessionStorage.token;
    var doc = new jsPDF("potrait");

    if(token == null){
        window.close();
    }
    else{
      showExmInv(exmInvgltr_id, function(){
        $.each(obj_exmInv.data, function(i, item){
          console.log(item);
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.text('Academic Session   :   '+item.cal_year.replace('/','')+'/'+item.cal_cohort, 14, 20);

          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.text('Course                     :   '+item.crs_code+' - '+item.crs_name, 14, 25);

          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.text('Date                         :   '+formatDate(item.tbl_date_start), 14, 30);

          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.text('Time                         :   '+formatTime(item.tbl_time_start)+' - '+formatTime(item.tbl_time_end), 14, 35);

          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.text('Chief Invigilator        :   '+item.emp_name, 14, 40);


          // list student
          stdByExmVenue(fk_exmTimetbl, item.fk_venue, function(){
            if(obj_exmStd.success ){
              let data = [];
              $.each(obj_exmStd.data, function(i, item){
                let stdId = ''; let stiName = ''; let progCode = ''; let attd = '';
                if(item.std_id != null){ stdId = item.std_id.toUpperCase() }
                if(item.sti_name != null){ stiName = item.sti_name.toUpperCase() }
                if(item.pgmCode != null){ progCode = item.pgmCode.toUpperCase() }
                if(item.attendance != null){ attd = item.attendance.toUpperCase() }

                data.push([++i, stdId, stiName, progCode, attd ])
              });

              doc.autoTable({
                startX: 30,
                startY: 50,
                head: [
                    ['No.', 'Student Id', 'Name', 'Programme', 'Attend']
                ],
                body: data,
              });

              PDFObject.embed(doc.output("datauristring"), "#preview-pdf");
            }
          });
        });
        
      });
    }
});