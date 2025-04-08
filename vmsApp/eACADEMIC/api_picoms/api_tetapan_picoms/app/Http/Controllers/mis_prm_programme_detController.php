<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_prm_programme_det;

class mis_prm_programme_detController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function register(Request $request){
        $pgm_id = $request->input('pgm_id');
        $fk_aca_calendar = $request->input('fk_aca_calendar');
        $fk_sesIntake = $request->input('fk_sesIntake');
        $dtp_intake = $request->input('dtp_intake');
        $dtp_year = $request->input('dtp_year');

        $obj = mis_prm_programme_det::create([
            'pgm_id' => $pgm_id,
            'fk_aca_calendar' => $fk_aca_calendar,
            'fk_sesIntake' => $fk_sesIntake,
            'dtp_intake' => $dtp_intake,
            'dtp_year' => $dtp_year,
            'recordstatus' => 'ADD',
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
        $obj = mis_prm_programme_det::where('dtp_id','=',$id)
            ->leftjoin('mis_prm_programme','mis_prm_programme.pk_id','=','mis_prm_programme_det.pgm_id')
            ->leftjoin('aca_cal_category', 'aca_cal_category.pk_id','=','mis_prm_programme.pgm_area')
            ->leftjoin('mis_prm_curyear', 'mis_prm_curyear.id','=','mis_prm_programme_det.fk_sesIntake')
            ->leftjoin('intake', 'intake.id','=','mis_prm_curyear.cur_intake')
            ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id','=','mis_prm_programme_det.fk_aca_calendar')
            ->first([
                'dtp_id',
                'mis_prm_programme_det.pgm_id AS fk_pgm',
                'mis_prm_programme.pgm_id AS pgm_code',
                'pgm_name',
                'category',
                'pgm_area',
                'fk_aca_calendar', 
                'mis_prm_calendar.cur_year AS cal_year', 
                'cal_cohort',
                'fk_sesIntake', 
                'cur_intake', 
                'intake_name AS intake_month', 
                'intake_year'
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function list($id){
        $obj = mis_prm_programme_det::where([
                ['mis_prm_programme_det.pgm_id','=',$id],
                ['mis_prm_programme_det.recordstatus','!=','DEL']
            ])
            ->leftjoin('mis_prm_curyear', 'mis_prm_curyear.id','=','mis_prm_programme_det.fk_sesIntake')
            ->leftjoin('intake', 'intake.id','=','mis_prm_curyear.cur_intake')
            ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id','=','mis_prm_curyear.fk_acaCal')
            ->orderBy('mis_prm_calendar.cur_year','desc')
            ->orderBy('cal_cohort','desc')
            ->get([
                'dtp_id',
                'dtp_year',
                'dtp_intake',
                'fk_aca_calendar',
                'fk_sesIntake',
                'cur_intake',
                'intake.intake_name AS intake_month',
                'intake.intake_year',
                'mis_prm_calendar.cur_year AS acaCal',
                'cal_cohort'
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
        $dtp_id = $request->input('dtp_id');
        $fk_aca_calendar = $request->input('fk_aca_calendar');
        $fk_sesIntake = $request->input('fk_sesIntake');
        $dtp_intake = $request->input('dtp_intake');
        $dtp_year = $request->input('dtp_year');

        $obj = mis_prm_programme_det::where('dtp_id',$dtp_id) -> update([
            'fk_aca_calendar' => $fk_aca_calendar,
            'fk_sesIntake' => $fk_sesIntake,
            'dtp_intake' => $dtp_intake,
            'dtp_year' => $dtp_year,
            'recordstatus' => 'EDT',
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
        $dtp_id = $request->input('dtp_id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_programme_det::where('dtp_id',$dtp_id) -> update([
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


    // select academic calendar
    public function listByYear($id){
        $cur_year = str_replace("-","/",$id);

        $obj = mis_prm_programme_det::where([['mis_prm_programme_det.dtp_year','=',$cur_year],['mis_prm_programme_det.recordstatus','!=',"DEL"]])
            ->leftjoin('mis_prm_programme','mis_prm_programme.pk_id','=','mis_prm_programme_det.pgm_id')
            ->leftjoin('mis_prm_faculty','mis_prm_faculty.pk_id','=','mis_prm_programme.fac_id')
            ->get([
                'dtp_id',
                'dtp_year',
                'dtp_intake',
                'pgm_name',
                'mis_prm_programme.pgm_id AS pgmCode',
                'mis_prm_faculty.fac_id AS fac_code',
                'mis_prm_programme_det.pgm_id AS fk_pgm'
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
                'message'=>'No Data Found!',
                'data'=>$obj
            ],200);
        }
    }


    // select program by intake & year
    public function listByYearIntake(Request $request){
        $intake = $request->input('dtp_intake');
        $year = $request->input('dtp_year');
        $cur_year = str_replace("-","/",$year);

        $obj = mis_prm_programme_det::select('mis_prm_programme_det.*','mis_prm_programme.pgm_name','mis_prm_programme.pgm_id AS pgmId','mis_prm_programme.fac_id','mis_prm_faculty.fac_name')
            ->leftjoin('mis_prm_programme','mis_prm_programme.pk_id','=','mis_prm_programme_det.pgm_id')
            ->leftjoin('mis_prm_faculty','mis_prm_faculty.pk_id','=','mis_prm_programme.fac_id')
            ->where([
                ['mis_prm_programme_det.dtp_year','=',$cur_year],
                ['mis_prm_programme_det.recordstatus','!=',"DEL"],
                ['mis_prm_programme_det.dtp_intake','=',$intake],
            ])
            ->get();

        if ($obj)   {
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


    // list Program by Intake
    public function listByIntake($id){
        $obj = mis_prm_programme_det::where([['mis_prm_programme_det.dtp_intake','=',$id],['mis_prm_programme_det.recordstatus','!=',"DEL"]])
            ->leftjoin('mis_prm_programme','mis_prm_programme.pk_id','=','mis_prm_programme_det.pgm_id')
            // ->leftjoin('mis_prm_faculty','mis_prm_faculty.pk_id','=','mis_prm_programme.fac_id')
            ->get([
                'dtp_id',
                'dtp_year',
                'dtp_intake',
                'pgm_name',
                'mis_prm_programme.pgm_id AS pgmCode',
                'mis_prm_programme_det.pgm_id AS fk_pgm'
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
                'success'=>'false',
                'message'=>'No Data Found!',
                'data'=>$obj
            ],200);
        }
    }


    // check if intake existed for programme
    public function chkIntake(Request $request){
        $pgm_id = $request->input('pgm_id');
        $dtp_intake = $request->input('dtp_intake');

        $obj = mis_prm_programme_det::where([
                ['pgm_id','=',$pgm_id],
                ['dtp_intake','=',$dtp_intake],
                ['recordstatus','!=','DEL']
            ])
            ->get();

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


    // find pk_id
    public function findPkId(Request $request){
        $pgm_id = $request->input('pgm_id');
        $dtp_year = $request->input('dtp_year');
        $dtp_intake = $request->input('dtp_intake');

        $obj = mis_prm_programme_det::where([
                ['mis_prm_programme_det.pgm_id',$pgm_id],
                ['mis_prm_programme_det.dtp_year',$dtp_year],
                ['mis_prm_programme_det.dtp_intake',$dtp_intake],
                ['mis_prm_programme_det.recordstatus','!=','DEL']
            ])
            ->first(['dtp_id']);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // find pk_id
    public function findPGMid(Request $request){
        $pgm_id = $request->input('pgm_id');
        // $dtp_year = $request->input('dtp_year');
        $dtp_intake = $request->input('dtp_intake');

        $obj = mis_prm_programme_det::where([
                ['mis_prm_programme_det.pgm_id',$pgm_id],
                // ['mis_prm_programme_det.dtp_year',$dtp_year],    
                ['mis_prm_programme_det.dtp_intake',$dtp_intake],
                ['mis_prm_programme_det.recordstatus','!=','DEL']
            ])
            ->first(['dtp_id']);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }

    // list Program by Year
    public function progYear($id){
        $cur_year = str_replace("-","/",$id);

        $obj = mis_prm_programme_det::where([['mis_prm_programme_det.dtp_year','=',$cur_year],['mis_prm_programme_det.recordstatus','!=',"DEL"]])
            ->leftjoin('mis_prm_programme','mis_prm_programme.pk_id','=','mis_prm_programme_det.pgm_id')
            ->leftjoin('mis_prm_faculty','mis_prm_faculty.pk_id','=','mis_prm_programme.fac_id')
            ->get([
                'dtp_id',
                'dtp_year',
                'dtp_intake',
                'pgm_name',
                'mis_prm_programme.pgm_id AS pgmCode',
                'mis_prm_faculty.fac_id AS fac_code',
                'mis_prm_programme_det.pgm_id AS fk_pgm'
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
                'success'=>'false',
                'message'=>'No Data Found!',
                'data'=>$obj
            ],200);
        }
    }


    // list Program by aca_calendar & sem
    // public function progByAcaCal(Request $request){
    //     $aca_cal = $request->input('aca_cal');
    //     $cal_cohort = $request->input('cal_cohort');
    //     $cur_year = str_replace("-","/",$aca_cal);

    //     $obj = mis_prm_programme_det::where([
    //             ['mis_prm_calendar.cur_year','=',$cur_year],
    //             ['cal_cohort','=',$cal_cohort],
    //             ['mis_prm_programme_det.recordstatus','!=',"DEL"]
    //         ])
    //         ->leftjoin('mis_prm_curyear','mis_prm_curyear.id','=','mis_prm_programme_det.fk_sesIntake')
    //         ->leftjoin('intake','intake.id','=','mis_prm_curyear.cur_intake')
    //         ->leftjoin('mis_prm_calendar','mis_prm_calendar.cal_id','=','mis_prm_curyear.fk_acaCal')
    //         ->leftjoin('mis_prm_programme','mis_prm_programme.pk_id','=','mis_prm_programme_det.pgm_id')
    //         ->leftjoin('aca_cal_category', 'aca_cal_category.pk_id','=','mis_prm_programme.pgm_area')
    //         ->get([
    //             'mis_prm_calendar.cur_year AS acaYear',
    //             'intake_name AS intake_month',
    //             'intake_year',
    //             'category',
    //             'mis_prm_programme.pgm_id AS pgmCode',
    //             'pgm_name',
    //             'cal_cohort',
    //             'dtp_id'
    //         ]);

    //     if($obj){
    //         return response()->json([
    //             'success'=>'true',
    //             'message'=>'List Success!',
    //             'data'=>$obj
    //         ],200);
    //     }
    //     else{
    //         return response()->json([
    //             'success'=>'false',
    //             'message'=>'No Data Found!',
    //             'data'=>$obj
    //         ],200);
    //     }
    // }

    public function progByAcaCal(Request $request){
        $aca_cal = $request->input('aca_cal');
        $cal_cohort = $request->input('cal_cohort');
        $cur_year = str_replace("-","/",$aca_cal);

        $obj = mis_prm_programme_det::where([
                ['mis_prm_calendar.cur_year','=',$cur_year],
                ['cal_cohort','=',$cal_cohort],
                ['mis_prm_programme_det.recordstatus','!=',"DEL"],
                ['mis_prm_programme.recordstatus','!=',"DEL"]
            ])
            ->leftjoin('mis_prm_curyear','mis_prm_curyear.id','=','mis_prm_programme_det.fk_sesIntake')
            ->leftjoin('intake','intake.id','=','mis_prm_curyear.cur_intake')
            ->leftjoin('mis_prm_calendar','mis_prm_calendar.cal_id','=','mis_prm_curyear.fk_acaCal')
            ->leftjoin('mis_prm_programme','mis_prm_programme.pk_id','=','mis_prm_programme_det.pgm_id')
            ->leftjoin('aca_cal_category', 'aca_cal_category.pk_id','=','mis_prm_programme.pgm_area')
            ->get([
                'mis_prm_calendar.cur_year AS acaYear',
                'intake_name AS intake_month',
                'intake_year',
                'category',
                'mis_prm_programme.pgm_id AS pgmCode',
                'pgm_name',
                'cal_cohort',
                'dtp_id', 'mis_prm_programme.recordstatus'
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
                'message'=>'No Data Found!',
                'data'=>$obj
            ],200);
        }
    }

    // list Program by aca_calendar & sem
    public function progDetShow(Request $request){
        $pgm_fk = $request->input('pgm_id');
        $cur_intake = $request->input('dtp_intake');

        $obj = mis_prm_programme_det::where([
                ['dtp_intake','=',$cur_intake],
                ['mis_prm_programme_det.recordstatus','!=',"DEL"],
                ['mis_prm_programme_det.pgm_id','=',$pgm_fk]
            ])
            ->leftjoin('mis_prm_curyear','mis_prm_curyear.id','=','mis_prm_programme_det.fk_sesIntake')
            ->leftjoin('intake','intake.id','=','mis_prm_curyear.cur_intake')
            // ->toSql();
            ->first([
                'mis_prm_programme_det.dtp_id',
                'mis_prm_programme_det.pgm_id',
                'mis_prm_programme_det.fk_aca_calendar',
                'mis_prm_programme_det.fk_sesIntake',
                'mis_prm_curyear.id AS id_curyear',
                'mis_prm_curyear.cur_intake',
                'mis_prm_programme_det.dtp_intake'
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
                'message'=>'No Data Found!',
                'data'=>$obj
            ],400);
        }
    }


    // find programme detail student
    public function findPgmDetStd(Request $request){
        $pgm_id = $request->input('pgm_id');
        $intake_month = $request->input('intake_month');
        $intake_year = $request->input('intake_year');

        $obj = mis_prm_programme_det::where([
                ['mis_prm_programme_det.pgm_id','=',$pgm_id],
                ['intake_name','=',$intake_month],
                ['intake_year','=',$intake_year],
                ['mis_prm_programme_det.recordstatus','!=','DEL']
            ])
            ->leftjoin('mis_prm_curyear', 'mis_prm_curyear.id','=','mis_prm_programme_det.fk_sesIntake')
            ->leftjoin('intake', 'intake.id','=','mis_prm_curyear.cur_intake')
            ->orderBy('dtp_id','DESC')
            ->first(['dtp_id']);

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

    public function findPgmDetStd2(Request $request){
        $pgm_id = $request->input('pgm_id');
        $intake_month = $request->input('intake_month');
        $intake_year = $request->input('intake_year');
        $intake_year2 = str_replace('-', '/', $intake_year);

        

        $obj = mis_prm_programme_det::leftJoin('mis_prm_curyear', 'mis_prm_curyear.id', '=', 'mis_prm_programme_det.fk_sesIntake')
            // ->leftJoin('intake', 'intake.id', '=', 'mis_prm_curyear.cur_intake') // Commented out as per your SQL query
            ->where('mis_prm_programme_det.pgm_id', '=', $pgm_id)
            ->where('mis_prm_programme_det.dtp_intake', '=', $intake_month)
            ->where('mis_prm_programme_det.dtp_year', '=', $intake_year2)
            // ->where('intake_year', '=', $intake_year) // Commented out as per your SQL query
            ->where('mis_prm_programme_det.recordstatus', '!=', 'DEL')
            ->orderByDesc('dtp_id')
            ->first();
            // ->pluck('dtp_id');


        


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
}
