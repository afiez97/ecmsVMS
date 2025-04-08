$(function(){
    $.ajaxSetup ({
        cache: false
    });

    // empId = window.sessionStorage.id_1;
    // acaCal = window.sessionStorage.id_2;
    // fk_course = window.sessionStorage.id_3;
    let datapush = [];
    token = window.sessionStorage.token;
    listPrint = JSON.parse(window.sessionStorage.list);

    console.log(listPrint);

    empId = listPrint[0].emp;
    empName = listPrint[0].nama;
    acaCal = listPrint[0].cal;
    session_intake = listPrint[0].session_intake;
    fk_course = listPrint[0].course;
    course_code = listPrint[0].ccode;
    course_name = listPrint[0].cname;

    var doc = new jsPDF("potrait");

    if(token == null){
        window.close();
    }
    else{

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text('COURSE CODE               : '+course_code.toUpperCase(), 14, 30);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text('COURSE NAME               : '+course_name.toUpperCase(), 14, 35);

      loadDetailCourse(fk_course,function(){
        data = obj_course.data;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text('CREDIT                            : '+data.crs_credit, 14, 40);
      });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text('ACADEMIC SESSION      : '+session_intake, 14, 45);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text('LECTURER                       : '+empName.toUpperCase(), 14, 50);

      // if(tmttbl_year != null){
        setTimeout(() => {
          loadTimeTable(empId,acaCal,fk_course,function(){
            if(obj_timetable.success){
              $.each(obj_timetable.data,function(i,field){
                let dayVal = '';
                if( field.tmt_day == '1' ){ dayVal = 'MONDAY' }
                else if( field.tmt_day == '2' ){ dayVal = 'TUESDAY' }
                else if( field.tmt_day == '3' ){ dayVal = 'WEDNESDAY' }
                else if( field.tmt_day == '4' ){ dayVal = 'THURSDAY' }
                else if( field.tmt_day == '5' ){ dayVal = 'FRIDAY' }
                

                datapush.push([++i, dayVal, formatTime(field.tmt_starttime)+' - '+formatTime(field.tmt_endtime), field.tmt_slot, field.loc_name ])
              });

              doc.autoTable({
                startX: 30,
                startY: 55,
                head: [
                    ['No.', 'Day', 'Time', 'Slot', 'Venue']
                ],
                body: datapush,
              });

              PDFObject.embed(doc.output("datauristring"), "#preview-pdf");

            }
          });

        }, 1000);
      // }
      // else{
      //   alert("Page Can't Load Right Now!")
      //   window.close();
      // }
    }
});

function loadTimeTable(lect, acaCal, course, returnValue){
  var form = new FormData();
  form.append("fk_lecturer", lect);
  form.append("fk_acaCal", acaCal);
  form.append("fk_course", course);

  var settings = {
      "url": host+"api_timetbl_picoms/public/misTimetblDet/listByLectCalCrs",
      "method": "POST",
      "timeout": 0,
      "headers": {
          "Authorization": "picoms " + window.sessionStorage.token
      },
      "processData": false,
      "mimeType": "multipart/form-data",
      "contentType": false,
      "data": form
  };
  
  $.ajax(settings).done(function (response){
      obj_timetable = JSON.parse(response);
      returnValue();
  });
}

function loadDetailCourse(fk_course,returnValue){
  var settings = {
    "url": host + "api_tetapan_picoms/public/misPrmCourse/show/"+fk_course,
    "method": "GET",
    "timeout": 0,
    "headers": {
        "Authorization": "picoms " + window.sessionStorage.token
    }
  };

  $.ajax(settings).done(function (response){
    obj_course = response;
    returnValue();
  });
}

function loadLecturer(empId){

  let form = new FormData();
  form.append('empId',empId);

  var settings = {
    "url": host + "api_timetbl_picoms/public/misTimetable/listTimeTableByLecturerCalendarId",
    "method": "POST",
    "timeout": 0,
    "headers": {
        "Authorization": "picoms " + window.sessionStorage.token
    },
    "processData": false,
    "mimeType": "multipart/form-data",
    "contentType": false,
    "data": form
};
}

function loadDetLecturer(empId){

  let form = new FormData();
  form.append('empId',empId);
  form.append('fk_course',fk_course);
  form.append('acaCal',acaCal);

    var settings = {
        "url": host + "api_timetbl_picoms/public/misTimetable/listTimeTableByLecturerCalendarId",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
    };

    $.ajax(settings).done(function (response){
        obj_stdTimetable = response;
        returnValue();
    });
}