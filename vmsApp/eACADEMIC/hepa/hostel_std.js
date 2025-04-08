let usrRole = window.sessionStorage.usrRole;
let catAdmin = window.sessionStorage.usrCatEadmin;
let catCMS = window.sessionStorage.usrCatEcmis;

$(function () {
  $.ajaxSetup({
    cache: false,
  });

  $.fn.select2.defaults.set("theme", "bootstrap");

  let pk_hostel = window.sessionStorage.pk_hostel;

  hstlShow(pk_hostel, function () {
    $.each(obj_hostel.data, function (i, item) {
      let label = "";
      if (item.hostel_status == "Active") {
        label = '<span class="label success">' + item.hostel_status + "</span>";
      } else if (item.hostel_status == "In-active") {
        label = '<span class="label warning">' + item.hostel_status + "</span>";
      }

      $("#hstl_campus").html(item.clg_name);
      $("#hstl_name").html(item.hostel_name);
      $("#hstl_warden").html(item.emp_name);
      $("#warden_no").html(item.hostel_wardenNo);
      $("#hstl_status").html(label);
    });
  });

  blockList(pk_hostel, function () {
    $.each(obj_block.data, function (i, item) {
      let blockStts = item.block_status;
      let sttsColor = "";
      if (blockStts == "Active") {
        sttsColor = "success";
      } else if (blockStts == "In-active") {
        sttsColor = "warning";
      }

      let blockGndr = item.block_gender;
      let gndrColor = "";
      if (blockGndr == "Male") {
        gndrColor = "blue";
      } else if (blockGndr == "Female") {
        gndrColor = "pink";
      }

      // create box for Block List
      let divBoxItem =
        '<li class="nav-item">' +
        '<a href="#" class="nav-link auto">' +
        '<span class="pull-right text-muted m-r-xs">' +
        '<i class="fa fa-plus inline"></i>' +
        '<i class="fa fa-minus none"></i>' +
        "</span>" +
        '<span class="text-uppercase font-weight-bold">' +
        item.block_name +
        "</span>" +
        '<span class="label m-l-2 ' +
        gndrColor +
        '">' +
        blockGndr +
        "</span>" +
        '<span class="label m-l-1 ' +
        sttsColor +
        '">' +
        blockStts +
        "</span>" +
        "</a>" +
        '<ul class="nav nav-sub text-sm">' +
        '<div class="row m-a-2">' +
        '<textarea class="hidden" id="dataList_' +
        item.block_id +
        '"></textarea>' +
        '<div class="table-responsive"><table class="table table-striped m-b-none" id="tblItem_' +
        item.block_id +
        '"></table> </div>' +
        "</div>" +
        "</ul>" +
        "</li>";

      $("#divBox").append(divBoxItem);

      // room list
      roomByBlock(item.block_id, function () {
        createTable(obj_room.data, item.block_id);
      });
    });
  });
});
var confirmed = false;

// btn Back to admin page
$("#btnBack").click(function () {
  window.location.replace("hepaPage.html");
  window.sessionStorage.removeItem("pk_hostel");
});

//-------------------------------------------------- modal student List --------------------------------------------------//

