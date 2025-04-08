<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\classroomType;

class classroomTypeController extends Controller
{
    public function list(Request $_request){
        $obj = classroomType::select('*') -> where('recordstatus','!=','DEL') -> get();

        if($obj){
            return response()->json([
                'success'=>true,
                'messages'=>'Proses Berjaya',
                'data'=>$obj,
            ],201);
        }
        else{
            return response()->json([
                'success'=>false,
                'messages'=>'Proses Gagal',
                'data'=>'',
            ],400);
        }
    }
}
