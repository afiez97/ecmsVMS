<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\hep_discipline;

class hep_disciplineController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function register(Request $request){
        $stud_icno = $request->input('stud_icno');
        $clg_id = $request->input('clg_id');
        $dis_date = $request->input('dis_date');
        $dis_time = $request->input('dis_time');
        $dis_venue = $request->input('dis_venue');
        $dis_action = $request->input('dis_action');
        $dis_pay_status = $request->input('dis_pay_status');
        $dis_refNo = $request->input('dis_refNo');
        $dis_type = $request->input('dis_type');
        $dis_issue = $request->input('dis_issue');
        $dis_remark = $request->input('dis_remark');
        $dis_amount = $request->input('dis_amount');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_discipline::create([
            'stud_icno' => $stud_icno,
            'clg_id' => $clg_id,
            'dis_date' => $dis_date,
            'dis_time' => $dis_time,
            'dis_venue' => $dis_venue,
            'dis_action' => $dis_action,
            'dis_pay_status' => $dis_pay_status,
            'dis_refNo' => $dis_refNo,
            'dis_type' => $dis_type,
            'dis_issue' => $dis_issue,
            'dis_remark' => $dis_remark,
            'dis_amount' => $dis_amount,
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


    public function show(Request $request)  {
        $fac_id = $request->input('id_aduan');

        $hep_discipline = hep_discipline::where('id_aduan',$fac_id)->first();

        if ($hep_discipline)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$hep_discipline
            ],200);
        }
    }


    public function list(Request $request){

        $dateProgramme = $request->input('dateProgramme');

        if ($dateProgramme)
        {
            $dateParts = explode('-', $dateProgramme);
            $year = $dateParts[0];
            $month = $dateParts[1];
        }
        else{
            $year = null;
            $month = null; 
        }

        $obj = hep_discipline::select('dis_id',
                'sti_name',
                'hep_discipline.clg_id AS cam_id',
                'clg_name',
                'stud_icno',
                'sti_icno',
                'dis_refNo',
                'dis_date',
                'dis_time',
                'dis_type',
                'id_salahlaku',
                'description',
                'dis_venue',
                'dis_issue',
                'dis_remark',
                'dis_action',
                'dis_pay_status',
                'dis_amount')
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id','=','hep_discipline.clg_id')
            ->leftjoin('hep_dis_salahlaku', 'hep_dis_salahlaku.pk_id','=','hep_discipline.dis_type')
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid','=','hep_discipline.stud_icno')
            ->where('hep_discipline.recordstatus', '!=', 'DEL');
            if($month){
                // DD($month);
                $obj = $obj->whereMonth('hep_discipline.dis_date', '=', $month);
            }
            if ($year) {
                $obj->whereYear('hep_discipline.dis_date', '=', $year);
            }

            $obj = $obj->get();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function update(Request $request){
        $dis_id = $request->input('dis_id');
        $clg_id = $request->input('clg_id');
        $stud_icno = $request->input('stud_icno');
        $dis_date = $request->input('dis_date');
        $dis_time = $request->input('dis_time');
        $dis_venue = $request->input('dis_venue');
        $dis_action = $request->input('dis_action');
        $dis_pay_status = $request->input('dis_pay_status');
        $dis_type = $request->input('dis_type');
        $dis_issue = $request->input('dis_issue');
        $dis_remark = $request->input('dis_remark');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_discipline::where([['dis_id','=',$dis_id]]) -> update([
            'clg_id' => $clg_id,
            'stud_icno' => $stud_icno,
            'dis_date' => $dis_date,
            'dis_time' => $dis_time,
            'dis_venue' => $dis_venue,
            'dis_action' => $dis_action,
            'dis_pay_status' => $dis_pay_status,
            'dis_type' => $dis_type,
            'dis_issue' => $dis_issue,
            'dis_remark' => $dis_remark,
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
        $dis_id = $request->input('dis_id');

        $obj = hep_discipline::where('dis_id',$dis_id)-> update([
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


    public function listByStud($id){
        $obj = hep_discipline::where([['hep_discipline.recordstatus','!=','DEL'],['hep_discipline.stud_icno','=',$id]])
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id','=','hep_discipline.clg_id')
            ->leftjoin('hep_dis_salahlaku', 'hep_dis_salahlaku.pk_id','=','hep_discipline.dis_type')
            -> get([
                'dis_id',
                'clg_name',
                'dis_refNo',
                'dis_date',
                'dis_time',
                'dis_type',
                'id_salahlaku',
                'description',
                'dis_venue',
                'dis_issue',
                'dis_remark',
                'dis_action',
                'dis_pay_status',
                'dis_amount'
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }
    

    // total Discipline payables by student
    public function countAlert($id){
        $obj = hep_discipline::where([
                ['hep_discipline.recordstatus','!=','DEL'],
                ['hep_discipline.stud_icno','=',$id],
                ['hep_discipline.dis_pay_status','=','New'],
            ]) ->get();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }

    // total Discipline payables by admin
    public function countAlrtAdmin(){
        $obj = hep_discipline::where([
                ['hep_discipline.recordstatus','!=','DEL'],
                ['hep_discipline.dis_pay_status','=','New'],
            ]) ->get();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // update paid by financial unit
    public function uptPaid(Request $request){
        $dis_id = $request->input('dis_id');
        $dis_pay_status = $request->input('dis_pay_status');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_discipline::where([['dis_id','=',$dis_id]]) -> update([
            'dis_pay_status' => $dis_pay_status,
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
}
