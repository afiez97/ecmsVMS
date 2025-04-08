$(function(){
    $.ajaxSetup ({
        cache: false
    });
    $("#loading_modal").modal("show");

    var columns = [
        { "name": "bil", "title": "No." },
        { "name": "std_studentid", "title": "Student ID"},
        { "name": "sti_name", "title": "Name"},
        { "name": "prev_pgm_id", "title": "Previous Programme", "breakpoints": "md sm xs"  },
        { "name": "new_pgm_id", "title": "New Programme", "breakpoints": "md sm xs"  },
        { "name": "sts_status", "title": "Status" },
        { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
    ];
    let bil = 1;
    var list = []; 

    var form = new FormData();
    
    var settings = {
      "url": host+"api_pengurusan_pelajar/public/chg_program/list",
      "method": "GET",
      "timeout": 0,
      "processData": false,
      "mimeType": "multipart/form-data",
      "contentType": false,
      "data": form
    };
    
    $.ajax(settings).done(function (response) {
      result = JSON.parse(response);
      if(result.success){
        $.each(result.data,function(i,field){
            recordstatus = '<span class="label blue-500">Apply</span>';
            recordstatus_dekan = '<span class="label orange-500">On Progress</span>';
            recordstatus_fac = '<span class="label orange-500">On Progress</span>';

            if(field.recordstatus == "EDT"){
                recordstatus = '<span class="label orange-500">On Progress</span>';
            }
            else if(field.recordstatus == "COM"){
                recordstatus = '<span class="label green-500">Completed</span>';
            }          
            list.push({
                "bil":bil++,
                "std_studentid":field.studentid,
                "sti_name":field.std_name+"<br>"+field.noic,
                "prev_pgm_id":field.std_pre_programme,
                "new_pgm_id":field.std_new_programme,
                "sts_status":recordstatus,
                "upt_btn": '<button class="btn btn-outline-info" title="Update" onclick="loadData(\'' + field.id + '\')" ><i class="fa fa-cog"></i> View</button>'
            });            
          });
          
        $("#tableApplication").footable({
            "columns": columns,
            "rows": list,
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
      }
      else{
        $("#tableApplication").html('');
      }
    $("#loading_modal").modal("hide");

    });

    

});
// var viewChangeProgramme = function () {
    
//     // let usr_id = window.sessionStorage.usr_id;

//     var columns = [
//         { "name": "bil", "title": "No." },
//         { "name": "std_studentid", "title": "Student ID"},
//         { "name": "sti_name", "title": "Name", "breakpoints": "md sm xs" },
//         { "name": "prev_pgm_id", "title": "Previous Programme" },
//         { "name": "new_pgm_id", "title": "New Programme" },
//         // { "name": "sts_status", "title": "Status" },
//         { "name": "upt_btn", "title": "Action"},
//     ];
//     var settings = {
//         "url": host+"api_tukar_program/public/tukarProgramList",
//         "method": "GET",
//         "timeout": 0,
//     };

//     $.ajax(settings).done(function (response) {
//         let bil = 1;
//         var list = [];

//         $.each(response.data, function (i, field) {

//             $("#loading_modal").modal("show");
//             list.push({
//                 bil: bil++, std_studentid: field.std_studentid, sti_name: field.sti_name, 
//                 prev_pgm_id: field.cgp_old_pgm, new_pgm_id: field.cgp_new_pgm,
//                 "upt_btn": '<button class="btn success" title="Update" onclick="loadData(\'' + field.std_studentid + '\',\'' + field.cgp_id + '\')" ><i class="ion-android-create"></i></button>'
                
//             });
            
//         });

//         $("#tableApplication").footable({
//             "columns": columns,
//             "rows": list,
//             "paging": {
//                 "enabled": true,
//                 "size": 10
//             },
//             "filtering": {
//                 "enabled": true,
//                 "placeholder": "Search...",
//                 "dropdownTitle": "Search for:"
//             }

//         });
//         $("#loading_modal").modal("hide");

//     });

// }

// const regChanges = document.querySelector("#uptChanges");
// ko.applyBindings(new viewChangeProgramme(), regChanges);


function loadData(var1){
    window.location.replace("pgmChg_proses.html?id="+var1);
}

