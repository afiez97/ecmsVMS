$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let std_studentid = window.sessionStorage.std_studentid;
    let token = window.sessionStorage.token;

    if(token == null){
        logOut();
    }
    else{
        let obj = new get(host+'api_pengurusan_pelajar/public/misStdInfo/show/'+std_studentid,'picoms '+token).execute();
        // console.log(obj)
        if(obj.success){
            datastd = obj.data;

            $(".student_id").html(std_studentid);
            $(".name_std").html(datastd.sti_name);
            $(".noic").html('('+datastd.sti_icno+')');
            $(".programme_name").html(datastd.pgm_id+" - "+datastd.pgm_name);
            $(".intake_std").html('INTAKE: '+datastd.cur_intake);
        }
        obj = new get(host+"api_pengurusan_pelajar/public/curAcademic/chkStdCurSem/"+std_studentid,'picoms '+token).execute();
        // console.log(obj)
        if(obj.success){
            let data = obj.data;
            data.forEach(async (item,i) => {
                let expand = '';
                if(i == 0){
                    expand = 'in';
                }
                let labels = "";
                let acaSession = item.cur_year.replace('/','') + '/' + item.cal_cohort;                

                let results = "<tr><td colspan='7' class='text-center text-muted'><i>Result Not Display...</i></td></tr>";
                let tCredit = 0;
                let count_Pointer = 0;
                let tPointer = 0;
                let tTcp = 0;
                let gpa = 0.00;
                let cgpa = 0.00;
                let btn_disabled = 'disabled';

                if(item.std_senate_endorsement != null && item.std_release == "checked"){
                    var form = new FormData();
                    form.append("std_studentid", std_studentid);
                    form.append("aca_session", item.fk_acaCal);
                    let objCourse = await new post(host+"api_pengurusan_pelajar/public/misStdRegsub/listByActStd",form,'picoms '+token).execute();                    
                    if(objCourse.success){
                    // $("#resultprint").prop("disabled", false);
                    btn_disabled = '';

                        let dataCourse = objCourse.data;
                        results = "";  
                        gpa = item.std_gpa;
                        cgpa = item.std_cgpa;
                        labels = "bg-success";                  
    
                        $.each(dataCourse,function(u,uData){
                            // console.log(uData);
                            // console.log(dataCourse);
    
                            tCredit += (uData.crs_credit)*1;
                            count_Pointer = ((uData.point)*1) * ((uData.crs_credit)*1);
                            tTcp += count_Pointer;
                            tPointer += (uData.point)*1;

                            console.log(uData.mrf);
                            if (uData.point <= 2.33){
                                btnGenerate = ''; 
                            }
                            else{
                                btnGenerate = 'disabled'; 
                            }

                        

                            if(uData.app_type  != null){
                                if(uData.app_status  == "Completed"){
                                    appStatus = ` <button class="md-btn md-flat m-b-sm w-xs text-success" " > `+uData.app_status+`</i> </button> `;
                                }
                                else if(uData.app_status  == 'In Progress') {
                                    appStatus = `<button class="md-btn md-flat m-b-sm w-xs text-warning" >`+uData.app_status+`</i> </button>`; 
                                }else if(uData.app_status  == 'Reject') {
                                    appStatus = `<button class="md-btn md-flat m-b-sm w-xs text-danger" >`+uData.app_status+`</i> </button>`; 
                                }
                                else if(uData.app_status  == 'Approved') {
                                    appStatus = `<button class="md-btn md-flat m-b-sm w-xs text-success" >`+uData.app_status+`</i> </button>`; 
                                }
                             }   
                            else{
                                appStatus = ``;
                            
                            }
                        
                                // btnStatus = `<td class="text-right">
                                //                 <div class="btn-group-vertical m-b">
                                //                     <button type="button" class="btn btn-sm success" title="Recheck" onclick="loadData('` + uData.rsb_id + `', '` + uData.fk_course + `', '` + uData.fk_cotDet + `', '` + acaSession + `', '` + uData.crsCode + `', '` + uData.crs_name + `', '` + item.fk_acaCal + `')"> <i class="ion-android-create"></i> Recheck</button>
                                //                     <button type="button" class="btn btn-sm warning" title="Re-sit" onclick="loadReseat('` + uData.rsb_id + `', '` + uData.fk_course + `', '` + uData.fk_cotDet + `', '` + acaSession + `', '` + uData.crsCode + `', '` + uData.crs_name + `', '` + item.fk_acaCal + `')" `+ btnGenerate+`><i class="ion-loop"></i> Re-sit</button>
                                //                     <button type="button" class="btn btn-sm white" disabled><i class="ion-android-create"></i> Special Exam</button>
                                //                 </div>
                                //             </td>`;

                                // btnStatus = `<td class="text-right">
                                //                 <div class="btn-group-vertical m-b">
                                //                     <button type="button" class="btn btn-sm success" title="Recheck" onclick="loadData('` + uData.rsb_id + `', '` + uData.fk_course + `', '` + uData.fk_cotDet + `', '` + acaSession + `', '` + uData.crsCode + `', '` + uData.crs_name + `', '` + item.fk_acaCal + `')"> <i class="ion-android-create"></i> Recheck</button> `+
                                //                     btnResit  +`                                                  
                                //                 </div>
                                //             </td>`;

                                if (uData.grade == 'A' || uData.grade == 'A+' || uData.grade == 'A-' || uData.grade == 'B' || uData.grade == 'B+' || uData.grade == 'B-' || uData.grade == 'C' || uData.grade == 'C+') 
                                {
                                    if (uData.mrf === 'checked') {
                                    btnResit = `<button type="button" class="btn btn-sm warning" title="Re-sit" onclick="loadReseat('` + uData.rsb_id + `', '` + uData.fk_course + `', '` + uData.fk_cotDet + `', '` + acaSession + `', '` + uData.crsCode + `', '` + uData.crs_name + `', '` + item.fk_acaCal + `')" `+ btnGenerate+`><i class="ion-loop"></i> Re-sit</button>`;
                                        
                                    } else {
                                    btnResit = ``;
                                        
                                    }
                                }else {
                                    btnResit = `<button type="button" class="btn btn-sm warning" title="Re-sit" onclick="loadReseat('` + uData.rsb_id + `', '` + uData.fk_course + `', '` + uData.fk_cotDet + `', '` + acaSession + `', '` + uData.crsCode + `', '` + uData.crs_name + `', '` + item.fk_acaCal + `')" `+ btnGenerate+`><i class="ion-loop"></i> Re-sit</button>`;
                                    
                                }
                            // btnStatus = `<td class="text-right">
                            //                     <div class="btn-group-vertical m-b">
                            //                         <button type="button" class="btn btn-sm success" title="Recheck" onclick="loadData('` + uData.rsb_id + `', '` + uData.fk_course + `', '` + uData.fk_cotDet + `', '` + acaSession + `', '` + uData.crsCode + `', '` + uData.crs_name + `', '` + item.fk_acaCal + `')"> <i class="ion-android-create"></i> Recheck</button> `+
                            //                         btnResit  +`      
                            //                         <button type="button" class="btn btn-sm white" title="Recheck" onclick="loadSExam('` + uData.rsb_id + `', '` + uData.fk_course + `', '` + uData.fk_cotDet + `', '` + acaSession + `', '` + uData.crsCode + `', '` + uData.crs_name + `', '` + item.fk_acaCal + `')"> <i class="ion-android-create"></i> Special Exam</button> `+`
                            
                            //                     </div>
                            //                 </td>`;
                            btnStatus = `<td class="text-right">
    <div class="btn-group-vertical m-b">
        `+ (uData.mrf !== 'checked' && uData.ip !== 'checked' ? `<button type="button" class="btn btn-sm success" title="Recheck" onclick="loadData('` + uData.rsb_id + `', '` + uData.fk_course + `', '` + uData.fk_cotDet + `', '` + acaSession + `', '` + uData.crsCode + `', '` + uData.crs_name + `', '` + item.fk_acaCal + `')"> <i class="ion-android-create"></i> Recheck</button> ` : '') +
        btnResit +
        `<button type="button" class="btn btn-sm white" title="Recheck" onclick="loadSExam('` + uData.rsb_id + `', '` + uData.fk_course + `', '` + uData.fk_cotDet + `', '` + acaSession + `', '` + uData.crsCode + `', '` + uData.crs_name + `', '` + item.fk_acaCal + `')"> <i class="ion-android-create"></i> Special Exam</button> `+
    `</div>
</td>`;


                            uData.app_type = uData.app_type != null ? uData.app_type : '';
                            uData.app_status = uData.app_status != null ? uData.app_status : '';

                            if (uData.mrf === 'checked') {
                                labelCourseSts = `<br><p class="text-danger m-b-md">*`+uData.rsb_type+`/MRF</p>`;
                            }else if(uData.ip === 'checked'){
                                labelCourseSts = `<br><p class="text-danger dk m-b-md">*`+uData.rsb_type+`/IP</p>`;
                            }else{labelCourseSts= '';}
                            results += `
                            <tr>
                                <td>` + (u + 1) + `</td>
                                <td class="text-center">` + uData.crsCode + `</td>
                                <td>` + uData.crs_name.toUpperCase()+labelCourseSts+ `</td>
                                <td class="text-center">` + uData.crs_credit + `</td>
                                <td class="text-center">` + uData.grade + `</td>
                                <td class="text-center">` + uData.point + `</td>
                                <td class="text-right">` + count_Pointer.toFixed(2) + `</td>
                                <td class="text-center">` + uData.app_type +`<br>`+ appStatus + `</td>
                                `+btnStatus+`
                            </tr>`;

                        
                        });
                    }                    
                }
                else if(item.std_remarks != null){
                    results = `<tr><td colspan="8" class="text-center"><b class="text-danger">`+item.std_remarks+`</b><br>
                    Please refer to the Finance Department for the student's financial statement or outstanding balance
                    </td></tr>`;
                }
                else{
                    result = `<tr><td colspan="8" class="text-center">
                    Result Not Release...
                    </td></tr>`;
                }

                $(".aca_session").append(
                    `<div class="panel box no-border m-b-xs">
                    <div class="box-header p-y-sm">
                    
                      <span class="pull-right label `+labels+` text-sm">Semester `+item.std_semester+`</span>
                      <a data-toggle="collapse" data-parent="#accordion" data-target="#r_`+item.pk_cur_academic+`">
                        <b class="text-info">`+acaSession+`</b>
                      </a>
                      
                    </div>
                    <div id="r_`+item.pk_cur_academic+`" class="collapse `+expand+`">
                    <button class="btn green-200 m-a btn_summary m-t" onclick="viewStudent('` + std_studentid + `','` + datastd.sti_name + `','` + item.fk_acaCal + `','` + item.cur_year + `','` +item.cal_cohort + `','` + item.std_semester + `')"  id ="resultprint" `+btn_disabled+`>
                        <i class="fa fa-print"></i> Result
                    </button>

                
                      <div class="box-body table-responsive">
                      
                      
                        <table class="table m-b-none table-bordered table-striped">
                        
                        <thead class="teal-100"><tr>
                        <th>No.</th>
                        <th>Course Code</th>
                        <th>Course Name</th>
                        <th>Credit</th>
                        <th>Grade</th>
                        <th>Point</th>
                        <th class="text-right">Total Grade Point</th>
                        <th>Type of Exam</th>
                        <th class="text-right">Action</th>
                        </tr></thead>
                        <tbody>
                            `+results+`
                        </tbody>

                        <tfoot>
                        <tr><td colspan="3"><b>Total</b></td><td class="text-center"><b>`+tCredit+`</b></td><td></td><td class="text-right"></td><td class="text-right" ><b>`+tTcp.toFixed(2)+`</b></td></tr>
                        <tr class="teal-50"><td colspan="7"></td><td class="text-right"><b>GPA : `+gpa+`</b></td><td class="text-right"><b>CGPA : `+cgpa+`</b></td></tr>
                        </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>`
                )

             

            });
        }
        else{
            swal("No Data Found","No Result Display","info");
        }
    }// get access

});

