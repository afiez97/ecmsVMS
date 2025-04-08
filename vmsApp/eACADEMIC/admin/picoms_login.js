
var cek ='';

var viewModel = function(){
    
    var self = this;
    self.std_nomatrik = ko.observable("").extend({
        required:true,
        minLength:4,
    });

    self.std_katalaluan = ko.observable("").extend({
        required:true
    });

    self.logmasuk = function(){

        let usr_type = $('#page').text();
        let std_studentid = self.std_nomatrik();
        var error = ko.validation.group(self);

        if(error.length > 0){
            error.showAllMessages();
            return;
        }

        var param = {
            userName: self.std_nomatrik(),
            psswd: self.std_katalaluan(),
        }
        // console.log(param);

        var form = new FormData();

        form.append("usr_type", usr_type);
        form.append("usr_id", self.std_nomatrik());
        form.append("usr_passwd", self.std_katalaluan());
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
        
        $.ajax(settings).done(function (response) {
          result = JSON.parse(response);

          $("#loading_modal").modal("hide");
          if(!result.success){
            swal(result.messages,result.data,"error");
            return;
          }else{

            console.log(result.data2.usr_name);
          }

          sessionStorage.token = result.token;
          sessionStorage.usr_id = result.data2.usr_id;
          sessionStorage.usr_name = result.data2.usr_name;
          sessionStorage.noic = result.data2.usr_icno;
          sessionStorage.profile = result.data2.profile;

          window.location.replace("masPage.html");
        });        
    };
};

const knockoutApp = document.querySelector("#knockout-app");
ko.applyBindings(new viewModel(), knockoutApp);


var viewTawaranModel = function(){
    
    var self = this;
    self.std_nama = ko.observable("").extend({
        required:true,
    });

    self.std_nokp = ko.observable("").extend({
        required:true
    });

    self.std_emel = ko.observable("").extend({
        required:true
    });

    self.std_notel = ko.observable("").extend({
        required:true
    });

    self.std_program_id = ko.observable("").extend({
        required:true
    });

    self.hantar_tawaran = function(){
        
        var error = ko.validation.group(self);

        if(error.length > 0){
            error.showAllMessages();
            return;
        }

        var param = {
            stdNama: self.std_nama(),
            stdNokp: self.std_nokp(),
            stdEmel: self.std_emel(),
            stdNotel: self.std_notel(),
            stdProgram: self.std_program_id(),
        }
        // console.log(param);

        var form = new FormData();
        form.append("std_nama", self.std_nama());
        form.append("std_nokp", self.std_nokp());
        form.append("std_emel", self.std_emel());
        form.append("std_notel", self.std_notel());
        form.append("std_program_id", self.std_program_id());
        
        var settings = {
          "url": host+"api_pengurusan_pelajar/public/tawaranReg",
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
            window.location.replace("masPage.html");
          
        });
        
    };
};

const submitTawaran = document.querySelector("#form-tawaran");
ko.applyBindings(new viewTawaranModel(), submitTawaran);

// function getProgram(dataStudent){

//     let std_studentid = dataStudent;
    

//     var form = new FormData();
//     form.append("std_studentid", std_studentid);

//     var settingPelajar = {
//         "url": host+"api_pengurusan_pelajar/public/studentInfoView",
//         "method": "POST",
//         "timeout": 0,
//         processData: false, 
//         contentType: false,
//         "data": form,
//         // "header":{
//         //     "Authentication": "ASDCM"+window.sessionStorage.token
//         //   }
//     };
    
//     $.ajax(settingPelajar).done(function (responsePelajar) {

//         cek =  responsePelajar.data;

//     });

//     return cek;

    
// }
