$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let userRole = window.sessionStorage.userRole;
    let usrWarden = window.sessionStorage.usrWarden;

    // Change List
    listExcludeNewcheckin(function(){
        var colums = [
            { "name": "bil", "title": "No." },
            { "name": "stud_id", "title": "Student" },
            { "name": "hostel_id", "title": "Hostel" },
            { "name": "checkIn", "title": "Check In", "breakpoints": "md sm xs" },
            { "name": "checkOut", "title": "Check Out", "breakpoints": "md sm xs" },
            { "name": "checkIn_status", "title": "Check In Status", "breakpoints": "md sm xs" },
            { "name": "checkOut_status", "title": "Check Out Status", "breakpoints": "md sm xs" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];

        let bil = 1;
        let convertList = JSON.stringify(obj_checkIn.data);
        $("#dataList").val(convertList);
        var list = [];

        $.each(obj_checkIn.data, function (i, field){
            let chkOutStts = field.checkOut_status;
            let chkInStts = field.checkIn_status;
            let btnAction = '';
            let lblChkOut = '';

            // Check Out Status
            if( chkOutStts == 'New' ){ lblChkOut = '<span class="label warning">'+chkOutStts+'</span>'; }
            else if( chkOutStts == 'Accept' ){ lblChkOut = '<span class="label success">'+chkOutStts+'</span>'; }
            else if( chkOutStts == 'Reject' ){ lblChkOut = '<span class="label danger">'+chkOutStts+'</span>'; }
            else { lblChkOut = '' }

            // Check In Status
            let chkInLabel = '';
            if(chkInStts == 'New'){
                chkInLabel = '<span class="label warning">'+chkInStts+'</span>';
            }
            else if(chkInStts == 'Check In'){
                let alrtWrdn = '';
                if( usrWarden == 1 && field.notify_warden == 'Yes' ){ alrtWrdn = '<b class="label rounded label-xs danger up" id="alrt_'+field.chkInOut_id+'"></b>' }

                chkInLabel = '<a><span class="label info" onclick="alertWarden(\'' + field.chkInOut_id + '\')">'+chkInStts+'</span><a>'+alrtWrdn;
                // btnAction = '<button class="btn btn-icon success" title="Update" onclick="detail(\'' + field.chkInOut_id + '\',\'' + i + '\')"><i class="ion-android-create"></i></button>';
                btnAction = '<button class="btn btn-icon accent" title="View" onclick="viewChkInOut(\'' + i + '\',\'' +userRole+ '\')"><i class="ion-eye"></i></button>';   
                // // condition checkout status
                // if(chkOutStts == 'New'){
                //     btnAction = '<button class="btn btn-icon success" title="Update" onclick="detail(\'' + field.chkInOut_id + '\',\'' + i + '\')"><i class="ion-android-create"></i></button>';
                // }
                // else{ btnAction = '<button class="btn btn-icon accent" title="View" onclick="viewChkInOut(\'' + i + '\',\'' +userRole+ '\')"><i class="ion-eye"></i></button>'; }
            }
            else if(chkInStts == 'Check Out'){
                chkInLabel = '<span class="label dark">'+chkInStts+'</span>';
          
                if (chkOutStts == 'New') {
                    btnAction = '<button class="btn btn-icon success" title="Update" onclick="detail(\'' + field.chkInOut_id + '\',\'' + i + '\')"><i class="ion-android-create"></i></button>';

                } else {
                    btnAction = '<button class="btn btn-icon accent" title="View" onclick="viewChkInOut(\'' + i + '\',\'' +userRole+ '\')"><i class="ion-eye"></i></button>';

                }
            }

            else if(chkInStts == 'Unreside'){
                chkInLabel = '<span class="label warning">'+chkInStts+'</span>';
                btnAction = '<button class="btn btn-icon accent" title="View" onclick="viewChkInOut(\'' + i + '\',\'' +userRole+ '\')"><i class="ion-eye"></i></button>';
            }

            list.push({
                bil: bil++, 
                stud_id: '<span class="text-uppercase"><b>'+field.std_id+'</b><br>'+field.sti_name+'</span>', 
                checkIn: formatDate(field.checkIn), 
                checkOut: formatDate(field.checkOut), 
                checkOut_status: lblChkOut,
                hostel_id: '<span class="text-uppercase">'+field.clg_name+'<br>'+field.hostel_name+'<br>'+field.block_name+' ( '+field.room_no+' )</span>', 
                checkIn_status: chkInLabel,
                upt_btn: btnAction
            });
        });

        $("#chkInOutList").html('');
        $("#chkInOutList").footable({
            "columns": colums,
            "rows": list,
            "paging": {
                "enabled": true,
                "size": 10,
                "countFormat": "Showing {PF} to {PL} of {TR} data"
            },
            "filtering": {
                "enabled": true,
                "placeholder": "Search...",
                "dropdownTitle": "Search for:"
            },
        });
    });



    reportChckOutHostel(function () {
        var tableData = {};
        $.each(obj_chkOut, function (index, item) {

            var reason = item.reason || "Others Reason";
            var gender = item.sti_gender_name || "Lain Lain";
        
            if (!tableData[reason]) {
                tableData[reason] = {};
            }
        
            tableData[reason][gender] = (tableData[reason][gender] || 0) + 1;
        });
        
        var rows = [];
        var columns = [{ name: 'reason', title: 'Reason' }];
        var availableGenders = {};
        
        $.each(obj_chkOut, function (index, item) {
            if (item.sti_gender_name) {
                availableGenders[item.sti_gender_name] = true;
            }
        });
        
        $.each(availableGenders, function (gender) {
            columns.push({ name: gender, title: gender,  "style": "text-align:center;" });
        });
        $.each(tableData, function (reason, genders) {
            var row = { reason: reason };
            
            $.each(availableGenders, function (gender) {
                // $.each(genders, function (gender, count) {
                // row[gender] = count;
                row[gender] = genders[gender] || '0';
    
            });
        
            rows.push(row);
        });
        
        $("#report_OutHostel").html('');
        $("#report_OutHostel").footable({
            "columns": columns,
            "rows": rows,
            "paging": {
                "enabled": true,
                "size": 10,
                "countFormat": "Showing {PF} to {PL} of {TR} data"
            },
          
        });
    });


    reportChckInHostel(function () {

        var column = [
            { "name": "", "title": "Gender", "style": "text-align:center;"},
            { "name": "Check In", "title": "Check In", "style": "text-align:center;"},
            { "name": "New", "title": "New" , "style": "text-align:center;"}
        ];
        var rows = [];
        $.each(obj_chkIn, function (i, field) {
            rows.push({
                "": i,
                "Check In": field["Check In"],
                "New": field["New"]
            });
        });
    
        $("#report_InHostel").html('');
    
        // Initialize Footable with your data
        $("#report_InHostel").footable({
            "columns": column,
            "rows": rows,
            "paging": {
                "enabled": true,
                "size": 10,
                "countFormat": "Showing {PF} to {PL} of {TR} data"
            },
        });
    });

});
var confirmed = false;

