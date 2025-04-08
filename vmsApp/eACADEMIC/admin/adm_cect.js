var searchid='', fruits = [];
$(function(){
    $.ajaxSetup ({
        cache: false
    });
    $("#loading_modal").modal('show');


// start for add cect
    var timer;

    $("#studentid").on("keyup", function () {
      searchid = $(this).val().trim();
  
      clearInterval(timer);
      timer = setTimeout(function () {
        console.log('User finished typing !!' + searchid);
  
        student_info(searchid);
      }, 1000);
    });
// end for add cect
    
    cectList(function(){
        $("#list_cect").html('');
        let columns = [
            { "name": "bil", "title": "No." },
            { "name": "studentid", "title": "Matric No." },
            { "name": "sti_name", "title": "Name" },
            { "name": "pgm_name", "title": "Programme", "breakpoints": " sm xs" },
            { "name": "std_semester", "title": "Semester", "breakpoints": " sm xs" },
            { "name": "sts_cect", "title": "Status", "breakpoints": " sm xs" },
            { "name": "upt_btn", "title": "Action", "breakpoints": " sm xs"},
        ];
        
        let list = [];
        let bil = 1;

        if(obj_cect.success){
            let convertList = JSON.stringify(obj_cect.data);
            $("#dataList").val(convertList);

            $.each(obj_cect.data,function(i, field){    
                statusLabel = '';
                // console.log(field);
                statusLabel
                if (field.approval_coor == 'Support' && field.approval_admin=='Approve' ) {
                    statusLabel = '<span class="label green">Approve</span>';

           
                }
                 else if(field.approval_admin=='' && field.approval_coor == 'Support'){
                    statusLabel = '<span class="label yellow">In Progress</span>';
                    
                } else if(field.approval_admin=='' && field.approval_coor == ''){
                    statusLabel = '<span class="label blue">New</span>';
                    
                }



                list.push({
                    bil: bil++, 
                    studentid: '<span class="text-uppercase">'+field.studentid+'</span>', 
                    sti_name: '<span class="text-uppercase">'+field.sti_name+'</span>', 
                    pgm_name: '<span class="text-uppercase">'+field.pgmId+'</span>', 
                    std_semester: field.std_semester,
                    sts_cect: statusLabel,
                    upt_btn: '<button onclick="cect_detMain(\''+i+'\')" class="btn btn-icon btn-info"><i class="fa fa-envelope-o"></i></button>'
                });                
            });
        }

        $("#list_cect").footable({
            "columns": columns,
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
        $("#loading_modal").modal('hide');
    });
});


function cect_detMain(index){
    let d = JSON.parse($("#dataList").val());
    let data = d[index];

    window.sessionStorage.cectId = data.id;
    window.sessionStorage.stdId = data.studentid;
    window.location.replace('cect_proses.html');
}


function cectList(returnValue){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/cect/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };
    
    $.ajax(settings).done(function (response){
      obj_cect = response;
      returnValue();
    });    
}


//start function for add cect

function student_info(idstd){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/pelajar/show/det/"+idstd,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
          },
    };

    $.ajax(settings).done(function (response){
      obj_stdInfo = response;

        let dataStd = obj_stdInfo.data;
        let pgm_id = dataStd.pgm_fk;
        let session = dataStd.sti_session_id.replace("-", "/");
        let intake = dataStd.cur_intake;

        $("#pgm_id").val(pgm_id);
        $("#std_name").val(dataStd.sti_name);
        $("#programme").val(dataStd.pgm_name);
        $('#type_register').attr('readonly', false);

        findPGMid(pgm_id, intake, function () {
            let pgmDetId = obj_pgmDet.data.dtp_id;
            $("#pgmDet_id").val(pgmDetId);
            listCrsByPgmDet(pgmDetId, function () {
                $("#course_code").append('<option value="">- Choose -</option>');
                $("#upt_course_code").append('<option value="">- Choose -</option>');
                $.each(obj_cotDet.data, function (i, item) {
                    let course =
                        item.crs_code.toUpperCase() + " - " + item.crs_name.toUpperCase();
                    $("#course_code").append(
                        '<option value="' + item.fk_course + '">' + course + "</option>"
                    );
                    $("#upt_course_code").append(
                        '<option value="' + item.fk_course + '">' + course + "</option>"
                    );
               
                });
                $('.slct2').select2({
                    width:null,
                    containerCssClass: ':all:',
                }).next('.select2-container').css('width', '100%');
        
            });
        });
        // returnValue();
    });
}

