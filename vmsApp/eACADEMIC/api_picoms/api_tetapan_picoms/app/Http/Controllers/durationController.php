<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\duration;

class durationController extends Controller
{
    public function register(Request $request) {
        $id = $request->input('id');
        $duration_name = $request->input('duration_name');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $register = duration::create([
            'id' => $id,
            'duration_name' => $duration_name,
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

        $duration = duration::where('id',$id)->first();

        if ($duration)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$duration
            ],200);
        }
    }

    public function list()  {
        $duration = duration::all();

        if ($duration)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$duration
            ],200);
        }
        
    }

    public function update(Request $request)    {
        $id = $request->input('id');
        $duration_name = $request->input('duration_name');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $duration = duration::find($id); 

        $duration -> update([
            'id' => $id,
            'duration_name' => $duration_name,
            'lastupdateon' => $lastupdateon,
            'lastupdateby' => $lastupdateby,
            'lastapproveon' => $lastapproveon,
            'lastapproveby' => $lastapproveby,
            'recordstatus' => $recordstatus,
        ]);

        if ($duration)  {
            return response()->json([
                'success'=>true,
                'message'=>"Update Success!",
                'data' => $duration
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
