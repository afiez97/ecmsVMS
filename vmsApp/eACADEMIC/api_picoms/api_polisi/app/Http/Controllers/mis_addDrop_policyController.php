<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\ mis_addDrop_policy;

class mis_addDrop_policyController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }


    public function register(Request $request){
        $cur_year = $request->input('cur_year');
        $aca_calendar = $request->input('aca_calendar');
        $start_date = $request->input('start_date');
        $end_date = $request->input('end_date');
        $status = $request->input('status');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_addDrop_policy::create([
            'cur_year' => $cur_year,
            'aca_calendar' => $aca_calendar,
            'start_date' => $start_date,
            'end_date' => $end_date,
            'status' => $status,
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


    public function show(){
        $obj = mis_addDrop_policy::where('addDrop_id','ecms')->get();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function list(){
        $obj = mis_addDrop_policy::where('mis_addDrop_policy.recordstatus','!=','DEL')
            ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id','=','mis_addDrop_policy.aca_calendar')
            ->leftjoin('aca_cal_category', 'aca_cal_category.pk_id','=','mis_prm_calendar.cal_category')
            ->orderBy('mis_addDrop_policy.status')
            ->orderBy('start_date', 'desc')
            ->orderBy('end_date', 'desc')
            ->get([
                'addDrop_id',
                'aca_calendar',
                'start_date',
                'end_date',
                'status',
                'category',
                'mis_prm_calendar.cur_year AS cal_year',
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
        $cur_year = $request->input('cur_year');
        $aca_calendar = $request->input('aca_calendar');
        $start_date = $request->input('start_date');
        $end_date = $request->input('end_date');
        $status = $request->input('status');
        $recordstatus = $request->input('recordstatus');
        $addDrop_id = $request->input('addDrop_id');

        $obj = mis_addDrop_policy::where([['addDrop_id',$addDrop_id]]) ->update([
            'cur_year' => $cur_year,
            'aca_calendar' => $aca_calendar,
            'start_date' => $start_date,
            'end_date' => $end_date,
            'status' => $status,
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
        $addDrop_id = $request->input('addDrop_id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_addDrop_policy::where('addDrop_id',$addDrop_id)-> update([
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


    // list Active
    public function listActive(){
        $obj = mis_addDrop_policy::where([['status', 'Active'],['recordstatus','!=','DEL']])
            ->orderBy('cur_year', 'desc') 
            ->get([
                'addDrop_id',
                'cur_year',
                'start_date',
                'end_date',
                'status'
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // list by cal_category & status==Active
    public function listByCalCatActive($id){
        $obj = mis_addDrop_policy::where([
                ['cal_category', $id],
                ['status', 'Active'],
                ['mis_addDrop_policy.recordstatus','!=','DEL']
            ])
            ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id','=','mis_addDrop_policy.aca_calendar')
            ->orderBy('mis_prm_calendar.cur_year', 'desc')
            ->orderBy('cal_cohort', 'desc') 
            ->get([
                'cal_id',
                'mis_prm_calendar.cur_year AS cal_year',
                'cal_cohort',
                'start_date',
                'end_date'
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }
}