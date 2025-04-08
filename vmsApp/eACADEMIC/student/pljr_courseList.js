var sti_icnoGet = '';
var pgm_idGet = '';
var pgm_nameGet = '';
var stud_nameGet = '';

$(function () {
  $.ajaxSetup({
    cache: false,
  });

  $.fn.select2.defaults.set("theme", "bootstrap");

  $("#loading_modal").modal("show");

  let student_id = window.sessionStorage.std_studentid;

  let obj_std = new get(
    host + "api_pengurusan_pelajar/public/misStdInfo/show/" + student_id,
    "picoms " + window.sessionStorage.token
  ).execute();

  let dataStd = obj_std.data;
  let stud_name = dataStd.sti_name;
  sti_icnoGet = dataStd.sti_icno;
  pgm_idGet = dataStd.pgm_id;
  pgm_nameGet = dataStd.pgm_name;
  stud_nameGet = dataStd.sti_name;


  // check current semester student
  chkStdCurSem(student_id, stud_name, function () {
    $.each(obj_stdCurSem.data, function (i, item) {
      // console.log(item);

      // if (item.cal_status = 'Active'){
      //   showbutton =  '<button class="btn green-200 m-a btn_summary m-t" onclick="viewStudent(\'' + student_id + "','" + stud_name + "','" + item.fk_acaCal + "','" + item.cur_year +"','" +item.cal_cohort + '\',)"><i class="fa fa-calendar"></i> Timetable</button>';
      // }
      // else{
      //   showbutton =  '<button class="btn green-200 m-a btn_summary m-t" disabled onclick="viewStudent(\'' + student_id + "','" + stud_name + "','" + item.fk_acaCal + "','" + item.cur_year +"','" +item.cal_cohort + '\',)"><i class="fa fa-calendar"></i> Timetable</button>';
      // }



      let boxList =
        '<li class="nav-item " id="navLectData' + item.fk_acaCal + '">' +
        '<a href="#" class="nav-link auto info">' +
        '<span class="pull-right text-muted m-r-xs">' +
        '<i class="fa fa-plus inline"></i>' +
        '<i class="fa fa-minus none"></i>' +
        "</span>" +
        "" +
        item.cur_year.replace("/", "") + "/" + item.cal_cohort + "</a>" + '<ul class="nav nav-sub text-sm" style="overflow: scroll; overflow-x: hidden;">'

        +
        '<div class="row m-a-2">' +
        '<textarea class="hidden" id="dataList_' +
        item.fk_acaCal +
        '"></textarea>'
        +
        '<button class="btn green-200 m-a btn_summary m-t" onclick="viewStudent(\'' + student_id + "','" + stud_name + "','" + item.fk_acaCal + "','" + item.cur_year + "','" + item.cal_cohort + '\',)"' + (item.cal_status !== 'Active' ? ' disabled' : '') + '><i class="fa fa-calendar"></i> Timetable</button>'

        +
        `<button class="btn blue-200 m-a btn_summary m-t" onclick="agreementStd('${item.fk_acaCal}','${item.cur_year}','${item.cal_cohort}')" ><i class="fa fa-newspaper-o"></i> Registration Slip</button>`
        +
        '<table id="crList_' +
        item.fk_acaCal +
        // '" class="table table-striped table-responsive"></table>' +
        '" class="table table-striped"></table>' +
        "</div>" +
        "</ul>" +
        "</li>";
      $("#divListSem").append(boxList);

      // list Course register
      listByActPolicy(student_id, item.fk_acaCal, function () {
        var columns = [
          { name: "bil", title: "No." },
          { name: "cur_year", title: "Academic Session" },
          { name: "crs_code", title: "Course Code" },
          // { name: "credit", title: "Attendance (%)" },
          { name: "cMark", title: "Carry Mark" },
          { name: "credit", title: "Credit", breakpoints: "md sm xs" },
          { name: "btn_lect", title: "Lecturer", breakpoints: "md sm xs" },
          { name: "btnEvaluate", title: "Evaluate", breakpoints: "md sm xs" },
        ];

        let bil = 1;
        var list = [];
        let convertList = JSON.stringify(obj_regCrs.data);
        $("#dataList_" + item.fk_acaCal).val(convertList);
        // console.log(obj_regCrs.data);

        $.each(obj_regCrs.data, function (j, itemJ) {
          let acaSession = itemJ.acaYear;
          let acaCal = acaSession.replace("/", "") + "/" + itemJ.cal_cohort;

          if (itemJ.exam_status != 'ACTIVE') {
            btnCmark = '<span class="text-uppercase" style="text-align: center;">-</span>';

          }
          else {
            btnCmark = "<span onclick=\"viewCmarkCourse('" + student_id + "','" + item.fk_acaCal + "','" + itemJ.crsCode + "','" + itemJ.crs_name + "','" + itemJ.fk_course + "','" + acaCal + "','" + itemJ.cMark + "')\"><a href=\"#\" style=\"color: #009688;\">" + itemJ.cMark + "</a></span>";

          }
          // alert(item.fk_course);
          list.push({
            bil: bil++,
            cur_year: acaCal,
            crs_code:
              '<span class="text-uppercase">' +
              itemJ.crsCode +
              " - " +
              itemJ.crs_name +
              "</span>",
            cMark: btnCmark,
            // cMark: '<span id="lectList-' + itemJ.cMark + '"></span><textarea class="hidden" id="dataLect_' +itemJ.cMark +'"></textarea>',
            credit: itemJ.crs_credit,
            btn_lect:
              '<span id="lectList-' +
              itemJ.fk_cotDet +
              '"></span><textarea class="hidden" id="dataLect_' +
              itemJ.fk_cotDet +
              '"></textarea>',
            btnEvaluate: '<button onclick="btnEvaluate(\'' + itemJ.rsb_id + '\',\'' + item.fk_acaCal + '\', \'' + itemJ.fk_cotDet + '\', \'' + itemJ.fk_course + '\')" class="btn yellow" style="font-size: 12px; padding: 5px 10px;"><i class="fa fa-star"></i></button>'
          });
          // window.sessionStorage.fk_acaCal = item.fk_acaCal;

          // window

          // polByCalExam(item.fk_acaCal, function () {
          //   let count = obj_polCMarkPolicy.data.length;
          //   // let dataLect = JSON.stringify(obj_polCMarkPolicy.data);
          //   // console.log(count);
          //   // $("#dataLect_" + itemJ.fk_cotDet).val(dataLect);

          //   // $.each(obj_polCMarkPolicy.data, function (k, itemK) {
          //   //   $("#lectList-" + itemJ.fk_cotDet).append(
          //   //     ++k +
          //   //       '. <a href="#" class="text-uppercase" style="color: #009688" onclick="viewLect(\'' +
          //   //       itemK.empId +
          //   //       "','" +
          //   //       itemK.emp_name +
          //   //       "','" +
          //   //       item.fk_acaCal +
          //   //       "','" +
          //   //       j +
          //   //       "',)\">" +
          //   //       itemK.emp_name +
          //   //       "</a><br>"
          //   //   );
          //   // });
          // });


          // <div class="checkbox">
          // <label>
          //   <input type="checkbox" class="has-value"> Check me out
          // </label>
          //             </div>

          // list lecturer by cotDet
          getLect(itemJ.fk_cotDet, function () {
            let dataLect = JSON.stringify(obj_lect.data);
            $("#dataLect_" + itemJ.fk_cotDet).val(dataLect);
            bil = 1;

            $.each(obj_lect.data, function (k, itemK) {



              if (k <= bil) {


                labelDone = `<p>
  <label class="md-check">
    <input disabled type="checkbox" checked="">
    <i class="green"></i>
    `+ bil +
                  `. <a href="#" class="text-uppercase" style="color: #009688" onclick="viewLect(\'` +
                  itemK.empId +
                  `','` +
                  itemK.emp_name +
                  `','` +
                  item.fk_acaCal +
                  `','` +
                  j +
                  `',)\">` +
                  itemK.emp_name +
                  `</a><br>` + `
  </label>
</p>`;

                labelUndone = `<p>
<label class="md-check">
  <input value="${itemK.empId}" type="checkbox" class="has-value eva_${itemJ.fk_cotDet}">
  <i class="blue"></i>
  `+ bil +
                  `. <a href="#" class="text-uppercase" style="color: #009688" onclick="viewLect(\'` +
                  itemK.empId +
                  `','` +
                  itemK.emp_name +
                  `','` +
                  item.fk_acaCal +
                  `','` +
                  j +
                  `',)\">` +
                  itemK.emp_name +
                  `</a><br>` + `
</label>
</p>`;


                bil++;

              } else {
                bil = 0;
              }

              checkingTick = (itemK.pk_cte_feedback == null) ? labelUndone : labelDone;



              $("#lectList-" + itemJ.fk_cotDet).append(checkingTick);
            });
          });
        });
        $("#crList_" + item.fk_acaCal).html('');
        $("#crList_" + item.fk_acaCal).footable({
          columns: columns,
          rows: list,
          paging: {
            enabled: true,
            size: 10,
            countFormat: "Showing {PF} to {PL} of {TR} data",
          },
          filtering: {
            enabled: true,
            placeholder: "Search...",
            dropdownTitle: "Search for:",
          },
        });
      });


      if (window.sessionStorage.prevPage != '' || window.sessionStorage.prevPage != null) {
        $('#' + window.sessionStorage.prevPage).addClass('active');

        if ($('#' + window.sessionStorage.prevPage).hasClass('active')) {
          sessionStorage.removeItem('prevPage');

        }
      }
    });
  });
});
var confirmed = false;

