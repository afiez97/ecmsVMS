<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\obe_clo;
use App\Models\mis_lecturer_course_prm;
use App\Models\sub_mis_lecturer_course_detail;
// use DB;
use Illuminate\Support\Facades\DB;


class obe_cloController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function create(Request $request){
        
        $obj = obe_clo::create([
            // 'id_clo' => $request->input('id_clo'),
            'clo_level' => $request->input('clo_level'),
            'clo_statement' => $request->input('clo_statement'),
            'FK_course' => $request->input('FK_course'),
            'SLT_CI' => $request->input('SLT_CI'),
            // 'assesment_weightage' => $request->input('assesment_weightage'),
            'lastupdateby' =>$request->input('lastupdateby'),
            'lastapproveby' =>$request->input('lastapproveby'),
            'recordstatus' => 'ADD',
        ]);
        // $obj->save();
        // $obj->refresh();
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
        $obj = obe_clo::where('id_clo',$id)->first();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function list()  {
        $mis_prm_college = obe_clo::where('recordstatus','!=','DEL')->get();

        if ($mis_prm_college)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$mis_prm_college
            ],200);
        }
        
    }


    public function update(Request $request){


        $obj = obe_clo::where('id_clo',$request->input('id_clo'))-> update([
            'clo_level' => $request->input('clo_level'),
            'clo_statement' => $request->input('clo_statement'),
            'assesment_weightage' => $request->input('assesment_weightage'),
            'lastupdateby' =>$request->input('lastupdateby'),
            'lastapproveby' =>$request->input('lastapproveby'),
            'recordstatus' => $request->input('recordstatus'),
            'SLT_CI' => $request->input('SLT_CI'),
        ]); 
        // $obj->first();
        // $obj->save();
        // $obj->refresh();

        if ($obj ){

            $updatedFields = [
                'clo_level' => $request->input('upd_clo_level'),
                'clo_statement' => $request->input('upd_clo_statement'),
                'assesment_weightage' => $request->input('assesment_weightage'),
                'lastupdateby' => $request->input('lastupdateby'),
                'lastapproveby' => $request->input('lastapproveby'),
                'recordstatus' => $request->input('recordstatus'),
            ];
            return response()->json([
                'success'=>true,
                'message'=>"Update Success!",
                'data' => $updatedFields
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
        $id_clo = $request->input('id_clo');
        // $recordstatus = $request->input('recordstatus');

        $obj = obe_clo::where('id_clo',$id_clo)-> update([
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


    public function showByCourse($FK_course){

        $obj = obe_clo::where('FK_course',$FK_course)
                        ->where('recordstatus', '!=', 'DEL')
                        ->get();


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

    public function showByCoursedet(Request $request){

        $FK_course = $request->input('FK_course');

        $obj = obe_clo::where('FK_course',$FK_course)
                        ->where('recordstatus', '!=', 'DEL')
                        ->orderBy('clo_level', 'asc')
                        ->get([
                            'clo_level',
                            'id_clo',
                            'clo_statement'
                        ]);

        if ($obj){
            return response()->json([
                'success'=>true,
                'message'=>"Hapus Berjaya!",
                'data' => $obj,
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Hapus Gagal!",
                'data'=>'',
            ],401);
        }
    }

    // public function showByCoursedet2(Request $request){

    //     $FK_course = $request->input('FK_course');

    //     $obj = DB::table('mis_lecturer_course_prm')
    //         ->select(
    //             'sub_mis_lecturer_course_detail.fk_clo',
    //             'obe_clo.clo_level', 'obe_clo.SLT_CI',
    //             DB::raw('SUM(sub_mis_lecturer_course_detail.weightage) AS total_weightage'),
    //             DB::raw('SUM(sub_mis_lecturer_course_detail.SLT) AS total_SLT'),
    //             DB::raw('SUM(mis_lecturer_course_detail.ass_sltCi) AS total_assSLT'),
                
    //         )
    //         ->leftJoin('mis_lecturer_course_detail', 'mis_lecturer_course_detail.fk_lect_crs', '=', 'mis_lecturer_course_prm.pk_id')
    //         ->leftJoin('sub_mis_lecturer_course_detail', 'sub_mis_lecturer_course_detail.fk_LecCourseDet', '=', 'mis_lecturer_course_detail.pk_id')
    //         ->leftJoin('obe_clo', 'obe_clo.id_clo', '=', 'sub_mis_lecturer_course_detail.fk_clo')
    //         ->where('mis_lecturer_course_prm.crs_code', $FK_course)
    //         ->where('mis_lecturer_course_prm.recordstatus', '!=', 'DEL')
    //         ->where('mis_lecturer_course_detail.recordstatus', '!=', 'DEL')
    //         ->where('sub_mis_lecturer_course_detail.recordstatus', '!=', 'DEL')
    //         ->groupBy('sub_mis_lecturer_course_detail.fk_clo', 'obe_clo.clo_level')
    //         ->orderBy('sub_mis_lecturer_course_detail.fk_clo')
    //         ->get();


    //         $result = DB::table('mis_lecturer_course_prm')
    //             ->leftJoin('mis_lecturer_course_detail', 'mis_lecturer_course_detail.fk_lect_crs', '=', 'mis_lecturer_course_prm.pk_id')
    //             ->leftJoin('sub_mis_lecturer_course_detail', 'sub_mis_lecturer_course_detail.fk_LecCourseDet', '=', 'mis_lecturer_course_detail.pk_id')
    //             ->leftJoin('obe_clo', 'obe_clo.id_clo', '=', 'sub_mis_lecturer_course_detail.fk_clo')
    //             ->select('sub_mis_lecturer_course_detail.fk_clo', 'obe_clo.SLT_CI AS total_SLT_CI')
    //             ->where('mis_lecturer_course_prm.crs_code',  $FK_course)
    //             ->where('mis_lecturer_course_prm.recordstatus', '!=', 'DEL')
    //             ->where('mis_lecturer_course_detail.recordstatus', '!=', 'DEL')
    //             ->where('sub_mis_lecturer_course_detail.recordstatus', '!=', 'DEL')
    //             ->groupBy('sub_mis_lecturer_course_detail.fk_clo')
    //             ->get();


    //         $obj2 = $result->sum('total_SLT_CI');
    //         $obj3 = $obj->sum('total_assSLT');


    //     if ($obj){
    //         return response()->json([
    //             'success'=>true,
    //             'message'=>"Hapus Berjaya!",
    //             'data' => $obj,
    //             'data2' => $obj2,
    //             'data3' => $obj3
    //         ],200);
    //     }
    //     else{
    //         return response()->json([
    //             'success'=>false,
    //             'message'=>"Hapus Gagal!",
    //             'data'=>'',
    //             'data2'=>''
    //         ],401);
    //     }
    // }

    public function showByCoursedet2(Request $request){

        $FK_course = $request->input('FK_course');

        $obj = DB::table('mis_lecturer_course_prm')
        ->select(
            'sub_mis_lecturer_course_detail.fk_clo',
            'obe_clo.clo_level',
            'obe_clo.clo_statement',
            'obe_clo.SLT_CI',
            DB::raw('SUM(sub_mis_lecturer_course_detail.SLT) AS total_SLT'),
            DB::raw('sub_mis_lecturer_course_detail.marks / SUM(sub_mis_lecturer_course_detail.marks) OVER (PARTITION BY mis_lecturer_course_detail.pk_id) * mis_lecturer_course_detail.non_obe_percentage AS total_weightage'),
            DB::raw('sub_mis_lecturer_course_detail.marks / SUM(sub_mis_lecturer_course_detail.marks) OVER (PARTITION BY mis_lecturer_course_detail.pk_id) * mis_lecturer_course_detail.ass_sltCi AS total_sltCi')
        )
        ->leftJoin('mis_lecturer_course_detail', 'mis_lecturer_course_detail.fk_lect_crs', '=', 'mis_lecturer_course_prm.pk_id')
        ->leftJoin('sub_mis_lecturer_course_detail', 'sub_mis_lecturer_course_detail.fk_LecCourseDet', '=', 'mis_lecturer_course_detail.pk_id')
        ->leftJoin('obe_clo', 'obe_clo.id_clo', '=', 'sub_mis_lecturer_course_detail.fk_clo')
        ->where('mis_lecturer_course_prm.crs_code', $FK_course)
        ->where('mis_lecturer_course_prm.recordstatus', '!=', 'DEL')
        ->where('mis_lecturer_course_detail.recordstatus', '!=', 'DEL')
        ->where('sub_mis_lecturer_course_detail.recordstatus', '!=', 'DEL')
        ->groupBy(
            'sub_mis_lecturer_course_detail.fk_clo',
            'obe_clo.clo_level',
            'obe_clo.clo_statement',
            'mis_lecturer_course_detail.pk_id',
            'sub_mis_lecturer_course_detail.marks',
            'sub_mis_lecturer_course_detail.weightage',
            'sub_mis_lecturer_course_detail.SLT'
        )
        ->orderBy('sub_mis_lecturer_course_detail.fk_clo')
        ->get();
    

        $data2 = $obj->groupBy(
            'fk_clo',
            'clo_level',
            'clo_statement',
            'SLT_CI'
        )
        ->map(function ($groupedItems) {
            $firstItem = $groupedItems->first();

            // dd($firstItem);
            return [
                'fk_clo' => $firstItem->fk_clo,
                'clo_level' => $firstItem->clo_level,
                'clo_statement' => $firstItem->clo_statement,
                'SLT_CI' => $firstItem->SLT_CI,
                'sum_total_SLT' => $groupedItems->sum('sumSLT'),
                'sum_total_weightage' => $groupedItems->sum('total_weightage'),
                'total_assSLT' => $groupedItems->sum('total_sltCi'),
            ];
        })
        ->values();

        // $obj = DB::table('mis_lecturer_course_prm')
        //     ->select(
        //         'sub_mis_lecturer_course_detail.fk_clo',
        //         'obe_clo.clo_level', 'obe_clo.SLT_CI',
        //         DB::raw('SUM(sub_mis_lecturer_course_detail.weightage) AS total_weightage'),
        //         DB::raw('SUM(sub_mis_lecturer_course_detail.SLT) AS total_SLT'),
        //         DB::raw('SUM(mis_lecturer_course_detail.ass_sltCi) AS total_assSLT'),
                
        //     )
        //     ->leftJoin('mis_lecturer_course_detail', 'mis_lecturer_course_detail.fk_lect_crs', '=', 'mis_lecturer_course_prm.pk_id')
        //     ->leftJoin('sub_mis_lecturer_course_detail', 'sub_mis_lecturer_course_detail.fk_LecCourseDet', '=', 'mis_lecturer_course_detail.pk_id')
        //     ->leftJoin('obe_clo', 'obe_clo.id_clo', '=', 'sub_mis_lecturer_course_detail.fk_clo')
        //     ->where('mis_lecturer_course_prm.crs_code', $FK_course)
        //     ->where('mis_lecturer_course_prm.recordstatus', '!=', 'DEL')
        //     ->where('mis_lecturer_course_detail.recordstatus', '!=', 'DEL')
        //     ->where('sub_mis_lecturer_course_detail.recordstatus', '!=', 'DEL')
        //     ->groupBy('sub_mis_lecturer_course_detail.fk_clo', 'obe_clo.clo_level')
        //     ->orderBy('sub_mis_lecturer_course_detail.fk_clo')
        //     ->get();


            $result = DB::table('mis_lecturer_course_prm')
                ->leftJoin('mis_lecturer_course_detail', 'mis_lecturer_course_detail.fk_lect_crs', '=', 'mis_lecturer_course_prm.pk_id')
                ->leftJoin('sub_mis_lecturer_course_detail', 'sub_mis_lecturer_course_detail.fk_LecCourseDet', '=', 'mis_lecturer_course_detail.pk_id')
                ->leftJoin('obe_clo', 'obe_clo.id_clo', '=', 'sub_mis_lecturer_course_detail.fk_clo')
                ->select('sub_mis_lecturer_course_detail.fk_clo', 'obe_clo.SLT_CI AS total_SLT_CI')
                ->where('mis_lecturer_course_prm.crs_code',  $FK_course)
                ->where('mis_lecturer_course_prm.recordstatus', '!=', 'DEL')
                ->where('mis_lecturer_course_detail.recordstatus', '!=', 'DEL')
                ->where('sub_mis_lecturer_course_detail.recordstatus', '!=', 'DEL')
                ->groupBy('sub_mis_lecturer_course_detail.fk_clo')
                ->get();


            $obj2 = $result->sum('total_SLT_CI');
            $obj3 = $data2->sum('total_assSLT');


        if ($obj){
            return response()->json([
                'success'=>true,
                'message'=>"Hapus Berjaya!",
                'data' => $data2,
                'data2' => $obj2,
                'data3' => $obj3
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Hapus Gagal!",
                'data'=>'',
                'data2'=>''
            ],401);
        }
    }

}