<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\hrm_emp_position;

class hrm_emp_positionController_sso extends Controller
{
    // public function __construct()
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
            $obj = hrm_emp_position::create($data);
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

    public function show($id){
        $obj = hrm_emp_position::where('hrm_emp_position.Emp_id',$id)
            // ->leftjoin('hrm_prm_department', 'hrm_prm_department.dep_id', '=', 'hrm_emp_info.emp_department')
            // ->leftjoin('hrm_prm_division', 'hrm_prm_division.div_id', '=', 'hrm_emp_info.emp_division')
            ->get();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }
}
