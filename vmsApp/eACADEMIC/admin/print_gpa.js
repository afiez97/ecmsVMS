$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let token = window.sessionStorage.token;
    var doc = new jsPDF("landscape");

    var contDoc = new jsPDF(); 
    let columnCont = ['No.',"Intake","Semester","Students","Status","CGPA"]; 

    var fixtimeDate = (new Date().toLocaleString()).split(', ');
    var fixTD = fixtimeDate[1]+ ', '+fixtimeDate[0];
    // alert(fixTD);

    if(token == null){
        window.close();
    }
    else{
        $("#loading_mode").modal('show');

        let clg_id = window.sessionStorage.idPage;
        let token = window.sessionStorage.token;
    
        let cal_cohort = window.sessionStorage.cal_cohort;
        let cur_year = window.sessionStorage.cur_year;
        let pgm_fk = window.sessionStorage.pgm_fk;
        let pgm_name = "";
        let pgm_id = "";
    
        let objPgm = new get(host+"api_tetapan_picoms/public/misPrmProg/show/"+pgm_fk,'picoms '+token).execute();
    
        if(objPgm.success == 'true'){
            let data = objPgm.data;
            pgm_id = data.pgm_id;

            doc.setFontSize(7);
            doc.setFont("helvetica", "normal");  
            doc.text(fixTD, 268, 3); 


            contDoc.setFontSize(7);
            contDoc.setFont("helvetica", "normal");  
            contDoc.text(fixTD, 182, 3); 


            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");  
            doc.text('Academic Session : '+ cur_year.replace('/','')+'/'+cal_cohort, 14, 20);            
            doc.text('Faculty : '+data.fac_name.toUpperCase(), 14, 10);            
            doc.text('Programme : '+data.pgm_name.toUpperCase(), 14, 15); 

            contDoc.setFontSize(8);
            contDoc.setFont("helvetica", "normal");                       
            contDoc.text('Academic Session : '+ cur_year.replace('/','')+'/'+cal_cohort, 14, 20);            
            contDoc.text('Faculty : '+data.fac_name.toUpperCase(), 14, 10);            
            contDoc.text('Programme : '+data.pgm_name.toUpperCase(), 14, 15); 
            pgm_name = data.pgm_name.toUpperCase();
        }

        var gs = 0, cs = 0, f = 0,std_more = 0, std_less = 0;
        var num1 = 0, num2 = 0, num3 = 0, num4 = 0, num5 = 0, num6 = 0, num7 = 0;
        var numc1 = 0, numc2 = 0, numc3 = 0, numc4 = 0, numc5 = 0, numc6 = 0, numc7 = 0;
        let stat_gpa = [];
        let stat_cgpa = [];        
    
        let form = new FormData();
        form.append('cal_cohort',cal_cohort);
        form.append('cur_year',cur_year);
        form.append('pgm_fk',pgm_fk);
        
        let obj = new post(host+"api_pengurusan_pelajar/public/curAcademic/acSummary",form,'picoms '+token).execute();
        let rows = [];
        let arr = [];

        if(obj.success){
            let data = obj.data;
            let dataStd = data;
            let columns = [ 'No.','Student ID', 'Name','Semester','Subject', 'GPA', 'CGPA'];

            let dataColumns = [];
            columns.forEach(async (item) => {
                dataColumns.push({"text":item});
            });

            arr.push(dataColumns);

            async function doSomethingAsync(item) {
                return new Promise(resolve => {
                    setTimeout(() => {
                        $("#load_text").html(item);
                        resolve();
                    }, Math.random() * 1000);
                });
            }
            
            async function main(){
                await Promise.all(
                    data.map(async (item,i) =>{
                        var form = new FormData();
                        form.append("std_studentid", item.std_studentid);
                        form.append("aca_session", item.fk_acaCal);

                        cgpa = (item.std_cgpa)*1;
                        gpa = (item.std_gpa)*1;
                        
                        //GPA
                        if(gpa >= 2.00){
                            std_more++;
                        }
                        else{
                            std_less++;
                        }
    
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
    
                        if(item.std_cgpa == null){
                            dis_cgpa = "N/A";
                        }                        

                        await doSomethingAsync(item.std_studentid + '-' + item.sti_name);
        
                        let obj = await new post(host + "api_pengurusan_pelajar/public/misStdRegsub/listByActPolicy",form,'picoms ' + token).execute();
                        let subject = "";
        
                        if (obj.success) {
                            dataCrs = obj.data;
                            $.each(dataCrs, function (o, crs) {
                                grade = crs.grade;
                                if (grade == "undefined") {
                                    grade = " ";
                                }
                                subject += "" + crs.crsCode + " : " + grade;
                        
                                // Check if it's not the last item
                                if (o < dataCrs.length - 1) {
                                    subject += ", ";
                                }
                        
                                // Check if the current index is a multiple of 3 and not the last item
                                if (o < dataCrs.length - 1 && (o + 1) % 3 === 0) {
                                    subject += "\n"; // Add a line break after every three items
                                }
                            });
                        }
                        
                        
                        rows.push({
                            std_studentid:item.std_studentid,
                            sti_name:item.sti_name,
                            std_semester:item.std_semester,
                            subject:subject,
                            std_gpa:item.std_gpa,
                            std_cgpa:item.std_cgpa});               
                    })
                )

                rows.sort(compareByStd_id);
                    // console.log(rows)
                let bil =1;
                let rowsData = [];
                rows.forEach(async(item) =>{
                    
                    let data_stdCrs = [bil,item.std_studentid,item.sti_name,item.std_semester,item.subject,item.std_gpa,item.std_cgpa];
                    rowsData.push(data_stdCrs);
                    let datarows = [];
                    data_stdCrs.forEach(async (item) => {
                        // console.log(item)
                        datarows.push({"text":item});
                    });
                    arr.push(datarows);
                    bil++; 
                });

                doc.autoTable({
                    // startX: 20,
                    startY: 25,
                    head: [columns],
                    body: rowsData,
                    styles: {fontSize:9}
                });

                //create_chart

                stat_gpa = [num1,num2,num3,num4,num5,num6,num7];
                stat_cgpa = [numc1,numc2,numc3,numc4,numc5,numc6,numc7];

                let dom = document.getElementById('chartContainer');
                let myChart = echarts.init(dom);
                var option = {
                    tooltip : {
                        trigger: 'item'
                    },
                    grid: {
                        borderWidth: 0
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
                
                //end create chart

                //create conditional standing

                let objCont = new post(host+'api_pengurusan_pelajar/public/curAcademic/student/contPgm',form,'picoms '+token).execute();
                if(objCont.success){
                    data = objCont.data;
                    let semester = "";
                    let num = 1;
                    let total_std = 0;
                    let dataCont =[];
                    let data_intake = [];
                    let check_postGrad = postGrade.indexOf(pgm_id);                    
                    console.log(check_postGrad)
                    data.forEach(async (item,i) => {
                        
                        if(semester != item.cur_intake+"-"+item.std_semester){

                            let filterConditions = {
                                cur_intake: item.cur_intake,
                                std_semester: item.std_semester 
                            };

                            if(i != 0){
                                let data_rowCont = [{
                                    content: "TOTAL INTAKE",
                                    colSpan: 3,
                                },data_intake.length,{
                                    content: "", colSpan: 2
                                }];
                                dataCont.push(data_rowCont);

                                // $("#list_standing").append(`
                                // <tr class="text-white grey-500"><td colspan="3"><b>TOTAL INTAKE</b></td><td class="text-center"><b>`+data_intake.length+`</b></td><td colspan="2"></td></tr>`);
                            }
                            
                            data_intake = filterData(dataStd, filterConditions);
                            if(check_postGrad !== -1){
                                good_standing = filterGoodPass(data_intake);
                                status_list = "GOOD PASS";
                                text_info = 'CGPA >= 3.00<br>(CGPA of 3.00 and above)';
                            }
                            else{
                                good_standing = filterGoodStanding(data_intake);
                                status_list = "GOOD STANDING";
                                text_info = 'CGPA >= 2.00<br>(CGPA of 2.00 and above)';                                
                            }
                            let data_rowCont = [num,item.cur_intake,item.std_semester,good_standing.length,status_list,text_info];
                            dataCont.push(data_rowCont);

                            // $("#list_standing").append(`<tr>
                            // <td>`+num+`</td><td>`+item.cur_intake+`</td><td class="text-center">`+item.std_semester+`</td>
                            // <td class="text-center">
                            // <b class="text-info">
                            // <a onclick="load_stdPgm(`+item.std_semester+`,'`+item.cur_intake+`','GOOD STANDING')" href="javascript:void(0);">`+good_standing.length+`</a>
                            // </b>
                            // </td><td><i>GOOD STANDING</i></td><td>CGPA >= 2.00<br>(CGPA of 2.00 and above)</td>
                            // </tr>`);
                            num++;
                            semester = item.cur_intake+"-"+item.std_semester;
                            total_std += (item.total)*1;

                            for(num_loop = 1; num_loop < 3 ; num_loop++){
                                if(num_loop == 1){
                                    if(check_postGrad !== -1){
                                        list_standing = filterContPass(data_intake);
                                        // console.log("CONT STANDING : "+JSON.stringify(list_standing));
    
                                        status_list = "CONDITIONAL PASS";
                                        text_info = '3.00 > CGPA >= 2.50<br>(CGPA of 2.50 to 3.00)';
                                    }
                                    else{
                                        list_standing = filterContStanding(data_intake);
                                        // console.log("CONT STANDING : "+JSON.stringify(list_standing));
    
                                        status_list = "CONDITIONAL STANDING";
                                        text_info = '2.00 > CGPA >= 1.50<br>(CGPA of 1.51 to 1.99)';

                                    }
                                }
                                else{
                                    if(check_postGrad !== -1){
                                        list_standing = filterFail(data_intake);
                                        // console.log("FAILED : "+JSON.stringify(list_standing));
    
                                        status_list = "FAIL";
                                        text_info = 'CGPA <= 2.50<br>(CGPA of 2.50 and below)';
                                    }
                                    else{
                                        list_standing = filterFailed(data_intake);
                                        // console.log("FAILED : "+JSON.stringify(list_standing));
    
                                        status_list = "FAILED";
                                        text_info = 'CGPA <= 1.50<br>(CGPA of 1.50 and below)';

                                    }
                                }

                                let data_rowCont = ['','',item.std_semester,list_standing.length,status_list,text_info];
                                dataCont.push(data_rowCont);                                

                                // $("#list_standing").append(`<tr>
                                // <td></td><td></td><td class="text-center">`+item.std_semester+`</td>
                                // <td class="text-center">
                                // <b class="text-info">
                                // <a onclick="load_stdPgm(`+item.std_semester+`,'`+item.cur_intake+`','`+status_list+`')" href="javascript:void(0);">`+list_standing.length+`</a>
                                // </b>
                                // </td><td><i>`+status_list+`</i></td><td>`+text_info+`</td>
                                // </tr>`);
                            }
                        }
                    });

                    let data_rowCont = [{
                        content: "TOTAL INTAKE",
                        colSpan: 3,
                    },data_intake.length,{
                        content: "", colSpan: 2
                    }];
                    dataCont.push(data_rowCont); 

                    data_rowCont = [{
                        content: "TOTAL",
                        colSpan: 3,
                    },dataStd.length,{
                        content: "", colSpan: 2
                    }];
                    dataCont.push(data_rowCont); 
                    // $("#list_standing").append(`
                    //     <tr class="text-white grey-500"><td colspan="3"><b>TOTAL INTAKE</b></td><td class="text-center"><b>`+data_intake.length+`</b></td><td colspan="2"></td></tr>
                    // `);

                    // $(".total_std").html(dataStd.length);

                    contDoc.autoTable({
                        // startX: 20,
                        startY: 25,
                        head: [columnCont],
                        body: dataCont,
                        styles: {fontSize:9}
                    });                    
                }
                
                
                setTimeout(() => {
                    $("#btnExcel").click(function(){
                                    
                        var tableData = [
                            {
                                "sheetName": "Sheet1",
                                "data": arr
                            }
                        ];
                        var options = {
                            fileName: cur_year.replace('/','')+'_'+cal_cohort + '-CGPA-' + pgm_name
                        };
                        Jhxlsx.export(tableData, options);
                    });

                    $("#btnPdf").click(function(){
                        var chartDataURL = myChart.getDataURL({
                            type: 'png', // You can change the type to 'jpeg' or 'svg' if needed
                            pixelRatio: 2, // You can adjust the pixel ratio as needed
                            backgroundColor: '#fff' // Set the background color
                        });
        
                        contDoc.addPage();
            
                        contDoc.addImage(chartDataURL,'PNG',14,10);

                        doc.save(cur_year.replace('/','')+'_'+cal_cohort + '-CGPA-' + pgm_name+".pdf");
                        contDoc.save(cur_year.replace('/','')+'_'+cal_cohort + '-Standing-' + pgm_name+".pdf");
                    });

                    PDFObject.embed(doc.output("datauristring"), "#preview-pdf"); 
                    PDFObject.embed(contDoc.output("datauristring"), "#previewStanding-pdf"); 
                    
                    $("#loading_mode").modal('hide');                
                }, Math.random() * 1000);
            }

            main();
        }        
    }   

});

function compareByStd_id(a, b) {
    if (a.std_studentid < b.std_studentid) {
      return -1;
    }
    if (a.std_studentid > b.std_studentid) {
      return 1;
    }
    return 0;
  }

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
    return data.filter(item => item["std_cgpa"] == null || item["std_cgpa"] < 1.50 );
  } 

  function filterGoodPass(data) {
    return data.filter(item => item["std_cgpa"] >= 3.0);
  }

  function filterContPass(data) {
    return data.filter(item => item["std_cgpa"] < 3.0 && item['std_cgpa'] >= 2.50);
  }

  function filterFail(data) {
    return data.filter(item => item["std_cgpa"] == null || item["std_cgpa"] < 2.50 );
  } 