<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_race;

class mis_raceController extends Controller
{
    public function show($id)  {

        $obj = mis_race::where('sti_race_id',$id)->first();

        if ($obj)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }

    public function list()  {
        $obj = mis_race::all();

        if ($obj)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
        
    }
}
