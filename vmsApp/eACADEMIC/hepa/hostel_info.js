$(function () {
    $.ajaxSetup({
        cache: false
    });

    $.fn.select2.defaults.set("theme", "bootstrap");

    let campus = window.sessionStorage.cam_id;
    let usrWarden = window.sessionStorage.usrWarden;

    // if (usrWarden == 1) { $('.hideObj').hide(); }
    btnHideWarden = (wardenAccess == 1) ? $('.hideWarden').hide() : '';

    // select Campus
    campusList(function () {
        $('#hostel_branch').append('<option value="">- Choose -</option>');
        $('#upt_hostel_branch').append('<option value="">- Choose -</option>');
        $('#blok_branch').append('<option value="">- Choose -</option>');
        $('#room_branch').append('<option value="">- Choose -</option>');
        $('#bed_branch').append('<option value="">- Choose -</option>');
        $('#searchBranch').append('<option value="">- Choose -</option>');
        $('#srchClgBlock').append('<option value="">- Choose -</option>');
        $('#srchClgRoom').append('<option value="">- Choose -</option>');

        $.each(obj_college.data, function (i, item) {
            select = "";
            if (campus == item.pk_id) {
                select = "selected";
            }
            $('#searchBranch').append('<option value="' + item.pk_id + '" ' + select + '>' + item.clg_name.toUpperCase() + '</option>');
            $('#hostel_branch').append('<option value="' + item.pk_id + '">' + item.clg_name.toUpperCase() + '</option>');
            $('#upt_hostel_branch').append('<option value="' + item.pk_id + '">' + item.clg_name.toUpperCase() + '</option>');
            $('#blok_branch').append('<option value="' + item.pk_id + '">' + item.clg_name.toUpperCase() + '</option>');
            $('#room_branch').append('<option value="' + item.pk_id + '">' + item.clg_name.toUpperCase() + '</option>');
            $('#bed_branch').append('<option value="' + item.pk_id + '">' + item.clg_name.toUpperCase() + '</option>');
            $('#srchClgBlock').append('<option value="' + item.pk_id + '">' + item.clg_name.toUpperCase() + '</option>');
            $('#srchClgRoom').append('<option value="' + item.pk_id + '">' + item.clg_name.toUpperCase() + '</option>');
        });
    });

    if (campus != null) {
        listHstl(campus, function () {
            createTblHostel(obj_hstlBranch.data);
        });
        window.sessionStorage.removeItem('cam_id');
    }

    slctAsnaf(function () {
        $("#sti_asnaf").append($('<option value="">- Choose -</option>'));
        $("#sti_asnaf_upt").append($('<option value="">- Choose -</option>'));
        $.each(obj_asnafType.data, function (i, item) {
          $("#sti_asnaf").append(
            $(
              '<option value="' + item.asnaf_id +'" name="' + item.asnaf_name +'"  >' +  item.asnaf_name +"</option>"
            )
          );
          $("#sti_asnaf_upt").append(
            $(
              '<option value="' +
                item.asnaf_id +
                '">' +
                item.asnaf_name +
                "</option>"
            )
          );
        });
      });
});

$('#formFilterHostelChkIn').submit(function (e) {

    e.preventDefault(); // Prevent the default form submission
    reportingBaitulmal();

    

})
var confirmed = false;


$('#btnNewRecord').click(function () {
    $('#tabOne').trigger('click');
});


