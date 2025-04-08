$(function () {
    $.ajaxSetup({
        cache: false
    });
    $.fn.select2.defaults.set( "theme", "bootstrap" );

    let userId = window.sessionStorage.usrId;
    let catAdmin = window.sessionStorage.usrCatEadmin;
    let userRole = window.sessionStorage.userRole;
    listAduanRosak(function(){
                let dataList = obj_aduanResponden.data;
                createTblResponden(dataList, userId);
            });


    // // select Campus List
    // campusList(function(){
    //     $('#upt_clg_id').append('<option value="">- Choose -</option>');
    //     $.each(obj_college.data, function (i, item){
    //         $('#upt_clg_id').append('<option value="'+item.pk_id+'">'+item.clg_name+'</option>');
    //     });
    // });


    // // select Type
    // hep_jenisaduanHostel(function(){
    //     $('#aduan_type').html('');
    //     $('#upt_aduan_type').html('');
    //     $('#aduan_type').append('<option value="">- Choose -</option>');
    //     $('#upt_aduan_type').append('<option value="">- Choose -</option>');
    //     $.each(obj_aduanType.data, function(i, item){
    //         $('#aduan_type').append('<option value="'+item.pk_id+'">'+item.description+'</option>');
    //         $('#upt_aduan_type').append('<option value="'+item.pk_id+'">'+item.description+'</option>');
    //     });
    // });


    // if(userRole == 'admin'){
    //     // view admin hepa
    //     listAduanRosak(function(){
    //         let dataList = obj_report.data;
    //         createTbl(dataList, userId);
    //     });
    //     // $('#upt_aduan_status').attr('disabled', false);
    //     $('#aduan_warden_assigned').attr('disabled', false);
    // } 
    // else if(userRole == 'warden'){
    //     // view user login
    //     listReportUsr(userId, function(){
    //         let dataList = obj_repUsr.data;
    //         createTbl(dataList, userId);
    //     });
    //     // $('#upt_aduan_status').attr('disabled', true);
    //     $('#aduan_warden_assigned').attr('disabled', true);
    // }




});
var confirmed = false;



// check format file & size before upload
$(".chkFormat").on("change", function(){
    // check size
    if(this.files[0].size > 3000000){
      alert("Please upload file less than 3MB. Thanks!!");
      $(this).val('');
    }

    // check type
    var extension = $(this).val().split('.').pop().toLowerCase();
    if($.inArray(extension, ['pdf','jpg','jpeg','png']) == -1) {
        alert('Please upload PDF file or Image only.');
        $(this).val('');
    }
});




//-------------------------------------------------- loadData Report --------------------------------------------------//
function loadData(index){
    let data = JSON.parse($("#dataList").val());
    let aduanType = data[index].id_jenisaduan;
    let aduanView = data[index].aduan_upload;
    let viewUpload = '';

// console.log(aduanView);
    $('#upt_aduanId').val(data[index].pk_id);
    $('#upt_FK_clg').html(data[index].clg_name);
    $('#upt_StudentDet').html(data[index].sti_name +` (`+data[index].FK_idStudent +`)`);

    $('#upt_FK_room').html(data[index].FK_room);
    $('#upt_FK_jenisaduanHostel').html(data[index].aduan_nama);
    $('#upt_aduan_details').html(data[index].aduan_details);
    // $('#upt_counselling_reason').val(data[index].FK_idStudent);

    if(!(aduanView == '' || aduanView == null)){
        viewUpload = '<a target="_blank" style="color:cornflowerblue" href="'+host+'api_hep/public/aduanHostel/'+aduanView+'"><span class="label info">Document</span></a>';
    }
    
    $('#upt_aduan_upload').html(viewUpload);
    $('#upt_aduan_type').html(data[index].FK_jenisaduanHostel);
    $('#upt_aduan_venue').html(data[index].aduan_venue);
    $('#upt_aduan_remark').html(data[index].aduan_remark);
    $('#upt_aduan_date').html(formatDate(data[index].aduan_date));
    $('#upt_aduan_status').val(data[index].aduan_status);
    $('#aduan_warden_remark').html(data[index].aduan_warden_remark);

    // if(!(data[index].aduan_upload == '' || data[index].aduan_upload == null)){
    //     $('#view_aduan_upload').html('<a target="_blank" class="btn btn-icon primary" href="'+host+'api_hep/public/aduan/'+data[index].aduan_upload+'" title="'+data[index].aduan_upload+'"><i class="fa fa-file-pdf-o"></i></a>');
    //     $('#upt_aduan_upload').val(data[index].aduan_upload);
    // }
    // else{
    //     $('#view_aduan_upload').html('<button type="button" class="btn btn-icon"><i class="fa fa-file-pdf-o"></i></button>');
    //     $('#upt_aduan_upload').val('');
    // }

    // warden list
    listWarden(function(){
        $('#aduan_warden_assigned').append('<option value="">- Choose -</option>');
        $.each(obj_warden.data, function(i, item){
        console.log(item);

            $('#aduan_warden_assigned').append('<option value="'+item.emp_warden+'">'+item.emp_name.toUpperCase()+'</option>');
        });
        $('#aduan_warden_assigned').val(data[index].aduan_warden_assigned);

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:',
        });
    });

    if( aduanType == '00' ){ $('.divUptKerosakan').show() }
    else{ $('.divUptKerosakan').hide() }

    $('#modalUpdate').modal('show');
}



