<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\stdTawaran;
use App\Models\mis_prm_programme;
use App\Models\mis_prm_curyear;
use App\Models\std_register;


class std_registerController extends Controller
{

    public function  __construct()
    {
        $this->middleware('auth');
    }

    public function approve(Request $request){

        
        $std_tawaran_id         = $request->input('std_tawaran_id');
        $std_jbayaran           = $request->input('std_jbayaran');
        $created_at             = carbon::now();

        $salt = "RMY7nZ3+s8xpU1n0O*0o_EGfdoYtd|iU_AzhKCMoSu_xhh-e|~y8FOG*-xLZ";
        $std_katalaluan     = hash("sha256", $request->input('std_katalaluan').$salt);
        
        $query_tawaran = stdTawaran::select('*')
            ->where([
                ['statusrekod','=',1],
                    ['std_tawaran_id','=',$std_tawaran_id]])
            ->first();

            $std_nama                   = $query_tawaran->std_nama;
            $std_nokp                   = $query_tawaran->std_nokp;
            $std_emel                   = $query_tawaran->std_emel;
            $std_notel                  = $query_tawaran->std_notel;
            $std_program_id             = $query_tawaran->std_program_id;
            $std_tahun_semester_semasa  = $query_tawaran->std_tahun_semester_semasa;
        
        if($std_tahun_semester_semasa == null || $std_tahun_semester_semasa == ''){

            $next_year = date("Y")+1;
            $std_tahun_semester_semasa = date("Y").'/'.$next_year;
        }

        $count_std_reg = std_register::where([['std_program_id','=',$std_program_id],
                ['statusrekod','=','1'],
                ['std_tahun_kemasukan','=',$std_tahun_semester_semasa]])
                ->count();

        if($count_std_reg > 0){
            $strlen = strlen($count_std_reg);
            $new_kod = $count_std_reg+1;

            if($strlen == 1){
                $gen_code = '00000'.$new_kod;
            }else if($strlen == 2){
                $gen_code = '0000'.$new_kod;
            }else if($strlen == 3){
                $gen_code = '000'.$new_kod;
            }else if($strlen == 4){
                $gen_code = '00'.$new_kod;
            }else if($strlen == 5){
                $gen_code = '0'.$new_kod;
            }else{
                $gen_code = $new_kod;
            }
            
            $nomatrik = 'PH'.substr($std_tahun_semester_semasa, -7, -5).$gen_code;
        }else{
            $nomatrik = 'PH'.substr($std_tahun_semester_semasa, -7, -5).'000001';
        }

        $data = [
            'std_nama'          => $std_nama ,
            'std_nokp'          => $std_nokp ,
            'std_emel'          => $std_emel ,
            'std_notel'         => $std_notel ,
            'std_katalaluan'    => $std_katalaluan ,
            'std_program_id'    => $std_program_id,
            'std_tahun_kemasukan' => $std_tahun_semester_semasa,
            'std_nomatrik'      => $nomatrik,
            'std_jbayaran'      => $std_jbayaran,
            'created_at'        => $created_at
        ];

        $register = std_register::create($data);

        if($register){

            return response()->json([
                'success'=>true,
                'messages'=>'Daftar Berjaya',
                'data'=>$register,
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

    public function update(Request $request){

        $std_tawaran_id     = $request->input('std_tawaran_id');
        $std_jbayaran       = $request->input('std_jbayaran');
        $updated_at         = carbon::now();
        $std_register_id    = $request->input('std_register_id');
        $std_nama           = $request->input('std_nama');
        $std_nokp           = $request->input('std_nokp');
        $std_emel           = $request->input('std_emel');
        $std_notel          = $request->input('std_notel');
        $std_program_id     = $request->input('std_program_id');
        $std_nomatrik       = $request->input('std_nomatrik');

        $std_resit              = $request->file('std_resit');
        $std_nokp_upload        = $request->file('std_nokp_upload');
        $std_spm_upload         = $request->file('std_spm_upload');
        $std_stpm_upload        = $request->file('std_stpm_upload');
        $std_diploma_upload     = $request->file('std_diploma_upload');
        $std_ijazah_upload      = $request->file('std_ijazah_upload');
  
        $file_date = "_".$updated_at->format('Ymd');

        $fileName_resit = $std_nomatrik.$file_date.'(RESIT).'.$std_resit->getClientOriginalExtension();  
        $fileName_nokp = $std_nomatrik.$file_date.'(NOKP).'.$std_nokp_upload->getClientOriginalExtension();  
        $fileName_spm = $std_nomatrik.$file_date.'(SPM).'.$std_spm_upload->getClientOriginalExtension();  
        $fileName_stpm = $std_nomatrik.$file_date.'(STPM).'.$std_stpm_upload->getClientOriginalExtension();  
        $fileName_diploma = $std_nomatrik.$file_date.'(DIPLOMA).'.$std_diploma_upload->getClientOriginalExtension();  
        $fileName_ijazah = $std_nomatrik.$file_date.'(IJAZAH).'.$std_ijazah_upload->getClientOriginalExtension();  
   
        $std_resit->move(public_path('uploads/pelajar/resit/'), $fileName_resit);
        $std_nokp_upload->move(public_path('uploads/pelajar/nokp/'), $fileName_nokp);
        $std_spm_upload->move(public_path('uploads/pelajar/spm/'), $fileName_spm);
        $std_stpm_upload->move(public_path('uploads/pelajar/stpm/'), $fileName_stpm);
        $std_diploma_upload->move(public_path('uploads/pelajar/diploma/'), $fileName_diploma);
        $std_ijazah_upload->move(public_path('uploads/pelajar/ijazah/'), $fileName_ijazah);
        
        $data = [
            'std_nama'          => $std_nama ,
            'std_nokp'          => $std_nokp ,
            'std_emel'          => $std_emel ,
            'std_notel'         => $std_notel ,
            'std_program_id'    => $std_program_id,
            'std_nomatrik'      => $std_nomatrik,
            'std_jbayaran'      => $std_jbayaran,
            'std_resit'         => $fileName_resit,
            'std_nokp_upload'   => $fileName_nokp,
            'std_spm_upload'    => $fileName_spm,
            'std_stpm_upload'   => $fileName_stpm,
            'std_diploma_upload' => $fileName_diploma,
            'std_ijazah_upload' => $fileName_ijazah,
            'updated_at'        => $updated_at
        ];

        $register = std_register::where('std_register_id',$std_register_id)->update($data);

        if($register){

            return response()->json([
                'success'=>true,
                'messages'=>'Update Success',
                'data'=>$register,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Update Failed',
                'data'=>'',
            ],400);
        }

    }

    public function delete(Request $request){

        $std_register_id   = $request->input('std_register_id');
        $updated_at       = Carbon::today();
        $statusrecord     = 0;
        
        $data = [
            'statusrekod' => $statusrekod, 
            'updated_at' => $updated_at 
        ];

        $tawaran = std_register::where('std_register_id',$std_register_id)->update($data);

        if($tawaran){

            return response()->json([
                'success'=>true,
                'messages'=>'Hapus Data Berjaya',
                'data'=>$tawaran,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Hapus Data Gagal',
                'data'=>'',
            ],400);
        }

    }

    public function list(Request $request){

        $std_nama           = $request->input('std_nama');
        $std_program_id     = $request->input('std_program_id');

        if($std_nama == '' && $std_program_id == ''){

            $register = std_register::select('*')
                    ->leftJoin('mis_prm_programme', 'mis_prm_programme.pgm_id', '=', 'std_register.std_program_id')
                    ->where('statusrekod',1)
                    ->get();

        }
        else {

            $register = std_register::select('*')
                    ->leftJoin('mis_prm_programme', 'mis_prm_programme.pgm_id', '=', 'mis_std_info.pgm_id')
                    ->where('statusrekod',1);

            if($std_nama != ''){ //SEARCHING BY STUDENT ID [IF SEARCHING FIELD NOT EMPTY]
                $register = $register->where('std_nama', 'like', '%' . $std_nama . '%');
            }
            
            if($std_program_id != ''){ //SEARCHING BY PROGRAM ID [IF SEARCHING FIELD NOT EMPTY]
                $register = $register->where('std_program_id',$std_program_id);
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

        // dd($id);
        $tawaran = std_register::select('*')
        ->leftJoin('mis_prm_programme', 'mis_prm_programme.pgm_id', '=', 'std_register.std_program_id')
        ->where('statusrekod',1)
        ->where('std_register_id',$id)->first();

        // dd($tawaran);

        $senarai_program = mis_prm_programme::select('*')
        ->where('recordstatus','!=','DEL')->get();

        // dd($tawaran);
        if($tawaran){

            return response()->json([
                'success'=>true,
                'messages'=>'Proses Berjaya',
                'data'=>$tawaran,
                'senarai_program'=>$senarai_program,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Proses Gagal',
                'data'=>'',
                'senarai_program'=>$senarai_program,
            ],400);
        }
    }
}
