var cur_year = "";
var cal_cohort = "";
var data_std = [];
var data_std_new = [];
var data_intake = [];

$(function () {
    $.ajaxSetup({
        cache: false
    });
    $("#loading_mode").modal('show');

    Promise.all(
        [
            month(), 
            intakeList(cur_year,cal_cohort),
            stdList(cur_year,cal_cohort),
            loading_hide()
        ]
    );

    announcementList(function(){
        $("#takwimList").html('');

        var columns = [
            { "name": "bil", "title": "No." },
            { "name": "twm_title", "title": "Title" },
            // { "name": "twm_description", "title": "Description", "breakpoints": "md sm xs" },
            { "name": "twm_sdate", "title": "Start Date", "breakpoints": "md sm xs" },
            { "name": "twm_edate", "title": "End Date", "breakpoints": "md sm xs" },
            { "name": "twm_status", "title": "Status", "breakpoints": "md sm xs" },
            { "name": "upt_btn", "title": "Action" },
        ];

        let bil = 1;
        let convertList = JSON.stringify(obj_announcement.data);
        $("#dataList").val(convertList);
        var list = [];

        $.each(obj_announcement.data, function (i, field) {
            // var upt_btn = ``;
            // var del_btn = ``;
            // $.each(access_id_master,function(i,item){
            //     if(item)
            // });
            list.push({
                bil: bil++, twm_title: field.twm_title.toUpperCase(), twm_sdate: formatDate(field.twm_sdate), twm_edate: formatDate(field.twm_edate), twm_status: field.twm_status.toUpperCase(),
                "upt_btn":  '<button class="btn btn-icon success btn_update_announcement" title="Update" onclick="loadData(\'' + i + '\')"><i class="ion-android-create"></i></button>' +
                            ' <button class="btn btn-icon danger btn_delete_announcement" title="Delete" onclick="del_rekod(\''+field.twm_id+'\')"><i class="ion-trash-b"></i>'
            });
        });

        $("#takwimList").footable({
            "columns": columns,
            "rows": list,
            "paging": {
                "enabled": true,
                "size": 10
            },
            "filtering": {
                "enabled": true,
                "placeholder": "Search...",
                "dropdownTitle": "Search for:"
            }
        });
    });

    statusList(function(){
        $('#status').append('<option value="">- Choose -</option>');
        $('#upt_twm_status').append('<option value="">- Choose -</option>');
        $.each(obj_status.data, function (i, item){
            $('#status').append('<option value="'+item.status_name+'">'+item.status_name+'</option>');
            $('#upt_twm_status').append('<option value="'+item.status_name+'">'+item.status_name+'</option>');
        });
    });
    
})

