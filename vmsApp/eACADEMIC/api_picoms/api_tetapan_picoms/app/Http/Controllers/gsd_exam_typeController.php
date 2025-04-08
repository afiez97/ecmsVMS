<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\gsd_exam_type;

class gsd_exam_typeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    

    public function list(){
        $obj = gsd_exam_type::where('recordstatus','!=','DEL') ->get(['id','gsd_exam_type']);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }
}
