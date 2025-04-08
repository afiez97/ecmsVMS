<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\sad_users;

class sad_userController_sso extends Controller
{
    // public function  __construct()
    // {
    //     $this->middleware('public');
    // }

    public function create(Request $request){
        if ($request->isJson()) {
            $data = $request->json()->all();
            $check = true;
        } else {
            $check = false;
        }
        
        if($check){
            $obj = sad_users::create($data);
        // dd($data);

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
        else{
            return $data;
        }
        

    }

    public function loginSSO(Request $request){
        $id = $request->input('id');
        $obj = sad_users::where('usr_id',$id)->first();
        if($obj){
            $token = Str::random(32);
    
            $users = sad_users::where('usr_id',$id)->update([
                'user_token' => $token
            ]);

            if($users){

                return response()->json([
                    'success'=>true,
                    'token'=>$token,
                    'messages'=>'Login Success',
                    'data'=>$users,
                    'data2'=>$obj,
                ],200);
            }
            else {
                return response()->json([
                    'success'=>false,
                    'token'=>$token,
                    'messages'=>'Login Failed!',
                    'data'=>'',
                    'data2'=>'',
                ],400);
            }            
        }
        else{
            return response()->json([
                'success'=>false,
                'messages'=>'No Data Found!',
                'data'=>'',
            ],400);
        }
    }

    public function view($id){
        $obj = sad_users::where('usr_id',$id)->first();
        
        if($obj){
            return response()->json([
                'success'=>true,
                'messages'=>'Data Found!',
                'data'=>$obj,
            ],200); 
        }
        else{
            return response()->json([
                'success'=>false,
                'messages'=>'No Data Found!',
                'data'=>'',
            ],400);
        }
    }


}
