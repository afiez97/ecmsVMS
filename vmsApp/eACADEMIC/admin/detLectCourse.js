let usrCatEadmin = window.sessionStorage.usrCatEadmin;
let usrCatEcmis = window.sessionStorage.usrCatEcmis;

$(function () {
    $.ajaxSetup({
        cache: false
    });

    $.fn.select2.defaults.set("theme", "bootstrap");

    let id = window.sessionStorage.lectCrsId;
    let crsId = window.sessionStorage.pk_crs;
    let usrId = window.sessionStorage.usrId;
    let lectId2 = window.sessionStorage.lectId;
    let lectId = lectId2.toUpperCase();
    let fk_cotDet = window.sessionStorage.fk_cotDet;
    let yearTaken = window.sessionStorage.yearTaken;
    let cal_cohort = window.sessionStorage.cal_cohort;
    let category = window.sessionStorage.category;
    let fk_aca_cal = window.sessionStorage.fk_aca_cal;

    // show course lecturer
    detailLectCrs(id, function () {
        let data = obj_detCourse.data;

        $('#lectCrsId').val(id);
        $('#coordinator').val(data.coordinator);
        $('#fk_cotDet').val(data.fk_cotDet);
        $('#crs_code').html(data.crsCode + ' - ' + data.crs_name);
        $('#cur_year').html(yearTaken.replace('/', '') + '/' + cal_cohort);
        $('#emp_id').html(data.emp_name);
        $('#acaCal_type').html(category);

        // if (usrCatEadmin == 1) {
        //     $('#btnNew').show();
        // }
        // else if (usrCatEcmis == 1) {
        //     let usrLogin = usrId.toUpperCase();
        //     let lect = lectId.toUpperCase();

        //     if ((usrLogin == lect && data.coordinator == 'Yes')) {
        //         $('#btnNew').show();
        //     }
        //     else { $('#btnNew').hide(); }
        // }

        $("#print_mark").click(function () {
            window.open('print_marklectstd.html');
        });


        $("#printAnalysisReport").click(function () {
            window.open('print_result_analysis_report.html');
        });
        $("#shCLOxPLO").click(function () {
            window.open('print_CLOxPLO_Analysis.html');
        });
    });


    // get grade scheme item
    findId(crsId, function () {
        $.each(obj_grdSchm.data, function (j, itemJ) {
            let gscId = itemJ.gsc_id;
            $('#grdSchmId').val(gscId);

            // list item for course
            gradeCmpnnt(gscId, function () {
                $('#non_obe_type').append('<option value="">- Choose -</option>');
                $.each(obj_grdSchmDet.data, function (i, item) {
                    let gsdId = item.gsd_id;
                    let gsdType = '';
                    if (item.gsd_component == 'Final Assessment') { gsdType = 'Final' }
                    else if (item.gsd_component == 'Continuous Assessment') { gsdType = 'Continuous' }

                    // if( item.gsd_component == 'Summative Assessment' ){ gsdType = 'Summative' }
                    // else if( item.gsd_component == 'Formative Assessment' ){ gsdType = 'Formative' }

                    // select Marks Type
                    $('#non_obe_type').append('<option value="' + item.examTypeId + '" fk_gredSkemDet="' + gsdId + '">' + item.examTypeName + '</option>');

                    // create box for each item
                    let divBoxItemMain = '<li class="nav-item">' +
                        '<a href="#" class="nav-link auto">' +
                        '<span class="pull-right text-muted m-r-xs">' +
                        '<i class="fa fa-plus inline"></i>' +
                        '<i class="fa fa-minus none"></i>' +
                        '</span>' +
                        '<span class="text-uppercase font-weight-bold">' + gsdType + ' - ' + item.examTypeName + ' (' + item.gsd_percentage + '%)</span>' +
                        '</a>' +
                        '<ul class="nav nav-sub text-sm">' +
                        '<textarea class="hidden" id="dataListMain' + gsdId + '"></textarea>' +
                        '<table class="table table-striped m-b-none" id="tblItemMain' + gsdId + '"></table>' +
                        '</ul>' +
                        '</li>';

                    let divBoxItem = '<li class="nav-item">' +
                        '<a href="#" class="nav-link auto">' +
                        '<span class="pull-right text-muted m-r-xs">' +
                        '<input type="hidden" id="" class="examTypeName_'+gsdId+'" value="' + item.examTypeName + '">' +

                        '<i class="fa fa-plus inline"></i>' +
                        '<i class="fa fa-minus none"></i>' +
                        '</span>' +
                        '<span class="text-uppercase font-weight-bold">' + gsdType + ' - ' + item.examTypeName + ' (' + item.gsd_percentage + '%)</span>' +
                        '</a>' +
                        '<ul class="nav nav-sub text-sm" id="content_' + gsdId + '" >' +
                        '<textarea class="hidden" id="dataList' + gsdId + '"></textarea>' +
                        '<table class="table table-striped m-b-none" id="tblItem' + gsdId + '"></table>' +
                        '</ul>' +
                        '</li>';
                    $('#divBox').append(divBoxItemMain);
                    $('#divBoxMain').append(divBoxItem);

                    // create table
                    markList(fk_cotDet, gsdId, function () {
                        let data = obj_mark.data;
                        let data2 = obj_mark.data2;
                        let coor = $('#coordinator').val();
                        createTbl(data, data2, data2, gsdId, coor, usrId, lectId, item.gsd_percentage, item.gsd_percentage);
                    });
                });

                $('.slct2').select2({
                    width: null,
                    containerCssClass: ':all:',
                });
            });
        });


    });

    $('#loading_mode').modal('show'); //modal loading utk findId2()
    findId2(crsId, fk_cotDet, fk_aca_cal, crsId, function () {

        // $("#loading_mode").modal('show');
        var columns = [
            { "name": "bil", "title": "No.", "breakpoints": "md sm xs" },
            { "name": "btnAction", "title": "Mark" },
            { "name": "student_id", "title": "Student Id" },
            { "name": "std_name", "title": "Name" },
        ];

        let formative = 0;
        let summative = 0;
        let listSubItem = [];
        let list_gradeCmpnnt = [];

        count_formative = 0;
        count_summative = 0;

        list_markStd = [];
        $.each(obj_grdSchm.data, function (j, itemJ) {
            var data = itemJ;

            let gscId = itemJ.gsc_id;
            $('#grdSchmId').val(gscId);
            $.each(data.objgradeCmpnntAll, function (i, item) {
                columns.push({ "name": "mark" + item.pkCLO, "title": item.item_name + '<br> (' + item.clo_level + ' - ' + item.marks + ')', "breakpoints": "md sm xs" });
            });


            $.each(data.objgradeCmpnntCLO, function (i, item) {
                columns.push({ "name": "markCLO" + item.fk_clo, "title": item.clo_level + ' (' + item.full_marks + ')', "breakpoints": "md sm xs" });
            });

            $.each(data.objgradeCmpnntPLO, function (i, item) {
                columns.push({ "name": "markPLO" + item.obe_plo_id, "title": item.obe_plo_name + ' (' + item.sum_full_mark + ')', "breakpoints": "md sm xs" });
            });

            $('#fk_lectCrsDet').append('<option value="">- Choose -</option>');
            $.each(data.objgradeCmpnntAll, function (i, item) {
                let gsdType = '';
                // if (item.gsd_component == 'Summative Assessment') {
                //     gsdType = 'Summative';
                // }
                // else if (item.gsd_component == 'Formative Assessment') {
                //     gsdType = 'Formative';
                //     count_formative++;
                // }

                // listSubItem.push({ "id": item.pk_id, "fk_gsDet": item.fk_gsDet, "percentage": item.non_obe_percentage, "gsd_percentage": item.gsd_percentage, "item_name": item.item_name, "fk_gsDet": item.fk_gsDet });
                $('#fk_lectCrsDet').append('<option cloLevelFK="' + item.pkCLO + '" mark="' + item.marks + '" value="' + item.pk_id + '">' + item.item_name + ' - (' + item.clo_level + ')</option>');
                // $('#fk_lectCrsDet').append('<option mark="' + item.non_obe_percentage + '" value="' + item.pk_id + '">' + item_name + ' - (' + item.clo_level + ')</option>');
            });

            $('.slct2').select2({
                width: null,
                containerCssClass: ':all:',
            });

            let bil = 1;
            let convertList = JSON.stringify(data.objstdByAcaCalCrs);
            $("#dataList").val(convertList);
            var list = [];
            let viewData = [];

            groupedData = [];
// console.log(data.objstdByAcaCalCrs);
            $.each(data.objstdByAcaCalCrs, function (k, itemK) {


                if (!groupedData[itemK.pgmCode]) {
                    groupedData[itemK.pgmCode] = [];
                }
                groupedData[itemK.pgmCode].push(itemK);



                //     let status = itemK.rsb_status;
                //     let chk = '';
                //     if(status != 'Barred'){ chk = 'checked' }

                //     let display = '';
                //     if(usrCatEadmin == 1){
                //         display = '';
                //     }
                //     else if(usrCatEcmis == 1){
                //         if((usrId == lectId && lect_coor == 'Yes')){ display = '' }
                //         else{ display = 'disabled' }
                //     }

                //     if(itemK.mark_generate != null){
                //         $("#print_mark").prop('disabled',false);
                //     }
                //     let tMark = (itemK.tMark)*1;
                //     viewData = {
                //         bil: bil++, 
                //         student_id: '<span class="text-uppercase">'+itemK.std_id+'</span>', 
                //         std_name: '<span class="text-uppercase">'+itemK.sti_name+'</span>', 
                //     };

                //     let names = ""; 

                //     $.each(itemK.objstudentPloClo, function(i, item){
                //         if(names != item.pkCLO){
                //             names = item.pkCLO;
                //             objMark = item.mark;
                //             val = objMark;
                //             viewData["mark"+item.pkCLO] = `<p class="text-info text-center"><b id="`+itemK.std_id+'_'+item.pkCLO+`">`+val +`</b></p>`;
                //         }

                //         if(list.length == 0){
                //             list.push(viewData);
                //         } else {
                //             $.each(list,function(i,item){
                //                 if(item.std_name == viewData.std_name){
                //                     list.splice(i,1);
                //                     return false;
                //                 }
                //             });

                //             list.push(viewData);
                //         }
                //     });

                //     $.each(itemK.StudentClo, function(l, itemL){

                //         $.each(data.objgradeCmpnntCLO, function(iHCLO, itemHCLO){
                //             if(names != itemHCLO.fk_clo){
                //                 names = itemHCLO.fk_clo;
                //                 objMark = itemL[itemHCLO.fk_clo].mark;
                //                 val = objMark;
                //                 viewData["markCLO"+itemHCLO.fk_clo] = `<p class="text-info text-center"><b id="`+itemK.std_id+'_'+itemHCLO.fk_clo+`">`+val +`</b></p>`;
                //             }

                //             if(list.length == 0){
                //                 list.push(viewData);
                //             } else {
                //                 $.each(list,function(i,item){
                //                     if(item.std_name == viewData.std_name){
                //                         list.splice(i,1);
                //                         return false;
                //                     }
                //                 });

                //                 list.push(viewData);
                //             }
                //         });
                //     });


                //     $.each(itemK.StudentPlo, function(l, itemL){
                //         $.each(data.objgradeCmpnntPLO, function(iHPLO, itemHPLO){
                //             if(names != itemHPLO.obe_plo_id){
                //                 names = itemHPLO.obe_plo_id;
                //                 if(itemHPLO.obe_plo_id == itemL.obe_plo_id){
                //                     objMark = itemL.mark;
                //                     val = objMark;
                //                     viewData["markPLO"+itemHPLO.obe_plo_id] = `<p class="text-info text-center"><b id="`+itemK.std_id+'_'+itemHPLO.obe_plo_id+`">`+val +`</b></p>`;
                //                 }
                //             }

                //             if(list.length == 0){
                //                 list.push(viewData);
                //             } else {
                //                 $.each(list,function(i,item){
                //                     if(item.std_name == viewData.std_name){
                //                         list.splice(i,1);
                //                         return false;
                //                     }
                //                 });
                //                 list.push(viewData);
                //             }
                //         });
                //     });


                //     $("#tblStudent").footable({
                //                 "columns": columns,
                //                 "rows": list,
                //                 "paging": {
                //                     "enabled": false,
                //                     "size": 50,
                //                     "countFormat": "Showing {PF} to {PL} of {TR} data"
                //                 },
                //                 "filtering": {
                //                     "enabled": true,
                //                     "placeholder": "Search...",
                //                     "dropdownTitle": "Search for:"
                //                 }
                //             });
            });



            // Generate HTML for each tab
            let tabsHTML = '';
            let tabContentHTML = '';
            let tabBtnHTML = '';
            let index = 1;
            for (let pgmCode in groupedData) {
                tabsHTML += `
        <li class="nav-item">
            <a class="nav-link" href="#" data-toggle="tab" onclick="load_pgmCode('`+ pgmCode + `')" data-target="#tab_${pgmCode}">${pgmCode}</a>
        </li>
    `;
                tabContentHTML += `
        <div class="tab-pane animated fadeIn text-muted" id="tab_${pgmCode}">
        <table class="table table-striped table-bordered scroll" id="tblStudent_${pgmCode}"></table>
        </div>
    `;

                tabBtnHTML += `
    <button style="display: none;" class="btn blue-900 printAnalysisReport" id="btnAnalysis_${pgmCode}" data-pgmCode="${pgmCode}">Result Analysis Report</button>
    <button style="display: none;" class="btn blue-900 shCLOxPLO" id="btnshCLOxPLO_${pgmCode}" data-pgmCode="${pgmCode}">OBE Analysis</button>
`;


                index++;
            }
            // Insert the generated HTML into the DOM
            $('.nav-tabs').append(tabsHTML);
            $('.tab-content').append(tabContentHTML);
            $('.btnOBEAnalysis').append(tabBtnHTML);

            // Function to handle tab click
            $('.nav-tabs a[data-toggle="tab"]').on('click', function (e) {
                let pgmCode = $(this).html();
                $('.printAnalysisReport, .shCLOxPLO').hide(); // Hide all buttons initially
                $(`#btnAnalysis_` + pgmCode + ``).show(); // Show buttons for the selected pgmCode
                $(`#btnshCLOxPLO_` + pgmCode + ``).show(); // Show buttons for the selected pgmCode
            });

            // Event listener for Result Analysis Report button
            $('.btnOBEAnalysis').on('click', '.printAnalysisReport', function () {
                let pgmCode = $(this).data('pgmcode');
                window.open(`print_result_analysis_report.html?pgmCode=${pgmCode}`);
            });

            // Event listener for CLO vs PLO Analysis button
            $('.btnOBEAnalysis').on('click', '.shCLOxPLO', function () {
                let pgmCode = $(this).data('pgmcode');
                window.open(`print_CLOxPLO_Analysis.html?pgmCode=${pgmCode}`);
            });

            for (let pgmCode in groupedData) {
                let list = [];
                let bil = 1;
                action_btn = '';

                groupedData[pgmCode].forEach(itemK => {
                    let status = itemK.rsb_status;
                    let chk = '';
                    if (status != 'Barred') { chk = 'checked' }

                    let display = '';
                    // if (usrCatEadmin == 1) {
                    //     display = '';
                    // } else if (usrCatEcmis == 1) {
                    //     if ((usrId == lectId && lect_coor == 'Yes')) { display = '' }
                    //     else { display = 'disabled' }
                    // }

                    if (itemK.mark_generate != null) {
                        $("#print_mark").prop('disabled', false);
                    }
                    let tMark = (itemK.tMark) * 1;

                    let viewData = {
                        bil: bil++,
                        btnAction: '<button class="btn btn-icon btn-outline-success" ' + action_btn + ' title="Marks" onclick="detailMark(\'' + itemK.std_id + '\')" id="btnStdList" ><i class="fa fa-pencil-square-o"></i></button>',
                        student_id: '<span class="text-uppercase">' + itemK.std_id + '</span>',
                        std_name: '<span class="text-uppercase">' + itemK.sti_name + '</span>',
                        // Add other properties as needed
                    };

                    let names = "";

                    // Processing objstudentPloClo
                    $.each(itemK.objstudentPloClo, function (i, item) {
                        if (names != item.pkCLO) {

                            names = item.pkCLO;
                            objMark = item.mark;
                            val = objMark;
                            viewData["mark" + item.pkCLO] = `<p class="text-info text-center"><b id="${itemK.std_id}_${item.pkCLO}">${val}</b></p>`;
                        }
                    });

                    // Processing StudentClo
                    $.each(itemK.StudentClo, function (l, itemL) {

                        $.each(data.objgradeCmpnntCLO, function (iHCLO, itemHCLO) {

                        var markCLOTotal = 0; // Default value is 0
                        // Check if itemL[itemHCLO.fk_clo] exists and if it has the mark property
                        if (itemL[itemHCLO.fk_clo] && 'mark' in itemL[itemHCLO.fk_clo]) {
                            markCLOTotal = itemL[itemHCLO.fk_clo].mark;

                        }

                        if (names != itemHCLO.fk_clo) {
                                names = itemHCLO.fk_clo;
                                objMark = markCLOTotal;
                                // objMark = itemL[itemHCLO.fk_clo].mark;
                                val = objMark;
                                viewData["markCLO" + itemHCLO.fk_clo] = `<p class="text-info text-center"><b id="${itemK.std_id}_${itemHCLO.fk_clo}">${val}</b></p>`;
                            }
                        });
                    });

                    // Processing StudentPlo
                    $.each(itemK.StudentPlo, function (l, itemL) {
                        $.each(data.objgradeCmpnntPLO, function (iHPLO, itemHPLO) {
                            if (names != itemHPLO.obe_plo_id) {
                                names = itemHPLO.obe_plo_id;
                                if (itemHPLO.obe_plo_id == itemL.obe_plo_id) {
                                    objMark = itemL.mark;
                                    val = objMark;
                                    viewData["markPLO" + itemHPLO.obe_plo_id] = `<p class="text-info text-center"><b id="${itemK.std_id}_${itemHPLO.obe_plo_id}">${val}</b></p>`;
                                }
                            }
                        });
                    });

                    list.push(viewData);
                });

                // Initialize Footable for the table in this tab
                $(`#tblStudent_${pgmCode}`).footable({
                    "columns": columns,
                    "rows": list,
                    "paging": {
                        "enabled": false,
                        "size": 50,
                        "countFormat": "Showing {PF} to {PL} of {TR} data"
                    },
                    "filtering": {
                        "enabled": true,
                        "placeholder": "Search...",
                        "dropdownTitle": "Search for:"
                    }
                });
                $('#loading_mode').modal('hide');

            }


        }); // each mark

    });



    findCloCourse(crsId, function () {
        $('#clo_lecCourse').append('<option value="">- Choose -</option>');
        $('#item_clo').append('<option value="">- Choose -</option>');
        $('#upt_clo_lecCourse_sub').append('<option value="">- Choose -</option>');
        $('#upt_clo_lecCourse').append('<option value="">- Choose -</option>');
        $.each(obj_cloCourse.data, function (j, itemJ) {

            // select CLO Type
            $('#clo_lecCourse').append('<option value="' + itemJ.id_clo + '">' + itemJ.clo_level + '</option>');
            $('#item_clo').append('<option value="' + itemJ.id_clo + '">' + itemJ.clo_level + '</option>');
            $('#upt_clo_lecCourse').append('<option value="' + itemJ.id_clo + '">' + itemJ.clo_level + '</option>');
            $('#upt_clo_lecCourse_sub').append('<option value="' + itemJ.id_clo + '">' + itemJ.clo_level + '</option>');

            $('.slct2').select2({
                width: null,
                containerCssClass: ':all:',
            });
        });


    });

});
var confirmed = false;


