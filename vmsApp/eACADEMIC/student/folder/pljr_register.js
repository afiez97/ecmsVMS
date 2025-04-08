var viewStudentRegModel = function(){

    var self =this;

    self.std_register_id = ko.observable("").extend({
        rewquired:true,
    });

    self.std_nomatrik = ko.observable("").extend({
        required:true,
    });

    self.std_nama = ko.observable("").extend({
        required:true,
    });

    self.std_nokp = ko.observable("").extend({
        required:true,
    });

    self.std_emel = ko.observable("").extend({
        required:true,
    });

    self.std_notel = ko.observable("").extend({
        required:true,
    });

    self.std_program_id =ko.observable("").extend({
        required:true,
    });

    self.std_katalaluan = ko.observable("").extend({
        required:true,
    });

    self.std_resit = ko.observable("").extend({
        required:true,
    });

    self.std_nokp_upload = ko.observable("").extend({
        required:true,
    });

    self.std_spm_upload = ko.observable("").extend({
        required:true,
    });

    self.std_stpm_upload = ko.observable("").extend({
        required:true,
    });

    self.std_diploma_upload = ko.observable("").extend({
        required:true,
    })

    self.std_ijazah_upload = ko.observable("").extend({
        required:true,
    });

    self.std_tahun_kemasukan = ko.observable("").extend({
        required:true,
    });

    

    self.hantar_reg_pelajar = function(){

        var error = ko.validation.group(false);

        if(error.length > 0){
            error.showAllMessages();
            return;
        }
    

    var param = {
        stdRegID : self.std_register_id(),
        stdNomatrik : self.std_nomatrik(),
        stdNama : self.std_nama(),
        stdNokp : self.std_nokp(),
        atsEmel : self.std_emel(),
        stdNotel : self.std_notel(),
        stdProgramID : self.std_program_id(),
        stdKatalaluan : self.std_katalaluan(),
        stdResit : self.std_resit(),
        stdNokpUpload : self.std_nokp_upload(),
        stdSpmUpload : self.std_spm_upload(),
        stdDiplomaUpload : self.std_diploma_upload(),
        stdStpmUpload : self.std_stpm_upload(),
        stdIjazahUpload : self.std_ijazah_upload(),
        stdTahunKemasukan : self.std_tahun_kemasukan(),
    }

    console.log(param);

    var form = new FormData();

    form.append("std_register_id",self.std_register_id());
    form.append("std_nomatrik",self.std_nomatrik());
    form.append("std_nama",self.std_nama());
    form.append("std_nokp",self.std_nokp());
    form.append("std_emel",self.std_emel());
    form.append("std_notel",self.std_notel());
    form.append("std_program_id",self.std_program_id());
    form.append("std_katalaluan",self.std_katalaluan());
    form.append("std_resit",self.std_resit());
    form.append("std_nokp_upload",self.std_nokp_upload());
    form.append("std_spm_upload",self.std_spm_upload());
    form.append("std_diploma_upload",self.std_diploma_upload());
    form.append("std_stpm_upload",self.std_stpm_upload());
    form.append("std_ijazah_upload",self.std_ijazah_upload());
    form.append("std_tahun_kemasukan",self.std_tahun_kemasukan());

    var path = (window.URL || window.webkitURL).createObjectURL(fileInput.files[0]);
    console.log('path', path);
    alert('path', path);

    //SETTING
    form.append("std_resit", fileInput.files[0], "/C:/Users/nfsmz/Downloads/KelasProgramming-Nota-Kelas-Laravel.pdf");
    form.append("std_nokp_upload", fileInput.files[0], "/C:/Users/nfsmz/Downloads/cth Ouput Bengkel synthesis 2012019.pdf");
    form.append("std_spm_upload", fileInput.files[0], "/C:/Users/nfsmz/Downloads/URS MEDIA 1.0.pdf");
    form.append("std_stpm_upload", fileInput.files[0], "/C:/Users/nfsmz/Downloads/Bengkel Pengumpulan Keperluan Sistem Penempahan Intan (Slide) 1.0.pdf");
    form.append("std_diploma_upload", fileInput.files[0], "/C:/Users/nfsmz/OneDrive/Documents/05 PICOMS/7. SRS_Academic_ v2.0-sign.pdf");
    form.append("std_ijazah_upload", fileInput.files[0], "/C:/Users/nfsmz/OneDrive/Documents/05 PICOMS/URS_Academic v4.0.pdf");
    
    var settings = {
      "url": "localhost/api_pengurusan_pelajar/public/pelajarReg",
      "method": "POST",
      "timeout": 0,
      "processData": false,
      "mimeType": "multipart/form-data",
      "contentType": false,
      "data": form
    };
    
    $.ajax(settings).done(function (response) {
      console.log(response);
    });    

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

const submitPendaftaran = document.querySelector("#form-reg-pljr");
ko.applyBindings(new viewStudentRegModel(), submitPendaftaran);