//-------------------------------------------------- add Hostel --------------------------------------------------//
$('#formAddHostel').on('submit', function (e) {
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Add Hostel",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let hostel_branch = $('#hostel_branch').val();
            let hostel_name = $('#hostel_name').val();
            let hostel_block = $('#hostel_block').val();
            let hostel_warden = $('#hostel_warden').val();
            let hostel_wardenNo = $('#hostel_wardenNo').val();
            let hostel_status = $('#hostel_status').val();
            let hostel_remark = $('#hostel_remark').val();

            var form = new FormData();
            form.append("hostel_branch", hostel_branch);
            form.append("hostel_name", hostel_name);
            form.append("hostel_block", hostel_block);
            form.append("hostel_warden", hostel_warden);
            form.append("hostel_wardenNo", hostel_wardenNo);
            form.append("hostel_status", hostel_status);
            form.append("hostel_remark", hostel_remark);
            form.append("recordstatus", 'ADD');

            var settings = {
                "url": host + "api_hep/public/hepHostel/register",
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
});
//-------------------------------------------------- end add Hostel --------------------------------------------------//


//-------------------------------------------------- update Hostel --------------------------------------------------//
$('#formUptHostel').on('submit', function (e) {
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Update Hostel",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#22b66e",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let hostel_id = $('#pk_id').val();
            let hostel_branch = $('#upt_hostel_branch').val();
            let hostel_name = $('#upt_hostel_name').val();
            let hostel_block = $('#upt_hostel_block').val();
            let hostel_warden = $('#upt_hostel_warden').val();
            let hostel_wardenNo = $('#upt_hostel_wardenNo').val();
            let hostel_status = $('#upt_hostel_status').val();
            let hostel_remark = $('#upt_hostel_remark').val();

            var form = new FormData();
            form.append("hostel_id", hostel_id);
            form.append("hostel_branch", hostel_branch);
            form.append("hostel_name", hostel_name);
            form.append("hostel_block", hostel_block);
            form.append("hostel_warden", hostel_warden);
            form.append("hostel_wardenNo", hostel_wardenNo);
            form.append("hostel_status", hostel_status);
            form.append("hostel_remark", hostel_remark);
            form.append("recordstatus", 'EDT');

            var settings = {
                "url": host + "api_hep/public/hepHostel/update",
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
            }).then(function () {
                let clgHstl = $('#searchBranch').val();

                campusList(function () {
                    $('#searchBranch').html('');
                    $.each(obj_college.data, function (i, item) {
                        $('#searchBranch').append('<option value="' + item.pk_id + '">' + item.clg_name + '</option>');
                    });
                    $('#searchBranch').val(clgHstl).trigger("change");
                    $('#uptHostelInfo').modal('hide');
                });
            });
        });
    }
});
//-------------------------------------------------- end update Hostel --------------------------------------------------//

//-------------------------------------------------- onchange view hostel list --------------------------------------------------//
$('#searchBranch').change(function () {
    let branchId = $('#searchBranch').val();

    listHstl(branchId, function () {
        createTblHostel(obj_hstlBranch.data);
    });
});

// select campus for view warden
$('#hostel_branch').change(function () {
    let camId = $('#hostel_branch').val();

    wrdnByCamAct(camId, function () {
        $('#hostel_warden').html('');
        $('#hostel_warden').append('<option value="">- Choose -</option>');
        $.each(obj_warden.data, function (i, item) {
            $('#hostel_warden').append('<option value="' + item.pk_id + '">' + item.emp_name + '</option>');
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:'
        });
    });
});

// select update campus for view warden
$('#upt_hostel_branch').change(function () {
    let camId = $('#upt_hostel_branch').val();

    wrdnByCamAct(camId, function () {
        $('#upt_hostel_warden').html('');
        $('#upt_hostel_warden').append('<option value="">- Choose -</option>');
        $.each(obj_warden.data, function (i, item) {
            $('#upt_hostel_warden').append('<option value="' + item.pk_id + '">' + item.emp_name + '</option>');
        });

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:'
        });
    });
});
//-------------------------------------------------- end onchange view hostel list --------------------------------------------------//


// data hostel
function loadDataHstl(id) {
    let data = JSON.parse($("#dataList").val());

    $.each(data, function (i, item) {
        // console.log(data);
        if (id == item.hostel_id) {
            let campus = item.hostel_branch;
            $('#pk_id').val(item.hostel_id);
            $('#upt_hostel_branch').val(campus);
            $('#upt_hostel_name').val(item.hostel_name);
            $('#upt_hostel_block').val(item.hostel_block);
            $('#upt_hostel_wardenNo').val(item.hostel_wardenNo);
            // $('#upt_hostel_warden').val(item.hostel_warden);
            if (item.emp_name != null){
                warden_name = item.emp_name;
            }
            else {
                warden_name = 'None';
            }
            $('#upt_hostel_warden').append('<option value="' + item.hostel_warden + '">' + warden_name + '</option>');
            // console.log(item.hostel_wardenNo);
            $('#upt_hostel_status').val(item.hostel_status);
            $('#upt_hostel_remark').val(item.hostel_remark);

            wrdnByCampus(campus, function () {
                $('#upt_hostel_warden').html('');
                $('#upt_hostel_warden').append('<option value="">- Choose -</option>');
                $.each(obj_warden.data, function (i, item) {

                    // console.log(obj_warden.data);
                    $('#upt_hostel_warden').append('<option value="' + item.pk_id + '">' + item.emp_name + '</option>');
                });
                $('#upt_hostel_warden').val(item.hostel_warden);

                $('.slct2').select2({
                    width: null,
                    containerCssClass: ':all:'
                });
            });

            $('#uptHostelInfo').modal('show');
        }
    });
}


