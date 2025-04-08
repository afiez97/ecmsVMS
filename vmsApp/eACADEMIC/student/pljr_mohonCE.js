$(function () {
    $.ajaxSetup({
        cache: false,
    });
    $.fn.select2.defaults.set("theme", "bootstrap");

    // $("#loading_modal").modal('show');
    let student_id = window.sessionStorage.std_studentid;

    $("#studentid").val(student_id);

    student_info(student_id, function () {
        let dataStd = obj_stdInfo.data;
        let pgm_id = dataStd.pgm_fk;
        let session = dataStd.sti_session_id.replace("-", "/");
        let intake = dataStd.cur_intake;

        $("#pgm_id").val(pgm_id);
        $("#std_name").val(dataStd.sti_name);
        $("#programme").val(dataStd.pgm_name);

        findPGMid(pgm_id, intake, function () {
            let pgmDetId = obj_findPGMid.data.dtp_id;
            $("#pgmDet_id").val(pgmDetId);

            listCrsByPgmDet(pgmDetId, function () {
                $("#course_code").append('<option value="">- Choose -</option>');
                $("#upt_course_code").append('<option value="">- Choose -</option>');
                $.each(obj_cotDet.data, function (i, item) {
                    console.log(item.length)
                    let course =
                        item.crs_code.toUpperCase() + " - " + item.crs_name.toUpperCase();
                    $("#course_code").append(
                        '<option value="' + item.fk_course + '">' + course + "</option>"
                    );
                    $("#upt_course_code").append(
                        '<option value="' + item.fk_course + '">' + course + "</option>"
                    );
                });
                $(".slct2").select2({
                    width: null,
                    containerCssClass: ":all:",
                });
            });
        });
    });
    cect_detCE(student_id, function () {
        let dataCE = obj_cect_detCE.data;
        console.log(dataCE);
        createTblCE(dataCE);


    });
    // data cect if have
    cect(student_id, function () {
        if (obj_cect.success) {
            $.each(obj_cect.data, function (i, field) {

                // let i = 1+i;
                let cectStatus = field.cect_status;
                let label = "";
                let hideApprove = "";



                if (field.approval_admin == "Approve") {
                    label =
                        '<span class="label success text-uppercase">' +
                        field.approval_admin +
                        "</span>";
                    hide = "";
                    hideApprove = "hidden";
                } else if (field.approval_admin == "Reject") {
                    label =
                        '<span class="label danger text-uppercase">' +
                        field.approval_admin +
                        "</span>";
                    hide = "";
                } else {
                    label =
                        '<span class="label warning text-uppercase">' +
                        cectStatus +
                        "</span>";
                    hide = "hidden";
                }

                $("#cect_det").append(
                    `<div class="" id="accordianSem_` +
                    field.id+
                    `">
                <div class="m-b" id="accordion">
                    <div class="panel box no-border m-b-xs">
                        <div class="box-header p-y-sm bg-primary text-white">
                            <span class="pull-right label text-sm">${field.approval_admin}</span>
                            <a data-toggle="collapse" data-parent="#accordion" data-target="#c_` +
                            field.id+
                    `" class="" aria-expanded="false">
                                <b>Semester ${field.std_semester}</b>
                            </a>
                        </div>
                        <div id="c_` +
                        field.id +
                    `" class="collapse" aria-expanded="true" style="">
                            <div class="card-body p-a">
                                <div class="row">
                                    <div class="col-md-6">
                                        <p><b>Previous Level of Education : </b><span class="text-uppercase">${field.std_edu}</span></p>
                                        <p><b>Previous IPTA/IPTS : </b><span class="text-uppercase">${field.std_pre_universiti}</span></p>
                                    </div>
                                    <div class="col-md-6">
                                        <p><b>Previous Programme : </b><span class="text-uppercase">${field.std_pre_program}</span></p>
                                        <p><b>Status : </b><span class="text-uppercase">${label}</span></p>
                                        <p ${hide}><b>Remark : </b><span class="text-uppercase">${field.catatan_admin}</span></p>
                                    </div>
                                </div>
                            </div>
                            <div class="card-footer text-right">
                                <button type="button" class="btn btn-sm btn-outline-primary rounded Chkapprove btnView" ${hideApprove} onclick="addCectDet('${field.id}')"><i class="fa fa-fw fa-plus"></i> Add</button>
                            </div>
                            
                            <h6 class="p-l-1 light-blue-700"><b>COURSE LIST</b></h6>
                            <textarea class="hidden" id="dataList"></textarea>
                            <table class="table table-striped" id="det_tab_` +
                    field.id +
                    `"></table>
                        </div>
                    </div>
                </div>
            </div>
            `
                );
                $("#accordianSem_" + (1 + i)).append(`<div id="#tab${field.id}">`);

                // $("#cect_det").append(
                //     '<div class="card">'+
                //         '<div class="card-header bg-primary text-white"><b>Semester '+field.std_semester+'</b></div>'+
                //         '<div class="card-body p-a">'+
                //             '<div class="row">'+
                //                 '<div class="col-md-6">'+
                //                     '<p><b>Previous Level of Education : </b><span class="text-uppercase">'+field.std_edu+'</span></p>'+
                //                     '<p><b>Previous IPTA/IPTS : </b><span class="text-uppercase">'+field.std_pre_universiti+'</span></p>'+
                //                 '</div>'+
                //                 '<div class="col-md-6">'+
                //                     '<p><b>Previous Programme : </b><span class="text-uppercase">'+field.std_pre_program+'</span></p>'+
                //                     '<p><b>Status : </b><span class="text-uppercase">'+label+'</span></p>'+
                //                     '<p '+hide+'><b>Remark : </b><span class="text-uppercase">'+field.catatan_admin+'</span></p>'+
                //                 '</div>'+
                //             '</div>'+
                //         '</div>'+
                //         '<div class="card-footer text-right">'+
                //             '<button type="button" class="btn btn-sm btn-outline-primary rounded btnView" onclick="addCectDet(\''+field.id+'\')"><i class="fa fa-fw fa-plus"></i> Add</button>'+
                //         '</div>'+
                //     '</div>'+

                //     '<h6 class="p-l-1 light-blue-700"><b>COURSE LIST</b></h6>'+
                //     '<textarea class="hidden" id="dataList"></textarea>'+
                //     '<table class="table table-striped" id="det_tab"></table>'
                // );
                // $("#cect_det").append('<div id="#tab'+i+'">');

                // list course
                cect_det(field.id, function () {
                    let data = obj_cect_det.data;
                    // console.log(field.id);

                    createTbl(data, field.approval_coor);

                });
                

                // edit data
                $("#pk_id").val(field.id);
                $("#std_semester").val(field.std_semester);
                $("#std_edu").val(field.std_edu);
                $("#std_pre_universiti").val(field.std_pre_universiti);
                $("#std_pre_program").val(field.std_pre_program);

                if (!(field.std_transkrip == "" || field.std_transkrip == null)) {
                    $("#view_transkrip").html(
                        '<a target="_blank" href="' +
                        host +
                        "api_pengurusan_pelajar/public/cect_transkrip/" +
                        field.std_transkrip +
                        '" title="' +
                        field.std_transkrip +
                        '"><i class="fa fa-file-pdf-o"></i></a>'
                    );
                    $("#view_transkrip").addClass("primary");
                    $("#exist_std_transkrip").val(field.std_transkrip);
                    $("#std_transkrip").attr("required", false);
                } else {
                    $("#view_transkrip").html('<i class="fa fa-file-pdf-o"></i>');
                    $("#view_transkrip").removeClass("primary");
                    $("#exist_std_transkrip").val("");
                }

                if (!(field.std_fee == "" || field.std_fee == null)) {
                    $("#view_fee").html(
                        '<a target="_blank" href="' +
                        host +
                        "api_pengurusan_pelajar/public/cect_fee/" +
                        field.std_fee +
                        '" title="' +
                        field.std_fee +
                        '"><i class="fa fa-file-pdf-o"></i></a>'
                    );
                    $("#view_fee").addClass("primary");
                    $("#exist_std_fee").val(field.std_fee);
                    $("#std_fee").attr("required", false);
                } else {
                    $("#view_fee").html('<i class="fa fa-file-pdf-o"></i>');
                    $("#view_fee").removeClass("primary");
                    $("#exist_std_fee").val("");
                }

                // let viewBtn = '';
                // if(!(field.approval_coor == '' || field.approval_coor == null)){
                //     $('.btnView').attr('disabled',true);
                //     $('#divButton').html('');
                //     viewBtn = 'disabled';
                // }
                // else{ viewBtn = '' }
                // $('#divButton').html('<button type="submit" class="btn danger btnView" '+viewBtn+' onclick="delCect(\'' + field.id + '\')">Delete</button> <button type="submit" class="btn success btnView" '+viewBtn+' onclick="uptCect(\'' + field.id + '\')">Update</button>');
            });
        } else {
            $("#form_setup").prop("class", "");
            // $("#loading_modal").modal('hide');
            $("#divButton").html(
                '<button type="submit" class="btn info">Save</button>'
            );
        }
    });
});
var confirmed = false;

