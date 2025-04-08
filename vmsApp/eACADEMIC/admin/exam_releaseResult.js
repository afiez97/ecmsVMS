let usrCatEadmin = window.sessionStorage.usrCatEadmin;
let usrCatEcmis = window.sessionStorage.usrCatEcmis;

let clg_id = window.sessionStorage.idPage;
let token = window.sessionStorage.token;

let getSession = window.sessionStorage.pgmSession;
let calSem = window.sessionStorage.calSem;
let fac_id = window.sessionStorage.fac_id;

var listStd = [];
var data_load = [];
var data_ip = [];
var objIp = [];

var confirmed = false;
$(function(){
    $.ajaxSetup ({
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

    $.fn.select2.defaults.set( "theme", "bootstrap" );

    acaCalActive(function(){
        $('#semester').append('<option value="">- Choose Academic Session -</option>');
        let names = "";
        $.each(obj_kalendar.data, function (i, item){
            select = "";
            if(getSession == item.cal_id){
                select = "selected";
            }

            if(names != item.cur_year.replace('/','')+'/'+item.cal_cohort){
                names = item.cur_year.replace('/','')+'/'+item.cal_cohort;

                $('#semester').append('<option '+select+' value="'+item.cal_id+'" calYear="'+item.cur_year+'" calSem="'+item.cal_cohort+'">'+item.cur_year.replace('/','')+'/'+item.cal_cohort+'</option>');
            }
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:'
        });
    });

    let objFac = new get(host+'api_tetapan_picoms/public/misPrmFacCampus/listByCampus/'+clg_id,'picoms '+token).execute();
    if(objFac.success){
        $("#faculty").html('<option value="">- Faculty -</option>');
        $.each(objFac.data, function (i, item){
            select = "";
            if(fac_id == item.facCamId){
                select = "selected";
            }
            $('#faculty').append($('<option value="'+item.facCamId+'" '+select+' fac_name="'+item.facCode+' - '+item.fac_name+'">'+item.facCode+' - '+item.fac_name+'</option>'));
        });

        $("#faculty").select2({
            width: null,
            containerCssClass: ':all:'
        });
    }

    setTimeout(() => {
        let fk_acaCal = $("#semester option:selected").attr('value');
        let fac_id = $('#faculty').val();

        if(fk_acaCal != "" && fac_id != ""){
            $("#loading_mode").modal('show');
            window.sessionStorage.removeItem('pgmSession');
            window.sessionStorage.removeItem('fac_id');
            let selectSession = $("#semester option:selected").attr("calYear");
            let sem = $("#semester option:selected").attr("calSem");
            loadListStd(selectSession,sem,fk_acaCal,fac_id);
            // loadListStd(fk_acaCal,fac_id);        
        }
    }, Math.random()*1000);

    $("#search_form").on('submit',function(e){
        if(!confirmed){
            e.preventDefault();
            $("#loading_mode").modal('show');
            let selectSession = $("#semester option:selected").attr("calYear");
            let fk_acaCal = $("#semester option:selected").attr('value');
            let sem = $("#semester option:selected").attr("calSem");
            let fac_id = $('#faculty').val();
            loadListStd(selectSession,sem,fk_acaCal,fac_id);
            // $("#praSenat_list").prop('disabled',false);

        }
    });     

}); //load time


// $("#praSenat_list").click(() => {

    

//     let fac_name  = $("#fac_name").html();

//     let tempDiv = document.createElement("div");
//     tempDiv.innerHTML = fac_name;
//     fac_name = tempDiv.textContent || tempDiv.innerText || "";


//     let aca_sessionFac = $(".aca_session_dis").html();
//     window.jsPDF = window.jspdf.jsPDF;

//     // Initialize jsPDF document
//     var doc = new jsPDF({
//         orientation: "portrait",
//         unit: "mm",
//         format: "a4",
//     });

//     var a4Width = 210;
//     var finalY, finalY2; // Declare these variables to store Y-coordinates


//     timeStampPdf(doc);

//     // Image dimensions
//     var originalWidth = 275.59;
//     var originalHeight = 67.818;

//     // Calculate the new width and height (60% of A4 width while maintaining aspect ratio)
//     var newWidth = 0.6 * a4Width;
//     var newHeight = (newWidth / originalWidth) * originalHeight;

//     // Calculate the X-coordinate to center the image on the A4 page
//     var xCoordinate = (a4Width - newWidth) / 2;

//     // Add the logo image to the document
//     doc.addImage("images/logo_reporting.png", "JPEG", xCoordinate, 10, newWidth, newHeight);

//     doc.setFont("helvetica", "bold");
//     var textCenterX = doc.internal.pageSize.width / 2;
//     doc.setFontSize(14);
//     doc.text('VARIABLE MOVE SOLUTION (VMS)', textCenterX, 50, {
//         align: "center"
//     });

//     doc.text(fac_name, textCenterX, 55, {
//         align: "center"
//     });

//     doc.text('SESSION ' +aca_sessionFac, textCenterX, 60, {
//         align: "center"
//     });

//     let dataStudentActive  = $("#active_std").html();
//     let dataStudentDeferred  = $("#deferred_std").html();
//     let dataStudentWithdraw  = $("#withdraw_std").html();

//     doc.setFontSize(12);
//     doc.setFont("helvetica", "normal");
//     doc.text('Students Status Active: ' + dataStudentActive, 15, 70);
//     doc.text('Students Status Deferred: ' + dataStudentDeferred, 15, 75);
//     doc.text('Students Status Withdraw: ' + dataStudentWithdraw, 15, 80);


//     // Define the source elements (your HTML tables)
//     var source1 = $('.ListPgm_standing')[0];
//     var source2 = $('#tbl')[0];

//     // console.log(source1);
//     // console.log(source2);

//     // Generate the first table in the PDF
//     doc.autoTable({
//         html: source1,
//         startY: 85, // Position below the text
//         margin: {
//             top: 20
//         },
//         theme: 'grid',
//         styles: {
//             fillColor: false,
//             textColor: 0,
//             fontSize: 8
//         },
//         headerStyles: {
//             fillColor: '#9c4298',
//             textColor: 255,
//             fontSize: 10
//         },
//         didDrawPage: function (data) {
//             finalY = data.cursor.y; // Save the final y-coordinate after the first table is drawn
//         }
//     });


//     //New Page
//     doc.addPage("a4", "p");

//     // Add the logo image to the document
//     doc.addImage("images/logo_reporting.png", "JPEG", xCoordinate, 10, newWidth, newHeight);

//     doc.setFont("helvetica", "bold");
//     var textCenterX = doc.internal.pageSize.width / 2;
//     doc.setFontSize(14);
//     doc.text('VARIABLE MOVE SOLUTION (VMS)', textCenterX, 50, {
//         align: "center"
//     });

//     doc.text(fac_name, textCenterX, 55, {
//         align: "center"
//     });

//     doc.text('SESSION ' +aca_sessionFac, textCenterX, 60, {
//         align: "center"
//     });


//     let facCode = fac_name.split(" - ")[0];

//     doc.setFontSize(14);
//     doc.setFont("helvetica", "bold");
//     doc.text('GPA/CGPA Statistic', 15, 70);

//     // Capture the chart and add it to the PDF
//     let dom = document.getElementById('chart_gpaCgpa');
//     html2canvas(dom).then(canvas => {
//         const imgData = canvas.toDataURL('image/png');
//         const imgY = 75; // Set the initial y-coordinate for the image
//         doc.addImage(imgData, 'PNG', 10, imgY, 180, 90); // Adjust the position and size as needed

//         // Get the last y-coordinate after the image is added
//         let finalY2 = imgY + 90 + 5; // 90 is the height of the image, 10 is the margin

//         // Generate the second table in the PDF
//         // doc.autoTable({
//         //     html: source2,
//         //     startY: finalY2, // Position below the image
//         //     margin: {
//         //         top: 20
//         //     },
//         //     theme: 'grid',
//         //     styles: {
//         //         fillColor: false,
//         //         textColor: 0,
//         //         fontSize: 8
//         //     },
//         //     headerStyles: {
//         //         fillColor: '#9c4298',
//         //         textColor: 255,
//         //         fontSize: 10
//         //     },
//         //     didDrawPage: function (data) {
//         //         finalY2 = data.cursor.y; // Save the final y-coordinate after the first table is drawn
//         //     }
//         // });

//         // Extract the <tfoot> content
// var tfoot = document.querySelector('#tbl tfoot').outerHTML;
// document.querySelector('#tbl tfoot').remove();

// // Generate the table without the footer
// doc.autoTable({
//     html: source2,
//     startY: finalY2, // Position below the image
//     margin: {
//         top: 20
//     },
//     theme: 'grid',
//     styles: {
//         fillColor: false,
//         textColor: 0,
//         fontSize: 8
//     },
//     headerStyles: {
//         fillColor: '#9c4298',
//         textColor: 255,
//         fontSize: 10
//     },
//     didDrawPage: function (data) {
//         // Check if it's the last page
//         if (data.pageNumber === doc.internal.getNumberOfPages()) {
//             // Calculate the position for the footer
//             var position = doc.autoTableEndPosY() + 10;

//             // Add the footer content manually
//             doc.autoTable({
//                 html: tfoot,
//                 startY: position,
//                 theme: 'grid',
//                 tableWidth: 'auto',
//                 styles: {
//                     fillColor: false,
//                     textColor: 0,
//                     fontSize: 8
//                 },
//                 headerStyles: {
//                     fillColor: '#9c4298',
//                     textColor: 255,
//                     fontSize: 10
//                 },
//                 tableLineWidth: 0,
//                 margin: {
//                     top: 20,
//                     bottom: 20,
//                     left: data.settings.margin.left,
//                     right: data.settings.margin.right
//                 }
//             });
//         }
//     }
// });

//         // Total = <tr><td colspan="3" class="text-right"><b>Total</b></td><td class=""><p class="text-center total_std"></p></td><td colspan="2"></td></tr>;

//         // Save the PDF after the table is added
//         doc.save('Pre_Senat_'+facCode+'_'+aca_sessionFac+'.pdf');
//     });
// });


$("#praSenat_list").click(() => {

    let fac_name = $("#fac_name").html();

    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = fac_name;
    fac_name = tempDiv.textContent || tempDiv.innerText || "";

    let aca_sessionFac = $(".aca_session_dis").html();
    window.jsPDF = window.jspdf.jsPDF;

    // Initialize jsPDF document
    var doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    var a4Width = 210;

    timeStampPdf(doc);

    // Image dimensions
    var originalWidth = 275.59;
    var originalHeight = 67.818;

    // Calculate the new width and height (60% of A4 width while maintaining aspect ratio)
    var newWidth = 0.6 * a4Width;
    var newHeight = (newWidth / originalWidth) * originalHeight;

    // Calculate the X-coordinate to center the image on the A4 page
    var xCoordinate = (a4Width - newWidth) / 2;

    // Add the logo image to the document
    doc.addImage("images/logo_reporting.png", "JPEG", xCoordinate, 10, newWidth, newHeight);

    doc.setFont("helvetica", "bold");
    var textCenterX = doc.internal.pageSize.width / 2;
    doc.setFontSize(14);
    doc.text('VARIABLE MOVE SOLUTION (VMS)', textCenterX, 50, {
        align: "center"
    });

    doc.text(fac_name, textCenterX, 55, {
        align: "center"
    });

    doc.text('SESSION ' + aca_sessionFac, textCenterX, 60, {
        align: "center"
    });

    let dataStudentActive = $("#active_std").html();
    let dataStudentDeferred = $("#deferred_std").html();
    let dataStudentWithdraw = $("#withdraw_std").html();

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text('Students Status Active: ' + dataStudentActive, 15, 70);
    doc.text('Students Status Deferred: ' + dataStudentDeferred, 15, 75);
    doc.text('Students Status Withdraw: ' + dataStudentWithdraw, 15, 80);

    // Define the source elements (your HTML tables)
    var source1 = $('.ListPgm_standing')[0];
    var source2 = $('#list_standing')[0];

    // Generate the first table in the PDF
    doc.autoTable({
        html: source1,
        startY: 85, // Position below the text
        margin: { top: 20 },
        theme: 'grid',
        styles: {
            fillColor: false,
            textColor: 0,
            fontSize: 8
        },
        headerStyles: {
            fillColor: '#9c4298',
            textColor: 255,
            fontSize: 10
        },
    });

    // Extract facCode before it is needed
    let facCode = fac_name.split(" - ")[0];

    // New Page
    doc.addPage("a4", "p");

    // Add the logo image to the document
    doc.addImage("images/logo_reporting.png", "JPEG", xCoordinate, 10, newWidth, newHeight);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text('GPA/CGPA Statistic', 15, 70);

    // Capture the chart and add it to the PDF
    let dom = document.getElementById('chart_gpaCgpa');
    html2canvas(dom).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgY = 75;
        doc.addImage(imgData, 'PNG', 10, imgY, 180, 90);

        let finalY2 = imgY + 90 + 5;

        let tStudent = $("#totalStudent").val();

        // Generate the second table in the PDF
        doc.autoTable({
            html: source2,
            startY: finalY2,
            margin: { top: 20 },
            theme: 'grid',
            styles: {
                fillColor: false,
                textColor: 0,
                fontSize: 8
            },
            headerStyles: {
                fillColor: '#9c4298',
                textColor: 255,
                fontSize: 10
            },
        });

        // After all content is added, calculate the total pages and add the "Total Students" text
        let totalPages = doc.internal.getNumberOfPages();
        doc.setPage(totalPages); // Move to the last page
        let finalY = doc.lastAutoTable.finalY || 280; // Get the last y position of the table or a default value

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text('Total Students: ' + (tStudent || 'N/A'), 15, finalY + 10);

        // Save the PDF after the text is added
        doc.save('Pre_Senat_' + facCode + '_' + aca_sessionFac + '.pdf');
    });
});







