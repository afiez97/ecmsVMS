$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let studentId = window.sessionStorage.std_studentid;

    $.fn.select2.defaults.set( "theme", "bootstrap" );    

    checkSessionPage()
  // Add change event listener to remove tooltips on input change
  $("#newPasswordAgain, #newPassword").on('input', function () {
    $(this).tooltip('dispose');
  });
 
    student_info(studentId, function(){
        let dataStd = obj_stdInfo.data;


        
// Check if the sti_image is a base64 string or a URL
if (dataStd.sti_image == undefined) {

    menOrGirl = dataStd.sti_gender_name === 'Female' ? 'api_pengurusan_pelajar/public/student_girl_avatar.png' : 'api_pengurusan_pelajar/public/student_boy_avatar.png';


    avatarOr = host + menOrGirl;
    
}else {

    avatarOr = dataStd.sti_image;

}

$("#sti_image").prop('src',avatarOr);


        $("#student_id").html(studentId);
        $("#student_name").html(dataStd.sti_name);
        $("#programs").html(dataStd.pgm_name);
        $("#national").html(dataStd.sti_nationality_name);
        $("#local").html(dataStd.sti_native_name);
        $("#emails").html(dataStd.sti_email);
        $("#bank").html(dataStd.sti_bank_id);
        $("#acc_no").html(dataStd.sti_bank_accountno);
        $("#sti_sponsorship").html(dataStd.sti_sponsorship);
        $("#session").html(dataStd.sti_session_id);
        $("#cur_intake").html(dataStd.cur_intake);
        $("#race").html(dataStd.sti_race_name);
        $("#gender").html(dataStd.sti_gender_name);
        $("#religion").html(dataStd.sti_religion_name);
        $("#handicap").html(dataStd.sti_status_oku_name);
        $("#blood").html(dataStd.sti_blood_type_name);

        //edit_form
        $("#matric_no").val(studentId);
        $("#sti_name_upt").html(dataStd.sti_name);
        $("#sti_icno_upt").html(dataStd.sti_icno);
        $("#pgm_fk").val(dataStd.pgm_fk);
        $("#pgm_id").val(dataStd.pgm_id);
        $("#sti_nationality_upt").val(dataStd.sti_nationality);

        let token = window.sessionStorage.token;

        std_academic(studentId,token,function(){
            if(obj_academic.success){
                let data = obj_academic.data;

                $("#sta_bm_spm_dis").html(data.sta_bm_spm);
                $("#sta_bi_spm_dis").html(data.sta_bi_spm);
                $("#sta_math_spm_dis").html(data.sta_math_spm);
                $("#sta_his_spm_dis").html(data.sta_his_spm);
                $("#sta_islam_spm_dis").html(data.sta_islam_spm);

                // gradeView(data.sta_bm_spm,token,function(){
                //     if(obj_grade.success){
                //         $("#sta_bm_spm_dis").html(obj_grade.data.grade_name);
                //     }
                // });

                // gradeView(data.sta_bi_spm,token,function(){
                //     if(obj_grade.success){
                //         $("#sta_bi_spm_dis").html(obj_grade.data.grade_name);
                //     }
                // });

                // gradeView(data.sta_math_spm,token,function(){
                //     if(obj_grade.success){
                //         $("#sta_math_spm_dis").html(obj_grade.data.grade_name);
                //     }
                // });

                // gradeView(data.sta_his_spm,token,function(){
                //     if(obj_grade.success){
                //         $("#sta_his_spm_dis").html(obj_grade.data.grade_name);
                //     }
                // });

                // gradeView(data.sta_islam_spm,token,function(){
                //     if(obj_grade.success){
                //         $("#sta_islam_spm_dis").html(obj_grade.data.grade_name);
                //     }
                // });

                // gradeView(data.sta_other1_spm,token,function(){
                //     if(obj_grade.success){
                //         $("#sta_other_1").html(obj_grade.data.grade_name);
                //     }
                // });

                // gradeView(data.sta_other2_spm,token,function(){
                //     if(obj_grade.success){
                //         $("#sta_other_2").html(obj_grade.data.grade_name);
                //     }
                // });

                // gradeView(data.sta_other3_spm,token,function(){
                //     if(obj_grade.success){
                //         $("#sta_other_3").html(obj_grade.data.grade_name);
                //     }
                // });

                // gradeView(data.sta_other4_spm,token,function(){
                //     if(obj_grade.success){
                //         $("#sta_other_4").html(obj_grade.data.grade_name);
                //     }
                // });

                $("#sta_other_1").html(data.sta_other1_spm);
                $("#sta_other_2").html(data.sta_other2_spm);
                $("#sta_other_3").html(data.sta_other3_spm);
                $("#sta_other_4").html(data.sta_other4_spm);
                $("#sta_other_5").html(data.sta_other5_spm);

                // gradeView(data.sta_other5_spm,token,function(){
                //     if(obj_grade.success){
                //         $("#sta_other_5").html(obj_grade.data.grade_name);
                //     }
                // });

                prm_subject(data.sta_sub1_spm,token,function(){
                    if(obj_subject.success){
                        $("#sta_sub_1").html(obj_subject.data.subject);
                    }
                });

                prm_subject(data.sta_sub2_spm,token,function(){
                    if(obj_subject.success){
                        $("#sta_sub_2").html(obj_subject.data.subject);
                    }
                });

                prm_subject(data.sta_sub3_spm,token,function(){
                    if(obj_subject.success){
                        $("#sta_sub_3").html(obj_subject.data.subject);
                    }
                });

                prm_subject(data.sta_sub4_spm,token,function(){
                    if(obj_subject.success){
                        $("#sta_sub_4").html(obj_subject.data.subject);
                    }
                });

                prm_subject(data.sta_sub5_spm,token,function(){
                    if(obj_subject.success){
                        $("#sta_sub_5").html(obj_subject.data.subject);
                    }
                });
            }
        });

        std_parent(studentId,dataStd.pgm_fk,token,function(){
            if(obj_parent.success){
                let obj = obj_parent.data;
                
                $("#dis_father_icno").html(obj.par_father_icno);
                $("#dis_father_name").html(obj.par_father_name);
                $("#dis_father_contactno").html(obj.par_father_contactno);
                $("#dis_father_relationship").html(obj.father_relationship);
                $("#dis_father_nationality").html('CITIZEN');
                if(obj.par_father_nationality != "2"){
                    $("#dis_father_nationality").html('NON CITIZEN');                    
                }
                $("#dis_father_address").html(obj.par_father_address);
                
                $("#dis_mother_icno").html(obj.par_mother_icno);
                $("#dis_mother_name").html(obj.par_mother_name);
                $("#dis_mother_contactno").html(obj.par_mother_contactno);
                $("#dis_mother_relationship").html(obj.mother_relationship);
                $("#dis_mother_nationality").html('CITIZEN');
                if(obj.par_mother_nationality != "2"){
                    $("#dis_mother_relationship").html('NON CITIZEN');                    
                }
                $("#dis_mother_address").html(obj.par_mother_address);                    
                
            }
            else{
                $("#form_std_parent")[0].reset();
            }
        });

        std_acaHistory(studentId,token,function(){
            if(obj_acaHistory.success){
                let data = obj_acaHistory.data;
                var columns = [
                    { "name": "std_alumni", "title": "Alumi/Staff", "breakpoints": "sm xs" },
                    { "name": "std_muet", "title": "Muet.", "breakpoints": "sm xs" },
                    { "name": "std_eduLevel", "title": "Level"  },
                    { "name": "std_preUniversity", "title": "University" },
                    { "name": "std_status", "title": "Status", "breakpoints": "sm xs" },
                    { "name": "std_year", "title": "Years", "breakpoints": "sm xs" },
                    { "name": "std_cgpa", "title": "CGPA", "breakpoints": "sm xs" },
                    { "name": "std_transcript", "title": "Transcript", "breakpoints": "sm xs" },
                ];
                let list = [];   
                $.each(data,function(i,field){
                    list.push({
                        "std_alumni":field.std_alumni,
                        "std_muet":field.std_muet,
                        "std_eduLevel":field.level,
                        "std_preUniversity":field.std_preUniversity,
                        "std_status":field.sts_status_name_en,
                        "std_year":field.std_year,
                        "std_cgpa":field.std_cgpa,
                        "std_transcript":'<a class="label success" href="'+host+'api_pengurusan_pelajar/public/academic_cur/'+field.std_transcript+'" m-b" target="_blank">Document</a>',
                    });
                });         
                $("#acaHistory").html('');
                $("#acaHistory").footable({
                    "columns": columns,
                    "rows": list,
                    "paging": {
                        "enabled": false,
                        "size": 5
                    },
                    "filtering": {
                        "enabled": false,
                        "placeholder": "Search...",
                        "dropdownTitle": "Search for:"
                    }
                });                        
            }
        }); 

        showFaculty(dataStd.fac_id,token,function(){
            if(objFaculty.success){
                let objData = objFaculty.data;
                $("#fac_name").val(objData.fac_name);
            }
        });

        slctStudStatus(function(){
            $('#sts_status').append($('<option value="">- Choose -</option>'));
            $.each(obj_studStatus.data, function (i, item) {
                $('#sts_status').append($('<option value="'+item.sts_status_id+'">'+item.sts_status_name_en.toUpperCase()+'</option>'));
            });
        });

        misSubject(token,function(){
            // $('#sts_status').append($('<option value="">- Choose -</option>'));
            $.each(obj_subject.data, function (i, item) {
                $('#sta_sub1_spm').append($('<option value="'+item.kod_subject+'">'+item.subject.toUpperCase()+'</option>'));
                $('#sta_sub2_spm').append($('<option value="'+item.kod_subject+'">'+item.subject.toUpperCase()+'</option>'));
                $('#sta_sub3_spm').append($('<option value="'+item.kod_subject+'">'+item.subject.toUpperCase()+'</option>'));
                $('#sta_sub4_spm').append($('<option value="'+item.kod_subject+'">'+item.subject.toUpperCase()+'</option>'));
                $('#sta_sub5_spm').append($('<option value="'+item.kod_subject+'">'+item.subject.toUpperCase()+'</option>'));
            });

            $("#sta_sub1_spm").select2({
                width: null,
                containerCssClass: ':all:'
            });

            $("#sta_sub2_spm").select2({
                width: null,
                containerCssClass: ':all:'
            });

            $("#sta_sub3_spm").select2({
                width: null,
                containerCssClass: ':all:'
            });

            $("#sta_sub4_spm").select2({
                width: null,
                containerCssClass: ':all:'
            });

            $("#sta_sub5_spm").select2({
                width: null,
                containerCssClass: ':all:'
            });
        });

        slctGender(function(){
            $('#sti_gender').append($('<option value="">- Choose -</option>'));
            $.each(obj_gender.data, function (i, item) {
                $('#sti_gender').append($('<option value="'+item.sti_gender_id+'">'+item.sti_gender_name+'</option>'));
            });
        });

        // select blood type
        slctBlood(function(){
            $('#sti_blood_type').append($('<option value="">- Choose -</option>'));
            $.each(obj_bloodType.data, function (i, item) {
                $('#sti_blood_type').append($('<option value="'+item.sti_blood_type_id+'">'+item.sti_blood_type_name+'</option>'));
            });
        });

        // select parent status
        slctParentStatus(function(){
            $('#par_parent_relation').append($('<option value="">- Choose -</option>'));
            $('#upt_par_parent_relation').append($('<option value="">- Choose -</option>'));
            $.each(obj_parent.data, function (i, item){
                $('#par_parent_relation').append($('<option value="'+item.sts_par_relation_id+'">'+item.sts_par_relation_name_en+'</option>'));
                $('#upt_par_parent_relation').append($('<option value="'+item.sts_par_relation_id+'">'+item.sts_par_relation_name_en+'</option>'));
            });
        });

        // select stay with
        slctStayWith(function(){
            $('#par_living_with').append($('<option value="">- Choose -</option>'));
            $('#upt_par_living_with').append($('<option value="">- Choose -</option>'));
            $.each(obj_stayWith.data, function (i, item) {
                $('#par_living_with').append($('<option value="'+item.sts_living_with_id+'">'+item.sts_living_with_name_en+'</option>'));
                $('#upt_par_living_with').append($('<option value="'+item.sts_living_with_id+'">'+item.sts_living_with_name_en+'</option>'));
            });
        });

        // select Native Status
        slctNative(function(){
            $('#sti_status_bumiputra').append($('<option value="">- Choose -</option>'));
            $('#upt_sti_status_bumiputra').append($('<option value="">- Choose -</option>'));
            $.each(obj_native.data, function (i, item) {
                $('#sti_status_bumiputra').append($('<option value="'+item.pk_id+'">'+item.sti_native_name+'</option>'));
                $('#upt_sti_status_bumiputra').append($('<option value="'+item.pk_id+'">'+item.sti_native_name+'</option>'));
            });
        });

        // select Race
        // slctRace(function(){
        //     $('#upt_sti_race').append($('<option value="">- Choose -</option>'));
        //     $.each(obj_race.data, function (i, item) {
        //         $('#upt_sti_race').append($('<option value="'+item.sti_race_id+'">'+item.sti_race_name+'</option>'));
        //     });
        // });

        slctRace(function () {
            $("#upt_sti_race").append($('<option value="">- Choose -</option>'));
            $.each(obj_race.data, function (i, item) {
                
              $("#upt_sti_race").append(
                $(
                  '<option value="' +
                    item.sti_race_id +
                    '">' +
                    item.sti_race_name +
                    "</option>"
                )
              );
            });
          });

        // select student status
        slctStudStatus(function(){
            $('#sts_status').append($('<option value="">- Choose -</option>'));
            $('#upt_sts_status').append($('<option value="">- Choose -</option>'));
            $('#std_status').append($('<option value="">- Choose -</option>'));
            $('#ah_studStts2').append($('<option value="">- Choose -</option>'));
            $('#ah_studStts3').append($('<option value="">- Choose -</option>'));
            $('#ah_studStts4').append($('<option value="">- Choose -</option>'));
            $.each(obj_studStatus.data, function (i, item) {
                $('#sts_status').append($('<option value="'+item.sts_status_id+'">'+item.sts_status_name_en.toUpperCase()+'</option>'));
                $('#upt_sts_status').append($('<option value="'+item.sts_status_id+'">'+item.sts_status_name_en.toUpperCase()+'</option>'));
                $('#std_status').append($('<option value="'+item.sts_status_id+'">'+item.sts_status_name_en.toUpperCase()+'</option>'));
                $('#ah_studStts2').append($('<option value="'+item.sts_status_id+'">'+item.sts_status_name_en.toUpperCase()+'</option>'));
                $('#ah_studStts3').append($('<option value="'+item.sts_status_id+'">'+item.sts_status_name_en.toUpperCase()+'</option>'));
                $('#ah_studStts4').append($('<option value="'+item.sts_status_id+'">'+item.sts_status_name_en.toUpperCase()+'</option>'));
            });
        });

        // select Religion
        slctReligion(function(){
            $('#sti_religion_upt').append($('<option value="">- Choose -</option>'));
            $.each(obj_religion.data, function (i, item) {
                $('#sti_religion_upt').append($('<option value="'+item.sti_religion_id+'">'+item.sti_religion_name+'</option>'));
            });
        });

        // select OKU status
        slctOKU(function(){
            $('#sti_status_oku').append($('<option value="">- Choose -</option>'));
            $('#sti_status_oku_upt').append($('<option value="">- Choose -</option>'));
            $.each(obj_oku.data, function (i, item){
                $('#sti_status_oku').append($('<option value="'+item.sti_status_oku_name+'">'+item.sti_status_oku_name+'</option>'));
                $('#sti_status_oku_upt').append($('<option value="'+item.sti_status_oku_name+'">'+item.sti_status_oku_name+'</option>'));
            });
        });

        // select State
        slctState(function(){
            $('#sti_state').append($('<option value="">- Choose -</option>'));
            $('#upt_sti_state').append($('<option value="">- Choose -</option>'));
            $.each(obj_state.data, function (i, item) {
                $('#sti_state').append($('<option value="'+item.kod+'">'+item.ringkasan.toUpperCase()+'</option>'));
                $('#upt_sti_state').append($('<option value="'+item.kod+'">'+item.ringkasan.toUpperCase()+'</option>'));
            });
        });

        // select Nationality
        slctNationality(function(){
            $('#sti_nationality').append($('<option value="">- Choose -</option>'));
            $('#sti_nationality_upt').append($('<option value="">- Choose -</option>'));
            $('#upt_sti_nationality').append($('<option value="">- Choose -</option>'));
            $('#par_father_nationality').append($('<option value="">- Choose -</option>'));
            $('#par_mother_nationality').append($('<option value="">- Choose -</option>'));
            $.each(obj_nationality.data, function (i, item) {
                $('#sti_nationality_upt').append($('<option value="'+item.pk_id+'">'+item.sti_nationality_name+'</option>'));
                $('#sti_nationality').append($('<option value="'+item.pk_id+'">'+item.sti_nationality_name+'</option>'));
                $('#upt_sti_nationality').append($('<option value="'+item.pk_id+'">'+item.sti_nationality_name+'</option>'));
                $('#par_father_nationality').append($('<option value="'+item.pk_id+'">'+item.sti_nationality_name+'</option>'));
                $('#par_mother_nationality').append($('<option value="'+item.pk_id+'">'+item.sti_nationality_name+'</option>'));
            });
        });

        // select Title
        slctTitle(function(){
            $('#par_father_title').append('<option value="">- Choose -</option>');
            $('#par_mother_title').append('<option value="">- Choose -</option>');
            $.each(obj_title.data, function (i, item){
                $('#par_father_title').append('<option value="'+item.pk_id+'">'+item.title+'</option>');
                $('#par_mother_title').append('<option value="'+item.pk_id+'">'+item.title+'</option>');
            });
        });

        // select Relationship
        slctRelationship(function(){
            $('#par_father_relationship').append('<option value="">- Choose -</option>');
            $('#par_mother_relationship').append('<option value="">- Choose -</option>');
            $.each(obj_relationship.data, function (i, item){
                $('#par_father_relationship').append('<option value="'+item.pk_id+'">'+item.relationship+'</option>');
                $('#par_mother_relationship').append('<option value="'+item.pk_id+'">'+item.relationship+'</option>');
            });
        });

        // select Grade
        slctGrade(function(){
            $('#sta_bm_spm').append($('<option value="">- Choose -</option>'));
            $('#sta_bi_spm').append($('<option value="">- Choose -</option>'));
            $('#sta_math_spm').append($('<option value="">- Choose -</option>'));
            $('#sta_his_spm').append($('<option value="">- Choose -</option>'));
            $('#sta_islam_spm').append($('<option value="">- Choose -</option>'));

            $('#sta_other1_spm').append($('<option value="">- Choose -</option>'));
            $('#sta_other2_spm').append($('<option value="">- Choose -</option>'));
            $('#sta_other3_spm').append($('<option value="">- Choose -</option>'));
            $('#sta_other4_spm').append($('<option value="">- Choose -</option>'));
            $('#sta_other5_spm').append($('<option value="">- Choose -</option>'));

            $.each(obj_grade.data, function (i, item){
                $('#sta_bm_spm').append($('<option value="'+item.grade_name+'">'+item.grade_name+'</option>'));
                $('#sta_bi_spm').append($('<option value="'+item.grade_name+'">'+item.grade_name+'</option>'));
                $('#sta_math_spm').append($('<option value="'+item.grade_name+'">'+item.grade_name+'</option>'));
                $('#sta_his_spm').append($('<option value="'+item.grade_name+'">'+item.grade_name+'</option>'));
                $('#sta_islam_spm').append($('<option value="'+item.grade_name+'">'+item.grade_name+'</option>'));

                $('#sta_other1_spm').append($('<option value="'+item.grade_name+'">'+item.grade_name+'</option>'));
                $('#sta_other2_spm').append($('<option value="'+item.grade_name+'">'+item.grade_name+'</option>'));
                $('#sta_other3_spm').append($('<option value="'+item.grade_name+'">'+item.grade_name+'</option>'));
                $('#sta_other4_spm').append($('<option value="'+item.grade_name+'">'+item.grade_name+'</option>'));
                $('#sta_other5_spm').append($('<option value="'+item.grade_name+'">'+item.grade_name+'</option>'));

            });
        });

        slctEduLevel(function(){
            $('#std_eduLevel').append('<option value="">- Choose -</option>');
            $.each(obj_eduLevel.data, function (i, item){
                $('#std_eduLevel').append('<option value="'+item.pk_id+'">'+item.level+'</option>');
            });
    
            $("#std_eduLevel").select2({
                width: null,
                containerCssClass: ':all:'
            });
        });

        slctMuet(function(){
            $('#sta_muet').append($('<option value="">- Choose -</option>'));
            $('#upt_sta_muet').append($('<option value="">- Choose -</option>'));
            $.each(obj_muet.data, function (i, item){
                $('#sta_muet').append($('<option value="'+item.sta_muet_id+'">'+item.sta_muet_name+'</option>'));
                $('#upt_sta_muet').append($('<option value="'+item.sta_muet_id+'">'+item.sta_muet_name+'</option>'));
            });
        });

        $("#upt_btn").click(function(){

            student_show(studentId,function(){
                if(obj_stdInfo.success){
                    let data_std = obj_stdInfo.data;

        // $('#matric_no').val(dataStd.std_studentid);
                    // $('#sti_name_upt').val(dataStd.sti_name);
                    // $('#sti_icno_upt').val(dataStd.sti_icno);
                    // $('#pgm_id_upt').val(dataStd.pgm_fk+'-'+dataStd.pgm_id);
                    // $('#pgm_fk').val(dataStd.pgm_fk);
                    // $('#sti_session_upt').val(dataStd.sti_session_id);
                    // $('#sti_intake_upt').val(dataStd.cur_intake);
                    $('#sti_gender').val(data_std.sti_gender);
                    // $('#sti_nationality_upt').val(dataStd.sti_nationality);
                    $('#sti_race').val(data_std.sti_race);
                    $('#upt_sti_status_bumiputra').val(data_std.sti_status_bumiputra);
                    $('#sti_religion_upt').val(data_std.sti_religion);
                    $('#sti_status_oku_upt').val(data_std.sti_status_oku);
                    $('#sti_blood_type_upt').val(data_std.sti_blood_type);
                    $('#sti_blood_type').val(data_std.sti_blood_type);
                    $('#sti_email_upt').val(data_std.sti_email);
                    $('#sti_address').val(data_std.sti_address_1);
                    // $('#upt_sti_address_2').val(dataStd.sti_address_2);
                    // $('#upt_sti_address_3').val(dataStd.sti_address_3);
                    // upt_sti_race
                    $('#sti_postcode').val(data_std.sti_postcode);
                    $('#sti_state').val(data_std.sti_state);
                    $('#sti_contactno_home').val(data_std.sti_contactno_home);
                    $('#sti_contactno_mobile').val(data_std.sti_contactno_mobile);
                    $('#sti_bank_id').val(data_std.sti_bank_id);
                    $('#sti_bank_accountno').val(data_std.sti_bank_accountno);
                    $('#marital_status').val(data_std.marital_status);
                    $('#upt_sti_race').val(data_std.sti_race);
                    $('#duration_std').val(data_std.duration_std);
                    $('#sts_status').val(data_std.status_academic);
                    $('#remark').val(data_std.remark);
                    $('#staff_alumi').val(data_std.staff_alumi); 
                    $('#sti_sponsorship').val(data_std.sti_sponsorship); 
                }
                else{
                    window.location.reload();
                }
            });

                       

            std_parent(studentId,dataStd.pgm_fk,token,function(){
                if(obj_parent.success){
                    let obj = obj_parent.data;
                    $('#par_father_ic').val(obj.par_father_icno);          
                    $('#par_father_title').val(obj.par_father_title);          
                    $('#par_father_name').val(obj.par_father_name);          
                    $('#par_father_contactno').val(obj.par_father_contactno);          
                    $('#par_father_relationship').val(obj.par_father_relationship);          
                    $('#par_father_nationality').val(obj.par_father_nationality);          
                    $('#par_father_address').val(obj.par_father_address);  
        
                    $('#par_mother_ic').val(obj.par_mother_icno);          
                    $('#par_mother_title').val(obj.par_mother_title);          
                    $('#par_mother_contactno').val(obj.par_mother_contactno);          
                    $('#par_mother_relationship').val(obj.par_mother_relationship);          
                    $('#par_mother_nationality').val(obj.par_mother_nationality);          
                    $('#par_mother_address').val(obj.par_mother_address);          
                    $('#par_mother_name').val(obj.par_mother_name);  
                    
                    // $("#dis_father_icno").html(obj.par_father_icno);
                    // $("#dis_father_name").html(obj.par_father_name);
                    // $("#dis_father_contactno").html(obj.par_father_contactno);
                    // $("#dis_father_relationship").html(obj.par_father_relationship);
                    // $("#dis_father_nationality").html(obj.par_father_nationality);
                    // $("#dis_father_address").html(obj.par_father_address);
                    
                    // $("#dis_mother_icno").html(obj.par_mother_icno);
                    // $("#dis_mother_name").html(obj.par_mother_name);
                    // $("#dis_mother_contactno").html(obj.par_mother_contactno);
                    // $("#dis_mother_relationship").html(obj.par_mother_relationship);
                    // $("#dis_mother_nationality").html(obj.par_mother_nationality);
                    // $("#dis_mother_address").html(obj.par_mother_address);                    
                    
                }
                else{
                    $("#form_std_parent")[0].reset();
                }
            });

            std_academic(studentId,token,function(){
                if(obj_academic.success){
                    let data = obj_academic.data;
                    $("form#form_std_academic :input").each(function(){
                        names = $(this).attr('id');
                        values = data[names];
                        if(names != "sta_spm_doc"){
                            $('#'+names).val(values).trigger('change');
                        }
                    });

                    if(data.sta_spm_doc != ""){
                        $("#link_cert_doc").prop('href',host+'api_pengurusan_pelajar/public/academic/'+data.sta_spm_doc);
                        $("#link_cert_doc").prop('class','label success m-b');
                    }
                }
            });

            std_acaHistory(studentId,token,function(){
                if(obj_acaHistory.success){
                    let data = obj_acaHistory.data;
                    var columns = [
                        { "name": "std_alumni", "title": "Alumi/Staff", "breakpoints": "lg md sm xs" },
                        { "name": "std_muet", "title": "Muet.", "breakpoints": "lg md sm xs" },
                        { "name": "std_eduLevel", "title": "Level"  },
                        { "name": "std_preUniversity", "title": "University" },
                        { "name": "std_status", "title": "Status", "breakpoints": "md sm xs" },
                        { "name": "std_year", "title": "Years", "breakpoints": "lg md sm xs" },
                        { "name": "std_cgpa", "title": "CGPA", "breakpoints": "lg md sm xs" },
                        { "name": "std_transcript", "title": "Transcript", "breakpoints": "lg md sm xs" },
                        { "name": "upt_btn", "title": "Action"},
                    ];
                    let list = [];   
                    $.each(data,function(i,field){
                        list.push({
                            "std_alumni":field.std_alumni,
                            "std_muet":field.std_muet,
                            "std_eduLevel":field.level,
                            "std_preUniversity":field.std_preUniversity,
                            "std_status":field.sts_status_name_en,
                            "std_year":field.std_year,
                            "std_cgpa":field.std_cgpa,
                            "std_transcript":'<a class="label success" href="'+host+'api_pengurusan_pelajar/public/academic_cur/'+field.std_transcript+'" m-b" target="_blank">Document</a>',
                            "upt_btn":'<a onclick="load_acaHistory(\''+field.pk_id+'\')" class="btn btn-icon btn-info"><i class="fa fa-bars"></i></a>',
                        });
                    });         
                    $("#acaHistoryList").html('');
                    $("#acaHistoryList").footable({
                        "columns": columns,
                        "rows": list,
                        "paging": {
                            "enabled": true,
                            "size": 5
                        },
                        "filtering": {
                            "enabled": true,
                            "placeholder": "Search...",
                            "dropdownTitle": "Search for:"
                        }
                    });                        
                }
            });             

            $("#modal-update").modal('show');
        });        

        }); //student info
});

