<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\ sad_groupuser;

class sad_groupuserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function list(){
        $obj = sad_groupuser::get([
            'user_grp',
            'user_des'
        ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }
}
