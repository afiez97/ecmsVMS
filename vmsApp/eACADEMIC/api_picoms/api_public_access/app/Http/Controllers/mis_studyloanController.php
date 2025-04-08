<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_studyloan;

class mis_studyloanController extends Controller
{
    public function list(){
        $obj = mis_studyloan::where([['recordstatus','!=','DEL']])->get();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }
}
