<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_exam_student;
use Illuminate\Support\Facades\DB;



class mis_exam_studentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function register(Request $request){
        $fk_exam = $request->input('fk_exam');
        $fk_stdRegCrs = $request->input('fk_stdRegCrs');
        $std_studentid = $request->input('std_studentid');
        $est_tableno = $request->input('est_tableno');
        $fk_exam_application = $request->input('fk_exam_application');
        $cur_year = $request->input('cur_year');
        $crs_code = $request->input('crs_code');
        $attendance = $request->input('attendance');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_exam_student::create([
            'fk_exam' => $fk_exam,
            'fk_stdRegCrs' => $fk_stdRegCrs,
            'std_studentid' => $std_studentid,
            'est_tableno' => $est_tableno,
            'fk_exam_application' => $fk_exam_application,
            'cur_year' => $cur_year,
            'crs_code' => $crs_code,
            'attendance' => $attendance,
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


    // list student by exam date
    public function listByExam($id){
        $obj = mis_exam_student::where([['mis_exam_student.fk_exam',$id],
        ['mis_exam_student.recordstatus','!=','DEL'],
        ['mis_std_regsubject.barr_status','!=','Barred'],
        ])
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid','=','mis_exam_student.std_studentid')
            ->leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id','=','mis_std_info.pgm_fk')
            ->leftjoin('mis_exam_venue', 'mis_exam_venue.pk_id','=','mis_exam_student.fk_venue')
            ->leftjoin('mis_exam_center', 'mis_exam_center.pk_id','=','mis_exam_venue.fk_center')
            ->leftjoin('mis_exam_application', 'mis_exam_application.rsb_id','=','mis_exam_student.fk_stdRegCrs')
            ->leftjoin('mis_std_regsubject', 'mis_std_regsubject.rsb_id','=','mis_exam_student.fk_stdRegCrs')
            // ->where('mis_exam_application.recordstatus', '!=', 'DEL')
            ->where(function($query) {
                $query->where('mis_exam_application.recordstatus', '!=', 'DEL')
                      ->orWhereNull('mis_exam_application.recordstatus');
            })
            ->orderBy('std_id')
            ->get(
                [
                'mis_exam_student.pk_id AS tblNo_id',
                'mis_exam_student.std_studentid AS std_id',
                'sti_name',
                'mis_prm_programme.pgm_id AS pgmCode',
                'est_tableno',
                'attendance',
                'fk_stdRegCrs',
                'cen_id',
                'mis_exam_application.pk_id AS fk_applicationExam',
                'mis_exam_application.app_type',
                'barr_status',
                
            ]
        );

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }


    // list student by exam date
    public function listByExam_resit($id){
        $obj = mis_exam_student::where([['mis_exam_student.fk_exam',$id],
        ['mis_exam_student.recordstatus','!=','DEL'],
        ['mis_exam_application.app_type','!=','RE-CHECK'],
        ['mis_exam_application.app_status','!=','Reject'],
        ['mis_exam_application.recordstatus','!=','DEL']
        ])
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid','=','mis_exam_student.std_studentid')
            ->leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id','=','mis_std_info.pgm_fk')
            ->leftjoin('mis_exam_venue', 'mis_exam_venue.pk_id','=','mis_exam_student.fk_venue')
            ->leftjoin('mis_exam_center', 'mis_exam_center.pk_id','=','mis_exam_venue.fk_center')
            ->leftjoin('mis_exam_application', 'mis_exam_application.rsb_id','=','mis_exam_student.fk_stdRegCrs')
            ->orderBy('std_id')
            ->get([
                'mis_exam_student.pk_id AS tblNo_id',
                'mis_exam_student.std_studentid AS std_id',
                'sti_name',
                'mis_prm_programme.pgm_id AS pgmCode',
                'est_tableno',
                'attendance',
                'fk_stdRegCrs',
                'cen_id',
                'mis_exam_application.pk_id AS fk_applicationExam',
                
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }


    // update status to DELETE
    public function uptStatus(Request $request){
        $pk_id = $request->input('pk_id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_exam_student::where([['pk_id','=',$pk_id]]) ->update([
            'recordstatus' => $recordstatus,
        ]);

        if ($obj){
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


    // update Attendance Student
    public function uptAttndnc(Request $request){
        $pk_id = $request->input('pk_id');
        $attendance = $request->input('attendance');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_exam_student::where([['pk_id','=',$pk_id]]) ->update([
            'attendance' => $attendance,
            'recordstatus' => $recordstatus,
        ]);

        if ($obj){
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


    // check if student exist
    public function chkStdExist($id){
        $obj = mis_exam_student::where([['fk_stdRegCrs','=',$id]]) ->get(['pk_id']);

        if($obj){
            return response()->json([
                'success'=>true,
                'message'=>"Success!",
                'data' => $obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"No Data!",
                'data'=>''
            ],404);
        }
    }


    // update table no. & venue when generate venue
    public function uptTblNo(Request $request){
        $pk_id = $request->input('pk_id');
        $fk_venue = $request->input('fk_venue');
        $fk_center = $request->input('fk_center');
        $est_tableno = $request->input('est_tableno');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_exam_student::where([['pk_id','=',$pk_id]]) ->update([
            'pk_id' => $pk_id,
            'fk_venue' => $fk_venue,
            'fk_center' => $fk_center,
            'est_tableno' => $est_tableno,
            'recordstatus' => $recordstatus
        ]);

        if($obj){
            return response()->json([
                'success'=>true,
                'message'=>"Success!",
                'data' => $obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Failed!",
                'data'=>''
            ],404);
        }
    }


    // check if venue exist for same datetime
    public function chkExist(Request $request){
        $fk_exam = $request->input('fk_exam');
        $fk_venue = $request->input('fk_venue');
        $exam_date = $request->input('exam_date');
        $exam_startTime = $request->input('exam_startTime');
        $exam_endTime = $request->input('exam_endTime');

        $obj = mis_exam_student::where([
                ['fk_exam','!=',$fk_exam],
                ['fk_center','=',$fk_venue],
                ['tbl_date_start','=',$exam_date],
                ['tbl_time_start','=',$exam_startTime],
                // ['tbl_time_end','>=',$exam_endTime],
                ['mis_exam_student.recordstatus','!=','DEL'],
            ])
            ->leftjoin('mis_exam_timetable', function ($join) {
                $join->on('mis_exam_timetable.pk_id', '=', 'mis_exam_student.fk_exam')
                    ->where('mis_exam_timetable.recordstatus', '!=', 'DEL');
            })
            // ->leftjoin('mis_exam_timetable', 'mis_exam_timetable.pk_id','=','mis_exam_student.fk_exam')
            ->orderBy('mis_exam_student.est_tableno')
            ->get([
                'mis_exam_student.pk_id AS exmStd_id',
                'mis_exam_student.fk_exam AS exam_id',
                // 'mis_exam_student.est_tableno'
                // \DB::raw('CAST(TRIM(LEADING "0" FROM mis_exam_student.est_tableno) AS UNSIGNED) AS est_tableno') //AFIEZ UBAH 15 MEI SBAB NAK BUANG MERAH
                DB::raw('CAST(TRIM(LEADING "0" FROM mis_exam_student.est_tableno) AS UNSIGNED) AS est_tableno')

            ]);

        if($obj){
            return response()->json([
                'success'=>true,
                'message'=>"Success",
                'data' => $obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Fail",
                'data'=>''
            ],401);
        }
    }


    // reset table no. 
    public function resetTblNo(Request $request){
        $pk_id = $request->input('pk_id');
        $fk_venue = $request->input('fk_venue');
        $fk_center = $request->input('fk_center');
        $est_tableno = $request->input('est_tableno');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_exam_student::where([['pk_id','=',$pk_id]]) ->update([
            'pk_id' => $pk_id,
            'fk_venue' => $fk_venue,
            'fk_center' => $fk_center,
            'est_tableno' => $est_tableno,
            'recordstatus' => $recordstatus
        ]);

        if($obj){
            return response()->json([
                'success'=>true,
                'message'=>"Success!",
                'data' => $obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Failed!",
                'data'=>''
            ],404);
        }
    }


    // list student by exam & venue
    public function listByExamVenue(Request $request){
        $fk_exam = $request->input('fk_exam');
        $fk_venue = $request->input('fk_venue');

        $obj = mis_exam_student::where([
                ['mis_exam_student.fk_exam',$fk_exam],
                ['mis_exam_student.fk_venue',$fk_venue],
                ['mis_exam_student.recordstatus','!=','DEL']
                ,
                ['mis_std_regsubject.recordstatus','!=','DEL']
            ])
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid','=','mis_exam_student.std_studentid')
            ->leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id','=','mis_std_info.pgm_fk')
            ->leftjoin('mis_exam_venue', 'mis_exam_venue.pk_id','=','mis_exam_student.fk_venue')
            ->leftjoin('mis_exam_center', 'mis_exam_center.pk_id','=','mis_exam_venue.fk_center')
            ->leftjoin('mis_std_regsubject', 'mis_std_regsubject.rsb_id','=','mis_exam_student.fk_stdRegCrs')
            ->orderBy('std_id')
            ->get([
                'mis_exam_student.pk_id AS tblNo_id',
                'mis_exam_student.std_studentid AS std_id',
                'sti_name',
                'mis_prm_programme.pgm_id AS pgmCode',
                'est_tableno',
                'attendance',
                'fk_stdRegCrs',
                'cen_id'
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }

    public function attendanceListCrs(Request $request){
        $fk_course = $request->input('fk_course');
        $fk_acaCal = $request->input('fk_acaCal');

        $obj = mis_exam_student::join('mis_exam_timetable','mis_exam_timetable.pk_id','=','mis_exam_student.fk_exam')
      ->leftjoin('mis_exam_type','mis_exam_type.pk_id','=','mis_exam_timetable.fk_exam_type')
        ->where('mis_exam_student.recordstatus','!=','DEL')
        ->where('fk_course',$fk_course)
        ->where('fk_acaCal',$fk_acaCal)
         ->where('mis_exam_timetable.recordstatus','!=','DEL')
        ->orderBy('tbl_paper_type','ASC')
        ->get([
            'mis_exam_student.pk_id',
            'mis_exam_student.std_studentid',
            'tbl_paper_type',
            'attendance',
            'mis_exam_timetable.fk_course',
            'mis_exam_timetable.fk_exam_type',
            'mis_exam_type.exam_type',
            'mis_exam_student.fk_exam_application',
            
        ]);

        if(sizeof($obj) > 0){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>'false',
                'message'=>'Show Failed!',
                'data'=>$obj
            ],200);            
        }
    }

    public function attendanceStdCrs(Request $request){
        $std_studentid = $request->input('std_studentid');

        $obj = mis_exam_student::join('mis_exam_timetable','mis_exam_timetable.pk_id','=','mis_exam_student.fk_exam')
        ->where('mis_exam_student.recordstatus','!=','DEL')
        ->where('mis_exam_student.std_studentid',$std_studentid)
        ->where('mis_exam_timetable.recordstatus','!=','DEL')
        ->orderBy('tbl_paper_type','ASC')
        ->get([
            'mis_exam_student.pk_id',
            'mis_exam_student.std_studentid',
            'tbl_paper_type',
            'attendance',
            'mis_exam_timetable.fk_course',
            // 'mis_exam_student.fk_stdRegCrs' 

        ]);

        if(sizeof($obj) > 0){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>'false',
                'message'=>'Show Failed!',
                'data'=>$obj
            ],200);            
        }
    }


    public function stdAttendanceByCrsReg(Request $request){
        $rsb_id = $request->input('rsb_id');

        $obj = mis_exam_student::join('mis_exam_timetable','mis_exam_timetable.pk_id','=','mis_exam_student.fk_exam')
        ->where('mis_exam_student.recordstatus','!=','DEL')
        ->where('mis_exam_student.fk_stdRegCrs',$rsb_id)
        ->where('mis_exam_timetable.recordstatus','!=','DEL')
        ->orderBy('tbl_paper_type','ASC')
        ->get([
            'mis_exam_student.pk_id',
            'mis_exam_student.std_studentid',
            'tbl_paper_type',
            'attendance',
            'mis_exam_timetable.fk_course'
        ]);

        if(sizeof($obj) > 0){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>'false',
                'message'=>'Show Failed!',
                'data'=>$obj
            ],200);            
        }
    }



    // check if student exist
    public function chkStdAttExam($rsb){
        $obj = mis_exam_student::
        where([['fk_stdRegCrs','=',$rsb]
        // ,['recordstatus','!=','DEL']
        ]) 
        // ->where('mis_exam_student.recordstatus', '!=', 'DEL')
        // ->get(['pk_id']);
        ->first();
        
        if($obj){
            return response()->json([
                'success'=>true,
                'message'=>"Success!",
                'data' => $obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"No Data!",
                'data'=>''
            ],404);
        }
    }
}
