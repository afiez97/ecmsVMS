var confirmed = false;
var listStd = [];
var data_load = [];


$(function(){
    $.ajaxSetup ({
        cache: false
    });
    $("#loading_modal").modal("show");

    let usrId = window.sessionStorage.usrId;
    let usrName = window.sessionStorage.usrName;
    let catAdmin = window.sessionStorage.usrCatEadmin;
    let catCMS = window.sessionStorage.usrCatEcmis;
    let token = window.sessionStorage.token;
    // window.sessionStorage.content = "";
    window.sessionStorage.removeItem("content");
    window.sessionStorage.content = "campusPage";
    

    let getSession = window.sessionStorage.getSession;

    window.sessionStorage.removeItem("lectCrsId");
    window.sessionStorage.removeItem("pk_crs");
    window.sessionStorage.removeItem("fk_aca_cal");
    window.sessionStorage.removeItem("lect_coor");
    window.sessionStorage.removeItem("cal_cohort");
    window.sessionStorage.removeItem("prevPage");
    window.sessionStorage.removeItem("yearTaken");
    window.sessionStorage.removeItem("lectId");
    window.sessionStorage.removeItem("accessID");

    $('#usrName').html(usrName);

    // if( catAdmin == 1 ){
    //     $('.btnSttng').show();
    // }
    // else if( catCMS == 1 ){
    //     $('.btnSttng').hide();
    //     $('.btnEsenat').hide();

    //     // get employer position
    //     listEmpPosition(usrId, function(){
    //         // console.log(obj_empPosition.data);
    //         let count = obj_empPosition.success;
    //         if(count){
    //             let item = obj_empPosition.data;
    //             let position = item.Pos_Id;
    //                 window.sessionStorage.empPosition = position;
                    
    //                 // if(dekan.indexOf(position) == 1){
    //                 //     window.sessionStorage.usrRole = 'dekan' ;
    //                 //     $('.btnEsenat').show();
    //                 //     console.log('dekan');

    //                 // }
    //                 // else if(position == "HOP"){
    //                 //     window.sessionStorage.usrRole = 'ketuaPJ' ;
    //                 //     $('.btnEsenat').show();
    //                 // }
    //                 // else if(pensyarah.indexOf(position) == 1){
    //                 //     window.sessionStorage.usrRole = 'pensyarah' 

    //                 // }
    //                 // else if(instrutor.indexOf(position) == 1){
    //                 //     window.sessionStorage.usrRole = 'instrutor' 

    //                 // }
    //                 // else if(anr.indexOf(position) == 1){
    //                 //     window.sessionStorage.usrRole = 'anr' 

    //                 // }
    //                 if (dekan.indexOf(position) !== -1) {
    //                     window.sessionStorage.usrRole = 'dekan';
    //                     $('.btnEsenat').show();
    //                 } else if (ketuaPJ.indexOf(position) !== -1) {
    //                     window.sessionStorage.usrRole = 'ketuaPJ';
    //                     $('.btnEsenat').show();
    //                 } else if (pensyarah.indexOf(position) !== -1) {
    //                     window.sessionStorage.usrRole = 'pensyarah';
    //                 } else if (instrutor.indexOf(position) !== -1) {
    //                     window.sessionStorage.usrRole = 'instrutor';
    //                 } else if (anr.indexOf(position) !== -1) {
    //                     window.sessionStorage.usrRole = 'anr';
    //                 }
    //                 // console.log(window.sessionStorage.usrRole);

    //         }
    //     });
    // }

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

    // Campus List
    campusList(function(){
        $("#campus_select").html('<option value="">- Campus -</option>');
        if(obj_college.success){
            let colum_row = 'col-md-2';
            
            // if(obj_college.data.length > 3){
            //     colum_row = 'col-sm-3';
            // }
            $.each(obj_college.data, function (i, item){
                $('#div_dashboard').append('<div class="'+colum_row+'">'+
                                                '<a onclick="loadPage(\'' + item.pk_id + '\')">'+
                                                    '<div class="box">'+
                                                        '<div class="box-header text-center"><h3><b>'+item.clg_name+'</b></h3></div>'+
                                                        '<div class="box-body text-center p-b-md">'+
                                                            '<i class="fa fa-university fa-3x text-info"></i><hr>'+
                                                            '<small>'+item.clg_address2+' '+item.clg_address3+'</small>'+
                                                        '</div>'+
                                                    '</div>'+
                                                '</a>'+
                                            '</div>');
                
                $("#campus_select").append('<option value="' + item.pk_id + '">'+item.clg_name+'</option>');
            });
            $("#loading_modal").modal("hide");
        }
        else{
            logOut();
        }
    });

    $("#search_form").on('submit',function(e){
        if(!confirmed){
            e.preventDefault();
            
            load_search(token);
        }
    }); 

    // console.log(getSession)
    if(getSession != undefined){
        $("#campus").prop('class','collapse');
        $("#senat").prop('class','collapse in');

        setTimeout(() => {
            load_search(token);

            window.sessionStorage.removeItem("getSession");
        }, Math.random()*1000);
    }
     
});

