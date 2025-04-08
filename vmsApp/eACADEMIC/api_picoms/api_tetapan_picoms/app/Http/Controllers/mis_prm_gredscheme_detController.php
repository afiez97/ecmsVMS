<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_prm_gredscheme_det;
use App\Models\mis_prm_obe_plo;

use DB;

class mis_prm_gredscheme_detController extends Controller
{
    public function register(Request $request){
        $gsc_id = $request->input('gsc_id');
        $fk_course = $request->input('fk_course');
        $gsd_exam_type = $request->input('gsd_exam_type');
        $gsd_component = $request->input('gsd_component');
        $gsd_percentage = $request->input('gsd_percentage');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_gredscheme_det::create([
            'gsc_id' => $gsc_id,
            'fk_course' => $fk_course,
            'gsd_exam_type' => $gsd_exam_type,
            'gsd_component' => $gsd_component,
            'gsd_percentage' => $gsd_percentage,
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


    public function show(Request $request){
        $gsc_id = $request->input('gsc_id');

        $obj = mis_prm_gredscheme_det::where([['gsc_id','=',$gsc_id],['mis_prm_gredscheme_det.recordstatus','!=','DEL']])
            ->leftjoin('gsd_exam_type', 'gsd_exam_type.id','=','mis_prm_gredscheme_det.gsd_exam_type')
            ->get([
                'gsd_id',
                'gsc_id',
                'mis_prm_gredscheme_det.gsd_exam_type AS examTypeId',
                'gsd_exam_type.gsd_exam_type AS examTypeName',
                'gsd_component',
                'gsd_percentage'
            ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function list()  {
        $mis_prm_gredscheme_det = mis_prm_gredscheme_det::where([['recordstatus','!=','DEL']])->get();

        if ($mis_prm_gredscheme_det)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$mis_prm_gredscheme_det
            ],200);
        }
        
    }


    public function update(Request $request){
        $gsd_id = $request->input('gsd_id');
        $gsd_exam_type = $request->input('gsd_exam_type');
        $gsd_component = $request->input('gsd_component');
        $gsd_percentage = $request->input('gsd_percentage');
        $recordstatus = $request->input('recordstatus');

        $mis_prm_gredscheme_det = mis_prm_gredscheme_det::where([['gsd_id','=',$gsd_id]]) -> update([
            'gsd_exam_type' => $gsd_exam_type,
            'gsd_component' => $gsd_component,
            'gsd_percentage' => $gsd_percentage,
            'recordstatus' => $recordstatus,
        ]);

        if ($mis_prm_gredscheme_det)  {
            return response()->json([
                'success'=>true,
                'message'=>"Update Success!",
                'data' => $mis_prm_gredscheme_det
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
        $gsd_id = $request->input('gsd_id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_gredscheme_det::where([['gsd_id','=',$gsd_id]]) -> update([
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
            ],404);
        }
    }


    // list by grade scheme course
    public function listByGS($id){
        $obj = mis_prm_gredscheme_det::where([['gsc_id','=',$id],['mis_prm_gredscheme_det.recordstatus','!=','DEL']])
            ->leftjoin('gsd_exam_type', 'gsd_exam_type.id','=','mis_prm_gredscheme_det.gsd_exam_type')
            ->orderBy('mis_prm_gredscheme_det.gsd_component','ASC')
            ->orderBy('gsc_id','ASC')
            ->get([
                'gsd_id',
                'gsc_id',
                'mis_prm_gredscheme_det.gsd_exam_type AS examTypeId',
                'gsd_exam_type.gsd_exam_type AS examTypeName',
                'gsd_component',
                'gsd_percentage'
            ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
        
    }
    public function listByGS2($id){
        $obj = mis_prm_gredscheme_det::where([['gsc_id','=',$id],
                ['mis_prm_gredscheme_det.recordstatus','!=','DEL'],
                ['mis_prm_gredscheme_det.gsd_component','=','Summative Assessment']
                ])
            ->leftjoin('gsd_exam_type', 'gsd_exam_type.id','=','mis_prm_gredscheme_det.gsd_exam_type')
            ->orderBy('mis_prm_gredscheme_det.gsd_component','ASC')
            ->orderBy('gsc_id','ASC')
            ->get([
                'gsd_id',
                'gsc_id',
                'mis_prm_gredscheme_det.gsd_exam_type AS examTypeId',
                'gsd_exam_type.gsd_exam_type AS examTypeName',
                'gsd_component',
                'gsd_percentage'
            ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
        
    }

    public function listByCLO($id){
        $obj = DB::table('mis_lecturer_course_detail')
            ->select([
                'sub_mis_lecturer_course_detail.fk_clo',
                DB::raw('SUM(sub_mis_lecturer_course_detail.marks) as full_marks'),
                'obe_clo.clo_level',
            ])
            ->leftJoin('sub_mis_lecturer_course_detail', 'sub_mis_lecturer_course_detail.fk_LecCourseDet', '=', 'mis_lecturer_course_detail.pk_id')
            ->leftJoin('obe_clo', 'obe_clo.id_clo', '=', 'sub_mis_lecturer_course_detail.fk_clo')
            ->where('mis_lecturer_course_detail.fk_cotDet', $id)
            // ->where('mis_lecturer_course_detail.fk_cotDet', 3994)
            ->where('mis_lecturer_course_detail.recordstatus', '!=', 'DEL')
            ->where('sub_mis_lecturer_course_detail.recordstatus', '!=', 'DEL')
            ->where('obe_clo.recordstatus', '!=', 'DEL')
            ->groupBy([
                'sub_mis_lecturer_course_detail.fk_clo',
                'obe_clo.clo_level',
            ])
            ->orderBy('obe_clo.clo_level', 'ASC')
            ->get();


        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
        
    }

    public function listByPLO($id){

        $obj = DB::table('mis_lecturer_course_detail')
            ->select([
                'sub_mis_lecturer_course_detail.fk_clo',
                DB::raw('SUM(sub_mis_lecturer_course_detail.marks) as full_marks'),
                'obe_clo.clo_level',
                'obe_clo.FK_course',
                'mis_prm_obe_plo_generate.FK_clo',
            ])
            ->leftJoin('sub_mis_lecturer_course_detail', 'sub_mis_lecturer_course_detail.fk_LecCourseDet', '=', 'mis_lecturer_course_detail.pk_id')
            ->leftJoin('obe_clo', 'obe_clo.id_clo', '=', 'sub_mis_lecturer_course_detail.fk_clo')
            ->leftJoin('mis_prm_obe_plo_generate', 'mis_prm_obe_plo_generate.FK_course', '=', 'obe_clo.FK_course')
            ->where('mis_lecturer_course_detail.fk_cotDet', $id)
            ->where('mis_lecturer_course_detail.recordstatus', '!=', 'DEL')
            ->where('sub_mis_lecturer_course_detail.recordstatus', '!=', 'DEL')
            ->where('obe_clo.recordstatus', '!=', 'DEL')
            ->groupBy([
                'sub_mis_lecturer_course_detail.fk_clo',
                'obe_clo.clo_level',
                'obe_clo.FK_course',
                'mis_prm_obe_plo_generate.FK_clo',
            ])
            ->orderBy('obe_clo.clo_level', 'ASC')
            ->get();

        foreach ($obj as $item) {
            $FK_clo = json_decode($item->FK_clo);
            $item->obe_plo_id = null;
            $item->obe_plo_name = null;
            $item->pgm_id = null;
            $item->obe_plo_statement = null;
            
            foreach ($FK_clo as $clo) {
                $arr_FK_clo = explode('_', $clo);
                if ($arr_FK_clo[0] == $item->fk_clo) {
                    $item->obe_plo_id = $arr_FK_clo[1];
                    $obj_obeplo = mis_prm_obe_plo::where('obe_plo_id', $item->obe_plo_id)->where('recordstatus', '!=', 'DEL')->first();
                    if ($obj_obeplo) {
                        $item->obe_plo_name = $obj_obeplo->obe_plo_name;
                        $item->pgm_id = $obj_obeplo->pgm_id;
                        $item->obe_plo_statement = $obj_obeplo->obe_plo_statement;
                    }
                }
            }
        }

        $obj2 = [];

        foreach ($obj as $item) {
            $obj2[] = [
                'full_mark' => $item->full_marks,
                'obe_plo_id' => $item->obe_plo_id,
                'obe_plo_name' => $item->obe_plo_name,
            ];
        }

        // Initialize an associative array to store the grouped and summed data
        $summedData = [];

        // Iterate through $obj2
        foreach ($obj2 as $item) {
            $obe_plo_id = $item['obe_plo_id'];
            $obe_plo_name = $item['obe_plo_name'];
            $full_mark = $item['full_mark'];

            // Only include data where obe_plo_id is not null
            if ($obe_plo_id !== null) {
                // If the key exists in $summedData, add the full_mark to it, otherwise initialize it
                if (isset($summedData[$obe_plo_id][$obe_plo_name])) {
                    $summedData[$obe_plo_id][$obe_plo_name] += $full_mark;
                } else {
                    $summedData[$obe_plo_id][$obe_plo_name] = $full_mark;
                }
            }
        }

        // Format the grouped and summed data into a final array
        $result = [];
        foreach ($summedData as $obe_plo_id => $data) {
            foreach ($data as $obe_plo_name => $sum) {
                $result[] = [
                    'obe_plo_id' => $obe_plo_id,
                    'obe_plo_name' => $obe_plo_name,
                    'sum_full_mark' => $sum,
                ];
            }
        }

        // Now $result contains only the data where obe_plo_id is not null




        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                // 'data'=>$obj,
                // 'data'=>$obj2,
                'data'=>$result,
            ],200);
        }
        
    }

    public function listByAll($id){

        $obj = DB::table('mis_lecturer_course_detail')
            ->select([
                'mis_lecturer_course_detail.pk_id',
                'mis_lecturer_course_detail.item_name',
                'sub_mis_lecturer_course_detail.fk_clo',
                'obe_clo.clo_level',
                'sub_mis_lecturer_course_detail.marks',
            ])
            ->leftJoin('sub_mis_lecturer_course_detail', 'sub_mis_lecturer_course_detail.fk_LecCourseDet', '=', 'mis_lecturer_course_detail.pk_id')
            ->leftJoin('obe_clo', 'sub_mis_lecturer_course_detail.fk_clo', '=', 'obe_clo.id_clo')
            ->where('mis_lecturer_course_detail.fk_cotDet', '=', $id)
            ->where('sub_mis_lecturer_course_detail.recordstatus', '!=', 'DEL')
            ->get();

        // $result now contains the query result

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj,
                // 'data'=>$obj2,
                // 'data'=>$result,
            ],200);
        }
        
    }
    
}
