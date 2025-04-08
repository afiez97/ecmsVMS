let clg_id = window.sessionStorage.idPage;
var searchid = '', fruits = [],timer;

$(function(){
    $.ajaxSetup ({
        cache: false
    });

    $.fn.select2.defaults.set( "theme", "bootstrap" );

    let clg_id = window.sessionStorage.idPage;

    // select course
    listCrsAct(function(){
        $('#fk_course').append($('<option value="">- Choose -</option>'));
        $.each(obj_crsActive.data, function (i, item){
            $('#fk_course').append($('<option value="'+item.crsId+'">'+item.crs_code.toUpperCase()+' - '+item.crs_name.toUpperCase()+'</option>'));
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:',
        });
    });

    // exam center list
    listApplication(function(){
        let columns = [
            { "name": "bil", "title": "No." },
            { "name": "student_id", "title": "Student id" },
            { "name": "cur_year", "title": "Academic Session" },
            { "name": "app_type", "title": "Type" },
            { "name": "fk_course", "title": "Course Code" },
            { "name": "app_status", "title": "Status", "breakpoints": "md sm xs" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" }
        ];

        let bil = 1;
        let convertList = JSON.stringify(obj_listApp.data);
        $("#dataList").val(convertList);
        let list_data = [];
        
        $.each(obj_listApp.data, function(i, field){


            if (field.acaYear != null && field.acaYear != "") {
                acaYear = field.acaYear+ "/" ;
             } else {
                acaYear = '';
             }
             cal_cohort = field.cal_cohort !== null ? field.cal_cohort : '';

            // let acaSession = field.acaYear;
            let acaCalendar = acaYear.replace("/", "") + cal_cohort;
            let btnStatus = '';
            if (field.app_status == 'Completed'  ){
            // if (field.app_status == 'Completed' || (field.est_tableno !== null && field.est_tableno !== '')) {
                //  btnStatus = '<button class="md-btn md-flat m-b-sm w-xs text-success">'+field.app_status+'</button>';
                // btnStatus = '<button class="md-btn md-raised m-b-sm w-xs green">'+field.app_status+'</button>';
                // btnStatus = '<span class="label green">Completed</span>';
                btnStatus = '<span class="label green">'+field.app_status+'</span>';

            }
            else if (field.app_status == 'Approved'){
                // btnStatus = '<button class="md-btn md-flat m-b-sm w-xs text-accent">'+field.app_status+'</button>';
                // btnStatus = '<button class="md-btn md-raised m-b-sm w-xs blue">'+field.app_status+'</button>';
                btnStatus = '<span class="label blue">'+field.app_status+'</span>';
            }

            else if (field.app_status == 'In Progress'){
                // btnStatus = '<button class="md-btn md-flat m-b-sm w-xs text-warning">'+field.app_status+'</button>';
                // btnStatus = '<button class="md-btn md-raised m-b-sm w-xs yellow">'+field.app_status+'</button>';
                btnStatus = '<span class="label yellow">'+field.app_status+'</span>';
            } else if (field.app_status == 'Reject'){
                // btnStatus = '<button class="md-btn md-flat m-b-sm w-xs text-warning">'+field.app_status+'</button>';
                // btnStatus = '<button class="md-btn md-raised m-b-sm w-xs yellow">'+field.app_status+'</button>';
                btnStatus = '<span class="label danger">'+field.app_status+'</span>';
            }
  
  
            // console.log(field);
            list_data.push({
                bil: bil++, 
                student_id: '<span class="text-uppercase">'+field.student_id+'</span>', 
                cur_year: '<span class="text-uppercase">'+acaCalendar+'</span>',

                app_type: field.app_type, fk_course: '<span class="text-uppercase">'+field.crs_code+'</span>',
                // app_status: '<span class="text-uppercase">'+field.app_status+'</span>',
                app_status: btnStatus,
                upt_btn: '<button class="btn btn-icon accent" title="Details" onclick="detail(\'' + i + '\')" id="btnPerincian"><i class="ion-ios-list-outline"></i></button>'
            });
        });

        $('#tblApplication').footable({
            "columns": columns,
            "rows": list_data,
            "paging": {
                "enabled": true,
                "size": 10
            },
            "filtering": {
                "enabled": true,
                "placeholder": "Search...",
                "dropdownTitle": "Search for:"
            }
        });
    });


    
    // start for add cect

    $("#studentid").on("keyup", function () {
        searchid = $(this).val().trim();

        clearInterval(timer);
        timer = setTimeout(function () {
            // console.log('User finished typing !!' + searchid);

            det_stdInfo(searchid, function(){

              console.log(obj_getDatastd);

              var fk_pgm = obj_getDatastd.pgm_fk;

              $('#sti_name').val(obj_getDatastd.sti_name);
              $('#sti_icno').val(obj_getDatastd.sti_icno);
              $('#sti_phoneNo').val(obj_getDatastd.sti_contactno_mobile);
              $('#intakeHide').val(obj_getDatastd.cur_intake);
              // $('#pgmHide').val(obj_getDatastd.sti_icno);


              slctProg(obj_getDatastd.cam_id, fk_pgm);

              // alert(obj_getDatastd.pgm_fk);

              let objcourseDet = new get(host+ "api_pengurusan_pelajar/public/misStdRegsub/listcourseByID/" +  searchid, 'picoms ' + window.sessionStorage.token).execute();
              if(objcourseDet.success){

                $("#courseList").empty().append('<option value="">- Choose -</option>');

            // $('#courseList').append(``);
            // $("#courseList").append('<option value="">- Choose -</option>');
            $.each(objcourseDet.data, function (i, item) {
            //   console.log(item.cal_cohort)
                $("#courseList").append(
                     `<option data-rsb_id="${item.rsb_id}" data-session="${(item.cal_year).replace('/','')}/${item.cal_cohort}" value="${item.fk_course}"> ${item.crsCode} - ${item.crs_name}</option>`
                );

            });

            
     // Listen for change event on the select dropdown
     $("#courseList").on( "change", function () {
                // Get the selected option
                let selectedOption = $(this).find(":selected");
                let intake = $("#intakeHide").val();
                let pgm =$("#pgmHide").val();
                let sess = selectedOption.data("session");
                $("#session").val(sess);
                $("#rsb_id").val(selectedOption.data("rsb_id"));
                // console.log(selectedOption.data("rsb_id"))
                // pgm_id  pgm_name pgm_fk
                // Fill the other input fields with corresponding data
                $("#programme").val(pgm);
                $("#intake").val(intake);

            });
                   
            
            $(".slct2").select2({
                width: null,
                containerCssClass: ":all:",
            });


          
          
          
          
          }else{}




            });


        }, 1000);
    });
    // end for add cect
});
var confirmed = false;


//-------------------------------------------------- form add --------------------------------------------------//
$('#formAdd').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Application",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let student_id = $('#student_id').val();
            let fk_course = $('#fk_course').val();
            let app_type = $('#app_type').val();
            let app_reason = $('#app_reason').val();

            var form = new FormData();
            form.append("student_id", student_id);
            form.append("fk_course", fk_course);
            form.append("app_type", app_type);
            form.append("app_reason", app_reason);
            form.append("app_status", 'In Progress');
            form.append("recordstatus", "ADD");
            
            var settings = {
                "url": host+"api_exam_picoms/public/misExamApp/register",
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
//-------------------------------------------------- end form add --------------------------------------------------//


function detail(indexs){
    let d = JSON.parse($("#dataList").val());
    let data = d[indexs];
    window.sessionStorage.app_id = data.app_id;
    window.location.replace('exam_appDetail.html');
}

function listApplication(returnValue){
    var settings = {
        "url": host+"api_exam_picoms/public/misExamApp/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };
    
    $.ajax(settings).done(function (response){
        obj_listApp = response;
        returnValue();
    });
}





$("#formApplication").on('submit', function (e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Application",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Add",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let app_rsb_id = $("#rsb_id").val();
            let app_stdid = $("#studentid").val();
            let app_fk_course = $("#courseList").val();
            let app_type = $('#type_register').val();
            let app_reason = $("#reasonCase").val();
            // let app_status = $("#statusRecheckSC").val();
            let statusrekod = "ADD";
            // let app_upload = $("#app_upload")[0].files[0];

            var form = new FormData();
            form.append("student_id", app_stdid);
            form.append("fk_course", app_fk_course);
            form.append("app_type", app_type);
            form.append("app_reason", app_reason);
            form.append("app_status", 'In Progress');
            form.append("recordstatus", statusrekod);
            form.append("rsb_id", app_rsb_id);
            // form.append("app_upload", app_upload);
    
            var settings = {
                "url": host+"api_exam_picoms/public/misExamApp/register",
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

