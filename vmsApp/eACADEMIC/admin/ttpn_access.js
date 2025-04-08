
let token = window.sessionStorage.token;

$(function() {
    $.ajaxSetup({
        cache: false
    });
    
});
var confirmed = false;

listAccess();
if (window.sessionStorage.accessID){
    loadDataPeranan(window.sessionStorage.accessID);
    setActiveLink(window.sessionStorage.accessID);
}
else{
    loadDataPeranan(1);
    setActiveLink(1);
}


$.fn.select2.defaults.set( "theme", "bootstrap" );

listStaff(function () {

    $('#FK_users').append('<option value="">- Choose -</option>');
    // $('#upt_staf_warden').append('<option value="">- Choose -</option>');
    $.each(obj_eAcademic.data, function (i, item) {
        // console.log(item);

        $('#FK_users').append('<option value="' + item.usr_id + '">' + item.usr_id + ' - ' + item.usr_name + '</option>');
        // $('#upt_staf_warden').append('<option value="'+item.emp_id+'">'+item.emp_name+'</option>');
    });

    $('.slct2').select2({
        width: '100%',
        containerCssClass: ':all:'
    });
});


function listAccess() {
    // $(navAccess).append(`nana`);

    let objAccessList = new get(host + 'api_tetapan_picoms/public/admAccess/list', 'picoms ' + token).execute();
    $("#navAccess").html('');

    if (objAccessList.success) {

        // $('#FK_accessRole').append('<option value="">- Choose -</option>');
        $.each(objAccessList.data, function (u, itemAccessList) {
            $("#navAccess").append(`<li class="nav-item">
                <a class="nav-link" id="link-${itemAccessList.pk_id}" data-bs-toggle="pill" aria-expanded="true" role="tab" onclick="loadDataPeranan(${itemAccessList.pk_id}); setActiveLink(${itemAccessList.pk_id});">
                    <i class="fa fa-user"></i>
                    <span class="fw-bold"> &nbsp; ${itemAccessList.access_name}</span>
                </a>
            </li>`);

            $('#FK_accessRole').append('<option value="' + itemAccessList.pk_id + '">'  + itemAccessList.access_name + '</option>');
        });

        $('.slct2').select2({
            width: '100%',
            containerCssClass: ':all:'
        });
    }


}

function setActiveLink(id) {
    // Remove the 'active' class from all nav links
    $("#navAccess .nav-link").removeClass("active");

    // Add the 'active' class to the clicked nav link
    $(`#link-${id}`).addClass("active");


}

function loadDataPeranan(id) {

    sessionStorage.accessID = id;

    $("#FK_access").val(id);
  let obj = new get(host + `api_tetapan_picoms/public/admAccess/show/`+id , 'picoms '+token).execute();
  objPeranan = obj.data;
    loadData(objPeranan);

    $("#btnReload").html('');


    $("#btnReload").append(`
    <button type="reset" class="btn btn-outline-danger"  onclick="loadDataPeranan(`+id+`)">
        <i data-feather="x"></i> Cancel
    </button>`);

    $("#roleList").html('');

    listRoles(id);

}