function listCrsByPgmDet(id, returnValue) {
    var settings = {
        url: host + "api_tetapan_picoms/public/misPrmCrsCOTDet/listCourse/" + id,
        method: "GET",
        timeout: 0,
        headers: {
            Authorization: "picoms " + window.sessionStorage.token,
        },
    };

    $.ajax(settings).done(function (response) {
        obj_cotDet = response;
        returnValue();
    });
}

$('#type_register').change(function() {
    selectedValue = $(this).val();
    // console.log(selectedValue); // You can perform any action with the selected value here
    let idpelajar =  $("#studentid").val().trim();;

    $('#det_cectSbject').html('');

    if (selectedValue == 'New Register') {
      $('#semSelected').html('');
      $(".resetForm").val('');
      $('#divButton').show();

      $('#Cncelcourse').hide();
      $('#CncelCECT').show();
      $('#closeModal').hide();


      $('#semSelected').append(' <input type="number" class="form-control newReg" id="std_semester" required="" placeholder="Semester">');
      

      $('#std_edu').attr('readonly', false);

$('#std_pre_universiti').attr('readonly', false);
$('#std_pre_program').attr('readonly', false);

    } 
    
    else if (selectedValue == 'Update Register') {
      $('#semSelected').html('');
      $('#divButton').hide();
      $('#Cncelcourse').show();
      $('#CncelCECT').hide();
      $('#closeModal').hide();
      
      // $('#semSelected').append('ahash');
            
     


     let obj = new get(host + "api_pengurusan_pelajar/public/cect/get_databyStd/" + idpelajar,'picoms '+window.sessionStorage.token).execute();
        if (obj.success) {
            // console.log(obj)
            objCECT = obj.data;
            // console.log(objCECT);
            $('#semSelected').append(`<select id="std_semester" class="form-control c-select oldReg" required=""></select>`);
           $("#std_semester").append('<option value="">- Choose -</option>');
                $.each(objCECT, function (i, item) {
                  
                    $("#std_semester").append(
                        '<option value="' + item.id + '">' + item.std_semester + "</option>"
                    );
                
                });
                $(".slct2").select2({
                    width: null,
                    containerCssClass: ":all:",
                });
        }

    } 
});



