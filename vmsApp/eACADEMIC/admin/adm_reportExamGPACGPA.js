$(function () {
    $.ajaxSetup({
        cache: false
    });


    let getSession = window.sessionStorage.cal_year;
    let cal_cohort = window.sessionStorage.cal_cohort;


    $.fn.select2.defaults.set("theme", "bootstrap");

    // select session
    acaCalActive(function () {
        $('#aca_session').append('<option value="">- Choose Academic Session -</option>');
        let names = "";
        $.each(obj_kalendar.data, function (i, item) {
            let curyear = item.cur_year.replace('/', '');
            select = "";
            if (getSession == item.cur_year && cal_cohort == item.cal_cohort) {
                select = "selected";
            }
            if (names != curyear + '/' + item.cal_cohort) {
                names = curyear + '/' + item.cal_cohort;
                $('#aca_session').append('<option ' + select + ' value="' + item.cur_year + '" calSem="' + item.cal_cohort + '">' + curyear + '/' + item.cal_cohort + '</option>');
            }
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:'
        });
    });

    getFaculty(function () {
        $('#FK_faculty').append('<option value="">- Choose Faculty -</option>');
        $.each(obj_getFaculty.data, function (i, item) {
            $('#FK_faculty').append('<option value="' + item.pk_id + '">' + item.fac_name + `(` + item.fac_id + ')</option>');
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:'
        });
    })


    $('#generatePDF4').click(function() {
        
        let facName = $('#fac_name').val();
        let SessionAca = $('#academicSession').val();
        
        generatePDF4('Final Examination', 'cotListPDF', 'facName', 'SessionAca')
    });

});

var confirmed = false;

function generateTable() {
    let selectSession = $('#aca_session').val();
    let sem = $("#aca_session option:selected").attr("calSem");
    let aca_cal_category = $("#aca_cal_category").val();
    let FK_faculty = $("#FK_faculty").val();
    let calenderSem = $("#aca_session option:selected").text();
    let facName = $("#FK_faculty option:selected").text();
    // console.log($("#aca_session").text());
    if (facName=== '- Choose Faculty -') {
        facName= '';
    }else{facName= facName}
        listCrsReg(selectSession, sem, aca_cal_category,   function () {
                    // $("#loading_modal").modal('show');
                    createTbl(obj_regCrs.data, calenderSem, facName);
                });

}
function createTbl(data,calenderSem,FK_faculty) {
    // console.log(data);

    var columns = [
        { "name": "bil", "title": "No." },
        { "name": "studId", "title": "STUDENT ID" },
        { "name": "studName", "title": "NAME" },
        { "name": "studSem", "title": "SEMESTER" },
        { "name": "studGpa", "title": "GPA" },
        { "name": "studCgpa", "title": "CGPA", "breakpoints": "md sm xs" },
        { "name": "status", "title": "STATUS ACADEMIC", "breakpoints": "md sm xs" },
    ];
    let bil = 1;
    let convertList = JSON.stringify(data);
    $("#dataList").val(convertList);
    var list = [];

    $.each(data, function (i, item) {
    console.log(item);


    let tempAca= item.cal_year;
            list.push({
                bil: bil++,
                studId : item.std_studentid,
                studName : item.sti_name,
                studSem : item.std_semester,
                studGpa : item.std_gpa,
                studCgpa : item.std_cgpa,
                status : item.sts_status_name_en
                
            });
      

    });
       
        $("#cotListPDF").html('');
        $("#cotListPDF").footable({
            "columns": columns,
            "rows": list,
            "paging": {
                "enabled": false,
                "size": 10,
                "countFormat": "Showing {PF} to {PL} of {TR} data"
            },
            "width": 1000 // Set the desired width for the entire table

         
        });
        $("#cotListPDF").css("display", "none");
        generatePDF4('Final Examination', 'cotListPDF', FK_faculty, calenderSem)

}


function listCrsReg(year, sem, aca_cal_category, returnValue) {
    var form = new FormData();
    form.append('cur_year', year);
    form.append('cal_cohort', sem);
    form.append('aca_cal_category', aca_cal_category);

    obj = new post(host + 'api_pengurusan_pelajar/public/misStdRegsub/reporting/gpaCgpa',form,'picoms ' + window.sessionStorage.token).execute();

    if (obj.success) {
        obj_regCrs = obj;
        returnValue();
    }else{
        alert('Fail Generated PDF');
    }
   
}