function loadListStd(selectSession,sem,fk_acaCal,fac_id){

    $(".aca_session_dis").html(selectSession.replace('/','') + '/' + sem);

    $("#fac_name").html($('#faculty option:selected').attr('fac_name'));

    let form = new FormData();
    form.append('cal_cohort',sem);
    form.append('cur_year',selectSession);
    form.append('fk_acaCal',fk_acaCal);
    form.append('fac_id',fac_id);
    form.append('cam_id',clg_id);

    let objStd = new post(host+'api_pengurusan_pelajar/public/curAcademic/student/faculty',form,'picoms '+token).execute();

    objIp = new post(host+'api_pengurusan_pelajar/public/misStdRegsub/ip/session',form,'picoms '+ token).execute();

    if(objStd.success){

        $("#praSenat_list").prop('disabled',false);

        let data = objStd.data;
        let dataStd = data;
        data_load = data;

        var gs = 0, cs = 0, f = 0,active_std = 0, deferred_std = 0, withdraw_std = 0;
        var num1 = 0, num2 = 0, num3 = 0, num4 = 0, num5 = 0, num6 = 0, num7 = 0;
        var numc1 = 0, numc2 = 0, numc3 = 0, numc4 = 0, numc5 = 0, numc6 = 0, numc7 = 0;
        let stat_gpa = [];
        let stat_cgpa = [];

        let list_stdPgm = [];

        async function doSomethingAsync(item) {
            return new Promise(resolve => {
                setTimeout(() => {
                    $("#load_text").html(item.student);
                    resolve();
                }, Math.random() * 1000);
            });
        }

        async function main(){                    

            let sumStd = 0;
            let pgm_tag = "";
            let total_pgmstd = 0;
            let itemlist = [];
            let data_intake = [];
            let list_disabled = ['With-draw','Deferred'];

            await Promise.all(
                data.map(async (item, i) => {
                    if(i == 0){
                        $("#cal_intake").html(item.cal_intake);
                        $("#semester_intake").html(item.cal_cohort);
                    }
                    
                    if(pgm_tag != "pgm_"+item.pgm_id){
                        if(pgm_tag != ""){
                            list_stdPgm[pgm_tag] = itemlist;
                            itemlist = [];
                        }

                        pgm_tag = "pgm_"+item.pgm_id;
                        sumStd = 1;
                        total_pgmstd++;
                        itemlist.push(item);

                    }
                    else{
                        sumStd++;
                        total_pgmstd++;
                        itemlist.push(item);
                    }

                    if(i == (data.length-1)){
                        list_stdPgm[pgm_tag] = itemlist;
                    }
    
                    cgpa = (item.std_cgpa)*1;
                    gpa = (item.std_gpa)*1;
                                                
                    if(list_disabled.indexOf(item.curAcademic_type) == -1){
                        active_std++;
                    }
                    else if(item.curAcademic_type == 'Deferred'){
                        deferred_std++;
                    }
                    else if(item.curAcademic_type == 'With-draw'){
                        withdraw_std++;
                    }

                    //GPA
                    if(gpa < 1.00){
                        num1++;

                    }
                    else if(gpa < 1.50){
                        num2++;
                    }
                    else if(gpa < 1.99){
                        num3++;

                    }
                    else if(gpa < 2.50){
                        num4++;

                    }
                    else if(gpa < 3.00){
                        num5++;                            
                    }
                    else if(gpa < 3.50){
                        num6++;                            
                    }
                    else{
                        num7++;
                    }
        
                    //CGPA
                    if(cgpa >= 2.00){
                        gs++;
                    }
                    else if(cgpa < 2.00 && cgpa > 1.50){
                        cs++;
                    }
                    else{
                        f++;
                    }

                    if(cgpa < 1.00){
                        numc1++;

                    }
                    else if(cgpa < 1.50){
                        numc2++;
                    }
                    else if(cgpa < 1.99){
                        numc3++;

                    }
                    else if(cgpa < 2.50){
                        numc4++;

                    }
                    else if(cgpa < 3.00){
                        numc5++;                            
                    }
                    else if(cgpa < 3.50){
                        numc6++;                            
                    }
                    else{
                        numc7++;
                    }

                    await doSomethingAsync({"student":item.sti_name});

                })
            );

            setTimeout(() => {
                // console.log(list_stdPgm)
                stat_gpa = [num1,num2,num3,num4,num5,num6,num7];
                stat_cgpa = [numc1,numc2,numc3,numc4,numc5,numc6,numc7];

                $("#total_pgmStd").html(total_pgmstd);
                
                $("#total_gs").html(gs);
                $("#total_cs").html(cs);
                $("#total_f").html(f);

                $("#active_std").html(active_std);
                $("#deferred_std").html(deferred_std);
                $("#withdraw_std").html(withdraw_std);
                $("#load_text").html("Loading...");
                $("#loading_mode").modal("hide");                
                
                let dom = document.getElementById('chart_gpaCgpa');
                let myChart = echarts.init(dom);
                var option = {
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['CGPA','GPA']
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : true,
                            show: true,                                          
                            data : ['0.00-0.99','1.00-1.50','1.51-1.99','2.00-2.49','2.50-2.99','3.00-3.49','3.50-4.00']
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            // show: true,
                        }
                    ],
                    series : [
                        {
                            name:'CGPA',
                            type:'bar',
                            smooth:true,
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
                            data:stat_cgpa
                        },
                        {
                            name:'GPA',
                            type:'bar',
                            smooth:true,
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
                            data:stat_gpa
                        }
                        
                    ]
                };
                myChart.setOption(option);   
                
                let objPgm = new get(host+'api_tetapan_picoms/public/misPrmProgcampus/listByFac/'+fac_id+'/'+window.sessionStorage.idPage,'picoms '+token).execute();
                $("#list_pgm").html('');
                $(".ListPgm_standing").html('');
                if(objPgm.success){  
                    listStd = list_stdPgm;        
                    $.each(objPgm.data,function(u,itemPgm){

                        let intake = "";
                        let listPgm_standing = "";
                        let pgm_code = itemPgm.pgm_code;
                        let pgm_name = itemPgm.pgm_name;

                        let total_std = 0;
                        // let stdList = list_stdPgm['pgm_'+itemPgm.pgm_code];

                        let filterConditions = {
                            pgm_id : itemPgm.pgm_code
                        }
                        let stdList = filterData(data_load,filterConditions);

                        // console.log(stdList)
                        
                        if(stdList != undefined){
                            total_std = stdList.length; 
                            if(total_std > 0){
                                listPgm_standing += `
                            <tr>
                                <th class="alert-info blue-50" colspan="3">`+(u+1)+`. <a class="btn btn-sm btn-success" onclick="exam_gpa('`+itemPgm.pgm_code+`')" href="javascript:void(0);">`+itemPgm.pgm_code+` <i class="fa fa-arrow-right"></i></a> - `+itemPgm.pgm_name+`</th>
                                <th class="alert-info blue-50 text-center" colspan="3">Academic Standing</th>
                                <th class="alert-info blue-50 text-center" colspan="2">Active</th>
                                <th class="alert-info blue-50 text-center" colspan="2">Not Active</th>
                                <th class="alert-info blue-50 text-center">Total</th>
                            </tr>
                            <tr>
                                <th class="alert-info blue-50">Intake</th>
                                <th class="alert-info blue-50 text-center">Semester</th>
                                <th class="alert-info blue-50 text-center">IP</th>
                                <th class="alert-info blue-50">GS</th>
                                <th class="alert-info blue-50">CS</th>
                                <th class="alert-info blue-50">F</th>
                                <th class="alert-info blue-50">D</th>
                                <th class="alert-info blue-50">T</th>
                                <th class="alert-info blue-50">MIA</th>
                                <th class="alert-info blue-50">W</th>
                                <th class="alert-info blue-50 text-center">
                                <a class="btn btn-link" href="javascript:void(0);" onclick="load_stdPgm('pgm_`+itemPgm.pgm_code+`','`+itemPgm.pgm_name+`')"><b>`+total_std+`</b></a></th>
                            </tr>`; 
                            }
                                                                                   
                        }

                        stdList.sort(compareByStd_intake);

                        stdList.forEach( async (item,i) => {
                            if(intake != item.cur_intake +"_"+ item.std_semester){
                                intake = item.cur_intake +"_"+ item.std_semester;

                                let gs_data = 0;
                                let cs_data = 0;
                                let f_data = 0;
                                let d_data = 0;
                                let w_data = 0;
                                let m_data = 0;
                                let cp_data = 0;
                                let ip_data = 0;
                                
                                let filterConditions = {
                                    cur_intake: item.cur_intake,
                                    std_semester: item.std_semester 
                                };
                                
                                data_intake = filterData(stdList,filterConditions);

                                data_intake.forEach(async (itemIntake,v) => {
                                    let filterIp = {
                                        std_studentid: item.std_studentid
                                    };

                                    if(objIp.success){
                                        data_ip = filterData(objIp.data,filterIp);

                                        if(data_ip.length > 0){
                                            ip_data++;
                                        }
                                    }
                                                                        
                                    let std_id = itemIntake.std_studentid;
                                    let cp = std_id.substring(7,8);

                                    if(itemIntake.std_cgpa >= 2.00){
                                        gs_data++;
                                    }
                                    else if(itemIntake.std_cgpa < 2.00 && itemIntake.std_cgpa >= 1.50){
                                        cs_data++;
                                    }
                                    else if(itemIntake.std_cgpa < 1.50 && itemIntake.curAcademic_type == "" && data_ip.length == 0){
                                        f_data++;
                                    }
                                    else if(itemIntake.curAcademic_type == "Deferred"){
                                        d_data++;
                                    }
                                    else if(itemIntake.curAcademic_type == "With-draw"){
                                        w_data++;
                                    }
                                    else if(itemIntake.status_academic == "11"){
                                        m_data++;
                                    }
                                    
                                    if(cp == "2"){
                                        cp_data++;
                                    }
                                })

                                listPgm_standing += `
                                    <tr>
                                        <td>`+item.cur_intake+`</td>
                                        <td class="text-center">`+item.std_semester+`</td>
                                        <td class="text-info text-center"><a href="javascript:void(0);" onclick="load_stdDetail('`+pgm_code+`','`+pgm_name+`','ip','`+item.cur_intake+`','`+item.std_semester+`')">`+ip_data+`</a></td>
                                        <td><a href="javascript:void(0);" onclick="load_stdDetail('`+pgm_code+`','`+pgm_name+`','gs','`+item.cur_intake+`','`+item.std_semester+`')">`+gs_data+`</a></td>
                                        <td><a href="javascript:void(0);" onclick="load_stdDetail('`+pgm_code+`','`+pgm_name+`','cs','`+item.cur_intake+`','`+item.std_semester+`')">`+cs_data+`</a></td>
                                        <td><a href="javascript:void(0);" onclick="load_stdDetail('`+pgm_code+`','`+pgm_name+`','f','`+item.cur_intake+`','`+item.std_semester+`')">`+f_data+`</a></td>
                                        <td class="text-muted"><a href="javascript:void(0);" onclick="load_stdDetail('`+pgm_code+`','`+pgm_name+`','d','`+item.cur_intake+`','`+item.std_semester+`')">`+d_data+`</a></td>                                        
                                        <td class="text-info"><a href="javascript:void(0);" onclick="load_stdDetail('`+pgm_code+`','`+pgm_name+`','cp','`+item.cur_intake+`','`+item.std_semester+`')">`+cp_data+`</a></td>
                                        <td class="text-warning"><a href="javascript:void(0);" onclick="load_stdDetail('`+pgm_code+`','`+pgm_name+`','mia','`+item.cur_intake+`','`+item.std_semester+`')">`+m_data+`</a></td>
                                        <td class="text-danger"><a href="javascript:void(0);" onclick="load_stdDetail('`+pgm_code+`','`+pgm_name+`','w','`+item.cur_intake+`','`+item.std_semester+`')">`+w_data+`</a></td>
                                        <td class="text-center"><a href="javascript:void(0);"  onclick="load_stdDetail('`+pgm_code+`','`+pgm_name+`','','`+item.cur_intake+`','`+item.std_semester+`')">`+data_intake.length+`</a></td>
                                    </tr>`;
                                
                            }
                        })

                        // $(".ListPgm_standing").append('<tr><td>'+(u+1)+'</td><td><a class="text-success" onclick="exam_gpa(\''+itemPgm.pgm_id+'\')" href="javascript:void(0);">'+itemPgm.pgm_code+'</a>&nbsp; - &nbsp;'
                        // +itemPgm.pgm_name+'</td><td class="text-center"><a class="btn btn-sm  btn_loadStd" onclick="load_stdPgm(\'pgm_'+itemPgm.pgm_code+'\',\''+itemPgm.pgm_name+'\')">'+total_std+'</a></td></tr>');

                        $(".ListPgm_standing").append(listPgm_standing);

                        // $("#list_pgm").append('<tr><td>'+(u+1)+'</td><td><a class="text-success" onclick="exam_gpa(\''+itemPgm.pgm_id+'\')" href="javascript:void(0);"><i class="fa fa-dashboard"></i></a>&nbsp;&nbsp;'+itemPgm.pgm_code+'</td><td>'
                        // +itemPgm.pgm_name+'</td><td class="text-center"><a class="btn btn-sm  btn_loadStd" onclick="load_stdPgm(\'pgm_'+itemPgm.pgm_code+'\',\''+itemPgm.pgm_name+'\')">'+total_std+'</a></td></tr>');
                    });
                }  
                
                let objCont = new post(host+'api_pengurusan_pelajar/public/curAcademic/student/contFac',form,'picoms '+token).execute();
                if(objCont.success){
                    data = objCont.data;
                    let semester = "";
                    let num = 1;
                    let total_std = 0;
                    let total_intake = 0;
                    $("#list_standing").html('');
                    data.forEach(async (item,i) => {

                        if(semester != item.cur_intake+"-"+item.std_semester){
                            // let form = new FormData();
                            // form.append('fk_acaCal',fk_acaCal);
                            // form.append('cur_intake',item.cur_intake);
                            // form.append('std_semester',item.std_semester);
                            // form.append('fac_id',fac_id);

                            // let obj_gs = new post(host+'api_pengurusan_pelajar/public/curAcademic/student/standing/good',form,'picoms '+token).execute();
                            // let total = 0;
                            // if(obj_gs.success){
                            //     total = obj_gs.data[0].total;
                            // }

                            let filterConditions = {
                                cur_intake: item.cur_intake,
                                std_semester: item.std_semester 
                            };

                            if(i != 0){
                                total_std += total_intake;
                                $("#list_standing").append(`
                                <tr class="text-white grey-500"><td colspan="3"><b>TOTAL INTAKE</b></td><td class="text-center"><b>`+total_intake+`</b></td><td colspan="2"></td></tr>
                                `);
                            }

                            total_intake = 0;

                            data_intake = filterData(dataStd, filterConditions);
                            let good_standing = filterGoodStanding(data_intake);
                            // console.log("GOOD STANDING : "+JSON.stringify(good_standing));
                            total_intake += good_standing.length;

                            $("#list_standing").append(`<tr>
                            <td>`+num+`</td><td>`+item.cur_intake+`</td><td class="text-center">`+item.std_semester+`</td>
                            <td class="text-center">
                            <b class="text-info">
                            <a onclick="load_stdStanding(`+item.std_semester+`,'`+item.cur_intake+`','GOOD STANDING')" href="javascript:void(0);">`+good_standing.length+`</a>
                            </b>
                            </td><td><i>GOOD STANDING</i></td><td>CGPA >= 2.00<br>(CGPA of 2.00 and above)</td>
                            </tr>`);
                            num++;
                            semester = item.cur_intake;

                            // total_std += (item.total)*1;

                            for(num_loop = 1; num_loop < 3 ; num_loop++){
                                if(num_loop == 1){

                                    list_standing = filterContStanding(data_intake);
                                    // console.log("CONT STANDING : "+JSON.stringify(list_standing));

                                    status_list = "CONDITIONAL STANDING";
                                    text_info = '2.00 > CGPA >= 1.50<br>(CGPA of 1.51 to 1.99)';
                                    // get_url = 'api_pengurusan_pelajar/public/curAcademic/student/standing/cont';
                                }
                                else{
                                    list_standing = filterFailed(data_intake);
                                    // console.log("FAILED : "+JSON.stringify(list_standing));

                                    status_list = "FAILED";
                                    text_info = 'CGPA <= 1.50<br>(CGPA of 1.50 and below)';
                                    // get_url = 'api_pengurusan_pelajar/public/curAcademic/student/standing/failed';
                                }

                                total_intake += list_standing.length;

                                $("#list_standing").append(`<tr>
                                <td></td><td></td><td class="text-center">`+item.std_semester+`</td>
                                <td class="text-center">
                                <b class="text-info">
                                <a onclick="load_stdStanding(`+item.std_semester+`,'`+item.cur_intake+`','`+status_list+`')" href="javascript:void(0);">`+list_standing.length+`</a>
                                </b>
                                </td>
                                </td><td><i>`+status_list+`</i></td><td>`+text_info+`</td>
                                </tr>`);
                            }
                        }
                    });

                    total_std += total_intake;

                    $("#list_standing").append(`
                        <tr class="text-white grey-500"><td colspan="3"><b>TOTAL INTAKE</b></td><td class="text-center"><b>`+total_intake+`</b></td><td colspan="2"></td></tr>
                    `);

                    $(".total_std").html(total_std);
                    $("#totalStudent").val(total_std);
                }                
                
            }, Math.random() * 1000);
        } 

        main();

        // dataStd.sort((a, b) => {
        //     let ci = a.cur_intake.toLowerCase(),
        //         ss = b.std_semester;
        
        //     if (ci < ss) {
        //         return -1;
        //     }
        //     if (ci > ss) {
        //         return 1;
        //     }
        //     return 0;
        // });

        // console.log(dataStd);
        
    }
    else{
        $("#load_text").html("Loading...");
        $("#loading_mode").modal("hide"); 
        swal('No Data Found!',$('#faculty option:selected').attr('fac_name'),'warning');
        $("#praSenat_list").prop('disabled',true);

        // setTimeout(() => {
        //     window.location.reload();
        // }, Math.random()*1000);
    }    
}

