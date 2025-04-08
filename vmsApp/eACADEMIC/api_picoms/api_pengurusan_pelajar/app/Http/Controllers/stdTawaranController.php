<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\stdTawaran;
// use App\Models\mis_prm_programme;
// use App\Models\mis_prm_curyear;
use App\Models\std_register;


class stdTawaranController extends Controller
{

    public function create(Request $request){

        $first_name             = $request->input('first_name');
        $last_name              = $request->input('last_name');
        $gender                 = $request->input('gender');
        $email                  = $request->input('email');
        $address1               = $request->input('address1');
        $mobile_no              = $request->input('mobile_no');
        $address2               = $request->input('address2');
        $mykad                  = $request->input('mykad');
        $first_choice           = $request->input('first_choice');
        $second_choice          = $request->input('second_choice');
        $address_postcode       = $request->input('address_postcode');
        $address_city           = $request->input('address_city');
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
        $marital                = $request->input('marital');
        $religion               = $request->input('religion');
        $dob                    = $request->input('dob');
        $mobile2                = $request->input('mobile2');
        $address_state          = $request->input('address_state');
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

        $salt = "RMY7nZ3+s8xpU1n0O*0o_EGfdoYtd|iU_AzhKCMoSu_xhh-e|~y8FOG*-xLZ";
        $password     = hash("sha256", $request->input('password').$salt);
       
        $data = [
            'first_name'       => $first_name ,
            'last_name'       => $last_name ,
            'gender'       => $gender ,
            'email'      => $email ,
            'password' => $password,
            'address1' => $address1,
            'mobile_no' => $mobile_no,
            'address2' => $address2,
            'mykad' => $mykad,
            'first_choice' => $first_choice,
            'second_choice' => $second_choice,
            'address_postcode' => $address_postcode,
            'address_city' => $address_city,
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
            'marital' => $marital,
            'religion' => $religion,
            'dob' => $dob,
            'mobile2' => $mobile2,
            'address_state' => $address_state,
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
        ];

        $tawaran = stdTawaran::create($data);

        if($tawaran){

            return response()->json([
                'success'=>true,
                'messages'=>'Daftar Berjaya',
                'data'=>$tawaran,
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

    // public function update(Request $request){

    //     $std_tawaran_id     = $request->input('std_tawaran_id');
    //     $std_nama           = $request->input('std_nama');
    //     $std_nokp           = $request->input('std_nokp');
    //     $std_emel           = $request->input('std_emel');
    //     $std_notel          = $request->input('std_notel');
    //     $std_program_id     = $request->input('std_program_id');
        
    //     $data = [
    //         'std_nama'       => $std_nama ,
    //         'std_nokp'       => $std_nokp ,
    //         'std_emel'       => $std_emel ,
    //         'std_notel'      => $std_notel ,
    //         'std_program_id' => $std_program_id
    //     ];

    //     $tawaran = stdTawaran::where('std_tawaran_id',$std_tawaran_id)->update($data);

    //     if($tawaran){

    //         return response()->json([
    //             'success'=>true,
    //             'messages'=>'Update Success',
    //             'data'=>$tawaran,
    //         ],201);
    //     }
    //     else {
    //         return response()->json([
    //             'success'=>false,
    //             'messages'=>'Update Failed',
    //             'data'=>'',
    //         ],400);
    //     }

    // }

    // public function delete(Request $request){

    //     $std_tawaran_id   = $request->input('std_tawaran_id');
    //     $updated_at       = Carbon::today();
    //     $statusrecord     = 0;
        
    //     $data = [
    //         'statusrekod' => $statusrecord, 
    //         'updated_at' => $updated_at 
    //     ];

    //     $tawaran = stdTawaran::where('std_tawaran_id',$std_tawaran_id)->update($data);

    //     if($tawaran){

    //         return response()->json([
    //             'success'=>true,
    //             'messages'=>'Hapus Data Berjaya',
    //             'data'=>$tawaran,
    //         ],201);
    //     }
    //     else {
    //         return response()->json([
    //             'success'=>false,
    //             'messages'=>'Hapus Data Gagal',
    //             'data'=>'',
    //         ],400);
    //     }

    // }

    public function list(Request $request){

        $first_name     = $request->input('first_name');
        $mykad          = $request->input('mykad');
        $offer_choice   = $request->input('offer_choice');

        if($first_name == '' && $mykad == ''){

            $register = stdTawaran::select('*')
                    ->leftJoin('mis_prm_programme', 'mis_prm_programme.pgm_id', '=', 'std_tawaran.offer_choice')
                    ->where('statusrekod',1)
                    ->get();

        }
        else {

            $register = stdTawaran::select('*')
                    ->leftJoin('mis_prm_programme', 'mis_prm_programme.pgm_id', '=', 'std_tawaran.pgm_id')
                    ->where('statusrekod',1);

            if($first_name != ''){ //SEARCHING BY STUDENT ID [IF SEARCHING FIELD NOT EMPTY]
                $register = $register->where('first_name', 'like', '%' . $first_name . '%');
            }

            if($mykad != ''){ //SEARCHING BY STUDENT ID [IF SEARCHING FIELD NOT EMPTY]
                $register = $register->where('mykad', 'like', '%' . $mykad . '%');
            }
            
            if($offer_choice != ''){ //SEARCHING BY PROGRAM ID [IF SEARCHING FIELD NOT EMPTY]
                $register = $register->where('std_program_id',$offer_choice);
            }

            $register = $register->get();

        }

        // dd($register);
        
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

    public function show(Request $request){

        $id = $request->input('std_tawaran_id');

        $tawaran = stdTawaran::select('*')
        ->leftJoin('mis_prm_programme', 'mis_prm_programme.pgm_id', '=', 'std_tawaran.offer_choice')
        ->where('statusrekod',1)
        ->where('std_tawaran_id',$id)->first();

        // $senarai_program = mis_prm_programme::select('*')
        // ->where('recordstatus','!=','DEL')->get();

        // dd($tawaran);
        if($tawaran){

            return response()->json([
                'success'=>true,
                'messages'=>'Proses Berjaya',
                'data'=>$tawaran,
                // 'senarai_program'=>$senarai_program,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Proses Gagal',
                'data'=>'',
                // 'senarai_program'=>$senarai_program,
            ],400);
        }
    }
}