async function stdList(cur_year,cal_cohort){
    return new Promise(resolve =>{
        $("#loading_mode").modal('show');
        setTimeout(() => {
            let form = new FormData();
            form.append('cur_year',cur_year);
            form.append('cal_cohort',cal_cohort);
            form.append('cam_id',window.sessionStorage.idPage);

            let obj = new post(host+'api_pengurusan_pelajar/public/curAcademic/session',form,'picoms '+window.sessionStorage.token).execute();
            if(obj.success){
                data_std = obj.data;
                $(".total_std").html(formatNumber(data_std.length));

                let filterConditions = {
                    status_academic: 8 
                };

                let data_grad = filterData(data_std,filterConditions);
                $(".total_grad").html(formatNumber(data_grad.length));

                let form_new = new FormData();
                form_new.append('cam_id',window.sessionStorage.idPage);
                obj_new = new post(host+'api_pengurusan_pelajar/public/pelajar/list/new',form_new,'picoms '+window.sessionStorage.token).execute();
                if(obj_new.success){
                    data_std_new = obj_new.data;
                    $(".total_reg").html(formatNumber(data_std_new.length));
                }

                filterConditions = {
                    sti_gender: 'P'
                }
                let data_female = filterData(data_std,filterConditions);

                filterConditions = {
                    sti_gender: 'L'
                }
                let data_male = filterData(data_std,filterConditions);

                //calculate pie registed student
                let male_std = data_male.length;
                let female_std = data_female.length;

                let dom = document.getElementById('gender_pie');
                let pie = echarts.init(dom);
                let option = {
                    tooltip : {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        orient : 'vertical',
                        x : 'left',
                        data:['Male','Female',]
                    },
                    calculable : true,
                    series : [
                        {
                            name:'Source',
                            type:'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:[
                                {value:male_std, name:'Male'},
                                {value:female_std, name:'Female'},
                            ]
                        }
                    ]
                };

                pie.setOption(option);


                //pie 4 pre-register
                filterConditions = {
                    sti_gender: 'P'
                }
                data_female = filterData(data_std_new,filterConditions);

                filterConditions = {
                    sti_gender: 'L'
                }
                data_male = filterData(data_std_new,filterConditions);
                
                //calculate pie registed student
                male_std = data_male.length;
                female_std = data_female.length;

                dom = document.getElementById('gender_pie_2');
                pie = echarts.init(dom);
                option = {
                    tooltip : {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        orient : 'vertical',
                        x : 'left',
                        data:['Male','Female',]
                    },
                    calculable : true,
                    series : [
                        {
                            name:'Source',
                            type:'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:[
                                {value:male_std, name:'Male'},
                                {value:female_std, name:'Female'},
                            ]
                        }
                    ]
                };

                pie.setOption(option);

                //bar_intake
                dom = document.getElementById('bar_intake');
                bar = echarts.init(dom);
                let intake = [];
                let total_deferred = [];
                let total_withdraw = [];
                let total_mia = [];
                let total_std = [];

                data_intake.sort(sortByMonth);
                data_intake.forEach(async (item) => {
                    let cur_intake = item.intake_name + '-' + item.intake_year;
                    
                    intake.push(cur_intake)
                    
                    filterConditions = {
                        status_academic:10,
                        cur_intake:cur_intake
                    }
                    let data_deferred = filterData(data_std,filterConditions);
                    total_deferred.push(data_deferred.length);

                    filterConditions = {
                        status_academic:7,
                        cur_intake:cur_intake
                    }
                    let data_withdraw = filterData(data_std,filterConditions);
                    total_withdraw.push(data_withdraw.length);

                    filterConditions = {
                        status_academic:11,
                        cur_intake:cur_intake
                    }
                    let data_mia = filterData(data_std,filterConditions);
                    total_mia.push(data_mia.length);

                    filterConditions = {
                        status_academic:1,
                        cur_intake:cur_intake
                    }
                    let data_curIntake = filterData(data_std,filterConditions);
                    total_std.push(data_curIntake.length);
                })

                

                option = {
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:[
                            'Withdraw',
                            'Deferred',
                            'Mising In Action',
                            // 'Active'
                        ]
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : intake
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        // {
                        //     name:'Active',
                        //     type:'line',
                        //     smooth:true,
                        //     itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        //     data:total_std
                        // },
                        {
                            name:'Deferred',
                            type:'line',
                            smooth:true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data:total_deferred
                        },
                        {
                            name:'Withdraw',
                            type:'line',
                            smooth:true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data:total_withdraw
                        },
                        {
                            name:'Mising In Action',
                            type:'line',
                            smooth:true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data:total_mia
                        }
                    ]
                };

                bar.setOption(option);

                let columns = [
                    { "name": "bil", "title": "No." },
                    { "name": "std_studentid", "title": "Student ID" },
                    { "name": "sti_name", "title": "Name"},
                    { "name": "sti_icno", "title": "Identity No", "breakpoints": "md sm xs" },
                    { "name": "cur_intake", "title": "Intake", "breakpoints": "md sm xs" },
                    { "name": "std_semester", "title": "Semester", "breakpoints": "md sm xs" },
                    { "name": "sti_gender", "title": "Gender", "breakpoints": "md sm xs"  },
                ];
        
                $(".btn_activeStd").click(function(){
                    $("#list_std").modal('show');
                    $(".header_list").html('Active Registered '+cur_year.replace('/','')+"/"+cal_cohort);
                    let list = [];
                    let bil = 1;
                    $("#tblStd_list").html('');
                    data_std.forEach(async (item) => {
                        let gender = "Male";
                        if(item.sti_gender == "P"){
                            gender = "Female"
                        }
                        list.push({
                            bil: bil++, "std_studentid":item.std_studentid,"sti_name":item.sti_name,"sti_icno":item.sti_icno,
                            "cur_intake":item.cur_intake,"sti_gender":gender,"std_semester":item.std_semester
                        });
                    });
        
                    $("#tblStd_list").footable({
                        "columns": columns,
                        "rows": list,
                        "paging": {
                            "enabled": true,
                            "size": 10
                        },
                        "filtering": {
                            "enabled": true,
                            "placeholder": "Search...",
                            "dropdownTitle": "Search for:"
                        }
                    });
        
                });
        
                $(".btn_activeGrad").click(function(){
                    $("#list_std").modal('show');
                    $(".header_list").html('Graduation '+cur_year.replace('/','')+"/"+cal_cohort);
                    let list = [];
                    let bil = 1;
                    $("#tblStd_list").html('');
                    data_grad.forEach(async (item) => {
                        let gender = "Male";
                        if(item.sti_gender == "P"){
                            gender = "Female"
                        }
                        list.push({
                            bil: bil++, "std_studentid":item.std_studentid,"sti_name":item.sti_name,"sti_icno":item.sti_icno,
                            "cur_intake":item.cur_intake,"sti_gender":gender,"std_semester":item.std_semester
                        });
                    });
        
                    $("#tblStd_list").footable({
                        "columns": columns,
                        "rows": list,
                        "paging": {
                            "enabled": true,
                            "size": 10
                        },
                        "filtering": {
                            "enabled": true,
                            "placeholder": "Search...",
                            "dropdownTitle": "Search for:"
                        }
                    });
        
                });

            }
            else{
                data_std = [];
            }
            resolve();
        }, Math.random()*1000);
        
        
    })
    
}

