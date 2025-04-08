$(function(){
    $.ajaxSetup ({
        cache: false
    });

    $.fn.select2.defaults.set( "theme", "bootstrap" );

    let studId = window.sessionStorage.std_studentid;
    $('#studentId').val(studId);
  
    // Change List
    listCheckIn(studId, function(){
        var colums = [
            { "name": "bil", "title": "No." },
            { "name": "hostel_id", "title": "Hostel" },
            { "name": "checkIn", "title": "Check In" },
            { "name": "checkOut", "title": "Check Out", "breakpoints": "md sm xs" },
            { "name": "checkIn_status", "title": "Check In Status", "breakpoints": "md sm xs" },
            { "name": "checkOut_status", "title": "Check Out Status", "breakpoints": "md sm xs" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];

        let bil = 1;
        let convertList = JSON.stringify(obj_checkIn.data);
        $("#dataChkInOutList").val(convertList);
        var list = [];

        $.each(obj_checkIn.data, function (i, field){
            let chkOutStts = field.checkOut_status;
            let chkInStts = field.checkIn_status;
            let btnChkOut = ''; let labelChkOut = '';

            if(chkOutStts == 'New'){
                labelChkOut = '<span class="label warning">'+chkOutStts+'</span>';
                btnChkOut = '<button class="btn btn-icon accent" title="View" onclick="viewChkInOut(\'' + i + '\')"><i class="ion-eye"></i></button>';

            }
            else if(chkOutStts == 'Accept'){
                labelChkOut = '<span class="label success">'+chkOutStts+'</span>';
                btnChkOut = '<button class="btn btn-icon accent" title="View" onclick="viewChkInOut(\'' + i + '\')"><i class="ion-eye"></i></button>';
            }
            else if(chkOutStts == 'Reject'){
                labelChkOut = '<span class="label danger">'+chkOutStts+'</span>';
                btnChkOut = '<button class="btn btn-icon accent" title="View" onclick="viewChkInOut(\'' + i + '\')"><i class="ion-eye"></i></button>';
            }

            let chkInLabel = '';
            if(chkInStts == 'New'){
                chkInLabel = '<span class="label warning">'+chkInStts+'</span>';
                btnChkOut = '<button class="btn btn-icon info" title="Check In" onclick="chkIn(\'' + i + '\')"><i class="ion-log-in"></i></button> '
            }
            else if(chkInStts == 'Check In'){
                chkInLabel = '<span class="label info">'+chkInStts+'</span>';

                if(chkOutStts == 'New'){
                    btnChkOut = '<button class="btn btn-icon success" title="Update" onclick="detail(\'' + field.chkInOut_id + '\',\'' + i + '\')"><i class="ion-android-create"></i></button> '
                }
                else{
                    btnChkOut = '<button class="btn btn-icon success" title="Check Out" onclick="detail(\'' + field.chkInOut_id + '\',\'' + i + '\')"><i class="ion-log-out"></i></button> ' +
                                '<button class="btn btn-icon warning" title="Change" onclick="chgHostel(\'' + i + '\')" id="btnChgHstl_'+field.chkInOut_id+'"><i class="ion-arrow-swap"></i></button>';
                }
            }
            else if(chkInStts == 'Check Out'){
                chkInLabel = '<span class="label dark">'+chkInStts+'</span>';
            }

            list.push({
                bil: bil++, 
                checkIn: formatDate1(field.checkIn), checkOut: formatDate1(field.checkOut), checkOut_status: labelChkOut, checkIn_status: chkInLabel,
                hostel_id: '<span class="text-uppercase">'+field.clg_name+'<br>'+field.hostel_name+'<br>'+field.block_name+' ( '+field.room_no+' )</span>', 
                upt_btn: btnChkOut
            });

            // check if student have request change hostel
            chkChgExist(field.chkInOut_id, field.std_id, function(){
                let count = obj_hstlChg.data.length;
                if( count == 0 ){ $('#btnChgHstl_'+field.chkInOut_id).show() }
                else{ $('#btnChgHstl_'+field.chkInOut_id).hide() }
            });
        });

        $("#chkInOutList").html('');
        $("#chkInOutList").footable({
            "columns": colums,
            "rows": list,
            "paging": {
                "enabled": true,
                "size": 10
            },
            "filtering": {
                "enabled": true,
                "placeholder": "Search...",
                "dropdownTitle": "Search for:"
            }
        });
    });

    // student info
    student_info(studId, function(){
        $('#stdIcNo').val(obj_stdInfo.data.sti_icno);
        $('#stdName').val(obj_stdInfo.data.sti_name);
    });
 
});
var confirmed = false;
// button print
$('#printStdHstl').click(function(){
    let stdId = $('#studentId').val();
    let stdName = $('#stdName').val();
    
    window.sessionStorage.stud_id = stdId;
    window.sessionStorage.stud_name = stdName;
    window.open('../hepa/hostel_history.html');
});


$('#check_agree').change(function(){
    if($('#check_agree').prop('checked') == true){
        $('#btnCheckIn').attr('disabled',false);
    }
    else{ $('#btnCheckIn').attr('disabled',true); }
});

//utk regulation dgn footnote
let hasReadRegulations = false;

$('#readRegulationsLink').click(function () {
  hasReadRegulations = true;
});
//end utk regulation dgn footnote

//-------------------------------------------------- update Check In --------------------------------------------------//
$('#formChkIn').on('submit', function(e){
    if (!hasReadRegulations) {
        e.preventDefault(); // Prevent form submission
        alert("Please read and agree to the hostel regulations before submitting.");
      }
  
  
    else if(!confirmed){
        e.preventDefault();
        swal({
            title: "Check In Hostel",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Check In",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let chkInOut_id = $('#chkInOutId').val();
            let checkIn = $('#checkIn').val();
            console.log(checkIn);

            let check_agree = '';
            if($('#check_agree').prop('checked') == true){ check_agree = 'Yes'; }
            else{ check_agree = 'No' }


            // Split the date string into components
var dateComponents = checkIn.split('/');
// console.log(dateComponents[2]);

// Reformat the date components into MySQL date format (YYYY-MM-DD)
var mysqlDateFormat = dateComponents[0] ;


            var form = new FormData();
            form.append("chkInOut_id", chkInOut_id);
            form.append("checkIn", mysqlDateFormat);
            form.append("checkIn_status", 'Check In');
            form.append("check_agree", check_agree);
            form.append("notify_warden", 'Yes');
            form.append("recordstatus",'EDT');

            var settings = {
                "url": host+"api_hep/public/hepHostelChkinout/uptChkIn",
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
                if (!result.success) {
                    Swal(result.message, result.data, "error");
                    return;
                }
                // else{
                //     uptHstlBed(chkIn_bed, 'Yes');
                //     uptBookComplete(fk_booking);
                // }
                window.location.reload();
            });
        });
    }
});
//-------------------------------------------------- end update Check In --------------------------------------------------//


