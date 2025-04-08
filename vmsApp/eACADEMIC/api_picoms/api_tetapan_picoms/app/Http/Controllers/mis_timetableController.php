<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_timetable;

class mis_timetableController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function register(Request $request){
        $upload_jadual = '';
        if($request->hasFile('upload_jadual')){
            $file = $request->file('upload_jadual');
            $upload_jadual = time() . $file->getClientOriginalName();
            $file->move('upload_jadual', $upload_jadual);
        }

        $cur_year = $request->input('cur_year');
        $tmt_type = $request->input('tmt_type');
        $fk_course = $request->input('fk_course');
        $clg_id = $request->input('clg_id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_timetable::create([
            'cur_year' => $cur_year,
            'tmt_type' => $tmt_type,
            'fk_course' => $fk_course,
            'clg_id' => $clg_id,
            'upload_jadual' => $upload_jadual,
            'recordstatus' => $recordstatus,
        ]);

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


    public function list(){
        $obj = mis_timetable::where('mis_timetable.recordstatus','!=','DEL')
            ->leftjoin('mis_prm_course','mis_prm_course.pk_id','=','mis_timetable.fk_course')
            ->get([
                'mis_timetable.pk_id AS timetblId',
                'tmt_type',
                'crs_name',
                'upload_jadual'
            ]);

        if ($obj){
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


    public function update(Request $request){
        // upload file
        $uptUpload = $request->input('exist_upload_jadual');
        if($request->hasFile('upload_jadual')){
            $fileProp = $request->file('upload_jadual');
            $uptUpload = time() . $fileProp->getClientOriginalName();
            $fileProp->move('upload_jadual', $uptUpload);
        }

        $pk_id = $request->input('pk_id');
        $cur_year = $request->input('cur_year');
        $tmt_type = $request->input('tmt_type');
        $fk_course = $request->input('fk_course');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_timetable::where('pk_id',$pk_id) -> update([
            'cur_year' => $cur_year,
            'tmt_type' => $tmt_type,
            'fk_course' => $fk_course,
            'upload_jadual' => $uptUpload,
            'recordstatus' => $recordstatus,
        ]);

        if ($obj){
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


    public function listByType($id){
        $obj = mis_timetable::where([['mis_timetable.recordstatus','!=','DEL'],['tmt_type','=',$id]])
            ->leftjoin('mis_prm_course','mis_prm_course.pk_id','=','mis_timetable.fk_course')
            ->get([
                'mis_timetable.pk_id AS timetblId',
                'tmt_type',
                'crs_name',
                'upload_jadual',
                'fk_course'
            ]);

        if ($obj){
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


    public function delete(Request $request){
        $id = $request->input('pk_id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_timetable::where([['pk_id','=',$id]])-> update([
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


    // list by Year
    public function tblByYear($id){
        $cur_year = str_replace("-","/",$id);

        $obj = mis_timetable::where([['mis_timetable.recordstatus','!=','DEL'],['cur_year','=',$cur_year]])
            ->leftjoin('mis_prm_course','mis_prm_course.pk_id','=','mis_timetable.fk_course')
            ->get([
                'mis_timetable.pk_id AS timetblId',
                'tmt_type',
                'crs_name',
                'upload_jadual',
                'fk_course',
                'cur_year'
            ]);

        if ($obj){
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

    public function listTimeTableByLecturerCalendarId(Request $request){
        $fk_lecturer = $request->input('empId');
        $fk_course = $request->input('fk_course');
        $fk_acaCal = $request->input('acaCal');

        $obj = mis_timetable::leftjoin('mis_timetbl_det','mis_timetbl_det.fk_timetbl','=','mis_timetable.pk_id')->
            leftjoin('mis_prm_locations','mis_prm_locations.loc_id','=','mis_timetbl_det.fk_location')->
            leftjoin('sad_users','sad_users.usr_id','=','mis_timetbl_det.fk_lecturer')->
            leftjoin('mis_prm_course','mis_prm_course.pk_id','=','mis_timetable.fk_course')->
            leftjoin('mis_prm_calendar','mis_prm_calendar.cal_id','=','mis_timetable.fk_acaCal')->
            where(
                ['fk_lecturer',$fk_lecturer],
                ['fk_course',$fk_course],
                ['fk_acaCal',$fk_acaCal],
                ['mis_timetable','!=','DEL'],
                ['mis_timetbl_det','!=','DEL']
            )->
            get(
                'sad_users.usr_name as lecturer_name',
                'mis_prm_course.crs_code as course_code',
                'mis_prm_course.crs_name as course_name',
                'mis_prm_course.crs_credit as course_credit',
                'mis_prm_calendar.cur_year as session',
                'mis_prm_calendar.cal_cohort as sem',
                'mis_timetbl_det.tmt_day as day',
                'mis_timetbl_det.tmt_slot as slot',
                'mis_prm_locations.loc_name as venue',
                'mis_timetbl_det.tmt_starttime as start_time',
                'mis_timetbl_det.tmt_endtime as end_time',
            );

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
                'message'=>"No data found",
                'data'=>''
            ],404);
        }
    }
}
