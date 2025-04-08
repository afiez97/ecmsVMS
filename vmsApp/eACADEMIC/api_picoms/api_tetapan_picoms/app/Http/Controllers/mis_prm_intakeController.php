<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_prm_intake;

class mis_prm_intakeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function list(){
        $obj = mis_prm_intake::where('recordstatus','!=','DEL') 
            ->orderBy('intake_year', 'desc') 
            ->get([
                'pk_id',
                'intake_month',
                'intake_year'
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }
}
