<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\ctrcode;

class ctrcodeController extends Controller
{
    public function register(Request $request) {
        $id = $request->input('id');
        $ctrcode_code = $request->input('ctrcode_code');
        $ctrcode_name = $request->input('ctrcode_name');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $register = ctrcode::create([
            'id' => $id,
            'ctrcode_code' => $ctrcode_code,
            'ctrcode_name' => $ctrcode_name,
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

        $ctrcode = ctrcode::where('id',$id)->first();

        if ($ctrcode)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$ctrcode
            ],200);
        }
    }

    public function list()  {
        $ctrcode = ctrcode::all();

        if ($ctrcode)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$ctrcode
            ],200);
        }
        
    }

    public function update(Request $request)    {
        $id = $request->input('id');
        $ctrcode_code = $request->input('ctrcode_code');
        $ctrcode_name = $request->input('ctrcode_name');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $ctrcode = ctrcode::find($id); 

        $ctrcode -> update([
            'id' => $id,
            'ctrcode_code' => $ctrcode_code,
            'ctrcode_name' => $ctrcode_name,
            'lastupdateon' => $lastupdateon,
            'lastupdateby' => $lastupdateby,
            'lastapproveon' => $lastapproveon,
            'lastapproveby' => $lastapproveby,
            'recordstatus' => $recordstatus,
        ]);

        if ($ctrcode)  {
            return response()->json([
                'success'=>true,
                'message'=>"Update Success!",
                'data' => $ctrcode
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
