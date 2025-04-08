<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_prm_course_cot;

class mis_prm_course_cotController extends Controller
{
    public function register(Request $request) {
        $cot_intake = $request->input('cot_intake');
        $pgm_id = $request->input('pgm_id');
        $cot_semester = $request->input('cot_semester');
        $cot_category = $request->input('cot_category');
        $cot_yearno = $request->input('cot_yearno');
        $cot_type_sem = $request->input('cot_type_sem');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $register = mis_prm_course_cot::create([
            'cot_intake' => $cot_intake,
            'pgm_id' => $pgm_id,
            'cot_semester' => $cot_semester,
            'cot_category' => $cot_category,
            'cot_yearno' => $cot_yearno,
            'cot_type_sem' => $cot_type_sem,
            'lastupdateon' => $lastupdateon,
            'lastupdateby' => $lastupdateby,
            'lastapproveon' => $lastapproveon,
            'lastapproveby' => $lastapproveby,
            'recordstatus' => $recordstatus,
        ]);

        if ($register)  {
            return response()->json([
                'success'=>'true',
                'message'=>'Register Success!',
                'data'=>$register
            ],201);
        }

        else    {
            return response()->json([
                'success'=>'false',
                'message'=>'Bad Request',
                'data'=>$register
            ],400);
        }
    }


    public function show($id){
        $obj = mis_prm_course_cot::select('mis_prm_course_cot.*','pgm_name') 
            -> join('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_prm_course_cot.pgm_id')
            -> where('mis_prm_course_cot.Pk_id',$id) ->first();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function list(){
        $mis_prm_course_cot = mis_prm_course_cot::select('mis_prm_course_cot.*','mis_prm_programme.pgm_name')
            -> join('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_prm_course_cot.pgm_id')
            // join('sem_type', 'sem_type.sem_type_code_short', '=', 'mis_prm_course_cot.cot_type_sem') 
            -> where([['mis_prm_course_cot.recordstatus','!=','DEL']])->get();

        if ($mis_prm_course_cot)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$mis_prm_course_cot
            ],200);
        }
        
    }


    public function update(Request $request){
        $Pk_id = $request->input('Pk_id');
        $cot_yearno = $request->input('cot_yearno');
        $cot_intake = $request->input('cot_intake');
        $cot_semester = $request->input('cot_semester');
        $cot_category = $request->input('cot_category');
        $cot_type_sem = $request->input('cot_type_sem');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_course_cot::where('Pk_id',$Pk_id) -> update([
            'cot_yearno' => $cot_yearno,
            'cot_intake' => $cot_intake,
            'cot_semester' => $cot_semester,
            'cot_category' => $cot_category,
            'cot_type_sem' => $cot_type_sem,
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
        $Pk_id = $request->input('Pk_id');
        $recordstatus = $request->input('recordstatus');

        // $mis_prm_course_cot = mis_prm_course_cot::find($cot_intake); 

        $mis_prm_course_cot = mis_prm_course_cot::where([['Pk_id','=',$Pk_id]])-> update([
         
            'recordstatus' => $recordstatus,
        ]);

        if ($mis_prm_course_cot)  {
            return response()->json([
                'success'=>true,
                'message'=>"Hapus Berjaya!",
                'data' => $mis_prm_course_cot
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Hapus Gagal!",
                'data'=>''
            ],404);
        }
    }


    public function listByCampus($id)  {
        $obj = mis_prm_course_cot::SELECT('mis_prm_course_cot.*','mis_prm_programme.pgm_name')
            -> join('mis_prm_programme', 'mis_prm_programme.pk_id', '=' , 'mis_prm_course_cot.pgm_id')
            -> join('mis_prm_faculty', 'mis_prm_faculty.pk_id', '=' , 'mis_prm_programme.fac_id')
            -> where('mis_prm_faculty.cam_id', '=', $id)
            -> where([['mis_prm_course_cot.recordstatus','!=','DEL']]) -> get();

        if ($obj)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }
}