function addCectDet(id) {
    $("#fk_cect").val(id);
    $("#mdlAddCourse").modal("show");
}

//-------------------------------------------------- save CECT Application --------------------------------------------------//
$("#form_setup").on("submit", function (e) {
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
            let studentid = $("#studentid").val();
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
                    window.location.reload();
                } else {
                    // console.log(result);
                    swal(result.messages, result.success, "error");
                }
            });
        });
    }
});
//-------------------------------------------------- end save CECT Application --------------------------------------------------//

//-------------------------------------------------- update CECT Application --------------------------------------------------//
function uptCect(id) {
    if (!confirmed) {
        swal({
            title: "Update Application",
            text: "Are you sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false,
        }).then(function () {
            let std_semester = $("#std_semester").val();
            let std_pre_universiti = $("#std_pre_universiti").val();
            let std_pre_program = $("#std_pre_program").val();
            let std_transkrip = $("#std_transkrip")[0].files[0];
            let exist_std_transkrip = $("#exist_std_transkrip").val();
            let std_fee = $("#std_fee")[0].files[0];
            let exist_std_fee = $("#exist_std_fee").val();

            var form = new FormData();
            form.append("id", id);
            form.append("std_semester", std_semester);
            form.append("std_pre_universiti", std_pre_universiti);
            form.append("std_pre_program", std_pre_program);
            form.append("std_transkrip", std_transkrip);
            form.append("exist_std_transkrip", exist_std_transkrip);
            form.append("std_fee", std_fee);
            form.append("exist_std_fee", exist_std_fee);
            form.append("recordstatus", "EDT");

            var settings = {
                url: host + "api_pengurusan_pelajar/public/cect/update",
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
}
//-------------------------------------------------- end update CECT Application --------------------------------------------------//

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
                    window.location.reload();
                } else {
                    swal(result.message, result.success, "error");
                }
            });
        });
    }
});
//-------------------------------------------------- end add Course --------------------------------------------------//

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