function loadData(data) {

    $("#roleName").html('<b>ROLE: </b>'+data.access_name);
    $("#FK_roleName").val(data.access_name);
    
    $("#PK_access").val(data.pk_id);

    if (data.access){
        // console.log(data.pk_id);

        updateSettings(data); // ni utk button disabled dekat admin
        data_access_json = data.access;
        data_access = JSON.parse(data_access_json);

        //setting
        $("#setting_c").prop('checked', data_access[0]["setting"]["create"]);
        $("#setting_r").prop('checked', data_access[0]["setting"]["read"]);
        $("#setting_u").prop('checked', data_access[0]["setting"]["update"]);
        $("#setting_d").prop('checked', data_access[0]["setting"]["delete"]);

        //dashboard
        $("#dashboard_c").prop('checked', data_access[0]["dashboard"]["create"]);
        $("#dashboard_r").prop('checked', data_access[0]["dashboard"]["read"]);
        $("#dashboard_u").prop('checked', data_access[0]["dashboard"]["update"]);
        $("#dashboard_d").prop('checked', data_access[0]["dashboard"]["delete"]);

        // announcement	
        $("#announcement_c").prop('checked', data_access[0]["announcement"]["create"]);
        $("#announcement_r").prop('checked', data_access[0]["announcement"]["read"]);
        $("#announcement_u").prop('checked', data_access[0]["announcement"]["update"]);
        $("#announcement_d").prop('checked', data_access[0]["announcement"]["delete"]);

        // Role Access
        $("#gradAudit_c").prop('checked', data_access[0]["gradAudit"]["create"]);
        $("#gradAudit_r").prop('checked', data_access[0]["gradAudit"]["read"]);
        $("#gradAudit_u").prop('checked', data_access[0]["gradAudit"]["update"]);
        $("#gradAudit_d").prop('checked', data_access[0]["gradAudit"]["delete"]);

        // Faculty
        $("#sc_faculty_c").prop('checked', data_access[0]["sc_faculty"]["create"]);
        $("#sc_faculty_r").prop('checked', data_access[0]["sc_faculty"]["read"]);
        $("#sc_faculty_u").prop('checked', data_access[0]["sc_faculty"]["update"]);
        $("#sc_faculty_d").prop('checked', data_access[0]["sc_faculty"]["delete"]);

        // Programme
        $("#sc_programme_c").prop('checked', data_access[0]["sc_programme"]["create"]);
        $("#sc_programme_r").prop('checked', data_access[0]["sc_programme"]["read"]);
        $("#sc_programme_u").prop('checked', data_access[0]["sc_programme"]["update"]);
        $("#sc_programme_d").prop('checked', data_access[0]["sc_programme"]["delete"]);

        // Course - Course Offer
        $("#sc_courseOffer_c").prop('checked', data_access[0]["sc_courseOffer"]["create"]);
        $("#sc_courseOffer_r").prop('checked', data_access[0]["sc_courseOffer"]["read"]);
        $("#sc_courseOffer_u").prop('checked', data_access[0]["sc_courseOffer"]["update"]);
        $("#sc_courseOffer_d").prop('checked', data_access[0]["sc_courseOffer"]["delete"]);

        // Course - Grading Scheme
        $("#sc_gradScheme_c").prop('checked', data_access[0]["sc_gradScheme"]["create"]);
        $("#sc_gradScheme_r").prop('checked', data_access[0]["sc_gradScheme"]["read"]);
        $("#sc_gradScheme_u").prop('checked', data_access[0]["sc_gradScheme"]["update"]);
        $("#sc_gradScheme_d").prop('checked', data_access[0]["sc_gradScheme"]["delete"]);

        // Course - Min/Max Credit
        $("#sc_credit_c").prop('checked', data_access[0]["sc_credit"]["create"]);
        $("#sc_credit_r").prop('checked', data_access[0]["sc_credit"]["read"]);
        $("#sc_credit_u").prop('checked', data_access[0]["sc_credit"]["update"]);
        $("#sc_credit_d").prop('checked', data_access[0]["sc_credit"]["delete"]);

        // Classroom
        $("#sc_classroom_c").prop('checked', data_access[0]["sc_classroom"]["create"]);
        $("#sc_classroom_r").prop('checked', data_access[0]["sc_classroom"]["read"]);
        $("#sc_classroom_u").prop('checked', data_access[0]["sc_classroom"]["update"]);
        $("#sc_classroom_d").prop('checked', data_access[0]["sc_classroom"]["delete"]);

        // Course Teaching Evaluation	
        $("#sc_cte_c").prop('checked', data_access[0]["sc_cte"]["create"]);
        $("#sc_cte_r").prop('checked', data_access[0]["sc_cte"]["read"]);
        $("#sc_cte_u").prop('checked', data_access[0]["sc_cte"]["update"]);
        $("#sc_cte_d").prop('checked', data_access[0]["sc_cte"]["delete"]);

        // student
        $("#student_c").prop('checked', data_access[0]["student"]["create"]);
        $("#student_r").prop('checked', data_access[0]["student"]["read"]);
        $("#student_u").prop('checked', data_access[0]["student"]["update"]);
        $("#student_d").prop('checked', data_access[0]["student"]["delete"]);

        // policy
        $("#policy_c").prop('checked', data_access[0]["policy"]["create"]);
        $("#policy_r").prop('checked', data_access[0]["policy"]["read"]);
        $("#policy_u").prop('checked', data_access[0]["policy"]["update"]);
        $("#policy_d").prop('checked', data_access[0]["policy"]["delete"]);

        // cect
        $("#cect_c").prop('checked', data_access[0]["cect"]["create"]);
        $("#cect_r").prop('checked', data_access[0]["cect"]["read"]);
        $("#cect_u").prop('checked', data_access[0]["cect"]["update"]);
        $("#cect_d").prop('checked', data_access[0]["cect"]["delete"]);
        
        // Programme Change	
        $("#progChange_c").prop('checked', data_access[0]["programChange"]["create"]);
        $("#progChange_r").prop('checked', data_access[0]["programChange"]["read"]);
        $("#progChange_u").prop('checked', data_access[0]["programChange"]["update"]);
        $("#progChange_d").prop('checked', data_access[0]["programChange"]["delete"]);
        
        // Student Withdraw	
        $("#studWithdraw_c").prop('checked', data_access[0]["studentWithdraw"]["create"]);
        $("#studWithdraw_r").prop('checked', data_access[0]["studentWithdraw"]["read"]);
        $("#studWithdraw_u").prop('checked', data_access[0]["studentWithdraw"]["update"]);
        $("#studWithdraw_d").prop('checked', data_access[0]["studentWithdraw"]["delete"]);
        
        // Lecturer
        $("#lecturer_c").prop('checked', data_access[0]["lecturer"]["create"]);
        $("#lecturer_r").prop('checked', data_access[0]["lecturer"]["read"]);
        $("#lecturer_u").prop('checked', data_access[0]["lecturer"]["update"]);
        $("#lecturer_d").prop('checked', data_access[0]["lecturer"]["delete"]);
        
        // Examination Type	
        $("#e_examType_c").prop('checked', data_access[0]["e_type"]["create"]);
        $("#e_examType_r").prop('checked', data_access[0]["e_type"]["read"]);
        $("#e_examType_u").prop('checked', data_access[0]["e_type"]["update"]);
        $("#e_examType_d").prop('checked', data_access[0]["e_type"]["delete"]);
        
        // Examination Timetable
        $("#e_timetable_c").prop('checked', data_access[0]["e_timetable"]["create"]);
        $("#e_timetable_r").prop('checked', data_access[0]["e_timetable"]["read"]);
        $("#e_timetable_u").prop('checked', data_access[0]["e_timetable"]["update"]);
        $("#e_timetable_d").prop('checked', data_access[0]["e_timetable"]["delete"]);
        
        // Examination Center
        $("#e_center_c").prop('checked', data_access[0]["e_center"]["create"]);
        $("#e_center_r").prop('checked', data_access[0]["e_center"]["read"]);
        $("#e_center_u").prop('checked', data_access[0]["e_center"]["update"]);
        $("#e_center_d").prop('checked', data_access[0]["e_center"]["delete"]);

        // Examination Application
        $("#e_application_c").prop('checked', data_access[0]["e_application"]["create"]);
        $("#e_application_r").prop('checked', data_access[0]["e_application"]["read"]);
        $("#e_application_u").prop('checked', data_access[0]["e_application"]["update"]);
        $("#e_application_d").prop('checked', data_access[0]["e_application"]["delete"]);
        
        // Examination Generate GPA/CGPA
        $("#e_generate_c").prop('checked', data_access[0]["e_generateGpaCgpa"]["create"]);
        $("#e_generate_r").prop('checked', data_access[0]["e_generateGpaCgpa"]["read"]);
        $("#e_generate_u").prop('checked', data_access[0]["e_generateGpaCgpa"]["update"]);
        $("#e_generate_d").prop('checked', data_access[0]["e_generateGpaCgpa"]["delete"]);
        
        // Examination Pra-Senate	
        $("#e_preSenate_c").prop('checked', data_access[0]["e_preSenat"]["create"]);
        $("#e_preSenate_r").prop('checked', data_access[0]["e_preSenat"]["read"]);
        $("#e_preSenate_u").prop('checked', data_access[0]["e_preSenat"]["update"]);
        $("#e_preSenate_d").prop('checked', data_access[0]["e_preSenat"]["delete"]);
        
        // Examination eSenate
        $("#e_eSenate_c").prop('checked', data_access[0]["e_eSenat"]["create"]);
        $("#e_eSenate_r").prop('checked', data_access[0]["e_eSenat"]["read"]);
        $("#e_eSenate_u").prop('checked', data_access[0]["e_eSenat"]["update"]);
        $("#e_eSenate_d").prop('checked', data_access[0]["e_eSenat"]["delete"]);
        
        // Timetable
        $("#timetable_c").prop('checked', data_access[0]["timetable"]["create"]);
        $("#timetable_r").prop('checked', data_access[0]["timetable"]["read"]);
        $("#timetable_u").prop('checked', data_access[0]["timetable"]["update"]);
        $("#timetable_d").prop('checked', data_access[0]["timetable"]["delete"]);
        
        // Reporting Examination
        $("#r_examination_c").prop('checked', data_access[0]["r_examination"]["create"]);
        $("#r_examination_r").prop('checked', data_access[0]["r_examination"]["read"]);
        $("#r_examination_u").prop('checked', data_access[0]["r_examination"]["update"]);
        $("#r_examination_d").prop('checked', data_access[0]["r_examination"]["delete"]);
        
    }
    else{

        //setting
        $("#setting_c").prop('checked', false);
        $("#setting_r").prop('checked', false);
        $("#setting_u").prop('checked', false);
        $("#setting_d").prop('checked', false);

        //dashboard
        $("#dashboard_c").prop('checked', false);
        $("#dashboard_r").prop('checked', false);
        $("#dashboard_u").prop('checked', false);
        $("#dashboard_d").prop('checked', false);

        //announcement
        $("#announcement_c").prop('checked', false);
        $("#announcement_r").prop('checked', false);
        $("#announcement_u").prop('checked', false);
        $("#announcement_d").prop('checked', false);

        // Role Access
        $("#gradAudit_c").prop('checked', false);
        $("#gradAudit_r").prop('checked', false);
        $("#gradAudit_u").prop('checked', false);
        $("#gradAudit_d").prop('checked', false);

        // Faculty
        $("#sc_faculty_c").prop('checked', false);
        $("#sc_faculty_r").prop('checked', false);
        $("#sc_faculty_u").prop('checked', false);
        $("#sc_faculty_d").prop('checked', false);

        // Programme
        $("#sc_programme_c").prop('checked', false);
        $("#sc_programme_r").prop('checked', false);
        $("#sc_programme_u").prop('checked', false);
        $("#sc_programme_d").prop('checked', false);

        // Course - Course Offer
        $("#sc_courseOffer_c").prop('checked', false);
        $("#sc_courseOffer_r").prop('checked', false);
        $("#sc_courseOffer_u").prop('checked', false);
        $("#sc_courseOffer_d").prop('checked', false);

        // Course - Grading Scheme
        $("#sc_gradScheme_c").prop('checked', false);
        $("#sc_gradScheme_r").prop('checked', false);
        $("#sc_gradScheme_u").prop('checked', false);
        $("#sc_gradScheme_d").prop('checked', false);

        // Course - Min/Max Credit
        $("#sc_credit_c").prop('checked', false);
        $("#sc_credit_r").prop('checked', false);
        $("#sc_credit_u").prop('checked', false);
        $("#sc_credit_d").prop('checked', false);

        // Classroom
        $("#sc_classroom_c").prop('checked', false);
        $("#sc_classroom_r").prop('checked', false);
        $("#sc_classroom_u").prop('checked', false);
        $("#sc_classroom_d").prop('checked', false);

        // Course Teaching Evaluation	
        $("#sc_cte_c").prop('checked', false);
        $("#sc_cte_r").prop('checked', false);
        $("#sc_cte_u").prop('checked', false);
        $("#sc_cte_d").prop('checked', false);

        // student
        $("#student_c").prop('checked', false);
        $("#student_r").prop('checked', false);
        $("#student_u").prop('checked', false);
        $("#student_d").prop('checked', false);

        // policy
        $("#policy_c").prop('checked', false);
        $("#policy_r").prop('checked', false);
        $("#policy_u").prop('checked', false);
        $("#policy_d").prop('checked', false);

        // cect
        $("#cect_c").prop('checked', false);
        $("#cect_r").prop('checked', false);
        $("#cect_u").prop('checked', false);
        $("#cect_d").prop('checked', false);
        
        // Programme Change	
        $("#progChange_c").prop('checked', false);
        $("#progChange_r").prop('checked', false);
        $("#progChange_u").prop('checked', false);
        $("#progChange_d").prop('checked', false);
        
        // Student Withdraw	
        $("#studWithdraw_c").prop('checked', false);
        $("#studWithdraw_r").prop('checked', false);
        $("#studWithdraw_u").prop('checked', false);
        $("#studWithdraw_d").prop('checked', false);
        
        // Lecturer
        $("#lecturer_c").prop('checked', false);
        $("#lecturer_r").prop('checked', false);
        $("#lecturer_u").prop('checked', false);
        $("#lecturer_d").prop('checked', false);
        
        // Examination Type	
        $("#e_examType_c").prop('checked', false);
        $("#e_examType_r").prop('checked', false);
        $("#e_examType_u").prop('checked', false);
        $("#e_examType_d").prop('checked', false);
        
        // Examination Timetable
        $("#e_timetable_c").prop('checked', false);
        $("#e_timetable_r").prop('checked', false);
        $("#e_timetable_u").prop('checked', false);
        $("#e_timetable_d").prop('checked', false);
        
        // Examination Center
        $("#e_center_c").prop('checked', false);
        $("#e_center_r").prop('checked', false);
        $("#e_center_u").prop('checked', false);
        $("#e_center_d").prop('checked', false);

        // Examination Application
        $("#e_application_c").prop('checked', false);
        $("#e_application_r").prop('checked', false);
        $("#e_application_u").prop('checked', false);
        $("#e_application_d").prop('checked', false);
        
        // Examination Generate GPA/CGPA
        $("#e_generate_c").prop('checked', false);
        $("#e_generate_r").prop('checked', false);
        $("#e_generate_u").prop('checked', false);
        $("#e_generate_d").prop('checked', false);
        
        // Examination Pra-Senate	
        $("#e_preSenate_c").prop('checked', false);
        $("#e_preSenate_r").prop('checked', false);
        $("#e_preSenate_u").prop('checked', false);
        $("#e_preSenate_d").prop('checked', false);
        
        // Examination eSenate
        $("#e_eSenate_c").prop('checked', false);
        $("#e_eSenate_r").prop('checked', false);
        $("#e_eSenate_u").prop('checked', false);
        $("#e_eSenate_d").prop('checked', false);
        
        // Timetable
        $("#timetable_c").prop('checked', false);
        $("#timetable_r").prop('checked', false);
        $("#timetable_u").prop('checked', false);
        $("#timetable_d").prop('checked', false);
        
        // Reporting Examination
        $("#r_examination_c").prop('checked', false);
        $("#r_examination_r").prop('checked', false);
        $("#r_examination_u").prop('checked', false);
        $("#r_examination_d").prop('checked', false);
    }
      
}