//-------------------------------------------------- delete Hostel --------------------------------------------------//
function delData(id) {
    chkHstlOccupied(id, function () {
        let count = obj_chkInOut.data.length;
        if (count == 0) {
            var form = new FormData();
            form.append("recordstatus", 'DEL');
            form.append("hostel_id", id);

            swal({
                title: "Remove Hostel",
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
                    "url": host + "api_hep/public/hepHostel/delete",
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
                }).then(function () {
                    let clgHstl = $('#searchBranch').val();
                    campusList(function () {
                        $('#searchBranch').html('');
                        $.each(obj_college.data, function (i, item) {
                            $('#searchBranch').append('<option value="' + item.pk_id + '">' + item.clg_name + '</option>');
                        });
                        $('#searchBranch').val(clgHstl).trigger("change");
                        $('#uptHostelInfo').modal('hide');
                    });
                });
            });
        }
        else {
            swal({
                text: "Hostel is Occupied.",
                type: "info"
            });
        }
    });
}
//-------------------------------------------------- end delete Hostel --------------------------------------------------//


function stdList(index) {
    let data = JSON.parse($("#dataList").val());
    data = data[index];

    window.sessionStorage.pk_hostel = data.hostel_id;
    window.sessionStorage.cam_id = data.hostel_branch;
    window.location.replace('hostel_std.html');
}


//-------------------------------------------------- create table Hostel --------------------------------------------------//
function createTblHostel(data) {
    let usrWarden = window.sessionStorage.usrWarden;
    let hideObj = '';
    // if (usrWarden == 1) { hideObj = 'hidden' }
    btnHideWarden = (wardenAccess == 1) ? 'hidden' : '';

    var colums = [
        { "name": "bil", "title": "No." },
        { "name": "hostel_name", "title": "Name" },
        { "name": "hostel_warden", "title": "Warden" },
        { "name": "hostel_status", "title": "Status" },
        { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
    ];

    let bil = 1;
    let convertList = JSON.stringify(data);
    $("#dataList").val(convertList);
    var list = [];

    $.each(data, function (i, field) {
        let hstlId = field.hostel_id;
        list.push({
            bil: bil++, hostel_name: '<span class="text-uppercase">' + field.hostel_name + '</span>', hostel_warden: '<span class="text-uppercase">' + field.emp_name + '</span>',
            hostel_status: '<span class="text-uppercase">' + field.hostel_status + '</span>',
            upt_btn: '<button class="btn btn-icon success" '+btnHideWarden+' title="Update" onclick="loadDataHstl(\'' + hstlId + '\')" ' + hideObj + '><i class="ion-android-create"></i></button> ' +
                '<button class="btn btn-icon accent" title="Details" onclick="stdList(\'' + i + '\')"><i class="ion-ios-list-outline"></i></button> ' +
                '<button class="btn btn-icon danger" '+btnHideWarden+' title="Remove" onclick="delData(\'' + hstlId + '\')" ' + hideObj + '><i class="ion-trash-a"></i></button>'
        });
    });

    $("#hostelList").html('');
    $("#hostelList").footable({
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
}
//-------------------------------------------------- end create table Hostel --------------------------------------------------//


function listHstl(id, returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepHostel/listByClgAll/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_hstlBranch = response;
        returnValue();
    });
}

function chkHstlOccupied(id, returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepHostelChkinout/chkHstlOccupied/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_chkInOut = response;
        returnValue();
    });
}

function wrdnByCamAct(id, returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepWarden/wardenActCam/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_warden = response;
        returnValue();
    });
}

function wrdnByCampus(id, returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepWarden/wardenByCam/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_warden = response;
        returnValue();
    });
}


// afiez function utk searching
var confirmed = false;

