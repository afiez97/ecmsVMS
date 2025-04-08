$(function () {
    $.ajaxSetup({
        cache: false
    });
    setTimeout(() => {
        load_capaian();        
    }, Math.random()*100); 
});

// console.log('Ada capaian ni haa');
function load_capaian(){

    var userId = window.sessionStorage.usrId ;
    var obj = new get(host+`api_tetapan_picoms/public/admAccess/showUserAccess/`+ userId , 'picoms ' + window.sessionStorage.token).execute();

    if(obj.success){



        data = obj.data;
        var capaian_master = JSON.parse(data.access)[0]; 
        // console.log(capaian_master);

        // -------------------------------------------- start setting ----------------------------------------------------------- 
        if(!capaian_master.setting.read){
            $(".btn_read_setting").remove();
            // console.log('btn_read_setting');
        }

        if(window.sessionStorage.content == 'settings'){

            if(!capaian_master.setting.create){
                // console.log('create');
                $(".btn_create_setting").remove();
                setting_add = 0;
            }
            else{
                setting_add = 1;
            }
            if(!capaian_master.setting.update){
                // console.log('update');
                $(".btn_update_setting").remove();
                setting_upt = 0;
            }
            else{
                setting_upt = 1;
            }
            if(!capaian_master.setting.delete){
                $(".btn_delete_setting").remove();
                setting_del = 0;
            }
            else{
                setting_del = 1;
            }

            settingsData = [setting_add, setting_upt, setting_del];

            // return data;
            window.capaianData = settingsData; 

        }else{}

        // -------------------------------------------- end setting ----------------------------------------------------------- 

        // -------------------------------------------- start dashboard & announcement ----------------------------------------------------------- 
        if(!capaian_master.dashboard.read){
            $(".btn_read_dashboard").remove();
        }

        if(!capaian_master.announcement.read){
            $(".btn_read_announcement").remove();
        }

        if(window.sessionStorage.content == 'dashboard'){
            if(!capaian_master.dashboard.create){
                $(".btn_create_dashboard").remove();
            }
            if(!capaian_master.dashboard.update){
                $(".btn_update_dashboard").remove();
            }
            if(!capaian_master.dashboard.delete){
                $(".btn_delete_dashboard").remove();
            }

            //announcement

            if(!capaian_master.announcement.create){
                $(".btn_create_announcement").remove();
            }
            if(!capaian_master.announcement.update){
                $(".btn_update_announcement").remove();
            }
            if(!capaian_master.announcement.delete){
                $(".btn_delete_announcement").remove();
            }
        }

        // -------------------------------------------- end dashboard & announcement ----------------------------------------------------------- 

        if(!capaian_master.sc_faculty.read && !capaian_master.sc_programme.read && !capaian_master.sc_courseOffer.read && !capaian_master.sc_gradScheme.read &&  !capaian_master.sc_credit.read && !capaian_master.sc_classroom.read && !capaian_master.sc_cte.read ){
            
            $(".btn_read_sc_setting").remove();

        }

        // -------------------------------------------- start sc_faculty ----------------------------------------------------------- 
        if(!capaian_master.sc_faculty.read){
            $(".btn_read_sc_faculty").remove();
        }

        if(window.sessionStorage.content == 'fakulti'){
            if(!capaian_master.sc_faculty.create){
                $(".btn_create_sc_faculty").remove();
            }
            if(!capaian_master.sc_faculty.update){
                $(".btn_update_sc_faculty").remove();
            }
            if(!capaian_master.sc_faculty.delete){
                $(".btn_delete_sc_faculty").remove();
            }
        }

        // -------------------------------------------- end faculty ----------------------------------------------------------- 

        // -------------------------------------------- start sc_programme ----------------------------------------------------------- 
        if(!capaian_master.sc_programme.read){
            $(".btn_read_sc_programme").remove();
        }

        if(window.sessionStorage.content == 'program'){
            if(!capaian_master.sc_programme.create){
                $(".btn_create_sc_programme").remove();
            }
            if(!capaian_master.sc_programme.update){
                // $(".btn_update_sc_programme").remove();
                console.log('btn_update_sc_programme');
                var uptProgHidden = 0
                return  uptProgHidden;

            }
            else{
                var uptProgHidden = 1
                return  uptProgHidden;
            }
            
            if(!capaian_master.sc_programme.delete){
                $(".btn_delete_sc_programme").remove();
            }
        }

        // -------------------------------------------- end sc_programme -----------------------------------------------------------

        // -------------------------------------------- DONE start sc_courseOffer ----------------------------------------------------------- 
        if(!capaian_master.sc_courseOffer.read){
            $(".btn_read_sc_courseOffer").remove();
        }

        if(window.sessionStorage.content == 'cot'){
            if(!capaian_master.sc_courseOffer.create){
                // console.log('create');
                $(".btn_create_sc_courseOffer").remove();
                sc_courseOffer_add = 0;
            }
            else{
                sc_courseOffer_add = 1;
            }
            if(!capaian_master.sc_courseOffer.update){
                // console.log('update');
                $(".btn_update_sc_courseOffer").remove();
                sc_courseOffer_upt = 0;
            }
            else{
                sc_courseOffer_upt = 1;
            }
            if(!capaian_master.sc_courseOffer.delete){
                $(".btn_delete_sc_courseOffer").remove();
                sc_courseOffer_del = 0;
            }
            else{
                sc_courseOffer_del = 1;
            }

            settingsData = [sc_courseOffer_add, sc_courseOffer_upt, sc_courseOffer_del];

            // return data;
            window.capaianData = settingsData; 


        }

        // -------------------------------------------- end sc_courseOffer -----------------------------------------------------------


        // -------------------------------------------- start sc_gradScheme ----------------------------------------------------------- 
        if(!capaian_master.sc_gradScheme.read){
            $(".btn_read_sc_gradScheme").remove();
        }

        if(window.sessionStorage.content == 'skemaMarkah'){

            if(!capaian_master.sc_gradScheme.create){
                // console.log('create');
                $(".btn_create_sc_gradScheme").remove();
                skemaMarkah_add = 0;
            }
            else{
                skemaMarkah_add = 1;
            }
            if(!capaian_master.sc_gradScheme.update){
                // console.log('update');
                $(".btn_update_sc_gradScheme").remove();
                skemaMarkah_upt = 0;
            }
            else{
                skemaMarkah_upt = 1;
            }
            if(!capaian_master.sc_gradScheme.delete){
                $(".btn_delete_sc_gradScheme").remove();
                skemaMarkah_del = 0;
            }
            else{
                skemaMarkah_del = 1;
            }
    
            settingsData = [skemaMarkah_add, skemaMarkah_upt, skemaMarkah_del];
    
            // return data;
            window.capaianData = settingsData; 

        }

        

        // -------------------------------------------- end sc_gradScheme -----------------------------------------------------------

        // -------------------------------------------- start sc_credit ----------------------------------------------------------- 
        if(!capaian_master.sc_credit.read){
            $(".btn_read_sc_credit").remove();
        }

        if(window.sessionStorage.content == 'minMaxKredit'){
            

            if(!capaian_master.sc_credit.create){
                // console.log('create');
                $(".btn_create_sc_credit").remove();
                sc_credit_add = 0;
            }
            else{
                sc_credit_add = 1;
            }
            if(!capaian_master.sc_credit.update){
                // console.log('update');
                $(".btn_update_sc_credit").remove();
                sc_credit_upt = 0;
            }
            else{
                sc_credit_upt = 1;
            }
            if(!capaian_master.sc_credit.delete){
                $(".btn_delete_sc_credit").remove();
                sc_credit_del = 0;
            }
            else{
                sc_credit_del = 1;
            }
    
            settingsData = [sc_credit_add, sc_credit_upt, sc_credit_del];
    
            // return data;
            window.capaianData = settingsData; 

        }

        // -------------------------------------------- end sc_credit -----------------------------------------------------------


        // -------------------------------------------- start sc_classroom ----------------------------------------------------------- 
        if(!capaian_master.sc_classroom.read){
            $(".btn_read_sc_classroom").remove();
        }

        if(window.sessionStorage.content == 'lokasi'){
            // if(!capaian_master.sc_classroom.create){
            //     $(".btn_create_sc_classroom").remove();
            // }
            // if(!capaian_master.sc_classroom.update){
            //     $(".btn_update_sc_classroom").remove();
            // }
            // if(!capaian_master.sc_classroom.delete){
            //     $(".btn_delete_sc_classroom").remove();
            // }

            if(!capaian_master.sc_classroom.create){
                // console.log('create');
                $(".btn_create_sc_classroom").remove();
                sc_classroom_add = 0;
            }
            else{
                sc_classroom_add = 1;
            }
            if(!capaian_master.sc_classroom.update){
                // console.log('update');
                $(".btn_update_sc_classroom").remove();
                sc_classroom_upt = 0;
            }
            else{
                sc_classroom_upt = 1;
            }
            if(!capaian_master.sc_classroom.delete){
                $(".btn_delete_sc_classroom").remove();
                sc_classroom_del = 0;
            }
            else{
                sc_classroom_del = 1;
            }
    
            settingsData = [sc_classroom_add, sc_classroom_upt, sc_classroom_del];
    
            // return data;
            window.capaianData = settingsData; 

        }

        // -------------------------------------------- end sc_classroom -----------------------------------------------------------

        // -------------------------------------------- start sc_cte ----------------------------------------------------------- 
        if(!capaian_master.sc_cte.read){
            $(".btn_read_sc_cte").remove();
        }

        // if(window.sessionStorage.content == 'sc_cte'){
        if(window.sessionStorage.content == 'courseTeachingEva'){
            if(!capaian_master.sc_cte.create){
                $(".btn_create_sc_cte").remove();
            }
            if(!capaian_master.sc_cte.update){
                $(".btn_update_sc_cte").remove();
            }
            if(!capaian_master.sc_cte.delete){
                $(".btn_delete_sc_cte").remove();
            }

            ////////////

            if(!capaian_master.sc_cte.create){
                // console.log('create');
                $(".btn_create_sc_cte").remove();
                sc_cte_add = 0;
            }
            else{
                sc_cte_add = 1;
            }
            if(!capaian_master.sc_cte.update){
                // console.log('update');
                $(".btn_update_sc_cte").remove();
                sc_cte_upt = 0;
            }
            else{
                sc_cte_upt = 1;
            }
            if(!capaian_master.sc_cte.delete){
                $(".btn_delete_sc_cte").remove();
                sc_cte_del = 0;
            }
            else{
                sc_cte_del = 1;
            }
    
            settingsData = [sc_cte_add, sc_cte_upt, sc_cte_del];
    
            // return data;
            window.capaianData = settingsData; 


            ////////////////
        }

        // -------------------------------------------- end sc_cte -----------------------------------------------------------

        // -------------------------------------------- start student ----------------------------------------------------------- 
        if(!capaian_master.student.read){
            $(".btn_read_student").remove();
        }

        if(window.sessionStorage.content == 'adm_pljrInfo'){
           
            if(!capaian_master.student.create){
                // console.log('create');
                $(".btn_create_student").remove();
                student_add = 0;
            }
            else{
                student_add = 1;
            }
            if(!capaian_master.student.update){
                // console.log('update');
                $(".btn_update_student").remove();
                student_upt = 0;
            }
            else{
                student_upt = 1;
            }
            if(!capaian_master.student.delete){
                $(".btn_delete_student").remove();
                student_del = 0;
            }
            else{
                student_del = 1;
            }
    
            settingsData = [student_add, student_upt, student_del];

            window.capaianData = settingsData; // Store in a global variable
    
            // return data;
        }

        // -------------------------------------------- end student ----------------------------------------------------------- 

        // -------------------------------------------- start policy ----------------------------------------------------------- 
        if(!capaian_master.policy.read){
            $(".btn_read_policy").remove();
        }

        if(window.sessionStorage.content == 'pol_kehadiran' || window.sessionStorage.content == 'pol_kursus'  || window.sessionStorage.content == 'pol_peperiksaan'){
            
       
            
            if(!capaian_master.policy.create){
                // console.log('create');
                $(".btn_create_policy").remove();
                policy_add = 0;
            }
            else{
                policy_add = 1;
            }
            if(!capaian_master.policy.update){
                // console.log('update');
                $(".btn_update_policy").remove();
                policy_upt = 0;
            }
            else{
                policy_upt = 1;
            }
            if(!capaian_master.policy.delete){
                $(".btn_delete_policy").remove();
                policy_del = 0;
            }
            else{
                policy_del = 1;
            }
    
            settingsData = [policy_add, policy_upt, policy_del];

            window.capaianData = settingsData; 
    
            // return data;
        }

        // -------------------------------------------- end policy -----------------------------------------------------------

        // -------------------------------------------- start cect ----------------------------------------------------------- 
        if(!capaian_master.cect.read){
            $(".btn_read_cect").remove();
        }

        if(window.sessionStorage.content == 'adm_cect'){
          

            if(!capaian_master.cect.create){
                // console.log('create');
                $(".btn_create_cect").remove();
                cect_add = 0;
            }
            else{
                cect_add = 1;
            }
            if(!capaian_master.cect.update){
                // console.log('update');
                $(".btn_update_cect").remove();
                cect_upt = 0;
            }
            else{
                cect_upt = 1;
            }
            if(!capaian_master.cect.delete){
                $(".btn_delete_cect").remove();
                cect_del = 0;
            }
            else{
                cect_del = 1;
            }
    
            settingsData = [cect_add, cect_upt, cect_del];

            window.capaianData = settingsData; 

    
            // return data;
        }

        // -------------------------------------------- end cect -----------------------------------------------------------

        // -------------------------------------------- start programChange ----------------------------------------------------------- 
        if(!capaian_master.programChange.read){
            $(".btn_read_programChange").remove();
        }

        if(window.sessionStorage.content == 'adm_pgmChange'){
            if(!capaian_master.programChange.create){
                $(".btn_create_programChange").remove();
            }
            if(!capaian_master.programChange.update){
                $(".btn_update_programChange").remove();
            }
            if(!capaian_master.programChange.delete){
                $(".btn_delete_programChange").remove();
            }
        }

        // -------------------------------------------- end programChange -----------------------------------------------------------

        // -------------------------------------------- start studentWithdraw ----------------------------------------------------------- 
        if(!capaian_master.studentWithdraw.read){
            $(".btn_read_studentWithdraw").remove();
        }

        if(window.sessionStorage.content == 'adm_stdWithdraw'){
            if(!capaian_master.studentWithdraw.create){
                $(".btn_create_studentWithdraw").remove();
            }
            if(!capaian_master.studentWithdraw.update){
                $(".btn_update_studentWithdraw").remove();
            }
            if(!capaian_master.studentWithdraw.delete){
                $(".btn_delete_studentWithdraw").remove();
            }
        }

        // -------------------------------------------- end studentWithdraw -----------------------------------------------------------

        // -------------------------------------------- start gradAudit ----------------------------------------------------------- 
        if(!capaian_master.gradAudit.read){
            $(".btn_read_gradAudit").remove();
        }
        // console.log(capaian_master.gradAudit.read);

        if(window.sessionStorage.content == 'adm_gradAudit'){
            if(!capaian_master.gradAudit.create){
                $(".btn_create_gradAudit").remove();
            }
            if(!capaian_master.gradAudit.update){
                $(".btn_update_gradAudit").remove();
            }
            if(!capaian_master.gradAudit.delete){
                $(".btn_delete_gradAudit").remove();
            }
        }

        // -------------------------------------------- end gradAudit -----------------------------------------------------------

        // -------------------------------------------- start lecturer ----------------------------------------------------------- 
        if(!capaian_master.lecturer.read){
            $(".btn_read_lecturer").remove();
        }

        if(window.sessionStorage.content == 'adm_lecturer'){
            
            if(!capaian_master.lecturer.create){
                // console.log('create');
                $(".btn_create_lecturer").remove();
                lecturer_add = 0;
            }
            else{
                lecturer_add = 1;
            }
            if(!capaian_master.lecturer.update){
                // console.log('update');
                $(".btn_update_lecturer").remove();
                lecturer_upt = 0;
            }
            else{
                lecturer_upt = 1;
            }
            if(!capaian_master.lecturer.delete){
                $(".btn_delete_lecturer").remove();
                lecturer_del = 0;
            }
            else{
                lecturer_del = 1;
            }
    
            settingsData = [lecturer_add, lecturer_upt, lecturer_del];
    
            // return data;

            window.capaianData = settingsData; 

        }

        // -------------------------------------------- end lecturer -----------------------------------------------------------

        //if all e_ not available 
        if(!capaian_master.e_type.read && !capaian_master.e_timetable.read && !capaian_master.e_center.read && !capaian_master.e_application.read && !capaian_master.e_generateGpaCgpa.read && !capaian_master.e_preSenat.read){
            $(".btn_read_eMain").remove();
        }

        // -------------------------------------------- start e_type ----------------------------------------------------------- 
        if(!capaian_master.e_type.read){
            $(".btn_read_e_type").remove();
        }

        if(window.sessionStorage.content == 'exam_jenis'){

            if(!capaian_master.e_type.create){
                // console.log('create');
                $(".btn_create_e_type").remove();
                e_type_add = 0;
            }
            else{
                e_type_add = 1;
            }
            if(!capaian_master.e_type.update){
                // console.log('update');
                $(".btn_update_e_type").remove();
                e_type_upt = 0;
            }
            else{
                e_type_upt = 1;
            }
            if(!capaian_master.e_type.delete){
                $(".btn_delete_e_type").remove();
                e_type_del = 0;
            }
            else{
                e_type_del = 1;
            }
    
            settingsData = [e_type_add, e_type_upt, e_type_del];
    
            // return data;
            window.capaianData = settingsData; 

        }

        // -------------------------------------------- end e_type -----------------------------------------------------------

        // -------------------------------------------- start e_timetable ----------------------------------------------------------- 
        if(!capaian_master.e_timetable.read){
            $(".btn_read_e_timetable").remove();
        }

        if(window.sessionStorage.content == 'exam_jadualWaktu' || window.sessionStorage.content == 'course_Exam' ){

            if(!capaian_master.e_timetable.create){
                // console.log('create');
                $(".btn_create_e_timetable").remove();
                e_timetable_add = 0;
            }
            else{
                e_timetable_add = 1;
            }
            if(!capaian_master.e_timetable.update){
                // console.log('update');
                $(".btn_update_e_timetable").remove();
                e_timetable_upt = 0;
            }
            else{
                e_timetable_upt = 1;
            }
            if(!capaian_master.e_timetable.delete){
                $(".btn_delete_e_timetable").remove();
                e_timetable_del = 0;
            }
            else{
                e_timetable_del = 1;
            }
    
            settingsData = [e_timetable_add, e_timetable_upt, e_timetable_del];
    
            // return data;
            window.capaianData = settingsData; 

        }

        // -------------------------------------------- end e_timetable -----------------------------------------------------------


        // -------------------------------------------- start e_center ----------------------------------------------------------- 
        if(!capaian_master.e_center.read){
            $(".btn_read_e_center").remove();
        }

        if(window.sessionStorage.content == 'exam_pusatPeperiksaan'){
            
            if(!capaian_master.e_center.create){
                // console.log('create');
                $(".btn_create_e_center").remove();
                e_center_add = 0;
            }
            else{
                e_center_add = 1;
            }
            if(!capaian_master.e_center.update){
                // console.log('update');
                $(".btn_update_e_center").remove();
                e_center_upt = 0;
            }
            else{
                e_center_upt = 1;
            }
            if(!capaian_master.e_center.delete){
                $(".btn_delete_e_center").remove();
                e_center_del = 0;
            }
            else{
                e_center_del = 1;
            }
    
            settingsData = [e_center_add, e_center_upt, e_center_del];
    
            // return data;
            window.capaianData = settingsData; 
        }

        // -------------------------------------------- end e_center -----------------------------------------------------------


        // -------------------------------------------- start e_application ----------------------------------------------------------- 
        if(!capaian_master.e_application.read){
            $(".btn_read_e_application").remove();
        }

        if(window.sessionStorage.content == 'exam_borang'){
            if(!capaian_master.e_application.create){
                $(".btn_create_e_application").remove();
            }
            if(!capaian_master.e_application.update){
                $(".btn_update_e_application").remove();
            }
            if(!capaian_master.e_application.delete){
                $(".btn_delete_e_application").remove();
            }
        }

        // -------------------------------------------- end e_application -----------------------------------------------------------

        // -------------------------------------------- start e_generateGpaCgpa ----------------------------------------------------------- 
        if(!capaian_master.e_generateGpaCgpa.read){
            $(".btn_read_e_generateGpaCgpa").remove();
        }

        if(window.sessionStorage.content == 'exam_gpa'){
            // if(!capaian_master.e_generateGpaCgpa.create){
            //     $(".btn_create_e_generateGpaCgpa").remove();
            // }
            // if(!capaian_master.e_generateGpaCgpa.update){
            //     $(".btn_update_e_generateGpaCgpa").remove();
            // }
            // if(!capaian_master.e_generateGpaCgpa.delete){
            //     $(".btn_delete_e_generateGpaCgpa").remove();
            // }

            if(!capaian_master.e_generateGpaCgpa.create){
                // console.log('create');
                $(".btn_create_e_generateGpaCgpa").remove();
                e_generateGpaCgpa_add = 0;
            }
            else{
                e_generateGpaCgpa_add = 1;
            }
            if(!capaian_master.e_generateGpaCgpa.update){
                // console.log('update');
                $(".btn_update_e_generateGpaCgpa").remove();
                e_generateGpaCgpa_upt = 0;
            }
            else{
                e_generateGpaCgpa_upt = 1;
            }
            if(!capaian_master.e_generateGpaCgpa.delete){
                $(".btn_delete_e_generateGpaCgpa").remove();
                e_generateGpaCgpa_del = 0;
            }
            else{
                e_generateGpaCgpa_del = 1;
            }
    
            settingsData = [e_generateGpaCgpa_add, e_generateGpaCgpa_upt, e_generateGpaCgpa_del];
    
            // return data;
            window.capaianData = settingsData; 

        }

        // -------------------------------------------- end e_generateGpaCgpa -----------------------------------------------------------

        // -------------------------------------------- start e_preSenat ----------------------------------------------------------- 
        if(!capaian_master.e_preSenat.read){
            $(".btn_read_e_preSenat").remove();
        }

        if(window.sessionStorage.content == 'e_preSenat'){
            if(!capaian_master.e_preSenat.create){
                $(".btn_create_e_preSenat").remove();
            }
            if(!capaian_master.e_preSenat.update){
                $(".btn_update_e_preSenat").remove();
            }
            if(!capaian_master.e_preSenat.delete){
                $(".btn_delete_e_preSenat").remove();
            }
        }

        // -------------------------------------------- end e_preSenat -----------------------------------------------------------

        // -------------------------------------------- start e_eSenat ----------------------------------------------------------- 
        if(!capaian_master.e_eSenat.read){
            $(".btn_read_e_eSenat").remove();
        }

        if(window.sessionStorage.content == 'campusPage'){
            // if(!capaian_master.e_eSenat.create){
            //     $(".btn_create_e_eSenat").remove();
            // }
            // if(!capaian_master.e_eSenat.update){
            //     $(".btn_update_e_eSenat").remove();
            // }
            // if(!capaian_master.e_eSenat.delete){
            //     $(".btn_delete_e_eSenat").remove();
            // }

            if(!capaian_master.e_eSenat.create){
                // console.log('create');
                $(".btn_create_e_eSenat").remove();
                e_eSenat_add = 0;
            }
            else{
                e_eSenat_add = 1;
            }
            if(!capaian_master.e_eSenat.update){
                // console.log('update');
                $(".btn_update_e_eSenat").remove();
                e_eSenat_upt = 0;
            }
            else{
                e_eSenat_upt = 1;
            }
            if(!capaian_master.e_eSenat.delete){
                $(".btn_delete_e_eSenat").remove();
                e_eSenat_del = 0;
            }
            else{
                e_eSenat_del = 1;
            }
    
            settingsData = [e_eSenat_add, e_eSenat_upt, e_eSenat_del];
    
            // return data;
            window.capaianData = settingsData; 



        }
        

        // -------------------------------------------- end e_eSenat -----------------------------------------------------------

        // -------------------------------------------- start timetable ----------------------------------------------------------- 
        if(!capaian_master.timetable.read){
            $(".btn_read_timetable").remove();
        }

        if(window.sessionStorage.content == 'adm_timetable'){
            // if(!capaian_master.timetable.create){
            //     $(".btn_create_timetable").remove();
            // }
            // if(!capaian_master.timetable.update){
            //     $(".btn_update_timetable").remove();
            // }
            // if(!capaian_master.timetable.delete){
            //     $(".btn_delete_timetable").remove();
            // }

            if(!capaian_master.timetable.create){
                // console.log('create');
                $(".btn_create_timetable").remove();
                timetable_add = 0;
            }
            else{
                timetable_add = 1;
            }
            if(!capaian_master.timetable.update){
                // console.log('update');
                $(".btn_update_timetable").remove();
                timetable_upt = 0;
            }
            else{
                timetable_upt = 1;
            }
            if(!capaian_master.timetable.delete){
                $(".btn_delete_timetable").remove();
                timetable_del = 0;
            }
            else{
                timetable_del = 1;
            }
    
            settingsData = [timetable_add, timetable_upt, timetable_del];
    
            // return data;
            window.capaianData = settingsData; 

        }

        // -------------------------------------------- end timetable -----------------------------------------------------------

        // -------------------------------------------- start r_examination ----------------------------------------------------------- 
        if(!capaian_master.r_examination.read){
            $(".btn_read_r_examination").remove();
        }
        
        //kalau all reporting not available 
        if(!capaian_master.r_examination.read){
            $(".btn_read_reportingMain").remove();
        }

        if(window.sessionStorage.content == 'r_examination'){
            if(!capaian_master.r_examination.create){
                $(".btn_create_r_examination").remove();
            }
            if(!capaian_master.r_examination.update){
                $(".btn_delete_r_examination").remove();
            }
            if(!capaian_master.r_examination.delete){
                $(".btn_delete_r_examination").remove();
            }
        }

        // -------------------------------------------- end r_examination -----------------------------------------------------------


    } else {
        console.log('obj');
        $(".btn_read_setting").remove();
        $(".btn_read_dashboard").remove();
        $(".btn_read_sc_faculty").remove();
        $(".btn_read_sc_programme").remove();
        $(".btn_read_sc_courseOffer").remove();
        $(".btn_read_sc_gradScheme").remove();
        $(".btn_read_sc_credit").remove();
        $(".btn_read_sc_classroom").remove();
        $(".btn_read_sc_cte").remove();
        $(".btn_read_student").remove();
        $(".btn_read_policy").remove();
        $(".btn_read_cect").remove();
        $(".btn_read_programChange").remove();
        $(".btn_read_studentWithdraw").remove();
        $(".btn_read_gradAudit").remove();
        $(".btn_read_lecturer").remove();
        $(".btn_read_eMain").remove();
        $(".btn_read_e_timetable").remove();
        $(".btn_read_e_center").remove();
        $(".btn_read_e_application").remove();
        $(".btn_read_e_generateGpaCgpa").remove();
        $(".btn_read_e_preSenat").remove();
        $(".btn_read_timetable").remove();
        $(".btn_read_r_examination").remove();
        $(".btn_read_reportingMain").remove();
        $(".btn_read_announcement").remove();
        $(".btn_read_lecturer").remove();

        $(".btn_read_sc_setting").remove();

        

    }
}



function typeAccess() {
    var objType = new get(host+`api_tetapan_picoms/public/admAccess/showUserAccessPK/`+ window.sessionStorage.usrId , 'picoms ' + window.sessionStorage.token).execute();
    

    data = objType.data;
    dataPK = data.pk_id;
    // var capaian_masterType = JSON.parse(data.showUserAccessType)[0]; 
    // console.log(objType)
    return dataPK, data.emp_division  ;
}
