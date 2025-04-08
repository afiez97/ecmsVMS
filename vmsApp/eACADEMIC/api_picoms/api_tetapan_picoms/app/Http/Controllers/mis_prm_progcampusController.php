<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_prm_progcampus;

class mis_prm_progcampusController extends Controller
{
    public function register(Request $request) {
        $cam_id = $request->input('cam_id');
        $fac_id = $request->input('fac_id');
        $pgm_id = $request->input('pgm_id');
        $prog_status = $request->input('prog_status');

        $obj = mis_prm_progcampus::create([
            'cam_id' => $cam_id,
            'fac_id' => $fac_id,
            'pgm_id' => $pgm_id,
            'prog_status' => $prog_status,
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


    public function show(Request $request){
        $cam_id = $request->input('cam_id');
        $pgm_id = $request->input('pgm_id');

        $obj = mis_prm_progcampus::where([['cam_id',$cam_id],['pgm_id',$pgm_id]])->get();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function list(){
        $obj = mis_prm_progcampus::select('mis_prm_progcampus.*') ->get();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function update(Request $request){
        $pk_id = $request->input('pk_id');
        $prog_status = $request->input('prog_status');

        $obj = mis_prm_progcampus::where([['pk_id','=',$pk_id]]) -> update([
            'prog_status' => $prog_status,
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


    public function dataChecking(Request $request){
        $pgm_id = $request->input('pgm_id');
        $cam_id = $request->input('cam_id');

        $obj = mis_prm_progcampus::where([
            ['pgm_id','=',$pgm_id],
            ['cam_id','=',$cam_id]
            ]) ->get();

        if ($obj){
            return response()->json([
                'success'=>true,
                'message'=>"Carian Berjaya!",
                'data' => $obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Carian Gagal!",
                'data'=>''
            ],404);
        }
    }


    public function listByFac($id,$cam_id){
        $obj = mis_prm_progcampus::leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_prm_progcampus.pgm_id')
            ->where([['mis_prm_progcampus.fac_id', '=', $id],['mis_prm_progcampus.prog_status', '=', 'Active']])
            ->where('mis_prm_progcampus.cam_id',$cam_id)
            ->orderBy('mis_prm_progcampus.pgm_id','ASC')
            ->get([
                'mis_prm_progcampus.cam_id',
                'mis_prm_progcampus.fac_id',
                'pgm_name',
                'mis_prm_progcampus.pgm_id',
                'mis_prm_programme.pgm_id as pgm_code',
                'prog_status'
            ]);

        if ($obj){
            return response()->json([
                'success'=>true,
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>'List False!',
                'data'=>''
            ],400);
        }
    }

    // select list by campus(active)
    // public function listByCamAct($id){
    //     $obj = mis_prm_progcampus::select('mis_prm_progcampus.*','pgm_name','mis_prm_programme.pgm_id AS pgmCode') 
    //         ->leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_prm_progcampus.pgm_id')
    //         ->where([['mis_prm_progcampus.cam_id', '=', $id],['mis_prm_progcampus.prog_status', '=', 'Active']]) ->get();

    //     if ($obj){
    //         return response()->json([
    //             'success'=>'true',
    //             'message'=>'List Success!',
    //             'data'=>$obj
    //         ],200);
    //     }
    // }

    public function listByCamAct($id){
        $obj = mis_prm_progcampus::select('mis_prm_progcampus.*','pgm_name','mis_prm_programme.pgm_id AS pgmCode', 'mis_prm_programme.recordstatus') 
            ->leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_prm_progcampus.pgm_id')
            ->where([['mis_prm_progcampus.cam_id', '=', $id],['mis_prm_progcampus.prog_status', '=', 'Active'], ['mis_prm_programme.recordstatus', '!=', 'DEL']]) ->get();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // list by Academic Session
    public function listByAcaSession($id){
        $cur_year = str_replace("-","/",$id);

        $obj = mis_prm_progcampus::select('mis_prm_progcampus.*','mis_prm_programme.pgm_name','mis_prm_programme.pgm_id AS pgmId','mis_prm_programme.fac_id','mis_prm_faculty.fac_name','mis_prm_faculty.fac_id AS facCode','mis_prm_programme_det.dtp_id','mis_prm_programme_det.dtp_year','mis_prm_programme_det.dtp_intake')
            ->leftjoin('mis_prm_programme_det','mis_prm_programme_det.pgm_id','=','mis_prm_progcampus.pgm_id')
            ->leftjoin('mis_prm_programme','mis_prm_programme.pk_id','=','mis_prm_progcampus.pgm_id')
            ->leftjoin('mis_prm_faculty','mis_prm_faculty.pk_id','=','mis_prm_progcampus.fac_id')
            ->where([
                ['mis_prm_programme_det.dtp_year','=',$cur_year],
                ['mis_prm_programme_det.recordstatus','!=',"DEL"],
                ['mis_prm_progcampus.prog_status','=',"Active"],
                // ['mis_prm_programme.recordstatus','!=',"DEL"],
            ])
            ->get();

        if ($obj)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>'false',
                'message'=>'No Data Found!',
                'data'=>$obj
            ],200);
        }
    }
    
    
    // group by active programme
    public function grpByPgmAct(){
        $obj = mis_prm_progcampus::select('mis_prm_progcampus.*','pgm_name') 
            ->leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id','=','mis_prm_progcampus.pgm_id')
            ->groupBy('pgm_id') 
            ->where('prog_status','=','Active') ->get();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }

    // group by active programme new //MIMI
    public function grpByPgmActNew(){
        $obj = mis_prm_progcampus::leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id','=','mis_prm_progcampus.pgm_id')
            ->groupBy('mis_prm_programme.pgm_name','mis_prm_programme.pgm_id','mis_prm_programme.pk_id') 
            ->where('prog_status','=','Active')
            ->get(
                [
                    'mis_prm_programme.pgm_name',
                    'mis_prm_programme.pgm_id',
                    'mis_prm_programme.pk_id'
                ]
                );
        

        if ($obj){
            return response()->json([
                'success'=>true,
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }
}