$('#filterButton').on('click',function(e)  {
    // Get the values of the input fields using jQuery
    var name = $('#chkInOut_name').val();
    var ic = $('#chkInOut_ic').val();
    var id = $('#chkInOut_id').val();

    let $this = $(this);
    if (!confirmed) {
        e.preventDefault();

        let chkInOut_id = $("#chkInOut_id").val();
        let chkInOut_name = $("#chkInOut_name").val();
        let chkInOut_ic = $("#chkInOut_ic").val();
        // var columns = [
        //     { "name": "bil", "title": "Bil" },
        //     { "name": "activity", "title": "Data Yang Dikemaskini" },
        //     { "name": "datalist", "title": "Datalist" },
        //     //   { "name": "datalist", "title": "Datalist", "style": "max-width: 50px; word-wrap: break-word;" },
        //     { "name": "PIC", "title": "Person In Charge" },
        //     { "name": "created_at", "title": "created_at" },
        //     { "name": "status_rekod", "title": "rekod" },
        // ];

        var form = new FormData();
        form.append('chkInOut_id', chkInOut_id)
        form.append('chkInOut_name', chkInOut_name);
        form.append('chkInOut_ic', chkInOut_ic);

        let obj = new post(host + 'api_hep/public/hepHostelChkinout/chkBlckOccupied/hostelInfo', form, 'picoms ' + window.sessionStorage.token).execute();

        if (obj.success) {




            let convertList = JSON.stringify(obj.data);
            $("#DatalistLogs").val(convertList);

            var list = [];
            let bil = 1;
            $('#jar').html(''); // Clear the container

            $.each(obj.data, function (i, field) {

                console.log(field)
                $("#jar").append(
                    `
                  <div class="content row m-b shadow-lg rounded-4" style="border-radius: 25px; width: 800px; margin: auto; display: block;">
                <div class="box-color text-color">
                <!-- start detail student -->
                <div class="col-sm-7 lime-100" style="border-top-left-radius: 25px;border-bottom-left-radius: 25px;padding-block: 18px;">
                <p style="margin-bottom: 0;"><strong >DETAIL STUDENT</strong></p>

                <div style=" margin-bottom: 1rem; border: 0; border-top: 1px solid rgba(0, 0, 0, 0.1); "></div>

                
                <div class="col-xs-7 mx-auto">
                   <small class="text-muted">Name</small>
                  <div class="_500">` +
                      field.sti_name +
                      `</div>


                      <small class="text-muted">Checkin Status</small>
                      <div class="_500">` +
                          field.checkIn_status +
                          `</div>
                </div>
                <div class="col-xs-5">
                  <small class="text-muted">IC No.</small>
                  <div class="_500">` +
                      field.sti_icno +
                      `</div>
                  <small class="text-muted">Matrices No.</small>
                  <div class="_500">` +
                      field.std_id +
                      `</div>
                </div>
                </div>
                <!-- end detail student -->
                
                <div class="col-sm-5" style="border-top-left-radius: 25px;border-bottom-left-radius: 25px;padding-block: 18px;">
                <div class="padding">
                <!-- start hostel student -->
                <div class="col-sm-4 my-auto">
                 <p><strong>Hostel</strong></p>
                 <small>` +
                      field.hostel_name +
                      `</small>
                </div>
                <!-- end hostel student -->
                
                <!-- start block student -->
                <div class="col-sm-4" style="border-right: 1px solid #d7d5d5;border-left: 1px solid #d7d5d5; height: 50%; margin: auto;">
                 <p><strong>Blok</strong></p>
                 <small>` +
                      field.block_name +
                      `</small>
                </div>
                <!-- end block student -->
                
                <!-- start no bilik student -->
                <div class="col-sm-4">
                 <p><strong>No Bilik</strong></p>
                 <small>` +
                      field.room_no +
                      `</small>
                </div>
                <!-- end no bilik student -->
                </div>
                </div>
                
                
                </div>
                </div>
                
                  `
                  );
                

            });

    // Number of items and limits the number of items per page
    var numberOfItems = $("#jar .content").length;
   
    if(numberOfItems!=0){
        $('#content_paging').removeClass('none');

        var limitPerPage = 4;
        // Total pages rounded upwards
        var totalPages = Math.ceil(numberOfItems / limitPerPage);
        // Number of buttons at the top, not counting prev/next,
        // but including the dotted buttons.
        // Must be at least 5:
        var paginationSize = 7; 
        var currentPage;
        function showPage(whichPage) {
    
        // $('#content_paging').removeAttr('style');
            if (whichPage < 1 || whichPage > totalPages) return false;
            currentPage = whichPage;
            $("#jar .content").hide()
                .slice((currentPage-1) * limitPerPage, 
                        currentPage * limitPerPage).show();
            // Replace the navigation items (not prev/next):            
            $("#pagination_ha li").slice(1, -1).remove();
            getPageList(totalPages, currentPage, paginationSize).forEach( item => {
                $("<li>").addClass("page-item")
                         .addClass(item ? "current-page" : "disabled")
                         .toggleClass("active", item === currentPage).append(
                    $("<a>").addClass("page-link").attr({
                        href: "javascript:void(0)"}).text(item || "...")
                ).insertBefore("#next-page");
            });
            // Disable prev/next when at first/last page:
            $("#previous-page").toggleClass("disabled", currentPage === 1);
            $("#next-page").toggleClass("disabled", currentPage === totalPages);
            return true;
        }
    
        // Include the prev/next buttons:
        $("#pagination_ha").append(
            $("<li>").addClass("page-item").attr({ id: "previous-page" }).append(
                $("<a>").addClass("page-link").attr({
                    href: "javascript:void(0)"}).text("Prev")
            ),
            $("<li>").addClass("page-item").attr({ id: "next-page" }).append(
                $("<a>").addClass("page-link").attr({
                    href: "javascript:void(0)"}).text("Next")
            )
        );
        // Show the page links
        $("#jar").show();
        showPage(1);
    
        // Use event delegation, as these items are recreated later    
        $(document).on("click", "#pagination_ha li.current-page:not(.active)", function () {
            return showPage(+$(this).text());
        });
        $("#next-page").on("click", function () {
            return showPage(currentPage+1);
        });
    
        $("#previous-page").on("click", function () {
            return showPage(currentPage-1);
        });

    }else{
        $('#content_paging').addClass('none');

    }

        }

    }
});

