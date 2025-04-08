var viewTblPolicy = function () {
    var settings = {
        "url": host+"api_polisi/public/tblPolicy",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        // console.log(response);

        $.each(response.data, function (i, field) {
            $('#tpl_id').val(field.tpl_id);
            $('#tarikhBukaJadWaktu').val(field.tpl_date_start);
            $('#tarikhTutupJadWaktu').val(field.tpl_date_end);
        });
    });
};
const divTblPolicy = document.querySelector("#divTblPolicy");
ko.applyBindings(viewTblPolicy, divTblPolicy);


// update exam policy
$("#btn_upt_tbl_policy").click(function () {
    let tpl_id = $('#tpl_id').val();
    let tpl_date_start = $("#tarikhBukaJadWaktu").val();
    let tpl_date_end = $("#tarikhTutupJadWaktu").val();
    let statusrekod = "EDT";
    // alert(jenisPeperiksaan);

    var form = new FormData();
    form.append('tpl_id', tpl_id);
    form.append("tpl_date_start", tpl_date_start);
    form.append("tpl_date_end", tpl_date_end);
    form.append("recordstatus", statusrekod);

    swal({
        title: "Update Timetable Policy",
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
            "url": host+"api_polisi/public/tblPolicyUpdate",
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