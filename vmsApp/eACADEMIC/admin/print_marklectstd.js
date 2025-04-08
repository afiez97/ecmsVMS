$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let id = window.sessionStorage.lectCrsId;
    let usrId = window.sessionStorage.usrId;
    usrId = usrId.toUpperCase();
    let lectId = window.sessionStorage.lectId;
    lectId = lectId.toUpperCase();
    let yearTaken = window.sessionStorage.yearTaken;
    let cal_cohort = window.sessionStorage.cal_cohort;
    let fk_aca_cal = window.sessionStorage.fk_aca_cal;

    let crsCode = "";
    var fixtimeDate = (new Date().toLocaleString()).split(', ');
    var fixTD = fixtimeDate[1] + ', ' + fixtimeDate[0];    let token = window.sessionStorage.token;
    var doc = new jsPDF("landscape");

    if(token == null){
        window.close();
    }
    else{
        $("#loading_mode").modal('show');

        setTimeout(() => {
            let obj = new get(host+"api_lecturer_picoms/public/misLectCrsPrm/show/"+id,'picoms '+token).execute();
            if(obj.success){
                let data = obj.data;

                crsCode = data.crsCode;

         
                
                // landscape
                doc.setFontSize(7);
                doc.setFont("helvetica", "normal");
                doc.text(fixTD, 268, 3);
                
                doc.setFontSize(8);
                doc.setFont("helvetica", "normal");
                doc.text('Lecturer : '+data.emp_name.toUpperCase(), 14, 10);            
                doc.text('Course : '+data.crs_name + ' ( ' + data.crsCode + ' )', 14, 15);            
                doc.text('Academic Session : '+ yearTaken.replace('/','')+'/'+cal_cohort, 150, 15);            
                // doc.text('Faculty : '+data.fac_name.toUpperCase(), 150, 10);            
                
                arr = [];
                                
                var form = new FormData();
                form.append("input", data.fk_course);
                obj = new post(host+"api_tetapan_picoms/public/misPrmGredScheme/checkName",form,'picoms '+token).execute();
                let gsc_id = obj.data[0].gsc_id;
    
                obj = new get(host+"api_tetapan_picoms/public/misPrmDetGredScheme/listByGS/"+gsc_id,'picoms '+token).execute();
                let columns = [ 'No.','Student ID', 'Name'];
                let formative = 0;
                let summative = 0;

                count_formative = 0;
                count_summative = 0;
    
                if(obj.success){
                    data_grd = obj.data;
                    data_grd.forEach(async (item,i) => {
                        
                        if( item.gsd_component == 'Final Assessment' ){ gsdType = 'Final' }
                        else if( item.gsd_component == 'Continuous Assessment' ){ gsdType = 'Continuous' }
    
                        //add columns mark
                        if(item.gsd_component == "Continuous Assessment"){
                            formative += item.gsd_percentage;
                        }
                        else if( item.gsd_component == 'Final Assessment' ){
                            if(summative == 0){
                                columns.push('Carry Mark ('+formative+'%)');
                            }
                            summative += item.gsd_percentage;
                            count_summative = 0;
                        }
    
                        columns.push(item.examTypeName+' ('+item.gsd_percentage+'%)');   
                        
                        if((i+1) == data_grd.length && summative == 0){
                            columns.push('Carry Mark ('+formative+'%)');
                        }                        
                    });
    
                    columns.push('Total Mark (100%)','Grade','Grade Point');
                } 
                
                let dataColumns = [];
                columns.forEach(async (item) => {
                    dataColumns.push({"text":item});
                });

                arr.push(dataColumns);
    console.log(dataColumns);
                var form = new FormData();
                form.append("aca_session", fk_aca_cal);
                form.append("crs_code", data.fk_course);
                obj = new post(host+"api_pengurusan_pelajar/public/misStdRegsub/listByAcaCalCrs",form,'picoms '+token).execute();

                let pgmCode = getUrlVars()['pgmCode'];

                let rows = [];
                if(obj.success){
                    dataStd = obj.data;
                    let bil = 1;
                    
                    async function doSomethingAsync(item) {
                        return new Promise(resolve => {
                            setTimeout(() => {
                                $("#load_text").html(item);
                                resolve();
                            }, Math.random() * 1000);
                        });
                    }
                    
                    async function main() {

                        if(pgmCode != undefined){
                            let filterConditions = {
                                pgmCode: pgmCode,
                            };

                            let formPgm = new FormData();
                            formPgm.append('input',pgmCode);
                            let obj_pgm = await new post(host+'api_tetapan_picoms/public/misPrmProg/progCodeChecking',formPgm,'picoms '+token).execute();
                            if(obj_pgm.success){
                                doc.text(obj_pgm.data[0].pgm_name.toUpperCase(), 14, 25);  
                                doc.text('Faculty : '+obj_pgm.data[0].fac_name.toUpperCase(), 150, 10);            

                            }
                        
                            dataStd = filterData(dataStd, filterConditions);
                        }


                        await Promise.all(
                            dataStd.map(async (itemj,i) => {                                
                                let data_stdCrs = [bil++,itemj.std_id,itemj.sti_name];
                                if(itemj.mark_generate != null){
                                    let mark_generate = JSON.parse(itemj.mark_generate);
                                    mark_generate = Object.values(mark_generate);
                                    console.log(mark_generate);
                                    await mark_generate.forEach((val,f) => {
                                        if(f > 1){
                                            // if((val != 0 || val != 0.00) && Object.values(mark_generate).length > 5){
                                            //     data_stdCrs.push(val);
                                            // }
                                            data_stdCrs.push(val);

                                        }
                                    })
                                }
                                
                                
                                rows.push(data_stdCrs);

        
                                let datarows = [];
                                data_stdCrs.forEach(async (item) => {
                                    datarows.push({"text":item});
                                });
                                arr.push(datarows);

                                await doSomethingAsync(itemj.std_id+'  '+itemj.sti_name+'...');
                                
                            })
                        );
                        
                        setTimeout(function() {

                            // console.log(rows);
                        
                            $("#btnExcel").click(function(){
                                
                                var tableData = [
                                    {
                                        "sheetName": "Sheet1",
                                        "data": arr
                                    }
                                ];
                                var options = {
                                    fileName: yearTaken.replace('/','')+'_'+cal_cohort + ' - ' + crsCode
                                };
                                Jhxlsx.export(tableData, options);
                            });                        
                            
    
                            doc.autoTable({
                                // startX: 20,
                                startY: 27,
                                head: [columns],
                                body: rows,
                                styles: {fontSize:9}
                              });
                            PDFObject.embed(doc.output("datauristring"), "#preview-pdf"); 
                            
                            $("#loading_mode").modal('hide');
        
                        }, Math.random() * 1000); 
                    }

                    main();  

                }
    
            }
            else{
                window.close();
            }             
        }, Math.random()*1000);
    }

});

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