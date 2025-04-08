<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\stdTawaran;
use App\Models\mis_prm_programme;
use App\Models\mis_prm_curyear;
use App\Models\mis_std_info;
use App\Models\mis_std_parent;
use App\Models\mis_std_registration;
use App\Models\mis_std_academic;
use App\Models\mis_std_financial;
use App\Models\mis_std_status;
use App\Models\sad_users;
// use DB;
use Illuminate\Support\Facades\DB;

class mis_std_infoController extends Controller
{
    public function  __construct()
    {
        $this->middleware('auth');
    }

    public function create(Request $request)
    {

        $std_studentid        = $request->input('std_studentid');
        $sti_name             = $request->input('sti_name');
        $sti_icno             = $request->input('sti_icno');
        $pgm_id               = $request->input('pgm_id');
        $crs_code             = $request->input('crs_code');
        $sti_gender           = $request->input('sti_gender');
        $sti_nationality      = $request->input('sti_nationality');
        $sti_status_bumiputra      = $request->input('sti_status_bumiputra');
        $sti_race             = $request->input('sti_race');
        $sti_religion         = $request->input('sti_religion');
        $sti_status_oku       = $request->input('sti_status_oku');
        $sti_blood_type       = $request->input('sti_blood_type');
        $sti_email            = $request->input('sti_email');
        $sti_address_1        = $request->input('sti_address_1');
        $sti_address_2        = $request->input('sti_address_2');
        $sti_address_3        = $request->input('sti_address_3');
        $sti_postcode         = $request->input('sti_postcode');
        $sti_state            = $request->input('sti_state');
        $sti_contactno_home   = $request->input('sti_contactno_home');
        $sti_contactno_mobile = $request->input('sti_contactno_mobile');
        $sti_bank_id          = $request->input('sti_bank_id');
        $sti_bank_accountno   = $request->input('sti_bank_accountno');
        $recordstatus         = $request->input('recordstatus');
        // $sti_image            = $std_studentid.'_PROFILE';

        $par_father_name             = $request->input('par_father_name');
        $par_father_address          = $request->input('par_father_address');
        $par_father_contactno        = $request->input('par_father_contactno');
        $par_father_occupation       = $request->input('par_father_occupation');
        $par_nextofkin               = $request->input('par_nextofkin');
        $par_kin_address             = $request->input('par_kin_address');
        $par_kin_contactno           = $request->input('par_kin_contactno');
        $par_mother_name             = $request->input('par_mother_name');
        $par_mother_address          = $request->input('par_mother_address');
        $par_mother_contactno        = $request->input('par_mother_contactno');
        $par_mother_occupation       = $request->input('par_mother_occupation');
        $par_parent_relation         = $request->input('par_parent_relation');
        $par_family_income           = $request->input('par_family_income');
        $par_family_responsibility   = $request->input('par_family_responsibility');
        $par_living_with             = $request->input('par_living_with');

        $srg_payment_via             = $request->input('srg_payment_via');
        $srg_payment_resit           = $request->input('srg_payment_resit');
        $srg_payment_resitdoc        = $std_studentid . '_RESIT_NEW_REG';

        $sta_muet                    = $request->input('sta_muet');
        $sta_bm_spm                  = $request->input('sta_bm_spm');
        $sta_bm_stpm                 = $request->input('sta_bm_stpm');
        $sta_cert_doc                = $std_studentid . '_CERT';
        $sta_spm_doc                 = $std_studentid . '_SPM';
        $sta_stpm_doc                = $std_studentid . '_STPM';
        $sta_diploma_doc             = $std_studentid . '_DIPLOMA';
        $sta_degree_doc              = $std_studentid . '_DEGREE';

        //PROFILE DOC
        if ($file = $request->hasFile('sti_image')) {

            $destinationPath_image = $request->file('sti_image')->getClientOriginalExtension();
            $resitdoc_image = base64_encode(file_get_contents($request->file('sti_image')->getRealPath()));
        } else {
            $resitdoc_image = '';
        }

        //RECEIPT DOC
        if ($file = $request->hasFile('srg_payment_resitdoc')) {
            $file = $request->file('srg_payment_resitdoc');
            $fileExt = $file->getClientOriginalExtension();
            $resitdoc = $srg_payment_resitdoc . '.' . $fileExt;
            $destinationPath = public_path();
            // $destinationPath = public_path().'\resit' ;
            $file->move($destinationPath, $resitdoc);
        } else {
            $resitdoc = '';
        }

        //CERT DOC
        if ($file = $request->hasFile('sta_cert_doc')) {
            $file_cert = $request->file('sta_cert_doc');
            $fileExt_cert = $file_cert->getClientOriginalExtension();
            $resitdoc_cert = $sta_cert_doc . '.' . $fileExt_cert;
            $destinationPath_cert = public_path();
            // // $destinationPath_cert = public_path().'\academic' ;
            $file_cert->move($destinationPath_cert, $resitdoc_cert);
        } else {
            $resitdoc_cert = '';
        }

        //SPM DOC
        if ($file = $request->hasFile('sta_spm_doc')) {
            $file_spm = $request->file('sta_spm_doc');
            $fileExt_spm = $file_spm->getClientOriginalExtension();
            $resitdoc_spm = $sta_spm_doc . '.' . $fileExt_spm;
            $destinationPath_spm = public_path();
            // // $destinationPath_spm = public_path().'\academic' ;
            $file_spm->move($destinationPath_spm, $resitdoc_spm);
        } else {
            $resitdoc_spm = '';
        }

        //STPM DOC
        if ($file = $request->hasFile('sta_stpm_doc')) {
            $file_stpm = $request->file('sta_stpm_doc');
            $fileExt_stpm = $file_stpm->getClientOriginalExtension();
            $resitdoc_stpm = $sta_stpm_doc . '.' . $fileExt_stpm;
            $destinationPath_stpm = public_path();
            // // $destinationPath_stpm = public_path().'\academic' ;
            $file_stpm->move($destinationPath_stpm, $resitdoc_stpm);
        } else {
            $resitdoc_stpm = '';
        }

        //DIPLOMA DOC
        if ($file = $request->hasFile('sta_diploma_doc')) {
            $file_diploma = $request->file('sta_diploma_doc');
            $fileExt_diploma = $file_diploma->getClientOriginalExtension();
            $resitdoc_diploma = $sta_diploma_doc . '.' . $fileExt_diploma;
            $destinationPath_diploma = public_path();
            // // $destinationPath_diploma = public_path().'\academic' ;
            $file_diploma->move($destinationPath_diploma, $resitdoc_diploma);
        } else {
            $resitdoc_diploma = '';
        }

        //DEGREE DOC
        if ($file = $request->hasFile('sta_degree_doc')) {
            $file_degree = $request->file('sta_degree_doc');
            $fileExt_degree = $file_degree->getClientOriginalExtension();
            $resitdoc_degree = $sta_degree_doc . '.' . $fileExt_degree;
            $destinationPath_degree = public_path();
            // // $destinationPath_degree = public_path().'\academic' ;
            $file_degree->move($destinationPath_degree, $resitdoc_degree);
        } else {
            $resitdoc_degree = '';
        }

        $fin_fees                  = $request->input('fin_fees');

        $sts_cur_year                = $request->input('sts_cur_year');
        $sts_cur_intake              = $request->input('sts_cur_intake');
        $sts_semester                = $request->input('sts_semester');
        $sts_status                  = $request->input('sts_status');
        $sts_date_joined             = $request->input('sts_date_joined');
        $sts_date_complete           = $request->input('sts_date_complete');


        $salt = "RMY7nZ3+s8xpU1n0O*0o_EGfdoYtd|iU_AzhKCMoSu_xhh-e|~y8FOG*-xLZ";
        $password     = hash("sha256", $sti_icno . $salt);

        $dataS = [
            'std_studentid'       => $std_studentid,
            'sti_name'       => $sti_name,
            'sti_icno'       => $sti_icno,
            'pgm_id'      => $pgm_id,
            'crs_code' => $crs_code,
            'sti_gender' => $sti_gender,
            'sti_nationality' => $sti_nationality,
            'sti_status_bumiputra' => $sti_status_bumiputra,
            'sti_race' => $sti_race,
            'sti_religion' => $sti_religion,
            'sti_status_oku' => $sti_status_oku,
            'sti_blood_type' => $sti_blood_type,
            'sti_email' => $sti_email,
            'sti_address_1' => $sti_address_1,
            'sti_address_2' => $sti_address_2,
            'sti_address_3' => $sti_address_3,
            'sti_postcode' => $sti_postcode,
            'sti_state' => $sti_state,
            'sti_contactno_home' => $sti_contactno_home,
            'sti_contactno_mobile' => $sti_contactno_mobile,
            'sti_bank_id' => $sti_bank_id,
            'sti_bank_accountno' => $sti_bank_accountno,
            'recordstatus' => $recordstatus,
            'sti_password' => $password,
            'sti_image' => $resitdoc_image,
            'sti_image_path' => $destinationPath_image,
        ];

        $dataSad = [
            'usr_id'  =>  $std_studentid,
            'usr_icno'  =>  $sti_icno,
            'usr_passwd'  =>  $password,
            'usr_name'  =>  $sti_name,
            'profile'  =>  $resitdoc_image,
            'recordstatus'  =>  $recordstatus,
            // 'user_token'  =>  $,
            'usr_status'  =>  'Active',
            'change_password'  =>  'N',
            'usr_startdate'  =>  $sts_date_joined,
            'usr_email'  =>  $sti_email,
            'usr_cat_estudent'  =>  '1',
            'usr_cat_ehep'  =>  '0',
            'usr_cat_ecmis'  =>  '0',
            'usr_cat_ehrms'  =>  '0',
            'usr_cat_admin'  =>  '0',
        ];

        $dataP = [
            'std_studentid'       => $std_studentid,
            'pgm_id'      => $pgm_id,
            'par_father_name'       => $par_father_name,
            'par_father_address' => $par_father_address,
            'par_father_contactno' => $par_father_contactno,
            'par_father_occupation' => $par_father_occupation,
            'par_nextofkin' => $par_nextofkin,
            'par_kin_address' => $par_kin_address,
            'par_kin_contactno' => $par_kin_contactno,
            'par_mother_name' => $par_mother_name,
            'par_mother_address' => $par_mother_address,
            'par_mother_contactno' => $par_mother_contactno,
            'par_mother_occupation' => $par_mother_occupation,
            'par_parent_relation' => $par_parent_relation,
            'par_family_income' => $par_family_income,
            'par_family_responsibility' => $par_family_responsibility,
            'par_living_with' => $par_living_with,
            'recordstatus' => $recordstatus,
        ];

        $dataV = [
            'std_studentid' => $std_studentid,
            'pgm_id' => $pgm_id,
            'srg_payment_via' => $srg_payment_via,
            'srg_payment_resit' => $srg_payment_resit,
            'srg_payment_resitdoc' => $resitdoc,
            'recordstatus' => $recordstatus,
        ];

        $dataA = [
            'std_studentid' => $std_studentid,
            'sta_muet' => $sta_muet,
            'sta_bm_spm' => $sta_bm_spm,
            'sta_bm_stpm' => $sta_bm_stpm,
            'sta_cert_doc' => $resitdoc_cert,
            'sta_spm_doc' => $resitdoc_spm,
            'sta_stpm_doc' => $resitdoc_stpm,
            'sta_diploma_doc' => $resitdoc_diploma,
            'sta_degree_doc' => $resitdoc_degree,
            'recordstatus' => $recordstatus,
        ];

        $dataF = [
            'std_studentid' => $std_studentid,
            'fin_fees' => $fin_fees,
            'recordstatus' => $recordstatus,
        ];

        $dataT = [
            'std_studentid' => $std_studentid,
            'pgm_id' => $pgm_id,
            'sts_cur_year' => $sts_cur_year,
            'sts_cur_intake' => $sts_cur_intake,
            'sts_semester' => $sts_semester,
            'sts_status' => $sts_status,
            'sts_date_joined' => $sts_date_joined,
            'sts_date_complete' => $sts_date_complete,
            'recordstatus' => $recordstatus,
        ];

        //dd('jijik');
        $infoS   = mis_std_info::create($dataS);
        $infoP   = mis_std_parent::create($dataP);
        $infoV   = mis_std_registration::create($dataV);
        $infoA   = mis_std_academic::create($dataA);
        $infoF   = mis_std_financial::create($dataF);
        $infoT   = mis_std_status::create($dataT);
        $infoSad = sad_users::create($dataSad);

        if ($infoS) {

            return response()->json([
                'success' => true,
                'messages' => 'Successfully Register',
                'data' => $infoS,
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'messages' => 'Registration Failed',
                'data' => '',
            ], 400);
        }
    }

