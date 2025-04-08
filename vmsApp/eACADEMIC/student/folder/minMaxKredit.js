var viewCredit = function () {
    // let list = [];
    var columns = [
        { "name": "bil", "title": "No." },
        { "name": "crd_session", "title": "Semester Type" },
        { "name": "crd_type", "title": "Study Scheme", "breakpoints":"sm xs" },
        { "name": "crd_min", "title": "Minimum Credit" },
        { "name": "crd_max", "title": "Maximum Credit" },
        { "name": "upt_btn", "title": "Action", "breakpoints":"sm xs" },
        // {"name":"status","title":"Status","breakpoints":"sm xs"}
    ];
    var settings = {
        "url": host+"api_tetapan_picoms/public/creditList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        let bil = 1;
        let convertList = JSON.stringify(response.data);
        $("#dataList").val(convertList);
        console.log(response)
        var list = [];

        $.each(response.data, function (i, field) {
            list.push({
                bil: bil++, crd_session: field.sem_type_name, crd_type: field.crd_type, crd_min: field.crd_min, crd_max: field.crd_max,
                upt_btn:    '<button class="btn btn-icon success" title="Update" onclick="loadData(\'' + i + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button>' +
                            ' <button class="btn btn-icon danger" title="Remove" onclick="del_rekod(\''+field.crd_id+'\')"><i class="ion-trash-b"></i>'
            });
        });

        $("#creditList").footable({
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

const creditList = document.querySelector("#tableCredit");
ko.applyBindings(new viewCredit(), creditList);

var RegisterModel = function () {
    //Dropdown Sesi Akademik List
    var settings = {
        "url": host+"api_tetapan_picoms/public/semtypeList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };

        $.ajax(settings).done(function (response) {
            //LIST OPTION
            $('#crd_session').append($('<option>', { 
                value: "",
                text : "Choose Semester Type" 
            }));
            $.each(response.data, function (i, item) {
                $('#crd_session').append($('<option>', { 
                    value: item.sem_type_code_short,
                    text : item.sem_type_name 
                }));
            });

            //LIST OPTION UPDATE
            $('#upt_crd_session').append($('<option>', { 
                value: "",
                text : "Choose Semester Type" 
            }));
            $.each(response.data, function (i, item) {
                $('#upt_crd_session').append($('<option>', { 
                    value: item.sem_type_code_short,
                    text : item.sem_type_name 
                }));
            });
            
        });
    // END Dropdown Sesi Akademik List
    
    //Dropdown Jenis List
    var settings = {
        "url": host+"api_tetapan_picoms/public/modeList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };

        $.ajax(settings).done(function (response) {
            //LIST OPTION
            $('#crd_type').append($('<option>', { 
                value: "",
                text : "Choose Study Scheme" 
            }));
            $.each(response.data, function (i, item) {
                $('#crd_type').append($('<option>', { 
                    value: item.mode_name,
                    text : item.mode_name 
                }));
            });

            //LIST OPTION UPDATE
            $('#upt_crd_type').append($('<option>', { 
                value: "",
                text : "Choose Study Scheme" 
            }));
            $.each(response.data, function (i, item) {
                $('#upt_crd_type').append($('<option>', { 
                    value: item.mode_name,
                    text : item.mode_name 
                }));
            });
            
        });
    // END Dropdown Credit Transfer List
    var self = this;
    self.crd_session = ko.observable("").extend({
        required: true,
    });

    self.crd_type = ko.observable("").extend({
        required: true
    });

    self.crd_min = ko.observable("").extend({
        required: true
    });

    self.crd_max = ko.observable("").extend({
        required: true
    });

    self.Register = function () {

        var error = ko.validation.group(self);

        if (error().length > 0) {
            error.showAllMessages();
            return;
        }

        var param = {
            twmTitle: self.crd_session(),
            twmDescription: self.crd_type(),
            twmSdate: self.crd_min(),
            twmEdate: self.crd_max(),
        }
        console.log(param)

        var form = new FormData();

        form.append("crd_session", self.crd_session());
        form.append("crd_type", self.crd_type());
        form.append("crd_min", self.crd_min());
        form.append("crd_max", self.crd_max());
        form.append("recordstatus", 'ADD');

        swal({
            title: "Register Credit",
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
                "url": host+"api_tetapan_picoms/public/addCredit",
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

const RegisterCredit = document.querySelector("#reg-min-max");
ko.applyBindings(new RegisterModel(), RegisterCredit);

// var viewModel = function () {
//     //Dropdown Sesi Akademik List
//     var settings = {
//         "url": host+"api_tetapan_picoms/public/semtypeList",
//         "method": "GET",
//         "timeout": 0,
//         // "header":{
//         //     "Authentication": "ASDCM"+window.sessionStorage.token
//         //   }
//       };

//         $.ajax(settings).done(function (response) {
//             //LIST OPTION
//             $('#upt_crd_session').append($('<option>', { 
//                 value: "",
//                 text : "Pilih Sesi" 
//             }));
//             $.each(response.data, function (i, item) {
//                 $('#upt_crd_session').append($('<option>', { 
//                     value: item.sem_type_code_short,
//                     text : item.sem_type_code 
//                 }));
//             });
            
//         });
//     // END Dropdown Sesi Akademik List
    
//     //Dropdown Jenis List
//     var settings = {
//         "url": host+"api_tetapan_picoms/public/modeList",
//         "method": "GET",
//         "timeout": 0,
//         // "header":{
//         //     "Authentication": "ASDCM"+window.sessionStorage.token
//         //   }
//       };

//         $.ajax(settings).done(function (response) {
//             //LIST OPTION
//             $('#upt_crd_type').append($('<option>', { 
//                 value: "",
//                 text : "Choose Study Scheme" 
//             }));
//             $.each(response.data, function (i, item) {
//                 $('#upt_crd_type').append($('<option>', { 
//                     value: item.mode_name,
//                     text : item.mode_name 
//                 }));
//             });
            
//         });
//     // END Dropdown Credit Transfer List
//     var self = this;
//     self.crd_session = ko.observable("").extend({
//         required: true,
//     });

//     self.crd_type = ko.observable("").extend({
//         required: true
//     });

//     self.crd_min = ko.observable("").extend({
//         required: true
//     });

//     self.crd_max = ko.observable("").extend({
//         required: true
//     });

//     self.updateCredit = function () {

//         var error = ko.validation.group(self);

//         if (error.length > 0) {
//             error.showAllMessages();
//             return;
//         }

//         var param = {
//             twmTitle: self.crd_session(),
//             twmDescription: self.crd_type(),
//             twmSdate: self.crd_min(),
//             twmEdate: self.crd_max(),
//         }
//         console.log(param)

//         var form = new FormData();

//         form.append("crd_session", self.crd_session());
//         form.append("crd_type", self.crd_type());
//         form.append("crd_min", self.crd_min());
//         form.append("crd_max", self.crd_max());

//         swal({
//             title: "Kemaskini Kredit",
//             text: "Anda Pasti Untuk Kemaskini?",
//             type: "question",
//             showCancelButton: true,
//             confirmButtonText: "Kemaskini",
//             closeOnConfirm: true,
//             allowOutsideClick: false,
//             html: false
//         }).then(function () {
//             var settings = {
//                 "url": host+"api_tetapan_picoms/public/updateCredit",
//                 "method": "POST",
//                 "timeout": 0,
//                 "processData": false,
//                 "mimeType": "multipart/form-data",
//                 "contentType": false,
//                 "data": form
//             };

//             $.ajax(settings).done(function (response) {
//                 console.log(response)
//                 result = JSON.parse(response);
//                 if (!result.success) {
//                     Swal(result.message, result.data, "error");
//                     return;
//                 }

//                 sessionStorage.token = result.token;
//                 window.location.replace("adminPage.html");

//             });
//         });
//     };
// };

// // ko.applyBindings(new viewModel(), submitCollege);
// const submitCredit = document.querySelector("#update-min-max");
// ko.applyBindings(new viewModel(), submitCredit);

function loadData(indexs) {   

    let data = JSON.parse($("#dataList").val());
    $('#upt_crd_id').val(data[indexs].crd_id);
    $('#upt_crd_session').val(data[indexs].crd_session);
    $('#upt_crd_type').val(data[indexs].crd_type);
    $('#upt_crd_min').val(data[indexs].crd_min);
    $('#upt_crd_max').val(data[indexs].crd_max);

    $("#update-min-max").modal("show");
}


$("#upt_kredit").click(function () {
    
    let upt_crd_id = $("#upt_crd_id").val();
    let upt_crd_session = $("#upt_crd_session").val();
    let upt_crd_type = $("#upt_crd_type").val();
    let upt_crd_min = $("#upt_crd_min").val();
    let upt_crd_max = $("#upt_crd_max").val();
    let upt_loc_capacity = $("#upt_loc_capacity").val();
    let upt_loc_status = $("#upt_loc_status").val();
    let statusrekod = "EDT";

    var form = new FormData();
        form.append("crd_id", upt_crd_id);
        form.append("crd_session", upt_crd_session);
        form.append("crd_type", upt_crd_type);
        form.append("crd_min", upt_crd_min);
        form.append("crd_max", upt_crd_max);
        form.append("loc_capacity", upt_loc_capacity);
        form.append("loc_status", upt_loc_status);
        form.append("recordstatus", statusrekod);

    swal({
            title: "Update Minimum/Maximum Credit Per Semester",
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
                "url": host+"api_tetapan_picoms/public/creditUpdate",
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
    let crd_id = id;

    var form = new FormData();
    form.append("recordstatus", statusrekod);
    form.append("crd_id", crd_id);
    

    swal({
            title: "Remove Minimum/Maximum Credit Per Semester",
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
                "url": host+"api_tetapan_picoms/public/creditDelete",
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