<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_exam_timetable;

class mis_exam_timetableController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    // add exam timetable
    public function register(Request $request){
        $fk_acaCal = $request->input('fk_acaCal');
        $fk_course = $request->input('fk_course');
        $tbl_paper_type = $request->input('tbl_paper_type');
        $tbl_date_start = $request->input('tbl_date_start');
        $tbl_time_start = $request->input('tbl_time_start');
        $tbl_time_end = $request->input('tbl_time_end');
        $fk_exam_type = $request->input('fk_exam_type');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_exam_timetable::create([
            'fk_acaCal' => $fk_acaCal,
            'fk_course' => $fk_course,
            'tbl_paper_type' => $tbl_paper_type,
            'tbl_date_start' => $tbl_date_start,
            'tbl_time_start' => $tbl_time_start,
            'tbl_time_end' => $tbl_time_end,
            'fk_exam_type' => $fk_exam_type,
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


    // display examination timetable list
    public function list(){
        $obj = mis_exam_timetable::where([['mis_exam_timetable.recordstatus','!=','DEL']])
            ->get([
                'pk_id',
                'fk_cotDet',
                'tbl_paper_type',
                'tbl_date_start',
                'tbl_time_start',
                'tbl_time_end',
                'tbl_venue',
                'tbl_invigilator',
                'tbl_status',
                'tbl_remarks'
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
                'success'=>'false',
                'message'=>'Bad Request',
                'data'=>$obj
            ],400);
        }
    }


    // detail timetable
    public function show($pk_id){
        $obj = mis_exam_timetable::
        SELECT('mis_exam_timetable.pk_id',
        'cur_year','reg_semester',
        'mis_exam_timetable.pgm_id',
        'pgm_name',
        'mis_exam_timetable.crs_code',
        'crs_name',
        'tbl_paper_type',
        'tbl_date_start',
        'tbl_date_end',
        'tbl_time_start',
        'tbl_time_end',
        'tbl_status',
        'tbl_remarks')
            -> join('mis_prm_programme', 'mis_prm_programme.pgm_id', '=', 'mis_exam_timetable.pgm_id')
            -> join('mis_prm_course', 'mis_prm_course.crs_code', '=', 'mis_exam_timetable.crs_code')
            -> where('mis_exam_timetable.pk_id',$pk_id)->first();

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function update(Request $request){
        $pk_id = $request->input('pk_id');
        $tbl_paper_type = $request->input('tbl_paper_type');
        $tbl_date_start = $request->input('tbl_date_start');
        $tbl_time_start = $request->input('tbl_time_start');
        $tbl_time_end = $request->input('tbl_time_end');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_exam_timetable::where('pk_id',$pk_id) ->update([
            'tbl_paper_type' => $tbl_paper_type,
            'tbl_date_start' => $tbl_date_start,
            'tbl_time_start' => $tbl_time_start,
            'tbl_time_end' => $tbl_time_end,
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


    public function delete(Request $request){
        $id = $request->input('pk_id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_exam_timetable::where([['pk_id','=',$id]])-> update(['recordstatus' => $recordstatus]);

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


    // show if course had registered
    public function showByCalCrs(Request $request){
        $fk_acaCal = $request->input('fk_acaCal');
        $fk_course = $request->input('fk_course');

        $obj = mis_exam_timetable::where([
            ['mis_exam_timetable.fk_acaCal', '=', $fk_acaCal],
            ['mis_exam_timetable.fk_course', '=', $fk_course],
            ['mis_exam_timetable.recordstatus', '!=', 'DEL']
        ])
        ->leftJoin('mis_exam_papertype', 'mis_exam_papertype.pk_id', '=', 'mis_exam_timetable.tbl_paper_type')
        ->leftJoin('mis_exam_type', 'mis_exam_type.pk_id', '=', 'mis_exam_timetable.fk_exam_type')
        ->get([
            'mis_exam_timetable.pk_id',
            'mis_exam_timetable.fk_acaCal',
            'mis_exam_timetable.fk_course',
            'mis_exam_timetable.tbl_paper_type',
            'mis_exam_timetable.tbl_date_start',
            'mis_exam_timetable.tbl_time_start',
            'mis_exam_timetable.tbl_time_end',
            'mis_exam_papertype.paper_type',
            'mis_exam_type.exam_type'
        ]);
        

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }

    public function showByCalCrs2(Request $request){
        $fk_acaCal = $request->input('fk_acaCal');
        $fk_course = $request->input('fk_course');
        $pkId = $request->input('pkId');

        $obj = mis_exam_timetable::where([
            ['mis_exam_timetable.fk_acaCal', '=', $fk_acaCal],
            ['mis_exam_timetable.fk_course', '=', $fk_course],
            ['mis_exam_timetable.pk_id', '=', $pkId],
            ['mis_exam_timetable.recordstatus', '!=', 'DEL']
        ])
        ->leftJoin('mis_exam_papertype', 'mis_exam_papertype.pk_id', '=', 'mis_exam_timetable.tbl_paper_type')
        ->get([
            'mis_exam_timetable.pk_id',
            'mis_exam_timetable.fk_acaCal',
            'mis_exam_timetable.fk_course',
            'mis_exam_timetable.tbl_paper_type',
            'mis_exam_timetable.tbl_date_start',
            'mis_exam_timetable.tbl_time_start',
            'mis_exam_timetable.tbl_time_end',
            'mis_exam_papertype.paper_type'
        ]);
        

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }


    // group by semester
    public function groupBySem($id){
        $obj = mis_exam_timetable::select(mis_exam_timetable::raw("distinct(reg_semester) AS reg_semester"))
            ->groupBy('reg_semester')
            ->where([['pgm_id','=',$id],['recordstatus','!=','DEL']]) 
            ->orderBy('reg_semester','asc') 
            ->get();

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // list by program id for each semester
    public function listByPgmSem(Request $request){
        $pgm_id = $request->input('pgm_id');
        $reg_semester = $request->input('reg_semester');

        $obj = mis_exam_timetable::select('mis_exam_timetable.*','crs_name','mis_prm_course.crs_code AS crsCode','cen_id') 
            ->leftjoin('mis_prm_course_cot_det', 'mis_prm_course_cot_det.ccd_id', '=', 'mis_exam_timetable.crs_code')
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_prm_course_cot_det.crs_code')
            ->leftjoin('mis_exam_center', 'mis_exam_center.pk_id', '=', 'mis_exam_timetable.tbl_venue')
            ->where([
                ['mis_exam_timetable.pgm_id',$pgm_id],
                ['mis_exam_timetable.reg_semester',$reg_semester],
                ['mis_exam_timetable.recordstatus','!=','DEL']
            ])->get();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // show exam timetable by cotDet
    public function showByCotDet($id){
        $obj = mis_exam_timetable::where([['fk_cotDet','=',$id],['recordstatus','!=','DEL']])
            ->get([
                'pk_id',
                'tbl_paper_type',
                'tbl_date_start',
                'tbl_time_start',
                'tbl_time_end',
                'tbl_venue',
                'tbl_invigilator'
            ]);

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
                'message'=>'Bad Request',
                'data'=>$obj
            ],400);
        }
    }
}