//-------------------------------------------------- update status --------------------------------------------------//
// status bed occupied
function uptHstlBed(id, status){
    var form = new FormData();
    form.append("bed_id", id);
    form.append("bed_occupied", status);
    form.append("recordstatus", "EDT");

    var settings = {
        "url": host+"api_hep/public/hepHostelBed/uptSttsBooked",
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
        if (!result.success) {
            Swal(result.message, result.data, "error");
            return;
        }
    });
}

// status booking complete
function uptBookComplete(id){
    var form = new FormData();
    form.append("booking_id", id);
    form.append("booking_status", 'Complete');
    form.append("recordstatus", "EDT");

    var settings = {
        "url": host+"api_hep/public/hepHostelBooking/uptStatus",
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
        if (!result.success) {
            Swal(result.message, result.data, "error");
            return;
        }
    });
}
//-------------------------------------------------- update status --------------------------------------------------//


// loadData
function detail(id, index){
    let data = JSON.parse($("#dataChkInOutList").val());
    $('#chkInOut_id').val(id);
    // $('#checkOut').val(data[index].checkOut);
    $('#checkOut_status').val(data[index].checkOut_status);
    $('#chkInStts').val(data[index].checkIn_status)

    $('#hostelChkOut').modal('show');
}


//-------------------------------------------------- check out Hostel --------------------------------------------------//
$('#formCheckOut').on('submit', function(e){
    if(!confirmed){
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
            html: false
        }).then(function (){
            let chkInOut_id = $('#chkInOut_id').val();
            // let checkOut = $('#checkOut').val();
            // let checkIn_status = $('#chkInStts').val();
            let reason = $('#reason').val();
            let checkOut = $('#checkOut').val();
            var form = new FormData();
            form.append("chkInOut_id", chkInOut_id);
            form.append("checkOut",convertDateFormat(checkOut));
            form.append("checkOut_status", "New");
            form.append("checkIn_status", "Check Out");
            form.append("notify_std", 'No');
            form.append("notify_warden", 'No');
            form.append("recordstatus",'EDT');

            form.append("reason",reason);

            var settings = {
                "url": host+"api_hep/public/hepHostelChkinout/chkOut",
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
                if (!result.success) {
                    Swal(result.message, result.data, "error");
                    return;
                }
                window.location.reload();
            });
        });
    }
});
//-------------------------------------------------- end check out Hostel --------------------------------------------------//


