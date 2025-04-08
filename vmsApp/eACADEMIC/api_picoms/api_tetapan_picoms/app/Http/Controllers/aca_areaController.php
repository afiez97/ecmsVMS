<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\aca_area;

class aca_areaController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function register(Request $request) {
        $id = $request->input('id');
        $aca_area_name = $request->input('aca_area_name');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $register = aca_area::create([
            'id' => $id,
            'aca_area_name' => $aca_area_name,
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

        $aca_area = aca_area::where('id',$id)->first();

        if ($aca_area)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$aca_area
            ],200);
        }
    }

    public function list()  {
        $aca_area = aca_area::all();

        if ($aca_area)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$aca_area
            ],200);
        }
        
    }

    public function update(Request $request)    {
        $id = $request->input('id');
        $aca_area_name = $request->input('aca_area_name');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $aca_area = aca_area::find($id); 

        $aca_area -> update([
            'id' => $id,
            'aca_area_name' => $aca_area_name,
            'lastupdateon' => $lastupdateon,
            'lastupdateby' => $lastupdateby,
            'lastapproveon' => $lastapproveon,
            'lastapproveby' => $lastapproveby,
            'recordstatus' => $recordstatus,
        ]);

        if ($aca_area)  {
            return response()->json([
                'success'=>true,
                'message'=>"Update Success!",
                'data' => $aca_area
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
