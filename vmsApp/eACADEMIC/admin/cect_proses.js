// const { default: Swal } = require("sweetalert2");

$(function () {
    $.ajaxSetup({
        cache: false
    });
    $("#loading_modal").modal('show');
    $.fn.select2.defaults.set("theme", "bootstrap");

    var id = window.sessionStorage.cectId;
    $('#cect_id').val(id);

    // select Academic Session
    // curYearAct(function(){
    //     $('#cect_acaSession').append('<option value="">- Choose -</option>');
    //     $.each(obj_curYearAct.data, function(i, item){
    //         $('#cect_acaSession').append('<option value="'+item.cur_year+'">'+item.cur_year+'</option>');
    //     });

    //     $('.slct2').select2({
    //         width: null,
    //         containerCssClass: ':all:'
    //     });
    // })

    ///nana



    cect(id, function () {
        if (obj_cect.success) {
            $("#std_studentid").html(obj_cect.data.studentid);
            $("#sti_name").html(obj_cect.data.std_name);
            $("#programme").html(obj_cect.data.pgm_name);
            $("#semester").html(obj_cect.data.std_semester);
            $("#fee").html('<a target="_blank" href="' + host + 'api_pengurusan_pelajar/public/cect_fee/' + obj_cect.data.std_fee + '" title="' + obj_cect.data.std_fee + '"><span class="label success">Document</span></a>');
            $("#std_edu").html(obj_cect.data.std_edu);
            $("#std_universiti").html(obj_cect.data.std_pre_universiti);
            $("#std_pre_programme").html(obj_cect.data.std_pre_program);
            $("#std_transkrip").html('<a target="_blank" href="' + host + 'api_pengurusan_pelajar/public/cect_transkrip/' + obj_cect.data.std_transkrip + '" title="' + obj_cect.data.std_transkrip + '"><span class="label success">Document</span></a>');
            $('#statusAdminFakulti').val(obj_cect.data.approval_coor);
            $('#cttnAdminFakulti').val(obj_cect.data.catatan_coor);
            $('#cect_approval_status').val(obj_cect.data.approval_admin);
            $('#cect_approval_remarks').val(obj_cect.data.catatan_admin);

            if (obj_cect.data.cect_type == "CT") {
                $("#ce").prop('checked', false);
                $("#ct").prop('checked', true);
            }
            else {
                $("#ce").prop('checked', true);
                $("#ct").prop('checked', false);
            }

            cect_detByCourse(obj_cect.data.id, function () {
                let data = obj_cect_detBycourse.data;
                createTbl(data);
            });

            cect_student(obj_cect.data.id, function () {
                let dataStudent = obj_cectStudent.data;
                // console.log(dataStudent);
                let convertList = JSON.stringify(dataStudent);
                // console.log(convertList);
// console.log(dataStudent)

                $("#dataListSubject").val(convertList);
            });

            // tab mesyuarat senat
            let selectSession = obj_cect.data.cur_year;
            let sem = obj_cect.data.cal_cohort;

            if (selectSession != null) {
                semCohort = selectSession.replace('/', '') + '/' + sem;
            }
            else {
                semCohort = '';

            }

            // if ()

            if (obj_cect.data.cect_acaSession != null) {
                // $('#cect_acaSession').append('<option value="">- Choose -</option>');
                acaCalActive(function () {
                    $('#cect_acaSession').append('<option value="">- Choose -</option>');

                    $.each(obj_kalendar.data, function (i, item) {
                        let selected = '';
                        if (item.cal_id == obj_cect.data.cect_acaSession) {
                            selected = 'selected';
                        }
                        $('#cect_acaSession').append('<option ' + selected + ' value="' + item.cal_id + '" calYear="' + item.cur_year + '" calSem="' + item.cal_cohort + '">' + item.cur_year.replace('/', '') + '/' + item.cal_cohort + '</option>');
                    });

                    $('.slct2').select2({
                        width: null,
                        containerCssClass: ':all:'
                    });
                });

                // $('#cect_acaSession').val(semCohort);

                

                catByYearSem(selectSession, sem, function () {
                    $('#aca_calendar').html('');
                    $('#aca_calendar').append('<option value="">- Choose -</option>');

                    $.each(obj_kalendar.data, function (i, item) {
                        let selected = '';
                        if (item.cal_id == obj_cect.data.cect_acaSession) {

                            selected = 'selected';
                        }

                        $('#aca_calendar').append('<option ' + selected + ' value="' + item.cal_id + '">' + item.category + '</option>');
                    });
                    // $('#aca_calendar').val(obj_cect.data.aca_calendar);
                });

            }
            else {
                acaCalActive(function () {
                    $('#cect_acaSession').append('<option value="">- Choose -</option>');
                    $.each(obj_kalendar.data, function (i, item) {
                        $('#cect_acaSession').append('<option value="' + item.cal_id + '" calYear="' + item.cur_year + '" calSem="' + item.cal_cohort + '">' + item.cur_year.replace('/', '') + '/' + item.cal_cohort + '</option>');
                    });

                    $('.slct2').select2({
                        width: null,
                        containerCssClass: ':all:'
                    });
                });

                $('#cect_acaSession').change(function () {
                    let selectSession = $("#cect_acaSession option:selected").attr("calYear");
                    let sem = $("#cect_acaSession option:selected").attr("calSem");

                    catByYearSem(selectSession, sem, function () {
                        $('#aca_calendar').html('');
                        $('#aca_calendar').append('<option value="">- Choose -</option>');
                        $.each(obj_kalendar.data, function (i, item) {
                            $('#aca_calendar').append('<option value="' + item.cal_id + '">' + item.category + '</option>');
                        });
                    });
                });
            }


            // $("#cect_acaSession").val(obj_cect.data.cect_acaSession);
            $('#cect_total_credit').val(obj_cect.data.cect_total_credit);
            $("#cect_cgpa").val(obj_cect.data.cect_cgpa);
            $('#cect_gpa').val(obj_cect.data.cect_gpa);
            $("#cect_senate_decision").val(obj_cect.data.cect_senate_decision);

            // tab fees
            $("#cect_fees").val(obj_cect.data.cect_fees);

            $("#loading_modal").modal('hide');
        }
        else { swal("error", "no data found", "warning"); }
    });
    // disabledbutton();
});
var confirmed = false;