// start adlina crslist
stdByAcaCalCrs(function () {

  columns.push(
    { name: "tMark", title: "Total Mark (100%)", breakpoints: "md sm xs" },
    { name: "gred", title: "Grade", breakpoints: "md sm xs" },
    { name: "point", title: "Grade Point", breakpoints: "md sm xs" }
  );

  // console.log(listSubItem);

  let bil = 1;
  let convertList = JSON.stringify(obj_stdRegCrs.data);
  $("#dataList").val(convertList);
  var list = [];
  let viewData = [];

  $.each(obj_stdRegCrs.data, function (j, itemJ) {
    let status = itemJ.rsb_status;
    let chk = "";
    if (status != "Barred") {
      chk = "checked";
    }

    let display = "";
    if (usrCatEadmin == 1) {
      display = "";
    } else if (usrCatEcmis == 1) {
      if (usrId == lectId && lect_coor == "Yes") {
        display = "";
      } else {
        display = "disabled";
      }
    }

    if (itemJ.mark_generate != null) {
      $("#print_mark").prop("disabled", false);
    }
    // console.log(display);
    let tMark = itemJ.tMark * 1;
    viewData = {
      bil: bil++,
      student_id: '<span class="text-uppercase">' + itemJ.std_id + "</span>",
      std_name: '<span class="text-uppercase">' + itemJ.sti_name + "</span>",
      pgm_code: '<span class="text-uppercase">' + itemJ.pgmCode + "</span>",
      btnAction:
        '<button class="btn btn-icon btn-outline-success" title="Marks" onclick="detailMark(\'' +
        itemJ.std_id +
        '\')" id="btnStdList" ' +
        display +
        '><i class="fa fa-pencil-square-o"></i></button>',
      cMark:
        `<p class="text-center text-success"><b id="` +
        itemJ.std_id +
        `_cMark">` +
        itemJ.cMark +
        `</b></p>`,
      tMark:
        `<p class="text-center text-success"><b id="` +
        itemJ.std_id +
        `_tMark">` +
        tMark.toFixed(0) +
        `</b></p>`,
      gred:
        `<p class="text-center text-success"><b id="` +
        itemJ.std_id +
        `_gred">` +
        itemJ.grade +
        `</b></p>`,
      point:
        `<p class="text-center text-success"><b id="` +
        itemJ.std_id +
        `_point">` +
        itemJ.point +
        `</b></p>`,
    };

    let names = "";

    // console.log(listSubItem)
    $.each(list_gradeCmpnnt, function (f, item) {
      let val = "";
      if (names != item.gsd_id) {

        names = item.gsd_id;

        if (itemJ.mark_generate != null) {
          objMark = JSON.parse(itemJ.mark_generate);
          if (item.gsd_component == "Formative Assessment") {
            field = f + 2;
          } else if (item.gsd_component == "Summative Assessment") {
            field = f + 3;
          }
          val = objMark[field];
        }
        viewData["mark" + item.gsd_id] =
          `<p class="text-info text-center"><b id="` +
          itemJ.std_id +
          "_" +
          item.gsd_id +
          `">` +
          val +
          `</b></p>`;
      }
    });

    list.push(viewData);
  });
  $("#loading_mode").modal("hide");

  $("#tblStudent").footable({
    columns: columns,
    rows: list,
    paging: {
      enabled: false,
      size: 50,
      countFormat: "Showing {PF} to {PL} of {TR} data",
    },
    filtering: {
      enabled: true,
      placeholder: "Search...",
      dropdownTitle: "Search for:",
    },
  });

  $("#show_mark").click(function () {
    $("#loading_mode").modal("show");
    let messages = "Done Load Mark";

    async function doSomethingAsync(item) {
      return new Promise((resolve) => {
        setTimeout(() => {
          $("#load_text").html(item);
          resolve();
        }, Math.random() * 1000);
      });
    }

    async function main() {
      await Promise.all(
        obj_stdRegCrs.data.map(async (itemJ) => {
          let names = "";
          let marks = 0;
          let percentage = 0;
          let full_mark = 0;
          let tMark = 0;
          let cMark = 0;
          let numArr = 0;
          let total_summative = 0;
          let components = "";
          let listing = [];

          let arr = [];

          await doSomethingAsync(itemJ.std_id + " - " + itemJ.sti_name + "...");
          // console.log(itemJ.std_id)
          listing.push(itemJ.std_id);
          listing.push(itemJ.sti_name);

          await listSubItem.forEach(async (item, f) => {
            var form = new FormData();
            form.append("fk_lectCrsDet", item.id);
            form.append("fk_student", itemJ.std_id);

            let results = await new post(
              host + "api_lecturer_picoms/public/misLectStdMark/chkStdMark",
              form,
              "picoms " + window.sessionStorage.token
            ).execute();

            if (results.success) {
              let dataMark = results.data;

              if (names != itemJ.std_id + "_" + dataMark[0].fk_gsDet) {
                if (f != 0) {
                  peratus = (marks / full_mark) * 100 * (percentage / 100);
                  sum = peratus.toFixed(2);

                  // console.log(total_summative +' + '+ sum);
                  if (components == "Summative Assessment") {
                    total_summative += sum * 1;

                  } else {
                    // console.log("ni ke: "+f+" - "+cMark +' + '+ sum);
                    cMark += sum * 1;
                    $("#" + names).html(sum);
                    listing.push(sum);
                  }

                  components = dataMark[0].gsd_component;

                  full_mark = 0;

                  // $("#"+names).html(sum);

                  // console.log(names + ' - ' + sum);
                }

                numArr = 0;

                if (dataMark.length > 1) {
                  numArr = dataMark.length - 1;
                }

                names = itemJ.std_id + "_" + dataMark[numArr].fk_gsDet;
                percentage = dataMark[numArr].gsd_percentage;
                full_mark += dataMark[numArr].non_obe_percentage * 1;
                marks = dataMark[numArr].mark * 1;

                // console.log(f+1)
                if (f == count_formative) {
                  peratus = (marks / full_mark) * 100 * (percentage / 100);
                  sum = peratus.toFixed(2);
                  // console.log(components)

                  if (components == "Summative Assessment") {
                    // console.log("Atas - "+cMark);

                    // cMark += (sum)*1;
                    $("#" + itemJ.std_id + "_cMark").html(cMark.toFixed(2));
                    listing.push(cMark.toFixed(2));

                    if (count_summative > 1) {
                      $("#" + names).html(sum);
                      listing.push(sum);
                    }
                  }

                  // console.log(names + ' - ' + sum);

                  // $("#"+names).html(sum);
                  // listing.push(sum);
                }

                if (f + 1 == listSubItem.length) {
                  peratus = (marks / full_mark) * 100 * (percentage / 100);
                  sum = peratus.toFixed(2);

                  cMark = $("#" + itemJ.std_id + "_cMark").html();
                  tMark = sum * 1 + cMark * 1 + total_summative;
                  // console.log(sum + ' + ' + cMark + ' + ' + total_summative + ' = ' + tMark);
                  // if(count_summative > 1){
                  //     $("#"+names).html(sum);
                  //     listing.push(sum);
                  // }
                  $("#" + names).html(sum);
                  listing.push(sum);

                  // $("#" + itemJ.std_id + "_cMark").html(cMark.toFixed(2));
                  $("#" + itemJ.std_id + "_tMark").html(tMark.toFixed(0));
                  listing.push(tMark.toFixed(0));

                  let form = new FormData();
                  form.append("grd_category", "001");
                  form.append("marks", tMark.toFixed(0));
                  let obj_grd = new post(
                    host + "api_exam_picoms/public/misExamGrading/getGrade",
                    form,
                    "picoms " + window.sessionStorage.token
                  ).execute();

                  if (obj_grd.success) {
                    data_grd = obj_grd.data;
                    $("#" + itemJ.std_id + "_gred").html(data_grd.grd_id);
                    $("#" + itemJ.std_id + "_point").html(
                      data_grd.quality_point
                    );
                    listing.push(data_grd.grd_id);
                    listing.push(data_grd.quality_point);

                    $("#generate_mark").prop("disabled", false);
                  }
                }
              } else {
                full_mark += dataMark[numArr].full_mark * 1;
                marks += dataMark[numArr].mark * 1;

                // console.log(f+1)
                if (f == count_formative) {
                  peratus = (marks / full_mark) * 100 * (percentage / 100);
                  sum = peratus.toFixed(2);
                  // console.log(components)
                  if (components == "Summative Assessment") {
                    // console.log("Bawah - "+cMark);

                    // cMark += (sum)*1;
                    $("#" + itemJ.std_id + "_cMark").html(cMark.toFixed(2));
                    listing.push(cMark.toFixed(2));

                    if (count_summative > 1) {
                      $("#" + names).html(sum);
                      listing.push(sum);
                    }
                  }
                }

                if (f + 1 == listSubItem.length) {
                  peratus = (marks / full_mark) * 100 * (percentage / 100);
                  sum = peratus.toFixed(2);

                  cMark = $("#" + itemJ.std_id + "_cMark").html();
                  tMark = sum * 1 + cMark * 1 + total_summative;
                  // console.log(sum + ' + ' + cMark + ' + ' + total_summative + ' = ' + tMark);

                  if (components == "Summative Assessment") {
                    $("#" + names).html(sum);
                    listing.push(sum);
                  }
                  // $("#" + itemJ.std_id + "_cMark").html(cMark.toFixed(2));
                  $("#" + itemJ.std_id + "_tMark").html(tMark.toFixed(0));
                  listing.push(tMark.toFixed(0));

                  let form = new FormData();
                  form.append("grd_category", "001");
                  form.append("marks", tMark.toFixed(0));
                  let obj_grd = new post(
                    host + "api_exam_picoms/public/misExamGrading/getGrade",
                    form,
                    "picoms " + window.sessionStorage.token
                  ).execute();

                  if (obj_grd.success) {
                    data_grd = obj_grd.data;
                    $("#" + itemJ.std_id + "_gred").html(data_grd.grd_id);
                    listing.push(data_grd.grd_id);
                    $("#" + itemJ.std_id + "_point").html(
                      data_grd.quality_point
                    );
                    listing.push(data_grd.quality_point);
                    $("#generate_mark").prop("disabled", false);
                  }
                }
              }
            } else {
              if (f == count_formative) {
                // console.log(names)
                peratus = (marks / full_mark) * 100 * (percentage / 100);
                sum = peratus.toFixed(2);

                if (components == "Formative Assessment") {
                  // console.log("Paling bawah - "+cMark);

                  $("#" + names).html(sum);
                  listing.push(sum);

                  cMark += sum * 1;
                  $("#" + itemJ.std_id + "_cMark").html(cMark.toFixed(2));
                  listing.push(cMark.toFixed(2));
                } else if (components == "Summative Assessment") {
                  // cMark += (sum)*1;
                  $("#" + itemJ.std_id + "_cMark").html(cMark.toFixed(2));
                  listing.push(cMark.toFixed(2));

                  if (count_summative > 1) {
                    $("#" + names).html(sum);
                    listing.push(sum);
                  }
                }

                $("#generate_mark").prop("disabled", false);
              }

              // if(names != itemJ.std_id + '_' + dataMark[0].fk_gsDet){
              //     peratus = ((marks/full_mark)*100)*(percentage/100);
              //     sum = peratus.toFixed(2);

              //     if(components == "Summative Assessment"){
              //         total_summative += (sum)*1;
              //     }
              //     else{
              //         console.log("Paling Bawah "+f+" - "+cMark +' + '+ sum);
              //         cMark += (sum)*1;
              //     }
              // }
            }
          });

          list_markStd.push({
            studentid: itemJ.std_id,
            data: Object.assign({}, listing),
          });
        })
      );
      // console.log(list_markStd);
      swal("Load Mark", messages, "success");
      $("#load_text").html("Loading...");
      $("#loading_mode").modal("hide");
    }

    setTimeout(() => {
      main();
    }, Math.random() * 1000);
    // main();

    $("#generate_mark").click(function () {
      $("#generateAllMark").modal("show");
      // let list = [];
      async function doSomethingAsync(field) {
        return new Promise((resolve) => {
          setTimeout(() => {
            $("#listStdMark").html(field);
            // item.forEach(async (field) => {
            //     $("#listStdMark").append('<tr><td>'+field.std_id+'</td><td>'+field.sti_name+'</td><td>'+field.cMark+'</td><td>'+field.tMark+'</td>'+
            //     '<td>'+field.grade+'</td><td>'+field.point+'</td><td>'+field.statusrecord+'</td></tr>');
            // });

            resolve();
          }, Math.random() * 1000);
        });
      }

      async function main() {
        await Promise.all(
          obj_stdRegCrs.data.map(async (itemJ, i) => {
            let rsb_id = itemJ.rsb_id;
            let cMark = $("#" + itemJ.std_id + "_cMark").html();
            let tMark = $("#" + itemJ.std_id + "_tMark").html();
            let grade = $("#" + itemJ.std_id + "_gred").html();
            let point = $("#" + itemJ.std_id + "_point").html();
            let mark_generate = list_markStd.find(
              ({ studentid }) => studentid === itemJ.std_id
            );

            // list.push({"std_id":itemJ.std_id,"sti_name":itemJ.sti_name,"cMark":cMark,"tMark":tMark,"grade":grade,"point":point});

            if (list.length > 0) {
              await doSomethingAsync(
                "<tr><td>" +
                itemJ.std_id +
                "</td><td>" +
                itemJ.sti_name +
                "</td><td>" +
                itemJ.cMark +
                "</td><td>" +
                itemJ.tMark +
                "</td>" +
                "<td>" +
                itemJ.grade +
                "</td><td>" +
                itemJ.point +
                "</td></tr>"
              );
              // list = [];
            }

            let form = new FormData();
            form.append("rsb_id", rsb_id);
            form.append("cMark", cMark);
            form.append("tMark", tMark);
            form.append("grade", grade);
            form.append("point", point);
            form.append("mark_generate", JSON.stringify(mark_generate.data));

            let obj = await new post(
              host + "api_pengurusan_pelajar/public/misStdRegsub/generateMark",
              form,
              "picoms " + window.sessionStorage.token
            ).execute();

            statusrecord =
              '<span class="label danger float-right">Failed</span>';

            if (obj.success) {
              statusrecord =
                '<span class="label success float-right">success</span>';
            }

            if (i == 0) {
              $("#listStdMark").html("");
            }

          })
        );

        $("#generateAllMark").modal("hide");
        $("#listStdMark").html("");
        swal("Done Generate Mark", "", "success");
        $("#done_btn").prop("disabled", false);
        $("#print_mark").prop("disabled", false);
      }

      setTimeout(() => {
        main();
        $("#print_mark").prop("disabled", false);
      }, Math.random() * 1000);
    });
  });
});
// end adlna

