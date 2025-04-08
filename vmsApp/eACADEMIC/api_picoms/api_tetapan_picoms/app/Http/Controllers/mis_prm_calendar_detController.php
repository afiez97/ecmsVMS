<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_prm_calendar_det;

class mis_prm_calendar_detController extends Controller
{
    public function register(Request $request){
        $cal_id = $request->input('cal_id');
        $cld_activity = $request->input('cld_activity');
        $cld_startdate = $request->input('cld_startdate');
        $cld_enddate = $request->input('cld_enddate');
        $cld_totdow = $request->input('cld_totdow');
        $cld_status = $request->input('cld_status');
        $recordstatus = $request->input('recordstatus');

        $register = mis_prm_calendar_det::create([
            'cal_id' => $cal_id,
            'cld_activity' => $cld_activity,
            'cld_startdate' => $cld_startdate,
            'cld_enddate' => $cld_enddate,
            'cld_totdow' => $cld_totdow,
            'cld_status' => $cld_status,
            'recordstatus' => $recordstatus,
        ]);

        if ($register){
            return response()->json([
                'success'=>'true',
                'message'=>'Register Success!',
                'data'=>$register
            ],201);
        }
        else{
            return response()->json([
                'success'=>'false',
                'message'=>'Bad Request',
                'data'=>$register
            ],400);
        }
    }


    public function show(Request $request){
        $cal_id = $request->input('cal_id');

        $obj = mis_prm_calendar_det::where([['recordstatus','!=','DEL'],['cal_id','=',$cal_id]])->orderBy('cld_startdate', 'asc') ->get();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }

    public function list(){
        $obj = mis_prm_calendar_det::where('recordstatus','!=','DEL')->orderBy('cld_startdaste', 'asc') ->get();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function update(Request $request){
        $cld_id = $request->input('cld_id');
        $cld_activity = $request->input('cld_activity');
        $cld_startdate = $request->input('cld_startdate');
        $cld_enddate = $request->input('cld_enddate');
        $cld_totdow = $request->input('cld_totdow');
        $cld_status = $request->input('cld_status');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_calendar_det::where([['cld_id','=',$cld_id]]) -> update([
            'cld_activity' => $cld_activity,
            'cld_startdate' => $cld_startdate,
            'cld_enddate' => $cld_enddate,
            'cld_totdow' => $cld_totdow,
            'cld_status' => $cld_status,
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


    public function delete(Request $request){
        $cld_id = $request->input('cld_id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_calendar_det::where([['cld_id','=',$cld_id]]) -> update([
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
            ],404);
        }
    }
}
