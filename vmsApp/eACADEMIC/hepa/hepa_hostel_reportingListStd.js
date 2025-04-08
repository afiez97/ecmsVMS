$(function(){
  $.ajaxSetup ({
      cache: false
  });
  $.fn.select2.defaults.set( "theme", "bootstrap" );
  $("#loading_modal").modal('show');


  listStdReport(function(){
    createTbl(obj_reportListStd.data);


  })


  $("#filterStdList").on('click',function(){
    if (!customValidation()) {
      return; // Stop further execution if validation fails
  }

  let arrayFilter = [];
  filterClg = $("#filterClg").val();
  filterHostel =$("#filterHostel").val() ;
  filterBlock = $("#filterBlock").val();
  filterRoom = $("#filterRoom").val();
  pushHostel = '';
  pushBlock = '';
  // pushHostel = '';


  if (filterClg != 0) {
    arrayFilter.push({ branch_id: filterClg });
  }

  if (!(filterHostel == 0)) {

    arrayFilter.push({ hostel_id: filterHostel });
  }

  if (!(filterBlock == 0 || filterBlock == null)) {
    
    arrayFilter.push({ block_id: filterBlock });
  }

  
  if (!(filterRoom == 0 || filterRoom == null)) {
    
    arrayFilter.push({ room_id: filterRoom });
  }
  console.log(arrayFilter);

  let listOri = JSON.parse($("#dataListFilter").val()); // Assuming this is a JSON string
  let listFilter = arrayFilter;
  let filteredList = listOri.filter(function(item) {
    return listFilter.every(function(filterObj) {
      let key = Object.keys(filterObj)[0];
      return item[key] !== undefined && item[key] == filterObj[key];
    });
  });



  createTbl(filteredList);
});

});
var confirmed = false;

//-------------------------------------------------- function create table --------------------------------------------------//
function createTbl(dataList){
  var colums = [
      { "name": "bil", "title": "No." },
      { "name": "std_id", "title": "STUDENT ID", "style": "text-align:center;" },
      { "name": "std_name", "title": "STUDENT NAME", "style": "text-align:center;" },
      { "name": "clg_name", "title": "CAMPUS", "style": "text-align:center;" },
      { "name": "hostel_name", "title": "HOSTEL", "style": "text-align:center;" },
      { "name": "block_name", "title": "BLOCK NAME", "style": "text-align:center;" },
      { "name": "room_name", "title": "ROOM NO", "style": "text-align:center;" },
      { "name": "sts_ChkIn", "title": "STATUS CHECK IN", "style": "text-align:center;" },
      // { "name": "sts_ChkOut", "title": "STATUS CHECK OUT", "style": "text-align:center;" },
  ];

  var colums2 = [
    { "name": "bil", "title": "No." },
    { "name": "std_id", "title": "STUDENT ID", "style": "text-align:center;" },
    { "name": "std_name", "title": "STUDENT NAME", "style": "text-align:center;" },
    { "name": "std_ic", "title": "IC NO.", "style": "text-align:center;" },
    { "name": "std_contact", "title": "HP NO.", "style": "text-align:center;" },
    // { "name": "clg_name", "title": "CAMPUS", "style": "text-align:center;" },
    { "name": "hostel_name", "title": "HOSTEL", "style": "text-align:center;" },
    { "name": "block_name", "title": "BLOCK NAME", "style": "text-align:center;" },
    { "name": "room_name", "title": "ROOM NO", "style": "text-align:center;" },
    { "name": "sts_ChkIn", "title": "STATUS CHECK IN", "style": "text-align:center;" },
    // { "name": "sts_ChkOut", "title": "STATUS CHECK OUT", "style": "text-align:center;" },
];


  

  let bil = 1;
  let convertList = JSON.stringify(dataList);
  $("#dataList").val(convertList);
  var list = [];
  
  var Ttbed = 0;
  var TtOccbedL = 0;
  var TtOccbedP = 0;
  var TtOccbed = 0;
  var TtUnOccbedL = 0;
  var TtUnOccbedP = 0;
  var TtUnOccbed = 0;

  $.each(dataList, function (i, field){
    
      list.push({
          bil: bil++, 
          std_id: `<span class="text-uppercase">`+(field.stud_id || '')+`</span>`, 
          std_name: `<span class="text-uppercase">`+ ( field.sti_name || '')+`</span>`, 
          std_ic: `<span class="text-uppercase">`+ ( field.sti_icno || '')+`</span>`, 
          std_contact: `<span class="text-uppercase">`+ ( field.sti_contactno_mobile || '')+`</span>`, 
          clg_name: `<span class="text-uppercase">`+( field.clg_name || '')+`</span>`, 
          hostel_name: `<span class="text-uppercase">`+ (  field.hostel_name|| '') +`</span>`, 
          block_name: `<span class="text-uppercase">`+ ( field.block_name || '') +`</span>`, 
          room_name: `<span class="text-uppercase">`+(  field.room_no|| '') +` </span>`, 
          sts_ChkIn: `<span class="text-uppercase">`+( field.checkIn_status || '') +` </span>`, 
          sts_ChkOut: `<span class="text-uppercase">`+(field.checkOut_status  || '') +` </span>`, 
      });

  });

  $("#ListStdReporting").html('');
  $("#ListStdReporting").footable({
      "columns": colums,
      "rows": list,
      "paging": {
          "enabled": true,
          "size": 20,
          "countFormat": "Showing {PF} to {PL} of {TR} data"
      },
      "filtering": {
          "enabled": false,
          "placeholder": "Search...",
          "dropdownTitle": "Search for:"
      }
  });


  
  $("#ListStdReportingNoPaging").html('');
  $("#ListStdReportingNoPaging").footable({
      "columns": colums2,
      "rows": list,
      "paging": {
          "enabled": false,
          "size": 10,
          "countFormat": "Showing {PF} to {PL} of {TR} data"
      },
      "filtering": {
          "enabled": false,
          "placeholder": "Search...",
          "dropdownTitle": "Search for:"
      }
  });
  $("#loading_modal").modal('hide');



}
//-------------------------------------------------- end function create table --------------------------------------------------//




