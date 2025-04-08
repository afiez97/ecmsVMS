$(function(){
    $.ajaxSetup ({
        cache: false
    });
    $("#loading_modal").modal("show");

    withdrawList(function(){
        console.log('withdrawList');
        var columns = [
            { "name": "bil", "title": "No." },
            { "name": "std_studentid", "title": "Student ID"},
            { "name": "sti_name", "title": "Name"},
            { "name": "pgm_id", "title": "Programme", "breakpoints": "md sm xs"  },
            { "name": "cur_semester", "title": "Semester" },
            { "name": "withdraw_status", "title": "Status" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];
        let bil = 1;
        var list = [];

        if(obj_dataList.success){
            $.each(obj_dataList.data, function(i, field){
                list.push({
                    "bil": bil++, "std_studentid": '<span class="text-uppercase">'+field.stu_id+'</span>', "sti_name": '<span class="text-uppercase">'+field.stu_name+'</span>', 
                    "pgm_id": '<span class="text-uppercase">'+field.pgm_id+'</span>', "cur_semester": field.cur_semester, "withdraw_status": '<span class="text-uppercase">'+field.withdraw_status+'</span>',
                    "upt_btn": '<button class="btn btn-outline-info" title="Update" onclick="loadData(\'' + field.pk_id + '\')" ><i class="fa fa-cog"></i> View</button>'
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


function withdrawList(returnValue){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/misStdWithdraw/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };
    
    $.ajax(settings).done(function (response){
        obj_dataList = response;
        returnValue();
    });
}

function loadData(id){
    window.sessionStorage.wdrawId = id;
    window.location.replace("withdraw_proses.html");
}

