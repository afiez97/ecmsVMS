<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_exam_grading;

class mis_exam_gradingController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function register(Request $request){
        $grd_id = $request->input('grd_id');
        $grd_category = $request->input('grd_category');
        $grd_score = $request->input('grd_score');
        $grd_score_to = $request->input('grd_score_to');
        $grd_status = $request->input('grd_status');
        $grd_remarks = $request->input('grd_remarks');
        $quality_point = $request->input('quality_point');
        $recordstatus = $request->input('recordstatus');

        $register = mis_exam_grading::create([
            'grd_id' => $grd_id,
            'grd_category' => $grd_category,
            'grd_score' => $grd_score,
            'grd_score_to' => $grd_score_to,
            'grd_status' => $grd_status,
            'grd_remarks' => $grd_remarks,
            'quality_point' => $quality_point,
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


    // display exam gred undergraduate list
    public function listUndergrad($id){
        $obj = mis_exam_grading::where([['grd_category',$id],['mis_exam_grading.recordstatus','!=','DEL']])
            ->leftjoin('grd_category', 'grd_category.grd_code', '=', 'mis_exam_grading.grd_category')
            ->orderBy('grd_score','desc')
            ->get([
                'mis_exam_grading.pk_id AS exmGrade_id',
                'grd_id',
                'grd_category',
                'category',
                'grd_score',
                'grd_score_to',
                'grd_status',
                'grd_remarks',
                'quality_point'
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

    public function getGrade(Request $request){
        $grd_category = $request->input('grd_category');
        $marks = $request->input('marks');
        $obj = mis_exam_grading::where('grd_category',$grd_category)
        ->where('grd_score','<=',$marks)->where('grd_score_to',">=",$marks)
        // ->whereBetween($marks,['grd_score','grd_score_to'])
        ->first();

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


    public function show($id){
        $obj = mis_exam_grading::SELECT('mis_exam_grading.*','category')
            -> leftjoin('grd_category', 'grd_category.grd_code', '=', 'mis_exam_grading.grd_category')
            -> where('mis_exam_grading.pk_id',$id)->first();

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function update(Request $request){
        $pk_id = $request->input('pk_id');
        $grd_id = $request->input('grd_id');
        $quality_point = $request->input('quality_point');
        $grd_score = $request->input('grd_score');
        $grd_score_to = $request->input('grd_score_to');
        $grd_status = $request->input('grd_status');
        $grd_remarks = $request->input('grd_remarks');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_exam_grading::where('pk_id',$pk_id) -> update([
            'grd_id' => $grd_id,
            'quality_point' => $quality_point,
            'grd_score' => $grd_score,
            'grd_score_to' => $grd_score_to,
            'grd_status' => $grd_status,
            'grd_remarks' => $grd_remarks,
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


    public function delete(Request $request){
        $id = $request->input('pk_id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_exam_grading::where([['pk_id','=',$id]])-> update([
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
