<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\sts_accepted;

class sts_acceptedController extends Controller
{
    public function  __construct()
    {
        $this->middleware('auth');
    }
    
    public function list(Request $request){
        $register = sts_accepted::select('*')
            ->where([['recordstatus','!=','DEL'],['sts_accepted_code','!=','0']]) ->get();

        if($register){
            return response()->json([
                'success'=>true,
                'messages'=>'Success',
                'data'=>$register,
            ],201);
        }
        else{
            return response()->json([
                'success'=>false,
                'messages'=>'Failed',
                'data'=>'',
            ],400);
        }
    }
}
