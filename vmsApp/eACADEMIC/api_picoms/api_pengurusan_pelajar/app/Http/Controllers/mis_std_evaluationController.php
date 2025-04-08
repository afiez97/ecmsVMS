<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_std_evaluation;

// use DB;
use Illuminate\Support\Facades\DB;

class mis_std_evaluationController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function register(Request $request)
    {
        $std_studentid = $request->input('std_studentid');
        $fk_cotDet = $request->input('fk_cotDet');
        $crs_code = $request->input('crs_code');
        $aca_session = $request->input('aca_session');
        $markData = $request->input('markData');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_std_evaluation::create([
            'std_studentid' => $std_studentid,
            'fk_cotDet' => $fk_cotDet,
            'aca_session' => $aca_session,
            'crs_code' => $crs_code,
            'evaluate_data' => $markData,
            'recordstatus' => $recordstatus,
        ]);

        if ($obj) {
            // $obj_std = mis_std_info::where('std_studentid', $std_studentid)->update(['status_academic' => "1"]);
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

   




}
