// let clg_id = getUrlVars()['id'];
let clg_id = window.sessionStorage.idPage;

$(document).ready(function(){
    $.ajaxSetup ({
        cache: false
    });

    let content = window.sessionStorage.content;
    let token = window.sessionStorage.token;
    let clg_id = window.sessionStorage.idPage;
    if(content != null){
        $('#content').load(content+'.html');

    }
    else{
        $('#content').load('ttpn_takwim.html');
    }

    if(token == null){
        window.location.replace("admin_login.html");
    }

    dataCampus(function(){
        $('#campus_name').html(data.clg_name);
    });
});

var menuModel = function(){
    let self = this;

    self.home = function(){
        window.sessionStorage.removeItem("content");
        window.location.reload();
    };

    // self.stud_dashboard = function(){
    //     window.sessionStorage.content = "stud_dashboard";
    //     $('#content').load('stud_dashboard.html');
    // };

    // tetapan
    self.ttpn_kolejCwgn = function(){
        window.sessionStorage.content = "ttpn_kolejCwgn";
        $('#content').load('ttpn_kolejCwgn.html');
    };

    self.ttpn_takwim = function(){
        window.sessionStorage.content = "ttpn_takwim";
        $('#content').load('ttpn_takwim.html');
    };

    self.fakulti = function(){
        window.sessionStorage.content = "fakulti";
        $('#content').load('fakulti.html');
    };

    self.program = function(){
        window.sessionStorage.content = "program";
        $('#content').load('program.html');
    };
    
    self.currYearSemester = function(){
        window.sessionStorage.content = "currYearSemester";
        $('#content').load('currYearSemester.html');
    };

    self.kursusSubjek = function(){
        window.sessionStorage.content = "kursusSubjek";
        $('#content').load('kursusSubjek.html');
    };

    self.ttpn_kalAkademik = function(){
        window.sessionStorage.content = "ttpn_kalAkademik";
        $('#content').load('ttpn_kalAkademik.html');
    };

    self.lokasi = function(){
        window.sessionStorage.content = "lokasi";
        $('#content').load('lokasi.html');
    };

    self.fakultiPensyarah = function(){
        window.sessionStorage.content = "fakultiPensyarah";
        $('#content').load('fakultiPensyarah.html');
    };

    self.ttpn_jadWaktu = function(){
        window.sessionStorage.content = "ttpn_jadWaktu";
        $('#content').load('ttpn_jadWaktu.html');
    };

    self.skemaMarkah = function(){
        window.sessionStorage.content = "skemaMarkah";
        $('#content').load('skemaMarkah.html');
    };

    self.kredit = function(){
        window.sessionStorage.content = "kredit";
        $('#content').load('kredit.html');
    };

    self.minMaxKredit = function(){
        window.sessionStorage.content = "minMaxKredit";
        $('#content').load('minMaxKredit.html');
    };

    self.cot = function(){
        window.sessionStorage.content = "cot";
        $('#content').load('cot.html');
    };

    self.studRegList = function(){
        window.sessionStorage.content = "studRegList";
        $('#content').load('studRegList.html');
    };

    self.adm_pljrInfo = function(){
        window.sessionStorage.content = "adm_pljrInfo";
        $('#content').load('adm_pljrInfo.html');
    };

    // self.pljr_akademik = function(){
    //     window.sessionStorage.content = "pljr_akademik";
    //     $('#content').load('pljr_akademik.html');
    // };

    // self.pljr_ibuBapaWaris = function(){
    //     window.sessionStorage.content = "pljr_ibuBapaWaris";
    //     $('#content').load('pljr_ibuBapaWaris.html');
    // };

    // self.pljr_addNoTel = function(){
    //     window.sessionStorage.content = "pljr_addNoTel";
    //     $('#content').load('pljr_alamatNoTel.html');
    // };

    // self.pljr_sponsorBank = function(){
    //     window.sessionStorage.content = "pljr_sponsorBank";
    //     $('#content').load('pljr_sponsorBank.html');
    // };

    // self.pljr_daftar = function(){
    //     window.sessionStorage.content = "pljr_daftar";
    //     $('#content').load('pljr_daftar.html');
    // };

    // self.pljr_daftarKursus = function(){
    //     window.sessionStorage.content = "pljr_daftarKursus";
    //     $('#content').load('pljr_daftarKursus.html');
    // };

    self.adm_cect = function(){
        window.sessionStorage.content = "adm_cect";
        $('#content').load('adm_cect.html');
    };

    self.adm_pgmChange = function(){
        window.sessionStorage.content = "adm_pgmChange";
        $('#content').load('adm_pgmChange.html');
    };

    self.adm_stdWithdraw = function(){
        window.sessionStorage.content = "adm_stdWithdraw";
        $('#content').load('adm_stdWithdraw.html');
    };

    self.adm_resultExam = function(){
        window.sessionStorage.content = "adm_resultExam";
        $('#content').load('adm_resultExam.html');
    };
    
    self.pol_kehadiran = function(){
        window.sessionStorage.content = "pol_kehadiran";
        $('#content').load('pol_kehadiran.html');
    };
    
    self.pol_jadWaktu = function(){
        window.sessionStorage.content = "pol_jadWaktu";
        $('#content').load('pol_jadWaktu.html');
    };

    self.pol_Akademik = function(){
        window.sessionStorage.content = "pol_Akademik";
        $('#content').load('pol_Akademik.html');
    };

    self.pol_kursus = function(){
        window.sessionStorage.content = "pol_kursus";
        $('#content').load('pol_kursus.html');
    };
    
    self.pol_peperiksaan = function(){
        window.sessionStorage.content = "pol_peperiksaan";
        $('#content').load('pol_peperiksaan.html');
    };

    self.adm_lecturer = function(){
        window.sessionStorage.content = "adm_lecturer";
        $('#content').load('adm_lecturer.html');
    };

    // self.pensyarah_ttpnKursus = function(){
    //     window.sessionStorage.content = "pensyarah_ttpnKursus";
    //     $('#content').load('pensyarah_ttpnKursus.html');
    // };
    
    // self.pensyarah_ttpnMengajar = function(){
    //     window.sessionStorage.content = "pensyarah_ttpnMengajar";
    //     $('#content').load('pensyarah_ttpnMengajar.html');
    // };

    self.exam_jenis = function(){
        window.sessionStorage.content = "exam_jenis";
        $('#content').load('exam_jenis.html');
    };

    self.exam_penggredan = function(){
        window.sessionStorage.content = "exam_penggredan";
        $('#content').load('exam_penggredan.html');
    };

    self.exam_pusatPeperiksaan = function(){
        window.sessionStorage.content = "exam_pusatPeperiksaan";
        $('#content').load('exam_pusatPeperiksaan.html');
    };
    
    self.exam_jadualWaktu = function(){
        window.sessionStorage.content = "exam_jadualWaktu";
        $('#content').load('exam_jadualWaktu.html');
    };

    self.adm_timetable = function(){
        window.sessionStorage.content = "adm_timetable";
        $('#content').load('adm_timetable.html');
    };

    self.adm_atdQR = function(){
        window.sessionStorage.content = "adm_atdQR";
        $('#content').load('adm_atdQR.html');
    };

    self.adm_atdStudent = function(){
        window.sessionStorage.content = "adm_atdStudent";
        $('#content').load('adm_atdStudent.html');
    };

    self.logKeluar = function(){
        swal({
            title: "Logout",
            text: "Are you sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Yes",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            window.sessionStorage.clear();
            window.location.reload();
        });
    };
}
const menuApp = document.querySelector("#menu-app");
ko.applyBindings(new menuModel(), menuApp);


function dataCampus(returnValue){
    var form = new FormData();
    form.append("clg_id", clg_id);

    var settings = {
        "url": host+"api_tetapan_picoms/public/college",
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
    };

    $.ajax(settings).done(function (response) {
        let result = JSON.parse(response);
        data = result.data;
        returnValue();
    });
}

$('#menuCampus').click(function(){
    window.location.replace('campusPage.html');
    window.sessionStorage.removeItem('idPage');
});