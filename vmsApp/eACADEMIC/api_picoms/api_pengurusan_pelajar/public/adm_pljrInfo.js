

var viewProgram = function () {

    //Dropdown Program
    var settings = {
        "url": host+"api_tetapan_picoms/public/programmeList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };

    $.ajax(settings).done(function (response) {
        //LIST OPTION
        $('#pgm_id').append($('<option>', { 
            value: "",
            text : "Choose Programme" 
        }));
        $.each(response.data, function (i, item) {
            $('#pgm_id').append($('<option>', { 
                value: item.pgm_id,
                text : item.pgm_name 
            }));
        });

        //LIST OPTION
        $('#upt_pgm_id').append($('<option>', { 
            value: "",
            text : "Choose Programme" 
        }));
        $.each(response.data, function (i, item) {
            $('#upt_pgm_id').append($('<option>', { 
                value: item.pgm_id,
                text : item.pgm_name 
            }));
        });

        //LIST OPTION
        $('#upt_programmeSelected').append($('<option>', { 
            value: "",
            text : "Choose Programme" 
        }));
        $.each(response.data, function (i, item) {
            $('#upt_programmeSelected').append($('<option>', { 
                value: item.pgm_id,
                text : item.pgm_name 
            }));
        });
        
    });

    //Dropdown Course
    var settings = {
        "url": host+"api_tetapan_picoms/public/courseList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };

    $.ajax(settings).done(function (response) {
        //LIST OPTION
        $('#crs_code').append($('<option>', { 
            value: "",
            text : "Choose Course" 
        }));
        $.each(response.data, function (i, item) {
            $('#crs_code').append($('<option>', { 
                value: item.crs_code,
                text : item.crs_name 
            }));
        });

        //LIST OPTION
        $('#upt_crs_code').append($('<option>', { 
            value: "",
            text : "Choose Gender" 
        }));
        $.each(response.data, function (i, item) {
            $('#upt_crs_code').append($('<option>', { 
                value: item.crs_code,
                text : item.crs_name 
            }));
        });

        //LIST OPTION
        $('#upt_courseSelected').append($('<option>', { 
            value: "",
            text : "Choose Course" 
        }));
        $.each(response.data, function (i, item) {
            $('#upt_courseSelected').append($('<option>', { 
                value: item.crs_code,
                text : item.crs_name  
            }));
        });
        
    });


    //Dropdown Gender
    var settings = {
        "url": host+"api_public_access/public/genderList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };

    $.ajax(settings).done(function (response) {
        //LIST OPTION
        $('#sti_gender').append($('<option>', { 
            value: "",
            text : "Choose Gender" 
        }));
        $.each(response.data, function (i, item) {
            $('#sti_gender').append($('<option>', { 
                value: item.sti_gender_id,
                text : item.sti_gender_name 
            }));
        });

        //LIST OPTION
        $('#upt_sti_gender').append($('<option>', { 
            value: "",
            text : "Choose Gender" 
        }));
        $.each(response.data, function (i, item) {
            $('#upt_sti_gender').append($('<option>', { 
                value: item.sti_gender_id,
                text : item.sti_gender_name 
            }));
        });
        
    });
    
    //Dropdown Nationality
    var settings = {
        "url": host+"api_public_access/public/nationalityList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };

    $.ajax(settings).done(function (response) {
        //LIST OPTION
        $('#sti_nationality').append($('<option>', { 
            value: "",
            text : "Choose Nationality" 
        }));
        $.each(response.data, function (i, item) {
            $('#sti_nationality').append($('<option>', { 
                value: item.sti_nationality_id,
                text : item.sti_nationality_name 
            }));
        });

        //LIST OPTION
        $('#upt_sti_nationality').append($('<option>', { 
            value: "",
            text : "Choose Nationality" 
        }));
        $.each(response.data, function (i, item) {
            $('#upt_sti_nationality').append($('<option>', { 
                value: item.sti_nationality_id,
                text : item.sti_nationality_name 
            }));
        });
        
    });

    //Dropdown Race
    var settings = {
        "url": host+"api_public_access/public/raceList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };

    $.ajax(settings).done(function (response) {
        //LIST OPTION
        $('#sti_race').append($('<option>', { 
            value: "",
            text : "Choose Race" 
        }));
        $.each(response.data, function (i, item) {
            $('#sti_race').append($('<option>', { 
                value: item.sti_race_id,
                text : item.sti_race_name 
            }));
        });

        //LIST OPTION
        $('#upt_sti_race').append($('<option>', { 
            value: "",
            text : "Choose Race" 
        }));
        $.each(response.data, function (i, item) {
            $('#upt_sti_race').append($('<option>', { 
                value: item.sti_race_id,
                text : item.sti_race_name 
            }));
        });
        
    });

    //Dropdown Native
    var settings = {
        "url": host+"api_public_access/public/nativeList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };

    $.ajax(settings).done(function (response) {
        //LIST OPTION
        $('#sti_status_bumiputra').append($('<option>', { 
            value: "",
            text : "Choose Native" 
        }));
        $.each(response.data, function (i, item) {
            $('#sti_status_bumiputra').append($('<option>', { 
                value: item.sti_native_id,
                text : item.sti_native_name 
            }));
        });

        //LIST OPTION
        $('#upt_sti_status_bumiputra').append($('<option>', { 
            value: "",
            text : "Choose Native" 
        }));
        $.each(response.data, function (i, item) {
            $('#upt_sti_status_bumiputra').append($('<option>', { 
                value: item.sti_native_id,
                text : item.sti_native_name 
            }));
        });
        
    });

    //Dropdown Religion
    var settings = {
        "url": host+"api_public_access/public/religionList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };

    $.ajax(settings).done(function (response) {
        //LIST OPTION
        $('#sti_religion').append($('<option>', { 
            value: "",
            text : "Choose Religion" 
        }));
        $.each(response.data, function (i, item) {
            $('#sti_religion').append($('<option>', { 
                value: item.sti_religion_id,
                text : item.sti_religion_name 
            }));
        });

        //LIST OPTION
        $('#upt_sti_religion').append($('<option>', { 
            value: "",
            text : "Choose Religion" 
        }));
        $.each(response.data, function (i, item) {
            $('#upt_sti_religion').append($('<option>', { 
                value: item.sti_religion_id,
                text : item.sti_religion_name 
            }));
        });
        
    });

    //Dropdown OKU
    var settings = {
        "url": host+"api_public_access/public/okuList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };

    $.ajax(settings).done(function (response) {
        //LIST OPTION
        $('#sti_status_oku').append($('<option>', { 
            value: "",
            text : "Choose Handicap Status" 
        }));
        $.each(response.data, function (i, item) {
            $('#sti_status_oku').append($('<option>', { 
                value: item.sti_status_oku_id,
                text : item.sti_status_oku_name 
            }));
        });

        //LIST OPTION
        $('#upt_sti_status_oku').append($('<option>', { 
            value: "",
            text : "Choose Handicap Status" 
        }));
        $.each(response.data, function (i, item) {
            $('#upt_sti_status_oku').append($('<option>', { 
                value: item.sti_status_oku_id,
                text : item.sti_status_oku_name 
            }));
        });
        
    });

    //Dropdown BloodType
    var settings = {
        "url": host+"api_public_access/public/bloodTypeList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };

    $.ajax(settings).done(function (response) {
        //LIST OPTION
        $('#sti_blood_type').append($('<option>', { 
            value: "",
            text : "Choose Blood Type" 
        }));
        $.each(response.data, function (i, item) {
            $('#sti_blood_type').append($('<option>', { 
                value: item.sti_blood_type_id,
                text : item.sti_blood_type_name 
            }));
        });

        //LIST OPTION
        $('#upt_sti_blood_type').append($('<option>', { 
            value: "",
            text : "Choose Blood Type" 
        }));
        $.each(response.data, function (i, item) {
            $('#upt_sti_blood_type').append($('<option>', { 
                value: item.sti_blood_type_id,
                text : item.sti_blood_type_name 
            }));
        });
        
    });

    //Dropdown State
    var settings = {
        "url": host+"api_public_access/public/negeriList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };

    $.ajax(settings).done(function (response) {
        //LIST OPTION
        $('#sti_state').append($('<option>', { 
            value: "",
            text : "Choose State" 
        }));
        $.each(response.data, function (i, item) {
            $('#sti_state').append($('<option>', { 
                value: item.kod,
                text : item.ringkasan 
            }));
        });

        //LIST OPTION
        $('#upt_sti_state').append($('<option>', { 
            value: "",
            text : "Choose State" 
        }));
        $.each(response.data, function (i, item) {
            $('#upt_sti_state').append($('<option>', { 
                value: item.kod,
                text : item.ringkasan 
            }));
        });
        
    });

    //Dropdown Payment Via
    var settings = {
        "url": host+"api_public_access/public/paymentViaList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };

    $.ajax(settings).done(function (response) {
        //LIST OPTION
        $('#srg_payment_via').append($('<option>', { 
            value: "",
            text : "Choose Payment Via" 
        }));
        $.each(response.data, function (i, item) {
            $('#srg_payment_via').append($('<option>', { 
                value: item.srg_payment_via_code,
                text : item.srg_payment_via_name_en 
            }));
        });

        //LIST OPTION
        $('#upt_srg_payment_via').append($('<option>', { 
            value: "",
            text : "Choose Payment Via" 
        }));
        $.each(response.data, function (i, item) {
            $('#upt_srg_payment_via').append($('<option>', { 
                value: item.srg_payment_via_code,
                text : item.srg_payment_via_name_en 
            }));
        });
        
    });

    //Dropdown Muet
    var settings = {
        "url": host+"api_public_access/public/muetList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };

    $.ajax(settings).done(function (response) {
        //LIST OPTION
        $('#sta_muet').append($('<option>', { 
            value: "",
            text : "Choose Muet" 
        }));
        $.each(response.data, function (i, item) {
            $('#sta_muet').append($('<option>', { 
                value: item.sta_muet_name,
                text : item.sta_muet_name 
            }));
        });

        //LIST OPTION
        $('#upt_sta_muet').append($('<option>', { 
            value: "",
            text : "Choose Muet" 
        }));
        $.each(response.data, function (i, item) {
            $('#upt_sta_muet').append($('<option>', { 
                value: item.sta_muet_name,
                text : item.sta_muet_name 
            }));
        });
        
    });

    //Dropdown Grade
    var settings = {
        "url": host+"api_public_access/public/gradeList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };

    $.ajax(settings).done(function (response) {
        //LIST OPTION SPM
        $('#sta_bm_spm').append($('<option>', { 
            value: "",
            text : "Choose Grade" 
        }));
        $.each(response.data, function (i, item) {
            $('#sta_bm_spm').append($('<option>', { 
                value: item.grade_name,
                text : item.grade_name 
            }));
        });

        //LIST OPTION
        $('#upt_sta_bm_spm').append($('<option>', { 
            value: "",
            text : "Choose Grade" 
        }));
        $.each(response.data, function (i, item) {
            $('#upt_sta_bm_spm').append($('<option>', { 
                value: item.grade_name,
                text : item.grade_name 
            }));
        });

        //LIST OPTION STPM
        $('#sta_bm_stpm').append($('<option>', { 
            value: "",
            text : "Choose Grade" 
        }));
        $.each(response.data, function (i, item) {
            $('#sta_bm_stpm').append($('<option>', { 
                value: item.grade_name,
                text : item.grade_name 
            }));
        });

        //LIST OPTION
        $('#upt_sta_bm_stpm').append($('<option>', { 
            value: "",
            text : "Choose Grade" 
        }));
        $.each(response.data, function (i, item) {
            $('#upt_sta_bm_stpm').append($('<option>', { 
                value: item.grade_name,
                text : item.grade_name 
            }));
        });
        
    });

    //Dropdown Status
    var settings = {
        "url": host+"api_public_access/public/statusList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };

    $.ajax(settings).done(function (response) {
        //LIST OPTION
        $('#sts_status').append($('<option>', { 
            value: "",
            text : "Choose Status" 
        }));
        $.each(response.data, function (i, item) {
            $('#sts_status').append($('<option>', { 
                value: item.sts_status_code,
                text : item.sts_status_name_en 
            }));
        });

        //LIST OPTION
        $('#upt_sts_status').append($('<option>', { 
            value: "",
            text : "Choose Status" 
        }));
        $.each(response.data, function (i, item) {
            $('#upt_sts_status').append($('<option>', { 
                value: item.sts_status_code,
                text : item.sts_status_name_en 
            }));
        });
        
    });

    //Dropdown Parents Status
    var settings = {
        "url": host+"api_public_access/public/parentList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };

    $.ajax(settings).done(function (response) {
        //LIST OPTION
        $('#par_parent_relation').append($('<option>', { 
            value: "",
            text : "Choose Parental Relationship" 
        }));
        $.each(response.data, function (i, item) {
            $('#par_parent_relation').append($('<option>', { 
                value: item.sts_par_relation_name_ms,
                text : item.sts_par_relation_name_en 
            }));
        });

        //LIST OPTION
        $('#upt_par_parent_relation').append($('<option>', { 
            value: "",
            text : "Choose Parental Relationship" 
        }));
        $.each(response.data, function (i, item) {
            $('#upt_par_parent_relation').append($('<option>', { 
                value: item.sts_par_relation_name_ms,
                text : item.sts_par_relation_name_en  
            }));
        });
        
    });

    //Dropdown Living With
    var settings = {
        "url": host+"api_public_access/public/livingList",
        "method": "GET",
        "timeout": 0,
        // "header":{
        //     "Authentication": "ASDCM"+window.sessionStorage.token
        //   }
      };

    $.ajax(settings).done(function (response) {
        //LIST OPTION
        $('#par_living_with').append($('<option>', { 
            value: "",
            text : "Choose Living With" 
        }));
        $.each(response.data, function (i, item) {
            $('#par_living_with').append($('<option>', { 
                value: item.sts_living_with_name_ms,
                text : item.sts_living_with_name_en 
            }));
        });

        //LIST OPTION
        $('#upt_par_living_with').append($('<option>', { 
            value: "",
            text : "Choose Living With" 
        }));
        $.each(response.data, function (i, item) {
            $('#upt_par_living_with').append($('<option>', { 
                value: item.sts_living_with_name_ms,
                text : item.sts_living_with_name_en  
            }));
        });
        
    });
    
    var columns = [
        { "name": "bil", "title": "No." },
        { "name": "std_studentid", "title": "Student ID"},
        { "name": "sti_name", "title": "Name", "breakpoints": "md sm xs" },
        { "name": "sti_icno", "title": "IC No." },
        { "name": "pgm_name", "title": "Programme" },
        { "name": "sts_semester", "title": "Semester" },
        { "name": "sts_status", "title": "Status" },
        { "name": "upt_btn", "title": "Action"},
    ];
    var settings = {
        "url": host+"api_pengurusan_pelajar/public/studentInfoList",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        let bil = 1;
        let convertList = JSON.stringify(response.data);
        $("#dataList").val(convertList);
        console.log(response)
        var list = [];

        $.each(response.data, function (i, field) {

            list.push({
                bil: bil++, std_studentid: field.std_studentid, sti_name: field.sti_name, 
                sti_icno: field.sti_icno, pgm_name: field.pgm_name, sts_semester: field.sts_semester, sts_status: field.sts_status_name_en,
                "upt_btn": '<button class="btn success" title="Update" onclick="loadData(\'' + i + '\')" data-ui-toggle-class="zoom" data-ui-target="#animate"><i class="ion-android-create"></i></button>' +
                // ' <button class="btn accent" title="Details" onclick="detail(\'' + field.std_studentid + '\',\'' + i + '\')" id="btnPerincian"><i class="ion-ios-list-outline"></i></button>'+
                ' <button class="btn danger" onclick="del(\''+field.std_studentid+'\')" title="Remove"><i class="ion-trash-b"></i>'
            });
            
        });

        $("#tableStudent").footable({
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
};

const programList = document.querySelector("#listStudent");
ko.applyBindings(new viewProgram(), programList);


function selectProgramme(selectedInput,param){

    var selectedValue = selectedInput.value;

    var form = new FormData();

    if(param == 'programme'){
        form.append("pgm_id", selectedValue);

        var settings1 = {
        "url": host+"api_tetapan_picoms/public/programme/"+selectedValue,
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
        };
    
        $.ajax(settings1).done(function (response) {
            result = JSON.parse(response);
            $('#programmeSelected').empty();
                $.each(result.data, function (i, item) {
                    $('#programmeSelected').append($('<option>', { 
                        value: item.pgm_id,
                        text : item.pgm_name 
                    }));
                });
            });


        var settings2 = {
        "url": host+"api_tetapan_picoms/public/curyear/selected/"+selectedValue,
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
        };
    
        $.ajax(settings2).done(function (response) {

            result = JSON.parse(response);

            //LIST OPTION CURR YEAR
            $('#sts_cur_year').empty();
            $('#sts_cur_year').append($('<option>', { 
                value: "",
                text : "Choose Session" 
            }));
            $.each(result.data, function (i, item) {
                $('#sts_cur_year').append($('<option>', { 
                    value: item.cur_year,
                    text : item.cur_year 
                }));
            });

            //LIST OPTION CURR YEAR UPDATE
            $('#upt_sts_cur_year').empty();
            $('#upt_sts_cur_year').append($('<option>', { 
                value: "",
                text : "Choose Session" 
            }));
            $.each(result.data, function (i, item) {
                $('#upt_sts_cur_year').append($('<option>', { 
                    value: item.cur_year,
                    text : item.cur_year 
                }));
            });

            //LIST OPTION CURR INTAKE
            $('#sts_cur_intake').empty();
            $('#sts_cur_intake').append($('<option>', { 
                value: "",
                text : "Choose Intake" 
            }));
            $.each(result.data, function (i, item) {
                $('#sts_cur_intake').append($('<option>', { 
                    value: item.cur_intake,
                    text : item.cur_intake 
                }));
            });

            //LIST OPTION CURR INTAKE
            $('#upt_sts_cur_intake').empty();
            $('#upt_sts_cur_intake').append($('<option>', { 
                value: "",
                text : "Choose Intake" 
            }));
            $.each(result.data, function (i, item) {
                $('#upt_sts_cur_intake').append($('<option>', { 
                    value: item.cur_intake,
                    text : item.cur_intake 
                }));
            });

            //LIST OPTION CURR SEMESTER
            $('#sts_semester').empty();
            $('#sts_semester').append($('<option>', { 
                value: "",
                text : "Choose Semester" 
            }));
            $.each(result.data, function (i, item) {
                $('#sts_semester').append($('<option>', { 
                    value: item.cur_semester,
                    text : item.cur_semester 
                }));
            });

            //LIST OPTION CURR YEAR SEMESTER
            $('#upt_sts_semester').empty();
            $('#upt_sts_semester').append($('<option>', { 
                value: "",
                text : "Choose Semester" 
            }));
            $.each(result.data, function (i, item) {
                $('#upt_sts_semester').append($('<option>', { 
                    value: item.cur_semester,
                    text : item.cur_semester 
                }));
            });
        });


    }else if(param == 'course'){
        form.append("crs_code", selectedValue);

        var settings = {
        "url": host+"api_tetapan_picoms/public/course/"+selectedValue,
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
        };
    
        $.ajax(settings).done(function (response) {
            result = JSON.parse(response);
        $('#courseSelected').empty();
            $.each(result.data, function (i, item) {
                $('#courseSelected').append($('<option>', { 
                    value: item.crs_code,
                    text : item.crs_name 
                }));
            });

        $('#upt_courseSelected').empty();
        $.each(result.data, function (i, item) {
            $('#upt_courseSelected').append($('<option>', { 
                value: item.crs_code,
                text : item.crs_name 
            }));
        });
        });
    }
    
    
}


function loadData(indexs){   


    


    let data = JSON.parse($("#dataList").val());
    let pgm_id = data[indexs].pgm_id;

    var form = new FormData();
    form.append("pgm_id", pgm_id);

    var settings2 = {
        "url": host+"api_tetapan_picoms/public/curyear/selected/"+pgm_id,
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
        };
    
        $.ajax(settings2).done(function (response) {

        result = JSON.parse(response);

        
        //LIST OPTION CURR YEAR UPDATE
        $('#upt_sts_cur_year').empty();
        $('#upt_sts_cur_year').append($('<option>', { 
            value: "",
            text : "Choose Session" 
        }));
        $.each(result.data, function (i, item) {
            $('#upt_sts_cur_year').append($('<option>', { 
                value: item.cur_year,
                text : item.cur_year 
            }));

        });

        $('#upt_sts_cur_year').val(data[indexs].sts_cur_year);

        //LIST OPTION CURR INTAKE
        $('#sts_cur_intake').empty();
        $('#sts_cur_intake').append($('<option>', { 
            value: "",
            text : "Choose Intake" 
        }));
        $.each(result.data, function (i, item) {
            $('#sts_cur_intake').append($('<option>', { 
                value: item.cur_intake,
                text : item.cur_intake 
            }));

        });

        //LIST OPTION CURR INTAKE
        $('#upt_sts_cur_intake').empty();
        $('#upt_sts_cur_intake').append($('<option>', { 
            value: "",
            text : "Choose Intake" 
        }));
        $.each(result.data, function (i, item) {
            $('#upt_sts_cur_intake').append($('<option>', { 
                value: item.cur_intake,
                text : item.cur_intake 
            }));
        });

        $('#upt_sts_cur_intake').val(data[indexs].sts_cur_intake);

        //LIST OPTION CURR SEMESTER
        $('#sts_semester').empty();
        $('#sts_semester').append($('<option>', { 
            value: "",
            text : "Choose Semester" 
        }));
        $.each(result.data, function (i, item) {
            $('#sts_semester').append($('<option>', { 
                value: item.cur_semester,
                text : item.cur_semester 
            }));
        });

        //LIST OPTION CURR YEAR SEMESTER
        $('#upt_sts_semester').empty();
        $('#upt_sts_semester').append($('<option>', { 
            value: "",
            text : "Choose Semester" 
        }));
        $.each(result.data, function (i, item) {
            $('#upt_sts_semester').append($('<option>', { 
                value: item.cur_semester,
                text : item.cur_semester 
            }));
        });

        $('#upt_sts_semester').val(data[indexs].sts_semester);

    });

    //DEFAULT PROFILE
    let profile_pic = data[indexs].sti_image;
    
    if(profile_pic == ''){
        $('#upt_sti_image_img').addClass('hidden');
        $('#nopic').removeClass('hidden');
        $('#upt_sti_image').removeClass('hidden');
        $('#upt_sti_image_del_btn').addClass('hidden');
    }else{
        $('#upt_sti_image').addClass('hidden');
        $('#nopic').addClass('hidden');
        $('#upt_sti_image_img').removeClass('hidden');
        $('#upt_sti_image_del_btn').removeClass('hidden');
        $('#upt_sti_image_img').attr("src", 'data:image/jpg;base64,'+profile_pic);
        
    }
    

    $('#upt_std_studentid').val(data[indexs].std_studentid);
    $('#upt_sti_name').val(data[indexs].sti_name);
    $('#upt_sti_icno').val(data[indexs].sti_icno);
    $('#upt_pgm_id').val(data[indexs].pgm_id);
    $('#upt_crs_code').val(data[indexs].crs_code);
    $('#upt_sti_gender').val(data[indexs].sti_gender);
    $('#upt_sti_nationality').val(data[indexs].sti_nationality);
    $('#upt_sti_race').val(data[indexs].sti_race);
    $('#upt_sti_status_bumiputra').val(data[indexs].sti_status_bumiputra);
    $('#upt_sti_religion').val(data[indexs].sti_religion);
    $('#upt_sti_status_oku').val(data[indexs].sti_status_oku);
    $('#upt_sti_blood_type').val(data[indexs].sti_blood_type);
    $('#upt_sti_email').val(data[indexs].sti_email);
    $('#upt_sti_address_1').val(data[indexs].sti_address_1);
    $('#upt_sti_address_2').val(data[indexs].sti_address_2);
    $('#upt_sti_address_3').val(data[indexs].sti_address_3);
    $('#upt_sti_postcode').val(data[indexs].sti_postcode);
    $('#upt_sti_state').val(data[indexs].sti_state);
    $('#upt_sti_contactno_home').val(data[indexs].sti_contactno_home);
    $('#upt_sti_contactno_mobile').val(data[indexs].sti_contactno_mobile);
    $('#upt_sti_bank_id').val(data[indexs].sti_bank_id);
    $('#upt_sti_bank_accountno').val(data[indexs].sti_bank_accountno);

    $('#upt_par_father_name').val(data[indexs].par_father_name);
    // $('#upt_par_father_icno').val(data[indexs].par_father_icno);
    $('#upt_par_father_address').val(data[indexs].par_father_address);
    $('#upt_par_father_contactno').val(data[indexs].par_father_contactno);
    $('#upt_par_father_occupation').val(data[indexs].par_father_occupation);
    $('#upt_par_nextofkin').val(data[indexs].par_nextofkin);
    $('#upt_par_kin_address').val(data[indexs].par_kin_address);
    $('#upt_par_kin_contactno').val(data[indexs].par_kin_contactno);
    $('#upt_par_mother_name').val(data[indexs].par_mother_name);
    // $('#upt_par_mother_icno').val(data[indexs].par_mother_icno);
    $('#upt_par_mother_address').val(data[indexs].par_mother_address);
    $('#upt_par_mother_contactno').val(data[indexs].par_mother_contactno);
    $('#upt_par_mother_occupation').val(data[indexs].par_mother_occupation);
    $('#upt_par_parent_relation').val(data[indexs].par_parent_relation);
    $('#upt_par_family_income').val(data[indexs].par_family_income);
    $('#upt_par_family_responsibility').val(data[indexs].par_family_responsibility);
    $('#upt_par_living_with').val(data[indexs].par_living_with);

    $('#upt_srg_payment_via').val(data[indexs].srg_payment_via);
    $('#upt_srg_payment_resit').val(data[indexs].srg_payment_resit);

    //DEFAULT RECEIPT
    let receipt = data[indexs].srg_payment_resitdoc;
    if(receipt == ''){
        $('#upt_srg_payment_resitdoc').removeClass('hidden');
        $('#upt_srg_payment_resitdoc_del_btn').addClass('hidden');
        $('#upt_srg_payment_resitdoc_download').addClass('hidden');
    }else{
        $('#upt_srg_payment_resitdoc').addClass('hidden');
        $('#upt_srg_payment_resitdoc_del_btn').removeClass('hidden');
        $('#upt_srg_payment_resitdoc_download').removeClass('hidden');

        $('#upt_srg_payment_resitdoc_download').attr("href", '../api_pengurusan_pelajar/public/resit/'+data[indexs].srg_payment_resitdoc);
    }


    $('#upt_sta_muet').val(data[indexs].sta_muet);
    $('#upt_sta_bm_spm').val(data[indexs].sta_bm_spm);
    $('#upt_sta_bm_stpm').val(data[indexs].sta_bm_stpm);
    $('#upt_programmeSelected').val(data[indexs].pgm_id);
    $('#upt_courseSelected').val(data[indexs].crs_code);


    //DEFAULT CERTIFICATE
    let certificate = data[indexs].sta_cert_doc;
    if(certificate == ''){
        $('#upt_sta_cert_doc').removeClass('hidden');
        $('#upt_sta_cert_doc_del_btn').addClass('hidden');
        $('#upt_sta_cert_doc_download').addClass('hidden');
    }else{
        $('#upt_sta_cert_doc').addClass('hidden');
        $('#upt_sta_cert_doc_del_btn').removeClass('hidden');
        $('#upt_sta_cert_doc_download').removeClass('hidden');

        $('#upt_sta_cert_doc_download').attr("href", '../api_pengurusan_pelajar/public/academic/'+certificate);
    }

    
    //DEFAULT SPM
    let spm = data[indexs].sta_spm_doc;
    if(spm == ''){
        $('#upt_sta_spm_doc').removeClass('hidden');
        $('#upt_sta_spm_doc_del_btn').addClass('hidden');
        $('#upt_sta_spm_doc_download').addClass('hidden');
    }else{
        $('#upt_sta_spm_doc').addClass('hidden');
        $('#upt_sta_spm_doc_del_btn').removeClass('hidden');
        $('#upt_sta_spm_doc_download').removeClass('hidden');

        $('#upt_sta_spm_doc_download').attr("href", '../api_pengurusan_pelajar/public/academic/'+spm);
    }
    

    //DEFAULT STPM
    let stpm = data[indexs].sta_stpm_doc;
    if(stpm == ''){
        $('#upt_sta_stpm_doc').removeClass('hidden');
        $('#upt_sta_stpm_doc_del_btn').addClass('hidden');
        $('#upt_sta_stpm_doc_download').addClass('hidden');
    }else{
        $('#upt_sta_stpm_doc').addClass('hidden');
        $('#upt_sta_stpm_doc_del_btn').removeClass('hidden');
        $('#upt_sta_stpm_doc_download').removeClass('hidden');

        $('#upt_sta_stpm_doc_download').attr("href", '../api_pengurusan_pelajar/public/academic/'+stpm);
    }
    
    
    //DEFAULT DIPLOMA
    let diploma = data[indexs].sta_diploma_doc;
    if(diploma == ''){
        $('#upt_sta_diploma_doc').removeClass('hidden');
        $('#upt_sta_diploma_doc_del_btn').addClass('hidden');
        $('#upt_sta_diploma_doc_download').addClass('hidden');
    }else{
        $('#upt_sta_diploma_doc').addClass('hidden');
        $('#upt_sta_diploma_doc_del_btn').removeClass('hidden');
        $('#upt_sta_diploma_doc_download').removeClass('hidden');

        $('#upt_sta_diploma_doc_download').attr("href", '../api_pengurusan_pelajar/public/academic/'+diploma);
    }


    //DEFAULT DEGREE
    let degree = data[indexs].sta_degree_doc;
    if(degree == ''){
        $('#upt_sta_degree_doc').removeClass('hidden');
        $('#upt_sta_degree_doc_del_btn').addClass('hidden');
        $('#upt_sta_degree_doc_download').addClass('hidden');
    }else{
        $('#upt_sta_degree_doc').addClass('hidden');
        $('#upt_sta_degree_doc_del_btn').removeClass('hidden');
        $('#upt_sta_degree_doc_download').removeClass('hidden');

        $('#upt_sta_degree_doc_download').attr("href", '../api_pengurusan_pelajar/public/academic/'+degree);
    }
    $('#upt_sta_degree_doc_download').attr("href", '../api_pengurusan_pelajar/public/academic/'+data[indexs].sta_degree_doc);
    
    if(data[indexs].sta_cert_doc == ''){
        $('#upt_sta_cert_doc_download').addClass('hidden');
        $('#upt_sta_cert_doc').removeClass('hidden');
    }

    if(data[indexs].sta_spm_doc == ''){
        $('#upt_sta_spm_doc_download').addClass('hidden');
        $('#upt_sta_spm_doc').removeClass('hidden');
    }

    if(data[indexs].sta_stpm_doc == ''){
        $('#upt_sta_stpm_doc_download').addClass('hidden');
        $('#upt_sta_stpm_doc').removeClass('hidden');
    }

    if(data[indexs].sta_diploma_doc == ''){
        $('#upt_sta_diploma_doc_download').addClass('hidden');
        $('#upt_sta_diploma_doc').removeClass('hidden');
    }

    if(data[indexs].sta_degree_doc == ''){
        $('#upt_sta_degree_doc_download').addClass('hidden');
        $('#upt_sta_degree_doc').removeClass('hidden');
    }

    $('#upt_fin_fees').val(data[indexs].fin_fees);
    
    $('#upt_sts_status').val(data[indexs].sts_status);
    $('#upt_sts_date_joined').val(data[indexs].sts_date_joined);
    $('#upt_sts_date_complete').val(data[indexs].sts_date_complete);


    $("#topModal").modal("show");
    
}

var RegisterModel = function () {
    
    
    
    var self = this;

    self.sti_image = ko.observable("").extend({
        required: true
    });

    self.sti_name = ko.observable("").extend({
        required: true,
    });

    self.std_studentid = ko.observable("").extend({
        required: true
    });

    self.sti_icno = ko.observable("").extend({
        required: true
    });

    self.pgm_id = ko.observable("").extend({
        required: true
    });

    self.crs_code = ko.observable("").extend({
        required: true
    });

    self.sti_gender = ko.observable("").extend({
        required: true
    });

    self.sti_nationality = ko.observable("").extend({
        required: true
    });

    self.sti_race = ko.observable("").extend({
        required: true
    });

    self.sti_status_bumiputra = ko.observable("").extend({
        required: true
    });

    self.sti_religion = ko.observable("").extend({
        required: true
    });

    self.sti_status_oku = ko.observable("").extend({
        required: true
    });

    self.sti_blood_type = ko.observable("").extend({
        required: true
    });

    self.sti_email = ko.observable("").extend({
        required: true
    });

    self.sti_address_1 = ko.observable("").extend({
        required: true
    });

    self.sti_address_2 = ko.observable("").extend({
        required: true
    });

    self.sti_address_3 = ko.observable("").extend({
        required: true
    });

    self.sti_postcode = ko.observable("").extend({
        required: true
    });

    self.sti_state = ko.observable("").extend({
        required: true
    });

    self.sti_postcode = ko.observable("").extend({
        required: true
    });

    self.sti_contactno_home = ko.observable("").extend({
        required: true
    });

    self.sti_contactno_mobile = ko.observable("").extend({
        required: true
    });

    self.sti_bank_id = ko.observable("").extend({
        required: true
    });

    self.sti_bank_accountno = ko.observable("").extend({
        required: true
    });



    //DATA PARENTS
    self.par_father_name = ko.observable("").extend({
        required: true
    });

    self.par_father_name = ko.observable("").extend({
        required: true
    });

    // self.par_father_icno = ko.observable("").extend({
    //     required: true
    // });

    self.par_father_address = ko.observable("").extend({
        required: true
    });

    self.par_father_contactno = ko.observable("").extend({
        required: true
    });

    self.par_father_occupation = ko.observable("").extend({
        required: true
    });


    self.par_nextofkin = ko.observable("").extend({
        required: true
    });

    self.par_kin_address = ko.observable("").extend({
        required: true
    });

    self.par_kin_contactno = ko.observable("").extend({
        required: true
    });



    self.par_mother_name = ko.observable("").extend({
        required: true
    });

    // self.par_mother_icno = ko.observable("").extend({
    //     required: true
    // });

    self.par_mother_address = ko.observable("").extend({
        required: true
    });

    self.par_mother_contactno = ko.observable("").extend({
        required: true
    });

    self.par_mother_occupation = ko.observable("").extend({
        required: true
    });


    self.par_parent_relation = ko.observable("").extend({
        required: true
    });

    self.par_family_income = ko.observable("").extend({
        required: true
    });

    self.par_family_responsibility = ko.observable("").extend({
        required: true
    });

    self.par_living_with = ko.observable("").extend({
        required: true
    });



    //DATA REGISTRATION
    self.srg_payment_via = ko.observable("").extend({
        required: true
    });

    self.srg_payment_resit = ko.observable("").extend({
        required: true
    });

    // self.srg_payment_resitdoc = ko.observable("").extend({
    //     required: true
    // });
    self.srg_payment_resitdoc = ko.observable("")



    //DATA ACADEMIC
    self.sta_muet = ko.observable("").extend({
        required: true
    });

    self.sta_bm_spm = ko.observable("").extend({
        required: true
    });

    self.sta_bm_stpm = ko.observable("").extend({
        required: true
    });

    // self.sta_cert_doc = ko.observable("").extend({
    //     required: true
    // });
    self.sta_cert_doc = ko.observable("")
    
    // self.sta_spm_doc = ko.observable("").extend({
    //     required: true
    // });
    self.sta_spm_doc = ko.observable("");

    // self.sta_stpm_doc = ko.observable("").extend({
    //     required: true
    // });
    self.sta_stpm_doc = ko.observable("");

    // self.sta_diploma_doc = ko.observable("").extend({
    //     required: true
    // });
    self.sta_diploma_doc = ko.observable("");

    // self.sta_degree_doc = ko.observable("").extend({
    //     required: true
    // });
    self.sta_degree_doc = ko.observable("");



    //DATA FINANCIAL
    self.fin_fees = ko.observable("").extend({
        required: true
    });



    //DATA STATUS
    self.sts_cur_year = ko.observable("").extend({
        required: true
    });

    self.sts_cur_intake = ko.observable("").extend({
        required: true
    });

    self.sts_semester = ko.observable("").extend({
        required: true
    });

    self.sts_status = ko.observable("").extend({
        required: true
    });

    self.sts_date_joined = ko.observable("").extend({
        required: true
    });

    self.sts_date_complete = ko.observable("").extend({
        required: true
    });


    // self.submitForm = function(){
        
        // document.getElementById("form1").submit();
        // document.getElementById("form2").submit();
        
    // }

    self.Register = function () {

        var error = ko.validation.group(self);
        
        if (error().length > 0) {
            error.showAllMessages();
            swal(
                'Student Information',
                'Please complete all information required.',
                'error'
              )
            return;
        }

        var param = {
            twmTitle: self.std_studentid(),
            twmDescription: self.sti_name(),
            twmSdate: self.sti_icno(),
            twmEdate: self.pgm_id(),
            twmYear: self.sti_race(),
            twmStatus: self.crs_code(),
        }
        // console.log(param)
        
        var form = new FormData();

        form.append("std_studentid", self.std_studentid());
        form.append("sti_name", self.sti_name());
        form.append("sti_icno", self.sti_icno());
        form.append("pgm_id", self.pgm_id());
        form.append("crs_code", self.crs_code());
        form.append("sti_gender", self.sti_gender());
        form.append("sti_nationality", self.sti_nationality());
        form.append("sti_status_bumiputra", self.sti_status_bumiputra());
        form.append("sti_race", self.sti_race());
        form.append("sti_religion", self.sti_religion());
        form.append("sti_status_oku", self.sti_status_oku());
        form.append("sti_blood_type", self.sti_blood_type());
        form.append("sti_email", self.sti_email());
        form.append("sti_address_1", self.sti_address_1());
        form.append("sti_address_2", self.sti_address_2());
        form.append("sti_address_3", self.sti_address_3());
        form.append("sti_postcode", self.sti_postcode());
        form.append("sti_state", self.sti_state());
        form.append("sti_contactno_home", self.sti_contactno_home());
        form.append("sti_contactno_mobile", self.sti_contactno_mobile());
        form.append("sti_bank_id", self.sti_bank_id());
        form.append("sti_bank_accountno", self.sti_bank_accountno());

        form.append("par_father_name", self.par_father_name());
        form.append("par_father_address", self.par_father_address());
        form.append("par_father_contactno", self.par_father_contactno());
        form.append("par_father_occupation", self.par_father_occupation());
        form.append("par_nextofkin", self.par_nextofkin());
        form.append("par_kin_address", self.par_kin_address());
        form.append("par_kin_contactno", self.par_kin_contactno());
        form.append("par_mother_name", self.par_mother_name());
        form.append("par_mother_address", self.par_mother_address());
        form.append("par_mother_contactno", self.par_mother_contactno());
        form.append("par_mother_occupation", self.par_mother_occupation());
        form.append("par_parent_relation", self.par_parent_relation());
        form.append("par_family_income", self.par_family_income());
        form.append("par_family_responsibility", self.par_family_responsibility());
        form.append("par_living_with", self.par_living_with());

        let upload_0 = $("#sti_image")[0].files[0];
        // alert(upload_0);
        form.append("sti_image",upload_0);

        let upload_1 = $("#srg_payment_resitdoc")[0].files[0];
        form.append("srg_payment_resitdoc",upload_1);
        form.append("srg_payment_via", self.srg_payment_via());
        form.append("srg_payment_resit", self.srg_payment_resit());

        // let upload_2 = $("#sta_cert_doc")[0].files[0];
        // let upload_3 = $("#sta_spm_doc")[0].files[0];
        // let upload_4 = $("#sta_stpm_doc")[0].files[0];
        // let upload_5 = $("#sta_diploma_doc")[0].files[0];
        // let upload_6 = $("#sta_degree_doc")[0].files[0];
        // form.append("sta_cert_doc",upload_2);
        // form.append("sta_spm_doc",upload_3);
        // form.append("sta_stpm_doc",upload_4);
        // form.append("sta_diploma_doc",upload_5);
        // form.append("sta_degree_doc",upload_6);
        form.append("sta_muet", self.sta_muet());
        form.append("sta_bm_spm", self.sta_bm_spm());
        form.append("sta_bm_stpm", self.sta_bm_stpm());

        form.append("fin_fees", self.fin_fees());

        form.append("sts_cur_year", self.sts_cur_year());
        form.append("sts_cur_intake", self.sts_cur_intake());
        form.append("sts_semester", self.sts_semester());
        form.append("sts_status", self.sts_status());
        form.append("sts_date_joined", self.sts_date_joined());
        form.append("sts_date_complete", self.sts_date_complete());



        form.append("recordstatus", 'ADD');

        swal({
            title: "Register Student Information",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            var settings = {
                "url": host+"api_pengurusan_pelajar/public/studentInfoReg",
                "method": "POST",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form
            };

            $.ajax(settings).done(function (response) {
                
                console.log(response);
                result = JSON.parse(response);
                if (!result.success) {
                    Swal(result.message, result.data, "error");
                    return;
                }

                sessionStorage.token = result.token;
                window.location.replace("adminPage.html");
            });
        });

    };
}

const RegisterDetModel = document.querySelector("#reg-student");
ko.cleanNode(RegisterDetModel);
ko.applyBindings(new RegisterModel(), RegisterDetModel);

function remove_pdf(param1,param2){

    swal({
        title: "Remove "+param1,
        text: "Are You Sure?",
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        confirmButtonColor: "#2196f3",
        closeOnConfirm: true,
        allowOutsideClick: false,
        html: false
    }).then(function () {
        
        $('#'+param2+'_del_btn').addClass('hidden');
        $('#'+param2).removeClass('hidden');

        if(param1 != 'Profile Picture'){
            $('#'+param2+'_download').addClass('hidden');
            
        }else{
            $('#upt_sti_image_img').addClass('hidden');
            $('#nopic').removeClass('hidden');

        }
    });
    

}

$('#upt-pljrInfo').click(function(){

let std_studentid = $("#upt_std_studentid").val();
let sti_name = $("#upt_sti_name").val();
let sti_icno = $("#upt_sti_icno").val();
let pgm_id = $("#upt_pgm_id").val();
let crs_code = $("#upt_crs_code").val();
let sti_gender = $("#upt_sti_gender").val();
let sti_nationality = $("#upt_sti_nationality").val();
let sti_status_bumiputra = $("#upt_sti_status_bumiputra").val();
let sti_race = $("#upt_sti_race").val();
let sti_religion = $("#upt_sti_religion").val();
let sti_status_oku = $("#upt_sti_status_oku").val();
let sti_blood_type = $("#upt_sti_blood_type").val();
let sti_email = $("#upt_sti_email").val();
let sti_address_1 = $("#upt_sti_address_1").val();
let sti_address_2 = $("#upt_sti_address_2").val();
let sti_address_3 = $("#upt_sti_address_3").val();
let sti_postcode = $("#upt_sti_postcode").val();
let sti_state = $("#upt_sti_state").val();
let sti_contactno_home = $("#upt_sti_contactno_home").val();
let sti_contactno_mobile = $("#upt_sti_contactno_mobile").val();
let sti_bank_id = $("#upt_sti_bank_id").val();
let sti_bank_accountno = $("#upt_sti_bank_accountno").val();
// let sti_image = $("#upt_sti_image")[0].files[0];

let par_father_name = $("#upt_par_father_name").val();
let par_father_address = $("#upt_par_father_address").val();
let par_father_contactno = $("#upt_par_father_contactno").val();
let par_father_occupation = $("#upt_par_father_occupation").val();
let par_nextofkin = $("#upt_par_nextofkin").val();
let par_kin_address = $("#upt_par_kin_address").val();
let par_kin_contactno = $("#upt_par_kin_contactno").val();
let par_mother_name = $("#upt_par_mother_name").val();
let par_mother_address = $("#upt_par_mother_address").val();
let par_mother_contactno = $("#upt_par_mother_contactno").val();
let par_mother_occupation = $("#upt_par_mother_occupation").val();
let par_parent_relation = $("#upt_par_parent_relation").val();
let par_family_income = $("#upt_par_family_income").val();
let par_family_responsibility = $("#upt_par_family_responsibility").val();
let par_living_with = $("#upt_par_living_with").val();

let srg_payment_resitdoc = $("#upt_srg_payment_resitdoc")[0].files[0];
let srg_payment_via = $("#upt_srg_payment_via").val();
let srg_payment_resit = $("#upt_srg_payment_resit").val();

let sta_cert_doc = $("#upt_sta_cert_doc")[0].files[0];
let sta_spm_doc = $("#upt_sta_spm_doc")[0].files[0];
let sta_stpm_doc = $("#upt_sta_stpm_doc")[0].files[0];
let sta_diploma_doc = $("#upt_sta_diploma_doc")[0].files[0];
let sta_degree_doc = $("#upt_sta_degree_doc")[0].files[0];
let sta_muet = $("#upt_sta_muet").val();
let sta_bm_spm = $("#upt_sta_bm_spm").val();
let sta_bm_stpm = $("#upt_sta_bm_stpm").val();

let fin_fees = $("#upt_fin_fees").val();

let sts_cur_year = $("#upt_sts_cur_year").val();
let sts_cur_intake = $("#upt_sts_cur_intake").val();
let sts_semester = $("#upt_sts_semester").val();
let sts_status = $("#upt_sts_status").val();
let sts_date_joined = $("#upt_sts_date_joined").val();
let sts_date_complete = $("#upt_sts_date_complete").val();

let statusrekod = 'EDT';

var form = new FormData();

form.append("std_studentid", std_studentid);
form.append("sti_name", sti_name);
form.append("sti_icno", sti_icno);
form.append("pgm_id", pgm_id);
form.append("crs_code", crs_code);
form.append("sti_gender", sti_gender);
form.append("sti_nationality", sti_nationality);
form.append("sti_status_bumiputra", sti_status_bumiputra);
form.append("sti_race", sti_race);
form.append("sti_religion", sti_religion);
form.append("sti_status_oku", sti_status_oku);
form.append("sti_blood_type", sti_blood_type);
form.append("sti_email", sti_email);
form.append("sti_address_1", sti_address_1);
form.append("sti_address_2", sti_address_2);
form.append("sti_address_3", sti_address_3);
form.append("sti_postcode", sti_postcode);
form.append("sti_state", sti_state);
form.append("sti_contactno_home", sti_contactno_home);
form.append("sti_contactno_mobile", sti_contactno_mobile);
form.append("sti_bank_id", sti_bank_id);
form.append("sti_bank_accountno", sti_bank_accountno);
// let upload_0 = $("#sti_image")[0].files[0];
// form.append("sti_image",sti_image);

form.append("par_father_name", par_father_name);
form.append("par_father_address", par_father_address);
form.append("par_father_contactno", par_father_contactno);
form.append("par_father_occupation", par_father_occupation);
form.append("par_nextofkin", par_nextofkin);
form.append("par_kin_address", par_kin_address);
form.append("par_kin_contactno", par_kin_contactno);
form.append("par_mother_name", par_mother_name);
form.append("par_mother_address", par_mother_address);
form.append("par_mother_contactno", par_mother_contactno);
form.append("par_mother_occupation", par_mother_occupation);
form.append("par_parent_relation", par_parent_relation);
form.append("par_family_income",par_family_income );
form.append("par_family_responsibility", par_family_responsibility);
form.append("par_living_with", par_living_with);

// let upload_1 = $("#srg_payment_resitdoc")[0].files[0];
form.append("srg_payment_resitdoc",srg_payment_resitdoc);
form.append("srg_payment_via", srg_payment_via);
form.append("srg_payment_resit", srg_payment_resit);

// let upload_2 = $("#sta_cert_doc")[0].files[0];
// let upload_3 = $("#sta_spm_doc")[0].files[0];
// let upload_4 = $("#sta_stpm_doc")[0].files[0];
// let upload_5 = $("#sta_diploma_doc")[0].files[0];
// let upload_6 = $("#sta_degree_doc")[0].files[0];
form.append("sta_cert_doc",sta_cert_doc);
form.append("sta_spm_doc",sta_spm_doc);
form.append("sta_stpm_doc",sta_stpm_doc);
form.append("sta_diploma_doc",sta_diploma_doc);
form.append("sta_degree_doc",sta_degree_doc);
form.append("sta_muet", sta_muet);
form.append("sta_bm_spm", sta_bm_spm);
form.append("sta_bm_stpm", sta_bm_stpm);

form.append("fin_fees", fin_fees);

form.append("sts_cur_year", sts_cur_year);
form.append("sts_cur_intake", sts_cur_intake);
form.append("sts_semester", sts_semester);
form.append("sts_status", sts_status);
form.append("sts_date_joined", sts_date_joined);
form.append("sts_date_complete", sts_date_complete);

form.append("recordstatus", statusrekod);

swal({
    title: "Update Student Information",
    text: "Are You Sure?",
    type: "question",
    showCancelButton: true,
    confirmButtonText: "Update",
    confirmButtonColor: "#22b66e",
    closeOnConfirm: true,
    allowOutsideClick: false,
    html: false
}).then(function () {

    var settings = {
        "url": host+"api_pengurusan_pelajar/public/studentInfoUpdate",
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
      };

    $.ajax(settings).done(function (response) {
        console.log(response)
        result = JSON.parse(response);
        if (!result.success) {
            Swal(result.message, result.data, "error");
            return;
        }

        // sessionStorage.token = result.token;
        window.location.replace("adminPage.html");

    });
});

})

function closeModal(){
    $('#topModal').modal('hide');

    $('.nav-link').removeClass('active');
    $('.tab-pane').removeClass('active');
    $('#link_tab1').addClass('active');
    $('#tab1').addClass('active');
}

function triggerTab(index){
    
    $('.nav-link').removeClass('active');
    $('.tab-pane').removeClass('active');
    $('#tab'+index).addClass('active');
    $('#link_tab'+index).addClass('active');

}

function studentIdChecking(self,param){

    var btn_submit = '';
    var span_error = '';

    if(param == 1){
        btn_submit = 'btn-save'
        span_error = 'check';
    }else{
        btn_submit = 'upt-pljrinfo';
        span_error = 'upt-check';
    }
    let input = self.value;

    var form = new FormData();
    form.append("input", input);

    var settings = {
    "url": host+"api_pengurusan_pelajar/public/studentIdChecking",
    "method": "POST",
    "timeout": 0,
    "processData": false,
    "mimeType": "multipart/form-data",
    "contentType": false,
    "data": form
    };

    $.ajax(settings).done(function (response) {
        result = JSON.parse(response);
        if(result.data != ''){
            $('#'+span_error).html('Student ID Already Exists In The System');
            $("#"+span_error).prop('class','text-danger');
            $('#'+btn_submit).prop('disabled', true);
        }else{
            $('#'+span_error).html('');
            $('#'+btn_submit).prop('disabled', false);
        }
        
    });

}

function del(pgm_id){
    var form = new FormData();

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
        html: false
    }).then(function () {
        var settings = {
            "url": host+"api_pengurusan_pelajar/public/studentInfoDelete",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };

        $.ajax(settings).done(function (response) {
            console.log(response)
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

