<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\category;

class categoryController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function register(Request $request) {
        $id = $request->input('id');
        $category_name = $request->input('category_name');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $register = category::create([
            'id' => $id,
            'category_name' => $category_name,
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

        $category = category::where('id',$id)->first();

        if ($category)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$category
            ],200);
        }
    }

    public function list()  {
        $category = category::all();

        if ($category)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$category
            ],200);
        }
        
    }

    public function update(Request $request)    {
        $id = $request->input('id');
        $category_name = $request->input('category_name');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $category = category::find($id); 

        $category -> update([
            'id' => $id,
            'category_name' => $category_name,
            'lastupdateon' => $lastupdateon,
            'lastupdateby' => $lastupdateby,
            'lastapproveon' => $lastapproveon,
            'lastapproveby' => $lastapproveby,
            'recordstatus' => $recordstatus,
        ]);

        if ($category)  {
            return response()->json([
                'success'=>true,
                'message'=>"Update Success!",
                'data' => $category
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
