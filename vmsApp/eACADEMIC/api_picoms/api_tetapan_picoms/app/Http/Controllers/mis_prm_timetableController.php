<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_prm_timetable;

class mis_prm_timetableController extends Controller
{
    public function register(Request $request) {
        $tme_id = $request->input('tme_id');
        $tme_category = $request->input('tme_category');
        $tme_empid = $request->input('tme_empid');
        $tme_stime = $request->input('tme_stime');
        $tme_etime = $request->input('tme_etime');
        $tme_minlect = $request->input('tme_minlect');
        $tme_maxlect = $request->input('tme_maxlect');
        $tme_semester = $request->input('tme_semester');
        $tme_status = $request->input('tme_status');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $register = mis_prm_timetable::create([
            'tme_id' => $tme_id,
            'tme_category' => $tme_category,
            'tme_empid' => $tme_empid,
            'tme_stime' => $tme_stime,
            'tme_etime' => $tme_etime,
            'tme_minlect' => $tme_minlect,
            'tme_maxlect' => $tme_maxlect,
            'tme_semester' => $tme_semester,
            'tme_status' => $tme_status,
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
        $tme_id = $request->input('tme_id');

        $mis_prm_timetable = mis_prm_timetable::where('tme_id',$tme_id)->first();

        if ($mis_prm_timetable)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$mis_prm_timetable
            ],200);
        }
    }

    public function list()  {
        $mis_prm_timetable = mis_prm_timetable::all();

        if ($mis_prm_timetable)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$mis_prm_timetable
            ],200);
        }
        
    }

    public function update(Request $request)    {
        $tme_id = $request->input('tme_id');
        $tme_category = $request->input('tme_category');
        $tme_empid = $request->input('tme_empid');
        $tme_stime = $request->input('tme_stime');
        $tme_etime = $request->input('tme_etime');
        $tme_minlect = $request->input('tme_minlect');
        $tme_maxlect = $request->input('tme_maxlect');
        $tme_semester = $request->input('tme_semester');
        $tme_status = $request->input('tme_status');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $mis_prm_timetable = mis_prm_timetable::find($tme_id); 

        $mis_prm_timetable -> update([
            'tme_id' => $tme_id,
            'tme_category' => $tme_category,
            'tme_empid' => $tme_empid,
            'tme_stime' => $tme_stime,
            'tme_etime' => $tme_etime,
            'tme_minlect' => $tme_minlect,
            'tme_maxlect' => $tme_maxlect,
            'tme_semester' => $tme_semester,
            'tme_status' => $tme_status,
            'lastupdateon' => $lastupdateon,
            'lastupdateby' => $lastupdateby,
            'lastapproveon' => $lastapproveon,
            'lastapproveby' => $lastapproveby,
            'recordstatus' => $recordstatus,
        ]);

        if ($mis_prm_timetable)  {
            return response()->json([
                'success'=>true,
                'message'=>"Update Success!",
                'data' => $mis_prm_timetable
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
