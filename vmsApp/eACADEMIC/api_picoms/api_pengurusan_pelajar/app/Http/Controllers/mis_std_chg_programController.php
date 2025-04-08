<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_std_chg_program;

class mis_std_chg_programController extends Controller
{
    public function  __construct()
    {
        $this->middleware('auth');
    }
    
    public function create(Request $request){
        $studentid = $request->input('studentid');
        $std_name = $request->input('std_name');
        $noic = $request->input('noic');
        $std_pre_programme = $request->input('std_pre_programme');
        $std_new_programme = $request->input('std_new_programme');
        $lastupdateby = $request->input('lastupdateby');

        if($file = $request->hasFile('std_lampiran')) {
            $std_lampiran = '';

            // $std_transkrip_path = $request->file('std_transkrip')->getClientOriginalExtension(); 
            // $std_transkrip = base64_encode(file_get_contents($request->file('std_transkrip')->getRealPath()));
        }else{
            $std_lampiran = '';
        }

        $data = [
            'studentid' => $studentid,
            'std_name' => $std_name,
            'noic' => $noic,
            'std_pre_programme' => $std_pre_programme,
            'std_new_programme' => $std_new_programme,
            'std_lampiran' => $std_lampiran,
            'lastupdateby' => $lastupdateby,
            'recordstatus' => 'ADD'
        ];

        $obj = mis_std_chg_program::create($data);

        if($obj){

            return response()->json([
                'success'=>true,
                'messages'=>'Daftar Berjaya',
                'data'=>$obj,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Daftar Gagal',
                'data'=>'',
            ],201);
        }
    }

    public function update(Request $request){
        $id = $request->input('id');
        $std_dekanStatus = $request->input('std_dekanStatus');
        $std_new_fac = $request->input('std_new_fac');
        $std_new_fee = $request->input('std_new_fee');
        $recordstatus = $request->input('recordstatus');
        $lastupdateby = $request->input('lastupdateby');

        $data = ['lastupdateby' => $lastupdateby];

        if($std_dekanStatus != ""){
            $data['std_dekanStatus'] = $std_dekanStatus;
        }
        
        if($std_new_fac != ""){
            $data['std_new_fac'] = $std_new_fac;
        }

        if($std_new_fee != ""){
            $data['std_new_fee'] = $std_new_fee;
        }

        if($std_dekanStatus != ""){
            $data['lastupdateby'] = $lastupdateby;
        }

        if($recordstatus != ""){
            $data['recordstatus'] = $recordstatus;
        }
        // dd($data);
        
        $obj = mis_std_chg_program::where('id',$id)->update($data);
        if($obj){

            return response()->json([
                'success'=>true,
                'messages'=>'Update Success',
                'data'=>$obj,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Update Failed',
                'data'=>'',
            ],201);
        }
    }

    public function show($id){
        $obj = mis_std_chg_program::where('studentid',$id)->get();
        
        if($obj){
            if(sizeof($obj) > 0){
                return response()->json([
                    'success'=>true,
                    'messages'=>'Data Berjaya',
                    'data'=>$obj,
                ],201);
            }
            else{
                return response()->json([
                    'success'=>false,
                    'messages'=>'Data Tiada',
                    'data'=>$obj,
                ],201);                
            }
            
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Data Gagal',
                'data'=>'',
            ],201);
        }
        
    }

    public function get_data($id){
        $obj = mis_std_chg_program::
        select('mis_std_chg_program.*',
        'pgm1.pgm_name AS prePgm',
        'pgm2.pgm_name AS newPgm','pgm2.pgm_id',
        'p.cam_kod AS cam_id',
        'fac1.fac_id AS facPre_Code',
        'fac2.fac_id AS facNew_Code'
        
        ) 
            ->leftjoin('mis_prm_programme AS pgm1', 'pgm1.pk_id','=','mis_std_chg_program.std_pre_programme')
            ->leftjoin('mis_prm_programme AS pgm2', 'pgm2.pk_id','=','mis_std_chg_program.std_new_programme')
            ->leftjoin('mis_prm_faculty AS fac1', 'fac1.pk_id','=','pgm1.fac_id')
            ->leftjoin('mis_prm_faculty AS fac2', 'fac2.pk_id','=','pgm2.fac_id')
            ->leftjoin('Programme AS p', 'p.code','=','pgm2.pgm_id')
            ->where('id',$id)->first();
        
        if($obj){
            return response()->json([
                'success'=>true,
                'messages'=>'Data Berjaya',
                'data'=>$obj,
            ],201);
            
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Data Gagal',
                'data'=>'',
            ],201);
        }
        
    }

    public function list(){
        $obj = mis_std_chg_program::select('mis_std_chg_program.*','pgm1.pgm_id AS prePgm','pgm2.pgm_id AS newPgm') 
            ->leftjoin('mis_prm_programme AS pgm1', 'pgm1.pk_id','=','mis_std_chg_program.std_pre_programme')
            ->leftjoin('mis_prm_programme AS pgm2', 'pgm2.pgm_id','=','mis_std_chg_program.std_new_programme') 
            ->where('mis_std_chg_program.recordstatus', '!=', 'DEL')
            ->orderBy('mis_std_chg_program.id', 'DESC')
            ->get();

        if($obj){
            if(sizeof($obj) > 0){
                return response()->json([
                    'success'=>true,
                    'messages'=>'Data Berjaya',
                    'data'=>$obj,
                ],201);
            }
            else{
                return response()->json([
                    'success'=>false,
                    'messages'=>'Data Tiada',
                    'data'=>$obj,
                ],201);
            }
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Data Gagal',
                'data'=>'',
            ],201);
        }
    }

    public function delete(Request $request){
        
    }
}