// Use .change() event handler for select element
$('#semSelected').on('change', '#std_semester', function() {
    let selectedValue = $(this).val();
    $('#det_cectSbject').html('');

    if ($(this).hasClass('oldReg')) {

    // alert(selectedValue); // You can perform any action with the selected value here

    $('#footerBtn').html('');

    $('#footerBtn').append(`<button type="button" class="btn btn-sm btn-outline-primary rounded Chkapprove btnView"
                onclick="addCectDet('${selectedValue}')"><i class="fa fa-fw fa-plus"></i> Add</button>`);


    let obj = new get(host + "api_pengurusan_pelajar/public/cect/getdata/" + selectedValue,'picoms '+window.sessionStorage.token).execute();
        if (obj.success) {
            // console.log(obj)
            objCECTByIDcect = obj.data;
            console.log(objCECTByIDcect.std_edu);


            $('#std_edu').val(objCECTByIDcect.std_edu);

            $('#std_pre_universiti').val(objCECTByIDcect.std_pre_universiti);
            $('#std_pre_program').val(objCECTByIDcect.std_pre_program);
            // ("#std_edu").val(objCECTByIDcect.std_transkrip);
            // ("#std_edu").val(objCECTByIDcect.std_fee);

            if (!(objCECTByIDcect.std_transkrip == "" || objCECTByIDcect.std_transkrip == null)) {
                    $("#view_transkrip").html(
                        '<a target="_blank" href="' +
                        host +
                        "api_pengurusan_pelajar/public/cect_transkrip/" +
                        objCECTByIDcect.std_transkrip +
                        '" title="' +
                        objCECTByIDcect.std_transkrip +
                        '"><i class="fa fa-file-pdf-o"></i></a>'
                    );
                    $("#view_transkrip").addClass("primary");
                    $("#exist_std_transkrip").val(objCECTByIDcect.std_transkrip);
                    $("#std_transkrip").attr("required", false);
                } else {
                    $("#view_transkrip").html('<i class="fa fa-file-pdf-o"></i>');
                    $("#view_transkrip").removeClass("primary");
                    $("#exist_std_transkrip").val("");
                }

                if (!(objCECTByIDcect.std_fee == "" || objCECTByIDcect.std_fee == null)) {
                    $("#view_fee").html(
                        '<a target="_blank" href="' +
                        host +
                        "api_pengurusan_pelajar/public/cect_fee/" +
                        objCECTByIDcect.std_fee +
                        '" title="' +
                        objCECTByIDcect.std_fee +
                        '"><i class="fa fa-file-pdf-o"></i></a>'
                    );
                    $("#view_fee").addClass("primary");
                    $("#exist_std_fee").val(objCECTByIDcect.std_fee);
                    $("#std_fee").attr("required", false);
                } else {
                    $("#view_fee").html('<i class="fa fa-file-pdf-o"></i>');
                    $("#view_fee").removeClass("primary");
                    $("#exist_std_fee").val("");
                }

                  
              }



              cect_det(selectedValue, function () {
                    let data = obj_cect_det.data;
                    console.log(data);

                    createTbl(data);

                });


        } 
        else if($(this).hasClass('newReg')) {
          // alert('kau gila');
          


        }










});

//-------------------------------------------------- create table CECT Course --------------------------------------------------//
function createTbl(data) {

    var columns = [
        { name: "bil", title: "No." },
        { name: "prev_crs", title: "Previous Course" },
        { name: "prev_grade", title: "Grade" },
        { name: "ucmi_crs", title: "VMS Course" },
        { name: "typeCect", title: "Type" },
        { name: "upt_btn", title: "Action", breakpoints: "md sm xs" },
    ],
        columnsCE = [
            { name: "bil", title: "No." },
            { name: "prev_crs", title: "Previous Course" },
            { name: "prev_grade", title: "Grade" },
            { name: "ucmi_crs", title: "VMS Course" },
            { name: "upt_btn", title: "Action", breakpoints: "md sm xs" },
        ];

    let bil = 1;
    let convertList = JSON.stringify(data);
    $("#dataList_det_cectSbject").val(convertList);

    var list = [], listCE = [];

    $.each(data, function (i, field) {

        let obj = new get(host + "api_pengurusan_pelajar/public/cect/getdata/" + field.fk_cect,'picoms '+window.sessionStorage.token).execute();
        if (obj.success) {
            // console.log(obj)
            objCECT = obj.data;

                        $("#appAdminCE").html(objCECT.approval_admin);
                        $("#std_pre_programCE").html(objCECT.approval_admin);
                        $("#std_pre_universitiCE").html(objCECT.std_pre_universiti);
                        $("#std_pre_programCE").html(objCECT.std_pre_program);
                        $("#cect_statusCE").html(objCECT.cect_status);
                        $("#catatan_adminCE").html(objCECT.catatan_admin);
        }


        // let hideApprove = "";
        let fk_cect = "#det_tab_" + field.fk_cect;

        let viewBtn = "";

        // if (!(apprvd == "" || apprvd == null)) {
        //     viewBtn = "disabled";
        // } else {
        //     viewBtn = "";
        // }
        list.push({
            bil: bil++,
            prev_crs:
                '<span class="text-uppercase">' +
                field.std_course_pre +
                " " +
                field.std_course_name_pre +
                "</span> (" +
                field.std_credit_hour_pre +
                ")",
            prev_grade:
                '<span class="text-uppercase">' + field.grade_pre + "</span>",
            ucmi_crs:
                '<span class="text-uppercase">' +
                field.crs_code +
                " " +
                field.crs_name +
                "</span> (" +
                field.crs_credit +
                ")",
                typeCect: field.cect_typeDet,
            upt_btn:
                '<button type="button" class="btn btn-icon success btnView" title="Update" ' +
                viewBtn +
                " onclick=\"loadData('" +
                i +
                '\')"><i class="ion-android-create"></i></button>' +
                ' <button class="btn btn-icon danger btnView" title="Delete" ' +
                viewBtn +
                " onclick=\"del_rekod('" +
                field.id +
                '\')"><i class="ion-trash-b"></i>',
        });

        $("#loading_modal").modal("hide");

       
        $('#det_cectSbject').footable({
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

        
    });
}
//-------------------------------------------------- end create table CECT Course --------------------------------------------------//


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
        obj_pgmDet = JSON.parse(response);
        returnValue();
    });
}


