$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let clg_id = window.sessionStorage.idPage;

    // list lecturer
    facLecturerList(clg_id, function(){
        var columns = [
            { "name": "emp_id", "title": "Staff No." },
            { "name": "emp_name", "title": "Staff Name" },
            { "name": "fac_id", "title": "Faculty", "breakpoints": "md sm xs" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];

        let bil = 1;
        let convertList = JSON.stringify(obj_facLect.data);
        $("#dataList").val(convertList);
        var list = [];

        $.each(obj_facLect.data, function (i, field) {
            list.push({
                fac_id: field.fac_name, emp_id: field.fk_emp, emp_name: field.emp_name,
                upt_btn: '<button class="btn btn-icon accent" title="Details" onclick="detail(\'' + field.fk_emp + '\')" id="btnPerincian"><i class="ion-ios-list-outline"></i></button>'
            });
        });

        $("#pensyarahList").footable({
            "columns": columns,
            "rows": list,
            "paging": {
                "enabled": true,
                "size": 10
            },
            "filtering": {
                "enabled": true,
                "placeholder": "Search...",
                "dropdownTitle": "Search For:"
            }
        });
    });
});


function detail(id){
    window.location.replace("atdQR_detail.html");
    window.sessionStorage.lectId = id;
}