$("#btn_cancel_modal").click(function(){
    window.location.reload();
})

function std_parent(std_sudentid,pgm_id,token,returnValue){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/parent/show/"+std_sudentid+"/"+pgm_id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "PICOMS "+token
          },
    };

    $.ajax(settings).done(function (response){
        obj_parent = response;
        returnValue();
    });
}

function slctPymntType(returnValue){
    var settings = {
        "url": host+"api_public_access/public/paymentViaList",
        "method": "GET",
        "timeout": 0,
      };

    $.ajax(settings).done(function (response){
        obj_payment = response;
        returnValue();
    });
}

function slctGender(returnValue){
    var settings = {
        "url": host+"api_public_access/public/genderList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_gender = response;
        returnValue();
    });
}

function slctRace(returnValue){
    let token = window.sessionStorage.token;
    var settings = {
        "url": host+"api_public_access/public/raceList",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "PICOMS "+token
          },
    };

    $.ajax(settings).done(function (response){
        obj_race = response;
        returnValue();
    });
}

function slctMuet(returnValue){
    var settings = {
        "url": host+"api_public_access/public/muetList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_muet = response;
        returnValue();
    });
}

function slctGrade(returnValue){
    let token = window.sessionStorage.token;
    var settings = {
        "url": host+"api_public_access/public/gradeList",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "PICOMS "+token
          },
    };

    $.ajax(settings).done(function (response){
        obj_grade = response;
        returnValue();
    });
}

