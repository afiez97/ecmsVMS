let usrCatEadmin = window.sessionStorage.usrCatEadmin;
let usrCatEcmis = window.sessionStorage.usrCatEcmis;

let clg_id = window.sessionStorage.idPage;
let token = window.sessionStorage.token;

let getSession = window.sessionStorage.pgmSession;
let calSem = window.sessionStorage.calSem;
let pgm_fk = window.sessionStorage.pgm_id;

var confirmed = false;

var data_load = [];

$(function () {
    $.ajaxSetup({
        cache: false
    });

    window.sessionStorage.removeItem("lectCrsId");
    window.sessionStorage.removeItem("pk_crs");
    window.sessionStorage.removeItem("fk_aca_cal");
    window.sessionStorage.removeItem("lect_coor");
    window.sessionStorage.removeItem("cal_cohort");
    window.sessionStorage.removeItem("prevPage");
    window.sessionStorage.removeItem("yearTaken");
    window.sessionStorage.removeItem("lectId");

    $.fn.select2.defaults.set("theme", "bootstrap");

    let obj_pgm = new get(host + "api_tetapan_picoms/public/misPrmProgcampus/listByCamAct/" + clg_id, token).execute();

    if (obj_pgm.success) {
        $("#programme").html('<option value="">- Programme -</option>');
        $.each(obj_pgm.data, function (i, item) {
            let selected = "";
            if (pgm_fk == item.pgmCode) {
                selected = "selected";
            }
            $('#programme').append($('<option ' + selected + ' pgmCode="' + item.pgmCode + '" value="' + item.pgm_id + '">' + item.pgmCode + ' - ' + item.pgm_name + '</option>'));
        });

        $("#programme").select2({
            width: null,
            containerCssClass: ':all:'
        });
    }

    acaCalActive(function () {
        $('#semester').append('<option value="">- Choose Academic Session -</option>');
        let names = "";
        $.each(obj_kalendar.data, function (i, item) {
            select = "";
            if (getSession == item.cur_year.replace('/', '') + '/' + item.cal_cohort) {
                select = "selected";
            }

            if (names != item.cur_year.replace('/', '') + '/' + item.cal_cohort) {
                names = item.cur_year.replace('/', '') + '/' + item.cal_cohort;

                $('#semester').append('<option ' + select + ' value="' + item.cal_id + '" calYear="' + item.cur_year + '" calSem="' + item.cal_cohort + '">' + item.cur_year.replace('/', '') + '/' + item.cal_cohort + '</option>');
            }
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:'
        });
    });

    setTimeout(() => {
        let selectSession = $("#semester option:selected").attr("calYear");
        let sem = $("#semester option:selected").attr("calSem");
        let fk_acaCal = $("#semester option:selected").attr('value');
        let pgm_fk = $('#programme').val();

        if (selectSession != "" && pgm_fk != "") {
            $("#loading_mode").modal('show');


            loadListStd(selectSession, sem, pgm_fk, fk_acaCal);

            window.sessionStorage.removeItem('pgm_id');
            window.sessionStorage.removeItem('pgmSession');
        }
    }, Math.random() * 1000);



});

$('#back_page').on("click", function () {
    $('#viewResult').modal('hide');
});

$("#search_form").on('submit', function (e) {
    if (!confirmed) {
        e.preventDefault();
        $("#loading_mode").modal('show');
        let selectSession = $("#semester option:selected").attr("calYear");
        let fk_acaCal = $("#semester option:selected").attr('value');
        let sem = $("#semester option:selected").attr("calSem");
        let pgm_fk = $('#programme').val();

        loadListStd(selectSession,sem,pgm_fk,fk_acaCal); 
        load_capaian();     
    }
});

