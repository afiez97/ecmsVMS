<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_prm_programme;

class mis_prm_programmeController extends Controller
{
    public function register(Request $request){
        $pgm_id = $request->input('pgm_id');
        $fac_id = $request->input('fac_id');
        $pgm_category = $request->input('pgm_category');
        $pgm_area = $request->input('pgm_area');
        $pgm_name = $request->input('pgm_name');
        $pgm_mode = $request->input('pgm_mode');
        $pgm_mqflevel = $request->input('pgm_mqflevel');
        $pgm_duration = $request->input('pgm_duration');
        $pgm_status = $request->input('pgm_status');
        $pgm_fee = $request->input('pgm_fee');
        $pgm_fee_usd = $request->input('pgm_fee_usd');
        $pgm_tcrdpass = $request->input('pgm_tcrdpass');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_programme::create([
            'pgm_id' => $pgm_id,
            'fac_id' => $fac_id,
            'pgm_category' => $pgm_category,
            'pgm_area' => $pgm_area,
            'pgm_name' => $pgm_name,
            'pgm_mode' => $pgm_mode,
            'pgm_mqflevel' => $pgm_mqflevel,
            'pgm_duration' => $pgm_duration,
            'pgm_status' => $pgm_status,
            'pgm_fee' => $pgm_fee,
            'pgm_fee_usd' => $pgm_fee_usd,
            'pgm_tcrdpass' => $pgm_tcrdpass,
            'recordstatus' => $recordstatus,
        ]);

        if ($obj){
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
    

    
    public function show($id){
        $obj = mis_prm_programme::where('mis_prm_programme.pk_id',$id)
            ->leftjoin('mis_prm_faculty', 'mis_prm_faculty.pk_id','=','mis_prm_programme.fac_id')
            ->leftjoin('category', 'category.id','=','mis_prm_programme.pgm_category')
            // ->leftjoin('aca_area', 'aca_area.id','=','mis_prm_programme.pgm_area')
            ->leftjoin('mode', 'mode.id','=','mis_prm_programme.pgm_mode')
            ->leftjoin('mqflevel', 'mqflevel.id','=','mis_prm_programme.pgm_mqflevel')
            ->leftjoin('aca_cal_category', 'aca_cal_category.pk_id','=','mis_prm_programme.pgm_area')
            ->first([
                'mis_prm_programme.pk_id AS pgmId',
                'pgm_id',
                'mis_prm_programme.fac_id AS fk_fac',
                'fac_name',
                'pgm_category',
                'category_name',
                'pgm_area',
                // 'aca_area_name',
                'pgm_name',
                'pgm_mode',
                'mode_name',
                'pgm_mqflevel',
                'mqflevel_name',
                'pgm_duration',
                'pgm_status',
                'pgm_fee',
                'pgm_fee_usd',
                'category', 
                'pgm_tcrdpass', 'pgm_attainment'
            ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function list(){
        $obj = mis_prm_programme::where('mis_prm_programme.recordstatus','!=','DEL')
            ->leftjoin('mis_prm_faculty', 'mis_prm_faculty.pk_id', '=', 'mis_prm_programme.fac_id') 
            ->leftjoin('category', 'category.id','=','mis_prm_programme.pgm_category')
            ->leftjoin('aca_cal_category', 'aca_cal_category.pk_id','=','mis_prm_programme.pgm_area')
            ->orderBy('mis_prm_programme.fac_id')
            ->orderBy('pgm_status')
            ->get([
                'mis_prm_programme.pk_id AS progId',
                'pgm_id',
                'pgm_name',
                'pgm_status',
                'mis_prm_faculty.fac_id AS facCode',
                'pgm_category',
                'category_name',
                'pgm_area',
                'category',
                'mis_prm_programme.fac_id AS fk_faculty'
            ]);
        
            if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function delete(Request $request) {
        $pk_id = $request->input('pk_id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_programme::where('pk_id',$pk_id) -> update([
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
            ],404);
        }
    }


    public function update(Request $request){
        $pk_id = $request->input('pk_id');
        $fac_id = $request->input('fac_id');
        $pgm_category = $request->input('pgm_category');
        $pgm_area = $request->input('pgm_area');
        $pgm_name = $request->input('pgm_name');
        $pgm_mode = $request->input('pgm_mode');
        $pgm_mqflevel = $request->input('pgm_mqflevel');
        $pgm_duration = $request->input('pgm_duration');
        $pgm_status = $request->input('pgm_status');
        $pgm_fee = $request->input('pgm_fee');
        $pgm_fee_usd = $request->input('pgm_fee_usd');
        $pgm_tcrdpass = $request->input('pgm_tcrdpass');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_programme::where('pk_id',$pk_id) -> update([
            'fac_id' => $fac_id,
            'pgm_category' => $pgm_category,
            'pgm_area' => $pgm_area,
            'pgm_name' => $pgm_name,
            'pgm_mode' => $pgm_mode,
            'pgm_mqflevel' => $pgm_mqflevel,
            'pgm_duration' => $pgm_duration,
            'pgm_status' => $pgm_status,
            'pgm_fee' => $pgm_fee,
            'pgm_fee_usd' => $pgm_fee_usd,
            'pgm_tcrdpass' => $pgm_tcrdpass,
            'recordstatus' => $recordstatus,
        ]);

        if ($obj)  {
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

    public function progCodeChecking(Request $request){
        $input = $request->input('input');

        // $query = mis_prm_programme::where([
        //     ['pgm_id','=',$input],
        //     ['recordstatus','!=','DEL']
        //     ])->get();

        $query = mis_prm_programme::leftJoin('mis_prm_faculty', 'mis_prm_programme.fac_id', '=', 'mis_prm_faculty.pk_id')
            ->where('mis_prm_programme.pgm_id', $input)
            ->where('mis_prm_programme.recordstatus', '!=', 'DEL')
            ->get();


        if ($query)  {
            return response()->json([
                'success'=>true,
                'message'=>"Carian Berjaya!",
                'data' => $query
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


    public function listByCampus($id)  {
        $obj = mis_prm_programme::select('mis_prm_programme.*','fac_name')
            -> join('mis_prm_faculty', 'mis_prm_faculty.pk_id', '=', 'mis_prm_programme.fac_id')
            -> join('mis_prm_college', 'mis_prm_college.pk_id', '=' , 'mis_prm_faculty.cam_id')
            -> where('mis_prm_college.pk_id', '=', $id)
            -> where('mis_prm_programme.recordstatus', '!=', 'DEL') ->get();
        
        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function selectProg($id)  {
        $obj = mis_prm_programme::select('mis_prm_programme.*','fac_name')
            -> join('mis_prm_faculty', 'mis_prm_faculty.pk_id', '=', 'mis_prm_programme.fac_id')
            -> join('mis_prm_college', 'mis_prm_college.pk_id', '=' , 'mis_prm_faculty.cam_id')
            -> where('mis_prm_college.pk_id', '=', $id)
            -> where('mis_prm_programme.pgm_status', '=', 'Active')
            -> where('mis_prm_programme.recordstatus', '!=', 'DEL') ->get();
        
        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function listByFaculty($id){
        $obj = mis_prm_programme::where([
            ['mis_prm_programme.fac_id', '=', $id],
            ['mis_prm_programme.pgm_status', '=', 'Active'],
            ['mis_prm_programme.recordstatus', '!=', 'DEL']
        ])
        ->leftjoin('category', 'category.id','=','mis_prm_programme.pgm_category')
        ->get([
            'mis_prm_programme.pk_id AS prog_id',
            'pgm_id',
            'pgm_category',
            'pgm_name',
            'category_name',
            'fac_id'
        ]);
        
        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function updateObe(Request $request){
        $pk_id = $request->input('pk_id');
        $pgm_attainment = $request->input('pgm_attainment');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_programme::where('pk_id',$pk_id) -> update([
            'pgm_attainment' => $pgm_attainment,
            'recordstatus' => $recordstatus,
        ]);

        if ($obj)  {
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