function gradeView(id,token,returnValue){
    var settings = {
        "url": host+"api_public_access/public/grade/view/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "PICOMS "+token
          },
    };

    $.ajax(settings).done(function (response){
        obj_grade = response;
        returnValue();
    });
}

function slctMuet(returnValue){
    var settings = {
        "url": host+"api_public_access/public/muetList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_muet = response;
        returnValue();
    });
}

function slctBlood(returnValue){
    var settings = {
        "url": host+"api_public_access/public/bloodTypeList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_bloodType = response;
        returnValue();
    });
}

function slctParentStatus(returnValue){
    var settings = {
        "url": host+"api_public_access/public/parentList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_parent = response;
        returnValue();
    });
}

function slctStayWith(returnValue){
    var settings = {
        "url": host+"api_public_access/public/livingList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_stayWith = response;
        returnValue();
    });
}

function slctState(returnValue){
    let token = window.sessionStorage.token;
    var settings = {
        "url": host+"api_public_access/public/negeriList",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "PICOMS "+token
          },
    };

    $.ajax(settings).done(function (response){
        obj_state = response;
        returnValue();
    });
}

function slctNative(returnValue){
    var settings = {
        "url": host+"api_public_access/public/nativeList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_native = response;
        returnValue();
    });
}



function slctStudStatus(returnValue){
    var settings = {
        "url": host+"api_public_access/public/statusList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_studStatus = response;
        returnValue();
    });
}

