$(function(){
  $.ajaxSetup({
    cache: false
  });

  let datapush = [];
  token = window.sessionStorage.token;
  listPrintExam = JSON.parse(window.sessionStorage.listPrintExam);
  window.jsPDF = window.jspdf.jsPDF;

  var doc = new jsPDF('landscape');
  var pageWidth = doc.internal.pageSize.width;
  var pageHeight = doc.internal.pageSize.height;

  console.log(listPrintExam);

  stud_name = listPrintExam[0].stud_name;
  var studId = listPrintExam[0].studId;
  var aca_session = listPrintExam[0].aca_session;
  console.log(aca_session);
  cohort = listPrintExam[0].cohort;
  year2 = listPrintExam[0].year;
  sem = listPrintExam[0].sem;
  // alert(sem);
  var doc = new jsPDF("landscape");

  year = year2.replace('/','');
  session = year+'/'+cohort;

  student_info(studId, function(){
    let dataStd = obj_stdInfo.data;
    console.log(dataStd);
     studIC = dataStd.sti_icno;
     studintake = dataStd.cur_intake;
     studPgm = dataStd.pgm_name;



     studentSem(studId, aca_session, function(){
      let dataStdSem = obj_stdSem.data;
      console.log(dataStdSem);
      semStudent = dataStdSem.std_semester;
      console.log(semStudent);
      dateEndorsement  = dataStdSem.std_senate_endorsement;

        var imgData = "../student/images/print_ExamStudent.png";

          // Add the image to the PDF
          doc.addImage(imgData, 'JPEG', 0, 0, pageWidth , pageHeight);
        //   console.log(imgData);

      if(token == null){
        window.close();
      }
      else {
        
        doc.setFontSize(10);

        doc.text('NAME                                 : ', 14, 45);
        doc.text(stud_name.toUpperCase(), 80, 45);
        
        doc.text('MATRIC NUMBER             : ', 14, 50);
        doc.text(studId.toUpperCase(), 80, 50);
        
        doc.text('MyKad/PASSPORT            : ', 14, 55);
        doc.text(studIC.toUpperCase(), 80, 55);
        
        doc.text('INTAKE                               : ', 14, 60);
        doc.text(studintake.toUpperCase(), 80, 60);
        
        doc.text('SEMESTER                        : ', 14, 65);
        doc.text(sem.toString(), 80, 65);
        
        doc.text('YEAR                                  : ', 14, 70);
        doc.text(session.toUpperCase(), 80, 70);
        
        doc.text('PROGRAMME                    : ', 14, 75);
        doc.text(studPgm.toUpperCase(), 80, 75);
        
        doc.text('DATE OF ISSUE                 : ', 14, 80);
        doc.text(formatDate(dateEndorsement), 80, 80);

        std_curAcademic(studId, sem, token, function () {
          let dataPointer = obj_curAcademic.data;

          tCredit = dataPointer.tc;
          tgpa = dataPointer.std_gpa;
          tcgpa = dataPointer.std_cgpa;

          console.log(dataPointer);
        });

        listByActPolicy2(studId, aca_session, function () {
          let data = obj_regCrs.data;
          console.log(data);



          let rows = [];
          let columns = ['CODE', 'COURSE', 'STATUS', 'CREDIT',  'GRADE', 'GRADE POINT', 'REMARKS'];

          $.each(data, function(i, item) {

            if (item.mrf === 'checked') {
              labelCourseSts = item.rsb_type+`/MRF`;
          }else if(item.ip === 'checked'){
              labelCourseSts = item.rsb_type+`/IP`;
          }else{labelCourseSts= 'N';}

            rows.push([
                // (i+1),
                item.crsCode,
                item.crs_name.toUpperCase(),
                // item.rsb_type,
                labelCourseSts,
                item.crs_credit,
                item.grade,
                item.point,
                '   ',
            ]);
          });

          doc.autoTable({
            startY: 85,
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
                      },
            headerStyles: {
              fillColor: [0, 0, 0, 0], // Transparent fill color (RGBA)
              textColor: [0, 0, 0],    // Black text color
              fontStyle: 'bold',      // Make the header text bold
              halign: 'center'        // Center align the header text
            },
            columnStyles: {
              2: { halign: 'center' }, // Center align the third column (index 2)
              3: { halign: 'center' }, // Center align the fourth column (index 3)
              4: { halign: 'center' },  // Center align the fifth column (index 4)
              5: { halign: 'center' }  // Center align the fifth column (index 4)
            }

          });

          doc.setLineWidth(0.3);
          doc.setDrawColor(0, 0, 0); 
          doc.line(14, 145, 283, 145); // horizontal line
          doc.line(14, 167, 283, 167); // horizontal line


          if (tcgpa>= 2.00)
          {
            remarks = 'GOOD STANDING';
          }
          else if (tcgpa <2.00 && tcgpa>= 1.50){
            remarks = 'CONDITIONAL STANDING';
          }
          else{
            remarks = 'FAILED';
          }

          const tableData = [
            { label: 'TOTAL CREDIT', value: tCredit, TITIK_BERTINDIH: ":" },
            { label: 'GRADE POINT AVERAGE (GPA)', value: tgpa, TITIK_BERTINDIH: ":" },
            { label: 'CUMULATIVE GRADE POINT AVERAGE (CGPA)', value: tcgpa, TITIK_BERTINDIH: ":" },
            { label: 'REMARKS', value: remarks, TITIK_BERTINDIH: ":" },
        ];
        
        // Set initial y-coordinate for the table
        let y = 150;
        
        // Iterate through the table data and add rows to the table
        tableData.forEach((row) => {
            doc.text(`${row.label}`, 14, y);
            doc.text(row.TITIK_BERTINDIH, 130, y);
            doc.text(row.value, 200, y);
            y += 5; // Adjust the y-coordinate for the next row
        });

        doc.text('ISSUED BY    : ', 14, 175);
        doc.setFont("helvetica", "bold");
        doc.text('OFFICIAL SEAL ', 14, 180);


          // Uncomment the following section if you want to load and embed timetable
          /*
          setTimeout(() => {
            loadTimeTable(studId, aca_session,function(){
              if(obj_tmtDet.success){
                // Code to process and display timetable...
              }
            });
          }, 1000);
          */

          // PDFObject.embed(doc.output("datauristring"), "#preview-pdf");
           doc.save('ExamResult_'+stud_name+'_'+session+'.pdf');
           window.close();
        }); 
      }
    });
  });
});
