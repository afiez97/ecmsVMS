$(function () {
    $.ajaxSetup({
        cache: false
    });
    uniqueCapaian = window.sessionStorage.uniqueCapaian;

    checkCapaian(window.sessionStorage.usrId);
    FindIDtable();


    let FK_capaianjenis = window.sessionStorage.FK_capaianjenis;
    // let inCharge = window.sessionStorage.FK_capaianjenis;
    // let inCharge = 'superadmin';

    // if (FK_capaianjenis = 1) {
    //     $('#assignSU').removeClass('none');
    //     $('#assignAdminHostel').removeClass('none');
    //     $('#assignAdminCoun').removeClass('none');
    //     // $('.none').remove();
    //     listBYJenisCapaian(FK_capaianjenis, 'listSuperAdmin');
    //     listBYJenisCapaian(2, 'list_adminProgram');
    //     listBYJenisCapaian(3, 'list_adminDisc');
    //     listBYJenisCapaian(4, 'list_adminHostel');
    //     listBYJenisCapaian(5, 'list_adminCounseling');

    // } else if (FK_capaianjenis = 'adminHostel') {
    //     $('#assignAdminHostel').removeClass('none');
    //     $('.none').remove();

    // } else if (FK_capaianjenis = 'adminHostel') {
    //     $('#assignAdminCoun').removeClass('none');
    //     $('.none').remove();
    // }

    listHepastaff(function () {

        // // bwh nie klau just list only staff x include user6
        // lecturerList(function(){



        $('#FK_users').append('<option value="">- Choose -</option>');
        // $('#upt_staf_warden').append('<option value="">- Choose -</option>');
        $.each(obj_hepa.data, function (i, item) {
            // console.log(item);

            $('#FK_users').append('<option value="' + item.usr_id + '">' + item.usr_id + ' - ' + item.usr_name + '</option>');
            // $('#upt_staf_warden').append('<option value="'+item.emp_id+'">'+item.emp_name+'</option>');
        });

        $('.slct2').select2({
            width: '100%',
            containerCssClass: ':all:'
        });
    });


    listRoles(function () {
        $('#FK_capaianjenis').append('<option value="">- Choose -</option>');
        // $('#upt_staf_warden').append('<option value="">- Choose -</option>');
        $.each(listroles, function (i, item) {

            if (item.inCharge == 'superadmin') {
                listBYJenisCapaian(item.uniqueCapaian);

                $('#FK_capaianjenis').append('<option value="' + item.id_jenisCapaian + '">' + item.namaCapaian + '</option>');
                // $('#upt_staf_warden').append('<option value="'+item.emp_id+'">'+item.emp_name+'</option>');

            }

        });

        // $('.slct2').select2({
        //     width: null,
        //     containerCssClass: ':all:'
        // });
    });





});
var confirmed = false;

function listHepastaff(returnValue) {
    var settings = {
        "url": host + "api_hr_emp/public/users/listHepastaff",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_hepa = response;
        returnValue();
    });
}
//-------------------------------------------------- form add --------------------------------------------------//
$('#formAdd').on('submit', function (e) {
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Add Role",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            //-- first check sama ada da ada roles nanti swap dia roles apa sekarang --//
            let FK_users = $('#FK_users').val();
            let FK_capaianjenis = $('#FK_capaianjenis').val();



            let obj = new get(host + 'api_hep/public/capaianUsr/ExistingUser/' + FK_users + '/' + FK_capaianjenis, 'picoms ' + window.sessionStorage.token).execute();
            if (!obj.success) {
                var form = new FormData();
                form.append("FK_users", FK_users);
                form.append("FK_capaianjenis", FK_capaianjenis);
                form.append("created_by", '');
                form.append("updated_by", '');
                var settings = {
                    "url": host + "api_hep/public/capaianUsr/register",
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
                    result = JSON.parse(response);
                    if (!result.success) {
                        Swal(result.message, result.data, "error");
                        return;
                    }
                    window.location.reload();
                });
            } else {
                swal({
                    title: "Add Role",
                    text: "Are You Sure?",
                    type: "question",

                });

            }
            window.location.reload();

            //-- end first check sama ada da ada roles nanti swap dia roles apa sekarang abis --//

        });
    }
});
//-------------------------------------------------- end form add --------------------------------------------------//