// view data
function loadViewData(index, userId){
    let data = JSON.parse($("#dataList").val());
    console.log(data);
    let aduanType = data[index].FK_jenisaduanHostel;
    let aduanStts = data[index].aduan_status;
    let aduanUpload = data[index].aduan_upload;
    let wardenId = data[index].aduan_warden_assigned;
    let viewUpload = '';

    let venue = `<strong>`+data[index].FK_room+` </strong><br>`
    +data[index].block_name+`<br>`+data[index].hostel_name+`<br>`+data[index].clg_name;

    if(!(aduanUpload == '' || aduanUpload == null)){
        viewUpload = '<a target="_blank" style="color:cornflowerblue" href="'+host+'api_hep/public/aduanHostel/'+aduanUpload+'"><span class="label info">Document</span></a>';
    }   
    $('#view_aduanId').val(data[index].id_aduan);
    $('#view_clg_id').html(data[index].clg_name);
    $('#view_FK_jenisaduanHostel').html(data[index].aduan_nama);
    $('#view_aduan_venue').html(venue);
    $('#view_upload').html(viewUpload);
    $('#view_aduan_remark').html(data[index].aduan_remarks);
    $('#view_aduan_date').html(formatDate(data[index].aduan_date));
    $('#view_aduan_warden_assigned').html(data[index].PIC_aduan);
    $('#view_aduan_warden_remark').html(data[index].aduan_warden_remark);

    if( aduanType == 2 ){ $('.sttsKerosakan').removeClass('collapse'); }
    else{ $('.sttsKerosakan').addClass('collapse'); }

    $('.divRemarkKerosakan').hide();
    // $('#view_aduan_warden_remark').hide();
    if( aduanStts == 'New' ){ $('#view_aduan_status').html('<span class="label warning">'+aduanStts+'</span>'); }
    else if( aduanStts == 'Accept' ){ 
        $('#view_aduan_status').html('<span class="label success">'+aduanStts+'</span>');
        $('.divRemarkKerosakan').show();
        // console.log(data[index].aduan_warden_assigned);
        if( wardenId == userId ){ $('.divRemarkKerosakan').attr('disabled', false); }
        else{ $('.divRemarkKerosakan').attr('disabled', true); }
    }
    // else if( aduanStts == 'Complete' ){
    //     $('#view_aduan_status').html('<span class="label grey">'+aduanStts+'</span>');
    //     $('#view_aduan_warden_remark').show();
    // }

    $('#modalView').modal('show');
}
//-------------------------------------------------- end loadData Report --------------------------------------------------//

