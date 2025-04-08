<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_std_tawaran;

use DB;

class mis_std_tawaranController extends Controller
{
    public function  __construct()
    {
        $this->middleware('auth');
    }

    public function create(Request $request){
        if ($request->isJson()) {
            $data = $request->json()->all();
            $check = true;
        } else {
            $check = false;
        }
        
        if($check){
            $obj = mis_std_tawaran::create($data);
            if($obj){
                return response()->json([
                    'success'=>true,
                    'messages'=>'Proses Berjaya',
                    'data'=>$obj,
                ],201); 
            }
            else{
                return response()->json([
                    'success'=>false,
                    'messages'=>'Proses Gagal',
                    'data'=>'',
                ],400);
            }          
        }
        else{
            return $data;
        }
        

    }

    public function show(Request $request){
        $id = $request->input('id');

        $obj = mis_std_tawaran::
        where('recordstatus','!=','DEL')
        ->where('id',$id)
        ->first();
        if($obj){

            return response()->json([
                'success'=>true,
                'messages'=>'Proses Berjaya',
                'data'=>$obj,
            ],200);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Proses Gagal',
                'data'=>'',
            ],200);
        }
    }

    public function list(){
        $obj = mis_std_tawaran::where('recordstatus','!=','REG')->get();

        if($obj){

            return response()->json([
                'success'=>true,
                'messages'=>'Proses Berjaya',
                'data'=>$obj,
            ],200);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Proses Gagal',
                'data'=>'',
            ],200);
        }
    }

    public function updateStatus(Request $request){
        $id = $request->input("id");
        $data =['recordstatus' => 'REG'];
        $obj = mis_std_tawaran::
        where('recordstatus','!=','REG')
        ->where('id',$id)
        ->update($data);

        if($obj){

            return response()->json([
                'success'=>true,
                'messages'=>'Proses Berjaya',
                'data'=>$obj,
            ],200);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Proses Gagal',
                'data'=>'',
            ],200);
        }
    }

    public function delete(){
        
    }
}
