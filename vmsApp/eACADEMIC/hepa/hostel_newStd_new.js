$(function () {
  $.ajaxSetup({
    cache: false,
  });

  let userRole = window.sessionStorage.userRole;
  var reloading = sessionStorage.getItem("reloading");
  var currentPage = sessionStorage.getItem("currentPage");
  // $("[data-page="+sessionStorage.getItem("currentPage")+"]").trigger('click');
  // select Branch
  campusList(function () {
    $("#branch_id").append('<option value="">- Choose -</option>');
    $("#upt_branch_id").append('<option value="">- Choose -</option>');
    $.each(obj_college.data, function (i, item) {
      $("#branch_id").append(
        '<option value="' + item.pk_id + '">' + item.clg_name + "</option>"
      );
      $("#upt_branch_id").append(
        '<option value="' + item.pk_id + '">' + item.clg_name + "</option>"
      );
    });
  });

  // list student status==Registered
  stdRegList(function () {
    var colums = [
      { name: "bil", title: "No." },
      { name: "campus_id", title: "Campus" },
      { name: "stud_id", title: "Student" },
      { name: "sti_icno", title: "IC No.", breakpoints: "md sm xs" },
      { name: "sti_gender", title: "Gender", breakpoints: "md sm xs" },
      { name: "statusChkInOut", title: "Status", breakpoints: "md sm xs" },
      { name: "sts_aca", title: "Status Academic", breakpoints: "md sm xs" },
      // { name: "reason", title: "Reason", breakpoints: "md sm xs" },
      { name: "upt_btn", title: "Action", breakpoints: "md sm xs" },
    ];

    let bil = 1;
    let convertList = JSON.stringify(obj_stdInfo.data);
    console.log(obj_stdInfo.data);
    $("#dataStdList").val(convertList);
    var list = [];

    $.each(obj_stdInfo.data, function (i, field) {
      // console.log(field);

      //checking bgi status check out check in xmasuk dlm
      if (
        field.checkIn_status != "Check Out" &&
        field.checkIn_status != "Check In"
      ) {
        let stdId = field.std_studentid;
        // let blokGndr = field.sti_gender_name;
        let icnum = field.sti_icno;
        let getValic = icnum.slice(-1);

        if (field.sti_gender_name != null) {
          blokGndr = field.sti_gender_name;
        } else {
          if (getValic % 2 == 0) {
            blokGndr = "Female";
          } else {
            blokGndr = "Male";
          }
        }

        let label = "";
        if (blokGndr == "Male") {
          label = '<span class="label blue">' + blokGndr + "</span>";
        } else if (blokGndr == "Female") {
          label = '<span class="label pink">' + blokGndr + "</span>";
        }

        let lblChkIn = "";
        if (field.room_id != null) {
          label_status =
            // '<span class="label Success">' + field.checkIn_status + "</span>";
            '<span class="label success">Assigned</span>';
          button_display =
            '<button class="btn btn-icon success btnEdit_' +
            stdId +
            '" title="Update" onclick="loadData(\'' +
            i +
            '\')" ><i class="ion-android-create"></i></button> ' +
            '<button id="' +
            field.chkInOut_id +
            '" class="btn btn-icon danger btnEdit_' +
            field.std_studentid +
            '" title="Delete" onclick="delData(\'' +
            field.std_studentid +
            "'," +
            field.chkInOut_id +
            ')" ><i class="ion-trash-a"></i></button>';
        } else {

          if (field.checkIn_status == "Unreside") {
            label_status = '<span class="label warning">Unreside</span>';
            button_display =
              '<button class="btn btn-icon success btnEdit_' +
              stdId +
              '" title="Update" onclick="loadData(\'' +
              i +
              '\')" ><i class="ion-android-create"></i></button> ' +
              '<button id="' +
              field.chkInOut_id +
              '" class="btn btn-icon danger btnEdit_' +
              field.std_studentid +
              '" title="Delete" onclick="delData(\'' +
              field.std_studentid +
              "'," +
              field.chkInOut_id +
              ')" ><i class="ion-trash-a"></i></button>';
          } else {
            label_status = '<span class="label info">New</span>';
            button_display =
              '<button class="btn btn-icon info" title="Assign Hostel" onclick="assignHstl(\'' +
              i +
              '\')" id="btnAdd_' +
              stdId +
              '"><i class="ion-plus"></i></button> ';
          }
        }

        list.push({
          id: stdId,
          bil: bil++,
          campus_id:
            '<span class="text-uppercase">' + field.clg_name + "</span>",
          stud_id:
            '<span class="text-uppercase"><b>' +
            stdId +
            "</b><br>" +
            field.sti_name +
            "</span>",
          sti_icno: field.sti_icno,
          sti_gender: label,
          statusChkInOut: label_status,
          sts_aca: field.sts_status_name_en,
          // reason: field.reason,
          upt_btn: button_display,
        });
      }
    });

    $("#regStdList").html("");
    $("#regStdList").footable({
      columns: colums,
      rows: list,
      paging: {
        enabled: true,
        countFormat: "Showing {PF} to {PL} of {TR} data",
      },
      filtering: {
        enabled: true,
        placeholder: "Search...",
        dropdownTitle: "Search for:",
      },
    });
    $("#regStdList")
      .find('.footable-filtering-search input[type="text"]')
      .addClass("afiez-input");

    $(".afiez-input").on("change", function () {
      valInput = $(this).val();
      // alert(valInput);
    });
    $('.pagination').on('click', '.footable-page-link', function (e) {
      e.preventDefault();
      const page = $(this).parent().data('page');
      sessionStorage.setItem("currentPage", page);


      // alert(page);
    });
    if (reloading) {
      loadData(reloading)
    }
    if (currentPage) {
      setTimeout(function () {
        $("li.footable-page[data-page='" + currentPage + "'] .footable-page-link").trigger('click');
      }, 100); // Delay to ensure table is fully initialized
    }

  });




  // initializeTabsle();



});
var confirmed = false;






