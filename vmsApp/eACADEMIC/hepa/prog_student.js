$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let token = window.sessionStorage.token;
    let idProgram = window.sessionStorage.idProgram;
    let catAdmin = window.sessionStorage.usrCatEadmin;
    let userRole = window.sessionStorage.userRole;

    if(token == null){
        window.location.replace("hepa_login.html");
    }

    $('#tempStd').html('<a target="_blank" href="'+host+'api_hep/public/template_std.xlsx"><span class="label blue">Template</span></a>');
    $('#prog_id').val(idProgram);

    if(userRole == 'admin'){
        $('.viewHepa').attr('disabled',false);
    } 
    else{ $('.viewHepa').attr('disabled',true); }
    if(window.sessionStorage.statusRekod === 'approved'){
        $('.approved').remove();
        $('.approvedView').attr('disabled',true);
        
    }

    // select Campus List
    campusList(function(){
        $('#upt_clg_id').append('<option value="">- Choose -</option>');
        $.each(obj_college.data, function (i, item){
            $('#upt_clg_id').append('<option value="'+item.pk_id+'">'+item.clg_name+'</option>');
        });
    });
    
    // student list
    participantsList(idProgram, function(){
        var columns = [
            { "name": "bil", "title": "No." },
            { "name": "att_nomatrik", "title": "Matric No." },
            { "name": "att_name", "title": "Name" },
            { "name": "att_notel", "title": "Phone No." },
            { "name": "att_cert", "title": "Certificate", "breakpoints": "md sm xs" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" }
        ];
        
        var list = [];
        let bil = 1;
        let convertDetList = JSON.stringify(obj_stdList.data);
        $("#dataList").val(convertDetList);

        $.each(obj_stdList.data, function(i, field){
            let certVal = field.prog_cert;
            let viewCert = '';
            // if( certVal != null ){ viewCert = '<a class="" title="Certificate" onclick="btn_cert(\''+field.id_peserta+'\')"><i class="fa fa-file-pdf-o" style="color: #ef193c"></i></a>' }
            viewCert = '<a class="" title="Certificate" onclick="btn_cert(\''+field.id_peserta+'\')"><i class="fa fa-file-pdf-o" style="color: #ef193c"></i></a>' 
            list.push({
                bil:bil++, att_nomatrik: '<span class="text-uppercase">'+field.att_nomatrik+'</span>', att_name: '<span class="text-uppercase">'+field.sti_name+'</span>', att_notel: field.sti_contactno_mobile,
                att_cert:  viewCert, upt_btn:  '<button class="btn btn-icon danger" title="Remove" onclick="del_rekod(\''+field.id_peserta+'\')"><i class="ion-trash-b" ></i></button>'
            });
        });

        $('#listData').html('');
        $("#listData").footable({
            "columns": columns,
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
    });

    showProgram(idProgram, function(){
        let data = obj_showProg.data;
        let progStatus = data.prog_status;
        let progProposal = data.prog_proposal;
        let progReport = data.prog_report;
        let progCert = '1677730059Template Sijil_4.jpg';
        let prog_peruntukan = data.prog_peruntukan;
        let prog_alloc_approve = data.prog_alloc_approve;
        // alloc_approve
        console.log(data);
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
            let docProposal = progProposal.slice(10);
            progProposal = '<a target="_blank" style="color:cornflowerblue" href="'+host+'api_hep/public/proposal/'+progProposal+'"><span class="label info">'+docProposal+'</span></a>';
        }

        if(!(progReport == '' || progReport == null)){
            let docReport = progReport.slice(10);

            progReport = '<a target="_blank" style="color:cornflowerblue" href="'+host+'api_hep/public/progAct_report/'+progReport+'"><span class="label info">'+docReport+'</span></a>';
        }

        console.log(progCert);
        
        if(!(progCert == '' || progCert == null)){
            let docCert = progCert.slice(10);
            let imgUrl = host+'api_hep/public/progAct_cert/'+progCert;
            // progCert = '<a target="_blank" style="color:cornflowerblue" href="'+imgUrl+'"><span class="label info">'+docCert+'</span></a>';

            toDataURL(imgUrl, function(dataURL){
                // console.log(dataURL);
                $('#imgUrl').val(dataURL);
            });
        }
        $('#view_prog_participate').html(data.prog_participate);
        $('#view_prog_cost').html(data.prog_cost);
        $('#view_clg_id').html(data.clg_name);
        $('#view_prog_title').html(data.prog_title);
        $('#view_prog_org').html(data.prog_org);
        $('#view_prog_kat').html(data.prog_category_id);
        $('#view_prog_vent').html(data.prog_vent);
        $('#view_prog_advisor').html(data.prog_advisor);
        $('#view_prog_venue').html(data.prog_venue);
        $('#view_date').html(formatDate(data.prog_startdate)+' - '+formatDate(data.prog_enddate));
        $('#view_prog_status').html(progStatus);
        $('#view_prog_statusremark').html(data.prog_statusremark);
        $('#view_progProposal').html(progProposal);
        if (prog_peruntukan != null){
            prog_peruntukanData = prog_peruntukan;
        }
        else{
            prog_peruntukanData ='0'
        }
        $('#prog_peruntukan').html('RM '+prog_peruntukanData);
        $('#view_progReport').html(progReport);
        $('#view_progCert').html(`<a style="color:cornflowerblue" onclick="btn_cert()"><span class="label info">To View Example Certificate</span></a>`);

        if (prog_alloc_approve != null){
            prog_alloc_approveData = prog_alloc_approve;
        }
        else{
            prog_alloc_approveData ='0'
        }
        $('#prog_alloc_approve').html('RM '+prog_alloc_approveData);
    });
});
var confirmed = false;


