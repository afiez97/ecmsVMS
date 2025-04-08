<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\stdTawaran;
use App\Models\mis_prm_programme;
use App\Models\mis_prm_curyear;
use App\Models\std_info;

class std_infoController extends Controller
{
    public function  __construct()
    {
        $this->middleware('auth');
    }

    public function create(Request $request){

        $first_name             = $request->input('first_name');
        $last_name              = $request->input('last_name');
        $gender                 = $request->input('gender');
        $email                  = $request->input('email');
        $address1               = $request->input('address1');
        $address2               = $request->input('address2');
        $address_postcode       = $request->input('address_postcode');
        $address_city           = $request->input('address_city');
        $address_state          = $request->input('address_state');
        $mobile_no              = $request->input('mobile_no');
        $mobile2                = $request->input('mobile2');
        $mykad                  = $request->input('mykad');
        $first_choice           = $request->input('first_choice');
        $second_choice          = $request->input('second_choice');
        $school_name            = $request->input('school_name');
        $acad_year              = $request->input('acad_year');
        $aggregate              = $request->input('aggregate');
        $GRED_BM                = $request->input('GRED_BM');
        $GRED_BI                = $request->input('GRED_BI');
        $GRED_MATH              = $request->input('GRED_MATH');
        $GRED_SEJARAH           = $request->input('GRED_SEJARAH');
        $GRED_ISLAM             = $request->input('GRED_ISLAM');
        $GRED_OTHER1            = $request->input('GRED_OTHER1');
        $GRED_OTHER2            = $request->input('GRED_OTHER2');
        $GRED_OTHER3            = $request->input('GRED_OTHER3');
        $GRED_OTHER4            = $request->input('GRED_OTHER4');
        $GRED_OTHER5            = $request->input('GRED_OTHER5');
        $SUB_OTHER1             = $request->input('SUB_OTHER1');
        $SUB_OTHER2             = $request->input('SUB_OTHER2');
        $SUB_OTHER3             = $request->input('SUB_OTHER3');
        $SUB_OTHER4             = $request->input('SUB_OTHER4');
        $SUB_OTHER5             = $request->input('SUB_OTHER5');
        $status                 = $request->input('status');
        $offer_choice           = $request->input('offer_choice');
        $image                  = $request->input('image');
        $datetime               = $request->input('datetime');
        $email_datetime         = $request->input('email_datetime');
        $introducer             = $request->input('introducer');
        $country                = $request->input('country');
        $ethnic                 = $request->input('ethnic');
        $bumiputera             = $request->input('bumiputera');
        $marital                = $request->input('marital');
        $religion               = $request->input('religion');
        $status_oku             = $request->input('status_oku');
        $dob                    = $request->input('dob');
        $bank_name              = $request->input('bank_name');
        $bank_accno             = $request->input('bank_accno');
        $stpmYear               = $request->input('stpmYear');
        $stpm_PA                = $request->input('stpm_PA');
        $stpm_other1            = $request->input('stpm_other1');
        $stpm_other2            = $request->input('stpm_other2');
        $stpm_other3            = $request->input('stpm_other3');
        $stpm_other4            = $request->input('stpm_other4');
        $stpm_other5            = $request->input('stpm_other5');
        $stpm_other1_gra        = $request->input('stpm_other1_gra');
        $stpm_other2_gra        = $request->input('stpm_other2_gra');
        $stpm_other3_gra        = $request->input('stpm_other3_gra');
        $stpm_other4_gra        = $request->input('stpm_other4_gra');
        $stpm_other5_gra        = $request->input('stpm_other5_gra');
        $certYear               = $request->input('certYear');
        $certCGPA               = $request->input('certCGPA');
        $certname               = $request->input('certname');
        $certInstitute          = $request->input('certInstitute');
        $intake                 = $request->input('intake');
        $std_father_name        = $request->input('std_father_name');
        $std_father_mykad       = $request->input('std_father_mykad');
        $std_father_address     = $request->input('std_father_address');
        $std_father_mobile_no   = $request->input('std_father_mobile_no');
        $std_father_job         = $request->input('std_father_job');
        $std_mother_name        = $request->input('std_mother_name');
        $std_mother_mykad       = $request->input('std_mother_mykad');
        $std_mother_address     = $request->input('std_mother_address');
        $std_mother_mobile_no   = $request->input('std_mother_mobile_no');
        $std_mother_job         = $request->input('std_mother_job');
        $std_waris_name         = $request->input('std_waris_name');
        $std_waris_address      = $request->input('std_waris_address');
        $std_waris_mobile_no    = $request->input('std_waris_mobile_no');
        $std_waris_relation     = $request->input('std_waris_relation');
        $std_pendapatan         = $request->input('std_pendapatan');
        $std_duduk_bersama      = $request->input('std_duduk_bersama');
        $std_jum_tanggungan     = $request->input('std_jum_tanggungan');

        $salt = "RMY7nZ3+s8xpU1n0O*0o_EGfdoYtd|iU_AzhKCMoSu_xhh-e|~y8FOG*-xLZ";
        $password     = hash("sha256", $request->input('password').$salt);
       
        $data = [
            'first_name'       => $first_name ,
            'last_name'       => $last_name ,
            'gender'       => $gender ,
            'email'      => $email ,
            'password' => $password,
            'address1' => $address1,
            'address2' => $address2,
            'address_postcode' => $address_postcode,
            'address_city' => $address_city,
            'address_state' => $address_state,
            'mobile_no' => $mobile_no,
            'mobile2' => $mobile2,
            'mykad' => $mykad,
            'first_choice' => $first_choice,
            'second_choice' => $second_choice,
            'school_name' => $school_name,
            'acad_year' => $acad_year,
            'aggregate' => $aggregate,
            'GRED_BM' => $GRED_BM,
            'GRED_BI' => $GRED_BI,
            'GRED_MATH' => $GRED_MATH,
            'GRED_SEJARAH' => $GRED_SEJARAH,
            'GRED_ISLAM' => $GRED_ISLAM,
            'GRED_OTHER1' => $GRED_OTHER1,
            'GRED_OTHER2' => $GRED_OTHER2,
            'GRED_OTHER3' => $GRED_OTHER3,
            'GRED_OTHER4' => $GRED_OTHER4,
            'GRED_OTHER5' => $GRED_OTHER5,
            'SUB_OTHER1' => $SUB_OTHER1,
            'SUB_OTHER2' => $SUB_OTHER2,
            'SUB_OTHER3' => $SUB_OTHER3,
            'SUB_OTHER4' => $SUB_OTHER4,
            'SUB_OTHER5' => $SUB_OTHER5,
            'status' => $status,
            'offer_choice' => $offer_choice,
            'image' => $image,
            'datetime' => $datetime,
            'email_datetime' => $email_datetime,
            'introducer' => $introducer,
            'country' => $country,
            'ethnic' => $ethnic,
            'bumiputera' => $bumiputera,
            'marital' => $marital,
            'religion' => $religion,
            'status_oku' => $status_oku,
            'dob' => $dob,
            'bank_name' => $bank_name,
            'bank_accno' => $bank_accno,
            'stpmYear' => $stpmYear,
            'stpm_PA' => $stpm_PA,
            'stpm_other1' => $stpm_other1,
            'stpm_other2' => $stpm_other2,
            'stpm_other3' => $stpm_other3,
            'stpm_other4' => $stpm_other4,
            'stpm_other5' => $stpm_other5,
            'stpm_other1_gra' => $stpm_other1_gra,
            'stpm_other2_gra' => $stpm_other2_gra,
            'stpm_other3_gra' => $stpm_other3_gra,
            'stpm_other4_gra' => $stpm_other4_gra,
            'stpm_other5_gra' => $stpm_other5_gra,
            'certYear' => $certYear,
            'certCGPA' => $certCGPA,
            'certname' => $certname,
            'certInstitute' => $certInstitute,
            'intake' => $intake,
            'std_father_name' => $std_father_name,
            'std_father_address' => $std_father_address,
            'std_father_mykad' => $std_father_mykad,
            'std_father_mobile_no' => $std_father_mobile_no,
            'std_father_job' => $std_father_job,
            'std_mother_name' => $std_mother_name,
            'std_mother_address' => $std_mother_address,
            'std_mother_mykad' => $std_mother_mykad,
            'std_mother_mobile_no' => $std_mother_mobile_no,
            'std_mother_job' => $std_mother_job,
            'std_waris_name' => $std_waris_name,
            'std_waris_address' => $std_waris_address,
            'std_waris_mobile_no' => $std_waris_mobile_no,
            'std_waris_job' => $std_waris_,
        ];

        $info = std_info::create($data);

        if($info){

            return response()->json([
                'success'=>true,
                'messages'=>'Daftar Berjaya',
                'data'=>$info,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Daftar Gagal',
                'data'=>'',
            ],400);
        }
    }

