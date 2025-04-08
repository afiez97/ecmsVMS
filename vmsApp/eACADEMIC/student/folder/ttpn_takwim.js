function formatDate(date) {

    let newDate = '';
    if(date){
        let arrayDate = date.split("-");
        newDate = arrayDate[2]+'/'+arrayDate[1]+'/'+arrayDate[0];
    }else{
        newDate = '';
    }
    

    return newDate;
}

var viewTakwim = function () {
    // let list = [];
    var columns = [
        { "name": "bil", "title": "No." },
        { "name": "twm_title", "title": "Title" },
        { "name": "twm_description", "title": "Description", "breakpoints": "md sm xs" },
        { "name": "twm_sdate", "title": "Start Date", "breakpoints": "md sm xs" },
        { "name": "twm_edate", "title": "End Date", "breakpoints": "md sm xs" },
        // { "name": "twm_year", "title": "Tahun", "breakpoints": "md sm xs" },
        { "name": "twm_status", "title": "Status", "breakpoints": "md sm xs" },
        { "name": "upt_btn", "title": "Action" },
        // {"name":"status","title":"Status","breakpoints":"sm xs"}
    ];
    var settings = {
        "url": host+"api_tetapan_picoms/public/takwimList",
        "method": "POST",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        let bil = 1;
        let convertList = JSON.stringify(response.data);
        $("#dataList").val(convertList);
        // console.log(response)
        var list = [];

        $.each(response.data, function (i, field) {
            list.push({
                bil: bil++, twm_title: field.twm_title, twm_description: field.twm_description, twm_sdate: formatDate(field.twm_sdate), twm_edate: formatDate(field.twm_edate), twm_year: field.twm_year, twm_status: field.twm_status,
                "upt_btn":  '<button class="btn success" title="Update" onclick="loadData(\'' + i + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button>' +
                            ' <button class="btn danger" title="Delete" onclick="del_rekod(\''+field.twm_id+'\')"><i class="ion-trash-b"></i>'
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
};

const takwimList = document.querySelector("#tableTakwim");
ko.applyBindings(viewTakwim, takwimList);

function viewModel(e) {

    var self = this;
    self.clg_id = ko.observable("").extend({
        required: true,
    });

    self.clg_name = ko.observable("").extend({
        required: true
    });

    self.clg_address1 = ko.observable("").extend({
        required: true
    });

    self.clg_address2 = ko.observable("").extend({
        required: true
    });

    self.clg_address3 = ko.observable("").extend({
        required: true
    });

    self.clg_phoneno = ko.observable("").extend({
        required: true
    });

    self.clg_faxno = ko.observable("").extend({
        required: true
    });

    self.clg_email = ko.observable("").extend({
        required: true
    });

    var form = new FormData();
    form.append("clg_id", e);

    var settings = {
        "url": host+"api_tetapan_picoms/public/college/" + e,
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
    };

    $.ajax(settings).done(function (response) {

        $("#update-college").modal("show");
        result = JSON.parse(response);
        if (result.success) {
            self.clg_name = result.data.clg_name;
        }
    });

};

// ko.applyBindings(new viewModel(), submitCollege);
const submitCollege = document.querySelector("#update-collage");

var RegisterModel = function () {

    var settingsAPI = {
        "url": host+"api_tetapan_picoms/public/statusList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settingsAPI).done(function (response) {
        //LIST OPTION
        $('#status').append($('<option>', { 
            value: "",
            text : "Choose Status"
        }));
        $.each(response.data, function (i, item) {
            $('#status').append($('<option>', { 
                value: item.status_name,
                text : item.status_name 
            }));
        });

        //LIST OPTION
        $('#upt_twm_status').append($('<option>', { 
            value: "",
            text : "Choose Status"
        }));
        $.each(response.data, function (i, item) {
            $('#upt_twm_status').append($('<option>', { 
                value: item.status_name,
                text : item.status_name 
            }));
        });
        
    });

    
    var self = this;
    self.twm_title = ko.observable("").extend({
        required: true,
    });

    self.twm_description = ko.observable("").extend({
        required: true
    });

    self.twm_sdate = ko.observable("").extend({
        required: true
    });

    self.twm_edate = ko.observable("").extend({
        required: true
    });

    self.twm_status = ko.observable("").extend({
        required: true
    });

    self.Register = function () {

        let year = self.twm_sdate().substring(0, 4);
        let recordstatus = 'ADD';
        var error = ko.validation.group(self);

        if (error().length > 0) {
            error.showAllMessages();
            return;
        }

        var param = {
            twmTitle: self.twm_title(),
            twmDescription: self.twm_description(),
            twmSdate: self.twm_sdate(),
            twmEdate: self.twm_edate(),
            twmYear: year,
            twmStatus: self.twm_status(),
        }

        var form = new FormData();
        form.append("twm_title", self.twm_title());
        form.append("twm_description", self.twm_description());
        form.append("twm_sdate", self.twm_sdate());
        form.append("twm_edate", self.twm_edate());
        form.append("twm_year", year);
        form.append("twm_status", self.twm_status());
        form.append("recordstatus", recordstatus);

        swal({
            title: "Add Announcement",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            var settings = {
                "url": host+"api_tetapan_picoms/public/addTakwim",
                "method": "POST",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form
            };

            $.ajax(settings).done(function (response) {
                console.log(response);
                result = JSON.parse(response);
                if (!result.success) {
                    Swal(result.message, result.data, "error");
                    return;
                }

                sessionStorage.token = result.token;
                window.location.replace("adminPage.html");
            });
        });

    };
}

const RegisterTakwim = document.querySelector("#reg-takwim");
ko.applyBindings(new RegisterModel(), RegisterTakwim);

function loadData(indexs){   

    let data = JSON.parse($("#dataList").val());
    $('#upt_twm_id').val(data[indexs].twm_id);
    $('#upt_twm_title').val(data[indexs].twm_title);
    $('#upt_twm_description').val(data[indexs].twm_description);
    $('#upt_twm_sdate').val(data[indexs].twm_sdate);
    $('#upt_twm_edate').val(data[indexs].twm_edate);
    $('#upt_year').val(data[indexs].twm_year);
    $('#upt_twm_status').val(data[indexs].twm_status);    

    $("#update-takwim").modal("show");
    
}


//-------------------------------------------------- end date & start date validation --------------------------------------------------//
$("#upt_twm_edate").change(function(){
    let upt_twm_sdate = new Date($("#upt_twm_sdate").val());
    let upt_twm_edate = new Date($("#upt_twm_edate").val());
    
    if ((upt_twm_edate - upt_twm_sdate) < 0){
        alert('Invalid Date Range');
        $("#upt_twm_edate").val('');
    }
});

$("#upt_twm_sdate").change(function(){
    let upt_twm_sdate = new Date($("#upt_twm_sdate").val());
    let upt_twm_edate = new Date($("#upt_twm_edate").val());
    
    if ((upt_twm_sdate - upt_twm_edate ) > 0){
        alert('Invalid Date Range');
        $("#upt_twm_sdate").val('');
    }
});

$("#twm_edate").change(function(){
    let twm_sdate = new Date($("#twm_sdate").val());
    let twm_edate = new Date($("#twm_edate").val());
    
    if ((twm_edate - twm_sdate) < 0){
        alert('Invalid Date Range');
        $("#twm_edate").val('');
    }
});

$("#twm_sdate").change(function(){
    let twm_sdate = new Date($("#twm_sdate").val());
    let twm_edate = new Date($("#twm_edate").val());
    
    if ((twm_sdate - twm_edate ) > 0){
        alert('Invalid Date Range');
        $("#twm_sdate").val('');
    }
});
//-------------------------------------------------- end date & start date validation --------------------------------------------------//


$("#upt_takwim").click(function () {
    
    let upt_twm_id = $("#upt_twm_id").val();
    let upt_twm_title = $("#upt_twm_title").val();
    let upt_twm_description = $("#upt_twm_description").val();
    let upt_twm_sdate = $("#upt_twm_sdate").val();
    let upt_twm_edate = $("#upt_twm_edate").val();
    // let upt_year = $("#upt_year").val();
    let upt_twm_status = $("#upt_twm_status").val();
    let statusrekod = "EDT";
    let upt_year = upt_twm_sdate.substring(0,4);

    var form = new FormData();
        form.append("twm_id", upt_twm_id);
        form.append("twm_title", upt_twm_title);
        form.append("twm_description", upt_twm_description);
        form.append("twm_sdate", upt_twm_sdate);
        form.append("twm_edate", upt_twm_edate);
        form.append("twm_year", upt_year);
        form.append("twm_status", upt_twm_status);
        form.append("recordstatus", statusrekod);

    swal({
            title: "Update Calendar",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {

            var settings = {
                "url": host+"api_tetapan_picoms/public/takwimUpdate",
                "method": "POST",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form
              };

            $.ajax(settings).done(function (response) {
                console.log(response)
                result = JSON.parse(response);
                if (!result.success) {
                    Swal(result.message, result.data, "error");
                    return;
                }

                // sessionStorage.token = result.token;
                window.location.replace("adminPage.html");

            });
        });

});

function del_rekod(id){

    let statusrekod = 'DEL';
    let twm_id = id;

    var form = new FormData();
    form.append("recordstatus", statusrekod);
    form.append("twm_id", twm_id);
    

    swal({
            title: "Remove Calendar",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Remove",
            confirmButtonColor: "#ef193c",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {

            var settings = {
                "url": host+"api_tetapan_picoms/public/takwimDelete",
                "method": "POST",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form
              };

            $.ajax(settings).done(function (response) {
                console.log(response)
                result = JSON.parse(response);
                if (!result.success) {
                    Swal(result.message, result.data, "error");
                    return;
                }

                // sessionStorage.token = result.token;
                window.location.replace("adminPage.html");

            });
        });

}