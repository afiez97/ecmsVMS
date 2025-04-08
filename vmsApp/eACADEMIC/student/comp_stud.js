$(function(){
    $.ajaxSetup ({
        cache: false
    });

    let studId = window.sessionStorage.std_studentid;

    // Discipline List
    listCompound(studId, function(){
        var colums = [
            { "name": "bil", "title": "No." },
            { "name": "clg_id", "title": "Campus" },
            { "name": "dis_refNo", "title": "Reference No." },
            { "name": "dis_type", "title": "Type", "breakpoints": "md sm xs" },
            { "name": "dis_amount", "title": "Amount", "breakpoints": "md sm xs" },
            { "name": "dis_pay_status", "title": "Status", "breakpoints": "md sm xs" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];

        let bil = 1;
        let convertList = JSON.stringify(obj_compound.data);
        $("#dataList").val(convertList);
        var list = [];

        $.each(obj_compound.data, function (i, field){
            let status = field.dis_pay_status;
            let label = '';
            if( status == 'New' ){ label = '<span class="label warning">'+status+'</span>' }
            else if( status == 'Paid' ){ label = '<span class="label success">'+status+'</span>' }

            list.push({
                bil: bil++, clg_id: '<span class="text-uppercase">'+field.clg_name+'</span>', dis_refNo: '<span class="text-uppercase">'+field.dis_refNo+'</span>', 
                dis_type: '<span class="text-uppercase">'+field.description+'</span>', dis_pay_status: label, dis_amount: 'RM '+field.dis_amount,
                upt_btn: '<button class="btn btn-icon accent" title="View" onclick="loadData(\'' + i + '\')" ><i class="ion-eye"></i></button>'
            });
        });

        $("#compoundList").html('');
        $("#compoundList").footable({
            "columns": colums,
            "rows": list,
            "paging": {
                "enabled": true,
                "size": 10,
                "countFormat": "Showing {PF} to {PL} of {TR} data"
            },
            "filtering": {
                "enabled": true,
                "placeholder": "Search...",
                "dropdownTitle": "Search for:"
            }
        });
    });
});
var confirmed = false;


function loadData(index){
    let data = JSON.parse($("#dataList").val());
    let status = data[index].dis_pay_status
    $('#upt_clg_id').html(data[index].clg_name);
    $('#upt_stud_icno').html(data[index].stud_icno);
    $('#upt_dis_date').html(data[index].dis_date);
    $('#upt_dis_time').html(data[index].dis_time);
    $('#upt_dis_venue').html(data[index].dis_venue);
    $('#upt_dis_action').html(data[index].dis_action);
    $('#upt_dis_refNo').html(data[index].dis_refNo);
    $('#upt_dis_type').html(data[index].id_salahlaku+' - '+data[index].description);
    $('#upt_dis_issue').html(data[index].dis_issue);
    $('#upt_dis_remark').html(data[index].dis_remark);
    $('#upt_dis_amount').html('RM '+data[index].dis_amount);

    if( status == 'New' ){ $('#upt_dis_pay_status').html('<span class="label warning">'+status+'</span>') }
    else if( status == 'Paid' ){ $('#upt_dis_pay_status').html('<span class="label success">'+status+'</span>') }

    $('#update-compound').modal('show');
}

function listCompound(id, returnValue){
    var settings = {
        "url": host+"api_hep/public/hepDiscipline/listByStud/"+id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response){
        obj_compound = response;
        returnValue();
    });
}