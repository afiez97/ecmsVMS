<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_lecturer_course_prm;
use Illuminate\Support\Facades\DB;
// use DB;

class mis_lecturer_course_prmController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function register(Request $request){
        $emp_id = $request->input('emp_id');
        $fk_cotDet = $request->input('fk_cotDet');
        $crs_code = $request->input('crs_code');
        $coordinator = $request->input('coordinator');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_lecturer_course_prm::create([
            'emp_id' => $emp_id,
            'fk_cotDet' => $fk_cotDet,
            'crs_code' => $crs_code,
            'coordinator' => $coordinator,
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
        $obj = mis_lecturer_course_prm::where('mis_lecturer_course_prm.pk_id',$id)
            ->leftjoin('mis_prm_course_cot_det', 'mis_prm_course_cot_det.ccd_id','=','mis_lecturer_course_prm.fk_cotDet')
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_prm_course_cot_det.fk_course')
            ->leftjoin('mis_prm_programme_det', 'mis_prm_programme_det.dtp_id', '=', 'mis_prm_course_cot_det.fk_pgm_det')
            ->leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_prm_programme_det.pgm_id')
            ->leftjoin('hrm_emp_info', 'hrm_emp_info.emp_id','=','mis_lecturer_course_prm.emp_id')
            ->leftjoin('mis_prm_faculty', 'mis_prm_faculty.pk_id', '=', 'mis_prm_programme.fac_id')
            ->leftjoin('category', 'category.id','=','mis_prm_programme.pgm_category')
->leftjoin('mis_prm_cot_sem', 'mis_prm_cot_sem.pk_id', '=', 'mis_prm_course_cot_det.fk_semester')
->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_prm_cot_sem.aca_session')
    //noted nie x ambik by aca category lgi ek
           
    // ->leftJoin('mis_exam_timetable', function ($join) {
    //     $join->on('mis_std_regsubject.crs_code', '=', 'mis_exam_timetable.fk_course')
    //         ->on('mis_std_regsubject.aca_session', '=', 'mis_exam_timetable.fk_acaCal');
    // })
            ->first([
                'mis_lecturer_course_prm.pk_id AS lectCrsId',
                'fk_cotDet',
                'pgm_name',
                'mis_prm_programme.pgm_id AS pgm_code',
                'crs_name',
                'mis_lecturer_course_prm.cur_semester AS curSem',
                'dtp_year',
                'mis_lecturer_course_prm.crs_code AS fk_crs',
                'mis_prm_course.crs_code AS crsCode',
                'cot_semester',
                'fk_course',
                'emp_name',
                'fac_name',
                'coordinator',
                'final_exam',
                //start afiez utk obe 1april
                'category_name',
                'dtp_intake',
                'mis_prm_calendar.cal_id AS fk_acaCal',
                'cot_semester',
                'mis_prm_programme.pk_id AS fk_prm_prog' 

                
            ]);



        if($obj){

            $timetable = DB::table('mis_exam_timetable')
            ->leftJoin('mis_exam_venue', function ($join) {
                $join->on('mis_exam_timetable.pk_id', '=', 'mis_exam_venue.fk_exam')
                    // ->on('mis_std_info.cam_id', '=', 'mis_exam_venue.fk_campus')
                    ;
            })
            ->leftJoin('mis_exam_center', 'mis_exam_center.pk_id', '=', 'mis_exam_venue.fk_center')
            // ->where('mis_exam_timetable.fk_acaCal', $obj->fk_acaCal)
            ->where('mis_exam_timetable.fk_course', $obj->fk_crs)
            ->where('mis_exam_timetable.recordstatus', '!=', 'DEL')
            ->get();
        
        // Add the timetable data to the $obj object
        $obj->timetable = $timetable;
            

//         // Step 1: Check if there's data in mis_exam_venue for the given fk_course
// $venueDataExists = DB::table('mis_exam_venue')
// ->leftJoin('mis_exam_timetable', 'mis_exam_timetable.pk_id', '=', 'mis_exam_venue.fk_exam')
// ->where('mis_exam_timetable.fk_course', $obj->fk_crs)
// ->exists();

// // Step 2: Run the query based on the existence of data in mis_exam_venue
// if ($venueDataExists) {
// // Data exists, include the joins
// $timetable = DB::table('mis_exam_timetable')
//     ->leftJoin('mis_exam_venue', function ($join) {
//         $join->on('mis_exam_timetable.pk_id', '=', 'mis_exam_venue.fk_exam');
//     })
//     ->leftJoin('mis_exam_center', 'mis_exam_center.pk_id', '=', 'mis_exam_venue.fk_center')
//     ->where('mis_exam_timetable.fk_course', $obj->fk_crs)
//     ->where('mis_exam_timetable.recordstatus', '!=', 'DEL')
//     ->get();
// } else {
// // No data in mis_exam_venue, query only mis_exam_timetable
// $timetable = DB::table('mis_exam_timetable')
//     ->where('mis_exam_timetable.fk_course', $obj->fk_crs)
//     ->where('mis_exam_timetable.recordstatus', '!=', 'DEL')
//     ->get();
// }
// $obj->timetable = $timetable;

            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj,
                // 'afiez'=>$timetable
            ],200);
        }
    }


    // list by employee
    public function list($id){
        $obj = mis_lecturer_course_prm::where([['mis_lecturer_course_prm.recordstatus','!=','DEL'],['mis_lecturer_course_prm.emp_id',$id]])
            ->leftjoin('mis_prm_course_cot_det', 'mis_prm_course_cot_det.ccd_id','=','mis_lecturer_course_prm.fk_cotDet')
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_prm_course_cot_det.fk_course')
            ->leftjoin('mis_prm_programme_det', 'mis_prm_programme_det.dtp_id', '=', 'mis_prm_course_cot_det.fk_pgm_det')
            ->leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_prm_programme_det.pgm_id')
            ->get([
                'mis_lecturer_course_prm.pk_id AS lectCrsId',
                'fk_cotDet',
                'pgm_name',
                'mis_prm_programme.pgm_id AS pgm_code',
                'crs_name',
                'mis_lecturer_course_prm.cur_semester AS curSem',
                'dtp_year',
                'mis_lecturer_course_prm.crs_code AS fk_crs',
                'mis_prm_course.crs_code AS crsCode',
                'cot_semester',
                'fk_course',
                'coordinator',
                'final_exam',

            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // update lecturer course
    public function update(Request $request){
        $pk_id = $request->input('pk_id');
        $coordinator = $request->input('coordinator');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_lecturer_course_prm::where('pk_id',$pk_id) ->update([
            'coordinator' => $coordinator,
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


    // delete lecturer course
    public function delete(Request $request){
        $pk_id = $request->input('pk_id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_lecturer_course_prm::where('pk_id',$pk_id) ->update([
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


    // list by employee
    public function listByCotDet($id){
        $obj = mis_lecturer_course_prm::where([
            ['mis_lecturer_course_prm.recordstatus','!=','DEL'], //course offer dia display klau tutup ni
            ['mis_lecturer_course_prm.fk_cotDet',$id]])
           
            ->join('hrm_emp_info', 'hrm_emp_info.emp_id','=','mis_lecturer_course_prm.emp_id')
            ->get([
                'mis_lecturer_course_prm.pk_id AS lectCrsId',
                'mis_lecturer_course_prm.emp_id AS empId',
                'emp_name',
                'coordinator',
                'final_exam',
            ]);

        if(sizeof($obj)>0){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Hapus Gagal!",
                'data'=>''
            ],400);
        }
    }

    // list by employee
    public function listByCotDetForCTE($id, $std_studentid){
        $query = mis_lecturer_course_prm::where([
            ['mis_lecturer_course_prm.recordstatus', '!=', 'DEL'], 
            ['mis_lecturer_course_prm.fk_cotDet', $id]
        ])
        ->join('hrm_emp_info', 'hrm_emp_info.emp_id', '=', 'mis_lecturer_course_prm.emp_id')
        ->leftJoin('picoms_cte_stdFeedback', function ($join) use ($std_studentid) {
            $join->on('picoms_cte_stdFeedback.emp_id', '=', 'mis_lecturer_course_prm.emp_id')
                 ->on('picoms_cte_stdFeedback.fk_cotDet', '=', 'mis_lecturer_course_prm.fk_cotDet')
                 ->where('picoms_cte_stdFeedback.recordstatus', '!=', 'DEL')
                 ->where('picoms_cte_stdFeedback.std_studentid', '=', $std_studentid);
        });

    // Execute the query and get the results
    $obj = $query->get([
        'mis_lecturer_course_prm.pk_id AS lectCrsId',
        'mis_lecturer_course_prm.emp_id AS empId',
        'hrm_emp_info.emp_name',
        'mis_lecturer_course_prm.coordinator',
        'mis_lecturer_course_prm.final_exam',
        'picoms_cte_stdFeedback.pk_cte_feedback', // This will be null if no match is found
    ]);


        if(sizeof($obj)>0){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Hapus Gagal!",
                'data'=>''
            ],400);
        }
    }


        // list by chkAttendance
        // afiez tmbah sni 25april utk sbject no final exam
        public function chkFinalExam($fk_cotDet){
            $obj = mis_lecturer_course_prm::where([
                ['mis_lecturer_course_prm.recordstatus','!=','DEL'], //course offer dia display klau tutup ni
                ['mis_lecturer_course_prm.fk_cotDet',$fk_cotDet]])
                ->join('hrm_emp_info', 'hrm_emp_info.emp_id','=','mis_lecturer_course_prm.emp_id')
                ->first(
                    [
                    'mis_lecturer_course_prm.pk_id AS lectCrsId',
                    'mis_lecturer_course_prm.emp_id AS empId',
                    'emp_name',
                    'coordinator',
                    'final_exam',
                ]
            );
            // dd($obj);
    
            if($obj){
                // if(sizeof($obj)>0){
                return response()->json([
                    'success'=>'true',
                    'message'=>'List Success!',
                    'data'=>$obj
                ],200);
            }
            else{
                return response()->json([
                    'success'=>false,
                    'message'=>"Hapus Gagal!",
                    'data'=>''
                ],400);
            }
        }
    

    // find id if existed
    public function findId(Request $request){
        $emp_id = $request->input('emp_id');
        $fk_cotDet = $request->input('fk_cotDet');

        $obj = mis_lecturer_course_prm::where([['emp_id',$emp_id],['fk_cotDet',$fk_cotDet],['recordstatus', '!=', 'DEL']]) ->get(['pk_id']);

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


    // list by employee group by course
    public function listCourse($id){       
        // $obj = mis_lecturer_course_prm::where([['mis_lecturer_course_prm.recordstatus','!=','DEL'],['mis_lecturer_course_prm.emp_id',$id]])
        //     ->leftjoin('mis_prm_course_cot_det', 'mis_prm_course_cot_det.ccd_id','=','mis_lecturer_course_prm.fk_cotDet')
        //     ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_prm_course_cot_det.fk_course')
        //     ->leftjoin('mis_prm_programme_det', 'mis_prm_programme_det.dtp_id', '=', 'mis_prm_course_cot_det.fk_pgm_det')
        //     ->leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_prm_programme_det.pgm_id')
        //     ->groupBy('mis_lecturer_course_prm.crs_code') 
        //     ->get([
        //         'mis_lecturer_course_prm.pk_id AS lectCrsId',
        //         'fk_cotDet',
        //         'pgm_name',
        //         'mis_prm_programme.pgm_id AS pgm_code',
        //         'crs_name',
        //         'mis_lecturer_course_prm.cur_semester AS curSem',
        //         'dtp_year',
        //         'mis_lecturer_course_prm.crs_code AS fk_crs',
        //         'mis_prm_course.crs_code AS crsCode',
        //         'cot_semester',
        //         'fk_course',
        //         'coordinator'
        //     ]);

            $obj = DB::table('mis_lecturer_course_prm')
                ->selectRaw('MAX(mis_lecturer_course_prm.pk_id) AS lectCrsId')
                ->addSelect('fk_cotDet', 'pgm_name', 'mis_prm_programme.pgm_id AS pgm_code', 'crs_name')
                ->addSelect('mis_lecturer_course_prm.cur_semester AS curSem', 'dtp_year', 'mis_lecturer_course_prm.crs_code AS fk_crs')
                ->addSelect('mis_prm_course.crs_code AS crsCode', 'cot_semester', 'fk_course', 'coordinator')
                ->leftJoin('mis_prm_course_cot_det', 'mis_prm_course_cot_det.ccd_id', '=', 'mis_lecturer_course_prm.fk_cotDet')
                ->leftJoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_prm_course_cot_det.fk_course')
                ->leftJoin('mis_prm_programme_det', 'mis_prm_programme_det.dtp_id', '=', 'mis_prm_course_cot_det.fk_pgm_det')
                ->leftJoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_prm_programme_det.pgm_id')
                ->where('mis_lecturer_course_prm.recordstatus', '!=', 'DEL')
                ->where('mis_lecturer_course_prm.emp_id', $id)
                ->groupBy('fk_cotDet', 'pgm_name', 'mis_prm_programme.pgm_id', 'crs_name', 'mis_lecturer_course_prm.cur_semester')
                ->groupBy('dtp_year', 'mis_lecturer_course_prm.crs_code', 'mis_prm_course.crs_code', 'cot_semester', 'fk_course', 'coordinator')
                ->get();

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // list by course group by lecturer
    public function crsGrpbyLect($id){
        // $obj = mis_lecturer_course_prm::groupBy('emp_id') 
        //     ->where([['mis_lecturer_course_prm.recordstatus','!=','DEL'],['crs_code',$id]])
        //     ->leftjoin('hrm_emp_info', 'hrm_emp_info.emp_id','=','mis_lecturer_course_prm.emp_id')
        //     ->get([
        //         'mis_lecturer_course_prm.emp_id',
        //         'emp_name',
        //     ]);

        $obj = DB::table('mis_lecturer_course_prm')
            ->select('mis_lecturer_course_prm.emp_id', 'hrm_emp_info.emp_name')
            ->leftJoin('hrm_emp_info', 'hrm_emp_info.emp_id', '=', 'mis_lecturer_course_prm.emp_id')
            ->where('mis_lecturer_course_prm.recordstatus', '!=', 'DEL')
            ->where('crs_code', $id)
            ->groupBy('mis_lecturer_course_prm.emp_id')
            ->get();


        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // list by Staff & Academic Calendar
    public function listAcaCalLect(Request $request){
        $cur_year = $request->input('cur_year');
        $curYear = str_replace("-","/",$cur_year);
        $cal_cohort = $request->input('cal_cohort');
        $emp_id = $request->input('emp_id');

        $obj = mis_lecturer_course_prm::where([
                ['mis_lecturer_course_prm.recordstatus','!=','DEL'],
                ['mis_lecturer_course_prm.emp_id',$emp_id],
                ['mis_prm_calendar.cur_year', $cur_year],
                ['cal_cohort',$cal_cohort]
            ])
            ->leftjoin('mis_prm_course_cot_det', 'mis_prm_course_cot_det.ccd_id','=','mis_lecturer_course_prm.fk_cotDet')
            ->leftjoin('mis_prm_cot_sem', 'mis_prm_cot_sem.pk_id', '=', 'mis_prm_course_cot_det.fk_semester')
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_prm_course_cot_det.fk_course')
            ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_prm_cot_sem.aca_session')
            ->leftjoin('aca_cal_category', 'aca_cal_category.pk_id', '=', 'mis_prm_calendar.cal_category')
            ->where('mis_prm_course.recordstatus','!=','DEL')
            ->groupBy('mis_lecturer_course_prm.pk_id','crs_name',
            'fk_cotDet',
            'mis_lecturer_course_prm.crs_code',
            'mis_prm_course.crs_code',
            'fk_course',
            'coordinator',
            'mis_prm_calendar.cur_year',
            'cal_cohort', 
            'cal_category', 
            'category',
            'mis_prm_calendar.cal_status',
            'aca_session')
            ->orderBy('mis_prm_course.crs_code','ASC')
            ->orderBy('cal_category','ASC')
            // ->groupBy('fk_course')
            ->get([
                'mis_lecturer_course_prm.pk_id AS lectCrsId',
                'fk_cotDet',
                'crs_name',
                'mis_lecturer_course_prm.crs_code AS fk_crs',
                'mis_prm_course.crs_code AS crsCode',
                'fk_course',
                'coordinator',
                'mis_prm_calendar.cur_year AS cal_year',
                'cal_cohort', 
                'cal_category', 
                'category',
                'aca_session',
                'mis_prm_calendar.cal_status',

                // DB::raw('COUNT(*)')
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }

    public function uptFinalExam(Request $request){
        $pk_id = $request->input('crs_lectId');
        $final_exam = $request->input('final_exam');
        $obj = mis_lecturer_course_prm::where('pk_id',$pk_id)
        ->update(['final_exam' => $final_exam]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Update Success!',
                'data'=>$obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Update Failed!",
                'data'=>''
            ],400);
        }
    }
}