$('#addRoleForm').on('submit', function(e){//

    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Access Access By Role",
            text: "Are you sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){

        let PK_access = $('#PK_access').val();

           //setting
           let setting_c = $("#setting_c").prop('checked');
           let setting_r = $("#setting_r").prop('checked');
           let setting_u = $("#setting_u").prop('checked');
           let setting_d = $("#setting_d").prop('checked');
   
           //dashboard
           let dashboard_c = $("#dashboard_c").prop('checked');
           let dashboard_r = $("#dashboard_r").prop('checked');
           let dashboard_u = $("#dashboard_u").prop('checked');
           let dashboard_d = $("#dashboard_d").prop('checked');
   
           //announcement
           let announcement_c = $("#announcement_c").prop('checked');
           let announcement_r = $("#announcement_r").prop('checked');
           let announcement_u = $("#announcement_u").prop('checked');
           let announcement_d = $("#announcement_d").prop('checked');
   

   
           // Faculty
           let sc_faculty_c = $("#sc_faculty_c").prop('checked');
           let sc_faculty_r = $("#sc_faculty_r").prop('checked');
           let sc_faculty_u = $("#sc_faculty_u").prop('checked');
           let sc_faculty_d = $("#sc_faculty_d").prop('checked');
   
           // Programme
           let sc_programme_c = $("#sc_programme_c").prop('checked');
           let sc_programme_r = $("#sc_programme_r").prop('checked');
           let sc_programme_u = $("#sc_programme_u").prop('checked');
           let sc_programme_d = $("#sc_programme_d").prop('checked');
   
           // Course - Course Offer
           let sc_courseOffer_c = $("#sc_courseOffer_c").prop('checked');
           let sc_courseOffer_r = $("#sc_courseOffer_r").prop('checked');
           let sc_courseOffer_u = $("#sc_courseOffer_u").prop('checked');
           let sc_courseOffer_d = $("#sc_courseOffer_d").prop('checked');
   
           // Course - Grading Scheme
           let sc_gradScheme_c = $("#sc_gradScheme_c").prop('checked');
           let sc_gradScheme_r = $("#sc_gradScheme_r").prop('checked');
           let sc_gradScheme_u = $("#sc_gradScheme_u").prop('checked');
           let sc_gradScheme_d = $("#sc_gradScheme_d").prop('checked');
   
           // Course - Min/Max Credit
           let sc_credit_c = $("#sc_credit_c").prop('checked');
           let sc_credit_r = $("#sc_credit_r").prop('checked');
           let sc_credit_u = $("#sc_credit_u").prop('checked');
           let sc_credit_d = $("#sc_credit_d").prop('checked');
   
           // Classroom
           let sc_classroom_c = $("#sc_classroom_c").prop('checked');
           let sc_classroom_r = $("#sc_classroom_r").prop('checked');
           let sc_classroom_u = $("#sc_classroom_u").prop('checked');
           let sc_classroom_d = $("#sc_classroom_d").prop('checked');
   
           // Course Teaching Evaluation	
           let sc_cte_c = $("#sc_cte_c").prop('checked');
           let sc_cte_r = $("#sc_cte_r").prop('checked');
           let sc_cte_u = $("#sc_cte_u").prop('checked');
           let sc_cte_d = $("#sc_cte_d").prop('checked');
   
           // student
           let student_c = $("#student_c").prop('checked');
           let student_r= $("#student_r").prop('checked');
           let student_u= $("#student_u").prop('checked');
           let student_d = $("#student_d").prop('checked');
   
           // policy
           let policy_c = $("#policy_c").prop('checked');
           let policy_r = $("#policy_r").prop('checked');
           let policy_u = $("#policy_u").prop('checked');
           let policy_d = $("#policy_d").prop('checked');
   
           // cect
           let cect_c = $("#cect_c").prop('checked');
           let cect_r = $("#cect_r").prop('checked');
           let cect_u = $("#cect_u").prop('checked');
           let cect_d = $("#cect_d").prop('checked');
           
           // Programme Change	
           let progChange_c = $("#progChange_c").prop('checked');
           let progChange_r = $("#progChange_r").prop('checked');
           let progChange_u = $("#progChange_u").prop('checked');
           let progChange_d = $("#progChange_d").prop('checked');
           
           // Student Withdraw	
           let studWithdraw_c = $("#studWithdraw_c").prop('checked');
           let studWithdraw_r = $("#studWithdraw_r").prop('checked');
           let studWithdraw_u = $("#studWithdraw_u").prop('checked');
           let studWithdraw_d = $("#studWithdraw_d").prop('checked');

            // Graduation Audit
            let gradAudit_c = $("#gradAudit_c").prop('checked');
            let gradAudit_r = $("#gradAudit_r").prop('checked');
            let gradAudit_u = $("#gradAudit_u").prop('checked');
            let gradAudit_d = $("#gradAudit_d").prop('checked');
           
           // Lecturer
           let lecturer_c = $("#lecturer_c").prop('checked');
           let lecturer_r = $("#lecturer_r").prop('checked');
           let lecturer_u = $("#lecturer_u").prop('checked');
           let lecturer_d = $("#lecturer_d").prop('checked');
           
           // Examination Type	
           let e_examType_c = $("#e_examType_c").prop('checked');
           let e_examType_r = $("#e_examType_r").prop('checked');
           let e_examType_u = $("#e_examType_u").prop('checked');
           let e_examType_d = $("#e_examType_d").prop('checked');
           
           // Examination Timetable
           let e_timetable_c = $("#e_timetable_c").prop('checked');
           let e_timetable_r = $("#e_timetable_r").prop('checked');
           let e_timetable_u = $("#e_timetable_u").prop('checked');
           let e_timetable_d = $("#e_timetable_d").prop('checked');
           
           // Examination Center
           let e_center_c = $("#e_center_c").prop('checked');
           let e_center_r = $("#e_center_r").prop('checked');
           let e_center_u = $("#e_center_u").prop('checked');
           let e_center_d = $("#e_center_d").prop('checked');
   
           // Examination Application
           let e_application_c = $("#e_application_c").prop('checked');
           let e_application_r = $("#e_application_r").prop('checked');
           let e_application_u = $("#e_application_u").prop('checked');
           let e_application_d = $("#e_application_d").prop('checked');
           
           // Examination Generate GPA/CGPA
           let e_generate_c = $("#e_generate_c").prop('checked');
           let e_generate_r = $("#e_generate_r").prop('checked');
           let e_generate_u = $("#e_generate_u").prop('checked');
           let e_generate_d = $("#e_generate_d").prop('checked');
           
           // Examination Pra-Senate	
           let e_preSenate_c = $("#e_preSenate_c").prop('checked');
           let e_preSenate_r = $("#e_preSenate_r").prop('checked');
           let e_preSenate_u = $("#e_preSenate_u").prop('checked');
           let e_preSenate_d = $("#e_preSenate_d").prop('checked');
           
           // Examination eSenate
           let e_eSenate_c = $("#e_eSenate_c").prop('checked');
           let e_eSenate_r = $("#e_eSenate_r").prop('checked');
           let e_eSenate_u = $("#e_eSenate_u").prop('checked');
           let e_eSenate_d = $("#e_eSenate_d").prop('checked');
           
           // Timetable
           let timetable_c = $("#timetable_c").prop('checked');
           let timetable_r = $("#timetable_r").prop('checked');
           let timetable_u = $("#timetable_u").prop('checked');
           let timetable_d = $("#timetable_d").prop('checked');
           
           // Reporting Examination
           let r_examination_c = $("#r_examination_c").prop('checked');
           let r_examination_r = $("#r_examination_r").prop('checked');
           let r_examination_u = $("#r_examination_u").prop('checked');
           let r_examination_d = $("#r_examination_d").prop('checked');


           let access = [
            {
                "setting": {
                    "create": setting_c,
                    "read": setting_r,
                    "update": setting_u,
                    "delete": setting_d
                },
                "dashboard": {
                    "create": dashboard_c,
                    "read": dashboard_r,
                    "update": dashboard_u,
                    "delete": dashboard_d
                },
                "announcement": {
                    "create": announcement_c,
                    "read":   announcement_r,
                    "update": announcement_u,
                    "delete": announcement_d
                },
                "sc_faculty": {
                    "create": sc_faculty_c,
                    "read": sc_faculty_r,
                    "update": sc_faculty_u,
                    "delete": sc_faculty_d
                },
                "sc_programme": {
                    "create": sc_programme_c,
                    "read": sc_programme_r,
                    "update": sc_programme_u,
                    "delete": sc_programme_d
                },
                "sc_courseOffer": {
                    "create": sc_courseOffer_c,
                    "read": sc_courseOffer_r,
                    "update": sc_courseOffer_u,
                    "delete": sc_courseOffer_d
                },
                "sc_credit": {
                    "create": sc_credit_c,
                    "read": sc_credit_r,
                    "update": sc_credit_u,
                    "delete": sc_credit_d
                },
                "sc_gradScheme": {
                    "create": sc_gradScheme_c,
                    "read": sc_gradScheme_r,
                    "update": sc_gradScheme_u,
                    "delete": sc_gradScheme_d
                },
                "sc_classroom": {
                    "create": sc_classroom_c,
                    "read": sc_classroom_r,
                    "update": sc_classroom_u,
                    "delete": sc_classroom_d
                },
                "sc_cte": {
                    "create": sc_cte_c,
                    "read": sc_cte_r,
                    "update": sc_cte_u,
                    "delete": sc_cte_d
                },
                "student": {
                    "create": student_c,
                    "read": student_r,
                    "update": student_u,
                    "delete": student_d
                },
                "policy": {
                    "create": policy_c,
                    "read": policy_r,
                    "update": policy_u,
                    "delete": policy_d
                },
                "cect": {
                    "create": cect_c,
                    "read": cect_r,
                    "update": cect_u,
                    "delete": cect_d
                },
                "programChange": {
                    "create": progChange_c,
                    "read": progChange_r,
                    "update": progChange_u,
                    "delete": progChange_d
                },
                "studentWithdraw": {
                    "create": studWithdraw_c,
                    "read": studWithdraw_r,
                    "update": studWithdraw_u,
                    "delete": studWithdraw_d
                },
                "gradAudit": {
                    "create": gradAudit_c,
                    "read": gradAudit_r,
                    "update": gradAudit_u,
                    "delete": gradAudit_d
                },
                "lecturer": {
                    "create": lecturer_c,
                    "read": lecturer_r,
                    "update": lecturer_u,
                    "delete": lecturer_d
                },
                "e_type": {
                    "create": e_examType_c,
                    "read": e_examType_r,
                    "update": e_examType_u,
                    "delete": e_examType_d
                },
                "e_timetable": {
                    "create": e_timetable_c,
                    "read": e_timetable_r,
                    "update": e_timetable_u,
                    "delete": e_timetable_d
                },
                "e_center": {
                    "create": e_center_c,
                    "read": e_center_r,
                    "update": e_center_u,
                    "delete": e_center_d
                },
                "e_application": {
                    "create": e_application_c,
                    "read": e_application_r,
                    "update": e_application_u,
                    "delete": e_application_d
                },
                "e_generateGpaCgpa": {
                    "create": e_generate_c,
                    "read": e_generate_r,
                    "update": e_generate_u,
                    "delete": e_generate_d
                },
                "e_preSenat": {
                    "create": e_preSenate_c,
                    "read": e_preSenate_r,
                    "update": e_preSenate_u,
                    "delete": e_preSenate_d
                },
                "e_eSenat": {
                    "create": e_eSenate_c,
                    "read": e_eSenate_r,
                    "update": e_eSenate_u,
                    "delete": e_eSenate_d
                },
                "timetable": {
                    "create": timetable_c,
                    "read": timetable_r,
                    "update": timetable_u,
                    "delete": timetable_d
                },
                "r_examination": {
                    "create": r_examination_c,
                    "read": r_examination_r,
                    "update": r_examination_u,
                    "delete": r_examination_d
                }
            }
            ];
          
          var form = new FormData();
          form.append("pk_id", PK_access);
          form.append("access", JSON.stringify(access));
            
            var obj = new post(host + `api_tetapan_picoms/public/admAccess/update`, form, 'picoms '+token).execute();
            if (obj.success){
              swal(obj.message, '', "success");
              setTimeout(() => {
                window.location.reload();
            }, Math.random()*1000);

              
            }
            else{
              swal(obj.message,obj.data,"error");
            }
        }); 
    }
  });