// select Type
aduanType(function () {
    $("#aduan_type").html("");
    // $("#upt_FK_jenisaduanHostel").html("");
    // $("#aduan_type").append('<option value="">- Choose -</option>');
    // $("#upt_FK_jenisaduanHostel").append('<option value="">- Choose -</option>');
    $.each(obj_aduanType.data, function (i, item) {
        console.log(item);
        $("#FK_jenisaduanHostel").append(
            '<option value="' + item.pk_id + '">' + item.aduan_nama + "</option>"
        );
        // $("#upt_FK_jenisaduanHostel").append(
        //     '<option value="' + item.pk_id + '">' + item.aduan_nama + "</option>"
        // );
    });
});
$('#formUptReport').on('submit', function (e) {
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Update Complaint Type",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let pk_id = $('#upt_aduanId').val();
            // let clg_id = $('#upt_clg_id').val();
            // let stud_icno = $('#upt_stud_icno').val();
            // let aduan_type = $('#upt_aduan_type').val();
            // let aduan_venue = $('#upt_aduan_venue').val();
            // let aduan_remark = $('#upt_aduan_remark').val();
            // let aduan_date = $('#upt_aduan_date').val();
            let aduan_status = $('#upt_aduan_status').val();
            let aduan_warden_assigned = $('#aduan_warden_assigned').val();
            let aduan_warden_remark = $('#aduan_warden_remark').val();
            // let aduan_upload = $('#upt_aduan_upload')[0].files[0];
            // let exist_aduan_upload = $('#exist_aduan_upload').val();

            // let aduan_alert = 0;
            // if( aduan_status == 'Complete' ){ aduan_alert = 1; }

            // if( aduan_type == 2 ){
            //     if( aduan_warden_assigned != '' ){ aduan_status = 'Accept' }
            // }

            var form = new FormData();
            form.append("pk_id", pk_id);
            // form.append('clg_id', clg_id);
            // form.append("stud_icno", stud_icno);
            // form.append("aduan_type", aduan_type);
            // form.append("aduan_venue", aduan_venue);
            // form.append("aduan_remark", aduan_remark);
            // form.append("aduan_date", aduan_date);
            form.append("aduan_status", aduan_status);
            form.append("aduan_warden_assigned", aduan_warden_assigned);
            form.append("aduan_warden_remark", aduan_warden_remark);
            // form.append("aduan_upload", aduan_upload);
            // form.append("exist_aduan_upload", exist_aduan_upload);
            // form.append("aduan_alert", aduan_alert);
            form.append("recordstatus",'EDT');

            var settings = {
                "url": host + "api_hep/public/hep_aduanResponden/update",
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
            });
        });
    }
});
//-------------------------------------------------- end update Complaint --------------------------------------------------//



// delete Aduan
function delData(id) {
    var form = new FormData();
    // form.append("recordstatus", 'DEL');  
    form.append("pk_id", id);

    swal({
        title: "Remove Complaint Type",
        text: "Are You Sure?",
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Remove",
        confirmButtonColor: "#ef193c",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false
    }).then(function () {
        var settings = {
            "url": host + "api_hep/public/hep_aduanResponden/delete",
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
        });
    });
}