$('#btnBack').click(function () {
    let prevPage = window.sessionStorage.prevPage;
    let page = '';
    if (prevPage == 'viewLect') { page = 'adminPage.html' }
    else { page = 'lecturer_details.html' }

    window.location.replace(page);
    window.sessionStorage.removeItem('lectCrsId');
    window.sessionStorage.removeItem('pk_crs');
    window.sessionStorage.removeItem('prevPage');
    window.sessionStorage.removeItem('category');
});


$('#non_obe_type').change(function () {
    let id = $("#non_obe_type option:selected").attr("fk_gredskemdet");
    $('#gsDet_id').val(id);

    getMarkAlloc(id, function () {

    });


});


//-------------------------------------------------- add mark --------------------------------------------------//


$('#formAddMarks').on('submit', function (e) {
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Add Mark",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let fk_lect_crs = $('#lectCrsId').val();
            let fk_gsDet = $('#gsDet_id').val();
            let fk_cotDet = $('#fk_cotDet').val();
            let non_obe_type = $('#non_obe_type').val();
            let item_name = $('#item_name').val();
            let non_obe_percentage = $('#non_obe_percentage').val();
            let ass_sltCi = $('#ass_sltCi').val();

            var form = new FormData();
            form.append("fk_lect_crs", fk_lect_crs);
            form.append("fk_gsDet", fk_gsDet);
            form.append("fk_cotDet", fk_cotDet);
            form.append("non_obe_type", non_obe_type);
            form.append("item_name", item_name);
            form.append("non_obe_percentage", non_obe_percentage);
            form.append("recordstatus", "ADD");

            form.append("ass_sltCi", ass_sltCi);
            form.append("ass_sltCi", ass_sltCi);
            var settings = {
                "url": host + "api_lecturer_picoms/public/misLectCrsDet/register",
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
//-------------------------------------------------- end add mark --------------------------------------------------//

//-------------------------------------------------- add mark --------------------------------------------------//


$('#formAddMarksClo').on('submit', function (e) {
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Add Mark",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let item_clo = $('#item_clo').val();
            let fk_LecCourseDet = $('#fk_LecCourseDet').val();
            let item_marks = $('#item_marks').val();

            let pkId = $('#fk_LecCourseDet').val();
            let itemName2 = $('#itemName2').val();
            let markAllocate2 = $('#markAllocate2').val();
            let AssSLTCI2 = $('#AssSLTCI2').val();
            let gsd_percentageMarks = $('#gsd_percentageMarks2').val();

            TWeight = (item_marks / markAllocate2) * gsd_percentageMarks;

            SLTMarks = (TWeight / gsd_percentageMarks) * AssSLTCI2;
            formattedSLTMarks = SLTMarks.toFixed(2);



            var form = new FormData();
            form.append("fk_clo", item_clo);
            form.append("fk_LecCourseDet", fk_LecCourseDet);
            form.append("marks", item_marks);
            form.append("weightage", TWeight);
            form.append("SLT", formattedSLTMarks);

            var settings = {
                "url": host + "api_lecturer_picoms/public/subMisLecCourse/register",
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
                    swal("Add Success", "Add Item Details", "success");


                    setTimeout(() => {

                        let pkId = $("#fk_LecCourseDet").val();
                        let itemName = $("#itemName2").val();
                        let markAllocate = $("#markAllocate2").val();
                        let AssSLTCI = $("#AssSLTCI2").val();
                        let gsd_percentageMarks = $("#gsd_percentageMarks2").val();
                        detail(pkId, itemName, markAllocate, AssSLTCI, gsd_percentageMarks);
                    }, 2000);

                    // This code will run after the page has finished reloading

                }
                else { swal("Failed", response.message, "error"); }
            });
        });
    }
});
//-------------------------------------------------- end add mark --------------------------------------------------//



