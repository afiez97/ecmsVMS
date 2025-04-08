$(function () {
    $.ajaxSetup({
      cache: false,
    });

    let idt = getUrlVars()['idt'];

    async function doSomethingAsync(item) {
        return new Promise(resolve => {
            setTimeout(() => {
                $("#load_text").html(`<p><b class="text-success"><i class="fa fa-check-circle"></i> `+item.name+`</b></p>`);
                resolve();
            }, Math.random() * 1000);
        });
    }

    async function main(){
        let form = new FormData();
        let obj = await new post('https://cms.ucmi.edu.my/api/private/authentication/token-verification/'+idt,form,'').execute();
        // let obj = await new post('https://ehrms.mnhazim.com/api/private/authentication/token-verification/'+idt,form,'').execute();
        if(obj.success){
            let data = obj.data;
            // console.log(data)
            let sad_user = {
                usr_id:data.employee.staff_id,
                usr_icno:data.employee.ic_passport,
                usr_passwd:'ee578b48ebc5600f1ffdfa3f2e65e473d6af057b510d57d6a3d2f18b2638d458',
                usr_name:data.name,
                usr_email:null,
                usr_cat_eadmin:0,
                usr_cat_ehrms:1,
                usr_cat_ecmis:1,
                usr_cat_ehep:1,
                usr_cat_estudent:0,
                usr_group1:"HRStaff",
                usr_group2:null,
                usr_group3:null,
                usr_group4:null,
                usr_status:"Active",
                user_grp:"Employee",
                usr_onlinestatus:"YES",
                recordstatus:"ADD"

            };

            let dept_code = null;
            
            if(data.employee.main_position.department_unit != null){
                dept_code = data.employee.main_position.department_unit.code;
            }

            if(data.employee.gender_id == 1){
                gender = 'Male';
            }else if(data.employee.gender_id == 2){
                gender = 'Female';
            }else{
                gender = '';

            }
            
            let hrm_emp_info = {
                emp_id:data.employee.staff_id,
                emp_ind:data.employee.main_position.category.code,
                emp_name:data.name,
                emp_icno:data.employee.ic_passport,
                emp_dob:data.employee.date_of_birth,
                emp_nationality:'Malaysian',
                emp_gender:gender,
                emp_race:data.employee.race,
                emp_religion:data.employee.religion,
                emp_mobileno:data.employee.mobile_no,
                // emp_mobileno:data.employee.emp_homeno,
                emp_email:data.email,
                // emp_marital:data.employee,
                // emp_status:data.employee,
                // emp_substatus:data.employee,
                emp_epf:data.employee.epf_number,
                emp_sosco:data.employee.socso_number,
                // emp_taxno:data.employee,
                // emp_curr_addr1:data.employee,
                // emp_curr_addr2:data.employee,
                // emp_curr_addr3:data.employee,
                // emp_curr_postcode:data.employee,
                // emp_curr_state:data.employee,
                // emp_perm_addr1:data.employee,
                // emp_perm_addr2:data.employee,
                // emp_perm_addr3:data.employee,
                // emp_perm_postcode:data.employee,
                // emp_perm_state:data.employee,
                emp_date_join:data.employee.main_position.date_joined,
                emp_date_left:data.employee.main_position.date_left,
                // emp_position:data.employee,
                // emp_designation:data.employee,
                // emp_jobgrade:data.employee,
                // emp_section:data.employee,
                // emp_report:data.employee,
                // emp_shift:data.employee,
                // emp_ot:data.employee,
                // emp_shift:data.employee,

                
                emp_division:data.employee.main_position.faculty_division.code,
                emp_department:dept_code,
                json_data:JSON.stringify(data)
            };

            let hrm_emp_position = {
                Emp_Id:data.employee.staff_id,
                Post_Id:"000",
                Div_Id:data.employee.main_position.faculty_division.code,
                Dep_Id:dept_code,
                Sec_Id:null
            };
            
            let form = new FormData();
            form.append('id',data.employee.staff_id);

            const token_private = '03c659000c4ef512ede929620d03092468deaf3792fefe5a0d9f9ea534b9fc63';

            let objUsers = await new getPublic(host+'api_hr_emp/public/users/view/'+data.employee.staff_id,token_private).execute();
         
            await doSomethingAsync(data);

            if(objUsers.success){
                // console.log(objUsers);                
                let result = await new postPublic(host+'api_hr_emp/public/users/login',form,token_private).execute();

                if(result.success){


                    let CheckingEmpInfoTable = await new getPublic(host+'api_hr_emp/public/users/view/'+data.employee.staff_id,token_private).execute();
                    if(CheckingEmpInfoTable.success){

                        window.sessionStorage.token = result.token;
                        window.sessionStorage.usrCatEadmin = result.data2.usr_cat_eadmin;
                        window.sessionStorage.usrCatEhep = result.data2.usr_cat_ehep;
                        window.sessionStorage.usrName = result.data2.usr_name;
                        window.sessionStorage.usrId = result.data2.usr_id;
                        window.sessionStorage.userRole = "";
                        window.location.replace("hepaPage.html");   

                    }else{

                        let createEmpInfoTable = await new postJson(host+'api_hr_emp/public/employee/create',hrm_emp_info,token_private).execute();
                        if(createEmpInfoTable.success){
                            window.sessionStorage.token = result.token;
                            window.sessionStorage.usrCatEadmin = result.data2.usr_cat_eadmin;
                            window.sessionStorage.usrCatEhep = result.data2.usr_cat_ehep;
                            window.sessionStorage.usrName = result.data2.usr_name;
                            window.sessionStorage.usrId = result.data2.usr_id;
                            window.sessionStorage.userRole = "";
                            window.location.replace("hepaPage.html");   
                        }else{
                            setTimeout(() => {
                                window.location.replace("hepa_login.html");
                            }, Math.random * 1000);   
                        }



                    }


                                     
                }
                
            }
            else{
                let objUsers = await new postJson(host+'api_hr_emp/public/users/create',sad_user,token_private).execute();
                let objEmpInfo = await new postJson(host+'api_hr_emp/public/employee/create',hrm_emp_info,token_private).execute();
                let objEmpPostion = await new postJson(host+'api_hr_emp/public/employee/position/create',hrm_emp_position,token_private).execute();
                if(objUsers.success){                    
                    let result = await new postPublic(host+'api_hr_emp/public/users/login',form,token_private).execute();
    
                    if(result.success){
                        window.sessionStorage.token = result.token;
                        window.sessionStorage.usrCatEadmin = result.data2.usr_cat_eadmin;
                        window.sessionStorage.usrCatEhep = result.data2.usr_cat_ehep;
                        window.sessionStorage.usrName = result.data2.usr_name;
                        window.sessionStorage.usrId = result.data2.usr_id;
                        window.sessionStorage.userRole = "";
                        window.location.replace("hepaPage.html");                        
                    }  
                    else{
                        setTimeout(() => {
                            window.location.replace("hepa_login.html");
                        }, Math.random * 1000);                    
                    }                                      
                }
                else{
                    setTimeout(() => {
                        window.location.replace("hepa_login.html");
                    }, Math.random * 1000);                    
                }
            }

            // console.log(hrm_emp_position)
            // console.log(hrm_emp_info)
            // console.log(hrm_emp_position)
            // console.log(sad_user)
        }
        else{
            
            // setTimeout(() => {
            //     window.location.replace("hepa_login.html");
            // }, Math.random * 1000);
        }
    }

    main();
    
});