//-------------------------------------------------- function create table --------------------------------------------------//
function createTblResponden(dataList, userId){
    var colums = [
        { "name": "bil", "title": "No." },
        { "name": "kediaman", "title": "Location", "width": 150  },

        // { "name": "clg_id", "title": "Campus" },
        { "name": "FK_idStudent", "title": "Detail Student" },
        { "name": "remarkByPIC", "title": "Remarks PIC" },
        { "name": "aduan_type", "title": "Type" },
        { "name": "aduan_date", "title": "Date" },
        { "name": "aduan_status", "title": "Status" },
        { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
    ];

    let bil = 1;
    let convertList = JSON.stringify(dataList);
    $("#dataList").val(convertList);
    var list = [];

    $.each(dataList, function (i, field){
        // console.log(field);
        let aduanStatus = field.aduan_status;
        let viewBtn = ''; let label = '';
        if( aduanStatus == 'New' ){
            viewBtn = '<button class="btn btn-icon success" title="Update" onclick="loadData(\'' + i + '\')" ><i class="ion-android-create"></i></button>';
            
            label = '<span class="label warning">'+aduanStatus+'</span>';
        }
        else if( aduanStatus == 'Accept' ){
            viewBtn = '<button class="btn btn-icon success" title="Update" onclick="loadData(\'' + i + '\')" ><i class="ion-android-create"></i></button>';
            // viewBtn = '<button style="margin-right: 2px;" class="btn btn-icon accent" title="View" onclick="loadViewData(\'' +i+ '\', \'' +userId+ '\')" ><i class="ion-eye"></i></button>'+
            // '<button class="btn btn-icon success" title="Update" onclick="loadData(\'' + i + '\')" ><i class="ion-android-create"></i></button>';
            label = '<span class="label success">'+aduanStatus+'</span>';
        }
        else if( aduanStatus == 'Complete' ){
            viewBtn = '<button class="btn btn-icon accent" title="View" onclick="loadViewData(\'' + i + '\')" ><i class="ion-eye"></i></button>';
            label = '<span class="label grey">'+aduanStatus+'</span>';
        }
        else if( aduanStatus == 'Reject' ){
            viewBtn = '<button class="btn btn-icon danger" title="Delete" onclick="delData(\'' + field.pk_id + '\')"><i class="ion-trash-a"></i></button>';
            label = '<span class="label orange">'+aduanStatus+'</span>';
        }else{
            label = '<span class="label">'+aduanStatus+'</span>';
        }
        if (field.aduan_nama !== null) { namaAduan = field.aduan_nama; } else { namaAduan = '-'; }
        
        // console.log(field.aduan_warden_remark);
        // `  
        // <span>`+ field.hostel_name +`</span><br>
        // <span>`+ field.block_name +`</span> <br>
        // <strong class="text-uppercase">`+field.FK_room+`</strong>`,
        list.push({
            bil: bil++, 
            // kediaman: `  
            // <span>`+ field.hostel_name +`</span><br>
            // <span>`+ field.block_name +`</span> <br>`,
            kediaman: `<span style="width: 150px; display: inline-block;">  
            <span>`+ field.hostel_name +`</span><br>
            <span>`+ field.block_name +`</span> <br></span>`,
            FK_idStudent:` <strong class="text-uppercase">`+field.sti_name+`</strong><br>
                              <span>`+ field.FK_idStudent +`</span>`, 
            
            aduan_type: '<span class="text-uppercase">'+namaAduan+'</span>', 
            remarkByPIC: field.aduan_warden_remark, 
            // remarkByPIC: '<span class="text-uppercase">'+field.aduan_warden_remark+'</span>', 
            aduan_date: formatDate(field.aduan_date), 
            aduan_status: label,
            upt_btn: viewBtn
        });
    });

   

    $("#aduanResponden").html('');
    $("#aduanResponden").footable({
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
        }
    });
}
//-------------------------------------------------- end function create table --------------------------------------------------//



//-------------------------------------------------- update Complete --------------------------------------------------//
$('#formUptComplete').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Complete Report",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let id_aduan = $('#view_aduanId').val();
            let aduan_warden_remark = $('#aduan_warden_remark').val();

            var form = new FormData();
            form.append("id_aduan", id_aduan);
            form.append("aduan_status", 'Complete');
            form.append("aduan_warden_remark", aduan_warden_remark);
            form.append("aduan_alert", 1);
            form.append("rec    ordstatus",'EDT');

            var settings = {
                "url": host+"api_hep/public/hepaduan/uptComplete",
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
//-------------------------------------------------- end update Complete --------------------------------------------------//


function listAduanRosak(returnValue) {
    var settings = {
        "url": host + "api_hep/public/hep_aduanResponden/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_aduanResponden = response;
        returnValue();
    });
}

function hep_jenisaduanHostel(returnValue){
    var settings = {
        "url": host+"api_hep/public/hep_jenisaduanHostel/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_aduanType = response;
        returnValue();
    });
}

function aduanType(returnValue) {
    var settings = {
        "url": host + "api_hep/public/hep_jenisaduanHostel/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_aduanType = response;
        returnValue();
    });
}

