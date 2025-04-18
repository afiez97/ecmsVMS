<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mode;

class modeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function register(Request $request) {
        $id = $request->input('id');
        $mode_name = $request->input('mode_name');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $register = mode::create([
            'id' => $id,
            'mode_name' => $mode_name,
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

        $mode = mode::where('id',$id)->first();

        if ($mode)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$mode
            ],200);
        }
    }

    public function list()  {
        $mode = mode::all();

        if ($mode)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$mode
            ],200);
        }
        
    }

    public function update(Request $request)    {
        $id = $request->input('id');
        $mode_name = $request->input('mode_name');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $mode = mode::find($id); 

        $mode -> update([
            'id' => $id,
            'mode_name' => $mode_name,
            'lastupdateon' => $lastupdateon,
            'lastupdateby' => $lastupdateby,
            'lastapproveon' => $lastapproveon,
            'lastapproveby' => $lastapproveby,
            'recordstatus' => $recordstatus,
        ]);

        if ($mode)  {
            return response()->json([
                'success'=>true,
                'message'=>"Update Success!",
                'data' => $mode
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
