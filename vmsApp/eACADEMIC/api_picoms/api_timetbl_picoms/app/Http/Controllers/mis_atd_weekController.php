<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_atd_week;

class mis_atd_weekController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function register(Request $request){
        $fk_tmtDet = $request->input('fk_timetbl');
        $att_date = $request->input('att_date');
        $att_week = $request->input('att_week');
        $att_hour = $request->input('att_hour');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_atd_week::create([
            'fk_tmtDet' => $fk_tmtDet,
            'att_date' => $att_date,
            'att_week' => $att_week,
            'att_hour' => $att_hour,
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


    public function list($id){
        $obj = mis_atd_week::where([['recordstatus','!=','DEL'],['fk_tmtDet',$id]])
            //add this query will cast the att_week values to integers and then perform a numeric (ascending) sorting, giving the correct result
            ->orderByRaw("CAST(att_week AS SIGNED) ASC")
            ->get([
                'pk_id',
                'fk_tmtDet',
                'att_date',
                'att_week',
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }

    public function show($id){
        $obj = mis_atd_week::where([['recordstatus','!=','DEL'],['pk_id',$id]])
            ->first([
                'pk_id',
                'fk_tmtDet',
                'att_date',
                'att_week',
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>'Show Fail!',
                'data'=>''
            ],400);
        }
    }


    public function update(Request $request){
        $pk_id = $request->input('pk_id');
        $fk_tmtDet = $request->input('fk_timetbl');
        $att_date = $request->input('att_date');
        $att_week = $request->input('att_week');
        $att_hour = $request->input('att_hour');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_atd_week::where('pk_id',$pk_id) ->update([
            'fk_tmtDet' => $fk_tmtDet,
            'att_date' => $att_date,
            'att_week' => $att_week,
            'att_hour' => $att_hour,
            'recordstatus' => $recordstatus
        ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Update Success!',
                'data'=>$obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>'false',
                'message'=>'Update Failed',
                'data'=>$obj
            ],404);
        }
    }


    public function delete(Request $request){
        $pk_id = $request->input('pk_id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_atd_week::where('pk_id',$pk_id) ->update([
            'recordstatus' => $recordstatus,
        ]);

        if($obj){
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
}
