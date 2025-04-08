<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_prm_faclecturer;

class mis_prm_faclecturerController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function register(Request $request){
        $cam_id = $request->input('cam_id');
        $fac_id = $request->input('fac_id');
        $emp_id = $request->input('emp_id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_faclecturer::create([
            'cam_id' => $cam_id,
            'fac_id' => $fac_id,
            'emp_id' => $emp_id,
            'recordstatus' => $recordstatus,
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


    public function show(Request $request)  {
        $fac_id = $request->input('fac_id');

        $mis_prm_faclecturer = mis_prm_faclecturer::where('fac_id',$fac_id)->first();

        if ($mis_prm_faclecturer)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$mis_prm_faclecturer
            ],200);
        }
    }


    public function list(){
        $mis_prm_faclecturer = mis_prm_faclecturer::join('mis_prm_faculty', 'mis_prm_faculty.fac_id', '=', 'mis_prm_faclecturer.fac_id')
            -> join('hrm_emp_info', 'hrm_emp_info.emp_id', '=', 'mis_prm_faclecturer.emp_id')
            ->where([['mis_prm_faclecturer.recordstatus','!=','DEL']]) -> get();

        if ($mis_prm_faclecturer)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$mis_prm_faclecturer
            ],200);
        }
    }


    public function update(Request $request){
        $id = $request->input('id');
        $fac_id = $request->input('fac_id');
        $emp_id = $request->input('emp_id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_faclecturer::where([['id','=',$id]]) ->update([
            'fac_id' => $fac_id,
            'emp_id' => $emp_id,
            'recordstatus' => $recordstatus,
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
        $id = $request->input('id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_faclecturer::where([['id','=',$id]])-> update([
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


    public function listByCampus($id){
        $obj = mis_prm_faclecturer::where([['mis_prm_faclecturer.cam_id', '=', $id],['mis_prm_faclecturer.recordstatus','!=','DEL']])
            ->leftjoin('mis_prm_faculty', 'mis_prm_faculty.pk_id', '=' , 'mis_prm_faclecturer.fac_id')
            ->leftjoin('hrm_emp_info', 'hrm_emp_info.emp_id', '=' , 'mis_prm_faclecturer.emp_id')
            ->get([
                'id',
                'mis_prm_faclecturer.cam_id AS camId',
                'mis_prm_faclecturer.fac_id AS fk_fac',
                'mis_prm_faclecturer.emp_id AS fk_emp',
                'fac_name',
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
