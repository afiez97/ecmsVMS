<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_prm_programme;


class mis_prm_programmeController extends Controller
{
    // public function update(Request $request){

    //     $fac_id         = $request->input('fac_id');
    //     $pgm_category   = $request->input('pgm_category');
    //     $pgm_area       = $request->input('pgm_area');
    //     $pgm_name       = $request->input('pgm_name');
    //     $pgm_mode       = $request->input('pgm_mode');
    //     $pgm_mqflevel   = $request->input('pgm_mqflevel');
    //     $pgm_level      = $request->input('pgm_level');
    //     $pgm_duration   = $request->input('pgm_duration');
    //     $pgm_status     = $request->input('pgm_status');
    //     $lastupdateon   = $request->input('lastupdateon');
    //     $lastupdateby   = $request->input('lastupdateby');
    //     $lastapproveon  = $request->input('lastapproveon');
    //     $lastapproveby  = $request->input('lastapproveby');
    //     $recordstatus   = $request->input('recordstatus');
    //     // $status_rekod       = $request->input('status_rekod');
        
    //     $data = [
    //         'fac_id'       => $fac_id ,
    //         'pgm_category'       => $pgm_category ,
    //         'pgm_area'       => $pgm_area ,
    //         'pgm_name'      => $pgm_name ,
    //         'pgm_mode' => $pgm_mode,
    //         'pgm_mqflevel' => $pgm_mqflevel,
    //         'pgm_level' => $pgm_level,
    //         'pgm_duration' => $pgm_duration,
    //         'pgm_status' => $pgm_status,
    //         'lastapproveon' => $lastapproveon,
    //         'lastapproveby' => $lastapproveby,
    //     ];

    //     $tawaran = mis_prm_programme::where('std_tawaran_id',$std_tawaran_id)->update($data);

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
    //         'statusrekod' => $statusrekod, 
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

            $register = mis_prm_programme::select('*')->where('recordstatus','!=','DEL')->get();

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

    // public function show(Request $request){

    //     $id = $request->input('std_tawaran_id');

    //     $tawaran = stdTawaran::select('*')
    //     ->leftJoin('mis_prm_programme', 'mis_prm_programme.pgm_id', '=', 'mis_std_info.pgm_id')
    //     ->where('std_tawaran_id',$id)->first();

    //     $senarai_program = stdTawaran::select('*')
    //     ->where('statusrekod',1)->first();

    //     if($tawaran){

    //         return response()->json([
    //             'success'=>true,
    //             'messages'=>'Proses Berjaya',
    //             'data'=>$tawaran,
    //             'ssenarai_program'=>$ssenarai_program,
    //         ],201);
    //     }
    //     else {
    //         return response()->json([
    //             'success'=>false,
    //             'messages'=>'Proses Gagal',
    //             'data'=>'',
    //             'ssenarai_program'=>$ssenarai_program,
    //         ],400);
    //     }
    // }
}
