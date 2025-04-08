$(function(){
  $.ajaxSetup ({
      cache: false
  });
});
var confirmed = false;


$('#knockout-app').on('submit', function(e){
  if(!confirmed){
    e.preventDefault();

    let usr_id = $('#usr_id').val();
    let usr_passwd = $('#usr_passwd').val();

    var form = new FormData();
    form.append("usr_id", usr_id);
    form.append("usr_passwd", usr_passwd);
    form.append('usr_type','3');
    
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
      if(!result.success){
        // console.log(result);
        Swal.fire({title:'Fail to login',text: result.messages,icon: "error"});
        return;
      }
   
      window.sessionStorage.token = result.token;
      window.sessionStorage.usrCatEadmin = result.data2.usr_cat_eadmin;
      window.sessionStorage.usrCatEhep = result.data2.usr_cat_ehep;
      window.sessionStorage.usrName = result.data2.usr_name;
      window.sessionStorage.usrId = result.data2.usr_id;
      window.sessionStorage.userRole = "";
      window.location.replace("hepaPage.html");
    });
  }
});