$('#formAddNewRole').on('submit', function(e){
if(!confirmed){
    e.preventDefault();
    swal({
        title: "Set Access Access By Role",
        text: "Are you sure?",
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Save",
        confirmButtonColor: "#2196f3",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false
    }).then(function (){

        let usr_id = $('#FK_users').val();
        let access_id = $('#FK_access').val();

        var form = new FormData();
        form.append("usr_id", usr_id);
        form.append("access_id", access_id);

        var obj = new post(host + `api_tetapan_picoms/public/admAccess/updateRole`, form, 'picoms '+token).execute();
        if (obj.success){
            swal(obj.message, '', "success");
            setTimeout(() => {
            window.location.reload();
            
        }, Math.random()*1000);

        }
        else{
            swal(obj.message,'',"error");
        }
    }); 
}
});


  // btn Back to Campus Page
$('#btnBack').click(function(){
    window.location.replace('campusPage.html'); 
});

function listRoles(id) {

    // capaianSetting = load_capaian();
    load_capaian();
    capaianSetting = window.capaianData;
    // console.log(capaianSetting);
    let uptSetting = capaianSetting[1];
    let delSetting = capaianSetting[2];

    if (delSetting == 0){
        SettingDelDisabled = 'disabled';
    }
    else{
        SettingDelDisabled = ''; 
    }

    if (uptSetting == 0){
        SettingUpdateDisabled = 'disabled';
    }
    else{
        SettingUpdateDisabled = ''; 
    }


    var colums = [
        { "name": "bil", "title": "No." },
        { "name": "FK_userID", "title": "Staff ID" },
        { "name": "namaUser", "title": "Name" },
        { "name": "div_fac", "title": "Faculty/Division" },
        { "name": "namaCapaian", "title": "Role" },
        { "name": "btnAction", "title": "Action" },
    ];

    let bil = 1;
    // let convertList = JSON.stringify(data);
    // $("#dataList").val(convertList);
    var list = [];
    let obj = new get(host + 'api_tetapan_picoms/public/admAccess/roleList/' + id, 'picoms ' + window.sessionStorage.token).execute();
    if (obj.success) {

        $.each(obj.data, function (i, item) {

            list.push({
                bil: bil++,
                FK_userID: `<span class="text-uppercase">`+item.usr_id+`</span>`,
                namaUser:item.usr_name,
                div_fac: item.emp_division,
                namaCapaian: item.access_name,
                btnAction: 
                '<button type="button" class="btn btn-icon warning exceptDisabled" '+SettingUpdateDisabled+' title="Update" onclick="uptRole(\'' + item.usr_id + '\', \'' + item.usr_name + '\', \'' + item.access_id + '\')"><i class="ion-edit"></i></button>'
                +
                '<button type="button" class="btn btn-icon danger exceptDisabled" '+SettingDelDisabled+' title="Delete" onclick="delRole(\'' + item.usr_id + '\')"><i class="ion-trash-a"></i></button> &nbsp;'
                
                ,
                
            });
        });
        // console.log(list);         

        // list_superadmin
        $("#roleList").footable({
            "columns": colums,
            "rows": list,
            "paging": {
                "enabled": true,
                "size": 20
            },
            "filtering": {
                "enabled": true,
                "placeholder": "Search...",
                "dropdownTitle": "Search for:"
            }
        });

    }
    else{
        
        $("#roleList").footable({
            "columns": colums,
            "rows": [],
            "paging": {
                "enabled": true,
                "size": 20
            },
            "filtering": {
                "enabled": true,
                "placeholder": "Search...",
                "dropdownTitle": "Search for:"
            }
        });
    }


    if (list<1) {
        $("#roleList").html('');
        
    }
}

