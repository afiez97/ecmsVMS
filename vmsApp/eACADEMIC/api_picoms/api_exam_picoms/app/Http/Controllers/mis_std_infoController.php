<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\mis_std_info;

class mis_std_infoController extends Controller
{
    

    public function list(Request $request){
        $register = mis_std_info::select('std_studentid','mis_std_info.pgm_id','pgm_name','sti_icno','sti_name','mis_std_info.recordstatus')
                    -> join('mis_prm_programme', 'mis_prm_programme.pgm_id', '=', 'mis_std_info.pgm_id')
                    -> where([['mis_std_info.recordstatus','!=','DEL']]) -> get();

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
