$(function () {
    $.ajaxSetup({
        cache: false,
    });

    let clg_id = window.sessionStorage.idPage;
    var admin = window.sessionStorage.usrCatEadmin;
    let id = window.sessionStorage.usrId;

    // $("#loading_modal").modal("show");

    let obj = new get(host + "api_hr_emp/public/users/show/" + id, 'picoms ' + window.sessionStorage.token).execute();

    $.fn.select2.defaults.set("theme", "bootstrap");

    $('.slct2').select2({
        width: null,
        containerCssClass: ':all:'
    });


});

var confirmed = false;

$("#reset_btn").click(function () {
    $("#status_form").html("Mode Create Form");
    $("#status_form").prop("class", "green-200 p-l");
    $("#std_eduLevel").val("").trigger("change");
});


function checkSize() {
    var fileUpload = document.getElementById("sti_image");
    if (typeof fileUpload.files != "undefined") {
        var size = parseFloat(fileUpload.files[0].size / 1024).toFixed(2);
        // alert(size);
        if (size > 20000) {
            $("#checkSize").html(
                "Profile image size must be <strong>smaller than 1000KB</strong>."
            );
            $("#checkSize").prop("class", "text-danger");

            fileUpload.value = "";
            return;
        } else {
            $("#checkSize").html("");
            $("#checkSize").prop("class", "");
        }
    } else {
        alert("This browser does not support HTML5.");
    }
}

function modalNew() {
    $("#new_reg").modal("show");
    // $("#topModalNew").modal("show");
    // $('#tab1').addClass('active');
    // $('#link_tab1').addClass('active');
}




function remove_pdf(param1, param2) {
    swal({
        title: "Remove " + param1,
        text: "Are You Sure?",
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        confirmButtonColor: "#2196f3",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false,
    }).then(function () {
        $("#" + param2 + "_del_btn").addClass("hidden");
        $("#" + param2).removeClass("hidden");

        if (param1 != "Profile Picture") {
            $("#" + param2 + "_download").addClass("hidden");
        } else {
            $("#upt_sti_image_img").addClass("hidden");
            $("#nopic").removeClass("hidden");
        }
    });
}

function del(pgm_id) {
    var form = new FormData();
    let token = window.sessionStorage.token;

    form.append("std_studentid", pgm_id);
    form.append("recordstatus", "DEL");

    swal({
        title: "Remove Student",
        text: "Are You Sure?",
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Remove",
        confirmButtonColor: "#ef193c",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false,
    }).then(function () {
        var settings = {
            url: host + "api_pengurusan_pelajar/public/studentInfoDelete",
            method: "POST",
            timeout: 0,
            headers: {
                Authorization: "PICOMS " + token,
            },
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            data: form,
        };

        $.ajax(settings).done(function (response) {
            // console.log(response)
            result = JSON.parse(response);
            if (response.success == false) {
                swal(result.message, result.data, "error");
                return;
            }

            // swal(result.message, result.data, "success");

            // sessionStorage.token = result.token;
            window.location.replace("adminPage.html");
        });
    });
}
