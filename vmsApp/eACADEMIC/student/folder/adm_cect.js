$(function(){
    $.ajaxSetup ({
        cache: false
    });
    $("#loading_modal").modal('show');
    cectList(function(){
        $("#list_cect").html('');
        let columns = [
            { "name": "bil", "title": "No." },
            { "name": "sti_name", "title": "Name" },
            { "name": "pgm_name", "title": "Programme", "breakpoints": " sm xs" },
            { "name": "std_semester", "title": "Semester", "breakpoints": " sm xs" },
            { "name": "recordstatus", "title": "Status" },
            { "name": "upt_btn", "title": "Action", "breakpoints": " sm xs"},
        ];
        
        let list = [];
        let bil = 1;
        if(obj_cect.success){
            $.each(obj_cect.data,function(i,field){                
                list.push({
                    "bil":bil++,
                    "sti_name":field.std_name,
                    "pgm_name":'<span id="program_'+field.pgm_id+'">'+field.pgm_id+'</span>',
                    "std_semester":field.std_semester,
                    "recordstatus":field.recordstatus,
                    "upt_btn":'<button onclick="cect_det(\''+field.studentid+'\',\''+field.id+'\')" class="btn btn-icon btn-info"><i class="fa fa-envelope-o"></i></button>'
                });                
            });
        }
        $("#list_cect").footable({
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
    $("#loading_modal").modal('hide');
    });
});

function cectList(returnValue){
    var form = new FormData();
    var settings = {
      "url": host+"api_pengurusan_pelajar/public/cect/list",
      "method": "GET",
      "timeout": 0,
      "processData": false,
      "mimeType": "multipart/form-data",
      "contentType": false,
      "data": form
    };
    
    $.ajax(settings).done(function (response) {
      obj_cect = JSON.parse(response);
      returnValue();
    });    
}

function programme(pgm_id,returnValue){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/programme/show/"+pgm_id,
        "method": "GET",
        "timeout": 0,
      };
      
      $.ajax(settings).done(function (response) {  
          obj_programme = response;      
          returnValue();
      });
}

function cect_det(studentid,id){
    window.location.replace('cect_proses.html?std_id='+studentid+'&id='+id);
}