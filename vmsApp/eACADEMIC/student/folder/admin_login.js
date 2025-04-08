
var viewModel = function(){
    
    var self = this;
    self.usr_id = ko.observable("").extend({
        required:true,
        minLength:4,
    });

    self.usr_passwd = ko.observable("").extend({
        required:true
    });

    self.logmasuk = function(){
        var error = ko.validation.group(self);

        if(error.length > 0){
            error.showAllMessages();
            return;
        }

        var param = {
            userName: self.usr_id(),
            psswd: self.usr_passwd(),
        }
        console.log(param);

        var form = new FormData();
        form.append("usr_id", self.usr_id());
        form.append("usr_passwd", self.usr_passwd());
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
        
        $.ajax(settings).done(function (response) {
          result = JSON.parse(response);
          if(!result.success){
            Swal(result.message,result.data,"error");
            return;
          }

          sessionStorage.token = result.token;
          window.location.replace("campusPage.html");
        });        
    };
};

const knockoutApp = document.querySelector("#knockout-app");
ko.applyBindings(new viewModel(), knockoutApp);