// btn Back to Programme List
$('#btnBack').click(function(){
    window.location.replace('hepaPage.html');
    window.sessionStorage.removeItem('idProgram');
});


// check format file .pdf before upload
$(".chkProposal").on("change", function(){
    // check size
    if(this.files[0].size > 5000000){
      alert("Please upload file less than 5MB. Thanks!!");
      $(this).val('');
    }

    // check type
    var extension = $(this).val().split('.').pop().toLowerCase();
    // console.log(extension);

    // extension !== 'pdf'
    if(extension !== 'pdf') {
        // if($.inArray(extension, ['pdf']) == -1) {
        alert('Please upload PDF file only.');
        $(this).val('');
    }
});


// check format file excel before upload
$("#excel_file").on("change", function(){
    // check type
    var extension = $(this).val().split('.').pop().toLowerCase();
    if($.inArray(extension, ['xlsx']) == -1) {
        alert('Please upload EXCEL(.xlsx) file only.');
        $(this).val('');
    }
});


// check format file image before upload
$("#prog_cert").on("change", function(){
    // check type
    var extension = $(this).val().split('.').pop().toLowerCase();
    if($.inArray(extension, ['jpeg','jpg','png']) == -1) {
        alert('Please upload Image(.jpeg, .jpg, .png) only.');
        $(this).val('');
    }
});


// check student exist
$('#att_nomatrik').on('input', function(){
    let input = $(this).val();
    chkStdExist(input, function(){
        if(result.data != ''){
            $('#check').html('');
            $('#btnSaveStd').prop('disabled', false);
            
        }
        else{
            $('#check').html('Not Found');
            $("#check").prop('class','text-danger');
            $('#btnSaveStd').prop('disabled', true);
        }
    });
});