function viewLect(empId, empName, acaCal, indexJ) {
  listPrint = [];
  let dtCrs = JSON.parse($("#dataList_" + acaCal).val());
  dtCrs = dtCrs[indexJ];
  let session_intake = dtCrs.acaYear.replace("/", "") + "/" + dtCrs.cal_cohort;
  let fk_course = dtCrs.fk_course;
  let course_code = dtCrs.crsCode;
  let course_name = dtCrs.crs_name;

  $("#acaCal").html(session_intake);
  $("#lect_name").html(empName);
  $("#course_name").html(course_code + " - " + course_name);

  listPrint.push({
    emp: empId,
    nama: empName,
    cal: acaCal,
    session_intake: session_intake,
    course: fk_course,
    ccode: course_code,
    cname: course_name,
  });

  window.sessionStorage.list = JSON.stringify(listPrint);
  // $('#dataIndex').html(empId+','+acaCal+','+dtCrs.fk_course);

  // table Lecturer Timetable
  listByLectCalCrs(empId, acaCal, dtCrs.fk_course, function () {
    let columns = [
      { name: "bil", title: "No." },
      { name: "lect_day", title: "Day" },
      { name: "lect_time", title: "Time" },
      { name: "lect_slot", title: "Slot" },
      { name: "lect_venue", title: "Venue" },
    ];
    let bil = 1;
    let list_data = [];

    // console.log(obj_tmtDet.data);
    $.each(obj_tmtDet.data, function (i, field) {
      let dayVal = "";
      if (field.tmt_day == "1") {
        dayVal = "MONDAY";
      } else if (field.tmt_day == "2") {
        dayVal = "TUESDAY";
      } else if (field.tmt_day == "3") {
        dayVal = "WEDNESDAY";
      } else if (field.tmt_day == "4") {
        dayVal = "THURSDAY";
      } else if (field.tmt_day == "5") {
        dayVal = "FRIDAY";
      } else if (field.tmt_day == "6") {
        dayVal = "SATURDAY";
      } else if (field.tmt_day == "7") {
        dayVal = "SUNDAY";
      }

      list_data.push({
        bil: bil++,
        lect_day: dayVal,
        lect_time:
          formatTime(field.tmt_starttime) +
          " - " +
          formatTime(field.tmt_endtime),
        lect_slot: field.tmt_slot,
        lect_venue: field.loc_name,
      });
    });

    $("#tblLectTmt").html("");
    $("#tblLectTmt").footable({
      columns: columns,
      rows: list_data,
      paging: {
        enabled: true,
        size: 10,
        countFormat: "Showing {PF} to {PL} of {TR} data",
      },
      filtering: {
        enabled: true,
        placeholder: "Search...",
        dropdownTitle: "Search for:",
      },
    });

    ////
  });

  $("#mdlLectTmt").modal("show");
}

