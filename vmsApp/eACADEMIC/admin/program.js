$(function(){
    $.ajaxSetup ({
        cache: false
    });

    $.fn.select2.defaults.set( "theme", "bootstrap" );

    let clg_id = window.sessionStorage.idPage;
    let getFaculty = window.sessionStorage.selectedFac;
    $('#clg_id').val(clg_id);

    // select Faculty
    facCamList(clg_id, function(){
        $.each(obj_facCampus.data, function (i, item){
            $('#fac_id').append('<option value="'+item.facCamId+'">'+item.facCode+' - '+item.fac_name+'</option>');
        });
        $('#fac_id').val(getFaculty).trigger("change");

        $('.slct2').select2({
            width: null,
            containerCssClass: ':all:',
        });
    });

    if(getFaculty != null){
        getPgmByFac(getFaculty);
        window.sessionStorage.removeItem('selectedFac');
    }
});
var confirmed = false;


//onchange select Faculty
$('#fac_id').change(function(){
    let fac_id = $(this).val();
    $("#programList").html('');

    getPgmByFac(fac_id);
});


// btn detail programme
function detail(indexs){
    let d = JSON.parse($('#dataList').val());
    let data = d[indexs];

    window.sessionStorage.prog_id = data.prog_id;
    window.sessionStorage.selectedFac = data.fac_id;
    window.location.replace('programDet.html');
}


//-------------------------------------------------- switcher open/close programme --------------------------------------------------//
function progStatus(prog_id, pk_id){
    let facID = $('#fac_id').val();
    let pgmCam_id = pk_id.value;
    let clg_id = $('#clg_id').val();

    if ($('#pgm_'+prog_id).prop('checked')){
        var form = new FormData();
        form.append("pgm_id", prog_id);
        form.append("cam_id", clg_id);
        
        var settings = {
            "url": host+"api_tetapan_picoms/public/misPrmProgcampus/dataChecking",
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
            let data = result.data;
            
            if (result.success){
                if(data.length > 0){
                    // update
                    swal({
                        title: "Open Programme",
                        text: "Are You Sure?",
                        type: "question",
                        showCancelButton: true,
                        confirmButtonText: "Save",
                        confirmButtonColor: "#2196f3",
                        closeOnConfirm: true,
                        allowOutsideClick: false,
                        html: false
                    }).then(function (){
                        var form = new FormData();
                        form.append("pk_id", pgmCam_id);
                        form.append("prog_status", 'Active');
                        
                        var settings = {
                            "url": host+"api_tetapan_picoms/public/misPrmProgcampus/update",
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
                            if (!result.success){
                                Swal(result.message, result.data, "error");
                                return;
                            }
                            getPgmByFac(facID);
                        });
                    }, 
                    function (dismiss){
                        if (dismiss === 'cancel'){
                            $('#pgm_'+prog_id).prop('checked',false);
                        }
                    });
                }
                else{
                    // add
                    swal({
                        title: "Open Programme",
                        text: "Are You Sure?",
                        type: "question",
                        showCancelButton: true,
                        confirmButtonText: "Save",
                        confirmButtonColor: "#2196f3",
                        closeOnConfirm: true,
                        allowOutsideClick: false,
                        html: false
                    }).then(function (){
                        var form = new FormData();
                        form.append("pgm_id", prog_id);
                        form.append("cam_id", clg_id);
                        form.append("fac_id", facID);
                        form.append("prog_status", 'Active');
                        
                        var settings = {
                            "url": host+"api_tetapan_picoms/public/misPrmProgcampus/register",
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
                            if (!result.success){
                                Swal(result.message, result.data, "error");
                                return;
                            }
                            getPgmByFac(facID);
                        });
                    }, 
                    function (dismiss){
                        if (dismiss === 'cancel') {
                            $('#pgm_'+prog_id).prop('checked',false);
                        }
                    });
                }
            }
            else{
                Swal(result.message, result.data, "error");
                return;
            }
        });
    }
    else{
        swal({
            title: "Close Programme",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (){
            var form = new FormData();
            form.append("pk_id", pgmCam_id);
            form.append("prog_status", 'In-active');
            
            var settings = {
                "url": host+"api_tetapan_picoms/public/misPrmProgcampus/update",
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
                if (!result.success){
                    Swal(result.message, result.data, "error");
                    return;
                }
                getPgmByFac(facID);
            });
        }, 
		function (dismiss){
			if (dismiss === 'cancel') {
				$('#pgm_'+prog_id).prop('checked',true);
			}
		});
    }
}
//-------------------------------------------------- end switcher open/close programme --------------------------------------------------//


// get list program by faculty
function getPgmByFac(facId){

    

    programFac(facId, function(){
        var columns = [
            { "name": "switchBtn", "title": "#" },
            { "name": "pgm_category", "title": "Level of Study", "breakpoints": "md sm xs"},
            { "name": "pgm_id", "title": "Code" },
            { "name": "pgm_name", "title": "Programme" },
            { "name": "upt_btn", "title": "Action", "breakpoints": "md sm xs" },
        ];

        let bil = 1;
        let convertList = JSON.stringify(obj_programFac.data);
        $("#dataList").val(convertList);
        let list = [];

        let hideuptProg = '';

            // uptProgHidden = load_capaian();      
            load_capaian();
            uptProgHidden = window.capaianData;
            console.log(load_capaian());
            
            if (uptProgHidden == 0){
                hideuptProg = 'hidden';
            }
            else{
                hideuptProg = '';
            }

        $.each(obj_programFac.data, function (i, field){

            list.push({
                
                bil: bil++, pgm_category: '<span class="text-uppercase">'+field.category_name+'</span>', pgm_id: '<span class="text-uppercase">'+field.pgm_id+'</span>', 
                pgm_name: '<span class="text-uppercase">'+field.pgm_name+'</span>', 
                "upt_btn": '<button class="btn btn-icon accent" title="Details" onclick="detail(\'' + i + '\')" id="btnPerincian"><i class="ion-ios-list-outline"></i></button>',
                "switchBtn": '<label class="ui-switch data-ui-switch-md success m-t-xs btn_update_sc_programme" '+hideuptProg+'>'+
                                '<input type="checkbox" id="pgm_'+field.prog_id+'" onclick="progStatus('+field.prog_id+',this)">'+
                                '<i></i>'+
                            '</label>'
            });

            pgmStatusView(field.prog_id, function(){
                $.each(obj_pgmStatus, function(j, itemJ){
                    $('#pgm_'+itemJ.pgm_id).val(itemJ.pk_id);

                    if(itemJ.prog_status == 'Active'){
                        $('#pgm_'+itemJ.pgm_id).prop('checked',true);
                    }
                });
            })

        });

        $("#programList").footable({
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

function programFac(id, returnValue){
    if(id > 0){
        $.ajax({
            "url": host+"api_tetapan_picoms/public/misPrmProg/listByFaculty/"+id,
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Authorization": "picoms " + window.sessionStorage.token
            },
            success:function(response){
                obj_programFac = response;
                returnValue();
            },
            error:function(response){
                obj_programFac = false;
                returnValue()
            }
        });
    }
}

function pgmStatusView(prog_id, returnValue){
    let clg_id = $('#clg_id').val();

    var form = new FormData();
    form.append("pgm_id", prog_id);
    form.append("cam_id", clg_id);

    var settings = {
        "url": host+"api_tetapan_picoms/public/misPrmProgcampus/show",
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
        let result = JSON.parse(response);
        obj_pgmStatus = result.data;
        returnValue();
    });
}