<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Session;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\stdTawaran;
use App\Models\std_info;
use App\Models\std_register;

class authController extends Controller
{
    
    public function login(Request $request){
        
        $email = $request->input('std_nomatrik');
        $pwd = $request->input('std_katalaluan');

        $user = std_info::where('email',$email)->first();

        $salt = "RMY7nZ3+s8xpU1n0O*0o_EGfdoYtd|iU_AzhKCMoSu_xhh-e|~y8FOG*-xLZ";
        $std_katalaluan     = hash("sha256", $pwd.$salt);


        // dd($user);
        if($user->password === $std_katalaluan){

            // $student_id = $user->id;
            
            $token = Str::random(40);

            $uptToken = std_info::where([['email',$email],['password',$std_katalaluan]])->update([
                'api_token' => $token
            ]);

            return response()->json([
                'success'=>true,
                'token'=>$token,
                'messages'=>'Log Masuk Berjaya',
                'data'=>$user,
            ],201);

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
