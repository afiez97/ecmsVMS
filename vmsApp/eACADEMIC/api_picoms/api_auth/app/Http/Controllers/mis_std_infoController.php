<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\mis_std_info;

class mis_std_infoController extends Controller
{
    public function login(Request $request){

        $msgSuccess = 'Login Successful';
        $msgFailUname = 'Your username is not exist.';
        $msgFailPwd = 'Your have entered the wrong password';
        $msgFail = 'Login Failed';
        // $col_search = '';
        
        $std_studentid = $request->input('usr_id');
        $sti_password = $request->input('usr_passwd');
        // $usr_type = $request->input('usr_type');
        
        // if($usr_type == 1){
        //     $col_search = 'usr_cat_eadmin';
        // }else if($usr_type ==2){
        //     $col_search = 'usr_cat_estudent';
        // }
        // $user = sad_users::where([['usr_id',$usr_id],[$col_search,1]])->first();
        // $user = sad_users::where([['usr_id',$usr_id],['usr_cat_eadmin',1]])->first();
        $user = mis_std_info::where([['std_studentid',$std_studentid]])->first();

        if($user){

            $salt = "RMY7nZ3+s8xpU1n0O*0o_EGfdoYtd|iU_AzhKCMoSu_xhh-e|~y8FOG*-xLZ";
            $std_katalaluan     = hash("sha256", $sti_password.$salt);

            if($user->sti_password === $std_katalaluan){
                $token = Str::random(32);
    
                $users = mis_std_info::select('mis_std_info.*') ->where('std_studentid',$std_studentid) ->update([
                    'sti_token' => $token
                ]);
    
                if($users){
                    return response()->json([
                        'success'=>true,
                        'token'=>$token,
                        'messages'=>$msgSuccess,
                        'data'=>$users,
                        'data2'=>$user,
                        'std_studentid'=>$std_studentid,
                    ],201);
                }
                else {
                    return response()->json([
                        'success'=>false,
                        'token'=>$token,
                        'messages'=>$msgFail,
                        'data'=>'',
                        'data2'=>'',
                    ],201);
                }
            }
            else{
                return response()->json([
                    'success'=>false,
                    // 'token'=>$token,
                    'messages'=>$msgFailPwd,
                    'data'=>'',
                ],201);
            }

        }else{
            return response()->json([
                'success'=>false,
                // 'token'=>$token,
                'messages'=>$msgFailUname,
                'data'=>'',
            ],201);
        }

    }


    public function show($id)  {
        // $std_studentid = $request->input('clg_id');

        $mis_std_info = mis_std_info::where('std_studentid',$id)->first();

        if ($mis_std_info){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$mis_std_info
            ],200);
        }
    }
}