// -----------------------------------------------function display timetable student----------------------------------------------------------
////
// function viewStudent(empId, empName, acaCal, indexJ){
function viewStudent(studID, stud_name, aca_session, year, cohort) {
  // alert( studID +"lina"+ aca_session);
  listPrint2 = [];

  $("#stud_id").html(studID);
  $("#acad_session").html(aca_session);
  $("#year").html(year);
  $("#cohort").html(cohort);
  $("#stud_name").html(stud_name);


  let infoSTD = new get(host + 'api_pengurusan_pelajar/public/misStdInfo/show/' + studID, 'picoms ' + window.sessionStorage.token).execute();
  if (infoSTD.success) {
    let data = infoSTD.data;
    listPrint2.push({
      stud_name: stud_name,
      studId: studID,
      aca_session: aca_session,
      cohort: cohort,
      year: year.replace('/', ''),
      icnum: data.sti_icno,
      pgmCode: data.pgm_id,
      pgmpgmName: data.pgm_name,
    });
    // listPrint2.push({
    //   icnum: data.sti_icno,
    //   pgmCode: data.pgm_id,
    //   pgmpgmName: data.pgm_name,
    // });

  }

  console.log(listPrint2);
  window.sessionStorage.listTimetbl = JSON.stringify(listPrint2);
  // $('#dataIndex').html(empId+','+acaCal+','+dtCrs.fk_course);

  // table Student Timetable
  StudentTimetable(studID, aca_session, function () {
    let bil = 1;
    let list_data = [];
    let dayVal = "";
    let day_num = "";
    let display = "";
    let disLect = [];
    $("#tblStudTmt").html("");
    let data = obj_tmtDet.data;

    data.forEach(async (field, i) => {
      // console.log(field);
      if (field.tmt_day == "1") {
        dayVal = "MONDAY";
      } else if (field.tmt_day == "2") {
        dayVal = "TUESDAY";
      } else if (field.tmt_day == "3") {
        dayVal = "WEDNESDAY";
      } else if (field.tmt_day == "4") {
        dayVal = "THURSDAY";
      } else if (field.tmt_day == "5") {
        dayVal = "FRIDAY";
      } else if (field.tmt_day == "6") {
        dayVal = "SATURDAY";
      } else if (field.tmt_day == "7") {
        dayVal = "SUNDAY";
      }

      let lect_name = field.lecturer_name;

      // console.log(day_num);

      if (day_num != field.tmt_day) {
        if (i == 0) {
          display =
            `
          <tr>
            <td>` +
            dayVal +
            `</td>`;
        } else {
          display += "</tr>";
          $("#tblStudTmt").append(display);

          display =
            `<tr>
            <td>` +
            dayVal +
            `</td>`;
        }

        day_num = field.tmt_day;

        for (c = 8; c < 23; c++) {
          let startTime = field.tmt_starttime;
          let check_start = startTime.substring(0, 2) * 1;
          let endTime = field.tmt_endtime;
          let check_end = endTime.substring(0, 2) * 1;
          hour = check_end - check_start;

          if (check_start == c) {
            disLect = lect_name.split(" ");
            for (t = hour; t >= 1; t--) {
              display +=
                `<td class="purple-50 text-center"><small><b>` +
                field.crs_code +
                "</b><br>" +
                field.loc_name +
                ", " +
                field.tmt_slot +
                "<br>" +
                disLect[0] +
                " " +
                disLect[1] +
                `...</small></td>`;
            }
            d = c + hour;
            break;
          } else {
            display += `<td></td>`;
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
            disLect = lect_name.split(" ");

            for (t = hour; t >= 1; t--) {
              display +=
                `<td class="purple-50 text-center"><small><b>` + field.crs_code + "</b>" +
                "<br>" + field.loc_name + ", " +
                field.tmt_slot +
                "<br>" +
                disLect[0] +
                " " +
                disLect[1] +
                `...<small></td>`;
            }
            // d++;
            d = d + hour;
            break;
          } else {
            display += `<td></td>`;
          }
        }
      }

      if (i + 1 == data.length) {
        $("#tblStudTmt").append(display);
      }
    });
  });

  // $('#mdlStudTmt').modal('show');
  $("#StudTimetbl").modal("show");
}

