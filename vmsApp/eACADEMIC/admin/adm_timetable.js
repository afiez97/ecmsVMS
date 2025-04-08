
$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let listCurYear = [];
    let select_year = window.sessionStorage.select_year;
    let select_cohort = window.sessionStorage.select_cohort;
    let clg_id = window.sessionStorage.idPage;
    $('#clgId').val(clg_id);

    $.fn.select2.defaults.set( "theme", "bootstrap" );

    // select Academic Calendar
    acaCalActive(function(){
        $('#cur_year').append($('<option value: "">- Choose -</option>'));
        $('#select_year').append($('<option value: "">- Choose Academic Calendar -</option>'));

        $.each(obj_kalendar.data, function (i, item){

            let curyear = item.cur_year.replace('/','');
            var index = listCurYear.findIndex(function(it, i2){
                return it.cur_year === curyear+'/'+item.cal_cohort
            });

            if(index < 0){
                listCurYear.push({
                    cur_year:curyear+'/'+item.cal_cohort
                });

                select = "";
                if(select_year == item.cur_year && select_cohort == item.cal_cohort){
                    select = "selected";
                }
                $('#cur_year').append('<option value="" calYear="'+item.cur_year+'" calSem="'+item.cal_cohort+'">'+curyear+'/'+item.cal_cohort+'</option>');
                $('#select_year').append('<option value="'+item.cur_year+'" calSem="'+item.cal_cohort+'" '+select+'>'+curyear+'/'+item.cal_cohort+'</option>');
            }

        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:',
        });
    });

    if(!(select_year == null && select_cohort == null)){
        createTbl(select_year.replace('/','-'), select_cohort);
        window.sessionStorage.removeItem('select_year');
        window.sessionStorage.removeItem('select_cohort');
    }
});
var confirmed = false;


//-------------------------------------------------- function onchange --------------------------------------------------//
// onchange Timetable Type
$('#select_year').change(function(){
    let type = $('#select_year').val().replace('/','-');
    let sem = $("#select_year option:selected").attr("calSem");
    createTbl(type, sem);
});


// onchange Academic Calendar
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
//-------------------------------------------------- end function onchange --------------------------------------------------//


