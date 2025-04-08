let usrCatEadmin = window.sessionStorage.usrCatEadmin;
let usrCatEcmis = window.sessionStorage.usrCatEcmis;

$(function(){
    $.ajaxSetup ({
        cache: false
    });

    $.fn.select2.defaults.set( "theme", "bootstrap" );

    let id = window.sessionStorage.lectCrsId;
    let crsId = window.sessionStorage.pk_crs;
    let usrId = window.sessionStorage.usrId;
    let lectId = window.sessionStorage.lectId;
    let fk_cotDet = window.sessionStorage.fk_cotDet;
    let yearTaken = window.sessionStorage.yearTaken;
    let cal_cohort = window.sessionStorage.cal_cohort;
    let category = window.sessionStorage.category;
    let lect_coor = window.sessionStorage.lect_coor;
    let fk_aca_cal = window.sessionStorage.fk_aca_cal;
    let final_exam = "";

    if(lectId != null){
        lectId = lectId.toUpperCase();
        usrId = usrId.toUpperCase();
    }
    else{
        window.location.replace('../admin');
    }

  
    $('#yearTaken').val(yearTaken);
    $('#fk_acaCal').val(fk_aca_cal);

    // show course lecturer
    detailLectCrs(id, function(){
        if(obj_detCourse.success){
            let data = obj_detCourse.data;
            let crs_id = data.fk_course;
            let fk_cotDet = data.fk_cotDet;
            let coor = data.coordinator;
            final_exam = data.final_exam;
            
            if(usrCatEadmin == 1){
                $('.saveExcel').show();
            }
            else if(usrCatEcmis == 1){
                if(( usrId == lectId && coor == 'Yes' )){ $('.saveExcel').show() }
                else{ $('.saveExcel').hide() }
            }

            if(final_exam == 'checked'){
                $("#radio_final").prop('checked',true);
            }
    
            $('#lectCrsId').val(id);
            $('#fk_cotDet').val(fk_cotDet);
            $('#fk_course').val(crs_id);
            $('#crs_code').html(data.crsCode+' - '+data.crs_name);
            $('#cur_year').html(yearTaken.replace('/','')+'/'+cal_cohort);
            $('#emp_id').html(data.emp_name);
            $('#acaCal_type').html(category);

            $("#radio_final").change(function(){
                let final_exam = "";
                if($(this).prop('checked')){
                    final_exam = "checked";
                }
        
                let form = new FormData();
                form.append('crs_lectId',id);
                form.append('final_exam',final_exam);

                let obj = new post(host+'api_lecturer_picoms/public/misLectCrsPrm/update/final',form,'PICOMS '+window.sessionStorage.token).execute();
                if(obj.success){
                    window.location.reload();
                }
                else{
                    swal('Update Fail','Connection Problem','error');
                }
            })            

            $("#print_mark").click(function(){
                window.open('print_marklectstd.html');
            });

            $("#print_markPgm").click(function(){
                let pgmCode = $('.pgmCode').html();
                window.open('print_marklectstd.html?pgmCode='+pgmCode);
            });
        }
        else{
            logOut();
        }
    });

    // get grade scheme item
    findId(crsId, function(){
        $("#loading_mode").modal('show');
        var columns = [
            { "name": "bil", "title": "No.", "breakpoints": "md sm xs"  },
            { "name": "btnAction", "title": "Action" },
            { "name": "student_id", "title": "Student Id" },
            { "name": "std_name", "title": "Name" },
            { "name": "pgm_code", "title": "Programme", "breakpoints": "md sm xs" },
            { "name": "ip", "title": "In Progress", "breakpoints": "md sm xs" },
            { "name": "mrf", "title": "MA RF", "breakpoints": "md sm xs" },
        ];

        let formative = 0;
        let summative = 0;
        let listSubItem = [];
        let list_gradeCmpnnt = [];

        count_formative = 0;
        count_summative = 0;

        list_markStd = [];

        $.each(obj_grdSchm.data, function(j, itemJ){
            let gscId = itemJ.gsc_id;
            $('#grdSchmId').val(gscId);

            // list item for course
            gradeCmpnnt(gscId, function(){
                list_gradeCmpnnt = obj_grdSchmDet.data;

                $.each(obj_grdSchmDet.data, function(i, item){
                    let gsdId = item.gsd_id;
                    let gsdType = '';
                    let column_cMark = false;
                    
                    if( item.gsd_component == 'Final Assessment' ){ gsdType = 'Final' }
                    else if( item.gsd_component == 'Continuous Assessment' ){ gsdType = 'Continuous' }

                    //add columns mark
                    if(item.gsd_component == "Continuous Assessment"){
                        formative += item.gsd_percentage;
                    }
                    else if( item.gsd_component == 'Final Assessment' ){
                        if(summative == 0){
                            columns.push({"name":"cMark","title":'Carry Mark ('+formative+'%)',"breakpoints":"md sm xs"});
                        }
                        summative += item.gsd_percentage;
                    }

                    columns.push({"name":"mark"+item.gsd_id,"title":item.examTypeName+' ('+item.gsd_percentage+'%)',"breakpoints":"md sm xs"});

                    if((i+1) == obj_grdSchmDet.data.length && summative == 0){
                        // console.log("carry Mark Field")
                        columns.push({"name":"cMark","title":'Carry Mark ('+formative+'%)',"breakpoints":"md sm xs"});
                    }

                    // create box for each item
                    let divBoxItem = '<li class="nav-item">'+
                                        '<a href="#" class="nav-link auto">'+
                                            '<span class="pull-right text-muted m-r-xs">'+
                                                '<i class="fa fa-plus inline"></i>'+
                                                '<i class="fa fa-minus none"></i>'+
                                            '</span>'+
                                            '<span class="text-uppercase font-weight-bold">'+gsdType+' - '+item.examTypeName+' ('+item.gsd_percentage+'%)</span>'+
                                        '</a>'+
                                        '<ul class="nav nav-sub text-sm">'+
                                            '<textarea class="hidden" id="dataList'+gsdId+'"></textarea>'+
                                            '<table class="table table-striped m-b-none" id="tblItem'+gsdId+'"></table>'+
                                        '</ul>'+
                                    '</li>';
                    $('#divBox').append(divBoxItem);

                    // create table
                    markList(fk_cotDet, gsdId, function(){
                        let data = obj_mark.data;
                        createTbl(data, gsdId, gscId);
                    });
                });

            });

            // list sub-item grade scheme
            subItemList(id, fk_cotDet, function(){
                $('#fk_lectCrsDet').append('<option value="">- Choose -</option>');
                $.each(obj_subItem.data, function(i, item){
                    let gsdType = '';
                    if( item.gsd_component == 'Final Assessment' ){
                        gsdType = 'Final';
                        count_summative++;
                    }
                    else if( item.gsd_component == 'Continuous Assessment' ){ 
                        gsdType = 'Continuous';
                        count_formative++;
                    }

                    listSubItem.push({"id":item.pk_id,"fk_gsDet":item.fk_gsDet,"percentage":item.non_obe_percentage,"gsd_percentage":item.gsd_percentage,"item_name":item.item_name,"fk_gsDet":item.fk_gsDet,"gsd_component":item.gsd_component,"non_obe_type":item.non_obe_type});                    
                    $('#fk_lectCrsDet').append('<option mark="'+item.non_obe_percentage+'" value="'+item.pk_id+'">'+gsdType+' - '+item.item_name+'</option>');
                });

                $('.slct2').select2({
                    width: null,
                    containerCssClass: ':all:',
                });
            });
        }); // each mark

        // student list
        stdByAcaCalCrs2(fk_aca_cal, crsId, function(){
            columns.push(
                {"name":"tMark","title":'Total Mark (100%)',"breakpoints":"md sm xs"},
                {"name":"gred","title":'Grade',"breakpoints":"md sm xs"},
                {"name":"point","title":'Grade Point',"breakpoints":"md sm xs"},
            );

            let formAttend = new FormData();
            formAttend.append('fk_course',crsId);
            formAttend.append('fk_acaCal',fk_aca_cal);

            
            if(final_exam == "checked"){
                let obj_attendance = new post(host+'api_exam_picoms/public/misExamStd/listAttendance',formAttend,'picoms '+window.sessionStorage.token).execute();                
                if(obj_attendance.success){
                    dataAttendance = obj_attendance.data;
                }
            }

            let bil = 1;
            let convertList = JSON.stringify(obj_stdRegCrs.data);
            $("#dataList").val(convertList);
            var list = [];
            let viewData = [];
            let pgmCode = ""; 
            let num_tab = 0;
            let data_student = obj_stdRegCrs.data;

            $("#tStd").html(obj_stdRegCrs.data.length);
            
            data_student.sort(compareByPgmCode);

            $.each(data_student, function (j, itemJ){
                if(pgmCode != itemJ.pgmCode){
                    active_tab = "";      
                    num_tab++;
                    // if(num_tab == 1){
                    //     active_tab = "active";
                    // }                    

                    if(pgmCode != ""){
                        $(".tab_pgm").append(`
                        <li class="nav-item">
                          <a class="nav-link `+active_tab+`" href="javascript:void(0)" onclick="load_pgmCode('`+pgmCode+`')" data-toggle="tab" data-target="#tab_`+pgmCode+`">`+pgmCode+`</a>
                        </li>
                        `);
    
                        $(".item_stdPgm").append(`
                        <div class="tab-pane animated fadeIn text-muted" id="tab_`+pgmCode+`">
                            <table class="table table-striped table-bordered scroll" data-sorting="true"  id="tblStd_`+pgmCode+`"></table>                        
                        </div>
                        `);

                        $("#tblStd_"+pgmCode).footable({
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
                    }
                    // console.log(list);
                    list = [];
                    viewData = [];
                    bil = 1;
                    pgmCode = itemJ.pgmCode;
                }
                
                let tMark = 0;
                let grade = "F";
                let point = 0.00;
                let action_btn = '';
                
                let status = itemJ.rsb_status;
                let chk = '';
                if(status != 'Barred'){ chk = 'checked' }

                let display = '';
                if(usrCatEadmin == 1){
                    display = '';
                }
                else if(usrCatEcmis == 1){
                    if((usrId == lectId && lect_coor == 'Yes')){ display = '' }
                    else{ display = 'disabled' }
                }

                tMark = (itemJ.tMark)*1;
                grade = itemJ.grade;
                point = itemJ.point;
                action_btn = '';

                if(itemJ.mark_generate != null){
                    $("#print_mark").prop('disabled',false);
                    $("#print_markPgm").prop('disabled',false);
                }
                // console.log(display);
                // tMark = (itemJ.tMark)*1;
                point = (point)*1;

                viewData = {
                    bil: bil++, student_id: '<span class="text-uppercase">'+itemJ.std_id+'</span>', 
                    std_name: '<span class="text-uppercase">'+itemJ.sti_name+'</span>',
                    pgm_code: '<span class="text-uppercase">'+itemJ.pgmCode+'</span>',
                    ip: `<label class="ui-switch warning m-t-xs m-r" ><input type="checkbox" id="ip_`+itemJ.rsb_id+`" `+itemJ.ip+` onclick="ip_update(`+itemJ.rsb_id+`)"><i></i></label>`,
                    mrf: `<label class="ui-switch danger m-t-xs m-r" ><input type="checkbox" id="mrf_`+itemJ.rsb_id+`" `+itemJ.mrf+` onclick="mrf_update(`+itemJ.rsb_id+`)"><i></i></label>`, 
                    btnAction: 
                    '<button class="btn btn-icon btn-outline-success BtnDisabled" '+action_btn+' title="Marks" onclick="detailMark(\'' + itemJ.std_id + '\')" id="btnStdList" '+display+'><i class="fa fa-pencil-square-o"></i></button>',
                    cMark:`<p class="text-center text-success"><b id="`+itemJ.std_id+`_cMark">`+itemJ.cMark+`</b></p>`,
                    tMark:`<p class="text-center text-success"><b id="`+itemJ.std_id+`_tMark">`+tMark+`</b></p>`,
                    gred:`<p class="text-center text-success"><b id="`+itemJ.std_id+`_gred">`+grade+`</b></p>`,
                    point:`<p class="text-center text-success"><b id="`+itemJ.std_id+`_point">`+point.toFixed(2)+`</b></p>`,
                };

                let names = "";
                let field = 0;
                let attend = "";
                
                $.each(list_gradeCmpnnt,function(f,item){
                    let val = "";
                    attend = "";
                    if(names != item.gsd_id){
                        names = item.gsd_id;
                        
                        if(itemJ.mark_generate != null){
                            objMark = JSON.parse(itemJ.mark_generate);
                            if(item.gsd_component == "Continuous Assessment"){
                                field = (f+2);                                
                            }
                            else if( item.gsd_component == 'Final Assessment' ){
                                let yearTaken = window.sessionStorage.yearTaken;
                                let cal_cohort = window.sessionStorage.cal_cohort;
                                
                                if(yearTaken.replace('/','') >= "20222023"){
                                    if(cal_cohort < "3" && yearTaken.replace('/','') == "20222023"){

                                    }
                                    else{
                                        if(final_exam == "checked"){
                                            let tbl_paper_type = '1';
    
                                            if(item.examTypeId == "6"){
                                                tbl_paper_type = '2';
                                            }
    
                                            let filterAttendance = {
                                                std_studentid: itemJ.std_id,
                                                tbl_paper_type: tbl_paper_type,
                                            };
                                            // console.log(filterAttendance, itemJ.std_id)
                                            stdAttend = filterData(dataAttendance, filterAttendance);

                                            attend = `<br><span class="label danger">Not Attend</span>`;
                                            
                                            
                                            if(stdAttend.length > 0){
                                                if(stdAttend[0].attendance == "Attend"){
                                                    attend = `<br><span class="label success">Attend</span>`;                                    
                                                }
                                                else{
                                                    viewData["btnAction"] = '<button class="btn btn-icon btn-outline-success BtnDisabled" '+action_btn+' title="Marks" onclick="detailMark(\'' + itemJ.std_id + '\')" id="btnStdList" '+display+'><i class="fa fa-pencil-square-o"></i></button>',
                                                    viewData["tMark"] = `<p class="text-center text-success"><b id="`+itemJ.std_id+`_tMark">0</b></p>`;
                                                    viewData["gred"] = `<p class="text-center text-success"><b id="`+itemJ.std_id+`_gred">F</b></p>`;
                                                    viewData["point"] = `<p class="text-center text-success"><b id="`+itemJ.std_id+`_point">0</b></p>`;
                                                }
                                            }
                                            else{
                                                viewData["btnAction"] = '<button class="btn btn-icon btn-outline-success" '+action_btn+' title="Marks" onclick="detailMark(\'' + itemJ.std_id + '\')" id="btnStdList" '+display+'><i class="fa fa-pencil-square-o"></i></button>',
                                                viewData["tMark"] = `<p class="text-center text-success"><b id="`+itemJ.std_id+`_tMark">0</b></p>`;
                                                viewData["gred"] = `<p class="text-center text-success"><b id="`+itemJ.std_id+`_gred">F</b></p>`;
                                                viewData["point"] = `<p class="text-center text-success"><b id="`+itemJ.std_id+`_point">0</b></p>`;
                                            }
                                        }
                                    }
                                }
                                field = (f+3);                                
                            }                            
                            val = objMark[field];

                            if(val == undefined){
                                val = "";
                            }

                        }
                        viewData["mark"+item.gsd_id] = `<p class="text-info text-center"><b id="`+itemJ.std_id+'_'+item.gsd_id+`">`
                        // +itemJ.std_id+'_'+item.gsd_id+'<br>'
                        +val+attend+`</b>`+`</p>`;
                    }
                }); 
                list.push(viewData);

                if((j+1) == obj_stdRegCrs.data.length){
                    $(".tab_pgm").append(`
                    <li class="nav-item">
                      <a class="nav-link `+active_tab+`" href="javascript:void(0)" onclick="load_pgmCode('`+pgmCode+`')" data-toggle="tab" data-target="#tab_`+pgmCode+`">`+pgmCode+`</a>
                    </li>
                    `);

                    $(".item_stdPgm").append(`
                    <div class="tab-pane animated fadeIn text-muted" id="tab_`+pgmCode+`">
                        <div class="table-responsive">
                            <table class="table table-striped table-bordered scroll" data-sorting="true"  id="tblStd_`+pgmCode+`"></table>                        
                        </div>
                    </div>
                    `);

                    // console.log(list)

                    $("#tblStd_"+pgmCode).footable({
                        "columns": columns,
                        "rows": list,
                        "paging": {
                            "enabled": false,
                            // "size": 10,
                            "countFormat": "Showing {PF} to {PL} of {TR} data"
                        },
                        "filtering": {
                            "enabled": true,
                            "placeholder": "Search...",
                            "dropdownTitle": "Search for:"
                        }
                    });
                    checkingBtn(); //utk each std btn

                }                
            });
            $("#loading_mode").modal('hide');
        
            // console.log(count_summative)

            $("#show_mark").click(function(){
                $("#loading_mode").modal('show');
                let messages = "Done Load Mark";
                
                async function doSomethingAsync(item) {
                    return new Promise(resolve => {
                        setTimeout(() => {
                            $("#load_text").html(item);
                            resolve();
                        }, Math.random() * 1000);
                    });
                }

                async function main() {
                    let pgmCode = $(".pgmCode").html();

                    let filterConditions = {
                        pgmCode: pgmCode,
                    };
                
                    objStd = filterData(obj_stdRegCrs.data, filterConditions);

                    await Promise.all(                        
                        objStd.map(async (itemJ) => {
                            let names = "";
                            let marks = 0;
                            let percentage = 0;
                            let full_mark = 0;
                            let tMark = 0;
                            let cMark = 0;
                            let numArr = 0;
                            let total_summative = 0;
                            let components = ""; 
                            let listing = []; 
                            let skip = 0;
                            let num_summative = 0;
                            let name_final = "";
                            
                            let arr =[];
                            
                            await doSomethingAsync(itemJ.std_id+' - '+itemJ.sti_name+'...');   
                            // console.log(itemJ.std_id)
                            listing.push(itemJ.std_id);
                            listing.push(itemJ.sti_name);
                            
                            await listSubItem.forEach(async (item,f) => {
                                var form = new FormData();
                                form.append("fk_lectCrsDet", item.id);
                                form.append("fk_student", itemJ.std_id);
                                
                                // let results = await new post(host+"api_lecturer_picoms/public/misLectStdMark/chkStdMark",form,"picoms " + window.sessionStorage.token).execute();
                                let results = await new post(host+"api_lecturer_picoms/public/misLectStdMark/chkStdMark3",form,"picoms " + window.sessionStorage.token).execute();
                                
                                if(results.success){   
                                    let dataMark = results.data;
                                      
                                    if(names != itemJ.std_id + '_' + dataMark[0].fk_gsDet){
                                        // console.log(names,itemJ.std_id + '_' + dataMark[0].fk_gsDet)
                                        if(f != 0){
                                            peratus = ((marks/full_mark)*100)*(percentage/100);
                                            sum = peratus.toFixed(2);
                                            
                                            if(components != "Final Assessment"){
                                                cMark += (sum)*1;
                                                $("#"+names).html(sum);
                                                listing.push(sum);

                                                if(skip == 1){
                                                    listing.push("0.00");
                                                    skip = 0;
                                                }
                                             
                                            }
    
                                            components = dataMark[0].gsd_component;
                                            full_mark = 0;
                                        }
    
                                        numArr = 0;
    
                                        if(dataMark.length > 1){
                                            numArr = dataMark.length - 1;
                                        }

                                        names = itemJ.std_id + '_' + dataMark[numArr].fk_gsDet;
                                        // console.log("new Name",names)
                                        percentage = dataMark[numArr].gsd_percentage;
                                        full_mark += (dataMark[numArr].non_obe_percentage)*1;
                                        marks = (dataMark[numArr].mark)*1;
                                      
                                        // console.log(f+1)
                                        if(f >= count_formative){  
                                            
                                            if(components == "Final Assessment"){
                                                console.log("atas",num_summative,full_mark,marks,names,name_final,sum);
                                                if(count_summative != num_summative && num_summative != 0){
                                                    num_summative++;

                                                    if(isNaN(cMark)){
                                                        cMark = 0.00;
                                                    }

                                                    let view_cmark = $("#" + itemJ.std_id + "_cMark").html();

                                                    if(view_cmark != cMark){
                                                        $("#" + itemJ.std_id + "_cMark").html(cMark.toFixed(2));
                                                        listing.push(cMark.toFixed(2));
                                                    }

                                                    
                                                    if(name_final != names){
                                                        // console.log("final_name atas",name_final,names,sum)
                                                        $("#"+name_final).html(sum);
                                                        listing.push(sum);
                                                        
                                                        total_summative += (sum)*1;
                                                        name_final = "";
                                                        // console.log(total_summative)
                                                    }
                                                    // console.log(names)
                                                    name_final = names;
                                                }
                                                else if(count_summative == 1){
                                                    if(isNaN(cMark)){
                                                        cMark = 0.00;
                                                    }

                                                    let view_cmark = $("#" + itemJ.std_id + "_cMark").html();

                                                    if(view_cmark != cMark){
                                                        $("#" + itemJ.std_id + "_cMark").html(cMark.toFixed(2));
                                                        listing.push(cMark.toFixed(2));
                                                    } 
                                                    
                                                    $("#"+names).html(sum);
                                                        listing.push(sum);
                                                        
                                                        // total_summative += (sum)*1;
                                                }
                                                else{                                                    
                                                    num_summative++;
                                                    name_final = names;
                                                }
                                            }

                                            peratus = ((marks/full_mark)*100)*(percentage/100);
                                            sum = peratus.toFixed(2); 
                                          
                                        }
            
                                        if((f+1) == listSubItem.length){
                                            // console.log("masuk atas",total_summative)
                                            peratus = ((marks/full_mark)*100)*(percentage/100);
                                            sum = peratus.toFixed(2);
                                            if(isNaN(cMark)){
                                                cMark = 0.00;
                                            }

                                            if(components == "Final Assessment"){
                                                cMark = $("#" + itemJ.std_id + "_cMark").html();
                                                tMark = (sum)*1 + (cMark)*1 + total_summative;

                                                if(yearTaken.replace('/','') >= "20222023"){
                                                    if(cal_cohort < "3" && yearTaken.replace('/','') == "20222023"){
                                                        $("#"+names).html(sum);
                                                        listing.push(sum);
                                                        total_summative += (sum)*1;
                                                    }
                                                    else{
                                                        if(final_exam == "checked"){
                                                            let tbl_paper_type = '1';
        
                                                            if(item.non_obe_type == "6"){
                                                                tbl_paper_type = '2';
                                                            }
        
                                                            let filterAttendance = {
                                                                std_studentid: itemJ.std_id,
                                                                tbl_paper_type: tbl_paper_type,
                                                            };
                                                        
                                                            stdAttend = filterData(dataAttendance, filterAttendance);
                                                            
                                                            if(stdAttend.length > 0){
                                                                if(stdAttend[0].attendance != "Attend"){
                                                                    $("#"+names).html(0.00);
                                                                    listing.push(0.00); 
                                                                    tMark = 0.00;                                                                      
                                                                }
                                                                else{
                                                                    $("#"+names).html(sum);
                                                                    listing.push(sum);                                                             
                                                                }
                                                            }
                                                            else{
                                                                $("#"+names).html(sum);
                                                                listing.push(sum);
                                                                tMark = 0.00;                                                                      
                                                            }                                                                                                           
                                                        }
                                                        else{
                                                            $("#"+names).html(sum);
                                                            listing.push(sum);
                                                            total_summative += (sum)*1;
                                                            // console.log("Last Atas",total_summative)

                                                        }
                                                    }

                                                    // if(count_summative > 1){
                                                    //     console.log("masuk")
                                                    //     listing.pop();
                                                    //     tMark = tMark - sum;
                                                    // }                                                    
                                                }
                                                else{
                                                    $("#"+names).html(sum);
                                                    listing.push(sum);   
                                                    total_summative += (sum)*1;
                                                }
                                            }
                                            else{
                                                if(count_summative == 0){
                                                    $("#"+names).html(sum);
                                                    listing.push(sum); 

                                                    cMark += (sum)*1;
                                                    $("#" + itemJ.std_id + "_cMark").html(cMark.toFixed(2));
                                                    listing.push(cMark.toFixed(2));

                                                    cMark = $("#" + itemJ.std_id + "_cMark").html();
                                                    tMark = (cMark)*1 + total_summative;
                                                }                                                
                                            }

                                            $("#" + itemJ.std_id + "_tMark").html(tMark.toFixed(0));
                                            listing.push(tMark.toFixed(0));                                                    
        
                                            let form = new FormData();
                                            form.append("grd_category", '001');
                                            form.append("marks", tMark.toFixed(0));
                                            let obj_grd =  new post(host+'api_exam_picoms/public/misExamGrading/getGrade',form,"picoms " + window.sessionStorage.token).execute();
        
                                            if(obj_grd.success){
                                                data_grd = obj_grd.data;
                                                $("#" + itemJ.std_id + "_gred").html(data_grd.grd_id);
                                                $("#" + itemJ.std_id + "_point").html(data_grd.quality_point);
                                                listing.push(data_grd.grd_id);                                                                                                
                                                listing.push(data_grd.quality_point);                                                                                                

                                                $("#generate_mark").prop('disabled',false);
                                                checkingBtn()
                                            }        
                                        }
                                        else{
                                            name_final = names;
                                            // console.log('not end yet',names)
                                        }
    
                                    }
                                    else{
                                 
                                        full_mark += (dataMark[numArr].full_mark)*1;
                                        marks += (dataMark[numArr].mark)*1;
                                        
                                         if(f >= count_formative){   
                                            peratus = ((marks/full_mark)*100)*(percentage/100);
                                            sum = peratus.toFixed(2); 
                                            if(components == "Final Assessment"){                                                
                                                console.log("bawah",num_summative,full_mark,marks);

                                                if(num_summative != count_summative && num_summative != 0){
                                                    num_summative++;
                                                    let view_cmark = $("#" + itemJ.std_id + "_cMark").html();

                                                    if(view_cmark != cMark){
                                                        $("#" + itemJ.std_id + "_cMark").html(cMark.toFixed(2));
                                                        listing.push(cMark.toFixed(2));
                                                    }
                                                    // console.log('final_names bawah',name_final,names,sum)
                                                    
                                                    if(name_final != names){
                                                        $("#"+names).html(sum);
                                                        listing.push(sum);
                                                        
                                                        total_summative += (sum)*1;
                                                        name_final = "";

                                                    }
                                                }
                                                else{
                                                    num_summative++;
                                                }
                                            }
                                        }

                                        if((f+1) == listSubItem.length){

                                            // coding bawah nie ori cMark and tMark tu
                                            if (final_exam != "checked") {
                                                // if (itemJ.std_id === 'DPH04220001') {
                                                
                                                // }
                                                peratus = ((marks/full_mark)*100)*(percentage/100);
                                                sum = peratus.toFixed(2);
                                                // console.log(dataMark[numArr]);
                                                cMark = (sum)*1 + (cMark)*1;
                                                tMark = cMark;
                                                // console.log(tMark);

                                            }else{
                                                peratus = ((marks/full_mark)*100)*(percentage/100);
                                                sum = peratus.toFixed(2);
                                                cMark = $("#" + itemJ.std_id + "_cMark").html();
                                                tMark = (sum)*1 + (cMark)*1 + total_summative;
                                            }

                        
                                            // coding bawah nie ori cMark and tMark tu
                                            if (itemJ.std_id === 'DPH04220001') {
                                                console.log(listing);
                                                    
                                                }
                                            if(count_summative == 1){
                                                $("#"+names).html(sum);
                                                listing.push(sum);
                                            }

                                            cMark = (cMark)*1;
                                                
                                            $("#" + itemJ.std_id + "_cMark").html(cMark.toFixed(2));
                                            if(yearTaken.replace('/','') >= "20222023"){
                                                if(cal_cohort < "3" && yearTaken.replace('/','') == "20222023"){
                                                    $("#"+names).html(sum);
                                                    listing.push(sum);
                                                }
                                                else{
                                                    
                                                    if(final_exam == "checked") {
                                                        let tbl_paper_type = '1';
    
                                                        if(item.non_obe_type == "6"){
                                                            tbl_paper_type = '2';
                                                        }
    
                                                        let filterAttendance = {
                                                            std_studentid: itemJ.std_id,
                                                            tbl_paper_type: tbl_paper_type,
                                                        };
                                                        // console.log("Filter",filterAttendance)
                                                    
                                                        stdAttend = filterData(dataAttendance, filterAttendance);
                                                        if(stdAttend.length > 0){
                                                            if(stdAttend[0].attendance != "Attend"){
                                                                $("#"+names).html(0.00);
                                                                listing.push(0.00); 
                                                                tMark = 0.00;                                                                      
                                                            }
                                                            else{
                                                                $("#"+names).html(sum);
                                                                listing.push(sum);                                                             
                                                            }
                                                        }
                                                        else{
                                                            $("#"+names).html(sum);
                                                            listing.push(sum);
                                                            tMark = 0.00;                                                                      
                                                        }
                                                    }
                                                    else{
                                                        $("#"+names).html(sum);
                                                        listing.push(sum);
                                                    }
                                                    //test without attendance
                                                    // $("#"+names).html(sum);
                                                    //     listing.push(sum);
                                                }
                                            }
                                            // console.log("Total Summative",total_summative)
                                          
                                            $("#" + itemJ.std_id + "_tMark").html(tMark.toFixed(0));
                                            listing.push(tMark.toFixed(0)); 
        
                                            let form = new FormData();
                                            form.append("grd_category", '001');
                                            form.append("marks", tMark.toFixed(0));
                                            let obj_grd =  new post(host+'api_exam_picoms/public/misExamGrading/getGrade',form,"picoms " + window.sessionStorage.token).execute();
        
                                            if(obj_grd.success){
                                                data_grd = obj_grd.data;
                                                $("#" + itemJ.std_id + "_gred").html(data_grd.grd_id);
                                                listing.push(data_grd.grd_id);                                                                                                
                                                $("#" + itemJ.std_id + "_point").html(data_grd.quality_point);
                                                listing.push(data_grd.quality_point);                                                                                                
                                                $("#generate_mark").prop('disabled',false);
                                            }        
                                        }
                                    }
                                    
                                }
                                else{
                                    // console.log(f,components)
                                    if(f >= count_formative){
                                        peratus = ((marks/full_mark)*100)*(percentage/100);
                                        sum = peratus.toFixed(2); 
                                        
                                        if(components == "Continuous Assessment"){
                                            // console.log("Paling bawah - "+sum, names);
                                            
                                            $("#"+names).html(sum);
                                            listing.push(sum);
                                            
                                            cMark += (sum)*1;
                                            if(f == count_formative){
                                                $("#" + itemJ.std_id + "_cMark").html(cMark.toFixed(2));
                                                listing.push(cMark.toFixed(2));                                            
                                            }
                                        }
                                        else if(components == "Final Assessment"){
                                            // console.log(name_final)
                                            console.log("Paling bawah")
                                            cMark += (sum)*1;
                                            $("#" + itemJ.std_id + "_cMark").html(cMark.toFixed(2));
                                            listing.push(cMark.toFixed(2));

                                            if(count_summative > 1){                                                    
                                                $("#"+names).html(sum);
                                                listing.push(sum);
                                            }
                                        }
                                        else{
                                            $("#"+names).html(sum);
                                            listing.push(sum);
                                        }  
                                        
                                        $("#generate_mark").prop('disabled',false);                                        
                                    }
                                    else{
                                        skip = 1;
                                    }
                                }  
                            });
                            
                            
                            list_markStd.push({"studentid":itemJ.std_id,"data":Object.assign({},listing)}); 
                            console.log(listing)

                        })
                                                
                    );
                    // console.log(count_summative); 
                    swal("Load Mark",messages,"success"); 
                    $("#load_text").html('Loading...');
                    $("#loading_mode").modal('hide');   
                    
                    // console.log(list_markStd)
                }
                
                setTimeout(() => {
                    main();
                    checkingBtn(); //utk btn kat kiri  biru 'MARKS +'

                },Math.random() * 1000);
                // main();

                $("#generate_mark").click(function(){
                    $("#generateAllMark").modal('show');
                    // let list = [];

                    async function doSomethingAsync(field) {
                        return new Promise(resolve => {
                            setTimeout(() => {
                                $("#listStdMark").html(field);                                
                                // item.forEach(async (field) => {
                                //     $("#listStdMark").append('<tr><td>'+field.std_id+'</td><td>'+field.sti_name+'</td><td>'+field.cMark+'</td><td>'+field.tMark+'</td>'+
                                //     '<td>'+field.grade+'</td><td>'+field.point+'</td><td>'+field.statusrecord+'</td></tr>');
                                // });
                                
                                resolve();
                            }, Math.random() * 1000);
                        });
                    }

                    async function main() {
                        let pgmCode = $(".pgmCode").html();

                        let filterConditions = {
                            pgmCode: pgmCode
                        };
                    
                        objStd = filterData(obj_stdRegCrs.data, filterConditions);
                        await Promise.all(
                            objStd.map(async (itemJ,i) => {
                                let rsb_id = itemJ.rsb_id;
                                let cMark = $("#"+itemJ.std_id+"_cMark").html();
                                let tMark = $("#"+itemJ.std_id+"_tMark").html();
                                let grade = $("#"+itemJ.std_id+"_gred").html();
                                let point = $("#"+itemJ.std_id+"_point").html();                 
                                let mark_generate = list_markStd.find(({ studentid }) => studentid === itemJ.std_id);

                                // list.push({"std_id":itemJ.std_id,"sti_name":itemJ.sti_name,"cMark":cMark,"tMark":tMark,"grade":grade,"point":point});

                                if(list.length > 0){
                                    await doSomethingAsync('<tr><td>'+itemJ.std_id+'</td><td>'+itemJ.sti_name+'</td><td>'+cMark+'</td><td>'+tMark+'</td>'+
                                    '<td>'+grade+'</td><td>'+point+'</td></tr>');
                                    // list = [];
                                }
        
                                let form = new FormData();
                                form.append('rsb_id',rsb_id);
                                form.append('cMark',cMark);
                                form.append('tMark',tMark);
                                form.append('grade',grade);
                                form.append('point',point);
                                form.append('mark_generate',JSON.stringify(mark_generate.data));

                                let obj = await new post(host+'api_pengurusan_pelajar/public/misStdRegsub/generateMark',form,'picoms ' + window.sessionStorage.token).execute();
        
                                statusrecord = '<span class="label danger float-right">Failed</span>';
        
                                if(obj.success){
                                    statusrecord = '<span class="label success float-right">success</span>';
                                }

                                if(i == 0){
                                    $("#listStdMark").html('');
                                }

                                // list.push({"std_id":itemJ.std_id,"sti_name":itemJ.sti_name,"cMark":cMark,"tMark":tMark,"grade":grade,"point":point,"statusrecord":statusrecord});

                                // if(obj_stdRegCrs.data.length == (i+1)){
                                //     await doSomethingAsync(list);
                                //     list = [];
                                // }                                
                            })
                        );

                        $("#generateAllMark").modal('hide');
                        $("#listStdMark").html('');                                
                        swal("Done Generate Mark",pgmCode,"success");
                        $("#done_btn").prop('disabled',false);
                        $("#print_mark").prop('disabled',false);
                        $("#print_markPgm").prop('disabled',false);

                    }

                    setTimeout(() => {
                        main();
                        $("#print_markPgm").prop('disabled',false);
                        $("#print_mark").prop('disabled',false);

                    }, Math.random() * 1000);
                    
                });

            });          
        });
    });

    $('#mdlStdMarks button[data-dismiss="modal"]').click(function() {
        $('#formAddMarks input').val(''); // Clear input values
    });
});
var confirmed = false;

function ip_update(rsb_id){
    let val = '';
    if($("#ip_"+rsb_id).prop('checked')){
        val = "checked";
    }

    let form = new FormData();
    form.append("id",rsb_id);
    form.append("ip",val);

    let obj = new post(host+'api_pengurusan_pelajar/public/misStdRegsub/ip/update',form,'picoms ' + window.sessionStorage.token).execute();

    if(obj.success){
        swal("Update Success","In Progress Success","success");
    }
    else{
        swal("Update Failed","In Progress Fail","danger");
    }

}

function mrf_update(rsb_id){
    let val = '';
    if($("#mrf_"+rsb_id).prop('checked')){
        val = "checked";
    }

    let form = new FormData();
    form.append("id",rsb_id);
    form.append("mrf",val);

    let obj = new post(host+'api_pengurusan_pelajar/public/misStdRegsub/mrf/update',form,'picoms ' + window.sessionStorage.token).execute();

    if(obj.success){
        swal("Update Success","MRF Success","success");
    }
    else{
        swal("Update Failed","MRF Fail","danger");
    }
}


$('#btnBack').click(function(){
    let prevPage = window.sessionStorage.prevPage;
    let page = '';
    if( prevPage == 'viewLect' ){ page = 'adminPage.html' }
    else if(prevPage == "campusPage"){
        page = prevPage+'.html';
    }
    else if(prevPage == "adminPage"){
        page = prevPage+'.html';
    }
    else{ page = 'lecturer_details.html' }

    window.location.replace(page);
    window.sessionStorage.removeItem('lectCrsId');
    window.sessionStorage.removeItem('pk_crs');
    window.sessionStorage.removeItem('prevPage');
    window.sessionStorage.removeItem('lect_coor');
    window.sessionStorage.removeItem('category');
    window.sessionStorage.removeItem('fk_aca_cal');
});


// onchange item
$('#fk_lectCrsDet').change(function(){
    let mark = $("#fk_lectCrsDet option:selected").attr("mark");
    $('#setMark').val(mark);
});


// oninput mark
$('#mark').on('input', function(){
    let value = $(this).val();
    let fullMark = $('#setMark').val();
    
    if(!(value >= 0 && value <= parseInt(fullMark))){
        swal({
            text: "Mark not in range.",
            type: "info"
        });
        $('#mark').val('');
    }
});


//-------------------------------------------------- add student mark --------------------------------------------------//
$('#formAddMarks').on('submit', function(e){
    if(!confirmed){
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
        }).then(function (){
            let fk_lectCrsDet = $('#fk_lectCrsDet').val();
            let fk_student = $('#fk_student').val();
            let fk_course = $('#fk_course').val();
            let mark = $('#mark').val();
            let full_mark = $('#setMark').val();

            var form = new FormData();
            form.append("fk_lectCrsDet", fk_lectCrsDet);
            form.append("fk_student", fk_student);
            form.append("fk_course", fk_course);
            form.append("mark", mark);
            form.append("full_mark", full_mark);
            form.append("recordstatus", "ADD");

            var settings = {
                "url": host+"api_lecturer_picoms/public/misLectStdMark/register",
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
                let result = JSON.parse(response);
                if(result.success){
                    window.location.reload();
                }
                else{ swal("Failed", response.message, "error"); }
            });
        });
    }
});
//-------------------------------------------------- end add student mark --------------------------------------------------//