function addCectDet(id) {
    $("#fk_cect").val(id);
    $("#mdlAddCourse").modal("show");
}


function cect_detCE(idstudent, returnValue) {
    var settings = {
        url: host + "api_pengurusan_pelajar/public/cect_det/listCE/" + idstudent,
        method: "GET",
        timeout: 0,
        headers: {
            Authorization: "picoms " + window.sessionStorage.token,
        },
    };

    $.ajax(settings).done(function (response) {
        obj_cect_detCE = response;
        returnValue();
    });
}

function cect_det(id, returnValue) {
    var settings = {
        url: host + "api_pengurusan_pelajar/public/cect_det/list/" + id,
        method: "GET",
        timeout: 0,
        headers: {
            Authorization: "picoms " + window.sessionStorage.token,
        },
    };

    $.ajax(settings).done(function (response) {
        obj_cect_det = response;
        
        returnValue();
    });
}

var confirmed = false;

//-------------------------------------------------- add Course --------------------------------------------------//
$("#form_register").on("submit", function (e) {
  
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Save Course",
            text: "Are you sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false,
        }).then(function () {
            let fk_cect = $("#fk_cect").val();
            let std_course_pre = $("#pv_course_code").val();
            let std_course_name_pre = $("#pv_course_name").val();
            let std_credit_hour_pre = $("#pv_crt_hour").val();
            let grade_pre = $("#pv_grade").val();
            let std_course = $("#course_code").val();

            var form = new FormData();
            form.append("fk_cect", fk_cect);
            form.append("std_course_pre", std_course_pre);
            form.append("std_course_name_pre", std_course_name_pre);
            form.append("std_credit_hour_pre", std_credit_hour_pre);
            form.append("grade_pre", grade_pre);
            form.append("std_course", std_course);
            form.append("recordstatus", "ADD");

            var settings = {
                url: host + "api_pengurusan_pelajar/public/cect_det/create",
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
                let result = JSON.parse(response);
                if (result.success) {

                  fk_cectDet = result.data.id;
                  $("#mdlAddCourse").modal("hide");

                  fruits.push(fk_cectDet);
console.log(fruits);
                  cect_det(fk_cect, function () {
                    let data = obj_cect_det.data;

                    $("#loading_modal").modal("show");

                    createTbl(data);

                });



                    // window.location.reload();
                } else {

                    swal(result.message, result.success, "error");
                }
            });
        });
    }
});
//-------------------------------------------------- end add Course --------------------------------------------------//


