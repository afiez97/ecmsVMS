<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_exam_papertype;

class mis_exam_papertypeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }


    public function list(){
        $obj = mis_exam_papertype::where([['recordstatus','!=','DEL']]) ->get(['pk_id','paper_type']);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }
}
