
// capaianStudent = load_capaian();
// console.log(capaianStudent);
load_capaian();
capaianStudent = window.capaianData;
console.log(window.capaianData);
let addStudent = capaianStudent[0];
let uptStudent = capaianStudent[1];
let delStudent = capaianStudent[2];

var StudentAddDisabled = '';
var StudentUpdateDisabled = '';
var StudentDelDisabled = '';
if (addStudent == 0){

  $('#accessRoleAdd').addClass('disabled');
    StudentAddDisabled = 'disabled';
}

if (uptStudent == 0) {
  $('#accessRoleAdd').addClass('disabled');
  StudentUpdateDisabled = 'disabled';
}

if (delStudent == 0) {

  $('#accessRoleAdd').addClass('disabled');
  StudentDelDisabled = 'disabled';
}

$(function () {
  $.ajaxSetup({
    cache: false,
  });

  let clg_id = window.sessionStorage.idPage;
  var admin = window.sessionStorage.usrCatEadmin;

  // Get the button element by its ID
  var academicButton = document.getElementById("academicButton");

  // if (admin === "1" || admin === 1) {
  //   academicButton.disabled = false;
  //   $('.super_admin').show();

  // } else {
  //   academicButton.disabled = true;
  //   $('.super_admin').hide();

  // }


  $("#btn_upload").prop("disabled", false);
  $("#session_deffered").prop('required', false);
  $("#loading_modal").modal("show");

  let id = window.sessionStorage.usrId;
  let obj = new get(host + "api_hr_emp/public/users/show/" + id, 'picoms ' + window.sessionStorage.token).execute();
  if (obj.succes) {

  } else {

    if (obj.message === 'Unauthorized.') {
      //  sni nanti logout klau tiada capaian
      window.sessionStorage.clear();
      window.location.reload();
    }

  }
  $.fn.select2.defaults.set("theme", "bootstrap");

  $('.slct2').select2({
    width: null,
    containerCssClass: ':all:'
  });




  // select programme
  slctProg(clg_id, function () {
    // console.log(obj_prog.data);
    $("#pgm_id").append($('<option value="">- Choose -</option>'));
    $("#pgm_id_upt").append($('<option value="">- Choose -</option>'));
    $("#pgm_filter").append(
      $('<option value="">- Choose Programme -</option>')
    );
    $.each(obj_prog.data, function (i, item) {
      $("#pgm_id").append(
        $(
          '<option value="' +
          item.pgm_id +
          "-" +
          item.pgmCode +
          '">' +
          item.pgmCode +
          " - " +
          item.pgm_name +
          "</option>"
        )
      );
      $("#pgm_filter").append(
        $(
          '<option value="' +
          item.pgm_id +
          '">' +
          item.pgmCode +
          " - " +
          item.pgm_name +
          "</option>"
        )
      );
      $("#pgm_id_upt").append(
        $(
          '<option value="' +
          item.pgmCode +
          '">' +
          item.pgmCode +
          " - " +
          item.pgm_name +
          "</option>"
        )
      );
    });

    $("#pgm_filter").select2({
      width: null,
      containerCssClass: ":all:",
    });
  });

  // select intake
  slctIntake(function () {
    $("#intake_filter").append('<option value="">- Choose Intake -</option>');
    $("#sti_intake").append('<option value="">- Choose -</option>');
    $("#sti_intake_upt").append('<option value="">- Choose -</option>');
    $.each(obj_intake.data, function (i, item) {
      let intake = item.intake_month + "-" + item.intake_year;
      $("#intake_filter").append(
        '<option value="' + intake + '">' + intake + "</option>"
      );
      $("#sti_intake").append(
        '<option value="' + intake + '">' + intake + "</option>"
      );
      $("#sti_intake_upt").append(
        '<option value="' + intake + '">' + intake + "</option>"
      );
    });

    $("#intake_filter").select2({
      width: null,
      containerCssClass: ":all:",
    });
  });

  // select payment type
  slctPymntType(function () {
    $("#srg_payment_via").append($('<option value="">- Choose -</option>'));
    $("#upt_srg_payment_via").append($('<option value="">- Choose -</option>'));
    $.each(obj_payment.data, function (i, item) {
      $("#srg_payment_via").append(
        $(
          '<option value="' +
          item.srg_payment_via_id +
          '">' +
          item.srg_payment_via_name_en +
          "</option>"
        )
      );
      $("#upt_srg_payment_via").append(
        $(
          '<option value="' +
          item.srg_payment_via_id +
          '">' +
          item.srg_payment_via_name_en +
          "</option>"
        )
      );
    });
  });

  // select gender
  slctGender(function () {
    $("#sti_gender").append($('<option value="">- Choose -</option>'));
    $("#upt_sti_gender").append($('<option value="">- Choose -</option>'));
    $.each(obj_gender.data, function (i, item) {
      $("#sti_gender").append(
        $(
          '<option value="' +
          item.sti_gender_id +
          '">' +
          item.sti_gender_name +
          "</option>"
        )
      );
      $("#upt_sti_gender").append(
        $(
          '<option value="' +
          item.sti_gender_id +
          '">' +
          item.sti_gender_name +
          "</option>"
        )
      );
    });
  });

  // select muet
  slctMuet(function () {
    $("#sta_muet").append($('<option value="">- Choose -</option>'));
    $("#upt_sta_muet").append($('<option value="">- Choose -</option>'));
    $.each(obj_muet.data, function (i, item) {
      $("#sta_muet").append(
        $(
          '<option value="' +
          item.sta_muet_id +
          '">' +
          item.sta_muet_name +
          "</option>"
        )
      );
      $("#upt_sta_muet").append(
        $(
          '<option value="' +
          item.sta_muet_id +
          '">' +
          item.sta_muet_name +
          "</option>"
        )
      );
    });
  });

  // select blood type
  slctBlood(function () {
    $("#sti_blood_type").append($('<option value="">- Choose -</option>'));
    $("#sti_blood_type_upt").append($('<option value="">- Choose -</option>'));
    $.each(obj_bloodType.data, function (i, item) {
      $("#sti_blood_type").append(
        $(
          '<option value="' +
          item.sti_blood_type_id +
          '">' +
          item.sti_blood_type_name +
          "</option>"
        )
      );
      $("#sti_blood_type_upt").append(
        $(
          '<option value="' +
          item.sti_blood_type_id +
          '">' +
          item.sti_blood_type_name +
          "</option>"
        )
      );
    });
  });

  //sponsorship

  slctSpons(function () {
    $("#sti_sponsorship").append($('<option value="">- Choose -</option>'));
    $("#sti_sponsorship_upt").append($('<option value="">- Choose -</option>'));
    $.each(obj_sponsType.data, function (i, item) {
      $("#sti_sponsorship").append(
        $(
          '<option value="' +
          item.sponsorship_id +
          '">' +
          item.sponsorship_name +
          "</option>"
        )
      );
      $("#sti_sponsorship_upt").append(
        $(
          '<option value="' +
          item.sponsorship_id +
          '">' +
          item.sponsorship_name +
          "</option>"
        )
      );
    });
  });

  slctAsnaf(function () {
    $("#sti_asnaf").append($('<option value="">- Choose -</option>'));
    $("#sti_asnaf_upt").append($('<option value="">- Choose -</option>'));
    $.each(obj_asnafType.data, function (i, item) {
      $("#sti_asnaf").append(
        $(
          '<option value="' +
          item.asnaf_id +
          '">' +
          item.asnaf_name +
          "</option>"
        )
      );
      $("#sti_asnaf_upt").append(
        $(
          '<option value="' +
          item.asnaf_id +
          '">' +
          item.asnaf_name +
          "</option>"
        )
      );
    });
  });

  // select parent status
  slctParentStatus(function () {
    $("#par_parent_relation").append($('<option value="">- Choose -</option>'));
    $("#upt_par_parent_relation").append(
      $('<option value="">- Choose -</option>')
    );
    $.each(obj_parent.data, function (i, item) {
      $("#par_parent_relation").append(
        $(
          '<option value="' +
          item.sts_par_relation_id +
          '">' +
          item.sts_par_relation_name_en +
          "</option>"
        )
      );
      $("#upt_par_parent_relation").append(
        $(
          '<option value="' +
          item.sts_par_relation_id +
          '">' +
          item.sts_par_relation_name_en +
          "</option>"
        )
      );
    });
  });

  // select stay with
  slctStayWith(function () {
    $("#par_living_with").append($('<option value="">- Choose -</option>'));
    $("#upt_par_living_with").append($('<option value="">- Choose -</option>'));
    $.each(obj_stayWith.data, function (i, item) {
      $("#par_living_with").append(
        $(
          '<option value="' +
          item.sts_living_with_id +
          '">' +
          item.sts_living_with_name_en +
          "</option>"
        )
      );
      $("#upt_par_living_with").append(
        $(
          '<option value="' +
          item.sts_living_with_id +
          '">' +
          item.sts_living_with_name_en +
          "</option>"
        )
      );
    });
  });

  // select Native Status
  slctNative(function () {
    $("#sti_status_bumiputra").append(
      $('<option value="">- Choose -</option>')
    );
    $("#upt_sti_status_bumiputra").append(
      $('<option value="">- Choose -</option>')
    );
    $.each(obj_native.data, function (i, item) {
      $("#sti_status_bumiputra").append(
        $(
          '<option value="' +
          item.pk_id +
          '">' +
          item.sti_native_name +
          "</option>"
        )
      );
      $("#upt_sti_status_bumiputra").append(
        $(
          '<option value="' +
          item.pk_id +
          '">' +
          item.sti_native_name +
          "</option>"
        )
      );
    });
  });

  // select Race
  slctRace(function () {
    $("#sti_race").append($('<option value="">- Choose -</option>'));
    $("#upt_sti_race").append($('<option value="">- Choose -</option>'));
    $.each(obj_race.data, function (i, item) {
      $("#sti_race").append(
        $(
          '<option value="' +
          item.sti_race_id +
          '">' +
          item.sti_race_name +
          "</option>"
        )
      );
      $("#upt_sti_race").append(
        $(
          '<option value="' +
          item.sti_race_id +
          '">' +
          item.sti_race_name +
          "</option>"
        )
      );
    });
  });

  $("#sts_status").change(function () {
    let sts_status = $(this).val();
    if (sts_status == "10") {
      $("#row_deffered").prop('class', 'form-group row');
      $("#session_deffered").prop('required', true);


      $("#row_wd").prop('class', 'form-group row hidden');
      $("#acaCal_weeks").prop('required', false);



    }
    // || sts_status == "11" || sts_status == "12" || sts_status == "13" || sts_status == "14"
    // else if (sts_status == "7") {
    else if (sts_status == "7" || sts_status == "11" || sts_status == "12" || sts_status == "13" || sts_status == "14") {

      $("#row_wd").prop('class', 'form-group row');
      $("#acaCal_weeks").prop('required', true);

      $("#row_deffered").prop('class', 'form-group row hidden');
      $("#session_deffered").prop('required', false);
    }

    else {
      $("#row_deffered").prop('class', 'form-group row hidden');
      $("#session_deffered").prop('required', false);

      $("#row_wd").prop('class', 'form-group row hidden');
      $("#acaCal_weeks").prop('required', false);
    }
  });

  $("#session_deffered").change(function () {
    let session_deffered = $(this).val();
    let std_studentid = $('#matric_no').val();
    if (session_deffered != null) {
      $('#deffered_weeks').removeAttr("disabled");
      let objDeffered = new get(host + 'api_pengurusan_pelajar/public/curAcademic/student/session/checkingSts/' + std_studentid + '/Deferred/' + session_deffered, 'picoms ' + window.sessionStorage.token).execute();
      if (objDeffered.success) {
        // console.log();
        $('#deffered_weeks').val(objDeffered.data[0].acaCal_weeks);
      }

    }

  });
  // select student status
  slctStudStatus(function () {
    $("#sts_status").append($('<option value="">- Choose -</option>'));
    $("#upt_sts_status").append($('<option value="">- Choose -</option>'));
    $("#std_status").append($('<option value="">- Choose -</option>'));
    $("#ah_studStts2").append($('<option value="">- Choose -</option>'));
    $("#ah_studStts3").append($('<option value="">- Choose -</option>'));
    $("#ah_studStts4").append($('<option value="">- Choose -</option>'));
    $.each(obj_studStatus.data, function (i, item) {
      $("#sts_status").append(
        $(
          '<option data-stsData="' + item.sts_status_name_en + '"  value="' +
          item.sts_status_id +
          '">' +
          item.sts_status_name_en.toUpperCase() +
          "</option>"
        )
      );
      $("#upt_sts_status").append(
        $(
          '<option value="' +
          item.sts_status_id +
          '">' +
          item.sts_status_name_en.toUpperCase() +
          "</option>"
        )
      );
      $("#std_status").append(
        $(
          '<option value="' +
          item.sts_status_id +
          '">' +
          item.sts_status_name_en.toUpperCase() +
          "</option>"
        )
      );
      $("#ah_studStts2").append(
        $(
          '<option value="' +
          item.sts_status_id +
          '">' +
          item.sts_status_name_en.toUpperCase() +
          "</option>"
        )
      );
      $("#ah_studStts3").append(
        $(
          '<option value="' +
          item.sts_status_id +
          '">' +
          item.sts_status_name_en.toUpperCase() +
          "</option>"
        )
      );
      $("#ah_studStts4").append(
        $(
          '<option value="' +
          item.sts_status_id +
          '">' +
          item.sts_status_name_en.toUpperCase() +
          "</option>"
        )
      );
    });
  });

  // select Nationality
  slctNationality(function () {
    $("#sti_nationality").append($('<option value="">- Choose -</option>'));
    $("#sti_nationality_upt").append($('<option value="">- Choose -</option>'));
    $("#upt_sti_nationality").append($('<option value="">- Choose -</option>'));
    $("#par_father_nationality").append(
      $('<option value="">- Choose -</option>')
    );
    $("#par_mother_nationality").append(
      $('<option value="">- Choose -</option>')
    );
    $.each(obj_nationality.data, function (i, item) {
      $("#sti_nationality_upt").append(
        $(
          '<option value="' +
          item.pk_id +
          '">' +
          item.sti_nationality_name +
          "</option>"
        )
      );
      $("#sti_nationality").append(
        $(
          '<option value="' +
          item.pk_id +
          '">' +
          item.sti_nationality_name +
          "</option>"
        )
      );
      $("#upt_sti_nationality").append(
        $(
          '<option value="' +
          item.pk_id +
          '">' +
          item.sti_nationality_name +
          "</option>"
        )
      );
      $("#par_father_nationality").append(
        $(
          '<option value="' +
          item.pk_id +
          '">' +
          item.sti_nationality_name +
          "</option>"
        )
      );
      $("#par_mother_nationality").append(
        $(
          '<option value="' +
          item.pk_id +
          '">' +
          item.sti_nationality_name +
          "</option>"
        )
      );
    });
  });

  // select Religion
  slctReligion(function () {
    $("#sti_religion").append($('<option value="">- Choose -</option>'));
    $("#sti_religion_upt").append($('<option value="">- Choose -</option>'));
    $.each(obj_religion.data, function (i, item) {
      $("#sti_religion").append(
        $(
          '<option value="' +
          item.sti_religion_id +
          '">' +
          item.sti_religion_name +
          "</option>"
        )
      );
      $("#sti_religion_upt").append(
        $(
          '<option value="' +
          item.sti_religion_id +
          '">' +
          item.sti_religion_name +
          "</option>"
        )
      );
    });
  });

  // select OKU status
  slctOKU(function () {
    $("#sti_status_oku").append($('<option value="">- Choose -</option>'));
    $("#sti_status_oku_upt").append($('<option value="">- Choose -</option>'));
    $.each(obj_oku.data, function (i, item) {
      $("#sti_status_oku").append(
        $(
          '<option value="' +
          item.sti_status_oku_name +
          '">' +
          item.sti_status_oku_name +
          "</option>"
        )
      );
      $("#sti_status_oku_upt").append(
        $(
          '<option value="' +
          item.sti_status_oku_name +
          '">' +
          item.sti_status_oku_name +
          "</option>"
        )
      );
    });
  });

  // select State
  slctState(function () {
    $("#sti_state").append($('<option value="">- Choose -</option>'));
    $("#upt_sti_state").append($('<option value="">- Choose -</option>'));
    $.each(obj_state.data, function (i, item) {
      $("#sti_state").append(
        $(
          '<option value="' +
          item.kod +
          '">' +
          item.ringkasan.toUpperCase() +
          "</option>"
        )
      );
      $("#upt_sti_state").append(
        $(
          '<option value="' +
          item.kod +
          '">' +
          item.ringkasan.toUpperCase() +
          "</option>"
        )
      );
    });
  });

  // select Grade
  slctGrade(function () {
    $("#sta_bm_spm").append($('<option value="">- Choose -</option>'));
    $("#sta_bi_spm").append($('<option value="">- Choose -</option>'));
    $("#sta_math_spm").append($('<option value="">- Choose -</option>'));
    $("#sta_his_spm").append($('<option value="">- Choose -</option>'));
    $("#sta_islam_spm").append($('<option value="">- Choose -</option>'));

    $("#sta_other1_spm").append($('<option value="">- Choose -</option>'));
    $("#sta_other2_spm").append($('<option value="">- Choose -</option>'));
    $("#sta_other3_spm").append($('<option value="">- Choose -</option>'));
    $("#sta_other4_spm").append($('<option value="">- Choose -</option>'));
    $("#sta_other5_spm").append($('<option value="">- Choose -</option>'));

    $.each(obj_grade.data, function (i, item) {
      $("#sta_bm_spm").append(
        $(
          '<option value="' +
          item.grade_name +
          '">' +
          item.grade_name +
          "</option>"
        )
      );
      $("#sta_bi_spm").append(
        $(
          '<option value="' +
          item.grade_name +
          '">' +
          item.grade_name +
          "</option>"
        )
      );
      $("#sta_math_spm").append(
        $(
          '<option value="' +
          item.grade_name +
          '">' +
          item.grade_name +
          "</option>"
        )
      );
      $("#sta_his_spm").append(
        $(
          '<option value="' +
          item.grade_name +
          '">' +
          item.grade_name +
          "</option>"
        )
      );
      $("#sta_islam_spm").append(
        $(
          '<option value="' +
          item.grade_name +
          '">' +
          item.grade_name +
          "</option>"
        )
      );

      $("#sta_other1_spm").append(
        $(
          '<option value="' +
          item.grade_name +
          '">' +
          item.grade_name +
          "</option>"
        )
      );
      $("#sta_other2_spm").append(
        $(
          '<option value="' +
          item.grade_name +
          '">' +
          item.grade_name +
          "</option>"
        )
      );
      $("#sta_other3_spm").append(
        $(
          '<option value="' +
          item.grade_name +
          '">' +
          item.grade_name +
          "</option>"
        )
      );
      $("#sta_other4_spm").append(
        $(
          '<option value="' +
          item.grade_name +
          '">' +
          item.grade_name +
          "</option>"
        )
      );
      $("#sta_other5_spm").append(
        $(
          '<option value="' +
          item.grade_name +
          '">' +
          item.grade_name +
          "</option>"
        )
      );
    });
  });

  misSubject(window.sessionStorage.token, function () {
    // $('#sts_status').append($('<option value="">- Choose -</option>'));
    $.each(obj_subject.data, function (i, item) {
      $("#sta_sub1_spm").append(
        $(
          '<option value="' +
          item.kod_subject +
          '">' +
          item.subject.toUpperCase() +
          "</option>"
        )
      );
      $("#sta_sub2_spm").append(
        $(
          '<option value="' +
          item.kod_subject +
          '">' +
          item.subject.toUpperCase() +
          "</option>"
        )
      );
      $("#sta_sub3_spm").append(
        $(
          '<option value="' +
          item.kod_subject +
          '">' +
          item.subject.toUpperCase() +
          "</option>"
        )
      );
      $("#sta_sub4_spm").append(
        $(
          '<option value="' +
          item.kod_subject +
          '">' +
          item.subject.toUpperCase() +
          "</option>"
        )
      );
      $("#sta_sub5_spm").append(
        $(
          '<option value="' +
          item.kod_subject +
          '">' +
          item.subject.toUpperCase() +
          "</option>"
        )
      );
    });

    // $("#sta_sub1_spm").select2({
    //     width: null,
    //     containerCssClass: ':all:'
    // });

    // $("#sta_sub2_spm").select2({
    //     width: null,
    //     containerCssClass: ':all:'
    // });

    // $("#sta_sub3_spm").select2({
    //     width: null,
    //     containerCssClass: ':all:'
    // });

    // $("#sta_sub4_spm").select2({
    //     width: null,
    //     containerCssClass: ':all:'
    // });

    // $("#sta_sub5_spm").select2({
    //     width: null,
    //     containerCssClass: ':all:'
    // });
  });

  // select Session
  acaSession(function () {
    $("#sti_session").append('<option value="">- Choose -</option>');
    $("#sti_session_upt").append('<option value="">- Choose -</option>');
    $("#upl_session").append('<option value="">- Choose -</option>');

    let yearSession = "";

    $.each(obj_acaSession.data, function (i, item) {
      if (yearSession != item.cur_year) {
        $("#sti_session").append(
          '<option value="' +
          item.cur_year.replace("/", "-") +
          '">' +
          item.cur_year +
          "</option>"
        );
        $("#sti_session_upt").append(
          '<option value="' +
          item.cur_year.replace("/", "-") +
          '">' +
          item.cur_year +
          "</option>"
        );
        $("#upl_session").append(
          '<option value="' +
          item.cur_year.replace("/", "-") +
          '">' +
          item.cur_year +
          "</option>"
        );
      }
      yearSession = item.cur_year;
    });
  });

  // select Level of Education
  slctEduLevel(function () {
    $("#level_edu").append('<option value="">- Choose -</option>');
    $("#std_eduLevel").append('<option value="">- Choose -</option>');
    $("#ah_lvlEdu2").append('<option value="">- Choose -</option>');
    $("#ah_lvlEdu3").append('<option value="">- Choose -</option>');
    $("#ah_lvlEdu4").append('<option value="">- Choose -</option>');
    $.each(obj_eduLevel.data, function (i, item) {
      $("#level_edu").append(
        '<option value="' + item.pk_id + '">' + item.level + "</option>"
      );
      $("#std_eduLevel").append(
        '<option value="' + item.pk_id + '">' + item.level + "</option>"
      );
      $("#ah_lvlEdu2").append(
        '<option value="' + item.pk_id + '">' + item.level + "</option>"
      );
      $("#ah_lvlEdu3").append(
        '<option value="' + item.pk_id + '">' + item.level + "</option>"
      );
      $("#ah_lvlEdu4").append(
        '<option value="' + item.pk_id + '">' + item.level + "</option>"
      );
    });

    $("#std_eduLevel").select2({
      width: null,
      containerCssClass: ":all:",
    });

    $("#ah_lvlEdu2").select2({
      width: null,
      containerCssClass: ":all:",
    });

    $("#ah_lvlEdu3").select2({
      width: null,
      containerCssClass: ":all:",
    });

    $("#ah_lvlEdu4").select2({
      width: null,
      containerCssClass: ":all:",
    });
  });

  // select Title
  slctTitle(function () {
    $("#par_father_title").append('<option value="">- Choose -</option>');
    $("#par_mother_title").append('<option value="">- Choose -</option>');
    $.each(obj_title.data, function (i, item) {
      $("#par_father_title").append(
        '<option value="' + item.pk_id + '">' + item.title + "</option>"
      );
      $("#par_mother_title").append(
        '<option value="' + item.pk_id + '">' + item.title + "</option>"
      );
    });
  });

  // select Relationship
  slctRelationship(function () {
    $("#par_father_relationship").append(
      '<option value="">- Choose -</option>'
    );
    $("#par_mother_relationship").append(
      '<option value="">- Choose -</option>'
    );
    $.each(obj_relationship.data, function (i, item) {
      $("#par_father_relationship").append(
        '<option value="' + item.pk_id + '">' + item.relationship + "</option>"
      );
      $("#par_mother_relationship").append(
        '<option value="' + item.pk_id + '">' + item.relationship + "</option>"
      );
    });
  });

  // select Decision
  slctDecision(function () {
    $("#curstd_cectr_cect").append($('<option value="">- Choose -</option>'));
    $("#fin_baitulmal").append($('<option value="">- Choose -</option>'));
    $.each(obj_decision.data, function (i, item) {
      $("#std_cect").append(
        $(
          '<option value="' +
          item.decision_name +
          '">' +
          item.decision_name +
          "</option>"
        )
      );
      $("#fin_baitulmal").append(
        $(
          '<option value="' +
          item.decision_name +
          '">' +
          item.decision_name +
          "</option>"
        )
      );
    });
  });

  // select Study Loan/Scholarship
  slctStudyLoan(function () {
    $("#fin_penaja").append('<option value="">- Choose -</option>');
    $.each(obj_studyLoan.data, function (i, item) {
      $("#fin_penaja").append(
        '<option value="' + item.pk_id + '">' + item.study_loan + "</option>"
      );
    });
  });

  stdNewList(clg_id, function () {

    // StudentDelDisabled = '';
    // StudentUpdateDisabled = '';

    // $("#loading_modal").modal("hide");
    // console.log(obj_studList.success)
    if (obj_studList.success) {
      var columns = [
        { name: "sti_name", title: "Name" },
        { name: "sti_icno", title: "IC No.", breakpoints: "md sm xs" },
        { name: "pgm_name", title: "Programme", breakpoints: "lg md sm xs" },
        { name: "status", title: "Status" },
        // { name: "flag", title: "Flag" },
        { name: "upt_btn", title: "Action", breakpoints: "md sm xs" },
      ];

      let convertList = JSON.stringify(obj_studList.data);
      $("#dataList").val(convertList);
      var list = [];
      // console.log(obj_studList.data);
      $.each(obj_studList.data, function (i, field) {
        if (field.status_academic == 4) {
          colors = `blue`;
        } else if (field.status_academic == 1) {
          colors = `green`;
        } else if (field.status_academic == 5) {
          colors = `warning`;
        } else if (field.status_academic == 7) {
          colors = `red`;
        } else if (field.status_academic == 8) {
          colors = `primary`;
        } else if (field.status_academic == 9) {
          colors = `brown-900`;
        } else {
          colors = `secondary`;
        }

        let btn_list = '<button class="btn btn-icon m-b-1" title="Update" onclick="loadData(\'' +
          i +
          '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="fa fa-bars"></i></button>' +
          '<button class="btn btn-link text-danger m-b-1" ' + StudentDelDisabled + ' onclick="del(\'' +
          field.std_studentid +
          '\')" title="Remove"><i class="fa fa-times"></i>';

        if (sessionStorage.usrRole == "pensyarah") {
          btn_list = '<button class="btn btn-icon m-b-1" title="Update" onclick="loadData(\'' +
            i +
            '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="fa fa-bars"></i></button>';
        }
        list.push({
          sti_name: "<b>" + field.std_studentid + "</b><br>" + field.sti_name,
          sti_icno: field.sti_icno,
          pgm_name: field.pgm_name,
          status:
            `<span class='label rounded ` +
            colors +
            `'>` +
            field.sts_status_name_en +
            `</span>`,
          // flag:'<span><i class="fa fa-flag" style="color:red"></i></span>' ,
          upt_btn:
            btn_list,
        });
      });
      $("#tableStudent").html("");
      $("#tableStudent").footable({
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
      $("#loading_modal").modal("hide");
    }
  });

  $("#std_semester").html('<option value="">-Choose Semester-</option>');
  $("#reg_semester").html('<option value="">-Choose Semester-</option>');
  $("#hstl_semester").html('<option value="">-Choose Semester-</option>');
  for (num = 1; num < 16; num++) {
    $("#std_semester").append(
      '<option value="' + num + '">' + num + "</option>"
    );
    $("#reg_semester").append(
      '<option value="' + num + '">' + num + "</option>"
    );
    $("#hstl_semester").append(
      '<option value="' + num + '">' + num + "</option>"
    );
  }


  $("#buttonHideTranscript").click(function () {
    // $(".modalTranscript").hide();
    $(".modalTranscript").modal('hide');
  });


  // $("#buttonHideTranscript").click(function () {
  //   // $(".modalTranscript").hide();
  //   $(".modalTranscript").modal('hide');
  // });


});

var confirmed = false;

$(".reset_password").click(function () {
  swal({
    title: "Reset Password",
    text: "Sure?",
    type: "question",
    showCancelButton: true,
    confirmButtonText: "Save",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#2196f3",
    closeOnConfirm: true,
    allowOutsideClick: false,
    html: false,
  }).then(function () {
    var form = new FormData();
    let sti_icno = $("#sti_icno_upt").val();
    let std_studentid = $("#matric_no").val();

    form.append("sti_icno", sti_icno);
    form.append("std_studentid", std_studentid);

    // console.log(form);
    let token = window.sessionStorage.token;

    var settings = {
      url: host + "api_pengurusan_pelajar/public/pelajar/reset/password",
      method: "POST",
      timeout: 0,
      headers: {
        Authorization: "PICOMS " + token,
      },
      processData: false,
      mimeType: "multipart/form-data",
      contentType: false,
      data: form,
    };

    let request = $.ajax(settings);
    request.done(function (response) {
      let obj = JSON.parse(response);
      if (obj.success) {
        swal("Reset Password Success", "Student Info", "success");
      }
    });
    request.fail(function () {
      response = {
        success: false,
        message: "Reset Password Failed!",
        data: "",
      };
      swal(response.message, "Student Info", "error");
    });
  });
});

$("#form_basic").on("submit", function (e) {
  if (!confirmed) {
    e.preventDefault();
    swal({
      title: "Update Info",
      text: "Sure?",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2196f3",
      closeOnConfirm: true,
      allowOutsideClick: false,
      html: false,
    }).then(function () {
      var form = new FormData();

      let sti_name = $("#sti_name_upt").val();
      let sti_icno = $("#sti_icno_upt").val();
      let pgm_id = $("#pgm_id_upt").val();
      let sti_session = $("#sti_session_upt").val();
      let sti_intake = $("#sti_intake_upt").val();
      let sti_nationality = $("#sti_nationality_upt").val();

      let std_studentid = $("#matric_no").val();

      form.append("sti_name", sti_name.toUpperCase());
      form.append("sti_icno", sti_icno);
      form.append("pgm_id", pgm_id);
      form.append("sti_session_id", sti_session);
      form.append("cur_intake", sti_intake);
      form.append("sti_nationality", sti_nationality);
      form.append("std_studentid", std_studentid);

      // console.log(form);
      let token = window.sessionStorage.token;

      var settings = {
        url: host + "api_pengurusan_pelajar/public/pelajar/update/basic",
        method: "POST",
        timeout: 0,
        headers: {
          Authorization: "PICOMS " + token,
        },
        processData: false,
        mimeType: "multipart/form-data",
        contentType: false,
        data: form,
      };

      let request = $.ajax(settings);
      request.done(function (response) {
        let obj = JSON.parse(response);
        if (obj.success) {
          swal("Updated Success", "Student Info", "success");
        }
      });
      request.fail(function () {
        response = { success: false, message: "Register Error", data: "" };
        swal("Updated Fail", "Student Info", "error");
      });
    });
  }
});

$("#clear_btn").click(function () {
  window.location.reload();
})

$("#search_form").on("submit", function (e) {
  if (!confirmed) {
    e.preventDefault();
    $("#loading_modal").modal("show");
    let pgm_id = $("#pgm_filter").val();
    let cur_intake = $("#intake_filter").val();
    let input_txt = $("#input_txt").val();
    let cam_id = window.sessionStorage.idPage;

    if (input_txt == "" && pgm_id == "") {
      swal("Please Insert Seacrh Info", "Programme or Input Cannot be blank....", "warning");
      $("#loading_modal").modal("hide");
      return;
    }

    studInfoList(pgm_id, cur_intake, cam_id, input_txt, function () {

      // capaianStudent = load_capaian();
      load_capaian();
      capaianStudent = window.capaianData;
      let uptStudent = capaianStudent[1];
      let delStudent = capaianStudent[2];
    
      if (uptStudent == 0){
          StudentUpdateDisabled = 'disabled';
      }
      else{
          StudentUpdateDisabled = ''; 
      }
    
    
      if (delStudent == 0){
          StudentDelDisabled = 'disabled';
      }
      else{
          StudentDelDisabled = ''; 
      }

      
      $("#loading_modal").modal("hide");
      // console.log(obj_studList.success)
      if (obj_studList.success) {
        var columns = [
          { name: "sti_name", title: "Name" },
          { name: "sti_icno", title: "IC No.", breakpoints: "md sm xs" },
          { name: "pgm_name", title: "Programme", breakpoints: "lg md sm xs" },
          { name: "status", title: "Status" },
          { name: "flag", title: "Flag" },
          { name: "upt_btn", title: "Action", breakpoints: "md sm xs" },
        ];
        
        let convertList = JSON.stringify(obj_studList.data);
        // alert('nana');
        // console.log(obj_studList.data);
        $("#dataList").val(convertList);
        var list = [];

        $.each(obj_studList.data, function (i, field) {
          if (field.status_academic == 4) {
            colors = `blue`;
          } else if (field.status_academic == 1) {
            colors = `green`;
          } else if (field.status_academic == 5) {
            colors = `warning`;
          } else if (field.status_academic == 7) {
            colors = `red`;
          } else if (field.status_academic == 8) {
            colors = `primary`;
          } else if (field.status_academic == 9) {
            colors = `brown-900`;
          } else {
            colors = `secondary`;
          }
          // console.log();

          // active, in active, deffered
          if (field.status_academic == 1 || field.status_academic == 9 ) {
           flagLabel =  ((field.latestGPA*1) <= 1.45 )? '<span><i class="fa fa-flag" style="color:red"></i></span>':  '';
          }else{
            flagLabel = '';
          }
          list.push({
            sti_name: "<b>" + field.std_studentid + "</b><br>" + field.sti_name,
            sti_icno: field.sti_icno,
            pgm_name: field.pgm_name,
            status:
              `<span class='label rounded ` +
              colors +
              `'>` +
              field.sts_status_name_en +
              `</span>`,
             flag: flagLabel, 
            upt_btn:
              '<button class="btn btn-icon m-b-1" title="Update"  onclick="loadData(\'' +
              i +
              '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="fa fa-bars"></i></button>' +
              '<button class="btn btn-link text-danger m-b-1" '+StudentDelDisabled+' onclick="del(\'' +
              field.std_studentid +
              '\')" title="Remove"><i class="fa fa-times"></i>',
          });
        });
        $("#tableStudent").html("");
        $("#tableStudent").footable({
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
      }
    });
  }
});

$("#form_newReg").on("submit", function (e) {
  if (!confirmed) {
    e.preventDefault();
    swal({
      title: "Submit Registration",
      text: "Sure?",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2196f3",
      closeOnConfirm: true,
      allowOutsideClick: false,
      html: false,
    }).then(function () {
      let sti_name = $("#sti_name").val();
      let sti_icno = $("#sti_icno").val();
      let pgm = $("#pgm_id").val();
      let pgm_array = pgm.split("-");
      let pgm_id = pgm_array[1];
      let pgm_fk = pgm_array[0];

      let cur_intake = $("#sti_intake").val();
      let sti_nationality = $("#sti_nationality").val();
      // let sti_religion = $("#sti_religion").val();
      let sti_session_id = $("#sti_session").val();
      // let sti_status_oku = $("#sti_status_oku").val();
      // let sti_blood_type = $("#sti_blood_type").val();
      let sti_email = $("#sti_email").val();
      let cam_id = window.sessionStorage.idPage;
      let sti_image = $("#sti_image")[0].files[0];

      var form = new FormData();
      form.append("sti_name", sti_name.toUpperCase());
      form.append("sti_icno", sti_icno);
      form.append("pgm_id", pgm_id);
      form.append("pgm_fk", pgm_fk);
      form.append("cur_intake", cur_intake);
      form.append("sti_session_id", sti_session_id);
      form.append("sti_nationality", sti_nationality);
      // form.append("sti_religion", sti_religion);
      // form.append("sti_status_oku", sti_status_oku);
      // form.append("sti_blood_type", sti_blood_type);
      form.append("sti_email", sti_email);
      form.append("cam_id", cam_id);
      form.append("sti_image", sti_image);

      let token = window.sessionStorage.token;

      var settings = {
        url: host + "api_pengurusan_pelajar/public/pelajar/create",
        method: "POST",
        timeout: 0,
        headers: {
          Authorization: "PICOMS " + token,
        },
        processData: false,
        mimeType: "multipart/form-data",
        contentType: false,
        data: form,
      };

      let request = $.ajax(settings);
      request.done(function (response) {
        let obj = JSON.parse(response);
        if (obj.success) {
          let id_tawaran = $("#id_tawaran").val();
          if (id_tawaran != "") {
            var formUpt = new FormData();
            formUpt.append("id", id_tawaran);

            tsettings = {
              url: host + "api_pengurusan_pelajar/public/tawaran/update",
              method: "POST",
              timeout: 0,
              headers: {
                Authorization: "PICOMS " + token,
              },
              processData: false,
              mimeType: "multipart/form-data",
              contentType: false,
              data: formUpt,
            };
            let result = $.ajax(tsettings);
            result.done(function (e) {
              $("#form_newReg")[0].reset();
              window.location.reload();
            });
            request.error(function () {
              response = {
                success: false,
                message: "Register Error",
                data: "",
              };
              swal("UPDATE Fail", "Student Offer", "error");
            });
          } else {
            $("#form_newReg")[0].reset();
            window.location.reload();
          }
        }
      });
      request.error(function () {
        response = { success: false, message: "Register Error", data: "" };
        swal("Created Fail", "Student Info", "error");
      });
    });
  }
});

$("#btn_cancelReg").click(function () {
  $("#form_newReg")[0].reset();
  $("#new_reg").modal("hide");
});

var confirmed = false;
$("#upload_tawaran").on("submit", function (e) {
  if (!confirmed) {
    e.preventDefault();
    let selectedFile;
    selectedFile = $("#upl_file")[0].files[0];

    let data = [
      {
        name: "studentByEtawaran",
        data: "PICOMS",
      },
    ];

    let token = window.sessionStorage.token;

    XLSX.utils.json_to_sheet(data, "ecms.xlsx");
    if (selectedFile) {
      let fileReader = new FileReader();
      fileReader.readAsBinaryString(selectedFile);
      fileReader.onload = (event) => {
        let data = event.target.result;
        let workbook = XLSX.read(data, { type: "binary" });
        workbook.SheetNames.forEach((sheet) => {
          data_student = XLSX.utils.sheet_to_row_object_array(
            workbook.Sheets[sheet]
          );
          // $("#data_tawaran").html(JSON.stringify(data_student));
          upload_student(data_student, token);
        });
      };
    }
  }
});

function upload_student(data_student, token) {
  $.each(data_student, function (i, field) {
    var settings = {
      url: host + "api_pengurusan_pelajar/public/tawaran/create",
      method: "POST",
      timeout: 0,
      headers: {
        Authorization: "PICOMS " + token,
      },
      processData: false,
      mimeType: "multipart/form-data",
      contentType: "application/json",
      data: JSON.stringify(field),
    };
    let request = $.ajax(settings);
    request.done(function (response) {
      // objTawaran = JSON.parse(response);

      $("#list_uploaded").append(
        '<p clas="txt-success">' +
        field.first_name +
        " ( " +
        field.mykad +
        " ) </p>"
      );
    });
    request.error(function () {
      $("#list_uploaded").append(
        '<p class="txt-danger">' +
        field.first_name +
        " ( " +
        field.mykad +
        " ) </p>"
      );
    });

    if (data_student.length == i + 1) {
      $("#btn_upload").prop("disabled", true);
      swal({
        title: "Upload Student Info",
        text: "Done",
        type: "success",
        showCancelButton: false,
        confirmButtonText: "Ok",
        confirmButtonColor: "#2196f3",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false,
      }).then(function () {
        window.location.reload();
      });
    }
  });
}

$("#form_std_info").on("submit", function (e) {
  if (!confirmed) {
    e.preventDefault();
    swal({
      title: "Update Student Info",
      text: "Sure?",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2196f3",
      closeOnConfirm: true,
      allowOutsideClick: false,
      html: false,
    }).then(function () {
      var form = new FormData();
      $("form#form_std_info :input").each(function () {
        names = $(this).attr("name");
        values = $(this).val();
        form.append(names, values);
      });
      let sti_name = $("#sti_name_upt").val();
      let sti_icno = $("#sti_icno_upt").val();
      let pgm_id = $("#pgm_id_upt").val();
      let sti_session = $("#sti_session_upt").val();
      let sti_intake = $("#sti_intake_upt").val();
      let sti_nationality = $("#sti_nationality_upt").val();
      // let sti_sponsorship = $("#sti_sponsorship_upt").val();
      let sti_sponsorship = $("#sti_sponsorship").val();
      let sti_baitulmal = $("#sti_baitulmal").val();
      let sti_asnaf = $("#sti_asnaf").val();
      // alert(sti_sponsorship);

      form.append("sti_name", sti_name.toUpperCase());
      form.append("sti_icno", sti_icno);
      form.append("pgm_id", pgm_id);
      form.append("sti_session", sti_session);
      form.append("cur_intake", sti_intake);
      form.append("sti_nationality", sti_nationality);
      form.append("sti_sponsorship", sti_sponsorship);
      form.append("sti_baitulmal", sti_baitulmal);
      form.append("sti_asnaf", sti_asnaf);

      // console.log(form);
      let token = window.sessionStorage.token;

      var settings = {
        url: host + "api_pengurusan_pelajar/public/pelajar/update",
        method: "POST",
        timeout: 0,
        headers: {
          Authorization: "PICOMS " + token,
        },
        processData: false,
        mimeType: "multipart/form-data",
        contentType: false,
        data: form,
      };

      let request = $.ajax(settings);
      request.done(function (response) {
        let obj = JSON.parse(response);
        if (obj.success) {
          let formUpt = new FormData();
          let matric_no = $("#matric_no").val();
          let session_deffered = $("#session_deffered").val();
          let deffered_weeks = $("#deffered_weeks").val();
          let sts_status = $("#sts_status").val();

          if (sts_status == "10" && session_deffered != "") {
            formUpt.append('std_studentid', matric_no);
            formUpt.append('session_deffered', session_deffered);
            formUpt.append('deffered_weeks', deffered_weeks);

            obj = new post(host + 'api_pengurusan_pelajar/public/curAcademic/student/session/Deferred', formUpt, 'picoms ' + token).execute();
          }
          else if (sts_status == "8") {
            let matric_no = $("#matric_no").val();
            let sts_status = $("#sts_status").val();
            // alert(matric_no);
            let formUptCheckOut = new FormData();

            formUptCheckOut.append('stud_id', matric_no);

            obj = new post(host + 'api_hep/public/hepHostelChkinout/StudentGrad', formUptCheckOut, 'picoms ' + token).execute();
          }
          else if (sts_status == "7" || sts_status == "11" || sts_status == "12" || sts_status == "13" || sts_status == "14") {
            let matric_no = $("#matric_no").val();
            let sts_status = $("#sts_status option:selected").attr("data-stsdata");
            // let sts_status =  $("#sts_status option:selected").text();
            let acaCal_weeks = $("#acaCal_weeks").val();


            obj = new get(host + 'api_pengurusan_pelajar/public/curAcademic/student/session/latest/' + matric_no, 'picoms ' + token).execute();
            if (obj.success) {
              let fk_acaCal = obj.data.fk_acaCal;
              formUpt.append('std_studentid', matric_no);
              formUpt.append('sts_status', sts_status);
              formUpt.append('fk_acaCal', fk_acaCal);
              formUpt.append('acaCal_weeks', acaCal_weeks);
              obj = new post(host + 'api_pengurusan_pelajar/public/curAcademic/student/type', formUpt, 'picoms ' + token).execute();
            }

          }
          swal("Updated Success", "Student Info", "success");
          $("#topModalNew").modal("hide");

          setTimeout(() => {
            let code_indexs = $("#code_indexs").val();
            window.location.reload();
            // loadData(code_indexs);
          }, 2000);
        }
      });
      request.error(function () {
        response = { success: false, message: "Register Error", data: "" };
        swal("Updated Fail", "Student Info", "error");
      });
    });
  }
});

$("#form_std_parent").on("submit", function (e) {
  if (!confirmed) {
    e.preventDefault();
    swal({
      title: "Update Student Info",
      text: "Sure?",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2196f3",
      closeOnConfirm: true,
      allowOutsideClick: false,
      html: false,
    }).then(function () {
      var form = new FormData();
      $("form#form_std_parent :input").each(function () {
        names = $(this).attr("name");
        values = $(this).val();
        form.append(names, values);
      });

      let token = window.sessionStorage.token;

      let std_studentid = $("#matric_no").val();
      form.append("std_studentid", std_studentid);

      let pgm_fk = $("#pgm_fk").val();
      form.append("pgm_id", pgm_fk);

      std_parent(std_studentid, pgm_fk, token, function () {
        // console.log(obj_parent.success);
        if (obj_parent.success) {
          update_parent(form, token, function () {
            if (obj_parent.success) {
              swal("Updated Success", "Create Family Data", "success");
              $("#topModalNew").modal("hide");

              setTimeout(() => {
                let code_indexs = $("#code_indexs").val();
                loadData(code_indexs);
              }, 2000);
            } else {
              swal("Updated Fail", "Create Family Data", "error");
            }
          });
        } else {
          create_parent(form, token, function () {
            if (obj_parent.success) {
              swal("Updated Success", "Update Family Data", "success");
              $("#topModalNew").modal("hide");

              setTimeout(() => {
                let code_indexs = $("#code_indexs").val();
                loadData(code_indexs);
              }, 2000);
            } else {
              swal("Updated Fail", "Update Family Data", "error");
            }
          });
        }
      });
    });
  }
});

$("#session_select").change(function () {
  let std_semester = $("#session_select option:selected").attr("std_semester");
  $("#reg_semester").val(std_semester);

  let fk_acaCal = $(this).val();
  let fk_course = $("#fk_course").val();
  // let stdId = $("#matric_no").val();

  let form = new FormData();
  form.append('fk_acaCal', fk_acaCal);
  form.append('fk_course', fk_course);
  let obj = new post(host + 'api_tetapan_picoms/public/misPrmCrsCOTDet/list/acaCalender', form, 'picoms ' + window.sessionStorage.token).execute();


  if (obj.success) {
    let data = obj.data;
    // console.log(data);
    $("#ccd_id_repeat").val(data.ccd_id);
    // console.log(data.ccd_id);
  }
  else {
    swal('Course Not Available', 'academic session/intake not set this course!', 'error');
    $("#form_addCourse").trigger("reset");
    $("#modal_course").modal('hide');
  }
})

//form_add_course_student
$("#form_addCourse").on('submit', function (e) {
  if (!confirmed) {
    e.preventDefault();
    swal({
      title: "Add Course",
      text: "Sure?",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2196f3",
      closeOnConfirm: true,
      allowOutsideClick: false,
      html: false,
    }).then(function () {
      var form = new FormData();
      // $("form#form_addCourse :input.inputAddcourse").each(function () {

      $("form#form_addCourse :input").each(function () {
        // console.log($(this));
        let selectedStsRepeatOrNew = $("#status_course option:selected").val();

        names = $(this).attr("name");
        values = $(this).val();
        console.log(names + '--'+ values);
        if ($(this).attr("type") == "file") {
          let id_form = "#" + $(this).attr("id");
          form.append(names, $(id_form)[0].files[0]);

        } else {        
            form.append(names, values);


          
        }

        
      if (selectedStsRepeatOrNew == 'RC') {
        form.append("fk_cotDet", form.get("ccd_id_repeat"));
        form.delete("ccd_id_New");

      } else {
        form.delete("ccd_id_repeat");

        form.append("fk_cotDet", form.get("ccd_id_New"));


      }
      });



      let cur_year = $("#session_select option:selected").attr("curYear");
      let crs_select = $("#course_select").html();

      let token = window.sessionStorage.token;
      let std_studentid = $("#matric_no").val();
      form.append("std_studentid", std_studentid);
      form.append("rsb_status", "Register");
      form.append("cur_year", cur_year);
      form.append("recordstatus", "ADD");

      let obj = new post(host + 'api_pengurusan_pelajar/public/misStdRegsub/register', form, 'picoms ' + token).execute();
      if (obj.success) {
        swal("Add Course", std_studentid + ':' + crs_select, "success");
        $("#topModalNew").modal("hide");
        $("#modal_course").modal("hide");

        setTimeout(() => {
          let code_indexs = $("#code_indexs").val();
          loadData(code_indexs);
        }, 2000);

      } else {
        swal("Failed To Register", obj.message, "error");
      }

    });
  }
});

$("#form_std_registration").on("submit", function (e) {
  if (!confirmed) {
    e.preventDefault();
    swal({
      title: "Update Student Registration",
      text: "Sure?",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2196f3",
      closeOnConfirm: true,
      allowOutsideClick: false,
      html: false,
    }).then(function () {
      var form = new FormData();
      $("form#form_std_registration :input").each(function () {
        names = $(this).attr("name");
        values = $(this).val();
        if ($(this).attr("type") == "file") {
          let id_form = "#" + $(this).attr("id");
          form.append(names, $(id_form)[0].files[0]);
        } else {
          form.append(names, values);
        }
      });

      let token = window.sessionStorage.token;

      let std_studentid = $("#matric_no").val();
      form.append("std_studentid", std_studentid);

      let pgm_fk = $("#pgm_fk").val();
      form.append("pgm_id", pgm_fk);

      std_registration(std_studentid, token, function () {
        // console.log(obj_parent.success);
        if (obj_registration.success) {
          update_registration(form, token, function () {
            if (obj_registration.success) {
              swal("Updated Success", "Create Registration Data", "success");
              $("#form_std_registration")[0].reset();

              $("#topModalNew").modal("hide");

              setTimeout(() => {
                let code_indexs = $("#code_indexs").val();
                loadData(code_indexs);
              }, 2000);
            } else {
              swal("Updated Fail", "Create Registration Data", "error");
            }
          });
        } else {
          create_registration(form, token, function () {
            if (obj_registration.success) {
              swal("Updated Success", "Update Registration Data", "success");
              $("#form_std_registration")[0].reset();

              $("#topModalNew").modal("hide");

              setTimeout(() => {
                let code_indexs = $("#code_indexs").val();
                loadData(code_indexs);
              }, 2000);
            } else {
              swal("Updated Fail", "Update Registration Data", "error");
            }
          });
        }
      });
    });
  }
});

$("#form_std_academic").on("submit", function (e) {
  if (!confirmed) {
    e.preventDefault();
    swal({
      title: "Update Student Academic Background",
      text: "Sure?",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2196f3",
      closeOnConfirm: true,
      allowOutsideClick: false,
      html: false,
    }).then(function () {
      var form = new FormData();
      $("form#form_std_academic :input").each(function () {
        names = $(this).attr("name");
        values = $(this).val();
        if ($(this).attr("type") == "file") {
          let id_form = "#" + $(this).attr("id");
          form.append(names, $(id_form)[0].files[0]);
        } else {
          form.append(names, values);
        }
      });

      let token = window.sessionStorage.token;

      let std_studentid = $("#matric_no").val();
      form.append("std_studentid", std_studentid);

      let pgm_fk = $("#pgm_fk").val();
      form.append("pgm_id", pgm_fk);

      std_academic(std_studentid, token, function () {
        // console.log(obj_parent.success);
        if (obj_academic.success) {
          update_academic(form, token, function () {
            if (obj_academic.success) {
              swal("Updated Success", "Create Registration Data", "success");
              $("#form_std_registration")[0].reset();

              $("#topModalNew").modal("hide");

              setTimeout(() => {
                let code_indexs = $("#code_indexs").val();
                loadData(code_indexs);
              }, 2000);
            } else {
              swal("Updated Fail", "Update Academic Data", "error");
            }
          });
        } else {
          create_academic(form, token, function () {
            if (obj_academic.success) {
              swal("Updated Success", "Create Registration Data", "success");
              $("#form_std_registration")[0].reset();

              $("#topModalNew").modal("hide");

              setTimeout(() => {
                let code_indexs = $("#code_indexs").val();
                loadData(code_indexs);
              }, 2000);
            } else {
              swal("Create Fail", "Create Academic Data", "error");
            }
          });
        }
      });
    });
  }
});

$("#form_std_curAcademic").on("submit", function (e) {
  if (!confirmed) {
    e.preventDefault();
    swal({
      title: "Update Student Current Academic",
      text: "Sure?",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2196f3",
      closeOnConfirm: true,
      allowOutsideClick: false,
      html: false,
    }).then(function () {
      var form = new FormData();
      $("form#form_std_curAcademic :input").each(function () {
        names = $(this).attr("name");
        values = $(this).val();
        if ($(this).attr("type") == "file") {
          let id_form = "#" + $(this).attr("id");
          form.append(names, $(id_form)[0].files[0]);
        } else {
          form.append(names, values);
        }
      });

      let token = window.sessionStorage.token;

      let std_studentid = $("#matric_no").val();
      let semester = $("#std_semester").val();
      form.append("std_studentid", std_studentid);

      std_curAcademic(std_studentid, semester, token, function () {
        if (obj_curAcademic.success) {
          let dataList_json = $("#dataList_" + obj_curAcademic.data.fk_acaCal).val();
          let regSub = "";
          if (dataList_json != "") {
            regSub = JSON.parse(dataList_json);
          }
          update_curAcademic(form, token, function () {
            if (obj_curAcademic.success) {
              async function doSomething(item) {
                return new Promise(resolve => {
                  setTimeout(() => {
                    $("#display_response").html(item);
                    resolve();
                  }, Math.random() * 1000);
                });
              }

              async function regSub_update() {
                let aca_session = $("#session_cur").val();
                await Promise.all(
                  regSub.map(async (item) => {
                    let form_sub = new FormData();
                    form_sub.append('rsb_id', item.rsb_id);
                    form_sub.append('aca_session', aca_session);

                    let obj = await new post(host + 'api_pengurusan_pelajar/public/misStdRegsub/update/session', form_sub, "picoms " + window.sessionStorage.token).execute();
                    if (obj.succes) {
                      await doSomething(item.crs_name);
                    }
                  })
                );

                $("#display_response").html("Create/Update Academic Session");

                swal("Updated Success", "Create Registration Data", "success");
                $("#form_std_curAcademic")[0].reset();

                $("#topModalNew").modal("hide");

                setTimeout(() => {
                  let code_indexs = $("#code_indexs").val();
                  loadData(code_indexs);
                }, 2000);

              }
              regSub_update();

            } else {
              swal("Updated Fail", "Update Academic Data", "error");
            }
          });
        } else {
          create_curAcademic(form, token, function () {
            if (obj_curAcademic.success) {
              swal("Updated Success", "Create Registration Data", "success");
              $("#form_std_registration")[0].reset();

              $("#topModalNew").modal("hide");

              setTimeout(() => {
                let code_indexs = $("#code_indexs").val();
                loadData(code_indexs);
              }, 2000);
            } else {
              swal("Create Fail", "Create Academic Data", "error");
            }
          });
        }
      });
    });
  }
});

$("#std_semester").change(function () {
  let std_semester = $(this).val();
  let std_studentid = $("#matric_no").val();
  let token = window.sessionStorage.token;

  std_curAcademic(std_studentid, std_semester, token, function () {
    $("#form_std_curAcademic")[0].reset();
    $("#std_semester").val(std_semester);
    if (obj_curAcademic.success) {
      swal("Load Semester", "Display Academic Data", "success");

      let data = obj_curAcademic.data;
      $("#std_semester").val(data.std_semester);
      $("#session_cur").val(data.fk_acaCal);
      $("#std_admission").val(data.std_admission);
      $("#std_completion").val(data.std_completion);
      $("#std_senate_endorsement").val(data.std_senate_endorsement);
      $("#std_mentor").val(data.std_mentor);
      $("#std_remarks").val(data.std_remarks);
      // $("#std_gpa").val(data.std_gpa);
      // $("#std_cgpa").val(data.std_cgpa);
      $("#std_cect").val(data.std_cect);
      $("#std_total_cect").val(data.std_total_cect);
      $("#std_total_credit").val(data.std_total_credit);
      $("#std_total_hour").val(data.std_total_hour);

      if (data.std_warning_letter1 != "") {
        $("#link_warning_letter1").prop(
          "href",
          host +
          "api_pengurusan_pelajar/public/academic_cur/" +
          data.std_warning_letter1
        );
        $("#link_warning_letter1").prop("class", "label success m-b");
      } else {
        $("#link_warning_letter1").removeAttr("href");
        $("#link_warning_letter1").prop("class", "label red-300 disabled m-b");
      }

      if (data.std_warning_letter2 != "") {
        $("#link_warning_letter2").prop(
          "href",
          host +
          "api_pengurusan_pelajar/public/academic_cur/" +
          data.std_warning_letter2
        );
        $("#link_warning_letter2").prop("class", "label success m-b");
      } else {
        $("#link_warning_letter2").removeAttr("href");
        $("#link_warning_letter2").prop("class", "label red-300 disabled m-b");
      }

      if (data.std_warning_letter3 != "") {
        $("#link_warning_letter3").prop(
          "href",
          host +
          "api_pengurusan_pelajar/public/academic_cur/" +
          data.std_warning_letter3
        );
        $("#link_warning_letter3").prop("class", "label success m-b");
      } else {
        $("#link_warning_letter3").removeAttr("href");
        $("#link_warning_letter3").prop("class", "label red-300 disabled m-b");
      }
    } else {
      $("#link_warning_letter1").removeAttr("href");
      $("#link_warning_letter1").prop("class", "label red-300 disabled m-b");

      $("#link_warning_letter2").removeAttr("href");
      $("#link_warning_letter2").prop("class", "label red-300 disabled m-b");

      $("#link_warning_letter3").removeAttr("href");
      $("#link_warning_letter3").prop("class", "label red-300 disabled m-b");
    }
  });
});

$("#form_std_acaHistory").on("submit", function (e) {
  if (!confirmed) {
    e.preventDefault();
    swal({
      title: "Update Student Academic History",
      text: "Sure?",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2196f3",
      closeOnConfirm: true,
      allowOutsideClick: false,
      html: false,
    }).then(function () {
      var form = new FormData();
      $("form#form_std_acaHistory :input").each(function () {
        names = $(this).attr("name");
        values = $(this).val();
        if ($(this).attr("type") == "file") {
          let id_form = "#" + $(this).attr("id");
          form.append(names, $(id_form)[0].files[0]);
        } else {
          form.append(names, values);
        }
      });

      let token = window.sessionStorage.token;

      let std_studentid = $("#matric_no").val();
      form.append("std_studentid", std_studentid);

      let id_acaHistory = $("#id_acaHistory").val();
      if (id_acaHistory == "") {
        create_acaHistory(form, token, function () {
          if (obj_acaHistory.success) {
            swal("Save Success", "Create Academic History", "success");
            $("#topModalNew").modal("hide");

            setTimeout(() => {
              let code_indexs = $("#code_indexs").val();
              loadData(code_indexs);
            }, 2000);
          } else {
            swal("Create Fail", "Create Academic History", "error");
          }
        });
      } else {
        update_acaHistory(form, token, function () {
          if (obj_acaHistory.success) {
            swal("Save Success", "Update Academic History", "success");
            $("#topModalNew").modal("hide");

            setTimeout(() => {
              let code_indexs = $("#code_indexs").val();
              loadData(code_indexs);
            }, 2000);
          } else {
            swal("Create Fail", "Update Academic History", "error");
          }
        });
      }
    });
  }
});

$("#reset_btn").click(function () {
  $("#status_form").html("Mode Create Form");
  $("#status_form").prop("class", "green-200 p-l");
  $("#std_eduLevel").val("").trigger("change");
});

function load_acaHistory(id) {
  let token = window.sessionStorage.token;
  show_acaHistory(id, token, function () {
    if (obj_acaHistory.success) {
      $("#status_form").html("Mode Update Form");
      $("#status_form").prop("class", "amber-200 p-l");

      let data = obj_acaHistory.data;
      $("form#form_std_acaHistory :input").each(function () {
        let id_form = "#" + $(this).attr("id");
        let name = $(this).attr("name");
        if (name == "std_eduLevel") {
          $(id_form).val(data[name]).trigger("change");
        } else if (name == "std_transcript") {
          //except
        } else {
          $(id_form).val(data[name]);
        }
      });
    }
  });
}

$("#form_std_financial").on("submit", function (e) {
  if (!confirmed) {
    e.preventDefault();
    swal({
      title: "Update Student Financial",
      text: "Sure?",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2196f3",
      closeOnConfirm: true,
      allowOutsideClick: false,
      html: false,
    }).then(function () {
      var form = new FormData();
      $("form#form_std_financial :input").each(function () {
        names = $(this).attr("name");
        values = $(this).val();
        if ($(this).attr("type") == "checkbox") {
          let id_form = "#" + $(this).attr("id");
          if ($(id_form).prop("checked")) {
            form.append(names, values);
          } else {
            form.append(names, "No");
          }
        } else {
          form.append(names, values);
        }
      });

      let token = window.sessionStorage.token;

      let std_studentid = $("#matric_no").val();
      form.append("std_studentid", std_studentid);

      show_financial(std_studentid, token, function () {
        if (obj_financial.success) {
          update_financial(form, token, function () {
            if (obj_financial.success) {
              swal("Create Success", "Update Financial ", "success");
            } else {
              swal("Create Fail", "Update Financial ", "error");
            }
          });
        } else {
          create_financial(form, token, function () {
            if (obj_financial.success) {
              swal("Create Success", "Create Financial ", "success");
            } else {
              swal("Create Fail", "Create Financial ", "error");
            }
          });
        }
      });
    });
  }
});

$("#form_std_hostel").on("submit", function (e) {
  if (!confirmed) {
    e.preventDefault();
    swal({
      title: "Update Student Hostel",
      text: "Sure?",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2196f3",
      closeOnConfirm: true,
      allowOutsideClick: false,
      html: false,
    }).then(function () {
      var form = new FormData();
      $("form#form_std_hostel :input").each(function () {
        names = $(this).attr("name");
        values = $(this).val();
        if ($(this).attr("type") == "checkbox") {
          let id_form = "#" + $(this).attr("id");
          if ($(id_form).prop("checked")) {
            form.append(names, values);
          } else {
            form.append(names, "No");
          }
        } else {
          form.append(names, values);
        }
      });

      let token = window.sessionStorage.token;

      let std_studentid = $("#matric_no").val();
      form.append("std_studentid", std_studentid);

      let id = $("#id_std_hostel").val();
      if (id != "") {
        form.append("id", id);
        update_hostel(form, token, function () {
          if (obj_hostel.success) {
            swal("Create Success", "Update Student Hostel ", "success");
          } else {
            swal("Create Fail", "Update Student Hostel ", "error");
          }
        });
      } else {
        create_hostel(form, token, function () {
          if (obj_hostel.success) {
            swal("Create Success", "Create Student Hostel ", "success");
          } else {
            swal("Create Fail", "Create Student Hostel ", "error");
          }
        });
      }
    });
  }
});

function load_std_hostel(id) {
  let token = window.sessionStorage.token;
  show_hostel(id, token, function () {
    $("#form_std_hostel")[0].reset();
    if (obj_hostel.success) {
      let data = obj_hostel.data;
      $("form#form_std_hostel :input").each(function () {
        names = $(this).attr("name");
        let id_form = "#" + $(this).attr("id");
        if ($(this).attr("type") == "checkbox") {
          $(id_form).prop("checked", false);
          if (data[names] != "") {
            $(id_form).prop("checked", true);
          }
        } else {
          $(id_form).val(data[names]);
        }
      });
    }
  });
}

function regTawaran(i) {
  let obj = JSON.parse($("#tawaran_lists").val());
  let data = obj[i];
  // console.log(data);

  let address = data.address1;
  if (data.address2 != null) {
    address += ", " + data.address2;
  }

  $("#first_name_t").html(data.first_name);
  $("#mykad_t").html(data.mykad);
  $("#email_t").html(data.email);
  $("#mobile_no_t").html(data.mobile_no);
  $("#introducer_t").html(data.introducer);
  $("#status_t").html(data.status);
  $("#address_t").html(
    address +
    "<br>" +
    data.address_postcode +
    " " +
    data.address_city +
    ", " +
    data.address_state +
    "<br> <b>Country:</b> " +
    data.country
  );
  $("#ethnic_t").html(data.ethnic);
  $("#gender_t").html(data.gender);
  $("#religion_t").html(data.religion);
  $("#GRED_BM_t").html(data.GRED_BM);
  $("#GRED_BI_t").html(data.GRED_BI);
  $("#GRED_ISLAM_t").html(data.GRED_ISLAM);
  $("#GRED_MATH_t").html(data.GRED_MATH);
  $("#GRED_SEJARAH_t").html(data.GRED_SEJARAH);
  $("#school_name_t").html(data.school_name);
  $("#acad_year_t").html("SPM " + data.acad_year);
  $("#first_choice_t").html(data.first_choice);
  $("#second_choice_t").html(data.second_choice);
  $("#tawaran_indexs").val(i);

  $("#modal-tawaran").modal("show");
}

function std_tawaran(token, returnValue) {
  var settings = {
    url: host + "api_pengurusan_pelajar/public/tawaran/list",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
  };

  $.ajax(settings).done(function (response) {
    objTawaran = response;
    returnValue();
  });
}

$("#btn_regTawaran").click(function () {
  let i = $("#tawaran_indexs").val();
  let obj = JSON.parse($("#tawaran_lists").val());
  let data = obj[i];
  // console.log(data);

  let sti_name = data.first_name;
  $("#sti_name").val(sti_name.toUpperCase());
  $("#sti_icno").val(data.mykad);
  $("#sti_email").val(data.email);
  $("#sti_nationality").val(1);
  $("#id_tawaran").val(data.id);

  if (data.country == "MALAYSIA") {
    $("#sti_nationality").val(2);
  }

  $("#modal-tawaran").modal("hide");
  setTimeout(function () {
    $("#new_reg").modal("show");
  }, 500);
});

//mis_std_hostel_function
function list_hostel(std_studentid, token, returnValue) {
  var settings = {
    url: host + "api_pengurusan_pelajar/public/hostel/list/" + std_studentid,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
  };

  let request = $.ajax(settings);

  request.done(function (response) {
    obj_hostel = response;
    returnValue();
  });

  request.fail(function () {
    response = { success: false, message: "Student hostel Error", data: "" };
    obj_hostel = response;

    returnValue();
  });
}

function show_hostel(id, token, returnValue) {
  var settings = {
    url: host + "api_pengurusan_pelajar/public/hostel/show/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
  };

  let request = $.ajax(settings);

  request.done(function (response) {
    obj_hostel = response;
    returnValue();
  });

  request.fail(function () {
    response = { success: false, message: "Student hostel Error", data: "" };
    obj_hostel = response;

    returnValue();
  });
}

function update_hostel(form, token, returnValue) {
  var settings = {
    url: host + "api_pengurusan_pelajar/public/hostel/update",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  let request = $.ajax(settings);
  request.done(function (response) {
    // let obj = JSON.parse(response);
    obj_hostel = JSON.parse(response);

    returnValue();
  });
  request.fail(function () {
    response = { success: false, message: "Student Hostel Error", data: "" };
    obj_hostel = response;

    returnValue();
  });
}

function create_hostel(form, token, returnValue) {
  var settings = {
    url: host + "api_pengurusan_pelajar/public/hostel/create",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  let request = $.ajax(settings);
  request.done(function (response) {
    // let obj = JSON.parse(response);
    obj_hostel = JSON.parse(response);

    returnValue();
  });
  request.fail(function () {
    response = { success: false, message: "Student Hostel Error", data: "" };
    obj_hostel = response;

    returnValue();
  });
}
//mis_std_hostel_end

function misSubject(token, returnValue) {
  var settings = {
    url: host + "api_public_access/public/misSubject/list",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_subject = response;

    returnValue();
  });
}

//mis_std_financial_function
function show_financial(id, token, returnValue) {
  var settings = {
    url: host + "api_pengurusan_pelajar/public/financial/show/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
  };

  let request = $.ajax(settings);

  request.done(function (response) {
    obj_financial = response;
    returnValue();
  });

  request.fail(function () {
    response = {
      success: false,
      message: "Academic financial Error",
      data: "",
    };
    obj_financial = response;

    returnValue();
  });
}

function update_financial(form, token, returnValue) {
  var settings = {
    url: host + "api_pengurusan_pelajar/public/financial/update",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  let request = $.ajax(settings);
  request.done(function (response) {
    // let obj = JSON.parse(response);
    obj_financial = JSON.parse(response);

    returnValue();
  });
  request.fail(function () {
    response = {
      success: false,
      message: "Academic financial Error",
      data: "",
    };
    obj_financial = response;

    returnValue();
  });
}

function create_financial(form, token, returnValue) {
  var settings = {
    url: host + "api_pengurusan_pelajar/public/financial/create",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  let request = $.ajax(settings);
  request.done(function (response) {
    // let obj = JSON.parse(response);
    obj_financial = JSON.parse(response);

    returnValue();
  });
  request.fail(function () {
    response = {
      success: false,
      message: "Academic financial Error",
      data: "",
    };
    obj_financial = response;

    returnValue();
  });
}
//mis_std_financial_end

//mis_std_acaHistory_function
function std_acaHistory(std_sudentid, token, returnValue) {
  var settings = {
    url:
      host +
      "api_pengurusan_pelajar/public/academicHistory/list/" +
      std_sudentid,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_acaHistory = response;
    returnValue();
  });
}

function show_acaHistory(id, token, returnValue) {
  var settings = {
    url: host + "api_pengurusan_pelajar/public/academicHistory/show/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_acaHistory = response;
    returnValue();
  });
}

function update_acaHistory(form, token, returnValue) {
  var settings = {
    url: host + "api_pengurusan_pelajar/public/academicHistory/update",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  let request = $.ajax(settings);
  request.done(function (response) {
    // let obj = JSON.parse(response);
    obj_acaHistory = JSON.parse(response);

    returnValue();
  });
  request.fail(function () {
    response = { success: false, message: "Academic History Error", data: "" };
    obj_acaHistory = response;

    returnValue();
  });
}

function create_acaHistory(form, token, returnValue) {
  var settings = {
    url: host + "api_pengurusan_pelajar/public/academicHistory/create",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  let request = $.ajax(settings);
  request.done(function (response) {
    // let obj = JSON.parse(response);
    obj_acaHistory = JSON.parse(response);

    returnValue();
  });
  request.fail(function () {
    response = { success: false, message: "Academic History Error", data: "" };
    obj_acaHistory = response;

    returnValue();
  });
}
//mis_std_acaHistory_end

//mis_std_curAcademic_function
function std_curAcademic(std_sudentid, semester, token, returnValue) {
  var settings = {
    url:
      host +
      "api_pengurusan_pelajar/public/curAcademic/show/" +
      std_sudentid +
      "/" +
      semester,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_curAcademic = response;
    returnValue();
  });
}

function std_curAcademic_latest(std_sudentid, token, returnValue) {
  var settings = {
    url:
      host +
      "api_pengurusan_pelajar/public/curAcademic/curr_show/" +
      std_sudentid,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_curAcademic = response;
    returnValue();
  });
}

function update_curAcademic(form, token, returnValue) {
  var settings = {
    url: host + "api_pengurusan_pelajar/public/curAcademic/update",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  let request = $.ajax(settings);
  request.done(function (response) {
    // let obj = JSON.parse(response);
    obj_curAcademic = JSON.parse(response);

    returnValue();
  });
  request.fail(function () {
    response = { success: false, message: "Academic Error", data: "" };
    obj_curAcademic = response;

    returnValue();
  });
}

function create_curAcademic(form, token, returnValue) {
  var settings = {
    url: host + "api_pengurusan_pelajar/public/curAcademic/create",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  let request = $.ajax(settings);
  request.done(function (response) {
    // let obj = JSON.parse(response);
    obj_curAcademic = JSON.parse(response);

    returnValue();
  });
  request.fail(function () {
    response = { success: false, message: "Academic Error", data: "" };
    obj_curAcademic = response;

    returnValue();
  });
}
//end mis_std_curAcademic_functiom

//mis_std_academic_function
function std_academic(std_sudentid, token, returnValue) {
  var settings = {
    url: host + "api_pengurusan_pelajar/public/academic/show/" + std_sudentid,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_academic = response;
    returnValue();
  });
}

function update_academic(form, token, returnValue) {
  var settings = {
    url: host + "api_pengurusan_pelajar/public/academic/update",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  let request = $.ajax(settings);
  request.done(function (response) {
    // let obj = JSON.parse(response);
    obj_academic = JSON.parse(response);

    returnValue();
  });
  request.fail(function () {
    response = { success: false, message: "Academic Error", data: "" };
    obj_academic = response;

    returnValue();
  });
}

function create_academic(form, token, returnValue) {
  var settings = {
    url: host + "api_pengurusan_pelajar/public/academic/create",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  let request = $.ajax(settings);
  request.done(function (response) {
    // let obj = JSON.parse(response);
    obj_academic = JSON.parse(response);

    returnValue();
  });
  request.fail(function () {
    response = { success: false, message: "Academic Error", data: "" };
    obj_academic = response;

    returnValue();
  });
}
//end mis_std_academic_function

//mis_std_registration_function
function std_registration(std_sudentid, token, returnValue) {
  var settings = {
    url:
      host + "api_pengurusan_pelajar/public/registration/show/" + std_sudentid,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_registration = response;
    returnValue();
  });
}

function update_registration(form, token, returnValue) {
  var settings = {
    url: host + "api_pengurusan_pelajar/public/registration/update",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  let request = $.ajax(settings);
  request.done(function (response) {
    // let obj = JSON.parse(response);
    obj_registration = JSON.parse(response);

    returnValue();
  });
  request.error(function () {
    response = { success: false, message: "Register Error", data: "" };
    obj_registration = response;

    returnValue();
  });
}

function create_registration(form, token, returnValue) {
  var settings = {
    url: host + "api_pengurusan_pelajar/public/registration/create",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  let request = $.ajax(settings);
  request.done(function (response) {
    // let obj = JSON.parse(response);
    obj_registration = JSON.parse(response);

    returnValue();
  });
  request.error(function () {
    response = { success: false, message: "Register Error", data: "" };
    obj_registration = response;

    returnValue();
  });
}

//end mis_std_registration function

function std_parent(std_sudentid, pgm_id, token, returnValue) {
  var settings = {
    url:
      host +
      "api_pengurusan_pelajar/public/parent/show/" +
      std_sudentid +
      "/" +
      pgm_id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_parent = response;
    returnValue();
  });
}

function update_parent(form, token, returnValue) {
  var settings = {
    url: host + "api_pengurusan_pelajar/public/parent/update",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  let request = $.ajax(settings);
  request.done(function (response) {
    // let obj = JSON.parse(response);
    obj_parent = JSON.parse(response);

    returnValue();
  });
  request.error(function () {
    response = { success: false, message: "Register Error", data: "" };
    obj_parent = response;

    returnValue();
  });
}

function create_parent(form, token, returnValue) {
  var settings = {
    url: host + "api_pengurusan_pelajar/public/parent/create",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  let request = $.ajax(settings);
  request.done(function (response) {
    // let obj = JSON.parse(response);
    obj_parent = JSON.parse(response);

    returnValue();
  });
  request.error(function () {
    response = { success: false, message: "Register Error", data: "" };
    obj_parent = response;

    returnValue();
  });
}

function slctRace(returnValue) {
  let token = window.sessionStorage.token;
  var settings = {
    url: host + "api_public_access/public/raceList",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_race = response;
    returnValue();
  });
}

function slctState(returnValue) {
  let token = window.sessionStorage.token;
  var settings = {
    url: host + "api_public_access/public/negeriList",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_state = response;
    returnValue();
  });
}

function slctDecision(returnValue) {
  let token = window.sessionStorage.token;
  var settings = {
    url: host + "api_public_access/public/decisionList",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_decision = response;
    returnValue();
  });
}

function slctNationality(returnValue) {
  let token = window.sessionStorage.token;
  var settings = {
    url: host + "api_public_access/public/nationalityList",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_nationality = response;
    returnValue();
  });
}

function acaSession(returnValue) {
  let token = window.sessionStorage.token;
  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmCalendar/grpByYear",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_acaSession = response;
    returnValue();
  });
}

function slctGrade(returnValue) {
  let token = window.sessionStorage.token;
  var settings = {
    url: host + "api_public_access/public/gradeList",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_grade = response;
    returnValue();
  });
}

function slctStudyLoan(returnValue) {
  let token = window.sessionStorage.token;
  var settings = {
    url: host + "api_public_access/public/misStudyLoan/list",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_studyLoan = response;
    returnValue();
  });
}

function checkSize() {
  var fileUpload = document.getElementById("sti_image");
  if (typeof fileUpload.files != "undefined") {
    var size = parseFloat(fileUpload.files[0].size / 1024).toFixed(2);
    // alert(size);
    if (size > 20000) {
      $("#checkSize").html(
        "Profile image size must be <strong>smaller than 1000KB</strong>."
      );
      $("#checkSize").prop("class", "text-danger");

      fileUpload.value = "";
      return;
    } else {
      $("#checkSize").html("");
      $("#checkSize").prop("class", "");
    }
  } else {
    alert("This browser does not support HTML5.");
  }
}

function modalNew() {
  $("#new_reg").modal("show");
  // $("#topModalNew").modal("show");
  // $('#tab1').addClass('active');
  // $('#link_tab1').addClass('active');
}

function selectProgramme(selectedInput, param) {
  var selectedValue = selectedInput.value;

  var form = new FormData();

  if (param == "programme") {
    form.append("pgm_id", selectedValue);

    var settings1 = {
      url: host + "api_tetapan_picoms/public/programme/" + selectedValue,
      method: "POST",
      timeout: 0,
      processData: false,
      mimeType: "multipart/form-data",
      contentType: false,
      data: form,
    };

    $.ajax(settings1).done(function (response) {
      result = JSON.parse(response);
      // console.log(result);
      $("#programmeSelected").empty();
      $("#programmeSelected").append(
        $("<option>", {
          value: result.data.pgm_id,
          text: result.data.pgm_name,
        })
      );
      // $.each(result.data, function (i, item) {
      //     $('#programmeSelected').append($('<option>', {
      //         value: item.pgm_id,
      //         text : item.pgm_name
      //     }));
      // });
    });

    let token = window.sessionStorage.token;

    var settings2 = {
      url: host + "api_tetapan_picoms/public/curyear/selected/" + selectedValue,
      method: "POST",
      timeout: 0,
      processData: false,
      headers: {
        Authorization: "PICOMS " + token,
      },
      mimeType: "multipart/form-data",
      contentType: false,
      data: form,
    };

    $.ajax(settings2).done(function (response) {
      result = JSON.parse(response);

      //LIST OPTION CURR YEAR
      $("#sts_cur_year").empty();
      $("#sts_cur_year").append(
        $("<option>", {
          value: "",
          text: "Choose Session",
        })
      );
      $.each(result.data, function (i, item) {
        $("#sts_cur_year").append(
          $("<option>", {
            value: item.cur_year,
            text: item.cur_year,
          })
        );
      });

      //LIST OPTION CURR YEAR UPDATE
      $("#upt_sts_cur_year").empty();
      $("#upt_sts_cur_year").append(
        $("<option>", {
          value: "",
          text: "Choose Session",
        })
      );
      $.each(result.data, function (i, item) {
        $("#upt_sts_cur_year").append(
          $("<option>", {
            value: item.cur_year,
            text: item.cur_year,
          })
        );
      });

      //LIST OPTION CURR INTAKE
      $("#sts_cur_intake").empty();
      $("#sts_cur_intake").append(
        $("<option>", {
          value: "",
          text: "Choose Intake",
        })
      );
      $.each(result.data, function (i, item) {
        $("#sts_cur_intake").append(
          $("<option>", {
            value: item.cur_intake,
            text: item.cur_intake,
          })
        );
      });

      //LIST OPTION CURR INTAKE
      $("#upt_sts_cur_intake").empty();
      $("#upt_sts_cur_intake").append(
        $("<option>", {
          value: "",
          text: "Choose Intake",
        })
      );
      $.each(result.data, function (i, item) {
        $("#upt_sts_cur_intake").append(
          $("<option>", {
            value: item.cur_intake,
            text: item.cur_intake,
          })
        );
      });

      //LIST OPTION CURR SEMESTER
      $("#sts_semester").empty();
      $("#sts_semester").append(
        $("<option>", {
          value: "",
          text: "Choose Semester",
        })
      );
      $.each(result.data, function (i, item) {
        $("#sts_semester").append(
          $("<option>", {
            value: item.cur_semester,
            text: item.cur_semester,
          })
        );
      });

      //LIST OPTION CURR YEAR SEMESTER
      $("#upt_sts_semester").empty();
      $("#upt_sts_semester").append(
        $("<option>", {
          value: "",
          text: "Choose Semester",
        })
      );
      $.each(result.data, function (i, item) {
        $("#upt_sts_semester").append(
          $("<option>", {
            value: item.cur_semester,
            text: item.cur_semester,
          })
        );
      });
    });
  } else if (param == "course") {
    form.append("crs_code", selectedValue);

    let token = window.sessionStorage.token;

    var settings = {
      url: host + "api_tetapan_picoms/public/course/" + selectedValue,
      method: "POST",
      timeout: 0,
      processData: false,
      headers: {
        Authorization: "PICOMS " + token,
      },
      mimeType: "multipart/form-data",
      contentType: false,
      data: form,
    };

    $.ajax(settings).done(function (response) {
      result = JSON.parse(response);
      $("#courseSelected").empty();
      $.each(result.data, function (i, item) {
        $("#courseSelected").append(
          $("<option>", {
            value: item.crs_code,
            text: item.crs_name,
          })
        );
      });

      $("#upt_courseSelected").empty();
      $.each(result.data, function (i, item) {
        $("#upt_courseSelected").append(
          $("<option>", {
            value: item.crs_code,
            text: item.crs_name,
          })
        );
      });
    });
  }
}

function loadData(indexs) {
  let data = JSON.parse($("#dataList").val());
  // console.log(data[indexs].std_studentid);



  // alert(data[indexs].std_studentid);
  $("#code_indexs").val(indexs);
  // alert('nana');
  //DEFAULT PROFILE
  let profile_pic = data[indexs].sti_image;

  if (profile_pic == "") {
    $("#upt_sti_image_img").addClass("hidden");
    $("#nopic").removeClass("hidden");
    $("#upt_sti_image").removeClass("hidden");
    $("#upt_sti_image_del_btn").addClass("hidden");
  } else {
    $("#upt_sti_image").addClass("hidden");
    $("#nopic").addClass("hidden");
    $("#upt_sti_image_img").removeClass("hidden");
    $("#upt_sti_image_del_btn").removeClass("hidden");
    $("#upt_sti_image_img").attr("src", "data:image/jpg;base64," + profile_pic);
  }

  let token = window.sessionStorage.token;
  showFaculty(data[indexs].fac_id, token, function () {
    if (objFaculty.success) {
      let objData = objFaculty.data;
      $("#fac_name").val(objData.fac_name);
    }
  });

  // select session
  let pgm_fk = data[indexs].pgm_fk;
  let cur_intake = data[indexs].cur_intake;
  let intake = cur_intake.split('-');
  let formS = new FormData();

  formS.append('pgm_fk', pgm_fk);
  formS.append('intake_name', intake[0]);
  formS.append('intake_year', intake[1]);

  let obj_kalendar = new post(host + "api_tetapan_picoms/public/misPrmCOTSem/pgmDetSession", formS, 'picoms ' + window.sessionStorage.token).execute();
  $('#session_cur').html('<option value="">- Choose Session -</option>');
  let names = "";
  $.each(obj_kalendar.data, function (i, item) {
    let curyear = item.cur_year.replace('/', '');
    select = "";

    if (names != curyear + '/' + item.cal_cohort) {
      names = curyear + '/' + item.cal_cohort;
      $('#session_cur').append('<option value="' + item.cal_id + '" calSem="' + item.cal_cohort + '" curYear="' + item.cur_year + '">' + curyear + '/' + item.cal_cohort + '</option>');
    }
  });



  $("#matric_no").val(data[indexs].std_studentid);


  $("#sti_name_upt").val(data[indexs].sti_name);
  $("#sti_icno_upt").val(data[indexs].sti_icno);
  $("#pgm_id_upt").val(data[indexs].pgm_id);
  $("#pgm_fk").val(data[indexs].pgm_fk);
  $("#sti_session_upt").val(data[indexs].sti_session_id);
  $("#sti_intake_upt").val(data[indexs].cur_intake);
  $("#sti_gender").val(data[indexs].sti_gender);
  $("#sti_nationality_upt").val(data[indexs].sti_nationality);
  $("#sti_race").val(data[indexs].sti_race);
  $("#upt_sti_status_bumiputra").val(data[indexs].sti_status_bumiputra);
  $("#sti_religion_upt").val(data[indexs].sti_religion);
  $("#sti_status_oku_upt").val(data[indexs].sti_status_oku);
  $("#sti_blood_type_upt").val(data[indexs].sti_blood_type);
  $("#sti_email_upt").val(data[indexs].sti_email);
  $("#sti_address").val(data[indexs].sti_address_1);
  $("#sti_postcode").val(data[indexs].sti_postcode);
  $("#sts_status").val(data[indexs].sts_status_id);

  $("#sti_state").val(data[indexs].sti_state);
  $("#sti_contactno_home").val(data[indexs].sti_contactno_home);
  $("#sti_contactno_mobile").val(data[indexs].sti_contactno_mobile);
  $("#sti_bank_id").val(data[indexs].sti_bank_id);
  $("#sti_bank_accountno").val(data[indexs].sti_bank_accountno);
  $("#marital_status").val(data[indexs].marital_status);
  $("#duration_std").val(data[indexs].duration_std);
  $("#sts_status").val(data[indexs].status_academic);
  $("#remark").val(data[indexs].remark);
  $("#staff_alumi").val(data[indexs].staff_alumi);
  $("#sti_sponsorship").val(data[indexs].sti_sponsorship);
  $("#sti_baitulmal").val(data[indexs].sti_baitulmal);
  $("#sti_asnaf").val(data[indexs].sti_asnaf);

  // semester list for tab
  let sti_session_id = data[indexs].sti_session_id;


  let sts_status = data[indexs].sts_status_id;
  if (sts_status == "10") {
    $("#row_deffered").prop('class', 'form-group row');
    $("#session_deffered").prop('required', true);


    $("#row_wd").prop('class', 'form-group row hidden');
    $("#acaCal_weeks").prop('required', false);
  }
  // else if (sts_status == "7") {
  else if (sts_status == "7" || sts_status == "11" || sts_status == "12" || sts_status == "13" || sts_status == "14") {

    $("#row_wd").prop('class', 'form-group row');
    $("#acaCal_weeks").prop('required', true);

    $("#row_deffered").prop('class', 'form-group row hidden');
    $("#session_deffered").prop('required', false);
  }

  else {
    $("#row_deffered").prop('class', 'form-group row hidden');
    $("#session_deffered").prop('required', false);

    $("#row_wd").prop('class', 'form-group row hidden');
    $("#acaCal_weeks").prop('required', false);
  }

  if (data[indexs].sts_status_id = (7 || 10 || 11 || 12 || 13 || 14)) {

    let objChkCur = new get(host + `api_pengurusan_pelajar/public/curAcademic/student/session/checkingSts/` + data[indexs].std_studentid + `/` + data[indexs].sts_status_id, `picoms ` + window.sessionStorage.token).execute();

    if (objChkCur.success) {
      // console.log(objChkCur.data[0].acaCal_weeks);
      // alert('sini');  
      $("#acaCal_weeks").val(objChkCur.data[0].acaCal_weeks);

    }
  }


  std_parent(
    data[indexs].std_studentid,
    data[indexs].pgm_fk,
    token,
    function () {
      if (obj_parent.success) {
        let obj = obj_parent.data;
        $("#par_father_ic").val(obj.par_father_icno);
        $("#par_father_title").val(obj.par_father_title);
        $("#par_father_name").val(obj.par_father_name);
        $("#par_father_contactno").val(obj.par_father_contactno);
        $("#par_father_relationship").val(obj.par_father_relationship);
        $("#par_father_nationality").val(obj.par_father_nationality);
        $("#par_father_address").val(obj.par_father_address);

        $("#par_mother_ic").val(obj.par_mother_icno);
        $("#par_mother_title").val(obj.par_mother_title);
        $("#par_mother_contactno").val(obj.par_mother_contactno);
        $("#par_mother_relationship").val(obj.par_mother_relationship);
        $("#par_mother_nationality").val(obj.par_mother_nationality);
        $("#par_mother_address").val(obj.par_mother_address);
        $("#par_mother_name").val(obj.par_mother_name);
      } else {
        $("#form_std_parent")[0].reset();
      }
    }
  );

  std_registration(data[indexs].std_studentid, token, function () {
    if (obj_registration.success) {
      let data = obj_registration.data;
      $("#srg_payment_via").val(data.srg_payment_via);
      $("#srg_payment_resit").val(data.srg_payment_resit);
      $("#srg_introducer").val(data.srg_introducer_name);

      if (data.srg_offer_letter != "") {
        $("#link_offer_letter").prop(
          "href",
          host +
          "api_pengurusan_pelajar/public/academic/" +
          data.srg_offer_letter
        );
        $("#link_offer_letter").prop("class", "label success m-b");
      }

      if (data.srg_father_ic != "") {
        $("#link_father_ic").prop(
          "href",
          host + "api_pengurusan_pelajar/public/academic/" + data.srg_father_ic
        );
        $("#link_father_ic").prop("class", "label success m-b");
      }

      if (data.srg_birth_cert != "") {
        $("#link_birth_cert").prop(
          "href",
          host + "api_pengurusan_pelajar/public/academic/" + data.srg_birth_cert
        );
        $("#link_birth_cert").prop("class", "label success m-b");
      }

      if (data.srg_ic_pict != "") {
        $("#link_ic_pict").prop(
          "href",
          host + "api_pengurusan_pelajar/public/academic/" + data.srg_ic_pict
        );
        $("#link_ic_pict").prop("class", "label success m-b");
      }

      if (data.srg_mother_ic != "") {
        $("#link_mother_ic").prop(
          "href",
          host + "api_pengurusan_pelajar/public/academic/" + data.srg_mother_ic
        );
        $("#link_mother_ic").prop("class", "label success m-b");
      }

      if (data.srg_accept_letter != "") {
        $("#link_accept_letter").prop(
          "href",
          host +
          "api_pengurusan_pelajar/public/academic/" +
          data.srg_accept_letter
        );
        $("#link_accept_letter").prop("class", "label success m-b");
      }

      if (data.srg_payment_resitdoc != "") {
        $("#link_payment_resitdoc").prop(
          "href",
          host +
          "api_pengurusan_pelajar/public/academic/" +
          data.srg_payment_resitdoc
        );
        $("#link_payment_resitdoc").prop("class", "label success m-b");
      }

      if (data.srg_spm_doc != "") {
        $("#link_spm_doc").prop(
          "href",
          host + "api_pengurusan_pelajar/public/academic/" + data.srg_spm_doc
        );
        $("#link_spm_doc").prop("class", "label success m-b");
      }
    } else {
      $("#link_offer_letter").removeAttr("href");
      $("#link_offer_letter").prop("class", "label red-300 disabled m-b");

      $("#link_father_ic").removeAttr("href");
      $("#link_father_ic").prop("class", "label red-300 disabled m-b");

      $("#link_birth_cert").removeAttr("href");
      $("#link_birth_cert").prop("class", "label red-300 disabled m-b");

      $("#link_ic_pict").removeAttr("href");
      $("#link_ic_pict").prop("class", "label red-300 disabled m-b");

      $("#link_mother_ic").removeAttr("href");
      $("#link_mother_ic").prop("class", "label red-300 disabled m-b");

      $("#link_accept_letter").removeAttr("href");
      $("#link_accept_letter").prop("class", "label red-300 disabled m-b");

      $("#link_payment_resitdoc").removeAttr("href");
      $("#link_payment_resitdoc").prop("class", "label red-300 disabled m-b");

      $("#link_spm_doc").removeAttr("href");
      $("#link_spm_doc").prop("class", "label red-300 disabled m-b");
      $("#form_std_registration")[0].reset();
    }
  });

  std_academic(data[indexs].std_studentid, token, function () {
    if (obj_academic.success) {
      let data = obj_academic.data;
      $("form#form_std_academic :input").each(function () {
        names = $(this).attr("id");
        values = data[names];
        if (names != "sta_spm_doc") {
          // $('#'+names).val(values).trigger('change');
          $("#" + names).val(values);
        }
      });

      if (data.sta_spm_doc != "") {
        $("#link_cert_doc").prop(
          "href",
          host + "api_pengurusan_pelajar/public/academic/" + data.sta_spm_doc
        );
        $("#link_cert_doc").prop("class", "label success m-b");
      }
    } else {
      $("#link_cert_doc").removeAttr("href");
      $("#link_cert_doc").prop("class", "label red-300 disabled m-b");
      $("#form_std_academic")[0].reset();
    }
  });

  // std_curAcademic_latest(data[indexs].std_studentid, token, function () {
  //   if (obj_curAcademic.success) {
  //     let data = obj_curAcademic.data;
  //     $("#std_semester").val(data.std_semester);
  //     $("#session_cur").val(data.fk_acaCal);
  //     $("#std_admission").val(data.std_admission);
  //     $("#std_completion").val(data.std_completion);
  //     $("#std_senate_endorsement").val(data.std_senate_endorsement);
  //     $("#std_mentor").val(data.std_mentor);
  //     $("#std_remarks").val(data.std_remarks);
  //     $("#std_gpa").val(data.std_gpa);
  //     $("#std_cgpa").val(data.std_cgpa);
  //     $("#std_cect").val(data.std_cect);
  //     $("#std_total_cect").val(data.std_total_cect);
  //     $("#std_total_credit").val(data.std_total_credit);
  //     $("#std_total_hour").val(data.std_total_hour);

  //     if (data.std_warning_letter1 != "") {
  //       $("#link_warning_letter1").prop(
  //         "href",
  //         host +
  //           "api_pengurusan_pelajar/public/academic_cur/" +
  //           data.std_warning_letter1
  //       );
  //       $("#link_warning_letter1").prop("class", "label success m-b");
  //     } else {
  //       $("#link_warning_letter1").removeAttr("href");
  //       $("#link_warning_letter1").prop("class", "label red-300 disabled m-b");
  //     }

  //     if (data.std_warning_letter2 != "") {
  //       $("#link_warning_letter2").prop(
  //         "href",
  //         host +
  //           "api_pengurusan_pelajar/public/academic_cur/" +
  //           data.std_warning_letter2
  //       );
  //       $("#link_warning_letter2").prop("class", "label success m-b");
  //     } else {
  //       $("#link_warning_letter2").removeAttr("href");
  //       $("#link_warning_letter2").prop("class", "label red-300 disabled m-b");
  //     }

  //     if (data.std_warning_letter3 != "") {
  //       $("#link_warning_letter3").prop(
  //         "href",
  //         host +
  //           "api_pengurusan_pelajar/public/academic_cur/" +
  //           data.std_warning_letter3
  //       );
  //       $("#link_warning_letter3").prop("class", "label success m-b");
  //     } else {
  //       $("#link_warning_letter3").removeAttr("href");
  //       $("#link_warning_letter3").prop("class", "label red-300 disabled m-b");
  //     }
  //   } else {
  //     $("#link_warning_letter1").removeAttr("href");
  //     $("#link_warning_letter1").prop("class", "label red-300 disabled m-b");

  //     $("#link_warning_letter2").removeAttr("href");
  //     $("#link_warning_letter2").prop("class", "label red-300 disabled m-b");

  //     $("#link_warning_letter3").removeAttr("href");
  //     $("#link_warning_letter3").prop("class", "label red-300 disabled m-b");

  //     $("#form_std_curAcademic")[0].reset();
  //   }
  // });

  std_acaHistory(data[indexs].std_studentid, token, function () {
    $("#form_std_acaHistory")[0].reset();
    $("#acaHistoryList").html("");
    $("#status_form").html("Mode Create Form");
    $("#status_form").prop("class", "green-200 p-l");
    $("#std_eduLevel").val("").trigger("change");

    if (obj_acaHistory.success) {
      let data = obj_acaHistory.data;
      var columns = [
        {
          name: "std_alumni",
          title: "Alumi/Staff",
          breakpoints: "lg md sm xs",
        },
        { name: "std_muet", title: "Muet.", breakpoints: "lg md sm xs" },
        { name: "std_eduLevel", title: "Level" },
        { name: "std_preUniversity", title: "University" },
        { name: "std_status", title: "Status", breakpoints: "md sm xs" },
        { name: "std_year", title: "Years", breakpoints: "lg md sm xs" },
        { name: "std_cgpa", title: "CGPA", breakpoints: "lg md sm xs" },
        {
          name: "std_transcript",
          title: "Transcript",
          breakpoints: "lg md sm xs",
        },
        { name: "upt_btn", title: "Action" },
      ];
      let list = [];
      $.each(data, function (i, field) {
        list.push({
          std_alumni: field.std_alumni,
          std_muet: field.std_muet,
          std_eduLevel: field.level,
          std_preUniversity: field.std_preUniversity,
          std_status: field.sts_status_name_en,
          std_year: field.std_year,
          std_cgpa: field.std_cgpa,
          std_transcript:
            '<a class="label success" href="' +
            host +
            "api_pengurusan_pelajar/public/academic_cur/" +
            field.std_transcript +
            '" m-b" target="_blank">Document</a>',
          upt_btn:
            "<a onclick=\"load_acaHistory('" +
            field.pk_id +
            '\')" class="btn btn-icon btn-info"><i class="fa fa-bars"></i></a>',
        });
      });
      $("#acaHistoryList").footable({
        columns: columns,
        rows: list,
        paging: {
          enabled: true,
          size: 10,
        },
        filtering: {
          enabled: true,
          placeholder: "Search...",
          dropdownTitle: "Search for:",
        },
      });
    }
  });

  show_financial(data[indexs].std_studentid, token, function () {
    if (obj_financial.success) {
      let data = obj_financial.data;
      $("form#form_std_financial :input").each(function () {
        names = $(this).attr("name");
        types = $(this).attr("type");
        let id_form = "#" + $(this).attr("id");
        if (types == "checkbox") {
          $(id_form).prop("checked", false);
          if (data[names] != "") {
            $(id_form).prop("checked", true);
          }
        } else {
          $(id_form).val(data[names]);
        }
      });
    } else {
      $("#form_std_financial")[0].reset();
    }
  });

  list_hostel(data[indexs].std_studentid, token, function () {
    $("#table_list_hostel").html("");
    if (obj_hostel.success) {
      let data = obj_hostel.data;
      var columns = [
        { name: "hstl_occupyStatus", title: "Hostel Occupy" },
        { name: "hstl_semester", title: "Semester.", breakpoints: " sm xs" },
        { name: "hstl_existence", title: "Level", breakpoints: " sm xs" },
        { name: "hstl_name", title: "Hostel Name" },
        { name: "hstl_unit", title: "Unit", breakpoints: " sm xs" },
        { name: "upt_btn", title: "Action" },
      ];
      let list = [];
      $.each(data, function (i, field) {
        list.push({
          hstl_occupyStatus: field.hstl_occupyStatus,
          hstl_semester: field.hstl_semester,
          hstl_existence: field.hstl_existence,
          hstl_name: field.hstl_name,
          hstl_unit: field.hstl_unit,
          upt_btn:
            "<a onclick=\"load_std_hostel('" +
            field.pk_id +
            '\')" class="btn btn-icon btn-info"><i class="fa fa-bars"></i></a>',
        });
      });
      $("#table_list_hostel").footable({
        columns: columns,
        rows: list,
        paging: {
          enabled: true,
          size: 10,
        },
        filtering: {
          enabled: true,
          placeholder: "Search...",
          dropdownTitle: "Search for:",
        },
      });
    }
  });

  let student_id = data[indexs].std_studentid;
  // console.log(data[indexs]);
  let stud_name = data[indexs].sti_name;
  let stud_icno = data[indexs].sti_icno;
  let stud_cur_intake = data[indexs].cur_intake;
  let stud_pgm_name = data[indexs].pgm_name;
  var listRow = [];
  var listCreditCumm = [];

  $('#session_select').html('<option value="">- Choose Session -</option>');
  $('#session_deffered').html('<option value="">- Choose Session -</option>');
  // check current semester student
  chkStdCurSem(student_id, function () {
    $("#divListSem").html("");
    let rsb_typeList = ['CT', 'CE'];
    let formAttend = new FormData();
    formAttend.append('std_studentid', student_id);
    // formAttend.append('std_studentid', student_id);

    let obj_attendance = new post(host + 'api_exam_picoms/public/misExamStd/stdAttendance', formAttend, 'picoms ' + window.sessionStorage.token).execute();

    let dataAttendance = [];
    if (obj_attendance.success) {
      dataAttendance = obj_attendance.data;
    }

    $.each(obj_stdCurSem.data, function (i, item) {

      let gpa = item.std_gpa;
      let cgpa = item.std_cgpa;
      let curAcademic_type = `<label class="label success">Active</label>`;
      let button_active = '';
      if (item.curAcademic_type != "") {
        // console.log(item);
        if (item.curAcademic_type == "Deferred") { color = "secondary" }
        if (["With-draw", "Missing In Action", "Passed Away", "Terminated", "Change Programme"].includes(item.curAcademic_type)) { color = "danger" }
        curAcademic_type = `<label class="label ` + color + `">` + item.curAcademic_type + `- ( Week ` + item.acaCal_weeks + `)</label>`;
        button_active = `<a href="javascript:void(0);" onclick="active_back(` + item.pk_cur_academic + `)" class="btn btn-sm btn-outline-success rounded pull-right"><i class="fa fa-arrow-left"></i> actived</a>`;
      }

      if (gpa == null) {
        gpa = "";
      }

      if (cgpa == null) {
        cgpa = "";
      }

      let curyear = item.cur_year.replace('/', '');

      $('#session_select').append('<option value="' + item.fk_acaCal + '" std_semester="' + item.std_semester + '" calSem="' + item.cal_cohort + '" curYear="' + item.cur_year + '" >' + curyear + '/' + item.cal_cohort + '</option>');
      // $('#session_deffered').append('<option value="'+item.fk_acaCal+'" std_semester="'+item.std_semester+'" calSem="'+item.cal_cohort+'" curYear="'+item.cur_year+'" >'+curyear+'/'+item.cal_cohort+'</option>');  
      $('#session_deffered').append('<option value="' + item.fk_acaCal + '" std_semester="' + item.std_semester + '" calSem="' + item.cal_cohort + '" curYear="' + item.cur_year + '" >' + curyear + '/' + item.cal_cohort + '</option>');

      let boxList =
        '<li class="nav-item active" id="navLectData">' +
        '<a href="#" class="nav-link auto info">' +
        '<span class="pull-right text-muted m-r-xs">' +
        '<i class="fa fa-plus inline"></i>' +
        '<i class="fa fa-minus none"></i>' +
        "</span>" +
        "" +
        item.cur_year.replace("/", "") +
        "/" +
        item.cal_cohort +
        "</a>" +
        '<ul class="nav nav-sub text-sm">' +
        '<div class="row m-a-2">' +
        '<textarea class="hidden" id="dataList_' +
        item.fk_acaCal +
        '"></textarea><p>' +
        curAcademic_type + button_active + '</p>' +
        '<table id="crList_' + item.fk_acaCal + '" class="table table-striped"></table>' +
        `<table class="table">
      
          <td colspan="2">Semester : <b>`+ item.std_semester + `</b></td>
          <td class="text-right">Credit Earned : <b id="creditEarn_`+ item.fk_acaCal + `" > 0 </b><br>Cumulative Credit : <b id="cumCredit_` + item.fk_acaCal + `" ></b></td>

          <td class="text-right">GPA : <b>`+ gpa + `</b><br>CGPA : <b>` + cgpa + `</b></td></tr>
        </table>`+
        "</div>" +
        "</ul>" +
        "</li>";

      $("#divListSem").append(boxList);

      // list Course register AzizZ will change

      listByActPolicy(student_id, item.fk_acaCal, item.cur_year, item.cal_cohort, function () {
        var columns = [
          { name: "bil", title: "No." },
          { name: "btn", title: "" },
          { name: "crs_code", title: "Course Code" },
          { name: "rsb_type", title: "Type", breakpoints: "md sm xs" },
          { name: "credit", title: "Credit", breakpoints: "md sm xs" },
          { name: "cMark", title: "Carry Mark" },
          { name: "tMark", title: "Total Mark" },
          { name: "grade", title: "Grade" },
          { name: "point", title: "Point" },

        ];

        let bil = 1;
        let tCredit = 0;
        var list = [];


        let convertList = JSON.stringify(obj_regCrs.data);
        $("#dataList_" + item.fk_acaCal).val(convertList);

        listRow.push({ fk_acaCal: item.fk_acaCal, student_id: student_id, data: obj_regCrs.data });
        var admin = window.sessionStorage.usrCatEadmin;
        // console.log(obj_regCrs.data);
        obj_regCrs.data.forEach(async (itemJ, j) => {


          tCredit += itemJ.crs_credit;

          let btnDis = "";
          let attend = "";
          let info = "";
          
          if (itemJ.ip == "checked") {
            info = `<br> <span class="label warning">In Progress</span>`;
          }
          else if (itemJ.mrf == "checked") {
            info = ` <span class="label warning">MRAF</span>`;
          }

          if (itemJ.grade == "" && info == "") {

             
            btnDis = `<button ${StudentDelDisabled} onclick="drop('` + itemJ.rsb_id + `')" class="btn btn-icon btn-link text-danger"><i class="fa fa-minus-circle"></i></button>`;

            // if (admin === "1" || admin === 1) {
            //   btnDis = `<button onclick="drop('` + itemJ.rsb_id + `')" class="btn btn-icon btn-link text-danger"><i class="fa fa-minus-circle"></i></button>`;
            // } else {
            //   btnDis = `<button onclick="drop('` + itemJ.rsb_id + `')" class="btn btn-icon btn-link text-danger" disabled><i class="fa fa-minus-circle"></i></button>`;
            // }

          }
          else {
            let yearTaken = item.cur_year;
            let cal_cohort = item.cal_cohort;
            if (yearTaken.replace('/', '') >= "20222023") {
              if (cal_cohort < "3" && yearTaken.replace('/', '') == "20222023") {

              }
              else {
                attend = `<br><span class="label red">Not Attend</span>`; // nie coding lama jgn buang bawah je nie tmbahan

                if (itemJ.rsb_status === 'CECT') {
                attend = ``; 
                  
                } else {
          let final_examDisplay = "";
                  
                //afiez tmbah sni 26april utk sbject no final exam
                let objLectChecked = new get(host + 'api_lecturer_picoms/public/misLectCrsPrm/chkFinalExam/' + itemJ.fk_cotDet, 'picoms ' + token).execute();

                if (objLectChecked.success) {
                  data_objLectChecked = objLectChecked.data;

                  final_examDisplay = data_objLectChecked.final_exam;

                }
                if (final_examDisplay != 'checked') {
                  attend = `<br><span class="label blue">No Final Exam</span>`;

                }
                //end afiez tmbah sni 26april utk sbject no final exam


                if (rsb_typeList.indexOf(itemJ.rsb_type) != -1) {
                  attend = "";
                }

                let filterAttendance = {
                  // itemJ.rsb_id
                  fk_stdRegCrs: itemJ.rsb_id,
                  // fk_course: itemJ.fk_course,
                };
                // console.log(dataAttendance);

                let stdAttend = filterData(dataAttendance, filterAttendance);
                if (stdAttend.length > 0) {
                  if (stdAttend[0].attendance == "Attend") {
                    attend = `<br><span class="label green">Attend</span>`;
                  }
                }
                else if (itemJ.grade != "F") {
                  attend = "";
                }
                }
              
              }
            }
          }

          let tMark = (itemJ.tMark) * 1;

          // console.log(itemJ);
          gradeStdFinalCheck = (itemJ.counted_cgpa === "Yes" ) ? itemJ.grade : (((tMark.toFixed(0)) >= 50) ? 'PASS' : 'Fail');
          pointStdFinalCheck = (itemJ.counted_cgpa === "Yes" ) ? itemJ.point : '';

          

          list.push({
            bil: bil++,
            crs_code:
              '<span class="text-uppercase">' +
              itemJ.crsCode +
              " - " +
              itemJ.crs_name +
              "</span>",
            rsb_type: itemJ.rsb_type,
            credit: itemJ.crs_credit,
            cMark: itemJ.cMark,
            tMark: `<p class="text-center">` + tMark.toFixed(0) + attend + `</p>`,
            grade:`<p class="text-center"> ${ gradeStdFinalCheck + info}</p>`,
            // grade: itemJ.grade + info,
            point: pointStdFinalCheck,
            // point: itemJ.point,
            btn: btnDis,
          });
        });

        $('#creditEarn_' + item.fk_acaCal).html(tCredit);
        // $('#cumCredit_'+item.fk_acaCal).html(afiez);
        listCreditCumm.push(
          {
            semCurrStdAcacal: item.fk_acaCal,
            CreditStd: tCredit
          }
        )

        listCreditCumm.sort((a, b) => a.semCurrStdAcacal - b.semCurrStdAcacal);
        tCummulativeDepan = 0;

        // Calculate the cumulative credits
        listCreditCumm.forEach(item => {
          tCummulativeDepan += item.CreditStd;
          item.creditCummative = tCummulativeDepan;
        });

        $("#crList_" + item.fk_acaCal).footable({
          columns: columns,
          rows: list,
          paging: {
            enabled: true,
            size: 10,
            countFormat: "Showing {PF} to {PL} of {TR} data",
          },
          filtering: {
            enabled: false,
            placeholder: "Search...",
            dropdownTitle: "Search for:",
          },
        });


        listCreditCumm.forEach(item => {
          $('#cumCredit_' + item.semCurrStdAcacal).html(item.creditCummative);
        });
      });




      // list Course register AzizZ will change
      listByActPolicyCE(student_id, function () {
        var columns = [
          // { name: "bil", title: "No." },
          // { name: "btn", title: ""},
          { name: "crs_code", title: "Course Code" },
          { name: "rsb_type", title: "Type", breakpoints: "md sm xs" },
          { name: "creditSbject", title: "Credit", breakpoints: "md sm xs" },
          // { name: "credit", title: "Credit", breakpoints: "md sm xs" },
          // { name: "cMark", title: "Carry Mark" },
          { name: "grade", title: "Grade" },
          // { name: "point", title: "Point" },

        ];

        let bil = 1;
        var list = [];
        let convertList = JSON.stringify(obj_regCrsCE.data);
        $("#dataList_" + item.fk_acaCal).val(convertList);

        listRow.push({ fk_acaCal: item.fk_acaCal, student_id: student_id, data: obj_regCrsCE.data });
        var admin = window.sessionStorage.usrCatEadmin;


        tCreditCE = 0;

        $.each(obj_regCrsCE.data, function (j, itemJ) {
          // console.log(obj_regCrsCE.data);

          let btnDis = "";

          if (itemJ.grade == "") {
             
            btnDis = `<button ${StudentDelDisabled} onclick="drop('` + itemJ.rsb_id + `')" class="btn btn-icon btn-link text-danger"><i class="fa fa-minus-circle"></i></button>`;

            // if (admin === "1" || admin === 1) {
            //   btnDis = `<button onclick="drop('` + itemJ.rsb_id + `')" class="btn btn-icon btn-link text-danger"><i class="fa fa-minus-circle"></i></button>`;
            // } else {
            //   btnDis = `<button onclick="drop('` + itemJ.rsb_id + `')" class="btn btn-icon btn-link text-danger" disabled><i class="fa fa-minus-circle"></i></button>`;
            // }

          }

          tCreditCE += (itemJ.crs_credit * 1);
          list.push({
            // bil: bil++,
            crs_code:
              '<span class="text-uppercase">' +
              itemJ.crsCode +
              " - " +
              itemJ.crs_name +
              "</span>",
            rsb_type: itemJ.rsb_type,
            creditSbject: itemJ.crs_credit,
            // cMark: itemJ.cMark,
            grade: itemJ.grade,
            // point: itemJ.point,
            // btn: btnDis,
          });
        });

        $("#listCE").html('');
        $("#listCE").footable({
          columns: columns,
          rows: list,
          paging: {
            enabled: true,
            size: 10,
            countFormat: "Showing {PF} to {PL} of {TR} data",
          },
          filtering: {
            enabled: false,
            placeholder: "Search...",
            dropdownTitle: "Search for:",
          },
        });
        // console.log(tCreditCE);
        $('#tCreditCE').html(`Total Credit: ` + tCreditCE);
      });
    });
  });

  let studentTrascript = data[indexs].std_studentid;
  $('#buttonTranscript').html(`<button class="btn btn-outline-danger" onclick="viewTranscript('` + studentTrascript + `')"> <i class="fa fa-file-pdf-o"></i> Academic Transcript</button>`);
  $('#ATstudname').html(data[indexs].sti_name);

  if (data[indexs].sti_gender == 'P') {
    $('#ATgender').html('FEMALE');
  }
  else if (data[indexs].sti_gender == 'L') {
    $('#ATgender').html('MALE');
  }
  else {
    $('#ATgender').html('');
  }



  if (data[indexs].sti_nationality == 2) {
    $('#ATnationality').html('MALAYSIAN');
  }
  else {
    $('#ATnationality').html('NON-MALAYSIAN');
  }
  $('#ATic').html(data[indexs].sti_icno);

  $('#ATstudID').html(data[indexs].std_studentid);
  $('#ATProgram').html(data[indexs].pgm_name);
  let studIntake = data[indexs].cur_intake;
  let yearStart = studIntake.split("-")[1];
  $('#ATyearStart').html(yearStart);
  $("#ATstatusAcademic").html(data[indexs].status_academic);

  // 8 = graduated

  chkStdCurSem2(student_id, function () {
    $("#divListSemAR").html("");
    let rsb_typeList = ['CT', 'CE'];
    let formAttend = new FormData();
    formAttend.append('std_studentid', student_id);

    let obj_attendance = new post(host + 'api_exam_picoms/public/misExamStd/stdAttendance', formAttend, 'picoms ' + window.sessionStorage.token).execute();

    let dataAttendance = [];
    if (obj_attendance.success) {
      dataAttendance = obj_attendance.data;
    }

    let btn_disabled = 'disabled';
    $('#tabListSemAR').html('');


    $.each(obj_stdCurSem.data, function (i, item) {

      if (item.std_senate_endorsement != null && item.std_release == "checked") {
        btn_disabled = '';
      }
      else {
        // btn_disabled = '';
      }
      let gpa = item.std_gpa;
      let cgpa = item.std_cgpa;
      let curAcademic_type = `<label class="label success">Active</label>`;
      let button_active = '';
      let color = ""; // Initialize color variable
      if (item.curAcademic_type != "") {
        // console.log(item);
        if (item.curAcademic_type == "Deferred") { color = "secondary" }
        if (item.curAcademic_type == "With-draw") { color = "danger" }
        curAcademic_type = `<label class="label ` + color + `">` + item.curAcademic_type + `- ( ` + item.acaCal_weeks + ` week )</label>`;
        button_active = `<a href="javascript:void(0);" onclick="active_back(` + item.pk_cur_academic + `)" class="btn btn-sm btn-outline-success rounded pull-right"><i class="fa fa-arrow-left"></i> actived</a>`;
      }

      if (gpa == null) {
        gpa = "";
      }

      if (cgpa == null) {
        cgpa = "";
      }

      let curyear = item.cur_year.replace('/', '');

      $('#session_select').append('<option value="' + item.fk_acaCal + '" std_semester="' + item.std_semester + '" calSem="' + item.cal_cohort + '" curYear="' + item.cur_year + '" >' + curyear + '/' + item.cal_cohort + '</option>');
      $('#session_deffered').append('<option value="' + item.fk_acaCal + '" std_semester="' + item.std_semester + '" calSem="' + item.cal_cohort + '" curYear="' + item.cur_year + '" >' + curyear + '/' + item.cal_cohort + '</option>');
      // $('#tabListSemAR').append('<li class="nav-item"><a class="green-tab nav-link" href="#tab_' + i + '" data-toggle="tab">' + curyear + '/' + item.cal_cohort + '</a></li>');
      $('#tabListSemAR').append('<li class="nav-item"><a class="green-tab nav-link" href="#tab_' + i + '" data-toggle="tab" style="font-size: 16px;">' + curyear + '/' + item.cal_cohort + '</a></li>');


      let boxList =
        '<div class="tab-pane fade" id="tab_' + i + '">' +
        '<ul class="nav nav-sub text-sm">' +
        '<div class="row m-a-2">' +
        '<textarea class="hidden" id="dataList_' +
        item.fk_acaCal + '"></textarea>' +
        `<table class="table">
          <tr>
          `+
        '<td>' + curAcademic_type + button_active + '</td>' +

        `<td class="text-right">Semester : <b>` + item.std_semester + `</b></td>
          </tr>
          <tr>
          <td>
          <div class="col-md-12 m-b-2 text-center">
          <button class="btn btn-fw" style="background-color: #D9D9D9; color: black;" onclick="viewStudent('` + student_id + `','` + stud_name + `','` + item.fk_acaCal + `','` + item.cur_year + `','` + item.cal_cohort + `')" ` + (item.cal_status !== 'Active' ? ' disabled' : '') + `>Timetable</button>
            
          <button class="btn btn-fw" style="background-color: #D9D9D9; color: black;" onclick="viewExamSlip('` + student_id + `','` + stud_name + `','` + item.fk_acaCal + `','` + item.cur_year + `','` + item.cal_cohort + `','` + stud_icno + `','` + stud_cur_intake + `','` + stud_pgm_name + `')">Examination Slip</button>
          <button class="btn btn-fw" style="background-color: #D9D9D9; color: black;" onclick="viewStudentResult('` + student_id + `','` + stud_name + `','` + item.fk_acaCal + `','` + item.cur_year + `','` + item.cal_cohort + `','` + item.std_semester + `')"  ` + btn_disabled + `  >Result Slip</button>
          `+
        `<button class="btn btn-fw" data-toggle="modal" data-target="#bottom"  onclick="listCTEBySession('${student_id}',${item.fk_acaCal}, '${item.cur_year.replace('/', '')}/${item.cal_cohort}')" style="background-color: #D9D9D9; color: black;">Course Teaching Evaluation</button>`
        // <button class="btn btn-fw" style="background-color: #D9D9D9; color: black;" disabled>Course Teaching Evaluation</button>
        + `
          </div>
          </td>
          </tr>
        </table> <hr style="border: none; height: 1px; background-color: green;">` +
        `<h4 class="">Attendance Record</h4>` +


        `<table class="table table-bordered table-striped m-b-none" data-sorting="true" id="SOM_` + item.fk_acaCal + `"></table>` +
        `<h4 class="">Warning Letter Record</h4>` +
        `<table class="table table-bordered table-striped m-b-none" data-sorting="true" id="SOWL_` + item.fk_acaCal + `"></table>` +


        "</div>" +
        "</ul>" +
        "</div>";

      $("#divListSemAR").append(boxList);

      // list Course register AzizZ will change
      SOM(student_id, item.fk_acaCal, function () {
        let acaCal = item.fk_acaCal;
        // $("#loading_modal").modal("hide");
        // console.log(obj_studList.success)
        // console.log(obj_studSOM);
        if (obj_studSOM.success) {
          var columns = [
            { name: "bil", title: "No." },
            { name: "crs_name", title: "Course Code" },
            { name: "attendance", title: "Attendance" },
            { name: "TAttendance", title: "% Attendance", breakpoints: " sm xs" },
            { name: "status", title: "Status", breakpoints: " sm xs" },
          ];

          let bil = 1;
          let convertList = JSON.stringify(obj_studSOM.data);
          var list = [];
          // console.log(obj_studList.data);
          $.each(obj_studSOM.data, function (i, field) {

            if (field.rsb_status == 'Register') {
              colors = `green`;
            } else if (field.rsb_status == 'Deferred') {
              colors = `warning`;
            } else if (field.rsb_status == 'Drop') {
              colors = `red`;
            }

            let StudAttendance = field.totalHourAttend + '/' + field.CourseTotalHour;
            let total_attend = field.total_attend + '%';



            list.push({
              bil: bil++,
              crs_name: "<b>" + field.crs_code + "</b><br>" + field.crs_name,
              attendance: StudAttendance,
              TAttendance: total_attend,
              pgm_name: field.pgm_name,
              status:
                `<span class='label rounded ` +
                colors +
                `'>` +
                field.rsb_status +
                `</span>`,

            });
          });
          $("#SOM_" + acaCal + "").html("");
          $("#SOM_" + acaCal + "").footable({
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
          $("#loading_modal").modal("hide");
        }
      });

      SOWL(student_id, item.fk_acaCal, function () {
        let acaCal = item.fk_acaCal;
        // $("#loading_modal").modal("hide");
        // console.log(obj_studList.success)
        // console.log(obj_studSOWL);
        if (obj_studSOWL.success) {
          var columns = [
            { name: "bil", title: "No." },
            { name: "crs_name", title: "Course Code" },
            { name: "fWLetter", title: "1st Warning Letter" },
            { name: "sWLetter", title: "2nd Warning Letter", breakpoints: " sm xs" },
            { name: "tWLetter", title: "3rd Warning Letter", breakpoints: " sm xs" },
          ];

          let bil = 1;
          let convertList = JSON.stringify(obj_studSOWL.data);
          var list = [];
          // console.log(obj_studList.data);
          $.each(obj_studSOWL.data, function (i, field) {

            if (field.warningLetter_1 != null) {
              disabledButton1 = '';
            }
            else {
              disabledButton1 = 'hidden';
            }

            if (field.warningLetter_2 != null) {
              disabledButton2 = '';
            }
            else {
              disabledButton2 = 'hidden';
            }

            if (field.warningLetter_3 != null) {
              disabledButton3 = '';
            }
            else {
              disabledButton3 = 'hidden';
            }

            list.push({
              bil: bil++,
              crs_name: "<b>" + field.crs_code + "</b><br>" + field.crs_name,
              fWLetter: '<button class="btn danger" ' + disabledButton1 + ' onclick="window.open(\'../../api_picoms/api_pengurusan_pelajar/public/warningLetter/' + field.warningLetter_1 + '\', \'_blank\');"><i class="fa fa-file-pdf-o"></i> Warning Letter</button> <button class="btn btn-icon success" onclick="addLetter(\'' + student_id + '\',\'' + field.rsb_id + '\', 1 )"><i class="fa fa-upload"></i></button>',
              sWLetter: '<button class="btn danger" ' + disabledButton2 + ' onclick="window.open(\'../../api_picoms/api_pengurusan_pelajar/public/warningLetter/' + field.warningLetter_2 + '\', \'_blank\');"><i class="fa fa-file-pdf-o"></i> Warning Letter</button> <button class="btn btn-icon success" onclick="addLetter(\'' + student_id + '\',\'' + field.rsb_id + '\', 2 )"><i class="fa fa-upload"></i></button>',
              tWLetter: '<button class="btn danger" ' + disabledButton3 + ' onclick="window.open(\'../../api_picoms/api_pengurusan_pelajar/public/warningLetter/' + field.warningLetter_3 + '\', \'_blank\');"><i class="fa fa-file-pdf-o"></i> Warning Letter</button> <button class="btn btn-icon success" onclick="addLetter(\'' + student_id + '\',\'' + field.rsb_id + '\', 3 )"><i class="fa fa-upload"></i></button>'

            });
          });
          $("#SOWL_" + acaCal + "").html("");
          $("#SOWL_" + acaCal + "").footable({
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
          $("#loading_modal").modal("hide");
        }
      });


    });

    $('#tabListSemAR a:first').tab('show');

    // Execute callback function if provided
    // if (callback && typeof(callback) === "function") {
    //   callback();
    // }
    // Execute callback function if provided
    if (typeof callback === "function") {
      callback();
    }

  });

  $(document).ready(function () {
    $('#tabListSemAR a').on('click', function (e) {
      e.preventDefault(); // Prevent default link behavior
      $(this).tab('show'); // Show the clicked tab
    });
  });

  let form = new FormData();
  form.append("pgm_id", data[indexs].pgm_fk);
  form.append("dtp_intake", data[indexs].cur_intake);

  let obj_dtp = new post(
    host + "api_tetapan_picoms/public/misPrmProgDet/progByAcaCal/show",
    form,
    "picoms " + window.sessionStorage.token
  ).execute();
  if (obj_dtp.success) {
    obj = new get(
      host +
      "api_tetapan_picoms/public/misPrmCOTSem/listByPgmdet/" +
      obj_dtp.data.dtp_id,
      "picoms " + window.sessionStorage.token
    ).execute();
    if (obj.success) {
      $("#listCrstbl").html('');

      let rows = [];
      let columns = [
        { name: "crs_name", title: "Course" },
        { name: "credit", title: "Credit", breakpoints: "md sm xs" },
        { name: "btn", title: "Action" },
      ];

      let data_cotSem = obj.data;
      let bil = 1;
      $.each(data_cotSem, function (i, field) {

        form = new FormData();
        form.append('fk_pgm_det', obj_dtp.data.dtp_id);
        form.append('fk_semester', field.pk_id);
        obj = new post(host + 'api_tetapan_picoms/public/misPrmCrsCOTDet/listByPgm', form, 'picoms ' + window.sessionStorage.token).execute();
        if (obj.success) {
          dataCrs = obj.data;
          $.each(dataCrs, function (u, item) {
            btnAdd = `<button ${StudentAddDisabled} onclick="addCourse('` + item.crs_code + `-` + item.crs_name + `','` + item.fk_course + `','` + item.crs_credit + `','` + item.ccd_id + `')" class="btn btn-icon btn-link rounded text-success">
                      <i class="fa fa-plus-circle"></i></button>`;
            rows.push({
              credit: item.crs_credit, crs_name: '<b>' + item.crs_code + '</b><br>' +
                item.crs_name,
              btn: btnAdd
            });
          });
        }

      });

      $("#listCrstbl").footable({
        columns: columns,
        rows: rows,
        paging: {
          enabled: true,
          size: 5,
          countFormat: "Showing {PF} to {PL} of {TR} data",
        },
        filtering: {
          enabled: true,
          placeholder: "Search...",
          dropdownTitle: "Search for:",
        },
      });
    }
  }




  $("#topModalNew").modal("show");
}

function active_back(pk_cur_academic) {
  swal({
    title: "Activated Session ",
    text: "Are You Sure?",
    type: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#2196f3",
    closeOnConfirm: true,
    allowOutsideClick: false,
    html: false,
  }).then(function () {
    let form = new FormData();
    form.append('pk_cur_academic', pk_cur_academic);
    form.append('sts_status', '');
    let obj = new post(host + 'api_pengurusan_pelajar/public/curAcademic/student/type', form, 'picoms ' + window.sessionStorage.token).execute();
    if (obj.success) {
      swal('Activated Session', 'Success Update', 'success');
      $("#topModalNew").modal("hide");

      setTimeout(() => {
        let code_indexs = $("#code_indexs").val();
        loadData(code_indexs);
      }, 2000);
    }
  });
}

function addCourse(crs_name, fk_course, crs_credit, ccd_id) {
  $("#course_select").html(crs_name);
  $("#course_credit").html(crs_credit);
  $("#fk_course").val(fk_course);
  $("#ccd_id_New").val(ccd_id);
  $("#modal_course").modal('show');
}

function drop(rsb_id) {
  swal({
    title: "Drop Course ",
    text: "Are You Sure?",
    type: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#2196f3",
    closeOnConfirm: true,
    allowOutsideClick: false,
    html: false,
  }).then(function () {
    let form = new FormData();
    form.append('rsb_id', rsb_id);
    form.append('rsb_status', "Drop");
    form.append('drop_date', null);
    form.append('recordstatus', "DEL");
    let obj = new post(host + 'api_pengurusan_pelajar/public/misStdRegsub/addDrop', form, 'picoms ' + window.sessionStorage.token).execute();
    if (obj.success) {
      swal("Drop Success", "Student Info", "success");
      $("#topModalNew").modal("hide");

      setTimeout(() => {
        let code_indexs = $("#code_indexs").val();
        loadData(code_indexs);
      }, 2000);
    }
  });
}

function chkStdCurSem(id, returnValue) {
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

function chkStdCurSemTranscipt(id, returnValue) {
  var settings = {
    url: host + "api_pengurusan_pelajar/public/curAcademic/chkStdCurSemTranscipt/" + id,
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

function chkStdCurSem2(id, returnValue) {
  var settings = {
    url: host + "api_pengurusan_pelajar/public/curAcademic/chkStdCurSem2/" + id,
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

function listByActPolicy(std, acaCal, curyear, cohort, returnValue) {
  var form = new FormData();
  form.append("std_studentid", std);
  form.append("aca_session", acaCal);
  form.append("cal_cohort", cohort);
  form.append("cur_year", curyear);

  var settings = {
    url: host + "api_pengurusan_pelajar/public/misStdRegsub/listByActPolicy4",
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

function listByActPolicyCE(std, returnValue) {
  var form = new FormData();
  form.append("std_studentid", std);

  var settings = {
    url: host + "api_pengurusan_pelajar/public/misStdRegsub/listByActPolicy4/CE_display",
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
    obj_regCrsCE = JSON.parse(response);
    returnValue();
  });
}
function getLect(id, returnValue) {
  var settings = {
    url: host + "api_lecturer_picoms/public/misLectCrsPrm/listByCotDet/" + id,
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

function remove_pdf(param1, param2) {
  swal({
    title: "Remove " + param1,
    text: "Are You Sure?",
    type: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#2196f3",
    closeOnConfirm: true,
    allowOutsideClick: false,
    html: false,
  }).then(function () {
    $("#" + param2 + "_del_btn").addClass("hidden");
    $("#" + param2).removeClass("hidden");

    if (param1 != "Profile Picture") {
      $("#" + param2 + "_download").addClass("hidden");
    } else {
      $("#upt_sti_image_img").addClass("hidden");
      $("#nopic").removeClass("hidden");
    }
  });
}

$("#upt-pljrInfo").click(function () {
  let std_studentid = $("#upt_std_studentid").val();
  let sti_name = $("#upt_sti_name").val();
  let sti_icno = $("#upt_sti_icno").val();
  let pgm_id = $("#upt_pgm_id").val();
  let crs_code = $("#upt_crs_code").val();
  let sti_gender = $("#upt_sti_gender").val();
  let sti_nationality = $("#upt_sti_nationality").val();
  let sti_status_bumiputra = $("#upt_sti_status_bumiputra").val();
  // let sti_race = $("#upt_sti_race").val();
  let sti_race = $("#sti_race").val();
  let sti_religion = $("#upt_sti_religion").val();
  let sti_status_oku = $("#upt_sti_status_oku").val();
  let sti_blood_type = $("#upt_sti_blood_type").val();
  let sti_email = $("#upt_sti_email").val();
  let sti_address_1 = $("#upt_sti_address_1").val();
  let sti_address_2 = $("#upt_sti_address_2").val();
  let sti_address_3 = $("#upt_sti_address_3").val();
  let sti_postcode = $("#upt_sti_postcode").val();
  let sti_state = $("#upt_sti_state").val();
  let sti_contactno_home = $("#upt_sti_contactno_home").val();
  let sti_contactno_mobile = $("#upt_sti_contactno_mobile").val();
  let sti_bank_id = $("#upt_sti_bank_id").val();
  let sti_bank_accountno = $("#upt_sti_bank_accountno").val();
  let sti_sponsorship = $("#sti_sponsorship").val();
  let sti_baitulmal = $("#sti_baitulmal").val();
  let sti_asnaf = $("#sti_asnaf").val();
  let sti_image = $("#upt_sti_image")[0].files[0];

  let par_father_name = $("#upt_par_father_name").val();
  let par_father_address = $("#upt_par_father_address").val();
  let par_father_contactno = $("#upt_par_father_contactno").val();
  let par_father_occupation = $("#upt_par_father_occupation").val();
  let par_nextofkin = $("#upt_par_nextofkin").val();
  let par_kin_address = $("#upt_par_kin_address").val();
  let par_kin_contactno = $("#upt_par_kin_contactno").val();
  let par_mother_name = $("#upt_par_mother_name").val();
  let par_mother_address = $("#upt_par_mother_address").val();
  let par_mother_contactno = $("#upt_par_mother_contactno").val();
  let par_mother_occupation = $("#upt_par_mother_occupation").val();
  let par_parent_relation = $("#upt_par_parent_relation").val();
  let par_family_income = $("#upt_par_family_income").val();
  let par_family_responsibility = $("#upt_par_family_responsibility").val();
  let par_living_with = $("#upt_par_living_with").val();

  let srg_payment_resitdoc = $("#upt_srg_payment_resitdoc")[0].files[0];
  let srg_payment_via = $("#upt_srg_payment_via").val();
  let srg_payment_resit = $("#upt_srg_payment_resit").val();

  let sta_cert_doc = $("#upt_sta_cert_doc")[0].files[0];
  let sta_spm_doc = $("#upt_sta_spm_doc")[0].files[0];
  let sta_stpm_doc = $("#upt_sta_stpm_doc")[0].files[0];
  let sta_diploma_doc = $("#upt_sta_diploma_doc")[0].files[0];
  let sta_degree_doc = $("#upt_sta_degree_doc")[0].files[0];
  let sta_muet = $("#upt_sta_muet").val();
  let sta_bm_spm = $("#upt_sta_bm_spm").val();
  let sta_bm_stpm = $("#upt_sta_bm_stpm").val();

  let fin_fees = $("#upt_fin_fees").val();

  let sts_cur_year = $("#upt_sts_cur_year").val();
  let sts_cur_intake = $("#upt_sts_cur_intake").val();
  let sts_semester = $("#upt_sts_semester").val();
  let sts_status = $("#upt_sts_status").val();
  let sts_date_joined = $("#upt_sts_date_joined").val();
  let sts_date_complete = $("#upt_sts_date_complete").val();

  let statusrekod = "EDT";

  var form = new FormData();

  form.append("std_studentid", std_studentid);
  form.append("sti_name", sti_name);
  form.append("sti_icno", sti_icno);
  form.append("pgm_id", pgm_id);
  form.append("crs_code", crs_code);
  form.append("sti_gender", sti_gender);
  form.append("sti_nationality", sti_nationality);
  form.append("sti_status_bumiputra", sti_status_bumiputra);
  form.append("sti_race", sti_race);
  form.append("sti_religion", sti_religion);
  form.append("sti_status_oku", sti_status_oku);
  form.append("sti_blood_type", sti_blood_type);
  form.append("sti_email", sti_email);
  form.append("sti_address_1", sti_address_1);
  form.append("sti_address_2", sti_address_2);
  form.append("sti_address_3", sti_address_3);
  form.append("sti_postcode", sti_postcode);
  form.append("sti_state", sti_state);
  form.append("sti_contactno_home", sti_contactno_home);
  form.append("sti_contactno_mobile", sti_contactno_mobile);
  form.append("sti_bank_id", sti_bank_id);
  form.append("sti_bank_accountno", sti_bank_accountno);
  form.append("sti_sponsorship", sti_sponsorship);
  form.append("sti_baitulmal", sti_baitulmal);
  form.append("sti_asnaf", sti_asnaf);
  // let upload_0 = $("#sti_image")[0].files[0];
  form.append("sti_image", sti_image);

  form.append("par_father_name", par_father_name);
  form.append("par_father_address", par_father_address);
  form.append("par_father_contactno", par_father_contactno);
  form.append("par_father_occupation", par_father_occupation);
  form.append("par_nextofkin", par_nextofkin);
  form.append("par_kin_address", par_kin_address);
  form.append("par_kin_contactno", par_kin_contactno);
  form.append("par_mother_name", par_mother_name);
  form.append("par_mother_address", par_mother_address);
  form.append("par_mother_contactno", par_mother_contactno);
  form.append("par_mother_occupation", par_mother_occupation);
  form.append("par_parent_relation", par_parent_relation);
  form.append("par_family_income", par_family_income);
  form.append("par_family_responsibility", par_family_responsibility);
  form.append("par_living_with", par_living_with);

  // let upload_1 = $("#srg_payment_resitdoc")[0].files[0];
  form.append("srg_payment_resitdoc", srg_payment_resitdoc);
  form.append("srg_payment_via", srg_payment_via);
  form.append("srg_payment_resit", srg_payment_resit);

  // let upload_2 = $("#sta_cert_doc")[0].files[0];
  // let upload_3 = $("#sta_spm_doc")[0].files[0];
  // let upload_4 = $("#sta_stpm_doc")[0].files[0];
  // let upload_5 = $("#sta_diploma_doc")[0].files[0];
  // let upload_6 = $("#sta_degree_doc")[0].files[0];
  form.append("sta_cert_doc", sta_cert_doc);
  form.append("sta_spm_doc", sta_spm_doc);
  form.append("sta_stpm_doc", sta_stpm_doc);
  form.append("sta_diploma_doc", sta_diploma_doc);
  form.append("sta_degree_doc", sta_degree_doc);
  form.append("sta_muet", sta_muet);
  form.append("sta_bm_spm", sta_bm_spm);
  form.append("sta_bm_stpm", sta_bm_stpm);

  form.append("fin_fees", fin_fees);

  form.append("sts_cur_year", sts_cur_year);
  form.append("sts_cur_intake", sts_cur_intake);
  form.append("sts_semester", sts_semester);
  form.append("sts_status", sts_status);
  form.append("sts_date_joined", sts_date_joined);
  form.append("sts_date_complete", sts_date_complete);

  form.append("recordstatus", statusrekod);

  swal({
    title: "Update Student Information",
    text: "Are You Sure?",
    type: "question",
    showCancelButton: true,
    confirmButtonText: "Update",
    confirmButtonColor: "#22b66e",
    closeOnConfirm: true,
    allowOutsideClick: false,
    html: false,
  }).then(function () {
    var settings = {
      url: host + "api_pengurusan_pelajar/public/studentInfoUpdate",
      method: "POST",
      timeout: 0,
      processData: false,
      mimeType: "multipart/form-data",
      contentType: false,
      data: form,
    };

    $.ajax(settings).done(function (response) {
      // console.log(response)
      result = JSON.parse(response);
      if (!result.success) {
        Swal(result.message, result.data, "error");
        return;
      }

      // sessionStorage.token = result.token;
      window.location.replace("adminPage.html");
    });
  });
});

function closeModal() {
  $("#topModal").modal("hide");

  $(".nav-link").removeClass("active");
  $(".tab-pane").removeClass("active");
  $("#link_tab1").addClass("active");
  $("#tab1").addClass("active");
}

function triggerTab(index) {
  $(".nav-link").removeClass("active");
  $(".tab-pane").removeClass("active");
  $("#tab" + index).addClass("active");
  $("#link_tab" + index).addClass("active");
}

function studentIdChecking(self, param) {
  var btn_submit = "";
  var span_error = "";

  if (param == 1) {
    btn_submit = "btn-save";
    span_error = "check";
  } else {
    btn_submit = "upt-pljrinfo";
    span_error = "upt-check";
  }
  let input = self.value;

  var form = new FormData();
  form.append("input", input);

  var settings = {
    url: host + "api_pengurusan_pelajar/public/studentIdChecking",
    method: "POST",
    timeout: 0,
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  $.ajax(settings).done(function (response) {
    result = JSON.parse(response);
    if (result.data != "") {
      $("#" + span_error).html("Student ID Already Exists In The System");
      $("#" + span_error).prop("class", "text-danger");
      $("#" + btn_submit).prop("disabled", true);
    } else {
      $("#" + span_error).html("");
      $("#" + btn_submit).prop("disabled", false);
    }
  });
}

function del(pgm_id) {
  var form = new FormData();
  let token = window.sessionStorage.token;

  form.append("std_studentid", pgm_id);
  form.append("recordstatus", "DEL");

  swal({
    title: "Remove Student",
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
      url: host + "api_pengurusan_pelajar/public/studentInfoDelete",
      method: "POST",
      timeout: 0,
      headers: {
        Authorization: "PICOMS " + token,
      },
      processData: false,
      mimeType: "multipart/form-data",
      contentType: false,
      data: form,
    };

    $.ajax(settings).done(function (response) {
      // console.log(response)
      result = JSON.parse(response);
      if (response.success == false) {
        swal(result.message, result.data, "error");
        return;
      }

      // swal(result.message, result.data, "success");

      // sessionStorage.token = result.token;
      window.location.replace("adminPage.html");
    });
  });
}

function slctProg($id, returnValue) {
  var settings = {
    url:
      host + "api_tetapan_picoms/public/misPrmProgcampus/listByCamAct/" + $id,
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    obj_prog = response;
    returnValue();
  });
}

function slctPymntType(returnValue) {
  var settings = {
    url: host + "api_public_access/public/paymentViaList",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    obj_payment = response;
    returnValue();
  });
}

function slctGender(returnValue) {
  var settings = {
    url: host + "api_public_access/public/genderList",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    obj_gender = response;
    returnValue();
  });
}

function slctMuet(returnValue) {
  var settings = {
    url: host + "api_public_access/public/muetList",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    obj_muet = response;
    returnValue();
  });
}

function stdNewList(cam_id, returnValue) {
  var form = new FormData();
  form.append("cam_id", cam_id);
  let token = window.sessionStorage.token;

  var settings = {
    url: host + "api_pengurusan_pelajar/public/pelajar/list/new",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  let request = $.ajax(settings);
  request.done(function (response) {
    obj_studList = JSON.parse(response);
    returnValue();
  });
  request.fail(function () {
    // swal("eror", "", "error");
    // logOut();
    // obj_studList = { succes: false, message: "load data error", data: "" };
  });
}

function SOM(std_id, acaCal, returnValue) {
  var form = new FormData();
  form.append("std_id", std_id);
  form.append("acaCal", acaCal);
  let token = window.sessionStorage.token;

  var settings = {
    url: host + "api_pengurusan_pelajar/public/misStdRegsub/attendanceStudent",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  let request = $.ajax(settings);
  request.done(function (response) {
    obj_studSOM = JSON.parse(response);
    returnValue();
  });
  request.fail(function () {
    // swal("eror", "", "error");
    // logOut();
    // obj_studSOM = { succes: false, message: "load data error", data: "" };
  });
}

function SOWL(std_id, acaCal, returnValue) {
  var form = new FormData();
  form.append("std_id", std_id);
  form.append("acaCal", acaCal);
  let token = window.sessionStorage.token;

  var settings = {
    url: host + "api_pengurusan_pelajar/public/misStdRegsub/warningLetter",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  let request = $.ajax(settings);
  request.done(function (response) {
    obj_studSOWL = JSON.parse(response);
    returnValue();
  });
  request.fail(function () {
    // swal("eror", "", "error");
    // logOut();
    // obj_studSOWL = { succes: false, message: "load data error", data: "" };
  });
}

function studInfoList(pgm_id, cur_intake, cam_id, input_txt, returnValue) {
  var form = new FormData();
  form.append("pgm_id", pgm_id);
  form.append("cur_intake", cur_intake);
  form.append("input_txt", input_txt);
  form.append("cam_id", cam_id);
  let token = window.sessionStorage.token;

  var settings = {
    url: host + "api_pengurusan_pelajar/public/pelajar/list/programme",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  let request = $.ajax(settings);

  request.done(function (response) {
    obj_studList = JSON.parse(response);
    returnValue();
  });
  request.error(function () {
    obj_studList = { succes: false, message: "load data error", data: "" };
  });
}

function slctBlood(returnValue) {
  var settings = {
    url: host + "api_public_access/public/bloodTypeList",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    obj_bloodType = response;
    returnValue();
  });
}

function slctSpons(returnValue) {
  var settings = {
    url: host + "api_public_access/public/SponsTypeList",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    obj_sponsType = response;
    returnValue();
  });
}

function slctAsnaf(returnValue) {
  var settings = {
    url: host + "api_public_access/public/AsnafList",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    obj_asnafType = response;
    returnValue();
  });
}

function slctParentStatus(returnValue) {
  var settings = {
    url: host + "api_public_access/public/parentList",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    obj_parent = response;
    returnValue();
  });
}

function slctStayWith(returnValue) {
  var settings = {
    url: host + "api_public_access/public/livingList",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    obj_stayWith = response;
    returnValue();
  });
}

function slctNative(returnValue) {
  var settings = {
    url: host + "api_public_access/public/nativeList",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    obj_native = response;
    returnValue();
  });
}

function slctStudStatus(returnValue) {
  var settings = {
    url: host + "api_public_access/public/statusList",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    obj_studStatus = response;
    returnValue();
  });
}

function slctReligion(returnValue) {
  var settings = {
    url: host + "api_public_access/public/religionList",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    obj_religion = response;
    returnValue();
  });
}

function slctOKU(returnValue) {
  var settings = {
    url: host + "api_public_access/public/okuList",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    obj_oku = response;
    returnValue();
  });
}

function slctIntake(returnValue) {
  let token = window.sessionStorage.token;
  var settings = {
    url: host + "api_tetapan_picoms/public/intake/list",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_intake = response;
    returnValue();
  });
}

function slctEduLevel(returnValue) {
  var settings = {
    url: host + "api_pengurusan_pelajar/public/misEduLevel/list",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    obj_eduLevel = response;
    returnValue();
  });
}

function showFaculty(fac_id, token, returnValue) {
  var form = new FormData();
  form.append("fac_id", fac_id);
  var settings = {
    url: host + "api_tetapan_picoms/public/faculty/" + fac_id,
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  $.ajax(settings).done(function (response) {
    objFaculty = JSON.parse(response);
    returnValue();
  });
}

function slctTitle(returnValue) {
  var settings = {
    url: host + "api_public_access/public/misTitle/list",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    obj_title = response;
    returnValue();
  });
}

function slctRelationship(returnValue) {
  var settings = {
    url: host + "api_public_access/public/misRelationship/list",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    obj_relationship = response;
    returnValue();
  });
}

function getSemester(id, returnValue) {
  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmCOTSem/listByPgmdet/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_semList = response;
    returnValue();
  });
}