reportingHostelDet();

$('#formFilterHostelDet').submit(function (e) {

    e.preventDefault(); // Prevent the default form submission
    reportingHostelDet();

})
// reportChgHostel(function () {

   
// // Extract unique column names from the data object
// var columnNames = [];
// for (var key in obj_chkInOut.data) {
//     for (var subKey in obj_chkInOut.data[key]) {
//         if (columnNames.indexOf(subKey) === -1) {
//             columnNames.push(subKey);
//         }
//     }
// }

// // Create the columns array for footable dynamically
// var columns = [];

// // Add the first column based on your requirement
// columns.push({ name: "firstColumn", title: "First Column Header" });

// // Add other columns based on data
// columnNames.forEach(function (columnName) {
// // console.log(columnName);
// // if (columnName =='') {
// //     columnName = 'Lain-lain';
// // }else{
// //     columnName=columnName;
// // }
//     columns.push({ name: columnName, title: columnName });
// });
// // Initialize the footable
// $("#report_chgHostel").footable({
//     columns: columns,
//     rows: Object.keys(obj_chkInOut.data).map(function (key) {
//         var rowData = obj_chkInOut.data[key];
//         var row = { firstColumn: key };
//         columnNames.forEach(function (columnName) {
//             row[columnName] = rowData[columnName] || "";
//         });
//         return row;
//     }),
//     paging: {
//         enabled: true,
//         size: 10,
//         countFormat: "Showing {PF} to {PL} of {TR} data"
//     }
// });
  
//     // $("#mdl_reportchngeHostel").html('');
//     // $("#mdl_reportchngeHostel").footable({
//     //     "columns": colums,
//     //     "rows": list,
//     //     "paging": {
//     //         "enabled": true,
//     //         "size": 10,
//     //         "countFormat": "Showing {PF} to {PL} of {TR} data"
//     //     },
//     //       //   "filtering": {
//     //       //       "enabled": true,
//     //       //       "placeholder": "Search...",
//     //       //       "dropdownTitle": "Search for:"
//     //       //   }
//     // });
//   });








