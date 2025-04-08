<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_tbl_policy;

class mis_tbl_policyController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function show(Request $request)  {
        $tpl_id = $request->input('tpl_id');

        $mis_tbl_policy = mis_tbl_policy::where('tpl_id','ecms')->get();

        if ($mis_tbl_policy)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$mis_tbl_policy
            ],200);
        }
    }

    public function update(Request $request){
        $tpl_date_start = $request->input('tpl_date_start');
        $tpl_date_end = $request->input('tpl_date_end');
        $recordstatus = $request->input('recordstatus');
        $tpl_id = $request->input('tpl_id');

        $mis_tbl_policy = mis_tbl_policy::where([['tpl_id',$tpl_id]]) -> update([
            'tpl_date_start' => $tpl_date_start,
            'tpl_date_end' => $tpl_date_end,
            'recordstatus' => $recordstatus,
        ]);

        if ($mis_tbl_policy)  {
            return response()->json([
                'success'=>true,
                'message'=>"Update Success!",
                'data' => $mis_tbl_policy
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
