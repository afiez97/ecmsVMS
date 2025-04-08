<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_prm_calendar;
use Illuminate\Support\Facades\DB;
// use DB;

class mis_prm_calendarController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function register(Request $request){
        $cur_year = $request->input('cur_year');
        $cal_status = $request->input('cal_status');
        $cal_cohort = $request->input('cal_cohort');
        $cal_category = $request->input('cal_category');
        $recordstatus = $request->input('recordstatus');

        $register = mis_prm_calendar::create([
            'cur_year' => $cur_year,
            'cal_status' => $cal_status,
            'cal_cohort' => $cal_cohort,
            'cal_category' => $cal_category,
            'recordstatus' => $recordstatus,
        ]);

        if($register){
            return response()->json([
                'success'=>'true',
                'message'=>'Register Success!',
                'data'=>$register
            ],201);
        }
        else{
            return response()->json([
                'success'=>'false',
                'message'=>'Bad Request',
                'data'=>$register
            ],400);
        }
    }


    public function show($id){
        $obj = mis_prm_calendar::where('cal_id',$id)
            ->leftjoin('aca_cal_category', 'aca_cal_category.pk_id','=','mis_prm_calendar.cal_category')
            ->first([
                'cal_id',
                'cur_year',
                'cal_status',
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

    
    public function list(){
        $obj = mis_prm_calendar::where([['mis_prm_calendar.recordstatus','!=','DEL']])
            ->leftjoin('aca_cal_category', 'aca_cal_category.pk_id','=','mis_prm_calendar.cal_category')
            ->orderBy('cur_year','desc') 
            ->get([
                'cal_id',
                'cur_year',
                'cal_status',
                'cal_cohort',
                'cal_category',
                'category'
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function update(Request $request){
        $cal_id = $request->input('cal_id');
        $cur_year = $request->input('cur_year');
        $cal_status = $request->input('cal_status');
        $cal_cohort = $request->input('cal_cohort');
        $cal_category = $request->input('cal_category');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_calendar::where([['cal_id','=',$cal_id]]) -> update([
            'cur_year' => $cur_year,
            'cal_status' => $cal_status,
            'cal_cohort' => $cal_cohort,
            'cal_category' => $cal_category,
            'recordstatus' => $recordstatus,
        ]);

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
        $cal_id = $request->input('cal_id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_calendar::where([['cal_id','=',$cal_id]]) -> update([
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
            ],404);
        }
    }


    public function listByCat($id){
        $obj = mis_prm_calendar::where([['cal_category',$id],['mis_prm_calendar.recordstatus','!=','DEL']]) 
            ->leftjoin('aca_cal_category', 'aca_cal_category.pk_id','=','mis_prm_calendar.cal_category')
            ->orderBy('cur_year','desc') 
            ->orderBy('cal_cohort','desc')
            ->get([
                'cal_id',
                'cur_year',
                'cal_status',
                'cal_cohort',
                'cal_category',
                'category'
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }

    public function listActive(){
        $obj = mis_prm_calendar::where([
            // ['cal_status','Active'],
        ['mis_prm_calendar.recordstatus','!=','DEL']
        ]) 
            ->groupBy('cur_year','cal_cohort','cal_id')
            ->orderBy('cur_year','desc') 
            ->orderBy('cal_cohort','desc')
            ->get([
                DB::RAW('SUM(cal_id)'),
                'cal_id',
                'cur_year',
                'cal_intake',
                'cal_status',
                'cal_cohort'
            ]);

        if($obj){
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
            ],400);
        }
    }

    public function listActive2(){
        $obj = mis_prm_calendar::where('cal_status', 'Active')
            ->where('mis_prm_calendar.recordstatus', '!=', 'DEL')
            ->groupBy('cur_year', 'cal_cohort')
            ->orderBy('cur_year', 'desc')
            ->orderBy('cal_cohort', 'desc')
            ->get([
                'cur_year', 'cal_cohort'
            ]);

        if($obj){
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
            ],400);
        }
    }


    // list aca_cal Category by year & sem
    public function catByYearSem(Request $request){
        $curyear = $request->input('cur_year');
        $year = str_replace("-","/",$curyear);
        $sem = $request->input('cal_cohort');

        $obj = mis_prm_calendar::where([
                ['cur_year',$year],
                ['cal_cohort',$sem],
                ['mis_prm_calendar.recordstatus','!=','DEL']
            ]) 
            ->leftjoin('aca_cal_category', 'aca_cal_category.pk_id','=','mis_prm_calendar.cal_category')
            ->orderBy('cal_category')
            ->get([
                'cal_id',
                'cur_year',
                'cal_status',
                'cal_cohort',
                'cal_category',
                'category'
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // list by cal_category & cal_status==Active
    public function listByCatSttsActive($id){
        $obj = mis_prm_calendar::where([
                ['cal_category',$id],
                ['cal_status','Active'],
                ['mis_prm_calendar.recordstatus','!=','DEL']
            ]) 
            ->leftjoin('aca_cal_category', 'aca_cal_category.pk_id','=','mis_prm_calendar.cal_category')
            ->orderBy('cur_year','desc') 
            ->orderBy('cal_cohort','desc')
            ->get([
                'cal_id',
                'cur_year',
                'cal_status',
                'cal_cohort',
                'cal_category',
                'category'
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // group by cur_year
    public function grpByYear(){
        $obj = mis_prm_calendar:: //groupBy ('cur_year')
            where('mis_prm_calendar.recordstatus','!=',"DEL")
            ->orderBy('cur_year','desc')
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
                'success'=>'false',
                'message'=>'No Data Found!',
                'data'=>$obj
            ],200);
        }
    }

    public function stdIntake(Request $request){
        $cur_intake = $request->input('cur_intake');
        $sti_session_id = $request->input('sti_session_id');
        $cur_year = str_replace("-","/",$sti_session_id);

        $obj = mis_prm_calendar::
            where('cur_year',$cur_year)
            ->where('cal_intake',$cur_intake)
            ->where('mis_prm_calendar.recordstatus','!=',"DEL")
            // ->orderBy('cur_year','desc')
            ->first();

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>'false',
                'message'=>'No Data Found!',
                'data'=>$obj
            ],200);
        }
    }

    public function getid(Request $request){
        // $obj = DB::table('mis_prm_calendar')
        //     ->select('cal_id')
        //     ->where('cur_year', $year)
        //     ->where('cal_cohort', $cohort)
        //     ->where('cal_category', $cat)
        //     ->first();
        $year = $request->input('cur_year');
        $cohort = $request->input('cal_cohort');
        $cat = $request->input('cal_category');

        $obj = mis_prm_calendar::
            select('cal_id')
            ->where('cur_year',$year)
            ->where('cal_cohort',$cohort)
            ->where('cal_category',$cat)
            ->where('mis_prm_calendar.recordstatus','!=',"DEL")
            // ->orderBy('cur_year','desc')
            ->first();

            // dd($obj );

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>'false',
                'message'=>'No Data Found!',
                'data'=>$obj
            ],200);
        }
    }


    public function detCourse(Request $request){
        // $obj = DB::table('mis_prm_calendar')
        //     ->select('cal_id')
        //     ->where('cur_year', $year)
        //     ->where('cal_cohort', $cohort)
        //     ->where('cal_category', $cat)
        //     ->first();
        $year = $request->input('year');
        $cal_cohort = $request->input('cal_cohort');  // 20212022/2 = year/cohort
        $pgm_id = $request->input('pgm_id');
        $fk_course = $request->input('fk_course');
        // $crs_code = $request->input('crs_code');
        $category = $request->input('category');
        
        $obj = mis_prm_calendar::
        leftJoin('mis_prm_programme_det', 'mis_prm_programme_det.fk_aca_calendar', '=', 'mis_prm_calendar.cal_id')
        ->leftJoin('aca_cal_category', 'aca_cal_category.pk_id', '=', 'mis_prm_calendar.cal_category')
        ->leftJoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_prm_programme_det.pgm_id')
        ->leftJoin('mis_prm_course_cot_det', 'mis_prm_course_cot_det.fk_pgm_det', '=', 'mis_prm_programme_det.dtp_id')
        ->leftJoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_prm_course_cot_det.fk_course')
        ->leftJoin('mis_lecturer_course_prm', 'mis_lecturer_course_prm.fk_cotDet', '=', 'mis_prm_course_cot_det.ccd_id')
        ->leftJoin('mis_prm_cot_sem', 'mis_prm_cot_sem.pk_id', '=', 'mis_prm_course_cot_det.fk_semester')
        ->select(
            'aca_cal_category.category',
            'mis_prm_course.crs_code',
            'mis_prm_course.crs_name',
            'mis_prm_programme.pgm_id AS pgm_code',
            // 'mis_prm_calendar.*',
            'mis_prm_calendar.cal_id',
            'mis_prm_calendar.cur_year',
            'mis_prm_calendar.cal_cohort',
            'mis_prm_calendar.cal_category',
            'mis_prm_calendar.cal_status',
            'mis_prm_calendar.cal_semno',
            'mis_prm_calendar.cal_intake',
            // 'mis_prm_calendar.cal_type_sem',
            'mis_prm_programme_det.dtp_id',
            'mis_prm_programme_det.pgm_id',
            'mis_prm_programme.pgm_name',
            'mis_prm_programme_det.fk_aca_calendar',
            'mis_prm_course_cot_det.fk_course',
            // 'mis_prm_course_cot_det.cot_semester',
            'mis_prm_cot_sem.pgm_semester'
        )
        // ->where('cur_year', '2021/2022')
        // ->where('cal_cohort', 2)
        // ->where('aca_cal_category.category', 'AC_UG&PG (Coursework)')
        // ->where('mis_prm_programme.pgm_id', 'DML')
        // ->where('mis_prm_course.crs_code', 'PDML4513')
        // ->where('mis_prm_calendar.cur_year', $year)
        // ->where('mis_prm_calendar.cal_cohort', $cal_cohort)
        ->where('aca_cal_category.category', $category)
        ->where('mis_prm_programme.pgm_id', $pgm_id)
        ->where('mis_prm_course_cot_det.fk_course', $fk_course)
        // ->where('mis_prm_course.crs_code', $crs_code)
        
        ->where('mis_prm_programme_det.recordstatus', '!=', 'DEL')
        ->where('aca_cal_category.recordstatus', '!=', 'DEL')
        ->where('mis_prm_course_cot_det.recordstatus', '!=', 'DEL')
        ->where('mis_prm_course.recordstatus', '!=', 'DEL')
        ->first();

        if($obj){
            // if(!$obj->isEmpty()){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>'false',
                'message'=>'No Data Found!',
                'data'=>''
            ],200);
        }
    }
}
