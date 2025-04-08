$(function(){
  $.ajaxSetup ({
      cache: false
  });

  let datapush = [];
  token = window.sessionStorage.token;
  listPrint2 = JSON.parse(window.sessionStorage.listTimetbl);

  console.log(listPrint2);

  stud_name = listPrint2[0].stud_name;
  var studId = listPrint2[0].studId;
  aca_session = listPrint2[0].aca_session;
  cohort = listPrint2[0].cohort;
  icnum = listPrint2[0].icnum;
  year = listPrint2[0].year;

  // pgmCode = listPrint2[0].pgmCode;
  // pgmpgmName = listPrint2[0].pgmpgmName;
  pgm = listPrint2[0].pgmCode +' - '+ listPrint2[0].pgmpgmName;
  var doc = new jsPDF("landscape");

  if(token == null){
      window.close();
  }

  else{

// Load the image
getBase64Image('images/ucmipicoms.png', function (imgLogo) {
      

  var width = doc.internal.pageSize.getWidth();
  // alert(width);
  var height = doc.internal.pageSize.getHeight();

  console.log(height);
  // Add the image to the PDF
  doc.addImage(imgLogo, "png", 0, 0, width, height);



  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.text('                                                            VARIABLE MOVE SOLUTION'.toUpperCase(), 14, 23);

  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.text('STUDENT TIMETABLE'.toUpperCase(), 140, 28);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text('STUDENT NAME              : '+stud_name.toUpperCase(), 14, 40);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold"); 
  doc.text('STUDENT ID                     : '+studId.toUpperCase(), 14, 45);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text('NRIC/PASSPORT NO.      : '+icnum.toUpperCase(), 14, 50);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text('ACADEMIC SESSION       : '+year+'/'+cohort.toUpperCase(), 150, 40);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text('PROGRAM                        : ',150, 45 );


  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(pgm.toUpperCase() , 195, 45 , { maxWidth: 80 });

  // doc.setFontSize(10);
  // doc.setFont("helvetica", "bold");
  // doc.text('SEMESTER                       : '+cal_cohort.toUpperCase(), 150, 50);

  // doc.setFontSize(10);
  // doc.setFont("helvetica", "bold");
  // doc.text('INTAKE                              : '+stud_cur_intake, 14, 50);

  // doc.setFontSize(10);
  // doc.setFont("helvetica", "bold");
  // doc.text('PROGRAM                        : '+program.toUpperCase(), 14, 55);

  setTimeout(() => {
        
    loadTimeTable(studId, aca_session,function(){
      if(obj_tmtDet.success){
        let day_num = "";
        let display = [];
        let disLect = [];
        // console.log(obj_tmtDet.data)
        $.each(obj_tmtDet.data,function(i,field){
          let dayVal = '';
          if( field.tmt_day == '1' ){ dayVal = 'MONDAY' }
          else if( field.tmt_day == '2' ){ dayVal = 'TUESDAY' }
          else if( field.tmt_day == '3' ){ dayVal = 'WEDNESDAY' }
          else if( field.tmt_day == '4' ){ dayVal = 'THURSDAY' }
          else if( field.tmt_day == '5' ){ dayVal = 'FRIDAY' }
          else if( field.tmt_day == '6' ){ dayVal = 'SATURDAY' }
          else if( field.tmt_day == '7' ){ dayVal = 'SUNDAY' }

          let lect_name = field.lecturer_name;
          if (lect_name != null){
            disLect = lect_name.split(" ");
            // disLect2 = disLect[0] + " " + disLect[1] + "..."
            disLect2 = lect_name;
          }
          else {
            disLect2 = "-";
          }
          

      
          // console.log(day_num);
      
          if (day_num != field.tmt_day) {
            if (i == 0) {
              display.push(dayVal);                
            } else {
              datapush.push(display);
              display = [];
              display.push(dayVal);
            }
      
            day_num = field.tmt_day;
      
            for (c = 8; c < 23; c++) {
              // console.log(c)
              let startTime = field.tmt_starttime;
              let check_start = startTime.substring(0, 2) * 1;
              let endTime = field.tmt_endtime;
              let check_end = endTime.substring(0, 2) * 1;

              hour = check_end - check_start;
              
              if (check_start == c) {
                for (t=hour; t >= 1; t--) {
                  display.push(
                    field.crs_code +"\n"+ 
                    // hour+"hour \n"+
                    // field.tmt_starttime+" \n"+
                    field.course_name +"\n"+ 
                    field.loc_name +"\n"+ 
                    disLect2
                  );
                }
                d = c + hour;
                break;
              } 
              else {                 
                display.push("")
              }
            }
          } else {
            for (d; d < 23; d++) {
              let startTime = field.tmt_starttime;
              let check_start = startTime.substring(0, 2) * 1;
              let endTime = field.tmt_endtime;
              let check_end = endTime.substring(0, 2) * 1;
              
              hour = check_end - check_start;
              if (check_start == d) {

                for (t=hour; t >= 1; t--) {
                display.push(
                  field.crs_code +"\n"+ 
                  // hour+" hour \n"+
                  // field.tmt_starttime+" \n"+
                  field.course_name +"\n"+ 
                  field.loc_name +"\n"+ 
                  disLect2
                );
                }
                d = d + hour;
                break;
              } else {
                display.push("");
              }
            }
          }
          
          if((i+1) == obj_tmtDet.data.length){
            datapush.push(display);
          }
        });

        // console.log(datapush);

        doc.autoTable({
          // startX: 30,
          startY: 58,
          tableWidth: doc.internal.pageSize.getWidth(),
          margin: { left: 11, bottom: 43 },
          head: [
            ['Day', '8AM-9AM', '9AM-10AM', '10AM-11AM', '11AM-12PM', '12PM-1PM', '1PM-2PM', '2PM-3PM', '3PM-4PM', '4PM-5PM', '5PM-6PM', '6PM-7PM', '7PM-8PM', '8PM-9PM', '9PM-10PM', '10PM-11PM'],
            // ['No.', 'Day', 'Time', 'Course', 'Slot', 'Venue', 'Lecturer']
          ],
          columnStyles: {
            // Set the width for each column (index-based)
            0: { columnWidth: 20 },   // Day column
            1: { columnWidth: 17 },   // 8AM-9AM column
            2: { columnWidth: 17 },   // 9AM-10AM column
            3: { columnWidth: 17 },   // 10AM-11AM column
            4: { columnWidth: 17 },   // 11AM-12PM column
            5: { columnWidth: 17 },   // 12PM-1PM column
            6: { columnWidth: 17 },   // 1PM-2PM column
            7: { columnWidth: 17 },   // 2PM-3PM column
            8: { columnWidth: 17 },   // 3PM-4PM column
            9: { columnWidth: 17 },   // 4PM-5PM column
            10: { columnWidth: 17 },  // 5PM-6PM column
            11: { columnWidth: 17 },  // 6PM-7PM column
            12: { columnWidth: 17 },  // 7PM-8PM column
            13: { columnWidth: 17 },  // 8PM-9PM column
            14: { columnWidth: 17 },  // 9PM-10PM column
            15: { columnWidth: 17 },  // 10PM-11PM column
          },
          // styles: {
          //   fontSize: 6, // Set the font size to 8 (adjust as needed)
          //   // You can add more style options here if required
          //   // cellPadding: 5, // Set cell padding (adjust as needed)
          //   valign: 'middle', // Vertically align content in the center
          //   halign: 'center', // Horizontally align content in the center
          // },
          styles: {
            fontSize: 6,
            cellPadding: 2,
            fillColor: [0, 0, 0, 0],
             // Transparent fill color (RGBA)
            textColor: [0, 0, 0],         // Black text color
            lineWidth: 0.1,              // Border width (set to 0 for no border)
            lineColor: [0, 0, 0]         // Black border color
        },
          body: datapush,
        });

        var dateToday= (new Date().toDateString()).split(' ');
        
        text1 = 
        `This timetable is generated by eCMS on : ` +dateToday[2] +' '+dateToday[1]+' '+dateToday[3]+
       
        // '\n' +
        // '\n' +
        // '\n' +

        '\n' +
        '\n' +
        '\n' +
        `                                                                             Mentor's Signature                                                              Student's Signature \n\n\n\n`+
        '                                               ______________________________________________                       ___________________________';
        
        
        
        var textYPosition = doc.autoTable.previous.finalY + 5;
        
        doc.setFontSize(10); 
        doc.setFont("helvetica", "bold");
        doc.text(''+text1, 14, textYPosition);
        // doc.text(''+text1, 14, 160);
      

      






  // Get the data URL of the PDF
  var pdfDataUri = doc.output('datauristring');

  // Open the PDF in a new tab
  openPDFInNewTab(pdfDataUri);
      }
    });

  }, 1000);














  });
  }
  // else{

  //   doc.setFontSize(10);
  //   doc.setFont("helvetica", "normal");
  //   doc.text('STUDENT NAME              : '+stud_name.toUpperCase(), 14, 30);
    
  //   doc.setFontSize(10);
  //   doc.setFont("helvetica", "normal");
  //   doc.text('STUDENT ID                     : '+studId.toUpperCase(), 14, 35);

  //   doc.setFontSize(10);
  //   doc.setFont("helvetica", "normal");
  //   doc.text('SESSION                           : '+year.toUpperCase(), 14, 40);

  //   doc.setFontSize(10);
  //   doc.setFont("helvetica", "normal");
  //   doc.text('ACADEMIC SESSION       : '+cohort, 14, 45);

  //   // if(tmttbl_year != null){
  //     setTimeout(() => {
  //       // loadTimeTable(studId, aca_session,function(){
  //       //   if(obj_tmtDet.success){
  //       //     let day_num = "";
  //       //     let display = [];
  //       //     let disLect = [];
  //       //     console.log(obj_tmtDet.data)
  //       //     $.each(obj_tmtDet.data,function(i,field){
  //       //       let dayVal = '';
  //       //       if( field.tmt_day == '1' ){ dayVal = 'MONDAY' }
  //       //       else if( field.tmt_day == '2' ){ dayVal = 'TUESDAY' }
  //       //       else if( field.tmt_day == '3' ){ dayVal = 'WEDNESDAY' }
  //       //       else if( field.tmt_day == '4' ){ dayVal = 'THURSDAY' }
  //       //       else if( field.tmt_day == '5' ){ dayVal = 'FRIDAY' }

  //       //       let lect_name = field.lecturer_name;
  //       //       if (lect_name != null){
  //       //         disLect = lect_name.split(" ");
  //       //         disLect2 = disLect[0] + " " + disLect[1] + "..."
  //       //       }
  //       //       else {
  //       //         disLect2 = "-";
  //       //       }
              

          
  //       //       // console.log(day_num);
          
  //       //       if (day_num != field.tmt_day) {
  //       //         if (i == 0) {
  //       //           display.push(dayVal);                
  //       //         } else {
  //       //           datapush.push(display);
  //       //           display = [];
  //       //           display.push(dayVal);
  //       //         }
          
  //       //         day_num = field.tmt_day;

  //       //         let startTime = field.tmt_starttime;
  //       //         let endTime = field.tmt_endtime;
  //       //         let check_start = startTime.substring(0, 2) * 1;
  //       //         let check_end = endTime.substring(0, 2) * 1;
  //       //         let ttime = check_end - check_start;
          
  //       //         // for (c = 8; c < 23; c++) {
  //       //           //betulkan dari sini
  //       //           for (c = 8; c < 23; c += ttime) {

                  
  //       //             if (check_start == c) {
  //       //               for (let t = 0; t < ttime; t++) {
  //       //                 display.push(
  //       //                   field.crs_code + "\n" +
  //       //                   field.course_name + "\n" +
  //       //                   field.loc_name + "\n" +
  //       //                   disLect2
  //       //                 );
  //       //                 c++;
  //       //               }
  //       //               d = c ;
  //       //               break;
  //       //             } else {
  //       //               display.push("");
  //       //             }
  //       //           }
                  
  //       //       } 
  //       //       else {
  //       //         for (d; d < 23; d++) {
  //       //           let startTime = field.tmt_starttime;
  //       //           let endTime = field.tmt_endtime;
  //       //           let check_start = startTime.substring(0, 2) * 1;
  //       //           let check_end = endTime.substring(0, 2) * 1;
  //       //           let ttime = check_end - check_start;


  //       //           if (check_start == d) {
  //       //             // disLect = lect_name.split(" ");
  //       //             for (let u = 0; u < ttime; u++) {
  //       //               display.push(
  //       //                 field.crs_code + "\n" +
  //       //                 field.course_name + "\n" +
  //       //                 field.loc_name + "\n" +
  //       //                 disLect2
  //       //               );
  //       //               d = d++;
  //       //             }
                    
  //       //             break;
  //       //           } else {
  //       //             // display += display.push("");
  //       //             display.push("");
  //       //           }
  //       //         }
  //       //       }
              
  //       //       if((i+1) == obj_tmtDet.data.length){
  //       //         datapush.push(display);
  //       //       }
  //       //     });

  //       //     console.log(datapush);

  //       //     doc.autoTable({
  //       //       startX: 30,
  //       //       startY: 50,
  //       //       head: [
  //       //         ['Day', '8AM-9AM', '9AM-10AM', '10AM-11AM', '11AM-12PM', '12PM-1PM', '1PM-2PM', '2PM-3PM', '3PM-4PM', '4PM-5PM', '5PM-6PM', '6PM-7PM', '7PM-8PM', '8PM-9PM', '9PM-10PM', '10PM-11PM'],
  //       //         // ['No.', 'Day', 'Time', 'Course', 'Slot', 'Venue', 'Lecturer']
  //       //       ],
  //       //       columnStyles: {
  //       //         // Set the width for each column (index-based)
  //       //         0: { columnWidth: 20 },   // Day column
  //       //         1: { columnWidth: 17 },   // 8AM-9AM column
  //       //         2: { columnWidth: 17 },   // 9AM-10AM column
  //       //         3: { columnWidth: 17 },   // 10AM-11AM column
  //       //         4: { columnWidth: 17 },   // 11AM-12PM column
  //       //         5: { columnWidth: 17 },   // 12PM-1PM column
  //       //         6: { columnWidth: 17 },   // 1PM-2PM column
  //       //         7: { columnWidth: 17 },   // 2PM-3PM column
  //       //         8: { columnWidth: 17 },   // 3PM-4PM column
  //       //         9: { columnWidth: 17 },   // 4PM-5PM column
  //       //         10: { columnWidth: 17 },  // 5PM-6PM column
  //       //         11: { columnWidth: 17 },  // 6PM-7PM column
  //       //         12: { columnWidth: 17 },  // 7PM-8PM column
  //       //         13: { columnWidth: 17 },  // 8PM-9PM column
  //       //         14: { columnWidth: 17 },  // 9PM-10PM column
  //       //         15: { columnWidth: 17 },  // 10PM-11PM column
  //       //       },
  //       //       styles: {
  //       //         fontSize: 6, // Set the font size to 8 (adjust as needed)
  //       //         // You can add more style options here if required
  //       //         // cellPadding: 5, // Set cell padding (adjust as needed)
  //       //         valign: 'middle', // Vertically align content in the center
  //       //         halign: 'center', // Horizontally align content in the center
  //       //       },
  //       //       body: datapush,
  //       //     });

  //       //     PDFObject.embed(doc.output("datauristring"), "#preview-pdf");

  //       //   }
  //       // });


  //       loadTimeTable(studId, aca_session,function(){
  //         if(obj_tmtDet.success){
  //           let day_num = "";
  //           let display = [];
  //           let disLect = [];
  //           // console.log(obj_tmtDet.data)
  //           $.each(obj_tmtDet.data,function(i,field){
  //             let dayVal = '';
  //             if( field.tmt_day == '1' ){ dayVal = 'MONDAY' }
  //             else if( field.tmt_day == '2' ){ dayVal = 'TUESDAY' }
  //             else if( field.tmt_day == '3' ){ dayVal = 'WEDNESDAY' }
  //             else if( field.tmt_day == '4' ){ dayVal = 'THURSDAY' }
  //             else if( field.tmt_day == '5' ){ dayVal = 'FRIDAY' }
  //             else if( field.tmt_day == '6' ){ dayVal = 'SATURDAY' }
  //             else if( field.tmt_day == '7' ){ dayVal = 'SUNDAY' }

  //             let lect_name = field.lecturer_name;
  //             if (lect_name != null){
  //               disLect = lect_name.split(" ");
  //               disLect2 = disLect[0] + " " + disLect[1] + "..."
  //             }
  //             else {
  //               disLect2 = "-";
  //             }
              

          
  //             // console.log(day_num);
          
  //             if (day_num != field.tmt_day) {
  //               if (i == 0) {
  //                 display.push(dayVal);                
  //               } else {
  //                 datapush.push(display);
  //                 display = [];
  //                 display.push(dayVal);
  //               }
          
  //               day_num = field.tmt_day;
          
  //               for (c = 8; c < 23; c++) {
  //                 // console.log(c)
  //                 let startTime = field.tmt_starttime;
  //                 let check_start = startTime.substring(0, 2) * 1;
  //                 let endTime = field.tmt_endtime;
  //                 let check_end = endTime.substring(0, 2) * 1;

  //                 hour = check_end - check_start;
                  
  //                 if (check_start == c) {
  //                   for (t=hour; t >= 1; t--) {
  //                     display.push(
  //                       field.crs_code +"\n"+ 
  //                       // hour+"hour \n"+
  //                       // field.tmt_starttime+" \n"+
  //                       field.course_name +"\n"+ 
  //                       field.loc_name +"\n"+ 
  //                       disLect2
  //                     );
  //                   }
  //                   d = c + hour;
  //                   break;
  //                 } 
  //                 else {                 
  //                   display.push("")
  //                 }
  //               }
  //             } else {
  //               for (d; d < 23; d++) {
  //                 let startTime = field.tmt_starttime;
  //                 let check_start = startTime.substring(0, 2) * 1;
  //                 let endTime = field.tmt_endtime;
  //                 let check_end = endTime.substring(0, 2) * 1;
                  
  //                 hour = check_end - check_start;
  //                 if (check_start == d) {

  //                   for (t=hour; t >= 1; t--) {
  //                   display.push(
  //                     field.crs_code +"\n"+ 
  //                     // hour+" hour \n"+
  //                     // field.tmt_starttime+" \n"+
  //                     field.course_name +"\n"+ 
  //                     field.loc_name +"\n"+ 
  //                     disLect2
  //                   );
  //                   }
  //                   d = d + hour;
  //                   break;
  //                 } else {
  //                   display.push("");
  //                 }
  //               }
  //             }
              
  //             if((i+1) == obj_tmtDet.data.length){
  //               datapush.push(display);
  //             }
  //           });

  //           // console.log(datapush);

  //           doc.autoTable({
  //             startX: 30,
  //             startY: 50,
  //             head: [
  //               ['Day', '8AM-9AM', '9AM-10AM', '10AM-11AM', '11AM-12PM', '12PM-1PM', '1PM-2PM', '2PM-3PM', '3PM-4PM', '4PM-5PM', '5PM-6PM', '6PM-7PM', '7PM-8PM', '8PM-9PM', '9PM-10PM', '10PM-11PM'],
  //               // ['No.', 'Day', 'Time', 'Course', 'Slot', 'Venue', 'Lecturer']
  //             ],
  //             columnStyles: {
  //               // Set the width for each column (index-based)
  //               0: { columnWidth: 20 },   // Day column
  //               1: { columnWidth: 17 },   // 8AM-9AM column
  //               2: { columnWidth: 17 },   // 9AM-10AM column
  //               3: { columnWidth: 17 },   // 10AM-11AM column
  //               4: { columnWidth: 17 },   // 11AM-12PM column
  //               5: { columnWidth: 17 },   // 12PM-1PM column
  //               6: { columnWidth: 17 },   // 1PM-2PM column
  //               7: { columnWidth: 17 },   // 2PM-3PM column
  //               8: { columnWidth: 17 },   // 3PM-4PM column
  //               9: { columnWidth: 17 },   // 4PM-5PM column
  //               10: { columnWidth: 17 },  // 5PM-6PM column
  //               11: { columnWidth: 17 },  // 6PM-7PM column
  //               12: { columnWidth: 17 },  // 7PM-8PM column
  //               13: { columnWidth: 17 },  // 8PM-9PM column
  //               14: { columnWidth: 17 },  // 9PM-10PM column
  //               15: { columnWidth: 17 },  // 10PM-11PM column
  //             },
  //             styles: {
  //               fontSize: 6, // Set the font size to 8 (adjust as needed)
  //               // You can add more style options here if required
  //               // cellPadding: 5, // Set cell padding (adjust as needed)
  //               valign: 'middle', // Vertically align content in the center
  //               halign: 'center', // Horizontally align content in the center
  //             },
  //             body: datapush,
  //           });

  //           PDFObject.embed(doc.output("datauristring"), "#preview-pdf");

  //         }
  //       });

  //     }, 1000);

  // }
});

