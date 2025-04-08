$(function () {
  $.ajaxSetup({
    cache: false
  });

  let stud_id = window.sessionStorage.stud_id;
  let stud_name = window.sessionStorage.stud_name;
  let token = window.sessionStorage.token;
  // var doc = new jsPDF("potrait");
  window.jsPDF = window.jspdf.jsPDF; //nie pnting utk call jspdf pnya library


  if (token == null) {
    window.close();
  }
  else {
    if (stud_id != null) {
      stdCheckInOut(stud_id, function () {

        if (obj_checkIn.success) {
          let data = [];
          $.each(obj_checkIn.data, function (i, item) {
            data.push([++i, item.hostel_name.toUpperCase(), item.block_name.toUpperCase(), item.room_no.toUpperCase(), formatDate(item.checkIn), formatDate(item.checkOut), item.checkIn_status.toUpperCase()])
          });


          var doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
          });

          // Create a gradient effect with three colors (purple, maroon, red) on the left side
          var gradientColors = ['#743d89', '#973d78', '#ac3869'];
          var gradientWidth = 1.4; // Width of each color segment
          var gradientHeight = doc.internal.pageSize.height;

          for (var i = 0; i < gradientColors.length; i++) {
            doc.setFillColor(gradientColors[i]);
            doc.rect(i * gradientWidth, 0, gradientWidth, gradientHeight, 'F');
          }

          var a4Width = 210;

          // Image dimensions
          var originalWidth = 275.59; // Replace with the actual width of your image
          var originalHeight = 67.818; // Replace with the actual height of your image

          // Calculate the new width and height (60% of A4 width while maintaining aspect ratio)
          var newWidth = 0.6 * a4Width;
          var newHeight = (newWidth / originalWidth) * originalHeight;

          // Calculate the X-coordinate to center the image on the A4 page
          var xCoordinate = (a4Width - newWidth) / 2;

          // Add the image to the document with the calculated width, height, and centered position
          doc.addImage("images/logo_reporting.png", "JPEG", xCoordinate, 10, newWidth, newHeight);

          doc.setFont("helvetica", "bold");
          var textCenterX = doc.internal.pageSize.width / 2;
          doc.setFontSize(14); // Set the font size to 10
          doc.text('BAHAGIAN HAL EHWAL PELAJAR DAN ALUMNI', textCenterX, 50, { align: "center" });



          doc.setFont("helvetica", "bold");
          doc.setFontSize(13); // Set the font size to 8
          var textCenterX = doc.internal.pageSize.width / 2;
          doc.text('UNIT PENGURUSAN HOSTEL', textCenterX, 58, { align: "center" });


          const text = 'Name: ' + stud_name.toUpperCase() + '(' + stud_id.toUpperCase() + ')';
          doc.setFontSize(15);
          // Set the font type for the text
          doc.setFont("helvetica", "bold");
          const textWidth = doc.getTextWidth(text);
          // Set the position for the text
          const textX = 15; // X position
          const textY = 80; // Y position



          doc.text(text, textX, textY);

          // Set the underline color
          doc.setDrawColor(0, 0, 0); // RGB color for the underline

          // Draw the original-size underline
          const underlineLength1 = textWidth + 20; // Length of the underline
          const underlineWidth1 = 1.5; // Width of the underline
          doc.setLineWidth(underlineWidth1);
          doc.line(textX, textY + 2, textX + underlineLength1, textY + 2);

          // Set the color for the second underline (purple)
          doc.setDrawColor(128, 0, 128); // RGB color for purple

          // Draw the second underline with double the width
          const underlineLength2 = textWidth * (30 / 100); // Same length as the first underline
          const underlineWidth2 = underlineWidth1 * 2; // Double the width
          doc.setLineWidth(underlineWidth2);
          doc.line(textX, textY + 2, textX + underlineLength2, textY + 2);

          // Generate the PDF from the table, starting below the text
          doc.autoTable({
            // html: source,
            head: [
              ['No.', 'Hostel', 'Block', 'Room', 'Check In', 'Check Out', 'Status']
            ],
            body: data,
            startY: 90, // Adjusted start position below the text
            margin: { top: 40 },
            theme: 'grid',
            styles: { fillColor: false, textColor: 0 },
            headerStyles: { fillColor: '#9c4298', textColor: 255 },
          });
          doc.addImage("images/footer_reporting.png", "JPEG", 6, 276, 200, 20);

          // Save or download the PDF
          // doc.save('Reporting_' + text + '.pdf');
          doc.setProperties({
            title: "jsPDF sample"
          });
          window.open(doc.output('bloburl').toString(), '_blank');


          // PDFObject.embed(doc.output("datauristring"), "#preview-pdf");

          // doc.save('Reporting_change_hostel.pdf');

          // doc.autoTable({
          //   startX: 30,
          //   startY: 50,
          //   head: [
          //       ['No.', 'Hostel', 'Block', 'Room', 'Check In', 'Check Out', 'Status']
          //   ],
          //   body: data,
          // });

          // doc.setFontSize(10);
          // doc.setFont("helvetica", "normal");
          // doc.text('Student Id : '+stud_id.toUpperCase(), 14, 30);

          // doc.setFontSize(10);
          // doc.setFont("helvetica", "normal");
          // doc.text('Name        : '+stud_name.toUpperCase(), 14, 40);

          // PDFObject.embed(doc.output("datauristring"), "#preview-pdf");
        }

        window.close();
      });
    }
    else {
      alert("Page Can't Load Right Now!")
      window.close();
    }
  }
});


function stdCheckInOut(id, returnValue) {
  var settings = {
    "url": host + "api_hep/public/hepHostelChkinout/listByStd/" + id,
    "method": "GET",
    "timeout": 0,
    "headers": {
      "Authorization": "picoms " + window.sessionStorage.token
    },
  };

  $.ajax(settings).done(function (response) {
    obj_checkIn = response;
    returnValue();
  });
}