function slctNationality(returnValue){
    let token = window.sessionStorage.token;
    var settings = {
        "url": host+"api_public_access/public/nationalityList",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "PICOMS "+token
          },
    };

    $.ajax(settings).done(function (response){
        obj_nationality = response;
        returnValue();
    });
}

function slctReligion(returnValue){
    var settings = {
        "url": host+"api_public_access/public/religionList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_religion = response;
        returnValue();
    });
}

function slctOKU(returnValue){
    var settings = {
        "url": host+"api_public_access/public/okuList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_oku = response;
        returnValue();
    });
}

function slctIntake(returnValue){
    let token = window.sessionStorage.token;
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmCuryear/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "PICOMS "+token
          },
    };

    $.ajax(settings).done(function (response){
        obj_intake = response;
        returnValue();
    });
}

function slctEduLevel(returnValue){
    var settings = {
        "url": host + "api_pengurusan_pelajar/public/misEduLevel/list",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        obj_eduLevel = response;
        returnValue();
    });
}

function showFaculty(fac_id,token,returnValue){
    var form = new FormData();
    form.append('fac_id',fac_id);
    var settings = {
        "url": host + "api_tetapan_picoms/public/faculty/"+fac_id,
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": "PICOMS "+token
        },
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
    };

    $.ajax(settings).done(function (response) {
        objFaculty = JSON.parse(response);
        returnValue();
    });
}

