$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let getSession = window.sessionStorage.cal_year;
    let cal_cohort = window.sessionStorage.cal_cohort;

    $.fn.select2.defaults.set( "theme", "bootstrap" );

    // select session
    acaCalActive(function(){
        $('#aca_session').append('<option value="">- Choose Academic Session -</option>');
        $('#cur_year').append($('<option value: "">- Choose -</option>'));
        // $('#select_year').append($('<option value: "">- Choose Academic Calendar -</option>'));
        let names = "";
        $.each(obj_kalendar.data, function (i, item){
            let curyear = item.cur_year.replace('/','');
            select = "";
            if(getSession == item.cur_year && cal_cohort == item.cal_cohort){
                select = "selected";
            }
            if(names != curyear+'/'+item.cal_cohort){
                names = curyear+'/'+item.cal_cohort;
                $('#aca_session').append('<option '+select+' value="'+item.cur_year+'" calSem="'+item.cal_cohort+'">'+curyear+'/'+item.cal_cohort+'</option>');
                $('#cur_year').append('<option value="" calYear="'+item.cur_year+'" calSem="'+item.cal_cohort+'">'+curyear+'/'+item.cal_cohort+'</option>');

            }
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:'
        });
    });

    if(getSession != null && cal_cohort != null){
        listCrsReg(getSession, cal_cohort, function(){
            $("#loading_modal").modal('show');
            createTbl(obj_regCrs.data);
        });
        window.sessionStorage.removeItem('cal_year');
        window.sessionStorage.removeItem('cal_cohort');
        window.sessionStorage.removeItem('aca_cal');
        window.sessionStorage.removeItem('fk_course');
    }
});
var confirmed = false;


// onchange select academic session
$('#aca_session').change(function(){
    let selectSession = $('#aca_session').val();
    let sem = $("#aca_session option:selected").attr("calSem");

    listCrsReg(selectSession, sem, function(){
        // $("#loading_modal").modal('show');
        createTbl(obj_regCrs.data);
    });
});

$('#cur_year').change(function(){
    let selectSession = $("#cur_year option:selected").attr("calYear");
    let sem = $("#cur_year option:selected").attr("calSem");
    let year = selectSession.replace('/','-');
    $('#crs_code').html('');

    // select Academic Calendar Type
    catByYearSem(year, sem, function(){
        $('#acaCal_type').html('');
        $('#acaCal_type').append($('<option value: "">- Choose -</option>'));
        $.each(obj_kalendar.data, function (i, item) {
            $('#acaCal_type').append('<option value="'+item.cal_id+'">'+item.category+'</option>');
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:',
        });
    });
});


// onchange Academic Calendar Type
$('#acaCal_type').change(function(){
    let fk_acaCal = $(this).val();

    // select Course Offer
    grpByCrsByCal(fk_acaCal, function(){
        $('#crs_codes').html('');

        $.each(obj_cotDet.data, function (i, item){

            $('#crs_codes').append($('<option value="'+item.fk_course+'">'+item.crs_code.toUpperCase()+' - '+item.crs_name.toUpperCase()+'</option>'));

        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:'
        });
    });
});

paperType(function(){
    $('#tbl_paper_type').html('');
    $('#tbl_paper_type').append('<option value="">- Choose -</option>');
    $.each(obj_pprType.data, function(i, item){
        $('#tbl_paper_type').append('<option value="'+item.pk_id+'">'+item.paper_type.toUpperCase()+'</option>');
    });
});




function detail(indexs, session, category, crsCode, crsName, idSession, fk_course){
    console.log(indexs+','+session+','+category+','+crsCode+','+crsName+','+ idSession);
    let d = JSON.parse($("#dataList").val());
    let data = d[indexs];

    window.sessionStorage.aca_cal = data.aca_session;
    window.sessionStorage.cal_cohort = data.cal_cohort;
    window.sessionStorage.fk_course = data.fk_crs;
    window.sessionStorage.cal_year = data.cal_year;
    // window.location.replace('exam_jadDetail.html');
    // window.location.replace('course_Exam.html');
    window.sessionStorage.content = "course_Exam";
    $('#content').load('course_Exam.html');

    listCourseExam = [];

    listCourseExam.push({

        session: session,
        category: category,
        crsCode: crsCode,
        crsName: crsName,
        idSession: idSession,
        fk_course: fk_course,

    });

    window.sessionStorage.crsData = JSON.stringify(listCourseExam);

}


