<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\intake;

class intakeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }


    public function register(Request $request){
        $intake_name = $request->input('intake_name');
        $intake_year = $request->input('intake_year');
        $recordstatus = $request->input('recordstatus');

        $obj = intake::create([
            'intake_name' => $intake_name,
            'intake_year' => $intake_year,
            'recordstatus' => $recordstatus,
        ]);

        if($obj){
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


    public function list(){
        $obj = intake::where([['recordstatus','!=','DEL']]) 
            // ->orderBy('id','desc')
            ->orderBy('intake_year','desc')
            ->get(['id','intake_name AS intake_month','intake_year']);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function delete(Request $request){
        $id = $request->input('id');
        $recordstatus = $request->input('recordstatus');

        $obj = intake::where('id',$id) ->update(['recordstatus' => $recordstatus]);

        if($obj){
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


    // check data if exist
    public function chkData(Request $request){
        $intake_name = $request->input('intake_name');
        $intake_year = $request->input('intake_year');

        $obj = intake::where([
                ['intake_name','=',$intake_name],
                ['intake_year','=',$intake_year],
                ['recordstatus','!=','DEL']
            ]) 
            ->get(['id']);

        if(sizeof($obj) > 0){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>'false',
                'message'=>'List Failed!',
                'data'=>''
            ],200);
        }
    }
}
