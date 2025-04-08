<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\cohort;

class cohortController extends Controller
{
    public function register(Request $request) {
        $id = $request->input('id');
        $cohort_name = $request->input('cohort_name');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $register = cohort::create([
            'id' => $id,
            'cohort_name' => $cohort_name,
            'lastupdateon' => $lastupdateon,
            'lastupdateby' => $lastupdateby,
            'lastapproveon' => $lastapproveon,
            'lastapproveby' => $lastapproveby,
            'recordstatus' => $recordstatus,
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

    public function show(Request $request)  {
        $id = $request->input('id');

        $cohort = cohort::where('id',$id)->first();

        if ($cohort)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$cohort
            ],200);
        }
    }

    public function list()  {
        $cohort = cohort::all();

        if ($cohort)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$cohort
            ],200);
        }
        
    }

    public function update(Request $request)    {
        $id = $request->input('id');
        $cohort_name = $request->input('cohort_name');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $cohort = cohort::find($id); 

        $cohort -> update([
            'id' => $id,
            'cohort_name' => $cohort_name,
            'lastupdateon' => $lastupdateon,
            'lastupdateby' => $lastupdateby,
            'lastapproveon' => $lastapproveon,
            'lastapproveby' => $lastapproveby,
            'recordstatus' => $recordstatus,
        ]);

        if ($cohort)  {
            return response()->json([
                'success'=>true,
                'message'=>"Update Success!",
                'data' => $cohort
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
