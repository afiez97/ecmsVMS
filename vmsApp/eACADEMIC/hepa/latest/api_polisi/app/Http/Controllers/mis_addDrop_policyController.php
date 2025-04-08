<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\ mis_addDrop_policy;

class mis_addDrop_policyController extends Controller
{
    public function show(Request $request)  {
        $addDrop_id = $request->input('addDrop_id');

        $mis_addDrop_policy = mis_addDrop_policy::where('addDrop_id','ecms')->get();

        if ($mis_addDrop_policy)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$mis_addDrop_policy
            ],200);
        }
    }

    public function update(Request $request){
        $cur_year = $request->input('cur_year');
        $pgm_id = $request->input('pgm_id');
        $semester = $request->input('semester');
        $start_date = $request->input('start_date');
        $end_date = $request->input('end_date');
        $recordstatus = $request->input('recordstatus');
        $addDrop_id = $request->input('addDrop_id');

        $mis_addDrop_policy = mis_addDrop_policy::where([['addDrop_id',$addDrop_id]]) -> update([
            'cur_year' => $cur_year,
            'pgm_id' => $pgm_id,
            'semester' => $semester,
            'start_date' => $start_date,
            'end_date' => $end_date,
            'recordstatus' => $recordstatus,
        ]);

        if ($mis_addDrop_policy)  {
            return response()->json([
                'success'=>true,
                'message'=>"Update Success!",
                'data' => $mis_addDrop_policy
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
