var viewAcaClassPolicy = function () {
    var settings = {
        "url": host+"api_polisi/public/acaClassPolicy",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        // console.log(response);

        $.each(response.data, function (i, field) {
            $('#acaClass_id').val(field.acaClass_id);
            $('#bilPljrMax').val(field.total_student);
        });
    });
};
const divPolicy = document.querySelector("#divPolicy");
ko.applyBindings(viewAcaClassPolicy, divPolicy);


// update exam policy
$("#btn_upt_policy").click(function () {
    let acaClass_id = $('#acaClass_id').val();
    let total_student = $("#bilPljrMax").val();
    let statusrekod = "EDT";
    // alert(jenisPeperiksaan);

    var form = new FormData();
    form.append('acaClass_id', acaClass_id);
    form.append("total_student", total_student);
    form.append("recordstatus", statusrekod);

    swal({
        title: "Update Academic Class Policy",
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
            "url": host+"api_polisi/public/acaClassPolicyUpdate",
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