$('#cancelButton').on('click',function(e)  {
    // Get the values of the input fields using jQuery
    var name = '';
    var ic = '';
    var id = '';

    // alert('hah');
    let $this = $(this);
    if (!confirmed) {
        e.preventDefault();

        let chkInOut_id = '';
        let chkInOut_name = '';
        let chkInOut_ic = '';

        var form = new FormData();
        form.append('chkInOut_id', chkInOut_id)
        form.append('chkInOut_name', chkInOut_name);
        form.append('chkInOut_ic', chkInOut_ic);

        let obj = new post(host + 'api_hep/public/hepHostelChkinout/chkBlckOccupied/hostelInfo', form, 'picoms ' + window.sessionStorage.token).execute();

        if (obj.success) {




            let convertList = JSON.stringify(obj.data);
            $("#DatalistLogs").val(convertList);

            var list = [];
            let bil = 1;
            $('#jar').html(''); // Clear the container

            $.each(obj.data, function (i, field) {
                // console.log(field);

                $("#jar").append(
                    `
                  <div class="content row m-b shadow-lg rounded-4" style="border-radius: 25px; width: 800px; margin: auto; display: block;">
                <div class="box-color text-color">
                <!-- start detail student -->
                <div class="col-sm-7 lime-100" style="border-top-left-radius: 25px;border-bottom-left-radius: 25px;padding-block: 18px;">
                <p style="margin-bottom: 0;"><strong >DETAIL STUDENT</strong></p>
                
                <div style=" margin-bottom: 1rem; border: 0; border-top: 1px solid rgba(0, 0, 0, 0.1); "></div>
                
                
                <div class="col-xs-7 mx-auto">
                  <small class="text-muted">Name</small>
                  <div class="_500">` +
                      field.sti_name +
                      `</div>
                </div>
                <div class="col-xs-5">
                  <small class="text-muted">IC No.</small>
                  <div class="_500">` +
                      field.sti_icno +
                      `</div>
                  <small class="text-muted">Matrices No.</small>
                  <div class="_500">` +
                      field.std_id +
                      `</div>
                </div>
                </div>
                <!-- end detail student -->
                
                <div class="col-sm-5" style="border-top-left-radius: 25px;border-bottom-left-radius: 25px;padding-block: 18px;">
                <div class="padding">
                <!-- start hostel student -->
                <div class="col-sm-4 my-auto">
                 <p><strong>Hostel</strong></p>
                 <small>` +
                      field.hostel_name +
                      `</small>
                </div>
                <!-- end hostel student -->
                
                <!-- start block student -->
                <div class="col-sm-4" style="border-right: 1px solid #d7d5d5;border-left: 1px solid #d7d5d5; height: 50%; margin: auto;">
                 <p><strong>Blok</strong></p>
                 <small>` +
                      field.block_name +
                      `</small>
                </div>
                <!-- end block student -->
                
                <!-- start no bilik student -->
                <div class="col-sm-4">
                 <p><strong>No Bilik</strong></p>
                 <small>` +
                      field.room_no +
                      `</small>
                </div>
                <!-- end no bilik student -->
                </div>
                </div>
                
                
                </div>
                </div>
                
                  `
                  );
                

            });

    // Number of items and limits the number of items per page
    var numberOfItems = $("#jar .content").length;
   
    if(numberOfItems!=0){
        $('#content_paging').removeClass('none');

        var limitPerPage = 4;
        // Total pages rounded upwards
        var totalPages = Math.ceil(numberOfItems / limitPerPage);
        // Number of buttons at the top, not counting prev/next,
        // but including the dotted buttons.
        // Must be at least 5:
        var paginationSize = 7; 
        var currentPage;
        function showPage(whichPage) {
    
        // $('#content_paging').removeAttr('style');
            if (whichPage < 1 || whichPage > totalPages) return false;
            currentPage = whichPage;
            $("#jar .content").hide()
                .slice((currentPage-1) * limitPerPage, 
                        currentPage * limitPerPage).show();
            // Replace the navigation items (not prev/next):            
            $("#pagination_ha li").slice(1, -1).remove();
            getPageList(totalPages, currentPage, paginationSize).forEach( item => {
                $("<li>").addClass("page-item")
                         .addClass(item ? "current-page" : "disabled")
                         .toggleClass("active", item === currentPage).append(
                    $("<a>").addClass("page-link").attr({
                        href: "javascript:void(0)"}).text(item || "...")
                ).insertBefore("#next-page");
            });
            // Disable prev/next when at first/last page:
            $("#previous-page").toggleClass("disabled", currentPage === 1);
            $("#next-page").toggleClass("disabled", currentPage === totalPages);
            return true;
        }
    
        // Include the prev/next buttons:
        $("#pagination_ha").append(
            $("<li>").addClass("page-item").attr({ id: "previous-page" }).append(
                $("<a>").addClass("page-link").attr({
                    href: "javascript:void(0)"}).text("Prev")
            ),
            $("<li>").addClass("page-item").attr({ id: "next-page" }).append(
                $("<a>").addClass("page-link").attr({
                    href: "javascript:void(0)"}).text("Next")
            )
        );
        // Show the page links
        $("#jar").show();
        showPage(1);
    
        // Use event delegation, as these items are recreated later    
        $(document).on("click", "#pagination_ha li.current-page:not(.active)", function () {
            return showPage(+$(this).text());
        });
        $("#next-page").on("click", function () {
            return showPage(currentPage+1);
        });
    
        $("#previous-page").on("click", function () {
            return showPage(currentPage-1);
        });

    }else{
        $('#content_paging').addClass('none');

    }

        }

    }

    var chkInOutName = document.getElementById('chkInOut_name');
    if (chkInOutName) {
      chkInOutName.value = '';
    }
    
    // Clear the 'chkInOut_ic' input field
    var chkInOutIC = document.getElementById('chkInOut_ic');
    if (chkInOutIC) {
      chkInOutIC.value = '';
    }
    
    // Clear the 'chkInOut_id' input field
    var chkInOutID = document.getElementById('chkInOut_id');
    if (chkInOutID) {
      chkInOutID.value = '';
    }
});