    public function update(Request $request)
    {

        $std_studentid        = $request->input('std_studentid');
        $sti_name             = $request->input('sti_name');
        $sti_icno             = $request->input('sti_icno');
        $pgm_id               = $request->input('pgm_id');
        $crs_code             = $request->input('crs_code');
        $sti_gender           = $request->input('sti_gender');
        $sti_nationality      = $request->input('sti_nationality');
        $sti_status_bumiputra      = $request->input('sti_status_bumiputra');
        $sti_race             = $request->input('sti_race');
        $sti_religion         = $request->input('sti_religion');
        $sti_status_oku       = $request->input('sti_status_oku');
        $sti_blood_type       = $request->input('sti_blood_type');
        $sti_email            = $request->input('sti_email');
        $sti_address_1        = $request->input('sti_address_1');
        $sti_address_2        = $request->input('sti_address_2');
        $sti_address_3        = $request->input('sti_address_3');
        $sti_postcode         = $request->input('sti_postcode');
        $sti_state            = $request->input('sti_state');
        $sti_contactno_home   = $request->input('sti_contactno_home');
        $sti_contactno_mobile = $request->input('sti_contactno_mobile');
        $sti_bank_id          = $request->input('sti_bank_id');
        $sti_bank_accountno   = $request->input('sti_bank_accountno');
        $recordstatus         = $request->input('recordstatus');
        $resitdoc_image       = $request->input('sti_image');
        $sti_sponsorship      = $request->input('sti_sponsorship');
        $sti_baitulmal        = $request->input('sti_baitulmal');
        $sti_asnaf            = $request->input('sti_asnaf');

        $par_father_name             = $request->input('par_father_name');
        $par_father_address          = $request->input('par_father_address');
        $par_father_contactno        = $request->input('par_father_contactno');
        $par_father_occupation       = $request->input('par_father_occupation');
        $par_nextofkin               = $request->input('par_nextofkin');
        $par_kin_address             = $request->input('par_kin_address');
        $par_kin_contactno           = $request->input('par_kin_contactno');
        $par_mother_name             = $request->input('par_mother_name');
        $par_mother_address          = $request->input('par_mother_address');
        $par_mother_contactno        = $request->input('par_mother_contactno');
        $par_mother_occupation       = $request->input('par_mother_occupation');
        $par_parent_relation         = $request->input('par_parent_relation');
        $par_family_income           = $request->input('par_family_income');
        $par_family_responsibility   = $request->input('par_family_responsibility');
        $par_living_with             = $request->input('par_living_with');

        $srg_payment_via             = $request->input('srg_payment_via');
        $srg_payment_resit           = $request->input('srg_payment_resit');
        $srg_payment_resitdoc        = '';

        $sta_muet                    = $request->input('sta_muet');
        $sta_bm_spm                  = $request->input('sta_bm_spm');
        $sta_bm_stpm                 = $request->input('sta_bm_stpm');
        $sta_cert_doc                = '';
        $sta_spm_doc                 = '';
        $sta_stpm_doc                = '';
        $sta_diploma_doc             = '';
        $sta_degree_doc              = '';
        $image              = '';


        //PROFILE DOC
        if ($file = $request->hasFile('sti_image')) {
            // dd('1');
            // $destinationPath_image = public_path().'\profile' ;
            $image = base64_encode(file_get_contents($request->file('sti_image')->getRealPath()));
        } else {
            // dd('2');
            // $destinationPath_image = mis_std_infoController::getCurrFile('mis_std_info','sti_image_path',$std_studentid);
            $info_image = mis_std_infoController::getCurrFile('mis_std_info', 'sti_image', $std_studentid);
            $image = $info_image->sti_image;
        }

        //RECEIPT DOC
        if ($file = $request->hasFile('srg_payment_resitdoc')) {
            $srg_payment_resitdoc = $std_studentid . '_RESIT_NEW_REG';
            $file = $request->file('srg_payment_resitdoc');
            $fileExt = $file->getClientOriginalExtension();
            $resitdoc = $srg_payment_resitdoc . '.' . $fileExt;
            $destinationPath = public_path();
            // $destinationPath = public_path().'\resit' ;
            $file->move($destinationPath, $resitdoc);
        } else {
            $info_resit = mis_std_infoController::getCurrFile('mis_std_registration', 'srg_payment_resitdoc', $std_studentid);
            $resitdoc = $info_resit->srg_payment_resitdoc;
        }

        //CERT DOC
        if ($file = $request->hasFile('sta_cert_doc')) {
            $sta_cert_doc = $std_studentid . '_CERT';
            $file_cert = $request->file('sta_cert_doc');
            $fileExt_cert = $file_cert->getClientOriginalExtension();
            $resitdoc_cert = $sta_cert_doc . '.' . $fileExt_cert;
            $destinationPath_cert = public_path();
            // $destinationPath_cert = public_path().'\academic' ;
            $file_cert->move($destinationPath_cert, $resitdoc_cert);
        } else {
            $info_cert = mis_std_infoController::getCurrFile('mis_std_academic', 'sta_cert_doc', $std_studentid);
            $resitdoc_cert = $info_cert->sta_cert_doc;
        }

        //SPM DOC
        if ($file = $request->hasFile('sta_spm_doc')) {
            $sta_spm_doc = $std_studentid . '_SPM';
            $file_spm = $request->file('sta_spm_doc');
            $fileExt_spm = $file_spm->getClientOriginalExtension();
            $resitdoc_spm = $sta_spm_doc . '.' . $fileExt_spm;
            $destinationPath_spm = public_path();
            // $destinationPath_spm = public_path().'\academic' ;
            $file_spm->move($destinationPath_spm, $resitdoc_spm);
        } else {
            $info_spm = mis_std_infoController::getCurrFile('mis_std_academic', 'sta_spm_doc', $std_studentid);
            $resitdoc_spm = $info_spm->resitdoc_spm;
        }

        //STPM DOC
        if ($file = $request->hasFile('sta_stpm_doc')) {
            $sta_stpm_doc = $std_studentid . '_STPM';
            $file_stpm = $request->file('sta_stpm_doc');
            $fileExt_stpm = $file_stpm->getClientOriginalExtension();
            $resitdoc_stpm = $sta_stpm_doc . '.' . $fileExt_stpm;
            $destinationPath_stpm = public_path();
            // $destinationPath_stpm = public_path().'\academic' ;
            $file_stpm->move($destinationPath_stpm, $resitdoc_stpm);
        } else {
            $info_stpm = mis_std_infoController::getCurrFile('mis_std_academic', 'sta_stpm_doc', $std_studentid);
            $resitdoc_stpm = $info_stpm->sta_stpm_doc;
        }

        //DIPLOMA DOC
        if ($file = $request->hasFile('sta_diploma_doc')) {
            $sta_diploma_doc = $std_studentid . '_DIPLOMA';
            $file_diploma = $request->file('sta_diploma_doc');
            $fileExt_diploma = $file_diploma->getClientOriginalExtension();
            $resitdoc_diploma = $sta_diploma_doc . '.' . $fileExt_diploma;
            $destinationPath_diploma = public_path();
            // $destinationPath_diploma = public_path().'\academic' ;

            $info_diploma = mis_std_infoController::getCurrFile('mis_std_academic', 'sta_diploma_doc', $std_studentid);
            //unlink($destinationPath_diploma."/".$info_diploma -> sta_diploma_doc);
            $file_diploma->move($destinationPath_diploma, $resitdoc_diploma);
        } else {
            $info_diploma = mis_std_infoController::getCurrFile('mis_std_academic', 'sta_diploma_doc', $std_studentid);
            $resitdoc_diploma = $info_diploma->sta_diploma_doc;
        }

        //DEGREE DOC
        if ($file = $request->hasFile('sta_degree_doc')) {
            $sta_degree_doc = $std_studentid . '_DEGREE';
            $file_degree = $request->file('sta_degree_doc');
            $fileExt_degree = $file_degree->getClientOriginalExtension();
            $resitdoc_degree = $sta_degree_doc . '.' . $fileExt_degree;
            // $destinationPath_degree = public_path().'\academic' ;
            $destinationPath_degree = public_path();
            $file_degree->move($destinationPath_degree, $resitdoc_degree);
        } else {
            $info_degree = mis_std_infoController::getCurrFile('mis_std_academic', 'sta_degree_doc', $std_studentid);
            $resitdoc_degree = $info_degree->sta_degree_doc;
        }

        $fin_fees                  = $request->input('fin_fees');

        $sts_cur_year                = $request->input('sts_cur_year');
        $sts_cur_intake              = $request->input('sts_cur_intake');
        $sts_semester                = $request->input('sts_semester');
        $sts_status                  = $request->input('sts_status');
        $sts_date_joined             = $request->input('sts_date_joined');
        $sts_date_complete           = $request->input('sts_date_complete');


        // $salt = "RMY7nZ3+s8xpU1n0O*0o_EGfdoYtd|iU_AzhKCMoSu_xhh-e|~y8FOG*-xLZ";
        // $password     = hash("sha256", $sti_icno.$salt);
        // dd($image);

        $dataS = [
            'std_studentid'       => $std_studentid,
            'sti_name'       => $sti_name,
            'sti_icno'       => $sti_icno,
            'pgm_id'      => $pgm_id,
            'crs_code' => $crs_code,
            'sti_gender' => $sti_gender,
            'sti_nationality' => $sti_nationality,
            'sti_status_bumiputra' => $sti_status_bumiputra,
            'sti_race' => $sti_race,
            'sti_religion' => $sti_religion,
            'sti_status_oku' => $sti_status_oku,
            'sti_blood_type' => $sti_blood_type,
            'sti_email' => $sti_email,
            'sti_address_1' => $sti_address_1,
            'sti_address_2' => $sti_address_2,
            'sti_address_3' => $sti_address_3,
            'sti_postcode' => $sti_postcode,
            'sti_state' => $sti_state,
            'sti_contactno_home' => $sti_contactno_home,
            'sti_contactno_mobile' => $sti_contactno_mobile,
            'sti_bank_id' => $sti_bank_id,
            'sti_bank_accountno' => $sti_bank_accountno,
            'recordstatus' => $recordstatus,
            // 'sti_password' => $password,
            'sti_image' => $image,
            'sti_sponsorship' => $sti_sponsorship,
            'sti_baitulmal' => $sti_baitulmal,
            'sti_asnaf' => $sti_asnaf,
            // 'sti_image_path' => $destinationPath_image,
        ];

        $dataP = [
            'std_studentid'       => $std_studentid,
            'pgm_id'      => $pgm_id,
            'par_father_name'       => $par_father_name,
            'par_father_address' => $par_father_address,
            'par_father_contactno' => $par_father_contactno,
            'par_father_occupation' => $par_father_occupation,
            'par_nextofkin' => $par_nextofkin,
            'par_kin_address' => $par_kin_address,
            'par_kin_contactno' => $par_kin_contactno,
            'par_mother_name' => $par_mother_name,
            'par_mother_address' => $par_mother_address,
            'par_mother_contactno' => $par_mother_contactno,
            'par_mother_occupation' => $par_mother_occupation,
            'par_parent_relation' => $par_parent_relation,
            'par_family_income' => $par_family_income,
            'par_family_responsibility' => $par_family_responsibility,
            'par_living_with' => $par_living_with,
            'recordstatus' => $recordstatus,
        ];

        $dataV = [
            'std_studentid' => $std_studentid,
            'pgm_id' => $pgm_id,
            'srg_payment_via' => $srg_payment_via,
            'srg_payment_resit' => $srg_payment_resit,
            'srg_payment_resitdoc' => $resitdoc,
            'recordstatus' => $recordstatus,
        ];

        $dataA = [
            'std_studentid' => $std_studentid,
            'sta_muet' => $sta_muet,
            'sta_bm_spm' => $sta_bm_spm,
            'sta_bm_stpm' => $sta_bm_stpm,
            'sta_cert_doc' => $resitdoc_cert,
            'sta_spm_doc' => $resitdoc_spm,
            'sta_stpm_doc' => $resitdoc_stpm,
            'sta_diploma_doc' => $resitdoc_diploma,
            'sta_degree_doc' => $resitdoc_degree,
            'recordstatus' => $recordstatus,
        ];

        $dataF = [
            'std_studentid' => $std_studentid,
            'fin_fees' => $fin_fees,
            'recordstatus' => $recordstatus,
        ];

        $dataT = [
            'std_studentid' => $std_studentid,
            'pgm_id' => $pgm_id,
            'sts_cur_year' => $sts_cur_year,
            'sts_cur_intake' => $sts_cur_intake,
            'sts_semester' => $sts_semester,
            'sts_status' => $sts_status,
            'sts_date_joined' => $sts_date_joined,
            'sts_date_complete' => $sts_date_complete,
            'recordstatus' => $recordstatus,
        ];

        $infoS = mis_std_info::where('std_studentid', $std_studentid)->update($dataS);
        $infoP = mis_std_parent::where('std_studentid', $std_studentid)->update($dataP);
        $infoV = mis_std_registration::where('std_studentid', $std_studentid)->update($dataV);
        $infoA = mis_std_academic::where('std_studentid', $std_studentid)->update($dataA);
        $infoF = mis_std_financial::where('std_studentid', $std_studentid)->update($dataF);
        $infoT = mis_std_status::where('std_studentid', $std_studentid)->update($dataT);

        if ($infoS) {

            return response()->json([
                'success' => true,
                'messages' => 'Successfully Register',
                'data' => $infoS,
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'messages' => 'Registration Failed',
                'data' => '',
            ], 400);
        }
    }