function loadListStd(selectSession, sem, pgm_fk, fk_acaCal) {
    window.sessionStorage.cur_year = selectSession;
    window.sessionStorage.cal_cohort = sem;
    window.sessionStorage.pgm_fk = pgm_fk;

    let cal_cohort = window.sessionStorage.cal_cohort;
    let cur_year = window.sessionStorage.cur_year;
    // let pgm_fk = window.sessionStorage.pgm_fk;

    let objPgm = new get(host + "api_tetapan_picoms/public/misPrmProg/show/" + pgm_fk, 'picoms ' + token).execute();

    if (objPgm.success == 'true') {
        let data = objPgm.data;

        $("#fac_name").html(data.fac_name);
        // $("#fac_name_dis").html(data.fac_name);

        $("#pgm_name").html(data.pgm_name);
        // $("#pgm_name_dis").html(data.pgm_name);
        $("#session").html(cur_year.replace('/', "") + "/" + cal_cohort);
    }

    let form = new FormData();
    form.append('cal_cohort', cal_cohort);
    form.append('cur_year', cur_year);
    form.append('pgm_fk', pgm_fk);

    let obj = new post(host + "api_pengurusan_pelajar/public/curAcademic/acSummary", form, 'picoms ' + token).execute();

    var gs = 0, cs = 0, f = 0, std_more = 0, std_less = 0;
    var num1 = 0, num2 = 0, num3 = 0, num4 = 0, num5 = 0, num6 = 0, num7 = 0;
    var numc1 = 0, numc2 = 0, numc3 = 0, numc4 = 0, numc5 = 0, numc6 = 0, numc7 = 0;
    let stat_gpa = [];
    let stat_cgpa = [];

    if (obj.success) {
        let data = obj.data;
        let sum = data.length;
        let dataStd = data;
        data_load = data;

        $("#total_std").html(sum);

        // capaianExam = load_capaian();
        load_capaian();
        capaianExam = window.capaianData;
        // console.log(capaianExam);
        let addExam = capaianExam[0];
        let uptExam = capaianExam[1];
        let delExam = capaianExam[2];
    
        console.log(addExam);
        console.log(uptExam);
        console.log(delExam);
    
      
    
        if (uptExam == 1){
            $("#btn_generate").prop('disabled',false);
            $("btnGenerate").prop('disabled',false);
        }
        else{
            // ExamUpdateDisabled = ''; 
            $("#btn_generate").prop('disabled',true);
            $("btnGenerate").prop('disabled',true);
        }
    
        // if (window.sessionStorage.usrRole == 'dekan' || window.sessionStorage.usrRole == 'ketuaPJ')
        // {
        //     $("#btn_generate").prop('disabled',true);
        //     $("btnGenerate").prop('disabled',true);


        // }
        // else{
            // $("#btn_generate").prop('disabled',false);
            // $("btnGenerate").prop('disabled',false);
        // }

        
        $("#rpt_list").prop('disabled',false);
        $("#rpt_summary").prop('disabled',false);
        $("#statistic_desk").prop('class','col-md-6');
        var columns = [
            { "name": "bil", "title": "No." },
            { "name": "sti_name", "title": "Name" },
            { "name": "std_semester", "title": "Semester" },
            { "name": "std_gpa", "title": "GPA" },
            { "name": "std_cgpa", "title": "CGPA" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" }
        ];

        var list = [];
        let bil = 1;

        async function doSomethingAsync(item) {
            return new Promise(resolve => {
                setTimeout(() => {
                    $("#load_text").html(item.student);
                    resolve();
                }, Math.random() * 1000);
            });
        }

        async function main() {
            let data_intake = [];

            await Promise.all(
                data.map(async (item, i) => {
                    if (i == 0) {
                        $("#cal_intake").html(item.cal_intake);
                        $("#semester_intake").html(cal_cohort);
                    }

                    cgpa = (item.std_cgpa) * 1;
                    gpa = (item.std_gpa) * 1;

                    //GPA
                    if (gpa >= 2.00) {
                        std_more++;
                    }
                    else {
                        std_less++;
                    }

                    if (gpa < 1.00) {
                        num1++;

                    }
                    else if (gpa < 1.50) {
                        num2++;
                    }
                    else if (gpa < 1.99) {
                        num3++;

                    }
                    else if (gpa < 2.50) {
                        num4++;

                    }
                    else if (gpa < 3.00) {
                        num5++;
                    }
                    else if (gpa < 3.50) {
                        num6++;
                    }
                    else {
                        num7++;
                    }

                    //CGPA
                    if (cgpa >= 2.00) {
                        gs++;
                    }
                    else if (cgpa < 2.00 && cgpa > 1.50) {
                        cs++;
                    }
                    else {
                        f++;
                    }

                    if (cgpa < 1.00) {
                        numc1++;
                        label_color = "text-danger";

                    }
                    else if (cgpa < 1.50) {
                        numc2++;
                        label_color = "text-danger";
                    }
                    else if (cgpa < 1.99) {
                        numc3++;
                        label_color = "text-warning";

                    }
                    else if (cgpa < 2.50) {
                        numc4++;
                        label_color = "text-success";

                    }
                    else if (cgpa < 3.00) {
                        numc5++;
                        label_color = "text-success";

                    }
                    else if (cgpa < 3.50) {
                        numc6++;
                        label_color = "text-success";

                    }
                    else {
                        numc7++;
                        label_color = "text-success";
                    }

                    let dis_cgpa = item.std_cgpa;

                    if (item.std_cgpa == null) {
                        dis_cgpa = "N/A";
                        label_color = "";
                    }

                    list.push({
                        bil: bil++,
                        sti_name: '<b>' + item.std_studentid + '</b><br>' + item.sti_name,
                        std_semester: `<p class="text-center">` + item.std_semester + '</p>',
                        // pgm_name: field.pgm_name,
                        std_gpa: item.std_gpa,
                        std_cgpa: `<b class="` + label_color + `">` + dis_cgpa + '</b>',
                        "upt_btn": '<button class="btn btn-icon m-b-1" title="Update" onclick="loadData(`' + item.std_studentid + '`,' + item.cal_id + ',`' + sem + '`,`' + selectSession + '`,`' + item.pk_cur_academic + '`)" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="fa fa-bars"></i></button>'
                        // '<button class="btn btn-link text-danger m-b-1" onclick="del(\''+field.std_studentid+'\')" title="Remove"><i class="fa fa-times"></i>'
                    });

                    await doSomethingAsync({ "student": item.sti_name });

                })
            );
        }

        setTimeout(() => {

            $("#tblStd").html('');
            $("#tblStd").footable({
                "columns": columns,
                "rows": list,
                "paging": {
                    "enabled": false,
                    "size": 10,
                    "countFormat": "Showing {PF} to {PL} of {TR} data"
                },
                "filtering": {
                    "enabled": true,
                    "placeholder": "Search...",
                    "dropdownTitle": "Search for:"
                }
            });

            stat_gpa = [num1, num2, num3, num4, num5, num6, num7];
            stat_cgpa = [numc1, numc2, numc3, numc4, numc5, numc6, numc7];

            // $("#total_gs").html(gs);
            // $("#total_cs").html(cs);
            // $("#total_f").html(f);

            $("#std_more").html(std_more);
            $("#std_less").html(std_less);
            $("#load_text").html("Loading...");
            $("#loading_mode").modal("hide");

            create_chart(stat_gpa, stat_cgpa);


            let objCont = new post(host + 'api_pengurusan_pelajar/public/curAcademic/student/contPgm', form, 'picoms ' + token).execute();
            if (objCont.success) {
                data = objCont.data;
                let semester = "";
                let num = 1;
                let total_std = 0;

                let pgm = $("#programme option:selected").attr('pgmCode');
                let check_postGrad = postGrade.indexOf(pgm);

                // console.log(data)
                $("#list_standing").html('');
                data.forEach(async (item, i) => {

                    if (semester != item.cur_intake + "-" + item.std_semester) {

                        let filterConditions = {
                            cur_intake: item.cur_intake,
                            std_semester: item.std_semester
                        };

                        if (i != 0) {
                            $("#list_standing").append(`
                                <tr class="text-white grey-500"><td colspan="3"><b>TOTAL INTAKE</b></td><td class="text-center"><b>`+ data_intake.length + `</b></td><td colspan="2"></td></tr>`);
                        }

                        data_intake = filterData(dataStd, filterConditions);
                        if (check_postGrad !== -1) {
                            good_standing = filterGoodPass(data_intake);
                            status_list = "GOOD PASS";
                            text_info = "CGPA >= 3.00<br>(CGPA of 3.00 and above)";
                        }
                        else {
                            good_standing = filterGoodStanding(data_intake);
                            status_list = "GOOD STANDING";
                            text_info = "CGPA >= 2.00<br>(CGPA of 2.00 and above)";
                        }

                        $("#list_standing").append(`<tr>
                            <td>`+ num + `</td><td>` + item.cur_intake + `</td><td class="text-center">` + item.std_semester + `</td>
                            <td class="text-center">
                            <b class="text-info">
                            <a onclick="load_stdPgm(`+ item.std_semester + `,'` + item.cur_intake + `','` + status_list + `')" href="javascript:void(0);">` + good_standing.length + `</a>
                            </b>
                            </td><td><i>`+ status_list + `</i></td><td>` + text_info + `</td>
                            </tr>`);
                        num++;
                        semester = item.cur_intake + "-" + item.std_semester;
                        total_std += (item.total) * 1;

                        for (num_loop = 1; num_loop < 3; num_loop++) {
                            if (num_loop == 1) {
                                if (check_postGrad !== -1) {
                                    list_standing = filterContPass(data_intake);
                                    // console.log("CONT STANDING : "+JSON.stringify(list_standing));

                                    status_list = "CONDITIONAL PASS";
                                    text_info = '3.00 > CGPA >= 2.50<br>(CGPA of 2.50 to 3.00)';
                                }
                                else {
                                    list_standing = filterContStanding(data_intake);
                                    // console.log("CONT STANDING : "+JSON.stringify(list_standing));

                                    status_list = "CONDITIONAL STANDING";
                                    text_info = '2.00 > CGPA >= 1.50<br>(CGPA of 1.51 to 1.99)';
                                }
                            }
                            else {
                                if (check_postGrad !== -1) {
                                    list_standing = filterFail(data_intake);
                                    // console.log("FAILED : "+JSON.stringify(list_standing));

                                    status_list = "FAIL";
                                    text_info = 'CGPA < 2.50<br>(CGPA of 2.50 and below)';
                                }
                                else {
                                    list_standing = filterFailed(data_intake);
                                    // console.log("FAILED : "+JSON.stringify(list_standing));

                                    status_list = "FAILED";
                                    text_info = 'CGPA <= 1.50<br>(CGPA of 1.50 and below)';
                                }
                            }

                            $("#list_standing").append(`<tr>
                                <td></td><td></td><td class="text-center">`+ item.std_semester + `</td>
                                <td class="text-center">
                                <b class="text-info">
                                <a onclick="load_stdPgm(`+ item.std_semester + `,'` + item.cur_intake + `','` + status_list + `')" href="javascript:void(0);">` + list_standing.length + `</a>
                                </b>
                                </td><td><i>`+ status_list + `</i></td><td>` + text_info + `</td>
                                </tr>`);
                        }
                    }
                });

                $("#list_standing").append(`
                        <tr class="text-white grey-500"><td colspan="3"><b>TOTAL INTAKE</b></td><td class="text-center"><b>`+ data_intake.length + `</b></td><td colspan="2"></td></tr>
                    `);

                $(".total_std").html(dataStd.length);
            }

        }, Math.random() * 1000);

        main();

        $("#btn_generate").click(() => {
            swal({
                title: "Generate all GPA/CGPA",
                text: "Sure?",
                type: "question",
                showCancelButton: true,
                confirmButtonText: "Yes",
                confirmButtonColor: "#2196f3",
                closeOnConfirm: true,
                allowOutsideClick: false,
                html: false
            }).then(function () {
                $("#modal_generate").modal('show');
                $(".list_generate").html('');

                main_generateAll();
            });

            async function doSomethingAsync(item, i, length) {
                return new Promise(resolve => {
                    setTimeout(() => {

                        $("#pgm_name").html(item.pgm_name + ' - ' + item.cur_year.replace('/', '') + '/' + item.cal_cohort);

                        percent = (i / length) * 100;

                        $(".progress-bar").prop('style', 'width: ' + percent.toFixed(0) + "%");
                        $(".progress-bar").html(percent.toFixed(0) + "%");

                        $(".list_generate").html(
                            `<tr>
                                <td>`+ item.std_studentid + `</td>
                                <td>`+ item.sti_name + '<br>' + item.sti_icno + `</td>
                            </tr>`
                        )

                        // $(".list_generate").append(item);
                        resolve();
                    }, Math.random() * 1000);
                });
            }

            async function main_generateAll() {
                let nombor = 0;

                await Promise.all(
                    data_load.map(async (item, i) => {

                        let list = item;
                        let tCredit = 0;
                        let count_Pointer = 0;
                        let tPointer = 0;
                        let tTcp = 0;
                        let gpa = 0;
                        let pk_cur_academic = null;
                        let std_semester = "";
                        nombor++;

                        await doSomethingAsync(list, nombor, data.length);

                        var form = new FormData();
                        form.append("std_studentid", item.std_studentid);
                        form.append("aca_session", item.cal_id);

                        let obj = await new post(host + "api_pengurusan_pelajar/public/misStdRegsub/listByActPolicy", form, 'picoms ' + token).execute();

                        if (obj.success) {
                            let obj_regCrs = obj.data;

                            obj = new get(host + "api_pengurusan_pelajar/public/curAcademic/showAcaCal/" + item.std_studentid + "/" + item.cal_id, 'picoms ' + token).execute();

                            if (obj.success) {
                                datastd = obj.data;

                                pk_cur_academic = datastd.pk_cur_academic;
                                std_semester = datastd.std_semester;
                            }

                            await obj_regCrs.forEach(async (itemJ, j) => {
                                let selectSession = $("#semester option:selected").attr("calYear");
                                let sem = $("#semester option:selected").attr("calSem");

                                let objLect = await new get(host + 'api_lecturer_picoms/public/misLectCrsPrm/listByCotDet/' + itemJ.fk_cotDet, 'picoms ' + token).execute();
                                // let list_lect = "";
                                let final_exam = "checked";
                                if (objLect.success) {
                                    data_lect = objLect.data;
                                    data_lect.forEach(async (uData, u) => {
                                        if (uData.final_exam == "") {
                                            final_exam = "";
                                        }
                                    });
                                }


                                if ((selectSession.replace('/', '') < "20222023") || (selectSession.replace('/', '') == "20222023" && sem < "3")) {
                                    if (itemJ.counted_cgpa == "Yes" && itemJ.ip != "checked") {
                                        tCredit += (itemJ.crs_credit) * 1;
                                        count_Pointer = ((itemJ.point) * 1) * ((itemJ.crs_credit) * 1);
                                        tTcp += count_Pointer;
                                        tPointer += (itemJ.point) * 1;
                                    }
                                }
                                else {
                                    if (final_exam == "") {
                                        if ((itemJ.counted_cgpa == "Yes" && itemJ.ip != "checked") || itemJ.rsb_type == "CT") {
                                            tCredit += (itemJ.crs_credit) * 1;
                                            count_Pointer = ((itemJ.point) * 1) * ((itemJ.crs_credit) * 1);
                                            tTcp += count_Pointer;
                                            tPointer += (itemJ.point) * 1;
                                        }
                                    }
                                    else {

                                        //aku buang attendance sbb kat API xda attendance nnti kat generate luar xdpt nak generate 25june2024 afiez
                                        if ((itemJ.counted_cgpa == "Yes" && itemJ.ip != "checked") || itemJ.rsb_type == "CT") {

                                            // if((itemJ.counted_cgpa == "Yes" && itemJ.ip != "checked" && itemJ.attendance == "Attend") || itemJ.rsb_type == "CT"){
                                            tCredit += (itemJ.crs_credit) * 1;
                                            count_Pointer = ((itemJ.point) * 1) * ((itemJ.crs_credit) * 1);
                                            tTcp += count_Pointer;
                                            tPointer += (itemJ.point) * 1;
                                        }
                                        else if (itemJ.attendance != "Attend") {
                                            tCredit += (itemJ.crs_credit) * 1;
                                        }
                                    }
                                }

                            }); //foreach_subject

                            gpa = (tTcp / tCredit);

                            if (isNaN(gpa)) {
                                gpa = 0.00;
                            }

                            list['pk_cur_academic'] = pk_cur_academic;
                            list['tc'] = tCredit;
                            list['tcp'] = tPointer.toFixed(2);
                            list['tgp'] = tTcp.toFixed(2);
                            list['gpa'] = gpa.toFixed(2);
                            // list['bil'] = (i+1);
                            list['std_semester'] = std_semester;

                            if (pk_cur_academic == null) {
                                swal("Generate all GPA/CGPA Failed", 'No Academic Session Registered', 'error');
                                return;
                            }
                            else {
                                let form = new FormData();
                                form.append('tgp', tTcp.toFixed(2));
                                form.append('std_gpa', gpa.toFixed(2));
                                if (std_semester == 1) {
                                    form.append('std_cgpa', gpa.toFixed(2));
                                }
                                else {
                                    let cgpa = 0.00;
                                    let objCGPA = new get(host + 'api_pengurusan_pelajar/public/curAcademic/cgpa/' + item.std_studentid + '/' + pk_cur_academic + '/' + std_semester, 'picoms ' + token).execute();
                                    if (objCGPA.success) {
                                        let dataCGPA = objCGPA.data;

                                        sumTC = (dataCGPA.sumTC) * 1;
                                        sumTGP = (dataCGPA.sumTGP) * 1;

                                        sumTC += tCredit;
                                        sumTGP += tTcp;
                                        cgpa = (sumTGP / sumTC);

                                        cgpa = cgpa.toFixed(4);

                                        if (cgpa.substring(5, 6) == "0") {
                                            cgpa = Number(cgpa) + 0.0001;
                                            cgpa = cgpa.toFixed(2);
                                        }
                                        else {
                                            cgpa = Number(cgpa);
                                            cgpa = cgpa.toFixed(2);
                                        }

                                    }
                                    else {
                                        form.append('std_cgpa', gpa.toFixed(2));
                                    }



                                    list['cgpa'] = cgpa;
                                    form.append('std_cgpa', cgpa);

                                }
                                form.append('id', pk_cur_academic);
                                form.append('tc', tCredit.toFixed(2));
                                form.append('tcp', tPointer.toFixed(2));
                                form.append('updated_by', window.sessionStorage.usrName);

                                let obj = new post(host + "api_pengurusan_pelajar/public/curAcademic/updateGPA", form, 'picoms ' + token).execute();

                            }
                        }
                    })
                ).then(function () {
                    let selectSession = $("#semester option:selected").attr("calYear");
                    let fk_acaCal = $("#semester option:selected").attr('value');
                    let sem = $("#semester option:selected").attr("calSem");
                    let pgm_fk = $('#programme').val();

                    loadListStd(selectSession, sem, pgm_fk, fk_acaCal);

                    setTimeout(() => {
                        swal("Generate all GPA/CGPA", 'Success', 'success');
                        $(".list_generate").html('');
                        $("#modal_generate").modal('hide');
                    }, Math.random() * 1000);

                });


            }

        });
    }
}

$("#rpt_list").click(() => {
    window.open('print_gpa.html');
});

$("#rpt_summary").click(() => {
    window.open('print_summary.html');
});

function loadData(student_id, cal_id, sem, selectSession, pk_cur_academic) {
    $('#viewResult').modal('show');
    $(".btnGenerate").prop('disabled', true);

    $("#tblResult").html(`<tr><td><p class="text-center"><i class="fa fa-cog fa-spin"></i></p></td></tr>`);

    listByActPolicy(student_id, cal_id, selectSession, sem, function () {
        var columns = [
            { "name": "bil", "title": "No." },
            { "name": "cur_year", "title": "Academic Session" },
            { "name": "crs_code", "title": "Course Code" },
            { "name": "rsb_type", "title": "Type" },
            { "name": "credit", "title": "Credit" },
            { "name": "tMark", "title": "Total Mark" },
            { "name": "grade", "title": "Grade" },
            { "name": "point", "title": "Point" },
            { "name": "tcp", "title": "TGP" },
            { "name": "btn_lect", "title": "Lecturer" },
            { "name": "remark", "title": "Remark" },

        ];

        let obj = new get(host + "api_pengurusan_pelajar/public/misStdInfo/show/" + student_id, 'picoms ' + token).execute();

        if (obj.success) {
            datastd = obj.data;

            $("#student_id").html(student_id);
            $("#name_std").html(datastd.sti_name);
            $("#noic").html('(' + datastd.sti_icno + ')');
            $("#programme_name").html(datastd.pgm_name);
            $("#intake_std").html('INTAKE: ' + datastd.cur_intake);
            $("#sem_academic").html(' - ' + selectSession.replace("/", "") + '/' + sem);
        }

        obj = new get(host + "api_pengurusan_pelajar/public/curAcademic/showAcaCal/" + student_id + "/" + cal_id, 'picoms ' + token).execute();

        let cgpa_dis = 0.00;

        if (obj.success) {
            datastd = obj.data;
            $("#sem_std").html(datastd.std_semester);
            pk_cur_academic = datastd.pk_cur_academic;
            std_semester = datastd.std_semester;
            cgpa_dis = datastd.std_cgpa;
        }

        let bil = 1;
        var list = [];
        let tCredit = 0;
        let tPointer = 0;
        let tTcp = 0;

        obj_regCrs.data.forEach(async (itemJ, j) => {

            let count_Pointer = 0;
            let counted = `<br><small class="label bg-danger">Not Counted</small>`;
            let acaSession = itemJ.acaYear;
            let acaCal = acaSession.replace('/', '') + '/' + itemJ.cal_cohort;
            let catatan = "";
            let mrf = "";

            if (itemJ.ip == "checked") {
                counted = "";
                catatan = "<label class='label bg-warning'>In Progress</label>";
            }

            if (itemJ.mrf == "checked") {
                counted = "";
                mrf = "/MRF";
            }

            let selectSession = $("#semester option:selected").attr("calYear");
            let sem = $("#semester option:selected").attr("calSem");

            if ((selectSession.replace('/', '') < "20222023") || (selectSession.replace('/', '') == "20222023" && sem < "3")) {
                if (itemJ.counted_cgpa == "Yes" && itemJ.ip != "checked") {
                    counted = "";
                    tCredit += (itemJ.crs_credit) * 1;
                    count_Pointer = ((itemJ.point) * 1) * ((itemJ.crs_credit) * 1);
                    tTcp += count_Pointer;
                    tPointer += (itemJ.point) * 1;
                }

                let objLect = await new get(host + 'api_lecturer_picoms/public/misLectCrsPrm/listByCotDet/' + itemJ.fk_cotDet, 'picoms ' + token).execute();
                let list_lect = "";
                if (objLect.success) {
                    data_lect = objLect.data;
                    data_lect.forEach(async (uData, u) => {
                        if (u > 0) {
                            list_lect += '<br>';
                        }

                        list_lect += `<span class="text-info">
                            <a href="javascript:void(0);" onclick="load_detLectStd('`+ uData.lectCrsId + `','` + itemJ.fk_course + `','` + itemJ.aca_session + `','` + itemJ.cal_cohort + `','` + itemJ.acaYear + `','` + uData.empId + `')">
                            <i class="fa fa-user"></i> ` + uData.emp_name + `</a></span>`;
                    });
                }

                let tMark = (itemJ.tMark) * 1;

                gradeStdFinalCheck = (itemJ.counted_cgpa === "Yes") ? itemJ.grade : (((tMark.toFixed(0)) >= 50) ? 'PASS' : 'FAIL');
                pointStdFinalCheck = (itemJ.counted_cgpa === "Yes" ) ? itemJ.point : '';

                // console.log(itemJ);
                list.push({
                    bil: bil++, cur_year: acaCal, crs_code: '<span class="text-uppercase">' + itemJ.crsCode + ' - ' + itemJ.crs_name + '</span>' + counted, credit: itemJ.crs_credit,
                    // btn_lect: '<span id="lectList-'+itemJ.fk_cotDet+'"></span><textarea class="hidden" id="dataLect_'+itemJ.fk_cotDet+'"></textarea>',
                    rsb_type: `<span class="text-center">` + itemJ.rsb_type + mrf + `</span>`,
                    tMark: `<span class="text-info">` + tMark.toFixed(0) + `</span>`,
                    grade: `<span class="text-info">` + gradeStdFinalCheck + `</span>`,
                    point: `<span class="text-info">` + pointStdFinalCheck + `</span>`,
                    // point: `<span class="text-info">` + itemJ.point + `</span>`,
                    tcp: `<span class="text-info">` + count_Pointer.toFixed(2) + `</span>`,
                    btn_lect: list_lect,
                    remark: catatan
                });
            }
            else {
                let objLect = await new get(host + 'api_lecturer_picoms/public/misLectCrsPrm/listByCotDet/' + itemJ.fk_cotDet, 'picoms ' + token).execute();
                let list_lect = "";
                let final_exam = "checked";
                if (objLect.success) {
                    data_lect = objLect.data;
                    data_lect.forEach(async (uData, u) => {
                        if (u > 0) {
                            list_lect += '<br>';
                        }
                        if (uData.final_exam == "") {
                            final_exam = "";
                        }
                        list_lect += `<span class="text-info">
                            <a href="javascript:void(0);" onclick="load_detLectStd('`+ uData.lectCrsId + `','` + itemJ.fk_course + `','` + itemJ.aca_session + `','` + itemJ.cal_cohort + `','` + itemJ.acaYear + `','` + uData.empId + `')">
                            <i class="fa fa-user"></i> ` + uData.emp_name + `</a></span>`;
                    });
                }


                if (final_exam == "") {
                    if ((itemJ.counted_cgpa == "Yes" && itemJ.ip != "checked") || itemJ.rsb_type == "CT") {
                        counted = "";
                        tCredit += (itemJ.crs_credit) * 1;
                        count_Pointer = ((itemJ.point) * 1) * ((itemJ.crs_credit) * 1);
                        tTcp += count_Pointer;
                        tPointer += (itemJ.point) * 1;
                    }
                    else if (itemJ.counted_cgpa == "Yes" && itemJ.ip != "checked") {
                        tCredit += (itemJ.crs_credit) * 1;
                        counted = "";
                    }

                    let tMark = (itemJ.tMark) * 1;
                    attend = '';
                    if (itemJ.rsb_status == "CECT") {
                        attend = "";
                    }

                    if (itemJ.rsb_type == "CE") {
                        tCredit = tCredit - (itemJ.crs_credit) * 1;
                    }
                    gradeStdFinalCheck = (itemJ.counted_cgpa === "Yes") ? itemJ.grade : (((tMark.toFixed(0)) >= 50) ? 'PASS' : 'FAIL');
                    pointStdFinalCheck = (itemJ.counted_cgpa === "Yes" ) ? itemJ.point : '';

                    list.push({
                        bil: bil++, cur_year: acaCal, crs_code: '<span class="text-uppercase">' + itemJ.crsCode + ' - ' + itemJ.crs_name + '</span>' + counted, credit: itemJ.crs_credit,
                        // btn_lect: '<span id="lectList-'+itemJ.fk_cotDet+'"></span><textarea class="hidden" id="dataLect_'+itemJ.fk_cotDet+'"></textarea>',
                        rsb_type: `<span class="text-center">` + itemJ.rsb_type + mrf + `</span>`,
                        tMark: `<span class="text-info">` + tMark.toFixed(0) + `</span>`,
                        grade: `<span class="text-info">` + gradeStdFinalCheck + `</span>`,
                        // grade: `<span class="text-info">`+itemJ.grade+`</span>`,
                        point: `<span class="text-info">` + pointStdFinalCheck + `</span>`,
                        // point: `<span class="text-info">` + itemJ.point + `</span>`,
                        tcp: `<span class="text-info">` + count_Pointer.toFixed(2) + `</span>`,
                        btn_lect: list_lect,
                        remark: catatan + attend
                    });
                }
                else {
                    if ((itemJ.counted_cgpa == "Yes" && itemJ.ip != "checked" && itemJ.attendance == "Attend") || itemJ.rsb_type == "CT") {
                        counted = "";
                        tCredit += (itemJ.crs_credit) * 1;
                        count_Pointer = ((itemJ.point) * 1) * ((itemJ.crs_credit) * 1);
                        tTcp += count_Pointer;
                        tPointer += (itemJ.point) * 1;
                    }
                    else if (itemJ.counted_cgpa == "Yes" && itemJ.ip != "checked" && itemJ.attendance != "Attend") {
                        tCredit += (itemJ.crs_credit) * 1;
                        counted = "";
                    }

                    let tMark = (itemJ.tMark) * 1;

                    // console.log(itemJ);itemJ.fk_course == 733
                    // ||counted === `<br><small class="label bg-danger">Not Counted</small>` || itemJ.final_exam ==null
                    if (itemJ.attendance == "Attend" || itemJ.rsb_status == "CECT") {
                        if (itemJ.rsb_status == "CECT") {
                            attend = "";
                        }

                        if (itemJ.rsb_type == "CE") {
                            tCredit = tCredit - (itemJ.crs_credit) * 1;
                        }

                        if (counted === `<br><small class="label bg-danger">Not Counted</small>`) {
                            attend = '';

                        } else {
                            attend = '<br><span class="label success">Attend</span>';

                        }

                        gradeStdFinalCheck = (itemJ.counted_cgpa === "Yes") ? itemJ.grade : (((tMark.toFixed(0)) >= 50) ? 'PASS' : 'FAIL');
                        pointStdFinalCheck = (itemJ.counted_cgpa === "Yes" ) ? itemJ.point : '';

                        list.push({
                            bil: bil++, cur_year: acaCal, crs_code: '<span class="text-uppercase">' + itemJ.crsCode + ' - ' + itemJ.crs_name + '</span>' + counted, credit: itemJ.crs_credit,
                            // btn_lect: '<span id="lectList-'+itemJ.fk_cotDet+'"></span><textarea class="hidden" id="dataLect_'+itemJ.fk_cotDet+'"></textarea>',
                            rsb_type: `<span class="text-center">` + itemJ.rsb_type + mrf + `</span>`,
                            tMark: `<span class="text-info">` + tMark.toFixed(0) + `</span>`,
                            grade: `<span class="text-info">` + gradeStdFinalCheck + `</span>`,
                            point: `<span class="text-info">` + pointStdFinalCheck + `</span>`,
                            // point: `<span class="text-info">` + itemJ.point + `</span>`,
                            tcp: `<span class="text-info">` + count_Pointer.toFixed(2) + `</span>`,
                            btn_lect: list_lect,
                            remark: catatan + attend
                        });
                    }
                    else {

                        attend = `<br><span class="label danger">Not Attend</span>`;
                        list.push({
                            bil: bil++, cur_year: acaCal, crs_code: '<span class="text-uppercase">' + itemJ.crsCode + ' - ' + itemJ.crs_name + '</span>' + counted, credit: itemJ.crs_credit,
                            // btn_lect: '<span id="lectList-'+itemJ.fk_cotDet+'"></span><textarea class="hidden" id="dataLect_'+itemJ.fk_cotDet+'"></textarea>',
                            rsb_type: `<span class="text-center">` + itemJ.rsb_type + mrf + `</span>`,
                            tMark: `<span class="text-info">0.00</span>`,
                            grade: `<span class="text-info">F</span>`,
                            point: `<span class="text-info">0.00</span>`,
                            tcp: `<span class="text-info">0.00</span>`,
                            btn_lect: list_lect,
                            remark: catatan + attend
                        });
                    }
                }

            }

            if ((j + 1) == obj_regCrs.data.length) {
                let gpa = parseFloat((tTcp / tCredit));
                if (isNaN(gpa)) {
                    gpa = 0.00;
                }
                cgpa_dis = "N/A";

                if (std_semester == 1) {
                    if (tTcp > 0.00) {
                        // $(".btnGenerate").prop('disabled',false);
                        if (window.sessionStorage.usrRole == 'dekan' || window.sessionStorage.usrRole == 'ketuaPJ') {
                            $(".btnGenerate").prop('disabled', true);


                        }
                        else {
                            $(".btnGenerate").prop('disabled', false);
                        }
                    }

                    cgpa_dis = gpa.toFixed(4);

                    if (cgpa_dis.substring(5, 6) == "0") {
                        cgpa_dis = Number(gpa) + 0.0001;
                        gpa = Number(gpa) + 0.0001;
                        cgpa_dis = cgpa_dis.toFixed(2);
                    }
                    else {
                        cgpa_dis = Number(cgpa_dis);
                        cgpa_dis = cgpa_dis.toFixed(2);
                    }

                    // cgpa_dis = gpa;
                }
                else {
                    // if(tTcp > 0.00){
                    // $(".btnGenerate").prop('disabled',false);
                    if (window.sessionStorage.usrRole == 'dekan' || window.sessionStorage.usrRole == 'ketuaPJ') {
                        $(".btnGenerate").prop('disabled', true);


                    }
                    else {
                        $(".btnGenerate").prop('disabled', false);
                    }
                    let objCGPA = await new get(host + 'api_pengurusan_pelajar/public/curAcademic/cgpa/' + student_id + '/' + pk_cur_academic + '/' + std_semester, 'picoms ' + token).execute();
                    // console.log(objCGPA)
                    // cgpa_dis = 0.00;
                    if (objCGPA.success) {
                        let dataCGPA = objCGPA.data;

                        sumTC = (dataCGPA.sumTC) * 1;
                        sumTGP = (dataCGPA.sumTGP) * 1;

                        sumTC += tCredit;
                        sumTGP += tTcp;

                        cgpa_dis = (sumTGP / sumTC);

                        cgpa_dis = cgpa_dis.toFixed(4);

                        // console.log(cgpa_dis);
                        // console.log(cgpa_dis.substring(5,6))

                        if (cgpa_dis.substring(5, 6) == "0") {
                            cgpa_dis = Number(cgpa_dis) + 0.0001;
                            cgpa_dis = cgpa_dis.toFixed(2);
                        }
                        else {
                            cgpa_dis = Number(cgpa_dis);
                            cgpa_dis = cgpa_dis.toFixed(2);
                        }

                        // console.log(cgpa_dis)


                    }
                    else {
                        swal("Not Found Previous CGPA", "check previous semester result", "warning");
                        cgpa_dis = gpa.toFixed(4);

                        if (cgpa_dis.substring(5, 6) == "0") {
                            cgpa_dis = Number(gpa) + 0.0001;
                            gpa = Number(gpa) + 0.0001;
                            cgpa_dis = cgpa_dis.toFixed(2);
                        }
                        else {
                            cgpa_dis = gpa.toFixed(2);
                        }
                    }

                    // }
                    // else{
                    // }                   
                }

                $(".btnGenerate").prop('disabled', false);
                list.push({
                    bil: "", cur_year: "", crs_code: "", credit: '<b id="tc_point">' + tCredit.toFixed(2) + '</b>', tMark: "", grade: "", point: '<b id="tcp_point">' + tPointer.toFixed(2) + '</b>',
                    tcp: '<b id="tgp_point">' + tTcp.toFixed(2) + '</b>'
                });
                list.push({
                    bil: "", cur_year: "", crs_code: "", credit: "", tMark: "", grade: "", point: "<p class='text-right'><b>GPA</b></p>",
                    tcp: "<p><b id='gpa_point'>" + gpa.toFixed(2) + "</b></p>", btn_lect: "<p>CGPA : <b class='cgpa_point'>" + cgpa_dis + "</b></p>"
                });
            }
        });

        setTimeout(() => {
            $("#tblResult").html('');
            $("#tblResult").footable({
                "columns": columns,
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
        }, Math.random() * 1000);

        $(".btnGenerate").click(() => {
            let tgp = $("#tgp_point").html();
            let gpa = $("#gpa_point").html();
            let id = pk_cur_academic;
            let tc = $("#tc_point").html();
            let tcp = $("#tcp_point").html();
            let cgpa = $(".cgpa_point").html();
            let std_semester = $("#sem_std").html();

            swal({
                title: "Generate GPA/CGPA",
                text: student_id,
                type: "question",
                showCancelButton: true,
                confirmButtonText: "Generate",
                confirmButtonColor: "#2196f3",
                closeOnConfirm: true,
                allowOutsideClick: false,
                html: false
            }).then(function () {
                let form = new FormData();
                form.append('tgp', tgp);
                form.append('std_gpa', gpa);
                if (std_semester == 1) {
                    form.append('std_cgpa', cgpa);
                } else if (std_semester == 2) {

                    let objchkStdCurSem = new get(host + 'api_pengurusan_pelajar/public/curAcademic/chkStdCurSem/' + student_id, 'picoms ' + token).execute();

                    if (objchkStdCurSem.success) {



                        $.each(objchkStdCurSem.data, function (index, item) {
                            if (item.std_semester === 1) {
                                if (item.curAcademic_type === 'Deferred') {


                                    form.append('std_cgpa', cgpa);
                                } else {

                                }
                            }
                            else {
                                let cgpa = 0.00;
                                let objCGPA = new get(host + 'api_pengurusan_pelajar/public/curAcademic/cgpa/' + student_id + '/' + id + '/' + std_semester, 'picoms ' + token).execute();
                                if (objCGPA.success) {
                                    let dataCGPA = objCGPA.data;
                                    // console.log(objCGPA)

                                    sumTC = (dataCGPA.sumTC) * 1;
                                    sumTGP = (dataCGPA.sumTGP) * 1;

                                    sumTC += tCredit;
                                    sumTGP += tTcp;
                                    cgpa = (sumTGP / sumTC);

                                }

                                cgpa = cgpa.toFixed(4);

                                if (cgpa.substring(5, 6) == "0") {
                                    cgpa = Number(cgpa) + 0.0001;
                                    cgpa = cgpa.toFixed(2);

                                    cgpa = Number(cgpa);

                                }
                                else {
                                    cgpa = Number(cgpa);
                                }

                                form.append('std_cgpa', cgpa.toFixed(2));

                            }
                        });

                    }

                }
                else {
                    let cgpa = 0.00;
                    let objCGPA = new get(host + 'api_pengurusan_pelajar/public/curAcademic/cgpa/' + student_id + '/' + id + '/' + std_semester, 'picoms ' + token).execute();
                    if (objCGPA.success) {
                        let dataCGPA = objCGPA.data;
                        // console.log(objCGPA)

                        sumTC = (dataCGPA.sumTC) * 1;
                        sumTGP = (dataCGPA.sumTGP) * 1;

                        sumTC += tCredit;
                        sumTGP += tTcp;
                        cgpa = (sumTGP / sumTC);

                    }

                    cgpa = cgpa.toFixed(4);

                    if (cgpa.substring(5, 6) == "0") {
                        cgpa = Number(cgpa) + 0.0001;
                        cgpa = cgpa.toFixed(2);

                        cgpa = Number(cgpa);

                    }
                    else {
                        cgpa = Number(cgpa);
                    }

                    form.append('std_cgpa', cgpa.toFixed(2));

                }
                form.append('id', id);
                form.append('tc', tc);
                form.append('tcp', tcp);
                form.append('updated_by', window.sessionStorage.usrName);
                let obj = new post(host + "api_pengurusan_pelajar/public/curAcademic/updateGPA", form, 'picoms ' + token).execute();
                if (obj.success) {
                    swal("Generate GPA/CGPA", 'Success', 'success');
                    let selectSession = $("#semester option:selected").attr("calYear");
                    let fk_acaCal = $("#semester option:selected").attr('value');
                    let sem = $("#semester option:selected").attr("calSem");
                    let pgm_fk = $('#programme').val();

                    loadListStd(selectSession, sem, pgm_fk, fk_acaCal);
                    $('#viewResult').modal('hide');
                }
            });

        });
    });
}

function listByActPolicy(std, acaCal, selectSession, sem, returnValue) {
    var form = new FormData();
    form.append("std_studentid", std);
    form.append("aca_session", acaCal);
    form.append("cal_cohort", sem);
    form.append("cur_year", selectSession);

    var settings = {
        "url": host + "api_pengurusan_pelajar/public/misStdRegsub/listByActPolicy5NoCE",
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
        obj_regCrs = JSON.parse(response);
        returnValue();
    });
}

function getLect(id, returnValue) {
    var settings = {
        "url": host + "api_lecturer_picoms/public/misLectCrsPrm/listByCotDet/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_lect = response;
        returnValue();
    });
}

function load_stdPgm(std_semester, intake, standing) {

    let filterConditions = {
        cur_intake: intake,
        std_semester: std_semester
    };

    let dataStd = [];
    if (standing == "FAILED") {
        let data_intake = filterData(data_load, filterConditions);
        dataStd = filterFailed(data_intake);
    }
    else if (standing == "CONDITIONAL STANDING") {
        let data_intake = filterData(data_load, filterConditions);
        dataStd = filterContStanding(data_intake);
    }
    else if (standing == "GOOD STANDING") {
        let data_intake = filterData(data_load, filterConditions);
        dataStd = filterGoodStanding(data_intake);
    }
    else if (standing == "GOOD PASS") {
        let data_intake = filterData(data_load, filterConditions);
        dataStd = filterGoodPass(data_intake);
    }
    else if (standing == "CONDITIONAL PASS") {
        let data_intake = filterData(data_load, filterConditions);
        dataStd = filterContPass(data_intake);
    }
    else if (standing == "FAIL") {
        let data_intake = filterData(data_load, filterConditions);
        dataStd = filterFail(data_intake);
    }

    let data = dataStd;
    $("#listStdPgm").html('');
    $("#title_standing").html(standing);
    $("#title_intake").html(intake);
    if (data.length > 0) {
        let columns = [
            { "name": "bil", "title": "No.", "breakpoints": "md sm xs" },
            { "name": "student_id", "title": "Student Id" },
            { "name": "std_name", "title": "Name" },
            { "name": "std_semester", "title": "Semester" },
            { "name": "std_gpa", "title": "GPA" },
            { "name": "std_cgpa", "title": "CGPA" },
            { "name": "status_academic", "title": "Status" },
        ];

        let bil = 1;
        let list = [];
        $.each(data, function (i, field) {
            let status_academic = "Active";
            if (field.curAcademic_type == 'With-draw') {
                colors = `red`;
                status_academic = field.curAcademic_type;
            }
            else if (field.curAcademic_type == 'Deferred') {
                status_academic = field.curAcademic_type;
                colors = `secondary`;
            }
            else if (field.curAcademic_type == "") {
                colors = `green`;
            }

            list.push({
                "bil": bil++, "student_id": field.std_studentid, "std_name": field.sti_name, "std_semester": field.std_semester,
                "std_gpa": field.std_gpa, "std_cgpa": field.std_cgpa, "status_academic": `<p class="text-center"><span class="label ` + colors + `">` + status_academic + `<span></p>`
            });
        });

        $("#listStdPgm").footable({
            "columns": columns,
            "rows": list,
            "paging": {
                "enabled": true,
                "size": 20,
                "countFormat": "Showing {PF} to {PL} of {TR} data"
            },
            "filtering": {
                "enabled": true,
                "placeholder": "Search...",
                "dropdownTitle": "Search for:"
            }
        });
    }

    $("#list_stdStanding").modal('show');
}

// Function to filter data based on conditions standing
function filterData(data, conditions) {
    return data.filter(item => {
        for (const key in conditions) {
            if (item[key] != conditions[key]) {
                return false; // If any condition doesn't match, exclude the item
            }
        }
        return true; // All conditions matched, include the item
    });
}

function filterGoodStanding(data) {
    return data.filter(item => item["std_cgpa"] >= 2.0);
}

function filterContStanding(data) {
    return data.filter(item => item["std_cgpa"] < 2.0 && item['std_cgpa'] >= 1.50);
}

function filterFailed(data) {
    // console.log(data);
    return data.filter(item => (item["std_cgpa"] == null || item["std_cgpa"] < 1.50) && item['curAcademic_type'] == "");
}

function filterGoodPass(data) {
    return data.filter(item => item["std_cgpa"] >= 3.0);
}

function filterContPass(data) {
    return data.filter(item => item["std_cgpa"] < 3.0 && item['std_cgpa'] >= 2.50);
}

function filterFail(data) {
    return data.filter(item => item["std_cgpa"] == null || item["std_cgpa"] < 2.50);
}

function create_chart(stat_gpa, stat_cgpa) {
    let dom = document.getElementById('chart_gpaCgpa');
    let myChart = echarts.init(dom);
    var option = {
        tooltip: {
            trigger: 'item'
        },
        grid: {
            borderWidth: 0
        },
        legend: {
            data: ['CGPA', 'GPA']
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                boundaryGap: true,
                show: true,
                data: ['0.00-0.99', '1.00-1.50', '1.51-1.99', '2.00-2.49', '2.50-2.99', '3.00-3.49', '3.50-4.00']
            }
        ],
        yAxis: [
            {
                type: 'value',
                // show: true,
            }
        ],
        series: [
            {
                name: 'CGPA',
                type: 'bar',
                smooth: true,
                itemStyle: {
                    normal: {
                        color: '#B5C334',
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{c}'
                        }
                    }
                },
                data: stat_cgpa
            },
            {
                name: 'GPA',
                type: 'bar',
                smooth: true,
                itemStyle: {
                    normal: {
                        color: '#27727B',
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{c}'
                        }
                    }
                },
                data: stat_gpa
            }

        ]
    };
    myChart.setOption(option);
}

function load_detLectStd(lectCrsId, fk_course, aca_session, cal_cohort, acaYear, lectId) {
    window.sessionStorage.lectCrsId = lectCrsId;
    window.sessionStorage.pk_crs = fk_course;
    window.sessionStorage.fk_aca_cal = aca_session;
    window.sessionStorage.lect_coor = "No";
    window.sessionStorage.cal_cohort = cal_cohort;
    window.sessionStorage.prevPage = "adminPage";
    window.sessionStorage.yearTaken = acaYear;
    window.sessionStorage.lectId = lectId;

    let selectSession = $("#semester option:selected").attr("calYear");
    let sem = $("#semester option:selected").attr("calSem");
    let programme = $("#programme option:selected").attr("pgmCode");

    window.sessionStorage.pgmSession = selectSession.replace('/', '') + '/' + sem;
    window.sessionStorage.calSem = sem;
    window.sessionStorage.pgm_id = programme;
    window.location.replace('detLectCrsStudent.html');
}