function listRoles(returnValue) {
    let obj = new get(host + 'api_hep/public/capaianUsr/listUnderIncharge/' + window.sessionStorage.usrId, 'picoms ' + window.sessionStorage.token).execute();
    if (obj.success) {
        //    console.log(obj);
        listroles = obj.data;
        returnValue();
    }


}

// DB terlibat
// 1. hep_capaianUsr
// 2. hep_capaianjenis
// 3. hrm_emp_info

function listBYJenisCapaian(namaTable) {
    var colums = [
        { "name": "bil", "title": "No." },
        { "name": "usr_name", "title": "Person In Charge" },
        { "name": "FK_userID", "title": "Staff ID" },
        { "name": "namaCapaian", "title": "Role" },
        { "name": "btnAction", "title": "Action" },
    ];

    let bil = 1;
    // let convertList = JSON.stringify(data);
    // $("#dataList").val(convertList);
    var list = [];
    let obj = new get(host + 'api_hep/public/capaianUsr/listByFKjeniscapaian/' + namaTable, 'picoms ' + window.sessionStorage.token).execute();
    if (obj.success) {



        // console.log(obj);


        $.each(obj.data, function (i, item) {
            console.log(item);

            // console.log(item);

            // if (item.uniqueCapaian == 'superadmin') {
            //     btn = '-';
            // } else {
            //     btn = '<button class="btn btn-icon danger" title="Delete" onclick="delData(\'' + item.id_capaianUsr + '\')"><i class="ion-trash-a"></i></button>';
            // }
            list.push({
                bil: bil++,
                usr_name: `<span class="text-uppercase">`+item.usr_name+`</span>`,
                FK_userID: `<span class="text-uppercase">`+item.FK_users+`</span>`,
                namaCapaian: item.namaCapaian,
                btnAction: '<button class="btn btn-icon danger" title="Delete" onclick="delData(\'' + item.id_capaianUsr + '\')"><i class="ion-trash-a"></i></button>',
            });
        });
        // console.log(list);         


        $("#list_" + namaTable).footable({
            "columns": colums,
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
    }

}

//-------------------------------------------------- delete data --------------------------------------------------//
function delData(id) {
    swal({
        title: "Remove Admin",
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
    form.append("id_capaianUsr", id);

        var settings = {
            "url": host + "api_hep/public/capaianUsr/delete",
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
            result = JSON.parse(response);
            if (!result.success) {
                Swal(result.message, result.data, "error");
                return;
            }
            window.location.reload();
        });
    });
}
//-------------------------------------------------- end delete data --------------------------------------------------//


function FindIDtable() {

    let obj = new get(host + 'api_hep/public/jenisCapaian/UtkGenerateIDTable/' + uniqueCapaian, 'picoms ' + window.sessionStorage.token).execute();
    if (obj.success) {
        //    let uniqueCapaian =  window.sessionStorage.uniqueCapaian;
        $.each(obj.data, function (i, item) {
            childTable = item.uniqueCapaian;
            listBYJenisCapaian(childTable);
            // console.log(uniqueCapaian)
        });

    }
}

// // hep_capaianUsr
// $router->get('capaianUsr/register','hep_capaianUsrController@register');
// $router->get('capaianUsr/update','hep_capaianUsrController@update');
// $router->get('capaianUsr/delete','hep_capaianUsrController@delete');
// $router->get('capaianUsr/list','hep_capaianUsrController@list');
// $router->get('capaianUsr/view','hep_capaianUsrController@view');


// // hep_capaianjenis
// $router->get('jenisCapaian/register','hep_capaianjenisController@register');
// $router->get('jenisCapaian/update','hep_capaianjenisController@update');
// $router->get('jenisCapaian/delete','hep_capaianjenisController@delete');
// $router->get('jenisCapaian/list','hep_capaianjenisController@list');
// $router->get('jenisCapaian/view','hep_capaianjenisController@view');
