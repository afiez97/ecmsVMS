<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_prm_faculty;

class mis_prm_facultyController extends Controller
{
    public function register(Request $request) {
        $fac_id = $request->input('fac_id');
        $fac_name = $request->input('fac_name');
        $fac_phoneno = $request->input('fac_phoneno');
        $fac_faxno = $request->input('fac_faxno');
        $fac_email = $request->input('fac_email');
        $recordstatus = $request->input('recordstatus');
        $adu_masa = $request->input('adu_masa');

        $obj = mis_prm_faculty::create([
            'fac_id' => $fac_id,
            'fac_name' => $fac_name,
            'fac_phoneno' => $fac_phoneno,
            'fac_faxno' => $fac_faxno,
            'fac_email' => $fac_email,
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


    public function show(Request $request)  {
        $fac_id = $request->input('fac_id');

        $mis_prm_faculty = mis_prm_faculty::where('fac_id',$fac_id)->first();

        if ($mis_prm_faculty)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$mis_prm_faculty
            ],200);
        }
    }


    public function list(){
        $obj = mis_prm_faculty::SELECT('mis_prm_faculty.*')
            // ->join('mis_prm_college', 'mis_prm_college.pk_id', '=' , 'mis_prm_faculty.cam_id')
            ->where([['mis_prm_faculty.recordstatus','!=','DEL']]) -> get();

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
        $fac_name = $request->input('fac_name');
        $fac_phoneno = $request->input('fac_phoneno');
        $fac_faxno = $request->input('fac_faxno');
        $fac_email = $request->input('fac_email');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_faculty::where([['pk_id','=',$pk_id]]) -> update([
            'fac_name' => $fac_name,
            'fac_phoneno' => $fac_phoneno,
            'fac_faxno' => $fac_faxno,
            'fac_email' => $fac_email,
            'recordstatus' => $recordstatus
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
    
    
    public function facultyCodeChecking(Request $request){
        $input = $request->input('input');
        // $cam_id = $request->input('cam_id');

        $obj = mis_prm_faculty::select('fac_id')->where([
            ['fac_id','=',$input],
            ['recordstatus','!=','DEL']
            ])
            // -> where('cam_id','=',$cam_id) 
            ->get();

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

    public function listByCampus($id)  {
        $obj = mis_prm_faculty::SELECT('mis_prm_faculty.*','clg_name')
            -> join('mis_prm_college', 'mis_prm_college.pk_id', '=' , 'mis_prm_faculty.cam_id')
            -> where('mis_prm_faculty.cam_id', '=', $id)
            -> where([['mis_prm_faculty.recordstatus','!=','DEL']]) -> get();

        if ($obj)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }
}
