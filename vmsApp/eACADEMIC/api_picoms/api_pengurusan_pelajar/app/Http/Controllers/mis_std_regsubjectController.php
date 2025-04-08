<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_std_regsubject;
use App\Models\mis_atd_week;
use App\Models\mis_atd_attendance;
use App\Models\mis_std_info;
use App\Models\mis_prm_calendar;
use App\Models\mis_exam_timetable;
use App\Models\mis_exam_student;
use App\Models\mis_timetable;
use App\Models\mis_prm_course;
use App\Models\mis_timetbl_det;

use App\Models\log;

// use DB;
use Illuminate\Support\Facades\DB;

class mis_std_regsubjectController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    //function log
    private function logAudit($data){
        $obj = log::create($data);
    }
    
    public function register(Request $request)
    {
        $std_studentid = $request->input('std_studentid');
        $fk_cotDet = $request->input('fk_cotDet');
        $cur_year = $request->input('cur_year');
        $reg_semester = $request->input('reg_semester');
        $crs_code = $request->input('crs_code');
        $rsb_type = $request->input('rsb_type');
        $rsb_status = $request->input('rsb_status');
        $aca_session = $request->input('aca_session');
        $recordstatus = $request->input('recordstatus');

        if ($rsb_type != "RC") {
            $rsb_type = "N";
        }


        $objChecking = mis_std_regsubject::where([['std_studentid', '=', $std_studentid],['crs_code', '=', $crs_code],['rsb_status', '!=', 'Drop'],['aca_session', '=', $aca_session], ['mis_std_regsubject.recordstatus', '!=', 'DEL']])->first();
        if ($objChecking) {
            return response()->json([
                'success' => false,
                'message' => 'Already Register Course and This Session',
                'data' => ''
            ], 400);
        
        } else {

            $obj = mis_std_regsubject::create([
                'std_studentid' => $std_studentid,
                'fk_cotDet' => $fk_cotDet,
                'cur_year' => $cur_year,
                'reg_semester' => $reg_semester,
                'crs_code' => $crs_code,
                'rsb_type' => $rsb_type,
                'rsb_status' => $rsb_status,
                'aca_session' => $aca_session,
                'recordstatus' => $recordstatus,
            ]);    
        
            if ($obj) {
                $obj_std = mis_std_info::where('std_studentid', $std_studentid)->update(['status_academic' => "1"]);
                return response()->json([
                    'success' => true,
                    'message' => 'Register Success!',
                    'data' => $obj
                ], 201);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Bad Request',
                    'data' => $obj
                ], 400);
            }
        }
        

    }

    public function updateAcaCal(Request $request)
    {
        $rsb_id = $request->input('rsb_id');
        $aca_session = $request->input('aca_session');

        $obj = mis_std_regSubject::where('rsb_id', $rsb_id)->update([
            'aca_session' => $aca_session
        ]);

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "Update Success!",
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Update Failed!",
                'data' => ''
            ], 400);
        }
    }


    public function delete(Request $request)
    {
        $rsb_id = $request->input('rsb_id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_std_regsubject::where([['rsb_id', '=', $rsb_id]])->update([
            'recordstatus' => $recordstatus,
        ]);

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "Hapus Berjaya!",
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Hapus Gagal!",
                'data' => ''
            ], 404);
        }
    }


    public function listByStd($id)
    {
        $obj = mis_std_regsubject::where([['std_studentid', '=', $id], ['mis_std_regsubject.recordstatus', '!=', 'DEL']])
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
            ->get([
                'rsb_id',
                'cur_year',
                'reg_semester',
                'crs_name',
                'mis_prm_course.crs_code AS crsCode',
                'crs_credit',
                'fk_cotDet'
            ]);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    // list student by cur_year & course
    public function listByYearCrs(Request $request)
    {
        $cur_year = $request->input('cur_year');
        $curYear = str_replace("-", "/", $cur_year);
        $fk_course = $request->input('fk_course');

        $obj = mis_std_regsubject::where([
            ['mis_std_regsubject.cur_year', '=', $curYear],
            ['mis_std_regsubject.crs_code', '=', $fk_course],
            ['mis_std_regsubject.recordstatus', '!=', 'DEL']
        ])
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'mis_std_regsubject.std_studentid')
            ->leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_std_info.pgm_fk')
            ->orderBy('std_id')
            ->get([
                'rsb_id',
                'mis_std_regsubject.std_studentid AS std_id',
                'sti_name',
                'mis_prm_programme.pgm_id AS pgmCode',
                'rsb_status',
                'cMark',
                'tMark',
                'grade',
                'point'
            ]);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "List Not Found!",
                'data' => ''
            ], 400);
        }
    }


    // update status student register course
    public function uptStatus(Request $request)
    {
        $rsb_id = $request->input('rsb_id');
        $barr_status = $request->input('barr_status');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_std_regsubject::where([['rsb_id', '=', $rsb_id]])->update([
            'barr_status' => $barr_status,
            'recordstatus' => $recordstatus,
        ]);

        if ($obj) {

                // //insert log
                // $this->logAudit([
                //     'activity' => 'Update Status Student Register Course',
                //     'ip_address' =>  $request->getClientIp(),
                //     'message' => 'Update Successful',
                //     'datalist' => [
                //         'barr_status' => $barr_status,
                //         'recordstatus' => $recordstatus,
                //     ],
                //     // 'created_by'=>$_SESSION['usrName'],
                //     'updated_by'=>$_SESSION['usrName'],
                //     'statusrekod' => 200,
                // ]);
            return response()->json([
                'success' => true,
                'message' => "Update Success!",
                'data' => $obj
            ], 200);
        } else {

            // $this->logAudit([
            //     'activity' =>'Update Status Student Register Course',
            //     'ip_address' => $request->getClientIp(),
            //     'datalist' =>  [
            //         'barr_status' => $barr_status,
            //         'recordstatus' => $recordstatus,
            //     ],
            //     'message' => 'Update Failed',
            //       // 'created_by'=>$_SESSION['usrName'],
            //       'updated_by'=>$_SESSION['usrName'],
            //     'statusrekod' => 400,
            // ]);
            
            return response()->json([
                'success' => false,
                'message' => "Update Failed!",
                'data' => ''
            ], 404);
        }
    }


    // list course by student, status==Register
    public function listByStdReg($id, $sem)
    {
        $obj = mis_std_regsubject::where([
            ['std_studentid', '=', $id],
            ['reg_semester', '=', $sem],
            ['rsb_status', '=', 'Register'],
            ['mis_std_regsubject.recordstatus', '!=', 'DEL']
        ])
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
            ->get([
                'rsb_id',
                'cur_year',
                'reg_semester',
                'crs_name',
                'mis_prm_course.crs_code AS crsCode',
                'crs_credit',
                'mis_std_regsubject.crs_code AS fk_crs',
                'fk_cotDet'
            ]);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    // list course by student, status!=Register
    public function listByStdNotReg($id)
    {
        $obj = mis_std_regsubject::where([
            ['std_studentid', '=', $id],
            ['rsb_status', '!=', 'Register'],
            ['mis_std_regsubject.recordstatus', '!=', 'DEL']
        ])
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
            ->orderBy('reg_semester', 'desc')
            ->get([
                'rsb_id',
                'cur_year',
                'reg_semester',
                'crs_name',
                'mis_prm_course.crs_code AS crsCode',
                'crs_credit',
                'rsb_status'
            ]);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    // list course by student, status!=Register
    public function chkStatus(Request $request)
    {
        $std_studentid = $request->input('std_studentid');
        $crs_code = $request->input('crs_code');

        $obj = mis_std_regsubject::where([
            ['std_studentid', '=', $std_studentid],
            ['crs_code', '=', $crs_code],
            ['mis_std_regsubject.recordstatus', '!=', 'DEL']
        ])
            ->get([
                'rsb_id',
                'cur_year',
                'reg_semester',
                'crs_code',
                'rsb_status'
            ]);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    // list course by cur_year
    public function listByYear($id)
    {
        $curYear = str_replace("-", "/", $id);

        $obj = mis_std_regsubject::groupBy('mis_std_regsubject.crs_code')
            ->where([['mis_std_regsubject.cur_year', '=', $curYear], ['mis_std_regsubject.recordstatus', '!=', 'DEL']])
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
            ->leftjoin('mis_prm_faculty', 'mis_prm_faculty.pk_id', '=', 'mis_prm_course.fac_id')
            ->get([
                'rsb_id',
                'rsb_status',
                'cur_year',
                'mis_std_regsubject.crs_code AS fk_course',
                'mis_prm_course.crs_code AS crsCode',
                'crs_name',
                'mis_prm_faculty.fac_id AS facCode',
                'fk_cotDet',
                'cMark',
                'tMark',
                'grade',
                'point'
            ]);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }

    public function generateMark(Request $request)
    {
        $rsb_id = $request->input('rsb_id');
        $cMark = $request->input('cMark');
        $tMark = $request->input('tMark');
        $grade = $request->input('grade');
        $point = $request->input('point');
        $mark_generate = $request->input('mark_generate');

        $data = [
            'cMark' => $cMark,
            'tMark' => $tMark,
            'grade' => $grade,
            'point' => $point,
            'mark_generate' => $mark_generate
        ];
        $obj = mis_std_regsubject::where('rsb_id', $rsb_id)->update($data);

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => 'Updated Success!',
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Updated Failed!',
                'data' => $obj
            ], 200);
        }
    }


    // list student by course
    public function listByCrs(Request $request)
    {
        $fk_course = $request->input('fk_course');

        $obj = mis_std_regsubject::where([
            ['mis_std_regsubject.crs_code', '=', $fk_course],
            ['mis_std_regsubject.recordstatus', '!=', 'DEL']
        ])
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'mis_std_regsubject.std_studentid')
            ->leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_std_info.pgm_fk')
            ->orderBy('std_id')
            ->get([
                'rsb_id',
                'mis_std_regsubject.std_studentid AS std_id',
                'sti_name',
                'mis_prm_programme.pgm_id AS pgmCode',
                'rsb_status'
            ]);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    // list by cot_detail
    public function listByCotDet($id)
    {
        $obj = mis_std_regsubject::where([
            ['fk_cotDet', '=', $id],
            ['rsb_status', '!=', 'Drop'],
            ['recordstatus', '!=', 'DEL']
        ])->get(['rsb_id']);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    // change status add drop subject
    public function addDrop(Request $request)
    {
        $rsb_id = $request->input('rsb_id');
        $rsb_status = $request->input('rsb_status');
        $drop_date = $request->input('drop_date');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_std_regsubject::where([['rsb_id', '=', $rsb_id]])->update([
            'rsb_status' => $rsb_status,
            'drop_date' => $drop_date,
            'recordstatus' => $recordstatus,
        ]);

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "Hapus Berjaya!",
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Hapus Gagal!",
                'data' => ''
            ], 404);
        }
    }


    // check if course have been added before
    public function chkReg(Request $request)
    {
        $std_studentid = $request->input('std_studentid');
        $reg_semester = $request->input('reg_semester');
        $fk_cotDet = $request->input('fk_cotDet');

        $obj = mis_std_regsubject::where([
            ['std_studentid', '=', $std_studentid],
            ['reg_semester', '=', $reg_semester],
            ['fk_cotDet', '=', $fk_cotDet],
            ['recordstatus', '!=', 'DEL']
        ])
            ->get(['rsb_id', 'rsb_status']);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    // list by cot_detail & status==Register
    public function listByCotDetReg($id)
    {
        $obj = mis_std_regsubject::where([
            ['fk_cotDet', '=', $id],
            ['rsb_status', '=', 'Register'],
            ['mis_std_regsubject.recordstatus', '!=', 'DEL']
        ])
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'mis_std_regsubject.std_studentid')
            ->leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_std_info.pgm_fk')
            ->orderBy('std_id')
            ->get([
                'rsb_id',
                'mis_std_regsubject.std_studentid AS std_id',
                'sti_name',
                'mis_prm_programme.pgm_id AS pgmCode',
                'rsb_status',
                'barr_status',
                'cur_year',
                'reg_semester'
            ]);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    // list by cot_detail & status==Register & not Barred
    public function countStdReg($id)
    {
        $obj = mis_std_regsubject::where([
            ['fk_cotDet', '=', $id],
            ['rsb_status', '=', 'Register'],
            ['barr_status', '!=', 'Barred'],
            ['mis_std_regsubject.recordstatus', '!=', 'DEL']
        ])
            ->get(['rsb_id', 'barr_status', 'cur_year']);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    // list course by cur_year & faculty
    public function listByFacYear(Request $request)
    {
        $fac = $request->input('fac_id');
        $curYear = $request->input('cur_year');

        $obj = mis_std_regsubject::groupBy('mis_std_regsubject.crs_code')
            ->where([['mis_std_regsubject.cur_year', '=', $curYear], ['mis_prm_faculty.pk_id', '=', $fac], ['mis_std_regsubject.recordstatus', '!=', 'DEL']])
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
            ->leftjoin('mis_prm_faculty', 'mis_prm_faculty.pk_id', '=', 'mis_prm_course.fac_id')
            ->get([
                'rsb_id',
                'rsb_status',
                'cur_year',
                'mis_std_regsubject.crs_code AS fk_course',
                'mis_prm_course.crs_code AS crsCode',
                'crs_name',
                'mis_prm_faculty.pk_id AS faculty_id',
                'mis_prm_faculty.fac_id AS facCode',
                'fk_cotDet'
            ]);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    // group by year
    public function listYear(Request $request)
    {
        $obj = mis_std_regsubject::groupBy('cur_year')->where([['recordstatus', '!=', 'DEL']])->get(['cur_year']);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    // list by active Add/Drop Course Policy
    public function listByActPolicy(Request $request)
    {
        $std_studentid = $request->input('std_studentid');
        $aca_session = $request->input('aca_session');

        $obj = mis_std_regsubject::where([
            ['mis_std_regsubject.std_studentid', '=', $std_studentid],
            ['aca_session', '=', $aca_session],
            ['mis_std_regsubject.recordstatus', '!=', 'DEL'],
            ['mis_std_regsubject.rsb_status', '!=', 'DROP'],
            ['mis_std_regsubject.rsb_type', '!=', 'CE']
        ])
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
            ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_regsubject.aca_session')
            // ->leftJoin('mis_exam_student', function ($join) {
            //     $join->on('mis_std_regsubject.rsb_id', '=', 'mis_exam_student.fk_stdRegCrs')
            //         ->where('mis_exam_student.recordstatus', '!=', 'DEL');
            // })
            // // ->orderBy('rsb_status', 'desc')
            ->get([

                'rsb_id',
                'barr_status',
                'mis_prm_calendar.cur_year AS acaYear',
                'cal_cohort',
                'crs_name',
                'rsb_type',
                'mis_prm_course.crs_code AS crsCode',
                'mis_prm_course.counted_cgpa',
                'ip',
                'mrf',
                'crs_credit',
                'mis_std_regsubject.fk_cotDet',
                'mis_std_regsubject.crs_code AS fk_course',
                'rsb_status',
                'cMark',
                'tMark',
                'grade',
                'point',
                // 'attendance',
                'aca_session'

            ]);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => 'false',
                'message' => 'Bad Request!',
                'data' => ''
            ], 400);
        }
    }

    // list by active Add/Drop Course Policy
    public function listByActPolicy2(Request $request)
    {
        $std_studentid = $request->input('std_studentid');
        $aca_session = $request->input('aca_session');

        $obj = mis_std_regsubject::where([
            ['std_studentid', '=', $std_studentid],
            ['aca_session', '=', $aca_session],
            ['mis_std_regsubject.recordstatus', '!=', 'DEL'],
            ['mis_std_regsubject.rsb_status', '!=', 'DROP'],
            ['mis_addDrop_policy.recordstatus', '!=', 'DEL']
        ])
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
            ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_regsubject.aca_session')
            ->leftJoin('mis_addDrop_policy', 'mis_addDrop_policy.aca_calendar', '=', 'mis_std_regsubject.aca_session')
            ->orderBy('rsb_status', 'desc')
            ->get([
                'rsb_id',
                'barr_status',
                'mis_prm_calendar.cur_year AS acaYear',
                'cal_cohort',
                'crs_name',
                'mis_prm_course.crs_code AS crsCode',
                'crs_credit',
                'fk_cotDet',
                'mis_std_regsubject.crs_code AS fk_course',
                'rsb_status',
                'cMark',
                'tMark',
                'grade',
                'point',
                'start_date',
                'end_date'

            ]);


        // $obj = mis_std_regsubject::select(
        //     'mis_std_regsubject.rsb_id',
        //     'mis_std_regsubject.barr_status',
        //     'mis_prm_calendar.cur_year AS acaYear',
        //     'mis_std_regsubject.cal_cohort',
        //     'mis_prm_course.crs_name',
        //     'mis_prm_course.pk_id AS crsCode',
        //     'mis_prm_course.crs_credit',
        //     'mis_std_regsubject.fk_cotDet',
        //     'mis_std_regsubject.crs_code AS fk_course',
        //     'mis_std_regsubject.rsb_status',
        //     'mis_std_regsubject.cMark',
        //     'mis_std_regsubject.tMark',
        //     'mis_std_regsubject.grade',
        //     'mis_std_regsubject.point',
        //     'start_date',
        //     'end_date'
        // )
        // ->leftJoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
        // ->leftJoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_regsubject.aca_session')
        // ->leftJoin('mis_addDrop_policy', 'mis_addDrop_policy.aca_calendar', '=', 'mis_std_regsubject.aca_session')
        // ->where([
        //     ['mis_std_regsubject.std_studentid', '=', $std_studentid ],
        //     ['mis_std_regsubject.aca_session', '=', $aca_session],
        //     ['mis_std_regsubject.recordstatus', '!=', 'DEL'],
        //     ['mis_std_regsubject.rsb_status', '!=', 'DROP']
        // ])
        // ->get();

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => 'false',
                'message' => 'Bad Request!',
                'data' => ''
            ], 400);
        }
    }

    public function listByActPolicy3(Request $request)
    {
        $std_studentid = $request->input('std_studentid');
        $aca_session = $request->input('aca_session');

        $obj = mis_std_regsubject::where([
            ['std_studentid', '=', $std_studentid],
            ['aca_session', '=', $aca_session],
            ['mis_std_regsubject.recordstatus', '!=', 'DEL'],
            ['mis_std_regsubject.rsb_status', '!=', 'DROP'],
            ['mis_std_regsubject.rsb_type', '!=', 'CE']
        ])
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
            ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_regsubject.aca_session')
            ->leftjoin('mis_exam_policy_date', 'aca_session', '=', 'mis_exam_policy_date.aca_calendar')
            // ->leftjoin('mis_lecturer_course_prm', 'mis_lecturer_course_prm.fk_cotDet', '=', 'mis_std_regsubject.fk_cotDet')
            ->orderBy('rsb_status', 'desc')
            ->get([

                'rsb_id',
                'barr_status',
                'mis_prm_calendar.cur_year AS acaYear',
                'mis_prm_calendar.cal_cohort',
                'crs_name',
                'rsb_type',
                'mis_prm_course.crs_code AS crsCode',
                'mis_prm_course.counted_cgpa',
                'ip',
                'mrf',
                'crs_credit',
                'mis_std_regsubject.fk_cotDet',
                'mis_std_regsubject.crs_code AS fk_course',
                'rsb_status',
                'cMark',
                'tMark',
                'grade',
                'point',
                // 'emp_id',
                'aca_session', 
                'mis_exam_policy_date.exam_status'

            ]);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => 'false',
                'message' => 'Bad Request!',
                'data' => ''
            ], 400);
        }
    }

    // list by active Add/Drop Course Policy No atendance
    public function listByActPolicy4(Request $request)
    {
        $std_studentid = $request->input('std_studentid');
        $aca_session = $request->input('aca_session');
        $cal_cohort = $request->input('cal_cohort');
        $cur_year = $request->input('cur_year');

        $obj = mis_std_regsubject::where([
                ['mis_std_regsubject.std_studentid', '=', $std_studentid],
                // ['aca_session', '=', $aca_session],
                ['mis_std_regsubject.rsb_type', '!=', 'CE'],
                ['mis_std_regsubject.recordstatus', '!=', 'DEL'],
                ['mis_std_regsubject.rsb_status', '!=', 'DROP'],
                // ['mis_std_regsubject.drop_date', '=', NULL],
                ['mis_prm_calendar.cur_year', '=', $cur_year],
                ['mis_prm_calendar.cal_cohort', '=', $cal_cohort]
            ])
            ->where(function($query) {
                $query->whereNull('mis_std_regsubject.drop_date')
                      ->orWhere('mis_std_regsubject.drop_date', '');
            })
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
            ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_regsubject.aca_session')
            ->leftJoin('mis_exam_student', function ($join) {
                $join->on('mis_std_regsubject.rsb_id', '=', 'mis_exam_student.fk_stdRegCrs')
                    ->where('mis_exam_student.recordstatus', '!=', 'DEL');
            })
            ->groupBy([
                'rsb_id',
                'barr_status',
                'mis_prm_calendar.cur_year',
                'cal_cohort',
                'crs_name',
                'rsb_type',
                'mis_prm_course.crs_code',
                'mis_prm_course.counted_cgpa',
                'ip',
                'mrf',
                'crs_credit',
                'mis_std_regsubject.fk_cotDet',
                'mis_std_regsubject.crs_code',
                'rsb_status',
                'cMark',
                'tMark',
                'grade',
                'point',
                // 'attendance',
                'aca_session'
            ])
            ->orderBy('rsb_status', 'desc')
            ->get([
                'rsb_id',
                'barr_status',
                'mis_prm_calendar.cur_year AS acaYear',
                'cal_cohort',
                'crs_name',
                'rsb_type',
                'mis_prm_course.crs_code AS crsCode',
                'mis_prm_course.counted_cgpa',
                'ip',
                'mrf',
                'crs_credit',
                'mis_std_regsubject.fk_cotDet',
                'mis_std_regsubject.crs_code AS fk_course',
                'rsb_status',
                'cMark',
                'tMark',
                'grade',
                'point',
                // 'attendance',
                'aca_session'
            ]);
    

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => 'false',
                'message' => 'Bad Request!',
                'data' => ''
            ], 400);
        }
    }

    public function listByActPolicyCE(Request $request)
    {
        $std_studentid = $request->input('std_studentid');
        // $rsb_type = $request->input('rsb_type');

        $obj = mis_std_regsubject::where([
                ['mis_std_regsubject.std_studentid', '=', $std_studentid],
                ['rsb_type', '=', 'CE'],
                ['mis_std_regsubject.recordstatus', '!=', 'DEL'],
                ['mis_std_regsubject.rsb_status', '!=', 'DROP'],
                ['mis_std_regsubject.drop_date', '=', NULL],
          
            ])
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
            ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_regsubject.aca_session')
            ->leftJoin('mis_exam_student', function ($join) {
                $join->on('mis_std_regsubject.rsb_id', '=', 'mis_exam_student.fk_stdRegCrs')
                    ->where('mis_exam_student.recordstatus', '!=', 'DEL');
            })
            ->groupBy([
                'rsb_id',
                'barr_status',
                'mis_prm_calendar.cur_year',
                'cal_cohort',
                'crs_name',
                'rsb_type',
                'mis_prm_course.crs_code',
                'mis_prm_course.counted_cgpa',
                'ip',
                'mrf',
                'crs_credit',
                'mis_std_regsubject.fk_cotDet',
                'mis_std_regsubject.crs_code',
                'rsb_status',
                'cMark',
                'tMark',
                'grade',
                'point',
                // 'attendance',
                'aca_session'
            ])
            ->orderBy('rsb_status', 'desc')
            ->get([
                'rsb_id',
                'barr_status',
                'mis_prm_calendar.cur_year AS acaYear',
                'cal_cohort',
                'crs_name',
                'rsb_type',
                'mis_prm_course.crs_code AS crsCode',
                'mis_prm_course.counted_cgpa',
                'ip',
                'mrf',
                'crs_credit',
                'mis_std_regsubject.fk_cotDet',
                'mis_std_regsubject.crs_code AS fk_course',
                'rsb_status',
                'cMark',
                'tMark',
                'grade',
                'point',
                // 'attendance',
                'aca_session'
            ]);
    

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => 'false',
                'message' => 'Bad Request!',
                'data' => ''
            ], 400);
        }
    }

    public function listByActPolicyNoCECT(Request $request)
    {
        $std_studentid = $request->input('std_studentid');
        $aca_session = $request->input('aca_session');
        $cal_cohort = $request->input('cal_cohort');
        $cur_year = $request->input('cur_year');

        $obj = mis_std_regsubject::where([
                ['mis_std_regsubject.std_studentid', '=', $std_studentid],
                // ['aca_session', '=', $aca_session],
                // ['mis_std_regsubject.rsb_type', '!=', 'CE'],
                ['mis_std_regsubject.recordstatus', '!=', 'DEL'],
                ['mis_std_regsubject.rsb_status', '!=', 'DROP'],
                // ['mis_std_regsubject.drop_date', '=', NULL],
                ['mis_prm_calendar.cur_year', '=', $cur_year],
                ['mis_prm_calendar.cal_cohort', '=', $cal_cohort]
            ])
            ->whereNotIn('rsb_type', ['CE', 'CT'])
            ->where(function($query) {
                $query->whereNull('mis_std_regsubject.drop_date')
                      ->orWhere('mis_std_regsubject.drop_date', '');
            })
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
            ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_regsubject.aca_session')
            ->leftJoin('mis_exam_student', function ($join) {
                $join->on('mis_std_regsubject.rsb_id', '=', 'mis_exam_student.fk_stdRegCrs')
                    ->where('mis_exam_student.recordstatus', '!=', 'DEL');
            })
            ->groupBy([
                'rsb_id',
                'barr_status',
                'mis_prm_calendar.cur_year',
                'cal_cohort',
                'crs_name',
                'rsb_type',
                'mis_prm_course.crs_code',
                'mis_prm_course.counted_cgpa',
                'ip',
                'mrf',
                'crs_credit',
                'mis_std_regsubject.fk_cotDet',
                'mis_std_regsubject.crs_code',
                'rsb_status',
                'cMark',
                'tMark',
                'grade',
                'point',
                // 'attendance',
                'aca_session'
            ])
            ->orderBy('rsb_status', 'desc')
            ->get([
                'rsb_id',
                'barr_status',
                'mis_prm_calendar.cur_year AS acaYear',
                'cal_cohort',
                'crs_name',
                'rsb_type',
                'mis_prm_course.crs_code AS crsCode',
                'mis_prm_course.counted_cgpa',
                'ip',
                'mrf',
                'crs_credit',
                'mis_std_regsubject.fk_cotDet',
                'mis_std_regsubject.crs_code AS fk_course',
                'rsb_status',
                'cMark',
                'tMark',
                'grade',
                'point',
                // 'attendance',
                'aca_session'
            ]);
    

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => 'false',
                'message' => 'Bad Request!',
                'data' => ''
            ], 400);
        }
    }
    //Group the data based on max attendance
    public function listByActPolicy5(Request $request)
    {
        $std_studentid = $request->input('std_studentid');
        $aca_session = $request->input('aca_session');
        $cal_cohort = $request->input('cal_cohort');
        $cur_year = $request->input('cur_year');

        $obj = mis_std_regsubject::where([
            ['mis_std_regsubject.std_studentid', '=', $std_studentid], //DPH09220002
            // ['aca_session', '=', $aca_session], //31
            ['mis_std_regsubject.recordstatus', '!=', 'DEL'],
            ['mis_std_regsubject.rsb_status', '!=', 'DROP']
        ])
        ->leftJoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
        ->leftJoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_regsubject.aca_session')
        ->leftJoin('mis_lecturer_course_prm', 'mis_lecturer_course_prm.fk_cotDet', '=', 'mis_std_regsubject.fk_cotDet')
        ->leftJoin('mis_exam_student', function ($join) {
            $join->on('mis_std_regsubject.rsb_id', '=', 'mis_exam_student.fk_stdRegCrs')
                ->where('mis_exam_student.recordstatus', '!=', 'DEL');
        })
        ->where('mis_prm_calendar.cur_year',$cur_year)
        ->where('mis_prm_calendar.cal_cohort',$cal_cohort)        
        // ->where('mis_lecturer_course_prm.recordstatus', '!=' ,'DEL')        
        ->groupBy(
            'rsb_id',
            'barr_status',
            'mis_prm_calendar.cur_year',
            'cal_cohort',
            'crs_name',
            'rsb_type',
            'mis_prm_course.crs_code',
            'mis_prm_course.counted_cgpa',
            'ip',
            'mrf',
            'crs_credit',
            'mis_std_regsubject.fk_cotDet',
            'mis_std_regsubject.crs_code',
            'rsb_status',
            'cMark',
            'tMark',
            'grade',
            'point',
            'aca_session',
            // 'mis_lecturer_course_prm.final_exam',
            // 'mis_lecturer_course_prm.recordstatus'
        )
        ->select(
            'rsb_id',
            'barr_status',
            'mis_prm_calendar.cur_year AS acaYear',
            'cal_cohort',
            'crs_name',
            'rsb_type',
            'mis_prm_course.crs_code AS crsCode',
            'mis_prm_course.counted_cgpa',
            'ip',
            'mrf',
            'crs_credit',
            'mis_std_regsubject.fk_cotDet',
            'mis_std_regsubject.crs_code AS fk_course',
            'rsb_status',
            'cMark',
            'tMark',
            'grade',
            'point',
            // 'mis_lecturer_course_prm.final_exam', //afiez tmbah 18april2024 incase ada data redundant cek sni 
            // 'mis_lecturer_course_prm.recordstatus AS recordstatusCoursePrm',
            // Use a subquery or other approach for MAX(attendance)
            DB::raw('(SELECT MAX(attendance) FROM mis_exam_student WHERE mis_std_regsubject.rsb_id = mis_exam_student.fk_stdRegCrs AND mis_exam_student.recordstatus != "DEL") AS attendance'),
            'aca_session'
        )
        ->orderByDesc('rsb_status')
        ->get();
    
    

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => 'false',
                'message' => 'Bad Request!',
                'data' => ''
            ], 400);
        }
    }

    public function listByActPolicy5NoCE(Request $request)
    {
        $std_studentid = $request->input('std_studentid');
        $aca_session = $request->input('aca_session');
        $cal_cohort = $request->input('cal_cohort');
        $cur_year = $request->input('cur_year');

        $obj = mis_std_regsubject::where([
            ['mis_std_regsubject.std_studentid', '=', $std_studentid], //DPH09220002
            // ['aca_session', '=', $aca_session], //31
            ['mis_std_regsubject.recordstatus', '!=', 'DEL'],
            ['mis_std_regsubject.rsb_status', '!=', 'DROP']
        ])
        ->leftJoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
        ->leftJoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_regsubject.aca_session')
        ->leftJoin('mis_lecturer_course_prm', 'mis_lecturer_course_prm.fk_cotDet', '=', 'mis_std_regsubject.fk_cotDet')
        ->leftJoin('mis_exam_student', function ($join) {
            $join->on('mis_std_regsubject.rsb_id', '=', 'mis_exam_student.fk_stdRegCrs')
                ->where('mis_exam_student.recordstatus', '!=', 'DEL');
        })
        ->where('mis_prm_calendar.cur_year',$cur_year)
        ->where('mis_prm_calendar.cal_cohort',$cal_cohort)        
        ->where('rsb_type', '!=', 'CE')        
        // ->where('mis_lecturer_course_prm.recordstatus', '!=' ,'DEL')        
        ->groupBy(
            'rsb_id',
            'barr_status',
            'mis_prm_calendar.cur_year',
            'cal_cohort',
            'crs_name',
            'rsb_type',
            'mis_prm_course.crs_code',
            'mis_prm_course.counted_cgpa',
            'ip',
            'mrf',
            'crs_credit',
            'mis_std_regsubject.fk_cotDet',
            'mis_std_regsubject.crs_code',
            'rsb_status',
            'cMark',
            'tMark',
            'grade',
            'point',
            'aca_session',
            // 'mis_lecturer_course_prm.final_exam',
            // 'mis_lecturer_course_prm.recordstatus'
        )
        ->select(
            'rsb_id',
            'barr_status',
            'mis_prm_calendar.cur_year AS acaYear',
            'cal_cohort',
            'crs_name',
            'rsb_type',
            'mis_prm_course.crs_code AS crsCode',
            'mis_prm_course.counted_cgpa',
            'ip',
            'mrf',
            'crs_credit',
            'mis_std_regsubject.fk_cotDet',
            'mis_std_regsubject.crs_code AS fk_course',
            'rsb_status',
            'cMark',
            'tMark',
            'grade',
            'point',
            // 'mis_lecturer_course_prm.final_exam', //afiez tmbah 18april2024 incase ada data redundant cek sni 
            // 'mis_lecturer_course_prm.recordstatus AS recordstatusCoursePrm',
            // Use a subquery or other approach for MAX(attendance)
            DB::raw('(SELECT MAX(attendance) FROM mis_exam_student WHERE mis_std_regsubject.rsb_id = mis_exam_student.fk_stdRegCrs AND mis_exam_student.recordstatus != "DEL") AS attendance'),
            'aca_session'
        )
        ->orderByDesc('rsb_status')
        ->get();
    
    

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => 'false',
                'message' => 'Bad Request!',
                'data' => ''
            ], 400);
        }
    }



    // afiez (site = student account-financial statement)
    public function priceCourse(Request $request)
    {
        $std_studentid = $request->input('std_studentid');
        $aca_session = $request->input('aca_session');

        $obj = mis_std_regsubject::where([
            ['std_studentid', '=', $std_studentid],
            ['aca_session', '=', $aca_session],
            ['mis_std_regsubject.recordstatus', '!=', 'DEL'],
            ['mis_std_regsubject.rsb_status', '!=', 'DROP']
        ])  
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
            ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_regsubject.aca_session')
            ->orderBy('rsb_status', 'desc')
            ->get([
                'rsb_id',
                'mis_prm_course.crs_price AS harga',
                'mis_prm_calendar.cur_year AS acaYear',
                'cal_cohort',
                'crs_name',
                'mis_prm_course.crs_code AS crsCode',
                'fk_cotDet',
                'mis_std_regsubject.crs_code AS fk_course',
                'rsb_status',
                'point',
            ]);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => 'false',
                'message' => 'Bad Request!',
                'data' => ''
            ], 400);
        }
    }
    ////

    public function listByActStd(Request $request)
    {
        $std_studentid = $request->input('std_studentid');
        $aca_session = $request->input('aca_session');

        $obj = mis_std_regsubject::where([
            ['std_studentid', '=', $std_studentid],
            ['aca_session', '=', $aca_session],
            ['mis_std_regsubject.recordstatus', '!=', 'DEL'],
            ['mis_std_regsubject.rsb_status', '!=', 'DROP'],
            // ['mis_exam_application.recordstatus', '!=', 'DEL']

        ])
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
            ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_regsubject.aca_session')
            ->leftjoin('mis_exam_application', 'mis_std_regsubject.rsb_id', '=', 'mis_exam_application.rsb_id')
            ->where(function ($query) {
                $query->where('mis_exam_application.recordstatus', '!=', 'DEL')
                      ->orWhereNull('mis_exam_application.recordstatus');
            })
            ->where('rsb_type', '!=', 'CE') // Adding the new condition here

                       
            ->orderBy('rsb_status', 'desc')
            ->get([
                'mis_std_regsubject.rsb_id',
                'barr_status',
                'mis_prm_calendar.cur_year AS acaYear',
                'cal_cohort',
                'crs_name',
                'mis_prm_course.crs_code AS crsCode',
                'crs_credit',
                'fk_cotDet',
                'mis_std_regsubject.crs_code AS fk_course',
                'rsb_status',
                'grade',
                'point',
                'mis_std_regsubject.mrf',
                'mis_std_regsubject.ip',
                'mis_std_regsubject.rsb_type',
                'mis_exam_application.app_type',
                'mis_exam_application.app_status',
                'mis_exam_application.recordstatus AS examAppStatus'
                
            ]);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    // list by Academic Calendar & Course
    public function listByAcaCalCrs(Request $request)
    {
        $crs_code = $request->input('crs_code');
        $aca_session = $request->input('aca_session');

        $obj = mis_std_regsubject::where([
            ['mis_std_regsubject.crs_code', '=', $crs_code],
            ['aca_session', '=', $aca_session],
            ['rsb_status', '=', 'Register'],
            ['mis_std_regsubject.recordstatus', '!=', 'DEL'],
            ['mis_std_info.status_academic', '=', '1'],
        ])
        ->where('rsb_status', '!=', 'Drop') // Adding the new condition here
        // ->where('mis_exam_application.app_status', '!=', 'Reject') // Adding the new condition here
        // ->where('mis_exam_application.recordstatus', '!=', 'DEL')

            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
            ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_regsubject.aca_session')
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'mis_std_regsubject.std_studentid')
            ->leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_std_info.pgm_fk')
            ->leftjoin('mis_exam_application', 'mis_exam_application.rsb_id', '=', 'mis_std_regsubject.rsb_id')
            // ->leftJoin('mis_exam_student', function ($join) {
            //     $join->on('mis_std_regsubject.rsb_id', '=', 'mis_exam_student.fk_stdRegCrs')
            //         ->where('mis_exam_student.recordstatus', '!=', 'DEL');
            // })
            ->orderBy('std_id')
            ->orderBy('barr_status', 'asc')

            ->get([
                'mis_std_regsubject.rsb_id',
                'barr_status',
                'mis_prm_calendar.cur_year AS acaYear',
                'cal_cohort',
                'crs_name',
                'mis_prm_course.crs_code AS crsCode',
                'ip',
                'mrf',
                'crs_credit',
                'fk_cotDet',
                'mis_std_regsubject.std_studentid AS std_id',
                'sti_name',
                'mis_prm_programme.pgm_id AS pgmCode',
                'rsb_status',
                'cMark',
                'tMark',
                'grade',
                'point',
                // 'attendance',
                'mark_generate',
                'mis_exam_application.app_type',
                'mis_exam_application.app_reason',
                'mis_exam_application.app_status',
                'mis_exam_application.pk_id AS FK_exam_application',
                'mis_exam_application.recordstatus AS recExamApplication',
            ]);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }

        // list by Academic conflict dgn exam and senarai marks
        public function listByAcaCalCrsFixExam(Request $request)
        {
            $crs_code = $request->input('crs_code');
            $aca_session = $request->input('aca_session');
    
            $obj = mis_std_regsubject::where([
                ['mis_std_regsubject.crs_code', '=', $crs_code],
                ['aca_session', '=', $aca_session],
                ['rsb_status', '=', 'Register'],
                ['mis_std_regsubject.recordstatus', '!=', 'DEL']
            ])
            ->where('rsb_status', '!=', 'Drop') // Adding the new condition here
            ->where('mis_exam_application.app_status', '!=', 'Reject') // Adding the new condition here
            ->where('mis_exam_application.recordstatus', '!=', 'DEL')
    
                ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
                ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_regsubject.aca_session')
                ->leftjoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'mis_std_regsubject.std_studentid')
                ->leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_std_info.pgm_fk')
                ->leftjoin('mis_exam_application', 'mis_exam_application.rsb_id', '=', 'mis_std_regsubject.rsb_id')
                // ->leftJoin('mis_exam_student', function ($join) {
                //     $join->on('mis_std_regsubject.rsb_id', '=', 'mis_exam_student.fk_stdRegCrs')
                //         ->where('mis_exam_student.recordstatus', '!=', 'DEL');
                // })
                ->orderBy('std_id')
                ->orderBy('barr_status', 'asc')
    
                ->get([
                    'mis_std_regsubject.rsb_id',
                    'barr_status',
                    'mis_prm_calendar.cur_year AS acaYear',
                    'cal_cohort',
                    'crs_name',
                    'mis_prm_course.crs_code AS crsCode',
                    'ip',
                    'mrf',
                    'crs_credit',
                    'fk_cotDet',
                    'mis_std_regsubject.std_studentid AS std_id',
                    'sti_name',
                    'mis_prm_programme.pgm_id AS pgmCode',
                    'rsb_status',
                    'cMark',
                    'tMark',
                    'grade',
                    'point',
                    // 'attendance',
                    'mark_generate',
                    'mis_exam_application.app_type',
                    'mis_exam_application.app_reason',
                    'mis_exam_application.app_status',
                    'mis_exam_application.pk_id AS FK_exam_application',
                ]);
    
            if ($obj) {
                return response()->json([
                    'success' => 'true',
                    'message' => 'List Success!',
                    'data' => $obj
                ], 200);
            }
        }
    // list by Academic Calendar & Course
    public function sumByAcaCalCrs(Request $request)
    {
        $crs_code = $request->input('crs_code');
        $aca_session = $request->input('aca_session');

        $obj = mis_std_regsubject::where([
            ['mis_std_regsubject.crs_code', '=', $crs_code],
            ['aca_session', '=', $aca_session],
            ['rsb_status', '=', 'Register'],
            ['mis_std_regsubject.recordstatus', '!=', 'DEL']
        ])
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
            ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_regsubject.aca_session')
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'mis_std_regsubject.std_studentid')
            ->leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_std_info.pgm_fk')
            ->leftjoin('mis_exam_application', 'mis_exam_application.rsb_id', '=', 'mis_std_regsubject.rsb_id')
            
            ->groupBy('mis_prm_course.crs_code')
            ->first([
                'mis_prm_course.crs_code AS crsCode',
                DB::RAW('COUNT(mis_prm_course.crs_code) AS total')
            ]);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }

    // list by Academic Calendar & Course
    public function listByAcaCalCrs2(Request $request)
    {
        $crs_code = $request->input('crs_code');
        $aca_session = $request->input('aca_session');

        $obj = mis_std_regsubject::where([
            ['mis_std_regsubject.crs_code', '=', $crs_code],
            ['aca_session', '=', $aca_session],
            ['rsb_status', '=', 'Register'],
            ['mis_std_regsubject.recordstatus', '!=', 'DEL']
            // ['mis_exam_application.recordstatus', '!=', 'DEL']
        ])
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
            ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_regsubject.aca_session')
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'mis_std_regsubject.std_studentid')
            ->leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_std_info.pgm_fk')
            ->leftjoin('mis_exam_application', 'mis_exam_application.rsb_id', '=', 'mis_std_regsubject.rsb_id')
            // ->leftJoin('mis_exam_student', function ($join) {
            //     $join->on('mis_std_regsubject.rsb_id', '=', 'mis_exam_student.fk_stdRegCrs')
            //         ->where('mis_exam_student.recordstatus', '!=', 'DEL');
            // })
            
            // ->where('mis_exam_application.recordstatus', '!=', 'DEL')
            ->orderBy('std_id')
            ->orderBy('barr_status', 'asc')

            ->get([
                'mis_std_regsubject.rsb_id',
                'barr_status',
                'mis_prm_calendar.cur_year AS acaYear',
                'cal_cohort',
                'crs_name',
                'mis_prm_course.crs_code AS crsCode',
                'ip',
                'mrf',
                'crs_credit',
                'fk_cotDet',
                'mis_std_regsubject.std_studentid AS std_id',
                'sti_name',
                'mis_prm_programme.pgm_id AS pgmCode',
                'rsb_status',
                'cMark',
                'tMark',
                'grade',
                'point',
                // 'attendance',
                'mark_generate',
                'mis_exam_application.app_type',
                'mis_exam_application.app_reason',
                'mis_exam_application.app_status',
                'mis_exam_application.recordstatus as recApplication',
            ]);

                        // Filter the collection to exclude items where rsApplication is 'DEL'
            $obj = $obj->filter(function ($item) {
                return $item->recApplication !== 'DEL';
            });

            $obj = $obj->values()->all();

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }

    public function listByAcaCalCrs3(Request $request)
    {
        $crs_code = $request->input('crs_code');
        $aca_session = $request->input('aca_session');

        $obj = mis_std_regsubject::where([
            ['mis_std_regsubject.crs_code', '=', $crs_code],
            ['aca_session', '=', $aca_session],
            ['rsb_status', '=', 'Register'],
            ['mis_std_regsubject.recordstatus', '!=', 'DEL']
        ])
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
            ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_regsubject.aca_session')
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'mis_std_regsubject.std_studentid')
            ->leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_std_info.pgm_fk')
            ->leftjoin('mis_exam_application', 'mis_exam_application.rsb_id', '=', 'mis_std_regsubject.rsb_id')
            ->whereNotNull('mis_exam_application.rsb_id')
            ->where('mis_exam_application.recordstatus','!=','DEL')

            // ->leftjoin('mis_exam_application', 'mis_exam_application.rsb_id', '=', 'mis_std_regsubject.rsb_id')
            // ->leftJoin('mis_exam_student', function ($join) {
            //     $join->on('mis_std_regsubject.rsb_id', '=', 'mis_exam_student.fk_stdRegCrs')
            //         ->where('mis_exam_student.recordstatus', '!=', 'DEL');
            // })
            ->orderBy('std_id')
            ->orderBy('barr_status', 'asc')

            ->get([
                'mis_std_regsubject.rsb_id',
                'barr_status',
                'mis_prm_calendar.cur_year AS acaYear',
                'cal_cohort',
                'crs_name',
                'mis_prm_course.crs_code AS crsCode',
                'ip',
                'mrf',
                'crs_credit',
                'fk_cotDet',
                'mis_std_regsubject.std_studentid AS std_id',
                'sti_name',
                'mis_prm_programme.pgm_id AS pgmCode',
                'rsb_status',
                'cMark',
                'tMark',
                'grade',
                'point',
                // 'attendance',
                'mark_generate',
                'mis_exam_application.pk_id',
		        'mis_exam_application.app_type',
		        'mis_exam_application.app_status',
		        'mis_exam_application.recordstatus'
                // 'mis_exam_application.app_type',
                // 'mis_exam_application.app_reason',
                // 'mis_exam_application.app_status',
            ]);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }

    public function update_ip(Request $request)
    {
        $id = $request->input('id');
        $ip = $request->input('ip');
        $obj = mis_std_regsubject::where('rsb_id', $id)->update([
            'ip' => $ip
        ]);
        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => 'Update IP Success!',
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Update IP Failed!',
                'data' => ''
            ], 400);
        }
    }

    public function update_mrf(Request $request)
    {
        $id = $request->input('id');
        $mrf = $request->input('mrf');
        $obj = mis_std_regsubject::where('rsb_id', $id)->update([
            'mrf' => $mrf
        ]);
        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'List Failed!',
                'data' => ''
            ], 400);
        }
    }

    //total student by academic calendar & course - AzizZ 20230920
    public function sumStdByAcaCalCrs(Request $request)
    {
        $crs_code = $request->input('crs_code');
        $aca_session = $request->input('aca_session');

        $obj = mis_std_regsubject::where([
            ['mis_std_regsubject.crs_code', '=', $crs_code],
            ['aca_session', '=', $aca_session],
            ['rsb_status', '=', 'Register'],
            ['mis_std_regsubject.recordstatus', '!=', 'DEL']
        ])
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
            ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_regsubject.aca_session')
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'mis_std_regsubject.std_studentid')
            ->leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_std_info.pgm_fk')
            ->groupBy('mis_prm_course.crs_code')
            ->get([
                DB::RAW('COUNT(mis_prm_course.crs_code) AS total'),
                'mis_prm_course.crs_code AS crsCode'
            ]);

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'List Failed!',
                'data' => ''
            ], 400);
        }
    }

    //list student utk time table - afiez 09nov2023
    public function listStdByTimetableExam(Request $request)
    {
        $crs_code = $request->input('crs_code');
        $aca_session = $request->input('aca_session');

        $obj = mis_std_regsubject::where([
            ['mis_std_regsubject.crs_code', '=', $crs_code],
            ['aca_session', '=', $aca_session],
            ['rsb_status', '=', 'Register'],
            ['mis_std_regsubject.recordstatus', '!=', 'DEL']
        ])
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
            ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_regsubject.aca_session')
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'mis_std_regsubject.std_studentid')
            ->leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_std_info.pgm_fk')
            // ->groupBy('mis_prm_course.crs_code')
            // ->leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_std_info.pgm_fk')
            ->get(
                [
                    'sti_name',
                    'mis_std_info.std_studentid',
                    'sti_icno',
                    'sti_gender',
                    'pgm_name',
                    'pgm_duration',
                    'pgm_status',
                    'pgm_fee',
                    'pgm_attainment',
                    'pgm_category',
                    'pgm_area',
                    'cam_id',
                    'rsb_status',
                    'rsb_type',
                    'mis_prm_course.crs_code',
                    'rsb_id',
                    'crs_name',
                    'crs_credit',
                    'cur_intake',
                    'sti_session_id',
                    // 'mis_prm_programme.pgm_name',    
                ]
            );

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'List Failed!',
                'data' => ''
            ], 400);
        }
    }

    // list by Academic Calendar & Course
    public function listByAcaCalCrsStudent(Request $request)
    {

        $crs_code = $request->input('crs_code');
        $aca_session = $request->input('aca_session');
        $std_studentid = $request->input('std_studentid');

        $obj = DB::table(function ($subquery1) {
            $subquery1->select(
                'mis_prm_gredscheme_det.gsd_id',
                'mis_prm_gredscheme_det.gsc_id',
                'mis_prm_gredscheme_det.gsd_exam_type AS examTypeId',
                'gsd_exam_type.gsd_exam_type AS examTypeName',
                'gsd_component',
                'gsd_percentage'
            )
                ->from('mis_prm_gredscheme_det')
                ->leftJoin('gsd_exam_type', 'gsd_exam_type.id', '=', 'mis_prm_gredscheme_det.gsd_exam_type')
                ->where('mis_prm_gredscheme_det.recordstatus', '!=', 'DEL')
                ->where('mis_prm_gredscheme_det.gsd_component', 'Continuous Assessment') // Added condition
                // ->where('mis_prm_gredscheme_det.gsd_component', 'Formative Assessment') // Added condition

                ->orderBy('mis_prm_gredscheme_det.gsd_component', 'asc')
                ->orderBy('gsc_id', 'asc');
        }, 'q1')
            ->joinSub(function ($subquery2) use ($crs_code, $aca_session, $std_studentid) {
                $subquery2->select(
                    'rsb_id',
                    'barr_status',
                    'mis_prm_calendar.cur_year AS acaYear',
                    'cal_cohort',
                    'crs_name',
                    'mis_prm_course.crs_code AS crsCode',
                    'crs_credit',
                    'fk_cotDet',
                    'mis_std_regsubject.std_studentid AS std_id',
                    'sti_name',
                    'mis_prm_programme.pgm_id AS pgmCode',
                    'rsb_status',
                    'cMark',
                    'tMark',
                    'grade',
                    'point',
                    'mis_prm_gredscheme.gsc_id',
                    'mark_generate'
                )
                    ->from('mis_std_regsubject')
                    ->leftJoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
                    ->leftJoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_regsubject.aca_session')
                    ->leftJoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'mis_std_regsubject.std_studentid')
                    ->leftJoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_std_info.pgm_fk')
                    ->leftJoin('mis_prm_gredscheme', 'mis_prm_gredscheme.fk_course', '=', 'mis_std_regsubject.crs_code')
                    ->where('mis_std_regsubject.crs_code', $crs_code)
                    ->where('aca_session', $aca_session)
                    ->where('rsb_status', 'Register')
                    ->where('mis_std_regsubject.recordstatus', '!=', 'DEL')
                    ->where('mis_std_regsubject.std_studentid', $std_studentid)
                    ->limit(1);
            }, 'q2', function ($join) {
                $join->on('q1.gsc_id', '=', 'q2.gsc_id');
            })
            ->select(
                'q1.gsd_id',
                'q1.gsc_id',
                'q1.examTypeId',
                'q1.examTypeName',
                'q1.gsd_component',
                'q1.gsd_percentage',
                'q2.rsb_id',
                'q2.barr_status',
                'q2.acaYear',
                'q2.cal_cohort',
                'q2.crs_name',
                'q2.crsCode',
                'q2.crs_credit',
                'q2.fk_cotDet',
                'q2.std_id',
                'q2.sti_name',
                'q2.pgmCode',
                'q2.rsb_status',
                'q2.cMark',
                'q2.tMark',
                'q2.grade',
                'q2.point',
                'q2.gsc_id',
                'q2.mark_generate'
            )
            ->get();


        // dd($obj);



        if (sizeof($obj) > 0) {

            return response()->json([
                'success' => true,
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        } else {

            return response()->json([
                'success' => false,
                'message' => 'List Failed!',
                'data' => $obj
            ], 400);
        }
        // dd($obj);            

    }


    // list by Academic Calendar year & sem
    public function listCalYearSem(Request $request)
    {
        $cur_year = $request->input('cur_year');
        $curYear = str_replace("-", "/", $cur_year);
        $cal_cohort = $request->input('cal_cohort');

        $obj = mis_std_regsubject::where([
            ['mis_std_regsubject.recordstatus', '!=', 'DEL'],
            ['rsb_status', 'Register'],
            ['mis_prm_calendar.cur_year', $cur_year],
            ['cal_cohort', $cal_cohort]
        ])
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
            ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_regsubject.aca_session')
            ->leftjoin('aca_cal_category', 'aca_cal_category.pk_id', '=', 'mis_prm_calendar.cal_category')
            ->groupBy('aca_session')
            ->groupBy('mis_std_regsubject.crs_code')
            ->get([
                'crs_name',
                'mis_std_regsubject.crs_code AS fk_crs',
                'mis_prm_course.crs_code AS crsCode',
                'mis_prm_calendar.cur_year AS cal_year',
                'cal_cohort',
                'cal_category',
                'category',
                'aca_session'
            ]);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    // list by Academic Calendar year & sem
    // public function reportinglistCalYearSem(Request $request)
    // {
    //     $cur_year = $request->input('cur_year');
    //     $curYear = str_replace("-", "/", $cur_year);
    //     $cal_cohort = $request->input('cal_cohort');

    //     $aca_cal_category = $request->input('aca_cal_category');
    //     $FK_fac = $request->input('FK_fac');

    //     $obj = DB::table('mis_exam_student')
    //         ->select([
    //             'mis_exam_student.fk_exam',
    //             'mis_exam_student.fk_venue',
    //             'mis_exam_student.fk_center',
    //             'mis_std_regsubject.crs_code',
    //             'mis_lecturer_course_prm.emp_id',
    //             'mis_exam_timetable.fk_acaCal',
    //             'mis_exam_timetable.tbl_paper_type',
    //             'mis_exam_timetable.tbl_date_start',
    //             'mis_exam_timetable.tbl_time_start',
    //             'mis_exam_timetable.tbl_time_end',
    //             'mis_prm_course.fac_id',
    //             'mis_prm_course.crs_code as code_sbject',
    //             'mis_prm_course.crs_name',
    //             'mis_prm_calendar.cur_year',
    //             'mis_prm_calendar.cal_cohort',
    //             'mis_prm_calendar.cal_category',
    //             'mis_prm_calendar.cal_intake',
    //             'mis_prm_course_cot_det.fk_pgm_det',
    //             'mis_prm_programme_det.dtp_id',
    //             'mis_prm_programme_det.pgm_id',
    //             'mis_prm_programme.pgm_id as pgm_code',
    //             'mis_prm_programme.pgm_name',
    //             'mis_prm_faculty.fac_name',
    //             'mis_prm_faculty.fac_id as fac_code',
    //             'mis_prm_calendar.cur_year',
    //             'mis_prm_calendar.cal_cohort',
                
    //             'aca_cal_category.category',
    //             'sad_users.usr_name',
    //             'mis_exam_center.cen_id',

    //             DB::raw('COUNT(*) as Total_Student'),
    //         ])
    //         ->leftJoin('mis_std_regsubject', 'mis_exam_student.fk_stdRegCrs', '=', 'mis_std_regsubject.rsb_id')
    //         ->leftJoin('mis_lecturer_course_prm', 'mis_std_regsubject.fk_cotDet', '=', 'mis_lecturer_course_prm.fk_cotDet')
    //         ->leftJoin('mis_exam_timetable', 'mis_exam_student.fk_exam', '=', 'mis_exam_timetable.pk_id')
    //         ->leftJoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
    //         ->leftJoin('mis_prm_calendar', 'mis_std_regsubject.aca_session', '=', 'mis_prm_calendar.cal_id')
    //         ->leftJoin('mis_prm_course_cot_det', 'mis_prm_course_cot_det.ccd_id', '=', 'mis_std_regsubject.fk_cotDet')
    //         ->leftJoin('mis_prm_programme_det', 'mis_prm_programme_det.dtp_id', '=', 'mis_prm_course_cot_det.fk_pgm_det')
    //         ->leftJoin('mis_prm_programme', 'mis_prm_programme_det.pgm_id', '=', 'mis_prm_programme.pk_id')
    //         ->leftJoin('mis_prm_faculty', 'mis_prm_faculty.pk_id', '=', 'mis_prm_course.fac_id')
    //         ->leftjoin('aca_cal_category', 'aca_cal_category.pk_id', '=', 'mis_prm_calendar.cal_category')
    //         ->leftjoin('sad_users', 'sad_users.usr_id', '=', 'mis_lecturer_course_prm.emp_id')
    //         ->leftjoin('mis_exam_center', 'mis_exam_center.pk_id', '=', 'mis_exam_student.fk_center')

    //         // ->where('mis_std_regsubject.aca_session', '=', 31)
    //         ->where('mis_prm_calendar.cur_year', '=', $cur_year) //'2022/2023'
    //         ->where('mis_prm_calendar.cal_cohort', '=', $cal_cohort)      //3   
    //         ->where('aca_cal_category.pk_id', $aca_cal_category)      //3   
    //         ->when($request->filled('FK_fac'), function ($query) use ($request) {
    //                     return $query->where('mis_prm_course.fac_id', $request->input('FK_fac'));
    //                 })
    //         // ->where('mis_prm_calendar.cur_year', '=', '2022/2023') //
    //         // ->where('mis_prm_calendar.cal_cohort', '=', 3   )      //
    //         // ->where('aca_cal_category.pk_id', $aca_cal_category) 
    //         ->where('mis_std_regsubject.recordstatus', '!=', 'DEL')
    //         ->where('mis_exam_student.recordstatus', '!=', 'DEL')
    //         ->whereNotNull('mis_exam_timetable.tbl_date_start')
            
    //         ->groupBy([
    //             'mis_exam_student.fk_exam',
    //             'mis_exam_student.fk_venue',
    //             'mis_exam_student.fk_center',
    //             'mis_std_regsubject.crs_code',
    //             'mis_lecturer_course_prm.emp_id',
    //             'mis_exam_timetable.fk_acaCal',
    //             'mis_exam_timetable.tbl_paper_type',
    //             'mis_exam_timetable.tbl_date_start',
    //             'mis_exam_timetable.tbl_time_start',
    //             'mis_exam_timetable.tbl_time_end',
    //             'mis_prm_course.fac_id',
    //             'mis_prm_course.crs_name',
    //             'mis_prm_calendar.cur_year',
    //             'mis_prm_calendar.cal_cohort',
    //             'mis_prm_calendar.cal_category',
    //             'mis_prm_course_cot_det.fk_pgm_det',
    //             'mis_prm_programme_det.dtp_id',
    //             'mis_prm_programme_det.pgm_id',
    //             'mis_prm_programme.pgm_id',
    //             'mis_prm_programme.pgm_name',
    //             'mis_prm_calendar.cal_intake'
    //         ])
    //         ->orderBy('mis_exam_timetable.tbl_date_start', 'ASC')
    //         ->orderBy('mis_exam_timetable.tbl_time_start', 'ASC')
    //         ->get();
    //     // dd('ss');

    //     $obj = DB::table('mis_exam_student')
    //         ->select([
    //             'mis_exam_student.fk_exam',
    //             'mis_exam_student.fk_venue',
    //             'mis_exam_student.fk_center',
    //             'mis_std_regsubject.crs_code',
    //             'mis_lecturer_course_prm.emp_id',
    //             // DB::raw('GROUP_CONCAT(DISTINCT mis_exam_invigilator.fk_lect) AS invigilator'),
    //             // DB::raw('GROUP_CONCAT(DISTINCT hrm_emp_info.emp_name) AS invigilator_name'),
    //             DB::raw('GROUP_CONCAT(DISTINCT 
    //             CASE WHEN mis_exam_invigilator.chief = "Yes" 
    //                  THEN hrm_emp_info.emp_name  
    //                  ELSE NULL 
    //             END) AS chief_invigilator'
    //             ),

    //             DB::raw('GROUP_CONCAT(DISTINCT 
    //             CASE WHEN mis_exam_invigilator.chief = "No" 
    //                  THEN mis_exam_invigilator.fk_lect 
    //                  ELSE NULL 
    //             END) AS invigilatorid'
    //             ),

    //             DB::raw('GROUP_CONCAT(DISTINCT 
    //                 NULLIF(
    //                     CASE WHEN mis_exam_invigilator.chief = "No" 
    //                         THEN hrm_emp_info.emp_name 
    //                         ELSE NULL 
    //                     END,
    //                     ""
    //                 ) SEPARATOR ", "
    //             ) AS invigilator'
    //             ),


    //             'mis_exam_timetable.fk_acaCal',
    //             'mis_exam_timetable.tbl_paper_type',
    //             'mis_exam_timetable.tbl_date_start',
    //             'mis_exam_timetable.tbl_time_start',
    //             'mis_exam_timetable.tbl_time_end',
    //             'mis_prm_course.fac_id',
    //             'mis_prm_course.crs_code as code_sbject',
    //             'mis_prm_course.crs_name',
    //             'mis_prm_calendar.cur_year',
    //             'mis_prm_calendar.cal_cohort',
    //             'mis_prm_calendar.cal_category',
    //             'mis_prm_calendar.cal_intake',
    //             'mis_prm_course_cot_det.fk_pgm_det',
    //             'mis_prm_programme_det.dtp_id',
    //             'mis_prm_programme_det.pgm_id',
    //             'mis_prm_programme.pgm_id as pgm_code',
    //             'mis_prm_programme.pgm_name',
    //             'mis_prm_faculty.fac_name',
    //             'mis_prm_faculty.fac_id as fac_code',
    //             'mis_prm_calendar.cur_year',
    //             'mis_prm_calendar.cal_cohort',
                
    //             'aca_cal_category.category',
    //             'sad_users.usr_name',
    //             'mis_exam_center.cen_id',

    //             DB::raw('COUNT(*) as Total_Student'),
    //         ])
    //         ->leftJoin('mis_std_regsubject', 'mis_exam_student.fk_stdRegCrs', '=', 'mis_std_regsubject.rsb_id')
    //         ->leftJoin('mis_lecturer_course_prm', 'mis_std_regsubject.fk_cotDet', '=', 'mis_lecturer_course_prm.fk_cotDet')
    //         ->leftJoin('mis_exam_timetable', 'mis_exam_student.fk_exam', '=', 'mis_exam_timetable.pk_id')
    //         ->leftJoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
    //         ->leftJoin('mis_prm_calendar', 'mis_std_regsubject.aca_session', '=', 'mis_prm_calendar.cal_id')
    //         ->leftJoin('mis_prm_course_cot_det', 'mis_prm_course_cot_det.ccd_id', '=', 'mis_std_regsubject.fk_cotDet')
    //         ->leftJoin('mis_prm_programme_det', 'mis_prm_programme_det.dtp_id', '=', 'mis_prm_course_cot_det.fk_pgm_det')
    //         ->leftJoin('mis_prm_programme', 'mis_prm_programme_det.pgm_id', '=', 'mis_prm_programme.pk_id')
    //         ->leftJoin('mis_prm_faculty', 'mis_prm_faculty.pk_id', '=', 'mis_prm_course.fac_id')
    //         ->leftJoin('mis_exam_invigilator', function ($join) {
    //             $join->on('mis_exam_invigilator.fk_exmTimetbl', '=', 'mis_exam_timetable.pk_id')
    //                  ->on('mis_exam_invigilator.fk_venue', '=', 'mis_exam_student.fk_venue');
    //         })
    //         ->leftjoin('aca_cal_category', 'aca_cal_category.pk_id', '=', 'mis_prm_calendar.cal_category')
    //         ->leftjoin('sad_users', 'sad_users.usr_id', '=', 'mis_lecturer_course_prm.emp_id')
    //         ->leftjoin('mis_exam_center', 'mis_exam_center.pk_id', '=', 'mis_exam_student.fk_center')
    //         ->leftJoin('hrm_emp_info', 'hrm_emp_info.emp_id', '=', 'mis_exam_invigilator.fk_lect')


    //         // ->where('mis_std_regsubject.aca_session', '=', 31)
    //         ->where('mis_prm_calendar.cur_year', '=', $cur_year) //'2022/2023'
    //         ->where('mis_prm_calendar.cal_cohort', '=', $cal_cohort)      //3   
    //         ->where('aca_cal_category.pk_id', $aca_cal_category)      //3   
    //         ->when($request->filled('FK_fac'), function ($query) use ($request) {
    //                     return $query->where('mis_prm_course.fac_id', $request->input('FK_fac'));
    //                 })
    //         // ->where('mis_prm_calendar.cur_year', '=', '2022/2023') //
    //         // ->where('mis_prm_calendar.cal_cohort', '=', 3   )      //
    //         // ->where('aca_cal_category.pk_id', $aca_cal_category) 
    //         ->where('mis_std_regsubject.recordstatus', '!=', 'DEL')
    //         ->where('mis_exam_student.recordstatus', '!=', 'DEL')
    //         ->whereNotNull('mis_exam_timetable.tbl_date_start')
            
    //         ->groupBy([
    //             'mis_exam_student.fk_exam',
    //             'mis_exam_student.fk_venue',
    //             'mis_exam_student.fk_center',
    //             'mis_std_regsubject.crs_code',
    //             'mis_lecturer_course_prm.emp_id',
    //             'mis_exam_timetable.fk_acaCal',
    //             'mis_exam_timetable.tbl_paper_type',
    //             'mis_exam_timetable.tbl_date_start',
    //             'mis_exam_timetable.tbl_time_start',
    //             'mis_exam_timetable.tbl_time_end',
    //             'mis_prm_course.fac_id',
    //             'mis_prm_course.crs_name',
    //             'mis_prm_calendar.cur_year',
    //             'mis_prm_calendar.cal_cohort',
    //             'mis_prm_calendar.cal_category',
    //             'mis_prm_course_cot_det.fk_pgm_det',
    //             'mis_prm_programme_det.dtp_id',
    //             'mis_prm_programme_det.pgm_id',
    //             'mis_prm_programme.pgm_id',
    //             'mis_prm_programme.pgm_name',
    //             'mis_prm_calendar.cal_intake'
    //         ])
    //         ->orderBy('mis_exam_timetable.tbl_date_start', 'ASC')
    //         ->orderBy('mis_exam_timetable.tbl_time_start', 'ASC')
    //         ->get();
    //         if ($obj->isEmpty()) {
    //             return response()->json([
    //                 'success' => false,
    //                 'message' => 'No data found!',
    //                 'data' => null,
    //             ], 404);
    //         } else {
    //             return response()->json([
    //                 'success' => true,
    //                 'message' => 'List Success!',
    //                 'data' => $obj,
    //             ], 200);
    //         }
    // }

    public function reportinglistCalYearSem(Request $request)
    {
        
        $cur_year = $request->input('cur_year');
        $cal_cohort = $request->input('cal_cohort');
        $aca_cal_category = $request->input('aca_cal_category');
        $FK_fac = $request->input('FK_fac');
    
        // $obj = DB::table('mis_exam_student')
        //     ->select([
        //         'mis_exam_student.fk_exam',
        //         'mis_exam_student.fk_venue',
        //         'mis_exam_student.fk_center',
        //         'mis_std_regsubject.crs_code',
        //         'mis_lecturer_course_prm.emp_id',
        //         'mis_exam_timetable.fk_acaCal',
        //         'mis_exam_timetable.tbl_paper_type',
        //         'mis_exam_timetable.tbl_date_start',
        //         'mis_exam_timetable.tbl_time_start',
        //         'mis_exam_timetable.tbl_time_end',
        //         'mis_prm_course.fac_id',
        //         'mis_prm_course.crs_code as code_sbject',
        //         'mis_prm_course.crs_name',
        //         'mis_prm_calendar.cur_year',
        //         'mis_prm_calendar.cal_cohort',
        //         'mis_prm_calendar.cal_category',
        //         // 'mis_prm_calendar.cal_intake',
        //         // 'mis_prm_course_cot_det.fk_pgm_det',
        //         // 'mis_prm_programme_det.dtp_id',
        //         'mis_prm_programme_det.pgm_id',
        //         'mis_prm_programme.pgm_id as pgm_code',
        //         'mis_prm_programme.pgm_name',
        //         'mis_prm_faculty.fac_name',
        //         'mis_prm_faculty.fac_id as fac_code',
        //         'mis_prm_calendar.cur_year',
        //         'mis_prm_calendar.cal_cohort',
        //         'aca_cal_category.category',
        //         'sad_users.usr_name',
        //         'mis_exam_center.cen_id',
        //         'mis_lecturer_course_prm.fk_cotDet',
        //         'mis_exam_papertype.paper_type',
        //         'mis_prm_course.crs_code',

        //         DB::raw('COUNT(*) as Total_Student'),
        //     ])
        //     ->leftJoin('mis_std_regsubject', 'mis_exam_student.fk_stdRegCrs', '=', 'mis_std_regsubject.rsb_id')
        //     ->leftJoin('mis_lecturer_course_prm', 'mis_std_regsubject.fk_cotDet', '=', 'mis_lecturer_course_prm.fk_cotDet')
        //     ->leftJoin('mis_exam_timetable', 'mis_exam_student.fk_exam', '=', 'mis_exam_timetable.pk_id')
        //     ->leftJoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
        //     ->leftJoin('mis_prm_calendar', 'mis_std_regsubject.aca_session', '=', 'mis_prm_calendar.cal_id')
        //     ->leftJoin('mis_prm_course_cot_det', 'mis_prm_course_cot_det.ccd_id', '=', 'mis_std_regsubject.fk_cotDet')
        //     ->leftJoin('mis_prm_programme_det', 'mis_prm_programme_det.dtp_id', '=', 'mis_prm_course_cot_det.fk_pgm_det')
        //     ->leftJoin('mis_prm_programme', 'mis_prm_programme_det.pgm_id', '=', 'mis_prm_programme.pk_id')
        //     ->leftJoin('mis_prm_faculty', 'mis_prm_faculty.pk_id', '=', 'mis_prm_course.fac_id')
        //     ->leftjoin('aca_cal_category', 'aca_cal_category.pk_id', '=', 'mis_prm_calendar.cal_category')
        //     ->leftjoin('sad_users', 'sad_users.usr_id', '=', 'mis_lecturer_course_prm.emp_id')
        //     ->leftjoin('mis_exam_center', 'mis_exam_center.pk_id', '=', 'mis_exam_student.fk_center')
        //     ->leftjoin('mis_exam_papertype', 'mis_exam_papertype.pk_id', '=', 'mis_exam_timetable.tbl_paper_type')
        //     ->where('mis_prm_calendar.cur_year', '=', $cur_year)
        //     ->where('mis_prm_calendar.cal_cohort', '=', $cal_cohort)
        //     ->where('aca_cal_category.pk_id', $aca_cal_category)
        //     ->when($request->filled('FK_fac'), function ($query) use ($request) {
        //         return $query->where('mis_prm_course.fac_id', $request->input('FK_fac'));
        //     })
        //     ->where('mis_std_regsubject.recordstatus', '!=', 'DEL')
        //     ->where('mis_exam_student.recordstatus', '!=', 'DEL')
        //     ->whereNotNull('mis_exam_timetable.tbl_date_start')
        //     ->groupBy([
        //         'mis_exam_student.fk_exam',
        //         'mis_exam_student.fk_venue',
        //         'mis_exam_student.fk_center',
        //         'mis_std_regsubject.crs_code',
        //         'mis_lecturer_course_prm.emp_id',
        //         'mis_exam_timetable.fk_acaCal',
        //         'mis_exam_timetable.tbl_paper_type',
        //         'mis_exam_timetable.tbl_date_start',
        //         'mis_exam_timetable.tbl_time_start',
        //         'mis_exam_timetable.tbl_time_end',
        //         'mis_prm_course.fac_id',
        //         'mis_prm_course.crs_name',
        //         'mis_prm_calendar.cur_year',
        //         'mis_prm_calendar.cal_cohort',
        //         'mis_prm_calendar.cal_category',
        //         // 'mis_prm_course_cot_det.fk_pgm_det',
        //         // 'mis_prm_programme_det.dtp_id',
        //         'mis_prm_programme_det.pgm_id',
        //         'mis_prm_programme.pgm_id',
        //         'mis_prm_programme.pgm_name',
        //         'mis_lecturer_course_prm.fk_cotDet',
        //         'mis_exam_papertype.paper_type',
        //         'mis_prm_course.crs_code',
        //         // 'mis_prm_calendar.cal_intake'
        //     ])
        //     ->orderBy('mis_exam_timetable.tbl_date_start', 'ASC')
        //     ->orderBy('mis_exam_timetable.tbl_time_start', 'ASC')
        //     ->get();
        //     // $obj2 = DB::table(DB::raw("({$obj->toSql()}) as temp"))
        //     // ->mergeBindings($obj->getBindings())
        //     // ->select([
        //     //     'temp.*',
        //     //     'mis_exam_invigilator.*',
        //     // ])
        //     // ->leftJoin('mis_exam_invigilator', function ($join) {
        //     //     $join->on('mis_exam_invigilator.fk_exmTimetbl', '=', 'temp.fk_exam')
        //     //         ->on('mis_exam_invigilator.fk_venue', '=', 'temp.fk_venue');
        //     // })
        //     // ->get();

        //     $obj2 = $obj->map(function ($item) {
        //         $invigilatorData = DB::table('mis_exam_invigilator')
        //             ->leftJoin('hrm_emp_info', 'hrm_emp_info.emp_id', '=', 'mis_exam_invigilator.fk_lect')
        //             ->where('mis_exam_invigilator.fk_exmTimetbl', $item->fk_exam)
        //             ->where('mis_exam_invigilator.fk_venue', $item->fk_venue)
        //             ->select([
        //                 'mis_exam_invigilator.fk_lect',
        //                 'hrm_emp_info.emp_name',
        //                 'mis_exam_invigilator.chief'
        //             ])
        //             ->get();
    
        //         return [
        //             'fk_exam' => $item->fk_exam,
        //             'fk_venue' => $item->fk_venue,
        //             'fk_center' => $item->fk_center,
        //             'crs_code' => $item->crs_code,
        //             'emp_id' => $item->emp_id,
        //             'fk_acaCal' => $item->fk_acaCal,
        //             'tbl_paper_type' => $item->tbl_paper_type,
        //             'tbl_date_start' => $item->tbl_date_start,
        //             'tbl_time_start' => $item->tbl_time_start,
        //             'tbl_time_end' => $item->tbl_time_end,
        //             'fac_id' => $item->fac_id,
        //             'code_sbject' => $item->code_sbject,
        //             'crs_name' => $item->crs_name,
        //             'cur_year' => $item->cur_year,
        //             'cal_cohort' => $item->cal_cohort,
        //             'cal_category' => $item->cal_category,
        //             // 'cal_intake' => $item->cal_intake,
        //             // 'fk_pgm_det' => $item->fk_pgm_det,
        //             // 'dtp_id' => $item->dtp_id,
        //             'pgm_id' => $item->pgm_id,
        //             'pgm_code' => $item->pgm_code,
        //             'pgm_name' => $item->pgm_name,
        //             'fac_name' => $item->fac_name,
        //             'fac_code' => $item->fac_code,
        //             'category' => $item->category,
        //             'usr_name' => $item->usr_name,
        //             'cen_id' => $item->cen_id,
        //             'Total_Student' => $item->Total_Student,
        //             'fk_cotDet' => $item->fk_cotDet,
        //             'paper_type' => $item->paper_type,
        //             'mis_prm_course.crs_code' => $item->paper_type,
                

        //             'invigilatorData' => $invigilatorData->map(function ($invigilator) {
        //                 return [
        //                     'fk_lect' => $invigilator->fk_lect,
        //                     'emp_name' => $invigilator->emp_name,
        //                     'chief' => $invigilator->chief,
        //                 ];
        //             }),
        //         ];
        //     });
        $obj = DB::table('mis_std_regsubject')
        // ->select(
        //     DB::raw('COUNT(mis_prm_course.crs_code) AS totalStudent'),
        //     'mis_std_regsubject.crs_code AS fk_Course',
        //     'mis_prm_course.crs_code',
        //     'mis_prm_course.crs_name',
        //     'mis_prm_calendar.cur_year AS cal_year',
        //     'mis_prm_calendar.cal_cohort',
        //     'mis_std_info.pgm_fk',
        //     'mis_prm_programme.pgm_id AS pgmCode',
        //     'mis_prm_programme.pgm_name',
        //     // 'sad_users.usr_name AS personInCharge',
        //     // DB::raw('GROUP_CONCAT(sad_users.usr_name) AS personInCharge'), // Aggregate usr_name values

        //     'mis_std_info.cur_intake',
        //     'mis_exam_timetable.pk_id AS fk_exam',
        //     'mis_exam_timetable.tbl_date_start',
        //     'mis_exam_timetable.tbl_time_start',
        //     'mis_exam_timetable.tbl_time_end',
        //     'mis_exam_student.fk_venue',
        //     'mis_exam_student.fk_center',
        //     'mis_prm_programme.fac_id',
        //     'mis_prm_faculty.fac_id AS fac_code',
        //     'mis_prm_faculty.fac_name',
        //     'mis_exam_timetable.tbl_paper_type',
        //     'mis_exam_papertype.paper_type',
        //     'mis_prm_calendar.cal_category',
        //     'mis_std_info.cam_id',
        //     'mis_exam_venue.fk_center',
        //     'mis_exam_venue.pk_id AS pk_venue',
        //     'mis_exam_student.recordstatus AS rsts_stdExam',
        //     'mis_exam_center.cen_id',
        //     'mis_exam_center.cen_type',

        //     'mis_std_regsubject.fk_cotDet'

            
        // )
        ->selectRaw('
        COUNT(mis_prm_course.crs_code) AS totalStudent,
        mis_std_regsubject.crs_code AS fk_Course,
        mis_prm_course.crs_code,
        mis_prm_course.crs_name,
        mis_prm_calendar.cur_year AS cal_year,
        mis_prm_calendar.cal_cohort,
        mis_std_info.pgm_fk,
        mis_prm_programme.pgm_id AS pgmCode,
        mis_prm_programme.pgm_name,
        mis_std_info.cur_intake,
        mis_exam_timetable.pk_id AS fk_exam,
        mis_exam_timetable.tbl_date_start,
        mis_exam_timetable.tbl_time_start,
        mis_exam_timetable.tbl_time_end,
        mis_exam_student.fk_venue,
        mis_exam_student.fk_center,
        mis_prm_programme.fac_id,
        mis_prm_faculty.fac_id AS fac_code,
        mis_prm_faculty.fac_name,
        mis_exam_timetable.tbl_paper_type,
        mis_exam_papertype.paper_type,
        mis_prm_calendar.cal_category,
        mis_std_info.cam_id,
        mis_exam_venue.fk_center,
        mis_exam_venue.pk_id AS pk_venue,
        mis_exam_student.recordstatus AS rsts_stdExam,
        mis_exam_center.cen_id,
        mis_exam_center.cen_type,

        mis_std_regsubject.fk_cotDet
        '
    )
        ->leftJoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
        ->leftJoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_regsubject.aca_session')
        ->leftJoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'mis_std_regsubject.std_studentid')
        ->leftJoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_std_info.pgm_fk')
        // ->leftJoin('mis_lecturer_course_prm', 'mis_lecturer_course_prm.fk_cotDet', '=', 'mis_std_regsubject.fk_cotDet')
        // ->leftJoin('sad_users', 'sad_users.usr_id', '=', 'mis_lecturer_course_prm.emp_id')
        ->leftJoin('mis_exam_timetable', function ($join) {
            $join->on('mis_std_regsubject.crs_code', '=', 'mis_exam_timetable.fk_course')
                ->on('mis_std_regsubject.aca_session', '=', 'mis_exam_timetable.fk_acaCal');
        })
        ->leftJoin('mis_exam_student', function ($join) {
            $join->on('mis_exam_student.fk_stdRegCrs', '=', 'mis_std_regsubject.rsb_id')
                ->on('mis_exam_student.fk_exam', '=', 'mis_exam_timetable.pk_id');
        })
        ->leftJoin('mis_exam_venue', function ($join) {
            $join->on('mis_exam_timetable.pk_id', '=', 'mis_exam_venue.fk_exam')
                // ->on('mis_std_info.cam_id', '=', 'mis_exam_venue.fk_campus')
                ;
        })
        ->leftJoin('mis_prm_faculty', 'mis_prm_faculty.pk_id', '=', 'mis_prm_programme.fac_id')
        ->leftJoin('mis_exam_papertype', 'mis_exam_papertype.pk_id', '=', 'mis_exam_timetable.tbl_paper_type')
        ->leftJoin('mis_exam_center', 'mis_exam_center.pk_id', '=', 'mis_exam_venue.fk_center')
        ->where('rsb_status', 'Register')
        ->where('cal_cohort',  $cal_cohort)
        ->where('mis_prm_calendar.cur_year',$cur_year)
        ->where('mis_prm_calendar.cal_category',$aca_cal_category)
        ->where('mis_std_regsubject.recordstatus', '!=', 'DEL')
        // ->where('mis_lecturer_course_prm.recordstatus', '!=', 'DEL')
        ->where('mis_exam_timetable.recordstatus', '!=', 'DEL')
        // ->where('mis_lecturer_course_prm.coordinator', '=', 'Yes')
        // ->where('mis_exam_student.recordstatus', '!=', 'DEL')
        ->where('mis_std_regsubject.barr_status', '!=', 'Barred')
        ->whereNotNull('mis_exam_timetable.tbl_date_start')
        // ->whereNotNull('mis_exam_center.cen_id')
        // ->whereNotNull('mis_exam_student.fk_venue')
        ->whereNotNull('mis_exam_timetable.tbl_paper_type')
        
        ->where('mis_prm_course.crs_name', 'NOT LIKE', '%'.'INDUSTRIAL TRAINING'.'%')
        // ->where('mis_prm_course.crs_code','=','MGT4093')
        ;
     
        // ->where('mis_exam_student.recordstatus', '!=', 'DEL')
        if ($FK_fac) {
            $obj->where('mis_prm_programme.fac_id', $FK_fac);
        }
        $obj->groupBy(
            'mis_std_regsubject.crs_code',
            'mis_prm_course.crs_code',
            'mis_prm_course.crs_name',
            'mis_prm_calendar.cur_year',
            'mis_prm_calendar.cal_cohort',
            'mis_std_info.pgm_fk',
            'mis_prm_programme.pgm_id',
            'mis_prm_programme.pgm_name',
            // 'sad_users.usr_name',
            'mis_std_info.cur_intake',
            'mis_exam_timetable.pk_id',
            'mis_exam_timetable.tbl_paper_type',
            'mis_exam_timetable.tbl_date_start',
            'mis_exam_timetable.tbl_time_start',
            'mis_exam_timetable.tbl_time_end',
            'mis_exam_student.fk_venue',
            'mis_exam_student.fk_center',
            'mis_prm_programme.fac_id',
            'mis_prm_faculty.fac_id',
            'mis_prm_faculty.fac_name',
            'mis_exam_papertype.paper_type',
            'mis_prm_calendar.cal_category',

            'mis_exam_student.recordstatus',
            'mis_std_info.cam_id',
            'mis_exam_venue.pk_id',
            'mis_exam_venue.fk_center',
            'mis_exam_center.cen_id',
            'mis_exam_center.cen_type',
            
            
            'mis_std_regsubject.fk_cotDet'
        )
        ->orderBy('mis_prm_course.crs_code')
        ->orderBy('mis_exam_timetable.tbl_date_start')
        ->orderBy('mis_exam_timetable.tbl_time_start')
        ->get();
        $result = $obj->get();
    //   dd($result);
        
      
// Fetching results for $obj2
$obj2 = $result->map(function ($item) {

    // dd( $item);
    $invigilatorData = DB::table('mis_exam_invigilator')
        ->leftJoin('hrm_emp_info', 'hrm_emp_info.emp_id', '=', 'mis_exam_invigilator.fk_lect')
        ->where('mis_exam_invigilator.fk_exmTimetbl', $item->fk_exam)
        // ->where('mis_exam_invigilator.fk_venue', $item->fk_venue )
        ->where(function($query) use ($item) {
            $query->where('mis_exam_invigilator.fk_venue', $item->fk_venue)
                ->orWhere('mis_exam_invigilator.fk_venue', $item->pk_venue);
        })
        ->where('mis_exam_invigilator.recordstatus', '!=', 'DEL')
        ->select([
            'mis_exam_invigilator.fk_lect',
            'hrm_emp_info.emp_name',
            'mis_exam_invigilator.chief'
        ])
        ->get();

    return [
        'totalStudent' => $item->totalStudent,
        'fk_Course' => $item->fk_Course,
        'crs_code' => $item->crs_code,
        'crs_name' => $item->crs_name,
        'cal_year' => $item->cal_year,
        'cal_cohort' => $item->cal_cohort,
        'pgm_fk' => $item->pgm_fk,
        'pgmCode' => $item->pgmCode,
        'pgm_name' => $item->pgm_name,
        // 'personInCharge' => $item->personInCharge,
        'fk_cotDet' => $item->fk_cotDet,
        

        'cur_intake' => $item->cur_intake,
        'fk_exam' => $item->fk_exam,
        'tbl_date_start' => $item->tbl_date_start,
        'tbl_time_start' => $item->tbl_time_start,
        'tbl_time_end' => $item->tbl_time_end,
        'fk_venue' => $item->fk_venue,
        'fk_center' => $item->fk_center,
        'fac_id' => $item->fac_id,
        'fac_code' => $item->fac_code,
        'fac_name' => $item->fac_name,
        'tbl_paper_type' => $item->tbl_paper_type,
        'paper_type' => $item->paper_type,
        'cal_category' => $item->cal_category,
        'cam_id' => $item->cam_id,
        'fk_center' => $item->fk_center,
        'pk_venue' => $item->pk_venue,
        'cen_id' => $item->cen_id,
        'cen_type' => $item->cen_type,
        'rsts_stdExam' => $item->rsts_stdExam,
        
        'invigilatorData' => $invigilatorData->map(function ($invigilator) {
            return [
                'fk_lect' => $invigilator->fk_lect,
                'emp_name' => $invigilator->emp_name,
                'chief' => $invigilator->chief,
            ];
        }),
    ];
});

// Sorting $obj2 by tbl_date_start and tbl_time_start
$obj2 = $obj2->sortBy(function ($item) {
    return [$item['tbl_date_start'], $item['tbl_time_start']];
});

// // Now, $obj2 is sorted. If you want to preserve the structure, you can convert it to a simple array.
// $obj3 = $obj2->values()->all();




// Mapping $obj2 to final result
$final = $obj2->map(function ($item) {

    $PiC = DB::table('mis_lecturer_course_prm')
        ->select(
            'mis_lecturer_course_prm.emp_id',
            'mis_lecturer_course_prm.coordinator',
            'mis_lecturer_course_prm.crs_code',
            'mis_lecturer_course_prm.final_exam',
            'hrm_emp_info.emp_name'
        )
        ->leftJoin('hrm_emp_info', 'hrm_emp_info.emp_id', '=', 'mis_lecturer_course_prm.emp_id')
        ->where('mis_lecturer_course_prm.coordinator', 'Yes')
        ->where('mis_lecturer_course_prm.recordstatus', '!=', 'DEL')
        ->where('mis_lecturer_course_prm.fk_cotDet', '=',  $item['fk_cotDet'])
        ->get();

    return [
        'totalStudent' => $item['totalStudent'],
        'fk_Course' => $item['fk_Course'],
        'crs_code' => $item['crs_code'],
        'crs_name' => $item['crs_name'],
        'cal_year' => $item['cal_year'],
        'cal_cohort' => $item['cal_cohort'],
        'pgm_fk' => $item['pgm_fk'],
        'pgmCode' => $item['pgmCode'],
        'pgm_name' => $item['pgm_name'],
        'fk_cotDet' => $item['fk_cotDet'],
        'cur_intake' => $item['cur_intake'],
        'fk_exam' => $item['fk_exam'],
        'tbl_date_start' => $item['tbl_date_start'],
        'tbl_time_start' => $item['tbl_time_start'],
        'tbl_time_end' => $item['tbl_time_end'],
        'fk_venue' => $item['fk_venue'],
        'fk_center' => $item['fk_center'],
        'fac_id' => $item['fac_id'],
        'fac_code' => $item['fac_code'],
        'fac_name' => $item['fac_name'],
        'tbl_paper_type' => $item['tbl_paper_type'],
        'paper_type' => $item['paper_type'],
        'cal_category' => $item['cal_category'],
        'cam_id' => $item['cam_id'],
        'pk_venue' => $item['pk_venue'],
        'cen_id' => $item['cen_id'],
        'cen_type' => $item['cen_type'],
        'rsts_stdExam' => $item['rsts_stdExam'],
        'invigilatorData' => $item['invigilatorData'],
        'personInCharge' => $PiC->map(function ($Person) {
            return [
                'emp_id' => $Person->emp_id,
                'coordinator' => $Person->coordinator,
                'crs_code' => $Person->crs_code,
                'final_exam' => $Person->final_exam,
                'emp_name' => $Person->emp_name,
                
            ];
        }),
    ];
});


// Now, $obj2 is sorted. If you want to preserve the structure, you can convert it to a simple array.
    $finalSusun = $final->values()->all();



        if ($result->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No data found!',
                'data' => null,
            ], 404);
        } else {
            return response()->json([
                'success' => true,
                'message' => 'List Success!',
                // 'data' => count($result),
                'data' => $finalSusun,
            ], 200);
        }
    }
    


    public function reportingGpaCgpa(Request $request)
    {
        $cur_year = $request->input('cur_year');
        $curYear = str_replace("-", "/", $cur_year);
        $cal_cohort = $request->input('cal_cohort');
        $aca_cal_category = $request->input('aca_cal_category');


        $obj = DB::table('mis_std_curAcademic')
            ->select(
                'mis_std_curAcademic.fk_acaCal',
                'mis_std_curAcademic.std_studentid',
                'mis_std_info.sti_name',
                'mis_std_curAcademic.std_semester',
                'mis_status.sts_status_name_en',
                'mis_prm_calendar.cur_year',
                'mis_prm_calendar.cal_cohort',
                'aca_cal_category.pk_id',
                'aca_cal_category.category',
                'mis_std_curAcademic.std_gpa', 'mis_std_curAcademic.std_cgpa'
            )
            ->leftJoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'mis_std_curAcademic.std_studentid')
            ->leftJoin('mis_status', 'mis_status.sts_status_id', '=', 'mis_std_info.status_academic')
            ->leftJoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_curAcademic.fk_acaCal')
            ->leftJoin('aca_cal_category', 'mis_prm_calendar.cal_category', '=', 'aca_cal_category.pk_id')
            ->where('mis_std_info.recordstatus', '!=', 'DEL')
            ->where('mis_std_curAcademic.recordstatus', '!=', 'DEL')
            ->where('mis_prm_calendar.cur_year', $curYear)
            ->where('mis_prm_calendar.cal_cohort', $cal_cohort)
            ->where('aca_cal_category.pk_id', $aca_cal_category)
            ->orderBy('mis_std_curAcademic.std_studentid', 'ASC')
            ->get();

    
            if ($obj->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No data found!',
                    'data' => null,
                ], 404);
            } else {
                return response()->json([
                    'success' => true,
                    'message' => 'List Success!',
                    'data' => $obj,
                ], 200);
            }
    }

    //summary student attendance
    public function summary_tmtDet(Request $request)
    {
        $fk_week = $request->input('fk_week');
        $crs_code = $request->input('crs_code');
        $aca_session = $request->input('aca_session');

        $objTotal = DB::table('mis_atd_attendance')
            ->select(DB::raw('COUNT(mis_atd_attendance.std_studentid) AS total_atd'), 'mis_atd_attendance.std_studentid')
            ->join('mis_atd_week', 'mis_atd_week.pk_id', '=', 'mis_atd_attendance.fk_week')
            ->where('mis_atd_week.fk_tmtDet', $fk_week)
            ->where('status_attend', 'Attend')
            ->groupBy('mis_atd_attendance.std_studentid')->get();

        $obj = mis_std_regsubject::join('mis_std_info', 'mis_std_info.std_studentid', '=', 'mis_std_regsubject.std_studentid')
            ->where('crs_code', $crs_code)
            ->where('aca_session', $aca_session)
            // ->orderBy('mis_std_info.std_studentid')
            ->get([
                'mis_std_regsubject.std_studentid',
                'aca_session',
                'reg_semester',
                'mis_std_info.pgm_id',
                'crs_code',
                'mis_std_info.sti_name',
            ]);

        $result = mis_atd_week::where('fk_tmtDet', '=', $fk_week)
            ->groupBy('fk_tmtDet')
            ->first([
                DB::RAW('COUNT(fk_tmtDet) AS total_week')
            ]);

        if (sizeof($objTotal) > 0) {
            return response()->json([
                'success' => true,
                'message' => 'Show Success!',
                'data' => $obj,
                'obj_total' => $objTotal,
                'total_week' => $result
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Bad Request',
                'data' => ''
            ], 400);
        }
    }


    public function summary_tmtDet2(Request $request)
    {
        $crs_code = $request->input('crs_code');
        $aca_session = $request->input('aca_session');
        $fk_lecturer = $request->input('fk_lecturer');



        $obj = mis_std_regsubject::selectRaw('
                COUNT(mis_atd_attendance.status_attend) AS total_class_recorded, 
                SUM(CASE WHEN mis_atd_attendance.status_attend = "Absent" THEN mis_atd_week.att_hour ELSE 0 END) AS sum_att_hour_absent,
                SUM(mis_atd_week.att_hour) AS total_att_hour,
                mis_std_regsubject.std_studentid, 
                crs_code, mis_std_info.pgm_id, mis_std_info.sti_name
            ')
            ->leftJoin('mis_atd_attendance', 'mis_atd_attendance.std_studentid', '=', 'mis_std_regsubject.std_studentid')
            ->leftJoin('mis_std_info', 'mis_std_regsubject.std_studentid', '=', 'mis_std_info.std_studentid')

            ->leftJoin('mis_atd_week', 'mis_atd_week.pk_id', '=', 'mis_atd_attendance.fk_week')
            ->leftJoin(DB::raw('(
                    SELECT
                        SUM(mis_atd_week.att_hour) AS att_hour,
                        mis_timetbl_det.fk_lecturer,
                        mis_timetable.fk_course
                    FROM
                        mis_atd_week
                        INNER JOIN mis_timetbl_det ON mis_timetbl_det.pk_id = mis_atd_week.fk_tmtDet
                        INNER JOIN mis_timetable ON mis_timetable.pk_id = mis_timetbl_det.fk_timetbl
                    WHERE
                        mis_timetable.fk_acaCal = "' . $aca_session . '"
                        AND mis_timetable.fk_course = "' . $crs_code . '"
                        AND mis_timetbl_det.fk_lecturer = "' . $fk_lecturer . '"
                        AND mis_atd_week.recordstatus != "DEL"
                    GROUP BY
                        mis_timetbl_det.fk_lecturer,
                        mis_timetable.fk_course
                ) k'), 'k.fk_course', '=', 'mis_std_regsubject.crs_code')
            ->where('aca_session', $aca_session)
            ->where('crs_code', $crs_code)
            ->where('mis_std_regsubject.rsb_status' ,'!=','Drop')
            ->groupBy('mis_std_regsubject.std_studentid', 'crs_code', 'mis_std_info.pgm_id', 'mis_std_info.sti_name')
            ->orderBy('mis_std_regsubject.std_studentid','asc')
            ->get();

        $thour = DB::table('mis_atd_week')
            ->select(
                DB::raw('SUM(mis_atd_week.att_hour) AS att_hour_subject'),
                // 'mis_timetbl_det.fk_lecturer',
                // 'mis_timetable.fk_course'
            )
            ->join('mis_timetbl_det', 'mis_timetbl_det.pk_id', '=', 'mis_atd_week.fk_tmtDet')
            ->join('mis_timetable', 'mis_timetable.pk_id', '=', 'mis_timetbl_det.fk_timetbl')
            ->where('mis_timetable.fk_acaCal', '=', $aca_session)
            ->where('mis_timetable.fk_course', '=', $crs_code)
            ->where('mis_timetbl_det.fk_lecturer', '=', $fk_lecturer)
            ->where('mis_atd_week.recordstatus', '!=', 'DEL')
            ->groupBy('mis_timetbl_det.fk_lecturer', 'mis_timetable.fk_course')
            ->first();

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => 'List Success!',
                'data' => $obj,
                'thour' => $thour

            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'List Not Found!',
                'data' => ''
            ], 400);
        }
    }

    public function summary_tmtDet3(Request $request)
    {
        $crs_code = $request->input('crs_code');
        $aca_session = $request->input('aca_session');
        $std_studentid = $request->input('std_studentid');

        $obj = DB::table('mis_std_regsubject')
            ->leftJoin('mis_atd_attendance', 'mis_atd_attendance.std_studentid', '=', 'mis_std_regsubject.std_studentid')
            ->leftJoin('mis_std_info', 'mis_std_regsubject.std_studentid', '=', 'mis_std_info.std_studentid')
            ->leftJoin('mis_atd_week', 'mis_atd_week.pk_id', '=', 'mis_atd_attendance.fk_week')
            ->leftJoin(DB::raw('(SELECT
                        SUM(mis_atd_week.att_hour) AS att_hour,
                        mis_timetbl_det.fk_lecturer,
                        mis_timetable.fk_course
                    FROM
                        mis_atd_week
                    INNER JOIN mis_timetbl_det ON mis_timetbl_det.pk_id = mis_atd_week.fk_tmtDet
                    INNER JOIN mis_timetable ON mis_timetable.pk_id = mis_timetbl_det.fk_timetbl
                    WHERE
                        mis_timetable.fk_acaCal = "' . $aca_session . '"
                        AND mis_timetable.fk_course = "' . $crs_code . '"
                        AND mis_atd_week.recordstatus != "DEL"
                    GROUP BY
                        mis_timetbl_det.fk_lecturer,
                        mis_timetable.fk_course
                ) as k'), 'k.fk_course', '=', 'mis_std_regsubject.crs_code')
            ->where('aca_session', $aca_session)
            ->where('crs_code', $crs_code)
            ->where('mis_std_regsubject.std_studentid', $std_studentid)
            ->groupBy('mis_std_regsubject.std_studentid', 'crs_code', 'mis_std_info.pgm_id', 'mis_std_info.sti_name')
            ->selectRaw('COUNT(mis_atd_attendance.status_attend) as total_class_recorded')
            ->selectRaw('SUM(CASE WHEN mis_atd_attendance.status_attend = "Absent" THEN mis_atd_week.att_hour ELSE 0 END) as sum_att_hour_absent')
            ->selectRaw('SUM(mis_atd_week.att_hour) as total_att_hour')
            ->first();

        $thour = DB::table('mis_atd_week')
            ->select(DB::raw('SUM(mis_atd_week.att_hour) AS att_hour_subject'))
            ->join('mis_timetbl_det', 'mis_timetbl_det.pk_id', '=', 'mis_atd_week.fk_tmtDet')
            ->join('mis_timetable', 'mis_timetable.pk_id', '=', 'mis_timetbl_det.fk_timetbl')
            ->where('mis_timetable.fk_acaCal', $aca_session)
            ->where('mis_timetable.fk_course', $crs_code)
            ->where('mis_atd_week.recordstatus', '!=', 'DEL')
            ->groupBy('mis_timetbl_det.fk_lecturer', 'mis_timetable.fk_course')
            ->first();


        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => 'List Success!',
                'data' => $obj,
                'thour' => $thour

            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'List Not Found!',
                'data' => ''
            ], 400);
        }
    }

    public function attendance(Request $request)
    {
        $crs_code = $request->input('crs_code');
        $aca_session = $request->input('aca_session');
        $fk_lecturer = $request->input('fk_lecturer');
        $std_studentid = $request->input('std_studentid');



        $obj = DB::table('mis_std_regsubject')
            ->select([
                DB::raw('COUNT(mis_atd_attendance.status_attend) AS total_class_recorded'),
                DB::raw('SUM(CASE WHEN mis_atd_attendance.status_attend = "Absent" THEN mis_atd_week.att_hour ELSE 0 END) AS sum_att_hour_absent'),
                DB::raw('SUM(mis_atd_week.att_hour) AS total_att_hour'),
                'mis_std_regsubject.std_studentid',
                'mis_std_regsubject.crs_code',
                'mis_std_info.pgm_id',
                'mis_std_info.sti_name',
            ])
            ->leftJoin('mis_atd_attendance', 'mis_atd_attendance.std_studentid', '=', 'mis_std_regsubject.std_studentid')
            ->leftJoin('mis_std_info', 'mis_std_regsubject.std_studentid', '=', 'mis_std_info.std_studentid')
            ->leftJoin('mis_atd_week', 'mis_atd_week.pk_id', '=', 'mis_atd_attendance.fk_week')
            ->leftJoin('mis_lecturer_course_prm', 'mis_lecturer_course_prm.fk_cotDet', '=', 'mis_std_regsubject.fk_cotDet')
            ->leftJoin(DB::raw('(SELECT
                                    SUM(mis_atd_week.att_hour) AS att_hour,
                                    mis_timetbl_det.fk_lecturer,
                                    mis_timetable.fk_course
                                FROM mis_atd_week
                                INNER JOIN mis_timetbl_det ON mis_timetbl_det.pk_id = mis_atd_week.fk_tmtDet
                                INNER JOIN mis_timetable ON mis_timetable.pk_id = mis_timetbl_det.fk_timetbl
                                WHERE mis_timetable.fk_acaCal = "' . $aca_session . '"
                                AND mis_timetable.fk_course = "' . $crs_code . '"
                                AND mis_timetbl_det.fk_lecturer = "' . $fk_lecturer . '"
                                AND mis_atd_week.recordstatus != "DEL"
                                GROUP BY mis_timetbl_det.fk_lecturer, mis_timetable.fk_course) as k'), function ($join) use ($fk_lecturer) {
                $join->on('k.fk_course', '=', 'mis_std_regsubject.crs_code')
                    ->where('k.fk_lecturer', '=', $fk_lecturer);
            })
            ->where('mis_std_regsubject.aca_session', $aca_session)
            ->where('mis_std_regsubject.crs_code', $crs_code)
            ->where('mis_std_regsubject.std_studentid', $std_studentid)
            ->groupBy('mis_std_regsubject.std_studentid', 'crs_code', 'mis_std_info.pgm_id', 'mis_std_info.sti_name')
            ->first();




        $thour = DB::table('mis_atd_week')
            ->select(
                DB::raw('SUM(mis_atd_week.att_hour) AS att_hour_subject'),
                // 'mis_timetbl_det.fk_lecturer',
                // 'mis_timetable.fk_course'
            )
            ->join('mis_timetbl_det', 'mis_timetbl_det.pk_id', '=', 'mis_atd_week.fk_tmtDet')
            ->join('mis_timetable', 'mis_timetable.pk_id', '=', 'mis_timetbl_det.fk_timetbl')
            ->where('mis_timetable.fk_acaCal', '=', $aca_session)
            ->where('mis_timetable.fk_course', '=', $crs_code)
            // ->where('mis_timetbl_det.fk_lecturer', '=', $fk_lecturer)
            ->where('mis_atd_week.recordstatus', '!=', 'DEL')
            ->groupBy('mis_timetbl_det.fk_lecturer', 'mis_timetable.fk_course')
            ->first();

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => 'List Success!',
                'data' => $obj,
                'thour' => $thour

            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'List Not Found!',
                'data' => ''
            ], 400);
        }
    }

    public function stdListAtend(Request $request)
    {
        $fk_week = $request->input('fk_week');
        $crs_code = $request->input('crs_code');
        $aca_session = $request->input('aca_session');

        $obj = mis_std_regsubject::join('mis_std_info AS msi', 'msi.std_studentid', '=', 'mis_std_regsubject.std_studentid')
            ->leftJoin('mis_atd_attendance AS maa', function ($join) use ($fk_week) {
                $join->on('maa.std_studentid', '=', 'mis_std_regsubject.std_studentid')
                    ->where('fk_week', $fk_week)
                    ->where('maa.recordstatus', '!=', 'DEL');
            })
            ->where('crs_code', $crs_code)
            ->where('aca_session', $aca_session)
            ->where('mis_std_regsubject.rsb_status', '!=', 'Drop')
            ->get([
                'msi.std_studentid',
                'msi.sti_name',
                'msi.pgm_id',
                'maa.atd_id',
                'maa.status_attend',
                'maa.remark',
            ]);

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'List Not Found!',
                'data' => ''
            ], 400);
        }
    }

    public function curAcaIP(Request $request){
        $cal_cohort = $request->input('cal_cohort');
        $cur_year = $request->input('cur_year');

        $obj = mis_std_regsubject::
        leftJoin('mis_prm_calendar','mis_prm_calendar.cal_id','mis_std_regsubject.aca_session')
        ->where('mis_prm_calendar.cur_year',$cur_year)
        ->where('mis_prm_calendar.cal_cohort',$cal_cohort)
        ->where('ip','checked')
        ->get([
            'std_studentid',
            'rsb_status',
            'ip',
            'mrf',
            'mis_prm_calendar.cur_year',            
        ]);

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'List Not Found!',
                'data' => ''
            ], 400);
        }        
    }


    public function listcourseByID($std_studentid){



        $obj = mis_std_regsubject::
            where([['mis_std_regsubject.std_studentid', $std_studentid], ['mis_std_regsubject.recordstatus', '!=', 'DEL']])
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
            ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_regsubject.aca_session')
            ->leftjoin('aca_cal_category', 'aca_cal_category.pk_id', '=', 'mis_prm_calendar.cal_category')
            // ->orderBy('mis_std_regsubject.aca_session')
            ->orderBy('mis_std_regsubject.crs_code')
            ->get(
                [
                    'mis_std_regsubject.rsb_id',
                    'crs_name',
                    'mis_std_regsubject.crs_code AS fk_crs',
                    'mis_prm_course.crs_code AS crsCode',
                    'mis_prm_calendar.cur_year AS cal_year',
                    'cal_cohort',
                    'cal_category',
                    'category',
                    'aca_session',
                    'mis_prm_course.pk_id AS fk_course'
                ]
            );

       
        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'List Not Found!',
                'data' => ''
            ], 400);
        }        
    }

    public function attendanceStudent(Request $request)
    {
        $studentID = $request->input('std_id');
        $acacal = $request->input('acaCal');
        // $aca_session = $request->input('aca_session');

        // $studentID = 'FIB09230003';
        // $acacal = 44;

        $obj = mis_atd_attendance::select(
                'SQL1.fk_acaCal',
                'SQL1.fk_course',
                'SQL1.crs_name',
                'SQL1.crs_code',
                'SQL1.rsb_status',
                'SQL1.week_count',
                'SQL1.total_atd as totalWeekAttend',
                'SQL1.total_absent',
                'SQL1.total_attendance_hours as totalHourAttend',
                'SQL2.Total_week_count AS CourseTotalWeek',
                'SQL2.total_attendance_hours AS CourseTotalHour',
                DB::raw('ROUND((SQL1.total_attendance_hours / SQL2.total_attendance_hours * 100)) as total_attend')
            )
            ->fromSub(function ($query) use ($studentID, $acacal) {
                $query->select(
                    'mis_timetable.fk_acaCal',
                    'mis_timetable.fk_course',
                    'mis_prm_course.crs_name',
                    'mis_prm_course.crs_code',
                    DB::raw('COUNT(mis_atd_week.att_week) AS week_count'),
                    DB::raw('COALESCE(SUM(CASE WHEN status_attend = "Attend" OR status_attend = "Excuse" THEN 1 ELSE 0 END), 0) AS total_atd'),
                    DB::raw('COALESCE(COUNT(CASE WHEN status_attend = "Absent" THEN 1 ELSE NULL END), 0) AS total_absent'),
                    DB::raw('SUM(mis_atd_week.att_hour) AS total_attendance_hours'),
                    'mis_std_regsubject.rsb_status'
                )
                ->from('mis_atd_attendance')
                ->leftJoin('mis_atd_week', 'mis_atd_attendance.fk_week', '=', 'mis_atd_week.pk_id')
                ->leftJoin('mis_timetbl_det', 'mis_atd_attendance.fk_tmtDet', '=', 'mis_timetbl_det.pk_id')
                ->leftJoin('mis_timetable', 'mis_timetbl_det.fk_timetbl', '=', 'mis_timetable.pk_id')
                ->leftJoin('mis_std_regsubject', function ($join) {
                    $join->on('mis_std_regsubject.aca_session', '=', 'mis_timetable.fk_acaCal')
                        ->on('mis_std_regsubject.crs_code', '=', 'mis_timetable.fk_course')
                        ->on('mis_std_regsubject.std_studentid', '=', 'mis_atd_attendance.std_studentid');
                })
                ->leftJoin('mis_prm_course', 'mis_std_regsubject.crs_code', '=', 'mis_prm_course.pk_id')
                ->where('mis_atd_attendance.std_studentid', $studentID)
                ->where('mis_std_regsubject.aca_session', $acacal)
                ->where('mis_atd_week.recordstatus', '!=', 'DEL')
                ->groupBy('mis_timetable.fk_acaCal', 'mis_timetable.fk_course', 'mis_prm_course.crs_name', 'mis_std_regsubject.rsb_status');
            }, 'SQL1')
            ->joinSub(function ($query) use ($studentID, $acacal) {
                $query->select(
                    'mis_timetable.fk_acaCal',
                    'mis_timetable.fk_course',
                    DB::raw('COUNT(mis_atd_week.att_week) AS Total_week_count'),
                    DB::raw('SUM(mis_atd_week.att_hour) AS total_attendance_hours')
                )
                ->from('mis_atd_week')
                ->leftJoin('mis_timetbl_det', 'mis_atd_week.fk_tmtDet', '=', 'mis_timetbl_det.pk_id')
                ->leftJoin('mis_timetable', 'mis_timetbl_det.fk_timetbl', '=', 'mis_timetable.pk_id')
                ->joinSub(function ($subquery) use ($studentID, $acacal) {
                    $subquery->select(
                        DB::raw('DISTINCT fk_acaCal'),
                        DB::raw('fk_course')
                    )
                    ->fromSub(function ($innerQuery) use ($studentID, $acacal) {
                        $innerQuery->select(
                            'mis_timetable.fk_acaCal',
                            'mis_timetable.fk_course',
                            'mis_prm_course.crs_name',
                            DB::raw('COUNT(mis_atd_week.att_week) AS week_count'),
                            DB::raw('COALESCE(SUM(CASE WHEN status_attend = "Attend" OR status_attend = "Excuse" THEN 1 ELSE 0 END), 0) AS total_atd'),
                            DB::raw('COALESCE(COUNT(CASE WHEN status_attend = "Absent" THEN 1 ELSE NULL END), 0) AS total_absent'),
                            DB::raw('SUM(mis_atd_week.att_hour) AS total_attendance_hours')
                        )
                        ->from('mis_atd_attendance')
                        ->leftJoin('mis_atd_week', 'mis_atd_attendance.fk_week', '=', 'mis_atd_week.pk_id')
                        ->leftJoin('mis_timetbl_det', 'mis_atd_attendance.fk_tmtDet', '=', 'mis_timetbl_det.pk_id')
                        ->leftJoin('mis_timetable', 'mis_timetbl_det.fk_timetbl', '=', 'mis_timetable.pk_id')
                        ->leftJoin('mis_std_regsubject', function ($join) {
                            $join->on('mis_std_regsubject.aca_session', '=', 'mis_timetable.fk_acaCal')
                                ->on('mis_std_regsubject.crs_code', '=', 'mis_timetable.fk_course')
                                ->on('mis_std_regsubject.std_studentid', '=', 'mis_atd_attendance.std_studentid');
                        })
                        ->leftJoin('mis_prm_course', 'mis_std_regsubject.crs_code', '=', 'mis_prm_course.pk_id')
                        ->where('mis_atd_attendance.std_studentid', $studentID)
                        ->where('mis_std_regsubject.aca_session', $acacal)
                        ->where('mis_atd_week.recordstatus', '!=', 'DEL')
                        ->groupBy('mis_timetable.fk_acaCal', 'mis_timetable.fk_course', 'mis_prm_course.crs_name', 'mis_prm_course.crs_code');
                    }, 'SQL1');
                }, 'subquery', function ($join) {
                    $join->on('mis_timetable.fk_acaCal', '=', 'subquery.fk_acaCal')
                        ->on('mis_timetable.fk_course', '=', 'subquery.fk_course');
                })
                ->where('mis_atd_week.recordstatus', '!=', 'DEL')
                ->groupBy('mis_timetable.fk_acaCal', 'mis_timetable.fk_course');
            }, 'SQL2', function ($join) {
                $join->on('SQL1.fk_acaCal', '=', 'SQL2.fk_acaCal')
                    ->on('SQL1.fk_course', '=', 'SQL2.fk_course');
            })
            ->get();
        


        if ($obj) {
        // if (sizeof($obj)>0)   {
            return response()->json([
                'success' => true,
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'List Not Found!',
                'data' => ''
            ], 400);
        }
    }


    // public function attendanceStudent(Request $request)
    // {
    //     $studentID = $request->input('std_id');
    //     $acacal = $request->input('acaCal');
    //     // $aca_session = $request->input('aca_session');

    //     // $studentID = 'FIB09230003';
    //     // $acacal = 44;

    //     $obj = mis_atd_attendance::select(
    //             'SQL1.fk_acaCal',
    //             'SQL1.fk_course',
    //             'SQL1.crs_name',
    //             'SQL1.crs_code',
    //             'SQL1.rsb_status',
    //             'SQL1.week_count',
    //             'SQL1.total_atd as totalWeekAttend',
    //             'SQL1.total_absent',
    //             'SQL1.total_attendance_hours as totalHourAttend',
    //             'SQL2.Total_week_count AS CourseTotalWeek',
    //             'SQL2.total_attendance_hours AS CourseTotalHour',
    //             \DB::raw('ROUND((SQL1.total_attendance_hours / SQL2.total_attendance_hours * 100)) as total_attend')
    //         )
    //         ->fromSub(function ($query) use ($studentID, $acacal) {
    //             $query->select(
    //                 'mis_timetable.fk_acaCal',
    //                 'mis_timetable.fk_course',
    //                 'mis_prm_course.crs_name',
    //                 'mis_prm_course.crs_code',
    //                 \DB::raw('COUNT(mis_atd_week.att_week) AS week_count'),
    //                 \DB::raw('COALESCE(SUM(CASE WHEN status_attend = "Attend" OR status_attend = "Excuse" THEN 1 ELSE 0 END), 0) AS total_atd'),
    //                 \DB::raw('COALESCE(COUNT(CASE WHEN status_attend = "Absent" THEN 1 ELSE NULL END), 0) AS total_absent'),
    //                 \DB::raw('SUM(mis_atd_week.att_hour) AS total_attendance_hours'),
    //                 'mis_std_regsubject.rsb_status'
    //             )
    //             ->from('mis_atd_attendance')
    //             ->leftJoin('mis_atd_week', 'mis_atd_attendance.fk_week', '=', 'mis_atd_week.pk_id')
    //             ->leftJoin('mis_timetbl_det', 'mis_atd_attendance.fk_tmtDet', '=', 'mis_timetbl_det.pk_id')
    //             ->leftJoin('mis_timetable', 'mis_timetbl_det.fk_timetbl', '=', 'mis_timetable.pk_id')
    //             ->leftJoin('mis_std_regsubject', function ($join) {
    //                 $join->on('mis_std_regsubject.aca_session', '=', 'mis_timetable.fk_acaCal')
    //                     ->on('mis_std_regsubject.crs_code', '=', 'mis_timetable.fk_course')
    //                     ->on('mis_std_regsubject.std_studentid', '=', 'mis_atd_attendance.std_studentid');
    //             })
    //             ->leftJoin('mis_prm_course', 'mis_std_regsubject.crs_code', '=', 'mis_prm_course.pk_id')
    //             ->where('mis_atd_attendance.std_studentid', $studentID)
    //             ->where('mis_std_regsubject.aca_session', $acacal)
    //             ->where('mis_atd_week.recordstatus', '!=', 'DEL')
    //             ->groupBy('mis_timetable.fk_acaCal', 'mis_timetable.fk_course', 'mis_prm_course.crs_name', 'mis_std_regsubject.rsb_status');
    //         }, 'SQL1')
    //         ->joinSub(function ($query) use ($studentID, $acacal) {
    //             $query->select(
    //                 'mis_timetable.fk_acaCal',
    //                 'mis_timetable.fk_course',
    //                 \DB::raw('COUNT(mis_atd_week.att_week) AS Total_week_count'),
    //                 \DB::raw('SUM(mis_atd_week.att_hour) AS total_attendance_hours')
    //             )
    //             ->from('mis_atd_week')
    //             ->leftJoin('mis_timetbl_det', 'mis_atd_week.fk_tmtDet', '=', 'mis_timetbl_det.pk_id')
    //             ->leftJoin('mis_timetable', 'mis_timetbl_det.fk_timetbl', '=', 'mis_timetable.pk_id')
    //             ->joinSub(function ($subquery) use ($studentID, $acacal) {
    //                 $subquery->select(
    //                     \DB::raw('DISTINCT fk_acaCal'),
    //                     \DB::raw('fk_course')
    //                 )
    //                 ->fromSub(function ($innerQuery) use ($studentID, $acacal) {
    //                     $innerQuery->select(
    //                         'mis_timetable.fk_acaCal',
    //                         'mis_timetable.fk_course',
    //                         'mis_prm_course.crs_name',
    //                         \DB::raw('COUNT(mis_atd_week.att_week) AS week_count'),
    //                         \DB::raw('COALESCE(SUM(CASE WHEN status_attend = "Attend" OR status_attend = "Excuse" THEN 1 ELSE 0 END), 0) AS total_atd'),
    //                         \DB::raw('COALESCE(COUNT(CASE WHEN status_attend = "Absent" THEN 1 ELSE NULL END), 0) AS total_absent'),
    //                         \DB::raw('SUM(mis_atd_week.att_hour) AS total_attendance_hours')
    //                     )
    //                     ->from('mis_atd_attendance')
    //                     ->leftJoin('mis_atd_week', 'mis_atd_attendance.fk_week', '=', 'mis_atd_week.pk_id')
    //                     ->leftJoin('mis_timetbl_det', 'mis_atd_attendance.fk_tmtDet', '=', 'mis_timetbl_det.pk_id')
    //                     ->leftJoin('mis_timetable', 'mis_timetbl_det.fk_timetbl', '=', 'mis_timetable.pk_id')
    //                     ->leftJoin('mis_std_regsubject', function ($join) {
    //                         $join->on('mis_std_regsubject.aca_session', '=', 'mis_timetable.fk_acaCal')
    //                             ->on('mis_std_regsubject.crs_code', '=', 'mis_timetable.fk_course')
    //                             ->on('mis_std_regsubject.std_studentid', '=', 'mis_atd_attendance.std_studentid');
    //                     })
    //                     ->leftJoin('mis_prm_course', 'mis_std_regsubject.crs_code', '=', 'mis_prm_course.pk_id')
    //                     ->where('mis_atd_attendance.std_studentid', $studentID)
    //                     ->where('mis_std_regsubject.aca_session', $acacal)
    //                     ->where('mis_atd_week.recordstatus', '!=', 'DEL')
    //                     ->groupBy('mis_timetable.fk_acaCal', 'mis_timetable.fk_course', 'mis_prm_course.crs_name', 'mis_prm_course.crs_code');
    //                 }, 'SQL1');
    //             }, 'subquery', function ($join) {
    //                 $join->on('mis_timetable.fk_acaCal', '=', 'subquery.fk_acaCal')
    //                     ->on('mis_timetable.fk_course', '=', 'subquery.fk_course');
    //             })
    //             ->where('mis_atd_week.recordstatus', '!=', 'DEL')
    //             ->groupBy('mis_timetable.fk_acaCal', 'mis_timetable.fk_course');
    //         }, 'SQL2', function ($join) {
    //             $join->on('SQL1.fk_acaCal', '=', 'SQL2.fk_acaCal')
    //                 ->on('SQL1.fk_course', '=', 'SQL2.fk_course');
    //         })
    //         ->get();
        


    //     if ($obj) {
    //     // if (sizeof($obj)>0)   {
    //         return response()->json([
    //             'success' => true,
    //             'message' => 'List Success!',
    //             'data' => $obj
    //         ], 200);
    //     } else {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'List Not Found!',
    //             'data' => ''
    //         ], 400);
    //     }
    // }

    public function warningLetter(Request $request)
    {
        $studentID = $request->input('std_id');
        $acacal = $request->input('acaCal');
        
        $obj = mis_std_regsubject::select('mis_std_regsubject.rsb_id', 'mis_prm_course.crs_code', 'mis_prm_course.crs_name', 'mis_std_regsubject.rsb_type', 'mis_std_regsubject.rsb_status', 'mis_std_regsubject.warningLetter_1', 'mis_std_regsubject.warningLetter_2', 'mis_std_regsubject.warningLetter_3') 
        ->leftJoin('mis_prm_course', 'mis_std_regsubject.crs_code', '=', 'mis_prm_course.pk_id')
        ->where('mis_std_regsubject.std_studentid', $studentID)
        ->where('mis_std_regsubject.aca_session', $acacal)
        ->where('mis_std_regsubject.recordstatus', '!=', 'DEL')
        ->get();

        // if ($obj) {
        if (sizeof($obj)>0)   {
            return response()->json([
                'success' => true,
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'List Not Found!',
                'data' => ''
            ], 400);
        }
    }

    public function warningLetterUpload(Request $request)
    {
        $studentID = $request->input('StudentID');
        $WL_ID = $request->input('WL_ID');
        $rsbID = $request->input('rsbID');


        if ($request->hasFile('WLfile')) {
            $fileName = $request->file('WLfile')->getClientOriginalName();
            $fileName = $studentID . '_WarningLetter'. $WL_ID . '_'.$fileName;

            $path = 'warningLetter';
            $destinationPath = $path; // upload path
            // dd($destinationPath);

            $request->file('WLfile')->move($destinationPath, $fileName);

    
            $obj = mis_std_regsubject::where('rsb_id', $rsbID)->update([
                'warningLetter_' . $WL_ID => $fileName
            ]);
    
            if ($obj) {
                
                    return response()->json([
                        'success' => true,
                        'message' => 'Kemaskini Rekod Berjaya!',
                        'data' => $obj,
                    ], 200);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Update Failed!',
                    'data' => null,
                ]);
            }
        } else {
            return response()->json([
                'success' => false,
                'message' => 'No file uploaded',
                'data' => null,
            ], 400);
        }

      
    }




    // list Course Evaluation by Semester
    public function cteListByCourseAcacal(Request $request)
    {
        $std_studentid = $request->input('std_studentid');
        $aca_session = $request->input('aca_session');
        $obj = mis_std_regsubject::
        select('picoms_cte_stdFeedback.pk_cte_feedback','picoms_cte_stdFeedback.fk_cte_question','picoms_cte_stdFeedback.feedback_std','mis_std_regsubject.rsb_id', 'mis_prm_course.crs_code', 'mis_prm_course.crs_name', 'mis_std_regsubject.rsb_type', 'mis_std_regsubject.rsb_status', 'mis_std_regsubject.warningLetter_1', 'mis_std_regsubject.warningLetter_2', 'mis_std_regsubject.warningLetter_3') 
        ->leftJoin('picoms_cte_stdFeedback', function($join) {
            $join->on('picoms_cte_stdFeedback.fk_rsb', '=', 'mis_std_regsubject.rsb_id')
                 ->where('picoms_cte_stdFeedback.recordstatus', '!=', 'DEL');
        })        
        ->leftJoin('mis_prm_course', 'mis_std_regsubject.crs_code', '=', 'mis_prm_course.pk_id')
        ->where('mis_std_regsubject.std_studentid', $std_studentid)
        ->where('mis_std_regsubject.aca_session', $aca_session)
        ->where('mis_std_regsubject.recordstatus', '!=', 'DEL')
        ->get();
        // if ($obj) {
        if (sizeof($obj)>0)   {
            return response()->json([
                'success' => true,
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'List Not Found!',
                'data' => ''
            ], 400);
        }
    }




    // list Course Evaluation by Semester
    public function cectListed($matrices)
    {

        // dd('dd');
        $obj = mis_std_regsubject::
        select(
            'rsb_id', 
            'mis_std_regsubject.aca_session', 
            'mis_std_regsubject.crs_code AS fk_course', 
            'mis_prm_course.crs_code AS crsCode', 
            'rsb_type', 
            'rsb_status', 
            'crs_name', 
            'counted_cgpa', 
            'mis_prm_calendar.cur_year', 
            'mis_prm_calendar.cal_cohort',
            'mis_std_curAcademic.std_semester'
            ) 
            ->leftJoin('mis_std_curAcademic', function($join){
                $join->on('mis_std_curAcademic.fk_acaCal', '=', 'mis_std_regsubject.aca_session')
                     ->on('mis_std_curAcademic.std_studentid', '=', 'mis_std_regsubject.std_studentid');
            })      
        ->leftJoin('mis_prm_course', 'mis_std_regsubject.crs_code', '=', 'mis_prm_course.pk_id')
        ->leftJoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_regsubject.aca_session')
        ->where('mis_std_regsubject.std_studentid', $matrices)
        // ->where('mis_std_regsubject.aca_session', $aca_session)
        ->where('mis_std_regsubject.recordstatus', '!=', 'DEL')
        ->where('mis_std_regsubject.rsb_status', 'CECT')
        ->groupBy(
            'rsb_id', 
            'mis_std_regsubject.aca_session', 
            'mis_std_regsubject.crs_code', 
            'rsb_type', 
            'rsb_status', 
            'crs_name', 
            'counted_cgpa', 
            'mis_prm_calendar.cur_year', 
            'mis_prm_calendar.cal_cohort',
            'mis_std_curAcademic.std_semester'
        )
        ->get();
        // if ($obj) {
        if (sizeof($obj)>0)   {
            return response()->json([
                'success' => true,
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'List Not Found!',
                'data' => ''
            ], 400);
        }
    }
}
