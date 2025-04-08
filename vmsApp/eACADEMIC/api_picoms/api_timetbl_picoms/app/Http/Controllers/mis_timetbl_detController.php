<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_timetbl_det;
use DB;

class mis_timetbl_detController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }


    public function register(Request $request){
        $fk_timetbl = $request->input('fk_timetbl');
        $fk_lecturer = $request->input('fk_lecturer');
        $tmt_day = $request->input('tmt_day');
        $tmt_starttime = $request->input('tmt_starttime');
        $tmt_endtime = $request->input('tmt_endtime');
        $tmt_slot = $request->input('tmt_slot');
        $fk_location = $request->input('fk_location');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_timetbl_det::create([
            'fk_timetbl' => $fk_timetbl,
            'fk_lecturer' => $fk_lecturer,
            'tmt_day' => $tmt_day,
            'tmt_starttime' => $tmt_starttime,
            'tmt_endtime' => $tmt_endtime,
            'tmt_slot' => $tmt_slot,
            'fk_location' => $fk_location,
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


    public function show($id){
        $obj = mis_timetbl_det::where('mis_timetbl_det.pk_id',$id) 
            ->leftjoin('mis_timetable', 'mis_timetable.pk_id','=','mis_timetbl_det.fk_timetbl')
            ->leftjoin('mis_prm_locations', 'mis_prm_locations.loc_id','=','mis_timetbl_det.fk_location')
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id','=','mis_timetable.fk_course')
            ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_timetable.fk_acaCal')
            ->leftjoin('aca_cal_category', 'aca_cal_category.pk_id', '=', 'mis_prm_calendar.cal_category')
            ->first([
                'mis_timetbl_det.pk_id AS tmtDet_id',
                'tmt_day',
                'tmt_starttime',
                'tmt_endtime',
                'tmt_slot',
                'loc_name',
                'intake_taken',
                'tmt_type',
                'crs_code',
                'crs_name',
                'fk_course',
                'fk_acaCal', 
                'mis_prm_calendar.cur_year AS cal_year', 
                'cal_cohort', 
                'cal_category',
                'category'
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function list($id){
        $obj = mis_timetbl_det::where([['fk_timetbl',$id],['mis_timetbl_det.recordstatus','!=','DEL']])
            ->leftjoin('hrm_emp_info', 'hrm_emp_info.emp_id','=','mis_timetbl_det.fk_lecturer')
            ->leftjoin('mis_prm_locations', 'mis_prm_locations.loc_id','=','mis_timetbl_det.fk_location')
            ->orderBy('tmt_day')
            ->orderBy('tmt_starttime')
            ->get([
                'pk_id',
                'fk_timetbl',
                'fk_lecturer',
                'tmt_day',
                'tmt_starttime',
                'tmt_endtime',
                'tmt_slot',
                'emp_name',
                'loc_name',
                'loc_id'
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
                'success'=>false,
                'message'=>"No data found",
                'data'=>''
            ],404);
        }
    }


    // update
    public function update(Request $request){
        $pk_id = $request->input('pk_id');
        $fk_lecturer = $request->input('fk_lecturer');
        $tmt_day = $request->input('tmt_day');
        $tmt_starttime = $request->input('tmt_starttime');
        $tmt_endtime = $request->input('tmt_endtime');
        $tmt_slot = $request->input('tmt_slot');
        $fk_location = $request->input('fk_location');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_timetbl_det::where('pk_id',$pk_id) ->update([
            'fk_lecturer' => $fk_lecturer,
            'tmt_day' => $tmt_day,
            'tmt_starttime' => $tmt_starttime,
            'tmt_endtime' => $tmt_endtime,
            'tmt_slot' => $tmt_slot,
            'fk_location' => $fk_location,
            'recordstatus' => $recordstatus
        ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Update Success!',
                'data'=>$obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>'false',
                'message'=>'Update Failed',
                'data'=>$obj
            ],404);
        }
    }


    public function delete(Request $request){
        $id = $request->input('pk_id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_timetbl_det::where([['pk_id','=',$id]])-> update([
            'recordstatus' => $recordstatus,
        ]);

        if($obj){
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


    public function listByLectYear(Request $request){
        $fk_lecturer = $request->input('fk_lecturer');
        $cur_year = $request->input('cur_year');
        $curYear = str_replace("-","/",$cur_year);
        $cal_cohort = $request->input('cal_cohort');

        $obj = mis_timetbl_det::where([
                ['fk_lecturer',$fk_lecturer],
                ['mis_prm_calendar.cur_year',$curYear],
                ['cal_cohort',$cal_cohort],
                ['mis_timetbl_det.recordstatus','!=','DEL']
            ])
            ->leftjoin('mis_timetable', 'mis_timetable.pk_id','=','mis_timetbl_det.fk_timetbl')
            ->leftjoin('hrm_emp_info', 'hrm_emp_info.emp_id','=','mis_timetbl_det.fk_lecturer')
            ->leftjoin('mis_prm_locations', 'mis_prm_locations.loc_id','=','mis_timetbl_det.fk_location')
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id','=','mis_timetable.fk_course')
            ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id','=','mis_timetable.fk_acaCal')
            ->orderBy('tmt_day')
            ->orderBy('tmt_starttime')
            ->get([
                'mis_timetbl_det.pk_id AS tmtDet_id',
                'tmt_day',
                'tmt_starttime',
                'tmt_endtime',
                'crs_code',
                'crs_name',
                'mis_prm_calendar.cur_year AS cal_year',
                'cal_cohort',
                'loc_name',
                'tmt_slot',
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
                'success'=>false,
                'message'=>"No data found",
                'data'=>''
            ],404);
        }
    }


    // list by Lecturer & Academic Calendar & Course
    public function listByLectCalCrs(Request $request){
        $fk_lecturer = $request->input('fk_lecturer');
        $fk_acaCal = $request->input('fk_acaCal');
        $fk_course = $request->input('fk_course');

        $obj = mis_timetbl_det::where([
                ['fk_lecturer',$fk_lecturer],
                ['fk_acaCal',$fk_acaCal],
                ['fk_course',$fk_course],
                ['mis_timetbl_det.recordstatus','!=','DEL']
            ])
            ->leftjoin('mis_timetable', 'mis_timetable.pk_id','=','mis_timetbl_det.fk_timetbl')
            ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id','=','mis_timetable.fk_acaCal')
            ->leftjoin('mis_prm_locations', 'mis_prm_locations.loc_id','=','mis_timetbl_det.fk_location')
            ->orderBy('tmt_day')
            ->orderBy('tmt_starttime')
            ->get([
                'mis_timetbl_det.pk_id AS tmtDet_id',
                'tmt_day',
                'tmt_starttime',
                'tmt_endtime',
                'loc_name',
                'tmt_slot'
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
                'success'=>false,
                'message'=>"No data found",
                'data'=>''
            ],404);
        }
    }



    public function StudTimetable(Request $request){
        $studID = $request->input('studID');
        $aca_session = $request->input('aca_session');
        // $fk_course = $request->input('fk_course');

        // $studentId = 'BPT12220003';
        // $acaSession = 30;

        

        $obj = DB::table('mis_timetbl_det')
            ->select('mis_timetbl_det.pk_id AS tmtDet_id', 'tmt_day', 'tmt_starttime', 'tmt_endtime', 'loc_name', 'tmt_slot', 'hrm_emp_info.emp_name AS lecturer_name', 'mis_prm_course.crs_name AS course_name','mis_prm_course.crs_code')
            ->leftJoin('mis_timetable', 'mis_timetable.pk_id', '=', 'mis_timetbl_det.fk_timetbl')
            ->leftJoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_timetable.fk_acaCal')
            ->leftJoin('mis_prm_locations', 'mis_prm_locations.loc_id', '=', 'mis_timetbl_det.fk_location')
            ->leftJoin('mis_std_regsubject', 'mis_std_regsubject.crs_code', '=', 'mis_timetable.fk_course')
            ->leftJoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
            ->leftJoin('mis_lecturer_course_prm', 'mis_lecturer_course_prm.fk_cotDet', '=', 'mis_std_regsubject.fk_cotDet')
            ->leftJoin('hrm_emp_info', 'hrm_emp_info.emp_id', '=', 'mis_lecturer_course_prm.emp_id')
            ->where('mis_std_regsubject.std_studentid', '=', $studID)
            ->where('mis_std_regsubject.aca_session', '=', $aca_session)
            ->where('mis_std_regsubject.recordstatus', '!=', 'DEL')
            ->where('mis_std_regsubject.rsb_status', '!=', 'DROP')
            ->where('mis_lecturer_course_prm.recordstatus', '!=', 'DEL')
            ->where('mis_timetbl_det.recordstatus', '!=', 'DEL')
            ->whereColumn('mis_timetable.fk_acaCal', '=', 'mis_std_regsubject.aca_session')
            ->whereColumn('mis_timetable.fk_course', '=', 'mis_std_regsubject.crs_code')
            ->whereColumn('mis_timetbl_det.fk_lecturer', '=', 'mis_lecturer_course_prm.emp_id')
            ->orderBy('tmt_day')
            ->orderBy('tmt_starttime')
            ->get();


        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"No data found",
                'data'=>''
            ],404);
        }
    }

    public function StudTimetable2(Request $request){
        $studID = $request->input('studID');
        $aca_session = $request->input('aca_session');
        // $fk_course = $request->input('fk_course');

        // $studentId = 'BPT12220003';
        // $acaSession = 30;

        

        $obj = mis_timetbl_det::select([
                'tmt_day',
                'tmt_starttime',
                'tmt_endtime',
                'mis_prm_locations.loc_name',
                'tmt_slot',
                'mis_prm_course.crs_name AS course_name',
                'mis_prm_course.crs_code',
                DB::raw("GROUP_CONCAT(DISTINCT hrm_emp_info.emp_name ORDER BY hrm_emp_info.emp_name SEPARATOR ', ') AS lecturer_name"),
                DB::raw("GROUP_CONCAT(DISTINCT mis_timetbl_det.fk_lecturer ORDER BY mis_timetbl_det.fk_lecturer SEPARATOR ', ') AS fk_lecturer"),
                DB::raw("GROUP_CONCAT(DISTINCT mis_lecturer_course_prm.emp_id ORDER BY mis_lecturer_course_prm.emp_id SEPARATOR ', ') AS emp_id"),
            ])
            ->leftJoin('mis_timetable', 'mis_timetable.pk_id', '=', 'mis_timetbl_det.fk_timetbl')
            ->leftJoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_timetable.fk_acaCal')
            ->leftJoin('mis_prm_locations', 'mis_prm_locations.loc_id', '=', 'mis_timetbl_det.fk_location')
            ->leftJoin('mis_std_regsubject', 'mis_std_regsubject.crs_code', '=', 'mis_timetable.fk_course')
            ->leftJoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
            ->leftJoin('mis_lecturer_course_prm', 'mis_lecturer_course_prm.fk_cotDet', '=', 'mis_std_regsubject.fk_cotDet')
            ->leftJoin('hrm_emp_info', 'hrm_emp_info.emp_id', '=', 'mis_lecturer_course_prm.emp_id')
            ->where('mis_std_regsubject.std_studentid', $studID)
            ->where('mis_std_regsubject.aca_session', $aca_session)
            ->where('mis_std_regsubject.recordstatus', '!=', 'DEL')
            ->where('mis_std_regsubject.rsb_status', '!=', 'DROP')
            ->where('mis_lecturer_course_prm.recordstatus', '!=', 'DEL')
            ->where('mis_timetbl_det.recordstatus', '!=', 'DEL')
            ->whereColumn('mis_timetable.fk_acaCal', '=', 'mis_std_regsubject.aca_session')
            ->whereColumn('mis_timetable.fk_course', '=', 'mis_std_regsubject.crs_code')
            ->whereColumn('mis_timetbl_det.fk_lecturer', '=', 'mis_lecturer_course_prm.emp_id')
            ->groupBy([
                'tmt_day',
                'tmt_starttime',
                'tmt_endtime',
                'loc_name',
                'tmt_slot',
                'mis_prm_course.crs_name',
                'mis_prm_course.crs_code'
            ])
            ->orderBy('tmt_day')
            ->orderBy('tmt_starttime')
            ->get();
        
        // Execute the query and retrieve results
        // $obj = $query->get();


        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"No data found",
                'data'=>''
            ],404);
        }
    }







    public function agreementStd(Request $request){
        $studID = $request->input('studID');
        $aca_session = $request->input('aca_session');
        // $fk_course = $request->input('fk_course');

        // $studentId = 'BPT12220003';
        // $acaSession = 30;
        


        $obj = mis_timetbl_det::select([
           
            'mis_prm_course.crs_name AS course_name',
            'mis_prm_course.crs_code',
            'mis_prm_course.crs_credit',
            DB::raw("GROUP_CONCAT(DISTINCT hrm_emp_info.emp_name ORDER BY hrm_emp_info.emp_name SEPARATOR ', ') AS lecturer_name"),
            DB::raw("GROUP_CONCAT(DISTINCT mis_timetbl_det.fk_lecturer ORDER BY mis_timetbl_det.fk_lecturer SEPARATOR ', ') AS fk_lecturer"),
            DB::raw("GROUP_CONCAT(DISTINCT mis_lecturer_course_prm.emp_id ORDER BY mis_lecturer_course_prm.emp_id SEPARATOR ', ') AS emp_id"),
      
         ])
        ->leftJoin('mis_timetable', 'mis_timetable.pk_id', '=', 'mis_timetbl_det.fk_timetbl')
        ->leftJoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_timetable.fk_acaCal')
        ->leftJoin('mis_prm_locations', 'mis_prm_locations.loc_id', '=', 'mis_timetbl_det.fk_location')
        ->leftJoin('mis_std_regsubject', 'mis_std_regsubject.crs_code', '=', 'mis_timetable.fk_course')
        ->leftJoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
        ->leftJoin('mis_lecturer_course_prm', 'mis_lecturer_course_prm.fk_cotDet', '=', 'mis_std_regsubject.fk_cotDet')
        ->leftJoin('hrm_emp_info', 'hrm_emp_info.emp_id', '=', 'mis_lecturer_course_prm.emp_id')
        ->where('mis_std_regsubject.std_studentid', $studID)
        ->where('mis_std_regsubject.aca_session', $aca_session)
        ->where('mis_std_regsubject.recordstatus', '!=', 'DEL')
        ->where('mis_std_regsubject.rsb_status', '!=', 'DROP')
        ->where('mis_lecturer_course_prm.recordstatus', '!=', 'DEL')
        ->where('mis_timetbl_det.recordstatus', '!=', 'DEL')
        ->whereColumn('mis_timetable.fk_acaCal', '=', 'mis_std_regsubject.aca_session')
        ->whereColumn('mis_timetable.fk_course', '=', 'mis_std_regsubject.crs_code')
        ->whereColumn('mis_timetbl_det.fk_lecturer', '=', 'mis_lecturer_course_prm.emp_id')
        ->groupBy([
           
            'mis_prm_course.crs_name',
            'mis_prm_course.crs_code',
            'mis_prm_course.crs_credit'
        ])
        ->get();
    
        
        // Execute the query and retrieve results
        // $obj = $query->get();


        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"No data found",
                'data'=>''
            ],404);
        }
    }









}