listAssigned();
listStdUnreside();

$("#formFilterHostelDet").submit(function (e) {
  e.preventDefault(); // Prevent the default form submission
  listAssigned();
});

$("#formFilterUnreside").submit(function (e) {
  e.preventDefault(); // Prevent the default form submission
  listStdUnreside();
});
function assignHstl(index) {
  window.sessionStorage.indexstud = index;
  let data = JSON.parse($("#dataStdList").val());
  data = data[index];
  let now = new Date();
  let day = ("0" + now.getDate()).slice(-2);
  let month = ("0" + (now.getMonth() + 1)).slice(-2);
  let today = now.getFullYear() + "-" + month + "-" + day;

  let icnum = data.sti_icno;
  let getValic = icnum.slice(-1);

  if (data.sti_gender_name !== null) {
    genderLabel = data.sti_gender_name;
  } else {
    if (getValic % 2 == 0) {
      genderLabel = "Female";
    } else {
      genderLabel = "Male";
    }
  }

  $("#clg_name").val(data.clg_name);
  $("#std_studentid").val(data.std_studentid);
  $("#sti_name").val(data.sti_name);
  $("#sti_icno").val(data.sti_icno);
  $("#sti_gender_name").val(genderLabel);
  $(".formInput").val("");
  $("#expected_chkInDate").val(today);

  $("#addForm").modal("show");
}

indexstud = window.sessionStorage.indexstud;

// document.addEventListener("DOMContentLoaded", function() {
//   const deleteButton = document.getElementById("deleteButton");
deleteButton.addEventListener("click", function () {
  // Retrieve the indexstud value from sessionStorage
  const indexstud = window.sessionStorage.indexstud;

  // Verify the value in the console

  // Call the unresideHstl function with the retrieved indexstud value
  unresideHstl(indexstud);
});
// });

function unresideHstl(indexstud) {
  let data = JSON.parse($("#dataStdList").val());

  data = data[indexstud];
  let now = new Date();

  let day = ("0" + now.getDate()).slice(-2);
  let month = ("0" + (now.getMonth() + 1)).slice(-2);
  let today = now.getFullYear() + "-" + month + "-" + day;

  let icnum = data.sti_icno;
  let getValic = icnum.slice(-1);

  if (getValic % 2 == 0) {
    blokGndr = "Female";
  } else {
    blokGndr = "Male";
  }

  $("#del_clg_name").val(data.clg_name);
  $("#del_std_studentid").val(data.std_studentid);
  $("#del_sti_name").val(data.sti_name);
  $("#del_sti_icno").val(data.sti_icno);
  $("#del_sti_gender_name").val(blokGndr);
  // $(".formInput").val("");
  // $("#del_expected_chkInDate").val(today);

  // $("#DeleteForm").modal("show");
}

