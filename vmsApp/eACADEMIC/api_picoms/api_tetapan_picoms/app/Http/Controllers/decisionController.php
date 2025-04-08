<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\decision;

class decisionController extends Controller
{
    public function register(Request $request) {
        $id = $request->input('id');
        $decision_code = $request->input('decision_code');
        $decision_name = $request->input('decision_name');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $register = decision::create([
            'id' => $id,
            'decision_code' => $decision_code,
            'decision_name' => $decision_name,
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

        $decision = decision::where('id',$id)->first();

        if ($decision)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$decision
            ],200);
        }
    }

    public function list()  {
        $decision = decision::all();

        if ($decision)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$decision
            ],200);
        }
        
    }

    public function update(Request $request)    {
        $id = $request->input('id');
        $decision_code = $request->input('decision_code');
        $decision_name = $request->input('decision_name');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $decision = decision::find($id); 

        $decision -> update([
            'id' => $id,
            'decision_code' => $decision_code,
            'decision_name' => $decision_name,
            'lastupdateon' => $lastupdateon,
            'lastupdateby' => $lastupdateby,
            'lastapproveon' => $lastapproveon,
            'lastapproveby' => $lastapproveby,
            'recordstatus' => $recordstatus,
        ]);

        if ($decision)  {
            return response()->json([
                'success'=>true,
                'message'=>"Update Success!",
                'data' => $decision
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