    public function list(Request $request)
    {

        // $first_name     = $request->input('first_name');
        // $mykad          = $request->input('mykad');
        // $offer_choice   = $request->input('offer_choice');

        // if($first_name == '' && $mykad == ''){

        //     $register = mis_std_info::select('*')
        //             ->leftJoin('mis_prm_programme', 'mis_prm_programme.pgm_id', '=', 'mis_std_info.pgm_id')
        //             ->leftJoin('mis_std_status', 'mis_std_status.pgm_id', '=', 'mis_prm_programme.pgm_id')
        //             ->where('mis_std_info.recordstatus',1)
        //             ->get();

        // }
        // else {

        //     $register = mis_std_info::select('*')
        //             ->leftJoin('mis_prm_programme', 'mis_prm_programme.pgm_id', '=', 'mis_std_info.pgm_id')
        //             ->where('mis_std_info.recordstatus',1);

        //     if($first_name != ''){ //SEARCHING BY STUDENT ID [IF SEARCHING FIELD NOT EMPTY]
        //         $register = $register->where('first_name', 'like', '%' . $first_name . '%');
        //     }

        //     if($mykad != ''){ //SEARCHING BY STUDENT ID [IF SEARCHING FIELD NOT EMPTY]
        //         $register = $register->where('mykad', 'like', '%' . $mykad . '%');
        //     }

        //     if($offer_choice != ''){ //SEARCHING BY PROGRAM ID [IF SEARCHING FIELD NOT EMPTY]
        //         $register = $register->where('offer_choice',$offer_choice);
        //     }

        //     $register = $register->get();

        // }

        $register = mis_std_info::select('*')
            ->leftJoin('mis_std_parent', 'mis_std_parent.std_studentid', '=', 'mis_std_info.std_studentid')
            ->leftJoin('mis_prm_programme', 'mis_prm_programme.pgm_id', '=', 'mis_std_info.pgm_id')
            ->leftJoin('mis_std_registration', 'mis_std_registration.std_studentid', '=', 'mis_std_info.std_studentid')
            ->leftJoin('mis_std_status', 'mis_std_status.std_studentid', '=', 'mis_std_info.std_studentid')
            ->leftJoin('mis_std_financial', 'mis_std_financial.std_studentid', '=', 'mis_std_info.std_studentid')
            ->leftJoin('mis_std_academic', 'mis_std_academic.std_studentid', '=', 'mis_std_info.std_studentid')
            ->leftJoin('mis_status', 'mis_status.sts_status_code', '=', 'mis_std_status.sts_status')
            ->where([['mis_std_info.recordstatus', '!=', 'DEL']])
            ->get();

        if ($register) {

            return response()->json([
                'success' => true,
                'messages' => 'Proses Berjaya',
                'data' => $register,
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'messages' => 'Proses Gagal',
                'data' => '',
            ], 400);
        }
    }

