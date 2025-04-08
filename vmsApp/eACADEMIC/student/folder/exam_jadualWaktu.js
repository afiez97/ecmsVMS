$(function(){
    $.ajaxSetup ({
        cache: false
    });

    $('#btnBack').click(function(){
        location.href = 'adminPage.html';
    });

    //---------- select session ----------//
    var settings = {
        "url": host+"api_tetapan_picoms/public/curyear/selectCurYear",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        // console.log(response);
        //LIST OPTION
        $('#cur_year').append($('<option>', { 
            value: "",
            text : "-Choose-" 
        }));
        $.each(response.data, function (i, item) {
            $('#cur_year').append($('<option>', { 
                value: item.cur_year,
                text : item.cur_year 
            }));
        });

        // LIST OPTION UPDATE
         $('#upt_cur_year').append($('<option>', { 
            value: "",
            text : "-Choose-" 
        }));
        $.each(response.data, function (i, item) {
            $('#upt_cur_year').append($('<option>', { 
                value: item.cur_year,
                text : item.cur_year 
            }));
        });
    });
    //---------- end select session ----------//

    //---------- select programme list ----------//
    var settings = {
        "url": host+"api_tetapan_picoms/public/programmeList",
        "method": "GET",
        "timeout": 0,
    };
    
    $.ajax(settings).done(function (response){
        //LIST OPTION
        $('#pgm_id').append($('<option>', { 
            value: "",
            text : "-Choose-" 
        }));
        $.each(response.data, function (i, item) {
            $('#pgm_id').append($('<option>', { 
                value: item.pgm_id,
                text : item.pgm_name 
            }));
        });

        //LIST OPTION update
        $('#upt_pgm_id').append($('<option>', { 
            value: "",
            text : "-Choose-" 
        }));
        $.each(response.data, function (i, item) {
            $('#upt_pgm_id').append($('<option>', { 
                value: item.pgm_id,
                text : item.pgm_name 
            }));
        });
    });
    //---------- end select programme list ----------//

    //---------- select course list ----------//
    var settings = {
        "url": host+"api_tetapan_picoms/public/courseList",
        "method": "GET",
        "timeout": 0,
    };
    
    $.ajax(settings).done(function (response){
        //LIST OPTION
        $('#crs_code').append($('<option>', { 
            value: "",
            text : "-Choose-" 
        }));
        $.each(response.data, function (i, item) {
            $('#crs_code').append($('<option>', { 
                value: item.crs_code,
                text : item.crs_name 
            }));
        });

        //LIST OPTION
        $('#upt_crs_code').append($('<option>', { 
            value: "",
            text : "-Choose-" 
        }));
        $.each(response.data, function (i, item) {
            $('#upt_crs_code').append($('<option>', { 
                value: item.crs_code,
                text : item.crs_name 
            }));
        });
    });
    //---------- end select course list ----------//
});

// function after select session
// $('#cur_year').on('change', function(){
//     alert($(this).val());

// })
// function mySession(thisVal){
//     alert(thisVal);
// }


var confirmed = false;
//-------------------------------------------------- add exam timetable --------------------------------------------------//
$('#formRegExamTbl').on('submit', function(e){
    let $this = $(this);
    
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Examination Timetable",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let cur_year = $('#cur_year').val();
            let pgm_id = $('#pgm_id').val();
            let reg_semester = $('#reg_semester').val();
            let crs_code = $('#crs_code').val();
            let tbl_paper_type = $('#tbl_paper_type').val();
            let tbl_date_start = $('#tbl_date_start').val();
            let tbl_time_start = $('#tbl_time_start').val();
            let tbl_time_end = $('#tbl_time_end').val();
            let tbl_status = $('#tbl_status').val();
            let tbl_remarks = $('#tbl_remarks').val();

            var form = new FormData();
            form.append("cur_year", cur_year);
            form.append("pgm_id", pgm_id);
            form.append("reg_semester", reg_semester);
            form.append("tbl_paper_type", tbl_paper_type);
            form.append("tbl_date_start", tbl_date_start);
            form.append("crs_code", crs_code);
            form.append("tbl_time_start", tbl_time_start);
            form.append("tbl_time_end", tbl_time_end);
            form.append("tbl_status", tbl_status);
            form.append("tbl_remarks", tbl_remarks);
            form.append("recordstatus", "ADD");

            var settings = {
                "url": host+"api_exam_picoms/public/addExmTimetbl",
                "method": "POST",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form
            };

            $.ajax(settings).done(function (response) {
                // console.log(response);
                let result = JSON.parse(response);
                if(result.success){
                    window.location.reload();
                }
                else{
                    swal("Failed", response.message, "error");
                }
            });
        });
    }
});
//-------------------------------------------------- end add exam timetable --------------------------------------------------//