function listStdReport(returnValue){
  var settings = {
      "url": host+"api_hep/public/hepHostelChkinout/reporting/reportingListStd",
      "method": "GET",
      "timeout": 0,
      "headers": {
          "Authorization": "picoms " + window.sessionStorage.token
      },
  };

  $.ajax(settings).done(function (response){
      obj_reportListStd = response;
      $("#dataListFilter").val(JSON.stringify(obj_reportListStd.data));

      returnValue();
  });
}












































    // select Campus
    campusList(function () {
      // $('#hostel_branch').append('<option value="">- Choose -</option>');
      // $('#upt_hostel_branch').append('<option value="">- Choose -</option>');
      // $('#blok_branch').append('<option value="">- Choose -</option>');
      // $('#room_branch').append('<option value="">- Choose -</option>');
      // $('#bed_branch').append('<option value="">- Choose -</option>');
      // $('#searchBranch').append('<option value="">- Choose -</option>');
      // $('#srchClgBlock').append('<option value="">- Choose -</option>');
      $('#filterClg').append('<option value="">- Choose -</option>');

      $.each(obj_college.data, function (i, item) {
          select = "";
          // if (campus == item.pk_id) {
          //     select = "selected";
          // }
          // $('#searchBranch').append('<option value="' + item.pk_id + '" ' + select + '>' + item.clg_name.toUpperCase() + '</option>');
          // $('#hostel_branch').append('<option value="' + item.pk_id + '">' + item.clg_name.toUpperCase() + '</option>');
          // $('#upt_hostel_branch').append('<option value="' + item.pk_id + '">' + item.clg_name.toUpperCase() + '</option>');
          // $('#blok_branch').append('<option value="' + item.pk_id + '">' + item.clg_name.toUpperCase() + '</option>');
          // $('#room_branch').append('<option value="' + item.pk_id + '">' + item.clg_name.toUpperCase() + '</option>');
          // $('#bed_branch').append('<option value="' + item.pk_id + '">' + item.clg_name.toUpperCase() + '</option>');
          // $('#srchClgBlock').append('<option value="' + item.pk_id + '">' + item.clg_name.toUpperCase() + '</option>');
          $('#filterClg').append('<option value="' + item.pk_id + '">' + item.clg_name.toUpperCase() + '</option>');
      });
  });



  // onchange search room
$('#filterClg').change(function(){
  let roomBranch = $('#filterClg').val();

  hostelBranch(roomBranch, function(){
      $('#filterHostel').html('');
      $('#filterHostel').append('<option value="">- Choose -</option>');
      $.each(obj_hstlBranch.data, function(i, item){
          $('#filterHostel').append('<option value="'+item.hostel_id+'">'+item.hostel_name.toUpperCase()+'</option>');
      });
  });
});


// onchange hostel search room
$('#filterHostel').change(function(){
  let roomHstl = $('#filterHostel').val();

  blockList(roomHstl, function(){
      $('#filterBlock').html('');
      $('#filterBlock').append('<option value="">- Choose -</option>');
      $.each(obj_block.data, function(i, item){
          $('#filterBlock').append('<option value="'+item.block_id+'">'+item.block_name.toUpperCase()+'</option>');
      });
  });
});

// onchange hostel search room
$('#filterBlock').change(function(){
  let blockID = $('#filterBlock').val();

  roomList2(blockID, function(){
      $('#filterRoom').html('');
      $('#filterRoom').append('<option value="">- Choose -</option>');
      $.each(obj_roomList.data, function(i, item){

          $('#filterRoom').append('<option value="'+item.room_id+'">'+item.room_no.toUpperCase()+'</option>');
      });
  });
});



function hostelBranch(id, returnValue){
  var settings = {
      "url": host+"api_hep/public/hepHostel/listByBranch/"+id,
      "method": "GET",
      "timeout": 0,
      "headers": {
          "Authorization": "picoms " + window.sessionStorage.token
      },
  };

  $.ajax(settings).done(function (response){
      obj_hstlBranch = response;
      returnValue();
  });
}



function customValidation() {
  let isValid = true;

  // Example: Validate if input fields have values
  $(".required-field").each(function () {
      if ($(this).val().trim() === "") {
          // Display tooltip with validation message
          $(this).attr("data-toggle", "tooltip").attr("title", "This field is required.").tooltip("show");
          isValid = false; // Validation failed
      } else {
          // Hide tooltip if validation passes
          $(this).tooltip("hide");
      }
  });

  return isValid;
}


