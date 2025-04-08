//-------------------------------------------------- mis_std_info --------------------------------------------------//
function student_info(id, returnValue){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/misStdInfo/show/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    let request = $.ajax(settings);

    request.done(function (response){
        obj_stdInfo = response;
        returnValue();
    });

    request.fail(function(response){
        window.sessionStorage.clear();
        window.localStorage.clear();
        window.location.reload();
        obj_stdInfo = response;
        returnValue();
    });
}

function student_show(id, returnValue){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/pelajar/show/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    let request = $.ajax(settings);

    request.done(function (response){
        obj_stdInfo = response;
        returnValue();
    });

    request.fail(function(response){
        obj_stdInfo = response;
        returnValue();
    });
}

function chkStdExist(input, returnValue){
    var form = new FormData();
    form.append("input", input);

    var settings = {
        "url": host+"api_pengurusan_pelajar/public/studentIdChecking",
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
        result = JSON.parse(response);
        returnValue();
    });
}
//-------------------------------------------------- end mis_std_info --------------------------------------------------//


function campusList(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmCollege/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    // $.ajax(settings).done(function (response){
    //    obj_college = response;
    //    returnValue();
    // });

    let request = $.ajax(settings);

    request.done(function (response){
        obj_college = response;
        returnValue();
    });

    request.fail(function(response){
        window.sessionStorage.clear();
        window.localStorage.clear();
        window.location.reload();
        obj_college = response;
        returnValue();
    });
}


function hstlClgList(id, returnValue){
    var settings = {
        "url": host+"api_hep/public/hepHostel/listByBranch/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_hstlList = response;
        returnValue();
    });
}

//-------------------------------------------------- hep_hostel --------------------------------------------------//
function hstlClgListActive(id, returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepHostel/listByBranch/Active/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_hstlListActive = response;
        returnValue();
    });
}
//-------------------------------------------------- end hep_hostel --------------------------------------------------//



//-------------------------------------------------- hep_hostel_blok --------------------------------------------------//
function blockList(id, returnValue){
    var settings = {
        "url": host+"api_hep/public/hepHostelBlok/listByHostel/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_blockList = response;
        returnValue();
    });
}

// list block by Hostel & Gender
function listBlckHstlGndr(id, gender, returnValue){
    var form = new FormData();
    form.append("hostel_id", id);
    form.append("block_gender", gender);

    var settings = {
        "url": host+"api_hep/public/hepHostelBlok/listByHstlGndr",
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
        obj_block = JSON.parse(response);
        returnValue();
    });
}
//-------------------------------------------------- end hep_hostel_blok --------------------------------------------------//


function roomList(id, returnValue){
    var settings = {
        "url": host+"api_hep/public/hepHostelRoom/listByBlok/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_roomList = response;
        returnValue();
    });
}

function roomList2(id, returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepHostelRoom/listByBlok2/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_roomList = response;
        returnValue();
    });
}


//-------------------------------------------------- hep_hostel_bed --------------------------------------------------//
// bed list by room, status==Active, occupied==No
function bedList(id, returnValue){
    var settings = {
        "url": host+"api_hep/public/hepHostelBed/listByRmActNo/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_bedList = response;
        returnValue();
    });
}

// bed list by room
function bedByRoom(id, returnValue){
    var settings = {
        "url": host+"api_hep/public/hepHostelBed/list/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_bedList = response;
        returnValue();
    });
}
//-------------------------------------------------- end hep_hostel_bed --------------------------------------------------//


function chkStatusRegCrs(std, crs, returnValue){
    var form = new FormData();
    form.append("std_studentid", std);
    form.append("crs_code", crs);

    var settings = {
        "url": host + "api_pengurusan_pelajar/public/misStdRegsub/chkStatus",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
        "async": false,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
    };

    $.ajax(settings).done(function (response){
        obj_regCrs = JSON.parse(response);
        returnValue();
    });
}


// get pgmDet_id based on student
function getPgmDet(pgm, year, intake, returnValue){
    var form = new FormData();
    form.append("pgm_id", pgm);
    form.append("dtp_year", year);
    form.append('dtp_intake', intake);

    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmProgDet/findPkId",
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
        obj_pgmDet = JSON.parse(response);
        returnValue();
    });
}

