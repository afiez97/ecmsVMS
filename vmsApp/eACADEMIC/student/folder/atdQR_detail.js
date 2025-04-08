var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
let lectId = getUrlVars()['id'];

$(function(){
    //---------- display detail lecturer ----------//
    var form = new FormData();
    form.append("emp_id", lectId);

    var settings = {
        "url": host+"api_tetapan_picoms/public/employee",
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
    };

    $.ajax(settings).done(function (response) {
        let result = JSON.parse(response);
        let data = result.data;
        // console.log(result)

        $('#emp_name').html(data.emp_name);
    });
    //---------- end display detail lecturer ----------//


    //---------- display timetable lect list ----------//
    var settings = {
        "url": host+"api_timetbl_picoms/public/misTimetbl/listTimetblLect/"+lectId,
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        console.log(response);
        let bil = 1;
        let convertList = JSON.stringify(response.data);
        $("#dataList").val(convertList);
        let list_data = [];
        let columns = [
            { "name": "bil", "title": "No." },
            { "name": "pgm_id", "title": "Programme" },
            { "name": "crs_code", "title": "Course Code" },
            { "name": "crs_name", "title": "Course Name", "breakpoints": "md sm xs" },
            { "name": "cot_intake", "title": "Intake", "breakpoints": "md sm xs" },
            { "name": "tmt_group", "title": "Group", "breakpoints": "md sm xs" },
            { "name": "tmt_est_student", "title": "Estimated Student", "breakpoints": "md sm xs" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" }
        ];
        
        $.each(response.data, function(i, field){
            list_data.push({
                "bil": bil++, "pgm_id": field.pgm_name, "crs_code": field.crs_code, "crs_name": field.crs_name, "cot_intake": field.cot_intake, "tmt_group": field.tmt_group, "tmt_est_student": field.tmt_est_student,
                "upt_btn": '<button class="btn grey" title="QR Code" onclick="loadData(\'' + i + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="fa fa-qrcode"></i></button> ' 
                            // '<button class="btn danger" title="Delete" onclick="del_rekod(\''+field.pk_id+'\')"><i class="ion-trash-b"></i>'
            });
        });
        $('#tblTimetable').html('');
        $('#tblTimetable').footable({
            "columns": columns,
            "rows": list_data,
            "paging": {
                "enabled": true,
                "size": 10
            },
            "filtering": {
                "enabled": true,
                "placeholder": "Search...",
                "dropdownTitle": "Search for:"
            }

        });
    });

    
    //---------- end display timetable lect list ----------//


    $('#btnBack').click(function(){
        location.href = 'adminPage.html';
    });
});

function loadData(indexs){
    $("#view_qrCode").modal("show");
}