$('#formFilterHostelChkIn').submit(function (e) {

    e.preventDefault(); // Prevent the default form submission
    reportChckInHostel(function () {

        var column = [
            { "name": "", "title": "Gender", "style": "text-align:center;"},
            { "name": "Check In", "title": "Check In", "style": "text-align:center;"},
            { "name": "New", "title": "New" , "style": "text-align:center;"}
        ];
        var rows = [];
        $.each(obj_chkIn, function (i, field) {
            rows.push({
                "": i,
                "Check In": field["Check In"],
                "New": field["New"]
            });
        });
    
        $("#report_InHostel").html('');
    
        // Initialize Footable with your data
        $("#report_InHostel").footable({
            "columns": column,
            "rows": rows,
            "paging": {
                "enabled": true,
                "size": 10,
                "countFormat": "Showing {PF} to {PL} of {TR} data"
            },
        });
    });
})


$('#formFilterHostelChkOut').submit(function (e) {
    e.preventDefault(); // Prevent the default form submission
    reportChckOutHostel(function () {
        var tableData = {};
        $.each(obj_chkOut, function (index, item) {

            var reason = item.reason || "Others Reason";
            var gender = item.sti_gender_name || "Lain Lain";
        
            if (!tableData[reason]) {
                tableData[reason] = {};
            }
        
            tableData[reason][gender] = (tableData[reason][gender] || 0) + 1;
        });
        
        var rows = [];
        var columns = [{ name: 'reason', title: 'Reason' }];
        var availableGenders = {};
        
        $.each(obj_chkOut, function (index, item) {
            if (item.sti_gender_name) {
                availableGenders[item.sti_gender_name] = true;
            }
        });
        
        $.each(availableGenders, function (gender) {
            columns.push({ name: gender, title: gender,  "style": "text-align:center;" });
        });
        $.each(tableData, function (reason, genders) {
            var row = { reason: reason };
            
            $.each(availableGenders, function (gender) {
                // $.each(genders, function (gender, count) {
                // row[gender] = count;
                row[gender] = genders[gender] || '0';
    
            });
        
            rows.push(row);
        });
        
        $("#report_OutHostel").html('');
        $("#report_OutHostel").footable({
            "columns": columns,
            "rows": rows,
            "paging": {
                "enabled": true,
                "size": 10,
                "countFormat": "Showing {PF} to {PL} of {TR} data"
            },
          
        });
    });

})







