<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\sad_users;
use App\Models\hrm_emp_info;

class sad_userController extends Controller
{
    public function  __construct()
    {
        $this->middleware('auth');
    }

    public function show($id){
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

    public function listHepastaff(){
        $obj = sad_users::where('usr_cat_ehep','!=', 0)
        ->get([
            'usr_id',
            'usr_icno',
            'usr_name',
            'usr_cat_ehep',
            'usr_stafid',
            'usr_email',
        ]);
        
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

      public function listUnRole(){

        // $obj = sad_users::leftJoin('hrm_emp_info', 'sad_users.usr_id', '=', 'hrm_emp_info.emp_id')
        //     ->where('sad_users.recordstatus', '!=', 'DEL')
        //     ->whereNull('sad_users.access_id')
        //     ->whereNotNull('hrm_emp_info.emp_id')
        //     ->whereNotNull('sad_users.usr_id')
        //     // Uncomment the following lines if needed
        //     // ->where('hrm_emp_info.recordstatus', '!=', 'DEL')
        //     // ->where('sad_users.usr_cat_ehrms', 1)
        //     ->get([
        //         'usr_id',
        //         'usr_icno',
        //         'usr_name',
        //         'usr_cat_ehep',
        //         'usr_stafid',
        //         'usr_email',
        //     ]);

        $obj = sad_users::leftJoin('hrm_emp_info', 'sad_users.usr_id', '=', 'hrm_emp_info.emp_id')
            ->where('sad_users.recordstatus', '!=', 'DEL')
            ->whereNull('sad_users.access_id')
            ->whereNotNull('hrm_emp_info.emp_id')
            ->whereNotNull('sad_users.usr_id')
            // // Uncomment the following lines if needed
            // ->where(function($query) {
            //     $query->where('sad_users.usr_cat_ecmis', 1)
            //         ->orWhere('sad_users.usr_cat_eadmin', 1);
            // })
            // // ->where('sad_users.usr_cat_ehrms', 1)
            ->get([
                'sad_users.usr_id',
                'sad_users.usr_icno',
                'sad_users.usr_name',
                'sad_users.usr_cat_ehep',
                'sad_users.usr_stafid',
                'sad_users.usr_email',
                'sad_users.usr_cat_ecmis',
                'sad_users.usr_cat_eadmin'
            ]);


        
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