// $("#searchingInfoStudent").on('click', function (e) {
    
// })

function reportingBaitulmal(returnValue) {
    let checkInDate = $('#chkIndate').val();
    let monthOnly = checkInDate.split('-')[1];
    var yearOnly = checkInDate.split('-')[0];

    console.log(checkInDate);
    let baitulMalCategory = $('#sti_baitulmal').val();
    let asnafCategory = $('#sti_asnaf').val();
    let selectedAsnafName = $('#sti_asnaf option:selected').attr('name');

            var form = new FormData();
            form.append("month", monthOnly);
            form.append("year", yearOnly);
            form.append("asnaf", asnafCategory);
            form.append("baitulMal", baitulMalCategory);

    var settings = {
        "url": host + "api_hep/public/hepHostelChkinout/reporting/reportBaitulMal",
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
        obj_Baitulmal = JSON.parse(response);
        // console.log(obj_Baitulmal);

        var colums = [
            { "name": "bil", "title": "Bil.", "style": "text-align:center;" },
            { "name": "campus", "title": "Campus", "style": "text-align:center;" },
            { "name": "studDet", "title": "Student", "breakpoints": "md sm xs", "style": "text-align:center;" },
            { "name": "studIc", "title": "IC / Passport Number", "style": "text-align:center;" },
            { "name": "hostel", "title": "Hostel", "style": "text-align:center;" },
            // { "name": "block", "title": "Block", "breakpoints": "md sm xs", "style": "text-align:center;" },
            // { "name": "room", "title": "Room", "style": "text-align:center;" },
            { "name": "status", "title": "Status", "style": "text-align:center;" },


        ];

        let bil = 1;
        // let convertList = JSON.stringify(listData);
        // $("#dataList").val(convertList);
        var list = [];

        $.each(obj_Baitulmal.data, function (i, field) {

            list.push({
                bil: bil++,
                campus: field.clg_name,
                studDet: '<span style="font-weight: bold;">'+ field.stud_id + '</span>  <br> ' +field.sti_name    ,
                studIc: '<span class="text-uppercase" >' + field.sti_icno + '</span>',
                hostel: '<span style="font-weight: bold;">'+ field.hostel_name + '</span>  <br> ' +field.block_name + '<br> ' +field.room_no,
                // block: field.block_name,
                // room: field.room_no,
                status: '<span class="text-uppercase">'+ field.checkIn_status + '</span>',


            });

        });

        $("#tableBaitulmal").html('');
        $("#tableBaitulmal").footable({
            "columns": colums,
            "rows": list,
            // "paging": {
            //     "enabled": true,
            //     "size": 10,
            //     "countFormat": "Showing {PF} to {PL} of {TR} data"
            // },
            // "filtering": {
            //     "enabled": true,
            //     "placeholder": "Search...",
            //     "dropdownTitle": "Search for:"
            // }
        });

        returnValue();

        
    });

    button = '<button id="" onclick="generatePDFBaitulMal(\'Baitulmal\', \'tableBaitulmal\', \''+monthOnly+' '+ yearOnly+'\', \''+baitulMalCategory+'\', \''+selectedAsnafName+'\')" class="btn md-raised green"> <i class="fa fa-fw fa-pencil-square-o"></i> <strong>Download PDF</strong></button><button type="button" class="btn dark-white p-x-md" data-dismiss="modal">Close</button>';
        $('#buttonBaitulmal').html(button);


}