function slctTitle(returnValue){
    var settings = {
        "url": host + "api_public_access/public/misTitle/list",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        obj_title = response;
        returnValue();
    });
}

function slctRelationship(returnValue){
    var settings = {
        "url": host + "api_public_access/public/misRelationship/list",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        obj_relationship = response;
        returnValue();
    });
}

function misSubject(token,returnValue){
    var settings = {
        "url": host + "api_public_access/public/misSubject/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "PICOMS "+token
          },
    };

    $.ajax(settings).done(function (response) {
        obj_subject = response;

        returnValue();
    });
}

function prm_subject(kod_subject,token,returnValue){
    var form = new FormData();
    form.append('kod_subject',kod_subject);
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/misSubject/show",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Authorization": "PICOMS "+token
        },
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
    };

    let request = $.ajax(settings);
    request.done(function (response) {
        obj_subject = JSON.parse(response);
        
        returnValue();
        
    });
    request.fail(function(){
        response = {"success":false,"message":"Student Academic Error","data":""};
        
        returnValue();
    }); 
}

var confirmed = false;

$("#form_std_info").on('submit',function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Student Info",
            text: "Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false  
        }).then(function(){
            
            var form = new FormData();
            $("form#form_std_info :input").each(function(){
                names = $(this).attr('name');
                values = $(this).val();
                form.append(names,values);
            });
            let sti_name = $("#sti_name_upt").html();
            let sti_icno = $("#sti_icno_upt").html();
            let pgm_id = $("#pgm_id").val();
            let sti_session = $("#session").html();
            let cur_intake = $("#cur_intake").html();
            let sti_nationality = $("#sti_nationality").val();
            let sti_sponsorship = $("#sti_sponsorship").val();

            form.append("sti_name",sti_name.toUpperCase());
            form.append("sti_icno",sti_icno);
            form.append("pgm_id",pgm_id);
            form.append("sti_session_id",sti_session);
            form.append("cur_intake",cur_intake);
            form.append("sti_nationality",sti_nationality);
            form.append("sti_sponsorship",sti_sponsorship);
            
            // console.log(form);
            let token = window.sessionStorage.token;

            var settings = {
                "url": host+"api_pengurusan_pelajar/public/pelajar/update",
                "method": "POST",
                "timeout": 0,
                "headers": {
                  "Authorization": "PICOMS "+token
                },
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form
            };

            let request = $.ajax(settings);
            request.done(function (response) {
                let obj = JSON.parse(response);
                if(obj.success){
                    swal("Updated Success","Student Info","success");
                }
                
            });
            request.fail(function(){
                response = {"success":false,"message":"Register Error","data":""};
                swal("Updated Fail","Student Info","error");
            });            
        });

    }
});