//-------------------------------------------------- display exam timetable list --------------------------------------------------//
var settings = {
    "url": host+"api_exam_picoms/public/listExmTimetbl",
    "method": "GET",
    "timeout": 0,
};

$.ajax(settings).done(function (response){
    let bil = 1;
    let convertList = JSON.stringify(response.data);
    $("#dataList").val(convertList);
    let list_data = [];
    let columns = [
        { "name": "bil", "title": "No." },
        { "name": "cur_year", "title": "Session" },
        { "name": "reg_semester", "title": "Semester" },
        { "name": "pgm_id", "title": "Programme" },
        { "name": "crs_code", "title": "Course", "breakpoints": "md sm xs"  },
        { "name": "tbl_paper_type", "title": "Paper Type", "breakpoints": "md sm xs"  },
        { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" }
    ];
    
    $.each(response.data, function(i, field){
        list_data.push({
            "bil": bil++, "cur_year": field.cur_year, "reg_semester": field.reg_semester, "pgm_id": field.pgm_name, "crs_code": field.crs_name, "tbl_paper_type": field.tbl_paper_type,
            "upt_btn": '<button class="btn accent" title="Details" onclick="detail(\'' + field.pk_id + '\',\'' + i + '\')" id="btnPerincian"><i class="ion-ios-list-outline"></i></button> '
        });
    });
    $('#tblExamTimeTbl').html('');
    $('#tblExamTimeTbl').footable({
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

function detail(id){
    window.location.replace("detExamTimetbl.html?id="+id);
}
//-------------------------------------------------- end display exam timetable list --------------------------------------------------//


function loadData(indexs){
    let data = JSON.parse($("#dataList").val());
    $('#upt_cur_year').val(data[indexs].cur_year);
    $('#upt_pgm_id').val(data[indexs].pgm_id);
    $('#upt_reg_semester').val(data[indexs].reg_semester);
    $('#upt_crs_code').val(data[indexs].crs_code);
    $('#upt_tbl_paper_type').val(data[indexs].tbl_paper_type);
    $('#upt_tbl_date_start').val(data[indexs].tbl_date_start);
    $('#upt_tbl_time_start').val(data[indexs].tbl_time_start);
    $('#upt_tbl_time_end').val(data[indexs].tbl_time_end);
    $('#upt_tbl_status').val(data[indexs].tbl_status);
    $('#upt_tbl_remarks').val(data[indexs].tbl_remarks);

    $("#update-jadualExam").modal("show");
}



// function del_rekod(id){

//     let statusrekod = 'DEL';
//     let upt_id = id;

//     var form = new FormData();
//     form.append("recordstatus", statusrekod);
//     form.append("id", upt_id);
    

//     swal({
//             title: "Remove Academic Staff",
//             text: "Are You Sure?",
//             type: "question",
//             showCancelButton: true,
//             confirmButtonText: "Remove",
//             confirmButtonColor: "#ef193c",
//             closeOnConfirm: true,
//             allowOutsideClick: false,
//             html: false
//         }).then(function () {

//             var settings = {
//                 "url": host+"api_tetapan_picoms/public/faclecturerDelete",
//                 "method": "POST",
//                 "timeout": 0,
//                 "processData": false,
//                 "mimeType": "multipart/form-data",
//                 "contentType": false,
//                 "data": form
//               };

//             $.ajax(settings).done(function (response) {
//                 console.log(response)
//                 result = JSON.parse(response);
//                 if (!result.success) {
//                     Swal(result.message, result.data, "error");
//                     return;
//                 }

//                 // sessionStorage.token = result.token;
//                 window.location.replace("adminPage.html");

//             });
//         });

// }


