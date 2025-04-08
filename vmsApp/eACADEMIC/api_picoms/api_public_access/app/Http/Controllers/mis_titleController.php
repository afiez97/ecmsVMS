<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_title;

class mis_titleController extends Controller
{
    public function list(){
        $obj = mis_title::where([['recordstatus','!=','DEL']])->get();

        if ($obj)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }
}