// create or update parent start

$("#form_std_parent").on('submit',function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Student Info",
            text: "Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false  
        }).then(function(){
            var form = new FormData();
            $("form#form_std_parent :input").each(function(){
                names = $(this).attr('name');
                values = $(this).val();
                form.append(names,values);
            });

            let token = window.sessionStorage.token;
            
            let std_studentid = $("#matric_no").val();
            form.append('std_studentid',std_studentid);
            
            let pgm_fk = $("#pgm_fk").val();
            form.append('pgm_id',pgm_fk);

            std_parent(std_studentid,pgm_fk,token,function(){
                if(obj_parent.success){
                    update_parent(form,token,function(){
                        if(obj_parent.success){
                            swal("Updated Success","Create Family Data","success");
                        }
                        else{
                            swal("Updated Fail","Create Family Data","error");
                        }
                    });
                    
                }
                else{
                    create_parent(form,token,function(){
                        if(obj_parent.success){
                            swal("Updated Success","Update Family Data","success");
                        }
                        else{
                            swal("Updated Fail","Update Family Data","error");
                        }
                    });
                }
            });
            
        });
    }
});

function update_parent(form,token,returnValue){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/parent/update",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Authorization": "PICOMS "+token
        },
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
    };

    let request = $.ajax(settings);
    request.done(function (response) {
        // let obj = JSON.parse(response);
        obj_parent = JSON.parse(response);

        returnValue();
        
    });
    request.error(function(){
        response = {"success":false,"message":"Register Error","data":""};
        obj_parent = response;

        returnValue();
    }); 
}

function create_parent(form,token,returnValue){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/parent/create",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Authorization": "PICOMS "+token
        },
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
    };

    let request = $.ajax(settings);
    request.done(function (response) {
        // let obj = JSON.parse(response);
        obj_parent = JSON.parse(response);

        returnValue();
        
    });
    request.error(function(){
        response = {"success":false,"message":"Register Error","data":""};
        obj_parent = response;

        returnValue();
    }); 
}

// create or update parent end


$("#form_std_academic").on('submit',function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update SPM & Muet Student Result",
            text: "Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false  
        }).then(function(){
            var form = new FormData();
            $("form#form_std_academic :input").each(function(){
                names = $(this).attr('name');
                values = $(this).val();
                if($(this).attr('type') == "file"){
                    let id_form = "#"+$(this).attr('id');
                    form.append(names,$(id_form)[0].files[0]);                    
                }
                else{
                    form.append(names,values);
                }
            });

            let token = window.sessionStorage.token;
            
            let std_studentid = $("#matric_no").val();
            form.append('std_studentid',std_studentid);
            
            let pgm_fk = $("#pgm_fk").val();
            form.append('pgm_id',pgm_fk);

            std_academic(std_studentid,token,function(){
                console.log(obj_parent.success);
                if(obj_academic.success){
                    update_academic(form,token,function(){
                        if(obj_academic.success){
                            swal("Updated Success","Create Registration Data","success");
                            $("#form_std_registration")[0].reset();

                            let data = obj_academic.data;
                            console.log(data);
                            // $("#sta_muet").val(data.sta_muet);
                            // $("#sta_bm_spm").val(data.sta_bm_spm);
                            // $("#sta_bm_stpm").val(data.sta_bm_stpm);
                            
                            if(data.sta_spm_doc != ""){
                                $("#link_cert_doc").prop('href',host+'api_pengurusan_pelajar/public/academic/'+data.sta_spm_doc);
                                $("#link_cert_doc").prop('class','label success m-b');
                            }
                            
                            // if(data.sta_diploma_doc != ""){
                            //     $("#link_diploma_doc").prop('href',host+'api_pengurusan_pelajar/public/academic/'+data.sta_diploma_doc);
                            //     $("#link_diploma_doc").prop('class','label success m-b');
                            // }
                                                    
                            // if(data.sta_degree_doc != ""){
                            //     $("#link_degree_doc").prop('href',host+'api_pengurusan_pelajar/public/academic/'+data.sta_degree_doc);
                            //     $("#link_degree_doc").prop('class','label success m-b');                                        
                            // }
                                                                                    
                        }
                        else{
                            swal("Updated Fail","Update Academic Data","error");
                        }
                    });
                    
                }
                else{
                    create_academic(form,token,function(){
                        if(obj_academic.success){
                            swal("Updated Success","Create Registration Data","success");
                            $("#form_std_registration")[0].reset();
                            
                            let data = obj_academic.data;
                            console.log(data);
                            // $("#sta_muet").val(data.sta_muet);
                            // $("#sta_bm_spm").val(data.sta_bm_spm);
                            // $("#sta_bm_stpm").val(data.sta_bm_stpm);
                            
                            // if(data.sta_cert_doc != ""){
                            //     $("#link_cert_doc").prop('href',host+'api_pengurusan_pelajar/public/academic/'+data.sta_cert_doc);
                            //     $("#link_cert_doc").prop('class','label success m-b');
                            // }
                            
                            // if(data.sta_diploma_doc != ""){
                            //     $("#link_diploma_doc").prop('href',host+'api_pengurusan_pelajar/public/academic/'+data.sta_diploma_doc);
                            //     $("#link_diploma_doc").prop('class','label success m-b');
                            // }
                                                    
                            // if(data.sta_degree_doc != ""){
                            //     $("#link_degree_doc").prop('href',host+'api_pengurusan_pelajar/public/academic/'+data.sta_degree_doc);
                            //     $("#link_degree_doc").prop('class','label success m-b');                                        
                            // }
                        }
                        else{
                            swal("Create Fail","Create Academic Data","error");
                        }
                    });
                }
            });
            
        });
    }
});