function detail(id, index){
    let data = JSON.parse($("#dataList").val());
    $('#chkInOut_id').val(id);
    $('#chkInStts').val(data[index].checkIn_status);
    $('#checkOut').val(data[index].checkOut);
    $('#checkOut_status').val(data[index].checkOut_status);
    $('#checkOut_reason').val(data[index].reason);
    $('#bedId').val(data[index].bedId);

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
            let checkOut = $('#checkOut').val();
            let checkOut_status = $('#checkOut_status').val();
            let checkIn_status = $('#chkInStts').val();
            let notify_admin = 'No';
            if( checkOut_status == 'Accept' ){
                checkIn_status = 'Check Out';
                notify_admin = 'Yes'
            }else if(checkOut_status == 'Reject'){
                checkIn_status = 'Check In';
                // checkOut = '';
            }

            var form = new FormData();
            form.append("chkInOut_id", chkInOut_id);
            form.append("checkOut", checkOut);
            form.append("checkOut_status", checkOut_status);
            form.append("checkIn_status", checkIn_status);
            form.append("notify_admin", notify_admin);
            form.append("notify_std", 'Yes');
            form.append("recordstatus",'EDT');

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


//-------------------------------------------------- warden check student check in --------------------------------------------------//
function viewChkInOut(index, userRole){
    let data = JSON.parse($("#dataList").val());
    data = data[index];
    console.log(data);
    let chkInOut_id = data.chkInOut_id;
    let chkInStts = data.checkIn_status;
    let chkOutStts = data.checkOut_status;
    let usrWarden = window.sessionStorage.usrWarden;
    
    if( chkInStts == 'Check In' ){ chkInStts = '<span class="label info">'+chkInStts+'</span>' }
    else if( chkInStts == 'Check Out' ){ chkInStts = '<span class="label dark">'+chkInStts+'</span>' }

    if( chkOutStts == 'Accept' ){ chkOutStts = '<span class="label success">'+chkOutStts+'</span>' }
    else if( chkOutStts == 'Reject' ){ chkOutStts = '<span class="label danger">'+chkOutStts+'</span>' }

    $('#chkInOutId').val(chkInOut_id);
    $('#matricNo').html(data.std_id);
    $('#sti_name').html(data.sti_name);
    $('#hostel').html('<span class="text-uppercase">'+data.clg_name+'<br>'+data.hostel_name+'<br>'+data.block_name+' ( '+data.room_no+' )</span>');
    $('#checkIn').html(formatDate(data.checkIn));
    $('#checkIn_status').html(chkInStts);
    $('#view_checkOut').html(formatDate(data.checkOut));
    $('#view_chkOutStts').html(chkOutStts);
    $('#view_chkOutReason').html(data.reason);

    // update notify
    if(usrWarden == 1){
        var settings = {
            "url": host+"api_hep/public/hepHostelChkinout/uptNotifyWarden/"+chkInOut_id,
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
            else{
                $('#alrt_'+chkInOut_id).hide();

                // total check out status==New / notify_warden==Yes
                $('#alertChkInOut, #alertMenuHstl').hide();
                alertCheckOut(function(){
                    let count = obj_alertChkOut.data.length;
                    if(count != 0){
                        $('#alertChkInOut').show();
                        $('#alertChkInOut').html(count);
                        $('#alertMenuHstl').show();
                    }
                });
            }
        });
    }
    
    if(userRole == 'admin'){
        var settings = {
            "url": host+"api_hep/public/hepHostelChkinout/uptNotifyAdmin/"+chkInOut_id,
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
    }

    $('#mdlViewData').modal('show');
}
//-------------------------------------------------- warden check student check in --------------------------------------------------//


//-------------------------------------------------- admin check out student --------------------------------------------------//
function chkOutHstl(id){
    if(!confirmed){
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
            let checkOut = new Date();
            let day = ("0" + checkOut.getDate()).slice(-2);
            let month = ("0" + (checkOut.getMonth() + 1)).slice(-2);
            let today = checkOut.getFullYear()+"-"+(month)+"-"+(day);

            var form = new FormData();
            form.append("chkInOut_id", id);
            form.append("checkOut", today);
            form.append("checkOut_status", 'Accept');
            form.append("checkIn_status", 'Check Out');
            form.append("notify_admin", 'No');
            form.append("notify_std", 'Yes');
            form.append("recordstatus",'EDT');

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
}
//-------------------------------------------------- admin check out student --------------------------------------------------//


function alertWarden(id){
    var settings = {
        "url": host+"api_hep/public/hepHostelChkinout/uptNotifyWarden/"+id,
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
        else{
            $('#alrt_'+id).hide();
            // total check out status==New / notify_warden==Yes
            $('#alertChkInOut, #alertMenuHstl').hide();
            alertCheckOut(function(){
                let count = obj_alertChkOut.data.length;
                if(count != 0){
                    $('#alertChkInOut').show();
                    $('#alertChkInOut').html(count);
                    $('#alertMenuHstl').show();
                }
            });
        }
    });
}


// check student exist
$('#std_id').on('input', function(){
    let input = $(this).val();
    chkStdExist(input, function(){
        if(result.data != ''){
            $.each(result.data, function(i, item){
                $('#std_name').val(item.sti_name);
            });
            $('#check').html('');
            $('#printStdHstl').prop('disabled', false);
        }
        else{
            $('#std_name').val('');
            $('#check').html('Not Found');
            $("#check").prop('class','text-danger');
            $('#printStdHstl').prop('disabled', true);
        }
    });
});


// button print
$('#printStdHstl').click(function(){
    let stdId = $('#std_id').val();
    let stdName = $('#std_name').val();
    window.sessionStorage.stud_id = stdId;
    window.sessionStorage.stud_name = stdName;
    window.open('hostel_history.html');
});


function listCheckIn(returnValue){
    var settings = {
        "url": host+"api_hep/public/hepHostelChkinout/list",
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
function listExcludeNewcheckin(returnValue){
    var settings = {
        "url": host+"api_hep/public/hepHostelChkinout/list/listExcludeNewcheckin",
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

function chkStdNotChkOut(id, returnValue){
    var settings = {
        "url": host+"api_hep/public/hepHostelChkinout/chkStdNotChkOut/"+id,
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

function reportChckOutHostel(returnValue){
    let chkOutdate = $('#chkOutdate').val();
    var form = new FormData();
    form.append('chkInOutDate', chkOutdate);

    // var settings = {
    //     "url": host+"api_hep/public/hepHostelChkinout/reporting/reportChckOut",
    //     "method": "GET",
    //     "timeout": 0,
    //     "headers": {
    //         "Authorization": "picoms " + window.sessionStorage.token
    //     },
    // };

    // $.ajax(settings).done(function (response){
    //     obj_chkOut = response;
    //     returnValue();
    // });
    obj = new post(host + 'api_hep/public/hepHostelChkinout/reporting/reportChckOut',form,'picoms ' + window.sessionStorage.token).execute();

    if (obj.success) {
        obj_chkOut = obj.data;  
        returnValue();
    }else{
        alert('This Month No Check-In');
    }
}



function reportChckInHostel(returnValue){

    let chkIndate = $('#chkIndate').val();
    var form = new FormData();

    form.append('chkInOutDate', chkIndate);
    obj = new post(host + 'api_hep/public/hepHostelChkinout/reporting/reportChkIn',form,'picoms ' + window.sessionStorage.token).execute();

    if (obj.success) {
        obj_chkIn = obj.data;
        returnValue();
    }else{
        alert('This Month No Check-In');
    }

    
}

function reportingHostelDet(returnValue) {
    let chkInOutDate = $('#chkInOutdate').val();

    let FK_status_Student = $('#FK_status_Student').val();
    let ChkInOutSelect = $('#ChkInOutSelect').val();
            
            var form = new FormData();
            // form.append("chkInOutMonth", chkInOutMonth);
            form.append("chkInOutDate", chkInOutDate);
            form.append("FK_status_Student", FK_status_Student);
            form.append("ChkInOutSelect", ChkInOutSelect);

    var settings = {
        "url": host + "api_hep/public/hepHostelChkinout/Reporting/reportingChkInOut",
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
        // obj_ProgPDF = response;
        obj_ChkInOutPDF = JSON.parse(response);



        var colums = [
            { "name": "bil", "title": "Bil.", "style": "text-align:center;" },
            { "name": "det_student", "title": "Detail Student", "style": "text-align:center;" },
            { "name": "det_hostel", "title": "Detail Residence", "style": "text-align:center;" },
            { "name": "sts_status_name_en", "title": "Status Academic", "breakpoints": "md sm xs", "style": "text-align:center;" },
            { "name": "checkIn_status", "title": "Check In Status", "style": "text-align:center;" },
            { "name": "checkOut_status", "title": "Check Out Status", "style": "text-align:center;" },


        ];

        let bil = 1;
        // let convertList = JSON.stringify(listData);
        // $("#dataList").val(convertList);
        var list = [];

        $.each(obj_ChkInOutPDF.data, function (i, field) {


            // console.log(field);
            if (field.checkOut_status !== null) { checkOutStatus = field.checkOut_status; } else { checkOutStatus = '-'; }
            if (field.checkOut !== null) { checkOut = field.checkOut; } else { checkOut = '-'; }
            // if (prog_kat !== null) { prog_kat = field.prog_category_id; } else { prog_kat = '-'; }
            // if (date_s !== null) { date_s = date_s; } else { date_s = '-'; }
            // if (date_e !== null) { date_e = date_e; } else { date_e = '-'; }
            // if (field.prog_alloc_approve !== null) { field.prog_alloc_approve = field.prog_alloc_approve; } else { field.prog_alloc_approve = '0'; }


            list.push({
                bil: bil++,
                det_student: '<span class="text-uppercase">' 
                            + field.sti_name +
                            '<br>'+ field.stud_id +
                            '<br>'+ field.sti_icno + '</span>',
                 det_hostel: '<span class="text-uppercase">' 
                            + field.clg_name +
                            '<br>'+ field.hostel_name +
                            '<br>'+ field.block_name +
                            '<br>'+ field.room_no + '</span>',
                sts_status_name_en: '<span class="text-uppercase">' + field.sts_status_name_en + '</span>',
                checkIn_status: '<span class="text-uppercase">' + field.checkIn_status 
                +'<br>'+ field.checkIn+'</span>',
                checkOut_status: '<span class="text-uppercase">' + checkOutStatus
                +'<br>'+ checkOut+
                '</span>',

                // prog_startdate: formatDate(date_s) + ' - ' + formatDate(date_e),
            });

        });

        $("#report_reportChkInOut").html('');
        $("#report_reportChkInOut").footable({
            "columns": colums,
            "rows": list,
            // "paging": {
            //     "enabled": true,
            //     "size": 10,
            //     "countFormat": "Showing {PF} to {PL} of {TR} data"
            // },
            // "filtering": {
            //     "enabled": true,
            //     "placeholder": "Search...",
            //     "dropdownTitle": "Search for:"
            // }
        });

        returnValue();
    });
}
