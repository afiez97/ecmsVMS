<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_exam_venue;

class mis_exam_venueController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    // add exam center
    public function register(Request $request){
        $fk_exam = $request->input('fk_exam');
        $fk_campus = $request->input('fk_campus');
        $fk_course = $request->input('fk_course');
        $fk_center = $request->input('fk_venue');
        $start_no = $request->input('start_no');
        $recordstatus = $request->input('recordstatus');

        $register = mis_exam_venue::create([
            'fk_exam' => $fk_exam,
            'fk_campus' => $fk_campus,
            'fk_course' => $fk_course,
            'fk_center' => $fk_center,
            'start_no' => $start_no,
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
    public function listByExam($id){
        $obj = mis_exam_venue::where([['fk_exam','=',$id],['mis_exam_venue.recordstatus','!=','DEL']])
            ->leftjoin('mis_exam_center', 'mis_exam_center.pk_id', '=', 'mis_exam_venue.fk_center')
            ->leftjoin('mis_prm_locations', 'mis_prm_locations.loc_id', '=', 'mis_exam_center.cen_name')
            ->get([
                'mis_exam_venue.pk_id AS exmVanue_id',
                'fk_exam',
                'fk_campus',
                'fk_course',
                'fk_center',
                'cen_max_capacity',
                'cen_id',
                'loc_name'
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


    public function update(Request $request){
        $pk_id = $request->input('pk_id');
        $fk_campus = $request->input('fk_campus');
        $fk_center = $request->input('fk_venue');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_exam_venue::where('pk_id',$pk_id) ->update([
            'fk_campus' => $fk_campus,
            'fk_center' => $fk_center,
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

        $obj = mis_exam_venue::where([['pk_id','=',$id]])-> update([
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
}