////

function viewCmark(
  studID,
  stud_name,
  aca_session,
  year,
  lectCrsId,
  crsCode,
  crsName
) {
  let id = lectCrsId;
  window.sessionStorage.fk_acaCal = aca_session;
  window.sessionStorage.lectCrsId = lectCrsId;
  ;


  let obj = new get(
    host + "api_lecturer_picoms/public/misLectCrsPrm/show/" + id,
    "picoms " + window.sessionStorage.token
  ).execute();

  if (obj.success) {
    let data = obj.data;

    crsCode = data.crsCode;


    arr = [];
    let coursefk = data.fk_course;
    var form = new FormData();
    form.append("input", coursefk);
    obj = new post(
      host + "api_tetapan_picoms/public/misPrmGredScheme/checkName",
      form,
      "picoms " + window.sessionStorage.token
    ).execute();
    let gsc_id = obj.data[0].gsc_id;

    obj = new get(
      host + "api_tetapan_picoms/public/misPrmDetGredScheme/listByGS/" + gsc_id,
      "picoms " + window.sessionStorage.token
    ).execute();
    let columns = ["No.", "Student ID", "Name"];
    let formative = 0;
    let summative = 0;

    count_formative = 0;
    count_summative = 0;

    if (obj.success) {
      data_grd = obj.data;
      data_grd.forEach(async (item) => {
        if (item.gsd_component == "Summative Assessment") {
          gsdType = "Summative";
        } else if (item.gsd_component == "Formative Assessment") {
          gsdType = "Formative";
        }

        //add columns mark
        if (item.gsd_component == "Formative Assessment") {
          formative += item.gsd_percentage;
          // count_formative++;
        } else if (item.gsd_component == "Summative Assessment") {
          if (summative == 0) {
            columns.push("Carry Mark (" + formative + "%)");
          }
          summative += item.gsd_percentage;
          count_summative = 0;
        }

        columns.push(item.examTypeName + " (" + item.gsd_percentage + "%)");
      });

      columns.push("Total Mark (100%)", "Grade", "Grade Point");
    }

    let dataColumns = [];
    columns.forEach(async (item) => {
      dataColumns.push({ text: item });
    });

    arr.push(dataColumns);
    // console.log(dataColumns);
    // alert("asda");
    var form = new FormData();
    // let fk_aca_cal = fk_aca_cal;

    form.append("aca_session", data.fk_aca_cal);
    form.append("crs_code", data.fk_course);
    obj = new post(
      host + "api_pengurusan_pelajar/public/misStdRegsub/listByAcaCalCrs",
      // host + "api_pengurusan_pelajar/public/misStdRegsub/listByAcaCalCrsFixExam", //kot ada isu exam display std exam Application
      form,
      "picoms " + window.sessionStorage.token
    ).execute();

    let rows = [];
    if (obj.success) {
      dataStd = obj.data;
      let bil = 1;

      async function doSomethingAsync(item) {
        return new Promise((resolve) => {
          setTimeout(() => {
            $("#load_text").html(item);
            resolve();
          }, Math.random() * 1000);
        });
      }

      async function main() {
        await Promise.all(
          dataStd.map(async (itemj, i) => {
            let data_stdCrs = [bil++, itemj.std_id, itemj.sti_name];
            if (itemj.mark_generate != null) {
              let mark_generate = JSON.parse(itemj.mark_generate);
              mark_generate = Object.values(mark_generate);

              await mark_generate.forEach((val, f) => {
                if (f > 1) {
                  // if((val != 0 || val != 0.00) && Object.values(mark_generate).length > 5){
                  //     data_stdCrs.push(val);
                  // }
                  data_stdCrs.push(val);
                }
              });
            }

            rows.push(data_stdCrs);

            let datarows = [];
            data_stdCrs.forEach(async (item) => {
              datarows.push({ text: item });
            });
            arr.push(datarows);

            await doSomethingAsync(
              itemj.std_id + "  " + itemj.sti_name + "..."
            );
          })
        );

        setTimeout(function () {
          // console.log(rows);

          $("#btnExcel").click(function () {
            var tableData = [
              {
                sheetName: "Sheet1",
                data: arr,
              },
            ];
            var options = {
              fileName:
                yearTaken.replace("/", "") + "_" + cal_cohort + " - " + crsCode,
            };
            Jhxlsx.export(tableData, options);
          });


          $("#loading_mode").modal("hide");
        }, Math.random() * 1000);
      }

      main();
    }

    $("#StudTviewCmark").modal("show");
  }
  // $('#mdlStudTmt').modal('show');
}