function listStaff(returnValue) {
    var settings = {
        "url": host + "api_hr_emp/public/users/listUnRole",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_eAcademic= response;
        returnValue();
    });
}

function delRole(id) {//


    swal({
        title: "Remove Access",
        text: "Are You Sure?",
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Remove",
        confirmButtonColor: "#ef193c",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false
    }).then(function () {
        var form = new FormData();
        form.append("usr_id", id);

        var settings = {
            "url": host + "api_tetapan_picoms/public/admAccess/delRole",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Authorization": "picoms " + window.sessionStorage.token
            },
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };

        $.ajax(settings).done(function (response) {
            var result = JSON.parse(response);
            if (!result.success) {
                swal(result.message, '', "error");
                return;
            }
        
            if (result.success) {
                swal(result.message, '', "success");
                setTimeout(() => {
                    window.location.reload();
                }, Math.random() * 2000);
            }
        });
        
    });
}

function uptRole(Userid, name, accessID) {

    $("#upt-access").modal("show");
    
    $('#FK_name').val(name);
    $('#FK_usersRole').val(Userid);
    $('#FK_accessRole').val(accessID).trigger('change');
}

$("#formUptRole").on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Role",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let usr_id = $("#FK_usersRole").val();
            let access_id = $("#FK_accessRole").val();

            var form = new FormData();
            form.append("usr_id", usr_id);
            form.append("access_id", access_id);
            form.append("recordstatus", "EDT");

            var settings = {
                "url": host+"api_tetapan_picoms/public/admAccess/updateRole",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Authorization": "picoms " + window.sessionStorage.token
                },
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form
            };
    
            $.ajax(settings).done(function (response){
                result = JSON.parse(response);
                if (!result.success) {
                    Swal(result.message, result.data, "error");
                    return;
                }
                window.location.reload();
            });
        });
    }
});


function updateSettings(data) {
    // Select all checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    if (data.pk_id == 1) {
        // Hide button
        $('.tutupBtn').addClass('none');

        // Check and disable all checkboxes that are not already disabled
        checkboxes.forEach(checkbox => {
            if (!checkbox.disabled) {
                checkbox.checked = true;
                checkbox.disabled = true;
            }

            // $('.exceptDisabled').prop('disabled', false);

        });
    } else {
        // Show button (assuming it should be visible when pk_id is not 1)
        $('.tutupBtn').removeClass('none');

        // Uncheck and enable all checkboxes
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.disabled = false;
        });
    }
}