//-------------------------------------------------- add timetable --------------------------------------------------//
$('#formAddTimetable').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Timetable",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let clg_id = $('#clgId').val();
            let fk_acaCal = $('#acaCal_type').val();
            let crs_code = $('#crs_codes').val();
            let upload_jadual = $('#upload_jadual')[0].files[0];


            //utk display table tue trus 22sep2023
            var selectedOption = $('#cur_year option:selected');
            let calsem = selectedOption.attr('calsem');
            let calyear = selectedOption.attr('calyear');
            
  
            
            var form = new FormData();
            form.append("clg_id", clg_id);
            form.append("fk_acaCal", fk_acaCal);
            form.append("fk_course", crs_code);
            form.append("upload_jadual", upload_jadual);
            form.append("recordstatus", "ADD");
            // console.log( calsem +" "+ calyear);
            var settings = {
                "url": host+"api_timetbl_picoms/public/misTimetable/register",
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
                    // window.location.reload();
                    createTbl(calyear, calsem);
                    $('#reg-Timetbl').modal('hide');

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
                            $("#load_text").html(courseCode + ' - ' + item.COURSE_CODE);
                            resolve();
                        }, Math.random() * 1000);
                    });
                }

                async function main() {
                    
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
                        console.log(cal_category_data);
                    }

                    //get FK calendar 
                    let calendar_data = [];
                    let obj_calendar = await new get(host+'api_tetapan_picoms/public/misPrmCalendar/listActive','picoms '+window.sessionStorage.token).execute();
                    if(obj_calendar.success){
                        calendar_data = obj_calendar.data;
                        console.log(calendar_data);
                    }

                    //get FK course
                    let course_data = [];
                    let obj_course = await new get(host+'api_tetapan_picoms/public/misPrmCourse/list','picoms '+window.sessionStorage.token).execute();
                    if(obj_course.success){
                        course_data = obj_course.data;
                        console.log(course_data);
                    }

                    await Promise.all(
                        data_set.map(async (item,i) => {
                            
                            doSomethingAsync(item);

                            let session = item.SESSION;
                            let year = session.substring(0, 4) + '/' + session.substring(4, 8);
                            let cohort = session.slice(-1);

                            // console.log(year+cohort);

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

                            var form = new FormData();
                            form.append("fk_course", courseCode);

                            var form3 = new FormData();
                            form3.append("fk_course", courseCode);
                            
                            // console.log('CUR_YEAR'+year+', COHOR '+cohort+',cal_category '+cal_category);
                            var form2 = new FormData();

                            form2.append("cur_year", year);
                            form2.append("cal_cohort", cohort);
                            form2.append("cal_category", cal_category);
                            let obj2 = await new post(host + "api_tetapan_picoms/public/misPrmCalendar/getid", form2, 'picoms ' + window.sessionStorage.token).execute();
                                datastd = obj2.data;
                                let fk_cal = datastd.cal_id;

                                form3.append("fk_acaCal", fk_cal);

                            // var form3 = new FormData();

                            form3.append("clg_id", window.sessionStorage.idPage);
                            let obj3 = await new post(host + "api_timetbl_picoms/public/misTimetable/listData", form3, 'picoms ' + window.sessionStorage.token).execute();
                            console.log(obj3);
                            console.log("Total obj3:", obj3.data);


                            if(obj3.data >0){
                            //    alert('nananannnnnn');    
                            }
                            else{
                                form.append("clg_id", window.sessionStorage.idPage);
                                form.append("fk_acaCal", fk_cal);
                                form.append("recordstatus", "ADD");                
                                let obj = await new post(host+"api_timetbl_picoms/public/misTimetable/register",form,'picoms '+ window.sessionStorage.token).execute();
                                if(obj.success){
                                    // swal("Success",courseCode + ' - ' + item.COURSE_CODE,'success');
                                    // window.location.reload();

                                }
                                else{
                                    // swal("Error",courseCode + ' - ' + item.COURSE_CODE,'error');
                                    // $("#loading_mode").modal('hide');                                
                                    // return;
                                }     
                            }
    
                            
                        })
                    )

                    window.location.reload();
                }

                main();              

            }
        });
    }
});

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


function detail(index){
    let data = JSON.parse($("#dataList").val());
    data = data[index];

    window.sessionStorage.timetbl_id = data.timetblId;
    window.sessionStorage.select_year = data.aca_year;
    window.sessionStorage.select_cohort = data.cal_cohort;
    window.sessionStorage.fk_course = data.fk_course;
    window.location.replace('adm_timetbl_det.html');
}


function createTbl(type, sem){
    timetblList(type, sem, function(){
        let columns = [
            { "name": "bil", "title": "No." },
            { "name": "cur_year", "title": "Academic Calendar" },
            { "name": "tmt_type", "title": "Category" },
            { "name": "crs_code", "title": "Course" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" }
        ];

        let bil = 1;
        let convertList = JSON.stringify(obj_timeTbl.data);
        $("#dataList").val(convertList);
        let list_data = [];
        
        $.each(obj_timeTbl.data, function(i, field){
            let acaCal = field.aca_year.replace('/','')+'/'+field.cal_cohort;
            list_data.push({
                bil: bil++, cur_year: acaCal, tmt_type: '<span class="text-uppercase">'+field.category+'</span>', crs_code: '<span class="text-uppercase"><b>'+field.crs_code+'</b><br>'+field.crs_name+'</span>', 
                upt_btn: '<button class="btn btn-icon accent" title="Details" onclick="detail(\'' +i+ '\')" id="btnPerincian"><i class="ion-ios-list-outline"></i></button>'
            });
        });

        $('#tblTimetable').html('');
        $('#tblTimetable').footable({
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
    });
}


function timetblList(id, sem, returnValue){
    var form = new FormData();
    form.append("cur_year", id);
    form.append("cal_cohort", sem);

    var settings = {
        "url": host+"api_timetbl_picoms/public/misTimetable/timetblByYearSem",
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
        obj_timeTbl = JSON.parse(response);
        returnValue();
    });
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