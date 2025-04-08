<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\mis_std_chg_program;

class mis_std_chg_programController extends Controller
{

    public function show(Request $request){

        $std_studentid = $request->input('std_studentid');
        
        $output = mis_std_chg_program::select('mis_std_chg_program.*','mis_std_info.sti_name','mis_std_info.pgm_id')
        ->leftjoin('mis_std_info','mis_std_info.std_studentid','=','mis_std_chg_program.std_studentid')
            ->where([
                ['mis_std_chg_program.recordstatus','!=','DEL'],
                ['mis_std_chg_program.std_studentid','=',$std_studentid],
            ])
            ->first();
// dd($output);
            
        if($output){

            return response()->json([
                'success'=>true,
                'messages'=>'Successfully View',
                'data'=>$output,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'View Failed',
                'data'=>'',
            ],201);
        }

    }

    public function list(){

        $output = mis_std_chg_program::select('*')
            ->leftjoin('mis_std_info','mis_std_info.std_studentid','=','mis_std_chg_program.std_studentid')
            ->where([
                ['mis_std_chg_program.recordstatus','!=','DEL']
            ])
            ->get();

            
        if($output){

            return response()->json([
                'success'=>true,
                'messages'=>'Successfully View',
                'data'=>$output,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'View Failed',
                'data'=>'',
            ],201);
        }

    }

    public function create(Request $request){

        $std_studentid = $request->input('std_studentid');
        $curr_pgm_id = $request->input('curr_pgm_id');
        $new_pgm_id = $request->input('new_pgm_id');
        $recordstatus = $request->input('recordstatus');
        
        $data = [
            'std_studentid' => $std_studentid,
            'cgp_old_pgm' => $curr_pgm_id,
            'cgp_new_pgm' => $new_pgm_id,
            'recordstatus' => $recordstatus,
        ];

        $output   = mis_std_chg_program::create($data);

        if($output){

            return response()->json([
                'success'=>true,
                'messages'=>'Successfully Register',
                'data'=>$output,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Registration Failed',
                'data'=>'',
            ],201);
        }

    }

    public function update_approval(Request $request){

        $data = [];
        $id = $request->input('id');
        $cgp_id = $request->input('cgp_id');
        $std_studentid = $request->input('std_studentid');
        $recordstatus = $request->input('recordstatus');

        if($id == 1){
            $app_admin = $request->input('app_admin');
            $data = [
                'std_studentid' =>  $std_studentid,
                'app_admin' => $app_admin,
                'recordstatus' => $recordstatus
            ];    

        }else if($id == 2){
            $app_curr_fac_dean = $request->input('app_curr_fac_dean');
            $data = [
                'std_studentid' =>  $std_studentid,
                'app_curr_fac_dean' => $app_curr_fac_dean,
                'recordstatus' => $recordstatus
            ];
    
        }else if($id == 3){
            $app_new_fac_dean = $request->input('app_new_fac_dean');
            $data = [
                'std_studentid' => $std_studentid,
                'app_new_fac_dean' => $app_new_fac_dean,
                'recordstatus' => $recordstatus
            ];
    
        }
        else if($id == 4){
            $curr_student_fees = $request->input('curr_student_fees');
            $new_student_fees = $request->input('new_student_fees');
            $data = [
                'std_studentid' => $std_studentid,
                // 'curr_student_fees' =>  $app_new_dean_fac,
                'new_student_fees' => $new_student_fees,
                'recordstatus' => $recordstatus
            ];
    
        }

        $output = mis_std_chg_program::where('cgp_id',$cgp_id)->update($data);

        if($output){
            return response()->json([
                'success'=>true,
                'messages'=>'Successfully Register',
                'data'=>$output,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Registration Failed',
                'data'=>'',
            ],201);

        }

    }
    
}
