<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_prm_obe_plo_generate;
use App\Models\mis_prm_obe_plo;
use App\Models\mis_lecturer_stdmark;
use DB;

class mis_prm_obe_plo_generateController extends Controller


{

     public function __construct()
    {
        $this->middleware('auth');
    }

    public function create(Request $request) {
        // Retrieving data from the request

        // dd('cek');
        // $FK_plo = $request->input('FK_plo');
        $FK_clo = $request->input('FK_clo');
        $FK_course = $request->input('FK_course');
        $pgmDet_id = $request->input('pgmDet_id');
        $recordstatus = 'ADD';

        $data = [
            // 'FK_plo' => $FK_plo,
            'FK_clo' => $FK_clo,
            'FK_course' => $FK_course,
            'pgmDet_id' => $pgmDet_id,
            'recordstatus' => $recordstatus,
        ];

        $register = mis_prm_obe_plo_generate::create($data);
    
        if ($register) {
            return response()->json([
                'success' => true,
                'message' => 'Register Success!',
                'data' => $register
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Bad Request',
                'data' => $register
            ], 400);
        }
    }

    public function update(Request $request) {
        // Retrieving data from the request

        // dd('cek');
        // $FK_plo = $request->input('FK_plo');
        $id_obe_plo_generate = $request->input('id_obe_plo_generate');
        $FK_clo = $request->input('FK_clo');
        $FK_course = $request->input('FK_course');
        $pgmDet_id = $request->input('pgmDet_id');
        $recordstatus = 'ADD';

        $data = [
            // 'FK_plo' => $FK_plo,
            'FK_clo' => $FK_clo,
            'FK_course' => $FK_course,
            'pgmDet_id' => $pgmDet_id,
            'recordstatus' => $recordstatus,
        ];

        $register = mis_prm_obe_plo_generate::where('id_obe_plo_generate',$id_obe_plo_generate)->update($data);
    
        if ($register) {
            return response()->json([
                'success' => true,
                'message' => 'Register Success!',
                'data' => $register
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Bad Request',
                'data' => $register
            ], 400);
        }
    }

