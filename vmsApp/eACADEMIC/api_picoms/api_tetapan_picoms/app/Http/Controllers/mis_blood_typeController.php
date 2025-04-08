<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_blood_type;

class mis_blood_typeController extends Controller
{
    public function show($id)  {

        $obj = mis_blood_type::where('sti_blood_type_id',$id)->first();

        if ($obj)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }

    public function list()  {
        $obj = mis_blood_type::all();

        if ($obj)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
        
    }
}