// ----------------------------------------------- end function display timetable student----------------------------------------------------------
$("#printTimeTableStudent").on("click", function (e) {
  window.open("print_timetblStudent.html");
});


function student_info(id, returnValue) {
  var settings = {
    url:
      host +
      "api_pengurusan_pelajar/public/misStdInfo/show/" +
      window.sessionStorage.std_studentid,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_std = response;
    returnValue();
  });
}

function getLect(id, returnValue) {
  var settings = {
    url: host + "api_lecturer_picoms/public/misLectCrsPrm/listByCotDet/cte/" + id +"/"+window.sessionStorage.std_studentid,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_lect = response;
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


function listByActPolicy(std, acaCal, returnValue) {
  var form = new FormData();
  form.append("std_studentid", std);
  form.append("aca_session", acaCal);

  var settings = {
    url: host + "api_pengurusan_pelajar/public/misStdRegsub/listByActPolicy3",
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
    obj_regCrs = JSON.parse(response);
    returnValue();
  });
}

function studentSem(std, fk_acaCal, returnValue) {
  var form = new FormData();
  form.append("std_studentid", std);
  form.append("fk_acaCal", fk_acaCal);

  var settings = {
    url: host + "api_pengurusan_pelajar/public/misStdInfo/studentSem",
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
    obj_stdSem = JSON.parse(response);
    returnValue();
  });
}

