<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_prm_obe_plo;

class mis_prm_obe_ploController extends Controller


{

     public function __construct()
    {
        $this->middleware('auth');
    }


    public function registerPlo(Request $request) {
        // Retrieving data from the request
        $obe_plo_name = $request->input('obe_plo_name');
        $pgm_id = $request->input('pgm_id');
        $obe_plo_statement = $request->input('obe_plo_statement');
        $recordstatus = 'ADD';
    
        // Dump and die to check the value of $recordstatus
    
        // Creating a new record in the database using the 'mis_prm_obe_plo' model

        $data = [
            'obe_plo_name' => $obe_plo_name,
            'pgm_id' => $pgm_id,
            'obe_plo_statement' => $obe_plo_statement,
            'recordstatus' => $recordstatus,
        ];

        // dd($data);

        $register = mis_prm_obe_plo::create($data);
    
        // Checking if the record was successfully created
        if ($register) {
            return response()->json([
                'success' => true,
                'message' => 'Register Success!',
                'data' => $register
            ], 201);
        } else {
            return response()->json([
                'success' => 'false',
                'message' => 'Bad Request',
                'data' => $register
            ], 400);
        }
    }
    

    public function show($pgm_id)  {
        // $pgm_id = $request->input('pgm_id');

        // $mis_prm_obe = mis_prm_obe::where('pgm_id',$pgm_id)->get();

        $mis_prm_obe_plo = mis_prm_obe_plo::where('pgm_id', $pgm_id)
                          ->where('recordstatus', '!=', 'DEL')
                          ->get();


        if ($mis_prm_obe_plo)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$mis_prm_obe_plo
            ],200);
        }
    }

    public function showByPgmDet(Request $request)  {
        $pgmDet_id = $request->input('pgmDet_id');

        // dd($pgmDet_id);
        // $mis_prm_obe = mis_prm_obe::where('pgm_id',$pgm_id)->get();
        // \DB::enableQueryLog();
        $mis_prm_obe_plo = mis_prm_obe_plo::leftjoin('mis_prm_programme_det','mis_prm_programme_det.pgm_id','=','mis_prm_obe_plo.pgm_id')
                        ->where('mis_prm_programme_det.dtp_id', $pgmDet_id)
                          ->where('mis_prm_obe_plo.recordstatus', '!=', 'DEL')
                          ->get();
                        //   dd(\DB::getQueryLog());

        if ($mis_prm_obe_plo)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$mis_prm_obe_plo
            ],200);
        }
    }


    public function showByFKCodePgm($code_pgm)  {
        // $pgm_id = $request->input('pgm_id');

        // $mis_prm_obe = mis_prm_obe::where('pgm_id',$pgm_id)->get();
        $mis_prm_obe_plo = mis_prm_obe_plo::
                            // where('obe_plo_id', $code_pgm)
                          where('mis_prm_obe_plo.recordstatus', '!=', 'DEL')
                          ->leftjoin('mis_prm_programme','mis_prm_programme.pk_id','mis_prm_obe_plo.pgm_id')
                          ->where('mis_prm_programme.pgm_id', $code_pgm)
                          ->get([
                            'mis_prm_obe_plo.obe_plo_id',
                            'mis_prm_obe_plo.obe_plo_name',
                            'mis_prm_obe_plo.obe_plo_statement',
                            'mis_prm_programme.pgm_id AS pgmCode',
                            'mis_prm_programme.pgm_attainment',
                            'mis_prm_programme.pk_id AS fk_pgm',
                            'mis_prm_programme.pgm_name',
                            'mis_prm_obe_plo.recordstatus AS recordObePlo',
                            'mis_prm_programme.recordstatus AS recordProgramme'
                          ]);


        if ($mis_prm_obe_plo)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$mis_prm_obe_plo
            ],200);
        }
    }

    public function list()  {
        $mis_prm_obe_plo = mis_prm_obe_plo::all();

        if ($mis_prm_obe_plo)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$mis_prm_obe_plo
            ],200);
        }
        
    }

    public function updatePlo(Request $request)    {

        
        $obe_plo_id = $request->input('obe_plo_id');
        $obe_plo_name = $request->input('obe_plo_name');
        // $pgm_id = $request->input('pgm_id');
        $obe_plo_statement = $request->input('obe_plo_statement');
        // $obe_plo_percentage = $request->input('obe_plo_percentage');
        // $obe_plo_status = $request->input('obe_plo_status');
        // $lastupdateon = $request->input('lastupdateon');
        // $lastupdateby = $request->input('lastupdateby');
        // $lastapproveon = $request->input('lastapproveon');
        // $lastapproveby = $request->input('lastapproveby');
        $recordstatus = 'EDT';
        $mis_prm_obe_plo = mis_prm_obe_plo::where('obe_plo_id',$obe_plo_id)->update([
            // 'obe_plo_id' => $obe_plo_id,
            'obe_plo_name' => $obe_plo_name,
            'obe_plo_statement' => $obe_plo_statement,
            'recordstatus' => $recordstatus,
        ]);

        if ($mis_prm_obe_plo)  {
            return response()->json([
                'success'=>true,
                'message'=>"Update Success!",
                'data' => $mis_prm_obe_plo
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

      public function deletePlo(Request $request){
        
        $obe_plo_id = $request->input('obe_plo_id');
        $recordstatus = 'DEL';

        // $obj = mis_prm_obe::where([['obe_plo_id','=',$obe_plo_id]])-> update([
        //     'recordstatus' => $recordstatus,
        // ]);

        $obj = mis_prm_obe_plo::where('obe_plo_id',$obe_plo_id)->update([
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
            ],401);
        }
    }





    

}