$('#btnBack').click(function () {
    window.sessionStorage.removeItem('stdId');
    window.sessionStorage.removeItem('cectId');
    window.location.replace('adminPage.html');
});


//-------------------------------------------------- update admin faculty --------------------------------------------------//
$('#admin_send').on('submit', function (e) {
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Save",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let cect_id = $('#cect_id').val();
            let statusAdminFakulti = $('#statusAdminFakulti').val();
            let cttnAdminFakulti = $('#cttnAdminFakulti').val();

            var form = new FormData();
            form.append('id', cect_id);
            form.append("approval_coor", statusAdminFakulti);
            form.append("catatan_coor", cttnAdminFakulti);

            var settings = {
                "url": host + "api_pengurusan_pelajar/public/misStdCect/uptByAdmnFac",
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
                let result = JSON.parse(response);
                if (result.success) {
                    window.location.reload();
                }
                else { swal("Failed", response.message, "error"); }
            });
        });
    }
});
//-------------------------------------------------- end update admin faculty --------------------------------------------------//


//-------------------------------------------------- update admin Dean --------------------------------------------------//
$('#formDean').on('submit', function (e) {
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Save",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let cect_id = $('#cect_id').val();
            let cect_approval_status = $('#cect_approval_status').val();
            let cect_approval_remarks = $('#cect_approval_remarks').val();
            let cect_type = "CE";
            if ($("#ct").prop('checked')) {
                cect_type = "CT";
            }
            let dataListSubject = $('#dataListSubject').val();

            // let dataListSubject = JSON.parse(jsonData);

            if (cect_approval_status == "Approve") {

            }


            var form = new FormData();
            form.append('id', cect_id);
            form.append('approval_admin', cect_approval_status);
            form.append('catatan_admin', cect_approval_remarks);
            form.append('cect_type', cect_type);
            form.append('dataListSubject', dataListSubject);

            var settings = {
                "url": host + "api_pengurusan_pelajar/public/misStdCect/uptByDean",
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
                let result = JSON.parse(response);
                if (result.success) {
                    window.location.reload();
                }
                else { swal("Failed", response.message, "error"); }
            });
        });
    }
});
//-------------------------------------------------- end update admin Dean --------------------------------------------------//


