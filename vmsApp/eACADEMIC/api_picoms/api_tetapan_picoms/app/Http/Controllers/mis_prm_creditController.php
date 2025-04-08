<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_prm_credit;

class mis_prm_creditController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function register(Request $request){
        $crd_session = $request->input('crd_session');
        $crd_type = $request->input('crd_type');
        $crd_min = $request->input('crd_min');
        $crd_max = $request->input('crd_max');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_credit::create([
            'crd_session' => $crd_session,
            'crd_type' => $crd_type,
            'crd_min' => $crd_min,
            'crd_max' => $crd_max,
            'recordstatus' => $recordstatus,
        ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Register Success!',
                'data'=>$obj
            ],201);
        }

        else    {
            return response()->json([
                'success'=>'false',
                'message'=>'Bad Request',
                'data'=>$obj
            ],400);
        }
    }

    public function show(Request $request)  {
        $crd_id = $request->input('crd_id');

        $mis_prm_credit = mis_prm_credit::where('crd_id',$crd_id)->first();

        if ($mis_prm_credit)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$mis_prm_credit
            ],200);
        }
    }


    public function list(){
        $obj = mis_prm_credit::where('mis_prm_credit.recordstatus','!=','DEL')
            ->leftjoin('sem_type', 'sem_type.id', '=', 'mis_prm_credit.crd_session') 
            ->leftjoin('mode', 'mode.id','=','mis_prm_credit.crd_type') 
            ->get([
                'crd_id',
                'crd_session',
                'sem_type_name',
                'crd_type',
                'mode_name',
                'crd_min',
                'crd_max'
            ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function update(Request $request){
        $crd_id = $request->input('crd_id');
        $crd_session = $request->input('crd_session');
        $crd_type = $request->input('crd_type');
        $crd_min = $request->input('crd_min');
        $crd_max = $request->input('crd_max');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_credit::where([['crd_id','=',$crd_id]]) -> update([
            'crd_session' => $crd_session,
            'crd_type' => $crd_type,
            'crd_min' => $crd_min,
            'crd_max' => $crd_max,
            'recordstatus' => $recordstatus,
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
        $id = $request->input('crd_id');
        $recordstatus = $request->input('recordstatus');
        
        $obj = mis_prm_credit::where([['crd_id','=',$id]])-> update([
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