//mis_std_academic_function
function std_academic(std_sudentid,token,returnValue){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/academic/show/"+std_sudentid,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "PICOMS "+token
          },
    };

    $.ajax(settings).done(function (response){
        obj_academic = response;
        returnValue();
    });
}

function update_academic(form,token,returnValue){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/academic/update",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Authorization": "PICOMS "+token
        },
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
    };

    let request = $.ajax(settings);
    request.done(function (response) {
        // let obj = JSON.parse(response);
        obj_academic = JSON.parse(response);

        returnValue();
        
    });
    request.fail(function(){
        response = {"success":false,"message":"Academic Error","data":""};
        obj_academic = response;

        returnValue();
    }); 
}

function create_academic(form,token,returnValue){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/academic/create",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Authorization": "PICOMS "+token
        },
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
    };

    let request = $.ajax(settings);
    request.done(function (response) {
        // let obj = JSON.parse(response);
        obj_academic = JSON.parse(response);

        returnValue();
        
    });
    request.fail(function(){
        response = {"success":false,"message":"Academic Error","data":""};
        obj_academic = response;

        returnValue();
    }); 
}
//end mis_std_academic_function


//student education background

$("#form_std_acaHistory").on('submit',function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Student Academic History",
            text: "Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false  
        }).then(function(){
            var form = new FormData();
            $("form#form_std_acaHistory :input").each(function(){
                names = $(this).attr('name');
                values = $(this).val();
                if($(this).attr('type') == "file"){
                    let id_form = "#"+$(this).attr('id');
                    form.append(names,$(id_form)[0].files[0]);                    
                }
                else{
                    form.append(names,values);
                }
            });

            let token = window.sessionStorage.token;
            
            let std_studentid = $("#matric_no").val();
            form.append('std_studentid',std_studentid);
            
            let id_acaHistory = $("#id_acaHistory").val();
            if(id_acaHistory == ""){
                create_acaHistory(form,token,function(){
                    if(obj_acaHistory.success){
                        swal("Save Success","Create Academic History","success");
                        $("#std_eduLevel").select2("val", "");
                        $("#status_form").val('Mode Create Form');
                        $("#status_form").prop('class','green-200 p-l');                        
                        $("#form_std_acaHistory")[0].reset();
                        
                        std_acaHistory(std_studentid,token,function(){
                            if(obj_acaHistory.success){
                                let data = obj_acaHistory.data;
                                var columns = [
                                    { "name": "std_alumni", "title": "Alumi/Staff", "breakpoints": "lg md sm xs" },
                                    { "name": "std_muet", "title": "Muet.", "breakpoints": "lg md sm xs" },
                                    { "name": "std_eduLevel", "title": "Level"  },
                                    { "name": "std_preUniversity", "title": "University" },
                                    { "name": "std_status", "title": "Status", "breakpoints": "md sm xs" },
                                    { "name": "std_year", "title": "Years", "breakpoints": "lg md sm xs" },
                                    { "name": "std_cgpa", "title": "CGPA", "breakpoints": "lg md sm xs" },
                                    { "name": "std_transcript", "title": "Transcript", "breakpoints": "lg md sm xs" },
                                    { "name": "upt_btn", "title": "Action"},
                                ];
                                let list = [];   
                                $.each(data,function(i,field){
                                    list.push({
                                        "std_alumni":field.std_alumni,
                                        "std_muet":field.std_muet,
                                        "std_eduLevel":field.level,
                                        "std_preUniversity":field.std_preUniversity,
                                        "std_status":field.sts_status_name_en,
                                        "std_year":field.std_year,
                                        "std_cgpa":field.std_cgpa,
                                        "std_transcript":'<a class="label success" href="'+host+'api_pengurusan_pelajar/public/academic_cur/'+field.std_transcript+'" m-b" target="_blank">Document</a>',
                                        "upt_btn":'<a onclick="load_acaHistory(\''+field.pk_id+'\')" class="btn btn-icon btn-info"><i class="fa fa-bars"></i></a>',
                                    });
                                });         
                                $("#acaHistoryList").html('');
                                $("#acaHistoryList").footable({
                                    "columns": columns,
                                    "rows": list,
                                    "paging": {
                                        "enabled": true,
                                        "size": 5
                                    },
                                    "filtering": {
                                        "enabled": true,
                                        "placeholder": "Search...",
                                        "dropdownTitle": "Search for:"
                                    }
                                });                        
                            }
                        });                                                
                    }
                    else{
                        swal("Create Fail","Create Academic History","error");
                    }
                });
            }
            else{
                update_acaHistory(form,token,function(){
                    if(obj_acaHistory.success){
                        swal("Save Success","Update Academic History","success");
                        $("#std_eduLevel").select2("val", "");
                        $("#status_form").val('Mode Create Form');
                        $("#status_form").prop('class','green-200 p-l');                        
                        $("#form_std_acaHistory")[0].reset();

                        std_acaHistory(std_studentid,token,function(){
                            if(obj_acaHistory.success){
                                let data = obj_acaHistory.data;
                                var columns = [
                                    { "name": "std_alumni", "title": "Alumi/Staff", "breakpoints": "lg md sm xs" },
                                    { "name": "std_muet", "title": "Muet.", "breakpoints": "lg md sm xs" },
                                    { "name": "std_eduLevel", "title": "Level"  },
                                    { "name": "std_preUniversity", "title": "University" },
                                    { "name": "std_status", "title": "Status", "breakpoints": "md sm xs" },
                                    { "name": "std_year", "title": "Years", "breakpoints": "lg md sm xs" },
                                    { "name": "std_cgpa", "title": "CGPA", "breakpoints": "lg md sm xs" },
                                    { "name": "std_transcript", "title": "Transcript", "breakpoints": "lg md sm xs" },
                                    { "name": "upt_btn", "title": "Action"},
                                ];
                                let list = [];   
                                $.each(data,function(i,field){
                                    list.push({
                                        "std_alumni":field.std_alumni,
                                        "std_muet":field.std_muet,
                                        "std_eduLevel":field.level,
                                        "std_preUniversity":field.std_preUniversity,
                                        "std_status":field.sts_status_name_en,
                                        "std_year":field.std_year,
                                        "std_cgpa":field.std_cgpa,
                                        "std_transcript":'<a class="label success" href="'+host+'api_pengurusan_pelajar/public/academic_cur/'+field.std_transcript+'" m-b" target="_blank">Document</a>',
                                        "upt_btn":'<a onclick="load_acaHistory(\''+field.pk_id+'\')" class="btn btn-icon btn-info"><i class="fa fa-bars"></i></a>',
                                    });
                                });         
                                $("#acaHistoryList").html('');
                                $("#acaHistoryList").footable({
                                    "columns": columns,
                                    "rows": list,
                                    "paging": {
                                        "enabled": true,
                                        "size": 5
                                    },
                                    "filtering": {
                                        "enabled": true,
                                        "placeholder": "Search...",
                                        "dropdownTitle": "Search for:"
                                    }
                                });                        
                            }
                        });                         
                    }
                    else{
                        swal("Create Fail","Update Academic History","error");
                    }
                });
            }           
            
        });
    }
});

