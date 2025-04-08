<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\hep_caun_timetable;

class hep_caun_timetableController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function register(Request $request) {
        $fk_kaunselor = $request->input('fk_kaunselor');
        $counseling_day = $request->input('counseling_day');
        $coun_timeslot = $request->input('coun_timeslot');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_caun_timetable::create([
            'fk_kaunselor' => $fk_kaunselor,
            'counseling_day' => $counseling_day,
            'coun_timeslot' => $coun_timeslot,
            'recordstatus' => $recordstatus
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


    public function show(Request $request)  {
        $fac_id = $request->input('id_aduan');

        $hep_caun_timetableController = hep_caun_timetableController::where('id_aduan',$fac_id)->first();

        if ($hep_caun_timetableController)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$hep_caun_timetableController
            ],200);
        }
    }


    public function list(){
        $obj = hep_caun_timetable::SELECT('hep_caun_timetable.*','staff_name')
            ->leftjoin('hep_caun_kaunselor', 'hep_caun_kaunselor.pk_id', '=' , 'hep_caun_timetable.fk_kaunselor')
            ->where([['hep_caun_timetable.recordstatus','!=','DEL']]) -> get();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function update(Request $request){
        $id_timetable = $request->input('id_timetable');
        $fk_kaunselor = $request->input('fk_kaunselor');
        $counseling_day = $request->input('counseling_day');
        $coun_timeslot = $request->input('coun_timeslot');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_caun_timetable::where([['id_timetable','=',$id_timetable]]) -> update([
            'fk_kaunselor' => $fk_kaunselor,
            'counseling_day' => $counseling_day,
            'coun_timeslot' => $coun_timeslot,
            'recordstatus' => $recordstatus
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


    public function delete(Request $request){
        $recordstatus = $request->input('recordstatus');
        $id_timetable = $request->input('id_timetable');

        $obj = hep_caun_timetable::where('id_timetable',$id_timetable)-> update([
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


    // list by Kaunselor
    public function listByKaunselor($id){
        $obj = hep_caun_timetable::where([['fk_kaunselor',$id],['hep_caun_timetable.recordstatus','!=','DEL']])
            ->orderBy('coun_timeslot')
            ->get([
                'id_timetable',
                'counseling_day',
                'coun_timeslot'
            ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // list by Kaunselor & Day & status
    public function listByKaunDay(Request $request){
        $fk_kaunselor = $request->input('fk_kaunselor');
        $counseling_day = $request->input('counseling_day');

        $obj = hep_caun_timetable::where([
                ['fk_kaunselor', $fk_kaunselor],
                ['counseling_day', $counseling_day],
                ['recordstatus', '!=', 'DEL']
            ])
            ->orderBy('coun_timeslot')
            ->get([
                'id_timetable',
                'coun_timeslot'
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
