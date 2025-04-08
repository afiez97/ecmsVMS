<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\mis_std_financial;

class mis_std_financialController extends Controller
{
    public function  __construct()
    {
        $this->middleware('auth');
    }

    public function create(Request $request){
        $std_studentid = $request->input('std_studentid');
        $b40 = $request->input('b40');
        $std_loan = $request->input('std_loan');
        $std_baitulmal = $request->input('std_baitulmal');
        $std_asnafStatus = $request->input('std_asnafStatus');
        $std_periodStatus = $request->input('std_periodStatus');
        $std_periodAsis = $request->input('std_periodAsis');
        $lastupdateby = $request->input('user');

        $data = [
            'std_studentid' => $std_studentid,
            'b40' => $b40,
            'std_loan' => $std_loan,
            'std_baitulmal' => $std_baitulmal,
            'std_asnafStatus' => $std_asnafStatus,
            'std_periodStatus' => $std_periodStatus,
            'std_periodAsis' => $std_periodAsis,
            'lastupdateby' => $lastupdateby,
        ];

        $obj = mis_std_financial::create($data);

        if($obj){
            return response()->json([
                'success'=>true,
                'messages'=>'Successfully Register',
                'data'=>$obj,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Registration Failed',
                'data'=>'',
            ],400);
        }
    }

    public function update(Request $request){
        $std_studentid = $request->input('std_studentid');
        $b40 = $request = $request->input('b40');
        $std_loan = $request->input('std_loan');
        $std_baitulmal = $request->input('std_baitulmal');
        $std_asnafStatus = $request->input('std_asnafStatus');
        $std_periodStatus = $request->input('std_periodStatus');
        $std_periodAsis = $request->input('std_periodAsis');
        $lastupdateby = $request->input('user');

        $data = [
            'b40'               => $b40,
            'std_loan'          => $std_loan,
            'std_baitulmal'     => $std_baitulmal,
            'std_asnafStatus'   => $std_asnafStatus,
            'std_periodStatus'  => $std_periodStatus,
            'std_periodAsis'    => $std_periodAsis,
            'lastupdateby'      => $lastupdateby,
            'recordstatus'      => 'EDT',
        ];

        $obj = mis_std_financial::where('std_studentid',$std_studentid)->update($data);

        if($obj){
            $obj = mis_std_financial::where('std_studentid',$std_studentid)->first();
            return response()->json([
                'success'=>true,
                'messages'=>'Successfully Register',
                'data'=>$obj,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Registration Failed',
                'data'=>'',
            ],400);
        }
    }

    public function show($id){
        
        $output = mis_std_financial::
        where([
            ['recordstatus','!=','DEL'],
            ['std_studentid','=',$id]
            ])->first();

        if($output){

            return response()->json([
                'success'=>true,
                'messages'=>'Proses Berjaya',
                'data'=>$output,
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
}