//-------------------------------------------------- update student mark --------------------------------------------------//
$('#mdlStdMarks').on('submit', '#formUptMarks', function(e){
    
        // Clear file input field
        $("#excel_file").val("");
    if(!confirmed){
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
        }).then(function (){
            let pk_id = $('#pk_stdMark').val();
            let mark = $('#mark').val();

            var form = new FormData();
            form.append("pk_id", pk_id);
            form.append("mark", mark);
            form.append("recordstatus", "EDT");

            var settings = {
                "url": host+"api_lecturer_picoms/public/misLectStdMark/update",
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
                let result = JSON.parse(response);
                if(result.success){
                    window.location.reload();
                }
                else{ swal("Failed", response.message, "error"); }
            });
        });
    }
});
//-------------------------------------------------- end update student mark --------------------------------------------------//


//-------------------------------------------------- delete marks --------------------------------------------------//
function del_rekod(id){
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
    }).then(function (){
        var settings = {
            "url": host+"api_lecturer_picoms/public/misLectCrsDet/delete",
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
                swal(result.message, result.data, "error");
                return;
            }
            window.location.reload();
        });
    });
}
//-------------------------------------------------- end delete marks --------------------------------------------------//


//-------------------------------------------------- create table for each item --------------------------------------------------//
function createTbl(objData, gsdId){
    let columns = [
        { "name": "bil", "title": "No." },
        { "name": "item_name", "title": "Item" },
        { "name": "non_obe_percentage", "title": "Marks" },
        // { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" }
        { "name": "upt_btn", "title": "Action" }
    ];

    let bil = 1;
    let convertList = JSON.stringify(objData);
    $("#dataList"+gsdId).val(convertList);
    let list_data = [];

    $.each(objData, function(i, field){
        list_data.push({
            "bil": bil++, "item_name": '<span class="text-uppercase">'+field.item_name+'</span>', "non_obe_percentage": field.non_obe_percentage,
            "upt_btn": '<a title="Upload" onclick="uploadMark(\'' + i + '\', \'' + gsdId + '\')"><i class="fa fa-upload" style="color: #2196f3"></i></a>'
        });
    });
    
    $('#tblItem'+gsdId).html('');
    $('#tblItem'+gsdId).footable({
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
}
//-------------------------------------------------- create table for each item --------------------------------------------------//


// item onchange
$('#fk_lectCrsDet').change(function(){
    let val = $(this).val();
    let stdId = $('#fk_student').val();

    chkStdMark(stdId, val, function(){
        let exist = obj_stdMark.data.length;
        if(exist != 0){
            $.each(obj_stdMark.data, function(i, item){
                $('#pk_stdMark').val(item.pk_id);
                $('#mark').val(item.mark);
                $('.formName').attr('id','formUptMarks');
                $('#btnSave').html('<button type="submit" class="btn success p-x-md">Update</button>');
            });
        }
        else{
            $('.formEdit').val('');
            $('.formName').attr('id','formAddMarks');
            $('#btnSave').html('<button type="submit" class="btn info p-x-md">Save</button>');
        }
        
    });
});


// List Mark
function detailMark(stdId){
    $('.formName')[0].reset();
    $('#fk_student').val(stdId);
    $('#btnSave').html('');
    $('#mdlStdMarks').modal('show');
}


// check format file excel before upload
$("#excel_file").on("change", function(){
    // check type
    var extension = $(this).val().split('.').pop().toLowerCase();
    if($.inArray(extension, ['xlsx','xls']) == -1) {
        alert('Please upload EXCEL file only.');
        $(this).val('');
    }
});


//-------------------------------------------------- download excel --------------------------------------------------//
function uploadMark(index, gsdId){
    
    $('#course_marks').modal('hide');
    $('#loading_mode').modal('show');

    let d = JSON.parse($("#dataList"+gsdId).val());
    let obj_stdRegCrs = JSON.parse($("#dataList").val());
    let pgmCode = $(".pgmCode").html();
    let data = d[index];

    let filterConditions = {
        pgmCode: pgmCode
    };

    objStd = filterData(obj_stdRegCrs, filterConditions);


    // console.log(objStd);
    let lectCrsDet_id = data.pk_id;
    let fullMark = data.non_obe_percentage;
    let yearTaken = $('#yearTaken').val();
    let fk_acaCal = $('#fk_acaCal').val();
    let fk_crs = $('#fk_course').val();
    $('#subItem').html(data.item_name);
    $('#lectCrsDet_id').val(lectCrsDet_id);
    $('#fullMark').val(fullMark);

    async function doSomethingAsync(item) {
        return new Promise(resolve => {
            setTimeout(() => {
                $("#load_text").html(item);
                resolve();
            }, Math.random() * 1000);
        });
    }

    async function main(){
        var columns = [
            // { "name": "bil", "title": "No." },
            { "name": "student_id", "title": "Student" },
            { "name": "mark", "title": "Mark" },
            { "name": "full_mark", "title": "Full Mark", "breakpoints": "md sm xs" }
        ];

        let bil = 1;
        var list = [];

        await Promise.all(
            objStd.map(async (itemJ,j) => {
                await doSomethingAsync(itemJ.std_id);

                let stdId = itemJ.std_id;
                let get_mark = await new get( host+"api_lecturer_picoms/public/misLectStdMark/findMark/"+lectCrsDet_id+"/"+stdId,'picoms '+window.sessionStorage.token).execute();
                let return_total = '';
                if(get_mark.success){
                    return_total = get_mark.data[0].mark;
                }


                list.push({
                     student_id: stdId, mark: return_total, full_mark: fullMark
                });                

            })
        );
        $('#loading_mode').modal('hide');

        list.sort(compareByStd_id);
    
        $("#tblStdDnld").footable({
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
        $('#mdlUpload').modal('show');

        $("#btnExcel").click(function(){
            $("#btnExcel").prop('disabled',true);
            let data = list;
            Promise.all(
                [downloadData(data,pgmCode)]
            ).then(() =>{
                $("#btnExcel").prop('disabled',false);
            });
        });
    }

    main();
}

async function downloadData(data,pgmCode){
    return new Promise(resolve => {
        setTimeout(() => {
            let jsnData = [];
            jsnData.push([{"text": "No."},{"text": "student_id"},{"text": "mark"},{"text": "full_mark"}]);
            data.forEach(async (item,i) => {
                // console.log(item);
                jsnData.push([{"text": ++i},{"text": item.student_id},{"text": item.mark},{"text": item.full_mark}]);
            });
            
            var tableData = [
                {
                    "sheetName": pgmCode,
                    "data": jsnData
                }
            ];
            var options = {
                fileName: $('#subItem').html() + "-" + pgmCode
            };
            Jhxlsx.export(tableData, options);            
            resolve();
        }, Math.random() * 1000);
    });
    
}
//-------------------------------------------------- end download excel --------------------------------------------------//


//-------------------------------------------------- upload excel --------------------------------------------------//
$("#form_excel").on('submit', function (e){
     // Clear input fields
     $("#formUptMarks input").val("");
     // Reset select to first option
     $("#formUptMarks select").val("");
     
    if (!confirmed){
        e.preventDefault();
        $('#mdlUpload').modal('hide');
        $('#loading_mode').modal('show');
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
    let fk_lectCrsDet = $('#lectCrsDet_id').val();
    let fk_course = $('#fk_course').val();
    let full_mark = $('#fullMark').val();
    // let dataLength = dataStd.length;

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
            dataStd.map(async (item,i) =>{
                let stdId = item.student_id;
                let mark = item.mark;
    
                await doSomethingAsync(stdId + ' : Mark ' + mark);

                var form = new FormData();
                form.append("fk_lectCrsDet", fk_lectCrsDet);
                form.append("fk_student", stdId);

                let obj_stdMark = await new post(host+"api_lecturer_picoms/public/misLectStdMark/chkStdMark",form,'picoms ' + window.sessionStorage.token).execute();
                // let exist = obj_stdMark.data.length;
                var form = new FormData();
    
                if(!obj_stdMark.success){
                    // add mark
                    form.append("fk_lectCrsDet", fk_lectCrsDet);
                    form.append("fk_student", stdId);
                    form.append("fk_course", fk_course);
                    form.append("mark", mark);
                    form.append("full_mark", full_mark);
                    form.append("recordstatus", 'ADD');

                    let result = await new post(host+"api_lecturer_picoms/public/misLectStdMark/register",form,"picoms " + window.sessionStorage.token).execute();
        
                    if (!result.success) {
                        swal("Register Student Mark Failed", result.message, "error");
                        return;
                    }
                    
                }
                else{
                    // update mark
                    obj_stdMark.data.forEach(async (item) => {
                        if(mark != "" || mark != null){
                            let pk_id = item.pk_id;
                            form.append("pk_id", pk_id);
                            form.append("mark", mark);
                            form.append("recordstatus", 'EDT');
    
                            let result = await new post(host+"api_lecturer_picoms/public/misLectStdMark/update",form,"picoms " + window.sessionStorage.token).execute();
    
                            // if (!result.success) {
                            //     swal("Update Student Mark Failed!", stdId, "error");
                            //     return;
                            // }
                        }                        

                    });
                    
                }           
            })
        );        
        
        $("#gear").prop('class','fa fa-check-circle fa-2x m-b');        
        $("#load_text").html('Waiting to finish....');        
        setTimeout(() => {
            $("#gear").prop('class','fa fa-cog fa-spin fa-3x m-b');        
            $("#load_text").html('Loading...'); 
            window.location.reload();
        },Math.random() * 1000);

    }
    
    setTimeout(() => {
        main();
    },Math.random() * 1000);
}
//-------------------------------------------------- end upload excel --------------------------------------------------//


function subItemList(id, cotDet, returnValue){
    var form = new FormData();
    form.append("fk_lect_crs", id);
    form.append("fk_cotDet", cotDet);

    var settings = {
        "url": host+"api_lecturer_picoms/public/misLectCrsDet/listSubItem",
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
        obj_subItem = JSON.parse(response);
        returnValue();
    });
}

function chkStdMark(std, item, returnValue){
    var form = new FormData();
    form.append("fk_lectCrsDet", item);
    form.append("fk_student", std);

    var settings = {
        "url": host+"api_lecturer_picoms/public/misLectStdMark/chkStdMark",
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

    request.done(function (response){
        obj_stdMark = JSON.parse(response);
        // console.log(obj_stdMark);
        returnValue();
    });

    request.fail(function(){
        obj_stdMark = {"success":false,"message":"no Data Found!","data":""};
        returnValue();
    });
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

  function load_pgmCode(pgmCode){
    $(".pgmCode").html(pgmCode);
    $("#group_btn").prop('class','col-md-6 text-right');
    $("#btn_markStd").prop('disabled',false);
    $("#ip_all").prop('disabled',false);
    $("#mrf_all").prop('disabled',false);
    checkingBtn(); //utk btn kat kiri  biru 'MARKS +'

  }

  function compareByStd_id(a, b) {
    if (a.student_id < b.student_id) {
      return -1;
    }
    if (a.student_id > b.student_id) {
      return 1;
    }
    return 0;
  }

  function compareByPgmCode(a, b) {
    if (a.pgmCode < b.pgmCode) {
      return -1;
    }
    if (a.pgmCode > b.pgmCode) {
      return 1;
    }
    return 0;
  }

  function stdByAcaCalCrs2(acaCal, crs, returnValue) {
    var form = new FormData();
    form.append("aca_session", acaCal);
    form.append("crs_code", crs);
  
    var settings = {
      url: host + "api_pengurusan_pelajar/public/misStdRegsub/listByAcaCalCrs2",
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
      obj_stdRegCrs = JSON.parse(response);
    //   arr = JSON.parse(response);
    //   filteredArr = arr.filter(recApplication => recApplication  !== 'DEL');
    //   obj_stdRegCrs = filteredArr;
    //   console.log(obj_stdRegCrs);
      returnValue();
    });
  }






  function checkingBtn(){
    if (window.sessionStorage.BtnDisabled === '656e61626c65') {
        // $('.BtnDisabled').removeClass('none');
        $('.BtnDisabled').prop('disabled', false);

    } else if(window.sessionStorage.BtnDisabled === '64697361626c65') {
        $('.BtnDisabled').prop('disabled', true);
        // $('.BtnDisabled').addClass('none');
    }
 }

 