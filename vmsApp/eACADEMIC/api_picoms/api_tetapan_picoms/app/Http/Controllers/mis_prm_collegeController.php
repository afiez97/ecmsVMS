<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_prm_college;

class mis_prm_collegeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function register(Request $request){
        $clg_id = $request->input('clg_id');
        $clg_name = $request->input('clg_name');
        $clg_address1 = $request->input('clg_address1');
        $clg_address2 = $request->input('clg_address2');
        $clg_address3 = $request->input('clg_address3');
        $clg_phoneno = $request->input('clg_phoneno');
        $clg_faxno = $request->input('clg_faxno');
        $clg_email = $request->input('clg_email');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_college::create([
            'clg_id' => $clg_id,
            'clg_name' => $clg_name,
            'clg_address1' => $clg_address1,
            'clg_address2' => $clg_address2,
            'clg_address3' => $clg_address3,
            'clg_phoneno' => $clg_phoneno,
            'clg_faxno' => $clg_faxno,
            'clg_email' => $clg_email,
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
        $obj = mis_prm_college::where('pk_id',$id)->first();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function list()  {
        $mis_prm_college = mis_prm_college::where('recordstatus','!=','DEL')->get();

        if ($mis_prm_college)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$mis_prm_college
            ],200);
        }
        
    }


    public function update(Request $request){
        $pk_id = $request->input('pk_id');
        $clg_id = $request->input('clg_id');
        $clg_name = $request->input('clg_name');
        $clg_address1 = $request->input('clg_address1');
        $clg_address2 = $request->input('clg_address2');
        $clg_address3 = $request->input('clg_address3');
        $clg_phoneno = $request->input('clg_phoneno');
        $clg_faxno = $request->input('clg_faxno');
        $clg_email = $request->input('clg_email');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_college::where('pk_id',$pk_id)-> update([
            'clg_id' => $clg_id,
            'clg_name' => $clg_name,
            'clg_address1' => $clg_address1,
            'clg_address2' => $clg_address2,
            'clg_address3' => $clg_address3,
            'clg_phoneno' => $clg_phoneno,
            'clg_faxno' => $clg_faxno,
            'clg_email' => $clg_email,
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
        $pk_id = $request->input('pk_id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_college::where('pk_id',$pk_id)-> update([
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

    
    public function collegeCodeChecking(Request $request){
        $input = $request->input('input');

        $query = mis_prm_college::select('clg_id')->where([['clg_id','=',$input]])->get();

        if ($query)  {
            return response()->json([
                'success'=>true,
                'message'=>"Carian Berjaya!",
                'data' => $query
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
