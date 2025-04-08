<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\ mis_aca_class_policy;

class mis_aca_class_policyController extends Controller
{
    public function show(Request $request)  {
        $acaClass_id = $request->input('acaClass_id');

        $mis_aca_class_policy = mis_aca_class_policy::where('acaClass_id','ecms')->get();

        if ($mis_aca_class_policy)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$mis_aca_class_policy
            ],200);
        }
    }

    public function update(Request $request){
        $total_student = $request->input('total_student');
        $recordstatus = $request->input('recordstatus');
        $acaClass_id = $request->input('acaClass_id');

        $mis_aca_class_policy = mis_aca_class_policy::where([['acaClass_id',$acaClass_id]]) -> update([
            'total_student' => $total_student,
            'recordstatus' => $recordstatus,
        ]);

        if ($mis_aca_class_policy)  {
            return response()->json([
                'success'=>true,
                'message'=>"Update Success!",
                'data' => $mis_aca_class_policy
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
