<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_std_cect;
use App\Models\mis_std_regsubject;
use App\Models\mis_exam_grading;
use SebastianBergmann\Environment\Console;

class mis_std_cectController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function create(Request $request)
    {
        // transkrip
        $std_transkrip = '';
        if ($request->hasFile('std_transkrip')) {
            $file = $request->file('std_transkrip');
            $std_transkrip = time() . $file->getClientOriginalName();
            $file->move('cect_transkrip', $std_transkrip);
        }

        // fee
        $std_fee = '';
        if ($request->hasFile('std_fee')) {
            $file = $request->file('std_fee');
            $std_fee = time() . $file->getClientOriginalName();
            $file->move('cect_fee', $std_fee);
        }

        $studentid = $request->input('studentid');
        $std_name = $request->input('std_name');
        $pgm_id = $request->input('pgm_id');
        $std_edu = $request->input('std_edu');
        $std_semester = $request->input('std_semester');
        $std_pre_universiti = $request->input('std_pre_universiti');
        $std_pre_program = $request->input('std_pre_program');
        $cect_status = $request->input('cect_status');
        $recordstatus = $request->input('recordstatus');
        $data = [
            'studentid' => $studentid,
            'std_name' => $std_name,
            'pgm_id' => $pgm_id,
            'std_edu' => $std_edu,
            'std_semester' => $std_semester,
            'std_pre_universiti' => $std_pre_universiti,
            'std_pre_program' => $std_pre_program,
            'std_transkrip' => $std_transkrip,
            'std_fee' => $std_fee,
            'cect_status' => $cect_status,
            'recordstatus' => $recordstatus
        ];

        $checking = mis_std_cect::where([
            ['studentid', $studentid],
            ['std_semester', $std_semester],
            ['recordstatus', '!=', 'DEL'],
            // ['cect_status', '=', 'New'],
            // ['approval_coor', ''],
            // ['approval_admin', ''],
            // // ['approval_coor', 'Support'],
            // // ['approval_admin', 'Approve']
        ])
        ->where(function($query) {
            $query->where([
                    ['cect_status', '=', 'New'],
                    ['approval_coor', ''],
                    ['approval_admin', '']
                ])
                ->orWhere([
                    ['cect_status', '=', 'New'],
                    ['approval_coor', 'Support'],
                    ['approval_admin', 'Approve']
                ])  
                ->orWhere([
                    ['cect_status', '=', 'New'],
                    ['approval_coor', 'Support'],
                    ['approval_admin', '']
                ]);;
        })            // ->where('approval_admin', 'Approve')
            // ->whereNotNull('approval_coor')
            // ->whereNotNull('approval_admin')
            // ->where('cect_status','New')
            // ->orWhereNull('cect_status','New')
            // ->orWhere('cect_status','New')
            // ->where(function ($query) {
            //     $query->orWhere('cect_status', 'New')
            //           ->orWhereNull('cect_status');
            // })
            ->get(
                ['id', 'studentid', 'approval_coor', 'approval_admin', 'recordstatus', 'cect_status']
            );

            // dd($checking);

        if ($checking->isEmpty()) {
            // No data found
            $obj = mis_std_cect::create($data);

            if ($obj) {
                return response()->json([
                    'success' => true,
                    'messages' => 'Daftar Berjaya',
                    'data' => $obj,
                ], 201);
            } else {
                return response()->json([
                    'success' => false,
                    'messages' => 'Daftar Gagal Baru',
                    'data' => '',
                ], 201);
            }
        } else {
            return response()->json([
                'success' => false,
                'messages' => 'Anda Dah Daftar Sebelum ni',
                'data' => '',
            ], 201);
        }
    }


    public function update(Request $request)
    {
        // transkrip
        $std_transkrip = $request->input('exist_std_transkrip');
        if ($request->hasFile('std_transkrip')) {
            $file = $request->file('std_transkrip');
            $std_transkrip = time() . $file->getClientOriginalName();
            $file->move('cect_transkrip', $std_transkrip);
        }

        // fee
        $std_fee = $request->input('exist_std_fee');
        if ($request->hasFile('std_fee')) {
            $file = $request->file('std_fee');
            $std_fee = time() . $file->getClientOriginalName();
            $file->move('cect_fee', $std_fee);
        }

        $id = $request->input('id');
        $std_semester = $request->input('std_semester');
        $std_pre_universiti = $request->input('std_pre_universiti');
        $std_pre_program = $request->input('std_pre_program');
        $recordstatus = $request->input('recordstatus');

        $data = [
            'std_semester' => $std_semester,
            'std_pre_universiti' => $std_pre_universiti,
            'std_pre_program' => $std_pre_program,
            'std_transkrip' => $std_transkrip,
            'std_fee' => $std_fee,
            'recordstatus' => $recordstatus
        ];

        $obj = mis_std_cect::where('id', $id)->update($data);

        if ($obj) {

            return response()->json([
                'success' => true,
                'messages' => 'Update Success',
                'data' => $obj,
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'messages' => 'Update Failed',
                'data' => '',
            ], 201);
        }
    }


    public function show($id)
    {
        $obj = mis_std_cect::where([['studentid', $id], ['recordstatus', '!=', 'DEL']])
            ->get([
                'id',
                'std_edu',
                'std_semester',
                'std_pre_universiti',
                'std_pre_program',
                'std_transkrip',
                'std_fee',
                'approval_coor',
                'approval_admin',
                'catatan_coor',
                'catatan_admin',
                'cect_acaSession',
                'cect_total_credit',
                'cect_cgpa',
                'cect_gpa',
                'cect_senate_decision',
                'cect_fees',
                'cect_status'
            ]);

        if ($obj) {
            if (sizeof($obj) > 0) {
                return response()->json([
                    'success' => true,
                    'messages' => 'Data Berjaya',
                    'data' => $obj,
                ], 201);
            } else {
                return response()->json([
                    'success' => false,
                    'messages' => 'Data Tiada',
                    'data' => $obj,
                ], 201);
            }
        } else {
            return response()->json([
                'success' => false,
                'messages' => 'Data Gagal',
                'data' => '',
            ], 201);
        }
    }

    public function get_data($id)
    {
        $obj = mis_std_cect::where('id', $id)
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'mis_std_cect.studentid')
            ->leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_std_info.pgm_fk')
            ->leftjoin('mis_prm_calendar', 'mis_std_cect.cect_acaSession', '=', 'mis_prm_calendar.cal_id')

            ->first([
                'id',
                'studentid',
                'std_name',
                'mis_prm_programme.pgm_id AS pgmId',
                'pgm_name',
                'std_edu',
                'std_semester',
                'std_pre_universiti',
                'std_pre_program',
                'std_transkrip',
                'std_fee',
                'cect_status',
                'approval_coor',
                'approval_admin',
                'catatan_coor',
                'catatan_admin',
                'cect_acaSession',
                'cect_total_credit',
                'cect_type',
                'cect_cgpa',
                'cect_gpa',
                'cect_senate_decision',
                'cect_fees',
                'cur_year', 'cal_cohort', 'cal_category'
            ]);

        if ($obj) {
            return response()->json([
                'success' => true,
                'messages' => 'Data Berjaya',
                'data' => $obj,
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'messages' => 'Data Gagal',
                'data' => '',
            ], 201);
        }
    }

    public function get_databyStd($studentid)
    {

        $obj = mis_std_cect::where([['mis_std_cect.studentid', $studentid], ['mis_std_cect.recordstatus', '!=', 'DEL']])
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'mis_std_cect.studentid')
            ->leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_std_info.pgm_fk')
            ->leftjoin('mis_prm_calendar', 'mis_std_cect.cect_acaSession', '=', 'mis_prm_calendar.cal_id')
            // ->where('mis_std_cect.recordstatus', '!=','DEL')
            ->get([
                'id',
                'studentid',
                'std_name',
                'mis_prm_programme.pgm_id AS pgmId',
                'pgm_name',
                'std_edu',
                'std_semester',
                'std_pre_universiti',
                'std_pre_program',
                'std_transkrip',
                'std_fee',
                'cect_status',
                'approval_coor',
                'approval_admin',
                'catatan_coor',
                'catatan_admin',
                'cect_acaSession',
                'cect_total_credit',
                'cect_type',
                'cect_cgpa',
                'cect_gpa',
                'cect_senate_decision',
                'cect_fees',
                'cur_year', 'cal_cohort', 'cal_category'
            ]);

        if ($obj) {
            return response()->json([
                'success' => true,
                'messages' => 'Data Berjaya',
                'data' => $obj,
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'messages' => 'Data Gagal',
                'data' => '',
            ], 201);
        }
    }

    public function listCourse($studentid)
    {

        $obj = mis_std_cect::leftJoin('mis_std_cect_det', 'mis_std_cect_det.fk_cect', '=', 'mis_std_cect.id')
            ->leftJoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_cect_det.std_course')
            ->select(
                'mis_prm_course.crs_code',
                'mis_prm_course.crs_name',
                'mis_std_cect_det.cect_type',
                // 'mis_std_cect.cect_type',
                'mis_std_cect_det.std_credit_hour_pre',
                'mis_prm_course.crs_credit',
                'mis_std_cect_det.grade_pre'
            )
            ->where('mis_std_cect.studentid', $studentid)
            ->where('mis_std_cect_det.recordstatus', '!=', 'DEL')
            ->get();

            // $sumcect = $obj ->sum($obj -> crs_credit);
        $sumcect = $obj->sum('crs_credit');


            // if ($obj) {
            if (sizeof($obj)>0) {
                return response()->json([
                    'success' => true,
                    'messages' => 'Data Berjaya',
                    'data' => $obj,
                    'sumcect' => $sumcect,
                ], 201);
            } else {
                return response()->json([
                    'success' => false,
                    'messages' => 'Data Gagal',
                    'data' => '',
                ], 201);
            }
    }

    public function listCourseTranskrip($studentid)
    {

        $obj = mis_std_cect::leftJoin('mis_std_cect_det', 'mis_std_cect_det.fk_cect', '=', 'mis_std_cect.id')
            ->leftJoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_cect_det.std_course')
            ->select(
                'mis_prm_course.crs_code',
                'mis_prm_course.crs_name',
                'mis_std_cect_det.cect_type',
                // 'mis_std_cect.cect_type',
                'mis_prm_course.crs_credit',
                // 'mis_std_cect_det.grade_pre'
            )
            ->where('mis_std_cect.studentid', $studentid)
            ->where('mis_std_cect_det.recordstatus', '!=', 'DEL')
            ->where('mis_std_cect_det.cect_type', '!=', 'CT')
            ->groupBy( 'mis_prm_course.crs_code',
            'mis_prm_course.crs_name',
            'mis_std_cect_det.cect_type',
            // 'mis_std_cect.cect_type',
            'mis_prm_course.crs_credit')
            ->orderBy('mis_prm_course.crs_code')
            ->get();

            // $sumcect = $obj ->sum($obj -> crs_credit);
        $sumce = $obj->sum('crs_credit');



        // nie utk ambiktotal credit
        $objAll = mis_std_cect::leftJoin('mis_std_cect_det', 'mis_std_cect_det.fk_cect', '=', 'mis_std_cect.id')
            ->leftJoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_cect_det.std_course')
            ->select(
                'mis_prm_course.crs_code',
                'mis_prm_course.crs_name',
                'mis_std_cect_det.cect_type',
                // 'mis_std_cect.cect_type',
                'mis_prm_course.crs_credit',
                // 'mis_std_cect_det.grade_pre'
            )
            ->where('mis_std_cect.studentid', $studentid)
            ->where('mis_std_cect_det.recordstatus', '!=', 'DEL')
            // ->where('mis_std_cect_det.cect_type', '!=', 'CT')
            ->groupBy( 'mis_prm_course.crs_code',
            'mis_prm_course.crs_name',
            'mis_std_cect_det.cect_type',
            // 'mis_std_cect.cect_type',
            'mis_prm_course.crs_credit')
            ->orderBy('mis_prm_course.crs_code')
            ->get();

            // $sumcect = $obj ->sum($obj -> crs_credit);
        $sumcect = $objAll->sum('crs_credit');

            // if ($obj) {
            if ((sizeof($obj)>0)|| (sizeof($objAll)>0)) {
                return response()->json([
                    'success' => true,
                    'messages' => 'Data Berjaya',
                    'data' => $obj,
                    'sumcect' => $sumcect,
                    'sumce' => $sumce,
                ], 201);
            } else {
                return response()->json([
                    'success' => false,
                    'messages' => 'Data Gagal',
                    'data' => '',
                ], 201);
            }
    }


    public function list()
    {
        $obj = mis_std_cect::where([['mis_std_cect.recordstatus', '!=', 'DEL']])
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'mis_std_cect.studentid')
            ->leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_std_info.pgm_fk')
            // ->orderBy('mis_std_cect.id','DESC')
            // ->orderByRaw("FIELD(mis_std_cect.id , 'New', 'In Progress', 'Approved') DESC")
            ->select(
                [
                    'id',
                    'studentid',
                    'sti_name',
                    'mis_prm_programme.pgm_id AS pgmId',
                    'std_semester',
                    'approval_admin',
                    'approval_coor',
                ]
            )
            ->selectRaw("
            CASE
                WHEN approval_coor = 'Support' AND approval_admin = 'Approve' THEN 1
                WHEN approval_coor = 'Support' THEN 2
                WHEN approval_admin = 'Approve' THEN 3
                ELSE 4
            END AS status_order
        ")
            ->orderBy('status_order', 'DESC')
            ->get(
                // [
                //     'id',
                //     'studentid',
                //     'sti_name',
                //     'mis_prm_programme.pgm_id AS pgmId',
                //     'std_semester',
                //     'approval_admin',
                //     'approval_coor',
                // ]
            );
        // ->get([
        //     'id',
        //     'studentid',
        //     'sti_name',
        //     'mis_prm_programme.pgm_id AS pgmId',
        //     'std_semester',
        //     'approval_admin',
        //     'approval_coor',
        //     ])->map(function ($item) {
        //         if ($item->approval_coor == 'Support' && $item->approval_admin == 'Approve') {
        //             $item->statusLabel = 'Approve';
        //         } elseif ($item->approval_admin == '' && $item->approval_coor == 'Support') {
        //             $item->statusLabel = 'In Progress';
        //         } elseif ($item->approval_admin == '' && $item->approval_coor == '') {
        //             $item->statusLabel = 'New';
        //         } else {
        //             $item->statusLabel = ''; // Handle default case if needed
        //         }
        //         return $item;
        //     });
        if ($obj) {
            return response()->json([
                'success' => true,
                'messages' => 'Data Berjaya',
                'data' => $obj,
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'messages' => 'Data Gagal',
                'data' => '',
            ], 201);
        }
    }

    // update by Admin Faculty
    public function uptByAdmnFac(Request $request)
    {
        $id = $request->input('id');
        $approval_coor = $request->input('approval_coor');
        $catatan_coor = $request->input('catatan_coor');

        $obj = mis_std_cect::where('id', $id)->update([
            'approval_coor' => $approval_coor,
            'catatan_coor' => $catatan_coor,
            'recordstatus' => 'EDT'
        ]);

        if ($obj) {
            return response()->json([
                'success' => true,
                'messages' => 'Update Success',
                'data' => $obj,
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'messages' => 'Update Failed',
                'data' => '',
            ], 201);
        }
    }


    // update by Admin Dean
    public function uptByDean(Request $request)
    {
        $id = $request->input('id');
        $approval_admin = $request->input('approval_admin');
        $catatan_admin = $request->input('catatan_admin');
        $cect_type = $request->input('cect_type');
        $dataListSubject = $request->input('dataListSubject');



        $obj = mis_std_cect::where('id', $id)->update([
            'approval_admin' => $approval_admin,
            'catatan_admin' => $catatan_admin,
            'cect_status' => 'Complete',
            'recordstatus' => 'EDT'
        ]);

        if ($approval_admin == "Approve") {
            // dd( $dataListSubject);

            foreach (json_decode($dataListSubject) as $row) {
                $data = (array) $row;

                $std_studentid = $data['std_studentid'];
                $aca_session = $data['aca_session'];
                $crs_code = $data['crs_code'];
                $rsb_type = $data['rsb_type'];
                $obj_regSub = mis_std_regsubject::where('std_studentid', $std_studentid)
                    ->where('crs_code', $crs_code)
                    ->where('rsb_status', '!=', 'Drop')
                    ->where('recordstatus', '!=', 'DEL')
                    // ->orWhere('aca_session', $aca_session)
                    ->where(function ($query) use ($aca_session) {
                        $query->where('aca_session', $aca_session);
                    })
                
                    ->first();

                $data['rsb_status'] = 'CECT';
                $data['recordstatus'] = 'ADD';

                if ($data['cur_year'] == null) {

                    // xda nie jadi error 500 

                    unset($data['cur_year']);
                    unset($data['aca_session']);
                    // $data['cur_year']='null';
                }

                if ($rsb_type == "CE") {
                    $data['grade'] = 'PASS';
                    $data['point'] = '0';
                }else{
                    $data['grade'] =  $data['grade'];
                    $data['point'] =   $data['point'];
                }


                if ($obj_regSub) {
                    // $data['rsb_type'] = $obj_regSub->rsb_type . '/' . $cect_type;
                    $created = mis_std_regsubject::where('rsb_id', $obj_regSub->rsb_id)->update($data);
                } else {
                    $created = mis_std_regsubject::create($data);
                }
            }
        }

        if ($obj) {
            return response()->json([
                'success' => true,
                'messages' => 'Update Success',
                'data' => $obj,
                'data2' => $created,
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'messages' => 'Update Failed',
                'data' => $created,
            ], 201);
        }
    }


    public function uptSenat(Request $request)
    {
        $id = $request->input('id');
        $cect_acaSession = $request->input('cect_acaSession');
        $cect_total_credit = $request->input('cect_total_credit');
        // $cect_type = $request->input('cect_type');
        $cect_cgpa = $request->input('cect_cgpa');
        $cect_gpa = $request->input('cect_gpa');
        $cect_senate_decision = $request->input('cect_senate_decision');

        $obj = mis_std_cect::where('id', $id)->update([
            'cect_acaSession' => $cect_acaSession,
            'cect_total_credit' => $cect_total_credit,
            // 'cect_type' => $cect_type,
            'cect_cgpa' => $cect_cgpa,
            'cect_gpa' => $cect_gpa,
            'cect_senate_decision' => $cect_senate_decision,
            'recordstatus' => 'EDT'
        ]);

        if ($obj) {
            return response()->json([
                'success' => true,
                'messages' => 'Successfully Update',
                'data' => $obj,
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'messages' => 'Update Failed',
                'data' => '',
            ], 201);
        }
    }


    public function uptFees(Request $request)
    {
        $id = $request->input('id');
        $cect_fees = $request->input('cect_fees');

        $obj = mis_std_cect::where('id', $id)->update([
            'cect_fees' => $cect_fees,
            'recordstatus' => 'EDT'
        ]);

        if ($obj) {
            return response()->json([
                'success' => true,
                'messages' => 'Successfully Update',
                'data' => $obj,
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'messages' => 'Update Failed',
                'data' => '',
            ], 201);
        }
    }



    public function CheckForCreate(Request $request)
    {

        $studentid = $request->input('studentid');
        $std_semester = $request->input('std_semester');

        $cect_status = $request->input('cect_status');
        $recordstatus = $request->input('recordstatus');

        // $data = [
        //     'studentid' => $studentid,
        //     'std_semester' => $std_semester,
        //     'cect_status' => $cect_status,
        //     'recordstatus' => $recordstatus
        // ];

        $obj = mis_std_cect::where([['studentid', $studentid], ['std_semester', $std_semester], ['recordstatus', '!=', 'DEL']])
            ->get([
                'id',
                'studentid',
                'approval_coor',
                'approval_admin',
                'recordstatus',

            ]);

        if ($obj) {
            return response()->json([
                'success' => true,
                'messages' => 'Daftar Berjaya',
                'data' => $obj,
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'messages' => 'Daftar Gagal',
                'data' => '',
            ], 201);
        }
    }


    public function delete($idCect)
    {

        $obj = mis_std_cect::where([['id', '=', $idCect]])->update([
            'recordstatus' => 'DEL',
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

    public function listBySession(){
        
    }
}
