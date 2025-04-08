<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_prm_gredscheme;
use App\Models\mis_lecturer_course_detail;
use App\Models\mis_prm_obe_plo;
use App\Models\mis_std_regsubject;
use App\Models\mis_lecturer_stdmark;

class mis_prm_gredschemeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function register(Request $request)
    {
        $cam_id = $request->input('cam_id');
        $gsc_name = $request->input('gsc_name');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_gredscheme::create([
            'cam_id' => $cam_id,
            'fk_course' => $gsc_name,
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


    public function show($id)
    {
        $obj = mis_prm_gredscheme::where('gsc_id', $id)
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_prm_gredscheme.fk_course')
            ->leftjoin('mis_prm_faculty', 'mis_prm_faculty.pk_id', '=', 'mis_prm_course.fac_id')
            ->first([
                'gsc_id',
                'fk_course',
                'fac_name',
                'crs_name',
                'crs_code'
            ]);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'Show Success!',
                'data' => $obj
            ], 200);
        }
    }


    public function list()
    {
        $obj = mis_prm_gredscheme::where([['mis_prm_gredscheme.recordstatus', '!=', 'DEL']])
            ->join('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_prm_gredscheme.fk_course')
            ->join('mis_prm_faculty', 'mis_prm_faculty.pk_id', '=', 'mis_prm_course.fac_id')
            ->get([
                'gsc_id',
                'fk_course',
                'fac_name',
                'crs_name',
                'crs_code'
            ]);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    public function update(Request $request)
    {
        $gsc_id = $request->input('gsc_id');
        $gsc_name = $request->input('gsc_name');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_gredscheme::where('gsc_id', $gsc_id)->update([
            'fk_course' => $gsc_name,
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
                'success' => false,
                'message' => "Kemaskini Gagal!",
                'data' => ''
            ], 404);
        }
    }


    public function delete(Request $request)
    {
        $gsc_id = $request->input('gsc_id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_gredscheme::where('gsc_id', $gsc_id)->update([
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


    public function checkName(Request $request)
    {
        $input = $request->input('input');

        $obj = mis_prm_gredscheme::where([['fk_course', '=', $input], ['recordstatus', '!=', 'DEL']])->get(['gsc_id', 'fk_course']);

        if (sizeof($obj) > 0) {
            return response()->json([
                'success' => true,
                'message' => "Carian Berjaya!",
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Carian Gagal!",
                'data' => ''
            ], 400);
        }
    }

    public function checkName2(Request $request)
    {
        $crs = $request->input('crs');
        $fk_cotDet = $request->input('fk_cotDet');
        $aca_session = $request->input('aca_session');
        $crs_code = $request->input('crs_code');

        $obj = mis_prm_gredscheme::where([['fk_course', '=', $crs], ['recordstatus', '!=', 'DEL']])->get(['gsc_id', 'fk_course']);

        if (sizeof($obj) > 0) {
            for ($i = 0; $i < sizeof($obj); $i++) {
                // \DB::enableQueryLog();
                $objgradeCmpnntAll = mis_lecturer_course_detail::select([
                    'mis_lecturer_course_detail.pk_id',
                    'sub_mis_lecturer_course_detail.pk_id as pkCLO',
                    'mis_lecturer_course_detail.item_name',
                    'sub_mis_lecturer_course_detail.fk_clo',
                    'obe_clo.clo_level',
                    'sub_mis_lecturer_course_detail.marks',
                ])
                    ->leftJoin('sub_mis_lecturer_course_detail', 'sub_mis_lecturer_course_detail.fk_LecCourseDet', '=', 'mis_lecturer_course_detail.pk_id')
                    ->leftJoin('obe_clo', 'sub_mis_lecturer_course_detail.fk_clo', '=', 'obe_clo.id_clo')
                    ->where('mis_lecturer_course_detail.fk_cotDet', '=', $fk_cotDet)
                    ->where('sub_mis_lecturer_course_detail.recordstatus', '!=', 'DEL')
                    ->where('mis_lecturer_course_detail.recordstatus', '!=', 'DEL')
                    ->get();
                // dd(\DB::getQueryLog());
                $obj[$i]->objgradeCmpnntAll = $objgradeCmpnntAll;
                
                $objgradeCmpnntCLO = mis_lecturer_course_detail::select([
                    'sub_mis_lecturer_course_detail.fk_clo',
                    DB::raw('SUM(sub_mis_lecturer_course_detail.marks) as full_marks'),
                    'obe_clo.clo_level',
                ])
                    ->leftJoin('sub_mis_lecturer_course_detail', 'sub_mis_lecturer_course_detail.fk_LecCourseDet', '=', 'mis_lecturer_course_detail.pk_id')
                    ->leftJoin('obe_clo', 'obe_clo.id_clo', '=', 'sub_mis_lecturer_course_detail.fk_clo')
                    ->where('mis_lecturer_course_detail.fk_cotDet', $fk_cotDet)
                    ->where('mis_lecturer_course_detail.recordstatus', '!=', 'DEL')
                    ->where('sub_mis_lecturer_course_detail.recordstatus', '!=', 'DEL')
                    ->where('obe_clo.recordstatus', '!=', 'DEL')
                    ->groupBy([
                        'sub_mis_lecturer_course_detail.fk_clo',
                        'obe_clo.clo_level',
                    ])
                    ->orderBy('obe_clo.clo_level', 'ASC')
                    ->get();

                for ($j = 0; $j < sizeof($objgradeCmpnntCLO); $j++) {

                    $objmarkList = mis_lecturer_course_detail::WHERE([
                        ['mis_lecturer_course_detail.recordstatus', '!=', 'DEL'],
                        ['fk_cotDet', $fk_cotDet],
                        ['fk_gsDet', $objgradeCmpnntCLO[$j]->gsd_id]
                    ])
                        ->leftjoin('gsd_exam_type', 'gsd_exam_type.id', '=', 'mis_lecturer_course_detail.non_obe_type')
                        ->leftjoin('obe_clo', 'obe_clo.id_clo', '=', 'mis_lecturer_course_detail.clo_lecCourse')
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

                    for ($k = 0; $k < sizeof($objmarkList); $k++) {
                        if ($objmarkList[$k]->fk_cotDet == $fk_cotDet && $objmarkList[$k]->fk_gsDet == $objgradeCmpnntCLO[$j]->gsd_id) {
                            $obj2 = mis_lecturer_course_detail::leftJoin('gsd_exam_type', 'gsd_exam_type.id', '=', 'mis_lecturer_course_detail.non_obe_type')
                                ->leftJoin('sub_mis_lecturer_course_detail', 'sub_mis_lecturer_course_detail.fk_LecCourseDet', '=', 'mis_lecturer_course_detail.pk_id')
                                ->leftJoin('obe_clo', 'obe_clo.id_clo', '=', 'sub_mis_lecturer_course_detail.fk_clo')
                                ->select('obe_clo.clo_level')
                                ->where('mis_lecturer_course_detail.recordstatus', '!=', 'DEL')
                                ->where('sub_mis_lecturer_course_detail.recordstatus', '!=', 'DEL')
                                ->where('mis_lecturer_course_detail.fk_cotDet', $fk_cotDet)
                                ->where('mis_lecturer_course_detail.fk_gsDet', $objgradeCmpnntCLO[$j]->gsd_id)
                                ->orderBy('obe_clo.clo_level', 'asc')
                                ->get();
                            $objmarkList[$k]->clo_list = $obj2;
                        }
                    }
                    $objgradeCmpnntCLO[$j]->objmarkList = $objmarkList;
                }

                $obj[$i]->objgradeCmpnntCLO = $objgradeCmpnntCLO;

                $objgradeCmpnntPLO = mis_lecturer_course_detail::select([
                    'sub_mis_lecturer_course_detail.fk_clo',
                    DB::raw('SUM(sub_mis_lecturer_course_detail.marks) as full_marks'),
                    'obe_clo.clo_level',
                    'obe_clo.FK_course',
                    'mis_prm_obe_plo_generate.FK_clo',
                ])
                    ->leftJoin('sub_mis_lecturer_course_detail', 'sub_mis_lecturer_course_detail.fk_LecCourseDet', '=', 'mis_lecturer_course_detail.pk_id')
                    ->leftJoin('obe_clo', 'obe_clo.id_clo', '=', 'sub_mis_lecturer_course_detail.fk_clo')
                    ->leftJoin('mis_prm_obe_plo_generate', 'mis_prm_obe_plo_generate.FK_course', '=', 'obe_clo.FK_course')
                    ->where('mis_lecturer_course_detail.fk_cotDet', $fk_cotDet)
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

                foreach ($objgradeCmpnntPLO as $item) {
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

                foreach ($objgradeCmpnntPLO as $item) {
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

                $obj[$i]->objgradeCmpnntPLO = $result;

                $objsubItemList = mis_lecturer_course_detail::WHERE([
                    ['mis_lecturer_course_detail.recordstatus', '!=', 'DEL'],
                    ['mis_prm_gredscheme_det.recordstatus', '!=', 'DEL'],
                    ['fk_cotDet', $fk_cotDet]
                ])
                    ->leftJoin('mis_prm_gredscheme_det', 'mis_prm_gredscheme_det.gsd_id', 'fk_gsDet')
                    ->leftJoin('gsd_exam_type', 'gsd_exam_type.id', 'mis_prm_gredscheme_det.gsd_exam_type')
                    ->orderBy('gsd_component', 'ASC')
                    ->orderBy('mis_prm_gredscheme_det.gsd_id', 'ASC')
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
                        'gsd_exam_type.gsd_exam_type'
                    ]);

                $obj[$i]->objsubItemList = $objsubItemList;

                $objstdByAcaCalCrs = mis_std_regsubject::where([
                    ['mis_std_regsubject.crs_code', '=', $crs_code],
                    ['aca_session', '=', $aca_session],
                    ['rsb_status', '=', 'Register'],
                    ['mis_std_regsubject.recordstatus', '!=', 'DEL']
                ])
                    ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
                    ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_regsubject.aca_session')
                    ->leftjoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'mis_std_regsubject.std_studentid')
                    ->leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_std_info.pgm_fk')
                    ->orderBy('std_id')
                    ->get([
                        'rsb_id',
                        'barr_status',
                        'mis_prm_calendar.cur_year AS acaYear',
                        'cal_cohort',
                        'crs_name',
                        'mis_prm_course.crs_code AS crsCode',
                        'crs_credit',
                        'fk_cotDet',
                        'mis_std_regsubject.std_studentid AS std_id',
                        'sti_name',
                        'mis_prm_programme.pgm_id AS pgmCode',
                        'rsb_status',
                        'cMark',
                        'tMark',
                        'grade',
                        'point',
                        'mark_generate'
                    ]);


                for ($j = 0; $j < sizeof($objstdByAcaCalCrs); $j++) {

                    // $objstudentPloClo = mis_lecturer_stdmark::join('mis_std_info', 'mis_lecturer_stdmark.fk_student', '=', 'mis_std_info.std_studentid')
                    //     ->join('mis_lecturer_course_detail', 'mis_lecturer_course_detail.pk_id', '=', 'mis_lecturer_stdmark.fk_lectCrsDet')
                    //     // ->join('sub_mis_lecturer_course_detail', 'sub_mis_lecturer_course_detail.pk_id', '=', 'mis_lecturer_stdmark.fk_idClo')
                    //     // ->join('obe_clo', 'obe_clo.id_clo', '=', 'sub_mis_lecturer_course_detail.fk_clo')
                    //     // ->join('mis_prm_obe_plo_generate', 'mis_prm_obe_plo_generate.FK_course', '=', 'mis_lecturer_stdmark.fk_course')
                    //     ->select(
                    //         'mis_lecturer_stdmark.fk_student',
                    //         'mis_std_info.sti_name',
                    //         'mis_lecturer_course_detail.pk_id',
                    //         // 'sub_mis_lecturer_course_detail.pk_id as pkCLO',
                    //         'mis_lecturer_course_detail.item_name',
                    //         // 'sub_mis_lecturer_course_detail.fk_clo',
                    //         // 'obe_clo.clo_level',
                    //         // 'mis_lecturer_stdmark.mark',
                    //         // 'mis_lecturer_stdmark.full_mark',
                    //         // 'sub_mis_lecturer_course_detail.marks as full_mark',
                    //         'mis_lecturer_stdmark.json_clo_crsDet',
                    //         // 'mis_prm_obe_plo_generate.FK_clo'
                    //     )
                    //     ->where('mis_lecturer_stdmark.fk_student', '=',$objstdByAcaCalCrs[$j]->std_id )
                    //     ->where('mis_lecturer_course_detail.fk_cotDet', '=', $fk_cotDet)
                    //     // ->sort by 
                    //     ->get();
                    $objstudentPloClo =  mis_lecturer_stdmark::join('mis_std_info', 'mis_lecturer_stdmark.fk_student', '=', 'mis_std_info.std_studentid')
                        ->join('mis_lecturer_course_detail', 'mis_lecturer_course_detail.pk_id', '=', 'mis_lecturer_stdmark.fk_lectCrsDet')
                        ->leftJoin(DB::raw("JSON_TABLE(mis_lecturer_stdmark.json_clo_crsDet, '$[*]' COLUMNS (fk_CLO VARCHAR(10) PATH '$.fk_CLO', mark DECIMAL(10, 2) PATH '$.mark')) AS json_tbl"), function ($join) {
                            $join->on(DB::raw(1), '=', DB::raw(1));
                        })
                        ->join('sub_mis_lecturer_course_detail', 'sub_mis_lecturer_course_detail.pk_id', '=', 'json_tbl.fk_CLO')
                        ->join('obe_clo', 'obe_clo.id_clo', '=', 'sub_mis_lecturer_course_detail.fk_clo')
                        ->join("mis_prm_programme_det",function($join){
                            $join->on("mis_prm_programme_det.dtp_intake","=","mis_std_info.cur_intake")
                                ->on("mis_prm_programme_det.pgm_id","=","mis_std_info.pgm_fk");
                        })     
                        // ->join('mis_prm_obe_plo_generate', 'mis_prm_obe_plo_generate.FK_course', '=', 'mis_lecturer_stdmark.fk_course')
                        ->join("mis_prm_obe_plo_generate",function($join){
                            $join->on("mis_prm_obe_plo_generate.FK_course","=","mis_lecturer_stdmark.fk_course")
                                ->on("mis_prm_obe_plo_generate.pgmDet_id","=","mis_prm_programme_det.dtp_id");
                        })                     
                        ->select(
                            'mis_lecturer_stdmark.fk_student',
                            'mis_std_info.sti_name',
                            'mis_lecturer_course_detail.pk_id',
                            'mis_lecturer_course_detail.item_name',
                            'json_tbl.fk_CLO',
                            'json_tbl.mark',
                            'mis_lecturer_course_detail.pk_id as pk_id_detail',
                            'mis_lecturer_course_detail.item_name',
                            'sub_mis_lecturer_course_detail.pk_id as pkCLO',
                            'sub_mis_lecturer_course_detail.fk_clo',
                            'sub_mis_lecturer_course_detail.marks as full_mark',
                            'obe_clo.clo_level',
                            'mis_prm_obe_plo_generate.FK_clo'
                        )
                        ->where('mis_lecturer_stdmark.fk_student', '=', $objstdByAcaCalCrs[$j]->std_id)
                        ->where('mis_lecturer_course_detail.fk_cotDet', '=', $fk_cotDet)
                        ->where('mis_lecturer_course_detail.recordstatus', '!=', 'DEL')
                        ->where('obe_clo.recordstatus', '!=', 'DEL')
                        
                        ->get();

                        // dd($objstudentPloClo);

                    // foreach ($objstudentPloClo as $item) {
                    //     if ($item->json_clo_crsDet === null) {
                    //         $item->mark = ''; // Set mark to empty string if json_clo_crsDet is null
                    //         $item->pkCLO = ''; // Set mark to empty string if json_clo_crsDet is null
                    //     } else {
                    //         $json_clo_crsDet = json_decode($item->json_clo_crsDet, true);
                    //         $item->mark = ''; // Default mark value
                    //         $item->pkCLO = ''; // Default mark value

                    //         foreach ($json_clo_crsDet as $json_item) {
                    //             if ($json_item['fk_CLO'] == $item->pkCLO) {
                    //                 $item->mark = $json_item['mark'];
                    //                 $item->mark = $json_item['mark'];
                    //                 break;
                    //             }
                    //         }
                    //     }

                    //     // unset($item->json_clo_crsDet); // Remove the original JSON field
                    // }


                    // // Check for specific condition and debug
                    // if ($objstdByAcaCalCrs[$j]->std_id === 'DML09210010') {
                    //     $response = [
                    //         'success' => true,
                    //         'message' => 'Show Success!',
                    //         'data' => $objstudentPloClo 
                    //     ];
                    //     return response()->json($response, 200);
                    // }

                    // $result now contains the query result

                    for ($k = 0; $k < sizeof($objstudentPloClo); $k++) {

                        $FK_clo = json_decode($objstudentPloClo[$k]->FK_clo);
                        for ($l = 0; $l < sizeof($FK_clo); $l++) {
                            $arr_FK_clo = explode('_', $FK_clo[$l]);
                            if ($arr_FK_clo[0] == $objstudentPloClo[$k]->fk_clo) {
                                $objstudentPloClo[$k]->obe_plo_id = $arr_FK_clo[1];
                                $obj_obeplo = mis_prm_obe_plo::where('obe_plo_id', $objstudentPloClo[$k]->obe_plo_id)
                                    ->where('recordstatus', '!=', 'DEL')
                                    // ->orderBy('obe_plo_name', ASC)
                                    // ->orderBy('mis_prm_obe_plo.obe_plo_name', 'ASC')

                                    ->first();
                                $objstudentPloClo[$k]->obe_plo_name = $obj_obeplo->obe_plo_name;
                                $objstudentPloClo[$k]->pgm_id = $obj_obeplo->pgm_id;
                                $objstudentPloClo[$k]->obe_plo_statement = $obj_obeplo->obe_plo_statement;
                            }
                        }
                    }

                    $objClo = [];

                    foreach ($objstudentPloClo as $item) {
                        $objClo[] = [
                            'fk_student' => $item->fk_student,
                            'mark' => $item->mark,
                            'full_mark' => $item->full_mark,
                            'fk_clo' => $item->fk_clo,
                            'clo_level' => $item->clo_level,
                        ];
                    }

                    $StudentClo = [];

                    $bil = 0;
                    foreach ($objClo as $item) {
                        $fk_student = $item['fk_student'];
                        $fk_clo = $item['fk_clo'];
                        $clo_level = $item['clo_level'];
                        // if(sizeof($StudentClo[$fk_student])>0){
                        //     for($k=0;$k<sizeof($StudentClo[$fk_student]);$k++){
                        //         if($fk_clo == $StudentClo[$fk_student]->fk_clo){
                        //             $StudentClo[$fk_student][$bil]['mark'] += $item['mark'];
                        //             $StudentClo[$fk_student][$bil]['full_mark'] += $item['full_mark'];
                        //         }
                        //         if($k+1 == sizeof($StudentClo[$fk_student])){
                        //             $StudentClo[$fk_student][$bil] = [
                        //                 'fk_student' => $fk_student,
                        //                 'fk_clo' => $fk_clo,
                        //                 'clo_level' => $clo_level,
                        //                 'mark' => $item['mark'],
                        //                 'full_mark' => $item['full_mark'],
                        //             ];
                        //         }
                        //     }
                        // }
                        // If the group already exists, add to the existing values.
                        if (isset($StudentClo[$fk_student][$fk_clo])) {
                            $StudentClo[$fk_student][$fk_clo]['mark'] += $item['mark'];
                            $StudentClo[$fk_student][$fk_clo]['full_mark'] += $item['full_mark'];
                        } else {
                            // If the group does not exist, create it.
                            $StudentClo[$fk_student][$fk_clo] = [
                                'fk_student' => $fk_student,
                                'fk_clo' => $fk_clo,
                                'clo_level' => $clo_level,
                                'mark' => $item['mark'],
                                'full_mark' => $item['full_mark'],
                            ];
                        }
                        $bil++;
                    }




                    $obj2 = [];

                    foreach ($objstudentPloClo as $item) {
                        $obj2[] = [
                            'fk_student' => $item->fk_student,
                            'mark' => $item->mark,
                            'full_mark' => $item->full_mark,
                            'obe_plo_id' => $item->obe_plo_id,
                            'obe_plo_name' => $item->obe_plo_name,
                        ];
                    }

                    $obj2_grouped = [];

                    foreach ($obj2 as $item) {
                        $fk_student = $item['fk_student'];
                        $obe_plo_id = $item['obe_plo_id'];
                        $obe_plo_name = $item['obe_plo_name'];

                        // If the group already exists, add to the existing values.
                        if (isset($obj2_grouped[$fk_student][$obe_plo_id][$obe_plo_name])) {
                            $obj2_grouped[$fk_student][$obe_plo_id][$obe_plo_name]['mark'] += $item['mark'];
                            $obj2_grouped[$fk_student][$obe_plo_id][$obe_plo_name]['full_mark'] += $item['full_mark'];
                        } else {
                            // If the group does not exist, create it.
                            $obj2_grouped[$fk_student][$obe_plo_id][$obe_plo_name] = [
                                'fk_student' => $fk_student,
                                'obe_plo_id' => $obe_plo_id,
                                'obe_plo_name' => $obe_plo_name,
                                'mark' => $item['mark'],
                                'full_mark' => $item['full_mark'],
                            ];
                        }
                    }

                    $obj2_grouped_flat = [];
                    foreach ($obj2_grouped as $studentGroups) {
                        foreach ($studentGroups as $obePloGroups) {
                            foreach ($obePloGroups as $group) {
                                $obj2_grouped_flat[] = $group;
                            }
                        }
                    }

                    $StudentPlo = array_filter($obj2_grouped_flat, function ($item) {
                        return $item['obe_plo_id'] !== null;
                    });


                    $objstdByAcaCalCrs[$j]->StudentClo = $StudentClo;
                    $objstdByAcaCalCrs[$j]->StudentPlo = $StudentPlo;
                    $objstdByAcaCalCrs[$j]->objstudentPloClo = $objstudentPloClo;
                }

                $obj[$i]->objstdByAcaCalCrs = $objstdByAcaCalCrs;
            }
        }

        if (sizeof($obj) > 0) {
            return response()->json([
                'success' => true,
                'message' => "Carian Berjaya!",
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Carian Gagal!",
                'data' => ''
            ], 400);
        }
    }





    // list by Campus & Course
    public function listByCamCrs(Request $request)
    {
        $cam_id = $request->input('cam_id');
        $gsc_name = $request->input('gsc_name');

        $obj = mis_prm_gredscheme::where([['cam_id', '=', $cam_id], ['fk_course', '=', $gsc_name], ['recordstatus', '!=', 'DEL']])
            ->first(['gsc_id']);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'Show Success!',
                'data' => $obj
            ], 200);
        }
    }
}
