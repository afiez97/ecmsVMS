<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_std_cect_det;
use App\Models\mis_std_cect;

class mis_std_cect_detController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function create(Request $request)
    {
        $fk_cect = $request->input('fk_cect');
        $std_course = $request->input('std_course');
        $std_course_pre = $request->input('std_course_pre');
        $std_course_name_pre = $request->input('std_course_name_pre');
        $std_credit_hour_pre = $request->input('std_credit_hour_pre');
        $grade_pre = $request->input('grade_pre');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_std_cect_det::create([
            'fk_cect' => $fk_cect,
            'std_course' => $std_course,
            'std_course_pre' => $std_course_pre,
            'std_course_name_pre' => $std_course_name_pre,
            'std_credit_hour_pre' => $std_credit_hour_pre,
            'grade_pre' => $grade_pre,
            'recordstatus' => $recordstatus
        ]);

        if ($obj) {
            return response()->json([
                'success' => true,
                'messages' => 'Daftar Berjaya',
                'data' => $obj,
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'messages' => 'Daftar Gagal',
                'data' => '',
            ], 201);
        }
    }


    public function update(Request $request)
    {
        $id = $request->input('id');
        $std_course = $request->input('std_course');
        $grade_pre = $request->input('grade_pre');
        $std_course_pre = $request->input('std_course_pre');
        $std_course_name_pre = $request->input('std_course_name_pre');
        // $cect_type = $request->input('cect_type');
        $std_credit_hour_pre = $request->input('std_credit_hour_pre');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_std_cect_det::where('id', $id)->update([
            'std_course' => $std_course,
            'grade_pre' => $grade_pre,
            'std_course_pre' => $std_course_pre,
            'std_course_name_pre' => $std_course_name_pre,
            'std_credit_hour_pre' => $std_credit_hour_pre,
            // 'cect_type' => $cect_type,
            'recordstatus' => $recordstatus
        ]);

        if ($obj) {
            return response()->json([
                'success' => true,
                'messages' => 'Update Success',
                'data' => $obj,
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'messages' => 'Update Failed',
                'data' => '',
            ], 201);
        }
    }

    public function updateCECT(Request $request)
    {
        $fk_cect = $request->input('fk_cect');
        $std_course = $request->input('std_course');
        $cect_type = $request->input('cect_type');
        $obj = mis_std_cect_det::
            where('fk_cect', $fk_cect)
            ->where('std_course', $std_course)
            ->update([

            'cect_type' => $cect_type,
            'recordstatus' => 'EDT'
        ]);

        if ($obj) {
            return response()->json([
                'success' => true,
                'messages' => 'Update Success',
                'data' => $obj,
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'messages' => 'Update Failed',
                'data' => '',
            ], 201);
        }
    }

    public function delCECTBycourse(Request $request)
    {
        $fk_cect = $request->input('fk_cect');
        $std_course = $request->input('std_course');
        $obj = mis_std_cect_det::
            where('fk_cect', $fk_cect)
            ->where('std_course', $std_course)
            ->update(['recordstatus' => 'DEL']);

        if ($obj) {
            return response()->json([
                'success' => true,
                'messages' => 'Update Success',
                'data' => $obj,
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'messages' => 'Update Failed',
                'data' => '',
            ], 201);
        }
    }
    public function CheckCECTByCourse(Request $request)
    {
        $fk_cect = $request->input('fk_cect');
        $std_course = $request->input('std_course');
        // $cect_type = $request->input('cect_type');
        $obj = mis_std_cect_det::
            where('fk_cect', $fk_cect)
            ->where('std_course', $std_course)
            ->groupBy(['fk_cect', 'std_course', 'cect_type'])
            ->get(['fk_cect', 'std_course', 'cect_type']);

            // dd($obj);
        if ($obj) {
            return response()->json([
                'success' => true,
                'messages' => 'Update Success',
                'data' => $obj,
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'messages' => 'Update Failed',
                'data' => '',
            ], 201);
        }
    }


    public function show($id)
    {
        $obj = mis_std_cect_det::where('id', $id)->first();

        if ($obj) {

            return response()->json([
                'success' => true,
                'messages' => 'Data Berjaya',
                'data' => $obj,
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'messages' => 'Data Gagal',
                'data' => '',
            ], 201);
        }
    }

    public function list($id)
    {
        $obj = mis_std_cect_det::where([['fk_cect', $id], ['mis_std_cect_det.recordstatus', '!=', 'DEL']])
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_cect_det.std_course')
            ->get([
                'id',
                'std_course',
                'crs_code',
                'crs_name',
                'crs_credit',
                'std_course_pre',
                'std_course_name_pre',
                'std_credit_hour_pre',
                'grade_pre',
                'fk_cect',
                'mis_std_cect_det.cect_type as cect_typeDet',
            ]);




        if ($obj) {
            if (sizeof($obj) > 0) {
                return response()->json([
                    'success' => true,
                    'messages' => 'Data Berjaya',
                    'data' => $obj,
                ], 201);
            } else {
                return response()->json([
                    'success' => false,
                    'messages' => 'Tiada Data',
                    'data' => $obj,
                ], 201);
            }
        } else {
            return response()->json([
                'success' => false,
                'messages' => 'Data Gagal',
                'data' => '',
            ], 201);
        }
    }
    public function listCE($id)
    {
        $obj = mis_std_cect_det::where([['mis_std_cect.studentid', $id],['mis_std_cect_det.recordstatus', '!=', 'DEL'],['mis_std_cect_det.cect_type', 'CE']])
        // ->where('mis_std_cect_det.cect_type','=', 'CE')   
        ->leftjoin('mis_std_cect', 'mis_std_cect.id', '=', 'mis_std_cect_det.fk_cect')
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_cect_det.std_course')
            ->get(
                [
                'mis_std_cect_det.id',
                'mis_std_cect_det.std_course',
                'mis_std_cect_det.std_course_pre',
                'mis_std_cect_det.std_course_name_pre',
                'mis_std_cect_det.std_credit_hour_pre',
                'mis_std_cect_det.grade_pre',
                'mis_std_cect_det.fk_cect',
                'mis_std_cect_det.cect_type as cect_typeDet',

                'mis_prm_course.crs_code',
                'mis_prm_course.crs_name',
                'mis_prm_course.crs_credit',



            ]
        );



        if ($obj) {
            if (sizeof($obj) > 0) {
                return response()->json([
                    'success' => true,
                    'messages' => 'Data Berjaya',
                    'data' => $obj,
                ], 201);
            } else {
                return response()->json([
                    'success' => false,
                    'messages' => 'Tiada Data',
                    'data' => $obj,
                ], 201);
            }
        } else {
            return response()->json([
                'success' => false,
                'messages' => 'Data Gagal',
                'data' => '',
            ], 201);
        }
    }
    public function listByCourse($FK_cect)
    {

        $obj = mis_std_cect_det::where([['fk_cect', $FK_cect], ['mis_std_cect_det.recordstatus', '!=', 'DEL']])
            ->leftJoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_cect_det.std_course')
            ->groupBy('mis_std_cect_det.fk_cect', 'mis_prm_course.crs_code', 'mis_prm_course.crs_name', 'mis_prm_course.crs_credit', 'mis_std_cect_det.std_course')
            ->select(
                'mis_std_cect_det.fk_cect',
                'mis_prm_course.crs_code',
                'mis_prm_course.crs_name',
                'mis_prm_course.crs_credit',
                'mis_std_cect_det.std_course'
            )
            ->get();



            // $obj1 = mis_std_cect_det::where([['fk_cect', $FK_cect], ['mis_std_cect_det.recordstatus', '!=', 'DEL']])
            // ->where('mis_std_cect_det.std_course', $obj->std_course)
            // ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_cect_det.std_course')
            // ->get([
            //     'id',
            //     'std_course',
            //     'crs_code',
            //     'crs_name',
            //     'crs_credit',
            //     'std_course_pre',
            //     'std_course_name_pre',
            //     'std_credit_hour_pre',
            //     'grade_pre',
            //     'fk_cect',
            // ]);
     
// Structure the output
$output = [];

foreach ($obj as $item) {
    $obj_1 = mis_std_cect_det::where([
            ['fk_cect', $FK_cect],
            ['mis_std_cect_det.recordstatus', '!=', 'DEL'],
            ['mis_std_cect_det.std_course', $item->std_course]
        ])
        ->leftJoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_cect_det.std_course')
        ->get([
            'id as idCectDet',
            'std_course_pre',
            'std_course_name_pre',
            'std_credit_hour_pre',
            'grade_pre',
            'fk_cect',
            'mis_std_cect_det.cect_type'

        ]);

    $output[] = [
        'fk_cect' => $item->fk_cect,
        'crs_code' => $item->crs_code,
        'crs_name' => $item->crs_name,
        'crs_credit' => $item->crs_credit,
        'std_course' => $item->std_course,
        'detailPrevious' => $obj_1->toArray()
    ];
}


        if ($output) {
            return response()->json([
                'success' => true,
                'messages' => 'Data Berjaya',
                'data' => $output,
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'messages' => 'Data Gagal',
                'data' => '',
            ], 201);
        }
    }


    public function listByCourseDet($FK_cect, $std_course)
    {

        $obj = mis_std_cect_det::where([['fk_cect', $FK_cect], ['mis_std_cect_det.recordstatus', '!=', 'DEL']])
            ->where('mis_std_cect_det.std_course', $std_course)
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_cect_det.std_course')
            ->get([
                'id',
                'std_course',
                'crs_code',
                'crs_name',
                'crs_credit',
                'std_course_pre',
                'std_course_name_pre',
                'std_credit_hour_pre',
                'grade_pre',
                'fk_cect',
            ]);
    

        if ($obj) {
            return response()->json([
                'success' => true,
                'messages' => 'Data Berjaya',
                'data' => $obj,
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'messages' => 'Data Gagal',
                'data' => '',
            ], 201);
        }
    }
    public function listStudent($id)
    {
        // $obj = mis_std_cect_det::where([['fk_cect',$id],['mis_std_cect_det.recordstatus','!=','DEL']])
        //     ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id','=','mis_std_cect_det.std_course')
        //     ->get([
        //         'id',
        //         'std_course',
        //         'crs_code',
        //         'crs_name',
        //         'crs_credit',
        //         'std_course_pre',
        //         'std_course_name_pre',
        //         'std_credit_hour_pre',
        //         'grade_pre'
        //     ]);
        $obj = mis_std_cect::where([['mis_std_cect.id', $id], ['mis_exam_grading.grd_category', '=', '001'], ['mis_std_cect_det.recordstatus', '!=', 'DEL']])
            // ('mis_std_cect.id', $id)

            ->select(
                'mis_std_cect.studentid as std_studentid',
                'mis_std_cect.cect_acaSession as aca_session',
                'mis_std_cect_det.std_course as crs_code',
                'mis_std_cect_det.grade_pre as grade',
                'mis_prm_calendar.cur_year',
                'mis_exam_grading.quality_point as point',
                'mis_std_cect_det.cect_type as rsb_type',
            )
            ->leftJoin('mis_std_cect_det', 'mis_std_cect_det.fk_cect', '=', 'mis_std_cect.id')
            ->leftJoin('mis_prm_calendar', 'mis_std_cect.cect_acaSession', '=', 'mis_prm_calendar.cal_id')
            ->leftJoin('mis_exam_grading', 'mis_exam_grading.grd_id', '=', 'mis_std_cect_det.grade_pre')
            ->get();


        if ($obj) {
            if (sizeof($obj) > 0) {
                return response()->json([
                    'success' => true,
                    'messages' => 'Data Berjaya',
                    'data' => $obj,
                ], 201);
            } else {
                return response()->json([
                    'success' => false,
                    'messages' => 'Tiada Data',
                    'data' => $obj,
                ], 201);
            }
        } else {
            return response()->json([
                'success' => false,
                'messages' => 'Data Gagal',
                'data' => '',
            ], 201);
        }
    }


    public function delete(Request $request)
    {
        $id = $request->input('id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_std_cect_det::where([['id', '=', $id]])->update([
            'recordstatus' => $recordstatus,
        ]);

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "Hapus Berjaya!",
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Hapus Gagal!",
                'data' => ''
            ], 404);
        }
    }


    public function deleteGet($idcectDet)
    {
        

        $obj = mis_std_cect_det::where([['id', '=', $idcectDet]])->update([
            'recordstatus' => 'DEL',
        ]);

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "Hapus Berjaya!",
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Hapus Gagal!",
                'data' => ''
            ], 404);
        }
    }
}
