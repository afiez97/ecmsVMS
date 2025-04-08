$(function(){
    $.ajaxSetup ({
        cache: false
    });

    announcementList(function(){
        $("#takwimList").html('');

        var columns = [
            { "name": "bil", "title": "No." },
            { "name": "twm_title", "title": "Title" },
            { "name": "twm_attch", "title": "Attachement" },
            { "name": "twm_sdate", "title": "Start Date", "breakpoints": "md sm xs" },
            { "name": "twm_edate", "title": "End Date", "breakpoints": "md sm xs" },
        ];

        let bil = 1;
        let convertList = JSON.stringify(obj_announcement.data);
        $("#dataList").val(convertList);
        var list = [];

        $.each(obj_announcement.data, function (i, field) {
            // console.log(field);
            if (field.attachment!= null)
            {
                printBtn = '<a class="nav-link text-success divSem" href="../../api_picoms/api_tetapan_picoms/public/upload_annoucement/' + field.attachment + '" target="_blank">' +
                '<span>' +
                    '<i class="fa fa-fw fa-download"></i>' +
                    '<span class="hidden-sm-down">Download</span>' +
                '</span>' +
              '</a>';
            }
            else {
                printBtn = '-';
            }
            

            list.push({
                bil: bil++, 
                twm_sdate: formatDate(field.twm_sdate), 
                twm_edate: formatDate(field.twm_edate), 
                twm_title: '<span class="text-uppercase"><b>'+field.twm_title+'</b><br></span><span style="white-space: pre-line;">'+field.twm_description+'</span>',
                // twm_attch: field.attachment, 
                twm_attch : printBtn,

            });
        });

        $("#takwimList").footable({
            "columns": columns,
            "rows": list,
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
});
var confirmed = false;


function announcementList(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmTakwim/listByStd",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_announcement = response;
        returnValue();
    });
}