//-------------------------------------------------- change select Branch --------------------------------------------------//
$("#branch_id").change(function () {
  let branchId = $("#branch_id").val();

  hstlClgList(branchId, function () {
    $("#hostel_id").html("");
    $("#block_id").html("");
    $("#room_id").html("");
    $("#hostel_id").append('<option value="">- Choose -</option>');
    $.each(obj_hstlList.data, function (i, item) {
      $("#hostel_id").append(
        '<option value="' +
        item.hostel_id +
        '">' +
        item.hostel_name.toUpperCase() +
        "</option>"
      );
    });
  });
});

$("#upt_branch_id").change(function () {
  let branchId = $("#upt_branch_id").val();

  hstlClgList(branchId, function () {
    $("#upt_hostel_id").html("");
    $("#upt_block_id").html("");
    $("#upt_room_id").html("");
    $("#upt_hostel_id").append('<option value="">- Choose -</option>');
    $.each(obj_hstlList.data, function (i, item) {
      $("#upt_hostel_id").append(
        '<option value="' +
        item.hostel_id +
        '">' +
        item.hostel_name.toUpperCase() +
        "</option>"
      );
    });
  });
});
//-------------------------------------------------- end change select Branch --------------------------------------------------//

//-------------------------------------------------- change select Hostel --------------------------------------------------//
$("#hostel_id").change(function () {
  let hostelId = $("#hostel_id").val();
  let stdIcNo = $("#sti_icno").val();
  let getVal = stdIcNo.slice(-1);
  let gender = "";
  let genderHTML = $("#sti_gender_name").val();
  if (getVal % 2 == 0) {
    gender = "Female";
  } else {
    gender = "Male";
  }

  $("#block_id").html("");
  $("#room_id").html("");

  listBlckHstlGndr(hostelId, genderHTML, function () {
    $("#block_id").append('<option value="">- Choose -</option>');
    $.each(obj_block.data, function (i, item) {
      $("#block_id").append(
        '<option value="' +
        item.block_id +
        '">' +
        item.block_name.toUpperCase() +
        "</option>"
      );
    });
  });
});

$("#upt_hostel_id").change(function () {
  let hostelId = $("#upt_hostel_id").val();
  let stdIcNo = $("#upt_sti_icno").val();
  let genderOri = $("#upt_sti_gender_name").val();
  let getVal = stdIcNo.slice(-1);
  let gender = "";

  if (getVal % 2 == 0) {
    gender = "Female";
  } else {
    gender = "Male";
  }

  $("#upt_block_id").html("");
  $("#upt_room_id").html("");

  listBlckHstlGndr(hostelId, genderOri, function () {
    $("#upt_block_id").append('<option value="">- Choose -</option>');
    $.each(obj_block.data, function (i, item) {
      $("#upt_block_id").append(
        '<option value="' +
        item.block_id +
        '">' +
        item.block_name.toUpperCase() +
        "</option>"
      );
    });
  });
});
//-------------------------------------------------- end change select Hostel --------------------------------------------------//

//-------------------------------------------------- change select Block --------------------------------------------------//
$("#block_id").change(function () {
  let blockId = $("#block_id").val();

  roomList2(blockId, function () {
    $("#room_id").html("");
    $("#room_id").append('<option value="">- Choose -</option>');
    $.each(obj_roomList.data, function (i, item) {
      totalBedAvailable = parseInt(item.total_bed) - item.total_occupied;
      $("#room_id").append(
        '<option value="' +
        item.room_id +
        '" totalBed="' +
        item.total_bed +
        '">' +
        item.room_no.toUpperCase() +
        ` (` +
        totalBedAvailable +
        " Kosong) </option>"
      );
    });
  });
});

