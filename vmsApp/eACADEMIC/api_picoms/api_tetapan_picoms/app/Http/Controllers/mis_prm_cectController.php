<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_prm_cect;

class mis_prm_cectController extends Controller
{
    public function register(Request $request) {
        $ctr_code = $request->input('ctr_code');
        $ctr_cretransfer = $request->input('ctr_cretransfer');
        $ctr_gpatransfer = $request->input('ctr_gpatransfer');
        $ctr_cgpatransfer = $request->input('ctr_cgpatransfer');
        $ctr_min_percentage = $request->input('ctr_min_percentage');
        $ctr_max_percentage = $request->input('ctr_max_percentage');
        $ctr_grade = $request->input('ctr_grade');
        $lastupdateon = $request->input('lastupdateon');
        $lastupdateby = $request->input('lastupdateby');
        $lastapproveon = $request->input('lastapproveon');
        $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $register = mis_prm_cect::create([
            'ctr_code' => $ctr_code,
            'ctr_cretransfer' => $ctr_cretransfer,
            'ctr_gpatransfer' => $ctr_gpatransfer,
            'ctr_cgpatransfer' => $ctr_cgpatransfer,
            'ctr_min_percentage' => $ctr_min_percentage,
            'ctr_max_percentage' => $ctr_max_percentage,
            'ctr_grade' => $ctr_grade,
            'lastupdateon' => $lastupdateon,
            'lastupdateby' => $lastupdateby,
            'lastapproveon' => $lastapproveon,
            'lastapproveby' => $lastapproveby,
            'recordstatus' => $recordstatus,
        ]);

        if ($register)  {
            return response()->json([
                'success'=>'true',
                'message'=>'Register Success!',
                'data'=>$register
            ],201);
        }

        else    {
            return response()->json([
                'success'=>'false',
                'message'=>'Bad Request',
                'data'=>$register
            ],400);
        }
    }

    public function show(Request $request)  {
        $ctr_code = $request->input('ctr_code');

        $mis_prm_cect = mis_prm_cect::where('ctr_code',$ctr_code)->first();

        if ($mis_prm_cect)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$mis_prm_cect
            ],200);
        }
    }

    public function list()  {
        $mis_prm_cect = mis_prm_cect::where([['recordstatus','!=','DEL']])->get();

        if ($mis_prm_cect)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$mis_prm_cect
            ],200);
        }
        
    }

    public function update(Request $request)    {
        $id = $request->input('id');
        $ctr_code = $request->input('ctr_code');
        $ctr_cretransfer = $request->input('ctr_cretransfer');
        $ctr_gpatransfer = $request->input('ctr_gpatransfer');
        $ctr_cgpatransfer = $request->input('ctr_cgpatransfer');
        $ctr_min_percentage = $request->input('ctr_min_percentage');
        $ctr_max_percentage = $request->input('ctr_max_percentage');
        $ctr_grade = $request->input('ctr_grade');
        // $lastupdateon = $request->input('lastupdateon');
        // $lastupdateby = $request->input('lastupdateby');
        // $lastapproveon = $request->input('lastapproveon');
        // $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $mis_prm_cect = mis_prm_cect::where([['id','=',$id]]) -> update([
            // 'ctr_code' => $ctr_code,
            'ctr_cretransfer' => $ctr_cretransfer,
            'ctr_gpatransfer' => $ctr_gpatransfer,
            'ctr_cgpatransfer' => $ctr_cgpatransfer,
            'ctr_min_percentage' => $ctr_min_percentage,
            'ctr_max_percentage' => $ctr_max_percentage,
            'ctr_grade' => $ctr_grade,
            // 'lastupdateon' => $lastupdateon,
            // 'lastupdateby' => $lastupdateby,
            // 'lastapproveon' => $lastapproveon,
            // 'lastapproveby' => $lastapproveby,
            'recordstatus' => $recordstatus,
        ]);

        if ($mis_prm_cect)  {
            return response()->json([
                'success'=>true,
                'message'=>"Update Success!",
                'data' => $mis_prm_cect
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

    public function delete(Request $request)    {
        $id = $request->input('id');
        // $lastupdateon = $request->input('lastupdateon');
        // $lastupdateby = $request->input('lastupdateby');
        // $lastapproveon = $request->input('lastapproveon');
        // $lastapproveby = $request->input('lastapproveby');
        $recordstatus = $request->input('recordstatus');

        $mis_prm_cect = mis_prm_cect::where([['id','=',$id]]) -> update([
            // 'ctr_code' => $ctr_code,
            // 'lastupdateon' => $lastupdateon,
            // 'lastupdateby' => $lastupdateby,
            // 'lastapproveon' => $lastapproveon,
            // 'lastapproveby' => $lastapproveby,
            'recordstatus' => $recordstatus,
        ]);

        if ($mis_prm_cect)  {
            return response()->json([
                'success'=>true,
                'message'=>"Hapus Berjaya!",
                'data' => $mis_prm_cect
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
}