//-------------------------------------------------- update senat --------------------------------------------------//
$('#formSenat').on('submit', function (e) {
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Save",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let cect_id = $('#cect_id').val();
            let cect_acaSession = $('#aca_calendar').val();
            // let cect_acaSession = $('#cect_acaSession').val();
            let cect_total_credit = $('#cect_total_credit').val();
            let cect_cgpa = $('#cect_cgpa').val();
            let cect_gpa = $('#cect_gpa').val();
            let cect_senate_decision = $('#cect_senate_decision').val();
            // let cect_type = "CE";
            // if($("#ct").prop('checked')){
            //     cect_type = "CT";
            // }

            // cect_type = "CT";

            var form = new FormData();
            form.append('id', cect_id);
            form.append("cect_acaSession", cect_acaSession);
            form.append("cect_total_credit", cect_total_credit);
            // form.append('cect_type', cect_type);
            form.append('cect_cgpa', cect_cgpa);
            form.append('cect_gpa', cect_gpa);
            form.append('cect_senate_decision', cect_senate_decision);

            var settings = {
                "url": host + "api_pengurusan_pelajar/public/misStdCect/uptSenat",
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
                let result = JSON.parse(response);
                if (result.success) {
                    window.location.reload();
                }
                else { swal("Failed", response.message, "error"); }
            });
        });
    }
});
//-------------------------------------------------- end update senat --------------------------------------------------//


//-------------------------------------------------- update fees --------------------------------------------------//
$('#formUptFees').on('submit', function (e) {
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Save",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let cect_id = $('#cect_id').val();
            let cect_fees = $('#cect_fees').val();

            var form = new FormData();
            form.append('id', cect_id);
            form.append("cect_fees", cect_fees);

            var settings = {
                "url": host + "api_pengurusan_pelajar/public/misStdCect/uptFees",
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
                let result = JSON.parse(response);
                if (result.success) {
                    window.location.reload();
                }
                else { swal("Failed", response.message, "error"); }
            });
        });
    }
});
//-------------------------------------------------- end update fees --------------------------------------------------//


function createTbl(data) {
    let columns = [
        { "name": "bil", "title": "No." },
        { "name": "std_course", "title": "PICOM Course Applied" },
        // {"name":"grade_pre","title":"Grade"},
        { "name": "std_course_pre", "title": "Previous Course" },
        {"name":"cect","title":"CE/CT"},
        {"name":"delBtn","title":"Action"},
    ];

    let list = [];
    let bil = 1;
    // console.log(data);
    // $("#dataListSubject").val(data);
    //     listByCourseDet(field.fk_cect, field.std_course, function(){
    //         let data1 = obj_listByCourseDet.data;

    // });


    $.each(data, function (i, field) {

        // console.log(field);
        var html = '', typeCEorCT = '';

        $.each( field.detailPrevious, function(  i, val ) {
            html += `<div>${(i+1)}. ${val.std_course_pre} - ${val.std_course_name_pre} (${val.grade_pre})</div><br>`;
            // console.log(val);
            typeCEorCT = val.cect_type;
        });

       


        if (typeCEorCT === 'CE') {
            type = `
            <option value="">Choice ..</option>
             <option selected="selected" value="CE">CE</option>
            <option value="CT">CT</option>`
        } else if(typeCEorCT === 'CT'){
            type = `
            <option value="">Choice ..</option>
             <option  value="CE">CE</option>
            <option selected="selected" value="CT">CT</option>`
        }
         else {
            type = ` 
            <option value="">Choice ..</option>
            <option value="CE">CE</option>
            <option value="CT">CT</option>`
        }


        // listByCourseDet(field.fk_cect, field.std_course)
        list.push({
            bil: bil++,
            std_course: '<span class="text-uppercase">' + field.crs_code + ' - ' + field.crs_name + '</span> (' + field.crs_credit + ')',
            // grade_pre: field.grade_pre,
            std_course_pre:html,
            // std_course_pre: `<div onchange="listByCourseDet('${field.fk_cect}', '${field.std_course}')" ></div>`,
            cect: `
                        <div class="col-sm-6">
                            <select onchange="updCECT(${field.fk_cect}, ${field.std_course}) " id="idCourse_${field.std_course}" class="js-example-tags white rounded form-control-sm selectedType">
                            ${type}
                            </select>
                        </div>
                        `,
            delBtn: `<button onclick="delBtn(${field.fk_cect}, ${field.std_course})" class="btn btn-icon btn-link text-danger"><i class="fa fa-minus-circle"></i></button>`

        });
        // list.push({
        //     bil: bil++, 
        //     std_course: '<span class="text-uppercase">'+field.crs_code+' '+field.crs_name+'</span> ('+field.crs_credit+')', 
        //     grade_pre: field.grade_pre,
        //     std_course_pre: '<span class="text-uppercase">'+field.std_course_pre+' '+field.std_course_name_pre+'</span> ('+field.std_credit_hour_pre+')',
        //     cect: `
        //                 <div class="col-sm-6">
        //                     <select onchange="updCECT(${field.id})" id="idCourse_${field.id}" class="js-example-tags white rounded form-control-sm">
        //                         <option selected="selected" value="CE">CE</option>
        //                         <option value="CT">CT</option>
        //                     </select>
        //                 </div>
        //                 `,

    });


    $("#tblCourseTransfer").footable({
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


}

(".js-example-tags").select2({
    tags: true
});

function updCECT(fk_cect, courseID) {




    // sprm = $(fk_cect).val();
    // sprm = $(courseID).val();
    htmlCECTType = $("#idCourse_" + courseID).val();
// alert(htmlCECTType);

    let formType = new FormData();
    formType.append('fk_cect', fk_cect);
    formType.append('std_course', courseID);
    formType.append('cect_type', htmlCECTType);

    let obj = new post(host + 'api_pengurusan_pelajar/public/misStdCectDet/update/updateCECT', formType, 'picoms ' + window.sessionStorage.token).execute();

    if (obj.success) {

        obj_cect = response;
        returnValue(); 
    
    }
}

function delBtn(fk_cect, courseID) {




    // sprm = $(fk_cect).val();
    // sprm = $(courseID).val();
    // htmlCECTType = $("#idCourse_" + courseID).val();
// alert(htmlCECTType);

    let formType = new FormData();
    formType.append('fk_cect', fk_cect);
    formType.append('std_course', courseID);

    swal({
        title: "Delete Course",
        text: "Are You Sure?",
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Delete",
        confirmButtonColor: "#ef193c",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false
    }).then(function(){
        let obj = new post(host + 'api_pengurusan_pelajar/public/misStdCectDet/update/delCECTBycourse', formType, 'picoms ' + window.sessionStorage.token).execute();

        if (!obj.success) {
            Swal(result.message, result.data, "error");
            return;
        
        }else{window.location.reload();}
    
    
    });







}




function cect(id, returnValue) {
    var settings = {
        "url": host + "api_pengurusan_pelajar/public/cect/getdata/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_cect = response;
        returnValue();
    });
}

function cect_det(id, returnValue) {
    var settings = {
        "url": host + "api_pengurusan_pelajar/public/cect_det/list/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_cect_det = response;
        returnValue();
    });
}