function listByLectCalCrs(lect, acaCal, course, returnValue) {
  var form = new FormData();
  form.append("fk_lecturer", lect);
  form.append("fk_acaCal", acaCal);
  form.append("fk_course", course);

  var settings = {
    url: host + "api_timetbl_picoms/public/misTimetblDet/listByLectCalCrs",
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

function StudentTimetable(studID, aca_session, returnValue) {
  // function StudentTimetable(lect, acaCal, course, returnValue){

  var form = new FormData();
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



function stdByAcaCalCrs(returnValue) {


  let acaCal = window.sessionStorage.fk_acaCal;
  let crs = window.sessionStorage.lectCrsId;
  let studid = window.sessionStorage.std_studentid;

  var form = new FormData();
  form.append("aca_session", acaCal);
  form.append("crs_code", crs);
  form.append("std_studentid", studid);


  var settings = {
    url: host + "api_pengurusan_pelajar/public/misStdRegsub/listByAcaCalCrsStudent2",
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
    obj_stdRegCrs = JSON.parse(response);
    dtCrs = obj_stdRegCrs.data;


    // console.log(dtCrs[0]);
    let studID = dtCrs[0].std_id;
    let studname = dtCrs[0].sti_name;
    let year = dtCrs[0].acaYear;
    let cohort = dtCrs[0].cal_cohort;
    let course_name = dtCrs[0].crs_name;
    let course_code = dtCrs[0].crsCode;

    let mark_generate = dtCrs[0].mark_generate;

    if (mark_generate != "[]" && mark_generate != "") {
      let data_generate = JSON.parse(dtCrs[0].mark_generate);


      $.each(data_generate, function (i, item) {

        //baru tiga bulan kerja
        if (i == 2) {
          $("#testMark").val(item);

        } else if (i == 3) {
          $("#WRMark").val(item);

        } else if (i == 4) {
          $("#PreMark").val(item);

        } else if (i == 5) {
          $("#TCMark").val(item);

        }

      });

    }

    // let mark_generatae = JSON.parse(dtCrs[0].mark_generate

    $("#studID").html(studID + " - " + studname);
    $("#stdname").html(studname);
    $("#cmsession").html(year + " / " + cohort);
    // $("#crscohort").html(cohort);
    $("#crsname").html(course_code + " - " + course_name);
    returnValue();


  });
}

function viewCmarkCourse(studID, aca_session, ccode, cname, lectCrsId, session, tmark) {
  $("#studID").html(studID);
  $("#cmsession").html(session);
  $("#crsname").html(ccode + " - " + cname);
  var tmark = tmark;


  stdByAcaCalCrs2(studID, aca_session, lectCrsId, function () {
    let columns = [
      { name: "bil", title: "No." },
      { name: "examtype", title: "Exam Type" },
      { name: "ascore", title: "Score Achieve" },
    ];

    let bil = 1;
    let list_data = [];
    let num = 2;
    let tpercentage = 0;

    if (obj_cMark.success) {
      // console.log(obj_cMark.data);
      $.each(obj_cMark.data, function (i, field) {
        if (field.mark_generate != null) {
          var show_mark_generate = JSON.parse(field.mark_generate);
          tpercentage += field.gsd_percentage;

          list_data.push({
            bil: bil++,
            examtype: field.examTypeName + ' (' + field.gsd_percentage + '%)',
            ascore: show_mark_generate[num++],
          });
        } else {
          list_data.push({
            bil: bil++,
            examtype: field.examTypeName,
            ascore: "0.00",
          });
        }
      });

      // Update the total percentage after the loop
      $("#tpercent").html(tpercentage + '%');
      $("#cmachieve").html(tmark + '%');
      // $("#cmachieve").html(tmark+ '% /'+ tpercentage + '%');

      $("#tblCMark").html("");
      $("#tblCMark").footable({
        columns: columns,
        rows: list_data,
        paging: {
          enabled: true,
          size: 10,
          countFormat: "Showing {PF} to {PL} of {TR} data",
        },
        filtering: {
          enabled: true,
          placeholder: "Search...",
          dropdownTitle: "Search for:",
        },
      });
      $("#StudTviewCmark").modal("show");
    }
    else {
      swal('No data', 'Carry Mark ' + studID, 'warning');

    }
  });
}

// 
// }


function stdByAcaCalCrs2(studID, aca_session, lectCrsId, returnValue) {
  var form = new FormData();
  form.append("crs_code", lectCrsId);
  form.append("aca_session", aca_session);
  form.append("std_studentid", studID);

  var settings = {
    url: host + "api_pengurusan_pelajar/public/misStdRegsub/listByAcaCalCrsStudent",
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

  let request = $.ajax(settings);

  request.done(function (response) {
    obj_cMark = JSON.parse(response);
    returnValue();
  });

  request.fail(function (response) {
    obj_cMark = { success: false };
    returnValue();
  });
}


function btnEvaluate(rsbID, fk_acaCal, cotDet, crsCode) {

  senaraiLectEva = $('.eva_' + cotDet + ':checked').map(function () {
    return (this.value);
  }).get();

  if (senaraiLectEva < 1) {
    swal("Select Lecturer First!");
  } else {

    window.sessionStorage.fk_acaCal = fk_acaCal;
    window.sessionStorage.cotDet = cotDet;
    window.sessionStorage.crsCode = crsCode;
    window.sessionStorage.rsbID = rsbID;
    window.sessionStorage.prevPage = "navLectData" + fk_acaCal;
    window.sessionStorage.senaraiLectEva = senaraiLectEva;


    window.sessionStorage.content = "std_evaluate";
    // $('#content').load('std_evaluate.html');
    $('#content').hide().load('std_evaluate.html', function () {
      $(this).fadeIn(500);
    });

  }
}

// function polByCalExam(fk_acaCal,returnValue){
//   var settings = {
//       "url": host + "api_polisi/public/policyExamGet/"+fk_acaCal,
//       "method": "GET",
//       "timeout": 0,
//       "headers": {
//           "Authorization": "picoms " + window.sessionStorage.token
//       },
//   };

//   $.ajax(settings).done(function (response){
//       obj_polCMarkPolicy = response;
//       returnValue();
//   });
// }