async function intakeList(cur_year,cal_cohort){
    let form = new FormData();
    form.append('cur_year',cur_year);
    form.append('cal_cohort',cal_cohort);

    return new Promise(resolve =>{
        let obj = new post(host+'api_tetapan_picoms/public/intake/list',form,'picoms '+window.sessionStorage.token).execute();
        if(obj.success){
            data_intake = obj.data;
        }
        resolve();
    })
}

async function month(){
    return new Promise(resolve =>{
        let obj = new get(host+'api_tetapan_picoms/public/misPrmCalendar/listActive2','picoms '+window.sessionStorage.token).execute();
        if(obj.success){
            let data = obj.data;
            data.forEach(async (item,i) => {
                let cy = item.cur_year;
                let cc = item.cal_cohort;

                if(i == 0){
                    cur_year = item.cur_year;
                    cal_cohort = item.cal_cohort;
                    $(".session_academic").html(cur_year.replace('/','')+'/'+item.cal_cohort);
                    $(".new_intake").html(cur_year.replace('/','')+'/'+item.cal_cohort);
                }
                $("#month_select").append(`<option cal_cohort="`+cc+`" value="`+cy+`">`+cy.replace('/','')+'/'+cc+`</option>`);                
            });

            $.fn.select2.defaults.set("theme", "bootstrap");

            $('.slct2').select2({
                width: null,
                containerCssClass: ':all:'
            });
        }
        else{
            logOut();
        }
        resolve();            
    })
}

$("#month_select").change(function(){
    cur_year = $("#month_select").val();
    cal_cohort = $("#month_select option:selected").attr("cal_cohort");

    $(".session_academic").html(cur_year.replace('/','')+'/'+cal_cohort);

    Promise.all(
        [
            intakeList(cur_year,cal_cohort),
            stdList(cur_year,cal_cohort),
            loading_hide()
        ]
    );
});

async function loading_hide(){
    return new Promise(resolve =>{
        setTimeout(() => {
            $("#loading_mode").modal('hide');
        }, Math.random()*1000);

        resolve();
    });
}

function filterData(data, conditions) {
    return data.filter(item => {
      for (const key in conditions) {
        if (item[key] != conditions[key]) {
          return false; // If any condition doesn't match, exclude the item
        }
      }
      return true; // All conditions matched, include the item
    });
  }

  function sortByMonth(a,b) {
    var months = ["JAN", "FEB", "MAC", "APR", "MAY", "JUN",
                "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    month_a = months.indexOf(a.intake_name);
    month_b = months.indexOf(b.intake_name);

    year_a = a.intake_year;
    year_b = b.intake_year;

    if (month_a < month_b && year_a <= year_b) {
        return -1;
    }
    if (month_a > month_b && year_a >= year_b) {
        return 1;
    }
    return 0;
  }


  var confirmed = false;

function formatDate(date){
    let newDate = '';
    if(date){
        let arrayDate = date.split("-");
        newDate = arrayDate[2]+'/'+arrayDate[1]+'/'+arrayDate[0];
    }
    else{ newDate = ''; }

    return newDate;
}

function announcementList(returnValue){
    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmTakwim/list",
        "method": "POST",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response){
        obj_announcement = response;
        returnValue();
    });
}


