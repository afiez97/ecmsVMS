if(window.location.hostname == "localhost" && !window.location.port ){
    // if(window.location.hostname == "localhost" && window.location.port == "80"){
    var host = "http://"+window.location.hostname+"/picoms/api_picoms/";
}
else if(window.location.hostname == "localhost" && window.location.port == "8081"){
    var host = "http://"+window.location.hostname+":8081/picoms/api_picoms/";
}

//to allow the tailscale
else if(window.location.protocol == "http:"){
    var host = "http://"+window.location.hostname+"/picoms/api_picoms/";
}
else {
    var host = "https://"+window.location.hostname+"/api_picoms/";
}

//gila la 


function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function logOut(){
    window.sessionStorage.clear();
    window.location.reload();
}
