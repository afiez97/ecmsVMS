<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_prm_cot_sem;
use DB;

class mis_prm_cot_semController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function register(Request $request){
        $fk_pgm_det = $request->input('fk_pgm_det');
        $pgm_semester = $request->input('pgm_semester');
        $sem_type = $request->input('sem_type');
        $aca_session = $request->input('aca_session');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_cot_sem::create([
            'fk_pgm_det' => $fk_pgm_det,
            'pgm_semester' => $pgm_semester,
            'sem_type' => $sem_type,
            'aca_session' => $aca_session,
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


    // list by program detail
    public function listByPgmdet($id){
        $obj = mis_prm_cot_sem::where([['recordstatus','!=','DEL'],['fk_pgm_det','=',$id]]) 
            ->orderBy('pgm_semester')
            ->get([
                'pk_id',
                'pgm_semester',
                'sem_type',
                'aca_session'
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
        $pgm_semester = $request->input('pgm_semester');
        $sem_type = $request->input('sem_type');
        $aca_session = $request->input('aca_session');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_cot_sem::where('pk_id',$pk_id) ->update([
            'pgm_semester' => $pgm_semester,
            'sem_type' => $sem_type,
            'aca_session' => $aca_session,
            'recordstatus' => $recordstatus,
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


    // delete sem
    public function delete(Request $request){
        $pk_id = $request->input('pk_id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_cot_sem::where('pk_id',$pk_id) ->update([
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


    public function chkExist(Request $request){
        $fk_pgm_det = $request->input('fk_pgm_det');
        $pgm_semester = $request->input('pgm_semester');

        $obj = mis_prm_cot_sem::where([
                ['fk_pgm_det',$fk_pgm_det],
                ['pgm_semester',$pgm_semester],
                ['recordstatus','!=','DEL']
            ]) ->get('pk_id');

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }

    public function pgmDetSession(Request $request){
        $pgm_id = $request->input('pgm_fk');
        $intake_name = $request->input('intake_name');
        $intake_year = $request->input('intake_year');

        $obj = mis_prm_cot_sem::
        join('mis_prm_programme_det', 'mis_prm_programme_det.dtp_id', '=', 'mis_prm_cot_sem.fk_pgm_det')
        ->join('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_prm_cot_sem.aca_session')
        ->join('mis_prm_curyear', 'mis_prm_curyear.id', '=', 'mis_prm_programme_det.fk_sesIntake')
        ->join('intake', 'intake.id', '=', 'mis_prm_curyear.cur_intake')
        ->where('mis_prm_cot_sem.recordstatus', '!=', 'DEL')
        ->where('mis_prm_programme_det.pgm_id', $pgm_id)
        ->where('intake.intake_name' , $intake_name)
        ->where('intake.intake_year' , $intake_year)
        ->orderBy('cur_year')
        ->orderBy('cal_cohort')
        ->get([
            'mis_prm_calendar.cal_id',
            'mis_prm_cot_sem.pk_id',
            'mis_prm_programme_det.pgm_id',
            'mis_prm_cot_sem.fk_pgm_det',
            'mis_prm_cot_sem.pgm_semester',
            'mis_prm_programme_det.fk_aca_calendar', 
            'mis_prm_programme_det.fk_sesIntake',
            'mis_prm_calendar.cur_year', 
            'mis_prm_calendar.cal_cohort',
            'intake.intake_name',
            'intake.intake_year'         
        ]);

        if (sizeof($obj) > 0){
            return response()->json([
                'success'=>true,
                'message'=>"List Success!",
                'data' => $obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Data Not Found!",
                'data'=>''
            ],401);
        }
    }
}
