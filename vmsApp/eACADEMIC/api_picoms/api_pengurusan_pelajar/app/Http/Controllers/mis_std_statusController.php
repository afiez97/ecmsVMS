<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_std_status;


class mis_std_statusController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function create(Request $request){
        $std_studentid        = $request->input('std_studentid');
        $pgm_id               = $request->input('pgm_id');
        $sts_cur_year         = $request->input('sts_cur_year');
        $sts_cur_intake       = $request->input('sts_cur_intake');
        $sts_semester         = $request->input('sts_semester');
        $sts_status           = $request->input('sts_status');
        $sts_date_joined      = $request->input('sts_date_joined');
        $sts_date_complete    = $request->input('sts_date_complete');
        $recordstatus         = $request->input('recordstatus');

        $data = [
            'std_studentid' => $std_studentid,
            'pgm_id' => $pgm_id,
            'sts_cur_year' => $sts_cur_year,
            'sts_cur_intake' => $sts_cur_intake,
            'sts_semester' => $sts_semester,
            'sts_status' => $sts_status,
            'sts_date_joined' => $sts_date_joined,
            'sts_date_complete' => $sts_date_complete,
            'recordstatus' => $recordstatus
        ];

        $object   = mis_std_status::create($data);

        if($object){
            return response()->json([
                'success'=>true,
                'messages'=>'Successfully Register',
                'data'=>$object,
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

    public function update(Request $request){
        $std_studentid        = $request->input('std_studentid');
        $pgm_id               = $request->input('pgm_id');
        $sts_cur_year         = $request->input('sts_cur_year');
        $sts_cur_intake       = $request->input('sts_cur_intake');
        $sts_semester         = $request->input('sts_semester');
        $sts_status           = $request->input('sts_status');
        $sts_date_joined      = $request->input('sts_date_joined');
        $sts_date_complete    = $request->input('sts_date_complete');
        $recordstatus         = $request->input('recordstatus');

        $data = [
            'pgm_id' => $pgm_id,
            'sts_cur_year' => $sts_cur_year,
            'sts_cur_intake' => $sts_cur_intake,
            'sts_semester' => $sts_semester,
            'sts_status' => $sts_status,
            'sts_date_joined' => $sts_date_joined,
            'sts_date_complete' => $sts_date_complete,
            'recordstatus' => $recordstatus
        ];

        $object   = mis_std_status::where('std_studentid',$std_studentid)->update($data);

        if($object){
            return response()->json([
                'success'=>true,
                'messages'=>'Successfully Updated',
                'data'=>$object,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Updated Failed',
                'data'=>'',
            ],201);
        }
    }

    public function show($id){
        $object = mis_std_status::where('std_studentid',$id)->first();

        if($object){
            return response()->json([
                'success'=>true,
                'messages'=>'Success List',
                'data'=>$object,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Failed List',
                'data'=>'',
            ],201);
        }
    }

    public function list(){
        $object = mis_std_status::all();

        if($object){
            return response()->json([
                'success'=>true,
                'messages'=>'Success List',
                'data'=>$object,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Failed List',
                'data'=>'',
            ],201);
        }
    }

    public function delete(Request $request){
        $std_studentid        = $request->input('std_studentid');

        $data = [
            "recordstatus" => "DEL"
        ];
        
        $object   = mis_std_status::where('std_studentid',$std_studentid)->update($data);

        if($object){
            return response()->json([
                'success'=>true,
                'messages'=>'Successfully Deleted',
                'data'=>$object,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Deleted Failed',
                'data'=>'',
            ],201);
        }
    }
}
