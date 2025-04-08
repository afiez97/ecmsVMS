<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\semester;

class semesterController extends Controller
{
    public function register(Request $request) {
        $id = $request->input('id');
        $semester_name = $request->input('semester_name');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $register = semester::create([
            'id' => $id,
            'semester_name' => $semester_name,
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

        $semester = semester::where('id',$id)->first();

        if ($semester)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$semester
            ],200);
        }
    }

    public function list()  {
        $semester = semester::all();

        if ($semester)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$semester
            ],200);
        }
        
    }

    public function update(Request $request)    {
        $id = $request->input('id');
        $semester_name = $request->input('semester_name');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $semester = semester::find($id); 

        $semester -> update([
            'id' => $id,
            'semester_name' => $semester_name,
            'lastupdateon' => $lastupdateon,
            'lastupdateby' => $lastupdateby,
            'lastapproveon' => $lastapproveon,
            'lastapproveby' => $lastapproveby,
            'recordstatus' => $recordstatus,
        ]);

        if ($semester)  {
            return response()->json([
                'success'=>true,
                'message'=>"Update Success!",
                'data' => $semester
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
