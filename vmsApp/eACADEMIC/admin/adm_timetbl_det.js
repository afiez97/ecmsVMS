let usrRole = window.sessionStorage.usrRole;
let catAdmin = window.sessionStorage.usrCatEadmin;
let catCMS = window.sessionStorage.usrCatEcmis;

$(function(){
    $.ajaxSetup ({
        cache: false
    });

    $.fn.select2.defaults.set( "theme", "bootstrap" );

    let timetbl_id = window.sessionStorage.timetbl_id;
    let fk_course = window.sessionStorage.fk_course;
    let clg_id = window.sessionStorage.idPage;
    let usrRole = window.sessionStorage.usrRole;

    $("#tblCourse").html('');

    // data program
    timetblShow(timetbl_id, function(){
        $.each(obj_timeTbl.data, function(i, item){
            let docUpl = item.upload_jadual.slice(10);
            let file = item.upload_jadual;
            if(!(file == '' || file == null)){
                $('#tmt_file').html('<a target="_blank" style="color:cornflowerblue" href="'+host+'api_timetbl_picoms/public/upload_jadual/'+file+'"><span class="label info">'+docUpl+'</span></a>');
            }

            $('#aca_calendar').html(item.cal_year.replace('/','')+'/'+item.cal_cohort);
            $('#cal_type').html(item.category);
            $('#tmt_course').html(item.crs_code+' - '+item.crs_name);
            $('#pk_id').val(item.timetbl_id);
        });
    });

    // timetable detail list
    tmtDetList(timetbl_id, function(){
        if( obj_tmtDet.data.length > 0 ){ $('#btnDelete').hide(); }

        // capaianTimetable = load_capaian();
        load_capaian();
        capaianTimetable = window.capaianData;
        // console.log(capaianTimetable);
        let addTimetable = capaianTimetable[0];
        let uptTimetable = capaianTimetable[1];
        let delTimetable = capaianTimetable[2];
    
        console.log(addTimetable);
        console.log(uptTimetable);
        console.log(delTimetable);
    
        if (addTimetable == 0){
            TimetableAddDisabled = 'disabled';
        }
        else{
            TimetableAddDisabled = ''; 
        }
    
        if (uptTimetable == 0){
            TimetableUpdateDisabled = 'disabled';
        }
        else{
            TimetableUpdateDisabled = ''; 
        }
    
    
        if (delTimetable == 0){
            TimetableDelDisabled = 'disabled';
        }
        else{
            TimetableDelDisabled = ''; 
        }



        var columns = [
            { "name": "bil", "title": "No." },
            { "name": "tmt_day", "title": "Day" },
            { "name": "tmt_time", "title": "Time" },
            { "name": "tmt_venue", "title": "Venue" },
            { "name": "tmt_lecturer", "title": "Lecturer" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];
    
        let bil = 1;
        var list = [];
        let convertList = JSON.stringify(obj_tmtDet.data);
        $("#dataTimetbl").val(convertList);
    
        $.each(obj_tmtDet.data, function(i, item){
            let dayVal = '';
            if( item.tmt_day == '1' ){ dayVal = 'MONDAY' }
            else if( item.tmt_day == '2' ){ dayVal = 'TUESDAY' }
            else if( item.tmt_day == '3' ){ dayVal = 'WEDNESDAY' }
            else if( item.tmt_day == '4' ){ dayVal = 'THURSDAY' }
            else if( item.tmt_day == '5' ){ dayVal = 'FRIDAY' }
            else if( item.tmt_day == '6' ){ dayVal = 'SATURDAY' }
            else if( item.tmt_day == '7' ){ dayVal = 'SUNDAY' }
    
            list.push({
                bil: bil++, tmt_day: dayVal, tmt_time: formatTime(item.tmt_starttime)+' - '+formatTime(item.tmt_endtime), tmt_venue: '<span class="text-uppercase">'+item.loc_name+'</span>', tmt_lecturer: '<span class="text-uppercase">'+item.emp_name+'</span>',
                upt_btn: '   <button class="btn btn-icon success" title="Update" '+TimetableUpdateDisabled+' onclick="loadData(\'' +i+ '\')"><i class="ion-android-create"></i></button> ' +
                            '<button class="btn btn-icon danger" title="Delete" '+TimetableDelDisabled+' onclick="del_rekod(\''+item.pk_id+'\')"><i class="ion-trash-b"></i>'
            });
        });
    
        $("#tblTmtDet").html('')
        $("#tblTmtDet").footable({
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
    });

    // select lecturer
    crsLectList(fk_course, function(){
        $('#tmt_lecturer').append($('<option value="">- Choose -</option>'));
        $('#upt_tmt_lecturer').append($('<option value="">- Choose -</option>'));
        $.each(obj_lectCrsPrm.data, function(i, item){
            $('#tmt_lecturer').append($('<option value="'+item.emp_id+'">'+item.emp_name+'</option>'));
            $('#upt_tmt_lecturer').append($('<option value="'+item.emp_id+'">'+item.emp_name+'</option>'));
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:',
        });
    });

    // select Venue
    locCamAct(clg_id, function(){
        $('#fk_location').append($('<option value="">- Choose -</option>'));
        $('#upt_fk_location').append($('<option value="">- Choose -</option>'));
        $.each(obj_location.data, function(i, item){
            $('#fk_location').append($('<option value="'+item.loc_id+'">'+item.loc_name+'</option>'));
            $('#upt_fk_location').append($('<option value="'+item.loc_id+'">'+item.loc_name+'</option>'));
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:',
        });
    });
});
var confirmed = false;


// btn Back to admin page
$('#btnBack').click(function(){
    window.location.replace('adminPage.html');
    window.sessionStorage.removeItem('timetbl_id');
    window.sessionStorage.removeItem('fk_course');
});


//-------------------------------------------------- add details --------------------------------------------------//
$("#formAddDetail").on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Detail",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let fk_timetbl = $("#pk_id").val();
            let fk_lecturer = $("#tmt_lecturer").val();
            let tmt_day = $("#tmt_day").val();
            let tmt_starttime = $('#tmt_starttime').val();
            let tmt_endtime = $("#tmt_endtime").val();
            let tmt_slot = $('#tmt_slot').val();
            let fk_location = $('#fk_location').val();

            var form = new FormData();
            form.append("fk_timetbl", fk_timetbl);
            form.append("fk_lecturer", fk_lecturer);
            form.append("tmt_day", tmt_day);
            form.append("tmt_starttime", tmt_starttime);
            form.append("tmt_endtime", tmt_endtime);
            form.append("tmt_slot", tmt_slot);
            form.append("fk_location", fk_location);
            form.append("recordstatus", "ADD");

            var settings = {
                "url": host+"api_timetbl_picoms/public/misTimetblDet/register",
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
//-------------------------------------------------- end add details --------------------------------------------------//


//-------------------------------------------------- update details --------------------------------------------------//
$("#mdlUptDetail").on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Detail",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let pk_id = $("#pk_det").val();
            let fk_lecturer = $("#upt_tmt_lecturer").val();
            let tmt_day = $("#upt_tmt_day").val();
            let tmt_starttime = $('#upt_tmt_starttime').val();
            let tmt_endtime = $("#upt_tmt_endtime").val();
            let tmt_slot = $('#upt_tmt_slot').val();
            let fk_location = $('#upt_fk_location').val();

            var form = new FormData();
            form.append("pk_id", pk_id);
            form.append("fk_lecturer", fk_lecturer);
            form.append("tmt_day", tmt_day);
            form.append("tmt_starttime", tmt_starttime);
            form.append("tmt_endtime", tmt_endtime);
            form.append("tmt_slot", tmt_slot);
            form.append("fk_location", fk_location);
            form.append("recordstatus", "EDT");

            var settings = {
                "url": host+"api_timetbl_picoms/public/misTimetblDet/update",
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
//-------------------------------------------------- end update details --------------------------------------------------//


//-------------------------------------------------- function onchange --------------------------------------------------//
// onchange Academic Calendar
$('#upt_cur_year').change(function(){
    let selectSession = $("#upt_cur_year option:selected").attr("calYear");
    let sem = $("#upt_cur_year option:selected").attr("calSem");
    let year = selectSession.replace('/','-');

    // select Academic Calendar Type
    catByYearSem(year, sem, function(){
        $('#upt_acaCal_type').html('');
        $('#upt_acaCal_type').append($('<option value: "">- Choose -</option>'));
        $.each(obj_kalendar.data, function (i, item) {
            $('#upt_acaCal_type').append('<option value="'+item.cal_id+'">'+item.category+'</option>');
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:',
        });
    });
});


// onchange Academic Calendar Type
$('#upt_acaCal_type').change(function(){
    let fk_acaCal = $(this).val();

    // select Course Offer
    grpByCrsByCal(fk_acaCal, function(){
        $('#upt_crs_code').html('');
        $('#upt_crs_code').append($('<option value="">- Choose -</option>'));
        $.each(obj_cotDet.data, function (i, item){
            $('#upt_crs_code').append($('<option value="'+item.fk_course+'">'+item.crs_code.toUpperCase()+' - '+item.crs_name.toUpperCase()+'</option>'));
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:'
        });
    });
});
//-------------------------------------------------- end function onchange --------------------------------------------------//


//-------------------------------------------------- loaddata timetable --------------------------------------------------//
$('#btnUpdate').click(function(){
    let id = $('#pk_id').val();
    timetblShow(id, function(){
        $.each(obj_timeTbl.data, function(i, item){
            let year = item.cal_year.replace('/','-');
            let file = item.upload_jadual;
            if(!(file == '' || file == null)){
                $('#view_upload_jadual').html('<a target="_blank" class="btn btn-icon primary" href="'+host+'api_timetbl_picoms/public/upload_jadual/'+file+'" title="'+file+'"><i class="fa fa-file-image-o"></i></a>');
                $('#exist_upload_jadual').val(file);
            }

            $('#upt_tmt_type').val(item.tmt_type);

            // select Academic Calendar
            acaCalActive(function(){
                $('#upt_cur_year').html('');
                $('#upt_cur_year').append($('<option value: "">- Choose -</option>'));
                let names = "";
                $.each(obj_kalendar.data, function (j, itemJ){
                    let curyear = itemJ.cur_year.replace('/','');
                    select = "";
                    if(names != curyear+'/'+itemJ.cal_cohort){
                        names = curyear+'/'+itemJ.cal_cohort;
                        if(item.cal_year == itemJ.cur_year && item.cal_cohort == itemJ.cal_cohort){
                            select = "selected";
                        }
                        $('#upt_cur_year').append('<option value="" calYear="'+itemJ.cur_year+'" calSem="'+itemJ.cal_cohort+'" '+select+'>'+curyear+'/'+itemJ.cal_cohort+'</option>');
                    }
                });

                $('.slct2').select2({
                    width: null,
                    containerCssClass: ':all:',
                });
            });

            // select Academic Calendar Type
            catByYearSem(year, item.cal_cohort, function(){
                $('#upt_acaCal_type').html('');
                $('#upt_acaCal_type').append($('<option value: "">- Choose -</option>'));
                $.each(obj_kalendar.data, function (i, item) {
                    $('#upt_acaCal_type').append('<option value="'+item.cal_id+'">'+item.category+'</option>');
                });
                $('#upt_acaCal_type').val(item.fk_acaCal);

                $('.slct2').select2({
                    width: null,
                    containerCssClass: ':all:',
                });
            });

            // select Course Offer
            grpByCrsByCal(item.fk_acaCal, function(){
                $('#upt_crs_code').html('');
                $('#upt_crs_code').append($('<option value="">- Choose -</option>'));
                $.each(obj_cotDet.data, function (j, itemJ){
                    $('#upt_crs_code').append($('<option value="'+itemJ.fk_course+'">'+itemJ.crs_code.toUpperCase()+' - '+itemJ.crs_name.toUpperCase()+'</option>'));
                });
                $('#upt_crs_code').val(item.fk_course);

                $('.slct2').select2({
                    width: null,
                    containerCssClass: ':all:'
                });
            });
        });
    });
});
//-------------------------------------------------- end loaddata timetable --------------------------------------------------//


//-------------------------------------------------- update timetable --------------------------------------------------//
$('#formUptTimetbl').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Timetable",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let pk_id = $('#pk_id').val();
            let fk_acaCal = $('#upt_acaCal_type').val();
            let crs_code = $('#upt_crs_code').val();
            let upload_jadual = $('#upt_upload_jadual')[0].files[0];
            let exist_upload_jadual = $('#exist_upload_jadual').val();

            var form = new FormData();
            form.append("pk_id", pk_id);
            form.append("fk_acaCal", fk_acaCal);
            form.append("fk_course", crs_code);
            form.append("upload_jadual", upload_jadual);
            form.append("exist_upload_jadual", exist_upload_jadual);
            form.append("recordstatus", "EDT");

            var settings = {
                "url": host+"api_timetbl_picoms/public/misTimetable/update",
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
//-------------------------------------------------- end update timetable --------------------------------------------------//


//-------------------------------------------------- remove timetable --------------------------------------------------//
$('#btnDelete').click(function(){
    let pk_id = $('#pk_id').val();
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("pk_id", pk_id);

    swal({
        title: "Remove Timetable",
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
            "url": host+"api_timetbl_picoms/public/misTimetable/delete",
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
            window.location.replace('adminPage.html');
        });
    });
});
//-------------------------------------------------- end remove timetable --------------------------------------------------//


function loadData(index){
    let data = JSON.parse($("#dataTimetbl").val());
    data = data[index];

    $("#pk_det").val(data.pk_id);
    $("#upt_tmt_lecturer").val(data.fk_lecturer).trigger('change');
    $("#upt_tmt_day").val(data. tmt_day);
    $('#upt_tmt_starttime').val(data.tmt_starttime);
    $("#upt_tmt_endtime").val(data.tmt_endtime);
    $('#upt_tmt_slot').val(data.tmt_slot);
    $('#upt_fk_location').val(data.loc_id).trigger('change');

    $('#mdlUptDetail').modal('show');
}


//-------------------------------------------------- remove detail --------------------------------------------------//
function del_rekod(id){
    var form = new FormData();
    form.append("recordstatus", 'DEL');
    form.append("pk_id", id);

    swal({
        title: "Remove Timetable",
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
            "url": host+"api_timetbl_picoms/public/misTimetblDet/delete",
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
//-------------------------------------------------- end remove detail --------------------------------------------------//


function timetblShow(id, returnValue){
    var settings = {
        "url": host+"api_timetbl_picoms/public/misTimetable/show/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };
    
    $.ajax(settings).done(function (response){
        obj_timeTbl = response;
        returnValue();
    });
}

function tmtDetList(id, returnValue){
    var settings = {
        "url": host+"api_timetbl_picoms/public/misTimetblDet/list/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };
    
    $.ajax(settings).done(function (response){
        obj_tmtDet = response;
        returnValue();
    });
}

function crsLectList(id, returnValue){
    var settings = {
        "url": host+"api_lecturer_picoms/public/misLectCrsPrm/crsGrpbyLect/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };
    
    $.ajax(settings).done(function (response){
        obj_lectCrsPrm = response;
        returnValue();
    });
}

function locCamAct(id, returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmLoc/listByCamAct/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };
    
    $.ajax(settings).done(function (response){
        obj_location = response;
        returnValue();
    });
}

var confirmed = false;

$("#form_upload").on('submit',function(e){
    if(!confirmed){
        e.preventDefault();
        $("#loading_mode").modal('show');

        read_file('file',function(){
            if(data_set.length > 0){

                async function doSomethingAsync(item) {
                    return new Promise(resolve => {
                        setTimeout(() => {
                            $("#load_text").html(fk_lecturer + ' - ' + item.LECTURER);
                            resolve();
                        }, Math.random() * 1000);
                    });
                }

                async function main() {
                    
                    //get Location FK
                    let location_data = [];
                    let obj_location = await new get(host+'api_tetapan_picoms/public/locationsList','picoms '+window.sessionStorage.token).execute();
                    // let obj_location = await new get(host+'api_tetapan_picoms/public/misPrmLoc/listByCamAct/'+window.sessionStorage.idPage,'picoms '+window.sessionStorage.token).execute();
                    if(obj_location.success){
                        location_data = obj_location.data;
                        console.log(location_data);
                    }

                    await Promise.all(
                        data_set.map(async (item,i) => {
                            
                            doSomethingAsync(item);

                            //get Day
                            if( item.DAY.toUpperCase() == 'MONDAY' ){ dayVal = '1' }
                            else if( item.DAY.toUpperCase() == 'TUESDAY' ){ dayVal = '2' }
                            else if( item.DAY.toUpperCase() == 'WEDNESDAY' ){ dayVal = '3' }
                            else if( item.DAY.toUpperCase() == 'THURSDAY' ){ dayVal = '4' }
                            else if( item.DAY.toUpperCase() == 'FRIDAY' ){ dayVal = '5' }

                            //get location
                            let obj_locationFiler = location_data.find(x=>x.loc_name == item.LOCATION);
                            if(obj_locationFiler != undefined){
                                locations = obj_locationFiler.loc_id;
                            }

                            let fk_timetbl = $("#pk_id").val();
                            let fk_lecturer = item.LECTURER_NO;
                            let tmt_day = dayVal;
                            let tmt_starttime = item.START_TIME;
                            let tmt_endtime = item.END_TIME;
                            let tmt_slot = item.SLOT;
                            let fk_location = locations;
        
                            var form = new FormData();
                            form.append("fk_timetbl", fk_timetbl);
                            form.append("fk_lecturer", fk_lecturer);
                            form.append("tmt_day", tmt_day);
                            form.append("tmt_starttime", convertTime(tmt_starttime));
                            form.append("tmt_endtime", convertTime(tmt_endtime));
                            form.append("tmt_slot", tmt_slot);
                            form.append("fk_location", fk_location);
                            form.append("recordstatus", "ADD");                
                            let obj = await new post(host+"api_timetbl_picoms/public/misTimetblDet/register",form,'picoms '+ window.sessionStorage.token).execute();
                            if(obj.success){
        
                            }
                            else{
                                swal("Error",fk_lecturer + ' - ' + item.LECTURER,'error');
                                $("#loading_mode").modal('hide');                                
                                return;
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