function load_search(token){
    $("#loading_mode").modal('show');
    let fk_acaCal = $("#semester option:selected").attr('value');
    let selectSession = $("#semester option:selected").attr("calYear");
    let sem = $("#semester option:selected").attr("calSem");

    $("#fac_name").html($('#faculty option:selected').attr('fac_name'));
    $(".aca_session_dis").html(selectSession.replace('/','') + '/' + sem);

    let form = new FormData();
    form.append('cal_cohort',sem);
    form.append('cur_year',selectSession);

    let objStd = new post(host+'api_pengurusan_pelajar/public/curAcademic/student/senat',form,'picoms '+token).execute();

    if(objStd.success){
        let data = objStd.data;
        let dataStd = data;
        data_load = data;

        var gs = 0, cs = 0, f = 0,active_std = 0, deferred_std = 0, withdraw_std = 0,gpa_gs = 0, gpa_cs = 0, gpa_f = 0;
        var num1 = 0, num2 = 0, num3 = 0, num4 = 0, num5 = 0, num6 = 0, num7 = 0;
        var numc1 = 0, numc2 = 0, numc3 = 0, numc4 = 0, numc5 = 0, numc6 = 0, numc7 = 0;
        let stat_gpa = [];
        let stat_cgpa = [];

        let list_stdFac = [];

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
            let fac_tag = "";
            let total_facstd = 0;
            let itemlist = [];
            let data_intake = [];
            // let list_disabled = [5,7,8,11,12,13];
            let list_disabled = ['Deferred','With-draw'];

            await Promise.all(
                data.map(async (item, i) => {
                    if(i == 0){
                        $("#cal_intake").html(item.cal_intake);
                        $("#semester_intake").html(item.cal_cohort);
                    }
                    
                    if(fac_tag != "fac_"+item.fac_id){
                        if(fac_tag != ""){
                            list_stdFac[fac_tag] = itemlist;
                            itemlist = [];
                        }

                        fac_tag = "fac_"+item.fac_id;
                        sumStd = 1;
                        total_facstd++;
                        itemlist.push(item);

                    }
                    else{
                        sumStd++;
                        total_facstd++;
                        itemlist.push(item);
                    }

                    if(i == (data.length-1)){
                        list_stdFac[fac_tag] = itemlist;
                    }
    
                    cgpa = (item.std_cgpa)*1;
                    gpa = (item.std_gpa)*1;
                    
                    // if(item.status_academic == 7){
                    //     withdraw_std++;
                    // }
                    // else if(item.status_academic == 10){
                    //     deferred_std++;
                    // }                    
                    // else if(item.curAcademic_type == "" && list_disabled.indexOf(item.status_academic) == -1){
                    //     active_std++;
                    // } 
                    
                    if(item.curAcademic_type == 'With-draw'){
                        withdraw_std++;
                    }
                    else if(item.curAcademic_type == 'Deferred'){
                        deferred_std++;
                    }                    
                    else if(item.curAcademic_type == ""){
                        active_std++;
                    } 

                    //GPA
                    if(gpa < 1.00 && list_disabled.indexOf(item.curAcademic_type) == -1){
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

                    //GPA
                    if(gpa >= 2.00){
                        gpa_gs++;
                    }
                    else if(gpa < 2.00 && gpa > 1.50){
                        gpa_cs++;
                    }
                    else if(gpa <= 1.50 && list_disabled.indexOf(item.curAcademic_type) == -1){
                        gpa_f++;
                    }
        
                    //CGPA
                    if(cgpa >= 2.00){
                        gs++;
                    }
                    else if(cgpa < 2.00 && cgpa > 1.50){
                        cs++;
                    }
                    else if(cgpa <= 1.50 && list_disabled.indexOf(item.curAcademic_type) == -1){
                        f++;
                    }

                    if(cgpa < 1.00 && list_disabled.indexOf(item.curAcademic_type) == -1){
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

                $("#total_pgmStd").html(total_facstd);
                
                $("#total_gs").html(gs);
                $("#total_cs").html(cs);
                $("#total_f").html(f);

                $("#good_std").html(gpa_gs);
                $("#con_std").html(gpa_cs);
                $("#failed_std").html(gpa_f);

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
                
                let objFac = new get(host+'api_tetapan_picoms/public/misPrmFaculty/list','picoms '+token).execute();
                $("#list_pgm").html('');
                if(objFac.success){  
                    listStd = list_stdFac;     
                    $.each(objFac.data,function(u,itemFac){
                        
                        let total_std = 0;
                        let stdList = list_stdFac['fac_'+itemFac.pk_id];

                        if(stdList != undefined){
                            total_std = stdList.length;
                        }

                        $("#list_pgm").append('<tr><td><a class="btn btn-sm btn-success" onclick="exam_fac(\''+itemFac.pk_id+'\')" href="javascript:void(0);">'+itemFac.fac_id+' >></a></td><td>'
                        +itemFac.fac_name+'</td><td class="text-center"><a class="btn btn-sm  btn_loadStd" onclick="load_stdPgm(\'fac_'+itemFac.pk_id+'\',\''+itemFac.fac_name+'\')">'+total_std+'</a></td></tr>');
                    });
                }

                let form = new FormData();
                form.append('cal_cohort',sem);
                form.append('cur_year',selectSession);
                
                let objCont = new post(host+'api_pengurusan_pelajar/public/curAcademic/student/contResult',form,'picoms '+token).execute();
                if(objCont.success){
                    data = objCont.data;
                    let semester = "";
                    let num = 1;
                    let total_std = 0;
                    let total_intake = 0;
                    $("#list_standing").html('');

                    data.forEach(async (item,i) => {

                        if(semester != item.cur_intake){
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
                            // console.log("good_standing: "+JSON.stringify(good_standing));
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
                }
                
            }, Math.random() * 1000);
        }                 

        main();
        
    }
    else{
        $("#load_text").html("Loading...");
        $("#loading_mode").modal("hide"); 
        swal('No Data Found!',$('#faculty option:selected').attr('fac_name'),'warning');
        setTimeout(() => {
            window.location.reload();
        }, Math.random()*1000);
    }

    // $("#loading_mode").modal('hide');    
}

function exam_fac(fac_id){
    let fk_acaCal = $("#semester option:selected").attr('value');
    let cam_id = $("#campus_select").val();
    if(cam_id != ""){
        window.sessionStorage.idPage = cam_id;
        window.sessionStorage.fac_id = fac_id;
        window.sessionStorage.pgmSession = fk_acaCal;
        window.sessionStorage.content = "exam_releaseResult";
        window.location.replace('adminPage.html');
    }
    else{
        $("#campus_select").focus();
        swal("Campus Not Defined","Please select campus to view detail based on faculty","warning");
    }
}

function load_stdPgm(pgm_tag,name_pgm){
    let data = listStd[pgm_tag];
    $("#listStdPgm").html('');
    $("#name_pgm").html(name_pgm);

    ///////////////////


    // capaianSenat = load_capaian();
    load_capaian();
    capaianSenat = window.capaianData;
    console.log(capaianSenat);
    let addSenat = capaianSenat[0];
    let uptSenat = capaianSenat[1];
    let delSenat = capaianSenat[2];

    // console.log(addCot);
    // console.log(uptCot);
    // console.log(delCot);

    if (addSenat == 0){
        SenatAddDisabled = 'disabled';
    }
    else{
        SenatAddDisabled = ''; 
    }

    if (uptSenat == 0){
        SenatUpdateDisabled = 'disabled';
    }
    else{
        SenatUpdateDisabled = ''; 
    }


    if (delSenat == 0){
        SenatDelDisabled = 'disabled';
    }
    else{
        SenatDelDisabled = ''; 
    }

    ///////////////
    if(data.length > 0){
        let columns = [
            { "name": "bil", "title": "No.", "breakpoints": "md sm xs"  },
            { "name": "student_id", "title": "Student Id" },
            { "name": "std_name", "title": "Name" },
            { "name": "std_semester", "title": "Semester" },
            { "name": "std_gpa", "title": "GPA" },
            { "name": "std_cgpa", "title": "CGPA" },
            { "name": "status_academic", "title": "Status Academic" },
            { "name": "status_release", "title": "Release" },
            { "name": "generate", "title": "Generate" },
        ];
        
        let bil = 1;
        let list = [];
        let list_disabled = ['With-draw','Deferred'];
        let selectSession = $("#semester option:selected").attr("calYear");
        let sem = $("#semester option:selected").attr("calSem"); 
        // let list_disabled = [5,7,8,11,12,13];
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

            // if(field.status_academic == 4){
            //     colors = `blue`;
            //     status_academic = `Registered`;
            // }
            // else if(field.status_academic == 1){
            //     colors = `green`;
            //     status_academic = `Active`;
            // }
            // else if(field.status_academic == 5){
            //     colors = `warning`;
            //     status_academic = `Suspended`;
            // }
            // else if(field.status_academic == 7){
            //     colors = `red`;
            //     status_academic = `With-draw`;
            // }
            // else if(field.status_academic == 8){
            //     colors = `primary`;
            //     status_academic = `Graduated`;
            // }
            // else if(field.status_academic == 10){
            //     colors = `secondary`;
            //     status_academic = `Deferred`;
            // }
            // else if(field.status_academic == 9){
            //     colors = `brown-900`;
            //     status_academic = `In-active`;
            // }
            // else if(field.status_academic == 10){
            //     colors = `secondary`;
            //     status_academic = `Deferred`;
            // }
            // else{
            //     colors = `secondary`;
            //     // status_academic = `No Catergory`;
            //     status_academic = field.status_academic;
            // }

            let checked_info = "checked";
            let disabled = "";
            
            if(list_disabled.indexOf(field.curAcademic_type) != -1){
                checked_info = "disabled";
                disabled = "disabled";
            }
            else if(field.std_release != "checked"){
                checked_info = "";
                disabled = "disabled";
            }

            let std_remarks = field.std_remarks;
            if(std_remarks == null){
                std_remarks = "";
            }
            let release = '<span id="release_'+field.pk_cur_academic+'"><i class="fa fa-info-circle text-warning"></i></span>';
            let chk_release = '&nbsp;&nbsp;<input type="checkbox" onclick="uptCheckbox('+field.pk_cur_academic+')" '+checked_info+' value="'+field.std_studentid+'" id="std_'+field.pk_cur_academic+'">';
            if(field.std_release != ""){
                release = '<span id="release_'+field.pk_cur_academic+'"><i class="fa fa-send text-success"></i></span>';
                chk_release = '';
            }

            list.push({
                "bil":bil++,
                "student_id":`<a href="javascript:void(0);" class="text-info" onclick="loadData('` + field.std_studentid + `',`+field.fk_acaCal+`,'`+sem+`','`+selectSession+`','`+field.pk_cur_academic+`','list_stdPgm')">`+field.std_studentid+`</a>`,
                "std_name":field.sti_name,
                "std_semester":field.std_semester,
                "std_gpa":field.std_gpa,
                "std_cgpa":field.std_cgpa,
                "status_academic":`<p class="text-center"><span id="status_`+field.pk_cur_academic+`" class="label `+colors+`">`+status_academic+`<span></p>`,
                'status_release':release + chk_release +'<br>'+ std_remarks,
                "generate":`<button `+disabled+` id="btn_`+field.pk_cur_academic+`" `+SenatUpdateDisabled+ ` onclick="generate_single('`+field.pk_cur_academic+`','`+field.std_studentid+`')" class="btn btn-icon rounded text-success"><i class="fa fa-arrow-up"></i></button>`
            });
        });
        
        $("#listStdPgm").footable({
            "columns": columns,
            "rows": list,
            "paging": {
                "enabled": false,
                "size": 20,
                "countFormat": "Showing {PF} to {PL} of {TR} data"
            },
            "filtering": {
                "enabled": true,
                "placeholder": "Search...",
                "dropdownTitle": "Search for:"
            }
        });

        $(".btn_release").click(function(){
            async function doSomethingAsync(item) {
                return new Promise(resolve => {
                    setTimeout(() => {
                        $("#release_text").html(item.sti_name);
                        resolve();
                    }, Math.random() * 1000);
                });
            }

            async function release(){ 
                await Promise.all(
                    data.map(async (item, i) => {
                        await doSomethingAsync(item);

                        if($("#std_"+item.pk_cur_academic).prop('checked')){
                            let obj = await new get(host+"api_pengurusan_pelajar/public/curAcademic/student/release/result/"+item.pk_cur_academic,'picoms '+window.sessionStorage.token).execute();
                            if(obj.success){
                                let formStd = new FormData();
                                formStd.append('std_studentid',item.std_studentid);
                                formStd.append('status_academic',9);
                                let objStatus = await new post(host+"api_pengurusan_pelajar/public/pelajar/change/statusAcademic",formStd,'picoms '+window.sessionStorage.token).execute();
                                console.log(objStatus);
                            }
                        }
                        else{
                            if(item.status_academic == "1"){
                                let formStd = new FormData();
                                formStd.append('std_studentid',item.std_studentid);
                                formStd.append('status_academic',9);
                                let objStatus = await new post(host+"api_pengurusan_pelajar/public/pelajar/change/statusAcademic",formStd,'picoms '+window.sessionStorage.token).execute();
                                console.log(objStatus);
                            }
                        }
                    })                    
                );

                $("#release_text").html('');
                $("#list_stdPgm").modal('hide');

                swal("done Release",name_pgm,'success');
                setTimeout(() => {
                    load_search(window.sessionStorage.token);                    
                }, Math.random()*500);
            }

            release();
        });
    }
    $("#list_stdPgm").modal('show');
}

function generate_single(pk_cur_academic,std_studentid){
    let obj = new get(host+"api_pengurusan_pelajar/public/curAcademic/student/release/result/"+pk_cur_academic,'picoms '+window.sessionStorage.token).execute();
    if(obj.success){
        $("#release_"+pk_cur_academic).html('<i class="fa fa-send text-success"></i>');

        // let formStd = new FormData();
        // formStd.append('std_studentid',std_studentid);
        // formStd.append('status_academic',9);
        // let objStatus = new post(host+"api_pengurusan_pelajar/public/pelajar/change/statusAcademic",formStd,'picoms '+window.sessionStorage.token).execute();
        // if(objStatus.success){
            // $("#release_"+pk_cur_academic).html('<i class="fa fa-send text-success"></i>');
            // $("#status_"+pk_cur_academic).prop('class','label brown-900');
            // $("#status_"+pk_cur_academic).html('In-active');
        // }
    }    
}

function uptCheckbox(pk_cur_academic){
    let std_release = '';
    if($("#std_"+pk_cur_academic).prop('checked')){
        std_release = 'checked';
        $("#btn_"+pk_cur_academic).prop('disabled',false);
    }
    else{
        $("#btn_"+pk_cur_academic).prop('disabled',true);
    }

    let form = new FormData();
    form.append('std_release',std_release);
    form.append('pk_cur_academic',pk_cur_academic);
    let obj = new post(host+'api_pengurusan_pelajar/public/curAcademic/release/check',form,'picoms '+window.sessionStorage.token).execute();
    if(obj.success){
        $("#status_checked").html(`<label class="alert green-50 text-success">checked updated</label>`);
        setTimeout(() => {
            $("#status_checked").html('');            
        }, Math.random() * 500);
    }
}

function load_stdStanding(std_semester,intake,standing){

    let filterConditions = {
        cur_intake: intake,
        std_semester: std_semester 
    };
    
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
    $("#liststdStanding").html('');
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
            
            // if(field.status_academic == 4){
            //     colors = `blue`;
            //     status_academic = `Registered`;
            // }
            // else if(field.status_academic == 1){
            //     colors = `green`;
            //     status_academic = `Active`;
            // }
            // else if(field.status_academic == 5){
            //     colors = `warning`;
            //     status_academic = `Suspended`;
            // }
            // else if(field.status_academic == 7){
            //     colors = `red`;
            //     status_academic = `With-draw`;
            // }
            // else if(field.status_academic == 8){
            //     colors = `primary`;
            //     status_academic = `Graduated`;
            // }
            // else if(field.status_academic == 9){
            //     colors = `brown-900`;
            //     status_academic = `In-active`;
            // }
            // else{
            //     colors = `secondary`;
            //     // status_academic = `No Catergory`;
            //     status_academic = field.status_academic;
            // } 

            list.push({"bil":bil++,
            "student_id":`<a href="javascript:void(0);" class="text-info" onclick="loadData('` + field.std_studentid + `',`+field.fk_acaCal+`,'`+sem+`','`+selectSession+`','`+field.pk_cur_academic+`','list_stdStanding')">`+field.std_studentid+`</a>`,
            "std_name":field.sti_name,"std_semester":field.std_semester,
            "std_gpa":field.std_gpa,"std_cgpa":field.std_cgpa,"status_academic":`<p class="text-center"><span class="label `+colors+`">`+status_academic+`<span></p>`});
        });
        
        $("#liststdStanding").footable({
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
    
    let data_intake = filterData(data_load, filterConditions);

    let data = data_intake;
    $("#liststdStanding").html('');
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
        
        $("#liststdStanding").footable({
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
    // console.log(data)
    return data.filter(item => item["curAcademic_type"] == "" && item["std_cgpa"] < 1.50 );
  } 

function campusList(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmCollege/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    let request = $.ajax(settings);
    request.done(function (response){
        obj_college = response;
        returnValue();
     });

     request.fail(function(response){
        obj_college = {"success":false};
        returnValue();
     })
}

$('#btnLogout').click(function(){


    if (window.sessionStorage.from === 'SSO') {
        swal({
            title: "Logout",
            text: "Are you sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Yes",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            window.sessionStorage.clear();
            var redirectUrl = "https://cms.ucmi.edu.my/sso/";
            window.location.replace(redirectUrl);
        });
    } else {
        swal({
            title: "Logout",
            text: "Are you sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Yes",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            window.sessionStorage.clear();
            window.location.replace('admin_login.html');
        });
    }


  
});


function loadPage(id){
    window.sessionStorage.idPage = id;
    window.sessionStorage.content = "dashboard";
    window.location.replace('adminPage.html');
}

$('#btnCalendar').click(function(){
    window.sessionStorage.content = "settings";
    window.location.replace('ttpn_aca_calendar.html');
});

$('#btnSessionIntake').click(function(){
    window.sessionStorage.content = "settings";
    window.location.replace('ttpn_session_intake.html');
});

$('#btnCampus').click(function(){
    window.sessionStorage.content = "settings";
    window.location.replace('ttpn_campus.html');
});

$('#btnFaculty').click(function(){
    window.sessionStorage.content = "settings";
    window.location.replace('ttpn_faculty.html');
});

$('#btnProgramme').click(function(){
    window.sessionStorage.content = "settings";
    window.location.replace('ttpn_program.html');
});

$('#btnCourse').click(function(){
    window.sessionStorage.content = "settings";
    window.location.replace('ttpn_kursus.html');
});

$('#btnExamGrade').click(function(){
    window.sessionStorage.content = "settings";
    window.location.replace('ttpn_examGrade.html');
});

$('#btnAccess').click(function(){
    window.sessionStorage.content = "settings";
    window.location.replace('ttpn_access.html');
});

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
    
            let obj = new get(host+"api_pengurusan_pelajar/public/misStdInfo/show/"+student_id,'picoms '+window.sessionStorage.token).execute();
    
            if(obj.success){
                datastd = obj.data;
                
                $("#student_id").html(student_id);
                $("#name_std").html(datastd.sti_name);
                $("#noic").html('('+datastd.sti_icno+')');
                $("#programme_name").html(datastd.pgm_name);
                $("#intake_std").html('INTAKE: '+datastd.cur_intake);
                $("#sem_academic").html(' - '+selectSession.replace("/","") +'/'+ sem);
            }
    
            obj = new get(host+"api_pengurusan_pelajar/public/curAcademic/showAcaCal/"+student_id+"/"+cal_id,'picoms '+window.sessionStorage.token).execute();
    
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
    
                    let objLect = await new get(host + 'api_lecturer_picoms/public/misLectCrsPrm/listByCotDet/'+itemJ.fk_cotDet,'picoms ' + window.sessionStorage.token).execute();
                    let list_lect = "";
                    if(objLect.success){
                        data_lect = objLect.data;
                        data_lect.forEach(async (uData,u) => {
                            if(u > 0){
                                list_lect += '<br>';
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
                    let objLect = await new get(host + 'api_lecturer_picoms/public/misLectCrsPrm/listByCotDet/'+itemJ.fk_cotDet,'picoms ' + window.sessionStorage.token).execute();
                    let list_lect = "";
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
                            let objCGPA = await new get(host + 'api_pengurusan_pelajar/public/curAcademic/cgpa/'+student_id+'/'+pk_cur_academic+'/'+std_semester,'picoms '+window.sessionStorage.token).execute();
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

function load_detLectStd(lectCrsId,fk_course,aca_session,cal_cohort,acaYear,lectId){
    window.sessionStorage.lectCrsId = lectCrsId;
    window.sessionStorage.pk_crs = fk_course;
    window.sessionStorage.fk_aca_cal = aca_session;
    window.sessionStorage.lect_coor = "No";
    window.sessionStorage.cal_cohort = cal_cohort;
    window.sessionStorage.prevPage = "campusPage";
    window.sessionStorage.yearTaken = acaYear;
    window.sessionStorage.lectId = lectId;

    window.sessionStorage.getSession = $("#semester").val();
    window.location.replace('detLectCrsStudent.html');
}