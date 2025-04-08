<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_lecturer_teach_time;

class mis_lecturer_teach_timeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    // add teach time
    public function register(Request $request){
        $emp_id = $request->input('emp_id');
        $tme_min = $request->input('tme_min');
        $tme_max = $request->input('tme_max');
        $tme_mon = $request->input('tme_mon');
        $tme_tue = $request->input('tme_tue');
        $tme_wed = $request->input('tme_wed');
        $tme_thu = $request->input('tme_thu');
        $tme_fri = $request->input('tme_fri');
        $recordstatus = $request->input('recordstatus');

        $register = mis_lecturer_teach_time::create([
            'emp_id' => $emp_id,
            'tme_min' => $tme_min,
            'tme_max' => $tme_max,
            'tme_mon' => $tme_mon,
            'tme_tue' => $tme_tue,
            'tme_wed' => $tme_wed,
            'tme_thu' => $tme_thu,
            'tme_fri' => $tme_fri,
            'recordstatus' => $recordstatus
        ]);

        if ($register)  {
            return response()->json([
                'success'=>'true',
                'message'=>'Register Success!',
                'data'=>$register
            ],201);
        }

        else    {
            return response()->json([
                'success'=>'false',
                'message'=>'Bad Request',
                'data'=>$register
            ],400);
        }
    }

    
    public function update(Request $request){
        $pk_id = $request->input('pk_id');
        $tme_min = $request->input('tme_min');
        $tme_max = $request->input('tme_max');
        $tme_mon = $request->input('tme_mon');
        $tme_tue = $request->input('tme_tue');
        $tme_wed = $request->input('tme_wed');
        $tme_thu = $request->input('tme_thu');
        $tme_fri = $request->input('tme_fri');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_lecturer_teach_time::where('pk_id',$pk_id) ->update([            
            'tme_min' => $tme_min,
            'tme_max' => $tme_max,
            'tme_mon' => $tme_mon,
            'tme_tue' => $tme_tue,
            'tme_wed' => $tme_wed,
            'tme_thu' => $tme_thu,
            'tme_fri' => $tme_fri,
            'recordstatus' => $recordstatus
        ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Update Success!',
                'data'=>$obj
            ],201);
        }
        else{
            return response()->json([
                'success'=>'false',
                'message'=>'Bad Request',
                'data'=>$obj
            ],201);
        }
    }


    // show detail
    public function show($id){
        $obj = mis_lecturer_teach_time::where('emp_id',$id)
            ->first([
                'pk_id',
                'emp_id',
                'tme_min',
                'tme_max',
                'tme_mon',
                'tme_tue',
                'tme_wed',
                'tme_thu',
                'tme_fri'
            ]);

        if($obj){
            return response()->json([
                'success'=>true,
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>'No Data Found!',
                'data'=>$obj
            ],200);
        }
    }

}
