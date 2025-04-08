var viewCect = function () {
    // let list = [];
    var columns = [
        { "name": "bil", "title": "No." },
        { "name": "ctr_code", "title": "Course Code" },
        { "name": "ctr_cretransfer", "title": "Credit Exemption/Credit Transfer" },
        { "name": "ctr_gpatransfer", "title": "Credit Hour" },
        { "name": "ctr_cgpatransfer", "title": "Credit Exemption/Credit Transfer Process Payment", "breakpoints": "md sm xs" },
        { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        // {"name":"status","title":"Status","breakpoints":"sm xs"}
    ];
    var settings = {
        "url": host+"api_tetapan_picoms/public/cectList",
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
            let ctr_cretransfer = "YES";
            let ctr_gpatransfer = "YES";
            let ctr_cgpatransfer = "YES";

            if(field.ctr_cgpatransfer == "N"){
                ctr_cgpatransfer = "NO";
            }

            if(field.ctr_cretransfer == "N"){
                ctr_cretransfer = "NO";
            }

            // if(field.ctr_gpatransfer == "N"){
            //     ctr_gpatransfer = "NO";
            // }

            list.push({
                "bil": bil++, "ctr_code": field.ctr_code, "ctr_cretransfer": ctr_cretransfer, "ctr_gpatransfer": field.ctr_gpatransfer, 
                "ctr_cgpatransfer": ctr_cgpatransfer, "ctr_min_percentage": field.ctr_min_percentage, "ctr_max_percentage" : field.ctr_max_percentage, "ctr_grade": field.ctr_grade, 
                upt_btn:    '<button class="btn btn-icon success" onclick="loadData(\'' + i + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button>' +
                            ' <button class="btn btn-icon danger" title="Remove" onclick="del_rekod(\''+field.id+'\')"><i class="ion-trash-b"></i>'
            });
        });

        $("#cectList").footable({
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

const cectList = document.querySelector("#tableCect");
ko.applyBindings(viewCect, cectList);

var RegisterModel = function () {
    //Dropdown CTR Code List
    var settings = {
        "url": host+"api_tetapan_picoms/public/ctrcodeList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };

        $.ajax(settings).done(function (response) {
            //LIST OPTION
            $('#ctr_code').append($('<option>', { 
                value: "",
                text : "Choose Course Code" 
            }));
            $.each(response.data, function (i, item) {
                $('#ctr_code').append($('<option>', { 
                    value: item.ctrcode_code,
                    text : item.ctrcode_name 
                }));
            });

            //LIST OPTION UPDATE
            $('#upt_ctr_code').append($('<option>', { 
                value: "",
                text : "Choose Course Code" 
            }));
            $.each(response.data, function (i, item) {
                $('#upt_ctr_code').append($('<option>', { 
                    value: item.ctrcode_code,
                    text : item.ctrcode_name 
                }));
            });
            
        });
    // END Dropdown CTR Code List
    
    //Dropdown Credit Transfer List
    var settings = {
        "url": host+"api_tetapan_picoms/public/decisionList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };

        $.ajax(settings).done(function (response) {
            //LIST OPTION
            $('#ctr_cretransfer').append($('<option>', { 
                value: "",
                text : "Choose Credit Exemption/Credit Transfer" 
            }));
            $.each(response.data, function (i, item) {
                $('#ctr_cretransfer').append($('<option>', { 
                    value: item.decision_code,
                    text : item.decision_name 
                }));
            });

            //LIST OPTION UPDATE
            $('#upt_ctr_cretransfer').append($('<option>', { 
                value: "",
                text : "Choose Credit Exemption/Credit Transfer" 
            }));
            $.each(response.data, function (i, item) {
                $('#upt_ctr_cretransfer').append($('<option>', { 
                    value: item.decision_code,
                    text : item.decision_name 
                }));
            });
            
        });
    // END Dropdown Credit Transfer List
    
    //Dropdown GPA Transfer List
    // var settings = {
    //     "url": host+"api_tetapan_picoms/public/decisionList",
    //     "method": "GET",
    //     "timeout": 0,
    //     // "header":{
    //     //     "Authentication": "ASDCM"+window.sessionStorage.token
    //     //   }
    //   };

    //     $.ajax(settings).done(function (response) {
    //         //LIST OPTION
    //         $('#ctr_gpatransfer').append($('<option>', { 
    //             value: "",
    //             text : "Choose Credit Hour" 
    //         }));
    //         $.each(response.data, function (i, item) {
    //             $('#ctr_gpatransfer').append($('<option>', { 
    //                 value: item.decision_code,
    //                 text : item.decision_name 
    //             }));
    //         });

    //         //LIST OPTION UPDATE
    //         $('#upt_ctr_gpatransfer').append($('<option>', { 
    //             value: "",
    //             text : "Choose Credit Hour" 
    //         }));
    //         $.each(response.data, function (i, item) {
    //             $('#upt_ctr_gpatransfer').append($('<option>', { 
    //                 value: item.decision_code,
    //                 text : item.decision_name 
    //             }));
    //         });
            
    //     });
    // END Dropdown GPA Transfer List
    
    //Dropdown CGPA Transfer List
    var settings = {
        "url": host+"api_tetapan_picoms/public/decisionList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };

        $.ajax(settings).done(function (response) {
            //LIST OPTION
            $('#ctr_cgpatransfer').append($('<option>', { 
                value: "",
                text : "Choose Credit Exemption/Credit Transfer Process Payment" 
            }));
            $.each(response.data, function (i, item) {
                $('#ctr_cgpatransfer').append($('<option>', { 
                    value: item.decision_code,
                    text : item.decision_name 
                }));
            });

            //LIST OPTION UPDATE
            $('#upt_ctr_cgpatransfer').append($('<option>', { 
                value: "",
                text : "Choose Credit Exemption/Credit Transfer Process Payment" 
            }));
            $.each(response.data, function (i, item) {
                $('#upt_ctr_cgpatransfer').append($('<option>', { 
                    value: item.decision_code,
                    text : item.decision_name 
                }));
            });
            
        });
    // END Dropdown CGPA Transfer List
    
    //Dropdown Gred List
    var settings = {
        "url": host+"api_tetapan_picoms/public/gradeList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };

        $.ajax(settings).done(function (response) {
            //LIST OPTION
            $('#ctr_grade').append($('<option>', { 
                value: "",
                text : "Choose Grade" 
            }));
            $.each(response.data, function (i, item) {
                $('#ctr_grade').append($('<option>', { 
                    value: item.grade_name,
                    text : item.grade_name 
                }));
            });

            //LIST OPTION UPDATE
            $('#upt_ctr_grade').append($('<option>', { 
                value: "",
                text : "Choose Grade" 
            }));
            $.each(response.data, function (i, item) {
                $('#upt_ctr_grade').append($('<option>', { 
                    value: item.grade_name,
                    text : item.grade_name 
                }));
            });
            
        });
    // END Dropdown Gred List
    
    var self = this;
    self.ctr_code = ko.observable("").extend({
        required: true,
    });

    self.ctr_cretransfer = ko.observable("").extend({
        required: true
    });

    self.ctr_gpatransfer = ko.observable("").extend({
        required: true
    });

    self.ctr_cgpatransfer = ko.observable("").extend({
        required: true
    });

    self.ctr_min_percentage = ko.observable("").extend({
        required: true
    });

    self.ctr_max_percentage = ko.observable("").extend({
        required: true
    });

    self.ctr_grade = ko.observable("").extend({
        required: true
    });

    self.Register = function () {

        var error = ko.validation.group(self);

        if (error().length > 0) {
            error.showAllMessages();
            return;
        }

        var param = {
            twmTitle: self.ctr_code(),
            twmDescription: self.ctr_cretransfer(),
            twmSdate: self.ctr_gpatransfer(),
            twmEdate: self.ctr_cgpatransfer(),
            twmYear: self.ctr_min_percentage(),
            twmStatus: self.ctr_grade(),
        }
        console.log(param)

        var form = new FormData();
// alert(self.ctr_gpatransfer());
        form.append("ctr_code", self.ctr_code());
        form.append("ctr_cretransfer", self.ctr_cretransfer());
        form.append("ctr_gpatransfer", self.ctr_gpatransfer());
        form.append("ctr_cgpatransfer", self.ctr_cgpatransfer());
        form.append("ctr_min_percentage", self.ctr_min_percentage());
        form.append("ctr_max_percentage", self.ctr_max_percentage());
        form.append("ctr_grade", self.ctr_grade());
        form.append("recordstatus", 'ADD');

        swal({
            title: "Register Credit Exemption/Credit Transfer",
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
                "url": host+"api_tetapan_picoms/public/addCect",
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

const RegisterCect = document.querySelector("#reg-kredit");
ko.applyBindings(new RegisterModel(), RegisterCect);

// var viewModel = function () {
//     //Dropdown CTR Code List
//     var settings = {
//         "url": host+"api_tetapan_picoms/public/ctrcodeList",
//         "method": "GET",
//         "timeout": 0,
//         // "header":{
//         //     "Authentication": "ASDCM"+window.sessionStorage.token
//         //   }
//       };

//         $.ajax(settings).done(function (response) {
//             //LIST OPTION
//             $('#upt_ctr_code').append($('<option>', { 
//                 value: "",
//                 text : "Choose Course Code" 
//             }));
//             $.each(response.data, function (i, item) {
//                 $('#upt_ctr_code').append($('<option>', { 
//                     value: item.ctrcode_code,
//                     text : item.ctrcode_name 
//                 }));
//             });
            
//         });
//     // END Dropdown CTR Code List
    
//     //Dropdown Credit Transfer List
//     var settings = {
//         "url": host+"api_tetapan_picoms/public/decisionList",
//         "method": "GET",
//         "timeout": 0,
//         // "header":{
//         //     "Authentication": "ASDCM"+window.sessionStorage.token
//         //   }
//       };

//         $.ajax(settings).done(function (response) {
//             //LIST OPTION
//             $('#upt_ctr_cretransfer').append($('<option>', { 
//                 value: "",
//                 text : "Choose Credit Exemption/Credit Transfer" 
//             }));
//             $.each(response.data, function (i, item) {
//                 $('#upt_ctr_cretransfer').append($('<option>', { 
//                     value: item.decision_code,
//                     text : item.decision_name 
//                 }));
//             });
            
//         });
//     // END Dropdown Credit Transfer List
    
//     //Dropdown GPA Transfer List
//     var settings = {
//         "url": host+"api_tetapan_picoms/public/decisionList",
//         "method": "GET",
//         "timeout": 0,
//         // "header":{
//         //     "Authentication": "ASDCM"+window.sessionStorage.token
//         //   }
//       };

//         $.ajax(settings).done(function (response) {
//             //LIST OPTION
//             $('#upt_ctr_gpatransfer').append($('<option>', { 
//                 value: "",
//                 text : "Choose Credit Hour" 
//             }));
//             $.each(response.data, function (i, item) {
//                 $('#upt_ctr_gpatransfer').append($('<option>', { 
//                     value: item.decision_code,
//                     text : item.decision_name 
//                 }));
//             });
            
//         });
//     // END Dropdown GPA Transfer List
    
//     //Dropdown CGPA Transfer List
//     var settings = {
//         "url": host+"api_tetapan_picoms/public/decisionList",
//         "method": "GET",
//         "timeout": 0,
//         // "header":{
//         //     "Authentication": "ASDCM"+window.sessionStorage.token
//         //   }
//       };

//         $.ajax(settings).done(function (response) {
//             //LIST OPTION
//             $('#upt_ctr_cgpatransfer').append($('<option>', { 
//                 value: "",
//                 text : "Choose Credit Exemption/Credit Transfer Process Payment" 
//             }));
//             $.each(response.data, function (i, item) {
//                 $('#upt_ctr_cgpatransfer').append($('<option>', { 
//                     value: item.decision_code,
//                     text : item.decision_name 
//                 }));
//             });
            
//         });
//     // END Dropdown CGPA Transfer List
    
//     //Dropdown Gred List
//     var settings = {
//         "url": host+"api_tetapan_picoms/public/gradeList",
//         "method": "GET",
//         "timeout": 0,
//         // "header":{
//         //     "Authentication": "ASDCM"+window.sessionStorage.token
//         //   }
//       };

//         $.ajax(settings).done(function (response) {
//             //LIST OPTION
//             $('#upt_ctr_grade').append($('<option>', { 
//                 value: "",
//                 text : "Choose Grade" 
//             }));
//             $.each(response.data, function (i, item) {
//                 $('#upt_ctr_grade').append($('<option>', { 
//                     value: item.grade_name,
//                     text : item.grade_name 
//                 }));
//             });
            
//         });
//     // END Dropdown Gred List


//     var self = this;
//     self.ctr_code = ko.observable("").extend({
//         required: true,
//     });

//     self.ctr_cretransfer = ko.observable("").extend({
//         required: true
//     });

//     self.ctr_gpatransfer = ko.observable("").extend({
//         required: true
//     });

//     self.ctr_cgpatransfer = ko.observable("").extend({
//         required: true
//     });

//     self.ctr_min_percentage = ko.observable("").extend({
//         required: true
//     });

//     self.ctr_max_percentage = ko.observable("").extend({
//         required: true
//     });

//     self.ctr_grade = ko.observable("").extend({
//         required: true
//     });
//     self.updateProgram = function () {

//         var error = ko.validation.group(self);

//         if (error.length > 0) {
//             error.showAllMessages();
//             return;
//         }

//         var param = {
//             twmTitle: self.ctr_code(),
//             twmDescription: self.ctr_cretransfer(),
//             twmSdate: self.ctr_gpatransfer(),
//             twmEdate: self.ctr_cgpatransfer(),
//             twmYear: self.ctr_min_percentage(),
//             twmStatus: self.ctr_grade(),
//         }
//         console.log(param);

//         var form = new FormData();

//         form.append("ctr_code", self.ctr_code());
//         form.append("ctr_cretransfer", self.ctr_cretransfer());
//         form.append("ctr_gpatransfer", self.ctr_gpatransfer());
//         form.append("ctr_cgpatransfer", self.ctr_cgpatransfer());
//         form.append("ctr_min_percentage", self.ctr_min_percentage());
//         form.append("ctr_max_percentage", self.ctr_max_percentage());
//         form.append("ctr_grade", self.ctr_grade());

//         swal({
//             title: "Kemaskini Pemindahan Kredit",
//             text: "Anda Pasti Untuk Kemaskini?",
//             type: "question",
//             showCancelButton: true,
//             confirmButtonText: "Kemaskini",
//             closeOnConfirm: true,
//             allowOutsideClick: false,
//             html: false
//         }).then(function () {
//             var settings = {
//                 "url": host+"api_tetapan_picoms/public/updateCect",
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
// const submitCect = document.querySelector("#update-kredit");
// ko.applyBindings(new viewModel(), submitCect);

function loadData(indexs) {   

    let data = JSON.parse($("#dataList").val());
    $('#upt_code').val(data[indexs].id);
    $('#upt_ctr_code').val(data[indexs].ctr_code);
    $('#upt_ctr_cretransfer').val(data[indexs].ctr_cretransfer);
    $('#upt_ctr_gpatransfer').val(data[indexs].ctr_gpatransfer);
    $('#upt_ctr_cgpatransfer').val(data[indexs].ctr_cgpatransfer);
    $('#upt_ctr_min_percentage').val(data[indexs].ctr_min_percentage);
    $('#upt_ctr_max_percentage').val(data[indexs].ctr_max_percentage);
    $('#upt_ctr_grade').val(data[indexs].ctr_grade);

    $("#update-kredit").modal("show");
}


$("#upt_kredit").click(function () {
    
    let upt_code = $("#upt_code").val();
    let upt_ctr_code = $("#upt_ctr_code").val();
    let upt_ctr_cretransfer = $("#upt_ctr_cretransfer").val();
    let upt_ctr_gpatransfer = $("#upt_ctr_gpatransfer").val();
    let upt_ctr_cgpatransfer = $("#upt_ctr_cgpatransfer").val();
    let upt_ctr_min_percentage = $("#upt_ctr_min_percentage").val();
    let upt_ctr_max_percentage = $("#upt_ctr_max_percentage").val();
    let upt_ctr_grade = $("#upt_ctr_grade").val();
    let statusrekod = "EDT";

    var form = new FormData();
        form.append("id", upt_code);
        form.append("ctr_code", upt_ctr_code);
        form.append("ctr_cretransfer", upt_ctr_cretransfer);
        form.append("ctr_gpatransfer", upt_ctr_gpatransfer);
        form.append("ctr_cgpatransfer", upt_ctr_cgpatransfer);
        form.append("ctr_min_percentage", upt_ctr_min_percentage);
        form.append("ctr_max_percentage", upt_ctr_max_percentage);
        form.append("ctr_grade", upt_ctr_grade);
        form.append("recordstatus", statusrekod);

    swal({
            title: "Update Credit Exemption/Credit Transfer",
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
                "url": host+"api_tetapan_picoms/public/cectUpdate",
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
    let upt_code = id;

    var form = new FormData();
    form.append("recordstatus", statusrekod);
    form.append("id", upt_code);
    form.append("recordstatus", 'DEL');
    

    swal({
            title: "Remove Credit Exemption/Credit Transfer",
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
                "url": host+"api_tetapan_picoms/public/cectDelete",
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

// var yearViewModel = function () {
//     var self = this;
//     self.dateChanged = function (sdate) {
//         self.sini = ko.computed(function () {
//             return new Date().getFullYear(sdate);
//         });
//     }
// }
// const yearView = document.querySelector("#twm_sdate");
// ko.applyBindings(new yearViewModel(), yearView);