function cect_detByCourse(id, returnValue) {

    // alert(id);
    var settings = {
        "url": host + "api_pengurusan_pelajar/public/cect_det/list/byCourse/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_cect_detBycourse = response;
        // console.log(obj_cect_detBycourse);

        returnValue();
    });
}

function listByCourseDet(id, std_course, returnValue) {

    // alert(id);
    var settings = {
        "url": host + "api_pengurusan_pelajar/public/cect_det/list/byCourse/" + id + "/" + std_course,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_listByCourseDet = response;
        // detPrevious = ''; // Initialize detPrevious as an empty string
        // id = '#previous_' + std_course;
        // $.each(obj_listByCourseDet.data, function (i, field) {
        //     detPrevious += `<div>${field.std_course_pre} - ${field.std_course_name_pre} (${field.grade_pre})</div><br>`;
        // });

        // $(id).html(detPrevious);
       
        // console.log(std_course);
        
        returnValue();
    });
}
function cect_student(id, returnValue) {
    var settings = {
        "url": host + "api_pengurusan_pelajar/public/cect_det/listStudent/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_cectStudent = response;
        returnValue();
    });
}

function disabledbutton() {
        // capaianCect = load_capaian();
        load_capaian();
        capaianCect = window.capaianData;
        // console.log(capaianCect);
        let addCect = capaianCect[0];
        let uptCect = capaianCect[1];
        let delCect = capaianCect[2];

        console.log(addCect);
        console.log(uptCect);
        console.log(delCect);

        if (addCect == 0){
            CectAddDisabled = 'disabled';
        }
        else{
            CectAddDisabled = ''; 
        }

        if (uptCect == 0){
            CectUpdateDisabled = 'disabled';
            $("#btnAdminFaculty").html('hidden');
            $("#btnSenat").html('hidden');
            $("#btnAdminDean").html('hidden');
            $("#btnFees").html('hidden');
            
        }
        else{
            CectUpdateDisabled = ''; 
        }


        if (delCect == 0){
            CectDelDisabled = 'disabled';
        }
        else{
            CectDelDisabled = ''; 
        }
}