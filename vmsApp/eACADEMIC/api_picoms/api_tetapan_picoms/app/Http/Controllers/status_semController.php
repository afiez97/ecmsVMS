<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\status_sem;

class status_semController extends Controller
{
    public function register(Request $request) {
        $id = $request->input('id');
        $status_sem_name = $request->input('status_sem_name');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $register = status_sem::create([
            'id' => $id,
            'status_sem_name' => $status_sem_name,
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

        $status_sem = status_sem::where('id',$id)->first();

        if ($status_sem)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$status_sem
            ],200);
        }
    }

    public function list()  {
        $status_sem = status_sem::all();

        if ($status_sem)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$status_sem
            ],200);
        }
        
    }

    public function update(Request $request)    {
        $id = $request->input('id');
        $status_sem_name = $request->input('status_sem_name');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $status_sem = status_sem::find($id); 

        $status_sem -> update([
            'id' => $id,
            'status_sem_name' => $status_sem_name,
            'lastupdateon' => $lastupdateon,
            'lastupdateby' => $lastupdateby,
            'lastapproveon' => $lastapproveon,
            'lastapproveby' => $lastapproveby,
            'recordstatus' => $recordstatus,
        ]);

        if ($status_sem)  {
            return response()->json([
                'success'=>true,
                'message'=>"Update Success!",
                'data' => $status_sem
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
