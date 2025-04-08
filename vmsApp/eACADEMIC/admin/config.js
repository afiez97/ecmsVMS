if(window.location.hostname == "localhost" && !window.location.port){
// if(window.location.hostname == "localhost" && window.location.port == "80"){
    var host = "http://"+window.location.hostname+"/vmsApp/api_picoms/";
    var url = "http://"+window.location.hostname+"/vmsApp/eACADEMIC/";
}
else if(window.location.hostname == "localhost" && window.location.port == "8081"){
    var host = "http://"+window.location.hostname+":8082/";
//    var host = "http://"+window.location.hostname+":8081/picoms/api_picoms/";

    var url = "http://"+window.location.hostname+":8081/vmsApp/eACADEMIC/";
}

//to allow the tailscale
else if(window.location.protocol == "http:"){
    var host = "http://"+window.location.hostname+"/vmsApp/api_picoms/";
    var url = "http://"+window.location.hostname+"/vmsApp/eACADEMIC/";
}

else {
    var host = "https://"+window.location.hostname+"/api_picoms/";
    var url = "https://"+window.location.hostname+"/";
}

const dekan = ["DD","DD_HOP","DEAN","DEAN_MGR"];
const ketuaPJ = ["HOP","HOD_HOP","HOP","HOD"];
const pensyarah = ["DS41","DS45","DS51","DS52","DS53","DS54","P.K","VK7","COOR","N51"];
const instrutor = ["U32","COOR_CLIN"];
const anr = ["N32","N29","N17"];
const postGrade  = ['MBA','PNG','MNG','MHS','PHD Sc'];

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function validateFile(name) {
    var file = $('#'+name).val();
    var ext = file.split(".");
    ext = ext[ext.length-1].toLowerCase();      
    var arrayExtensions = ["jpg" , "jpeg", "png", "bmp", "pdf"];

    if (arrayExtensions.lastIndexOf(ext) == -1) {
        swal("Wrong extension type.","File Cannot Proceed To Upload","error");
        $('#'+name).val("");
    }
}

function validateImage(name) {
    var file = $('#'+name).val();
    var ext = file.split(".");
    ext = ext[ext.length-1].toLowerCase();      
    var arrayExtensions = ["jpg" , "jpeg", "png", "bmp", "gif"];

    if (arrayExtensions.lastIndexOf(ext) == -1) {
        swal("Wrong extension type.","File Cannot Proceed To Upload","error");
        $('#'+name).val("");
    }
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
  
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
  
    return [day, month, year].join('/');
  }

  const convertTime = timeStr => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
       hours = '00';
    }
    if (modifier === 'PM') {
       hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes}`;
 };

 function formatNumber(number)
{
    number = number.toFixed(2) + '';
    x = number.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1;
}

function logOut(){
    window.sessionStorage.clear();
    window.location.replace('../admin');
}
