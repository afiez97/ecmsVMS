<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_prm_course_det;

class mis_prm_course_detController extends Controller
{
    public function register(Request $request){
        $crs_id = $request->input('crs_id');
        $prerequisite = $request->input('prerequisite');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_course_det::create([
            'crs_id' => $crs_id,
            'prerequisite' => $prerequisite,
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


    public function list($id){
        $obj = mis_prm_course_det::where([['mis_prm_course_det.crs_id',$id],['mis_prm_course_det.recordstatus','!=','DEL']])
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=' , 'mis_prm_course_det.prerequisite')
            ->get([
                'mis_prm_course_det.pk_id AS crsDet_id',
                'prerequisite',
                'crs_code',
                'crs_name',
                'crs_credit'
            ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function checkId(Request $request){
        $crs_id = $request->input('crs_id');
        $prereq = $request->input('prereq');

        $obj = mis_prm_course_det::where([
                ['crs_id','=',$crs_id],
                ['prerequisite','=',$prereq],
                ['recordstatus','!=','DEL']
            ]) 
            ->get();

        if ($obj){
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


    public function delete(Request $request){
        $pk_id = $request->input('pk_id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_course_det::where('pk_id',$pk_id)-> update([
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
