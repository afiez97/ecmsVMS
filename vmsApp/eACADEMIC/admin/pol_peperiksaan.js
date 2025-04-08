$(function () {
  $.ajaxSetup({
    cache: false,
  });

  let clg_id = window.sessionStorage.idPage;
  $("#clgId").val(clg_id);

  $.fn.select2.defaults.set("theme", "bootstrap");

  // select Academic Session
  curYearAct(function () {
    $(".currYear").append('<option value="">- Choose -</option>');
    $('#currYear_upt').append('<option value="">- Choose -</option>');
    $.each(obj_curYearAct.data, function (i, item) {
      $(".currYear").append(
        '<option value="' + item.cur_year + '">' + item.cur_year + "</option>"
      );
      $('#currYear_upt').append('<option value="'+item.cur_year+'">'+item.cur_year+'</option>');
    });

    $(".slct2").select2({
      width: null,
      containerCssClass: ":all:",
    });
  });

  acaCalActive2(function () {
    $(".currYear").html("");
    $(".currYear").append('<option value="">- Choose -</option>');
    $.each(obj_kalendar.data, function (i, item) {
      ////
      // $(".currYear").append('<option value="' + item.cur_year +'" calSem="' +item.cal_cohort +'">' + item.cur_year.replace("/", "") +"/" +item.cal_cohort +"</option>"
      $(".currYear").append('<option value="' + item.cur_year +'/'+item.cal_cohort+'" calSem="' +item.cal_cohort +'"  calyear="' +item.cur_year +'" >' + item.cur_year.replace("/", "") +"/" +item.cal_cohort +"</option>"
      );
    });

    $(".slct2").select2({
      width: null,
      containerCssClass: ":all:",
    });
  });


  $('#currYear').change(function(){
    let selectSession = $("#currYear option:selected").attr("calYear");
    let sem = $("#currYear option:selected").attr("calSem");

    catByYearSem(selectSession, sem, function(){
        $('#aca_calendar').html('');
        $('#aca_calendar').append('<option value="">- Choose -</option>');
        $.each(obj_kalendar.data, function(i, item){
            $('#aca_calendar').append('<option value="'+item.cal_id+'">'+item.category+'</option>');
        });
    });
  });

  $('#currYear_upt').change(function(){
    let selectSession = $("#currYear_upt option:selected").attr("calYear");
    let sem = $("#currYear_upt option:selected").attr("calSem");

    catByYearSem(selectSession, sem, function(){
        // $('#aca_calendar_upt').html('');
        $('#aca_calendar_upt').append('<option value="">- Choose -</option>');
        $.each(obj_kalendar.data, function(i, item){
            $('#aca_calendar_upt').append('<option value="'+item.cal_id+'">'+item.category+'</option>');
        });
    });
  });
  //-------------------------------------------------- end function change --------------------------------------------------//

  // category
  let objCategory = new get(
    host + "api_tetapan_picoms/public/acaCalCategory/list",
    "picoms " + window.sessionStorage.token
  ).execute();
  if (objCategory.success) {
    $(".pol_category").html("");
    $(".pol_category").append('<option value="">- Choose -</option>');
    $.each(objCategory.data, function (i, item) {
      $(".pol_category").append(
        '<option value="' + item.pk_id + '">' + item.category + "</option>"
      );
    });

    $(".slct2").select2({
      width: null,
      containerCssClass: ":all:",
    });
  }

  // select Exam Type
  exmTypeList(function () {
    $(".jenisPeperiksaan").append($('<option value="">- Choose -</option>'));
    $.each(obj_exmType.data, function (i, item) {
      $(".jenisPeperiksaan").append(
        $('<option value="' + item.pk_id + '">' + item.exam_type + "</option>")
      );
    });

    $(".slct2").select2({
      width: null,
      containerCssClass: ":all:",
    });
  });

  // exam policy list
  exmPolicyList(function () {


    // capaianPolicy = load_capaian();
        load_capaian();
        capaianPolicy = window.capaianData;
        // console.log(capaianPolicy);
        let addPolicy = capaianPolicy[0];
        let uptPolicy = capaianPolicy[1];
        let delPolicy = capaianPolicy[2];
    
        console.log(addPolicy);
        console.log(uptPolicy);
        console.log(delPolicy);
    
        if (addPolicy == 0){
            PolicyAddDisabled = 'disabled';
        }
        else{
            PolicyAddDisabled = ''; 
        }
    
        if (uptPolicy == 0){
            PolicyUpdateDisabled = 'disabled';
        }
        else{
            PolicyUpdateDisabled = ''; 
        }
    
    
        if (delPolicy == 0){
            PolicyDelDisabled = 'disabled';
        }
        else{
            PolicyDelDisabled = ''; 
        }

    var colums = [
      { name: "bil", title: "No." },
      { name: "cur_year", title: "Academic Session" },
      { name: "category", title: "Category" },
      { name: "ass_type", title: "Assessment" },
      // { name: "exam_type", title: "Examination Types" },
      { name: "pol_date", title: "Start Date" },
      { name: "status", title: "Status" },

      { name: "upt_btn", title: "Action", breakpoints: "md sm xs" },
    ];

    let bil = 1;
    let convertList = JSON.stringify(obj_exmPolicy.data);
    console.log(obj_exmPolicy.data);
    $("#dataList").val(convertList);
    var list = [];

    $.each(obj_exmPolicy.data, function (i, field) {
      console.log(field);

      // if (field.cur_year != NULL)
      // {
      //   curYearSem = 
      // }
      list.push({
        
        bil: bil++,
        // cur_year: field.cur_year,
        cur_year: field.cur_year.replace("/", "") + "/" + field.cal_cohort,

        category: '<span class="text-uppercase">' + field.category + "</span>",
        ass_type:
          '<span class="text-uppercase">' + field.assessment + "</span>",
        // exam_type: '<span class="text-uppercase">' + field.pol_exm_type + "</span>",
        status: '<span class="text-uppercase">' + field.exam_status + "</span>",
        pol_date:
          formatDate(field.pol_marks_open) 
          // +
          // " - " +
          // formatDate(field.pol_marks_close)
          ,
        upt_btn:
          '   <button class="btn btn-icon success" '+PolicyUpdateDisabled+' title="Update" onclick="loadData(\'' +
          i +
          "','" +
          field.cur_year +
          '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button> ' +
          '<button class="btn btn-icon danger" '+PolicyDelDisabled+' title="Delete" onclick="del_rekod(\'' +
          field.Pk_exam_policy +
          '\')"><i class="ion-trash-b"></i>',
      });
    });

    $("#polisiExamList").footable({
      columns: colums,
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
});
var confirmed = false;

//-------------------------------------------------- add exam policy --------------------------------------------------//
$("#addExamPolicy").on("submit", function (e) {
  if (!confirmed) {
    e.preventDefault();
    swal({
      title: "Add Examination Policy",
      text: "Are You Sure?",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Save",
      confirmButtonColor: "#2196f3",
      closeOnConfirm: true,
      allowOutsideClick: false,
      html: false,
    }).then(function () {
      let cur_year = $("#currYear option:selected").attr("calYear");
      let cal_cohort = $("#currYear option:selected").attr("calSem");
      // let pol_category = $("#pol_category").val();
      let assessment = $("#ass_type").val();
      let pol_marks_open = $("#pol_marks_open").val();
      let exam_status = $("#exam_status").val();
      let aca_calendar = $("#aca_calendar").val();

      // let pol_marks_close = $("#pol_marks_close").val();

      var form = new FormData();
      form.append("cur_year", cur_year);
      form.append("aca_calendar", aca_calendar);
      // form.append("pol_category", pol_category);
      form.append("assessment", assessment);
      form.append("pol_marks_open", pol_marks_open);
      // form.append("pol_marks_close", pol_marks_close);
      form.append("recordstatus", "ADD");
      form.append("cal_cohort", cal_cohort);
      form.append("exam_status", exam_status);

      var settings = {
        url: host + "api_polisi/public/misExamPolicyDate/register",
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
        result = JSON.parse(response);
        if (!result.success) {
          Swal(result.message, result.data, "error");
          return;
        }
        window.location.reload();
      });
    });
  }
});
//-------------------------------------------------- end add exam policy --------------------------------------------------//

//-------------------------------------------------- update exam policy --------------------------------------------------//
$("#uptExmPolicy").on("submit", function (e) {
  if (!confirmed) {
    e.preventDefault();
    swal({
      title: "Update Examination Policy",
      text: "Are You Sure?",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Update",
      confirmButtonColor: "#22b66e",
      closeOnConfirm: true,
      allowOutsideClick: false,
      html: false,
    }).then(function () {
      let Pk_exam_policy = $("#exam_policy_id").val();
      let cur_year = $("#currYear_upt option:selected").attr("value");
      let upt_pol_category = $("#upt_pol_category").val();
      let assessment = $("#upt_ass_type").val();
      // let jenisPeperiksaan = $("#upt_jenisPeperiksaan").val();
      let cal_cohort = $("#currYear_upt option:selected").attr("calSem");
      let upt_open_date = $("#upt_open_date").val();
      let upt_end_date = $("#upt_end_date").val();
      let upt_exam_status = $("#upt_exam_status").val();
      let aca_calendar = $("#aca_calendar_upt").val();


      var form = new FormData();
      form.append("Pk_exam_policy", Pk_exam_policy);
      form.append("cur_year", cur_year);
      form.append("pol_category", upt_pol_category);
      form.append("assessment", assessment);
      // form.append("cal_cohort", jenisPeperiksaan);
      form.append("pol_marks_open", upt_open_date);
      form.append("pol_marks_close", upt_end_date);
      form.append("exam_status", upt_exam_status);
      form.append("aca_calendar", aca_calendar);

      form.append("recordstatus", "EDT");

      var settings = {
        url: host + "api_polisi/public/misExamPolicyDate/update",
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
        result = JSON.parse(response);
        if (!result.success) {
          Swal(result.message, result.data, "error");
          return;
        }
        window.location.reload();
      });
    });
  }
});
//-------------------------------------------------- end update exam policy --------------------------------------------------//

// view data
function loadData(indexs, pep) {
  let data = JSON.parse($("#dataList").val());
  console.log(data);

  let selected = data[indexs].cur_year.replace("/", "-");
  let cur_year1 = pep;

  let selectSession = data[indexs].cur_year.replace("/", "-");
  let sem = data[indexs].cal_cohort;

  catByYearSem(selectSession, sem, function(){
    $('#aca_calendar_upt').html('');
    $('#aca_calendar_upt').append('<option value="">- Choose -</option>');
    $.each(obj_kalendar.data, function(i, item){
        $('#aca_calendar_upt').append('<option value="'+item.cal_id+'">'+item.category+'</option>');
    });
    $('#aca_calendar_upt').val(data[indexs].aca_calendar);
  });

  // console.log(data[indexs].pol_exm_type);
  $("#currYear_upt").val(data[indexs].cur_year+'/'+data[indexs].cal_cohort).trigger("change");
  $("#upt_pol_category").val(data[indexs].cal_category).trigger("change");
  // $("#cal_cohort").val(data[indexs].cal_cohort).trigger("change");
  $("#exam_policy_id").val(data[indexs].Pk_exam_policy);
  $("#upt_jenisPeperiksaan").val(data[indexs].pol_exm_type).trigger("change");
  $("#upt_open_date").val(data[indexs].pol_marks_open);
  $("#upt_end_date").val(data[indexs].pol_marks_close);
  $("#upt_exam_status").val(data[indexs].exam_status);

  //   curYearActUpt(cur_year1,function () {

  //     //   $("#exam_policy_id").val();
  //         // form.append("Pk_exam_policy", id3);
  //         // form.append("Pk_exam_policy", id3);
  //         $("#currYear_upt").html("");

  //         $("#currYear_upt").append($('<option value="">- Choose -</option>'));
  //         $.each(obj_curYearAct.data, function (i, item) {

  //           $("#currYear_upt").append(
  //             '<option value="' + item.cur_year + '">' + item.cur_year + "</option>"
  //           );
  //         });
  //         // console.log(obj_curYearAct.data);
  //         $(".slct2").select2({
  //           width: null,
  //           containerCssClass: ":all:",
  //         });
  //         $("#exam_policy_id").val(data[indexs].Pk_exam_policy);

  //       });

  progDetYear(selected, function () {
    $("#upt_pgm_id").html("");
    $("#upt_pgm_id").append('<option value="">- Choose -</option>');
    $.each(obj_pgmYear.data, function (i, item) {
      $("#upt_pgm_id").append(
        '<option value="' +
          item.fk_pgm +
          '">' +
          item.pgmCode.toUpperCase() +
          " - " +
          item.pgm_name.toUpperCase() +
          "</option>"
      );
    });
    $("#upt_pgm_id").val(data[indexs].fk_pgm);

    $(".slct2").select2({
      width: null,
      containerCssClass: ":all:",
    });
  });

  $("#update-peperiksaan").modal("show");
}

// delete exam policy
function del_rekod(id) {
  var form = new FormData();
  form.append("recordstatus", "DEL");
  form.append("Pk_exam_policy", id);

  swal({
    title: "Remove Carry Mark Policy",
    text: "Are You Sure?",
    type: "question",
    showCancelButton: true,
    confirmButtonText: "Remove",
    confirmButtonColor: "#ef193c",
    closeOnConfirm: true,
    allowOutsideClick: false,
    html: false,
  }).then(function () {
    var settings = {
      url: host + "api_polisi/public/policyExamDelete",
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
      result = JSON.parse(response);
      if (!result.success) {
        Swal(result.message, result.data, "error");
        return;
      }
      window.location.reload();
    });
  });
}

function exmPolicyList(returnValue) {
  var settings = {
    url: host + "api_polisi/public/misExamPolicyDate/list",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_exmPolicy = response;
    returnValue();
  });
}