//-------------------------------------------------- create table CECT Course --------------------------------------------------//
function createTbl(data, apprvd) {
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
    $("#dataList").val(convertList);
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

    console.log(field.cect_typeDet);

        let hideApprove = "";
        let fk_cect = "#det_tab_" + field.fk_cect;

        let viewBtn = "";

        if (!(apprvd == "" || apprvd == null)) {
            viewBtn = "disabled";
        } else {
            viewBtn = "";
        }
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
                '<button class="btn btn-icon success btnView" title="Update" ' +
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

      
        if (list.length < 0) {
            // console.log(list.length);
            $("#accordianSem_"+field.fk_cect).addClass('none')
        } 

       
        $(fk_cect).footable({
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


//-------------------------------------------------- create table CECT Course --------------------------------------------------//
function createTblCE(data) {
    var columns = [
        { name: "bil", title: "No." },
        { name: "prev_crs", title: "Previous Course" },
        { name: "prev_grade", title: "Grade" },
        { name: "ucmi_crs", title: "VMS Course" },
        // { name: "upt_btn", title: "Action", breakpoints: "md sm xs" },
    ];
    let bil = 1;
    let convertList = JSON.stringify(data);
    $("#dataListCE").val(convertList);
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

    

        let hideApprove = "";
        // let fk_cect = "#det_tab_" + field.fk_cect;

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
            // upt_btn:
            //     '<button class="btn btn-icon success btnView" title="Update" ' +
            //     viewBtn +
            //     " onclick=\"loadData('" +
            //     i +
            //     '\')"><i class="ion-android-create"></i></button>' +
            //     ' <button class="btn btn-icon danger btnView" title="Delete" ' +
            //     viewBtn +
            //     " onclick=\"del_rekod('" +
            //     field.id +
            //     '\')"><i class="ion-trash-b"></i>',
        });

      
        if (list.length > 0) {
            // console.log(list.length);
            $("#accordianSem_0").removeClass('none')
        } 

       
        $('#ceLIST').footable({
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

//-------------------------------------------------- loadData Course --------------------------------------------------//
function loadData(index) {
    let data = JSON.parse($("#dataList").val());
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

function cect(studentid, returnValue) {
    var settings = {
        url: host + "api_pengurusan_pelajar/public/cect/show/" + studentid,
        method: "GET",
        timeout: 0,
        headers: {
            Authorization: "picoms " + window.sessionStorage.token,
        },
    };

    $.ajax(settings).done(function (response) {
        obj_cect = response;
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
