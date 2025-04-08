<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\sem_type;

class sem_typeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function register(Request $request) {
        $id = $request->input('id');
        $sem_type_code_short = $request->input('sem_type_code_short');
        $sem_type_code = $request->input('sem_type_code');
        $sem_type_name = $request->input('sem_type_name');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $register = sem_type::create([
            'id' => $id,
            'sem_type_code_short' => $sem_type_code_short,
            'sem_type_code' => $sem_type_code,
            'sem_type_name' => $sem_type_name,
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

        $sem_type = sem_type::where('id',$id)->first();

        if ($sem_type)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$sem_type
            ],200);
        }
    }

    public function list(){
        $obj = sem_type::where('id','!=','DEL')
            ->get([
                'id',
                'sem_type_code_short',
                'sem_type_code',
                'sem_type_name'
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
        
    }

    public function update(Request $request)    {
        $id = $request->input('id');
        $sem_type_code_short = $request->input('sem_type_code_short');
        $sem_type_code = $request->input('sem_type_code');
        $sem_type_name = $request->input('sem_type_name');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $sem_type = sem_type::find($id); 

        $sem_type -> update([
            'id' => $id,
            'sem_type_code_short' => $sem_type_code_short,
            'sem_type_code' => $sem_type_code,
            'sem_type_name' => $sem_type_name,
            'lastupdateon' => $lastupdateon,
            'lastupdateby' => $lastupdateby,
            'lastapproveon' => $lastapproveon,
            'lastapproveby' => $lastapproveby,
            'recordstatus' => $recordstatus,
        ]);

        if ($sem_type)  {
            return response()->json([
                'success'=>true,
                'message'=>"Update Success!",
                'data' => $sem_type
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
