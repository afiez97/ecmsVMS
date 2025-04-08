<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\adm_access;
use App\Models\sad_users;


class adm_accessController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function list(){
        $obj = adm_access::SELECT('adm_access.*')
            ->where([['adm_access.recordstatus','!=','DEL']]) -> get();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // list by access
    public function show($id){
        $obj = adm_access::where([['pk_id',$id]])
        ->first();
            // ->orderBy('pk_id');
            // ->first(['Id','Pos_Id','Dep_Id']);

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

    public function update(Request $request){

        $pk_id = $request->input('pk_id');
        $access = $request->input('access');
        
        $data = [
            'access' => $access,

            ];

        $obj = adm_access::where('pk_id',$pk_id)
        ->update($data);
        if ($obj)   {
            return response()->json([
                'success'=>true,
                'message'=>'Update Success!',
                'data'=>$obj
            ],200);
        } else{
            return response()->json([
                'success'=>false,
                'message'=>'Update Failed!',
                'data'=>''
            ],400);
        } 
    }

        // list by access
        public function roleList($id){
            $obj = adm_access::join('sad_users', 'sad_users.access_id', '=', 'adm_access.pk_id')
        
            ->leftjoin('hrm_emp_info', 'hrm_emp_info.emp_id', 'sad_users.usr_id')
                ->where('adm_access.pk_id', $id)
                ->where('sad_users.usr_id', 'not like', '%user%')
                // ->where('sad_users.recordstatus', '!=', 'DEL')
                ->select('sad_users.*', 'adm_access.access_name' , 'hrm_emp_info.emp_division' )
                ->get();

    
            if(sizeof($obj)>0){
                return response()->json([
                    'success'=>true,
                    'message'=>'List Success!',
                    'data'=>$obj
                ],200);
            }
            else{
                return response()->json([
                    'success'=>false,
                    'message'=>'List Failed!',
                    'data'=>''
                ],400);
            }
        }

        public function updateRole(Request $request){

            $usr_id = $request->input('usr_id');
            $access_id = $request->input('access_id');
            $recordstatus = 'EDT';
    
            $obj = sad_users::where('usr_id',$usr_id) ->update([
                'access_id' => $access_id,
                'recordstatus' => $recordstatus,
            ]);
    
            if ($obj){
                return response()->json([
                    'success'=>'true',
                    'message'=>'Update Success!',
                    'data'=>$obj
                ],201);
            }
            else{
                return response()->json([
                    'success'=>'false',
                    'message'=>'Bad Request',
                    'data'=>$obj
                ],400);
            }
        }

        public function delRole(Request $request){

            $usr_id = $request->input('usr_id');
            $access_id = null ;
            $recordstatus = 'EDT';
    
            $obj = sad_users::where('usr_id',$usr_id) ->update([
                'access_id' => $access_id,
                'recordstatus' => $recordstatus,
            ]);
    
            if ($obj){
                return response()->json([
                    'success'=>'true',
                    'message'=>'Update Success!',
                    'data'=>$obj
                ],201);
            }
            else{
                return response()->json([
                    'success'=>'false',
                    'message'=>'Bad Request',
                    'data'=>$obj
                ],400);
            }
        }


        // list by access
        public function showUserAccess($userId){

            $obj = sad_users::where('sad_users.usr_id', $userId)
                ->join('adm_access', 'adm_access.pk_id', '=', 'sad_users.access_id')
                ->select('adm_access.access')
                ->first();
            
    
            // if ($obj){
            if ($obj) {
                return response()->json([
                    'success'=>true,
                    'message'=>'List Success!',
                    'data'=>$obj
                ],201);
            }
            else{
                return response()->json([
                    'success'=>false,
                    'message'=>'Bad Request',
                    'data'=>''
                ],400);
            }
        }


         // list by access
         public function showUserAccessPK($userId){

            // $obj = sad_users::where('sad_users.usr_id', $userId)
            //     ->join('adm_access', 'adm_access.pk_id', '=', 'sad_users.access_id')
            //     ->leftjoin('hrm_emp_info.emp_id', 'hrm_emp_info.emp_id', '=', 'sad_users.usr_id')
            //     ->select('adm_access.pk_id', 'hrm_emp_info.emp_division')
            //     ->first();
            $obj = sad_users::where('sad_users.usr_id', $userId)
            ->join('adm_access', 'adm_access.pk_id', '=', 'sad_users.access_id')
            ->leftJoin('hrm_emp_info', 'hrm_emp_info.emp_id', '=', 'sad_users.usr_id')  // Corrected join clause
            ->select('adm_access.pk_id', 'hrm_emp_info.emp_division')
            ->first();

                
            // if ($obj){
            if ($obj) {
                return response()->json([
                    'success'=>true,
                    'message'=>'List Success!',
                    'data'=>$obj
                ],201);
            }
            else{
                return response()->json([
                    'success'=>false,
                    'message'=>'Bad Request',
                    'data'=>''
                ],400);
            }
        }
}