//-------------------------------------------------- delete course --------------------------------------------------//
function del_rekod(id) {
    var form = new FormData();
    form.append("recordstatus", "DEL");
    form.append("id", id);

    swal({
        title: "Remove Course",
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
            url: host + "api_pengurusan_pelajar/public/misStdCectDet/delete",
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
//-------------------------------------------------- end delete course --------------------------------------------------//



//-------------------------------------------------- loadData Course --------------------------------------------------//
function loadData(index) {
    let data = JSON.parse($("#dataList_det_cectSbject").val());
    data = data[index];

    $("#pk_id").val(data.id);
    $("#upt_pv_course_code").val(data.std_course_pre);
    $("#upt_pv_course_name").val(data.std_course_name_pre);
    $("#upt_pv_crt_hour").val(data.std_credit_hour_pre);
    $("#upt_pv_grade").val(data.grade_pre);
    $("#upt_course_code").val(data.std_course).trigger("change");

    $("#mdlUptCourse").modal("show");

}
//-------------------------------------------------- end loadData Course --------------------------------------------------//



// /-------------------------------------------------- save CECT Application --------------------------------------------------//
$("#regCECT").on("click", function (e) {
  if (!customValidation()) {
            return; // Stop further execution if validation fails
        }


    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Save Application",
            text: "Are you sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false,
        }).then(function () {
            //api_setup
            let studentid = $("#studentid").val().trim();
            let std_name = $("#std_name").val();
            let pgm_id = $("#pgm_id").val();
            let std_edu = $("#std_edu").val();
            let std_semester = $("#std_semester").val();
            let std_pre_universiti = $("#std_pre_universiti").val();
            let std_pre_program = $("#std_pre_program").val();
            let std_transkrip = $("#std_transkrip")[0].files[0];
            let std_fee = $("#std_fee")[0].files[0];

            var form = new FormData();
            form.append("studentid", studentid);
            form.append("std_name", std_name);
            form.append("pgm_id", pgm_id);
            form.append("std_edu", std_edu);
            form.append("std_semester", std_semester);
            form.append("std_pre_universiti", std_pre_universiti);
            form.append("std_pre_program", std_pre_program);
            form.append("std_transkrip", std_transkrip);
            form.append("std_fee", std_fee);
            form.append("cect_status", "New");
            form.append("recordstatus", "ADD");

            var settings = {
                url: host + "api_pengurusan_pelajar/public/cect/create",
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
                let result = JSON.parse(response);
                if (result.success) {
                    // window.location.reload();
                    data = result.data;
                    $('#std_pre_universiti').attr('readonly', true);
$('#std_pre_program').attr('readonly', true);
$('#std_edu').attr('readonly', true);
$('#std_semester').attr('readonly', true);


                    $('#id_cect').val(data.id);

                    $('#regCECT').hide();
                    $('#footerBtn').html('');

                    $('#footerBtn').append(`<button type="button" class="btn btn-sm btn-outline-primary rounded Chkapprove btnView"
                onclick="addCectDet('${data.id}')"><i class="fa fa-fw fa-plus"></i> Add</button>`);



                    
    let obj = new get(host + "api_pengurusan_pelajar/public/cect/getdata/" + data.id,'picoms '+window.sessionStorage.token).execute();
        if (obj.success) {
            // console.log(obj)
            objCECTByIDcect = obj.data;
            
            if (!(objCECTByIDcect.std_transkrip == "" || objCECTByIDcect.std_transkrip == null)) {
                    $("#view_transkrip").html(
                        '<a target="_blank" href="' +
                        host +
                        "api_pengurusan_pelajar/public/cect_transkrip/" +
                        objCECTByIDcect.std_transkrip +
                        '" title="' +
                        objCECTByIDcect.std_transkrip +
                        '"><i class="fa fa-file-pdf-o"></i></a>'
                    );
                    $("#view_transkrip").addClass("primary");
                    $("#exist_std_transkrip").val(objCECTByIDcect.std_transkrip);
                    $("#std_transkrip").attr("required", false);
                } else {
                    $("#view_transkrip").html('<i class="fa fa-file-pdf-o"></i>');
                    $("#view_transkrip").removeClass("primary");
                    $("#exist_std_transkrip").val("");
                }

                if (!(objCECTByIDcect.std_fee == "" || objCECTByIDcect.std_fee == null)) {
                    $("#view_fee").html(
                        '<a target="_blank" href="' +
                        host +
                        "api_pengurusan_pelajar/public/cect_fee/" +
                        objCECTByIDcect.std_fee +
                        '" title="' +
                        objCECTByIDcect.std_fee +
                        '"><i class="fa fa-file-pdf-o"></i></a>'
                    );
                    $("#view_fee").addClass("primary");
                    $("#exist_std_fee").val(objCECTByIDcect.std_fee);
                    $("#std_fee").attr("required", false);
                } else {
                    $("#view_fee").html('<i class="fa fa-file-pdf-o"></i>');
                    $("#view_fee").removeClass("primary");
                    $("#exist_std_fee").val("");
                }

                  
              }



              cect_det(selectedValue, function () {
                    let data = obj_cect_det.data;
                    console.log(data);

                    createTbl(data);

                });













                    console.log(data.id);
                } else {
                    // console.log(result);
                    swal(result.messages, result.success, "error");
                }
            });
        });
    }
});
//-------------------------------------------------- end save CECT Application --------------------------------------------------//


