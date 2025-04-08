<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\hep_warden;

class hep_wardenController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function register(Request $request){
        $fk_campus = $request->input('fk_campus');
        $emp_warden = $request->input('emp_warden');
        $warden_status = $request->input('warden_status');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_warden::create([
            'fk_campus' => $fk_campus,
            'emp_warden' => $emp_warden,
            'warden_status' => $warden_status,
            'recordstatus' => $recordstatus
        ]);

        if($obj){
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


    public function list(){
        $obj = hep_warden::where('hep_warden.recordstatus','!=','DEL')
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id','=','hep_warden.fk_campus')
            ->leftjoin('hrm_emp_info', 'hrm_emp_info.emp_id','=','hep_warden.emp_warden')
            ->orderby('warden_status')
            ->get([
                'hep_warden.pk_id AS warden_id',
                'fk_campus',
                'emp_warden',
                'clg_name',
                'emp_name',
                'warden_status'
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function update(Request $request){
        $pk_id = $request->input('pk_id');
        $fk_campus = $request->input('fk_campus');
        $emp_warden = $request->input('emp_warden');
        $warden_status = $request->input('warden_status');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_warden::where([['pk_id','=',$pk_id]]) -> update([
            'fk_campus' => $fk_campus,
            'emp_warden' => $emp_warden,
            'warden_status' => $warden_status,
            'recordstatus' => $recordstatus
        ]);

        if($obj){
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

        $obj = hep_warden::where('pk_id',$pk_id)-> update([
            'recordstatus' => $recordstatus,
        ]);

        if($obj){
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


    public function findStaf($id){
        $obj = hep_warden::where([['emp_warden',$id],['recordstatus','!=','DEL']]) ->get(['pk_id']);

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

    // list by warden==Active & campus
    public function wardenActCam($id){
        $obj = hep_warden::where([
                ['hep_warden.recordstatus','!=','DEL'],
                ['warden_status','Active'],
                ['fk_campus',$id]
            ])
            ->leftjoin('hrm_emp_info', 'hrm_emp_info.emp_id','=','hep_warden.emp_warden')
            ->orderby('warden_status')
            ->get([
                'pk_id',
                'emp_warden',
                'emp_name'
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // list by campus
    public function wardenByCam($id){
        $obj = hep_warden::where([['hep_warden.recordstatus','!=','DEL'],['fk_campus',$id]])
            ->leftjoin('hrm_emp_info', 'hrm_emp_info.emp_id','=','hep_warden.emp_warden')
            ->orderby('warden_status')
            ->get([
                'pk_id',
                'emp_warden',
                'emp_name'
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }
}