function findPkId(pgm_id, dtp_year, dtp_intake, token, returnValue) {
  var form = new FormData();
  form.append("pgm_id", pgm_id);
  form.append("dtp_year", dtp_year);
  form.append("dtp_intake", dtp_intake);

  var settings = {
    url: host + "api_tetapan_picoms/public/misPrmProgDet/findPkId",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "PICOMS " + token,
    },
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  let request = $.ajax(settings);

  request.done(function (response) {
    objfindPkId = JSON.parse(response);
    returnValue();
  });

  request.fail(function (response) {
    objfindPkId = JSON.parse(response);
    returnValue();
  });
}

function filterData(data, conditions) {
  return data.filter(item => {
    for (const key in conditions) {
      if (item[key] != conditions[key]) {
        return false; // If any condition doesn't match, exclude the item
      }
    }
    return true; // All conditions matched, include the item
  });
}


function addLetter(studID, rsbID, idLetter) {
  $('#uploadFile').modal('show');
  $('.modalName').html('ADD WARNING LETTER ' + idLetter);
  $('#WL_StudentID').val(studID);
  $('#WL_ID').val(idLetter);
  $('#rsbID').val(rsbID);
}

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

  // console.log(listPrint2);
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

function viewExamSlip(studID, studname, acaCal, cur_year, cal_cohort, stud_icno, stud_cur_intake, stud_pgm_name) {

  studentdet = studID + ' - ' + studname;
  sessiondet = cur_year + ' - ' + cal_cohort
  // $("#studID").html(studentdet);
  $("#studname").html(studname);
  $("#studid").html(studID);
  $("#cmsession").html(sessiondet);
  $("#studic").html(stud_icno);
  $("#studprog").html(stud_pgm_name);
  $("#studintake").html(stud_cur_intake);

  ////
  listPrintExam = [];

  listPrintExam.push({

    studname: studname,
    studId: studID,
    acaCal: acaCal,
    cal_cohort: cal_cohort,
    cur_year: cur_year,
    stud_icno: stud_icno,
    stud_pgm_name: stud_pgm_name,
    stud_cur_intake: stud_cur_intake,

  });

  window.sessionStorage.listExamSlip = JSON.stringify(listPrintExam);

  listByActPolicyExam(studID, acaCal, function () {

    var columns = [
      { name: "bil", title: "No." },
      { name: "cur_year", title: "Academic Session" },
      { name: "crs_code", title: "Course Code" },
      { name: "examType", title: "Exam Type" },
      { name: "paper_type", title: "Paper Type" },
      { name: "date", title: "Date" },
      { name: "time", title: "Time" },
      { name: "venue", title: "Venue" },
      { name: "seatnum", title: "Seat Number" },
      { name: "status", title: "Status" },

    ];

    let bil = 1;
    var list = [];
    let convertList = JSON.stringify(obj_regCrs.data);
    $("#dataList_" + acaCal).val(convertList);

    $.each(obj_regCrs.data, function (j, itemJ) {

      let acaSession = itemJ.cur_year;
      let acaCal = acaSession.replace("/", "") + "/" + itemJ.cal_cohort;
      let tempatDuduk = '';


      // if (itemJ.barr_status != null || itemJ.barr_status == ""){
      if (itemJ.barr_status === 'Barred') {
        // statusexam = itemJ.rsb_status;
        statusexam = '<span style="color: red; font-weight: bold;">' + itemJ.barr_status + '</span>'
        tempatDuduk = '';

      }
      else {
        statusexam = '<span style="color: green; font-weight: bold;">' + itemJ.rsb_status + '</span>'
        tempatDuduk = itemJ.est_tableno;

      }

      list.push({
        bil: bil++,
        cur_year: acaCal,
        crs_code:
          '<span class="text-uppercase">' +
          itemJ.crs_code +
          " - " +
          itemJ.crs_name +
          "</span>",
        paper_type: itemJ.paper_type,
        date: formatDate1(itemJ.tbl_date_start),
        time:
          '<span >' +
          formatTime(itemJ.tbl_time_start) + " - " + formatTime(itemJ.tbl_time_end) +
          "</span>",
        venue: itemJ.cen_id,
        seatnum: tempatDuduk,
        status: statusexam,
        examType: itemJ.exam_type,

      });
    });

    $("#tblCMark").html('');
    $("#tblCMark").footable({
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
    $("#StudTviewExamSlip").modal("show");
  });
}

function listByActPolicyExam(std, acaCal, returnValue) {


  var form = new FormData();
  form.append("std_studentid", std);
  form.append("fk_acaCal", acaCal);

  var settings = {
    url: host + "api_pengurusan_pelajar/public/misStdSlipExam/listBySession",
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

function viewStudentResult(studID, stud_name, aca_session, year, cohort, sem) {

  listPrintExam = [];

  listPrintExam.push({
    stud_name: stud_name,
    studId: studID,
    aca_session: aca_session,
    cohort: cohort,
    year: year,
    sem: sem,
  });

  window.sessionStorage.listPrintExam = JSON.stringify(listPrintExam);

  window.open("../student/print_ExamStudent.html");

}

$("#formAddFile").on('submit', function (e) {
  if (!confirmed) {
    e.preventDefault();
    swal({
      title: "Add Warning Letter",
      text: "Are You Sure?",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Save",
      confirmButtonColor: "#2196f3",
      closeOnConfirm: true,
      allowOutsideClick: false,
      html: false
    }).then(function () {
      let StudentID = $("#WL_StudentID").val();
      let WL_ID = $("#WL_ID").val();
      let WLfile = $("#WLfile")[0].files[0];
      let rsbID = $('#rsbID').val();

      var form = new FormData();
      form.append("StudentID", StudentID);
      form.append("WL_ID", WL_ID);
      form.append("WLfile", WLfile);
      form.append("rsbID", rsbID);
      form.append("recordstatus", "EDT");

      var settings = {
        "url": host + "api_pengurusan_pelajar/public/misStdRegsub/warningLetterUpload",
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
        result = JSON.parse(response);
        if (!result.success) {
          Swal(result.message, result.data, "error");
          return;
        }
        window.location.reload();
        $('#uploadFile').modal('hide');
      });
    });
  }
});

$("#printTimeTableStudent").on("click", function (e) {
  window.open("../student/print_timetblStudent.html");
});

$("#printTimeTableExam").on("click", function (e) {
  window.open("../student/print_timetblExam.html");
});

///////////////////////////////////////////////////////////////////////////////////////////////adlina//////////////////////////////////////////////////////////////////////////////////////////////////////////////iqin busuk komfem banyak
///////////////////////////////////////////////////////////////////////////////////////////////adlina//////////////////////////////////////////////////////////////////////////////////////////////////////////////iqin busuk komfem banyak
///////////////////////////////////////////////////////////////////////////////////////////////adlina//////////////////////////////////////////////////////////////////////////////////////////////////////////////iqin busuk komfem banyak
///////////////////////////////////////////////////////////////////////////////////////////////adlina//////////////////////////////////////////////////////////////////////////////////////////////////////////////iqin busuk komfem banyak
///////////////////////////////////////////////////////////////////////////////////////////////adlina//////////////////////////////////////////////////////////////////////////////////////////////////////////////iqin busuk komfem banyak

function viewTranscript(studID) {

  // // utk display totalCredit Transfer
  // let objTranscriptAmbikTotal = new get(host + 'api_pengurusan_pelajar/public/cect/listCourse/' + studID, "picoms " + window.sessionStorage.token).execute(); 
  // let sumCect = objTranscriptAmbikTotal.sumcect; 
  // $("#ATtct").html(sumCect);
  // if (sumCect) {
  //   $("#ATtct").html(0);
  //   $("#ATtct").html(sumCect);
  // }
  // else {
  //   $("#ATtct").html(0);
  // }
  // // end utk display totalCredit Transfer



  var listCummulativeBySem = [];

  $("#divListSemAT").html('');

  studentID = studID;
  listRowAT = [];

  let columns = [
    { "name": "ccode", "title": "CODE" },
    { "name": "cname", "title": "COURSE" },
    { "name": "attemp", "title": "ATTEMPT", "breakpoints": " sm xs" },
    { "name": "credit", "title": "CREDIT", "breakpoints": " sm xs" },
    { "name": "grade", "title": "GRADE", "breakpoints": " sm xs" },
    { "name": "gpa", "title": "GPA", "breakpoints": " sm xs" },
  ];

  let listCECT = [];
  // nie utk letak CT transfer
  let objTranscript = new get(host + 'api_pengurusan_pelajar/public/cect/listCourse/transkrip/' + studentID, "picoms " + window.sessionStorage.token).execute();



  if (objTranscript.success) {

    $("#tableCect").html('<table class="table table-bordered table-striped m-b-none " data-sorting="true" id="list_cect"></table>');
    document.getElementById('printAcademicTranscript').classList.replace('buttonNoCect', 'hidden');
    $("#ATtct").html(objTranscript.sumcect);

    $.each(objTranscript.data, function (i, field) {

      listCECT.push({
        ccode: '<span class="text-uppercase">' + field.crs_code + '</span>',
        cname: '<span class="text-uppercase">' + field.crs_name + '</span>',
        attemp: '<span class="text-uppercase">' + field.cect_type + '</span>',
        credit: field.crs_credit,
        grade: 'PASS',
        gpa: 'PASS',

        // grade: field.grade_pre,
        // gpa: field.grade_pre,
      });

      if (objTranscript.data.length == (i + 1)) {
        listCECT.push({
          ccode: '<b> CREDIT EARNED</b>',
          cname: '',
          attemp: '',
          credit: '<b>' + objTranscript.sumce + '</b>',
          sts_cect: '-',
          gpa: '-',
        });
      }
    });

  }
  else {
    document.getElementById('printAcademicTranscriptCECT').classList.replace('buttonCect', 'hidden');

    listCECT = [];
    columns = [];
  }



  $("#list_cect").footable({
    "columns": columns,
    "rows": listCECT,
    "paging": {
      "enabled": false,
      "size": 10
    },
    "filtering": {
      "enabled": false,
      "placeholder": "Search...",
      "dropdownTitle": "Search for:"
    }

  });
if (listCECT.length <1 ) {
  $("#list_cect").html('');
}

  chkStdCurSemTranscipt(studentID, function () {
    // $("#divListSemAT").html("");
    let rsb_typeList = ['CT', 'CE'];
    let formAttend = new FormData();
    formAttend.append('std_studentid', studentID);


    let tTc = 0;
    let totalTTC = 0;

    let sumtc = obj_stdCurSem.sumtc;
    let maxcGpa = obj_stdCurSem.maxcGpa;
    let maxSenate = obj_stdCurSem.maxSenate;

    $("#ATcgpa").html(maxcGpa);

    ATstatusAcademic = $("#ATstatusAcademic").html();
    // console.log(ATstatusAcademic);
    if (ATstatusAcademic == 8) {
      if (maxSenate != null || maxSenate != undefined) {
        $("#ATyearEnd").html(maxSenate.split('-')[0]);
      }
      $("#ATSenate").html(maxSenate);

    }
    else {
      $("#ATyearEnd").html('NOT GRADUATED YET');
      $("#ATSenate").html('-');
    }

    sumCect = $("#ATtct").html();


    $.each(obj_stdCurSem.data, function (i, item) {//
      totalTTC = totalTTC + (item.tc * 1);
      $("#ATgtc").html(totalTTC + (sumCect * 1));



      let gpa = item.std_gpa;
      let cgpa = item.std_cgpa;

      if (gpa == null) {
        gpa = "";
      }

      if (cgpa == null) {
        cgpa = "";
      }

      let boxList =
        '<li class="nav-item active" id="navLectDataAT">' +
        '<a href="#" class="nav-link auto info">' +
        '<span class="pull-right text-muted m-r-xs">' +
        '<i class="fa fa-plus inline"></i>' +
        '<i class="fa fa-minus none"></i>' +
        "</span> Semester : " + item.std_semester + "</a>" +
        '<ul class="nav nav-sub text-sm">' +
        '<div class="row m-a-2">' +
        '<textarea class="hidden" id="dataListAT_' +
        item.fk_acaCal +
        '"></textarea><p>' +
        '<table id="crListAT_' + item.fk_acaCal + '" class="table table-striped"></table>' +
        "</div>" +
        "</ul>" +
        "</li>";

      $("#divListSemAT").append(boxList);

      listByActPolicy(studentID, item.fk_acaCal, item.cur_year, item.cal_cohort, function () {


        var columns = [
          // { name: "btn", title: "" },
          { name: "crs_code", title: "CODE" },
          { name: "crs_name", title: "COURSE" },
          { name: "rsb_type", title: "ATTEMPT", breakpoints: "md sm xs" },
          { name: "credit", title: "CREDIT", breakpoints: "md sm xs" },
          { name: "grade", title: "GRADE" },
          { name: "point", title: "GPA" },
        ];

        var list = [];
        totalCreditCount = 0;
        let convertList = JSON.stringify(obj_regCrs.data);

        $("#dataListAT_" + item.fk_acaCal).val(convertList);

        listRowAT.push({ fk_acaCal: item.fk_acaCal, studentID: studentID, data: obj_regCrs.data });
        var admin = window.sessionStorage.usrCatEadmin;

        obj_regCrs.data.forEach(async (itemJ, j) => {

          let btnDis = "";
          let attend = "";
          let info = "";
          let final_examDisplay = "";
          if (itemJ.ip == "checked") {
            info = ` <br><span class="label warning">In Progress</span>`;
          }
          else if (itemJ.mrf == "checked") {
            info = ` <span class="label warning">MRAF</span>`;
          }

          if (itemJ.grade == "" && info == "") {

            btnDis = `<button ${StudentDelDisabled} onclick="drop('` + itemJ.rsb_id + `')" class="btn btn-icon btn-link text-danger"><i class="fa fa-minus-circle"></i></button>`;


            // if (admin === "1" || admin === 1) {
            //   btnDis = `<button onclick="drop('` + itemJ.rsb_id + `')" class="btn btn-icon btn-link text-danger"><i class="fa fa-minus-circle"></i></button>`;
            // } else {
            //   btnDis = `<button onclick="drop('` + itemJ.rsb_id + `')" class="btn btn-icon btn-link text-danger" disabled><i class="fa fa-minus-circle"></i></button>`;
            // }

          }
          else {
            let yearTaken = item.cur_year;
            let cal_cohort = item.cal_cohort;
            if (yearTaken.replace('/', '') >= "20222023") {
              if (cal_cohort < "3" && yearTaken.replace('/', '') == "20222023") {

              }
              else {
                attend = `<br><span class="label red">Not Attend</span>`;

                let objLectChecked = new get(host + 'api_lecturer_picoms/public/misLectCrsPrm/chkFinalExam/' + itemJ.fk_cotDet, 'picoms ' + window.sessionStorage.token).execute();

                if (objLectChecked.success) {
                  data_objLectChecked = objLectChecked.data;
                  final_examDisplay = data_objLectChecked.final_exam;

                }
                if (final_examDisplay != 'checked') {
                  attend = `<br><span class="label blue">No Final Exam</span>`;
                }


              }
            }
          }

          tMark = (itemJ.tMark)* 1;
          gradeStdFinalCheck = (itemJ.counted_cgpa === "Yes" ) ? itemJ.grade : (((tMark.toFixed(0)) >= 50) ? 'PASS' : 'Fail');
          pointStdFinalCheck = (itemJ.counted_cgpa === "Yes" ) ? itemJ.point : '';

          // console.log(itemJ);
          list.push({
            crs_code: '<span class="text-uppercase">' + itemJ.crsCode + "</span>",
            crs_name: '<span class="text-uppercase">' + itemJ.crs_name + "</span>",
            rsb_type: itemJ.rsb_type,
            credit: itemJ.crs_credit,
            grade: gradeStdFinalCheck + info,
            // grade: itemJ.grade + info,
            point: pointStdFinalCheck,
            // point: itemJ.point,
          });

          totalCreditCount += itemJ.crs_credit;


          // console.log(itemJ);
          if (obj_regCrs.data.length == (j + 1)) {

            list.push({
              crs_code: '<b>CREDIT EARNED<br>CUMULATIVE CREDIT</b>',
              crs_name: '',
              rsb_type: '',
              credit: totalCreditCount + '<br>' + '<p id="CummulativeCal_' + item.std_semester + '"></p>',
              grade: '<b>GPA<br>CGPA</b',
              point: '<b>' + gpa + '</b><br><b>' + cgpa + '</b>',
            });
          }

        });
        listCummulativeBySem.push({
          semStd: item.std_semester,
          acaCalStd: item.fk_acaCal,
          creditEachSem: totalCreditCount,
        })
        listCummulativeBySem.sort((a, b) => a.semStd - b.semStd);
        var tCummulative = 0;

        // Calculate the cumulative credits
        listCummulativeBySem.forEach(item => {
          tCummulative += item.creditEachSem;
          item.creditCummative = tCummulative;



        });
        
        // console.log(listCummulativeBySem);
        // console.log(listCummulativeBySem[listCummulativeBySem.length - 1].creditCummative);
        $("#ATtce").html(listCummulativeBySem[listCummulativeBySem.length - 1].creditCummative);
        // $("#ATtce").html(listCummulativeBySem[listCummulativeBySem.length - 1].creditEachSem);
        $("#ATcgpa").html(listCummulativeBySem[listCummulativeBySem.length - 1].creditCummative);
        $("#crListAT_" + item.fk_acaCal).footable({
          columns: columns,
          rows: list,
          paging: {
            enabled: true,
            size: 10,
            countFormat: "Showing {PF} to {PL} of {TR} data",
          },
          filtering: {
            enabled: false,
            placeholder: "Search...",
            dropdownTitle: "Search for:",
          },
        });


        listCummulativeBySem.forEach(item => {
          $('#CummulativeCal_' + item.semStd).html(item.creditCummative);
        });

      });

      listByActPolicyCE(studentID, function () {
        var columns = [
          { name: "crs_code", title: "Course Code" },
          { name: "rsb_type", title: "Type", breakpoints: "md sm xs" },
          { name: "creditSbject", title: "Credit", breakpoints: "md sm xs" },
          { name: "grade", title: "Grade" },
        ];

        let bil = 1;
        var list = [];
        let convertList = JSON.stringify(obj_regCrsCE.data);
        $("#dataListAT_" + item.fk_acaCal).val(convertList);

        listRowAT.push({ fk_acaCal: item.fk_acaCal, studentID: studentID, data: obj_regCrsCE.data });
        var admin = window.sessionStorage.usrCatEadmin;
        tCreditCE = 0;

        $.each(obj_regCrsCE.data, function (j, itemJ) {

          let btnDis = "";

          if (itemJ.grade == "") {
            
            btnDis = `<button ${StudentDelDisabled} onclick="drop('` + itemJ.rsb_id + `')" class="btn btn-icon btn-link text-danger"><i class="fa fa-minus-circle"></i></button>`;

            // if (admin === "1" || admin === 1) {
            //   btnDis = `<button onclick="drop('` + itemJ.rsb_id + `')" class="btn btn-icon btn-link text-danger"><i class="fa fa-minus-circle"></i></button>`;
            // } else {
            //   btnDis = `<button onclick="drop('` + itemJ.rsb_id + `')" class="btn btn-icon btn-link text-danger" disabled><i class="fa fa-minus-circle"></i></button>`;
            // }

          }

          tCreditCE += (itemJ.crs_credit * 1);
          list.push({
            crs_code:
              '<span class="text-uppercase">' +
              itemJ.crsCode +
              " - " +
              itemJ.crs_name +
              "</span>",
            rsb_type: itemJ.rsb_type,
            creditSbject: itemJ.crs_credit,
            grade: itemJ.grade,
          });
        });

        $("#listCEAT").html('');
        $("#listCEAT").footable({
          columns: columns,
          rows: list,
          paging: {
            enabled: true,
            size: 10,
            countFormat: "Showing {PF} to {PL} of {TR} data",
          },
          filtering: {
            enabled: false,
            placeholder: "Search...",
            dropdownTitle: "Search for:",
          },
        });
        $('#tCreditCEAT').html(`Total Credit: ` + tCreditCE);
      });

    });

  });

  $("#modalTranscriptMain").modal("show");
  // });
}

$("#printAcademicTranscriptCECT").on("click", function (e) {
  // window.open("../student/print_timetblExam.html");

  // $("#modalAcademicTranscript").modal("show");

  studentIDCect = $('#matric_no').val();
  // alert(studentIDCect);
  listRowAT = [];

  let columns = [
    { "name": "ccode", "title": "CODE" },
    // { "name": "bil_sem", "title": "SEM" },
    { "name": "cname", "title": "COURSE" },
    { "name": "attemp", "title": "ATTEMPT", "breakpoints": " sm xs" },
    { "name": "credit", "title": "CREDIT", "breakpoints": " sm xs" },
    { "name": "grade", "title": "GRADE", "breakpoints": " sm xs" },
    { "name": "gpa", "title": "GPA", "breakpoints": " sm xs" },
  ];

  let listCECT = [];

  let objTranscript = new get(host + 'api_pengurusan_pelajar/public/cect/listCourse/transkrip/' + studentIDCect, "picoms " + window.sessionStorage.token).execute();

  // let sumCect = objTranscript.sumcect;
  // $("#ATtct").html(sumCect);

  if (objTranscript.success) {
   let bil_sem = 1;
    $("#tableCect").html('<table class="table table-bordered table-striped m-b-none " data-sorting="true" id="list_cect"></table>');
    document.getElementById('printAcademicTranscript').classList.replace('buttonNoCect', 'hidden');

    $.each(objTranscript.data, function (i, field) {
      if (i == 0) {
        listCECT.push({
          bil_sem: '0'+'.'+1,
          ccode: '<b>COURSE EXEMPTED</b>',
          cname: '',
          attemp: '',
          credit: '',
          grade: '',
          gpa: '',
        });
        listCECT.push({
          bil_sem: '0'+'.'+bil_sem++,
          ccode: '<span class="text-uppercase">' + field.crs_code + '</span>',
          cname: '<span class="text-uppercase">' + field.crs_name + '</span>',
          attemp: '<span class="text-uppercase">' + field.cect_type + '</span>',
          credit: field.crs_credit,
          grade: 'PASS',
          gpa: 'PASS',
        });
      } else {
        listCECT.push({
          bil_sem: '0'+'.'+bil_sem++,
          ccode: '<span class="text-uppercase">' + field.crs_code + '</span>',
          cname: '<span class="text-uppercase">' + field.crs_name + '</span>',
          attemp: '<span class="text-uppercase">' + field.cect_type + '</span>',
          credit: field.crs_credit,
          grade: 'PASS',
          gpa: 'PASS',
        });
      }

      if (objTranscript.data.length == (i + 1)) {
        listCECT.push({
          bil_sem: '0'+'.'+bil_sem++,
          ccode: '',
          cname: '<b> CREDIT EARNED</b>',
          attemp: '',
          credit: '<b>' + sumCect + '</b>',
          sts_cect: '-',
          gpa: '-',
        });

        listCECT.push({
          bil_sem: '0'+'.'+bil_sem++,
          ccode: '',
          cname: '',
          attemp: '',
          credit: '',
          sts_cect: '',
          gpa: '',
        });
      }
    });
  }
  else {
  }

  chkStdCurSemTranscipt(studentIDCect, function () {

    // $("#divListSemAT").html("");
    let rsb_typeList = ['CT', 'CE'];
    let formAttend = new FormData();
    formAttend.append('std_studentid', studentIDCect);


    let tTc = 0;
    let totalTTC = 0;

    let sumtc = obj_stdCurSem.sumtc;
    let maxcGpa = obj_stdCurSem.maxcGpa;

    // $("#ATcgpa").html(maxcGpa);
    sumCect = $("#ATtct").html();


    $.each(obj_stdCurSem.data, function (i, item) {

      totalTTC = totalTTC + (item.tc * 1);
      // $("#ATtce").html(totalTTC);
      $("#ATgtc").html(totalTTC + (sumCect * 1));

      let gpa = item.std_gpa;
      let cgpa = item.std_cgpa;

      if (gpa == null) {
        gpa = "";
      }

      if (cgpa == null) {
        cgpa = "";
      }

      listByActPolicy(studentID, item.fk_acaCal, item.cur_year, item.cal_cohort, function () {

        listRowAT.push({ fk_acaCal: item.fk_acaCal, studentID: studentID, data: obj_regCrs.data });
        var admin = window.sessionStorage.usrCatEadmin;

        let bil_sem = 0;
        // console.log(obj_regCrs.data);
        obj_regCrs.data.forEach(async (itemJ, j) => {
          // $.each(obj_regCrs.data,function(j,itemJ){
          let btnDis = "";
          let attend = "";
          let info = "";
          if (itemJ.ip == "checked") {
            info = ` <span class="label warning">In Progress</span>`;
          }
          else if (itemJ.mrf == "checked") {
            info = ` <span class="label warning">MRAF</span>`;
          }

          if (itemJ.grade == "" && info == "") {
            btnDis = `<button ${StudentDelDisabled} onclick="drop('` + itemJ.rsb_id + `')" class="btn btn-icon btn-link text-danger"><i class="fa fa-minus-circle"></i></button>`;

            // if (admin === "1" || admin === 1) {
            //   btnDis = `<button onclick="drop('` + itemJ.rsb_id + `')" class="btn btn-icon btn-link text-danger"><i class="fa fa-minus-circle"></i></button>`;
            // } else {
            //   btnDis = `<button onclick="drop('` + itemJ.rsb_id + `')" class="btn btn-icon btn-link text-danger" disabled><i class="fa fa-minus-circle"></i></button>`;
            // }

          }
          else {
            let yearTaken = item.cur_year;
            let cal_cohort = item.cal_cohort;
            if (yearTaken.replace('/', '') >= "20222023") {
              if (cal_cohort < "3" && yearTaken.replace('/', '') == "20222023") {

              }
              else {
                attend = `<br><span class="label red">Not Attend</span>`;

                let objLectChecked = new get(host + 'api_lecturer_picoms/public/misLectCrsPrm/chkFinalExam/' + itemJ.fk_cotDet, 'picoms ' + window.sessionStorage.token).execute();

                if (objLectChecked.success) {
                  data_objLectChecked = objLectChecked.data;
                  final_examDisplay = data_objLectChecked.final_exam;

                }
                if (final_examDisplay != 'checked') {
                  attend = `<br><span class="label blue">No Final Exam</span>`;
                }


              }
            }
          }
          tMark = (itemJ.tMark)* 1;
          gradeStdFinalCheck = (itemJ.counted_cgpa === "Yes" ) ? itemJ.grade : (((tMark.toFixed(0)) >= 50) ? 'PASS' : 'Fail');
          pointStdFinalCheck = (itemJ.counted_cgpa === "Yes" ) ? itemJ.point : '';

          if (j == 0) {
            bil_sem++;
            listCECT.push({
              bil_sem: item.std_semester + '.' + bil_sem,
              ccode: '<b>SEMESTER </b>',
              cname: item.std_semester,
              attemp: '',
              credit: '',
              grade: '',
              gpa: '',
            });
            bil_sem++;
            listCECT.push({
              bil_sem: item.std_semester + '.' + bil_sem,
              ccode: '<span class="text-uppercase">' + itemJ.crsCode + "</span>",
              cname: '<span class="text-uppercase">' + itemJ.crs_name + "</span>",
              attemp: itemJ.rsb_type,
              credit: itemJ.crs_credit,
              grade: gradeStdFinalCheck + info,
              gpa: pointStdFinalCheck,
            });
          } else {
            bil_sem++;
            listCECT.push({
              bil_sem: item.std_semester + '.' + bil_sem,
              ccode: '<span class="text-uppercase">' + itemJ.crsCode + "</span>",
              cname: '<span class="text-uppercase">' + itemJ.crs_name + "</span>",
              attemp: itemJ.rsb_type,
              credit: itemJ.crs_credit,
              grade: gradeStdFinalCheck + info,
              gpa: pointStdFinalCheck,
            });
          }



          if (obj_regCrs.data.length == (j + 1)) {
            bil_sem++;
            listCECT.push({
              bil_sem: item.std_semester + '.' + bil_sem,
              ccode: '',
              cname: '<b>CREDIT EARNED<br>CUMULATIVE CREDIT</b>',
              attemp: '',
              credit: item.tc + '<br>' + (tTc += (item.tc * 1)),
              grade: '<b>GPA<br>CGPA</b',
              gpa: '<b>' + gpa + '</b><br><b>' + cgpa + '</b>',
            });

            listCECT.push({
              bil_sem: item.std_semester + '.' + bil_sem,
              ccode: '',
              cname: '',
              attemp: '',
              credit: '',
              grade: '',
              gpa: '',
            });
          }

        });


      });

    });

  });

  setTimeout(() => {

    listCECT.sort(compareBySemester);

    $("#testtable").on('footable_initialized', function () {
      generatePDFTranscript('Transcript', 'testtable');
    });

    $("#testtable").footable({
      "columns": columns,
      "rows": listCECT,
      "paging": {
        "enabled": false,
        "size": 10
      },
      "filtering": {
        "enabled": false,
        "placeholder": "Search...",
        "dropdownTitle": "Search for:"
      }

    });
    generatePDFTranscript('Transcript', 'testtable');
  }, Math.random() * 2000);
});

// function compareBySemester(a, b) {
//   if (a.bil_sem < b.bil_sem) {
//     return -1;
//   }
//   if (a.bil_sem > b.bil_sem) {
//     return 1;
//   }
//   return 0;
// }
// Sorting function
function compareBySemester(a, b) {

  // nie utk check sma ada bil sem wujud atau x
  if (!a.bil_sem) return -1;
  if (!b.bil_sem) return 1;

  let [majorA, minorA] = a.bil_sem.split('.').map(Number);
  let [majorB, minorB] = b.bil_sem.split('.').map(Number);

  if (majorA !== majorB) {
    return majorA - majorB;
  }
  
  return minorA - minorB;
}


$("#printAcademicTranscript").on("click", function (e) {
  // window.open("../student/print_timetblExam.html");


  // $("#modalAcademicTranscript").modal("show");

  studentIDCect = $('#matric_no').val();
  // alert(studentIDCect);
  listRowAT = [];

  let columns = [
    { "name": "ccode", "title": "CODE" },
    // { "name": "bil_sem", "title": "SEM" },
    { "name": "cname", "title": "COURSE" },
    { "name": "attemp", "title": "ATTEMPT", "breakpoints": " sm xs" },
    { "name": "credit", "title": "CREDIT", "breakpoints": " sm xs" },
    { "name": "grade", "title": "GRADE", "breakpoints": " sm xs" },
    { "name": "gpa", "title": "GPA", "breakpoints": " sm xs" },
  ];

  let listCECT = [];

  let objTranscript = new get(host + 'api_pengurusan_pelajar/public/cect/listCourse/' + studentIDCect, "picoms " + window.sessionStorage.token).execute();

  let sumCect = objTranscript.sumcect;
  // $("#ATtct").html(sumCect);


  chkStdCurSemTranscipt(studentIDCect, function () {

    // $("#divListSemAT").html("");
    let rsb_typeList = ['CT', 'CE'];
    let formAttend = new FormData();
    formAttend.append('std_studentid', studentIDCect);


    let tTc = 0;
    let totalTTC = 0;

    let sumtc = obj_stdCurSem.sumtc;
    let maxcGpa = obj_stdCurSem.maxcGpa;
console.log(maxcGpa);
    // $("#ATcgpa").html(maxcGpa);
    sumCect = $("#ATtct").html();


    $.each(obj_stdCurSem.data, function (i, item) {

      totalTTC = totalTTC + (item.tc * 1);
      // $("#ATtce").html(totalTTC);
      $("#ATgtc").html(totalTTC + (sumCect * 1));

      let gpa = item.std_gpa;
      let cgpa = item.std_cgpa;

      if (gpa == null) {
        gpa = "";
      }

      if (cgpa == null) {
        cgpa = "";
      }

      listByActPolicy(studentID, item.fk_acaCal, item.cur_year, item.cal_cohort, function () {

        listRowAT.push({ fk_acaCal: item.fk_acaCal, studentID: studentID, data: obj_regCrs.data });
        var admin = window.sessionStorage.usrCatEadmin;

        let bil_sem = 0;
        obj_regCrs.data.forEach(async (itemJ, j) => {

          let btnDis = "";
          let attend = "";
          let info = "";
          if (itemJ.ip == "checked") {
            info = ` <br><span class="label warning">In Progress</span>`;
          }
          else if (itemJ.mrf == "checked") {
            info = ` <span class="label warning">MRAF</span>`;
          }

          if (itemJ.grade == "" && info == "") {

            if (admin === "1" || admin === 1) {
              btnDis = `<button onclick="drop('` + itemJ.rsb_id + `')" class="btn btn-icon btn-link text-danger"><i class="fa fa-minus-circle"></i></button>`;
            } else {
              btnDis = `<button onclick="drop('` + itemJ.rsb_id + `')" class="btn btn-icon btn-link text-danger" disabled><i class="fa fa-minus-circle"></i></button>`;
            }

          }
          else {
            let yearTaken = item.cur_year;
            let cal_cohort = item.cal_cohort;
            if (yearTaken.replace('/', '') >= "20222023") {
              if (cal_cohort < "3" && yearTaken.replace('/', '') == "20222023") {

              }
              else {
                attend = `<br><span class="label red">Not Attend</span>`;

                let objLectChecked = new get(host + 'api_lecturer_picoms/public/misLectCrsPrm/chkFinalExam/' + itemJ.fk_cotDet, 'picoms ' + window.sessionStorage.token).execute();

                if (objLectChecked.success) {
                  data_objLectChecked = objLectChecked.data;
                  final_examDisplay = data_objLectChecked.final_exam;

                }
                if (final_examDisplay != 'checked') {
                  attend = `<br><span class="label blue">No Final Exam</span>`;
                }
              }
            }
          }
          tMark = (itemJ.tMark)* 1;
          gradeStdFinalCheck = (itemJ.counted_cgpa === "Yes" ) ? itemJ.grade : (((tMark.toFixed(0)) >= 50) ? 'PASS' : 'Fail');
          pointStdFinalCheck = (itemJ.counted_cgpa === "Yes" ) ? itemJ.point : '';
          
          if (j == 0) {
            bil_sem++;
            listCECT.push({
              bil_sem: item.std_semester + '.' + bil_sem,
              ccode: '<b>SEMESTER </b>',
              cname: item.std_semester,
              attemp: '',
              credit: '',
              grade: '',
              gpa: '',
            });
            bil_sem++;
            listCECT.push({
              bil_sem: item.std_semester + '.' + bil_sem,
              ccode: '<span class="text-uppercase">' + itemJ.crsCode + "</span>",
              cname: '<span class="text-uppercase">' + itemJ.crs_name + "</span>",
              attemp: itemJ.rsb_type,
              credit: itemJ.crs_credit,
              grade: gradeStdFinalCheck + info,
              gpa: pointStdFinalCheck,
            });
    
          } else {
            bil_sem++;
            listCECT.push({
              bil_sem: item.std_semester + '.' + bil_sem,
              ccode: '<span class="text-uppercase">' + itemJ.crsCode + "</span>",
              cname: '<span class="text-uppercase">' + itemJ.crs_name + "</span>",
              attemp: itemJ.rsb_type,
              credit: itemJ.crs_credit,
              grade: gradeStdFinalCheck + info,
              gpa: pointStdFinalCheck,
            });
          }

          if (obj_regCrs.data.length == (j + 1)) {
            findStd = listCummulativeBySem.find(el => el.acaCalStd == item.fk_acaCal);

         
            if (findStd) {
              listCECT.push({
                bil_sem: item.std_semester + '.' + (bil_sem++),
                ccode: '',
                cname: '<b>CREDIT EARNED<br>CUMULATIVE CREDIT</b>',
                attemp: '',
                credit: findStd.creditEachSem + '<br>' + findStd.creditCummative,
                grade: '<b>GPA<br>CGPA</b>',
                gpa: '<b>' + gpa + '</b><br><b>' + cgpa + '</b>',
              });

              listCECT.push({
                bil_sem: item.std_semester + '.' + (bil_sem++),
                ccode: '',
                cname: '',
                attemp: '',
                credit: '',
                grade: '',
                gpa: '',
              });
            }


          }

        });


      });

    });

  });

  setTimeout(() => {
    listCECT.sort(compareBySemester);
    $("#testtable").on('footable_initialized', function () {
      generatePDFTranscript('Transcript', 'testtable');
    });


    $("#testtable").footable({
      "columns": columns,
      "rows": listCECT,
      "paging": {
        "enabled": false,
        "size": 10
      },
      "filtering": {
        "enabled": false,
        "placeholder": "Search...",
        "dropdownTitle": "Search for:"
      }

    });

    generatePDFTranscript('Transcript', 'testtable');

  }, Math.random() * 2000);

});

function generatePDFTranscript(name, idTable) {
  window.jsPDF = window.jspdf.jsPDF;
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
  doc.addImage("images/logo_reporting.png", "JPEG", xCoordinate, 5, newWidth, newHeight);

  doc.setFont("helvetica", "bold");
  var textCenterX = doc.internal.pageSize.width / 2;
  doc.setFontSize(10); // Set the font size to 14
  doc.text('ACADEMIC TRANSCRIPT', textCenterX, 40, { align: "center" });

  studName = $("#sti_name_upt").val();
  studID = $("#ATstudID").html();
  studGender = $("#ATgender").html();
  studProg = $("#ATProgram").html();

  studNationality = $("#ATnationality").html();
  studYearStart = $("#ATyearStart").html();
  // studYearEnd = $("#ATProgram").html();
  studIC = $("#ATic").html();
  maxSenate = $("#ATyearEnd").html();
  studSenate = $("#ATSenate").html();

  doc.setFontSize(6);

  doc.text('NAME', 10, 50);
  doc.text(':', 26, 50);
  doc.text(studName, 30, 50);

  doc.text('MATRIC NUMBER', 105, 50);
  doc.text(':', 127, 50);
  doc.text(studID, 131, 50);

  doc.text('GENDER', 10, 53);
  doc.text(':', 26, 53);
  doc.text(studGender, 30, 53);

  doc.text('PROGRAMME', 105, 53);
  doc.text(':', 127, 53);
  doc.text(studProg, 131, 53);

  doc.text('NATIONALITY', 10, 56);
  doc.text(':', 26, 56);
  doc.text(studNationality, 30, 56);

  doc.text('YEAR ENROLLED', 105, 56);
  doc.text(':', 127, 56);
  doc.text(studYearStart, 131, 56);

  doc.text('IC/PASSPORT', 10, 59);
  doc.text(':', 26, 59);
  doc.text(studIC, 30, 59);

  doc.text('YEAR COMPLETED', 105, 59);
  doc.text(':', 127, 59);
  doc.text(maxSenate, 131, 59);

  doc.setLineWidth(0.1);
  doc.line(10, 63, 200, 63); // horizontal line

  var source = $('#' + idTable)[0];

  var rows = source.getElementsByTagName('tr');
  var rowCount = rows.length;
  // max line =33
  if (rowCount > 33) {
    var maxRowsPerColumn = Math.ceil(rowCount / 2); // Split rows into two columns
    ;

    var firstColumnHtml = extractTableData(0, maxRowsPerColumn);
    var secondColumnHtml = extractTableData(maxRowsPerColumn, rowCount);
    // console.log(firstColumnHtml)
    // console.log(secondColumnHtml)
    var startY = 65; // Starting Y position for the first table

    // console.log($(firstColumnHtml)[0]);
    doc.autoTable({
      html: $(firstColumnHtml)[0],
      startY: startY,
      margin: { left: 10, top: 15, right: 105 },
      theme: 'grid',
      styles: { fontSize: 5, fillColor: false, textColor: 0, lineWidth: 0, cellPadding: 1 }, // Add lineWidth for border
      headStyles: { fontStyle: 'bold' }, // Bold and border for header

      // head: [
      //   [{content: 'Perincian Jumlah Bayaran', colSpan: $(firstColumnHtml)[0].length, styles: {halign: 'center'}}] // Merge all cells in the head
      // ],
    });

    doc.autoTable({
      html: $(secondColumnHtml)[0],
      startY: startY,
      margin: { left: 110, top: 15, right: 10 },
      theme: 'grid',
      styles: { fontSize: 5, fillColor: false, textColor: 0, lineWidth: 0, cellPadding: 1 }, // Add lineWidth for border
      headStyles: { fontStyle: 'bold', fillColor: '#9c4298', textColor: 255, lineWidth: 0.1 }, // Bold and border for header
    });

  }

  else {

    var firstColumnHtml = extractTableData(0, rowCount);
    var startY = 65;

    doc.autoTable({
      html: $(firstColumnHtml)[0],
      startY: startY,
      margin: { left: 10, top: 15, right: 105 },
      theme: 'grid',
      styles: { fontSize: 5, fillColor: false, textColor: 0, lineWidth: 0 }, // Add lineWidth for border
      headStyles: { fontStyle: 'bold' }, // Bold and border for header

      // head: [
      //   [{content: 'Perincian Jumlah Bayaran', colSpan: $(firstColumnHtml)[0].length, styles: {halign: 'center'}}] // Merge all cells in the head
      // ],
    });
  }

  function extractTableData(startRow, endRow) {
    var tableHtml = '<table>';
    // tableHtml += rows[0].outerHTML; // Add header row
    for (var row = startRow; row < endRow; row++) {
      let rowStr = '';
      if (row == 0) {
        rowStr = rows[row].outerHTML.replace('table-cell;">', 'table-cell;"><b>').replace('</th>', '</b></th>');
        // rowStr = rows[row];
      } else {
        rowStr = rows[row].outerHTML;
      }

      tableHtml += rowStr;
      // tableHtml2 += rows[row].outerHTML;
    }
    tableHtml += '</table>';
    return tableHtml;
  }

  var text1 =
    ' \n' +
    'Total Credit Earned                    \n' +
    'Total Credit Transfer             \n' +
    // 'Grand Total Credit  \n' +
    'Cumulative Grade Point Average  \n' +
    ' \n';

  var doubledot =
    ' \n' +
    ': \n' +
    ': \n' +
    ': \n' +
    // ': \n' +
    ' \n';

  TotalCreditEarned = $("#ATtce").html();
  TotalCreditTransfer = $("#ATtct").html();
  // GrandTotalCredit = $("#ATgtc").html();
  CumulativeGradePointAverage = $("#ATcgpa").html();

  var studentCredit =
    ' \n' +
    TotalCreditEarned + ' \n' +
    TotalCreditTransfer + ' \n' +
    // GrandTotalCredit + ' \n' +
    CumulativeGradePointAverage + ' \n' +
    ' \n';

  var text2 = 'The above student has fulfilled all the requirements to be awarded\n' +
    'with ' + studProg + '\n' +
    ' \n' +
    'Endorsed by Senate on ' + studSenate + '\n';

  var registrar = '_________________________________________\n' +
    '                        REGISTRAR\n' +
    ' \n' +
    ' \n';

  var textYPosition = Math.max(doc.autoTable.previous.finalY, doc.autoTable.previous.finalY) + 5;

  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text(text1, 110, textYPosition);
  doc.text(doubledot, 160, textYPosition);
  doc.text(studentCredit, 170, textYPosition);

  doc.setFont("helvetica", "normal");
  doc.text(text2, 110, textYPosition + 15);
  doc.text(registrar, 20, textYPosition + 40);

  doc.save(studID + '_' + name + '.pdf');
}









function listCTEBySession(stdID, acaSession, sessionType) {

  let form_listCTEBySession = new FormData();
  form_listCTEBySession.append("std_studentid", stdID);
  form_listCTEBySession.append("aca_session", acaSession);

  obj_listCTEBySession = new post(host + 'api_pengurusan_pelajar/public/misStdRegsub/cteListByCourseAcacal', form_listCTEBySession, 'picoms ' + window.sessionStorage.token).execute();
  if (obj_listCTEBySession.success) {
    // console.log(obj_listCTEBySession.data.length);
    $("#countCourseCTE").html(obj_listCTEBySession.data.length);
    $("#titleSessionCTE").html(sessionType);

    let columns = [
      { "name": "bil", "title": "NO.", "classes": "text-center" },
      // { "name": "bil_sem", "title": "SEM" },
      { "name": "crs_name", "title": "COURSE NAME", "classes": "text-center" },
      { "name": "attempCTE", "title": "CTE CHECKED", "breakpoints": " sm xs", "classes": "text-center" },
      { "name": "statusCTE", "title": "STATUS", "breakpoints": " sm xs", "classes": "text-center" },

    ];

    let bil = 1;
    let list = [];

    $.each(obj_listCTEBySession.data, function (i, field) {


      console.log(field.pk_cte_feedback);
      AttemptCTE = (field.pk_cte_feedback !== null) ? `<i class="fa fa-check text-success"></i>` : `<i class="fa fa-times text-danger inline"></i>`;
      statusCTE = (field.pk_cte_feedback !== null) ? `<span class="label warning">SUBMITTED</span>` : `<span class="label success">NOT SUBMITTED</span>`;


      list.push({
        bil: bil++,

        crs_name: "<b>" + field.crs_code + "-" + field.crs_name + "</b>",
        attempCTE: `<p class="text-center">` + AttemptCTE + `</p>`,

        statusCTE: statusCTE,
        //   sti_icno: field.sti_icno,
        //   pgm_name: field.pgm_name,
        //   status:
        //     `<span class='label rounded ` +
        //     colors +
        //     `'>` +
        //     field.sts_status_name_en +
        //     `</span>`,
        //   upt_btn:
        //     '<button class="btn btn-icon m-b-1" title="Update" onclick="loadData(\'' +
        //     i +
        //     '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="fa fa-bars"></i></button>' +
        //     '<button class="btn btn-link text-danger m-b-1" onclick="del(\'' +
        //     field.std_studentid +
        //     '\')" title="Remove"><i class="fa fa-times"></i>',
      });
    });
    $("#cteListBySession").html("");
    $("#cteListBySession").footable({
      columns: columns,
      rows: list,
      paging: {
        enabled: true,
        size: 10,
        countFormat: "Showing {PF} to {PL} of {TR} data",
      },
      // filtering: {
      //   enabled: true,
      //   placeholder: "Search...",
      //   dropdownTitle: "Search for:",
      // },
    });


  } else {

  }

}