$("#reset_btn").click(function(){
    $("#status_form").html('Mode Create Form');
    $("#status_form").prop('class','green-200 p-l');
    $("#std_eduLevel").val("").trigger('change');
});

function load_acaHistory(id){
    let token = window.sessionStorage.token;
    show_acaHistory(id,token,function(){
        if(obj_acaHistory.success){
            $("#status_form").html('Mode Update Form');
            $("#status_form").prop('class','amber-200 p-l');
            
            let data = obj_acaHistory.data;
            $("form#form_std_acaHistory :input").each(function(){
                let id_form = "#"+$(this).attr('id');
                let name = $(this).attr('name');
                if(name == "std_eduLevel"){
                    $(id_form).val(data[name]).trigger('change');
                }
                else if(name == "std_transcript"){
                    //except
                }
                else{
                    $(id_form).val(data[name]);
                }
            });            
        }
    });
}

//mis_std_acaHistory_function
function std_acaHistory(std_sudentid,token,returnValue){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/academicHistory/list/"+std_sudentid,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "PICOMS "+token
          },
    };

    $.ajax(settings).done(function (response){
        obj_acaHistory = response;
 
       returnValue();
    });
}

function show_acaHistory(id,token,returnValue){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/academicHistory/show/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "PICOMS "+token
          },
    };

    $.ajax(settings).done(function (response){
        obj_acaHistory = response;
        returnValue();
    });
}

function update_acaHistory(form,token,returnValue){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/academicHistory/update",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Authorization": "PICOMS "+token
        },
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
    };

    let request = $.ajax(settings);
    request.done(function (response) {
        // let obj = JSON.parse(response);
        obj_acaHistory = JSON.parse(response);

        returnValue();
        
    });
    request.fail(function(){
        response = {"success":false,"message":"Academic History Error","data":""};
        obj_acaHistory = response;

        returnValue();
    }); 
}

function create_acaHistory(form,token,returnValue){
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/academicHistory/create",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Authorization": "PICOMS "+token
        },
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
    };

    let request = $.ajax(settings);
    request.done(function (response) {
        // let obj = JSON.parse(response);
        obj_acaHistory = JSON.parse(response);

        returnValue();
        
    });
    request.fail(function(){
        response = {"success":false,"message":"Academic History Error","data":""};
        obj_acaHistory = response;

        returnValue();
    }); 
}
//mis_std_acaHistory_end

//student education background end



function checkSessionPage(){

    let paramsTest = new URLSearchParams(window.location.search);
    showmodalUpd=  paramsTest.get('showmodalUpd');

    if(showmodalUpd == 5){

        $('#modal-update').modal('show');
        $("#btn_updSecurity").trigger("click");
      // Remove the showmodalUpd parameter from the URL
      paramsTest.delete('showmodalUpd');
      let newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + paramsTest.toString();
      window.history.pushState({ path: newUrl }, '', newUrl);
   }


}




function togglePasswordVisibility(inputId) {
    $passwordInput = $('#' + inputId);
    $eyeIcon = $('#eyeIcon_' + inputId);
    $button = $eyeIcon.closest('button'); // Assumes the icon is inside a button

    if ($passwordInput.attr('type') === 'password') {
      $passwordInput.attr('type', 'text');
      $eyeIcon.removeClass('fa-eye-slash').addClass('fa-eye');
      $button.removeClass('active');
      $button.blur(); //nie utk buang focus tu je annoying

    } else {
      $passwordInput.attr('type', 'password');
      $eyeIcon.removeClass('fa-eye').addClass('fa-eye-slash');
      $button.addClass('active');
    }
  }




  $('#myButton').click(function () {
    // newPasswordAgain newPassword oldPassword
    oldPassword = $("#oldPassword").val();
    newPassword = $("#newPassword").val();
    newPasswordAgain = $("#newPasswordAgain").val();

    if (newPassword === newPasswordAgain) {

      // $("#newPasswordAgain").val();


      let formCheckingOld = new FormData();
      formCheckingOld.append('usr_passwd', oldPassword);
      formCheckingOld.append('usr_id', window.sessionStorage.std_studentid);

      // usr_id
      // usr_passwd
      objCheckingPasswordOld = new post(host + 'api_auth/public/sadUsers/checKingPassword', formCheckingOld, 'picoms ' + window.sessionStorage.token).execute();

      if (objCheckingPasswordOld.success) {





        swal({
          title: "Update Password",
          text: "Are you sure?",
          type: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          closeOnConfirm: true,
          allowOutsideClick: false,
          html: false
        }).then(function () {



          let formUpdate = new FormData();

          formUpdate.append('usr_id', window.sessionStorage.std_studentid);
          formUpdate.append('new_usr_passwd', newPassword);
          objUpdate = new post(host + 'api_auth/public/sadUsers/updatePassword', formUpdate, 'picoms ' + window.sessionStorage.token).execute();
          if (objUpdate.success) {
            window.location.reload();
          } else {
            swal('Fail Update', objUpdate.messages, "error");
            return;
          }



        });



      } else {
        $("#oldPassword").attr("data-toggle", "tooltip").attr("title", "Ensure you enter the password correctly.").tooltip("show");

      }


    } else {

      $("#newPasswordAgain").attr("data-toggle", "tooltip").attr("title", "Password Not match.").tooltip("show");
      $("#newPassword").attr("data-toggle", "tooltip").attr("title", "Password Not match.").tooltip("show");



    }



  });