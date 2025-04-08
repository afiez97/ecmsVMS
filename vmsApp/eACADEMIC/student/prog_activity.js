$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let userId = window.sessionStorage.std_studentid;
    $('#userId').val(userId);

    // select Campus List
    campusList(function(){
        $('#clg_id').append('<option value="">- Choose -</option>');
        $('#upt_clg_id').append('<option value="">- Choose -</option>');
        $.each(obj_college.data, function (i, item){
            $('#clg_id').append('<option value="'+item.pk_id+'">'+item.clg_name+'</option>');
            $('#upt_clg_id').append('<option value="'+item.pk_id+'">'+item.clg_name+'</option>');
        });
    });

    // list program apply by student
    listProgActByUser(userId, function(){
        let dataList = obj_progActByUsr.data;
        var colums = [
            { "name": "bil", "title": "No." },
            { "name": "clg_id", "title": "Campus" },
            { "name": "prog_title", "title": "Programme Name" },
            { "name": "prog_category_id", "title": "Programme Category" },
            { "name": "prog_startdate", "title": "Date", "breakpoints": "md sm xs" },
            // { "name": "prog_enddate", "title": "End Date", "breakpoints": "md sm xs" },
            { "name": "prog_cost", "title": "Cost Requested" },
            { "name": "prog_alloc_approve", "title": "Cost Approved" },
            { "name": "prog_status", "title": "Status" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];
    
        let bil = 1;
        let convertList = JSON.stringify(dataList);
        $("#dataApply").val(convertList);
        var list = [];
    
        $.each(dataList, function (i, field){
            let progStatus = field.prog_status;
            let btnDsply = '';
    
            if(progStatus == 'New'){
                progStatus = '<span class="label warning">'+progStatus+'</span>';
                btnDsply = '<button class="btn btn-icon success" title="Update" onclick="loadApplyData(\'' + i + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button> ' +
                            '<button class="btn btn-icon danger" title="Delete" onclick="delData(\''+field.id_program+'\')"><i class="ion-trash-a"></i></button>';
            }
            else if(progStatus == 'Accept'){
                progStatus = '<span class="label success">'+progStatus+'</span>';
                btnDsply = '<button class="btn btn-icon accent" title="Details" onclick="detail(\''+field.id_program+'\', \'accept\')"><i class="ion-ios-list-outline"></i></button>';
            }
            else if(progStatus == 'Reject'){
                progStatus = '<span class="label danger">'+progStatus+'</span>';
                btnDsply = '<button class="btn btn-icon accent" title="View" onclick="viewData(\''+i+'\')"><i class="ion-eye"></i></button>';
            }
            else if(progStatus == 'Approved'){
                progStatus = '<span class="label success">'+progStatus+'</span>';
                btnDsply = '<button class="btn btn-icon accent" title="Details" onclick="detail(\''+field.id_program+'\', \'approved\')"><i class="ion-ios-list-outline"></i></button>';
            }
            field.prog_alloc_approve = field.prog_alloc_approve !== null ? field.prog_alloc_approve : '<span class="md-btn md-flat m-b-sm w-xs text-danger">pending</span>';

            list.push({
                bil: bil++, 
                clg_id: field.clg_name, 
                prog_title: '<span class="text-uppercase">'+field.prog_title+'</span>', 
                prog_org: '<span class="text-uppercase">'+field.prog_org+'</span>', 
                prog_category_id: '<span class="text-uppercase">'+field.prog_category_id+'</span>', 
                prog_startdate: formatDate(field.prog_startdate)+' - '+formatDate(field.prog_enddate), 
                prog_cost: '<span class="text-uppercase">'+field.prog_cost+'</span>', 
                prog_alloc_approve: '<span class="text-uppercase">'+field.prog_alloc_approve+'</span>', 
                prog_status: progStatus, upt_btn: btnDsply
            });
        });
        
        $("#tblApplication").footable({
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

    // list program participate by student
    listProgParticipate(userId, function(){
        var colums = [
            { "name": "bil", "title": "No." },
            { "name": "prog_title", "title": "Programme" },
            { "name": "prog_date", "title": "Date" },
            { "name": "prog_venue", "title": "Venue" },
            { "name": "upt_btn", "title": "eCertificate", "breakpoints": "md sm xs" },
        ];

        let bil = 1;
        let convertList = JSON.stringify(obj_participate.data);
        $("#dataParticipate").val(convertList);
        var list = [];

        $.each(obj_participate.data, function (i, field){
            let progStatus = field.prog_status;
            if(progStatus != null){
                progStatus = progStatus.toUpperCase();
            }

            let certVal = field.prog_cert;
            let viewCert = '';
            // if( certVal != null ){
            //     viewCert = '<a class="" title="Certificate" onclick="btn_cert(\''+field.id_peserta+'\',\''+certVal+'\')"><i class="fa fa-file-pdf-o" style="color: #ef193c"></i></a>';
            // }
            viewCert = '<a class="" title="Certificate" onclick="btn_cert(\''+field.id_peserta+'\')"><i class="fa fa-file-pdf-o" style="color: #ef193c"></i></a>';

            list.push({
                bil: bil++, prog_title: '<span class="text-uppercase">'+field.prog_title+'</span>', prog_date: formatDate(field.prog_startdate)+' - '+formatDate(field.prog_enddate), 
                prog_venue: '<span class="text-uppercase">'+field.prog_venue+'</span>', upt_btn: viewCert
            });
        });

        $("#tblParticipation").footable({
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
});
var confirmed = false;


// check format file before upload
$(".chkProposal").on("change", function(){
    // check size
    if(this.files[0].size > 5000000){
      alert("Please upload file less than 5MB. Thanks!!");
      $(this).val('');
    }

    // check type
    var extension = $(".chkProposal").val().split('.').pop().toLowerCase();
    // if($.inArray(extension, ['pdf']) == -1) {
    //     alert('Please upload PDF file only.');
    //     $(this).val('');
    // }
});


//-------------------------------------------------- add activity --------------------------------------------------//
$('#formAddActivity').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Program & Activity",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let clg_id = $('#clg_id').val();
            let prog_title = $('#prog_title').val();
            let prog_org = $('#prog_org').val();
            let prog_kat = $('#prog_kat').val();
            let prog_vent = $('#prog_vent').val();
            let prog_advisor = $('#prog_advisor').val();
            let prog_venue = $('#prog_venue').val();
            let prog_startdate = $('#prog_startdate').val();
            let prog_enddate = $('#prog_enddate').val();
            let prog_participate = $('#prog_participate').val();

            let prog_proposal = $('#prog_proposal')[0].files[0];
            let user_id = $('#userId').val();
            
            let prog_peruntukan = $('#prog_peruntukan').val();
            let prog_cost = $('#prog_cost').val();


            var form = new FormData();
            form.append("clg_id", clg_id);
            form.append("prog_title", prog_title);
            form.append("prog_org", prog_org);
            form.append("prog_category_id", prog_kat);
            form.append("prog_vent", prog_vent);
            form.append("prog_advisor", prog_advisor);
            form.append("prog_venue", prog_venue);
            form.append("prog_startdate", prog_startdate);
            form.append("prog_enddate", prog_enddate);
            form.append("prog_proposal", prog_proposal);
            form.append("user_id", user_id);
            form.append("user_type", 'student');
            form.append("prog_status", 'New');
            form.append("recordstatus",'ADD');

            form.append("prog_participate", prog_participate);
            form.append("prog_peruntukan", prog_peruntukan);
            form.append("prog_cost", prog_cost);


            var settings = {
                "url": host+"api_hep/public/hepProgram/register",
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
//-------------------------------------------------- end add activity --------------------------------------------------//


// details programme
function loadData(indexs){ 
    let data = JSON.parse($("#dataList").val());
    let progVent = data[indexs].prog_vent;
    console.log(data[indexs]);
    if( progVent != null ){ progVent = progVent.toUpperCase() }
    else{ progVent = '' }

    let progAdv = data[indexs].prog_advisor;
    if( progAdv != null ){ progAdv = progAdv.toUpperCase() }
    else{ progAdv = '' }

    let progVenue = data[indexs].prog_venue;
    if( progVenue != null ){ progVenue = progVenue.toUpperCase() }
    else{ progVenue = '' }

    let progRemark = data[indexs].prog_statusremark;
    if( progRemark != null ){ progRemark = progRemark.toUpperCase() }
    else{ progRemark = '' }

    let certData = data[indexs].prog_cert;
    if( certData != null ){ certData = certData }
    else{ certData = '' }
    $('#upt_clg_id').html(data[indexs].clg_name);
    $('#upt_prog_kat').html(data[indexs].prog_category_id.toUpperCase());
    $('#upt_prog_org').html(data[indexs].prog_org.toUpperCase());
    $('#upt_prog_vent').html(progVent); //cooperation
    $('#upt_prog_advisor').html(progAdv);
    $('#upt_prog_venue').html(progVenue);
  

    $('#upt_prog_cost').html(data[indexs].prog_cost);
    $('#upt_prog_peruntukan').html(data[indexs].prog_peruntukan);
    $('#upt_prog_participate').html(data[indexs].prog_participate);
    // $('#upt_prog_proposal').html(data[indexs].prog_proposal);
    

    $('#id_program').val(data[indexs].id_program);
    $('#upt_prog_title').html(data[indexs].prog_title.toUpperCase());
    $('#upt_prog_startdate').html(data[indexs].prog_startdate); 
    $('#upt_prog_enddate').html(data[indexs].prog_enddate);
    $('#prog_statusremark').html(progRemark);
    $('#view_prog_cert').html('<a target="_blank" style="color:cornflowerblue" href="'+host+'api_hep/public/proposal/'+certData+'">'+certData+'</a>');

    // $("#update-program").modal("show");
}

//-------------------------------------------------- loadData Apply Program --------------------------------------------------//
function loadApplyData(indexs){ 

    let data = JSON.parse($("#dataApply").val());

    let test = data[indexs].prog_category_id;
    $('#id_program').val(data[indexs].id_program);
    $('#upt_clg_id').val(data[indexs].clgId);
    $('#upt_prog_title').val(data[indexs].prog_title);
    $('#upt_prog_org').val(data[indexs].prog_org);
    $('#upt_prog_kat').val(data[indexs].prog_category_id);
    $('#upt_prog_vent').val(data[indexs].prog_vent);
    $('#upt_prog_advisor').val(data[indexs].prog_advisor);
    $('#upt_prog_venue').val(data[indexs].prog_venue);
    $('#upt_prog_startdate').val(data[indexs].prog_startdate);
    $('#upt_prog_enddate').val(data[indexs].prog_enddate);
    console.log(data[indexs].prog_category_id);
    

    $('#upt_prog_cost').val(data[indexs].prog_cost);
    $('#upt_prog_peruntukan').val(data[indexs].prog_peruntukan);
    $('#upt_prog_participate').val(data[indexs].prog_participate);
    // $('#upt_prog_proposal').val(data[indexs].prog_proposal);
    
    if(!(data[indexs].prog_proposal == '' || data[indexs].prog_proposal == null)){
        $('#view_prog_proposal').html('<a target="_blank" class="btn btn-icon primary" href="'+host+'api_hep/public/proposal/'+data[indexs].prog_proposal+'" title="'+data[indexs].prog_proposal+'"><i class="fa fa-file-pdf-o"></i></a>');
        $('#exist_prog_proposal').val(data[indexs].prog_proposal);
    }
    else{
        $('#view_prog_proposal').html('<button type="button" class="btn btn-icon"><i class="fa fa-file-pdf-o"></i></button>');
        $('#exist_prog_proposal').val('');
    }   

    $("#update-program").modal("show");
}

function viewData(indexs){ 
    let data = JSON.parse($("#dataApply").val());
    let progStatus = data[indexs].prog_status;
    let progProposal = data[indexs].prog_proposal;
    let viewProposal = '';
    
    if(progStatus == 'New'){
        progStatus = '<span class="label warning">'+progStatus+'</span>';
    }
    else if(progStatus == 'Accept'){
        progStatus = '<span class="label success">'+progStatus+'</span>';
    }
    else if(progStatus == 'Reject'){
        progStatus = '<span class="label danger">'+progStatus+'</span>';
    }

    if(!(progProposal == '' || progProposal == null)){
        viewProposal = '<a target="_blank" style="color:cornflowerblue" href="'+host+'api_hep/public/proposal/'+data[indexs].prog_proposal+'"><span class="label info">Document</span></a>';
    }

    $('#view_clg_id').html(data[indexs].clg_name);
    $('#view_prog_title').html(data[indexs].prog_title);
    $('#view_prog_org').html(data[indexs].prog_org);
    $('#view_prog_vent').html(data[indexs].prog_vent);
    $('#view_prog_advisor').html(data[indexs].prog_advisor);
    $('#view_prog_venue').html(data[indexs].prog_venue);
    $('#view_prog_startdate').html(formatDate(data[indexs].prog_startdate)+' - '+formatDate(data[indexs].prog_enddate));
    // $('#view_prog_enddate').html();
    $('#view_prog_status').html(progStatus);
    $('#view_prog_statusremark').html(data[indexs].prog_statusremark);
    $('#view_progProposal').html(viewProposal);

    // update notify=No
    var form = new FormData();
    form.append("id_program", data[indexs].id_program);
    form.append("notify_user", 'No');

    var settings = {
        "url": host+"api_hep/public/hepProgram/uptNotifyUser",
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

    $("#view-program").modal("show");
}
//-------------------------------------------------- end loadData Apply Program --------------------------------------------------//


//-------------------------------------------------- update new data --------------------------------------------------//
$('#formUptProgramme').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Program & Activity",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let id_program = $('#id_program').val();
            let clg_id = $('#upt_clg_id').val();
            let prog_title = $('#upt_prog_title').val();
            let prog_org = $('#upt_prog_org').val();
            let prog_kat = $('#upt_prog_kat').val();
            let prog_vent = $('#upt_prog_vent').val();
            let prog_advisor = $('#upt_prog_advisor').val();
            let prog_venue = $('#upt_prog_venue').val();
            let prog_startdate = $('#upt_prog_startdate').val();
            let prog_enddate = $('#upt_prog_enddate').val();
            let prog_proposal = $('#upt_prog_proposal')[0].files[0];
            let exist_prog_proposal = $('#exist_prog_proposal').val();
            var form = new FormData();
            form.append("id_program", id_program);
            form.append("clg_id", clg_id);
            form.append("prog_title", prog_title);
            form.append("prog_org", prog_org);
            form.append("prog_kat", prog_kat);
            form.append("prog_vent", prog_vent);
            form.append("prog_advisor", prog_advisor);
            form.append("prog_venue", prog_venue);
            form.append("prog_startdate", prog_startdate);
            form.append("prog_enddate", prog_enddate);
            form.append("prog_proposal", prog_proposal);
            form.append("exist_prog_proposal", exist_prog_proposal);
            form.append("recordstatus",'EDT');

            var settings = {
                "url": host+"api_hep/public/hepProgram/uptNewByStd",
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
//-------------------------------------------------- end update new data --------------------------------------------------//


//-------------------------------------------------- delete program & activity --------------------------------------------------//
function delData(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("id_program", id);

    swal({
        title: "Remove Programme & Activity",
        text: "Are You Sure?",
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Remove",
        confirmButtonColor: "#ef193c",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false
    }).then(function (){
        var settings = {
            "url": host+"api_hep/public/hepProgram/delete",
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
//-------------------------------------------------- end delete program & activity --------------------------------------------------//


// student list
function detail(id, statusRekod){
    var form = new FormData();
    form.append("id_program", id);
    form.append("notify_user", 'No');

    var settings = {
        "url": host+"api_hep/public/hepProgram/uptNotifyUser",
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

    window.sessionStorage.idProgram = id;
    window.sessionStorage.statusRekod = statusRekod;
    
    window.location.replace('prog_student.html');
}


function btn_cert(id){
    // let imgUrl = host+'api_hep/public/progAct_cert/';
    // toDataURL(imgUrl, function(dataURL){
    //     window.sessionStorage.imgUrl = dataURL;
    // });
        
    window.sessionStorage.imgUrl = '1677730059Template_Sijil_4.jpg';
    window.sessionStorage.idPeserta = id;
    window.open('certificate.html');
}


function toDataURL(src, callback){
    var image = new Image();
    image.crossOrigin = 'Anonymous';
    image.onload = function(){
       var canvas = document.createElement('canvas');
       var context = canvas.getContext('2d');
       canvas.height = this.naturalHeight;
       canvas.width = this.naturalWidth;
       context.drawImage(this, 0, 0);
       var dataURL = canvas.toDataURL('image/jpeg');
       callback(dataURL);
    };
    image.src = src;
}


function listProgParticipate(id, returnValue){
    var settings = {
        "url": host+"api_hep/public/heppeserta/listByStd/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_participate = response;
        returnValue();
    });
}

function listProgActByUser(id, returnValue){
    var settings = {
        "url": host+"api_hep/public/hepProgram/listByUser/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_progActByUsr = response;
        returnValue();
    });
}

