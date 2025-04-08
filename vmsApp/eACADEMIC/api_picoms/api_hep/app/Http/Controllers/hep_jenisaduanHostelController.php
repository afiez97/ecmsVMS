<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\hep_jenisaduanHostel;
use Illuminate\Support\Facades\DB;

class hep_jenisaduanHostelController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function register(Request $request) {
        $pk_id = $request->input('pk_id');
        $aduan_code = $request->input('aduan_code');
        $aduan_nama = $request->input('aduan_nama');
        $aduan_remarks = $request->input('aduan_remarks');
        $lastapproveby = $request->input('lastapproveby');
        $lastupdateby = $request->input('lastupdateby');
        
        $obj = hep_jenisaduanHostel::create([
            'pk_id' => $pk_id,
            'aduan_code' => $aduan_code,
            'aduan_nama' => $aduan_nama,
            'aduan_remarks' => $aduan_remarks,
            'recordstatus' => 'ADD',
            'lastapproveby' => $lastapproveby,
            'lastupdateby' => $lastupdateby,
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
        $pk_id = $request->input('pk_id');

        $obj = hep_jenisaduanHostel::where('pk_id',$pk_id)->first();

        if ($obj)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function list(){
        $obj = hep_jenisaduanHostel::SELECT('hep_jenisaduanHostel.*') ->where([['recordstatus','!=','DEL']]) -> get();

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
        $aduan_code = $request->input('aduan_code');
        $aduan_nama = $request->input('aduan_nama');
        $aduan_remarks = $request->input('aduan_remarks');
        $lastupdateby = $request->input('lastupdateby');
        
        $obj = hep_jenisaduanHostel::where([['pk_id','=',$pk_id]]) -> update([
            'aduan_code' => $aduan_code,
            'aduan_nama' => $aduan_nama,
            'aduan_remarks' => $aduan_remarks,
            'recordstatus' => 'EDT',
            'lastupdateby' => $lastupdateby,
        ]);

        if ($obj){
            return response()->json([
                'success'=>true,
                'message'=>"Update Success!",
                'data' => hep_jenisaduanHostel::where('pk_id', $pk_id)->get()
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
        // $recordstatus = $request->input('recordstatus');
        $pk_id = $request->input('pk_id');

        $obj = hep_jenisaduanHostel::where('pk_id',$pk_id)-> update([
            'recordstatus' => 'DEL',
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