hahgila();
function hahgila(){

    setTimeout(() => {
       
    let chkInOut_id = $("#chkInOut_id").val();
    let chkInOut_name = $("#chkInOut_name").val();
    let chkInOut_ic = $("#chkInOut_ic").val();
    // var columns = [
    //     { "name": "bil", "title": "Bil" },
    //     { "name": "activity", "title": "Data Yang Dikemaskini" },
    //     { "name": "datalist", "title": "Datalist" },
    //     //   { "name": "datalist", "title": "Datalist", "style": "max-width: 50px; word-wrap: break-word;" },
    //     { "name": "PIC", "title": "Person In Charge" },
    //     { "name": "created_at", "title": "created_at" },
    //     { "name": "status_rekod", "title": "rekod" },
    // ];

    var form = new FormData();
    form.append('chkInOut_id', chkInOut_id)
    form.append('chkInOut_name', chkInOut_name);
    form.append('chkInOut_ic', chkInOut_ic);

    let obj = new post(host + 'api_hep/public/hepHostelChkinout/chkBlckOccupied/hostelInfo', form, 'picoms ' + window.sessionStorage.token).execute();

    if (obj.success) {




        let convertList = JSON.stringify(obj.data);
        $("#DatalistLogs").val(convertList);

        var list = [];
        let bil = 1;
        $('#jar').html(''); // Clear the container

        $.each(obj.data, function (i, field) {

            $("#jar").append(
                `
              <div class="content row m-b shadow-lg rounded-4" style="border-radius: 25px; width: 800px; margin: auto; display: block;">
            <div class="box-color text-color">
            <!-- start detail student -->
            <div class="col-sm-7 lime-100" style="border-top-left-radius: 25px;border-bottom-left-radius: 25px;padding-block: 18px;">
            <p style="margin-bottom: 0;"><strong >DETAIL STUDENT</strong></p>
            
            <div style=" margin-bottom: 1rem; border: 0; border-top: 1px solid rgba(0, 0, 0, 0.1); "></div>
            
            
            <div class="col-xs-7 mx-auto">
              <small class="text-muted">Name</small>
              <div class="_500">` +
                  field.sti_name +
                  `</div>

                  <small class="text-muted">Checkin Status</small>
              <div class="_500">` +
                  field.checkIn_status +
                  `</div>
            </div>
            <div class="col-xs-5">
              <small class="text-muted">IC No.</small>
              <div class="_500">` +
                  field.sti_icno +
                  `</div>
              <small class="text-muted">Matrices No.</small>
              <div class="_500">` +
                  field.std_id +
                  `</div>
            </div>
            </div>
            <!-- end detail student -->
            
            <div class="col-sm-5" style="border-top-left-radius: 25px;border-bottom-left-radius: 25px;padding-block: 18px;">
            <div class="padding">
            <!-- start hostel student -->
            <div class="col-sm-4 my-auto">
             <p><strong>Hostel</strong></p>
             <small>` +
                  field.hostel_name +
                  `</small>
            </div>
            <!-- end hostel student -->
            
            <!-- start block student -->
            <div class="col-sm-4" style="border-right: 1px solid #d7d5d5;border-left: 1px solid #d7d5d5; height: 50%; margin: auto;">
             <p><strong>Blok</strong></p>
             <small>` +
                  field.block_name +
                  `</small>
            </div>
            <!-- end block student -->
            
            <!-- start no bilik student -->
            <div class="col-sm-4">
             <p><strong>No Bilik</strong></p>
             <small>` +
                  field.room_no +
                  `</small>
            </div>
            <!-- end no bilik student -->
            </div>
            </div>
            
            
            </div>
            </div>
            
              `
              );
            

        });

// Number of items and limits the number of items per page
var numberOfItems = $("#jar .content").length;

if(numberOfItems!=0){
    $('#content_paging').removeClass('none');

    var limitPerPage = 4;
    // Total pages rounded upwards
    var totalPages = Math.ceil(numberOfItems / limitPerPage);
    // Number of buttons at the top, not counting prev/next,
    // but including the dotted buttons.
    // Must be at least 5:
    var paginationSize = 7; 
    var currentPage;
    function showPage(whichPage) {

    // $('#content_paging').removeAttr('style');
        if (whichPage < 1 || whichPage > totalPages) return false;
        currentPage = whichPage;
        $("#jar .content").hide()
            .slice((currentPage-1) * limitPerPage, 
                    currentPage * limitPerPage).show();
        // Replace the navigation items (not prev/next):            
        $("#pagination_ha li").slice(1, -1).remove();
        getPageList(totalPages, currentPage, paginationSize).forEach( item => {
            $("<li>").addClass("page-item")
                     .addClass(item ? "current-page" : "disabled")
                     .toggleClass("active", item === currentPage).append(
                $("<a>").addClass("page-link").attr({
                    href: "javascript:void(0)"}).text(item || "...")
            ).insertBefore("#next-page");
        });
        // Disable prev/next when at first/last page:
        $("#previous-page").toggleClass("disabled", currentPage === 1);
        $("#next-page").toggleClass("disabled", currentPage === totalPages);
        return true;
    }

    // Include the prev/next buttons:
    $("#pagination_ha").append(
        $("<li>").addClass("page-item").attr({ id: "previous-page" }).append(
            $("<a>").addClass("page-link").attr({
                href: "javascript:void(0)"}).text("Prev")
        ),
        $("<li>").addClass("page-item").attr({ id: "next-page" }).append(
            $("<a>").addClass("page-link").attr({
                href: "javascript:void(0)"}).text("Next")
        )
    );
    // Show the page links
    $("#jar").show();
    showPage(1);

    // Use event delegation, as these items are recreated later    
    $(document).on("click", "#pagination_ha li.current-page:not(.active)", function () {
        return showPage(+$(this).text());
    });
    $("#next-page").on("click", function () {
        return showPage(currentPage+1);
    });

    $("#previous-page").on("click", function () {
        return showPage(currentPage-1);
    });

}else{
    $('#content_paging').addClass('none');

}
    }


      }, "1000");

}


