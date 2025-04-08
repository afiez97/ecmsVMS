$(function(){
    $.ajaxSetup({
        cache: false
    });

    let getSession = window.sessionStorage.pgmSession;
    let calSem = window.sessionStorage.calSem;

    $.fn.select2.defaults.set("theme", "bootstrap");

    generateTable();
});

var confirmed = false;

function generateTable() {
    let date = $('#dateProgramme').val();
    var form = new FormData();
    form.append("dateProgramme", date);

    

    if(date){
        monthOnly = formatMonth(date);
        console.log(monthOnly);
      }
      else{
        monthOnly = '';
      }

    var settings = {
        url: host + "api_hep/public/hepDiscipline/listReport",
        method: "POST",
        timeout: 0,
        headers: {
            Authorization: "picoms " + window.sessionStorage.token,
        },
        processData: false,
        mimeType: "multipart/form-data",
        contentType: false,
        data: form
    };
    $.ajax(settings).done(function(response) {
        obj_programme = JSON.parse(response);

        var columns = [
            { "name": "bil", "title": "No.", "style": "text-align:center;" },
            { "name": "dis_date", "title": "Date", "style": "text-align:center;" },
            { "name": "dis_venue", "title": "Venue", "style": "text-align:center;" },
            { "name": "Det_student", "title": "Det. Student", "style": "text-align:center;" },
            { "name": "dis_type", "title": "Discipline Type", "breakpoints": "md sm xs", "style": "text-align:center;" },
            { "name": "dis_amount", "title": "Amount", "breakpoints": "md sm xs", "style": "text-align:center;" },
            { "name": "status", "title": "Status", "breakpoints": "md sm xs", "style": "text-align:center;" },
        ];

        let bil = 1;
        let convertList = JSON.stringify(obj_programme.data);
        $("#dataStdList2").val(convertList);
        var list = [];

        $.each(obj_programme.data, function(i, field) {
            list.push({
                bil: bil++,
                dis_date: formatDate(field.dis_date),
                dis_venue: '<span class="text-uppercase">' + field.dis_venue + '</span>',
                Det_student: '<span class="text-uppercase"><b>' + field.stud_icno + '</b></span><br>' + field.sti_name + '<br>' + field.sti_icno,
                dis_type: '<span class="text-uppercase">' + field.description + '</span>',
                dis_amount: 'RM ' + field.dis_amount,
                status: field.dis_pay_status,
            });
        });

        list.push({
            dis_amount: '<h4><strong>Total Compound : </strong></h4>',
            status: '<h4><strong>' + (list.length) + '</strong></h4>',
        });

        $("#reportTableDisc").html('');
        $("#reportTableDisc").footable({
            "columns": columns,
            "rows": list,
        });

        button = `<label for="" class="col-form-label" style="display: block; height: 35px;"></label>
              <button type="button" onclick="generateTable()" class="btn btn-info">
                  <i class="fa fa-fw fa-filter"></i>Filter
              </button>
              <button id="" onclick="generatePDFDiscipline('Discipline', 'reportTableDisc', '` + monthOnly + `')" class="btn md-raised green">
                  <i class="fa fa-fw fa-pencil-square-o"></i>
                  <strong>Download PDF</strong>
              </button>`;

        $('#btnPDF').html(button);
    });
}
