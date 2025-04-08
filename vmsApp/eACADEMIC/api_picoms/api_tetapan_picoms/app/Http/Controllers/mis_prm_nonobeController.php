<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_prm_nonobe;

class mis_prm_nonobeController extends Controller
{
    public function register(Request $request) {
        $obe_id = $request->input('obe_id');
        $obe_type = $request->input('obe_type');
        $obe_nocomponent = $request->input('obe_nocomponent');
        $obe_percentage = $request->input('obe_percentage');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $register = mis_prm_nonobe::create([
            'obe_id' => $obe_id,
            'obe_type' => $obe_type,
            'obe_nocomponent' => $obe_nocomponent,
            'obe_percentage' => $obe_percentage,
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
        $obe_id = $request->input('obe_id');

        $mis_prm_nonobe = mis_prm_nonobe::where('obe_id',$obe_id)->first();

        if ($mis_prm_nonobe)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$mis_prm_nonobe
            ],200);
        }
    }

    public function list()  {
        $mis_prm_nonobe = mis_prm_nonobe::all();

        if ($mis_prm_nonobe)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$mis_prm_nonobe
            ],200);
        }
        
    }

    public function update(Request $request)    {
        $obe_id = $request->input('obe_id');
        $obe_type = $request->input('obe_type');
        $obe_nocomponent = $request->input('obe_nocomponent');
        $obe_percentage = $request->input('obe_percentage');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $mis_prm_nonobe = mis_prm_nonobe::find($obe_id); 

        $mis_prm_nonobe -> update([
            'obe_id' => $obe_id,
            'obe_type' => $obe_type,
            'obe_nocomponent' => $obe_nocomponent,
            'obe_percentage' => $obe_percentage,
            'lastupdateon' => $lastupdateon,
            'lastupdateby' => $lastupdateby,
            'lastapproveon' => $lastapproveon,
            'lastapproveby' => $lastapproveby,
            'recordstatus' => $recordstatus,
        ]);

        if ($mis_prm_nonobe)  {
            return response()->json([
                'success'=>true,
                'message'=>"Update Success!",
                'data' => $mis_prm_nonobe
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