function createTbl(data){
    var columns = [
        { "name": "bil", "title": "No." },
        { "name": "dtp_year", "title": "Academic Session" },
        { "name": "category", "title": "Category" },
        { "name": "course", "title": "Course", "breakpoints": "md sm xs" },
        // { "name": "totalStd", "title": "Students", "breakpoints": "md sm xs" },
        { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
    ];

    let bil = 1;
    let convertList = JSON.stringify(data);
    $("#dataList").val(convertList);
    var list = [];

    async function doSomethingAsync(item) {
        return new Promise(resolve => {
            setTimeout(() => {
                $("#load_text").html(item);
                resolve();
            }, Math.random() * 1000);
        });
    }

    async function main() {
        await $("#loading_modal").modal('show');
        await Promise.all(                        
            data.map(async (item,i) => {
                await doSomethingAsync(item.crs_name);

                // var form = new FormData();
                // form.append("aca_session", item.aca_session);
                // form.append("crs_code", item.fk_crs);

                // let return_total = await new post(host+'api_pengurusan_pelajar/public/misStdRegsub/sumStdByAcaCalCrs',form,"picoms " + window.sessionStorage.token).execute();
                
                // let total = 0;

                // if(return_total.success){
                //     dataAca = return_total.data;
                //     total = dataAca[0].total;
                // }
        
                list.push({
                    bil: bil++, 
                    dtp_year: item.cal_year.replace('/','')+'/'+item.cal_cohort, 
                    course: '<span class="text-uppercase"><b>'+item.crsCode+'</b><br>'+item.crs_name+'</span>', 
                    category: item.category, 
                    // totalStd: total,
                    // upt_btn: '<button class="btn btn-icon accent" title="Details" onclick="detail(\'' + i + '''+','+'+item.cal_year.replace('/','')+'/'+item.cal_cohort+','+item.category+','+item.crsCode+','+item.crs_name+'\')"><i class="ion-ios-list-outline"></i></button>'
                    upt_btn: '<button class="btn btn-icon accent" title="Details" onclick="detail(\'' + i + '\', \'' + item.cal_year.replace('/', '') + '/' + item.cal_cohort + '\', \'' + item.category + '\', \'' + item.crsCode + '\', \'' + item.crs_name + '\', \'' + item.aca_session + '\', \'' + item.fk_crs +'\')"><i class="ion-ios-list-outline"></i></button>'

                });

            })

        )

        $("#loading_modal").modal('hide');

        $("#cotList").html('');
        $("#cotList").footable({
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
    }

    main();
    
}


function listCrsReg(year, sem, returnValue){
    var form = new FormData();
    form.append('cur_year', year);
    form.append('cal_cohort', sem);

    var settings = {
        "url": host+"api_pengurusan_pelajar/public/misStdRegsub/listCalYearSem",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form,
    };

    $.ajax(settings).done(function (response){
        obj_regCrs = JSON.parse(response);
        returnValue();        
    });
}

//-------------------------------------------------- add timetable --------------------------------------------------//
$('#formAddTimetable').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Course Timetable",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            // let clg_id = $('#clgId').val();
            let fk_acaCal = $('#acaCal_type').val();
            let crs_code = $('#crs_codes').val();
            let tbl_paper_type = $('#tbl_paper_type').val();
            let tbl_date_start = $('#tbl_date_start').val();
            let tbl_time_start = $('#tbl_time_start').val();
            let tbl_time_end = $('#tbl_time_end').val();

            //utk display table tue trus 22sep2023
            var selectedOption = $('#cur_year option:selected');
            let calsem = selectedOption.attr('calsem');
            let calyear = selectedOption.attr('calyear');
            
            // $fk_acaCal = $request->input('fk_acaCal');
            // $fk_course = $request->input('fk_course');
            // $tbl_paper_type = $request->input('tbl_paper_type');
            // $tbl_date_start = $request->input('tbl_date_start');
            // $tbl_time_start = $request->input('tbl_time_start');
            // $tbl_time_end = $request->input('tbl_time_end');
            // $recordstatus = $request->input('recordstatus');

            // $obj = mis_exam_timetable::create([
            //     'fk_acaCal' => $fk_acaCal,
            //     'fk_course' => $fk_course,
            //     'tbl_paper_type' => $tbl_paper_type,
            //     'tbl_date_start' => $tbl_date_start,
            //     'tbl_time_start' => $tbl_time_start,
            //     'tbl_time_end' => $tbl_time_end,
            //     'recordstatus' => $recordstatus
            // ]);
            
            var form = new FormData();
            // form.append("clg_id", clg_id);
            form.append("fk_acaCal", fk_acaCal);
            form.append("fk_course", crs_code);
            form.append("tbl_paper_type", tbl_paper_type);
            form.append("tbl_date_start", tbl_date_start);
            form.append("tbl_time_start", tbl_time_start);
            form.append("tbl_time_end", tbl_time_end);
            form.append("recordstatus", "ADD");
            // console.log( calsem +" "+ calyear);
            var settings = {
                "url": host+"api_exam_picoms/public/misExamTimetbl/register",
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
                    // createTbl(calyear, calsem);
                    // $('#reg-Timetbl').modal('hide');

                }
                else{ swal("Failed", response.message, "error"); }
            });
        });
    }
});
//-------------------------------------------------- end add timetable --------------------------------------------------//

