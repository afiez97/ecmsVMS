<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_exam_invigilator;

class mis_exam_invigilatorController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function register(Request $request){
        $fk_exmTimetbl = $request->input('fk_exmTimetbl');
        $fk_venue = $request->input('fk_venue');
        $fk_lect = $request->input('fk_lect');
        $chief = $request->input('chief');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_exam_invigilator::create([
            'fk_exmTimetbl' => $fk_exmTimetbl,
            'fk_venue' => $fk_venue,
            'fk_lect' => $fk_lect,
            'chief' => $chief,
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


    public function show($id){
        $obj = mis_exam_invigilator::where([['mis_exam_invigilator.pk_id',$id],['mis_exam_invigilator.recordstatus','!=','DEL']])
            ->leftjoin('hrm_emp_info', 'hrm_emp_info.emp_id','=','mis_exam_invigilator.fk_lect')
            ->leftjoin('mis_exam_timetable', 'mis_exam_timetable.pk_id','=','mis_exam_invigilator.fk_exmTimetbl')
            ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id','=','mis_exam_timetable.fk_acaCal')
            ->leftjoin('aca_cal_category', 'aca_cal_category.pk_id','=','mis_prm_calendar.cal_category')
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id','=','mis_exam_timetable.fk_course')
            ->leftjoin('mis_exam_papertype', 'mis_exam_papertype.pk_id','=','mis_exam_timetable.tbl_paper_type')
            ->leftjoin('mis_exam_venue', 'mis_exam_venue.pk_id','=','mis_exam_invigilator.fk_venue')
            ->leftjoin('mis_exam_center', 'mis_exam_center.pk_id','=','mis_exam_venue.fk_center')
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id','=','mis_exam_center.clg_id')
            ->get([
                'mis_exam_invigilator.pk_id AS exmInvgltr_id',
                'mis_prm_calendar.cur_year AS cal_year', 
                'cal_cohort', 
                'cal_category', 
                'category',
                'crs_code',
                'crs_name',
                'paper_type', 
                'tbl_date_start', 
                'tbl_time_start', 
                'tbl_time_end',
                'clg_name',
                'cen_id',
                'fk_exmTimetbl',
                'fk_venue',
                'emp_name'
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function listByExmVenue($id){
        $obj = mis_exam_invigilator::where([['fk_venue',$id],['mis_exam_invigilator.recordstatus','!=','DEL']])
            ->leftjoin('hrm_emp_info', 'hrm_emp_info.emp_id','=','mis_exam_invigilator.fk_lect')
            ->get([
                'pk_id',
                'fk_exmTimetbl',
                'fk_venue',
                'fk_lect',
                'emp_name',
                'chief'
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function chkExmInvgltr(Request $request){
        $fk_exmTimetbl = $request->input('fk_exmTimetbl');
        $fk_lect = $request->input('fk_lect');

        $obj = mis_exam_invigilator::where([
                ['fk_exmTimetbl',$fk_exmTimetbl],
                ['fk_lect',$fk_lect],
                ['recordstatus','!=','DEL']
            ])
            ->get(['pk_id']);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function update(Request $request){
        $pk_id = $request->input('pk_id');
        $chief = $request->input('chief');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_exam_invigilator::where('pk_id',$pk_id) ->update([
            'chief' => $chief,
            'recordstatus' => $recordstatus,
        ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Update Success!',
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


    public function delete(Request $request){
        $pk_id = $request->input('pk_id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_exam_invigilator::where('pk_id',$pk_id) ->update(['recordstatus' => $recordstatus]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Remove Success!',
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


    // list exam timetable by aca_calendar & lecturer
    public function listByCalLect(Request $request){
        $fk_lect = $request->input('fk_lect');
        $cur_year = $request->input('cur_year');
        $curYear = str_replace("-","/",$cur_year);
        $cal_cohort = $request->input('cal_cohort');

        $obj = mis_exam_invigilator::where([
                ['fk_lect',$fk_lect],
                ['mis_prm_calendar.cur_year',$curYear],
                ['cal_cohort',$cal_cohort],
                ['mis_exam_invigilator.recordstatus','!=','DEL'],
                ['mis_exam_timetable.recordstatus','!=','DEL']
            ])
            ->leftjoin('mis_exam_timetable', 'mis_exam_timetable.pk_id','=','mis_exam_invigilator.fk_exmTimetbl')
            ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id','=','mis_exam_timetable.fk_acaCal')
            ->leftjoin('aca_cal_category', 'aca_cal_category.pk_id','=','mis_prm_calendar.cal_category')
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id','=','mis_exam_timetable.fk_course')
            ->leftjoin('mis_exam_papertype', 'mis_exam_papertype.pk_id','=','mis_exam_timetable.tbl_paper_type')
            ->leftjoin('mis_exam_venue', 'mis_exam_venue.pk_id','=','mis_exam_invigilator.fk_venue')
            ->leftjoin('mis_exam_center', 'mis_exam_center.pk_id','=','mis_exam_venue.fk_center')
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id','=','mis_exam_center.clg_id')
            ->leftjoin('mis_exam_type', 'fk_exam_type','=','mis_exam_type.pk_id')
            ->orderBy('tbl_date_start')
            ->orderBy('tbl_time_start')
            
            ->get([
                'mis_exam_invigilator.pk_id AS exmInvgltr_id',
                'mis_prm_calendar.cur_year AS cal_year', 
                'cal_cohort', 
                'cal_category', 
                'category',
                'crs_code',
                'crs_name',
                'paper_type', 
                'tbl_date_start', 
                'tbl_time_start', 
                'tbl_time_end',
                'clg_name',
                'cen_id',
                'fk_exmTimetbl',
                'fk_venue', 'fk_exam_type', 'mis_exam_type.exam_type',
                'mis_exam_invigilator.chief'
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }



    public function CheckInvigilator($fk_exmTimetbl, $fk_venue){
       
        // $fk_exmTimetbl = $request->input('fk_exmTimetbl');
        // $fk_venue = $request->input('fk_venue');

        

    $obj = mis_exam_invigilator::where('fk_exmTimetbl', $fk_exmTimetbl)
    ->where('mis_exam_invigilator.fk_venue', $fk_venue)
    ->where('mis_exam_invigilator.recordstatus', '!=', 'DEL')
    ->leftJoin('hrm_emp_info', 'hrm_emp_info.emp_id', '=', 'mis_exam_invigilator.fk_lect')
    ->get(
        [
        'mis_exam_invigilator.fk_lect',
        'hrm_emp_info.emp_name',
        'mis_exam_invigilator.chief'
    ]
);
        if($obj->isEmpty()){ 
            return response()->json([
                'success'=>false,
                'message'=>'Bad Request',
                'data'=>$obj
            ],400);    }
        else{
            return response()->json([
                'success'=>true,
                'message'=>'Success Load data!',
                'data'=>$obj
            ],201);
   
        }
    }
}
