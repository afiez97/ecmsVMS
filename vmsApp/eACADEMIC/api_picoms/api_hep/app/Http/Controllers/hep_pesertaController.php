<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\hep_peserta;

class hep_pesertaController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function register(Request $request){
        $prog_id = $request->input('prog_id');
        $att_nomatrik = $request->input('att_nomatrik');
        $att_notel = $request->input('att_notel');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_peserta::create([
            'prog_id' => $prog_id,
            'att_nomatrik' => $att_nomatrik,
            'att_notel' => $att_notel,
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


    public function show($id){
        $obj = hep_peserta::where('id_peserta',$id) 
            ->leftjoin('hep_program', 'hep_program.id_program','=','hep_peserta.prog_id')
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid','=','hep_peserta.att_nomatrik')
            ->first([
                'id_peserta',
                'prog_title',
                'prog_org',
                'prog_venue',
                'prog_startdate',
                'prog_enddate',
                'sti_name',
                'sti_icno',
                'prog_cert'
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function list($id){
        $obj = hep_peserta::where([['prog_id','=',$id],['hep_peserta.recordstatus','!=','DEL']])
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid','=','hep_peserta.att_nomatrik')
            ->leftjoin('hep_program', 'hep_program.id_program','=','hep_peserta.prog_id')
            ->get([
                'id_peserta',
                'prog_id',
                'att_nomatrik',
                'sti_name',
                'sti_contactno_mobile',
                'prog_cert'
            ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function update(Request $request){
        $id_peserta = $request->input('id_peserta');
        $att_icno = $request->input('att_icno');
        $att_name = $request->input('att_name');
        $att_nomatrik = $request->input('att_nomatrik');
        $att_notel = $request->input('att_notel');
        $att_email = $request->input('att_email');
        $att_status = $request->input('att_status');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_peserta::where([['id_peserta','=',$id_peserta]]) -> update([
            'att_icno' => $att_icno,
            'att_name' => $att_name,
            'att_nomatrik' => $att_nomatrik,
            'att_notel' => $att_notel,
            'att_email' => $att_email,
            'att_status' => $att_status,
            'recordstatus' => $recordstatus
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


    public function delete(Request $request){
        $recordstatus = $request->input('recordstatus');
        $id_peserta = $request->input('id_peserta');

        $obj = hep_peserta::where('id_peserta',$id_peserta)-> update([
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
    

    // check if student exist
    public function chkAttendance(Request $request){
        $prog_id = $request->input('prog_id');
        $att_nomatrik = $request->input('att_nomatrik');

        $obj = hep_peserta::where([
                ['prog_id', $prog_id],
                ['att_nomatrik',$att_nomatrik],
                ['recordstatus', '!=', 'DEL']
            ])
            ->get(['id_peserta']);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function listByStd($id){
        $obj = hep_peserta::where([['att_nomatrik','=',$id],['hep_peserta.recordstatus','!=','DEL']])
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid','=','hep_peserta.att_nomatrik')
            ->leftjoin('hep_program', 'hep_program.id_program','=','prog_id')
            ->get([
                'id_peserta',
                'prog_id',
                'prog_title',
                'att_nomatrik',
                'sti_name',
                'sti_contactno_mobile',
                'prog_cert',
                'prog_startdate',
                'prog_enddate',
                'prog_venue'
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }
}
