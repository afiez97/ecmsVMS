$(function () {
  $.ajaxSetup({
    cache: false
  });

  let student_id = window.sessionStorage.std_studentid;
  $("#stu_id").html(student_id);
  student_info(student_id, function () {
    let dataStd = obj_stdInfo.data;
    // console.log(dataStd);
    //   $('#namaStudent').html(dataStd.sti_name);
    //   $('#idStudent').html(student_id);
    //     $('#sessionStud').html(field.acaYear);

    $('#sti_icno').html(dataStd.sti_icno);
    $("#stdName").html(dataStd.sti_name);
    $("#namaStudent").html(dataStd.sti_name);
    $("#idStudent").html(student_id);

    $("#progName").html(dataStd.pgm_name); ``
    $('#sti_contactno_mobile').html(dataStd.sti_contactno_mobile);
    addr =dataStd.sti_address_1 + ' ' + dataStd.sti_address_2 + ' ' + dataStd.sti_address_3;
    $('#address').html( addr.replaceAll('null', ''));


    chkStdCurSem(student_id, dataStd.sti_name, function () {

      $.each(obj_stdCurSem.data, function (i, item) {

        item.cal_cohort
        let academic_session = item.cur_year.replace('/', '') + '/' + item.cal_cohort;
        let acal = item.fk_acaCal;

        $('#feeBalance').append(`<tr>
                                    <td id="sessionAca_`+ acal + `" class="text-center">` + academic_session + `</td>
                                    <td id="totalHarga_`+ acal + `" class="text-center"></td>
                                    <td id="" class="text-center"></td>
                                    <td id="" class="text-center">0</td>
                                    <td id="" class="text-center"></td>
                                    <td class="footable-last-visible" style="display: table-cell;">
                                    <button class="btn btn-icon accent" title="View" onclick="viewDetailYuran(`+ acal + `,'`+ academic_session + `')">
                                    <i class="ion-eye"></i>
                                    </button></td>
                                    </tr>
                                `);



        yuranList(acal, function () {
          var totalHarga = 0;

          $.each(obj_regCrs.data, function (i, field) {

            totalHarga += field.harga;
            $('#totalHarga_' + acal).html(totalHarga)
          });
        });
      });





    });


  });


});



function yuranList(acaCal, returnValue) {

  let std_studentid = window.sessionStorage.std_studentid;


  var form = new FormData();
  form.append("std_studentid", std_studentid);
  form.append("aca_session", acaCal);

  var settings = {
    "url": host + "api_pengurusan_pelajar/public/misStdRegsub/priceCourse",
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

  $.ajax(settings).done(function (response) {
    obj_regCrs = JSON.parse(response);

    returnValue();
  });

}


function chkStdCurSem(id, stud_name, returnValue) {
  var settings = {
    url: host + "api_pengurusan_pelajar/public/curAcademic/chkStdCurSem/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_stdCurSem = response;
    returnValue();
  });
}

function totalFees() {


  var sumVal = 0;

  $("#feesAllsubject tr:gt(0)").each(function () {
    sumVal += parseInt($(this).find("td:eq(2)").value());
  });

  $("#sumVal").change("Sum Value = " + sumVal);
  // console.log(sumVal);



}

function viewDetailYuran(acaCal, academic_session) {
  $('#feesAllsubject').html('');
  $('#viewDetailYuran').modal("show");

  $('#sessionStud').html(academic_session);
  var columns = [
    { "name": "bil", "title": "Bil." },
    { "name": "crsCode", "title": "Code Course" },
    { "name": "crs_name", "title": "Course Name" },
    { "name": "rsb_status", "title": "Status" },
    { "name": "harga", "title": "Fee" }
  ];

  var list = [];

  yuranList(acaCal, function () {
    $.each(obj_regCrs.data, function (i, field) {
      list.push({
        bil: i + 1,
        crsCode: field.crsCode,
        crs_name: field.crs_name,
        rsb_status: field.rsb_status,
        harga: `<span >` + 'RM' + field.harga + '.00' + `</span>`,
      });
    });

    // Calculate total fees
    var totalFees = 0;
    $.each(list, function (i, item) {
      var feeValue = parseFloat(item.harga.replace(/[^0-9.-]+/g, ""));
      totalFees += feeValue;
    });

    // Add the total row
    list.push({
      bil: "",
      crsCode: "",
      crs_name: "",
      rsb_status: "",
      harga: `<strong>Total: RM${totalFees.toFixed(2)}</strong>`,
    });

    // Initialize footable after the data is ready
    $("#feesAllsubject").footable({
      "columns": columns,
      "rows": list,
      "filtering": {
        "enabled": true,
      }
    });
  });
}