$("#upt_block_id").change(function () {
  let blockId = $("#upt_block_id").val();
  roomList2(blockId, function () {
    $("#upt_room_id").html("");
    $("#upt_room_id").append('<option value="">- Choose -</option>');
    $.each(obj_roomList.data, function (i, item) {
      totalBedAvailable = parseInt(item.total_bed) - item.total_occupied;

      $("#upt_room_id").append(
        '<option value="' +
        item.room_id +
        '" totalBed="' +
        item.total_bed +
        '">' +
        item.room_no.toUpperCase() +
        ` (` +
        totalBedAvailable +
        " Kosong)</option>"
      );
    });
  });
});
//-------------------------------------------------- end change select Block --------------------------------------------------//

//-------------------------------------------------- change select Room --------------------------------------------------//
$("#room_id").change(function () {
  let roomId = $("#room_id").val();
  let totalBed = $(this).find("option:selected").attr("totalBed");

  countOccupied(roomId, function () {
    let occupied = obj_chkInOut.data.length;
    if (occupied >= totalBed) {
      swal({
        text: "The Room is Full.",
        type: "info",
      });
      $("#room_id").val("");
    }
  });
});

$("#upt_room_id").change(function () {
  let roomId = $("#upt_room_id").val();
  let totalBed = $(this).find("option:selected").attr("totalBed");

  countOccupied(roomId, function () {
    let occupied = obj_chkInOut.data.length;
    if (occupied >= totalBed) {
      swal({
        text: "The Room is Full.",
        type: "info",
      });
      $("#room_id").val("");
    }
  });
});
//-------------------------------------------------- end change select Room --------------------------------------------------//

