var viewAcaClassPolicy = function () {
    //Dropdown Program List
    var settings = {
        "url": host+"api_tetapan_picoms/public/programmeList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };

        $.ajax(settings).done(function (response) {
            //LIST OPTION EDIT
            $('#upt_pgm_id').append($('<option>', { 
                value: "",
                text : "Choose Programme" 
            }));
            $.each(response.data, function (i, item) {
                $('#upt_pgm_id').append($('<option>', { 
                    value: item.pgm_id,
                    text : item.pgm_name 
                }));
            });
            
        });
    // END Dropdown Program List

    //Dropdown Semester List
    var settings = {
        "url": host+"api_tetapan_picoms/public/cohortList",
        "method": "GET",
        "timeout": 0,
      };

        $.ajax(settings).done(function (response) {
            //LIST OPTION
            $('#uptSemList').append($('<option>', { 
                value: "",
                text : "Choose Semester" 
            }));
            $.each(response.data, function (i, item) {
                $('#uptSemList').append($('<option>', { 
                    value: item.cohort_name,
                    text : item.cohort_name 
                }));
            });
            
        });
    // END Dropdown Semester List
    
    var settings = {
        "url": host+"api_polisi/public/addDropPolicy",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        // console.log(response);

        $.each(response.data, function (i, field) {
            $('#addDrop_id').val(field.addDrop_id);
            $('#currYear').val(field.cur_year);
            $('#upt_pgm_id').val(field.pgm_id);
            $('#uptSemList').val(field.semester);
            $('#tarikhMula').val(field.start_date);
            $('#tarikhAkhir').val(field.end_date);
        });
    });
};
const divPolicy = document.querySelector("#divPolicy");
ko.applyBindings(viewAcaClassPolicy, divPolicy);


// update exam policy
$("#btn_upt_policy").click(function(){
    let addDrop_id = $('#addDrop_id').val();
    let cur_year = $("#currYear").val();
    let pgm_id = $('#upt_pgm_id').val();
    let semester = $("#uptSemList").val();
    let start_date = $('#tarikhMula').val();
    let end_date = $("#tarikhAkhir").val();
    let statusrekod = "EDT";
    // alert(jenisPeperiksaan);

    var form = new FormData();
    form.append('addDrop_id', addDrop_id);
    form.append("cur_year", cur_year);
    form.append('pgm_id', pgm_id);
    form.append("semester", semester);
    form.append('start_date', start_date);
    form.append("end_date", end_date);
    form.append("recordstatus", statusrekod);

    swal({
        title: "Update Add Drop Course Policy",
        text: "Are You Sure?",
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Update",
        confirmButtonColor: "#22b66e",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false
    }).then(function(){

        var settings = {
            "url": host+"api_polisi/public/addDropPolicyUpdate",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
            };

        $.ajax(settings).done(function (response) {
            // console.log(response)
            result = JSON.parse(response);
            if (!result.success) {
                Swal(result.message, result.data, "error");
                return;
            }
            window.location.replace("adminPage.html");
        });
    });
});