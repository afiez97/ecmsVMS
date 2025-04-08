$(function(){
    $.ajaxSetup ({
        cache: false
    });
    $("#loading_modal").modal("show");

    pgmChgList(function(){
        var columns = [
            { "name": "bil", "title": "No." },
            { "name": "std_studentid", "title": "Student ID"},
            { "name": "sti_name", "title": "Name"},
            { "name": "prev_pgm_id", "title": "Current Programme" },
            { "name": "new_pgm_id", "title": "New Programme", "breakpoints": "md sm xs" },
            { "name": "sts_status", "title": "Status" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];
        let bil = 1;
        var list = [];

        if(obj_pgmChgList.success){
            $.each(obj_pgmChgList.data, function(i, field){
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
                    "bil":bil++, "std_studentid": '<span class="text-uppercase">'+field.studentid+'</span>', "sti_name": '<span class="text-uppercase">'+field.std_name+"<br>"+field.noic+'</span>', 
                    "prev_pgm_id": '<span class="text-uppercase">'+field.prePgm+'</span>', 
                    "new_pgm_id": '<span class="text-uppercase">'+field.newPgm+'</span>',
                     "sts_status": recordstatus,
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
          else{ $("#tableApplication").html(''); }
    });
      
    $("#loading_modal").modal("hide");
});


function pgmChgList(returnValue){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/chg_program/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };
    
    $.ajax(settings).done(function (response){
        obj_pgmChgList = response;
        console.log(obj_pgmChgList);
        returnValue();
    });
}

function loadData(var1){
    window.sessionStorage.pgmChgId = var1;
    window.location.replace("pgmChg_proses.html");
}