// load data announcement
function loadData(rsb_id, fk_course, fk_cotDet,acaSession, crsCode, crs_name, fk_acaCal){


    let courseName = crsCode + ' - ' + crs_name;
    // let data = JSON.parse($("#dataList").val());
    $('#app_rsb_id').val(rsb_id);
    $('#app_fk_course').val(fk_course);
    $('#app_fk_cotDet').val(fk_cotDet);
    $('#app_fk_acaCal').val(fk_acaCal);
    
    $('#app_session').html(acaSession);
    $('#app_crsCode').html(courseName);
    $("#loadRecheck").modal("show");
}

// load Reseat
function loadReseat(rsb_id, fk_course, fk_cotDet,acaSession, crsCode, crs_name, fk_acaCal){


    let courseName = crsCode + ' - ' + crs_name;
    // let data = JSON.parse($("#dataList").val());
    $('#app2_rsb_id').val(rsb_id);
    $('#app2_fk_course').val(fk_course);
    $('#app2_fk_cotDet').val(fk_cotDet);
    $('#app2_fk_acaCal').val(fk_acaCal);
    
    $('#app2_session').html(acaSession);
    $('#app2_crsCode').html(courseName);

    // $('#upt_twm_description').val(data[indexs].twm_description);
    // $('#upt_twm_sdate').val(data[indexs].twm_sdate);
    // $('#upt_twm_edate').val(data[indexs].twm_edate);
    // $('#attachment_upt').val(data[indexs].attachment);
    // $('#upt_twm_status').val(data[indexs].twm_status);    

    $("#loadReseat").modal("show");
}

