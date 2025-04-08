<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_prm_course_cot_det;
use App\Models\mis_std_regsubject;
use App\Models\mis_prm_course;
use Illuminate\Support\Facades\DB;

class mis_prm_course_cot_detController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function register(Request $request){
        $fk_pgm_det = $request->input('fk_pgm_det');
        $fk_course = $request->input('fk_course');
        $fk_semester = $request->input('fk_semester');
        $crs_type = $request->input('crs_type');
        $recordstatus = $request->input('recordstatus');
        // $in_progress = $request->input('in_progress');
        

        $obj = mis_prm_course_cot_det::create([
            'fk_pgm_det' => $fk_pgm_det,
            'fk_course' => $fk_course,
            'fk_semester' => $fk_semester,
            'crs_type' => $crs_type,
            'recordstatus' => $recordstatus,
        ]);

        // $obj2 = mis_prm_course::where([['pk_id','=',$fk_course]]) ->update([
        //     'counted_cgpa' => $in_progress,
        // ]);

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

    public function show(Request $request){
        $fk_pgm_det = $request->input('fk_pgm_det');
        $cot_intake = $request->input('cot_intake');
        $cot_semester = $request->input('cot_semester');

        $mis_prm_course_cot_det = mis_prm_course_cot_det::where([['recordstatus','!=','DEL']])->get();

        
        $q = $mis_prm_course_cot_det->where('fk_pgm_det',$fk_pgm_det)->where('cot_intake',$cot_intake)->where('cot_semester',$cot_semester);

        if ($mis_prm_course_cot_det){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$q
            ],200);
        }
    }

    public function list()  {
        $mis_prm_course_cot_det = mis_prm_course_cot_det::where([['recordstatus','!=','DEL']])->get();

        if ($mis_prm_course_cot_det)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$mis_prm_course_cot_det
            ],200);
        }
        
    }


    public function update(Request $request){
        $ccd_id = $request->input('ccd_id');
        $fk_course = $request->input('fk_course');
        $fk_semester = $request->input('fk_semester');
        $crs_type = $request->input('crs_type');
        $recordstatus = $request->input('recordstatus');
        // $in_progress = $request->input('in_progress');

        $obj = mis_prm_course_cot_det::where([['ccd_id','=',$ccd_id]]) ->update([
            'fk_course' => $fk_course,
            'fk_semester' => $fk_semester,
            'crs_type' => $crs_type,
            'recordstatus' => $recordstatus,
        ]);

        // $obj2 = mis_prm_course::where([['pk_id','=',$fk_course]]) ->update([
        //     'counted_cgpa' => $in_progress,
        // ]);

        if($obj){
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
        $ccd_id = $request->input('ccd_id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_course_cot_det::where([['ccd_id','=',$ccd_id]]) -> update([
            'recordstatus' => 'DEL',
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


    // list by COT id
    public function listCourse($id){
        $obj = mis_prm_course_cot_det::where([['mis_prm_course_cot_det.fk_pgm_det',$id],['mis_prm_course_cot_det.recordstatus','!=','DEL']])
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id','=','mis_prm_course_cot_det.fk_course')
            ->leftjoin('mis_prm_programme_det', 'mis_prm_programme_det.dtp_id','=','mis_prm_course_cot_det.fk_pgm_det')
            ->leftjoin('mis_prm_faculty', 'mis_prm_faculty.pk_id','=','mis_prm_course.fac_id')
            ->orderBy('cot_semester')
            ->get([
                'ccd_id',
                'fk_pgm_det',
                'cot_semester',
                'fk_course',
                'crs_type',
                'crs_code',
                'crs_name',
                'dtp_year',
                'dtp_id',
                'mis_prm_faculty.fac_id AS fac_code',
                'dtp_year'
            ]);
            // ->get();
            
        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // list by program id (Course Offer Details) for each semester
    public function listByPgm(Request $request){
        $fk_pgm_det = $request->input('fk_pgm_det');
        $fk_semester = $request->input('fk_semester');

        $obj = mis_prm_course_cot_det::where([
                ['mis_prm_course_cot_det.fk_pgm_det',$fk_pgm_det],
                ['mis_prm_course_cot_det.fk_semester',$fk_semester],
                ['mis_prm_course_cot_det.recordstatus','!=','DEL']
            ])
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_prm_course_cot_det.fk_course')
            ->leftjoin('mis_prm_cot_sem', 'mis_prm_cot_sem.pk_id', '=', 'mis_prm_course_cot_det.fk_semester')
            ->get([
                'ccd_id',
                'fk_semester',
                'fk_course',
                'crs_type',
                'crs_code',
                'crs_name',
                'mis_prm_course_cot_det.recordstatus AS sttsCotDet',
                'crs_credit',
                'pgm_semester'
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // group by semester
    public function groupBySem($id){
        $obj = mis_prm_course_cot_det::groupBy('cot_semester')
            ->where([['fk_pgm_det','=',$id],['recordstatus','!=','DEL']]) ->orderBy('cot_semester','asc') ->get();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // list by program id (Exam Timetbl)
    public function selectExamCrs($id){
        $obj = mis_prm_course_cot_det::where([['mis_prm_course_cot_det.fk_pgm_det',$id],['mis_prm_course_cot_det.recordstatus','!=','DEL']]) 
            ->join('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_prm_course_cot_det.fk_course')
            ->orderBy('cot_semester')
            ->get([
                'ccd_id',
                'cot_semester',
                'fk_course',
                'crs_type',
                'crs_code',
                'crs_name'
            ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // group by course
    public function groupByCrs(){
        $obj = mis_prm_course_cot_det::where([['mis_prm_course_cot_det.recordstatus','!=','DEL']])
            ->groupBy('fk_course')
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_prm_course_cot_det.fk_course')
            ->orderBy('crs_code','asc') 
            ->get([
                'pk_id',
                'crs_code'
            ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // find id based on course, cot_sem, pgm_det
    public function findId(Request $request){
        $fk_pgm_det = $request->input('fk_pgm_det');
        $fk_course = $request->input('fk_course');
        $cot_semester = $request->input('cot_semester');

        $obj = mis_prm_course_cot_det::where([
                    ['fk_pgm_det','=',$fk_pgm_det],
                    ['fk_course','=',$fk_course],
                    ['cot_semester','=',$cot_semester],
                    ['recordstatus','!=','DEL']
                ])
                ->get(['ccd_id']);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }


    // list crs by current acaCal & programme
    public function crsByPgmdetAcaCal(Request $request){
        $acaCal = $request->input('acaCal');
        $pgmDetId = $request->input('pgmId');

        $obj = mis_prm_course_cot_det::where([
                ['aca_session','=',$acaCal],
                ['mis_prm_course_cot_det.fk_pgm_det','=',$pgmDetId],
                ['mis_prm_course_cot_det.recordstatus','!=','DEL']
            ])
            ->leftjoin('mis_prm_cot_sem', 'mis_prm_cot_sem.pk_id','=','mis_prm_course_cot_det.fk_semester')
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id','=','mis_prm_course_cot_det.fk_course')
            ->get([
                'ccd_id',
                'fk_course',
                'crs_code',
                'crs_name'
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }


    // groupBy Course by Academic Calendar
    public function grpByCrsByCal($id){
        $obj = mis_prm_course_cot_det::groupby('ccd_id',
        'fk_course',
        'crs_code',
        'crs_name')
            ->where([
                ['aca_session','=',$id],
                ['mis_prm_course_cot_det.recordstatus','!=','DEL']
            ])
            ->leftjoin('mis_prm_cot_sem', 'mis_prm_cot_sem.pk_id','=','mis_prm_course_cot_det.fk_semester')
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id','=','mis_prm_course_cot_det.fk_course')
            ->get([
                'ccd_id',
                'fk_course',
                'crs_code',
                'crs_name'
            ]);

        if($obj){
            // dd('hai');

            return response()->json([
                'success'=>true,
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }else{
            dd('loll');
        }
    }

    public function searchByAcaCalendar(Request $request){
        $fk_course = $request->input('fk_course');
        $fk_acaCal = $request->input('fk_acaCal');

        $obj = mis_prm_course_cot_det::
        join('mis_prm_cot_sem','mis_prm_cot_sem.pk_id','mis_prm_course_cot_det.fk_semester')
        ->join('mis_prm_programme_det','mis_prm_programme_det.dtp_id','mis_prm_course_cot_det.fk_pgm_det')
        ->where('fk_course',$fk_course)
        ->where('aca_session',$fk_acaCal)
        ->first([
            'ccd_id',
            'mis_prm_course_cot_det.fk_pgm_det',
            'fk_course',
            'mis_prm_programme_det.pgm_id',
            'aca_session' 
        ]);

        if ($obj){
            return response()->json([
                'success'=>true,
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>'List Failed!',
                'data'=>''
            ],200);
        }
    }

    public function searchByAcaCalendarStudent(Request $request){
        $stdId = $request->input('stdId');
        $sem = $request->input('sem');
        $fk_course = $request->input('fk_course');

        $obj = DB::table('mis_std_info')
        ->select([
            'mis_std_info.std_studentid',
            'mis_std_info.pgm_fk',
            'mis_std_info.cur_intake',
            'mis_std_info.sti_session_id',
            'mis_std_info.recordstatus',
            'mis_prm_programme.pk_id',
            'mis_prm_programme_det.fk_aca_calendar',
            'mis_prm_programme.recordstatus',
            'mis_prm_programme_det.dtp_id',
            'mis_prm_programme_det.dtp_intake',
            'mis_prm_programme_det.dtp_year',
            'mis_prm_programme_det.recordstatus',
            'mis_prm_cot_sem.pk_id',
            'mis_prm_cot_sem.pgm_semester',
            'mis_prm_cot_sem.sem_type',
            'mis_prm_cot_sem.aca_session',
            'mis_prm_cot_sem.recordstatus',
            'mis_prm_course_cot_det.fk_course',
            'mis_prm_course_cot_det.recordstatus',
        ])
        ->leftJoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_std_info.pgm_fk')
        ->leftJoin('mis_prm_programme_det', 'mis_prm_programme_det.pgm_id', '=', 'mis_prm_programme.pk_id')
        ->leftJoin('mis_prm_cot_sem', 'mis_prm_cot_sem.fk_pgm_det', '=', 'mis_prm_programme_det.dtp_id')
        ->leftJoin('mis_prm_course_cot_det', 'mis_prm_course_cot_det.fk_semester', '=', 'mis_prm_cot_sem.pk_id')
        ->where('mis_std_info.std_studentid', $stdId)
        ->where('mis_std_info.cur_intake', '=', DB::raw('mis_prm_programme_det.dtp_intake'))
        ->where('mis_prm_programme_det.recordstatus', '!=', 'DEL')
        ->where('mis_prm_course_cot_det.recordstatus', '!=', 'DEL')
        ->where('mis_prm_cot_sem.pgm_semester', $sem)
        ->where('mis_prm_course_cot_det.fk_course', $fk_course)
        ->get();


        

        if(sizeof($obj)>0){
            return response()->json([
                'success'=>true,
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>'List Failed!',
                'data'=>''
            ],200);
        }
    }





    public function auditCourse($id, $stdID){
        
        // $obj = mis_prm_course_cot_det::where([['mis_prm_course_cot_det.fk_pgm_det',$id],['mis_prm_course_cot_det.recordstatus','!=','DEL']])
      
// $courses = DB::table('mis_prm_course_cot_det')
// ->select([
//     'mis_prm_course_cot_det.fk_pgm_det',
//     'mis_prm_course_cot_det.ccd_id',
//     'mis_prm_course_cot_det.fk_course',
//     'mis_prm_course_cot_det.fk_semester',
//     'mis_prm_course_cot_det.crs_type',
//     'mis_prm_course.pk_id',
//     'mis_prm_course.crs_code',
//     'mis_prm_course.crs_name',
//     'mis_prm_course.crs_credit',
//     'mis_prm_course.counted_cgpa',
//     'mis_prm_programme_det.dtp_id',
//     'mis_prm_programme_det.pgm_id',
//     'mis_prm_programme_det.fk_aca_calendar',
//     'mis_prm_faculty.fac_id',
//     'mis_prm_faculty.fac_name',
//     'mis_prm_cot_sem.pgm_semester AS expected_sem'
// ])
// ->leftJoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_prm_course_cot_det.fk_course')
// ->leftJoin('mis_prm_programme_det', 'mis_prm_programme_det.dtp_id', '=', 'mis_prm_course_cot_det.fk_pgm_det')
// ->leftJoin('mis_prm_faculty', 'mis_prm_faculty.pk_id', '=', 'mis_prm_course.fac_id')
// ->leftJoin('mis_prm_cot_sem', 'mis_prm_cot_sem.pk_id', '=', 'mis_prm_course_cot_det.fk_semester')
// ->where('mis_prm_course_cot_det.fk_pgm_det', $id)
// ->where('mis_prm_course_cot_det.recordstatus', '!=', 'DEL')
// ->orderByDesc('mis_prm_course_cot_det.fk_course');
$subquery = mis_prm_course_cot_det::where([
            ['mis_prm_course_cot_det.fk_pgm_det',$id],
            ['mis_prm_course_cot_det.recordstatus','!=','DEL']
            ])
        ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id','=','mis_prm_course_cot_det.fk_course')
            ->leftjoin('mis_prm_programme_det', 'mis_prm_programme_det.dtp_id','=','mis_prm_course_cot_det.fk_pgm_det')
            ->leftjoin('mis_prm_faculty', 'mis_prm_faculty.pk_id','=','mis_prm_course.fac_id')
            ->leftjoin('mis_prm_cot_sem', 'mis_prm_cot_sem.pk_id', '=', 'mis_prm_course_cot_det.fk_semester')
            ->orderByDesc('fk_course')
            ->get(
                [
                // 'mis_prm_course_cot_det.fk_pgm_det',
                'mis_prm_course_cot_det.ccd_id',
                'mis_prm_course_cot_det.fk_course',
                // 'mis_prm_course_cot_det.fk_semester',
                // 'mis_prm_course_cot_det.crs_type',

                'mis_prm_course.pk_id',
                'mis_prm_course.crs_code',
                'mis_prm_course.crs_name',
                'mis_prm_course.crs_credit',
                // 'mis_prm_course.counted_cgpa',


        //         'mis_prm_programme_det.dtp_id',
        //         'mis_prm_programme_det.pgm_id',
        //         'mis_prm_programme_det.fk_aca_calendar',

        //         'mis_prm_faculty.fac_id',
        //         'mis_prm_faculty.fac_name',
         'mis_prm_cot_sem.pgm_semester AS expected_sem',

         'mis_prm_course_cot_det.recordstatus AS rcotdet',
         'mis_prm_course.recordstatus AS rcrs',
         'mis_prm_programme_det.recordstatus AS rdet',
         'mis_prm_cot_sem.recordstatus AS rcot',
            ]
        );

            $objRegsStd = mis_std_regsubject::where([
                ['mis_std_regsubject.recordstatus','!=','DEL'],
                ['mis_std_regsubject.std_studentid', $stdID], 
                ])
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id','=','mis_std_regsubject.crs_code')
                ->leftjoin('mis_prm_faculty', 'mis_prm_faculty.pk_id','=','mis_prm_course.fac_id')
                ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id','=','mis_std_regsubject.aca_session')
                ->leftJoin('mis_std_curAcademic', function($join) {
                    $join->on('mis_std_curAcademic.fk_acaCal', '=', 'mis_std_regsubject.aca_session')
                         ->on('mis_std_curAcademic.std_studentid', '=', 'mis_std_regsubject.std_studentid');
                })
      
                ->orderByDesc('mis_std_regsubject.crs_code')
            ->whereNotNull('mis_std_curAcademic.std_senate_endorsement')       
            ->where('mis_std_regsubject.recordstatus', '!=', 'DEL')
            ->where('mis_std_regsubject.rsb_status', '!=', 'Drop')
                ->get(
                    [
                        'mis_std_regsubject.rsb_id',
                        'mis_std_regsubject.std_studentid',
                        'mis_std_regsubject.crs_code',
                        'mis_std_regsubject.rsb_type',
                        'mis_std_regsubject.rsb_status',
                        'mis_std_regsubject.barr_status',
                        'mis_std_regsubject.fk_cotDet',
                        'mis_std_regsubject.grade',
                        'mis_prm_course.crs_code AS codecrs',
                        'mis_prm_course.fac_id',
                        'mis_prm_course.crs_name',
                        'mis_prm_course.crs_status',
                        'mis_prm_course.crs_credit',
                        'mis_prm_course.counted_cgpa',
                        'mis_prm_faculty.fac_id',
                        'mis_prm_faculty.cam_id',
                        'mis_prm_faculty.fac_name',
                        'mis_prm_calendar.cal_id',
                        'mis_prm_calendar.cur_year',
                        'mis_prm_calendar.cal_cohort',
                        'mis_prm_calendar.cal_category',
                        'mis_prm_calendar.cal_status',
                        'mis_std_curAcademic.std_semester AS taken_semester',
                        'mis_std_curAcademic.fk_acaCal',


                        'mis_std_regsubject.recordstatus AS rregs',
                        'mis_prm_course.recordstatus AS rcrs',
                        'mis_prm_faculty.recordstatus AS rfac',
                        'mis_prm_calendar.recordstatus AS rcal',
                        'mis_std_curAcademic.recordstatus AS rcurr',
                        ]
                );

                // dd('ss');
        if ($objRegsStd){
            return response()->json([
                'success'=>true,
                'message'=>'List Success!',
                'dataExpectedCrs'=>$subquery,
                'dataStdCurr'=>$objRegsStd
                // ->count()
            ],200);
        }else{
            return response()->json([
                'success'=>false,
                'message'=>'List Unsuccessful!',
                'data'=>''
                // ->count()
            ],401);
        }




        // // code lama 
        //  // $obj = mis_prm_course_cot_det::where([['mis_prm_course_cot_det.fk_pgm_det',$id],['mis_prm_course_cot_det.recordstatus','!=','DEL']])
        //  $obj = mis_prm_course_cot_det::where([['mis_prm_course_cot_det.fk_pgm_det',$id],['mis_prm_course_cot_det.recordstatus','!=','DEL'],['mis_std_regsubject.std_studentid', $stdID], ['mis_std_regsubject.grade', '!=','F']])
        //  ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id','=','mis_prm_course_cot_det.fk_course')
        //      ->leftjoin('mis_prm_programme_det', 'mis_prm_programme_det.dtp_id','=','mis_prm_course_cot_det.fk_pgm_det')
        //      ->leftjoin('mis_prm_faculty', 'mis_prm_faculty.pk_id','=','mis_prm_course.fac_id')
        //      ->leftjoin('mis_std_regsubject', 'mis_std_regsubject.crs_code','=','mis_prm_course_cot_det.fk_course')
        //      ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id','=','mis_std_regsubject.aca_session')
        //      ->leftJoin('mis_std_curAcademic', function($join) {
        //          $join->on('mis_std_curAcademic.fk_acaCal', '=', 'mis_std_regsubject.aca_session')
        //               ->on('mis_std_curAcademic.std_studentid', '=', 'mis_std_regsubject.std_studentid');
        //      })
        //      ->orderBy('mis_std_curAcademic.std_semester')
        //      ->orderBy('cal_id')
        //      ->orderByDesc('fk_course')
        //  ->whereNotNull('cot_semester') 
        //  ->whereNotNull('mis_std_curAcademic.std_senate_endorsement')       
        //  ->where('mis_std_regsubject.recordstatus', '!=', 'DEL')
        //  ->where('mis_std_regsubject.rsb_status', '!=', 'Drop')
        //      ->get([
        //          'ccd_id',
        //          'fk_pgm_det',
        //          'cot_semester',
        //          'fk_course',
        //          'crs_type',
        //          'crs_credit',
        //          'cal_id',
        //          'cal_cohort',
        //          'mis_prm_course.crs_code as code_subject',
        //          'crs_name',
        //          'dtp_year',
        //          'dtp_id',
        //          'mis_prm_faculty.fac_id AS fac_code',
        //          'dtp_year',
        //          'rsb_status',
        //          'tMark',
        //          'grade',
        //          'point',
        //          'mark_generate',
        //          'reg_semester',
        //          'rsb_type',
        //          'rsb_id',
        //          'reg_semester',
        //          'mis_std_curAcademic.std_semester',
        //          'mis_prm_calendar.cur_year'
        //      ]);
        //      // ->g et();
             
    }

    public function auditCourseStdSite($id, $stdID){
        // $obj = mis_prm_course_cot_det::where([['mis_prm_course_cot_det.fk_pgm_det',$id],['mis_prm_course_cot_det.recordstatus','!=','DEL']])
        $obj = mis_prm_course_cot_det::where([['mis_prm_course_cot_det.fk_pgm_det',$id],['mis_prm_course_cot_det.recordstatus','!=','DEL'],['mis_std_regsubject.std_studentid', $stdID], ['mis_std_regsubject.grade', '!=','F']])
        ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id','=','mis_prm_course_cot_det.fk_course')
            ->leftjoin('mis_prm_programme_det', 'mis_prm_programme_det.dtp_id','=','mis_prm_course_cot_det.fk_pgm_det')
            ->leftjoin('mis_prm_faculty', 'mis_prm_faculty.pk_id','=','mis_prm_course.fac_id')
            ->leftjoin('mis_std_regsubject', 'mis_std_regsubject.crs_code','=','mis_prm_course_cot_det.fk_course')
            ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id','=','mis_std_regsubject.aca_session')
            ->leftJoin('mis_std_curAcademic', function($join) {
                $join->on('mis_std_curAcademic.fk_acaCal', '=', 'mis_std_regsubject.aca_session')
                     ->on('mis_std_curAcademic.std_studentid', '=', 'mis_std_regsubject.std_studentid');
            })
            ->orderBy('mis_std_curAcademic.std_semester')
            ->orderBy('cal_id')
            ->orderByDesc('fk_course')
        ->whereNotNull('cot_semester') 
        ->whereNotNull('mis_std_curAcademic.std_senate_endorsement')       
        ->where('mis_std_regsubject.recordstatus', '!=', 'DEL')
        ->where('mis_std_regsubject.rsb_status', '!=', 'Drop')
            ->get([
                'ccd_id',
                'fk_pgm_det',
                'cot_semester',
                'fk_course',
                'crs_type',
                'crs_credit',
                'cal_id',
                'cal_cohort',
                'mis_prm_course.crs_code as code_subject',
                'crs_name',
                'dtp_year',
                'dtp_id',
                'mis_prm_faculty.fac_id AS fac_code',
                'dtp_year',
                'rsb_status',
                'tMark',
                'grade',
                'point',
                'mark_generate',
                'reg_semester',
                'rsb_type',
                'rsb_id',
                'reg_semester',
                'mis_std_curAcademic.std_semester',
                'mis_prm_calendar.cur_year'
            ]);
            // ->g et();
            
        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }
}
