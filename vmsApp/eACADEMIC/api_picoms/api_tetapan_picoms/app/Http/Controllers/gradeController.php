<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\grade;

class gradeController extends Controller
{
    public function register(Request $request) {
        $id = $request->input('id');
        $grade_name = $request->input('grade_name');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $register = grade::create([
            'id' => $id,
            'grade_name' => $grade_name,
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

        $grade = grade::where('id',$id)->first();

        if ($grade)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$grade
            ],200);
        }
    }

    public function list()  {
        $grade = grade::all();

        if ($grade)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$grade
            ],200);
        }
        
    }

    public function update(Request $request)    {
        $id = $request->input('id');
        $grade_name = $request->input('grade_name');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $grade = grade::find($id); 

        $grade -> update([
            'id' => $id,
            'grade_name' => $grade_name,
            'lastupdateon' => $lastupdateon,
            'lastupdateby' => $lastupdateby,
            'lastapproveon' => $lastapproveon,
            'lastapproveby' => $lastapproveby,
            'recordstatus' => $recordstatus,
        ]);

        if ($grade)  {
            return response()->json([
                'success'=>true,
                'message'=>"Update Success!",
                'data' => $grade
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
