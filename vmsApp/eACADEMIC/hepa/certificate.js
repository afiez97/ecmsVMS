$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let idPeserta = window.sessionStorage.idPeserta;
    let imgUrl = host+'api_hep/public/progAct_cert/'+ window.sessionStorage.imgUrl;
    let token = window.sessionStorage.token;
    var doc = new jsPDF("potrait");



    if (imgUrl != null) {
      
      toDataURL(imgUrl, function(dataURL){
        var dataURLconvert = dataURL;
        if(token == null){
          window.close();
      }
      else{
        if(idPeserta != null && idPeserta !== 'undefined'){
          load_program(idPeserta, function(){
          // console.log(dataURLconvert);
            
              if(obj_peserta.success ){
                  let data = obj_peserta.data;
                  let startDate = formatDate(data.prog_startdate);
                  let endDate = ' - '+formatDate(data.prog_enddate);
  
                  var width = doc.internal.pageSize.getWidth();
                  var height = doc.internal.pageSize.getHeight();
                  doc.addImage(dataURLconvert, "JPEG", 0, 0, width, height);
  
                  doc.setFontSize(40);
                  doc.setFont("Congenial Black", "bold");
                  doc.text('SIJIL PENYERTAAN', doc.internal.pageSize.getWidth()/2, 100, { align: "center" });
  
                  doc.setFontSize(16);
                  doc.setFont("helvetica", "normal");
                  doc.text('Dengan ini diperakui bahawa', doc.internal.pageSize.getWidth()/2, 120, { align: "center", maxWidth: '100' });
  
                  doc.setFontSize(20);
                  doc.setFont("helvetica", "bold");
                  doc.text(data.sti_name.toUpperCase(), doc.internal.pageSize.getWidth()/2, 130, { align: "center" });
  
                  doc.setFontSize(16);
                  doc.setFont("helvetica", "normal");
                  doc.text('Telah menyertai', doc.internal.pageSize.getWidth()/2, 150, { align: "center", maxWidth: '100' });
  
                  doc.setFontSize(18);
                  doc.setFont("helvetica", "bold");
                  doc.text(data.prog_title.toUpperCase(), doc.internal.pageSize.getWidth()/2, 160, { align: "center", maxWidth: '100' });
  
                  doc.setFontSize(16);
                  doc.setFont("helvetica", "normal");
                  doc.text('Pada', doc.internal.pageSize.getWidth()/2, 190, { align: "center", maxWidth: '100' });
  
                  doc.setFontSize(20);
                  doc.setFont("helvetica", "bold");
                  doc.text(startDate+''+endDate, doc.internal.pageSize.getWidth()/2, 200, { align: "center", maxWidth: '100' });
  
                  doc.setFontSize(16);
                  doc.setFont("helvetica", "normal");
                  doc.text('Anjuran', doc.internal.pageSize.getWidth()/2, 220, { align: "center", maxWidth: '100' });
  
                  doc.setFontSize(20);
                  doc.setFont("helvetica", "bold");
                  doc.text(data.prog_org.toUpperCase(), doc.internal.pageSize.getWidth()/2, 230, { align: "center", maxWidth: '100' });
  
                  doc.setFontSize(18);
                  doc.setFont("Congenial Black", "bold");
                  doc.text('Syabas dan tahniah diucapkan', doc.internal.pageSize.getWidth()/2, 250, { align: "center" });
  
                  PDFObject.embed(doc.output("datauristring"), "#preview-pdf");
              }
          });
        }
        else{
       
          var width = doc.internal.pageSize.getWidth();
          var height = doc.internal.pageSize.getHeight();
          doc.addImage(dataURLconvert, "JPEG", 0, 0, width, height);

          doc.setFontSize(40);
          doc.setFont("Congenial Black", "bold");
          doc.text('SIJIL PENYERTAAN', doc.internal.pageSize.getWidth()/2, 100, { align: "center" });

          doc.setFontSize(16);
          doc.setFont("helvetica", "normal");
          doc.text('Dengan ini diperakui bahawa', doc.internal.pageSize.getWidth()/2, 120, { align: "center", maxWidth: '100' });

          doc.setFontSize(16);
          doc.setFont("helvetica", "normal");
          doc.text('Telah menyertai', doc.internal.pageSize.getWidth()/2, 150, { align: "center", maxWidth: '100' });

      
          doc.setFontSize(16);
          doc.setFont("helvetica", "normal");
          doc.text('Pada', doc.internal.pageSize.getWidth()/2, 190, { align: "center", maxWidth: '100' });

   
          doc.setFontSize(16);
          doc.setFont("helvetica", "normal");
          doc.text('Anjuran', doc.internal.pageSize.getWidth()/2, 220, { align: "center", maxWidth: '100' });

    
          doc.setFontSize(18);
          doc.setFont("Congenial Black", "bold");
          doc.text('Syabas dan tahniah diucapkan', doc.internal.pageSize.getWidth()/2, 250, { align: "center" });

          PDFObject.embed(doc.output("datauristring"), "#preview-pdf");
        }
      }
    });
  
    } else {

        // let data = obj_peserta.data;
        // let startDate = formatDate(data.prog_startdate);
        // let endDate = ' - '+formatDate(data.prog_enddate);
        
        var width = doc.internal.pageSize.getWidth();
        var height = doc.internal.pageSize.getHeight();
        doc.addImage(dataURL, "PNG", 0, 0, width, height);

        doc.setFontSize(40);
        doc.setFont("Congenial Black", "bold");
        doc.text('SIJIL PENYERTAAN', doc.internal.pageSize.getWidth()/2, 100, { align: "center" });

        doc.setFontSize(16);
        doc.setFont("helvetica", "normal");
        doc.text('Dengan ini diperakui bahawa', doc.internal.pageSize.getWidth()/2, 120, { align: "center", maxWidth: '100' });

        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text(data.sti_name.toUpperCase(), doc.internal.pageSize.getWidth()/2, 130, { align: "center" });

        doc.setFontSize(16);
        doc.setFont("helvetica", "normal");
        doc.text('Telah menyertai', doc.internal.pageSize.getWidth()/2, 150, { align: "center", maxWidth: '100' });

        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text(data.prog_title.toUpperCase(), doc.internal.pageSize.getWidth()/2, 160, { align: "center", maxWidth: '100' });

        doc.setFontSize(16);
        doc.setFont("helvetica", "normal");
        doc.text('Pada', doc.internal.pageSize.getWidth()/2, 190, { align: "center", maxWidth: '100' });

        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text(startDate+''+endDate, doc.internal.pageSize.getWidth()/2, 200, { align: "center", maxWidth: '100' });

        doc.setFontSize(16);
        doc.setFont("helvetica", "normal");
        doc.text('Anjuran', doc.internal.pageSize.getWidth()/2, 220, { align: "center", maxWidth: '100' });

        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text(data.prog_org.toUpperCase(), doc.internal.pageSize.getWidth()/2, 230, { align: "center", maxWidth: '100' });

        doc.setFontSize(18);
        doc.setFont("Congenial Black", "bold");
        doc.text('Syabas dan tahniah diucapkan', doc.internal.pageSize.getWidth()/2, 250, { align: "center" });

        PDFObject.embed(doc.output("datauristring"), "#preview-pdf");
    }


    console.log(dataURLconvert);







   
});

function toDataURL(src, callback){
  var image = new Image();
  image.crossOrigin = 'Anonymous';
  image.onload = function(){
     var canvas = document.createElement('canvas');
     var context = canvas.getContext('2d');
     canvas.height = this.naturalHeight;
     canvas.width = this.naturalWidth;
     context.drawImage(this, 0, 0);
     var dataURL = canvas.toDataURL('image/jpeg');
     callback(dataURL);
  };
  image.src = src;
}


function load_program(id, returnValue){
    var settings = {
      "url": host+"api_hep/public/heppeserta/show/"+id,
      "method": "GET",
      "timeout": 0,
      "headers": {
        "Authorization": "picoms " + window.sessionStorage.token
      },
    };
    
    $.ajax(settings).done(function (response){
      obj_peserta = response;
      returnValue();
    });
}