//-------------------------------------------------- add assign hostel --------------------------------------------------//
$("#formAdd").on("submit", function (e) {
  if (!confirmed) {
    e.preventDefault();
    swal({
      title: "Assign Hostel Student",
      text: "Are You Sure?",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Save",
      confirmButtonColor: "#2196f3",
      closeOnConfirm: true,
      allowOutsideClick: false,
      html: false,
    }).then(function () {
      let stdId = $("#std_studentid").val();
      let campus_id = $("#branch_id").val();
      let hstl_id = $("#hostel_id").val();
      let blok_id = $("#block_id").val();
      let room_id = $("#room_id").val();
      let checkIn = $("#expected_chkInDate").val();

      var form = new FormData();
      form.append("stud_id", stdId);
      form.append("branch_id", campus_id);
      form.append("hostel_id", hstl_id);
      form.append("block_id", blok_id);
      form.append("room_id", room_id);
      form.append("checkIn", checkIn);
      form.append("checkIn_status", "New");
      form.append("recordstatus", "ADD");

      var settings = {
        url: host + "api_hep/public/hepHostelChkinout/register",
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

$("#deleteButton").on("click", function () {
  swal({
    title: "Delete Record",
    text: "Are you sure you want to delete this record?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    confirmButtonColor: "#d9534f",
    closeOnConfirm: true,
    allowOutsideClick: false,
    html: false,
  }).then(function () {
    let stdId = $("#std_studentid").val();
    // let campus_id = $("#del_branch_id").val();
    var form = new FormData();
    form.append("stud_id", stdId);
    form.append("reason", "Not Reside Hostel");
    form.append("checkIn_status", "Unreside");
    form.append("recordstatus", "ADD");

    var settings = {
      url: host + "api_hep/public/hepHostelChkinout/unreside",
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
});
//-------------------------------------------------- end add assign hostel --------------------------------------------------//

// $("#formDelete").on("submit", function (e) {
//   if (!confirmed) {
//     e.preventDefault();
//     swal({
//       title: "Student Not Reside Hostel",
//       text: "Are You Sure?",
//       type: "question",
//       showCancelButton: true,
//       confirmButtonText: "Save",
//       confirmButtonColor: "#2196f3",
//       closeOnConfirm: true,
//       allowOutsideClick: false,
//       html: false,
//     }).then(function () {

//     });
//   }
// });

//-------------------------------------------------- loadData assign hostel --------------------------------------------------//
function loadData(index) {
  let data = JSON.parse($("#dataStdList").val());
  data = data[index];
  sessionStorage.removeItem("reloading");


  let room_no = data.room_no;
  let stdId = data.std_studentid;
  let icNo = data.sti_icno;
  let chkInOutId = data.chkInOut_id;
  let branch = data.branch_id;
  let hostel = data.hostel_id;
  let block = data.block_id;
  let room = data.room_id;
  let tarikh = data.checkIn;
  let getVal = icNo.slice(-1);
  let gender = "";

  let checkIn_status = data.checkIn_status;
  $("#upt_checkIn_status").val(checkIn_status);

  let reason = data.reason;
  $("#upt_reason").val(reason);

  // if (getVal % 2 == 0) {
  //   gender = "Female";
  // } else {
  //   gender = "Male";
  // }
  if (data.sti_gender_name !== null) {
    genderLabel = data.sti_gender_name;
  } else {
    if (getVal % 2 == 0) {
      genderLabel = "Female";
    }
    // if (getValic % 2 == 0) {
    //   genderLabel = "Female";
    // }
    else {
      genderLabel = "Male";
    }
  }

  // data student
  $("#upt_clg_name").val(data.clg_name);
  $("#upt_std_studentid").val(stdId);
  $("#upt_sti_name").val(data.sti_name);
  $("#upt_sti_icno").val(icNo);
  // $("#upt_sti_gender_name").val(data.sti_gender_name);
  $("#upt_sti_gender_name").val(genderLabel);
  $("#upt_room_id").val(room);
  $(".formInput").val("");

  // data check in
  $("#chkInOutId").val(chkInOutId);
  $("#upt_expected_chkInDate").val(tarikh);
  $("#upt_branch_id").val(branch);

  hstlClgList(branch, function () {
    $("#upt_hostel_id").html("");
    $("#upt_hostel_id").append('<option value="">- Choose -</option>');
    $.each(obj_hstlList.data, function (i, item) {
      $("#upt_hostel_id").append(
        '<option value="' +
        item.hostel_id +
        '">' +
        item.hostel_name.toUpperCase() +
        "</option>"
      );
    });
    $("#upt_hostel_id").val(hostel);
  });

  listBlckHstlGndr(hostel, genderLabel, function () {
    $("#upt_block_id").html("");
    $("#upt_block_id").append('<option value="">- Choose -</option>');
    $.each(obj_block.data, function (i, item) {
      $("#upt_block_id").append(
        '<option value="' +
        item.block_id +
        '">' +
        item.block_name.toUpperCase() +
        "</option>"
      );
    });
    $("#upt_block_id").val(block);
  });

  roomData(room, function () {
    roomDt = obj_roomData.data;
    $("#upt_room_id").html("");
    $("#upt_room_id").append(
      '<option value="' +
      room +
      '" totalBed="' +
      roomDt.total_bed +
      '">' +
      roomDt.room_no.toUpperCase() +
      "</option>"
    );
  });

  roomList2(block, function () {
    // $("#upt_room_id").html("");
    $("#upt_room_id").append('<option value="">- Choose -</option>');
    $.each(obj_roomList.data, function (i, item) {
      totalBedAvailable = parseInt(item.total_bed) - item.total_occupied;

      $("#upt_room_id").append(
        '<option value="' +
        item.room_id +
        '" totalBed="' +
        item.total_bed +
        '">' +
        item.room_no.toUpperCase() +
        ` (` +
        totalBedAvailable +
        " Kosong)</option>"
      );
    });
    $("#upt_room_id").val(room);
  });
  $("#indexVal").val(index);

  $("#updateForm").modal("show");
}
//-------------------------------------------------- end loadData assign hostel --------------------------------------------------//

//-------------------------------------------------- update assign hostel --------------------------------------------------//
$("#formUpdate").on("submit", function (e) {
  if (!confirmed) {
    e.preventDefault();
    swal({
      title: "Update Hostel",
      text: "Are You Sure?",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Update",
      confirmButtonColor: "#22b66e",
      closeOnConfirm: true,
      allowOutsideClick: false,
      html: false,
    }).then(function () {
      let chkInOut_id = $("#chkInOutId").val();
      let campus_id = $("#upt_branch_id").val();
      let hstl_id = $("#upt_hostel_id").val();
      let blok_id = $("#upt_block_id").val();
      let room_id = $("#upt_room_id").val();
      let checkIn = $("#upt_expected_chkInDate").val();
      let checkIn_status1 = $("#upt_checkIn_status").val();
      let reason = $("#upt_reason").val();

      if (checkIn_status1 != "Unreside") {
        checkIn_status = checkIn_status1;
      } else {
        checkIn_status = "New";
      }

      var form = new FormData();
      form.append("chkInOut_id", chkInOut_id);
      form.append("branch_id", campus_id);
      form.append("hostel_id", hstl_id);
      form.append("block_id", blok_id);
      form.append("room_id", room_id);
      form.append("checkIn", checkIn);
      form.append("recordstatus", "EDT");

      form.append("reason", "");
      form.append("checkIn_status", checkIn_status);

      var settings = {
        url: host + "api_hep/public/hepHostelChkinout/update",
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

        sessionStorage.setItem("reloading", $('#indexVal').val());

        window.location.reload();
      });
    });
  }
});
//-------------------------------------------------- end update assign hostel --------------------------------------------------//
//-------------------------------------------------- delete assign hostel --------------------------------------------------//
function delData(stdId, chkInOut_id) {
  // let chkInOutId = $(".btnEdit_" + stdId).attr("id");
  let chkInOutId = chkInOut_id;

  var form = new FormData();
  form.append("recordstatus", "DEL");
  form.append("chkInOut_id", chkInOutId);

  swal({
    title: "Remove Assign Hostel",
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
      url: host + "api_hep/public/hepHostelChkinout/delete",
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
//-------------------------------------------------- end delete assign hostel --------------------------------------------------//

function listCheckIn(returnValue) {
  var settings = {
    url: host + "api_hep/public/hepHostelChkinout/list",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_checkIn = response;
    returnValue();
  });
}

function stdRegList(returnValue) {
  var settings = {
    url: host + "api_pengurusan_pelajar/public/misStdInfo/listStdReg",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_stdInfo = response;
    returnValue();
  });
}

function chkStdNotChkOut(id, returnValue) {
  var settings = {
    url: host + "api_hep/public/hepHostelChkinout/chkStdNotChkOut/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_chkInOut = response;
    returnValue();
  });
}

// listStdUnreside(function () {
// });

// listAssigned(function () {
// });

function listAssigned(returnValue) {
  let chkInOutDate = $("#chkInOutdate").val();

  let FK_status_Student = $("#FK_status_Student").val();
  let ChkInOutSelect = $("#ChkInOutSelect").val();

  var form = new FormData();
  // form.append("chkInOutMonth", chkInOutMonth);
  form.append("chkInOutDate", chkInOutDate);
  form.append("FK_status_Student", FK_status_Student);

  var settings = {
    url: host + "api_hep/public/hepHostelChkinout/list/AssignedAkaNewCheckIN",
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
    obj_stdAssigned = JSON.parse(response);

    var colums = [
      { name: "bil", title: "No.", style: "text-align:center;" },
      // { name: "stud_id", title: "Student" },
      { name: "roomDet", title: "Hostel Details", style: "text-align:center;" },
      {
        name: "nameStudent",
        title: "Name Student",
        breakpoints: "md sm xs",
        style: "text-align:center;",
      },
      // { name: "sti_icno", title: "IC No.", breakpoints: "md sm xs" },
      {
        name: "checkIn_status",
        title: "Status",
        breakpoints: "md sm xs",
        style: "text-align:center;",
      },
      {
        name: "sts_status_name_en",
        title: "Status Academic",
        breakpoints: "md sm xs",
        style: "text-align:center;",
      },
    ];

    let bil = 1;
    let convertList = JSON.stringify(obj_stdAssigned.data);
    $("#dataStdAssigned").val(convertList);
    var list = [];

    $.each(obj_stdAssigned.data, function (i, field) {
      if (field.checkIn_status == "New") {
        statusCheckIn = "Assigned";
      } else {
        statusCheckIn = field.checkIn_status;
      }

      let stdId = field.std_id;
      // let blokGndr = field.sti_gender_name;
      let icnum = field.sti_icno;

      list.push({
        id: stdId,
        bil: bil++,
        roomDet: '<span class="text-uppercase">' + field.clg_name + "</span>",
        nameStudent:
          '<span class="text-uppercase"><b>' +
          field.std_id +
          "</b><br>" +
          field.sti_name +
          "</span>",
        // sti_icno: field.sti_icno,
        checkIn_status: statusCheckIn,
        sts_status_name_en: field.sts_status_name_en,
        // statusChkInOut: label_status,
        // reason: field.reason,
      });
    });

    $("#report_AssignedHostel").html("");
    $("#report_AssignedHostel").footable({
      columns: colums,
      rows: list,
      paging: {
        enabled: true,
        countFormat: "Showing {PF} to {PL} of {TR} data",
      },
      filtering: {
        enabled: false,
        placeholder: "Search...",
        dropdownTitle: "Search for:",
      },
    });

    $("#report_AssignedHostelPDF").html("");
    $("#report_AssignedHostelPDF").footable({
      columns: colums,
      rows: list,
      paging: {
        enabled: false,
      },
    });
    $("#report_AssignedHostelPDF").css("display", "none");

    returnValue();
  });
}

function listStdUnreside(returnValue) {
  let date = $("#chkInOutdateUnreside").val();
  var form = new FormData();
  // form.append("chkInOutMonth", chkInOutMonth);
  form.append("lastupdateon", date);

  var settings = {
    url: host + "api_pengurusan_pelajar/public/misStdInfo/listStdUnreside",
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
    // obj_stdUnreside = response;
    obj_stdUnreside = JSON.parse(response);

    var colums = [
      { name: "bil", title: "No.", style: "text-align:center;" },
      { name: "campus_id", title: "Campus", style: "text-align:center;" },
      { name: "stud_id", title: "Student", style: "text-align:center;" },
      {
        name: "sti_icno",
        title: "IC No.",
        breakpoints: "md sm xs",
        style: "text-align:center;",
      },
      {
        name: "sti_gender",
        title: "Gender",
        breakpoints: "md sm xs",
        style: "text-align:center;",
      },
      {
        name: "last_update",
        title: "Date",
        breakpoints: "md sm xs",
        style: "text-align:center;",
      },
    ];

    let bil = 1;
    let convertList = JSON.stringify(obj_stdUnreside.data);
    $("#dataStdList2").val(convertList);
    var list = [];
    // console.log(obj_stdUnreside.data);
    $.each(obj_stdUnreside.data, function (i, field) {
      //checking bgi status check out check in xmasuk dlm
      if (
        field.checkIn_status != "Check Out" &&
        field.checkIn_status != "Check In"
      ) {
        let stdId = field.std_studentid;
        // let blokGndr = field.sti_gender_name;
        let icnum = field.sti_icno;
        let getValic = icnum.slice(-1);

        // if (getValic % 2 == 0) {
        //   blokGndr = "Female";
        // } else {
        //   blokGndr = "Male";
        // }

        if (field.sti_gender_name != null) {
          blokGndr = field.sti_gender_name;
        } else {
          if (getValic % 2 == 0) {
            blokGndr = "Female";
          } else {
            blokGndr = "Male";
          }
        }
        var myDate = new Date(field.lastupdateon);

        let label = "";
        if (blokGndr == "Male") {
          label = '<span class="label blue">' + blokGndr + "</span>";
        } else if (blokGndr == "Female") {
          label = '<span class="label pink">' + blokGndr + "</span>";
        }

        label_status = '<span class="label warning">Unreside</span>';

        list.push({
          id: stdId,
          bil: bil++,
          campus_id:
            '<span class="text-uppercase">' + field.clg_name + "</span>",
          stud_id:
            '<span class="text-uppercase"><b>' +
            stdId +
            "</b><br>" +
            field.sti_name +
            "</span>",
          sti_icno: field.sti_icno,
          sti_gender: label,
          last_update:
            myDate.getDate() +
            "/" +
            (myDate.getMonth() + 1) +
            "/" +
            myDate.getFullYear(),
          // statusChkInOut: label_status,
          // reason: field.reason,
        });
      }
    });

    $("#report_UnresideHostel").html("");
    $("#report_UnresideHostel").footable({
      columns: colums,
      rows: list,
      paging: {
        enabled: true,
        countFormat: "Showing {PF} to {PL} of {TR} data",
      },
      filtering: {
        enabled: false,
        placeholder: "Search...",
        dropdownTitle: "Search for:",
      },
    });

    returnValue();
  });
}
