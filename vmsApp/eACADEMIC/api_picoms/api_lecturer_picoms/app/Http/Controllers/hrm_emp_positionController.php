<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\hrm_emp_position;

class hrm_emp_positionController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }


    // list by employee
    public function list($id){
        $obj = hrm_emp_position::where([['Emp_Id',$id]])
            ->orderBy('Id', 'desc')
            ->first(['Id','Pos_Id','Dep_Id']);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>'false',
                'message'=>'List Failed!',
                'data'=>$obj
            ],400);
        }
    }
}