function renderDataForPage(data) {
    $('#listDetHostelStudent').empty(); // Clear the container
    $.each(data, function (i, field) {
      // Render each item
      $('#listDetHostelStudent').append(`
        <div class="row m-b shadow-lg rounded-4 pagination" style="border-radius: 25px; width: 800px; margin: auto; display: block;">
          <div class="box-color text-color">
            <!-- start detail student -->
            <div class="col-sm-7 lime-100" style="border-top-left-radius: 25px; border-bottom-left-radius: 25px;">
              <p><strong>Detail Student.</strong></p>
              <div class="col-xs-4">
                <small class="text-muted">Name</small>
                <div class="_500">${field.sti_name}</div>
              </div>
              <div class="col-xs-4">
                <small class="text-muted">Matrices No.</small>
                <div class="_500">${field.std_id}</div>
              </div>
              <div class="col-xs-4">
                <small class="text-muted">IC No.</small>
                <div class="_500"></div>
              </div>
            </div>
            <!-- end detail student -->
            <div class="col-sm-5">
              <!-- start hostel student -->
              <div class="col-sm-4">
                <p><strong>Hostel</strong></p>
                <small>${field.hostel_name}</small>
              </div>
              <!-- end hostel student -->
              <!-- start blok student -->
              <div class="col-sm-4">
                <p><strong>Blok</strong></p>
                <small>${field.block_name}</small>
              </div>
              <!-- start no bilik student -->
              <div class="col-sm-4">
                <p><strong>No Bilik</strong></p>
                <small>${field.room_no}</small>
              </div>
              <!-- end no bilik student -->
            </div>
          </div>
        </div>
      `);
    });
  }

  // Initialize Pagination.js
  $('#listDetHostelStudent').pagination({
    dataSource: data,
    pageSize: 5, // Number of items per page
    callback: function(data, pagination) {
      // Callback function to render the data for the current page
      renderDataForPage(data);
    }
  });


  function slctAsnaf(returnValue) {
    var settings = {
      url: host + "api_public_access/public/AsnafList",
      method: "GET",
      timeout: 0,
    };
  
    $.ajax(settings).done(function (response) {
      obj_asnafType = response;
      returnValue();
    });
  }