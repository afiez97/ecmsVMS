<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_religion;

class mis_religionController extends Controller
{
    public function show($id)  {

        $obj = mis_religion::where('sti_religion_id',$id)->first();

        if ($obj)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }

    public function list()  {
        $obj = mis_religion::all();

        if(sizeof($obj) > 0){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
        else {
            return response()->json([
                'success'=>'false',
                'message'=>'Show Fail!',
                'data'=>$obj
            ],200);
        }
        
    }
}