// get pgmDet_id based on student
function findPGMid(pgm, intake, returnValue){
    var form = new FormData();
    form.append("pgm_id", pgm);
    // form.append("dtp_year", year);
    form.append('dtp_intake', intake);

    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmProgDet/findPGMid",
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
        obj_findPGMid = JSON.parse(response);
        returnValue();
    });
}

// date format
function formatDate(date){
    let newDate = '';
    if(date){
        let arrayDate = date.split("-");
        newDate = arrayDate[1]+'/'+arrayDate[2]+'/'+arrayDate[0];
    }
    else{ newDate = ''; }

    return newDate;
}

function formatDate1(date){
    let newDate = '';
    if(date){
        let arrayDate = date.split("-");
        newDate = arrayDate[2]+'/'+arrayDate[1]+'/'+arrayDate[0];
    }
    else{ newDate = ''; }

    return newDate;
}


// time format
function formatTime(timeString) {
    // console.log(timeString);
    const [hourString, minute] = timeString.split(":");
    const hour = +hourString % 24;
    return (hour % 12 || 12) + ":" + minute + (hour < 12 ? " AM" : " PM");
}


// count student check in
function countOccupied(id, returnValue){
    var settings = {
        "url": host+"api_hep/public/hepHostelChkinout/countChkIn/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_chkInOut = response;
        returnValue();
    });
}


// Groupby cur_year active
function curYearAct(returnValue){
    var settings = {
        "url": host + "api_tetapan_picoms/public/misPrmCuryear/listYearAct",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_curYearAct = response;
        returnValue();
    });
}


function alertReport(std, returnValue){
    var settings = {
        "url": host+"api_hep/public/hepaduan/alertStdReport/"+std,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_aduan = response;
        returnValue();
    });
}

function convertDateFormat(originalDateString) {
    // Split the original date string
    let parts = originalDateString.split('/');
    
    // Create a Date object
    let dateObject = new Date(parts[2], parts[1]-1 , parts[0]);

    // Format the date object to 'YYYY-MM-DD' format
    // let formattedDateString = dateObject.toISOString().split('T')[0];

   // Format the date object to 'YYYY/MM/DD' format
   let year = dateObject.getFullYear();
   let month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
   let day = dateObject.getDate().toString().padStart(2, '0');

   let formattedDateString = `${year}/${month}/${day}`;
   return formattedDateString;
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

  function listByActPolicy(std, acaCal, returnValue) {
    var form = new FormData();
    form.append("std_studentid", std);
    form.append("aca_session", acaCal);
  
    var settings = {
      url: host + "api_pengurusan_pelajar/public/misStdRegsub/listByActPolicy5",
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

  function listByActPolicy2(std, acaCal, returnValue) {
    var form = new FormData();
    form.append("std_studentid", std);
    form.append("aca_session", acaCal);
  
    var settings = {
      url: host + "api_pengurusan_pelajar/public/misStdRegsub/listByActPolicy",
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
  

  
  // sni utk filter sesiap klau block kosong then hostel x appear sesiap
  // bleh refer line 477 kat hstl_book_stud.js
function checkHostel(hostelList, callback) {
    let stdIcNo = $('#stdIcNo').val();
    let getVal = stdIcNo.slice(-1);
    let gender = '';

    let obj = new get(host + "api_pengurusan_pelajar/public/pelajar/show/det/sti_icno/" + stdIcNo, 'picoms ' + window.sessionStorage.token).execute();

    if (obj.success) {
        gender = obj.data.sti_gender_name;
    } else {
        gender = getVal % 2 == 0 ? 'Female' : 'Male';
    }

    let filteredHostels = [];

    let counter = 0;

    // Iterate through each hostel
    hostelList.forEach((item, index) => {
        listBlckHstlGndr(item.hostel_id, gender, function () {
            if (obj_block.data && obj_block.data.length > 0) {
                filteredHostels.push(item);
            }
            counter++;

            if (counter === hostelList.length) {
                callback(filteredHostels);
            }
        });
    });
}