    public function show(Request $request)
    {

        $id = $request->input('std_studentid');

        $output = mis_std_info::select('*')
            // ->leftJoin('mis_prm_programme', 'mis_prm_programme.pgm_id', '=', 'std_info.offer_choice')
            ->where([
                ['recordstatus', '!=', 'DEL'],
                ['std_studentid', '=', $id]
            ])->first();

        if ($output) {

            return response()->json([
                'success' => true,
                'messages' => 'Proses Berjaya',
                'data' => $output,
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'messages' => 'Proses Gagal',
                'data' => '',
            ], 400);
        }
    }

    public function show2($id)
    {

        // $id = $request->input('std_studentid');

        $output = mis_std_info::select('*')
            // ->leftJoin('mis_prm_programme', 'mis_prm_programme.pgm_id', '=', 'std_info.offer_choice')
            ->where([
                ['recordstatuss', '!=', 'DEL'],
                ['std_studentid', '=', $id]
            ])->first();

        if ($output) {

            return response()->json([
                'success' => true,
                'messages' => 'Proses Berjaya',
                'data' => $output,
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'messages' => 'Proses Gagal',
                'data' => '',
            ], 400);
        }
    }

    public function getCurrFile($tablename, $param1, $param2)
    {

        $output = '';

        if ($tablename == 'mis_std_registration') {
            $output = mis_std_registration::select($param1)
                ->where([
                    ['mis_std_registration.recordstatus', '!=', 'DEL'],
                    ['mis_std_registration.std_studentid', '=', $param2]
                ])->first();
        } else if ($tablename == 'mis_std_academic') {
            $output = mis_std_academic::select($param1)
                ->where([
                    ['mis_std_academic.recordstatus', '!=', 'DEL'],
                    ['mis_std_academic.std_studentid', '=', $param2]
                ])->first();
        } else if ($tablename == 'mis_std_info') {
            $output = mis_std_info::select($param1)
                ->where([
                    ['mis_std_info.recordstatus', '!=', 'DEL'],
                    ['mis_std_info.std_studentid', '=', $param2]
                ])->first();
        }

        return $output;
    }

    public function studentIdChecking(Request $request)
    {
        $input = $request->input('input');

        $query = mis_std_info::where([
            ['std_studentid', '=', $input],
            ['recordstatus', '!=', 'DEL']
        ])
            ->get(['std_studentid', 'sti_name']);

        if ($query) {
            return response()->json([
                'success' => true,
                'message' => "Carian Berjaya!",
                'data' => $query
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Carian Gagal!",
                'data' => ''
            ], 404);
        }
    }

    public function delete(Request $request)
    {
        $std_studentid = $request->input('std_studentid');
        $recordstatus = $request->input('recordstatus');

        $infoS = mis_std_info::where('std_studentid', $std_studentid)->update([
            'recordstatus' => $recordstatus,
        ]);
        $infoP = mis_std_parent::where('std_studentid', $std_studentid)->update([
            'recordstatus' => $recordstatus,
        ]);
        $infoV = mis_std_registration::where('std_studentid', $std_studentid)->update([
            'recordstatus' => $recordstatus,
        ]);
        $infoA = mis_std_academic::where('std_studentid', $std_studentid)->update([
            'recordstatus' => $recordstatus,
        ]);
        $infoF = mis_std_financial::where('std_studentid', $std_studentid)->update([
            'recordstatus' => $recordstatus,
        ]);
        $infoT = mis_std_status::where('std_studentid', $std_studentid)->update([
            'recordstatus' => $recordstatus,
        ]);


        if ($infoS) {
            return response()->json([
                'success' => true,
                'message' => "Remove Success!",
                'data' => $infoS
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Failed to Remove!",
                'data' => ''
            ], 404);
        }
    }

