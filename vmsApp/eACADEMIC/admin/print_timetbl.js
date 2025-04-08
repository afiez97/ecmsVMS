$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let lectId = window.sessionStorage.lectId;
    let tmttbl_year = window.sessionStorage.tmttbl_year;
    let tmttbl_sem = window.sessionStorage.tmttbl_sem;
    let token = window.sessionStorage.token;
    var doc = new jsPDF("potrait");

    if(token == null){
        window.close();
    }
    else{
      lectDetails(lectId, function(){
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text('Lecturer                 : '+obj_lectDet.emp_name.toUpperCase(), 14, 30);
      });

      if(tmttbl_year != null){
        setTimeout(() => {
          tmtDetByLectYear(lectId, tmttbl_year, tmttbl_sem, function(){
              if(obj_tmtDet.success ){
                let data = [];
                $.each(obj_tmtDet.data, function(i, item){
                  let course = item.crs_code+"\n"+item.crs_name;
                  let dayVal = '';
                  if( item.tmt_day == '1' ){ dayVal = 'MONDAY' }
                  else if( item.tmt_day == '2' ){ dayVal = 'TUESDAY' }
                  else if( item.tmt_day == '3' ){ dayVal = 'WEDNESDAY' }
                  else if( item.tmt_day == '4' ){ dayVal = 'THURSDAY' }
                  else if( item.tmt_day == '5' ){ dayVal = 'FRIDAY' }
                  else if( item.tmt_day == '6' ){ dayVal = 'SATURDAY' }
                  else if( item.tmt_day == '7' ){ dayVal = 'SUNDAY' }

                  data.push([++i, dayVal, formatTime(item.tmt_starttime)+' - '+formatTime(item.tmt_endtime), course, item.tmt_slot, item.loc_name ])
                });

                doc.autoTable({
                  startX: 30,
                  startY: 50,
                  head: [
                      ['No.', 'Day', 'Time', 'Course', 'Slot', 'Venue']
                  ],
                  body: data,
                });

                doc.setFontSize(10);
                doc.setFont("helvetica", "normal");
                doc.text('Academic Session : '+tmttbl_year.replace('/','')+'/'+tmttbl_sem, 14, 40);

                PDFObject.embed(doc.output("datauristring"), "#preview-pdf");
              }
          });
        }, 1000);
      }
      else{
        alert("Page Can't Load Right Now!")
        window.close();
      }
    }
});