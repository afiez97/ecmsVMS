<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_prm_faccampus;

class mis_prm_faccampusController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function register(Request $request){
        $cam_id = $request->input('cam_id');
        $fac_id = $request->input('fac_id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_faccampus::create([
            'cam_id' => $cam_id,
            'fac_id' => $fac_id,
            'recordstatus' => $recordstatus,
        ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Register Success!',
                'data'=>$obj
            ],201);
        }
        else{
            return response()->json([
                'success'=>'false',
                'message'=>'Bad Request',
                'data'=>$obj
            ],400);
        }
    }


    public function show($id){
        $obj = mis_prm_faccampus::SELECT('mis_prm_faculty.*')
            ->join('mis_prm_faculty', 'mis_prm_faculty.pk_id', '=' , 'mis_prm_faccampus.fac_id')
            ->where('mis_prm_faccampus.pk_id',$id)->first();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function list(){
        $obj = mis_prm_faccampus::SELECT('mis_prm_faccampus.*')
            ->where([['mis_prm_faccampus.recordstatus','!=','DEL']]) -> get();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function delete(Request $request){
        $recordstatus = $request->input('recordstatus');
        $pk_id = $request->input('pk_id');

        $obj = mis_prm_faccampus::where('pk_id',$pk_id)-> update([
            'recordstatus' => $recordstatus,
        ]);

        if ($obj){
            return response()->json([
                'success'=>true,
                'message'=>"Hapus Berjaya!",
                'data' => $obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Hapus Gagal!",
                'data'=>''
            ],401);
        }
    }


    public function listByCampus($id){
        $obj = mis_prm_faccampus::where([['mis_prm_faccampus.cam_id','=', $id],['mis_prm_faccampus.recordstatus','!=','DEL']])
            -> join('mis_prm_faculty', 'mis_prm_faculty.pk_id', '=', 'mis_prm_faccampus.fac_id')
            ->get([
                'mis_prm_faccampus.fac_id AS facCamId',
                'mis_prm_faculty.fac_id AS facCode',
                'fac_name',
                'fac_phoneno',
                'fac_faxno',
                'fac_email'
            ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function checkId(Request $request){
        $input = $request->input('input');
        $cam_id = $request->input('cam_id');

        $obj = mis_prm_faccampus::select('fac_id')->where([
            ['fac_id','=',$input],
            ['cam_id','=',$cam_id],
            ['recordstatus','!=','DEL']
            ]) ->get();

        if ($obj)  {
            return response()->json([
                'success'=>true,
                'message'=>"Carian Berjaya!",
                'data' => $obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Carian Gagal!",
                'data'=>''
            ],404);
        }
    }
}