    public function studentSem(Request $request)
    {
        $std_studentid = $request->input('std_studentid');
        $fk_acaCal = $request->input('fk_acaCal');

        $obj = mis_std_info::where([
            ['mis_std_info.std_studentid', '=', $std_studentid],
            ['mis_std_curAcademic.fk_acaCal', '=', $fk_acaCal]
        ])
            ->leftJoin('mis_std_curAcademic', 'mis_std_curAcademic.std_studentid', '=', 'mis_std_info.std_studentid')
            ->select(
                'mis_std_info.std_studentid',
                'mis_std_curAcademic.std_semester',
                'mis_std_curAcademic.std_senate_endorsement',
                'mis_std_curAcademic.std_gpa',
                'mis_std_curAcademic.std_cgpa',
                'mis_std_curAcademic.tc'
            )
            ->first();

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "Data Success!",
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Data Failed",
                'data' => ''
            ], 404);
        }
    }


    // show data student (portal student)
    public function infoShow($id)
    {
        $obj = mis_std_info::where([
            ['mis_std_info.recordstatus', '!=', 'DEL'],
            ['mis_std_info.std_studentid', '=', $id]
        ])
            ->leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_std_info.pgm_fk')
            ->leftjoin('mis_nationality', 'mis_nationality.pk_id', '=', 'mis_std_info.sti_nationality')
            ->leftjoin('mis_race', 'mis_race.sti_race_id', '=', 'mis_std_info.sti_race')
            ->leftjoin('mis_native', 'mis_native.pk_id', '=', 'mis_std_info.sti_status_bumiputra')
            ->leftjoin('mis_religion', 'mis_religion.sti_religion_id', '=', 'mis_std_info.sti_religion')
            ->leftjoin('mis_status_oku', 'mis_status_oku.sti_status_oku_id', '=', 'mis_std_info.sti_status_oku')
            ->leftjoin('mis_blood_type', 'mis_blood_type.sti_blood_type_id', '=', 'mis_std_info.sti_blood_type')
            ->leftjoin('mis_gender', 'mis_gender.sti_gender_id', '=', 'mis_std_info.sti_gender')
            ->leftjoin('aca_cal_category', 'aca_cal_category.pk_id', '=', 'mis_prm_programme.pgm_area')
            ->first([
                'pgm_name',
                'pgm_fk',
                'pgm_status',
                'mis_std_info.pgm_id',
                'fac_id',
                'sti_name',
                'sti_session_id',
                'sti_nationality_name',
                'mis_std_info.sti_nationality',
                'sti_race_name',
                'sti_native_name',
                'sti_religion_name',
                'sti_status_oku_name',
                'sti_blood_type_name',
                'sti_email',
                'sti_bank_id',
                'sti_bank_accountno',
                'sti_gender_name',
                'sti_address_1',
                'sti_address_2',
                'sti_address_3',
                'sti_postcode',
                'sti_state',
                'sti_contactno_home',
                'sti_contactno_mobile',
                'sti_icno',
                'cur_intake',
                'status_academic',
                'category',
                'pgm_area',
                'mis_prm_programme.pgm_duration',
            ]);

        if ($obj) {
            return response()->json([
                'success' => true,
                'messages' => 'Proses Berjaya',
                'data' => $obj,
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'messages' => 'Proses Gagal',
                'data' => '',
            ], 201);
        }
    }


    public function pljr_alamat(Request $request)
    {
        $std_studentid = $request->input('std_studentid');
        $sti_address_1 = $request->input('sti_address_1');
        $sti_address_2 = $request->input('sti_address_2');
        $sti_address_3 = $request->input('sti_address_3');
        $sti_postcode = $request->input('sti_postcode');
        $negeriList = $request->input('negeriList');
        $sti_contactno_home = $request->input('sti_contactno_home');
        $sti_contactno_mobile = $request->input('sti_contactno_mobile');
        $sti_email = $request->input('sti_email');

        $data = [
            'sti_address_1' => $sti_address_1,
            'sti_address_2' => $sti_address_2,
            'sti_address_3' => $sti_address_3,
            'sti_postcode' => $sti_postcode,
            'sti_state' => $negeriList,
            'sti_contactno_home' => $sti_contactno_home,
            'sti_contactno_mobile' => $sti_contactno_mobile,
            'sti_email' => $sti_email
        ];

        $infoS = mis_std_info::where('std_studentid', $std_studentid)->update($data);

        if ($infoS) {
            return response()->json([
                'success' => true,
                'message' => "Update Success!",
                'data' => $infoS
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Failed to update!",
                'data' => ''
            ], 404);
        }
    }


    // update status academic student
    public function uptSttsAca(Request $request)
    {
        $std_studentid = $request->input('std_studentid');
        $status_academic = $request->input('status_academic');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_std_info::where([['std_studentid', '=', $std_studentid]])->update([
            'status_academic' => $status_academic,
            'recordstatus' => $recordstatus,
        ]);

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "Update Success!",
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Update Failed!",
                'data' => ''
            ], 404);
        }
    }


    // count New student
    public function countNewStd()
    {
        $obj = mis_std_info::where([['recordstatus', '=', 'ADD']])->get(['std_studentid']);

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "List Success!",
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "List Fail!",
                'data' => ''
            ], 404);
        }
    }


    // count Active student
    public function countActStd()
    {
        $obj = mis_std_info::where([['status_academic', 1], ['recordstatus', '!=', 'DEL']])->get(['std_studentid']);

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "List Success!",
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "List Fail!",
                'data' => ''
            ], 404);
        }
    }


    // count International student
    public function countIntStd()
    {
        $obj = mis_std_info::where([['sti_nationality', 1], ['recordstatus', '!=', 'DEL']])->get(['std_studentid']);

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "List Success!",
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "List Fail!",
                'data' => ''
            ], 404);
        }
    }


    // list student status==Registered
    public function listStdReg()
    {
        // $obj = mis_std_info::where([['status_academic',4],['mis_std_info.recordstatus','!=','DEL']]) 
        //     ->leftJoin('mis_prm_college', 'mis_prm_college.pk_id','=','mis_std_info.cam_id')
        //     ->leftJoin('mis_gender', 'mis_gender.sti_gender_id','=','mis_std_info.sti_gender')
        //     ->leftJoin('hep_hostel_chkinout', 'hep_hostel_chkinout.stud_id','=','mis_std_info.std_studentid')
        //     ->get([
        //         'std_studentid',
        //         'sti_name',
        //         'sti_icno',
        //         'sti_gender',
        //         'cam_id',
        //         'clg_name',
        //         'sti_gender_name',
        //         'checkIn_status',
        //         'chkInOut_id',
        //         'branch_id',
        //         'hostel_id',
        //         'block_id',
        //         'room_id',
        //         'checkIn' 
        //     ]);

        //

        //     $subquery = mis_std_info::select(
        //         'mis_std_info.std_studentid',
        //         'mis_std_info.status_academic',
        //         'mis_std_info.sti_name',
        //         'mis_std_info.sti_icno',
        //         'mis_std_info.sti_gender',
        //         'mis_std_info.cam_id',
        //         'mis_prm_college.clg_name',
        //         'mis_gender.sti_gender_name',
        //         'hep_hostel_chkinout.checkIn_status',
        //         'hep_hostel_chkinout.chkInOut_id',
        //         'hep_hostel_chkinout.branch_id',
        //         'hep_hostel_chkinout.hostel_id',
        //         'hep_hostel_chkinout.block_id',
        //         'hep_hostel_chkinout.room_id',
        //         'hep_hostel_chkinout.reason',
        //         'hep_hostel_chkinout.checkIn',
        //         'hep_hostel_chkinout.checkOut_status'
        //         // DB::raw('ROW_NUMBER() OVER (PARTITION BY mis_std_info.std_studentid ORDER BY hep_hostel_chkinout.checkIn DESC) AS row_num')
        //     )
        //     ->leftJoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'mis_std_info.cam_id')
        //     ->leftJoin('mis_gender', 'mis_gender.sti_gender_id', '=', 'mis_std_info.sti_gender')
        //     // ->leftJoin('hep_hostel_chkinout', 'hep_hostel_chkinout.stud_id', '=', 'mis_std_info.std_studentid')
        //     ->leftJoin('hep_hostel_chkinout', function($join){
        //         $join->on(function($query){
        //             $query->on('hep_hostel_chkinout.stud_id', '=', 'mis_std_info.std_studentid')
        //             ->where('hep_hostel_chkinout.recordstatus','!=',"DEL");
        //         });
        //     })
        //     ////nana ->where('mis_std_info.status_academic', 4)
        //     ->where(function($query) {
        //         $query->where('mis_std_info.status_academic', 4)
        //               ->orWhere('mis_std_info.status_academic', 1);
        //     })
        //     ->where('mis_std_info.recordstatus', '!=', 'DEL')
        //     // ->where('hep_hostel_chkinout.checkIn_status', '!=', "Unreside")
        //     // ->where('hep_hostel_chkinout.checkIn_status', 'New')
        //     // ->where(['hep_hostel_chkinout.checkIn_status', 'New'])
        //     ->orderByRaw("ISNULL(hep_hostel_chkinout.room_id) DESC, hep_hostel_chkinout.room_id DESC");

        //     // ->orderByRaw("CASE WHEN hep_hostel_chkinout.room_id = '' THEN 0 ELSE 1 END DESC");

        //     // ->orderByRaw("CASE WHEN hep_hostel_chkinout.room_id = '' THEN 0 ELSE 1 END"); // Empty room_id first

        // $obj = $subquery->get();


        $obj = mis_std_info::select([
            'mis_std_info.std_studentid',
            'mis_std_info.status_academic',
            'mis_std_info.sti_name',
            'mis_std_info.sti_icno',
            'mis_std_info.sti_gender',
            'mis_std_info.cam_id',
            'mis_prm_college.clg_name',
            'mis_gender.sti_gender_name',
            'hep_hostel_chkinout.checkIn_status',
            'hep_hostel_chkinout.chkInOut_id',
            'hep_hostel_chkinout.branch_id',
            'hep_hostel_chkinout.hostel_id',
            'hep_hostel_chkinout.block_id',
            'hep_hostel_chkinout.room_id',
            'hep_hostel_chkinout.reason',
            'hep_hostel_chkinout.checkIn',
            'hep_hostel_room.room_no',
            'hep_hostel_room.total_bed',
            'hep_hostel_chkinout.checkOut_status',
            'hep_hostel_chkinout.recordstatus as statusChkInOut',
            'mis_status.sts_status_name_en',
            DB::raw("
            CASE 
                WHEN hep_hostel_chkinout.room_id IS NOT NULL THEN 'Assigned'
                WHEN hep_hostel_chkinout.checkIn_status = 'Unreside' THEN 'Unreside'
                ELSE 'New'
            END AS statusHostel
            ")
        ])
            ->leftJoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'mis_std_info.cam_id')
            ->leftJoin('mis_gender', 'mis_gender.sti_gender_id', '=', 'mis_std_info.sti_gender')
            ->leftJoin('hep_hostel_chkinout', 'hep_hostel_chkinout.stud_id', '=', 'mis_std_info.std_studentid')
            ->leftJoin('mis_status', 'mis_status.sts_status_id', '=', 'mis_std_info.status_academic')
            ->leftJoin('hep_hostel_room', function ($join) {
                $join->on('hep_hostel_room.room_id', '=', 'hep_hostel_chkinout.room_id')
                    ->where('hep_hostel_chkinout.recordstatus', '!=', 'DEL');
            })
            ->where(function ($query) {
                $query->whereIn('mis_std_info.status_academic', [1, 4])
                    ->where('mis_std_info.recordstatus', '!=', 'DEL')
                    ->where(function ($subquery) {
                        $subquery->whereNull('hep_hostel_chkinout.recordstatus')
                            ->orWhere('hep_hostel_chkinout.recordstatus', '!=', 'DEL');
                    });
            })
            //     ->orderByRaw("
            //     CASE 
            //         WHEN hep_hostel_chkinout.checkIn_status = 'New' THEN 0
            //         ELSE 1
            //     END
            // ")

            // ->orderBy('hep_hostel_chkinout.chkInOut_id', 'DESC')

            // ->orderByRaw('ISNULL(hep_hostel_chkinout.room_id) DESC')
            // ->orderBy('hep_hostel_chkinout.room_id', 'DESC')
            ->orderByRaw("
            CASE 
                WHEN hep_hostel_chkinout.room_id IS NOT NULL THEN 2
                WHEN hep_hostel_chkinout.checkIn_status = 'Unreside' THEN 3
                ELSE 1
            END
        ")
            ->orderBy('hep_hostel_chkinout.lastupdateon', 'DESC')
            ->get();

        // nie query mysql
        //     SELECT
        //     mis_std_info.std_studentid,
        //     mis_std_info.status_academic,
        //     mis_std_info.sti_name,
        //     mis_std_info.sti_icno,
        //     mis_std_info.sti_gender,
        //     mis_std_info.cam_id,
        //     mis_prm_college.clg_name,
        //     mis_gender.sti_gender_name,
        //     hep_hostel_chkinout.checkIn_status,
        //     hep_hostel_chkinout.chkInOut_id,
        //     hep_hostel_chkinout.branch_id,
        //     hep_hostel_chkinout.hostel_id,
        //     hep_hostel_chkinout.block_id,
        //     hep_hostel_chkinout.room_id,
        //     hep_hostel_chkinout.reason,
        //     hep_hostel_chkinout.checkIn,
        //     hep_hostel_room.room_no,
        //     hep_hostel_room.total_bed,
        //     hep_hostel_chkinout.checkOut_status,
        //     hep_hostel_chkinout.recordstatus as statusChkInOut
        // FROM mis_std_info
        // LEFT JOIN mis_prm_college ON mis_prm_college.pk_id = mis_std_info.cam_id
        // LEFT JOIN mis_gender ON mis_gender.sti_gender_id = mis_std_info.sti_gender
        // LEFT JOIN hep_hostel_chkinout ON hep_hostel_chkinout.stud_id = mis_std_info.std_studentid
        // LEFT JOIN hep_hostel_room ON hep_hostel_room.room_id = hep_hostel_chkinout.room_id
        //     AND hep_hostel_chkinout.recordstatus != 'DEL'
        // WHERE
        //     (mis_std_info.status_academic = 4 OR mis_std_info.status_academic = 1) 
        //     AND mis_std_info.recordstatus != 'DEL'
        //     AND (hep_hostel_chkinout.recordstatus IS NULL OR hep_hostel_chkinout.recordstatus != 'DEL')
        // -- 		AND mis_std_info.std_studentid = 'DPC07230083A'
        // ORDER BY
        //     ISNULL(hep_hostel_chkinout.room_id) DESC,
        //     hep_hostel_chkinout.room_id DESC;
        // end nie query mysql



        // $obj = DB::table('mis_std_info')
        //     ->select(
        //         'mis_std_info.std_studentid',
        //         'mis_std_info.status_academic',
        //         'mis_std_info.sti_name',
        //         'mis_std_info.sti_icno',
        //         'mis_std_info.sti_gender',
        //         'mis_std_info.cam_id',
        //         'mis_prm_college.clg_name',
        //         'mis_gender.sti_gender_name',
        //         'hep_hostel_chkinout.checkIn_status',
        //         'hep_hostel_chkinout.chkInOut_id',
        //         'hep_hostel_chkinout.branch_id',
        //         'hep_hostel_chkinout.hostel_id',
        //         'hep_hostel_chkinout.block_id',
        //         'hep_hostel_chkinout.room_id',
        //         'hep_hostel_chkinout.reason',
        //         'hep_hostel_chkinout.checkIn',
        //         'hep_hostel_room.room_no',
        //         'hep_hostel_room.total_bed',
        //         'hep_hostel_chkinout.checkOut_status'
        //     )
        //     ->leftJoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'mis_std_info.cam_id')
        //     ->leftJoin('mis_gender', 'mis_gender.sti_gender_id', '=', 'mis_std_info.sti_gender')
        //     ->leftJoin('hep_hostel_chkinout', function ($join) {
        //         $join->on('hep_hostel_chkinout.stud_id', '=', 'mis_std_info.std_studentid')
        //             ->where('hep_hostel_chkinout.recordstatus', '!=', 'DEL');
        //     })
        //     ->leftJoin('hep_hostel_room', function ($join) {
        //         $join->on('hep_hostel_room.room_id', '=', 'hep_hostel_chkinout.room_id')
        //             ->where('hep_hostel_chkinout.recordstatus', '!=', 'DEL');
        //     })
        //     ->where(function ($query) {
        //         $query->where('mis_std_info.status_academic', 4)
        //             ->orWhere('mis_std_info.status_academic', 1);
        //     })
        //     ->where('mis_std_info.recordstatus', '!=', 'DEL')
        //     // ->where('hep_hostel_chkinout.recordstatus', '!=', 'DEL')
        //     ->orderByRaw("ISNULL(hep_hostel_chkinout.room_id) DESC, hep_hostel_chkinout.room_id DESC")
        //     ->get();

        // You can then access the result using $result


        //

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "List Success!",
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "List Fail!",
                'data' => ''
            ], 404);
        }
    }

    public function listStdUnreside(Request $request)
    {
        //afiez 01 november 2023
        $lastupdateon = $request->input('lastupdateon');

        // $obj = DB::table('mis_std_info')
        //     ->select(
        //         'mis_std_info.std_studentid',
        //         'mis_std_info.status_academic',
        //         'mis_std_info.sti_name',
        //         'mis_std_info.sti_icno',
        //         'mis_std_info.sti_gender',
        //         'mis_std_info.cam_id',
        //         'mis_prm_college.clg_name',
        //         'mis_gender.sti_gender_name',
        //         'hep_hostel_chkinout.checkIn_status',
        //         'hep_hostel_chkinout.chkInOut_id',
        //         'hep_hostel_chkinout.branch_id',
        //         'hep_hostel_chkinout.hostel_id',
        //         'hep_hostel_chkinout.block_id',
        //         'hep_hostel_chkinout.room_id',
        //         'hep_hostel_chkinout.reason',
        //         'hep_hostel_chkinout.checkIn',
        //         'hep_hostel_chkinout.lastupdateon',
        //         'hep_hostel_room.room_no',
        //         'hep_hostel_room.total_bed',
        //         'hep_hostel_chkinout.checkOut_status'
        //     )
        //     ->leftJoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'mis_std_info.cam_id')
        //     ->leftJoin('mis_gender', 'mis_gender.sti_gender_id', '=', 'mis_std_info.sti_gender')
        //     ->leftJoin('hep_hostel_chkinout', function ($join) {
        //         $join->on('hep_hostel_chkinout.stud_id', '=', 'mis_std_info.std_studentid');
        //             // ->where('hep_hostel_chkinout.recordstatus', '!=', 'DEL');
        //     })
        //     ->leftJoin('hep_hostel_room', function ($join) {
        //         $join->on('hep_hostel_room.room_id', '=', 'hep_hostel_chkinout.room_id');
        //             // ->where('hep_hostel_chkinout.recordstatus', '!=', 'DEL');
        //     })
        //     ->where(function ($query) {
        //         $query->where('mis_std_info.status_academic', 4)
        //             ->orWhere('mis_std_info.status_academic', 1);
        //     })
        //     ->where('mis_std_info.recordstatus', '!=', 'DEL')
        //     ->where('checkIn_status', '=', 'Unreside')

        //     ->orderByRaw("ISNULL(hep_hostel_chkinout.room_id) DESC, hep_hostel_chkinout.room_id DESC")
        //     ->orderBy('hep_hostel_chkinout.lastupdateon', 'DESC')

        //     ->get();



        $obj = DB::table('mis_std_info')
            ->select(
                'mis_std_info.std_studentid',
                'mis_std_info.status_academic',
                'mis_std_info.sti_name',
                'mis_std_info.sti_icno',
                'mis_std_info.sti_gender',
                'mis_std_info.cam_id',
                'mis_prm_college.clg_name',
                'mis_gender.sti_gender_name',
                'hep_hostel_chkinout.checkIn_status',
                'hep_hostel_chkinout.chkInOut_id',
                'hep_hostel_chkinout.branch_id',
                'hep_hostel_chkinout.hostel_id',
                'hep_hostel_chkinout.block_id',
                'hep_hostel_chkinout.room_id',
                'hep_hostel_chkinout.reason',
                'hep_hostel_chkinout.checkIn',
                'hep_hostel_chkinout.lastupdateon',
                'hep_hostel_room.room_no',
                'hep_hostel_room.total_bed',
                'hep_hostel_chkinout.checkOut_status'
            )
            ->leftJoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'mis_std_info.cam_id')
            ->leftJoin('mis_gender', 'mis_gender.sti_gender_id', '=', 'mis_std_info.sti_gender')
            ->leftJoin('hep_hostel_chkinout', function ($join) {
                $join->on('hep_hostel_chkinout.stud_id', '=', 'mis_std_info.std_studentid');
                // ->where('hep_hostel_chkinout.recordstatus', '!=', 'DEL');
            })
            ->leftJoin('hep_hostel_room', function ($join) {
                $join->on('hep_hostel_room.room_id', '=', 'hep_hostel_chkinout.room_id');
                // ->where('hep_hostel_chkinout.recordstatus', '!=', 'DEL');
            })
            ->where(function ($query) {
                $query->where('mis_std_info.status_academic', 4)
                    ->orWhere('mis_std_info.status_academic', 1);
            })
            ->where('mis_std_info.recordstatus', '!=', 'DEL')
            // ->where('checkIn_status', '=', 'Unreside');
            ->where(function ($query) {
                $query->where('hep_hostel_chkinout.checkIn_status', '=', 'Unreside')
                    ->orWhere(function ($query) {
                        $query->where('hep_hostel_chkinout.checkOut_status', '=', 'Accept')
                            ->where('hep_hostel_chkinout.reason', '=', 'Not Reside Hostel');
                    });
            });

        if ($lastupdateon) {
            $dateParts = explode('-', $lastupdateon);

            // Extract the month and year
            $lastupdateonYear = $dateParts[0];
            $lastupdateonMonth = $dateParts[1];

            $obj->where(function ($query) use ($lastupdateonMonth, $lastupdateonYear) {
                $query->whereRaw('YEAR(hep_hostel_chkinout.lastupdateon) = ' . $lastupdateonYear)
                    ->whereRaw('MONTH(hep_hostel_chkinout.lastupdateon) = ' . $lastupdateonMonth);
            });
        }

        $obj =   $obj->orderByRaw("ISNULL(hep_hostel_chkinout.room_id) DESC, hep_hostel_chkinout.room_id DESC")
            ->orderBy('hep_hostel_chkinout.lastupdateon', 'DESC')

            ->get();







        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "List Success!",
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "List Fail!",
                'data' => ''
            ], 404);
        }
    }

    public function updateStatus(Request $request)
    {
        $std_studentid        = $request->input('std_studentid');
        $status_academic   = $request->input('status_academic');
        $recordstatus   = 'EDT';

        $data = [
            // 'std_studentid'         => $std_studentid ,
            'status_academic'       => $status_academic,
            'recordstatus'       => $recordstatus,

        ];

        $obj = mis_std_info::where('std_studentid', $std_studentid)->update($data);

        if ($obj) {

            return response()->json([
                'success' => true,
                'messages' => 'Successfully Update Status Academic',
                'data' => $obj,
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'messages' => 'Update Failed',
                'data' => '',
            ], 400);
        }
    }

    public function listStdReporting(Request $request)
    {
        $cur_year   = $request->input('cur_year');
        $cal_cohort        = $request->input('cal_cohort');
        $cal_category        = $request->input('cal_category');
        $campus_id        = $request->input('campus_id');
        $fac_id        = $request->input('fac_id');
        $sts_student        = $request->input('sts_student');



        // $query = DB::table('mis_std_info')
        //     // Select columns
        //     ->select([
        //         'mis_std_info.std_studentid',
        //         'mis_std_info.sti_icno',
        //         'mis_std_info.sti_name',
        //         'mis_std_info.pgm_id',
        //         'mis_std_info.cur_intake',
        //         'mis_std_info.sti_gender',
        //         'mis_std_info.sti_status_oku',
        //         'mis_std_info.sti_email',
        //         'mis_std_info.sti_address_1',
        //         'mis_std_info.sti_address_2',
        //         'mis_std_info.sti_address_3',
        //         'mis_std_info.sti_postcode',
        //         'mis_std_info.marital_status',
        //         'mis_std_info.sti_contactno_home',
        //         'mis_std_info.sti_contactno_mobile',
        //         'mis_prm_programme.pgm_name',
        //         'mis_prm_programme.pgm_category',
        //         'mis_prm_programme.pgm_status',
        //         'mis_prm_faculty.fac_id',
        //         'mis_prm_faculty.fac_name',
        //         'mis_status.sts_status_code',
        //         'mis_status.sts_status_name_en',
        //         'mis_nationality.sti_nationality_name',
        //         'mis_race.sti_race_name',
        //         'mis_religion.sti_religion_name',
        //         'mis_prm_college.clg_name',
        //         'sys_negeri.ringkasan as name_state',
        //         'mis_sponsorship.sponsorship_name',
        //         'mis_asnaf.asnaf_name',
        //         'mis_std_curAcademic.std_semester',
        //         'mis_std_curAcademic.std_cgpa',
        //         'mis_std_curAcademic.acaCal_weeks',
                
        //         'mis_prm_calendar.cur_year',
        //         'mis_prm_calendar.cal_cohort',
        //         'mis_prm_calendar.cal_category',
        //         'aca_cal_category.category'
        //     ])
        //     // Joins
        //     ->leftJoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_std_info.pgm_fk')
        //     ->leftJoin('mis_prm_faculty', 'mis_prm_faculty.pk_id', '=', 'mis_prm_programme.fac_id')
        //     ->leftJoin('mis_status', 'mis_status.sts_status_id', '=', 'mis_std_info.status_academic')
        //     ->leftJoin('mis_nationality', 'mis_nationality.pk_id', '=', 'mis_std_info.sti_nationality')
        //     ->leftJoin('mis_race', 'mis_race.sti_race_id', '=', 'mis_std_info.sti_race')
        //     ->leftJoin('mis_religion', 'mis_religion.sti_religion_id', '=', 'mis_std_info.sti_religion')
        //     ->leftJoin('sys_negeri', 'sys_negeri.kod', '=', 'mis_std_info.sti_state')
        //     ->leftJoin('mis_sponsorship', 'mis_sponsorship.sponsorship_id', '=', 'mis_std_info.sti_sponsorship')
        //     ->leftJoin('mis_asnaf', 'mis_asnaf.asnaf_id', '=', 'mis_std_info.sti_asnaf')
        //     ->leftJoin('mis_std_curAcademic', 'mis_std_curAcademic.std_studentid', '=', 'mis_std_info.std_studentid')
        //     ->leftJoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_curAcademic.fk_acaCal')
        //     ->leftJoin('aca_cal_category', 'aca_cal_category.pk_id', '=', 'mis_prm_calendar.cal_category')
        //     ->leftJoin('mis_prm_faccampus', 'mis_prm_faccampus.fac_id', '=', 'mis_prm_faculty.pk_id')
        //     ->leftJoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'mis_prm_faccampus.cam_id')
            
        //     // Conditions
        //     ->where('mis_std_info.recordstatus', '!=', 'DEL')
        //     ->where('mis_std_curAcademic.recordstatus', '!=', 'DEL')
        //     ;

        $query = mis_std_info::select([
                'mis_std_info.std_studentid',
                'mis_std_info.sti_icno',
                'mis_std_info.sti_name',
                'mis_std_info.pgm_id',
                'mis_std_info.cur_intake',
                'mis_std_info.sti_gender',
                'mis_std_info.sti_status_oku',
                'mis_std_info.sti_email',
                'mis_std_info.sti_address_1',
                'mis_std_info.sti_address_2',
                'mis_std_info.sti_address_3',
                'mis_std_info.sti_postcode',
                'mis_std_info.marital_status',
                'mis_std_info.sti_contactno_home',
                'mis_std_info.sti_contactno_mobile',
                'mis_prm_programme.pgm_name',
                'mis_prm_programme.pgm_category',
                'mis_prm_programme.pgm_status',
                'mis_prm_faculty.fac_id',
                'mis_prm_faculty.fac_name',
                'mis_status.sts_status_code',
                'mis_status.sts_status_name_en',
                'mis_nationality.sti_nationality_name',
                'mis_race.sti_race_name',
                'mis_religion.sti_religion_name',
                'mis_prm_college.clg_name',
                'sys_negeri.ringkasan as name_state',
                'mis_sponsorship.sponsorship_name',
                'mis_asnaf.asnaf_name',
                'mis_std_curAcademic.std_semester',
                'mis_std_curAcademic.std_cgpa',
                'mis_std_curAcademic.acaCal_weeks',
                'mis_prm_calendar.cur_year',
                'mis_prm_calendar.cal_cohort',
                'mis_prm_calendar.cal_category',
                'aca_cal_category.category'
            ])
            // Joins
            ->leftJoin('mis_prm_programme', 'mis_std_info.pgm_fk', '=', 'mis_prm_programme.pk_id')
            ->leftJoin('mis_prm_college', 'mis_std_info.cam_id', '=', 'mis_prm_college.pk_id')
            ->leftJoin('mis_prm_faculty', 'mis_prm_programme.fac_id', '=', 'mis_prm_faculty.pk_id')
            ->leftJoin('mis_status', 'mis_status.sts_status_id', '=', 'mis_std_info.status_academic')
            ->leftJoin('mis_nationality', 'mis_nationality.pk_id', '=', 'mis_std_info.sti_nationality')
            ->leftJoin('mis_race', 'mis_race.sti_race_id', '=', 'mis_std_info.sti_race')
            ->leftJoin('mis_religion', 'mis_religion.sti_religion_id', '=', 'mis_std_info.sti_religion')
            ->leftJoin('sys_negeri', 'sys_negeri.kod', '=', 'mis_std_info.sti_state')
            ->leftJoin('mis_sponsorship', 'mis_sponsorship.sponsorship_id', '=', 'mis_std_info.sti_sponsorship')
            ->leftJoin('mis_asnaf', 'mis_asnaf.asnaf_id', '=', 'mis_std_info.sti_asnaf')
            ->leftJoin('mis_std_curAcademic', 'mis_std_curAcademic.std_studentid', '=', 'mis_std_info.std_studentid')
            ->leftJoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_curAcademic.fk_acaCal')
            ->leftJoin('aca_cal_category', 'aca_cal_category.pk_id', '=', 'mis_prm_calendar.cal_category')
            // Conditions
            ->where('mis_std_info.recordstatus', '!=', 'DEL')
            ->where('mis_prm_calendar.recordstatus', '!=', 'DEL');

            // If you need to filter by a specific student ID, uncomment the following line:
            // ->where('mis_std_info.std_studentid', 'DLM09212062');

            if($cur_year){
                $query ->where('mis_prm_calendar.cur_year', $cur_year)
                // $query ->where('mis_prm_calendar.cur_year', '2022/2023')
                ->where('mis_prm_calendar.cal_cohort', $cal_cohort); 
            }

            if($cal_category){
                $query ->where('mis_prm_calendar.cal_category', $cal_category); 
            }

            if($campus_id){
                $query ->where('mis_prm_college.pk_id', $campus_id); 
            }

            if($fac_id){
                $query ->where('mis_prm_faculty.pk_id', $fac_id); 
            }

            if($sts_student){
                $query ->where('mis_std_info.status_academic', $sts_student); 
            }
        // Uncomment the following line if you want to filter by specific student ID
        // ->where('mis_std_info.std_studentid', 'DBM04230001');

        // Execute the query and get the results
        $results = $query
        ->orderBy('mis_prm_college.clg_name')     
        ->orderBy('mis_prm_faculty.fac_name')     
        -> get();




        if (count($results) >0) {
            return response()->json([
                'success' => true,
                'messages' => 'Successfully Listed Status Academic',
                'data' => $results,
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'messages' => 'Update Failed',
                'data' => '',
            ], 400);
        }
    }
}
