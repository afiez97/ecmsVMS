<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_lecturer_course_detail;
// use DB;
use Illuminate\Support\Facades\DB;


class mis_lecturer_course_detailController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    // register
    public function register(Request $request){
        $fk_lect_crs = $request->input('fk_lect_crs');
        $fk_gsDet = $request->input('fk_gsDet');
        $fk_cotDet = $request->input('fk_cotDet');
        $non_obe_type = $request->input('non_obe_type');
        $item_name = $request->input('item_name');
        $non_obe_percentage = $request->input('non_obe_percentage');
        $recordstatus = $request->input('recordstatus');

        $ass_sltCi = $request->input('ass_sltCi');
        // $clo_lecCourse = $request->input('clo_lecCourse');
        // $weightage = $request->input('weightage');
        // $slt = $request->input('slt');

        // ass_sltCi
        // clo_lecCourse
        // weightage
        // slt

        $obj = mis_lecturer_course_detail::create([
            'fk_lect_crs' => $fk_lect_crs,
            'fk_gsDet' => $fk_gsDet,
            'fk_cotDet' => $fk_cotDet,
            'non_obe_type' => $non_obe_type,
            'item_name' => $item_name,
            'non_obe_percentage' => $non_obe_percentage,
            'recordstatus' => $recordstatus,

            'ass_sltCi' => $ass_sltCi
            // 'clo_lecCourse' => $clo_lecCourse,
            // 'weightage' => $weightage,
            // 'slt' => $slt
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


    // list mark by lecturer course & type
    public function listAss(Request $request){
        $fk_cotDet = $request->input('fk_cotDet');
        $fk_gsDet = $request->input('fk_gsDet');

        $obj = mis_lecturer_course_detail::WHERE([
                ['mis_lecturer_course_detail.recordstatus', '!=', 'DEL'],
                ['fk_cotDet', $fk_cotDet],
                ['fk_gsDet', $fk_gsDet]
            ]) 
            ->leftjoin('gsd_exam_type', 'gsd_exam_type.id','=','mis_lecturer_course_detail.non_obe_type')
            ->leftjoin('obe_clo', 'obe_clo.id_clo','=','mis_lecturer_course_detail.clo_lecCourse')
            ->get([
                'pk_id',
                'fk_lect_crs',
                'fk_cotDet',
                'non_obe_type',
                'gsd_exam_type.gsd_exam_type AS examTypeName',
                'item_name',
                'non_obe_percentage',
                'fk_gsDet', 'ass_sltCi', 'clo_lecCourse', 'weightage', 'slt', 'clo_level'

            ]);

            // dd($obj);

            for($i=0;$i<sizeof($obj);$i++){
                if($obj[$i]->fk_cotDet == $fk_cotDet && $obj[$i]->fk_gsDet == $fk_gsDet){
                    $objpkid = $obj[$i]->pk_id;
                    $obj2 = DB::table('mis_lecturer_course_detail')
                    ->leftJoin('sub_mis_lecturer_course_detail', 'sub_mis_lecturer_course_detail.fk_LecCourseDet', '=', 'mis_lecturer_course_detail.pk_id')
                    ->leftJoin('gsd_exam_type', 'gsd_exam_type.id', '=', 'mis_lecturer_course_detail.non_obe_type')
                    ->leftJoin('obe_clo', 'obe_clo.id_clo', '=', 'sub_mis_lecturer_course_detail.fk_clo')
                    ->select('obe_clo.clo_level','fk_LecCourseDet')
                    ->where('mis_lecturer_course_detail.recordstatus', '!=', 'DEL')
                    ->where('sub_mis_lecturer_course_detail.recordstatus', '!=', 'DEL')
                    ->where('mis_lecturer_course_detail.fk_cotDet', $fk_cotDet)
                    ->where('mis_lecturer_course_detail.fk_gsDet', $fk_gsDet)
                    ->where('mis_lecturer_course_detail.pk_id', $objpkid)
                    ->orderBy('obe_clo.clo_level', 'asc')
                    ->get();
                    $obj[$i] -> clo_list = $obj2;
                }
            }

        

            // dd($obj);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj,
                // 'data2'=>$obj2
            ],200);
        }
    }


    // update
    public function update(Request $request){
        $pk_id = $request->input('pk_id');
        $item_name = $request->input('item_name');
        $non_obe_percentage = $request->input('non_obe_percentage');
        $recordstatus = $request->input('recordstatus');

        $ass_sltCi = $request->input('ass_sltCi');
        // $clo_lecCourse = $request->input('clo_lecCourse');
        // $weightage = $request->input('weightage');
        // $slt = $request->input('slt');

        // ass_sltCi
        // clo_lecCourse
        // weightage
        // slt

        $obj = mis_lecturer_course_detail::where('pk_id',$pk_id)-> update([
            'item_name' => $item_name,
            'non_obe_percentage' => $non_obe_percentage,
            'recordstatus' => $recordstatus,
            'ass_sltCi' => $ass_sltCi
            // 'clo_lecCourse' => $clo_lecCourse,
            // 'weightage' => $weightage,
            // 'slt' => $slt
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

        $obj = mis_lecturer_course_detail::where('pk_id',$pk_id)-> update([
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
    public function listByLectCrs($id){
        $obj = mis_lecturer_course_detail::WHERE([
                ['recordstatus', '!=','DEL'],
                ['fk_lect_crs', $id],
            ]) 
            ->orderBy('item_name')
            ->get([
                'pk_id',
                'fk_lect_crs',
                'non_obe_type',
                'item_name',
                'non_obe_percentage'
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // list sub item by Lecturer Course & Grade Scheme
    public function listSubItem(Request $request){
        // $fk_lect_crs = $request->input('fk_lect_crs');
        $fk_cotDet = $request->input('fk_cotDet');

        $obj = mis_lecturer_course_detail::WHERE([
                ['mis_lecturer_course_detail.recordstatus', '!=', 'DEL'],
                ['mis_prm_gredscheme_det.recordstatus', '!=', 'DEL'],
                // ['fk_lect_crs', $fk_lect_crs],
                ['fk_cotDet', $fk_cotDet]
            ])
            ->leftJoin('mis_prm_gredscheme_det','mis_prm_gredscheme_det.gsd_id','fk_gsDet')
            ->leftJoin('gsd_exam_type','gsd_exam_type.id','mis_prm_gredscheme_det.gsd_exam_type')            
            ->orderBy('gsd_component','ASC')
            ->orderBy('mis_prm_gredscheme_det.gsd_id','ASC')
            ->get([
                'pk_id',
                'item_name',
                'fk_lect_crs',
                'fk_gsDet',
                'non_obe_type',
                'item_name',
                'non_obe_percentage',
                'gsd_component',
                'gsd_percentage',
                'gsd_exam_type.gsd_exam_type',

            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }
}