function loadSExam(rsb_id, fk_course, fk_cotDet,acaSession, crsCode, crs_name, fk_acaCal){


    let courseName = crsCode + ' - ' + crs_name;
    // let data = JSON.parse($("#dataList").val());
    $('#app3_rsb_id').val(rsb_id);
    $('#app3_fk_course').val(fk_course);
    $('#app3_fk_cotDet').val(fk_cotDet);
    $('#app3_fk_acaCal').val(fk_acaCal);
    
    $('#app3_session').html(acaSession);
    $('#app3_crsCode').html(courseName);

    // $('#upt_twm_description').val(data[indexs].twm_description);
    // $('#upt_twm_sdate').val(data[indexs].twm_sdate);
    // $('#upt_twm_edate').val(data[indexs].twm_edate);
    // $('#attachment_upt').val(data[indexs].attachment);
    // $('#upt_twm_status').val(data[indexs].twm_status);    

    $("#loadSExam").modal("show");
}


//-------------------------------------------------- update announcement --------------------------------------------------//
var confirmed = false;

$("#formRecheck").on('submit', function (e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Recheck Application",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Add",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let app_rsb_id = $("#app_rsb_id").val();
            let app_stdid = window.sessionStorage.std_studentid;
            let app_fk_course = $("#app_fk_course").val();
            let app_type = 'RE-CHECK';
            let app_reason = $("#app_reason").val();
            let statusrekod = "ADD";
            let app_upload = $("#app_upload")[0].files[0];

            var form = new FormData();
            form.append("student_id", app_stdid);
            form.append("fk_course", app_fk_course);
            form.append("app_type", app_type);
            form.append("app_reason", app_reason);
            form.append("app_status", 'In Progress');
            form.append("recordstatus", statusrekod);
            form.append("rsb_id", app_rsb_id);
            form.append("app_upload", app_upload);
    
            var settings = {
                "url": host+"api_exam_picoms/public/misExamApp/registerRecheckResit",
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
                    Swal(result.message, result.data, "error");
                    return;
                }
                window.location.reload();
            });
        });
    }
});

