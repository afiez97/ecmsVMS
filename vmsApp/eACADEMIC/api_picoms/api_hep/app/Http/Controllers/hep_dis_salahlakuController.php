<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\hep_dis_salahlaku;

class hep_dis_salahlakuController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function register(Request $request) {
        $id_salahlaku = $request->input('id_salahlaku');
        $description = $request->input('description');
        // $action_taken = $request->input('action_taken');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_dis_salahlaku::create([
            'id_salahlaku' => $id_salahlaku,
            'description' => $description,
            // 'action_taken' => $action_taken,
            'recordstatus' => $recordstatus
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

        $hep_dis_salahlakuController = hep_dis_salahlaku::where('id_aduan',$fac_id)->first();

        if ($hep_dis_salahlakuController)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$hep_dis_salahlakuController
            ],200);
        }
    }


    public function list(){
        $obj = hep_dis_salahlaku::where([['recordstatus','!=','DEL']]) 
            ->get(
                [
                'pk_id',
                'id_salahlaku',
                'description',
                'action_taken'
                
            ]
        );

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function update(Request $request){
        $pk_id = $request->input('pk_id');
        $id_salahlaku = $request->input('id_salahlaku');
        $description = $request->input('description');
        $action_taken = $request->input('action_taken');
        $recordstatus = $request->input('recordstatus');
        
        $obj = hep_dis_salahlaku::where([['pk_id','=',$pk_id]]) -> update([
            'id_salahlaku' => $id_salahlaku,
            'description' => $description,
            'action_taken' => $action_taken,
            'recordstatus' => $recordstatus
        ]);

        if ($obj){
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

        $obj = hep_dis_salahlaku::where('pk_id',$pk_id)-> update([
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
