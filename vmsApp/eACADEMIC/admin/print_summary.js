$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let clg_id = window.sessionStorage.idPage;
    let token = window.sessionStorage.token;

    let cal_cohort = window.sessionStorage.cal_cohort;
    let cur_year = window.sessionStorage.cur_year;
    let pgm_fk = window.sessionStorage.pgm_fk;

    let objPgm = new get(host+"api_tetapan_picoms/public/misPrmProg/show/"+pgm_fk,'picoms '+token).execute();

    if(objPgm.success == 'true'){
        let data = objPgm.data;

        $("#fac_name").html(data.fac_name);
        // $("#fac_name_dis").html(data.fac_name);

        $("#pgm_name").html(data.pgm_name);
        // $("#pgm_name_dis").html(data.pgm_name);
        $("#session").html(cur_year.replace('/',"") + "/" + cal_cohort);
    }

    let form = new FormData();
    form.append('cal_cohort',cal_cohort);
    form.append('cur_year',cur_year);
    form.append('pgm_fk',pgm_fk);
    
    let obj = new post(host+"api_pengurusan_pelajar/public/curAcademic/acSummary",form,'picoms '+token).execute();

    let gs = 0, cs = 0, f = 0;

    if(obj.success){
        let data = obj.data;
        let sum = data.length;

        $("#total_std").html(sum);
        data.forEach(async (item, i) => {
            if(i == 0){
                $("#cal_intake").html(item.cal_intake);
                $("#semester_intake").html(cal_cohort);
            }

            cgpa = (item.std_cgpa)*1;

            if(cgpa >= 2.00){
                gs++;
            }
            else if(cgpa < 2.00 && cgpa > 1.50){
                cs++;
            }
            else{
                f++;
            }
        });

        $("#total_gs").html(gs);
        $("#total_cs").html(cs);
        $("#total_f").html(f);
    }

    // console.log(obj);

});