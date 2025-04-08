<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_relationship;

class mis_relationshipController extends Controller
{
    public function list()  {
        $obj = mis_relationship::where([['recordstatus','!=','DEL']])->get();

        if ($obj)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
        
    }
}
