<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\picoms_cte_questions;

class picoms_cte_questionsController extends Controller
{
    public function  __construct()
    {
        $this->middleware('auth');
    }

    public function create(Request $request){
        $soalan = $request->input('soalan');
        $maker = $request->input('maker');


           // Retrieve existing content
           $existingContent = picoms_cte_questions::where('soalan', $soalan)->first();

         if ($existingContent !== null) {
            return response()->json([
                'success' => false,
                'message' => 'Duplicate content found',
                'data' => '',
            ], 400);
        }else{
            $data = [
                'soalan' => $soalan,
                'maker' => $maker,
                'active' => 'active',
                'recordstatus' => 'ADD'
            ];
            $obj = picoms_cte_questions::create($data);
    
            if($obj){      
                // nie utk tutup soalan yg ada changes lpas create baru
                $obj = picoms_cte_questions::where('pk_cte', '!=',$obj->id)->update(['active' => 'inactive']);
                
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
        
    }

    public function update(Request $request){
        $subject = $request->input('subject');
        $kod_subject = $request->input('kod_subject');

        $data = [
            'subject' => $subject
        ];
        $obj = picoms_cte_questions::where('kod_subject',$kod_subject)->update($data);

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

        $obj = picoms_cte_questions::where('kod_subject',$kod_subject)->first();

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


    public function viewActiveQuestion(){
        // $kod_subject = $request->input('kod_subject');

        $obj = picoms_cte_questions::where([['recordstatus','!=', 'DEL'],['active','=', 'active']])->first();

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
        $obj = picoms_cte_questions::where('recordstatus','01')->orderBy('subject','ASC')->get();

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

    public function delete(){
        
    }

}