// open modal add change hostel
function chgHostel(index){
    let data = JSON.parse($("#dataChkInOutList").val());
    $('#pk_chkInOut').val(data[index].chkInOut_id);
    $('#pk_booking').val(data[index].fk_booking);

    // date_apply = formatDate(today);

     date_apply = getCurrentDateTime() ;
    // console.log(date_apply);

    $('#date_apply').val(date_apply);
    $('#formAddChange')[0].reset();

    $('#hostelChange').modal('show');
}


function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// update check in hostel
function chkIn(index){
    let data = JSON.parse($("#dataChkInOutList").val());
    data = data[index];

    chkStdSttsChkIn(data.std_id, function(){
        let count = obj_checkIn.data.length;

        if(count == 0){
            $('#chkInOutId').val(data.chkInOut_id);
            $('#checkIn').val(data.checkIn);
            $('#hostel').html('<span class="text-uppercase">'+data.clg_name+'<br>'+data.hostel_name+'<br>'+data.block_name+' ( '+data.room_no+' )</span>');
            $('#expected_chkInDate').html(formatDate(data.expected_chkInDate));
            $('#checkIn_status').html('<span class="label warning">'+data.checkIn_status+'</span>');
            $('#warden').html(data.emp_name+'<br> ( '+data.hostel_wardenNo+' )');

            $('#mdlCheckIn').modal('show');
        }
        else{
            swal({
                title: "Please Check Out Previous Hostel",
                type: "info"
            });
        }
    });
}


//-------------------------------------------------- warden check student check in --------------------------------------------------//
function viewChkInOut(index){
    let data = JSON.parse($("#dataChkInOutList").val());
    data = data[index];
    let chkInOut_id = data.chkInOut_id;
    let chkInStts = data.checkIn_status;
    let chkOutStts = data.checkOut_status;
    
    if( chkInStts == 'Check In' ){ chkInStts = '<span class="label info">'+chkInStts+'</span>' }
    else if( chkInStts == 'Check Out' ){ chkInStts = '<span class="label dark">'+chkInStts+'</span>' }

    if( chkOutStts == 'Accept' ){ chkOutStts = '<span class="label success">'+chkOutStts+'</span>' }
    else if( chkOutStts == 'Reject' ){ chkOutStts = '<span class="label danger">'+chkOutStts+'</span>' }

    $('#chkInOutId').val(chkInOut_id);
    $('#view_hostel').html('<span class="text-uppercase">'+data.clg_name+'<br>'+data.hostel_name+'<br>'+data.block_name+' ( '+data.room_no+' )</span>');
    $('#view_checkIn').html(formatDate(data.checkIn));
    $('#view_checkIn_status').html(chkInStts);
    $('#view_checkOut').html(formatDate(data.checkOut));
    $('#view_chkOutStts').html(chkOutStts);
    
    var settings = {
        "url": host+"api_hep/public/hepHostelChkinout/uptNotifyStd/"+chkInOut_id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };
    
    $.ajax(settings).done(function (response){
        result = response;
        if (!result.success){
            Swal(result.message, result.data, "error");
            return;
        }
    });

    $('#mdlViewData').modal('show');
}
//-------------------------------------------------- warden check student check in --------------------------------------------------//


function listCheckIn(id, returnValue){
    var settings = {
        "url": host+"api_hep/public/hepHostelChkinout/listByStd/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_checkIn = response;
        returnValue();
    });
}


function chkChgExist(chkInOutId, stdId, returnValue){
    var form = new FormData();
    form.append("fk_chkInOut", chkInOutId);
    form.append("stud_id", stdId);

    var settings = {
        "url": host+"api_hep/public/hepHostelChange/chkChgStd",
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
        obj_hstlChg = JSON.parse(response);
        returnValue();
    });
}

function chkStdSttsChkIn(std, returnValue){
    var settings = {
        "url": host+"api_hep/public/hepHostelChkinout/chkStdSttsChkIn/"+std,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_checkIn = response;
        returnValue();
    });
}

