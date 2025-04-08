<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_lecturer_stdmark;
use Illuminate\Support\Facades\DB;
// use DB;

class mis_lecturer_stdmarkController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }


    public function register(Request $request)
    {
        $fk_lectCrsDet = $request->input('fk_lectCrsDet');
        $fk_student = $request->input('fk_student');
        $fk_course = $request->input('fk_course');
        $mark = $request->input('mark');
        $full_mark = $request->input('full_mark');
        $recordstatus = $request->input('recordstatus');



        // Check if a non-deleted record with the same fk_lectCrsDet and fk_student already exists
        $existingRecord = mis_lecturer_stdmark::where('fk_lectCrsDet', $fk_lectCrsDet)
            ->where('fk_student', $fk_student)
            ->where('recordstatus', '!=', 'DEL')
            ->first();

        if ($existingRecord) {
            return response()->json([
                'success' => 'false',
                'message' => 'Record already exists and is not deleted.',
                'data' => $existingRecord
            ], 400);
        }

        $obj = mis_lecturer_stdmark::create([
            'fk_lectCrsDet' => $fk_lectCrsDet,
            'fk_student' => $fk_student,
            'fk_course' => $fk_course,
            'mark' => $mark,
            'full_mark' => $full_mark,
            'recordstatus' => $recordstatus,
        ]);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'Register Success!',
                'data' => $obj
            ], 201);
        } else {
            return response()->json([
                'success' => 'false',
                'message' => 'Bad Request',
                'data' => $obj
            ], 400);
        }
    }

    public function register2(Request $request)
    {
        $fk_lectCrsDet = $request->input('fk_lectCrsDet');
        $fk_student = $request->input('fk_student');
        $fk_course = $request->input('fk_course');
        $mark = $request->input('mark');
        $full_mark = $request->input('full_mark');
        $json_clo_crsDet = $request->input('json_clo_crsDet');
        // $fk_idClo = $request->input('fk_idClo');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_lecturer_stdmark::create([
            'fk_lectCrsDet' => $fk_lectCrsDet,
            'fk_student' => $fk_student,
            'fk_course' => $fk_course,
            'mark' => $mark,
            'full_mark' => $full_mark,
            'json_clo_crsDet' => $json_clo_crsDet,
            // 'fk_idClo' => $fk_idClo,
            'recordstatus' => $recordstatus,
        ]);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'Register Success!',
                'data' => $obj
            ], 201);
        } else {
            return response()->json([
                'success' => 'false',
                'message' => 'Bad Request',
                'data' => $obj
            ], 400);
        }
    }


    public function update(Request $request)
    {
        $pk_id = $request->input('pk_id');
        $mark = $request->input('mark');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_lecturer_stdmark::where('pk_id', $pk_id)
            ->where('recordstatus', '!=', 'DEL')
            ->update([
                'mark' => $mark,
                'recordstatus' => $recordstatus,
            ]);

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "Kemaskini Berjaya!",
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success'=>false,
                'message'=>"Kemaskini Gagal!",
                'data'=>''
            ],404);
        }
    }



    public function updateCLOMark(Request $request)
    {
        $pk_id = $request->input('pk_id');
        $mark = $request->input('mark');
        $fkCLO_level = $request->input('fkCLO_level');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_lecturer_stdmark::where('pk_id', $pk_id)
            ->where('recordstatus', '!=', 'DEL')
            // ->update([
            //     'mark' => $mark,
            //     'recordstatus' => $recordstatus,
            // ])
            ->first();


        // Decode the JSON string into an array
        $json_clo_crsDet = json_decode($obj->json_clo_crsDet, true);

        // Loop through the array to find the matching CLO level
        foreach ($json_clo_crsDet as &$item) {

            if ($item['fk_CLO'] == $fkCLO_level) {
                // Update the mark value

                $item['mark'] = $mark;

                break; // Break the loop once updated
            }
        }

        // Update the record with the modified JSON string
        $obj->json_clo_crsDet = json_encode($json_clo_crsDet);

        $obj->save();

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "Kemaskini Berjaya!",
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Kemaskini Gagal!",
                'data' => ''
            ], 404);
        }
    }

    public function update2(Request $request)
    {
        $pk_id = $request->input('pk_id');
        // $mark = $request->input('mark');
        $json_clo_crsDet = $request->input('json_clo_crsDet');
        // $fk_idClo = $request->input('fk_idClo');
        $recordstatus = $request->input('recordstatus');

        // $obj = mis_lecturer_stdmark::where('pk_id',$pk_id) ->update([
        //     'mark' => $mark,
        //     'recordstatus' => $recordstatus,
        // ]);

        $obj = mis_lecturer_stdmark::where('pk_id', $pk_id)
            // ->where('fk_idClo', $fk_idClo)
            ->update([
                'json_clo_crsDet' => $json_clo_crsDet,
                // 'fk_idClo' => $fk_idClo,
                // 'mark' => $mark,
                'recordstatus' => $recordstatus,
            ]);


        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "Kemakini Berjaya!",
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success'=>false,
                'message'=>"Kemaskini Gagal!",
                'data'=>''
            ],404);
        }
    }


    // check student mark by sub item
    public function chkStdMark(Request $request)
    {
        $fk_lectCrsDet = $request->input('fk_lectCrsDet');
        $fk_student = $request->input('fk_student');

        $obj = mis_lecturer_stdmark::where([
            ['mis_lecturer_stdmark.fk_lectCrsDet', '=', $fk_lectCrsDet],
            ['mis_lecturer_stdmark.fk_student', '=', $fk_student],
            ['mis_lecturer_stdmark.recordstatus', '!=', 'DEL']
        ])
            ->join('mis_lecturer_course_detail', 'mis_lecturer_course_detail.pk_id', 'fk_lectCrsDet')
            ->join('mis_prm_gredscheme_det', 'mis_prm_gredscheme_det.gsd_id', 'fk_gsDet')
            ->join('gsd_exam_type', 'gsd_exam_type.id', 'mis_prm_gredscheme_det.gsd_exam_type')
            ->get([
                'mis_lecturer_stdmark.pk_id',
                'fk_lectCrsDet',
                'fk_student',
                'mark',
                'mis_lecturer_stdmark.full_mark',
                'non_obe_percentage',
                'item_name',
                'gsd_component',
                'gsd_percentage',
                'gsd_exam_type.gsd_exam_type',
                'mis_lecturer_course_detail.fk_gsDet',
                'mis_lecturer_stdmark.json_clo_crsDet',
            ]);

        if (sizeof($obj) > 0) {
            return response()->json([
                'success' => true,
                'message' => 'List Success!',
                'data' => $obj
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Bad Request',
                'data' => $obj
            ], 400);
        }
    }



    public function chkStdMark2(Request $request)
    {
        $fk_lectCrsDet = $request->input('fk_lectCrsDet');
        $fk_student = $request->input('fk_student');
        $fk_idClo = $request->input('fk_idClo');

        $obj = mis_lecturer_stdmark::where([
            ['mis_lecturer_stdmark.fk_lectCrsDet', '=', $fk_lectCrsDet],
            ['mis_lecturer_stdmark.fk_student', '=', $fk_student],
            // ['mis_lecturer_stdmark.fk_idClo','=',$fk_idClo],
            ['mis_lecturer_stdmark.recordstatus', '!=', 'DEL'],
            ['mis_lecturer_course_detail.recordstatus', '!=', 'DEL'] // afiez buka testing 04ogos2024 
        ])
            ->join('mis_lecturer_course_detail', 'mis_lecturer_course_detail.pk_id', 'fk_lectCrsDet')
            ->join('mis_prm_gredscheme_det', 'mis_prm_gredscheme_det.gsd_id', 'fk_gsDet')
            ->join('gsd_exam_type', 'gsd_exam_type.id', 'mis_prm_gredscheme_det.gsd_exam_type')
            ->get([
                'mis_lecturer_stdmark.pk_id',
                'fk_lectCrsDet',
                'fk_student',
                'mark',
                'mis_lecturer_stdmark.full_mark',
                'non_obe_percentage',
                'item_name',
                'gsd_component',
                'gsd_percentage',
                'gsd_exam_type.gsd_exam_type',
                'mis_lecturer_course_detail.fk_gsDet',
                'mis_lecturer_stdmark.json_clo_crsDet',
            ]);

        if (sizeof($obj) > 0) {
            return response()->json([
                'success' => true,
                'message' => 'List Success!',
                'data' => $obj
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Bad Request',
                'data' => $obj
            ], 400);
        }
    }

    public function chkStdMark3(Request $request)
    {
        $fk_lectCrsDet = $request->input('fk_lectCrsDet');
        $fk_student = $request->input('fk_student');

        $obj = DB::table('mis_lecturer_stdmark')
            ->join('mis_lecturer_course_detail', 'mis_lecturer_course_detail.pk_id', '=', 'mis_lecturer_stdmark.fk_lectCrsDet')
            ->join('mis_prm_gredscheme_det', 'mis_prm_gredscheme_det.gsd_id', '=', 'mis_lecturer_course_detail.fk_gsDet')
            ->join('gsd_exam_type', 'gsd_exam_type.id', '=', 'mis_prm_gredscheme_det.gsd_exam_type')
            ->where('mis_lecturer_stdmark.fk_lectCrsDet', $fk_lectCrsDet)
            ->where('mis_lecturer_stdmark.fk_student', $fk_student)
            ->where('mis_lecturer_stdmark.recordstatus', '!=', 'DEL')
            // ->where('mis_lecturer_stdmark.fk_idClo', '!=',NULL)
            ->groupBy('fk_lectCrsDet', 'fk_student', 'non_obe_percentage', 'item_name', 'gsd_component', 'gsd_percentage', 'gsd_exam_type.gsd_exam_type', 'mis_lecturer_course_detail.fk_gsDet')
            ->select('fk_lectCrsDet', 'fk_student', DB::raw('SUM(mis_lecturer_stdmark.mark) as mark'), DB::raw('SUM(mis_lecturer_stdmark.full_mark) as full_mark'), 'non_obe_percentage', 'item_name', 'gsd_component', 'gsd_percentage', 'gsd_exam_type.gsd_exam_type', 'mis_lecturer_course_detail.fk_gsDet')
            ->get();

        if (sizeof($obj) > 0) {
            return response()->json([
                'success' => true,
                'message' => 'List Success!',
                'data' => $obj
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Bad Request',
                'data' => $obj
            ], 400);
        }
    }


    // find student mark by sub item
    public function findMark($id, $std)
    {
        $obj = mis_lecturer_stdmark::where([
            ['mis_lecturer_stdmark.fk_lectCrsDet', '=', $id],
            ['mis_lecturer_stdmark.fk_student', '=', $std],
            ['mis_lecturer_stdmark.recordstatus', '!=', 'DEL']
        ])
            ->join('mis_lecturer_course_detail', 'mis_lecturer_course_detail.pk_id', 'fk_lectCrsDet')
            ->join('mis_prm_gredscheme_det', 'mis_prm_gredscheme_det.gsd_id', 'fk_gsDet')
            ->get([
                'mis_lecturer_stdmark.pk_id',
                'fk_lectCrsDet',
                'fk_student',
                'mark',
                'full_mark',
                'item_name',
                'gsd_component',
                'gsd_percentage'
            ]);

        if (sizeof($obj) > 0) {
            return response()->json([
                'success' => true,
                'message' => 'Register Success!',
                'data' => $obj
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'No Data Found!',
                'data' => $obj
            ], 400);
        }
    }

    public function findMark2($id, $std, $idClo)
    {
        $obj = mis_lecturer_stdmark::where([
            ['mis_lecturer_stdmark.fk_lectCrsDet', '=', $id],
            ['mis_lecturer_stdmark.fk_student', '=', $std],
            // ['mis_lecturer_stdmark.fk_idClo','=',$idClo],
            ['mis_lecturer_stdmark.recordstatus', '!=', 'DEL']
        ])
            ->join('mis_lecturer_course_detail', 'mis_lecturer_course_detail.pk_id', 'fk_lectCrsDet')
            ->join('mis_prm_gredscheme_det', 'mis_prm_gredscheme_det.gsd_id', 'fk_gsDet')
            ->get([
                'mis_lecturer_stdmark.pk_id',
                'fk_lectCrsDet',
                'fk_student',
                'mark',
                'full_mark',
                'item_name',
                'gsd_component',
                'gsd_percentage',
                'json_clo_crsDet'
            ]);



        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'Register Success!',
                'data' => $obj
            ], 201);
        } else {
            return response()->json([
                'success' => 'false',
                'message' => 'Bad Request',
                'data' => $obj
            ], 400);
        }
    }

    // public function findMark2($id, $std, $idClo){
    //     $obj = mis_lecturer_stdmark::where([
    //             ['mis_lecturer_stdmark.fk_lectCrsDet','=',$id],
    //             ['mis_lecturer_stdmark.fk_student','=',$std],
    //             ['mis_lecturer_stdmark.fk_idClo','=',$idClo],
    //             ['mis_lecturer_stdmark.recordstatus','!=','DEL']
    //         ])
    //         ->join('mis_lecturer_course_detail','mis_lecturer_course_detail.pk_id','fk_lectCrsDet')            
    //         ->join('mis_prm_gredscheme_det','mis_prm_gredscheme_det.gsd_id','fk_gsDet')            
    //         ->get([
    //             'mis_lecturer_stdmark.pk_id',
    //             'fk_lectCrsDet',
    //             'fk_student',
    //             'mark',
    //             'full_mark',
    //             'item_name',
    //             'gsd_component',
    //             'gsd_percentage'
    //         ]);

    //     if($obj){
    //         return response()->json([
    //             'success'=>'true',
    //             'message'=>'Register Success!',
    //             'data'=>$obj
    //         ],201);
    //     }
    //     else{
    //         return response()->json([
    //             'success'=>'false',
    //             'message'=>'Bad Request',
    //             'data'=>$obj
    //         ],400);
    //     }
    // }
}