$("#form_upload").on('submit',function(e){
    if(!confirmed){
        e.preventDefault();
        $("#loading_mode").modal('show');

        read_file('file',function(){
            if(data_set.length > 0){
                async function doSomethingAsync(item) {
                    return new Promise(resolve => {
                        setTimeout(() => {
                            // $("#load_text").html(courseCode + ' - ' + item.COURSE_CODE);
                            resolve();
                        }, Math.random() * 1000);
                    });
                }

                async function main() {
                    var ptype = '';
                    
                    //get Location FK
                    let location_data = [];
                    let obj_location = await new get(host+'api_tetapan_picoms/public/misPrmLoc/listByCamAct/'+window.sessionStorage.idPage,'picoms '+window.sessionStorage.token).execute();
                    if(obj_location.success){
                        location_data = obj_location.data;
                    }

                    //get FK cal_category
                    let cal_category_data = [];
                    let obj_cal_category = await new get(host+'api_tetapan_picoms/public/acaCalCategory/list','picoms '+window.sessionStorage.token).execute();
                    if(obj_cal_category.success){
                        cal_category_data = obj_cal_category.data;
                        // console.log(cal_category_data);
                    }

                    //get FK calendar 
                    let calendar_data = [];
                    let obj_calendar = await new get(host+'api_tetapan_picoms/public/misPrmCalendar/listActive','picoms '+window.sessionStorage.token).execute();
                    if(obj_calendar.success){
                        calendar_data = obj_calendar.data;
                        // console.log(calendar_data);
                    }

                    //get FK course
                    let course_data = [];
                    let obj_course = await new get(host+'api_tetapan_picoms/public/misPrmCourse/list','picoms '+window.sessionStorage.token).execute();
                    if(obj_course.success){
                        course_data = obj_course.data;
                        // console.log(course_data);
                    }

                    //get paper_type
                    let ptype_data = [];
                    let obj_pprType = await new get(host+'api_exam_picoms/public/misExamPprType/list','picoms '+window.sessionStorage.token).execute();
                    if(obj_pprType.success){
                        ptype_data = obj_pprType.data;
                        // console.log(ptype_data);
                    }

                    await Promise.all(
                        data_set.map(async (item,i) => {
                        console.log(data_set);
                            
                            doSomethingAsync(item);

                            let session = item.SESSION;
                            let year = session.substring(0, 4) + '/' + session.substring(4, 8);
                            let cohort = session.slice(-1);


                             //get course code
                             let obj_ccodeFiler = course_data.find(x=>x.crs_code == item.COURSE_CODE);
                             if(obj_ccodeFiler != undefined){
                                 courseCode = obj_ccodeFiler.crsId;
                             }

                            //get cal_category
                            let obj_cal_categoryFiler = cal_category_data.find(x=>x.category == item.ACADEMIC_CALENDER_TYPE);
                            if(obj_cal_categoryFiler != undefined){
                                cal_category = obj_cal_categoryFiler.pk_id;
                                console.log(cal_category);
                            }
                            
                            // var ptype = '';

                            //get paper_type
                            let obj_ptypeFiler = ptype_data.find(x=>x.paper_type == item.PAPER_TYPE);
                            if(obj_ptypeFiler != undefined && obj_ptypeFiler != null){
                                ptype = obj_ptypeFiler.pk_id;
                            }

                            var form = new FormData();
                            form.append("fk_course", courseCode);

                            // console.log('CUR_YEAR'+year+', COHOR '+cohort+',cal_category '+cal_category);
                            var form2 = new FormData();

                            form2.append("cur_year", year);
                            form2.append("cal_cohort", cohort);
                            form2.append("cal_category", cal_category);
                            let obj2 = await new post(host + "api_tetapan_picoms/public/misPrmCalendar/getid", form2, 'picoms ' + window.sessionStorage.token).execute();
                            datastd = obj2.data;
                            let fk_cal = datastd.cal_id;
                            // console.log(fk_cal);
      
                           // Your date value
                            // var dateValue = 44866;

                            // Convert the date value to a readable date string
                            var date = new Date((item.DATE - 25569) * 86400 * 1000); // Convert Excel date to milliseconds

                            var yearraeltime = date.getFullYear();
                            var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if needed
                            var day = date.getDate().toString().padStart(2, '0'); // Add leading zero if needed

                            var formattedDate = yearraeltime + '-' + month + '-' + day;

                            // Output the formatted date
                            console.log(formattedDate);

                            // alert('daysSinceEpochToDa');
                            
                            // form.append("clg_id", window.sessionStorage.idPage);
                            form.append("fk_acaCal", fk_cal);
                            form.append("tbl_paper_type", ptype);
                            form.append("tbl_date_start", formattedDate);
                            form.append("tbl_time_start", fractionOfDayToTime(item.START_TIME));
                            form.append("tbl_time_end", fractionOfDayToTime(item.END_TIME));
                            form.append("recordstatus", "ADD");                
                            let obj = await new post(host+"api_exam_picoms/public/misExamTimetbl/register",form,'picoms '+ window.sessionStorage.token).execute();
                            if(obj.success){
                                swal("Success",courseCode + ' - ' + item.COURSE_CODE,'success');
                                window.location.reload();
                            }
                            else{
                                // swal("Error",courseCode + ' - ' + item.COURSE_CODE,'error');
                                // $("#loading_mode").modal('hide');                                
                                // return;
                            }
                        })
                    )

                }

                main();              

            }
        });
    }
});


function fractionOfDayToTime(fractionOfDay) {
    const hours = Math.floor(fractionOfDay * 24);
    const minutes = Math.floor((fractionOfDay * 24 * 60) % 60);
    const seconds = Math.floor((fractionOfDay * 24 * 60 * 60) % 60);
    return `${hours}:${minutes}:${seconds}`;
}
  
function daysSinceEpochToDate(daysSinceEpoch) {

    const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const epochDate = new Date(Date.UTC(1970, 0, 1)); // The epoch date in UTC (January 1, 1970)
  
    const targetDate = new Date(epochDate.getTime() + daysSinceEpoch * millisecondsPerDay);
    return targetDate.toISOString().split('T')[0];
}
  

function read_file(file_name,returnValue){
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

            returnValue();
            
            // $("#list_data").val(JSON.stringify(data_set));
            // addExcelStd(data_set);
         });
        }
    }
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

function paperType(returnValue){
    var settings = {
        "url": host+"api_exam_picoms/public/misExamPprType/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_pprType = response;
        returnValue();        
    });
}