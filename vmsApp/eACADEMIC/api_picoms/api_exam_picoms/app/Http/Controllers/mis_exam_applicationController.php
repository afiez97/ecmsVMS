<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_exam_application;

class mis_exam_applicationController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }


    public function register(Request $request){

        $student_id = $request->input('student_id');
        $fk_course = $request->input('fk_course');
        $app_type = $request->input('app_type');
        $app_reason = $request->input('app_reason');
        $app_status = $request->input('app_status');
    $rsb_id = $request->input('rsb_id');
        $recordstatus = $request->input('recordstatus');



        $existingRecord = mis_exam_application::where('rsb_id', $rsb_id)
    ->where('recordstatus', '!=', 'DEL')
    ->exists();


    // dd($existingRecord);


// If no existing record found, create a new one
if (!$existingRecord) {



    $obj = mis_exam_application::create([
        'student_id' => $student_id,
        'fk_course' => $fk_course,
        'rsb_id' => $rsb_id,
        'app_type' => $app_type,
        'app_reason' => $app_reason,
        'app_status' => $app_status,
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
            'message'=>'Register Failed',
            'data'=>''
        ],400);
    }



} else {
    return response()->json([
        'success'=>'false',
        'message'=>'Already Register',
        'data'=>''
    ],400);
}


    }

    public function registerRecheckResit(Request $request){
        $student_id = $request->input('student_id');
        $fk_course = $request->input('fk_course');
        $app_type = $request->input('app_type');
        $app_reason = $request->input('app_reason');
        $app_status = $request->input('app_status');
        $recordstatus = $request->input('recordstatus');
        $rsb_id = $request->input('rsb_id');

        $app_upload = '';
        if($request->hasFile('app_upload')){
            $file = $request->file('app_upload');
            $app_upload = time() . $file->getClientOriginalName();
            $file->move('upload_application', $app_upload);
        }


        $deleteOld = mis_exam_application::where('rsb_id', $rsb_id)->update([
            'recordstatus' => 'DEL',
        ]);
        


        $obj = mis_exam_application::create([
            'student_id' => $student_id,
            'fk_course' => $fk_course,
            'app_type' => $app_type,
            'app_reason' => $app_reason,
            'app_status' => $app_status,
            'recordstatus' => $recordstatus,
            'rsb_id' => $rsb_id,
            'app_upload' => $app_upload,
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
        $obj = mis_exam_application::where([['mis_exam_application.recordstatus','!=','DEL']])
        ->leftjoin('mis_std_regsubject', 'mis_std_regsubject.rsb_id', '=', 'mis_exam_application.rsb_id')
        ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id','=','mis_exam_application.fk_course')
        ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_regsubject.aca_session')
        -> orderByRaw("FIELD(mis_exam_application.app_status , 'In Progress', 'Approved', 'Completed', 'Reject') ASC")
        ->orderByRaw("SUBSTRING_INDEX(mis_prm_calendar.cur_year, '/', -1) DESC")
        ->orderBy('cal_cohort', 'DESC')
        // ->orderBy('mis_exam_application.lastupdateon', 'DESC')
        ->get([
                'mis_exam_application.pk_id AS app_id',
                'mis_prm_course.crs_code',
                'mis_prm_course.crs_name',
                'mis_exam_application.app_type',
                'mis_exam_application.app_status',
                'mis_exam_application.student_id',
                'mis_exam_application.rsb_id',
                
                'mis_prm_course.pk_id as fk_prm_course',
                'mis_prm_calendar.cur_year AS acaYear',
                'cal_cohort',
            ]);
        // dd($obj);
        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // public function list(){
    //     $obj = mis_exam_application::where([['mis_exam_application.recordstatus','!=','DEL']
    //     , ['mis_exam_type.exam_type','!=','FINAL EXAMINATION'] 
    //     , ['mis_exam_student.recordstatus','!=','DEL']
    //     ])
    //     ->leftjoin('mis_std_regsubject', 'mis_std_regsubject.rsb_id', '=', 'mis_exam_application.rsb_id')
    //     ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id','=','mis_exam_application.fk_course')
    //     ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_regsubject.aca_session')

    //     ->leftjoin('mis_exam_student', 'mis_exam_student.fk_stdRegCrs', '=', 'mis_exam_application.rsb_id')
    //     ->leftjoin('mis_exam_timetable', 'mis_exam_student.fk_exam', '=', 'mis_exam_timetable.pk_id')
    //     ->leftjoin('mis_exam_type', 'mis_exam_timetable.fk_exam_type', '=', 'mis_exam_type.pk_id')
    //     -> orderByRaw("FIELD(mis_exam_application.app_status , 'In Progress', 'Approved', 'Completed', 'Reject') ASC")
    //     ->orderBy('mis_exam_application.lastupdateon', 'DESC')
    //     ->get([
    //             'mis_exam_application.pk_id AS app_id',
    //             'mis_prm_course.crs_code',
    //             'mis_prm_course.crs_name',
    //             'mis_exam_application.app_type',
    //             'mis_exam_application.app_status',
    //             'mis_exam_application.student_id',
    //             'mis_exam_application.rsb_id',
                
    //             'mis_prm_course.pk_id as fk_prm_course',
    //             'mis_prm_calendar.cur_year AS acaYear',
    //             'cal_cohort',
    //             'mis_exam_student.fk_exam', 'mis_exam_student.est_tableno','mis_exam_type.exam_type'
    //         ]);
    //     // dd($obj);
    //     if ($obj){
    //         return response()->json([
    //             'success'=>'true',
    //             'message'=>'List Success!',
    //             'data'=>$obj
    //         ],200);
    //     }
    // }


    public function show($id){
        $obj = mis_exam_application::where('mis_exam_application.pk_id',$id)
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id','=','mis_exam_application.fk_course')
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid','=','mis_exam_application.student_id')
            ->leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id','=','mis_std_info.pgm_fk')
            ->first([
                'mis_exam_application.pk_id AS app_id',
                'crs_code',
                'crs_name',
                'app_type',
                'app_status',
                'app_reason',
                'student_id',
                'mis_prm_programme.pgm_id AS pgm_code',
                'pgm_name',
                'cur_intake',
                'sti_icno',
                'sti_name',
                'sti_contactno_mobile',
                'fk_course',
                'school_name',
                'school_date',
                'school_status',
                'fnnceDep_name',
                'fnnceDep_date',
                'fnnceDep_receipt',
                'fnnceDep_status',
                'exmUnit_name',
                'exmUnit_date',
                'exmUnit_status',
                'mis_exam_application.FK_hod',
                'mis_exam_application.date_update',
                'mis_exam_application.app_upload',
            ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function update(Request $request){
        $pk_id = $request->input('pk_id');
        $student_id = $request->input('student_id');
        $fk_course = $request->input('fk_course');
        $app_type = $request->input('app_type');
        $app_reason = $request->input('app_reason');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_exam_application::where('pk_id',$pk_id) ->update([
            'student_id' => $student_id,
            'fk_course' => $fk_course,
            'app_type' => $app_type,
            'app_reason' => $app_reason,
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


    // update status School
    public function uptSttsSchool(Request $request){
        $pk_id = $request->input('pk_id');
        // $school_name = $request->input('school_name');
        // $school_date = $request->input('school_date');
        $school_status = $request->input('school_status');
        $app_status = $request->input('app_status');
        $recordstatus = $request->input('recordstatus');
        $app_type = $request->input('app_type');

        $FK_hod = $request->input('FK_hod');
        $date_update = $request->input('date_update');

        $obj = mis_exam_application::where('pk_id',$pk_id) ->update([
            // 'school_name' => $school_name,
            // 'school_date' => $school_date,
            'school_status' => $school_status,
            'app_status' => $app_status,
            'recordstatus' => $recordstatus,
            'app_type' => $app_type,

            'FK_hod' => $FK_hod,
            'date_update' => $date_update,
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


    // update status Finance Department
    public function uptSttsFnncDep(Request $request){
        $pk_id = $request->input('pk_id');
        $fnnceDep_name = $request->input('fnnceDep_name');
        $fnnceDep_date = $request->input('fnnceDep_date');
        $fnnceDep_receipt = $request->input('fnnceDep_receipt');
        $fnnceDep_status = $request->input('fnnceDep_status');
        $app_status = $request->input('app_status');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_exam_application::where('pk_id',$pk_id) ->update([
            'fnnceDep_name' => $fnnceDep_name,
            'fnnceDep_date' => $fnnceDep_date,
            'fnnceDep_receipt' => $fnnceDep_receipt,
            'fnnceDep_status' => $fnnceDep_status,
            'app_status' => $app_status,
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


    // update status Exam Unit
    public function uptSttsExmUnit(Request $request){
        $pk_id = $request->input('pk_id');
        $exmUnit_name = $request->input('exmUnit_name');
        $exmUnit_date = $request->input('exmUnit_date');
        $exmUnit_status = $request->input('exmUnit_status');
        $app_status = $request->input('app_status');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_exam_application::where('pk_id',$pk_id) ->update([
            'exmUnit_name' => $exmUnit_name,
            'exmUnit_date' => $exmUnit_date,
            'exmUnit_status' => $exmUnit_status,
            'app_status' => $app_status,
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


    public function delete(Request $request){
        $id = $request->input('pk_id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_exam_application::where([['pk_id','=',$id]])-> update([
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




    // update status School
    public function updCompleted(Request $request){
        $pk_id = $request->input('pk_id');


        $obj = mis_exam_application::where('pk_id',$pk_id) ->update([
            'app_status' => 'Completed',
            'date_update' => date('Y-m-d H:i:s'),
            'recordstatus' => 'EDT',

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

   // update status School
   public function updReset(Request $request){
    $pk_id = $request->input('pk_id');


    $obj = mis_exam_application::where('pk_id',$pk_id) ->update([
        'app_status' => 'Approved',
        'date_update' => date('Y-m-d H:i:s'),
        'recordstatus' => 'EDT',

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

    
}
