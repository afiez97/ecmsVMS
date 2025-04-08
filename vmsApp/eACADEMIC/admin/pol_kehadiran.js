$(function(){
    $.ajaxSetup ({
        cache: false
    });
    $.fn.select2.defaults.set( "theme", "bootstrap" );

    grpUser(function(){
        $('#multi-append').html('');
        $.each(obj_grpUser.data, function (i, item){
            $('#multi-append').append($('<option value="'+item.user_des+'">'+item.user_des+'</option>'));
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:'
        });
    });

    // show policy attendance
    showPolAtt(function(){
        $.each(obj_showPolAtt.data, function (i, item){
            if(item.apl_attendance_mode == 'M'){
                $('.hide-manual').addClass('hidden');
            }
            else{ $('.hide-manual').removeClass('hidden'); }

            $("input[name=apl_attendance_mode][value=" + item.apl_attendance_mode + "]").prop('checked', true);
            if( item.apl_warning_status == 'Yes' ){ $("#apl_warning_status").prop('checked', true); }
            else{ $("#apl_warning_status").prop('checked', false); }
            
            $('#apl_earlyin_dur').val(item.apl_earlyin_dur);
            $('#apl_earlyout_dur').val(item.apl_earlyout_dur);
            $('#apl_latein_dur').val(item.apl_latein_dur);
            $('#apl_lateout_dur').val(item.apl_lateout_dur);
            $('#apl_refresh_interval').val(item.apl_refresh_interval);
            $('#apl_warning_letter_param').val(item.apl_warning_letter_param);

            let noti = item.apl_notification;
            let newString = noti.replace('[', "").replace(']', "").split(',');

            let o1 = newString[0].substring(3,newString[0].length);
            let o2 = newString[1].substring(3,newString[1].length);
            let o3 = newString[2].substring(3,newString[2].length);

            $("input[name=o1][value=" + o1 + "]").prop('checked', true);
            $("input[name=o2][value=" + o2 + "]").prop('checked', true);

            let newO3 = o3.split(';');
            let getNewO3 = [];
            $.each(newO3, function (k, itemList){
                getNewO3.push(itemList);
            });
            // console.log(getNewO3);
            // $('select').val(['Dekan','Admin Pascasiswazah']).trigger('change');
            $('select').val(getNewO3).trigger('change');
        });
    });
});
var confirmed = false;


$('input[type="radio"]').click(function() {
    var inputValue = $(this).attr("value");

    if(inputValue == 'M'){
        $('.hide-manual').addClass('hidden');
    }
    else{ $('.hide-manual').removeClass('hidden'); }
});


//-------------------------------------------------- SUBMIT FORM SETTING --------------------------------------------------//
$("#form-uptPolicyAtd").on('submit',function(e){
    if (!confirmed){
        e.preventDefault();
        swal({
            title: "Attendance Policy Setting Update",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function(){
            let page = $('#page1').val();
            let apl_attendance_mode = $('input[name="apl_attendance_mode"]:checked').val();
            let apl_earlyin_dur = $('#apl_earlyin_dur').val();
            let apl_earlyout_dur = $('#apl_earlyout_dur').val();
            let apl_latein_dur = $('#apl_latein_dur').val();
            let apl_lateout_dur = $('#apl_lateout_dur').val();
            let apl_refresh_interval = $('#apl_refresh_interval').val();
            let apl_warning_status = '';
            if($('#apl_warning_status').prop('checked') == true){ apl_warning_status = 'Yes'; }
            else{ apl_warning_status = 'No' }
            let apl_warning_letter_param = $('#apl_warning_letter_param').val();

            var formData = new FormData();
            formData.append("page",page);
            formData.append("apl_attendance_mode",apl_attendance_mode);
            formData.append("apl_earlyin_dur",apl_earlyin_dur);
            formData.append("apl_earlyout_dur",apl_earlyout_dur);
            formData.append("apl_latein_dur",apl_latein_dur);
            formData.append("apl_lateout_dur",apl_lateout_dur);
            formData.append("apl_refresh_interval",apl_refresh_interval);
            formData.append("apl_warning_status",apl_warning_status);
            formData.append("apl_warning_letter_param",apl_warning_letter_param);
            $("#loading_modal").modal("show");

            $.ajax({
                url : host+"api_polisi/public/policyAtdUpdate",
                type: 'post',
                headers: {
                    "Authorization": "picoms " + window.sessionStorage.token
                },
                data: formData,
                contentType: false,
                processData: false,
                success: function(response){
                    if(response != null){
                        if(response.success == "true"){
                            $("#loading_modal").modal("hide");
                            swal("Saved!", "Information has been successfully updated.", "success",{
                                button: "OK!",
                            }).then(function() {
                                window.location.reload();
                            });
                        }
                        else{
                            $("#loading_modal").modal("hide");
                            swal("Fail Save",response.message,"error");
                        }
                    }
                    else{
                        $("#loading_modal").modal("hide");
                        swal("Fail Save",response.message,"error");
                    }
                }
            });
        });
    }
});
//-------------------------------------------------- end SUBMIT FORM SETTING --------------------------------------------------//


// SUBMIT FORM NOTIFICATION
$("#form-uptPolicyAtd-noti").on('submit',function(e){
    if (!confirmed){
        e.preventDefault();
        swal({
            title: "Attendance Policy Warning Notification Update",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function(){
            var o3 = '';
            var selected = $('#multi-append').select2("data");

            for (var i = 0; i <= selected.length-1; i++){
                if(o3 == ''){
                    o3 = selected[i].text;
                }
                else{ o3 = o3+';'+selected[i].text; }
            }
            
            let o1 = $('input[name="o1"]:checked').val();
            let o2 = $('input[name="o2"]:checked').val();
            let apl_notification = '[o1:'+o1+',o2:'+o2+',o3:'+o3+']';
            let page = $('#page2').val();

            var formData = new FormData();
            formData.append("apl_notification",apl_notification);
            formData.append("page",page);
            $("#loading_modal").modal("show");

            $.ajax({
                url : host+"api_polisi/public/policyAtdUpdate",
                type: 'post',
                headers: {
                    "Authorization": "picoms " + window.sessionStorage.token
                },
                data: formData,
                contentType: false,
                processData: false,
                success: function(response){
                    if(response != null){
                        if(response.success == "true"){
                            $("#loading_modal").modal("hide");
                            swal("Saved!", "Information has been successfully updated.", "success",{
                                button: "OK!",
                            }).then(function() {
                                window.location.reload();
                            });
                        }
                        else{
                            $("#loading_modal").modal("hide");
                            swal("Fail Save",response.message,"error");
                        }
                    }
                    else{
                        $("#loading_modal").modal("hide");
                        swal("Fail Save",response.message,"error");
                    }
                }
            });
        });
    }
});


function showPolAtt(returnValue){
    var settings = {
        "url": host+"api_polisi/public/policyAtdShow",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_showPolAtt = response;
        returnValue();
    });
}