    public function list(Request $request){

        $first_name     = $request->input('first_name');
        $mykad          = $request->input('mykad');
        $offer_choice   = $request->input('offer_choice');

        if($first_name == '' && $mykad == ''){

            $register = std_info::select('*')
                    ->leftJoin('mis_prm_programme', 'mis_prm_programme.pgm_id', '=', 'std_info.offer_choice')
                    ->where('statusrekod',1)
                    ->get();

        }
        else {

            $register = std_info::select('*')
                    ->leftJoin('mis_prm_programme', 'mis_prm_programme.pgm_id', '=', 'std_info.pgm_id')
                    ->where('statusrekod',1);

            if($first_name != ''){ //SEARCHING BY STUDENT ID [IF SEARCHING FIELD NOT EMPTY]
                $register = $register->where('first_name', 'like', '%' . $first_name . '%');
            }

            if($mykad != ''){ //SEARCHING BY STUDENT ID [IF SEARCHING FIELD NOT EMPTY]
                $register = $register->where('mykad', 'like', '%' . $mykad . '%');
            }
            
            if($offer_choice != ''){ //SEARCHING BY PROGRAM ID [IF SEARCHING FIELD NOT EMPTY]
                $register = $register->where('offer_choice',$offer_choice);
            }

            $register = $register->get();

        }
        
        if($register){

            return response()->json([
                'success'=>true,
                'messages'=>'Proses Berjaya',
                'data'=>$register,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Proses Gagal',
                'data'=>'',
            ],400);
        }
    }

    public function show($id){

        $tawaran = std_info::select('*')
        ->leftJoin('mis_prm_programme', 'mis_prm_programme.pgm_id', '=', 'std_info.offer_choice')
        ->where('statusrekod',1)
        ->where('std_info',$id)->first();

        if($tawaran){

            return response()->json([
                'success'=>true,
                'messages'=>'Proses Berjaya',
                'data'=>$tawaran,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Proses Gagal',
                'data'=>'',
            ],400);
        }
    }
}
