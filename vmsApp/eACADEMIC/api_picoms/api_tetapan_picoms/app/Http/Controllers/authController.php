<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;
// use App\Models\stdTawaran;
// use App\Models\mis_prm_programme;
// use App\Models\mis_prm_curyear;
use App\Models\sad_users;

class authController extends Controller
{
    
    public function login(Request $request){
        $usr_id = $request->input('usr_id');
        $usr_passwd = $request->input('usr_passwd');

        $user = sad_users::where('usr_id',$usr_id)->first();

        $salt = "RMY7nZ3+s8xpU1n0O*0o_EGfdoYtd|iU_AzhKCMoSu_xhh-e|~y8FOG*-xLZ";
        $std_katalaluan     = hash("sha256", $usr_passwd.$salt);

        // dd($std_katalaluan.'//');
        if($user->usr_passwd === $std_katalaluan){
            $token = Str::random(32);

            $user = sad_users::where('usr_id',$usr_id)->update([
                'user_token' => $token
            ]);

            if($user){

                return response()->json([
                    'success'=>true,
                    'token'=>$token,
                    'messages'=>'Log Masuk Berjaya',
                    'data'=>$user,
                ],201);
            }
            else {
                return response()->json([
                    'success'=>false,
                    'token'=>$token,
                    'messages'=>'Log Masuk Gagal',
                    'data'=>'',
                ],400);
            }
        }
        else{
            return response()->json([
                'success'=>false,
                // 'token'=>$token,
                'messages'=>'Log Masuk Gagal',
                'data'=>'',
            ],400);
        }
    }
}
