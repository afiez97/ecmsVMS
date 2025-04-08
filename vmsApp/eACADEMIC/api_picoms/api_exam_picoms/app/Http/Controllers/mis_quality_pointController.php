<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_quality_point;

class mis_quality_pointController extends Controller
{
    public function list(){
        $obj = mis_quality_point::SELECT('mis_quality_point.*')
            ->where([['mis_quality_point.recordstatus','!=','DEL']]) -> get();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }
}
