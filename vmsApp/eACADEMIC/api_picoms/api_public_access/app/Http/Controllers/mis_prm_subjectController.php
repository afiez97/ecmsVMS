<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_prm_subject;

class mis_prm_subjectController extends Controller
{
    public function  __construct()
    {
        $this->middleware('auth');
    }

    public function create(Request $request){
        $subject = $request->input('subject');
        $kod_subject = $request->input('kod_subject');

        $data = [
            'subject' => $subject,
            'kod_subject' => $kod_subject
        ];
        $obj = mis_prm_subject::create($data);

        if($obj){          
            return response()->json([
                'success'=>true,
                'messages'=>'Proses Berjaya',
                'data'=>$obj
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Proses Gagal',
                'data'=>'',
            ],401);
        }
    }

    public function update(Request $request){
        $subject = $request->input('subject');
        $kod_subject = $request->input('kod_subject');

        $data = [
            'subject' => $subject
        ];
        $obj = mis_prm_subject::where('kod_subject',$kod_subject)->update($data);

        if($obj){          
            return response()->json([
                'success'=>true,
                'messages'=>'Proses Berjaya',
                'data'=>$obj
            ],202);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Proses Gagal',
                'data'=>'',
            ],402);
        }
    }

    public function view(Request $request){
        $kod_subject = $request->input('kod_subject');

        $obj = mis_prm_subject::where('kod_subject',$kod_subject)->first();

        if($obj){          
            return response()->json([
                'success'=>true,
                'messages'=>'Proses Berjaya',
                'data'=>$obj
            ],200);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Proses Gagal',
                'data'=>'',
            ],400);
        }
    }

    public function list(){
        $obj = mis_prm_subject::where('recordstatus','01')->orderBy('subject','ASC')->get();

        if(sizeof($obj) > 0){          
            return response()->json([
                'success'=>true,
                'messages'=>'Proses Berjaya',
                'data'=>$obj
            ],200);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Proses Gagal',
                'data'=>'',
            ],400);
        }
    }

    public function delete(){
        
    }

}
