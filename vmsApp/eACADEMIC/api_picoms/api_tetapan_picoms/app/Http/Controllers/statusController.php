<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\status;

class statusController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function register(Request $request) {
        $id = $request->input('id');
        $status_name = $request->input('status_name');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $register = status::create([
            'id' => $id,
            'status_name' => $status_name,
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

        $status = status::where('id',$id)->first();

        if ($status)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$status
            ],200);
        }
    }

    public function list()  {
        $status = status::all();

        if ($status)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$status
            ],200);
        }
        
    }

    public function update(Request $request)    {
        $id = $request->input('id');
        $status_name = $request->input('status_name');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $status = status::find($id); 

        $status -> update([
            'id' => $id,
            'status_name' => $status_name,
            'lastupdateon' => $lastupdateon,
            'lastupdateby' => $lastupdateby,
            'lastapproveon' => $lastapproveon,
            'lastapproveby' => $lastapproveby,
            'recordstatus' => $recordstatus,
        ]);

        if ($status)  {
            return response()->json([
                'success'=>true,
                'message'=>"Update Success!",
                'data' => $status
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