function exam_gpa(pgm_id){
    let calYear = $("#semester option:selected").attr('calYear');
    let sem = $("#semester option:selected").attr("calSem");
    // alert(pgm_id)
    window.sessionStorage.pgm_id = pgm_id;
    window.sessionStorage.pgmSession = calYear.replace('/','') + '/' + sem;
    window.sessionStorage.content = "exam_gpa";
    window.location.replace('adminPage.html');    
}

function load_stdDetail(pgm_tag,name_pgm,type_field,cur_intake,std_semester){
    // console.log(listStd)
    let dataList = listStd['pgm_'+pgm_tag];
    // console.log(dataList)
    let filter_intake = {
        cur_intake:cur_intake,
        std_semester:std_semester
    };
    let data = [];
    let data_set = filterData(dataList,filter_intake);
    let text_select = "";
    if(type_field == "ip"){
        text_select = "<span class='text-warning'>In Progress</span>";
        data_set.forEach(async (item,i)=>{
            let filterIp = {
                std_studentid: item.std_studentid
            };            
            if(objIp.success){
                data_ip = filterData(objIp.data,filterIp);

                if(data_ip.length > 0){
                    data.push(item);
                }
            }
        })
    }
    else if(type_field == "gs"){
        text_select = "<i class='text-success'>Good Standing</i>";
        data = filterGoodStanding(data_set);
    }
    else if(type_field == "cs"){
        text_select = "<i class='text-primary'>Conditional Standing</i>";
        data = filterContStanding(data_set);
    }
    else if(type_field == "f"){
        text_select = "<i class='text-danger'>Failed</i>";
        data = filterFailed(data_set);
    }
    else if(type_field == "d"){
        text_select = "<i class='text-warning'>Deferred</i>";
        let filter_intake = {curAcademic_type:"Deferred"};
        data = filterData(data_set,filter_intake);
    }
    else if(type_field == "cp"){
        text_select = "<i class='text-info'>Change Programme</i>";
        data_set.forEach(async (item,i)=>{
            let std_id = item.std_studentid;
            let cp = std_id.substring(7,8);            
            if(cp == "2"){
                data.push(item);
            }
        })
    }
    else if(type_field == "mia"){
        text_select = "<i class='text-secondary'>Missing In Action</i>";
        let filter_intake = {status_academic:"11"};
        data = filterData(data_set,filter_intake); 
    }
    else if(type_field == "w"){
        text_select = "<i class='text-danger'>With-draw</i>";
        let filter_intake = {curAcademic_type:"With-draw"};
        data = filterData(data_set,filter_intake);        
    }
    else {
        data = data_set;
    }
    
    $("#listStdPgm").html('');
    $("#name_pgm").html(name_pgm + '<br><small>' +cur_intake+  ' '+text_select+'</small>');
    let selectSession = $("#semester option:selected").attr("calYear");
    let sem = $("#semester option:selected").attr("calSem"); 
    
    if(data.length > 0){
        let columns = [
            { "name": "bil", "title": "No.", "breakpoints": "md sm xs"  },
            { "name": "student_id", "title": "Student Id" },
            { "name": "std_name", "title": "Name" },
            { "name": "std_semester", "title": "Semester" },
            { "name": "std_gpa", "title": "GPA" },
            { "name": "std_cgpa", "title": "CGPA" },
            { "name": "status_academic", "title": "Status Academic" },
        ];
        
        let bil = 1;
        let list = [];
        $.each(data,function(i,field){
            let status_academic = "Active";
            if(field.curAcademic_type == 'With-draw'){
                colors = `red`;
                status_academic = field.curAcademic_type;
            }
            else if(field.curAcademic_type == 'Deferred'){
                status_academic = field.curAcademic_type;
                colors = `secondary`;
            }                    
            else if(field.curAcademic_type == ""){
                colors = `green`;
            }

            list.push({"bil":bil++,
            "student_id":`<a href="javascript:void(0);" class="text-info" onclick="loadData('` + field.std_studentid + `',`+field.fk_acaCal+`,'`+sem+`','`+selectSession+`','`+field.pk_cur_academic+`','list_stdPgm')">`+field.std_studentid+`</a>`,
            "std_name":field.sti_name,"std_semester":field.std_semester,
            "std_gpa":field.std_gpa,"std_cgpa":field.std_cgpa,"status_academic":`<p class="text-center"><span class="label `+colors+`">`+status_academic+`<span></p>`});
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
    else{
        swal("No Data","List Students not found!","warning");
    }
    $("#list_stdPgm").modal('show');
}

function load_stdPgm(pgm_tag,name_pgm){
    console.log(listStd)
    let data = listStd[pgm_tag];
    
    $("#listStdPgm").html('');
    $("#name_pgm").html(name_pgm);
    let selectSession = $("#semester option:selected").attr("calYear");
    let sem = $("#semester option:selected").attr("calSem"); 
    if(data.length > 0){
        let columns = [
            { "name": "bil", "title": "No.", "breakpoints": "md sm xs"  },
            { "name": "student_id", "title": "Student Id" },
            { "name": "std_name", "title": "Name" },
            { "name": "std_semester", "title": "Semester" },
            { "name": "std_gpa", "title": "GPA" },
            { "name": "std_cgpa", "title": "CGPA" },
            { "name": "status_academic", "title": "Status Academic" },
        ];
        
        let bil = 1;
        let list = [];
        $.each(data,function(i,field){
            let status_academic = "Active";
            if(field.curAcademic_type == 'With-draw'){
                colors = `red`;
                status_academic = field.curAcademic_type;
            }
            else if(field.curAcademic_type == 'Deferred'){
                status_academic = field.curAcademic_type;
                colors = `secondary`;
            }                    
            else if(field.curAcademic_type == ""){
                colors = `green`;
            }

            list.push({"bil":bil++,
            "student_id":`<a href="javascript:void(0);" class="text-info" onclick="loadData('` + field.std_studentid + `',`+field.fk_acaCal+`,'`+sem+`','`+selectSession+`','`+field.pk_cur_academic+`','list_stdPgm')">`+field.std_studentid+`</a>`,
            "std_name":field.sti_name,"std_semester":field.std_semester,
            "std_gpa":field.std_gpa,"std_cgpa":field.std_cgpa,"status_academic":`<p class="text-center"><span class="label `+colors+`">`+status_academic+`<span></p>`});
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
    else{
        swal("No Data","List Students not found!","warning");
    }
    $("#list_stdPgm").modal('show');
}

function load_stdStanding(std_semester,intake,standing){

    let filterConditions = {
        cur_intake: intake,
        std_semester: std_semester 
    };
    // console.log(data_load)
    let dataStd = [];
    if(standing == "FAILED"){
        let data_intake = filterData(data_load, filterConditions);
        dataStd = filterFailed(data_intake);
    }
    else if(standing == "CONDITIONAL STANDING"){
        let data_intake = filterData(data_load, filterConditions);
        dataStd = filterContStanding(data_intake);
    }
    else if(standing == "GOOD STANDING"){
        let data_intake = filterData(data_load, filterConditions);
        dataStd = filterGoodStanding(data_intake);
    }

    let data = dataStd;
    $("#listStdStanding").html('');
    $("#title_standing").html(standing);
    $("#title_intake").html(intake);

    let selectSession = $("#semester option:selected").attr("calYear");
    let sem = $("#semester option:selected").attr("calSem"); 
    if(data.length > 0){
        let columns = [
            { "name": "bil", "title": "No.", "breakpoints": "md sm xs"  },
            { "name": "student_id", "title": "Student Id" },
            { "name": "std_name", "title": "Name" },
            { "name": "std_semester", "title": "Semester" },
            { "name": "std_gpa", "title": "GPA" },
            { "name": "std_cgpa", "title": "CGPA" },
            { "name": "status_academic", "title": "Status" },
        ];
        
        let bil = 1;
        let list = [];
        $.each(data,function(i,field){
            let status_academic = "Active";
            if(field.curAcademic_type == 'With-draw'){
                colors = `red`;
                status_academic = field.curAcademic_type;
            }
            else if(field.curAcademic_type == 'Deferred'){
                status_academic = field.curAcademic_type;
                colors = `secondary`;
            }                    
            else if(field.curAcademic_type == ""){
                colors = `green`;
            }

            list.push({"bil":bil++,
            "student_id":`<a href="javascript:void(0);" class="text-info" onclick="loadData('` + field.std_studentid + `',`+field.fk_acaCal+`,'`+sem+`','`+selectSession+`','`+field.pk_cur_academic+`','list_stdStanding')">`+field.std_studentid+`</a>`,
            "std_name":field.sti_name,"std_semester":field.std_semester,
            "std_gpa":field.std_gpa,"std_cgpa":field.std_cgpa,"status_academic":`<p class="text-center"><span class="label `+colors+`">`+status_academic+`<span></p>`});
        });
        
        $("#listStdStanding").footable({
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

$(".btn_deffered").click(function(){
    load_stdStatusAcademic('Deferred');
});

$(".btn_withdraw").click(function(){
    load_stdStatusAcademic('With-draw');
});

//filter status_academic curAcademic_type
function load_stdStatusAcademic(curAcademic_type){

    let filterConditions = {
        curAcademic_type: curAcademic_type 
    };
     // console.log(data_load)
     let dataStd = [];
     dataStd = filterData(data_load, filterConditions);
 
     let data = dataStd;
     $("#listStdStanding").html('');
     $("#title_standing").html(curAcademic_type);
     $("#title_intake").html('');

     let selectSession = $("#semester option:selected").attr("calYear");
     let sem = $("#semester option:selected").attr("calSem");     
     if(data.length > 0){
         let columns = [
             { "name": "bil", "title": "No.", "breakpoints": "md sm xs"  },
             { "name": "student_id", "title": "Student Id" },
             { "name": "std_name", "title": "Name" },
             { "name": "std_semester", "title": "Semester" },
             { "name": "std_gpa", "title": "GPA" },
             { "name": "std_cgpa", "title": "CGPA" },
             { "name": "status_academic", "title": "Status Academic" },
         ];
         
         let bil = 1;
         let list = [];
         $.each(data,function(i,field){
             let status_academic = "Active";
             if(field.curAcademic_type == 'With-draw'){
                 colors = `red`;
                 status_academic = field.curAcademic_type;
             }
             else if(field.curAcademic_type == 'Deferred'){
                 status_academic = field.curAcademic_type;
                 colors = `secondary`;
             }                    
             else if(field.curAcademic_type == ""){
                 colors = `green`;
             }
 
             list.push({"bil":bil++,
             "student_id":`<a href="javascript:void(0);" class="text-info" onclick="loadData('` + field.std_studentid + `',`+field.fk_acaCal+`,'`+sem+`','`+selectSession+`','`+field.pk_cur_academic+`','list_stdStanding')">`+field.std_studentid+`</a>`,
             "std_name":field.sti_name,"std_semester":field.std_semester,
             "std_gpa":field.std_gpa,"std_cgpa":field.std_cgpa,"status_academic":`<p class="text-center"><span class="label `+colors+`">`+status_academic+`<span></p>`});
         });
         
         $("#listStdStanding").footable({
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
return data.filter(item => item["curAcademic_type"] == "" && item["std_cgpa"] < 1.50 );
}

function compareByStd_intake(a, b) {
// if (a.cur_intake < b.cur_intake) {
//     return -1;
// }
// if (a.cur_intake > b.cur_intake) {
//     return 1;
// }
// return 0;
  aDate = new Date(a.cur_intake.split('-')[1], a.cur_intake.split('-')[0]);
  bDate = new Date(b.cur_intake.split('-')[1], b.cur_intake.split('-')[0]);
  if (aDate < bDate) return -1;
  if (aDate > bDate) return 1;

  return 0;
}

$("#back_page").click(function(){
    $("#viewResult").modal('hide'); 
    setTimeout(() => {
        let modal = $("#modal").val();
        $("#"+modal).modal('show');        
    }, 2000*Math.random());      

})

function loadData(student_id,cal_id,sem,selectSession,pk_cur_academic,modal){
    $("#"+modal).modal('hide');        

    setTimeout(() => {
        $('#viewResult').modal('show');
        $(".btnGenerate").prop('disabled',true);

        $("#modal").val(modal);
    
        $("#tblResult").html(`<tr><td><p class="text-center"><i class="fa fa-cog fa-spin"></i></p></td></tr>`);
    
        listByActPolicy(student_id, cal_id,selectSession,sem, function(){
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
    
            let obj = new get(host+"api_pengurusan_pelajar/public/misStdInfo/show/"+student_id,'picoms '+token).execute();
    
            if(obj.success){
                datastd = obj.data;
                
                $("#student_id").html(student_id);
                $("#name_std").html(datastd.sti_name);
                $("#noic").html('('+datastd.sti_icno+')');
                $("#programme_name").html(datastd.pgm_name);
                $("#intake_std").html('INTAKE: '+datastd.cur_intake);
                $("#sem_academic").html(' - '+selectSession.replace("/","") +'/'+ sem);
            }
    
            obj = new get(host+"api_pengurusan_pelajar/public/curAcademic/showAcaCal/"+student_id+"/"+cal_id,'picoms '+token).execute();
    
            let cgpa_dis = 0.00;
    
            if(obj.success){
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

            
            obj_regCrs.data.forEach(async (itemJ,j) => {
                
                let count_Pointer = 0;
                let counted = `<br><small class="label bg-danger">Not Counted</small>`;
                let acaSession = itemJ.acaYear;
                let acaCal = acaSession.replace('/','')+'/'+itemJ.cal_cohort;
                let catatan = "";
                let mrf = "";
                let final_exam = "checked";
                let list_lect = "";
    
                if(itemJ.ip == "checked"){
                    counted = "";
                    catatan = "<label class='label bg-warning'>In Progress</label>";
                }
    
                if(itemJ.mrf == "checked"){
                    counted = "";
                    mrf = "/MRF";
                }
                
                let selectSession = $("#semester option:selected").attr("calYear");
                let sem = $("#semester option:selected").attr("calSem");
    
                if((selectSession.replace('/','') < "20222023") || (selectSession.replace('/','') == "20222023" && sem < "3")){
                    if(itemJ.counted_cgpa == "Yes" && itemJ.ip != "checked"){
                        counted = "";
                        tCredit += (itemJ.crs_credit)*1;
                        count_Pointer = ((itemJ.point)*1) * ((itemJ.crs_credit)*1);
                        tTcp += count_Pointer;
                        tPointer += (itemJ.point)*1;
                    } 
    
                    let objLect = await new get(host + 'api_lecturer_picoms/public/misLectCrsPrm/listByCotDet/'+itemJ.fk_cotDet,'picoms ' + token).execute();
                    list_lect = "";
                    
                    if(objLect.success){
                        data_lect = objLect.data;
                        data_lect.forEach(async (uData,u) => {
                            if(u > 0){
                                list_lect += '<br>';
                            }
                            if(uData.final_exam == ""){
                                final_exam = "";
                            }
                            
                            list_lect += `<span class="text-info">
                            <a href="javascript:void(0);" onclick="load_detLectStd('`+uData.lectCrsId+`','`+itemJ.fk_course+`','`+itemJ.aca_session+`','`+itemJ.cal_cohort+`','`+itemJ.acaYear+`','`+uData.empId+`')">
                            <i class="fa fa-user"></i> ` + uData.emp_name + `</a></span>`;
                        });
                    }
        
                    let tMark = (itemJ.tMark)*1;
    
                    list.push({
                        bil: bil++, cur_year: acaCal, crs_code: '<span class="text-uppercase">'+itemJ.crsCode+' - '+itemJ.crs_name+'</span>'+counted, credit: itemJ.crs_credit,
                        // btn_lect: '<span id="lectList-'+itemJ.fk_cotDet+'"></span><textarea class="hidden" id="dataLect_'+itemJ.fk_cotDet+'"></textarea>',
                        rsb_type: `<span class="text-center">`+itemJ.rsb_type+mrf+`</span>`,
                        tMark: `<span class="text-info">`+tMark.toFixed(0)+`</span>`,
                        grade: `<span class="text-info">`+itemJ.grade+`</span>`,
                        point: `<span class="text-info">`+itemJ.point+`</span>`,
                        tcp: `<span class="text-info">`+count_Pointer.toFixed(2)+`</span>`,
                        btn_lect:list_lect,
                        remark:catatan
                    });                
                }
                else{
                    let objLect = await new get(host + 'api_lecturer_picoms/public/misLectCrsPrm/listByCotDet/'+itemJ.fk_cotDet,'picoms ' + token).execute();
                    list_lect = "";
                    
                    if(objLect.success){
                        data_lect = objLect.data;
                        data_lect.forEach(async (uData,u) => {
                            if(u > 0){
                                list_lect += '<br>';
                            }
                            if(uData.final_exam == ""){
                                final_exam = "";
                            }
                            
                            list_lect += `<span class="text-info">
                            <a href="javascript:void(0);" onclick="load_detLectStd('`+uData.lectCrsId+`','`+itemJ.fk_course+`','`+itemJ.aca_session+`','`+itemJ.cal_cohort+`','`+itemJ.acaYear+`','`+uData.empId+`')">
                            <i class="fa fa-user"></i> ` + uData.emp_name + `</a></span>`;
                        });
                    }

                    if(final_exam == "checked"){
                        if((itemJ.counted_cgpa == "Yes" && itemJ.ip != "checked" && itemJ.attendance == "Attend") || itemJ.rsb_type == "CT" ){
                            counted = "";
                            tCredit += (itemJ.crs_credit)*1;
                            count_Pointer = ((itemJ.point)*1) * ((itemJ.crs_credit)*1);
                            tTcp += count_Pointer;
                            tPointer += (itemJ.point)*1;
                        }
                        else if(itemJ.counted_cgpa == "Yes" && itemJ.ip != "checked" && itemJ.attendance != "Attend"){
                            tCredit += (itemJ.crs_credit)*1;
                            counted = "";
                        } 
            
                        let tMark = (itemJ.tMark)*1;

                        if(itemJ.attendance == "Attend" || itemJ.rsb_status == "CECT"){
                            attend = '<br><span class="label success">Attend</span>';
                            if(itemJ.rsb_status == "CECT"){
                                attend = "";
                            }
        
                            if(itemJ.rsb_type == "CE"){
                                tCredit = tCredit - (itemJ.crs_credit)*1;
                            }
        
                            list.push({
                                bil: bil++, cur_year: acaCal, crs_code: '<span class="text-uppercase">'+itemJ.crsCode+' - '+itemJ.crs_name+'</span>'+counted, credit: itemJ.crs_credit,
                                // btn_lect: '<span id="lectList-'+itemJ.fk_cotDet+'"></span><textarea class="hidden" id="dataLect_'+itemJ.fk_cotDet+'"></textarea>',
                                rsb_type: `<span class="text-center">`+itemJ.rsb_type+mrf+`</span>`,
                                tMark: `<span class="text-info">`+tMark.toFixed(0)+`</span>`,
                                grade: `<span class="text-info">`+itemJ.grade+`</span>`,
                                point: `<span class="text-info">`+itemJ.point+`</span>`,
                                tcp: `<span class="text-info">`+count_Pointer.toFixed(2)+`</span>`,
                                btn_lect:list_lect,
                                remark:catatan+attend
                            });                
                        }
                        else{
                            attend = `<br><span class="label danger">Not Attend</span>`;
                            list.push({
                                bil: bil++, cur_year: acaCal, crs_code: '<span class="text-uppercase">'+itemJ.crsCode+' - '+itemJ.crs_name+'</span>'+counted, credit: itemJ.crs_credit,
                                // btn_lect: '<span id="lectList-'+itemJ.fk_cotDet+'"></span><textarea class="hidden" id="dataLect_'+itemJ.fk_cotDet+'"></textarea>',
                                rsb_type: `<span class="text-center">`+itemJ.rsb_type+mrf+`</span>`,
                                tMark: `<span class="text-info">0.00</span>`,
                                grade: `<span class="text-info">F</span>`,
                                point: `<span class="text-info">0.00</span>`,
                                tcp: `<span class="text-info">0.00</span>`,
                                btn_lect:list_lect,
                                remark:catatan+attend
                            }); 
                        }
                    }
                    else{
                        attend = "";

                        if((itemJ.counted_cgpa == "Yes" && itemJ.ip != "checked") || itemJ.rsb_type == "CT" ){
                            counted = "";
                            tCredit += (itemJ.crs_credit)*1;
                            count_Pointer = ((itemJ.point)*1) * ((itemJ.crs_credit)*1);
                            tTcp += count_Pointer;
                            tPointer += (itemJ.point)*1;
                        }
            
                        let tMark = (itemJ.tMark)*1;
    
                        if(itemJ.rsb_type == "CE"){
                            tCredit = tCredit - (itemJ.crs_credit)*1;
                        }
    
                        list.push({
                            bil: bil++, cur_year: acaCal, crs_code: '<span class="text-uppercase">'+itemJ.crsCode+' - '+itemJ.crs_name+'</span>'+counted, credit: itemJ.crs_credit,
                            // btn_lect: '<span id="lectList-'+itemJ.fk_cotDet+'"></span><textarea class="hidden" id="dataLect_'+itemJ.fk_cotDet+'"></textarea>',
                            rsb_type: `<span class="text-center">`+itemJ.rsb_type+mrf+`</span>`,
                            tMark: `<span class="text-info">`+tMark.toFixed(0)+`</span>`,
                            grade: `<span class="text-info">`+itemJ.grade+`</span>`,
                            point: `<span class="text-info">`+itemJ.point+`</span>`,
                            tcp: `<span class="text-info">`+count_Pointer.toFixed(2)+`</span>`,
                            btn_lect:list_lect,
                            remark:catatan+attend
                        });
                    }
                }
    
                if((j+1) == obj_regCrs.data.length){
                    let gpa = parseFloat((tTcp/tCredit));
                    if(isNaN(gpa)){
                        gpa = 0.00;
                    }
                    cgpa_dis = "N/A";
    
                    if(std_semester == 1){
                        if(tTcp > 0.00){
                            // $(".btnGenerate").prop('disabled',false);
                            if (window.sessionStorage.usrRole == 'dekan' || window.sessionStorage.usrRole == 'ketuaPJ')
                            {
                                $(".btnGenerate").prop('disabled',true);
    
    
                            }
                            else{
                                $(".btnGenerate").prop('disabled',false);
                            }
                        }
                        
                        cgpa_dis = gpa.toFixed(4);
    
                        if(cgpa_dis.substring(5,6) == "0"){
                            cgpa_dis = Number(gpa) + 0.0001;
                            gpa = Number(gpa) + 0.0001;
                            cgpa_dis = cgpa_dis.toFixed(2);                                                
                        }
                        else{
                            cgpa_dis = Number(cgpa_dis);                                                
                            cgpa_dis = cgpa_dis.toFixed(2); 
                        }                                              
    
                        // cgpa_dis = gpa;
                    }
                    else{
                        // if(tTcp > 0.00){
                            // $(".btnGenerate").prop('disabled',false);
                            if (window.sessionStorage.usrRole == 'dekan' || window.sessionStorage.usrRole == 'ketuaPJ')
                            {
                                $(".btnGenerate").prop('disabled',true);
    
    
                            }
                            else{
                                $(".btnGenerate").prop('disabled',false);
                            }
                            let objCGPA = await new get(host + 'api_pengurusan_pelajar/public/curAcademic/cgpa/'+student_id+'/'+pk_cur_academic+'/'+std_semester,'picoms '+token).execute();
                            // console.log(objCGPA)
                            // cgpa_dis = 0.00;
                            if(objCGPA.success){
                                let dataCGPA = objCGPA.data;
    
                                sumTC = (dataCGPA.sumTC)*1;
                                sumTGP = (dataCGPA.sumTGP)*1;
    
                                sumTC += tCredit;
                                sumTGP += tTcp;
    
                                cgpa_dis = (sumTGP/sumTC);
    
                                cgpa_dis = cgpa_dis.toFixed(4);
                                
                                // console.log(cgpa_dis);
                                // console.log(cgpa_dis.substring(5,6))
    
                                if(cgpa_dis.substring(5,6) == "0"){
                                    cgpa_dis = Number(cgpa_dis) + 0.0001;
                                    cgpa_dis = cgpa_dis.toFixed(2);                                                
                                }
                                else{
                                    cgpa_dis = Number(cgpa_dis);                                                
                                    cgpa_dis = cgpa_dis.toFixed(2); 
                                }
    
                                // console.log(cgpa_dis)
    
        
                            }
                            else{
                                swal("Not Found Previous CGPA","check previous semester result","warning");
                                cgpa_dis = gpa.toFixed(4);
    
                                if(cgpa_dis.substring(5,6) == "0"){
                                    cgpa_dis = Number(gpa) + 0.0001;
                                    gpa = Number(gpa) + 0.0001;
                                    cgpa_dis = cgpa_dis.toFixed(2);                                                
                                }
                                else{
                                    cgpa_dis = gpa.toFixed(2);                                                
                                }                             
                            }
                            
                        // }
                        // else{
                        //     $(".btnGenerate").prop('disabled',true);
                        // }                   
                    }
    
                    list.push({bil:"",cur_year:"",crs_code:"",credit:'<b id="tc_point">'+tCredit.toFixed(2)+'</b>',tMark:"",grade:"",point:'<b id="tcp_point">'+tPointer.toFixed(2)+'</b>',
                    tcp:'<b id="tgp_point">'+tTcp.toFixed(2)+'</b>'});
                    list.push({bil:"",cur_year:"",crs_code:"",credit:"",tMark:"",grade:"",point:"<p class='text-right'><b>GPA</b></p>",
                    tcp:"<p><b id='gpa_point'>"+gpa.toFixed(2)+"</b></p>",btn_lect:"<p>CGPA : <b class='cgpa_point'>"+cgpa_dis+"</b></p>"});
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
        });
    }, 2000*Math.random());

    
}

function load_detLectStd(lectCrsId,fk_course,aca_session,cal_cohort,acaYear,lectId){

    window.sessionStorage.lectCrsId = lectCrsId;
    window.sessionStorage.pk_crs = fk_course;
    window.sessionStorage.fk_aca_cal = aca_session;
    window.sessionStorage.lect_coor = "No";
    window.sessionStorage.cal_cohort = cal_cohort;
    window.sessionStorage.prevPage = "adminPage";
    window.sessionStorage.yearTaken = acaYear;
    window.sessionStorage.lectId = lectId;

    let fac_id = $('#faculty').val();
    let pgmSession = $('#semester').val();

    window.sessionStorage.pgmSession = pgmSession;
    window.sessionStorage.fac_id = fac_id;

    window.location.replace('detLectCrsStudent.html');

}

function listByActPolicy(std, acaCal,selectSession,sem, returnValue){
    var form = new FormData();
    form.append("std_studentid", std);
    form.append("aca_session", acaCal);
    form.append("cal_cohort", sem);
    form.append("cur_year", selectSession);

    var settings = {
        "url": host + "api_pengurusan_pelajar/public/misStdRegsub/listByActPolicy5",
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
        obj_regCrs = JSON.parse(response);
        returnValue();
    });
}