$( "#finish" ).on( "click", function() {

  window.location.reload();


} );


  $("#CncelCECT").on("click", function () {

      idDel = $('#id_cect').val();
      swal({
        title: "Cancel",
        text: "Are You Sure?",
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Remove",
        confirmButtonColor: "#ef193c",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false,
      }).then(function () {



        let obj = new get(host + "api_pengurusan_pelajar/public/misStdCect/delete/" + idDel, 'picoms ' + window.sessionStorage.token).execute();
        if (obj.success) {
          window.location.reload();

        } else {
          Swal(result.message, result.data, "error");

          return;

        }

      });



    });


$("#Cncelcourse").on( "click", function() {

  swal({
        title: "Cancel",
        text: "Are You Sure?",
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Remove",
        confirmButtonColor: "#ef193c",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false,
      }).then(function () {


        $.each(fruits, function (i, field) {

console.log(fruits);
let obj = new get(host + "api_pengurusan_pelajar/public/misStdCectDet/deleteGet/" + field,'picoms '+window.sessionStorage.token).execute();
if (obj.success) {

}else{
Swal(result.message, result.data, "error");
return;        

}


});
window.location.reload();

      });


  



} );


//-------------------------------------------------- update Course --------------------------------------------------//
$("#form_upt").on("submit", function (e) {
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Update Course",
            text: "Are you sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false,
        }).then(function () {
            let id = $("#pk_id").val();
            let std_course_pre = $("#upt_pv_course_code").val();
            let std_course_name_pre = $("#upt_pv_course_name").val();
            let std_credit_hour_pre = $("#upt_pv_crt_hour").val();
            let grade_pre = $("#upt_pv_grade").val();
            let std_course = $("#upt_course_code").val();

            var form = new FormData();
            form.append("id", id);
            form.append("std_course_pre", std_course_pre);
            form.append("std_course_name_pre", std_course_name_pre);
            form.append("std_credit_hour_pre", std_credit_hour_pre);
            form.append("grade_pre", grade_pre);
            form.append("std_course", std_course);
            form.append("recordstatus", "EDT");

            var settings = {
                url: host + "api_pengurusan_pelajar/public/misStdCectDet/update",
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
                let result = JSON.parse(response);
                if (result.success) {
                    window.location.reload();
                } else {
                    swal(result.message, result.success, "error");
                }
            });
        });
    }
});
//-------------------------------------------------- end update Course --------------------------------------------------//

// Custom validation function
function customValidation() {
    let isValid = true;

    // Example: Validate if input fields have values
    $(".required-field").each(function() {
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

//end function for add cect