//-------------------------------------------------- add student --------------------------------------------------//
$('#formAdd').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Student",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let prog_id = $('#prog_id').val();
            let att_nomatrik = $('#att_nomatrik').val();

            var form = new FormData();
            form.append("prog_id", prog_id);
            form.append("att_nomatrik", att_nomatrik);
            form.append("recordstatus", 'ADD');

            var settings = {
                "url": host+"api_hep/public/heppeserta/register",
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
//-------------------------------------------------- end add student --------------------------------------------------//


//-------------------------------------------------- delete student --------------------------------------------------//
function del_rekod(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("id_peserta", id);

    swal({
        title: "Remove Student",
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
            "url": host+"api_hep/public/heppeserta/delete",
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
//-------------------------------------------------- end delete student --------------------------------------------------//


// loadData Program & Activity
$('#btnMdlUpdate').click(function(){ 
    let id = $('#prog_id').val();
    showProgram(id, function(){
        let data = obj_showProg.data;
        // console.log(data);
        $('#id_program').val(data.id_program);
        $('#upt_clg_id').val(data.clgId);
        $('#upt_prog_title').val(data.prog_title);
        $('#upt_prog_org').val(data.prog_org);
        $('#upt_prog_kat').val(data.prog_category_id);
        $('#upt_prog_vent').val(data.prog_vent);
        $('#upt_prog_advisor').val(data.prog_advisor);
        $('#upt_prog_venue').val(data.prog_venue);
        $('#upt_prog_startdate').val(data.prog_startdate);
        $('#upt_prog_enddate').val(data.prog_enddate);
        $('#prog_status').val(data.prog_status).prop("disabled", false); 
        $('#prog_statusremark').val(data.prog_statusremark).prop("disabled", false);
        $('#upt_Approved').val(data.prog_alloc_approve);
        $('#upt_Requested').val(data.prog_peruntukan);
        $('#upt_prog_cost').val(data.prog_cost);
        
        if(!(data.prog_proposal == '' || data.prog_proposal == null)){
            $('#view_prog_proposal').html('<a target="_blank" class="btn btn-icon primary" href="'+host+'api_hep/public/proposal/'+data.prog_proposal+'" title="'+data.prog_proposal+'"><i class="fa fa-file-pdf-o"></i></a>');
            $('#exist_prog_proposal').val(data.prog_proposal);
        }

        if(!(data.prog_report == '' || data.prog_report == null)){
            $('#view_prog_report').html('<a target="_blank" class="btn btn-icon primary" href="'+host+'api_hep/public/progAct_report/'+data.prog_report+'" title="'+data.prog_report+'"><i class="fa fa-file-pdf-o"></i></a>');
            $('#exist_prog_report').val(data.prog_report);
        }

        if(!(data.prog_cert == '' || data.prog_cert == null)){
            $('#view_prog_cert').html('<a target="_blank" class="btn btn-icon primary" href="'+host+'api_hep/public/progAct_cert/'+data.prog_cert+'" title="'+data.prog_cert+'"><i class="fa fa-file-image-o"></i></a>');
            $('#exist_prog_cert').val(data.prog_cert);
        }
    });
});


//-------------------------------------------------- update Report --------------------------------------------------//
$('#formUptReport').on('submit', function(e){
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
            let pro_kat = $('#upt_prog_kat').val();
            let prog_vent = $('#upt_prog_vent').val();
            let prog_advisor = $('#upt_prog_advisor').val();
            let prog_venue = $('#upt_prog_venue').val();
            let prog_startdate = $('#upt_prog_startdate').val();
            let prog_enddate = $('#upt_prog_enddate').val();
            let prog_proposal = $('#upt_prog_proposal')[0].files[0];
            let exist_prog_proposal = $('#exist_prog_proposal').val();
            let prog_report = $('#prog_report')[0].files[0];
            let exist_prog_report = $('#exist_prog_report').val();
            let prog_cert = $('#prog_cert')[0].files[0];
            let exist_prog_cert = $('#exist_prog_cert').val();
            let prog_status = $('#prog_status').val();
            let prog_statusremark = $('#prog_statusremark').val();
            let notify_user = '';

            if( prog_status == 'Accept' || prog_status == 'Reject' ){ notify_user = 'Yes' }

            var form = new FormData();
            form.append("id_program", id_program);
            form.append("clg_id", clg_id);
            form.append("prog_title", prog_title);
            form.append("prog_org", prog_org);
            form.append("prog_category_id", pro_kat);
            form.append("prog_vent", prog_vent);
            form.append("prog_advisor", prog_advisor);
            form.append("prog_venue", prog_venue);
            form.append("prog_startdate", prog_startdate);
            form.append("prog_enddate", prog_enddate);
            form.append("prog_proposal", prog_proposal);
            form.append("exist_prog_proposal", exist_prog_proposal);
            form.append("prog_report", prog_report);
            form.append("exist_prog_report", exist_prog_report);
            form.append("prog_cert", prog_cert);
            form.append("exist_prog_cert", exist_prog_cert);
            form.append("prog_status", prog_status);
            form.append("prog_statusremark", prog_statusremark);
            form.append("notify_user", notify_user);
            form.append("recordstatus", 'EDT');

            var settings = {
                "url": host+"api_hep/public/hepProgram/uptReport",
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
//-------------------------------------------------- end update Report --------------------------------------------------//


//-------------------------------------------------- delete program & activity --------------------------------------------------//
$('#btnDelete').click(function(){
    let prog_id = $('#prog_id').val();
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("id_program", prog_id);

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
            window.location.replace('hepaPage.html');
        });
    });
});
//-------------------------------------------------- end delete program & activity --------------------------------------------------//


//-------------------------------------------------- upload excel --------------------------------------------------//
$("#form_excel").on('submit', function (e){
    if (!confirmed){
        e.preventDefault();
        read_file('excel_file');
    }
});

function read_file(file_name, colors){
    let selectedFile;
    selectedFile = $("#"+file_name)[0].files[0];
    
    let data=[{
      "name":"file_name",
      "data":"picoms",
    }];
    
    XLSX.utils.json_to_sheet(data, 'vms.xlsx');
    if(selectedFile){
        let fileReader = new FileReader();
        fileReader.readAsBinaryString(selectedFile);
        fileReader.onload = (event)=>{
         let data = event.target.result;
         let workbook = XLSX.read(data,{type:"binary"});
         workbook.SheetNames.forEach(sheet => {
            data_set = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
            
            $("#list_data").val(JSON.stringify(data_set));
            addExcelStd(data_set);
         });
        }
    }
}

function addExcelStd(dataStd){
    let prog_id = $('#prog_id').val();
    let dataLength = dataStd.length;
    
    $.each(dataStd, function(i, item){
        let noMatrik = item.no_matrik;
        let phone_no = item.phone_no;
        
        checkAttendance(prog_id, noMatrik, function(){
            let exist = obj_chkAttendance.data.length;
            if(exist == 0){
                var form = new FormData();
                form.append("prog_id", prog_id);
                form.append("att_nomatrik", noMatrik);
                form.append("att_notel", phone_no);
                form.append("recordstatus", 'ADD');
    
                var settings = {
                    "url": host+"api_hep/public/heppeserta/register",
                    "method": "POST",
                    "timeout": 0,
                    "headers": {
                        "Authorization": "picoms " + window.sessionStorage.token
                    },
                    "processData": false,
                    "mimeType": "multipart/form-data",
                    "contentType": false,
                    "data": form,
                    'async': false,
                };
    
                $.ajax(settings).done(function (response){
                    result = JSON.parse(response);
                    if (!result.success) {
                        Swal(result.message, result.data, "error");
                        return;
                    }
                });
            }
            if( i == dataLength-1 ){ window.location.reload() }
        });
    });
}
//-------------------------------------------------- end upload excel --------------------------------------------------//


function btn_cert(id){
    
    window.sessionStorage.idPeserta = id;
    window.sessionStorage.imgUrl = '1677730059Template_Sijil_4.jpg';
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


function participantsList(id, returnValue){
    var settings = {
        "url": host+"api_hep/public/heppeserta/list/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_stdList = response;
        returnValue();
    });
}

function showProgram(id, returnValue){
    var settings = {
        "url": host+"api_hep/public/hepProgram/show/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_showProg = response;
        returnValue();
    });
}

function checkAttendance(progId, id, returnValue){
    var form = new FormData();
    form.append("prog_id", progId);
    form.append("att_nomatrik", id);

    var settings = {
        "url": host+"api_hep/public/heppeserta/chkAttendance",
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
        obj_chkAttendance = JSON.parse(response);
        returnValue();
    });
}