//-------------------------------------------------- update mark --------------------------------------------------//
$('#formUptMark').on('submit', function (e) {
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Update Mark",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let data = {};
            data.pk_id = $('#pk_id').val();
            data.item_name = $('#upt_item_name').val();
            data.non_obe_percentage = $('#upt_non_obe_percentage').val();
            data.ass_sltCi = $('#upt_ass_sltCi').val();
            data.ass_sltCi = $('#upt_ass_sltCi').val();

            var form = new FormData();
            form.append("pk_id", data.pk_id);
            form.append("item_name", data.item_name);
            form.append("non_obe_percentage", data.non_obe_percentage);
            form.append("recordstatus", "EDT");
            form.append("ass_sltCi", data.ass_sltCi);
            form.append("ass_sltCi", data.ass_sltCi);

            var settings = {
                "url": host + "api_lecturer_picoms/public/misLectCrsDet/update",
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
//-------------------------------------------------- end update mark --------------------------------------------------//


//-------------------------------------------------- update mark Item--------------------------------------------------//
$('#formUptMarkItem').on('submit', function (e) {
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Update Mark",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let data = {};
            data.pk_id = $('#pk_id_sub').val();
            data.fk_clo = $('#upt_clo_lecCourse_sub').val();
            data.marks = $('#upt_non_obe_percentage_sub').val();
            data.weightage = $('#upt_weightage_sub').val();
            data.SLT = $('#upt_slt_sub').val();
            gsd_percentageMarks = $('#gsd_percentageMarks').val();
            AssSLTCI = $('#AssSLTCI').val();
            markAllocate3 = $('#markAllocate3').val();

            TWeight = (data.marks / markAllocate3) * gsd_percentageMarks;

            SLTMarks = (TWeight / gsd_percentageMarks) * AssSLTCI;
            formattedSLTMarks = SLTMarks.toFixed(2);

            var form = new FormData();
            form.append("pk_id", data.pk_id);
            form.append("fk_clo", data.fk_clo);
            form.append("marks", data.marks);
            form.append("weightage", TWeight);
            form.append("SLT", formattedSLTMarks);
            form.append("recordstatus", "EDT");


            var settings = {
                "url": host + "api_lecturer_picoms/public/subMisLecCourse/update",
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
//-------------------------------------------------- end update mark Item--------------------------------------------------//


function loadData(indexs, gsdId) {
    let data = JSON.parse($("#dataList" + gsdId).val());


    $('#pk_id').val(data[indexs].pk_id);
    $('#upt_item_name').val(data[indexs].item_name);
    $('#upt_non_obe_type').val(data[indexs].non_obe_type);
    $('#view_non_obe_type').val(data[indexs].examTypeName);
    $('#upt_non_obe_percentage').val(data[indexs].non_obe_percentage);

    $('#upt_ass_sltCi').val(data[indexs].ass_sltCi);
    $('#upt_clo_lecCourse').val(data[indexs].clo_lecCourse).trigger("change");
    $('#upt_weightage').val(data[indexs].weightage);
    $('#upt_slt').val(data[indexs].slt);

    $('#upt_ass_sltCi').val(data[indexs].ass_sltCi);
    $('#upt_clo_lecCourse').val(data[indexs].clo_lecCourse).trigger("change");
    $('#upt_weightage').val(data[indexs].weightage);
    $('#upt_slt').val(data[indexs].slt);

    $('#mdlUptMarks').modal('show');

}


function loadDataMarks(indexs, pkId, gsd_percentageMarks, AssSLTCI, markAllocate) {
    let data = JSON.parse($("#dataList2_" + pkId).val());


    //Pk id CLo
    $('#pk_id_sub').val(data[indexs].pk_id);
    $('#upt_clo_lecCourse_sub').val(data[indexs].fk_clo).trigger("change");
    $('#upt_non_obe_percentage_sub').val(data[indexs].marks);
    $('#upt_weightage_sub').val(data[indexs].weightage);
    $('#upt_slt_sub').val(data[indexs].SLT);
    $('#gsd_percentageMarks').val(gsd_percentageMarks);
    $('#markAllocate3').val(markAllocate);
    $('#AssSLTCI').val(AssSLTCI);

    $('#MarkClo').modal('hide');
    $('#mdlUptMarksItem').modal('show');

}


//-------------------------------------------------- delete marks --------------------------------------------------//
function del_rekod(id) {
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("pk_id", id);

    swal({
        title: "Remove Marks",
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
            "url": host + "api_lecturer_picoms/public/misLectCrsDet/delete",
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
//-------------------------------------------------- end delete marks --------------------------------------------------//









//-------------------------------------------------- delete marks --------------------------------------------------//
function del_rekodItem(id, pkId, itemName, markAllocate, AssSLTCI, gsd_percentageMarks) {
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("pk_id", id);

    swal({
        title: "Remove Marks",
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
            "url": host + "api_lecturer_picoms/public/subMisLecCourse/delete",
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
            if (result.success) {

                // window.location.reload();
                $("#MarkClo").modal("hide");
                swal("Delete Success", "Delete Item Details", "success");


                setTimeout(() => {

                    detail(pkId, itemName, markAllocate, AssSLTCI, gsd_percentageMarks);
                }, 2000);
                // return;

            }
            else {
                Swal(result.message, result.data, "error");


            }
            // window.location.reload();
        });
    });
}
//-------------------------------------------------- end delete marks --------------------------------------------------//

//-------------------------------------------------- create table for each item --------------------------------------------------//
function createTbl(objData, objData2, objData2, gsdId, coor, usrId, lectId, gsd_percentageMarks, gsd_percentageMarks) {

    let columns = [
        { "name": "bil", "title": "No." },
        { "name": "item_name", "title": "Item" }, //assasement Name
        { "name": "non_obe_percentage", "title": "Marks Allocation (%)", "breakpoints": "md sm xs" },
        { "name": "Assasement", "title": "Assessment SLT CI", "breakpoints": "md sm xs" },
        { "name": "CLO", "title": "CLO", "breakpoints": "md sm xs" },
        { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" }
    ];

    let bil = 1;
    let convertList = JSON.stringify(objData);
    $("#dataList" + gsdId).val(convertList);
    let list_data = [];

    $.each(objData, function (i, field) {
        let display = '';

        if (usrCatEadmin == 1) {
            display = ''
        }
        else if (usrCatEcmis == 1) {

            if ((usrId == lectId && coor == 'Yes')) { display = '' }
            else { display = 'hidden' }
        }

        let clo_list = '<table class="table table-bordered">'
        if (field.clo_list.length > 0) {
            $.each(field.clo_list, function (t, item) {
                clo_list += '<tr><td>' + item.clo_level + '</td></tr>';
                if (field.clo_list.length == (t + 1)) {
                    clo_list += '</table>';
                }
            })
        }

        // let clo_list = '<table class="table table-bordered">';
        // if (field.clo_list.length > 0) {
        //     $.each(field.clo_list, function (t, item) {
        //         clo_list += '<tr><td>' + item.clo_level + '</td></tr>';
        //         if (field.clo_list.length === (t + 1)) {
        //             clo_list += '</table>';
        //         }
        //     });
        // } else {
        //     clo_list = ''; // Set the HTML content of the table to an empty string
        // }



        datadld = '<textarea  class="hidden" id="dataList2_' + field.pk_id + '"></textarea>';
        table = '<table class="table table-striped m-b-none" id="tblCMark' + field.pk_id + '"></table>';
        $("#content_" + gsdId).append(table);
        $("#content_" + gsdId).append(datadld);
        list_data.push({
            "bil": bil++,
            "item_name": '<span class="text-uppercase">' + field.item_name + '</span>',
            "non_obe_percentage": field.non_obe_percentage,
            "Assasement": '<span class="text-uppercase">' + field.ass_sltCi + '</span>',
            "CLO": clo_list,
            "upt_btn":
                '<button class="btn btn-icon warning" title="Update" onclick="loadData(\'' + i + '\', \'' + gsdId + '\')" ' + display + '><i class="ion-edit" style="color: #ffffff;"></i></button> ' +
                '<button class="btn btn-icon teal-500" title="Details" onclick="detail(\'' + field.pk_id + '\',\'' + field.item_name + '\',\'' + field.non_obe_percentage + '\',\'' + field.ass_sltCi + '\',\'' + gsd_percentageMarks + '\')" ' + field.pk_id + '><i class="ion-ios-list-outline"></i></button> ' +
                '<button class="btn btn-icon danger" title="Delete" onclick="del_rekod(\'' + field.pk_id + '\')" ' + display + '><i class="ion-ios-trash-outline" ></i></button>',

        });












        // gila

        listMark(field.pk_id, function () {
            TMark = obj_marks.data2;

            var columns = [
                { name: "bil", title: "No." },
                { name: "fk_clo", title: "CLO" },
                { name: "marks", title: "Marks" },
                // { name: "weightage", title: "Weightage" },
                // { name: "SLT", title: "SLT" , "breakpoints": "md sm xs" },
                { name: "upt_btn", "title": "Action", "breakpoints": "md sm xs" },

            ];

            let bil = 1;
            var list = [];
            let convertList = JSON.stringify(obj_marks.data);
            $("#dataList2_" + field.pk_id).val(convertList);
            $("#code_indexs").val(convertList);


            var totalSLT = 0;
            var totalMarks = 0;
            var totalWeightage = 0;
            $.each(obj_marks.data, function (j, itemJ) {
                SLTMarks = (parseFloat(itemJ.weightage) / gsd_percentageMarks) * field.ass_sltCi;
                formattedSLTMarks = SLTMarks.toFixed(2);
                // var totalSLTValue = parseFloat(itemJ.SLT);
                // totalSLT += totalSLTValue;

                var totalMarksValue = parseFloat(itemJ.marks);
                totalMarks += totalMarksValue;

                // var totalWeightageVal = parseFloat(itemJ.weightage);
                // totalWeightage += totalWeightageVal;


                weightageMark = (itemJ.marks / TMark) * field.non_obe_percentage;
                totalWeightage += weightageMark;


                SLTMark = (itemJ.marks / TMark) * field.ass_sltCi;
                totalSLT += SLTMark;

                list.push({
                    bil: bil++,
                    fk_clo: itemJ.clo_level,
                    marks: itemJ.marks,
                    // mark/mark * mark allocate
                    // weightage: weightageMark,
                    // weightage: itemJ.weightage,
                    // SLT: SLTMark,
                    // SLT: formattedSLTMarks,
                    // SLT: itemJ.SLT,
                    // upt_btn:                        '<button data-nameTypeExam="examTypeName_'+gsdId+'" class="btn btn-icon white" title="Upload" onclick="uploadMark(\'' + j + '\', \'' + field.pk_id + '\', \'' + itemJ.pk_id + '\', \'' + itemJ.clo_level + '\')"><i class="fa fa-upload" style="color: #2196f3"></i></button> '
                    upt_btn: `
                    <button 
                        class="btn btn-icon white" 
                        title="Upload" onclick="uploadMark('${j}', '${field.pk_id}', '${itemJ.pk_id}', '${itemJ.clo_level}', '${itemJ.item_name}')"
                    >
                        <i class="fa fa-upload" style="color: #2196f3"></i>
                    </button>`
                        // '<button class="btn btn-icon warning" title="Update" onclick="loadDataMarks(\'' + j + '\', \'' + field.pk_id + '\', \'' + gsd_percentageMarks + '\', \'' + field.ass_sltCi + '\', \'' + field.non_obe_percentage + '\')" ><i class="ion-edit" style="color: #ffffff;"></i></button> ' +
                    // '<button class="btn btn-icon danger" title="Delete" onclick="del_rekodItem(\''+itemJ.pk_id+'\', \'' + field.pk_id + '\', \'' + field.item_name + '\', \'' + field.non_obe_percentage + '\', \'' + field.ass_sltCi + '\', \'' + gsd_percentageMarks + '\')" ><i class="ion-ios-trash-outline" ></i></button>'

                });

                // Add the total row
                if (obj_marks.data.length == (j + 1)) {
                    list.push({
                        bil: `<strong>Total</strong>`,
                        fk_clo: `<strong>:</strong>`,
                        marks: `<strong>${totalMarks}</strong>`,
                        weightage: `<strong>${totalWeightage}</strong>`,
                        SLT: `<strong>${totalSLT}</strong>`,
                        upt_btn: "",
                    });
                }

            });

            $("#tblCMark" + field.pk_id).html('');
            $("#tblCMark" + field.pk_id).footable({
                columns: columns,
                rows: list,
                paging: {
                    enabled: true,
                    size: 10,
                    countFormat: "Showing {PF} to {PL} of {TR} data",
                },
                // filtering: {
                //     enabled: true,
                //     placeholder: "Search...",
                //     dropdownTitle: "Search for:",
                // },
            });
        });
        //gila















    });


    $('#tblItemMain' + gsdId).html('');
    $('#tblItemMain' + gsdId).footable({
        "columns": columns,
        "rows": list_data,
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

    // $('#tblItem'+gsdId).html('');
    // $('#tblItem'+gsdId).footable({
    //     "columns": columns,
    //     "rows": list_data,
    //     "paging": {
    //         "enabled": true,
    //         "size": 10,
    //         "countFormat": "Showing {PF} to {PL} of {TR} data"
    //     },
    //     "filtering": {
    //         "enabled": true,
    //         "placeholder": "Search...",
    //         "dropdownTitle": "Search for:"
    //     }
    // });
}

//     // //-------------------------------------------------- end upload excel --------------------------------------------------//



function detail(pkId, itemName, markAllocate, AssSLTCI, gsd_percentageMarks) {

    $("#markCloNew").modal("hide");

    $("#item").html(itemName);
    $("#MarkAlloc").html(markAllocate);
    $("#AssSLTCI_det").html(AssSLTCI);

    var itemMarks2 = '<textarea  class="hidden" id="dataList2_' + pkId + '"></textarea>';
    $("#itemMarks2").html(itemMarks2);

    var buttonHTML =
        '<button class="btn green-200 m-a btn_summary m-t" onclick="addNewCloPlo( \'' + pkId + '\',\'' + itemName + '\',\'' + markAllocate + '\',\'' + AssSLTCI + '\' ,\'' + gsd_percentageMarks + '\')" >' +
        '<i class="fa fa-plus"></i> New Record' +
        '</button>';

    $("#addNewClo").html(buttonHTML);

    var list = [];


    listMark(pkId, function () {
        TMark = obj_marks.data2;

        var columns = [
            { name: "bil", title: "No." },
            { name: "fk_clo", title: "CLO" },
            { name: "marks", title: "Marks" },
            { name: "weightage", title: "Weightage" },
            { name: "SLT", title: "SLT", "breakpoints": "md sm xs" },
            { name: "upt_btn", "title": "Action", "breakpoints": "md sm xs" },

        ];

        let bil = 1;
        var list = [];
        let convertList = JSON.stringify(obj_marks.data);
        $("#dataList2_" + pkId).val(convertList);
        $("#code_indexs").val(convertList);


        var totalSLT = 0;
        var totalMarks = 0;
        var totalWeightage = 0;
        $.each(obj_marks.data, function (j, itemJ) {
            SLTMarks = (parseFloat(itemJ.weightage) / gsd_percentageMarks) * AssSLTCI;
            formattedSLTMarks = SLTMarks.toFixed(2);

            // var totalSLTValue = parseFloat(itemJ.SLT);
            // totalSLT += totalSLTValue;

            var totalMarksValue = parseFloat(itemJ.marks);
            totalMarks += totalMarksValue;

            // var totalWeightageVal = parseFloat(itemJ.weightage);
            // totalWeightage += totalWeightageVal;



            weightageMark = (itemJ.marks / TMark) * markAllocate;
            totalWeightage += weightageMark;


            SLTMark = (itemJ.marks / TMark) * AssSLTCI;
            totalSLT += SLTMark;

            list.push({
                bil: bil++,
                fk_clo: itemJ.clo_level,
                marks: itemJ.marks,
                // mark/mark * mark allocate
                weightage: weightageMark,
                // weightage: itemJ.weightage,
                SLT: SLTMark,
                // SLT: formattedSLTMarks,
                // SLT: itemJ.SLT,
                upt_btn:
                    // '<button class="btn btn-icon white" title="Upload" onclick="uploadMark(\'' + j + '\', \'' + pkId + '\', \'' + itemJ.pk_id + '\')"><i class="fa fa-upload" style="color: #2196f3"></i></button> ' +
                    '<button class="btn btn-icon warning" title="Update" onclick="loadDataMarks(\'' + j + '\', \'' + pkId + '\', \'' + gsd_percentageMarks + '\', \'' + AssSLTCI + '\', \'' + markAllocate + '\')" ><i class="ion-edit" style="color: #ffffff;"></i></button> ' +
                    '<button class="btn btn-icon danger" title="Delete" onclick="del_rekodItem(\'' + itemJ.pk_id + '\', \'' + pkId + '\', \'' + itemName + '\', \'' + markAllocate + '\', \'' + AssSLTCI + '\', \'' + gsd_percentageMarks + '\')" ><i class="ion-ios-trash-outline" ></i></button>'

            });

            // Add the total row
            if (obj_marks.data.length == (j + 1)) {
                list.push({
                    bil: `<strong>Total</strong>`,
                    fk_clo: `<strong>:</strong>`,
                    marks: `<strong>${totalMarks}</strong>`,
                    weightage: `<strong>${totalWeightage}</strong>`,
                    SLT: `<strong>${totalSLT}</strong>`,
                    upt_btn: "",
                });
            }

        });

        $("#tblCMark").html('');
        $("#tblCMark").footable({
            columns: columns,
            rows: list,
            paging: {
                enabled: true,
                size: 10,
                countFormat: "Showing {PF} to {PL} of {TR} data",
            },
            filtering: {
                enabled: true,
                placeholder: "Search...",
                dropdownTitle: "Search for:",
            },
        });
        $("#MarkClo").modal("show");
    });
}

function addNewCloPlo(pkId, itemName, markAllocate, AssSLTCI, gsd_percentageMarks) {
    $("#MarkClo").modal("hide");
    $("#markCloNew").modal("show");
    $('#fk_LecCourseDet').val(pkId);
    $('#itemName2').val(itemName);
    $('#markAllocate2').val(markAllocate);
    $('#AssSLTCI2').val(AssSLTCI);
    $('#gsd_percentageMarks2').val(gsd_percentageMarks);

    var buttonSave =
        '<button class="btn white p-x-md" title="Cancel" onclick="detail(\'' + pkId + '\',\'' + itemName + '\',\'' + markAllocate + '\',\'' + AssSLTCI + '\')" >Cancel</button> '
        + ' <button type="submit" class="btn info p-x-md">Save</button>';

    $('#saveaddNewCloPlo').html(buttonSave);

}

function listMark(pkId, returnValue) {
    var settings = {
        url: host + "api_lecturer_picoms/public/subMisLecCourse/show/" + pkId,
        method: "GET",
        timeout: 0,
        headers: {
            Authorization: "picoms " + window.sessionStorage.token,
        },

    };

    $.ajax(settings).done(function (response) {
        obj_marks = response;
        returnValue();
    });
}

function subItemList(id, cotDet, returnValue) {
    var form = new FormData();
    form.append("fk_lect_crs", id);
    form.append("fk_cotDet", cotDet);

    var settings = {
        "url": host + "api_lecturer_picoms/public/misLectCrsDet/listSubItem",
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
        obj_subItem = JSON.parse(response);
        returnValue();
    });
}

function uploadMark(index, pkId, fk_idClo, cloLevel, nameTypeExam) {

    nameTypeExamValue = nameTypeExam;
    // console.log();
    $('#loading_modal').modal('show');
    let d = JSON.parse($("#dataList2_" + pkId).val());

    let data = d[index];
    let pgmCode = $(".pgmCode").html();
  

    let filterConditions = {
        pgmCode: pgmCode
    };

    objStd = filterData(d, filterConditions);


    let lectCrsDet_id = data.fk_LecCourseDet;
    let fullMarks = data.marks;
    $('#fullMark').val(fullMarks);
    let yearTaken = $('#yearTaken').val();
    let fk_acaCal = window.sessionStorage.fk_aca_cal;
    let fk_crs = window.sessionStorage.pk_crs;
    $('#subItem').html(data.clo_statement);
    $('#lectCrsDet_id').val(lectCrsDet_id);
    $('#fk_idClo').val(fk_idClo);
    $('#cloLevel').val(cloLevel);

    // student list
    stdByAcaCalCrs(fk_acaCal, fk_crs, function () {
        var columns = [
            { "name": "bil", "title": "No." },
            { "name": "student_id", "title": "Student" },
            { "name": "mark", "title": "Mark" },
            { "name": "full_mark", "title": "Full Mark", "breakpoints": "md sm xs" }
        ];

        let bil = 1;
        var list = [];
        let result = '';  // Ensure result is defined in the outer scope


        $.each(obj_stdRegCrs.data, function (j, itemJ) {
            if (itemJ.pgmCode == pgmCode) {

                let stdId = itemJ.std_id;
                let return_total = function () {
                    let tmp = {};
                    $.ajax({
                        "url": host + "api_lecturer_picoms/public/misLectStdMark/findMark2/" + lectCrsDet_id + "/" + stdId + "/" + fk_idClo,
                        "method": "GET",
                        "timeout": 0,
                        "headers": {
                            "Authorization": "picoms " + window.sessionStorage.token
                        },
                        'async': false,
                        'global': false,
                        'data': { 'request': "", 'target': 'arrange_url', 'method': 'method_target' },
                        'success': function (data) {
                            tmp.count = data.data.length;
                            $.each(data.data, function (j, itemJ) {
                                // tmp.mark = itemJ.mark;

                                //nie utk tukar klau null or kosong then return kosong
                                getDetCLOStd = (itemJ.json_clo_crsDet === null) ? '': JSON.parse(itemJ.json_clo_crsDet);

                                // result =  (getDetCLOStd === '') ? '{"mark":""}' :getDetCLOStd.find(({ fk_CLO }) => fk_CLO === fk_idClo);
                                // // result = getDetCLOStd.find(({ fk_CLO }) => fk_CLO === fk_idClo);

                                // ini check klau dia sma fk clo and and x kosong data
                                result = (getDetCLOStd === '' || !getDetCLOStd.find(({ fk_CLO }) => fk_CLO === fk_idClo)) ? '{"mark":""}' : getDetCLOStd.find(({ fk_CLO }) => fk_CLO === fk_idClo);


                            });
                        },
                      
                    });
                    // return tmp;
                }();

                list.push({
                    bil: bil++,
                    student_id: stdId,
                    mark: (result && result.mark) ? result.mark : '',
                    full_mark: fullMarks
                });
            }
        });

        let convertList = JSON.stringify(list);
        $("#dataDnldList").val(convertList);

        $("#tblStdDnld").footable({
            "columns": columns,
            "rows": list,
            "paging": {
                "enabled": true,
                "size": 10,
                "countFormat": "Showing {PF} to {PL} of {TR} data"
            },
        });
    });

    $('#loading_modal').modal('hide');
    $('#MarkClo').modal('hide');
    $('#mdlUpload').modal('show');
}

$(".btnExcel").click(function () {
    let data = $('#dataDnldList').val();

let codeProg =  $('.pgmCode').html();
    data = JSON.parse(data);
    let jsnData = [];
    jsnData.push([{ "text": "No." }, { "text": "student_id" }, { "text": "mark" }, { "text": "full_mark" }]);
    $.each(data, function (i, item) {
        jsnData.push([{ "text": ++i }, { "text": item.student_id }, { "text": item.mark }, { "text": item.full_mark }]);
    });

    var tableData = [
        {
            "sheetName": "Sheet1",
            "data": jsnData
        }
    ];
    var options = {
        fileName: codeProg+"_OBE_Mark_"+nameTypeExamValue 
    };
    Jhxlsx.export(tableData, options);
});
//-------------------------------------------------- end download excel --------------------------------------------------//

$("#form_excel").on('submit', function (e) {
    if (!confirmed) {
        e.preventDefault();
        $('#mdlUpload').modal('hide');
        $('#loading_mode').modal('show');
        read_file('excel_file');
    }
});

function read_file(file_name, colors) {
    let selectedFile;
    selectedFile = $("#" + file_name)[0].files[0];

    let data = [{
        "name": "file_name",
        "data": "picoms",
    }];

    XLSX.utils.json_to_sheet(data, 'vms.xlsx');
    if (selectedFile) {
        let fileReader = new FileReader();
        fileReader.readAsBinaryString(selectedFile);
        fileReader.onload = (event) => {
            let data = event.target.result;
            let workbook = XLSX.read(data, { type: "binary" });
            workbook.SheetNames.forEach(sheet => {
                data_set = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);

                $("#list_data").val(JSON.stringify(data_set));
                addExcelStd(data_set);
            });
        }
    }
}

function addExcelStd(dataStd) {


    let fk_lectCrsDet = $('#lectCrsDet_id').val();

    let fk_course = window.sessionStorage.pk_crs;
    // let fk_course = $('#fk_course').val();
    let full_mark = $('#fullMark').val();
    let dataLength = dataStd.length;
    let fk_idClo = $('#fk_idClo').val();
    let cloLevel = $('#cloLevel').val();


    async function doSomethingAsync(item) {
        return new Promise(resolve => {
            setTimeout(() => {
                $("#load_text").html(item);
                resolve();
            }, Math.random() * 1000);
        });
    }

    async function main() {
        await Promise.all(
            dataStd.map(async (item, i) => {

                let stdId = item.student_id;
                let mark = item.mark;
                let arrayCLO = [];
                let newJsonData = { fk_CLO: fk_idClo, clo_level: cloLevel, mark: item.mark, full_mark: full_mark }
                arrayCLO.push(newJsonData);

                await doSomethingAsync(stdId + ' : Mark ' + mark);


                var formChecking = new FormData();
                formChecking.append("fk_lectCrsDet", fk_lectCrsDet);
                formChecking.append("fk_student", stdId);
                // formJson.append("json_clo_crsDet", JSON.parse(arrayCLO));
                let obj_stdMarkChecking = await new post(host + "api_lecturer_picoms/public/misLectStdMark/chkStdMark2", formChecking, 'picoms ' + window.sessionStorage.token).execute();
                let exist = obj_stdMarkChecking.data.length;
                var formJson = new FormData();
                // formJson.append("mark", mark);

                if (exist == 0) {
                    // add mark

                    formJson.append("json_clo_crsDet", JSON.stringify(arrayCLO));
                    formJson.append("fk_lectCrsDet", fk_lectCrsDet);
                    formJson.append("fk_student", stdId);
                    formJson.append("fk_course", fk_course);
                    // formJson.append("full_mark", full_mark);
                    // form.append("fk_idClo", fk_idClo);
                    formJson.append("recordstatus", 'ADD');

                    let result = new post(host + "api_lecturer_picoms/public/misLectStdMark/register2", formJson, "picoms " + window.sessionStorage.token).execute();
                    // let result = new post(host+"api_lecturer_picoms/public/misLectStdMark/register",form,"picoms " + window.sessionStorage.token).execute();

                    if (!result.success) {
                        Swal(result.message, result.data, "error");
                        return;
                    }

                }
                else {
                    // update mark
                    obj_stdMarkChecking.data.forEach(async (item) => {
                        let pk_id = item.pk_id;
                        currentJson = (item.json_clo_crsDet == null) ? [] : JSON.parse(item.json_clo_crsDet);
                        // console.log(newJsonData);
                        // console.log(currentJson);

                        // Flag to check if the item is updated
                        let found = false;
                        // Iterate over the array to find and update the item

                        if (currentJson.length < 0) {
                            currentJson.push(newJsonData);

                        } else {
                            for (let i = 0; i < currentJson.length; i++) {
                                // console.log(currentJson[i].fk_CLO);

                                if (currentJson[i].fk_CLO === newJsonData.fk_CLO) {
                                    currentJson[i].mark = newJsonData.mark;
                                    currentJson[i].full_mark = newJsonData.full_mark;
                                    found = true;
                                    break;
                                }
                            }

                            // If the item was not found, add it to the array
                            if (!found) {

                                currentJson.push(newJsonData);
                            }

                        }

                        formJson.append("pk_id", pk_id);
                        // formJson.append("mis_lecturer_stdmark", mis_lecturer_stdmark);
                        // formJson.append("fk_idClo", fk_idClo);
                        // formJson.append("json_clo_crsDet", 'afiez');
                        formJson.append("json_clo_crsDet", JSON.stringify(currentJson));

                        formJson.append("recordstatus", 'EDT');

                        let result = new post(host + "api_lecturer_picoms/public/misLectStdMark/update2", formJson, "picoms " + window.sessionStorage.token).execute();
                        // let result = new post(host+"api_lecturer_picoms/public/misLectStdMark/update",form,"picoms " + window.sessionStorage.token).execute();


                        // $.each(JSON.parse(item.json_clo_crsDet), function (i, field) { 
                        // console.log(field);

                        // });








                        if (!result.success) {
                            Swal(result.message, result.data, "error");
                            return;
                        }

                    });

                }
            })
        );

        $("#gear").prop('class', 'fa fa-check-circle fa-2x m-b');
        $("#load_text").html('Waiting to finish....');
        setTimeout(() => {
            $("#gear").prop('class', 'fa fa-cog fa-spin fa-3x m-b');
            $("#load_text").html('Loading...');
            window.location.reload();
        }, Math.random() * 1000);

    }

    setTimeout(() => {
        main();
    }, Math.random() * 1000);
}
//-------------------------------------------------- end upload excel --------------------------------------------------//


//-------------------------------------------------- create table for each item --------------------------------------------------//


// List Mark
function detailMark(stdId) {
    $('.formName')[0].reset();
    $('#fk_student').val(stdId);
    $('#btnSave').html('');
    $('#mdlStdMarks').modal('show');
}


// item onchange
$('#fk_lectCrsDet').change(function () {
    $('#cloLevelFK').html('');

    let val = $(this).val();
    let stdId = $('#fk_student').val();
    // let fullMark =  $(this).data('mark');
    let fullMark = $(this).find('option:selected').attr('mark');
    let cloLevelFK = $(this).find('option:selected').attr('cloLevelFK');
    $('#cloLevelFK').val(cloLevelFK);

    $('#setMark').html('');

    chkStdMark(stdId, val, function () {

        let exist = obj_stdMark.data.length;
        if (exist != 0) {
            $.each(obj_stdMark.data, function (i, item) {

                if (item.json_clo_crsDet !== null) {

                    let fkClo = JSON.parse(item.json_clo_crsDet);

                    let cloLevel = fkClo.find(clo => clo.fk_CLO === cloLevelFK);
  
                    if (cloLevel) {
                    $('#pk_stdMark').val(item.pk_id);
                    $('#mark').val(cloLevel.mark);
                    $('#setMark').val(fullMark);
                    $("#mark").prop('min',0);
                    $("#mark").prop('max',fullMark);

                    $('.formName').attr('id', 'formUptMarks');
                    $('#btnSave').html('<button type="submit" class="btn success p-x-md">Update</button>');
                 
                    }
                   } else {
                    
                    // $('#setMark').val(fullMark);

                    $('.formEdit').val('');
                    $('.formName').attr('id', 'formAddMarks');
                    $('#btnSave').html('<button disabled type="submit" class="btn info p-x-md">Save</button>');
                }
            
            
            
            });
        }
        else {
            $('.formEdit').val('');
            $('.formName').attr('id', 'formAddMarks');
            $('#btnSave').html('<button disabled type="submit" class="btn info p-x-md">Save</button>');
        }

    });
});



function chkStdMark(std, item, returnValue) {

    let form = new FormData();
    form.append("fk_lectCrsDet", item);
    form.append("fk_student", std);

    // alert(item + '-' + std);
    let settings = {
        "url": host + "api_lecturer_picoms/public/misLectStdMark/chkStdMark",
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

    let request = $.ajax(settings);

    request.done(function (response) {

        obj_stdMark = JSON.parse(response);
        returnValue();
    });

    request.fail(function () {
        obj_stdMark = { "success": false, "message": "no Data Found!", "data": "" };
        returnValue();
    });
}


//-------------------------------------------------- update student mark --------------------------------------------------//
$('#mdlStdMarks').on('submit', '#formUptMarks', function (e) {

    // Clear file input field
    $("#excel_file").val("");
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Update Mark",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let pk_id = $('#pk_stdMark').val();
            let mark = $('#mark').val();
            let cloLevelFK = $('#cloLevelFK').val();

            var form = new FormData();
            form.append("pk_id", pk_id);
            form.append("fkCLO_level", cloLevelFK);
            form.append("mark", mark);
            form.append("recordstatus", "EDT");
            var settings = {
                "url": host + "api_lecturer_picoms/public/misLectStdMark/updateCLOMark",
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
//-------------------------------------------------- end update student mark --------------------------------------------------//


function load_pgmCode(pgmCode) {
    $(".pgmCode").html(pgmCode);
    $("#btn_markStd").removeAttr('hidden');

    
    // $("#group_btn").prop('class','col-md-6 text-right');
    // $("#btn_markStd").prop('disabled',false);
    // $("#ip_all").prop('disabled',false);
    // $("#mrf_all").prop('disabled',false);
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