function loadTimeTable(studID, aca_session, returnValue) {
  // function StudentTimetable(lect, acaCal, course, returnValue){

  var form = new FormData();
  // form.append("fk_lecturer", lect);
  // form.append("fk_acaCal", acaCal);
  // form.append("fk_course", course);
  form.append("studID", studID);
  form.append("aca_session", aca_session);

  var settings = {
    url: host + "api_timetbl_picoms/public/misTimetblDet/StudTimetable2",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  $.ajax(settings).done(function (response) {
    obj_tmtDet = JSON.parse(response);
    returnValue();
  });
}



// Function to convert image to base64
function getBase64Image(imgUrl, callback) {
  var img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function () {
      var canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(this, 0, 0);

      var dataURL = canvas.toDataURL("image/png");
      callback(dataURL);
  };
  img.src = imgUrl;
}

var newTab = null; // Declare newTab variable outside the function scope

function openPDFInNewTab(pdfDataUri) {
  // Check if a new tab is already opened
  if (newTab && !newTab.closed) {
      // If a new tab is already opened, set its location to the PDF data URI
      newTab.location.href = pdfDataUri;
  } else {
      // Convert data URI to Blob
      var byteCharacters = atob(pdfDataUri.split(',')[1]);
      var byteNumbers = new Array(byteCharacters.length);
      for (var i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      var blob = new Blob([byteArray], { type: 'application/pdf' });

      // Create a URL for the Blob
      var blobUrl = URL.createObjectURL(blob);

      // Open the PDF in a new tab
      newTab = window.open(blobUrl);
      if (!newTab) {
          // If pop-up is blocked, show an alert to the user
          alert('Pop-up blocked. Please check your browser settings.');
      } else {
          // If new tab is successfully opened, close the current page
          window.close();
      }
  }
}
// // Load the image
// getBase64Image('images/ucmipicoms.png', function (base64Img) {
//   // Create a new jsPDF instance
//   var doc = new jsPDF();

//   // Add the image to the PDF
//   doc.addImage(base64Img, 'PNG', 10, 10, 100, 100); // Change coordinates and dimensions as per your requirements

//   // Get the data URL of the PDF
//   var pdfDataUri = doc.output('datauristring');

//   // Open the PDF in a new tab
//   openPDFInNewTab(pdfDataUri);
// });
