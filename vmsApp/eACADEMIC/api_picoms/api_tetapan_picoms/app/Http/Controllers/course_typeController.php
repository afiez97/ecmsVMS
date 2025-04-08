<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\course_type;

class course_typeController extends Controller
{
    public function register(Request $request) {
        $id = $request->input('id');
        $cts_type_name = $request->input('cts_type_name');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $register = course_type::create([
            'id' => $id,
            'cts_type_name' => $cts_type_name,
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

        $course_type = course_type::where('id',$id)->first();

        if ($course_type)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$course_type
            ],200);
        }
    }

    public function list()  {
        $course_type = course_type::all();

        if ($course_type)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$course_type
            ],200);
        }
        
    }

    public function update(Request $request)    {
        $id = $request->input('id');
        $cts_type_name = $request->input('cts_type_name');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $course_type = course_type::find($id); 

        $course_type -> update([
            'id' => $id,
            'cts_type_name' => $cts_type_name,
            'lastupdateon' => $lastupdateon,
            'lastupdateby' => $lastupdateby,
            'lastapproveon' => $lastapproveon,
            'lastapproveby' => $lastapproveby,
            'recordstatus' => $recordstatus,
        ]);

        if ($course_type)  {
            return response()->json([
                'success'=>true,
                'message'=>"Update Success!",
                'data' => $course_type
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
