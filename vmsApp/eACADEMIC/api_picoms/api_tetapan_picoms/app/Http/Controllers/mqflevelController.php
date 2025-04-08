<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mqflevel;

class mqflevelController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function register(Request $request) {
        $id = $request->input('id');
        $mqflevel_name = $request->input('mqflevel_name');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $register = mqflevel::create([
            'id' => $id,
            'mqflevel_name' => $mqflevel_name,
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

        $mqflevel = mqflevel::where('id',$id)->first();

        if ($mqflevel)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$mqflevel
            ],200);
        }
    }

    public function list()  {
        $mqflevel = mqflevel::all();

        if ($mqflevel)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$mqflevel
            ],200);
        }
        
    }

    public function update(Request $request)    {
        $id = $request->input('id');
        $mqflevel_name = $request->input('mqflevel_name');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $mqflevel = mqflevel::find($id); 

        $mqflevel -> update([
            'id' => $id,
            'mqflevel_name' => $mqflevel_name,
            'lastupdateon' => $lastupdateon,
            'lastupdateby' => $lastupdateby,
            'lastapproveon' => $lastapproveon,
            'lastapproveby' => $lastapproveby,
            'recordstatus' => $recordstatus,
        ]);

        if ($mqflevel)  {
            return response()->json([
                'success'=>true,
                'message'=>"Update Success!",
                'data' => $mqflevel
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
