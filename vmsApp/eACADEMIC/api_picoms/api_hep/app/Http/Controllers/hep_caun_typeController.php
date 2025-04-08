<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\hep_caun_type;

class hep_caun_typeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function register(Request $request) {
        $id_jeniskaunseling = $request->input('id_jeniskaunseling');
        $description = $request->input('description');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_caun_type::create([
            'id_jeniskaunseling' => $id_jeniskaunseling,
            'description' => $description,
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

        $hep_caun_type = hep_caun_type::where('id_aduan',$fac_id)->first();

        if ($hep_caun_type)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$hep_caun_type
            ],200);
        }
    }


    public function list(){
        $obj = hep_caun_type::SELECT('hep_caun_type.*') ->where([['hep_caun_type.recordstatus','!=','DEL']]) -> get();

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
        $id_jeniskaunseling = $request->input('id_jeniskaunseling');
        $description = $request->input('description');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_caun_type::where([['pk_id','=',$pk_id]]) -> update([
            'id_jeniskaunseling' => $id_jeniskaunseling,
            'description' => $description,
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

        $obj = hep_caun_type::where('pk_id',$pk_id)-> update([
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
