<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_std_regsubject;
use App\Models\mis_atd_week;
use App\Models\mis_atd_attendance;
use App\Models\mis_std_info;
use App\Models\mis_exam_student;
use App\Models\mis_exam_timetable;
use App\Models\mis_exam_center;
use App\Models\mis_prm_college;
use App\Models\mis_prm_locations;
use App\Models\mis_prm_course;
use App\Models\mis_exam_papertype;
use App\Models\mis_prm_calendar;
// use DB;
use Illuminate\Support\Facades\DB;

class mis_std_slipExamController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    //final exam only
    public function listBySession(Request $request)
    {
        $std_studentid = $request->input('std_studentid');
        $fk_acaCal = $request->input('fk_acaCal');

        $obj = DB::table('mis_exam_student')
        ->select(
            'mis_exam_student.std_studentid',
            'mis_prm_course.crs_code',
            'mis_prm_course.crs_name',
            'mis_exam_timetable.fk_exam_type',
            'mis_exam_timetable.tbl_date_start',
            'mis_exam_timetable.tbl_time_start',
            'mis_exam_timetable.tbl_time_end',
            'mis_exam_papertype.paper_type',
            'mis_exam_center.cen_id',
            'mis_exam_center.cen_type',
            'mis_prm_college.clg_name',
            'mis_exam_student.est_tableno',
            'mis_std_regsubject.rsb_status',
            'mis_std_regsubject.barr_status',
            'mis_prm_calendar.cur_year',
            'mis_prm_calendar.cal_cohort',
            'mis_prm_calendar.cal_status',
            'mis_exam_type.exam_type'

            // 'mis_exam_student.recordstatus AS recordExamStd',
            // 'mis_std_regsubject.rsb_id AS FK_rsb_id',
            // 'mis_exam_timetable.pk_id AS FK_exam'
        )
        ->leftJoin('mis_exam_timetable', 'mis_exam_timetable.pk_id', '=', 'mis_exam_student.fk_exam')
        ->leftJoin('mis_std_regsubject', 'mis_std_regsubject.rsb_id', '=', 'mis_exam_student.fk_stdRegCrs')
        ->leftJoin('mis_exam_center', 'mis_exam_center.pk_id', '=', 'mis_exam_student.fk_center')
        ->leftJoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'mis_exam_center.clg_id')
        ->leftJoin('mis_prm_locations', 'mis_prm_locations.loc_id', '=', 'mis_exam_center.cen_name')
        ->leftJoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
        ->leftJoin('mis_exam_papertype', 'mis_exam_papertype.pk_id', '=', 'mis_exam_timetable.tbl_paper_type')
        ->leftJoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_exam_timetable.fk_acaCal')
        ->leftJoin('mis_exam_type', 'mis_exam_type.pk_id', '=', 'mis_exam_timetable.fk_exam_type')
        ->where('mis_exam_student.std_studentid', $std_studentid)
        ->where('mis_exam_student.recordstatus', '!=', 'DEL')
        ->where('mis_exam_timetable.fk_acaCal', $fk_acaCal)
        ->where('mis_std_regsubject.rsb_status', '!=', 'Drop')
        ->where('mis_exam_timetable.recordstatus', '!=', 'DEL')
        ->where('mis_exam_type.pk_id', '=', 3)
        ->orderBy('mis_exam_timetable.tbl_date_start', 'ASC')
        ->orderBy('mis_exam_timetable.tbl_time_start', 'ASC')
        ->get();


        // dd($obj);
        

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

    public function listBySessionSExam(Request $request)
    {
        $std_studentid = $request->input('std_studentid');
        $fk_acaCal = $request->input('fk_acaCal');

        $obj = DB::table('mis_exam_student')
        ->select(
            'mis_exam_student.std_studentid',
            'mis_prm_course.crs_code',
            'mis_prm_course.crs_name',
            'mis_exam_timetable.fk_exam_type',
            'mis_exam_timetable.tbl_date_start',
            'mis_exam_timetable.tbl_time_start',
            'mis_exam_timetable.tbl_time_end',
            'mis_exam_papertype.paper_type',
            'mis_exam_center.cen_id',
            'mis_exam_center.cen_type',
            'mis_prm_college.clg_name',
            'mis_exam_student.est_tableno',
            'mis_std_regsubject.rsb_status',
            'mis_std_regsubject.barr_status',
            'mis_prm_calendar.cur_year',
            'mis_prm_calendar.cal_cohort',
            'mis_prm_calendar.cal_status',
            'mis_exam_type.exam_type'

            // 'mis_exam_student.recordstatus AS recordExamStd',
            // 'mis_std_regsubject.rsb_id AS FK_rsb_id',
            // 'mis_exam_timetable.pk_id AS FK_exam'
        )
        ->leftJoin('mis_exam_timetable', 'mis_exam_timetable.pk_id', '=', 'mis_exam_student.fk_exam')
        ->leftJoin('mis_std_regsubject', 'mis_std_regsubject.rsb_id', '=', 'mis_exam_student.fk_stdRegCrs')
        ->leftJoin('mis_exam_center', 'mis_exam_center.pk_id', '=', 'mis_exam_student.fk_center')
        ->leftJoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'mis_exam_center.clg_id')
        ->leftJoin('mis_prm_locations', 'mis_prm_locations.loc_id', '=', 'mis_exam_center.cen_name')
        ->leftJoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
        ->leftJoin('mis_exam_papertype', 'mis_exam_papertype.pk_id', '=', 'mis_exam_timetable.tbl_paper_type')
        ->leftJoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_exam_timetable.fk_acaCal')
        ->leftJoin('mis_exam_type', 'mis_exam_type.pk_id', '=', 'mis_exam_timetable.fk_exam_type')
        ->where('mis_exam_student.std_studentid', $std_studentid)
        ->where('mis_exam_student.recordstatus', '!=', 'DEL')
        ->where('mis_exam_timetable.fk_acaCal', $fk_acaCal)
        ->where('mis_std_regsubject.rsb_status', '!=', 'Drop')
        ->where('mis_exam_timetable.recordstatus', '!=', 'DEL')
        ->where('mis_exam_type.pk_id', '!=', 3)

        ->get();


        // dd($obj);
        

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
                'success' => 'true',
                'message' => 'Register Success!',
                'data' => $obj
            ], 201);
        } else {
            return response()->json([
                'success' => 'false',
                'message' => 'Bad Request',
                'data' => $obj
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


    // // list by active Add/Drop Course Policy
    // public function listByActPolicy(Request $request)
    // {
    //     $std_studentid = $request->input('std_studentid');
    //     $aca_session = $request->input('aca_session');

    //     $obj = mis_std_regsubject::where([
    //         ['std_studentid', '=', $std_studentid],
    //         ['aca_session', '=', $aca_session],
    //         ['mis_std_regsubject.recordstatus', '!=', 'DEL'],
    //         ['mis_std_regsubject.rsb_status', '!=', 'DROP']
    //     ])
    //         ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
    //         ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_regsubject.aca_session')
    //         ->orderBy('rsb_status', 'desc')
    //         ->get([
    //             'rsb_id',
    //             'barr_status',
    //             'mis_prm_calendar.cur_year AS acaYear',
    //             'cal_cohort',
    //             'crs_name',
    //             'rsb_type',
    //             'mis_prm_course.crs_code AS crsCode',
    //             'crs_credit',
    //             'fk_cotDet',
    //             'mis_std_regsubject.crs_code AS fk_course',
    //             'rsb_status',
    //             'cMark',
    //             'tMark',
    //             'grade',
    //             'point'

    //         ]);

    //     if ($obj) {
    //         return response()->json([
    //             'success' => 'true',
    //             'message' => 'List Success!',
    //             'data' => $obj
    //         ], 200);
    //     } else {
    //         return response()->json([
    //             'success' => 'false',
    //             'message' => 'Bad Request!',
    //             'data' => ''
    //         ], 400);
    //     }
    // }


    ////
    // list by active Add/Drop Course Policy
    public function listByActPolicy2(Request $request)
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
            ['mis_std_regsubject.rsb_status', '!=', 'DROP']
        ])
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
            ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_regsubject.aca_session')
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


    // list by Academic Calendar & Course
    public function listByAcaCalCrs(Request $request)
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
            ->orderBy('std_id')
            ->get([
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
                'mark_generate'
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
                ->where('mis_prm_gredscheme_det.gsd_component', 'Formative Assessment') // Added condition

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

    //list_attendance bg week
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
                'pgm_id',
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
        $fk_lecturer = $request->input('fk_lecturer') ;

                $subquery = mis_atd_week::selectRaw('
                    SUM(mis_atd_week.att_hour) AS att_hour,
                    mis_timetbl_det.fk_lecturer,
                    mis_timetable.fk_course
                ')
                ->join('mis_timetbl_det', 'mis_timetbl_det.pk_id', '=', 'mis_atd_week.fk_tmtDet')
                ->join('mis_timetable', 'mis_timetable.pk_id', '=', 'mis_timetbl_det.fk_timetbl')
                ->where('mis_timetable.fk_acaCal', $aca_session)
                ->where('mis_timetable.fk_course', $crs_code)
                ->where('mis_timetbl_det.fk_lecturer', $fk_lecturer)
                ->where('mis_atd_week.recordstatus', '!=', 'DEL')
                ->groupBy('mis_timetbl_det.fk_lecturer', 'mis_timetable.fk_course');

            $obj = mis_std_regsubject::selectRaw('
                    COUNT(mis_atd_attendance.status_attend) AS total_absent,
                    SUM(mis_atd_week.att_hour) AS att_hour_absent,
                    mis_std_regsubject.std_studentid,
                    crs_code,
                    pgm_id,
                    mis_std_info.sti_name
                ')
                ->leftJoin('mis_atd_attendance', 'mis_atd_attendance.std_studentid', '=', 'mis_std_regsubject.std_studentid')
                ->leftJoin('mis_atd_week', 'mis_atd_week.pk_id', '=', 'mis_atd_attendance.fk_week')
                ->leftJoinSub($subquery, 'k', function ($join) {
                    $join->on('k.fk_course', '=', 'mis_std_regsubject.crs_code')
                        ->where('status_attend', '=', 'Absent');
                })
                ->leftJoin('mis_std_info', 'mis_std_regsubject.std_studentid', '=', 'mis_std_info.std_studentid')
               
                ->where('aca_session', $aca_session)
                ->where('crs_code', $crs_code)
                // ->where('mis_atd_week.recordstatus', '!=', 'DEL')
                ->groupBy('mis_std_regsubject.std_studentid', 'crs_code', 'mis_std_info.sti_name')
                ->get();

                $thour = DB::table('mis_atd_week')
                    ->select(DB::raw('SUM(mis_atd_week.att_hour) AS att_hour_subject'),
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
                    'data' => $obj
                    ,
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
}