    public function find(Request $request) {
        $FK_course = $request->input('FK_course');
        $pgmDet_id = $request->input('pgmDet_id');

        $obj = mis_prm_obe_plo_generate::where("FK_course",$FK_course)->where("pgmDet_id",$pgmDet_id)->first();
    
        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => 'Register Success!',
                'data' => $obj
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Bad Request',
                'data' => $register
            ], 400);
        }
    }


    public function findByCode(Request $request) {
        $FK_course = $request->input('FK_course');
        $pgm_code = $request->input('pgm_code');

        $obj = mis_prm_obe_plo_generate::
        leftjoin('mis_prm_programme_det','mis_prm_programme_det.dtp_id','mis_prm_obe_plo_generate.pgmDet_id')
        ->leftjoin('mis_prm_programme','mis_prm_programme.pk_id','mis_prm_programme_det.pgm_id')
        ->where("FK_course",$FK_course)
        ->where("mis_prm_programme.pgm_id",$pgm_code)
        ->where("mis_prm_obe_plo_generate.recordstatus",'!=', 'DEL')
        ->first(
            ['id_obe_plo_generate', 
            'mis_prm_obe_plo_generate.FK_clo', 
            'mis_prm_obe_plo_generate.FK_course',
            'mis_prm_obe_plo_generate.pgmDet_id', 
            'mis_prm_programme.pgm_id',
            'fk_aca_calendar', 
            'pgm_name']
        );
    
        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => 'Register Success!',
                'data' => $obj
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Bad Request',
                'data' => ''
            ], 400);
        }
    }

    public function courseClo(Request $request) {

        $fk_student = $request->input('fk_student');
        $fk_cotDet = $request->input('fk_cotDet');

        // $obj display data group by clo

        $obj = mis_lecturer_stdmark::join('mis_lecturer_course_detail', 'mis_lecturer_course_detail.pk_id', '=', 'mis_lecturer_stdmark.fk_lectCrsDet')
            ->join('sub_mis_lecturer_course_detail', 'sub_mis_lecturer_course_detail.pk_id', '=', 'mis_lecturer_stdmark.fk_idClo')
            ->join('obe_clo', 'obe_clo.id_clo', '=', 'sub_mis_lecturer_course_detail.fk_clo')
            ->join('mis_prm_obe_plo_generate', 'mis_prm_obe_plo_generate.FK_course', '=', 'mis_lecturer_stdmark.fk_course')
            ->where('mis_lecturer_stdmark.fk_student', $fk_student)
            ->where('mis_lecturer_course_detail.fk_cotDet', $fk_cotDet)
            ->where('sub_mis_lecturer_course_detail.recordstatus', '!=', 'DEL')
            ->groupBy(
                'mis_lecturer_stdmark.fk_student',
                'sub_mis_lecturer_course_detail.fk_clo',
                'obe_clo.clo_level',
                'mis_prm_obe_plo_generate.FK_clo'
            )
            ->select(
                'mis_lecturer_stdmark.fk_student',
                DB::raw('SUM(mis_lecturer_stdmark.mark) as mark'),
                DB::raw('SUM(mis_lecturer_stdmark.full_mark) as full_mark'),
                'sub_mis_lecturer_course_detail.fk_clo',
                'obe_clo.clo_level',
                'mis_prm_obe_plo_generate.FK_clo'
            )
            ->get();


        // dd($obj);

        for($i=0;$i<sizeof($obj);$i++){
            $FK_clo = json_decode($obj[$i]->FK_clo);
            for($j=0;$j<sizeof($FK_clo);$j++){
                $arr_FK_clo = explode('_',$FK_clo[$j]);
                if($arr_FK_clo[0] == $obj[$i]->fk_clo){
                    $obj[$i]->obe_plo_id = $arr_FK_clo[1];
                    $obj_obeplo = mis_prm_obe_plo::where('obe_plo_id',$obj[$i]->obe_plo_id)->where('recordstatus','!=','DEL')->first();
                    $obj[$i]->obe_plo_name = $obj_obeplo->obe_plo_name;
                    $obj[$i]->pgm_id = $obj_obeplo->pgm_id;
                    $obj[$i]->obe_plo_statement = $obj_obeplo->obe_plo_statement;
                }
            }
        }

        // $obj2 display selected data from $obj

        $total_obj = count($obj);


        $obj2 = [];

        foreach ($obj as $item) {
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


        // Convert the grouped data obj2 into a flat array.

        
        $obj2_grouped_flat = [];
        foreach ($obj2_grouped as $studentGroups) {
            foreach ($studentGroups as $obePloGroups) {
                foreach ($obePloGroups as $group) {
                    $obj2_grouped_flat[] = $group;
                }
            }
        }

        $total_obj2_grouped_flat = count($obj2_grouped_flat);


        $combinedData = [];

        foreach ($obj as $item1) {
            foreach ($obj2_grouped_flat as $item2) {
                if ($item1->obe_plo_id === $item2['obe_plo_id']) {
                    // Merge data from $obj1 and $obj2_grouped_flat for the same fk_student.
                    $combinedData[] = [
                        'fk_student' => $item1->fk_student,
                        'clo_level' => $item1->clo_level,
                        'markCLO' => $item1->mark,
                        'full_markCLO' => $item1->full_mark,
                        'obe_plo_id' => $item2['obe_plo_id'],
                        'obe_plo_name' => $item2['obe_plo_name'],
                        'mark_PLO' => $item2['mark'], // Include mark from $item2
                        'full_markPLO' => $item2['full_mark'], // Include mark from $item2
                        // You can add more fields from $obj2_grouped_flat if needed.
                    ];
                }
            }
        }
        
        // $combinedData now contains the combined data for matching fk_student values from $obj1 and $obj2_grouped_flat.

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => 'Register Success!',
                'data' => $obj,
                // 'data2' => $obj2,
                // 'Total_CLO' => $total_obj,
                'data2' => $obj2_grouped_flat, //PLO
                // 'Total_PLO' => $total_obj2_grouped_flat,
                'data3' => $combinedData

            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Bad Request',
                'data' => $obj
            ], 400);
        }

    }

    public function ploclo(Request $request) {

        $fk_student = $request->input('fk_student');
        $fk_cotDet = $request->input('fk_cotDet');

        // $obj display data group by clo

        $obj = mis_lecturer_stdmark::join('mis_lecturer_course_detail', 'mis_lecturer_course_detail.pk_id', '=', 'mis_lecturer_stdmark.fk_lectCrsDet')
            ->join('sub_mis_lecturer_course_detail', 'sub_mis_lecturer_course_detail.pk_id', '=', 'mis_lecturer_stdmark.fk_idClo')
            ->join('obe_clo', 'obe_clo.id_clo', '=', 'sub_mis_lecturer_course_detail.fk_clo')
            ->join('mis_prm_obe_plo_generate', 'mis_prm_obe_plo_generate.FK_course', '=', 'mis_lecturer_stdmark.fk_course')
            ->where('mis_lecturer_stdmark.fk_student', $fk_student)
            ->where('mis_lecturer_course_detail.fk_cotDet', $fk_cotDet)
            ->where('sub_mis_lecturer_course_detail.recordstatus', '!=', 'DEL')
            ->groupBy(
                'mis_lecturer_stdmark.fk_student',
                'sub_mis_lecturer_course_detail.fk_clo',
                'obe_clo.clo_level',
                'mis_prm_obe_plo_generate.FK_clo'
            )
            ->select(
                'mis_lecturer_stdmark.fk_student',
                DB::raw('SUM(mis_lecturer_stdmark.mark) as mark'),
                DB::raw('SUM(mis_lecturer_stdmark.full_mark) as full_mark'),
                'sub_mis_lecturer_course_detail.fk_clo',
                'obe_clo.clo_level',
                'mis_prm_obe_plo_generate.FK_clo'
            )
            ->get();


        // dd($obj);

        for($i=0;$i<sizeof($obj);$i++){
            $FK_clo = json_decode($obj[$i]->FK_clo);
            for($j=0;$j<sizeof($FK_clo);$j++){
                $arr_FK_clo = explode('_',$FK_clo[$j]);
                if($arr_FK_clo[0] == $obj[$i]->fk_clo){
                    $obj[$i]->obe_plo_id = $arr_FK_clo[1];
                    $obj_obeplo = mis_prm_obe_plo::where('obe_plo_id',$obj[$i]->obe_plo_id)->where('recordstatus','!=','DEL')->first();
                    $obj[$i]->obe_plo_name = $obj_obeplo->obe_plo_name;
                    $obj[$i]->pgm_id = $obj_obeplo->pgm_id;
                    $obj[$i]->obe_plo_statement = $obj_obeplo->obe_plo_statement;
                }
            }
        }

        $obj2 = [];

        foreach ($obj as $item) {
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

        $filteredData = array_filter($obj2_grouped_flat, function ($item) {
            return $item['obe_plo_id'] !== null;
        });

        

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => 'Register Success!',
                'data' => $filteredData,

            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Bad Request',
                'data' => $obj
            ], 400);
        }

    }


    public function studentPloClo(Request $request) {

        $fk_student = $request->input('fk_student');
        $fk_cotDet = $request->input('fk_cotDet');

        // $obj display data group by clo

        $obj = DB::table('mis_lecturer_stdmark')
            ->join('mis_std_info', 'mis_lecturer_stdmark.fk_student', '=', 'mis_std_info.std_studentid')
            ->join('mis_lecturer_course_detail', 'mis_lecturer_course_detail.pk_id', '=', 'mis_lecturer_stdmark.fk_lectCrsDet')
            ->join('sub_mis_lecturer_course_detail', 'sub_mis_lecturer_course_detail.pk_id', '=', 'mis_lecturer_stdmark.fk_idClo')
            ->join('obe_clo', 'obe_clo.id_clo', '=', 'sub_mis_lecturer_course_detail.fk_clo')
            ->join('mis_prm_obe_plo_generate', 'mis_prm_obe_plo_generate.FK_course', '=', 'mis_lecturer_stdmark.fk_course')
            ->select(
                'mis_lecturer_stdmark.fk_student',
                'mis_std_info.sti_name',
                'mis_lecturer_course_detail.pk_id',
                'mis_lecturer_course_detail.item_name',
                'sub_mis_lecturer_course_detail.fk_clo',
                'obe_clo.clo_level',
                'mis_lecturer_stdmark.mark',
                'mis_lecturer_stdmark.full_mark',
                'mis_prm_obe_plo_generate.FK_clo'
            )
            ->where('mis_lecturer_stdmark.fk_student', '=', $fk_student)
            ->where('mis_lecturer_course_detail.fk_cotDet', '=', $fk_cotDet)
            ->get();

        // $result now contains the query result

        for($i=0;$i<sizeof($obj);$i++){
            $FK_clo = json_decode($obj[$i]->FK_clo);
            for($j=0;$j<sizeof($FK_clo);$j++){
                $arr_FK_clo = explode('_',$FK_clo[$j]);
                if($arr_FK_clo[0] == $obj[$i]->fk_clo){
                    $obj[$i]->obe_plo_id = $arr_FK_clo[1];
                    $obj_obeplo = mis_prm_obe_plo::where('obe_plo_id',$obj[$i]->obe_plo_id)->where('recordstatus','!=','DEL')->first();
                    $obj[$i]->obe_plo_name = $obj_obeplo->obe_plo_name;
                    $obj[$i]->pgm_id = $obj_obeplo->pgm_id;
                    $obj[$i]->obe_plo_statement = $obj_obeplo->obe_plo_statement;
                }
            }
        }

        $objClo = [];

        foreach ($obj as $item) {
            $objClo[] = [
                'fk_student' => $item->fk_student,
                'mark' => $item->mark,
                'full_mark' => $item->full_mark,
                'fk_clo' => $item->fk_clo,
                'clo_level' => $item->clo_level,
            ];
        }

        $StudentClo = [];

        foreach ($objClo as $item) {
            $fk_student = $item['fk_student'];
            $fk_clo = $item['fk_clo'];
            $clo_level = $item['clo_level'];

            // If the group already exists, add to the existing values.
            if (isset($StudentClo[$fk_student][$fk_clo][$clo_level])) {
                $StudentClo[$fk_student][$fk_clo][$clo_level]['mark'] += $item['mark'];
                $StudentClo[$fk_student][$fk_clo][$clo_level]['full_mark'] += $item['full_mark'];
            } else {
                // If the group does not exist, create it.
                $StudentClo[$fk_student][$fk_clo][$clo_level] = [
                    'fk_student' => $fk_student,
                    'fk_clo' => $fk_clo,
                    'clo_level' => $clo_level,
                    'mark' => $item['mark'],
                    'full_mark' => $item['full_mark'],
                ];
            }
        }




        $obj2 = [];

        foreach ($obj as $item) {
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

        

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => 'Register Success!',
                'StudentMark' => $obj,
                // 'objClo' => $objClo,
                'StudentClo' => $StudentClo,
                'StudentPlo' => $StudentPlo,

                // 'data' => $obj2,
                // 'data' => $obj2,

            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Bad Request',
                'data' => $obj
            ], 400);
        }

    }



























    public function registerPlo(Request $request) {
        // Retrieving data from the request
        $obe_plo_name = $request->input('obe_plo_name');
        $pgm_id = $request->input('pgm_id');
        $obe_plo_statement = $request->input('obe_plo_statement');
        $recordstatus = 'ADD';
    
        // Dump and die to check the value of $recordstatus
    
        // Creating a new record in the database using the 'mis_prm_obe_plo' model

        $data = [
            'obe_plo_name' => $obe_plo_name,
            'pgm_id' => $pgm_id,
            'obe_plo_statement' => $obe_plo_statement,
            'recordstatus' => $recordstatus,
        ];

        // dd($data);

        $register = mis_prm_obe_plo::create($data);
    
        // Checking if the record was successfully created
        if ($register) {
            return response()->json([
                'success' => true,
                'message' => 'Register Success!',
                'data' => $register
            ], 201);
        } else {
            return response()->json([
                'success' => 'false',
                'message' => 'Bad Request',
                'data' => $register
            ], 400);
        }
    }
    

    public function show($pgm_id)  {
        // $pgm_id = $request->input('pgm_id');

        // $mis_prm_obe = mis_prm_obe::where('pgm_id',$pgm_id)->get();

        $mis_prm_obe_plo = mis_prm_obe_plo::where('pgm_id', $pgm_id)
                          ->where('recordstatus', '!=', 'DEL')
                          ->get();


        if ($mis_prm_obe_plo)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$mis_prm_obe_plo
            ],200);
        }
    }

    public function showByPgmDet(Request $request)  {
        $pgmDet_id = $request->input('pgmDet_id');

        // dd($pgmDet_id);
        // $mis_prm_obe = mis_prm_obe::where('pgm_id',$pgm_id)->get();
        // \DB::enableQueryLog();
        $mis_prm_obe_plo = mis_prm_obe_plo::leftjoin('mis_prm_programme_det','mis_prm_programme_det.pgm_id','=','mis_prm_obe_plo.pgm_id')
                        ->where('mis_prm_programme_det.dtp_id', $pgmDet_id)
                          ->where('mis_prm_obe_plo.recordstatus', '!=', 'DEL')
                          ->get();
                        //   dd(\DB::getQueryLog());

        if ($mis_prm_obe_plo)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$mis_prm_obe_plo
            ],200);
        }
    }

    public function list()  {
        $mis_prm_obe_plo = mis_prm_obe_plo::all();

        if ($mis_prm_obe_plo)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$mis_prm_obe_plo
            ],200);
        }
        
    }

    public function updatePlo(Request $request)    {

        
        $obe_plo_id = $request->input('obe_plo_id');
        $obe_plo_name = $request->input('obe_plo_name');
        // $pgm_id = $request->input('pgm_id');
        $obe_plo_statement = $request->input('obe_plo_statement');
        // $obe_plo_percentage = $request->input('obe_plo_percentage');
        // $obe_plo_status = $request->input('obe_plo_status');
        // $lastupdateon = $request->input('lastupdateon');
        // $lastupdateby = $request->input('lastupdateby');
        // $lastapproveon = $request->input('lastapproveon');
        // $lastapproveby = $request->input('lastapproveby');
        $recordstatus = 'EDT';
        $mis_prm_obe_plo = mis_prm_obe_plo::where('obe_plo_id',$obe_plo_id)->update([
            // 'obe_plo_id' => $obe_plo_id,
            'obe_plo_name' => $obe_plo_name,
            'obe_plo_statement' => $obe_plo_statement,
            'recordstatus' => $recordstatus,
        ]);

        if ($mis_prm_obe_plo)  {
            return response()->json([
                'success'=>true,
                'message'=>"Update Success!",
                'data' => $mis_prm_obe_plo
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

      public function deletePlo(Request $request){
        
        $obe_plo_id = $request->input('obe_plo_id');
        $recordstatus = 'DEL';

        // $obj = mis_prm_obe::where([['obe_plo_id','=',$obe_plo_id]])-> update([
        //     'recordstatus' => $recordstatus,
        // ]);

        $obj = mis_prm_obe_plo::where('obe_plo_id',$obe_plo_id)->update([
            'recordstatus' => $recordstatus,
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
}
