<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_prm_timetable_det;

class mis_prm_timetable_detController extends Controller
{
    public function register(Request $request) {
        $tdt_id = $request->input('tdt_id');
        $tme_id = $request->input('tme_id');
        $tdt_course = $request->input('tdt_course');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $register = mis_prm_timetable_det::create([
            'tdt_id' => $tdt_id,
            'tme_id' => $tme_id,
            'tdt_course' => $tdt_course,
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
        $tdt_id = $request->input('tdt_id');

        $mis_prm_timetable_det = mis_prm_timetable_det::where('tdt_id',$tdt_id)->first();

        if ($mis_prm_timetable_det)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$mis_prm_timetable_det
            ],200);
        }
    }

    public function list()  {
        $mis_prm_timetable_det = mis_prm_timetable_det::all();

        if ($mis_prm_timetable_det)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$mis_prm_timetable_det
            ],200);
        }
        
    }

    public function update(Request $request)    {
        $tdt_id = $request->input('tdt_id');
        $tme_id = $request->input('tme_id');
        $tdt_course = $request->input('tdt_course');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $mis_prm_timetable_det = mis_prm_timetable_det::find($tdt_id); 

        $mis_prm_timetable_det -> update([
            'tdt_id' => $tdt_id,
            'tme_id' => $tme_id,
            'tdt_course' => $tdt_course,
            'lastupdateon' => $lastupdateon,
            'lastupdateby' => $lastupdateby,
            'lastapproveon' => $lastapproveon,
            'lastapproveby' => $lastapproveby,
            'recordstatus' => $recordstatus,
        ]);

        if ($mis_prm_timetable_det)  {
            return response()->json([
                'success'=>true,
                'message'=>"Update Success!",
                'data' => $mis_prm_timetable_det
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
