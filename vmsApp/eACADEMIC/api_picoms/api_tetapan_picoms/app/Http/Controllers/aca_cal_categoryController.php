<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\aca_cal_category;

class aca_cal_categoryController extends Controller
{
    public function list(){
        $obj = aca_cal_category::SELECT('*')
            ->where([['recordstatus','!=','DEL']]) -> get();

        if ($obj){
            return response()->json([
                'success'=>true,
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>'bad Request!',
                'data'=>''
            ],400);
        }
    }
}
