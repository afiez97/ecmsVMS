class get{
    constructor(url,token){
        this.url = url;
        this.token = token;
    }

    execute(){
        var settings = {
            "url": this.url,
            "method": "GET",
            "timeout": 0,
            "headers": {
              "Authorization": this.token
            },
            async: false
        };
    
        let request = $.ajax(settings).responseText;
        if(request != "Unauthorized."){
            request = JSON.parse(request);
            return request;
        } else {
            request = {success: false, message: request};
            return request;
        }
    }
}

class post{
    constructor(url,form,token){
        this.url = url;
        this.form = form; 
        this.token = token;
    }

    execute(){
        var settings = {
            "url": this.url,
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Authorization": this.token
            },
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": this.form,
            async: false
        };
    
        let request = $.ajax(settings).responseText;
        if(request != "Unauthorized."){
            request = JSON.parse(request);
            return request;
        } else {
            request = {success: false, message: request};
            return request;
        }
    }
}

class getPublic{
    constructor(url,token){
        this.url = url;
        this.token = token;
    }

    execute(){
        var settings = {
            "url": this.url,
            "method": "GET",
            "timeout": 0,
            "headers": {
              "private_access": '88606ce5f0f33116e1e43f1482dc2976'+'0L1v3'+this.token
            },
            async: false
        };
    
        let request = $.ajax(settings).responseText;
        if(request != "Unauthorized."){
            request = JSON.parse(request);
            return request;
        } else {
            request = {success: false, message: request};
            return request;
        }
    }
}

class postPublic{
    constructor(url,form,token){
        this.url = url;
        this.form = form; 
        this.token = token;
    }

    execute(){
        var settings = {
            "url": this.url,
            "method": "POST",
            "timeout": 0,
            "headers": {
              "private_access": '88606ce5f0f33116e1e43f1482dc2976'+'0L1v3'+this.token
            },
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": this.form,
            async: false
        };
    
        let request = $.ajax(settings).responseText;
        if(request != "Unauthorized."){
            request = JSON.parse(request);
            return request;
        } else {
            request = {success: false, message: request};
            return request;
        }
    }
}

class postJson{
    constructor(url,data,token){
        this.url = url;
        this.token = token;
        this.data = data;
    }

    execute(){
        var settings = {
            "url": this.url,
            "method": "POST",
            "timeout": 0,
            "headers": {
                "private_access": '88606ce5f0f33116e1e43f1482dc2976'+'0L1v3'+this.token
              },
            processData: false,
            mimeType: "multipart/form-data",
            contentType: "application/json",
            data: JSON.stringify(this.data),
            async: false
        };
    
        let request = $.ajax(settings).responseText;
        if(request != "Unauthorized."){
            request = JSON.parse(request);
            return request;
        } else {
            request = {success: false, message: request};
            return request;
        }
    }
}