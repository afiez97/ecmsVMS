$(function(){
  $.ajaxSetup ({
      cache: false
  });
  

  let datapush = [];
  let token = window.sessionStorage.token;
  let listPrintExam = JSON.parse(window.sessionStorage.listExamSlip);

  let stud_name = listPrintExam[0].studname;


  let studId = listPrintExam[0].studId;
  let cur_year = listPrintExam[0].cur_year;
  let cal_cohort = listPrintExam[0].cal_cohort;
  let stud_cur_intake = listPrintExam[0].stud_cur_intake;
  let acaCal = listPrintExam[0].acaCal;
  let icnum = listPrintExam[0].stud_icno;
  let program = listPrintExam[0].stud_pgm_name;
  let semcohort = listPrintExam[0].cur_year.replace('/','')+'/'+cal_cohort;

  

  if(token == null){
      window.close();
  } else {

    let imgUrl;
    toDataURL('images/ucmipicoms.png', function(dataURL){

        var doc = new jsPDF("landscape");

        imgUrl = dataURL;

        var width = doc.internal.pageSize.getWidth();
        var height = doc.internal.pageSize.getHeight();

        doc.addImage(imgUrl, "png", 0, 0, width, height);

        doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text('                                                            VARIABLE MOVE SOLUTION'.toUpperCase(), 14, 23);

    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text('                                                                         EXAMINATION SLIP'.toUpperCase(), 14, 28);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text('STUDENT NAME              : '+stud_name.toUpperCase(), 14, 40);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text('STUDENT ID                     : '+studId.toUpperCase(), 150, 40);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text('NRIC/Passport No.           : '+icnum.toUpperCase(), 14, 45);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text('ACADEMIC SESSION       : '+cur_year+'/'+cal_cohort.toUpperCase(), 150, 45);

    // doc.setFontSize(10);
    // doc.setFont("helvetica", "bold");
    // doc.text('PROGRAM                        : '+program.toUpperCase(), 14, 50);

    // doc.setFontSize(10);
    // doc.setFont("helvetica", "bold");
    // doc.text('SEMESTER                       : '+cal_cohort.toUpperCase(), 150, 50);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text('INTAKE                              : '+stud_cur_intake, 14, 50);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text('PROGRAM                        : '+program.toUpperCase(), 14, 55);

    text1 = 
    'INSTRUCTION TO STUDENTS \n' +
    '1. Please ensure that all information displayed in this slip is correct.\n'  +
    '2. Students are allowed to attend the examinations for only the course listed in the slip.\n' +
    '3. Students are required to bring this slip into the examination hall/room for inspection by invigilator(s).\n' +
    '4. Students are responsible to check and verify the date and venue of each examination listed.\n' +
    '5. Students are STRICTLY NOT allowed to bring any electronic devices to an examination unless required for the examination.\n' +
    '6. Students NOT allowed to enter and sit for an examination after 30 minutes of the examination has commenced.\n' +
    '7. Students are STRICTLY NOT allowed to write any notes in examination slip except permitted. \n \n\n' +
    '                                                                                           SIGNATURE                                                                                 DATE \n\n\n\n'+
    '                                                            ______________________________________________                       ___________________________';
    doc.setFontSize(10); 
    doc.setFont("helvetica", "bold");
    doc.text(''+text1, 14, 135);

      let form = new FormData();
      
      form.append("std_studentid", studId);
      form.append("fk_acaCal", acaCal);
    
      let obj = new post(host + 'api_pengurusan_pelajar/public/misStdSlipExam/listBySessionSExam', form, 'picoms ' + window.sessionStorage.token).execute();

          if (obj.success) {
              let data = obj.data;
              let rows = [];
              let columns = ['No.','Course Code',  'Course Name', 'Exam Type', 'Paper Type','Date', 'Time', 'Venue', 'Seat Number'];

              // Populate rows array
              $.each(data, function(i, item) {

                if (item.clg_name != null){
                  college  = item.clg_name;
                }
                else{
                  college = '';
                }

                if (item.cen_id != null){
                  centre  = item.cen_id ;
                }
                else{
                  centre = '';
                }
                
                  rows.push([
                      (i+1),
                      item.crs_code,
                      item.crs_name,
                      item.exam_type,
                      item.paper_type,
                    formatDate1(item.tbl_date_start),
                    formatTime(item.tbl_time_start) + " - " + formatTime(item.tbl_time_end) ,
                    college +' - '+centre,
                      item.est_tableno,
                    //   statusExam,
                      
                  ]);
              });

            //   // Generate Excel file
            //   let arr = [columns];
            //   rows.forEach(function(row) {
            //       arr.push(row);
            //   });
            //   var tableData = [
            //       {
            //           "sheetName": "Sheet1",
            //           "data": arr
            //       }
            //   ];
            //   var options = {
            //       fileName: "Exam Slip"
            //   };
            //   Jhxlsx.export(tableData, options);


            doc.autoTable({
                startY: 60,
                head: [columns],
                body: rows,
                styles: {
                    fontSize: 9,
                    cellPadding: 2,
                    fillColor: [0, 0, 0, 0],
                     // Transparent fill color (RGBA)
                    textColor: [0, 0, 0],         // Black text color
                    lineWidth: 0.1,              // Border width (set to 0 for no border)
                    lineColor: [0, 0, 0]         // Black border color
                }
            });
            
            doc.setDrawColor(0); // Set draw (border) color to black
            doc.setFillColor(255, 255, 255, 0); // Set fill color to transparent white
              PDFObject.embed(doc.output("datauristring"), "#preview-pdf");
              
              doc.save('Examination_Slip-'+studId+'-'+semcohort+'.pdf');
            window.close();
         

              $("#loading_mode").modal('hide');
          } else {
          }
    });

  }
});

function toDataURL(src, callback){
    var image = new Image();
    image.crossOrigin = 'Anonymous';
    image.onload = function(){
       var canvas = document.createElement('canvas');
       var context = canvas.getContext('2d');
       canvas.height = this.naturalHeight;
       canvas.width = this.naturalWidth;
       context.drawImage(this, 0, 0);
       var dataURL = canvas.toDataURL('image/png');
       callback(dataURL);
    };
    image.src = src;
}
