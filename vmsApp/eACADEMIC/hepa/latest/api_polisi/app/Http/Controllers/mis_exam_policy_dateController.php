<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\ mis_exam_policy_date;

class mis_exam_policy_dateController extends Controller
{
    public function register(Request $request) {
        $cur_year = $request->input('cur_year');
        $reg_semester = $request->input('reg_semester');
        $cur_intake = $request->input('cur_intake');
        $pgm_id = $request->input('pgm_id');
        $pol_category = $request->input('pol_category');
        $pol_exm_type = $request->input('pol_exm_type');
        $pol_marks_open = $request->input('pol_marks_open');
        $pol_marks_close = $request->input('pol_marks_close');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $register = mis_exam_policy_date::create([
            'cur_year' => $cur_year,
            'reg_semester' => $reg_semester,
            'cur_intake' => $cur_intake,
            'pgm_id' => $pgm_id,
            'pol_category' => $pol_category,
            'pol_exm_type' => $pol_exm_type,
            'pol_marks_open' => $pol_marks_open,
            'pol_marks_close' => $pol_marks_close,
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

    public function show(Request $request)  {
        $Pk_exam_policy = $request->input('Pk_exam_policy');

        $mis_exam_policy_date = mis_exam_policy_date::where('Pk_exam_policy',$Pk_exam_policy)->first();

        if ($mis_exam_policy_date)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$mis_exam_policy_date
            ],200);
        }
    }

    public function list()  {
        $mis_exam_policy_date = mis_exam_policy_date::select('*')
            ->join('mis_prm_programme', 'mis_prm_programme.pgm_id', '=', 'mis_exam_policy_date.pgm_id') -> where([['mis_exam_policy_date.recordstatus','!=','DEL']])->get();

        if ($mis_exam_policy_date)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$mis_exam_policy_date
            ],200);
        }
        
    }

    public function update(Request $request){
        $cur_year = $request->input('cur_year');
        $reg_semester = $request->input('reg_semester');
        $cur_intake = $request->input('cur_intake');
        $pgm_id = $request->input('pgm_id');
        $pol_category = $request->input('pol_category');
        $pol_exm_type = $request->input('pol_exm_type');
        $pol_marks_open = $request->input('pol_marks_open');
        $pol_marks_close = $request->input('pol_marks_close');
        $recordstatus = $request->input('recordstatus');
        $Pk_exam_policy = $request->input('Pk_exam_policy');

        $mis_exam_policy_date = mis_exam_policy_date::where([['Pk_exam_policy',$Pk_exam_policy]]) -> update([
            'cur_year' => $cur_year,
            'reg_semester' => $reg_semester,
            'cur_intake' => $cur_intake,
            'pgm_id' => $pgm_id,
            'pol_category' => $pol_category,
            'pol_exm_type' => $pol_exm_type,
            'pol_marks_open' => $pol_marks_open,
            'pol_marks_close' => $pol_marks_close,
            'recordstatus' => $recordstatus,
        ]);

        if ($mis_exam_policy_date)  {
            return response()->json([
                'success'=>true,
                'message'=>"Update Success!",
                'data' => $mis_exam_policy_date
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
        $Pk_exam_policy = $request->input('Pk_exam_policy');
        $recordstatus = $request->input('recordstatus');

        $mis_exam_policy_date = mis_exam_policy_date::where([['Pk_exam_policy',$Pk_exam_policy]]) -> update([
            'recordstatus' => $recordstatus,
        ]);

        if ($mis_exam_policy_date)  {
            return response()->json([
                'success'=>true,
                'message'=>"Hapus Berjaya!",
                'data' => $mis_exam_policy_date
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
}
