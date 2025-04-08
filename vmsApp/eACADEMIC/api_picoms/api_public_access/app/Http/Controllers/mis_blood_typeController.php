<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\mis_blood_type;

class mis_blood_typeController extends Controller
{
    public function list(Request $request){

            $register = mis_blood_type::select('*')
                    ->where('recordstatus','!=','DEL')
                    ->get();

        if($register){

            return response()->json([
                'success'=>true,
                'messages'=>'Proses Berjaya',
                'data'=>$register,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Proses Gagal',
                'data'=>'',
            ],400);
        }
    }
}
