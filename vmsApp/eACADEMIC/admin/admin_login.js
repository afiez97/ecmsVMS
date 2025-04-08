$(function(){
  $.ajaxSetup ({
      cache: false
  });
});
var confirmed = false;


$('#formLogin').on('submit', function(e){
  if(!confirmed){
    e.preventDefault();

    let usr_id = $('#usr_id').val();
    let usr_passwd = $('#usr_passwd').val();
    
    var form = new FormData();
    form.append("usr_id", usr_id);
    form.append("usr_passwd", usr_passwd);
    form.append('usr_type','1');
    
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
        swal(result.messages,result.data,"error");
        return;
      }
      console.log(result);
      // alert("PO");
      sessionStorage.token = result.token;
      sessionStorage.usrCatEadmin = result.data2.usr_cat_eadmin;
      sessionStorage.usrCatEhep = result.data2.usr_cat_ehep;
      sessionStorage.usrCatEcmis = result.data2.usr_cat_ecmis;
      sessionStorage.usrName = result.data2.usr_name;
      sessionStorage.usrId = result.data2.usr_id;
      // sessionStorage.access = result.data2.access;
      window.location.replace("campusPage.html");
    });
  }
});