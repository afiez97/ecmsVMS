<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_std_withdraw;

class mis_std_withdrawController extends Controller
{
    public function  __construct()
    {
        $this->middleware('auth');
    }
    
    public function register(Request $request){
        $stu_id = $request->input('stu_id');
        $stu_name = $request->input('stu_name');
        $pgm_id = $request->input('pgm_id');
        $cur_semester = $request->input('cur_semester');
        $quit_code = $request->input('quit_code');
        $withdraw_status = $request->input('withdraw_status');
        $fac_status = $request->input('fac_status');

        if($file = $request->hasFile('quit_attachment')) {
            $quit_attachment = '';

            // $std_transkrip_path = $request->file('std_transkrip')->getClientOriginalExtension(); 
            // $std_transkrip = base64_encode(file_get_contents($request->file('std_transkrip')->getRealPath()));
        }
        else{ $quit_attachment = ''; }

        $obj = mis_std_withdraw::create([
            'stu_id' => $stu_id,
            'stu_name' => $stu_name,
            'pgm_id' => $pgm_id,
            'cur_semester' => $cur_semester,
            'quit_code' => $quit_code,
            'quit_attachment' => $quit_attachment,
            'withdraw_status' => $withdraw_status,
            'fac_status' => $fac_status,
            'recordstatus' => 'ADD'
        ]);

        if($obj){
            return response()->json([
                'success'=>true,
                'messages'=>'Success',
                'data'=>$obj,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Failed',
                'data'=>'',
            ],201);
        }
    }


    public function list(){
        $obj = mis_std_withdraw::select('mis_std_withdraw.*','mis_prm_programme.pgm_id') 
        ->leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id','=','mis_std_withdraw.pgm_id')
        ->where('mis_std_withdraw.recordstatus', '!=', 'DEL')
        ->orderBy('mis_std_withdraw.pk_id', 'DESC')
        ->get();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function show($id){
        $obj = mis_std_withdraw::where([['stu_id','=',$id]]) ->get();

        if($obj){
            if(sizeof($obj) > 0){
                return response()->json([
                    'success'=>true,
                    'messages'=>'Success',
                    'data'=>$obj,
                ],201);
            }
            else{
                return response()->json([
                    'success'=>false,
                    'messages'=>'No Data',
                    'data'=>$obj,
                ],201);                
            }
        }
        else{
            return response()->json([
                'success'=>false,
                'messages'=>'Failed',
                'data'=>'',
            ],201);
        }
    }


    public function showById($id){
        $obj = mis_std_withdraw::select('mis_std_withdraw.*','pgm_name') 
            ->leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id','=','mis_std_withdraw.pgm_id')
            ->where([['mis_std_withdraw.pk_id','=',$id]]) ->first();

        if($obj){
            return response()->json([
                'success'=>true,
                'messages'=>'Success',
                'data'=>$obj,
            ],201);
        }
        else{
            return response()->json([
                'success'=>false,
                'messages'=>'Failed',
                'data'=>'',
            ],201);
        }
    }


    public function uptFacAdmin(Request $request){
        $pk_id = $request->input('pk_id');
        $withdraw_status = $request->input('withdraw_status');
        $quit_validation_status = $request->input('quit_validation_status');
        $quit_validation_note = $request->input('quit_validation_note');

        $obj = mis_std_withdraw::where('pk_id',$pk_id) ->update([
            'withdraw_status' => $withdraw_status,
            'quit_validation_status' => $quit_validation_status,
            'quit_validation_note' => $quit_validation_note,
            'recordstatus' => 'EDT'
        ]);

        if($obj){
            return response()->json([
                'success'=>true,
                'messages'=>'Success',
                'data'=>$obj,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Failed',
                'data'=>'',
            ],201);
        }
    }


    public function uptClearance(Request $request){
        $pk_id = $request->input('pk_id');
        $quit_clearance_hepa = $request->input('quit_clearance_hepa');
        $quit_clearance_library = $request->input('quit_clearance_library');
        $quit_clearance_financing = $request->input('quit_clearance_financing');
        $quit_clearance_finance = $request->input('quit_clearance_finance');

        $obj = mis_std_withdraw::where('pk_id',$pk_id) ->update([
            'quit_clearance_hepa' => $quit_clearance_hepa,
            'quit_clearance_library' => $quit_clearance_library,
            'quit_clearance_financing' => $quit_clearance_financing,
            'quit_clearance_finance' => $quit_clearance_finance
        ]);

        if($obj){
            return response()->json([
                'success'=>true,
                'messages'=>'Success',
                'data'=>$obj,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Failed',
                'data'=>'',
            ],201);
        }
    }


    public function uptARAdmin(Request $request){
        $pk_id = $request->input('pk_id');
        $withdraw_status = $request->input('withdraw_status');
        $quit_approval_status = $request->input('quit_approval_status');
        $quit_approval_note = $request->input('quit_approval_note');

        $obj = mis_std_withdraw::where('pk_id',$pk_id) ->update([
            'withdraw_status' => $withdraw_status,
            'quit_approval_status' => $quit_approval_status,
            'quit_approval_note' => $quit_approval_note,
            'recordstatus' => 'EDT'
        ]);

        if($obj){
            return response()->json([
                'success'=>true,
                'messages'=>'Success',
                'data'=>$obj,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Failed',
                'data'=>'',
            ],201);
        }
    }
}
