<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\sub_mis_lecturer_course_detail;
// use DB;
use Illuminate\Support\Facades\DB;

class sub_mis_lecturer_course_detailController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    // register
    public function register(Request $request){

        $fk_clo = $request->input('fk_clo');
        $fk_LecCourseDet = $request->input('fk_LecCourseDet');
        $marks = $request->input('marks');
        $weightage = $request->input('weightage');
        $SLT = $request->input('SLT');
        $recordstatus = 'ADD';

        $obj = sub_mis_lecturer_course_detail::create([
            'fk_clo' => $fk_clo,
            'fk_LecCourseDet' => $fk_LecCourseDet,
            'marks' => $marks,
            'weightage' => $weightage,
            'SLT' => $SLT,
            'recordstatus' => $recordstatus
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


    // // list mark by lecturer course & type
    // public function listAss(Request $request){
    //     $fk_cotDet = $request->input('fk_cotDet');
    //     $fk_gsDet = $request->input('fk_gsDet');

    //     $obj = mis_lecturer_course_detail::WHERE([
    //             ['mis_lecturer_course_detail.recordstatus', '!=', 'DEL'],
    //             ['fk_cotDet', $fk_cotDet],
    //             ['fk_gsDet', $fk_gsDet]
    //         ]) 
    //         ->leftjoin('gsd_exam_type', 'gsd_exam_type.id','=','mis_lecturer_course_detail.non_obe_type')
    //         ->leftjoin('obe_clo', 'obe_clo.id_clo','=','mis_lecturer_course_detail.clo_lecCourse')
    //         ->get([
    //             'pk_id',
    //             'fk_lect_crs',
    //             'fk_cotDet',
    //             'non_obe_type',
    //             'gsd_exam_type.gsd_exam_type AS examTypeName',
    //             'item_name',
    //             'non_obe_percentage',
    //             'fk_gsDet', 'ass_sltCi', 'clo_lecCourse', 'weightage', 'slt', 'clo_level'

    //         ]);

    //     if($obj){
    //         return response()->json([
    //             'success'=>'true',
    //             'message'=>'List Success!',
    //             'data'=>$obj
    //         ],200);
    //     }
    // }


    // update
    public function update(Request $request){
        $pk_id = $request->input('pk_id');
        $fk_clo = $request->input('fk_clo');
        $marks = $request->input('marks');
        $weightage = $request->input('weightage');
        $SLT = $request->input('SLT');
        $recordstatus = $request->input('recordstatus');



        $obj = sub_mis_lecturer_course_detail::where('pk_id',$pk_id)-> update([
            'marks' => $marks,
            'recordstatus' => $recordstatus,
            'fk_clo' => $fk_clo,
            'weightage' => $weightage,
            'SLT' => $SLT
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

        $obj = sub_mis_lecturer_course_detail::where('pk_id',$pk_id)-> update([
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


    // list mark by lecturer course
    // public function listByLectCrs($id){
    //     $obj = mis_lecturer_course_detail::WHERE([
    //             ['recordstatus', '!=','DEL'],
    //             ['fk_lect_crs', $id],
    //         ]) 
    //         ->orderBy('item_name')
    //         ->get([
    //             'pk_id',
    //             'fk_lect_crs',
    //             'non_obe_type',
    //             'item_name',
    //             'non_obe_percentage'
    //         ]);

    //     if($obj){
    //         return response()->json([
    //             'success'=>'true',
    //             'message'=>'List Success!',
    //             'data'=>$obj
    //         ],200);
    //     }
    // }


    // // list sub item by Lecturer Course & Grade Scheme
    // public function listSubItem(Request $request){
    //     // $fk_lect_crs = $request->input('fk_lect_crs');
    //     $fk_cotDet = $request->input('fk_cotDet');

    //     $obj = mis_lecturer_course_detail::WHERE([
    //             ['mis_lecturer_course_detail.recordstatus', '!=', 'DEL'],
    //             // ['fk_lect_crs', $fk_lect_crs],
    //             ['fk_cotDet', $fk_cotDet]
    //         ])
    //         ->leftJoin('mis_prm_gredscheme_det','mis_prm_gredscheme_det.gsd_id','fk_gsDet')
    //         ->leftJoin('gsd_exam_type','gsd_exam_type.id','mis_prm_gredscheme_det.gsd_exam_type')            
    //         ->orderBy('gsd_component','ASC')
    //         ->orderBy('mis_prm_gredscheme_det.gsd_id','ASC')
    //         ->get([
    //             'pk_id',
    //             'item_name',
    //             'fk_lect_crs',
    //             'fk_gsDet',
    //             'non_obe_type',
    //             'item_name',
    //             'non_obe_percentage',
    //             'gsd_component',
    //             'gsd_percentage',
    //             'gsd_exam_type.gsd_exam_type'

    //         ]);

    //     if($obj){
    //         return response()->json([
    //             'success'=>'true',
    //             'message'=>'List Success!',
    //             'data'=>$obj
    //         ],200);
    //     }
    // }

    public function show($id)  {

        // mis_lecturer_course_detail
        $obj = DB::table('sub_mis_lecturer_course_detail')
            ->leftJoin('obe_clo', 'obe_clo.id_clo', '=', 'sub_mis_lecturer_course_detail.fk_clo')
            ->leftJoin('mis_lecturer_course_detail', 'mis_lecturer_course_detail.pk_id', '=', 'sub_mis_lecturer_course_detail.fk_LecCourseDet')
            ->select('sub_mis_lecturer_course_detail.fk_LecCourseDet','sub_mis_lecturer_course_detail.pk_id', 'sub_mis_lecturer_course_detail.fk_clo', 'sub_mis_lecturer_course_detail.marks', 'sub_mis_lecturer_course_detail.weightage', 'sub_mis_lecturer_course_detail.SLT',
                'obe_clo.id_clo', 'obe_clo.FK_course', 'obe_clo.clo_level', 'obe_clo.clo_statement', 'mis_lecturer_course_detail.ass_sltCi',
                'mis_lecturer_course_detail.item_name'
                
                )
            ->where('sub_mis_lecturer_course_detail.fk_LecCourseDet', $id)
            ->where(function ($query) {
                $query->where('sub_mis_lecturer_course_detail.recordstatus', '!=', 'DEL')
                    ->orWhereNull('sub_mis_lecturer_course_detail.recordstatus');
            })
            ->get();

        $totalMarks = $obj->sum('marks');

// $sumOfMarks now contains the sum of sub_mis_lecturer_course_detail.marks from $obj




        if ($obj)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj,
                'data2'=>$totalMarks
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
}
