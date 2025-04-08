<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_exam_policy_date;

class mis_exam_policy_dateController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function register(Request $request){
        $cur_year = $request->input('cur_year');
        $pol_category = $request->input('pol_category');
        $assessment = "Continuous";
        $pol_exm_type = "3";
        $pol_marks_open = $request->input('pol_marks_open');
        $pol_marks_close = $request->input('pol_marks_close');
        $recordstatus = $request->input('recordstatus');
        $cal_cohort = $request->input('cal_cohort');
        $exam_status = $request->input('exam_status');
        $aca_calendar = $request->input('aca_calendar');

        $register = mis_exam_policy_date::create([
            'cur_year' => $cur_year,
            'pol_category' => $pol_category,
            'assessment' => $assessment,
            'pol_exm_type' => $pol_exm_type,
            'pol_marks_open' => $pol_marks_open,
            'pol_marks_close' => $pol_marks_close,
            'recordstatus' => $recordstatus,
            'cal_cohort' => $cal_cohort,
            'exam_status' => $exam_status,
            'aca_calendar' => $aca_calendar
        ]);

        if ($register){
            return response()->json([
                'success'=>'true',
                'message'=>'Register Success!',
                'data'=>$register
            ],200);
        }
        else{
            return response()->json([
                'success'=>'false',
                'message'=>'Bad Request',
                'data'=>$register
            ],400);
        }
    }


    public function show(Request $request)  {
        $Pk_exam_policy = $request->input('Pk_exam_policy');

        $mis_exam_policy_date = mis_exam_policy_date::where('Pk_exam_policy',$Pk_exam_policy)->first();

        if ($mis_exam_policy_date)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$mis_exam_policy_date
            ],200);
        }
    }


    public function list(){
        $obj = mis_exam_policy_date::where([['mis_exam_policy_date.recordstatus','!=','DEL']])
            ->leftjoin('mis_prm_calendar','mis_exam_policy_date.aca_calendar','mis_prm_calendar.cal_id')
            ->leftjoin('aca_cal_category','aca_cal_category.pk_id','mis_prm_calendar.cal_category')
            ->orderBy('cur_year', 'desc')
            ->get([
                'Pk_exam_policy',
                'aca_cal_category.category',
                'cur_intake',
                // 'pol_category',
                'pol_exm_type',
                'mis_prm_calendar.cal_category',
                'pol_marks_open',
                // 'pol_marks_close',
                'mis_prm_calendar.cur_year',
                'assessment', 'mis_prm_calendar.cal_cohort', 'exam_status', 'mis_exam_policy_date.aca_calendar'
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
        $Pk_exam_policy = $request->input('Pk_exam_policy');
        $cur_year = $request->input('cur_year');

        $cur_year2 = substr($cur_year, 0, strrpos($cur_year, "/"));
        $cohort = substr($cur_year, strrpos($cur_year, "/") + 1);
        // let cal_cohort = $("#currYear option:selected").attr("calSem");
        $pol_category = $request->input('pol_category');
        // $assessment = $request->input('assessment');
        $assessment = "Continuous";
        $pol_exm_type = "3";
        $pol_marks_open = $request->input('pol_marks_open');
        // $pol_marks_close = $request->input('pol_marks_close');
        $recordstatus = $request->input('recordstatus');
        $exam_status = $request->input('exam_status');
        $aca_calendar = $request->input('aca_calendar');


        $obj = mis_exam_policy_date::where([['Pk_exam_policy',$Pk_exam_policy]]) 
        ->update([
            'cur_year' => $cur_year2,
            'cal_cohort' => $cohort,
            'pol_category' => $pol_category,
            'assessment' => $assessment,
            'pol_exm_type' => $pol_exm_type,
            'pol_marks_open' => $pol_marks_open,
            // 'pol_marks_close' => $pol_marks_close,
            'recordstatus' => $recordstatus,
            'exam_status' => $exam_status,
            'aca_calendar' => $aca_calendar,
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
        $Pk_exam_policy = $request->input('Pk_exam_policy');
        $recordstatus = $request->input('recordstatus');

        $mis_exam_policy_date = mis_exam_policy_date::where([['Pk_exam_policy',$Pk_exam_policy]]) -> update([
            'recordstatus' => $recordstatus,
        ]);

        if ($mis_exam_policy_date)  {
            return response()->json([
                'success'=>true,
                'message'=>"Hapus Berjaya!",
                'data' => $mis_exam_policy_date
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Hapus Gagal!",
                'data'=>''
            ],404);
        }
    }


    public function policyExamGet($id){
        

        $obj = mis_exam_policy_date::select('cur_year', 'cal_cohort', 'pol_category', 'pol_exm_type', 'assessment', 'exam_status', 'pol_marks_open')
            ->where('recordstatus', '!=', 'DEL')
            ->where('aca_calendar', $id)
            ->where('exam_status', 'ACTIVE')
            ->get();

    

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }
}