//-------------------------------------------------- add announcement --------------------------------------------------//
$('#formAddAnnouncement').on('submit', function(e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Add Announcement",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            // let attachment = $('#attachment').val();
            // let attachment = $('#attachment').val();
            let attachment = $("#attachment")[0].files[0];
            let twm_title = $('#twm_title').val();
            let twm_description = $('#twm_description').val();
            let twm_sdate = $('#twm_sdate').val();
            let twm_edate = $('#twm_edate').val();
            let status = $('#status').val();

            var form = new FormData();
            form.append("twm_title", twm_title);
            form.append("twm_description", twm_description);
            form.append("twm_sdate", twm_sdate);
            form.append("twm_edate", twm_edate);
            form.append("attachment", attachment);
            form.append("twm_status", status);
            form.append("recordstatus", 'ADD');

            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmTakwim/register",
                "method": "POST",
                "timeout": 0,
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
//-------------------------------------------------- end add announcement --------------------------------------------------//


// load data announcement
function loadData(indexs){
    let data = JSON.parse($("#dataList").val());
    $('#upt_twm_id').val(data[indexs].twm_id);
    $('#upt_twm_title').val(data[indexs].twm_title);
    $('#upt_twm_description').val(data[indexs].twm_description);
    $('#upt_twm_sdate').val(data[indexs].twm_sdate);
    $('#upt_twm_edate').val(data[indexs].twm_edate);
    $('#attachment_upt').val(data[indexs].attachment);
    $('#upt_twm_status').val(data[indexs].twm_status);    

    $("#update-takwim").modal("show");
}


//-------------------------------------------------- update announcement --------------------------------------------------//
$("#formUptAnnouncement").on('submit', function (e){
    if(!confirmed){
        e.preventDefault();
        swal({
            title: "Update Calendar",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            let upt_twm_id = $("#upt_twm_id").val();
            let upt_twm_title = $("#upt_twm_title").val();
            let upt_twm_description = $("#upt_twm_description").val();
            let upt_twm_sdate = $("#upt_twm_sdate").val();
            let upt_twm_edate = $("#upt_twm_edate").val();
            let attachment_upt = $("#attachment_upt").val();
            let upt_twm_status = $("#upt_twm_status").val();
            let statusrekod = "EDT";
            // let upt_year = upt_twm_sdate.substring(0,4);

            var form = new FormData();
            form.append("twm_id", upt_twm_id);
            form.append("twm_title", upt_twm_title);
            form.append("twm_description", upt_twm_description);
            form.append("twm_sdate", upt_twm_sdate);
            form.append("twm_edate", upt_twm_edate);
            form.append("attachment", attachment_upt);
            form.append("twm_status", upt_twm_status);
            form.append("recordstatus", statusrekod);
    
            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmTakwim/update",
                "method": "POST",
                "timeout": 0,
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
//-------------------------------------------------- end update announcement --------------------------------------------------//


// delete announcement
function del_rekod(id){
    let statusrekod = 'DEL';
    let twm_id = id;

    var form = new FormData();
    form.append("recordstatus", statusrekod);
    form.append("twm_id", twm_id);

    swal({
        title: "Remove Calendar",
        text: "Are You Sure?",
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Remove",
        confirmButtonColor: "#ef193c",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false
    }).then(function (){
        var settings = {
            "url": host+"api_tetapan_picoms/public/misPrmTakwim/delete",
            "method": "POST",
            "timeout": 0,
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


//-------------------------------------------------- end date & start date validation --------------------------------------------------//
$("#upt_twm_edate").change(function(){
    let upt_twm_sdate = new Date($("#upt_twm_sdate").val());
    let upt_twm_edate = new Date($("#upt_twm_edate").val());
    
    if ((upt_twm_edate - upt_twm_sdate) < 0){
        alert('Invalid Date Range');
        $("#upt_twm_edate").val('');
    }
});

$("#upt_twm_sdate").change(function(){
    let upt_twm_sdate = new Date($("#upt_twm_sdate").val());
    let upt_twm_edate = new Date($("#upt_twm_edate").val());
    
    if ((upt_twm_sdate - upt_twm_edate ) > 0){
        alert('Invalid Date Range');
        $("#upt_twm_sdate").val('');
    }
});

$("#twm_edate").change(function(){
    let twm_sdate = new Date($("#twm_sdate").val());
    let twm_edate = new Date($("#twm_edate").val());
    
    if ((twm_edate - twm_sdate) < 0){
        alert('Invalid Date Range');
        $("#twm_edate").val('');
    }
});

$("#twm_sdate").change(function(){
    let twm_sdate = new Date($("#twm_sdate").val());
    let twm_edate = new Date($("#twm_edate").val());
    
    if ((twm_sdate - twm_edate ) > 0){
        alert('Invalid Date Range');
        $("#twm_sdate").val('');
    }
});
//-------------------------------------------------- end date & start date validation --------------------------------------------------//

function statusList(returnValue){
    var settingsAPI = {
        "url": host+"api_tetapan_picoms/public/status/list",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": 'picoms '+window.sessionStorage.token
          },
    };

    $.ajax(settingsAPI).done(function (response){
        obj_status = response;
        returnValue();
    });
}
