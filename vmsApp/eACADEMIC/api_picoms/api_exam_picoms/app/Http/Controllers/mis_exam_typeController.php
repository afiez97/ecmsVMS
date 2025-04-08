<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_exam_type;

class mis_exam_typeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    // add examination type
    public function register(Request $request){
        $exam_type = $request->input('exam_type');
        $exam_remarks = $request->input('exam_remarks');
        $recordstatus = $request->input('recordstatus');

        $register = mis_exam_type::create([
            'exam_type' => $exam_type,
            'exam_remarks' => $exam_remarks,
            'recordstatus' => $recordstatus
        ]);

        if($register) {
            return response()->json([
                'success'=>'true',
                'message'=>'Register Success!',
                'data'=>$register
            ],201);
        }
        else{
            return response()->json([
                'success'=>'false',
                'message'=>'Bad Request',
                'data'=>$register
            ],400);
        }
    }


    // display examination type list
    public function list(){
        $obj = mis_exam_type::where([['recordstatus','!=','DEL']]) 
            ->get([
                'pk_id',
                'exam_type',
                'exam_remarks'
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>'false',
                'message'=>'Bad Request',
                'data'=>$obj
            ],400);
        }
    }


    public function update(Request $request){
        $pk_id = $request->input('pk_id');
        $exam_type = $request->input('exam_type');
        $exam_remarks = $request->input('exam_remarks');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_exam_type::where('pk_id',$pk_id) -> update([
            'exam_type' => $exam_type,
            'exam_remarks' => $exam_remarks,
            'recordstatus' => $recordstatus
        ]);

        if($obj) {
            return response()->json([
                'success'=>'true',
                'message'=>'Update Success!',
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

    public function delete(Request $request)    {
        $id = $request->input('pk_id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_exam_type::where([['pk_id','=',$id]])-> update([
            'recordstatus' => $recordstatus,
        ]);

        if ($obj)  {
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
