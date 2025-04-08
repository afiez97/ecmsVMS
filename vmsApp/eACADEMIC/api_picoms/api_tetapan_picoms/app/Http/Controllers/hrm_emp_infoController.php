<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\hrm_emp_info;

class hrm_emp_infoController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function show($id){
        $obj = hrm_emp_info::where('hrm_emp_info.emp_id',$id)
            ->leftjoin('hrm_prm_department', 'hrm_prm_department.dep_id', '=', 'hrm_emp_info.emp_department')
            ->leftjoin('hrm_prm_division', 'hrm_prm_division.div_id', '=', 'hrm_emp_info.emp_division')
            ->first([
                'hrm_emp_info.emp_id AS empId',
                'emp_name',
                'emp_mobileno',
                'emp_email',
                'emp_status',
                'emp_substatus',
                'emp_icno',
                'emp_gender',
                'emp_race',
                'emp_religion',
                'emp_issuedate',
                'emp_issueexp',
                // 'emp_photo',
                'emp_department',
                'dep_description',
                'emp_division',
                'div_description'
            ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }


    // public function list(){
    //     $obj = hrm_emp_info::where([['emp_ind','=','AK'],['emp_substatus','!=','Resign']])
    //     ->orWhereNull('emp_substatus')
    //     ->leftjoin('hrm_prm_department', 'hrm_prm_department.dep_id', '=', 'hrm_emp_info.emp_department')
    //     ->leftjoin('hrm_division', 'hrm_division.short_en', '=', 'hrm_emp_info.emp_division')

    //         ->get([
    //             'emp_id',
    //             'emp_name',
    //             'emp_department',
    //             'dep_description',
    //             'emp_division',

    //             'hrm_division.en_desc AS facOri',
    //             'hrm_division.short_en AS facOri_short'

    //         ]);

    //     if ($obj){
    //         return response()->json([
    //             'success'=>'true',
    //             'message'=>'List Success!',
    //             'data'=>$obj
    //         ],200);
    //     }
    // }

    public function list() {
        $obj = hrm_emp_info::where(function($query) {
                $query->where('emp_ind', 'AK')
                      ->where('emp_substatus', '!=', 'Resign')
                    //   ->orWhereNull('emp_substatus')
                      ;
            })
            ->orWhere(function($query) {
                $query->where('emp_ind', 'PT')
                      ->where('access_id', 4)
                    //   ->orWhereNotNull('access_id')
                    ;

            })
            ->where('sad_users.recordstatus', '!=', 'DEL')
            ->leftJoin('hrm_prm_department', 'hrm_prm_department.dep_id', '=', 'hrm_emp_info.emp_department')
            ->leftJoin('hrm_division', 'hrm_division.short_en', '=', 'hrm_emp_info.emp_division')
            ->leftJoin('sad_users', 'hrm_emp_info.emp_id', '=', 'sad_users.usr_id')
            ->get([
                'hrm_emp_info.emp_id',
                'hrm_emp_info.emp_name',
                'hrm_emp_info.emp_department',
                'hrm_prm_department.dep_description',
                'hrm_emp_info.emp_division',
                'hrm_division.en_desc AS facOri',
                'hrm_division.short_en AS facOri_short'
            ]);
    
        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }
    

    
    // lecturer list table
    public function lectList(){
        $lecturerList = hrm_emp_info::SELECT('hrm_emp_info.emp_id', 'emp_name', 'mis_prm_faculty.fac_name','mis_prm_faclecturer.recordstatus','ID')
            -> leftjoin('mis_prm_faclecturer', 'mis_prm_faclecturer.emp_id', '=', 'hrm_emp_info.emp_id')
            -> leftjoin('mis_prm_faculty', 'mis_prm_faculty.fac_id', '=', 'mis_prm_faclecturer.fac_id')
            -> where([['mis_prm_faclecturer.recordstatus','!=','DEL']]) -> get();

        if($lecturerList){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$lecturerList
            ],200);
        }
    }


    // listing counselor
    public function counList(){
        // $obj = hrm_emp_info::where([['emp_division','!=','PP'],['emp_substatus','!=','Resign']])
        //     ->leftjoin('hrm_prm_department', 'hrm_prm_department.dep_id', '=', 'hrm_emp_info.emp_department')
        //     ->get([
        //         'emp_id',
        //         'emp_name',
        //         'emp_department',
        //         'dep_description'
        //     ]);

        $obj = hrm_emp_info::select('emp_id', 'emp_name', 'emp_department', 'dep_description', 'emp_division')
                ->leftJoin('hrm_prm_department', 'hrm_prm_department.dep_id', '=', 'hrm_emp_info.emp_department')
                ->where('hrm_emp_info.emp_division', '=', 'AK')
                ->where('hrm_emp_info.emp_substatus', '<>', 'Resign')
                ->orderBy('hrm_emp_info.emp_name', 'asc')
                ->get();
        $count = $obj->count();
        // $obj = hrm_emp_info::leftJoin('hrm_prm_department', 'hrm_prm_department.dep_id', '=', 'hrm_emp_info.emp_department')
        //     ->where('hrm_emp_info.emp_division', '=', 'AK')
        //     ->where('hrm_emp_info.emp_substatus', '<>', 'Resign')
        //     ->select('emp_id', 'emp_name', 'emp_department', 'dep_description', 'emp_division')
        //     ->get();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj,
                'count'=>$count
            ],200);
        }
    }

    public function allCounList(){

        $obj = hrm_emp_info::select('emp_id', 'emp_name', 'emp_department', 'dep_description', 'emp_division')
                ->leftJoin('hrm_prm_department', 'hrm_prm_department.dep_id', '=', 'hrm_emp_info.emp_department')
                ->where('hrm_emp_info.emp_substatus', '<>', 'Resign')
                ->orderBy('hrm_emp_info.emp_name', 'asc')
                ->get();
        $count = $obj->count();
 
        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj,
                'count'=>$count
            ],200);
        }
    }
}
