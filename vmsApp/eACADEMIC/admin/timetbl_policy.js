$(function(){
    $.ajaxSetup ({
        cache: false
    });

    viewPolicy(function(){
        $.each(obj_policy.data, function (i, item){
            $('#tpl_id').val(item.tpl_id);
            $('#tarikhBukaJadWaktu').val(item.tpl_date_start);
            $('#tarikhTutupJadWaktu').val(item.tpl_date_end);
        });
    })
});
var confirmed = false;


//-------------------------------------------------- update exam policy --------------------------------------------------//
$("#formUpdate").on('submit', function (e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Timetable Policy",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function(){
            let tpl_id = $('#tpl_id').val();
            let tpl_date_start = $("#tarikhBukaJadWaktu").val();
            let tpl_date_end = $("#tarikhTutupJadWaktu").val();
            let statusrekod = "EDT";

            var form = new FormData();
            form.append('tpl_id', tpl_id);
            form.append("tpl_date_start", tpl_date_start);
            form.append("tpl_date_end", tpl_date_end);
            form.append("recordstatus", statusrekod);

            var settings = {
                "url": host+"api_polisi/public/tblPolicyUpdate",
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
//-------------------------------------------------- end update exam policy --------------------------------------------------//


function viewPolicy(returnValue){
    var settings = {
        "url": host+"api_polisi/public/tblPolicy",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_policy = response;
        returnValue();
    });
}