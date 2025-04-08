<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_prm_curyear;
use DB;

class mis_prm_curyearController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function register(Request $request){
        $fk_acaCal = $request->input('fk_acaCal');
        $cur_intake = $request->input('cur_intake');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_curyear::create([
            'fk_acaCal' => $fk_acaCal,
            'cur_intake' => $cur_intake,
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


    public function show(Request $request)  {
        $pgm_id = $request->input('pgm_id');

        $mis_prm_curyear = mis_prm_curyear::where('pgm_id',$pgm_id)->first();

        if($mis_prm_curyear){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$mis_prm_curyear
            ],200);
        }
    }

    public function show_by_program(Request $request){
        $pgm_id = $request->input('pgm_id');

        $mis_prm_curyear = mis_prm_curyear::where([
            ['pgm_id','=',$pgm_id],
            ['recordstatus','!=','DEL']
            ])->get();

        if($mis_prm_curyear){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$mis_prm_curyear
            ],200);
        }
    }


    public function list(){
        $obj = mis_prm_curyear::select('*')
            ->where('mis_prm_curyear.recordstatus','!=','DEL') ->orderBy('cur_year', 'desc') ->get();

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function update(Request $request){
        $id = $request->input('id');
        $cur_year = $request->input('cur_year');
        $cur_intake = $request->input('cur_intake');
        $cur_semester = $request->input('cur_semester');
        $cur_status = $request->input('cur_status');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_curyear::where([['id','=',$id]]) -> update([
            'cur_year' => $cur_year,
            'cur_intake' => $cur_intake,
            'cur_semester' => $cur_semester,
            'cur_status' => $cur_status,
            'recordstatus' => $recordstatus,
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
        $id = $request->input('id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_curyear::where('id',$id)-> update([
            'recordstatus' => $recordstatus,
        ]);

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
    

    // select option session
    public function opt_curYear_progDet(){
        $obj = mis_prm_curyear::groupBy ('cur_year')
            ->where('mis_prm_curyear.recordstatus','!=',"DEL")
            ->where('mis_prm_curyear.cur_year','!=',NULL)
            ->orderBy('cur_year')
            ->get(['cur_year']);

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


    // select option intake after choose cur_year
    public function opt_intake_progDet($id){
        $cur_year = str_replace("-","/",$id);

        $obj = mis_prm_curyear::where([['cur_year', $cur_year],
                ['mis_prm_curyear.cur_status', '=', "Active"],
                ['mis_prm_curyear.recordstatus', '!=', "DEL"]
            ])
            ->get();

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


    // select option semester after choose cur_year
    public function opt_semester($id){
        $selectSem = mis_prm_curyear::groupBy ('cur_semester')
            ->where('cur_year','=',$id)
            ->where('mis_prm_curyear.cur_status','=',"Active")
            ->where('mis_prm_curyear.recordstatus','!=',"DEL")
            ->get();

        if ($selectSem){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$selectSem
            ],200);
        }
        else{
            return response()->json([
                'success'=>'false',
                'message'=>'No Data Found!',
                'data'=>$selectSem
            ],200);
        }
    }


    public function opt_programme($id){
        $obj = mis_prm_curyear::groupBy('pgm_id')
        ->where('cur_status','Active')->where('recordstatus','!=',"DEL")
        ->where('id',$id)->get();
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


    // select Intake active
    public function listIntakeAct(){
        $obj = mis_prm_curyear::groupBy('cur_intake')
            ->selectRaw('RIGHT(cur_intake, 4) AS getYear,
                CASE 
                WHEN LEFT(cur_intake, 3) = "JAN" THEN 1
                WHEN LEFT(cur_intake, 3) = "FEB" THEN 2
                WHEN LEFT(cur_intake, 3) = "MAR" THEN 3
                WHEN LEFT(cur_intake, 3) = "APR" THEN 4
                WHEN LEFT(cur_intake, 3) = "MAY" THEN 5
                WHEN LEFT(cur_intake, 3) = "JUN" THEN 6
                WHEN LEFT(cur_intake, 3) = "JUL" THEN 7
                WHEN LEFT(cur_intake, 3) = "AUG" THEN 8
                WHEN LEFT(cur_intake, 3) = "SEP" THEN 9
                WHEN LEFT(cur_intake, 3) = "OCT" THEN 10
                WHEN LEFT(cur_intake, 3) = "NOV" THEN 11
                WHEN LEFT(cur_intake, 3) = "DEC" THEN 12
                ELSE 0
                END AS monthNo, cur_intake, id')
            ->where([['cur_status','=',"Active"],['recordstatus','!=',"DEL"]])
            ->orderBy('getYear','desc')
            ->orderBy('monthNo','desc')
            ->get();

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


    // select Year active
    public function listYearAct(){

        $obj = mis_prm_curyear::select('cur_year')
            ->where('recordstatus', '!=', 'DEL')
            ->where('cur_status', '=', 'Active')
            ->groupBy('cur_year')
            ->orderBy('cur_year')
            ->get();

    
        
        

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

  // select Year active
  public function listYearActUpt(Request $request){
    // $obj = mis_prm_curyear::groupBy('cur_year')
    //     ->where([['recordstatus','!=','DEL'],['cur_status','=','Active']])
    //     ->orderBy('cur_year') ->get();
    $id3 = $request->input('exam_policy_id');
    // $id3 = $request->input('exam_policy_id');
    // $id3 = $request->input('Pk_exam_policy');
    // $query1 = mis_prm_curyear::where('recordstatus', '!=', 'DEL')
    // ->where('cur_status', '=', 'Active')->get('cur_year')
    // ->groupBy('cur_year');

    // \DB::enableQueryLog();

    $query1 = mis_prm_curyear::where('recordstatus', '!=', 'DEL')
    ->where('cur_status', '=', 'Active')->select('cur_year')
    ->groupBy('cur_year');

    $query2 = mis_prm_curyear::
        join('mis_exam_policy_date', 'mis_prm_curyear.cur_year', '=', 'mis_exam_policy_date.cur_year')
        ->where('mis_exam_policy_date.Pk_exam_policy', '=', $id3)->select('mis_prm_curyear.cur_year')
        ->groupBy('mis_prm_curyear.cur_year');

    $obj = $query1->union($query2)
        ->orderBy('cur_year')
        ->get(['cur_year']);

    // print($result);
        // $query2 = mis_prm_curyear::
        // leftjoin('mis_exam_policy_date', 'mis_exam_policy_date.cur_year', '=', 'mis_prm_curyear.cur_year')
        // ->where('mis_exam_policy_date.Pk_exam_policy', $id3)
        // ->
        // get('cur_year')
        // ->groupBy('mis_prm_curyear.cur_year');
        // dd(\DB::getQueryLog());

        // dd($query2);
        
    // $obj = $query1->union($query2)->orderBy('cur_year')->get();


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
    

    


    // check intake if exist
    public function chkIntake(Request $request){
        $id = $request->input('fk_acaCal');
        $intake = $request->input('cur_intake');

        $obj = mis_prm_curyear::where([
                ['fk_acaCal','=',$id],
                ['cur_intake','=',$intake],
                ['recordstatus','!=','DEL']
            ]) 
            ->get('id');

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }


    // check update intake if exist
    public function chkUptIntake(Request $request){
        $id = $request->input('id');
        $cur_intake = $request->input('cur_intake');

        $obj = mis_prm_curyear::where([
                ['id','!=',$id],
                ['cur_intake','=',$cur_intake],
                ['recordstatus','!=','DEL']
            ]) ->get();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }


    // list by Academic Calendar
    public function listByAcaCal($id){
        $obj = mis_prm_curyear::where([['mis_prm_curyear.recordstatus','!=','DEL'],['fk_acaCal',$id]])
            ->leftjoin('intake', 'intake.id','=','mis_prm_curyear.cur_intake')
            ->orderBy('intake_year','desc')
            ->get([
                'mis_prm_curyear.id AS id_curYear',
                'cur_intake',
                'intake_name',
                'intake_year',
                'fk_acaCal',
                'mis_prm_curyear.id AS curYear_id'
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

    public function listCal(){
        $obj = mis_prm_curyear::
        join('intake','intake.id','mis_prm_curyear.cur_intake')
        ->join('mis_prm_calendar','mis_prm_calendar.cal_id','mis_prm_curyear.fk_acaCal')
        ->where('mis_prm_curyear.recordstatus','!=','DEL')
        ->get([
            'cal_id',
            'mis_prm_calendar.cur_year',
            DB::RAW('CONCAT(intake.intake_name,"-",intake.intake_year) AS cal_intake'),
            'cal_cohort'
        ]);

        if(sizeof($obj) > 0){
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

    public function curYearActive(Request $request){
        $cur_year = $request->input('cur_year');
        $cal_cohort = $request->input('cal_cohort');

        $obj = mis_prm_curyear::
        join('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_prm_curyear.fk_acaCal')
        ->join('intake', 'intake.id', '=', 'mis_prm_curyear.cur_intake')
        ->where('mis_prm_calendar.cur_year', '=', $cur_year)
        ->where('mis_prm_calendar.cal_cohort', '=', $cal_cohort)
        ->where('mis_prm_curyear.recordstatus', '!=', 'DEL')
        ->orderBy('intake.intake_year','ASC')
        // ->orderBy('intake.intake_name','ASC')
        ->groupBy('intake.intake_name', 'intake.intake_year')
        ->get([
            'intake.intake_name',
            'intake.intake_year',
            // 'mis_prm_calendar.cur_year',
            // 'mis_prm_calendar.cal_cohort'
        ]);

        if(sizeof($obj) > 0){
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
}
