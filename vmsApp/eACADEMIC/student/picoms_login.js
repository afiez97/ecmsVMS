$(function(){
    $.ajaxSetup ({
        cache: false
    });
});
var confirmed = false;

$('#logmasuk').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        
        let std_studentid = $('#std_nomatrik').val();
        let sti_password = $('#std_katalaluan').val();

        var form = new FormData();
        form.append("usr_id", std_studentid);
        form.append("usr_passwd", sti_password);
        form.append('usr_type','2');
        $("#loading_modal").modal("show");

        var settings = {
            "url": host+"api_auth/public/login",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };
        
        $.ajax(settings).done(function (response){
            result = JSON.parse(response);

            $("#loading_modal").modal("hide");
            if(!result.success){
                swal(result.messages,result.data,"error");
                return;
            }

            sessionStorage.token = result.token;
            sessionStorage.std_studentid = result.data2.usr_id;
            window.location.replace("masPage.html");
        });
    }
});