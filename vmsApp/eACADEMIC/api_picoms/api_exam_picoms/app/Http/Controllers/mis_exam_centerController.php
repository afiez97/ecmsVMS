<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_exam_center;

class mis_exam_centerController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    // add exam center
    public function register(Request $request){
        $clg_id = $request->input('clg_id');
        $cen_id = $request->input('cen_id');
        $cen_name = $request->input('cen_name');
        $cen_type = $request->input('cen_type');
        $cen_max_capacity = $request->input('cen_max_capacity');
        $cen_status = $request->input('cen_status');
        $recordstatus = $request->input('recordstatus');

        $register = mis_exam_center::create([
            'clg_id' => $clg_id,
            'cen_id' => $cen_id,
            'cen_name' => $cen_name,
            'cen_type' => $cen_type,
            'cen_max_capacity' => $cen_max_capacity,
            'cen_status' => $cen_status,
            'recordstatus' => $recordstatus,
        ]);

        if($register){
            return response()->json([
                'success'=>'true',
                'message'=>'Register Success!',
                'data'=>$register
            ],201);
        }

        else{
            return response()->json([
                'success'=>'false',
                'message'=>'Bad Request',
                'data'=>$register
            ],400);
        }
    }


    // display exam center list
    public function list(){
        $mis_exam_center = mis_exam_center::SELECT('mis_exam_center.pk_id','cen_id','cen_name','loc_name','cen_max_capacity','mis_exam_center.fac_id','fac_name','mis_exam_center.pgm_id','pgm_name','cen_status','cen_type') 
            -> join('mis_prm_faculty', 'mis_prm_faculty.fac_id', '=', 'mis_exam_center.fac_id')
            -> join('mis_prm_programme', 'mis_prm_programme.pgm_id', '=', 'mis_exam_center.pgm_id')
            -> join('mis_prm_locations', 'mis_prm_locations.loc_id', '=', 'mis_exam_center.cen_name')
            -> where([['mis_exam_center.recordstatus','!=','DEL']]) -> get();

        if($mis_exam_center){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$mis_exam_center
            ],200);
        }
        else{
            return response()->json([
                'success'=>'false',
                'message'=>'Bad Request',
                'data'=>$mis_exam_center
            ],400);
        }
    }


    public function update(Request $request){
        $pk_id = $request->input('pk_id');
        $cen_id = $request->input('cen_id');
        $cen_name = $request->input('cen_name');
        $cen_type = $request->input('cen_type');
        $cen_max_capacity = $request->input('cen_max_capacity');
        $cen_status = $request->input('cen_status');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_exam_center::where('pk_id',$pk_id) -> update([
            'cen_id' => $cen_id,
            'cen_name' => $cen_name,
            'cen_type' => $cen_type,
            'cen_max_capacity' => $cen_max_capacity,
            'cen_status' => $cen_status,
            'recordstatus' => $recordstatus,
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


    public function delete(Request $request){
        $id = $request->input('pk_id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_exam_center::where([['pk_id','=',$id]])-> update([
            'recordstatus' => $recordstatus,
        ]);

        if ($obj)  {
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


    // list by campus
    public function listByCampus($id){
        $mis_exam_center = mis_exam_center::SELECT('mis_exam_center.*','loc_name','fac_name','pgm_name','mis_prm_college.clg_name') 
            -> leftjoin('mis_prm_faculty', 'mis_prm_faculty.pk_id', '=', 'mis_exam_center.fac_id')
            -> leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_exam_center.pgm_id')
            -> leftjoin('mis_prm_locations', 'mis_prm_locations.loc_id', '=', 'mis_exam_center.cen_name')
            -> leftjoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'mis_exam_center.clg_id')
            -> where([['mis_exam_center.clg_id','=',$id],['mis_exam_center.recordstatus','!=','DEL']]) -> get();

        if($mis_exam_center){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$mis_exam_center
            ],200);
        }
        else{
            return response()->json([
                'success'=>'false',
                'message'=>'Bad Request',
                'data'=>$mis_exam_center
            ],400);
        }
    }


    // list by campus and Open
    public function listByCamAct($id){
        $obj = mis_exam_center::where([
                ['mis_exam_center.clg_id','=',$id],
                ['mis_exam_center.recordstatus','!=','DEL'],
                ['mis_exam_center.cen_status','=','Active']
            ]) 
            ->leftjoin('mis_prm_locations', 'mis_prm_locations.loc_id', '=', 'mis_exam_center.cen_name')
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'mis_exam_center.clg_id')
            ->get([
                'mis_exam_center.pk_id AS center_id',
                'cen_id',
                'cen_name',
                'loc_name',
                'cen_type',
                'cen_max_capacity'
            ]);

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
                'message'=>'Bad Request',
                'data'=>$obj
            ],400);
        }
    }
}
