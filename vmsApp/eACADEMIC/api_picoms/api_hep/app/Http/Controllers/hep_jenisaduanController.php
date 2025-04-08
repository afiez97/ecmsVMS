<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\hep_jenisaduan;

class hep_jenisaduanController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function register(Request $request) {
        $id_jenisaduan = $request->input('id_jenisaduan');
        $description = $request->input('description');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_jenisaduan::create([
            'id_jenisaduan' => $id_jenisaduan,
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

        $hep_jenisaduanController = hep_jenisaduanController::where('id_aduan',$fac_id)->first();

        if ($hep_jenisaduanController)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$hep_jenisaduanController
            ],200);
        }
    }


    public function list(){
        $obj = hep_jenisaduan::SELECT('hep_jenisaduan.*') ->where([['recordstatus','!=','DEL']]) -> get();

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
        $id_jenisaduan = $request->input('id_jenisaduan');
        $description = $request->input('description');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_jenisaduan::where([['pk_id','=',$pk_id]]) -> update([
            'id_jenisaduan' => $id_jenisaduan,
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

        $obj = hep_jenisaduan::where('pk_id',$pk_id)-> update([
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
