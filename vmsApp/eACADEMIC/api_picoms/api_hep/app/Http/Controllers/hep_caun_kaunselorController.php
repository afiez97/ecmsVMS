<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\hep_caun_kaunselor;

class hep_caun_kaunselorController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function register(Request $request){
        $clg_id = $request->input('clg_id');
        $id_kaunselor = $request->input('id_kaunselor');
        $staff_name = $request->input('staff_name');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_caun_kaunselor::create([
            'clg_id' => $clg_id,
            'id_kaunselor' => $id_kaunselor,
            'staff_name' => $staff_name,
            'recordstatus' => $recordstatus
        ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Register Success!',
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


    public function show($id){
        $obj = hep_caun_kaunselor::where([['staff_name',$id],['recordstatus','!=','DEL']]) 
            ->first([
                'pk_id',
                'id_kaunselor'
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function list(){
        $obj = hep_caun_kaunselor::where([['hep_caun_kaunselor.recordstatus','!=','DEL']])
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id','=','hep_caun_kaunselor.clg_id')
            ->leftjoin('hrm_emp_info', 'hrm_emp_info.emp_id','=','hep_caun_kaunselor.staff_name')
            ->get([
                'hep_caun_kaunselor.pk_id AS kaunselorId',
                'hep_caun_kaunselor.clg_id AS camId',
                'clg_name',
                'id_kaunselor',
                'staff_name',
                'emp_name'
            ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function update(Request $request){
        $pk_id = $request->input('pk_id');
        $clg_id = $request->input('clg_id');
        $id_kaunselor = $request->input('id_kaunselor');
        $staff_name = $request->input('staff_name');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_caun_kaunselor::where([['pk_id','=',$pk_id]]) -> update([
            'clg_id' => $clg_id,
            'id_kaunselor' => $id_kaunselor,
            'staff_name' => $staff_name,
            'recordstatus' => $recordstatus
        ]);

        if ($obj){
            return response()->json([
                'success'=>true,
                'message'=>"Update Success!",
                'data' => $obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Update Failed!",
                'data'=>''
            ],404);
        }
    }


    public function delete(Request $request){
        $recordstatus = $request->input('recordstatus');
        $pk_id = $request->input('pk_id');

        $obj = hep_caun_kaunselor::where('pk_id',$pk_id)-> update([
            'recordstatus' => $recordstatus,
        ]);

        if ($obj){
            return response()->json([
                'success'=>true,
                'message'=>"Hapus Berjaya!",
                'data' => $obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Hapus Gagal!",
                'data'=>''
            ],401);
        }
    }


    // find kaunselor by staff id
    public function findKaun($id){
        $obj = hep_caun_kaunselor::where([['staff_name',$id],['recordstatus','!=','DEL']]) ->get();

        if($obj->isEmpty()) {
            // No data found
            return response()->json([
              'success' => false,
              'message' => 'No data found',
              'data' => ''
            ]);
        
          } else {  
            // Data found
            return response()->json([
              'success'=>true,
              'message'=>"Data found!",
              'data' => $obj
            ], 200);
        
          }
        
        }

    // list by Campus based on Application
    public function listByCam($id){
        $obj = hep_caun_kaunselor::where([['clg_id',$id],['hep_caun_kaunselor.recordstatus','!=','DEL']])
            ->leftjoin('hrm_emp_info', 'hrm_emp_info.emp_id','=','hep_caun_kaunselor.staff_name')
            ->get([
                'pk_id',
                'clg_id',
                'id_kaunselor',
                'staff_name',
                'emp_name'
            ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }
}