function loadData(index, blck_id) {
  let data = JSON.parse($("#dataList_" + blck_id).val());
  data = data[index];

  btnHideWarden = (wardenAccess == 1) ? 'hidden' : '';
  let roomStts = data.room_status;
  let sttsColor = "";
  if (roomStts == "Active") {
    sttsColor = '<span class="label m-l-1 success">' + roomStts + "</span>";
  } else if (roomStts == "In-active") {
    sttsColor = '<span class="label m-l-1 warning">' + roomStts + "</span>";
  }

  let block_gndr = data.block_gender;
  let gndrColor = "";
  if (block_gndr == "Male") {
    gndrColor = '<span class="label m-l-1 blue">' + block_gndr + "</span>";
  } else if (block_gndr == "Female") {
    gndrColor = '<span class="label m-l-1 pink">' + block_gndr + "</span>";
  }

  $("#view_campus").html(data.clg_name);
  $("#view_hostel").html(data.hostel_name);
  $("#view_block").html(data.block_name);
  $("#view_room").html(data.room_no);
  $("#view_gender").html(gndrColor);
  $("#view_student").html(data.clg_name);
  $("#view_capacity").html(data.total_bed);
  $("#view_status").html(sttsColor);

  countOccupied(data.room_id, function () {
    $("#view_student").html(obj_chkInOut.data.length);

    var columns = [
      { name: "bil", title: "No." },
      { name: "student", title: "Student" },
      { name: "icNo", title: "IC No." },
      { name: "phoneNo", title: "Phone No.", breakpoints: "md sm xs" },
      { name: "chkInDate", title: "Check In Date", breakpoints: "md sm xs" },
      //   { name: "chkOutDate", title: "Check Out Date", breakpoints: "md sm xs" },
      { name: "ChkOutBtn", title: "Action", breakpoints: "md sm xs" },
    ];

    var list = [];
    let bil = 1;
    let convertList = JSON.stringify(obj_chkInOut.data);
    $("#dataChkInOutList").val(convertList);
    // console.log(obj_chkInOut.data);
    // console.log(data.room_id);

    $.each(obj_chkInOut.data, function (i, item) {
      var sti_name = item.sti_name;
      // if(sti_name.indexOf(`'`)>=0){
      //   sti_name = sti_name.replace(`'`,`namaPelik`);
      // }

      // first check utk handle klau ada nama null
      if (sti_name === null) {
        sti_name = '-';
    } else if (sti_name.indexOf(`'`) >= 0) {
      // 2nd check utk handle nama ada -> '
        sti_name = sti_name.replace(`'`, `namaPelik`);
    }
      list.push({
        bil: bil++,
        student:
          '<span class="text-uppercase"><b>' +
          item.stud_id +
          "</b><br>" +
          item.sti_name +
          "</span>",
        icNo: item.sti_icno,
        phoneNo: item.sti_contactno_mobile,
        chkInDate: formatDate(item.checkIn),
        // chkOutDate: formatDate(item.checkOut),
        ChkOutBtn:
          //   '<button class="btn btn-icon success" title="Check Out" onclick="detail(' + item.chkInOut_id +","+ item.stud_id  +"," + item.sti_name +","+i + ')"><i class="ion-log-out"></i></button> ',
          `<button ${btnHideWarden} class="btn btn-icon success" title="Check Out" onclick="detail(` +
          item.chkInOut_id +
          `,'` +
          item.stud_id +
          `','` +
          sti_name +
          `',` +
          i +
          `,` +
          index +
          `,` +
          blck_id +
          `)"><i class="ion-log-out"></i></button> `,
        // '<button class="btn btn-icon success" title="Check Out" onclick="detail(' + item.chkInOut_id + ",'" + item.stud_id + "','" + item.sti_name + "','" + i + ')"><i class="ion-log-out"></i></button> '
      });
    });

    $("#tblStdList").html("");
    $("#tblStdList").footable({
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

  // $("#modalListStd").modal("show");
  setTimeout(function () {
    $("#modalListStd").modal("show");
  }, 1500); 
  //tmbah delay sbab nda bleh scroll modal nie
}
//-------------------------------------------------- *end modal student List --------------------------------------------------//

//-------------------------------------------------- table Room List --------------------------------------------------//
function createTable(data, blck_id) {
  var columns = [
    { name: "bil", title: "No." },
    { name: "room_no", title: "Room No." },
    { name: "total_bed", title: "Total of Bed" },
    { name: "occupied_status", title: "Occupied Status" },
    { name: "room_status", title: "Status" },
    { name: "room_remark", title: "Remark" },
    {
      name: "upt_btn",
      title: "Action",
      class: "text-center",
      breakpoints: "md sm xs",
    },
  ];

  var list = [];
  let bil = 1;
  let convertDetList = JSON.stringify(data);

  //Amri
  $("#dataList_" + blck_id).val(convertDetList);

  $.each(data, function (i, field) {
    let roomId = field.room_id;
    let count = 0;

    let obj_chkInOut = new get(host+"api_hep/public/hepHostelChkinout/countChkIn/"+roomId,'PICOMS ' + window.sessionStorage.token).execute(); 
    if(obj_chkInOut.success){
      
      count = obj_chkInOut.data.length;

      list.push({
        bil: bil++,
        room_no: '<span class="text-uppercase">' + field.room_no + "</span>",
        total_bed: field.total_bed,
        occupied_status: '<span id="occStts_' + roomId + '">'+count+'</span>',
        room_status:
          '<span class="text-uppercase">' + field.room_status + "</span>",
        room_remark:
          '<span class="text-uppercase">' + field.room_remark + "</span>",
        upt_btn:
          '<button class="btn btn-icon accent" title="Student List" onclick="loadData(\'' +
          i +
          "','" +
          blck_id +
          '\')" ><i class="ion-ios-list-outline"></i></button> ',
      });
    } 
    
    
    

    
  });
// console.log(list);
  $("#tblItem_" + blck_id).html("");
  $("#tblItem_" + blck_id).footable({
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

  //-------------------------------------------------- check out Hostel --------------------------------------------------//
  $("#formCheckOut").on("submit", function (e) {
    if (!confirmed) {
      e.preventDefault();
      swal({
        title: "Check Out Hostel",
        text: "Are You Sure?",
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Check Out",
        confirmButtonColor: "#22b66e",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false,
      }).then(function () {
        let chkInOut_id = $("#chkInOut_id").val();
        let checkOut = $("#checkOut").val();
        let checkIn_status = $("#chkInStts").val();
        let reason = $("#reason").val();

        var form = new FormData();
        form.append("chkInOut_id", chkInOut_id);
        form.append("checkOut", checkOut);
        form.append("checkOut_status", "Accept");
        form.append("checkIn_status", "Check Out");
        form.append("notify_std", "No");
        form.append("notify_warden", "No");
        form.append("recordstatus", "EDT");

        form.append("reason", reason);


        var settings = {
          url: host + "api_hep/public/hepHostelChkinout/chkOut",
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
          } else {
            swal({
              title: "Check Out Hostel",
              text: "Success!",
              type: "success",
              showCancelButton: false,
              confirmButtonText: "OK",
              confirmButtonColor: "#22b66e",
              closeOnConfirm: true,
              allowOutsideClick: false,
              html: false,
            }).then(function () {
              //untuk display balik form
              $("#hostelChkOut").modal("hide");
              // location.reload();
              roomByBlock(blck_id, function () {
                createTable(obj_room.data, blck_id);
              });

              //untuk reload data based on specific bilik - block id
              loadData($("#stdListIndex").val(), $("#stdListBlckid").val());

              // location.reload(function(){
              //   loadData($("#stdListIndex").val(), $("#stdListBlckid").val());
              // });
            });
          }
        });
      });
    }
  });
  //-------------------------------------------------- end check out Hostel --------------------------------------------------//
}
//-------------------------------------------------- end table Room List --------------------------------------------------//

function hstlShow(id, returnValue) {
  var settings = {
    url: host + "api_hep/public/hepHostel/show/" + id,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "picoms " + window.sessionStorage.token,
    },
  };

  $.ajax(settings).done(function (response) {
    obj_hostel = response;
    returnValue();
  });
}

// loadData
function detail(id, studid, studname, index, stdListIndex, stdListBlckid) {
  if(studname.indexOf(`namaPelik`)>=0){
    studname = studname.replace(`namaPelik`,`'`);
  }
  let data = JSON.parse($("#dataChkInOutList").val());
  let data2 = JSON.parse($("#dataList_" + stdListBlckid).val());

  //Amri untuk load data baru untuk display
  $("#stdListIndex").val(stdListIndex);
  $("#stdListBlckid").val(stdListBlckid);
  $("#data1").val(data2);

  $("#modalListStd").modal("hide");
  $("#hostelChkOut").modal("show");
  //   console.log(id, studid, studname, index);
  //   alert("lina " + data[index] + " kau " + index);

  // Concatenate the two IDs together
  let stud = studid + " - " + studname;

  $("#chkInOut_id").val(id);
  $("#StudDetails").val(stud);
  $("#checkOut").val(data[index].checkOut);
  $("#checkOut_status").val(data[index].checkOut_status);
  $("#chkInStts").val(data[index].checkIn_status);
}
