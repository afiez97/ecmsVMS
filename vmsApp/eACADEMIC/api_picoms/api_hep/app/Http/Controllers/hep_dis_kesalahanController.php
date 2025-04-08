<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\hep_dis_kesalahan;

class hep_dis_kesalahanController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function register(Request $request) {
        $id_kompaun = $request->input('id_kompaun');
        $id_salahlaku = $request->input('id_salahlaku');
        $kesalahan = $request->input('kesalahan');
        $amount = $request->input('amount');

        $obj = hep_dis_kesalahanController::create([
            'id_kompaun' => $id_kompaun,
            'id_salahlaku' => $id_salahlaku,
            'kesalahan' => $kesalahan,
            'amount' => $amount,
            
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


    public function show(Request $request)  {
        $fac_id = $request->input('id_aduan');

        $hep_dis_kesalahanController = hep_dis_kesalahanController::where('id_aduan',$fac_id)->first();

        if ($hep_dis_kesalahanController)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$hep_dis_kesalahanController
            ],200);
        }
    }


    public function list(){
        $obj = hep_dis_kesalahanController::SELECT('hep_dis_kesalahanController.*')
            // ->join('mis_prm_college', 'mis_prm_college.pk_id', '=' , 'mis_prm_faculty.cam_id')
            ->where([['hep_dis_kesalahanController.recordstatus','!=','DEL']]) -> get();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function update(Request $request){
        $id_kompaun = $request->input('id_kompaun');
        $id_salahlaku = $request->input('id_salahlaku');
        $kesalahan = $request->input('kesalahan');
        $amount = $request->input('amount');

        $obj = hep_dis_kesalahan::where([['pk_id','=',$pk_id]]) -> update([
            'id_kompaun' => $id_kompaun,
            'id_salahlaku' => $id_salahlaku,
            'kesalahan' => $kesalahan,
            'amount' => $amount,
        ]);

        if ($obj)  {
            return response()->json([
                'success'=>true,
                'message'=>"Update Success!",
                'data' => $obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Update Failed!",
                'data'=>''
            ],404);
        }
    }


    public function delete(Request $request){
        $recordstatus = $request->input('recordstatus');
        $pk_id = $request->input('pk_id');

        $obj = mis_prm_faculty::where('pk_id',$pk_id)-> update([
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
    
}