$("#formReseat").on('submit', function (e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Re-sit Application",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Add",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let app_rsb_id = $("#app2_rsb_id").val();
            let app_stdid = window.sessionStorage.std_studentid;
            let app_fk_course = $("#app2_fk_course").val();
            let app_type = 'RE-SIT';
            let app_reason = $("#app2_reason").val();
            let statusrekod = "ADD";
            let app_upload = $("#app2_upload")[0].files[0];



            var form = new FormData();
            form.append("student_id", app_stdid);
            form.append("fk_course", app_fk_course);
            form.append("app_type", app_type);
            form.append("app_reason", app_reason);
            form.append("app_status", 'In Progress');
            form.append("recordstatus", statusrekod);
            form.append("rsb_id", app_rsb_id);
            form.append("app_upload", app_upload);

    
            var settings = {
                "url": host+"api_exam_picoms/public/misExamApp/registerRecheckResit",
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
                    Swal(result.message, result.data, "error");
                    return;
                }
                window.location.reload();
            });
        });
    }
});

$("#formSExam").on('submit', function (e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Special Exam Application",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Add",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let app_rsb_id = $("#app3_rsb_id").val();
            let app_stdid = window.sessionStorage.std_studentid;
            let app_fk_course = $("#app3_fk_course").val();
            let app_type = 'SPECIAL EXAM';
            let app_reason = $("#app3_reason").val();
            let statusrekod = "ADD";
            let app_upload = $("#app3_upload")[0].files[0];



            var form = new FormData();
            form.append("student_id", app_stdid);
            form.append("fk_course", app_fk_course);
            form.append("app_type", app_type);
            form.append("app_reason", app_reason);
            form.append("app_status", 'In Progress');
            form.append("recordstatus", statusrekod);
            form.append("rsb_id", app_rsb_id);
            form.append("app_upload", app_upload);

    
            var settings = {
                "url": host+"api_exam_picoms/public/misExamApp/registerRecheckResit",
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
                    Swal(result.message, result.data, "error");
                    return;
                }
                window.location.reload();
            });
        });
    }
});
//-------------------------------------------------- end update announcement --------------------------------------------------//


function viewStudent(studID, stud_name, aca_session, year, cohort, sem) {

    listPrintExam = [];

    listPrintExam.push({
        stud_name: stud_name,
        studId: studID,
        aca_session: aca_session,
        cohort: cohort,
        year: year,
        sem: sem,
    });

    window.sessionStorage.listPrintExam = JSON.stringify(listPrintExam);

    window.open("print_ExamStudent.html");

}